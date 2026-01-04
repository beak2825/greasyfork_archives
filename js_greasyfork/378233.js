// ==UserScript==
// @name         阮一峰ES6 css样式调整
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://es6.ruanyifeng.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378233/%E9%98%AE%E4%B8%80%E5%B3%B0ES6%20css%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/378233/%E9%98%AE%E4%B8%80%E5%B3%B0ES6%20css%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = "<style>#edit,#back_to_top,#flip{right:25px;}#content{width: 50%;padding-left: 25%;font-size:larger;}body{background: #e0e2ae;}#content p code, #content li>code, #content h2>code, #content h3>code{ padding-left:5px;padding-right:5px;color: #4e0707;background: #ff520080;}</style>"

    $('head').append(css);
    // Your code here...
})();