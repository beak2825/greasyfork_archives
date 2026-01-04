// ==UserScript==
// @name         Time.is clock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Optimize Time.is for kiosk mode
// @author       Domonkos Lezsak
// @match        https://time.is/*
// @grant        none
// @license GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/438353/Timeis%20clock.user.js
// @updateURL https://update.greasyfork.org/scripts/438353/Timeis%20clock.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.innerText = `
a[title="Time.is"] {
  opacity: 0.5;
}

#clock {
  color: green;
}

body::-webkit-scrollbar {
  display: none;
}

#qc-cmp2-container {
  display: none;
}
`
  document.body.appendChild(style);

  togglesimple();
})();
