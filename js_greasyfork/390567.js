// ==UserScript==
// @name Twitch - Reduce font size
// @version 0.1
// @description  Reduces the font size of the humongous titles 'Following/Browse'
// @namespace Violentmonkey Scripts
// @match https://*.twitch.tv/*
// @author sicu                             
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/390567/Twitch%20-%20Reduce%20font%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/390567/Twitch%20-%20Reduce%20font%20size.meta.js
// ==/UserScript==
(function() {
'use strict'
document.body.insertAdjacentHTML('beforeend', `<style>
.tw-mg-b-2 h1 {
    font-size: 3.2rem;
}
.tw-mg-l-3 h1 {
    font-size: 3.2rem;
}
</style>`)
})();