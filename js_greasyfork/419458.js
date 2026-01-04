// ==UserScript==
// @name         Toggle Dislike Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  To toggle the dislike button on Torn forum pages
// @author       Natty_Boh[1651049]
// @match        https://www.torn.com/*
// @require  https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require  https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @downloadURL https://update.greasyfork.org/scripts/419458/Toggle%20Dislike%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/419458/Toggle%20Dislike%20Button.meta.js
// ==/UserScript==

/*globals $ waitForKeyElements*/

(function() {
    'use strict';
    waitForKeyElements(".dislike.forum-button", removeDislikeFirstTime);

    function removeDislikeFirstTime(elem) {
        elem.addClass("disabled")
        elem.parent().prepend(html)
    }

 $(document).on('change','#checkBox1',function(){
        if(this.checked) {
        $('.dislike.forum-button').addClass("disabled")
        }
     else{
         $('.dislike.forum-button').removeClass("disabled")
     }
    });

})();


var html = '<li><input type="checkbox" id="checkBox1" checked></li>'