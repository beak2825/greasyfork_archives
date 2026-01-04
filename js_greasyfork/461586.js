// ==UserScript==
// @name         ChatGPT LaTeX Support (Rendered by KaTeX)
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Support LaTeX (KaTeX) for ChatGPT
// @author       Lhc_fl
// @license      MIT
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/contrib/auto-render.min.js
// @downloadURL https://update.greasyfork.org/scripts/461586/ChatGPT%20LaTeX%20Support%20%28Rendered%20by%20KaTeX%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461586/ChatGPT%20LaTeX%20Support%20%28Rendered%20by%20KaTeX%29.meta.js
// ==/UserScript==

"use strict";

function render_item(item) {
  renderMathInElement(item, {
    // customised options
    // • auto-render specific keys, e.g.:
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true },
    ],
    // • rendering keys, e.g.:
    throwOnError: false,
  });
  return true;
}

function check_and_render(item) {
  if (!item) return false;
  if (item?.classList?.contains("math-display")) return false;
  if (item?.classList?.contains("rendered")) return false;
  if (item?.classList?.contains("katex")) return false;
  render_item(item);
  item.classList.add("rendered");
  console.log("render_succeed");
  return true;
}

function rend_latest() {
  try {
    const list = document.getElementsByClassName("text-base");
    for (const ppp of list) {
      for (const text of ppp.querySelectorAll(
        ".markdown:not(.result-streaming)"
      )) {
        check_and_render(text);
      }
      for (const text of ppp.querySelectorAll(
        ".markdown.result-streaming > *:not(:last-child):not(pre), " +
          ".markdown.result-streaming > ol:last-child li:not(last-child), " +
          ".markdown.result-streaming > ul:last-child li:not(last-child)"
      )) {
        check_and_render(text);
      }
    }
  } catch (e) {
    console.warn(e);
  }
}

window.katex = katex;

window.rend_latest = rend_latest;

setInterval(() => {
  rend_latest();
}, 1000);
