// ==UserScript==
// @name          Eternity Tower Stats
// @icon          https://www.eternitytower.net/favicon.png
// @namespace     http://mean.cloud/
// @version       1.32
// @description   Adds various stats to the Eternity Tower game
// @match         *://eternitytower.net/*
// @match         *://www.eternitytower.net/*
// @match         http://localhost:3000/*
// @author        psouza4@gmail.com
// @copyright     2017-2023, MeanCloud
// @run-at        document-end
// @grant         GM_getValue
// @grant         GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/33423/Eternity%20Tower%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/33423/Eternity%20Tower%20Stats.meta.js
// ==/UserScript==


////////////////////////////////////////////////////////////////
////////////// ** SCRIPT GLOBAL INITIALIZATION ** //////////////
function startup() { ET_StatsUIMod(); }
ET_Stat_UserID = "";
ET_Stat_CombatID = "";
ET_Stat_CritChance = 0;
ET_Stat_CritDamage = 0;
ET_Stat_HealingPower = 0;
ET_Stat_DamageTaken = 0;
ET_Stat_MP = 0;
ET_JustExpanded = false;
ET_LastModal = null;
ET_LastForm = null;
////////////////////////////////////////////////////////////////


ET_StatsUIMod = function()
{
    ET.MCMF.Ready(function()
    {
        //ET.MCMF.WantDebug = true;

        Meteor.connection._stream.on('message', function(sMeteorRawData)
        {
            try
            {
                var oMeteorData = JSON.parse(sMeteorRawData);

                if (oMeteorData.collection == "users")
                {
                    //console.log(oMeteorData);

                    ET_Stat_UserID = oMeteorData.id;
                }

                if (oMeteorData.collection == "combat")
                    if ((oMeteorData.fields.owner === ET_Stat_UserID) &&( ET_Stat_CombatID === ""))
                        ET_Stat_CombatID = oMeteorData.id;

                if (oMeteorData.collection == "combat")
                {
                    if ((oMeteorData.fields.owner === ET_Stat_UserID) || (oMeteorData.id === ET_Stat_CombatID))
                    {
                        //console.log(oMeteorData);

                        ET_Stat_CritChance = oMeteorData.fields.stats.criticalChance;
                        ET_Stat_CritDamage = oMeteorData.fields.stats.criticalDamage;
                        ET_Stat_HealingPower = oMeteorData.fields.stats.healingPower;
                        ET_Stat_DamageTaken = oMeteorData.fields.stats.damageTaken;
                        ET_Stat_MP = oMeteorData.fields.stats.magicPower;

                        /*
                        var oHPEl = jQ("div.bg-danger").parent().parent().find("div.d-flex > i.extra-small-icon").parent();

                        if (jQ("#PET_DemonMaxHP").length === 0)
                            oHPEl.append("<span id=\"PET_DemonMaxHP\" style=\"white-space: nowrap; font-size: 9pt;\"></span>");

                        jQ("#PET_DemonMaxHP").html("&nbsp;&nbsp;(demon &lt; " + ((oMeteorData.fields.stats.healthMax * 0.2) + 1).toFixed(0) + ")");
                        */
                    }
                }
            }
            catch (err) { }
        });
    });

    ET.MCMF.Loaded(function()
    {
        ET.MCMF.StatsUIMod = { };

        ET.MCMF.StatsUIMod.WantAdventureLoot = (GM_getValue("PETStatusUI_WantAdventureLoot") !== false); // default true
        //GM_setValue("PETSearch_Color",     jQ("#PETSItemColor")  .is(":checked"));

    	// Set background tasks
        ET_StatsUIMod_DPSShow();
    });
};

ET_StatsUIMod_GetAdventure = function(sMatchID)
{
    // oAdventure
    //    .duration
    //    .endDate
    //    .floor
    //    .icon
    //    .id
    //    .length
    //    .level
    //    .name
    //    .room
    //    .type
    //    .startDate
    var oAdventureData;

	[...Package.meteor.global.Accounts.connection._stores.adventures._getCollection()._collection._docs._map.values()][0].adventures.forEach(function(oAdventure)
    {
        try
        {
            if (oAdventure.id === sMatchID)
                oAdventureData = oAdventure;
        }
        catch (err) { }
    });

    return oAdventureData;
};

var sETStatsDB = "";
var ETStatsDB_PQ = [];
var ETStatsDB_Tower = [];

ET_StatsUIMod_ConvertItemIDToImage = function(sItemID)
{
    var s = sItemID;

    var sExt = ".svg";

    if (endsWith(s, "_essence")) sExt = ".png";
    if (endsWith(s, "_shield")) sExt = ".png";
    if (endsWith(s, "_scimitar")) sExt = ".png";
    if (endsWith(s, "_broad_sword")) sExt = ".png";
    if (endsWith(s, "_plate") && (s !== "opal_chest_plate")) sExt = ".png";
    if (s.indexOf("_wizard") !== -1) sExt = ".png";
    if (endsWith(s, "_battle_axe")) sExt = ".png";
    if (endsWith(s, "_long_sword")) sExt = ".png";
    if (endsWith(s, "_helm")) sExt = ".png";
    if (endsWith(s, "_knife")) sExt = ".png";
    if (endsWith(s, "_wand")) sExt = ".png";
    if (endsWith(s, "_spear")) sExt = ".png";
    if (endsWith(s, "_rapiers")) sExt = ".png";
    if (endsWith(s, "_dagger")) sExt = ".png";
    if (endsWith(s, "_log")) sExt = ".png";
    if (startsWith(s, "ore_")) { s = s.substr(4); sExt = ".png"; }
    if (startsWith(s, "poison_shard")) sExt = ".png";
    if (startsWith(s, "fire_shard")) sExt = ".png";
    if (startsWith(s, "earth_shard")) sExt = ".png";
    if (startsWith(s, "air_shard")) sExt = ".png";
    if (startsWith(s, "water_shard")) sExt = ".png";

    if (s.indexOf("_tome") !== -1) s = "tome";

    while (s.indexOf("broad_sword") !== -1) s = s.replace("broad_sword", "broadsword");

    while (s.indexOf("_a") !== -1) s = s.replace("_a", "A");
    while (s.indexOf("_b") !== -1) s = s.replace("_b", "B");
    while (s.indexOf("_c") !== -1) s = s.replace("_c", "C");
    while (s.indexOf("_d") !== -1) s = s.replace("_d", "D");
    while (s.indexOf("_e") !== -1) s = s.replace("_e", "E");
    while (s.indexOf("_f") !== -1) s = s.replace("_f", "F");
    while (s.indexOf("_g") !== -1) s = s.replace("_g", "G");
    while (s.indexOf("_h") !== -1) s = s.replace("_h", "H");
    while (s.indexOf("_i") !== -1) s = s.replace("_i", "I");
    while (s.indexOf("_j") !== -1) s = s.replace("_j", "J");
    while (s.indexOf("_k") !== -1) s = s.replace("_k", "K");
    while (s.indexOf("_l") !== -1) s = s.replace("_l", "L");
    while (s.indexOf("_m") !== -1) s = s.replace("_m", "M");
    while (s.indexOf("_n") !== -1) s = s.replace("_n", "N");
    while (s.indexOf("_o") !== -1) s = s.replace("_o", "O");
    while (s.indexOf("_p") !== -1) s = s.replace("_p", "P");
    while (s.indexOf("_q") !== -1) s = s.replace("_q", "Q");
    while (s.indexOf("_r") !== -1) s = s.replace("_r", "R");
    while (s.indexOf("_s") !== -1) s = s.replace("_s", "S");
    while (s.indexOf("_t") !== -1) s = s.replace("_t", "T");
    while (s.indexOf("_u") !== -1) s = s.replace("_u", "U");
    while (s.indexOf("_v") !== -1) s = s.replace("_v", "V");
    while (s.indexOf("_w") !== -1) s = s.replace("_w", "W");
    while (s.indexOf("_x") !== -1) s = s.replace("_x", "X");
    while (s.indexOf("_y") !== -1) s = s.replace("_y", "Y");
    while (s.indexOf("_z") !== -1) s = s.replace("_z", "Z");
    s = s.split('_').join('');

    s = s + sExt;

    return s;
};

ET_StatsUIMod_GetDropsForTower = function(iFloor, iRoom)
{
    var sResults = "";

    try
    {
        if (ETStatsDB_Tower[iFloor][iRoom] !== undefined)
        {
            jQuery.makeArray(ETStatsDB_Tower[iFloor][iRoom]).forEach(function(dropInfo)
            {
                try
                {
                    //if (sResults !== "") sResults += ", ";
                    //sResults += dropInfo.name + " (" + dropInfo.percent.toString() + "%)";

                    var s = ET_StatsUIMod_ConvertItemIDToImage(dropInfo.name);

                    var sHover = dropInfo.name + " (" + dropInfo.percent.toString() + "%)";
                    //sResults += "<img src=\"/icons/" + s + "\" class=\"ml-1 extra-small-icon\" />";
                    sResults += "<img src=\"/icons/" + s + "\" style=\"width: 24px; height: 24px; font-size: 24px; line-height: 24px;\" alt=\"" + sHover + "\" title=\"" + sHover + "\">";
                }
                catch (err) { }
            });
        }
    }
    catch (err) { }

    return sResults;
};

ET_StatsUIMod_LoadETStatsDatabase = function()
{
    if (sETStatsDB !== "")
        return;

    try
    {
        sETStatsDB = "busy";

        jQ.get("https://www.damned.cloud/ETStats/", function(data)
        {
            try
            {
                // don't hold bad data
                if (data.indexOf("Level 50-54") === -1)
                {
                    sETStatsDB = "";
                    return;
                }

                sETStatsDB = data;
                ETStatsDB_PQ = [];
                ETStatsDB_Tower = [];

                //console.log("ET Stats loaded!");
                //console.log(sETStatsDB);

                let rawPQData = ChopperBlank(sETStatsDB, "<pre>", "Tower").trim().split("Level ");

                //ETStatsDB_Tower
                jQuery.makeArray(rawPQData).forEach(function(rawPQChunk)
                {
                    //console.log("Raw PQ chunk: " + rawPQChunk.trim());

                    let iRangeStart = 0;
                    let iRangeEnd = 0;

                    jQuery.makeArray(rawPQChunk.trim().split("\n")).forEach(function(rawPQLine, idx, arr)
                    {
                        try
                        {
                            rawPQLine = rawPQLine.trim();

                            //console.log(idx.toString() + " :: " + rawPQLine);

                            if (idx === 0)
                            {
                                iRangeStart = CInt(ChopperBlank(rawPQLine, "",  "-"));
                                iRangeEnd   = CInt(ChopperBlank(rawPQLine, "-", " "));
                            }
                            else if ((iRangeStart > 0) && (iRangeEnd > 0))
                            {
                                let temp_Percent = CDbl(ChopperBlank(rawPQLine, "", "%"));
                                let temp_Name    = ChopperBlank(rawPQLine, " - ", " (").trim();

                                let oDataObj = { name: temp_Name, percent: temp_Percent };

                                for (let i = iRangeStart; i <= iRangeEnd; i++)
                                {
                                    if (ETStatsDB_PQ[i] === undefined)
                                        ETStatsDB_PQ[i] = [];

                                    ETStatsDB_PQ[i].push(oDataObj);
                                }

                                //console.log("PQ data recorded: L" + iRangeStart.toString() + "-L" + iRangeEnd.toString() + " " + JSON.stringify(oDataObj));
                            }
                        }
                        catch (err)
                        {
                            console.log("PQ line parse failure: " + JSON.stringify(err));
                        }
                    });
                });

                let rawTowerData = ChopperBlank(sETStatsDB, "Tower F0R0", "</pre>").trim().split("Tower ");

                //ETStatsDB_Tower
                jQuery.makeArray(rawTowerData).forEach(function(rawTowerChunk)
                {
                    let iFloor = CInt(ChopperBlank(rawTowerChunk, "F", "R"));
                    let iRoom  = CInt(ChopperBlank(rawTowerChunk, "R", " - "));

                    // don't hold data for full tower floor runs or any invalid data
                    if ((iFloor === 0) || (iRoom === 0))
                        return;

                    jQuery.makeArray(rawTowerChunk.trim().split("\n")).forEach(function(rawTowerLine, idx, arr)
                    {
                        try
                        {
                            rawTowerLine = rawTowerLine.trim();

                            //console.log(idx.toString() + " :: " + rawTowerLine);

                            if (idx === 0)
                                return;

                            let temp_Percent = CDbl(ChopperBlank(rawTowerLine, "", "%"));
                            let temp_Name    = ChopperBlank(rawTowerLine, " - ", " (").trim();

                            let oDataObj = { name: temp_Name, percent: temp_Percent };

                            if (ETStatsDB_Tower[iFloor] === undefined)
                                ETStatsDB_Tower[iFloor] = [];
                            if (ETStatsDB_Tower[iFloor][iRoom] === undefined)
                                ETStatsDB_Tower[iFloor][iRoom] = [];

if (iFloor == 1) {
	if (temp_Name == "ore_tungsten") {
		return;
	}
}

                            ETStatsDB_Tower[iFloor][iRoom].push(oDataObj);

                            //console.log("Tower data recorded: F" + iFloor.toString() + "R" + iRoom.toString() + " " + JSON.stringify(oDataObj));
                        }
                        catch (err)
                        {
                            console.log("Tower line parse failure: " + JSON.stringify(err));
                        }
                    });
                });

                let i;

                for (i = 0; i <= 1000; i++)
                {
                    if (ETStatsDB_PQ[i] !== undefined)
                    {
                        //console.log("PQ L" + i.toString() + " sorted!");

                        ETStatsDB_PQ[i].sort(function(dropInfo_a, dropInfo_b)
                        {
                            if (dropInfo_a.percent > dropInfo_b.percent) return -1;
                            if (dropInfo_a.percent < dropInfo_b.percent) return 1;
                            return 0;
                        });
                    }
                }

                for (i = 0; i <= 30; i++)
                {
                    if (ETStatsDB_Tower[i] !== undefined)
                    {
                        for (let j = 0; j <= 30; j++)
                        {
                            if (ETStatsDB_Tower[i][j] !== undefined)
                            {
                                //console.log("Tower F" + i.toString() + "R" + j.toString() + " sorted!");

                                ETStatsDB_Tower[i][j].sort(function(dropInfo_a, dropInfo_b)
                                {
                                    if (dropInfo_a.percent > dropInfo_b.percent) return -1;
                                    if (dropInfo_a.percent < dropInfo_b.percent) return 1;
                                    return 0;
                                });
                            }
                        }
                    }
                }
            }
            catch (err) { sETStatsDB = ""; }
        });
    }
    catch (err) { }
};

