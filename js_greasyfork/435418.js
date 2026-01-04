// ==UserScript==
// @name         Melvor Action Queue
// @version      1.0.5
// @description  Adds an interface to queue up actions based on triggers you set
// @author       8992
// @author       Kimen
// @match        https://*.melvoridle.com/*
// @exclude      https://wiki.melvoridle.com/*
// @grant        none
// @namespace    http://tampermonkey.net/
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/435418/Melvor%20Action%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/435418/Melvor%20Action%20Queue.meta.js
// ==/UserScript==
 
let isVisible = false;
let currentActionIndex = 0;
let triggerCheckInterval = null;
let nameIncrement = 0;
let queueLoop = false;
let queuePause = false;
let manageMasteryInterval = null;
let masteryConfigChanges = { skill: null };
const lvlIndex = {};
const masteryClone = {};
const masteryConfig = {};
const actionQueueArray = [];
const shop = {};
const tooltips = {};
const validInputs = {
  A: [null, null, null],
  B: [null, null, null, null],
  C: [null, null, null, null],
};
let currentlyEditing = { id: null, type: null };
const pageIndex = {
  Woodcutting: 0,
  Fishing: 7,
  Firemaking: 8,
  Cooking: 9,
  Mining: 10,
  Smithing: 11,
  Combat: 13,
  Thieving: 14,
  Farming: 15,
  Fletching: 16,
  Crafting: 17,
  Runecrafting: 18,
  Herblore: 19,
  Agility: 20,
  Summoning: 28,
  Astrology: 31
};
 
function checkAmmoQty(id) {
  const set = player.equipmentSets.find((a) => a.slots.Quiver.item.id == id);
  return set ? set.slots.Quiver.quantity : 0;
}
 
function checkFoodQty(id) {
  const food = player.food.slots.find((a) => a.item.id == id);
  return food ? food.quantity : 0;
}
 
function actionTab() {
  if (!isVisible) {
    changePage(3);
    $("#settings-container").attr("class", "content d-none");
    $("#header-title").text("Action Queue");
    $("#header-icon").attr("src", "assets/media/skills/prayer/mystic_lore.svg");
    $("#header-theme").attr("class", "content-header bg-combat");
    $("#page-header").attr("class", "bg-combat");
    document.getElementById("action-queue-container").style.display = "";
    isVisible = true;
  }
}
 
function hideActionTab() {
  if (isVisible) {
    document.getElementById("action-queue-container").style.display = "none";
    isVisible = false;
  }
}
 
const options = {
  //trigger options for dropdown menus
  triggers: {
    Idle: null,
    "Item Quantity": {},
    "Skill Level": {},
    "Skill XP": {},
    "Mastery Level": {
      Agility: {},
      Astrology: {},
      Cooking: {},
      Crafting: {},
      Farming: {},
      Firemaking: {},
      Fishing: {},
      Fletching: {},
      Herblore: {},
      Mining: {},
      Runecrafting: {},
      Smithing: {},
      Summoning: {},
      Thieving: {},
      Woodcutting: {},
    },
    "Mastery Pool %": {},
    "Pet Unlocked": {},
    "Equipped Item Quantity": {},
    "Prayer Points": { "≥": "num", "≤": "num" },
    "Potion Depleted": {
      Agility: null,
      Astrology: null,
      Combat: null,
      Cooking: null,
      Crafting: null,
      Farming: null,
      Firemaking: null,
      Fishing: null,
      Fletching: null,
      Herblore: null,
      Mining: null,
      Runecrafting: null,
      Smithing: null,
      Summoning: null,
      Thieving: null,
      Woodcutting: null,
    },
    "Enemy in Combat": {},
  },
  //action options for dropdown menus
  actions: {
    "Start Skill": {
      Agility: null,
      Astrology: {},
      Cooking: {},
      Crafting: {},
      Firemaking: {},
      Fishing: {},
      Fletching: {},
      Herblore: {},
      Magic: {},
      Mining: {},
      Runecrafting: {},
      Smithing: {},
      Summoning: {},
      Thieving: {},
      Woodcutting: {},
    },
    "Start Combat": {
      "Slayer Task": null,
    },
    "Change Attack Style": { "Select Spell": { Normal: {}, Curse: {}, Aurora: {}, Ancient: {} } },
    "Switch Equipment Set": { 1: null, 2: null, 3: null },
    "Equip Item": {},
    "Equip Passive": {},
    "Unequip Item": {},
    "Buy Item": {},
    "Sell Item": {},
    "Use Potion": {},
    "Activate Prayers": {},
    "Build Agility Obstacle": {},
    "Remove Agility Obstacle": {},
  },
};
 
function setTrigger(category, name, greaterThan, masteryItem, number) {
  const itemID = items.findIndex((a) => a.name == name);
  number = parseInt(number, 10);
  switch (category) {
    case "Idle":
      return () => {
        return !combatManager.isInCombat && offline.skill == null;
      };
    case "Item Quantity":
      if (greaterThan == "≥") {
        return () => {
          return getBankQty(itemID) >= number;
        };
      }
      return () => {
        return getBankQty(itemID) <= number;
      };
    case "Prayer Points":
      if (name == "≥") {
        return () => {
          return player.prayerPoints >= number;
        };
      }
      return () => {
        return player.prayerPoints <= number;
      };
    case "Skill Level": {
      const xp = exp.level_to_xp(number);
      return () => {
        return skillXP[CONSTANTS.skill[name]] >= xp;
      };
    }
    case "Skill XP":
      return () => {
        return skillXP[CONSTANTS.skill[name]] >= number;
      };
    case "Equipped Item Quantity":
      if (items.filter((a) => a.canEat).find((a) => a.name == name)) {
        return () => {
          return checkFoodQty(itemID) <= number;
        };
      }
      if (items.filter((a) => a.type == "Familiar").find((a) => a.name == name)) {
        return () => {
          let summonSlots = player.equipment.slotArray.slice(-2);
          let slot = summonSlots.findIndex((a) => a.item.id == itemID);
          return (slot >= 0 ? summonSlots[slot].quantity : 0) <= number;
        };
      }
      return () => {
        return checkAmmoQty(itemID) <= number;
      };
    case "Mastery Level":
      let masteryID = fetchMasteryID(name, masteryItem);
      return () => {
        return getMasteryLevel(CONSTANTS.skill[name], masteryID) >= number;
      };
    case "Pet Unlocked": {
      const petID = PETS.findIndex((pet) => {
        const re = new RegExp(`^${name.split(" (")[0]}`, "g");
        return re.test(pet.name);
      });
      return () => {
        return petUnlocked[petID];
      };
    }
    case "Mastery Pool %": {
      const skill = CONSTANTS.skill[name];
      return () => {
        return getMasteryPoolProgress(skill) >= number;
      };
    }
    case "Potion Depleted":
      return () => {
        return herbloreBonuses[pageIndex[name]].charges <= 0;
      };
    case "Enemy in Combat": {
      const monsterID = MONSTERS.findIndex((a) => a.name == name);
      return () => {
        return combatManager.isInCombat && combatManager.selectedMonster == monsterID;
      };
    }
  }
}
 
function fetchMasteryID(skillName, itemName) {
  const itemID = items.findIndex((a) => a.name == itemName);
  let masteryID = itemID >= 0 && items[itemID].masteryID ? items[itemID].masteryID[1] : null;
  switch (skillName) {
    case "Cooking":
      masteryID = cookingItems.find((a) => a.itemID == itemID).cookingID;
      break;
    case "Herblore":
      masteryID = herbloreItemData.findIndex((a) => a.name == itemName);
      break;
    case "Thieving":
      masteryID = Thieving.npcs.find((a) => a.name == itemName).id;
      break;
    case "Agility":
      masteryID = agilityObstacles.findIndex((a) => a.name == itemName);
      break;
  }
  return masteryID;
}
 
