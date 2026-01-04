// ==UserScript==
// @name         Oracle R12 Timesheet De-suckifier
// @version      0.4
// @description  Make oracle suck a little less
// @author       Mike Lovelace
// @match        http://pialimga1.harrisbroadcast.com:8010/*HXCTIMECARDACTIVITIESPAGE*
// @match        http://pialimga1.harrisbroadcast.com:8010/*TIMECARD-SAVED-FOR-LATER*
// @grant        none
// @namespace    imaginecommunications.com
// @downloadURL https://update.greasyfork.org/scripts/371771/Oracle%20R12%20Timesheet%20De-suckifier.user.js
// @updateURL https://update.greasyfork.org/scripts/371771/Oracle%20R12%20Timesheet%20De-suckifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addGlobalStyle(css){
        var head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle('td span input[title=Project] {width: 350px;}');
    // Your code here...
})();