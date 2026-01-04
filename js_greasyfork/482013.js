// ==UserScript==
// @name            Ad-Rule 广告过滤规则
// @namespace      1771245847
// @version           0.0.1
// @description       Ad-rule - 广告过滤规则
// @icon              https://store-images.s-microsoft.com/image/apps.47704.31725b1f-8fe1-425e-88f6-62172d5f0c56.fee433d9-5600-4a79-b0da-592da83a609f.cd06f251-5a27-421e-8a48-ab8d276890b7?mode=scale&h=100&q=90&w=100
// @author           1771245847
// @match        http://*/*
// @match        https://*/*
// @charset		  UTF-8
// @license           GPL License
// @downloadURL https://update.greasyfork.org/scripts/482013/Ad-Rule%20%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%E8%A7%84%E5%88%99.user.js
// @updateURL https://update.greasyfork.org/scripts/482013/Ad-Rule%20%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%E8%A7%84%E5%88%99.meta.js
// ==/UserScript==

// 在这里添加你的广告规则，例如：
var adElements = ['#ad-container', '.ad-class', 'a[href^="https://easylist-downloads.adblockplus.org/easylistchina.txt"]'];

adElements.forEach(function(selector) {
    var adElements = document.querySelectorAll(selector);
    for (var i = 0; i < adElements.length; i++) {
        adElements[i].parentNode.removeChild(adElements[i]);
    }
});
