// ==UserScript==
// @name         fxzhihu-script
// @namespace    https://thynanami.dev
// @version      0.1.4
// @author       Nanami Nakano
// @description  fix up zhihu in your browser.
// @license      MIT
// @match        https://www.zhihu.com/question/*
// @match        https://www.zhihu.com/question/*/answer/*
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://www.zhihu.com/pin/*
// @match        https://www.google.com/search*
// @downloadURL https://update.greasyfork.org/scripts/524493/fxzhihu-script.user.js
// @updateURL https://update.greasyfork.org/scripts/524493/fxzhihu-script.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const href = window.location.href;
  if (href.includes("google")) {
    let links = document.querySelectorAll('a[rel="noopener"]');
    if (links.length == 0) {
      links = document.querySelectorAll('a[role="presentation"]');
    }
    links.forEach((link) => {
      var _a;
      const linkHref = link.getAttribute("href") || "";
      if (linkHref.includes("www.zhihu.com/question") || linkHref.includes("zhuanlan.zhihu.com/p") || linkHref.includes("zhihu.com/pin")) {
        link.setAttribute("href", linkHref.replace("zhihu.com", "fxzhihu.com"));
        const cite = link.querySelector("div > div > div > div > cite") || link.querySelector('span[role="text"]');
        if (cite) {
          cite.textContent = ((_a = cite.textContent) == null ? undefined : _a.replace("zhihu.com", "fxzhihu.com")) || "";
        }
      }
    });
  } else {
    window.location.replace(href.replace("zhihu.com", "fxzhihu.com"));
  }

})();