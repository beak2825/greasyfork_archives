// ==UserScript==
// @name         Speakflow Free Mirror Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Unlocks the ability to mirror text without upgrading to a paid plan
// @author       You
// @match        https://www.speakflow.com/account/scripts/*
// @icon         https://www.google.com/s2/favicons?domain=speakflow.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426988/Speakflow%20Free%20Mirror%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/426988/Speakflow%20Free%20Mirror%20Button.meta.js
// ==/UserScript==

var mirrorToggle = false;

(function() {
    'use strict';

    //don't add event listeners if you're not on the right page
    var isReadingView = document.getElementsByClassName("guide-mirror")[0] != undefined;
    if(!isReadingView){return}

    //adds the ability to mirror script text for teleprompter
    recreateNode(document.getElementsByClassName("guide-mirror")[0], true);
    var mirrorButton = document.getElementsByClassName("guide-mirror")[0];
    mirrorButton.addEventListener("click", function(event){
        event.preventDefault();
        MirrorText();
    });

    //add hotkey to restart the script at the beginning
    document.addEventListener("keypress", function onEvent(event) {
        console.log(event.key);
        if (event.key === "q") {
            ClickFirstWord();
        }
        //else if (event.key === "Enter") {
            // Open Menu...
        //}
    });

})();

function MirrorText(){
    mirrorToggle = !mirrorToggle;
    var mirrorTeleprompter = document.getElementsByClassName("teleprompter")[0];
    if(mirrorToggle){
        mirrorTeleprompter.style.transform = "scale(-1, 1)";
    }
    else{
        mirrorTeleprompter.style.transform = "scale(1, 1)";
    }
}

function ClickFirstWord(){
    document.getElementById("script").getElementsByTagName("SPAN")[0].click();
}


//originally written by Donald Duck
//removes any existing event listeners on an element by removing it and re-adding it
//https://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element
function recreateNode(el, withChildren) {
  if (withChildren) {
    el.parentNode.replaceChild(el.cloneNode(true), el);
  }
  else {
    var newEl = el.cloneNode(false);
    while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
    el.parentNode.replaceChild(newEl, el);
  }
}