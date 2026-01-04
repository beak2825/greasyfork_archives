// ==UserScript==
// @name         Homestuck Fix Chatlogs
// @namespace    kmcgurty.com
// @version      1.4.1
// @description  replaces leet speak with letters
// @author       Kmcgurty
// @match        https://www.homestuck.com/story/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/379837/Homestuck%20Fix%20Chatlogs.user.js
// @updateURL https://update.greasyfork.org/scripts/379837/Homestuck%20Fix%20Chatlogs.meta.js
// ==/UserScript==

var equivalent = ["", "I", "s", "E", "A"];

function fix(){
    var messages = document.querySelectorAll(".o_chat-log span");

    messages.forEach(function(span){
        var split = span.innerText.split("");

        for(var i = 0; i < split.length; i++){
            var currentValue = parseInt(split[i]);
            if(!isNaN(currentValue) && currentValue < equivalent.length){
                split[i] = equivalent[currentValue];
            }
        }

        // if gallowsCalibrator speaking
        if(speaking(span.innerText) == "GC"){
            span.innerText = split.join("");
        }

        //if twinArmageddons speaking
        if(speaking(span.innerText) == "TA"){
            span.innerText = split.join("");
            span.innerText = span.innerText.replace(/ii/g, "i");
        }

        //if adiosToreador speaking
        if(speaking(span.innerText) == "AT"){
            span.innerText = span.innerText.toUpperCase();
        }

        //if terminallyCapricious speaking
        if(speaking(span.innerText) == "TC"){
            span.innerText = span.innerText.toLowerCase();
            span.innerText = span.innerText.replace(/tc/, "TC");
        }

        //if cuttlefishCuller speaking
        if(speaking(span.innerText) == "CC"){
            span.innerText = span.innerText.replace(/: \)\(/, ": H");
            span.innerText = span.innerText.replace(/((?<!: )\)\()/g, "h");
        }
    });
}

//return who is speaking
function speaking(text){
    return text.substring(0, 2);
}

var showLogButton = document.querySelector(".o_chat-log-btn");
var fixButton = document.createElement("button");
fixButton.innerText = "Fix Log";
fixButton.onclick = fix;
fixButton.className = "fix_chatlogs";
document.querySelector(".o_chat-container").insertBefore(fixButton, showLogButton);

GM_addStyle(`
.fix_chatlogs{
    right: 180px;
   position: absolute;
}
`)