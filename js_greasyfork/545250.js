// ==UserScript==
// @name         Instagram Max-Images Download ALL
// @namespace    local.insta.tools
// @version      0.7.1
// @description  任意の画像ポストページで最大解像度URLを一覧表示。一括タブ開き、一括ダウンロード機能あり　※表示されない場合はリロードしてください※
// @match        https://www.instagram.com/*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_download
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545250/Instagram%20Max-Images%20Download%20ALL.user.js
// @updateURL https://update.greasyfork.org/scripts/545250/Instagram%20Max-Images%20Download%20ALL.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PANEL_ID = 'ig-maximg-panel';
  let lastPathname = location.pathname;
  let initialized = false;

  // ユーザー名あり/なしの /p/ パターンを両対応
  const isPostPage = () => /^\/(?:[^/]+\/)?p\/[^/]+\/?$/i.test(location.pathname);

  const addStyle = (css) => {
    if (typeof GM_addStyle === 'function') return GM_addStyle(css);
    const s = document.createElement('style'); s.textContent = css;
    document.head.appendChild(s); return s;
  };

  const removePanel = () => {
    const el = document.getElementById(PANEL_ID);
    if (el) el.remove();
  };

  const ensurePanel = () => {
    let panel = document.getElementById(PANEL_ID);
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="igmi-header">
        Max Image URLs
        <button class="igmi-btn igmi-open" title="全画像を別タブで開く">Open All</button>
        <button class="igmi-btn igmi-dl" title="全画像をダウンロード">Download All</button>
        <span class="igmi-count"></span>
      </div>
      <div class="igmi-body"><ul class="igmi-list"></ul></div>
    `;
    document.documentElement.appendChild(panel);
    addStyle(`
      #${PANEL_ID}{position:fixed;top:10px;right:10px;z-index:2147483647;background:#111;color:#fff;padding:10px 12px;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,.35);font:12px/1.4 -apple-system,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:360px}
      #${PANEL_ID} .igmi-header{font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
      #${PANEL_ID} .igmi-body{max-height:300px;overflow:auto}
      #${PANEL_ID} .igmi-list{list-style:none;margin:0;padding:0}
      #${PANEL_ID} .igmi-list li{margin:4px 0;word-break:break-all}
      #${PANEL_ID} a{color:#9cd3ff;text-decoration:underline}
      #${PANEL_ID} .igmi-count{opacity:.8;margin-left:auto}
      #${PANEL_ID} .igmi-btn{background:#2b5cff;color:#fff;border:none;border-radius:8px;padding:3px 7px;cursor:pointer;font-weight:600}
      #${PANEL_ID} .igmi-btn:active{transform:translateY(1px)}
    `);
    return panel;
  };

  // 画像URL抽出（埋め込みJSON優先→DOMフォールバック）＋重複除去
  const pickMaxFromCandidates = (cands, urlKey='url', wKey='width', hKey='height') => {
    if (!Array.isArray(cands) || !cands.length) return null;
    const sorted = [...cands].sort((a,b)=>((a[wKey]||0)*(a[hKey]||0))-((b[wKey]||0)*(b[hKey]||0)));
    return sorted.at(-1)?.[urlKey] || null;
  };
  const pickMaxFromDisplayResources = (arr) => {
    if (!Array.isArray(arr) || !arr.length) return null;
    const s = [...arr].sort((a,b)=>((a.config_width||a.width||0)*(a.config_height||a.height||0))-((b.config_width||b.width||0)*(b.config_height||b.height||0)));
    return s.at(-1)?.src || s.at(-1)?.srcset || null;
  };
  const findNodeByShortcode = (node, shortcode) => {
    try {
      if (!node) return null;
      if (typeof node === 'object') {
        if (node.shortcode === shortcode || node.code === shortcode) return node;
        for (const k in node) {
          const hit = findNodeByShortcode(node[k], shortcode);
          if (hit) return hit;
        }
      } else if (Array.isArray(node)) {
        for (const v of node) {
          const hit = findNodeByShortcode(v, shortcode);
          if (hit) return hit;
        }
      }
      return null;
    } catch { return null; }
  };
  const extractFromMediaNode = (media) => {
    const urls = [];
    const pushFromNode = (n) => {
      if (!n || n.is_video || n.video_versions) return;
      if (n.image_versions2?.candidates) {
        const u = pickMaxFromCandidates(n.image_versions2.candidates, 'url', 'width', 'height');
        if (u) urls.push(u);
        return;
      }
      const u2 = pickMaxFromDisplayResources(n.display_resources || n.thumbnail_resources);
      if (u2) { urls.push(u2); return; }
      if (typeof n.display_url === 'string') urls.push(n.display_url);
      else if (typeof n.thumbnail_src === 'string') urls.push(n.thumbnail_src);
    };
    const edges = media.edge_sidecar_to_children?.edges || media.carousel_media?.map(x=>({node:x})) || [];
    if (edges.length) edges.forEach(e=>pushFromNode(e.node||e));
    else pushFromNode(media);
    return urls;
  };
  const collectFromEmbeddedJSON_scoped = (shortcode) => {
    const urls = new Set();
    const tryParse = (txt) => {
      try {
        const j = JSON.parse(txt);
        const media = findNodeByShortcode(j, shortcode);
        if (media) extractFromMediaNode(media).forEach(u=>urls.add(u));
      } catch {}
    };
    const nextEl = document.querySelector('script#__NEXT_DATA__');
    if (nextEl?.textContent) tryParse(nextEl.textContent);
    document.querySelectorAll('script[type="application/json"]').forEach(s=>{
      if (s===nextEl) return;
      const t = s.textContent?.trim();
      if (t && t.length>2) tryParse(t);
    });
    return [...urls].filter(u=>/^https?:\/\//.test(u) && !/\.mp4(\?|$)/i.test(u));
  };
  const collectFromDom_scoped = () => {
    const set = new Set();
    const parseSrcsetMax = (srcset) => {
      if (!srcset) return null;
      try {
        const parts = srcset.split(',').map(x=>x.trim()).filter(Boolean);
        let best=null,bestW=-1;
        for (const p of parts) {
          const m=p.match(/^(\S+)\s+(\d+)w$/);
          if (m){const url=m[1],w=parseInt(m[2],10);if(w>bestW){bestW=w;best=url;}}
          else if (!best) best=p.split(' ')[0];
        }
        return best;
      } catch { return null; }
    };
    const mainArticle = document.querySelector('main article') || document.querySelector('article');
    if (mainArticle) {
      mainArticle.querySelectorAll('img').forEach(img=>{
        const u = parseSrcsetMax(img.getAttribute('srcset')) || img.getAttribute('src');
        if (u && !/\.mp4(\?|$)/i.test(u)) set.add(u);
      });
    }
    return [...set];
  };
  const normalizeKey = (u) => {
    try {
      const url = new URL(u);
      const cacheKey = url.searchParams.get('ig_cache_key');
      if (cacheKey) return `igk:${cacheKey}`;
      const fname = url.pathname.split('/').filter(Boolean).pop() || url.pathname;
      return `fn:${fname.toLowerCase()}`;
    } catch { return `raw:${u}`; }
  };
  const rank = (u) => {
    let score = 0;
    if (/\/s\d+x\d+\//.test(u)) score += 1;
    if (/[?&]stp=/.test(u)) score += 1;
    return score;
  };
  const dedupePreferBest = (urls) => {
    const sorted = [...urls].sort((a,b)=>rank(a)-rank(b));
    const seen = new Set(); const out = [];
    for (const u of sorted) {
      const key = normalizeKey(u);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(u);
    }
    return out;
  };

  // 描画 & ボタン
  const render = (urls) => {
    const panel = ensurePanel();
    const list = panel.querySelector('.igmi-list');
    list.innerHTML = '';
    urls.forEach((u, i) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = u; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.textContent = `画像${i + 1}`;
      li.appendChild(a); list.appendChild(li);
    });
    panel.querySelector('.igmi-count').textContent = `(${urls.length})`;

    panel.querySelector('.igmi-open').onclick = async () => {
      if (!urls.length) return;
      if (urls.length > 6 && !confirm(`画像を ${urls.length} 枚、順に新規タブで開きます。続行しますか？`)) return;
      for (const u of urls) {
        try {
          if (typeof GM_openInTab === 'function') GM_openInTab(u, { active: false, insert: true });
          else window.open(u, '_blank', 'noopener');
          await new Promise(r => setTimeout(r, 200));
        } catch {}
      }
    };

    panel.querySelector('.igmi-dl').onclick = async () => {
      if (!urls.length) return;
      if (urls.length > 6 && !confirm(`画像を ${urls.length} 枚ダウンロードします。続行しますか？`)) return;
      const baseName = (i, href) => {
        try {
          const u = new URL(href);
          const igk = u.searchParams.get('ig_cache_key');
          if (igk) return `ig_${i+1}_${igk}.jpg`;
          const name = (u.pathname.split('/').filter(Boolean).pop() || 'image').replace(/\.[a-z0-9]+$/i,'');
          return `ig_${i+1}_${name}.jpg`;
        } catch { return `ig_${i+1}.jpg`; }
      };
      for (let i=0;i<urls.length;i++) {
        const href = urls[i];
        try {
          if (typeof GM_download === 'function') {
            GM_download({ url: href, name: baseName(i, href) });
          } else {
            if (typeof GM_openInTab === 'function') GM_openInTab(href, { active: false, insert: true });
            else window.open(href, '_blank', 'noopener');
          }
          await new Promise(r => setTimeout(r, 300));
        } catch {}
      }
    };
  };

  // ページごとの実行フロー
  const runOnPostPage = () => {
    const m = location.pathname.match(/\/p\/([^/]+)/);
    const shortcode = m ? m[1] : null;
    let urls = [];
    if (shortcode) urls = collectFromEmbeddedJSON_scoped(shortcode);
    if (!urls.length) {
      urls = collectFromDom_scoped();
    }
    urls = dedupePreferBest(urls);
    render(urls);
  };

  const handleRouteChange = () => {
    const now = location.pathname;
    if (now === lastPathname) return;
    lastPathname = now;

    removePanel();
    if (isPostPage()) {
      setTimeout(runOnPostPage, 300);
    }
  };

  // 監視セットアップ
  const setupRoutingHooks = () => {
    if (initialized) return;
    initialized = true;

    const origPush = history.pushState;
    const origReplace = history.replaceState;
    history.pushState = function (...args) {
      const ret = origPush.apply(this, args);
      handleRouteChange(); return ret;
    };
    history.replaceState = function (...args) {
      const ret = origReplace.apply(this, args);
      handleRouteChange(); return ret;
    };

    window.addEventListener('popstate', handleRouteChange);
    document.addEventListener('visibilitychange', handleRouteChange);

    const mo = new MutationObserver(() => {
      handleRouteChange();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    if (isPostPage()) runOnPostPage();
  };

  const start = () => setupRoutingHooks();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
