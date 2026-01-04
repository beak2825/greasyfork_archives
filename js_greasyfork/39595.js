// ==UserScript==
// @name         a9 logo
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *amazonaws*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/39595/a9%20logo.user.js
// @updateURL https://update.greasyfork.org/scripts/39595/a9%20logo.meta.js
// ==/UserScript==

$('img').click(function(){
    $('label#correctLogo[value=NoneAbove]').click();
    $('button#submitButton').click();
});

$(document).keyup(function(event){
    if(event.which == 49 ){
        $('label').eq(0).click();
        $("#submitButton").click();
    }else if(event.which == 50 ){
        $('input#correctLogo[value=NoneAbove]').click();
        $("#submitButton").click();
    }
});