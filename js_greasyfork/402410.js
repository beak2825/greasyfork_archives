// ==UserScript==
// @name Github tabs to Space
// @namespace github.com/alejandrosc/
// @match https://github.com/*
// @version 1.0.1
// @homepageURL https://github.com/alejandrosc
// @description tabs to space
// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/402410/Github%20tabs%20to%20Space.user.js
// @updateURL https://update.greasyfork.org/scripts/402410/Github%20tabs%20to%20Space.meta.js
// ==/UserScript==

"use strict";

window.onload = function () {
  const spaces = 2;
  const regex_find = /^\t+/;
  const regex_split = /[^\t]/;

  const query_selector =
    ".highlight.tab-size.js-file-line-container td.blob-code.blob-code-inner.js-file-line";

  const elements = document.querySelectorAll(query_selector);

  for (let i = 0, length = elements.length; i < length; i++) {
    let line = elements[i];
    line.innerHTML = line.innerHTML.replace(
      regex_find,
      " ".repeat(spaces * line.innerHTML.split(regex_split)[0].length),
      line.innerHTML
    );
  }
};
