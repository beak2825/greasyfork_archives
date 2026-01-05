// ==UserScript==
// @name         Tinychat Cleanup
// @namespace    http://www.JamesKoss.com/
// @version      1.1
// @description  9.2.2017 After stylebot (http://stylebot.me/styles/10932) + ABP, remove the other spam.
// @author       James Koss
// @match        https://tinychat.com/*
// @downloadURL https://update.greasyfork.org/scripts/24920/Tinychat%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/24920/Tinychat%20Cleanup.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var el1 = document.querySelectorAll('div[id^="div-gpt-ad-"]')[0];
    el1.parentNode.removeChild(el1);
    var el2 = document.querySelectorAll('script[src="/public/js/ads.js"]')[0];
    el2.parentNode.removeChild(el2);
    var el3 = document.querySelectorAll('script');
    for (var x in el3) {
        var y = el3[x];
        if (y.outerHTML) {
            // All scripts to be removed.
            if (y.outerHTML.indexOf('function checkAds') !== -1 ||
                y.outerHTML.indexOf('_cc7034') !== -1 ||
                y.outerHTML.indexOf('crwdcntrl') !== -1 ||
                y.outerHTML.indexOf('googleads') !== -1 ||
                y.outerHTML.indexOf('adnxs') !== -1) {
                y.parentNode.removeChild(y);
            }
        }
    }
    var el4 = document.querySelectorAll('iframe[id="iframe_ad"]')[0];
    el4.parentNode.removeChild(el4);
})();