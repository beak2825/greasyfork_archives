// ==UserScript==
// @name         Hide Twitter Timeline
// @namespace    https://github.com/ganyariya/ganyariya
// @version      1.1
// @description  Hide your twitter timeline
// @author       ganyariya
// @match        https://twitter.com/*
// @icon         https://image.flaticon.com/icons/png/512/124/124021.png
// @grant    GM_addStyle
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/428329/Hide%20Twitter%20Timeline.user.js
// @updateURL https://update.greasyfork.org/scripts/428329/Hide%20Twitter%20Timeline.meta.js
// ==/UserScript==

let lastUrl = "";
const permitList = ["/notifications", "/messages", "/i/bookmarks"];

(function() {
    // URL の変更を検知する
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            changeCSS();
        }
    }).observe(document, {subtree: true, childList: true});

    // 許可されたサイト以外見せない
    function changeCSS() {
        const pathName = location.pathname;

        if (!permitList.includes(pathName))  GM_addStyle("section {display: none !important;}");
        else GM_addStyle("section {display: block !important;}");
    }
})();