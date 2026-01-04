// ==UserScript==
// @name         超星防粘贴破解
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  帮你考试成功
// @author       XZX
// @match        https://mooc1.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454935/%E8%B6%85%E6%98%9F%E9%98%B2%E7%B2%98%E8%B4%B4%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/454935/%E8%B6%85%E6%98%9F%E9%98%B2%E7%B2%98%E8%B4%B4%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i;
    var num=100;
    for(i=0;i<=num;i++){
        document.querySelector('#ueditor_'+i).contentWindow.addEventListener('paste', function(event) { event.stopImmediatePropagation(); }, true);
    }
})();