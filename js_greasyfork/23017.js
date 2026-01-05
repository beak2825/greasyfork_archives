// ==UserScript==
// @name        GW Navigation Mod
// @include     http://game.galaxywarfare.com*
// @description Changes the GW Navigation bars to better suit my needs.
// @version     Beta 1.1.1
// @require     http://code.jquery.com/jquery-3.1.0.js
// @namespace   https://greasyfork.org/users/26728
// @downloadURL https://update.greasyfork.org/scripts/23017/GW%20Navigation%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/23017/GW%20Navigation%20Mod.meta.js
// ==/UserScript==

var naMod  = document.createElement  ('div')    ;
var alerts = document.getElementById ('alerts') ;
	alerts.parentNode.insertBefore (naMod, alerts.nextSibling)    ;

naMod.innerHTML = '<div class="well well-small" id="mod">'

+ '<ul class="nav nav-tabs nav-stacked">'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'universe\',\'\');"><i class="icon-chevron-right"></i> Galaxy</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'clan\',\'\');"><i class="icon-chevron-right"></i> Fleet</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'matchlist\',\'\');"><i class="icon-chevron-right"></i> Training</a></li>'
+ '</ul><ul class="nav nav-tabs nav-stacked">'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'items\',\'\');"><i class="icon-chevron-right"></i> My Items</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'ship\',\'\');"><i class="icon-chevron-right"></i> My Ship</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'buildings\',\'\');"><i class="icon-chevron-right"></i> My Buildings</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'bots\',\'\');"><i class="icon-chevron-right"></i> My Bots</a></li>'
+ '</ul><ul class="nav nav-tabs nav-stacked">'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'shop\',\'\');"><i class="icon-shopping-cart"></i> Shop</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'auction\',\'\');"><i class="icon-shopping-cart"></i> Auction <span id=\'ac\'></span></a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'trade\',\'\');"><i class="icon-shopping-cart"></i> Trade Center <span id=\'tc\'></span></a></li>'
+ '</ul><ul class="nav nav-tabs nav-stacked">'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'messages\',\'\');"><i class="icon-envelope"></i> Messages <span id=\'umc\'></span></a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'log\',\'\');"><i class="icon-list"></i> Captain\'s Log</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'options\',\'\');"><i class="icon-cog"></i> Options</a></li>'
+   '<li><a href="http://game.galaxywarfare.com/index.php?logout=1"><i class="icon-off"></i> Log Out</a></li>'
+ '</ul><ul class="nav nav-tabs nav-stacked">'
+   '<li><a href="javascript:;" onclick=\"$(\'#logs\').toggle(\'fast\');\"><i class="icon-chevron-down"></i> Logs</a></li>'
+ '</ul><ul id="logs" class="nav nav-tabs nav-stacked" style="display: none;">'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'battles\',\'\');"><i class="icon-tasks"></i> Battle Log</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'missionlog\',\'\');"><i class="icon-tasks"></i> Mission Log</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'warps\',\'\');"><i class="icon-tasks"></i> Warp Log</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'tokenspending\',\'\');"><i class="icon-tasks"></i> Token Log</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'auctions\',\'\');"><i class="icon-tasks"></i> Auction Log</a></li>'
+ '</ul><ul class="nav nav-tabs nav-stacked">'
+   '<li><a href="javascript:;" onclick=\"$(\'#other\').toggle(\'fast\');\"><i class="icon-chevron-down"></i> Other</a></li>'
+ '</ul><ul id="other" class="nav nav-tabs nav-stacked" style="display: none;">'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'factioncontrol\',\'\');"><i class="icon-chevron-right"></i> Faction Control</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'achievementlist\',\'\');"><i class="icon-chevron-right"></i> Achievements</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'mostwanted\',\'\');"><i class="icon-chevron-right"></i> Most Wanted</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'seasons\',\'\');"><i class="icon-chevron-right"></i> Seasons</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'hof\',\'\');"><i class="icon-chevron-right"></i> Hall of Fame</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'customships\',\'\');"><i class="icon-chevron-right"></i> Custom Ships</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'staff\',\'\');"><i class="icon-chevron-right"></i> Staff List</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'racelb\',\'\');"><i class="icon-chevron-right"></i> Races</a></li>'
+ '</ul><ul class="nav nav-tabs nav-stacked">'
+   '<li><a href="javascript:;" onclick=\"$(\'#db\').toggle(\'fast\');\"><i class="icon-chevron-down"></i> Daily Bests</a></li>'
+ '</ul><ul id="db" class="nav nav-tabs nav-stacked" style="display: none;">'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'dailybests\',\'&type=exp\');"><i class="icon-ok-circle"></i> EXP</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'dailybests\',\'&type=credits\');"><i class="icon-ok-circle"></i> Credits</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'dailybests\',\'&type=solo_games\');"><i class="icon-ok-circle"></i> Battles</a></li>'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'dailybests\',\'&type=solo_wins\');"><i class="icon-ok-circle"></i> Destroyed</a></li>'
+ '</ul>'
+ '</div>'

+ '<style>li {font-size: 13px !important;}</style>';

// onclick=\"$('#pu').toggle('fast');\"

var DeleteOldHGP = document.getElementById("navigation");
	DeleteOldHGP.parentNode.removeChild(DeleteOldHGP);