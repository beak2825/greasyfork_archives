// ==UserScript==
// @name         AesirChat - Fundo com Orb (Simplificado)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Permite mudar a imagem de fundo com um orb flutuante no AesirChat (sem configuração de bolhas)
// @author       Você
// @match        https://aesirchat.com/app/accounts/*/conversations/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/542655/AesirChat%20-%20Fundo%20com%20Orb%20%28Simplificado%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542655/AesirChat%20-%20Fundo%20com%20Orb%20%28Simplificado%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const waitForElement = (selector, callback) => {
    const check = () => {
      const el = document.querySelector(selector);
      if (el) callback(el);
      else setTimeout(check, 500);
    };
    check();
  };

  const initOrb = () => {
    if (document.getElementById('chatCustomizationOrb')) return;

    // ORB
    const orb = document.createElement('div');
    orb.id = 'chatCustomizationOrb';
    orb.style = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: radial-gradient(circle at center, #0af, #05a);
      border-radius: 50%;
      cursor: pointer;
      z-index: 99999;
      box-shadow: 0 0 10px #0af;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    `;
    orb.textContent = '🖼️';
    document.body.appendChild(orb);

    // PAINEL
    const panel = document.createElement('div');
    panel.id = 'chatCustomizationPopup';
    panel.style = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 300px;
      background: #222;
      color: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 0 20px #0af;
      font-family: sans-serif;
      font-size: 14px;
      display: none;
      z-index: 99999;
    `;
    panel.innerHTML = `
      <h3 style="margin-top:0;">Imagem de Fundo</h3>
      <label>Link da imagem:<br>
        <input type="url" id="bgImageInput" placeholder="https://..." style="width: 100%; margin-top:6px; background:#333; color:#fff; border:none; border-radius:4px; padding:6px;">
      </label>
      <button id="saveChatSettings" style="margin-top:15px; width: 100%; padding: 10px; background:#0af; border:none; border-radius:4px; color:#fff; font-weight:bold; cursor:pointer;">Aplicar</button>
    `;
    document.body.appendChild(panel);

    // Toggle
    orb.onclick = () => {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    };

    // Load saved config
    const saved = JSON.parse(localStorage.getItem('chatBgConfig') || '{}');
    if (saved.bgImage) panel.querySelector('#bgImageInput').value = saved.bgImage;

    // Apply background
    const applyBackground = (url) => {
      const panel = document.querySelector('.conversation-panel.bg-n-background');
      if (panel) {
        panel.style.backgroundImage = `url(${url})`;
        panel.style.backgroundSize = 'cover';
        panel.style.backgroundPosition = 'center';
        panel.style.backgroundRepeat = 'no-repeat';
        panel.style.backgroundAttachment = 'fixed';
      }
    };

    // Salvar botão
    panel.querySelector('#saveChatSettings').onclick = () => {
      const bgImage = panel.querySelector('#bgImageInput').value.trim();
      localStorage.setItem('chatBgConfig', JSON.stringify({ bgImage }));
      applyBackground(bgImage);
      alert('Imagem aplicada!');
    };

    // Aplica automaticamente ao carregar
    applyBackground(saved.bgImage);

    // Observa mudanças na conversa (pra manter o fundo)
    const observer = new MutationObserver(() => {
      const latest = JSON.parse(localStorage.getItem('chatBgConfig') || '{}');
      applyBackground(latest.bgImage);
    });

    const panelContainer = document.querySelector('.conversation-panel.bg-n-background');
    if (panelContainer) {
      observer.observe(panelContainer, { childList: true, subtree: true });
    }
  };

  // Inicia quando conversa estiver carregada
  waitForElement('.conversation-panel.bg-n-background', initOrb);
})();
