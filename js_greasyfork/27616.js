// ==UserScript==
// @name        Feedly Customization
// @namespace   http://userscripts.org/users/colt365
// @description Customization for Feedly.
// @include     https://feedly.com/*
// @version     1.2.0.20170223
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27616/Feedly%20Customization.user.js
// @updateURL https://update.greasyfork.org/scripts/27616/Feedly%20Customization.meta.js
// ==/UserScript==

var checkLoadInterval;

function generateHistoryButton(target) {
  var historyButton = document.createElement('button');
  historyButton.className = 'full-width onboarded button-icon-left';
  historyButton.style = 'background-color: rgb(71, 119, 180); margin: -5% 0;';
  historyButton.setAttribute('data-uri','label/feedly.history');
  historyButton.innerText = 'Recently Read';
  target.parentNode.appendChild(historyButton);
}

function checkLoaded() {
  var targetButton = document.getElementById('addContentPlaceholderFX');
  if (targetButton) {
    window.clearInterval(checkLoadInterval);
    targetButton = targetButton.querySelector('button');
    targetButton.style.padding = '1px';
    targetButton.style.margin = '-3% 0';
    generateHistoryButton(targetButton);
  }
}

checkLoadInterval = setInterval(checkLoaded, 5000);
