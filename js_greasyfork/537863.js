// ==UserScript==
// @name         Facebook Enhancer v3.32 (Tweaked)
// @namespace    https://github.com/TamperMonkeyDevelopment/TamperMonkeyScripts
// @version      3.32
// @description  Hide/soft-remove Reels, Stories, Suggestions, PYMK, right-rail ads; pause/mute videos; unwrap links on click; keyword+regex filters; sticky 'Most Recent'; draggable settings panel (position save) + import/export; blur/review/show-hidden modes; per-post "Hide posts like this" control; hotkeys; throttled observer; locale-aware 'Sponsored'.
// @author       Eliminater74 (with tweaks by Gemini)
// @match        *://*.facebook.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/537863/Facebook%20Enhancer%20v332%20%28Tweaked%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537863/Facebook%20Enhancer%20v332%20%28Tweaked%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // -----------------------
  // Storage / Defaults
  // -----------------------
  const STORAGE_KEY = 'fb-enhancer-settings';
  const POS_KEY = 'fb-enhancer-positions';

  // NEW: Brittle selectors moved to the top for easy maintenance
  const SELECTORS = {
    mostRecentLink: 'a[href*="sk=h_chr"]',
    article: '[role="article"]',
    video: 'video:not([data-fb-enhanced="v"])',
    storiesModule: 'div[aria-label="Stories"], div[data-pagelet*="Stories"]',
    reelLink: 'a[href*="/reel/"], a[href*="/reels/"]',
    reelsTab: 'a[href*="/reels/"][role="link"]',
    rightRail: 'div[data-pagelet*="RightRail"]',
    commentButton: 'div[role="button"]',
    addFriendButton: 'button[aria-label*="Add Friend"]',
    pymkText: 'people you may know',
    gaming: 'div[data-pagelet*="Gaming"], a[href*="/gaming/"]',
    createRoom: 'div[data-pagelet*="VideoChatHomeUnit"]'
  };

  const defaultSettings = {
    // General / Visual
    debugMode: false,
    softRemove: true,        // display:none instead of remove()
    blurHidden: false,       // visually blur hidden instead of hide/remove
    reviewMode: false,       // outline hidden items for debugging
    showHidden: false,       // temporarily show items we hid (softRemove only)
    forceDarkMode: false,
    customCSS: '',

    // Feed & Hiding
    blockSponsored: true,
    blockSuggested: true,
    hideReels: true,
    hideReelLinks: true,      // remove any unit that links to /reel/ or /reels/
    hideReelsTab: true,       // Hide Reels from the left sidebar
    aggressiveReelsBlock: true, // broader heuristics (video-count etc.)
    reelsHeadingPhrases: 'reels,reels and short videos,short videos',
    hideStories: true,
    hidePeopleYouMayKnow: true,
    hideRightRailAds: true,
    hideGaming: false,        // Hide Gaming tabs/units
    hideCreateRoom: true,     // Hide "Create Room" / Video Chat units
    keywordFilter: 'kardashian,tiktok,reaction',
    keywordRegex: '',

    // Video
    disableAutoplay: true,
    muteVideos: true,

    // Navigation / Sidebar
    toggleMarketplace: false,
    toggleEvents: false,
    toggleShortcuts: false,

    // Behavior
    unwrapLinks: true,        // rewrite tracking URLs on click
    unwrapOnHover: false,     // (safer off)
    autoExpandComments: true,
    forceMostRecentFeed: true,
    mostRecentRetryMs: 4000,

    // Hotkeys
    gearHotkey: 'Alt+E',
    forceMostRecentHotkey: 'Alt+R',
    showHiddenHotkey: 'Alt+H'
  };

  let settings = loadSettings();
  const positions = loadPositions();

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Object.assign({}, defaultSettings, saved || {});
    } catch {
      return { ...defaultSettings };
    }
  }
  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applyVisualModes();
  }
  function loadPositions() {
    try {
      return JSON.parse(localStorage.getItem(POS_KEY)) || {};
    } catch {
      return {};
    }
  }
  function savePositions() {
    localStorage.setItem(POS_KEY, JSON.stringify(positions));
  }

  // -----------------------
  // Utilities
  // -----------------------
  const log = (...args) => settings.debugMode && console.log('[FB Enhancer]', ...args);

  const throttle = (fn, ms) => {
    let last = 0, timer;
    return (...args) => {
      const now = Date.now();
      if (now - last >= ms) {
        last = now;
        fn(...args);
      } else {
        clearTimeout(timer);
        timer = setTimeout(() => {
          last = Date.now();
          fn(...args);
        }, ms - (now - last));
      }
    };
  };

  // -----------------------
  // CSS
  // -----------------------
  GM_addStyle(`
    .fb-enhancer-btn { position:fixed; top:60px; right:10px; background:#4267B2; color:#fff; padding:6px 10px;
      border-radius:6px; z-index:999999; cursor:pointer; font-weight:bold; user-select:none; }
    .fb-enhancer-panel { position:fixed; top:110px; right:10px; z-index:999999; background:#fff; color:#111;
      padding:10px; width:340px; max-height:70vh; overflow:auto; border:1px solid #ccc; border-radius:8px; font-size:14px; display:none; }
    .fb-enhancer-panel h3 { margin: 0 0 8px; }
    .fb-enhancer-group { margin:8px 0; padding:8px; border:1px dashed #ddd; border-radius:6px; }
    .fb-enhancer-row { display:flex; align-items:center; gap:8px; margin:6px 0; }
    .fb-enhancer-row label { flex: 1; }
    .fb-enhancer-actions { margin-top:8px; display:flex; gap:8px; flex-wrap:wrap; }

    html.fb-dark-mode { filter: invert(1) hue-rotate(180deg); } /* cheap global dark flip */
    html.fb-dark-mode img, html.fb-dark-mode video { filter: invert(1) hue-rotate(180deg); }

    .fe-blur { filter: blur(10px) opacity(.35); pointer-events:none; }
    .fe-review { outline: 2px dashed #f36 !important; position: relative; }
    .fe-review::after {
      content: 'FB Enhancer: hidden';
      position: absolute; top: -10px; left: -2px; font-size: 11px;
      background: #f36; color: #fff; padding: 0 4px; border-radius: 3px;
    }
    body.fe-show-hidden [data-fbEnhanced="1"] { display: initial !important; visibility: visible !important; }

    /* Per-post control */
    .fe-hide-btn {
      position:absolute; top:6px; right:6px; z-index:9999; font-size:12px;
      background:rgba(66,103,178,.95); color:#fff; border:none; border-radius:4px; padding:3px 6px;
      cursor:pointer; display:none;
    }
    [role="article"]:hover .fe-hide-btn { display:block; }
  `);

  // -----------------------
  // Visual Modes / Custom CSS
  // -----------------------
  function applyCustomCSS() {
    const id = 'fb-enhancer-custom-style';
    document.getElementById(id)?.remove();
    if (settings.customCSS) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = settings.customCSS;
      document.head.appendChild(style);
    }
  }
  function applyVisualModes() {
    // Dark
    if (settings.forceDarkMode) document.documentElement.classList.add('fb-dark-mode');
    else document.documentElement.classList.remove('fb-dark-mode');

    // Show hidden
    document.body.classList.toggle('fe-show-hidden', !!settings.showHidden);
  }

  // -----------------------
  // UI: Gear + Panel
  // -----------------------
  const ui = { btn: null, panel: null, toggle() { ui.panel.style.display = ui.panel.style.display === 'none' ? 'block' : 'none'; } };

  function addRow(container, key, label, type = 'boolean', placeholder = '') {
    const row = document.createElement('div');
    row.className = 'fb-enhancer-row';
    const id = `fe_${key}`;
    if (type === 'boolean') {
      row.innerHTML = `<label><input type="checkbox" id="${id}" ${settings[key] ? 'checked' : ''}/> ${label}</label>`;
    } else {
      row.innerHTML = `<label>${label}</label><input type="text" id="${id}" value="${settings[key] ?? ''}" placeholder="${placeholder}" style="flex:2;">`;
    }
    container.appendChild(row);
    return id;
  }

  function createSettingsMenu() {
    // Button
    const button = document.createElement('div');
    button.textContent = '⚙ Enhancer';
    button.className = 'fb-enhancer-btn';
    button.id = 'fb-enhancer-toggle';

    // Panel
    const panel = document.createElement('div');
    panel.id = 'fb-enhancer-panel';
    panel.className = 'fb-enhancer-panel';

    const root = document.createElement('div');
    root.innerHTML = `<h3>Facebook Enhancer</h3>`;

    // Groups
    const gGeneral = document.createElement('div'); gGeneral.className = 'fb-enhancer-group';
    gGeneral.innerHTML = `<strong>General / Visual</strong>`;
    addRow(gGeneral, 'debugMode', 'Enable debug logs');
    addRow(gGeneral, 'softRemove', 'Soft remove (display:none) instead of remove()');
    addRow(gGeneral, 'blurHidden', 'Blur hidden items (reviewable)');
    addRow(gGeneral, 'reviewMode', 'Outline hidden items (debug)');
    addRow(gGeneral, 'showHidden', 'Temporarily show hidden items');
    addRow(gGeneral, 'forceDarkMode', 'Force Dark Mode (CSS invert)');
    addRow(gGeneral, 'customCSS', 'Custom CSS', 'text', '/* your CSS here */');

    const gFeed = document.createElement('div'); gFeed.className = 'fb-enhancer-group';
    gFeed.innerHTML = `<strong>Feed & Hiding</strong>`;
    addRow(gFeed, 'blockSponsored', 'Hide Sponsored posts');
    addRow(gFeed, 'blockSuggested', 'Hide Suggested for you');
    addRow(gFeed, 'hideReels', 'Hide Reels modules');
    addRow(gFeed, 'hideReelLinks', 'Hide units that contain /reel/ links');
    addRow(gFeed, 'hideReelsTab', 'Hide Reels Tab (Sidebar)');
    addRow(gFeed, 'aggressiveReelsBlock', 'Aggressive Reels heuristics');
    addRow(gFeed, 'reelsHeadingPhrases', 'Reels heading phrases (comma)', 'text', 'reels,reels and short videos,short videos');
    addRow(gFeed, 'hideStories', 'Hide Stories');
    addRow(gFeed, 'hidePeopleYouMayKnow', 'Hide People You May Know');
    addRow(gFeed, 'hideRightRailAds', 'Hide Right Rail Ads');
    addRow(gFeed, 'hideGaming', 'Hide Gaming sections/links');
    addRow(gFeed, 'hideCreateRoom', 'Hide "Create Room" banner');
    addRow(gFeed, 'keywordFilter', 'Keyword filter (comma-separated)', 'text', 'kardashian,tiktok,reaction');
    addRow(gFeed, 'keywordRegex', 'Keyword Regex (optional)', 'text', '(giveaway|crypto)\\b');

    const gVideo = document.createElement('div'); gVideo.className = 'fb-enhancer-group';
    gVideo.innerHTML = `<strong>Video</strong>`;
    addRow(gVideo, 'disableAutoplay', 'Disable autoplay');
    addRow(gVideo, 'muteVideos', 'Mute videos');

    const gNav = document.createElement('div'); gNav.className = 'fb-enhancer-group';
    gNav.innerHTML = `<strong>Navigation / Sidebar</strong>`;
    addRow(gNav, 'toggleMarketplace', 'Hide Marketplace');
    addRow(gNav, 'toggleEvents', 'Hide Events');
    addRow(gNav, 'toggleShortcuts', 'Hide Your Shortcuts');

    const gBehavior = document.createElement('div'); gBehavior.className = 'fb-enhancer-group';
    gBehavior.innerHTML = `<strong>Behavior</strong>`;
    addRow(gBehavior, 'unwrapLinks', 'Unwrap tracking links on click');
    addRow(gBehavior, 'unwrapOnHover', 'Unwrap on hover (riskier—leave off)');
    addRow(gBehavior, 'autoExpandComments', 'Auto-expand comments');
    addRow(gBehavior, 'forceMostRecentFeed', 'Force Most Recent feed');
    addRow(gBehavior, 'mostRecentRetryMs', 'Most Recent retry (ms)', 'text', '4000');

    const gHotkeys = document.createElement('div'); gHotkeys.className = 'fb-enhancer-group';
    gHotkeys.innerHTML = `<strong>Hotkeys</strong>`;
    addRow(gHotkeys, 'gearHotkey', 'Toggle panel hotkey', 'text', 'Alt+E');
    addRow(gHotkeys, 'forceMostRecentHotkey', 'Force Most Recent hotkey', 'text', 'Alt+R');
    addRow(gHotkeys, 'showHiddenHotkey', 'Toggle "Show Hidden" hotkey', 'text', 'Alt+H');

    root.append(gGeneral, gFeed, gVideo, gNav, gBehavior, gHotkeys);

    const actions = document.createElement('div');
    actions.className = 'fb-enhancer-actions';
    actions.innerHTML = `
      <button id="fe-save">Save</button>
      <button id="fe-reset">Reset</button>
      <button id="fe-export">Export</button>
      <button id="fe-import">Import</button>
    `;
    root.appendChild(actions);

    panel.appendChild(root);
    document.body.append(button, panel);

    restorePosition(button, 'gear');
    restorePosition(panel, 'panel');

    button.onclick = () => ui.toggle();
    makeDraggable(button, 'gear');
    makeDraggable(panel, 'panel');

    document.getElementById('fe-save').onclick = () => {
      const collect = (key) => {
        const el = document.getElementById(`fe_${key}`);
        if (!el) return;
        if (el.type === 'checkbox') settings[key] = el.checked;
        else {
          const val = el.value;
          if (key === 'mostRecentRetryMs') settings[key] = Math.max(1000, parseInt(val || '4000', 10) || 4000);
          else settings[key] = val;
        }
      };
      Object.keys(defaultSettings).forEach(collect);
      saveSettings();
      applyCustomCSS();
      alert('Settings saved. Reloading…');
      location.reload();
    };

    document.getElementById('fe-reset').onclick = () => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(POS_KEY);
      alert('Settings reset. Reloading…');
      location.reload();
    };

    document.getElementById('fe-export').onclick = () => {
      const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), { href: url, download: 'fb-enhancer-settings.json' });
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    };

    document.getElementById('fe-import').onclick = () => {
      const input = document.createElement('input');
      input.type = 'file'; input.accept = 'application/json';
      input.onchange = () => {
        const file = input.files && input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const obj = JSON.parse(reader.result);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.assign({}, defaultSettings, obj)));
            alert('Imported. Reloading…'); location.reload();
          } catch { alert('Invalid JSON.'); }
        };
        reader.readAsText(file);
      };
      input.click();
    };

    ui.btn = button;
    ui.panel = panel;

    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('Toggle Enhancer Panel', () => ui.toggle());
      GM_registerMenuCommand('Export Settings', () => document.getElementById('fe-export').click());
      GM_registerMenuCommand('Import Settings', () => document.getElementById('fe-import').click());
      GM_registerMenuCommand('Toggle Show Hidden', () => {
        settings.showHidden = !settings.showHidden; saveSettings();
      });
    }
  }

  function makeDraggable(el, key) {
    let offsetX = 0, offsetY = 0, isDragging = false;
    el.style.position = 'fixed';
    el.addEventListener('mousedown', e => {
      isDragging = true;
      offsetX = e.clientX - el.getBoundingClientRect().left;
      offsetY = e.clientY - el.getBoundingClientRect().top;
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      el.style.left = `${e.clientX - offsetX}px`;
      el.style.top = `${e.clientY - offsetY}px`;
      el.style.right = 'auto';
      el.style.bottom = 'auto';
    });
    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      const rect = el.getBoundingClientRect();
      positions[key] = { left: rect.left, top: rect.top };
      savePositions();
    });
  }
  function restorePosition(el, key) {
    const pos = positions[key];
    if (pos) {
      el.style.left = `${pos.left}px`;
      el.style.top = `${pos.top}px`;
      el.style.right = 'auto';
      el.style.bottom = 'auto';
    }
  }

  // -----------------------
  // Link unwrapping
  // -----------------------
  function unwrapUrl(href) {
    try {
      const u = new URL(href, location.origin);
      if ((u.hostname || '').includes('l.facebook.com') && u.pathname.startsWith('/l.php')) {
        const real = u.searchParams.get('u');
        if (real) return decodeURIComponent(real);
      }
    } catch { }
    return href;
  }
  function installLinkHandlers() {
    if (!settings.unwrapLinks) return;
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const newHref = unwrapUrl(a.getAttribute('href') || '');
      if (newHref && newHref !== a.href) {
        a.setAttribute('href', newHref);
        log('Unwrapped link on click:', newHref);
      }
    }, true);

    if (settings.unwrapOnHover) {
      document.addEventListener('mouseover', e => {
        const a = e.target.closest('a[href]');
        if (!a) return;
        const newHref = unwrapUrl(a.getAttribute('href') || '');
        if (newHref && newHref !== a.href) a.setAttribute('href', newHref);
      }, true);
    }
  }

  // -----------------------
  // Video control
  // -----------------------
  function handleVideo(video) {
    if (video.dataset.fbEnhanced === 'v') return;
    if (settings.muteVideos) video.muted = true;
    if (settings.disableAutoplay) {
      video.removeAttribute('autoplay');
      if (!video.paused) video.pause();
    }
    video.dataset.fbEnhanced = 'v';
  }
  function scanVideos(root = document) {
    root.querySelectorAll(SELECTORS.video).forEach(handleVideo);
  }
  function pauseVideosOffscreen() {
    if (!settings.disableAutoplay) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          document.querySelectorAll('video').forEach(video => {
            const rect = video.getBoundingClientRect();
            const inView = rect.top >= 0 && rect.bottom <= window.innerHeight;
            if (!inView && !video.paused) {
              video.pause();
              log('Paused offscreen video');
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // -----------------------
  // Post filtering
  // -----------------------
  const sponsoredWords = [
    'sponsored', 'publicidad', 'gesponsert', 'sponsorisé', 'patrocinado',
    'patrocinada', 'sponsorizzato', 'gesponsord'
  ];

  function appearsSponsored(el) {
    const text = (el.innerText || el.textContent || '').toLowerCase();
    return sponsoredWords.some(w => text.includes(w));
  }

  function matchesKeyword(text) {
    if (!text) return false;
    const hay = text.toLowerCase();
    const list = (settings.keywordFilter || '')
      .split(',').map(s => s.trim()).filter(Boolean);
    if (list.some(k => hay.includes(k.toLowerCase()))) return true;
    if (settings.keywordRegex) {
      try { return new RegExp(settings.keywordRegex, 'i').test(text); }
      catch { /* invalid regex ignored */ }
    }
    return false;
  }

  function processArticle(article) {
    if (article.dataset.fbEnhanced === 'a') return;
    try {
      const text = (article.innerText || '');
      if (settings.blockSponsored && appearsSponsored(article)) { softOrHardRemove(article); return; }
      if (settings.blockSuggested && /suggested for you/i.test(text)) { softOrHardRemove(article); return; }
      if (matchesKeyword(text)) { softOrHardRemove(article); return; }

      if (settings.autoExpandComments) {
        article.querySelectorAll(SELECTORS.commentButton).forEach(btn => {
          if (/view (more )?comments|replies/i.test(btn.textContent)) btn.click();
        });
      }

      installPerPostHideControl(article);
    } catch (err) { log('Article error:', err); }
    article.dataset.fbEnhanced = 'a';
  }

  function installPerPostHideControl(article) {
    if (article.querySelector('.fe-hide-btn')) return;
    article.style.position = article.style.position || 'relative';
    const btn = document.createElement('button');
    btn.className = 'fe-hide-btn';
    btn.textContent = 'Hide posts like this';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const base = buildKeywordSuggestion((article.innerText || ''));
      const user = prompt('Add keywords (comma-separated). These will be appended to your filter:', base);
      if (!user) return;
      const existing = new Set((settings.keywordFilter || '').split(',')
        .map(s => s.trim()).filter(Boolean).map(s => s.toLowerCase()));
      user.split(',').map(s => s.trim()).filter(Boolean).forEach(k => existing.add(k.toLowerCase()));
      settings.keywordFilter = Array.from(existing).join(',');
      saveSettings();
      runFullSweep(); // Re-run the sweep to hide new keywords
      alert('Added. Filter updated.');
    });
    article.appendChild(btn);
  }

  function buildKeywordSuggestion(text) {
    const stop = new Set(('the,a,an,and,or,for,with,from,that,this,those,these,of,to,at,by,on,in,is,are,was,were,be,been,am,as,it,if,not,no,yes,do,does,did,you,your,me,my,our,we,they,them,he,she,his,her,him,who,what,when,where,why,how,about,into,over,under,more,most,so,just,can,will,up,down,out,get,got,have,has,had'
      + ',http,https,www,com,net,org,facebook,reel,reels,video,watch,like,share,comment').split(','));
    const words = (text.toLowerCase().match(/[a-z0-9]+/g) || [])
      .filter(w => w.length >= 4 && !stop.has(w));
    const freq = new Map();
    for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
    const picks = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([w]) => w);
    return picks.join(',');
  }

  // -----------------------
  // Hide helpers / modes
  // -----------------------
  function softOrHardRemove(el) {
    if (!el || el.dataset.fbEnhanced === '1') return;
    if (settings.blurHidden) {
      el.classList.add('fe-blur');
    } else if (settings.softRemove) {
      el.style.display = 'none';
    } else {
      el.remove();
    }
    if (settings.reviewMode) el.classList.add('fe-review');
    el.dataset.fbEnhanced = '1';
  }

  // -----------------------
  // Reels / Stories / PYMK / Nav
  // -----------------------
  function closestContentContainer(el) {
    return el.closest('div[data-pagelet]') ||
      el.closest(SELECTORS.article) ||
      el.closest('section') ||
      el.closest('div[role="complementary"]') ||
      el;
  }

  function isReelsHeadingText(txt) {
    if (!txt) return false;
    const hay = String(txt).toLowerCase();
    return (settings.reelsHeadingPhrases || '')
      .split(',').map(s => s.trim()).filter(Boolean)
      .some(needle => hay.includes(needle));
  }

  function isLikelyReelsUnit(node) {
    try {
      const text = (node.innerText || node.textContent || '').trim();
      const vids = node.querySelectorAll('video').length;
      if (isReelsHeadingText(text) && vids >= 2) return true;
      const dp = node.getAttribute && (node.getAttribute('data-pagelet') || '');
      if (/Reel|Reels|VideoHome|HomeUnit|video/i.test(dp)) return true;
      if (settings.aggressiveReelsBlock && vids >= 3) return true;
      return false;
    } catch { return false; }
  }

  function hideReels(root = document) {
    if (!settings.hideReels) return;

    // Headings / modules
    root.querySelectorAll('h2, h3, [role="heading"], [aria-label], div[data-pagelet]').forEach(el => {
      const label = el.getAttribute?.('aria-label') || el.textContent || '';
      if (!label) return;
      if (isReelsHeadingText(label) || isLikelyReelsUnit(el)) {
        const box = closestContentContainer(el);
        if (box && box.dataset.fbEnhanced !== '1') {
          softOrHardRemove(box);
          log('Reels module removed');
        }
      }
    });

    // Horizontal scrollers in feed
    root.querySelectorAll('[role="feed"] div').forEach(el => {
      if (el.dataset.fbEnhanced === '1') return;
      if (isLikelyReelsUnit(el)) softOrHardRemove(closestContentContainer(el));
    });

    // Right rail
    root.querySelectorAll(SELECTORS.rightRail).forEach(el => {
      if (el.dataset.fbEnhanced === '1') return;
      if (isLikelyReelsUnit(el)) softOrHardRemove(closestContentContainer(el));
    });
  }

  function hideReelLinksSweep(root = document) {
    if (!settings.hideReelLinks) return;
    root.querySelectorAll(SELECTORS.reelLink).forEach(a => {
      const box = closestContentContainer(a);
      if (box && box.dataset.fbEnhanced !== '1') {
        softOrHardRemove(box);
        log('Reel link unit removed');
      }
    });
  }

  function hideStories(root = document) {
    if (!settings.hideStories) return;
    root.querySelectorAll(SELECTORS.storiesModule).forEach(softOrHardRemove);
  }

  function hidePeopleYouMayKnow(root = document) {
    if (!settings.hidePeopleYouMayKnow) return;
    root.querySelectorAll('[role="feed"] div, [data-pagelet*="PeopleYouMayKnow"]').forEach(block => {
      const text = (block.innerText || '').toLowerCase();
      // More efficient check: has text AND at least one "Add Friend" button
      const hasButtons = !!block.querySelector(SELECTORS.addFriendButton);
      if (text.includes(SELECTORS.pymkText) && hasButtons) softOrHardRemove(block);
    });
  }

  function hideRightRailAds(root = document) {
    if (!settings.hideRightRailAds) return;
    root.querySelectorAll(SELECTORS.rightRail).forEach(node => {
      if (appearsSponsored(node)) softOrHardRemove(node);
    });
  }

  function hideGaming(root = document) {
    if (!settings.hideGaming) return;
    root.querySelectorAll(SELECTORS.gaming).forEach(el => {
      if (el.dataset.fbEnhanced === '1') return;
      softOrHardRemove(closestContentContainer(el));
    });
  }

  function hideCreateRoom(root = document) {
    if (!settings.hideCreateRoom) return;
    root.querySelectorAll(SELECTORS.createRoom).forEach(el => {
      if (el.dataset.fbEnhanced === '1') return;
      softOrHardRemove(el);
    });
  }

  function hideReelsSidebarTab(root = document) {
    if (!settings.hideReelsTab) return;
    root.querySelectorAll(SELECTORS.reelsTab).forEach(el => {
      const li = el.closest('li');
      if (li) softOrHardRemove(li);
      else softOrHardRemove(el);
    });
  }

  function collapseSidebarSections(root = document) {
    const map = {
      toggleMarketplace: 'marketplace',
      toggleEvents: 'events',
      toggleShortcuts: 'your shortcuts'
    };
    for (let key in map) {
      if (!settings[key]) continue;
      const matchText = map[key];
      root.querySelectorAll('span, div').forEach(el => {
        const txt = (el.textContent || '').toLowerCase();
        if (!txt || !txt.includes(matchText)) return;
        const container = el.closest('ul') || el.closest('li') || el.closest('div[role="navigation"]');
        if (container) softOrHardRemove(container);
      });
    }
  }

  // -----------------------
  // Force Most Recent (sticky)
  // -----------------------
  let mostRecentTimer = null;

  // TWEAK 1: Smarter "Force Most Recent" logic
  function forceMostRecent() {
    if (!settings.forceMostRecentFeed) return;

    // 1. Only run on the main homepage
    if (location.pathname !== '/') return;

    // 2. Check if we're already on "Most Recent"
    if (location.search.includes('sk=h_chr')) return;

    // 3. If we're here, we're on the main feed but not on "Most Recent". Find and click the link.
    const link = document.querySelector(SELECTORS.mostRecentLink);
    if (link) {
      link.click();
      log('Forcing Most Recent (was on Top Posts)...');
    }
  }

  function patchHistoryEvents() {
    try {
      const push = history.pushState;
      history.pushState = function () { const r = push.apply(this, arguments); window.dispatchEvent(new Event('pushstate')); return r; };
      const rep = history.replaceState;
      history.replaceState = function () { const r = rep.apply(this, arguments); window.dispatchEvent(new Event('replacestate')); return r; };
    } catch { }
  }

  const debouncedSweep = throttle(runFullSweep, 500); // Debounced sweep for navigation

  function startMostRecentSticky() {
    if (!settings.forceMostRecentFeed) {
      // Still run sweeps on navigation even if "Most Recent" is off
      window.addEventListener('popstate', debouncedSweep);
      window.addEventListener('pushstate', debouncedSweep);
      window.addEventListener('replacestate', debouncedSweep);
      return;
    }

    clearInterval(mostRecentTimer);
    mostRecentTimer = setInterval(forceMostRecent, Math.max(1000, settings.mostRecentRetryMs | 0 || 4000));

    // TWEAK 2: Run a full sweep on navigation events
    window.addEventListener('popstate', debouncedSweep);
    window.addEventListener('pushstate', debouncedSweep);
    window.addEventListener('replacestate', debouncedSweep);

    // Also run the quick "Most Recent" check
    window.addEventListener('popstate', () => setTimeout(forceMostRecent, 350));
    window.addEventListener('pushstate', () => setTimeout(forceMostRecent, 350));
    window.addEventListener('replacestate', () => setTimeout(forceMostRecent, 350));
  }

  // -----------------------
  // Observers (throttled)
  // -----------------------

  // TWEAK 2: New function to scan only new nodes
  function scanNewNodeForHidables(root) {
    if (root.nodeType !== 1) return; // Ensure it's an element

    // Scoped version of hideReels / ReelLinks
    if (settings.hideReels) hideReels(root);
    if (settings.hideReelLinks) hideReelLinksSweep(root);

    // Scoped version of hideStories
    if (settings.hideStories) {
      if (root.matches?.(SELECTORS.storiesModule)) softOrHardRemove(root);
      root.querySelectorAll?.(SELECTORS.storiesModule).forEach(softOrHardRemove);
    }

    // Scoped version of PYMK
    if (settings.hidePeopleYouMayKnow) {
      const text = (root.innerText || '').toLowerCase();
      if (text.includes(SELECTORS.pymkText) && root.querySelector(SELECTORS.addFriendButton)) {
        softOrHardRemove(closestContentContainer(root));
      }
      hidePeopleYouMayKnow(root); // Also run the query-based one
    }

    // Scoped version of Right Rail Ads
    if (settings.hideRightRailAds) {
      if (root.matches?.(SELECTORS.rightRail) && appearsSponsored(root)) softOrHardRemove(root);
      hideRightRailAds(root); // Also run the query-based one
    }

    if (settings.hideGaming) hideGaming(root);
    if (settings.hideCreateRoom) hideCreateRoom(root);
    if (settings.hideReelsTab) hideReelsSidebarTab(root);

    // Scoped version of Sidebar
    collapseSidebarSections(root);
  }

  // TWEAK 2: Simplified observer, only processes new nodes
  const processMutations = throttle((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return; // Not an element

        // Check the node itself
        if (node.matches?.(SELECTORS.article)) processArticle(node);
        if (node.matches?.('video')) handleVideo(node);

        // Scan the new node (and its children) for hidable junk
        scanNewNodeForHidables(node);

        // Check its children (legacy)
        node.querySelectorAll?.(SELECTORS.article).forEach(processArticle);
        node.querySelectorAll?.('video').forEach(handleVideo);
      });
    }
  }, 500);

  function observePage() {
    const mo = new MutationObserver(processMutations);
    mo.observe(document.body, { childList: true, subtree: true });
    // TWEAK 2: Initial pass is removed, will be handled by runFullSweep() in init()
  }

  // TWEAK 2: Replaced old sweepAll with a full-page scan function
  function runFullSweep() {
    log('Running full page sweep...');
    document.querySelectorAll(SELECTORS.article).forEach(a => {
      // Reset state for re-processing, in case filters changed
      a.dataset.fbEnhanced = '';
      processArticle(a);
    });
    scanVideos();
    hideReels();
    hideReelLinksSweep();
    hideStories();
    hidePeopleYouMayKnow();
    hideRightRailAds();
    hideGaming();
    hideCreateRoom();
    hideReelsSidebarTab();
    collapseSidebarSections();
  }

  // -----------------------
  // Hotkeys
  // -----------------------
  function parseHotkey(s) {
    const parts = (s || '').toLowerCase().split('+').map(p => p.trim()).filter(Boolean);
    return {
      alt: parts.includes('alt'),
      ctrl: parts.includes('ctrl') || parts.includes('control'),
      shift: parts.includes('shift'),
      key: parts[parts.length - 1] || ''
    };
  }
  const hkPanel = parseHotkey(settings.gearHotkey);
  const hkMostRecent = parseHotkey(settings.forceMostRecentHotkey);
  const hkShowHidden = parseHotkey(settings.showHiddenHotkey);

  document.addEventListener('keydown', (e) => {
    // Don't run hotkeys if user is typing in an input
    if (e.target.isContentEditable || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const k = e.key.toLowerCase();
    const match = (hk) => (!!hk.alt === e.altKey) && (!!hk.ctrl === e.ctrlKey) && (!!hk.shift === e.shiftKey) && (hk.key === k);
    if (match(hkPanel)) { e.preventDefault(); ui.toggle(); }
    if (match(hkMostRecent)) { e.preventDefault(); forceMostRecent(); }
    if (match(hkShowHidden)) { e.preventDefault(); settings.showHidden = !settings.showHidden; saveSettings(); }
  });

  // -----------------------
  // Init
  // -----------------------
  function init() {
    applyCustomCSS();
    createSettingsMenu();
    applyVisualModes();
    installLinkHandlers();
    observePage(); // Just sets up the observer
    pauseVideosOffscreen();
    patchHistoryEvents();
    startMostRecentSticky(); // Sets up "Most Recent" and navigation sweeps

    // TWEAK 2: Run the first full sweep after everything is set up
    setTimeout(runFullSweep, 500); // Give page a moment to settle
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();