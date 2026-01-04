// ==UserScript==
// @name          Eternity Tower Layout Tweaks
// @icon          https://www.eternitytower.net/favicon.png
// @namespace     http://mean.cloud/
// @version       1.15
// @description   Tweaks the layout and formatting of the Eternity Tower web game
// @match         *://eternitytower.net/*
// @match         *://www.eternitytower.net/*
// @match         http://localhost:3000/*
// @author        psouza4@gmail.com
// @copyright     2018-2023, MeanCloud
// @run-at        document-end
// @grant         unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/372773/Eternity%20Tower%20Layout%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/372773/Eternity%20Tower%20Layout%20Tweaks.meta.js
// ==/UserScript==


////////////////////////////////////////////////////////////////
////////////// ** SCRIPT GLOBAL INITIALIZATION ** //////////////
ET_LayoutTweaksMod_Settings = {};
ET_LayoutTweaksMod_setupCombatListeners = false;
ET_LayoutTweaksMod_resetSpellDisplay = true;
function startup() { ET_LayoutTweaksMod(); }
////////////////////////////////////////////////////////////////


ET_LayoutTweaksMod = function()
{
    ET.MCMF.Ready(function()
    {
        setTimeout(ET_LayoutTweaksMod_Content, 1);
        setTimeout(ET_LayoutTweaksMod_PageScanner, 1);
    });

    ET.MCMF.Loaded(function()
    {
        Package.meteor.Meteor.connection._stream.on('message', function(sMeteorRawMessage)
        {
            try
            {
                let meteorMessage = JSON.parse(sMeteorRawMessage);

                // if abilities change at all (equipped/unequipped, cooldown update, level change, etc.), refresh the equipment and ability display in the combat lobby
                if ((meteorMessage.msg === "changed") && (meteorMessage.collection === "abilities"))
                    ET_LayoutTweaksMod_resetSpellDisplay = true;

                // if items change in a way that affects their .equipped status, refresh the equipment and ability display in the combat lobby
                if ((meteorMessage.msg === "changed") && (meteorMessage.collection === "items") && (sMeteorRawMessage.indexOf("\"fields\":{\"equipped\":") !== -1))
                    ET_LayoutTweaksMod_resetSpellDisplay = true;

                // if items change in a way that affects their .hidden status, refresh the equipment and ability display in the combat lobby
                if ((meteorMessage.msg === "changed") && (meteorMessage.collection === "items") && (sMeteorRawMessage.indexOf("\"fields\":{\"hid") !== -1))
                    ET_LayoutTweaksMod_resetSpellDisplay = true;
            }
            catch (err) { }
        });
    });

    ET.MCMF.EventSubscribe("ET:combatStart", function()
    {
        if (!ET_LayoutTweaksMod_setupCombatListeners)
        {
            ET_LayoutTweaksMod_setupCombatListeners = true;

            ET.MCMF.EventSubscribe("ET:combatWon", function()
            {
                ET_LayoutTweaksMod_DisableLobbyButtons();
                setTimeout(function() { ET_LayoutTweaksMod_AutoSelectFloorRoom_Backup(true); }, 1);
            });

            ET.MCMF.EventSubscribe("ET:combatLost", function()
            {
                ET_LayoutTweaksMod_DisableLobbyButtons();
                setTimeout(function() { ET_LayoutTweaksMod_AutoSelectFloorRoom_Backup(true); }, 1);
            });
        }
    });
};

ET_LayoutTweaksMod_HackyRedirect = function()
{
    $("#MCTempRedirect").click();
    $("#MCTempRedirect").remove();
};

ET_LayoutTweaksMod_HackyClicker = function(selector_to_click)
{
    $(selector_to_click).click();
};

/*
ET_LayoutTweaksMod_MutationObserver = undefined;

ET_LayoutTweaksMod_SetupMutationObserver = function()
{
    if (ET_LayoutTweaksMod_MutationObserver !== undefined)
    {
        ET_LayoutTweaksMod_MutationObserver.takeRecords();
        ET_LayoutTweaksMod_MutationObserver.disconnect();
    }

    ET_LayoutTweaksMod_MutationObserver = new MutationObserver(function(mutations, observer)
    {
        mutations.forEach(function(mutation)
        {
           for (let i = 0; i < mutation.addedNodes.length; i++)
           {
               try
               {
                   if (mutation.addedNodes[i].id !== undefined)
                       if (mutation.addedNodes[i].id.length === 17)
                            ET_LayoutTweaksMod_CondenseChat(jQ("div#" + mutation.addedNodes[i].id));
               }
               catch (err) { }
           }
        });
    }).observe(document.querySelector("div.direct-chat-messages div.scroll-height"), { childList: true, attributeFilter: ['div'] });
};
*/

// Do these things once
ET_LayoutTweaksMod_Content = function()
{
    let blazeWait = setInterval(function()
    {
        if (unsafeWindow.Blaze)
        {
            clearInterval(blazeWait);

            let meteorWait = setInterval(function()
            {
                if ((unsafeWindow.Router) && (unsafeWindow.Meteor))
                {
                    clearInterval(meteorWait);

                    document.PlayerAbilities = [];
                    Meteor.call('abilities.fetchLibraryExtra', function(err, data) {
                      if (err) {
                        console.log(err);
                      } else {
                        document.PlayerAbilities = jQ.makeArray(data);
                        //console.log(document.PlayerAbilities);
                      }
                    });


                    Router.onAfterAction(function()
                    {
                        //ET_LayoutTweaksMod_CombatLobby_page_rendered = false;
                    });

                    Router.onRun(function()
                    {
                        this.next();
                    });

                    Blaze._getTemplate("lobbyPage").onCreated(function()
                    {
                        ET_LayoutTweaksMod_AutoSelectFloorRoom(this, false);
                    });

                    Blaze._getTemplate("lobbyPage").onRendered(function()
                    {
                        setTimeout(ET_LayoutTweaksMod_AutoSelectFloorRoom_Backup, 1);
                        ET_LayoutTweaksMod_AutoSelectFloorRoom(this, true);
                    });

                    Blaze._getTemplate("lobbyUnit").onRendered(function()
                    {
                        setTimeout(ET_LayoutTweaksMod_AutoSelectFloorRoom_Backup, 1);

                        // if the lobby units are re-rendered, refresh the equipment and ability display in the combat lobby
                        ET_LayoutTweaksMod_resetSpellDisplay = true;
                    });

                    Blaze._getTemplate("overviewPage").onRendered(function()
                    {
                        ET.MCMF.Log("overviewPage rendered");
                        setTimeout(ET_LayoutTweaksMod_PageScanner_main, 1);
                    });

                    //// add new styles for chats
                    //jQ("body").append("<style type=\"text/css\">\r\nspan.direct-chat-timestamp { margin-left: 0px !important; color: #999 !important; }\r\n</style>\r\n");
                    //
                    // set up listener for re-rendered chat window
                    //Blaze._getTemplate("chatWindow").onRendered(function()
                    //{
                    //    // patch old rendered chat messages
                    //    ET_LayoutTweaksMod_CondenseAllChats();
                    //
                    //    // re-set up listener for newly-rendered chat messages
                    //    ET_LayoutTweaksMod_SetupMutationObserver();
                    //});
                    //
                    //// add new styles for our modals
                    //jQ("body").append("<style type=\"text/css\">\r\n" +
                    //
                    //    ".LTMod-modal { \r\n" +
                    //    "    display: none; /* Hidden by default */ \r\n" +
                    //    "    position: fixed; /* Stay in place */ \r\n" +
                    //    "    z-index: 1; /* Sit on top */ \r\n" +
                    //    "    left: 0; \r\n" +
                    //    "    top: 0; \r\n" +
                    //    "    width: 100%; /* Full width */ \r\n" +
                    //    "    height: 100%; /* Full height */ \r\n" +
                    //    "    overflow: auto; /* Enable scroll if needed */ \r\n" +
                    //    "    background-color: rgb(0,0,0); /* Fallback color */ \r\n" +
                    //    "    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */ \r\n" +
                    //    "} \r\n" +
                    //
                    //    "</style>\r\n");

                    jQ("div.body-content").prepend("<div id=\"LayoutTweaksModal\" class=\"LTMod-modal\"></div>")

                    window.addEventListener("click", function(ev)
                    {
                        if (ev.target === document.getElementsByClassName("LTModSpellCraftingModal")[0])
                            ET_LayoutTweaksMod_CloseModals();
                        if (ev.target === document.getElementsByClassName("LTModEquipmentModal")[0])
                            ET_LayoutTweaksMod_CloseModals();
                        if (ev.target === document.getElementsByClassName("LTModAbilityModal")[0])
                            ET_LayoutTweaksMod_CloseModals();
                    });
                }
            }, 20);
        }
    }, 20);

    let htmlSafeWait = setInterval(function()
    {
        if ((jQ("a[href=\"/mining\"].nav-link").length !== 0) && (jQ("div.direct-chat-messages div.scroll-height").length !== 0) && (ET.MCMF.UserName !== undefined))
        {
            clearInterval(htmlSafeWait);

            // set up listener for newly-rendered chat messages
            //ET_LayoutTweaksMod_SetupMutationObserver();

            // set gems display to be a link to the shop
            /*
            jQ("div#navbarSupportedContent").find("img[src=\"/icons/gems.svg\"]").parent().css("cursor", "pointer").on('click', function()
            {
                // silly, but onClick events can't trigger click events, so here's a hack.. probably a better way to navigate to another template in Blaze, but this is fine
                let sDestinationURI = unsafeWindow.location.protocol + "//" + unsafeWindow.location.hostname + "/shop";
                jQ("body").append("<a href=\"" + sDestinationURI + "\" id=\"MCTempRedirect\"></a>");
                setTimeout(ET_LayoutTweaksMod_HackyRedirect, 10);
            });
            */

            /*
            // add the chat tab back to the main navigation bar
            jQ("a[href=\"/shop\"].nav-link").parent().before("<li class=\"nav-item\"><a class=\"nav-link\" href=\"/chat\">Chat</a></li>");
            */

            /*
            // remove the chat link from the personal options menu
            jQ("a[href=\"/chat\"].dropdown-item").remove();
            */

            /*
            // remove the achievements link from the personal options menu (it's already on the home page)
            jQ("a[href=\"/achievements\"].dropdown-item").remove();
            */

            /*
            // add the skills tab back to the main navigation bar
            jQ("a[href=\"/shop\"].nav-link").parent().before("<li class=\"nav-item\"><a class=\"nav-link\" href=\"/skills\">Skills</a></li>");
            */

            /*
            // add personal profile tab to the main navigation bar
            jQ("a[href=\"/skills\"].nav-link").parent().before("<li class=\"nav-item\"><a class=\"nav-link\" href=\"/profile/" + ET.MCMF.UserName + "\">Profile</a></li>");
            */

            // change the new combat tab in the main navigation bar to say 'new'
            ////jQ("a[href=\"/newCombat\"].nav-link").text("Battle (new)");

            // add the old combat tab back to the main navigation bar
            ////jQ("a[href=\"/newCombat\"].nav-link").parent().after("<li class=\"nav-item\"><a class=\"nav-link\" href=\"/combat\">Battle (old)</a></li>");

            /*
            // remove the shop link from the main navigation bar
            jQ("a[href=\"/shop\"].nav-link").remove();
            */
        }
    }, 20);
};

ET_LayoutTweaksMod_DisableLobbyButtons = function()
{
return; // doesn't seem to be working correctly -- let's leave the triggers in, but disable the functionality for now

    if ((!ET.MCMF.IsNewCombatTab()) || (ET.MCMF.GetActiveTabSection() !== "group"))
        return;

    if (jQ(".LayoutTweaksHiddenLobby").length === 0)
    {
        jQ(".lobby-container").addClass("LayoutTweaksHiddenLobby");

        if (jQ(".LayoutTweaksTempLobby").length === 0)
            jQ(".LayoutTweaksHiddenLobby").before("<div class=\"LayoutTweaksTempLobby\"><div class=\"d-flex align-items-center justify-content-center flex-wrap lobby-units-container\"><br /><br /><br /><br /><br />Lobby is loading . . .</div></div>");

        jQ(".LayoutTweaksHiddenLobby").find("button").addClass("disabled");
        jQ(".LayoutTweaksHiddenLobby").hide();

        jQ(".LayoutTweaksTempLobby").addClass("container").addClass("lobby-container").addClass("mt-2");
    }

    ET_LayoutTweaksMod_CombatLobby_page_rendered = false;
};

ET_LayoutTweaksMod_EnableLobbyButtons = function()
{
return; // doesn't seem to be working correctly -- let's leave the triggers in, but disable the functionality for now

    if ((!ET.MCMF.IsNewCombatTab()) || (ET.MCMF.GetActiveTabSection() !== "group"))
        return;

    jQ(".LayoutTweaksTempLobby").remove();
    jQ(".LayoutTweaksHiddenLobby").find("button").removeClass("disabled");
    jQ(".LayoutTweaksHiddenLobby").show();

    ET_LayoutTweaksMod_CombatLobby_page_rendered = true;
};

ET_LayoutTweaksMod_CombatLobby_page_rendered = false;
ET_LayoutTweaksMod_AutoSelectFloorRoom_Backup_triggered = false;
ET_LayoutTweaksMod_AutoSelectFloorRoom_Backup = function(forced)
{
return; // doesn't seem to be working correctly -- let's leave the triggers in, but disable the functionality for now

    if ((!ET.MCMF.IsNewCombatTab()) || (ET.MCMF.GetActiveTabSection() !== "group"))
        return;

    if ((!forced) && (ET_LayoutTweaksMod_AutoSelectFloorRoom_Backup_triggered))
    {
        setTimeout(ET_LayoutTweaksMod_AutoSelectFloorRoom_Backup, 100);
        return;
    }

    ET_LayoutTweaksMod_AutoSelectFloorRoom_Backup_triggered = true;

    try
    {
        ET_LayoutTweaksMod_DisableLobbyButtons();

        let oLastBattle = Meteor.connection._stores.battles._getCollection().find().fetch().sort(function(battleA, battleB){ if (battleA.createdAt < battleB.createdAt) return 1; return -1; })[0];
        let iFloor = CInt(oLastBattle.floor); // throws exception if no data is loaded yet (queues retry)

        if (forced || (jQ(".lobby-container").find("button.battle-again-btn").length === 0))
        {
            ET_LayoutTweaksMod_HackyClicker("a.consumables-btn");

            setTimeout(function() { ET_LayoutTweaksMod_HackyClicker("button.back-to-lobby-btn"); }, 250);
        }
        else
            ET_LayoutTweaksMod_EnableLobbyButtons();
    }
    catch (err)
    {
        ET_LayoutTweaksMod_AutoSelectFloorRoom_Backup_triggered = false;
        setTimeout(function() { ET_LayoutTweaksMod_AutoSelectFloorRoom_Backup(forced); }, 100);
    }

    // intentionally not toggling 'ET_LayoutTweaksMod_AutoSelectFloorRoom_Backup_triggered' off here
};

