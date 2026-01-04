// ==UserScript==
// @name         disconnect agent leg
// @description  disconnect agent leg in nice
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       You
// @match        https://max.niceincontact.com/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460927/disconnect%20agent%20leg.user.js
// @updateURL https://update.greasyfork.org/scripts/460927/disconnect%20agent%20leg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Notification.requestPermission();
    setInterval( function() { checkLeg(); }, 7000);

    function checkLeg(){
        if(document.getElementsByClassName("current-state")[0].innerHTML=="Unavailable") {
            var ellipsis = document.getElementsByClassName("status-text ellipsis");
            console.log("checking status");
            if(ellipsis[0].innerHTML!="Agent Leg - Inactive") {
                document.getElementsByClassName("toggle-leg-button")[1].click();
                console.log("disconnecting");
                setTimeout(function(){
                    if(ellipsis[0].innerHTML!="Agent Leg - Inactive") {
                        console.log("Agent leg still inactive, reload with F5");
                        /*var notification = new Notification('refreshing', {
                            body: "Refreshing page!",
                        });*/
                        window.onbeforeunload = null;
                        window.location.reload();
                    }
                }, 9000); //end set timeout
            //if(ellipsis[0].innerHTML!="Agent Leg - Inactive") {
                //location.reload();
            //}
        }
    }
    }
})();