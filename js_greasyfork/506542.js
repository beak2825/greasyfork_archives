// ==UserScript==
// @name         Export Claude.Ai
// @namespace    https://tampermonkey.net/
// @version      1.2
// @description  Download the conversation with Claude
// @grant        none
// @author       sharmanhall
// @match        *://claude.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506542/Export%20ClaudeAi.user.js
// @updateURL https://update.greasyfork.org/scripts/506542/Export%20ClaudeAi.meta.js
// ==/UserScript==

function getTextByClass(className) {
    const elements = document.getElementsByClassName(className);
    const result = [];

    Array.from(elements).forEach(el => {
        const clone = el.cloneNode(true);
        const unwantedElements = clone.querySelectorAll('svg, button');
        unwantedElements.forEach(unwantedEl => {
            unwantedEl.remove();
        });
        result.push(clone.innerText.trim());
    });

    return result.join("\n");
}

function addButton() {
    var button = document.createElement("button");
    button.innerHTML = `Export`;
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background-color: #4CAF50; /* Green */
        border: none;
        color: white;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        cursor: pointer;
        border-radius: 12px;
        z-index: 999;
        opacity: 0.8; /* Slightly transparent */
        transition: opacity 0.3s ease;
        user-select: none; /* Prevent text selection while dragging */
        width: auto;
        height: auto;
    `;

    // Change opacity to make it solid on hover
    button.addEventListener("mouseover", function() {
        button.style.opacity = "1.0";
    });

    button.addEventListener("mouseout", function() {
        button.style.opacity = "0.8";
    });

    let isDragging = false;

    // Enable dragging
    button.onmousedown = function(e) {
        e.preventDefault();
        isDragging = false;

        // Get the initial mouse position and button position
        let shiftX = e.clientX - button.getBoundingClientRect().left;
        let shiftY = e.clientY - button.getBoundingClientRect().top;

        function moveAt(e) {
            isDragging = true;
            button.style.left = e.pageX - shiftX + 'px';
            button.style.top = e.pageY - shiftY + 'px';
            button.style.bottom = 'auto'; // Prevent conflicting styles
            button.style.right = 'auto'; // Prevent conflicting styles
        }

        // Move the button on mousemove
        document.addEventListener('mousemove', moveAt);

        // Remove mousemove event on mouseup
        document.onmouseup = function() {
            document.removeEventListener('mousemove', moveAt);
            document.onmouseup = null;
        };
    };

    // Disable drag start on the button to prevent default drag behavior
    button.ondragstart = function() {
        return false;
    };

    // Download text when clicking, only if not dragging
    button.addEventListener("click", function() {
        if (!isDragging) {
            const text = getTextByClass('font-claude-message'); // Update this to your specific class
            if (!text) {
                alert('No conversation found to export. Please ensure there is text in the conversation area.');
                return; // Stop execution if there's nothing to export
            }
            const blob = new Blob([text], {type: "text/plain;charset=utf-8"});
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.download = 'extracted.txt';
            link.href = url;
            link.click();

            URL.revokeObjectURL(url); // Clean up the object URL after download
        }
    });

    document.body.appendChild(button);
}

addButton();
