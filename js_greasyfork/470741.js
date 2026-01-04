// ==UserScript==
// @name        Reload Translation - 127.0.0.1
// @namespace   Violentmonkey Scripts
// @match       http://127.0.0.1:8000/
// @grant       none
// @version     1.0
// @author      -
// @description 13.07.2023, 13:38:24
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470741/Reload%20Translation%20-%20127001.user.js
// @updateURL https://update.greasyfork.org/scripts/470741/Reload%20Translation%20-%20127001.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(e) {
  if (e.altKey && e.key === 't') {
    e.preventDefault();
    applyLocale();
  }
});
