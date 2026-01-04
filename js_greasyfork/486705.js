// ==UserScript==
// @name         Keyboard shortcut for switching between Chat GPT 4o mini and Chat GPT 4o
// @author       NWP
// @description  Switch between Chat GPT 4o mini and Chat GPT 4o for Superpower ChatGPT and OpenAI when Ctrl + Alt + Shift is pressed
// @namespace    https://greasyfork.org/users/877912
// @version      0.5
// @license      MIT
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486705/Keyboard%20shortcut%20for%20switching%20between%20Chat%20GPT%204o%20mini%20and%20Chat%20GPT%204o.user.js
// @updateURL https://update.greasyfork.org/scripts/486705/Keyboard%20shortcut%20for%20switching%20between%20Chat%20GPT%204o%20mini%20and%20Chat%20GPT%204o.meta.js
// ==/UserScript==

(function () {
    'use strict';


    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.altKey && e.shiftKey) {
            try {
                const selectedModel_superpowerchatgpt = document.getElementById('navbar-selected-model-title');
                if (!selectedModel_superpowerchatgpt) {
                    throw new Error('Selected element not found for superpowerchatgpt');
                }
                if (selectedModel_superpowerchatgpt) toggleModel_superpowerchatgpt(selectedModel_superpowerchatgpt);
            } catch (error) {
                console.error('Error occurred in toggleModel_superpowerchatgpt:', error);
            }

            try {
                let selectedModel_openai = document.querySelector('span.text-token-text-secondary:not([class*=" "])');
                if (!selectedModel_openai) {
                    throw new Error('Selected element not found for OpenAI');
                }
                if (selectedModel_openai) toggleModel_OpenAI(selectedModel_openai.innerText);
            } catch (error) {
                console.error('Error occurred in toggleModel_OpenAI:', error);
            }
        }
    });


    function toggleModel_superpowerchatgpt(selectedModel_superpowerchatgpt) {

        const selectedModel_superpowerchatgptText = selectedModel_superpowerchatgpt.innerText;
        const switchButton_superpowerchatgpt = document.getElementById('navbar-model-switcher-button');

        if (!switchButton_superpowerchatgpt) {
            throw new Error('Switch button element not found');
        }

        if (selectedModel_superpowerchatgptText.includes('4o mini')) {
            switchButton_superpowerchatgpt.click();
            const gpt4oOption = document.getElementById('navbar-model-switcher-option-gpt-4o');
            if (!gpt4oOption) {
                throw new Error('GPT-4o option element not found');
            }
            gpt4oOption.click();
        } else {
            switchButton_superpowerchatgpt.click();
            const gpt4oMiniOption = document.getElementById('navbar-model-switcher-option-gpt-4o-mini');
            if (!gpt4oMiniOption) {
                throw new Error('GPT-4o mini option element not found');
            }
            gpt4oMiniOption.click();
        }
    }
    function toggleModel_OpenAI(modelText) {
        try {
            clickDropdown();

            const observer = new MutationObserver((mutations, obs) => {
                try {
                    const dropdownContent = document.querySelector('div[data-radix-popper-content-wrapper=""]');
                    if (dropdownContent) {
                        dropdownContent.style.visibility = "hidden";
                        obs.disconnect();
                        selectModel(modelText.includes('4o mini') ? 'GPT-4o' : '4o mini');
                    }
                } catch (error) {
                    console.error("Error in MutationObserver callback: ", error);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        } catch (error) {
            console.error("Error in toggleModel_OpenAI: ", error);
        }
    }

    function clickDropdown() {
        try {
            let selectedModel_openai = document.querySelector('span.text-token-text-secondary:not([class*=" "])');
            if (!selectedModel_openai) return console.log("Element not found");

            ['pointerdown', 'pointerout', 'pointerleave', 'mouseout', 'mouseleave'].forEach(eventType => {
                selectedModel_openai.dispatchEvent(new PointerEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
            });
        } catch (error) {
            console.error("Error in clickDropdown: ", error);
        }
    }

    function selectModel(modelName) {
        try {
            let menuItems = Array.from(document.querySelectorAll('div[role="menuitem"]'));
            let targetItem = menuItems.find(item => item.textContent.includes(modelName));

            if (targetItem) targetItem.click();
            else console.log(`No elements with "${modelName}" found`);
        } catch (error) {
            console.error("Error in selectModel: ", error);
        }
    }
})();