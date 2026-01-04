// ==UserScript==
// @name         展示店铺标签app_id
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  展示小鹅通b端列表的appid-勿外传
// @author       You
// @match        https://admin.xiaoe-tech.com/t/account/muti_index
// @match        https://admin.elink.ai/t/account/muti_index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoe-tech.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519694/%E5%B1%95%E7%A4%BA%E5%BA%97%E9%93%BA%E6%A0%87%E7%AD%BEapp_id.user.js
// @updateURL https://update.greasyfork.org/scripts/519694/%E5%B1%95%E7%A4%BA%E5%BA%97%E9%93%BA%E6%A0%87%E7%AD%BEapp_id.meta.js
// ==/UserScript==

(function() {
    var fnTimer = null;
    fnTimer = setInterval((function() {
        var dom_arr = document.querySelectorAll(".hide-style");
        if (dom_arr.length) {
            clearInterval(fnTimer);
            fnTimer = null;
            for (var i = 0; i < dom_arr.length; i++) {
                dom_arr[i].style.display = "block";
            }
        }
    }), 1e3);
})();