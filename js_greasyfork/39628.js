// ==UserScript==
// @name         Noblis script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *amazonaws*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/39628/Noblis%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39628/Noblis%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    if (!$('p:contains(For this task, click once to start drawing a bounding box around each head for which you can see part of the face.)').eq(0)) return;
    //$('#instructions_subject_review_noname').toggle();
    $('#instructions_duplicate_review').toggle();
    $('button#submitbutton').css('height','200px');
    $('button#submitbutton').css('background','orange');

    $(document).keyup(function(event){
        if (event.which == 49){
            $("button[id='nomatchbutton']:first").click();
        }else if (event.which == 50){
            $("button[id='nextbutton']:first").click();
        }else if (event.which == 51){
            $("input[id='multiplecheckbox']:first").click();
       // }else if (event.which == 52){
       //     $("button[id='nextbutton']:first").click();
        }
    });
});