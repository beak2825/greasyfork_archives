// ==UserScript==
// @name         Bannedikt script
// @namespace    https://greasyfork.org/users/144229
// @version      1.1.1
// @description  Makes money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @include      *amazonaws*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/39596/Bannedikt%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39596/Bannedikt%20script.meta.js
// ==/UserScript==

var wait = randNum(20000,35000);
var chance = randNum(0,9);

setTimeout(function(){spam();}, wait);

function spam(){
    if(chance){
        $('label.btn').eq(1).click();
        $('input#submitButton').click();
    }else{
        $('label.btn').eq(0).click();
        $('input#submitButton').click();
    }
}