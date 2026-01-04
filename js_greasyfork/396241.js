// ==UserScript==
// @name         Fiction.Live Live Countdown Fix
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Puts the live timer back in the nav bar. Its crappy but it works. Doesnt look the same though.
// @author       You
// @match        https://fiction.live/stories/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/396241/FictionLive%20Live%20Countdown%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/396241/FictionLive%20Live%20Countdown%20Fix.meta.js
// ==/UserScript==

function myCode(){
    function removeElement(elementId) {
        // Removes an element from the document
        var element = document.getElementById(elementId);
        element.parentNode.removeChild(element);
    }
    var html = document.querySelector("html")
    //Blacklisted alert list
    var navBar = document.querySelectorAll('[id="mainMenuReplacement"]');
    var liveTimer = document.querySelectorAll('[class="next-live ng-scope"]');


    var myLive = document.createElement('div');
    myLive.setAttribute('id','liveBox');
    myLive.style.display = 'block';
    myLive.style.height = '100%';
    myLive.style.width = 'auto';
    myLive.style.float = 'left';
    myLive.style.paddingLeft = '3px';
    myLive.style.paddingRight = '3px';
    myLive.style.border = 'thin solid';
    myLive.style.borderColor = 'red';
    //myLive.style.background = 'red';
    myLive.style.boxSizing = 'border-box';
    myLive.style.color = 'white';
    myLive.style.textShadow = '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
    myLive.style.fontWeight = 'bold';


    //navBar[1].style.background = 'red';
    while (liveTimer[0].childNodes.length > 0) {
    myLive.appendChild(liveTimer[0].childNodes[0]);
    }
    navBar[1].appendChild(myLive);
    liveTimer[0].style.display = 'none';

    console.log(navBar);
    console.log(liveTimer);
};
var loadDelay = 2000; //5 seconds
setTimeout(myCode, loadDelay);
//fucking things slow, or thats just me, either way you fuckers wait