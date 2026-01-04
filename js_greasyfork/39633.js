// ==UserScript==
// @name         zoltar script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *google*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/39633/zoltar%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39633/zoltar%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    if (!$('h3:contains(website is NOT available)')) return;
    var url = $('a.ng-binding').eq(0).attr('ng-href');
    var link = `<a href=`+url+` target= “ _blank”>`+url+`</a>`;
    $('div.question-container.md-whiteframe-1dp.flex').after(link);
    $('div.question-container.md-whiteframe-1dp.flex').eq(0).toggle();
    $('ul').eq(1).toggle();
    $(document).keyup(function(event){
        if(event.which == 49){
            $('div.md-off').eq(0).click();
            $('div.md-off').eq(3).click();
            $('div.md-off').eq(11).click();
            $('div.md-icon').eq(2).click();
            $('div.md-icon').eq(3).click();
            $('div.md-off').eq(14).click();
        }else if(event.which == 50){
            $('div.md-off').eq(1).click();
            $('div.md-off').eq(3).click();
            $('div.md-off').eq(11).click();
            $('div.md-icon').eq(2).click();
            $('div.md-icon').eq(3).click();
            $('div.md-off').eq(14).click();
        }else if(event.which == 51){
            $('div.md-off').eq(2).click();
            $('div.md-off').eq(3).click();
            $('div.md-off').eq(11).click();
            $('div.md-icon').eq(2).click();
            $('div.md-icon').eq(3).click();
            $('div.md-off').eq(14).click();
        }
    });

});