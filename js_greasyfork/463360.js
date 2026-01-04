// ==UserScript==
// @name        Nutra-Pasta
// @namespace   lousando
// @license     MIT
// @match       https://www.nutraingredients-usa.com/Article/*
// @grant       none
// @version     1.0
// @author      lousando
// @description Removes copyright banner on article copy
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/463360/Nutra-Pasta.user.js
// @updateURL https://update.greasyfork.org/scripts/463360/Nutra-Pasta.meta.js
// ==/UserScript==

const observer = new MutationObserver(() => {
  const oldArticle = document.querySelector("article.Detail");

  if (oldArticle?.innerText) {
    const newArticle = oldArticle.cloneNode(true);

    newArticle.removeAttribute("data-widget");
    oldArticle.replaceWith(newArticle);
  }
});

observer.observe(document.body, { childList: true });