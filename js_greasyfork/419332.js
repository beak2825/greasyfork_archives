// ==UserScript==
// @name         去除Go编程时光微信引流_自动展开全文
// @match         *://golang.iswbm.com/*
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  去除Go编程时光微信引流_自动展开全文,不需要通过公众号获取验证码。
// @author       Lgyh Z
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419332/%E5%8E%BB%E9%99%A4Go%E7%BC%96%E7%A8%8B%E6%97%B6%E5%85%89%E5%BE%AE%E4%BF%A1%E5%BC%95%E6%B5%81_%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/419332/%E5%8E%BB%E9%99%A4Go%E7%BC%96%E7%A8%8B%E6%97%B6%E5%85%89%E5%BE%AE%E4%BF%A1%E5%BC%95%E6%B5%81_%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function() {
    document.getElementById('read-more-wrap').style='display: none;'
    document.getElementsByClassName('rst-content')[0].style='position: relative;height: 2497.38px;';
}, false);
})();