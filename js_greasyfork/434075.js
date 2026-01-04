// ==UserScript==
// @name              Youtube Fullscreen Mode
// @name:ko           유튜브 풀스크린
// @description       -
// @description:ko    -
// @version           2025.09.23
// @author            ndaesik
// @icon              https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Youtube_shorts_icon.svg/193px-Youtube_shorts_icon.svg.png
// @match             *://*.youtube.com/*
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @namespace https://ndaesik.tistory.com/
// @downloadURL https://update.greasyfork.org/scripts/434075/Youtube%20Fullscreen%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/434075/Youtube%20Fullscreen%20Mode.meta.js
// ==/UserScript==

(() => {
  'use strict';
  if (window.top !== window.self) return;

  const STORE_KEY = 'yt_auto_theater_enabled';
  let autoTheaterEnabled = typeof GM_getValue === 'function' ? !!GM_getValue(STORE_KEY, true) : true;
  let menuId = null;

  const scrollbarHideCSS = document.createElement('style');
  scrollbarHideCSS.dataset.tm = 'yt-fullscreen-suggest';
  scrollbarHideCSS.textContent = `
    body{overflow-y:auto;}
  `.replaceAll(';','!important;');

  const fullscreenVideoCSS = document.createElement('style');
  fullscreenVideoCSS.dataset.tm = 'yt-fullscreen-video';
  fullscreenVideoCSS.textContent = `
    ytd-app:not([guide-persistent-and-visible]) [theater] #player video,
    :is(ytd-watch-flexy[theater],ytd-watch-flexy[fullscreen]) #full-bleed-container {
      height:100vh;max-height:100vh;min-height:100vh;
    }
    ytd-watch-flexy[theater]{scrollbar-width:none;}
    ytd-watch-flexy[theater]::-webkit-scrollbar{display:none;}
    ytd-watch-flexy[theater] ~ body{scrollbar-width:none;-ms-overflow-style:none;}
    ytd-watch-flexy[theater] ~ body::-webkit-scrollbar{display:none;}
  `.replaceAll(';','!important;');

  const autoHideTopCSS = document.createElement('style');
  autoHideTopCSS.dataset.tm = 'yt-fullscreen-autohide';
  autoHideTopCSS.className = 'autoHideTopCSS';
  autoHideTopCSS.textContent = `
    #masthead-container.ytd-app:hover,#masthead-container.ytd-app:focus-within{width:100%;}
    #masthead-container.ytd-app,
    #masthead-container.ytd-app:not(:hover):not(:focus-within){width:calc(50% - 150px);}
    #masthead-container.ytd-app:not(:hover):not(:focus-within){transition:width .4s ease-out .4s;}
    ytd-app:not([guide-persistent-and-visible]) :is(#masthead-container ytd-masthead, #masthead-container.ytd-app::after){
      transform:translateY(-56px);transition:transform .1s .3s ease-out;
    }
    ytd-app:not([guide-persistent-and-visible]) :is(#masthead-container:hover ytd-masthead, #masthead-container:hover.ytd-app::after, #masthead-container:focus-within ytd-masthead){
      transform:translateY(0);
    }
    ytd-app:not([guide-persistent-and-visible]) ytd-page-manager{margin-top:0;}
  `.replaceAll(';','!important;');

  const $ = {
    els: { ytdApp: null, player: null, chatFrame: null },
    update() {
      this.els.ytdApp = document.querySelector('ytd-app');
      this.els.player = document.querySelector('#ytd-player');
      this.els.chatFrame = document.querySelector('ytd-live-chat-frame');
    }
  };

  let scrollTimer = null, isContentHidden = false;
  let observerForTheater = null;
  let listenersAttached = false;
  let listenerAbort = null;

  const isWatchPage = () => location.pathname === '/watch';
  const inTheater = () => {
    $.update();
    const { ytdApp, player, chatFrame } = $.els;
    return ytdApp && player && isWatchPage() &&
      (window.innerWidth - ytdApp.offsetWidth + player.offsetWidth +
       (chatFrame && !chatFrame.attributes.collapsed ? chatFrame.offsetWidth : 0)) === window.innerWidth;
  };

  const rafUntil = (pred, timeout = 5000) => new Promise(resolve => {
    const t0 = performance.now();
    const tick = () => {
      if (pred()) return resolve(true);
      if (performance.now() - t0 > timeout) return resolve(false);
      requestAnimationFrame(tick);
    };
    tick();
  });

  const waitForStableLayout = async (timeout = 1500) => {
    const t0 = performance.now();
    let lastH = 0, stableCount = 0;
    const okProgress = () => {
      const p = document.querySelector('yt-page-navigation-progress');
      if (!p) return true;
      if (p.hasAttribute('hidden')) return true;
      const s = getComputedStyle(p);
      return s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0';
    };
    const okPlayer = () => {
      const v = document.querySelector('#ytd-player video, #movie_player video, ytd-player video');
      return !!(v && v.readyState >= 1);
    };
    const okWatch = () => {
      const flexy = document.querySelector('ytd-watch-flexy');
      return !!flexy && (flexy.hasAttribute('theater') || flexy.hasAttribute('fullscreen') || document.querySelector('.ytp-size-button'));
    };
    while (performance.now() - t0 < timeout) {
      const h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      stableCount = (h === lastH) ? (stableCount + 1) : 0;
      lastH = h;
      if (stableCount >= 2 && okProgress() && okPlayer() && okWatch()) return true;
      await new Promise(r => requestAnimationFrame(r));
    }
    return false;
  };

  const forceScrollTop = async () => {
    const html = document.documentElement;
    const body = document.body;
    const prevBehavior = html.style.scrollBehavior;
    const prevAnchorHtml = html.style.overflowAnchor;
    const prevAnchorBody = body.style.overflowAnchor;
    html.style.scrollBehavior = 'auto';
    html.style.overflowAnchor = 'none';
    body.style.overflowAnchor = 'none';
    const playerRoot = document.querySelector('#full-bleed-container, #ytd-player, ytd-player');
    if (playerRoot && typeof playerRoot.scrollIntoView === 'function') {
      try { playerRoot.scrollIntoView({ block: 'start', inline: 'nearest' }); } catch(_) {}
    }
    const attempts = [0, 0, 16, 33, 66, 100, 150, 200, 250, 300, 400];
    for (const ms of attempts) {
      if (ms) await new Promise(r => setTimeout(r, ms));
      window.scrollTo(0, 0);
      void document.body.offsetHeight;
      if (window.scrollY === 0) break;
    }
    html.style.scrollBehavior = prevBehavior || '';
    html.style.overflowAnchor = prevAnchorHtml || '';
    body.style.overflowAnchor = prevAnchorBody || '';
  };

  const resetScrollTopSmart = async () => {
    try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch(_) {}
    window.scrollTo(0,0);
    await new Promise(r => requestAnimationFrame(() => { window.scrollTo(0,0); r(); }));
    await new Promise(r => requestAnimationFrame(() => { window.scrollTo(0,0); r(); }));
    await waitForStableLayout(1500);
    await forceScrollTop();
  };

  let autoHideOn = false;

  const shouldShowAutoHideCSS = () => {
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight + 56;
    return isWatchPage() && inTheater() && scrollPosition <= viewportHeight;
  };

  const updateAutoHideCSS = () => {
    const need = shouldShowAutoHideCSS();
    if (need === autoHideOn) return;
    autoHideOn = need;
    if (need) {
      if (!document.head.querySelector('style[data-tm="yt-fullscreen-autohide"]')) {
        document.head.appendChild(autoHideTopCSS);
      }
    } else {
      autoHideTopCSS.remove();
    }
  };

  const checkConditions = () => {
    if (!isWatchPage()) return;
    const watchFlexy = document.querySelector('ytd-watch-flexy');
    const primaryContent = document.querySelector('#primary');
    const secondaryContent = document.querySelector('#secondary');
    const isTheater = watchFlexy?.hasAttribute('theater');
    const isScrollTop = window.scrollY === 0;
    if (!primaryContent || !secondaryContent || !isTheater) return;
    if (isScrollTop && !isContentHidden) {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        primaryContent.style.display = 'none';
        secondaryContent.style.display = 'none';
        isContentHidden = true;
      }, 2000);
    } else if (!isScrollTop && scrollTimer) {
      clearTimeout(scrollTimer);
      scrollTimer = null;
      if (isContentHidden) {
        primaryContent.style.display = '';
        secondaryContent.style.display = '';
        isContentHidden = false;
      }
    }
  };

  const showContent = () => {
    const primaryContent = document.querySelector('#primary');
    const secondaryContent = document.querySelector('#secondary');
    if (isContentHidden && primaryContent && secondaryContent) {
      primaryContent.style.display = '';
      secondaryContent.style.display = '';
      isContentHidden = false;
      if (scrollTimer) { clearTimeout(scrollTimer); scrollTimer = null; }
      setTimeout(checkConditions, 1000);
    }
  };

  const attachCSS = () => {
    if (!document.head.querySelector('style[data-tm="yt-fullscreen-suggest"]')) {
      document.head.appendChild(scrollbarHideCSS);
    }
    if (!document.head.querySelector('style[data-tm="yt-fullscreen-video"]')) {
      document.head.appendChild(fullscreenVideoCSS);
    }
    updateAutoHideCSS();
  };

  const detachCSS = () => {
    scrollbarHideCSS.remove();
    fullscreenVideoCSS.remove();
    autoHideTopCSS.remove();
    observerForTheater?.disconnect();
    observerForTheater = null;
    if (listenerAbort) { listenerAbort.abort(); listenerAbort = null; }
    listenersAttached = false;
    if (isContentHidden) {
      const primaryContent = document.querySelector('#primary');
      const secondaryContent = document.querySelector('#secondary');
      if (primaryContent) primaryContent.style.display = '';
      if (secondaryContent) secondaryContent.style.display = '';
      isContentHidden = false;
    }
    if (scrollTimer) { clearTimeout(scrollTimer); scrollTimer = null; }
    autoHideOn = false;
  };

  const ensureTheaterOnce = () => {
    if (!autoTheaterEnabled || !isWatchPage()) return;
    const flexy = document.querySelector('ytd-watch-flexy');
    if (!flexy || flexy.hasAttribute('theater')) return;
    const sizeBtn = document.querySelector('.ytp-size-button');
    if (sizeBtn) {
      sizeBtn.click();
      return;
    }
    try { flexy.setAttribute('theater',''); } catch(_) {};
  };

  const ensureTheaterAggressive = async () => {
    if (!autoTheaterEnabled || !isWatchPage()) return;
    await waitForStableLayout(2000);
    for (let i=0;i<4;i++){
      ensureTheaterOnce();
      const ok = document.querySelector('ytd-watch-flexy')?.hasAttribute('theater');
      if (ok) break;
      await new Promise(r=>setTimeout(r, 150 + i*150));
    }
  };

  const setupEventListeners = () => {
    if (listenersAttached) return;
    listenersAttached = true;
    listenerAbort = new AbortController();
    const sig = listenerAbort.signal;

    window.addEventListener('scroll', () => requestAnimationFrame(() => {
      updateAutoHideCSS();
      checkConditions();
    }), { passive: true, signal: sig });

    window.addEventListener('click', () => {
      setTimeout(updateAutoHideCSS, 100);
      requestAnimationFrame(showContent);
    }, { passive: true, signal: sig });

    window.addEventListener('wheel', () => requestAnimationFrame(showContent), { passive: true, signal: sig });

    const watchFlexyInit = () => {
      const watchFlexy = document.querySelector('ytd-watch-flexy');
      if (!watchFlexy) return;
      observerForTheater?.disconnect();
      observerForTheater = new MutationObserver(() => requestAnimationFrame(() => {
        checkConditions();
        ensureTheaterOnce();
      }));
      observerForTheater.observe(watchFlexy, { attributes: true, attributeFilter: ['theater'] });
    };
    new MutationObserver(watchFlexyInit).observe(document.documentElement, { childList: true, subtree: true });
    watchFlexyInit();

    const resync = () => { resetScrollTopSmart(); ensureTheaterAggressive(); };
    window.addEventListener('yt-navigate-finish', resync, { passive: true, signal: sig });
    window.addEventListener('yt-navigate-cache-restored', resync, { passive: true, signal: sig });
    window.addEventListener('yt-page-data-updated', resync, { passive: true, signal: sig });
    window.addEventListener('ytd-player-updated', resync, { passive: true, signal: sig });
  };

  const URL_EVENT = 'tm-url-change';
  const fireUrlEvent = () => window.dispatchEvent(new Event(URL_EVENT));

  const _pushState = history.pushState;
  const _replaceState = history.replaceState;
  history.pushState = function(...args) { const r = _pushState.apply(this, args); fireUrlEvent(); return r; };
  history.replaceState = function(...args) { const r = _replaceState.apply(this, args); fireUrlEvent(); return r; };

  window.addEventListener('popstate', fireUrlEvent);
  window.addEventListener('hashchange', fireUrlEvent);
  window.addEventListener('yt-navigate-finish', fireUrlEvent);
  window.addEventListener('yt-navigate-start', fireUrlEvent);

  let lastPath = location.pathname + location.search;

  const onRoute = () => {
    const now = location.pathname + location.search;
    if (now === lastPath) return;
    lastPath = now;
    if (isWatchPage()) {
      attachCSS();
      setupEventListeners();
      resetScrollTopSmart();
      requestAnimationFrame(() => {
        updateAutoHideCSS();
        checkConditions();
        ensureTheaterAggressive();
      });
      setTimeout(() => { if (window.scrollY !== 0) resetScrollTopSmart(); }, 500);
    } else {
      detachCSS();
    }
  };

  const attachMenu = () => {
    try {
      if (typeof GM_unregisterMenuCommand === 'function' && menuId) {
        GM_unregisterMenuCommand(menuId);
        menuId = null;
      }
      if (typeof GM_registerMenuCommand === 'function') {
        const label = `Auto Theater Mode: ${autoTheaterEnabled ? 'On' : 'Off'}`;
        menuId = GM_registerMenuCommand(label, () => toggleAutoTheater());
      }
    } catch(_) {}
  };

  const persistState = () => {
    try { if (typeof GM_setValue === 'function') GM_setValue(STORE_KEY, autoTheaterEnabled); } catch(_){}
  };

  const toggleAutoTheater = () => {
    autoTheaterEnabled = !autoTheaterEnabled;
    persistState();
    attachMenu();
    if (autoTheaterEnabled) ensureTheaterAggressive();
  };

  const boot = () => {
    attachMenu();
    if (isWatchPage()) {
      attachCSS();
      setupEventListeners();
      resetScrollTopSmart();
      requestAnimationFrame(() => {
        updateAutoHideCSS();
        checkConditions();
        ensureTheaterAggressive();
      });
      setTimeout(() => { if (window.scrollY !== 0) resetScrollTopSmart(); }, 500);
    } else {
      detachCSS();
    }
  };

  window.addEventListener(URL_EVENT, onRoute);
  boot();
})();
