// ==UserScript==
// @name         Surviv.io Bumpfire
// @namespace    http://tampermonkey.net/
// @version      1.0.6.1
// @description  Just hold your mouse 
// @author       vnbpm
// @license MIT
// @match        *://surviv.io/*
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
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436405/Survivio%20Bumpfire.user.js
// @updateURL https://update.greasyfork.org/scripts/436405/Survivio%20Bumpfire.meta.js
// ==/UserScript==
// Change color for crosshair
 
(function() {
    'use strict';
    window.addEventListener('mousedown', function(e) {
        if (e.button == 0) {
        try {
                setInterval(() => {
        document.querySelector("#game-area-wrapper").click();
    },500);
        } catch (e) { }
        }
    });
})();