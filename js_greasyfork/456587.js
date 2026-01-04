// ==UserScript==
// @name         Lolzteam Chat Cleaner
// @version      0.1
// @description  Adds a button to clear forum chat
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @namespace https://greasyfork.org/users/997663
// @downloadURL https://update.greasyfork.org/scripts/456587/Lolzteam%20Chat%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/456587/Lolzteam%20Chat%20Cleaner.meta.js
// ==/UserScript==

var clean = document.createElement('a');
clean.className = 'element';
clean.innerHTML = 'Очистить чат';
clean.onclick = function() {
  var dynamicElements = document.querySelectorAll('[id^="chatboxMessage_"]');
  for (var i = 0; i < dynamicElements.length; i++) {
    dynamicElements[i].parentNode.removeChild(dynamicElements[i]);
  }
};
document.querySelector('#XenForoUniq2 > ul').appendChild(clean);