// ==UserScript==
// @name         KeepChatGPT Disable Banner but keep Options and Settings
// @author       Ameer Jamal
// @version      1.0
// @namespace    http://tampermonkey.net/
// @description  This user script modifies the appearance and behavior of the KeepChatGPT user script on the OpenAI Chat page. It removes the banner text to make it less intrusive. Additionally, it adjusts certain color schemes for better visibility.The script ensures that all functionality provided by the KeepChatGPT user script remains intact and accessible.
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472665/KeepChatGPT%20Disable%20Banner%20but%20keep%20Options%20and%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/472665/KeepChatGPT%20Disable%20Banner%20but%20keep%20Options%20and%20Settings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeTextAndAdjustHeight(target) {
        if (target.id === 'kcg') {
            target.textContent = '';
            target.style.height = '1px';
            target.style.padding = '5px';
        }
    }

    function modifyStyles() {
        // Remove @keyframes gradient and .shine::before
        let styleSheets = document.styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
            let rules = styleSheets[i].cssRules;
            for (let j = 0; j < rules.length; j++) {
                if (rules[j].name === 'gradient' || (rules[j].selectorText && rules[j].selectorText.includes('.shine::before'))) {
                    styleSheets[i].deleteRule(j);
                    j--;
                }
            }
        }

        // Create a new style element for modifying .kgold, .kmenu, and .checked path
        let style = document.createElement('style');
        style.textContent = `
            .kgold {
                color: #000000 !important;
                background: #202123 !important;
            }
            .kmenu {
                background-color: #000000 !important;
            }
            .checked path {
                fill: #30D158 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Call the function to initially apply the styles
    modifyStyles();

    // Observe the document body for added nodes
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.id === 'kcg') {
                        removeTextAndAdjustHeight(node);
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();