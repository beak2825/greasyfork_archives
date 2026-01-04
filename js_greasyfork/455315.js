// ==UserScript==
// @name        LinkedIn: No Messages Boxes
// @namespace   https://fred.dev
// @match       https://www.linkedin.com/*
// @grant       none
// @version     1.0
// @author      Frédéric Harper
// @description It will close all the message boxes that are automatically added to the bottom left of the LinkedIn page.
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455315/LinkedIn%3A%20No%20Messages%20Boxes.user.js
// @updateURL https://update.greasyfork.org/scripts/455315/LinkedIn%3A%20No%20Messages%20Boxes.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
  //HTMLCollection: list item 0 is for a new message (even if not visible), 1 is for the messaging feature (cannot be closed)
  const msgBox = document.getElementsByClassName("msg-overlay-bubble-header__control");

  //Closing them instead or removing the HTML element so they don't reappear when you reopen LinkedIn or on new pages
  for (var i = 2; i < msgBox.length; i++) {
      msgBox[i].click();
  }

  //Removing the messaging box since it cannot be closed
  document.getElementById("msg-overlay").remove();

}, false);