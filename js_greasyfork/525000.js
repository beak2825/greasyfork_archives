// ==UserScript==
// @name         Hitbox saving existed maps
// @namespace    http://tampermonkey.net/
// @version      2025-01-26
// @description  gives access to copy existing map and saving it
// @author       Mr_FaZ3a
// @match        https://hitbox.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hitbox.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525000/Hitbox%20saving%20existed%20maps.user.js
// @updateURL https://update.greasyfork.org/scripts/525000/Hitbox%20saving%20existed%20maps.meta.js
// ==/UserScript==

let window = document.querySelector("#game").contentWindow
window.onload = (function() {
    'use strict';
    let menu = window.document.querySelector("#appContainer").querySelector("#editorContainer").querySelector(".topMenu").querySelector(".fileMenu")
    menu.addEventListener("mouseover", () => menu.firstElementChild.querySelectorAll(".item")[2].classList.remove("disabled"))
});