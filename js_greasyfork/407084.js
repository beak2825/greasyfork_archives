// ==UserScript==
// @name         屏蔽segmentfault登录弹框
// @namespace    http://tampermonkey.net/
// @icon         https://assets.segmentfault.com/v-5f084613/global/img/favicon.ico
// @version      0.1
// @license      MIT
// @namespace    http://tampermonkey.net/
// @description  屏蔽sf的登录弹窗
// @author       renjiaxin
// @match        https://segmentfault.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407084/%E5%B1%8F%E8%94%BDsegmentfault%E7%99%BB%E5%BD%95%E5%BC%B9%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/407084/%E5%B1%8F%E8%94%BDsegmentfault%E7%99%BB%E5%BD%95%E5%BC%B9%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    var sss = document.getElementsByClassName("modal-content");
    sss[0].style.display="none"
})();