ET_LayoutTweaksMod_AutoSelectFloorRoom_rendering = false;
ET_LayoutTweaksMod_AutoSelectFloorRoom = function(template, rendered)
{
return; // doesn't seem to be working correctly -- let's leave the triggers in, but disable the functionality for now

    if ((!ET.MCMF.IsNewCombatTab()) || (ET.MCMF.GetActiveTabSection() !== "group"))
        return;

    if (ET_LayoutTweaksMod_AutoSelectFloorRoom_rendering)
        return;

    ET_LayoutTweaksMod_AutoSelectFloorRoom_rendering = true;

    try
    {
        let oLastBattle = Meteor.connection._stores.battles._getCollection().find().fetch().sort(function(battleA, battleB){ if (battleA.createdAt < battleB.createdAt) return 1; return -1; })[0];
        let iFloor = CInt(oLastBattle.floor);
        let sFloor = iFloor.toFixed(0)
        let iRoom = CInt(oLastBattle.room);
        let sRoom = iRoom.toFixed(0)
        if (oLastBattle.room.toString().trim().toLowerCase() === "boss")
            sRoom = "Boss";
        let bOffs = false;

        if (oLastBattle.isExplorationRun)
        {
            if (iFloor === CInt(jQ("a.select-floor:last-child").attr("data-floor")))
                bOffs = true;
            sRoom = "All"
        }

        if (rendered)
        {
            if (jQ(".lobby-container").find("button.battle-again-btn").length === 0)
            {
                jQ("button.battle-btn").addClass("mr-3").after("<button class=\"btn btn-primary battle-again-btn d-flex justify-content-center\" style=\"width: 150px\">Battle Again</button>");
                jQ("button.battle-again-btn").on('click', function()
                {
                    template.state.set("newBattleLoading", !0);
                    jQ("button.battle-again-btn").addClass("disabled");
                    ET.MCMF.CallGameCmd("battles.findTowerBattle", sFloor, sRoom,
                        function(err, n)
                        {
                            if (err)
                            {
                                toastr.warning(err.reason);
                                template.state.set("newBattleLoading", !1);
                                jQ("button.battle-again-btn").removeClass("disabled");
                            }
                        }
                    );
                });

                ET_LayoutTweaksMod_AutoSelectFloorRoom_Backup_triggered = false;
            }
        }

        if ((jQ("btn.dropdown.room-dropdown").find("button.btn.dropdown-toggle").text() !== sRoom) || (jQ("btn.dropdown.floor-dropdown").find("button.btn.dropdown-toggle").text() !== sFloor))
        {
            if (ET.MCMF.WantDebug) ET.MCMF.Log("... selecting floor '" + sFloor + "', room '" + sRoom + "'");

            ET.MCMF.CallGameCmd("users.setUiState", "towerFloor", iFloor);
            template.state.set("usersCurrentFloor", iFloor);

            if (!bOffs)
                template.state.set("usersCurrentRoom", sRoom);
        }
    }
    catch (err) { }

    ET_LayoutTweaksMod_AutoSelectFloorRoom_rendering = false;
};

// Do these things multiple times over.. and.. over
ET_LayoutTweaksMod_PageScanner = function()
{
    ET_LayoutTweaksMod_PageScanner_main();

    setTimeout(ET_LayoutTweaksMod_PageScanner, 500);
};

ET_LayoutTweaksMod_CloseModals = function()
{
    jQ(".LTMod-modal").css("display", "none");
    jQ("div.modal").css("display", "none");
};

ET_LayoutTweaksMod_CraftSpellCast = function(ability_id)
{
    try
    {
        Meteor.call("abilities.fetchSpellCrafting", Meteor.connection._stores.abilities._getCollection().find().fetch()[0], function(err, data)
        {
            let oSpellCastCrafting = jQ.makeArray(data).filter(function(oSpellCastCraft) { if (oSpellCastCraft.abilityId === ability_id) return true; return false; })[0];

            let iMax = CInt(oSpellCastCrafting.maxToCraft);
            let iDef = iMax >= 25 ? 25 : iMax;

            jQ("h5#LTModSpellCraftingModal").parent().find("small").html("<img src=\"/icons/" + oSpellCastCrafting.icon + "\" style=\"height: 20px; width: 20px;\" /> Craft more spell casts for " + oSpellCastCrafting.name + ".");

            jQ(".LTModSpellCraftingModal").find("span.qty-max").text(iMax.toLocaleString());
            jQ(".LTModSpellCraftingModal").find("input.craft-amount-input").val(iDef.toFixed(0));
            jQ(".LTModSpellCraftingModal").find("button.btn-secondary").attr("data-amount", iDef.toLocaleString()).text("Craft X (" + iDef.toLocaleString() + ")");
            jQ(".LTModSpellCraftingModal").find("button.btn-danger").attr("data-amount", iMax.toLocaleString()).text("Craft All (" + iMax.toLocaleString() + ")");

            jQ(".LTModSpellCraftingModal").find("input.craft-amount-input").on('blur compositionupdate keypress keyup change', function()
            {
                let iVal = CInt(jQ(".LTModSpellCraftingModal").find("input.craft-amount-input").val());

                iVal = (iVal > iMax) ? iMax : iVal;

                jQ(".LTModSpellCraftingModal").find("button.btn-secondary").attr("data-amount", iVal.toLocaleString()).text("Craft X (" + iVal.toLocaleString() + ")");
            });

            jQ(".LTModSpellCraftingModal").find("button.btn-primary").on('click', function()
            {
                ET.MCMF.CallGameCmd("abilities.craftSpell", ability_id, 1);
                ET_LayoutTweaksMod_CloseModals();
            });

            jQ(".LTModSpellCraftingModal").find("button.btn-secondary").on('click', function()
            {
                let iVal = CInt(jQ(".LTModSpellCraftingModal").find("input.craft-amount-input").val());

                ET.MCMF.CallGameCmd("abilities.craftSpell", ability_id, iVal);
                ET_LayoutTweaksMod_CloseModals();
            });

            jQ(".LTModSpellCraftingModal").find("button.btn-danger").on('click', function()
            {
                let iVal = CInt(jQ(".LTModSpellCraftingModal").find("button.btn-danger").attr("data-amount"));

                ET.MCMF.CallGameCmd("abilities.craftSpell", ability_id, iVal);
                ET_LayoutTweaksMod_CloseModals();
            });

            setTimeout(function(){ jQ(".LTModSpellCraftingModal").find("input.craft-amount-input").get(0).selectionStart = jQ(".LTModSpellCraftingModal").find("input.craft-amount-input").get(0).selectionEnd = 10000; jQ(".LTModSpellCraftingModal").find("input.craft-amount-input").get(0).focus(); }, 1);

            jQ(".LTMod-modal").css("display", "block");
            jQ(".LTModSpellCraftingModal").css("display", "block");
        });
    }
    catch (err) { }
};

ET_LayoutTweaksMod_EquipmentModalList = function(sSlot, sSlotDesc)
{
    let oElContainer = jQ(".LTModEquipmentModal").find("div.LTModEquipmentContainer");
    let oItems = ET.MCMF.GetItems({category: "combat", slot: sSlot.trim()});

    oElContainer.html("");
    jQ("h5#LTModEquipmentModal").parent().find("small").html("Equip a new " + sSlotDesc + ".");

    oItems.forEach(function(oItem)
    {
      try {
        if (!oItem.equipped && !oItem.hidden)
        {
            let sElName = `LTModEquipThis-${oItem._id}`;

			const rarityBorderStyle = ET_LayoutTweaksMod_RarityBorder(oItem.rarityId)
			let rarityBorderCSS = ""
			
			if (rarityBorderStyle && rarityBorderStyle.trim().length > 0)
				rarityBorderCSS = " border: " + rarityBorderStyle + ";";

            oElContainer.append
            (
                "<div class=\"item-icon-container item icon-box " + sElName + "\" style=\"position: relative;" + rarityBorderCSS + "\">" +
                    "    <div class=\"item-amount text-capitalize\" style=\"position: absolute; bottom: 0px; right: 3px; font-size: 10px; text-align: center; width: 88px; max-width: 88px; text-overflow: hidden; display: inline-block; white-space: nowrap; overflow: hidden;\">" +
                    "        " + oItem.name +
                    "    </div>" +
                    "    <div class=\"item-quality\">" +
                    "        " + ((CDbl(oItem.quality) > 0.0) ? `${oItem.quality.toFixed(0)}%` : "") +
                    "    </div>" +
                    "    <img src=\"/icons/" + oItem.icon + "\" class=\"item-icon\" />" +
                "</div>"
            );

            oEl = jQ(`.${sElName}`);

            oEl.css("cursor", "pointer").on('click', function()
            {
                ET.MCMF.CallGameCmd("items.equip", oItem._id, oItem.name);
                ET_LayoutTweaksMod_CloseModals();
            });

            let sTooltipName = `LayoutTweaksTooltip-${oItem._id}`;

            if ((!oEl._tippy) && (jQ(`#${sTooltipName}`).length === 0))
            {
                jQ(`#tooltip-${sTooltipName}`).remove();
                jQ("body").append(`<div class=\"item-tooltip-content my-tooltip-inner\" id=\"tooltip-${sTooltipName}\"></div>`);

                let sStatLines = "";
                let sExtraText = "";

                if (IsValid(oItem.stats))
                {
					let localStatsObj = Object.assign({}, oItem.stats)
									
					try {
						const rarityIdConsts = ET_LayoutsMod__ITEM_RARITIES[oItem.rarityId]
						if (rarityIdConsts && rarityIdConsts.statBonuses) {
							Object.keys(localStatsObj).forEach((statName) => {
							// disallow % bonuses to attack speed
							if (statName !== "attackSpeed") {
								// ensure that property refers to a stat that is a number and valued more than 0 (non-numeric/non-positive/non-zero all disallowed)
								if (CDbl(localStatsObj[statName]) > 0.0) {
									localStatsObj[statName] = localStatsObj[statName] * ((100.0 + rarityIdConsts.statBonuses) / 100.0)
									}
								}
							})

						}
					} catch (err) {}
					
					const rarityColorStyle = ET_LayoutTweaksMod_RarityColor(oItem.rarityId)
					if (rarityColorStyle && rarityColorStyle.trim().length > 0) {
						sStatLines = `${sStatLines}<span style="color: ${rarityColorStyle}; text-transform: capitalize;"><b>${oItem.rarityId}</b></span> <br />`;
					}
					
                    if (IsValid(localStatsObj.damage) && (CDbl(localStatsObj.damage) != 0.0))
                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-damage extra-small-icon mr-1\"></i>${localStatsObj.damage.toFixed(1)}</div>`;
                    if (IsValid(localStatsObj.energyStorage) && (CDbl(localStatsObj.energyStorage) != 0.0))
                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-energyStorage extra-small-icon mr-1\"></i>${localStatsObj.energyStorage.toFixed(1)} energy storage</div>`;

                    if (IsValid(localStatsObj.attack) && (CDbl(localStatsObj.attack) != 0.0)) {
                      if (IsValid(localStatsObj.attackMax) && (CDbl(localStatsObj.attackMax) != 0.0)) {
                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-attack extra-small-icon mr-1\"></i>${localStatsObj.attack.toFixed(1)} - ${localStatsObj.attackMax.toFixed(1)} damage</div>`;
                      } else {
                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-attack extra-small-icon mr-1\"></i>${localStatsObj.attack.toFixed(1)} damage</div>`;
                      }
                    }
                    if (IsValid(localStatsObj.attackSpeed) && (CDbl(localStatsObj.attackSpeed) != 0.0))
                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-attackSpeed extra-small-icon mr-1\"></i>${localStatsObj.attackSpeed.toFixed(1)} attack speed</div>`;
                    if (IsValid(localStatsObj.healthMax) && (CDbl(localStatsObj.healthMax) != 0.0))
                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-healthMax extra-small-icon mr-1\"></i>${localStatsObj.healthMax.toFixed(1)} health</div>`;
                    if (IsValid(localStatsObj.accuracy) && (CDbl(localStatsObj.accuracy) != 0.0))
                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-accuracy extra-small-icon mr-1\"></i>${localStatsObj.accuracy.toFixed(1)} accuracy</div>`;
                    if (IsValid(localStatsObj.magicPower) && (CDbl(localStatsObj.magicPower) != 0.0))
                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-magicPower extra-small-icon mr-1\"></i>${localStatsObj.magicPower.toFixed(1)} magic power</div>`;
                    if (IsValid(localStatsObj.magicArmor) && (CDbl(localStatsObj.magicArmor) != 0.0))
                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-magicArmor extra-small-icon mr-1\"></i>${localStatsObj.magicArmor.toFixed(1)} magic armor</div>`;
                    if (IsValid(localStatsObj.healingPower) && (CDbl(localStatsObj.healingPower) != 0.0))
                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-healingPower extra-small-icon mr-1\"></i>${localStatsObj.healingPower.toFixed(1)} healing power</div>`;
                    if (IsValid(localStatsObj.defense) && (CDbl(localStatsObj.defense) != 0.0))
                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-defense extra-small-icon mr-1\"></i>${localStatsObj.defense.toFixed(1)} defense</div>`;
                    if (IsValid(localStatsObj.armor) && (CDbl(localStatsObj.armor) != 0.0))
                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-armor extra-small-icon mr-1\"></i>${localStatsObj.armor.toFixed(1)} armor</div>`;

                    if (IsValid(localStatsObj.energyRegen) && (CDbl(localStatsObj.energyRegen) != 0.0))
                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-energyRegen extra-small-icon mr-1\"></i>${localStatsObj.energyRegen.toFixed(1)} energy regen</div>`;
                }

                jQ.makeArray(oItem.enchantments).forEach(function(oThisEnchant)
                {
                    sExtraText = `${sExtraText}<div style="text-capitalize">Enchantment: ${oThisEnchant}</div>`;
                });

                jQ(`#tooltip-${sTooltipName}`).html
                (
                    "    <h3 class=\"popover-title text-capitalize\">" +
                    "        " + oItem.name + ((oItem.enhanced) ? " (E)" : "") + ((oItem?.extraStats?.level > 0) ? " (Lv." + oItem?.extraStats?.level.toFixed(0) + ")" : "") + "<br />" +
                    "    </h3>" +
                    "    <div class=\"popover-content\" style=\"max-width: 400px;\">" +
                    "        " + sStatLines +
                    "        " + sExtraText +
                    "        <div><b>Left Click</b> to equip</div>" +
                    "    </div>"
                );

                tippy(`.${sElName}`,
                {
                    html: jQ(`#tooltip-${sTooltipName}`)[0],
                    performance: !0,
                    animateFill: !1,
                    distance: 5
                });
            }
        }
      } catch (err) {
        ET.MCMF.Log("Error rending details for item:");
        console.log(oItem);
        ET.MCMF.Log(err);
      }
    });

    let oCurrentItem = ET.MCMF.GetItems({category: "combat", equipped: true, slot: sSlot.trim()});
    if (IsValid(oCurrentItem) && (oCurrentItem.length > 0))
    {
        oElContainer.append("<div class=\"item-icon-container item icon-box LTModEquipThis-unequip\" style=\"position: relative; white-space: nowrap;\">[Remove]</div>");
        jQ(".LTModEquipThis-unequip").on('click', function()
        {
            ET.MCMF.CallGameCmd("items.unequip", oCurrentItem[0]._id, oCurrentItem[0].itemId);
            ET_LayoutTweaksMod_CloseModals();
        });
    }

    jQ(".LTModEquipmentModal").find("div.item-icon-container").hover
    (
        function() { jQ(this).css("border-width", "3px"); },
        function() { jQ(this).css("border-width",    ""); }
    );

    jQ(".LTMod-modal").css("display", "block");
    jQ(".LTModEquipmentModal").css("display", "block");
};

