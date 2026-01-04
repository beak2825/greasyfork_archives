// ==UserScript==
// @name         Search Box Keyboard Shortcut for General Websites
// @version      1.4
// @description  Adds a keyboard shortcut to jump to the search box on websites when '/' is pressed. Forked from Lak's script with the same name.
// @author       Arg Anon
// @originalAuthor Lak
// @icon         https://img.icons8.com/?size=32&id=132&format=png
// @match        https://*/*
// @exclude      https://www.google.*/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/768814
// @downloadURL https://update.greasyfork.org/scripts/544421/Search%20Box%20Keyboard%20Shortcut%20for%20General%20Websites.user.js
// @updateURL https://update.greasyfork.org/scripts/544421/Search%20Box%20Keyboard%20Shortcut%20for%20General%20Websites.meta.js
// ==/UserScript==
  
(function(){
  'use strict';
  document.addEventListener('keydown', function(e) {
    // target the specific elements for the search boxes on websites
    const searchBox = document.querySelector('input[type=text], textarea[aria-label~=Search], input[aria-label~=Search], .searchboxinput, input[id=query-input], input[id=searchform], input[type=Search], textarea[inputmode=search], .js-search-input.search__input--adv, .header-search-field, input[enterkeyhint=go], button.AppHeader-searchButton');
    // check if user is currently typing text somewhere on the site
    const isTyping = document.activeElement.matches("textarea, input[type=text], input[type=url], [contenteditable=true]");

    if (e.key === '/' && searchBox && !isTyping) {
      e.preventDefault();
      if (searchBox.matches("button"))
        searchBox.click();
      else {
        searchBox.focus();
        searchBox.setSelectionRange(0, searchBox.value.length);
      }
    }
  });
}());