// ==UserScript==
// @name         Takashi Miyazaki script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @include       *worker.mturk*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/39638/Takashi%20Miyazaki%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39638/Takashi%20Miyazaki%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    console.log($('p').eq(2).text().trim());
    sanity = "There is a person marked by the red dot in the image.";
    if ($('p').eq(2).text().trim().indexOf(sanity) >= 0){ //Sanity check provided by ChrisTurk
        $('div').eq(1).toggle();
        var pic = $('a').attr('href');
        $('fieldset').eq(0).prepend($('<img>',{id:'theImg',src:pic}));
        $('input[value=photographer]').before("(1) ");
        $('input[value=people]').before("(2) ");
        $('input[value=others]').before("(3) ");
        $('input[value=monologue]').before("(4) ");
        $('input[value=not_applicable]').before("(5) ");
        $('input[name=Q2FreeTextInput]').before("(6) ");
        $(document).keyup(function(event){
            if (event.which == 49){
                $('input[value=photographer]').click(); //1-5 for 'Whom the person is talking
                $('input[name=Q2FreeTextInput]').select();
            } else if (event.which == 50){
                $('input[value=people]').click();
                $('input[name=Q2FreeTextInput]').select();
            } else if (event.which == 51){
                $('input[value=others]').click();
                $('input[name=Q2FreeTextInput]').select();
            } else if (event.which == 52){
                $('input[value=monologue]').click();
                $('input[name=Q2FreeTextInput]').select();
            } else if (event.which == 53){
                $('input[value=not_applicable]').click();
                $('input[name=Q2FreeTextInput]').select();
            } else if (event.which == 54){
                $('input[name=Q2FreeTextInput]').select(); //Press 6 to select the text box
            }
        });
    }
});