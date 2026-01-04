// ==UserScript==
// @name         rearrange-O-Don
// @license      DWTFYW
// @namespace    http://pureandapplied.com.au/composeToFirstColumn
// @version      0.1.5
// @description  more useful space in Mastodon
// @author       stib
// @match        https://*.social/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aus.social
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468037/rearrange-O-Don.user.js
// @updateURL https://update.greasyfork.org/scripts/468037/rearrange-O-Don.meta.js
// ==/UserScript==

(function() {
    const postButtonText = "Post!"; //change to whatever you want you sick freaks.
    // Identify the source and destination containers using appropriate selectors
    let elementList = [
        // listed in reverse order, bcs they get inserted at the top each time
        'form.compose-form',
        'div.navigation-bar',
        'div.search',
        'nav.drawer__header',
    ];
    window.addEventListener('load', reorganiseODon);

    function reorganiseODon(){
        // first column is the target for where we're moving stuff
        const destinationContainer = document.querySelector('div.column');
        console.log("hacking the Mastodon UI to make things more compact");
        if (destinationContainer){

            for (let i = 0; i < elementList.length; i++){
                const fc = destinationContainer.firstChild;
                console.log(fc);
                const src = document.querySelector(elementList[i]);
                if (src && fc) {
                    // remove superfluous padding
                    src.style.paddingLeft = 0;
                    src.style.paddingRight = 0;
                    src.style.paddingTop = 0;
                    // move to the destination column
                    destinationContainer.insertBefore(src, fc);
                }
            }
        }
        //hide the empty column
        const origColumn = document.querySelector('div.drawer');
        origColumn.style.display = 'none';
        //give a little bit of space to the first column
        destinationContainer.style.paddingLeft = "10px";
        //move the toot button inside the post section
        const tootButt = document.querySelector('button.button--block');
        tootButt.style.paddingTop = 0;
        tootButt.style.paddingBottom = 0;
        tootButt.innerText = postButtonText;
        const buttBar = document.querySelector('div.compose-form__buttons-wrapper');
        buttBar.appendChild(tootButt);
        //remove the empty old toot button div
        document.querySelector('div.compose-form__publish').style.display = 'none';
    }
})();