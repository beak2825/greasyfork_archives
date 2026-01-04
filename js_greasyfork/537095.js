// ==UserScript==
// @name         ChatGPT Assistant
// @namespace    http://tampermonkey.net/
// @version      v1.1
// @description  Bypasses page errors like 'conversation not found' + popup tools + model switcher + resume support after reloads
// @author       dylojestem
// @license This script may be freely shared, but modification is not allowed. All rights reserved by dylojestem.
// @match        https://chatgpt.com/*
// @icon         https://static.vecteezy.com/system/resources/previews/021/608/790/non_2x/chatgpt-logo-chat-gpt-icon-on-black-background-free-vector.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537095/ChatGPT%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/537095/ChatGPT%20Assistant.meta.js
// ==/UserScript==

(function () {
  const style = document.createElement('style');
  style.textContent = `
    #chatgpt-menu {
      position: fixed;
      top: 0;
      right: -240px;
      width: 240px;
      height: 100%;
      background-color: #111;
      color: white;
      z-index: 10000;
      padding: 20px 10px;
      box-shadow: -2px 0 6px rgba(0,0,0,0.3);
      transition: right 0.3s ease;
      font-family: sans-serif;
      overflow-y: auto;
    }
    #chatgpt-menu.open {
      right: 0;
    }
    #chatgpt-toggle {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 10001;
      background-color: #000;
      color: white;
      border: none;
      border-radius: 50%;
      width: 42px;
      height: 42px;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
    #chatgpt-menu button {
      width: 100%;
      margin: 6px 0;
      padding: 8px;
      font-size: 14px;
      border: none;
      border-radius: 6px;
      background-color: #222;
      color: white;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    #chatgpt-menu button:hover {
      background-color: #333;
    }
    #chatgpt-menu .section-title {
      margin: 10px 0 5px;
      font-size: 12px;
      color: #aaa;
      text-transform: uppercase;
    }
    #chatgpt-menu .model-card {
      background-color: #1a1a1a;
      border-radius: 8px;
      padding: 10px;
      margin-bottom: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    }
    #chatgpt-menu .model-title {
      font-weight: bold;
      color: #fff;
      margin-bottom: 4px;
    }
    #chatgpt-menu .model-desc {
      font-size: 12px;
      color: #ccc;
    }
    #chatgpt-menu .note {
      font-size: 11px;
      color: #999;
      margin-top: 10px;
      padding: 6px;
      border-top: 1px solid #333;
    }
    #chatgpt-header {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 2px;
      user-select: none;
    }
    #chatgpt-subheader {
      text-align: center;
      font-size: 11px;
      color: #888;
      margin-bottom: 12px;
      user-select: none;
    }
    #contact {
    text-decoration: none;
    color: #888;
    transition: color 0.2s ease;
    }
    #contact:hover {
    color: #aaa;
    }
  `;
  document.head.appendChild(style);

  // === ELEMENTY ===
  const menu = document.createElement('div');
  menu.id = 'chatgpt-menu';

  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'chatgpt-toggle';
  toggleBtn.textContent = '☰';

  let popupWindow = null;
  let intervalId = null;
  let isRunning = false;
  let currentModel = '4o';

  const mainButton = document.createElement('button');
  mainButton.textContent = 'Open/Resume ChatGPT';

  const models = ['4o', 'o3', 'o4-mini', 'o4-mini-high', '4.1', '4.1-mini'];
  const modelMap = {
    '4o': 'gpt-4o',
    'o3': 'o3',
    'o4-mini': 'o4-mini',
    'o4-mini-high': 'o4-mini-high',
    '4.1': 'gpt-4-1',
    '4.1-mini': 'gpt-4-1-mini'
  };
  const modelDescriptions = {
    '4o': 'Wspaniałe rozwiązanie do większości zadań',
    'o3': 'Używa zaawansowanego rozumowania',
    'o4-mini': 'Najszybszy w zaawansowanym rozumowaniu',
    'o4-mini-high': 'Świetny w kodowaniu i rozumowaniu wizualnym',
    '4.1': 'Świetny do szybkiego kodowania i analiz',
    '4.1-mini': 'Szybszy przy realizacji codziennych zadań'
  };

  // === HEADER ===
  const header = document.createElement('div');
  header.id = 'chatgpt-header';
  header.textContent = 'ChatGPT Assistant';

  const subheader = document.createElement('div');
  subheader.id = 'chatgpt-subheader';
  subheader.innerHTML = 'Created by <a id="contact" href="https://dylojestem.com/contact" target="_blank">dylojestem</a>';

  menu.appendChild(header);
  menu.appendChild(subheader);

  const popupSectionTitle = document.createElement('div');
  popupSectionTitle.className = 'section-title';
  popupSectionTitle.textContent = 'Assistant';
  menu.appendChild(popupSectionTitle);
  menu.appendChild(mainButton);

  const popupWarning = document.createElement('div');
  popupWarning.className = 'note';
  popupWarning.textContent = "Do not close the popup window – it must stay open for refreshing to work.";
  menu.appendChild(popupWarning);

  const sectionTitle = document.createElement('div');
  sectionTitle.className = 'section-title';
  sectionTitle.textContent = 'Models';
  menu.appendChild(sectionTitle);

  models.forEach(model => {
    const btn = document.createElement('button');
    btn.textContent = model;
    btn.addEventListener('click', () => {
      const urlModel = modelMap[model] || model;
      const baseUrl = window.location.origin + window.location.pathname;
      window.location.href = `${baseUrl}?model=${encodeURIComponent(urlModel)}`;
    });
    menu.appendChild(btn);
  });

  const note = document.createElement('div');
  note.className = 'note';
  note.textContent = "Note: After switching the model, you must click the 'Open/Resume ChatGPT' button again.";
  menu.appendChild(note);

  const descTitle = document.createElement('div');
  descTitle.className = 'section-title';
  descTitle.textContent = 'Model Descriptions';
  menu.appendChild(descTitle);

  models.forEach(model => {
    const card = document.createElement('div');
    card.className = 'model-card';

    const title = document.createElement('div');
    title.className = 'model-title';
    title.textContent = model;

    const desc = document.createElement('div');
    desc.className = 'model-desc';
    desc.textContent = modelDescriptions[model] || 'Brak opisu';

    card.appendChild(title);
    card.appendChild(desc);
    menu.appendChild(card);
  });

  document.body.appendChild(toggleBtn);
  document.body.appendChild(menu);

  // === LOGIKA ===
  toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  mainButton.addEventListener('click', () => {
    const urlModel = modelMap[currentModel] || currentModel;
    if (!isRunning) {
      const popupWidth = 400;
      const popupHeight = 300;
      const left = Math.floor((window.innerWidth - popupWidth) / 2 + window.screenX);
      const top = Math.floor((window.innerHeight - popupHeight) / 2 + window.screenY);

      popupWindow = window.open(
        `https://chatgpt.com/?model=${urlModel}`,
        'chatgpt_popup',
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=no,scrollbars=yes,toolbar=no,menubar=no,status=no`
      );
      intervalId = setInterval(() => {
        if (popupWindow && !popupWindow.closed) {
          popupWindow.location.reload();
        } else {
          clearInterval(intervalId);
          intervalId = null;
          isRunning = false;
          mainButton.textContent = 'Open/Resume ChatGPT';
        }
      }, 5000);
      isRunning = true;
      mainButton.textContent = 'STOP';
    } else {
      if (popupWindow && !popupWindow.closed) popupWindow.close();
      clearInterval(intervalId);
      intervalId = null;
      popupWindow = null;
      isRunning = false;
      mainButton.textContent = 'Open/Resume ChatGPT';
    }
  });
})();
