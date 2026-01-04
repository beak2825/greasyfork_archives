// ==UserScript==
// @name         Website Executor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Website Executor like Xeno
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534115/Website%20Executor.user.js
// @updateURL https://update.greasyfork.org/scripts/534115/Website%20Executor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom style
    GM_addStyle(`
        #executorWindow {
            position: fixed;
            top: 20px;
            left: 20px;
            width: 600px;
            height: 400px;
            background-color: #1e1e1e;
            color: #fff;
            border: 1px solid #00ffff;
            box-shadow: 0 0 10px #00ffff;
            z-index: 1000;
        }

        #titleBar {
            background-color: #333;
            padding: 10px;
            cursor: move;
            display: flex;
            justify-content: space-between;
        }

        #contentArea {
            padding: 10px;
        }

        #codeEditor {
            width: 100%;
            height: 300px;
            background-color: #222;
            color: #fff;
            border: none;
            padding: 5px;
            font-family: monospace;
        }

        #bottomBar {
            background-color: #333;
            padding: 10px;
            display: flex;
            justify-content: space-around;
        }

        #bottomBar button {
            background-color: #444;
            color: #fff;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
        }
    `);

    // Create the executor window
    const executorWindow = document.createElement('div');
    executorWindow.id = 'executorWindow';
    document.body.appendChild(executorWindow);

    // Title bar
    const titleBar = document.createElement('div');
    titleBar.id = 'titleBar';
    titleBar.textContent = 'Website Executor';
    executorWindow.appendChild(titleBar);

    // Content area
    const contentArea = document.createElement('div');
    contentArea.id = 'contentArea';
    executorWindow.appendChild(contentArea);

    // Code editor
    const codeEditor = document.createElement('textarea');
    codeEditor.id = 'codeEditor';
    contentArea.appendChild(codeEditor);

    // Bottom bar
    const bottomBar = document.createElement('div');
    bottomBar.id = 'bottomBar';
    executorWindow.appendChild(bottomBar);

    // Buttons
    const buttons = ['Settings', 'Open', 'Save', 'Clear', 'Run'];
    buttons.forEach(text => {
        const button = document.createElement('button');
        button.textContent = text;
        bottomBar.appendChild(button);
    });

    // Make the window draggable
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    titleBar.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        executorWindow.style.top = (executorWindow.offsetTop - pos2) + "px";
        executorWindow.style.left = (executorWindow.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
})();
