// ==UserScript==
// @name         Auto Open Boxes lootbits
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto open boxes- auto refresh
// @author       Matheustbo
// @match        https://lootbits.io/dashboard.php
// @grant        none
// @license      Free for all
// @downloadURL https://update.greasyfork.org/scripts/382972/Auto%20Open%20Boxes%20lootbits.user.js
// @updateURL https://update.greasyfork.org/scripts/382972/Auto%20Open%20Boxes%20lootbits.meta.js
// ==/UserScript==

$(document).ready(function(){
         document.getElementsByClassName("lootbox-side lootbox-side-front")[0].click();

  setTimeout(function() {
  location.reload();
}, 10000);
});

