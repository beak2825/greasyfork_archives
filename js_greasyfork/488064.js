// ==UserScript==
// @name         Eruda Tool
// @namespace    http://tampermonkey.net/
// @version      v3.0.1
// @description  Run Eruda like Console Command / Log
// @author       UnoBot
// @match        https://*/*
// @icon         https://play-lh.googleusercontent.com/VFpPqvK3qCIW7pe5uguBTvjQ1G4J_tll127umCFzv4lLLVSb-nzho4a-G_vecpQmqS4=s48-rw
// @grant        none
// @license      MIT
// @supportURL   NONE
// @namespace    https://feds.lol/UnoPing
// @downloadURL https://update.greasyfork.org/scripts/488064/Eruda%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/488064/Eruda%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.title == 'Just a moment...' && 'Just a second... - work.ink') {
    return;
}
    window.location.replace("javascript:(function () { var script = document.createElement('script'); script.src='https://cdn.jsdelivr.net/npm/eruda'; document.body.append(script); script.onload = function () { eruda.init(); } })();")
})();