// ==UserScript==
// @license  paperfly
// @name         强力代理图片放大（支持鼠标滚轮缩放与拖动）
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  弹窗放大图片，支持鼠标滚轮缩放，拖动时点击不关闭弹窗
// @match        https://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544165/%E5%BC%BA%E5%8A%9B%E4%BB%A3%E7%90%86%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7%EF%BC%88%E6%94%AF%E6%8C%81%E9%BC%A0%E6%A0%87%E6%BB%9A%E8%BD%AE%E7%BC%A9%E6%94%BE%E4%B8%8E%E6%8B%96%E5%8A%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544165/%E5%BC%BA%E5%8A%9B%E4%BB%A3%E7%90%86%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7%EF%BC%88%E6%94%AF%E6%8C%81%E9%BC%A0%E6%A0%87%E6%BB%9A%E8%BD%AE%E7%BC%A9%E6%94%BE%E4%B8%8E%E6%8B%96%E5%8A%A8%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function showPopup(src) {
    if (document.getElementById('img-popup-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'img-popup-overlay';
    overlay.isDragging = false; // 标记拖动状态
    Object.assign(overlay.style, {
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999999,
      cursor: 'pointer',
      overflow: 'hidden',
    });

    const img = document.createElement('img');
    img.src = src.startsWith('//') ? 'https:' + src : src;
    Object.assign(img.style, {
      maxWidth: '90%',
      maxHeight: '90%',
      borderRadius: '8px',
      boxShadow: '0 0 20px white',
      userSelect: 'none',
      pointerEvents: 'auto',
      transformOrigin: 'center center',
      transition: 'transform 0.1s ease-out',
      cursor: 'grab',
    });

    let scale = 1;
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let imgPos = { x: 0, y: 0 };

    img.addEventListener('wheel', e => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      scale = Math.min(Math.max(0.5, scale + delta), 5);
      updateTransform();
    });

    img.addEventListener('mousedown', e => {
      e.preventDefault();
      isDragging = true;
      overlay.isDragging = true;
      dragStart.x = e.clientX - imgPos.x;
      dragStart.y = e.clientY - imgPos.y;
      img.style.cursor = 'grabbing';
    });

    img.addEventListener('mousemove', e => {
      if (!isDragging) return;
      e.preventDefault();
      imgPos.x = e.clientX - dragStart.x;
      imgPos.y = e.clientY - dragStart.y;
      updateTransform();
    });

    img.addEventListener('mouseup', e => {
      if (!isDragging) return;
      e.preventDefault();
      isDragging = false;
      overlay.isDragging = false;
      img.style.cursor = 'grab';
    });

    // 处理鼠标移出图片时，取消拖动状态，避免异常
    img.addEventListener('mouseleave', e => {
      if (!isDragging) return;
      e.preventDefault();
      isDragging = false;
      overlay.isDragging = false;
      img.style.cursor = 'grab';
    });

    // 点击图片阻止冒泡，避免关闭弹窗
    img.addEventListener('click', e => {
      e.stopPropagation();
    });

    // 点击遮罩层关闭弹窗，但拖动时不关闭
    overlay.addEventListener('click', () => {
      if (!overlay.isDragging) {
        overlay.remove();
      }
    });

    function updateTransform() {
      img.style.transform = `translate(${imgPos.x}px, ${imgPos.y}px) scale(${scale})`;
    }

    overlay.appendChild(img);
    document.body.appendChild(overlay);
  }

  function updateCursorStyle() {
    const imgs = document.querySelectorAll('img.img-preview');
    imgs.forEach(img => {
      img.style.cursor = 'zoom-in';
    });
  }

  document.body.addEventListener('click', (e) => {
    let target = e.target;
    while (target && target !== document.body) {
      if (target.tagName === 'IMG' && target.classList.contains('img-preview')) {
        showPopup(target.src);
        break;
      }
      target = target.parentElement;
    }
  }, true);

  window.addEventListener('load', () => {
    updateCursorStyle();
    const observer = new MutationObserver(() => {
      updateCursorStyle();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