ET_LayoutTweaksMod_AbilityID = function(oAbility) {
  if (IsValid(oAbility)) {
    if (IsValid(oAbility.abilityId)) {
      return oAbility.abilityId;
    }
    if (IsValid(oAbility.id)) {
      return oAbility.id;
    }
    if (IsValid(oAbility._id)) {
      return oAbility._id;
    }
  }
  return '';
}

ET_LayoutTweaksMod_AbilityModalList = function(sSlot, bIsEmpty)
{
    let oElContainer = jQ(".LTModAbilityModal").find("div.LTModAbilityContainer");
    //let oAbilities = jQ.makeArray(Meteor.connection._stores.abilities._getCollection().find().fetch()[0].learntAbilities);
    let oAbilities = document.PlayerAbilities;

    jQ.makeArray(Meteor.connection._stores.abilities._getCollection().find().fetch()[0].learntAbilities).forEach((learntAbility) => {
      oAbilities.forEach(function(ourAbility, idx, arr) {
        if (ET_LayoutTweaksMod_AbilityID(ourAbility) === ET_LayoutTweaksMod_AbilityID(learntAbility)) {
          arr[idx] = Object.assign(ourAbility, learntAbility);
        }
      });
    });

    oElContainer.html("");
    if (sSlot === 'companion') {
      jQ("h5#LTModAbilityModal").parent().find("small").html("Equip a new <b>companion</b> ability.");
    } else {
      jQ("h5#LTModAbilityModal").parent().find("small").html("Equip a new ability or spell.");
    }

    oAbilities.sort(function(oAbility1, oAbility2)
    {
        // passives before actives
        if (oAbility1.cooldown === 0 && oAbility2.cooldown !== 0) return -1;
        if (oAbility1.cooldown !== 0 && oAbility2.cooldown === 0) return 1;

        // abilities first, then spells
        if (oAbility1.isSpell && !oAbility2.isSpell) return 1;
        if (!oAbility1.isSpell && oAbility2.isSpell) return -1;

        // sort alphabetically
        if (oAbility1.name > oAbility2.name) return 1;
        if (oAbility1.name < oAbility2.name) return -1;

        return 0;
    });

    oAbilities.forEach(function(oAbility)
    {
        if (!oAbility.equipped)
        {
            let sElName = `LTModEquipThis-${ET_LayoutTweaksMod_AbilityID(oAbility)}`;

            let sAbilityFriendlyName = oAbility.name;

			if (!oAbility.learntLevel || oAbility.learntLevel == 0)
				return;

			Meteor.connection._stores.abilities._getCollection().find().fetch()[0].learntAbilities.filter(function(oAbility){if (oAbility.equipped && oAbility.slot === "mainHand") return true; return false;})[0];

            for (let j = 1; j <= 5; j++)
                sAbilityFriendlyName = sAbilityFriendlyName.replace(` (level ${j})`, "");

            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "defensive_stance")   sAbilityFriendlyName = sAbilityFriendlyName.replace("defensive stance", "def. stance");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "double_edged_sword") sAbilityFriendlyName = sAbilityFriendlyName.replace("doubled edged sword", "double edge");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "elemental_shield")   sAbilityFriendlyName = sAbilityFriendlyName.replace("elemental shield", "ele. shield");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "evasive_maneuvers")  sAbilityFriendlyName = sAbilityFriendlyName.replace("evasive maneuvers", "evasive");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "feeding_frenzy")     sAbilityFriendlyName = sAbilityFriendlyName.replace("feeding frenzy", "feed. frenzy");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "lightning_dart")     sAbilityFriendlyName = sAbilityFriendlyName.replace("lightning dart", "lit. dart");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "penetrating_slash")  sAbilityFriendlyName = sAbilityFriendlyName.replace("penetrating slash", "pen. slash");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "phantom_strikes")    sAbilityFriendlyName = sAbilityFriendlyName.replace("phantom strikes", "phant. strikes");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "volcanic_shield")    sAbilityFriendlyName = sAbilityFriendlyName.replace("volcanic shield", "volc. shield");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "lightning_storm")    sAbilityFriendlyName = sAbilityFriendlyName.replace("lightning storm", "light. storm");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "angels_touch")       sAbilityFriendlyName = sAbilityFriendlyName.replace("angel's touch", "angel touch");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "raise_your_glass")   sAbilityFriendlyName = sAbilityFriendlyName.replace("raise your glass", "raise glass");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "poisoned_blade")     sAbilityFriendlyName = sAbilityFriendlyName.replace("poisoned blade", "pois. blade");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "furied_defense")     sAbilityFriendlyName = sAbilityFriendlyName.replace("furied defense", "furied def.");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "frenzied_winds")     sAbilityFriendlyName = sAbilityFriendlyName.replace("frenzied winds", "frenz. winds");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "healing_shield")     sAbilityFriendlyName = sAbilityFriendlyName.replace("healing shield", "heal. shield");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "mending_spring")     sAbilityFriendlyName = sAbilityFriendlyName.replace("mending spring", "mend. spring");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "year_of_the_pig")    sAbilityFriendlyName = sAbilityFriendlyName.replace("year of the pig", "yr. of the pig");
            if (ET_LayoutTweaksMod_AbilityID(oAbility) === "skeletal_warrior")   sAbilityFriendlyName = sAbilityFriendlyName.replace("skeletal warrior", "skel. warrior");

            let sAbilityRequiresIcons = "";

            if (sSlot !== 'companion' && oAbility.slot === 'companion')
              return;
            if (sSlot === 'companion' && oAbility.slot !== 'companion')
              return;

		    if (window.ET.MCMF.IsClass() && window.ET.MCMF.WhichClass() != "tactician")
			{
				let bSlotIsActive = false;
				if (sSlot == "mainHand") bSlotIsActive = true;
				if (sSlot == "offHand") bSlotIsActive = true;
				if (sSlot == "head") bSlotIsActive = true;
				if (sSlot == "chest") bSlotIsActive = true;
				if (sSlot == "legs") bSlotIsActive = true;
				let bAbilityIsActive = !oAbility.isPassive;

				if (sSlot === 'companion')
					jQ("h5#LTModAbilityModal").parent().find("small").html("Equip a new <b>companion</b> ability.");
				else if (bSlotIsActive)
					jQ("h5#LTModAbilityModal").parent().find("small").html("Equip a new <b>active</b> ability or spell.");
				else
					jQ("h5#LTModAbilityModal").parent().find("small").html("Equip a new <b>passive</b> ability.");

				if (bSlotIsActive && !bAbilityIsActive) return;
				if (!bSlotIsActive && bAbilityIsActive) return;
			}

            if (oAbility.isPacifist || (IsValid(oAbility.requires) && (oAbility.requires.length > 0)) || (IsValid(oAbility.cantUseWith) && (oAbility.cantUseWith.length > 0)))
            {
                sAbilityRequiresIcons = "<div style=\"position: absolute; left: 2px; top: 0\" class=\"required-weapon\">";

                if (oAbility.isPacifist) {
                  sAbilityRequiresIcons += `<img src=\"/icons/pacifist.svg\" style=\"height: 20px; width: 20px;\" />`;
                }

                if (IsValid(oAbility.requires))
                {
                    jQ.makeArray(oAbility.requires).forEach(function(oThisRequiredThing)
                    {
                        if (oThisRequiredThing.type === "weaponType")
                        {
                          jQ.makeArray(oThisRequiredThing.weaponTypes).forEach((weaponTypeRequired) => {
                            sAbilityRequiresIcons += `<img src=\"/icons/${weaponTypeRequired}.svg\" style=\"height: 20px; width: 20px;\" />`;
                          });
                        }
                    });
                }

                if (IsValid(oAbility.cantUseWith))
                {
                    jQ.makeArray(oAbility.cantUseWith).forEach(function(oThisForbiddenThing)
                    {
                        if (oThisForbiddenThing.type === "weaponType")
                        {
                          jQ.makeArray(oThisForbiddenThing.weaponTypes).forEach((weaponTypeForbidden) => {
                            sAbilityRequiresIcons += `<img src="/icons/forbidden.svg" style="height: 20px; width: 20px; background: url(/icons/${weaponTypeForbidden}.svg) center center;">`;
                          });
                        }
                    });
                }

                sAbilityRequiresIcons += "</div>";
            }

            let sAbilityKindStyle = (CInt(oAbility.cooldown) === 0) ? "background-color: #f2ffe5;" : "";
            try { sAbilityKindStyle = (oAbility.isSpell && ( IsValid(oAbility.requires)) && (oAbility.requires.length  >  0)) ? "background-color: #eeddff;" : sAbilityKindStyle; } catch (err) { }
            try { sAbilityKindStyle = (oAbility.isSpell && (!IsValid(oAbility.requires)) || (oAbility.requires.length === 0)) ? "background-color: #e3f0ff;" : sAbilityKindStyle; } catch (err) { }

            oElContainer.append
            (
                "<div class=\"item-icon-container item small icon-box " + sElName + "\" style=\"position: relative; " + sAbilityKindStyle + "\">" +
                    "    <div class=\"item-amount text-capitalize\" style=\"position: absolute; bottom: 0px; right: 3px; font-size: 9px; text-align: center; width: 54px; max-width: 54px; text-overflow: hidden; display: inline-block; white-space: nowrap; overflow: hidden;\">" +
                    "        " + sAbilityFriendlyName +
                    "    </div>" +
                    "    <img src=\"/icons/" + oAbility.icon + "\" class=\"item-icon\" />" +
                    "    " + sAbilityRequiresIcons +
                "</div>"
            );

            oEl = jQ(`.${sElName}`);

            oEl.css("cursor", "pointer").on('click', function()
            {
                ET.MCMF.CallGameCmd("abilities.unequip", sSlot, function()
                {
                    ET.MCMF.CallGameCmd("abilities.equip", ET_LayoutTweaksMod_AbilityID(oAbility));
                });
                ET_LayoutTweaksMod_CloseModals();
            });

            let sTooltipName = `LayoutTweaksTooltip-${ET_LayoutTweaksMod_AbilityID(oAbility)}`;

            if ((!oEl._tippy) && (jQ(`#${sTooltipName}`).length === 0))
            {
                jQ(`#tooltip-${sTooltipName}`).remove();
                jQ("body").append(`<div class=\"item-tooltip-content my-tooltip-inner\" id=\"tooltip-${sTooltipName}\"></div>`);

                let sStatLines = "";
                let sExtraText = "";

                jQ(`#tooltip-${sTooltipName}`).html
                (
                    "    <h3 class=\"popover-title text-capitalize\">" +
                    "        " + oAbility.name + "<br />" +
                    "    </h3>" +
                    "    <div class=\"popover-content\" style=\"max-width: 400px;\">" +
                    "        <div>" + oAbility.description + "</div>" +
                    "        " + ((CInt(oAbility.cooldown) > 0) ? `<div>Cooldown <b>${oAbility.cooldown.toFixed(0).toFriendlyTime()}</b></div>` : "") +
                    "        " + ((CInt(oAbility.casts) > 0) ? `<div><b>${CInt(oAbility.casts).toLocaleString()}</b> casts remaining.</div>` : "") +
                    "        <div><b>Left Click</b> to equip</div>" +
                    "    </div>"

                );

                tippy(`.${sElName}`,
                {
                    html: jQ(`#tooltip-${sTooltipName}`)[0],
                    performance: !0,
                    animateFill: !1,
                    distance: 5
                });
            }
        }
    });

    if (!bIsEmpty)
    {
        oElContainer.append("<div class=\"item-icon-container item small icon-box LTModEquipThis-unequip\" style=\"position: relative; white-space: nowrap;\">[Remove]</div>");
        jQ(".LTModEquipThis-unequip").on('click', function()
        {
            ET.MCMF.CallGameCmd("abilities.unequip", sSlot);
            ET_LayoutTweaksMod_CloseModals();
        });
    }

    jQ(".LTModAbilityModal").find("div.item-icon-container").hover
    (
        function() { jQ(this).css("border-width", "3px"); },
        function() { jQ(this).css("border-width",    ""); }
    );

    jQ(".LTMod-modal").css("display", "block");
    jQ(".LTModAbilityModal").css("display", "block");
};

ET_LayoutTweaksMod_RarityColor = function(rarityId)
{
	let borderStyle = "";
	if (rarityId === "crude") {
		borderStyle = "#555555 !important"
	} else if (rarityId === "rough") {
		borderStyle = "#666644 !important"
	} else if (rarityId === "improved") {
		borderStyle = "#998800 !important"
	} else if (rarityId === "mastercrafted") {
		borderStyle = "#cc7700 !important"
	} else if (rarityId === "masterforged") {
		borderStyle = "#ee6622 !important"
	} else if (rarityId === "ascended") {
		borderStyle = "#ff2266 !important"
	} else if (rarityId === "ethereal") {
		borderStyle = "#FF5599 !important"
	} else if (rarityId === "perfect") {
		borderStyle = "#FF71aa !important"
	} else if (rarityId === "fine") {
		borderStyle = "#66aaaa !important"
	} else if (rarityId === "rare") {
		borderStyle = "#3388aa !important"
	} else if (rarityId === "extraordinary") {
		borderStyle = "#3366aa !important"
	} else if (rarityId === "phenomenal") {
		borderStyle = "#0055cc !important"
	} else if (rarityId === "epic") {
		borderStyle = "#0022ee !important"
	} else if (rarityId === "divine") {
		borderStyle = "#4444ff !important"
	} else if (rarityId === "incredible") {
		borderStyle = "#6141ff !important"
	} else if (rarityId === "unparalleled") {
		borderStyle = "#9151ff !important"
	} else if (rarityId === "prized") {
		borderStyle = "#883388 !important"
	} else if (rarityId === "legendary") {
		borderStyle = "#cc44cc !important"
	} else if (rarityId === "artifact") {
		borderStyle = "#44cc44 !important"
	}
	return borderStyle;
};

