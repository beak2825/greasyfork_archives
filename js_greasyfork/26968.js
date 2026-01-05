// ==UserScript==
// @name         Togetterの文字装飾を取り除く
// @description  Togetterのまとめでツイート本文に適用されている文字装飾を取り除きます。
// @namespace    https://github.com/unarist/
// @version      0.1
// @author       unarist
// @match        https://togetter.com/li/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26968/Togetter%E3%81%AE%E6%96%87%E5%AD%97%E8%A3%85%E9%A3%BE%E3%82%92%E5%8F%96%E3%82%8A%E9%99%A4%E3%81%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/26968/Togetter%E3%81%AE%E6%96%87%E5%AD%97%E8%A3%85%E9%A3%BE%E3%82%92%E5%8F%96%E3%82%8A%E9%99%A4%E3%81%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tweet_box = document.querySelector('.tweet_box');

    const clearDecoration = ul => {
        for (const span of ul.querySelectorAll('.tweet span')) {
            const parent = span.parentNode;
            while (span.firstChild) {
                parent.insertBefore(span.firstChild, span);
            }
            parent.removeChild(span);
        }
    };

    new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeName ==='UL') {
                    clearDecoration(node);
                }
            }
        }
    }).observe(tweet_box, {childList: true});

    clearDecoration(tweet_box.querySelector('ul'));
})();