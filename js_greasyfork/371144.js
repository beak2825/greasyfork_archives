// ==UserScript==
// @name          Eternity Tower Heal Buttons
// @icon          https://www.eternitytower.net/favicon.png
// @namespace     http://mean.cloud/
// @version       1.03.3
// @description   Adds healing buttons to players in battle
// @match         *://eternitytower.net/*
// @match         *://www.eternitytower.net/*
// @author        psouza4@gmail.com
// @copyright     2018-2023, MeanCloud
// @run-at        document-end
// @grant         GM_getValue
// @grant         GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/371144/Eternity%20Tower%20Heal%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/371144/Eternity%20Tower%20Heal%20Buttons.meta.js
// ==/UserScript==


////////////////////////////////////////////////////////////////
////////////// ** SCRIPT GLOBAL INITIALIZATION ** //////////////
ET_PlayerHealButtonsMod_Settings = {};
function startup() { ET_PlayerHealButtonsMod(); }
////////////////////////////////////////////////////////////////


ET_PlayerHealButtonsMod = function()
{
    ET.MCMF.Ready(function()
    {
        ET_PlayerHealButtonsMod_Settings.DisplayMode = CInt(GM_getValue("PETHealButtons_DisplayMode")); // default 0
    });
    
    ET.MCMF.EventSubscribe("ET:combatTick", function()
    {
        try
        {
            if (ET.MCMF.LiveBattleData() !== undefined)
            {
                let battleData = ET.MCMF.LiveBattleData();

                var PlayerSpell_WaterDart = { present: false, data: undefined, html: "" };
                var PlayerSpell_WaterBall = { present: false, data: undefined, html: "" };
                var PlayerSpell_Mending   = { present: false, data: undefined, html: "" };
                
                var sHTML_AbilityMissing = "<div class=\"MCETMod_PlayerHealBX item-icon-container item tiny icon-box disabled\"><img class=\"item-icon\" style=\"cursor: not-allowed;\" ";
                var sHTML_AbilityOnCD    = "<div class=\"MCETMod_PlayerHealBX item-icon-container item tiny icon-box disabled\"><img class=\"item-icon\" style=\"cursor: wait;\" ";
                var sHTML_AbilityReady   = "<div class=\"MCETMod_PlayerHealBX item-icon-container item tiny icon-box\"><img class=\"item-icon\" style=\"cursor: pointer;\" ";
                
                var oThePlayer;
                
                jQ.makeArray(battleData.units).forEach(function(oCurrentPlayer)
                {
                    if (oCurrentPlayer.name === ET.MCMF.UserName)
                    {
                        oThePlayer = oCurrentPlayer;
                        
                        jQ.makeArray(oThePlayer.abilities).forEach(function(oCurrentAbility)
                        {
                            if (oCurrentAbility.id === "water_dart")
                            {
                                PlayerSpell_WaterDart.present = true;
                                PlayerSpell_WaterDart.data = oCurrentAbility;
                            }
                            else if (oCurrentAbility.id === "water_ball")
                            {
                                PlayerSpell_WaterBall.present = true;
                                PlayerSpell_WaterBall.data = oCurrentAbility;
                            }
                            else if (oCurrentAbility.id === "mending_water")
                            {
                                PlayerSpell_Mending.present = true;
                                PlayerSpell_Mending.data = oCurrentAbility;
                            }
                        });
                    }
                });
                
                if (PlayerSpell_WaterDart.present)
                {
                    if (CDbl(PlayerSpell_WaterDart.data.currentCooldown) > 0.1)
                        PlayerSpell_WaterDart.html = sHTML_AbilityOnCD;
                    else
                        PlayerSpell_WaterDart.html = sHTML_AbilityReady;
                }
                else
                {
                    PlayerSpell_WaterDart.html = sHTML_AbilityMissing;
                    PlayerSpell_WaterDart.data = { id: '' };
                }
                
                if (PlayerSpell_WaterBall.present)
                {
                    if (CDbl(PlayerSpell_WaterBall.data.currentCooldown) > 0.1)
                        PlayerSpell_WaterBall.html = sHTML_AbilityOnCD;
                    else
                        PlayerSpell_WaterBall.html = sHTML_AbilityReady;
                }
                else
                {
                    PlayerSpell_WaterBall.html = sHTML_AbilityMissing;
                    PlayerSpell_WaterBall.data = { id: '' };
                }
                
                if (PlayerSpell_Mending.present)
                {
                    if (CDbl(PlayerSpell_Mending.data.currentCooldown) > 0.1)
                        PlayerSpell_Mending.html = sHTML_AbilityOnCD;
                    else
                        PlayerSpell_Mending.html = sHTML_AbilityReady;
                }
                else
                {
                    PlayerSpell_Mending.html = sHTML_AbilityMissing;
                    PlayerSpell_Mending.data = { id: '' };
                }
                
                if (PlayerSpell_WaterDart.present || PlayerSpell_WaterBall.present || PlayerSpell_Mending.present)
                {
                    if (jQ(".PETHealOptionsB1").length === 0)
                    {
                        //jQ(".PETHealOptionsB1").remove();
                        jQ("div.buff-icon-container > img[src=\"/icons/amulet.svg\"").parent().parent().prepend
                            ("<div id=\"PETHealOptionsB1\" class=\"PETHealOptionsB1 buff-icon-container icon-box medium-icon btn btn-primary\" style=\"text-muted\"></div>");

                        ET_PlayerHealButtonsMod_CreateTooltip();
                        
                        if (ET_PlayerHealButtonsMod_Settings.DisplayMode === 0)
                            jQ(".PETHealOptionsB1").html("<span style=\"font-size: 8pt; line-height: 10pt;\">Heal<br />Percent</span>");
                        else if (ET_PlayerHealButtonsMod_Settings.DisplayMode === 1)
                            jQ(".PETHealOptionsB1").html("<span style=\"font-size: 8pt; line-height: 10pt;\">Heal<br />Amounts</span>");
                        else if (ET_PlayerHealButtonsMod_Settings.DisplayMode === 2)
                            jQ(".PETHealOptionsB1").html("<span style=\"font-size: 8pt; line-height: 10pt;\">Heal<br />Hidden</span>");
                            
                        jQ(".PETHealOptionsB1").click(function()
                        {
                            ET_PlayerHealButtonsMod_Settings.DisplayMode = (ET_PlayerHealButtonsMod_Settings.DisplayMode + 1) % 3;
                            
                            GM_setValue("PETHealButtons_DisplayMode", ET_PlayerHealButtonsMod_Settings.DisplayMode);
                            
                            jQ(".MCETMod_PlayerHeal").remove();
                            
                            if (ET_PlayerHealButtonsMod_Settings.DisplayMode === 0)
                                jQ(".PETHealOptionsB1").html("<span style=\"font-size: 8pt; line-height: 10pt;\">Heal<br />Percent</span>");
                            else if (ET_PlayerHealButtonsMod_Settings.DisplayMode === 1)
                                jQ(".PETHealOptionsB1").html("<span style=\"font-size: 8pt; line-height: 10pt;\">Heal<br />Amounts</span>");
                            else if (ET_PlayerHealButtonsMod_Settings.DisplayMode === 2)
                                jQ(".PETHealOptionsB1").html("<span style=\"font-size: 8pt; line-height: 10pt;\">Heal<br />Hidden</span>");
                        });
                    }
                    
                    jQ.makeArray(battleData.units).forEach(function(oCurrentPlayer, index, array)
                    {
                        jQ("div.battle-unit-container").each(function()
                        {
                            try
                            {
                                if (jQ(this).find("img#" + oCurrentPlayer.id.toString()).length === 0)
                                    return;

                                var iHeal_WaterDart = ET_PlayerHealButtonsMod_WaterDartHealing(oThePlayer, oCurrentPlayer);
                                var iHeal_WaterBall = ET_PlayerHealButtonsMod_WaterBallHealing(oThePlayer, oCurrentPlayer);
                                var iHeal_Mending   = ET_PlayerHealButtonsMod_MendingHealing  (oThePlayer, oCurrentPlayer);

                                var sBoxForWaterDartIcon = PlayerSpell_WaterDart.html + "src=\"/icons/waterDart.svg\"    onclick=\"javascript:ET_PlayerHealButtonsMod_CastAtTarget('" + PlayerSpell_WaterDart.data.id + "', '" + oCurrentPlayer.id.toString() + "');\"></div>";
                                var sBoxForWaterBallIcon = PlayerSpell_WaterBall.html + "src=\"/icons/waterBall.svg\"    onclick=\"javascript:ET_PlayerHealButtonsMod_CastAtTarget('" + PlayerSpell_WaterBall.data.id + "', '" + oCurrentPlayer.id.toString() + "');\"></div>";
                                var sBoxForMendingIcon   = PlayerSpell_Mending.html   + "src=\"/icons/mendingWater.svg\" onclick=\"javascript:ET_PlayerHealButtonsMod_CastAtTarget('" + PlayerSpell_Mending.data.id   + "', '" + oCurrentPlayer.id.toString() + "');\"></div>";
                                
                                // alter data for boxes
                                var oP = jQ(this).parent().find(".MCETMod_PlayerHeal");
                                var abilityboxes = ""; try { abilityboxes = CondenseSpacing(ChopperBlank(oP.html(), "", "<div class=\"buff-icon-container")).trim(); } catch (err) { }
                                
                                /*
                                ET.MCMF.Log("::: COMPARING :::");
                                if (oP === "")
                                    ET.MCMF.Log("no boxes!"); 
                                else
                                {
                                    ET.MCMF.Log(abilityboxes); 
                                    ET.MCMF.Log(abilityboxes.indexOf(CondenseSpacing(sBoxForWaterDartIcon)).toString());
                                    ET.MCMF.Log(abilityboxes.indexOf(CondenseSpacing(sBoxForWaterBallIcon)).toString());
                                    ET.MCMF.Log(abilityboxes.indexOf(CondenseSpacing(sBoxForMendingIcon)).toString());
                                }
                                ET.MCMF.Log("::: DONE :::");
                                */
                                
                                if
                                (
                                    (abilityboxes.indexOf(CondenseSpacing(sBoxForWaterDartIcon)) === -1) ||
                                    (abilityboxes.indexOf(CondenseSpacing(sBoxForWaterBallIcon)) === -1) ||
                                    (abilityboxes.indexOf(CondenseSpacing(sBoxForMendingIcon))   === -1)
                                )
                                {
                                    // paint new boxes

                                    //ET.MCMF.Log("::: CDs cleared or used, repainting boxes :::");
                                    
                                    jQ(this).parent().find(".MCETMod_PlayerHeal").remove();
                                    
                                    if (ET_PlayerHealButtonsMod_Settings.DisplayMode === 2)
                                    {
                                        jQ(this).parent().find("img#" + oCurrentPlayer.id.toString()).after
                                        (
                                            "<div class=\"MCETMod_PlayerHeal\">" +
                                            sBoxForWaterDartIcon +
                                            sBoxForWaterBallIcon +
                                            sBoxForMendingIcon +
                                            "</div>"
                                        );
                                    }
                                    else
                                    {
                                        jQ(this).parent().find("img#" + oCurrentPlayer.id.toString()).after
                                        (
                                            "<div class=\"MCETMod_PlayerHeal\" style=\"width: 122px; max-width: 122px; min-width: 122px;\">" +
                                            sBoxForWaterDartIcon +
                                            sBoxForWaterBallIcon +
                                            sBoxForMendingIcon +
                                            "<br />" + 
                                            "<div class=\"MCETMod_PlayerHealB1Det buff-icon-container icon-box small-icon drop-target\"><span class=\"cooldown-text\" style=\"font-size: 16px; font-weight: bold;\"></span></div>" + 
                                            "<div class=\"MCETMod_PlayerHealB2Det buff-icon-container icon-box small-icon drop-target\"><span class=\"cooldown-text\" style=\"font-size: 16px; font-weight: bold;\"></span></div>" + 
                                            "<div class=\"MCETMod_PlayerHealB3Det buff-icon-container icon-box small-icon drop-target\"><span class=\"cooldown-text\" style=\"font-size: 16px; font-weight: bold;\"></span></div>" + 
                                            "</div>"
                                        );
                                    }
                                }

                                jQ(this).parent().find(".MCETMod_PlayerHealB1Det").removeClass("disabled").addClass(((PlayerSpell_WaterDart.present) ? ((PlayerSpell_WaterDart.data.currentCooldown > 0.0) ? "" : " disabled") : " disabled")).html("<span class=\"cooldown-text\" style=\"font-size: 12px; font-weight: bold;\">" + ET_PlayerHealButtonsMod_HealText(PlayerSpell_WaterDart, iHeal_WaterDart) + "</span>");
                                jQ(this).parent().find(".MCETMod_PlayerHealB2Det").removeClass("disabled").addClass(((PlayerSpell_WaterBall.present) ? ((PlayerSpell_WaterBall.data.currentCooldown > 0.0) ? "" : " disabled") : " disabled")).html("<span class=\"cooldown-text\" style=\"font-size: 12px; font-weight: bold;\">" + ET_PlayerHealButtonsMod_HealText(PlayerSpell_WaterBall, iHeal_WaterBall) + "</span>");
                                jQ(this).parent().find(".MCETMod_PlayerHealB3Det").removeClass("disabled").addClass(((PlayerSpell_Mending  .present) ? ((PlayerSpell_Mending  .data.currentCooldown > 0.0) ? "" : " disabled") : " disabled")).html("<span class=\"cooldown-text\" style=\"font-size: 12px; font-weight: bold;\">" + ET_PlayerHealButtonsMod_HealText(PlayerSpell_Mending,   iHeal_Mending)   + "</span>");
                            }
                            catch (err) { }
                        });
                    });
                }
                else
                {
                    jQ(".PETHealOptionsB1").remove(); // not able to heal, remove heal buttons menu/options
                    jQ(".MCETMod_PlayerHeal").remove(); // not able to heal, remove all heal buttons
                }
            }
        }
        catch (err) { }
    });
};