function setAction(actionCategory, actionName, skillItem, skillItem2, qty) {
  qty = parseInt(qty, 10);
  const itemID = items.findIndex((a) => a.name == actionName);
  switch (actionCategory) {
    case "Start Skill":
      return setSkillAction(actionName, skillItem, skillItem2);
    case "Start Combat": {
      //slayer task selection
      if (actionName == "Slayer Task") {
        return () => {
          if (combatManager.slayerTask.killsLeft > 0) {
            const mID = combatManager.slayerTask.monster.id;
            const areaData = [...areaMenus.combat.areas, ...areaMenus.slayer.areas].find((a) =>
              a.monsters.includes(mID)
            );
            if (combatManager.isInCombat && combatManager.selectedMonster == mID) return true;
            combatManager.stopCombat();
            combatManager.selectMonster(mID, areaData);
            return true;
          }
          return false;
        };
      }
      //dungeon selection
      const dungeonIndex = DUNGEONS.findIndex((a) => a.name == actionName);
      if (dungeonIndex >= 0) {
        return () => {
          if (
            DUNGEONS[dungeonIndex].requiresCompletion === undefined ||
            dungeonCompleteCount[DUNGEONS[dungeonIndex].requiresCompletion] >= 1
          ) {
            combatManager.selectDungeon(dungeonIndex);
            return true;
          }
          return false;
        };
      }
      //regular monster selection
      const monsterIndex = MONSTERS.findIndex((a) => a.name == actionName);
      const areaData = [...areaMenus.combat.areas, ...areaMenus.slayer.areas].find((a) =>
        a.monsters.includes(monsterIndex)
      );
      return () => {
        if (checkRequirements(areaData.entryRequirements)) {
          if (!(combatManager.isInCombat && combatManager.selectedMonster == monsterIndex))
            combatManager.selectMonster(monsterIndex, areaData);
          return true;
        }
        return false;
      };
    }
    case "Change Attack Style": {
      if (actionName == "Select Spell") {
        switch (skillItem) {
          case "Normal":
            return () => {
              const spellID = SPELLS.findIndex((a) => a.name == skillItem2);
              //check level req
              if (skillLevel[CONSTANTS.skill.Magic] < SPELLS[spellID].magicLevelRequired) return false;
              player.toggleSpell(spellID);
              return true;
            };
          case "Curse":
            return () => {
              const spellID = CURSES.findIndex((a) => a.name == skillItem2);
              //check level req
              if (skillLevel[CONSTANTS.skill.Magic] < CURSES[spellID].magicLevelRequired) return false;
              player.toggleCurse(spellID);
              return true;
            };
          case "Aurora":
            return () => {
              const spellID = AURORAS.findIndex((a) => a.name == skillItem2);
              //check level req
              if (skillLevel[CONSTANTS.skill.Magic] < AURORAS[spellID].magicLevelRequired) return false;
              //check item req
              if (
                AURORAS[spellID].requiredItem >= 0 &&
                !player.equipment.slotArray.map((a) => a.item.id).includes(AURORAS[spellID].requiredItem)
              )
                return false;
              player.toggleSpellAurora(spellID);
              return true;
            };
          case "Ancient":
            return () => {
              const spellID = ANCIENT.findIndex((a) => a.name == skillItem2);
              //check level req
              if (skillLevel[CONSTANTS.skill.Magic] < ANCIENT[spellID].magicLevelRequired) return false;
              //check dungeon req
              if (
                dungeonCompleteCount[ANCIENT[spellID].requiredDungeonCompletion[0]] <
                ANCIENT[spellID].requiredDungeonCompletion[1]
              )
                return false;
              player.toggleSpellAncient(spellID);
              return true;
            };
        }
      }
      const style = CONSTANTS.attackStyle[actionName];
      return () => {
        if (player.attackType == "magic") {
          if (style < 6) return false;
        } else if (player.attackType === "ranged") {
          if (style > 5 || style < 3) return false;
        } else {
          if (style > 2) return false;
        }
        player.setAttackStyle(player.attackType, actionName);
        return true;
      };
    }
    case "Switch Equipment Set": {
      const equipSet = parseInt(actionName) - 1;
      return () => {
        if (player.equipmentSets.length > equipSet) {
          player.changeEquipmentSet(equipSet);
          return true;
        }
        return false;
      };
    }
    case "Equip Item":
      return () => {
        const bankID = getBankId(itemID);
        if (bankID === -1) return false;
        if (sellItemMode) toggleSellItemMode();
        if (items[itemID].canEat) {
          selectBankItem(itemID);
          equipFoodQty = bank[bankID].qty;
          equipFood();
          return getBankQty(itemID) == 0; //returns false if there is any of the item left in bank (couldn't equip)
        }
        if (items[itemID].type == "Familiar") {
          let slot = player.equipment.slotArray.slice(-3).findIndex((a) => a.item.id == itemID);
          if (slot >= 0) {
            player.equipItem(itemID, player.selectedEquipmentSet, `Summon${slot}`, bank[bankID].qty);
          } else if (player.equipment.slotArray[12].quantity == 0) {
            player.equipItem(itemID, player.selectedEquipmentSet, "Summon1", bank[bankID].qty);
          } else if (player.equipment.slotArray[13].quantity == 0) {
            player.equipItem(itemID, player.selectedEquipmentSet, "Summon2", bank[bankID].qty);
          }
          return getBankQty(itemID) == 0;
        }
        if (items[itemID].validSlots[0] == "Quiver") {
          player.equipItem(itemID, player.selectedEquipmentSet, "Quiver", bank[bankID].qty);
          return getBankQty(itemID) == 0; //returns false if there is any of the item left in bank (couldn't equip)
        }
        player.equipItem(itemID, player.selectedEquipmentSet);
        return player.equipment.slots[items[itemID].validSlots[0]].item.id === itemID; //returns false if the item is not equipped
      };
    case "Equip Passive":
      return () => {
        if (dungeonCompleteCount[15] < 1 || getBankId(itemID) === -1) return false;
        player.equipCallback(itemID, "Passive");
        return player.equipment.slots.Passive.item.id === itemID;
      };
    case "Unequip Item": {
      return () => {
        for (const i in player.equipment.slots) {
          if (player.equipment.slots[i].item.id == itemID) {
            player.unequipCallback(i)();
            return getBankQty(itemID) > 0; //returns false if there is 0 of the items in bank (no space to unequip)
          }
        }
        return false;
      };
    }
    case "Buy Item":
      return () => {
        return shop[actionName].buy(qty);
      };
    case "Sell Item":
      return () => {
        if (!bank.find((a) => a.id == itemID)) return false;
        if (sellItemMode) toggleSellItemMode();
        selectBankItem(itemID);
        sellItem();
        if (showSaleNotifications) swal.clickConfirm();
        return true;
      };
    case "Use Potion":
      return () => {
        if (!bank.find((a) => a.id == itemID)) return false;
        usePotion(itemID);
        return true;
      };
    case "Activate Prayers": {
      let choice = [];
      if (actionName != "None") {
        choice.push(PRAYER.findIndex((a) => a.name == actionName));
        if (skillItem != "None") {
          choice.push(PRAYER.findIndex((a) => a.name == skillItem));
        }
      }
      return () => {
        const validPrayers = choice.filter((a) => skillLevel[CONSTANTS.skill.Prayer] > PRAYER[a].prayerLevel);
        changePrayers(validPrayers);
        return true;
      };
    }
    case "Build Agility Obstacle": {
      const obstacleID = agilityObstacles.findIndex((a) => a.name == skillItem);
      const obstacleNumber = parseInt(actionName) - 1;
      return () => {
        if (chosenAgilityObstacles[obstacleNumber] == obstacleID) return true;
        if (!canIAffordThis(agilityObstacles[obstacleID].cost, agilityObstacles[obstacleID].requirements, obstacleID))
          return false;
        if (chosenAgilityObstacles[obstacleNumber] >= 0) destroyAgilityObstacle(obstacleNumber, true);
        buildAgilityObstacle(obstacleID, true);
        return true;
      };
    }
    case "Remove Agility Obstacle": {
      const obstacleNumber = parseInt(actionName) - 1;
      return () => {
        if (chosenAgilityObstacles[obstacleNumber] >= 0) destroyAgilityObstacle(obstacleNumber, true);
        return true;
      };
    }
  }
}
 
function setSkillAction(actionName, skillItem, skillItem2) {
  const itemID = items.findIndex((a) => a.name == skillItem);
  let actionID = 0;
  switch (actionName) {
    case "Agility":
      return () => {
        if (!isAgility) startAgility();
        return true;
      };
    case "Astrology": {
      const constellation = ASTROLOGY.find((a) => a.name == skillItem); // Find constellation
      return () => {
        if (activeAstrology == constellation.id) return false; // Already studying
        toggleAstrology(constellation.id);
        return true;
      };
    }
    case "Cooking": {
      const itemID = items.findIndex((a) => a.name == skillItem2);
      const category = cookingItems.find((a) => a.itemID == itemID).cookingCategory;
      if (skillItem == "Active") {
        return () => {
          [0, 1, 2].forEach((category) => collectFromStockpile(category));
          if (skillLevel[CONSTANTS.skill.Cooking] < cookingItems.find((a) => a.itemID == itemID).cookingLevel)
            return false;
          if (offline.skill == CONSTANTS.skill.Cooking && offline.action.active == itemID) return true;
          selectCookingRecipe(category, itemID);
          toggleActiveCook(category);
          const passives = passiveCooking.reduce((arr, item, index) => {
            return index != category && item >= 0 ? [...arr, index] : arr;
          }, []);
          passives.forEach((a) => togglePassiveCook(a));
          return true;
        };
      } else {
        return () => {
          [0, 1, 2].forEach((category) => collectFromStockpile(category));
          if (skillLevel[CONSTANTS.skill.Cooking] < cookingItems.find((a) => a.itemID == itemID).cookingLevel)
            return false;
          if (passiveCooking[category] == itemID) return true;
          selectCookingRecipe(category, itemID);
          togglePassiveCook(category);
          return true;
        };
      }
    }
    case "Crafting":
      actionID = craftingItems.find((a) => a.itemID == itemID).craftingID;
      return () => {
        if (skillLevel[CONSTANTS.skill.Crafting] < craftingItems[actionID].craftingLevel) return false;
        if (selectedCraft !== actionID) selectCraft(actionID);
        if (!isCrafting) startCrafting(true);
        return true;
      };
    case "Firemaking":
      actionID = items[itemID].firemakingID;
      return () => {
        if (skillLevel[CONSTANTS.skill.Firemaking] < logsData[actionID].level) return false;
        if (selectedLog !== actionID) selectLog(actionID);
        if (isBurning) burnLog(false);
        if (!isBurning) burnLog(false);
        return true;
      };
    case "Fishing": {
      const fishIndex = fishingItems.find((a) => a.itemID == itemID).fishingID;
      const areaID = fishingAreas.findIndex((a) => a.fish.includes(fishIndex));
      const fishID = fishingAreas[areaID].fish.findIndex((a) => a == fishIndex);
      return () => {
        if (
          (!player.equipment.slotArray.map((a) => a.item.id).includes(CONSTANTS.item.Barbarian_Gloves) &&
            areaID == 6) ||
          (!secretAreaUnlocked && areaID == 7) ||
          skillLevel[CONSTANTS.skill.Fishing] < fishingItems[fishIndex].fishingLevel
        )
          return false;
        if (!isFishing) {
          selectFish(areaID, fishID);
          startFishing(areaID, fishID, true);
        } else {
          if (areaID != offline.action[0] || fishID != offline.action[1]) {
            startFishing(offline.action[0], offline.action[1], true);
            selectFish(areaID, fishID);
            startFishing(areaID, fishID, true);
          }
        }
        return true;
      };
    }
    case "Fletching":
      actionID = fletchingItems.find((a) => a.itemID == itemID).fletchingID;
      const log = items.findIndex((a) => a.name == skillItem2);
      if (skillItem != "Arrow Shafts") {
        return () => {
          if (skillLevel[CONSTANTS.skill.Fletching] < fletchingItems[actionID].fletchingLevel) return false;
          if (selectedFletch !== actionID) selectFletch(actionID);
          if (!isFletching) startFletching(true);
          return true;
        };
      }
      return () => {
        if (skillLevel[CONSTANTS.skill.Fletching] < fletchingItems[actionID].fletchingLevel || !checkBankForItem(log))
          return false;
        if (selectedFletchLog != log || selectedFletch !== actionID) selectFletch(actionID, log);
        if (!isFletching) startFletching(true);
        return true;
      };
    case "Herblore":
      actionID = herbloreItemData.findIndex((a) => a.name == skillItem);
      return () => {
        if (skillLevel[CONSTANTS.skill.Herblore] < herbloreItemData[actionID].herbloreLevel) return false;
        if (selectedHerblore !== actionID) selectHerblore(actionID);
        if (!isHerblore) startHerblore(true);
        return true;
      };
    case "Mining":
      actionID = Mining.rockData.findIndex((a) => a.name == skillItem);
      return () => {
        if (
          (actionID === 9 && !canMineDragonite()) ||
          skillLevel[CONSTANTS.skill.Mining] < Mining.rockData[actionID].levelRequired
        )
          return false;
        if (!game.mining.isActive || game.mining.selectedRockId != actionID) game.mining.onRockClick(actionID);
        return true;
      };
    case "Magic": {
      actionID = ALTMAGIC.findIndex((a) => a.name == skillItem);
      const magicItem = items.findIndex((a) => a.name == skillItem2);
      return () => {
        if (
          skillLevel[CONSTANTS.skill.Magic] < ALTMAGIC[actionID].magicLevelRequired ||
          skillLevel[CONSTANTS.skill.Smithing] < smithingItems.find((a) => a.smithingLevel == skillItem2)
        )
          return false;
        if (selectedAltMagic !== actionID) selectMagic(actionID);
        if (ALTMAGIC[actionID].selectItem >= 0 && selectedMagicItem[ALTMAGIC[actionID].selectItem] !== magicItem) {
          if (ALTMAGIC[actionID].selectItem != 0 && (getBankQty(magicItem) < 1 || lockedItems.includes(magicItem)))
            return false;
          selectItemForMagic(magicItem);
        }
        if (!isMagic) castMagic(true);
        return true;
      };
    }
    case "Runecrafting":
      actionID = runecraftingItems.findIndex((a) => a.itemID == itemID);
      return () => {
        if (skillLevel[CONSTANTS.skill.Runecrafting] < runecraftingItems[actionID].runecraftingLevel) return false;
        if (selectedRunecraft !== actionID) selectRunecraft(actionID);
        if (!isRunecrafting) startRunecrafting(true);
        return true;
      };
    case "Smithing":
      actionID = smithingItems.findIndex((a) => a.itemID == itemID);
      return () => {
        if (skillLevel[CONSTANTS.skill.Smithing] < smithingItems[actionID].smithingLevel) return false;
        if (selectedSmith !== actionID) selectSmith(actionID);
        if (!isSmithing) startSmithing(true);
        return true;
      };
    case "Summoning": {
      const summonID = summoningItems.find((a) => a.itemID == itemID).summoningID;
      let recipeID = 0;
      if (options.actions["Start Skill"]["Summoning"][skillItem] != null) {
        const ingredientID = items.findIndex((a) => a.name == skillItem2);
        recipeID = items[itemID].summoningReq.findIndex((a) => a.slice(-1)[0].id == ingredientID);
      }
      return () => {
        //exit if low level
        if (
          skillLevel[CONSTANTS.skill.Summoning] < summoningItems.find((a) => a.summoningID == summonID).summoningLevel
        )
          return false;
        //if summon is not selected, choose it
        if (selectedSummon != summonID || summoningData.defaultRecipe[summonID] != recipeID) {
          selectSummon(summonID, recipeID);
        }
        if (!isSummoning) createSummon(true);
        return isSummoning;
      };
    }
    case "Thieving": {
      const npc = Thieving.npcs.find((a) => a.name == skillItem);
      const area = Thieving.areas.find((a) => a.npcs.includes(npc.id));
      const panel = thievingMenu.areaPanels.find((a) => a.area == area);
      return () => {
        if (skillLevel[CONSTANTS.skill.Thieving] < npc.level) return false;
        if (offline.skill == CONSTANTS.skill.Thieving && game.thieving.currentNPC == npc) return true;
        thievingMenu.selectNPCInPanel(npc, panel);
        game.thieving.startThieving(area, npc);
        return true;
      };
    }
    case "Woodcutting":
      actionID = [itemID, items.findIndex((a) => a.name == skillItem2)].slice(
        0,
        playerModifiers.increasedTreeCutLimit + 1
      );
      return () => {
        let result = true;
 
        currentTrees.forEach((tree) => {
          if (actionID.includes(tree)) {
            actionID.splice(
              actionID.findIndex((a) => a == tree),
              1
            );
          } else {
            actionID.unshift(tree);
          }
        });
 
        actionID.forEach((i) => {
          if (skillLevel[CONSTANTS.skill.Woodcutting] >= trees[i].level) {
            cutTree(i);
          } else {
            result = false;
          }
        });
        return result;
      };
  }
}
 
