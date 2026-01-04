// ==UserScript==
// @name           serpFilter
// @namespace      aumakua
// @version        1.2.0
// @description    Remove crappy yandex zen (and any other sites) from yandex and google search results.
// @description:ru Удаляет ссылки на Яндекс.Дзен (можно добавлять и другие сайты) из результатов поиска гугла и яндекса.
// @author         aumakua
// @license        MIT
// @match          *://*ya.ru/search*
// @match          *://*yandex.ru/search*
// @match          *://google.com/search*
// @match          *://www.google.com/search*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/419188/serpFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/419188/serpFilter.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let snippet_id = '';
    const crap = ['zen.yandex.ru', 'zen.yandex.com', 'dzen.ru']; // you can add other crappy sites here

    if (document.location.hostname.includes('ya.ru') || document.location.hostname.includes('yandex.ru')) {
        snippet_id = 'li:has(div.organic)';
    }
    else if (document.location.hostname.includes('google')) {
        snippet_id = 'div.g';
    }

    const remove_crap = () => {
        const snippets = document.querySelectorAll(snippet_id);
        for (let snippet of snippets) {
            const links = snippet.querySelectorAll('a');
            something:
            for (let link of links) {
                for (let piece of crap) {
                    if (link.href.includes(piece)) {
                        snippet.style.display = 'none';
                        break something;
                    }
                }
            }
        }
    };

    remove_crap();
})();
