// ==UserScript==
// @name         ACGN股票系統一鍵關閉廣告
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  煩人的廣告走開！
// @author       frozenmouse
// @match        http://acgn-stock.com/*
// @match        https://acgn-stock.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34596/ACGN%E8%82%A1%E7%A5%A8%E7%B3%BB%E7%B5%B1%E4%B8%80%E9%8D%B5%E9%97%9C%E9%96%89%E5%BB%A3%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/34596/ACGN%E8%82%A1%E7%A5%A8%E7%B3%BB%E7%B5%B1%E4%B8%80%E9%8D%B5%E9%97%9C%E9%96%89%E5%BB%A3%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    const insertionTarget = $(".note")[2];

    const closeAdsButton = $(`
      <div class="note">
        <li class="nav-item">
          <a class="nav-link" href="#">一鍵關廣告</a>
        </li>
      </div>
    `);
    closeAdsButton.insertAfter(insertionTarget);
    closeAdsButton.find("a").on("click", () => $(".fixed-bottom a.btn").click());
})();