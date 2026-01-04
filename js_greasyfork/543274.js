// ==UserScript==
// @name         Evoworld ReaperView 9.2
// @namespace    http://tampermonkey.net/
// @version      9.21
// @description  Refined ESP: optimized logic, helper functions, boss highlight, no darkness, food/enemy distinction
// @author       senka1
// @match        https://evoworld.io/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543274/Evoworld%20ReaperView%2092.user.js
// @updateURL https://update.greasyfork.org/scripts/543274/Evoworld%20ReaperView%2092.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Display an alert when the script is activated
  alert("ESP ON\nModified by senka1");

  // Wait for the game to fully load before initializing ESP
  function waitForGameLoad() {
    if (typeof game !== 'undefined' && game.canvas && game.dynamicContext && game.me) {
      initESP();
    } else {
      setTimeout(waitForGameLoad, 500);
    }
  }

  function initESP() {
    const ctx = game.dynamicContext;
    const canvas = game.canvas;
    const config = {
      showFood: true,
      showEnemies: true
    };

    // List of conditional bosses that are only dangerous if they can eat the player
    const conditionalBosses = [
      "swampmonster", "demonicimp", "phoenix", "phoenixbird",
      "shadowreaper", "grimreaper", "ghostlyreaper", "voidreaper", "dragon"
    ];

    // Boss detection logic
    const isBoss = (name, me, obj) => {
      if (name === "pumpkin") return false;
      if (name.includes("reaper") || (name.startsWith("pumpkin") && name !== "pumpkin")) return true;
      return conditionalBosses.includes(name) && canEat(obj, me);
    };

    // Disable in-game darkness overlay
    drawDarkness = () => {};

    // Helper function to create and style DOM elements
    const createElement = (tag, style, parent, text) => {
      const el = document.createElement(tag);
      if (text) el.textContent = text;
      Object.assign(el.style, style);
      parent.appendChild(el);
      return el;
    };

    // Create ESP toggle button
    const toggleBtn = createElement('button', {
      position: 'fixed', top: '60px', right: '10px', zIndex: 9999,
      padding: '8px 12px', fontSize: '16px', cursor: 'pointer',
      backgroundColor: '#222', color: 'white', border: 'none',
      borderRadius: '4px', opacity: '0.7'
    }, document.body, 'ESP');
    toggleBtn.title = 'Toggle ESP Menu (M)';

    // Create settings menu
    const menu = createElement('div', {
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0,0,0,0.85)', color: 'white', padding: '20px',
      borderRadius: '10px', fontFamily: 'Arial, sans-serif', fontSize: '18px',
      zIndex: 9999, display: 'none', width: '280px', boxShadow: '0 0 10px #000'
    }, document.body);

    // Menu title bar
    const title = createElement('div', {
      fontWeight: 'bold', fontSize: '20px', marginBottom: '12px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }, menu, 'Config ESP');

    // Close button
    const closeBtn = createElement('button', {
      backgroundColor: 'transparent', border: 'none', color: 'white',
      fontSize: '20px', cursor: 'pointer', fontWeight: 'bold'
    }, title, 'X');

    // Menu toggle handlers
    closeBtn.onclick = () => menu.style.display = 'none';
    toggleBtn.onclick = () => menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    document.addEventListener('keydown', e => {
      if (e.key.toLowerCase() === 'm') menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    // Checkbox creation for config toggles
    const createCheckbox = (labelText, key) => {
      const label = createElement('label', { display: 'block', marginBottom: '10px' }, menu);
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = config[key];
      checkbox.style.marginRight = '10px';
      checkbox.onchange = () => config[key] = checkbox.checked;
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(labelText));
    };

    createCheckbox('ESP Food (Yellow/Green)', 'showFood');
    createCheckbox('ESP Enemy (Red/Cyan/Purple)', 'showEnemies');

    // Legend to explain color codes
    const legend = document.createElement('div');
    legend.innerHTML = `
      <hr style="margin: 10px 0;">
      <div style="font-size: 14px;">
        <b>Legend:</b><br>
        <span style="color: yellow;">Yellow</span> - Edible NPC Food<br>
        <span style="color: green;">Green</span> - Edible Players<br>
        <span style="color: red;">Red</span> - Enemy Players<br>
        <span style="color: cyan;">Cyan</span> - NPC Threats<br>
        <span style="color: purple;">Purple</span> - Boss Mobs (Reapers/Pumpkins always, others if they can eat you)<br>
      </div>
      <div style="text-align:center; font-size:12px; margin-top:8px; color:#aaa">ESP Script v9.1 by senka1</div>
    `;
    menu.appendChild(legend);

    // Helper to calculate object center
    const getCenter = obj => ({
      x: obj.position.x + obj.width / 2,
      y: obj.position.y + obj.height / 2
    });

    // Validation helpers
    const isActive = obj => obj?.active ?? obj?.isActive ?? true;
    const validObj = obj => obj && obj.position && obj.width > 0 && obj.height > 0 && isActive(obj);
    const canEat = (a, b) => foodChain?.[a.name]?.eats?.[b.name];

    // Determine ESP attributes based on object type and relationships
    const getESPAttributes = (me, obj) => {
      const name = obj.name?.toLowerCase() || "";
      const isPlayer = obj.type === objectType.PLAYER;
      if (!validObj(obj) || obj === me) return null;

      if (isBoss(name, me, obj)) {
        return { color: 'purple', alpha: 1.0, dist: 6000, width: 4.0 };
      }

      if (config.showEnemies && canEat(obj, me)) {
        return {
          color: isPlayer ? 'red' : 'cyan',
          alpha: isPlayer ? 1.0 : 0.5,
          dist: 3000,
          width: isPlayer ? 2.4 : 2.0
        };
      }

      if (config.showFood && canEat(me, obj)) {
        return {
          color: isPlayer ? 'green' : 'yellow',
          alpha: isPlayer ? 1.0 : 0.5,
          dist: 3000,
          width: 2.0
        };
      }

      return null;
    };

    // Main rendering logic to draw ESP lines
    function drawESP() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const me = game.me;
      if (!me?.position) return;
      const mePos = getCenter(me);

      for (const obj of Object.values(game.gameObjects)) {
        const attr = getESPAttributes(me, obj);
        if (!attr) continue;

        const objPos = getCenter(obj);
        if (Math.hypot(mePos.x - objPos.x, mePos.y - objPos.y) > attr.dist) continue;

        const meRender = game.getRenderPosition(mePos.x, mePos.y);
        const objRender = game.getRenderPosition(objPos.x, objPos.y);

        ctx.save();
        ctx.globalAlpha = attr.alpha;
        ctx.strokeStyle = attr.color;
        ctx.lineWidth = attr.width;
        ctx.beginPath();
        ctx.moveTo(meRender.x, meRender.y);
        ctx.lineTo(objRender.x, objRender.y);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Hook into game rendering cycle
    const originalDraw = game.beforeDrawAllObjects;
    game.beforeDrawAllObjects = function () {
      originalDraw?.apply(this, arguments);
      drawESP();
    };
  }

  waitForGameLoad();
})();
