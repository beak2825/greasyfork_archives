// ==UserScript==
// @name         RS Wiki - Hide Finished Quests & Update Counts
// @version      1.0.2
// @description  quest count
// @author       You
// @match        https://runescape.wiki/w/List_of_quests_by_age*
// @match        https://runescape.wiki/w/Quests/Strategy*
// @grant        none
// @namespace https://greasyfork.org/users/316895
// @downloadURL https://update.greasyfork.org/scripts/406639/RS%20Wiki%20-%20Hide%20Finished%20Quests%20%20Update%20Counts.user.js
// @updateURL https://update.greasyfork.org/scripts/406639/RS%20Wiki%20-%20Hide%20Finished%20Quests%20%20Update%20Counts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("<style type='text/css'> tr.highlight-on{display:none;} </style>").appendTo("head");
    if (window.location.href.indexOf('/w/List_of_quests_by_age') > 0) {
        setInterval(function() {
            jQuery('.tabber .tabbertab:visible > p:first').html(jQuery('.tabber .tabbertab:visible > p:first').html().trim().replace(jQuery('.tabber .tabbertab:visible > p:first').html().trim().match(/(\d+)/)[0], jQuery('.tabber .tabbertab:visible .wikitable.lighttable.qc-active tbody tr:not(.highlight-on)').length));
        }, 1000);
    }
    
})();