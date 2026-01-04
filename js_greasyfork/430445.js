// ==UserScript==
// @name         龙空自动签到
// @namespace  https://www.lkong.com/
// @version      0.1.1
// @description 进入龙空首页自动签到，不用自己手动签了。
// @author       仙圣
// @include        https://www.lkong.com/
// @include        https://www.lkong.com/feeds
// @icon         none
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/430445/%E9%BE%99%E7%A9%BA%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/430445/%E9%BE%99%E7%A9%BA%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {

setTimeout(function() {document.getElementsByClassName("ant-btn ant-btn-primary ant-btn-block")[0].click();},2000);

})();