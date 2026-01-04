// ==UserScript==
// @name         Golden Gate GUI
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Inject a GUI to execute custom JavaScript on any webpage
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506608/Golden%20Gate%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/506608/Golden%20Gate%20GUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the GUI HTML
    const guiHTML = `
        <div class="window" id="goldenGateGui">
            <div class="title-bar">
                <span>Golden Gate Gui</span>
                <div class="window-controls">
                    <span id="minimize">-</span>
                    <span id="maximize">&#9633;</span>
                    <span id="close">X</span>
                </div>
            </div>
            <div class="content">
                <textarea id="codeArea" placeholder="Enter your code here..."></textarea>
            </div>
            <div class="actions">
                <button id="injectBtn">Inject</button>
            </div>
        </div>
    `;

    // Add styles for the GUI
    const style = document.createElement('style');
    style.textContent = `
        body {
            position: relative;
        }
        #goldenGateGui {
            background-color: #FFA500;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            width: 400px;
            overflow: hidden;
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            cursor: move;
            transition: top 0.2s ease, left 0.2s ease;
        }

        .title-bar {
            background-color: #FFB732;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: black;
            font-weight: bold;
            border-bottom: 2px solid #FFA500;
        }

        .window-controls span {
            margin-left: 10px;
            cursor: pointer;
        }

        .content {
            padding: 20px;
            background-color: #FFD699;
        }

        textarea {
            width: 100%;
            height: 150px;
            border: none;
            resize: none;
            padding: 10px;
            box-sizing: border-box;
            border-radius: 5px;
            background-color: #FFE4B5;
        }

        .actions {
            padding: 10px;
            background-color: #FFB732;
            display: flex;
            justify-content: center;
        }

        button {
            padding: 10px 20px;
            border: none;
            background-color: white;
            color: black;
            font-weight: bold;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #f2f2f2;
        }

        button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);

    // Insert the GUI into the page
    const guiContainer = document.createElement('div');
    guiContainer.innerHTML = guiHTML;
    document.body.appendChild(guiContainer);

    // Add dragging functionality
    const gui = document.getElementById('goldenGateGui');
    let isDragging = false;
    let offsetX, offsetY;

    function startDrag(event) {
        isDragging = true;
        offsetX = (event.clientX || event.touches[0].clientX) - gui.getBoundingClientRect().left;
        offsetY = (event.clientY || event.touches[0].clientY) - gui.getBoundingClientRect().top;
        gui.style.transition = 'none'; // Disable transition during drag
    }

    function drag(event) {
        if (isDragging) {
            requestAnimationFrame(() => {
                const clientX = event.clientX || event.touches[0].clientX;
                const clientY = event.clientY || event.touches[0].clientY;
                gui.style.left = (clientX - offsetX) + 'px';
                gui.style.top = (clientY - offsetY) + 'px';
            });
        }
    }

    function endDrag() {
        if (isDragging) {
            isDragging = false;
            gui.style.transition = 'top 0.2s ease, left 0.2s ease'; // Smooth transition after drag
        }
    }

    gui.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    gui.addEventListener('touchstart', startDrag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', endDrag);

    // Button functionality
    let codeToInject = '';
    let urlToInject = '';

    document.getElementById('injectBtn').addEventListener('click', function() {
        urlToInject = document.getElementById('urlInput') ? document.getElementById('urlInput').value.trim() : '';
        codeToInject = document.getElementById('codeArea').value;

        if (urlToInject && codeToInject) {
            try {
                // Open the URL in a new tab
                const newTab = window.open(urlToInject, '_blank');
                newTab.focus();

                // Set up a message listener to communicate with the new tab
                window.addEventListener('message', function(event) {
                    if (event.source === newTab) {
                        // Pass the injected code to the new tab
                        event.source.postMessage({ type: 'injectCode', code: codeToInject }, '*');
                    }
                }, false);

                // Enable or disable buttons based on whether injection is active
                document.getElementById('injectBtn').disabled = true;

            } catch (e) {
                alert('Error opening the URL: ' + e.message);
            }
        } else {
            alert('Please enter code ♥.');
        }
    });

    // Add functionality to the window controls
    document.getElementById('minimize').addEventListener('click', function() {
        document.querySelector('.content').style.display = 'none';
        document.querySelector('.actions').style.display = 'none';
    });

    document.getElementById('maximize').addEventListener('click', function() {
        document.querySelector('.content').style.display = 'block';
        document.querySelector('.actions').style.display = 'flex';
    });

    document.getElementById('close').addEventListener('click', function() {
        document.getElementById('goldenGateGui').remove();
    });
})();
