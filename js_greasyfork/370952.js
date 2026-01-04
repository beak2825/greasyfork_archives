// ==UserScript==
// @name          Eternity Tower Old Recipe Hider
// @icon          https://www.eternitytower.net/favicon.png
// @namespace     http://mean.cloud/
// @version       1.13
// @description   Hides old recipes you no longer need automatically.
// @match         *://eternitytower.net/*
// @match         *://www.eternitytower.net/*
// @match         http://localhost:3000/*
// @author        psouza4@gmail.com
// @copyright     2018-2023, MeanCloud
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/370952/Eternity%20Tower%20Old%20Recipe%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/370952/Eternity%20Tower%20Old%20Recipe%20Hider.meta.js
// ==/UserScript==


////////////////////////////////////////////////////////////////
////////////// ** SCRIPT GLOBAL INITIALIZATION ** //////////////
function startup() { ET_RecipeHiderMod(); }
////////////////////////////////////////////////////////////////


ET_RecipeHiderMod = function()
{
    //ET.MCMF.WantDebug = true;

    ET.MCMF.Loaded(function()
    {
        ET.MCMF.SubscribeToGameChannel('mining');
        ET.MCMF.SubscribeToGameChannel('woodcutting');
        
        ET.MCMF.PETRecipeHider = [];
        
        Package.meteor.Meteor.call('crafting.fetchRecipes', function(err, res)
        {
            //ET.MCMF.Log(JSON.stringify(jQ.makeArray(res)));
            
            ET.MCMF.PETRecipeHider.AllRecipes = res;

            Blaze._getTemplate("recipeIcon").onRendered(PETRecipeHider_Rendered);

            if (ET.MCMF.GetActiveTab() === "crafting")
                PETRecipeHider_FullList();
        });
        
    }, "ETREcipeHider");
};

PETRecipeHider_Rendered = function()
{
    if (PETRecipeHider_should_hide(this.data.recipe.name))
        this.$(".recipe-container").remove();
};

PETRecipeHider_FullList = function()
{
    jQ("div.recipe-container").each(function()
    {
        try
        {
            if (PETRecipeHider_should_hide(jQ(this).find("div div span.text-capitalize").text().trim().toLowerCase()))
                jQ(this).remove(); // do this so the Search mod won't re-add it
        }
        catch (err) { }
    });
};

PETRecipeHider_MatchRecipe = function(recipe_name_or_id)
{
    ET.MCMF.PETRecipeHider.RecipeResult = undefined;
    
    try
    {
        ET.MCMF.PETRecipeHider.RecipeSearch = recipe_name_or_id.trim().toLowerCase();
        
        if (ET.MCMF.PETRecipeHider.AllRecipes !== undefined)
        {
            jQ.makeArray(ET.MCMF.PETRecipeHider.AllRecipes).forEach(function(currentRecipe, index, array)
            {
                if (ET.MCMF.PETRecipeHider.RecipeResult !== undefined) return;
                if ((currentRecipe.id.trim().toLowerCase() === ET.MCMF.PETRecipeHider.RecipeSearch) || (currentRecipe.name.trim().toLowerCase() === ET.MCMF.PETRecipeHider.RecipeSearch))
                    ET.MCMF.PETRecipeHider.RecipeResult = currentRecipe;
            });
        }
    }
    catch (err) { }
    
    return ET.MCMF.PETRecipeHider.RecipeResult;
};

PETRecipeHider_GetItem = function(item_name_or_id)
{
    let oFoundItem;
    
    jQuery.each([...Package.meteor.global.Accounts.connection._stores.items._getCollection()._collection._docs._map.values()], function()
    {
        if (oFoundItem !== undefined) return;
        if ((this.itemId.trim().toLowerCase() === item_name_or_id) || (this.name.trim().toLowerCase() === item_name_or_id))
            oFoundItem = this;
    });
    
    return oFoundItem;
};

PETRecipeHider_GetSkill = function(skill_name)
{
    let oFoundSkill;
    
    jQuery.each(window.ET.MCMF.GetSkills(), function()
    {
        if (oFoundSkill !== undefined) return;
        if (this.type.trim().toLowerCase() === skill_name.trim().toLowerCase())
            oFoundSkill = this;
    });
    
    return oFoundSkill;
};

PETRecipeHider_LowestWoodcuttingLevel = function(skill_name)
{
    let iLevel = 9999;
    
    let oWoodcuttingData = [...Package.meteor.global.Accounts.connection._stores.woodcutting._getCollection()._collection._docs._map.values()][0];
    
    for (let i = 0; i < 5; i++)
    {
        try
        {
            if (oWoodcuttingData.woodcutters[i].quality >= 80)
                if (iLevel > oWoodcuttingData.woodcutters[i].stats.attack)
                    iLevel = oWoodcuttingData.woodcutters[i].stats.attack;
        }
        catch (err) { }
    }

    return ((iLevel === 9999) ? 0 : iLevel);
};

