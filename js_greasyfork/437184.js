// ==UserScript==
// @name         Prettier rust docs
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  改变doc.rust-lang.org、docs.rs文档style
// @author       Naturel
// @match        https://doc.rust-lang.org/*
// @match        https://docs.rs/*
// @icon         https://www.google.com/s2/favicons?domain=rust-lang.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437184/Prettier%20rust%20docs.user.js
// @updateURL https://update.greasyfork.org/scripts/437184/Prettier%20rust%20docs.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var isRun = false;

  const addDetailBorder = () => {
    document.head.insertAdjacentHTML(
      'beforeend',
      `<style>
        details.rustdoc-toggle {
          border: 1px solid green!important;
          margin-top: 5px;
          padding-left: 5px;
        }
      </style>`,
    );
  };

  if (!isRun) {
    addDetailBorder();
  }
})();
