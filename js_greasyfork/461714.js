// ==UserScript==
// @name         Google image searchpage shortcut
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A/D switch next/previous image
// @author       开花了啦
// @include      /^https?:\/\/(www\.)*google\.[a-z\.]{2,5}\/search.*tbm=isch.*/
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @run-at       document-start
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/461714/Google%20image%20searchpage%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/461714/Google%20image%20searchpage%20shortcut.meta.js
// ==/UserScript==

let activeElement = null;
let activeElement2 = null;

window.addEventListener('keydown', function(e) {
    if (activeElement==null){
        activeElement = document.activeElement.parentNode;
    }

    if(e.keyCode == 65 && (!(e.target instanceof HTMLInputElement))){
            e.preventDefault();
            document.querySelector("div.eEqsjc > a:nth-child(1)").click();
            activeElement = activeElement.previousElementSibling;
            setTimeout(function() {
                activeElement.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
            }, 0);
    }
    else if(e.keyCode == 68 && (!(e.target instanceof HTMLInputElement))){
            e.preventDefault();
            document.querySelector("div.eEqsjc > a:nth-child(2)").click();
            activeElement = activeElement.nextElementSibling;
            setTimeout(function() {
                activeElement.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
            }, 0);
    }
});
