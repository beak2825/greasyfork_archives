// ==UserScript==
// @name         ShowsObservadorPtPremiumArticles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  shows the premium article without a subscription
// @author       You
// @match        https://observador.pt/*
// @icon         https://www.google.com/s2/favicons?domain=observador.pt
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433677/ShowsObservadorPtPremiumArticles.user.js
// @updateURL https://update.greasyfork.org/scripts/433677/ShowsObservadorPtPremiumArticles.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function showContent() {
    if (!window.contextualData) {
      console.error("contextualData has not found");
      return;
    }

    Object.defineProperty(window.contextualData, "premium", {
      value: 1,
      writable: false,
    });
    // Disable support to ajax navigation
    //window.contextualData.jsConfig.disableAjaxNavigation = true;

    document.body.classList.remove("premium-article", "free-user");
    document.body.classList.add("article-shown");

    document.querySelector("article").shown = !0;
    document.querySelector(".article-body-wrapper").style.maxHeight = "";
    document.querySelector(".article-body-wrapper").style.overflow = "";
    jQuery(".piano-article-blocker").hide();
  }

  showContent();

  if (!window.contextualData.jsConfig.disableAjaxNavigation) {
    const observer = new MutationObserver(showContent);
    observer.observe(document.querySelector("main"), {
      childList: true,
      attributes: false,
      subtree: false,
    });
  }
})();
