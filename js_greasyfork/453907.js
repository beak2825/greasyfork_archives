// ==UserScript==
// @name         Remove Offensive Warning on Definitions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the offensive/derogatory warning on google definitions
// @author       AnusPropeller
// @match        https://www.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453907/Remove%20Offensive%20Warning%20on%20Definitions.user.js
// @updateURL https://update.greasyfork.org/scripts/453907/Remove%20Offensive%20Warning%20on%20Definitions.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Code that should work by itself but needs to be called
    // multiple times for some stupid reason
    function removeThis(){
        console.log("Remove Bull Called");
        // Finds the definitions
        var elemnts = document.querySelectorAll(".aztjNb");

        // Now we iterate through each definition
        for (let i=0; i < elemnts.length; i++){

            // Iterate through the definition's tags
            for (let c = 0; c < elemnts[i].children.length; c++){

                // Checks for the warning sign; removes it
                if (elemnts[i].children[c].innerHTML.toString().length > 500){
                    console.log(elemnts[i].children[c].innerHTML.toString().length);
                    elemnts[i].children[c].remove();
                }

                // Checks for various unimportant words
                if (elemnts[i].children[c].textContent == "derogatory"){
                    console.log("derogatory");
                    elemnts[i].children[c].remove();
                }
                if (elemnts[i].children[c].innerHTML =="offensive"){
                    console.log("offensive");
                    elemnts[i].children[c].remove();
                }
                // Removes the element itself if there are no more tags
                // This is to move the definiton up: looks better
                if (elemnts[i].children.length < 1){
                    elemnts[i].remove();
                }
                // Rmoves le bullet point when necessary
                if (elemnts[i].children[c].textContent == "•"){
                    if (elemnts[i].children.length < 3){
                        elemnts[i].children[c].remove();
                    }
                }
            }
        }
    }

    function openThis(){
        var openthese = document.querySelectorAll(".V4cemf");
        for (let p=0; p<openthese.length; ++p){
            // Opens the definition
            openthese[p].click();
            // Deletes the option to close it :sunglasses_face:
            openthese[p].remove();
        }

        // Makes sure the definiton is readable and not
        // Blocked by the dumb and low max height that google
        // gives to the elements
        var heightg = document.querySelectorAll(".xpdxpnd");
        for (let y=0;y<heightg.length;++y){
            heightg[y].style.maxHeight= "1000px";
        }

        // Another checker to see if there are no more tags
        // then deletes the element to give the definiton space
        var elemnts = document.querySelectorAll(".aztjNb");
        for (let i=0;i<elemnts.length;++i){
            if (elemnts[i].children.length < 1){
                elemnts[i].remove();
            }
        }
    }

    // Here lies the final attempt at being a BOSS :sunglasses_face:
    const observerOptions= {
        childList: true,
        attributes: true,
        subtree: true,
    }

    // Select Elements to observe changes
    const targetm = document.querySelector(".c8d6zd.xWMiCc.REww7c");
    const targetn = document.querySelector(".xpdxpnd");
    const buttontarg = document.querySelector(".MXl0lf.tKtwEb.wHYlTd.vk_arc");

    // Create the chad observers, sets what functions they call on mutation
    const observer = new MutationObserver(removeThis);
    const oobserver = new MutationObserver(openThis);

    // Let the chads loose on the targets
    observer.observe(targetn, observerOptions);
    observer.observe(targetm, observerOptions);
    oobserver.observe(targetm, observerOptions);
    oobserver.observe(targetn, observerOptions);

    // Calls the function on Page load
    removeThis();
})();