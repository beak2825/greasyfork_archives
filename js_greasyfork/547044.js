// ==UserScript==
// @name         Youtube Enhancer By Domopremo
// @namespace    DomopremoScripts
// @version      1.0.0
// @description  Adds an ergonomic right-side tab panel (Info / Comments / Videos / Transcript), fast speed controls, ad-marking, keyboard shortcuts, last-tab+scroll restore, and a quick settings UI for YouTube. Stable, performant, and accessible.
// @author       Domopremo
// @license      MIT
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/5e8b1b8a/img/favicon_144x144.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547044/Youtube%20Enhancer%20By%20Domopremo.user.js
// @updateURL https://update.greasyfork.org/scripts/547044/Youtube%20Enhancer%20By%20Domopremo.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /********************************************************************
   * Minimal utilities
   ********************************************************************/
  const onReady = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn, { once: true });
  };
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const SKEY = {
    SETTINGS: 'de/settings/v1',
    LAST: 'de/lastTabState', // { tabId, scroll: { "#tab-info": n, ... }, videoId }
    SPEED_GLOBAL: 'de/speed/global',
    SPEED_BY_CHANNEL: (channelId) => `de/speed/ch/${channelId}`
  };

  const defaults = {
    ui: {
      compactHeader: false,
      theme: 'system', // 'system' | 'light' | 'dark'
      rounded: 12
    },
    features: {
      speedControl: true,
      markAds: true,
      autoExpandDesc: true,
      transcriptTab: true,
      lastTabRestore: true,
      scrollRestore: true,
      rememberSpeedByChannel: false
    },
    shortcuts: {
      goInfo: 'g i',
      goComments: 'g c',
      goVideos: 'g v',
      goTranscript: 'g t',
      screenshot: 'ctrl+shift+s',
      focusTabs: 'g g'
    }
  };

  const store = {
    get() {
      try { return JSON.parse(GM_getValue(SKEY.SETTINGS, '')) || JSON.parse(JSON.stringify(defaults)); }
      catch { return JSON.parse(JSON.stringify(defaults)); }
    },
    set(val) { GM_setValue(SKEY.SETTINGS, JSON.stringify(val)); }
  };

  const state = {
    settings: store.get(),
    currentTab: '',
    scrollCache: { '#tab-info': 0, '#tab-comments': 0, '#tab-videos': 0, '#tab-transcript': 0 },
    channelId: null,
    videoId: null,
  };

  const SEL = {
    flexy: ['ytd-watch-flexy[flexy]', 'ytd-watch-flexy'],
    secondaryInner: ['#secondary-inner.style-scope.ytd-watch-flexy'],
    related: ['#related.ytd-watch-flexy', '#related'],
    comments: ['#comments'],
    infoBlock: ['ytd-expandable-video-description-body-renderer', 'ytd-expander#expander'],
    rightControls: ['.ytp-right-controls'],
    player: ['#movie_player'],
    sizeBtn: ['#ytd-player .ytp-size-button', '.ytp-size-button'],
    ytcApp: ['ytd-app'],
    playlistPanel: ['ytd-playlist-panel-renderer#playlist'],
    transcriptPanel: ['ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]'],
  };
  const $first = (candidates) => {
    for (const sel of candidates) { const el = document.querySelector(sel); if (el) return el; }
    return null;
  };

  /********************************************************************
   * Styles (compact, theme-aware, accessible tabs)
   ********************************************************************/
  GM_addStyle(`
    :root {
      --de-rounded: ${state.settings.ui.rounded}px;
    }
    #de-right-tabs { display:flex; flex-direction:column; gap:0; border:1px solid var(--ytd-searchbox-legacy-border-color); border-radius: var(--de-rounded); overflow:hidden; }
    #de-tabs-bar { display:flex; align-items:stretch; border-bottom:1px solid var(--ytd-searchbox-legacy-border-color); }
    #de-tabs-bar button[role="tab"]{
      flex:1 1 0;
      padding:${state.settings.ui.compactHeader ? '8px 6px' : '12px 10px'};
      background: var(--ytd-searchbox-legacy-button-color);
      color: var(--yt-spec-text-secondary);
      border:0; border-right:1px solid var(--ytd-searchbox-legacy-border-color);
      text-transform:var(--yt-button-text-transform, none);
      cursor:pointer; outline: none;
    }
    #de-tabs-bar button[role="tab"]:last-child{ border-right:0; }
    #de-tabs-bar button[aria-selected="true"]{
      background: var(--ytd-searchbox-legacy-button-focus-color);
      color: var(--yt-spec-text-primary);
      box-shadow: inset 0 -2px var(--yt-brand-light-red);
    }
    #de-tabs-body { position:relative; height:100%; }
    .de-tabpane { display:none; padding: var(--ytd-margin-4x); }
    .de-tabpane[aria-hidden="false"]{ display:block; }
    #de-speed-btn {
      width: 3.5em; text-align:center; font-size:12px; border-radius:8px; cursor:pointer;
    }
    #de-speed-menu{
      position:absolute; bottom:calc(100% + 10px); right:0; background:#303031; color:#fff;
      border-radius:6px; display:none; min-width:56px; z-index:99999;
    }
    #de-speed-menu .opt{ padding:6px 8px; cursor:pointer; text-align:center; }
    #de-speed-menu .opt.active, #de-speed-menu .opt:hover{ font-weight:600; }
    #de-speed-toast{
      position:absolute; inset:0; margin:auto; width:80px; height:80px; line-height:80px;
      background:#303031; color:#f3f3f3; font-size:30px; border-radius:20px; text-align:center;
      opacity:.9; display:none; z-index:9999999;
    }
    .de-gear { margin-left:auto; padding:0 8px; cursor:pointer; }
    .de-settings {
      position:fixed; inset:auto 16px 16px auto; width:320px; max-width:90vw;
      background:var(--yt-spec-brand-background-primary); color:var(--yt-spec-text-primary);
      border:1px solid var(--ytd-searchbox-legacy-border-color); border-radius:12px; padding:12px;
      box-shadow:0 10px 24px rgba(0,0,0,.3); z-index:999999;
      display:none;
    }
    .de-settings h3{ margin:0 0 8px; font-size:16px; }
    .de-row{ display:flex; align-items:center; justify-content:space-between; gap:8px; margin:8px 0; }
    .de-row label{ font-size:13px; }
    .de-shortcut{ width:140px; }
    [data-de-hidden="true"]{ display:none !important; }
  `);

  /********************************************************************
   * Core DOM build
   ********************************************************************/
  const Tabs = (() => {
    const ids = ['#tab-info', '#tab-comments', '#tab-videos', '#tab-transcript'];
    const pretty = { '#tab-info':'Info', '#tab-comments':'Comments', '#tab-videos':'Videos', '#tab-transcript':'Transcript' };

    function buildContainer() {
      const wrap = document.createElement('div');
      wrap.id = 'de-right-tabs';

      const bar = document.createElement('div');
      bar.id = 'de-tabs-bar';
      bar.setAttribute('role','tablist');
      wrap.append(bar);

      const gear = document.createElement('button');
      gear.type='button'; gear.className='de-gear'; gear.title='Settings'; gear.textContent='⚙︎';
      gear.addEventListener('click', Settings.toggle);
      bar.append(gear);

      const body = document.createElement('div');
      body.id = 'de-tabs-body';
      wrap.append(body);

      // panes
      for (const id of ids) {
        const pane = document.createElement('div');
        pane.id = id.slice(1);
        pane.className = 'de-tabpane';
        pane.setAttribute('role','tabpanel');
        pane.setAttribute('aria-hidden','true');
        body.append(pane);
      }

      // tabs (insert before gear)
      for (const id of ids) {
        if (id === '#tab-transcript' && !state.settings.features.transcriptTab) continue;
        const btn = document.createElement('button');
        btn.type='button';
        btn.setAttribute('role','tab');
        btn.setAttribute('aria-controls', id.slice(1));
        btn.dataset.deTabTarget = id;
        btn.textContent = pretty[id];
        btn.addEventListener('click', () => switchTo(id));
        bar.insertBefore(btn, gear);
      }
      return wrap;
    }

    function switchTo(id) {
      // Save previous scroll
      if (state.currentTab && state.settings.features.scrollRestore) {
        const oldPane = document.querySelector(state.currentTab);
        if (oldPane) state.scrollCache[state.currentTab] = oldPane.scrollTop || 0;
      }
      // Update pane visibility
      for (const pane of document.querySelectorAll('.de-tabpane')) {
        const active = `#${pane.id}` === id;
        pane.setAttribute('aria-hidden', String(!active));
        pane.hidden = !active;
        if (active && state.settings.features.scrollRestore) {
          const sc = state.scrollCache[id] || 0;
          pane.scrollTop = sc;
        }
      }
      // Update tabs aria
      for (const btn of document.querySelectorAll('#de-tabs-bar [role="tab"]')) {
        btn.setAttribute('aria-selected', String(btn.dataset.deTabTarget === id));
      }
      state.currentTab = id;
      if (state.settings.features.lastTabRestore) persistLastTab();
    }

    function ensureInSecondary(container) {
      const secondaryInner = $first(SEL.secondaryInner);
      if (!secondaryInner) return false;

      // Wrap in absolute column container (no layout shift in 2-column mode)
      container.style.marginTop = 'var(--ytd-margin-3x)';
      if (!secondaryInner.querySelector('#de-right-tabs')) {
        // Ensure the wrapper container for proper height behavior
        let wrapper = secondaryInner.querySelector('secondary-wrapper');
        if (!wrapper) {
          wrapper = document.createElement('secondary-wrapper');
          // Move all children into wrapper to keep YouTube logic intact
          while (secondaryInner.firstChild) wrapper.appendChild(secondaryInner.firstChild);
          secondaryInner.appendChild(wrapper);
        }
        // Place our tabs at the top
        wrapper.insertBefore(container, wrapper.firstChild);
      }
      return true;
    }

    function mount() {
      if (document.getElementById('de-right-tabs')) return true;
      const box = buildContainer();
      return ensureInSecondary(box);
    }

    function persistLastTab() {
      const payload = {
        tabId: state.currentTab,
        scroll: state.settings.features.scrollRestore ? state.scrollCache : {},
        videoId: state.videoId || null
      };
      GM_setValue(SKEY.LAST, JSON.stringify(payload));
    }

    function restoreLastTab() {
      if (!state.settings.features.lastTabRestore) return;
      try {
        const raw = GM_getValue(SKEY.LAST, '');
        if (!raw) return switchTo('#tab-videos');
        const obj = JSON.parse(raw);
        // If video changed, prefer Info tab; else restore last tab
        const id = (obj && obj.videoId === state.videoId && obj.tabId) ? obj.tabId : '#tab-videos';
        state.scrollCache = obj.scroll || state.scrollCache;
        switchTo(id);
      } catch {
        switchTo('#tab-videos');
      }
    }

    return { mount, switchTo, restoreLastTab };
  })();

  /********************************************************************
   * Settings panel + GM menu
   ********************************************************************/
  const Settings = (() => {
    let panel = null;

    function open() {
      if (!panel) build();
      panel.style.display = 'block';
    }
    function close() {
      if (panel) panel.style.display = 'none';
    }
    function toggle() { (panel && panel.style.display === 'block') ? close() : open(); }

    function saverefresh() {
      store.set(state.settings);
    }

    function build() {
      panel = document.createElement('div');
      panel.className = 'de-settings';
      panel.innerHTML = `
        <h3>Youtube Enhancer – Settings</h3>
        <div class="de-row">
          <label><input type="checkbox" data-k="features.speedControl"> Speed control</label>
        </div>
        <div class="de-row">
          <label><input type="checkbox" data-k="features.markAds"> Mark ads</label>
        </div>
        <div class="de-row">
          <label><input type="checkbox" data-k="features.autoExpandDesc"> Auto-expand description</label>
        </div>
        <div class="de-row">
          <label><input type="checkbox" data-k="features.transcriptTab"> Transcript tab</label>
        </div>
        <div class="de-row">
          <label><input type="checkbox" data-k="features.lastTabRestore"> Remember last tab</label>
        </div>
        <div class="de-row">
          <label><input type="checkbox" data-k="features.scrollRestore"> Restore scroll per tab</label>
        </div>
        <div class="de-row">
          <label>Theme</label>
          <select data-k="ui.theme">
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div class="de-row">
          <label>Rounded (px)</label>
          <input type="number" min="0" max="32" data-k="ui.rounded" style="width:64px">
        </div>
        <hr>
        <div><strong>Shortcuts</strong></div>
        <div class="de-row"><label>Go Info</label><input class="de-shortcut" data-k="shortcuts.goInfo"></div>
        <div class="de-row"><label>Go Comments</label><input class="de-shortcut" data-k="shortcuts.goComments"></div>
        <div class="de-row"><label>Go Videos</label><input class="de-shortcut" data-k="shortcuts.goVideos"></div>
        <div class="de-row"><label>Go Transcript</label><input class="de-shortcut" data-k="shortcuts.goTranscript"></div>
        <div class="de-row"><label>Screenshot</label><input class="de-shortcut" data-k="shortcuts.screenshot"></div>
        <div class="de-row"><label>Focus tabs</label><input class="de-shortcut" data-k="shortcuts.focusTabs"></div>
        <div style="text-align:right; margin-top:8px;">
          <button id="de-settings-close">Close</button>
        </div>
      `;
      document.body.append(panel);

      // bind
      panel.querySelector('#de-settings-close').addEventListener('click', close);

      for (const input of panel.querySelectorAll('[data-k]')) {
        const path = input.dataset.k.split('.');
        // set initial
        let ref = state.settings;
        for (let i=0;i<path.length-1;i++) ref = ref[path[i]];
        const key = path[path.length-1];
        if (input.type === 'checkbox') input.checked = !!ref[key];
        else input.value = ref[key];

        input.addEventListener('change', () => {
          let r = state.settings;
          for (let i=0;i<path.length-1;i++) r = r[path[i]];
          r[key] = (input.type === 'checkbox') ? input.checked : (input.classList.contains('de-shortcut') ? input.value.trim() : (input.type==='number' ? Number(input.value) : input.value));
          saverefresh();
          if (key === 'rounded') document.documentElement.style.setProperty('--de-rounded', `${state.settings.ui.rounded}px`);
        });
      }
    }

    GM_registerMenuCommand('Open settings', open);
    return { open, close, toggle };
  })();

  /********************************************************************
   * Speed control
   ********************************************************************/
  const Speed = (() => {
    let btn, menu, toast, current = Number(GM_getValue(SKEY.SPEED_GLOBAL, 1)) || 1;

    const list = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];

    function mount() {
      if (!state.settings.features.speedControl) return;
      const rc = $first(SEL.rightControls);
      if (!rc || rc.querySelector('#de-speed-btn')) return;

      btn = document.createElement('div'); btn.id = 'de-speed-btn'; btn.className = 'ytp-button';
      btn.textContent = `${current.toFixed(2).replace(/\.00$/,'')}×`;
      btn.style.position='relative';

      menu = document.createElement('div'); menu.id = 'de-speed-menu';
      for (const v of list) {
        const opt = document.createElement('div');
        opt.className = 'opt' + (v===current?' active':'');
        opt.textContent = `${v}x`;
        opt.dataset.v = String(v);
        opt.addEventListener('click', () => setRate(v, true));
        menu.append(opt);
      }
      btn.append(menu);

      btn.addEventListener('mouseenter', ()=> menu.style.display='block');
      btn.addEventListener('mouseleave', ()=> menu.style.display='none');

      toast = document.createElement('div'); toast.id = 'de-speed-toast';
      const player = $first(SEL.player) || document.body;
      player.appendChild(toast);

      rc.prepend(btn);
      applyToCurrentVideo(current);
    }

    function setRate(v, persist=false) {
      current = v;
      btn && (btn.firstChild.nodeType===3) && (btn.firstChild.nodeValue = `${v}×`);
      for (const x of menu.querySelectorAll('.opt')) x.classList.toggle('active', Number(x.dataset.v)===v);
      showToast(`${v}×`);
      applyToCurrentVideo(v);
      if (persist) {
        if (state.settings.features.rememberSpeedByChannel && state.channelId) {
          GM_setValue(SKEY.SPEED_BY_CHANNEL(state.channelId), String(v));
        } else {
          GM_setValue(SKEY.SPEED_GLOBAL, String(v));
        }
      }
    }

    function showToast(text) {
      if (!toast) return;
      toast.textContent = text;
      toast.style.display='block';
      toast.style.opacity='0.9';
      requestAnimationFrame(()=>{
        setTimeout(()=> toast && (toast.style.display='none'), 1200);
      });
    }

    function applyToCurrentVideo(v) {
      const set = () => {
        const vid = document.querySelector('video');
        if (vid) vid.playbackRate = v;
      };
      set();
      // If YT swaps src, keep rate
      const iv = setInterval(()=>{
        const vid = document.querySelector('video');
        if (!vid) return;
        clearInterval(iv);
        const mo = new MutationObserver((m)=>{
          for (const mu of m) if (mu.attributeName==='src') set();
        });
        mo.observe(vid, { attributes:true });
      }, 1000);
    }

    function loadPreferred() {
      if (state.settings.features.rememberSpeedByChannel && state.channelId) {
        const ch = Number(GM_getValue(SKEY.SPEED_BY_CHANNEL(state.channelId), current));
        current = ch || current;
      } else {
        current = Number(GM_getValue(SKEY.SPEED_GLOBAL, current)) || current;
      }
    }

    return { mount, setRate, loadPreferred };
  })();

  /********************************************************************
   * Keyboard shortcuts
   ********************************************************************/
  const Shortcuts = (() => {
    const parseCombo = (s) => s.trim().toLowerCase();
    const matches = (evt, combo) => {
      if (!combo) return false;
      const parts = combo.split('+').map(x=>x.trim());
      const needCtrl = parts.includes('ctrl');
      const needShift = parts.includes('shift');
      const needAlt = parts.includes('alt');
      const key = parts[parts.length-1];
      const pressedKey = evt.key?.toLowerCase();
      return (!!evt.ctrlKey===needCtrl) && (!!evt.shiftKey===needShift) && (!!evt.altKey===needAlt) && (pressedKey===key);
    };

    let glueMode = false; // for "g i" style combos
    let glueTimer = 0;

    function onKeydown(evt) {
      const sc = state.settings.shortcuts;
      // single combos
      if (matches(evt, parseCombo(sc.screenshot))) { evt.preventDefault(); Screenshot.capture(); return; }
      if (matches(evt, parseCombo(sc.focusTabs))) {
        evt.preventDefault();
        document.querySelector('#de-tabs-bar [role="tab"]')?.focus();
        return;
      }
      // leader "g"
      if (evt.key.toLowerCase()==='g' && !evt.ctrlKey && !evt.shiftKey && !evt.altKey) {
        glueMode = true;
        clearTimeout(glueTimer);
        glueTimer = setTimeout(()=> glueMode=false, 850);
        return;
      }
      if (glueMode) {
        if (evt.key.toLowerCase()==='i') { glueMode=false; Tabs.switchTo('#tab-info'); }
        else if (evt.key.toLowerCase()==='c') { glueMode=false; Tabs.switchTo('#tab-comments'); }
        else if (evt.key.toLowerCase()==='v') { glueMode=false; Tabs.switchTo('#tab-videos'); }
        else if (evt.key.toLowerCase()==='t') { glueMode=false; Tabs.switchTo('#tab-transcript'); }
      }
    }

    function init() {
      window.addEventListener('keydown', onKeydown, true);
    }
    return { init };
  })();

  /********************************************************************
   * Screenshot
   ********************************************************************/
  const Screenshot = (() => {
    function sanitize(name) {
      return name.replace(/[\\/:*?"<>|]+/g,' ').slice(0,150).trim();
    }
    function titleStamp() {
      const h1 = document.querySelector('h1.title') || document.querySelector('h1.ytd-watch-metadata');
      const t = h1 ? (h1.textContent||'').trim() : 'YouTube';
      const vid = document.querySelector('video');
      let stamp = '0-00';
      if (vid) {
        const ct = Math.floor(vid.currentTime||0);
        const m = Math.floor(ct/60), s = ct%60;
        stamp = `${m}-${s.toString().padStart(2,'0')}`;
      }
      return `${sanitize(t)} ${stamp} screenshot.png`;
    }
    function capture() {
      const v = document.querySelector('video');
      if (!v) return;
      const canvas = document.createElement('canvas');
      canvas.width = v.videoWidth; canvas.height = v.videoHeight;
      canvas.getContext('2d').drawImage(v,0,0,canvas.width,canvas.height);
      canvas.toBlob((blob)=>{
        const a = document.createElement('a');
        a.download = titleStamp();
        a.href = URL.createObjectURL(blob);
        a.click();
        URL.revokeObjectURL(a.href);
      }, 'image/png');
    }
    return { capture };
  })();

  /********************************************************************
   * Ad marking (visual only, low risk)
   ********************************************************************/
  const Ads = (() => {
    const CSS = `
      #masthead-ad, ytd-ad-slot-renderer, ytd-display-ad-renderer, .video-ads.ytp-ad-module,
      ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"],
      #related #player-ads, #related ytd-ad-slot-renderer, ad-slot-renderer, ytm-companion-ad-renderer {
        outline: 2px dashed #f66 !important; filter: saturate(.6) brightness(.95);
      }
    `;
    let added = false;
    function activate() {
      if (added || !state.settings.features.markAds) return;
      GM_addStyle(CSS); added = true;
    }
    return { activate };
  })();

  /********************************************************************
   * Transcript Tab (toggle engagement panel)
   ********************************************************************/
  const Transcript = (() => {
    function openPanel(show=true) {
      // show/hide via YT actions by clicking the transcript button if present
      const btn = document.querySelector('button[aria-label*="Transcript"], ytd-menu-service-item-download-renderer[is-transcript] button');
      if (btn) { btn.click(); return; }
      // fallback: try to toggle any expanded panel except ours
      // (kept simple to avoid fragile deep calls)
    }
    function ensureTabVisibility() {
      const tab = document.querySelector('#de-tabs-bar [data-de-tab-target="#tab-transcript"]')?.closest('[role="tab"]');
      if (!tab) return;
      tab.parentElement?.parentElement?.querySelector('#tab-transcript')
        ?.setAttribute('data-de-hidden', String(!state.settings.features.transcriptTab));
      tab.setAttribute('data-de-hidden', String(!state.settings.features.transcriptTab));
    }
    return { openPanel, ensureTabVisibility };
  })();

  /********************************************************************
   * Observers: wire up Info / Comments / Videos into tabs, auto-expand desc
   ********************************************************************/
  const WireUp = (() => {

    function moveIfPresent(selList, targetPaneSelector) {
      const pane = document.querySelector(targetPaneSelector);
      if (!pane) return;
      const el = $first(selList);
      if (el && !pane.contains(el)) {
        pane.append(el);
      }
    }

    async function run() {
      // Wait flexy
      for (let i=0; i<60; i++){
        const flexy = $first(SEL.flexy);
        if (flexy) break; // ok
        await sleep(250);
      }

      // Build right tabs and mount
      Tabs.mount();

      // Move known blocks when they appear
      const mo = new MutationObserver(()=>{
        moveIfPresent(SEL.infoBlock, '#tab-info');
        moveIfPresent(SEL.comments, '#tab-comments');
        moveIfPresent(SEL.related, '#tab-videos');
        if (state.settings.features.transcriptTab) {
          const tp = $first(SEL.transcriptPanel);
          if (tp) document.querySelector('#tab-transcript')?.append(tp);
        }
      });
      mo.observe(document, { subtree:true, childList:true });

      // Auto-expand description (where supported)
      if (state.settings.features.autoExpandDesc) {
        const tryExpand = () => {
          const more = document.querySelector('#expand, tp-yt-paper-button[aria-label*="more"], #description tp-yt-paper-button[aria-label*="more"]');
          if (more) more.click();
        };
        tryExpand();
        setTimeout(tryExpand, 1000);
      }

      Speed.loadPreferred();
      Speed.mount();
      Ads.activate();
      Transcript.ensureTabVisibility();

      // Identify video & channel ids (best-effort)
      try {
        const app = $first(SEL.ytcApp);
        const data = app?.__data?.data?.response || app?.data?.response || null;
        state.videoId = document.querySelector('ytd-watch-flexy')?.__data?.playerResponse?.videoDetails?.videoId
                      || new URL(location.href).searchParams.get('v') || null;
        state.channelId = data?.contents?.twoColumnWatchNextResults?.results?.results?.contents
                          ?.find(c=>c.videoSecondaryInfoRenderer)?.videoSecondaryInfoRenderer?.owner?.videoOwnerRenderer?.navigationEndpoint?.browseEndpoint?.browseId || null;
      } catch {}

      Tabs.restoreLastTab();
    }

    return { run };
  })();

  /********************************************************************
   * Theme (system / light / dark)
   ********************************************************************/
  const Theme = (() => {
    function apply() {
      const mode = state.settings.ui.theme;
      // Keep it simple: let YouTube manage its theme; only nudge if set explicitly.
      document.documentElement.removeAttribute('de-theme');
      if (mode==='light') document.documentElement.setAttribute('de-theme', 'light');
      else if (mode==='dark') document.documentElement.setAttribute('de-theme', 'dark');
      // (If you want a cookie-based PREF hack, we can add it, but it’s invasive.)
    }
    return { apply };
  })();

  /********************************************************************
   * Bootstrap
   ********************************************************************/
  function init() {
    // Apply theme CSS var
    document.documentElement.style.setProperty('--de-rounded', `${state.settings.ui.rounded}px`);
    Theme.apply();
    Shortcuts.init();
    onReady(() => {
      WireUp.run();
    });
  }

  init();
})();
