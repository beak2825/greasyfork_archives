// ==UserScript==
// @name         Ellie script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/39608/Ellie%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39608/Ellie%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
$(document).keyup(function(event){
    if (event.which == 49){
        $('input[value=not]').click();
        document.querySelector(`[type="submit"]`).click();
    }else if(event.which == 50){
        $('input[value=somewhat]').click();
        document.querySelector(`[type="submit"]`).click();
    }else if(event.which == 51){
        $('input[value=mildly]').click();
        document.querySelector(`[type="submit"]`).click();
    }else if(event.which == 52){
        $('input[value=very]').click();
        document.querySelector(`[type="submit"]`).click();
    }else if(event.which == 53){
        $('input[value=extremely]').click();
        document.querySelector(`[type="submit"]`).click();
    }
});
});