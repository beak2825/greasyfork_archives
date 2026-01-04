// ==UserScript==
// @name         Add Debug Param to URL
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  自动为匹配的页面添加debug参数并处理相关配置
// @author       zb
// @match        *://portal-test.hzsteel.com/*
// @match        *://portal-pre.hzsteel.com/*
// @match        *://portal.hzsteel.com/*
// @match        *://xcportal-dev.hzsteel.com/*
// @match        *://xcportal-pre.hzsteel.com/*
// @match        *://172.19.13.42/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValues
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/528609/Add%20Debug%20Param%20to%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/528609/Add%20Debug%20Param%20to%20URL.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 配置项
  const CONFIG = {
    // 调试参数配置
    DEBUG_PARAMS: [
      { key: 'debug', value: 'true', force: true },
      // 可以继续添加更多参数
      // { key: 'mock', value: 'true' },
      // { key: 'env', value: 'development' },
    ],
    HASH_SEARCH_PARAMS: [
      { key: 'sceneData', value: 'domainext', force: true },
    ],
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    SOURCEMAP_PATH: '/mdf-node/sourcemap/mdfjs/666666',
    STORAGE_KEYS: {
      REDIRECTED: 'redirected',
      CAN_EDIT_JSON: 'yonubilder_can_edit_json'
    }
  };

  // 获取当前 URL 对象
  const currentUrl = new URL(window.decodeURIComponent(window.location.href));

  // 工具函数：安全的存储操作
  const storage = {
    local: {
      set: (key, value) => {
        try {
          window.localStorage.setItem(key, value);
        } catch (e) {
          console.error('localStorage设置失败:', e);
        }
      },
      get: (key) => {
        try {
          return window.localStorage.getItem(key);
        } catch (e) {
          console.error('localStorage获取失败:', e);
          return null;
        }
      }
    },
    session: {
      set: (key, value) => {
        try {
          window.sessionStorage.setItem(key, value);
        } catch (e) {
          console.error('sessionStorage设置失败:', e);
        }
      },
      get: (key) => {
        try {
          return window.sessionStorage.getItem(key);
        } catch (e) {
          console.error('sessionStorage获取失败:', e);
          return null;
        }
      },
      remove: (key) => {
        try {
          window.sessionStorage.removeItem(key);
        } catch (e) {
          console.error('sessionStorage删除失败:', e);
        }
      }
    }
  };

  // 清理空值参数（值为空字符串或 null/undefined）
  const cleanEmptyParams = (url) => {
    const params = url.searchParams;
    for (const [key, value] of params.entries()) {
      if (!value || value.trim() === '') {
        params.delete(key);
      }
    }
    return url;
  };

  // 带重试机制的预请求
  const preRequestWithRetry = async (retryCount = 0) => {
    const preRequestUrl = new URL(CONFIG.SOURCEMAP_PATH, window.location.origin).href;

    try {
      const response = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: preRequestUrl,
          timeout: 5000,
          onload: resolve,
          onerror: reject
        });
      });

      console.log('预请求成功:', response.status);
      if (!currentUrl.searchParams.has(CONFIG.DEBUG_PARAMS[0].key) &&
        !storage.session.get(CONFIG.STORAGE_KEYS.REDIRECTED)) {
        storage.session.set(CONFIG.STORAGE_KEYS.REDIRECTED, 'true');
        redirectWithDebugParam();
      }
    } catch (error) {
      console.error('预请求失败:', error);
      if (retryCount < CONFIG.MAX_RETRIES) {
        console.log(`${retryCount + 1}秒后重试...`);
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
        await preRequestWithRetry(retryCount + 1);
      }
    }
  };

  // 检查是否需要添加调试参数
  const needsDebugParams = () => {
    return CONFIG.DEBUG_PARAMS.some(param =>
      param.force || !currentUrl.searchParams.has(param.key)
    );
  };

  // 添加所有调试参数
  const addDebugParams = (url) => {
    CONFIG.DEBUG_PARAMS.forEach(param => {
      if (param.force || !url.searchParams.has(param.key)) {
        url.searchParams.set(param.key, param.value);
      }
    });
    return url;
  };

  // 修改重定向处理逻辑
  const redirectWithDebugParam = () => {
    // 获取当前URL的最新状态
    const currentUrl = new URL(window.decodeURIComponent(window.location.href));
    addDebugParams(currentUrl);
    console.log('redirectWithDebugParam', currentUrl)
    const { pathname, searchParams, hash } = currentUrl;
    if (pathname.includes('iuap-yonbuilder-designer')) {
      const [hashPath, hashQuery] = hash.split("?");
      const params = new URLSearchParams(hashQuery);
      const needReplace = CONFIG.HASH_SEARCH_PARAMS.some(param => params.has(param.key) && param.force);
      const needRedirect = currentUrl.toString() !== window.location.href;
      if (needReplace && needRedirect) {
        CONFIG.HASH_SEARCH_PARAMS.forEach(param => {
          if (param.force) {
            params.set(param.key, param.value);
          }
        })
        currentUrl.hash = `${hashPath}?${params.toString()}`;
        storage.local.set(CONFIG.STORAGE_KEYS.CAN_EDIT_JSON, '1');
        window.location.replace(currentUrl.toString());
      }
      return;
    }
    // 如果URL有变化才进行重定向
    if (currentUrl.toString() !== window.location.href) {
      storage.local.set(CONFIG.STORAGE_KEYS.CAN_EDIT_JSON, '1');
      window.location.replace(currentUrl.toString());
    }
  };

  // 修改主逻辑入口
  const init = () => {
    // 清除可能存在的过期重定向标记
    const currentTime = new Date().getTime();
    const lastRedirectTime = parseInt(storage.session.get('last_redirect_time') || '0');

    // 如果距离上次重定向超过2秒，清除重定向标记
    if (currentTime - lastRedirectTime > 2000) {
      storage.session.remove(CONFIG.STORAGE_KEYS.REDIRECTED);
    }

    if (needsDebugParams()) {
      // 记录当前重定向时间
      storage.session.set('last_redirect_time', currentTime.toString());

      if (!storage.session.get(CONFIG.STORAGE_KEYS.REDIRECTED)) {
        preRequestWithRetry();
      }
    }
  };

  // 启动脚本
  init();
})();