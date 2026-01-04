// ==UserScript==
// @name         NativShark: Furigana Toggle
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Allows furigana to be toggled by clicking on it. Hides all furigana by default.
// @author       Kumirei
// @include      https://www.nativshark.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395885/NativShark%3A%20Furigana%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/395885/NativShark%3A%20Furigana%20Toggle.meta.js
// ==/UserScript==

;(function () {
    // Create style element hiding furigana by default
    var style = document.createElement('style')
    style.id = 'FuriganaToggleCSS'
    style.innerHTML = 'ruby rt {visibility: hidden;}'
    document.getElementsByTagName('head')[0].append(style)

    // Toggle furigana when clicking kanji
    document.onclick = toggleFurigana
    function toggleFurigana(event) {
        if (event.target.nodeName == 'RB') {
            var rt = event.target.nextElementSibling
            var visibility = rt.style.visibility
            rt.style.visibility = visibility == 'visible' ? 'hidden' : 'visible'
        }
    }
})()
