// ==UserScript==
// @name         Doka search focus with mouse
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Помещает фокус на строку поиска при вызове меню мышью
// @author       Vallek
// @match        https://doka.guide/*
// @exclude      https://doka.guide/
// @exclude      https://doka.guide/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=doka.guide
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516657/Doka%20search%20focus%20with%20mouse.user.js
// @updateURL https://update.greasyfork.org/scripts/516657/Doka%20search%20focus%20with%20mouse.meta.js
// ==/UserScript==

'use strict';

const searchButton = document.querySelector('.header-button[aria-expanded="false"]');
const search = document.querySelector('#search-field');

searchButton.addEventListener('click', () => {
  search.focus();
});