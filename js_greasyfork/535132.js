// ==UserScript==
// @name       New York Times Crossword - Keyboard shortcut for pencil
// @namespace  https://mathemaniac.org/
// @version    1.0.0
// @description  Lets you press the shift key to toggle the pencil tool on the crossword.
// @match        https://www.nytimes.com/crosswords/game/*
// @copyright  2025, Sebastian Paaske Tørholm
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/535132/New%20York%20Times%20Crossword%20-%20Keyboard%20shortcut%20for%20pencil.user.js
// @updateURL https://update.greasyfork.org/scripts/535132/New%20York%20Times%20Crossword%20-%20Keyboard%20shortcut%20for%20pencil.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

document.onkeydown = (e) => {
    if (e.key === 'Shift') {
        document.querySelector('button:has(.xwd__toolbar_icon--pencil, .xwd__toolbar_icon--pencil-active)').click();
    }
};