ET_PlayerHealButtonsMod_CreateTooltip = function()
{
    oEl = jQ("#PETHealOptionsB1").get(0);
    if (!oEl)
        return;

    if (oEl._tippy)
        oEl._tippy.destroy();

    jQ("#tooltip-PETHealOptionsB1").remove();
    jQ("body").append("<div class=\"item-tooltip-content my-tooltip-inner\" id=\"tooltip-PETHealOptionsB1\"></div>");

    jQ("#tooltip-PETHealOptionsB1").html
    (
        "    <h3 class=\"popover-title\">" +
        "        Heal Buttons Addon" +
        "    </h3>" +
        "    <div class=\"popover-content\">" +
        "        You can click this button to toggle between<br />" +
        "        showing the current amount a heal spell will heal<br />" +
        "        the target, the current efficiency percent of using<br />" +
        "        the spell, or to hide the extra healing details." +
        "    </div>"
    );    

    tippy("#PETHealOptionsB1",
    {
        html: jQ("#tooltip-PETHealOptionsB1")[0],
        performance: !0,
        animateFill: !1,
        distance: 5
    });
};

ET_PlayerHealButtonsMod_HealText = function(oSpell, oHealData)
{
    if (!oSpell.present) return "&nbsp;";
    
    if (ET_PlayerHealButtonsMod_Settings.DisplayMode === 1)
        return oHealData.actualHealed.toFixed(0);
    
    if (ET_PlayerHealButtonsMod_Settings.DisplayMode === 0)
    {
        var oPctHealed = CInt(Math.ceil(CDbl(oHealData.actualHealed * 100) / CDbl(oHealData.uncappedHeal)));
        
        return oPctHealed.toString() + "%";
    }
    
    return "&nbsp;";
};

