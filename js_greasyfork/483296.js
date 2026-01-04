// ==UserScript==
// @name         modifyphotos
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  tmodifyphotos
// @author       You
// @match        http://47.107.106.156/*
// @match        http://122.13.25.247/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=106.156
// @grant       GM_addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/483296/modifyphotos.user.js
// @updateURL https://update.greasyfork.org/scripts/483296/modifyphotos.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let weburl = unsafeWindow.location.href;
    if (weburl.indexOf("47.107.106.156") != -1) {
        GM_addStyle('.main{background:url(http://47.107.106.156:8888/image/default2/logo/login_bg2.png) bottom no-repeat; margin: auto;background-size:100% 100% !important}');
        GM_addStyle('.main-logo{display: inline-block;background:url(http://47.107.106.156:8888/image/default2/logo/header2.png)no-repeat; height: 60px;width: 100%  !important}');
        GM_addStyle('.main-mbg{background:url(http://47.107.106.156:8888/image/default2/logo/mbg2.jpg);background-size:100% 100% !important}');
    }
    if (weburl.indexOf("122.13.25.247") != -1) {
        GM_addStyle('.main{background:url(http://122.13.25.247:8888/image/default2/logo/login_bg2.png) bottom no-repeat; margin: auto;background-size:100% 100% !important}');
        GM_addStyle('.main-mbg{background:url(http://122.13.25.247:8888/image/default2/logo/mbg2.jpg);background-size:100% 100% !important}');
        GM_addStyle('.main-logo{display: inline-block;background:url(http://122.13.25.247:8888/image/default2/logo/header2.png)no-repeat; height: 60px;width: 100%  !important}');
    }
})();
