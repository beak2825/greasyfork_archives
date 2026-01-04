// ==UserScript==
// @name         Read the Docs Sidebar Folding
// @namespace    http://tampermonkey.net/
// @version      2024-03-07
// @description  Add a switch to collapse and expand the sidebar.
// @author       ssnangua
// @match        https://*.readthedocs.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=readthedocs.io
// @grant        GM_addStyle
// @grant        GM_addElement
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488842/Read%20the%20Docs%20Sidebar%20Folding.user.js
// @updateURL https://update.greasyfork.org/scripts/488842/Read%20the%20Docs%20Sidebar%20Folding.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(`
    .wy-nav-side, .fold>.rst-versions {
      transition: left 0.3s;
    }
    .wy-nav-content-wrap {
      transition: margin-left 0.3s;
    }
    .fold .wy-nav-side, .fold>.rst-versions {
      left: -300px;
    }
    .fold .wy-nav-content-wrap {
      margin-left: 0;
    }
    .fold-handler {
      z-index: 1000;
      opacity: 0.3;
      position: fixed;
      left: 300px;
      top: 50%;
      transform: translateY(-50%);
      border-left: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      padding: 10px 4px !important;
      transition: all 0.3s;
    }
    .fold-handler:hover {
      opacity: 1;
    }
    .fold .fold-handler {
      left: 0;
    }
    .fold-handler::after {
      content: "<";
    }
    .fold .fold-handler::after {
      content: ">";
    }
    .to-top {
      z-index: 1000;
      opacity: 0.3;
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      border-right: none;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      padding: 10px 4px !important;
    }
    .to-top:hover {
      opacity: 1;
    }
    `);

  // fold
  const handler = GM_addElement(document.body, "div", {
    class: "btn btn-neutral fold-handler",
  });
  handler.onclick = () => {
    const isFold = document.body.classList.contains("fold");
    document.body.classList[isFold ? "remove" : "add"]("fold");
  };

  // to top
  const toTop = GM_addElement(document.body, "div", {
    class: "btn btn-neutral to-top",
    title: "Go To Top",
  });
  toTop.innerHTML = `<div style="transform:rotate(90deg)">&lt;</div>`;
  toTop.onclick = () => {
    document.body.parentNode.scrollTo({ top: 0, behavior: "smooth" });
  };
})();
