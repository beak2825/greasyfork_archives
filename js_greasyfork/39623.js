// ==UserScript==
// @name         miyazaki image script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/39623/miyazaki%20image%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39623/miyazaki%20image%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
$('input#option1').click();
    $(document).keyup(function(event){
        if (event.which == 49){
            $('input#option3').click();
            document.querySelector(`[type="submit"]`).click();
        } else if(event.which == 50){
            $('input#option4').click();
            document.querySelector(`[type="submit"]`).click();
        }else if(event.which == 51){
            $('input#option5').click();
            document.querySelector(`[type="submit"]`).click();
        }else if(event.which == 52){
            $('input#option6').click();
            document.querySelector(`[type="submit"]`).click();
        }else if(event.which == 53){
            $('input#option7').click();
            $('input#option2').click();
            document.querySelector(`[type="submit"]`).click();
        }
    });
});