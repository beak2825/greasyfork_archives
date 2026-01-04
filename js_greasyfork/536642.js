// ==UserScript==
// @name         EvoWorld.io ESP with Menu
// @namespace    http://tampermonkey.net/
// @version      6.9
// @description  fixed and remade version
// @author       Biel
// @icon         https://www.google.com/s2/favicons?sz=64&domain=evoworld.io
// @match        https://evoworld.io/
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536642/EvoWorldio%20ESP%20with%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/536642/EvoWorldio%20ESP%20with%20Menu.meta.js
// ==/UserScript==

(function() {
  'use strict';

  alert("ESP ON\nBiel: @ts_biel62");

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
      showEnemies: true,
    };

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'ESP';
    Object.assign(toggleBtn.style, {
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      padding: '8px 12px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: '#222',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      opacity: '0.7',
    });
    document.body.appendChild(toggleBtn);

    const menu = document.createElement('div');
    Object.assign(menu.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0,0,0,0.85)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      zIndex: 9999,
      display: 'none',
      width: '280px',
      boxShadow: '0 0 10px #000',
    });
    document.body.appendChild(menu);

    const title = document.createElement('div');
    title.textContent = 'Config ESP';
    Object.assign(title.style, {
      fontWeight: 'bold',
      fontSize: '20px',
      marginBottom: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    });
    menu.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    Object.assign(closeBtn.style, {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '20px',
      cursor: 'pointer',
      fontWeight: 'bold',
    });
    title.appendChild(closeBtn);

    closeBtn.onclick = () => menu.style.display = 'none';
    toggleBtn.onclick = () => menu.style.display = menu.style.display === 'none' ? 'block' : 'none';

    function createCheckbox(labelText, key) {
      const label = document.createElement('label');
      label.style.display = 'block';
      label.style.marginBottom = '10px';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = config[key];
      checkbox.style.marginRight = '10px';

      checkbox.onchange = () => {
        config[key] = checkbox.checked;
      };

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(labelText));
      return label;
    }

    menu.appendChild(createCheckbox('ESP Food', 'showFood'));
    menu.appendChild(createCheckbox('ESP Enemy', 'showEnemies'));

    function isActive(obj) {
      return obj?.active ?? obj?.isActive ?? true;
    }

    function validObj(obj) {
      return obj && obj.position && obj.width > 0 && obj.height > 0 && isActive(obj);
    }

    function canEat(a, b) {
      return foodChain?.[a.name]?.eats?.[b.name];
    }

    function drawESP() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const me = game.me;
  if (!me || !me.position) return;

  const meX = me.position.x + me.width / 2;
  const meY = me.position.y + me.height / 2;
  const maxDistance = 3000; 

  for (const obj of Object.values(game.gameObjects)) {
    if (obj === me || !validObj(obj)) continue;

    const objX = obj.position.x + obj.width / 2;
    const objY = obj.position.y + obj.height / 2;

    const dx = meX - objX;
    const dy = meY - objY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxDistance) continue;

    const meRender = game.getRenderPosition(meX, meY);
    const objRender = game.getRenderPosition(objX, objY);

    let color = null;
    if (config.showFood && canEat(me, obj)) color = 'green';
    if (config.showEnemies && canEat(obj, me)) color = 'red';
    if (!color) continue;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(meRender.x, meRender.y);
    ctx.lineTo(objRender.x, objRender.y);
    ctx.stroke();
  }
}

    const originalDraw = game.beforeDrawAllObjects;
    game.beforeDrawAllObjects = function() {
      originalDraw?.apply(this, arguments);
      drawESP();
    };
  }

  waitForGameLoad();
})();