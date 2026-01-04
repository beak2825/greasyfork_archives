// ==UserScript==
// @name         BiliCDNGuardian
// @version      1.0.0
// @description  屏蔽 B 站 PCDN 与地区 CDN，优先官方 CDN 加载视频及直播
// @icon         https://static.hdslb.com/images/favicon.ico
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/blackboard/live/live-activity-player.html*
// @match        https://live.bilibili.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @namespace    https://github.com/YourRepo/BiliCDNGuardian
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534679/BiliCDNGuardian.user.js
// @updateURL https://update.greasyfork.org/scripts/534679/BiliCDNGuardian.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // --- 默认配置 ---
  const DEFAULTS = {
    blockPlayError: false,
    blockBCacheCDN: false,
    blockLivePCDN: false,
    keepOneUrl: true
  };

  const MENU_TITLES = {
    blockPlayError: '屏蔽“播放遇到问题？”提示',
    blockBCacheCDN: '屏蔽视频地区 CDN',
    blockLivePCDN: '屏蔽直播 PCDN',
    keepOneUrl: '保留至少一条播放链接'
  };

  // --- 配置管理 ---
  class ConfigManager {
    constructor(defaults) {
      this.cache = {};
      this.defaults = defaults;
      this.registerMenu();
    }
    get(key) {
      if (!(key in this.cache)) {
        this.cache[key] = GM_getValue(key, this.defaults[key]);
      }
      return this.cache[key];
    }
    registerMenu() {
      // 清除已有菜单，实际可能需要缓存 id 列表然后注销
      Object.keys(this.defaults).forEach(key => {
        GM_registerMenuCommand(
          `${this.get(key) ? '✅' : '❌'} ${MENU_TITLES[key]}`,
          () => {
            const nv = !this.get(key);
            GM_setValue(key, nv);
            this.cache[key] = nv;
            this.registerMenu();
          }
        );
      });
    }
  }
  const config = new ConfigManager(DEFAULTS);

  // --- 公共正则 & 过滤函数 ---
  const REGEX = {
    pcdn: /mcdn\.bilivideo\.(com|cn)/i,
    bcache: /cn-.*\.bilivideo\.(com|cn)/i
  };

  function filterUrls(urls, blockPcdn, blockBcache, keepOne) {
    let list = urls.slice();
    if (blockPcdn) list = list.filter(u => !REGEX.pcdn.test(u));
    if (blockBcache) {
      const filtered = list.filter(u => !REGEX.bcache.test(u));
      list = filtered.length ? filtered : (keepOne ? list : []);
    }
    return list;
  }

  // --- XHR 拦截器助手 ---
  function hookXHR(patterns, sanitizer) {
    const XHR = unsafeWindow.XMLHttpRequest;
    const origOpen = XHR.prototype.open;
    XHR.prototype.open = function(method, url) {
      if (patterns.some(rx => rx.test(url))) {
        const desc = Object.getOwnPropertyDescriptor(XHR.prototype, 'responseText');
        Object.defineProperty(this, 'responseText', {
          get() {
            const raw = desc.get.call(this);
            try {
              const json = JSON.parse(raw);
              sanitizer(json);
              return JSON.stringify(json);
            } catch { return raw; }
          }
        });
      }
      return origOpen.apply(this, arguments);
    };
  }

  // --- 视频 & 番剧 处理 ---
  function initVideo() {
    const blockBCache = config.get('blockBCacheCDN');
    const keepOne = config.get('keepOneUrl');

    function sanitize(info) {
      const list = [];
      if (info.data?.dash) {
        list.push(...info.data.dash.video, ...(info.data.dash.audio || []));
      }
      if (info.data?.durl) {
        list.push(...info.data.durl);
      }
      // 番剧接口
      if (info.result?.video_info?.dash) {
        list.push(...info.result.video_info.dash.video, ...(info.result.video_info.dash.audio || []));
      }
      if (info.result?.video_info?.durl) {
        list.push(...info.result.video_info.durl);
      }
      list.forEach(media => {
        const urls = [media.baseUrl || media.url, ...(media.backupUrl || media.backup_url || [])];
        const kept = filterUrls(urls, true, blockBCache, keepOne);
        media.baseUrl = kept[0] || urls[0];
        media.backupUrl = kept.slice(1);
      });
    }

    // 初始 __playinfo__
    if (unsafeWindow.__playinfo__) {
      sanitize(unsafeWindow.__playinfo__);
    }
    Object.defineProperty(unsafeWindow, '__playinfo__', {
      get() { return this._pi; },
      set(val) { sanitize(val); this._pi = val; },
      configurable: true
    });

    // 拦截请求
    hookXHR([/player\/wbi\/playurl/, /player\/web\/v2\/playurl/], sanitize);
  }

  // --- 直播 PCDN 屏蔽 ---
  function initLive() {
    if (!config.get('blockLivePCDN')) return;

    // 重写 fetch
    const origFetch = unsafeWindow.fetch.bind(unsafeWindow);
    unsafeWindow.fetch = function(resource, init) {
      const url = typeof resource === 'string' ? resource : resource.url;
      if (/getRoomPlayInfo/.test(url)) {
        return origFetch(resource, init).then(resp => {
          return resp.json().then(json => {
            json.data.playurl_info.stream.forEach(s => {
              s.format.forEach(f => {
                f.codec.forEach(c => {
                  c.url_info = filterUrls(
                    c.url_info.map(u => u.host), true, false, true
                  ).map(h => Object.assign({}, c.url_info.find(u => u.host === h), { host: h }));
                });
              });
            });
            const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
            return new Response(blob, { status: resp.status, statusText: resp.statusText });
          });
        });
      }
      return origFetch(resource, init);
    };

    // 同理可扩展 XHR
  }

  // --- 屏蔽“播放遇到问题” ---
  if (config.get('blockPlayError')) {
    const origDefine = unsafeWindow.Object.defineProperty;
    unsafeWindow.Object.defineProperty = function(target, prop, desc) {
      if (prop === 'videoHasBuffered') {
        return origDefine(target, 'showLoadTimeoutFeedback', { get: () => () => {}, set: () => {} });
      }
      return origDefine(target, prop, desc);
    };
  }

  // --- 路由执行 ---
  const href = location.href;
  if (/\/video\//.test(href) || /\/bangumi\/play\//.test(href) || /\/list\//.test(href)) {
    initVideo();
  } else if (/live-activity-player|live\.bilibili/.test(href)) {
    initLive();
  }

})();
