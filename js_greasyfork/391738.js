// ==UserScript==
// @name         VisionGlasses
// @namespace    Dreadcast
// @version      2.3
// @description  Those glasses contain cutting edge technology to see better in dreadcast's smog
// @author       Aetadone
// @match        https://www.dreadcast.net/Main*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/391738/VisionGlasses.user.js
// @updateURL https://update.greasyfork.org/scripts/391738/VisionGlasses.meta.js
// ==/UserScript==
var jQuery = window.jQuery;
function putGlassesOn(){
  var sep='<li class="separator"></li>';
  var T1='<li id="tool_brouillard" class="link couleur5" onclick="jQuery(\'#brouillard\').remove();jQuery(\'#brouillard2\').remove();jQuery(\'#tool_brouillard\').css({\'color\': \'red\', \'font-size\': \'75%\' });">Anti-bué</li>';
  var T2='<li id="tool_pluie" class="link couleur5" onclick="jQuery(\'#pluie\').remove();jQuery(\'#pluie2\').remove();jQuery(\'#tool_pluie\').css({\'color\': \'red\', \'font-size\': \'75%\' });">Essuis-Glaces</li>';
  var T3='<li id="tool_alert" class="link couleur5" onclick="jQuery(\'#zone_evilBox\').remove();jQuery(\'#tool_alert\').css({\'color\': \'red\', \'font-size\': \'75%\' });">Sourdine</li>';
	jQuery('#bandeau ul.menus').prepend(sep+T1+T2+T3+sep);  
  
}
jQuery(document).ready(putGlassesOn());