// ==UserScript==
// @name         Wanikani: Lessons & Reviews in header
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  Puts the lessons and review counts back into the header
// @author       Kumirei
// @include      /^https://(www|preview).wanikani.com/(dashboard)?$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397727/Wanikani%3A%20Lessons%20%20Reviews%20in%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/397727/Wanikani%3A%20Lessons%20%20Reviews%20in%20header.meta.js
// ==/UserScript==

;(function () {
    document.getElementsByTagName('head')[0].insertAdjacentHTML(
        'beforeEnd',
        `
<style id="LnRHeader">
    .navigation-shortcuts.hidden {display: flex; visibility: visible;}
    .lessons-and-reviews {display: none;}
    .extra-study {grid-row: 1/3 !important;}
</style>`,
    )
})()
