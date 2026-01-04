// ==UserScript==
// @name        Zweitmarktalarm
// @namespace   Zweitmarkt Alarm sgd
// @match       *://karten.dynamo-dresden.de/*
// @grant       none
// @version     1.953
// @author      -
// @description Kartenalarm
// @downloadURL https://update.greasyfork.org/scripts/542825/Zweitmarktalarm.user.js
// @updateURL https://update.greasyfork.org/scripts/542825/Zweitmarktalarm.meta.js
// ==/UserScript==

function main() {
  const bodyEl = document.body.textContent.toLowerCase();
  if (bodyEl.includes("1. ligaheimspiel")) {
    if (bodyEl.includes("zweitmarkt")) {
      Alarm();
    } else {
      setTimeout(() => {
        location.reload()
      }, 5000)
    }
  }
}

function Alarm() {
  new Audio("http://dl.dropboxusercontent.com/scl/fi/3901qni32qqrwzimcb6vg/alarm.mp3?rlkey=6pvo79inlqhhgxrzmftbo7h9f&st=istrp926&dl=0").play()
  document.getElementsByTagName("body")[0].style = "background: green; font-family: times new roman";
}
 
window.addEventListener("load", function() {
  main();
});

document.addEventListener("keypress", function(e) {
  if (e.key == " ") Alarm();
});

document.addEventListener("dblclick", Alarm);
