// ==UserScript==
// @name        DynamoAlarm
// @namespace   Zweitmarkt Alarm
// @match       *://karten.dynamo-dresden.de/*
// @grant       none
// @version     187.1.8.7
// @author      -
// @description 🌲kattn
// @downloadURL https://update.greasyfork.org/scripts/533237/DynamoAlarm.user.js
// @updateURL https://update.greasyfork.org/scripts/533237/DynamoAlarm.meta.js
// ==/UserScript==

function main() {
  const bodyEl = document.body.textContent.toLowerCase();
  if (bodyEl.includes("6. ligaheimspiel")) {
    if (bodyEl.includes("zweitmarkt") || bodyEl.includes("filter")) {
      new Audio("http://dl.dropboxusercontent.com/scl/fi/3901qni32qqrwzimcb6vg/alarm.mp3?rlkey=6pvo79inlqhhgxrzmftbo7h9f&st=istrp926&dl=0").play()

      const body = document.getElementsByTagName("body")[0];
      body.style.setProperty("background-color", "green", "important");

      setTimeout(() => {
        body.style.setProperty("background-image", "none", "important");
      }, 500)
    } else {
      setTimeout(() => {
        location.reload()
      }, 5000)
    }
  }
}

window.addEventListener("load", function() {
  main();
});