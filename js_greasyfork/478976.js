// ==UserScript==
// @name         Scanlover: set notifications data length to max
// @description  Set notifications limit to max
// @version      1.0
// @author       Angelium
// @match        https://scanlover.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scanlover.com
// @grant        none
// @run-at document-start
// @namespace https://greasyfork.org/users/933976
// @downloadURL https://update.greasyfork.org/scripts/478976/Scanlover%3A%20set%20notifications%20data%20length%20to%20max.user.js
// @updateURL https://update.greasyfork.org/scripts/478976/Scanlover%3A%20set%20notifications%20data%20length%20to%20max.meta.js
// ==/UserScript==

const oldOpen = window.XMLHttpRequest.prototype.open;

window.XMLHttpRequest.prototype.open = function() {
  let [method, url, isAsync, user, password] = arguments;
  if (url.includes('/api/notifications')) url += '?page[limit]=50';
  return oldOpen.apply(this, [method, url, isAsync, user, password]);
};