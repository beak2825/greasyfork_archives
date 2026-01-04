// ==UserScript==
// @name         PikabuStoriesCleaner
// @license      MIT
// @namespace    https://pikabu.ru/
// @version      0.2
// @description  Автоматическое удаление постов без рейтинга или с отрицательным рейтингом в горячем и лучшем
// @author       You
// @match        https://pikabu.ru/
// @match        https://pikabu.ru/best
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/470060/PikabuStoriesCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/470060/PikabuStoriesCleaner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const observer = new MutationObserver((mutations) =>
        mutations.forEach((mutation) =>
            mutation.addedNodes.forEach((node) => {
                if (
                    node instanceof HTMLElement &&
                    node.tagName === 'ARTICLE' &&
                    node.className.includes('story')
                ) {
                    const text = node.querySelector('.story__rating-count')?.innerText;

                    const rating = Number(text || 0);

                    if (rating <= 0) {
                        node.remove();
                    }
                }
            })
        )
    );

    const container = document.querySelector('body');

    observer.observe(container, { childList: true, subtree: true });
})();
