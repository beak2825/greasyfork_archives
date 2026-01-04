// ==UserScript==
// @name        AH/QQ/SB/SV Mobile readability
// @description Auto-hiding sticky navbar. Add style widget (font size, padding, light/dark selector, uncenter/unserif). Standardize font size, revert justified text, replace fonts with 3 categories (sans-serif/serif/monospace), dodge colored text from the background.
// @version     1.38
// @author      C89sd
// @namespace   https://greasyfork.org/users/1376767
// @match       https://*.spacebattles.com/*
// @match       https://*.sufficientvelocity.com/*
// @match       https://*.questionablequesting.com/*
// @match       https://*.alternatehistory.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/534456/AHQQSBSV%20Mobile%20readability.user.js
// @updateURL https://update.greasyfork.org/scripts/534456/AHQQSBSV%20Mobile%20readability.meta.js
// ==/UserScript==
'use strict';

const DISABLE_STICKY_HIDE = false;
const FONT_SCALE_MONO  = 0.8917;
const FONT_SCALE_SERIF = 0.9108;


const IS_THREAD = document.URL.includes('/threads/');

// ======================== Global State and Core Functions (Run at document-start) ======================== //

let currentFontSize, currentPaddingSize;
let styleBbTable, styleSbStats; /* script el */
let cssBbTable,   cssSbStats;   /* templates */

const toPx = (base, factor) => (base * factor).toFixed(2) + 'px';

/* ───── 1. Site-specific style IDs + path ───── */
const site = location.hostname.split('.').slice(-2, -1)[0];
const [LIGHT_ID, DARK_ID] = {
  spacebattles        : [ 6,  2],
  sufficientvelocity  : [19, 20],
  questionablequesting: [ 1, 31],
  alternatehistory    : [13, 15]
}[site];
const STYLE_PATH = site === 'alternatehistory' ? '/forum/misc/style' : '/misc/style';

/* ───── 2. Inject Static CSS ASAP ───── */
let staticCss = `
.ffss { font-family: Roboto, Segoe UI, Ubuntu, sans-serif !important; }
.ffm  { font-family: monospace !important; }
.ffs  { font-family: serif !important; }

  .p-nav { border-top: none !important; }
  .gm-navStyleBtn{
    cursor:pointer;
    -webkit-user-select:none;  /* stop long-press text selection */
    user-select:none;
  }
  /* popup */
  #gmStylePopup{
    position:fixed;top:64px;right:20px;background:#fff;color:#000;
    border:1px solid #666;border-radius:8px;padding:16px;z-index:9999;
    box-shadow:0 4px 14px rgba(0,0,0,.25);display:none;
    flex-direction:column;gap:12px;min-width:280px;font-size:14px}
  @media (max-width:600px){#gmStylePopup{transform:scale(1.1);transform-origin:top right}}

  /* Light / Dark tiles */
  .gm-tile-row{display:flex;width:100%;gap:8px}
  .gm-style-tile{
    flex:1 1 50%;height:60px;line-height:60px;font-size:1.05em;
    border-radius:6px;text-align:center;cursor:pointer;user-select:none;
    border:1px solid #666;text-decoration:none}
  .gm-light{background:#eaeaea;color:#000}.gm-light:hover{background:#dbdbdb}
  .gm-dark {background:#222;color:#fff}.gm-dark:hover {background:#2d2d2d}

  /* Font-size block */
  .gm-font-row{display:flex;align-items:center;gap:6px;justify-content:center}
  .gm-font-row button{
    width:41.1px;height:50px;font-size:15px;cursor:pointer;
    border:1px solid #666;border-radius:6px;background:#f5f5f5;color:#000}
  .gm-font-row button:hover{background:#e4e4e4}
  .gm-font-row input{
    width:70px;height:50px;text-align:center;font-size:16px;
    border:1px solid #666;border-radius:6px}

  .gmStickyNav{
    position:sticky;
    top:0;                   /* docks here once we reach it          */
    z-index:1010;
    will-change:transform;   /* we only translate it, no repaint     */
  }
`;
document.head.appendChild(Object.assign(document.createElement('style'), {textContent: staticCss}));
document.querySelector('html').classList.add('ffss');

