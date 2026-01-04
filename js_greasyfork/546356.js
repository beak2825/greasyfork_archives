// ==UserScript==
// @name         Pornhub: количество видео рядом с аватаркой
// @namespace    https://tampermonkey.net/
// @version      0.4.1
// @description  Показывает общее количество видео пользователя на любой странице его профиля (включая /videos, /photos, /about) — бэйдж рядом с аватаркой.
// @author       you
// @match        https://www.pornhub.com/model/*
// @match        https://www.pornhub.com/pornstar/*
// @match        https://www.pornhub.com/users/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546356/Pornhub%3A%20%D0%BA%D0%BE%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE%20%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE%20%D1%80%D1%8F%D0%B4%D0%BE%D0%BC%20%D1%81%20%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80%D0%BA%D0%BE%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/546356/Pornhub%3A%20%D0%BA%D0%BE%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE%20%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE%20%D1%80%D1%8F%D0%B4%D0%BE%D0%BC%20%D1%81%20%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80%D0%BA%D0%BE%D0%B9.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var BADGE_CLASS = 'tmPhVideoCountBadge';
  var injectedForUrl = null;
  var inflight = false;

  function ensureStyle() {
    if (document.getElementById('tmPhBadgeStyle')) return;
    var css =
      '.' + BADGE_CLASS + ' {' +
      'position:absolute;' +
      'right:-6px;' +
      'bottom:-6px;' +
      'background:#f9a300;' +
      'color:#111111;' +
      'border-radius:14px;' +
      'padding:2px 6px;' +
      'font-weight:700;' +
      'font-size:12px;' +
      'line-height:1.2;' +
      'font-family:Arial;' +
      'z-index:9999;' +
      'pointer-events:none;' +
      'white-space:nowrap;' +
      '}';
    var style = document.createElement('style');
    style.id = 'tmPhBadgeStyle';
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    head.appendChild(style);
  }

  function getProfileRootUrl(href) {
    try {
      var u = new URL(href || location.href);
      var parts = u.pathname.split('/').filter(Boolean);
      if (parts.length < 2) return null;
      var section = parts[0];
      if (section !== 'model' && section !== 'pornstar' && section !== 'users') return null;
      var rootPath = '/' + section + '/' + parts[1];
      return u.origin + rootPath;
    } catch(e) { return null; }
  }

  function parseNumberFromText(text) {
    if (!text) return null;
    var nums = text.match(/\d[\d. ]*/g);
    if (nums && nums.length) {
      var last = nums[nums.length - 1].replace(/[^\d]/g, '');
      var n = parseInt(last, 10);
      if (!isNaN(n)) return n;
    }
    return null;
  }

  // Пытаемся извлечь число видео из текущего DOM
  function getVideoCountFromCurrentDOM() {
    var nodes = document.querySelectorAll('.pornstarVideosCounter, .showingCounter, [class*="VideosCounter"]');
    for (var i = 0; i < nodes.length; i++) {
      var text = (nodes[i].textContent || '').replace(/\s+/g, ' ').trim();
      var n = parseNumberFromText(text);
      if (n != null) return n;
    }
    // Запасной вариант: попробовать найти цифру в пункте меню "Videos"
    var link = document.querySelector('a[href$="/videos"], a[href*="/videos?"]');
    if (link) {
      var t = (link.textContent || '').replace(/\s+/g, ' ').trim();
      var n2 = parseNumberFromText(t);
      if (n2 != null) return n2;
    }
    return null;
  }

  function cacheKey(rootUrl) {
    return 'tmPhVideoCount:' + rootUrl;
  }

  function readCachedCount(rootUrl) {
    try {
      var raw = sessionStorage.getItem(cacheKey(rootUrl));
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (!obj || typeof obj.count !== 'number' || typeof obj.t !== 'number') return null;
      // TTL 1 час
      if (Date.now() - obj.t > 3600000) return null;
      return obj.count;
    } catch(e) { return null; }
  }

  function writeCachedCount(rootUrl, count) {
    try {
      sessionStorage.setItem(cacheKey(rootUrl), JSON.stringify({ count: count, t: Date.now() }));
    } catch(e) {}
  }

  function fetchVideoCountFromRoot(rootUrl) {
    return fetch(rootUrl, { credentials: 'same-origin', cache: 'no-cache' })
      .then(function(r) { return r.text(); })
      .then(function(html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        // Ищем знакомый счётчик
        var nodes = doc.querySelectorAll('.pornstarVideosCounter, .showingCounter, [class*="VideosCounter"]');
        for (var i = 0; i < nodes.length; i++) {
          var text = (nodes[i].textContent || '').replace(/\s+/g, ' ').trim();
          var n = parseNumberFromText(text);
          if (n != null) return n;
        }
        // Фолбэк: цифра на табе Videos
        var link = doc.querySelector('a[href$="/videos"], a[href*="/videos?"]');
        if (link) {
          var t = (link.textContent || '').replace(/\s+/g, ' ').trim();
          var n2 = parseNumberFromText(t);
          if (n2 != null) return n2;
        }
        return null;
      })
      .catch(function() { return null; });
  }

  function findAvatarContainer() {
    var selectors = [
      '.topProfileHeader [class*="avatar"]',
      '.profileHeader [class*="avatar"]',
      '.topProfileHeader img',
      '.profileHeader img'
    ];
    for (var s = 0; s < selectors.length; s++) {
      var el = document.querySelector(selectors[s]);
      if (el) {
        var img = el.tagName === 'IMG' ? el : el.querySelector('img');
        if (img) {
          var container = img.closest('[class*="avatar"]') || img.parentElement || img;
          return container;
        }
      }
    }
    // запасной поиск крупной округлой картинки в шапке
    var header = document.querySelector('.topProfileHeader, .profileHeader') || document;
    var imgs = header.getElementsByTagName('img');
    for (var i = 0; i < imgs.length; i++) {
      var im = imgs[i];
      var w = im.width || im.naturalWidth || 0;
      var h = im.height || im.naturalHeight || 0;
      if (Math.min(w, h) < 60) continue;
      var cs = window.getComputedStyle(im);
      var br = cs.borderRadius || '';
      var isRoundish = br.indexOf('50%') !== -1 || parseInt(br, 10) >= 20;
      if (isRoundish) {
        return im.closest('[class*="avatar"]') || im.parentElement || im;
      }
    }
    return null;
  }

  function injectBadge(container, count) {
    if (!container) return;
    var old = container.querySelector('.' + BADGE_CLASS);
    if (old) old.remove();

    var cs = window.getComputedStyle(container);
    if (!cs || cs.position === 'static') {
      container.style.position = 'relative';
    }

    var badge = document.createElement('div');
    badge.className = BADGE_CLASS;
    badge.textContent = String(count);
    container.appendChild(badge);
  }

  function resolveAndInject() {
    if (inflight) return;
    if (injectedForUrl === location.href) return;

    inflight = true;

    var count = getVideoCountFromCurrentDOM();
    var avatar = findAvatarContainer();
    var rootUrl = getProfileRootUrl();

    function finish(c) {
      inflight = false;
      if (c == null || !avatar) return;
      ensureStyle();
      injectBadge(avatar, c);
      injectedForUrl = location.href;
    }

    if (count != null) {
      // Обновим кэш и вставим
      if (rootUrl) writeCachedCount(rootUrl, count);
      finish(count);
      return;
    }

    if (!rootUrl) { inflight = false; return; }

    var cached = readCachedCount(rootUrl);
    if (cached != null) {
      finish(cached);
      return;
    }

    fetchVideoCountFromRoot(rootUrl).then(function(n) {
      if (n != null) writeCachedCount(rootUrl, n);
      finish(n);
    }).finally(function() {
      inflight = false;
    });
  }

  function bootWithRetries(timeoutMs, intervalMs) {
    if (timeoutMs == null) timeoutMs = 12000;
    if (intervalMs == null) intervalMs = 400;
    var start = Date.now();
    var timer = setInterval(function() {
      resolveAndInject();
      if (injectedForUrl === location.href) {
        clearInterval(timer);
        return;
      }
      if (Date.now() - start > timeoutMs) {
        clearInterval(timer);
      }
    }, intervalMs);
  }

  var mo = new MutationObserver(function() {
    resolveAndInject();
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  var lastHref = location.href;
  setInterval(function() {
    if (location.href !== lastHref) {
      lastHref = location.href;
      injectedForUrl = null;
      resolveAndInject();
      bootWithRetries();
    }
  }, 500);

  bootWithRetries();
})();
