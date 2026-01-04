// ==UserScript==
// @name         百度统计decodeURI
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com
// @match        https://tongji.baidu.com/web/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/409922/%E7%99%BE%E5%BA%A6%E7%BB%9F%E8%AE%A1decodeURI.user.js
// @updateURL https://update.greasyfork.org/scripts/409922/%E7%99%BE%E5%BA%A6%E7%BB%9F%E8%AE%A1decodeURI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        $('#visit-page-container a.ellipsis').each(function(i, el) {
            decodeLink($(el));
        });
        $('#landing-page-container a.ellipsis').each(function(i, el) {
            decodeLink($(el));
        });
    }, 3000);

    var decodeLink = function($el) {
        $el.text(decodeURI($el.text()));
    };
})();