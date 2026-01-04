// ==UserScript==
// @name         测试
// @namespace    pandora1m2
// @version      0.1
// @description  只是一个测试
// @author       pandora1m2
// @match        https://blog.csdn.net/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_addStyle
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @downloadURL https://update.greasyfork.org/scripts/419670/%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/419670/%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let e1 = document.getElementsByClassName('article-title-box')[0]
    let i1 = document.createElement('button')
    i1.onclick=test
    i1.innerHTML='test'
    e1.appendChild(i1)
    // Your code here...
    function test(){
        console.log('123123')
    }
})();