class Action {
  /**
   * Create an action object with trigger
   * @param {string} category (Tier 1 option) category for trigger
   * @param {string} name (Tier 2 option) skill/item name
   * @param {string} greaterThan (Tier 3 option) either ≥ or ≤
   * @param {string} masteryItem (Tier 3 option) target name for mastery
   * @param {string} number (Tier 4 option) target number for skill/mastery/item
   * @param {string} actionCategory (Tier 1 option) category for action
   * @param {string} actionName (Tier 2 option) skill/monster/item/set name
   * @param {string} skillItem (Tier 3 option) name for skilling action
   * @param {string} skillItem2 (Tier 4 option) name of second tree to cut or alt.magic item
   * @param {string} qty (Tier 4 option) amount of item to buy if applicable
   */
  constructor(
    category,
    name,
    greaterThan,
    masteryItem,
    number,
    actionCategory,
    actionName,
    skillItem,
    skillItem2,
    qty
  ) {
    switch (category) {
      case "Idle":
        this.description = `If no active skills/combat:`;
        break;
      case "Item Quantity":
        this.description = `If ${name} ${greaterThan} ${number}:`;
        break;
      case "Prayer Points":
        this.description = `If prayer points ${greaterThan} ${number}:`;
        break;
      case "Skill Level":
        this.description = `If ${name} ≥ level ${number}:`;
        break;
      case "Skill XP":
        this.description = `If ${name} ≥ ${number}xp:`;
        break;
      case "Equipped Item Quantity": {
        let plural = name;
        if (!/s$/i.test(name)) plural += "s";
        this.description = `If ≤ ${number} ${plural} equipped:`;
        break;
      }
      case "Mastery Level":
        this.description = `If ${name} ${masteryItem} mastery ≥ ${number}:`;
        break;
      case "Pet Unlocked":
        this.description = `If ${name} unlocked:`;
        break;
      case "Mastery Pool %":
        this.description = `If ${name} mastery pool ≥ ${number}%:`;
        break;
      case "Potion Depleted":
        this.description = `If ${name} potion has depleted:`;
        break;
      case "Enemy in Combat":
        this.description = `If fighting ${name}:`;
    }
    this.data = [category, name, greaterThan, masteryItem, number];
    this.elementID = `AQ${nameIncrement++}`;
    this.trigger = setTrigger(category, name, greaterThan, masteryItem, number);
    if (typeof actionCategory == "string") {
      this.action = [
        {
          elementID: `AQ${nameIncrement++}`,
          data: [actionCategory, actionName, skillItem, skillItem2, qty],
          start: setAction(actionCategory, actionName, skillItem, skillItem2, qty),
          description: actionDescription(actionCategory, actionName, skillItem, skillItem2, qty),
        },
      ];
    } else {
      this.action = [];
    }
  }
}
 
function actionDescription(actionCategory, actionName, skillItem, skillItem2, qty) {
  let description = "";
  switch (actionCategory) {
    case "Start Skill":
      description += `Start ${actionName} ${skillItem}`;
      if (actionName == "Summoning") {
        description = `start creating ${skillItem} tablets`;
        if (options.actions["Start Skill"]["Summoning"][skillItem] != null) {
          description += ` from ${skillItem2}`;
        }
      }
      if (actionName == "Astrology") description = `Start studying ${skillItem} in ${actionName}`;
      if (actionName == "Cooking") description = `Start ${skillItem} Cooking ${skillItem2}`;
      if (actionName == "Woodcutting") description += ` & ${skillItem2}`;
      if (skillItem == "Arrow Shafts") description += ` from ${skillItem2}`;
      if (actionName == "Magic") {
        description += ` with ${skillItem2}`;
        if (!/s$/i.test(skillItem2)) description += "s";
      }
      break;
    case "Start Combat":
      description += `start fighting ${actionName}`;
      break;
    case "Change Attack Style":
      if (actionName == "Select Spell") {
        description += `select ${skillItem2} spell`;
      } else {
        description += `change attack style to ${actionName}`;
      }
      break;
    case "Switch Equipment Set":
      description += `switch to equipment set ${actionName}`;
      break;
    case "Equip Item":
      description += `equip ${actionName} to current set`;
      break;
    case "Equip Passive":
      description += `equip ${actionName} to passive slot`;
      break;
    case "Unequip Item":
      description += `unequip ${actionName} from current set`;
      break;
    case "Buy Item":
      if (qty > 1) {
        description += `buy ${qty} ${actionName} from shop`;
      } else {
        description += `buy ${actionName} from shop`;
      }
      break;
    case "Sell Item":
      description += `sell ${actionName}`;
      break;
    case "Use Potion":
      description += `use ${actionName} potion`;
      break;
    case "Activate Prayers":
      {
        if (actionName == "None") {
          description += `turn off prayers`;
        } else {
          description += `turn on ${actionName}`;
          if (skillItem != "None") description += ` and ${skillItem}`;
        }
      }
      break;
    case "Build Agility Obstacle":
      description += `build ${skillItem}`;
      break;
    case "Remove Agility Obstacle":
      description += `remove obstacle ${actionName}`;
      break;
  }
  return description;
}
 
function resetForm(arr) {
  arr.forEach((menu) => {
    document.getElementById(`aq-num${menu}`).type = "hidden";
    document.getElementById(`aq-num${menu}`).value = "";
    validInputs[menu].forEach((a, i) => {
      if (i != 0) {
        document.getElementById(`aq-text${menu}${i}`).type = "hidden"; //hide all except first
        document.getElementById(`aq-list${menu}${i}`).innerHTML = ""; //empty datalists
      }
      document.getElementById(`aq-text${menu}${i}`).value = ""; //clear values
      validInputs[menu][i] = null;
    });
  });
}
 
function submitForm() {
  try {
    //create array of the input values
    const arr = [];
    ["A", "B"].forEach((menu) => {
      for (let i = 0; i < validInputs[menu].length; i++)
        arr.push(htmlChar(document.getElementById(`aq-text${menu}${i}`).value));
      arr.push(document.getElementById(`aq-num${menu}`).value);
    });
    arr.splice(["≥", "≤", ""].includes(arr[2]) ? 3 : 2, 0, "");
 
    //validate trigger and action
    if (
      validateInput(
        options.triggers,
        arr.slice(0, 5).filter((a) => a !== "")
      ) &&
      validateInput(
        options.actions,
        arr.slice(5).filter((a) => a !== "")
      )
    ) {
      addToQueue(new Action(...arr));
      resetForm(["A", "B"]);
    }
  } catch (e) {
    console.error(e);
  }
  return false;
}
 
/**
 * Function to validate user input
 * @param {Object} obj options object to check against
 * @param {Array} tier array of user inputs
 * @param {number} n leave blank (used for recursion)
 * @returns {boolean} true if input is valid
 */
function validateInput(obj, tier, n = 0) {
  if (!obj.hasOwnProperty([tier[n]])) return false;
  if (obj[tier[n]] === null || (obj[tier[n]] === "num" && /^\d{1,10}$/.test(tier[n + 1]))) return true;
  return validateInput(obj[tier[n]], tier, n + 1);
}
 
/**
 * Updates input text boxes
 * @param {string} menu ('A'||'B'||'C')
 */
function dropdowns(menu) {
  let obj;
  if (menu == "A") {
    obj = options.triggers;
  } else if (menu == "B") {
    obj = options.actions;
  } else {
    obj = options[currentlyEditing.type == "triggers" ? "triggers" : "actions"];
  }
  for (let i = 0; i < validInputs[menu].length; i++) {
    const value = htmlChar(document.getElementById(`aq-text${menu}${i}`).value);
    if (Object.keys(obj).includes(value)) {
      if (obj[value] == "num") {
        document.getElementById(`aq-num${menu}`).type = "text";
        break;
      }
      if (obj[value] == null) break;
      obj = obj[value];
      if (validInputs[menu][i] != value) {
        validInputs[menu][i] = value;
        document.getElementById(`aq-text${menu}${i + 1}`).type = "text";
        document.getElementById(`aq-list${menu}${i + 1}`).innerHTML = "";
        Object.keys(obj).forEach((e) => {
          document.getElementById(`aq-list${menu}${i + 1}`).insertAdjacentHTML("beforeend", `<option>${e}</option>`);
        });
      }
    } else {
      validInputs[menu][i] = null;
      for (i++; i < validInputs[menu].length; i++) {
        try {
          validInputs[menu][i] = null;
          document.getElementById(`aq-text${menu}${i}`).type = "hidden";
          document.getElementById(`aq-text${menu}${i}`).value = "";
        } catch {}
      }
      document.getElementById(`aq-num${menu}`).type = "hidden";
      document.getElementById(`aq-num${menu}`).value = "";
    }
  }
}
 
