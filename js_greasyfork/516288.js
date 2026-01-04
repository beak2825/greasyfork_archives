// ==UserScript==
// @name        deezer: sort by release date
// @namespace   Violentmonkey Scripts
// @match       https://www.deezer.com/*
// @grant       none
// @version     0.1.5
// @author      -
// @description autoclick to sort by Release date
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/516288/deezer%3A%20sort%20by%20release%20date.user.js
// @updateURL https://update.greasyfork.org/scripts/516288/deezer%3A%20sort%20by%20release%20date.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var running = false;

  function open_menu() {
    if (running) { return; };
    var menu     = document.querySelector("div.catalog-tab-discography button[data-testid='dropdown_most played' i]");
    var dropdown = document.querySelector("div.catalog-tab-discography span.dropdown-active");
    if (menu && !dropdown) {
      running = true;
      menu.click();
      setTimeout(click_item, 500);
      setTimeout(clear_flag, 5000);
    }
  }

  function click_item() {
    document.querySelectorAll("div.catalog-tab-discography span.dropdown-active a")[0]?.click();
  }

  function clear_flag() {
    running = false;
  }


  setInterval(open_menu, 500);

})();