ET_PlayerHealButtonsMod_WaterDartHealing = function(oHeroDetails, oTargetDetails)
{
    try
    {
        var dHealAmount = 3.0 + oHeroDetails.stats.magicPower;
        dHealAmount *= (1.0 + (oHeroDetails.stats.healingPower / 100.0));
        var dUncappedHealAmount = dHealAmount;

        var dHPCost = 5.0 + (oHeroDetails.stats.magicPower * 0.15);

        var dHPCeiling = oTargetDetails.stats.healthMax;
        
        if (oHeroDetails.id === oTargetDetails.id)
            dHPCeiling -= dHPCost;

        if (dHealAmount + oTargetDetails.stats.health > dHPCeiling)
            dHealAmount = dHPCeiling - oTargetDetails.stats.health;
        
        return { actualHealed: Math.floor(dHealAmount), uncappedHeal: Math.floor(dUncappedHealAmount) };
    }
    catch (err) { }
    
    return { actualHealed: -1, uncappedHeal: -1 };
};

ET_PlayerHealButtonsMod_WaterBallHealing = function(oHeroDetails, oTargetDetails)
{
    try
    {
        var dHealAmount = 10.0 + (oHeroDetails.stats.magicPower * 1.25);
        dHealAmount *= (1.0 + (oHeroDetails.stats.healingPower / 100.0));
        var dUncappedHealAmount = dHealAmount;

        var dHPCost = 10.0 + (oHeroDetails.stats.magicPower * 0.13);

        var dHPCeiling = oTargetDetails.stats.healthMax;
        
        if (oHeroDetails.id === oTargetDetails.id)
            dHPCeiling -= dHPCost;

        if (dHealAmount + oTargetDetails.stats.health > dHPCeiling)
            dHealAmount = dHPCeiling - oTargetDetails.stats.health;
        
        return { actualHealed: Math.floor(dHealAmount), uncappedHeal: Math.floor(dUncappedHealAmount) };
    }
    catch (err) { }
    
    return { actualHealed: -1, uncappedHeal: -1 };
};

