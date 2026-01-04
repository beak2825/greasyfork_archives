// ==UserScript==
// @name         Wanikani Forums: Hide "HAS YOUR QUESTION BEEN ANSWERED" Popup
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Hides the most annoying popup that Discourse has ever implemented
// @author       Kumirei
// @license MIT
// @include      *community.wanikani.com*
// @icon         https://www.google.com/s2/favicons?domain=wanikani.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437867/Wanikani%20Forums%3A%20Hide%20%22HAS%20YOUR%20QUESTION%20BEEN%20ANSWERED%22%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/437867/Wanikani%20Forums%3A%20Hide%20%22HAS%20YOUR%20QUESTION%20BEEN%20ANSWERED%22%20Popup.meta.js
// ==/UserScript==

;(function () {
    document
        .getElementsByTagName('head')[0]
        .insertAdjacentHTML('beforeend', `<style id="hide-no-answer-popup">.no-answer {display: none;}</style>`)
})()
