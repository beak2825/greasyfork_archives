// ==UserScript==
// @name         测试脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       小猪
// @match        http://www.waheng.fun
// @match        http://10.10.26.199/zc/prog1/answer.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420322/%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/420322/%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function copyInfo(info)
    {
        var oInput = document.createElement('input');
        oInput.value = info;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display='none';

    }

    function getQue()
    {
        var i = 1;
        var que = document.querySelector("#Label10");
        var title = que.innerHTML;
        //console.log(que);
        //alert(title);
        console.log(title);
        console.log(i);
        copyInfo(title);
    }

    getQue();
})();