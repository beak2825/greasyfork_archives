// ==UserScript==
// @name         网页字体美化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改网页字体为微软雅黑
// @author       You
// @match         *://*/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/26366/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/26366/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==
(function() {
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
	console.log('font');
    addStyle('* {font-family : "微软雅黑";}');
})();