// ==UserScript==
// @name        Google Translate Auto Languages
// @name:zh-CN  Google谷歌翻译自动中英互译
// @description Auto switch Chinese/English
// @description:zh-CN 自动切换目标语言为中/英文
// @namespace   https://greasyfork.org/users/197529
// @version     1.6
// @author      kkocdko
// @license     Unlicense
// @match       *://translate.google.com/*
// @match       *://translate.google.cn/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/378166/Google%20Translate%20Auto%20Languages.user.js
// @updateURL https://update.greasyfork.org/scripts/378166/Google%20Translate%20Auto%20Languages.meta.js
// ==/UserScript==
"use strict";

const firstLangRule = /English|英语/;
const firstLang = "en";
const secondLang = "zh-CN";

const detectTab = document.querySelector("[role=tab]");
new MutationObserver(() => {
  const isFirstLang = firstLangRule.test(detectTab.textContent);
  const lang = isFirstLang ? secondLang : firstLang;
  const selector = `[data-popup-corner]~* [data-language-code=${lang}]`;
  const tab = document.querySelector(selector);
  if (tab.getAttribute("aria-selected") !== "true") tab.click();
}).observe(detectTab, { characterData: true, subtree: true });
if (detectTab.getAttribute("aria-selected") !== "true") detectTab.click();
