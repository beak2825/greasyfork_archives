// ==UserScript==
// @name         视频全页面适配·视频倍速播放器·纯净播放
// @namespace    https://toolsdar.cn/
// @version      0.4
// @description  将视频播放窗口适配为全页面显示
// @author       Your name
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527052/%E8%A7%86%E9%A2%91%E5%85%A8%E9%A1%B5%E9%9D%A2%E9%80%82%E9%85%8D%C2%B7%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E5%99%A8%C2%B7%E7%BA%AF%E5%87%80%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/527052/%E8%A7%86%E9%A2%91%E5%85%A8%E9%A1%B5%E9%9D%A2%E9%80%82%E9%85%8D%C2%B7%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E5%99%A8%C2%B7%E7%BA%AF%E5%87%80%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** ---------------- 存储封装（Tampermonkey 优先，回退 localStorage） ---------------- */
  const Storage = (() => {
    const hasGM = typeof GM_getValue === 'function' && typeof GM_setValue === 'function';
    const GET = (k, d) => {
      try {
        if (hasGM) return GM_getValue(k, d);
        const v = localStorage.getItem(k);
        return v == null ? d : JSON.parse(v);
      } catch { return d; }
    };
    const SET = (k, v) => {
      try {
        if (hasGM) return GM_setValue(k, v);
        localStorage.setItem(k, JSON.stringify(v));
      } catch {}
    };
    return { get: GET, set: SET };
  })();

  const KEY_ENABLED = 'videoFullpage:enabledSites';
  const KEY_POS     = 'videoFullpage:btnPos'; // 记录按钮位置
  const host = location.hostname;

  function loadEnabledMap() {
    const map = Storage.get(KEY_ENABLED, null);
    return map && typeof map === 'object' ? map : {};
  }
  function saveEnabledMap(map) { Storage.set(KEY_ENABLED, map); }
  function isSiteEnabled(h = host) {
    const map = loadEnabledMap();
    return !!map[h];
  }
  function setSiteEnabled(enabled, h = host) {
    const map = loadEnabledMap();
    if (enabled) map[h] = true;
    else delete map[h];
    saveEnabledMap(map);
  }

  function loadPosMap() {
    const map = Storage.get(KEY_POS, null);
    return map && typeof map === 'object' ? map : {};
  }
  function savePosMap(m) { Storage.set(KEY_POS, m); }
  function getBtnPos(name, h = host) {
    const m = loadPosMap();
    return (m[h] && m[h][name]) ? m[h][name] : null;
  }
  function setBtnPos(name, pos, h = host) {
    const m = loadPosMap();
    if (!m[h]) m[h] = {};
    m[h][name] = pos; // {left, top}
    savePosMap(m);
  }

  /** ---------------- 工具：等待 body、拖动封装 ---------------- */
  function ensureBody(cb) {
    if (document.body) return cb();
    const obs = new MutationObserver(() => {
      if (document.body) {
        obs.disconnect();
        cb();
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  /**
   * 让任意元素可拖动并记住位置
   * @param {HTMLElement} el  按钮元素
   * @param {string} name     名称：'siteToggle' 或 'actionButton'
   * @param {object} [opt]    { minX, minY, maxX, maxY } 可选
   */
  function makeDraggable(el, name, opt = {}) {
    el.style.position = 'fixed';
    el.style.cursor = 'move';

    // 载入持久化位置
    const saved = getBtnPos(name);
    if (saved && typeof saved.left === 'number' && typeof saved.top === 'number') {
      el.style.left = saved.left + 'px';
      el.style.top  = saved.top  + 'px';
    } else {
      // 默认位置：左上/右上
      if (name === 'siteToggle') { el.style.left = '20px'; el.style.top = '20px'; }
      else                       { el.style.right = '20px'; el.style.top = '20px'; } // actionButton 默认在右上
    }

    // 将 right 统一换算为 left，避免混用
    if (el.style.right) {
      const rightPx = parseFloat(getComputedStyle(el).right) || 0;
      const left = window.innerWidth - el.offsetWidth - rightPx;
      el.style.right = '';
      el.style.left = Math.max(0, left) + 'px';
    }

    let dragging = false;
    let startX = 0, startY = 0;
    let origLeft = 0, origTop = 0;
    let moved = false; // 抑制点击误触

    const threshold = 3;

    const getPoint = (ev) => {
      if (ev.touches && ev.touches[0]) return { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
      return { x: ev.clientX, y: ev.clientY };
    };

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    const onDown = (e) => {
      const p = getPoint(e);
      dragging = true;
      moved = false;
      startX = p.x; startY = p.y;
      origLeft = parseFloat(getComputedStyle(el).left) || 0;
      origTop  = parseFloat(getComputedStyle(el).top)  || 0;

      document.addEventListener('mousemove', onMove, { passive: false });
      document.addEventListener('mouseup', onUp, { passive: false });
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp, { passive: false });
      e.preventDefault();
      e.stopPropagation();
    };

    const onMove = (e) => {
      if (!dragging) return;
      const p = getPoint(e);
      const dx = p.x - startX;
      const dy = p.y - startY;
      if (!moved && Math.hypot(dx, dy) > threshold) moved = true;

      let newLeft = origLeft + dx;
      let newTop  = origTop  + dy;

      const minX = (typeof opt.minX === 'number') ? opt.minX : 0;
      const minY = (typeof opt.minY === 'number') ? opt.minY : 0;
      const maxX = (typeof opt.maxX === 'number') ? opt.maxX : (window.innerWidth  - el.offsetWidth);
      const maxY = (typeof opt.maxY === 'number') ? opt.maxY : (window.innerHeight - el.offsetHeight);

      newLeft = clamp(newLeft, minX, Math.max(minX, maxX));
      newTop  = clamp(newTop,  minY, Math.max(minY, maxY));

      el.style.left = newLeft + 'px';
      el.style.top  = newTop  + 'px';

      e.preventDefault();
      e.stopPropagation();
    };

    const onUp = (e) => {
      if (!dragging) return;
      dragging = false;

      // 保存位置
      const left = parseFloat(getComputedStyle(el).left) || 0;
      const top  = parseFloat(getComputedStyle(el).top)  || 0;
      setBtnPos(name, { left, top });

      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);

      // 如果拖动过，就阻止点击触发
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener('mousedown', onDown);
    el.addEventListener('touchstart', onDown, { passive: false });

    // 点击抑制：若刚拖完，阻止一次 click
    el.addEventListener('click', (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    }, true);

    // 窗口尺寸变化时，确保按钮仍在可视范围内
    window.addEventListener('resize', () => {
      const left = parseFloat(getComputedStyle(el).left) || 0;
      const top  = parseFloat(getComputedStyle(el).top)  || 0;
      const clampedLeft = Math.min(left, window.innerWidth - el.offsetWidth);
      const clampedTop  = Math.min(top,  window.innerHeight - el.offsetHeight);
      el.style.left = Math.max(0, clampedLeft) + 'px';
      el.style.top  = Math.max(0, clampedTop)  + 'px';
      setBtnPos(name, { left: Math.max(0, clampedLeft), top: Math.max(0, clampedTop) });
    });
  }

  /** ---------------- UI：站点启用/禁用开关 ---------------- */
  let siteToggleBtn = null;
  let videoFullpageInstance = null;

  function renderSiteToggle() {
    if (siteToggleBtn) return;
    siteToggleBtn = document.createElement('button');
    siteToggleBtn.className = 'vf-site-toggle';
    siteToggleBtn.style.cssText = `
      position: fixed;
      left: 20px;
      top: 20px;
      z-index: 2147483646;
      background: rgba(0,0,0,.6);
      color: #fff;
      border: none;
      border-radius: 16px;
      padding: 6px 10px;
      font-size: 12px;
      cursor: move;
      user-select: none;
      backdrop-filter: saturate(120%) blur(2px);
    `;
    updateSiteToggleText();

    siteToggleBtn.addEventListener('click', () => {
      const enabled = !isSiteEnabled();
      setSiteEnabled(enabled);
      updateSiteToggleText();

      // 如果在全页面模式且被关闭，则立即退出
      if (!enabled && videoFullpageInstance) {
        const v = document.querySelector('video.video-fullpage');
        if (v) videoFullpageInstance.restoreOriginalState(v);
      }
    });

    document.body.appendChild(siteToggleBtn);
    // 让站点按钮可拖动并记住位置
    makeDraggable(siteToggleBtn, 'siteToggle');
  }

  function updateSiteToggleText() {
    const enabled = isSiteEnabled();
    if (siteToggleBtn) {
      siteToggleBtn.textContent = enabled ? '本网站：已启用' : '本网站：未启用';
      siteToggleBtn.style.background = enabled ? 'rgba(34,197,94,.85)' : 'rgba(0,0,0,.6)';
    }
  }

  // 菜单命令（可选）：控制当前站点开关
  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('切换本网站开关', () => {
      const enabled = !isSiteEnabled();
      setSiteEnabled(enabled);
      updateSiteToggleText();
      alert(`已${enabled ? '启用' : '禁用'}：${host}`);
    });
    GM_registerMenuCommand('清空所有站点开关', () => {
      Storage.set(KEY_ENABLED, {});
      alert('已清空所有站点的启用状态');
      updateSiteToggleText();
    });
    GM_registerMenuCommand('清空按钮位置', () => {
      const map = loadPosMap();
      if (map[host]) delete map[host];
      savePosMap(map);
      alert('已清空本域名下的按钮位置，刷新后恢复默认');
    });
  }

  /** ---------------- 原有功能（仅在启用站点时可用） ---------------- */
  class VideoFullpage {
    constructor() {
      this.handleGlobalKey = this.handleGlobalKey.bind(this);
      document.addEventListener('keydown', this.handleGlobalKey, { capture: true });
      this.originalStates = new Map();
    }

    // 仅站点启用时响应热键
    handleGlobalKey(e) {
      if (!isSiteEnabled()) return;
      if (e.code === 'KeyH' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        const video = document.querySelector('video');
        if (!video) return;

        if (video.classList.contains('video-fullpage')) {
          this.toggleFullpage(video);
        } else {
          if (!this.initialized) {
            this.createButton();
            this.initialized = true;
          }
          this.toggleFullpage(video);
        }
      }
    }

    createButton() {
      const button = document.createElement('button');
      this.button = button;
      button.innerHTML = '全页面';
      button.style.cssText = `
        position: fixed;
        right: 20px;
        top: 20px;
        z-index: 2147483646;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        cursor: move;
        font-size: 14px;
        transition: background-color 0.3s;
        display: none;
      `;

      const style = document.createElement('style');
      style.textContent = `.active { background: rgba(0, 0, 0, 0.9) !important; }`;
      document.head.appendChild(style);

      document.body.appendChild(button);

      // 点击（非拖动）触发
      button.addEventListener('click', () => {
        if (!isSiteEnabled()) return;
        const video = document.querySelector('video');
        if (video) {
          this.toggleFullpage(video);
          button.classList.toggle('active');
        }
      });

      // 可拖动并记住位置（名称为 actionButton）
      makeDraggable(button, 'actionButton');
    }

    toggleFullpage(video) {
      if (video.classList.contains('video-fullpage')) {
        this.restoreOriginalState(video);
        if (this.button) {
          this.button.classList.remove('active');
          this.button.style.display = 'none';
        }
      } else {
        this.saveOriginalState(video);
        this.enterFullpage(video);
        if (this.button) {
          this.button.classList.add('active');
          this.button.style.display = 'block';
        }
      }
    }

    saveOriginalState(video) {
      const originalState = {
        style: video.style.cssText,
        parentNode: video.parentNode,
        nextSibling: video.nextSibling,
        scrollTop: window.scrollY,
        scrollLeft: window.scrollX,
        bodyOverflow: document.body.style.overflow,
        bodyPosition: document.body.style.position,
        videoPosition: {
          width: video.offsetWidth,
          height: video.offsetHeight,
          rect: video.getBoundingClientRect()
        }
      };
      this.originalStates.set(video, originalState);
    }

    restoreOriginalState(video) {
      const state = this.originalStates.get(video);
      if (!state) return;

      if (this.videoEvents) {
        video.removeEventListener('click', this.videoEvents.click);
        document.removeEventListener('keydown', this.videoEvents.keydown);
        this.videoEvents = null;
      }

      const container = document.querySelector('.video-fullpage-container');
      if (container) {
        if (state.parentNode) {
          if (state.nextSibling) state.parentNode.insertBefore(video, state.nextSibling);
          else state.parentNode.appendChild(video);
        }
        container.remove();
      }

      video.classList.remove('video-fullpage');
      video.style.cssText = state.style || '';

      document.body.style.overflow = state.bodyOverflow || '';
      document.body.style.position = state.bodyPosition || '';

      requestAnimationFrame(() => {
        window.scrollTo({ left: state.scrollLeft || 0, top: state.scrollTop || 0, behavior: 'instant' });
      });

      window.removeEventListener('resize', this.resizeHandler);

      this.originalStates.delete(video);

      const hint = document.querySelector('.video-seek-hint');
      if (hint) hint.remove();

      video.style.cssText = state.style || '';
      video.style.width = '';
      video.style.height = '';
      video.style.maxWidth = '100%';
      video.style.maxHeight = '100%';

      video.dispatchEvent(new CustomEvent('exitfullpage'));
      // 触发布局回流
      // eslint-disable-next-line no-unused-expressions
      video.offsetHeight;

      if (this.progressCleanup) {
        this.progressCleanup();
        this.progressCleanup = null;
      }
    }

    enterFullpage(video) {
      const container = document.createElement('div');
      container.className = 'video-fullpage-container';
      container.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.9);
        z-index: 2147483646;
        display: flex; justify-content: center; align-items: center;
      `;

      video.classList.add('video-fullpage');

      const updateVideoSize = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const videoRatio = video.videoWidth / video.videoHeight;
        const windowRatio = windowWidth / windowHeight;

        if (windowRatio > videoRatio) {
          video.style.cssText = `
            height: ${windowHeight}px !important;
            width: ${windowHeight * videoRatio}px !important;
            position: relative !important;
            z-index: 2147483647 !important;
            background: transparent !important;
            margin: 0 !important; padding: 0 !important;
            cursor: pointer !important;
          `;
        } else {
          video.style.cssText = `
            width: ${windowWidth}px !important;
            height: ${windowWidth / videoRatio}px !important;
            position: relative !important;
            z-index: 2147483647 !important;
            background: transparent !important;
            margin: 0 !important; padding: 0 !important;
            cursor: pointer !important;
          `;
        }
      };

      this.resizeHandler = updateVideoSize;
      window.addEventListener('resize', this.resizeHandler);

      const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (video.paused) video.play();
        else video.pause();
      };

      const handleKeydown = (e) => {
        if (!video.classList.contains('video-fullpage')) return;

        switch (e.code) {
          case 'Space':
            e.preventDefault();
            if (video.paused) video.play();
            else video.pause();
            break;
          case 'ArrowLeft':
          case 'KeyA':
            e.preventDefault();
            video.currentTime = Math.max(0, video.currentTime - 3);
            this.showSeekHint(video, '⏪ -3s');
            break;
          case 'ArrowRight':
          case 'KeyD':
            e.preventDefault();
            video.currentTime = Math.min(video.duration, video.currentTime + 3);
            this.showSeekHint(video, '⏩ +3s');
            break;
          case 'ArrowUp':
          case 'KeyW':
            e.preventDefault();
            video.volume = Math.min(1, video.volume + 0.1);
            this.showSeekHint(video, `🔊 ${Math.round(video.volume * 100)}%`);
            break;
          case 'ArrowDown':
          case 'KeyS':
            e.preventDefault();
            video.volume = Math.max(0, video.volume - 0.1);
            this.showSeekHint(video, `🔉 ${Math.round(video.volume * 100)}%`);
            break;
          case 'KeyC':
            e.preventDefault();
            video.playbackRate = Math.min(16, video.playbackRate + 0.1);
            this.showSeekHint(video, `⏩ ${video.playbackRate.toFixed(1)}x`);
            break;
          case 'KeyX':
            e.preventDefault();
            video.playbackRate = Math.max(0.1, video.playbackRate - 0.1);
            this.showSeekHint(video, `⏪ ${video.playbackRate.toFixed(1)}x`);
            break;
          case 'KeyZ':
            e.preventDefault();
            video.playbackRate = 1.0;
            this.showSeekHint(video, '⏮ 1.0x');
            break;
        }
      };

      video.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleKeydown);

      this.videoEvents = { click: handleClick, keydown: handleKeydown };

      container.appendChild(video);
      document.body.appendChild(container);
      document.body.style.overflow = 'hidden';

      if (video.readyState >= 1) updateVideoSize();
      else video.addEventListener('loadedmetadata', updateVideoSize, { once: true });

      // 进度条
      const progressContainer = document.createElement('div');
      progressContainer.className = 'video-progress-container';
      progressContainer.style.cssText = `
        position: absolute; bottom: 0; left: 0; right: 0;
        height: 40px;
        background: linear-gradient(transparent, rgba(0,0,0,.7));
        opacity: 0; transition: opacity .3s;
        display: flex; align-items: center;
        padding: 0 20px; z-index: 2147483647;
      `;

      const progress = document.createElement('div');
      progress.className = 'video-progress';
      progress.style.cssText = `
        position: relative; width: 100%; height: 4px;
        background: rgba(255,255,255,.3);
        border-radius: 2px; cursor: pointer;
      `;

      const progressFill = document.createElement('div');
      progressFill.className = 'video-progress-fill';
      progressFill.style.cssText = `
        position: absolute; left: 0; top: 0; height: 100%;
        background: #ff0000; border-radius: 2px;
      `;

      const timeDisplay = document.createElement('div');
      timeDisplay.className = 'video-time-display';
      timeDisplay.style.cssText = `
        color: #fff; margin-left: 10px; font-size: 14px; min-width: 100px; text-align: right;
      `;

      progress.appendChild(progressFill);
      progressContainer.appendChild(progress);
      progressContainer.appendChild(timeDisplay);

      const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m}:${s.toString().padStart(2, '0')}`;
      };

      const updateProgress = () => {
        const percent = (video.currentTime / video.duration) * 100;
        progressFill.style.width = `${percent}%`;
        timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
      };

      let isDragging = false;
      const handleProgressClick = (e) => {
        const rect = progress.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = video.duration * Math.min(1, Math.max(0, percent));
        updateProgress();
      };

      progress.addEventListener('mousedown', (e) => {
        isDragging = true;
        handleProgressClick(e);
      });
      document.addEventListener('mousemove', (e) => {
        if (isDragging) handleProgressClick(e);
      });
      document.addEventListener('mouseup', () => { isDragging = false; });

      let hideTimeout;
      container.addEventListener('mousemove', () => {
        progressContainer.style.opacity = '1';
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
          if (!isDragging) progressContainer.style.opacity = '0';
        }, 2000);
      });
      container.addEventListener('mouseleave', () => {
        if (!isDragging) progressContainer.style.opacity = '0';
      });

      video.addEventListener('timeupdate', updateProgress);
      container.appendChild(progressContainer);

      const cleanup = () => {
        video.removeEventListener('timeupdate', updateProgress);
        clearTimeout(hideTimeout);
      };
      this.progressCleanup = cleanup;
    }

    showSeekHint(video, text) {
      const existingHint = document.querySelector('.video-seek-hint');
      if (existingHint) existingHint.remove();

      const hint = document.createElement('div');
      hint.className = 'video-seek-hint';
      hint.textContent = text;
      hint.style.cssText = `
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,.8); color: #fff;
        padding: 10px 20px; border-radius: 4px; font-size: 16px;
        pointer-events: none; z-index: 2147483648;
        animation: vf-fadeOut .5s ease-out .5s forwards;
      `;

      const style = document.createElement('style');
      style.textContent = `@keyframes vf-fadeOut { from { opacity: 1; } to { opacity: 0; } }`;
      document.head.appendChild(style);

      const container = document.querySelector('.video-fullpage-container');
      if (container) {
        container.appendChild(hint);
        setTimeout(() => hint.remove(), 1000);
      }
    }
  }

  // 初始化 UI 与实例
  ensureBody(() => {
    renderSiteToggle();
    videoFullpageInstance = new VideoFullpage();
  });
})();