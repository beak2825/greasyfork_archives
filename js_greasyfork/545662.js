// ==UserScript==
// @name         nodeloc自动签到
// @namespace    http://tampermonkey.net/
// @version      2025-08-13
// @description  进入网页自动签到
// @author       Bossmei
// @match        https://www.nodeloc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nodeloc.cc
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545662/nodeloc%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/545662/nodeloc%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
   setTimeout(() => {
        document.getElementsByClassName('checkin-button')[0].click();
   }, 2000)
})();