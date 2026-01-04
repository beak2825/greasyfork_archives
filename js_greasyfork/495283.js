// ==UserScript==
// @name         text replace
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Replace text on the page
// @author       JoinSummer
// @match        *://*.weibo.*/*
// @match        *://*.baidu.*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495283/text%20replace.user.js
// @updateURL https://update.greasyfork.org/scripts/495283/text%20replace.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replacements = new Map([
        ['习近平', '村长'],
        ['关键词1', '替换1'],
        ['关键词2', '替换2'],
    ]);


    function replaceText(node) {
      console.log(node.nodeType,node.nodeValue)
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            replacements.forEach((value, key) => {
                const regex = new RegExp(key, 'g');
                text = text.replace(regex, value);
            });
            node.nodeValue = text;
        } else {
            node.childNodes.forEach(replaceText);
        }
    }

    replaceText(document.body);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                replaceText(node);
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();