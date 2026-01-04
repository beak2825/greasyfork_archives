// ==UserScript==
// @name         LeetCode Draw
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在 leetcode.cn 上添加绘图功能，右侧显示 Excalidraw 画板
// @license      MIT
// @author       mxgxxx
// @match        https://leetcode.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522588/LeetCode%20Draw.user.js
// @updateURL https://update.greasyfork.org/scripts/522588/LeetCode%20Draw.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const storage = {
    save: (width, isVisible) => {
      localStorage.setItem('leetcode-draw-width', width);
      localStorage.setItem('leetcode-draw-visible', isVisible);
    },
    load: () => ({
      width: localStorage.getItem('leetcode-draw-width') || '50%',
      isVisible: localStorage.getItem('leetcode-draw-visible') === 'true'
    })
  };

  const savedState = storage.load();
  
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.right = '0';
  container.style.width = savedState.width;
  container.style.height = '100%';
  container.style.display = savedState.isVisible ? 'block' : 'none';
  container.style.zIndex = '9999';
  container.style.borderLeft = '1px solid #ccc';

  const resizer = document.createElement('div');
  resizer.style.width = '10px';
  resizer.style.height = '100%';
  resizer.style.position = 'absolute';
  resizer.style.left = '-5px';
  resizer.style.top = '0';
  resizer.style.cursor = 'ew-resize';
  resizer.style.backgroundColor = '#ccc';
  container.appendChild(resizer);

  const iframe = document.createElement('iframe');
  iframe.src = 'https://excalidraw.com';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  container.appendChild(iframe);

  let isDragging = false;
  let currentX;
  let initialWidth;

  function initDrag(e) {
    if (e.button !== 0) return;
    isDragging = true;
    currentX = e.clientX;
    initialWidth = container.getBoundingClientRect().width;
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
    if (iframe) iframe.style.pointerEvents = 'none';
  }

  function handleDrag(e) {
    if (!isDragging) return;
    const deltaX = currentX - e.clientX;
    const newWidth = initialWidth + deltaX;
    if (newWidth >= 200 && newWidth <= (window.innerWidth - 100)) {
      container.style.width = `${newWidth}px`;
      storage.save(container.style.width, container.style.display === 'block');
    }
  }

  function stopDrag() {
    isDragging = false;
    document.body.style.userSelect = '';
    if (iframe) iframe.style.pointerEvents = 'auto';
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
  }

  document.addEventListener('mousedown', (e) => {
    const resizerRect = resizer.getBoundingClientRect();
    if (e.clientX >= resizerRect.left && e.clientX <= resizerRect.right) {
      initDrag(e);
    }
  });

  const toggleButton = document.createElement('button');
  const iconSpan = document.createElement('span');
  iconSpan.textContent = '🖌';
  toggleButton.innerHTML = '';
  toggleButton.appendChild(iconSpan);

  toggleButton.style.position = 'fixed';
  toggleButton.style.right = '0';
  toggleButton.style.top = '50%';
  toggleButton.style.transform = 'translateY(-50%)';
  toggleButton.style.padding = '8px';
  toggleButton.style.borderRadius = '8px 0 0 8px';
  toggleButton.style.backgroundColor = '#ffa116';
  toggleButton.style.color = '#fff';
  toggleButton.style.cursor = 'pointer';
  toggleButton.style.opacity = '0.7';
  toggleButton.style.width = '40px';
  toggleButton.style.transition = 'opacity 0.3s';

  toggleButton.addEventListener('mouseover', () => {
    toggleButton.style.opacity = '1';
  });
  toggleButton.addEventListener('mouseout', () => {
    toggleButton.style.opacity = '0.7';
  });

  toggleButton.style.zIndex = '10000';

  toggleButton.addEventListener('click', () => {
    const newDisplay = container.style.display === 'none' ? 'block' : 'none';
    container.style.display = newDisplay;
    storage.save(container.style.width, newDisplay === 'block');
  });

  document.body.appendChild(toggleButton);
  document.body.appendChild(container);
})();