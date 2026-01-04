// ==UserScript==
// @name         所有滤镜消除(消除网站变灰色)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  重置滤镜属性
// @author       aotmd
// @include      /.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399430/%E6%89%80%E6%9C%89%E6%BB%A4%E9%95%9C%E6%B6%88%E9%99%A4%28%E6%B6%88%E9%99%A4%E7%BD%91%E7%AB%99%E5%8F%98%E7%81%B0%E8%89%B2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/399430/%E6%89%80%E6%9C%89%E6%BB%A4%E9%95%9C%E6%B6%88%E9%99%A4%28%E6%B6%88%E9%99%A4%E7%BD%91%E7%AB%99%E5%8F%98%E7%81%B0%E8%89%B2%29.meta.js
// ==/UserScript==

(function() {
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
    addStyle('* {filter: none!important;}');
})();
