// ==UserScript==
// @name         Freefall Tournnament anti-redirect-overlay
// @namespace    https://www.freefalltournament.com/freefall
// @version      1.0
// @author       NextDev65
// @description  removes the redirect overlay from https://www.freefalltournament.com/freefall
// @match        https://storage.y8.com/y8-studio/unity/joll/freefall_tournament/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/429081/Freefall%20Tournnament%20anti-redirect-overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/429081/Freefall%20Tournnament%20anti-redirect-overlay.meta.js
// ==/UserScript==

(function(){
    'use strict';

    document.getElementById('redirect-overlay').remove();
})();