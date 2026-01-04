// ==UserScript==
// @name           HWM Delete GO
// @namespace 	   https://greasyfork.org/ru/users/302695
// @description    Удаление "ускорения" ГО и ГН за бриллианты (версия от 2020.04.06)
// @author         Pagan of Dark & nexterot
// @version        1.0.2
// @include        https://*heroeswm.ru/map.php*
// @include        https://*lordswm.com/map.php*
// @include        http://178.248.235.15/map.php*
// @grant          none
// @icon           http://daily.heroeswm.ru/upload/podicon.PNG
// @license        none
// @homepage https://greasyfork.org/ru/scripts/538722-hwm-delete-go
// @downloadURL https://update.greasyfork.org/scripts/538722/HWM%20Delete%20GO.user.js
// @updateURL https://update.greasyfork.org/scripts/538722/HWM%20Delete%20GO.meta.js
// ==/UserScript==

var huntBlock = document.querySelector("#map_hunt_block_div");
huntBlock.remove();

