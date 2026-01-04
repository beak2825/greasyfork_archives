// ==UserScript==
// @name         Comick Chapter Timer
// @namespace    https://github.com/GooglyBlox
// @version      1.1
// @description  Shows timer for next chapter when 2+ chapters are available
// @author       GooglyBlox
// @match        https://comick.dev/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545352/Comick%20Chapter%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/545352/Comick%20Chapter%20Timer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const API_BASE = 'https://api.comick.dev';
  let currentURL = location.href;
  let pageObserver = null;
  let bodyObserver = null;
  let processedSlugs = new Set();
  const elementProcessed = new WeakSet();
  const elementTimers = new Map();
  const slugControllers = new Map();

  const debounce = (fn, wait = 200) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };

  const scheduleLight = (fn) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fn, { timeout: 500 });
    } else {
      requestAnimationFrame(fn);
    }
  };

  (function () {
    const wrap = (type) => {
      const orig = history[type];
      return function () {
        const res = orig.apply(this, arguments);
        window.dispatchEvent(new Event('spa:navigation'));
        return res;
      };
    };
    history.pushState = wrap('pushState');
    history.replaceState = wrap('replaceState');
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('spa:navigation')));
  })();

  function cancelInFlight() {
    for (const [, controller] of slugControllers) {
      try { controller.abort(); } catch {}
    }
    slugControllers.clear();
    for (const [, data] of elementTimers) {
      if (data && data.intervalId) clearInterval(data.intervalId);
    }
    elementTimers.clear();
  }

  function onRouteChange() {
    const newURL = location.href;
    if (newURL === currentURL) return;
    currentURL = newURL;
    cancelInFlight();
    processedSlugs = new Set();
    teardownObservers();
    scheduleLight(() => {
      observePageRoot();
      debouncedScan();
    });
  }

  window.addEventListener('spa:navigation', onRouteChange);

  setInterval(() => {
    if (location.href !== currentURL) onRouteChange();
  }, 800);

  function extractSlugFromHref(href) {
    if (!href) return null;
    const m = href.match(/\/comic\/([^\/\?#]+)/);
    return m ? m[1] : null;
  }

  function extractCurrentChapter(element) {
    const spans = element.querySelectorAll('span');
    for (const span of spans) {
      const t = span.textContent || '';
      if (t.includes('Current')) {
        const m = t.match(/Current\s+(\d+)/);
        if (m) return parseInt(m[1], 10);
      }
    }
    return null;
  }

  async function getComicData(slug, signal) {
    try {
      const res = await fetch(`${API_BASE}/comic/${slug}?tachiyomi=true`, { signal });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async function getChapters(hid, signal) {
    try {
      const res = await fetch(`${API_BASE}/comic/${hid}/chapters?lang=en&chap-order=1&limit=300`, { signal });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function deduplicateChapters(chapters) {
    const map = new Map();
    for (const c of chapters) {
      const num = parseFloat(c.chap);
      if (Number.isNaN(num)) continue;
      const ex = map.get(num);
      if (!ex) {
        map.set(num, c);
      } else {
        const exTime = ex.publish_at ? new Date(ex.publish_at) : new Date(0);
        const curTime = c.publish_at ? new Date(c.publish_at) : new Date(0);
        if (curTime > exTime) map.set(num, c);
      }
    }
    return Array.from(map.values());
  }

  function findNextUnpublishedChapter(chapters) {
    const now = new Date();
    const unique = deduplicateChapters(chapters);
    const upcoming = unique.filter(c => c.publish_at && new Date(c.publish_at) > now);
    if (upcoming.length === 0) return null;
    upcoming.sort((a, b) => new Date(a.publish_at) - new Date(b.publish_at));
    return upcoming[0];
  }

  function getHighestChapterNumber(chapters) {
    const unique = deduplicateChapters(chapters);
    if (unique.length === 0) return 0;
    const highest = unique.reduce((h, cur) => {
      const hn = parseFloat(h.chap) || 0;
      const cn = parseFloat(cur.chap) || 0;
      return cn > hn ? cur : h;
    });
    return parseFloat(highest.chap) || 0;
  }

  function createTimerElement(targetTime, hostElement) {
    const timerDiv = document.createElement('div');
    timerDiv.className = 'mt-3 pr-2';
    timerDiv.innerHTML = `
      <a class="btn w-full text-center text-xs px-0 border-none" style="pointer-events: none;">
        <div class="text-orange-600 dark:text-orange-400">
          <p>
            <span class="hours">00</span><span class="divider">:</span><span class="minutes">00</span><span class="divider">:</span><span class="seconds">00</span>
          </p>
        </div>
      </a>
    `;

    const update = () => {
      const now = new Date();
      const diff = targetTime - now;
      if (diff <= 0) {
        timerDiv.innerHTML = `
          <div class="flex items-center h-8">
            <span class="btn w-full text-center text-xs px-0 border-none text-green-600">Available Now</span>
          </div>
        `;
        const data = elementTimers.get(hostElement);
        if (data && data.intervalId) {
          clearInterval(data.intervalId);
          elementTimers.set(hostElement, { ...data, intervalId: null });
        }
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const hEl = timerDiv.querySelector('.hours');
      const mEl = timerDiv.querySelector('.minutes');
      const sEl = timerDiv.querySelector('.seconds');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
      if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    };

    update();
    const id = setInterval(update, 1000);
    elementTimers.set(hostElement, { intervalId: id, node: timerDiv });
    return timerDiv;
  }

  function clearTimerForElement(el) {
    const data = elementTimers.get(el);
    if (!data) return;
    if (data.intervalId) clearInterval(data.intervalId);
    elementTimers.delete(el);
  }

  function trackElementRemoval(root) {
    if (bodyObserver) return;
    bodyObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.removedNodes && m.removedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (elementTimers.has(n)) clearTimerForElement(n);
          for (const [el] of elementTimers) {
            if (!root.contains(el)) clearTimerForElement(el);
          }
        });
      }
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });
  }

  async function processComicElement(element) {
    try {
      if (elementProcessed.has(element)) return;
      elementProcessed.add(element);

      const links = element.querySelectorAll('a[href*="/comic/"]');
      if (links.length === 0) return;

      let comicLink = null;
      for (const link of links) {
        if (!/\/chapter\//.test(link.href)) {
          comicLink = link;
          break;
        }
      }
      if (!comicLink) return;

      const slug = extractSlugFromHref(comicLink.href);
      if (!slug) return;

      const currentChapter = extractCurrentChapter(element);
      if (currentChapter == null) return;

      if (processedSlugs.has(slug)) return;
      processedSlugs.add(slug);

      const controller = new AbortController();
      slugControllers.set(slug, controller);

      const comicData = await getComicData(slug, controller.signal);
      if (!comicData || !comicData.comic) {
        slugControllers.delete(slug);
        return;
      }

      const chaptersData = await getChapters(comicData.comic.hid, controller.signal);
      slugControllers.delete(slug);
      if (!chaptersData || !chaptersData.chapters) return;

      const highest = getHighestChapterNumber(chaptersData.chapters);
      const diff = highest - currentChapter;

      if (diff >= 2) {
        const nextUnpublished = findNextUnpublishedChapter(chaptersData.chapters);
        if (nextUnpublished) {
          const publishTime = new Date(nextUnpublished.publish_at);
          const existing = element.querySelector('.mt-3.pr-2');
          if (existing) {
            clearTimerForElement(element);
            const timer = createTimerElement(publishTime, element);
            existing.replaceWith(timer);
          } else {
            clearTimerForElement(element);
            const timer = createTimerElement(publishTime, element);
            element.appendChild(timer);
          }
        }
      }
    } catch {}
  }

  function collectCandidateCards(root = document) {
    const set = new Set();
    root.querySelectorAll('div[style*="translateX"]').forEach((el) => set.add(el));
    root.querySelectorAll('a[href*="/comic/"]').forEach((a) => {
      const card = a.closest('div');
      if (card) set.add(card);
    });
    root.querySelectorAll('span').forEach((s) => {
      const t = s.textContent || '';
      if (t.includes('Current')) {
        const card = s.closest('div');
        if (card) set.add(card);
      }
    });
    return Array.from(set);
  }

  function scanForComics() {
    const cards = collectCandidateCards(document);
    for (const card of cards) {
      let hasCurrent = false;
      for (const span of card.querySelectorAll('span')) {
        const t = span.textContent || '';
        if (t.includes('Current')) {
          hasCurrent = true;
          break;
        }
      }
      if (hasCurrent) processComicElement(card);
    }
  }

  const debouncedScan = debounce(() => scheduleLight(scanForComics), 150);

  function getPageRoot() {
    const candidates = [
      document.querySelector('main#main'),
      document.querySelector('main'),
      document.getElementById('__next'),
      document.body,
    ];
    return candidates.find(Boolean) || document.body;
  }

  function observePageRoot() {
    const root = getPageRoot();
    if (pageObserver) {
      try { pageObserver.disconnect(); } catch {}
    }
    pageObserver = new MutationObserver((mutations) => {
      const relevant = mutations.some((m) =>
        Array.from(m.addedNodes).some((n) => {
          if (!(n instanceof Element)) return false;
          if (n.matches('div[style*="translateX"]')) return true;
          if (n.querySelector && n.querySelector('div[style*="translateX"]')) return true;
          if (n.querySelector && n.querySelector('a[href*="/comic/"]')) return true;
          if ((n.textContent || '').includes('Current')) return true;
          return false;
        })
      );
      if (relevant) debouncedScan();
    });
    pageObserver.observe(root, { childList: true, subtree: true });
    trackElementRemoval(root);
  }

  function teardownObservers() {
    if (pageObserver) {
      try { pageObserver.disconnect(); } catch {}
      pageObserver = null;
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      for (const [, data] of elementTimers) {
        if (data && data.intervalId) clearInterval(data.intervalId);
      }
      for (const [el, data] of elementTimers) {
        elementTimers.set(el, { ...data, intervalId: null });
      }
    } else {
      debouncedScan();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observePageRoot();
      debouncedScan();
    });
  } else {
    observePageRoot();
    debouncedScan();
  }

  setInterval(() => debouncedScan(), 30000);
})();