/* ───── 3. Dynamic Style Templates ───── */
if (IS_THREAD) {
  cssBbTable = px => `
    .bbTable{
      font-size:${toPx(px, 14.0 / 15)};
      overflow:scroll;
      table-layout:auto;
    }
    .bbTable td{
      vertical-align:top;
      white-space:normal;
      word-wrap:normal;
    }`;

  /* 2) SB weekly-stats */
  if (document.URL.includes('.1140820/')) {
    cssSbStats = px => `
      /* Indicator */
      .bbTable td >  b:first-of-type:has(code.bbCodeInline){display:inline-block;padding:2px 0;}
      .bbTable td >  b:first-of-type code.bbCodeInline     {font-size:${toPx(px, 11 / 15)};}

      /* Name / Metric */
      .bbTable span:has(.username)                         {font-size:${toPx(px, 11.5 / 15)};}
      .bbTable span:has(.bbc-abbr)                         {font-size:${toPx(px, 12.5 / 15)};}

      /* Bottom Tags */
      .bbTable td > span:last-child:has(>code.bbCodeInline){display:inline-flex;flex-wrap:wrap;gap:1px;padding-top:6px;}
      .bbTable td > span:last-child > code.bbCodeInline    {font-size:${toPx(px,  9  / 15)};padding:1px 3px;}`;
  }
}

/* ───── 4. Core Helper Functions ───── */

function clamp(v, min = 0, max = 1) { return v < min ? min : v > max ? max : v; }

const srgbToLinear = c => { c /= 255; return c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
function linearToSrgb(c){ const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1/2.4) - 0.055; return Math.round(clamp(v) * 255); }

// sRGB (array of 3 ints 0-255) -------------→ OKLab {L,a,b}
function srgbToOklab([R8, G8, B8]){
  // linear RGB
  const r = srgbToLinear(R8), g = srgbToLinear(G8), b = srgbToLinear(B8);
  // RGB → LMS (Bjørn Ottosson, 2020)
  const l = 0.4122214708*r + 0.5363325363*g + 0.0514459929*b;
  const m = 0.2119034982*r + 0.6806995451*g + 0.1073969566*b;
  const s = 0.0883024619*r + 0.2817188376*g + 0.6299787005*b;
  // LMS ^ (1/3)
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  // LMS → OKLab
  return {
    L :  0.2104542553*l_ + 0.7936177850*m_ - 0.0040720468*s_,
    a :  1.9779984951*l_ - 2.4285922050*m_ + 0.4505937099*s_,
    b :  0.0259040371*l_ + 0.7827717662*m_ - 0.8086757660*s_
  };
}

// OKLab {L,a,b} ----------------------------→ sRGB array [R,G,B]
function oklabToSrgb({L,a,b}){
  // OKLab → LMS^
  const l_ = Math.pow(L + 0.3963377774*a + 0.2158037573*b, 3);
  const m_ = Math.pow(L - 0.1055613458*a - 0.0638541728*b, 3);
  const s_ = Math.pow(L - 0.0894841775*a - 1.2914855480*b, 3);

  // LMS → linear RGB
  const r = + 4.0767416621*l_ - 3.3077115913*m_ + 0.2309699292*s_;
  const g = - 1.2684380046*l_ + 2.6097574011*m_ - 0.3413193965*s_;
  const b_ = - 0.0041960863*l_ - 0.7034186147*m_ + 1.7076147010*s_;

  return [linearToSrgb(r), linearToSrgb(g), linearToSrgb(b_)];
}

const minContrastDistance = 0.28;
const colorCache = new Map();

const defaultTextColors = {
    dark: 'rgb(220, 220, 220)',
    light: 'rgb(29, 29, 29)',
};

// adjust the lightness of a source color to ensure it has minimum contrast distance against a reference color
function pushAway(sourceLab, referenceLab) {
    const dL = sourceLab.L - referenceLab.L;
    const da = sourceLab.a - referenceLab.a;
    const db = sourceLab.b - referenceLab.b;
    const currentContrast = Math.sqrt(dL * dL + da * da + db * db);

    if (currentContrast >= minContrastDistance) {
        return sourceLab; // Contrast is sufficient.
    }

    const chromaContrastSq = da * da + db * db;
    const minContrastSq = minContrastDistance * minContrastDistance;
    // Math.max prevents sqrt of a negative number if color contrast alone is high
    const required_dL_magnitude = Math.sqrt(Math.max(0, minContrastSq - chromaContrastSq));

    // Determine direction based on the reference color's lightness
    const direction = referenceLab.L < 0.5 ? 1 : -1; // Push lighter from dark, darker from light

    const newL = referenceLab.L + (direction * required_dL_magnitude);
    sourceLab.L = clamp(newL, 0, 1);

    return sourceLab;
}


