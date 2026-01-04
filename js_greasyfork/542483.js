// ==UserScript==
// @name         Axeman
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @license MIT
// @description  Throws axe at enemy fortresses
// @author       Serhii T
// @include http*://*.the-west.*/game.php*
// @include http*://*.the-west.*.*/game.php*
// @require https://update.greasyfork.org/scripts/490628/1468386/Ajax%20Async%20Lib.js
// @icon         https://westru.innogamescdn.com/images/items/right_arm/sharp_tomahawk.png?5
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542483/Axeman.user.js
// @updateURL https://update.greasyfork.org/scripts/542483/Axeman.meta.js
// ==/UserScript==

(function() {
  const alliances = [
    341, // КС
    631, // ЧК
    692, // Альпийские стрелки
  ]
  // const ALLIANCE_ID = 903; // Гaрдарика (мир 1)
  // с 9 до 10, с 12 до 13, с 17 до 18  и с 20 до 21
  const AXE_HOURS = [9, 12, 17, 20]; // hours when axe can be thrown

  const AxeMan = {

    start: async function() {
      console.log('AxeMan started');
      while (Character.deposit >= 1500) {
        const delay = AxeMan.getRandomDelayForAxe();
        console.log('AxeMan: waiting', delay / 1000 / 60, 'minutes');
        await GameMap.AjaxAsync.wait(delay);
        const isWalkingToFort = TaskQueue.queue.some((task) => task.post.type === 'fort');
        const serverDate = get_server_date();
        const hours = serverDate.getHours();
        if (!isWalkingToFort && (AXE_HOURS.includes(hours))) {
          console.log('AxeMan: time for axe!');
          await GameMap.Beans.cancelJobs();
          await GameMap.Beans.run();
          const isAxeThrown = await AxeMan.initFortBattle();
          await GameMap.Beans.goWork();
          if (isAxeThrown) {
            console.log('AxeMan: axe thrown successfully');
            await GameMap.AjaxAsync.wait(60 * 60 * 1000); // wait 1 hour
          }
        }
      }
    },

    initFortBattle: async function() {
      const enemyAllianceForts = await AxeMan.getFortsOfAlliance();
      const activeFortsIds = await AxeMan.getActiveFortsIds();
      const activeForts = enemyAllianceForts.filter(fort => activeFortsIds.includes(fort.fort_id));
      console.log('AxeMan: initFortBattle activeForts', activeFortsIds);

      for (let i = 0; i < activeForts.length; i++) {
        const hasFreshAxe = await AxeMan.isFreshAxe(activeForts[i]);
        console.log('AxeMan: initFortBattle hasFreshAxe', hasFreshAxe);
        if (hasFreshAxe) {
          // don't throw axe if it was thrown less than 2 hours ago
          return false;
        }
      }

      const availableForts = enemyAllianceForts.filter(fort => !activeFortsIds.includes(fort.fort_id));
      console.log('AxeMan: initFortBattle availableForts', availableForts);

      for (let i = 0; i < availableForts.length; i++) {
        const isAxeThrown = await AxeMan.tryToThrowAxe(availableForts[i])
        if (isAxeThrown) {
          return true;
        }
      }
      return false;
    },

    getFortsOfAlliance: async function()  {
      const forts = [];
      for (let j = 0; j < alliances.length; j++) {
        const ALLIANCE_ID = alliances[j];
        console.log('AxeMan: getFortsOfAlliance checking alliance', ALLIANCE_ID);
        const resp = await GameMap.AjaxAsync.remoteCallMode('alliance', 'get_data', {
          alliance_id: ALLIANCE_ID,
        });
        if (!resp.error) {
          forts.push(...resp.data.forts);
        }
      }

      const myForts = Character.forts.map(fort => fort.fort_id);
      const availableForts = forts.filter(fort => !myForts.includes(fort.fort_id));
      // sort small, medium, large forts
      const sortedForts = availableForts.sort((a, b) => a.type - b.type);
      console.log('AxeMan: getFortsOfAlliance availableForts', sortedForts);
      return sortedForts;
    },

    // Check if axe was thrown 2 hours ago
    isFreshAxe: async function(fort) {
      const resp = await GameMap.AjaxAsync.remoteCallMode("fort", "display", {fortid: fort.fort_id, x: fort.x, y: fort.y});
      const { fortBattleStart } = resp.data.battle; // in seconds to start the battle
      const oneDay = 24 * 60 * 60; // seconds in one day
      const timeStep = 2 * 60 * 60; // seconds in two hours
      return oneDay - fortBattleStart < timeStep;
    },

    tryToThrowAxe: async function(fort) {
      const resp = await GameMap.AjaxAsync.remoteCallMode("fort", "display", {fortid: fort.fort_id, x: fort.x, y: fort.y});
      const { fortBattlesEnabled, fortBattleStart } = resp.data.battle;
      if (fortBattlesEnabled && !fortBattleStart) {
        try {
          let speedSet = GameMap.TWDS.speedcalc.doit(1, 0);
          await GameMap.Beans.equipSet(speedSet);
          await AxeMan.walkToFort(fort.fort_id);
          return await AxeMan.throwAxe(fort.fort_id);
        } catch (e) {
          console.error('AxeMan: Error while trying to throw axe at fort', e);
          return false;
        }
      } {
        return false;
      }
    },

    getActiveFortsIds: async function() {
      const resp = await GameMap.AjaxAsync.remoteCall('fort_overview', '', {
        offset: 0,
      });

      if (resp.js) {
        return resp.js
          .filter(data => data[3] === true) // is under attack
          .map(data => data[0]); // fort id
      } else {
        return [];
      }
    },

    walkToFort: async function(fortId) {
      TaskQueue.add(new TaskWalk(fortId, 'fort'));
      await GameMap.AjaxAsync.wait(20000);
      console.log('AxeMan: walkToFort waiting ', parseInt(TaskQueue.timeleft) / 60, 'minutes');
      await GameMap.AjaxAsync.wait(parseInt(TaskQueue.timeleft) * 1000); // convert seconds to milliseconds
      await GameMap.AjaxAsync.wait(10000);
      AxeMan.updateMyPosition();
      await GameMap.AjaxAsync.wait(10000);
    },

    throwAxe: async function(fortId) {
      const resp = await GameMap.AjaxAsync.remoteCall('fort_battlepage', 'declareWar', {fort_id: fortId});

      if (resp.error === undefined) {
        new UserMessage(resp.success, UserMessage.TYPE_SUCCESS).show();
        return true;
      } else {
        new UserMessage(resp.error, UserMessage.TYPE_ERROR).show();
        return false;
      }
    },

    isMyAxe: async function(fortId) {
      const resp = await GameMap.AjaxAsync.remoteCall('fort_overview', '', {
        offset: 0,
      });

      return resp.js.some(data => data[0] === fortId && data[4] === Character.name);
    },

    updateMyPosition: function () {
      Ajax.remoteCallMode("profile", "init", {name: Character.name, playerId: Character.playerId}, function (resp) {
        if (!resp.error) {
          console.log('AxeMan: set character info: ', resp);
          Character.setPosition(resp.x, resp.y)
        }
      });
    },

    getRandomDelayForAxe: function () {
      return AxeMan.getRandomTime(10 * 60, 15 * 60); // from 10 to 15 minutes in seconds
    },

    // get random milliseconds
    // pass time in seconds
    getRandomTime: function (from = 3, to = 5) {
      return parseInt((Math.random() * (to - from) + from) * 1000);
    }

  }

  GameMap.AxeMan = AxeMan;


  $(document).ready(function() {
    GameMap.AxeMan.start();
  });
})();
