// ==UserScript==
// @name         Force Select
// @version      1.0
// @description  Stop sites from disabling selection of text
// @author       You
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/774191
// @downloadURL https://update.greasyfork.org/scripts/426760/Force%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/426760/Force%20Select.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let style = document.createElement('style');
  style.innerHTML = '*{ user-select: auto !important; }';

  document.body.appendChild(style);
})();