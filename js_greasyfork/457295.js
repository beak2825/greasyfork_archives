// ==UserScript==
// @name         Deeeep.io Remember Username
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Save the last username you've typed into deeeep.io so you don't have to type it every time you go to the site.
// @author       Dildoer the Cocknight
// @match        https://deeeep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deeeep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457295/Deeeepio%20Remember%20Username.user.js
// @updateURL https://update.greasyfork.org/scripts/457295/Deeeepio%20Remember%20Username.meta.js
// ==/UserScript==

window.onload = () => {

    const input = document.querySelector('.el-input__inner');
    input.value = localStorage.input;
    const evt = document.createEvent("KeyboardEvent");
    evt.initEvent("input", false, true);
    input.addEventListener('input', ()=> {
       localStorage.input = input.value;
    });
    input.dispatchEvent(evt);

};