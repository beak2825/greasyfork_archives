// ==UserScript==
// @name          Eternity Tower Inventory Search
// @icon          https://www.eternitytower.net/favicon.png
// @namespace     http://mean.cloud/
// @version       2.16
// @description   Search your inventory!
// @match         *://eternitytower.net/*
// @match         *://www.eternitytower.net/*
// @match         http://localhost:3000/*
// @author        psouza4@gmail.com
// @copyright     2017-2023, MeanCloud
// @run-at        document-end
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/35944/Eternity%20Tower%20Inventory%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/35944/Eternity%20Tower%20Inventory%20Search.meta.js
// ==/UserScript==


////////////////////////////////////////////////////////////////
////////////////// ** CUSTOM SCRIPT STYLES ** //////////////////
GM_addStyle(".PETS_ItemVal { color: black; font-weight: bold; font-style: italic; padding: -2px; max-height: 12px; height: 11px; text-align: center; border-radius: 4px; border: 1px solid black; position: absolute; line-height: 9px; top: -5px !important; left: 4px; font-size: 10px; width: 30px; text-overflow: wrap; display: inline-block; white-space: nowrap; }");
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
////////////// ** SCRIPT GLOBAL INITIALIZATION ** //////////////
function startup() { ETMod_InvSearch.load(); }
////////////////////////////////////////////////////////////////


