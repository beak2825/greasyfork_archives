// ==UserScript==
// @name         GC Hide Sidebar on Solitaire
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Hides the all-in-one sidebar on the Sakhmet Solitaire page on grundos.cafe.
// @author       DeviPotato (Devi on GC, devi on Discord)
// @license      MIT
// @match        https://www.grundos.cafe/games/sakhmet_solitaire/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/488997/GC%20Hide%20Sidebar%20on%20Solitaire.user.js
// @updateURL https://update.greasyfork.org/scripts/488997/GC%20Hide%20Sidebar%20on%20Solitaire.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const head = document.getElementsByTagName('head')[0];
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    head.appendChild(style);

    style.sheet.insertRule(`
    #aio_sidebar_placeholder {
    display: none
    }`, style.sheet.cssRules.length);
})();