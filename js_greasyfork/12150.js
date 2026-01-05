// ==UserScript==
// @name       Jump2.0
// @namespace  Jump2.0
// @version    0.1
// @description  Ricerca
// @match      http://*.imperiaonline.org/imperia/game_v5/game/village.php
// @copyright  
// @downloadURL https://update.greasyfork.org/scripts/12150/Jump20.user.js
// @updateURL https://update.greasyfork.org/scripts/12150/Jump20.meta.js
// ==/UserScript==

document.body.style.background = 'orange';
setInterval(
function Spostamento1()
   {
        xajax_provinces_info('provinces');
        xajax_change_current_province(666,1,'village.php',1);
        xajax_change_current_province(666,1,'village.php',3);
        xajax_premiumMoveAll(1);
        xajax_premiumMoveAll(2)
        xajax_provinces_info('provinces');
        xajax_change_current_province(666,1,'village.php',3);
        xajax_change_current_province(666,1,'village.php',1);
        xajax_premiumMoveAll(1);
        xajax_premiumMoveAll(2);
   },12000)