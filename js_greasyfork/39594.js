// ==UserScript==
// @name         a9 sim script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *amazonaws*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/39594/a9%20sim%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39594/a9%20sim%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    $(document).keyup(function(event){
        if (event.which == 49 || event.which == 103){ //1 or keypad 7
            $('#result3').click();
            document.querySelector(`[id="submitButton"]`).click();
        }else if (event.which == 50 || event.which == 104){ //2 or keypad 8
            $('#result4').click();
            document.querySelector(`[id="submitButton"]`).click();
        }

    });
});