function adjustTextColor(textRGBStr, textBgRGBStr) {
    const cacheKey = textRGBStr + '|' + textBgRGBStr;
    if (colorCache.has(cacheKey)) return colorCache.get(cacheKey);

    const toRGB = str => (str.match(/\d+/g) || []).map(Number).slice(0, 3);

    const fg = toRGB(textRGBStr);
    const bg = toRGB(textBgRGBStr);
    if (fg.length !== 3 || bg.length !== 3) return textRGBStr;

    let fgLab = srgbToOklab(fg);
    const bgLab = srgbToOklab(bg);

    // Determine Light/Dark mode and matching text color
    const darkMode = bgLab.L < 0.5;
    const defaultTextColorStr = darkMode ? defaultTextColors.dark : defaultTextColors.light;
    const defaultTextLab = srgbToOklab(toRGB(defaultTextColorStr));

    // Step 1: push away from the default text color in light mode (prevent too-dark colors, since those sites are designed for dark-mode).
    if (!darkMode) fgLab = pushAway(fgLab, defaultTextLab);

    // Step 2: push away from the background
    fgLab = pushAway(fgLab, bgLab);

    // Convert to RGB
    const rgb = oklabToSrgb(fgLab);
    const result = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    colorCache.set(cacheKey, result);

    return result;
}


function applyFontSizeToElement(wrapper, pxStr) {
  const SANS_SERIF = /arial|tahoma|trebuchet ms|verdana/;
  const MONOSPACE = /courier new/;
  const SERIF = /times new roman|georgia|book antiqua/;

  const scale = (val, factor) => (parseFloat(val) * factor).toFixed(2) + "px";

  wrapper.style.fontSize = pxStr;
  wrapper.classList.add('ffss');

  // .message for posts; .block-container for summary
  let bgColor = window.getComputedStyle( wrapper.closest('.message,.block-container')).backgroundColor;

  const children = wrapper.querySelectorAll('*');
  for (let child of children) {
    const style = child.style;

    if (style.fontSize) {
      style.fontSize = ''; // Reset explicit font sizes for consistency
    }

    if (style.fontFamily) {
      const font = style.fontFamily;
      if (SANS_SERIF.test(font)) {
        child.classList.add('ffss');
      } else if (MONOSPACE.test(font)) {
        child.classList.add('ffm');
        style.fontSize = scale(pxStr, FONT_SCALE_MONO);
      } else if (SERIF.test(font)) {
        child.classList.add('ffs');
        style.fontSize = scale(pxStr, FONT_SCALE_SERIF);
      }
    }

    if (style.textAlign) {
      // Keep 'center' and 'right', clear others for readability
      if (style.textAlign !== 'center' && style.textAlign !== 'right') {
        style.textAlign = '';
      }
    }

    if (style.color && style.color.startsWith('rgb')) {
      style.color = adjustTextColor(style.color, bgColor);
    }
  }
}

function applyPaddingToElement(cell, pxStr) {
  cell.style.paddingLeft = pxStr;
  cell.style.paddingRight = pxStr;
}

const mo_map = new Map();
function applyOnElement(selector, cb) {
  document.querySelectorAll(selector).forEach(cb);
  if (document.readyState !== 'loading') {
    const mo = mo_map.get(selector);
    if (mo) { mo.disconnect(); mo_map.delete(selector); }
    return;
  }
  if (mo_map.has(selector)) return; // Observer already set up
  const mo = new MutationObserver(m => m.forEach(u => u.addedNodes.forEach(n => {
    if (n.nodeType === 1) {
      if (n.matches(selector)) cb(n);
      n.querySelectorAll(selector).forEach(cb);
    }
  })));
  mo.observe(document.documentElement, { childList: true, subtree: true });
  mo_map.set(selector, mo);
  document.addEventListener('DOMContentLoaded', () => { mo.disconnect(); mo_map.delete(selector); }, { once: true });
}

/* ───── 5. Unified Style Controller ───── */

function updateDynamicStyles() {
    if (!IS_THREAD) return;
    if (cssBbTable) {
        styleBbTable = styleBbTable || document.head.appendChild(Object.assign(document.createElement('style'), { id: 'gmStyleBbTable' }));
        styleBbTable.textContent = cssBbTable(currentFontSize);
    }
    if (cssSbStats) {
        styleSbStats = styleSbStats || document.head.appendChild(Object.assign(document.createElement('style'), { id: 'gmStyleSbStats' }));
        styleSbStats.textContent = cssSbStats(currentFontSize);
    }
}

