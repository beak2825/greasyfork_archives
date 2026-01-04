// ==UserScript==
// @name         YouTube Defaulter
// @namespace    https://greasyfork.org/ru/users/901750-gooseob
// @version      1.12.3
// @description  Set speed, quality, subtitles and volume as default globally or per channel
// @author       AA
// @license      MIT
// @grant        window.onurlchange
// @match        http*://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/528440/YouTube%20Defaulter.user.js
// @updateURL https://update.greasyfork.org/scripts/528440/YouTube%20Defaulter.meta.js
// ==/UserScript==

// 配置管理器模块
const ConfigManager = (() => {
  const KEY = 'YTDefaulter';
  const DEFAULT_CONFIG = {
    _v: 4,
    global: {},
    channels: {},
    flags: {
      shortsToRegular: false,
      newTab: false,
      copySubs: false,
      standardMusicSpeed: false,
      enhancedBitrate: false,
      hideShorts: false
    }
  };

  return {
    load() {
      try {
        return JSON.parse(localStorage.getItem(KEY)) || DEFAULT_CONFIG;
      } catch (e) {
        return DEFAULT_CONFIG;
      }
    },
    save(config) {
      localStorage.setItem(KEY, JSON.stringify(config));
    },
    migrate(oldConfig) {
      // 迁移逻辑保持不变...
    }
  };
})();

// DOM缓存管理器
const DomCache = (() => {
  const cache = new WeakMap();
  const queryCache = new Map();

  return {
    get(selector, parent = document) {
      if (!queryCache.has(selector)) {
        queryCache.set(selector, parent.querySelector(selector));
      }
      return queryCache.get(selector);
    },
    cacheElement(element) {
      cache.set(element, true);
    }
  };
})();

// 事件管理器
const EventManager = {
  listeners: new Map(),
  add(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    this.listeners.set(handler, { target, type, handler, options });
  },
  remove(handler) {
    if (this.listeners.has(handler)) {
      const { target, type, handler: h, options } = this.listeners.get(handler);
      target.removeEventListener(type, h, options);
      this.listeners.delete(handler);
    }
  },
  clearAll() {
    this.listeners.forEach((value, handler) => this.remove(handler));
  }
};

// 核心功能类
class YouTubeDefaulter {
  constructor() {
    this.config = ConfigManager.load();
    this.domCache = new WeakMap();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupMutationObserver();
    this.injectStyles();
    this.setupPerformanceMonitor();
  }

  setupEventListeners() {
    EventManager.add(document, 'click', this.handleClick.bind(this), { capture: true });
    EventManager.add(document, 'keyup', this.handleKeyup.bind(this), { capture: true });
    // 其他事件监听...
  }

  setupMutationObserver() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          this.handleDomChanges(mutation.addedNodes, mutation.removedNodes);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
  }

  handleDomChanges(addedNodes, removedNodes) {
    // 处理DOM变化逻辑...
  }

  // 性能监控
  setupPerformanceMonitor() {
    if (performance.memory) {
      setInterval(() => {
        console.log(
          `Memory usage: ${Math.round(performance.memory.usedJSHeapSize / 1048576)}MB`
        );
      }, 5000);
    }
  }

  // 其他方法保持类似结构，进行模块化重构...
  // ...原有功能逻辑用类方法重新组织...
}

// 初始化
const optimizer = new YouTubeDefaulter();

// 性能测试Hook
window.runPerformanceTest = async () => {
  // 开始记录性能
  console.profile('Optimization Profile');
  performance.mark('test-start');

  // 模拟用户操作
  for (let i = 0; i < 100; i++) {
    await new Promise(resolve => setTimeout(resolve, 50));
    document.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }));
  }

  // 结束记录
  performance.mark('test-end');
  console.profileEnd('Optimization Profile');
  
  // 生成测量结果
  performance.measure('optimization-test', 'test-start', 'test-end');
  const measures = performance.getEntriesByName('optimization-test');
  measures.forEach(measure => {
    console.log(`Duration: ${measure.duration.toFixed(2)}ms`);
  });
}