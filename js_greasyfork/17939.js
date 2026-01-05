// ==UserScript==
// @name         SG Discussion On Top
// @namespace    http://steamcommunity.com/id/Ruphine/
// @version      0.2.6
// @description  Make Active Discussions appears on top.
// @author       Ruphine
// @include      *://www.steamgifts.com/
// @include      *://www.steamgifts.com/giveaways/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17939/SG%20Discussion%20On%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/17939/SG%20Discussion%20On%20Top.meta.js
// ==/UserScript==

// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js WTF, this broke SG jquery

var Discussions = $(".widget-container--margin-top");
$(Discussions).css("margin-top", "0").css("margin-bottom", "20px");

if($(".pinned-giveaways__outer-wrap").length > 0)
	$(Discussions).insertBefore($(".pinned-giveaways__outer-wrap"));
else
	$(Discussions).insertBefore($(".widget-container>div>.page__heading")); //works fine but don't know why, it produce errors at console log