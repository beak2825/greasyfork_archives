// ==UserScript==
// @name         芋道源码 口令自动填充
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       leosam2048
// @match        *://www.iocoder.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405026/%E8%8A%8B%E9%81%93%E6%BA%90%E7%A0%81%20%E5%8F%A3%E4%BB%A4%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/405026/%E8%8A%8B%E9%81%93%E6%BA%90%E7%A0%81%20%E5%8F%A3%E4%BB%A4%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    setCookie(window.cookie_vip_key,window.cookie_vip_val,29);

    // $.cookie(cookie_vip_key, cookie_vip_val, {expires: 30, path: '/'});

})();