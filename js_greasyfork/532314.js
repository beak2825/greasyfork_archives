// ==UserScript==
// @name         Torn Chat 3.0 Enhanced
// @namespace    https://greasyfork.org/en/users/1431907-theeeunknown
// @version      2.0
// @description  JUST TEST IT
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        none
// @license       MIT
// @author        TR0LL
// @downloadURL https://update.greasyfork.org/scripts/532314/Torn%20Chat%2030%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/532314/Torn%20Chat%2030%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Replicate Chat 2.0 footer button styling */
        .root___oWxEV .root___WHFbh.root___K2Yex.root___RLOBS,
        .root___oWxEV .root___WHFbh.root___J_YsG,
        .root___oWxEV .root___WHFbh.root___qYx89 {
            width: 30px !important;
            height: 30px !important;
            min-width: 30px !important;
            min-height: 30px !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background-color: #8faeb4 !important;
            border: none !important;
            box-shadow: 0 1px 0 #FFFFFF40 !important;
            position: relative !important;
        }

        /* SVG icon sizing */
        .root___oWxEV .root___WHFbh svg.icon___qhStJ,
        .root___oWxEV .root___WHFbh svg.icon___M_Izz {
            width: 20px !important;
            height: 20px !important;
        }

        /* Hover state */
        .root___oWxEV .root___WHFbh.root___K2Yex.root___RLOBS:hover,
        .root___oWxEV .root___WHFbh.root___J_YsG:hover,
        .root___oWxEV .root___WHFbh.root___qYx89:hover {
            background-color: #638c94 !important;
        }

        /* Style avatar for private DM buttons */
        .root___oWxEV .root___WHFbh.root___qYx89 .root___og9y7 {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 1 !important;
        }

        .root___oWxEV .root___WHFbh.root___qYx89 .avatar____xf4S {
            width: 24px !important;
            height: 24px !important;
            border-radius: 50% !important;
        }

        /* Tooltip styling */
        .root___oWxEV .root___WHFbh.root___qYx89 .username-tooltip {
            visibility: hidden;
            position: absolute;
            z-index: 10;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            text-align: center;
            border-radius: 6px;
            padding: 5px;
            margin-bottom: 5px;
            opacity: 0;
            transition: opacity 0.3s;
            white-space: nowrap;
        }

        .root___oWxEV .root___WHFbh.root___qYx89:hover .username-tooltip {
            visibility: visible;
            opacity: 1;
        }

        /* Hide name text */
        .root___oWxEV .root___WHFbh.root___qYx89 .name___G7zfS {
            display: none !important;
        }
    `;
    document.documentElement.appendChild(styleElement);

    function setupButtonFunctionality() {
        // Add tooltip to private chat buttons with avatars
        const privateButtons = document.querySelectorAll('.root___oWxEV .root___WHFbh.root___qYx89');

        privateButtons.forEach(button => {
            // Check if tooltip already exists
            if (button.querySelector('.username-tooltip')) return;

            const nameSpan = button.querySelector('.name___G7zfS');
            if (nameSpan) {
                const username = nameSpan.textContent;

                // Create tooltip element
                const tooltipElement = document.createElement('span');
                tooltipElement.classList.add('username-tooltip');
                tooltipElement.textContent = username;

                // Append tooltip to button
                button.appendChild(tooltipElement);
            }
        });

        const chat3Footer = document.querySelector('.root___oWxEV');
        const chat2Footer = document.querySelector('.chat-app__footer-wrapper___Ff3cX');

        if (chat3Footer && chat2Footer) {
            const existingButtons = chat2Footer.querySelectorAll('button');

            const buttonMap = {
                'Global': '#channel_panel_button\\:public_global',
                'Trade': '#channel_panel_button\\:public_trade',
                'Faction': '#channel_panel_button\\:faction-14365',
                'Notes': '#notes_panel_button',
                'People': '#people_panel_button',
                'Settings': '#notes_settings_button'
            };

            existingButtons.forEach(button => {
                const title = button.getAttribute('title');
                const targetSelector = buttonMap[title];

                if (targetSelector) {
                    button.addEventListener('click', () => {
                        const targetButton = document.querySelector(targetSelector);
                        if (targetButton) {
                            targetButton.click();
                        }
                    });
                }
            });
        }
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                setupButtonFunctionality();
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    setupButtonFunctionality();
})();