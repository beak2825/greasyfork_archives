// ==UserScript==
// @name         GeoGuessr High Level Ranks
// @version      1.7.2
// @description  Replace 1500+ levels with special ranks
// @match        https://www.geoguessr.com/*
// @icon         https://i.imgur.com/wHQjX4m.png
// @license      MIT
// @run-at       document-idle
// @grant        GM_addStyle
// @namespace https://example.com/
// @downloadURL https://update.greasyfork.org/scripts/547364/GeoGuessr%20High%20Level%20Ranks.user.js
// @updateURL https://update.greasyfork.org/scripts/547364/GeoGuessr%20High%20Level%20Ranks.meta.js
// ==/UserScript==

(function () {
  'use strict';


//--------CHANGE ONLY THESE---------//
  const RECOLOR_TOGGLE = "on";       // <-- Home Page Rank Background Colours (Top Right)
  const SVG_GRADIENT_TOGGLE = "on"; // <-- Waiting For Game Page Background
//----------"on" or "off"-----------//


  const STYLE_ID = 'gg-ranks-style';
  const PROG_STYLE_ID = 'gg-ranks-progress-style';
  const PROG_ELEMENT_ID = 'gg-ranks-overlay';
  const OVERLAY_X_OFFSET = 18;

  const BADGES_DIVISION = [
    { min: 1500, max: 1649, url: 'https://i.imgur.com/aR6fova.png' },
    { min: 1650, max: 1799, url: 'https://i.imgur.com/No26QT6.png' },
    { min: 1800, max: 1999, url: 'https://i.imgur.com/DH3XBSr.png' },
    { min: 2000, max: 2199, url: 'https://i.imgur.com/mTCZKHg.png' },
    { min: 2200, max: Infinity, url: 'https://i.imgur.com/wHQjX4m.png' },
  ];
  const BADGES_MULTIPLAYER = [...BADGES_DIVISION];

  const BADGES_TEAMDUEL = [
    { min: 1350, max: 1399, url: 'https://i.imgur.com/GYUETku.png' },
    { min: 1400, max: 1499, url: 'https://i.imgur.com/QPo1lET.png' },
    { min: 1500, max: 1599, url: 'https://i.imgur.com/QLW7KyP.png' },
    { min: 1600, max: 1699, url: 'https://i.imgur.com/1K4mAXB.png' },
    { min: 1700, max: Infinity, url: 'https://i.imgur.com/rZsaPIw.png' },
  ];

  const TITLES = [
    { min: 1500, max: 1649, label: 'Grand Champion 3' },
    { min: 1650, max: 1799, label: 'Grand Champion 2' },
    { min: 1800, max: 1999, label: 'Grand Champion 1' },
    { min: 2000, max: 2199, label: 'Legend' },
    { min: 2200, max: Infinity, label: 'Eternal' },
  ];
  const TITLES_TEAMDUEL = [
    { min: 1350, max: 1399, label: 'Grand Champion 3' },
    { min: 1400, max: 1499, label: 'Grand Champion 2' },
    { min: 1500, max: 1599, label: 'Grand Champion 1' },
    { min: 1600, max: 1699, label: 'Legend' },
    { min: 1700, max: Infinity, label: 'Eternal' },
  ];

  // ---------------- utils ----------------
  function extractFirstInteger(text) {
    if (!text) return null;
    const cleaned = String(text).replace(/,/g, '').trim();
    const m = cleaned.match(/(\d{2,5})/);
    if (!m) return null;
    const n = parseInt(m[1], 10);
    return Number.isFinite(n) ? n : null;
  }
  function pickForRating(arr, rating) {
    if (rating == null) return null;
    for (const e of arr) if (rating >= e.min && rating <= e.max) return e.url || e.label || null;
    return null;
  }
  function pickTitleForRatingFromArray(arr, rating) {
    if (rating == null) return null;
    for (const t of arr) if (rating >= t.min && rating <= t.max) return t.label;
    return null;
  }

  // ---------------- style helpers ----------------
  let styleEl = null;
  function ensureStyleEl() {
    if (!styleEl) {
      styleEl = document.getElementById(STYLE_ID);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = STYLE_ID;
        document.head && document.head.appendChild(styleEl);
      }
    }
    return styleEl;
  }
  function setHeaderCss(cssText) {
    const s = ensureStyleEl();
    s.textContent = cssText || '';
  }
  function clearHeaderCss() {
    if (styleEl || document.getElementById(STYLE_ID)) {
      const s = styleEl || document.getElementById(STYLE_ID);
      s.textContent = '';
    }
  }

  let progStyleEl = null;
  function ensureProgStyleEl() {
    if (!progStyleEl) {
      progStyleEl = document.getElementById(PROG_STYLE_ID);
      if (!progStyleEl) {
        progStyleEl = document.createElement('style');
        progStyleEl.id = PROG_STYLE_ID;
        document.head && document.head.appendChild(progStyleEl);
      }
    }
    return progStyleEl;
  }
  function setProgressCss(cssText) {
    const s = ensureProgStyleEl();
    s.textContent = cssText || '';
  }

  // ---------------- progress CSS ----------------
  setProgressCss(`
    /* overlay anchored inside header root; will be positioned & sized in JS to align with left column */
    #${PROG_ELEMENT_ID} {
      position: absolute;
      left: 2px;
      bottom: -8px;            /* tweak overlap depth if you want */
      pointer-events: none;
      z-index: 9999;
      display: block;
    }

    /* the visible card — keep transparent background but give a semi-transparent track (the empty bar) */
    #${PROG_ELEMENT_ID} .gg-prog-card {
      pointer-events: none;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 18px 0;
      border-radius: 6px;
      background: transparent;
      box-shadow: none;
      width: 200%;
      box-sizing: border-box;
    }
    /* track: semi-transparent so user requested */
    #${PROG_ELEMENT_ID} .gg-prog-bar {
      height: 10px;
      width: 100%;
      background: rgba(255,255,255,0.08); /* semi-transparent track */
      border-radius: 999px;
      overflow: hidden;
      position: relative;
    }
    /* fill: gradient */
    #${PROG_ELEMENT_ID} .gg-prog-fill {
      height: 100%;
      width: 0%;
      transition: width 450ms ease;
      border-radius: 999px;
      box-shadow: inset 0 -1px 0 rgba(0,0,0,0.12);
      background: linear-gradient(90deg, rgba(255,80,80,0.95), rgba(200,40,40,0.95));
    }
    #${PROG_ELEMENT_ID} .gg-next-icon {
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:4px;
      min-width:44px;
    }
    #${PROG_ELEMENT_ID} .gg-next-icon img {
      width:36px;
      height:36px;
      object-fit:contain;
      border-radius:6px;
      background: none;
      padding: 0;
    }
    #${PROG_ELEMENT_ID} .gg-next-min {
      font-size:12px;
      color: rgba(255,255,255,0.95);
      margin-top:-2px;
      /* use GeoGuessr page font variable if present; otherwise fall back to ggFont or sans-serif */
      font-family: var(--default-font, 'ggFont', sans-serif);
      white-space: nowrap;
      /* user requested: bold + italic slope */
      font-weight: 700;
      font-style: oblique 12deg;
    }

    /* Nudge children inside the left container up a little only when we add the helper class */
    .gg-prog-nudge > * {
      transform: translateY(-17px);
      will-change: transform;
    }

    @media (max-width: 720px) {
      #${PROG_ELEMENT_ID} .gg-next-icon img { width:32px; height:32px; }
      .gg-prog-nudge > * { transform: translateY(-3px); }
    }
  `);

  // ---------------- recolor header ----------------
  function recolorHeader(rating, isTeamDuel = false) {
    if (RECOLOR_TOGGLE.toLowerCase() !== "on") { clearHeaderCss(); return; }

    let background = null;
    let overlay = null;
    let overlayOpacity = 1.0;

    if (isTeamDuel) {
      if (rating >= 1350 && rating <= 1599) {
        background = "linear-gradient(179deg, #8b0000 -3.95%, #ff0000 95.2%)";
        overlay    = "linear-gradient(41deg, #330613, #bf1755)";
        overlayOpacity = 0.7;
      } else if (rating >= 1600 && rating <= 1699) {
        background = "linear-gradient(179deg, #b8860b -3.95%, #ffd700 95.2%)";
        overlay    = "linear-gradient(41deg, #2b1900, #d68940)";
        overlayOpacity = 0.75;
      } else if (rating >= 1700) {
        background = "linear-gradient(179deg, #ffdee3 -3.95%, #ffdbe2 95.2%)";
        overlay    = "linear-gradient(41deg, #5e4d5b, #c2089a)";
        overlayOpacity = 0.6;
      } else { clearHeaderCss(); return; }
    } else {
      if (rating >= 1500 && rating <= 1999) {
        background = "linear-gradient(179deg, #8b0000 -3.95%, #ff0000 95.2%)";
        overlay    = "linear-gradient(41deg, #330613, #bf1755)";
        overlayOpacity = 0.7;
      } else if (rating >= 2000 && rating <= 2199) {
        background = "linear-gradient(179deg, #b8860b -3.95%, #ffd700 95.2%)";
        overlay    = "linear-gradient(41deg, #2b1900, #d68940)";
        overlayOpacity = 0.75;
      } else if (rating >= 2200) {
        background = "linear-gradient(179deg, #ffdee3 -3.95%, #ffdbe2 95.2%)";
        overlay    = "linear-gradient(41deg, #5e4d5b, #c2089a)";
        overlayOpacity = 0.6;
      } else { clearHeaderCss(); return; }
    }

    const css = `
      [class^="division-header_background__"] { background: ${background} !important; }
      [class^="division-header_pattern__"]::before { opacity: 0 !important; }
      [class^="division-header_overlay__"] { background: ${overlay} !important; opacity: ${overlayOpacity} !important; }
    `;
    setHeaderCss(css);
  }

  // ---------------- detection & progress helpers ----------------
  function labelWithDigits(root) {
    if (!root) return null;
    const specific = root.querySelector('label.shared_yellowVariant__XONv8');
    if (specific) return specific;
    const labels = Array.from(root.querySelectorAll('label'));
    return labels.find(l => /\d{2,5}/.test((l.textContent || '').trim())) || null;
  }

  // improved team-duel detection: rating element class containing SHoXJ denotes team duels
  function getDivisionInfo() {
    const ratingEl = document.querySelector('[class^="division-header_rating__"]');
    if (!ratingEl) return { rating: null, isTeamDuel: false };
    const rating = extractFirstInteger(ratingEl.textContent || ratingEl.innerText || '');
    const ratingClass = String(ratingEl.className || '');
    const isTeamDuel = ratingClass.indexOf('N3H6F') !== -1; // reliable marker you provided
    return { rating, isTeamDuel };
  }

  function badgesFor(isTeamDuel) { return isTeamDuel ? BADGES_TEAMDUEL : BADGES_DIVISION; }

  // computeProgressInfo supports custom below-first-tier ranges:
  // non-team: 1300 -> 1500 (shows 1300..1499)
  // team:     1250 -> 1350 (shows 1250..1349)
  function computeProgressInfo(rating, isTeamDuel, allowBelowMin = false) {
    const arr = badgesFor(isTeamDuel);
    if (rating == null) return null;
    const firstMin = arr[0].min;
    if (rating < firstMin) {
      if (!allowBelowMin) return null;
      const start = isTeamDuel ? 1250 : 1300;
      const end   = isTeamDuel ? 1350 : 1500;
      const nextBadge = arr[0].url || '';
      return { curIndex: -1, cur: { min: start, url: '' }, next: { min: end, url: nextBadge } };
    }
    let curIndex = arr.findIndex(e => rating >= e.min && rating <= e.max);
    if (curIndex === -1) curIndex = arr.length - 1;
    const cur = arr[curIndex];
    const next = (curIndex < arr.length - 1) ? arr[curIndex + 1] : null;
    return { curIndex, cur, next };
  }

  // ---------------- fill gradient logic (updated) ----------------
  // Color the progress bar according to your mapping (the "next rank" colour per your ranges)
  function fillGradientFor(rating, isTeamDuel) {
    // red gradient
    const red = 'linear-gradient(90deg, rgba(200,20,20,0.95), rgba(220,60,60,0.95))';
    // yellow/gold gradient
    const yellow = 'linear-gradient(90deg, rgba(200,150,30,0.95), rgba(220,170,60,0.95))';
    // pink/purple-ish gradient (used for the "pink" tiers)
    const pink = 'linear-gradient(90deg, rgba(200,50,140,0.95), rgba(220,100,180,0.95))';
    // fallback/eternal gradient for very-high tiers if needed
    const top = 'linear-gradient(90deg, rgba(240,180,240,0.95), rgba(200,100,200,0.95))';

    if (isTeamDuel) {
      if (rating == null) return red;
      if (rating >= 1350 && rating <= 1599) return red;     // 1350-1599 -> red
      if (rating >= 1600 && rating <= 1699) return yellow;  // 1600-1699 -> yellow
      if (rating >= 1700) return pink;                      // 1700+ -> pink (no upper bound for progress fill)
      return null; // outside mapping: don't recolor
    } else {
      if (rating == null) return red;
      if (rating >= 1500 && rating <= 1999) return red;     // 1500-1999 -> red
      if (rating >= 2000 && rating <= 2199) return yellow;  // 2000-2199 -> yellow
      if (rating >= 2200) return pink;                      // 2200+ -> pink (no upper bound for progress fill)
      return null; // outside mapping: don't recolor
    }
  }

  // ---------------- team-matchmaking SVG gradient update ----------------
  // Picks explicit hex stop colours (two stop colors) for the leftGradient element based on rating and isTeamDuel.
  function pickSvgGradientStops(rating, isTeamDuel) {
    // explicit per-element colours (won't inherit from other CSS)
    // red: deep red -> lighter red
    const redA = '#6940cf', redB = '#DC3C4C';
    // yellow: gold tones
    const yellowA = '#6940cf', yellowB = '#DCAA3C';
    // pink: purple/pink tones
    const pinkA = '#6940cf', pinkB = '#ff8ad8';

    if (rating == null) return null;

    // NOTE: using the exact ranges you requested (with <=2600 cap if you provided it earlier).
    // Here I implement the ranges you asked to try (team: 1350-1599 red, 1600-1699 yellow, 1700-2600 pink)
    // and non-team: 1500-1999 red, 2000-2199 yellow, 2200-2600 pink.
    // If you later want pink to be unbounded remove the upper checks below.
    const maxCap = 2600;

    if (isTeamDuel) {
      if (rating >= 1350 && rating <= 1599) return [redA, redB];
      if (rating >= 1600 && rating <= 1699) return [yellowA, yellowB];
      if (rating >= 1700 && rating <= maxCap) return [pinkA, pinkB];
      // outside mapping -> don't change
      return null;
    } else {
      if (rating >= 1500 && rating <= 1999) return [redA, redB];
      if (rating >= 2000 && rating <= 2199) return [yellowA, yellowB];
      if (rating >= 2200 && rating <= maxCap) return [pinkA, pinkB];
      // outside mapping -> don't change
      return null;
    }
  }

  function getTeamMatchmakingSvgRoot() {
    // more flexible search for the SVG containing leftGradient
    // 1) try common container you gave
    let container = document.querySelector('.team-matchmaking-layout_root__xFn5v');
    if (container) {
      const svg = container.querySelector('svg.sliding-background_root__oJrQp') || container.querySelector('svg');
      if (svg) return svg;
    }

    // 2) try any element with class containing "team-matchmaking-layout"
    const anyContainer = Array.from(document.querySelectorAll('[class*="team-matchmaking-layout"]')).find(el => el.querySelector && el.querySelector('svg'));
    if (anyContainer) {
      const svg = anyContainer.querySelector('svg.sliding-background_root__oJrQp') || anyContainer.querySelector('svg');
      if (svg) return svg;
    }

    // 3) fallback: find the gradient element directly anywhere in the document (#leftGradient)
    const gradient = document.querySelector('#leftGradient');
    if (gradient) {
      // find nearest svg ancestor
      let ancestor = gradient;
      while (ancestor && ancestor.nodeName !== 'svg') ancestor = ancestor.parentElement;
      if (ancestor && ancestor.nodeName === 'svg') return ancestor;
    }

    // 4) last resort: any svg with a linearGradient child id leftGradient
    const svgs = Array.from(document.querySelectorAll('svg'));
    for (const s of svgs) {
      if (s.querySelector && s.querySelector('linearGradient#leftGradient, #leftGradient')) return s;
    }

    return null;
  }

  function updateTeamSvgGradientIfNeeded(rating, isTeamDuel) {
    // Respect the SVG_GRADIENT_TOGGLE — do nothing if set to "off".
    if (String(SVG_GRADIENT_TOGGLE || '').toLowerCase() !== 'on') return false;

    try {
      const svg = getTeamMatchmakingSvgRoot();
      if (!svg) return false;
      // find gradient inside svg defs
      const grad = svg.querySelector('#leftGradient') || svg.querySelector('linearGradient[id="leftGradient"]');
      if (!grad) return false;

      // Get stops (may be empty); ensure at least two stops exist
      let stops = Array.from(grad.querySelectorAll('stop'));
      if (!stops || stops.length < 2) {
        // create two stops if missing
        // Must create in the SVG namespace
        if (!stops.length) {
          const s1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
          s1.setAttribute('offset', '20%');
          grad.appendChild(s1);
          const s2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
          s2.setAttribute('offset', '100%');
          grad.appendChild(s2);
        } else if (stops.length === 1) {
          const s2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
          s2.setAttribute('offset', '100%');
          grad.appendChild(s2);
        }
        stops = Array.from(grad.querySelectorAll('stop'));
      }

      const picked = pickSvgGradientStops(rating, isTeamDuel);
      if (!picked) return false; // outside mapping - do nothing

      const [c1, c2] = picked;
      const prev = grad.dataset.lastStops || '';
      const next = `${c1}|${c2}`;
      if (prev === next) return true; // nothing to do

      // Update first two stops explicitly with element-local colours.
      stops = Array.from(grad.querySelectorAll('stop')); // re-read after possible append
      if (stops.length >= 1) {
        stops[0].setAttribute('stop-color', c1);
        if (!stops[0].getAttribute('offset')) stops[0].setAttribute('offset', '20%');
      }
      if (stops.length >= 2) {
        stops[1].setAttribute('stop-color', c2);
        if (!stops[1].getAttribute('offset')) stops[1].setAttribute('offset', '100%');
      }

      // store last applied so we avoid repeated writes
      grad.dataset.lastStops = next;
      return true;
    } catch (e) {
      console.error('updateTeamSvgGradientIfNeeded error', e);
      return false;
    }
  }

  // ---------------- find header root / left etc ----------------
  function findHeaderRoot() {
    const explicit = document.querySelector('[class^="division-header_root__"], [class^="division-header__"]');
    if (explicit) return explicit;
    const left = document.querySelector('[class^="division-header_left__"]');
    if (!left) return null;
    let ancestor = left;
    while (ancestor && ancestor !== document.body) {
      if (ancestor.className && /division-header(?:_|-)/.test(String(ancestor.className))) return ancestor;
      ancestor = ancestor.parentElement;
    }
    return left.parentElement || document.body;
  }
  function findLeft() {
    return document.querySelector('[class^="division-header_left__"]');
  }

  // ensure header root positioning without changing layout size
  function ensureHeaderPositioning(root) {
    if (!root) return;
    const cs = window.getComputedStyle(root);
    if (cs.position === 'static') root.style.position = 'relative';
    if (cs.overflow === 'hidden') root.style.overflow = 'visible';
  }

  // helper to detect whether the title's original value is "Champion"
  function titleOriginallyChampion(titleEl) {
    if (!titleEl) return false;
    // check data-orig-title attribute, dataset.origTitle, or the visible text (fallback)
    const a = titleEl.getAttribute && titleEl.getAttribute('data-orig-title');
    const b = titleEl.dataset && titleEl.dataset.origTitle;
    const text = (titleEl.textContent || '').trim();
    if (String(a) === 'Champion') return true;
    if (String(b) === 'Champion') return true;
    if (text === 'Champion') return true;
    return false;
  }

  // ---------------- create / update overlay (with OVERLAY_X_OFFSET applied) ----------------
  function createOrUpdateOverlay(rating, isTeamDuel) {
    const headerRoot = findHeaderRoot();
    const leftEl = findLeft();
    const titleEl = document.querySelector('[class^="division-header_title__"]');

    if (!headerRoot || !leftEl) {
      const old = document.getElementById(PROG_ELEMENT_ID);
      if (old) old.remove();
      return false;
    }

    // Determine if title originally "Champion" (used for below-first-tier special-case)
    const titleIsChampion = titleOriginallyChampion(titleEl);

    // allow below-first-tier progress only when titleIsChampion and rating < first threshold
    const firstMin = badgesFor(isTeamDuel)[0].min;
    const allowBelowFirst = (rating != null && rating < firstMin && titleIsChampion);

    const info = computeProgressInfo(rating, isTeamDuel, allowBelowFirst);

    // remove overlay if not applicable
    if (!info || !info.next) {
      const old = document.getElementById(PROG_ELEMENT_ID);
      if (old) old.remove();
      // also remove nudge class if present
      if (leftEl && leftEl.classList) leftEl.classList.remove('gg-prog-nudge');
      return false;
    }

    try { ensureHeaderPositioning(headerRoot); } catch (e) {}

    // compute whether we should nudge this left column:
    // - Primary: use non-team thresholds (1350..2199) for nudge (per your working version).
    // - Secondary: also nudge if below-first-tier AND title originally "Champion".
    const nonTeamNudgeMin = 1350;
    const nonTeamNudgeMax = 2200; // exclusive upper bound like before
    const belowFirstAndChampion = (rating != null && rating < firstMin && titleIsChampion);
    const primaryNudge = (rating != null && rating >= nonTeamNudgeMin && rating < nonTeamNudgeMax);
    const shouldNudge = primaryNudge || belowFirstAndChampion;

    try {
      if (shouldNudge) leftEl.classList.add('gg-prog-nudge'); else leftEl.classList.remove('gg-prog-nudge');
    } catch (e) {}

    // compute pixel position/width so overlay scales with the left element (including zoom/transform)
    const leftRect = leftEl.getBoundingClientRect();
    const rootRect = headerRoot.getBoundingClientRect();
    // left offset relative to headerRoot
    let leftPx = Math.round(leftRect.left - rootRect.left);
    if (isNaN(leftPx)) leftPx = 0;
    // add horizontal offset (user requested +10px)
    leftPx += OVERLAY_X_OFFSET;

    // take half of the left element's rendered width
    let widthPx = Math.round(leftRect.width * 0.5);
    if (widthPx <= 8) widthPx = Math.max(120, Math.round(rootRect.width * 0.25));

    const { cur, next } = info;
    // cur.min may be 0 in the below-first-tier special-case (but in our custom ranges it will be 1250/1300)
    const start = Number(cur.min || 0);
    const end = Number(next.min || start + 1);
    const clampedRating = Math.min(Math.max((rating != null ? rating : start), start), end);
    const pct = end === start ? 100 : ((clampedRating - start) / (end - start)) * 100;
    const fillPctStr = Math.max(0, Math.min(100, pct)).toFixed(2);
    const fillStyle = `width:${fillPctStr}%; background: ${fillGradientFor(rating, isTeamDuel)};`;

    let overlay = document.getElementById(PROG_ELEMENT_ID);
    const nextBadgeUrl = next.url || '';
    const nextMinLabel = String(next.min);

    // Create if missing
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = PROG_ELEMENT_ID;
      headerRoot.appendChild(overlay);
      // store baseline dataset
      overlay.dataset.lastLeft = '';
      overlay.dataset.lastWidth = '';
      overlay.dataset.lastFill = '';
      overlay.dataset.lastBadge = '';
      overlay.dataset.lastNextMin = '';
    } else if (overlay.parentNode !== headerRoot) {
      overlay.parentNode.removeChild(overlay);
      headerRoot.appendChild(overlay);
    }

    // apply computed absolute placement to overlay (px values) - update if changed
    if (overlay.style.left !== `${leftPx}px`) overlay.style.left = `${leftPx}px`;
    if (overlay.style.width !== `${widthPx}px`) overlay.style.width = `${widthPx}px`;
    overlay.style.bottom = `-8px`;

    // If nothing meaningful changed, avoid rewriting DOM
    const nothingChanged =
      overlay.dataset.lastLeft === String(leftPx) &&
      overlay.dataset.lastWidth === String(widthPx) &&
      overlay.dataset.lastFill === fillPctStr &&
      overlay.dataset.lastBadge === nextBadgeUrl &&
      overlay.dataset.lastNextMin === nextMinLabel;

    if (nothingChanged) {
      // still ensure fill element is updated in case CSS or transition needs refresh (but skip heavy innerHTML rewrite)
      const fillEl = overlay.querySelector('.gg-prog-fill');
      if (fillEl) {
        if (fillEl.style.width !== `${fillPctStr}%`) fillEl.style.width = `${fillPctStr}%`;
        const bg = fillGradientFor(rating, isTeamDuel);
        if (fillEl.style.background !== bg) fillEl.style.background = bg;
      }
      // keep aria attributes up to date
      const bar = overlay.querySelector('.gg-prog-bar');
      if (bar) {
        bar.setAttribute('aria-valuemin', String(start));
        bar.setAttribute('aria-valuemax', String(end));
        bar.setAttribute('aria-valuenow', String(rating != null ? rating : start));
      }
      // also update the team SVG gradient (cheap no-op if same)
      updateTeamSvgGradientIfNeeded(rating, isTeamDuel);
      return true;
    }

    // Otherwise, (re)build content minimally
    overlay.innerHTML = `
      <div class="gg-prog-card" aria-hidden="true">
        <div style="flex:1 1 auto; min-width:0;">
          <div class="gg-prog-bar" role="progressbar" aria-valuemin="${start}" aria-valuemax="${end}" aria-valuenow="${rating != null ? rating : start}">
            <div class="gg-prog-fill" style="${fillStyle}"></div>
          </div>
        </div>
        <div class="gg-next-icon" title="Next tier requires ${nextMinLabel}">
          <img src="${nextBadgeUrl}" alt="Next tier badge">
          <div class="gg-next-min">${nextMinLabel}</div>
        </div>
      </div>
    `;

    // update dataset markers to allow cheap change detection next run
    overlay.dataset.lastLeft = String(leftPx);
    overlay.dataset.lastWidth = String(widthPx);
    overlay.dataset.lastFill = fillPctStr;
    overlay.dataset.lastBadge = nextBadgeUrl;
    overlay.dataset.lastNextMin = nextMinLabel;

    // update the team SVG gradient to match current rating (only writes if changed)
    updateTeamSvgGradientIfNeeded(rating, isTeamDuel);

    return true;
  }

  // ---------------- Division update ----------------
  function updateDivisionArea() {
    const ratingEl = document.querySelector('[class^="division-header_rating__"]');
    if (!ratingEl) {
      const old = document.getElementById(PROG_ELEMENT_ID);
      if (old) old.remove();
      return false;
    }
    const info = getDivisionInfo();
    const rating = info.rating;
    const isTeamDuel = info.isTeamDuel;

    const badgeEl = document.querySelector('[class^="division-header_badge__"], img[class^="division-header_badge__"]');
    const titleEl = document.querySelector('[class^="division-header_title__"]');

    const badgeArray = isTeamDuel ? BADGES_TEAMDUEL : BADGES_DIVISION;
    const titleArray = isTeamDuel ? TITLES_TEAMDUEL : TITLES;

    const badgeUrl = pickForRating(badgeArray, rating);
    const titleStr = pickTitleForRatingFromArray(titleArray, rating);

    if (!isNaN(rating)) recolorHeader(rating, isTeamDuel);

    if (badgeEl && badgeEl.tagName === 'IMG' && badgeUrl) {
      badgeEl.dataset.origSrc = badgeEl.dataset.origSrc || badgeEl.getAttribute('data-orig-src') || badgeEl.getAttribute('src') || '';
      badgeEl.dataset.origSrcset = badgeEl.dataset.origSrcset || badgeEl.getAttribute('data-orig-srcset') || badgeEl.getAttribute('srcset') || '';
      const cur = badgeEl.getAttribute('src') || '';
      if (!cur.includes(badgeUrl)) {
        badgeEl.setAttribute('src', badgeUrl);
        badgeEl.setAttribute('srcset', `${badgeUrl} 1x, ${badgeUrl} 2x`);
        badgeEl.dataset.replaced = 'true';
      }
    }

    if (titleEl && titleStr) {
      if (!('origTitle' in titleEl.dataset)) {
        titleEl.dataset.origTitle = (titleEl.textContent || '').trim();
        titleEl.dataset.origDataOriginalTitle = titleEl.getAttribute('data-original-title') || '';
      }
      const cur = (titleEl.textContent || '').trim();
      if (cur !== titleStr) {
        titleEl.textContent = titleStr;
        titleEl.dataset.replacedTitle = 'true';
      }
    }

    try { createOrUpdateOverlay(rating, isTeamDuel); } catch (e) { console.error('overlay error', e); }

    // Ensure SVG gradient is updated even if overlay didn't change
    try { updateTeamSvgGradientIfNeeded(rating, isTeamDuel); } catch (e) { console.error('team svg gradient update error', e); }

    // NEW: update matchmaking header badge that uses Next.js image URLs
    try { updateMatchmakingHeaderBadge(info); } catch (e) { console.error('matchmaking header badge update error', e); }

    return true;
  }

  // ---------------- Multiplayer & Team-list logic (unchanged) ----------------
  function findMultiplayerBoxes() {
    let boxes = Array.from(document.querySelectorAll('.multiplayer_ratingBox__05Gko'));
    if (boxes.length) return boxes;
    const root = document.querySelector('.multiplayer_root__jmpXA');
    if (!root) return [];
    const candidates = Array.from(root.querySelectorAll('div,section,article'));
    const filtered = candidates.filter(el => {
      const lbl = Array.from(el.querySelectorAll('label')).some(l => /\d{2,5}/.test((l.textContent || '').trim()));
      return lbl;
    });
    const topLevel = filtered.filter((el, i, arr) => !arr.some(other => other !== el && other.contains(el)));
    return topLevel;
  }
  function findAllDigitLabels() {
    return Array.from(document.querySelectorAll('label')).filter(l => /\d{2,5}/.test((l.textContent || '').trim()));
  }
  function pairBoxesToLabels(boxes) {
    const labels = findAllDigitLabels();
    if (!boxes.length || !labels.length) return new Map();
    const assigned = new Set();
    const mapping = new Map();
    for (const box of boxes) {
      const br = box.getBoundingClientRect();
      let best = null;
      let bestScore = Infinity;
      for (const lbl of labels) {
        if (assigned.has(lbl)) continue;
        const lr = lbl.getBoundingClientRect();
        let dy = Math.abs((lr.top || 0) - (br.top || 0));
        let dx = Math.abs((lr.left || 0) - (br.left || 0));
        let score = dy * 2 + dx;
        if ((!lr.width && !lr.height) || (!br.width && !br.height)) {
          const li = Array.prototype.indexOf.call(labels, lbl);
          const bi = Array.prototype.indexOf.call(boxes, box);
          score = Math.abs(li - bi) * 1000;
        }
        if (score < bestScore) { bestScore = score; best = lbl; }
      }
      if (best) { mapping.set(box, best); assigned.add(best); }
    }
    return mapping;
  }
  function updateMultiplayerBox(box, idx, ratingLabelOverride, isTeamDuelFlag) {
    const ratingLabel = ratingLabelOverride || labelWithDigits(box);
    let titleLabel = box.querySelector('label[data-original-title]') || box.querySelector('label.label_label__9xkbh') || Array.from(box.querySelectorAll('label')).find(l => /[A-Za-z]/.test((l.textContent || '').trim()));
    const imgEl = box.querySelector('img.multiplayer_icon__hRbEa') || box.querySelector('img');
    const rating = ratingLabel ? extractFirstInteger(ratingLabel.textContent || '') : null;
    const badgeArray = isTeamDuelFlag ? BADGES_TEAMDUEL : BADGES_MULTIPLAYER;
    const titleArray = isTeamDuelFlag ? TITLES_TEAMDUEL : TITLES;
    const badgeUrl = pickForRating(badgeArray, rating);
    const titleStr = pickTitleForRatingFromArray(titleArray, rating);
    if (imgEl && imgEl.tagName === 'IMG' && badgeUrl) {
      imgEl.dataset.origSrc = imgEl.dataset.origSrc || imgEl.getAttribute('data-orig-src') || imgEl.getAttribute('src') || '';
      imgEl.dataset.origSrcset = imgEl.dataset.origSrcset || imgEl.getAttribute('data-orig-srcset') || imgEl.getAttribute('srcset') || '';
      const cur = (imgEl.getAttribute('src') || '');
      if (!cur.includes(badgeUrl)) {
        imgEl.setAttribute('src', badgeUrl);
        imgEl.setAttribute('srcset', `${badgeUrl} 1x, ${badgeUrl} 2x`);
        imgEl.dataset.replaced = 'true';
      }
    }
    if (titleLabel && titleStr) {
      if (!('origTitle' in titleLabel.dataset)) {
        titleLabel.dataset.origTitle = (titleLabel.textContent || '').trim();
        titleLabel.dataset.origDataOriginalTitle = titleLabel.getAttribute('data-original-title') || '';
      }
      const cur = (titleLabel.textContent || '').trim();
      if (cur !== titleStr) {
        titleLabel.textContent = titleStr;
        try { titleLabel.setAttribute('data-original-title', titleStr); } catch (e) {}
        titleLabel.dataset.replacedTitle = 'true';
      }
    }
  }
  function updateMultiplayerAll() {
    const boxes = findMultiplayerBoxes();
    if (!boxes || !boxes.length) return false;
    const mapping = pairBoxesToLabels(boxes);
    boxes.forEach((b, i) => {
      try {
        const ratingLabel = mapping.get(b) || null;
        const isTeamDuelForThisBox = (i === 1);
        updateMultiplayerBox(b, i, ratingLabel, isTeamDuelForThisBox);
      } catch (e) { console.error('updateMultiplayerBox error', e); }
    });
    return true;
  }
  function findNearestTeamIconFrom(el) {
    if (!el) return null;
    let ancestor = el;
    for (let depth = 0; depth < 5 && ancestor; depth++) {
      const img = ancestor.querySelector('img[class^="team-selector_divisionImage__"], [class^="team-selector_divisionImageWrapper__"] img, img.team-selector_divisionImage__U12_e, img');
      if (img) return img;
      ancestor = ancestor.parentElement;
    }
    let sib = el.previousElementSibling;
    for (let i = 0; i < 6 && sib; i++, sib = sib.previousElementSibling) {
      const img = sib.querySelector && sib.querySelector('img');
      if (img) return img;
    }
    sib = el.nextElementSibling;
    for (let i = 0; i < 6 && sib; i++, sib = sib.nextElementSibling) {
      const img = sib.querySelector && sib.querySelector('img');
      if (img) return img;
    }
    return null;
  }
  function updateTeamListEntries() {
    const cols = Array.from(document.querySelectorAll('[class^="teams-detailed-leaderboard_columnContent__"]'));
    if (!cols.length) return false;
    let changed = false;
    cols.forEach((col) => {
      try {
        const label = Array.from(col.querySelectorAll('label')).find(l => /\d{2,5}/.test((l.textContent || '').trim()));
        if (!label) return;
        const rating = extractFirstInteger(label.textContent || '');
        if (rating == null) return;
        const img = findNearestTeamIconFrom(col);
        if (!img || img.tagName !== 'IMG') return;
        const badgeUrl = pickForRating(BADGES_TEAMDUEL, rating);
        if (!badgeUrl) return;
        img.dataset.origSrc = img.dataset.origSrc || img.getAttribute('data-orig-src') || img.getAttribute('src') || '';
        img.dataset.origSrcset = img.dataset.origSrcset || img.getAttribute('data-orig-srcset') || img.getAttribute('srcset') || '';
        const cur = img.getAttribute('src') || '';
        if (!cur.includes(badgeUrl)) {
          img.setAttribute('src', badgeUrl);
          img.setAttribute('srcset', `${badgeUrl} 1x, ${badgeUrl} 2x`);
          img.dataset.replaced = 'true';
          changed = true;
        }
      } catch (e) { console.error('updateTeamListEntries item error', e); }
    });
    return changed;
  }

  function updateTeamBadges(info) {
    if (!info) info = getDivisionInfo();
    const rating = info.rating;
    const isTeamDuel = info.isTeamDuel;
    if (!isTeamDuel || rating == null) return false;
    const badgeUrl = pickForRating(BADGES_TEAMDUEL, rating);
    if (!badgeUrl) return false;
    const teamHeaderImgs = Array.from(document.querySelectorAll('img[class^="team-matchmaking-layout_badge__"], [class^="team-matchmaking-layout_badge__"]'));
    teamHeaderImgs.forEach(img => {
      if (img && img.tagName === 'IMG') {
        img.dataset.origSrc = img.dataset.origSrc || img.getAttribute('data-orig-src') || img.getAttribute('src') || '';
        img.dataset.origSrcset = img.dataset.origSrcset || img.getAttribute('data-orig-srcset') || img.getAttribute('srcset') || '';
        const cur = img.getAttribute('src') || '';
        if (!cur.includes(badgeUrl)) {
          img.setAttribute('src', badgeUrl);
          img.setAttribute('srcset', `${badgeUrl} 1x, ${badgeUrl} 2x`);
          img.dataset.replaced = 'true';
        }
      }
    });
    const ratingWrapperImgs = Array.from(document.querySelectorAll('.rating_wrapper__22uFu img, [class^="rating_wrapper__22uFu"] img'));
    ratingWrapperImgs.forEach(img => {
      if (img && img.tagName === 'IMG') {
        img.dataset.origSrc = img.dataset.origSrc || img.getAttribute('data-orig-src') || img.getAttribute('src') || '';
        img.dataset.origSrcset = img.dataset.origSrcset || img.getAttribute('data-orig-srcset') || img.getAttribute('srcset') || '';
        const cur = img.getAttribute('src') || '';
        if (!cur.includes(badgeUrl)) {
          img.setAttribute('src', badgeUrl);
          img.setAttribute('srcset', `${badgeUrl} 1x, ${badgeUrl} 2x`);
          img.dataset.replaced = 'true';
        }
      }
    });
    return true;
  }

  // ---------------- NEW: matchmaking header badge updater ----------------
  // Targets header elements like:
  // <header class="matchmaking-layout_header___c3p5"> ... <img class="matchmaking-layout_badge__umzOu" src="/_next/image?..." /> ...</header>
  // This function will replace the Next.js image src/srcset with the badge URL when rating falls into BADGES_DIVISION ranges.
  function updateMatchmakingHeaderBadge(info) {
    if (!info) info = getDivisionInfo();
    const rating = info.rating;
    const isTeamDuel = info.isTeamDuel;
    // Only apply for non-team division headers
    if (isTeamDuel) return false;

    // Prefer a flexible selector that matches hashed class prefixes
    const header = document.querySelector('[class^="matchmaking-layout_header"], header[class*="matchmaking-layout_header"]');
    if (!header) return false;

    const img = header.querySelector('img[class^="matchmaking-layout_badge__"], img.matchmaking-layout_badge__umzOu');
    if (!img || img.tagName !== 'IMG') return false;

    const badgeUrl = pickForRating(BADGES_DIVISION, rating);

    // Save original src/srcset for restoration
    img.dataset.origSrc = img.dataset.origSrc || img.getAttribute('data-orig-src') || img.getAttribute('src') || '';
    img.dataset.origSrcset = img.dataset.origSrcset || img.getAttribute('data-orig-srcset') || img.getAttribute('srcset') || '';

    const cur = img.getAttribute('src') || '';

    if (badgeUrl) {
      if (!cur.includes(badgeUrl)) {
        try {
          img.setAttribute('src', badgeUrl);
          img.setAttribute('srcset', `${badgeUrl} 1x, ${badgeUrl} 2x`);
          img.dataset.replaced = 'true';
        } catch (e) { console.error('set matchmaking badge error', e); }
      }
      return true;
    } else {
      // If no badge applicable, restore original Next.js image URL if we saved one
      const orig = img.dataset.origSrc || '';
      const origset = img.dataset.origSrcset || '';
      if (orig && !cur.includes(orig)) {
        try {
          img.setAttribute('src', orig);
          if (origset) img.setAttribute('srcset', origset);
          img.dataset.replaced = '';
        } catch (e) { console.error('restore matchmaking badge error', e); }
      }
      return false;
    }
  }

  // ---------------- combined update ----------------
  function updateAllOnce() {
    let changed = false;
    changed = updateDivisionArea() || changed;
    const divisionInfo = getDivisionInfo();
    changed = updateTeamBadges(divisionInfo) || changed;
    changed = updateMultiplayerAll() || changed;
    changed = updateTeamListEntries() || changed;
    return changed;
  }

  // ---------------- debounce / observe / resize ----------------
  let scheduled = null;
  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = setTimeout(() => {
      scheduled = null;
      try { updateAllOnce(); } catch (e) { console.error(e); }
    }, 150);
  }

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList' && (m.addedNodes.length || m.removedNodes.length)) { scheduleUpdate(); break; }
      if (m.type === 'characterData') { scheduleUpdate(); break; }
      if (m.type === 'attributes') { scheduleUpdate(); break; }
    }
  });

  function startObserving() {
    if (!document.body) return;
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true });
    scheduleUpdate();
  }

  // listen for resize/scroll (so overlay repositions when zoom changes or user scrolls)
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  window.addEventListener('scroll', scheduleUpdate, { passive: true });

  // SPA route watcher
  (function installRouteWatcher() {
    const wrap = (method) => {
      const orig = history[method];
      return function () {
        const rv = orig.apply(this, arguments);
        window.dispatchEvent(new Event('gg-route-change'));
        return rv;
      };
    };
    history.pushState = wrap('pushState');
    history.replaceState = wrap('replaceState');
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('gg-route-change')));
    window.addEventListener('gg-route-change', () => {
      try { resetAll(); } catch (e) {}
      setTimeout(updateAllOnce, 250);
    });
  })();

  function resetAll() {
    clearHeaderCss();
    const old = document.getElementById(PROG_ELEMENT_ID);
    if (old) old.remove();
    if (scheduled) { clearTimeout(scheduled); scheduled = null; }
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', startObserving, { once: true });
  } else startObserving();

  const fallbackInterval = setInterval(() => scheduleUpdate(), 5000);

  window.addEventListener('beforeunload', () => {
    observer.disconnect();
    clearInterval(fallbackInterval);
    if (scheduled) clearTimeout(scheduled);
  });

  // initial run
  setTimeout(updateAllOnce, 300);

})();
