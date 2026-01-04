// ==UserScript==
// @name         Show current URL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show the current URL in an alert
// @author       TTT
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508048/Show%20current%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/508048/Show%20current%20URL.meta.js
// ==/UserScript==

var button = document.createElement("button");
button.textContent = "Show current URL";
button.onclick = function() {
  var currentUrl = window.location.href;
  alert(currentUrl);
};

var buttonContainer = document.createElement('div');
buttonContainer.style.position = 'fixed';
buttonContainer.style.top = '10px';
buttonContainer.style.right = '10px';
buttonContainer.style.zIndex = '9999';
buttonContainer.appendChild(button);
document.body.appendChild(buttonContainer);