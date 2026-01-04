// ==UserScript==
// @name         Nitrobot
// @namespace    http://ateesdalejr.tk
// @version      1.0
// @description  Try to take over nitrotype!
// @author       Andrew T.
// @match        https://www.nitrotype.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426369/Nitrobot.user.js
// @updateURL https://update.greasyfork.org/scripts/426369/Nitrobot.meta.js
// ==/UserScript==

/*
This is a userscript meant for use with tampermonkey. Please don't get yourself banned with this. :) It's very easy to do so.
I made this mainly as a learning RE project. You use this at your own risk, I am not responsible for any accounts that are
banned or penalties incurred.
*/


(function() {
    'use strict';

    window.textBuffer={};
    var oldFillText = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText=function() {
        var args = Array.prototype.slice.call(arguments);
        var [text,x,y]=args.slice(0,3);
        if (text.length == 1) {
            if (!(y in textBuffer)) {
                textBuffer[y]="";
            }
            textBuffer[y]+=text;
        }
        return oldFillText.apply(this,arguments);
    };
    var INTRO_LEN=62; // Length of the junk text at the beginning.
    var WAIT_SECONDS=2; // Time to wait until the game has started.
    var CANVAS_ID="race-track";
    var TOTAL_SECONDS = 35.50 - Math.random()*2;
    var KEY_DELAY=0.18; //Delay between keypress in seconds. Top speed is about 1077 WPM.
    var ACCURACY=95; //Percentage of accuracy. 95 is pretty good.
    window.startBot=function() {
        var key,shift;
        var i=0;
        setTimeout(function() {
            var typingText=textBuffer[30].slice(INTRO_LEN);
            KEY_DELAY = TOTAL_SECONDS / typingText.length;
            var intervalLoop=setInterval(function() {
                if (i >= typingText.length) {
                    clearInterval(intervalLoop);
                    console.log("Finished typing.");
                } else {
                    key=typingText[i];
                    shift=(key == key.toUpperCase());
                    var e=jQuery.Event("keypress",{which:key.charCodeAt(0),shiftKey:shift});
                    $("#"+CANVAS_ID).trigger(e);
                    if (Math.random() > ACCURACY/100) {
                        key="=";
                        shift=(key == key.toUpperCase());
                        e=jQuery.Event("keypress",{which:key.charCodeAt(0),shiftKey:shift});
                        $("#"+CANVAS_ID).trigger(e);
                    }
                    i++;
                }
            },KEY_DELAY*1000);
        },WAIT_SECONDS*1000);
    };
    $("body").append("<button onclick=\"startBot()\"style=\"position:fixed;top:0px;left:0px;padding:15px;\">Start Bot</button>");
})();