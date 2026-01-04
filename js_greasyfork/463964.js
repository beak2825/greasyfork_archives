// ==UserScript==
// @name         脚本测试
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Just do IT, try to take over the world!
// @author       Lance
// @match        https://www.baidu.com/
// @icon         https://res.wx.qq.com/a/fed_upload/9300e7ac-cec5-4454-b75c-f92260dd5b47/logo-mp.ico
// @grant        none
// @license      MIT
// @supportURL
// @homepageURL
// @downloadURL https://update.greasyfork.org/scripts/463964/%E8%84%9A%E6%9C%AC%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/463964/%E8%84%9A%E6%9C%AC%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    window.onload=function(){
        let t1 = document.getElementById('title-content')
        t1.setAttribute('style', 'color:red')
        let inputbox = document.getElementById('kw')
        // inputbox.value = 'abc'
    }
})();