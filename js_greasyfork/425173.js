// ==UserScript==
// @name         RemoveNonSeeking
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes Non-seeking artists from Skeb.jp
// @author       NiniNeen
// @include        *skeb.jp*
// @icon         https://www.google.com/s2/favicons?domain=skeb.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425173/RemoveNonSeeking.user.js
// @updateURL https://update.greasyfork.org/scripts/425173/RemoveNonSeeking.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeNonSeekingElements () {
        let test = document.getElementsByClassName('columns')[0]
        let children = test.children;

        let filtered = [];

        for (let i = 0; i < test.children.length; i++) {
            let child = children[i];
            if(!child.innerText.includes('Seeking')) {
                // remove it from the
                child.outerHTML = '';
            }
        }
    }

    function createButton() {
        var button = document.createElement("button");
        button.innerHTML = "Remove non-seeking";
        button.style.position = 'fixed';
        button.style.left = 0;
        button.style.top = '100px';
        // 2. Append somewhere
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(button);

        // 3. Add event handler
        button.addEventListener ("click", function() {
            removeNonSeekingElements();
        });
    }

    setTimeout(function(){
        createButton();
        console.log('🦙 RemoveNonSeeking is now running 🦙');
    }, 3000);


})();