// ==UserScript==
// @name         MWI_DamageTracker
// @namespace    destiny
// @version      0.0.5
// @description  MWI伤害统计
// @author       ryle798
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498153/MWI_DamageTracker.user.js
// @updateURL https://update.greasyfork.org/scripts/498153/MWI_DamageTracker.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 代理 Websocket
  const OriginalWebSocket = window.WebSocket;
  const handlerQueue = [];
  function MyWebSocket(url, protocols) {
    const ws = new OriginalWebSocket(url, protocols);
    ws.addEventListener('message', function (event) {
      const msgData = JSON.parse(event.data);
      handlerQueue.reduce((prev, handler) => {
        return handler(prev);
      }, msgData);
    });
    return ws;
  }
  window.WebSocket = MyWebSocket;
  let totalDamage = [];
  let monstersHP = [];
  let dragging = false;
  const getStatisticsDom = () => {
    if (!document.querySelector('.statistics-panel')) {
      let panel = document.createElement('div');
      panel.style.position = 'fixed';
      panel.style.top = '50px';
      panel.style.left = '50px';
      panel.style.background = '#f0f0f0';
      panel.style.border = '1px solid #ccc';
      panel.style.zIndex = '9999';
      panel.style.cursor = 'move';
      panel.style.fontSize = '12px';
      panel.style.padding = '4px';
      panel.innerHTML = '<div style="padding: 10px;">还未开始统计</div>';
      panel.className = 'statistics-panel';
      let offsetX, offsetY;
  
      // Mouse events
      panel.addEventListener('mousedown', function (e) {
        dragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
      });
  
      document.addEventListener('mousemove', function (e) {
        if (dragging) {
          var newX = e.clientX - offsetX;
          var newY = e.clientY - offsetY;
          panel.style.left = newX + 'px';
          panel.style.top = newY + 'px';
        }
      });
  
      document.addEventListener('mouseup', function () {
        dragging = false;
        updateStatisticsPanel()
      });
  
      // Touch events
      panel.addEventListener('touchstart', function (e) {
        dragging = true;
        let touch = e.touches[0];
        offsetX = touch.clientX - panel.offsetLeft;
        offsetY = touch.clientY - panel.offsetTop;
      });
  
      document.addEventListener('touchmove', function (e) {
        if (dragging) {
          let touch = e.touches[0];
          var newX = touch.clientX - offsetX;
          var newY = touch.clientY - offsetY;
          panel.style.left = newX + 'px';
          panel.style.top = newY + 'px';
        }
      });
  
      document.addEventListener('touchend', function () {
        dragging = false;
        updateStatisticsPanel()
      });
  
      document.body.appendChild(panel);
    }
    return document.querySelector('.statistics-panel');
  };
  
  const updateStatisticsPanel = () => {
    if(dragging)return false;
    const panel = getStatisticsDom();
    const damageDoms = totalDamage.reduce((prev, cur, index) => {
      return prev + `<div>${index + 1}号位:${cur}</div>`;
    }, '');
    panel.innerHTML = damageDoms;
  };
  const calculateDamage = (msgData) => {
    if (msgData.type === 'new_battle') {
      monstersHP = msgData.monsters.map((monster) => monster.currentHitpoints);
      if (!totalDamage.length) {
        totalDamage = new Array(Object.keys(msgData.players).length).fill(0);
      }
    } else if (msgData.type === 'battle_updated' && monstersHP.length) {
      const mMap = msgData.mMap;
      const userIndex = Object.keys(msgData.pMap);
      monstersHP.forEach((mHP, mIndex) => {
        const monster = mMap[mIndex];
        const userIndex = Object.keys(msgData.pMap)[0];
        if (monster) {
          if (userIndex !== void 0) {
            const hpDiff = mHP - monster.cHP;
            hpDiff > 0 && (totalDamage[userIndex] += hpDiff);
          }
          monstersHP[mIndex] = monster.cHP;
        }
      });
      updateStatisticsPanel();
    } else if (msgData.type === 'actions_updated') {
      monstersHP = [];
      totalDamage = [];
    }
  };

  handlerQueue.push(calculateDamage);
})();
