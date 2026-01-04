// ==UserScript==
// @name    Twitter Promotion Deleter
// @namespace    http://tampermonkey.net/
// @version    0.1
// @description    Twitterの広告削除
// @author    Chippppp
// @license    MIT
// @match    https://twitter.com/home*
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/458280/Twitter%20Promotion%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/458280/Twitter%20Promotion%20Deleter.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const deletePromotions = () => {
        for (let promotion of document.getElementsByClassName("r-1bwzh9t r-4qtqp9 r-yyyyoo r-1q142lx r-ip8ujx r-1d4mawv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr")) {
            promotion.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = "none";
        }
    };

    const observer = new MutationObserver(records => {
        deletePromotions();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();