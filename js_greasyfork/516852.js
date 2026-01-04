// ==UserScript==
// @name             Hide Specific Domains in Google Search
// @name:ru          Скрывает указанные домены из результатов поиска Google
// @namespace        http://tampermonkey.net/
// @version          1.7
// @description      Скрывает указанные домены и их поддомены из результатов поиска Google
// @description:en   Hide Specific Domains and Subdomains in Google Search
// @author           Shaman_Lesnoy
// @match            https://www.google.com/search*
// @grant            none
// @license          GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/516852/Hide%20Specific%20Domains%20in%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/516852/Hide%20Specific%20Domains%20in%20Google%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const blockedDomains = [
        "vk.com",
        "rutube.ru",
        "dzen.ru",
        "yandex.ru",
        "yandex.com",
    ];

    function hideResults() {
        const resultBlocks = document.querySelectorAll('div.MjjYud, div.tF2Cxc');

        resultBlocks.forEach(block => {
            const link = block.querySelector('a');
            if (link) {
                try {
                    const domain = new URL(link.href).hostname.replace(/^www\./, '');
                    if (blockedDomains.some(blocked => domain === blocked || domain.endsWith('.' + blocked))) {
                        block.style.display = 'none';
                    }
                } catch (e) {
                }
            }
        });
    }

    const observer = new MutationObserver(() => hideResults());
    observer.observe(document.body, { childList: true, subtree: true });

    hideResults();
})();