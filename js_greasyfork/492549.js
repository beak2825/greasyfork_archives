// ==UserScript==
// @name         Color-Coded Data Extraction and Display with Exclusions and JSON
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Extract data with specific color coding and exclusions
// @author       Errornulltag
// @match        https://hd2galaxy.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/492549/Color-Coded%20Data%20Extraction%20and%20Display%20with%20Exclusions%20and%20JSON.user.js
// @updateURL https://update.greasyfork.org/scripts/492549/Color-Coded%20Data%20Extraction%20and%20Display%20with%20Exclusions%20and%20JSON.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const webhookUrl = 'https://discord.com/api/webhooks/1226750345494003762/vYV5QIo63gxkfAHtV1bK2s3yaq5vlWacWV4IYdHPDE_FNFG-kppVxcw6nTOU5isdd10a';

    let title = document.createElement('div');
    title.textContent = "ErrorNullTag's Tool";
    title.style.color = 'lightblue';
    title.style.fontWeight = 'bold';
    title.style.fontSize = '18px';
    title.style.marginBottom = '10px';

    let titleContainer = document.createElement('div');
    titleContainer.style.backgroundColor = 'black';
    titleContainer.style.border = '1px solid green';
    titleContainer.style.padding = '5px';
    titleContainer.appendChild(title);

    let box = document.createElement('div');
    box.id = 'dataDisplayBox';
    box.style.position = 'fixed';
    box.style.top = '10px';
    box.style.left = '50%';
    box.style.transform = 'translate(-50%, 0)';
    box.style.backgroundColor = 'black';
    box.style.color = 'green';
    box.style.padding = '10px';
    box.style.border = '1px solid green';
    box.style.zIndex = '1000';
    box.style.maxHeight = '300px';
    box.style.overflowY = 'scroll';
    box.style.width = '400px';
    document.body.appendChild(box);
    box.appendChild(titleContainer);

    let sendButton = document.createElement('button');
    sendButton.textContent = 'Send Data to Webhook';
    sendButton.style.width = '100%';
    sendButton.style.padding = '5px';
    sendButton.style.marginTop = '5px';
    sendButton.style.backgroundColor = '#4CAF50';
    sendButton.style.color = 'white';
    box.appendChild(sendButton);

    let jsonButton = document.createElement('button');
    jsonButton.textContent = 'Convert Data to JSON';
    jsonButton.style.width = '100%';
    jsonButton.style.padding = '5px';
    jsonButton.style.marginTop = '5px';
    jsonButton.style.backgroundColor = '#607D8B';
    jsonButton.style.color = 'white';
    box.appendChild(jsonButton);

    function updateDisplayBox() {
        const data = extractData();
        box.innerHTML = '';
        box.appendChild(titleContainer);
        box.insertAdjacentHTML('beforeend', '<br>');
        box.insertAdjacentHTML('beforeend', data);
        box.appendChild(sendButton);
        box.appendChild(jsonButton);
    }

    setInterval(updateDisplayBox, 500);

    let mouseX, mouseY;
    let boxLeft, boxTop;
    let isDragging = false;

    function handleDrag(event) {
        if (isDragging) {
            const dx = event.clientX - mouseX;
            const dy = event.clientY - mouseY;
            box.style.left = boxLeft + dx + 'px';
            box.style.top = boxTop + dy + 'px';
        }
    }

    function startDrag(event) {
        isDragging = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
        boxLeft = box.offsetLeft;
        boxTop = box.offsetTop;
    }

    function stopDrag() {
        isDragging = false;
    }

    box.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
    box.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    setInterval(updateDisplayBox, 500);

    function extractData() {
        let nameHtml = '';
        let dataHtml = '';
        let dataBoxHtml = '';
        let boldDataBoxHtml = '';
        let illuminateHtml = '';
        let illuminateValue = 0;
        const dividerElements = document.querySelectorAll('.m-3eebeb36.mantine-Divider-root[data-orientation="vertical"][role="separator"]');
        const uniqueNames = new Set();
        dividerElements.forEach(dividerElement => {
            let siblingElement = dividerElement.nextElementSibling;
            while (siblingElement) {
                if (siblingElement.classList.contains('mantine-Text-root')) {
                    const textContent = siblingElement.textContent.trim();
                    if (textContent && !uniqueNames.has(textContent)) {
                        uniqueNames.add(textContent);
                        if (textContent.includes("**")) {
                            boldDataBoxHtml += `<div style="border: 1px solid green; padding: 5px; color: gold;">${textContent}</div>`;
                        } else {
                            nameHtml += `<div style="border: 1px solid green; padding: 5px; color: gold;">${textContent}</div>`;
                        }
                    }
                }
                siblingElement = siblingElement.nextElementSibling;
            }
        });
        if (nameHtml) nameHtml += '<br>';
        const parentElements = document.querySelectorAll('.m-4081bf90.mantine-Group-root');
        parentElements.forEach(parentElement => {
            const textElements = parentElement.querySelectorAll('.mantine-Text-root');
            textElements.forEach(textElement => {
                if (!textElement.closest('p.mantine-Text-root')) {
                    const name = textElement.textContent.trim();
                    const value = textElement.nextElementSibling.textContent.trim().replace(/,/g, '');
                    if (name && value) {
                        let color = 'green'; // Default color
                        if (name === 'Data to be colored differently') {
                            dataBoxHtml += `<div style="border: 1px solid blue; padding: 5px; color: yellow;">${name}</div>`;
                        } else {
                            dataHtml += `<div style="border: 1px solid green; padding: 5px; color: yellow;">${name}</div>`;
                        }
                    }
                }
            });
            if (dataHtml) dataHtml += '<br>';
        });
        const h5Elements = document.querySelectorAll('.m-8a5d1357.mantine-Title-root[data-order="5"]');
        h5Elements.forEach(h5 => {
            const h5Text = h5.textContent.trim();
            if (h5Text !== "ACTIVE PLANETS" && h5Text !== "MAJOR ORDER") {
                if (h5Text) {
                    nameHtml += `<div style="border: 1px solid green; padding: 5px; color: yellow;">${h5Text}</div>`;
                }
            }
        });
        if (nameHtml) nameHtml += '<br>';
        const gridInnerDivs = document.querySelectorAll('.m-dee7bd2f.mantine-Grid-inner');
        gridInnerDivs.forEach(gridInnerDiv => {
            const labels = gridInnerDiv.querySelectorAll('p');
            if (labels.length === 2) {
                const name = labels[0].textContent.trim();
                const value = labels[1].textContent.trim();
                if (name && value) {
                    if (name === 'Illuminate:') {
                        illuminateValue = parseInt(value.replace(/,/g, ''));
                        if (illuminateValue > 0) {
                            illuminateHtml = `<div style="border: 1px solid blue; padding: 5px; color: lightblue;">${name} ${value}</div>`;
                        } else {
                            dataHtml += `<div style="border: 1px solid green; padding: 5px; color: lightblue;">${name} ${value}</div>`;
                        }
                    } else if (name === 'Automatons:' || name === 'Terminids:') {
                        let color = 'red';
                        if (name === 'Automatons:') {
                            color = 'purple';
                        }
                        dataHtml += `<div style="border: 1px solid green; padding: 5px; color: ${color};">${name} ${value}</div>`;
                    } else {
                        dataHtml += `<div style="border: 1px solid green; padding: 5px; color: green;">${name} ${value}</div>`;
                    }
                }
            }
        });
        if (dataHtml) dataHtml += '<br>';
        if (dataBoxHtml) dataBoxHtml += '<br>';
        if (boldDataBoxHtml) boldDataBoxHtml += '<br>';
        if (dataBoxHtml) {
            dataBoxHtml = `<div style="border: 1px solid blue; padding: 5px;">${dataBoxHtml}</div>`;
        }
        return (nameHtml || dataHtml || dataBoxHtml || boldDataBoxHtml || illuminateHtml) ? `${nameHtml} ${dataHtml} ${dataBoxHtml} ${boldDataBoxHtml} ${illuminateHtml}` : 'No Current Data Found';
    }


    sendButton.onclick = function() {
        copyToClipboard(box.innerHTML, 65280);
    };

    function sendDataToWebhook(embedMessage, color) {
        const payload = {
            content: "||@here||",
            embeds: [{
                description: embedMessage,
                color: color
            }]
        };
        GM_xmlhttpRequest({
            method: 'POST',
            url: webhookUrl,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(payload),
            onload: function(response) {
                alert('Webhook sent successfully!');
            },
            onerror: function(response) {
                alert('Failed to send webhook.');
            }
        });
    }
    jsonButton.onclick = function convertToJSON() {
        const sections = box.querySelectorAll('div');
        let jsonData = {
            "Planet Data": [],
            "Player Activity": [],
            "Win Stats": [],
            "Kill Data": [],
            "Random Data": []
        };

        sections.forEach((section, index) => {
            index += 1;
            const excludeSections = [6, 13, 14, 15];
            if (excludeSections.includes(index) || section.textContent.includes("ErrorNullTag's Tool")) {
                return;
            }

            let content = section.textContent.trim();
            if (content !== '') {
                if (index === 3 || index === 4) {
                    jsonData["Planet Data"].push(content);
                } else if (index === 5) {
                    jsonData["Player Activity"].push(content);
                } else if (index >= 7 && index <= 9) {
                    jsonData["Win Stats"].push(content);
                } else if (index >= 10 && index <= 12) {
                    jsonData["Kill Data"].push(content);
                } else if (index > 13) {
                    jsonData["Random Data"].push(content);
                }
            }
        });

        sendJSONToWebhook(jsonData);
    }

    function sendJSONToWebhook(jsonData) {
    const userId = '198735539673759744';
    const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const formData = new FormData();
    formData.append('content', `||<@${userId}>||`);
    formData.append('files[0]', jsonBlob, 'data.json');

    GM_xmlhttpRequest({
        method: 'POST',
        url: webhookUrl,
        data: formData,
        onload: function(response) {
            alert('Webhook sent successfully, user notified with file!');
        },
        onerror: function(response) {
            alert('Failed to send webhook with file.');
        }
    });
}



    function copyToClipboard(text, color) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = text;
        let extractedText = Array.from(tempElement.childNodes)
            .map(node => node.textContent.trim())
            .filter(content => content !== '')
            .map(content => content.replace(/(:)/g, ' : '))
            .filter(content => !content.includes('Send Data') && !content.includes("ErrorNullTag's Tool") && !content.includes("Convert Data"))
            .join('\n');
        let lines = extractedText.split('\n');
        if (lines.length >= 2) {
            lines[0] = `**${lines[0]}**`;
            lines[1] = `**${lines[1]}**`;
        }
        if (lines.length >= 3) {
            lines.splice(2, 0, '');
        }
        if (lines.length >= 5) {
            lines.splice(5, 0, '');
        }
        if (lines.length >= 6) {
            lines[3] = `**${lines[3]}**`;
            lines[4] = `**${lines[4]}**`;
        }
        extractedText = lines.join('\n');
        sendDataToWebhook(extractedText, color);
    }
    updateDisplayBox();
})();
