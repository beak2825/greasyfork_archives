// ==UserScript==
// @name         Clean_Baidu
// @namespace    None
// @version      0.0.11
// @description  干掉百度个人认为多余的内容，让百度看起来像一个搜索引擎该有的样子。
// @author       XenoAmess
// @license      MIT
// @match        http://www.baidu.com/*
// @match        https://www.baidu.com/*
// @match        http://m.baidu.com/*
// @match        https://m.baidu.com/*
// @match        http://wap.baidu.com/*
// @match        https://wap.baidu.com/*
// @run-at       document-body
// @grant        none
// @supportURL   https://github.com/XenoAmess/clean_baidu.git
// @downloadURL https://update.greasyfork.org/scripts/396896/Clean_Baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/396896/Clean_Baidu.meta.js
// ==/UserScript==

var REFRESH_TIME = 500;
var STRING_SELECTORS = [];
STRING_SELECTORS.push("div#s_wrap > div#s_main > div#s_mancard_main");
STRING_SELECTORS.push("div.blank-frame > div.center-content");
STRING_SELECTORS.push("div.ad-block");
STRING_SELECTORS.push("div.cr-content > div.FYB_RD");
STRING_SELECTORS.push("div#content_right > div.bdvideo-entry");
STRING_SELECTORS.push("a.index-banner.square-banner-bgicon");
STRING_SELECTORS.push("div#s_lm_wrap");
STRING_SELECTORS.push("a#virus-2020");

function preProcess() {
    var cssString = "";
    for (var i = 0; i < STRING_SELECTORS.length; i++) {
        cssString += STRING_SELECTORS[i] + ' {display: none !important} ';
    }

    var styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.rel = 'stylesheet';
    styleSheet.innerText = cssString;
    var htmlSelect = document.getElementsByTagName('html');
    if (htmlSelect.length >= 0) {
        htmlSelect[0].appendChild(styleSheet);
    }
}

function doIt() {
    if (!window.jQuery) {
        var oScript = document.createElement('script');
        oScript.type = "text/javascript";
        oScript.src = "//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js";
        document.head.appendChild(oScript);
    }

    for (var i = 0; i < STRING_SELECTORS.length; i++) {
        try {
            $(STRING_SELECTORS[i]).remove();
        } catch (err) {
            print(err);
        }
    }

}

(function () {
    'use strict';
    preProcess();
    window.onload = window.setInterval(doIt, REFRESH_TIME);
})();