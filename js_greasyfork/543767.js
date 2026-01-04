// ==UserScript==
// @name         価格比較ボタン追加
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  某サイトに価格比較ボタンを追加する
// @author       You
// @match        https://www.dmm.co.jp/dc/doujin/-/detail/=/cid=d_*
// @match        https://www.dmm.co.jp/dc/doujin/-/list/*
// @match        https://www.dmm.co.jp/dc/doujin/-/search/=/*
// @match        https://www.dlsite.com/maniax/work/=/product_id/RJ*.html
// @match        https://www.dlsite.com/maniax/campaign/*
// @match        https://www.dlsite.com/maniax/works/*
// @match        https://www.dlsite.com/maniax/mypage/wishlist*
// @match        https://www.dlsite.com/maniax/fsr/*
// @match        https://www.dlsite.com/maniax/genres/works?*
// @match        https://www.dlsite.com/girls/work/=/product_id/RJ*.html
// @match        https://www.dlsite.com/girls/campaign/*
// @match        https://www.dlsite.com/girls/works/*
// @match        https://www.dlsite.com/girls/mypage/wishlist*
// @match        https://www.dlsite.com/girls/fsr/*
// @match        https://www.dlsite.com/girls/genres/works?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dlsite.com
// @grant        none
// @license      WTFPL
// @require      https://greasyfork.org/scripts/469263-ramisamuki-utils/code/RamisAmuki%20Utils.js?version=1209366
// @downloadURL https://update.greasyfork.org/scripts/543767/%E4%BE%A1%E6%A0%BC%E6%AF%94%E8%BC%83%E3%83%9C%E3%82%BF%E3%83%B3%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/543767/%E4%BE%A1%E6%A0%BC%E6%AF%94%E8%BC%83%E3%83%9C%E3%82%BF%E3%83%B3%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const title_normalize = (title) => {
    return title
      .replaceAll("●", " ")
      .replaceAll("～", " ")
      .replaceAll("〜", " ")
      .replaceAll("催眠", "催◯")
      .replaceAll(" ", "+");
  };

  function createButton({
    target,
    url,
    title,
    marginTop = "0px",
    marginBottom = "0px",
    marginRight = "",
    marginLeft = "",
    width = "100%",
    fontSize = "15px",
    appendChild = true,
  }) {
    // ボタン要素を作成
    const btn = document.createElement("button");
    btn.onclick = () => window.open(`${url}${title_normalize(title)}`);

    // ボタンの装飾
    btn.innerHTML = "価格比較";
    btn.style.height = "36px";
    btn.style.width = width;
    btn.style.marginTop = marginTop;
    btn.style.marginBottom = marginBottom;
    btn.style.marginRight = marginRight;
    btn.style.marginLeft = marginLeft;
    btn.style.padding = "0";
    btn.style.border = "1";
    btn.style.fontSize = fontSize;
    btn.style.textAlign = "center";
    btn.style.color = "#fff";
    btn.style.backgroundColor = "#fa6496";

    if (appendChild) {
      target.appendChild(btn);
    } else {
      target.insertBefore(btn, target.lastElementChild);
    }
  }

  function createA({
    target,
    url,
    title,
    marginTop = "0px",
    marginBottom = "0px",
    marginRight = "",
    marginLeft = "",
    width = "100%",
    fontSize = "15px",
    appendChild = true,
  }) {
    // ボタン要素を作成
    const anchor = document.createElement("a");
    anchor.href = `${url}${title_normalize(title)}`;
    anchor.target = "_blank";

    // ボタンの装飾
    anchor.innerHTML = "価格比較";
    anchor.style.display = "block";
    anchor.style.height = "36px";
    anchor.style.width = width;
    anchor.style.marginTop = marginTop;
    anchor.style.marginBottom = marginBottom;
    anchor.style.marginRight = marginRight;
    anchor.style.marginLeft = marginLeft;
    anchor.style.padding = "0";
    anchor.style.border = "1";
    anchor.style.fontSize = fontSize;
    anchor.style.textAlign = "center";
    anchor.style.color = "#fff";
    anchor.style.backgroundColor = "#fa6496";

    if (appendChild) {
      target.appendChild(anchor);
    } else {
      target.insertBefore(anchor, target.lastElementChild);
    }
  }

  if (location.hostname.match(/dmm/)) {
    const url =
      "https://www.dlsite.com/maniax/fsr/=/language/jp/sex_category[0]/male/order/trend/work_type_category[0]/comic/work_type_category[1]/illust/options_and_or/and/options[0]/JPN/options[1]/NM/from/fs.header/keyword/";
    if (location.pathname.match(/\/dc\/doujin\/-\/detail\/=\/cid=d_\d+\//)) {
      let src = document.querySelector("h1[class*=productTitle]");
      while (src.firstElementChild) src.removeChild(src.firstElementChild);
      const q_target = "div.purchaseColumn > div:nth-child(1)";
      waitForElement(q_target, () => {
        createButton({
          target: document.querySelector(q_target),
          url: url,
          title: src.innerText,
          marginBottom: "10px",
        });
      });
    } else if (location.pathname.match(/\/dc\/doujin\/-\/(list|search)/)) {
      const q_lists = "ul.fn-productList > li.productList__item";
      const q_target = "div.tileListPurchase__item";
      waitForElement("div.pageNation__item", () => {
        document.querySelectorAll(q_lists).forEach((li) => {
          createButton({
            target: li.querySelector(q_target),
            url: url,
            title: li.querySelector("div.tileListTtl__txt").innerText,
            width: "",
            fontSize: "10px",
            marginLeft: "5px",
            appendChild: false,
          });
        });
      });
    }
  } else if (location.hostname.match(/dlsite/)) {
    const url = "https://www.dmm.co.jp/dc/doujin/-/search/=/searchstr=";
    if (
      location.pathname.match(
        /\/(maniax|girls)\/work\/=\/product_id\/RJ\d+.html/
      )
    ) {
      const src = document.querySelectorAll("#top_wrapper ul li a span");
      const q_target = "#work_buy_btn";
      waitForElement(q_target, () => {
        createButton({
          target: document.querySelector(q_target),
          url: url,
          title: src[src.length - 1].innerText,
          marginTop: "8px",
        });
      });
    } else if (
      location.pathname.match(
        /\/(maniax|girls)\/(campaign|works|fsr|genres\/works)/
      )
    ) {
      const q_lists = "#search_result_img_box > li.search_result_img_box_inner";
      waitForElement(q_lists, () => {
        document.querySelectorAll(q_lists).forEach((li) => {
          createButton({
            target: li.firstElementChild,
            url: url,
            title: li.querySelector("a[title]").title,
            appendChild: false,
          });
        });
      });
    } else if (
      // mypage/wishlist/
      location.pathname.match(/\/(maniax|girls)\/mypage\/wishlist/)
    ) {
      const q_lists = "tr._favorite_item";
      waitForElement(q_lists, () => {
        document.querySelectorAll(q_lists).forEach((tr) => {
          createA({
            target: tr.querySelector("td.work_1col_right"),
            url: url,
            title: tr.querySelector("a[title]").title,
            appendChild: true,
          });
        });
      });
    }
  }
})();
