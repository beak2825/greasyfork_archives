// ==UserScript==
// @name         Auto GPT-4o-mini on ChatGPT
// @namespace    https://chat.openai.com/
// @version      1.1
// @description  Automatically switch between GPT-4o to GPT-4o-mini
// @author       Marek Sawicki
// @match        https://chat.openai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529276/Auto%20GPT-4o-mini%20on%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/529276/Auto%20GPT-4o-mini%20on%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function selectModel() {
        const modelSelector = document.querySelector('[data-testid="model-selector"]');
        if (modelSelector) {
            modelSelector.click();
            setTimeout(() => {
                const dropdown = document.querySelector("div[role='menu']");
                if (dropdown) {
                    const miniModel = [...dropdown.querySelectorAll('button')].find(el => el.textContent.includes('GPT-4o-mini'));
                    if (miniModel) {
                        miniModel.click();
                        console.log('GPT-4o-mini selected');
                    }
                }
            }, 500);
        }
    }

    function checkAndSelectModel() {
        setTimeout(() => {
            if (document.body.innerText.includes('GPT-4o')) {
                selectModel();
            }
        }, 1000);
    }

    const observer = new MutationObserver(checkAndSelectModel);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', checkAndSelectModel);
})();
