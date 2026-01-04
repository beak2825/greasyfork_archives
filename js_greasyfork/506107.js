// ==UserScript==
// @name        禁止哔哩哔哩专栏文章复制时添加小尾巴
// @description 阻止添加作者出处的小尾巴
// @author      qianxu
// @version     1.1.2
// @match       https://*.bilibili.com/read/*
// @icon        https://www.bilibili.com/favicon.ico
// @namespace   block-bilibili-article-copy-tail
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/506107/%E7%A6%81%E6%AD%A2%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E6%96%87%E7%AB%A0%E5%A4%8D%E5%88%B6%E6%97%B6%E6%B7%BB%E5%8A%A0%E5%B0%8F%E5%B0%BE%E5%B7%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/506107/%E7%A6%81%E6%AD%A2%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E6%96%87%E7%AB%A0%E5%A4%8D%E5%88%B6%E6%97%B6%E6%B7%BB%E5%8A%A0%E5%B0%8F%E5%B0%BE%E5%B7%B4.meta.js
// ==/UserScript==

(() => {
	document.addEventListener("copy", (event) => event.stopPropagation(), true);
})();
