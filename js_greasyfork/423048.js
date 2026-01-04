// ==UserScript==
// @name Neil's Toolbox "Date last visited" auto-filler
// @version 0.1
// @author Hamolicious
// @description Automatically pre-fills the "Date last visited" input on Neil's Toolbox Harvard Reference Generator
// @match http://www.neilstoolbox.com/bibliography-creator/reference-website.htm
// @license MIT
// @grant none
// @namespace https://greasyfork.org/en/users/745906-hamolicious
// @downloadURL https://update.greasyfork.org/scripts/423048/Neil%27s%20Toolbox%20%22Date%20last%20visited%22%20auto-filler.user.js
// @updateURL https://update.greasyfork.org/scripts/423048/Neil%27s%20Toolbox%20%22Date%20last%20visited%22%20auto-filler.meta.js
// ==/UserScript==

function intToMonth(integer) {
    switch(integer+1) {
        case 1:
            return 'January';
        case 2:
            return 'February';
        case 3:
            return 'March';
        case 4:
            return 'April';
        case 5:
            return 'May';
        case 6:
            return 'June';
        case 7:
            return 'July';
        case 8:
            return 'August';
        case 9:
            return 'September';
        case 10:
            return 'October';
        case 11:
            return 'November';
        case 12:
            return 'December';
    }
}

(function() {
    'use strict';
    var date = new Date();
    var todayDate = date.getDate() + ' ' + intToMonth(date.getMonth()) + ' ' + date.getFullYear();

    var node = document.getElementsByName('date')[0];
    node.value = todayDate;
})();