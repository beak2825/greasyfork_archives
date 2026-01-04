// ==UserScript==
// @name         Google - Full result titles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Expands truncated search result titles, using a simple clever fetching method. Also adds tooltips to see the full title on "top stories" and "what people are saying" ('title' attribute, no fetching necessary). If you disable auto expansion, you can hold Shift to fetch per-title, Shift+T expands all.
// @author       jackiechan285
// @match        https://www.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546269/Google%20-%20Full%20result%20titles.user.js
// @updateURL https://update.greasyfork.org/scripts/546269/Google%20-%20Full%20result%20titles.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /************* CONFIG *************/
  const FETCH_TIMEOUT = 10000; // ms
  const MIN_BASE_LEN = 5; // ignore very short bases
  const AUTO_EXPAND = true;            // auto-expand cut-off titles on load
  const AUTO_UNDERLINE = false;         // underline revealed part for auto-expanded (removed permanently when user presses Shift once)
  const AUTO_UNDERLINE_STYLE = 'underline';
  const REVEAL = { enabled: true, color: '#FF9AA2', transition: 'color .12s ease' };
  const TOP_STORIES_ANCESTOR_SELECTORS = ['.SoAPf', '.lSfe4c', 'g-scrolling-carousel'];
  const PEOPLE_SAYING_ANCESTOR_SELECTORS = ['.JJJtgd', '.reMwfc', '.g1y0jd'];
  const EXTRA_TITLE_SELECTORS = ['h3', '[role="heading"][aria-level]', '.tNxQIb', '.ynAwRc', '.cHaqb', 'shreddit-title'];
  /***********************************/

  // state
  const cache = new Map(); // href -> {status:'ok'|'notfound'|'error' , title?, msg?}
  let hoveredEl = null;
  let isShiftDown = false;
  let lastMouse = { x: 0, y: 0 };
  let underlinePermanentlyRemoved = false;
  let autoUnderlineEnabled = AUTO_UNDERLINE;

  // tooltip
  const tooltip = document.createElement('div');
  Object.assign(tooltip.style, {
    position: 'fixed', zIndex: 2147483647, padding: '6px 8px', fontSize: '12px',
    borderRadius: '6px', background: 'rgba(32,33,36,0.95)', color: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.4)', pointerEvents: 'none', display: 'none',
    maxWidth: '420px', whiteSpace: 'pre-wrap'
  });
  document.body.appendChild(tooltip);
  function showTooltipAt(text, x, y) {
    tooltip.textContent = text;
    tooltip.style.left = (x + 12) + 'px';
    tooltip.style.top = (y + 12) + 'px';
    tooltip.style.display = 'block';
  }
  function showTooltipNearElement(text, el) {
    try {
      const rect = el.getBoundingClientRect();
      const x = rect.right;
      const y = rect.top;
      showTooltipAt(text, Math.max(4, x), Math.max(4, y));
    } catch (e) {
      showTooltipAt(text, lastMouse.x, lastMouse.y);
    }
  }
  function hideTooltip() { tooltip.style.display = 'none'; tooltip.textContent = ''; }

  // mouse position
  document.addEventListener('mousemove', ev => {
    lastMouse.x = ev.clientX; lastMouse.y = ev.clientY;
    if (hoveredEl) {
      // don't show tooltip for top stories / people-saying candidates
      if (isTopStoryCandidate(hoveredEl) || isPeopleSayingCandidate(hoveredEl)) { hideTooltip(); return; }
      if (hoveredEl.dataset.gsReplaced === '1') { hideTooltip(); return; }
      const status = hoveredEl.dataset.gsStatus || 'Hold Shift to fetch full title';
      showTooltipAt(status, ev.clientX, ev.clientY);
    }
  });

  // keyboard
  document.addEventListener('keydown', ev => {
    const tg = ev.target;
    const isTyping = tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.isContentEditable);

    if (ev.key === 'Shift' && !isShiftDown) {
      isShiftDown = true;
      // if hovering an unfinished title, trigger fetch
      if (hoveredEl && hoveredEl.dataset && hoveredEl.dataset.gsReplaced !== '1' &&
          !isTopStoryCandidate(hoveredEl) && !isPeopleSayingCandidate(hoveredEl)) {
        triggerFetchFor(hoveredEl);
      }
      if (REVEAL.enabled) highlightAllRevealed(true);

      // Remove auto-underlines permanently once (per your request)
      if (AUTO_UNDERLINE && !underlinePermanentlyRemoved) {
        underlinePermanentlyRemoved = true;
        autoUnderlineEnabled = false;
        document.querySelectorAll('.gs-auto-underline').forEach(el => el.classList.remove('gs-auto-underline'));
      }
      return;
    }

    if (!isTyping && (ev.key === 'T' || ev.key === 't') && ev.shiftKey) {
      ev.preventDefault();
      expandAll();
      return;
    }
  });

  document.addEventListener('keyup', ev => {
    if (ev.key === 'Shift') {
      isShiftDown = false;
      if (REVEAL.enabled) highlightAllRevealed(false);
    }
  });

  // helpers
