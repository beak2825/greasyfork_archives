// ==UserScript==
// @name         LeechPremium絶対殺すマン
// @namespace    http://hogehoge/
// @version      1.*
// @description  We are Smarter than youに負けなくなり、もしかしたら広告のいくつかを無かったことにするかもしれません。
// @author       H. Amami
// @match        http://leechpremium.link/cheat/?link=*
// @match        http://89.36.220.56/cheat/?link=*
// @match        http://94.177.229.115/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/28057/LeechPremium%E7%B5%B6%E5%AF%BE%E6%AE%BA%E3%81%99%E3%83%9E%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/28057/LeechPremium%E7%B5%B6%E5%AF%BE%E6%AE%BA%E3%81%99%E3%83%9E%E3%83%B3.meta.js
// ==/UserScript==

function getLink(url) {
    var index, base64, next;
    index = url.lastIndexOf("http");
    next = url.slice(index);
    while (~(index = next.lastIndexOf("aHR0"))) {
        base64 = next.slice(index);
        if (base64.substr(-1) === "/") base64 = base64.substr(0, base64.length - 1);
        next = atob(base64);
        index = next.lastIndexOf("http");
        next = next.slice(index);
    }
    return next;
}

(function() {
    'use strict';
    var domain = location.href.split("/")[2];
    if (domain !== "94.177.229.115") {
        location.href = getLink(location.href);
    } else {
        location.href = getLink(document.getElementById("btn-main").href);
    }
})();