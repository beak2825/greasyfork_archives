// ==UserScript==
// @name         JAV自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @exclude      https://www.javlibrary.com/cn/login.php
// @match        https://www.javlibrary.com/cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419850/JAV%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/419850/JAV%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isLogin = $(".menutext").children().length==4;
    if(isLogin){}else{
        window.open("/cn/login.php", "_blank", "width=600,height=400");
    }
})();