function normalizeWhitespace(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function stripTrailingEllipsis(s) {
  return String(s || '').replace(/(\u2026|\.\.\.|\s+\.\.\.)\s*$/, '').trim();
}

function decodeHTMLEntities(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

function normalizeChars(str) {
  str = decodeHTMLEntities(str);
  return str
    .replace(/[‘’‚‛]/g, "'")   // normalize single quotes
    .replace(/[“”„‟]/g, '"')   // normalize double quotes
    .replace(/–/g, '-')        // en-dash
    .replace(/—/g, '-')        // em-dash
    .replace(/…/g, '...')      // ellipsis
    .replace(/\u00A0/g, ' ');  // non-breaking space
}

function normalizeForCompare(s) {
  //return normalizeChars(normalizeWhitespace(s)).toLowerCase();
  return normalizeChars(normalizeWhitespace(s));
}

  function isRedditHref(href) {
    try { return (new URL(href)).host.includes('reddit.'); } catch (e) { return false; }
  }
  function isTopStoryCandidate(el) {
    if (!el) return false;
    for (const sel of TOP_STORIES_ANCESTOR_SELECTORS) { try { if (el.closest && el.closest(sel)) return true; } catch(e){} }
    return false;
  }
  function isPeopleSayingCandidate(el) {
    if (!el) return false;
    for (const sel of PEOPLE_SAYING_ANCESTOR_SELECTORS) { try { if (el.closest && el.closest(sel)) return true; } catch(e){} }
    return false;
  }

  // look for base inside full (flexible)
function findBaseInFull(full, base) {
  if (!full || !base) return null;

  // normalize both sides for consistent matching
  const fullNorm = normalizeForCompare(full);
  const baseNorm = normalizeForCompare(base);

  const idxDirect = fullNorm.indexOf(baseNorm);
  if (idxDirect >= 0) return { start: idxDirect, len: baseNorm.length };

  // fallback regex with normalized whitespace
  const esc = baseNorm.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+');
  try {
    const re = new RegExp(esc, 'i');
    const m = re.exec(fullNorm);
    if (m) return { start: m.index, len: m[0].length };
  } catch (err) {}

  return null;
}


  // robust title extraction from HTML doc with many fallbacks
  function findTitleInDoc(doc, baseNormalized) {
    try {
      const tTag = doc.querySelector && doc.querySelector('title');
      if (tTag && tTag.textContent) {
        const tt = normalizeWhitespace(tTag.textContent);
        if (normalizeForCompare(tt).includes(baseNormalized)) return tt;
      }
    } catch (e) {}
    try {
      const h1s = Array.from(doc.getElementsByTagName('h1') || []);
      for (const h1 of h1s) {
        const t = normalizeWhitespace(h1.textContent || '');
        if (!t) continue;
        if (normalizeForCompare(t).includes(baseNormalized)) return t;
        // aria-label fallback
        const al = (h1.getAttribute && h1.getAttribute('aria-label')) || '';
        if (al && normalizeForCompare(al).includes(baseNormalized)) return normalizeWhitespace(al);
      }
    } catch (e) {}
    try {
      const h2s = Array.from(doc.getElementsByTagName('h2') || []);
      for (const h2 of h2s) {
        const t = normalizeWhitespace(h2.textContent || '');
        if (!t) continue;
        if (normalizeForCompare(t).includes(baseNormalized)) return t;
      }
    } catch (e) {}
    try {
      const og = doc.querySelector('meta[property="og:title"], meta[name="og:title"], meta[name="twitter:title"]');
      if (og && (og.content || og.getAttribute('content'))) {
        const t = normalizeWhitespace(og.content || og.getAttribute('content'));
        if (normalizeForCompare(t).includes(baseNormalized)) return t;
      }
    } catch (e) {}
    // heuristic: elements with id/class containing 'post-title' or 'title' or 'headline'
    try {
      const candidates = Array.from(doc.querySelectorAll('[id],[class]'));
      for (const c of candidates) {
        const id = (c.id || '').toLowerCase();
        const cls = (c.className || '').toString().toLowerCase();
        if (id.includes('post-title') || cls.includes('post-title') || cls.includes('post-title') || cls.includes('headline') || cls.includes('post')) {
          const t = normalizeWhitespace(c.textContent || '');
          if (t && normalizeForCompare(t).includes(baseNormalized)) return t;
          // aria-label fallback
          const al = (c.getAttribute && c.getAttribute('aria-label')) || '';
          if (al && normalizeForCompare(al).includes(baseNormalized)) return normalizeWhitespace(al);
        }
      }
    } catch (e) {}
    // last resort: loose text search in significant text nodes
    try {
      const textNodes = Array.from(doc.querySelectorAll('p,div,span'));
      for (const node of textNodes) {
        const t = normalizeWhitespace(node.textContent || '');
        if (!t) continue;
        if (t.length > baseNormalized.length && normalizeForCompare(t).includes(baseNormalized)) return t;
      }
    } catch (e) {}
    return null;
  }

  // set status on element and show tooltip near element on failures (immediate)
  function setStatus(el, txt, showNow=false) {
    if (!el) return;
    el.dataset.gsStatus = txt;
    //if (showNow) showTooltipNearElement(txt, el);
    /*else*/ if (el === hoveredEl && el.dataset.gsReplaced !== '1') showTooltipAt(txt, lastMouse.x, lastMouse.y);
  }

  // attempt to fetch reddit JSON (fast and reliable for post title)
  function fetchRedditJson(h3, href, baseTitle, cb) {
    try {
      let jsonUrl = href;
      // normalize: if there's a query/hash, remove them for .json append
      const u = new URL(href);
      // ensure path ends with '/'
      if (!u.pathname.endsWith('/')) u.pathname += '/';
      jsonUrl = `${u.origin}${u.pathname}.json`;
      GM_xmlhttpRequest({
        method: 'GET', url: jsonUrl, timeout: FETCH_TIMEOUT,
        onload(resp) {
          try {
            const parsed = JSON.parse(resp.responseText);
            // Reddit posts return an array; title usually at [0].data.children[0].data.title
            const t = parsed && parsed[0] && parsed[0].data && parsed[0].data.children && parsed[0].data.children[0] && parsed[0].data.children[0].data && parsed[0].data.children[0].data.title;
            if (t && normalizeForCompare(t).includes(normalizeForCompare(baseTitle))) {
              cb(null, t);
              return;
            }
            // else fallback to HTML parsing by signaling "notfound"
            cb(new Error('no-title-in-json'), null);
          } catch (err) {
            cb(err, null);
          }
        },
        onerror(err) { cb(new Error('network error'), null); },
        ontimeout() { cb(new Error('timeout'), null); }
      });
    } catch (err) {
      cb(err, null);
    }
  }

  // primary fetch routine (prefers reddit JSON when reddit link)
  function fetchAndProcess(h3, href, baseTitle) {
    const baseNormalized = normalizeForCompare(baseTitle);
    if (!baseNormalized || baseTitle.length < MIN_BASE_LEN) {
      setStatus(h3, 'Title too short to fetch full title.', true);
      return;
    }

    // If we previously cached an OK result, reuse it. If cached error, allow retry by clearing cache for this href.
    if (cache.has(href) && cache.get(href).status === 'ok') {
      applyCacheResult(h3, cache.get(href), baseTitle);
      return;
    }
    if (cache.has(href) && cache.get(href).status !== 'ok') {
      cache.delete(href); // allow retry attempts
    }

    setStatus(h3, 'Fetching full title...');
    cache.set(href, { status: 'fetching' });

    // If reddit, try .json first (more reliable)
    if (isRedditHref(href)) {
      fetchRedditJson(h3, href, baseTitle, (err, titleFromJson) => {
        if (!err && titleFromJson) {
          const res = { status: 'ok', title: normalizeForCompare(titleFromJson) };
          cache.set(href, res);
          applyCacheResult(h3, res, baseTitle);
          return;
        }
        // else fallback to normal HTML fetch (try HTML parsing)
        doHtmlFetch();
      });
    } else {
      doHtmlFetch();
    }

    function doHtmlFetch() {
      GM_xmlhttpRequest({
        method: 'GET', url: href, timeout: FETCH_TIMEOUT,
        onload(resp) {
          try {
            // If the response looks like JSON even though not reddit, attempt to parse JSON
            const txt = resp.responseText || '';
            const firstNonWs = txt.trim().charAt(0);
            if (firstNonWs === '{' || firstNonWs === '[') {
              try {
                const parsed = JSON.parse(txt);
                // If some sites return JSON with useful title fields, attempt to extract probable fields
                let candidate = parsed.title || parsed.name || (parsed.data && parsed.data.title) || null;
                if (candidate && normalizeForCompare(candidate).includes(baseNormalized)) {
                  const res = { status: 'ok', title: normalizeForCompare(candidate) };
                  cache.set(href, res);
                  applyCacheResult(h3, res, baseTitle);
                  return;
                }
                // else continue to HTML parsing fallback below
              } catch (e) {
                // ignore JSON parse error and continue to HTML parsing
              }
            }

            // Try to parse HTML and extract title with many fallbacks
            const parser = new DOMParser();
            const doc = parser.parseFromString(txt, 'text/html');
            const found = findTitleInDoc(doc, baseNormalized);
            if (found) {
              const res = { status: 'ok', title: normalizeForCompare(found) };
              cache.set(href, res);
              applyCacheResult(h3, res, baseTitle);
            } else {
              const res = { status: 'notfound', msg: 'No matching title/h1/h2/meta/aria found in HTML.' };
              cache.set(href, res);
              applyCacheResult(h3, res, baseTitle);
            }
          } catch (err) {
            const res = { status: 'error', msg: 'Parse error: ' + (err && err.message ? err.message : err) };
            cache.set(href, res);
            applyCacheResult(h3, res, baseTitle);
          }
        },
        onerror() {
          const res = { status: 'error', msg: 'Network error' };
          cache.set(href, res);
          applyCacheResult(h3, res, baseTitle);
        },
        ontimeout() {
          const res = { status: 'error', msg: 'Request timed out' };
          cache.set(href, res);
          applyCacheResult(h3, res, baseTitle);
        }
      });
    }
  }

  // apply results (ok / notfound / error)
  function applyCacheResult(h3, cached, baseTitle) {
    if (!h3) return;
    if (cached.status === 'fetching') { setStatus(h3, 'Still fetching...'); return; }

    if (cached.status === 'ok') {
      const full = cached.title || '';
      const base = stripTrailingEllipsis(baseTitle || '');
      const match = findBaseInFull(full, base);
      let prefix = full, suffix = '';
      if (match) { prefix = full.substring(0, match.start + match.len); suffix = full.substring(match.start + match.len); }
      else { prefix = full; suffix = ''; }
      const esc = s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

      h3.innerHTML = `<span class="gs-full-prefix">${esc(prefix)}</span><span class="gs-full-suffix">${esc(suffix)}</span>`;
      h3.dataset.gsFullTitle = full;
      h3.dataset.gsBaseTitle = base;
      h3.dataset.gsReplaced = '1';
      ensureStylesInjected();

      // mark auto-underlines only if this came from AUTO_EXPAND and autoUnderlineEnabled is true
      if (h3._gsAutoExpanded && autoUnderlineEnabled) h3.classList.add('gs-auto-underline');

      setStatus(h3, `Replaced — full title found (+${full.length - (baseTitle||'').length} chars).`);
      if (hoveredEl === h3) hideTooltip();

      // reveal on hover
      if (REVEAL.enabled) {
        const suffixNode = h3.querySelector('.gs-full-suffix');
        if (suffixNode) {
          suffixNode.style.transition = REVEAL.transition;
          suffixNode.style.color = 'inherit';
        }
        h3.addEventListener('mouseenter', onHoverReveal);
        h3.addEventListener('mouseleave', onLeaveReveal);
        h3.addEventListener('focus', onHoverReveal, true);
        h3.addEventListener('blur', onLeaveReveal, true);
      }
      // clear any failure flag
      delete h3.dataset.gsFailed;
    } else {
      // notfound or error
      const message = cached.msg || 'Unknown error';
      setStatus(h3, `Failed: ${message}`, true); // show tooltip immediately near element
      h3.dataset.gsFailed = '1';
      // make sure retry possible by clicking (see attach handler)
    }
  }

  function onHoverReveal(ev) {
    const el = ev.currentTarget;
    const suffix = el.querySelector('.gs-full-suffix');
    if (suffix) suffix.style.color = REVEAL.color;
  }
  function onLeaveReveal(ev) {
    const el = ev.currentTarget;
    const suffix = el.querySelector('.gs-full-suffix');
    if (suffix) suffix.style.color = 'inherit';
  }

  // trigger fetch (respects caching for OK; clears cache on previous errors allowing retry)
  function triggerFetchFor(h3) {
    if (!shouldAttach(h3)) return;
    if (isTopStoryCandidate(h3) || isPeopleSayingCandidate(h3)) return; // they don't fetch
    const a = h3.closest('a[href]');
    if (!a) { setStatus(h3, 'No link target found for this title.', true); return; }
    const href = a.href;
    const rawTitle = (h3.textContent || '').trim();
    const base = stripTrailingEllipsis(rawTitle);

    // if previously failed and cached as not ok, clear entry to allow fresh attempt
    if (cache.has(href) && cache.get(href).status !== 'ok') cache.delete(href);

    h3.dataset.gsFetchTried = '1';
    fetchAndProcess(h3, href, base);
  }

  // attach to candidate elements
  function attachTo(h3) {
    if (!h3 || h3.dataset.gsAttached === '1') return;
    h3.dataset.gsAttached = '1';

    // special shrreddit-title handling: prefer provided title attribute
    if (h3.tagName && h3.tagName.toLowerCase() === 'shreddit-title') {
      try {
        const t = h3.getAttribute('title');
        if (t) {
          h3.textContent = t;
          h3.dataset.gsFullTitle = t;
          h3.dataset.gsBaseTitle = t;
          h3.dataset.gsReplaced = '1';
          ensureStylesInjected();
        }
      } catch (e) {}
      return;
    }

    // mouseenter / leave
    h3.addEventListener('mouseenter', ev => {
      hoveredEl = h3;
      // top stories / people-saying: only add native title attribute; no tooltip and no fetch
      if (isTopStoryCandidate(h3) || isPeopleSayingCandidate(h3)) {
        try { if (!h3.getAttribute('title')) h3.setAttribute('title', normalizeWhitespace(h3.textContent || '')); } catch(e){}
        hideTooltip(); return;
      }

      if (h3.dataset.gsReplaced === '1') { hideTooltip(); return; }
      const raw = (h3.textContent || '').trim();
      const base = stripTrailingEllipsis(raw);
      const hint = base.length >= MIN_BASE_LEN ? 'Hold Shift to fetch full title' : 'Title too short to fetch';
      setStatus(h3, hint);
      showTooltipAt(h3.dataset.gsStatus || hint, ev.clientX, ev.clientY);
      if (ev.shiftKey) triggerFetchFor(h3);
    });

    h3.addEventListener('mouseleave', () => { if (hoveredEl === h3) hoveredEl = null; hideTooltip(); });

    // click behavior:
    // - If previously failed -> single-click retries (prevents navigation)
    // - Otherwise, Shift+click retries (prevents navigation)
    h3.addEventListener('click', ev => {
      const failed = h3.dataset.gsFailed === '1';
      const isTopOrPeople = isTopStoryCandidate(h3) || isPeopleSayingCandidate(h3);
      if (failed && !isTopOrPeople) {
        ev.preventDefault();
        // clear cache for this href (if any) and retry
        const a = h3.closest('a[href]'); if (!a) return;
        const href = a.href; if (cache.has(href) && cache.get(href).status !== 'ok') cache.delete(href);
        triggerFetchFor(h3);
        return;
      }
      if (ev.shiftKey && !isTopOrPeople) {
        ev.preventDefault();
        triggerFetchFor(h3);
        return;
      }
      // otherwise, allow navigation normally (user may ctrl/cmd click to open in new tab)
    });
  }

  function shouldAttach(h3) {
    if (!h3 || !(h3 instanceof HTMLElement)) return false;
    // shrreddit-title always attach
    if (h3.tagName && h3.tagName.toLowerCase() === 'shreddit-title') return true;
    const a = h3.closest && h3.closest('a[href]');
    if (!a) {
      // allow top stories / people-saying to attach even without link
      if (!isTopStoryCandidate(h3) && !isPeopleSayingCandidate(h3)) return false;
    }
    const txt = (h3.textContent || '').trim(); if (!txt) return false;
    if (isTopStoryCandidate(h3) || isPeopleSayingCandidate(h3)) return true;
    // only attach to cut-off titles (end with ellipsis)
    if (/(\u2026|\.\.\.)\s*$/.test(txt)) return true;
    return false;
  }

  // scanning & mutation
  const selector = EXTRA_TITLE_SELECTORS.join(',');
  function scanAndAttach(root = document) {
    try {
      const nodes = root.querySelectorAll ? Array.from(root.querySelectorAll(selector)) : [];
      nodes.forEach(node => { if (shouldAttach(node)) attachTo(node); });
    } catch (e) {}
  }

  const mo = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach(n => {
          if (n.nodeType !== 1) return;
          scanAndAttach(n);
          if (AUTO_EXPAND) {
            try {
              const nodes = Array.from(n.querySelectorAll ? n.querySelectorAll(selector) : []);
              nodes.forEach(node => { if (shouldAttach(node)) autoExpandNode(node); });
            } catch (e) {}
          }
        });
      }
    }
  });
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

  // styles and reveal/underline support
  let stylesInjected = false;
  function ensureStylesInjected() {
    if (stylesInjected) return;
    stylesInjected = true;
    const css = `
.gs-full-prefix { white-space: normal; }
.gs-full-suffix { white-space: normal; color: inherit; transition: ${REVEAL.transition}; }
.gs-auto-underline .gs-full-suffix { text-decoration: ${AUTO_UNDERLINE_STYLE}; text-decoration-thickness: 1px; text-decoration-color: currentColor; }
`;
    const st = document.createElement('style'); st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }

  // highlight all expanded suffixes (used on Shift)
  function highlightAllRevealed(on) {
    const suffixes = Array.from(document.querySelectorAll('.gs-full-suffix'));
    suffixes.forEach(s => { s.style.color = on ? REVEAL.color : 'inherit'; });
  }

  // expand all (Shift+T)
  function expandAll() {
    const allCandidates = Array.from(document.querySelectorAll(selector));
    const targets = allCandidates.filter(h3 => shouldAttach(h3) && !isTopStoryCandidate(h3) && !isPeopleSayingCandidate(h3));
    targets.forEach(h3 => triggerFetchFor(h3));
  }

  // auto-expand behavior
  function autoExpandNode(h3) {
    if (!h3) return;
    if (isTopStoryCandidate(h3) || isPeopleSayingCandidate(h3)) {
      try { if (!h3.getAttribute('title')) h3.setAttribute('title', normalizeWhitespace(h3.textContent || '')); } catch(e){}
      return;
    }
    if (h3.tagName && h3.tagName.toLowerCase() === 'shreddit-title') {
      try {
        const t = h3.getAttribute('title');
        if (t) { h3.textContent = t; h3.dataset.gsFullTitle = t; h3.dataset.gsBaseTitle = t; h3.dataset.gsReplaced = '1'; ensureStylesInjected(); }
      } catch(e){}
      return;
    }
    h3._gsAutoExpanded = true;
    triggerFetchFor(h3);
  }

  // initial scan + auto expand
  scanAndAttach();
  ensureStylesInjected();
  if (AUTO_EXPAND) {
    setTimeout(() => {
      scanAndAttach();
      const candidates = Array.from(document.querySelectorAll(selector)).filter(n => shouldAttach(n));
      candidates.forEach(n => autoExpandNode(n));
    }, 800);
  }

  // clean up
  window.addEventListener('beforeunload', () => { try { tooltip.remove(); } catch (e) {} });

})();
