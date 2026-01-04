// ==UserScript==
// @name         Jake phillips script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/39616/Jake%20phillips%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39616/Jake%20phillips%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('input[value=FALSE]').click();
    $('input[class=form-control]').eq(0).select();
    $('input[id=8a]').click();
    $(document).keyup(function(event){
        if (event.which == 54){
            $('input[id=8b]').click();
        }else if (event.which == 55){
            $('input[id=5a]').click();
        }
    });
});