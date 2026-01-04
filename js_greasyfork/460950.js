// ==UserScript==
// @name        Twitter Cleaner
// @name:zh-cn  Twitter 清理
// @description    clean pointless article.
// @description:zh-cn 隐藏一些无用的文章，关注媒体。
// @version     0.2
// @author      tone
// @namespace   none
// @match       https://x.com/*
// @match       https://tweetdeck.x.com/*
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @match       https://tweetdeck.twitter.com/*
// @compatible  Chrome
// @compatible  Firefox
// @downloadURL https://update.greasyfork.org/scripts/460950/Twitter%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/460950/Twitter%20Cleaner.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

const cleaner = {

    clean(node) {
        if (node.querySelector('img[alt="peing"]')) {
            node.style.height = '72px';

        }
        node.dataset.cleaned = 'true';
    }
};

(function () {

    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(node => {
        let article = node.tagName == 'ARTICLE' && node || node.tagName == 'DIV' && (node.querySelector('article') || node.closest('article'));
        if (article && !article.dataset.cleaned) cleaner.clean(article);
    }))).observe(document.body, {childList: true, subtree: true});
})();