ET_PlayerHealButtonsMod_MendingHealing = function(oHeroDetails, oTargetDetails)
{
    try
    {
        var dHealAmount = 2.0 + (oHeroDetails.stats.magicPower * 0.50);
        dHealAmount *= (1.0 + (oHeroDetails.stats.healingPower / 100.0));
        dHealAmount *= 5; // five ticks per cast
        var dUncappedHealAmount = dHealAmount;

        var dHPCost = 25.0 + (oHeroDetails.stats.magicPower * 0.30);

        var dHPCeiling = oTargetDetails.stats.healthMax;
        
        if (oHeroDetails.id === oTargetDetails.id)
            dHPCeiling -= dHPCost;

        if (dHealAmount + oTargetDetails.stats.health > dHPCeiling)
            dHealAmount = dHPCeiling - oTargetDetails.stats.health;
        
        return { actualHealed: Math.floor(dHealAmount), uncappedHeal: Math.floor(dUncappedHealAmount) };
    }
    catch (err) { }
    
    return { actualHealed: -1, uncappedHeal: -1 };
};

ET_PlayerHealButtonsMod_CastAtTarget = function(spell_name, which_id)
{
    // this is no longer sent in the main websocket
    //ET.MCMF.CallGameCmd("battles.castAbility", MCETMod_CurrentBattleListID, spell_name, { "targets": [which_id], "caster": ET.MCMF.UserID });
    
    // it's now sent in the battleSocket using battleSocket.emit()
    ET.MCMF.BattleSocket_UseAbility(spell_name, which_id);
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
    shiftclickOrig.currentTarget = target;
	shiftclickOrig.shiftKey = true;

	let shiftclick = jQ.Event("click");
    //shiftclick.type = "click"; // "mousedown" ?
    shiftclick.which = 1; // 1 = left, 2 = middle, 3 = right
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
    var sec_num = parseInt(this, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
};
    
is_visible = (function () {
    var x = window.pageXOffset ? window.pageXOffset + window.innerWidth - 1 : 0,
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
        var rect = elem.getBoundingClientRect();
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
            var el = elem,
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
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
////////////// ** common_ET.js -- DO NOT MODIFY ** /////////////
if (window.ET === undefined) window.ET = { };
if ((window.ET.MCMF === undefined) || (CDbl(window.ET.MCMF.version) < 1.06)) // MeanCloud mod framework
{
    window.ET.MCMF =
    {
        version: 1.06,
        
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

        CombatID: undefined,
        BattleID: undefined,

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
                newEvtData.name = ((!sEventName.startsWith("ET:")) ? ("ET:" + sEventName) : (sEventName));
                newEvtData.callback = fnCallback;
                newEvtData.note = sNote;

            window.ET.MCMF.EventSubscribe_events.push(newEvtData);

            /*
            jQ("div#ET_meancloud_bootstrap").off("ET:" + sEventName.trim()).on("ET:" + sEventName.trim(), function()
            {
                window.ET.MCMF.EventSubscribe_events.forEach(function(oThisEvent)
                {
                    if (sEventName === oThisEvent.name)
                    {
                        if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("FIRING '" + oThisEvent.name + "'!" + ((oThisEvent.note === undefined) ? "" : " (" + oThisEvent.note + ")"));
                        oThisEvent.callback();
                    }
                });
            });
            */

            if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("Added event subscription '" + sEventName + "'!" + ((sNote === undefined) ? "" : " (" + sNote + ")"));
        },

        EventTrigger: function(sEventName)
        {
            //jQ("div#ET_meancloud_bootstrap").trigger(sEventName);

            if (window.ET.MCMF.EventSubscribe_events === undefined) return;

            window.ET.MCMF.EventSubscribe_events.forEach(function(oThisEvent)
            {
                if (sEventName === oThisEvent.name)
                {
                    if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("FIRING '" + oThisEvent.name + "'!" + ((oThisEvent.note === undefined) ? "" : " (" + oThisEvent.note + ")"));
                    try { oThisEvent.callback(); } catch (err) { if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("Exception: " + err); }
                }
            });
        },
        
        Log: function(msg)
        {
            try
            {
                let now_time = new Date();
                let timestamp = (now_time.getMonth() + 1).toString() + "/" + now_time.getDate().toString() + "/" + (now_time.getYear() + 1900).toString() + " " + ((now_time.getHours() === 0) ? (12) : ((now_time.getHours() > 12) ? (now_time.getHours() - 12) : (now_time.getHours()))).toString() + ":" + now_time.getMinutes().toString().padStart(2, "0") + ":" + now_time.getSeconds().toString().padStart(2, "0") + ((now_time.getHours() < 12) ? ("am") : ("pm")) + " :: ";
                console.log(timestamp.toString() + msg);
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

                jQuery.makeArray(Object.keys(Package.meteor.global.Accounts.connection._subscriptions).map(key => Package.meteor.global.Accounts.connection._subscriptions[key])).forEach(function(oThisConnection)
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
                    if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("Meteor::Subscribed to channel '" + channel_name + "'");
                }
                //else if (ET.MCMF.WantDebug)
                //    window.ET.MCMF.Log("Meteor::Already subscribed to channel '" + channel_name + "'");
            }
            catch (err)
            {
                if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("Meteor::Exception in SubscribeToGameChannel(\"" + channel_name + "\")");
                if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(err);
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
        
        IsNewCombatTab: function()
        {
            try
			{
                if ((Router._currentRoute.getName() === "newCombat") || (window.location.href.indexOf("/newCombat") !== -1))
				{
                    return true;
				}
            }
            catch (err) { }
            
            return false;
        },
        
        GetActiveTab: function()
        {
            let active_tab = "";
            
            /*
            try
            {
                active_tab = jQuery(jQuery("a.active").get(0)).text().trim().toLowerCase();
                
                if (active_tab.length === 0)
                    throw "Invalid active tab";
                
                if (active_tab === "mine") active_tab = "mining";
                if (active_tab === "craft") active_tab = "crafting";
                if (active_tab === "battle") active_tab = "combat";
                if (active_tab === "woodcut") active_tab = "woodcutting";
                if (active_tab === "farm") active_tab = "farming";
                if (active_tab === "inscribe") active_tab = "inscription";
                //if (active_tab === "inscription") active_tab = "inscription";
                //if (active_tab === "magic") active_tab = "magic";
                //if (active_tab === "shop") active_tab = "shop";
            }
            catch (err)
            {
            */
			let current_route = Router._currentRoute.getName();
			
			if (current_route === "gameHome") active_tab = "home";
			if (current_route === "mining") active_tab = "mining";
			if (current_route === "crafting") active_tab = "crafting";
			if (current_route === "combat") active_tab = "combat";
			if (current_route === "newCombat") active_tab = "combat";
			if (current_route === "woodcutting") active_tab = "woodcutting";
			if (current_route === "farming") active_tab = "farming";
			if (current_route === "inscription") active_tab = "inscription";
			if (current_route === "magic") active_tab = "magic";
			if (current_route === "faq") active_tab = "faq";
			if (current_route === "chat") active_tab = "chat";
			if (current_route === "skills") active_tab = "skills";
			if (current_route === "achievements") active_tab = "achievements";
			if (current_route === "updates") active_tab = "updates";

			if (active_tab === "")
			{
                if (window.location.href.indexOf("/gameHome") !== -1) active_tab = "home";
                if (window.location.href.indexOf("/mining") !== -1) active_tab = "mining";
                if (window.location.href.indexOf("/crafting") !== -1) active_tab = "crafting";
                if (window.location.href.indexOf("/combat") !== -1) active_tab = "combat";
                if (window.location.href.indexOf("/newCombat") !== -1) active_tab = "combat";
                if (window.location.href.indexOf("/woodcutting") !== -1) active_tab = "woodcutting";
                if (window.location.href.indexOf("/farming") !== -1) active_tab = "farming";
                if (window.location.href.indexOf("/inscription") !== -1) active_tab = "inscription";
                if (window.location.href.indexOf("/magic") !== -1) active_tab = "magic";
                if (window.location.href.indexOf("/faq") !== -1) active_tab = "faq";
                if (window.location.href.indexOf("/chat") !== -1) active_tab = "chat";
                if (window.location.href.indexOf("/skills") !== -1) active_tab = "skills";
                if (window.location.href.indexOf("/achievements") !== -1) active_tab = "achievements";
                if (window.location.href.indexOf("/updates") !== -1) active_tab = "updates";
			}
            /*
            }
            */
            
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
                    if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("Battle socket emitting: '" + sMsg + "'");
                    
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
                    sMsg = '["action",{"abilityId":"' + abil + '","targets":[' + targ + '],"caster":"' + window.ET.MCMF.UserID + '"}]';
                    if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("Battle socket emitting: '" + sMsg + "'");
                    
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
                        if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("Calling: '" + cmd + "' with no data");
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
                            if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("Calling: '" + cmd + "' with no data");
                            Package.meteor.Meteor.call(cmd, fnc);
                        }
                        else if (data2 === undefined)
                        {
                            if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("Calling: '" + cmd + "' with { " + JSON.stringify(data1) + " }");
                            Package.meteor.Meteor.call(cmd, data1, fnc);
                        }
                        else if (data3 === undefined)
                        {
                            if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("Calling: '" + cmd + "' with { " + JSON.stringify(data1) + ", " + JSON.stringify(data2) + " }");
                            Package.meteor.Meteor.call(cmd, data1, data2, fnc);
                        }
                        else if (data4 === undefined)
                        {
                            if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("Calling: '" + cmd + "' with { " + JSON.stringify(data1) + ", " + JSON.stringify(data2) + ", " + JSON.stringify(data3) + " }");
                            Package.meteor.Meteor.call(cmd, data1, data2, data3, fnc);
                        }
                        else
                        {
                            if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("Calling: '" + cmd + "' with { " + JSON.stringify(data1) + ", " + JSON.stringify(data2) + ", " + JSON.stringify(data3) + ", " + JSON.stringify(data4) + " }");
                            Package.meteor.Meteor.call(cmd, data1, data2, data3, data4, fnc);
                        }
                    }
                }
                else if (window.ET.MCMF.WantDebug)
                    window.ET.MCMF.Log("Meteor::Warning, CallGameCmd() with no arguments!");
            }
            catch (err)
            {
                if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("Meteor::Exception in CallGameCmd()");
                if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(err);
            }
        },

        SendGameCmd: function(cmd)
        {
            try
            {
                Meteor.connection._send(cmd);
                if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("Meteor::Sending: " + JSON.stringify(cmd));
            }
            catch (err)
            {
                if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("Meteor::Exception in SendGameCmd(" + JSON.stringify(cmd) + ")");
                if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log(err);
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
            return ((window.ET.MCMF.InBattle) || ((time_val() - window.ET.MCMF.TimeLastFight) < 3));
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
		
		CombatStarted: function(forced)
		{
			if (!window.ET.MCMF.FinishedLoading)
			{
				setTimeout(window.ET.MCMF.CombatStarted, 100);
				return;
			}
			
			if (forced || (window.ET.MCMF.BattleFirstFrame === undefined))
			{
				battleSocket.on('tick', function(oAllData)
				{
					let battleData = window.ET.MCMF.LiveBattleData();                                    
					
					if (battleData !== undefined)
					{
						if (battleData.floor !== undefined)
						{
							let currentFloorRoom = CInt(battleData.floor).toFixed(0) + "." + CInt(battleData.room).toFixed(0);
							
							if (window.ET.MCMF.BattleFloorRoom !== currentFloorRoom)
							{
								window.ET.MCMF.BattleFloorRoom = currentFloorRoom;
								window.ET.MCMF.BattleFirstFrame = undefined;
							}
						}
						
						if (window.ET.MCMF.BattleFirstFrame === undefined)
						{
							window.ET.MCMF.BattleFirstFrame = battleData;
							
							if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- triggering ET:firstBattleFrame -->");
							window.ET.MCMF.EventTrigger("ET:firstBattleFrame");
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
				if (window.ET.MCMF.InBattle && window.ET.MCMF.IsNewCombatTab())
				{
					window.ET.MCMF.CombatStarted(true);
				}
			});
			
			Router.onRun(function()
			{
				if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- triggering ET:navigation -->");
				window.ET.MCMF.EventTrigger("ET:navigation");
				this.next();
			});

            
            Blaze._getTemplate("battleUnit").onRendered(function()
            {
                if ((this.data !== undefined) && (this.data.unit !== undefined))
                {
                    window.ET.MCMF.BattleUnitList.push(this);
                    //if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- Template.battleUnit.onRendered triggered -->");
                }
            });
            
            Template.currentBattleUi.onCreated(function()
            {
                window.ET.MCMF.BattleUITemplate = this;
                //if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- Template.currentBattleUi.onCreated triggered -->");
            });
            
            Template.currentBattleUi.onDestroyed(function()
            {
                window.ET.MCMF.BattleUITemplate = undefined;
                window.ET.MCMF.BattleUnitList = [];
                //if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- Template.currentBattleUi.onDestroyed triggered -->");
            });

            Package.meteor.Meteor.connection._stream.on('message', function(sMeteorRawData)
            {
                if (window.ET.MCMF.CombatID === undefined)
                    window.ET.MCMF.GetPlayerCombatData();

                try
                {
                    oMeteorData = JSON.parse(sMeteorRawData);

                    /////////////////////////////////////////////////////////////////////////////////////////////////////////
                    //
                    //  BACKUP TO RETRIEVE USER AND COMBAT IDS
                    //
                    if (oMeteorData.collection === "users")
                        if ((window.ET.MCMF.UserID === undefined) || (window.ET.MCMF.UserID.length !== 17))
                            window.ET.MCMF.UserID = oMeteorData.id;

                    if (oMeteorData.collection === "combat")
                        if ((window.ET.MCMF.CombatID === undefined) || (window.ET.MCMF.CombatID.length !== 17))
                            if (oMeteorData.fields.owner === window.ET.MCMF.UserID)
                                window.ET.MCMF.CombatID = oMeteorData.id;
                    //
                    /////////////////////////////////////////////////////////////////////////////////////////////////////////

                    if (oMeteorData.collection === "battlesList")
                    {
                        window.ET.MCMF.AbilitiesReady = false;

                        if ((oMeteorData.msg === "added") || (oMeteorData.msg === "removed"))
                        {
                            window.ET.MCMF.BattleUnitList = [];
                            window.ET.MCMF.InBattle = (oMeteorData.msg === "added");
                            if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- triggering ET:combat" + (((oMeteorData.msg === "added")) ? ("Start") : ("End")) + " -->");
                            window.ET.MCMF.EventTrigger("ET:combat" + (((oMeteorData.msg === "added")) ? ("Start") : ("End")));
                            
                            if (window.ET.MCMF.InBattle)
                            {
                                window.ET.MCMF.CombatStarted();
                            }
                            else
                            {
                                window.ET.MCMF.BattleFloorRoom = "0.0";
                                window.ET.MCMF.BattleFirstFrame = undefined;
                            }
                        }
                    }

                    if ((oMeteorData.collection === "battles") && (oMeteorData.msg === "added"))
                    {
                        if (oMeteorData.fields.finished)
                        {
                            window.ET.MCMF.WonLast = oMeteorData.fields.win;
                            window.ET.MCMF.TimeLastFight = time_val();

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
            //if (!window.ET.MCMF.PlayerInCombat())
                return window.ET.MCMF.GetPlayerCombatData().stats.health;
            
            //return window.ET.MCMF.PlayerUnitData.stats.health;
        },
        
        PlayerHPMax: function()
        {
            //if (!window.ET.MCMF.PlayerInCombat())
                return window.ET.MCMF.GetPlayerCombatData().stats.healthMax;
            
            //return window.ET.MCMF.PlayerUnitData.stats.healthMax;
        },
        
        PlayerEnergy: function()
        {
            //if (!window.ET.MCMF.PlayerInCombat())
                return window.ET.MCMF.GetPlayerCombatData().stats.energy;
            
            //return window.ET.MCMF.PlayerUnitData.stats.energy;
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
                        //jQ("div#ET_meancloud_bootstrap").trigger("ET:abilitiesReady");
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
            let oCombatPlayerData;
            
            try
            {        
                window.ET.MCMF.CombatID = undefined;
            
                Meteor.connection._stores.combat._getCollection().find().fetch().forEach(function(oThisCombatUnit)
                {
                    if (oThisCombatUnit.owner === window.ET.MCMF.UserID)
                    {
                        oCombatPlayerData = oThisCombatUnit;
                        
                        window.ET.MCMF.CombatID = oCombatPlayerData._id;
                        
                        if (!window.ET.MCMF.PlayerInCombat())
                            window.ET.MCMF.PlayerUnitData = oCombatPlayerData;
                    }
                });
                
                // new: get updated combat data from stored 'state' data in 'BattleUITemplate' template (comes from 'battleSocket')
                if (window.ET.MCMF.LiveBattleData() !== undefined)
                {
                    jQ.makeArray(window.ET.MCMF.LiveBattleData().units).forEach(function(oCurrentUnit)
                    {
                        if (oCurrentUnit.id === window.ET.MCMF.UserID)
                            window.ET.MCMF.PlayerUnitData = oCurrentUnit;
                    });
                    
                    oCombatPlayerData = window.ET.MCMF.PlayerUnitData;
                }
            }
            catch (err) { }
            
            return oCombatPlayerData;
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
            return Meteor.connection._stores.adventures._getCollection().find().fetch()[0].adventures;
        },        
  
        GetChats: function()
        {
            return Meteor.connection._stores.simpleChats._getCollection().find().fetch();
        },

        GetItems: function()
        {
            return Meteor.connection._stores.items._getCollection().find().fetch();
        },
        
        GetSkills: function()
        {
            return Meteor.connection._stores.skills._getCollection().find().fetch();
        },

        // need a better way to check if the game has loaded basic data, but this is fine for now
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
                //if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- triggering ET:initialized -->");
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
				window.ET.MCMF.UserName = [...Meteor.connection._stores.users._getCollection()._collection._docs._map.values()][0].username;
                window.ET.MCMF.GetPlayerCombatData();

                if (window.ET.MCMF.GetAbilities().length < 0) throw "[MCMF Setup] Not loaded yet: no abilities";
                if (window.ET.MCMF.GetItems().length < 0) throw "[MCMF Setup]Not loaded yet: no items";
                if (window.ET.MCMF.GetChats().length < 0) throw "[MCMF Setup]Not loaded yet: no chats";
                if (window.ET.MCMF.GetSkills().length < 0) throw "[MCMF Setup]Not loaded yet: no skills";

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
                    window.ET.MCMF.Log("ET MCMF setup exception");
                    window.ET.MCMF.Log(err);
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
