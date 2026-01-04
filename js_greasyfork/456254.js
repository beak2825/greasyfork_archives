// ==UserScript==
// 
// @name         CSDN免登录复制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description   不用登录CSDN就可以复制代码
// @author       Meteor_Z
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456254/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/456254/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
      let code = document.querySelectorAll("code");
    for (let i = 0; i < code.length; i++)
    {
        code[i].contentEditable = "true";
    }
})();