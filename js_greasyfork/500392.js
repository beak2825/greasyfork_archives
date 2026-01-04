// ==UserScript==
// @name         TheresMore Modifier（修改器）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Theresmore修改资源、自动恢复资源、时间加速、军队强化和自动升级建筑等功能,反馈交流摸鱼加群279398607
// @author       Keith
// @match        https://theresmoregame.g8hh.com.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500392/TheresMore%20Modifier%EF%BC%88%E4%BF%AE%E6%94%B9%E5%99%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/500392/TheresMore%20Modifier%EF%BC%88%E4%BF%AE%E6%94%B9%E5%99%A8%EF%BC%89.meta.js
// ==/UserScript==

/*
 * 详细功能说明：
 * 1. 修改资源：允许玩家设置、增加或减少各种游戏资源，包括普通资源、声望点和特殊资源。
 * 2. 自动恢复资源：提供自动恢复资源的选项，可以在特定的时间间隔内自动增加资源。
 * 3. 时间加速：允许玩家加速游戏时间，使游戏运行速度提高。
 * 4. 军队强化：提供军队加速和在进攻失败时不损失部队的功能。
 * 5. 自动升级建筑：自动点击建筑进行升级，并判断是否需要切换到下一个建筑标签页。
 */

(function () {
  'use strict';

  const ids = {
    resources: [
      'research', 'food', 'wood', 'stone', 'gold', 'tools', 'copper', 'iron',
      'cow', 'horse', 'luck', 'mana', 'building_material', 'faith', 'supplies',
      'crystal', 'steel', 'saltpetre', 'natronite'
    ],
    prestige: ['legacy'],
    special: ['relic', 'coin', 'tome_wisdom', 'gem', 'titan_gift']
  };

  // 引入 Google Fonts
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  // UI 样式
  const style = `
        #mod-ui {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #000;
            color: #ddd;
            border: 1px solid #333;
            padding: 10px;
            z-index: 10000;
            width: 320px;
            box-shadow: 0 0 10px rgba(0,0,0,0.4);
            font-family: Arial, sans-serif;
        }
         #mod-ui h3 {
            margin: 10 0 10px 0;
            font-size: 18px;
            color: #d4af37;
            cursor: move;
            font-family: 'Cinzel', serif;
            text-shadow: 1px 1px 2px #000;
        }
        #mod-ui h4 {
            margin: 10px 0 5px 0;
            font-size: 14px;
            color: #ccc;
        }
        #mod-ui input, #mod-ui select {
            width: 100%;
            margin-bottom: 10px;
            padding: 5px;
            box-sizing: border-box;
            background-color: #222;
            color: #ddd;
            border: 1px solid #333;
        }
        #mod-ui button {
            padding: 5px 10px;
            width: 100%;
            background-color: #004499;
            color: #ddd;
            border: none;
            cursor: pointer;
            box-sizing: border-box;
            margin-bottom: 10px;
        }
        #mod-ui button.toggle-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            background-color: #1d1e20;
            border: none;
            border-radius: 30%;
            cursor: pointer;
            z-index: 10001;
        }
        #mod-ui button.toggle-btn:hover {
            background-color: #333;
        }
        #mod-ui button:hover {
            background-color: #002266;
        }
        #mod-ui .auto-recover-container {
            display: flex;
            align-items: center;
            margin-top: 5px;
            margin-bottom: 10px;
        }
        #mod-ui .auto-recover-container label {
            color: #ddd;
            white-space: nowrap;
            padding: 5px 0px;
            margin-right: 5px;
            display: inline-flex;
            align-items: center;
        }
        #mod-ui .auto-recover-container input[type="checkbox"] {
            margin: 0;
            margin-left: 15px;
        }
        #auto_update_btn, #speed_on_btn, #army_on_btn {
            background: #1d1e20;
            border-radius: 10%;
            height: 32px;
            width: 120px;
            text-align: center;
            border: 2px solid white;
            color: white;
            cursor: pointer;
            margin-top: 10px;
        }
    `;

    // 在文档中插入样式
    const styleElement = document.createElement('style');
    styleElement.innerText = style;
    document.head.appendChild(styleElement);

    // 创建 UI 元素
    const uiElement = document.createElement('div');
    uiElement.id = 'mod-ui';
    uiElement.innerHTML = `
        <h3>TheresMore Modifier</h3>
        <button id="togglebtn" class="toggle-btn">▲</button>
        <div id="mod-ui-content">
            <h4>修改资源</h4>
            <select id="resource-type">
                <option value="resources">普通资源</option>
                <option value="prestige">声望点</option>
                <option value="special">特殊资源</option>
            </select>
            <input type="number" id="amount-input" placeholder="输入数量" />
            <select id="operation-type">
                <option value="set">设置</option>
                <option value="add">增加</option>
                <option value="subtract">减少</option>
            </select>
            <button id="apply-btn">应用</button>
            <div class="auto-recover-container">
                <label for="auto-recover-checkbox">自动恢复资源
                    <input type="checkbox" id="auto-recover-checkbox" />
                </label>
            </div>
            <input type="number" id="auto-recover-interval" placeholder="恢复间隔（毫秒）" disabled />

            <h4>调速功能</h4>
            <button id="toggleSpeed">开启时间加速</button>
            <button id="toggleArmyStrength">开启军队强化</button>
            <button id="toggleAutoUpdate">开启自动升级</button>
        </div>
    `;
    document.body.appendChild(uiElement);


  // 拖动功能
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  uiElement.querySelector('h3').onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    uiElement.style.top = (uiElement.offsetTop - pos2) + "px";
    uiElement.style.left = (uiElement.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  // 获取游戏数据
  function getGameData() {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('无法找到 React 根元素。');
      return null;
    }

    const reactKey = Object.keys(rootElement).find(key => key.startsWith('__reactContainer$'));
    if (reactKey) {
      const container = rootElement[reactKey];
      return container?.stateNode?.current?.child?.memoizedProps?.MainStore;
    }
    return null;
  }

  // 修改资源数据
  function modifyResources(type, amount = 1000000000, operation = 'add') {
    const gameData = getGameData();
    if (!gameData || !gameData.run || !gameData.run.resources) {
      console.error('游戏数据不可用或结构不正确。');
      return;
    }

    const resources = gameData.run.resources;
    if (!ids[type]) {
      console.error(`无效的类型：${type}`);
      return;
    }

    console.log('Attempting to modify resources:', type, amount, operation);

    resources.forEach(resource => {
      console.log('Checking resource:', resource.id, resource.value);
      if (ids[type].includes(resource.id)) {
        switch (operation) {
          case 'set':
            resource.value = amount;
            break;
          case 'add':
            resource.value = (resource.value ?? 0) + amount;
            break;
          case 'subtract':
            resource.value = Math.max((resource.value ?? 0) - amount, 0);
            break;
          default:
            console.error(`Invalid operation: ${operation}`);
            break;
        }
        console.log('Modified resource:', resource.id, 'New value:', resource.value);
      }
    });

    console.log(`${type} modification complete.`);
  }
    // 更新 UI 显示
    function updateUI() {
        const gameData = getGameData();
        if (!gameData || !gameData.run || !gameData.run.resources) {
            console.error('游戏数据不可用或结构不正确。');
            return;
        }

        const resources = gameData.run.resources;

        // Update resource values in UI
        ids.resources.forEach(resourceId => {
            const resource = resources.find(res => res.id === resourceId);
            if (resource) {
                const resourceElement = document.getElementById(`resource-${resourceId}`);
                if (resourceElement) {
                    resourceElement.textContent = `${resource.name}: ${resource.value}`;
                }
            }
        });

        // Update prestige points in UI
        ids.prestige.forEach(prestigeId => {
            const prestige = resources.find(res => res.id === prestigeId);
            if (prestige) {
                const prestigeElement = document.getElementById(`resource-${prestigeId}`);
                if (prestigeElement) {
                    prestigeElement.textContent = `${prestige.name}: ${prestige.value}`;
                }
            }
        });

        // Update special resources in UI
        ids.special.forEach(specialId => {
            const special = resources.find(res => res.id === specialId);
            if (special) {
                const specialElement = document.getElementById(`resource-${specialId}`);
                if (specialElement) {
                    specialElement.textContent = `${special.name}: ${special.value}`;
                }
            }
        });
    }
  // 自动恢复资源
  let autoRecoverInterval;
  let lastRecoverInterval = 2000; // 默认恢复间隔为 2000 毫秒

  function startAutoRecover(type, interval) {
    if (autoRecoverInterval) {
        clearInterval(autoRecoverInterval);
    }
    autoRecoverInterval = setInterval(() => {
      modifyResources(type, 1000000000, 'add');
      console.log(`自动恢复 ${type} 资源`);
    }, interval);
  }

  function stopAutoRecover() {
    if (autoRecoverInterval) {
      clearInterval(autoRecoverInterval);
      autoRecoverInterval = null;
    }
  }

  // 界面元素与事件绑定
  document.getElementById('apply-btn').addEventListener('click', () => {
    const type = document.getElementById('resource-type').value;
    const amount = Number(document.getElementById('amount-input').value);
    const operation = document.getElementById('operation-type').value;
    modifyResources(type, amount, operation);
  });

  document.getElementById('auto-recover-checkbox').addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    const intervalInput = document.getElementById('auto-recover-interval');
    intervalInput.disabled = !isChecked;

    if (isChecked) {
      const interval = Number(intervalInput.value) || lastRecoverInterval;
      lastRecoverInterval = interval;
      startAutoRecover(document.getElementById('resource-type').value, interval);
    } else {
      stopAutoRecover();
    }
  });

  // 创建按钮图标
