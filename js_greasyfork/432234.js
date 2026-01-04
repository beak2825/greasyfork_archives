// ==UserScript==
// @name         Common Sense Media Free
// @namespace    https:/hrry.xyz
// @version      0.1
// @description  Removes limits set by commonsensemedia and allows you to view as much reviews as you like.
// @author       Harry Kruger
// @match        https://www.commonsensemedia.org/movie-reviews/*
// @icon         https://www.google.com/s2/favicons?domain=commonsensemedia.org
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/432234/Common%20Sense%20Media%20Free.user.js
// @updateURL https://update.greasyfork.org/scripts/432234/Common%20Sense%20Media%20Free.meta.js
// ==/UserScript==

const GATING_NAME = 'STYXKEY-content-gating-SR1';

/*global Cookies*/

(function() {
    window.localStorage.removeItem(GATING_NAME);
    Cookies.remove('STYXKEY-content-gating-SR1');
})();