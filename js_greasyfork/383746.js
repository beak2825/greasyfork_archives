// ==UserScript==
// @name         讯飞文字转语音提取链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于讯飞文字转语音（https://www.ffkuaidu.com/）直接下载
// @author       You
// @match        https://www.ffkuaidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383746/%E8%AE%AF%E9%A3%9E%E6%96%87%E5%AD%97%E8%BD%AC%E8%AF%AD%E9%9F%B3%E6%8F%90%E5%8F%96%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/383746/%E8%AE%AF%E9%A3%9E%E6%96%87%E5%AD%97%E8%BD%AC%E8%AF%AD%E9%9F%B3%E6%8F%90%E5%8F%96%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('.save_box').innerHTML='<button id="llej_zjxz">直接下载</button>'+document.querySelector('.save_box').innerHTML
    document.querySelector('#llej_zjxz').onclick=function(){
        alert(document.querySelectorAll('audio')[2].src)
    }
    // Your code here...
})();