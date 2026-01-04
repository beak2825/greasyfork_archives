// ==UserScript==
// @name         Twitch farm goodies
// @namespace    Northy
// @version      1.0.1
// @description  Goodies for twitch farming
// @match        https://www.twitch.tv/*
// @match        https://player.twitch.tv/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/403764/Twitch%20farm%20goodies.user.js
// @updateURL https://update.greasyfork.org/scripts/403764/Twitch%20farm%20goodies.meta.js
// ==/UserScript==
"use strict";

//hide tab-aways
Object.defineProperty(document, 'hidden', {value: false, writable: false});
Object.defineProperty(document, 'visibilityState', {value: 'visible', writable: false});
Object.defineProperty(document, 'webkitVisibilityState', {value: 'visible', writable: false});
document.dispatchEvent(new Event('visibilitychange'));
document.hasFocus = function () { return true; };

//visibilitychange events are stopped
document.addEventListener('visibilitychange', function(e) {
	e.stopImmediatePropagation();
}, true, true);

let pauseStream = function() {
	try {
    $(".player-controls__left-control-group > div:nth-child(1) > button:nth-child(1)").click();
  }
  catch {}
}

//reload the page if network error
let checkerror = function() {
  setTimeout(function(){
     console.log("checking for errors...");
     if (document.getElementById('root').innerHTML.indexOf("Error #")!=-1) window.location.reload(1);
     else {
       pauseStream();
       setTimeout(pauseStream,1000);
       checkerror();
     }
  }, 300000);
}
checkerror();

//check if stream loaded successfully
setTimeout(function() {
  console.log("Checking if stream loaded...");
  if (document.getElementsByClassName("tw-loading-spinner").length>0) window.location.reload(1);
}, 15000);

//auto claim points
let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
let claiming = false;
let observer = new MutationObserver(e => {
    let bonus = document.querySelector('.claimable-bonus__icon');
    if (bonus && !claiming) {
        bonus.click();
        let date = new Date();
        claiming = true;
        setTimeout(() => {
            console.log('Claimed at '+date);
            claiming = false;
        }, Math.random() * 1000 + 2000);
    }
});
observer.observe(document.body, {childList: true, subtree: true});

console.log("Twitch goodies running successfully.")