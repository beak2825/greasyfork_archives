// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  galxe 徽章领取
// @author       You
// @match        https://galxe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=galxe.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455170/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/455170/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';


setTimeout(() => {
    let container = document.querySelector('div.word-break-word')
container.innerHTML = container.innerHTML + "<button id = 'fuckgalxe' class= 'g-btn width-max-100 v-btn v-btn--block v-btn--is-elevated v-btn--has-bg theme--dark v-size--default primary text-16-bold'>claim</button>"
function clickHandler(event) {
    let verify_button = document.querySelectorAll('button[aria-haspopup="true"]')
    for (var i = 0; i < verify_button.length; i++) {

        verify_button[i].click()
    }
    setTimeout(() => {
        document.querySelector('button[forge-approve="true"]').click()
    }, 8888);
    console.log('6666666')
}
document.getElementById("fuckgalxe").addEventListener("click", clickHandler, false)
}, 8888);
    // Your code here...
})();