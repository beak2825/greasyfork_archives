// ==UserScript==
// @name         去哪儿复制文字
// @namespace    https://greasyfork.org/zh-CN/users/104201
// @version      0.2
// @description  手机版去哪儿页面支持复制文字，(๑ˇεˇ๑).¸¸♪ 爱怎么复制就怎么复制。适用于去哪儿度假。
// @author       黄盐
// @match        https://touch.dujia.qunar.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377112/%E5%8E%BB%E5%93%AA%E5%84%BF%E5%A4%8D%E5%88%B6%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/377112/%E5%8E%BB%E5%93%AA%E5%84%BF%E5%A4%8D%E5%88%B6%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll("body *").forEach((ele)=>{
      ele.setAttribute("contentEditable",true);
    });
})();