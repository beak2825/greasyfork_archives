// ==UserScript==
// @name         古剑逍遥辅助
// @namespace    https://greasyfork.org/zh-CN/users/19988800
// @version       1.11
// @description  古剑逍遥
// @author       米奇
// @match        https://wechat.quwannet.cn/*
// @include      https://wechat.quwannet.cn/*
// @run-at document-end
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/446468/%E5%8F%A4%E5%89%91%E9%80%8D%E9%81%A5%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/446468/%E5%8F%A4%E5%89%91%E9%80%8D%E9%81%A5%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
setTimeout(function(){ // 删除红包图标
    document.querySelector("#app > div > div > div.float_button > div > div > img").remove();
    document.querySelector("#app > div > div > div.float_button > div > div").remove();
    document.querySelector("#app > div > div > div.float_button > div").remove();
}, 5000);

})();