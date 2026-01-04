// ==UserScript==
// @name         GCK
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  快速复制当前页面cookie
// @author       三胖
// @match        https://greasyfork.org/zh-CN/scripts?page=2&q=cookie&utf8=%E2%9C%93
// @grant        none
// @match        http://*/*
// @match        https://*/*
// @downloadURL https://update.greasyfork.org/scripts/386865/GCK.user.js
// @updateURL https://update.greasyfork.org/scripts/386865/GCK.meta.js
// ==/UserScript==

(function() {
    'use strict';

   // Your code here...
    function copystr(str) {
    var oInput = document.createElement('input');
    oInput.value = str;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    oInput.setSelectionRange(0, oInput.value.length), document.execCommand('Copy');
    document.body.removeChild(oInput);
    alert('复制成功');
    }
    document.onkeydown =function (e) {
if (e.altKey&& e.keyCode == 67){
     copystr(document.cookie);
    }
    }
})();