ET_StatsUIMod_DPSShow = function()
{
	var i = 0;
	var oStatLines = null;
	var sBareDamageRange = "";
	var sBareAttackSpeed = "";
	var sBareCriticalChance = "";
	var dDamageMin = 0.0;
	var dDamageMax = 0.0;
	var sDamagePartMin = "";
	var sDamagePartMax = "";
	var dAverageDamageAvgQuality = 0.0;
	var dAverageDamageMaxQuality = 0.0;
	var sThisLine = "";
	var sThisLineText = "";
	var dAttackSpeed = 0.0;
	var dActualDPSAverageQuality = 0.0;
	var dActualDPSMaxQuality = 0.0;
	var dCriticalChance = 0.0;

    ///////////////////////////////////////////////////////////////////////////////////////
    //
    //  Adventure Details
    //
    ET_StatsUIMod_LoadETStatsDatabase(); // loads on demand

    try
    {
        // Options
        if ((ET.MCMF.GetActiveTab() === "combat") /* && (ET.MCMF.GetActiveTabSection() === "adventures") */)
        {
            if (jQ("div.PETStatusUI_Menu").length === 0)
            {
                var oTemp = jQ(jQ("body div.body-content div div div div[style=\"margin-bottom: 5px;\"]").get(0));
                if (oTemp.text().trim() == "Buy adventure"); // sanity check
                {
                    oTemp = oTemp.parent();

                    oTemp.before("<div class=\"PETStatusUI_Menu d-flex flex-row flex-wrap\"></div>");
                    oTemp.appendTo("div.PETStatusUI_Menu");

                    oTemp = jQ("div.PETStatusUI_Menu");

                    oTemp.prepend
                    (
                        "<div>" +
                        "<div style=\"margin-bottom: 5px;\">Options</div>" +
                        "<button class=\"buy-new-adventure btn btn-secondary PETStatusUI_btnShowHideLoot\">Loot: " + ((ET.MCMF.StatsUIMod.WantAdventureLoot) ? "Shown" : "Hidden")  + "</button>" +
                        "</div>"
                    );

                    oTemp.children("div").addClass("d-flex flex-column my-1 mx-1");
                    oTemp.find("button").css("height", "40px").css("max-height", "40px").css("line-height", "24px"); // normalize the button heights

                    jQ(".PETStatusUI_btnShowHideLoot").click(function()
                    {
                        ET.MCMF.StatsUIMod.WantAdventureLoot = !ET.MCMF.StatsUIMod.WantAdventureLoot;
                        GM_setValue("PETStatusUI_WantAdventureLoot", ET.MCMF.StatsUIMod.WantAdventureLoot);
                        jQ(".PETStatusUI_btnShowHideLoot").text((ET.MCMF.StatsUIMod.WantAdventureLoot) ? "Loot: Shown" : "Loot: Hidden");
                    });
                }
            }

            // Adventure loot lines
            if (ET.MCMF.StatsUIMod.WantAdventureLoot)
            {
                jQ("div.PETSDetails_error").remove();

                jQ("div.adventure-item-container").each(function()
                {
                    try
                    {
                        var sAdvID = jQ(this).find("button").attr("data-id");

                        var oAdventureData = ET_StatsUIMod_GetAdventure(sAdvID);

                        if (jQ(this).find("div.PETSDetails_success").length > 0)
                            return;

                        jQ(this).find("div.PETSDetails").remove();

                        var sLoot = ET_StatsUIMod_GetDropsForTower(oAdventureData.floor, oAdventureData.room);

                        if (sLoot !== "")
                        {
                            jQ(this).append("<div class=\"d-flex PETSDetails PETSDetails_success\"><div class=\"d-flex\" style=\"margin-left: 60px;\">" + sLoot + "</div></div>\r\n");
                        }
                        else
                        {
                            jQ(jQ(this).find("div.ml-3").get(0)).append("<div class=\"PETSDetails PETSDetails_error\">(no loot from F" + oAdventureData.floor.toString() + "R" + oAdventureData.room.toString() + ")</div>\r\n");
                            //jQ(jQ(this).find("div.mx-3").get(0)).append("<div class=\"PETSDetails PETSDetails_error\"><a target=\"_blank\" href=\"http://etstats.com/debug.html\">ETStats Loot List</a></div>\r\n");
                        }
                    }
                    catch (err) { }
                });
            }
            else
                jQ(".PETSDetails").remove();
        }
        else
        {
            jQ("div.PETStatusUI_Menu").remove();
        }
    }
    catch (err) { ET.MCMF.Log(err); }


    //
    ///////////////////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////////////////
    //
    //  Stat Descriptions
    //
    jQ(".PeteUI_TooltipStat").remove();
    // Removed: this is baked into the actual game now
    /*
    jQ("div.item-tooltip-content div i.lilIcon-attackSpeed").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;attacks per second</span>");
    jQ("div.item-tooltip-content div i.lilIcon-accuracy").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;accuracy</span>");
    jQ("div.item-tooltip-content div i.lilIcon-criticalChance").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;crit. chance</span>");
    jQ("div.item-tooltip-content div i.lilIcon-healthMax").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;max. health</span>");
    jQ("div.item-tooltip-content div i.lilIcon-defense").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;dodge (defense)</span>");
    jQ("div.item-tooltip-content div i.lilIcon-armor").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;physical armor</span>");
    jQ("div.item-tooltip-content div i.lilIcon-magicPower").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;magic power</span>");
    jQ("div.item-tooltip-content div i.lilIcon-magicArmor").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;magic armor</span>");
    jQ("div.item-tooltip-content div i.lilIcon-healingPower").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;increased healing %</span>");
    jQ("form.craft-amount-form div.modal-body > div i.lilIcon-attackSpeed").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;attacks per second</span>");
    jQ("form.craft-amount-form div.modal-body > div i.lilIcon-accuracy").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;accuracy</span>");
    jQ("form.craft-amount-form div.modal-body > div i.lilIcon-criticalChance").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;crit. chance</span>");
    jQ("form.craft-amount-form div.modal-body > div i.lilIcon-healthMax").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;max. health</span>");
    jQ("form.craft-amount-form div.modal-body > div i.lilIcon-defense").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;dodge (defense)</span>");
    jQ("form.craft-amount-form div.modal-body > div i.lilIcon-armor").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;physical armor</span>");
    jQ("form.craft-amount-form div.modal-body > div i.lilIcon-magicPower").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;magic power</span>");
    jQ("form.craft-amount-form div.modal-body > div i.lilIcon-magicArmor").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;magic armor</span>");
    jQ("form.craft-amount-form div.modal-body > div i.lilIcon-healingPower").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;increased healing %</span>");
    */
    //
    ///////////////////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////////////////
    //
    //  Woodcutters
    //
    jQ("div.item-tooltip-content").each(function()
    {
        try
        {
            if (jQ(this).find("div.PeteUI_TooltipStatWC").length === 0)
            {
                if (jQ(this).html().toLowerCase().indexOf("lumber jack") !== -1)
                {
                    jQ(this).find("div i.lilIcon-attack").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;wood cut tier</span>");
                    jQ(this).find("div i.lilIcon-attackSpeed").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;attacks per second</span>");
                    jQ(this).find("div i.lilIcon-accuracy").parent().append("<span class=\"PeteUI_TooltipStat\">&nbsp;accuracy</span>");
                }
            }
        }
        catch (err) { }
    });
    //
    ///////////////////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////////////////
    //
    //  Crafting Recipes
    //
	try
	{
		if (jQ("a.show-stats").length > 0)
		{
			ET_LastForm = jQ("a.show-stats").parent().parent();
			ET_LastModal = ET_LastForm.parent().parent().parent();

			jQ("a.show-stats")[0].click(); // auto-expand base stats for crafting ranges (needed anyway to calculate extra stats)
			ET_JustExpanded = true;
		}

		if ((ET_LastModal !== null) && (ET_LastModal.hasClass("show")) && (ET_JustExpanded === true))
		{
			var oForm = ET_LastForm;
			//oForm = jQ("form.craft-amount-form");

			if (oForm.html().indexOf("Hide Stat Range") !== -1)
			{
				oStatLines = oForm.find("div.modal-body > div");

				for (i = 1; i < oStatLines.length; i++)
				{
					sThisLine = jQ(oStatLines.get(i)).html().trim();
					sThisLineText = jQ(oStatLines.get(i)).text().trim();

					if ((sThisLine.indexOf("lilIcon-attack ") !== -1) && (sThisLine.indexOf(" - ") === -1))
						continue;

					if     ((sThisLine.indexOf("lilIcon-attack ")         !== -1) && (sBareDamageRange === "")) sBareDamageRange = sThisLineText + " [[#" + i.toString() + "]]";
					else if (sThisLine.indexOf("lilIcon-attackSpeed ")    !== -1) sBareAttackSpeed = sThisLineText + " [[#" + i.toString() + "]]";
					else if (sThisLine.indexOf("lilIcon-criticalChance ") !== -1) sBareCriticalChance = sThisLineText + " [[#" + i.toString() + "]]";
				}

				//console.log("******************BEGIN******************");
				//console.log("Bare DPS: " + sBareDamageRange);
				//console.log("Bare attack speed: " + sBareAttackSpeed);
				//console.log("Bare crit chance: " + sBareCriticalChance);
				//console.log("*******************END*******************");

                sBareDamageRange    = ChopperBlank(sBareDamageRange.replace(' attack', '').replace(' damage', '') + "\n", "", "\n").trim();
                sBareAttackSpeed    = ChopperBlank(sBareAttackSpeed.replace(' attack speed', '') + "\n", "", "\n").trim();
                sBareCriticalChance = ChopperBlank(sBareCriticalChance.replace(' critical chance', '') + "\n", "", "\n").trim();

				//console.log("******************BEGIN******************");
				//console.log("Bare DPS: " + sBareDamageRange);
				//console.log("Bare attack speed: " + sBareAttackSpeed);
				//console.log("Bare crit chance: " + sBareCriticalChance);
				//console.log("*******************END*******************");

				if (sBareDamageRange.indexOf("(") !== -1)
				{
					sDamagePartMin = ChopperBlank(sBareDamageRange, "", ") - (") + ")";
					sDamagePartMax = "(" + ChopperBlank(sBareDamageRange, ") - (", "");

					var dDamageRangeLow1 = CDbl(ChopperBlank(sDamagePartMin, "(", " - ").trim());
					var dDamageRangeLow2 = CDbl(ChopperBlank(sDamagePartMin, " - ", ")").trim());
					dDamageMin = (dDamageRangeLow1 + dDamageRangeLow2) / 2.0;
					var dDamageRangeHigh1 = CDbl(ChopperBlank(sDamagePartMax, "(", " - ").trim());
					var dDamageRangeHigh2 = CDbl(ChopperBlank(sDamagePartMax, " - ", ")").trim());
					dDamageMax = (dDamageRangeHigh1 + dDamageRangeHigh2) / 2.0;

					dAverageDamageMaxQuality = ((dDamageRangeHigh2 - dDamageRangeLow2) / 2.0) + dDamageRangeLow2;
				}
				else
				{
					sDamagePartMin = ChopperBlank(sBareDamageRange, "", " - ");
					sDamagePartMax = ChopperBlank(sBareDamageRange, " - ", "");

					dDamageMin = CDbl(sDamagePartMin);
					dDamageMax = CDbl(sDamagePartMax);

					dAverageDamageMaxQuality = ((dDamageMax - dDamageMin) / 2.0) + dDamageMin;
				}

				dAverageDamageAvgQuality = ((dDamageMax - dDamageMin) / 2.0) + dDamageMin;

				dAttackSpeed = CDbl(sBareAttackSpeed);
				dCriticalChance = CDbl(sBareCriticalChance);

				if (dCriticalChance > 0.0)
				{
					dAverageDamageAvgQuality += dAverageDamageAvgQuality * (dCriticalChance / 100.0);
					dAverageDamageMaxQuality += dAverageDamageMaxQuality * (dCriticalChance / 100.0);
				}

				dActualDPSAverageQuality = dAverageDamageAvgQuality * dAttackSpeed;
				dActualDPSMaxQuality = dAverageDamageMaxQuality * dAttackSpeed;

                if (!isNaN(dActualDPSAverageQuality))
                {
                    oForm.find("div.modal-body").append
                    (
                        "<div class=\"d-flex flex-wrap\"></div><b>Rated Damage at 50% Quality</b>\r\n" +
                        "<div class=\"d-flex flex-wrap\"><b class=\"lilIcon-attack extra-small-icon mx-1\"></b> " + dAverageDamageAvgQuality.toFixed(1) + " (per hit / base damage for abilities)</div>\r\n" +
                        "<div class=\"d-flex flex-wrap\"><b class=\"lilIcon-attackSpeed extra-small-icon mx-1\"></b> " + dActualDPSAverageQuality.toFixed(1) + " (per second / DPS)</div>\r\n" +
                        "<b>Rated Damage at 100% Quality</b>\r\n" +
                        "<div class=\"d-flex flex-wrap\"><b class=\"lilIcon-attack extra-small-icon mx-1\"></b> " + dAverageDamageMaxQuality.toFixed(1) + " (per hit / base damage for abilities)</div>\r\n" +
                        "<div class=\"d-flex flex-wrap\"><b class=\"lilIcon-attackSpeed extra-small-icon mx-1\"></b> " + dActualDPSMaxQuality.toFixed(1) + " (per second / DPS)</div>\r\n"
                    );
                }

				ET_JustExpanded = false;
			}
		}
	}
	catch (err) { console.log("ERROR: " + err); }
    //
    ///////////////////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////////////////
    //
    //  Item Hover Tooltips (Combat > Equipment & Stats, Wodcutting, viewing profiles, etc.)
    //
	try
	{
		jQ("div.item-tooltip-content").each(function()
        {
            if (jQ(this).find("div.PeteUI_TooltipExp").length !== 0)
				return;

			sBareDamageRange = "";
			sBareAttackSpeed = "";
			sBareAccuracy = "";
			sBareCriticalChance = "";
            sBareEnergyPerHit = "";
            sBareEnergyRegen = "";
            var bIsWoodcutter = false;

			oStatLines = jQ(this).find("div > div");

			for (i = 0; i < oStatLines.length; i++)
			{
				sThisLine = jQ(oStatLines.get(i)).html().trim();
				sThisLineText = jQ(oStatLines.get(i)).text().trim();

        if (sThisLine.indexOf('<div class="d-flex align-items-center">') !== -1) {
          continue;
        }

                //console.log("DEBUG::" + sThisLine.replaceAll('\r', '').replaceAll('\n', '\\n'));
                //console.log("DEBUG::" + sThisLineText.replaceAll('\r', '').replaceAll('\n', '\\n'));

				if      ((sThisLine.indexOf("lilIcon-attack ")         !== -1) && (sThisLine.indexOf(" - ") !== -1) && (sBareDamageRange === "")) sBareDamageRange = sThisLineText + " [[#" + i.toString() + "]]";
				else if ((sThisLine.indexOf("lilIcon-attack ")         !== -1) && (sThisLine.indexOf("wood cut tier") !== -1) && (sBareDamageRange === "")) { bIsWoodcutter = true; sBareDamageRange = ChopperBlank(sThisLineText, "", "wood cut tier").trim() + " - " + ChopperBlank(sThisLineText, "", "wood cut tier").trim() + " [[#" + i.toString() + "]]"; }
				else if ((sThisLine.indexOf("lilIcon-attack ")         !== -1) && (sThisLine.indexOf(" - ") === -1) && (sBareDamageRange === "")) { bIsWoodcutter = true; sBareDamageRange = sThisLineText + " - " + sThisLineText + " [[#" + i.toString() + "]]"; }
				else if  (sThisLine.indexOf("lilIcon-attackSpeed ")    !== -1) sBareAttackSpeed = sThisLineText + " [[#" + i.toString() + "]]";
				else if  (sThisLine.indexOf("lilIcon-accuracy ")       !== -1) sBareAccuracy = sThisLineText + " [[#" + i.toString() + "]]";
				else if  (sThisLine.indexOf("lilIcon-criticalChance ") !== -1) sBareCriticalChance = sThisLineText + " [[#" + i.toString() + "]]";
				else if  (sThisLine.indexOf("lilIcon-energyPerHit ")   !== -1) sBareEnergyPerHit = sThisLineText + " [[#" + i.toString() + "]]";
				else if  (sThisLine.indexOf("lilIcon-energyRegen ")    !== -1) sBareEnergyRegen = sThisLineText + " [[#" + i.toString() + "]]";
			}

            //console.log("******************BEGIN******************");
            //console.log("Bare DPS: " + sBareDamageRange);
            //console.log("Bare attack speed: " + sBareAttackSpeed);
            //console.log("Bare accuracy: " + sBareAccuracy);
            //console.log("Bare crit chance: " + sBareCriticalChance);
            //console.log("Bare energy per hit: " + sBareEnergyPerHit);
            //console.log("Bare energy regen: " + sBareEnergyRegen);
            //console.log("*******************END*******************");

            sBareDamageRange    = ChopperBlank(sBareDamageRange.replace(' damage', '').replace(' damage', '') + "\n", "", "\n").trim();
            sBareAttackSpeed    = ChopperBlank(sBareAttackSpeed.replace(' attack speed', '') + "\n", "", "\n").trim();
            sBareAccuracy       = ChopperBlank(sBareAccuracy.replace(' accuracy', '').trim() + " ", "", " ").trim();
            sBareCriticalChance = ChopperBlank(sBareCriticalChance.replace(' critical chance', '') + "\n", "", "\n").trim();
            sBareEnergyPerHit   = ChopperBlank(sBareEnergyPerHit.replace(' energy per hit', '') + "\n", "", "\n").trim();
            sBareEnergyRegen    = ChopperBlank(sBareEnergyRegen.replace(' energy regen', '') + "\n", "", "\n").trim();

            //console.log("******************BEGIN******************");
            //console.log("Bare DPS: " + sBareDamageRange);
            //console.log("Bare attack speed: " + sBareAttackSpeed);
            //console.log("Bare accuracy: " + sBareAccuracy);
            //console.log("Bare crit chance: " + sBareCriticalChance);
            //console.log("Bare energy per hit: " + sBareEnergyPerHit);
            //console.log("Bare energy regen: " + sBareEnergyRegen);
            //console.log("*******************END*******************");

			sDamagePartMin = ChopperBlank(sBareDamageRange, "", " - ");
			sDamagePartMax = ChopperBlank(sBareDamageRange, " - ", "");

			dDamageMin = CDbl(sDamagePartMin);
			dDamageMax = CDbl(sDamagePartMax);

			dAverageDamageAvgQuality = ((dDamageMax - dDamageMin) / 2.0) + dDamageMin;

			dAttackSpeed = CDbl(sBareAttackSpeed);
			dCriticalChance = CDbl(sBareCriticalChance);

			if (dCriticalChance > 0.0)
				dAverageDamageAvgQuality += dAverageDamageAvgQuality * (dCriticalChance / 100.0);

			dActualDPSAverageQuality = dAverageDamageAvgQuality * dAttackSpeed;

            if (!isNaN(dActualDPSAverageQuality) && !bIsWoodcutter)
            {
                if (jQ(this).find("div.PeteUI_TooltipExp").length === 0)
                {
                    jQ(jQ(this).find("div").get(0)).append
                    (
                        "<div class=\"PeteUI_TooltipExp\"><div class=\"d-flex flex-wrap\"></div><b>Rated Damage</b>\r\n" +
                        "<div class=\"d-flex flex\" style=\"white-space: nowrap;\"><b class=\"lilIcon-attack extra-small-icon mx-1\"></b> " + dAverageDamageAvgQuality.toFixed(1) + " (per hit / base damage)</div>\r\n" +
                        "<div class=\"d-flex flex\" style=\"white-space: nowrap;\"><b class=\"lilIcon-attackSpeed extra-small-icon mx-1\"></b> " + dActualDPSAverageQuality.toFixed(1) + " (per second / DPS)</div></div>\r\n"
                    );
                }
            }
            else if (CDbl(sBareEnergyPerHit) > 0.0)
            {
                if (jQ(this).find("div.PeteUI_TooltipExp").length === 0)
                {
                    dActualDPSAverageQuality = dAverageDamageAvgQuality / CDbl(sBareEnergyPerHit) * CDbl(sBareEnergyRegen);

                    jQ(jQ(this).find("div").get(0)).append
                    (
                        "<div class=\"PeteUI_TooltipExp\"><div class=\"d-flex flex-wrap\"></div><b>Rated Efficiency</b>\r\n" +
                        "<div class=\"d-flex flex\" style=\"white-space: nowrap;\"><b class=\"lilIcon-mining extra-small-icon mx-1\"></b> " + dActualDPSAverageQuality.toFixed(1) + " rating</div>\r\n"
                    );
                }
            }
            else if ((dAttackSpeed > 0.0) && (CDbl(sBareAccuracy) > 0.0) && (bIsWoodcutter))
            {
                if (jQ(this).find("div.PeteUI_TooltipExp").length === 0)
                {
                    dActualDPSAverageQuality = CDbl(sBareAccuracy) * dAttackSpeed;

                    var sTier = "pine logs (only)";
                    if (CInt(dAverageDamageAvgQuality) === 5) sTier = "beech logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 10) sTier = "ash logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 15) sTier = "oak logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 20) sTier = "maple logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 25) sTier = "walnut logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 30) sTier = "cherry logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 35) sTier = "mahogany logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 40) sTier = "elm logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 45) sTier = "black logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 50) sTier = "blue gum logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 55) sTier = "cedar logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 60) sTier = "denya logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 65) sTier = "gombe logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 70) sTier = "hickory logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 75) sTier = "larch logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 80) sTier = "poplar logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 85) sTier = "tali logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 90) sTier = "willow logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 95) sTier = "teak logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 100) sTier = "ebony logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 105) sTier = "fiery logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 110) sTier = "tamarind logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 115) sTier = "magic logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 120) sTier = "petrified logs (and lower)";
                    else if (CInt(dAverageDamageAvgQuality) === 125) sTier = "ancient logs (and lower)";

                    jQ(jQ(this).find("div").get(0)).append
                    (
                        "<div class=\"PeteUI_TooltipExp\"><div class=\"d-flex flex-wrap\"></div><br /><b>Rated Efficiency</b>\r\n" +
                        "<div class=\"d-flex flex\" style=\"white-space: nowrap;\"><b class=\"lilIcon-woodcutting extra-small-icon mx-1\"></b> " + dActualDPSAverageQuality.toFixed(1) + " rating</div>\r\n" +
                        "<div class=\"d-flex flex\" style=\"white-space: nowrap;\"><b class=\"lilIcon-woodcutter extra-small-icon mx-1\"></b> chops " + sTier + "</div>\r\n"
                    );
                }
            }
        });
    }
    catch (err) { console.log("ERROR: " + err); }
    //
    ///////////////////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////////////////
    //
    //  Combat Stats page (personal)
    //
    try
    {
        if (ET.MCMF.GetActiveTab() == "combat")
        {
            if ((ET.MCMF.IsNewCombatTab()) && (!ET.MCMF.PlayerInCombat()) && (jQ('div.battle-unit-container').length > 0))
            {
                if (jQ("div.lobby-container").find("div.mb-1").html().toLowerCase().indexOf("combat levels") !== -1)
                {
                    var oCombatData = ET.MCMF.GetPlayerCombatData();

                    jQ(".PeteUI_CombatStat").remove();

                    let dDamageMin = oCombatData.stats.attack;
                    let dDamageMax = oCombatData.stats.attackMax;

                    let dAverageDamageAvgQuality = ((dDamageMax - dDamageMin) / 2.0) + dDamageMin;

                    let dAttackSpeed = oCombatData.stats.attackSpeed;
                    let dCriticalChance = oCombatData.stats.criticalChance;

                    if (dCriticalChance > 0.0)
                        dAverageDamageAvgQuality += dAverageDamageAvgQuality * (dCriticalChance / 100.0); // note: not using ET_Stat_CritDamage!

                    let dActualDPSAverageQuality = dAverageDamageAvgQuality * dAttackSpeed;

                    let oZerkSkill = undefined; try { oZerkSkill = jQ.makeArray(Meteor.connection._stores.abilities._getCollection().find({owner: Meteor.connection._userId}).fetch()[0].learntAbilities).filter(function(a) { return a.abilityId === "berserk" })[0]; } catch (err) { }
                    let oDESkill = undefined; try { oDESkill = jQ.makeArray(Meteor.connection._stores.abilities._getCollection().find({owner: Meteor.connection._userId}).fetch()[0].learntAbilities).filter(function(a) { return a.abilityId === "double_edged_sword" })[0]; } catch (err) { }

                    let iZerkLevel = 0;
                    let iDELevel = 0;
                    let dDEDamage = 0.0;
                    let dDEDamage_zerk = 0.0;
                    let dDEDamage_zerk_WC = 0.0;
                    let dZerkDamageBonus = 1.0;

                    if (oZerkSkill !== undefined)
                    {
                        iZerkLevel = CInt(oZerkSkill.level);
                        dZerkDamageBonus = 1.45 + (CDbl(oZerkSkill.level) * 0.05);
                    }

                    if (oDESkill !== undefined)
                    {
                        iDELevel = CInt(oDESkill.level);
                        dDEDamage = (1.25 + (CDbl(oDESkill.level) * 0.75)) * dDamageMax;
                        dDEDamage_zerk = (1.25 + (CDbl(oDESkill.level) * 0.75)) * dDamageMax * dZerkDamageBonus;
                        dDEDamage_zerk_WC = (1.25 + (CDbl(oDESkill.level) * 0.75)) * dDamageMax * dZerkDamageBonus * 1.5;
                    }

                    let sDESkillHTML = "";
                    let sDESkillHTML_zerk = "";
                    let sDESkillHTML_zerk_WC = "";

                    if (iDELevel === 0)
                    {
                        /* sDESkillHTML =
                            "      <div class=\"d-flex flex-wrap\">\r\n" +
                            "        <div class=\"mb-3 mr-3\">\r\n" +
                            "          <div class=\"d-flex align-items-center\">\r\n" +
                            "            <i class=\"lilIcon-noimage small-icon\">\r\n" +
                            "            <div class=\"ml-1 mb-0\"></div>\r\n" +
                            "            <small class=\"mx-3\"></small>\r\n" +
                            "          </div>\r\n" +
                            "        </div>\r\n" +
                            "      </div>\r\n"; */

                        sDESkillHTML =
                            "      <div class=\"d-flex flex-wrap\">\r\n" +
                            "        <div class=\"mb-3 mr-3\">\r\n" +
                            "          <div class=\"d-flex align-items-center\">\r\n" +
                            "            <i class=\"lilIcon-noimage small-icon\"><img src=\"/icons/doubleEdgedSword.svg\" class=\"extra-small-icon\" style=\"margin-top: -16px;\"></i>\r\n" +
                            "            <div class=\"ml-1 mb-0\">Double Edged Sword</div>\r\n" +
                            "            <small class=\"mx-3\">skill missing</small>\r\n" +
                            "          </div>\r\n" +
                            "        </div>\r\n" +
                            "      </div>\r\n";
                    }
                    else
                    {
                        sDESkillHTML =
                            "      <div class=\"d-flex flex-wrap\">\r\n" +
                            "        <div class=\"mb-3 mr-3\">\r\n" +
                            "          <div class=\"d-flex align-items-center\">\r\n" +
                            "            <i class=\"lilIcon-noimage small-icon\"><img src=\"/icons/doubleEdgedSword.svg\" class=\"extra-small-icon\" style=\"margin-top: -16px;\"></i>\r\n" +
                            "            <div class=\"ml-1 mb-0\">Double Edged Sword L." + iDELevel.toFixed(0) + "</div>\r\n" +
                            "            <small class=\"mx-3\">" + dDEDamage.toFixed(0) + " damage vs. 0 armor</small>\r\n" +
                            "          </div>\r\n" +
                            "        </div>\r\n" +
                            "      </div>\r\n";

                        sDESkillHTML_zerk =
                            "      <div class=\"d-flex flex-wrap\">\r\n" +
                            "        <div class=\"mb-3 mr-3\">\r\n" +
                            "          <div class=\"d-flex align-items-center\">\r\n" +
                            "            <i class=\"lilIcon-noimage small-icon\"><img src=\"/icons/doubleEdgedSword.svg\" class=\"extra-small-icon\" style=\"margin-top: -16px;\"></i>\r\n" +
                            "            <div class=\"ml-1 mb-0\">Double Edged Sword L." + iDELevel.toFixed(0) + "</div>\r\n" +
                            "            <small class=\"mx-3\">" + dDEDamage_zerk.toFixed(0) + " (+ Berserk L." + iZerkLevel.toFixed(0) + ")</small>\r\n" +
                            "          </div>\r\n" +
                            "        </div>\r\n" +
                            "      </div>\r\n";

                        sDESkillHTML_zerk_WC =
                            "      <div class=\"d-flex flex-wrap\">\r\n" +
                            "        <div class=\"mb-3 mr-3\">\r\n" +
                            "          <div class=\"d-flex align-items-center\">\r\n" +
                            "            <i class=\"lilIcon-noimage small-icon\"><img src=\"/icons/doubleEdgedSword.svg\" class=\"extra-small-icon\" style=\"margin-top: -16px;\"></i>\r\n" +
                            "            <div class=\"ml-1 mb-0\">Double Edged Sword L." + iDELevel.toFixed(0) + "</div>\r\n" +
                            "            <small class=\"mx-3\">" + dDEDamage_zerk_WC.toFixed(0) + " (+ Berserk L." + iZerkLevel.toFixed(0) + " +Warcry)</small>\r\n" +
                            "          </div>\r\n" +
                            "        </div>\r\n" +
                            "      </div>\r\n";
                        }

                    //jQ("a.recent-battles-btn").parent().parent().before(
                    jQ("div.lobby-container").append(
                        "<div class=\"PeteUI_CombatStat\">\r\n" +
                        "  <div class=\"mb-1 text-muted\">Combat Stats</div>\r\n" +
                        "  <div class=\"d-flex\">" +

                        "    <div class=\"col\">" +
                        "      <div class=\"d-flex flex-wrap\">\r\n" +
                        "        <div class=\"mb-3 mr-3\">\r\n" +
                        "          <div class=\"d-flex align-items-center\">\r\n" +
                        "            <i class=\"lilIcon-attack small-icon\"></i>\r\n" +
                        "            <div class=\"ml-1 mb-0\">Weapon Damage</div>\r\n" +
                        "            <small class=\"mx-3\">" + dDamageMin.toFixed(1) + " - " + dDamageMax.toFixed(1) + " (" + dAverageDamageAvgQuality.toFixed(1) + " average)</small>\r\n" +
                        "          </div>\r\n" +
                        "        </div>\r\n" +
                        "      </div>\r\n" +
                        "      <div class=\"d-flex flex-wrap\">\r\n" +
                        "        <div class=\"mb-3 mr-3\">\r\n" +
                        "          <div class=\"d-flex align-items-center\">\r\n" +
                        "            <i class=\"lilIcon-accuracy small-icon\"></i>\r\n" +
                        "            <div class=\"ml-1 mb-0\">Accuracy</div>\r\n" +
                        "            <small class=\"mx-3\">" + oCombatData.stats.accuracy.toFixed(1) + "</small>\r\n" +
                        "          </div>\r\n" +
                        "        </div>\r\n" +
                        "      </div>\r\n" +
                        "      <div class=\"d-flex flex-wrap\">\r\n" +
                        "        <div class=\"mb-3 mr-3\">\r\n" +
                        "          <div class=\"d-flex align-items-center\">\r\n" +
                        "            <i class=\"lilIcon-defense small-icon\"></i>\r\n" +
                        "            <div class=\"ml-1 mb-0\">Defense (Dodge)</div>\r\n" +
                        "            <small class=\"mx-3\">" + oCombatData.stats.defense.toFixed(1) + "</small>\r\n" +
                        "          </div>\r\n" +
                        "        </div>\r\n" +
                        "      </div>\r\n" +
                        "      <div class=\"d-flex flex-wrap\">\r\n" +
                        "        <div class=\"mb-3 mr-3\">\r\n" +
                        "          <div class=\"d-flex align-items-center\">\r\n" +
                        "            <i class=\"lilIcon-health small-icon\"></i>\r\n" +
                        "            <div class=\"ml-1 mb-0\">Health (Max)</div>\r\n" +
                        "            <small class=\"mx-3\">" + oCombatData.stats.healthMax.toFixed(0) + "</small>\r\n" +
                        "          </div>\r\n" +
                        "        </div>\r\n" +
                        "      </div>\r\n" +
                        sDESkillHTML_zerk +
                        "      <div class=\"d-flex flex-wrap\">\r\n" +
                        "        <div class=\"mb-3 mr-3\">\r\n" +
                        "          <div class=\"d-flex align-items-center\">\r\n" +
                        "            <i class=\"lilIcon-magicPower small-icon\"></i>\r\n" +
                        "            <div class=\"ml-1 mb-0\">Magic Power</div>\r\n" +
                        "            <small class=\"mx-3\">" + oCombatData.stats.magicPower.toFixed(1) + "</small>\r\n" +
                        "          </div>\r\n" +
                        "        </div>\r\n" +
                        "      </div>\r\n" +
                        "      <div class=\"d-flex flex-wrap\">\r\n" +
                        "        <div class=\"mb-3 mr-3\">\r\n" +
                        "          <div class=\"d-flex align-items-center\">\r\n" +
                        "            <i class=\"lilIcon-noimage small-icon\"><img src=\"/icons/airDart.svg\" class=\"extra-small-icon\" style=\"margin-top: -16px;\"></i>\r\n" +
                        "            <div class=\"ml-1 mb-0\">Air Dart</div>\r\n" +
                        "            <small class=\"mx-3\">" + ((1.10 * oCombatData.stats.magicPower) + 1).toFixed(0) + " armor reduction</small>\r\n" +
                        "          </div>\r\n" +
                        "        </div>\r\n" +
                        "      </div>\r\n" +
                        "      <div class=\"d-flex flex-wrap\">\r\n" +
                        "        <div class=\"mb-3 mr-3\">\r\n" +
                        "          <div class=\"d-flex align-items-center\">\r\n" +
                        "            <i class=\"lilIcon-noimage small-icon\"><img src=\"/icons/lightningDart.svg\" class=\"extra-small-icon\" style=\"margin-top: -16px;\"></i>\r\n" +
                        "            <div class=\"ml-1 mb-0\">Lightning Dart</div>\r\n" +
                        "            <small class=\"mx-3\">" + ((0.90 * oCombatData.stats.magicPower) + 2).toFixed(0) + " armor reduction</small>\r\n" +
                        "          </div>\r\n" +
                        "        </div>\r\n" +
                        "      </div>\r\n" +
                        "    </div>\r\n" +

                        "    <div class=\"col\">\r\n" +
                        "      <div class=\"d-flex flex-wrap\">\r\n" +
                        "        <div class=\"mb-3 mr-3\">\r\n" +
                        "          <div class=\"d-flex align-items-center\">\r\n" +
                        "            <i class=\"lilIcon-attackSpeed small-icon\"></i>\r\n" +
                        "            <div class=\"ml-1 mb-0\">Attack Speed</div>\r\n" +
                        "            <small class=\"mx-3\">" + Math.round(dAttackSpeed, 4).toString() + " attacks per second (" + dActualDPSAverageQuality.toFixed(1) + " DPS)</small>\r\n" +
                        "          </div>\r\n" +
                        "        </div>\r\n" +
                        "      </div>\r\n" +
                        "      <div class=\"d-flex flex-wrap\">\r\n" +
                        "        <div class=\"mb-3 mr-3\">\r\n" +
                        "          <div class=\"d-flex align-items-center\">\r\n" +
                        "            <i class=\"lilIcon-criticalChance small-icon\"></i>\r\n" +
                        "            <div class=\"ml-1 mb-0\">Critical Hit</div>\r\n" +
                        "            <small class=\"mx-3\">" + ((oCombatData.stats.criticalChance <= 0.0) ? ("none") : (oCombatData.stats.criticalChance.toFixed(1) + "% chance to deal " + oCombatData.stats.criticalDamage.toFixed(1) + "x damage")) + "</small>\r\n" +
                        "          </div>\r\n" +
                        "        </div>\r\n" +
                        "      </div>\r\n" +
                        "      <div class=\"d-flex flex-wrap\">\r\n" +
                        "        <div class=\"mb-3 mr-3\">\r\n" +
                        "          <div class=\"d-flex align-items-center\">\r\n" +
                        "            <i class=\"lilIcon-armor small-icon\"></i>\r\n" +
                        "            <div class=\"ml-1 mb-0\">Physical Armor</div>\r\n" +
                        "            <small class=\"mx-3\">" + oCombatData.stats.armor.toFixed(1) + " (" + ((1000-(100/(100+oCombatData.stats.armor)*1000))/10).toFixed(1) + "% physical protection)</small>\r\n" +
                        "          </div>\r\n" +
                        "        </div>\r\n" +
                        "      </div>\r\n" +
                        sDESkillHTML +
                        sDESkillHTML_zerk_WC +
                        "      <div class=\"d-flex flex-wrap\">\r\n" +
                        "        <div class=\"mb-3 mr-3\">\r\n" +
                        "          <div class=\"d-flex align-items-center\">\r\n" +
                        "            <i class=\"lilIcon-magicArmor small-icon\"></i>\r\n" +
                        "            <div class=\"ml-1 mb-0\">Magic Armor</div>\r\n" +
                        "            <small class=\"mx-3\">" + oCombatData.stats.magicArmor.toFixed(1) + " (" + ((1000-(100/(100+oCombatData.stats.magicArmor)*1000))/10).toFixed(1) + "% magic protection)</small>\r\n" +
                        "          </div>\r\n" +
                        "        </div>\r\n" +
                        "      </div>\r\n" +
                        "      <div class=\"d-flex flex-wrap\">\r\n" +
                        "        <div class=\"mb-3 mr-3\">\r\n" +
                        "          <div class=\"d-flex align-items-center\">\r\n" +
                        "            <i class=\"lilIcon-noimage small-icon\"><img src=\"/icons/airBall.svg\" class=\"extra-small-icon\" style=\"margin-top: -16px;\"></i>\r\n" +
                        "            <div class=\"ml-1 mb-0\">Air Ball</div>\r\n" +
                        "            <small class=\"mx-3\">" + ((1.60 * oCombatData.stats.magicPower) + 10).toFixed(0) + " armor reduction</small>\r\n" +
                        "          </div>\r\n" +
                        "        </div>\r\n" +
                        "      </div>\r\n" +
                        "      <div class=\"d-flex flex-wrap\">\r\n" +
                        "        <div class=\"mb-3 mr-3\">\r\n" +
                        "          <div class=\"d-flex align-items-center\">\r\n" +
                        "            <i class=\"lilIcon-healingPower small-icon\"></i>\r\n" +
                        "            <div class=\"ml-1 mb-0\">Healing Power</div>\r\n" +
                        "            <small class=\"mx-3\">" + ((oCombatData.stats.healingPower === 0.0) ? "normal (no bonus or penalty)" : ((oCombatData.stats.healingPower < 0) ? (oCombatData.stats.healingPower.toFixed(1) + "% lowered healing") : (oCombatData.stats.healingPower.toFixed(1) + "% increased healing"))) + "</small>\r\n" +
                        "          </div>\r\n" +
                        "        </div>\r\n" +
                        "      </div>\r\n" +
                        "    </div>\r\n" +

                        "  </div>\r\n" +
                        "</div>\r\n");
                }
            }
            /* else if ((!ET.MCMF.IsNewCombatTab()) && (jQ("div.stats-row").length > 0))
            {
                sBareDamageRange = CondenseSpacing(jQ(jQ("div.stats-row").find("div > div.col > div").get(0)).text().trim().replaceAll('\r', ' ').replaceAll('\n', ' '));
                //console.log("Bare damage range: " + sBareDamageRange);

                sDamagePartMin = ChopperBlank(sBareDamageRange, "", " - ");
                sDamagePartMax = ChopperBlank(sBareDamageRange, " - ", "");

                dDamageMin = CDbl(sDamagePartMin);
                dDamageMax = CDbl(sDamagePartMax);

                dAverageDamageAvgQuality = ((dDamageMax - dDamageMin) / 2.0) + dDamageMin;

                sBareAttackSpeed = jQ(jQ("div.stats-row").find("div > div.col > div").get(1)).text().trim();
                //console.log("Bare attack speed: " + sBareAttackSpeed);

                dAttackSpeed = CDbl(sBareAttackSpeed);
                dCriticalChance = CDbl(ET_Stat_CritChance);

                if (dCriticalChance > 0.0)
                    dAverageDamageAvgQuality += dAverageDamageAvgQuality * (dCriticalChance / 100.0); // note: not using ET_Stat_CritDamage!

                dActualDPSAverageQuality = dAverageDamageAvgQuality * dAttackSpeed;

                //console.log(dActualDPSAverageQuality.toFixed(1));

                if (!isNaN(dActualDPSAverageQuality))
                {
                    jQ(".PeteUI_CombatStat").remove();

                    jQ(jQ("div.stats-row").find("div > div.col > div").get(0)).append("<span class=\"PeteUI_CombatStat\">&nbsp;(" + dAverageDamageAvgQuality.toFixed(1) + " average)</span>");
                    jQ(jQ("div.stats-row").find("div > div.col > div").get(1)).append("<span class=\"PeteUI_CombatStat\">&nbsp;attacks per second (" + dActualDPSAverageQuality.toFixed(1) + " DPS)</span>");
                    jQ(jQ("div.stats-row").find("div > div.col > div").get(2)).append("<span class=\"PeteUI_CombatStat\">&nbsp;magic power</span>");
                    jQ(jQ("div.stats-row").find("div > div.col > div").get(3)).append("<span class=\"PeteUI_CombatStat\">&nbsp;accuracy</span>");
                    jQ(jQ("div.stats-row").find("div > div.col > div").get(4)).append("<span class=\"PeteUI_CombatStat\">&nbsp;health</span>");
                    jQ(jQ("div.stats-row").find("div > div.col > div").get(5)).append("<span class=\"PeteUI_CombatStat\">&nbsp;dodge (defense)</span>");
                    jQ(jQ("div.stats-row").find("div > div.col > div").get(6)).append("<span class=\"PeteUI_CombatStat\">&nbsp;physical armor</span>");
                    jQ(jQ("div.stats-row").find("div > div.col > div").get(7)).append("<span class=\"PeteUI_CombatStat\">&nbsp;magic armor</span>");

                    if (CDbl(ET_Stat_CritChance) > 0.0)
                        jQ(jQ("div.stats-row").find("div > div.col").get(0)).append("<div class=\"d-flex flex-row mb-1 PeteUI_CombatStat\">\r\n<div class=\"d-flex align-items-center attack-tooltip-container drop-target drop-abutted drop-abutted-left drop-abutted-top drop-element-attached-bottom drop-element-attached-left drop-target-attached-top drop-target-attached-left\">\r\n<img src=\"/icons/criticalChance.svg\" class=\"extra-small-icon\">\r\n</div>\r\n<div class=\"d-flex align-items-center ml-1\">\r\n" + ET_Stat_CritChance.toFixed(1) + " critical chance for " + ET_Stat_CritDamage + "x damage\r\n</div>\r\n");
                    else
                        jQ(jQ("div.stats-row").find("div > div.col").get(0)).append("<div class=\"d-flex flex-row mb-1 PeteUI_CombatStat\">\r\n<div class=\"d-flex align-items-center attack-tooltip-container drop-target drop-abutted drop-abutted-left drop-abutted-top drop-element-attached-bottom drop-element-attached-left drop-target-attached-top drop-target-attached-left\">\r\n<img src=\"/icons/criticalChance.svg\" class=\"extra-small-icon\">\r\n</div>\r\n<div class=\"d-flex align-items-center ml-1\">\r\nno critical chance\r\n</div>\r\n");

                    if (CDbl(ET_Stat_HealingPower) !== 0.0)
                        jQ(jQ("div.stats-row").find("div > div.col").get(1)).append("<div class=\"d-flex flex-row mb-1 PeteUI_CombatStat\">\r\n<div class=\"d-flex align-items-center attack-tooltip-container drop-target drop-abutted drop-abutted-left drop-abutted-top drop-element-attached-bottom drop-element-attached-left drop-target-attached-top drop-target-attached-left\">\r\n<img src=\"/icons/healingPower.svg\" class=\"extra-small-icon\">\r\n</div>\r\n<div class=\"d-flex align-items-center ml-1\">\r\n" + ET_Stat_HealingPower.toFixed(1) + "% " + ((CDbl(ET_Stat_HealingPower) > 0.0) ? "increased" : "lowered") + " healing\r\n</div>\r\n");
                    else
                        jQ(jQ("div.stats-row").find("div > div.col").get(1)).append("<div class=\"d-flex flex-row mb-1 PeteUI_CombatStat\">\r\n<div class=\"d-flex align-items-center attack-tooltip-container drop-target drop-abutted drop-abutted-left drop-abutted-top drop-element-attached-bottom drop-element-attached-left drop-target-attached-top drop-target-attached-left\">\r\n<img src=\"/icons/healingPower.svg\" class=\"extra-small-icon\">\r\n</div>\r\n<div class=\"d-flex align-items-center ml-1\">\r\nnormal healing\r\n</div>\r\n");

                    //jQ(jQ("div.stats-row").find("div > div.col").get(0)).append("<div class=\"d-flex flex-row mb-1 PeteUI_CombatStat\">\r\n<div class=\"d-flex align-items-center attack-tooltip-container drop-target drop-abutted drop-abutted-left drop-abutted-top drop-element-attached-bottom drop-element-attached-left drop-target-attached-top drop-target-attached-left\">\r\n<img src=\"/icons/doubleEdgedSword.svg\" class=\"extra-small-icon\">\r\n</div>\r\n<div class=\"d-flex align-items-center ml-1\">\r\n" + (dDamageMax * 1.5 * 1.7 * 2.5 * 5.0).toFixed(0) + " DE damage vs. 0 armor\r\n</div>\r\n");
                    //jQ(jQ("div.stats-row").find("div > div.col").get(1)).append("<div class=\"d-flex flex-row mb-1 PeteUI_CombatStat\">\r\n<div class=\"d-flex align-items-center ml-1\">\r\n(using demon curse, war cry, and berserk)\r\n</div>\r\n");
                    jQ(jQ("div.stats-row").find("div > div.col").get(0)).append("<div class=\"d-flex flex-row mb-1 PeteUI_CombatStat\">\r\n<div class=\"d-flex align-items-center attack-tooltip-container drop-target drop-abutted drop-abutted-left drop-abutted-top drop-element-attached-bottom drop-element-attached-left drop-target-attached-top drop-target-attached-left\">\r\n<img src=\"/icons/doubleEdgedSword.svg\" class=\"extra-small-icon\">\r\n</div>\r\n<div class=\"d-flex align-items-center ml-1\">\r\n" + (dDamageMax * 1.5 * 1.7 * 5.0).toFixed(0) + " DE damage vs. 0 armor\r\n</div>\r\n");
                    jQ(jQ("div.stats-row").find("div > div.col").get(1)).append("<div class=\"d-flex flex-row mb-1 PeteUI_CombatStat\">\r\n<div class=\"d-flex align-items-center ml-1\">\r\n(using L.5 war cry, berserk, and DE)\r\n</div>\r\n");
                    jQ(jQ("div.stats-row").find("div > div.col").get(0)).append("<div class=\"d-flex flex-row mb-1 PeteUI_CombatStat\">\r\n<div class=\"d-flex align-items-center attack-tooltip-container drop-target drop-abutted drop-abutted-left drop-abutted-top drop-element-attached-bottom drop-element-attached-left drop-target-attached-top drop-target-attached-left\">\r\n<img src=\"/icons/airDart.svg\" class=\"extra-small-icon\">\r\n</div>\r\n<div class=\"d-flex align-items-center ml-1\">\r\n" + ((1.10 * ET_Stat_MP) + 1).toFixed(0) + " air dart armor reduction\r\n</div>\r\n");
                    jQ(jQ("div.stats-row").find("div > div.col").get(1)).append("<div class=\"d-flex flex-row mb-1 PeteUI_CombatStat\">\r\n<div class=\"d-flex align-items-center attack-tooltip-container drop-target drop-abutted drop-abutted-left drop-abutted-top drop-element-attached-bottom drop-element-attached-left drop-target-attached-top drop-target-attached-left\">\r\n<img src=\"/icons/airBall.svg\" class=\"extra-small-icon\">\r\n</div>\r\n<div class=\"d-flex align-items-center ml-1\">\r\n" + ((1.60 * ET_Stat_MP) + 10).toFixed(0) + " air ball armor reduction\r\n</div>\r\n");
                    jQ(jQ("div.stats-row").find("div > div.col").get(0)).append("<div class=\"d-flex flex-row mb-1 PeteUI_CombatStat\">\r\n<div class=\"d-flex align-items-center attack-tooltip-container drop-target drop-abutted drop-abutted-left drop-abutted-top drop-element-attached-bottom drop-element-attached-left drop-target-attached-top drop-target-attached-left\">\r\n<img src=\"/icons/lightningDart.svg\" class=\"extra-small-icon\">\r\n</div>\r\n<div class=\"d-flex align-items-center ml-1\">\r\n" + ((0.90 * ET_Stat_MP) + 2).toFixed(0) + " lightning dart armor reduction\r\n</div>\r\n");
                }
            }
            */
		}
	}
	catch (err) {  ET.MCMF.Log("Error in Stats mod rendering extra combat stats:"); console.log(err);  }
    //
    ///////////////////////////////////////////////////////////////////////////////////////

	setTimeout(ET_StatsUIMod_DPSShow, 1000);
};