// Note: can't declare this with 'var' or 'window.' etc. or TamperMonkey barfs on eval();
ETMod_InvSearch =
{
    NeedResort: true,
    did_manual_sort: false,
    sort_scheduled: false,
    returned_to_crafting: false,
    Counter: 0,

    load: function()
    {
        //ET.MCMF.WantDebug = true;

        ET.MCMF.Ready(function()
        {
            // trigger a re-sort whenever the game modifies the items collection store
            Meteor.connection._stream.on('message', function(sMeteorRawData)
            {
                try
                {
                    if (oMeteorData.collection == "items")
                        if ((oMeteorData.msg == "added") || (oMeteorData.msg == "removed"))
                            ETMod_InvSearch.NeedResort = true;
                }
                catch (err) { }

                if ((ETMod_InvSearch.sort_scheduled === false) && (ETMod_InvSearch.did_manual_sort) && (ETMod_InvSearch.returned_to_crafting))
                {
                    if ((jQ("div.item-icon-container").length > 7) && (ETMod_InvSearch.NeedResort))
                    {
                        ETMod_InvSearch.sort_scheduled = true;
                        setTimeout(ETMod_InvSearch.Resort, 500);
                    }
                }
            });

            // trigger a re-sort whenever the game updates the item HTML list visually
            jQ('body').on('DOMNodeInserted', 'div.body-content > div:first-of-type > div:first-of-type div.flex-wrap', function(e)
            {
                var oElAdded = jQ(e.target).find("div.item-icon-container:nth-last-of-type(2)");
                var iItemID = oElAdded.attr("data-id");

                if ((iItemID === undefined) || (iItemID === null) || (iItemID.length !== 17)) return;

                if (true || jQ("#PETSAutoSort").is(":checked")) // force sort on
                {
                    ETMod_InvSearch.NeedResort = true;
                    ETMod_InvSearch.did_manual_sort = true;
                }
            });
	
			ETMod_InvSearch.AddCSSRule('html:not(.dark) .item-icon-container.item.ETMod-InvSearch-equip { background-color: #ffc !important; }');
			ETMod_InvSearch.AddCSSRule('html:not(.dark) .item-icon-container.item.ETMod-InvSearch-quality { background-color: #dde7ff !important; }');
			ETMod_InvSearch.AddCSSRule('html:not(.dark) .item-icon-container.item.ETMod-InvSearch-food { background-color: #fee !important; }');
			ETMod_InvSearch.AddCSSRule('html:not(.dark) .item-icon-container.item.ETMod-InvSearch-money { background-color: #fda !important; }');
			ETMod_InvSearch.AddCSSRule('html:not(.dark) .item-icon-container.item.ETMod-InvSearch-usable { background-color: #df9 !important; }');
			ETMod_InvSearch.AddCSSRule('html:not(.dark) .item-icon-container.item.ETMod-InvSearch-itembox { background-color: #dfd !important; }');
			ETMod_InvSearch.AddCSSRule('html:not(.dark) .item-icon-container.item.ETMod-InvSearch-useful { background-color: #9fd !important; }');
			
			ETMod_InvSearch.AddCSSRule('html.dark .item-icon-container.item.ETMod-InvSearch-equip { background-color: #554 !important; }');
			ETMod_InvSearch.AddCSSRule('html.dark .item-icon-container.item.ETMod-InvSearch-quality { background-color: #223a55 !important; }');
			ETMod_InvSearch.AddCSSRule('html.dark .item-icon-container.item.ETMod-InvSearch-food { background-color: #533 !important; }');
			ETMod_InvSearch.AddCSSRule('html.dark .item-icon-container.item.ETMod-InvSearch-money { background-color: #641 !important; }');
			ETMod_InvSearch.AddCSSRule('html.dark .item-icon-container.item.ETMod-InvSearch-usable { background-color: #351 !important; }');
			ETMod_InvSearch.AddCSSRule('html.dark .item-icon-container.item.ETMod-InvSearch-itembox { background-color: #252 !important; }');
			ETMod_InvSearch.AddCSSRule('html.dark .item-icon-container.item.ETMod-InvSearch-useful { background-color: #052 !important; }');

            // gather all of the crafting recipes and when we receive data, start the main loop
            ET.MCMF.CallGameCmd("crafting.fetchRecipes", function(err, res)
            {
                //console.log(JSON.stringify(jQ.makeArray(res)));

                ETMod_InvSearch.AllRecipes = res;

                ETMod_InvSearch.main();
            });
        });

        ET.MCMF.Loaded(function()
        {
        }, "ETSearch");
    },

	AddCSSRule: function(cssText) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = cssText; //.replace(/;/g, ' !important;');
		head.appendChild(style);
	},

    CompareTwoWords: function(word1, word2)
    {
        try
        {
            if (word1 > word2) return 1;
            if (word1 < word2) return -1;
        }
        catch (err) { }

        return 0;
    },

    GetMetaWord: function(word, item, data)
    {
        try
        {
            word = word.toString().trim().toLowerCase();
            item = item.toString().trim().toLowerCase();

            let desc = '';
            if (IsValid(data.description)) {
              if (typeof data['decription'] == 'function') {
                desc = data.description();
              } else {
                desc = data.description;
              }
            }
            if (IsValid(desc)) {
              desc = desc.toString();
            } else {
              desc = '';
            }

            let gearRequiredEquip = 0;
            if (IsValid(data.category) && (data.category === 'combat') && IsValid(data.requiredEquip) && (data.requiredEquip.length > 0)) {
              if (data.requiredEquip[0].type === 'skill') {
                gearRequiredEquip = CInt(data.requiredEquip[0].level);
              }
            }
            gearRequiredEquip = pad(gearRequiredEquip, 3);

            if (word === "fragment") return "magic";
            if (word === "shard") return "magic";
            if (word === "crystal") return "magic";

            if (word === "jade") return "jewel";
            if (word === "lazuli") return "jewel";
            if (word === "ruby") return "jewel";
            if (word === "sapphire") return "jewel";
            if (word === "tanzanite") return "jewel";
            if (word === "emerald") return "jewel";
            if (item === "fire opal") return "jewel";

            if (IsValid(data.category)) {
              if (data.category === 'combat') {
                if (data.slot === 'mainHand') {
                  if (data.weaponType === 'spear') return `gear_1tank_1weapon_level${gearRequiredEquip}`;
                  if (data.weaponType === 'hammer') return `gear_1tank_1weapon_level${gearRequiredEquip}`;
                  if (data.weaponType === 'staff') return `gear_2magic_1weapon_level${gearRequiredEquip}`;
                  if (data.weaponType === 'wand') return `gear_2magic_1weapon_level${gearRequiredEquip}`;
                  if (data.weaponType === 'trident') return `gear_2magic_1weapon_level${gearRequiredEquip}`;
                  return `gear_3dps_1weapon_level${gearRequiredEquip}`;
                }

                if (data.slot === 'offHand') {
                  if (data.weaponType === 'shield') return `gear_1tank_2offweapon_level${gearRequiredEquip}`;
                  if (data.weaponType === 'orb') return `gear_2magic_2offweapon_level${gearRequiredEquip}`;
                  if (data.weaponType === 'tome') return `gear_2magic_2offweapon_level${gearRequiredEquip}`;
                  if (data.weaponType === 'buckler') return `gear_3dps_2offweapon_level${gearRequiredEquip}`;
                  return `gear_3dps_2offweapon_level${gearRequiredEquip}`;
                }

                if (data.slot === 'neck') {
                  return `gear_0all_neck_level${gearRequiredEquip}`;
                }

                if (item.indexOf("phoenix") !== -1) return `gear_2magic_9${data.slot}_level${gearRequiredEquip.toString()}`;
                if (item.indexOf("druid") !== -1) return `gear_2magic_9${data.slot}_level${gearRequiredEquip}`;
                if (item.indexOf("wizard") !== -1) return `gear_2magic_9${data.slot}_level${gearRequiredEquip}`;
                if (item.indexOf("opal") !== -1) return `gear_2magic_9${data.slot}_level${gearRequiredEquip}`;

                if (item.indexOf("eternal flame") !== -1) return `gear_2magic_9${data.slot}_level${gearRequiredEquip}`;
                if (item.indexOf("festive hat") !== -1) return `gear_2magic_9${data.slot}_level${gearRequiredEquip}`;
                if (item.indexOf("bear slippers") !== -1) return `gear_2magic_9${data.slot}_level${gearRequiredEquip}`;

                if (item.indexOf("horned helm") !== -1) return `gear_3dps_9${data.slot}_level${gearRequiredEquip}`;
                if (item.indexOf(" helmet") !== -1) return `gear_1tank_9${data.slot}_level${gearRequiredEquip}`;

                if (item.indexOf("bloody") !== -1) return `gear_3dps_9${data.slot}_level${gearRequiredEquip}`;
                if (item.indexOf(" plateleg") !== -1) return `gear_1tank_9${data.slot}_level${gearRequiredEquip}`;

                if (item.indexOf(" chestplate") !== -1) return `gear_1tank_9${data.slot}_level${gearRequiredEquip}`;
                if (item.indexOf("snake skin") !== -1) return `gear_1tank_9${data.slot}_level${gearRequiredEquip}`;
                if (item.indexOf("lion costume body") !== -1) return `gear_1tank_9${data.slot}_level${gearRequiredEquip}`;

                return `gear_9general_9${data.slot}_level${gearRequiredEquip}`;
              }
            }

            if ((desc.toLowerCase().indexOf('sold') !== -1) || (desc.toLowerCase().indexOf('sell') !== -1)) {
              return 'aaa_money';
            }

            if (IsValid(data.category) && (data.category === 'pigment')) return 'pigment';
            if (IsValid(data.category) && (data.category === 'food')) return 'food';
            if (IsValid(data.category) && (data.category === 'seed')) return 'farm_seed';
            if (IsValid(data.category) && (data.category === 'herb')) return 'farm_herb';

            if (item == "enhancer key") return "aaa_usable";
            if (item == "phasing key") return "aaa_usable";
            if (item == "phasing key") return "aaa_usable";
            if (item.indexOf("codex of ") !== -1) return "aaa_usable";
            if (data.category == "item_box") return "aab_itembox";
            if (item == "companion token") return "aac_useful";

            // category 'xp'
            if (item == "bamboo") return "farm_other";
            if (item == "cactus") return "farm_other";
            if (item == "reed") return "farm_other";
            if (item == "papyrus") return "farm_other";
            if (item == "palm") return "farm_other";
            if (item == "kenaf") return "farm_other";

            if (IsValid(data.category) && (data.category === 'tome')) return 'tome';

            if (item == "stone") return "ore_basic";
            if (item == "coal") return "ore_basic";
            if (item == "copper") return "ore_raw01";
            if (item == "tin") return "ore_raw02";
            if (item == "bronze") return "ore_raw03";
            if (item == "iron") return "ore_raw04";
            if (item == "silver") return "ore_raw05";
            if (item == "gold") return "ore_raw06";
            if (item == "carbon") return "ore_raw07";
            if (item == "steel") return "ore_raw08";
            if (item == "platinum") return "ore_raw09";
            if (item == "titanium") return "ore_raw10";
            if (item == "tungsten") return "ore_raw11";
            if (item == "obsidian") return "ore_raw12";
            if (item == "cobalt") return "ore_raw13";
            if (item == "mithril") return "ore_raw14";
            if (item == "adamantium") return "ore_raw15";
            if (item == "orichalcum") return "ore_raw16";
            if (item == "meteorite") return "ore_raw17";
            if (item == "fairy steel") return "ore_raw18";
            if (item == "elven steel") return "ore_raw19";
            if (item == "cursed ore") return "ore_raw20";

            if (item == "copper bar") return "ore_refined01";
            if (item == "tin bar") return "ore_refined02";
            if (item == "bronze bar") return "ore_refined03";
            if (item == "iron bar") return "ore_refined04";
            if (item == "silver bar") return "ore_refined05";
            if (item == "gold bar") return "ore_refined06";
            if (item == "carbon bar") return "ore_refined07";
            if (item == "steel bar") return "ore_refined08";
            if (item == "platinum bar") return "ore_refined09";
            if (item == "titanium bar") return "ore_refined10";
            if (item == "tungsten bar") return "ore_refined11";
            if (item == "obsidian bar") return "ore_refined12";
            if (item == "cobalt bar") return "ore_refined13";
            if (item == "mithril bar") return "ore_refined14";
            if (item == "adamantium bar") return "ore_refined15";
            if (item == "orichalcum bar") return "ore_refined16";
            if (item == "meteorite bar") return "ore_refined17";
            if (item == "fairy steel bar") return "ore_refined18";
            if (item == "elven steel bar") return "ore_refined19";
            if (item == "cursed bar") return "ore_refined20";

            if (item == "silver essence") return "ore_essence05";
            if (item == "gold essence") return "ore_essence06";
            if (item == "carbon essence") return "ore_essence07";
            if (item == "steel essence") return "ore_essence08";
            if (item == "platinum essence") return "ore_essence09";
            if (item == "titanium essence") return "ore_essence10";
            if (item == "tungsten essence") return "ore_essence11";
            if (item == "obsidian essence") return "ore_essence12";
            if (item == "cobalt essence") return "ore_essence13";
            if (item == "mithril essence") return "ore_essence14";
            if (item == "adamantium essence") return "ore_essence15";
            if (item == "orichalcum essence") return "ore_essence16";
            if (item == "meteorite essence") return "ore_essence17";
            if (item == "fairy steel essence") return "ore_essence18";
            if (item == "elven steel essence") return "ore_essence19";
            if (item == "cursed essence") return "ore_essence20";

            if (item == "lost silver scroll") return "ore_scroll05";
            if (item == "lost gold scroll") return "ore_scroll06";
            if (item == "lost carbon scroll") return "ore_scroll07";
            if (item == "lost steel scroll") return "ore_scroll08";
            if (item == "lost platinum scroll") return "ore_scroll09";
            if (item == "lost titanium scroll") return "ore_scroll10";
            if (item == "lost tungsten scroll") return "ore_scroll11";
            if (item == "lost obsidian scroll") return "ore_scroll12";
            if (item == "lost cobalt scroll") return "ore_scroll13";
            if (item == "lost mithril scroll") return "ore_scroll14";
            if (item == "lost adamantium scroll") return "ore_scroll15";
            if (item == "lost orichalcum scroll") return "ore_scroll16";
            if (item == "lost meteorite scroll") return "ore_scroll17";
            if (item == "lost fairy steel scroll") return "ore_scroll18";
            if (item == "lost elven steel scroll") return "ore_scroll19";
            if (item == "lost cursed scroll") return "ore_scroll20";

            if (IsValid(data.isCraftingScroll) && data.isCraftingScroll) {
              if (IsValid(data.teaches)) {
                return `scroll_crafting_${data.teaches}`;
              }

              /*
              try {
                const teaches = ET.MCMF.GetItemConsts(data.teaches); // technically data.teaches refers to a CRAFTING recipe ID, not an ITEM ID but they're usually the same
                if (teaches) {
                  return `scroll_crafting_${teaches.id}`;
                }
              } catch (err) {
              }
              */

              return "scroll_crafting_ZZZ";
            }

            if (item == "pine log") return "wood_raw00";
            if (item == "beech log") return "wood_raw01";
            if (item == "ash log") return "wood_raw02";
            if (item == "oak log") return "wood_raw03";
            if (item == "maple log") return "wood_raw04";
            if (item == "walnut log") return "wood_raw05";
            if (item == "cherry log") return "wood_raw06";
            if (item == "mahogany log") return "wood_raw07";
            if (item == "elk log") return "wood_raw08";
            if (item == "elm log") return "wood_raw08";
            if (item == "black log") return "wood_raw09";
            if (item == "blue gum log") return "wood_raw10";
            if (item == "cedar log") return "wood_raw11";
            if (item == "denya log") return "wood_raw12";
            if (item == "gombe log") return "wood_raw13";
            if (item == "hickory log") return "wood_raw14";
            if (item == "larch log") return "wood_raw15";
            if (item == "poplar log") return "wood_raw16";
            if (item == "tali log") return "wood_raw17";
            if (item == "willow log") return "wood_raw18";
            if (item == "teak log") return "wood_raw19";
            if (item == "ebony log") return "wood_raw20";
            if (item == "fiery log") return "wood_raw21";
            if (item == "tamarind log") return "wood_raw22";
            if (item == "magic log") return "wood_raw23";
            if (item == "petrified log") return "wood_raw24";
            if (item == "ancient log") return "wood_raw25";
            if (item.indexOf("_log") !== -1) return "wood_raw99";

            if (item == "pine paper") return "wood_paper00";
            if (item == "beech paper") return "wood_paper01";
            if (item == "ash paper") return "wood_paper02";
            if (item == "oak paper") return "wood_paper03";
            if (item == "maple paper") return "wood_paper04";
            if (item == "walnut paper") return "wood_paper05";
            if (item == "cherry paper") return "wood_paper06";
            if (item == "mahogany paper") return "wood_paper07";
            if (item == "elk paper") return "wood_paper08";
            if (item == "elm paper") return "wood_paper08";
            if (item == "black paper") return "wood_paper09";
            if (item == "blue gum paper") return "wood_paper10";
            if (item == "cedar paper") return "wood_paper11";
            if (item == "denya paper") return "wood_paper12";
            if (item == "gombe paper") return "wood_paper13";
            if (item == "hickory paper") return "wood_paper14";
            if (item == "larch paper") return "wood_paper15";
            if (item == "poplar paper") return "wood_paper16";
            if (item == "tali paper") return "wood_paper17";
            if (item == "willow paper") return "wood_paper18";
            if (item == "teak paper") return "wood_paper19";
            if (item == "ebony paper") return "wood_paper20";
            if (item == "fiery paper") return "wood_paper21";
            if (item == "tamarind paper") return "wood_paper22";
            if (item == "magic paper") return "wood_paper23";
            if (item == "petrified paper") return "wood_paper24";
            if (item == "ancient paper") return "wood_paper25";
            if (item.indexOf("_log") !== -1) return "wood_paper99";

            if (item == "pine book") return "wood_book00";
            if (item == "beech book") return "wood_book01";
            if (item == "ash book") return "wood_book02";
            if (item == "oak book") return "wood_book03";
            if (item == "maple book") return "wood_book04";
            if (item == "walnut book") return "wood_book05";
            if (item == "cherry book") return "wood_book06";
            if (item == "mahogany book") return "wood_book07";
            if (item == "elk book") return "wood_book08";
            if (item == "elm book") return "wood_book08";
            if (item == "black book") return "wood_book09";
            if (item == "blue gum book") return "wood_book10";
            if (item == "cedar book") return "wood_book11";
            if (item == "denya book") return "wood_book12";
            if (item == "gombe book") return "wood_book13";
            if (item == "hickory book") return "wood_book14";
            if (item == "larch book") return "wood_book15";
            if (item == "poplar book") return "wood_book16";
            if (item == "tali book") return "wood_book17";
            if (item == "willow book") return "wood_book18";
            if (item == "teak book") return "wood_book19";
            if (item == "ebony book") return "wood_book20";
            if (item == "fiery book") return "wood_book21";
            if (item == "tamarind book") return "wood_book22";
            if (item == "magic book") return "wood_book23";
            if (item == "petrified book") return "wood_book24";
            if (item == "ancient book") return "wood_book25";
            if (item.indexOf("_log") !== -1) return "wood_book99";

            if (IsValid(data.category) && (data.category === 'woodcutting')) return 'tool_woodcutting';
            if (IsValid(data.category) && (data.category === 'mining')) return 'tool_mining';
        }
        catch (err) { }

        return "";
    },

    MatchRecipe: function(recipe_name)
    {
        ETMod_InvSearch.RecipeResult = undefined;

        try
        {
            ETMod_InvSearch.RecipeSearch = recipe_name.trim().toLowerCase();

            if (ETMod_InvSearch.RecipeSearch == "lost silver scroll") ETMod_InvSearch.RecipeSearch = "silver essence";
            if (ETMod_InvSearch.RecipeSearch == "lost gold scroll") ETMod_InvSearch.RecipeSearch = "gold essence";
            if (ETMod_InvSearch.RecipeSearch == "lost carbon scroll") ETMod_InvSearch.RecipeSearch = "carbon essence";
            if (ETMod_InvSearch.RecipeSearch == "lost steel scroll") ETMod_InvSearch.RecipeSearch = "steel essence";
            if (ETMod_InvSearch.RecipeSearch == "lost platinum scroll") ETMod_InvSearch.RecipeSearch = "platinum essence";
            if (ETMod_InvSearch.RecipeSearch == "lost titanium scroll") ETMod_InvSearch.RecipeSearch = "titanium essence";
            if (ETMod_InvSearch.RecipeSearch == "lost tungsten scroll") ETMod_InvSearch.RecipeSearch = "tungsten essence";
            if (ETMod_InvSearch.RecipeSearch == "lost obsidian scroll") ETMod_InvSearch.RecipeSearch = "obsidian essence";
            if (ETMod_InvSearch.RecipeSearch == "lost cobalt scroll") ETMod_InvSearch.RecipeSearch = "cobalt essence";
            if (ETMod_InvSearch.RecipeSearch == "lost mithril scroll") ETMod_InvSearch.RecipeSearch = "mithril essence";
            if (ETMod_InvSearch.RecipeSearch == "lost adamantium scroll") ETMod_InvSearch.RecipeSearch = "adamantium essence";
            if (ETMod_InvSearch.RecipeSearch == "lost orichalcum scroll") ETMod_InvSearch.RecipeSearch = "orichalcum essence";
            if (ETMod_InvSearch.RecipeSearch == "lost meteorite scroll") ETMod_InvSearch.RecipeSearch = "meteorite essence";
            if (ETMod_InvSearch.RecipeSearch == "lost fairy steel scroll") ETMod_InvSearch.RecipeSearch = "fairy steel essence";
            if (ETMod_InvSearch.RecipeSearch == "lost elven steel scroll") ETMod_InvSearch.RecipeSearch = "elven steel essence";
            if (ETMod_InvSearch.RecipeSearch == "lost cursed scroll") ETMod_InvSearch.RecipeSearch = "cursed essence";

            if (ETMod_InvSearch.AllRecipes !== undefined)
            {
                jQ.makeArray(ETMod_InvSearch.AllRecipes).forEach(function(currentRecipe, index, array)
                {
                    if (ETMod_InvSearch.RecipeResult !== undefined) return;
                    if (currentRecipe.name.trim().toLowerCase() === ETMod_InvSearch.RecipeSearch)
                        ETMod_InvSearch.RecipeResult = currentRecipe;
                });
            }
        }
        catch (err) { }

        return ETMod_InvSearch.RecipeResult;
    },

    Resort: function()
    {
        ETMod_InvSearch.NeedResort = false;

        var itemContainer = jQ(jQ("div.item-icon-container").get(0)).parent();
        var items = itemContainer.find("div.item-icon-container");

        items.sort(function(a,b)
        {
            var sTextThisItem_a;
            var sTextThisItem_b;

            try
            {
                var oActualItemData_a = ET.MCMF.GetItem(jQ(a).attr("data-id"));
                var oActualItemData_b = ET.MCMF.GetItem(jQ(b).attr("data-id"));

                sTextThisItem_a = undefined; try { sTextThisItem_a = oActualItemData_a.name.trim().toLowerCase(); } catch (err) { }
                sTextThisItem_b = undefined; try { sTextThisItem_b = oActualItemData_b.name.trim().toLowerCase(); } catch (err) { }

                if ((sTextThisItem_a !== undefined) && (sTextThisItem_b !== undefined))
                {
                    //console.log(a._tippy);

                    var oRecipe_a = ETMod_InvSearch.MatchRecipe(oActualItemData_a.name);
                    var oRecipe_b = ETMod_InvSearch.MatchRecipe(oActualItemData_b.name);
                    var sLastWord_a = "";
                    var sLastWord_b = "";
                    var sRest_a = "";
                    var sRest_b = "";

                    if (sTextThisItem_a.indexOf("(E)") !== -1) sTextThisItem_a = ChopperBlank(sTextThisItem_a, "", "(E)").trim();
                    if (sTextThisItem_b.indexOf("(E)") !== -1) sTextThisItem_b = ChopperBlank(sTextThisItem_b, "", "(E)").trim();

                    if (sTextThisItem_a.indexOf(" ") !== -1)
                    {
                        sLastWord_a = sTextThisItem_a.split(" ").splice(-1).toString().trim().toLowerCase();
                        sRest_a = ChopperBlank(sTextThisItem_a, "", " " + sLastWord_a);
                    }
                    else
                    {
                        sLastWord_a = sTextThisItem_a.toString().trim().toLowerCase();
                        sRest_a = "";
                    }

                    if (sTextThisItem_b.indexOf(" ") !== -1)
                    {
                        sLastWord_b = sTextThisItem_b.split(" ").splice(-1).toString().trim().toLowerCase();
                        sRest_b = ChopperBlank(sTextThisItem_b, "", " " + sLastWord_b);
                    }
                    else
                    {
                        sLastWord_b = sTextThisItem_b.toString().trim().toLowerCase();
                        sRest_b = "";
                    }

                    if (sLastWord_a === "") sLastWord_a = "zzzzz";
                    if (sLastWord_b === "") sLastWord_b = "zzzzz";

                    var sQual_a = 0; try { sQual_a = parseInt(ChopperBlank(jQ(a).find("div.item-quality").text(), "", "%")); } catch (err) { }
                    var sQual_b = 0; try { sQual_b = parseInt(ChopperBlank(jQ(b).find("div.item-quality").text(), "", "%")); } catch (err) { }

                    // meta words (more grouping!)
                    var sMetaWord_a = ETMod_InvSearch.GetMetaWord(sLastWord_a, sTextThisItem_a, oActualItemData_a);
                    var sMetaWord_b = ETMod_InvSearch.GetMetaWord(sLastWord_b, sTextThisItem_b, oActualItemData_b);

                    if (sMetaWord_a.startsWith("ore_scroll"))
                        if ((oRecipe_a !== undefined) && (oRecipe_a !== null))
                            sMetaWord_a = "aaa_money";

                    if (sMetaWord_b.startsWith("ore_scroll"))
                        if ((oRecipe_b !== undefined) && (oRecipe_b !== null))
                            sMetaWord_b = "aaa_money";

                    //if ((sLastWord_a === "") || (sLastWord_b === ""))
                    //	console.log("Item '" + sRest_a + "' '" + sLastWord_a + "' ('" + sMetaWord_a + "') vs '" + sRest_b + "' '" + sLastWord_b + "' ('" + sMetaWord_b + "')");

                    if ((sMetaWord_a !== "") && (sMetaWord_b === "")) return -1;
                    if ((sMetaWord_a === "") && (sMetaWord_b !== "")) return 1;

                    if ((sMetaWord_a !== "") && (sMetaWord_b !== ""))
                    {
                        ret = ETMod_InvSearch.CompareTwoWords(sMetaWord_a, sMetaWord_b);
                        if (ret !== 0)
                            return ret;

                        if (sMetaWord_a === "pigment") return ETMod_InvSearch.CompareTwoWords(sTextThisItem_a, sTextThisItem_b);
                        if (sMetaWord_a === "tome") return ETMod_InvSearch.CompareTwoWords(sTextThisItem_a, sTextThisItem_b);
                    }

                    var ret = ETMod_InvSearch.CompareTwoWords(sLastWord_a, sLastWord_b);
                    if (ret !== 0)
                        return ret;

                    if ((sRest_a !== "") && (sRest_b !== ""))
                    {
                        ret = ETMod_InvSearch.CompareTwoWords(sRest_a, sRest_b);
                        if (ret !== 0)
                            return ret;
                    }

                    // descending order on quality
                    if ((sQual_a + sQual_b) > 0)
                    {
                        if (sQual_a > sQual_b) return -1;
                        if (sQual_a < sQual_b) return 1;
                    }

                    return ETMod_InvSearch.CompareTwoWords(sTextThisItem_a, sTextThisItem_b);
                }
            }
            catch (err) { console.log("Error: " + err); }

            if (sTextThisItem_a === undefined) return 1;
            if (sTextThisItem_b === undefined) return -1;
            return 0;
        });

        items.detach().appendTo(itemContainer);

        /* items.each(function()
        {
            console.log(ChopperBlank(this._tippy.popper.innerHTML, "popover-title text-capitalize\">", "</h3>").trim());
        }); */

        ETMod_InvSearch.sort_scheduled = false;
        //alert("Sorted!");
    },

    main: function()
    {
        if (window.location.href.indexOf("/crafting") !== -1)
        {
            var oJQ_Options;

            if (!ETMod_InvSearch.returned_to_crafting)
            {
                ETMod_InvSearch.did_manual_sort = false;
                ETMod_InvSearch.returned_to_crafting = true;

                if (true || jQ("#PETSAutoSort").is(":checked")) // force sort on
                {
                    ETMod_InvSearch.NeedResort = true;
                    ETMod_InvSearch.did_manual_sort = true;
                }
            }

            try
            {
                oJQ_Options = jQ("div#PETSOptionsEl").get(0);

                if (oJQ_Options === undefined)
                {
                    jQ("div.flex-grow h2:first-of-type").after("<div id=\"PETSOptionsEl\"><small class=\"mx-2\">" +
                        //"Search: <input type=\"text\" id=\"PETSSearchEl\" style=\"width: 200px;\" placeholder=\"search/filter by typing here\" value=\"" + (GM_getValue("PETSearch_Text") || "") + "\" /> &nbsp; " +

						"<label class=\"sr-only\" for=\"PETSSearchEl\">Search: </label><span class=\"twitter-typeahead\" style=\"position: relative; display: inline-block;\"><input class=\"form-control typeahead tt-input\" name=\"PETSSearchEl\" id=\"PETSSearchEl\" type=\"text\" placeholder=\"search/filter by typing here\" autocomplete=\"off\" spellcheck=\"false\" dir=\"auto\" style=\"position: relative; vertical-align: top; background-color: white;\" value=\"" + (GM_getValue("PETSearch_Text") || "") + "\"></span> &nbsp; " +

                        "<span class=\"twitter-typeahead\" style=\"position: relative; display: inline-block;\"><select class=\"form-control typeahead tt-input\" id=\"PETSFilterList\"><option default selected value=\"0\">All Items<option value=\"1\">Equipment<option value=\"3\">Special Stuff<option value=\"4\">Non-Special Stuff<option value=\"2\">Axes &amp; Mining<option value=\"999\">Other</select></span> &nbsp; " +

                        /* "<label for=\"PETSItemText\">item labels</label> <input type=\"checkbox\" id=\"PETSItemText\"" + ((GM_getValue("PETSearch_Labels")) ? " CHECKED" : "") + "> &nbsp; " + */
                        /* "<label for=\"PETSAutoExpand\">auto-expand</label> <input type=\"checkbox\" id=\"PETSAutoExpand\"" + ((GM_getValue("PETSearch_AutoExpand")) ? " CHECKED" : "") + "> &nbsp;" + */

						//"<label for=\"PETSAutoSort\">auto-sort</label> <input type=\"checkbox\" id=\"PETSAutoSort\"" + ((GM_getValue("PETSearch_AutoSort")) ? " CHECKED" : "") + "> &nbsp;" +

						/* "<input type=\"button\" value=\"Sort\" onClick=\"javascript:PETSearch_did_manual_sort=true;PETSearch_Resort();\">" + */

                        "<label for=\"PETSItemColor\">colorize</label> <input type=\"checkbox\" id=\"PETSItemColor\"" + ((GM_getValue("PETSearch_Color")) ? " CHECKED" : "") + "> &nbsp; " +

                        "</small><br /><br /></div>");
                    jQ("#PETSSearchEl").focus();
                    try
                    {
                        jQ("#PETSSearchEl").get(0).selectionStart = 10000;
                        jQ("#PETSSearchEl").get(0).selectionEnd = 10000;
                    }
                    catch (errSel) { }

                    jQ("#PETSAutoSort").change(function()
                    {
                        GM_setValue("PETSearch_AutoSort", jQ("#PETSAutoSort").is(":checked"));
                        ETMod_InvSearch.NeedResort = jQ("#PETSAutoSort").is(":checked");
                        ETMod_InvSearch.did_manual_sort = jQ("#PETSAutoSort").is(":checked");
                    });

                    /* jQ("#PETSItemText").change(function() {
                        jQ("div.item-icon-container").each(function() {
                            try { jQ(this).attr("PETS_Modified", ""); } catch (err) { } }); }); */

                    jQ("#PETSItemColor").change(function() {
                        jQ("div.item-icon-container").each(function() {
                            try { jQ(this).attr("PETS_Modified", ""); } catch (err) { } }); });

                    jQ("#PETSFilterList").change(function() {
                        jQ("div.item-icon-container").each(function() {
                            try { jQ(this).attr("PETS_Modified", ""); } catch (err) { } }); });
                }
                else
                {
                    GM_setValue("PETSearch_Text",       jQ("#PETSSearchEl")  .val());
                    GM_setValue("PETSearch_Color",     jQ("#PETSItemColor")  .is(":checked"));
                    //GM_setValue("PETSearch_Labels",     jQ("#PETSItemText")  .is(":checked"));
                    //GM_setValue("PETSearch_AutoExpand", jQ("#PETSAutoExpand").is(":checked"));
                    GM_setValue("PETSearch_AutoSort",   jQ("#PETSAutoSort").  is(":checked"));
                }
            }
            catch (err) { console.log(err); }

            if (true /* &&  jQ("#PETSAutoExpand").is(":checked") */) jQ("div.show-all-items").click();
            //if (!jQ("#PETSItemText")  .is(":checked")) jQ(".PETS_SearchTag").remove();

            /*
            if (ETMod_InvSearch.sort_scheduled === false)
            {
                if (jQ("div.item-icon-container").length === 7)
                    ETMod_InvSearch.NeedResort = true;

                if ((jQ("div.item-icon-container").length > 7) && (ETMod_InvSearch.NeedResort))
                {
                    ETMod_InvSearch.sort_scheduled = true;
                    setTimeout(ETMod_InvSearch.Resort, 500);
                }
            }
            */

            var sTextToSearch = jQ("#PETSSearchEl").val().trim().toLowerCase();
            while (sTextToSearch.indexOf(" ") !== -1)
                sTextToSearch = sTextToSearch.replace(" ", "");

            var bDidAny = false;
            jQ("div.item-icon-container").each(function()
            {
                try
                {
                    var oThisItemEl = jQ(this);

                    if (oThisItemEl.attr("data-id").length != 17) return;

                    //var oActualItemData = ET.MCMF.ItemManager._collection._docs._map[oThisItemEl.attr("data-id")];
                    var oActualItemData = ET.MCMF.GetItem(oThisItemEl.attr("data-id"));
                    if (oActualItemData === undefined) return;
                    if (CInt(oActualItemData.amount) === 0) oActualItemData.amount = 1; // if the property is missing, then assume we only have 1 of this item
                    var sTextThisItem = oActualItemData.name.trim().toLowerCase();
                    var oRecipe = ETMod_InvSearch.MatchRecipe(sTextThisItem);
                    var sLastWord = "";

                    //sTextThisItem = undefined; try { sTextThisItem = oActualItemData.name.trim().toLowerCase(); } catch (err) { }

                    if (sTextThisItem.indexOf("(E)") !== -1) sTextThisItem = ChopperBlank(sTextThisItem, "", "(E)").trim();

                    if (sTextThisItem.indexOf(" ") !== -1)
                        sLastWord = sTextThisItem.split(" ").splice(-1).toString().trim().toLowerCase();
                    else
                        sLastWord = sTextThisItem.toString().trim().toLowerCase();

                    if (sLastWord === "") sLastWord = "zzzzz";

                    var sMetaWord = ETMod_InvSearch.GetMetaWord(sLastWord, sTextThisItem, oActualItemData);

                    var bWantToDecorate = (CInt(oThisItemEl.attr("PETS_Modified")) !== 1);
                    bWantToDecorate = bWantToDecorate || (CInt(oActualItemData.amount)  !== CInt(oThisItemEl.attr("PETS_LastQty")));
                    bWantToDecorate = bWantToDecorate || (CInt(oActualItemData.quality) !== CInt(oThisItemEl.attr("PETS_LastPct")));

                    if (sMetaWord.startsWith("ore_scroll"))
                        if ((oRecipe !== undefined) && (oRecipe !== null))
                            sMetaWord = "aaa_money";

                    if (bWantToDecorate)
                    {
                        //ET.MCMF.Log(JSON.stringify(oActualItemData));

                        oThisItemEl.attr("PETS_Modified", "1");

                        if ((sMetaWord === "aaa_money") && (CInt(oActualItemData.amount) <= 1) && (oThisItemEl.find("div.item-amount").length === 0))
                            oThisItemEl.append("<div class=\"item-amount\" style=\"color: rgb(255, 255, 255); background-color: rgb(51, 51, 51); width: 55px;\">1</div>");

                        if ((sMetaWord === "aaa_money") && (CInt(oActualItemData.amount) <= 1) && (oThisItemEl.find("div.item-amount").length === 0))
                            oThisItemEl.append("<div class=\"item-amount\" style=\"color: rgb(255, 255, 255); background-color: rgb(51, 51, 51); width: 55px;\">1</div>");

                        // Colorize item background
                        if (jQ("#PETSItemColor").is(":checked"))
                        {
                            if (oActualItemData.isEquippable === true)  oThisItemEl.addClass('ETMod-InvSearch-equip');
                            else if (CInt(oActualItemData.quality) > 0) oThisItemEl.addClass('ETMod-InvSearch-quality');
                            else if (sMetaWord === "food")              oThisItemEl.addClass('ETMod-InvSearch-food');
                            else if (sMetaWord === "aaa_money")         oThisItemEl.addClass('ETMod-InvSearch-money');
                            else if (sMetaWord === "aaa_usable")        oThisItemEl.addClass('ETMod-InvSearch-usable');
                            else if (sMetaWord === "aab_itembox")       oThisItemEl.addClass('ETMod-InvSearch-itembox');
                            else if (sMetaWord === "aac_useful")        oThisItemEl.addClass('ETMod-InvSearch-useful');
                        }
                        else
						{
                            oThisItemEl.css("background-color", "").removeClass('ETMod-InvSearch-equip').removeClass('ETMod-InvSearch-quality').removeClass('ETMod-InvSearch-food').removeClass('ETMod-InvSearch-money').removeClass('ETMod-InvSearch-usable').removeClass('ETMod-InvSearch-itembox').removeClass('ETMod-InvSearch-useful');
						}

                        // Reposition quantity/quality text as bubbles in the upper-left
                        oThisItemEl.children("div.item-amount") .removeClass().addClass("PETS_ItemVal").addClass("item-amount");
                        oThisItemEl.children("div.item-quality").removeClass().addClass("PETS_ItemVal").addClass("item-quality");

                        // Add some space between rows so the quantity/quality text bubbles don't overlap the prior row's item boxes
                        oThisItemEl.css("margin-bottom", "5px");

                        // Calculate bubble text and color
                        var sBubbleText = "";
                        var sBubbleColor = "#e7e7e7";

                        if (CInt(oActualItemData.quality) > 0)
                        {
                            sBubbleText = CInt(oActualItemData.quality).toString() + "%";
                            if (CInt(oActualItemData.quality) >= 85)
                                sBubbleColor = "#c9f";
                            else if (CInt(oActualItemData.quality) >= 65)
                                sBubbleColor = "#afa";
                            else if (CInt(oActualItemData.quality) >= 40)
                                sBubbleColor = "#ffa";
                            else
                                sBubbleColor = "#faa";
                        }
                        else if (CInt(oActualItemData.amount) > 1)
                            sBubbleText = ETMod_InvSearch.FriendlyNumber(CInt(oActualItemData.amount));

                        if (sMetaWord === "aaa_money")
                            sBubbleText = ETMod_InvSearch.FriendlyNumber(CInt(oActualItemData.amount) * CInt(oActualItemData.sellPrice)) + "&nbsp;&nbsp;&nbsp;<img src=\"/icons/goldCoin.svg\" class=\"extra-small-icon\" style=\"position: absolute; top: -3px; right: 1px; margin: 0px; padding: 0px; width: 15px; height: 15px;\">";

                        // Tag with last quantity/percentage -- if it changes, we need to redecorate manually
                        oThisItemEl.attr("PETS_LastQty", CInt(oActualItemData.amount) .toString());
                        oThisItemEl.attr("PETS_LastPct", CInt(oActualItemData.quality).toString());


                        if (sBubbleText.length > 0)
                        {
                            oThisItemEl.children("div.PETS_ItemVal").html(sBubbleText);

                            if (sMetaWord !== "aaa_money")
                            {
                                oThisItemEl.children("div.PETS_ItemVal").css("color", "#000");
                                oThisItemEl.children("div.PETS_ItemVal").css("background-color", sBubbleColor);
                            }
                            else
                            {
                                oThisItemEl.children("div.PETS_ItemVal").css("color", "#fff");
                                oThisItemEl.children("div.PETS_ItemVal").css("background-color", "#333");
                                oThisItemEl.children("div.PETS_ItemVal").css("width", "55px");
                            }
                        }

                        // Add item name/label
                        if (true /* && jQ("#PETSItemText").is(":checked") */)
                        {
                            //oThisItemEl.css("height", "76px");

                            //oThisItemEl.children("img.item-icon").css("height", "32px");
                            //oThisItemEl.children("img.item-icon").css("width", "32px");
                            //oThisItemEl.children("img.item-icon").css("margin-bottom", "10px");

                            /* if (oThisItemEl.children(".PETS_SearchTag").length === 0)
                                oThisItemEl.append("<div class=\"PETS_SearchTag\" style=\"position: absolute; bottom: 10px; right: 3px; font-size: 10px; max-width: 54px; text-overflow: hidden; display: inline-block; white-space: nowrap; overflow: hidden;\"><i>" + sTextThisItem + "</i></div>"); */

                            if (oThisItemEl.children(".PETS_SearchTag").length === 0)
                                oThisItemEl.append("<div class=\"PETS_SearchTag\" style=\"position: absolute; bottom: 0px; right: 3px; font-size: 10px; max-width: 54px; text-overflow: hidden; display: inline-block; white-space: nowrap; overflow: hidden;\"><i>" + sTextThisItem + "</i></div>");

                            /* if (oThisItemEl.children(".PETS_SearchTag").length === 0)
                                oThisItemEl.append("<div class=\"PETS_SearchTag\" style=\"position: absolute; bottom: 10px; right: 3px; font-size: 10px; max-width: 54px; text-overflow: wrap; display: inline-block;\"><i>" + sTextThisItem + "</i></div>"); */
                        }
                        else
                        {
                            //oThisItemEl.css("height", "64px");

                            //oThisItemEl.children("img.item-icon").css("height", "36px");
                            //oThisItemEl.children("img.item-icon").css("width", "36px");
                            //oThisItemEl.children("img.item-icon").css("margin-bottom", "");
                        }

                        oThisItemEl.children("img.item-icon").css("height", "48px");
                        oThisItemEl.children("img.item-icon").css("width", "48px");
                        oThisItemEl.children("img.item-icon").css("margin", "0px");
                        oThisItemEl.children("img.item-icon").css("margin-top", "-8px");
                        oThisItemEl.children("img.item-icon").css("margin-bottom", "");

                        /* oThisItemEl.hover
                        (
                            function()
                            {
                                oThisItemEl.children("img.item-icon").css("height", "80px");
                                oThisItemEl.children("img.item-icon").css("width", "80px");
                                oThisItemEl.children("img.item-icon").css("margin", "0px");
                                oThisItemEl.children("img.item-icon").css("margin-top", "-2px");
                                oThisItemEl.children("img.item-icon").css("margin-bottom", "");
                                oThisItemEl.css("border-width", "3px");
                                //oThisItemEl.children("div").hide();
                                oThisItemEl.children("div.PETS_SearchTag").hide();
                            },

                            function()
                            {
                                oThisItemEl.css("border-width", "");
                                //oThisItemEl.children("div").show();
                                oThisItemEl.children("div.PETS_SearchTag").show();
                                oThisItemEl.children("img.item-icon").css("margin", "");

                                if (true && jQ("#PETSItemText").is(":checked"))
                                {
                                    //oThisItemEl.css("height", "76px");

                                    oThisItemEl.children("img.item-icon").css("height", "32px");
                                    oThisItemEl.children("img.item-icon").css("width", "32px");
                                    oThisItemEl.children("img.item-icon").css("margin-bottom", "10px");

                                    if (oThisItemEl.children(".PETS_SearchTag").length === 0)
                                        oThisItemEl.append("<div class=\"PETS_SearchTag\" style=\"position: absolute; bottom: 10px; right: 3px; font-size: 10px; max-width: 54px; text-overflow: hidden; display: inline-block; white-space: nowrap; overflow: hidden;\">" + sTextThisItem + "</div>");
                                }
                                else
                                {
                                    //oThisItemEl.css("height", "64px");

                                    oThisItemEl.children("img.item-icon").css("height", "36px");
                                    oThisItemEl.children("img.item-icon").css("width", "36px");
                                    oThisItemEl.children("img.item-icon").css("margin-bottom", "");
                                }
                            }
                        ); */

                        let borderStyle = '';

                        if (oActualItemData.rarityId === 'crude') {
                          borderStyle = "3px dotted #555555";
                        } else if (oActualItemData.rarityId === 'rough') {
                          borderStyle = "3px dotted #666644";
                        } else if (oActualItemData.rarityId === 'improved') {
                          borderStyle = "3px dashed #998800";
                        } else if (oActualItemData.rarityId === 'mastercrafted') {
                          borderStyle = "3px dashed #cc7700";
                        } else if (oActualItemData.rarityId === 'masterforged') {
                          borderStyle = "3px double #ee6622";
                        } else if (oActualItemData.rarityId === 'ascended') {
                          borderStyle = "3px double #ff2266";
                        } else if (oActualItemData.rarityId === 'ethereal') {
                          borderStyle = "3px double #FF5599";
                        } else if (oActualItemData.rarityId === 'fine') {
                          borderStyle = "3px dashed #66aaaa";
                        } else if (oActualItemData.rarityId === 'rare') {
                          borderStyle = "3px dashed #3388aa";
                        } else if (oActualItemData.rarityId === 'extraordinary') {
                          borderStyle = "3px double #3366aa";
                        } else if (oActualItemData.rarityId === 'phenomenal') {
                          borderStyle = "3px double #0055cc";
                        } else if (oActualItemData.rarityId === 'epic') {
                          borderStyle = "3px double #0022ee";
                        } else if (oActualItemData.rarityId === 'divine') {
                          borderStyle = "3px double #4444ff";
                        } else if (oActualItemData.rarityId === 'prized') {
                          borderStyle = "3px double #883388";
                        } else if (oActualItemData.rarityId === 'legendary') {
                          borderStyle = "3px double #cc44cc";
                        } else if (oActualItemData.rarityId === 'artifact') {
                          borderStyle = "3px double #44cc44";
                        }

                        if (borderStyle !== '') {
                          oThisItemEl.css("border", borderStyle);
                        }

                        oThisItemEl.hover
                        (
                            function()
                            {
                                if (oActualItemData.rarityId === 'legendary') {
                                  oThisItemEl.css("border", "3px solid #cc44cc");
                                } else if (oActualItemData.rarityId === 'prized') {
                                  oThisItemEl.css("border", "3px solid #883388");
                                } else if (borderStyle !== '') {
                                  oThisItemEl.css("border", borderStyle.replace('dashed', 'solid'));
                                } else {
                                  oThisItemEl.css("border-width", "3px");
                                }
                            },

                            function()
                            {
                                if (borderStyle === '') {
                                  oThisItemEl.css("border-width", "");
                                } else {
                                  oThisItemEl.css("border", borderStyle);
                                }
                            }
                        );

                        bDidAny = true;
                    }

                    var sTextThisItem_temp = sTextThisItem;
                    while (sTextThisItem_temp.indexOf(" ") !== -1) sTextThisItem_temp = sTextThisItem_temp.replace(" ", "");
                    sTextThisItem_temp = sTextThisItem_temp.toLowerCase();
                    var bWantHide = false;

                    if ((sTextToSearch.length > 0) && (sTextThisItem_temp.indexOf(sTextToSearch) === -1))
                        bWantHide = true;

                    var iFilterLevel = CInt(jQ("select#PETSFilterList").val());

                    if (iFilterLevel === 1)
                    {
                        if ((sMetaWord === "mining") || (oActualItemData.isEquippable !== true))
                            bWantHide = true;
                    }
                    else if (iFilterLevel === 2)
                    {
                        bWantHide = true;

                        if ((CInt(oActualItemData.quality) > 0) && (oActualItemData.isEquippable !== true))
                            bWantHide = false;
                        if ((CInt(oActualItemData.quality) > 0) && (sMetaWord === "mining"))
                            bWantHide = false;
                    }
                    else if (iFilterLevel === 3)
                    {
                        bWantHide = true;

                        if ((CInt(oActualItemData.quality) > 0) && (oActualItemData.isEquippable))
                        {
                            const rarityId = (IsValid(oActualItemData.rarityId)) ? oActualItemData.rarityId : 'standard';

                            if ((rarityId !== 'crude') && (rarityId !== 'rough') && (rarityId !== 'standard') && (rarityId !== 'improved') && (rarityId !== 'uncommon') && (rarityId !== 'fine'))
                            {
                                bWantHide = false;
                            }
                        }

                        if (oActualItemData.isEquippable && oActualItemData.itemId.indexOf('_amulet') !== -1)
                        {
                            bWantHide = false;
                        }

                        if ((oActualItemData.itemId == 'enhancer_key') || (oActualItemData.itemId == 'phasing_key') || (oActualItemData.itemId == 'event_ny_balloons') || (oActualItemData.itemId == 'opal_chest_plate'))
                        {
                            bWantHide = false;
                        }

                        if (sMetaWord === "mining")
                        {
                            bWantHide = true;
                        }
                    }
                    else if (iFilterLevel === 4)
                    {
                        bWantHide = true;

                        if ((CInt(oActualItemData.quality) > 0) && (oActualItemData.isEquippable))
                        {
                            const rarityId = (IsValid(oActualItemData.rarityId)) ? oActualItemData.rarityId : 'standard';

                            if ((rarityId === 'crude') || (rarityId === 'rough') || (rarityId === 'standard') || (rarityId === 'improved') || (rarityId === 'uncommon') || (rarityId === 'fine'))
                            {
                                bWantHide = false;
                            }
                        }

                        if ((oActualItemData.itemId.indexOf('_dagger') !== -1) || (oActualItemData.itemId.indexOf('_scroll') !== -1))
                        {
                            bWantHide = false;
                        }

                        if ((CInt(oActualItemData.quality) > 0) && ((sMetaWord === "mining") || (sMetaWord === "woodcutting")))
                        {
                            bWantHide = false;
                        }

                        if ((oActualItemData.itemId == 'event_ny_balloons') || (oActualItemData.itemId == 'opal_chest_plate'))
                        {
                            bWantHide = true;
                        }
                    }
                    else if (iFilterLevel === 999)
                    {
                        if (sMetaWord === "mining")
                            bWantHide = true;
                        if (CInt(oActualItemData.quality) > 0)
                            bWantHide = true;
                        if (oActualItemData.isEquippable === true)
                            bWantHide = true;
                    }

                    if (bWantHide)
                        oThisItemEl.hide();
                    else
                        oThisItemEl.show();
                }
                catch (err) { }
            });

            if ((bDidAny === true) && (true || jQ("#PETSAutoSort").is(":checked"))) // force sort on
            {
                ETMod_InvSearch.sort_scheduled = true;
                setTimeout(ETMod_InvSearch.Resort, 500);
            }

            if (bDidAny === true)
            {
                ETMod_InvSearch.Counter = 0;
            }
            else
            {
                ETMod_InvSearch.Counter++;
                if (ETMod_InvSearch.Counter === 10)
                {
                    ETMod_InvSearch.Counter = 0;

                    jQ("div.item-icon-container").each(function() {
                        try { jQ(this).attr("PETS_Modified", ""); } catch (err) { } });
                }
            }

            jQ("div.recipe-container").each(function()
            {
                try
                {
                    var sTextThisRecipe = jQ(this).find("div div span.text-capitalize").text().trim().toLowerCase();

                    while (sTextThisRecipe.indexOf(" ") !== -1) sTextThisRecipe = sTextThisRecipe.replace(" ", "");

                    if ((sTextToSearch.length > 0) && (sTextThisRecipe.indexOf(sTextToSearch) === -1))
                        jQ(this).hide();
                    else
                        jQ(this).show();
                }
                catch (err) { }
            });
        }
        else
        {
            jQ("div#PETSOptionsEl").remove();
            ETMod_InvSearch.NeedResort = true;
            ETMod_InvSearch.did_manual_sort = false;
            ETMod_InvSearch.returned_to_crafting = false;
        }

        setTimeout(ETMod_InvSearch.main, 1000);
    },

    FriendlyNumber: function(num)
    {
        if (num < 1000) return num.toString();
        if (num < 10000) return ((Math.floor(num / 100) / 10.0).toString() + "k");
        if (num < 100000) return ((Math.floor(num / 1000)).toString() + "k");
        if (num < 1000000) return ((Math.floor(num / 1000)).toString() + "k");
        if (num < 10000000) return ((Math.floor(num / 100000) / 10.0).toString() + "m");
        if (num < 100000000) return ((Math.floor(num / 1000000)).toString() + "m");
        if (num < 1000000000) return ((Math.floor(num / 10000000)).toString() + "m");
        if (num < 10000000000) return ((Math.floor(num / 100000000) / 10.0).toString() + "b");
        if (num < 100000000000) return ((Math.floor(num / 1000000000)).toString() + "b");
        if (num < 1000000000000) return ((Math.floor(num / 10000000000)).toString() + "b");
        return num.toString();
    }
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

if (!String.prototype.pad) {
  String.prototype.pad = function(iWidth, sChar) {
    sChar = ((sChar !== undefined) ? sChar : ('0'));
    return ((this.length >= iWidth) ? (this) : (new Array(iWidth - this.length + 1).join(sChar) + this));
  };
}

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
