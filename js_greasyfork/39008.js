// ==UserScript==
// @name         HWM_DisableRefresh
// @namespace    Небылица
// @version      1.1
// @description  Отключает автообновление функцией Refresh()
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/.+/
// @exclude      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/(login|war|cgame|campaign|frames|chat|chatonline|ch_box|chat_line|ticker|chatpost)\.php.*/
// @downloadURL https://update.greasyfork.org/scripts/39008/HWM_DisableRefresh.user.js
// @updateURL https://update.greasyfork.org/scripts/39008/HWM_DisableRefresh.meta.js
// ==/UserScript==

(function() {
    "use strict";

    var script = document.createElement("script");

    script.type = "text/javascript";
    script.innerHTML = "function Refresh(){};";

    document.getElementsByTagName("body")[0].appendChild(script);
})();