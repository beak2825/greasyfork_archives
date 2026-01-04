// ==UserScript==
// @name         精易接单界面展开
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://bbs.125.la/task.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404856/%E7%B2%BE%E6%98%93%E6%8E%A5%E5%8D%95%E7%95%8C%E9%9D%A2%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/404856/%E7%B2%BE%E6%98%93%E6%8E%A5%E5%8D%95%E7%95%8C%E9%9D%A2%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tempStyleElement=document.createElement('style');//w3c
    tempStyleElement.setAttribute("type","text/css");
    tempStyleElement.innerText = `.layui-table-body.layui-table-main{height: initial !important;}`;
    document.body.appendChild(tempStyleElement);
    // Your code here...
})();