// ==UserScript==
// @name        Ontario vaccine notification
// @namespace   Violentmonkey Scripts
// @match       https://ontariomoh.queue-it.net/
// @grant       none
// @version     1.1
// @author      AS
// @grant GM_notification
// @description Attempts to detect when you're finished with the vaccination "queue" on the ontario vaccine website
// @downloadURL https://update.greasyfork.org/scripts/425877/Ontario%20vaccine%20notification.user.js
// @updateURL https://update.greasyfork.org/scripts/425877/Ontario%20vaccine%20notification.meta.js
// ==/UserScript==

// String to search for whichi s present in the "waiting" state
var SEARCH_STRING = "Your turn started";

// Div to search
var SEARCH_ID = "content";

var INTERVAL = 5000;

GM_notification({
  text: "Started watching vaccination page for changes"
})
var interval_id = setInterval(function () {
  var text = document.getElementById(SEARCH_ID).innerText
  if(text.search(SEARCH_STRING) >= 0) {
    // Text is missing
    GM_notification({
      title: "Detected change in vaccination page.",
      text: "Please check the page. Click this notification to stop scanning",
                    onclick: function () {
                      clearInterval(interval_id)
                    }})    
  }
}, INTERVAL)