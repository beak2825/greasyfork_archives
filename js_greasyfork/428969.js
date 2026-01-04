// ==UserScript==
// @name         自动刷单
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  99自动刷单
// @author       You
// @match        https://web.jiujiupingou.com/ManyPG/ManyPG*
// @match        https://web.jiujiupingou.com/AD/*
// @icon         https://www.google.com/s2/favicons?domain=jiujiupingou.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428969/%E8%87%AA%E5%8A%A8%E5%88%B7%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/428969/%E8%87%AA%E5%8A%A8%E5%88%B7%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
// @run-at       document-body
setInterval(function () { //每5秒刷新一次图表
         //需要执行的代码写在这里
    var arr = ['active','layui-layer-btn0','immediately-pay','to-pay','join-now',]
const strs = `.${arr.join(',.')}`
Array.from(document.querySelectorAll(strs)).forEach(el => {
  el.click()
})

    }, 2000);

    // Your code here...
})();