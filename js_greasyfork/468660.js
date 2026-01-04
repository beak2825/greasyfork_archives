// ==UserScript==
// @name        NoPride
// @namespace   pwa
// @license     MIT
// @match       https://*.posten.no/*
// @icon https://posten.no/favicon.ico
// @grant       none
// @version     1.0
// @author      pwa
// @description 6/14/2023, 4:57:30 PM
// @downloadURL https://update.greasyfork.org/scripts/468660/NoPride.user.js
// @updateURL https://update.greasyfork.org/scripts/468660/NoPride.meta.js
// ==/UserScript==

/*
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

*/

window.addEventListener('load', function() {
  let nag = document.getElementById("hw-block--mb-medium-2");
  if (!nag)
    return;
  nag.setAttribute('hidden', true);
});