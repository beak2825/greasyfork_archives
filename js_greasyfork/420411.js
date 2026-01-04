// ==UserScript==
// @name         Twitch Auto Channel Point Claimer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Now auto claim bonus channel points when afk or watching the stream in fullscreen
// @author       Sparkles-SP
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420411/Twitch%20Auto%20Channel%20Point%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/420411/Twitch%20Auto%20Channel%20Point%20Claimer.meta.js
// ==/UserScript==

(function() {


var first = true;
var time = 0;
var hasBeenClaimed = "script started, no claims yet!";
var x = 1
window.setInterval(function(){


    if (document.getElementsByClassName('claimable-bonus__icon tw-flex').length > 0) {
        console.clear();
        eventFire(document.getElementsByClassName('claimable-bonus__icon tw-flex')[0], 'click');
        console.log("You have claimed " + x.toString() + " times this session making a total of " + (50 * x).toString() + " claimed");
        hasBeenClaimed = "last claim, you have claimed " + x.toString() + " times this session making a total of " + (50 * x).toString() + " claimed";
        x += 1;
        time = 0;
    }
    else if (time % 10 == 0.0 && !first){
        console.clear();
        console.log(time.toString() + " seconds have passed since " + hasBeenClaimed)
    }

    time += 2;
    first = false;

    }, 2000);
})();

function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
};

