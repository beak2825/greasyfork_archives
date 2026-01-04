// ==UserScript==
// @name         Studocu_Remove_Blur
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove blur in studocu.com and other annoying things. You can click the button at the right bottom to do so.
// @author       You
// @match        https://www.studocu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=studocu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442273/Studocu_Remove_Blur.user.js
// @updateURL https://update.greasyfork.org/scripts/442273/Studocu_Remove_Blur.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // alert("Trying lol");
    let waitTime = 3000; // 3000ms to start remove frontShit

    const timeout = setTimeout(() => {
        main();
    }, waitTime);

    function main(){
        let frontShit = document.querySelectorAll('#document-wrapper')[0].childNodes[0];
        frontShit.remove();
        let frontShit2 = document.querySelectorAll('h2');
        for (let i = 0; i < frontShit2.length; i++) {
            const shit = frontShit2[i];
            let shitWords = "Why is this page out of focus?";
            if (shit.innerHTML.indexOf(shitWords) != -1) { // shitWords in innerHTML
                console.log(shit);
                shit.parentElement.parentElement.remove();
            }
        }

        let clearBlur = ()=>{
            let blurDivs = document.querySelectorAll('.page-content');
            for (let i = 0; i < blurDivs.length; i++) {
                const blurDiv = blurDivs[i];
                let blurWords = "filter: blur(4px);";
                if (blurDiv.outerHTML.indexOf(blurWords) != -1) {
                    console.log(blurDiv);
                    while (blurDiv.hasChildNodes()){// lifting all the children
                        blurDiv.parentNode.insertBefore(blurDiv.firstChild,blurDiv);
                    }
                    blurDiv.parentNode.removeChild(blurDiv);
                }
            }
        };


        // Create a big red button for the user to click.

        let button = document.createElement("button");
        button.innerHTML = "Clear Blur";
        button.style.cssText = "position: fixed; bottom: 20px; right: 20px;";
        button.onclick = () => {
            clearBlur();
        }
        button.style.backgroundColor = 'blue';
        button.style.color = 'white';
        button.style.padding = '5px';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.fontSize = '20px';
        button.style.zIndex = '9999';
        // Add round border to the button.
        button.style.borderRadius = '10%';
        // Add a shadow to the button.
        button.style.boxShadow = '0px 0px 5px black';
        document.body.appendChild(button);

        // Too many repeated execution will result in a blank page for unknown reasons.
    }

})();