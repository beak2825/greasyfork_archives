// ==UserScript==
// @name         Z script
// @namespace    https://greasyfork.org/users/144229
// @version      1.1
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *google.com/evaluation*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/39574/Z%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39574/Z%20script.meta.js
// ==/UserScript==
banner = true;
if(banner){
    $(document).ready(function(){
        setTimeout(function(){$('#intro_check').click();}, 200);
        setTimeout(function(){$('#intro_proceed').click();}, 200);
        setTimeout(function(){ban();}, 5000);
    });
}

$(document).keyup(function(event){//16 + 18
    if(event.which == 49){
        $('button').eq(15).click();
    }else if(event.which == 50){
        $('button').eq(17).click();
        setTimeout(function(){$('button.button-success.pure-button.button-dur').click();}, 100);
    }else if(event.which == 51){
        $('button').eq(14).click();
    }
});

function ban(){
    var guess = randNum(0,1);
    if($('#intro_check').length){
        $('#intro_check').click();
    }
    if($('#intro_proceed').length){
        $('#intro_proceed').click();
    }
    if(guess){
        $('button').eq(15).click();
    }else{
        $('button').eq(17).click();
        setTimeout(function(){$('button.button-success.pure-button.button-dur').click();}, 100);
    }
    if($('input[type=submit]').length){
        $('input[type=submit]').click();
    }
    setTimeout(function(){ban();}, 5000);
}