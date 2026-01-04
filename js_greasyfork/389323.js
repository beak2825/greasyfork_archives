// ==UserScript==
// @name         IndexedDbClearer
// @namespace    indexeddbclearer
// @version      1.0
// @description  Clears the Open Framework IndexedDB.
// @author       Sinyaven
// @match        https://www.wanikani.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389323/IndexedDbClearer.user.js
// @updateURL https://update.greasyfork.org/scripts/389323/IndexedDbClearer.meta.js
// ==/UserScript==

(function() {
	"use strict";

	indexedDB.deleteDatabase("wkof.file_cache");
})();
