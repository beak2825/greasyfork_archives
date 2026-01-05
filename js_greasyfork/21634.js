// ==UserScript==
// @name         Vertix Fast fire/JumpShot
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  SpaceBar to shoot/Hold for full clip
// @author       stranger3003
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21634/Vertix%20Fast%20fireJumpShot.user.js
// @updateURL https://update.greasyfork.org/scripts/21634/Vertix%20Fast%20fireJumpShot.meta.js
// ==/UserScript==

$("#cvs").keydown(function(c){32==c.which&&shootBullet(player)});