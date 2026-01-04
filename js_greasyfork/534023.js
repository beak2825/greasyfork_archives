// ==UserScript==
// @name         [银河奶牛]怪物换皮 + 战败cg
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  替换怪物图标为自定义图片URL，替换玩家死亡和怪物死亡时为自定义图片URL
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/534023/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E6%80%AA%E7%89%A9%E6%8D%A2%E7%9A%AE%20%2B%20%E6%88%98%E8%B4%A5cg.user.js
// @updateURL https://update.greasyfork.org/scripts/534023/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E6%80%AA%E7%89%A9%E6%8D%A2%E7%9A%AE%20%2B%20%E6%88%98%E8%B4%A5cg.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const monsterImageMap = {
    'fly': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'rat': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'skunk': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'porcupine': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'slimy': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'frog': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'snake': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'swampy': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'alligator': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'sea_snail': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'crab': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'aquahorse': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'nom_nom': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'turtle': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'jungle_sprite': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'myconid': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'treant': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'centaur_archer': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'stabby': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'slashy': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'smashy': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'shooty': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'boomy': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'eye': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'eyes': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'veyes': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'novice_sorcerer': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'ice_sorcerer': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'flame_sorcerer': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'elementalist': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'gummy_bear': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'panda': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'black_bear': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'grizzly_bear': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'polar_bear': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'zombie': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'vampire': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'werewolf': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'abyssal_imp': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'soul_hunter': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'infernal_warlock': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'granite_golem': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'magnetic_golem': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'stalactite_golem': 'https://tupian.li/images/2025/04/26/680c4019ce7a1.gif',
    'crystal_colossus': 'https://tupian.li/images/2025/04/18/680c4019ce7a1.gif',
    'giant_shoebill': 'https://tupian.li/images/2025/04/18/680c4019ce7a1.gif',
    'marine_huntress': 'https://tupian.li/images/2025/04/18/680c4019ce7a1.gif',
    'luna_empress': 'https://tupian.li/images/2025/04/18/680c4019ce7a1.gif',
    'gobo_chieftain': 'https://tupian.li/images/2025/04/18/680c4019ce7a1.gif',
    'the_watcher': 'https://tupian.li/images/2025/04/18/680c4019ce7a1.gif',
    'chronofrost_sorcerer': 'https://tupian.li/images/2025/04/18/680c4019ce7a1.gif',
    'red_panda': 'https://tupian.li/images/2025/04/18/680c4019ce7a1.gif',
    'dusk_revenant': 'https://tupian.li/images/2025/04/18/680c4019ce7a1.gif',
    'demonic_overlord': 'https://tupian.li/images/2025/04/18/680c4019ce7a1.gif',
  };

  const reviveImageUrl = 'https://tupian.li/images/2025/04/18/6801c297a15ef.gif'; // 玩家战败cg
  const monsterDeadImageUrl = 'https://tupian.li/images/2025/04/18/6801c297a15ef.gif';// 怪物战败cg
  let isPlayerReplaced = false;
  let originalPlayerModel = null;


  // 替换怪物图标
  const replaceIcons = () => {
    document.querySelectorAll('svg use[href*="combat_monsters_sprite"]').forEach(useEl => {
      const svgEl = useEl.closest('svg');
      if (!svgEl) return;

      const modelContainer = svgEl.closest('.CombatUnit_model__2qQML');
      if (!modelContainer) return;

      const href = useEl.getAttribute('href');
      const monsterId = Object.keys(monsterImageMap).find(id => href.endsWith(id));

      if (monsterId) {
        modelContainer.innerHTML = `
          <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
            <img src="${monsterImageMap[monsterId]}" alt="${monsterId}" style="max-height: 100px;" />
          </div>
        `;
      }
    });
  };

  // 怪物战败cg
  const checkMonsterDeathStatus = () => {
    const monsters = document.querySelectorAll('.CombatUnit_combatUnit__1m3XT');
    monsters.forEach((unit) => {
      const isDead = unit.classList.contains('CombatUnit_dead__10Kxb');
      const modelContainer = unit.querySelector('.CombatUnit_model__2qQML');
      if (!modelContainer) return;
      if (isDead && !unit._originalMonsterModel) {
        unit._originalMonsterModel = modelContainer.cloneNode(true);
        modelContainer.innerHTML = `
          <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
            <img src="${monsterDeadImageUrl}" alt="已死亡" style="max-height: 100px;" />
          </div>
        `;
      } else if (!isDead && unit._originalMonsterModel) {
        modelContainer.replaceWith(unit._originalMonsterModel);
        unit._originalMonsterModel = null;
      }
    });
  };

  // 玩家战败cg
  const checkReviveStatus = () => {
    const unit = document.querySelector('.CombatUnit_combatUnit__1m3XT'); // 玩家一般在第一个
    const reviveOverlay = unit?.querySelector('.CountdownOverlay_countdownOverlay__2QRmL');
    const modelContainer = unit?.querySelector('.CombatUnit_model__2qQML');
    if (!unit || !modelContainer) return;
    if (reviveOverlay && !isPlayerReplaced) {
      originalPlayerModel = modelContainer.cloneNode(true);
      modelContainer.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
          <img src="${reviveImageUrl}" alt="复活中" style="max-height: 100px;" />
        </div>
      `;
      isPlayerReplaced = true;
    } else if (!reviveOverlay && isPlayerReplaced && originalPlayerModel) {
      modelContainer.replaceWith(originalPlayerModel);
      isPlayerReplaced = false;
      originalPlayerModel = null;
    }
  };

  // 监听
  const observer = new MutationObserver(() => {
    replaceIcons();
    checkMonsterDeathStatus();
    checkReviveStatus();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 初始化
  setTimeout(() => {
    replaceIcons();
    checkMonsterDeathStatus();
    checkReviveStatus();
  }, 500);

  // 定时器
  setInterval(checkMonsterDeathStatus, 500);
  setInterval(checkReviveStatus, 500);

})();
