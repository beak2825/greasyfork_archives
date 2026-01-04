// ==UserScript==
// @name         个人图书馆360doc.com复制工具
// @namespace    https://zodgame.xyz/home.php?mod=space&uid=294326
// @version      1.0
// @description  个人图书馆360doc.com复制工具-解决右键无法复制的恶心问题
// @author       未知的动力
// @match        http://*.360doc.com/*
// @run-at      document-end
// @grant       GM_download
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/435474/%E4%B8%AA%E4%BA%BA%E5%9B%BE%E4%B9%A6%E9%A6%86360doccom%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/435474/%E4%B8%AA%E4%BA%BA%E5%9B%BE%E4%B9%A6%E9%A6%86360doccom%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

!(function () {
  const t = document.querySelector("#contextmenudiv ul li:nth-of-type(1) a");
  t &&
    (t.removeAttribute("onclick"),
    t.addEventListener(
      "click",
      function () {
        const t = window.getSelection();
        GM_setClipboard(t.toString());
      },
      !1
    )),
    (document.querySelector(".articleMaxH").oncopy = null);
})();
