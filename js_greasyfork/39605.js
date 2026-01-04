// ==UserScript==
// @name         DGIBanner
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *tomnod*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/39605/DGIBanner.user.js
// @updateURL https://update.greasyfork.org/scripts/39605/DGIBanner.meta.js
// ==/UserScript==

$(document).ready(function() {
    //setTimeout(function(){location.reload();}, 60000 * 5);
    setTimeout(function(){spam();},2500);
});
function spam(){
    var thisguess = randNum(1,10);
    if(thisguess > 1){
        $('span.validationtools-voteoption-text').eq(1).click();
    }else{
        $('span.validationtools-voteoption-text').eq(0).click();
    }
    if($('button[type=submit]').length){
        $('button[type=submit]').click();
    }
    if($('.js-next-map.button-join.btn-block.text-center').length){
        $('.js-next-map.button-join.btn-block.text-center').click();
    }
    setTimeout(function(){spam();},2500);
}