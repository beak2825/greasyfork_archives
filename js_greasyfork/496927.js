// ==UserScript==
// @name        Добавляем на author.today ссылки на Флибусту
// @namespace   Azazar's Scripts
// @match       https://author.today/*
// @grant       GM_addStyle
// @version     1.1
// @description Добавляем на author.today ссылки на поиск Флибусты
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/496927/%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D1%8F%D0%B5%D0%BC%20%D0%BD%D0%B0%20authortoday%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%BD%D0%B0%20%D0%A4%D0%BB%D0%B8%D0%B1%D1%83%D1%81%D1%82%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/496927/%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D1%8F%D0%B5%D0%BC%20%D0%BD%D0%B0%20authortoday%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%BD%D0%B0%20%D0%A4%D0%BB%D0%B8%D0%B1%D1%83%D1%81%D1%82%D1%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const flubustaUrl = 'https://flibusta.is';
    const linkImageUrl = `${flubustaUrl}/sites/default/files/bluebreeze_favicon.ico`;
    const searchUrl = query => `${flubustaUrl}/booksearch?ask=${encodeURIComponent(query)}`;

    const stylesheet = `.userscript-fb img { margin-left: 5px; vertical-align: middle; height: 1em }`;
    const buildInsertHtml = query => `<a class="userscript-fb" href="${searchUrl(query)}"><img src="${linkImageUrl}"></a>`;
    
    const linkKey = 'flibustaLinkAdded';

    /**
     * Checks if all children of a DOM element are text nodes.
     *
     * @param {Element} domElement - The DOM element to check.
     * @return {boolean} - Returns true if all children are text nodes, otherwise false.
     */
    function isTextOnly(domElement) {
        const childNodes = domElement.childNodes;
        if (childNodes.length === 0) {
            return false;
        }
        for (let i = 0; i < childNodes.length; i++) {
            if (childNodes[i].nodeType !== Node.TEXT_NODE) {
                return false;
            }
        }
        return true;
    }

    function addFantlabLinks(root) {
        root.querySelectorAll('.feed .feed-row, .bookcard, .book-row').forEach(feedRowElement => {
            if (feedRowElement['linkKey']) {
                return;
            }
            feedRowElement['linkKey'] = true;

            let authors = new Set();
            let anchors = Array.from(feedRowElement.querySelectorAll('a[href]')).filter(a => isTextOnly(a) && !a['linkKey']);

            anchors.forEach(anchorElement => {
                let href = anchorElement.getAttribute('href');
                let userMatch = /^\/u\/([^\/]+)/.exec(href);

                if (userMatch) {
                    authors.add(anchorElement.textContent.trim());
                    anchorElement.insertAdjacentHTML('afterend', buildInsertHtml(anchorElement.textContent.trim()));
                }
            });

            anchors.forEach(anchorElement => {
                let href = anchorElement.getAttribute('href');
                let workMatch = /^\/work\/(\d+)/.exec(href);

                if (workMatch) {
                    anchorElement.insertAdjacentHTML('afterend', buildInsertHtml(anchorElement.textContent.trim() + ' ' + Array.from(authors).join(' ')));
                }
            });

            anchors.forEach(anchorElement => anchorElement['linkKey'] = true);
        });
    }

    GM_addStyle(stylesheet);

    addFantlabLinks(document.body);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    addFantlabLinks(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
