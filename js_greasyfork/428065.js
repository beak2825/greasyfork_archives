// ==UserScript==
// @name         墨刀可操作控件高亮
// @namespace    https://www.52pojie.cn/home.php?mod=space&uid=1130153
// @version      0.2
// @description  墨刀看原型有时候不知道哪里能点就很烦，遂有此脚本
// @author       吾爱破解@黄hsir
// @icon         https://v6.modao.cc/mb-workspace/vis/modao/favicon.ico
// @grant        none
// @include      *://*.modao.cc/*
// @include      *modao.cc/*
// @downloadURL https://update.greasyfork.org/scripts/428065/%E5%A2%A8%E5%88%80%E5%8F%AF%E6%93%8D%E4%BD%9C%E6%8E%A7%E4%BB%B6%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/428065/%E5%A2%A8%E5%88%80%E5%8F%AF%E6%93%8D%E4%BD%9C%E6%8E%A7%E4%BB%B6%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    setInterval(() => {$('.region').css("display", "block")}, 100)
})();