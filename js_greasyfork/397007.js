// ==UserScript==
// @name         Agma Slow Feed
// @namespace    Agma Slow Feed
// @version      1.0.0
// @description  Like pressing w but slower
// @author       Samira
// @license      MIT
// @match        *://agma.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397007/Agma%20Slow%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/397007/Agma%20Slow%20Feed.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Code of the key that will be used to start the feeding.
  // Use this tool to find out key codes - just press a button: https://unixpapa.com/js/testkey.html
  // 84 = G
  var keyCode = 71;

  // Delay between the feeding in milliseconds
  var delay = 150;

  var lastAction = Date.now();

  var hotkeys = JSON.parse(localStorage.getItem('hotkeys'));

  var isWritingText = function() {
    return document.activeElement.type === 'text' || document.activeElement.type === 'password' || document.activeElement.type === 'textarea';
  };

  window.addEventListener('keydown', function(event)
  {
    if (event.keyCode === keyCode && ! event.shiftKey && ! isWritingText()) {
      if (Date.now() - lastAction > delay) {
        window.onkeydown({keyCode: hotkeys.W.c});
        window.onkeyup({keyCode: hotkeys.W.c});
        lastAction = Date.now();
      }
    }
  });

  console.log('Agma Slow Feed Script started!');
})();