////////////////////////////////////////////////////////////////
/////////////// ** common.js -- DO NOT MODIFY ** ///////////////
time_val = function()
{
    return CDbl(Math.floor(Date.now() / 1000));
};

IsValid = function(oObject)
{
    if (oObject === undefined) return false;
    if (oObject === null) return false;
    return true;
};

const CommonRandom = function(iMin, iMax)
{
    return parseInt(iMin + Math.floor(Math.random() * iMax));
};

ShiftClick = function(oEl)
{
    jQ(oEl).trigger(ShiftClickEvent());
};

ShiftClickEvent = function(target)
{
	let shiftclickOrig = jQ.Event("click");
    shiftclickOrig.which = 1; // 1 = left, 2 = middle, 3 = right
    //shiftclickOrig.type = "click"; // "mousedown" ?
	shiftclickOrig.shiftKey = true;
    shiftclickOrig.currentTarget = target;

	let shiftclick = jQ.Event("click");
    shiftclick.which = 1; // 1 = left, 2 = middle, 3 = right
    //shiftclick.type = "click"; // "mousedown" ?
	shiftclick.shiftKey = true;
    shiftclick.currentTarget = target;

	shiftclick.originalEvent = shiftclickOrig;

    //document.ET_Util_Log(shiftclick);

	return shiftclick;
};

