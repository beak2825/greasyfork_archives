// ==UserScript==
// @name        InoReader - Fix Open Article in Background Tab HTTPS
// @namespace   https://greasyfork.org/en/users/13300-littlepluto
// @description Fixes InoReader's keyboard shortcut to open articles in background tabs in Firefox. Works with https.
// @match       https://www.inoreader.com/*
// @version     1.2
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/13859/InoReader%20-%20Fix%20Open%20Article%20in%20Background%20Tab%20HTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/13859/InoReader%20-%20Fix%20Open%20Article%20in%20Background%20Tab%20HTTPS.meta.js
// ==/UserScript==
var element = document.createElement('div');
element.id = 'inoreader_companion_div';
document.body.appendChild(element);
window.addEventListener('message', receiveMessage);
function receiveMessage(event) {
  //console.log("receiveMessage event: ");
  //console.log(event);
  if (event.origin == 'https://www.inoreader.com') {
    if (event.data.request && event.data.request.url) {
      //console.log(event.data.request.url);
      GM_openInTab(event.data.request.url, true);
    }
  }
}