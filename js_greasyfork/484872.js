// ==UserScript==
// @name         隐藏Epoint提醒
// @namespace    http://tampermonkey.net/
// @version      2024-12-03
// @description  隐藏新点每日提醒
// @author       Whoami
// @match        https://oa.epoint.com.cn/epointoa9/frame/fui/pages/themes/aide/aide?pageId=aide
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epoint.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484872/%E9%9A%90%E8%97%8FEpoint%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/484872/%E9%9A%90%E8%97%8FEpoint%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var loadingDiv = document.getElementById("loading");
     loadingDiv.style.display = "none";
    //
    document.getElementsByClassName("top-notice")[0].style.display = "none";
    document.getElementById("main").style.top='60px';
})();