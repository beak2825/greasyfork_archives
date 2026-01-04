// ==UserScript==
// @name         Previo Redmine NoIssuesMsg
// @namespace    thetomcz.previo.redmine.noIssuesMsg
// @description  Changes "empty issue table" to nice "All done" message :)
// @version      0.1
// @icon         https://www.previo.cz/icons/share/128x128/favicon.ico
// @author       Tomáš Hejl <tomas.hejl@previo.info>
// @match        https://redmine.previo.info/*issues*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492248/Previo%20Redmine%20NoIssuesMsg.user.js
// @updateURL https://update.greasyfork.org/scripts/492248/Previo%20Redmine%20NoIssuesMsg.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let IssueFilter = {

        run : function () {
            $(".nodata").text('All done! :)');
        },
    };

    IssueFilter.run();

})();