let lastUpdate = 0;
function updateAndApplyStyles(force = false) {
    const now = Date.now();
    if (!force && now - lastUpdate < 500) return;
    lastUpdate = now;

    const newFontSize = clamp(Number(GM_getValue('fontSize', 15.7)), 10, 25);
    const newPaddingSize = clamp(Number(GM_getValue('paddingSize', 10)), 0, 80);

    if (newFontSize !== currentFontSize) {
        currentFontSize = newFontSize;
        const pxStr = currentFontSize + 'px';
        applyOnElement('.bbWrapper', el => applyFontSizeToElement(el, pxStr));
        updateDynamicStyles();
    }

    if (newPaddingSize !== currentPaddingSize) {
        currentPaddingSize = newPaddingSize;
        const pxStr = currentPaddingSize + 'px';
        applyOnElement('.message-cell.message-cell--main', el => applyPaddingToElement(el, pxStr));
    }
}

/* ───── 6. Live Update Listeners ───── */

// Initial application
updateAndApplyStyles(true);


// ======================== UI and DOM-Dependent Code (Run at DOMContentLoaded) ======================== //
let CORRUPTED = false;
document.addEventListener('DOMContentLoaded', () => {
  let popup;
  /* ───── Sticky bar injection ───── */
  if (!DISABLE_STICKY_HIDE) {
    const sticky = document.querySelector('.p-navSticky.p-navSticky--primary') || document.querySelector('.p-nav');
    sticky.classList.add('gmStickyNav');
    sticky.classList.remove('p-navSticky', 'p-navSticky--primary', 'is-sticky');
    sticky.removeAttribute('data-xf-init');

    /* 3.  state common to both algorithms */
    let barH = sticky.offsetHeight;
    let offset = 0;
    let lastY = scrollY;
    let stuck = false; // “is the bar currently touching the viewport top?”

    function onScrollNew() {
      const y = scrollY;
      const top = sticky.getBoundingClientRect().top;  // distance to viewport top

      /* bar still in normal flow */
      if (top > 0) {
        if (stuck) {
          stuck = false;
          offset = 0;
          sticky.style.transform = '';
        }
        lastY = y;
        return;
      }

      /* bar just became sticky */
      if (!stuck) {
        stuck = true;
        lastY = y; // reset baseline: no initial jump
        return;
      }

      /* regular retract / reveal */
      const dy = y - lastY;  // + down, – up
      lastY = y;
      offset = clamp(offset + dy, 0.1, barH); // 0.1 prevent fully open top artifact
      sticky.style.transform = `translateY(${-offset}px)`;
    }
    addEventListener('scroll', onScrollNew, { passive: true });
    addEventListener('resize', () => { barH = sticky.offsetHeight; });
  }

  /* 4.  Remove old XF button, add our own to the right of Jump */
  let btn;
  document.querySelector('.p-nav-opposite > div[data-xf-click="sv-font-size-chooser-form"]')?.remove();
  const navOpposite = document.querySelector('#top .p-nav-opposite');
  if (navOpposite) {
    navOpposite.querySelector('#js-XFUniqueId1')?.closest('div')?.remove();

    btn = document.createElement('div');
    btn.className = 'p-navgroup-link gm-navStyleBtn';
    btn.setAttribute('role', 'button');     // accessibility
    btn.textContent = 'Style';

    const firstLink = navOpposite.querySelector('.p-navgroup-link');
    if (firstLink && firstLink.textContent.trim() === 'Jump')
        firstLink.after(btn);
    else
      navOpposite.insertBefore(btn, navOpposite.firstChild);

    btn.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      togglePopup();
    };
  }

  /* ───── 5. Build popup once ───── */
  popup = buildPopup();
  document.body.appendChild(popup);

  /* ───── 6. Popup builder ───── */
  function buildPopup() {
    const p = Object.assign(document.createElement('div'), { id: 'gmStylePopup' });

    /* Light / Dark */
    const tiles = Object.assign(document.createElement('div'), { className: 'gm-tile-row' });
    tiles.append(makeTile('Light', LIGHT_ID, 'gm-light'),
                 makeTile('Dark',  DARK_ID,  'gm-dark'));
    p.appendChild(tiles);

    /* Font size */
    const fsRow = Object.assign(document.createElement('div'), { className: 'gm-font-row' });
    const num = Object.assign(document.createElement('input'), {
      type: 'number', step: '0.1', min: '10', max: '25', value: currentFontSize.toFixed(1)
    });
    fsRow.append(
      makeFSBtn('-1',  -1),  makeFSBtn('-0.1', -.1),
      num,
      makeFSBtn('+0.1',  .1),makeFSBtn('+1',    1)
    );
    p.appendChild(fsRow);
    num.addEventListener('change', () => applyFS(parseFloat(num.value)));

    /* Padding size */
    const padRow = Object.assign(document.createElement('div'), { className: 'gm-font-row' });
    const padNum = Object.assign(document.createElement('input'), {
      type: 'number', step: '0.1', min: '0', max: '80', value: currentPaddingSize.toFixed(1)
    });
    padRow.append(
      makePadBtn('-1',  -1),  makePadBtn('-0.1', -.1),
      padNum,
      makePadBtn('+0.1',  .1),makePadBtn('+1',    1)
    );
    p.appendChild(padRow);
    padNum.addEventListener('change', () => applyPad(parseFloat(padNum.value)));

    /* Uncenter / Unserif -------------------------------------------------- */
    const actRow = Object.assign(document.createElement('div'), { className: 'gm-tile-row' });

    function makeActBtn(txt, handler) {
        const b = Object.assign(document.createElement('button'), {
            className : 'gm-style-tile gm-light',
            textContent: txt,
            style      : 'height:auto; font-size:14px; line-height: 1.4; display: flex; align-items: center; justify-content: center;'
        });
        b.addEventListener('click', handler);
        return b;
    }

    actRow.append(
        makeActBtn('Uncenter', () => {
            document.querySelectorAll('.bbWrapper > div[style*="text-align: center"]').forEach(el => el.style.textAlign = '');
        }),
        makeActBtn('Unserif',  () => {
            document.querySelectorAll('.ffs').forEach(el => { el.classList.remove('ffs'); el.classList.add('ffss'); el.style.fontSize = ''; });
        })
    );
    p.appendChild(actRow);


    function makePadBtn(txt, delta) {
      const b = document.createElement('button');
      b.textContent = txt;
      b.addEventListener('click', () => applyPad(parseFloat(padNum.value) + delta));
      return b;
    }
    function applyPad(px) {
      px = clamp(Math.round(px * 10) / 10, 0, 80);
      padNum.value = px.toFixed(1);
      GM_setValue('paddingSize', px);
      updateAndApplyStyles(true); // Force immediate update on click
    }
    function makeFSBtn(txt, delta) {
      const b = document.createElement('button');
      b.textContent = txt;
      b.addEventListener('click', () => applyFS(parseFloat(num.value) + delta));
      return b;
    }
    function applyFS(px) {
      px = clamp(Math.round(px * 10) / 10, 10, 25);
      num.value = px.toFixed(1);
      GM_setValue('fontSize', px);
      updateAndApplyStyles(true); // Force immediate update on click
    }
    return p;
  }

  /* ───── 7. Style tiles ───── */
  function makeTile(label, id, cls) {
    const token = document.querySelector('input[name="_xfToken"]')?.value || '';
    const url   = `${STYLE_PATH}?style_id=${id}&_xfRedirect=/&t=${encodeURIComponent(token)}`;
    const a = Object.assign(document.createElement('a'), {
      className: `gm-style-tile ${cls}`,
      textContent: label,
      href: url
    });
    a.addEventListener('click', ev => {
      ev.preventDefault();
      fetch(url, { credentials: 'same-origin', mode: 'same-origin' })
        .then(r => { if (!r.ok) throw 0; return r.text(); })
        .then(() => location.reload())
        .catch(() => (location.href = url));
    });
    return a;
  }

  /* ───── 8. Popup show / hide ───── */
  function togglePopup() {
    popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
  }
  document.addEventListener('click', e => {
    if (popup && !popup.contains(e.target) && !e.target.closest('.gm-navStyleBtn'))
      popup.style.display = 'none';
  });

  // refresh style on alt-tab
  window.addEventListener('pageshow', (e) => { if (!e.persisted) return;
    CORRUPTED = false; // you just cant updateAndApplyStyles() until tab change
  });
  document.addEventListener('focus', () => { if (!CORRUPTED) setTimeout(() => updateAndApplyStyles(), 100); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden && !CORRUPTED) updateAndApplyStyles(); });

  // ========================================================== //
  if (!IS_THREAD) return;

  /* Post-processing for specific threads */
  if (document.URL.includes('.1140820/')) {
    const width = { 2: '50%', 3: '33.33%' };
    document.querySelectorAll('.bbTable table').forEach(t => {
      const cells = t.rows[0]?.cells;
      const n     = cells?.length;
      if (width[n]) {
        t.style.cssText = 'table-layout:fixed;width:100%';
        [...cells].forEach(c => (c.style.width = width[n]));
      }
    });
  }
});
