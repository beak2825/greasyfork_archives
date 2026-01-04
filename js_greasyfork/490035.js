// ==UserScript==
// @name         Open direct image after converting on Ezgif
// @namespace    https://github.com/AbdurazaaqMohammed
// @version      1.0
// @description  Open direct link to the image after converting on Ezgif
// @author       Abdurazaaq Mohammed
// @match        https://ezgif.com/*/*.*
// @grant        none
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @license      The Unlicense
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/490035/Open%20direct%20image%20after%20converting%20on%20Ezgif.user.js
// @updateURL https://update.greasyfork.org/scripts/490035/Open%20direct%20image%20after%20converting%20on%20Ezgif.meta.js
// ==/UserScript==

(function() {
  'use strict';

  setInterval(function() {
    const img = document.getElementById('output').getElementsByTagName('img')[0];
    if(img) {
      if (!img.src.endsWith('loadcat.gif')) {
        window.location.href = img.src;
      }
    }
  }, 500)
})();
