// ==UserScript==
// @name         Replace dot with comma
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  for those pesky moments where you forgot to change the dots to commas yourself
// @author       viriv
// @match        https://rekenblokken.secure.malmberg.nl/chapter/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=malmberg.nl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462507/Replace%20dot%20with%20comma.user.js
// @updateURL https://update.greasyfork.org/scripts/462507/Replace%20dot%20with%20comma.meta.js
// ==/UserScript==

(function changeInput() {
    'use strict';

    const inputs = document.querySelectorAll("input[type='text']")
    inputs.forEach((input) => {
        if(!input.dataset.haslistener) {
            replaceDotWithComma(input)
            input.addEventListener("input", () => replaceDotWithComma(input));
            input.dataset.haslistener = "true"
        }
    });

    setTimeout(() => changeInput(), 1000)
})();

function replaceDotWithComma(input) {
    input.value = input.value.replaceAll(".", ",")
}
