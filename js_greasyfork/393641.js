// ==UserScript==
// @name         Mangadex Auto select "Follows" tab
// @namespace    https://greasyfork.org/en/users/158832
// @version      0.1
// @description  Mangadex home auto click follows tab
// @author       Riztard
// @match        https://mangadex.org/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393641/Mangadex%20Auto%20select%20%22Follows%22%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/393641/Mangadex%20Auto%20select%20%22Follows%22%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

	document.getElementsByClassName('nav-link')[7].click();

})();