// ==UserScript==
// @name         Wide Chat Input in Gemini
// @namespace    http://tampermonkey.net/
// @version      2024-03-07
// @description  Change the width the conversation box in Gemini.
// @author       You
// @match        https://gemini.google.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489177/Wide%20Chat%20Input%20in%20Gemini.user.js
// @updateURL https://update.greasyfork.org/scripts/489177/Wide%20Chat%20Input%20in%20Gemini.meta.js
// ==/UserScript==

(function() {
    setInterval(function() {
        var elements = document.querySelectorAll('.conversation-container')
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.maxWidth = '80%'
        }
    }, 100)
})();