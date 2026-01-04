// ==UserScript==
// @name         Dustin Script
// @version      1.2
// @description  Raining Pennies
// @author       ZileWrath
// @icon         https://i.imgur.com/C72wVr7.jpg
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @namespace https://greasyfork.org/users/175033
// @downloadURL https://update.greasyfork.org/scripts/39607/Dustin%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/39607/Dustin%20Script.meta.js
// ==/UserScript==

//clicks on the textbox area

//$(document).ready(function() {
    var sanity = "Describe what is happening in the video";
    if($('htitle').text() !== sanity) return;
    $("#actions").select();
    //Focus the text area
    $('#examples').toggle();
    $('.button').toggle();
    $('header').toggle();
    $('#rules').toggle();
    //Hides a lot of the unnecesary stuff

    $(document).keyup(function(event){
        if(event.which == 13){
            $('#submit-btn').click();
        //Press Enter to submit
        }else if(event.which == 73){
            $('#rules').toggle();
            //Press i to show instructions
        }
    });
//});
