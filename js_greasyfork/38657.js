// ==UserScript==
// @name         反腾讯视频移动端反去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove m.v.qq.com anti-adblocker.
// @author       You
// @match        *://m.v.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38657/%E5%8F%8D%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%8F%8D%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/38657/%E5%8F%8D%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%8F%8D%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

function main () {
    document.cookie = 'adBlock1st=0;expires=Fri, 3 Aug 2001 20:47:11 UTC; path=/; domain=.m.v.qq.com';
}

document.addEventListener("DOMContentLoaded", function(event) {
    setTimeout(main, 2000);
    setTimeout(main, 10000);
    main();
});

window.onload = main;

main();