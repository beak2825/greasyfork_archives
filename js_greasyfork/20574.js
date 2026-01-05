// ==UserScript==
// @name         Meetup AutoJoin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.meetup.com/*/events/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20574/Meetup%20AutoJoin.user.js
// @updateURL https://update.greasyfork.org/scripts/20574/Meetup%20AutoJoin.meta.js
// ==/UserScript==

var meetups = [
229970135
];

(function() {
    'use strict';
    
    for (var i = 0; i < meetups.length; i++) {
        
        if (window.location.href.indexOf(meetups[i]) === -1) { //valid meetup
            
            return;
        }
        
    }
        
        var btn = $("#event-join");
    
            if (btn.length === 0) {
                realoadPage(10000);
            } else 
            {
                btn[0].click();
            }
        
    
})();


/***********************************************************
 *  Utility Functions
 **********************************************************/

function realoadPage(miliseconds) {
    setInterval(function(){
        window.location.reload();
    }, miliseconds);
}