// ==UserScript==
// @name         AM/PM Time.
// @namespace    torn-layout-converter
// @version      1.0
// @description  Forces the entire time/date string onto a single line, arranges it horizontally with other status elements, and converts time to AM/PM.
// @author       aquagloop
// @license MIT
// @match        https://www.torn.com/*
// @icon         https://www.torn.com/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/545216/AMPM%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/545216/AMPM%20Time.meta.js
// ==/UserScript==

(function() {
    'use-strict';


    const finalCss = `
        #header-time {
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 12px !important;
            width: auto !important;
            margin-top: 5px !important;
        }


        #header-time > div {
            margin: 0 !important;
        }


        #server-status {
            position: relative !important;
            top: 1px !important;
        }


        .server-date-time {
            white-space: nowrap !important;
        }
    `;

    GM_addStyle(finalCss);

    function convertTime(textNode) {
        const originalText = textNode.textContent;
        if (originalText.includes('M')) return;
        const match = originalText.match(/(\w+)\s+([\d:]+)\s+-\s+([\d\/]+)/);
        if (!match) return;
        const [fullMatch, dayOfWeek, timeString, datePart] = match;
        const datePieces = datePart.split('/');
        const isoString = `20${datePieces[2]}-${datePieces[1]}-${datePieces[0]}T${timeString}`;
        const dateObject = new Date(isoString);
        if (isNaN(dateObject)) return;
        const newTime = dateObject.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        textNode.textContent = `${dayOfWeek} ${newTime} - ${datePart}`;
    }

    const setupInterval = setInterval(() => {
        const timeElement = document.querySelector('.server-date-time');
        if (timeElement && timeElement.firstChild) {
            clearInterval(setupInterval);
            const targetTextNode = timeElement.firstChild;
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'characterData') {
                        observer.disconnect();
                        convertTime(mutation.target);
                        observer.observe(targetTextNode, { characterData: true, subtree: true });
                    }
                }
            });
            convertTime(targetTextNode);
            observer.observe(targetTextNode, { characterData: true, subtree: true });
        }
    }, 500);

})();