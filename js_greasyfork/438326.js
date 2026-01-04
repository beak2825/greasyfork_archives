// ==UserScript==
// @name         GuildRemover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ololo
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/home.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/438326/GuildRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/438326/GuildRemover.meta.js
// ==/UserScript==

(function (window, undefined) {
    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }
    Array.from(document.getElementsByClassName("home_scroll_content")).forEach(elem => {
        if (elem.innerText.includes("Рейнджеров") || elem.innerText.includes("Кузнецов") || elem.innerText.includes("Оружейников")) {
            elem.remove()
        }
    })

})(window);