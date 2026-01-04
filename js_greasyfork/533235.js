// ==UserScript==
// @name         Discord Image Unwrapper (Obfuscation-Resistant)
// @namespace    https://greasyfork.org/en/scripts/533235-discord-image-unwrapper-obfuscation-resistant
// @version      1.1
// @description  Removes image wrappers on Discord.com regardless of class obfuscation, useful when opening images
// @author       Cragsand
// @license      MIT
// @match        *://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533235/Discord%20Image%20Unwrapper%20%28Obfuscation-Resistant%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533235/Discord%20Image%20Unwrapper%20%28Obfuscation-Resistant%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function unwrapImages() {
        const candidates = document.querySelectorAll('div[class*="imageWrapper_"]');
        candidates.forEach(wrapper => {
            const classList = Array.from(wrapper.classList);
            const hasImageWrapper = classList.some(cls => cls.startsWith('imageWrapper_'));
            const hasMedia = classList.some(cls => cls.startsWith('media_'));

            if (hasImageWrapper && hasMedia && !wrapper.dataset.unwrapped) {
                const img = wrapper.querySelector('img');
                if (img) {
                    wrapper.dataset.unwrapped = "true";
                    const imgClone = img.cloneNode(true);
                    wrapper.replaceWith(imgClone);
                }
            }
        });
    }

    // Observe changes to the DOM
    const observer = new MutationObserver(() => unwrapImages());
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    unwrapImages();
})();