const aqHTML = `<div class="content" id="action-queue-container" style="display: none">
<div class="row row-deck">
  <div class="col-md-12">
    <div class="block block-rounded block-link-pop border-top border-settings border-4x">
      <form class="aq-mastery-config" id="aq-mastery-config-container" style="display: none">
        <div style="display: inline-block; margin-left: 20px; height: 180px; vertical-align: top">
          <h3 class="aq-header">Mastery Config</h3>
          <div>
            <select id="aq-skill-list" class="aq-select"></select>
          </div>
          <div>
            <select id="aq-checkpoint-list" class="aq-select">
              <option value="0">0%</option>
              <option value="0.1">10%</option>
              <option value="0.25">25%</option>
              <option value="0.5">50%</option>
              <option value="0.95">95%</option>
            </select>
          </div>
          <div>
            <select id="aq-mastery-strategy" class="aq-select">
              <option value="false">Lowest mastery</option>
              <option value="true">Custom priority</option>
            </select>
          </div>
          <div>
            <select id="aq-base" class="aq-select"></select>
          </div>
          <div>
            <input type="text" id="aq-mastery-array" class="aq-select"/>
          </div>
        </div>
        <div style="margin-left: 20px">
          <button type="button" class="btn btn-sm aq-green" id="aq-config-close">Done</button>
        </div>
      </form>
      <form class="aq-popup" id="aq-edit-container" style="display: none;">
        <div style="display: inline-block; margin-left: 20px; height: 180px; vertical-align: top">
          <h3 id="aq-edit-form" class="aq-header">Action</h3>
          <div>
            <input type="text" class="aq-dropdown" id="aq-textC0" required list="aq-listC0" placeholder="Category" />
          </div>
          <div>
            <input type="hidden" class="aq-dropdown" id="aq-textC1" list="aq-listC1" />
          </div>
          <div>
            <input type="hidden" class="aq-dropdown" id="aq-textC2" list="aq-listC2" />
          </div>
          <div>
            <input type="hidden" class="aq-dropdown" id="aq-textC3" list="aq-listC3" />
          </div>
          <div>
            <input type="hidden" class="aq-dropdown" id="aq-numC" pattern="^\\d{1,10}$" placeholder="number" title="Positive integer"/>
          </div>
        </div>
        <div style="margin-left: 20px">
          <button type="button" id="aq-save-edit" class="btn btn-sm aq-blue">Save</button>
          <button type="button" id="aq-cancel" class="btn btn-sm btn-danger">Cancel</button>
        </div>
      </form>
      <div class="block-content">
        <div>
          <form id="aq-form">
            <div style="display: inline-block; margin-left: 20px; height: 180px; vertical-align: top">
              <h3 class="aq-header">Trigger</h3>
              <div>
                <input type="text" class="aq-dropdown" id="aq-textA0" required list="aq-listA0" placeholder="Category" />
              </div>
              <div>
                <input type="hidden" class="aq-dropdown" id="aq-textA1" list="aq-listA1" />
              </div>
              <div>
                <input type="hidden" class="aq-dropdown" id="aq-textA2" list="aq-listA2" />
              </div>
              <div>
                <input type="hidden" class="aq-dropdown" id="aq-numA" pattern="^\\d{1,10}$" placeholder="number" title="Positive integer"/>
              </div>
            </div>
            <div style="display: inline-block; margin-left: 20px; height: 180px; vertical-align: top">
              <h3 class="aq-header">Action</h3>
              <div>
                <input type="text" class="aq-dropdown" id="aq-textB0" required list="aq-listB0" placeholder="Category" />
              </div>
              <div>
                <input type="hidden" class="aq-dropdown" id="aq-textB1" list="aq-listB1" />
              </div>
              <div>
                <input type="hidden" class="aq-dropdown" id="aq-textB2" list="aq-listB2" />
              </div>
              <div>
                <input type="hidden" class="aq-dropdown" id="aq-textB3" list="aq-listB3" />
              </div>
              <div>
                <input type="hidden" class="aq-dropdown" id="aq-numB" pattern="^\\d{1,10}$" placeholder="number" title="Positive integer"/>
              </div>
            </div>
            <div style="margin-left: 20px">
              <input type="submit" class="btn btn-sm aq-blue" value="Add to queue">
              <button type="button" id="aq-pause" class="btn btn-sm aq-yellow">Pause</button>
            </div>
          </form>
        </div>
        <form style="margin: 10px 0 5px 20px">
          <button type="button" class="btn btn-sm aq-grey" id="aq-download">Download Action List</button>
          <input type="submit" class="btn btn-sm aq-grey" value="Import Action List" />
          <input type="text" id="aq-pastebin" style="width: 236px;" required pattern="^\\[.*\\]$" placeholder="Paste data here" />
        </form>
        <div style="display: flex;justify-content: space-between;max-width: 550px;margin: 10px 0 0 25px;">
          <p style="margin: 0;">Looping</p>
          <div class="">
            <div class="custom-control custom-radio custom-control-inline custom-control-lg">
                <input type="radio" class="custom-control-input" id="aq-loop-enable" name="aq-looping">
                <label class="custom-control-label" for="aq-loop-enable">Enable</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline custom-control-lg">
                <input type="radio" class="custom-control-input" id="aq-loop-disable" name="aq-looping" checked="">
                <label class="custom-control-label" for="aq-loop-disable">Disable</label>
            </div>
          </div>
        </div>
        <div style="display: flex;justify-content: space-between;max-width: 550px;margin: 10px 0 0 25px;">
          <p style="margin: 0;">Mastery Pool Management</p>
          <div class="">
            <div class="custom-control custom-radio custom-control-inline custom-control-lg">
                <input type="radio" class="custom-control-input" id="aq-mastery-enable" name="aq-mastery">
                <label class="custom-control-label" for="aq-mastery-enable">Enable</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline custom-control-lg">
                <input type="radio" class="custom-control-input" id="aq-mastery-disable" name="aq-mastery" checked="">
                <label class="custom-control-label" for="aq-mastery-disable">Disable</label>
            </div>
          </div>
        </div>
        <div style="margin: 10px 0 0 25px; display: flex; justify-content: space-between">
          <button type="button" class="btn btn-sm aq-grey" id="aq-mastery-config">Advanced Mastery Options</button>
          <button type="button" style="font-size: 0.875rem" class="btn aq-delete btn-danger" id="aq-delete-all">delete all</button>
        </div>
        <h2 class="content-heading border-bottom mb-4 pb-2">Current Queue</h2>
        <div style="min-height: 50px" id="aq-item-container"></div>
      </div>
    </div>
  </div>
</div>
</div>
<datalist id="aq-listA0"></datalist>
<datalist id="aq-listA1"></datalist>
<datalist id="aq-listA2"></datalist>
<datalist id="aq-listB0"></datalist>
<datalist id="aq-listB1"></datalist>
<datalist id="aq-listB2"></datalist>
<datalist id="aq-listB3"></datalist>
<datalist id="aq-listC0"></datalist>
<datalist id="aq-listC1"></datalist>
<datalist id="aq-listC2"></datalist>
<datalist id="aq-listC3"></datalist>
<style>
.aq-dropdown {
  width: 260px;
}
.aq-header {
  margin-bottom: 10px;
  color: whitesmoke;
}
.aq-arrow {
  font-size: 2rem;
  padding: 0px 0.25rem;
  line-height: 0px;
  margin: 0.25rem 2px;
  border-radius: 0.2rem;
}
.aq-item {
  background-color: #464646;
  padding: 12px;
  margin: 12px;
  cursor: move;
}
.aq-item-inner {
  display: flex;
  justify-content: space-between;
  cursor: move;
}
.aq-delete {
  font-size: 1.2rem;
  padding: 0px 0.36rem;
  line-height: 0px;
  margin: 0.25rem 0.25rem 0.25rem 0.125rem;
  border-radius: 0.2rem;
}
.aq-grey {
  background-color: #676767;
}
.aq-grey:hover {
  background-color: #848484;
}
.aq-blue {
  background-color: #0083ff;
}
.aq-blue:hover {
  background-color: #63b4ff;
}
.aq-green {
  background-color: #5a9e00;
}
.aq-green:hover {
  background-color: #7bd900;
}
.aq-yellow {
  background-color: #e69721;
}
.aq-yellow:hover {
  background-color: #ffb445;
}
.t-drag {
  opacity: 0.5;
}
.a-drag {
  opacity: 0.5;
}
.aq-popup {
  position: fixed;
  right: 5%;
  top: 20%;
  z-index: 2;
  background-color: #3f4046;
  padding: 20px 20px 20px 0;
  border-top: 1px solid #e1e6e9;
  border-radius: 0.25rem;
  border-width: 4px;
}
.aq-mastery-config {
  position: fixed;
  right: 67%;
  top: 18%;
  z-index: 3;
  background-color: #3f4046;
  padding: 20px 20px 20px 0;
  border-top: 1px solid #e1e6e9;
  border-radius: 0.25rem;
  border-width: 4px;
}
.aq-select {
  width: 200px;
}
</style>
`;
 
