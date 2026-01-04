// ==UserScript==
// @name         Twitch Chat Deretardifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  removes idiocy
// @author       hello_frenz
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40811/Twitch%20Chat%20Deretardifier.user.js
// @updateURL https://update.greasyfork.org/scripts/40811/Twitch%20Chat%20Deretardifier.meta.js
// ==/UserScript==

var censorCount = 0;
var debugMode = false;
var logMessages = false;

(function() {
    'use strict';

    var log;
    var interval = setInterval(function(){
        log = document.querySelectorAll('[role="log"]');
        if (log.length > 0){
            addListener(log[0]);
            clearInterval(interval);
        }
    }, 100);

    function addListener(log){
        var observer = new MutationObserver(checkMessage);
        observer.observe(log, {childList: true});
    }

    function checkMessage(mutation){
        for (var i = 0; i < mutation.length; i++){
            var newMessage = mutation[i].addedNodes[0];
            if (newMessage){
                if (containsSpam(newMessage.innerText.split(':')[1])){
                    censorCount++;
                    if (debugMode){
                        newMessage.style.border = "1px solid red";
                    }
                    else{
                        newMessage.style.display = "none";
                    }

                    if (logMessages){
                        console.log("message removed = " + newMessage.innerHTML);
                    }
                    console.log(censorCount + " messages removed");
                }
            }
        }
    }

    function containsSpam(text){
        var spamFound = false;
        if (text){
            spamFound = checkAllCaps(text);
        }
        return spamFound;
    }

    function checkAllCaps(text){
        var textLength = text.length;
        var amountUpperCaseInt = 0;
        for (var i = 0, len = textLength; i < len; i++) {
            var char = text[i];
            if(char === char.toUpperCase()){
                amountUpperCaseInt++;
            }
        }
        var percentageUpperCase = 100 - (textLength - amountUpperCaseInt) / textLength * 100;
        return percentageUpperCase >= 80;
    }
})();