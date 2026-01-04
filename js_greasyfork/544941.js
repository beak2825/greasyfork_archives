// ==UserScript==
// @name         GraySwan Liberator
// @namespace    https://karthidreamr.local
// @version      1.0
// @description  Raw periodic filter that (a) removes the specific pop-up components and (b) re-enables the Submit-Break button and chat textarea if they are disabled.
// @author       KarthiDreamr
// @match        https://app.grayswan.ai/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544941/GraySwan%20Liberator.user.js
// @updateURL https://update.greasyfork.org/scripts/544941/GraySwan%20Liberator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setInterval(() => {

        /* =========================================================
           1.  ENABLE  "SUBMIT BREAK" BUTTON
           ---------------------------------------------------------*/
        document.querySelectorAll('#submitJailbreakButton[disabled]').forEach(btn => {
            btn.disabled = false;// clear DOM property
            btn.removeAttribute('disabled'); // clear attribute
        });

        /* =========================================================
           2.  ENABLE  CHAT TEXTAREA
           ---------------------------------------------------------*/
        document.querySelectorAll('#chatTextarea[disabled]').forEach(area => {
            area.disabled = false;// clear DOM property
            area.removeAttribute('disabled'); // clear attribute
        });

    }, 500); // run every 0.5 s; intentionally unoptimised

})();
