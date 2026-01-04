// ==UserScript==
// @name         DLsite Filter Button
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  DLsiteの作品をフィルタリングする
// @author       RamisAmuki
// @match        https://www.dlsite.com/maniax/campaign/*
// @match        https://www.dlsite.com/maniax/works/*
// @match        https://www.dlsite.com/maniax/fsr/*
// @match        https://www.dlsite.com/maniax/genres/works?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dlsite.com
// @grant        none
// @license      MIT
// @require      https://greasyfork.org/scripts/469263-ramisamuki-utils/code/RamisAmuki-Utils.js?version=1228378
// @downloadURL https://update.greasyfork.org/scripts/543765/DLsite%20Filter%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/543765/DLsite%20Filter%20Button.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // ignore list
  const ignore_authors = ["TGA", "聖華快楽書店"];
  const ignore_titles = ["体験版", "無料版"];
  const ignore_querys = ["a.btn_cart_in", "dt._filter", "a.btn_dl"];

  // query
  const querys = {
    lists: "#search_result_img_box > li.search_result_img_box_inner",
    author: "dd.maker_name",
    title: "a[title]",
    rate: "span.type_sale",
    price: "span.work_price",
    button_parent: "#container > div._scroll_position > div.cp_heading",
  };
  let margin = "auto 10px auto 0";
  if (location.pathname.includes("fsr")) {
    querys.button_parent = "div.floorSubNav";
    margin = "auto 10px auto auto";
  }

  const checker = (liqs) => {
    const auhtor = liqs(querys.author).innerText;
    const title = liqs(querys.title).title;
    // checking
    return [
      check_rate_price(liqs, querys),
      ignore_querys.some((query) => liqs(query) != null),
      checkboxEnable("author") ? ignore_authors.includes(auhtor) : false,
      ignore_titles.some((ignore) => title.includes(ignore)),
    ].some((b) => b);
  };

  appendButton(() => all_enable(querys), querys, "Reset");
  appendRatePriceInput(querys);
  appendToggleButton(querys, "author", "true");
  appendFilterButton(checker, querys, margin);
})();
