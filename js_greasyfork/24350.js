// ==UserScript==
// @name         GW Nav Cleanup
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fixes the ugly and unnecessary nav buttons
// @author       You
// @match        http://game.galaxywarfare.com*
// @require     http://code.jquery.com/jquery-3.1.0.js
// @downloadURL https://update.greasyfork.org/scripts/24350/GW%20Nav%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/24350/GW%20Nav%20Cleanup.meta.js
// ==/UserScript==

(function() {
    'use strict';
var newNav  = document.createElement('div');
var promos = document.getElementById('promotions');
alerts.parentNode.insertBefore(newNav, promos.nextSibling);

naMod.innerHTML = '<div class="well well-small" id="fix">'
    
+  '<ul class="nav nav-tabs nav-stacked">'
+    '<li><a href="javascript:;: onclick="callWorkerForContent(\'universe\',\'\')"><i class="icon-th"></i> Galaxy</a></li>'
+    '<li><a href="javascript:;" onclick="callWorkerForContentNoScroll(\'quests\',\'\')"><i class="icon-check"></i> Quests</a></li>'
+'<li class="divider"></li>'
+    '<li><a href="javascript:;" onclick="callWorkerForContent(\'profile\',\'\')"><i class="icon-th"></i> Profile</a></li>'
+    '<li><a href="javascript:;" onclick="callWorkerForContentNoScroll(\'ship\',\'\')"><i class="icon-check"></i> Ship</a></li>'
+    '<li><a href="javascript:;" onclick="callWorkerForContentNoScroll(\'items\',\'\')"><i class="icon-check"></i> Items</a></li>'
+    '<li><a href="javascript:;" onclick="callWorkerForContentNoScroll(\'clan\',\'\')"><i class="icon-globe"></i> Fleet</a></li>'
+    '<li><a href="javascript:;" onclick="callWorkerForContent(\'messages\',\'\')"><i class="icon-th"></i> Messages</a></li>'
+    '<li><a href="javascript:;" onclick="callWorkerForContentNoScroll(\'buildings\',\'\')"><i class="icon-check"></i> Buildings</a></li>'
+    '<li><a href="javascript:;" onclick="callWorkerForContentNoScroll(\'options\',\'\')"><i class="icon-check"></i> Options</a></li>'
+'<li class="divider"></li>'
+    '<li><a href="javascript:;" onclick="callWorkerForContentNoScroll(\'auction\',\'\')"><i class="icon-check"></i> Auction <span id="ac"></span></a></li>'
+    '<li><a href="javascript:;" onclick="callWorkerForContentNoScroll(\'trade\',\'\')"><i class="icon-globe"></i> Trade Center <span id="tc"></span></a></li>'
+    '<li><a href="javascript:;" onclick="callWorkerForContent(\'shop\',\'\')"><i class="icon-th"></i> Store</a></li>'
+'<li class="divider"></li>'
+    '<li><a href="javascript:;" onclick="callWorkerForContentNoScroll(\'mostwanted\',\'\')"><i class="icon-globe"></i> Most Wanted</a></li>'
+    '<li><a href="javascript:;" onclick="callWorkerForContentNoScroll(\'factioncontrol\',\'\')"><i class="icon-check"></i> Faction Control</a></li>'
+    '<li><a href="javascript:;" onclick="callWorkerForContentNoScroll(\'clanlist\',\'\')"><i class="icon-check"></i> All Fleets</a></li>'
+    '<li><a href="javascript:;" onclick="callWorkerForContentNoScroll(\'racelb\',\'\')"><i class="icon-globe"></i> GWR</a></li>'
+'</div>'

+ '<style>li {font-size: 13px !important;}</style>';
    
    
var DeleteOldHGP = document.getElementById("navigation");
var DeleteSubWarp = document.getElementBtId("sub_warp");
    DeleteSubWarp.parentNode.removeChild(DeleteSubWarp);
	DeleteOldHGP.parentNode.removeChild(DeleteOldHGP);
})();