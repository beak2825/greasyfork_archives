// ==UserScript==
// @name         ChatGPTHelper
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  1) Real-Time Local Disk Storage: ChatGPTHelper automatically saves all your chat history and predefined prompts on your local disk as you go. 2) No Official History Required: You won't need to fine-tune it with official history data. Your information remains confidential, never used to train the model. 3) Offline Functionality: ChatGPTHelper makes the history still available when offline.
// @author       maple
// @match        https://chat.openai.com/*
// @grant        GM_xmlhttpRequest
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/475352/ChatGPTHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/475352/ChatGPTHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WEBREDIS_ENDPOINT = "http://127.0.0.1:7379";
    var thisInHistory = false;
    var HistoryPrefix = "HISTORY";
    var PromptPrefix = "USERPROMPT";
    var redisHistoryName = "";
    var generateButton = null;


    function load(key, callback) {
        key = encodeURIComponent(key);
        GM_xmlhttpRequest({
            method: "GET",
            url: `${WEBREDIS_ENDPOINT}/GET/${key}`,
            onload: function(response) {
                callback(null, JSON.parse(response.responseText));
            },
            onerror: function(error) {
                callback(error, null);
            }
        });
    }

    function getTime() {
        var d = new Date();
        var year = d.getFullYear();
        var month = (d.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so we add 1
        var day = d.getDate().toString().padStart(2, '0');
        var hours = d.getHours().toString().padStart(2, '0');
        var minutes = d.getMinutes().toString().padStart(2, '0');
        var seconds = d.getSeconds().toString().padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }

    function save(nameprefix, data, callback) {
        var strdata;
        var dname;
        var redisname;
        var currentTimestamp = getTime();
        if (Array.isArray(data)) {// history
            strdata = JSON.stringify(data.map(function(element) {
                return element.innerHTML;
            }));
            dname = data[0].innerText.substring(0, 100).trim();
            if (redisHistoryName == ""){
                redisHistoryName = encodeURIComponent(nameprefix + currentTimestamp + "\n" + dname);
            }
            redisname = redisHistoryName
        } else {//prompt
            strdata = JSON.stringify(data);
            dname = data.substring(0, 100).trim();
            redisname = encodeURIComponent(nameprefix + currentTimestamp + "\n" + dname);
        }
        if (strdata && strdata.length < 3){
            return;
        }

        console.log(redisname);
        GM_xmlhttpRequest({
            method: "GET",
            url: `${WEBREDIS_ENDPOINT}/SET/${redisname}/${encodeURIComponent(strdata)}`,
            onload: function(response) {
                console.log(response);
                callback(null, response.responseText);
            },
            onerror: function(error) {
                console.log(error);
                callback(error, null);
            }
        });
    }

    function remove(key, callback) {
        key = encodeURIComponent(key);
        GM_xmlhttpRequest({
            method: "GET",
            url: `${WEBREDIS_ENDPOINT}/DEL/${key}`,
            onload: function(response) {
                callback(null, JSON.parse(response.responseText));
            },
            onerror: function(error) {
                callback(error, null);
            }
        });
    }


    function getAllRedisKeys(callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `${WEBREDIS_ENDPOINT}/KEYS/*`, // Update this to your actual endpoint
            onload: function(response) {
                if (response.responseText == undefined){
                    redisError();
                    return;
                }
                callback(null, JSON.parse(response.responseText));
            },
            onerror: function(error) {
                callback(error, null);
            }
        });
    }


    function getCurrentDialogContent() {
        // Get all div elements with the specified class
        const divsWithSpecificClass = document.querySelectorAll('div.flex.flex-grow.flex-col.gap-3.max-w-full');
        // Create an array to store the text content of each div
        const divTexts = [];

        // Loop through the NodeList and get the text content of each div
        divsWithSpecificClass.forEach(div => {
            var textContent = [];
            divTexts.push(div);
        });

        // Return the array of text contents
        return divTexts;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function showHistory(dataList) {
        var targetDiv = document.querySelector('div.flex-1.overflow-hidden > div > div > div');


        dataList.forEach(data => {
            var newDiv = document.createElement('div');
            newDiv.textContent = data;
            targetDiv.appendChild(newDiv);
        });
    }

    function makeAGroup(name, keys, elementfilter, clickcallback){
        const div = document.createElement('div');
        div.style.padding = "5px"
        const ul = document.createElement('ul');
        ul.style.overflowY = 'auto';
        ul.style.maxHeight = '500px';
        var eid = "myUl" + name
        div.id = eid; // Setting an ID to the ul element
        var h2 = document.createElement('h2');
        h2.innerText = name;
        h2.style.color = 'white';
        h2.style.textAlign = "center";
        div.append(h2);
        for (let i = 0; i < keys.length; i++) {
            const li = document.createElement('li');
            if(!keys[i].startsWith(elementfilter)){
                continue;
            }
            var parts = keys[i].substring(elementfilter.length, keys[i].length).split("\n");
            var p = document.createElement('p');
            p.innerText = parts[1];
            p.style.lineHeight = '0.9';
            p.style.fontSize = '10pt';
            //p.style.whiteSpace = 'pre-line';
            //p.style.wordWrap = 'break-word';
            p.style.wordBreak = 'break-all';
            li.innerHTML = `<p style="color: grey; font-size: 5pt;">${parts[0]}</p>`;
            li.appendChild(p);
            li.style.color = '#dddddd';
            // Apply CSS styles for the rounded rectangle
            li.style.border = '1px solid #333333'; // Add a border
            li.style.borderRadius = '10px'; // Adjust the horizontal and vertical radii to create rounded corners
            li.style.padding = '10px'; // Add some padding to make it visually appealing
            li.style.position = 'relative';
            li.style.marginBottom = '4px';
            li.addEventListener('mouseenter', function() {
                li.style.backgroundColor = 'rgba(100, 100, 100, 0.8)'; // Change to your desired background color
            });

            li.addEventListener('mouseleave', function() {
                li.style.backgroundColor = ''; // Reset to the original background color
            });
            li.addEventListener('click', (event) => {clickcallback(event, keys[i]);});

            // add close
            // Create close button
            var closeButton = document.createElement('span');
            closeButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" <g style="fill:none;stroke:#aaa;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2"><path d="m31 16v-4h10v4"/><path d="m51 25v31c0 2.2091-1.7909 4-4 4h-22c-2.2091 0-4-1.7909-4-4v-31"/><path d="m17 16h38v4h-38z"/><path d="m41 28.25v26.75"/><path d="m31 28.25v26.75"/></g></svg>';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '6px';
            closeButton.style.right = '5px';
            closeButton.style.color = 'white';
            closeButton.style.cursor = 'pointer'; // Set cursor to pointer to indicate it's clickable

            // Add event listener for the close button
            closeButton.addEventListener('click', async (event) => {
                // Your callback function here
                event.stopPropagation();
                remove(keys[i], function (){});
                await sleep(500);
                InitPanel();
            });

            // Add close button to li
            li.appendChild(closeButton);
            ul.appendChild(li);
        }
        div.append(ul);
        return div;
    }


    async function InitPanel() {

        getAllRedisKeys(function(error, data) {
            if (error) {
                redisError();
                console.error('An error occurred:', error);
                return;
            }
            const ol = document.querySelectorAll('ol')[2];
            var div = document.querySelectorAll('div.flex-shrink-0.overflow-x-hidden')[0];
            const ulExisting = document.getElementById('myUlHistory');
            if (ulExisting) {
                div.removeChild(ulExisting, function (){});
            }
            if (data.KEYS.length == 0){
                redisError();
            }
            var ul = makeAGroup("History", data.KEYS.sort().reverse(), HistoryPrefix, function(event, key) {
                //console.log('Item clicked:', data.KEYS[i]);
                // Load data after saving
                load(key, function(err, data) {
                    if (err) return console.error(err);
                    var myList = JSON.parse(data.GET);
                    if (Array.isArray(myList)){
                        for (let i = 0; i < myList.length; i++) {
                            if (i % 2 == 0) {
                                myList[i] = "👨: " + myList[i].replace(/\n/g, '<br>');
                            } else {
                                myList[i] = "🤖: " + myList[i].replace(/\n/g, '<br>');
                            }
                        }
                        showHistoryLog(myList.join("<br>"));
                    }
                });
            });
            div.prepend(ul);

            /*---Prompt---*/
            var ulPrompt = document.getElementById('myUlPrompt');
            if (ulPrompt) {
                div.removeChild(ulPrompt);
            }
            var prompt = makeAGroup("Prompt", data.KEYS.sort().reverse(), PromptPrefix, function(event, key) {
                //console.log('Item clicked:', data.KEYS[i]);
                // Load data after saving
                load(key, function(err, data) {
                    if (err) return console.error(err);
                    var prompt = JSON.parse(data.GET);
                    var textarea = document.getElementById('prompt-textarea');
                    textarea.value = prompt;
                    var event = new Event('input', { bubbles: true });
                    textarea.dispatchEvent(event);
                    textarea.focus();
                    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
                    textarea.scrollTop = textarea.scrollHeight;
                    console.log("in chaning", prompt, textarea);
                });
            });
            div.prepend(prompt);
            if (!ulPrompt) {
                var textarea = document.getElementById('prompt-textarea');
                var button = document.createElement('button');
                button.innerHTML = '<svg height="25" viewBox="0 0 1792 1792" width="25" xmlns="http://www.w3.org/2000/svg" stroke="#bbbbbb"><path d="M512 1536h768v-384h-768v384zm896 0h128v-896q0-14-10-38.5t-20-34.5l-281-281q-10-10-34-20t-39-10v416q0 40-28 68t-68 28h-576q-40 0-68-28t-28-68v-416h-128v1280h128v-416q0-40 28-68t68-28h832q40 0 68 28t28 68v416zm-384-928v-320q0-13-9.5-22.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 22.5v320q0 13 9.5 22.5t22.5 9.5h192q13 0 22.5-9.5t9.5-22.5zm640 32v928q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1344q0-40 28-68t68-28h928q40 0 88 20t76 48l280 280q28 28 48 76t20 88z" fill="#bbbbbb"/></svg>';
                //button.style.color = 'white';
                button.style.position = 'absolute';
                button.style.right = '60px';
                button.style.top = '20px';
                button.style.textAlign = 'center';
                //button.style.border = '1px solid grey';
                button.style.marginLeft = '10px';
                //button.style.backgroundColor = '#268BD2';
                //var bottomdiv = document.querySelectorAll('div.relative.pb-3.pt-2.text-center.text-xs.text-gray-600')[0];
                //bottomdiv.appendChild(button);
                button.title = 'Save the message as a prompt';

                textarea.parentNode.appendChild(button);

                button.addEventListener('click', function() {
                    var textarea = document.getElementById('prompt-textarea');
                    save(PromptPrefix, textarea.textContent, function(err, response) {
                        if (err) return console.error(err);
                });

                InitPanel();
            });
            }


        });
        /*Remote Offical*/
        await sleep(2000);
        const olElements = document.querySelectorAll('ol');
        olElements.forEach(ol => {
            // First remove all existing children
            while (ol.firstChild) {
                ol.removeChild(ol.firstChild);
            }
        });

    }

    function redisError(){
        var div = document.querySelectorAll('div.flex-shrink-0.overflow-x-hidden')[0];
        const ul = document.createElement('ul');
        div.prepend(ul);
        const li = document.createElement('li');
        li.textContent = "There is no record. Please verify if webdis AND redis-server has been started! Just run `webdis.sh start` to start.";
        li.style.color = 'white';
        ul.appendChild(li);
    }

    function showHistoryLog(text) {
        // Check if the div with a specific id already exists
        var existingDiv = document.getElementById('historyLog');

        if (existingDiv) {
            // If the div exists, update the messageSpan's HTML content
            var messageSpan = existingDiv.querySelector('.message-span');
            if (messageSpan) {
                messageSpan.innerHTML = text;
            }
            existingDiv.style.display = '';
        } else {
            // If the div doesn't exist, create a new div and append it to the body
            var hoverBox = document.createElement('div');
            hoverBox.id = 'historyLog'; // Set a unique id for the div
            hoverBox.style.position = 'fixed';
            hoverBox.style.top = '50%';
            hoverBox.style.left = '50%';
            hoverBox.style.transform = 'translate(-50%, -50%)';
            hoverBox.style.zIndex = '10000';
            hoverBox.style.padding = '10px';
            hoverBox.style.width = '1000px';
            hoverBox.style.height = '800px';
            hoverBox.style.backgroundColor = 'white';
            hoverBox.style.border = '1px solid black';
            hoverBox.style.borderRadius = '5px';
            hoverBox.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
            hoverBox.style.overflow = 'hidden'; // Hide content overflow

            // Create a container div for the content and close button
            var contentContainer = document.createElement('div');
            contentContainer.style.overflowY = 'auto'; // Make content scrollable
            //contentContainer.style.resize = 'both'; // Enable resizing
            contentContainer.style.height = 'calc(100% - 40px)'; // Adjust height for close button

            // Create a span element to hold the message
            var messageSpan = document.createElement('span');
            messageSpan.innerHTML = text;
            messageSpan.className = 'message-span'; // Add a class for easy selection
            messageSpan.style.display = 'block';
            messageSpan.style.marginTop = '20px';

            // Create a button element to close the hover box
            var closeButton = document.createElement('button');
            closeButton.textContent = '✖';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
            closeButton.addEventListener('click', function () {
                hoverBox.style.display = 'none';
            });

            // Add the message span and close button to the content container
            contentContainer.appendChild(messageSpan);
            contentContainer.appendChild(closeButton);

            // Add the content container to the hover box
            hoverBox.appendChild(contentContainer);

            document.addEventListener('click', function (event) {
                if (!hoverBox.contains(event.target) && event.target !== hoverBox) {
                    hoverBox.style.display = 'none';
                    event.stopPropagation();
                }
            });

            // Add the hover box to the body of the document
            document.body.appendChild(hoverBox);
        }
    }

    async function saveHistory(){
        while(true){
            var thisdialog = getCurrentDialogContent();
            save(HistoryPrefix, thisdialog, function(err, response) {
                if (err) return console.error(err);
                console.log('Save response:', response);
                if(!thisInHistory){
                    InitPanel();
                    thisInHistory = true;
                }
            });
            const divElement = document.querySelector('div.flex.items-center.md\\:items-end');
            if (divElement != undefined && divElement.textContent != undefined && divElement.textContent == 'Continue generating'){
                var continueButton = divElement.getElementsByTagName('button')[0];
                continueButton.click();
            }
            else if (divElement == undefined || divElement.textContent == undefined || divElement.textContent != 'Stop generating'){
                break;
            }
            if (divElement != undefined && generateButton == null){
                generateButton = divElement;
                generateButton.addEventListener('click', () => {
                    saveHistory();
                });
            }
            await sleep(2000);
        }
    }






    InitPanel();




    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || (event.metaKey && event.key === 'r')) {
            // Usage examples
            saveHistory();
        }
        if (event.key === 'Escape') {
            var existingDiv = document.getElementById('historyLog');
            if (existingDiv) {
                existingDiv.style.display = 'none';
            }
        }
    });






})();
