// ==UserScript==
// @name         测试
// @namespace    Sigma
// @version      2024-12-30
// @description  更改百度背景样式
// @author       Sigma
// @match        https://\*.baidu.com/\*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522306/%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/522306/%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('这是测试测试测试')
    GM_log('这是测试测试测试')
     $('#wrapper').css('background','#070707')
    // Your code here...
})();