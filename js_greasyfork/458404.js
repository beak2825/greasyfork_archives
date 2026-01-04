// ==UserScript==
// @require http://code.jquery.com/jquery-1.11.0.min.js
// @name         xueqiu-theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  xueqiu 网站主题
// @author       You
// @match        https://xueqiu.com/*
// @icon         https://www.google.com/s2/favicons?domain=xueqiu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458404/xueqiu-theme.user.js
// @updateURL https://update.greasyfork.org/scripts/458404/xueqiu-theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("----------------------------------")
    $(".stickyFixed").hide();
    $("#snb_im").hide();
    $(".footer").hide();
    $(".home__col--rt").hide();
})();