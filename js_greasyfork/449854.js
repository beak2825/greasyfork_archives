// ==UserScript==
// @name         Multi paste
// @version      0.3
// @description  Copy every word from the clipboard into multiple consecutive input fields
// @author       You
// @match        https://*/*

// @icon         
// @grant        none
// @namespace https://greasyfork.org/users/948386
// @downloadURL https://update.greasyfork.org/scripts/449854/Multi%20paste.user.js
// @updateURL https://update.greasyfork.org/scripts/449854/Multi%20paste.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    window.addEventListener("keydown", (e) => multiPaste( e));
})();

const multiPaste = async (e) => {
    if (e.ctrlKey && e.key === "p") {
        e.preventDefault()

        const text = await navigator.clipboard.readText();
        let arr = text.split(' ');
        let inputs = document.querySelectorAll('input[type="text"]')

        for (let i = 0; i < arr.length; i++) {
            if (i == inputs.length) break;
            inputs[i].value = arr[i];
            //console.log(inputs[i])
        }
    }

}