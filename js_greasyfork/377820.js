// ==UserScript==
// @name         Pause LastPass!
// @namespace    cfm
// @version      1.1
// @description  Pause LastPass by adding 'lpignore' to every input of type text or password.
// @author       CFM
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377820/Pause%20LastPass%21.user.js
// @updateURL https://update.greasyfork.org/scripts/377820/Pause%20LastPass%21.meta.js
// ==/UserScript==

(function () {
    console.log('Adding LastPass Ignore on all input type text or password.');
    let inputs = document.querySelectorAll('input[type=text], input[type=password]');
    for(let input of inputs) {
        input.setAttribute('data-lpignore', 'true');
    }
})();