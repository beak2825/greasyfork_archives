// ==UserScript==
// @name         Kimoivod+Douban
// @namespace    http://tampermonkey.net/
// @version      2025-01-31
// @description  quick link to douban
// @author       Silvio27
// @match        https://kimivod.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kimivod.com
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/525428/Kimoivod%2BDouban.user.js
// @updateURL https://update.greasyfork.org/scripts/525428/Kimoivod%2BDouban.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let sifyModule;
    async function getSimplifiedTitle(bookTitle) {
        try {
            if (!sifyModule) {
                const { sify } = await import('https://cdn.jsdelivr.net/npm/chinese-conv@3.2.2/dist/index.min.js');
                sifyModule = sify;
            }
            return sifyModule(bookTitle);
        } catch (error) {
            console.error('Failed to import module:', error);
            return null;
        }
    }

    async function processBookTitle() {
        const titleElement = document.querySelector(".title");
        if (!titleElement) {
            console.error('Title element not found.');
            return;
        }
        const originalTitle = titleElement.innerHTML;
        const simplifiedTitle = await getSimplifiedTitle(originalTitle);
        if (simplifiedTitle) {
            const linkHtml = `<a href="https://www.douban.com/search?q=${encodeURIComponent(simplifiedTitle)}" target="_blank" style="color: #007722; text-decoration: none;">${simplifiedTitle}</a>`;
            titleElement.innerHTML = linkHtml;
        }
    }

    function removeAdvertisements() {
        const container = document.querySelector('article');
        if (container) {
            const adDivs = container.querySelectorAll('a > div');
            adDivs.forEach(div => {
                if (div.innerText === "AD") {
                    div.parentElement.parentElement.style.display = "none";
                }
            });
        }
    }

    processBookTitle().catch(error => {
        console.error('Error processing book title:', error);
    });
    removeAdvertisements();

})();