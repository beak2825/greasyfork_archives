// ==UserScript==
// @name         LazyLeader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ololo
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/map.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/449062/LazyLeader.user.js
// @updateURL https://update.greasyfork.org/scripts/449062/LazyLeader.meta.js
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

    if (js_map_init_array[5].includes("ldbut1*")) {
        location.replace("/leader_guild.php")
    }
// helpers

})(window);