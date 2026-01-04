// ==UserScript==
// @name         Webpage Source Viewer and API Data Fetcher
// @namespace    https://greasyfork.org/en/users/1391731-ramen-sukuna
// @version      2.1
// @description  Fetch, display, and improve HTML, CSS, JavaScript, or API data of a webpage with a clean white theme. Now supports various API response types.
// @author       Ramen Sukuna🍜
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @icon         https://attic.sh/nvbu08kd47uzl3mf9cpisiazptio
// @downloadURL https://update.greasyfork.org/scripts/520035/Webpage%20Source%20Viewer%20and%20API%20Data%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/520035/Webpage%20Source%20Viewer%20and%20API%20Data%20Fetcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const guiHTML = `
        <div id="sourceViewer" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:80%; height:80%; background:white; color:black; border:2px solid black; z-index:9999; overflow:auto; padding:10px; display:none; font-family: Arial, sans-serif; border-radius:15px;">
            <button id="closeSourceViewer" style="position:absolute; top:5px; right:5px; background:white; color:black; border:1px solid black; border-radius:10px;">Close</button>
            <h3>Webpage Source Viewer</h3>
            <label>Enter URL:</label>
            <input type="text" id="sourceUrl" style="width:50%; color:black; background:white; border:1px solid black; border-radius:5px;" placeholder="e.g., https://example.com">
            <br><br>
            <label>API URL (Optional):</label>
            <input type="text" id="apiUrl" style="width:50%; color:black; background:white; border:1px solid black; border-radius:5px;" placeholder="e.g., https://api.example.com/data">
            <br><br>
            <label>Find:</label>
            <input type="text" id="findText" style="width:30%; color:black; background:white; border:1px solid black; border-radius:5px;" placeholder="Text to find">
            <span style="margin:0 10px;">to</span>
            <label>Replace:</label>
            <input type="text" id="replaceText" style="width:30%; color:black; background:white; border:1px solid black; border-radius:5px;" placeholder="Text to replace with">
            <br><br>
            <button id="fetchSource" style="background:white; color:black; border:1px solid black; border-radius:5px;">Fetch Source</button>
            <button id="fetchApiData" style="background:white; color:black; border:1px solid black; border-radius:5px;">Fetch API Data</button>
            <button id="replaceSourceText" style="background:white; color:black; border:1px solid black; border-radius:5px;">Replace Text</button>
            <button id="improveSource" style="background:white; color:black; border:1px solid black; border-radius:5px;">Improve💪</button>
            <hr>
            <div id="sourceResults">
                <h4>HTML</h4>
                <textarea id="htmlSource" style="width:100%; height:150px; background:white; color:black; border:1px solid black; border-radius:5px;" readonly></textarea>
                <button class="copyButton" data-target="htmlSource" style="background:white; color:black; border:1px solid black; border-radius:5px;">Copy HTML</button>
                <h4>CSS</h4>
                <textarea id="cssSource" style="width:100%; height:150px; background:white; color:black; border:1px solid black; border-radius:5px;" readonly></textarea>
                <button class="copyButton" data-target="cssSource" style="background:white; color:black; border:1px solid black; border-radius:5px;">Copy CSS</button>
                <h4>JavaScript</h4>
                <textarea id="jsSource" style="width:100%; height:150px; background:white; color:black; border:1px solid black; border-radius:5px;" readonly></textarea>
                <button class="copyButton" data-target="jsSource" style="background:white; color:black; border:1px solid black; border-radius:5px;">Copy JavaScript</button>
                <h4>API Data</h4>
                <textarea id="apiData" style="width:100%; height:150px; background:white; color:black; border:1px solid black; border-radius:5px;" readonly></textarea>
                <button class="copyButton" data-target="apiData" style="background:white; color:black; border:1px solid black; border-radius:5px;">Copy API Data</button>
            </div>
        </div>
        <button id="openSourceViewer" style="position:fixed; bottom:10px; right:10px; background:white; color:black; border:1px solid black; z-index:9999; border-radius:5px;">View Source</button>
    `;
    document.body.insertAdjacentHTML('beforeend', guiHTML);

    GM_addStyle(`
        #sourceViewer textarea {
            font-family: monospace;
        }
        #sourceViewer button {
            margin: 5px;
        }
        #openSourceViewer {
            border-radius: 5px;
        }
        #sourceViewer {
            cursor: move;
        }
    `);

    const sourceViewer = document.getElementById('sourceViewer');
    const openButton = document.getElementById('openSourceViewer');
    const closeButton = document.getElementById('closeSourceViewer');
    const fetchButton = document.getElementById('fetchSource');
    const fetchApiButton = document.getElementById('fetchApiData');
    const replaceButton = document.getElementById('replaceSourceText');
    const improveButton = document.getElementById('improveSource');

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    openButton.addEventListener('click', () => {
        sourceViewer.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        sourceViewer.style.display = 'none';
    });

    fetchButton.addEventListener('click', () => {
        const url = document.getElementById('sourceUrl').value;
        if (!url) {
            alert('Please enter a URL!');
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                document.getElementById('htmlSource').value = response.responseText;
                const stylesheets = Array.from(doc.querySelectorAll('link[rel="stylesheet"], style'));
                const css = stylesheets.map(sheet => sheet.outerHTML).join('\n');
                document.getElementById('cssSource').value = css;
                const scripts = Array.from(doc.querySelectorAll('script')).map(script => script.outerHTML).join('\n');
                document.getElementById('jsSource').value = scripts;
            },
            onerror: function () {
                alert('Failed to fetch the webpage. Please check the URL and try again.');
            }
        });
    });

    fetchApiButton.addEventListener('click', () => {
        const apiUrl = document.getElementById('apiUrl').value;
        if (!apiUrl) {
            alert('Please enter an API URL!');
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function (response) {
                const contentType = response.responseHeaders.match(/Content-Type:\s*([^;]*)/i);
                const contentTypeValue = contentType ? contentType[1].toLowerCase() : '';

                let displayContent = response.responseText;
                if (contentTypeValue.includes('json')) {
                    try {
                        displayContent = JSON.stringify(JSON.parse(response.responseText), null, 2);
                    } catch (error) {
                        displayContent = 'Invalid JSON response.';
                    }
                } else if (contentTypeValue.includes('html')) {
                    displayContent = response.responseText;
                } else if (contentTypeValue.includes('xml')) {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(response.responseText, 'application/xml');
                    displayContent = new XMLSerializer().serializeToString(xmlDoc);
                }

                document.getElementById('apiData').value = displayContent;
            },
            onerror: function () {
                alert('Failed to fetch the API data. Please check the API URL and try again.');
            }
        });
    });

    replaceButton.addEventListener('click', () => {
        const findText = document.getElementById('findText').value;
        const replaceText = document.getElementById('replaceText').value;

        if (!findText) {
            alert('Please enter text to find!');
            return;
        }

        ['htmlSource', 'cssSource', 'jsSource', 'apiData'].forEach((id) => {
            const textarea = document.getElementById(id);
            textarea.value = textarea.value.split(findText).join(replaceText);
        });

        alert(`Replaced all occurrences of "${findText}" with "${replaceText}".`);
    });

    improveButton.addEventListener('click', async () => {
        alert('Improvement feature is in progress...');

        const htmlSource = document.getElementById('htmlSource').value;
        const cssSource = document.getElementById('cssSource').value;
        const jsSource = document.getElementById('jsSource').value;

        const combinedCode = `
            HTML:
            ${htmlSource}
            
            CSS:
            ${cssSource}
            
            JavaScript:
            ${jsSource}
        `;

        try {
            const improvedCode = await improveCode(combinedCode);
            
            const { improvedHtml, improvedCss, improvedJs } = improvedCode;

            document.getElementById('htmlSource').value = improvedHtml;
            document.getElementById('cssSource').value = improvedCss;
            document.getElementById('jsSource').value = improvedJs;
            alert('Code improved successfully!');
        } catch (error) {
            console.error('Error improving the code:', error);
            alert('Error improving the code.');
        }
    });

    async function improveCode(code) {
        const apiKey = "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";
        const model = "gpt-4";

        const prompt = `
            You are an expert in improving code. Please improve the following code. Make it more efficient, readable, and modern.
            
            HTML:
            ${code.split('HTML:')[1].split('CSS:')[0].trim()}
            
            CSS:
            ${code.split('CSS:')[1].split('JavaScript:')[0].trim()}
            
            JavaScript:
            ${code.split('JavaScript:')[1].trim()}
        `;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: 'You are an expert coder.' },
                    { role: 'user', content: prompt },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to improve the code');
        }

        const data = await response.json();
        
        const improvedHtml = data.choices[0].message.content.split('HTML:')[1].split('CSS:')[0].trim();
        const improvedCss = data.choices[0].message.content.split('CSS:')[1].split('JavaScript:')[0].trim();
        const improvedJs = data.choices[0].message.content.split('JavaScript:')[1].trim();

        return { improvedHtml, improvedCss, improvedJs };
    }

    document.querySelectorAll('.copyButton').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const textarea = document.getElementById(targetId);
            textarea.select();
            document.execCommand('copy');
            alert(`${targetId} copied!`);
        });
    });

    sourceViewer.addEventListener('mousedown', (event) => {
        isDragging = true;
        offsetX = event.clientX - sourceViewer.getBoundingClientRect().left;
        offsetY = event.clientY - sourceViewer.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            sourceViewer.style.left = `${event.clientX - offsetX}px`;
            sourceViewer.style.top = `${event.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

})();