if (!String.prototype.replaceAll)
    String.prototype.replaceAll = function(search, replace) { return ((replace === undefined) ? this.toString() : this.replace(new RegExp('[' + search + ']', 'g'), replace)); };

if (!String.prototype.startsWith)
    String.prototype.startsWith = function(search, pos) { return this.substr(((!pos) || (pos < 0)) ? 0 : +pos, search.length) === search; };

CInt = function(v)
{
	try
	{
		if (!isNaN(v)) return Math.floor(v);
		if (typeof v === 'undefined') return parseInt(0);
		if (v === null) return parseInt(0);
		let t = parseInt(v);
		if (isNaN(t)) return parseInt(0);
		return Math.floor(t);
	}
	catch (err) { }

	return parseInt(0);
};

CDbl = function(v)
{
	try
	{
		if (!isNaN(v)) return parseFloat(v);
		if (typeof v === 'undefined') return parseFloat(0.0);
		if (v === null) return parseFloat(0.0);
		let t = parseFloat(v);
		if (isNaN(t)) return parseFloat(0.0);
		return t;
	}
	catch (err) { }

	return parseFloat(0.0);
};

// dup of String.prototype.startsWith, but uses indexOf() instead of substr()
startsWith = function (haystack, needle) { return (needle === "") || (haystack.indexOf(needle) === 0); };
endsWith   = function (haystack, needle) { return (needle === "") || (haystack.substring(haystack.length - needle.length) === needle); };

