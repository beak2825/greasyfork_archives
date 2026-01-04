// ==UserScript==
// @name           Auto Continue Generating in ChatGPT
// @namespace      Auto Continue Generating in ChatGPT
// @version        1.3
// @author         Nameniok
// @description    Auto Continue Generating in ChatGPT (only the necessary code)
// @run-at         document-idle
// @match          https://chat.openai.com/*
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/486529/Auto%20Continue%20Generating%20in%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/486529/Auto%20Continue%20Generating%20in%20ChatGPT.meta.js
// ==/UserScript==

let AutoContinueButton;
(async () => {
    if (!AutoContinueButton) {
        AutoContinueButton = new MutationObserver(mutations =>
            mutations.forEach(mutation => {
                if (mutation.attributeName == 'style' && mutation.target.style.opacity == '1') {
                    document.querySelectorAll('button').forEach(button => {
                        if (button.textContent.includes('Continue generating')) {
                            button.click();
                        } else if (button.classList.contains('btn') && button.classList.contains('relative') && button.classList.contains('btn-neutral') && button.classList.contains('whitespace-nowrap') && button.classList.contains('border-0') && button.classList.contains('md:border')) {
                            button.click();
                        }
                    });
                }
            })
        );
        AutoContinueButton.observe(document.querySelector('main'), { attributes: true, subtree: true });
    }
})();