ET_LayoutTweaksMod_RarityBorder = function(rarityId)
{
	let borderStyle = "";
	if (rarityId === "crude") {
		borderStyle = "3px dotted #555555 !important"
	} else if (rarityId === "rough") {
		borderStyle = "3px dotted #666644 !important"
	} else if (rarityId === "improved") {
		borderStyle = "3px dashed #998800 !important"
	} else if (rarityId === "mastercrafted") {
		borderStyle = "3px dashed #cc7700 !important"
	} else if (rarityId === "masterforged") {
		borderStyle = "3px double #ee6622 !important"
	} else if (rarityId === "ascended") {
		borderStyle = "3px double #ff2266 !important"
	} else if (rarityId === "ethereal") {
		borderStyle = "3px double #FF5599 !important"
	} else if (rarityId === "perfect") {
		borderStyle = "3px double #FF71aa !important"
	} else if (rarityId === "fine") {
		borderStyle = "3px dashed #66aaaa !important"
	} else if (rarityId === "rare") {
		borderStyle = "3px dashed #3388aa !important"
	} else if (rarityId === "extraordinary") {
		borderStyle = "3px double #3366aa !important"
	} else if (rarityId === "phenomenal") {
		borderStyle = "3px double #0055cc !important"
	} else if (rarityId === "epic") {
		borderStyle = "3px double #0022ee !important"
	} else if (rarityId === "divine") {
		borderStyle = "3px double #4444ff !important"
	} else if (rarityId === "incredible") {
		borderStyle = "3px double #6141ff !important"
	} else if (rarityId === "unparalleled") {
		borderStyle = "3px double #9151ff !important"
	} else if (rarityId === "prized") {
		borderStyle = "3px double #883388 !important"
	} else if (rarityId === "legendary") {
		borderStyle = "3px double #cc44cc !important"
	} else if (rarityId === "artifact") {
		borderStyle = "3px double #44cc44 !important"
	}
	return borderStyle;
};

const ET_LayoutsMod__ITEM_RARITIES = {
    // Crafting T-1 (next - 30)
    crude: {
        rarityId: "crude",
        label: "Crude",
        color: "555555",
        statBonuses: -50.0,
        nextRarity: {
            rarityId: "rough",
            successChance: 75.0 // 75% chance (plus 1% chance per crafting skill level above recipe to craft this)
        },
        prevRarity: {
            rarityId: "crude"
        }
    },

    // Crafting T0 (next - 20)
    rough: {
        rarityId: "rough",
        label: "Rough",
        color: "666644",
        statBonuses: -20.0,
        nextRarity: {
            rarityId: "standard",
            successChance: 60.0 // 60% chance (plus 1% chance per crafting skill level above recipe to craft this)
        },
        prevRarity: {
            rarityId: "crude"
        }
    },

    // Crafting T1
    standard: {
        rarityId: "standard",
        label: "",
        color: "",
        statBonuses: 0.0,
        nextRarity: {
            rarityId: "improved",
            successChance: 45.0 // 45% chance (plus 1% chance per crafting skill level above recipe to craft this)
        },
        prevRarity: {
            rarityId: "rough"
        }
    },

    // Crafting T2 (33.333% of the last + 20/[tier-1]%)
    improved: {
        rarityId: "improved",
        label: "Improved",
        color: "998800",
        statBonuses: 20.0,
        nextRarity: {
            rarityId: "mastercrafted",
            successChance: 30.0 // 30% chance (plus 1% chance per crafting skill level above recipe to craft this)
        },
        prevRarity: {
            rarityId: "standard"
        }
    },

    // Crafting T3 (33.333% of the last + 20/[tier-1]%)
    mastercrafted: {
        rarityId: "mastercrafted",
        label: "Mastercrafted",
        color: "cc7700",
        statBonuses: 36.7,
        nextRarity: {
            rarityId: "masterforged",
            successChance: 15.0 // 15% chance (plus 1% chance per crafting skill level above recipe to craft this)
        },
        prevRarity: {
            rarityId: "improved"
        }
    },

    // Crafting T4 (33.333% of the last + 20/[tier-1]%)
    masterforged: {
        rarityId: "masterforged",
        label: "Masterforged",
        color: "ee6622",
        statBonuses: 55.6,
        nextRarity: {
            rarityId: "ascended",
            successChance: 5.0 // 5% chance (plus 1% chance per crafting skill level above recipe to craft this)
        },
        prevRarity: {
            rarityId: "mastercrafted"
        }
    },

    // Crafting T5 (33.333% of the last + 20/[tier-1]%)
    ascended: {
        rarityId: "ascended",
        label: "Ascended",
        color: "ff2266",
        statBonuses: 79.1,
        nextRarity: {
            rarityId: "ethereal",
            successChance: -5.0 // -5% chance (plus 1% chance per crafting skill level above recipe to craft this)
        },
        prevRarity: {
            rarityId: "masterforged"
        }
    },

    // Crafting T6 (33.333% of the last + 20/[tier-1]%)
    ethereal: {
        rarityId: "ethereal",
        label: "Ethereal",
        color: "FF5599",
        statBonuses: 109.4,
        nextRarity: {
            rarityId: "perfect",
            successChance: -5.0 // -5% chance (plus 1% chance per crafting skill level above recipe to craft this)
        },
        prevRarity: {
            rarityId: "ascended"
        }
    },

    // Crafting T7 (33.333% of the last + 20/[tier-1]%)
    perfect: {
        rarityId: "perfect",
        label: "Perfect",
        color: "FF71aa",
        statBonuses: 149.2,
        prevRarity: {
            rarityId: "ethereal"
        }
    },

    // Looted T1
    uncommon: {
        rarityId: "uncommon",
        label: "",
        color: "",
        statBonuses: 0.0,
        nextRarity: {
            rarityId: "fine",
            successChance: 45.0 // 45% chance (plus 1% chance per crafting skill level above recipe to craft this)
        },
        prevRarity: {
            rarityId: "uncommon"
        }
    },

    // Looted T2 (25% of the last + 25/[tier/2]%)
    fine: {
        rarityId: "fine",
        label: "Fine",
        color: "66aaaa",
        statBonuses: 25.0,
        nextRarity: {
            rarityId: "rare",
            successChance: 30.0 // 30% chance (plus 1% chance per crafting skill level above recipe to craft this)
        },
        prevRarity: {
            rarityId: "uncommon"
        }
    },

    // Looted T3 (25% of the last + 25/[tier/2]%)
    rare: {
        rarityId: "rare",
        label: "Rare",
        color: "3388aa",
        statBonuses: 47.9,
        nextRarity: {
            rarityId: "extraordinary",
            successChance: 15.0 // 1% chance (plus 1% chance per crafting skill level above recipe to craft this)
        },
        prevRarity: {
            rarityId: "fine"
        }
    },

    // Looted T4 (25% of the last + 25/[tier/2]%)
    extraordinary: {
        rarityId: "extraordinary",
        label: "Extraordinary",
        color: "3366aa",
        statBonuses: 72.4,
        nextRarity: {
            rarityId: "phenomenal",
            successChance: 5.0 // 5% chance (plus 1% chance per crafting skill level above recipe to craft this)
        },
        prevRarity: {
            rarityId: "rare"
        }
    },

    // Looted T5 (25% of the last + 25/[tier/2]%)
    phenomenal: {
        rarityId: "phenomenal",
        label: "Phenomenal",
        color: "0055cc",
        statBonuses: 100.5,
        nextRarity: {
            rarityId: "epic",
            successChance: -5.0 // -5% chance (plus 1% chance per crafting skill level above recipe to craft this)
        },
        prevRarity: {
            rarityId: "extraordinary"
        }
    },

    // Looted T6 (25% of the last + 25/[tier/2]%)
    epic: {
        rarityId: "epic",
        label: "Epic",
        color: "0022ee",
        statBonuses: 134.0,
        nextRarity: {
            rarityId: "divine",
            successChance: -10.0 // -10% chance (plus 1% chance per crafting skill level above recipe to craft this)
        },
        prevRarity: {
            rarityId: "phenomenal"
        }
    },

    // Looted T7 (25% of the last + 25/[tier/2]%)
    divine: {
        rarityId: "divine",
        label: "Divine",
        color: "4444ff",
        statBonuses: 174.6,
        nextRarity: {
            rarityId: "incredible",
            successChance: -15.0 // -15% chance (plus 1% chance per crafting skill level above recipe to craft this)
        },
        prevRarity: {
            rarityId: "epic"
        }
    },

    // Looted T8 (25% of the last + 25/[tier/2]%)
    incredible: {
        rarityId: "incredible",
        label: "Incredible",
        color: "6141ff",
        statBonuses: 224.5,
        nextRarity: {
            rarityId: "unparalleled",
            successChance: -15.0 // -15% chance (plus 1% chance per crafting skill level above recipe to craft this)
        },
        prevRarity: {
            rarityId: "divine"
        }
    },

    // Looted T9 (25% of the last + 25/[tier/2]%)
    unparalleled: {
        rarityId: "unparalleled",
        label: "Unparalleled",
        color: "9151ff",
        statBonuses: 286.2,
        prevRarity: {
            rarityId: "incredible"
        }
    },

    // Special (non-tiered): for boss drops
    prized: {
        rarityId: "prized",
        label: "Prized",
        color: "883388",
        statBonuses: 0.0
    },

    // Special (non-tiered): for legendary items
    legendary: {
        rarityId: "legendary",
        label: "Legendary",
        color: "6633ff",
        statBonuses: 0.0
    },

    // Special (non-tiered): for artifact items
    artifact: {
        rarityId: "artifact",
        label: "Artifact",
        color: "44cc44",
        statBonuses: 0.0
    }
};

