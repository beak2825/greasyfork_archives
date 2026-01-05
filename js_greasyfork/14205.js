// ==UserScript==
// @name         ProductRnR 1
// @namespace    https://greasyfork.org/en/users/13769
// @version      1.0
// @description  ProductRnR - If you looked at and liked the image above, which of the images below would you be more interested to see?
// @author       saqfish
// @include      https://www.mturkcontent.com/dynamic/hit?*
// @grant        GM_log
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/14205/ProductRnR%201.user.js
// @updateURL https://update.greasyfork.org/scripts/14205/ProductRnR%201.meta.js
// ==/UserScript==

var docs = [];
var count = 0;
$('div.documentbox').each(function(f){
    docs.push($(this));
});


window.onkeydown = function(e) {

    if ((e.keyCode === 49) || (e.keyCode === 97)) {
        docs[count].css('background-color',"green");
        docs[count].children().eq(1).children().eq(0).click();
        count++;
        docs[count].focus();
        
    }

    if ((e.keyCode === 50) || (e.keyCode === 98)) {
       docs[count].css('background-color',"green");
       docs[count].children().eq(1).children().eq(1).click();
        count++;
       docs[count].focus();
    }
    if ((e.keyCode === 13)) {
        $('#SubmitButton').click();
    }

}
