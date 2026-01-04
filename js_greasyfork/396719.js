// ==UserScript==
// @name         JIRA Hidn Empty Sprint
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       happyeddie
// @include      */RapidBoard.jspa*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396719/JIRA%20Hidn%20Empty%20Sprint.user.js
// @updateURL https://update.greasyfork.org/scripts/396719/JIRA%20Hidn%20Empty%20Sprint.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function hideEmptySprint() {
        console.log("1");
        setTimeout(hideEmptySprint, 300);

        $('div.ghx-no-issues').not('.js-empty-list').parents('.ghx-backlog-container').hide();
    }

    hideEmptySprint();

})();