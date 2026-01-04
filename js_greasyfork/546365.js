// ==UserScript==
// @name         Scratch Moderation Status + Index Badge
// @namespace    https://scratch.mit.edu/
// @version      1.4.0
// @description  Show moderation and indexing status of a project.
// @match        https://scratch.mit.edu/projects/*
// @run-at       document-idle
// @grant        GM_addStyle
// @license      MIT
// @author       scratchinghead
// @downloadURL https://update.greasyfork.org/scripts/546365/Scratch%20Moderation%20Status%20%2B%20Index%20Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/546365/Scratch%20Moderation%20Status%20%2B%20Index%20Badge.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(`
    .spmsb-badges {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-left: 8px;
    }
    .spmsb-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      border-radius: 999px;
      font: 600 12px/1 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      color: #0b1020;
      background: #eef2f7;
      border: 1px solid rgba(0,0,0,.08);
      box-shadow: 0 1px 2px rgba(0,0,0,.06);
      white-space: nowrap;
      user-select: none;
    }
    .spmsb-dot { width: 8px; height: 8px; border-radius: 999px; background:#9ca3af; }
    /* moderation colors */
    .spmsb-safe .spmsb-dot { background:#10b981; }        /* green */
    .spmsb-notsafe .spmsb-dot { background:#ef4444; }     /* red */
    .spmsb-notreviewed .spmsb-dot { background:#f59e0b; } /* amber */
    .spmsb-unknown .spmsb-dot { background:#6b7280; }     /* gray */
    .spmsb-muted { opacity:.85 }
    /* index colors */
    .spmsb-index-yes .spmsb-dot { background:#10b981; }   /* green */
    .spmsb-index-no  .spmsb-dot { background:#ef4444; }   /* red */
    .spmsb-index-maybe .spmsb-dot { background:#f59e0b; } /* amber */
  `);

  const waitForElement = (selector, { root = document, timeout = 10000 } = {}) =>
    new Promise((resolve, reject) => {
      const el = root.querySelector(selector);
      if (el) return resolve(el);
      const obs = new MutationObserver(() => {
        const e2 = root.querySelector(selector);
        if (e2) {
          obs.disconnect();
          resolve(e2);
        }
      });
      obs.observe(root, { childList: true, subtree: true });
      if (timeout) {
        setTimeout(() => {
          obs.disconnect();
          reject(new Error(`Timeout waiting for ${selector}`));
        }, timeout);
      }
    });

  const getProjectIdFromLocation = () => {
    const m = location.pathname.match(/^\/projects\/(\d+)\/?/);
    return m ? m[1] : null;
  };

  const ensureBadges = async () => {
    const controls = await waitForElement('.controls_controls-container_FKkXX').catch(() => null);
    if (!controls) return null;

    let wrap = controls.querySelector(':scope > .spmsb-badges');
    if (!wrap) {
      wrap = document.createElement('span');
      wrap.className = 'spmsb-badges';
      controls.appendChild(wrap);
    }

    let mod = wrap.querySelector(':scope > .spmsb-badge[data-kind="mod"]');
    if (!mod) {
      mod = document.createElement('span');
      mod.className = 'spmsb-badge spmsb-unknown spmsb-muted';
      mod.dataset.kind = 'mod';
      mod.innerHTML = `<span class="spmsb-dot"></span><span class="spmsb-text">Moderation: Loading…</span>`;
      wrap.appendChild(mod);
    }

    let idx = wrap.querySelector(':scope > .spmsb-badge[data-kind="index"]');
    if (!idx) {
      idx = document.createElement('span');
      idx.className = 'spmsb-badge spmsb-unknown spmsb-muted';
      idx.dataset.kind = 'index';
      idx.innerHTML = `<span class="spmsb-dot"></span><span class="spmsb-text">Index: Loading…</span>`;
      wrap.appendChild(idx);
    }

    return { wrap, mod, idx };
  };

  const setBadge = async (kind, status, note) => {
    const holders = await ensureBadges();
    if (!holders) return;
    const badge = kind === 'index' ? holders.idx : holders.mod;
    if (!badge) return;

    // reset classes
    badge.className = 'spmsb-badge';
    const txt = badge.querySelector('.spmsb-text');

    if (kind === 'mod') {
      const map = {
        safe:        { cls: 'spmsb-safe',        label: 'Reviewed: Safe' },
        notsafe:     { cls: 'spmsb-notsafe',     label: 'Marked NFE (Not For Everyone)' },
        notreviewed: { cls: 'spmsb-notreviewed', label: 'Not Reviewed' },
        nodata:      { cls: 'spmsb-unknown',     label: 'No Remix Data' },
        error:       { cls: 'spmsb-unknown spmsb-muted', label: 'Status unavailable' },
        unknown:     { cls: 'spmsb-unknown',     label: 'Status: Unknown' },
      };
      const meta = map[status] || map.unknown;
      badge.className = `spmsb-badge ${meta.cls}`;
      txt.textContent = note ? `${meta.label} — ${note}` : meta.label;
    } else {
      const map = {
        yes:    { cls: 'spmsb-index-yes',   label: 'Indexed' },
        no:     { cls: 'spmsb-index-no',    label: 'Not Indexed' },
        maybe:  { cls: 'spmsb-index-maybe', label: 'Index check: Partial' },
        error:  { cls: 'spmsb-unknown spmsb-muted', label: 'Index check failed' },
        busy:   { cls: 'spmsb-unknown spmsb-muted', label: 'Index: Checking…' },
        unknown:{ cls: 'spmsb-unknown',     label: 'Index: Unknown' },
      };
      const meta = map[status] || map.unknown;
      badge.className = `spmsb-badge ${meta.cls}`;
      txt.textContent = note ? `${meta.label} — ${note}` : meta.label;
    }
  };

  function decodeHTML(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  function extractBalancedObject(source, startIdx) {
    let i = startIdx;
    let depth = 0;
    let inStr = null;
    let esc = false;

    while (i < source.length) {
      const ch = source[i];

      if (inStr) {
        if (esc) {
          esc = false;
        } else if (ch === '\\') {
          esc = true;
        } else if (ch === inStr) {
          inStr = null;
        }
        i++;
        continue;
      }

      if (ch === '"' || ch === "'" || ch === '`') {
        inStr = ch;
        i++;
        continue;
      }

      if (ch === '{') depth++;
      if (ch === '}') {
        depth--;
        if (depth === 0) {
          return source.slice(startIdx, i + 1);
        }
      }
      i++;
    }
    return null;
  }

  function extractProjectDataFromHTML(html) {
    const reJSONParse = /\bprojectData\s*=\s*JSON\.parse\(\s*(['"])([\s\S]*?)\1\s*\)/i;
    const mParse = reJSONParse.exec(html);
    if (mParse) {
      try {
        return JSON.parse(decodeHTML(mParse[2]));
      } catch {}
    }

    const reAssign = /\b(?:(?:var|let|const)\s+|window\.\s*)?projectData\s*=\s*/ig;
    let m;
    while ((m = reAssign.exec(html))) {
      let i = reAssign.lastIndex;
      while (i < html.length && /\s/.test(html[i])) i++;
      if (html[i] !== '{') continue;
      const objText = extractBalancedObject(html, i);
      if (!objText) continue;

      try {
        return JSON.parse(objText);
      } catch {
        try {
          return (new Function('"use strict";return (' + objText + ')'))();
        } catch {}
      }
    }

    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const scripts = Array.from(doc.querySelectorAll('script'));
      for (const s of scripts) {
        const t = s.textContent || '';
        const mp = reJSONParse.exec(t);
        if (mp) {
          try { return JSON.parse(decodeHTML(mp[2])); } catch {}
        }
        reAssign.lastIndex = 0;
        let mm;
        while ((mm = reAssign.exec(t))) {
          let j = reAssign.lastIndex;
          while (j < t.length && /\s/.test(t[j])) j++;
          if (t[j] !== '{') continue;
          const objText = extractBalancedObject(t, j);
          if (!objText) continue;
          try { return JSON.parse(objText); } catch {
            try { return (new Function('"use strict";return (' + objText + ')'))(); } catch {}
          }
        }
      }
    } catch {}

    return null;
  }

  async function fetchModerationStatus(projectId) {
    if (!projectId) { setBadge('mod','error'); return; }
    await setBadge('mod','unknown','Fetching…');
    try {
      const res = await fetch(`https://scratch.mit.edu/projects/${projectId}/remixtree/`, { credentials: 'include' });
      const html = await res.text();

      const projectData = extractProjectDataFromHTML(html);
      if (!projectData) {
        await setBadge('mod','nodata','projectData missing');
        return;
      }
      const node = projectData[String(projectId)];
      const status = node?.moderation_status;

      if (status === 'safe') {
        await setBadge('mod','safe');
      } else if (status === 'notsafe') {
        await setBadge('mod','notsafe');
      } else if (status === 'notreviewed') {
        await setBadge('mod','notreviewed');
      } else if (status == null) {
        await setBadge('mod','nodata','status missing');
      } else {
        await setBadge('mod','unknown', String(status));
      }
    } catch {
      await setBadge('mod','error');
    }
  }

  async function fetchProjectTitle(projectId) {
    const res = await fetch(`https://api.scratch.mit.edu/projects/${projectId}`);
    if (!res.ok) throw new Error('project API failed');
    const j = await res.json();
    return (j && typeof j.title === 'string') ? j.title : null;
  }

    async function isIndexedByTitleAndId(title, projectId) {
        const limit = 40;
        const maxPages = 10;

        // Split by "/", trim parts, dedupe, drop empties
        const parts = Array.from(
            new Set(
                title.split("/").map(s => s.trim()).filter(Boolean)
            )
        );

        for (const part of parts) {
            const q = encodeURIComponent(part);
            let offset = 0;

            for (let page = 0; page < maxPages; page++) {
                const url = `https://api.scratch.mit.edu/search/projects?limit=${limit}&offset=${offset}&language=en&mode=popular&q=${q}`;
                const res = await fetch(url);
                if (!res.ok) break;
                const arr = await res.json();
                if (!Array.isArray(arr) || arr.length === 0) break;

                const found = arr.some(p => p && String(p.id) === String(projectId));
                if (found) return true;

                if (arr.length < limit) break; // no more pages
                offset += limit;

                await new Promise(r => setTimeout(r, 200)); // be polite
            }
        }

        return false;
    }

  async function fetchIndexStatus(projectId) {
    if (!projectId) { setBadge('index','error'); return; }
    await setBadge('index','busy');
    try {
      const title = await fetchProjectTitle(projectId);
      if (!title) {
        await setBadge('index','error','No title');
        return;
      }
      const indexed = await isIndexedByTitleAndId(title, projectId);
      if (indexed) {
        await setBadge('index','yes');
      } else {
        await setBadge('index','no');
      }
    } catch (e) {
      await setBadge('index','error');
    }
  }

  let lastProjectId = null;
  const runForCurrentPage = async () => {
    const pid = getProjectIdFromLocation();
    if (!pid || pid === lastProjectId) return;
    lastProjectId = pid;
    await ensureBadges();
    fetchModerationStatus(pid);
    fetchIndexStatus(pid);
  };

  runForCurrentPage();

  const _pushState = history.pushState;
  const _replaceState = history.replaceState;
  history.pushState = function () { const ret = _pushState.apply(this, arguments); window.dispatchEvent(new Event('spmsb:navigation')); return ret; };
  history.replaceState = function () { const ret = _replaceState.apply(this, arguments); window.dispatchEvent(new Event('spmsb:navigation')); return ret; };
  window.addEventListener('popstate', () => window.dispatchEvent(new Event('spmsb:navigation')));
  window.addEventListener('spmsb:navigation', () => setTimeout(runForCurrentPage, 60));

  let lastHref = location.href;
  setInterval(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      runForCurrentPage();
    }
  }, 500);
})();
