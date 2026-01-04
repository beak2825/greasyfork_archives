// ==UserScript==
// @name         Alicia Weinscript
// @namespace    https://greasyfork.org/users/144229
// @version      1.1
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/39600/Alicia%20Weinscript.user.js
// @updateURL https://update.greasyfork.org/scripts/39600/Alicia%20Weinscript.meta.js
// ==/UserScript==

$(document).ready(function() {
    if(!$('b:contains(Website Address:)').eq(0).text().length) return;
    setTimeout(function(){ spam(); },randNum(12*1000,16*1000));//disable this line to stop spam
    var url = $('label').eq(0).text().trim();
    console.log();
    $('label').eq(0).after(`<a style="float:right;" href=http://www.${url} target="_blank">${url}</a>`);
    $('label').eq(0).after(`<p id=time>0</a>`);
    setTimeout(function(){updateTime(0);},1000);
    $('input').eq(2).click();
    noRules();
    $(document).keyup(function(event){
        if(event.which == 49){
            $('input').eq(4).click();
            $('input').eq(8).click();
            $('input').eq(10).click();
            $('input').eq(13).click();
            $('#submitButton').click();
        }else if(event.which == 51){
            $('input').eq(3).click();
            $('#submitButton').click();
        }else if(event.which == 16){
            $('input').eq(1).click();
            $('#submitButton').click();
        }
    });
    hotKey('#submitButton',2);

});

function updateTime(x){
    x++;
    $('#time').text(x);
    setTimeout(function(){updateTime(x);},1000);
}
function spam(){
    $('input').eq(4).click();
            $('input').eq(8).click();
            $('input').eq(10).click();
            $('input').eq(13).click();
            $('#submitButton').click();
}