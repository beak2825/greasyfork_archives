// ==UserScript==
// @name         Hide whitespace on Tattle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide surplus whitespace on Tattle for easy browsing in grunk mode
// @author       You
// @match        https://tattle.life/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tattle.life
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467825/Hide%20whitespace%20on%20Tattle.user.js
// @updateURL https://update.greasyfork.org/scripts/467825/Hide%20whitespace%20on%20Tattle.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll('.visitorAdPost').forEach(e=>{e.style.minHeight='0px';e.style.margin='0px'})
})()