// ==UserScript==
// @name         京东
// @namespace    https://www.v587.com/
// @version      0.1
// @description  解决加入不了购物车的bug
// @author       penrcz
// @match        https://item.jd.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/390253/%E4%BA%AC%E4%B8%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/390253/%E4%BA%AC%E4%B8%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //console.log("程序执行");
    var $ = $ || window.$;

    //延时执行
    setTimeout(function () {

        $('.userDefinedArea').hide();
        console.log($('.userDefinedArea'));

    }, 6000);
})();
