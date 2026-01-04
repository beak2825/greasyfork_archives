// ==UserScript==
// @name         Notion.so bypass-preview
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  (c) 2020 dragonwocky <thedragonring.bod@gmail.com> (https://dragonwocky.me/)
// @author       Adihd based on dragonwocky
// @include      https://www.notion.so/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412099/Notionso%20bypass-preview.user.js
// @updateURL https://update.greasyfork.org/scripts/412099/Notionso%20bypass-preview.meta.js
// ==/UserScript==

(function () {
  "use strict";
  document.addEventListener("readystatechange", (event) => {
    if (document.readyState !== "complete") return false;
    const attempt_interval = setInterval(enhance, 500);
    function enhance() {
      const notion_elem = document.querySelector(".notion-app-inner");
      if (!notion_elem) return;
      clearInterval(attempt_interval);
      const observer = new MutationObserver(handle);
      observer.observe(notion_elem, {
        childList: true,
        subtree: true,
      });

      let pageHistory = [];
      handle();
      function handle(list, observer) {
        const pageID = (location.search
            .slice(1)
            .split("&")
            .map((opt) => opt.split("="))
            .find((opt) => opt[0] === "p") || [
            "",
            ...location.pathname.split(/(-|\/)/g).reverse(),
          ])[1],
          preview = document.querySelector(
            '.notion-peek-renderer [style*="height: 45px;"] a'
          );
        if (
          pageID &&
          (!pageHistory[0] ||
            pageHistory[0][0] !== pageID ||
            pageHistory[0][1] !== !!preview)
        ) {
          if (preview) {
            if (
              pageHistory[1] &&
              pageHistory[0][0] === pageID &&
              pageHistory[1][0] === pageID &&
              pageHistory[1][1]
            ) {
              document.querySelector(".notion-history-back-button").click();
            } else preview.click();
          }
          // most recent is at start for easier access
          pageHistory.unshift([pageID, !!preview]);
        }
      }
    }
  });
})();
