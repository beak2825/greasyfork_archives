// ==UserScript==
// @name         SLR Scenedate
// @namespace    SLR-Aero
// @version      0.1
// @description  Adds full release date to scene pages
// @author       Aerowen
// @license      GNU GPLv3
// @match        https://www.sexlikereal.com/scenes/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sexlikereal.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459446/SLR%20Scenedate.user.js
// @updateURL https://update.greasyfork.org/scripts/459446/SLR%20Scenedate.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let time = document.querySelector('div.c-page--video-left time');
    if (time !== null) { time.innerText = time.innerText + " (" + time.getAttribute('datetime') + ")"; }
})();