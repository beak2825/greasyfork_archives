// ==UserScript==
// @name         atwikiの遅延読み込み無効化
// @namespace    https://rinsuki.net/
// @version      0.1
// @description  atwikiの画像の遅延読み込みを無効化します
// @author       rinsuki
// @match        https://w.atwiki.jp/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/396952/atwiki%E3%81%AE%E9%81%85%E5%BB%B6%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BF%E7%84%A1%E5%8A%B9%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/396952/atwiki%E3%81%AE%E9%81%85%E5%BB%B6%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BF%E7%84%A1%E5%8A%B9%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const css = `img.atwiki_plugin_image{opacity: 1 !important}`
    const style = document.createElement("style")
    style.innerText = css
    document.head.appendChild(style)
    for (const img of Array.from(document.querySelectorAll("img[data-original]"))) {
        img.style.display = "initial";
        img.src = img.dataset.original
        img.classList.remove("lazy")
    }
})();