function loadAQ() {
  //add item names
  for (const a of items) {
    options.triggers["Item Quantity"][a.name] = { "≥": "num", "≤": "num" };
    options.actions["Sell Item"][a.name] = null;
    if (a.validSlots && a.validSlots.includes("Passive")) options.actions["Equip Passive"][a.name] = null;
  }
 
  //add attack styles
  for (const s in CONSTANTS.attackStyle) {
    options.actions["Change Attack Style"][s] = null;
  }
  //add normal spells
  for (const s of SPELLS) {
    options.actions["Change Attack Style"]["Select Spell"]["Normal"][s.name] = null;
  }
  //add curse spells
  for (const s of CURSES) {
    options.actions["Change Attack Style"]["Select Spell"]["Curse"][s.name] = null;
  }
  //add aurora spells
  for (const s of AURORAS) {
    options.actions["Change Attack Style"]["Select Spell"]["Aurora"][s.name] = null;
  }
  //add ancient spells
  for (const s of ANCIENT) {
    options.actions["Change Attack Style"]["Select Spell"]["Ancient"][s.name] = null;
  }
 
  //add pet names
  for (const pet of PETS) {
    const name = `${pet.name.split(",")[0]} (${pet.acquiredBy})`;
    options.triggers["Pet Unlocked"][name] = null;
  }
 
  //add skill names
  Object.keys(CONSTANTS.skill).forEach((a) => {
    if(isNaN(a)) // skill list includes reverse lookup
      options.triggers["Skill Level"][a] = "num";
  });
  options.triggers["Skill XP"] = options.triggers["Skill Level"];
  Object.keys(options.triggers["Mastery Level"]).forEach(
    (skill) => (options.triggers["Mastery Pool %"][skill] = "num")
  );
 
  //add mastery/action names for each skill
  {
    ASTROLOGY.forEach((item) => {
      options.triggers["Mastery Level"]["Astrology"][item.name] = "num";
      options.actions["Start Skill"]["Astrology"][item.name] = null;
    })

    cookingItems.forEach((item) => {
      options.triggers["Mastery Level"]["Cooking"][items[item.itemID].name] = "num";
    });
    options.actions["Start Skill"]["Cooking"]["Active"] = cookingItems.reduce((obj, a) => {
      obj[items[a.itemID].name] = null;
      return obj;
    }, {});
    options.actions["Start Skill"]["Cooking"]["Passive"] = options.actions["Start Skill"]["Cooking"]["Active"];
 
    console.log(options.actions);
 
    craftingItems.forEach((item) => {
      options.triggers["Mastery Level"]["Crafting"][items[item.itemID].name] = "num";
      options.actions["Start Skill"]["Crafting"][items[item.itemID].name] = null;
    });
 
    items.forEach((item) => {
      if (item.type == "Seeds") {
        options.triggers["Mastery Level"]["Farming"][item.name] = "num";
      }
    });
 
    items.forEach((item) => {
      if (item.type == "Logs") {
        options.triggers["Mastery Level"]["Firemaking"][item.name] = "num";
        options.actions["Start Skill"]["Firemaking"][item.name] = null;
      }
    });
 
    fishingItems.forEach((item) => {
      options.triggers["Mastery Level"]["Fishing"][items[item.itemID].name] = "num";
      options.actions["Start Skill"]["Fishing"][items[item.itemID].name] = null;
    });
 
    items.forEach((item) => {
      if (item.type == "Logs") {
        options.triggers["Mastery Level"]["Woodcutting"][item.name] = "num";
        options.actions["Start Skill"]["Woodcutting"][item.name] = {};
      }
    });
    for (const log in options.actions["Start Skill"]["Woodcutting"]) {
      Object.keys(options.actions["Start Skill"]["Woodcutting"]).forEach(
        (a) => (options.actions["Start Skill"]["Woodcutting"][log][a] = null)
      );
    }
 
    fletchingItems.forEach((item) => {
      options.triggers["Mastery Level"]["Fletching"][items[item.itemID].name] = "num";
      options.actions["Start Skill"]["Fletching"][items[item.itemID].name] = null;
    });
    options.actions["Start Skill"]["Fletching"]["Arrow Shafts"] = {};
    for (const log in options.actions["Start Skill"]["Woodcutting"]) {
      options.actions["Start Skill"]["Fletching"]["Arrow Shafts"][log] = null;
    }
 
    herbloreItemData.forEach((item) => {
      options.triggers["Mastery Level"]["Herblore"][item.name] = "num";
      options.actions["Start Skill"]["Herblore"][item.name] = null;
    });
 
    agilityObstacles.forEach((item) => {
      options.triggers["Mastery Level"]["Agility"][item.name] = "num";
    });
 
    Object.keys(MiningOres).forEach((item) => {
      if(isNaN(item)) {
        options.triggers["Mastery Level"]["Mining"][item] = "num";
        options.actions["Start Skill"]["Mining"][item] = null;
      }
    });
 
    runecraftingItems.forEach((item) => {
      options.triggers["Mastery Level"]["Runecrafting"][items[item.itemID].name] = "num";
      options.actions["Start Skill"]["Runecrafting"][items[item.itemID].name] = null;
    });
 
    smithingItems.forEach((item) => {
      options.triggers["Mastery Level"]["Smithing"][items[item.itemID].name] = "num";
      options.actions["Start Skill"]["Smithing"][items[item.itemID].name] = null;
    });
 
    Thieving.npcs.forEach((npc) => {
      options.triggers["Mastery Level"]["Thieving"][npc.name] = "num";
      options.actions["Start Skill"]["Thieving"][npc.name] = null;
    });
 
    summoningItems.forEach((item) => {
      options.triggers["Mastery Level"]["Summoning"][items[item.itemID].name] = "num";
      if (items[item.itemID].summoningReq.length == 1) {
        options.actions["Start Skill"]["Summoning"][items[item.itemID].name] = null;
      } else {
        options.actions["Start Skill"]["Summoning"][items[item.itemID].name] = {};
        items[item.itemID].summoningReq.forEach((recipe) => {
          const ingredient = recipe.slice(-1)[0].id;
          options.actions["Start Skill"]["Summoning"][items[item.itemID].name][items[ingredient].name] = null;
        });
      }
    });
  }
 
  //agility obstacles
  options.actions["Build Agility Obstacle"] = agilityObstacles.reduce((obj, a) => {
    if (!obj.hasOwnProperty(a.category + 1)) obj[a.category + 1] = {};
    obj[a.category + 1][a.name] = null;
    return obj;
  }, {});
  Object.keys(options.actions["Build Agility Obstacle"]).forEach(
    (a) => (options.actions["Remove Agility Obstacle"][a] = null)
  );
 
  //potions
  options.actions["Use Potion"] = items.reduce((obj, item) => {
    if (item.type == "Potion") obj[item.name] = null;
    return obj;
  }, {});
 
  //prayer actions
  PRAYER.forEach((prayer) => (options.actions["Activate Prayers"][prayer.name] = {}));
  for (const prayer1 in options.actions["Activate Prayers"]) {
    PRAYER.forEach((prayer) => (options.actions["Activate Prayers"][prayer1][prayer.name] = null));
    options.actions["Activate Prayers"][prayer1]["None"] = null;
  }
  options.actions["Activate Prayers"]["None"] = null;
 
  //add altmagic names
  ALTMAGIC.forEach((spell) => {
    options.actions["Start Skill"]["Magic"][spell.name] = {};
    if (spell.selectItem === 0) {
      for (const item of smithingItems) {
        if (item.category === 0) {
          options.actions["Start Skill"]["Magic"][spell.name][items[item.itemID].name] = null;
        }
      }
    } else if (spell.isJunk) {
      junkItems.forEach((a) => (options.actions["Start Skill"]["Magic"][spell.name][items[a].name] = null));
    } else if (spell.selectItem === 1) {
      options.actions["Start Skill"]["Magic"][spell.name] = options.actions["Sell Item"];
    } else options.actions["Start Skill"]["Magic"][spell.name] = null;
  });
 
  //add food and ammo names
  for (const a of items.filter((a) => a.canEat)) {
    options.triggers["Equipped Item Quantity"][a.name] = "num";
    options.actions["Equip Item"][a.name] = null;
  }
  for (const a of items.filter(
    (a) => a.hasOwnProperty("validSlots") && (a.validSlots[0] == "Quiver" || a.validSlots[0] == "Summon1")
  ))
    options.triggers["Equipped Item Quantity"][a.name] = "num";
 
  //edit buyShopItem  function so that it returns boolean based on if it met requirements
  eval(
    buyShopItem
      .toString()
      .replace(/}$/, "return canBuy}")
      .replace(/^function (\w+)/, "window.$1 = function")
  );
 
  //add shop items
  for (const category in SHOP) {
    SHOP[category].forEach((item, id) => {
      let name = item.name;
      if (name == "Extra Equipment Set") {
        item.cost.gp > 0 ? (name += " (GP)") : (name += " (SC)");
      }
      if (category == "Materials" || category == "Gloves") {
        shop[name] = {
          buy: (qty) => {
            updateBuyQty(qty);
            return buyShopItem(category, id, true);
          },
        };
        options.actions["Buy Item"][name] = "num";
      } else {
        shop[name] = { buy: () => buyShopItem(category, id, true) };
        options.actions["Buy Item"][name] = null;
      }
    });
  }
 
  //add monster/dungeon names
  {
    //collect monster IDs
    const monsterIDs = [];
    for (const area of combatAreas) monsterIDs.push(...area.monsters);
    for (const area of slayerAreas) monsterIDs.push(...area.monsters);
    //add names to array
    for (const monster of monsterIDs) options.actions["Start Combat"][MONSTERS[monster].name] = null;
    for (const dungeon of DUNGEONS) options.actions["Start Combat"][dungeon.name] = null;
    for (const monster of MONSTERS) options.triggers["Enemy in Combat"][monster.name] = null;
  }
 
  //add equippable items
  for (const a of items.filter((a) => a.hasOwnProperty("validSlots"))) {
    options.actions["Equip Item"][a.name] = null;
    options.actions["Unequip Item"][a.name] = null;
  }
 
  //add in sidebar item
  $("li.nav-main-item:contains(Bank)")[0].insertAdjacentHTML(
    "afterend",
    `<li class="nav-main-item">
  <a class="nav-main-link nav-compact" style="cursor: pointer;">
    <img class="nav-img" src="assets/media/skills/prayer/mystic_lore.svg">
    <span class="nav-main-link-name">Action Queue</span>
    <small id="current-queue" style="color: rgb(210, 106, 92);">inactive</small>
  </a>
</li>`
  );
  //add click for sidebar item
  $("li.nav-main-item:contains(Action Queue)")[0].addEventListener("click", () => actionTab());
 
  const htmlCollection = $('div[onclick^="changePage"]');
  for (let i = 0; i < htmlCollection.length; i++) htmlCollection[i].addEventListener("click", () => hideActionTab());
 
  //add main html
  document.getElementById("main-container").insertAdjacentHTML("beforeend", aqHTML);
 
  //add button clicks
  document.getElementById("aq-pause").addEventListener("click", () => togglePause());
  document.getElementById("aq-download").addEventListener("click", () => downloadActions());
  document.getElementById("aq-mastery-config").addEventListener("click", () => masteryPopup(true));
  document.getElementById("aq-loop-enable").addEventListener("click", () => toggleLoop(true));
  document.getElementById("aq-loop-disable").addEventListener("click", () => toggleLoop(false));
  document.getElementById("aq-mastery-enable").addEventListener("click", () => toggleMastery(true));
  document.getElementById("aq-mastery-disable").addEventListener("click", () => toggleMastery(false));
  document.getElementById("aq-cancel").addEventListener("click", () => cancelEdit());
  document.getElementById("aq-delete-all").addEventListener("click", () => clearQueue());
  document.getElementById("aq-save-edit").addEventListener("click", () => submitEdit());
  document.getElementById("aq-form").addEventListener("submit", (e) => {
    e.preventDefault();
    submitForm();
  });
  document.getElementById("aq-item-container").parentNode.children[1].addEventListener("submit", (e) => {
    e.preventDefault();
    importActions();
  });
  for (const menu in validInputs) {
    validInputs[menu].forEach((a, i) => {
      document.getElementById(`aq-text${menu}${i}`).addEventListener("input", () => {
        dropdowns(menu);
      });
    });
  }
  document.getElementById("aq-skill-list").addEventListener("change", () => updateMasteryConfig());
  document.getElementById("aq-checkpoint-list").addEventListener("change", () => updateMasteryConfig(false));
  document.getElementById("aq-mastery-strategy").addEventListener("change", () => updateMasteryConfig(false));
  document.getElementById("aq-base").addEventListener("change", () => updateMasteryConfig(false));
  document.getElementById("aq-config-close").addEventListener("click", () => masteryPopup(false));
  document.getElementById(`aq-mastery-array`).addEventListener("input", () => updateMasteryConfig(false));
 
  //fills category lists
  Object.keys(options.triggers).forEach((a) =>
    document.getElementById("aq-listA0").insertAdjacentHTML("beforeend", `<option>${a}</option>`)
  );
  Object.keys(options.actions).forEach((a) =>
    document.getElementById("aq-listB0").insertAdjacentHTML("beforeend", `<option>${a}</option>`)
  );
 
  //add event listener for dragging trigger blocks
  const triggerContainer = document.getElementById("aq-item-container");
  triggerContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    const draggable = document.querySelector(".t-drag");
    if (!draggable || document.querySelector(".a-drag") != null) return;
    const afterElement = getDragAfterElement(triggerContainer, e.clientY, ".aq-item");
    if (afterElement == null) {
      triggerContainer.appendChild(draggable);
    } else {
      triggerContainer.insertBefore(draggable, afterElement);
    }
  });
 
  //mastery stuff
  for (let i = 1; i < 100; i++) {
    lvlIndex[i] = exp.level_to_xp(i) + 1;
  }
  for (const skill in MASTERY) {
    masteryConfig[skill] = {
      checkpoint: 0.95,
      prio: false,
      base: 87,
      arr: [],
    };
    masteryClone[skill] = {
      pool: MASTERY[skill].pool,
      lvl: [],
    };
    updateMasteryLvl(skill);
  }
 
  for (const name in CONSTANTS.skill) {
    if (Object.keys(MASTERY).includes(`${CONSTANTS.skill[name]}`))
      document
        .getElementById("aq-skill-list")
        .insertAdjacentHTML("beforeend", `<option value="${CONSTANTS.skill[name]}">${name}</option>`);
  }
  for (let i = 60; i < 88; i++)
    document.getElementById("aq-base").insertAdjacentHTML("beforeend", `<option value="${i}">${i}</option>`);
  tooltips.masteryConfig = [
    tippy(document.getElementById("aq-checkpoint-list"), {
      content: "Minimum pool % to maintain",
      animation: false,
    }),
    tippy(document.getElementById("aq-mastery-strategy"), {
      content: "Mastery pool spending strategy",
      animation: false,
    }),
    tippy(document.getElementById("aq-base"), {
      content: "Target mastery level for custom priority list",
      animation: false,
    }),
  ];
 
  window.masteryIDs = {};
  for (const skillName in options.triggers["Mastery Level"]) {
    masteryIDs[skillName] = {};
    for (const name in options.triggers["Mastery Level"][skillName])
      masteryIDs[skillName][name] = fetchMasteryID(skillName, name);
  }
 
  //load locally stored action queue if it exists
  loadLocalSave();
  console.log("Action Queue loaded");
}
 