Chopper = function(sText, sSearch, sEnd)
{
	let sIntermediate = "";

	if (sSearch === "")
		sIntermediate = sText.substring(0, sText.length);
	else
	{
		let iIndexStart = sText.indexOf(sSearch);
		if (iIndexStart === -1)
			return sText;

		sIntermediate = sText.substring(iIndexStart + sSearch.length);
	}

	if (sEnd === "")
		return sIntermediate;

	let iIndexEnd = sIntermediate.indexOf(sEnd);

	return (iIndexEnd === -1) ? sIntermediate : sIntermediate.substring(0, iIndexEnd);
};

ChopperBlank = function(sText, sSearch, sEnd)
{
	let sIntermediate = "";

	if (sSearch === "")
		sIntermediate = sText.substring(0, sText.length);
	else
	{
		let iIndexStart = sText.indexOf(sSearch);
		if (iIndexStart === -1)
			return "";

		sIntermediate = sText.substring(iIndexStart + sSearch.length);
	}

	if (sEnd === "")
		return sIntermediate;

	let iIndexEnd = sIntermediate.indexOf(sEnd);

	return (iIndexEnd === -1) ? "" : sIntermediate.substring(0, iIndexEnd);
};

CondenseSpacing = function(text)
{
	while (text.indexOf("  ") !== -1)
		text = text.replace("  ", " ");
	return text;
};

// pad available both ways as pad(string, width, [char]) or string.pad(width, [char])
pad = function(sText, iWidth, sChar)
{
    sChar = ((sChar !== undefined) ? sChar : ('0'));
    sText = sText.toString();
    return ((sText.length >= iWidth) ? (sText) : (new Array(iWidth - sText.length + 1).join(sChar) + sText));
};

if (!String.prototype.pad)
    String.prototype.pad = function(iWidth, sChar)
    {
        sChar = ((sChar !== undefined) ? sChar : ('0'));
        sText = sText.toString();
        return ((sText.length >= iWidth) ? (sText) : (new Array(iWidth - sText.length + 1).join(sChar) + sText));
    };

String.prototype.toHHMMSS = function () {
    let sec_num = parseInt(this, 10);
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
};

String.prototype.toFriendlyTime = function () {
    let sec_num = parseInt(this, 10);
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    let out = '';

    if (hours > 0) out = `${out}${hours}h`;
    if (minutes > 0) out = `${out}${minutes}m`;
    if (seconds > 0) out = `${out}${seconds}s`;
    return out;
};

Number.prototype.toPercent = function () {
    try
    {
        let pct_val = parseFloat(this);
        if (pct_val >= 15.0) return pct_val.toFixed(0);
        return pct_val.toFixed(1).replace(".0", "");
    }
    catch (err) { }
    return 'NaN';
};

is_visible = (function () {
    let x = window.pageXOffset ? window.pageXOffset + window.innerWidth - 1 : 0,
        y = window.pageYOffset ? window.pageYOffset + window.innerHeight - 1 : 0,
        relative = !!((!x && !y) || !document.elementFromPoint(x, y));
    function inside(child, parent) {
        while(child){
            if (child === parent) return true;
            child = child.parentNode;
        }
        return false;
    }
    return function (elem) {
        if (
            hidden ||
            elem.offsetWidth==0 ||
            elem.offsetHeight==0 ||
            elem.style.visibility=='hidden' ||
            elem.style.display=='none' ||
            elem.style.opacity===0
        ) return false;
        let rect = elem.getBoundingClientRect();
        if (relative) {
            if (!inside(document.elementFromPoint(rect.left + elem.offsetWidth/2, rect.top + elem.offsetHeight/2),elem)) return false;
        } else if (
            !inside(document.elementFromPoint(rect.left + elem.offsetWidth/2 + window.pageXOffset, rect.top + elem.offsetHeight/2 + window.pageYOffset), elem) ||
            (
                rect.top + elem.offsetHeight/2 < 0 ||
                rect.left + elem.offsetWidth/2 < 0 ||
                rect.bottom - elem.offsetHeight/2 > (window.innerHeight || document.documentElement.clientHeight) ||
                rect.right - elem.offsetWidth/2 > (window.innerWidth || document.documentElement.clientWidth)
            )
        ) return false;
        if (window.getComputedStyle || elem.currentStyle) {
            let el = elem,
                comp = null;
            while (el) {
                if (el === document) {break;} else if(!el.parentNode) return false;
                comp = window.getComputedStyle ? window.getComputedStyle(el, null) : el.currentStyle;
                if (comp && (comp.visibility=='hidden' || comp.display == 'none' || (typeof comp.opacity !=='undefined' && comp.opacity != 1))) return false;
                el = el.parentNode;
            }
        }
        return true;
    };
})();

