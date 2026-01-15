// ==UserScript==
// @name         Selection Context
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  Get the selected text along with text before and after the selection
// @author       RoCry
// @license MIT
// ==/UserScript==
const DEFAULT_CONTEXT_LENGTH = 500;
const MAX_CONTEXT_LENGTH = 8192;
const BLOCK_SELECTORS = 'article, section, main, p, div, li, td, th, blockquote, pre';
function getSelectionRoot(range) {
  const container = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
    ? range.commonAncestorContainer
    : range.commonAncestorContainer.parentElement;
  if (!container) return document.body;
  return container.closest(BLOCK_SELECTORS) || document.body;
}
function extractSelectedHTML(range) {
  try {
    const fragment = range.cloneContents();
    const container = document.createElement('div');
    container.appendChild(fragment);
    const parentElement = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentElement
      : range.commonAncestorContainer;
    if (parentElement && parentElement.nodeName !== 'BODY') {
      const tagName = parentElement.nodeName.toLowerCase();
      return `<${tagName}>${container.innerHTML}</${tagName}>`;
    }
    return container.innerHTML;
  } catch (error) {
    console.error('Error extracting HTML from selection:', error);
    return null;
  }
}
function getTextNodesIn(node) {
  const textNodes = [];
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
  let currentNode = walker.nextNode();
  while (currentNode) {
    textNodes.push(currentNode);
    currentNode = walker.nextNode();
  }
  return textNodes;
}
/**
 * Gets the selected text along with text before and after the selection
 * @param {number} tryContextLength - Desired length of context to try to collect (before + after selection)
 * @returns {Object|null} Object containing selectedHTML, selectedText, textBefore, textAfter, paragraphText
 */
