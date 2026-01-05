// ==UserScript==
// @name           MH - H2P - Modifs interface
// @namespace      mountyhall
// @description    Envoi automatique des modifs en Tanière et repli automatique des Équipements Équipés
// @include        */MH_Play/Play_a_Action.php?type=L*
// @include        */MH_Play/Play_a_Action.php*
// @include        */MH_Play/Play_equipement.php*
// @icon           https://games.mountyhall.com/favicon.ico
// @version        2.0
// @author         43406 - H2P
// @downloadURL https://update.greasyfork.org/scripts/21994/MH%20-%20H2P%20-%20Modifs%20interface.user.js
// @updateURL https://update.greasyfork.org/scripts/21994/MH%20-%20H2P%20-%20Modifs%20interface.meta.js
// ==/UserScript==

if (location.href.indexOf('Play_a_Action.php?type=L') != -1) {
  document.getElementById('auto').checked = true;
}

if (location.href.indexOf('Play_equipement.php') != -1) {
  javascript:toggle('#equip-troll','#equip-toggle');
}