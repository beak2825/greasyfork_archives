// ==UserScript==
// @name         GitHub Halloween
// @namespace    https://github.com/KeyWeeUsr/Userscripts
// @version      0.6
// @description  Experience Halloween every day
// @author       Peter Badida
// @copyright    2016+, Peter Badida
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepage     https://github.com/KeyWeeUsr/Userscripts/tree/master/Halloween
// @supportURL   https://github.com/KeyWeeUsr/Userscripts/issues
// @icon         https://github.com/favicon.ico
// @include      https://*github.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ACVM74AYCXVWQ
// @grant        GM_addStyle
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/24503/GitHub%20Halloween.user.js
// @updateURL https://update.greasyfork.org/scripts/24503/GitHub%20Halloween.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
(function () {
    var items = document.getElementsByClassName("day");
    var dayFill;
    for (var i=0; i < items.length; i++) {
        dayFill = $(items[i]).attr('fill');
        if (dayFill == "#196127") {
            $(items[i]).attr('fill', '#03001C');
        } else if (dayFill == "#239a3b") {
            $(items[i]).attr('fill', '#FE9600');
        } else if (dayFill == "#7bc96f") {
            $(items[i]).attr('fill', '#FFC501');
        } else if (dayFill == "#c6e48b") {
            $(items[i]).attr('fill', '#FFEE4A');
        } else {
            $(items[i]).attr('fill', '#EEEEEE');
        }
    }

    var css = '\
ul.legend > li {\
    background-color: #EEEEEE !important;\
}\
ul.legend > li + li {\
    background-color: #FFEE4A !important;\
}\
ul.legend > li + li + li {\
    background-color: #FFC501 !important;\
}\
ul.legend > li + li + li + li {\
    background-color: #FE9600 !important;\
}\
ul.legend > li + li + li + li + li {\
    background-color: #03001C !important;\
}';
    GM_addStyle(css);
})();
/*
Notify me if there's something missing/undesirable.
*/
