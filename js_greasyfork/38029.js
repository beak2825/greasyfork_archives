// ==UserScript==
// @name        WaniKani number clobber
// @version     1.4
// @author      Natsuna Fish
// @description Replaces next review numbers by a description on the Dashboard. Based on Niklas Barsk's WaniKani fake numbers
// @include     https://www.wanikani.com/*
// @exclude     https://www.wanikani.com/review/*
// @exclude     https://www.wanikani.com/lesson/*
// @run-at      document-end
// @namespace   https://greasyfork.org/users/168929
// @downloadURL https://update.greasyfork.org/scripts/38029/WaniKani%20number%20clobber.user.js
// @updateURL https://update.greasyfork.org/scripts/38029/WaniKani%20number%20clobber.meta.js
// ==/UserScript==

let clobberall = true;

if (clobberall && window.location.pathname == '/review') {
    var reviewqueue = document.getElementById("review-queue-count");
    replaceIfNeeded(reviewqueue);
} else if (clobberall && window.location.pathname == '/lesson') {
    var lessonqueue = document.getElementById("lesson-queue-count");
    replaceIfNeeded(lessonqueue);
}

if (isDashboard()) {
    var baseElem = document.getElementsByClassName("lessons-and-reviews")[0].children[0];
    var valsondash = jQuery(baseElem).find("span");
    valsondash.each(function(index,elem){replaceIfNeeded(elem);});
    var navElem = document.getElementsByClassName("navigation")[0];
    var valsonnav = jQuery(navElem).find("span");
    valsonnav.each(function(index,elem){replaceIfNeeded(elem);});
}

function replaceIfNeeded(elem) {
    var val = parseInt(elem.innerHTML);
    if(isNaN(val)){ return; }
    if ( val <= 0){
        elem.innerHTML = "none";
    } else if (val < 42) {
        elem.innerHTML = "light";
    } else if (val < 200) {
        elem.innerHTML = "medium";
    } else {
        elem.innerHTML = "heavy";
    }
}


function isDashboard() {
    return (window.location.pathname == '/' || window.location.pathname == '/dashboard');
}
