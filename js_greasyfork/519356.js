// ==UserScript==
// @name           Letterpress image flip 
// @namespace      SSSSLLLL
// @author         SSSSLLLL
// @description    Flips all images horizontally when both shift keys are pressed simultaneously. Useful for shopping for letterpress cuts.
// @match          *://*/*
// @icon           https://upload.wikimedia.org/wikipedia/commons/e/e9/Metal_type.svg
// @version        0.2
// @license        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/519356/Letterpress%20image%20flip.user.js
// @updateURL https://update.greasyfork.org/scripts/519356/Letterpress%20image%20flip.meta.js
// ==/UserScript==

function addStyle(styleText){
    let s = document.createElement('style')
    s.appendChild(document.createTextNode(styleText))
    document.getElementsByTagName('head')[0].appendChild(s)
}



(function() {
    'use strict';

    window.keys = [];
    let keys = window.keys;

    window.runMyScript = () => {
        console.log('Flipped image');
    }

    window.keysCheck = () => {
        keys.push(event.code);
        keys = [...new Set(keys)];
        setTimeout(() => { keys = []; }, 600);
    }

    document.querySelector('body').addEventListener("keydown", (event) => {
        const shiftKeyPressed = event.code === "ShiftLeft" || event.code === "ShiftRight";

        if (shiftKeyPressed) {
            window.keysCheck();
        }

        if (keys.length === 2) {
            addStyle(`
              img{
                 transform:scaleX(-1);
              }
            `)

            keys = [];
        }
    });
})();