function sumObjectsByKey(...objs) {
	return objs.reduce((a, b) => {
		for (let k in b) {
			if (b.hasOwnProperty(k))
				a[k] = (a[k] || 0) + b[k];
		}
		return a;
	}, {});
}
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
////////////// ** common_ET.js -- DO NOT MODIFY ** /////////////
if (window.ET === undefined) window.ET = { };
if ((window.ET.MCMF === undefined) || (CDbl(window.ET.MCMF.version) < 1.08)) // MeanCloud mod framework
{
    window.ET.MCMF =
    {
        version: 1.08,

        TryingToLoad: false,
        WantDebug: false,
        WantFasterAbilityCDs: false,

        InBattle: false,
        FinishedLoading: false,
        Initialized: false,
        AbilitiesReady: false,
        InitialAbilityCheck: true,
        TimeLeftOnCD: 9999,
        TimeLastFight: 0,

        ToastMessageSuccess: function(msg)
        {
            toastr.success(msg);
        },

        ToastMessageWarning: function(msg)
        {
            toastr.warning(msg);
        },

        EventSubscribe: function(sEventName, fnCallback, sNote)
        {
            if (window.ET.MCMF.EventSubscribe_events === undefined)
                window.ET.MCMF.EventSubscribe_events = [];

            let newEvtData = {};
                newEvtData.name = ((!sEventName.startsWith("ET:")) ? (`ET:${sEventName}`) : (sEventName));
                newEvtData.callback = fnCallback;
                newEvtData.note = sNote;

            window.ET.MCMF.EventSubscribe_events.push(newEvtData);

            if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(`Added event subscription '${sEventName}'!` + ((sNote === undefined) ? "" : ` (${sNote})`));
        },

        EventTrigger: function(sEventName)
        {
            if (window.ET.MCMF.EventSubscribe_events === undefined) return;

            window.ET.MCMF.EventSubscribe_events.forEach(function(oThisEvent)
            {
                if (sEventName === oThisEvent.name)
                {
                    if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(`FIRING '${oThisEvent.name}'!` + ((oThisEvent.note === undefined) ? "" : ` (${oThisEvent.note})`));
                    try { oThisEvent.callback(); } catch (err) { if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("Exception:"); console.log(err); }
                }
            });
        },

        Log: function(msg)
        {
            try
            {
                let now = new Date();
                let timestamp_date = `${(now.getMonth()+1)}/${now.getDate()}`;
                let timestamp_time = `${((now.getHours()===0)?12:((now.getHours()>12)?(now.getHours()-12):(now.getHours())))}:${now.getMinutes().toString().padStart(2,"0")}:${now.getSeconds().toString().padStart(2,"0")}${((now.getHours()< 2)?"a":"p")}`;
                console.log(`%c${timestamp_date} ${timestamp_time}%c  ${msg}`, "color: #555;", "font-weight: bold;");
            }
            catch (err) { }
        },

        Time: function() // returns time in milliseconds (not seconds!)
        {
            return CInt((new Date()).getTime());
        },

        SubscribeToGameChannel: function(channel_name)
        {
            let oChannel;

            try
            {
                channel_name = channel_name.toString().trim();

                let bAlreadySubscribed = false;

                jQuery.makeArray(Object.keys(Meteor.connection._subscriptions).map(key => Meteor.connection._subscriptions[key])).forEach(function(oThisConnection)
                {
                    try
                    {
                        if (oThisConnection.name === channel_name)
                            bAlreadySubscribed = true;
                    }
                    catch (err) { }
                });

                if (!bAlreadySubscribed)
                {
                    Meteor.subscribe(channel_name);
                    if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(`Meteor::Subscribed to channel '${channel_name}'`);
                }
            }
            catch (err)
            {
                if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(`Meteor::Exception in SubscribeToGameChannel("${channel_name}"):`);
                if (window.ET.MCMF.WantDebug) console.log(err);
            }

            return oChannel;
        },

        CraftingBuff: function()
        {
            let oDate, iTimeLeft;

            try
            {
                oDate = new Date(Meteor.connection._stores.state._getCollection().find({ name: "buffCrafting" }).fetch()[0].value.activeTo);
                iTimeLeft = ((oDate) > (new Date())) ? CInt(Math.floor(Math.abs(oDate - (new Date())) / 1000.0)) : 0;

                return { active: (iTimeLeft > 0), remaining: iTimeLeft, expires: oDate };
            }
            catch (err) { }

            return { active: false, remaining: 0, expires: oDate };
        },

        CombatBuff: function()
        {
            let oDate, iTimeLeft;

            try
            {
                oDate = new Date(Meteor.connection._stores.state._getCollection().find({ name: "buffCombat" }).fetch()[0].value.activeTo);
                iTimeLeft = ((oDate) > (new Date())) ? CInt(Math.floor(Math.abs(oDate - (new Date())) / 1000.0)) : 0;

                return { active: (iTimeLeft > 0), remaining: iTimeLeft, expires: oDate };
            }
            catch (err) { }

            return { active: false, remaining: 0, expires: oDate };
        },

        GatheringBuff: function()
        {
            let oDate, iTimeLeft;

            try
            {
                oDate = new Date(Meteor.connection._stores.state._getCollection().find({ name: "buffGathering" }).fetch()[0].value.activeTo);
                iTimeLeft = ((oDate) > (new Date())) ? CInt(Math.floor(Math.abs(oDate - (new Date())) / 1000.0)) : 0;

                return { active: (iTimeLeft > 0), remaining: iTimeLeft, expires: oDate };
            }
            catch (err) { }

            return { active: false, remaining: 0, expires: oDate };
        },

        PersonalCraftingBuff: function()
        {
            let oDate, iTimeLeft;

            try
            {
                oDate = new Date(Meteor.connection._stores.users._getCollection().find().fetch()[0].craftingUpgradeTo);
                iTimeLeft = ((oDate) > (new Date())) ? CInt(Math.floor(Math.abs(oDate - (new Date())) / 1000.0)) : 0;

                return { active: (iTimeLeft > 0), remaining: iTimeLeft, expires: oDate };
            }
            catch (err) { }

            return { active: false, remaining: 0, expires: oDate };
        },

        PersonalWoodcuttingBuff: function()
        {
            let oDate, iTimeLeft;

            try
            {
                oDate = new Date(Meteor.connection._stores.users._getCollection().find().fetch()[0].woodcuttingUpgradeTo);
                iTimeLeft = ((oDate) > (new Date())) ? CInt(Math.floor(Math.abs(oDate - (new Date())) / 1000.0)) : 0;

                return { active: (iTimeLeft > 0), remaining: iTimeLeft, expires: oDate };
            }
            catch (err) { }

            return { active: false, remaining: 0, expires: oDate };
        },

        // pretty much always true now since the routes changed (/combat and /newCombat are both the same page)
        IsNewCombatTab: function() {
          try {
            const routeName = Router._currentRoute.getName();
            const windowUrl = window.location.href;

            if ((routeName === 'battle') || (routeName === 'combat') || (routeName === 'newCombat') || (routeName === 'fight')) {
              return true;
            }

            if ((windowUrl.indexOf('/battle') !== -1) || (windowUrl.indexOf('/combat') !== -1) || (windowUrl.indexOf('/newCombat') !== -1) || (windowUrl.indexOf('/fight') !== -1)) {
              return true;
            }
          } catch (err) {
          }

          return false;
        },

        GetActiveTab: function()
        {
          let active_tab = "";
          let current_route = Router._currentRoute.getName();

          if ((current_route === "overview") || (current_route === "gameHome")) active_tab = "home";
          if ((current_route === "mine") || (current_route === "mining") || (current_route === "minePit")) active_tab = "mining";
          if ((current_route === "items") || (current_route === "inventory") || (current_route === "craft") || (current_route === "crafting")) active_tab = "crafting";
          if ((current_route === "battle") || (current_route === "combat") || (current_route === "newCombat") || (current_route === "fight")) active_tab = "combat";
          if ((current_route === "woodcut") || (current_route === "woodcutting") || (current_route === "lumber") || (current_route === "lumbering")) active_tab = "woodcutting";
          if ((current_route === "farm") || (current_route === "farming")) active_tab = "farming";
          if ((current_route === "inscribe") || (current_route === "inscribing") || (current_route === "inscription") || (current_route === "enchantments") || (current_route === "alchemy")) active_tab = "inscription";
          if ((current_route === "magic") || (current_route === "astro") || (current_route === "astrology") || (current_route === "astronomy") || (current_route === "spells") || (current_route === "spellBook")) active_tab = "magic";
          if ((current_route === "faq") || (current_route === "help")) active_tab = "faq";
          if (current_route === "chat") active_tab = "chat";
          if ((current_route === "skills") || (current_route === "leaderboard") || (current_route === "ranking") || (current_route === "ranks")) active_tab = "skills";
          if (current_route === "achievements") active_tab = "achievements";
          if ((current_route === "updates") || (current_route === "patchNotes") || (current_route === "changelog") || (current_route === "changes") || (current_route === "news")) active_tab = "updates";

          if (active_tab === "") {
            if (window.location.href.indexOf("/gameHome") !== -1) active_tab = "home";
            if (window.location.href.indexOf("/overview") !== -1) active_tab = "home";
            if (window.location.href.indexOf("/mine") !== -1) active_tab = "mining";
            if (window.location.href.indexOf("/mining") !== -1) active_tab = "mining";
            if (window.location.href.indexOf("/minePit") !== -1) active_tab = "mining";
            if (window.location.href.indexOf("/items") !== -1) active_tab = "crafting";
            if (window.location.href.indexOf("/inventory") !== -1) active_tab = "crafting";
            if (window.location.href.indexOf("/craft") !== -1) active_tab = "crafting";
            if (window.location.href.indexOf("/crafting") !== -1) active_tab = "crafting";
            if (window.location.href.indexOf("/battle") !== -1) active_tab = "combat";
            if (window.location.href.indexOf("/combat") !== -1) active_tab = "combat";
            if (window.location.href.indexOf("/newCombat") !== -1) active_tab = "combat";
            if (window.location.href.indexOf("/fight") !== -1) active_tab = "combat";
            if (window.location.href.indexOf("/woodcut") !== -1) active_tab = "woodcutting";
            if (window.location.href.indexOf("/woodcutting") !== -1) active_tab = "woodcutting";
            if (window.location.href.indexOf("/lumber") !== -1) active_tab = "woodcutting";
            if (window.location.href.indexOf("/lumbering") !== -1) active_tab = "woodcutting";
            if (window.location.href.indexOf("/farm") !== -1) active_tab = "farming";
            if (window.location.href.indexOf("/farming") !== -1) active_tab = "farming";
            if (window.location.href.indexOf("/inscribe") !== -1) active_tab = "inscription";
            if (window.location.href.indexOf("/inscribing") !== -1) active_tab = "inscription";
            if (window.location.href.indexOf("/inscription") !== -1) active_tab = "inscription";
            if (window.location.href.indexOf("/enchantments") !== -1) active_tab = "inscription";
            if (window.location.href.indexOf("/alchemy") !== -1) active_tab = "inscription";
            if (window.location.href.indexOf("/magic") !== -1) active_tab = "magic";
            if (window.location.href.indexOf("/astro") !== -1) active_tab = "magic";
            if (window.location.href.indexOf("/astrology") !== -1) active_tab = "magic";
            if (window.location.href.indexOf("/astronomy") !== -1) active_tab = "magic";
            if (window.location.href.indexOf("/spells") !== -1) active_tab = "magic";
            if (window.location.href.indexOf("/spellBook") !== -1) active_tab = "magic";
            if (window.location.href.indexOf("/faq") !== -1) active_tab = "faq";
            if (window.location.href.indexOf("/help") !== -1) active_tab = "faq";
            if (window.location.href.indexOf("/chat") !== -1) active_tab = "chat";
            if (window.location.href.indexOf("/skills") !== -1) active_tab = "skills";
            if (window.location.href.indexOf("/leaderboard") !== -1) active_tab = "skills";
            if (window.location.href.indexOf("/ranking") !== -1) active_tab = "skills";
            if (window.location.href.indexOf("/ranks") !== -1) active_tab = "skills";
            if (window.location.href.indexOf("/achievements") !== -1) active_tab = "achievements";
            if (window.location.href.indexOf("/updates") !== -1) active_tab = "updates";
            if (window.location.href.indexOf("/patchNotes") !== -1) active_tab = "updates";
            if (window.location.href.indexOf("/changelog") !== -1) active_tab = "updates";
            if (window.location.href.indexOf("/changes") !== -1) active_tab = "updates";
            if (window.location.href.indexOf("/news") !== -1) active_tab = "updates";
          }

            return active_tab;
        },

        GetActiveTabSection: function()
        {
            let active_tab_section = "";

            try
            {
                let active_tab = window.ET.MCMF.GetActiveTab();

                if (active_tab === "mining") active_tab_section = Meteor.connection._stores.users._getCollection().find().fetch()[0].uiState.miningTab;
                if (active_tab === "crafting") active_tab_section = Meteor.connection._stores.users._getCollection().find().fetch()[0].uiState.craftingFilter;
                if (active_tab === "combat")
                {
                    if (window.ET.MCMF.IsNewCombatTab())
                        active_tab_section = Meteor.connection._stores.users._getCollection().find().fetch()[0].uiState.newCombatType;
                    else
                        active_tab_section = Meteor.connection._stores.users._getCollection().find().fetch()[0].uiState.combatTab;
                }
                if (active_tab === "farming") active_tab_section = Meteor.connection._stores.users._getCollection().find().fetch()[0].uiState.farmingTab;
                if (active_tab === "inscription") active_tab_section = Meteor.connection._stores.users._getCollection().find().fetch()[0].uiState.inscriptionFilter;
                if (active_tab === "achievements") active_tab_section = Meteor.connection._stores.users._getCollection().find().fetch()[0].uiState.achievementTab;
                if (active_tab === "magic") active_tab_section = Meteor.connection._stores.users._getCollection().find().fetch()[0].uiState.magicTab;

                active_tab_section = active_tab_section.trim().toLowerCase();

                if (active_tab_section === "minepit") active_tab_section = "mine pit";
                if (active_tab_section === "personalquest") active_tab_section = "personal quest";
                if (active_tab_section === "tower") active_tab_section = "the tower";
                if (active_tab_section === "battlelog") active_tab_section = "battle log";
                if (active_tab_section === "pigment") active_tab_section = "pigments";
                if (active_tab_section === "book") active_tab_section = "books";
                if (active_tab_section === "magic_book") active_tab_section = "magic books";
                if (active_tab_section === "spellbook") active_tab_section = "spell book";

                if (active_tab_section.length === 0)
                    throw "Invalid active tab section";
            }
            catch (err)
            {
                try
                {
                    active_tab_section = jQuery(jQuery("a.active").get(1)).text().trim().toLowerCase();

                    if (active_tab_section.length === 0)
                        throw "Invalid active tab section";
                }
                catch (err) { }
            }

            return active_tab_section;
        },

        BattleSocket_UseAbility: function(abil, targ)
        {
            try
            {
                let sMsg = '';

                if (targ === undefined)
                {
                    sMsg = '["action",{"abilityId":"' + abil + '","targets":[],"caster":"' + window.ET.MCMF.UserID + '"}]';
                    if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(`Battle socket emitting: '${sMsg}'`);

                    battleSocket.emit
                    (
                        "action",
                        {
                            abilityId: abil,
                            targets: [],
                            caster: window.ET.MCMF.UserID
                        }
                    );
                }
                else
                {
                    sMsg = '["action",{"abilityId":"' + abil + '","targets":["' + targ + '"],"caster":"' + window.ET.MCMF.UserID + '"}]';
                    if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(`Battle socket emitting: '${sMsg}'`);

                    battleSocket.emit
                    (
                        "action",
                        {
                            abilityId: abil,
                            targets: [targ],
                            caster: window.ET.MCMF.UserID
                        }
                    );
                }
            }
            catch (err) { }
        },

        CallGameCmd: function()
        {
            try
            {
                if (arguments.length > 0)
                {
                    let cmd = arguments[0];
                    let fnc = function() { };

                    if (arguments.length === 1)
                    {
                        if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(`Calling: '${cmd}' with no data`);
                        Package.meteor.Meteor.call(cmd, fnc);
                    }
                    else
                    {
                        let data1, data2, data3, data4;

                        if (typeof arguments[arguments.length - 1] === "function")
                        {
                            fnc = arguments[arguments.length - 1];
                            if (arguments.length >= 3) data1 = arguments[1];
                            if (arguments.length >= 4) data2 = arguments[2];
                            if (arguments.length >= 5) data3 = arguments[3];
                            if (arguments.length >= 6) data4 = arguments[4];
                        }
                        else
                        {
                            if (arguments.length >= 2) data1 = arguments[1];
                            if (arguments.length >= 3) data2 = arguments[2];
                            if (arguments.length >= 4) data3 = arguments[3];
                            if (arguments.length >= 5) data4 = arguments[4];
                        }

                        if (data1 === undefined)
                        {
                        if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(`Calling: '${cmd}' with no data`);
                            Package.meteor.Meteor.call(cmd, fnc);
                        }
                        else if (data2 === undefined)
                        {
                            if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(`Calling: '${cmd}' with { ${JSON.stringify(data1)} }`);
                            Package.meteor.Meteor.call(cmd, data1, fnc);
                        }
                        else if (data3 === undefined)
                        {
                            if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(`Calling: '${cmd}' with { ${JSON.stringify(data1)}, ${JSON.stringify(data2)} }`);
                            Package.meteor.Meteor.call(cmd, data1, data2, fnc);
                        }
                        else if (data4 === undefined)
                        {
                            if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(`Calling: '${cmd}' with { ${JSON.stringify(data1)}, ${JSON.stringify(data2)}, ${JSON.stringify(data3)} }`);
                            Package.meteor.Meteor.call(cmd, data1, data2, data3, fnc);
                        }
                        else
                        {
                            if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(`Calling: '${cmd}' with { ${JSON.stringify(data1)}, ${JSON.stringify(data2)}, ${JSON.stringify(data3)}, ${JSON.stringify(data4)} }`);
                            Package.meteor.Meteor.call(cmd, data1, data2, data3, data4, fnc);
                        }
                    }
                }
                else if (window.ET.MCMF.WantDebug)
                    window.ET.MCMF.Log("Meteor::Warning, CallGameCmd() with no arguments!");
            }
            catch (err)
            {
                if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("Meteor::Exception in CallGameCmd():");
                if (window.ET.MCMF.WantDebug) console.log(err);
            }
        },

        SendGameCmd: function(cmd)
        {
            try
            {
                Meteor.connection._send(cmd);
            if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(`Meteor::Sending: ${JSON.stringify(cmd)}`);
            }
            catch (err)
            {
                if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(`Meteor::Exception in SendGameCmd(${JSON.stringify(cmd)}):`);
                if (window.ET.MCMF.WantDebug) console.log(err);
            }
        },

        FasterAbilityUpdates: function()
        {
            try
            {
                window.ET.MCMF.SubscribeToGameChannel("abilities");

                if ((window.ET.MCMF.WantFasterAbilityCDs) && (window.ET.MCMF.FinishedLoading) && (!window.ET.MCMF.InBattle) && (!window.ET.MCMF.AbilitiesReady))
                    window.ET.MCMF.CallGameCmd("abilities.gameUpdate");
            }
            catch (err) { }

            setTimeout(window.ET.MCMF.FasterAbilityUpdates, 2000);
        },

        PlayerInCombat: function()
        {
            return ((window.ET.MCMF.InBattle) || ((window.ET.MCMF.Time() - window.ET.MCMF.TimeLastFight) < 3));
        },

        AbilityCDTrigger: function()
        {
            try
            {
                if ((window.ET.MCMF.FinishedLoading) && (!window.ET.MCMF.PlayerInCombat()))
                {
                    iTotalCD = 0;
                    iTotalCDTest = 0;
                    iHighestCD = 0;

                    window.ET.MCMF.GetAbilities().forEach(function(oThisAbility)
                    {
                        if (oThisAbility.equipped)
                        {
                            if (parseInt(oThisAbility.currentCooldown) > 0)
                            {
                                iTotalCD += parseInt(oThisAbility.currentCooldown);
                                if (iHighestCD < parseInt(oThisAbility.currentCooldown))
                                    iHighestCD = parseInt(oThisAbility.currentCooldown);
                            }
                        }

                        iTotalCDTest += parseInt(oThisAbility.cooldown);
                    });

                    if ((iTotalCDTest > 0) && (iTotalCD === 0))
                    {
                        if (!window.ET.MCMF.AbilitiesReady)
                        {
                            if (!window.ET.MCMF.InitialAbilityCheck)
                            {
                                if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- triggering ET:abilitiesReady -->");
                                window.ET.MCMF.EventTrigger("ET:abilitiesReady");
                            }
                        }

                        window.ET.MCMF.AbilitiesReady = true;
                        window.ET.MCMF.TimeLeftOnCD = 0;
                    }
                    else
                    {
                        window.ET.MCMF.AbilitiesReady = false;
                        window.ET.MCMF.TimeLeftOnCD = iHighestCD;
                    }

                    window.ET.MCMF.InitialAbilityCheck = false;
                }
                else
                {
                    window.ET.MCMF.AbilitiesReady = false;
                    window.ET.MCMF.TimeLeftOnCD = 9999;
                }
            }
            catch (err) { }

            setTimeout(window.ET.MCMF.AbilityCDTrigger, 500);
        },

        BattleFloorRoom: "0.0",
        BattleFirstFrame: undefined,
        BattleUnitList: [],
        BattleUITemplate: undefined,

        LiveBattleData: function()
        {
            try
            {
                if (window.ET.MCMF.BattleUITemplate !== undefined)
                    return window.ET.MCMF.BattleUITemplate.state.get("currentBattle");
            }
            catch (err) { }

            return undefined;
        },

        LastUnitIDList: '',
        InternalBattleTickMonitor: undefined,

		CombatStarted: function(forced)
		{
			if (!window.ET.MCMF.FinishedLoading)
			{
				setTimeout(window.ET.MCMF.CombatStarted, 100);
				return;
			}

			if (forced || (window.ET.MCMF.InternalBattleTickMonitor === undefined) || (window.ET.MCMF.BattleFirstFrame === undefined))
			{
                window.ET.MCMF.InternalBattleTickMonitor = true;

				battleSocket.on('tick', function(oAllData)
				{
					let battleData = window.ET.MCMF.LiveBattleData();

					if (battleData !== undefined)
					{
						/* if (battleData.floor !== undefined)
						{
							let currentFloorRoom = CInt(battleData.floor).toFixed(0) + "." + CInt(battleData.room).toFixed(0);

							if (window.ET.MCMF.BattleFloorRoom !== currentFloorRoom)
							{
								window.ET.MCMF.BattleFloorRoom = currentFloorRoom;
								window.ET.MCMF.BattleFirstFrame = undefined;
							}
						} */

                        let CurrentUnitIDList = '';
                        jQ.makeArray(battleData.enemies).forEach(function(oEnemyUnit)
                        {
                            CurrentUnitIDList += `${oEnemyUnit.id}|`;
                        });

                        let bNewBattleFrameReset = false;
                        jQ.makeArray(battleData.enemies).forEach(function(oEnemyUnit)
                        {
                            if (window.ET.MCMF.LastUnitIDList.indexOf(`${oEnemyUnit.id}|`) === -1)
                                bNewBattleFrameReset = true;
                        });

                        if (bNewBattleFrameReset)
                            window.ET.MCMF.BattleFirstFrame = undefined;

                        window.ET.MCMF.LastUnitIDList = CurrentUnitIDList;

						if (window.ET.MCMF.BattleFirstFrame === undefined)
						{
							window.ET.MCMF.BattleFirstFrame = battleData;

							if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- triggering ET:firstBattleFrame -->");
							window.ET.MCMF.EventTrigger("ET:firstBattleFrame");

                            //window.ET.MCMF.Log("new BattleFirstFrame data:");
                            //console.log(window.ET.MCMF.BattleFirstFrame);
						}

						if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- triggering ET:combatTick -->");
						window.ET.MCMF.EventTrigger("ET:combatTick");
					}
				});
			}
		},

        InitGameTriggers: function()
        {
            if ((Package.meteor.Meteor === undefined) || (Package.meteor.Meteor.connection === undefined) || (Package.meteor.Meteor.connection._stream === undefined) || (Template.currentBattleUi === undefined))
            {
                setTimeout(window.ET.MCMF.InitGameTriggers, 100);
                return;
            }

			window.ET.MCMF.EventSubscribe("ET:navigation", function()
			{
                window.ET.MCMF.InternalBattleTickMonitor = undefined;

                // re-trigger combat-start events when the battle socket is reconnected
				if (window.ET.MCMF.InBattle && window.ET.MCMF.IsNewCombatTab())
					window.ET.MCMF.CombatStarted(true);
			});

			Router.onRun(function()
			{
				if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- triggering ET:navigation -->");
				window.ET.MCMF.EventTrigger("ET:navigation");

                try
                {
                    let sCurrentRoute = Router._currentRoute.getName();

                    if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(`<-- triggering ET:navigation:${sCurrentRoute} -->`);
                    window.ET.MCMF.EventTrigger(`ET:navigation:${sCurrentRoute}`);
                }
                catch (err) { }

				this.next();
			});

            // note: not a trustworthy method to get new battle unit data, since the templates will reuse and not trigger render from room to room
            Blaze._getTemplate("battleUnit").onRendered(function()
            {
                if ((this.data !== undefined) && (this.data.unit !== undefined))
                    window.ET.MCMF.BattleUnitList.push(this);
            });

            Template.currentBattleUi.onCreated(function()
            {
                window.ET.MCMF.BattleUITemplate = this;
            });

            Template.currentBattleUi.onDestroyed(function()
            {
                window.ET.MCMF.BattleUITemplate = undefined;
                window.ET.MCMF.BattleUnitList = [];
            });

            Package.meteor.Meteor.connection._stream.on('message', function(sMeteorRawData)
            {
                //if (window.ET.MCMF.CombatID === undefined)
                //    window.ET.MCMF.GetPlayerCombatData();

                try
                {
                    oMeteorData = JSON.parse(sMeteorRawData);

                    /////////////////////////////////////////////////////////////////////////////////////////////////////////
                    //
                    //  BACKUP TO RETRIEVE USER AND COMBAT IDS
                    //
                    /*
                    if (oMeteorData.collection === "users")
                        if ((window.ET.MCMF.UserID === undefined) || (window.ET.MCMF.UserID.length !== 17))
                            window.ET.MCMF.UserID = oMeteorData.id;

                    if (oMeteorData.collection === "combat")
                        if ((window.ET.MCMF.CombatID === undefined) || (window.ET.MCMF.CombatID.length !== 17))
                            if (oMeteorData.fields.owner === window.ET.MCMF.UserID)
                                window.ET.MCMF.CombatID = oMeteorData.id;
                    */
                    //
                    /////////////////////////////////////////////////////////////////////////////////////////////////////////

                    if (oMeteorData.collection === "battlesList")
                    {
                        window.ET.MCMF.AbilitiesReady = false;

                        if ((oMeteorData.msg === "added") || (oMeteorData.msg === "removed"))
                        {
                            window.ET.MCMF.InternalBattleTickMonitor = undefined;
                            window.ET.MCMF.BattleFirstFrame = undefined;
                            window.ET.MCMF.BattleUnitList = [];
                            window.ET.MCMF.InBattle = (oMeteorData.msg === "added");
                            if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- triggering ET:combat" + (((oMeteorData.msg === "added")) ? ("Start") : ("End")) + " -->");
                            window.ET.MCMF.EventTrigger("ET:combat" + (((oMeteorData.msg === "added")) ? ("Start") : ("End")));

                            if (window.ET.MCMF.InBattle)
                                window.ET.MCMF.CombatStarted();
                            else
                                window.ET.MCMF.BattleFloorRoom = "0.0";
                        }
                    }

                    if ((oMeteorData.collection === "battles") && (oMeteorData.msg === "added"))
                    {
                        if (oMeteorData.fields.finished)
                        {
                            window.ET.MCMF.WonLast = oMeteorData.fields.win;
                            window.ET.MCMF.TimeLastFight = window.ET.MCMF.Time();

							if (window.ET.MCMF.FinishedLoading)
							{
								if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- triggering ET:combat" + ((oMeteorData.fields.win) ? ("Won") : ("Lost")) + " -->");
								window.ET.MCMF.EventTrigger("ET:combat" + ((oMeteorData.fields.win) ? ("Won") : ("Lost")));
							}
                        }
						else
							window.ET.MCMF.CombatStarted();
                    }
                }
                catch (err) { }
            });
        },

        PlayerHP: function()
        {
            return window.ET.MCMF.GetPlayerCombatData().stats.health;
        },

        PlayerHPMax: function()
        {
            return window.ET.MCMF.GetPlayerCombatData().stats.healthMax;
        },

        PlayerEnergy: function()
        {
            return window.ET.MCMF.GetPlayerCombatData().stats.energy;
        },

        AbilityCDCalc: function()
        {
            iTotalCD = 0;
            iTotalCDTest = 0;
            iHighestCD = 0;

            window.ET.MCMF.GetAbilities().forEach(function(oThisAbility)
            {
                if (oThisAbility.equipped)
                {
                    if (parseInt(oThisAbility.currentCooldown) > 0)
                    {
                        iTotalCD += parseInt(oThisAbility.currentCooldown);
                        if (iHighestCD < parseInt(oThisAbility.currentCooldown))
                            iHighestCD = parseInt(oThisAbility.currentCooldown);
                    }
                }

                iTotalCDTest += parseInt(oThisAbility.cooldown);
            });

            if ((iTotalCDTest > 0) && (iTotalCD === 0))
            {
                if (!window.ET.MCMF.AbilitiesReady)
                {
                    if (!window.ET.MCMF.InitialAbilityCheck)
                    {
                        if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- triggering ET:abilitiesReady -->");
                        window.ET.MCMF.EventTrigger("ET:abilitiesReady");
                    }
                }

                window.ET.MCMF.AbilitiesReady = true;
                window.ET.MCMF.TimeLeftOnCD = 0;
            }
            else
            {
                window.ET.MCMF.AbilitiesReady = false;
                window.ET.MCMF.TimeLeftOnCD = iHighestCD;
            }

            window.ET.MCMF.InitialAbilityCheck = false;
        },

        GetUnitCombatData: function(sUnitID)
        {
            let oCombatPlayerData;

            try
            {
                // get recent combat data from stored 'state' data in 'BattleUITemplate' template (comes from 'battleSocket')
                if (window.ET.MCMF.LiveBattleData() !== undefined)
                {

                    jQ.makeArray(window.ET.MCMF.LiveBattleData().units).forEach(function(oCurrentUnit)
                    {
                        if (oCurrentUnit.id === sUnitID)
                            oCombatPlayerData = oCurrentUnit;
                    });
                }
            }
            catch (err) { }

            return oCombatPlayerData;
        },

        GetEnemyCombatData: function(sUnitID)
        {
            let oCombatEnemyData;

            try
            {
                // get recent combat data from stored 'state' data in 'BattleUITemplate' template (comes from 'battleSocket')
                if (window.ET.MCMF.LiveBattleData() !== undefined)
                {
                    jQ.makeArray(window.ET.MCMF.LiveBattleData().enemies).forEach(function(oCurrentUnit)
                    {
                        if (oCurrentUnit.id === sUnitID)
                            oCombatEnemyData = oCurrentUnit;
                    });
                }
            }
            catch (err) { }

            return oCombatEnemyData;
        },

        GetPlayerCombatData: function()
        {
            try
            {
                Meteor.connection._stores.combat._getCollection().find().fetch().forEach(function(oThisCombatUnit)
                {
                    if (oThisCombatUnit.owner === window.ET.MCMF.UserID)
                        window.ET.MCMF.PlayerUnitData = oThisCombatUnit;
                });

                // new: get updated combat data from stored 'state' data in 'BattleUITemplate' template (comes from 'battleSocket')
                if (window.ET.MCMF.LiveBattleData() !== undefined)
                {
                    jQ.makeArray(window.ET.MCMF.LiveBattleData().units).forEach(function(oCurrentUnit)
                    {
                        if (oCurrentUnit.id === window.ET.MCMF.UserID)
                            window.ET.MCMF.PlayerUnitData = oCurrentUnit;
                    });
                }
            }
            catch (err) { }

            return window.ET.MCMF.PlayerUnitData;
        },

        GetAbilities: function()
        {
            return Meteor.connection._stores.abilities._getCollection().find().fetch()[0].learntAbilities;
        },

        GetAdventures: function()
        {
            let oAdventureDetails = { AllAdventures: [], ShortAdventures: [], LongAdventures: [], EpicAdventures: [], PhysicalAdventures: [], MagicalAdventures: [], ActiveAdventures: [], CurrentAdventure: undefined };

            // oThisAdventure
            //    .duration     {duration in seconds} (integer)
            //    .endDate      {end date/time} (Date()) (property only exists if the adventure is ongoing)
            //    .floor        {corresponding Tower Floor} (integer)
            //    .icon         "{imageofbattle.ext}" (string)
            //    .id           "{guid}" (13-digit alphanumeric string)
            //    .length       "short" / "long" / "epic" (string)
            //    .level        {general level} (integer)
            //    .name         "{Name of Battle}" (string)
            //    .room         {corresponding Tower Room in Tower Floor} (integer)
            //    .type         "physical" / "magic" (string)
            //    .startDate    {start date/time} (Date()) (property only exists if the adventure is ongoing)
            window.ET.MCMF.GetAdventures_raw().forEach(function(oThisAdventure)
            {
                try
                {
                    oAdventureDetails.AllAdventures.push(oThisAdventure);
                    if (oThisAdventure.length  === "short")    oAdventureDetails.ShortAdventures   .push(oThisAdventure);
                    if (oThisAdventure.length  === "long")     oAdventureDetails.LongAdventures    .push(oThisAdventure);
                    if (oThisAdventure.length  === "epic")     oAdventureDetails.EpicAdventures    .push(oThisAdventure);
                    if (oThisAdventure.type    === "physical") oAdventureDetails.PhysicalAdventures.push(oThisAdventure);
                    if (oThisAdventure.type    === "magic")    oAdventureDetails.MagicalAdventures .push(oThisAdventure);
                    if (oThisAdventure.endDate !== undefined)  oAdventureDetails.ActiveAdventures  .push(oThisAdventure);
                }
                catch (err) { }
            });

            oAdventureDetails.AllAdventures.sort(function(advA, advB)
            {
                if ((advA.startDate === undefined) && (advB.startDate !== undefined)) return 1;
                if ((advA.startDate !== undefined) && (advB.startDate === undefined)) return -1;
                if ((advA.startDate !== undefined) && (advB.startDate !== undefined))
                {
                    if (advA.startDate > advB.startDate) return 1;
                    if (advA.startDate < advB.startDate) return -1;
                }
                if (advA.duration > advB.duration) return 1;
                if (advA.duration < advB.duration) return -1;
                return 0;
            });

            oAdventureDetails.ActiveAdventures.sort(function(advA, advB)
            {
                if (advA.startDate > advB.startDate) return 1;
                if (advA.startDate < advB.startDate) return -1;
                return 0;
            });

            oAdventureDetails.PhysicalAdventures.sort(function(advA, advB)
            {
                if (advA.duration > advB.duration) return 1;
                if (advA.duration < advB.duration) return -1;
                return 0;
            });

            oAdventureDetails.MagicalAdventures.sort(function(advA, advB)
            {
                if (advA.duration > advB.duration) return 1;
                if (advA.duration < advB.duration) return -1;
                return 0;
            });

            if (oAdventureDetails.ActiveAdventures.length > 0)
                oAdventureDetails.CurrentAdventure = oAdventureDetails.ActiveAdventures[0];

            return oAdventureDetails;
        },

        GetAdventures_raw: function()
        {
            try
            {
                return Meteor.connection._stores.adventures._getCollection().find().fetch()[0].adventures;
            }
            catch (err) { }

            return [];
        },

        GetChats: function()
        {
            return Meteor.connection._stores.simpleChats._getCollection().find().fetch();
        },

        GetItem: function(in__id)
        {
            let oItems = window.ET.MCMF.GetItems({_id: in__id});

            if (oItems.length > 0)
                return oItems[0];

            return {};
        },

        GetItems: function()
        {
            let oItems;

            if (arguments.length === 0)
                oItems = jQ.makeArray(Meteor.connection._stores.items._getCollection().find().fetch());
            else
                oItems = jQ.makeArray(Meteor.connection._stores.items._getCollection().find(arguments[0]).fetch());

            for (let i = 0; i < oItems.length; i++)
                oItems[i] = window.ET.MCMF.AddItemConsts(oItems[i]);

            return oItems;
        },

        AddItemConsts: function(oItem)
        {
            let oItemNew;
            let consts;

            try
            {
                consts = (IsValid(window) && IsValid(window.gameConstants)) ? window.gameConstants : (IsValid(unsafeWindow) && IsValid(unsafeWindow.gameConstants)) ? unsafeWindow.gameConstants : { };

                oItemNew = { ...(oItem) };
                oItemNew = { ...(oItemNew), ...(consts.ITEMS[oItemNew.itemId]) };

                if (IsValid(oItemNew.produces) && IsValid(consts.FARMING) && IsValid(consts.FARMING.plants))
                {
                    oItemNew.plantingDetails = consts.FARMING.plants[oItemNew.produces];

                    if (IsValid(oItemNew.plantingDetails))
                        oItemNew.required = oItemNew.plantingDetails.required;
                }
            }
            catch (err) { }

            try
            {
                oItemNew = { ...(oItemNew), ...(oItem) };
                oItemNew.stats = sumObjectsByKey(oItem.extraStats, consts.ITEMS[oItem.itemId].stats);
            }
            catch (err) { }

            try
            {
                if (typeof oItemNew['description'] === 'function')
                    oItemNew.description = oItemNew.description();
            }
            catch (err) { }

            return oItemNew;
        },

        GetItemConsts: function(sItemID)
        {
            let oItemNew;
            let consts;

            try
            {
                consts = (IsValid(window) && IsValid(window.gameConstants)) ? window.gameConstants : (IsValid(unsafeWindow) && IsValid(unsafeWindow.gameConstants)) ? unsafeWindow.gameConstants : { };

                oItemNew = consts.ITEMS[sItemID];

                if (IsValid(oItemNew.produces) && IsValid(consts.FARMING) && IsValid(consts.FARMING.plants))
                {
                    oItemNew.plantingDetails = consts.FARMING.plants[oItemNew.produces];

                    if (IsValid(oItemNew.plantingDetails))
                        oItemNew.required = oItemNew.plantingDetails.required;
                }
            }
            catch (err) { }

            try
            {
                if (typeof oItemNew['description'] === 'function')
                    oItemNew.description = oItemNew.description();
            }
            catch (err) { }

            return oItemNew;
        },

        GetSkills: function()
        {
            return Meteor.connection._stores.skills._getCollection().find().fetch();
        },

        Setup: function()
        {
            if ((!window.ET.MCMF.TryingToLoad) && (!window.ET.MCMF.FinishedLoading))
            {
                // use whatever version of jQuery available to us
                $("body").append("<div id=\"ET_meancloud_bootstrap\" style=\"visibility: hidden; display: none;\"></div>");
                window.ET.MCMF.TryingToLoad = true;
                window.ET.MCMF.Setup_Initializer();
            }
        },

        Setup_Initializer: function()
        {
            // wait for Meteor availability
            if ((Package === undefined) || (Package.meteor === undefined) || (Package.meteor.Meteor === undefined) || (Package.meteor.Meteor.connection === undefined) || (Package.meteor.Meteor.connection._stream === undefined))
            {
                setTimeout(window.ET.MCMF.Setup_Initializer, 10);
                return;
            }

            if (!window.ET.MCMF.Initialized)
            {
                window.ET.MCMF.Initialized = true;
                window.ET.MCMF.Setup_SendDelayedInitializer();
                window.ET.MCMF.InitGameTriggers();
                window.ET.MCMF.Setup_remaining();
            }
        },

        Setup_SendDelayedInitializer: function()
        {
            try
            {
                jQ("div#ET_meancloud_bootstrap").trigger("ET:initialized");
                window.ET.MCMF.EventTrigger("ET:initialized");
            }
            catch (err)
            {
                setTimeout(window.ET.MCMF.Setup_SendDelayedInitializer, 100);
            }
        },

        Setup_remaining: function()
        {
            try
            {
                if (Meteor === undefined) throw "[MCMF Setup] Not loaded yet: Meteor not initialized";
                if (Meteor.connection === undefined) throw "[MCMF Setup] Not loaded yet: Meteor not initialized";
                if (Meteor.connection._userId === undefined) throw "[MCMF Setup] Not loaded yet: Meteor not initialized";

                window.ET.MCMF.UserID = Meteor.connection._userId;
                //window.ET.MCMF.UserName = Meteor.connection._stores.users._getCollection()._collection._docs._map[window.ET.MCMF.UserID].username;
				window.ET.MCMF.UserName = [...Meteor.connection._stores.users._getCollection()._collection._docs._map.values()][0].username;
                window.ET.MCMF.GetPlayerCombatData();

                if (window.ET.MCMF.GetAbilities().length < 0) throw "[MCMF Setup] Not loaded yet: no abilities";
                if (window.ET.MCMF.GetItems().length < 0) throw "[MCMF Setup] Not loaded yet: no items";
                if (window.ET.MCMF.GetChats().length < 0) throw "[MCMF Setup] Not loaded yet: no chats";
                if (window.ET.MCMF.GetSkills().length < 0) throw "[MCMF Setup] Not loaded yet: no skills";

                // if the above is all good, then this should be no problem:

                window.ET.MCMF.AbilityCDTrigger();     // set up ability CD trigger
                window.ET.MCMF.AbilityCDCalc();
                window.ET.MCMF.FasterAbilityUpdates(); // set up faster ability updates (do not disable, this is controlled via configurable setting)

                // trigger finished-loading event
                if (!window.ET.MCMF.FinishedLoading)
                {
                    if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- triggering ET:loaded -->");
                    window.ET.MCMF.EventTrigger("ET:loaded");
                    window.ET.MCMF.FinishedLoading = true;
                }
            }
            catch (err) // any errors and we retry setup
            {
                if (err.toString().indexOf("[MCMF Setup]") !== -1)
                {
                    window.ET.MCMF.Log("ET MCMF setup exception:");
                    console.log(err);
                }

                setTimeout(window.ET.MCMF.Setup_remaining, 500);
            }
        },

        // Ready means the mod framework has been initialized, but Meteor is not yet available
        Ready: function(fnCallback, sNote)
        {
            if (!window.ET.MCMF.Initialized)
                window.ET.MCMF.EventSubscribe("initialized", fnCallback, sNote);
            else
                fnCallback();
        },

        // Loaded means the mod framework and Meteor are fully loaded and available
        Loaded: function(fnCallback, sNote)
        {
            if (!window.ET.MCMF.FinishedLoading)
                window.ET.MCMF.EventSubscribe("loaded", fnCallback, sNote);
            else
                fnCallback();
        },
    };

    window.ET.MCMF.Setup();
}
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
////////// ** CORE SCRIPT STARTUP -- DO NOT MODIFY ** //////////
function LoadJQ(callback) {
    if (window.jQ === undefined) { var script=document.createElement("script");script.setAttribute("src","//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js");script.addEventListener('load',function() {
        var subscript=document.createElement("script");subscript.textContent="window.jQ=jQuery.noConflict(true);("+callback.toString()+")();";document.body.appendChild(subscript); },
    !1);document.body.appendChild(script); } else callback(); } LoadJQ(startup);
////////////////////////////////////////////////////////////////
