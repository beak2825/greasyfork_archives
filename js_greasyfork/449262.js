// ==UserScript==
// @name         Hide rooms that have GMM in the title
// @version      1.0
// @description  Tired of seeing those 2 or 3 pesky GMM rooms that clutter your precious room list? This is the mod for you.
// @author       SneezingCactus
// @license      MIT
// @match        https://*.bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/938482
// @downloadURL https://update.greasyfork.org/scripts/449262/Hide%20rooms%20that%20have%20GMM%20in%20the%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/449262/Hide%20rooms%20that%20have%20GMM%20in%20the%20title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];

    window.bonkCodeInjectors.push(bonkCode => {
        try {
            bonkCode = bonkCode.replace(/(gl:[^,]+,token.{0,100}function[^;]{0,200};)/, [
                '$1const rooms = arguments[0].rooms;',
                'const roomsNew = [];',
                'for(let i = 0; i < rooms.length;i++)',
                'if(!(/[Gg][^MmGg]{0,6}[Mm][^MmGg]{0,6}[Mm]/.test(rooms[i].roomname)))',
                'roomsNew.push(rooms[i]);',
                'arguments[0].rooms = roomsNew;',
            ].join(''));
            return bonkCode;
        } catch (error) {
            throw error;
        }
    });
})();