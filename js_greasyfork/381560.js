// ==UserScript==
// @name         Standaard Paywall Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the paywall from "de standaard" and shows the full article
// @author       Extortioner
// @match        http://www.standaard.be/cnt/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381560/Standaard%20Paywall%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/381560/Standaard%20Paywall%20Remover.meta.js
// ==/UserScript==

(function() {
  "use strict";

  var paywall = document.getElementById("porous-paywall-content");
  if (!paywall) return;

  if (paywall.classList) {
    paywall.classList.remove("is-hidden");
    paywall.classList.add("article__body");
  } else {
    paywall.className =
      paywall.className.replace(new RegExp("\\bis-hidden\\b", "g"), "") +
      " article__body";
  }

  var existingArticleContent = document.querySelector(
    ".article-full .article__body"
  );
  if (existingArticleContent) {
    existingArticleContent.style.display = "none";
  }
})();
