// ==UserScript==
// @name           HWM Delete GO & GN Speedrun
// @namespace 	   https://greasyfork.org/ru/users/302695
// @description    Удаление "ускорения" ГО и ГН за бриллианты (версия от 2020.04.06)
// @author         Pagan of Dark
// @version        1.0
// @include        https://*heroeswm.ru/mercenary_guild.php*
// @include        https://*lordswm.com/mercenary_guild.php*
// @include        http://178.248.235.15/mercenary_guild.php*
// @include        https://*heroeswm.ru/map.php*
// @include        https://*lordswm.com/map.php*
// @include        http://178.248.235.15/map.php*
// @grant          none
// @icon           http://daily.heroeswm.ru/upload/podicon.PNG
// @downloadURL https://update.greasyfork.org/scripts/399791/HWM%20Delete%20GO%20%20GN%20Speedrun.user.js
// @updateURL https://update.greasyfork.org/scripts/399791/HWM%20Delete%20GO%20%20GN%20Speedrun.meta.js
// ==/UserScript==

el = getI( "//a[contains(@onclick, 'map_sweet_confirm()')]" );
if (el.snapshotLength > 0) el.snapshotItem(0).parentNode.remove();

function getI(xpath,elem){return document.evaluate(xpath,(!elem?document:elem),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}
