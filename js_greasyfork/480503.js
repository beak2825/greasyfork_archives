// ==UserScript==
// @name         New Yorker Crossword "Check Word" Keybind
// @namespace    vaindil
// @version      1.0
// @description  Checks the current word when ctrl+C is pressed on the New Yorker crossword puzzle
// @author       You
// @match        https://www.newyorker.com/puzzles-and-games-dept/crossword/*
// @match        https://*.amuselabs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=newyorker.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480503/New%20Yorker%20Crossword%20%22Check%20Word%22%20Keybind.user.js
// @updateURL https://update.greasyfork.org/scripts/480503/New%20Yorker%20Crossword%20%22Check%20Word%22%20Keybind.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const crossword = document.querySelector('.puzzle-type-crossword');
  crossword.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      const checkWordEl = crossword.querySelector('.check-word-button');
      checkWordEl.click();
    }
  });
})();