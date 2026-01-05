// ==UserScript==
// @name        InoReader - Fix Open Article in Background Tab
// @namespace   https://greasyfork.org/en/users/13300-littlepluto
// @description Fixes InoReader's keyboard shortcut to open articles in background tabs in Firefox
// @match       http://www.inoreader.com/*
// @version     1.1
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/11519/InoReader%20-%20Fix%20Open%20Article%20in%20Background%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/11519/InoReader%20-%20Fix%20Open%20Article%20in%20Background%20Tab.meta.js
// ==/UserScript==
var element = document.createElement('div');
element.id = 'inoreader_companion_div';
document.body.appendChild(element);
window.addEventListener('message', receiveMessage);
function receiveMessage(event) {
  //console.log("receiveMessage event: ");
  //console.log(event);
  if (event.origin == 'http://www.inoreader.com') {
    if (event.data.request && event.data.request.url) {
      //console.log(event.data.request.url);
      GM_openInTab(event.data.request.url, true);
    }
  }
}
