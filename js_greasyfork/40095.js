// ==UserScript==
// @name         FuckZhihu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏知乎移动端web版强推app的弹层
// @author       You
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40095/FuckZhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/40095/FuckZhihu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var fuck = function (wtf) {
        if (wtf) {
            wtf.style.height = '0';
            wtf.style.width = '0';
            wtf.style.visibility = 'hidden ';
        }
    };
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var main = document.getElementsByClassName('App-main')[0];
    var wtf0 = main.getElementsByClassName('DownloadGuide-block')[0];
    fuck(wtf0);
    var o = new MutationObserver(function() {
        var wtf1 = main.getElementsByClassName('DownloadGuide-block')[0];
        fuck(wtf1);
    });
    if (main) {
        o.observe(main, {
            subtree: true,
            attributes: true
        });
    }
})();