ET_LayoutTweaksMod_PageScanner_main = function()
{
	
    if (ET_LayoutTweaksMod_resetSpellDisplay)
    {
        ET_LayoutTweaksMod_resetSpellDisplay = false;

        jQ("#LayoutTweaksSpellCasts2").remove();
        jQ("#LayoutTweaksSpellCasts").remove();
        jQ("#LayoutTweaksLobbyEquipment").remove();
    }

    try
    {
        // from any page, if players click a link to the new combat page and that link is called 'adventures', set the combat UI tab state to adventures ('afk')
        jQ("a[href=\"/newCombat\"]").each(function()
        {
            if (jQ(this).attr('MCModified') !== "true")
            {
                if (jQ(this).text().trim().toLowerCase() === "adventures")
                {
                    jQ(this).attr('MCModified', 'true');
                    jQ(this).on('click', function() { ET.MCMF.CallGameCmd("users.setUiState", "newCombatType", "afk"); });
                }
            }
        });

        try
        {
            if (jQ(".lobby-container").find("button.battle-btn").length > 0)
            {
                if (jQ("#LayoutTweaksSpellCasts").length === 0)
                {
                    jQ("div.lobby-units-container").after("<div id=\"LayoutTweaksLobbyEquipment\" class=\"d-flex align-items-center justify-content-center flex-wrap\" style=\"margin-top: 30px;\"></div>");
                    jQ("#LayoutTweaksLobbyEquipment").after("<div id=\"LayoutTweaksSpellCasts\" class=\"d-flex align-items-center justify-content-center flex-wrap\"></div>");
                    jQ("#LayoutTweaksSpellCasts").after("<div id=\"LayoutTweaksSpellCasts2\" class=\"d-flex align-items-center justify-content-center flex-wrap\"></div>");

                    if (jQ(".LTMod-modal").css("display") !== "block")
                    {
                        let sTemp;

                        jQ(".LTModEquipmentModal").remove();

                        sTemp =
                            "<div class=\"modal LTModEquipmentModal\" tabindex=\"-1\" role=\"dialog\" style=\"display: none;\">\r\n" +
                            "   <div class=\"modal-dialog\" role=\"document\">\r\n" +
                            "      <div class=\"modal-content\">\r\n" +
                            "         <div class=\"modal-header\">\r\n" +
                            "            <div class=\"d-flex flex-column\">\r\n" +
                            "               <h5 class=\"modal-title text-capitalize\" id=\"LTModEquipmentModal\">\r\n" +
                            "                  Equipment Select\r\n" +
                            "               </h5>\r\n" +
                            "               <small></small>\r\n" +
                            "            </div>\r\n" +
                            "            <div class=\"d-flex flex-column align-items-end\">\r\n" +
                            "               <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n" +
                            "               <span>×</span>\r\n" +
                            "               </button>\r\n" +
                            "               <small></small>\r\n" +
                            "            </div>\r\n" +
                            "         </div>\r\n" +
                            "         <div class=\"modal-body\">\r\n" +
                            "            <div class=\"d-flex flex-wrap LTModEquipmentContainer\">\r\n" +
                            "               \r\n" +
                            "            </div>\r\n" +
                            "         </div>\r\n" +
                            "      </div>\r\n" +
                            "   </div>\r\n" +
                            "</div>\r\n"

                        jQ("body").append(sTemp);

                        jQ(".LTModEquipmentModal").find("button.close").on('click', function()
                        {
                            ET_LayoutTweaksMod_CloseModals();
                        });

                        jQ(".LTModAbilityModal").remove();

                        sTemp =
                            "<div class=\"modal LTModAbilityModal\" tabindex=\"-1\" role=\"dialog\" style=\"display: none;\">\r\n" +
                            "   <div class=\"modal-dialog\" role=\"document\" style=\"width: 700px; max-width: 700px;\">\r\n" +
                            "      <div class=\"modal-content\" style=\"width: 700px; max-width: 700px;\">\r\n" +
                            "         <div class=\"modal-header\">\r\n" +
                            "            <div class=\"d-flex flex-column\">\r\n" +
                            "               <h5 class=\"modal-title text-capitalize\" id=\"LTModAbilityModal\">\r\n" +
                            "                  Ability Select\r\n" +
                            "               </h5>\r\n" +
                            "               <small></small>\r\n" +
                            "            </div>\r\n" +
                            "            <div class=\"d-flex flex-column align-items-end\">\r\n" +
                            "               <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n" +
                            "               <span>×</span>\r\n" +
                            "               </button>\r\n" +
                            "               <small></small>\r\n" +
                            "            </div>\r\n" +
                            "         </div>\r\n" +
                            "         <div class=\"modal-body\">\r\n" +
                            "            <div class=\"d-flex flex-wrap LTModAbilityContainer\">\r\n" +
                            "               \r\n" +
                            "            </div>\r\n" +
                            "         </div>\r\n" +
                            "      </div>\r\n" +
                            "   </div>\r\n" +
                            "</div>\r\n"

                        jQ("body").append(sTemp);

                        jQ(".LTModAbilityModal").find("button.close").on('click', function()
                        {
                            ET_LayoutTweaksMod_CloseModals();
                        });

                        jQ(".LTModSpellCraftingModal").remove();

                        sTemp =
                            "<div class=\"modal multiCraftModal LTModSpellCraftingModal\" tabindex=\"-1\" role=\"dialog\" style=\"display: none;\">\r\n" +
                            "   <div class=\"modal-dialog\" role=\"document\">\r\n" +
                            "      <div class=\"modal-content\">\r\n" +
                            "         <div class=\"modal-header\">\r\n" +
                            "            <div class=\"d-flex flex-column\">\r\n" +
                            "               <h5 class=\"modal-title text-capitalize\" id=\"LTModSpellCraftingModal\">\r\n" +
                            "                  Craft Spell Casts\r\n" +
                            "               </h5>\r\n" +
                            "               <small></small>\r\n" +
                            "            </div>\r\n" +
                            "            <div class=\"d-flex flex-column align-items-end\">\r\n" +
                            "               <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n" +
                            "               <span>×</span>\r\n" +
                            "               </button>\r\n" +
                            "               <small></small>\r\n" +
                            "            </div>\r\n" +
                            "         </div>\r\n" +
                            "         <form class=\"craft-amount-form\">\r\n" +
                            "            <div class=\"modal-body\">\r\n" +
                            "               How many to craft?<br />\r\n" +
                            "               Max: <span class=\"qty-max\">10000</span>\r\n" +
                            "               <input class=\"form-control craft-amount-input\"><br />\r\n" +
                            "            </div>\r\n" +
                            "            <div class=\"modal-footer\">\r\n" +
                            "               <button type=\"button\" class=\"btn btn-primary craft-btn\" data-amount=\"1\">Craft 1</button>\r\n" +
                            "               <button type=\"button\" class=\"btn btn-secondary craft-btn\" data-amount=\"0\">Craft X (0)</button>\r\n" +
                            "               <button type=\"button\" class=\"btn btn-danger craft-btn\" data-amount=\"0\">Craft All (0)</button>\r\n" +
                            "            </div>\r\n" +
                            "         </form>\r\n" +
                            "      </div>\r\n" +
                            "   </div>\r\n" +
                            "</div>\r\n"

                        jQ("body").append(sTemp);

                        jQ(".LTModSpellCraftingModal").find("button.close").on('click', function()
                        {
                            ET_LayoutTweaksMod_CloseModals();
                        });
                    }

                    let oAbilitySlots = [];
                    let oAbilityTemp;

                    oAbilityTemp = Meteor.connection._stores.abilities._getCollection().find().fetch()[0].learntAbilities.filter(function(oAbility){if (oAbility.equipped && oAbility.slot === "mainHand") return true; return false;})[0];
                    oAbilitySlots = [...oAbilitySlots, IsValid(oAbilityTemp) ? oAbilityTemp : { equipped: false }];
                    oAbilityTemp = Meteor.connection._stores.abilities._getCollection().find().fetch()[0].learntAbilities.filter(function(oAbility){if (oAbility.equipped && oAbility.slot === "offHand") return true; return false;})[0];
                    oAbilitySlots = [...oAbilitySlots, IsValid(oAbilityTemp) ? oAbilityTemp : { equipped: false }];
                    oAbilityTemp = Meteor.connection._stores.abilities._getCollection().find().fetch()[0].learntAbilities.filter(function(oAbility){if (oAbility.equipped && oAbility.slot === "head") return true; return false;})[0];
                    oAbilitySlots = [...oAbilitySlots, IsValid(oAbilityTemp) ? oAbilityTemp : { equipped: false }];
                    oAbilityTemp = Meteor.connection._stores.abilities._getCollection().find().fetch()[0].learntAbilities.filter(function(oAbility){if (oAbility.equipped && oAbility.slot === "chest") return true; return false;})[0];
                    oAbilitySlots = [...oAbilitySlots, IsValid(oAbilityTemp) ? oAbilityTemp : { equipped: false }];
                    oAbilityTemp = Meteor.connection._stores.abilities._getCollection().find().fetch()[0].learntAbilities.filter(function(oAbility){if (oAbility.equipped && oAbility.slot === "legs") return true; return false;})[0];
                    oAbilitySlots = [...oAbilitySlots, IsValid(oAbilityTemp) ? oAbilityTemp : { equipped: false }];

					if (window.ET.MCMF.IsClass())
					{
						oAbilityTemp = Meteor.connection._stores.abilities._getCollection().find().fetch()[0].learntAbilities.filter(function(oAbility){if (oAbility.equipped && oAbility.slot === "classAbil1") return true; return false;})[0];
						oAbilitySlots = [...oAbilitySlots, IsValid(oAbilityTemp) ? oAbilityTemp : { equipped: false }];
						oAbilityTemp = Meteor.connection._stores.abilities._getCollection().find().fetch()[0].learntAbilities.filter(function(oAbility){if (oAbility.equipped && oAbility.slot === "classAbil2") return true; return false;})[0];
						oAbilitySlots = [...oAbilitySlots, IsValid(oAbilityTemp) ? oAbilityTemp : { equipped: false }];
						oAbilityTemp = Meteor.connection._stores.abilities._getCollection().find().fetch()[0].learntAbilities.filter(function(oAbility){if (oAbility.equipped && oAbility.slot === "classAbil3") return true; return false;})[0];
						oAbilitySlots = [...oAbilitySlots, IsValid(oAbilityTemp) ? oAbilityTemp : { equipped: false }];
					}

                    oAbilityTemp = Meteor.connection._stores.abilities._getCollection().find().fetch()[0].learntAbilities.filter(function(oAbility){if (oAbility.equipped && oAbility.slot === "companion") return true; return false;})[0];
                    oAbilitySlots = [...oAbilitySlots, IsValid(oAbilityTemp) ? oAbilityTemp : { equipped: false }];


                    let oEquipMainhand = ET.MCMF.GetItems({category: "combat", equipped: true, slot: "mainHand"})[0];
                    let oEquipOffhand = ET.MCMF.GetItems({category: "combat", equipped: true, slot: "offHand"})[0];

                    let bSpells = false;

                    for (let i = 0; i < (window.ET.MCMF.IsClass() ? 9 : 6); i++)
                    {
                        if (oAbilitySlots[i].equipped)
                        {
                            if (oAbilitySlots[i].isSpell)
                                bSpells = true;

                            let sAbilityFriendlyName = oAbilitySlots[i].name;

                            for (let j = 1; j <= 5; j++)
                            {
                                if (oAbilitySlots[i].isSpell)
                                {
                                    if (sAbilityFriendlyName.indexOf(` (level ${j})`) !== -1)
                                        sAbilityFriendlyName = ChopperBlank(sAbilityFriendlyName, "", ` (level ${j})`).trim();
                                }
                                else
                                    sAbilityFriendlyName = sAbilityFriendlyName.replace(` (level ${j})`, ` L.${j}`);
                            }

                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "defensive_stance")   sAbilityFriendlyName = sAbilityFriendlyName.replace("defensive stance", "def. stance");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "double_edged_sword") sAbilityFriendlyName = sAbilityFriendlyName.replace("doubled edged sword", "double edge");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "elemental_shield")   sAbilityFriendlyName = sAbilityFriendlyName.replace("elemental shield", "ele. shield");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "evasive_maneuvers")  sAbilityFriendlyName = sAbilityFriendlyName.replace("evasive maneuvers", "evasive");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "feeding_frenzy")     sAbilityFriendlyName = sAbilityFriendlyName.replace("feeding frenzy", "feed. frenzy");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "lightning_dart")     sAbilityFriendlyName = sAbilityFriendlyName.replace("lightning dart", "lit. dart");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "penetrating_slash")  sAbilityFriendlyName = sAbilityFriendlyName.replace("penetrating slash", "pen. slash");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "phantom_strikes")    sAbilityFriendlyName = sAbilityFriendlyName.replace("phantom strikes", "phant. strikes");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "volcanic_shield")    sAbilityFriendlyName = sAbilityFriendlyName.replace("volcanic shield", "volc. shield");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "lightning_storm")    sAbilityFriendlyName = sAbilityFriendlyName.replace("lightning storm", "light. storm");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "angels_touch")       sAbilityFriendlyName = sAbilityFriendlyName.replace("angel's touch", "angel touch");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "raise_your_glass")   sAbilityFriendlyName = sAbilityFriendlyName.replace("raise your glass", "raise glass");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "poisoned_blade")     sAbilityFriendlyName = sAbilityFriendlyName.replace("poisoned blade", "pois. blade");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "furied_defense")     sAbilityFriendlyName = sAbilityFriendlyName.replace("furied defense", "furied def.");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "frenzied_winds")     sAbilityFriendlyName = sAbilityFriendlyName.replace("frenzied winds", "frenz. winds");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "healing_shield")     sAbilityFriendlyName = sAbilityFriendlyName.replace("healing shield", "heal. shield");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "mending_spring")     sAbilityFriendlyName = sAbilityFriendlyName.replace("mending spring", "mend. spring");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "year_of_the_pig")    sAbilityFriendlyName = sAbilityFriendlyName.replace("year of the pig", "yr. of the pig");
                            if (ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]) === "skeletal_warrior")   sAbilityFriendlyName = sAbilityFriendlyName.replace("skeletal warrior", "skel. warrior");

                            let sAbilityWarningText = "";

                            if (oAbilitySlots[i].isSpell)
                            {
                                if (CInt(oAbilitySlots[i].casts) <= ((20*60)/CInt(oAbilitySlots[i].cooldown)))
                                    sAbilityWarningText = "<div><span style=\"color: red;\">⚠️ You are low on casts for this spell!</span></div>";
                            }

                            let sAbilityRequiresIcons = "";

                            if (oAbilitySlots[i].isPacifist || (IsValid(oAbilitySlots[i].requires) && (oAbilitySlots[i].requires.length > 0)) || (IsValid(oAbilitySlots[i].cantUseWith) && (oAbilitySlots[i].cantUseWith.length > 0)))
                            {
                                sAbilityRequiresIcons = "<div style=\"position: absolute; left: 2px; top: 0\" class=\"required-weapon\">";

                                if (oAbilitySlots[i].isPacifist) {
                                  sAbilityRequiresIcons += `<img src=\"/icons/pacifist.svg\" style=\"height: 20px; width: 20px;\" />`;
                                }

                                if (IsValid(oAbilitySlots[i].requires))
                                {
                                    jQ.makeArray(oAbilitySlots[i].requires).forEach(function(oThisRequiredThing)
                                    {
                                        if (oThisRequiredThing.type === "weaponType")
                                        {
                                          jQ.makeArray(oThisRequiredThing.weaponTypes).forEach((weaponTypeRequired) => {
                                              sAbilityRequiresIcons += `<img src=\"/icons/${weaponTypeRequired}.svg\" style=\"height: 20px; width: 20px;\" />`;
                                          });

                                          if (oThisRequiredThing.weaponTypes[0] === "shield")
                                          {
                                              if (!IsValid(oEquipOffhand) || (oEquipOffhand.name.indexOf("shield") === -1))
                                                  sAbilityWarningText = "<div><span style=\"color: red;\">🛑 This ability requires a shield!</span></div>";
                                          }
                                          else if (oThisRequiredThing.weaponTypes[0] === "dagger")
                                          {
                                              if (!IsValid(oEquipMainhand) || ((oEquipMainhand.name.indexOf("dagger") === -1) && (oEquipMainhand.name.indexOf("rapier") === -1)))
                                                  sAbilityWarningText = "<div><span style=\"color: red;\">🛑 This ability requires a dagger or rapiers!</span></div>";
                                          }
                                          else if (oThisRequiredThing.weaponTypes[0] === "rapiers")
                                          {
                                              if (!IsValid(oEquipMainhand) || (oEquipMainhand.name.indexOf("rapier") === -1))
                                                  sAbilityWarningText = "<div><span style=\"color: red;\">🛑 This ability requires rapiers!</span></div>";
                                          }
                                          else if ((oThisRequiredThing.weaponTypes[0] === "staff") || (oThisRequiredThing.weaponTypes[0] === "wand"))
                                          {
                                              if (!IsValid(oEquipMainhand) || ((oEquipMainhand.name.indexOf("staff") === -1) && (oEquipMainhand.name.indexOf("wand") === -1) && (oEquipMainhand.name.indexOf("trident") === -1) && (oEquipMainhand.name.indexOf("resonator") === -1)))
                                                  sAbilityWarningText = "<div><span style=\"color: red;\">🛑 This ability requires a magic staff, wand or trident!</span></div>";
                                          }
                                          else if (oThisRequiredThing.weaponTypes[0] === "axe")
                                          {
                                              if (!IsValid(oEquipMainhand) || (oEquipMainhand.name.indexOf("axe") === -1))
                                                  sAbilityWarningText = "<div><span style=\"color: red;\">🛑 This ability requires an axe!</span></div>";
                                          }
                                          else if ((oThisRequiredThing.weaponTypes[0] === "spear") || (oThisRequiredThing.weaponTypes[0] === "hammer"))
                                          {
                                              if (!IsValid(oEquipMainhand) || ((oEquipMainhand.name.indexOf("spear") === -1) && (oEquipMainhand.name.indexOf("hammer") === -1)))
                                                  sAbilityWarningText = "<div><span style=\"color: red;\">🛑 This ability requires a spear or hammer!</span></div>";
                                          }
                                          else if ((oThisRequiredThing.weaponTypes[0] === "bow") || (oThisRequiredThing.weaponTypes[0] === "quiver"))
                                          {
                                              if (!IsValid(oEquipMainhand) || (oEquipMainhand.name.indexOf("bow") === -1) || !IsValid(oEquipOffhand) || (oEquipOffhand.name.indexOf("quiver") === -1))
                                                  sAbilityWarningText = "<div><span style=\"color: red;\">🛑 This ability requires a bow and quiver!</span></div>";
                                          }
                                        }
                                    });
                                }

                                if (IsValid(oAbilitySlots[i].cantUseWith))
                                {
                                    jQ.makeArray(oAbilitySlots[i].cantUseWith).forEach(function(oThisForbiddenThing)
                                    {
                                        if (oThisForbiddenThing.type === "weaponType")
                                        {
                                          jQ.makeArray(oThisForbiddenThing.weaponTypes).forEach((weaponTypeForbidden) => {
                                              sAbilityRequiresIcons += `<img src="/icons/forbidden.svg" style="height: 20px; width: 20px; background: url(/icons/${weaponTypeForbidden}.svg) center center;">`;
                                          });

                                          if (oThisForbiddenThing.weaponTypes[0] === "bow")
                                          {
                                              if (IsValid(oEquipMainhand) && (oEquipMainhand.name.indexOf("bow") !== -1))
                                                  sAbilityWarningText = "<div><span style=\"color: red;\">🛑 This ability forbids a bow!</span></div>";
                                          }
                                        }
                                    });
                                }

                                sAbilityRequiresIcons += "</div>";
                            }

                            let sAbilityKindStyle = (CInt(oAbilitySlots[i].cooldown) === 0) ? "background-color: #f2ffe5;" : "";
                            try { sAbilityKindStyle = (oAbilitySlots[i].isSpell && ( IsValid(oAbilitySlots[i].requires)) && (oAbilitySlots[i].requires.length  >  0)) ? "background-color: #eeddff;" : sAbilityKindStyle; } catch (err) { }
                            try { sAbilityKindStyle = (oAbilitySlots[i].isSpell && (!IsValid(oAbilitySlots[i].requires)) || (oAbilitySlots[i].requires.length === 0)) ? "background-color: #e3f0ff;" : sAbilityKindStyle; } catch (err) { }

                            let sAbilityWarningStyle = (sAbilityWarningText.length > 0) ? "background-color: #ffccc4; border-color: #833;" : "";
                            let sCurrentCooldownStyle = (CDbl(oAbilitySlots[i].currentCooldown) > 0.0) ? "background-color: #999; border-color: #000;" : "";
                            let sCurrentCooldownText = (CDbl(oAbilitySlots[i].currentCooldown) > 0.0) ? `<div class=\"cooldown-text\">${Math.ceil(CDbl(oAbilitySlots[i].currentCooldown)).toFixed(0)}</div>` : "";

                            if (oAbilitySlots[i].isSpell)
                            {
                                jQ("#LayoutTweaksSpellCasts").append
                                (
                                    "<div class=\"item-icon-container item icon-box LayoutTweaksSpellCastsClick" + i.toFixed(0) + "\" style=\"position: relative;" + sAbilityKindStyle + sAbilityWarningStyle + sCurrentCooldownStyle+ "\">" +
                                    "    " + sCurrentCooldownText +
                                    "    <div class=\"item-amount text-capitalize\" style=\"position: absolute; bottom: 0px; right: 3px; font-size: 10px; text-align: center; width: 88px; max-width: 88px; text-overflow: hidden; display: inline-block; white-space: nowrap; overflow: hidden;\">" +
                                    "        " + sAbilityFriendlyName +
                                    "    </div>" +
                                    "    <div class=\"item-quality\">" +
                                    "        <i class=\"lilIcon-magic\"></i> " + oAbilitySlots[i].casts.toLocaleString() +
                                    "    </div>" +
                                    "    <img src=\"/icons/" + oAbilitySlots[i].icon + "\" class=\"item-icon\" />" +
                                    "    " + sAbilityRequiresIcons +
                                    "</div>"
                                );
                            }
                            else
                            {
                                jQ("#LayoutTweaksSpellCasts").append
                                (
                                    "<div class=\"item-icon-container item icon-box LayoutTweaksSpellCastsClick" + i.toFixed(0) + "\" style=\"position: relative;" + sAbilityKindStyle + sAbilityWarningStyle + sCurrentCooldownStyle + "\">" +
                                    "    " + sCurrentCooldownText +
                                    "    <div class=\"item-amount text-capitalize\" style=\"position: absolute; bottom: 0px; right: 3px; font-size: 10px; text-align: center; width: 88px; max-width: 88px; text-overflow: hidden; display: inline-block; white-space: nowrap; overflow: hidden;\">" +
                                    "        " + sAbilityFriendlyName +
                                    "    </div>" +
                                    "    " + sAbilityRequiresIcons +
                                    "    <img src=\"/icons/" + oAbilitySlots[i].icon + "\" class=\"item-icon\" />" +
                                    "</div>"
                                );
                            }

                            oEl = jQ(`.LayoutTweaksSpellCastsClick${i}`);

                            let sTooltipName = `LayoutTweaksTooltip-${ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i])}`;

                            if ((!oEl._tippy) && (jQ(`#${sTooltipName}`).length === 0))
                            {
                                jQ(`#tooltip-${sTooltipName}`).remove();
                                jQ("body").append(`<div class=\"item-tooltip-content my-tooltip-inner\" id=\"tooltip-${sTooltipName}\"></div>`);

                                jQ(`#tooltip-${sTooltipName}`).html
                                (
                                    "    <h3 class=\"popover-title text-capitalize\">" +
                                    "        " + oAbilitySlots[i].name + "<br />" +
                                    "    </h3>" +
                                    "    <div class=\"popover-content\" style=\"max-width: 400px;\">" +
                                    "        <div>" + oAbilitySlots[i].description + "</div>" +
                                    "        " + ((CInt(oAbilitySlots[i].cooldown) > 0) ? `<div>Cooldown <b>${oAbilitySlots[i].cooldown.toFixed(0).toFriendlyTime()}</b></div>` : "") +
                                    "        " + ((CInt(oAbilitySlots[i].casts) > 0) ? `<div><b>${CInt(oAbilitySlots[i].casts).toLocaleString()}</b> casts remaining.</div>` : "") +
                                    "        " + sAbilityWarningText +
                                    "        <div><b>Left Click</b> to go to ability loadout</div>" +
                                    "    </div>"
                                );

                                tippy(`.LayoutTweaksSpellCastsClick${i}`,
                                {
                                    html: jQ(`#tooltip-${sTooltipName}`)[0],
                                    performance: !0,
                                    animateFill: !1,
                                    distance: 5
                                });
                            }
                        }
                        else
                        {
                            jQ("#LayoutTweaksSpellCasts").append
                            (
                                "<div class=\"item-icon-container item icon-box LayoutTweaksSpellCastsClick" + i.toFixed(0) + "\" style=\"position: relative\">" +
                                "    [ Empty ]" +
                                "</div>"
                            );
                        }
                    }

                    for (let i = 0; i < (window.ET.MCMF.IsClass() ? 9 : 6); i++)
                    {
                        if (oAbilitySlots[i].equipped && oAbilitySlots[i].isSpell)
							jQ("#LayoutTweaksSpellCasts2").append("<button class=\"btn-sm d-flex justify-content-center LayoutTweaksSpellCastsCraft" + i.toFixed(0) + "\" style=\"width: 96px; margin: 4px;\">Craft Casts</button>");
                        else
							jQ("#LayoutTweaksSpellCasts2").append("<div class=\"d-flex\" style=\"width: 96px; margin: 4px;\"></div>");
                    }

                    if (!bSpells)
                        jQ("#LayoutTweaksSpellCasts2").remove();

                    for (let i = 0; i < (window.ET.MCMF.IsClass() ? 9 : 6); i++)
                    {
                        jQ(".LayoutTweaksSpellCastsClick" + i.toFixed(0)).css("cursor", "pointer").on('click', function()
                        {
                            //setTimeout(function() { ET_LayoutTweaksMod_HackyClicker("button.loadout-btn"); setTimeout(function() { ET_LayoutTweaksMod_HackyClicker("a.edit-abilities-btn"); try { tippy.hideAllPoppers(); } catch (err) { } }, 100); }, 10);

                            if (i === 0) ET_LayoutTweaksMod_AbilityModalList('mainHand', !oAbilitySlots[i].equipped);
                            if (i === 1) ET_LayoutTweaksMod_AbilityModalList('offHand', !oAbilitySlots[i].equipped);
                            if (i === 2) ET_LayoutTweaksMod_AbilityModalList('head', !oAbilitySlots[i].equipped);
                            if (i === 3) ET_LayoutTweaksMod_AbilityModalList('chest', !oAbilitySlots[i].equipped);
                            if (i === 4) ET_LayoutTweaksMod_AbilityModalList('legs', !oAbilitySlots[i].equipped);
                            if (i === 5) ET_LayoutTweaksMod_AbilityModalList('classAbil1', !oAbilitySlots[i].equipped);
                            if (i === 6) ET_LayoutTweaksMod_AbilityModalList('classAbil2', !oAbilitySlots[i].equipped);
                            if (i === 7) ET_LayoutTweaksMod_AbilityModalList('classAbil3', !oAbilitySlots[i].equipped);
                            if (i === (window.ET.MCMF.IsClass() ? 8 : 5)) ET_LayoutTweaksMod_AbilityModalList('companion', !oAbilitySlots[i].equipped);
                        });

                        if (oAbilitySlots[i].equipped && oAbilitySlots[i].isSpell)
                        {
                            jQ(".LayoutTweaksSpellCastsCraft" + i.toFixed(0)).on('click', function()
                            {
                                ET_LayoutTweaksMod_CraftSpellCast(ET_LayoutTweaksMod_AbilityID(oAbilitySlots[i]));

                                //ET.MCMF.CallGameCmd("users.setUiState", "magicTab", "spellBook");
                                //setTimeout(function() { ET_LayoutTweaksMod_HackyClicker("a[href=\"/magic\"]"); }, 10);
                            });
                        }
                    }

                    let oEquipSlots = [];
                    let oEquipTemp;

                    oEquipTemp = ET.MCMF.GetItems({category: "combat", equipped: true, slot: "mainHand"})[0];
                    oEquipSlots = [...oEquipSlots, IsValid(oEquipTemp) ? oEquipTemp : { equipped: false }];
                    oEquipTemp = ET.MCMF.GetItems({category: "combat", equipped: true, slot: "offHand"})[0];
                    oEquipSlots = [...oEquipSlots, IsValid(oEquipTemp) ? oEquipTemp : { equipped: false }];
                    oEquipTemp = ET.MCMF.GetItems({category: "combat", equipped: true, slot: "neck"})[0];
                    oEquipSlots = [...oEquipSlots, IsValid(oEquipTemp) ? oEquipTemp : { equipped: false }];
                    oEquipTemp = ET.MCMF.GetItems({category: "combat", equipped: true, slot: "head"})[0];
                    oEquipSlots = [...oEquipSlots, IsValid(oEquipTemp) ? oEquipTemp : { equipped: false }];
                    oEquipTemp = ET.MCMF.GetItems({category: "combat", equipped: true, slot: "chest"})[0];
                    oEquipSlots = [...oEquipSlots, IsValid(oEquipTemp) ? oEquipTemp : { equipped: false }];
                    oEquipTemp = ET.MCMF.GetItems({category: "combat", equipped: true, slot: "legs"})[0];
                    oEquipSlots = [...oEquipSlots, IsValid(oEquipTemp) ? oEquipTemp : { equipped: false }];

                    for (let i = 0; i < 6; i++)
                    {
                        if (oEquipSlots[i].equipped)
                        {
							const rarityBorderStyle = ET_LayoutTweaksMod_RarityBorder(oEquipSlots[i].rarityId)
							let rarityBorderCSS = ""
							
							if (rarityBorderStyle && rarityBorderStyle.trim().length > 0)
								rarityBorderCSS = "border: " + rarityBorderStyle + ";";
							
                            jQ("#LayoutTweaksLobbyEquipment").append
                            (
                                "<div class=\"item-icon-container item icon-box LayoutTweaksLobbyEquipmentClick" + i.toFixed(0) + "\" style=\"position: relative; " + rarityBorderCSS + "\">" +
                                    "    <div class=\"item-amount text-capitalize\" style=\"position: absolute; bottom: 0px; right: 3px; font-size: 10px; text-align: center; width: 88px; max-width: 88px; text-overflow: hidden; display: inline-block; white-space: nowrap; overflow: hidden;\">" +
                                    "        " + oEquipSlots[i].name +
                                    "    </div>" +
                                    "    <div class=\"item-quality\">" +
                                    "        " + ((CDbl(oEquipSlots[i].quality) > 0.0) ? `${oEquipSlots[i].quality.toFixed(0)}%` : "") +
                                    "    </div>" +
                                    "    <img src=\"/icons/" + oEquipSlots[i].icon + "\" class=\"item-icon\" />" +
                                "</div>"
                            );
                        }
                        else
                        {
                            jQ("#LayoutTweaksLobbyEquipment").append
                            (
                                "<div class=\"item-icon-container item icon-box LayoutTweaksLobbyEquipmentClick" + i.toFixed(0) + "\" style=\"position: relative\">" +
                                "    [ Empty ]" +
                                "</div>"
                            );
                        }
                    }

                    for (let i = 0; i < 6; i++)
                    {
                        if (oEquipSlots[i].equipped)
                        {
							//console.log(oEquipSlots[i])
							
                            jQ(`.LayoutTweaksLobbyEquipmentClick${i}`).css("cursor", "pointer").on('click', function()
                            {
                                //setTimeout(function() { ET_LayoutTweaksMod_HackyClicker("button.loadout-btn"); setTimeout(function() { ET_LayoutTweaksMod_HackyClicker("a.edit-gear-btn"); try { tippy.hideAllPoppers(); } catch (err) { } }, 100); }, 10);

                                if (oEquipSlots[i].slot === "mainHand") ET_LayoutTweaksMod_EquipmentModalList(oEquipSlots[i].slot, "primary weapon");
                                if (oEquipSlots[i].slot === "offHand") ET_LayoutTweaksMod_EquipmentModalList(oEquipSlots[i].slot, "off-hand weapon or shield");
                                if (oEquipSlots[i].slot === "head") ET_LayoutTweaksMod_EquipmentModalList(oEquipSlots[i].slot, "helm or hat");
                                if (oEquipSlots[i].slot === "neck") ET_LayoutTweaksMod_EquipmentModalList(oEquipSlots[i].slot, "amulet");
                                if (oEquipSlots[i].slot === "chest") ET_LayoutTweaksMod_EquipmentModalList(oEquipSlots[i].slot, "chest armor or shirt");
                                if (oEquipSlots[i].slot === "legs") ET_LayoutTweaksMod_EquipmentModalList(oEquipSlots[i].slot, "leg armor or shorts");
                            });

                            oEl = jQ(`.LayoutTweaksLobbyEquipmentClick${i}`);

                            let sTooltipName = `LayoutTweaksTooltip-${oEquipSlots[i].ItemId}`;

                            if ((!oEl._tippy) && (jQ(`#${sTooltipName}`).length === 0))
                            {
                                jQ(`#tooltip-${sTooltipName}`).remove();
                                jQ("body").append(`<div class=\"item-tooltip-content my-tooltip-inner\" id=\"tooltip-${sTooltipName}\"></div>`);

                                let sStatLines = "";
                                let sExtraText = "";

                                if (IsValid(oEquipSlots[i].stats))
                                {
									let localStatsObj = Object.assign({}, oEquipSlots[i].stats)
									
									try {
										const rarityIdConsts = ET_LayoutsMod__ITEM_RARITIES[oEquipSlots[i].rarityId]
										if (rarityIdConsts && rarityIdConsts.statBonuses) {
											Object.keys(localStatsObj).forEach((statName) => {
											// disallow % bonuses to attack speed
											if (statName !== "attackSpeed") {
												// ensure that property refers to a stat that is a number and valued more than 0 (non-numeric/non-positive/non-zero all disallowed)
												if (CDbl(localStatsObj[statName]) > 0.0) {
													localStatsObj[statName] = localStatsObj[statName] * ((100.0 + rarityIdConsts.statBonuses) / 100.0)
													}
												}
											})

										}
									} catch (err) {}
									
									const rarityColorStyle = ET_LayoutTweaksMod_RarityColor(oEquipSlots[i].rarityId)
									if (rarityColorStyle && rarityColorStyle.trim().length > 0) {
										sStatLines = `${sStatLines}<span style="color: ${rarityColorStyle}; text-transform: capitalize;"><b>${oEquipSlots[i].rarityId}</b></span> <br />`;
									}
					
                                    if (IsValid(localStatsObj.damage) && (CDbl(localStatsObj.damage) != 0.0))
                                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-damage extra-small-icon mr-1\"></i>${localStatsObj.damage.toFixed(1)}</div>`;
                                    if (IsValid(localStatsObj.energyStorage) && (CDbl(localStatsObj.energyStorage) != 0.0))
                                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-energyStorage extra-small-icon mr-1\"></i>${localStatsObj.energyStorage.toFixed(1)} energy storage</div>`;

                                    if (IsValid(localStatsObj.attack) && (CDbl(localStatsObj.attack) != 0.0)) {
                                      if (IsValid(localStatsObj.attackMax) && (CDbl(localStatsObj.attackMax) != 0.0)) {
                                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-attack extra-small-icon mr-1\"></i>${localStatsObj.attack.toFixed(1)} - ${localStatsObj.attackMax.toFixed(1)} damage</div>`;
                                      } else {
                                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-attack extra-small-icon mr-1\"></i>${localStatsObj.attack.toFixed(1)} damage</div>`;
                                      }
                                    }
                                    if (IsValid(localStatsObj.attackSpeed) && (CDbl(localStatsObj.attackSpeed) != 0.0))
                                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-attackSpeed extra-small-icon mr-1\"></i>${localStatsObj.attackSpeed.toFixed(1)} attack speed</div>`;
                                    if (IsValid(localStatsObj.healthMax) && (CDbl(localStatsObj.healthMax) != 0.0))
                                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-healthMax extra-small-icon mr-1\"></i>${localStatsObj.healthMax.toFixed(1)} health</div>`;
                                    if (IsValid(localStatsObj.accuracy) && (CDbl(localStatsObj.accuracy) != 0.0))
                                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-accuracy extra-small-icon mr-1\"></i>${localStatsObj.accuracy.toFixed(1)} accuracy</div>`;
                                    if (IsValid(localStatsObj.magicPower) && (CDbl(localStatsObj.magicPower) != 0.0))
                                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-magicPower extra-small-icon mr-1\"></i>${localStatsObj.magicPower.toFixed(1)} magic power</div>`;
                                    if (IsValid(localStatsObj.magicArmor) && (CDbl(localStatsObj.magicArmor) != 0.0))
                                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-magicArmor extra-small-icon mr-1\"></i>${localStatsObj.magicArmor.toFixed(1)} magic armor</div>`;
                                    if (IsValid(localStatsObj.healingPower) && (CDbl(localStatsObj.healingPower) != 0.0))
                                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-healingPower extra-small-icon mr-1\"></i>${localStatsObj.healingPower.toFixed(1)} healing power</div>`;
                                    if (IsValid(localStatsObj.defense) && (CDbl(localStatsObj.defense) != 0.0))
                                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-defense extra-small-icon mr-1\"></i>${localStatsObj.defense.toFixed(1)} defense</div>`;
                                    if (IsValid(localStatsObj.armor) && (CDbl(localStatsObj.armor) != 0.0))
                                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-armor extra-small-icon mr-1\"></i>${localStatsObj.armor.toFixed(1)} armor</div>`;

                                    if (IsValid(localStatsObj.energyRegen) && (CDbl(localStatsObj.energyRegen) != 0.0))
                                        sStatLines = `${sStatLines}<div class=\"d-flex align-items-center\"><i class=\"lilIcon-energyRegen extra-small-icon mr-1\"></i>${localStatsObj.energyRegen.toFixed(1)} energy regen</div>`;
                                }

                                jQ.makeArray(oEquipSlots[i].enchantments).forEach(function(oThisEnchant)
                                {
                                    sExtraText = `${sExtraText}<div style="text-capitalize">Enchantment: ${oThisEnchant}</div>`;
                                });

                                jQ(`#tooltip-${sTooltipName}`).html
                                (
                                    "    <h3 class=\"popover-title text-capitalize\">" +
                                    "        " + oEquipSlots[i].name + ((oEquipSlots[i].enhanced) ? " (E)" : "") + ((oEquipSlots[i]?.extraStats?.level > 0) ? " (Lv." + oEquipSlots[i]?.extraStats?.level.toFixed(0) + ")" : "") + "<br />" +
                                    "    </h3>" +
                                    "    <div class=\"popover-content\" style=\"max-width: 400px;\">" +
                                    "        " + sStatLines +
                                    "        " + sExtraText +
                                    "        <div><b>Left Click</b> to go to equipment loadout</div>" +
                                    "    </div>"
                                );

                                tippy(`.LayoutTweaksLobbyEquipmentClick${i}`,
                                {
                                    html: jQ(`#tooltip-${sTooltipName}`)[0],
                                    performance: !0,
                                    animateFill: !1,
                                    distance: 5
                                });
                            }
                        }
                        else
                        {
                            jQ(`.LayoutTweaksLobbyEquipmentClick${i}`).css("cursor", "pointer").on('click', function()
                            {
                                if (i === 0) ET_LayoutTweaksMod_EquipmentModalList("mainHand", "primary weapon");
                                if (i === 1) ET_LayoutTweaksMod_EquipmentModalList("offHand", "off-hand weapon or shield");
                                if (i === 2) ET_LayoutTweaksMod_EquipmentModalList("neck", "amulet");
                                if (i === 3) ET_LayoutTweaksMod_EquipmentModalList("head", "helm or hat");
                                if (i === 4) ET_LayoutTweaksMod_EquipmentModalList("chest", "chest armor or shirt");
                                if (i === 5) ET_LayoutTweaksMod_EquipmentModalList("legs", "leg armor or shorts");
                            })
                        }
                    }

                    jQ("#LayoutTweaksSpellCasts").find("div.item-icon-container").hover
                    (
                        function() { jQ(this).css("border-width", "3px"); },
                        function() { jQ(this).css("border-width",    ""); }
                    );

                    jQ("#LayoutTweaksLobbyEquipment").find("div.item-icon-container").hover
                    (
                        function() { jQ(this).css("border-width", "3px"); },
                        function() { jQ(this).css("border-width",    ""); }
                    );
                }
            }
            else
            {
                jQ("#LayoutTweaksSpellCasts2").remove();
                jQ("#LayoutTweaksSpellCasts").remove();
                jQ("#LayoutTweaksLobbyEquipment").remove();
            }
        }
        catch (err) { console.log(err); }

        // fix ET bug not showing any tooltip info for woodcutters
        /*
        if (ET.MCMF.GetActiveTab() === "woodcutting")
        {
            try
            {
                let oWoodcutters = Meteor.connection._stores.woodcutting._getCollection().find({owner: Meteor.connection.userId()}).fetch()[0].woodcutters;
                let bPersonalWoodcuttingBuff = ET.MCMF.PersonalWoodcuttingBuff().active;

                let idx = -1;

                jQ("div.item-icon-container").each(function()
                {
                    if (!jQ(this).hasClass("small"))
                    {
                        idx++;
                        let oThis = jQ(this);

                        if (!oThis.hasClass("LayoutModWoodcutterFix"))
                        {
                            console.debug(jQ(this));
                            console.debug(oWoodcutters[idx]);

                            try
                            {
                                let sAccBonus = "";

                                if (bPersonalWoodcuttingBuff)
                                    sAccBonus = " +&nbsp;<span style=\"color: blue;\">" + (Math.round(oWoodcutters[idx].stats.accuracy * 2) / 10.0) + "</span>&nbsp;";

                                if (IsValid(oThis[0]._tippy))
                                    oThis[0]._tippy.destroy();

                                oThis.addClass("LayoutModWoodcutterFix").addClass("LayoutModWoodcutterIndex" + idx.toFixed(0))

                                jQ("body").append("<div class=\"item-tooltip-content my-tooltip-inner\" id=\"tooltip-LayoutTweaksModTooltip" + idx.toFixed(0) + "\"></div>");

                                jQ("#tooltip-LayoutTweaksModTooltip" + idx.toFixed(0)).html(
                                    "    <h3 class=\"popover-title text-capitalize\">" +
                                    "        <b>" + oWoodcutters[idx].name + "</b>" +
                                    "    </h3>" +
                                    "    <div class=\"popover-content\" style=\"max-width: 400px;\">" +
                                    `        <div class=\"d-flex align-items-center\"><i class=\"lilIcon-attack extra-small-icon mr-1\"></i>${oWoodcutters[idx].stats.attack.toFixed(0)}</div>` +
                                    `        <div class=\"d-flex align-items-center\"><i class=\"lilIcon-attackSpeed extra-small-icon mr-1\"></i>${oWoodcutters[idx].stats.attackSpeed}</div>` +
                                    `        <div class=\"d-flex align-items-center\"><i class=\"lilIcon-accuracy extra-small-icon mr-1\"></i>${oWoodcutters[idx].stats.accuracy}${sAccBonus}</div>` +
                                    `        <br />` +
                                    `        <b>Left Click</b>&nbsp;to activate Suicidal Fury<br />` +
                                    "    </div>"
                                );

                                tippy(".LayoutModWoodcutterIndex" + idx.toFixed(0), {
                                    html: jQ("#tooltip-LayoutTweaksModTooltip" + idx.toFixed(0))[0],
                                    performance: !0,
                                    animateFill: !1,
                                    distance: 5,
                                });

                                //oThis._tippy.popper.querySelector('.popover-content').innerHTML = sToolTipInfo;
                            }
                            catch (err) {
                            }
                        }
                    }
                });
            }
            catch (err) { }
        }
        */

        // resort skills like they are under profile.. ciepun's request.. because reasons
        if (ET.MCMF.GetActiveTab() === "skills")
        {
            try
            {
                let oSkillDivs = jQ("div.player-skills-container").find("div.my-1");

                if (!jQ(oSkillDivs.get(0)).hasClass("lilIcon-attack"))
                {
                    oSkillDivs.sort(function(divA, divB)
                    {
                        let oIconDataA = jQ(divA).find("i");
                        let oIconDataB = jQ(divB).find("i");

                        if (oIconDataA.hasClass("lilIcon-attack")) return -1;
                        if (oIconDataB.hasClass("lilIcon-attack")) return 1;

                        if (oIconDataA.hasClass("lilIcon-defense")) return -1;
                        if (oIconDataB.hasClass("lilIcon-defense")) return 1;

                        if (oIconDataA.hasClass("lilIcon-health")) return -1;
                        if (oIconDataB.hasClass("lilIcon-health")) return 1;

                        if (oIconDataA.hasClass("lilIcon-magic")) return -1;
                        if (oIconDataB.hasClass("lilIcon-magic")) return 1;

                        if (oIconDataA.hasClass("lilIcon-mining")) return -1;
                        if (oIconDataB.hasClass("lilIcon-mining")) return 1;

                        if (oIconDataA.hasClass("lilIcon-farming")) return -1;
                        if (oIconDataB.hasClass("lilIcon-farming")) return 1;

                        if (oIconDataA.hasClass("lilIcon-inscription")) return -1;
                        if (oIconDataB.hasClass("lilIcon-inscription")) return 1;

                        if (oIconDataA.hasClass("lilIcon-crafting")) return -1;
                        if (oIconDataB.hasClass("lilIcon-crafting")) return 1;

                        if (oIconDataA.hasClass("lilIcon-woodcutting")) return -1;
                        if (oIconDataB.hasClass("lilIcon-woodcutting")) return 1;

                        if (oIconDataA.hasClass("lilIcon-astronomy")) return -1;
                        if (oIconDataB.hasClass("lilIcon-astronomy")) return 1;

                        // total is always last

                        return 0;
                    });

                    oSkillDivs.detach().appendTo(jQ("div.player-skills-container"));
                }
            }
            catch (err) { }
        }

        if (ET.MCMF.GetActiveTab() === "home")
        {
            try
            {
                // remove the superfluous 'Link' text for side links
                //jQ("div.body-content#content").find("div.mr-3.hidden-md-down").find("div.text-muted.mb-1").remove();

                // remove the Shop link -- we don't need it here, too
                //jQ("div.body-content#content").find("div.mr-3.hidden-md-down").find("a[href=\"/shop\"]").remove();

                // remove the Skills link -- we don't need it here, too
                //jQ("div.body-content#content").find("div.mr-3.hidden-md-down").find("a[href=\"/skills\"]").remove();

                // fix the 'New Things' color -- it doesn't need to be red here
                //jQ("div.body-content#content").find("div.mr-3.hidden-md-down").find("a[href=\"/updates\"]").removeClass('new-update-color');

                // progress bars under farm plots aren't visible because of a height issue
                //jQ(".home-page-content").find("div.farm-space-container").find("div.icon-box").css("height", "66px");

                // adventures
                /*jQ(".home-page-content").find("div.adventure-item-container").each(function()
                {
                    let sAdvID = jQ(this).find("button.cancel-adventure-btn").attr("data-id");
                    let oAdventure = Meteor.connection._stores.adventures._getCollection().find().fetch()[0].adventures.filter(function(oThisAdventure)
                    {
                        if (oThisAdventure.id !== sAdvID) return false;
                        return true;
                    })[0];

                    if (oAdventure.endDate !== undefined)
                    {
                        if (oAdventure.startDate < new Date())
                        {
                            let iTimeLeftOnAdv = CInt(Math.floor(Math.abs(new Date(oAdventure.endDate) - (new Date())) / 1000.0));
                            let sProg = Math.floor(100 - (iTimeLeftOnAdv * 100 / oAdventure.duration)).toFixed(0);

                            jQ(jQ(this).find("div.mx-3.flex-grow").find("div").get(1)).html(iTimeLeftOnAdv.toString().toHHMMSS());
                            jQ(this).find("div.mx-3.align-items-center").html("<div style=\"width: 100%;\"><div class=\"progress\"><div class=\"progress-bar\" role=\"progressbar\" style=\"width: " + sProg + "%\" aria-valuenow=\"" + sProg + "\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div></div></div>");
                        }
                        else
                            jQ(jQ(this).find("div.mx-3.flex-grow").find("div").get(1)).html(oAdventure.duration.toString().toHHMMSS());
                    }
                    else
                        jQ(jQ(this).find("div.mx-3.flex-grow").find("div").get(1)).html(oAdventure.duration.toString().toHHMMSS());
                });
                */

                /*
                jQ(".home-page-content").find("button.cancel-adventure-btn").each(function()
                {
                    let oEl = jQ(this);

                    if (oEl.attr("ModifiedByLayoutTweaks") !== "true")
                        oEl.attr("ModifiedByLayoutTweaks", "true").on('click', function() { ET.MCMF.CallGameCmd("adventures.cancelAdventure", oEl.attr("data-id")); });
                });
                */
            }
            catch (err) { ET.MCMF.Log("Error on home page!"); ET.MCMF.Log(err); }
        }

        if (ET.MCMF.IsNewCombatTab())
        {
            //jQ("div.lobby-container").find("button.btn.btn-danger.battle-boss-btn").remove();

            if (!ET_LayoutTweaksMod_CombatLobby_page_rendered)
                ET_LayoutTweaksMod_DisableLobbyButtons();
        }

        if (ET.MCMF.IsNewCombatTab())
        {
/*
            try
            {
                let oConsumables = ET.MCMF.GetItems({category: "food"});

                oConsumables = oConsumables.filter(function(oItem)
                {
                    if (oItem.hidden) return false; // don't show consumable items the player's hidden
                    return true;
                });

                if ((oConsumables.length > 0) && ((ET_LayoutTweaksMod_IsEatingAnything()) || (jQ(".MCFoodList").length !== oConsumables.length)))
                {
                    if ((jQ("a.consumables-btn").length > 0) && (jQ("a.consumables-btn").parent().parent().find("div.item-icon-container").length > 0))
                    {
                        let iCountExistingFoodBoxes = jQ("a.consumables-btn").parent().parent().find("div.item-icon-container").length;

                        // add marker
                        jQ(jQ("a.consumables-btn").parent().parent().find("div.item-icon-container").get(iCountExistingFoodBoxes - 1)).after("<div class=\"MCFoodList-temp\" style=\"position: relative\" ></div>");

                        // remove existing consumable boxes (except items being consumed)
                        jQ("a.consumables-btn").parent().parent().find("div.item-icon-container").each(function()
                        {
                            if (!(jQ(this).hasClass("food-icon-container") && jQ(this).hasClass("disabled")))
                                jQ(this).remove();
                        });

                        // add new consumable boxes
                        try
                        {
                            oConsumables.forEach(function(oThisItem)
                            {
                                try
                                {
                                    let sDivFinder = "div[data-id=\"" + oThisItem._id.toString() + "\"]";
                                    let bIsDisplayed = jQ(sDivFinder).length > 0;
                                    let bEatingThis = ET_LayoutTweaksMod_IsEatingThis(oThisItem.itemId);

                                    if (bIsDisplayed && bEatingThis)
                                    {
                                        if (jQ(sDivFinder)._tippy)
                                            jQ(sDivFinder)._tippy.destroy();
                                        jQ("#MCLTConsumable-" + oThisItem._id.toString()).remove();
                                        jQ(sDivFinder).remove();
                                    }
                                    else if (!bIsDisplayed && !bEatingThis)
                                    {
                                        jQ(jQ("a.consumables-btn").parent().parent().find(".MCFoodList-temp").get(0)).before
                                        (
                                            "<div class=\"MCFoodList item-icon-container item small icon-box\" style=\"position: relative\" data-id=\"" + oThisItem._id.toString() + "\">" +
                                            "<img src=\"/icons/" + oThisItem.icon.toString() + "\" class=\"item-icon\" />" +
                                            "<div class=\"item-amount\">" + oThisItem.amount.toLocaleString() + "</div>" +
                                            "</div>"
                                        );
                                    }

                                    // note: unfortunately, the game is messing with the HTML this section every few ticks when digesting a consumable
                                    //       this means that we will have flickering tooltips for our own DIVs and there's probably not much that can be done about it
                                }
                                catch (err) { }
                            });
                        }
                        catch (err) { }

                        // remove marker
                        jQ(".MCFoodList-temp").remove();

                        // add tooltips and on-click event trigger to consumable boxes
                        jQ("a.consumables-btn").parent().parent().find("div.item-icon-container").each(function()
                        {
                            let oEl = jQ(this);

                            try
                            {
                                let oThisConsumable = ET.MCMF.GetItems({_id: oEl.attr("data-id")})[0];

                                let sTooltipName = "MCLTConsumable-" + oThisConsumable._id.toString();

                                if ((!oEl._tippy) && (jQ("#" + sTooltipName).length === 0))
                                {
                                    jQ("#tooltip-" + sTooltipName).remove();
                                    jQ("body").append("<div class=\"item-tooltip-content my-tooltip-inner\" id=\"tooltip-" + sTooltipName + "\"></div>");

                                    jQ("#tooltip-" + sTooltipName).html
                                    (
                                        "    <h3 class=\"popover-title text-capitalize\">" +
                                        "        " + oThisConsumable.name + "<br />" +
                                        "    </h3>" +
                                        "    <div class=\"popover-content\" style=\"max-width: 400px;\">" +
                                        "        " + oThisConsumable.description + "<br />" +
                                        "        <b>Left Click</b> to eat<br />" +
                                        "    </div>"
                                    );

                                    tippy("div[data-id=\"" + oThisConsumable._id.toString() + "\"]",
                                    {
                                        html: jQ("#tooltip-" + sTooltipName)[0],
                                        performance: !0,
                                        animateFill: !1,
                                        distance: 5
                                    });

                                    jQ("div[data-id=\"" + oThisConsumable._id.toString() + "\"]").on('click', function()
                                    {
                                        let oThisLocalConsumable = ET.MCMF.GetItems({_id: jQ(this).attr("data-id")})[0];

                                        ET.MCMF.CallGameCmd("items.eat", oThisLocalConsumable._id, oThisLocalConsumable.itemId);
                                    });

                                    oThisConsumable = undefined;
                                }
                            }
                            catch (err) { }
                        });
                    }
                }
            }
            catch (err) { }
            */
        }

        // hide tomes and magic books from the inscription tab and resort the items
        if (ET.MCMF.GetActiveTab() === "inscription")
        {
            try
            {
                jQ("div.item-icon-container.item").each(function()
                {
                    let oEl = jQ(this);

                    try
                    {
                        let oThisItem = ET.MCMF.GetItems({_id: oEl.attr("data-id")})[0];

                        if (oThisItem.category === "tome") oEl.remove();
                        if (oThisItem.category === "magic_book") oEl.remove();
                    }
                    catch (err) // no category
                    {
                        oEl.remove();
                    }
                });

                var itemContainer = jQ(jQ("div.item-icon-container.item").get(0)).parent();
                var items = itemContainer.find("div.item-icon-container.item");

                items.sort(function(item_A, item_B)
                {
                    let oEl_A = jQ(item_A);
                    let oEl_B = jQ(item_B);

                    let oItem_A = ET.MCMF.GetItems({_id: oEl_A.attr("data-id")})[0];
                    let oItem_B = ET.MCMF.GetItems({_id: oEl_B.attr("data-id")})[0];

                    try
                    {
                        if ((oItem_A.category === "pigment") && (oItem_B.category !== "pigment")) return -1;
                        if ((oItem_A.category !== "pigment") && (oItem_B.category === "pigment")) return 1;
                        if ((oItem_A.category === "woodcutting") && (oItem_B.category !== "woodcutting")) return -1;
                        if ((oItem_A.category !== "woodcutting") && (oItem_B.category === "woodcutting")) return 1;
                        if ((oItem_A.category === "paper") && (oItem_B.category !== "paper")) return -1;
                        if ((oItem_A.category !== "paper") && (oItem_B.category === "paper")) return 1;
                        if ((oItem_A.category === "book") && (oItem_B.category !== "book")) return -1;
                        if ((oItem_A.category !== "book") && (oItem_B.category === "book")) return 1;
                    }
                    catch (err) // no category
                    {
                        return -1;
                    }

                    if (oItem_A.name < oItem_B.name) return -1;
                    if (oItem_A.name > oItem_B.name) return 1;

                    return 0;
                });

                items.detach().appendTo(itemContainer);

            }
            catch (err) { ET.MCMF.Log("Error on inscription tab"); ET.MCMF.Log(err); }
        }

        // change the link to your own profile (by image, not by text) to redirect to your loadout page instead
        if (ET.MCMF.IsNewCombatTab())
        {
            try
            {
                jQ("div.lobby-container").find("a[href=\"/profile/" + ET.MCMF.UserName + "\"]").attr("href", "").on('click', function()
                {
                    setTimeout(function() { ET_LayoutTweaksMod_HackyClicker("button.loadout-btn"); }, 10);
                });
            }
            catch (err) { }
        }

        // change the link to your own profile (by image, not by text) to redirect to your loadout page instead
        if (ET.MCMF.IsNewCombatTab())
        {
            try
            {
                if (jQ(".body-content#content").find("div.item-icon-container.item").length > 0)
                {
                    if (jQ(jQ(".body-content#content").find("h4").get(0)).text().trim().toLowerCase().indexOf("gear") === 0)
                    {
                        // if we get this far, we're in the right sub-section of Battle > Loadouts

                        jQ(".body-content#content").find("div.item-icon-container.item").each(function()
                        {
                            let oEl = jQ(this);

                            try
                            {
                                let oThisItem = ET.MCMF.GetItems({_id: oEl.attr("data-id")})[0];

                                if (oThisItem._id.length < 5)
                                    throw "not an item";

                                oEl.css("cursor", "pointer").on('click', function()
                                {
                                    setTimeout(function() { ET_LayoutTweaksMod_HackyClicker("a.edit-gear-btn"); }, 10);
                                });
                            }
                            catch (err) // no item, probably an ability (which is being given item-icon-container anyway
                            {
                                oEl.css("cursor", "pointer").on('click', function()
                                {
                                    setTimeout(function() { ET_LayoutTweaksMod_HackyClicker("a.edit-abilities-btn"); }, 10);
                                });
                            }
                        });
                    }
                }
            }
            catch (err) { }
        }

        // hide player-hidden combat items in the equipment loadout screen
        if (ET.MCMF.IsNewCombatTab())
        {
            try
            {
                if (jQ(".body-content#content").find("div.item-icon-container.item").length > 0)
                {
                    if (jQ(jQ(".body-content#content").find("h4").get(0)).text().trim().toLowerCase() === "equipped gear")
                    {
                        // if we get this far, we're in the right sub-section of Battle > Loadouts > Edit

                        jQ(".body-content#content").find("div.item-icon-container.item").each(function()
                        {
                            try
                            {
                                let oEl = jQ(this);
                                let oThisItem = ET.MCMF.GetItems({_id: oEl.attr("data-id")})[0];

                                if ((!oThisItem.equipped) && (oThisItem.hidden))
                                    oEl.remove();
                            }
                            catch (err) { }
                        });
                    }
                }
            }
            catch (err) { }
        }

        // mark out tomes the player has already learned in the ability loadout screen
        if (ET.MCMF.IsNewCombatTab())
        {
            try
            {
                if (jQ(".body-content#content").find("div.item-icon-container.item").length > 0)
                {
                    if (jQ(jQ(".body-content#content").find("h4").get(0)).text().trim().toLowerCase() === "equipped abilities")
                    {
                        // if we get this far, we're in the right sub-section of Battle > Loadouts > Edit

                        jQ(".body-content#content").find("div.item-icon-container.item").each(function()
                        {
                            try
                            {
                                let oEl = jQ(this);

                                if (!oEl.hasClass("disabled"))
                                {
                                    let oThisItem = ET.MCMF.GetItems({_id: oEl.attr("data-id")})[0];

                                    jQ.makeArray(Meteor.connection._stores.abilities._getCollection().find({owner: Meteor.connection._userId}).fetch()[0].learntAbilities).forEach(function(oThisAbility)
                                    {
                                        if (oThisItem.itemId.startsWith(oThisAbility.abilityId) || ((oThisItem.itemId === "wisdom_tome") && (oThisAbility.abilityId === "magic_wisdom")))
                                        {
                                            let iLvl = 0;

                                            if (oThisItem.itemId.indexOf("_1") !== -1) iLvl = 1;
                                            if (oThisItem.itemId.indexOf("_2") !== -1) iLvl = 2;
                                            if (oThisItem.itemId.indexOf("_3") !== -1) iLvl = 3;
                                            if (oThisItem.itemId.indexOf("_4") !== -1) iLvl = 4;
                                            if (oThisItem.itemId.indexOf("_5") !== -1) iLvl = 5;

                                            let bShouldRemove = true;

                                            if (iLvl > 0)
                                                if (iLvl > oThisAbility.level)
                                                    bShouldRemove = false;

                                            if (bShouldRemove)
                                                oEl.addClass("disabled");
                                        }
                                    });
                                }
                            }
                            catch (err) { }
                        });
                    }
                }
            }
            catch (err) { }
        }
    }
    catch (err) { }
};

