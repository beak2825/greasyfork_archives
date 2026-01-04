// ==UserScript==
// @name                YouTube CPU Tamer by AnimationFrame & Unhold YouTube Resource Locks
// @name:en             Unhold YouTube Resource Locks
// @namespace           http://tampermonkey.net/
// @version             1.0.1
// @license             MIT License
// @description         Release YouTube's used IndexDBs & Disable WebLock to make background tabs able to sleep
// @author              AA
// @match               https://www.youtube.com/*
// @match               https://www.youtube.com/embed/*
// @match               https://www.youtube-nocookie.com/embed/*
// @exclude             https://www.youtube.com/live_chat*
// @exclude             https://www.youtube.com/live_chat_replay*
// @match               https://music.youtube.com/*
// @match               https://m.youtube.com/*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                https://raw.githubusercontent.com/AA/userscript-supports/main/icons/youtube-unlock-indexedDB.png
// @supportURL          https://github.com/AA/userscript-supports

// @compatible          edge
// @compatible          chrome
// @compatible          firefox
// @compatible          opera

// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page

// @downloadURL https://update.greasyfork.org/scripts/529869/YouTube%20CPU%20Tamer%20by%20AnimationFrame%20%20Unhold%20YouTube%20Resource%20Locks.user.js
// @updateURL https://update.greasyfork.org/scripts/529869/YouTube%20CPU%20Tamer%20by%20AnimationFrame%20%20Unhold%20YouTube%20Resource%20Locks.meta.js
// ==/UserScript==



((globalContext) => {
  'use strict';

  const VERSION = '2025.03.01.1'; // 更新版本号
  const SCRIPT_KEY = 'yt_cpu_tamer_af_v2';
  const FRAME_ID = 'yt_cpu_tamer_frame_v2';
  const RAF_THROTTLE = 16; // ~60fps
  const TIME_UPDATE_THRESHOLD = 800; // 800ms

  const win = typeof globalThis !== 'undefined' ? globalThis : window;

  // 初始化检查
  if (win[SCRIPT_KEY]) return;
  win[SCRIPT_KEY] = { version: VERSION };

  // 浏览器能力检测
  const browserSupports = (() => {
    try {
      return {
        requestAnimationFrame: 'requestAnimationFrame' in win,
        webGL: !!document.createElement('canvas').getContext('webgl'),
        passiveEvents: (() => {
          let supports = false;
          try {
            const opts = Object.defineProperty({}, 'passive', {
              get: () => (supports = true)
            });
            win.addEventListener('test', null, opts);
            win.removeEventListener('test', null, opts);
          } catch (e) {}
          return supports;
        })()
      };
    } catch (e) {
      return { error: e };
    }
  })();

  if (!browserSupports.requestAnimationFrame || !browserSupports.webGL) {
    console.warn('[CPU Tamer] Browser not supported');
    return;
  }

  // 时间更新追踪器
  const createTimeTracker = () => {
    const tracker = {
      lastUpdate: Date.now(),
      update: () => tracker.lastUpdate = Date.now()
    };
    
    document.addEventListener('timeupdate', tracker.update, {
      passive: true,
      capture: true
    });
    
    return {
      getLastUpdate: () => tracker.lastUpdate,
      timeSinceUpdate: () => Date.now() - tracker.lastUpdate
    };
  };

  // 安全上下文创建
  const createCleanContext = async () => {
    const createHiddenIframe = () => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.sandbox = 'allow-same-origin';
      iframe.src = 'about:blank';
      return iframe;
    };

    const iframe = createHiddenIframe();
    document.documentElement.append(iframe);

    return new Promise((resolve) => {
      const checkReady = () => {
        if (iframe.contentWindow) {
          resolve({
            raf: iframe.contentWindow.requestAnimationFrame.bind(win),
            setTimeout: iframe.contentWindow.setTimeout.bind(win),
            setInterval: iframe.contentWindow.setInterval.bind(win),
            clearTimeout: iframe.contentWindow.clearTimeout.bind(win),
            clearInterval: iframe.contentWindow.clearInterval.bind(win)
          });
          iframe.remove();
        } else {
          requestAnimationFrame(checkReady);
        }
      };
      checkReady();
    });
  };

  // 主优化逻辑
  const initializeOptimizations = async () => {
    const timeTracker = createTimeTracker();
    const cleanContext = await createCleanContext();
    
    if (!cleanContext) return;

    // 智能节流控制器
    class ThrottleController {
      constructor() {
        this.callbacks = new Map();
        this.lastExecution = 0;
        this.active = true;
        
        this.rafLoop = () => {
          if (!this.active) return;
          const now = Date.now();
          
          if (now - this.lastExecution >= RAF_THROTTLE) {
            this.lastExecution = now;
            this.executeCallbacks();
          }
          
          cleanContext.raf(this.rafLoop);
        };
        
        this.rafLoop();
      }

      executeCallbacks() {
        const isActive = timeTracker.timeSinceUpdate() < TIME_UPDATE_THRESHOLD;
        
        this.callbacks.forEach((cb, id) => {
          if (isActive && document.visibilityState === 'visible') {
            try {
              cb.handler(...cb.args);
            } catch (e) {
              console.error('[CPU Tamer] Callback error:', e);
              this.remove(id);
            }
          }
        });
      }

      add(handler, timeout, ...args) {
        const id = Symbol();
        this.callbacks.set(id, { handler, args, timeout: Date.now() + timeout });
        return id;
      }

      remove(id) {
        this.callbacks.delete(id);
      }
    }

    // 重写定时器
    const throttleController = new ThrottleController();

    const wrapTimer = (originalFn, isInterval) => (handler, timeout, ...args) => {
      if (typeof handler !== 'function') {
        return originalFn(handler, timeout, ...args);
      }

      const wrappedHandler = () => {
        if (throttleController.active) {
          handler(...args);
        }
      };

      if (timeout <= RAF_THROTTLE) {
        const id = throttleController.add(wrappedHandler, timeout, ...args);
        return id;
      }

      return isInterval 
        ? cleanContext.setInterval(wrappedHandler, timeout)
        : cleanContext.setTimeout(wrappedHandler, timeout);
    };

    win.setTimeout = wrapTimer(cleanContext.setTimeout, false);
    win.setInterval = wrapTimer(cleanContext.setInterval, true);

    win.clearTimeout = win.clearInterval = (id) => {
      if (typeof id === 'symbol') {
        throttleController.remove(id);
      } else {
        cleanContext.clearTimeout(id);
        cleanContext.clearInterval(id);
      }
    };

    // 页面可见性处理
    const handleVisibilityChange = () => {
      throttleController.active = document.visibilityState === 'visible';
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange, {
      passive: true
    });

    // 容错处理
    window.addEventListener('error', (e) => {
      console.error('[CPU Tamer] Global error:', e);
    });
  };

  // 启动优化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOptimizations);
  } else {
    initializeOptimizations();
  }
})(null);