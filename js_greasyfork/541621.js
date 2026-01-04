// ==UserScript==
// @name         TheresMore Modifier - Gemini Enhanced Edition
// @name:zh-CN   TheresMore 修改器 - Gemini 增强版
// @namespace    https://github.com/VincentHDLee
// @version      6.0.0
// @description  A heavily modified and intelligent version based on Keith's original work. Features a task scheduler, conflict avoidance, and highly automated gameplay loops.
// @description:zh-CN 在Keith的原版基础上进行了大量重构和智能化升级。拥有任务调度器、冲突规避、智能黑白名单等功能，实现高度自动化的游戏体验。
// @author       VincentHDLee (Original by Keith, Co-authored by Gemini)
// @match        https://theresmoregame.g8hh.com.cn/*
// @match        https://theresmore.thpatch.net/*
// @grant        none
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/541621/TheresMore%20Modifier%20-%20Gemini%20Enhanced%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/541621/TheresMore%20Modifier%20-%20Gemini%20Enhanced%20Edition.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- 1. 最终版全局配置与知识库 ---
  const ids = {
    resources: ['research','food','wood','stone','gold','tools','copper','iron','cow','horse','luck','mana','building_material','faith','supplies','crystal','steel','saltpetre','natronite', 'lumix'],
    prestige: ['legacy'],
    special: ['relic','coin','tome_wisdom','gem','titan_gift','light']
  };
  const houseList = ['房屋', '市政厅', '宅邸', '住宅区', '发展部', '定居点大厅'];
  const universalBlacklist = ['神殿', '雕像'];

  // [v5.3 最终版] 危险研究关键词黑名单
  const dangerousResearchKeywords = [
      '结束时代', '结束本局游戏', '进入一个新时代', '开启新纪元', '新世界',
      '结束当前周目', '发射', '光荣退休', '点亮亡者之门', '无智之恶','富甲天下'
  ];

  // [v5.3 最终版] 安全主题白名单
  const safeThemePrefixes = ['青铜', '铁', '钢', '精金', '秘银', '经济', '宗教', '战争', '内部', '地窖', '黑暗', '神圣', '召唤', '信号', '长矛', '黄金', '纳红石'];

  // [v5.3 最终版] 已知选择组黑名单
  const knownChoiceGroups = [
      ['赢得民心', '说服贵族'], ['信仰的灯塔', '军事定居点', '生产中心'], ['保护之力', '增量之力'],
      ['展示火焰', '注入火焰'], ['驱逐德鲁伊', '接纳德鲁伊'], ['召唤窃魂者', '修建堡垒'],
      ['专注于发展', '专注于魔法', '专注于研究'], ['召唤尼哈鲁尔', '重建堡垒'], ['渴望神谕', '渴望魔法', '渴望战斗'],
      ['泽尼克斯的统御者', '泽尼克斯的训战官'], ['泽尼克斯的大法师', '泽尼克斯的铸金使'],
      ['黄金工厂', '法力工厂'], ['月明之夜', '全日庆祝活动'], ['光荣退休', '光荣游行']
  ];

  const mainSchedulerInterval = 500;
  const TASK_LEASE_DURATION = 3000;
  const BUILD_CLICKS_BEFORE_SWITCH = 5;

  let autoResearchOn = false, autoUpdateOn = false, autoMagicOn = false, infiniteResourcesOn = false;
  let mainSchedulerTimer = null, infiniteResourcesTimer = null;
  let taskLeaseHolder = null, taskLeaseEndTime = 0, schedulerTurn = 0;
  let buildCounter = 0, buildBlackList = [], isCurseTurn = true;

  // --- 2. UI 渲染 ---
  const link = document.createElement('link'); link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap'; link.rel = 'stylesheet'; document.head.appendChild(link);
  const style = `
        #mod-ui { position: fixed; top: 10px; right: 10px; background: #000; color: #ddd; border: 1px solid #333; padding: 10px; z-index: 10000; width: 320px; box-shadow: 0 0 10px rgba(0,0,0,0.4); font-family: Arial, sans-serif; }
        #mod-ui h3 { margin: 10 0 10px 0; font-size: 18px; color: #d4af37; cursor: move; font-family: 'Cinzel', serif; text-shadow: 1px 1px 2px #000; }
        #mod-ui h4 { margin: 10px 0 5px 0; font-size: 14px; color: #ccc; }
        #mod-ui button { padding: 8px 10px; width: 100%; background-color: #004499; color: #ddd; border: none; cursor: pointer; box-sizing: border-box; margin-bottom: 10px; }
        #mod-ui button.toggle-btn { position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; background-color: #1d1e20; border: none; border-radius: 30%; cursor: pointer; z-index: 10001; }
        #mod-ui button:hover { background-color: #002266; }
        #mod-ui button.toggle-btn:hover { background-color: #333; }
        #mod-ui .function-row { display: flex; flex-direction: column; align-items: stretch; gap: 5px; margin-top: 8px; margin-bottom: 5px; }
        #mod-ui .function-row > button { width: 100%; padding: 5px 10px; margin:0; }
        #mod-ui .locations-container { display: flex; justify-content: space-around; padding: 5px 0 5px 0; background-color: #111; border-radius: 4px; margin-top: 8px; margin-bottom: 5px;}
        #mod-ui .locations-container label { display: flex; align-items: center; gap: 4px; color: #ccc; font-size: 12px;}
        #mod-ui .locations-container input[type=checkbox] { margin: 0; }
    `;
    const styleElement = document.createElement('style'); styleElement.innerText = style; document.head.appendChild(styleElement);
    const uiElement = document.createElement('div'); uiElement.id = 'mod-ui';
    uiElement.innerHTML = `
        <h3>TheresMore Modifier</h3>
        <button id="togglebtn" class="toggle-btn"></button>
        <div id="mod-ui-content">
            <h4>资源修改</h4>
            <button id="toggle-infinite-resources-btn">无限资源: 已关闭</button>
            <h4>功能开关</h4>
            <div class="function-row"><button id="toggleSpeed">瞬间完成: 已关闭</button></div>
            <div id="build-locations" class="locations-container">
                <label><input type="checkbox" name="build-location" value="城市" checked>城市</label>
                <label><input type="checkbox" name="build-location" value="定居点" checked>定居点</label>
                <label><input type="checkbox" name="build-location" value="深渊" checked>深渊</label>
            </div>
            <div class="function-row"><button id="toggleAutoUpdate">自动建造: 已关闭</button></div>
            <div class="function-row"><button id="toggleAutoResearch">自动研究: 已关闭</button></div>
            <div class="function-row"><button id="toggleAutoMagic">自动魔法: 已关闭</button></div>
        </div>
    `;
    document.body.appendChild(uiElement);

  // --- 3. 辅助函数定义 ---
  function toggleBtnText(id, text) { const btn = document.getElementById(id); if (btn) btn.textContent = text; }
  function getGameData() { const r = document.getElementById('root'), k = r ? Object.keys(r).find(k => k.startsWith('__reactContainer$')) : null; return k ? r[k]?.stateNode?.current?.child?.memoizedProps?.MainStore : null; }
  function setAllResourcesToMax() { const MAX_AMOUNT = 9999999999999999; const gameData = getGameData(); if (!gameData?.run?.resources) return; const allResourceIds = [...Object.values(ids).flat()]; gameData.run.resources.forEach(resource => { if (allResourceIds.includes(resource.id)) { resource.value = MAX_AMOUNT; } }); }
  function hasSharedSubstring(strA, strB, length = 2) { const [shortStr, longStr] = strA.length < strB.length ? [strA, strB] : [strB, strA]; for (let i = 0; i <= shortStr.length - length; i++) { const substring = shortStr.substring(i, i + length); if (longStr.includes(substring)) return true; } return false; }

  // [v5.3 最终版] 三层智能审查函数
  function findSafeButtons(buttons) {
      const whitelistedButtons = new Set(buttons.filter(b => safeThemePrefixes.some(prefix => b.textContent.trim().startsWith(prefix))));
      const nonWhitelisted = buttons.filter(b => !whitelistedButtons.has(b));
      const toSkip = new Set();
      const nonWhitelistedTexts = nonWhitelisted.map(b => b.textContent.trim());

      for (const group of knownChoiceGroups) {
          const foundItems = group.filter(item => nonWhitelistedTexts.includes(item));
          if (foundItems.length > 1) {
              foundItems.forEach(itemText => {
                  const btn = nonWhitelisted.find(b => b.textContent.trim() === itemText);
                  if(btn) toSkip.add(btn);
              });
          }
      }

      const remainingForFinalCheck = nonWhitelisted.filter(b => !toSkip.has(b));
      const remainingTexts = remainingForFinalCheck.map(b => b.textContent.trim());

      for (let i = 0; i < remainingTexts.length; i++) {
          for (let j = i + 1; j < remainingTexts.length; j++) {
              if (hasSharedSubstring(remainingTexts[i], remainingTexts[j])) {
                  toSkip.add(remainingForFinalCheck[i]);
                  toSkip.add(remainingForFinalCheck[j]);
              }
          }
      }

      const safeStandaloneButtons = remainingForFinalCheck.filter(b => !toSkip.has(b));
      return [...whitelistedButtons, ...safeStandaloneButtons];
  }

  // --- 4. 任务调度器核心 ---
  function checkSchedulerState() { const anyTaskOn = autoResearchOn || autoUpdateOn || autoMagicOn; if (anyTaskOn && !mainSchedulerTimer) { mainSchedulerTimer = setInterval(runTasks, mainSchedulerInterval); } else if (!anyTaskOn && mainSchedulerTimer) { clearInterval(mainSchedulerTimer); mainSchedulerTimer = null; } }
  function patrolAndClosePopup() { const d = document.querySelector('#headlessui-portal-root'); if (d && d.innerHTML !== '') { const b = d.querySelector('button.absolute') || Array.from(d.querySelectorAll('button')).find(btn => btn.textContent.includes('取消') || btn.textContent.includes('关闭')) || (d.querySelector('.sr-only') && d.querySelector('.sr-only').parentElement); if (b) { b.click(); return true; } } return false; }
  function runTasks() { if (patrolAndClosePopup()) { taskLeaseHolder = 'build'; taskLeaseEndTime = Date.now() + TASK_LEASE_DURATION; if (autoUpdateOn) autoClickBuilding(); schedulerTurn = 1; return; } if (taskLeaseHolder && Date.now() > taskLeaseEndTime) { taskLeaseHolder = null; } if (taskLeaseHolder) { if (taskLeaseHolder === 'research' && autoResearchOn) autoClickResearch(); else if (taskLeaseHolder === 'build' && autoUpdateOn) autoClickBuilding(); else if (taskLeaseHolder === 'magic' && autoMagicOn) autoClickMagic(); return; } const taskOrder = [{ name: 'research', enabled: autoResearchOn, func: autoClickResearch }, { name: 'build', enabled: autoUpdateOn, func: autoClickBuilding }, { name: 'magic', enabled: autoMagicOn, func: autoClickMagic }]; for (let i = 0; i < taskOrder.length; i++) { let currentIndex = (schedulerTurn + i) % taskOrder.length; const task = taskOrder[currentIndex]; if (task.enabled) { if (task.func()) { taskLeaseHolder = task.name; taskLeaseEndTime = Date.now() + TASK_LEASE_DURATION; schedulerTurn = (currentIndex + 1) % taskOrder.length; return; } } } schedulerTurn = (schedulerTurn + 1) % taskOrder.length; }

  // --- 5. 各功能模块逻辑 ---
  function autoResearchChanger() { autoResearchOn = !autoResearchOn; toggleBtnText('toggleAutoResearch', `自动研究: ${autoResearchOn ? '已开启' : '已关闭'}`); checkSchedulerState(); }
  function autoClickResearch() {
      const researchTabButton = Array.from(document.querySelectorAll('#main-tabs > div[role=tablist] > button')).find(tab => tab.textContent.includes('研究'));
      if (!researchTabButton) return false;
      if (researchTabButton.getAttribute('aria-selected') === 'false') { researchTabButton.click(); return true; }
      const panel = document.getElementById(researchTabButton.getAttribute('aria-controls')); if (!panel) return false;
      const researchSubTab = Array.from(panel.querySelectorAll('button[role="tab"]')).find(t => t.textContent.includes('研究'));
      if(researchSubTab && researchSubTab.getAttribute('aria-selected') === 'false') { researchSubTab.click(); return true; }
      let availableButtons = Array.from(panel.querySelectorAll('button.btn:not(.btn-off)'));
      availableButtons = availableButtons.filter(b => {
          const text = b.textContent.trim();
          return !universalBlacklist.some(keyword => text.includes(keyword)) && !dangerousResearchKeywords.some(keyword => text.includes(keyword));
      });
      if (availableButtons.length === 0) return false;
      const buttonsToClick = findSafeButtons(availableButtons);
      if (buttonsToClick.length > 0) { buttonsToClick.forEach(button => button.click()); return true; }
      return false;
  }

  function autoUpdateChanger() { autoUpdateOn = !autoUpdateOn; toggleBtnText('toggleAutoUpdate', `自动建造: ${autoUpdateOn ? '已开启' : '已关闭'}`); buildCounter = 0; checkSchedulerState(); }
  function autoClickBuilding() {
      const buildTab = document.querySelector('#main-tabs > div[role=tablist] > button'); if (!buildTab) return false;
      if (buildTab.getAttribute('aria-selected') === 'false') { buildTab.click(); buildCounter = 0; return true; }
      const panel = document.getElementById(buildTab.getAttribute('aria-controls')); if (!panel) return false;
      const enabledLocations = Array.from(document.querySelectorAll('#build-locations input:checked')).map(cb => cb.value);
      if (enabledLocations.length === 0) return false;
      const subTabsContainer = panel.querySelector('div[role=tablist]'); const hasMultipleSubTabs = subTabsContainer && subTabsContainer.children.length > 1;
      const currentSubTab = subTabsContainer?.querySelector('button[aria-selected=true]');
      if (hasMultipleSubTabs && currentSubTab && !enabledLocations.includes(currentSubTab.textContent.trim())) { const firstValidTab = Array.from(subTabsContainer.children).find(t => enabledLocations.includes(t.textContent.trim())); if (firstValidTab) { firstValidTab.click(); buildCounter = 0; return true; } }
      buildBlackList = universalBlacklist.concat(judgeFood());
      const upgradeables = Array.from(panel.querySelectorAll('button.btn')).filter(n => { if (n.classList.contains('btn-off')) return false; const text = n.textContent.trim(); return !buildBlackList.some(w => text.includes(w)); });
      let didSomeAction = false;
      if (upgradeables.length > 0) { upgradeables.forEach(n => n.click()); buildCounter++; didSomeAction = true; }
      if (hasMultipleSubTabs && (buildCounter >= BUILD_CLICKS_BEFORE_SWITCH || (didSomeAction === false && upgradeables.length === 0))) {
          if (currentSubTab) {
               const allSubTabs = Array.from(subTabsContainer.children); const validSubTabs = allSubTabs.filter(t => enabledLocations.includes(t.textContent.trim()));
               if (validSubTabs.length > 0) {
                   const currentIndexInValid = validSubTabs.indexOf(currentSubTab);
                   const nextIndex = (currentIndexInValid + 1) % validSubTabs.length;
                   validSubTabs[nextIndex].click(); buildCounter = 0; didSomeAction = true;
               }
          }
      }
      return didSomeAction;
  }
  function judgeFood() { const foodTable = document.querySelector('table'); if (!foodTable) return []; const r = Array.from(foodTable.querySelectorAll('tr')).find(n => n.innerText.includes('食物')); if (!r) return []; const c = r.childNodes[2]; if (!c) return []; const v = Number(c.innerText.split('/')[0]); return v < 5 ? houseList : []; }

  function autoMagicChanger() { autoMagicOn = !autoMagicOn; toggleBtnText('toggleAutoMagic', `自动魔法: ${autoMagicOn ? '已开启' : '已关闭'}`); checkSchedulerState(); }
  function autoClickMagic() {
      const magicTabButton = Array.from(document.querySelectorAll('#main-tabs > div[role=tablist] > button')).find(tab => tab.textContent.includes('魔法'));
      if (!magicTabButton) return false;
      if (magicTabButton.getAttribute('aria-selected') === 'false') { magicTabButton.click(); return true; }
      const panel = document.getElementById(magicTabButton.getAttribute('aria-controls')); if (!panel) return false;
      const subTabsContainer = panel.querySelector('div[role=tablist]'); if (!subTabsContainer) return false;
      let didWork = false;
      if (isCurseTurn) {
          const curseTab = Array.from(subTabsContainer.children).find(t => t.textContent.includes('咒语'));
          if (curseTab) { if (curseTab.getAttribute('aria-selected') === 'false') { curseTab.click(); return true; } const cursePanel = document.getElementById(curseTab.getAttribute('aria-controls')); if(!cursePanel) return false; const curseButtons = Array.from(cursePanel.querySelectorAll('button')).filter(b => b.textContent.includes('施放咒语')); if (curseButtons.length > 0) { curseButtons.forEach(b => b.click()); didWork = true; } }
      } else {
          const prayerTab = Array.from(subTabsContainer.children).find(t => t.textContent.includes('祈祷'));
          if (prayerTab) { if (prayerTab.getAttribute('aria-selected') === 'false') { prayerTab.click(); return true; } const prayerPanel = document.getElementById(prayerTab.getAttribute('aria-controls')); if(!prayerPanel) return false; let prayerButtons = Array.from(prayerPanel.querySelectorAll('button.btn:not(.btn-off)')); prayerButtons = prayerButtons.filter(b => !universalBlacklist.some(keyword => b.textContent.includes(keyword))); if(prayerButtons.length > 0) { const buttonsToClick = findSafeButtons(prayerButtons); if (buttonsToClick.length > 0) { buttonsToClick.forEach(b => b.click()); didWork = true; } } }
      }
      isCurseTurn = !isCurseTurn; return didWork;
  }

  let speedOn = false, game;
  function toggleInstantComplete() { speedOn = !speedOn; toggleBtnText('toggleSpeed', `瞬间完成: ${speedOn ? '已开启' : '已关闭'}`); if (!game) game = getGameData(); if (!game) { return; } if (!game.ArmyStore.originalWaitTime) game.ArmyStore.originalWaitTime = game.ArmyStore.waitTime; if (!game.ArmyStore.realDestroyArmy) game.ArmyStore.realDestroyArmy = game.ArmyStore.destroyArmy; if (speedOn) { game.ArmyStore.waitTime = 1; game.ArmyStore.destroyArmy = function (...args) { if (!(args[2] == 'army' && args[3] != !0)) return this.realDestroyArmy(...args); }; } else { game.ArmyStore.waitTime = game.ArmyStore.originalWaitTime; game.ArmyStore.destroyArmy = game.ArmyStore.realDestroyArmy; } }
  function toggleInfiniteResources() { infiniteResourcesOn = !infiniteResourcesOn; toggleBtnText('toggle-infinite-resources-btn', `无限资源: ${infiniteResourcesOn ? '已开启' : '已关闭'}`); if (infiniteResourcesOn) { setAllResourcesToMax(); infiniteResourcesTimer = setInterval(setAllResourcesToMax, 1500); } else { clearInterval(infiniteResourcesTimer); infiniteResourcesTimer = null; } }

  // --- 6. 事件监听器绑定 ---
  function init() {
      const upIcon = `<svg width="12" height="12" viewBox="0 0 24 24"><path fill="none" stroke="#ddd" stroke-width="4" d="M4 16l8-8 8 8"/></svg>`;
      const downIcon = `<svg width="12" height="12" viewBox="0 0 24 24"><path fill="none" stroke="#ddd" stroke-width="4" d="M4 8l8 8 8-8"/></svg>`;
      const findAndBind = (id, handler) => document.getElementById(id)?.addEventListener('click', handler);
      findAndBind('toggleAutoResearch', autoResearchChanger);
      findAndBind('toggleAutoUpdate', autoUpdateChanger);
      findAndBind('toggleSpeed', toggleInstantComplete);
      findAndBind('toggle-infinite-resources-btn', toggleInfiniteResources);
      findAndBind('toggleAutoMagic', autoMagicChanger);
      const toggleVisibilityBtn = document.getElementById('togglebtn');
      toggleVisibilityBtn.innerHTML = upIcon;
      findAndBind('togglebtn', () => { const c = document.querySelector('#mod-ui-content'), i = c.style.display === 'none'; c.style.display = i ? 'block' : 'none'; toggleVisibilityBtn.innerHTML = i ? upIcon : downIcon; });
      let drag_pos1 = 0, drag_pos2 = 0, drag_pos3 = 0, drag_pos4 = 0;
      uiElement.querySelector('h3').onmousedown = (e) => { e = e || window.event; e.preventDefault(); drag_pos3 = e.clientX; drag_pos4 = e.clientY; document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; }; document.onmousemove = (ev) => { ev = ev || window.event; ev.preventDefault(); drag_pos1 = drag_pos3 - ev.clientX; drag_pos2 = drag_pos4 - ev.clientY; drag_pos3 = ev.clientX; drag_pos4 = ev.clientY; uiElement.style.top = (uiElement.offsetTop - drag_pos2) + "px"; uiElement.style.left = (uiElement.offsetLeft - drag_pos1) + "px"; }; };
  }
  setTimeout(init, 2000);

})();