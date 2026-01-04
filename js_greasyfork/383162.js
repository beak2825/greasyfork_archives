// ==UserScript==
// @name         Auto Accept Terms of Use
// @namespace    iceland-sfcc-scripts
// @version      0.1.3
// @description  Fix quality of life issues
// @author       Daniel Loader
// @match        https://*/on/demandware.store/Sites-Site/default/ViewApplication-*Login
// @match        https://*/on/demandware.store/Sites-Site/default/ViewApplication-DisplayWelcomePage
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/383162/Auto%20Accept%20Terms%20of%20Use.user.js
// @updateURL https://update.greasyfork.org/scripts/383162/Auto%20Accept%20Terms%20of%20Use.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.ackn').prop('checked', true);
})();