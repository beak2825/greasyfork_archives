// ==UserScript==
// @name         more test xd
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @icon         ShootEm.io
// @description  test
// @author       noone
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @match        *://ShootEm.io
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450362/more%20test%20xd.user.js
// @updateURL https://update.greasyfork.org/scripts/450362/more%20test%20xd.meta.js
// ==/UserScript==
// New crosshair
 
(function() {
    'use strict';
    window.addEventListener('click', function() {
        try {
document.querySelector("#game-area-wrapper").style.cursor = 'url(data:image/png;base64,https://www.reddit.com/r/KrunkerIO/comments/del77t/my_light_blue_scopecrosshairhitmarker_setup/) 16 16, default';
        } catch (e) { }
    });
})();