ET_LayoutTweaksMod_IsEatingThis = function(item)
{
    let isEatingThis = false;

    try
    {
        jQ.makeArray(Meteor.connection._stores.combat._getCollection().find({owner:Meteor.connection._userId}).fetch()[0].buffs).forEach(function(oThisBuff)
        {
            if ((oThisBuff.data.duplicateTag === "eatingFood") && (oThisBuff.id.indexOf("food_") === 0))
            {
                if (oThisBuff.id.substr(5) === item)
                    isEatingThis = true;
            }
        });
    }
    catch (err) { }

    return isEatingThis;
};

ET_LayoutTweaksMod_IsEatingAnything = function(item)
{
    let isEating = false;

    try
    {
        jQ.makeArray(Meteor.connection._stores.combat._getCollection().find({owner:Meteor.connection._userId}).fetch()[0].buffs).forEach(function(oThisBuff)
        {
            if ((oThisBuff.data.duplicateTag === "eatingFood") && (oThisBuff.id.indexOf("food_") === 0))
                isEating = true;
        });
    }
    catch (err) { }

    return isEating;
};

/*
ET_LayoutTweaksMod_CondenseChat = function(thisNode)
{
    try
    {
        if (thisNode.find(".direct-chat-name.pull-left").length > 0)
        {
            let sHTML;

            sHTML = thisNode.find("span.direct-chat-timestamp");
            sHTML.css("margin-left", "0px").css("color", "#999 !important").prependTo(thisNode.find("div.direct-chat-info"));

            thisNode.find("span.direct-chat-name").removeClass("pull-left");

            sHTML = thisNode.find("div.direct-chat-info").html();
            sHTML = sHTML.replace("<div ", "<span ").replace("</div>", "</span>");
            thisNode.find("div.direct-chat-info").remove();
            jQ(sHTML).prependTo(thisNode.find("div.direct-chat-text"));
        }
    }
    catch (err)
    {
        ET.MCMF.Log("Exception in CondenseChat");
        console.log(err);
    }
};

ET_LayoutTweaksMod_CondenseAllChats_in_progress = false;
ET_LayoutTweaksMod_CondenseAllChats = function()
{
    if (ET_LayoutTweaksMod_CondenseAllChats_in_progress)
        return;

    ET_LayoutTweaksMod_CondenseAllChats_in_progress = true;

    jQ(".direct-chat-msg").each(function()
    {
        if ((this.id !== undefined) && (this.id.length === 17))
            ET_LayoutTweaksMod_CondenseChat(jQ(this));
    });

    ET_LayoutTweaksMod_CondenseAllChats_in_progress = false;
};
*/


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
