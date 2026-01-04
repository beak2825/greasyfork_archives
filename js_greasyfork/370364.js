// ==UserScript==
// @name         Move
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        http://matchlandserver.milamit.cz/matchland*/admin/matchlandios/messagetoplayer/*
// @match        http://bakeacakeserver.milamit.cz/bakeacake*/admin/bakeacakeios/messagetoplayer/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370364/Move.user.js
// @updateURL https://update.greasyfork.org/scripts/370364/Move.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.resizeTo(970,980);
    window.moveTo(770,50);
})();