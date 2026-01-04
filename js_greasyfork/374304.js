// ==UserScript==
// @name         CCC chat fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  CCC twitch chat fix
// @author       jak3122
// @match        https://www.chess.com/computer-chess-championship
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374304/CCC%20chat%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/374304/CCC%20chat%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('computerchess').src = 'https://www.twitch.tv/embed/computerchess/chat';
})();