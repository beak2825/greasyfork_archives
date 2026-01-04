// ==UserScript==
// @name         禁术 降鸡! 给蔡徐坤降级处罚
// @icon         https://www.bilibili.com/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/scripts/430145
// @version      0.3
// @description  给坤坤的B站页面进行一个降级处理，让显示的等级变成1级
// @author       prayjourney
// @match        https://space.bilibili.com/324287009
// @grant        no
// @supportURL   https://gitee.com/zuiguangyin123/bilibili-doc/blob/master/myscript/punish_cxk.js
// @homepageURL  https://gitee.com/zuiguangyin123/bilibili-doc/blob/master/myscript/punish_cxk.js
// @downloadURL https://update.greasyfork.org/scripts/430145/%E7%A6%81%E6%9C%AF%20%E9%99%8D%E9%B8%A1%21%20%E7%BB%99%E8%94%A1%E5%BE%90%E5%9D%A4%E9%99%8D%E7%BA%A7%E5%A4%84%E7%BD%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/430145/%E7%A6%81%E6%9C%AF%20%E9%99%8D%E9%B8%A1%21%20%E7%BB%99%E8%94%A1%E5%BE%90%E5%9D%A4%E9%99%8D%E7%BA%A7%E5%A4%84%E7%BD%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("接招吧，蔡徐坤！");
    window.onload = function() {
        let param = document.getElementById('h-gender');
        // 获取相邻的子元素a标签
        let alevel =param.nextElementSibling;
        // 设置属性完成修改
        alevel.setAttribute("lvl","1");
    }
})();