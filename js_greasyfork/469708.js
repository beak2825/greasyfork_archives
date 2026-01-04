// ==UserScript==
// @name         Youtube get emails
// @version      1.1
// @description  Tampermonkey script for importing CSV to web forms. Set desired @match and configure events functions. Credit by Konrad "Tree" Słotwiński
// @author       Ken Kwok
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @license      MIT
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/469708/Youtube%20get%20emails.user.js
// @updateURL https://update.greasyfork.org/scripts/469708/Youtube%20get%20emails.meta.js
// ==/UserScript==

const CSVI_STORE = "csvi_store";
const CSVI_STATUS = "csvi_status";

const CSVI_EVENT_IMPORT = "csvi_import";
const CSVI_EVENT_RECORD = "csvi_record";
const CSVI_EVENT_STATUS = "csvi_status";
const EMAIL_COPY = "copied_email";
function tempAlert(msg,duration)
{
    var el = document.createElement("div");
    el.setAttribute("style","position:absolute;top:0;left:10%;background-color:white;font-size:16px;font-weight: bold;z-index:999999;");
    el.innerHTML = msg;
    setTimeout(function(){
        el.parentNode.removeChild(el);
    },duration);
    document.body.appendChild(el);
}
if(window.location.href == 'https://www.youtube.com/')
{
    async function sleep(ms = 1000)
    {
        return new Promise(r => setTimeout(r, ms));
    }

    async function processData(data)
    {
        await sleep(1000);
        for (const row of data) {
            if(!row[0])
            {
                continue;
            }
            console.log(row);
            var url = row[2];
            var cleanUrl = url.replace(/\?.*/, '');
            var email = '';
            cleanUrl = cleanUrl.replace(/\b\/featured\b|\b\/featured\/\b/, '/');
            if (cleanUrl.includes('/channel/') || url.includes('/c/') || url.includes('/user/') || url.includes('/@')) {
                if(cleanUrl.endsWith('/'))
                {
                    cleanUrl = cleanUrl + 'about/'
                }
                else
                {
                    cleanUrl = cleanUrl + '/about/'
                }
                GM_openInTab(cleanUrl);
                await sleep(9000);
                email = await GM_getValue(EMAIL_COPY);
                row.push(email);
            }
            tempAlert(`URL: ${cleanUrl}<br>Email: ${email}`, 3000);
            GM_setValue(EMAIL_COPY, "");
        }
        console.log('out sync');
        let csvContent = "data:text/csv;charset=utf-8,";

        data.forEach(function(rowArray) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });
        var encodedUri = encodeURI(csvContent);
        GM_openInTab(encodedUri);
    }

    document.addEventListener(CSVI_EVENT_IMPORT, function (e) {
        //Custom event after CSV import
        let data = GM_getValue(CSVI_STORE);
        processData(data);
    });

    document.addEventListener(CSVI_EVENT_RECORD, function (e) {
        // Custom event on record import
        alert(`CSVI Importing: (${e.detail.store}) ${e.detail.record}`);
        GM_setValue(CSVI_STATUS, 1);
        console.log(e);
    });

    document.addEventListener(CSVI_EVENT_STATUS, function (e) {
        // Custom event on set status
        alert(`CSVI Status: ${e.detail.status}`);
        GM_setValue(CSVI_STATUS, 0);
    });

    (function () {
        'use strict';
        const data = GM_getValue(CSVI_STORE);
        const status = GM_getValue(CSVI_STATUS);
        if (status) {
            document.dispatchEvent(new CustomEvent(CSVI_EVENT_STATUS, {
                detail: {status: status}
            }));
        } else {
            let div = document.createElement("div");
            let description = document.createElement("div");
            let input = document.createElement("input");
            input.type = "file";
            description.innerText = 'It takes three columns (Cat|Name|Youtube) and first row won\'t be read.'
            Object.assign(div.style, {
                display: "block",
                position: "relative",
                background:"black",
                "z-index": 10000,
                color:'white',
                "font-size": "16px"
            });
            input.addEventListener("input", function (value) {
                let reader = new FileReader();
                reader.readAsText(value.target.files[0]);
                reader.onload = function () {
                    GM_setValue(CSVI_STORE, CSVToArray(reader.result));
                    document.dispatchEvent(new Event(CSVI_EVENT_IMPORT))
                };
            });
            div.append(description);
            div.append(input);
            document.body.prepend(div);
        }
    })();

    function CSVToArray(data, delimiter = ",") {
        let objPattern = new RegExp(`(\\${delimiter}|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\"\\${delimiter}\\r\\n]*))`, "gi");
        let arrMatches = null;
        let count = 0;
        let array;
        while (arrMatches = objPattern.exec(data)) {
            let strMatchedDelimiter = arrMatches[1];
            let strMatchedValue;
            if (strMatchedDelimiter.length && strMatchedDelimiter !== delimiter) {
                count++;
                if(count == 1)
                {
                    array = [];
                }
                if(count > 0)
                {
                    array.push([]);
                }
            }
            if(count > 0)
            {
                if (arrMatches[2]) {
                    strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
                } else {
                    strMatchedValue = arrMatches[3];
                }
                array[array.length - 1].push(strMatchedValue);
            }
        }
        return array;
    }
}
else if(window.location.href.endsWith('/about/') || window.location.href.endsWith('/about'))
{
    console.log('I am here');
    const target = 'ytd-item-section-renderer';
    const emailRegex = /[\w\d._%+-]+@[\w\d.-]+\.[\w]{2,}/g;
    let win = window.open("","_self");
    let close
    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (!mutation.addedNodes){
                return
            }

            for (let i = 0; i < mutation.addedNodes.length; i++)
            {
                // do things to your newly added nodes here
                let node = mutation.addedNodes[i];
                if(node.innerHTML)
                {
                    var wrapper = document.createElement('div');
                    wrapper.innerHTML= node.innerHTML;
                    var thisEle = wrapper.firstChild;
                    var thisClass = thisEle.className;
                    if(thisClass)
                    {
                        if(typeof thisClass == 'string')
                        {
                            if(thisClass.includes(target))
                            {
                                var innerText = thisEle.innerText;
                                console.log(innerText);
                                var match = innerText.match(emailRegex);
                                if (match) {
                                    var fullAddress = match[0];
                                    GM_setValue(EMAIL_COPY, fullAddress);
                                }
                            }
                        }
                    }
                }
            }
        })
        setTimeout(()=>win.close(), 3000);
    });
    observer.observe(document.body, {
        childList: true
        , subtree: true
        , attributes: false
        , characterData: false
    })
}