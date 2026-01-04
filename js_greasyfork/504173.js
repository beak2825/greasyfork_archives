// ==UserScript==
// @name       したらば论坛增强
// @namespace  npm/vite-plugin-monkey
// @version    0.0.1
// @author     lu-jiejie
// @icon       https://vitejs.dev/logo.svg
// @match      *://jbbs.shitaraba.net/bbs/read.cgi/*
// @description したらば 论坛使用体验增强脚本。
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504173/%E3%81%97%E3%81%9F%E3%82%89%E3%81%B0%E8%AE%BA%E5%9D%9B%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/504173/%E3%81%97%E3%81%9F%E3%82%89%E3%81%B0%E8%AE%BA%E5%9D%9B%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const WARNING_HREF_PREFIX = "/bbs/alink.cgi?url=";
  function hrefWithoutWarning() {
    document.addEventListener("click", (event) => {
      var _a;
      const target = event.target;
      if (target.tagName === "A" && ((_a = target.getAttribute("href")) == null ? void 0 : _a.startsWith(WARNING_HREF_PREFIX))) {
        event.preventDefault();
        const href = target.getAttribute("href");
        const realHref = href.slice(WARNING_HREF_PREFIX.length);
        window.open(decodeURIComponent(realHref), "_blank");
      }
    });
  }
  const replyLinks = Array.from(document.querySelectorAll("dl#thread-body > dd > span.res > a"));
  const replyMap = /* @__PURE__ */ new Map();
  const TOP_NAV_HEIGHT = 35;
  function replyFromLinks() {
    var _a, _b;
    for (const replyLink of replyLinks) {
      const replyTo = (_a = replyLink.href.match(/\/([^\/]+)\/?$/)) == null ? void 0 : _a[1];
      if (replyTo && Number.isInteger(Number(replyTo))) {
        const replyToNum = Number(replyTo);
        const replyFromNum = Number((_b = replyLink.closest("dd")) == null ? void 0 : _b.previousElementSibling.id.split("_")[1]);
        if (replyFromNum <= replyToNum)
          continue;
        if (!replyMap.has(replyToNum))
          replyMap.set(replyToNum, []);
        replyMap.get(replyToNum).push(replyFromNum);
      }
    }
    const titleEls = Array.from(document.querySelectorAll("dl#thread-body > dt"));
    for (const titleEl of titleEls) {
      const titleNum = Number(titleEl.id.split("_")[1]);
      const replys = replyMap.get(titleNum);
      if (replys) {
        const resEl = document.createElement("span");
        resEl.className = "res";
        for (const reply of replys) {
          const replyFromLink = document.createElement("a");
          replyFromLink.setAttribute("navTo", `#comment_${reply}`);
          replyFromLink.textContent = `<<${reply}`;
          replyFromLink.href = `#comment_${reply}`;
          replyFromLink.style.marginRight = "0.5em";
          replyFromLink.onclick = (event) => {
            event.preventDefault();
            const replyFromEl = document.querySelector(replyFromLink.getAttribute("navTo"));
            const top = replyFromEl.getBoundingClientRect().top + window.scrollY;
            location.hash = replyFromLink.getAttribute("navTo");
            window.scrollTo({
              top: top - TOP_NAV_HEIGHT
            });
          };
          resEl.appendChild(replyFromLink);
        }
        titleEl.appendChild(resEl);
      }
    }
  }
  replyFromLinks();
  hrefWithoutWarning();

})();