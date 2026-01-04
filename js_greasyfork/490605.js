// ==UserScript==
// @name         GitHub - 🖕 Brutal FORK-button 🖕
// @namespace    http://tampermonkey.net/
// @version      0.7
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @description  Replace "FORK"-button with "FUCK"-button, just for fun.
// @author       Ravlissimo
// @match        *://github.com/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490605/GitHub%20-%20%F0%9F%96%95%20Brutal%20FORK-button%20%F0%9F%96%95.user.js
// @updateURL https://update.greasyfork.org/scripts/490605/GitHub%20-%20%F0%9F%96%95%20Brutal%20FORK-button%20%F0%9F%96%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('fork-button').innerHTML = '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo-forked mr-2"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.7 5.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path></svg>🖕 FUCK 🖕';
    document.getElementById('tooltip-47062725-f2b6-4576-afda-90f1649ff044').innerHTML = '<tool-tip id="tooltip-47062725-f2b6-4576-afda-90f1649ff044" for="fork-button" popover="manual" data-direction="s" data-type="description" data-view-component="true" class="position-absolute sr-only" role="tooltip" style="--tool-tip-position-top: 234px; --tool-tip-position-left: 632.4453125px;">FUCK your own copy of soxoj/maigret</tool-tip>';
})();