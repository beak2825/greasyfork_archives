// ==UserScript==
// @name         4PDA Fonts & Radio v.1.0
// @author       brant34
// @namespace    http://tampermonkey.net/
// @version      1.0-tfull
// @description  Дополнения для более комфортного пребывания на 4PDA
// @match        https://4pda.to/forum/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/530566/4PDA%20Fonts%20%20Radio%20v10.user.js
// @updateURL https://update.greasyfork.org/scripts/530566/4PDA%20Fonts%20%20Radio%20v10.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const savedSize = GM_getValue('size', '14px');
  const savedFont = GM_getValue('font', 'verdana');
  const savedAutoplay = GM_getValue('autoplay', false);
  const panelScale = GM_getValue('panelSize', '1');
  const panelPosition = GM_getValue('panelPos', 'right');
  const savedRadio = GM_getValue('radio', '');
  const savedVolume = GM_getValue('volume', 1);
  const savedTimer = GM_getValue('autotimer', 0);
  const savedPlaying = GM_getValue('isPlaying', false);
  const savedTime = GM_getValue('currentTime', 0);

  const FONTS = {
    'verdana': 'Verdana','georgia': 'Georgia','open-sans': 'Open Sans','comfortaa': 'Comfortaa','nunito': 'Nunito',
    'pt-sans': 'PT Sans','manrope': 'Manrope','rubik': 'Rubik','roboto': 'Roboto','ubuntu': 'Ubuntu','noto-sans': 'Noto Sans','montserrat': 'Montserrat'
  };

  const RADIO = {
    '🇷🇺 Европа Плюс': 'https://ep256.hostingradio.ru:8052/europaplus256.mp3',
    '🇷🇺 Русское Радио': 'https://rusradio.hostingradio.ru/rusradio128.mp3',
    '🇷🇺 Юмор FM': 'https://pub0301.101.ru:8443/stream/air/mp3/256/102',
    '🇷🇺 Радио Рекорд': 'https://radio-srv1.11one.ru/record192k.mp3',
    '🇷🇺 Ретро FM': 'https://retro.hostingradio.ru:8014/retro320.mp3',
    '🇷🇺 Радио Шансон': 'https://chanson.hostingradio.ru:8041/chanson256.mp3',
    '🇷🇺 DFM Russian Dance': 'https://stream03.pcradio.ru/dfm_russian_dance-hi',
    '🇷🇺 DFM': 'https://dfm.hostingradio.ru:80/dfm96.aacp',
    '🇷🇺 Дорожное Радио': 'https://dorognoe.hostingradio.ru:8000/dorognoe',
    '🇷🇺 Авторадио': 'https://srv01.gpmradio.ru/stream/air/aac/64/100?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJrZXkiOiIwZWM3MjU3YTFhNDM5MmMyNWUwZDZkZDQwYjdjNzQ5ZCIsIklQIjoiODEuMTczLjE2NS4yMjUiLCJVQSI6Ik1vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzE1XzcpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzMuMC4wLjAgU2FmYXJpLzUzNy4zNiIsIlJlZiI6Imh0dHBzOi8vd3d3LmF2dG9yYWRpby5ydS8iLCJ1aWRfY2hhbm5lbCI6IjEwMCIsInR5cGVfY2hhbm5lbCI6ImNoYW5uZWwiLCJ0eXBlRGV2aWNlIjoiUEMiLCJCcm93c2VyIjoiQ2hyb21lIiwiQnJvd3NlclZlcnNpb24iOiIxMzMuMC4wLjAiLCJTeXN0ZW0iOiJNYWMgT1MgWCBQdW1hIiwiZXhwIjoxNzQyNjcxOTc1fQ.b1Hha0aGp4hWbgFELSzEapRcpOoejzs8tmdDARY0JyA',
    '🇩🇪 Радио Картина': 'https://rs.kartina.tv/kartina_320kb',
    '🇰🇿 LuxFM': 'https://icecast.luxfm.kz/luxfm',
    '🇰🇿 Radio NS': 'https://icecast.ns.kz/radions',
    '🇰🇿 NRJ Kazakhstan': 'https://stream03.pcradio.ru/energyfm_ru-med',
    '🇰🇿 Радио Жаңа FM': 'https://live.zhanafm.kz:8443/zhanafm_onair',
    '🇺🇦 Хіт FM': 'http://online.hitfm.ua/HitFM',
    '🇺🇦 Kiss FM UA': 'http://online.kissfm.ua/KissFM'
  };

  GM_addStyle(`
    @import url('https://fonts.googleapis.com/css2?family=Manrope&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Rubik&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Comfortaa&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=PT+Sans&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Ubuntu&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');
  `);

  function applyStyles(font, size) {
    const selectors = ['body','.post','.msg','.signature','.post_wrap','.xbox','.code','.normalname','.desc','.maintitle','.postcolor','.nav','td','th'];
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.setProperty('font-family', `'${FONTS[font]}', sans-serif`, 'important');
        el.style.setProperty('font-size', size, 'important');
      });
    });
  }

  function createPanelSettings(panel) {
    const gear = document.createElement('span');
    gear.textContent = '⚙️';
    gear.style.cursor = 'pointer';
    gear.style.marginLeft = '6px';
    gear.title = 'Настройки панели';

    const settingsPanel = document.createElement('div');
    settingsPanel.style = 'background:#003b3b;color:white;padding:6px;border-radius:6px;position:absolute;right:0;top:120%;z-index:10001;display:none;font-size:12px;min-width:150px;box-shadow:0 0 6px black;';
    settingsPanel.innerHTML = `
      <div style="margin-bottom:6px;">📏 Размер панели:<br>
        <select id="panelSize">
          <option value="0.8">Small</option>
          <option value="1">Medium</option>
          <option value="1.3">Large</option>
        </select>
      </div>
      <div>📍 Положение панели:<br>
        <select id="panelPos">
          <option value="left">Слева</option>
          <option value="center">Посередине</option>
          <option value="right">Справа</option>
        </select>
      </div>`;

    gear.onclick = () => {
      settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    };

    setTimeout(() => {
      settingsPanel.querySelector('#panelSize').value = panelScale;
      settingsPanel.querySelector('#panelPos').value = panelPosition;
    }, 0);

    settingsPanel.querySelector('#panelSize').onchange = e => {
      GM_setValue('panelSize', e.target.value);
      panel.style.transform = `scale(${e.target.value})`;
      panel.style.transformOrigin = panelPosition === 'left' ? 'top left' : (panelPosition === 'center' ? 'top center' : 'top right');
    };

    settingsPanel.querySelector('#panelPos').onchange = e => {
      GM_setValue('panelPos', e.target.value);
      const pos = e.target.value;
      panel.style.top = '0px'; // Фиксируем под самый верх
      panel.style.bottom = 'auto';
      panel.style.left = pos === 'left' ? '10px' : (pos === 'center' ? '50%' : 'auto');
      panel.style.right = pos === 'right' ? '10px' : 'auto';
      panel.style.transformOrigin = pos === 'left' ? 'top left' : (pos === 'center' ? 'top center' : 'top right');
      if (pos === 'center') panel.style.transform = `translateX(-50%) scale(${panelScale})`;
      else panel.style.transform = `scale(${panelScale})`;
    };

    return { gear, settingsPanel };
  }

  function createPanel() {
    const panel = document.createElement('div');
    panel.id = 'customFontPanel';
    const pos = panelPosition;
    panel.style = `
      position:fixed;
      top:0px; /* Под самый верх */
      bottom:auto;
      left:${pos === 'left' ? '10px' : (pos === 'center' ? '50%' : 'auto')};
      right:${pos === 'right' ? '10px' : 'auto'};
      background:#004c4c;
      color:white;
      padding:10px;
      border-radius:10px;
      z-index:10000;
      font-family:sans-serif;
      font-size:14px;
      box-shadow:0 0 10px rgba(0,0,0,0.3);
      display:none;
      min-width:200px;
      transform:${pos === 'center' ? `translateX(-50%) scale(${panelScale})` : `scale(${panelScale})`};
      transform-origin:${pos === 'left' ? 'top left' : (pos === 'center' ? 'top center' : 'top right')};
    `;

    const title = document.createElement('div');
    title.textContent = '⚡ Профили:';
    title.style.marginBottom = '4px';
    panel.appendChild(title);

    const profiles = document.createElement('div');
    profiles.style.display = 'flex';
    profiles.style.flexWrap = 'wrap';
    profiles.style.gap = '6px';
    ['Минимум','Комфорт','Ночь'].forEach(p => {
      const btn = document.createElement('button');
      btn.textContent = p;
      btn.style.cssText = 'padding: 4px 8px; border-radius: 6px; border: none; cursor: pointer; background: #089; color: #fff;';
      btn.onclick = () => {
        if (p === 'Минимум') { GM_setValue('font','open-sans'); GM_setValue('size','12px'); }
        if (p === 'Комфорт') { GM_setValue('font','manrope'); GM_setValue('size','14px'); }
        if (p === 'Ночь')    { GM_setValue('font','rubik'); GM_setValue('size','16px'); }
        location.reload();
      };
      profiles.appendChild(btn);
    });
    panel.appendChild(profiles);

    const fontSelect = document.createElement('select');
    for (const key in FONTS) {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = FONTS[key];
      opt.style.fontFamily = FONTS[key];
      if (key === savedFont) opt.selected = true;
      fontSelect.appendChild(opt);
    }
    fontSelect.onchange = () => {
      GM_setValue('font', fontSelect.value);
      applyStyles(fontSelect.value, GM_getValue('size', '14px'));
    };

    const sizeSelect = document.createElement('select');
    ['12px','14px','16px','18px','20px'].forEach(px => {
      const opt = document.createElement('option');
      opt.value = px;
      opt.textContent = px;
      if (px === savedSize) opt.selected = true;
      sizeSelect.appendChild(opt);
    });
    sizeSelect.onchange = () => {
      GM_setValue('size', sizeSelect.value);
      applyStyles(GM_getValue('font', 'verdana'), sizeSelect.value);
    };

    const radioSelect = document.createElement('select');
    const none = document.createElement('option');
    none.textContent = '-- Радио --';
    none.value = '';
    radioSelect.appendChild(none);
    for (const name in RADIO) {
      const opt = document.createElement('option');
      opt.value = RADIO[name];
      opt.textContent = name;
      if (RADIO[name] === savedRadio) opt.selected = true;
      radioSelect.appendChild(opt);
    }

    const audio = document.createElement('audio');
    audio.controls = true;
    audio.volume = savedVolume;
    audio.style.width = '100%';
    if (savedRadio) audio.src = savedRadio;

    radioSelect.onchange = () => {
      GM_setValue('radio', radioSelect.value);
      audio.src = radioSelect.value;
      audio.play();
      GM_setValue('isPlaying', true);
    };

    audio.onvolumechange = () => GM_setValue('volume', audio.volume);

    audio.ontimeupdate = () => {
      GM_setValue('currentTime', audio.currentTime);
    };
    audio.onplay = () => GM_setValue('isPlaying', true);
    audio.onpause = () => GM_setValue('isPlaying', false);

    if (savedRadio && savedAutoplay) {
      setTimeout(() => {
        audio.play();
        audio.currentTime = savedTime;
      }, 1000);
      if (savedTimer > 0) setTimeout(() => audio.pause(), savedTimer * 60000);
    } else if (savedRadio && savedPlaying) {
      setTimeout(() => {
        audio.play();
        audio.currentTime = savedTime;
      }, 1000);
    }

    const timerBox = document.createElement('select');
    timerBox.innerHTML = `
      <option value="0">⏱ Без таймера</option>
      <option value="15">⏱ 15 мин</option>
      <option value="30">⏱ 30 мин</option>
      <option value="60">⏱ 60 мин</option>
    `;
    timerBox.value = savedTimer;
    timerBox.onchange = () => GM_setValue('autotimer', parseInt(timerBox.value));

    const autoStart = document.createElement('label');
    autoStart.style = 'display:flex;align-items:center;margin-top:5px;gap:4px;position:relative';
    const autoCb = document.createElement('input');
    autoCb.type = 'checkbox';
    autoCb.checked = savedAutoplay;
    autoCb.onchange = () => GM_setValue('autoplay', autoCb.checked);
    autoStart.appendChild(autoCb);
    autoStart.appendChild(document.createTextNode('Автостарт'));

    const { gear, settingsPanel } = createPanelSettings(panel);
    autoStart.appendChild(gear);
    autoStart.appendChild(settingsPanel);

    panel.appendChild(fontSelect);
    panel.appendChild(sizeSelect);
    panel.appendChild(radioSelect);
    panel.appendChild(audio);
    panel.appendChild(timerBox);
    panel.appendChild(autoStart);
    document.body.appendChild(panel);
  }

  function createIconButton() {
    const button = document.createElement('div');
    button.textContent = 'S';
    button.style = 'position:fixed;top:20px;right:20px;width:40px;height:40px;background:#2e7d78;color:#fff;font-weight:bold;font-size:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 0 8px rgba(0,0,0,0.3);z-index:10001';
    button.onclick = () => {
      const panel = document.getElementById('customFontPanel');
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    };
    document.body.appendChild(button);
  }

  applyStyles(savedFont, savedSize);
  window.addEventListener('load', () => {
    createPanel();
    createIconButton();
  });
})();