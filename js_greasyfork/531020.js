// ==UserScript==
// @name         网页拖拽与文本选择增强（优化版）
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  左键上下滑动拖拽网页，左右滑动自动复制文本，防止意外打开链接
// @author       deepseek and openai
// @match        *://*/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531020/%E7%BD%91%E9%A1%B5%E6%8B%96%E6%8B%BD%E4%B8%8E%E6%96%87%E6%9C%AC%E9%80%89%E6%8B%A9%E5%A2%9E%E5%BC%BA%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/531020/%E7%BD%91%E9%A1%B5%E6%8B%96%E6%8B%BD%E4%B8%8E%E6%96%87%E6%9C%AC%E9%80%89%E6%8B%A9%E5%A2%9E%E5%BC%BA%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let isDragging = false, isSelectingText = false, preventClick = false;
  let startY = 0, startX = 0, startScrollY = 0, startScrollX = 0;
  let moveListenerActive = false, originalUserSelect = '';

  const eventOptions = { passive: false, capture: true };

  function preventAll(e) {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
  }

  async function copySelectedText() {
      const selection = window.getSelection()?.toString();
      if (selection) {
          try {
              if (typeof GM_setClipboard !== 'undefined') GM_setClipboard(selection);
              else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(selection);
              else document.execCommand('copy');
          } catch (err) {
              console.error('复制失败:', err);
          }
      }
  }

  function disableTextSelection() {
      originalUserSelect = document.body.style.userSelect;
      document.body.style.userSelect = 'none';
  }

  function restoreTextSelection() {
      document.body.style.userSelect = originalUserSelect;
  }

  function handleMouseMove(e) {
      if (e.button !== 0) return;

      if (!isDragging && !isSelectingText) {
          const deltaY = Math.abs(e.clientY - startY);
          const deltaX = Math.abs(e.clientX - startX);
          if (deltaY > deltaX * 2) {
              disableTextSelection();
              isDragging = true;
              preventClick = true;
          } else if (deltaX > deltaY * 5) {
              restoreTextSelection();
              isSelectingText = true;
              preventClick = true;
          }
      }

      if (isDragging) {
          window.scrollTo(startScrollX - (e.clientX - startX), startScrollY - (e.clientY - startY));
          preventAll(e);
      }
  }

  function handleMouseUp(e) {
      if (e.button !== 0) return;
      if (isSelectingText) copySelectedText().catch(console.error);
      if (preventClick) preventAll(e);
      restoreTextSelection();
      cleanupListeners();
  }

  function cleanupListeners() {
      if (moveListenerActive) {
          document.removeEventListener('mousemove', handleMouseMove, eventOptions);
          document.removeEventListener('mouseup', handleMouseUp, eventOptions);
          moveListenerActive = false;
      }
      isDragging = isSelectingText = false;
  }

  document.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDragging = isSelectingText = preventClick = false;
      startY = e.clientY;
      startX = e.clientX;
      startScrollY = window.scrollY;
      startScrollX = window.scrollX;
      window.getSelection()?.removeAllRanges();
      if (!moveListenerActive) {
          document.addEventListener('mousemove', handleMouseMove, eventOptions);
          document.addEventListener('mouseup', handleMouseUp, eventOptions);
          moveListenerActive = true;
      }
  }, eventOptions);

  document.addEventListener('click', (e) => { if (preventClick) preventAll(e); }, eventOptions);
  document.addEventListener('dragstart', preventAll, eventOptions);
  document.addEventListener('copy', (e) => { if (isSelectingText) e.stopPropagation(); }, eventOptions);
  window.addEventListener('beforeunload', cleanupListeners);
})();
