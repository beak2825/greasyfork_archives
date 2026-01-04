// ==UserScript==
// @name         SideM 한글 번역기
// @namespace    https://yourproject.example/
// @version      0.91
// @description  사이드엠 포탈 한글패치
// @match        https://idolmaster-official.jp/sidem*
// @match        https://asobistory.asobistore.jp/*
// @icon         https://pbs.twimg.com/media/GuqmfVSa8AALGLR?format=jpg&name=360x360
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541156/SideM%20%ED%95%9C%EA%B8%80%20%EB%B2%88%EC%97%AD%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/541156/SideM%20%ED%95%9C%EA%B8%80%20%EB%B2%88%EC%97%AD%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const ENDPOINT = 'https://script.google.com/macros/s/AKfycby4Lxtyp9_EW3f2SeMoFalwSZ08b4Eu5aZq1GzCLniwYqJwZ0xHyAv7HzuoM0zc-b1XLA/exec';
  const TOKEN    = 'apple_mango_123';

  const CACHE_NS        = 'exec';
  const CHUNK_SIZE      = 100 * 1024;
  const CACHE_TTL_MS    = 24 * 60 * 60 * 1000;
  const LRU_MAX_PAGES   = 12;

  const translationMap = new Map();
  let observer = null;

  function normalizeUrl(u) {
    if (!u) return '';
    let s = String(u).trim();
    const i = s.indexOf('#'); if (i >= 0) s = s.substring(0, i);
    if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1);
    return s;
  }
  const PAGE_KEY = normalizeUrl(location.href);

  const META_KEY = `sidem_cache_meta:${CACHE_NS}`;
  function readMeta() {
    try { return JSON.parse(GM_getValue(META_KEY, '{"lru":[]}')); } catch { return { lru: [] }; }
  }
  function writeMeta(meta) {
    try { GM_setValue(META_KEY, JSON.stringify(meta)); } catch {}
  }

  function pageCacheKeyBase(pageKey) {
    return `sidem_cache:${CACHE_NS}::${pageKey}`;
  }
  function pageChunkKey(base, idx) { return `${base}::${idx}`; }
  function pageHeadKey(base) { return `${base}::head`; }

  function touchPageInMeta(pageKey) {
    const meta = readMeta();
    meta.lru = meta.lru.filter(x => x.key !== pageKey);
    meta.lru.unshift({ key: pageKey, ts: Date.now() });
    while (meta.lru.length > LRU_MAX_PAGES) {
      const victim = meta.lru.pop();
      if (victim) deletePageCache(victim.key);
    }
    writeMeta(meta);
  }

  function deletePageCache(pageKey) {
    const base = pageCacheKeyBase(pageKey);
    try {
      const headRaw = GM_getValue(pageHeadKey(base), null);
      if (headRaw) {
        const head = JSON.parse(headRaw);
        for (let i = 0; i < (head.n || 0); i++) GM_deleteValue(pageChunkKey(base, i));
        GM_deleteValue(pageHeadKey(base));
      }
    } catch {}
    const meta = readMeta();
    meta.lru = meta.lru.filter(x => x.key !== pageKey);
    writeMeta(meta);
  }

  function cacheSetSlimDict(pageKey, dict) {
    const base = pageCacheKeyBase(pageKey);
    const json = JSON.stringify(dict);
    const n = Math.ceil(json.length / CHUNK_SIZE);

    try {
      for (let i = 0; i < n; i++) {
        const chunk = json.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        GM_setValue(pageChunkKey(base, i), chunk);
      }
      GM_setValue(pageHeadKey(base), JSON.stringify({ n, ts: Date.now() }));
      touchPageInMeta(pageKey);
      return true;
    } catch (e) {
      console.warn('⚠️ GM 캐시 저장 실패, 페이지 캐시 삭제:', e);
      deletePageCache(pageKey);
      return false;
    }
  }

  function cacheGetSlimDict(pageKey) {
    const base = pageCacheKeyBase(pageKey);
    try {
      const headRaw = GM_getValue(pageHeadKey(base), null);
      if (!headRaw) return null;
      const head = JSON.parse(headRaw);

      if (CACHE_TTL_MS > 0 && head.ts && Date.now() - head.ts > CACHE_TTL_MS) {
        deletePageCache(pageKey);
        return null;
      }
      let buf = '';
      for (let i = 0; i < (head.n || 0); i++) {
        const c = GM_getValue(pageChunkKey(base, i), '');
        if (!c) { deletePageCache(pageKey); return null; }
        buf += c;
      }
      const dict = JSON.parse(buf);
      touchPageInMeta(pageKey);
      return dict && typeof dict === 'object' ? dict : null;
    } catch (e) {
      console.warn('⚠️ GM 캐시 로드 실패:', e);
      deletePageCache(pageKey);
      return null;
    }
  }

  function toSlimDict(resultJson) {
    const dict = Object.create(null);
    if (!resultJson || typeof resultJson !== 'object') return dict;
    for (const [sheetName, entries] of Object.entries(resultJson)) {
      if (sheetName === '_debug' || sheetName === '_meta') continue;
      if (!Array.isArray(entries)) continue;
      for (const it of entries) {
        const o = (it.original || '').trim();
        const t = (it.translated || '').trim();
        if (!o || !t) continue;
        if (dict[o] === undefined) dict[o] = t;
      }
    }
    return dict;
  }

  function applySlimDict(dict) {
    translationMap.clear();
    for (const k in dict) translationMap.set(k, dict[k]);
  }

  function replaceTextNodes() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const v = node.nodeValue;
          if (!v || !v.trim()) return NodeFilter.FILTER_REJECT;
          const p = node.parentNode && node.parentNode.nodeName;
          if (p === 'SCRIPT' || p === 'STYLE' || p === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      },
      false
    );
    let n;
    while ((n = walker.nextNode())) {
      const key = n.nodeValue.trim();
      if (translationMap.has(key)) n.nodeValue = translationMap.get(key);
    }
  }

  function loadFromCache() {
    const dict = cacheGetSlimDict(PAGE_KEY);
    if (!dict) return false;
    applySlimDict(dict);
    replaceTextNodes();
    console.log('📦 GM 캐시 적용:', PAGE_KEY, `entries=${Object.keys(dict).length}`);
    return true;
  }

  function fetchTranslationData() {
    const qs = new URLSearchParams({ token: TOKEN, url: location.href });
    GM_xmlhttpRequest({
      method: 'GET',
      url: `${ENDPOINT}?${qs.toString()}`,
      timeout: 15000,
      onload: (res) => {
        if (res.status !== 200) { console.error('❌ HTTP', res.status); return; }
        let json;
        try { json = JSON.parse(res.responseText); }
        catch (e) { console.error('❌ JSON 파싱 실패:', e); return; }

        const dict = toSlimDict(json);
        applySlimDict(dict);
        replaceTextNodes();

        if (cacheSetSlimDict(PAGE_KEY, dict)) {
          console.log('🌐 원격 수신 & GM 슬림 캐시 갱신:', PAGE_KEY, `entries=${Object.keys(dict).length}`);
        }
      },
      onerror: (e) => console.error('❌ 요청 실패:', e),
      ontimeout: () => console.error('❌ 요청 타임아웃')
    });
  }

  function ensureObserver() {
    if (observer) return;
    const debounced = (() => {
      let t = null;
      return () => { if (t) clearTimeout(t); t = setTimeout(replaceTextNodes, 200); };
    })();
    observer = new MutationObserver(debounced);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function main() {
    loadFromCache();
    fetchTranslationData();
    ensureObserver();
  }

  main();
})();
