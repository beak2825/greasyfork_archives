// ==UserScript==
// @name         Music Tools Helper (已失效)
// @namespace    http://tampermonkey.net/
// @license      unlicense
// @version      0.3.4
// @description  [已失效] 修改暗号验证
// @author       PRO-2684
// @icon         https://www.whg6.com/favicon.ico
// @match        https://www.whg6.com/html/musictools/
// @downloadURL https://update.greasyfork.org/scripts/424455/Music%20Tools%20Helper%20%28%E5%B7%B2%E5%A4%B1%E6%95%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424455/Music%20Tools%20Helper%20%28%E5%B7%B2%E5%A4%B1%E6%95%88%29.meta.js
// ==/UserScript==


(function () {
    'use strict';
    var timer_;
    function hack() {
        if (md5) {
            md5 = function(val) {
                return '649ddeccca3789740c6e407bfe41afa4';
            }
            clearInterval(timer_);
            console.log("Hacked!");
        }
    }
    timer_ = setInterval(hack, 1000);
})();