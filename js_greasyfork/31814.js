// ==UserScript==
// @name         SONIC Lab script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/31814/SONIC%20Lab%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/31814/SONIC%20Lab%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
//Sanity Check
    var sanity = "In  this task you will be classifying t-shirt graphic designs.";
    if($("p").eq(0).text() === sanity){
        console.log("Running");
//Incstuction hide/Button Toggle
        $("#collapseTrigger").toggle();
        var myButton = '<button type="button" id="myButton">Instructions</button>';
        $("#collapseTrigger").before(myButton);
        $("#myButton").click(function(){
            $("#instructionBody").toggle();
        });
//Select all No's (set id=option1 for yes)
        $("input[id=option2]").click();
        $( "#form-group" ).click(function() {
            alert( "Handler for .click() called." );
        });
//Submit on enter (does this anyway I believe)
        $(document).keyup(function(event){
            //console.log(event); - from tutorial. Help figure out event.which codes
            if(event.which == 13){
                event.preventDefault();
                $("#submitButton").click();
            }
        });
    }
});