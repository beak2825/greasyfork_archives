// ==UserScript==
// @name         보조바퀴(크랙 기억력 보조)
// @namespace    https://crack.wrtn.ai
// @version      1.9
// @description  크랙 기억력 보조용 메모장
// @author       바보륍부이
// @license      MIT
// @match        https://crack.wrtn.ai/u/*/c/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539575/%EB%B3%B4%EC%A1%B0%EB%B0%94%ED%80%B4%28%ED%81%AC%EB%9E%99%20%EA%B8%B0%EC%96%B5%EB%A0%A5%20%EB%B3%B4%EC%A1%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539575/%EB%B3%B4%EC%A1%B0%EB%B0%94%ED%80%B4%28%ED%81%AC%EB%9E%99%20%EA%B8%B0%EC%96%B5%EB%A0%A5%20%EB%B3%B4%EC%A1%B0%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let textKey = `wrtn_custom_text_${location.pathname}`;
  const panelKey = 'wrtn_custom_panel';

  const savedPanelState = JSON.parse(localStorage.getItem(panelKey) || '{}');
  let isMinimized = savedPanelState.minimized || false;

  const panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.top = savedPanelState.top || '100px';
  panel.style.left = savedPanelState.left || '10px';
  panel.style.width = savedPanelState.width || '600px';
  panel.style.height = savedPanelState.height || '500px';
  panel.style.backgroundColor = '#1a1a1a';
  panel.style.padding = '0';
  panel.style.borderRadius = '10px';
  panel.style.zIndex = '9999';
  panel.style.color = '#fff';
  panel.style.fontFamily = 'sans-serif';
  panel.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
  panel.style.resize = 'both';
  panel.style.overflow = 'hidden';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';

  const dragHeader = document.createElement('div');
  dragHeader.style.backgroundColor = '#333';
  dragHeader.style.padding = '8px 10px';
  dragHeader.style.borderRadius = '10px 10px 0 0';
  dragHeader.style.cursor = 'move';
  dragHeader.style.userSelect = 'none';
  dragHeader.style.fontSize = '12px';
  dragHeader.style.fontWeight = 'bold';
  dragHeader.style.borderBottom = '1px solid #444';
  dragHeader.style.flexShrink = '0';
  dragHeader.textContent = '📝 보조바퀴-캐챗 기억력 보조 메모장 (Ctrl+엔터로 빠른 입력 가능)';

  const helpIcon = document.createElement('div');
  helpIcon.textContent = '❓';
  helpIcon.title = '요약은 캐즘 등 다른 프로그램을 활용해주세요\n직접 메모해도 됩니다\n다른 방으로 이동하는 등 URL이 바뀌면 갱신 버튼을 눌러주세요\n최상단을 더블클릭하면 최소화 됩니다';
  helpIcon.style.position = 'absolute';
  helpIcon.style.top = '5px';
  helpIcon.style.right = '10px';
  helpIcon.style.cursor = 'help';
  helpIcon.style.fontSize = '14px';
  dragHeader.appendChild(helpIcon);

  const content = document.createElement('div');
  content.style.padding = '10px';
  content.style.flex = '1';
  content.style.overflow = 'auto';
  content.style.display = 'flex';
  content.style.flexDirection = 'column';

  const input = document.createElement('textarea');
  input.rows = 50;
  input.placeholder = '추가할 내용 입력';
  input.style.width = '100%';
  input.style.flex = '1';
  input.style.padding = '8px';
  input.style.borderRadius = '5px';
  input.style.border = '1px solid #444';
  input.style.backgroundColor = '#2a2a2a';
  input.style.color = '#fff';
  input.style.resize = 'none';
  input.style.minHeight = '200px';

  const controlRow = document.createElement('div');
  controlRow.style.display = 'flex';
  controlRow.style.alignItems = 'center';
  controlRow.style.gap = '8px';
  controlRow.style.padding = '10px';
  controlRow.style.backgroundColor = '#222';
  controlRow.style.borderTop = '1px solid #444';
  controlRow.style.borderRadius = '0 0 10px 10px';
  controlRow.style.flexShrink = '0';

  const button = document.createElement('button');
  button.textContent = '텍스트 추가';
  button.style.flex = '1';
  button.style.padding = '8px';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.backgroundColor = '#4caf50';
  button.style.color = '#fff';
  button.style.cursor = 'pointer';

  const refreshButton = document.createElement('button');
  refreshButton.textContent = '🔄 갱신';
  refreshButton.style.flex = '1';
  refreshButton.style.padding = '8px';
  refreshButton.style.border = 'none';
  refreshButton.style.borderRadius = '5px';
  refreshButton.style.backgroundColor = '#555';
  refreshButton.style.color = '#fff';
  refreshButton.style.cursor = 'pointer';

  const countDisplay = document.createElement('div');
  countDisplay.style.marginLeft = 'auto';
  countDisplay.style.fontSize = '12px';

  const loadTextFromStorage = () => {
    textKey = `wrtn_custom_text_${location.pathname}`;
    const savedText = localStorage.getItem(textKey);
    input.value = savedText || '';
    countDisplay.textContent = `총 ${input.value.length}글자`;
  };

  loadTextFromStorage();

  refreshButton.addEventListener('click', loadTextFromStorage);

  const toggleMinimize = () => {
    isMinimized = !isMinimized;
    if (isMinimized) {
      content.style.display = 'none';
      controlRow.style.display = 'none';
      panel.style.height = 'auto';
      dragHeader.style.borderRadius = '10px';
      dragHeader.style.borderBottom = 'none';
    } else {
      content.style.display = 'flex';
      controlRow.style.display = 'flex';
      panel.style.height = savedPanelState.height || '500px';
      dragHeader.style.borderRadius = '10px 10px 0 0';
      dragHeader.style.borderBottom = '1px solid #444';
    }
    const currentState = JSON.parse(localStorage.getItem(panelKey) || '{}');
    currentState.minimized = isMinimized;
    localStorage.setItem(panelKey, JSON.stringify(currentState));
  };

  if (isMinimized) toggleMinimize();
  dragHeader.addEventListener('dblclick', toggleMinimize);

  const appendToTextarea = () => {
    const newText = input.value.trim();
    if (!newText) return;
    const textarea = document.querySelector('textarea[placeholder*="메시지 보내기"]');
    if (!textarea) {
      alert("textarea를 찾을 수 없습니다.");
      return;
    }
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    setter?.call(textarea, textarea.value + '\n' + newText);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    localStorage.setItem(textKey, input.value);
  };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) appendToTextarea();
  });

  button.addEventListener('click', appendToTextarea);
  input.addEventListener('input', () => {
    localStorage.setItem(textKey, input.value);
    countDisplay.textContent = `총 ${input.value.length}글자`;
  });

  let offsetX, offsetY, dragging = false;
  dragHeader.addEventListener('mousedown', (e) => {
    dragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    document.body.style.userSelect = 'none';
    e.preventDefault();
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
    const currentState = JSON.parse(localStorage.getItem(panelKey) || '{}');
    currentState.top = panel.style.top;
    currentState.left = panel.style.left;
    currentState.width = panel.style.width;
    currentState.height = panel.style.height;
    localStorage.setItem(panelKey, JSON.stringify(currentState));
  });

  new ResizeObserver(() => {
    const rect = panel.getBoundingClientRect();
    const currentState = JSON.parse(localStorage.getItem(panelKey) || '{}');
    currentState.top = `${rect.top}px`;
    currentState.left = `${rect.left}px`;
    currentState.width = `${rect.width}px`;
    currentState.height = `${rect.height}px`;
    localStorage.setItem(panelKey, JSON.stringify(currentState));
  }).observe(panel);

  controlRow.appendChild(button);
  controlRow.appendChild(refreshButton);
  controlRow.appendChild(countDisplay);
  content.appendChild(input);
  panel.appendChild(dragHeader);
  panel.appendChild(content);
  panel.appendChild(controlRow);
  document.body.appendChild(panel);
})();
