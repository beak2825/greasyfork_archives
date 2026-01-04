// ==UserScript==
// @name        Rename title of Kolab Roundcube pages
// @description Move leading "Kolab Groupware :: " to the end of the title to have the relevant pieces in front. This helps finding the proper tab.
// @namespace   https://greasyfork.org/users/196022
// @version     3.1
// @grant       none
// @match       *://*/webmail/*
// @downloadURL https://update.greasyfork.org/scripts/370267/Rename%20title%20of%20Kolab%20Roundcube%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/370267/Rename%20title%20of%20Kolab%20Roundcube%20pages.meta.js
// ==/UserScript==

if (document.title.includes("Kolab Groupware :: ")) {
  document.title = document.title.replace(/^(.*)?(Kolab Groupware) :: (.*)$/, '$1$3 :: $2');
}

new MutationObserver(function(mutations) {
  console.log(document.title);
  if (document.title.includes("Kolab Groupware :: ")) {
    document.title = document.title.replace(/^(.*)?(Kolab Groupware) :: (.*)$/, '$1$3 :: $2');
  }
}).observe(
  document.querySelector('title'),
  { childList: true, subtree: true, characterData: true }
);