const replaceChar = [
  /*{ reg: "&", replace: "&amp;" },
  { reg: '"', replace: "&quot;" },
  { reg: "£", replace: "&pound;" },
  { reg: "€", replace: "&euro;" },
  { reg: "é", replace: "&eacute;" },
  { reg: "–", replace: "&ndash;" },
  { reg: "®", replace: "&reg;" },
  { reg: "™", replace: "&trade;" },
  { reg: "‘", replace: "&lsquo;" },
  { reg: "’", replace: "&rsquo;" },
  { reg: "“", replace: "&ldquo;" },
  { reg: "”", replace: "&rdquo;" },
  { reg: "#", replace: "&#35;" },
  { reg: "©", replace: "&copy;" },
  { reg: "@", replace: "&commat;" },
  { reg: "$", replace: "&dollar;" },
  { reg: "\\(", replace: "&#40;" },
  { reg: "\\)", replace: "&#41;" },
  { reg: "<", replace: "&lt;" },
  { reg: ">", replace: "&gt;" },
  { reg: "…", replace: "&hellip;" },
  { reg: "-", replace: "&#45;" },*/
  { reg: "'", replace: "&apos;" },
  /* { reg: "\\*", replace: "&#42;" },
  { reg: ",", replace: "&sbquo;" },*/
];
 
//replaces special characters with their html equivalent
function htmlChar(string, reverse = false) {
  let s = string;
  if (reverse) {
    replaceChar.forEach(function (obj) {
      const regEx = new RegExp(obj.replace + "(?!([^<]+)?>)", "g");
      s = s.replace(regEx, obj.reg);
    });
  } else {
    replaceChar.forEach(function (obj) {
      const regEx = new RegExp(obj.reg + "(?!([^<]+)?>)", "g");
      s = s.replace(regEx, obj.replace);
    });
  }
  return s;
}
 
function triggerCheck() {
  let result = true;
  if (currentActionIndex >= actionQueueArray.length) {
    if (queueLoop && actionQueueArray.length > 0) {
      currentActionIndex = 0;
      updateQueue();
      return;
    } else {
      clearInterval(triggerCheckInterval);
      triggerCheckInterval = null;
      updateTextColour("stop");
      return;
    }
  }
  if (actionQueueArray[currentActionIndex].trigger()) {
    actionQueueArray[currentActionIndex].action.forEach((action, i) => {
      result = action.start();
      document.getElementById(actionQueueArray[currentActionIndex].elementID).children[1].children[
        i
      ].children[1].children[0].style.display = result ? "none" : "";
    });
    currentActionIndex + 1 >= actionQueueArray.length && queueLoop ? (currentActionIndex = 0) : currentActionIndex++;
    updateQueue();
  }
}
 
/**
 * Updates colour and text in sidebar
 * @param {string} type ("start" || "stop" || "pause")
 */
function updateTextColour(type) {
  switch (type) {
    case "start":
      document.getElementById("current-queue").style.color = "#46c37b";
      document.getElementById("current-queue").innerHTML = "running";
      break;
    case "stop":
      document.getElementById("current-queue").style.color = "#d26a5c";
      document.getElementById("current-queue").innerHTML = "inactive";
      break;
    case "pause":
      document.getElementById("current-queue").style.color = "#f3b760";
      document.getElementById("current-queue").innerHTML = "paused";
  }
}
 
function updateQueue() {
  actionQueueArray.forEach((action, index) => {
    const element = document.getElementById(action.elementID);
    if (index === currentActionIndex) {
      for (let i = 0; i < element.children[1].children.length; i++) {
        element.children[1].children[i].children[1].children[0].style.display = "none";
      }
      element.style.backgroundColor = "#385a0b";
    } else element.style.backgroundColor = "";
  });
}
 
function toggleLoop(start) {
  queueLoop = start;
}
 
function togglePause() {
  queuePause = !queuePause;
  if (queuePause) {
    clearInterval(triggerCheckInterval);
    triggerCheckInterval = null;
    document.getElementById("aq-pause").innerHTML = "Unpause";
    document.getElementById("aq-pause").classList.add("aq-green");
    document.getElementById("aq-pause").classList.remove("aq-yellow");
    updateTextColour("pause");
  } else {
    if (actionQueueArray.length > 0) {
      updateQueue();
      triggerCheckInterval = setInterval(() => {
        triggerCheck();
      }, 1000);
      updateTextColour("start");
    } else {
      updateTextColour("stop");
    }
    document.getElementById("aq-pause").innerHTML = "Pause";
    document.getElementById("aq-pause").classList.add("aq-yellow");
    document.getElementById("aq-pause").classList.remove("aq-green");
  }
}
 
let loadCheckInterval = setInterval(() => {
  if (isLoaded) {
    clearInterval(loadCheckInterval);
    loadAQ();
  }
}, 200);
 
function autoSave() {
  const saveData = {
    index: currentActionIndex,
    data: [],
    loop: queueLoop,
    mastery: manageMasteryInterval === null ? false : true,
  };
  for (const action of actionQueueArray) {
    let actionList = [];
    action.action.forEach((a) => actionList.push(a.data));
    saveData.data.push([...action.data, actionList]);
  }
  window.localStorage.setItem("AQSAVE" + currentCharacter, JSON.stringify(saveData));
  window.localStorage.setItem("AQMASTERY", JSON.stringify(masteryConfig));
}
 
//autosave every ~minute
setInterval(() => {
  autoSave();
}, 59550);
 
function loadLocalSave() {
  const obj = JSON.parse(window.localStorage.getItem("AQSAVE" + currentCharacter));
  const config = JSON.parse(window.localStorage.getItem("AQMASTERY"));
  if (config != null) {
    for (const skill in config) {
      masteryConfig[skill] = config[skill];
    }
  }
 
  if (obj === null) return;
  if (obj.loop) {
    toggleLoop(true);
    document.getElementById("aq-loop-enable").checked = true;
  }
  if (obj.mastery) {
    toggleMastery(true);
    document.getElementById("aq-mastery-enable").checked = true;
  }
  if (obj.data.length > 0) togglePause();
  currentActionIndex = obj.index;
  for (const params of obj.data) {
    if (params.length == 6) {
      const newAction = new Action(...params.slice(0, 5));
      params[5].forEach((data) => {
        newAction.action.push({
          elementID: `AQ${nameIncrement++}`,
          data,
          start: setAction(...data),
          description: actionDescription(...data),
        });
      });
      addToQueue(newAction);
    } else {
      addToQueue(new Action(...params));
    }
  }
  updateQueue();
}
 
function setCurrentAction(id) {
  const index = actionQueueArray.findIndex((a) => a.elementID == id);
  if (index >= 0) {
    currentActionIndex = index;
    updateQueue();
  }
}
 
function importActions() {
  const string = document.getElementById("aq-pastebin").value;
  if (!queuePause && actionQueueArray.length === 0) togglePause();
  let arr = [];
  try {
    arr = JSON.parse(string.trim());
    if (!Array.isArray(arr)) return false;
    for (const params of arr) {
      try {
        let newAction = null;
        if (params.length == 10) {
          newAction = new Action(...params);
        } else if (params.length == 6) {
          newAction = new Action(...params.slice(0, 5));
          params[5].forEach((data) => {
            newAction.action.push({
              elementID: `AQ${nameIncrement++}`,
              data,
              start: setAction(...data),
              description: actionDescription(...data),
            });
          });
        }
        if (
          !newAction.description.includes("undefined") &&
          !newAction.description.includes("null") &&
          typeof newAction.trigger == "function" &&
          newAction.action.every((a) => {
            return (
              !a.description.includes("undefined") && !a.description.includes("null") && typeof a.start == "function"
            );
          })
        )
          addToQueue(newAction);
      } catch {}
    }
    document.getElementById("aq-pastebin").value = "";
    updateQueue();
  } catch (e) {
    console.error(e);
  } finally {
    return false;
  }
}
 
