// ==UserScript==
// @name         Nitro Type Rainbow Race Text
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds rainbow colors to race text in Nitro Type
// @author       You
// @match        https://www.nitrotype.com/race*
// @grant        none
 // @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/542251/Nitro%20Type%20Rainbow%20Race%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/542251/Nitro%20Type%20Rainbow%20Race%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addRainbowStyle = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes rainbow {
                0%{color:red;}
                20%{color:orange;}
                40%{color:yellow;}
                60%{color:green;}
                80%{color:blue;}
                100%{color:violet;}
            }
            .rainbow-text {
                animation: rainbow 2s infinite linear;
            }
        `;
        document.head.appendChild(style);
    };

    const applyRainbowText = () => {
        const raceTextElement = document.querySelector('.dash-copy-container');
        if (raceTextElement) {
            raceTextElement.classList.add('rainbow-text');
        }
    };

    addRainbowStyle();
    const observer = new MutationObserver(applyRainbowText);
    observer.observe(document.body, { childList: true, subtree: true });
})();
