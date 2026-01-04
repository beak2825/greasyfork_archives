// ==UserScript==
// @name          Eternity Tower Quick Sets
// @icon          https://www.eternitytower.net/favicon.png
// @namespace     http://mean.cloud/
// @version       1.25
// @description   Equips skin, gear, and abilities in configurable sets
// @match         *://eternitytower.net/*
// @match         *://www.eternitytower.net/*
// @match         http://localhost:3000/*
// @author        psouza4@gmail.com
// @copyright     2017-2023, MeanCloud
// @run-at        document-end
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/36717/Eternity%20Tower%20Quick%20Sets.user.js
// @updateURL https://update.greasyfork.org/scripts/36717/Eternity%20Tower%20Quick%20Sets.meta.js
// ==/UserScript==


////////////////////////////////////////////////////////////////
////////////// ** SCRIPT GLOBAL INITIALIZATION ** //////////////
function startup() { ET_QuickSetsMod(); }
PETQS_EquippedItems = [];
PETQS_EquippedAbilities = [];
PETQS_AllItems = [];
PETQS_PageOn = 1;
PETQS_PageMax = 10;
PETQS_SetsPerPage = 8;
////////////////////////////////////////////////////////////////


ET_QuickSetsMod = function()
{
    //ET.MCMF.WantDebug = true;

    ET.MCMF.Ready(function()
    {
        Package.meteor.Meteor.connection._stream.on('message', function(sMeteorRawData)
        {
            try
            {
                var oMeteorData = JSON.parse(sMeteorRawData);

                //todo: use Meteor.connection._stores.abilities._getCollection()._collection
                try
                {
                    if (oMeteorData.collection == "abilities")
                    {
                        if (oMeteorData.fields && oMeteorData.fields.learntAbilities)
                        {
                            PETQS_EquippedAbilities = [];

                            jQ.makeArray(oMeteorData.fields.learntAbilities).forEach(function(oAbility, index, array)
                             {
                                try
                                {
                                    if (oAbility.equipped)
                                        PETQS_EquippedAbilities.push(oAbility);
                                }
                                catch (err) { ET.MCMF.Log("Error with PETQS/ability: " + err); }
                            });
                        }
                    }
                }
                catch (err) { ET.MCMF.Log("Error with PETQS/abilities: " + err); }

                //todo: Meteor.connection._stores.items._getCollection()._collection
                try
                {
                    if (oMeteorData.collection == "items")
                    {
                        if (oMeteorData.msg == "added")
                            if (oMeteorData.fields && oMeteorData.fields.itemId && oMeteorData.fields.name && oMeteorData.fields.category)
                                PETQS_AllItems.push(oMeteorData);

                        if (oMeteorData.fields && oMeteorData.fields.equipped)
                        {
                            PETQS_EquippedItems.push(oMeteorData);
                        }
                        else
                        {
                            if (PETQS_EquippedItems.length > 0)
                            {
                                for (i = 0; i < PETQS_EquippedItems.length; i++)
                                {
                                    if (PETQS_EquippedItems[i].id === oMeteorData.id)
                                    {
                                        PETQS_EquippedItems.splice(i, 1);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                catch (err) { ET.MCMF.Log("Error with PETQS/items: " + err); }
            }
            catch (err) { ET.MCMF.Log("Error with PETQS/meteor: " + err); }
        });
    });

    ET.MCMF.Loaded(function()
    {
        PETQS_PageOn = CInt(GM_getValue("PETQS_Page"));
        if (PETQS_PageOn === 0)
            PETQS_PageOn = 1;
        PETQS_TestUI();
    }, "ETQS");
};

PETQS_TestUI = function()
{
	jQ(".summaryList .summary-mining").remove();

    try
    {
        if (jQ("div#PETQS_UI").length === 0)
            if (jQ("div.hidden-lg-down").length > 0)
                PETQS_CreateUI();
    }
    catch (err) { }

    setTimeout(PETQS_TestUI, 1000);
};

PETQS_CreateUI = function()
{
    jQ("div#PETQS_UI").remove();

    jQ(jQ("div.hidden-lg-down").children("div").get(0)).append
    (
        "<div style=\"margin-top: 20px; border: 1px solid #dde; background-color: #fafbfd; padding: 5px; width: 280px; font-size: 14px;\" id=\"PETQS_UI\">" +
        "<div style=\"width: 270px; max-width: 270px; height: 22px; cursor: pointer;\" id=\"PETQS_Slotbar" + pad(1 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage), 2) + "\" onclick=\"javascript:PETQS_ClickedSet(" + (1 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + ",event);\">[empty set]</div>" +
        "<div style=\"width: 270px; max-width: 270px; height: 22px; cursor: pointer;\" id=\"PETQS_Slotbar" + pad(2 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage), 2) + "\" onclick=\"javascript:PETQS_ClickedSet(" + (2 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + ",event);\">[empty set]</div>" +
        "<div style=\"width: 270px; max-width: 270px; height: 22px; cursor: pointer;\" id=\"PETQS_Slotbar" + pad(3 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage), 2) + "\" onclick=\"javascript:PETQS_ClickedSet(" + (3 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + ",event);\">[empty set]</div>" +
        "<div style=\"width: 270px; max-width: 270px; height: 22px; cursor: pointer; margin-bottom: 4px;\" id=\"PETQS_Slotbar" + pad(4 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage), 2) + "\" onclick=\"javascript:PETQS_ClickedSet(" + (4 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + ",event);\">[empty set]</div>" +
        "<div style=\"width: 270px; max-width: 270px; height: 22px; cursor: pointer; border-top: 1px solid #dde;\" id=\"PETQS_Slotbar" + pad(5 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage), 2) + "\" onclick=\"javascript:PETQS_ClickedSet(" + (5 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + ",event);\">[empty set]</div>" +
        "<div style=\"width: 270px; max-width: 270px; height: 22px; cursor: pointer;\" id=\"PETQS_Slotbar" + pad(6 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage), 2) + "\" onclick=\"javascript:PETQS_ClickedSet(" + (6 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + ",event);\">[empty set]</div>" +
        "<div style=\"width: 270px; max-width: 270px; height: 22px; cursor: pointer;\" id=\"PETQS_Slotbar" + pad(7 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage), 2) + "\" onclick=\"javascript:PETQS_ClickedSet(" + (7 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + ",event);\">[empty set]</div>" +
        "<div style=\"width: 270px; max-width: 270px; height: 22px; cursor: pointer;\" id=\"PETQS_Slotbar" + pad(8 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage), 2) + "\" onclick=\"javascript:PETQS_ClickedSet(" + (8 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + ",event);\">[empty set]</div>" +
        "<div style=\"width: 270px; max-width: 270px; padding-top: 10px;\">" +
        "<input class=\"btn btn-secondary\" type=\"button\" value=\"Save #" + (1 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + "\" onclick=\"javascript:PETQS_SaveSet(" + (1 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + ");\" style=\"display: inline-block; padding: 4px 2px 4px 2px; margin: 0px 3px 1px 0px; width: 64px; font-size: 12px;\" />" +
        "<input class=\"btn btn-secondary\" type=\"button\" value=\"Save #" + (2 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + "\" onclick=\"javascript:PETQS_SaveSet(" + (2 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + ");\" style=\"display: inline-block; padding: 4px 2px 4px 2px; margin: 0px 3px 1px 0px; width: 64px; font-size: 12px;\" />" +
        "<input class=\"btn btn-secondary\" type=\"button\" value=\"Save #" + (3 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + "\" onclick=\"javascript:PETQS_SaveSet(" + (3 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + ");\" style=\"display: inline-block; padding: 4px 2px 4px 2px; margin: 0px 3px 1px 0px; width: 64px; font-size: 12px;\" />" +
        "<input class=\"btn btn-secondary\" type=\"button\" value=\"Save #" + (4 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + "\" onclick=\"javascript:PETQS_SaveSet(" + (4 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + ");\" style=\"display: inline-block; padding: 4px 2px 4px 2px; margin: 0px 3px 1px 0px; width: 64px; font-size: 12px;\" /><br />" +
        "<input class=\"btn btn-secondary\" type=\"button\" value=\"Save #" + (5 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + "\" onclick=\"javascript:PETQS_SaveSet(" + (5 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + ");\" style=\"display: inline-block; padding: 4px 2px 4px 2px; margin: 0px 3px 1px 0px; width: 64px; font-size: 12px;\" />" +
        "<input class=\"btn btn-secondary\" type=\"button\" value=\"Save #" + (6 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + "\" onclick=\"javascript:PETQS_SaveSet(" + (6 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + ");\" style=\"display: inline-block; padding: 4px 2px 4px 2px; margin: 0px 3px 1px 0px; width: 64px; font-size: 12px;\" />" +
        "<input class=\"btn btn-secondary\" type=\"button\" value=\"Save #" + (7 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + "\" onclick=\"javascript:PETQS_SaveSet(" + (7 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + ");\" style=\"display: inline-block; padding: 4px 2px 4px 2px; margin: 0px 3px 1px 0px; width: 64px; font-size: 12px;\" />" +
        "<input class=\"btn btn-secondary\" type=\"button\" value=\"Save #" + (8 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + "\" onclick=\"javascript:PETQS_SaveSet(" + (8 + ((PETQS_PageOn - 1) * PETQS_SetsPerPage)).toFixed(0) + ");\" style=\"display: inline-block; padding: 4px 2px 4px 2px; margin: 0px 3px 1px 0px; width: 64px; font-size: 12px;\" /><br />" +
        "<input class=\"btn btn-secondary\" type=\"button\" value=\"&lt;  Prev Page\" onclick=\"javascript:PETQS_PageChange(-1);\" style=\"display: inline-block; padding: 4px 2px 4px 2px; margin: 0px 3px 1px 0px; width: 131px; font-size: 12px;\" />" +
        "<input class=\"btn btn-secondary\" type=\"button\" value=\"Next Page  &gt;\" onclick=\"javascript:PETQS_PageChange(1);\" style=\"display: inline-block; padding: 4px 2px 4px 2px; margin: 0px 3px 1px 0px; width: 131px; font-size: 12px;\" /><br />" +
        "</div>" +
        "</div>"
    );

    for (iSlot = 1; iSlot <= PETQS_SetsPerPage; iSlot++)
        PETQS_LoadSet(iSlot + ((PETQS_PageOn - 1) * PETQS_SetsPerPage));
};

PETQS_PageChange = function(iAmt)
{
	PETQS_PageOn += iAmt;
	if (PETQS_PageOn <= 0)
		PETQS_PageOn = PETQS_PageMax;
	if (PETQS_PageOn > PETQS_PageMax)
		PETQS_PageOn = 1;
    GM_setValue("PETQS_Page", PETQS_PageOn.toString());
	PETQS_CreateUI();
};

PETQS_UpdateSetTooltip = function(iSlot, bEmpty)
{
    oEl = jQ("#PETQS_Slotbar" + pad(iSlot, 2)).get(0);
    if (!oEl)
        return;

    if (oEl._tippy)
        oEl._tippy.destroy();

    jQ("#tooltip-PETQS_Slotbar" + pad(iSlot, 2)).remove();
    jQ("body").append("<div class=\"item-tooltip-content my-tooltip-inner\" id=\"tooltip-PETQS_Slotbar" + pad(iSlot, 2) + "\"></div>");

    if (bEmpty)
    {
        jQ("#tooltip-PETQS_Slotbar" + pad(iSlot, 2)).html
        (
            "    <h3 class=\"popover-title\" style=\"font-weight: normal; color: #3333ff;\">" +
            "        " + (GM_getValue("PETQS_Name" + pad(iSlot, 2)) || "Quick Set #" + iSlot.toFixed(0)) +
            "    </h3>" +
            "    <div class=\"popover-content\">" +
            "        set #" + iSlot.toFixed(0) + "<br />" +
            "        this set is empty" +
            "    </div>"
        );
    }
    else
    {
        jQ("#tooltip-PETQS_Slotbar" + pad(iSlot, 2)).html
        (
            "    <h3 class=\"popover-title\" style=\"font-weight: bold; color: #3333ff;\">" +
            "        " + (GM_getValue("PETQS_Name" + pad(iSlot, 2)) || "Quick Set #" + iSlot.toFixed(0)) +
            "    </h3>" +
            "    <div class=\"popover-content\">" +
            "        set #" + iSlot.toFixed(0) + "<br />" +
            "        <b>Left Click</b> to equip this set<br />" +
            "        <b>Shift Click</b> to rename this set<br />" +
            "        <b>Control Click</b> to delete this set" +
            "    </div>"
        );
    }

    tippy("#PETQS_Slotbar" + pad(iSlot, 2),
    {
        html: jQ("#tooltip-PETQS_Slotbar" + pad(iSlot, 2))[0],
        performance: !0,
        animateFill: !1,
        distance: 5
    });
};

PETQS_ClickedSet = function(iSlot, e)
{
    var bShiftPressed = false;
    var bCtrlPressed = false;

    try
	{
		if (e !== null)
        {
			if (e.shiftKey) bShiftPressed = true;
			if (e.ctrlKey)  bCtrlPressed = true;
        }
	}
	catch (err) { }

    if (bShiftPressed)
    {
        var sSetName = prompt("Enter a new name for this set:", GM_getValue("PETQS_Name" + pad(iSlot, 2)) || "Quick Set #" + iSlot.toFixed(0));
        if (sSetName !== null)
        {
            GM_setValue("PETQS_Name" + pad(iSlot, 2), sSetName.trim());
            PETQS_LoadSet(iSlot);
        }
    }
    else if (bCtrlPressed)
    {
        if (confirm("Really delete set #" + iSlot.toFixed(0) + " (\"" + (GM_getValue("PETQS_Name" + pad(iSlot, 2)) || "Quick Set #" + iSlot.toFixed(0)) + "\")?"))
        {
            GM_deleteValue("PETQS_Name" + pad(iSlot, 2));
            GM_deleteValue("PETQS_QS" + pad(iSlot, 2));
            jQ("div#PETQS_Slotbar" + pad(iSlot, 2)).html("[empty set]");
            PETQS_UpdateSetTooltip(iSlot, true);
        }
    }
    else
        PETQS_LoadSet(iSlot, true);
};

PETQS_SkinEquipped = function()
{
    //return Meteor.connection._stores.combat._getCollection()._collection._docs._map[ET.MCMF.CombatID].characterIcon; // CombatID no longer exists
    try
    {
        return Meteor.connection._stores.combat._getCollection().find({owner: Meteor.userId()}).fetch()[0].characterIcon;
    }
    catch (err) { }

    return "";
};

PETQS_ClassToImage = function(classId)
{
	if (classId && IsValid(classId))
	{
		if (classId == "wanderer") return "classWandererSmall.png"
		if (classId == "barbarian") return "classBarbarianSmall.png"
		if (classId == "duelist") return "classDuelistSmall.png"
		if (classId == "paladin") return "classPaladinSmall.png"
		if (classId == "ranger") return "classRangerSmall.png"
		if (classId == "sage") return "classSageSmall.png"
		if (classId == "tactician") return "classTacticianSmall.png"
		if (classId == "warmage") return "classWarMageSmall.png"
		if (classId == "wizard") return "classWizardSmall.png"
	}
    return "invis.gif"
};

PETQS_ClassEquipped = function()
{
    return window.ET.MCMF.WhichClass()
};

PETQS_SaveSet = function(iSlot)
{
    var sSetting = "";

    sSetting += 
		"class&&" + PETQS_ClassEquipped() + "||" +
		"skin&&" + PETQS_SkinEquipped() + "||";

    try
    {
        jQ.makeArray(PETQS_EquippedItems).forEach(function(oEquippedItem, index, array)
        {
            //ET.MCMF.Log(oEquippedItem);

            try
            {
                var oEquippedItemToUse = oEquippedItem;

                if (!oEquippedItem.fields.category)
                {
                    jQ.makeArray(PETQS_AllItems).forEach(function(oThisItem, index2, array2)
                    {
                        if ((oThisItem.id === oEquippedItem.id) && (oThisItem.fields.category))
                        {
                            oEquippedItemToUse = oThisItem;
                            //ET.MCMF.Log("--> ", oEquippedItemToUse);
                        }
                    });
                }

                let oEquippedItemToUse_real = ET.MCMF.GetItem(oEquippedItemToUse.id)

                if (oEquippedItemToUse_real.category)
                    if (oEquippedItemToUse_real.category === "mining")
                        return; // skip this item (no mining tools)

                sSetting += "item&&"
                         +  oEquippedItemToUse.id + "&&"
                         +  oEquippedItemToUse_real.itemId + "&&"
                         +  oEquippedItemToUse_real.name + "&&"
                         +  oEquippedItemToUse_real.slot + "&&"
                         +  oEquippedItemToUse_real.icon + "&&"
                         +  (oEquippedItemToUse_real.quality ? oEquippedItemToUse_real.quality.toFixed(0) : "-1") + "&&"
                         +  (oEquippedItemToUse_real.enhanced ? "E" : "X") + "||";
            }
            catch (err) { ET.MCMF.Log("Error with PETQS/saveItem: " + err); }
        });
    }
    catch (err) { ET.MCMF.Log("Error with PETQS/saveItems: " + err); }

    try
    {
        jQ.makeArray(PETQS_EquippedAbilities).forEach(function(oEquippedAbility, index, array)
        {
            //ET.MCMF.Log(oEquippedAbility);

            try
            {
                sSetting += "ability&&"
                         +  oEquippedAbility.abilityId + "&&"
                         +  oEquippedAbility.name + "&&"
                         +  oEquippedAbility.slot + "&&"
                         +  oEquippedAbility.icon + "||";
            }
            catch (err) { ET.MCMF.Log("Error with PETQS/saveAbility: " + err); }
        });
    }
    catch (err) { ET.MCMF.Log("Error with PETQS/saveAbilities: " + err); }

    //ET.MCMF.Log("Save: PETQS_QS" + pad(iSlot, 2) + " = " + sSetting);

    GM_setValue("PETQS_QS" + pad(iSlot, 2), sSetting);

    PETQS_LoadSet(iSlot);
};

PETQS_LoadSet = function(iSlot, bEquip = false)
{
    var sRawSetting = GM_getValue("PETQS_QS" + pad(iSlot, 2)) || "";
    //ET.MCMF.Log("Load: " + sRawSetting);

    if (sRawSetting === "")
    {
        PETQS_UpdateSetTooltip(iSlot, true);
        return;
    }

    var sSettingLines = jQ.makeArray(sRawSetting.split("||"));
    var sHotbarHTML = "";

    const sImageSize = "22px";

    if (bEquip)
    {
		/*
        ET.MCMF.CallGameCmd("abilities.unequipAll", "mainHand");
        ET.MCMF.CallGameCmd("abilities.unequip", "offHand");
        ET.MCMF.CallGameCmd("abilities.unequip", "head");
        ET.MCMF.CallGameCmd("abilities.unequip", "chest");
        ET.MCMF.CallGameCmd("abilities.unequip", "legs");

        var equipmentCopy = PETQS_EquippedItems.slice();

        if (equipmentCopy.length > 0)
            for (i = 0; i < equipmentCopy.length; i++)
                if (equipmentCopy[i].fields.category !== "mining")
                    ET.MCMF.CallGameCmd("items.unequip", equipmentCopy[i].id, equipmentCopy[i].fields.itemId);
		*/
		
        ET.MCMF.CallGameCmd("abilities.unequipAll");
        ET.MCMF.CallGameCmd("items.unequipAllCombat");
    }
	
	console.log(sSettingLines)

    // look for skins and classes first
    sSettingLines.forEach(function(sSettingLine, index, array)
    {
        try
        {
            var sSettingVals = jQ.makeArray(sSettingLine.split("&&"));

            if (sSettingVals[0] == "skin")
            {
                //ET.MCMF.Log("skin: " + sSettingVals[1]);

                sHotbarHTML += "<img src=\"/icons/" + sSettingVals[1] + "\" class=\"extra-small-icon\" style=\"width: " + sImageSize + "; height: " + sImageSize + "; padding: 0px; margin: 0px; border: none;\" />";

                if (bEquip)
                {
                    //todo: use Meteor.connection._stores.skins._getCollection()._collection
                    if (sSettingVals[1] == "character.svg")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "default");
                    if (sSettingVals[1] == "falconT1.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "archer_t1");
                    if (sSettingVals[1] == "falconT2.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "archer_t2");
                    if (sSettingVals[1] == "falconT1Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "archer_t1_color");
                    if (sSettingVals[1] == "falconT2Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "archer_t2_color");
                    if (sSettingVals[1] == "mitsyT1.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "mage_t1");
                    if (sSettingVals[1] == "mitsyT2.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "mage_t2");
                    if (sSettingVals[1] == "mitsyT1Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "mage_t1_color");
                    if (sSettingVals[1] == "mitsyT2Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "mage_t2_color");
                    if (sSettingVals[1] == "oliveT1.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "damage_t1");
                    if (sSettingVals[1] == "oliveT2.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "damage_t2");
                    if (sSettingVals[1] == "oliveT1Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "damage_t1_color");
                    if (sSettingVals[1] == "oliveT2Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "damage_t2_color");
                    if (sSettingVals[1] == "guyT1.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "tank_t1");
                    if (sSettingVals[1] == "guyT2.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "tank_t2");
                    if (sSettingVals[1] == "guyT1Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "tank_t1_color");
                    if (sSettingVals[1] == "guyT2Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "tank_t2_color");
                    if (sSettingVals[1] == "phoenixT1.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "phoenix_t1");
                    if (sSettingVals[1] == "phoenixT2.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "phoenix_t2");
                    if (sSettingVals[1] == "phoenixT1Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "phoenix_t1_color");
                    if (sSettingVals[1] == "phoenixT2Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "phoenix_t2_color");
                    if (sSettingVals[1] == "hitiT1.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "hiti_t1");
                    if (sSettingVals[1] == "hitiT1Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "hiti_t1_color");
                    if (sSettingVals[1] == "pugilistT1.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "pugilist_t1");
                    if (sSettingVals[1] == "pugilistT1Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "pugilist_t1_color");
                    if (sSettingVals[1] == "sandstormT1.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "sandstorm_t1");
                    if (sSettingVals[1] == "sandstormT1Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "sandstorm_t1_color");
                    if (sSettingVals[1] == "crowT1.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "crow_t1");
                    if (sSettingVals[1] == "crowT2.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "crow_t2");
                    if (sSettingVals[1] == "crowT1Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "crow_t1_color");
                    if (sSettingVals[1] == "crowT2Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "crow_t2_color");
                    if (sSettingVals[1] == "aldaT1.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "alda_t1");
                    if (sSettingVals[1] == "aldaT2.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "alda_t2");
                    if (sSettingVals[1] == "aldaT1Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "alda_t1_color");
                    if (sSettingVals[1] == "aldaT2Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "alda_t2_color");
                    if (sSettingVals[1] == "vallaT1.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "valla_t1");
                    if (sSettingVals[1] == "vallaT1Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "valla_t1_color");
                    if (sSettingVals[1] == "adalgarT1.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "adalgar_t1");
                    if (sSettingVals[1] == "adalgarT1Color.png")   ET.MCMF.CallGameCmd("combat.updateCharacterIcon", "adalgar_t1_color");

                }
            }
			else if (sSettingVals[0] == "class")
            {
                //ET.MCMF.Log("skin: " + sSettingVals[1]);

                sHotbarHTML += "<img src=\"/icons/" + PETQS_ClassToImage(sSettingVals[1]) + "\" class=\"extra-small-icon\" style=\"width: " + sImageSize + "; height: " + sImageSize + "; padding: 0px; margin: 0px; border: none;\" />";
            }
        }
        catch (err) { }
    });

    // look for gear
    for (i = 1; i <= 6; i++)
    {
        sSettingLines.forEach(function(sSettingLine)
        {
            try
            {
                var sSettingVals = jQ.makeArray(sSettingLine.split("&&"));

                if (sSettingVals[0] === "item")
                {
                    if ((i == 1) && (sSettingVals[4] !== "mainHand")) return;
                    if ((i == 2) && (sSettingVals[4] !== "offHand")) return;
                    if ((i == 3) && (sSettingVals[4] !== "head")) return;
                    if ((i == 4) && (sSettingVals[4] !== "neck")) return;
                    if ((i == 5) && (sSettingVals[4] !== "chest")) return;
                    if ((i == 6) && (sSettingVals[4] !== "legs")) return;

                    //ET.MCMF.Log("item: " + sSettingVals[3]);

                    sHotbarHTML += "<img src=\"/icons/" + sSettingVals[5] + "\" class=\"extra-small-icon\" style=\"width: " + sImageSize + "; height: " + sImageSize + "; padding: 0px; margin: 0px; border: none;\" />";

                    if (bEquip)
                        ET.MCMF.CallGameCmd("items.equip", sSettingVals[1], sSettingVals[2]);
                }
            }
            catch (err) { }
        });
    }

    // look for abilities
    for (i = 1; i <= 9; i++)
    {
        sSettingLines.forEach(function(sSettingLine)
        {
            try
            {
                var sSettingVals = jQ.makeArray(sSettingLine.split("&&"));

                if (sSettingVals[0] == "ability")
                {
                    if ((i == 1) && (sSettingVals[3] != "mainHand")) return;
                    if ((i == 2) && (sSettingVals[3] != "offHand")) return;
                    if ((i == 3) && (sSettingVals[3] != "head")) return;
                    if ((i == 4) && (sSettingVals[3] != "chest")) return;
                    if ((i == 5) && (sSettingVals[3] != "legs")) return;
                    if ((i == 6) && (sSettingVals[3] != (window.ET.MCMF.IsClass() ? "classAbil1" : "companion"))) return;
                    if ((i == 7) && (sSettingVals[3] != "classAbil2")) return;
                    if ((i == 8) && (sSettingVals[3] != "classAbil3")) return;
                    if ((i == 9) && (sSettingVals[3] != "companion")) return;

                    //ET.MCMF.Log("ability: " + sSettingVals[2]);

					if (i < 6)
						sHotbarHTML += "<img src=\"/icons/" + sSettingVals[4] + "\" class=\"extra-small-icon\" style=\"width: " + sImageSize + "; height: " + sImageSize + "; padding: 0px; margin: 0px; border: none;\" />";

                    if (bEquip)
                        ET.MCMF.CallGameCmd("abilities.equip", sSettingVals[1]);
                }
            }
            catch (err) { }
        });
    }

    jQ("div#PETQS_Slotbar" + pad(iSlot, 2)).html(sHotbarHTML);
    PETQS_UpdateSetTooltip(iSlot, false);
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

                window.jQ.makeArray(Object.keys(Meteor.connection._subscriptions).map(key => Meteor.connection._subscriptions[key])).forEach(function(oThisConnection)
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

		IsClass: function() {
			const classData = Meteor.connection._stores.users._getCollection().find().fetch()[0].classData
			return typeof classData !== 'undefined' && typeof classData.currentClass !== 'undefined'
		},
		
		WhichClass: function() {
			return Meteor.connection._stores.users._getCollection().find().fetch()[0]?.classData?.currentClass
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
                    active_tab_section = window.jQ(window.jQ("a.active").get(1)).text().trim().toLowerCase();

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

        GetSkills: function()
        {
            return Meteor.connection._stores.skills._getCollection().find().fetch();
        },
		
		AnyJQ: function()
		{
			if (typeof jQ != 'undefined') return jQ;
			if (typeof window.jQ != 'undefined') return window.jQ;
			if (typeof $ !== 'undefined') return $;
			if (typeof window.$ !== 'undefined') return window.$;
			if (typeof jQuery != 'undefined') return jQuery;
			if (typeof window.jQuery != 'undefined') return window.jQuery;
			return undefined;
		},

        Setup: function()
        {
            if ((!window.ET.MCMF.TryingToLoad) && (!window.ET.MCMF.FinishedLoading))
            {
                // use whatever version of jQuery available to us
                window.ET.MCMF.AnyJQ()("body").append("<div id=\"ET_meancloud_bootstrap\" style=\"visibility: hidden; display: none;\"></div>");
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
