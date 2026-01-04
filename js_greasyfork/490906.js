// ==UserScript==
// @name           Return the votes
// @name:ru        Вернуть голоса
// @description    Returns votes under comments
// @description:ru Возвращает голоса под комментариями
// @namespace      http://tampermonkey.net/
// @version        0.0.10
// @author         he-thinks
// @license        MIT
// @match          https://habr.com/*
// @icon           https://habr.com/favicon.ico
// @grant          GM_xmlhttpRequest
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/491004/Return%20the%20votes.user.js
// @updateURL https://update.greasyfork.org/scripts/491004/Return%20the%20votes.meta.js
// ==/UserScript==

(() => {
    const targetScriptRegex = /^https:\/\/assets\.habr\.com\/habr-web\/js\/app\.[a-f0-9]{8}\.js$/;
    const replacementScriptSrc = 'https://gist.githubusercontent.com/he-thinks/e8eabfd94c970959202f4f55702984ce/raw/c38d337af4cbc2061c926f1e52ef3109b43ca1d0/app.XXX.js';

    function replaceScript(node) {
        if (targetScriptRegex.test(node.src)) {
            node.remove();
            GM_xmlhttpRequest({
                method: 'GET',
                url: replacementScriptSrc,
                onload: function(response) {
                    const newNode = document.createElement('script');
                    newNode.innerHTML = response.responseText;
                    document.body.appendChild(newNode);
                }
            });
        }
    }

    new MutationObserver(mutationsList => {
        mutationsList.forEach(mutationRecord => {
            [...mutationRecord.addedNodes]
                .filter(node => node.tagName === 'SCRIPT' && node.src)
                .forEach(node => replaceScript(node));
        });
    }).observe(document, { childList: true, subtree: true });
})();