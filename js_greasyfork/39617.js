// ==UserScript==
// @name         Jin script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/39617/Jin%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39617/Jin%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    if ($('h2').eq(0).text() != "This is the instruction Page.") return;
    $('button#start-btn').click();
    $(document).keyup(function(event){
        if(event.which == 53){
            event.preventDefault();
            $('button#next-btn').click();
        }else if (event.which == 49){ //1
            $('div#target1-image-container').click();
            $('button#next-btn').click();
        }else if (event.which == 50){ //2
            $('div#target2-image-container').click();
            $('button#next-btn').click();
        }else if (event.which == 51){ //3
            $('div#target3-image-container').click();
            $('button#next-btn').click();
        }else if (event.which == 52){ //4
            $('div#target4-image-container').click();
            $('button#next-btn').click();
        }else if (event.which == 192){ //press 5 for start
            $('button#prev-btn').click();
        }
    });

});