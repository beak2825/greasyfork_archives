// ==UserScript==
// @name           ads highlighter for yandex search
// @namespace      Violentmonkey Scripts
// @match          https://yandex.ru/search/*
// @match          https://ya.ru/search/*
// @grant          GM_addStyle
// @version        2.1
// @author         yyko
// @description    highlights ads label
// @description:ru выделяет плашку "Промо" в рекламных блоках
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/490804/ads%20highlighter%20for%20yandex%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/490804/ads%20highlighter%20for%20yandex%20search.meta.js
// ==/UserScript==

GM_addStyle(`.AdvLabel-Text {
  background-color: red;
  border-radius: 10px;
  padding: 0 5px;
  color: var(--depot-color-text-primary);
}`);