const upIcon = `<svg width="12" height="12" viewBox="0 0 24 24"><path fill="none" stroke="#ddd" stroke-width="4" d="M4 16l8-8 8 8"/></svg>`;
const downIcon = `<svg width="12" height="12" viewBox="0 0 24 24"><path fill="none" stroke="#ddd" stroke-width="4" d="M4 8l8 8 8-8"/></svg>`;


  // 修改按钮事件处理
  const togglebtn = document.getElementById('togglebtn');
  togglebtn.innerHTML = upIcon;
  togglebtn.addEventListener('click', () => {
    const modContent = document.querySelector('#mod-ui-content');

    if (modContent.style.display === 'none') {
      modContent.style.display = 'block';
      togglebtn.innerHTML = upIcon;
    } else {
      modContent.style.display = 'none';
      togglebtn.innerHTML = downIcon;
    }
    updateUI();
  });


  document.getElementById('auto-recover-interval').addEventListener('change', (e) => {
    const interval = Number(e.target.value) || 2000;
    if (document.getElementById('auto-recover-checkbox').checked) {
      lastRecoverInterval = interval;
      startAutoRecover(document.getElementById('resource-type').value, interval);
    }
  });

  // 时间加速功能
  const 超级加速等级 = 10;
  let speedIsOn = false;
  let firstSpeedChanger = true;
  let game;
  let older_game = game
  let older_window_game = window.game
  function SpeedChanger(btnId, openString, closeString) {
    if (firstSpeedChanger) {
      firstSpeedChanger = false;
      performance.older_performance_now = performance.now;
    }

    if (!speedIsOn) {
      performance.now = () => {
        return performance.older_performance_now() * 超级加速等级;
      };
      let timer = setInterval(() => {
        if (document.querySelector("#main-tabs")) {
          clearInterval(timer);
          game = Object.values(document.querySelector("#main-tabs"))[1].children._owner.stateNode.props.MainStore;
          window.game = game;
        }
      }, 100);
      speedIsOn = true;
      toggleBtnText(btnId, closeString);
    } else {
      // 平滑
      let disTime = performance.now() - performance.older_performance_now();
      performance.now = () => {
        return performance.older_performance_now() + disTime;
      };
      window.game = older_window_game;
      let timer = setInterval(() => {
        if (document.querySelector("#main-tabs")) {
          clearInterval(timer);
          game = Object.values(document.querySelector("#main-tabs"))[1].children._owner.stateNode.props.MainStore;
          window.game = game;
        }
      }, 100);
      speedIsOn = false;
      toggleBtnText(btnId, openString);
    }
  }

  function toggleBtnText(btnId, text) {
    const button = document.getElementById(btnId);
    if (button) {
      button.textContent = text;
    }
  }

  document.getElementById('toggleSpeed').addEventListener('click', () => {
    SpeedChanger('toggleSpeed', '开启时间加速', '关闭时间加速');
  });


  // 军队强化功能
  let armyStrengthOn = false;
  let enableArmySpeed = true;
  let enableNoLossOnFail = true;

  function toggleArmyStrength() {
    armyStrengthOn = !armyStrengthOn;
    const button = document.getElementById('toggleArmyStrength');
    button.textContent = armyStrengthOn ? '关闭军队强化' : '开启军队强化';

    if (armyStrengthOn) {
      if (enableArmySpeed) {
        game.ArmyStore.waitTime /= 超级加速等级;
        console.log('军队加速已开启');
      }
      if (enableNoLossOnFail) {
        game.ArmyStore.realDestroyArmy = game.ArmyStore.destroyArmy;
        game.ArmyStore.destroyArmy = function (...args) {
          if (!(args[2] == 'army' && args[3] != !0)) {
            return this.realDestroyArmy(...args);
          }
        };
        console.log('进攻失败不损失部队已开启');
      }
    } else {
      game.ArmyStore.waitTime *= 1;
      game.ArmyStore.destroyArmy = game.ArmyStore.realDestroyArmy;
      console.log('军队强化已关闭');
    }
  }

  document.getElementById('toggleArmyStrength').addEventListener('click', toggleArmyStrength);

      document.getElementById('toggleAutoUpdate').addEventListener('click', () => {
    autoUpdateChanger('toggleAutoUpdate', '开启自动升级', '关闭自动升级');
  });

  // 自动升级功能的实现代码
  let autoUpdate = false;
  let autoUpdateTimer;
  var blackList = getListOfOnce();
  const 自动升级间隔 = 1000 * 2;
  const 最小食物增长 = 5;

  const houseList = ['房屋', '市政厅', '宅邸', '住宅区', '发展部', '定居点大厅']; // 会减少食物的建筑
  function getListOfOnce() {
    return ['雕像', '神殿'];
  }

  function autoUpdateChanger(btnId, openString, closeString) {
    const button = document.getElementById(btnId);
    if (autoUpdate) {
      console.log('关闭自动升级');
      clearInterval(autoUpdateTimer);
      autoUpdate = false;
      button.textContent = openString;
    } else {
      console.log('开启自动升级');
      autoUpdateTimer = setInterval(autoClickBuilding, 自动升级间隔);
      autoUpdate = true;
      button.textContent = closeString;
    }
  }

  function autoClickBuilding() {
    closeDialog();
    const tabListNode = document.querySelector('#main-tabs').querySelector(`div[role=tablist]`);
    const tabNode = tabListNode.childNodes[0];
    const flag = tabNode && tabNode.getAttribute('aria-selected') === 'true';
    if (!flag) {
      console.log('需要切换到建筑页面');
      // 自动切换到建造tab页
      tabNode && tabNode.click();
    } else {
      const id = tabNode.getAttribute('aria-controls');
      const containerNode = document.getElementById(id);
      const list = containerNode.querySelectorAll(`button.btn`);
      const subTabNodes = containerNode.querySelector(`div[role=tablist]`);
      let isAllUpdatedInThisTab = false;
      judgeFood();
      console.log('正在寻找可升级建筑');
      for (const [i, node] of list.entries()) {
        let hasClick = false;
        if (
          !node.classList.value.includes('btn-off') &&
          !blackList.some((word) => node.textContent.includes(word))
        ) {
          console.log(`${new Date().toLocaleString()} 升级: `, node.textContent, ' , MaggotScheduler running.');
          node.click();
          hasClick = true;
          break;
        }
        isAllUpdatedInThisTab = i === list.length - 1 && !hasClick;
      }

      console.log(isAllUpdatedInThisTab ? '当前页已经全部升级' : '当前页还有可升级', ' , MaggotScheduler running.');
      if (isAllUpdatedInThisTab && subTabNodes) {
        // 如果当前页全部升级了，尝试切换到下一个 tab 页， 如果存在的话
        const currentSubTab = subTabNodes.querySelector(`button[aria-selected=true]`); // 当前选中的子tab页
        const nextTab = currentSubTab.nextElementSibling;
        if (nextTab) {
          console.log(`切换到${nextTab.textContent}`);
          nextTab.click();
        } else {
          const target = subTabNodes.childNodes[0];
          console.log(`切换到${target.textContent}`);
          target.click();
        }
      }
    }
  }

  function closeDialog() {
    const dialogNode = document.querySelector('#headlessui-portal-root');
    dialogNode && dialogNode.querySelector('.sr-only').parentNode.click();
  }

  // 食物判断
  function judgeFood() {
    var list = document.querySelector('table').querySelectorAll('tr');
    for (var node of list) {
      if (!node.innerText.includes('食物')) continue;
      var val = Number(node.childNodes[2].innerText.split('/')[0]);
      if (val < 最小食物增长) {
        blackList.push(...houseList);
      } else {
        blackList = getListOfOnce();
      }
    }
  }
})();
