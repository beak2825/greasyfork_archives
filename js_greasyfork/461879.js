// ==UserScript==
// @name        AutoCal: mail.office.com
// @namespace   Violentmonkey Scripts
// @license MIT
// @match       https://*.office.com/mail/*
// @grant       none
// @version     1.0
// @author      pwa
// @description 11/23/2022, 11:47:24 PM
// @downloadURL https://update.greasyfork.org/scripts/461879/AutoCal%3A%20mailofficecom.user.js
// @updateURL https://update.greasyfork.org/scripts/461879/AutoCal%3A%20mailofficecom.meta.js
// ==/UserScript==


let timeout = 500;
let observer = new MutationObserver(resetTimer);
let timer = setTimeout(action, timeout, observer);
observer.observe(document, {childList: true, subtree: true});

// reset timer every time something changes
function resetTimer(changes, observer) {
    clearTimeout(timer);
    timer = setTimeout(action, timeout, observer);
}

function action(observer) {
  observer.disconnect();
  pwa_main();
}

function pwa_main() {
  f = document.getElementById('flexPaneScrollRegion')
  if (!f) {
    b = document.getElementById("Time")
    b.click();
    console.log("pwa: clicking calendar")
  } else {
    console.log("pwa: calendar already shown")
  }
}



