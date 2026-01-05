// ==UserScript==
// @name         FusionFall Legacy Forum Post Text Replacer
// @namespace    http://your.homepage
// @version      0.1
// @description  lol
// @author       SFOH
// @match        http://interact.modulatornetwork.com/FFL/index.php?action=post*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10355/FusionFall%20Legacy%20Forum%20Post%20Text%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/10355/FusionFall%20Legacy%20Forum%20Post%20Text%20Replacer.meta.js
// ==/UserScript==

var original = ["<lennyface>","<shrug>"]
var toreplacewith = ["( ͡° ͜ʖ ͡°)","¯\\_(ツ)_/¯"]

// just add original text stuff to the original array and the text to replace it with in the toreplacewith array

function waitForPostButton(){
    if(document.getElementsByName("message").length=0){
        console.log("nope");
        setTimeout(waitForPostButton,100);
    }else{
        console.log("attempting");
        replaceButtonFunction();
    }
}

function updateText(textFrame){
    for (var i=0;i<original.length; i++) {
        textFrame.value = textFrame.value.replace(original[i],toreplacewith[i]);
    }
}

function replaceButtonFunction(){
    var textFrame = document.getElementsByName("message")[0];
    setInterval(function(){updateText(textFrame);},300);
}

waitForPostButton();
