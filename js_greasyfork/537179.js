// ==UserScript==
// @name         SMLWiki - Old Marvin Appearance
// @namespace    https://greasyfork.org/en/users/1434767
// @version      1.0
// @description  Replaces Marvin's appearance with the old one.
// @author       BoyOHBoy
// @match        https://smlwiki.com/characters/
// @match        https://smlwiki.com/characters/marvin
// @grant        none
// @icon         https://files.boyohboy.xyz/marvinblood.jpeg
// @downloadURL https://update.greasyfork.org/scripts/537179/SMLWiki%20-%20Old%20Marvin%20Appearance.user.js
// @updateURL https://update.greasyfork.org/scripts/537179/SMLWiki%20-%20Old%20Marvin%20Appearance.meta.js
// ==/UserScript==

(function () {
  'use strict';
  document.querySelectorAll('img[src="marvin.jpg"]').forEach(img => {
    img.src = "https://files.boyohboy.xyz/marvinblood.jpeg";
  });
})();