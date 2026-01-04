// ==UserScript==
// @name        网站全局灰色
// @match       *://*/*
// @grant       none
// @version     0.1
// @author      https://liufeii.com/
// @description 2022/12/5 09:30:30
// @namespace https://greasyfork.org/users/992564
// @downloadURL https://update.greasyfork.org/scripts/456024/%E7%BD%91%E7%AB%99%E5%85%A8%E5%B1%80%E7%81%B0%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/456024/%E7%BD%91%E7%AB%99%E5%85%A8%E5%B1%80%E7%81%B0%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    document.body.style.filter='grayscale(100%)';
    document.getElementsByTagName('html')[0].style.filter = 'grayscale(100%)';
})();