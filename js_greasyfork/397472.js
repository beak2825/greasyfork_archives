// ==UserScript==
// @name         [OBSOLETE] Melvor Idle - Better Mastery Tokens
// @namespace    zuzuvelas/melvor
// @version      1.3
// @description  Makes mastery tokens unable to hit already mastered milestones
// @author       Zuzuvelas
// @source       https://github.com/zuzuvelas/User-Scripts
// @match        https://melvoridle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397472/%5BOBSOLETE%5D%20Melvor%20Idle%20-%20Better%20Mastery%20Tokens.user.js
// @updateURL https://update.greasyfork.org/scripts/397472/%5BOBSOLETE%5D%20Melvor%20Idle%20-%20Better%20Mastery%20Tokens.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
"use strict"

// THIS HAS BEEN RENDERED OBSOLETE IN MELVOR ALPHA v0.17+

/*
window.getUnmasteredMilestones = function (skill) {
  return skill.reduce((arr, milestone, idx) => {
    if (milestone.mastery < 99) {
      arr.push(idx)
    }
    return arr
  }, [])
}

window.claimToken = function (bankID, itemID, all = false) {
  let skill = items[itemID].skill
  let random
  let mastered = false
  let milestones

  if (all) {
    tokenInterval = setInterval(function() {
        claimToken(bankID, itemID);
    }, 250);
  } else {
    if (checkBankForItem(itemID)) {
      switch (skill) {
        case CONSTANTS.skill.Cooking:
          if (cookingMastery.some(skill => skill.mastery < 99)) {
            milestones = getUnmasteredMilestones(cookingMastery)
            random = milestones[Math.floor(Math.random() * milestones.length)]
            cookingMastery[random].masteryXP = masteryExp.level_to_xp(cookingMastery[random].mastery + 1)
            cookingMastery[random].mastery++
            levelUpMastery(skill, random, cookingMastery, true)
          } else { mastered = true }
          break

        case CONSTANTS.skill.Crafting:
          if (craftingMastery.some(skill => skill.mastery < 99)) {
            milestones = getUnmasteredMilestones(craftingMastery)
            random = milestones[Math.floor(Math.random() * milestones.length)]
            craftingMastery[random].masteryXP = masteryExp.level_to_xp(craftingMastery[random].mastery + 1)
            craftingMastery[random].mastery++
            levelUpMastery(skill, random, craftingMastery, true)
          } else { mastered = true }
          break

        case CONSTANTS.skill.Farming:
          if (farmingMastery.some(skill => skill.mastery < 99)) {
            milestones = getUnmasteredMilestones(farmingMastery)
            random = milestones[Math.floor(Math.random() * milestones.length)]
            farmingMastery[random].masteryXP = masteryExp.level_to_xp(farmingMastery[random].mastery + 1)
            farmingMastery[random].mastery++
            levelUpMastery(skill, random, farmingMastery, true)
          } else { mastered = true }
          break

        case CONSTANTS.skill.Firemaking:
          if (logsMastery.some(skill => skill.mastery < 99)) {
            milestones = getUnmasteredMilestones(logsMastery)
            random = milestones[Math.floor(Math.random() * milestones.length)]
            logsMastery[random].masteryXP = masteryExp.level_to_xp(logsMastery[random].mastery + 1)
            logsMastery[random].mastery++
            levelUpMastery(skill, random, logsMastery, true)
          } else { mastered = true }
          break

        case CONSTANTS.skill.Fishing:
          if (fishMastery.some(skill => skill.mastery < 99)) {
            milestones = getUnmasteredMilestones(fishMastery)
            random = milestones[Math.floor(Math.random() * milestones.length)]
            fishMastery[random].masteryXP = masteryExp.level_to_xp(fishMastery[random].mastery + 1)
            fishMastery[random].mastery++
            levelUpMastery(skill, random, fishMastery, true)
          } else { mastered = true }
          break

        case CONSTANTS.skill.Fletching:
          if (fletchingMastery.some(skill => skill.mastery < 99)) {
            milestones = getUnmasteredMilestones(fletchingMastery)
            random = milestones[Math.floor(Math.random() * milestones.length)]
            fletchingMastery[random].masteryXP = masteryExp.level_to_xp(fletchingMastery[random].mastery + 1)
            fletchingMastery[random].mastery++
            levelUpMastery(skill, random, fletchingMastery, true)
          } else { mastered = true }
          break

        case CONSTANTS.skill.Mining:
          if (miningOreMastery.some(skill => skill.mastery < 99)) {
            milestones = getUnmasteredMilestones(miningOreMastery)
            random = milestones[Math.floor(Math.random() * milestones.length)]
            miningOreMastery[random].masteryXP = masteryExp.level_to_xp(miningOreMastery[random].mastery + 1)
            miningOreMastery[random].mastery++
            levelUpMastery(skill, random, miningOreMastery, true)
          } else { mastered = true }
          break

        case CONSTANTS.skill.Runecrafting:
          if (runecraftingMastery.some(skill => skill.mastery < 99)) {
            milestones = getUnmasteredMilestones(runecraftingMastery)
            random = milestones[Math.floor(Math.random() * milestones.length)]
            runecraftingMastery[random].masteryXP = masteryExp.level_to_xp(runecraftingMastery[random].mastery + 1)
            runecraftingMastery[random].mastery++
            levelUpMastery(skill, random, runecraftingMastery, true)
          } else { mastered = true }
          break

        case CONSTANTS.skill.Smithing:
          if (smithingMastery.some(skill => skill.mastery < 99)) {
            milestones = getUnmasteredMilestones(smithingMastery)
            random = milestones[Math.floor(Math.random() * milestones.length)]
            smithingMastery[random].masteryXP = masteryExp.level_to_xp(smithingMastery[random].mastery + 1)
            smithingMastery[random].mastery++
            levelUpMastery(skill, random, smithingMastery, true)
          } else { mastered = true }
          break

        case CONSTANTS.skill.Thieving:
          if (thievingMastery.some(skill => skill.mastery < 99)) {
            milestones = getUnmasteredMilestones(thievingMastery)
            random = milestones[Math.floor(Math.random() * milestones.length)]
            thievingMastery[random].masteryXP = masteryExp.level_to_xp(thievingMastery[random].mastery + 1)
            thievingMastery[random].mastery++
            levelUpMastery(skill, random, thievingMastery, true)
          } else { mastered = true }
          break

        case CONSTANTS.skill.Woodcutting:
          if (treeMasteryData.some(skill => skill.mastery < 99)) {
            milestones = getUnmasteredMilestones(treeMasteryData)
            random = milestones[Math.floor(Math.random() * milestones.length)]
            treeMasteryData[random].masteryXP = masteryExp.level_to_xp(treeMasteryData[random].mastery + 1)
            treeMasteryData[random].mastery++
            levelUpMastery(skill, random, treeMasteryData, true)
          } else { mastered = true }
          break

        case CONSTANTS.skill.Herblore:
          if (herbloreMastery.some(skill => skill.mastery < 99)) {
            milestones = getUnmasteredMilestones(herbloreMastery)
            random = milestones[Math.floor(Math.random() * milestones.length)]
            herbloreMastery[random].masteryXP = masteryExp.level_to_xp(herbloreMastery[random].mastery + 1)
            herbloreMastery[random].mastery++
            levelUpMastery(skill, random, herbloreMastery, true)
          } else { mastered = true }
          break
      }
      
      if (mastered) {
        $.notify({
          message: '<img class="notification-img" src="assets/media/skills/' + setToLowercase(skillName[skill]) + '/' + setToLowercase(skillName[skill]) + '.svg"><span class="badge badge-success">You\'ve already mastered everything in ' + skillName[skill] + '!' + '</span>'
        }, {
          type: 'light',
          placement: {
            from: 'bottom',
            align: 'center'
          },
          delay: 1000,
          newest_on_top: true,
          animate: {
            enter: 'animated fadeInUp',
            exit: 'animated fadeOut'
          },
          template: '<div data-notify="container" class="col-12 col-md-6 text-center notify-event" role="alert"><span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        })
    
        clearInterval(tokenInterval)
        tokenInterval = null
      } else {
        updateItemInBank(bankID, itemID, -1)
      }
    } else {
      clearInterval(tokenInterval)
      tokenInterval = null
    }
  }
}
*/