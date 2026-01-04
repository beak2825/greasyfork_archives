// ==UserScript==
// @name         AntiRickRoll
// @version      1.1
// @description  Blocks RickRolls
// @author       CelestialCrafter
// @match        *://www.youtube.com/watch?v=iik25wqIuFo
// @match        *://www.youtube.com/watch?v=oHg5SJYRHA0
// @match        *://www.youtube.com/watch?v=dQw4w9WgXcQ
// @grant        none
// @namespace https://greasyfork.org/users/711114
// @downloadURL https://update.greasyfork.org/scripts/417314/AntiRickRoll.user.js
// @updateURL https://update.greasyfork.org/scripts/417314/AntiRickRoll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByTagName('body')[0].innerHTML = '';
    alert('RICKROLL BLOCKED\nDisable this script to continue')
})();