// ==UserScript==
// @name         Wallstreet poop
// @namespace    https://greasyfork.org/en/users/13769
// @version      1.1
// @description  uh
// @author       saqfish
// @include      https://s3.amazonaws.com/mturk_bulk/hits/*
// @include      https://www.mturkcontent.com/dynamic/hit?*
// @grant        GM_log
// @require     http://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/24284/Wallstreet%20poop.user.js
// @updateURL https://update.greasyfork.org/scripts/24284/Wallstreet%20poop.meta.js
// ==/UserScript==

(function() {
  
var docs = [];
var count = 0;
$('fieldset').each(function(f){
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
       docs[count].children().eq(2).children().eq(0).click();
        count++;
       docs[count].focus();
    }
    if ((e.keyCode === 13)) {
        $('#SubmitButton').click();
    }

};
})();