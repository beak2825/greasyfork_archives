// ==UserScript==
// @name         MBSSChatTimer
// @version      2.2
// @description  Таймер чатов MBSS 
// @match        https://support-admin-common-master.mbss.maxbit.private/*
// @grant        none
// @author       v.stazhok
// @run-at       document-idle
// @namespace    https://greasyfork.org/users/1494852
// @downloadURL https://update.greasyfork.org/scripts/542556/MBSSChatTimer.user.js
// @updateURL https://update.greasyfork.org/scripts/542556/MBSSChatTimer.meta.js
// ==/UserScript==
;(function(){
  'use strict';

  const CHAT_SEL       = '.vac-room-item';
  const SELECTED_SEL   = '.vac-room-item.vac-room-selected';
  const PREVIEW_TS_SEL = '.vac-text-date > span';
  const PREVIEW_TXT    = '.vac-text-last';
  const MSG_CARD_SEL   = '.vac-message-card';
  const MY_MSG_CLS     = 'vac-message-current';
  const USERNAME_SEL   = '.vac-text-username';
  const MAX_SEC        = 180;
  const STORAGE_PREF   = 'ChatIdleTimer:';

  const THEMES = {
    light: {
      textColor:        '#000',
      bgDefault:        '#9ACD32',
      bgWarning:        '#F0E68C',
      bgCritical:       '#CD5C5C',
      closedBg:         '#eaeaea',
      closedLabelColor: '#d33'
    },
    dark: {
      textColor:        '#fff',
      bgDefault:        '#4F7942',
      bgWarning:        '#A9A14B',
      bgCritical:       '#8B0000',
      closedBg:         '#2b2b2b',
      closedLabelColor: '#888'
    }
  };

  const roomData     = new WeakMap();
  const roomElements = new Set();

  // 0) Определяем тему по классам <body> и <html>
  function getCurrentTheme() {
    const b = document.body.classList, h = document.documentElement.classList;
    if (b.contains('dark') || h.contains('dark'))   return 'dark';
    if (b.contains('dark-theme') || h.contains('dark-theme')) return 'dark';
    if (b.contains('layout-theme-default') || h.contains('layout-theme-default')) return 'light';
    if (b.contains('light') || h.contains('light')) return 'light';
    if (b.contains('light-theme') || h.contains('light-theme')) return 'light';
    return 'light';
  }

  console.log('MBSSChatTimer v2.9 loaded on', location.href);
  window.getCurrentTheme = getCurrentTheme;

  let lastTheme = null;
  function trackThemeChange() {
    const theme = getCurrentTheme();
    if (theme !== lastTheme) {
      console.log('MBSSChatTimer: detected theme →', theme);
      lastTheme = theme;
    }
  }

  // слушаем системные настройки
  window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => { trackThemeChange(); updateAll(); });

  // следим за class-атрибутами у body и html
  const themeObserver = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type==='attributes' && m.attributeName==='class') {
        trackThemeChange();
        updateAll();
        break;
      }
    }
  });
  themeObserver.observe(document.body, { attributes:true });
  themeObserver.observe(document.documentElement, { attributes:true });

  // 1) Инициализация чатов
  function initChats(){
    document.querySelectorAll(CHAT_SEL).forEach(room=>{
      if (roomData.has(room)) return;
      const roomId = room.id; if (!roomId) return;
      const key = STORAGE_PREF + roomId;
      let ts = 0, saved = localStorage.getItem(key);

      if (saved !== null) {
        ts = parseInt(saved, 10) || Date.now();
      } else {
        if (room.matches(SELECTED_SEL)) {
          const last = findLastCustomerTime(room);
          if (last) ts = last;
        }
        if (!ts) {
          const el = room.querySelector(PREVIEW_TS_SEL);
          if (el) {
            const d = parseTime(el.textContent.trim());
            if (d) ts = d.getTime();
          }
        }
        if (!ts) ts = Date.now();
        localStorage.setItem(key, ts);
      }

      roomData.set(room, { lastTime: ts, roomId, lastIsMine: false });
      roomElements.add(room);
      injectTimer(room);
    });
  }
  initChats();
  new MutationObserver(initChats).observe(document.body, { childList:true, subtree:true });

  // 2) Встраиваем контейнер таймера
  function injectTimer(room){
    if (room.querySelector('.last-msg-timer')) return;
    const el = document.createElement('div');
    el.className = 'last-msg-timer';
    el.style.cssText = 'margin-right:8px;font-weight:bold;white-space:nowrap;';
    const btn = room.querySelector('.btn-add-tag');
    if (btn) btn.insertAdjacentElement('beforebegin', el);
    else (room.querySelector('.vac-room-info')||room).appendChild(el);
    room.style.transition = 'background-color 0.5s ease';
  }

  // 3) Парсим время последнего клиентского сообщения
  function findLastCustomerTime(room){
    const container = document.querySelector('.vac-room-container');
    const cards = container
      ? Array.from(container.querySelectorAll(MSG_CARD_SEL))
      : Array.from(document.querySelectorAll(MSG_CARD_SEL));
    const cust = cards.filter(c =>
      !c.classList.contains(MY_MSG_CLS) &&
      c.querySelector(USERNAME_SEL)
    );
    if (!cust.length) return null;
    const last = cust[cust.length - 1];
    const tsEl = last.querySelector(PREVIEW_TS_SEL);
    let ts = Date.now();
    if (tsEl) {
      const d = parseTime(tsEl.textContent.trim());
      if (d) ts = d.getTime();
    }
    return ts;
  }

  // 4) Сброс времени при новом чужом сообщении
  function resetLastTime(room, ts){
    const rec = roomData.get(room);
    if (!rec) return;
    rec.lastTime   = ts;
    rec.lastIsMine = false;
    localStorage.setItem(STORAGE_PREF + rec.roomId, ts);
    updateRoom(room);
  }

  // 5) Следим за появлением новых сообщений и обновлением превью
  new MutationObserver(onMutation)
    .observe(document.body,{ childList:true, subtree:true, characterData:true });
  function onMutation(records){
    records.forEach(m =>{
      if (m.type==='childList') {
        m.addedNodes.forEach(node =>{
          if (!(node instanceof Element)) return;
          const card = node.matches(MSG_CARD_SEL) ? node : node.querySelector(MSG_CARD_SEL);
          if (!card) return;
          const room = card.closest(CHAT_SEL);
          if (!roomData.has(room)) return;

          // если моя карточка — отмечаем флаг
          if (card.classList.contains(MY_MSG_CLS)) {
            roomData.get(room).lastIsMine = true;
            updateRoom(room);
            return;
          }

          // если чужая — сбрасываем
          if (card.querySelector(USERNAME_SEL)) {
            let ts = Date.now();
            const tsEl = card.querySelector(PREVIEW_TS_SEL);
            if (tsEl) {
              const d = parseTime(tsEl.textContent.trim());
              if (d) ts = d.getTime();
            }
            resetLastTime(room, ts);
          }
        });
      }

      // обновление превью тоже как новое сообщение
      if (m.type==='childList'||m.type==='characterData') {
        const el = m.target instanceof Element
                 ? m.target.closest(`${PREVIEW_TXT},${PREVIEW_TS_SEL}`)
                 : m.target.parentElement?.closest(`${PREVIEW_TXT},${PREVIEW_TS_SEL}`);
        if (!el) return;
        const room = el.closest(CHAT_SEL);
        if (!roomData.has(room)) return;
        let ts = Date.now();
        if (el.matches(PREVIEW_TS_SEL)) {
          const d = parseTime(el.textContent.trim());
          if (d) ts = d.getTime();
        }
        resetLastTime(room, ts);
      }
    });
  }

  // 6) Обновление UI каждую секунду
  setInterval(() => {
    trackThemeChange();
    roomElements.forEach(updateRoom);
  }, 1000);

  // 7) Основная отрисовка и та же логика my-message из 2.2
  function updateRoom(room){
    const rec = roomData.get(room);
    const el  = room.querySelector('.last-msg-timer');
    if (!rec || !el) return;

    const text = room.textContent.toLowerCase();
    // закрытый чат
    if (text.includes('closed the chat')||text.includes('chat closed')) {
      const pal = THEMES[getCurrentTheme()];
      el.textContent = '';
      room.style.setProperty('background-color', pal.closedBg, 'important');
      if (!room.querySelector('.closed-label')) {
        const tag = document.createElement('span');
        tag.className = 'closed-label';
        tag.textContent = '🔒 Закрыт';
        tag.style.cssText = `margin-right:8px;color:${pal.closedLabelColor};font-style:italic;`;
        room.appendChild(tag);
      }
      return;
    }

    // Восстановлена логика 2.2 для определения lastIsMine
    if (room.matches(SELECTED_SEL)) {
      const cards = document.querySelectorAll(MSG_CARD_SEL);
      const last  = cards[cards.length - 1];
      rec.lastIsMine = last?.classList.contains(MY_MSG_CLS);
    }

    const pal = THEMES[getCurrentTheme()];
    let s = Math.floor((Date.now() - rec.lastTime) / 1000);
    if (s < 0) s = 0;
    const mnt = Math.floor(s / 60), scs = s % 60;
    el.textContent = `${mnt}m ${scs}s`;
    el.style.color = pal.textColor;

    // Если моё последнее сообщение — без фона
    if (rec.lastIsMine) {
      room.style.removeProperty('background-color');
      room.querySelectorAll('*').forEach(n => n.style.color = pal.textColor);
      return;
    }

    // Окраска фона по порогам
    let bg = pal.bgDefault;
    if (s >= MAX_SEC) bg = pal.bgCritical;
    else if (s >= 120) bg = pal.bgWarning;
    room.style.setProperty('background-color', bg, 'important');
    room.querySelectorAll('*').forEach(n => n.style.color = pal.textColor);
  }

  // вспомогалка парсинга времени
  function parseTime(txt){
    if (/^\d\d:\d\d:\d\d$/.test(txt)) {
      const [h,m,s] = txt.split(':').map(Number);
      const d = new Date(); d.setHours(h,m,s,0); return d;
    }
    if (txt.includes('Today')) {
      const [,hm] = txt.split('Today, ');
      const [h,m] = hm.split(':').map(Number);
      const d = new Date(); d.setHours(h,m,0,0); return d;
    }
    const mm = txt.match(/(\d{2})\.(\d{2})\.(\d{4}), (\d{2}):(\d{2})/);
    if (mm) {
      const [ ,dd,mo,yy,hh,mi] = mm.map(Number);
      return new Date(yy,mo-1,dd,hh,mi);
    }
    return null;
  }
})();
