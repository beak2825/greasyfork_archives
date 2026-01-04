// ==UserScript==
// @name         SIMPLE AUTOCLICKER FOR COOKIE CLICKER
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simple autoclicker for cookie clicker, just add and go to cookie clicker.
// @author       CharlesAPeterson
// @match        https://orteil.dashnet.org/cookieclicker/
// @icon         https://e7.pngegg.com/pngimages/282/209/png-clipart-cursor-cursor.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435223/SIMPLE%20AUTOCLICKER%20FOR%20COOKIE%20CLICKER.user.js
// @updateURL https://update.greasyfork.org/scripts/435223/SIMPLE%20AUTOCLICKER%20FOR%20COOKIE%20CLICKER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {Game.ClickCookie();}, 0);
        
    
})();