PETRecipeHider_should_hide = function(recipe_name)
{
    try
    {
        // Map recipe
        let oRecipe           = PETRecipeHider_MatchRecipe(recipe_name);
        
        // Map some skills
        let oCraftingSkill    = PETRecipeHider_GetSkill("crafting");
        //let oAttackSkill      = CInt(PETRecipeHider_GetSkill("attack").level);
        //let oDefenseSkill     = CInt(PETRecipeHider_GetSkill("defense").level);
        //let oMagicSkill       = CInt(PETRecipeHider_GetSkill("magic").level);
        let oMiningSkill      = PETRecipeHider_GetSkill("mining");
        //let oWoodcuttingSkill = PETRecipeHider_GetSkill("woodcutting");
        
        //ET.MCMF.Log("Recipe name: " + oRecipe.name + " (" + recipe_name + ")");
        //ET.MCMF.Log("Mining data: " + JSON.stringify(oMiningData));
        //ET.MCMF.Log("Mining skill: " + JSON.stringify(oMiningSkill));
        //ET.MCMF.Log("Crafting skill: " + JSON.stringify(oCraftingSkill));
        //ET.MCMF.Log(JSON.stringify(oRecipe));
        
        if ((oRecipe.name.toLowerCase().indexOf(" idol")   !== -1) && (oRecipe.requiredCraftingLevel >= 20)) return false; // never hide idols (maple+ idols)
        if ((oRecipe.name.toLowerCase().indexOf(" dagger") !== -1) && (oRecipe.requiredCraftingLevel >= 25)) return false; // never hide daggers (gold+ daggers)
        if ((oRecipe.name.toLowerCase().indexOf(" plate legs") !== -1) && (oRecipe.requiredCraftingLevel >= 25)) return false; // never hide plate legs (gold+ plate legs)            
    
        const playerAbilities = jQ.makeArray(ET.MCMF.GetAbilities());
    
        if (oRecipe.name.toLowerCase() == 'thirsty fangs lv 1')
        {
          let hasAbility = false;
          playerAbilities.forEach((ability) =>
          {
            if ((ability.abilityId == 'thirsty_fangs') && (ability.level >= 1))
            {
              hasAbility = true;
            }
          });
          return hasAbility;
        }
    
        if (oRecipe.name.toLowerCase() == 'thirsty fangs lv 2')
        {
          let hasAbility = false;
          playerAbilities.forEach((ability) =>
          {
            if ((ability.abilityId == 'thirsty_fangs') && (ability.level >= 2))
            {
              hasAbility = true;
            }
          });
          return hasAbility;
        }
      
        if (oRecipe.category === "mining")
        {
            let oMiningData = [...Package.meteor.global.Accounts.connection._stores.mining._getCollection()._collection._docs._map.values()][0];
        
            if ((oMiningSkill.level >= oRecipe.requiredCraftingLevel + 10) && (oCraftingSkill.level >= oRecipe.requiredCraftingLevel + 10))
            {
                try
                {
                    // note: the idols are never going to be hidden because they're worth XP
                  
                    if ((oRecipe.name === "primitive pickaxe")     && (oMiningData.miners[ 0].amount >= 3)) return true;
                    
                    if ((oRecipe.name === "copper pickaxe")        && (oMiningData.miners[ 1].amount >= 3)) return true;
                    if ((oRecipe.name === "copper mining anvil")   && (oMiningData.miners[ 1].amount >= 3)) return true;
                    if ((oRecipe.name === "maple idol")                                                    ) return true;
                    
                    if ((oRecipe.name === "tin pickaxe")           && (oMiningData.miners[ 2].amount >= 3)) return true;
                    if ((oRecipe.name === "tin mining anvil")      && (oMiningData.miners[ 2].amount >= 3)) return true;
                    if ((oRecipe.name === "pine idol")                                                    ) return true;
                    
                    if ((oRecipe.name === "bronze pickaxe")        && (oMiningData.miners[ 3].amount >= 3)) return true;
                    if ((oRecipe.name === "bronze mining anvil")   && (oMiningData.miners[ 3].amount >= 3)) return true;
                    
                    if ((oRecipe.name === "iron pickaxe")          && (oMiningData.miners[ 4].amount >= 3)) return true;
                    if ((oRecipe.name === "iron mining anvil")     && (oMiningData.miners[ 4].amount >= 3)) return true;
                    if ((oRecipe.name === "ash idol")                                                     ) return true;
                    
                    if ((oRecipe.name === "silver pickaxe")        && (oMiningData.miners[ 5].amount >= 3)) return true;
                    if ((oRecipe.name === "silver mining anvil")   && (oMiningData.miners[ 5].amount >= 3)) return true;
                    
                    if ((oRecipe.name === "gold pickaxe")          && (oMiningData.miners[ 6].amount >= 3)) return true;
                    if ((oRecipe.name === "gold mining anvil")     && (oMiningData.miners[ 6].amount >= 3)) return true;
                    if ((oRecipe.name === "maple idol")                                                   ) return true;
                    
                    if ((oRecipe.name === "carbon pickaxe")        && (oMiningData.miners[ 7].amount >= 3)) return true;
                    if ((oRecipe.name === "carbon mining anvil")   && (oMiningData.miners[ 7].amount >= 3)) return true;
                    
                    if ((oRecipe.name === "steel pickaxe")         && (oMiningData.miners[ 8].amount >= 3)) return true;
                    if ((oRecipe.name === "steel mining anvil")    && (oMiningData.miners[ 8].amount >= 3)) return true;
                    if ((oRecipe.name === "cherry idol")                                                  ) return true;
                    
                    if ((oRecipe.name === "platinum pickaxe")      && (oMiningData.miners[ 9].amount >= 3)) return true;
                    if ((oRecipe.name === "platinum mining anvil") && (oMiningData.miners[ 9].amount >= 3)) return true;
                    
                    if ((oRecipe.name === "titanium pickaxe")      && (oMiningData.miners[10].amount >= 3)) return true;
                    if ((oRecipe.name === "titanium mining anvil") && (oMiningData.miners[10].amount >= 3)) return true;
                    if ((oRecipe.name === "elm idol")                                                     ) return true;
                    
                    if ((oRecipe.name === "tungsten pickaxe")      && (oMiningData.miners[11].amount >= 3)) return true;
                    if ((oRecipe.name === "tungsten mining anvil") && (oMiningData.miners[11].amount >= 3)) return true;
                    
                    if ((oRecipe.name === "obsidian pickaxe")      && (oMiningData.miners[12].amount >= 3)) return true;
                    if ((oRecipe.name === "obsidian mining anvil") && (oMiningData.miners[12].amount >= 3)) return true;
                    if ((oRecipe.name === "blue gum idol")                                                ) return true;
                    
                    if ((oRecipe.name === "cobalt pickaxe")        && (oMiningData.miners[13].amount >= 3)) return true;
                    if ((oRecipe.name === "cobalt mining anvil")   && (oMiningData.miners[13].amount >= 3)) return true;
                    
                    if ((oRecipe.name === "mithril pickaxe")       && (oMiningData.miners[14].amount >= 3)) return true;
                    if ((oRecipe.name === "mithril mining anvil")  && (oMiningData.miners[14].amount >= 3)) return true;
                    if ((oRecipe.name === "denya idol")                                                   ) return true;
                    
                    if ((oRecipe.name === "adamantium pickaxe")    && (oMiningData.miners[15].amount >= 3)) return true;
                    if ((oRecipe.name === "adamantium mining anvil") && (oMiningData.miners[15].amount >= 3)) return true;
                    
                    if ((oRecipe.name === "orichalcum pickaxe")    && (oMiningData.miners[16].amount >= 3)) return true;
                    if ((oRecipe.name === "orichalcum mining anvil") && (oMiningData.miners[16].amount >= 3)) return true;
                    if ((oRecipe.name === "hickory idol")                                                 ) return true;
                    
                    if ((oRecipe.name === "meteorite pickaxe")     && (oMiningData.miners[17].amount >= 3)) return true;
                    if ((oRecipe.name === "meteorite mining anvil") && (oMiningData.miners[17].amount >= 3)) return true;
                    
                    if ((oRecipe.name === "fairy steel pickaxe")   && (oMiningData.miners[18].amount >= 3)) return true;
                    if ((oRecipe.name === "fairy steel mining anvil") && (oMiningData.miners[18].amount >= 3)) return true;
                    if ((oRecipe.name === "poplar idol")                                                  ) return true;
                    
                    if ((oRecipe.name === "elven steel pickaxe")   && (oMiningData.miners[19].amount >= 3)) return true;
                    if ((oRecipe.name === "elven steel mining anvil") && (oMiningData.miners[19].amount >= 3)) return true;
                    
                    // never hide these tiers
                    
                    //if ((oRecipe.name === "cursed pickaxe")        && (oMiningData.miners[20].amount >= 3)) return true;
                    //if ((oRecipe.name === "cursed mining anvil")   && (oMiningData.miners[20].amount >= 3)) return true;
                    //if ((oRecipe.name === "willow idol")                                                  ) return true;
                    
                    //if ((oRecipe.name === "darksteel pickaxe")     && (oMiningData.miners[21].amount >= 3)) return true;
                    //if ((oRecipe.name === "darksteel mining anvil") && (oMiningData.miners[21].amount >= 3)) return true;
                    
                    //if ((oRecipe.name === "radiant pickaxe")       && (oMiningData.miners[22].amount >= 3)) return true;
                    //if ((oRecipe.name === "radiant mining anvil")  && (oMiningData.miners[22].amount >= 3)) return true;
                    
                    //if ((oRecipe.name === "astral pickaxe")        && (oMiningData.miners[23].amount >= 3)) return true;
                    //if ((oRecipe.name === "astral mining anvil")   && (oMiningData.miners[23].amount >= 3)) return true;
                    
                    //if ((oRecipe.name === "titanfoil pickaxe")      && (oMiningData.miners[24].amount >= 3)) return true;
                    //if ((oRecipe.name === "titanfoil mining anvil") && (oMiningData.miners[24].amount >= 3)) return true;
                    
                    //if ((oRecipe.name === "relicrock pickaxe")      && (oMiningData.miners[25].amount >= 3)) return true;
                    //if ((oRecipe.name === "relicrock mining anvil") && (oMiningData.miners[25].amount >= 3)) return true;
                    
                    //if ((oRecipe.name === "eternium pickaxe")       && (oMiningData.miners[26].amount >= 3)) return true;
                    //if ((oRecipe.name === "eternium mining anvil")  && (oMiningData.miners[26].amount >= 3)) return true;
                }
                catch (err) { }
            }
        }
        
        if (oRecipe.category === "woodcutting")
        {
            if (oRecipe.name.toLowerCase() == 'cursed axe') return false;
            if (oRecipe.name.toLowerCase() == 'radiant axe') return false;
            if (oRecipe.name.toLowerCase() == 'astral axe') return false;
            if (oRecipe.name.toLowerCase() == 'titanfoil axe') return false;
            if (oRecipe.name.toLowerCase() == 'relicrock axe') return false;
            if (oRecipe.name.toLowerCase() == 'eternium axe') return false;
            
            let iLowestWoodcuttingLevel = PETRecipeHider_LowestWoodcuttingLevel();
            
            const localGameConsts = (IsValid(window) && IsValid(window.gameConstants)) ? window.gameConstants : (IsValid(unsafeWindow) && IsValid(unsafeWindow.gameConstants)) ? unsafeWindow.gameConstants : { };
            if (localGameConsts) {
              const localGameBaseItem = localGameConsts.ITEMS[oRecipe.produces];
              if (localGameBaseItem) {
                return (localGameBaseItem.stats.attack < iLowestWoodcuttingLevel);
              }
            }
            
            return false;
        }

        if (endsWith(oRecipe.name, " furnace"))
        {
            let iBestFurnaceTier = 0;
            jQuery.each([...Package.meteor.global.Accounts.connection._stores.items._getCollection()._collection._docs._map.values()], function()
            {
                if (endsWith(this.itemId, "_furnace"))
                {
                    const localGameConsts = (IsValid(window) && IsValid(window.gameConstants)) ? window.gameConstants : (IsValid(unsafeWindow) && IsValid(unsafeWindow.gameConstants)) ? unsafeWindow.gameConstants : { };
                    const localGameBaseItem = localGameConsts.ITEMS[this.itemId];

                    if (iBestFurnaceTier < CInt(localGameBaseItem.tier))
                    {
                        iBestFurnaceTier = CInt(localGameBaseItem.tier);
                    }
                }
            });
            if ((oRecipe.name === "stone furnace")       && (iBestFurnaceTier >=  1)) return true;
            if ((oRecipe.name === "copper furnace")      && (iBestFurnaceTier >=  2)) return true;
            if ((oRecipe.name === "tin furnace")         && (iBestFurnaceTier >=  3)) return true;
            if ((oRecipe.name === "bronze furnace")      && (iBestFurnaceTier >=  4)) return true;
            if ((oRecipe.name === "iron furnace")        && (iBestFurnaceTier >=  5)) return true;
            if ((oRecipe.name === "silver furnace")      && (iBestFurnaceTier >=  6)) return true;
            if ((oRecipe.name === "gold furnace")        && (iBestFurnaceTier >=  7)) return true;
            if ((oRecipe.name === "carbon furnace")      && (iBestFurnaceTier >=  8)) return true;
            if ((oRecipe.name === "steel furnace")       && (iBestFurnaceTier >=  9)) return true;
            if ((oRecipe.name === "platinum furnace")    && (iBestFurnaceTier >= 10)) return true;
            if ((oRecipe.name === "titanium furnace")    && (iBestFurnaceTier >= 11)) return true;
            if ((oRecipe.name === "tungsten furnace")    && (iBestFurnaceTier >= 12)) return true;
            if ((oRecipe.name === "obsidian furnace")    && (iBestFurnaceTier >= 13)) return true;
            if ((oRecipe.name === "cobalt furnace")      && (iBestFurnaceTier >= 14)) return true;
            if ((oRecipe.name === "mithril furnace")     && (iBestFurnaceTier >= 15)) return true;
            if ((oRecipe.name === "adamantium furnace")  && (iBestFurnaceTier >= 16)) return true;
            if ((oRecipe.name === "orichalcum furnace")  && (iBestFurnaceTier >= 17)) return true;
            if ((oRecipe.name === "meteorite furnace")   && (iBestFurnaceTier >= 18)) return true;
            if ((oRecipe.name === "fairy steel furnace") && (iBestFurnaceTier >= 19)) return true;
            if ((oRecipe.name === "elven steel furnace") && (iBestFurnaceTier >= 20)) return true;
            if ((oRecipe.name === "cursed furnace")      && (iBestFurnaceTier >= 21)) return true;
            if ((oRecipe.name === "darksteel furnace")   && (iBestFurnaceTier >= 22)) return true;
            if ((oRecipe.name === "radiant furnace")     && (iBestFurnaceTier >= 23)) return true;
            if ((oRecipe.name === "astral furnace")      && (iBestFurnaceTier >= 24)) return true;
            if ((oRecipe.name === "titanfoil furnace")   && (iBestFurnaceTier >= 25)) return true;
            if ((oRecipe.name === "relicrock furnace")   && (iBestFurnaceTier >= 26)) return true;
            if ((oRecipe.name === "eternium furnace")    && (iBestFurnaceTier >= 27)) return true;
        }
        
        if (endsWith(oRecipe.id, "_bar"))
        {
            let bars = PETRecipeHider_GetItem(oRecipe.name); 
            
            if (bars !== undefined)
            {
                if ((oRecipe.requiredCraftingLevel >= 20) && (CInt(bars.amount) >= 100) && (oCraftingSkill.level >= oRecipe.requiredCraftingLevel + 10))
                    return true;
                else if ((oRecipe.requiredCraftingLevel < 20) && (oCraftingSkill.level >= oRecipe.requiredCraftingLevel + 10))
                    return true;
            }
        }
        
        if ((oRecipe.category === "combat") && (!endsWith(oRecipe.name, " amulet")))
        {
            if ((startsWith(oRecipe.name, "copper "))      && (oCraftingSkill.level >=  10)) return true;
            if ((startsWith(oRecipe.name, "tin "))         && (oCraftingSkill.level >=  15)) return true;
            if ((startsWith(oRecipe.name, "bronze "))      && (oCraftingSkill.level >=  20)) return true;
            if ((startsWith(oRecipe.name, "iron "))        && (oCraftingSkill.level >=  25)) return true;
            if ((startsWith(oRecipe.name, "silver "))      && (oCraftingSkill.level >=  30)) return true;
            if ((startsWith(oRecipe.name, "gold "))        && (oCraftingSkill.level >=  35)) return true;
            if ((startsWith(oRecipe.name, "carbon "))      && (oCraftingSkill.level >=  40)) return true;
            if ((startsWith(oRecipe.name, "steel "))       && (oCraftingSkill.level >=  45)) return true;
            if ((startsWith(oRecipe.name, "platinum "))    && (oCraftingSkill.level >=  50)) return true;
            if ((startsWith(oRecipe.name, "titanium "))    && (oCraftingSkill.level >=  55)) return true;
            if ((startsWith(oRecipe.name, "tungsten "))    && (oCraftingSkill.level >=  60)) return true;
            if ((startsWith(oRecipe.name, "obsidian "))    && (oCraftingSkill.level >=  65)) return true;
            if ((startsWith(oRecipe.name, "cobalt "))      && (oCraftingSkill.level >=  70)) return true;
            if ((startsWith(oRecipe.name, "mithril "))     && (oCraftingSkill.level >=  75)) return true;
            if ((startsWith(oRecipe.name, "adamantium "))  && (oCraftingSkill.level >=  80)) return true;
            if ((startsWith(oRecipe.name, "orichalcum "))  && (oCraftingSkill.level >=  85)) return true;
            if ((startsWith(oRecipe.name, "meteorite "))   && (oCraftingSkill.level >=  90)) return true;
            if ((startsWith(oRecipe.name, "fairy steel ")) && (oCraftingSkill.level >=  95)) return true;
            if ((startsWith(oRecipe.name, "elven steel ")) && (oCraftingSkill.level >= 100)) return true;
            // never hide these tiers
            /*
            if ((startsWith(oRecipe.name, "cursed "))      && (oCraftingSkill.level >= 105)) return true;
            if ((startsWith(oRecipe.name, "darksteel "))   && (oCraftingSkill.level >= 110)) return true;
            if ((startsWith(oRecipe.name, "radiant "))     && (oCraftingSkill.level >= 115)) return true;
            if ((startsWith(oRecipe.name, "astral "))      && (oCraftingSkill.level >= 120)) return true;
            if ((startsWith(oRecipe.name, "titanfoil "))   && (oCraftingSkill.level >= 125)) return true;
            if ((startsWith(oRecipe.name, "relicrock "))   && (oCraftingSkill.level >= 130)) return true;
            if ((startsWith(oRecipe.name, "eternium "))    && (oCraftingSkill.level >= 135)) return true;
            */
            
            if ((startsWith(oRecipe.name, "pine "))        && (oCraftingSkill.level >=  10)) return true;
            if ((startsWith(oRecipe.name, "beech "))       && (oCraftingSkill.level >=  15)) return true;
            if ((startsWith(oRecipe.name, "ash "))         && (oCraftingSkill.level >=  20)) return true;
            if ((startsWith(oRecipe.name, "oak "))         && (oCraftingSkill.level >=  25)) return true;
            if ((startsWith(oRecipe.name, "maple "))       && (oCraftingSkill.level >=  30)) return true;
            if ((startsWith(oRecipe.name, "walnut "))      && (oCraftingSkill.level >=  35)) return true;
            if ((startsWith(oRecipe.name, "cherry "))      && (oCraftingSkill.level >=  40)) return true;
            if ((startsWith(oRecipe.name, "mahogany "))    && (oCraftingSkill.level >=  45)) return true;
            if ((startsWith(oRecipe.name, "elm "))         && (oCraftingSkill.level >=  50)) return true;
            if ((startsWith(oRecipe.name, "black "))       && (oCraftingSkill.level >=  55)) return true;
            if ((startsWith(oRecipe.name, "blue gum "))    && (oCraftingSkill.level >=  60)) return true;
            if ((startsWith(oRecipe.name, "cedar "))       && (oCraftingSkill.level >=  65)) return true;
            if ((startsWith(oRecipe.name, "denya "))       && (oCraftingSkill.level >=  70)) return true;
            if ((startsWith(oRecipe.name, "gombe "))       && (oCraftingSkill.level >=  75)) return true;
            if ((startsWith(oRecipe.name, "hickory "))     && (oCraftingSkill.level >=  80)) return true;
            if ((startsWith(oRecipe.name, "larch "))       && (oCraftingSkill.level >=  85)) return true;
            if ((startsWith(oRecipe.name, "poplar "))      && (oCraftingSkill.level >=  90)) return true;
            if ((startsWith(oRecipe.name, "tali "))        && (oCraftingSkill.level >=  95)) return true;
            if ((startsWith(oRecipe.name, "willow "))      && (oCraftingSkill.level >= 100)) return true;
            // never hide these tiers
            /*
            if ((startsWith(oRecipe.name, "teak "))        && (oCraftingSkill.level >= 105)) return true;
            if ((startsWith(oRecipe.name, "ebony "))       && (oCraftingSkill.level >= 110)) return true;
            if ((startsWith(oRecipe.name, "fiery "))       && (oCraftingSkill.level >= 115)) return true;
            if ((startsWith(oRecipe.name, "tamarind "))    && (oCraftingSkill.level >= 120)) return true;
            if ((startsWith(oRecipe.name, "magic "))       && (oCraftingSkill.level >= 125)) return true;
            if ((startsWith(oRecipe.name, "petrified "))   && (oCraftingSkill.level >= 130)) return true;
            if ((startsWith(oRecipe.name, "ancient "))     && (oCraftingSkill.level >= 135)) return true;
            */
        }
        
        if (endsWith(oRecipe.name, " staff"))
        {
            if ((oRecipe.name === "pine staff")     && (oCraftingSkill.level >= 10)) return true;
            if ((oRecipe.name === "beech staff")    && (oCraftingSkill.level >= 15)) return true;
            if ((oRecipe.name === "ash staff")      && (oCraftingSkill.level >= 20)) return true;
            if ((oRecipe.name === "oak staff")      && (oCraftingSkill.level >= 25)) return true;
            if ((oRecipe.name === "maple staff")    && (oCraftingSkill.level >= 30)) return true;
            if ((oRecipe.name === "walnut staff")   && (oCraftingSkill.level >= 35)) return true;
            if ((oRecipe.name === "cherry staff")   && (oCraftingSkill.level >= 40)) return true;
            if ((oRecipe.name === "mahogany staff") && (oCraftingSkill.level >= 45)) return true;
            if ((oRecipe.name === "elm staff")      && (oCraftingSkill.level >= 50)) return true;
            if ((oRecipe.name === "black staff")    && (oCraftingSkill.level >= 55)) return true;
            if ((oRecipe.name === "blue gum staff") && (oCraftingSkill.level >= 60)) return true;
            if ((oRecipe.name === "cedar staff")    && (oCraftingSkill.level >= 65)) return true;
            if ((oRecipe.name === "denya staff")    && (oCraftingSkill.level >= 70)) return true;
            if ((oRecipe.name === "gombe staff")    && (oCraftingSkill.level >= 75)) return true;
            if ((oRecipe.name === "hickory staff")  && (oCraftingSkill.level >= 80)) return true;
            if ((oRecipe.name === "larch staff")    && (oCraftingSkill.level >= 85)) return true;
            if ((oRecipe.name === "poplar staff")   && (oCraftingSkill.level >= 90)) return true;
            if ((oRecipe.name === "tali staff")     && (oCraftingSkill.level >= 95)) return true;
            // willow and teak have no upgrades
        }
        
        if (endsWith(recipe_name, " amulet"))
        {
            if ((oRecipe.name === "primitive amulet") && (oCraftingSkill.level >= 10)) return true; // anything, even copper, is better than primitive
            
            let amu;
            amu = PETRecipeHider_GetItem("jade amulet"); if ((amu !== undefined) && (recipe_name === "jade amulet")) return true;
            amu = PETRecipeHider_GetItem("lapis lazuli amulet"); if ((amu !== undefined) && (recipe_name === "lapis lazuli amulet")) return true;
            amu = PETRecipeHider_GetItem("sapphire amulet"); if ((amu !== undefined) && (recipe_name === "sapphire amulet")) return true;
            amu = PETRecipeHider_GetItem("emerald amulet"); if ((amu !== undefined) && (recipe_name === "emerald amulet")) return true;
            amu = PETRecipeHider_GetItem("ruby amulet"); if ((amu !== undefined) && (recipe_name === "ruby amulet")) return true;
            amu = PETRecipeHider_GetItem("tanzanite amulet"); if ((amu !== undefined) && (recipe_name === "tanzanite amulet")) return true;
            amu = PETRecipeHider_GetItem("fire opal amulet"); if ((amu !== undefined) && (recipe_name === "fire opal amulet")) return true;
            
            // EMERALD               = health
            // JADE                  = accuracy
            // LAPIS, copper, gold   = defense + health
            // SAPPHIRE, tin, carbon = magic power + magic armor
            // RUBY, bronze, steel   = damage + accuracy
            // TANZANITE, silver     = health + defense + accuracy + magic power ('everything')
            let amu_Defense = PETRecipeHider_GetItem("lapis lazuli amulet");
            if (amu_Defense === undefined) amu_Defense = PETRecipeHider_GetItem("fairy steel amulet");
            if (amu_Defense === undefined) amu_Defense = PETRecipeHider_GetItem("mithril amulet");
            if (amu_Defense === undefined) amu_Defense = PETRecipeHider_GetItem("titanium amulet");
            if (amu_Defense === undefined) amu_Defense = PETRecipeHider_GetItem("gold amulet");
            if (amu_Defense === undefined) amu_Defense = PETRecipeHider_GetItem("copper amulet");
            let amu_Magic = PETRecipeHider_GetItem("sapphire amulet");
            if (amu_Magic === undefined) amu_Magic = PETRecipeHider_GetItem("elven steel amulet");
            if (amu_Magic === undefined) amu_Magic = PETRecipeHider_GetItem("adamantium amulet");
            if (amu_Magic === undefined) amu_Magic = PETRecipeHider_GetItem("tungsten amulet");
            if (amu_Magic === undefined) amu_Magic = PETRecipeHider_GetItem("carbon amulet");
            if (amu_Magic === undefined) amu_Magic = PETRecipeHider_GetItem("tin amulet");
            let amu_Damage  = PETRecipeHider_GetItem("ruby amulet");
            if (amu_Damage === undefined) amu_Damage = PETRecipeHider_GetItem("cursed amulet");
            if (amu_Damage === undefined) amu_Damage = PETRecipeHider_GetItem("orichalcum amulet");
            if (amu_Damage === undefined) amu_Damage = PETRecipeHider_GetItem("obsidian amulet");
            if (amu_Damage === undefined) amu_Damage = PETRecipeHider_GetItem("steel amulet");
            if (amu_Damage === undefined) amu_Damage = PETRecipeHider_GetItem("bronze amulet");
            let amu_General = PETRecipeHider_GetItem("tanzanite amulet");
            if (amu_General === undefined) amu_General = PETRecipeHider_GetItem("meteorite amulet");
            if (amu_General === undefined) amu_General = PETRecipeHider_GetItem("cobalt amulet");
            if (amu_General === undefined) amu_General = PETRecipeHider_GetItem("platinum amulet");
            if (amu_General === undefined) amu_General = PETRecipeHider_GetItem("silver amulet");
            
            if ((oRecipe.name === "copper amulet") && ((amu_Defense !== undefined) || (oCraftingSkill.level >= 32))) return true;
            if ((oRecipe.name === "tin amulet") && ((amu_Magic !== undefined) || (oCraftingSkill.level >= 35))) return true;
            if ((oRecipe.name === "bronze amulet") && ((amu_Damage !== undefined) || (oCraftingSkill.level >= 40))) return true;
            if ((oRecipe.name === "silver amulet") && ((amu_General !== undefined) || (oCraftingSkill.level >= 45))) return true;
            
            if ((oRecipe.name === "gold amulet") && ((amu_Defense !== undefined) || (oCraftingSkill.level >= 50))) return true;
            if ((oRecipe.name === "carbon amulet") && ((amu_Magic !== undefined) || (oCraftingSkill.level >= 55))) return true;
            if ((oRecipe.name === "steel amulet") && ((amu_Damage !== undefined) || (oCraftingSkill.level >= 60))) return true;
            if ((oRecipe.name === "platinum amulet") && ((amu_General !== undefined) || (oCraftingSkill.level >= 65))) return true;
            
            if ((oRecipe.name === "titanium amulet") && ((amu_Defense !== undefined) || (oCraftingSkill.level >= 70))) return true;
            if ((oRecipe.name === "tungsten amulet") && ((amu_Magic !== undefined) || (oCraftingSkill.level >= 75))) return true;
            if ((oRecipe.name === "obsidian amulet") && ((amu_Damage !== undefined) || (oCraftingSkill.level >= 80))) return true;
            if ((oRecipe.name === "cobalt amulet") && ((amu_General !== undefined) || (oCraftingSkill.level >= 85))) return true;
            
            if ((oRecipe.name === "mithril amulet") && ((amu_Defense !== undefined) || (oCraftingSkill.level >= 90))) return true;
            if ((oRecipe.name === "adamantium amulet") && ((amu_Magic !== undefined) || (oCraftingSkill.level >= 95))) return true;
            if ((oRecipe.name === "orichalcum amulet") && ((amu_Damage !== undefined) || (oCraftingSkill.level >= 100))) return true;
            if ((oRecipe.name === "meteorite amulet") && ((amu_General !== undefined) || (oCraftingSkill.level >= 105))) return true;
            
            if ((oRecipe.name === "fairy steel amulet") && ((amu_Defense !== undefined) || (oCraftingSkill.level >= 110))) return true;
            if ((oRecipe.name === "elven steel amulet") && ((amu_Magic !== undefined) || (oCraftingSkill.level >= 115))) return true;
            if ((oRecipe.name === "cursed amulet") && ((amu_Damage !== undefined) || (oCraftingSkill.level >= 120))) return true;
        }
    }
    catch (err) { ET.MCMF.Log("Error evaluating this recipe: " + err); }
        
    return false;
};

