// ==UserScript==
// @name         Bandits farm
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Smash all bandits!
// @author       You
// @match        https://*.the-west.ru.com/game.php
// @match        https://www.the-west.ru.com/*
// @icon         https://westru.innogamescdn.com/images/items/right_arm/boones_axe.png?5
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494033/Bandits%20farm.user.js
// @updateURL https://update.greasyfork.org/scripts/494033/Bandits%20farm.meta.js
// ==/UserScript==

(function DuelBandits() {
  let isRunning = false;
  let needToLose = false;
  let duelIntervalId;
  let checkCharacterIntervalId;
  const stoppedIcon = 'https://westru.innogamescdn.com/images/items/right_arm/sharp_axe.png?5';
  const runningIcon = 'https://westru.innogamescdn.com/images/items/right_arm/boones_axe.png?5';

  const buffs = {
    cakeDecoration: 53338000,
    guarana: 2129000,
    mate: 2130000,
  }

  function init() {
    const div = $('<div class="ui_menucontainer" />');
    const link = $(
      '<div class="menulink"' +
      ' id="bandits-farm"' +
      ' title="Bandits farm"' +
      ' ></div>'
    )

    link
      .css('background-image', `url(${stoppedIcon})`)
      .css('background-size', 'contain');

    $(link).on('click', () => toggleDuels());

    $('#ui_menubar').append(
      div.append(link).append('<div class="menucontainer_bottom" />'),
    );
  }
  async function toggleDuels() {
    clearInterval(duelIntervalId);
    clearInterval(checkCharacterIntervalId);
    if (isRunning) {
      isRunning = false;
      $('#bandits-farm').css('background-image', `url(${stoppedIcon})`);
    } else {
      isRunning = true;
      $('#bandits-farm').css('background-image', `url(${runningIcon})`);
      await duel();
      duelIntervalId = setInterval(duel, 115 * 1000);
      checkCharacterIntervalId = setInterval(checkCharacter, 10000);
    }
  }

  async function duel() {
    await equipSetForExperience();

    if (!canDuel()) {
      console.log('Bandits_farm Not enough energy or health. Try to restore it.');
      await checkCharacter();
    }
    if (!canDuel()) {
      console.log('Bandits_farm Still cant duel');
      await equipSetForRegen();
      return;
    }

    console.log('Bandits_farm duels started');

    if (needToLose) {
      await equipSetForLose();
      await loseBandits();
    }

    await equipSetForExperience();
    await winBandits();

    await equipSetForRegen();
    console.log('Bandits_farm duels ended');
  }

  async function winBandits() {
    try {
      const result = await AjaxAsync.remoteCall('duel', 'get_data', {});
      if (!result.error) {
        const npcs = result.npcs.npcs.filter(npc => Date.now() < npc.arrival * 1000);
        for (let i = 0; i < npcs.length; i++) {
          if (canDuel()) {
            const healthBefore = Character.health;
            const duelResult = await makeDuel(npcs[i].duelnpc_id);
            await AjaxAsync.wait(500);
            if (duelResult) {
              const lostHealthPercents = (healthBefore - duelResult.health) / Character.maxHealth * 100;
              if (lostHealthPercents > 25) {
                console.log(`Bandits_farm Lost ${lostHealthPercents}% of Hp. Need to lose duels`);
                needToLose = true;
              }
              if (!haveMoreHalfHp() && result.npcs.difficulty > 30) {
                console.log('Bandits_farm Lost more than 50% of Hp. Need to lose duels');
                needToLose = true;
                break;
              }
            }
          }
          await checkCharacter();
        }
      }
    } catch (e) {
      console.log('Bandits_farm duelWithBandits error:', e);
    }
  }

  async function loseBandits() {
    try {
      const result = await AjaxAsync.remoteCall('duel', 'get_data', {});
      if (!result.error) {
        const npcs = result.npcs.npcs
          .filter(npc => Date.now() < npc.arrival * 1000)
          .sort((a, b) => a.aim - b.aim);
        const difficulty = Math.floor(result.npcs.difficulty / 3);
        const energy = Math.floor(Character.energy / 5);
        const count = Math.min(difficulty, energy, 10);
        for (let i = 0; i < count; i++) {
          if (haveEnergyForDuel() && Character.health > 1000) {
            await makeDuel(npcs[0].duelnpc_id);
          }
          await checkCharacter();
        }
        needToLose = false;
      }
    } catch (e) {
      console.log('Bandits_farm duelWithBandits error:', e);
    }
  }

  async function makeDuel(id) {
    console.log('Bandits_farm Dueling with bandit', id);
    const result = await AjaxAsync.remoteCall('duel', 'duel_npc', {duelnpc_id: id});
    if (result.error) return;

    Character.updateDailyTask('npcduels');
    Character.setMoney(result.money);
    Character.setDuelMotivation(result.motivation);
    Character.setNPCDuelMotivation(result.motivation_npc);
    Character.setEnergy(Math.floor(result.energy));
    Character.setHealth(Math.floor(result.health));
    Character.setLevel(result.level);
    Character.setExperience(result.experience);

    return result;
  }

  function canDuel() {
    return haveEnergyForDuel() && haveMoreHalfHp() && Character.npcDuelMotivation > 0.75;
  }

  function haveMoreHalfHp() {
    let missedHealthPercents = 100 - Character.health / Character.maxHealth * 100;
    return missedHealthPercents < 50;
  }

  function haveEnergyForDuel() {
    return Character.energy >= 5;
  }

  async function checkCharacter() {
    let missedEnergyPercents = 100 - Character.energy / Character.maxEnergy * 100;

    if (Date.now() < Character.cooldown * 1000) return;

    let buff;
    if (!buff && missedEnergyPercents > 90) {
      buff = Bag.getItemByItemId(buffs.mate);
    }
    if (!buff && missedEnergyPercents >= 50 && Character.npcDuelMotivation > 0.75) {
      buff = Bag.getItemByItemId(buffs.guarana);
    }
    if (!buff && Character.npcDuelMotivation <= 0.75) {
      buff = Bag.getItemByItemId(buffs.cakeDecoration);
    }

    if (!buff || buff.obj == null) {
      // console.log('Bandits_farm No buffs found');
      return;
    }

    let itemId = buff.obj.item_id;
    console.log('Bandits_farm Хочу подбухнуть ' + ItemManager.get(itemId).name);
    const response = await AjaxAsync.remoteCall("itemuse", "use_item", {
      item_id: itemId,
      lastInvId: Bag.getLastInvId()
    });

    if (!response.error) {
      if (Character.cooldown != response.msg.cooldown) {
        Character.cooldown = response.msg.cooldown;
        EventHandler.signal("cooldown_changed");
      }
      if (response.msg.itemCooldown) {
        Bag.itemCooldown[itemId] = response.msg.itemCooldown;
        EventHandler.signal("cooldown_changed");
      }
      if (response.msg.itemLifetime) {
        EventHandler.signal('item_lifetime_changed', [itemId, response.msg.itemLifetime]);
      }
      console.log(response);
      Bag.updateChanges(response.msg.changes || {});
      for (let i = 0; i < response.msg.effects.length; i += 1) {
        let effect = response.msg.effects[i];
        switch (effect.type) {
          case'duel_motivation':
            if (effect.duelmotivation_npc) {
              Character.setNPCDuelMotivation(effect.duelmotivation_npc);
            }
            Character.setDuelMotivation(effect.duelmotivation);
            break;
          case'hitpoints':
            Character.setHealth(effect.hitpoints);
            break;
          case'energy':
            Character.setEnergy(effect.energy);
            break;
        }
      }
    }
  }

  async function equipSetForLose() {
    const bible = 868000;
    let loseDuelSet = TWDS.genCalc({}, {tough: 1, reflex: 1});
    await equipSet(loseDuelSet);
    await equipSet([bible]);
  }

  async function equipSetForExperience() {
    let regenSet = TWDS.genCalc({experience: 1}, {});
    await equipSet(regenSet);
  }

    async function equipSetForRegen() {
    let regenSet = TWDS.genCalc({regen:1}, {});
    await equipSet(regenSet);
  }

  async function equipSet(items) {
    for (var i = 0; i < items.length; i++) {
      if (!isWearing(items[i]))
        Wear.carry(Bag.getItemByItemId(items[i]));
    }
    await waitEquip(items);
  }

   async function waitEquip(items) {
    while (true) {
      if (isGearEquiped(items)) break;
      await AjaxAsync.wait(10);
    }

    return Promise.resolve(true);
  }

  function isWearing(itemId) {
    let type = ItemManager.get(itemId).type;
    if (Wear.wear[type] == undefined) return false;
    return Wear.wear[type].obj.item_id == itemId;
  }

  function isGearEquiped(items) {
    for (var i = 0; i < items.length; i++) {
      if (!isWearing(items[i])) return false;
    }
    return true;
  }

  $(document).ready(async () => {
    try {
      init();
    } catch (err) {
      console.log(err.stack);
    }
  });
})();
