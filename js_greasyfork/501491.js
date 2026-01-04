// ==UserScript==
// @name         知乎 美化
// @namespace    http://tampermonkey.net/
// @version      2024-07-23
// @description  美化知乎
// @author       huala
// @match        https://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/501491/%E7%9F%A5%E4%B9%8E%20%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/501491/%E7%9F%A5%E4%B9%8E%20%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(`
#root > div > main > div > div.Topstory-container > div.css-1qyytj7,
#root > div > div:nth-child(2) > header > div.AppHeader-inner.css-11p8nt5 > ul,
#root
  > div
  > main
  > div
  > div.Search-container
  > div.css-knqde
  > div:nth-child(3)
  > footer,
#root
  > div
  > div:nth-child(2)
  > header
  > div:nth-child(2)
  > div
  > div
  > div.TopstoryPageHeader-main.css-tfoxxs
  > div
  > nav
  > a:nth-child(4),
#root
  > div
  > main
  > div
  > div
  > div.Question-main
  > div.Question-sideColumn.Question-sideColumn--sticky.css-1qyytj7,
#root
  > div
  > main
  > div
  > div.Topstory-container
  > div.Topstory-mainColumn
  > div
  > div.Card.Topstory-noMarginCard.Topstory-tabCard
  > nav
  > a:nth-child(4) {
  display: none !important;
}

#root > div > main > div > div > div.Question-main,
#root > div > main > div > div.Topstory-container {
  justify-content: center !important;
}
#root > div > main > div > div.Topstory-container > div.Topstory-mainColumn,
#root > div > main > div > div > div.Question-main > div.Question-mainColumn {
  width: 85% !important;
}
  `);
})();
