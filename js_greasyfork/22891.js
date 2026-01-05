// ==UserScript==
// @name        Skip Steam Link filter
// @description Annoying but necessary, except for people that know their stuff.
// @include     *://steamcommunity.com/*
// @namespace   https://greasyfork.org/users/4813
// @version     2023.12.15
// @author      Swyter
// @author      MoneyAllDay
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22891/Skip%20Steam%20Link%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/22891/Skip%20Steam%20Link%20filter.meta.js
// ==/UserScript==

for (var link of document.querySelectorAll(`a[href^='https://steamcommunity.com/linkfilter/']`)) {
  const urlParam = new URLSearchParams(link.search);
  const originalURL = urlParam.get('u');

  if (originalURL) {
    link.href = decodeURIComponent(originalURL);
  }
}