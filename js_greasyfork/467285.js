// ==UserScript==
// @name         Auto open daily page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatic opening of the daily page when the dashboard appears
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://probot.io/dashboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467285/Auto%20open%20daily%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/467285/Auto%20open%20daily%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkElement() {
        const element = $('.overview_card__MsjbH.col-md');

        if (element.length > 0) {
            GM_openInTab('https://probot.io/daily');

            $(window).off('load', checkElement);
        }
    }

    $(window).on('load', checkElement);
})();
