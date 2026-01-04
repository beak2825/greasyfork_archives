// ==UserScript==
// @name        Taieri College ID Photo hider
// @namespace   Violentmonkey Scripts
// @match       https://taieri.school.kiwi/*
// @grant       none
// @version     1.0
// @author      EnvIr0n
// @description For those people with unsatisfactory ID photos.
// @license Unlicense
// @downloadURL https://update.greasyfork.org/scripts/539151/Taieri%20College%20ID%20Photo%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/539151/Taieri%20College%20ID%20Photo%20hider.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
    document.querySelectorAll('img.avatar').forEach(el => el.remove());
});
//EOF