// ==UserScript==
// @name         Alicia Weinscript Banner
// @namespace    https://greasyfork.org/users/144229
// @version      1.2
// @description  Makes Money
// @author       MasterNyborg + Eisenpower
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/373022/Alicia%20Weinscript%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/373022/Alicia%20Weinscript%20Banner.meta.js
// ==/UserScript==

$(document).ready(function() {
    if(!$('b:contains(Website Address:)').eq(0).text().length) return;
    setTimeout(function(){ spam(); },randNum(15*1000,40*1000));//disable this line to stop spam
    var url = $('label').eq(0).text().trim();
    //console.log();
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

    $(`[name="Website broken (if yes don't answer the rest of the questions)"][value="No"]`).click();
    logo();
    discover();
    $('[name="Visa"][value="Yes"]').click();
    $('[name="Paypal"][value="No"]').click();
    $('#submitButton').click();
}

function logo () {
    var random = randNum(1,3);
    console.log(random);
    document.querySelectorAll('[name="Could you find Payment Options Info"]')[random].click();
}

function discover () {
    var random = randNum(0,1);
    document.querySelectorAll('[name="Discover"]')[random].click();
}