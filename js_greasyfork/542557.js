// ==UserScript==
// @name         Reddit - Back To Top
// @version      1.0
// @description  Adds a small bottom corner button on (New) Reddit to go back to the top.
// @author       Mane
// @license      CCO-1.0
// @match        https://www.reddit.com/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/1491313
// @downloadURL https://update.greasyfork.org/scripts/542557/Reddit%20-%20Back%20To%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/542557/Reddit%20-%20Back%20To%20Top.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const BTN_ID = 'scrollToTopBtn';

  function addButton() {
    if (document.getElementById(BTN_ID)) return;

    var btn = document.createElement('div');
    btn.id = BTN_ID;
    btn.title = 'Scroll to Top';
    btn.innerHTML = '⬆';

    // Basic styling
    btn.style.position        = 'fixed';
    btn.style.bottom          = '20px';
    btn.style.right           = '20px';
    btn.style.width           = '40px';
    btn.style.height          = '40px';
    btn.style.backgroundColor = 'rgba(0,0,0,0.7)';
    btn.style.color           = '#fff';
    btn.style.fontSize        = '22px';
    btn.style.textAlign       = 'center';
    btn.style.lineHeight      = '40px';
    btn.style.borderRadius    = '4px';
    btn.style.cursor          = 'pointer';
    btn.style.zIndex          = '9999';

    // Scroll to top on click
    btn.onclick = function() {
      window.scrollTo(0, 0);
    };

    document.body.appendChild(btn);
  }

  // Initial injection
  addButton();

  // Re-inject after Reddit’s client-side navigation
  var origPush = history.pushState;
  history.pushState = function() {
    origPush.apply(this, arguments);
    addButton();
  };
  window.addEventListener('popstate', addButton);

})();
