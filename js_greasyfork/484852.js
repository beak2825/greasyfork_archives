// ==UserScript==
// @name         Udemy_media_buttons_fix
// @namespace    https://www.udemy.com
// @version      2024-01-16
// @description  Script for fixing media buttons when watching udemy course
// @author       You
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484852/Udemy_media_buttons_fix.user.js
// @updateURL https://update.greasyfork.org/scripts/484852/Udemy_media_buttons_fix.meta.js
// ==/UserScript==

function rewind() {
const el = document.querySelector('[data-purpose="rewind-skip-button"]')
el.click();
}
function forward() {
const el = document.querySelector('[data-purpose="forward-skip-button"]')
el.click();
}
function playOrPause() {
const el = document.querySelector('[data-purpose="pause-button"], [data-purpose="play-button"]')
el.click();
}
navigator.mediaSession.setActionHandler('previoustrack', rewind);
navigator.mediaSession.setActionHandler('nexttrack', forward);
navigator.mediaSession.setActionHandler('play', playOrPause);
navigator.mediaSession.setActionHandler('pause', playOrPause);