// ==UserScript==
// @name         Torn Keno Random Selector
// @namespace    https://greasyfork.org/en/scripts/531078-torn-keno-random-selector
// @version      03.28.2025.19.10
// @description  Places a Torn-styled block under BET & ROUNDS, centered, to pick random Keno numbers.
// @author       KillerCleat
// @match        https://www.torn.com/page.php?sid=keno*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/531078/Torn%20Keno%20Random%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/531078/Torn%20Keno%20Random%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Randomly pick 'count' unique items from 'arr'
    function getRandomElements(arr, count) {
        const arrCopy = [...arr];
        const result = [];
        for (let i = 0; i < count; i++) {
            if (arrCopy.length === 0) break;
            const index = Math.floor(Math.random() * arrCopy.length);
            result.push(arrCopy[index]);
            arrCopy.splice(index, 1); // Remove to ensure uniqueness
        }
        return result;
    }

    // 2. Inject minimal CSS to center our Torn-styled block under BET & ROUNDS
    function injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* This container replicates the "cancel" style block but is placed under #controls */
            #randomButtonsContainer {
                width: 100%;
                text-align: center;  /* Center horizontally */
                margin-top: 10px;    /* Space above */
                margin-bottom: 10px; /* Optional space below */
            }
            /* The .desc and .cancel-btn-wrap come from Torn's classes */
            #randomButtonsContainer .desc p {
                margin: 0;
                padding: 0;
            }
            /* Force buttons in a single horizontal row */
            #randomButtonsContainer .cancel-btn-wrap {
                display: inline-block;   /* Keep the buttons together horizontally */
                white-space: nowrap;     /* Prevent wrapping */
                text-align: left;        /* Buttons align left inside the inline-block */
                margin-top: 5px;         /* Space between text and buttons */
            }
            /* Minor spacing for each .btn-wrap.orange so they appear side by side */
            .btn-wrap.orange {
                display: inline-block;
                margin: 0 5px 5px 0;  /* Right & bottom spacing */
            }
        `;
        document.head.appendChild(style);
    }

    // 3. Build the Torn-styled block: text + row of 10 buttons
    function createRandomButtons() {
        // Avoid reinserting if it already exists
        if (document.getElementById('randomButtonsContainer')) return;

        // The outer container with Torn's "cancel" class
        const container = document.createElement('div');
        container.id = 'randomButtonsContainer';
        container.className = 'cancel';

        // The text area (Torn's "desc" class)
        const desc = document.createElement('div');
        desc.className = 'desc';
        desc.tabIndex = 0;
        desc.innerHTML = '<p>Select how many random numbers to pick:</p>';
        container.appendChild(desc);

        // The wrapper that holds the row of buttons
        const cancelBtnWrap = document.createElement('div');
        cancelBtnWrap.className = 'cancel-btn-wrap';
        container.appendChild(cancelBtnWrap);

        // Create 10 Torn-style buttons in a horizontal row
        for (let i = 1; i <= 10; i++) {
            const btnWrap = document.createElement('div');
            btnWrap.className = 'btn-wrap orange';  // Torn class

            const btnDiv = document.createElement('div');
            btnDiv.className = 'btn';

            const button = document.createElement('button');
            button.className = 'torn-btn orange';    // Torn button style
            button.setAttribute('aria-label', `Select ${i}`);
            button.setAttribute('data-count', i);
            button.textContent = i;

            btnDiv.appendChild(button);
            btnWrap.appendChild(btnDiv);
            cancelBtnWrap.appendChild(btnWrap);
        }

        // Insert our container below BET & ROUNDS (inside #controls)
        const controls = document.getElementById('controls');
        if (controls) {
            controls.appendChild(container);
        } else {
            // Fallback if #controls not found
            document.body.appendChild(container);
        }

        // Attach click handlers to pick random Keno numbers
        const boardSpans = document.querySelectorAll('#boardContainer span');
        const allButtons = container.querySelectorAll('button');
        allButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const count = parseInt(this.getAttribute('data-count'), 10);
                // Filter out any already-marked numbers
                const unmarkedSpans = Array.from(boardSpans).filter(
                    span => !span.classList.contains('marked')
                );

                if (unmarkedSpans.length < count) {
                    alert(`Not enough unmarked numbers available. Only ${unmarkedSpans.length} left.`);
                    return;
                }

                // Randomly select the requested number
                const selectedSpans = getRandomElements(unmarkedSpans, count);
                // Simulate clicks so Torn's code marks them
                selectedSpans.forEach(span => span.click());
            });
        });
    }

    // 4. Wait until the Keno board & controls exist, then insert our block
    function waitForKenoElements() {
        const boardContainer = document.getElementById('boardContainer');
        const controls = document.getElementById('controls');
        if (boardContainer && controls) {
            createRandomButtons();
            clearInterval(checkInterval);
        }
    }

    // 5. Inject styles & poll every 500ms for #controls to appear
    injectStyles();
    const checkInterval = setInterval(waitForKenoElements, 500);
})();
