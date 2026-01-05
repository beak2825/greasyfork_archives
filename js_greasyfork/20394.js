// ==UserScript==
// @name         Google Calendar - Hide Header
// @namespace    http://seanbannister.com/
// @version      0.3
// @description  Hide the header of Google Calendar. Show it when you click on the "Calendar" logo in the top left.
// @author       Sean Bannister
// @match        *://calendar.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/20394/Google%20Calendar%20-%20Hide%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/20394/Google%20Calendar%20-%20Hide%20Header.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var header = document.getElementById('onegoogbar').style;

  // Hide the header
  header.display = 'none';

  // When you click on the word "Calednar" (The logo in the top left)
  document.getElementById('mainlogo').addEventListener('click', function() {
    // If header is hidden show it
    if (header.display == 'none') {
      header.display = 'block';
    }
    // If header is showing hide it
    else if (header.display == 'block') {
      header.display = 'none';
    }
  });

  /**
   * Make the popups that display reminders and events details larger.
   */
  addGlobalStyle('.bubble { top: 130px; width: 700px !important; }');
  addGlobalStyle('div[jsname=QScM4d] { max-height: 500px !important; }');
  addGlobalStyle('.reminder-title-container { width: 560px; }');
  addGlobalStyle('.reminder-title-container span { max-width: 550px !important; }');
  // When you create or edit a reminder make the time drop down larger so you don't have to scroll through it as much.
  addGlobalStyle('.reminder-bubble .duedate-tile .goog-container-vertical { height: 900px !important; }');


  function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }
})();