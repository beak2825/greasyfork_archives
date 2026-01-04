// ==UserScript==
// @name         override-missav-css
// @namespace    https://missav.*
// @version      v0.1.2
// @description  override missav css
// @author       You
// @include        https://missav.*/*
// @exclude      /^https:\/\/missav\.*\/.*-\d+.*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483113/override-missav-css.user.js
// @updateURL https://update.greasyfork.org/scripts/483113/override-missav-css.meta.js
// ==/UserScript==

// 注入 css
const injectTruncateCss = () => {
  const css = `
    /* 你的全局CSS */
    .truncate {
       overflow: auto;
       text-overflow: auto;
       white-space: inherit;
    }
    `;

  const style = document.createElement("style");
  style.type = "text/css";
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
};

const injectVideoCss = () => {
  const css = `
    /* 你的全局CSS */
    .thumbnail > div:first-child > a:first-child > video.hidden {
       display: block !important;
    }
    `;

  const style = document.createElement("style");
  style.type = "text/css";
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
};

(function () {
  "use strict";
  injectTruncateCss();
  setInterval(() => {
    if (window.player != null) {
        return;
    }

    const autoPlay = localStorage.getItem("autoPlay");

    if (autoPlay === "1") {
      injectVideoCss();
    }
  }, 1000);
})();
