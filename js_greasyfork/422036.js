// ==UserScript==
// @name        去掉互站红灯笼
// @namespace   Violentmonkey Scripts
// @match       https://*.huzhan.com/
// @grant       none
// @version     1.0
// @author      分米网络 QQ 2740770660
// @description 2021/2/20上午11:10:44
// @downloadURL https://update.greasyfork.org/scripts/422036/%E5%8E%BB%E6%8E%89%E4%BA%92%E7%AB%99%E7%BA%A2%E7%81%AF%E7%AC%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/422036/%E5%8E%BB%E6%8E%89%E4%BA%92%E7%AB%99%E7%BA%A2%E7%81%AF%E7%AC%BC.meta.js
// ==/UserScript==
(function() {
    $("div[class^='deng-']").hide();
})();