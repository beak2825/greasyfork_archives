// ==UserScript==
// @name         麻豆
// @namespace    https://www.shegou.vip/
// @version      1.0.1
// @description  免费观看电影，手机电脑均可使用，觉得不错的话，给个好评呦
// @author       LMB
// @match        https://89kdr0ey1.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lpvk14zw.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452455/%E9%BA%BB%E8%B1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/452455/%E9%BA%BB%E8%B1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var vl = localStorage.getItem("vip_level");
    if(vl==="undefined" || vl==null || vl==='0'){
        localStorage.setItem("vip_level",'1');
    }
})();