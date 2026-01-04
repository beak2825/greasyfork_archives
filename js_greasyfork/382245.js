// ==UserScript==
// @name         Komica: F5
// @version      1.0.6
// @description  Scroll to top while you press F5.
// @author       Hayao-Gai
// @namespace	 https://github.com/HayaoGai
// @icon         https://i.imgur.com/ltLDPGc.jpg
// @include      http://*.komica.org/*/*
// @include      https://*.komica.org/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382245/Komica%3A%20F5.user.js
// @updateURL https://update.greasyfork.org/scripts/382245/Komica%3A%20F5.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    const red = `<svg width="45" height="45" viewBox="0 0 128 128"><g transform="translate(0,128) scale(0.1,-0.1)" fill="#800000" stroke="none"><path d="M482 1260 c-113 -30 -206 -84 -293 -170 -336 -335 -203 -899 251 -1060 89 -31 248 -38 345 -16 121 29 209 79 305 176 129 129 190 269 190 441 0 113 -16 184 -67 289 -131 271 -441 416 -731 340z m261 -155 c91 -19 160 -58 234 -131 277 -273 124 -740 -265 -806 -310 -53 -595 232 -543 544 34 204 181 356 386 398 61 12 114 11 188 -5z"/><path d="M463 817 c-125 -125 -143 -147 -143 -175 0 -43 38 -82 80 -82 25 0 45 13 96 62 l64 61 0 -157 c0 -153 1 -157 25 -181 15 -16 36 -25 55 -25 19 0 40 9 55 25 24 23 25 28 25 175 0 82 3 150 7 150 3 0 32 -25 64 -55 45 -43 65 -55 89 -55 42 0 80 39 80 82 0 28 -18 50 -143 175 -128 128 -146 143 -177 143 -31 0 -49 -15 -177 -143z"/></g></svg>`;
    const white = `<svg width="45" height="45" viewBox="0 0 128 128"><g transform="translate(0,128) scale(0.1,-0.1)" fill="white" stroke="none"><path d="M482 1260 c-113 -30 -206 -84 -293 -170 -336 -335 -203 -899 251 -1060 89 -31 248 -38 345 -16 121 29 209 79 305 176 129 129 190 269 190 441 0 113 -16 184 -67 289 -131 271 -441 416 -731 340z m261 -155 c91 -19 160 -58 234 -131 277 -273 124 -740 -265 -806 -310 -53 -595 232 -543 544 34 204 181 356 386 398 61 12 114 11 188 -5z"/><path d="M463 817 c-125 -125 -143 -147 -143 -175 0 -43 38 -82 80 -82 25 0 45 13 96 62 l64 61 0 -157 c0 -153 1 -157 25 -181 15 -16 36 -25 55 -25 19 0 40 9 55 25 24 23 25 28 25 175 0 82 3 150 7 150 3 0 32 -25 64 -55 45 -43 65 -55 89 -55 42 0 80 39 80 82 0 28 -18 50 -143 175 -128 128 -146 143 -177 143 -31 0 -49 -15 -177 -143z"/></g></svg>`;
    let ctrl, r;

    defineCSS();

    window.addEventListener("load", () => {
        arrowButton();
        detectTheme();
        keyListener();
    });

    function arrowButton() {
        const div = document.createElement("div");
        div.classList.add("arrow");
        div.innerHTML = isDark() ? white : red;
        div.addEventListener("click", () => {
            goTop();
            location.reload();
        });
        document.body.appendChild(div);
    }

    function detectTheme() {
        const select = document.querySelector("select#theme-selector");
        select.addEventListener("change", () => {
            const color1 = window.getComputedStyle(document.querySelector("html")).getPropertyValue("background-color");
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    const color2 = window.getComputedStyle(document.querySelector("html")).getPropertyValue("background-color");
                    if (color1 !== color2) {
                        i = 6;
                        const div = document.querySelector("div.arrow");
                        div.innerHTML = isDark() ? white : red;
                    }
                }, 100 * i);
            }
        });
    }

    function isDark() {
        return !!document.querySelector("select#theme-selector").value;
    }

    function keyListener() {
        document.addEventListener("keydown", e => {
            if (e.keyCode === 116) goTop();
            if (e.keyCode === 17) ctrl = true;
            else if (e.keyCode === 82) r = true;
            if (ctrl && r) goTop();
        });
        document.addEventListener("keyup", e => {
            if (e.keyCode === 17) ctrl = false;
            else if (e.keyCode === 82) r = false;
        });
    }

    function goTop() {
        window.scrollTo(0, 0);
    }

    function defineCSS() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML =
            `.arrow {
                 position: fixed;
                 right: 50px;
                 bottom: 30px;
                 cursor: pointer;
             }`;
        document.head.appendChild(style);
    }

})();
