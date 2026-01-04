// ==UserScript==
// @name         Bangumi Fans Counter Everywhere (班固米谁加我好友人数统计)
// @namespace    https://bgm.tv/
// @version      0.3.1
// @description  个人主页显示关注者与好友数量；讨论帖显示关注者数量
// @match        https://bgm.tv/user/*
// @match        https://bangumi.tv/user/*
// @match        https://bgm.tv/subject/topic/*
// @match        https://bangumi.tv/subject/topic/*
// @match        https://bgm.tv/group/topic/*
// @match        https://bangumi.tv/group/topic/*
// @match        https://bangumi.tv/ep/*
// @match        https://bgm.tv/ep/*
// @match        https://bgm.tv/index/*/comments
// @match        https://bangumi.tv/index/*/comments
// @match        https://bgm.tv/blog/*
// @match        https://bangumi.tv/blog/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      bgm.tv
// @connect      bangumi.tv
// @connect      api.bgm.tv
// @run-at       document-end
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/539689/Bangumi%20Fans%20Counter%20Everywhere%20%28%E7%8F%AD%E5%9B%BA%E7%B1%B3%E8%B0%81%E5%8A%A0%E6%88%91%E5%A5%BD%E5%8F%8B%E4%BA%BA%E6%95%B0%E7%BB%9F%E8%AE%A1%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539689/Bangumi%20Fans%20Counter%20Everywhere%20%28%E7%8F%AD%E5%9B%BA%E7%B1%B3%E8%B0%81%E5%8A%A0%E6%88%91%E5%A5%BD%E5%8F%8B%E4%BA%BA%E6%95%B0%E7%BB%9F%E8%AE%A1%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /* ---------- 配置区 ---------- */
  const CONFIG = {
    // 网络请求与缓存设置
    MAX_CONCURRENT_REQUESTS: 4,
    CACHE_MAX_ITEMS: 1000,
    CACHE_TTL_HOURS: 12,
    // 性能优化设置
    DEBOUNCE_DELAY: 300,
    INTERSECTION_THRESHOLD: 0.1,
    LAZY_LOAD_MARGIN: '200px',

    // V 认证门槛（三档）
    BIG_V_THRESHOLD: 300,
    SUPER_V_THRESHOLD: 600,
    ULTRA_V_THRESHOLD: 1000,

    // 可自定义文本格式
    TEXT_FORMATS: {
      profile: ` 关注者: ${'${cnt}'}人`,
      topic: `关注者：${'${cnt}'}人`,
      friends: ` 好友: ${'${cnt}'}人`,
    },

    // 样式与类名
    BADGE_CLASS: "bgm-fans-count",
    V_BASE_CLASS: "bgm-v",
    BIG_V_CLASS: "bgm-big-v",
    SUPER_V_CLASS: "bgm-super-v",
    ULTRA_V_CLASS: "bgm-ultra-v",
    TOP_FANS_CLASS: "bgm-fans-top",
    TOP_FANS_COLOR: "red",
    LOADING_CLASS: "bgm-fans-loading", // 加载状态类
    LOCATE_BTN_CLASS: "bgm-locate-star-btn",
    HIGHLIGHT_CLASS: "bgm-locate-highlight",

    DEBUG: false,
  };

  /* ---------- 全局样式 ---------- */
  GM_addStyle(`
    /* 关注者数字徽章（胶囊形，统一字体与尺寸） */
    .${CONFIG.BADGE_CLASS} {
      margin-left:4px;
      padding:0 6px;
      height:18px;
      line-height:18px;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:4px;
      font-size:12px;
      font-weight:600;
      color:#222;
      background: linear-gradient(180deg, #ffffff 0%, #f6f7fb 100%);
      border:1px solid rgba(0,0,0,0.08);
      border-radius:10px;
      box-shadow: 0 1px 1px rgba(0,0,0,0.06);
      white-space:nowrap;
      vertical-align: middle;
      font-variant-numeric: tabular-nums;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif;
    }
    html[data-theme="dark"] .${CONFIG.BADGE_CLASS} {
      color:#f5f5f5;
      background: linear-gradient(180deg, #2a2a2e 0%, #1f2024 100%);
      border-color: rgba(255,255,255,0.12);
      box-shadow: 0 1px 1px rgba(0,0,0,0.4);
    }

    /* 定位按钮（胶囊形） */
    .${CONFIG.LOCATE_BTN_CLASS} {
      display:inline-flex;
      align-items:center;
      justify-content:center;
      height:24px;
      line-height:24px;
      padding:0 12px;
      margin-left:8px;
      border-radius:12px;
      font-size:12px;
      font-weight:700;
      color:#0b57d0;
      background: linear-gradient(180deg, #ffffff 0%, #f3f6ff 100%);
      border:1px solid rgba(11,87,208,0.25);
      box-shadow: 0 1px 1px rgba(0,0,0,0.06);
      cursor:pointer;
      user-select:none;
      transition: background .2s ease, transform .05s ease, box-shadow .2s ease;
    }
    .${CONFIG.LOCATE_BTN_CLASS}:hover { background: linear-gradient(180deg, #ffffff 0%, #eaf0ff 100%); }
    .${CONFIG.LOCATE_BTN_CLASS}:active { transform: translateY(1px); }
    html[data-theme="dark"] .${CONFIG.LOCATE_BTN_CLASS} {
      color:#8ab4ff;
      background: linear-gradient(180deg, #2a2a2e 0%, #1f2024 100%);
      border-color: rgba(138,180,255,0.35);
      box-shadow: 0 1px 1px rgba(0,0,0,0.4);
    }

    /* 定位高亮：脉冲外环 */
    .${CONFIG.HIGHLIGHT_CLASS} {
      position: relative;
      z-index: 1;
    }
    .${CONFIG.HIGHLIGHT_CLASS}::after {
      content: "";
      position: absolute;
      inset: -4px;
      border-radius: 12px;
      pointer-events: none;
      box-shadow: 0 0 0 0 rgba(33,150,243,0.55);
      animation: bgm-pulse-ring 1.2s ease-out 2;
    }
    @keyframes bgm-pulse-ring {
      0% { box-shadow: 0 0 0 0 rgba(33,150,243,0.55); }
      70% { box-shadow: 0 0 0 10px rgba(33,150,243,0); }
      100% { box-shadow: 0 0 0 0 rgba(33,150,243,0); }
    }

    /* 加载状态 */
    .${CONFIG.LOADING_CLASS} {
      margin-left:4px;
      font-size:12px;
      color:#999;
      white-space:nowrap;
      vertical-align: middle;
    }
    .${CONFIG.LOADING_CLASS}::after {
      content: "...";
      animation: loading-dots 1.5s infinite;
    }
    @keyframes loading-dots {
      0%, 20% { content: ""; }
      40% { content: "."; }
      60% { content: ".."; }
      80%, 100% { content: "..."; }
    }

    /* 帖内最高关注者数量高亮 */
    .${CONFIG.TOP_FANS_CLASS} { color:${CONFIG.TOP_FANS_COLOR} !important; }

    /* V 徽标统一基类 */
    .${CONFIG.V_BASE_CLASS} {
      display:inline-flex;
      align-items:center;
      justify-content:center;
      height:16px;
      min-width:16px;
      padding:0 5px;
      margin-left:4px;
      border-radius:8px;
      font-weight:800;
      font-size:10px;
      line-height:1;
      color:#fff !important;
      text-shadow: 0 1px 0 rgba(0,0,0,0.25);
      box-shadow: 0 1px 2px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25);
      border:1px solid transparent;
      vertical-align:middle;
      user-select:none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    /* 300+：橙金渐变 */
    .${CONFIG.BIG_V_CLASS} {
      /* 胶囊形 */
      background: linear-gradient(180deg, #ffcc66 0%, #ffa000 100%);
      border-color: #ffb74d;
      border-radius: 8px;
      padding: 0 6px;
      min-width: 20px;
    }
    html[data-theme="dark"] .${CONFIG.BIG_V_CLASS} {
      background: linear-gradient(180deg, #ffb74d 0%, #ff8f00 100%);
      border-color: #ffa726;
    }

    /* 600+：双配色霓虹六边形 */
    .${CONFIG.SUPER_V_CLASS} {
      position: relative;
      width: 20px;
      height: 18px;
      min-width: 20px;
      padding: 0;
      border-radius: 2px; /* 兜底 */
      /* 双配色渐变：熔岩橙 -> 玫红，比 300+ 更亮眼 */
      background: linear-gradient(135deg, #ff6a00 0%, #ff4d2e 45%, #ff2d8f 100%);
      border-color: transparent;
      /* 六边形外形 */
      clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%);
      box-shadow:
        0 1px 2px rgba(0,0,0,0.22),
        0 0 0 1px rgba(255, 77, 46, 0.35) inset,
        0 0 10px rgba(255,45,143,0.35);
    }
    /* 内发光与高光描边 */
    .${CONFIG.SUPER_V_CLASS}::after {
      content: '';
      position: absolute;
      inset: 2px;
      border-radius: 2px;
      background: linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 60%, rgba(255,255,255,0.0) 100%);
      clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%);
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.25);
      pointer-events: none;
    }
    /* 轻微流光效果 */
    .${CONFIG.SUPER_V_CLASS}::before {
      content: '';
      position: absolute;
      inset: -30% -40%;
      background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.55) 12%, transparent 24%);
      clip-path: polygon(25% 15%, 75% 15%, 100% 50%, 75% 85%, 25% 85%, 0 50%);
      transform: translateX(-120%);
      animation: bgm-super-shine 2.4s linear infinite;
      pointer-events: none;
    }
    @keyframes bgm-super-shine {
      0% { transform: translateX(-120%); }
      100% { transform: translateX(120%); }
    }
    html[data-theme="dark"] .${CONFIG.SUPER_V_CLASS} {
      background: linear-gradient(135deg, #ff7a1a 0%, #ff4d2e 45%, #ff2d8f 100%);
      box-shadow:
        0 1px 3px rgba(0,0,0,0.45),
        0 0 0 1px rgba(255, 77, 46, 0.45) inset,
        0 0 12px rgba(255,45,143,0.55);
    }

    /* 1000+：尊享金辉 */
    .${CONFIG.ULTRA_V_CLASS} {
      /* 盾牌容器（不直接裁剪本体，避免星芒被裁掉） */
      position: relative;
      padding: 0 8px;
      height: 20px;
      min-width: 24px;
      border-radius: 6px; /* 退化兜底 */
      background: transparent;
      border-color: transparent;
      box-shadow: none;
      z-index: 0;
    }
    /* 盾牌形状背景，置于底层 */
    .${CONFIG.ULTRA_V_CLASS}::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 6px;
      background: linear-gradient(180deg, #ffe082 0%, #ffd54f 45%, #ffc107 100%);
      border: 1px solid #ffd54f;
      box-shadow: 0 1px 2px rgba(0,0,0,0.2), 0 0 8px rgba(255,193,7,0.45), inset 0 1px 0 rgba(255,255,255,0.5);
      clip-path: polygon(12% 0%, 88% 0%, 100% 22%, 100% 66%, 50% 100%, 0% 66%, 0% 22%);
      z-index: -1;
    }
    .${CONFIG.ULTRA_V_CLASS}::before {
      /* 右上角的星芒点缀 */
      content: '★';
      position: absolute;
      right: -4px;
      top: -6px;
      font-size: 9px;
      color:rgb(255, 0, 0);
      text-shadow: 0 0 6px rgba(229, 255, 0, 0.8);
      transform: rotate(-10deg);
      z-index: 1;
      pointer-events: none;
    }
    html[data-theme="dark"] .${CONFIG.ULTRA_V_CLASS}::after {
      background: linear-gradient(180deg, #ffca28 0%, #ffb300 100%);
      border-color: #ffca28;
      box-shadow: 0 1px 3px rgba(0,0,0,0.35), 0 0 10px rgba(255,193,7,0.55), inset 0 1px 0 rgba(255,255,255,0.35);
    }

    /* 个人页：最近添加侧栏面板 */
    .bgm-fans-panel { /* 复用站点 menu_inner 外观 */
      /* site already sets border, radius, padding via .menu_inner */
    }
    .bgm-fans-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 12px;
      line-height: 1.6;
    }
    .bgm-fans-panel-title {
      font-weight: 800;
      font-size: 13px;
      color: #333;
      letter-spacing: .2px;
    }
    html[data-theme="dark"] .bgm-fans-panel-title { color: #e6e6e6; }
    .bgm-fans-panel-actions a {
      color: #0b57d0;
      text-decoration: none;
      font-weight: 600;
    }
    .bgm-fans-panel-actions a:hover { text-decoration: underline; }
    html[data-theme="dark"] .bgm-fans-panel-actions a { color: #8ab4ff; }

    .bgm-fans-panel-actions .bgm-fans-count,
    .bgm-fans-panel-actions .bgm-v { display: none !important; }

    .bgm-fans-list { list-style: none; margin: 6px 0 0; padding: 0; display: grid; gap: 2px; }
    .bgm-fans-list li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 12px;
      transition: background .15s ease;
    }
    .bgm-fans-left { display: inline-flex; align-items:center; gap:8px; min-width:0; }
    .bgm-fans-avatar { width: 22px; height:22px; border-radius: 50%; object-fit: cover; flex:0 0 22px; box-shadow: 0 0 0 1px rgba(0,0,0,0.06); background:#eee; }
    html[data-theme="dark"] .bgm-fans-avatar { background:#333; box-shadow: 0 0 0 1px rgba(255,255,255,0.18); }
    .bgm-fans-list li:hover { background: rgba(0,0,0,0.04); }
    html[data-theme="dark"] .bgm-fans-list li:hover { background: rgba(255,255,255,0.06); }
    .bgm-fans-list a { color: #1a1a1a; text-decoration: none; font-weight: 700; }
    .bgm-fans-list a:hover { text-decoration: underline; }
    html[data-theme="dark"] .bgm-fans-list a { color: #f0f0f0; }
    .bgm-fans-meta { margin-left: 12px; color: #6b7280; font-weight: 500; }
    html[data-theme="dark"] .bgm-fans-meta { color: #a1a1aa; }
  `);

  /* ---------- 工具函数 ---------- */
  const parseUsername = (s) => {
    if (!s) return null;
    const match = String(s).match(/^\/?user\/([^/?#]+)/);
    return match ? match[1] : (s.split("/").length >= 3 ? s.split("/")[2] : null);
  };
  const fansUrl = (u) => `${location.origin}/user/${u}/rev_friends`;
  const friendsUrl = (u) => `${location.origin}/user/${u}/friends`;

  // 仅对含有 memberUserList 的片段进行字符串计数
  const fastCount = (html) => {
    if (!html) return null;
    const start = html.indexOf('id="memberUserList"');
    if (start === -1) return null;
    const end = html.indexOf('</ul>', start);
    const chunk = end === -1 ? html.slice(start) : html.slice(start, end);
    const matches = chunk.match(/class=["']avatar["']/g);
    return matches ? matches.length : 0;
  };

  // 防抖函数
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // 节流函数
  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  };

  const createBadge = (cnt, pageType = 'profile') => {
    const span = document.createElement("span");
    span.className = CONFIG.BADGE_CLASS;
    const fmt = CONFIG.TEXT_FORMATS[pageType] || CONFIG.TEXT_FORMATS.profile;
    span.textContent = fmt.replace('${cnt}', cnt);
    return span;
  };

  const createLoadingBadge = () => {
    const span = document.createElement("span");
    span.className = CONFIG.LOADING_CLASS;
    span.textContent = "加载中";
    return span;
  };

  const createVBadge = (type = "big") => {
    const v = document.createElement("span");
    const specificClass = type === "ultra"
      ? CONFIG.ULTRA_V_CLASS
      : (type === "super" ? CONFIG.SUPER_V_CLASS : CONFIG.BIG_V_CLASS);
    v.className = `${CONFIG.V_BASE_CLASS} ${specificClass}`;
    v.textContent = "V";
    return v;
  };

  /* ---------- 缓存 + 并发队列 ---------- */
  const MAX_CACHE = CONFIG.CACHE_MAX_ITEMS;
  const TTL = CONFIG.CACHE_TTL_HOURS * 60 * 60 * 1e3;
  const MAX_PARALLEL = CONFIG.MAX_CONCURRENT_REQUESTS;
  const AVATAR_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; // 1x1 透明占位

  // 使用 LRU 缓存
  class LRUCache {
    constructor(maxSize) {
      this.maxSize = maxSize;
      this.cache = new Map();
    }

    get(key) {
      if (this.cache.has(key)) {
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
      }
      return null;
    }

    set(key, value) {
      if (this.cache.has(key)) {
        this.cache.delete(key);
      } else if (this.cache.size >= this.maxSize) {
        // 删除最久未使用的项
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      this.cache.set(key, value);
    }

    has(key) {
      return this.cache.has(key);
    }

    delete(key) {
      return this.cache.delete(key);
    }
  }

  const cache = new LRUCache(MAX_CACHE);
  const pending = new Map();
  const queue = [];
  let working = 0;

  // 好友缓存
  const friendsCache = new LRUCache(MAX_CACHE);
  const friendsPending = new Map();

  // 持久化缓存（跨会话）
  const persistKey = (u) => `bgm.fans.${u}`;
  const loadPersist = (u) => {
    try { return typeof GM_getValue === 'function' ? GM_getValue(persistKey(u), null) : null; } catch { return null; }
  };
  const savePersist = (u, obj) => {
    try { if (typeof GM_setValue === 'function') GM_setValue(persistKey(u), obj); } catch {}
  };

  const friendsPersistKey = (u) => `bgm.friends.${u}`;
  const loadFriendsPersist = (u) => {
    try { return typeof GM_getValue === 'function' ? GM_getValue(friendsPersistKey(u), null) : null; } catch { return null; }
  };
  const saveFriendsPersist = (u, obj) => {
    try { if (typeof GM_setValue === 'function') GM_setValue(friendsPersistKey(u), obj); } catch {}
  };

  // 昵称缓存（用于“最近关注者”）
  const displayNameCache = new LRUCache(MAX_CACHE);
  const displayNamePending = new Map();
  const DISPLAY_NAME_TTL = 24 * 60 * 60 * 1e3; // 24 小时
  const displayNamePersistKey = (u) => `bgm.displayName.${u}`;
  const loadDisplayNamePersist = (u) => {
    try { return typeof GM_getValue === 'function' ? GM_getValue(displayNamePersistKey(u), null) : null; } catch { return null; }
  };
  const saveDisplayNamePersist = (u, obj) => {
    try { if (typeof GM_setValue === 'function') GM_setValue(displayNamePersistKey(u), obj); } catch {}
  };

  function extractDisplayNameFromHTML(html) {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      // 个人页标题里的昵称
      const a = doc.querySelector('h1.nameSingle a[href^="/user/"]');
      if (a && a.textContent) return a.textContent.trim();
    } catch (e) {
      // ignore
    }
    const m = html.match(/<h1[^>]*class=["']nameSingle["'][^>]*>.*?<a[^>]*>\s*([^<]+?)\s*<\/a>/s);
    return m ? m[1].trim() : null;
  }

  function extractAvatarFromHTML(html) {
    try {
      const re = /(https?:)?\/\/[^'"\)\s]+\/pic\/user\/[^'"\)\s]+\.(?:jpg|jpeg|png|gif)(?:\?[^'"\)\s]*)?/i;
      const m = html.match(re);
      if (m) {
        const url = m[0];
        return preferHttps(url.startsWith('http') ? url : ('https:' + url));
      }
    } catch {}
    return null;
  }

  // API 获取昵称，失败时回退到页面解析
  const preferHttps = (url) => {
    if (!url) return null;
    if (url.startsWith('//')) return location.protocol + url;
    if (url.startsWith('http://')) return 'https://' + url.slice(7);
    if (url.startsWith('/')) return location.origin + url;
    return url;
  };

  function normalizeAvatarFromApi(data) {
    const av = (data && (data.avatar || data.avatars || (data.images && (data.images.avatar || data.images.avatars || data.images)))) || null;
    if (!av) return null;
    if (typeof av === 'string') return preferHttps(av);
    for (const key of ['medium', 'small', 'large', 'grid', 'm', 's']) {
      if (av && typeof av[key] === 'string') return preferHttps(av[key]);
    }
    return null;
  }

  function fetchUserInfo(u) {
    const viaAPI = () => new Promise((resolve) =>
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://api.bgm.tv/v0/users/${encodeURIComponent(u)}`,
        headers: { 'Accept': 'application/json' },
        timeout: 10000,
        onload: (r) => {
          try {
            if (r.status === 200 && r.responseText) {
              const data = JSON.parse(r.responseText);
              const nick = (data && typeof data.nickname === 'string' && data.nickname.trim()) ? data.nickname.trim() : null;
              const avatar = normalizeAvatarFromApi(data);
              resolve({ nick, avatar });
              return;
            }
          } catch {}
          resolve({ nick: null, avatar: null });
        },
        onerror: () => resolve({ nick: null, avatar: null }),
        ontimeout: () => resolve({ nick: null, avatar: null }),
      })
    );

    const viaHTML = () => new Promise((resolve) =>
      GM_xmlhttpRequest({
        method: 'GET',
        url: `${location.origin}/user/${u}`,
        timeout: 10000,
        onload: (r) => {
          let nick = null;
          let avatar = null;
          if (r.status === 200) {
            try {
              nick = extractDisplayNameFromHTML(r.responseText);
              avatar = extractAvatarFromHTML(r.responseText) || null;
            } catch {}
          }
          resolve({ nick, avatar });
        },
        onerror: () => resolve({ nick: null, avatar: null }),
        ontimeout: () => resolve({ nick: null, avatar: null }),
      })
    );

    return viaAPI().then((info) => {
      if (info.nick || info.avatar) return info;
      return viaHTML();
    }).then((info) => {
      const obj = { nick: info.nick || null, avatar: info.avatar || null, ts: Date.now() };
      displayNameCache.set(u, obj);
      if (obj.nick) saveDisplayNamePersist(u, obj);
      return obj;
    });
  }

  function getUserInfo(u) {
    if (displayNameCache.has(u)) {
      const o = displayNameCache.get(u);
      // 若缓存存在但没有头像，视为不完整，继续抓取；否则返回
      if (Date.now() - o.ts < DISPLAY_NAME_TTL && o.avatar) {
        return Promise.resolve({ nick: o.nick || null, avatar: o.avatar || null });
      }
      displayNameCache.delete(u);
    }
    const persisted = loadDisplayNamePersist(u);
    if (persisted && Date.now() - persisted.ts < DISPLAY_NAME_TTL && persisted.avatar) {
      displayNameCache.set(u, persisted);
      return Promise.resolve({ nick: persisted.nick || null, avatar: persisted.avatar || null });
    }
    if (displayNamePending.has(u)) return displayNamePending.get(u);
    const p = fetchUserInfo(u);
    displayNamePending.set(u, p);
    p.finally(() => displayNamePending.delete(u));
    return p;
  }

  function getDisplayName(u) {
    return getUserInfo(u).then((info) => info && info.nick ? info.nick : null);
  }

  const realFetch = (u) => new Promise((resolve) =>
    GM_xmlhttpRequest({
      method: "GET",
      url: fansUrl(u),
      timeout: 10000, // 添加超时
      onload: (r) => {
        let cnt = null;
        if (r.status === 200) {
          try {
            cnt = fastCount(r.responseText);
          } catch (e) {
            console.warn('解析用户关注者数据失败:', e);
          }
        }
        const result = { cnt: (typeof cnt === 'number' ? cnt : "未知"), ts: Date.now() };
        cache.set(u, result);
        if (typeof cnt === 'number') savePersist(u, result);
        resolve(cnt);
      },
      onerror: () => resolve(null),
      ontimeout: () => resolve(null),
    })
  );

  const dequeue = () => {
    while (working < MAX_PARALLEL && queue.length) {
      const { u, ok } = queue.shift();
      working++;
      realFetch(u).then((c) => {
        working--;
        ok(c);
        dequeue();
      });
    }
  };

  function getFansCount(u) {
    if (cache.has(u)) {
      const o = cache.get(u);
      if (Date.now() - o.ts < TTL) return Promise.resolve(o.cnt);
      cache.delete(u);
    }
    const persisted = loadPersist(u);
    if (persisted && Date.now() - persisted.ts < TTL) {
      cache.set(u, persisted);
      return Promise.resolve(persisted.cnt);
    }
    if (pending.has(u)) return pending.get(u);
    const p = new Promise((ok) => { queue.push({ u, ok }); dequeue(); });
    pending.set(u, p);
    p.finally(() => pending.delete(u));
    return p;
  }

  // 获取好友数量（仅用于个人主页，简单直取，无并发队列）
  function getFriendsCount(u) {
    if (friendsCache.has(u)) {
      const o = friendsCache.get(u);
      if (Date.now() - o.ts < TTL) return Promise.resolve(o.cnt);
      friendsCache.delete(u);
    }
    const persisted = loadFriendsPersist(u);
    if (persisted && Date.now() - persisted.ts < TTL) {
      friendsCache.set(u, persisted);
      return Promise.resolve(persisted.cnt);
    }
    if (friendsPending.has(u)) return friendsPending.get(u);

    const p = new Promise((resolve) =>
      GM_xmlhttpRequest({
        method: "GET",
        url: friendsUrl(u),
        timeout: 10000,
        onload: (r) => {
          let cnt = null;
          if (r.status === 200) {
            try {
              cnt = fastCount(r.responseText);
            } catch (e) {
              console.warn('解析用户好友数据失败:', e);
            }
          }
          const result = { cnt: (typeof cnt === 'number' ? cnt : "未知"), ts: Date.now() };
          friendsCache.set(u, result);
          if (typeof cnt === 'number') saveFriendsPersist(u, result);
          resolve(cnt);
        },
        onerror: () => resolve(null),
        ontimeout: () => resolve(null),
      })
    );
    friendsPending.set(u, p);
    p.finally(() => friendsPending.delete(u));
    return p;
  }

  /* ---------- 最近关注者（个人页侧栏） ---------- */
  const latestFollowersCache = new LRUCache(MAX_CACHE);
  const latestFollowersPending = new Map();
  const LATEST_FOLLOWERS_PREFIX = 'bgm.latestFans.v2.'; // bump to avoid old-order cache
  const latestFollowersPersistKey = (u) => `${LATEST_FOLLOWERS_PREFIX}${u}`;
  const loadLatestFollowersPersist = (u) => {
    try { return typeof GM_getValue === 'function' ? GM_getValue(latestFollowersPersistKey(u), null) : null; } catch { return null; }
  };
  const saveLatestFollowersPersist = (u, obj) => {
    try { if (typeof GM_setValue === 'function') GM_setValue(latestFollowersPersistKey(u), obj); } catch {}
  };

  function parseRecentFollowersFromHTML(html, limit = 5) {
    // We need the newest 5 users, which appear at the end of the list on rev_friends.
    const result = [];
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const anchors = Array.from(doc.querySelectorAll('#memberUserList a[href^="/user/"]'));
      const seen = new Set();
      // iterate from the end to get the latest first
      for (let i = anchors.length - 1; i >= 0 && result.length < limit; i--) {
        const a = anchors[i];
        const name = parseUsername(a.getAttribute('href'));
        if (name && !seen.has(name)) {
          seen.add(name);
          result.push(name);
        }
      }
    } catch (e) {
      // ignore and try regex fallback
    }
    if (result.length < limit) {
      const all = [];
      const re = /href=["']\/?user\/([^"'\/?#]+)["']/g;
      let m;
      while ((m = re.exec(html)) !== null) all.push(m[1]);
      const seen = new Set(result);
      for (let i = all.length - 1; i >= 0 && result.length < limit; i--) {
        const name = all[i];
        if (name && !seen.has(name)) {
          seen.add(name);
          result.push(name);
        }
      }
    }
    return result.slice(0, limit);
  }

  function getRecentFollowers(u, limit = 5) {
    const key = `v2|${u}|${limit}`;
    if (latestFollowersCache.has(key)) {
      const o = latestFollowersCache.get(key);
      if (Date.now() - o.ts < TTL) return Promise.resolve(o.list);
      latestFollowersCache.delete(key);
    }
    const persisted = loadLatestFollowersPersist(key);
    if (persisted && Date.now() - persisted.ts < TTL) {
      latestFollowersCache.set(key, persisted);
      return Promise.resolve(persisted.list);
    }
    if (latestFollowersPending.has(key)) return latestFollowersPending.get(key);

    const p = new Promise((resolve) =>
      GM_xmlhttpRequest({
        method: 'GET',
        url: fansUrl(u),
        timeout: 10000,
        onload: (r) => {
          let list = [];
          if (r.status === 200) {
            try {
              list = parseRecentFollowersFromHTML(r.responseText, limit);
            } catch (e) {
              console.warn('解析最近添加失败:', e);
            }
          }
          const obj = { list, ts: Date.now() };
          latestFollowersCache.set(key, obj);
          // 仅在有列表时持久化
          if (list && list.length) saveLatestFollowersPersist(key, obj);
          resolve(list);
        },
        onerror: () => resolve([]),
        ontimeout: () => resolve([]),
      })
    );
    latestFollowersPending.set(key, p);
    p.finally(() => latestFollowersPending.delete(key));
    return p;
  }

  function insertRecentFollowersPanel(u) {
    if (/\/rev_friends(\b|\/)/.test(location.pathname)) return;
    const columnB = document.querySelector('#columnB') || document.querySelector('.columnB') || document.body;
    const lastMenuInner = document.querySelector('#columnB .menu_inner:last-of-type') || document.querySelector('.menu_inner:last-of-type');

    let panel = document.getElementById('bgm-recent-followers');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'bgm-recent-followers';
      panel.className = 'menu_inner bgm-fans-panel';
      const last = lastMenuInner;
      if (last) last.insertAdjacentElement('afterend', panel); else columnB.appendChild(panel);
    } else {
      panel.innerHTML = '';
    }

    const header = document.createElement('div');
    header.className = 'bgm-fans-panel-header';
    const title = document.createElement('span');
    title.className = 'bgm-fans-panel-title';
    // 标题：最近关注者
    try { title.textContent = '\u6700\u8FD1\u7C89\u4E1D'; } catch {}
    title.textContent = '最近关注者';
    const actions = document.createElement('span');
    actions.className = 'bgm-fans-panel-actions';
    // Fix potential mojibake: ensure title reads "最近关注者"
    title.textContent = '\u6700\u8FD1\u7C89\u4E1D';
    // 占位，避免旧代码引用未定义
    let cFans = null, cFriends = null;
    // 再次设置标题，避免编码问题导致的异常字符
    try { title.textContent = '\u6700\u8FD1\u7C89\u4E1D'; } catch {}

    // 插入统计徽章与 V 级别
    if (cFans != null) actions.appendChild(createBadge(cFans, 'profile'));
    if (cFriends != null) actions.appendChild(createBadge(cFriends, 'friends'));
    if (typeof cFans === 'number') {
      if (cFans >= CONFIG.ULTRA_V_THRESHOLD) actions.appendChild(createVBadge('ultra'));
      else if (cFans >= CONFIG.SUPER_V_THRESHOLD) actions.appendChild(createVBadge('super'));
      else if (cFans >= CONFIG.BIG_V_THRESHOLD) actions.appendChild(createVBadge('big'));
    }

    const viewAll = document.createElement('a');
    viewAll.href = fansUrl(u);
    viewAll.target = '_blank';
    viewAll.rel = 'noopener';
    viewAll.textContent = '查看全部';
    actions.appendChild(viewAll);

    header.appendChild(title);
    header.appendChild(actions);
    // Force title text to 最新: 最近关注者
    try { title.textContent = '\u6700\u8FD1\u5173\u6CE8\u8005'; } catch {}

    const list = document.createElement('ul');
    list.className = 'bgm-fans-list';
    const loading = document.createElement('li');
    loading.textContent = '加载中…';
    list.appendChild(loading);

    panel.appendChild(header);
    panel.appendChild(list);

    getRecentFollowers(u, 5).then((arr) => {
      list.innerHTML = '';
      if (!arr || arr.length === 0) {
        const li = document.createElement('li');
        li.textContent = '暂无数据';
        list.appendChild(li);
        return;
      }
      arr.forEach((name) => {
        const li = document.createElement('li');

        // 左侧：头像 + 名称
        const left = document.createElement('span');
        left.className = 'bgm-fans-left';
        const img = document.createElement('img');
        img.className = 'bgm-fans-avatar';
        img.alt = name;
        // 透明占位，避免破图图标与布局跳动
        img.src = AVATAR_PLACEHOLDER;
        img.decoding = 'async';
        img.loading = 'lazy';
        img.onerror = () => { img.src = AVATAR_PLACEHOLDER; };
        left.appendChild(img);

        const a = document.createElement('a');
        a.href = `${location.origin}/user/${name}`;
        a.textContent = name;
        left.appendChild(a);
        li.appendChild(left);

        // 异步抓昵称与头像
        getUserInfo(name).then((info) => {
          if (info) {
            if (info.nick && a.textContent === name) a.textContent = info.nick;
            if (info.avatar) img.src = info.avatar;
          }
        });

        const meta = document.createElement('span');
        meta.className = 'bgm-fans-meta';
        meta.textContent = '  关注者: … · 好友: …';
        li.appendChild(meta);
        list.appendChild(li);

        Promise.all([getFansCount(name), getFriendsCount(name)]).then(([cFans, cFriends]) => {
          const fmt = (c) => (typeof c === 'number' ? c : (c == null ? '未知' : c));
          meta.textContent = `  关注者: ${fmt(cFans)} · 好友: ${fmt(cFriends)}`;
        });
      });
    });
  }

  /* ---------- 最高关注者数量跟踪 ---------- */
  let topicMax = -1;
  let maxBadges = [];
  function updateMax(badge, cnt) {
    if (cnt == null || cnt === "未知") return;
    if (cnt > topicMax) {
      maxBadges.forEach((b) => b.classList.remove(CONFIG.TOP_FANS_CLASS));
      topicMax = cnt;
      maxBadges = [badge];
      badge.classList.add(CONFIG.TOP_FANS_CLASS);
    } else if (cnt === topicMax) {
      maxBadges.push(badge);
      badge.classList.add(CONFIG.TOP_FANS_CLASS);
    }
  }

  /* ---------- 非用户主页统计 开关（默认开） ---------- */
  const NONUSER_TOGGLE_KEY = 'bgm.fans.enableNonUserPages';
  let enableNonUserPages = true;
  let toggleButtonEl = null;

  const loadNonUserToggle = () => {
    try {
      return typeof GM_getValue === 'function' ? GM_getValue(NONUSER_TOGGLE_KEY, true) : true;
    } catch {
      return true;
    }
  };
  const saveNonUserToggle = (val) => {
    try { if (typeof GM_setValue === 'function') GM_setValue(NONUSER_TOGGLE_KEY, val); } catch {}
  };
  enableNonUserPages = loadNonUserToggle();

  const updateToggleButtonLabel = () => {
    if (!toggleButtonEl) return;
    toggleButtonEl.textContent = `非主页统计: ${enableNonUserPages ? '开' : '关'}`;
  };

  const cleanupTopicDOM = (root = document) => {
    // 移除已插入的徽章/加载态，移除高亮
    const selector = [
      `.${CONFIG.BADGE_CLASS}`,
      `.${CONFIG.V_BASE_CLASS}`,
      `.${CONFIG.BIG_V_CLASS}`,
      `.${CONFIG.SUPER_V_CLASS}`,
      `.${CONFIG.ULTRA_V_CLASS}`,
      `.${CONFIG.LOADING_CLASS}`,
      `.${CONFIG.HIGHLIGHT_CLASS}`
    ].join(',');
    root.querySelectorAll(selector).forEach((el) => {
      if (el.classList && el.classList.contains(CONFIG.HIGHLIGHT_CLASS)) {
        el.classList.remove(CONFIG.HIGHLIGHT_CLASS);
      } else {
        el.remove();
      }
    });
    // 重置与停止观察
    topicMax = -1;
    maxBadges = [];
    pendingUpdates.clear();
    clearUpdateHandle();
    if (mutationObserver) mutationObserver.disconnect();
    if (intersectionObserver) { intersectionObserver.disconnect(); intersectionObserver = null; }
  };

  /* ---------- 在页头插入“定位bangumi大明星”按钮 ---------- */
  function insertLocateButton() {
    const header = document.querySelector('h2.reply_title span.reply_author');
    if (!header) return;
    // 防止重复插入
    if (header.nextElementSibling && header.nextElementSibling.classList && header.nextElementSibling.classList.contains(CONFIG.LOCATE_BTN_CLASS)) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = CONFIG.LOCATE_BTN_CLASS;
    btn.textContent = '定位bangumi大明星';

    btn.addEventListener('click', () => {
      // 若还未计算出最大值，提醒用户稍等
      if (topicMax < 0 || maxBadges.length === 0) {
        // 触发一次增强，尽快补全数据
        enhanceTopic();
        observeTopic();
        btn.disabled = true;
        setTimeout(() => { btn.disabled = false; }, 600);
        return;
      }

      // 取消之前的高亮
      document.querySelectorAll('.' + CONFIG.HIGHLIGHT_CLASS).forEach(el => el.classList.remove(CONFIG.HIGHLIGHT_CLASS));

      // 高亮所有并滚动到第一个
      const first = maxBadges[0];
      maxBadges.forEach(b => b.classList.add(CONFIG.HIGHLIGHT_CLASS));
      if (first && typeof first.scrollIntoView === 'function') {
        first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    header.after(btn);

    // 在定位按钮之后插入“非用户页统计”开关按钮
    if (!document.getElementById('bgm-toggle-nonuser')) {
      const tbtn = document.createElement('button');
      tbtn.type = 'button';
      tbtn.id = 'bgm-toggle-nonuser';
      tbtn.className = CONFIG.LOCATE_BTN_CLASS;
      tbtn.title = '切换是否在非用户页显示与计算关注数（个人主页始终显示）';
      toggleButtonEl = tbtn;
      updateToggleButtonLabel();
      tbtn.addEventListener('click', () => {
        enableNonUserPages = !enableNonUserPages;
        saveNonUserToggle(enableNonUserPages);
        updateToggleButtonLabel();
        if (enableNonUserPages) {
          topicMax = -1;
          maxBadges = [];
          enhanceTopic();
          observeTopic();
        } else {
          cleanupTopicDOM(document);
        }
      });
      btn.after(tbtn);
    }
  }

  /* ---------- 批量DOM更新 ---------- */
  const pendingUpdates = new Map();
  let updateTimeout = null;
  const updateUseIdle = typeof requestIdleCallback === 'function';
  const clearUpdateHandle = () => {
    if (!updateTimeout) return;
    if (updateUseIdle && typeof cancelIdleCallback === 'function') {
      cancelIdleCallback(updateTimeout);
    } else {
      clearTimeout(updateTimeout);
    }
    updateTimeout = null;
  };

  const batchUpdateDOM = () => {
    clearUpdateHandle();
    const run = () => {
      const updates = Array.from(pendingUpdates.entries());
      updates.forEach(([element, data]) => {
        updateElementWithFansData(element, data.count, data.pageType);
      });
      pendingUpdates.clear();
      updateTimeout = null;
    };
    updateTimeout = updateUseIdle
      ? requestIdleCallback(run, { timeout: 200 })
      : setTimeout(run, 50);
  };

  const updateElementWithFansData = (element, count, pageType) => {
    // 清理旧的徽章
    let next = element.nextElementSibling;
    while (next && (
      next.classList.contains(CONFIG.BADGE_CLASS) ||
      next.classList.contains(CONFIG.V_BASE_CLASS) ||
      next.classList.contains(CONFIG.BIG_V_CLASS) ||
      next.classList.contains(CONFIG.SUPER_V_CLASS) ||
      next.classList.contains(CONFIG.ULTRA_V_CLASS) ||
      next.classList.contains(CONFIG.LOADING_CLASS)
    )) {
      const toRemove = next;
      next = next.nextElementSibling;
      toRemove.remove();
    }

    if (count == null) return;

    // 一次性插入，避免多次重排并保证顺序：徽章在前，V 在后
    const nodesToInsert = [];
    const fanBadge = createBadge(count, pageType);
    nodesToInsert.push(fanBadge);
    if (count >= CONFIG.ULTRA_V_THRESHOLD) {
      nodesToInsert.push(createVBadge('ultra'));
    } else if (count >= CONFIG.SUPER_V_THRESHOLD) {
      nodesToInsert.push(createVBadge('super'));
    } else if (count >= CONFIG.BIG_V_THRESHOLD) {
      nodesToInsert.push(createVBadge('big'));
    }
    element.after(...nodesToInsert);

    if (pageType === 'topic') {
      updateMax(fanBadge, count);
    }
  };

  /* ---------- 可见性检测 ---------- */
  let intersectionObserver = null;

  const createIntersectionObserver = () => {
    if (intersectionObserver) return intersectionObserver;

    intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          if (element.dataset.needsProcessing === "true") {
            processUserLink(element);
            element.dataset.needsProcessing = "false";
            intersectionObserver.unobserve(element);
          }
        }
      });
    }, {
      rootMargin: CONFIG.LAZY_LOAD_MARGIN,
      threshold: CONFIG.INTERSECTION_THRESHOLD
    });

    return intersectionObserver;
  };

  let processUserLink = (element) => {
    if (element.dataset.fetched) return;
    element.dataset.fetched = "1";

    const u = parseUsername(element.getAttribute("href"));
    if (!u) return;

    if (!enableNonUserPages) return;

    // 添加加载状态
    const loadingBadge = createLoadingBadge();
    element.after(loadingBadge);

    getFansCount(u).then((c) => {
      // 移除加载状态
      if (loadingBadge.parentNode) {
        loadingBadge.remove();
      }

      if (c != null) {
        pendingUpdates.set(element, { count: c, pageType: 'topic' });
        batchUpdateDOM();
      }
    });
  };

  /* ---------- 个人主页 ---------- */
  function enhanceProfile() {
    const u = parseUsername(location.pathname);
    if (!u) return;
    const anchor = document.querySelector("h1.nameSingle small.grey");
    if (!anchor) return;

    // 无论统计是否可得，侧栏面板都应出现
    try { insertRecentFollowersPanel(u); } catch(e) { /* noop */ }

    Promise.all([getFansCount(u), getFriendsCount(u)]).then(([cFans, cFriends]) => {
      if (cFans == null && cFriends == null) return;

      // 清理旧徽章
      while (anchor.nextElementSibling &&
            (anchor.nextElementSibling.classList.contains(CONFIG.BADGE_CLASS) ||
             anchor.nextElementSibling.classList.contains(CONFIG.V_BASE_CLASS) ||
             anchor.nextElementSibling.classList.contains(CONFIG.BIG_V_CLASS) ||
             anchor.nextElementSibling.classList.contains(CONFIG.SUPER_V_CLASS) ||
             anchor.nextElementSibling.classList.contains(CONFIG.ULTRA_V_CLASS))) {
        anchor.nextElementSibling.remove();
      }

      const nodesToInsert = [];
      // 关注者
      if (cFans != null) {
        const fanBadge = createBadge(cFans, 'profile');
        nodesToInsert.push(fanBadge);
      }
      // 好友（紧跟在关注者之后）
      if (cFriends != null) {
        const friendBadge = createBadge(cFriends, 'friends');
        nodesToInsert.push(friendBadge);
      }
      // V 等级基于关注者数量
      if (typeof cFans === 'number') {
        if (cFans >= CONFIG.ULTRA_V_THRESHOLD) {
          nodesToInsert.push(createVBadge('ultra'));
        } else if (cFans >= CONFIG.SUPER_V_THRESHOLD) {
          nodesToInsert.push(createVBadge('super'));
        } else if (cFans >= CONFIG.BIG_V_THRESHOLD) {
          nodesToInsert.push(createVBadge('big'));
        }
      }
      if (nodesToInsert.length) anchor.after(...nodesToInsert);

      // 侧栏面板已在上方插入，这里不重复
    });
  }

  /* ---------- 讨论 / 小组帖 / 章节 ---------- */
  function enhanceTopic(root = document) {
    // 非用户页统计被关闭时，仅插入按钮，不进行统计
    if (!enableNonUserPages) {
      insertLocateButton();
      return;
    }
    const allUserLinks = root.querySelectorAll('a[href^="/user/"]');
    const links = Array.from(allUserLinks).filter((a) =>
      !a.closest('.likes_grid, .tooltip, .tags, .reply_title, #navMenuNeue,.action,.tip_i') &&
      !a.classList.contains('avatar') &&
      !a.classList.contains('tip_i') &&
      !(a.getAttribute('style') || '').includes('background') &&
      !a.dataset.fetched
    );

    if (links.length === 0) {
      insertLocateButton();
      return;
    }

    const observer = createIntersectionObserver();

    // 统一交给 IntersectionObserver
    links.forEach((link) => {
      link.dataset.needsProcessing = "true";
      observer.observe(link);
    });

    // 每次增强时确保按钮存在
    insertLocateButton();
  }

  /* ---------- DOM监听 ---------- */
  let mutationObserver = null;
  const debouncedEnhanceTopic = debounce((root) => {
    enhanceTopic(root);
  }, CONFIG.DEBOUNCE_DELAY);

  function observeTopic() {
    if (!enableNonUserPages) return;
    const node = document.querySelector("#comment_list") || document.querySelector("#entry_content");
    if (!node) return;

    if (mutationObserver) {
      mutationObserver.disconnect();
    }

    mutationObserver = new MutationObserver(throttle((mutations) => {
      let hasNewNodes = false;

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              hasNewNodes = true;
            }
          });
        }
      });

      if (hasNewNodes) {
        debouncedEnhanceTopic(node);
      }
    }, 100)); // 100ms 节流

    mutationObserver.observe(node, {
      childList: true,
      subtree: true
    });
  }

  /* ---------- 页面卸载清理 ---------- */
  window.addEventListener('beforeunload', () => {
    if (mutationObserver) mutationObserver.disconnect();
    if (intersectionObserver) intersectionObserver.disconnect();
    if (updateTimeout) clearTimeout(updateTimeout);
  });

  /* ---------- 启动 ---------- */
  const p = location.pathname;
  if (/^\/user\/[^/]+\/?$/.test(p)) {
    enhanceProfile();
  } else if (/\/(subject|group)\/topic\//.test(p) || /^\/ep\//.test(p) || /^\/index\/.+\/comments$/.test(p) || /^\/blog\//.test(p)) {
    // 延迟初始化，避免阻塞页面加载
    setTimeout(() => {
      enhanceTopic();
      if (enableNonUserPages) observeTopic();
    }, 100);
  }

  // 性能监控（调试用）
  if (CONFIG.DEBUG) {
    let processedCount = 0;
    const originalProcessUserLink = processUserLink;
    processUserLink = function(element) {
      processedCount++;
      console.log(`已处理用户链接数量: ${processedCount}`);
      return originalProcessUserLink.call(this, element);
    };
  }
})();
