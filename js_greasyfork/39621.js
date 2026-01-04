// ==UserScript==
// @name         merler
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *amazonaws*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/39621/merler.user.js
// @updateURL https://update.greasyfork.org/scripts/39621/merler.meta.js
// ==/UserScript==

$(document).ready(function(){
    $('input').removeAttr('onclick');
    $("input[value=VALID]").click();
    $(document).on('click', 'radio[name=radio8]', function(){
        console.log("yes");
        if($(this).attr('value') == "BABY"){
            $('#age1').val(1);
        }
    });
    nose();
    nose2();
});


function nose(){
    $('input[name=radio15]').eq(randNum(0,2)).click();
}

function nose2(){
    $('input[name=radio2im15]').eq(randNum(0,2)).click();
}