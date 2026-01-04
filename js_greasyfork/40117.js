// ==UserScript==
// @name         4chan webm extension
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Adds ability to pause, fullscreen, and close a webm by clicking on it
// @author       lolmao
// @match        https://boards.4chan.org/*/thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40117/4chan%20webm%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/40117/4chan%20webm%20extension.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var observer = new MutationObserver(function (mutations, me) {
        for (var i = 0; i < mutations.length; i++) {
            for (var j = 0; j < mutations[i].addedNodes.length; j++) {
                var curr = mutations[i].addedNodes[j];
                if (curr.tagName === "VIDEO") {
                    addListeners(curr);
                }
            }
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();


function addListeners(videoObj){
    videoObj.addEventListener('click', function(ev) {
        //ev.preventDefault();
        if (videoObj.paused) {
            videoObj.play();
        } else {
            videoObj.pause();
        }
        return true;
    }, false);

    videoObj.addEventListener('dblclick', function(){
        if (!videoObj.webkitDisplayingFullscreen){
            videoObj.webkitRequestFullscreen();
        } else {
            videoObj.webkitExitFullscreen();
        }
    }, false);

    videoObj.addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
        videoObj.parentElement.firstElementChild.children[1].firstElementChild.click();
    });
    return true;
}