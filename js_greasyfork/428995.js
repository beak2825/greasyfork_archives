// ==UserScript==
// @name         Shahrekhabar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Increase the height of the news - افزایش اندازه خبر
// @author       You
// @match        www.shahrekhabar.com/news/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428995/Shahrekhabar.user.js
// @updateURL https://update.greasyfork.org/scripts/428995/Shahrekhabar.meta.js
// ==/UserScript==

setTimeout(() => {
    const news = document.getElementById("myframe")
    news.style.height = "100%"
}, 1000)
