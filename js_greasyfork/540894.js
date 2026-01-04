// ==UserScript==
// @name         크랙보조메모장(메보)
// @namespace    https://crack.wrtn.ai
// @version      1.2
// @description  크랙용 보조메모장 및 매크로
// @author       바보륍부이
// @license      MIT
// @match        https://crack.wrtn.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540894/%ED%81%AC%EB%9E%99%EB%B3%B4%EC%A1%B0%EB%A9%94%EB%AA%A8%EC%9E%A5%28%EB%A9%94%EB%B3%B4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540894/%ED%81%AC%EB%9E%99%EB%B3%B4%EC%A1%B0%EB%A9%94%EB%AA%A8%EC%9E%A5%28%EB%A9%94%EB%B3%B4%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const storageKey = 'wrtn_memo_list_v2';
  const panelStateKey = 'wrtn_memo_panel_state_v2';
  const selectionKey = 'wrtn_memo_selected_index_v2';
  const randomHistory = new Map();

  let panel = null;
  let content, control;
  let memoList = [];
  let selectedIndex = Number(localStorage.getItem(selectionKey) || '-1');
  let isMinimized = false;
  const defaultHeight = '550px';

  const save = () => localStorage.setItem(storageKey, JSON.stringify(memoList));
  const savePanelState = () => {
    const state = {
      top: panel.style.top,
      left: panel.style.left,
      width: panel.style.width,
      height: panel.style.height,
      minimized: isMinimized,
      expandedHeight: (!isMinimized ? panel.style.height : localStorage.getItem(panelStateKey + '_expandedHeight') || defaultHeight)
    };
    localStorage.setItem(panelStateKey, JSON.stringify(state));
    localStorage.setItem(panelStateKey + '_expandedHeight', state.expandedHeight);
    localStorage.setItem(selectionKey, selectedIndex);
  };

  const getProcessedBody = (body, key = '') => {
    const lines = body.trim().split('\n');
    const mode = lines[0];
    if ((mode === '랜덤' || mode === '와일드카드') && lines.length > 1) {
      const options = lines.slice(1);
      let last = randomHistory.get(key);
      let choice;
      const filtered = options.filter(o => o !== last);
      if (filtered.length === 0) {
        choice = options[Math.floor(Math.random() * options.length)];
      } else {
        choice = filtered[Math.floor(Math.random() * filtered.length)];
      }
      randomHistory.set(key, choice);
      return { text: choice, replace: mode === '와일드카드' };
    } else {
      return { text: body, replace: false };
    }
  };

  const savedState = JSON.parse(localStorage.getItem(panelStateKey) || '{}');
  isMinimized = savedState.minimized || false;
  memoList = JSON.parse(localStorage.getItem(storageKey) || '[]');

  panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.top = savedState.top || '100px';
  panel.style.left = savedState.left || '10px';
  panel.style.width = savedState.width || '400px';
  panel.style.height = isMinimized ? '36px' : (savedState.expandedHeight || defaultHeight);
  panel.style.background = '#1a1a1a';
  panel.style.color = '#fff';
  panel.style.fontFamily = 'sans-serif';
  panel.style.fontSize = '14px';
  panel.style.zIndex = '9999';
  panel.style.borderRadius = '10px';
  panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  panel.style.overflow = 'hidden';
  panel.style.resize = 'both';

  const header = document.createElement('div');
  header.textContent = '📋 메모 리스트 (Ctrl+Enter로 본문 입력)';
  header.style = 'padding: 8px; background: #333; font-weight: bold; cursor: move; user-select: none';
  panel.appendChild(header);

  content = document.createElement('div');
  content.style = 'flex: 1; overflow-y: auto; padding: 10px; background: #222;';
  panel.appendChild(content);

  control = document.createElement('div');
  control.style = 'display: flex; flex-direction: column; gap: 6px; padding: 10px; background: #111;';

  const titleInput = document.createElement('input');
  titleInput.placeholder = '제목';
  titleInput.style = 'padding: 6px; border-radius: 4px; border: none;';
  control.appendChild(titleInput);

  const bodyInput = document.createElement('textarea');
  bodyInput.placeholder = '본문';
  bodyInput.rows = 3;
  bodyInput.style = 'padding: 6px; border-radius: 4px; resize: vertical; border: none; min-height: 60px;';
  control.appendChild(bodyInput);

  const addBtn = document.createElement('button');
  addBtn.textContent = '추가';
  addBtn.style = 'padding: 6px 10px; background: #4caf50; color: white; border: none; border-radius: 4px;';
  control.appendChild(addBtn);

  panel.appendChild(control);

  const toggleMinimize = () => {
    isMinimized = !isMinimized;
    content.style.display = isMinimized ? 'none' : 'block';
    control.style.display = isMinimized ? 'none' : 'flex';
    panel.style.height = isMinimized
      ? '36px'
      : localStorage.getItem(panelStateKey + '_expandedHeight') || defaultHeight;
    savePanelState();
  };

  header.addEventListener('dblclick', toggleMinimize);

  addBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    if (!title && !body) return;
    memoList.push({ title, body });
    titleInput.value = '';
    bodyInput.value = '';
    save();
    renderList();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey && selectedIndex >= 0) {
      const textarea = document.querySelector('textarea[placeholder*="메시지 보내기"]');
      if (!textarea) return alert("입력창을 찾을 수 없습니다.");
      const memo = memoList[selectedIndex];
      const { text, replace } = getProcessedBody(memo.body, 'key_' + selectedIndex);
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      setter?.call(textarea, replace ? text : textarea.value + '\n' + text);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  let offsetX, offsetY, dragging = false;
  header.addEventListener('mousedown', (e) => {
    dragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    document.body.style.userSelect = 'none';
  });
  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    panel.style.left = `${e.clientX - offsetX}px`;
    panel.style.top = `${e.clientY - offsetY}px`;
  });
  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    document.body.style.userSelect = '';
    savePanelState();
  });

  new ResizeObserver(savePanelState).observe(panel);
  document.body.appendChild(panel);

  const renderList = () => {
    content.innerHTML = '';
    memoList.forEach((item, index) => {
      const row = document.createElement('div');
      row.style = 'display: flex; flex-direction: column; gap: 4px; padding: 6px 0; border-bottom: 1px solid #333;';

      const topRow = document.createElement('div');
      topRow.style = 'display: flex; align-items: center; gap: 6px;';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'memoSelect';
      radio.checked = selectedIndex === index;
      radio.addEventListener('change', () => {
        selectedIndex = index;
        savePanelState();
      });
      topRow.appendChild(radio);

      const title = document.createElement('span');
      title.textContent = item.title;
      title.style = 'flex: 1; font-weight: bold; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;';
      topRow.appendChild(title);

      const quickBtn = document.createElement('button');
      quickBtn.textContent = '입력';
      quickBtn.style = 'padding: 2px 6px; background: #2196f3; color: white; border: none; border-radius: 4px;';
      quickBtn.addEventListener('click', () => {
        const textarea = document.querySelector('textarea[placeholder*="메시지 보내기"]');
        if (!textarea) return alert("입력창을 찾을 수 없습니다.");
        const { text, replace } = getProcessedBody(item.body, 'key_' + index);
        const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
        setter?.call(textarea, replace ? text : textarea.value + '\n' + text);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      });
      topRow.appendChild(quickBtn);

      const editBtn = document.createElement('button');
      editBtn.textContent = '✏️';
      editBtn.style = 'padding: 2px 6px; background: #ff9800; color: white; border: none; border-radius: 4px;';

      let isEditing = false;
      let textarea = null;

      editBtn.addEventListener('click', () => {
        if (isEditing) {
          item.body = textarea.value.trim();
          isEditing = false;
          save();
          renderList();
        } else {
          isEditing = true;
          body.textContent = '';
          textarea = document.createElement('textarea');
          textarea.value = item.body;
          textarea.rows = item.body.split('\n').length;
          textarea.style = 'width: 100%; resize: vertical; padding: 4px; background: #111; color: white; border: 1px solid #555; border-radius: 4px;';
          body.appendChild(textarea);
          textarea.focus();
        }
      });
      topRow.appendChild(editBtn);

      const del = document.createElement('button');
      del.textContent = '❌';
      del.style = 'padding: 2px 6px; background: #c62828; color: white; border: none; border-radius: 4px;';
      del.addEventListener('click', () => {
        memoList.splice(index, 1);
        if (selectedIndex === index) selectedIndex = -1;
        else if (selectedIndex > index) selectedIndex--;
        save();
        renderList();
        savePanelState();
      });
      topRow.appendChild(del);

      const body = document.createElement('div');
      body.textContent = (item.body || '').split('\n')[0];
      body.style = 'color: #aaa; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';

      row.appendChild(topRow);
      row.appendChild(body);

      content.appendChild(row);
    });
  };

  renderList();
  if (isMinimized) toggleMinimize();
})();
