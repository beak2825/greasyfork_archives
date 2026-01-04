// ==UserScript==
// @name         7745.by
// @namespace    https://7745.by/
// @match        https://7745.by/img/*

// @version      1.0
// @description  High resolution photo
// @author       Mykola B.
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484825/7745by.user.js
// @updateURL https://update.greasyfork.org/scripts/484825/7745by.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (/card_modal_big/.test (location.href) ) {
        location.href=location.href.replace(/card_modal_big/, "original");
	}
})();