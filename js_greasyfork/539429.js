// ==UserScript==
// @name         Weibo Blacklist Enhanced Lite | 微博黑名单增强工具
// @version      1.0.0-lite
// @description  轻量版：专注于黑名单功能的微博增强工具。全接口劫持并隐藏黑名单用户所有言论与转发；自动同步黑名单；支持增量更新。
// @author       DanielZenFlow
// @license      MIT
// @namespace    https://github.com/DanielZenFlow
// @homepage     https://github.com/DanielZenFlow/Weibo-Blacklist-Enhanced-Lite
// @supportURL   https://github.com/DanielZenFlow/Weibo-Blacklist-Enhanced-Lite/issues
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @match        https://weibo.com/set/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539429/Weibo%20Blacklist%20Enhanced%20Lite%20%7C%20%E5%BE%AE%E5%8D%9A%E9%BB%91%E5%90%8D%E5%8D%95%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/539429/Weibo%20Blacklist%20Enhanced%20Lite%20%7C%20%E5%BE%AE%E5%8D%9A%E9%BB%91%E5%90%8D%E5%8D%95%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

/*
 * Weibo Blacklist Enhanced Lite
 * Copyright (c) 2025 DanielZenFlow
 * Licensed under MIT License
 * GitHub: https://github.com/DanielZenFlow
 */

