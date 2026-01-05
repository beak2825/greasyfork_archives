// ==UserScript==
// @name      Mutare armata
// @namespace  Nirobot
// @version    0.1
// @description  Muta armata intre provincii
// @match      http://*.imperiaonline.org/imperia/game_v5/game/villagejs.php
// @copyright  
// @downloadURL https://update.greasyfork.org/scripts/15920/Mutare%20armata.user.js
// @updateURL https://update.greasyfork.org/scripts/15920/Mutare%20armata.meta.js
// ==/UserScript==

document.body.style.background = 'orange';
setInterval(
function Spostamento1()
   {
        xajax_provinces_info('provinces');
        xajax_change_current_province(666,1,'villagejs.php',1);
        xajax_change_current_province(666,1,'villagejs.php',3);
        xajax_premiumMoveAll(1);
        xajax_premiumMoveAll(2)
        xajax_provinces_info('provinces');
        xajax_change_current_province(666,1,'villagejs.php',3);
        xajax_change_current_province(666,1,'villagejs.php',1);
        xajax_premiumMoveAll(1);
        xajax_premiumMoveAll(2);
   },12000)

	