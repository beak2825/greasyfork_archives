// ==UserScript==
// @name         去除网页前台、后台、焦点、失焦的限制
// @namespace    https://github.com/GXhunter/
// @version      1.2
// @description  Removes all visibilitychange, pagehide, and beforeunload events from the page
// @match        *://*/*
// @license MIT
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543583/%E5%8E%BB%E9%99%A4%E7%BD%91%E9%A1%B5%E5%89%8D%E5%8F%B0%E3%80%81%E5%90%8E%E5%8F%B0%E3%80%81%E7%84%A6%E7%82%B9%E3%80%81%E5%A4%B1%E7%84%A6%E7%9A%84%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/543583/%E5%8E%BB%E9%99%A4%E7%BD%91%E9%A1%B5%E5%89%8D%E5%8F%B0%E3%80%81%E5%90%8E%E5%8F%B0%E3%80%81%E7%84%A6%E7%82%B9%E3%80%81%E5%A4%B1%E7%84%A6%E7%9A%84%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
 
(function () {
    const stopEventPropagation = (event) => {
        event.stopImmediatePropagation()
        event.stopPropagation();
        event.preventDefault();
    };
    unsafeWindow.addEventListener('visibilitychange', stopEventPropagation, true);
    unsafeWindow.addEventListener('pagehide', stopEventPropagation, true);
    unsafeWindow.addEventListener('beforeunload', stopEventPropagation, true);
    unsafeWindow.addEventListener('blur', stopEventPropagation, true);
    unsafeWindow.addEventListener('focus', stopEventPropagation, true);
    unsafeWindow.onfocus = null
    unsafeWindow.onblur = null
    unsafeWindow.onpagehide = null
    unsafeWindow.onbeforeunload = null
})();