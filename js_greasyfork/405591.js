// ==UserScript==
// @name         No disconnection
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       You
// @match        https://jstris.jezevec10.com/?play*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405591/No%20disconnection.user.js
// @updateURL https://update.greasyfork.org/scripts/405591/No%20disconnection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(()=>{
        let chat = document.querySelector('#chatInput')
        chat.value = 'not disco'
        var e = new Event("keydown");
        e.keyCode = 13;
        chat.dispatchEvent(e)

    },5 * 60 * 1000)
})();