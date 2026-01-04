// ==UserScript==
// @name         FudgeClickbait
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Click on the first timestamp available on youtube
// @author       You
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406836/FudgeClickbait.user.js
// @updateURL https://update.greasyfork.org/scripts/406836/FudgeClickbait.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // on document ready XD
    setTimeout(() => {

        window.scrollBy(0, window.innerHeight);

        setTimeout(() => { window.scrollTo(0, 0) }, 500);

        document.addEventListener('keydown', function(event) {
            if (event.ctrlKey && event.key === 'ç') {
                click();
            }
        })

     }, 1000);

    let nodes;
    let currentIndex = 0;

     setTimeout(() => {
         nodes = document.querySelectorAll("#content-text > a");
     }, 2000);

    function click() {

        try {
            let currentNode = nodes[currentIndex];
            currentNode.click();
            currentIndex++;

            document.querySelector("#container > h1 > yt-formatted-string").innerText = currentNode.parentElement.children[1].textContent;
        } catch (e) {
            // :)
        }

    }

    //TODO listen to actual events - document load / ready
    //TODO hotkeys to go to next link
    //TODO hotkeys to activate functionality

    //TODO show arrows to navigate to next / previous clip

    //TODO show comment - partially implemented

    //SPIKE programmatically load comments?


})();