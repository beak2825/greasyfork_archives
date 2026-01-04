// ==UserScript==
// @name         leetcode2notion
// @namespace    wuyifff
// @version      1.2
// @description  Save LeetCode problems to Notion after clicking a button.
// @author       wuyifff
// @match        https://leetcode.cn/problems/*
// @match        https://leetcode.com/problems/*
// @connect      api.notion.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @homepage     https://github.com/wuyifff/leetcode2notion
// @downloadURL https://update.greasyfork.org/scripts/507388/leetcode2notion.user.js
// @updateURL https://update.greasyfork.org/scripts/507388/leetcode2notion.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // replace to your own token and ID
    const notionToken = '';  // Notion API token
    const databaseId = '';  // Notion database ID

    // 1. add save button
    // select language button (optional)
    let currentMinutes = 0;
    let currentSeconds = 0;
    function addUIElements() {
        // 1.1 save button
        const button = document.createElement("button");
        button.innerHTML = "Save to Notion";
        button.style.position = "fixed";
        button.style.bottom = "10px";
        button.style.right = "10px";
        button.style.zIndex = 1000;
        button.style.padding = "10px 20px";
        button.style.backgroundColor = "#4CAF50";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.onclick = saveProblemToNotion;

        // 1.2 save language button (disabled)
        const select = document.createElement("select");
        select.id = "languageSelect";
        select.style.position = "fixed";
        select.style.bottom = "50px";
        select.style.right = "10px";
        select.style.zIndex = 1000;
        select.style.padding = "10px";
        select.style.backgroundColor = "#4CAF50";
        select.style.color = "white";
        select.style.border = "none";
        select.style.borderRadius = "5px";
        select.style.cursor = "pointer";
        const optionPython = document.createElement("option");
        optionPython.value = "python";
        optionPython.innerText = "Python";
        const optionCpp = document.createElement("option");
        optionCpp.value = "cpp";
        optionCpp.innerText = "C++";
        select.appendChild(optionPython);
        select.appendChild(optionCpp);

        const container = document.createElement("div");
        container.id = "save"
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.alignItems = "center";
        container.style.marginLeft = "10px";
        //container.appendChild(select);
        container.appendChild(button);
        container.style.position = "fixed";
        container.style.bottom = "10px";
        container.style.right = "10px";
        document.body.appendChild(container);
    }
    function addTimer() {
        // Create timer span if it doesn't exist
        let timerSpan = document.querySelector('#timerSpan');
        if (!timerSpan) {
            timerSpan = document.createElement("span");
            timerSpan.id = "timerSpan";
            timerSpan.className = 'ml-2 group/nav-back cursor-pointer gap-2 hover:text-lc-icon-primary dark:hover:text-dark-lc-icon-primary flex items-center h-[32px] transition-none hover:bg-fill-quaternary dark:hover:bg-fill-quaternary text-gray-60 dark:text-gray-60 px-2';

            // Append the timer span to the target location
            const targetDiv = document.getElementById('ide-top-btns');
            if (targetDiv) {
                targetDiv.appendChild(timerSpan);
                console.log("append timer success");
            } else {
                console.log("no ide-top-btns element!");
            }
        }
    }

    function updateTimer() {
        const now = new Date().getTime();  // Get the current time
        const elapsedTime = now - startTime;  // Calculate the elapsed milliseconds
        const totalSeconds = Math.floor(elapsedTime / 1000);  // Convert to seconds
        currentMinutes = Math.floor(totalSeconds / 60);
        currentSeconds = totalSeconds % 60;
        const formattedMinutes = currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes;
        const formattedSeconds = currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds;

        // Make sure timerSpan is available
        let timerSpan = document.querySelector('#timerSpan');
        if (!timerSpan) {
            addTimer();
            timerSpan = document.querySelector('#timerSpan'); // Re-select after creation
        }

        // Update the timer content
        timerSpan.textContent = `Time: ${formattedMinutes}:${formattedSeconds}`;
    }

    // 2. get leetcode problem info
    function getProblemData() {
        const title = document.querySelector('.text-title-large a')?.innerText || 'No title found';
        const difficultyElement = document.querySelector("div[class*='text-difficulty-']");
        const difficulty = difficultyElement ? difficultyElement.innerText : 'No difficulty found';
        const url = window.location.href;
        const tagElements = document.querySelectorAll("a[href*='/tag/']");
        const tagTexts = Array.from(tagElements).map(element => element.innerText);

        const codeDiv = document.querySelector('.view-lines.monaco-mouse-cursor-text[role="presentation"]');
        let codeText = '';
        if (codeDiv) {
            const codeLines = codeDiv.querySelectorAll('div');
            codeText = Array.from(codeLines).map(line => line.innerText).join('\n');
        } else {
            codeText = 'No code found';
        }
        //console.log(codeText);
        //const selectedLanguage = document.getElementById("languageSelect").value;
        const selectedLanguage = 'python';
        return {
            title: title,
            difficulty: difficulty,
            url: url,
            tag: tagTexts,
            code: codeText,
            language: selectedLanguage,
            time: currentMinutes
        };
    }

    // 3. save to notion and check if duplicate
    async function saveProblemToNotion() {
        const problemData = getProblemData();
        console.log(problemData);

        const searchUrl = `https://api.notion.com/v1/search`;
        const searchBody = {
            "query": problemData.title,
            "filter": {
                "value": "page",
                "property": "object"
            },
            "sort": {
                "direction": "ascending",
                "timestamp": "last_edited_time"
            }
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: searchUrl,
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            data: JSON.stringify(searchBody),
            onload: function(searchResponse) {
                if (searchResponse.status === 200) {
                    const searchResult = JSON.parse(searchResponse.responseText);
                    const existingPage = searchResult.results.find(result => result.properties?.Title?.title[0]?.text?.content === problemData.title);

                    if (existingPage) {
                        const existingPageUrl = existingPage.url;
                        alert('Problem already exists in Notion! Opening existing page...');
                        window.open(existingPageUrl, '_blank');
                    } else {
                        createNewNotionPage(problemData);
                    }
                } else {
                    console.error('Error searching Notion database', searchResponse.responseText);
                    alert('Failed to search Notion database. Check the console for details.');
                }
            },
            onerror: function(error) {
                console.error('Error in searching Notion database', error);
                alert('An error occurred while searching Notion database.');
            }
        });
    }

    // 4. create new page
    function createNewNotionPage(problemData) {
        const tags = problemData.tag.map(tag => ({
            name: tag
        }));

        const url = `https://api.notion.com/v1/pages`;
        const body = {
            parent: { database_id: databaseId },
            properties: {
                'Title': {
                    title: [
                        {
                            text: {
                                content: problemData.title
                            }
                        }
                    ]
                },
                'Difficulty': {
                    select: {
                        name: problemData.difficulty
                    }
                },
                'Link': {
                    url: problemData.url
                },
                'Date': {
                    date: {
                        start: new Date().toISOString().split('T')[0] // format YYYY-MM-DD
                    }
                },
                'Tags': {
                    multi_select: tags
                },
                'Time': {
                    number: problemData.time
                },
            },
            children: [
                {
                    object: 'block',
                    type: 'code',
                    code: {
                        rich_text: [
                            {
                                type: 'text',
                                text: {
                                    content: problemData.code
                                }
                            }
                        ],
                        language: problemData.language
                    }
                }
            ]
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            data: JSON.stringify(body),
            onload: function(response) {
                if (response.status === 200) {
                    const responseData = JSON.parse(response.responseText);
                    const notionPageUrl = responseData.url;
                    alert('Problem saved to Notion!');
                    window.open(notionPageUrl, '_blank');
                } else {
                    console.error('Failed to save to Notion', response.responseText);
                    alert('Failed to save to Notion. Check the console for more details.');
                }
            },
            onerror: function(error) {
                console.error('Error in saving to Notion', error);
                alert('An error occurred while saving to Notion.');
            }
        });
    }

    addUIElements();
    let startTime;  // Record the start time
    setTimeout(function() {
        startTime = new Date().getTime();
        var tmp = setInterval(updateTimer, 1000);  // update every second
    }, 5000);  // delay 5 seconds
})();
