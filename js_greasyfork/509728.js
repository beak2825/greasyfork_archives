// ==UserScript==
// @name        FreshRSS Keyword Highlight
// @namespace   https://github.com/hiroki-miya
// @version     1.0.3
// @description Highlight articles in FreshRSS that match the rule. Rules are described by regular expressions.
// @author      hiroki-miya
// @license     MIT
// @match       https://freshrss.example.net/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/509728/FreshRSS%20Keyword%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/509728/FreshRSS%20Keyword%20Highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Language for sorting
    const sortLocale = 'ja';

    // Highlight Color
    const highlightColor = '#ffff60';

    // Retrieve saved highlights
    let savedHighlights = GM_getValue('highlights', {});

    // Define editingHighlightName globally (the name of the highlight currently being edited)
    let editingHighlightName = null;

    // Add styles
    GM_addStyle(`
        #freshrss-keyword-highlight {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background-color: white;
            border: 1px solid black;
            padding: 10px;
            width: max-content;
        }
        #freshrss-keyword-highlight > h2 {
            box-shadow: inset 0 0 0 0.5px black;
            padding: 5px 10px;
            text-align: center;
            cursor: move;
        }
        #freshrss-keyword-highlight > h4 {
            margin-top: 0;
        }
        #highlight-list {
            margin-bottom: 10px;
            max-height: 50vh;
            overflow-y: auto;
        }
        .highlight-item  {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #highlight-edit > div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 2;
            margin-bottom: 5px;
        }
        #highlight-edit > div input {
            line-height: 2;
            margin: 0;
        }
        .highlight-name,
        #highlight-edit > div > label {
            flex-grow: 1;
            margin-right: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        #highlight-edit > div > div:has(input[type="checkbox"]) {
            margin-left: 5px;
            max-width: 90%;
            width: 300px;
        }
        #highlight-edit > div input[type="checkbox"] {
            transform: scale(1.5);
            margin-left: 4px;
        }
        .edit-highlight, .delete-highlight,
        #highlight-edit > div > input {
            margin-left: 5px;
        }
        .highlight-info-label {
            display: inline;
        }
        .highlight-info {
            display: inline-block;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            min-height: 16px;
            line-height: 1.2;
            margin-left: 4px;
            text-align: center;
            background-color: black;
            color: white;
            font-weight: 700;
        }
    `);

    // Function to render the highlight list
    function updateHighlightList() {
        // Sort highlights
        const highlightNames = Object.keys(savedHighlights).sort((a, b) => a.localeCompare(b, sortLocale));
        const highlightList = highlightNames.map(name => {
            return `
                <div class="highlight-item">
                    <div class="highlight-name">${name}</div>
                    <button class="edit-highlight" data-name="${name}">Edit</button>
                    <button class="delete-highlight" data-name="${name}">Delete</button>
                </div>
            `;
        }).join('');

        // Render the highlight list
        document.getElementById('highlight-list').innerHTML = highlightList || 'No registered highlight rules';

        // Re-register the highlight edit button events
        Array.from(document.querySelectorAll('.edit-highlight')).forEach(button => {
            button.addEventListener('click', () => {
                const highlightName = button.getAttribute('data-name');
                const highlight = savedHighlights[highlightName];

                // Pre-fill the form with the highlight values
                document.getElementById('highlight-name').value = highlightName;
                document.getElementById('highlight-currentUrl').value = highlight.currentUrl || '';
                document.getElementById('highlight-title').value = highlight.title || '';
                document.getElementById('highlight-url').value = highlight.url || '';
                document.getElementById('highlight-content').value = highlight.content || '';
                document.getElementById('highlight-text').value = highlight.text || '';
                document.getElementById('highlight-case').checked = highlight.caseInsensitive || false;

                editingHighlightName = highlightName;

                // Update the form heading for editing
                document.querySelector('#highlight-edit-title').innerText = 'Edit Existing Highlight Rule';
                document.querySelector('#fkh-save').innerText = 'Update';
            });
        });

        // Re-register the highlight delete button events
        Array.from(document.querySelectorAll('.delete-highlight')).forEach(button => {
            button.addEventListener('click', () => {
                const highlightName = button.getAttribute('data-name');
                delete savedHighlights[highlightName];
                GM_setValue('highlights', savedHighlights);
                updateHighlightList();
                applyAllHighlights();
            });
        });
    }

    // Display highlight settings
    function showSettings() {
        const settingsHTML = `
            <h2>Keyword Highlight Rule Settings</h2>
            <h4>Saved Highlight Rules</h4>
            <div id="highlight-list"></div>
            <br>
            <hr>
            <h4 id="highlight-edit-title">Create New Highlight Rule</h4>
            <div id="highlight-edit">
            <div><label>Highlight Name</label><input type="text" id="highlight-name"></div>
            <div><label>FreshRSS Feed List URL</label><input type="text" id="highlight-currentUrl"></div>
            <div><label>Title</label><input type="text" id="highlight-title"></div>
            <div><label>Content URL</label><input type="text" id="highlight-url"></div>
            <div><label class="highlight-info-label">Content<div title="article.flux_content.innerText" class="highlight-info">i</div></label><input type="text" id="highlight-content"></div>
            <div><label class="highlight-info-label">Text<div title="div.text.innerHTML" class="highlight-info">i</div></label><input type="text" id="highlight-text"></div>
            <div><label>Case insensitive?</label><div><input type="checkbox" id="highlight-case"></div></div>
            <br>
            </div>
            <button id="fkh-save">Save</button>
            <button id="fkh-clear">Clear</button>
            <button id="fkh-close">Close</button>
        `;

        const settingsDiv = document.createElement('div');
        settingsDiv.id = 'freshrss-keyword-highlight';
        settingsDiv.innerHTML = settingsHTML;
        document.body.appendChild(settingsDiv);

        // Initial render of saved highlight list
        updateHighlightList();

        // Make settikeywords panel draggable
        makeDraggable(settingsDiv);

        // Save or update button event
        document.getElementById('fkh-save').addEventListener('click', () => {
            const highlightName = document.getElementById('highlight-name').value;
            const highlightCurrentUrl = document.getElementById('highlight-currentUrl').value;
            const highlightTitle = document.getElementById('highlight-title').value;
            const highlightUrl = document.getElementById('highlight-url').value;
            const highlightContent = document.getElementById('highlight-content').value;
            const highlightText = document.getElementById('highlight-text').value;
            const caseInsensitive = document.getElementById('highlight-case').checked;

            if (!highlightName) {
                alert('Please enter a highlight name');
                return;
            }

            // Save or update the highlight
            savedHighlights[highlightName] = {
                currentUrl: highlightCurrentUrl,
                title: highlightTitle,
                url: highlightUrl,
                content: highlightContent,
                text: highlightText,
                caseInsensitive: caseInsensitive
            };

            // If the highlight name was changed during editing, delete the old highlight
            if (editingHighlightName && editingHighlightName !== highlightName) {
                delete savedHighlights[editingHighlightName];
            }

            GM_setValue('highlights', savedHighlights);

            showTooltip('Saved');

            initEdit();

            // Update highlight list
            updateHighlightList();

            // Apply highlights immediately after saving
            applyAllHighlights();
        });

        // Clear button event
        document.getElementById('fkh-clear').addEventListener('click', () => {
            initEdit();
        });

        // Close button event
        document.getElementById('fkh-close').addEventListener('click', () => {
            document.body.removeChild(settingsDiv);
        });
    }

    function initEdit() {
        editingHighlightName = null;
        document.getElementById('highlight-name').value = '';
        document.getElementById('highlight-currentUrl').value = '';
        document.getElementById('highlight-title').value = '';
        document.getElementById('highlight-url').value = '';
        document.getElementById('highlight-content').value = '';
        document.getElementById('highlight-text').value = '';
        document.getElementById('highlight-case').checked = false;

        // Update the form heading for creating a new highlight
        document.querySelector('#highlight-edit-title').innerText = 'Create New Highlight Rule';
        document.querySelector('#fkh-save').innerText = 'Save';
    }

    // Function to display the tooltip
    function showTooltip(message) {
        // Create the tooltip element
        const tooltip = document.createElement('div');
        tooltip.textContent = message;
        tooltip.style.position = 'fixed';
        tooltip.style.top = '50%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translate(-50%, -50%)';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '10px 20px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.zIndex = '10000';
        tooltip.style.fontSize = '16px';
        tooltip.style.textAlign = 'center';

        // Add the tooltip to the page
        document.body.appendChild(tooltip);

        // Automatically remove the tooltip after 1 second
        setTimeout(() => {
            document.body.removeChild(tooltip);
        }, 1000);
    }

    // Make element draggable
    function makeDraggable(elmnt) {
        const header = elmnt.querySelector('h2');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // Get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Apply all highlights automatically
    function applyAllHighlights() {
        const articles = Array.from(document.querySelectorAll('#stream > .flux'));
        const currentPageUrl = window.location.href;

        articles.forEach(article => {
            const title = article.querySelector('a.item-element.title')?.innerText || '';
            const url = article.querySelector('a.item-element.title')?.href || '';
            const content = article.querySelector('.flux_content')?.innerText || '';
            const text = article.querySelector('div.text')?.innerHTML || '';

            let matchesAnyHighlight = false;

            // Check all saved highlights
            for (let highlightName in savedHighlights) {
                const highlight = savedHighlights[highlightName];
                const regexFlags = highlight.caseInsensitive ? 'i' : '';
                const currentUrlMatch = !highlight.currentUrl || new RegExp(highlight.currentUrl, regexFlags).test(currentPageUrl);
                const titleMatch = !highlight.title || new RegExp(highlight.title, regexFlags).test(title);
                const urlMatch = !highlight.url || new RegExp(highlight.url, regexFlags).test(url);
                const contentMatch = !highlight.content || new RegExp(highlight.content, regexFlags).test(content);
                const textMatch = !highlight.text || new RegExp(highlight.text, regexFlags).test(text);

//                 console.log('titleMatch(' + titleMatch + '): ' + highlight.title + ' = ' + title + '\n' +
//                      'urlMatch(' + urlMatch + '): ' + highlight.url + ' = ' + url + '\n' +
//                      'contentMatch(' + contentMatch + '): ' + highlight.content + ' = ' + content + '\n' +
//                      'textMatch(' + textMatch + '): ' + highlight.text + ' = ' + text + '\n');

                // Check if all highlight conditions are met (AND condition)
                if (currentUrlMatch && titleMatch && urlMatch && contentMatch && textMatch) {
                    matchesAnyHighlight = true;
                    break;
                }
            }

            // Add ng class to articles matching the highlight
            if (matchesAnyHighlight) {
                article.classList.add('highlight');
                article.style.backgroundColor = highlightColor;
            } else {
                article.classList.remove('highlight');
                article.style.backgroundColor = null;
            }
        });
    }

    // Setup MutationObserver
    function setupObserver() {
        const targetNode = document.querySelector('#stream');
        if (targetNode) {
            const observer = new MutationObserver(applyAllHighlights);
            observer.observe(targetNode, { childList: true, subtree: true });
            // Initial highlight application
            applyAllHighlights();
        } else {
            // Retry if #stream is not found
            setTimeout(setupObserver, 1000);
        }
    }

    // Register settings screen
    GM_registerMenuCommand('Settings', showSettings);

    // Start setupObserver when the script starts
    setupObserver();
})();
