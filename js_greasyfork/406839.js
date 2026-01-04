// ==UserScript==
// @name        Krunker Helper
// @namespace   bobthezealot
// @version     1.0
// @description Make Krunker great again
// @author      bobthezealot
// @match       https://krunker.io/
// @match       https://krunker.io/?game=*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/406839/Krunker%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/406839/Krunker%20Helper.meta.js
// ==/UserScript==

$(document).ready(function(){
    $("#aContainer").children().remove();
    setInterval(function(){
        if($("#instructions").length > 0 && $("#instructions").text().includes("Kicked")){
            window.location.reload();
        }
    }, 5000);
});