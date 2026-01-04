// ==UserScript==
// @name         Noblis script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *amazonaws*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/32766/Noblis%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/32766/Noblis%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    if (!$('p:contains(For this task, click once to start drawing a bounding box around each head for which you can see part of the face.)').eq(0)) return;
    $('#instructions_subject_review_noname').toggle();
    $(document).keyup(function(event){
        if (event.which == 49){
            $("button[id='nomistakesbutton']:first").click();
        }else if (event.which == 50){
            $("button[id='babybutton']:first").click();
        }else if (event.which == 51){
            $("button[id='junkbutton']:first").click();
        }else if (event.which == 52){
            $("button[id='nextbutton']:first").click();
        }
    });
});