function GetSelectionContext(tryContextLength = DEFAULT_CONTEXT_LENGTH) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const selectedText = selection.toString().trim();
  if (!selectedText) return null;
  const range = selection.getRangeAt(0);
  const actualContextLength = Math.min(tryContextLength, MAX_CONTEXT_LENGTH);
  const halfContextLength = Math.floor(actualContextLength / 2);
  const root = getSelectionRoot(range) || document.body;
  const allTextNodes = getTextNodesIn(root);
  const startNode = range.startContainer;
  const endNode = range.endContainer;
  const startIndex = allTextNodes.indexOf(startNode);
  const endIndex = allTextNodes.indexOf(endNode);
  if (startIndex === -1 || endIndex === -1) {
    console.warn('Selection nodes not found in text node list. Returning minimal context.');
    return {
      selectedHTML: extractSelectedHTML(range) || selectedText,
      selectedText,
      textBefore: '',
      textAfter: '',
      paragraphText: selectedText
    };
  }
  let textBefore = '';
  let textAfter = '';
  let currentLength = 0;
  if (startNode.nodeType === Node.TEXT_NODE) {
    textBefore = startNode.textContent.substring(0, range.startOffset);
    currentLength = textBefore.length;
  }
  let beforeIndex = startIndex - 1;
  while (beforeIndex >= 0 && currentLength < halfContextLength) {
    const nodeText = allTextNodes[beforeIndex].textContent || '';
    textBefore = `${nodeText}\n${textBefore}`;
    currentLength += nodeText.length;
    beforeIndex -= 1;
  }
  if (beforeIndex >= 0) {
    textBefore = `...\n${textBefore}`;
  }
  currentLength = 0;
  if (endNode.nodeType === Node.TEXT_NODE) {
    textAfter = endNode.textContent.substring(range.endOffset);
    currentLength = textAfter.length;
  }
  let afterIndex = endIndex + 1;
  while (afterIndex < allTextNodes.length && currentLength < halfContextLength) {
    const nodeText = allTextNodes[afterIndex].textContent || '';
    textAfter += `${nodeText}\n`;
    currentLength += nodeText.length;
    afterIndex += 1;
  }
  if (afterIndex < allTextNodes.length) {
    textAfter += '\n...';
  }
  textBefore = textBefore.trim();
  textAfter = textAfter.trim();
  const paragraphText = `${textBefore} ${selectedText} ${textAfter}`.trim();
  return {
    selectedHTML: extractSelectedHTML(range) || selectedText,
    selectedText,
    textBefore,
    textAfter,
    paragraphText
  };
}
const TextExplainerUI = (() => {
  const IDS = {
    popup: 'explainer-popup',
    overlay: 'explainer-overlay',
    content: 'explainer-content',
    loading: 'explainer-loading',
    error: 'explainer-error',
    floatingButton: 'explainer-floating-button'
  };
  const POPUP_WIDTH = 450;
  const POPUP_MAX_HEIGHT_RATIO = 0.8;
  const STYLE_TEXT = `#${IDS.popup}{position:absolute;width:${POPUP_WIDTH}px;max-width:90vw;max-height:80vh;padding:20px;z-index:2147483647;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;background:rgba(255,255,255,0.85);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-radius:8px;box-shadow:0 5px 15px rgba(0,0,0,0.2);border:1px solid rgba(0,0,0,0.15);color:#111;text-shadow:0 0 1px rgba(255,255,255,0.3);transition:all 0.3s ease;}#${IDS.popup}.dark-theme{background:rgba(45,45,50,0.85);color:#e0e0e0;border:1px solid rgba(255,255,255,0.15);box-shadow:0 5px 15px rgba(0,0,0,0.4);text-shadow:0 0 1px rgba(0,0,0,0.3);}#${IDS.overlay}{position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483646;background:transparent;}@supports (-webkit-touch-callout: none){#${IDS.popup}{background:rgba(255,255,255,0.98);backdrop-filter:none;-webkit-backdrop-filter:none;}#${IDS.popup}.dark-theme{background:rgba(35,35,40,0.98);}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes fadeOut{from{opacity:1}to{opacity:0}}#${IDS.loading}{text-align:center;padding:20px 0;display:flex;align-items:center;justify-content:center;}#${IDS.loading}:after{content:\"\";width:24px;height:24px;border:3px solid #ddd;border-top:3px solid #2196F3;border-radius:50%;animation:spin 1s linear infinite;display:inline-block;}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}#${IDS.error}{color:#d32f2f;padding:8px;border-radius:4px;margin-bottom:10px;font-size:14px;display:none;}@media (prefers-color-scheme: dark){#${IDS.popup}{background:rgba(35,35,40,0.85);color:#e0e0e0;}#${IDS.error}{background-color:rgba(100,25,25,0.4);color:#ff8a8a;}#${IDS.floatingButton}{background-color:rgba(33,150,243,0.9);}}@media (hover:none) and (pointer:coarse){#${IDS.popup}{width:95vw;max-height:90vh;padding:15px;font-size:16px;}#${IDS.popup} p,#${IDS.popup} li{line-height:1.6;margin-bottom:12px;}#${IDS.popup} a{padding:8px 0;}}`;
  let stylesInjected = false;
  let currentPopup = null;
  function ensureStyles() {
    if (stylesInjected) return;
    const addStyle = typeof GM_addStyle === 'function'
      ? GM_addStyle
      : (cssText) => {
        const style = document.createElement('style');
        style.textContent = cssText;
        document.head.appendChild(style);
        return style;
      };
    if (!document.head) {
      throw new Error('document.head is not available');
    }
    addStyle(STYLE_TEXT);
    stylesInjected = true;
  }
  function isTouchDevice() {
    return ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0);
  }
  function parseRgb(color) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (!match) return null;
    return {
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3])
    };
  }
  function luminance(color) {
    const rgb = parseRgb(color);
    if (!rgb) return 128;
    return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
  }
  function isPageDarkMode() {
    const bodyStyle = window.getComputedStyle(document.body);
    const htmlStyle = window.getComputedStyle(document.documentElement);
    const bodyBg = bodyStyle.backgroundColor;
    const htmlBg = htmlStyle.backgroundColor;
    const threshold = 128;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (luminance(bodyBg) < threshold) return true;
    if (bodyBg === 'rgba(0, 0, 0, 0)' && luminance(htmlBg) < threshold) return true;
    if (bodyBg === 'rgba(0, 0, 0, 0)' && htmlBg === 'rgba(0, 0, 0, 0)') return prefersDark;
    return false;
  }
  function calculatePopupPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    const selectionRect = range.getBoundingClientRect();
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popupHeight = Math.min(500, viewportHeight * POPUP_MAX_HEIGHT_RATIO);
    const margin = 20;
    const position = {};
    if (selectionRect.bottom + margin + popupHeight <= viewportHeight) {
      position.top = selectionRect.bottom + scrollTop + margin;
      position.left = Math.min(
        Math.max(10 + scrollLeft, selectionRect.left + scrollLeft + (selectionRect.width / 2) - (POPUP_WIDTH / 2)),
        viewportWidth + scrollLeft - POPUP_WIDTH - 10
      );
      position.placement = 'below';
      return position;
    }
    if (selectionRect.top - margin - popupHeight >= 0) {
      position.top = selectionRect.top + scrollTop - margin - popupHeight;
      position.left = Math.min(
        Math.max(10 + scrollLeft, selectionRect.left + scrollLeft + (selectionRect.width / 2) - (POPUP_WIDTH / 2)),
        viewportWidth + scrollLeft - POPUP_WIDTH - 10
      );
      position.placement = 'above';
      return position;
    }
    if (selectionRect.right + margin + POPUP_WIDTH <= viewportWidth) {
      position.top = Math.max(10 + scrollTop, Math.min(
        selectionRect.top + scrollTop,
        viewportHeight + scrollTop - popupHeight - 10
      ));
      position.left = selectionRect.right + scrollLeft + margin;
      position.placement = 'right';
      return position;
    }
    if (selectionRect.left - margin - POPUP_WIDTH >= 0) {
      position.top = Math.max(10 + scrollTop, Math.min(
        selectionRect.top + scrollTop,
        viewportHeight + scrollTop - popupHeight - 10
      ));
      position.left = selectionRect.left + scrollLeft - margin - POPUP_WIDTH;
      position.placement = 'left';
      return position;
    }
    position.top = Math.max(10 + scrollTop, Math.min(
      selectionRect.top + selectionRect.height + scrollTop + margin,
      viewportHeight / 2 + scrollTop - popupHeight / 2
    ));
    position.left = Math.max(10 + scrollLeft, Math.min(
      selectionRect.left + selectionRect.width / 2 + scrollLeft - POPUP_WIDTH / 2,
      viewportWidth + scrollLeft - POPUP_WIDTH - 10
    ));
    position.placement = 'center';
    return position;
  }
  function openPopup({ isTouch, isDark }) {
    ensureStyles();
    closePopup();
    const popup = document.createElement('div');
    popup.id = IDS.popup;
    if (isDark) popup.classList.add('dark-theme');
    popup.innerHTML = `
      <div id="${IDS.error}"></div>
      <div id="${IDS.loading}"></div>
      <div id="${IDS.content}"></div>
    `;
    if (!document.body) {
      throw new Error('document.body is not available');
    }
    document.body.appendChild(popup);
    if (isTouch) {
      popup.style.position = 'fixed';
      popup.style.top = '50%';
      popup.style.left = '50%';
      popup.style.transform = 'translate(-50%, -50%)';
      popup.style.width = '90vw';
      popup.style.maxHeight = '85vh';
    } else {
      const position = calculatePopupPosition();
      if (position) {
        popup.style.transform = 'none';
        if (position.top !== undefined) popup.style.top = `${position.top}px`;
        if (position.left !== undefined) popup.style.left = `${position.left}px`;
      } else {
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
      }
    }
    popup.style.animation = 'fadeIn 0.3s ease';
    const popupState = {
      popup,
      contentEl: popup.querySelector(`#${IDS.content}`),
      loadingEl: popup.querySelector(`#${IDS.loading}`),
      errorEl: popup.querySelector(`#${IDS.error}`),
      overlay: null,
      cleanup: []
    };
    function closeOnEsc(event) {
      if (event.key === 'Escape') {
        closePopup();
      }
    }
    document.addEventListener('keydown', closeOnEsc);
    popupState.cleanup.push(() => document.removeEventListener('keydown', closeOnEsc));
    if (isTouch) {
      const overlay = document.createElement('div');
      overlay.id = IDS.overlay;
      popupState.overlay = overlay;
      document.body.appendChild(overlay);
      let touchStarted = false;
      let startX = 0;
      let startY = 0;
      const moveThreshold = 30;
      function onOverlayTouchStart(event) {
        touchStarted = true;
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
      }
      function onOverlayTouchEnd(event) {
        if (!touchStarted) return;
        const touch = event.changedTouches[0];
        const moveX = Math.abs(touch.clientX - startX);
        const moveY = Math.abs(touch.clientY - startY);
        if (moveX < moveThreshold && moveY < moveThreshold) {
          closePopup();
        }
        touchStarted = false;
      }
      function stopPropagation(event) {
        event.stopPropagation();
      }
      overlay.addEventListener('touchstart', onOverlayTouchStart, { passive: true });
      overlay.addEventListener('touchmove', () => {}, { passive: true });
      overlay.addEventListener('touchend', onOverlayTouchEnd, { passive: true });
      popup.addEventListener('touchstart', stopPropagation, { passive: false });
      popupState.cleanup.push(() => overlay.removeEventListener('touchstart', onOverlayTouchStart));
      popupState.cleanup.push(() => overlay.removeEventListener('touchend', onOverlayTouchEnd));
      popupState.cleanup.push(() => popup.removeEventListener('touchstart', stopPropagation));
    } else {
      function onOutsideClick(event) {
        if (popup.contains(event.target)) return;
        closePopup();
      }
      document.addEventListener('click', onOutsideClick);
      popupState.cleanup.push(() => document.removeEventListener('click', onOutsideClick));
    }
    currentPopup = popupState;
    return popupState;
  }
  function closePopup() {
    if (!currentPopup) return;
    const popup = currentPopup.popup;
    popup.style.animation = 'fadeOut 0.2s ease';
    const { overlay, cleanup } = currentPopup;
    const remove = () => {
      cleanup.forEach(fn => fn());
      if (overlay) overlay.remove();
      popup.remove();
      currentPopup = null;
    };
    setTimeout(remove, 200);
  }
  function setLoading(popupState, isVisible) {
    if (!popupState || !popupState.loadingEl) return;
    popupState.loadingEl.style.display = isVisible ? 'flex' : 'none';
  }
  function showError(popupState, message) {
    if (!popupState || !popupState.errorEl) return;
    popupState.errorEl.textContent = message;
    popupState.errorEl.style.display = 'block';
    setLoading(popupState, false);
  }
  function updateContent(popupState, text) {
    if (!popupState || !popupState.contentEl) return;
    if (!text) return;
    let content = text.trim();
    if (!content) return;
    try {
      if (content.startsWith('```')) {
        if (content.endsWith('```')) {
          content = content.split('\n').slice(1, -1).join('\n');
        } else {
          content = content.split('\n').slice(1).join('\n');
        }
      }
      if (!content.startsWith('<')) {
        content = `<p>${content.replace(/\n/g, '<br>')}</p>`;
      }
      popupState.contentEl.innerHTML = content;
    } catch (error) {
      popupState.contentEl.innerHTML = `<p>${content.replace(/\n/g, '<br>')}</p>`;
    }
  }
  function createFloatingButton({ size, onTrigger, label }) {
    const button = document.createElement('div');
    button.id = IDS.floatingButton;
    let buttonSize = '50px';
    if (size === 'small') buttonSize = '40px';
    if (size === 'large') buttonSize = '60px';
    button.style.cssText = `
      width: ${buttonSize};
      height: ${buttonSize};
      border-radius: 50%;
      background-color: rgba(33, 150, 243, 0.8);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      z-index: 9999;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      font-weight: bold;
      font-size: ${parseInt(buttonSize, 10) * 0.4}px;
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.2s ease;
      pointer-events: none;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    `;
    button.setAttribute('aria-label', 'Explain selection');
    button.innerHTML = label || 'TE';
    if (!document.body) {
      throw new Error('document.body is not available');
    }
    document.body.appendChild(button);
    function handleButtonAction(event) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof onTrigger === 'function') {
        onTrigger(event);
      }
    }
    button.addEventListener('click', handleButtonAction);
    button.addEventListener('touchstart', (event) => {
      event.preventDefault();
      event.stopPropagation();
      button.style.transform = 'scale(0.95)';
    }, { passive: false });
    button.addEventListener('touchend', (event) => {
      event.preventDefault();
      event.stopPropagation();
      button.style.transform = 'scale(1)';
      handleButtonAction(event);
    }, { passive: false });
    button.addEventListener('mousedown', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    return button;
  }
  function showFloatingButton(button) {
    if (!button) return false;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      hideFloatingButton(button);
      return false;
    }
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const buttonSize = parseInt(button.style.width, 10);
    const margin = 10;
    let top = rect.bottom + margin;
    let left = rect.left + (rect.width / 2) - (buttonSize / 2);
    if (top + buttonSize > window.innerHeight) {
      top = rect.top - buttonSize - margin;
    }
    left = Math.max(10, Math.min(left, window.innerWidth - buttonSize - 10));
    button.style.top = `${top}px`;
    button.style.left = `${left}px`;
    button.style.opacity = '1';
    button.style.pointerEvents = 'auto';
    return true;
  }
  function hideFloatingButton(button) {
    if (!button) return;
    button.style.opacity = '0';
    button.style.pointerEvents = 'none';
  }
  return {
    ensureStyles,
    isTouchDevice,
    isPageDarkMode,
    openPopup,
    closePopup,
    setLoading,
    showError,
    updateContent,
    createFloatingButton,
    showFloatingButton,
    hideFloatingButton
  };
})();
window.GetSelectionContext = GetSelectionContext;
window.TextExplainerUI = TextExplainerUI;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GetSelectionContext, TextExplainerUI };
} else {
  window.SelectionUtils = window.SelectionUtils || {};
  window.SelectionUtils.GetSelectionContext = GetSelectionContext;
}
