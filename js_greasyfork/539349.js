// ==UserScript==
// @name         伪装下载链接交给1DM+
// @namespace    https://chat.openai.com/
// @version      1.0.0
// @description  避开浏览器抢下载，把文件让1DM+来下载（伪装跳转）
// @author       你自己
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539349/%E4%BC%AA%E8%A3%85%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E4%BA%A4%E7%BB%991DM%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/539349/%E4%BC%AA%E8%A3%85%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E4%BA%A4%E7%BB%991DM%2B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function 是下载链接(url) {
    return /\.(apk|zip|mp4|pdf|rar|7z|exe|iso|obb)$/i.test(url)
        || url.includes("aki-game.com")
        || url.includes("download");
  }

  document.addEventListener('click', function (e) {
    const 链接 = e.target.closest('a');
    if (!链接 || !链接.href) return;

    const 真网址 = 链接.href;
    if (!是下载链接(真网址)) return;

    e.preventDefault();
    e.stopPropagation();

    // 伪装：跳转到一个假的网页，然后立刻跳回下载地址
    const 跳转 = `data:text/html,<meta http-equiv='refresh' content='0;url=${encodeURIComponent(真网址)}'>`;

    window.location.href = 跳转;
  }, true);
})();