// ==UserScript==
// @name         Open zhihu link directly 直接打开知乎链接
// @namespace    https://github.com/cangzhang/tampermoney-scripts
// @version      0.3
// @description  跳过中转页面, 直接打开知乎链接
// @author       alcheung
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429336/Open%20zhihu%20link%20directly%20%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E7%9F%A5%E4%B9%8E%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/429336/Open%20zhihu%20link%20directly%20%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E7%9F%A5%E4%B9%8E%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function isLink(href = ``) {
    return /https?:\/\/link\.zhihu\.com\/\?target=/.test(href);
  }

  function getTarget(href = ``, ev) {
    let realUrl = ``;
    if (isLink(href)) {
      ev.preventDefault();
      ev.stopPropagation();
      const url = new URL(href);
      const search = new URLSearchParams(url.search);
      realUrl = search.get(`target`);
    }
    return realUrl;
  }

  document.addEventListener(
    `click`,
    (ev) => {
      const el = ev.target;
      let targetUrl;
      switch (el.tagName) {
        case `SPAN`: {
          let anchor;
          if (el.className.includes(`visible`)) {
            anchor = el.closest(`a.external`);
          } else if (el.className.includes(`LinkCard`)) {
            anchor = el.closest(`a.LinkCard`);
          }

          targetUrl = getTarget(anchor.href, ev);
          break;
        }
        case `A`: {
          targetUrl = getTarget(el.href, ev);
          break;
        }
        default:
          break;
      }

      if (targetUrl) {
        window.open(targetUrl, `_blank`);
      }
    },
    false
  );
})();