function downloadActions() {
  const saveData = [];
  for (const action of actionQueueArray) {
    let actionList = [];
    action.action.forEach((a) => actionList.push(a.data));
    saveData.push([...action.data, actionList]);
  }
  let file = new Blob([JSON.stringify(saveData)], {
    type: "text/plain",
  });
  if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(file, "Melvor_Action_Queue.txt");
  else {
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = "Melvor_Action_Queue.txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
 
function updateMasteryLvl(skill) {
  MASTERY[skill].xp.forEach((xp, i) => {
    let level = 1;
    while (xp >= lvlIndex[level + 1]) level++;
    masteryClone[skill].lvl[i] = level;
  });
  masteryClone[skill].completed = masteryClone[skill].lvl.every((a) => a == 99);
  masteryClone[skill].pool = MASTERY[skill].pool;
}
 
function manageMastery() {
  for (const skill in MASTERY) {
    //token claiming
    const maxPool = MASTERY[skill].xp.length * 500000;
    const bankID = getBankId(CONSTANTS.item[`Mastery_Token_${SKILLS[skill].name}`]);
    if (bankID !== -1 && bank[bankID].qty > 0 && MASTERY[skill].pool < maxPool * 0.999) {
      const maxTokens = Math.floor(((maxPool - MASTERY[skill].pool) * 1000) / maxPool);
      {
        let itemID = CONSTANTS.item[`Mastery_Token_${SKILLS[skill].name}`];
        let qtyToUse = Math.min(bank[bankID].qty, maxTokens);
        let totalXpToAdd = Math.floor(getMasteryPoolTotalXP(skill) * 0.001) * qtyToUse;
        addMasteryXPToPool(skill, totalXpToAdd, false, true);
        updateItemInBank(bankID, itemID, -qtyToUse);
      }
    }
 
    //exit if pool unchanged
    if (
      masteryClone[skill].pool == MASTERY[skill].pool &&
      MASTERY[skill].pool < maxPool * masteryConfig[skill].checkpoint
    )
      continue;
 
    //exit if maxed mastery
    updateMasteryLvl(skill);
    if (masteryClone[skill].completed) continue;
 
    //choose masteryID
    let masteryID = 0;
    if (!masteryConfig[skill].prio || masteryClone[skill].lvl.some((a) => a < 60)) {
      for (let i = 1; i < MASTERY[skill].xp.length; i++) {
        if (MASTERY[skill].xp[i] < MASTERY[skill].xp[masteryID]) masteryID = i;
      }
    } else {
      const noncompletedPrio = masteryConfig[skill].arr.filter(
        (a) => masteryClone[skill].lvl[a] < masteryConfig[skill].base
      );
      if (noncompletedPrio.length == 0) {
        //choose lowest of nonprio or lowest of prio if nonprio maxed
        let arr = MASTERY[skill].xp.map((a, i) => i);
        for (const x of masteryConfig[skill].arr) arr[x] = null;
        arr = arr.filter((a) => a != null);
        if (arr.every((a) => masteryClone[skill].lvl[a] >= 99)) arr = [...masteryConfig[skill].arr];
        arr.sort((a, b) => MASTERY[skill].xp[a] - MASTERY[skill].xp[b]);
        masteryID = arr[0];
      } else {
        for (const id of masteryConfig[skill].arr) {
          if (MASTERY[skill].xp[id] == lvlIndex[masteryConfig[skill].base]) {
            //choose lowest of [nonprio, noncompleted prio]
            let arr = MASTERY[skill].xp.map((a, i) => i);
            for (const x of masteryConfig[skill].arr) arr[x] = null;
            arr = arr.filter((a) => a != null);
            arr.push(...noncompletedPrio);
            arr.sort((a, b) => MASTERY[skill].xp[a] - MASTERY[skill].xp[b]);
            masteryID = arr[0];
            break;
          } else if (masteryClone[skill].lvl[id] < masteryConfig[skill].base) {
            masteryID = id;
            break;
          }
        }
      }
    }
    if (masteryID == undefined) continue;
 
    //level up chosen mastery
    if (
      MASTERY[skill].xp[masteryID] < 13034432 &&
      (MASTERY[skill].pool == maxPool ||
        MASTERY[skill].pool - lvlIndex[masteryClone[skill].lvl[masteryID] + 1] + MASTERY[skill].xp[masteryID] >
          masteryConfig[skill].checkpoint * maxPool)
    ) {
      if (masteryPoolLevelUp > 1) masteryPoolLevelUp = 1;
      let xp = lvlIndex[masteryClone[skill].lvl[masteryID] + 1] - MASTERY[skill].xp[masteryID];
      if (MASTERY[skill].pool >= xp) {
        {
          let currentLevel = masteryClone[skill].lvl[masteryID];
          MASTERY[skill].xp[masteryID] += xp;
          if (exp.xp_to_level(MASTERY[skill].xp[masteryID]) - 1 > currentLevel && currentLevel < 99) {
            if (skill === CONSTANTS.skill.Woodcutting && currentLevel >= 98) updateWCRates();
          }
          updateMasteryProgress(skill, masteryID);
        }
        MASTERY[skill].pool -= xp;
        updateMasteryPoolProgress(skill);
      }
      if (skill === CONSTANTS.skill.Fishing) {
        for (let i = 0; i < fishingAreas.length; i++) {
          for (let f = 0; f < fishingAreas[i].fish.length; f++) {
            if (fishingAreas[i].fish[f] === masteryID) {
              updateFishingMastery(i, f);
              break;
            }
          }
        }
      }
    }
  }
}
 
function toggleMastery(start) {
  if (start && manageMasteryInterval === null) {
    manageMasteryInterval = setInterval(() => {
      manageMastery();
    }, 1000);
  } else if (!start) {
    clearInterval(manageMasteryInterval);
    manageMasteryInterval = null;
  }
}
 
function addToQueue(obj) {
  actionQueueArray.push(obj);
  document.getElementById("aq-item-container").insertAdjacentHTML(
    "beforeend",
    `<div class="aq-item" id="${obj.elementID}" draggable="true">
  <div class="aq-item-inner">
    <p style="margin: auto 0">${obj.description}</p>
    <div style="min-width: 170px; min-height: 39px; display: flex; justify-content: flex-end;">
      <button type="button" class="btn aq-arrow aq-grey" style="font-size: 0.875rem;">select</button>
      <button type="button" class="btn aq-arrow aq-grey" style="padding: 0 0.1rem 0.2rem 0.1rem;">+</button>
      <button type="button" class="btn aq-arrow aq-grey" style="padding:0 0.09rem;">
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2929 9.8299L19.9409 9.18278C21.353 7.77064 21.353 5.47197 19.9409 4.05892C18.5287 2.64678 16.2292 2.64678 14.817 4.05892L14.1699 4.70694L19.2929 9.8299ZM12.8962 5.97688L5.18469 13.6906L10.3085 18.813L18.0201 11.0992L12.8962 5.97688ZM4.11851 20.9704L8.75906 19.8112L4.18692 15.239L3.02678 19.8796C2.95028 20.1856 3.04028 20.5105 3.26349 20.7337C3.48669 20.9569 3.8116 21.046 4.11851 20.9704Z" fill="currentColor"></path>
        </svg>
      </button>
      <button type="button" class="btn aq-delete btn-danger">X</button>
    </div>
  </div>
  <div style="min-height: 39px; padding-left: 10px;"></div>
</div>`
  );
 
  //add button clicks
  const buttons = document.getElementById(obj.elementID).children[0].children[1].children;
  buttons[0].addEventListener("click", () => setCurrentAction(obj.elementID));
  buttons[1].addEventListener("click", () => editQueue(obj.elementID, "add"));
  buttons[2].addEventListener("click", () => editQueue(obj.elementID, "triggers"));
  buttons[3].addEventListener("click", () => deleteAction(obj.elementID, "trigger"));
 
  //add tooltips
  tooltips[obj.elementID] = [
    tippy(document.getElementById(obj.elementID).children[0].children[1].children[0], {
      content: "Set as current trigger",
      animation: false,
    }),
    tippy(document.getElementById(obj.elementID).children[0].children[1].children[1], {
      content: "Add action",
      animation: false,
    }),
    tippy(document.getElementById(obj.elementID).children[0].children[1].children[2], {
      content: "Edit trigger",
      animation: false,
    }),
    tippy(document.getElementById(obj.elementID).children[0].children[1].children[3], {
      content: "Delete trigger & actions",
      animation: false,
    }),
  ];
  //add eventlisteners for dragging trigger block
  const element = document.getElementById(obj.elementID);
  element.addEventListener("dragstart", () => {
    element.classList.add("t-drag");
  });
  element.addEventListener("dragend", () => {
    reorderQueue();
    element.classList.remove("t-drag");
  });
 
  //append html for each action
  obj.action.forEach((action) => {
    document.getElementById(obj.elementID).children[1].insertAdjacentHTML(
      "beforeend",
      `<div id='${action.elementID}' class="aq-item-inner" draggable="true">
  <p style="margin: auto 0">${action.description}</p>
  <div style="min-width: 170px; min-height: 39px; display: flex; justify-content: flex-end;">
    <small style="display: none; margin: auto 0.25rem">action failed</small>
    <button type="button" class="btn aq-arrow aq-grey" style="padding:0 0.09rem;">
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2929 9.8299L19.9409 9.18278C21.353 7.77064 21.353 5.47197 19.9409 4.05892C18.5287 2.64678 16.2292 2.64678 14.817 4.05892L14.1699 4.70694L19.2929 9.8299ZM12.8962 5.97688L5.18469 13.6906L10.3085 18.813L18.0201 11.0992L12.8962 5.97688ZM4.11851 20.9704L8.75906 19.8112L4.18692 15.239L3.02678 19.8796C2.95028 20.1856 3.04028 20.5105 3.26349 20.7337C3.48669 20.9569 3.8116 21.046 4.11851 20.9704Z" fill="currentColor"></path>
      </svg>
    </button>
    <button type="button" class="btn aq-delete btn-danger">X</button>
  </div>
</div>`
    );
    //add tooltips
    tooltips[action.elementID] = [
      tippy(document.getElementById(action.elementID).children[1].children[1], {
        content: "Edit Action",
        animation: false,
      }),
      tippy(document.getElementById(action.elementID).children[1].children[2], {
        content: "Delete Action",
        animation: false,
      }),
    ];
    //add eventlisteners for dragging actions
    const element = document.getElementById(action.elementID);
    element.addEventListener("dragstart", () => {
      element.classList.add("a-drag");
    });
    element.addEventListener("dragend", () => {
      element.classList.remove("a-drag");
    });
    //add button clicks
    const buttons = element.children[1].children;
    buttons[1].addEventListener("click", () => editQueue(action.elementID, "actions"));
    buttons[2].addEventListener("click", () => deleteAction(action.elementID, "action"));
  });
 
  //add eventlistener for dragging actions within trigger blocks
  const container = document.getElementById(obj.elementID).children[1];
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const draggable = document.querySelector(".a-drag");
    if (!draggable) return;
    const afterElement = getDragAfterElement(container, e.clientY, ".aq-item-inner");
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
 
  if (triggerCheckInterval === null && !queuePause) {
    currentActionIndex = 0;
    updateQueue();
    triggerCheckInterval = setInterval(() => {
      triggerCheck();
    }, 1000);
    updateTextColour("start");
  }
}
 
function deleteAction(id, type) {
  tooltips[id].forEach((a) => a.destroy());
  delete tooltips[id];
  if (type == "trigger") {
    const i = actionQueueArray.findIndex((a) => a.elementID == id);
    if (i < 0) return;
    for (const action of actionQueueArray[i].action) {
      tooltips[action.elementID].forEach((a) => a.destroy());
      delete tooltips[action.elementID];
    }
    //remove from array
    actionQueueArray.splice(i, 1);
    if (currentActionIndex > i) currentActionIndex--;
    updateQueue();
  } else if (type == "action") {
    let i = 0;
    for (const trigger of actionQueueArray) {
      i = trigger.action.findIndex((a) => a.elementID == id);
      if (i < 0) continue;
      trigger.action.splice(i, 1);
      break;
    }
  }
  //remove html
  const element = document.getElementById(id);
  if (element) element.remove();
}
 
function addAction(id, actionCategory, actionName, skillItem, skillItem2, qty) {
  let elementID = `AQ${nameIncrement++}`;
  let description = actionDescription(actionCategory, actionName, skillItem, skillItem2, qty);
  actionQueueArray
    .find((a) => a.elementID == id)
    .action.push({
      elementID,
      data: [actionCategory, actionName, skillItem, skillItem2, qty],
      start: setAction(actionCategory, actionName, skillItem, skillItem2, qty),
      description,
    });
  document.getElementById(id).children[1].insertAdjacentHTML(
    "beforeend",
    `<div id='${elementID}' class="aq-item-inner" draggable="true">
  <p style="margin: auto 0">${description}</p>
  <div style="min-width: 170px; min-height: 39px; display: flex; justify-content: flex-end;">
    <small style="display: none; margin: auto 0.25rem">action failed</small>
    <button type="button" class="btn aq-arrow aq-grey" style="padding:0 0.09rem;">
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2929 9.8299L19.9409 9.18278C21.353 7.77064 21.353 5.47197 19.9409 4.05892C18.5287 2.64678 16.2292 2.64678 14.817 4.05892L14.1699 4.70694L19.2929 9.8299ZM12.8962 5.97688L5.18469 13.6906L10.3085 18.813L18.0201 11.0992L12.8962 5.97688ZM4.11851 20.9704L8.75906 19.8112L4.18692 15.239L3.02678 19.8796C2.95028 20.1856 3.04028 20.5105 3.26349 20.7337C3.48669 20.9569 3.8116 21.046 4.11851 20.9704Z" fill="currentColor"></path>
      </svg>
    </button>
    <button type="button" class="btn aq-delete btn-danger">X</button>
  </div>
</div>`
  );
  const element = document.getElementById(elementID);
  //add tooltips
  tooltips[elementID] = [
    tippy(element.children[1].children[1], {
      content: "Edit Action",
      animation: false,
    }),
    tippy(element.children[1].children[2], {
      content: "Delete Action",
      animation: false,
    }),
  ];
 
  //add eventlisteners for dragging
  element.addEventListener("dragstart", () => {
    element.classList.add("a-drag");
  });
  element.addEventListener("dragend", () => {
    element.classList.remove("a-drag");
  });
  //add button clicks
  const buttons = element.children[1].children;
  buttons[1].addEventListener("click", () => editQueue(elementID, "actions"));
  buttons[2].addEventListener("click", () => deleteAction(elementID, "action"));
}
 
function getDragAfterElement(container, y, type) {
  const not = type == "aq-item" ? ".t-drag" : ".a-drag";
  const elements = [...container.querySelectorAll(`${type}:not(${not})`)];
  return elements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
 
function reorderQueue() {
  const targetIndex = actionQueueArray[currentActionIndex].elementID;
  //remove stray dragging classes
  document
    .getElementById("aq-item-container")
    .querySelectorAll(".a-drag")
    .forEach((a) => a.classList.remove("a-drag"));
  document
    .getElementById("aq-item-container")
    .querySelectorAll(".t-drag")
    .forEach((a) => a.classList.remove("t-drag"));
  //sort triggers
  const triggerOrder = {};
  [...document.getElementById("aq-item-container").children].forEach((item, index) => (triggerOrder[item.id] = index));
  actionQueueArray.sort((a, b) => triggerOrder[a.elementID] - triggerOrder[b.elementID]);
  //sort actions
  const actionList = actionQueueArray.reduce((a, b) => a.concat(b.action), []);
  let increment = -1;
  [...document.getElementById("aq-item-container").querySelectorAll(".aq-item-inner")].forEach((item) => {
    if (item.id == "") {
      increment++;
      actionQueueArray[increment].action = [];
    } else {
      actionQueueArray[increment].action.push(actionList.find((a) => a.elementID == item.id));
    }
  });
  //reorder currentActionIndex
  currentActionIndex = actionQueueArray.findIndex((a) => a.elementID == targetIndex);
}
 
function editQueue(id, type) {
  cancelEdit(); //reset form
  currentlyEditing = { id, type };
  let inputArray = [];
  let obj = options[type];
  //set inputArray
  if (type == "triggers") {
    inputArray = actionQueueArray.find((a) => a.elementID == id).data.filter((a) => a !== null && a !== "");
    document.getElementById("aq-edit-form").innerHTML = "Edit Trigger";
  } else if (type == "actions") {
    document.getElementById("aq-edit-form").innerHTML = "Edit Action";
    for (const item of actionQueueArray) {
      if (item.action.find((a) => a.elementID == id)) {
        inputArray = item.action.find((a) => a.elementID == id).data.filter((a) => a !== null && a !== "");
        break;
      }
    }
  } else {
    document.getElementById("aq-edit-form").innerHTML = "New Action";
    obj = options.actions;
  }
  //set datalist for category
  document.getElementById("aq-listC0").innerHTML = "";
  Object.keys(obj).forEach((e) => {
    document.getElementById("aq-listC0").insertAdjacentHTML("beforeend", `<option>${e}</option>`);
  });
 
  //populate text boxes to edit
  for (let i = 0; i < inputArray.length; i++) {
    let textBox;
    if (/^\d{1,10}$/.test(inputArray[i])) {
      textBox = document.getElementById("aq-numC");
    } else {
      textBox = document.getElementById(`aq-textC${i}`);
      //set datalist
      document.getElementById(`aq-listC${i}`).innerHTML = "";
      Object.keys(obj).forEach((e) => {
        document.getElementById(`aq-listC${i}`).insertAdjacentHTML("beforeend", `<option>${e}</option>`);
      });
      obj = obj[inputArray[i]];
    }
    textBox.value = htmlChar(inputArray[i], true);
    textBox.type = "text";
    validInputs.C[i] = inputArray[i];
  }
  const y = Math.max(document.getElementById(id).getBoundingClientRect().top - 255, 0);
  document.getElementById("aq-edit-container").style.top = `${y}px`;
  document.getElementById("aq-edit-container").style.display = "";
}
 
function cancelEdit() {
  document.getElementById("aq-edit-container").style.display = "none";
  resetForm(["C"]);
}
 
function submitEdit() {
  const a = document.getElementById("aq-edit-form").innerHTML.includes("Trigger");
  const arr = [];
  for (let i = 0; i < validInputs.C.length; i++) arr.push(htmlChar(document.getElementById(`aq-textC${i}`).value));
  if (a) arr.pop();
  arr.push(document.getElementById(`aq-numC`).value);
  if (a) arr.splice(["≥", "≤", ""].includes(arr[2]) ? 3 : 2, 0, "");
 
  if (
    validateInput(
      a ? options.triggers : options.actions,
      arr.filter((a) => a !== "")
    )
  ) {
    if (currentlyEditing.type == "add") {
      addAction(currentlyEditing.id, ...arr);
    } else if (currentlyEditing.type == "triggers") {
      const action = new Action(...arr);
      const i = actionQueueArray.findIndex((a) => a.elementID == currentlyEditing.id);
      actionQueueArray[i].description = action.description;
      actionQueueArray[i].trigger = action.trigger;
      actionQueueArray[i].data = action.data;
      document.getElementById(currentlyEditing.id).children[0].children[0].innerHTML = action.description;
    } else {
      const description = actionDescription(...arr);
      const start = setAction(...arr);
      for (const item of actionQueueArray) {
        const action = item.action.find((a) => a.elementID == currentlyEditing.id);
        if (action) {
          action.data = arr;
          action.start = start;
          action.description = description;
          document.getElementById(currentlyEditing.id).children[0].innerHTML = description;
          break;
        }
      }
    }
    cancelEdit();
  }
  return false;
}
 
function updateMasteryConfig(changeSkill = true) {
  if (changeSkill) {
    if (masteryConfigChanges.skill != null) {
      updateMasteryPriority();
      let arr =
        masteryConfigChanges.arr == null
          ? [...masteryConfig[masteryConfigChanges.skill].arr]
          : [...masteryConfigChanges.arr];
      masteryConfig[masteryConfigChanges.skill] = {
        checkpoint: masteryConfigChanges.checkpoint,
        prio: masteryConfigChanges.prio,
        base: masteryConfigChanges.base,
        arr,
      };
    }
    const skill = document.getElementById("aq-skill-list").value;
    document.getElementById("aq-checkpoint-list").value = masteryConfig[skill].checkpoint.toString();
    document.getElementById("aq-mastery-strategy").value = masteryConfig[skill].prio.toString();
    document.getElementById("aq-base").disabled = !masteryConfig[skill].prio;
    document.getElementById("aq-mastery-array").disabled = !masteryConfig[skill].prio;
    document.getElementById("aq-base").value = masteryConfig[skill].base.toString();
    document.getElementById("aq-mastery-array").value = JSON.stringify(masteryConfig[skill].arr);
    masteryConfigChanges.skill = null;
  } else {
    masteryConfigChanges.skill = document.getElementById("aq-skill-list").value;
    masteryConfigChanges.checkpoint = parseFloat(document.getElementById("aq-checkpoint-list").value);
    masteryConfigChanges.prio = JSON.parse(document.getElementById("aq-mastery-strategy").value);
    masteryConfigChanges.base = parseInt(document.getElementById("aq-base").value);
    updateMasteryPriority();
    document.getElementById("aq-base").disabled = !JSON.parse(document.getElementById("aq-mastery-strategy").value);
    document.getElementById("aq-mastery-array").disabled = !JSON.parse(
      document.getElementById("aq-mastery-strategy").value
    );
  }
}
 
function updateMasteryPriority() {
  const string = document.getElementById("aq-mastery-array").value;
  let arr = null;
  try {
    arr = JSON.parse(string.trim());
  } catch {}
  if (!Array.isArray(arr)) return (masteryConfigChanges.arr = null);
  arr = [...new Set(arr)].filter((a) => typeof MASTERY[masteryConfigChanges.skill].xp[a] == "number");
  masteryConfigChanges.arr = [...arr];
}
 
function masteryPopup(open) {
  if (open) {
    masteryConfigChanges.skill = null;
    updateMasteryConfig();
    document.getElementById("aq-mastery-config-container").style.display = "";
  } else {
    updateMasteryConfig();
    document.getElementById("aq-mastery-config-container").style.display = "none";
  }
}
 
/**
 * Function to change active prayers
 * @param {Array} choice array of prayer IDs
 */
function changePrayers(choice = []) {
  for (const i of player.activePrayers.entries()) {
    choice.includes(i[0])
      ? choice.splice(
          choice.findIndex((a) => a == i[0]),
          1
        )
      : choice.unshift(i[0]);
  }
  for (const prayer of choice) player.togglePrayer(prayer);
}
 
/**
 * Function to delete every action
 */
function clearQueue() {
  for (let i = actionQueueArray.length - 1; i >= 0; i--) {
    deleteAction(actionQueueArray[i].elementID, "trigger");
  }
}