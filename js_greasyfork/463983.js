// ==UserScript==
// @name         清除ios codevn和ipalibrary网站广告
// @namespace    http://tampermonkey
// @version      2.0
// @description  该脚本会清除ios codevn和ipalibrary网站广告。
// @match        https://ios.codevn.net/*
// @match        https://ipalibrary.me/*
// @run-at        document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463983/%E6%B8%85%E9%99%A4ios%20codevn%E5%92%8Cipalibrary%E7%BD%91%E7%AB%99%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/463983/%E6%B8%85%E9%99%A4ios%20codevn%E5%92%8Cipalibrary%E7%BD%91%E7%AB%99%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

window.qhDivToCheck = undefined;
window.qhFireToTheHold = function(){};

    // 移除所有广告
    var ads = document.querySelectorAll('ins.adsbygoogle');
    for (var i = 0; i < ads.length; i++) {
      ads[i].parentNode.removeChild(ads[i]);
    }
})();