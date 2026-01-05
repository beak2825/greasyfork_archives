// ==UserScript==
// @name                Qidian score autoclick
// @name:ZH-CN          起点中文经验值自动签到
// @namespace           http://tampermonkey.net/
// @version             1.9
// @description         Open the score site and let the script do all the click!
// @description:ZH-CN   打开领取经验值的页面，然后让脚本在后台自动处理所有工作！
// @author              SLAPaper
// @include             /^https?://my\.qidian\.com/level/
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/28375/Qidian%20score%20autoclick.user.js
// @updateURL https://update.greasyfork.org/scripts/28375/Qidian%20score%20autoclick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clicker() {
        let expList = document.getElementsByClassName("elGetExp");

        if (expList.length > 0) {
            expList[0].click();
        }
    }

    function refresher() {
        window.location.reload(true);
    }

    window.addEventListener("load", clicker);
    setInterval(clicker, 60*1000);
    setInterval(refresher, 30*60*1000); // handle cross day or browser sleep
})();