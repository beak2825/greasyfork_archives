// ==UserScript==
// @name        东方财富跳转新版本页面
// @namespace   Violentmonkey Scripts2
// @match       *://quote.eastmoney.com/sh*
// @match       *://quote.eastmoney.com/sz*
// @grant       none
// @version     1.0
// @author      -
// @license MIT
// @description 2024/3/20 09:31:28
// @grant       GM_addStyle
// @grant       unsafeWindow
// @supportURL   https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=270
// @homepage     https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=270
// @downloadURL https://update.greasyfork.org/scripts/496301/%E4%B8%9C%E6%96%B9%E8%B4%A2%E5%AF%8C%E8%B7%B3%E8%BD%AC%E6%96%B0%E7%89%88%E6%9C%AC%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/496301/%E4%B8%9C%E6%96%B9%E8%B4%A2%E5%AF%8C%E8%B7%B3%E8%BD%AC%E6%96%B0%E7%89%88%E6%9C%AC%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function () {

  function redirectToConcept(symbol) {
     var parts = window.location.href.split(".com/");
        var newUrl = parts[0] + ".com/concept/" + parts[1];
    window.location.href = newUrl;

    GM_addStyle({})
  }

  redirectToConcept();
})();