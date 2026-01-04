// ==UserScript==
// @name         Rickroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Rickroll your freinds.
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437126/Rickroll.user.js
// @updateURL https://update.greasyfork.org/scripts/437126/Rickroll.meta.js
// ==/UserScript==




document.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    }
});