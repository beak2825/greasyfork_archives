// ==UserScript==
// @name         Ylilauta: Up&Down arrows
// @namespace    http://tampermonkey.net/
// @version      2024-06-25
// @description  Replace buy gold button with up and down navigation arrows
// @author       Nyymi laudalta
// @match        http://*.ylilauta.org/*
// @match        http://ylilauta.org/*
// @match        https://*.ylilauta.org/*
// @match        https://ylilauta.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498870/Ylilauta%3A%20UpDown%20arrows.user.js
// @updateURL https://update.greasyfork.org/scripts/498870/Ylilauta%3A%20UpDown%20arrows.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log(document);
    let navBar = document.getElementById("navbar");
    let button = document.getElementById("navbar").getElementsByClassName("button button-gold-buy")[0];
    button.remove();
    //Up arrow
    const upArrow = document.createElement("button");
    upArrow.classList.add("icon-enter-up2");
    upArrow.addEventListener('click', () => {
            scrollTo(0, 0);
    });
    //Down arrow
    const downArrow = document.createElement("button");
    downArrow.classList.add("icon-enter-down2");
    downArrow.addEventListener('click', () => {
            scrollTo(0, document.body.scrollHeight);
    });

    navBar.appendChild(upArrow);
    navBar.appendChild(downArrow);
})();