// ==UserScript==
// @name         Custom Sidebar with Tools
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A script to add a customizable sidebar with tool buttons for mobile devices with a draggable button to toggle the sidebar
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501787/Custom%20Sidebar%20with%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/501787/Custom%20Sidebar%20with%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS for the sidebar and toggle button
    const styles = `
        #customSidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: 250px;
            height: 100%;
            background-color: #333;
            padding-top: 20px;
            transform: translateX(-250px);
            transition: transform 0.3s ease;
            z-index: 1000;
            color: white;
        }
        #customSidebar.show {
            transform: translateX(0);
        }
        #customSidebar button {
            display: block;
            padding: 10px;
            margin: 10px;
            width: 80%;
            background-color: #555;
            border: none;
            color: white;
            cursor: pointer;
            text-align: left;
        }
        #draggableToggleBtn {
            position: fixed;
            width: 50px;
            height: 50px;
            background-color: #333;
            border-radius: 50%;
            border: none;
            color: white;
            cursor: pointer;
            z-index: 1001;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `;

    // HTML structure for the sidebar and toggle button
    const html = `
        <div id="customSidebar">
            <button id="toolBtn1">Tool 1</button>
            <button id="toolBtn2">Tool 2</button>
            <button id="toolBtn3">Tool 3</button>
        </div>
        <button id="draggableToggleBtn">≡</button>
    `;

    // Add CSS to the document
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);

    // Add HTML to the document
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    // JavaScript to handle sidebar toggle
    const sidebar = document.getElementById('customSidebar');
    const toggleBtn = document.getElementById('draggableToggleBtn');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });

    // Make the toggle button draggable
    toggleBtn.addEventListener('touchstart', dragStart, false);
    toggleBtn.addEventListener('touchmove', dragMove, false);

    let offsetX, offsetY;

    function dragStart(e) {
        const touch = e.targetTouches[0];
        offsetX = touch.clientX - toggleBtn.getBoundingClientRect().left;
        offsetY = touch.clientY - toggleBtn.getBoundingClientRect().top;
    }

    function dragMove(e) {
        e.preventDefault();
        const touch = e.targetTouches[0];
        const x = touch.clientX - offsetX;
        const y = touch.clientY - offsetY;

        toggleBtn.style.left = `${x}px`;
        toggleBtn.style.top = `${y}px`;
    }

    // Tool button event handlers
    document.getElementById('toolBtn1').addEventListener('click', () => {
        alert('Tool 1 clicked!');
        // Add your custom function here
    });

    document.getElementById('toolBtn2').addEventListener('click', () => {
        alert('Tool 2 clicked!');
        // Add your custom function here
    });

    document.getElementById('toolBtn3').addEventListener('click', () => {
        alert('Tool 3 clicked!');
        // Add your custom function here
    });
})();  