// ==UserScript==
// @name         百度联盟
// @namespace    http://junstyle.net/
// @version      0.1
// @description  百度联盟样式修正
// @author       junstyle
// @match        http://union.baidu.com/customerLogin.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20571/%E7%99%BE%E5%BA%A6%E8%81%94%E7%9B%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/20571/%E7%99%BE%E5%BA%A6%E8%81%94%E7%9B%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //修复登陆首页错位
    document.querySelector('#index .indexBody').style.clear='both';
})();