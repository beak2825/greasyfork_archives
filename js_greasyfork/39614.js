// ==UserScript==
// @name         juice script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/39614/juice%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39614/juice%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    var win = "";
    win = $('.dont-break-out').attr("href").trim();
    console.log(win);
    if (win) {
        //Browser has allowed it to be opened
        win.focus();
    } else {
        //Browser has blocked it
        alert('Please allow popups for this website');
    }
});
