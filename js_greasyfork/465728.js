// ==UserScript==
// @name         github-form-control-selectable
// @namespace    https://github.com/KazooTTT/github-form-control-selectable
// @version      0.2
// @description  enable user to select formControl element
// @author       KazooTTT
// @match        https://*.github.com/*
// @icon         https://github.com/kazoottt.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465728/github-form-control-selectable.user.js
// @updateURL https://update.greasyfork.org/scripts/465728/github-form-control-selectable.meta.js
// ==/UserScript==

const insertStylesBySelector = (selector) => {
  const style = document.createElement("style");
  style.textContent = `
  ${selector} {
    user-select:auto
  }
  `;
  const head = document.querySelector("head");
  head.append(style);
};

(function () {
  "use strict";
  insertStylesBySelector(`.FormControl-label`);
})();
