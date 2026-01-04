// ==UserScript==
// @name         YouTube Tweaker Pro (Full Suite) [v3.3.3 Aggressive Ads + SponsorBlock + Pre-roll Sniper]
// @namespace    https://greasyfork.org/users/eliminater74
// @version      3.3.3
// @description  Aggressive ad skip, optional unskippable fast-forward (safer), overlay cleanup, SponsorBlock, pre-roll skip sniper, and watchdog to normalize audio/speed after ads.
// @author       Eliminater74
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @connect      api.sponsor.ajay.app
// @downloadURL https://update.greasyfork.org/scripts/540055/YouTube%20Tweaker%20Pro%20%28Full%20Suite%29%20%5Bv333%20Aggressive%20Ads%20%2B%20SponsorBlock%20%2B%20Pre-roll%20Sniper%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/540055/YouTube%20Tweaker%20Pro%20%28Full%20Suite%29%20%5Bv333%20Aggressive%20Ads%20%2B%20SponsorBlock%20%2B%20Pre-roll%20Sniper%5D.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SETTINGS_KEY = 'ytTweakerSettingsV3';
  const defaultSettings = {
    // UI / layout
    hideRightSidebar: false,
    hideLeftNav: false,
    muteAutoplay: false,
    hideShorts: false,
    forceTheater: false,
    widenLayout: false,
    hideComments: false,
    expandDescription: false,
    hideEndscreen: false,
    autoHD: false,
    hideHomepageAds: false,
    hideTopBannerPromo: false,
    hideKeywordChips: false,
    darkMode: true,
    hideGearFullscreen: false,
    gearAutoHideDelay: 0,

    // Ads
    autoSkipAds: true,
    aggressiveAdSkip: true,
    fastForwardUnskippable: false, // SAFER DEFAULT = OFF
    adFastRate: 16,
    trySafeEndJump: true,
    cleanOverlayAds: true,
    muteDuringAds: true,

    // SponsorBlock
    skipSponsorSegments: true,
    sponsorBlockCategories: {
      sponsor: true,
      selfpromo: true,
      interaction: true,
      intro: false,
      outro: false,
      preview: false,
      music_offtopic: false,
      poi_highlight: false
    },

    // Dev
    debugLog: false
  };

  let settings = { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
  const saveSettings = () => localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  const q = s => document.querySelector(s);
  const qAll = s => document.querySelectorAll(s);
  const log = (...a) => settings.debugLog && console.log('[YTP]', ...a);

  const SKIP_SELECTORS = `
    .ytp-ad-skip-button,
    .ytp-ad-skip-button-modern,
    .ytp-ad-skip-button-container button,
    .ytp-skip-ad-button,
    .ytp-skip-ad-button-modern,
    .ytp-button[aria-label*="Skip"],
    .ytp-ad-button[aria-label*="Skip"],
    button.ytp-ad-overlay-close-button
  `;

  function resetSettings() { settings = { ...defaultSettings }; saveSettings(); location.reload(); }

  // ---------- Core page tweaks ----------
  function applySettings() {
    if (q('#related')) q('#related').style.display = settings.hideRightSidebar ? 'none' : '';
    ['#guide','ytd-mini-guide-renderer','ytd-guide-section-renderer'].forEach(sel =>
      qAll(sel).forEach(e => (e.style.display = settings.hideLeftNav ? 'none' : ''))
    );
    ['ytd-rich-section-renderer','ytd-reel-shelf-renderer'].forEach(sel =>
      qAll(sel).forEach(e => (e.style.display = settings.hideShorts ? 'none' : ''))
    );

    qAll('ytd-comments').forEach(e => (e.style.display = settings.hideComments ? 'none' : ''));

    qAll('ytd-promoted-video-renderer, ytd-display-ad-renderer, ytd-rich-item-renderer[is-promoted], ytd-ad-slot-renderer')
      .forEach(e => (e.style.display = settings.hideHomepageAds ? 'none' : ''));
    qAll('ytd-banner-promo-renderer, ytd-rich-banner-renderer')
      .forEach(e => (e.style.display = settings.hideTopBannerPromo ? 'none' : ''));
    qAll('ytd-feed-filter-chip-bar-renderer, .chip-bar')
      .forEach(e => (e.style.display = settings.hideKeywordChips ? 'none' : ''));

    const vid = getVideo();
    if (vid && settings.muteAutoplay) vid.muted = true;

    if (settings.forceTheater) {
      const flexy = q('ytd-watch-flexy');
      const btn = q('.ytp-size-button');
      if (btn && flexy && !flexy.hasAttribute('theater')) btn.click();
    }

    if (settings.widenLayout && location.pathname.startsWith('/watch')) {
      const player = document.getElementById('player-container');
      if (player) player.style.maxWidth = '100%';
    }

    if (settings.expandDescription && location.pathname.startsWith('/watch')) {
      const exp = q('#expand');
      if (exp && exp.getAttribute('aria-expanded') !== 'true') exp.click();
    }

    const styleId = 'yt-endscreen-style';
    let style = document.getElementById(styleId);
    if (settings.hideEndscreen && !style) {
      style = document.createElement('style');
      style.id = styleId;
      style.textContent = `.ytp-ce-element, .ytp-ce-video { display: none !important; }`;
      document.head.appendChild(style);
    } else if (!settings.hideEndscreen && style) style.remove();

    if (settings.autoHD) setTimeout(() => q('.ytp-settings-button')?.click(), 3000);
    if (settings.cleanOverlayAds) removeOverlayAds();
  }

  // ---------- Ad logic ----------
  let adState = {
    inAd: false,
    wasMuted: null,
    oldRate: 1,
    restoreRate: 1,
    fastTimer: null,
    postAdSweepTimer: null
  };

  function getVideo() { return q('video.html5-main-video') || q('video'); }

  // Safer: require true ad signals (player class OR visible countdown)
  let adPositives = 0;
  let adNegatives = 0;
  function adSignalsPresentStrict() {
    const player = q('.html5-video-player, #movie_player, ytd-player');
    const hasAdClass = !!player?.classList?.contains('ad-showing');

    // a visible countdown element (e.g., "Ad • 0:05")
    const countdownVisible = [...qAll('.ytp-ad-duration-remaining, .ytp-time-duration')].some(el =>
      el && el.offsetParent !== null && /Ad/i.test(el.textContent || '')
    );

    const overlay = !!q('.ytp-ad-player-overlay, .ytp-ad-module, .ytp-ad-preview-container');

    // Only accept overlay as a helper if one of the two main signals exists
    return hasAdClass || countdownVisible || (overlay && hasAdClass);
  }

  function isAdPlaying() {
    if (adSignalsPresentStrict()) {
      adPositives++; adNegatives = 0;
    } else {
      adNegatives++; adPositives = 0;
    }
    // enter ad after 3 consecutive positives; leave after 3 consecutive negatives
    if (!adState.inAd) return adPositives >= 3;
    return adNegatives < 3;
  }

  function clickAllSkipButtons() {
    if (!settings.autoSkipAds) return;
    qAll(SKIP_SELECTORS).forEach(btn => { try { btn.click(); log('Clicked skip'); } catch {} });
  }

  function removeOverlayAds() {
    if (!settings.cleanOverlayAds) return;
    qAll(`
      .ytp-ad-overlay-slot,
      .ytp-ad-image-overlay,
      .ytp-ad-overlay-container,
      .ytp-ad-text-overlay,
      .yt-mealbar-promo-renderer,
      .ytp-paid-content-overlay-text
    `).forEach(el => el.remove());
  }

  function startFastForwardAd(vid) {
    if (!vid || !settings.fastForwardUnskippable) return;

    if (adState.fastTimer) clearInterval(adState.fastTimer);
    if (adState.wasMuted === null) {
      adState.wasMuted = vid.muted;
      adState.oldRate = vid.playbackRate || 1;
      adState.restoreRate = Math.max(0.25, adState.oldRate);
    }
    if (settings.muteDuringAds) vid.muted = true;

    const targetRate = Math.max(2, Math.min(64, Number(settings.adFastRate) || 16));
    try { vid.playbackRate = targetRate; } catch {}

    if (settings.trySafeEndJump) {
      if (isFinite(vid.duration) && vid.duration > 0 && vid.duration < 120) {
        try {
          const jumpTo = Math.max(0, vid.duration - 0.25);
          if (vid.currentTime < jumpTo) vid.currentTime = jumpTo;
        } catch {}
      }
    }
    adState.fastTimer = setInterval(() => { clickAllSkipButtons(); removeOverlayAds(); }, 250);
  }

  function fullyRestoreFromAd(vid) {
    if (!vid) return;
    if (adState.fastTimer) { clearInterval(adState.fastTimer); adState.fastTimer = null; }
    try { vid.playbackRate = adState.restoreRate || 1; } catch {}
    if (adState.wasMuted !== null) {
      try { vid.muted = settings.muteAutoplay ? true : adState.wasMuted; } catch {}
    }
    adState.wasMuted = null;
    clearTimeout(adState.postAdSweepTimer);
    adState.postAdSweepTimer = setTimeout(() => { clickAllSkipButtons(); removeOverlayAds(); }, 1500);
  }

  function handleAdStateChange() {
    const vid = getVideo(); if (!vid) return;
    const nowInAd = isAdPlaying();

    if (nowInAd && !adState.inAd) {
      adState.inAd = true;
      clickAllSkipButtons();
      startFastForwardAd(vid);
    } else if (!nowInAd && adState.inAd) {
      adState.inAd = false;
      fullyRestoreFromAd(vid);
    }
  }

  function attachAdObservers() {
    const player = q('#movie_player') || q('.html5-video-player') || q('ytd-player');
    if (player) new MutationObserver(handleAdStateChange)
      .observe(player, { attributes: true, attributeFilter: ['class'] });

    const adContainer = q('.video-ads, .ytp-ad-module');
    if (adContainer) new MutationObserver(handleAdStateChange)
      .observe(adContainer, { childList: true, subtree: true });

    setInterval(handleAdStateChange, 500); // fallback

    // Watchdog: if NOT in ad, normalize after 2s of clean state
    let cleanTicks = 0;
    setInterval(() => {
      const vid = getVideo(); if (!vid) return;
      if (!adState.inAd && !adSignalsPresentStrict()) {
        cleanTicks++;
        // track user's preferred content rate (<=4x)
        if (vid.playbackRate && vid.playbackRate !== adState.restoreRate && vid.playbackRate <= 4) {
          adState.restoreRate = vid.playbackRate;
        }
        if (cleanTicks >= 2) { // ~2s
          if (vid.playbackRate > 4) { try { vid.playbackRate = adState.restoreRate || 1; } catch {} }
          if (!settings.muteAutoplay && vid.muted && adState.wasMuted === null) { try { vid.muted = false; } catch {} }
        }
      } else {
        cleanTicks = 0;
      }
    }, 1000);
  }

  // ---------- Pre-roll skip sniper ----------
  function armPreRollSkipper(durationMs = 20000) {
    if (!settings.autoSkipAds) return;
    const stopAt = performance.now() + durationMs;
    const mo = new MutationObserver(() => tryClick());
    mo.observe(document.body, { childList: true, subtree: true });

    let rafId = 0;
    function tryClick() {
      const btn = [...document.querySelectorAll(SKIP_SELECTORS)]
        .find(b => b && b.offsetParent !== null && !b.disabled);
      if (btn) { try { btn.click(); log('Pre-roll click'); } catch {} }

      const vid = getVideo();
      const outOfAd = !adState.inAd && !adSignalsPresentStrict() && (vid ? (vid.currentTime || 0) > 1 : false);
      const timeUp = performance.now() > stopAt;
      if (outOfAd || timeUp) { mo.disconnect(); cancelAnimationFrame(rafId); return; }
      rafId = requestAnimationFrame(tryClick);
    }
    tryClick();
    document.addEventListener('visibilitychange', tryClick, { once: true });
  }

  // ---------- SponsorBlock ----------
  const SB_API = 'https://api.sponsor.ajay.app/api/skipSegments';
  let sbDataCache = new Map();
  let sbListenerAttachedFor = null;

  function getVideoIdFromUrl() {
    const u = new URL(location.href);
    const v = u.searchParams.get('v'); if (v) return v;
    const shorts = location.pathname.match(/\/shorts\/([^/?#]+)/); if (shorts) return shorts[1];
    const meta = q('meta[itemprop="videoId"]'); if (meta) return meta.getAttribute('content');
    return null;
  }

  function currentSbCategories() {
    const cats = [];
    for (const [k, v] of Object.entries(settings.sponsorBlockCategories)) if (v) cats.push(k);
    return cats.length ? cats : ['sponsor'];
  }

  function fetchSponsorSegments(videoId, cb) {
    const cached = sbDataCache.get(videoId); if (cached) { cb(cached); return; }
    const cats = currentSbCategories();
    const url = `${SB_API}?videoID=${encodeURIComponent(videoId)}&categories=${encodeURIComponent(JSON.stringify(cats))}`;
    GM_xmlhttpRequest({
      method: 'GET', url, headers: { 'Accept': 'application/json' },
      onload: (res) => {
        try {
          const data = JSON.parse(res.responseText);
          const segments = (Array.isArray(data) ? data : []).map(item => {
            const seg = item.segment || item.segments || [];
            const cat = item.category || (item.categories && item.categories[0]) || 'sponsor';
            const start = Number(seg[0]) || 0, end = Number(seg[1]) || 0;
            return end > start ? { start, end, category: cat } : null;
          }).filter(Boolean).sort((a,b)=>a.start-b.start);
          const merged = [];
          for (const s of segments) {
            const last = merged[merged.length-1];
            if (!last || s.start > last.end) merged.push({ ...s });
            else last.end = Math.max(last.end, s.end);
          }
          sbDataCache.set(videoId, merged); cb(merged);
        } catch { cb([]); }
      },
      onerror: () => cb([]), ontimeout: () => cb([])
    });
  }

  function attachSponsorBlockSkipper(videoId) {
    if (!settings.skipSponsorSegments) return;
    const vid = getVideo(); if (!vid || !videoId) return;
    if (sbListenerAttachedFor === vid) return;

    fetchSponsorSegments(videoId, (segments) => {
      if (!segments?.length) return;
      const onTimeUpdate = () => {
        const t = vid.currentTime || 0;
        for (const s of segments) {
          if (t >= s.start && t < s.end) { try { vid.currentTime = s.end + 0.05; log('SB skip', s.category); } catch {} break; }
        }
      };
      vid.addEventListener('timeupdate', onTimeUpdate);
      sbListenerAttachedFor = vid;
      const watchSwap = setInterval(() => {
        if (!document.contains(vid) || vid !== getVideo()) {
          try { vid.removeEventListener('timeupdate', onTimeUpdate); } catch {}
          clearInterval(watchSwap); sbListenerAttachedFor = null;
        }
      }, 1500);
    });
  }

  // ---------- UI ----------
  GM_addStyle(`
    #yt-tweaker-gear {
      position: fixed; bottom: 20px; right: 20px; background: #000; color: #0ff;
      font-size: 20px; padding: 8px 12px; border-radius: 8px; cursor: grab;
      z-index: 2147483647; box-shadow: 0 0 8px #0ff; user-select: none;
    }
    #yt-tweaker-panel {
      position: fixed; bottom: 60px; right: 20px; padding: 12px; border-radius: 10px;
      font-family: monospace; font-size: 13px; z-index: 2147483647; display: none;
      box-shadow: 0 0 12px rgba(0,0,0,0.5); max-width: 340px;
    }
    .yt-dark-theme { background: #111; color: #0f0; }
    .yt-light-theme { background: #eee; color: #111; }
    #yt-tweaker-panel label { display: block; margin: 5px 0; }
    #yt-tweaker-panel button { margin: 4px 2px; font-size: 12px; }
    #yt-tweaker-panel input[type="checkbox"], #yt-tweaker-panel select, #yt-tweaker-panel input[type="number"] { margin-right: 5px; }
    .ytp-section { margin-top: 8px; padding-top: 6px; border-top: 1px dashed currentColor; opacity: 0.95; }
    .ytp-section-title { font-weight: bold; display: block; margin-bottom: 4px; }
    .ytp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 10px; }
  `);

  function checkbox(labelText, key, onChange) {
    const label = document.createElement('label');
    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.checked = !!settings[key];
    cb.addEventListener('change', () => { settings[key] = cb.checked; saveSettings(); onChange?.(cb.checked); });
    label.appendChild(cb); label.appendChild(document.createTextNode(labelText));
    return label;
  }
  function numberInput(labelText, key, min=2, max=64) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type='number'; input.min=String(min); input.max=String(max); input.value=settings[key]; input.style.width='70px';
    input.addEventListener('change', () => {
      const v = Number(input.value);
      settings[key] = isFinite(v) ? Math.max(min, Math.min(max, v)) : defaultSettings[key];
      saveSettings();
    });
    label.appendChild(document.createTextNode(labelText+' ')); label.appendChild(input); return label;
  }

  function createUI() {
    if (document.getElementById('yt-tweaker-gear')) return;

    const gear = document.createElement('div'); gear.id='yt-tweaker-gear'; gear.textContent='⚙️'; document.body.appendChild(gear);
    const panel = document.createElement('div'); panel.id='yt-tweaker-panel'; panel.className = settings.darkMode ? 'yt-dark-theme' : 'yt-light-theme';

    const title = document.createElement('strong'); title.textContent = 'YouTube Tweaker';
    panel.appendChild(title); panel.appendChild(document.createElement('br')); panel.appendChild(document.createElement('br'));

    [
      ['Hide Right Sidebar (Suggestions)','hideRightSidebar'],
      ['Hide Left Nav Menu','hideLeftNav'],
      ['Mute Autoplay','muteAutoplay'],
      ['Hide Shorts','hideShorts'],
      ['Force Theater Mode','forceTheater'],
      ['Widen Layout','widenLayout'],
      ['Hide Comments','hideComments'],
      ['Expand Description','expandDescription'],
      ['Hide Endscreen','hideEndscreen'],
      ['Auto HD Quality','autoHD'],
      ['Hide Homepage Ads','hideHomepageAds'],
      ['Hide Top Banner Promo','hideTopBannerPromo'],
      ['Hide Keyword Chips','hideKeywordChips'],
      ['Auto-Skip Ads','autoSkipAds'],
      ['Mute During Ads','muteDuringAds'],
      ['Auto-Hide Gear in Fullscreen','hideGearFullscreen'],
      ['Aggressive Ad Skip','aggressiveAdSkip'],
      ['Fast-Forward Unskippable Ads','fastForwardUnskippable'],
      ['Clean Overlay/Image Ads','cleanOverlayAds'],
      ['Debug Log','debugLog']
    ].forEach(([label, key]) => panel.appendChild(checkbox(label, key)));

    // Gear auto-hide delay
    const delayLabel = document.createElement('label'); delayLabel.textContent = 'Gear Auto-Hide Delay (sec): ';
    const select = document.createElement('select');
    [0,3,5,10].forEach(v => { const o=document.createElement('option'); o.value=v; o.textContent=v; if(v==settings.gearAutoHideDelay) o.selected=true; select.appendChild(o); });
    select.addEventListener('change', () => { settings.gearAutoHideDelay = parseInt(select.value); saveSettings(); });
    delayLabel.appendChild(select); panel.appendChild(delayLabel);

    panel.appendChild(numberInput('Ad Fast Speed (2-64):','adFastRate',2,64));

    const themeToggle = checkbox('Dark Theme UI','darkMode', () => { panel.className = settings.darkMode ? 'yt-dark-theme' : 'yt-light-theme'; });
    panel.appendChild(themeToggle);

    // SponsorBlock
    const sbSection = document.createElement('div'); sbSection.className='ytp-section';
    const sbTitle = document.createElement('span'); sbTitle.className='ytp-section-title'; sbTitle.textContent='SponsorBlock';
    sbSection.appendChild(sbTitle);
    sbSection.appendChild(checkbox('Skip Sponsor Segments (API)','skipSponsorSegments', () => sbDataCache.clear()));
    const sbGrid = document.createElement('div'); sbGrid.className='ytp-grid';
    ['sponsor','selfpromo','interaction','intro','outro','preview','music_offtopic','poi_highlight'].forEach(k => {
      const lbl=document.createElement('label'); const cb=document.createElement('input'); cb.type='checkbox'; cb.checked=!!settings.sponsorBlockCategories[k];
      cb.addEventListener('change', () => { settings.sponsorBlockCategories[k]=cb.checked; saveSettings(); sbDataCache.clear(); });
      lbl.appendChild(cb); lbl.appendChild(document.createTextNode(k)); sbGrid.appendChild(lbl);
    });
    sbSection.appendChild(sbGrid); panel.appendChild(sbSection);

    // Tools
    const tools = document.createElement('div');
    const btnReset = document.createElement('button'); btnReset.textContent='Reset Settings';
    btnReset.onclick = () => confirm('Reset all settings?') && resetSettings();
    const btnExport = document.createElement('button'); btnExport.textContent='Export';
    btnExport.onclick = () => { navigator.clipboard.writeText(JSON.stringify(settings, null, 2)); alert('Settings copied to clipboard.'); };
    const btnImport = document.createElement('button'); btnImport.textContent='Import';
    btnImport.onclick = () => {
      const input = prompt('Paste settings JSON:'); try { const obj=JSON.parse(input); settings={...defaultSettings,...obj}; saveSettings(); location.reload(); } catch { alert('Invalid JSON.'); }
    };
    const btnNormalize = document.createElement('button'); btnNormalize.textContent='Normalize Now';
    btnNormalize.onclick = () => {
      const vid = getVideo(); if (!vid) return;
      try { vid.playbackRate = 1; if (!settings.muteAutoplay) vid.muted = false; } catch {}
      adState.inAd = false; adPositives = 0; adNegatives = 3;
    };
    tools.appendChild(btnReset); tools.appendChild(btnExport); tools.appendChild(btnImport); tools.appendChild(btnNormalize);
    panel.appendChild(tools);

    document.body.appendChild(panel);

    // Gear behavior + drag
    gear.addEventListener('click', () => { panel.style.display = panel.style.display === 'none' ? 'block' : 'none'; });
    let dragging=false, ox=0, oy=0;
    gear.addEventListener('mousedown', e => { dragging=true; ox=e.clientX-gear.offsetLeft; oy=e.clientY-gear.offsetTop; gear.style.cursor='grabbing'; });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      gear.style.left=`${e.clientX-ox}px`; gear.style.top=`${e.clientY-oy}px`; gear.style.bottom='auto'; gear.style.right='auto';
    });
    document.addEventListener('mouseup', () => { dragging=false; gear.style.cursor='grab'; });

    const handleVisibility = () => {
      const isFs=!!document.fullscreenElement; const gearEl=document.getElementById('yt-tweaker-gear'); const panelEl=document.getElementById('yt-tweaker-panel');
      if (!gearEl || dragging || panelEl.style.display==='block') return;
      gearEl.style.display = (settings.hideGearFullscreen && isFs) ? 'none' : '';
      if (settings.gearAutoHideDelay>0) {
        clearTimeout(gearEl._hideTimer);
        gearEl._hideTimer = setTimeout(() => { if (!dragging && panelEl.style.display==='none') gearEl.style.display='none'; }, settings.gearAutoHideDelay*1000);
      }
    };
    document.addEventListener('fullscreenchange', handleVisibility);
    document.addEventListener('mousemove', handleVisibility);
    document.addEventListener('keydown', handleVisibility);
    gear.addEventListener('mousemove', handleVisibility);
    gear.addEventListener('mouseenter', handleVisibility);
  }

  // ---------- SPA navigation & init ----------
  function onNewWatchPage() {
    applySettings();
    armPreRollSkipper(20000);
    attachAdObservers();
    if (settings.skipSponsorSegments) {
      const id = getVideoIdFromUrl(); if (id) attachSponsorBlockSkipper(id);
    }
  }

  function watchNavigation() {
    let lastUrl = location.href;
    new MutationObserver(() => {
      if (location.href !== lastUrl) { lastUrl = location.href; setTimeout(onNewWatchPage, 800); }
    }).observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    const wait = setInterval(() => {
      if (document.querySelector('ytd-app')) {
        clearInterval(wait);
        createUI();
        onNewWatchPage();
        watchNavigation();
      }
    }, 300);
  }

  GM_addStyle(`.ytp-ad-module, .ytp-ad-player-overlay { pointer-events: auto !important; }`);
  init();
})();
