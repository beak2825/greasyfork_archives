// ==UserScript==
// @name         Google Inbox Unpinner
// @namespace    michaelkeenan
// @version      0.3
// @description  Constantly presses any un-pin buttons on the Google Inbox interface
// @author       Michael Keenan
// @match        https://inbox.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32368/Google%20Inbox%20Unpinner.user.js
// @updateURL https://update.greasyfork.org/scripts/32368/Google%20Inbox%20Unpinner.meta.js
// ==/UserScript==

var poll_interval = 500; // milliseconds
var paused = false;

function unpin_everything() {
  if (!paused) {
    // we could use document.querySelectorAll("li.itemIconPinned") but getElementsByClassName and filter runs faster
    var unpin_buttons = Array.from(document.getElementsByClassName('itemIconPinned')).filter(el => el.tagName == 'LI');
    for (var i = 0; i < unpin_buttons.length; i++) {
        unpin_buttons[i].click();
    }
    // var time = new Date().toTimeString().match(/\d\d?:\d\d:\d\d/)[0];
    // console.log(time + ": unpinned " + unpin_buttons.length + " messages.");
  }
}

(function() {
  window.setInterval(unpin_everything, poll_interval);

  /* page visibility code from https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API */

  // Set the name of the hidden property and the change event for visibility
  var hidden, visibilityChange;
  if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
    hidden = "hidden";
    visibilityChange = "visibilitychange";
  } else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
  } else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
  }

  function handleVisibilityChange() {
    if (document[hidden]) {
      paused = true;
    } else {
      paused = false;
    }
  }

  // Warn if the browser doesn't support addEventListener or the Page Visibility API
  if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
    console.log("The Google Inbox Unpinner user script requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
  } else {
    // Handle page visibility change
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
  }
})();
