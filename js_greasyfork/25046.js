// ==UserScript==
// @name         Return This Shit
// @namespace    http://kadauchi.com/
// @version      1.0.2
// @description  Return HITs from HIT iframe
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      *
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/25046/Return%20This%20Shit.user.js
// @updateURL https://update.greasyfork.org/scripts/25046/Return%20This%20Shit.meta.js
// ==/UserScript==

const qs = selector => document.querySelector(selector);

// Tells mturk to return the HIT if the message is recieved
const receiveMessage = event => {
  if (event.data === `ReturnThisShit`) {
	if (document.URL.match(`www.mturk.com`)) qs(`img[src="/media/return_hit.gif"]`).click();
	if (document.URL.match(`worker.mturk.com`)) qs(`.btn-secondary`).click();
  }
};

// Check if we are on mturk and that the return button exists
if (document.URL.match(`mturk.com`) && (qs(`img[src="/media/return_hit.gif"]`) || qs(`.btn-secondary`) && qs(`.btn-secondary`).textContent.match(`Return`))) {
  window.addEventListener(`message`, receiveMessage, false);
}

// Checks if we are in an iframe
if (document.self !== top) {
  document.addEventListener(`keydown`, event => {
	if (event.which === 109) window.parent.postMessage(`ReturnThisShit`, `*`);
  });
}