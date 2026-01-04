// ==UserScript==
// @name         oj.uz contest mode
// @namespace    http://tampermonkey.net/
// @version      2024-08-25
// @description  Hides information on oj.uz about other user submissions to better simulate a contest environment
// @author       You
// @match        https://oj.uz/problem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @copyright 2012+, hibbard.eu
// @downloadURL https://update.greasyfork.org/scripts/505120/ojuz%20contest%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/505120/ojuz%20contest%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const hideElements = () => {
        $('a:contains("Statistics")').hide();
        $('a:contains("Submissions")').hide();
        $('a:contains("Submissions")').hide();
        const tableRow = $('th:contains("# of submissions")').closest('table').find('tbody tr');
        tableRow.find("td:nth-child(3)").hide()
        tableRow.find("td:nth-child(4)").hide()
        tableRow.find("td:nth-child(5)").hide()
    }
    hideElements()
    // Your code here...
    $(document).ready(hideElements);
})();
