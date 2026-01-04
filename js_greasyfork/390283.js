// ==UserScript==
// @name         Fix Bad Links from wotlk.openwow.com to wotlk.cavernoftime.com 失效域名替换
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  href.replace("http://wotlk.openwow.com", "http://wotlk.cavernoftime.com");
// @author       A.C. Better
// @match        *://forum.warmane.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390283/Fix%20Bad%20Links%20from%20wotlkopenwowcom%20to%20wotlkcavernoftimecom%20%E5%A4%B1%E6%95%88%E5%9F%9F%E5%90%8D%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/390283/Fix%20Bad%20Links%20from%20wotlkopenwowcom%20to%20wotlkcavernoftimecom%20%E5%A4%B1%E6%95%88%E5%9F%9F%E5%90%8D%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var anchors = document.querySelectorAll('a[href]');
    Array.prototype.forEach.call(anchors, function (element, index) {
        element.href = element.href.replace("http://wotlk.openwow.com", "http://wotlk.cavernoftime.com");
    });
})();