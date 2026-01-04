// ==UserScript==
// @name         Add Keepa Links
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Amazon商品ページにKeepaの価格履歴のリンクを追加
// @author       himuro_majika
// @match        https://www.amazon.co.jp/*dp/*
// @match        https://www.amazon.co.jp/*gp/*
// @icon         https://www.google.com/s2/favicons?domain=keepa.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440259/Add%20Keepa%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/440259/Add%20Keepa%20Links.meta.js
// ==/UserScript==

(function() {
  'use strict';

  init();
  function init() {
    insertButton();
  }
  function getProduct() {
    const url = location.href;
    const patternList = [
      /dp\/([^/?]+)/,
      /\/gp\/product\/([^/?]+)/
    ];
    let product = null;
    patternList.forEach(pattern => {
      const match = url.match(pattern);
      if (match) {
        product = match[1];
        return;
      }
    });
    return product;
  }
  function getTargetElement() {
      return document.getElementById("buybox");
  }
  function createKeepaLinkButton() {
    const button = document.createElement("div");
    const a = document.createElement("a");
    const keepaUrl = "https://keepa.com/#!search/5-";
    a.setAttribute("target", "_blank");
    a.innerText = "📉Keepaで価格を確認する.";
    a.addEventListener("click", (e) => {
      e.target.setAttribute("href", keepaUrl + getProduct());
    })
    button.appendChild(a);
    return button;
  }
  function insertButton() {
    const tEle = getTargetElement();
    tEle.parentNode.parentNode.appendChild(createKeepaLinkButton());
  }
})();