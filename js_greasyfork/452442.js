// ==UserScript==
// @name         MagentaTv (stellt diese Verdunkelung und Buttons mittem im Bild einfach ab)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Sets all 100% overlays to transparent and disables buttons for better viewing
// @author       Super3000
// @match        https://web.magentatv.de/*
// @icon         https://telekomhilft.telekom.de/t5/image/serverpage/image-id/150301iD6B711795F6BC934/image-size/large/is-moderation-mode/true?v=v2&px=999
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452442/MagentaTv%20%28stellt%20diese%20Verdunkelung%20und%20Buttons%20mittem%20im%20Bild%20einfach%20ab%29.user.js
// @updateURL https://update.greasyfork.org/scripts/452442/MagentaTv%20%28stellt%20diese%20Verdunkelung%20und%20Buttons%20mittem%20im%20Bild%20einfach%20ab%29.meta.js
// ==/UserScript==

/* eslint-disable no-implicit-globals */

//removes fading background
(function() {
    'use strict';
    for (let css of document.styleSheets) {
        for (let style of css.cssRules) {
            if (style.style) {
                if (style.style.width && style.style.height && style.style.backgroundColor) {
                    if (style.style.width=="100%" && style.style.height=="100%") {
                        style.style.backgroundColor = "rgba(0, 0, 0, 0)";
                    }
                }
            }
        }
    }

})();

//removes buttons in the middle
myIntervala =  setInterval(function() {
    document.getElementsByClassName('x55PW bPXCE')[0].remove()
    document.getElementsByClassName('xa80m')[0].remove()
},200);