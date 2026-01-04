// ==UserScript==
// @name        One-Click Macro
// @namespace   http://tampermonkey.net/
// @version     1.12
// @description Instantly send a macro by clicking a button
// @author      Ahmet
// @match       https://app.intercom.com/a/inbox/*
// @grant       GM_addStyle
// @icon        https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/174_Intercom-512.png
// @downloadURL https://update.greasyfork.org/scripts/492617/One-Click%20Macro.user.js
// @updateURL https://update.greasyfork.org/scripts/492617/One-Click%20Macro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #myContainer {
            position: fixed;
            top: 70%;
            left: 2%;
            background-color: grey;
            padding: 0; /* No internal padding to fit buttons tightly */
            border-radius: 12px;
            z-index: 1000;
            color: white;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            opacity: 0.9;
            display: flex;
            flex-wrap: wrap; /* Allows wrapping within the container */
            justify-content: center;
            align-items: center;
            width: 260px; /* Exact width to fit two buttons (each 100px wide + 2x6px margin) */
            height: auto; /* Height adjusts based on content */
        }
        .macroButton {
            cursor: pointer;
            margin: 3px; /* Small margin around buttons */
            padding: 8px 10px;
            background: darkblue;
            border: none;
            color: white;
            border-radius: 8px;
            width: 120px; /* Fixed width for each button */
            height: 80px; /* Allows height to adjust based on content */
        }
        .macroButton:hover {
            background-color: navy;
        }
    `);


    const container = document.createElement('div');
    container.id = 'myContainer';
    const macros = [
        {name: "Cheater", value: "#ff - FP Initial"},
        {name: "Sandbagging", value: "#ff - Sandbagging"},
        {name: "Reg Abuse", value: "#ff - Reg Abuse"},
        {name: "Find User", value: "#ff - Find User"}
    ];

        let isDown = false; // Define isDown in the broader scope

    container.addEventListener('mousedown', function(e) {
        isDown = true;
        const offset = [
            container.offsetLeft - e.clientX,
            container.offsetTop - e.clientY
        ];
        document.addEventListener('mousemove', function(event) {
            if (isDown) {
                event.preventDefault();
                container.style.left = (event.clientX + offset[0]) + 'px';
                container.style.top = (event.clientY + offset[1]) + 'px';
            }
        }, true);
    }, true);

    document.addEventListener('mouseup', function() {
        isDown = false;
    }, true);

    macros.forEach(macro => {
        const button = document.createElement('button');
        button.className = 'macroButton';
        button.textContent = macro.name;
        button.onclick = () => insertMacro(macro.value);
        container.appendChild(button);
    });

    document.body.appendChild(container);

    function insertMacro(text) {
        const composer = document.querySelector('p.intercom-interblocks-align-left.embercom-prosemirror-composer-block-selected');
        if (composer) {
            composer.textContent = ''; // Clear existing text
            typeText(composer, text, 0, function() {
                simulateKeyPress(composer);
            });
        }
    }

    function typeText(element, text, index, callback) {
        if (index < text.length) {
            element.textContent += text[index];
            setTimeout(() => typeText(element, text, index + 1, callback), 10); // Small delay to mimic typing
        } else {
            callback(); // Execute callback when typing is complete
        }
    }

    function simulateKeyPress(element) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(element);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);

        element.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, keyCode: 8 }));
        setTimeout(() => {
            const highlightedElement = document.querySelector('span.inbox2__macro-highlighted');
            if (highlightedElement) {
                highlightedElement.click(); // Click the highlighted span
                setTimeout(() => {
                    const sendButton = document.querySelector('button.p-2.h-8.focus\\:outline-none.flex.items-center.justify-center.font-semibold.whitespace-nowrap');
                    if (sendButton) sendButton.click(); // Click the send button
                }, 500);
            }
        }, 500);
    }
})();