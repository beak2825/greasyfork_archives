// ==UserScript==
// @name         Fanza Filter Button
// @namespace    http://tampermonkey.net/
// @version      2025-12-28@v1.0.0
// @description  Add filtering button on Fanza doujin
// @author       RamisAmuki
// @match        https://www.dmm.co.jp/dc/doujin/-/list/*
// @match        https://www.dmm.co.jp/dc/doujin/-/search/=/*
// @match        https://www.dmm.co.jp/dc/doujin/-/bookmark/
// @icon         https://p.dmm.co.jp/p/common/pinned/favicon.ico
// @grant        none
// @license      MIT
// @require      https://update.greasyfork.org/scripts/469263/1252465/RamisAmuki-Utils.js
// @require      https://update.greasyfork.org/scripts/471066/1722645/FanzaFilterUtil.js
// @downloadURL https://update.greasyfork.org/scripts/471064/Fanza%20Filter%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/471064/Fanza%20Filter%20Button.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const min_checker = (liqs) => {
    const title = liqs(querys.title).innerText.trim();
    // checking
    return [
      ignore_querys.some((query) => liqs(query) != null),
      ignore_genres_exp.test(liqs(querys.genre).innerText),
      ignore_titles_exp.test(title),
      ignore_local_storage_titles_exp.test(title),
    ].some((b) => b);
  };

  // ボタンを追加する場所を選択
  waitForElement(querys.button_parent, () => {
    appendButton(() => all_enable(querys), querys, "Reset");
    appendFilterButton(min_checker, querys, undefined, "min");
    appendRatePriceInput(querys);
    appendToggleButton(querys, "author", "true");
    appendToggleButton(querys, "Auto", "false");
    appendFilterButton(checker, querys);
  });

  if (checkboxEnable("Auto")) {
    filter(checker, querys);
  }

  if (location.pathname.match(/\/dc\/doujin\/-\/(list|search)/)) {
    const q_lists = "ul.fn-productList > li.productList__item";
    const q_target = "div.tileListPurchase__item";
    waitForElement(querys.lists, () =>
      document
        .querySelectorAll(querys.lists)
        .forEach((li) => add_ignore_title_button(li))
    );
  }
})();