(function() {
  'use strict';

  // === GM_* 接口封装 ===
  const _GM_getValue = typeof GM_getValue !== 'undefined' ? GM_getValue : () => {};
  const _GM_setValue = typeof GM_setValue !== 'undefined' ? GM_setValue : () => {};
  const _GM_registerMenuCommand = typeof GM_registerMenuCommand !== 'undefined' ? GM_registerMenuCommand : () => {};
  const _GM_openInTab = typeof GM_openInTab !== 'undefined' ? GM_openInTab : null;

  // === 智能打开链接函数 ===
  function openGitHub() {
    const url = 'https://github.com/DanielZenFlow/Weibo-Blacklist-Enhanced-Lite';

    // 优先使用油猴的专用API（不会被拦截）
    if (_GM_openInTab) {
      _GM_openInTab(url, { active: true });
      return;
    }

    // 降级到普通弹窗
    const newWindow = window.open(url, '_blank');

    // 检测是否被拦截
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // 延迟检测，有些浏览器需要时间
      setTimeout(() => {
        if (!newWindow || newWindow.closed) {
          alert(
            '🚫 弹窗被浏览器拦截了！\n\n' +
            '📋 GitHub链接：' + url + '\n\n' +
            '💡 解决方法：\n' +
            '1. 复制上面的链接到新标签页\n' +
            '2. 或者允许此网站的弹窗权限'
          );
        }
      }, 100);
    }
  }

  // === 智能打开链接函数 ===
  function openGitHub() {
    const url = 'https://github.com/DanielZenFlow/Weibo-Blacklist-Enhanced-Lite';

    // 优先使用油猴的专用API（不会被拦截）
    if (_GM_openInTab) {
      _GM_openInTab(url, { active: true });
      return;
    }

    // 降级到普通弹窗
    const newWindow = window.open(url, '_blank');

    // 检测是否被拦截
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // 延迟检测，有些浏览器需要时间
      setTimeout(() => {
        if (!newWindow || newWindow.closed) {
          alert(
            '🚫 弹窗被浏览器拦截了！\n\n' +
            '📋 GitHub链接：' + url + '\n\n' +
            '💡 解决方法：\n' +
            '1. 复制上面的链接到新标签页\n' +
            '2. 或者允许此网站的弹窗权限'
          );
        }
      }, 100);
    }
  }

  // === Star提醒检查（时间间隔策略） ===
  function checkStarReminder() {
    const isDisabled = _GM_getValue(CONFIG.STAR_REMINDER_DISABLED_KEY, false);
    if (isDisabled) return;

    const now = Date.now();
    const lastReminderTime = _GM_getValue(CONFIG.LAST_STAR_REMINDER_TIME_KEY, 0);
    const daysSinceLastReminder = (now - lastReminderTime) / (1000 * 60 * 60 * 24);

    // 检查是否需要提醒
    let shouldRemind = false;
    let currentInterval = 0;

    if (lastReminderTime === 0) {
      // 首次运行
      shouldRemind = true;
    } else {
      // 找到当前应该的间隔
      for (let i = 1; i < CONFIG.STAR_REMINDER_INTERVALS.length; i++) {
        if (daysSinceLastReminder >= CONFIG.STAR_REMINDER_INTERVALS[i]) {
          currentInterval = i;
          shouldRemind = true;
        }
      }
    }

    if (shouldRemind) {
      setTimeout(() => {
        showStarReminder(currentInterval);
        _GM_setValue(CONFIG.LAST_STAR_REMINDER_TIME_KEY, now);
      }, 3000); // 3秒后弹出
    }
  }

  // === 显示Star提醒 ===
  function showStarReminder(intervalIndex) {
    const isFirstTime = intervalIndex === 0;
    const message = isFirstTime
      ? '🎉 感谢使用 Weibo Blacklist Enhanced Lite！\n\n如果这个工具对您有帮助，请考虑给我们点个 ⭐ Star！'
      : '⭐ 再次感谢使用我们的工具！\n\n如果觉得有用，请考虑给项目点个 Star 支持一下！';

    const result = confirm(
      `${message}\n\n` +
      `点击"确定"打开 GitHub 页面\n` +
      `点击"取消"${isFirstTime ? '稍后提醒' : '不再提醒'}`
    );

    if (result) {
      openGitHub();

      // 30秒后询问是否已给star
      setTimeout(() => {
        const hasStarred = confirm(
          '感谢访问我们的 GitHub 页面！\n\n' +
          '如果您已经给了 ⭐ Star，点击"确定"我们将不再提醒\n' +
          '点击"取消"我们稍后再提醒'
        );

        if (hasStarred) {
          _GM_setValue(CONFIG.STAR_REMINDER_DISABLED_KEY, true);
          alert('🎉 感谢您的 Star！我们将不再显示提醒。');
        }
      }, 30000);

    } else if (!isFirstTime) {
      // 非首次提醒，用户选择取消就不再提醒
      _GM_setValue(CONFIG.STAR_REMINDER_DISABLED_KEY, true);
    }
  }
  function openGitHub() {
    const url = 'https://github.com/DanielZenFlow/Weibo-Blacklist-Enhanced-Lite';

    // 优先使用油猴的专用API（不会被拦截）
    if (_GM_openInTab) {
      _GM_openInTab(url, { active: true });
      return;
    }

    // 降级到普通弹窗
    const newWindow = window.open(url, '_blank');

    // 检测是否被拦截
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // 延迟检测，有些浏览器需要时间
      setTimeout(() => {
        if (!newWindow || newWindow.closed) {
          alert(
            '🚫 弹窗被浏览器拦截了！\n\n' +
            '📋 GitHub链接：' + url + '\n\n' +
            '💡 解决方法：\n' +
            '1. 复制上面的链接到新标签页\n' +
            '2. 或者允许此网站的弹窗权限'
          );
        }
      }, 100);
    }
  }

  // === 配置常量 ===
  const CONFIG = {
    STORAGE_KEY: 'WB_BL_LITE_UIDS',
    FIRST_RUN_KEY: 'WB_BL_LITE_FIRST_RUN',
    STAR_REMINDER_DISABLED_KEY: 'WB_BL_LITE_STAR_REMINDER_DISABLED',
    LAST_STAR_REMINDER_TIME_KEY: 'WB_BL_LITE_LAST_STAR_REMINDER_TIME',
    THROTTLE_MS: 300,
    MAX_RETRIES: 3,
    VERSION: '1.0.0-lite',
    // Star提醒间隔：首次安装 → 7天后 → 30天后 → 90天后 → 不再提醒
    STAR_REMINDER_INTERVALS: [0, 7, 30, 90] // 天数
  };

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // 保存原生接口
  if (!window.WB_BL_NATIVE_LITE) {
    window.WB_BL_NATIVE_LITE = {
      fetch: window.fetch,
      XHROpen: XMLHttpRequest.prototype.open,
      XHRSend: XMLHttpRequest.prototype.send,
      WebSocket: window.WebSocket
    };
  }

  /**
   * 全量黑名单同步
   */
  async function fullSyncBlacklist() {
    console.log('[WB-BL-Lite] Starting full sync...');
    const uidList = [];
    let page = 1, cursor = 0, retries = 0;

    while (true) {
      let url = `/ajax/setting/getFilteredUsers?page=${page}`;
      if (cursor) url += `&cursor=${cursor}`;

      try {
        const res = await window.WB_BL_NATIVE_LITE.fetch(url, { credentials: 'include' });

        if (res.status === 418) {
          console.warn(`[WB-BL-Lite] Got 418 on page ${page}, retry ${retries + 1}/${CONFIG.MAX_RETRIES}`);
          if (++retries > CONFIG.MAX_RETRIES) {
            console.error('[WB-BL-Lite] Too many 418 errors, stopping sync');
            break;
          }
          await sleep(5000); // 延长等待时间
          continue;
        }

        if (!res.ok) {
          console.error(`[WB-BL-Lite] HTTP ${res.status} on page ${page}`);
          break;
        }

        const data = await res.json();
        if (!data.card_group) {
          console.log(`[WB-BL-Lite] No more data on page ${page}`);
          break;
        }

        let pageCount = 0;
        data.card_group.forEach(item => {
          const match = item.scheme?.match(/uid=(\d{5,})/);
          if (match) {
            uidList.push(match[1]);
            pageCount++;
          }
        });

        console.log(`[WB-BL-Lite] Page ${page}: ${pageCount} UIDs`);

        if (!data.next_cursor) break;
        cursor = data.next_cursor;
        page++;
        retries = 0; // 重置重试计数
        await sleep(CONFIG.THROTTLE_MS);

      } catch (error) {
        console.error(`[WB-BL-Lite] Error on page ${page}:`, error);
        break;
      }
    }

    console.log(`[WB-BL-Lite] Full sync completed: ${uidList.length} UIDs`);
    _GM_setValue(CONFIG.STORAGE_KEY, uidList.join(','));
    return new Set(uidList);
  }

  /**
   * 增量黑名单同步
   */
  async function deltaSync(existingSet) {
    try {
      console.log('[WB-BL-Lite] Starting delta sync...');
      const res = await window.WB_BL_NATIVE_LITE.fetch('/ajax/setting/getFilteredUsers?page=1', { credentials: 'include' });

      if (res.status === 418) {
        console.warn('[WB-BL-Lite] Got 418 during delta sync, skipping');
        return existingSet;
      }

      if (!res.ok) {
        console.warn(`[WB-BL-Lite] Delta sync failed: HTTP ${res.status}`);
        return existingSet;
      }

      const data = await res.json();
      let added = 0;

      if (data.card_group) {
        data.card_group.forEach(item => {
          const match = item.scheme?.match(/uid=(\d{5,})/);
          if (match && !existingSet.has(match[1])) {
            existingSet.add(match[1]);
            added++;
          }
        });
      }

      if (added) {
        _GM_setValue(CONFIG.STORAGE_KEY, Array.from(existingSet).join(','));
        console.log(`[WB-BL-Lite] Delta sync: ${added} new UIDs added`);
      } else {
        console.log('[WB-BL-Lite] Delta sync: no new UIDs');
      }

      return existingSet;
    } catch (error) {
      console.error('[WB-BL-Lite] Delta sync error:', error);
      return existingSet;
    }
  }

  /**
   * 多页同步
   */
  async function syncPages(existingSet, pages = 5) {
    let page = 1, cursor = 0, retries = 0, added = 0;

    while (page <= pages) {
      let url = `/ajax/setting/getFilteredUsers?page=${page}`;
      if (cursor) url += `&cursor=${cursor}`;

      const res = await window.WB_BL_NATIVE_LITE.fetch(url, { credentials: 'include' });

      if (res.status === 418) {
        if (++retries > CONFIG.MAX_RETRIES) break;
        await sleep(3000);
        continue;
      }

      if (!res.ok) break;

      const data = await res.json();
      (data.card_group || []).forEach(item => {
        const match = item.scheme.match(/uid=(\d{5,})/);
        if (match && !existingSet.has(match[1])) {
          existingSet.add(match[1]);
          added++;
        }
      });

      if (!data.next_cursor) break;
      cursor = data.next_cursor;
      page++;
      await sleep(CONFIG.THROTTLE_MS);
    }

    if (added) _GM_setValue(CONFIG.STORAGE_KEY, Array.from(existingSet).join(','));
    return added;
  }

  // 首次运行检查和引导
  async function checkFirstRun() {
    const isFirstRun = !_GM_getValue(CONFIG.FIRST_RUN_KEY, false);

    if (isFirstRun) {
      const shouldSync = confirm(
        '欢迎使用 Weibo Blacklist Enhanced Lite！\n\n' +
        '首次使用建议进行全量黑名单同步以确保最佳效果。\n' +
        '这个过程可能需要几分钟时间。\n\n' +
        '点击"确定"开始同步，"取消"跳过同步'
      );

      _GM_setValue(CONFIG.FIRST_RUN_KEY, true);

      if (shouldSync) {
        try {
          const syncedSet = await fullSyncBlacklist();
          alert(`黑名单同步完成！共获取到 ${syncedSet.size} 个用户`);
          return syncedSet;
        } catch (error) {
          alert('同步过程中出现错误，将使用缓存数据');
          console.error('Blacklist sync error:', error);
        }
      }
    }

    return null;
  }

  // 初始化黑名单
  let blacklistSet = new Set();
  (async () => {
    try {
      // 首次运行检查
      const firstRunResult = await checkFirstRun();

      if (firstRunResult) {
        // 首次运行同步成功
        blacklistSet = firstRunResult;
      } else {
        // 使用缓存数据或进行增量同步
        const cachedData = _GM_getValue(CONFIG.STORAGE_KEY, '');
        if (cachedData) {
          blacklistSet = new Set(cachedData.split(',').filter(uid => uid));
          // 增量同步
          try {
            blacklistSet = await deltaSync(blacklistSet);
          } catch (error) {
            console.warn('Delta sync failed:', error);
          }
        } else {
          // 没有缓存，尝试获取第一页
          try {
            blacklistSet = await deltaSync(new Set());
          } catch (error) {
            console.error('Initial sync failed:', error);
            blacklistSet = new Set(); // 确保有一个空的但有效的Set
          }
        }
      }

      // 等待DOM准备好后注入CSS
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => injectCSS(generateCSSRules()));
      } else {
        injectCSS(generateCSSRules());
      }

      // 检查是否需要显示Star提醒
      checkStarReminder();

    } catch (error) {
      console.error('Blacklist initialization failed:', error);
      blacklistSet = new Set(); // 确保有一个有效的空集合
    }
  })();

  // === CSS注入（仅黑名单相关） ===
  function generateCSSRules() {
    const rules = Array.from(blacklistSet).map(uid => `
      .Feed_body_3R0rO:has([data-user-id="${uid}"]),
      .card-wrap:has([data-user-id="${uid}"]) {
        display: none !important;
      }
    `).join('\n');
    return rules;
  }

  function injectCSS(cssText) {
    const tryInject = () => {
      try {
        const head = document.head || document.getElementsByTagName('head')[0];
        if (head) {
          const style = document.createElement('style');
          style.textContent = cssText;
          style.setAttribute('data-source', 'wb-bl-lite');
          head.appendChild(style);
          console.log('[WB-BL-Lite] CSS rules injected successfully');
        } else {
          setTimeout(tryInject, 100);
        }
      } catch (error) {
        console.error('[WB-BL-Lite] CSS injection failed:', error);
        setTimeout(tryInject, 100);
      }
    };
    tryInject();
  }

  // === UID提取器 ===
  function extractUIDs(data) {
    const uids = new Set();
    (function traverse(obj) {
      if (!obj || typeof obj !== 'object') return;
      Object.entries(obj).forEach(([key, value]) => {
        if (/^(?:uid|user_id|userId|id|idstr)$/i.test(key) && typeof value === 'string' && /^\d{5,}$/.test(value)) {
          uids.add(value);
        }
        if (key === 'user' && value && value.id) uids.add(String(value.id));
        if (Array.isArray(value)) value.forEach(traverse);
        else if (value && typeof value === 'object') traverse(value);
      });
    })(data);
    return uids;
  }

  // === 数据过滤器 ===
  function filterData(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj
        .filter(item => ![...extractUIDs(item)].some(uid => blacklistSet.has(uid)))
        .map(filterData);
    }

    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = Array.isArray(value) ? filterData(value)
                   : (value && typeof value === 'object' ? filterData(value) : value);
    }
    return result;
  }

  // === Fetch 拦截 ===
  window.fetch = async function(input, init) {
    const url = typeof input === 'string' ? input : input.url;

    // 黑名单操作监听
    if (typeof url === 'string') {
      if (url.includes('/filterUser')) {
        const uid = JSON.parse(init?.body || '{}').uid;
        blacklistSet.add(String(uid));
        _GM_setValue(CONFIG.STORAGE_KEY, [...blacklistSet].join(','));
      }
      if (url.includes('/unfilterUser')) {
        const uid = JSON.parse(init?.body || '{}').uid;
        blacklistSet.delete(String(uid));
        _GM_setValue(CONFIG.STORAGE_KEY, [...blacklistSet].join(','));
      }
    }

    const res = await window.WB_BL_NATIVE_LITE.fetch(input, init);

    if (typeof url === 'string' && /\/(?:ajax\/(?:feed|statuses|comment|getCommentList|repost|like)|graphql\/|(?:mymblog|timeline|index))/.test(url)) {
      try {
        const data = await res.clone().json();
        return new Response(JSON.stringify(filterData(data)), res);
      } catch {}
    }

    return res;
  };

  // === XHR 拦截 ===
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    this._bl_url = url;
    return window.WB_BL_NATIVE_LITE.XHROpen.call(this, method, url, ...args);
  };

  XMLHttpRequest.prototype.send = function(body) {
    this.addEventListener('readystatechange', () => {
      if (this.readyState === 4 && this.status === 200 && this._bl_url) {
        if (/\/(?:ajax\/(?:feed|statuses)|(?:mymblog|timeline))/.test(this._bl_url)) {
          try {
            const data = JSON.parse(this.responseText);
            Object.defineProperty(this, 'responseText', {
              value: JSON.stringify(filterData(data))
            });
          } catch {}
        }
      }
    });
    return window.WB_BL_NATIVE_LITE.XHRSend.call(this, body);
  };

  // === WebSocket 拦截 ===
  window.WebSocket = class extends window.WB_BL_NATIVE_LITE.WebSocket {
    constructor(url, protocols) {
      super(url, protocols);
      this.addEventListener('message', evt => {
        try {
          const data = JSON.parse(evt.data);
          evt.data = JSON.stringify(filterData(data));
        } catch {}
      });
    }
  };

  // === DOM 监听器 ===
  (function() {
    const observer = new MutationObserver(mutations => {
      clearTimeout(window._wb_bl_lite_timer);
      window._wb_bl_lite_timer = setTimeout(() => {
        mutations.forEach(mutation => {
          Array.from(mutation.addedNodes).forEach(node => {
            if (node instanceof HTMLElement && node.matches('.Feed_body_3R0rO')) {
              if ([...node.querySelectorAll('[data-user-id]')]
                    .some(el => blacklistSet.has(el.getAttribute('data-user-id')))) {
                node.style.display = 'none';
              }
            }
          });
        });
      }, CONFIG.THROTTLE_MS);
    });

    const attachObserver = () => {
      const root = document.body || document.documentElement;
      if (root) {
        observer.observe(root, { childList: true, subtree: true });
        window.addEventListener('beforeunload', () => observer.disconnect());

        // SPA 路由监听
        const originalPushState = history.pushState;
        history.pushState = function(state, title, url) {
          originalPushState.call(this, state, title, url);
          observer.disconnect();
          observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
        };
      } else {
        setTimeout(attachObserver, 50);
      }
    };
    attachObserver();
  })();

  // === 菜单命令 ===
  _GM_registerMenuCommand('🔄 更新黑名单', async () => {
    const oldSize = blacklistSet.size;
    blacklistSet = await deltaSync(new Set(blacklistSet));
    _GM_setValue(CONFIG.STORAGE_KEY, [...blacklistSet].join(','));
    alert(`黑名单更新完成！新增 ${blacklistSet.size - oldSize} 个用户`);
  });

  _GM_registerMenuCommand('📄 同步前五页', async () => {
    const added = await syncPages(blacklistSet, 5);
    alert(`同步五页完成！新增 ${added} 个用户`);
  });

  _GM_registerMenuCommand('🔄 全量同步', async () => {
    const oldSize = blacklistSet.size;
    blacklistSet = await fullSyncBlacklist();
    alert(`全量同步完成！新增 ${blacklistSet.size - oldSize} 个用户（共 ${blacklistSet.size}）`);
  });

  _GM_registerMenuCommand('⭐ 给我们 Star', () => {
    openGitHub();
  });

  _GM_registerMenuCommand('🔕 不再提醒Star', () => {
    const shouldDisable = confirm(
      '确认要关闭 Star 提醒吗？\n\n' +
      '这将永久停止所有 Star 相关提醒'
    );

    if (shouldDisable) {
      _GM_setValue(CONFIG.STAR_REMINDER_DISABLED_KEY, true);
      alert('✅ Star 提醒已关闭');
    }
  });

  _GM_registerMenuCommand('ℹ️ 关于', () => {
    const usageCount = _GM_getValue(CONFIG.USAGE_COUNT_KEY, 0);
    const hasStarred = _GM_getValue(CONFIG.HAS_STARRED_KEY, false);
    const isDisabled = _GM_getValue(CONFIG.DISABLE_STAR_REMINDER_KEY, false);

    let starStatus = '';
    if (hasStarred) {
      starStatus = '✅ 已标记为给过Star';
    } else if (isDisabled) {
      starStatus = '🔕 Star提醒已禁用';
    } else {
      const nextReminder = CONFIG.STAR_REMINDER_COUNTS.find(count => count > usageCount) || '不再提醒';
      starStatus = `🔔 下次Star提醒: ${nextReminder === '不再提醒' ? nextReminder : nextReminder + ' 次使用时'}`;
    }

    alert(
      `Weibo Blacklist Enhanced Lite v${CONFIG.VERSION}\n` +
      `专注于黑名单功能的轻量版微博增强工具\n\n` +
      `当前缓存: ${blacklistSet.size} 个用户\n` +
      `使用次数: ${usageCount} 次\n` +
      `${starStatus}\n\n` +
      `作者: DanielZenFlow\n` +
      `许可: MIT License\n` +
      `GitHub: https://github.com/DanielZenFlow/Weibo-Blacklist-Enhanced-Lite\n\n` +
      `感谢使用！如果有帮助请给我们 Star ⭐`
    );
  });

  _GM_registerMenuCommand('🔢 查看使用统计', () => {
    const usageCount = _GM_getValue(CONFIG.USAGE_COUNT_KEY, 0);
    const lastReminder = _GM_getValue(CONFIG.LAST_STAR_REMINDER_KEY, 0);
    const hasStarred = _GM_getValue(CONFIG.HAS_STARRED_KEY, false);
    const isDisabled = _GM_getValue(CONFIG.DISABLE_STAR_REMINDER_KEY, false);
    const triggeredReminders = CONFIG.STAR_REMINDER_COUNTS.filter(count => count <= lastReminder);
    const nextReminder = CONFIG.STAR_REMINDER_COUNTS.find(count => count > usageCount);

    let status = '';
    if (hasStarred) {
      status = '✅ 已标记为给过Star，不再提醒';
    } else if (isDisabled) {
      status = '🔕 Star提醒已禁用';
    } else {
      status = `🔔 下次提醒: ${nextReminder ? nextReminder + ' 次使用时' : '不再提醒'}`;
    }

    alert(
      `📊 使用统计\n\n` +
      `总使用次数: ${usageCount}\n` +
      `已触发提醒: ${triggeredReminders.length}/${CONFIG.STAR_REMINDER_COUNTS.length} 次\n` +
      `${status}\n\n` +
      `💡 使用次数在每次成功过滤黑名单内容时增加\n` +
      `🎯 提醒触发点: ${CONFIG.STAR_REMINDER_COUNTS.join(', ')}`
    );
  });

  // 启动完成
  setTimeout(() => {
    const isDisabled = _GM_getValue(CONFIG.STAR_REMINDER_DISABLED_KEY, false);
    const starStatus = isDisabled ? '已关闭' : '已开启';

    console.log(`[WB-BL-Lite] v${CONFIG.VERSION} 启动完成，专注黑名单功能，已缓存 ${blacklistSet.size} UIDs`);
    console.log(`[WB-BL-Lite] Star提醒: ${starStatus}`);
    console.log(`[WB-BL-Lite] Author: DanielZenFlow | GitHub: https://github.com/DanielZenFlow/Weibo-Blacklist-Enhanced-Lite`);
  }, 1000);
})();