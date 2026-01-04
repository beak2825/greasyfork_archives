// ==UserScript==
// @name         CollectSkins
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  collectskins.com giveaway script
// @author       Nydiks
// @match        https://collectskins.com/giveaway
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32420/CollectSkins.user.js
// @updateURL https://update.greasyfork.org/scripts/32420/CollectSkins.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var check=function(){
       if(!$(".ticket-game-join-btn #ticketButton").prop('disabled')) {$(".ticket-game-join-btn #ticketButton").click();}
       if($(".ticket-game-cd-content #ticket-game-cd-timer").text() === "0min 0sec") window.location.reload(true);
       $(".adsbygoogle").css("display","none");
    };
    $(document).ready(function(){
        setInterval(check, 2500);
        $("h1").text("Nydiks - It works.");
    });
})();