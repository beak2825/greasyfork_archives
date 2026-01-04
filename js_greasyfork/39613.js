// ==UserScript==
// @name         Greg banner
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *amazonaws*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/39613/Greg%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/39613/Greg%20banner.meta.js
// ==/UserScript==

$(document).ready(function() {
    spam();
    setTimeout(function(){$('input#submit-btn').click();},20000);
});

function spam(){
    var num = randNum(0,1);
    if(num){
        $('img').eq(0).click();
    }else{
        $('img').eq(1).click();
    }
    $('button#next-btn').click();
    setTimeout(function(){spam();},1000);
}