PETPQ_LookupItem = function(sID)
{
	let res = null;

    // ET.MCMF.ItemManager._collection._docs._map
	jQ.each([...Package.meteor.global.Accounts.connection._stores.items._getCollection()._collection._docs._map.values()], function()
	{
		if (this._id.toLowerCase().trim() == sID.toLowerCase().trim())
		{
			res = this;
		}
	});

	return res;
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
            try {
                if (window.location.href.indexOf("/newCombat") !== -1) {
                    return true; }
            }
            catch (err) {
            }
            
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
        
        InitGameTriggers: function()
        {
            if ((Package.meteor.Meteor === undefined) || (Package.meteor.Meteor.connection === undefined) || (Package.meteor.Meteor.connection._stream === undefined) || (Template.currentBattleUi === undefined))
            {
                setTimeout(window.ET.MCMF.InitGameTriggers, 100);
                return;
            }
            
            Blaze._getTemplate("battleUnit").onRendered(function()
            {
                if ((this.data !== undefined) && (this.data.unit !== undefined))
                {
                    window.ET.MCMF.BattleUnitList.push(this);
                    if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- Template.battleUnit.onRendered triggered -->");
                }
            });
            
            Template.currentBattleUi.onCreated(function()
            {
                window.ET.MCMF.BattleUITemplate = this;
                if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- Template.currentBattleUi.onCreated triggered -->");
            });
            
            Template.currentBattleUi.onDestroyed(function()
            {
                window.ET.MCMF.BattleUITemplate = undefined;
                window.ET.MCMF.BattleUnitList = [];
                if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- Template.currentBattleUi.onDestroyed triggered -->");
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
                                battleSocket.on('tick', function(oAllData)
                                {
                                    let battleData = window.ET.MCMF.LiveBattleData();                                    
                                    let currentFloorRoom = CInt(battleData.floor).toFixed(0) + "." + CInt(battleData.room).toFixed(0);
                                    
                                    if (window.ET.MCMF.BattleFloorRoom !== currentFloorRoom)
                                    {
                                        window.ET.MCMF.BattleFloorRoom = currentFloorRoom;
                                        window.ET.MCMF.BattleFirstFrame = undefined;
                                    }
                                    
                                    if (window.ET.MCMF.BattleFirstFrame === undefined)
                                        window.ET.MCMF.BattleFirstFrame = battleData;
                                    
                                    if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- triggering ET:combatTick -->");
                                    window.ET.MCMF.EventTrigger("ET:combatTick");
                                });
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

                            if (window.ET.MCMF.WantDebug) window.ET.MCMF.Log("<-- triggering ET:combat" + ((oMeteorData.fields.win) ? ("Won") : ("Lost")) + " -->");
                            window.ET.MCMF.EventTrigger("ET:combat" + ((oMeteorData.fields.win) ? ("Won") : ("Lost")));
                        }
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
