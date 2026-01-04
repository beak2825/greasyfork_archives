// ==UserScript==
// @name         Jump@5ch Auto Jump
// @namespace    https://greasyfork.org/users/216002
// @version      1.0.2
// @description  Jump@5ch のページを開いたとき、自動でジャンプ先のページに移ります。
// @author       Itomozuku
// @match        *://jump.5ch.net/?*
// @match        *://2ch.io/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/372878/Jump%405ch%20Auto%20Jump.user.js
// @updateURL https://update.greasyfork.org/scripts/372878/Jump%405ch%20Auto%20Jump.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function removeAllElements(tag) {
    var targetElements = document.querySelectorAll(tag);
    for (var i = 0; i < targetElements.length; i++) {
      targetElements[i].remove();
    }
  }

  window.stop();

  removeAllElements('div');
  removeAllElements('hr');

  var link = document.querySelector('a');
  var redirectUrl = link.getAttribute('href');

  if (!redirectUrl) return;

  link.innerText = 'Now Loading...';

  location.replace(redirectUrl);

})();