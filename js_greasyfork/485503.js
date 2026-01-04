// ==UserScript==
// @name         Map-making Comprehensive mode
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Implement dark mode and shift multiple selections,more shortcut keys Map-Making
// @icon         https://s2.loli.net/2024/01/17/4nqsveVoH8A1mTB.png
// @match        https://map-making.app/maps/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/485503/Map-making%20Comprehensive%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/485503/Map-making%20Comprehensive%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Change the background color of selected text to transparent
    GM_addStyle(`
        ::selection {
            background-color: transparent !important;
            color: white !important;
        }
    `);

    //Automatically click button for selected text
    document.addEventListener('keyup', function(event) {
        if (event.key === "Shift") {
            let selection = window.getSelection();
            for (let i = 0; i < selection.rangeCount; i++) {
                let range = selection.getRangeAt(i);
                let selectedText = range.toString().trim();

                if (selectedText) {
                    document.querySelectorAll('ul.tag-list li.tag.has-button .tag__text').forEach(el => {
                        if (el.textContent.trim() === selectedText) {
                            el.closest('li.tag.has-button').click();
                        }
                    });
                }
            }
        }
    });

    //dark mode
    GM_addStyle(`
        body *:not(#radix-\\:r5\\:):not(.tag-list *),
        body *:not(#radix-\\:r5\\:):not(.tag-list *) * {
            background-color: transparent;
            font-weight: bold ;
            color: #a6a4a4;
        }

        .tag-list,
       .tag-list * {
    color: white !important;
    text-shadow:
        -1px -1px 0 #000,
         1px -1px 0 #000,
        -1px  1px 0 #000,
         1px  1px 0 #000;
    font-weight: bold !important;
}

    `);

    //more shortcut keys Map-Making
    function simulateClick(element) {
        if (element) {
            element.click();
        }
    }

    function clickAllMatching(selector) {
        document.querySelectorAll(selector).forEach(simulateClick);
    }

    const SELECTORS = {
        ' ': 'button.button.button--primary[type="button"]',
        'q': 'button.compass-control__link:nth-child(3)',
        'e': 'button.compass-control__link:nth-child(2)',
        'c': '.location-preview__actions > button:nth-child(2)',
        'v': 'div.tool-block:nth-child(2) > header:nth-child(1) > button:nth-child(4)',
        'd': 'button.button:nth-child(3)',
        'p':'div.embed-controls__control:nth-child(6) > div:nth-child(1) > button:nth-child(1)'
    };

    document.addEventListener('keydown', event => {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        if (SELECTORS[event.key]) {
            const element = document.querySelector(SELECTORS[event.key]);
            simulateClick(element);
        }
    });

})();
