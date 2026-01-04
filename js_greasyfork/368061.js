// ==UserScript==
// @name         直接显示StackOverflow的答题日期
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  directly show the post date of answers at StackOverflow.com
// @author       You
// @match        https://stackoverflow.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368061/%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BAStackOverflow%E7%9A%84%E7%AD%94%E9%A2%98%E6%97%A5%E6%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/368061/%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BAStackOverflow%E7%9A%84%E7%AD%94%E9%A2%98%E6%97%A5%E6%9C%9F.meta.js
// ==/UserScript==

(function() {
    'use strict'
    var blocks = document.querySelectorAll('.user-action-time')
    blocks.forEach(function(ele) {
        var relativetime = ele.querySelector('.relativetime')
        var time = new Date(relativetime.title).toLocaleDateString()
        relativetime.innerText = time
    })
})()
