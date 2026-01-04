// ==UserScript==
// @name Infinity Scroll
// @namespace -
// @version 1.0.0
// @description expands biggest element when user reaches bottom of page.
// @author NotYou
// @include *
// @run-at document-idle
// @license GPL-3.0-or-later
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/440809/Infinity%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/440809/Infinity%20Scroll.meta.js
// ==/UserScript==


(function() {
    let longestDiv = Array.from(document.querySelectorAll(':not(body) > div')).sort((a, e) => e.offsetHeight - a.offsetHeight)[0]

    window.addEventListener('scroll', e => {
        if((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
            longestDiv.style.height = longestDiv.offsetHeight + 100 + 'px'
        }
    })
})()