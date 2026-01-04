// ==UserScript==
// @name                  Twitter AD Filter 推特广告过滤
// @name:zh-CN            Twitter AD Filter 推特广告过滤
// @namespace             http://tampermonkey.net/
// @version               0.2
// @description           Hide ads in tweets. 隐藏推特中的广告。
// @description:zh-CN     Hide ads in tweets. 隐藏推特中的广告。
// @icon                  https://about.twitter.com/etc/designs/about2-twitter/public/img/favicon-32x32.png
// @author                gabe
// @license               MIT
// @match                 https://twitter.com/*
// @grant                 none
// @downloadURL https://update.greasyfork.org/scripts/478705/Twitter%20AD%20Filter%20%E6%8E%A8%E7%89%B9%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/478705/Twitter%20AD%20Filter%20%E6%8E%A8%E7%89%B9%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function log() {
    return console.info("[Twitter AD Filter]", ...arguments);
  }

  let i = 0;
  function hideAd(node) {
    try {
      if (
        !node ||
        node.nodeName !== "DIV" ||
        node.getAttribute("data-testid") !== "cellInnerDiv"
      ) {
        return;
      }

      const el = node.querySelector(
        "div[data-testid='placementTracking'] > article"
      );
      if (!el) {
        return;
      }

      const userName = el.querySelector("div[data-testid='User-Name']");
      log("hide ad:", ++i, userName && userName.innerText);

      node.style.cssText += "display: none;";
    } catch (err) {
      log("got err:", err.message);
    }
  }

  const pageObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(hideAd);
    });
  });

  pageObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  document.querySelectorAll("div[data-testid='cellInnerDiv']").forEach(hideAd);

  log("--- start ---");
})();
