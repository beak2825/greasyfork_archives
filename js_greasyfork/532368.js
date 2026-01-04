// ==UserScript==
// @name         Torn Chat 3.0 Enhanced V2 UNRELEASED
// @namespace    https://greasyfork.org/en/users/1431907-theeeunknown
// @version      2.1
// @description  JUST TEST IT
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @author       TR0LL
// @downloadURL https://update.greasyfork.org/scripts/532368/Torn%20Chat%2030%20Enhanced%20V2%20UNRELEASED.user.js
// @updateURL https://update.greasyfork.org/scripts/532368/Torn%20Chat%2030%20Enhanced%20V2%20UNRELEASED.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styleElement = document.createElement('style');
    styleElement.textContent = `
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
            background-color: #111111 !important;
            border: none !important;
            box-shadow: 0 1px 0 #FFFFFF20 !important;
            position: relative !important;
        }

        .root___oWxEV .root___WHFbh svg.icon___qhStJ g,
        .root___oWxEV .root___WHFbh svg.icon___M_Izz g {
            fill: #555555 !important;
        }

        .root___oWxEV .root___WHFbh svg [fill*="url(#icon_gradient"] {
            fill: #555555 !important;
        }

        .root___oWxEV .root___WHFbh svg.icon___qhStJ path,
        .root___oWxEV .root___WHFbh svg.icon___M_Izz path,
        .root___WHFbh.root___K2Yex.header___hEWvp .icon___q4KYz path {
            stroke: #333333 !important;
            stroke-width: 0.2px !important;
        }

        .root___oWxEV .root___WHFbh svg.icon___qhStJ,
        .root___oWxEV .root___WHFbh svg.icon___M_Izz {
            width: 20px !important;
            height: 20px !important;
            filter: contrast(1.5) !important;
        }

        .root___oWxEV .root___WHFbh.root___K2Yex.root___RLOBS:hover,
        .root___oWxEV .root___WHFbh.root___J_YsG:hover,
        .root___oWxEV .root___WHFbh.root___qYx89:hover {
            background-color: #0a0a0a !important;
        }

        .root___oWxEV .root___WHFbh.root___qYx89 {
            width: auto !important;
            min-width: 90px !important;
            max-width: 120px !important;
            height: 30px !important;
            padding: 0 5px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
        }

        .root___oWxEV .root___WHFbh.root___qYx89 .root___og9y7,
        .root___oWxEV .root___WHFbh.root___qYx89 img {
            display: none !important;
        }

        .root___oWxEV .root___WHFbh.root___qYx89 .name___G7zfS {
            display: block !important;
            color: #aaaaaa !important;
            font-size: 12px !important;
            margin-left: 5px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            text-shadow: 0 0 1px #000 !important;
        }

        .root___oWxEV .root___WHFbh.root___qYx89::after {
            content: "" !important;
            position: absolute !important;
            top: 10px !important;
            right: 7px !important;
            width: 8px !important;
            height: 8px !important;
            border-radius: 50% !important;
            background-color: #45b145 !important;
        }

        .root___oWxEV .root___WHFbh.root___qYx89:has(.offline___zPUKs)::after {
            background-color: #7f8c8d !important;
        }

        .root___oWxEV .root___WHFbh.root___qYx89:has(.idle___n5TKn)::after {
            background-color: #f1c40f !important;
        }

        .root___oWxEV .root___WHFbh.opened___kN9vs {
            background-color: #181818 !important;
        }

        .root___WHFbh.root___K2Yex.header___hEWvp {
            background-color: #111111 !important;
        }

        .root___WHFbh.root___K2Yex.header___hEWvp .title___Bmq5P {
            color: #aaaaaa !important;
        }

        .root___WHFbh.root___K2Yex.header___hEWvp .icon___q4KYz g {
            fill: #555555 !important;
        }

        .root___WHFbh.root___K2Yex.header___hEWvp [fill*="url(#icon_gradient"] {
            fill: #555555 !important;
        }

        /* Mobile-specific styling removed - using website defaults */
    `;
    document.documentElement.appendChild(styleElement);

    function setupButtonFunctionality() {
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

    // Standard button functionality without mobile customizations
    function setupButtonFunctionality() {
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