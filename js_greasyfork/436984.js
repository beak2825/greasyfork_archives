// ==UserScript==
// @name         challenge
// @namespace    http://www.liftnova-cranes.com/
// @version      0.1
// @description  国学达人极限挑战
// @author       Bruce
// @match        https://mp.xiaowaibao.cn/www/wechat/html/eaglescup/*
// @icon         https://www.google.com/s2/favicons?domain=xiaowaibao.cn
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/436984/challenge.user.js
// @updateURL https://update.greasyfork.org/scripts/436984/challenge.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var delay_time = 3000; //单位毫秒，根据原本页面载入用时判断
setTimeout(function(){
//css start
    let css = `
[data-answer="true"] {
background:red;
}
    `
    GM_addStyle(css);
//css end

} , delay_time)
    // Your code here...
})();