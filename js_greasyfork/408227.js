// ==UserScript==
// @name         去除网页openwrite微信引流_自动展开全文
// @match        *://*/*
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  去除网页openwrite微信引流_自动展开全文,不需要通过公众号获取验证码。
// @author       Lgyh Z
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408227/%E5%8E%BB%E9%99%A4%E7%BD%91%E9%A1%B5openwrite%E5%BE%AE%E4%BF%A1%E5%BC%95%E6%B5%81_%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/408227/%E5%8E%BB%E9%99%A4%E7%BD%91%E9%A1%B5openwrite%E5%BE%AE%E4%BF%A1%E5%BC%95%E6%B5%81_%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('container').style='position: relative;height: auto;';
    var tmp = document.getElementById('read-more-mask');
    var parent = tmp.parentElement;
    var removed = parent.removeChild(tmp);
    parent.removeChild(parent.children[0])
    removed === tmp;
})();