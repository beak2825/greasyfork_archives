// ==UserScript==
// @name         War Base Faction Highlighter
// @version      0.5
// @description  Highlights factions in the war based that are linked to in the faction announcement.
// @author       Ashkill94
// @match        http://http://www.torn.com/factions.php?step=your
// @grant        none
// @namespace    none
// @downloadURL https://update.greasyfork.org/scripts/19280/War%20Base%20Faction%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/19280/War%20Base%20Faction%20Highlighter.meta.js
// ==/UserScript==

$(function(){
    var flag = "fhbChecked";
    
	setInterval(function() {
		var a = $("#faction-main > .title-black").next("div.cont-gray10");
		if (a.length != 1 || a.attr(flag) != null) {
			return;
		}
        var fId, b;
        
        // Normal War Base
        $('.f-war-list > li > .status-wrap > .info > .name > a').each(function(i, ele) {
            fId = $(ele).attr("href").match(/factions\.php\?step=profile&ID=(\d+)/);
            if (fId) {
                b = $(ele).parentsUntil(".f-war-list").last().attr('factionId', fId[1]);
                $("> .desc-wrap > .status-desc", b).attr('factionId', fId[1]);
            }
		});
        
        // War Base Extended Compatibility
        $('.f-war-list > li > .status-desc > .f-right > .cont > .bold > a').each(function(i, ele) {
            fId = $(ele).attr("href").match(/factions\.php\?step=profile&ID=(\d+)/);
            if (fId) {
                b = $("> .status-desc", $(ele).parentsUntil(".f-war-list").last()).attr('factionId', fId[1]);
            }
		});
        
		var bonusFactions = a.find("a[href*='factions.php?step=profile&ID=']["+flag+"!=]").attr(flag, "");
		bonusFactions.each(function(i, ele) {
			var bonusFaction = $(ele);
			var id = bonusFaction.attr("href").match(/factions\.php\?step=profile&ID=(\d+)/);
            if (id) {
                console.debug("Bonus faction found! "+id[1]);
                $("[factionId='"+id[1]+"'").css("background-color", "red");
            }
		});
		
		a.attr(flag, "")
	}, 500);
});