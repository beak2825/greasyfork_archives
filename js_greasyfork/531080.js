// ==UserScript==
// @name         Torn Keno Random Selector (TornPDA Version)
// @namespace    https://greasyfork.org/en/scripts/531078-torn-keno-random-selector
// @version      03.28.2025.20.00
// @description  For TornPDA: Places a Torn-styled block with random selection buttons fixed over the interface so that it is not hidden by the matched numbers panel.
// @author       KillerCleat
// @match        https://www.torn.com/page.php?sid=keno*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/531080/Torn%20Keno%20Random%20Selector%20%28TornPDA%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531080/Torn%20Keno%20Random%20Selector%20%28TornPDA%20Version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility: Randomly select 'count' unique elements from an array.
    function getRandomElements(arr, count) {
        const arrCopy = [...arr];
        const result = [];
        for (let i = 0; i < count; i++) {
            if (arrCopy.length === 0) break;
            const index = Math.floor(Math.random() * arrCopy.length);
            result.push(arrCopy[index]);
            arrCopy.splice(index, 1);
        }
        return result;
    }

    // Inject CSS for the TornPDA version – fixed positioning with a high z-index.
    function injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Our container is fixed, centered horizontally, with high z-index to overlay the win sheet */
            #randomButtonsContainer {
                position: fixed !important;
                top: 250px !important;  /* Adjust this value to push the block down further */
                left: 50% !important;
                transform: translateX(-50%) !important;
                z-index: 999999 !important;
                width: auto;
                text-align: center;
            }
            /* Torn-styled text */
            #randomButtonsContainer .desc p {
                margin: 0;
                padding: 0;
                font-size: 14px;
                font-weight: bold;
            }
            /* Force the buttons to be in one horizontal row */
            #randomButtonsContainer .cancel-btn-wrap {
                display: inline-block;
                white-space: nowrap;
                margin-top: 5px;
            }
            /* Minor spacing for each button */
            .btn-wrap.orange {
                display: inline-block;
                margin: 0 5px 5px 0;
            }
        `;
        document.head.appendChild(style);
    }

    // Create the Torn-styled block (text + row of buttons).
    function createRandomButtons() {
        if (document.getElementById('randomButtonsContainer')) return;

        // Outer container using Torn's "cancel" class.
        const container = document.createElement('div');
        container.id = 'randomButtonsContainer';
        container.className = 'cancel';

        // Description text (using Torn's "desc" class).
        const desc = document.createElement('div');
        desc.className = 'desc';
        desc.tabIndex = 0;
        desc.innerHTML = '<p>Select how many random numbers to pick:</p>';
        container.appendChild(desc);

        // Wrapper for the buttons.
        const cancelBtnWrap = document.createElement('div');
        cancelBtnWrap.className = 'cancel-btn-wrap';
        container.appendChild(cancelBtnWrap);

        // Create 10 Torn-styled buttons (1–10) in one row.
        for (let i = 1; i <= 10; i++) {
            const btnWrap = document.createElement('div');
            btnWrap.className = 'btn-wrap orange';

            const btnDiv = document.createElement('div');
            btnDiv.className = 'btn';

            const button = document.createElement('button');
            button.className = 'torn-btn orange';
            button.setAttribute('aria-label', `Select ${i}`);
            button.setAttribute('data-count', i);
            button.textContent = i;

            btnDiv.appendChild(button);
            btnWrap.appendChild(btnDiv);
            cancelBtnWrap.appendChild(btnWrap);
        }

        // Append the container directly to the body.
        document.body.appendChild(container);

        // Attach click handlers: simulate click on board numbers so Torn marks them.
        const boardSpans = document.querySelectorAll('#boardContainer span');
        const allButtons = container.querySelectorAll('button');
        allButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const count = parseInt(this.getAttribute('data-count'), 10);
                const unmarkedSpans = Array.from(boardSpans).filter(
                    span => !span.classList.contains('marked')
                );

                if (unmarkedSpans.length < count) {
                    alert(`Not enough unmarked numbers available. Only ${unmarkedSpans.length} left.`);
                    return;
                }

                const selectedSpans = getRandomElements(unmarkedSpans, count);
                selectedSpans.forEach(span => span.click());
            });
        });
    }

    // Poll for the Keno board to be available, then create our container.
    function waitForKenoElements() {
        const boardContainer = document.getElementById('boardContainer');
        if (boardContainer) {
            createRandomButtons();
            clearInterval(checkInterval);
        }
    }

    injectStyles();
    const checkInterval = setInterval(waitForKenoElements, 500);
})();
