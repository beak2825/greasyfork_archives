// ==UserScript==
// @name         ProductRnR 2
// @namespace    https://greasyfork.org/en/users/13769
// @version      1.2
// @description  ProductRnR - Label images based on their relevance for the query.
// @author       saqfish
// @include      https://www.mturkcontent.com/dynamic/hit?*
// @grant        GM_log
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/14206/ProductRnR%202.user.js
// @updateURL https://update.greasyfork.org/scripts/14206/ProductRnR%202.meta.js
// ==/UserScript==

var docs = [];
var count = 0;
$('div.documentbox').each(function(f){
    docs.push($(this));
});

function focuss(ting){
$('html, body').animate({ scrollTop: ting.offset().top }, 'fast');
}
document.onkeydown = function(e) {

    if ((e.keyCode === 49) || (e.keyCode === 97)) {
        docs[count].css('background-color',"green");
        docs[count].children().eq(1).children().eq(0).click();
        count++;
        focuss(docs[count]);
    }

    if ((e.keyCode === 50) || (e.keyCode === 98)) {
        docs[count].css('background-color',"green");
        docs[count].children().eq(1).children().eq(4).click();
        count++;
        focuss(docs[count]);
    }
    if ((e.keyCode === 51) || (e.keyCode === 99)) {
        docs[count].css('background-color',"green");
        docs[count].children().eq(1).children().eq(7).click();
        count++;
        focuss(docs[count]);

    }
     if ((e.keyCode === 13)) {
        $('#SubmitButton').click();
    }


}
