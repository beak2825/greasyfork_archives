// ==UserScript==
// @name         Bunpro: Remove Undo Button
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Disables the undo functionality in reviews
// @author       Kumirei
// @include      *bunpro.jp/*
// @exclude      *community.bunpro.jp*
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @require      https://greasyfork.org/scripts/370623-bunpro-helpful-events/code/Bunpro:%20Helpful%20Events.js?version=615700
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396188/Bunpro%3A%20Remove%20Undo%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/396188/Bunpro%3A%20Remove%20Undo%20Button.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

(function() {
    var $ = window.$;
    $('html')[0].addEventListener('quiz-page', ()=>{
        $('.oops-button').remove();
    });
})();
