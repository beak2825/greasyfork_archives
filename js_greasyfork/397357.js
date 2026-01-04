// ==UserScript==
// @name         Refresh page every 20 minutes
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.mousehuntgame.com/
// @match	    http://mousehuntgame.com/*
// @match		https://mousehuntgame.com/*
// @match		http://www.mousehuntgame.com/*
// @match		https://www.mousehuntgame.com/*
// @match       http://www.mousehuntgame.com/camp.php*
// @match       https://www.mousehuntgame.com/camp.php*
// @match		http://apps.facebook.com/mousehunt/*
// @match		https://apps.facebook.com/mousehunt/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397357/Refresh%20page%20every%2020%20minutes.user.js
// @updateURL https://update.greasyfork.org/scripts/397357/Refresh%20page%20every%2020%20minutes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){ location.reload(); }, 1200*1000);
})();