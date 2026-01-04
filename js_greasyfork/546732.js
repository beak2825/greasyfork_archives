// ==UserScript==
// @name         Long Press to Copy Selection with Formatting
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  After dragging, press and hold on the selected area to copy with formatting
// @author       ChatGPT
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546732/Long%20Press%20to%20Copy%20Selection%20with%20Formatting.user.js
// @updateURL https://update.greasyfork.org/scripts/546732/Long%20Press%20to%20Copy%20Selection%20with%20Formatting.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 설정값
  const LONG_PRESS_MS = 600; // 길게 누름 감지 시간 (밀리초)
  const MOVE_TOLERANCE = 10; // 허용 이동 거리(px)
  const MAX_PREVIEW_LENGTH = 100; // confirm 창에 표시할 최대 텍스트 길이

  let pressTimer = null;
  let startX = 0, startY = 0;
  let isDragging = false;

  // 선택된 HTML을 가져오기
  function getSelectionHTML() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const container = document.createElement("div");
    for (let i = 0; i < sel.rangeCount; i++) {
      container.appendChild(sel.getRangeAt(i).cloneContents());
    }
    return container.innerHTML;
  }

  // 선택된 순수 텍스트 가져오기
  function getSelectedText() {
    const sel = window.getSelection();
    return sel && sel.toString().trim() ? sel.toString() : null;
  }

  // 긴 텍스트를 미리보기용으로 축약
  function getPreviewText(text) {
    if (text.length <= MAX_PREVIEW_LENGTH) return text;
    return text.substring(0, MAX_PREVIEW_LENGTH) + '...';
  }

  // 길게 누른 좌표가 선택 영역 내부인지 확인
  function isPointInSelection(x, y) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    const range = sel.getRangeAt(0);
    const rects = range.getClientRects();
    for (const rect of rects) {
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return true;
      }
    }
    return false;
  }

  // 서식 포함 복사
  async function copySelectionWithFormatting(text, html) {
    try {
      if (navigator.clipboard?.write && window.ClipboardItem) {
        // 최신 API (HTML + 텍스트 동시 복사)
        const blobText = new Blob([text], { type: "text/plain" });
        const blobHTML = new Blob([html], { type: "text/html" });
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/plain": blobText,
            "text/html": blobHTML
          })
        ]);
        return true;
      } else {
        // 구형 브라우저 fallback
        // document.execCommand는 HTML 복사를 완벽하게 지원하지 않을 수 있음
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        const success = document.execCommand("copy");
        document.body.removeChild(ta);
        return success;
      }
    } catch (err) {
      console.error("Copy error:", err);
      throw err;
    }
  }

  // 길게 누름 시 처리
  function handleLongPress(x, y) {
    if (isDragging) return;
    
    // 선택 영역 정보를 먼저 저장 (confirm 전에)
    const text = getSelectedText();
    const html = getSelectionHTML();
    
    if (!text) return;
    if (!isPointInSelection(x, y)) return;

    // 미리보기용 짧은 텍스트 생성
    const previewText = getPreviewText(text);
    const charCount = text.length;
    
    // confirm 메시지를 간단하게 유지
    const message = charCount > MAX_PREVIEW_LENGTH
      ? `Copy ${charCount} characters to clipboard?\n\n"${previewText}"`
      : `Copy the selected text to clipboard?\n\n"${previewText}"`;
    
    if (confirm(message)) {
      copySelectionWithFormatting(text, html)
        .then(() => {
          alert(`✓ Copied ${charCount} characters to clipboard.`);
        })
        .catch(err => {
          alert(`✗ Copy failed: ${err.message || err}`);
        });
    }
  }

  function startPressTimer(x, y) {
    if (!getSelectedText()) return; // 선택된 텍스트가 없으면 무시
    pressTimer = setTimeout(() => handleLongPress(x, y), LONG_PRESS_MS);
  }

  function clearPressTimer() {
    clearTimeout(pressTimer);
    pressTimer = null;
  }

  // 드래그 감지
  document.addEventListener("selectionchange", () => {
    if (document.getSelection()?.toString()) {
      isDragging = true;
    }
  });

  // 터치 이벤트
  window.addEventListener("touchstart", e => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    isDragging = false;
    startPressTimer(startX, startY);
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    if (!pressTimer) return;
    const t = e.touches[0];
    if (Math.hypot(t.clientX - startX, t.clientY - startY) > MOVE_TOLERANCE) {
      clearPressTimer();
    }
  }, { passive: true });

  window.addEventListener("touchend", () => {
    if (isDragging) {
      isDragging = false;
    }
    clearPressTimer();
  });

  // 마우스 이벤트
  window.addEventListener("mousedown", e => {
    if (e.button !== 0) return; // 왼쪽 버튼만
    startX = e.clientX;
    startY = e.clientY;
    isDragging = false;
    startPressTimer(startX, startY);
  });

  window.addEventListener("mousemove", e => {
    if (!pressTimer) return;
    if (Math.hypot(e.clientX - startX, e.clientY - startY) > MOVE_TOLERANCE) {
      clearPressTimer();
    }
  });

  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
    }
    clearPressTimer();
  });

})();