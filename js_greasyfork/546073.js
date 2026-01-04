// ==UserScript==
// @name         流媒体加速缓冲
// @namespace    streamboost
// @icon         https://image.suysker.xyz/i/2023/10/09/artworks-QOnSW1HR08BDMoe9-GJTeew-t500x500.webp
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  通用流媒体加速：加大缓冲、并发预取、内存命中、在途合并、按站点启停、修复部分站点自定义 Loader 导致的串行；当前覆盖 HLS.js，后续可扩展至其它播放器/协议。
// @match        *://*/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_addElement
// @homepage     https://github.com/Suysker/StreamBoost
// @supportURL   https://github.com/Suysker/StreamBoost
// @downloadURL https://update.greasyfork.org/scripts/546073/%E6%B5%81%E5%AA%92%E4%BD%93%E5%8A%A0%E9%80%9F%E7%BC%93%E5%86%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/546073/%E6%B5%81%E5%AA%92%E4%BD%93%E5%8A%A0%E9%80%9F%E7%BC%93%E5%86%B2.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ====== 本地存储键 ======
  const LS_MASTER_KEY   = 'HLS_BIGBUF_ENABLE';     // "1"=全局开（默认）
  const LS_DEBUG_KEY    = 'HLS_BIGBUF_DEBUG';      // "1"=开
  const LS_PREFETCH_KEY = 'HLS_BIGBUF_PREFETCH';   // "1"=开
  const LS_CACHE_KEY    = 'HLS_BIGBUF_CACHE';      // "1"=开
  const LS_BLOCKLIST    = 'HLS_BIGBUF_BLOCKLIST';  // JSON 数组：['example.com','*.foo.com']

  // ====== 站点黑名单 ======
  function readBlocklist() {
    try {
      const raw = localStorage.getItem(LS_BLOCKLIST);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.filter(x => typeof x === 'string' && x.trim()) : [];
    } catch { return []; }
  }
  function writeBlocklist(list) {
    try { localStorage.setItem(LS_BLOCKLIST, JSON.stringify(list)); } catch {}
  }
  function normHost(host) { return String(host || '').trim().toLowerCase(); }
  function hostMatches(host, pattern) {
    host    = normHost(host);
    pattern = normHost(pattern);
    if (!host || !pattern) return false;
    if (pattern.startsWith('*.')) {
      const suf = pattern.slice(2);
      return host === suf || host.endsWith('.' + suf);
    }
    return host === pattern;
  }
  function isBlockedForURL(url) {
    try {
      const u = new URL(url, location.href);
      const host = u.hostname;
      const masterOn = (localStorage.getItem(LS_MASTER_KEY) ?? '1') === '1';
      if (!masterOn) return true; // 全局关闭
      const bl = readBlocklist();
      return bl.some(p => hostMatches(host, p));
    } catch { return false; }
  }
  function isBlockedForDoc(doc) {
    try {
      const url = doc?.location?.href || doc?.URL || '';
      return isBlockedForURL(url);
    } catch { return false; }
  }

  // ====== 菜单（仅顶层） ======
  if (typeof GM_registerMenuCommand === 'function' && window.top === window) {
    const isDebug   = localStorage.getItem(LS_DEBUG_KEY)    === '1';
    const prefetch  = localStorage.getItem(LS_PREFETCH_KEY) ?? '1';
    const memcache  = localStorage.getItem(LS_CACHE_KEY)    ?? '1';
    const masterOn  = (localStorage.getItem(LS_MASTER_KEY) ?? '1') === '1';
    const host      = location.hostname;
    const blocked   = isBlockedForURL(location.href);

    GM_registerMenuCommand(masterOn ? '🔌 全局状态（当前：启用）' : '🔌 全局状态（当前：停用）', () => {
      localStorage.setItem(LS_MASTER_KEY, masterOn ? '' : '1');
      alert((!masterOn ? '已启用' : '已停用') + '全局；刷新页面生效');
    });

    GM_registerMenuCommand(blocked ? `✅ 在此站点启用（当前：停用 @ ${host})` : `⛔ 在此站点停用（当前：启用 @ ${host})`, () => {
      const bl = readBlocklist();
      const h  = normHost(host);
      const idx = bl.findIndex(p => hostMatches(h, p));
      if (blocked) {
        if (idx >= 0) bl.splice(idx, 1);
        writeBlocklist(bl);
        alert(`已对本域名启用：${h}\n刷新页面生效`);
      } else {
        bl.push(h);
        writeBlocklist(bl);
        alert(`已对本域名停用：${h}\n刷新页面生效`);
      }
    });

    GM_registerMenuCommand('📝 查看/编辑 站点黑名单（JSON）', () => {
      const cur = JSON.stringify(readBlocklist(), null, 2);
      const next = prompt('编辑黑名单（JSON 数组，支持精确主机或通配 *.domain.com）', cur);
      if (next == null) return;
      try { writeBlocklist(JSON.parse(next)); alert('已更新黑名单；刷新页面生效'); }
      catch (e) { alert('更新失败：' + e); }
    });

    const makeStatusLabel = (icon, name, on) =>
      `${icon} ${name}（当前：${on ? '启用' : '停用'}）`;

    GM_registerMenuCommand(
      makeStatusLabel('🐞', 'Debug 日志', isDebug),
      () => {
        const cur  = (localStorage.getItem(LS_DEBUG_KEY) === '1');
        const next = !cur;
        localStorage.setItem(LS_DEBUG_KEY, next ? '1' : '');
        alert(`已${next ? '启用' : '停用'} Debug 日志；刷新页面生效`);
      }
    );

    GM_registerMenuCommand(
      makeStatusLabel('🚀', '并发预取', (prefetch === '1')),
      () => {
        const cur  = ((localStorage.getItem(LS_PREFETCH_KEY) ?? '1') === '1');
        const next = !cur;
        localStorage.setItem(LS_PREFETCH_KEY, next ? '1' : '');
        alert(`已${next ? '启用' : '停用'} 并发预取；刷新页面生效`);
      }
    );

    GM_registerMenuCommand(
      makeStatusLabel('🧠', '内存命中 fLoader', (memcache === '1')),
      () => {
        const cur  = ((localStorage.getItem(LS_CACHE_KEY) ?? '1') === '1');
        const next = !cur;
        localStorage.setItem(LS_CACHE_KEY, next ? '1' : '');
        alert(`已${next ? '启用' : '停用'} 内存命中 fLoader；刷新页面生效`);
      }
    );
  }

  // ====== 注入的脚本 ======
  const PAYLOAD = `
  (function(){
    'use strict';

    // —— 固定原生实现，绕过站点改写 —— //
    const Native = (() => {
      let XHR   = window.XMLHttpRequest;
      let Fetch = window.fetch ? window.fetch.bind(window) : null;
      let AC    = window.AbortController;
      try {
        const mark = s => typeof s === 'function' && String(s).includes('[native code]');
        if (!mark(XHR) || (Fetch && !mark(Fetch)) || (AC && !mark(AC))) {
          const ifr = document.createElement('iframe');
          ifr.style.display = 'none';
          document.documentElement.appendChild(ifr);
          const w = ifr.contentWindow;
          if (w) {
            if (!mark(XHR)   && w.XMLHttpRequest) XHR   = w.XMLHttpRequest;
            if (Fetch && !mark(Fetch) && w.fetch) Fetch = w.fetch.bind(w);
            if (!mark(AC)    && w.AbortController) AC   = w.AbortController;
          }
          ifr.remove();
        }
      } catch {}
      return { XHR, Fetch, AC };
    })();

    // —— 缓冲策略 —— //
    const VOD_BUFFER_SEC     = (navigator.deviceMemory && navigator.deviceMemory < 4) ? 180 : 600;
    const BACK_BUFFER_SEC    = 180;
    const MAX_MAX_BUFFER_SEC = 1800;

    // —— 开关 —— //
    const ENABLE_PREFETCH = (localStorage.getItem('HLS_BIGBUF_PREFETCH') ?? '1') === '1';
    const ENABLE_MEMCACHE = (localStorage.getItem('HLS_BIGBUF_CACHE')    ?? '1') === '1';
    const DEBUG           = (localStorage.getItem('HLS_BIGBUF_DEBUG') === '1');

    // —— 预取参数 —— //
    const PREFETCH_AHEAD           = 12;
    const PREFETCH_CONC_GLOBAL     = +(localStorage.getItem('HLS_BIGBUF_CONC_GLOBAL')     || 4);
    const PREFETCH_CONC_PER_ORIGIN = +(localStorage.getItem('HLS_BIGBUF_CONC_PER_ORIGIN') || 4);
    const PREFETCH_TIMEOUT_MS      = 15000;
    const WAIT_INFLIGHT_MS         = 500;

    // —— 失败节流/熔断 —— //
    const FAIL_TTL_MS      = 45000;
    const ORIGIN_BAN_MS    = 10 * 60 * 1000;
    const originFailCount  = new Map();
    const originBanUntil   = new Map();

    // —— LRU 内存上限（自适应）—— //
    const MAX_MEM_MB = (()=>{
      const dm = navigator.deviceMemory || 4;
      if (dm >= 8) return 192;
      if (dm >= 4) return 128;
      return 64;
    })();
    const MAX_MEM_BYTES = MAX_MEM_MB * 1024 * 1024;

    const log  = (...a)=>{ if (DEBUG) console.log('[HLS BigBuffer]', ...a); };
    const warn = (...a)=>{ console.warn('[HLS BigBuffer]', ...a); };

    // ====== ArrayBuffer 安全工具（修复点：全部走“副本”）======
    function cloneAB(input) {
      if (!input) return null;
      if (input instanceof ArrayBuffer) return input.slice(0);
      if (ArrayBuffer.isView(input)) {
        const { buffer, byteOffset, byteLength } = input;
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      try { return new Uint8Array(input).buffer.slice(0); } catch { return null; }
    }
    function isDetached(buf) {
      try {
        return (buf instanceof ArrayBuffer) && new Uint8Array(buf).byteLength === 0;
      } catch { return true; }
    }
    function abSize(buf) {
      if (!buf) return 0;
      if (buf instanceof ArrayBuffer) return buf.byteLength || 0;
      if (ArrayBuffer.isView(buf))    return buf.byteLength || 0;
      return 0;
    }

    // ====== LRU: url -> ArrayBuffer（始终保存“私有副本”，命中返回“消费副本”）======
    const prebuf = new Map();
    let prebufBytes = 0;

    function lruGet(url){
      const stored = prebuf.get(url);
      if (!stored) return null;
      if (isDetached(stored) || abSize(stored) === 0) { // 极少见：被外界转移/损坏
        prebuf.delete(url);
        return null;
      }
      // LRU 触碰
      prebuf.delete(url); prebuf.set(url, stored);
      // 返回消费副本（交给 Hls.js/Worker 随便转移）
      return cloneAB(stored);
    }

    function lruSet(url, buf){
      const copy = cloneAB(buf);
      const size = abSize(copy);
      if (!size || size > MAX_MEM_BYTES) return;

      if (prebuf.has(url)) {
        prebufBytes -= (abSize(prebuf.get(url)) || 0);
        prebuf.delete(url);
      }
      prebuf.set(url, copy);
      prebufBytes += size;

      while (prebufBytes > MAX_MEM_BYTES && prebuf.size) {
        const [k, v] = prebuf.entries().next().value;
        prebuf.delete(k); prebufBytes -= (abSize(v) || 0);
      }
    }
    function lruHas(url){ return prebuf.has(url); }

    // ====== 在途/元数据 ======
    const inflightMap  = new Map(); // url -> Promise<ArrayBuffer|null>
    const inflightMeta = new Map(); // url -> { controller, level, sn, url, startedAt, origin }
    const recentFailMap= new Map();
    const floorSN      = new Map();
    const originSlots  = new Map(); // origin -> n

    function takeOriginSlot(origin) {
      const cap = (origin && origin === location.origin) ? PREFETCH_CONC_GLOBAL : PREFETCH_CONC_PER_ORIGIN;
      const n = originSlots.get(origin) || 0;
      if (n >= cap) { if (DEBUG) log('slot denied', origin, n, '/', cap); return false; }
      originSlots.set(origin, n + 1);
      if (DEBUG) log('slot taken', origin, (n + 1), '/', cap, 'totalInflight=', inflightMap.size + 1);
      return true;
    }
    function releaseOriginSlot(origin) {
      const n = originSlots.get(origin) || 0;
      if (n <= 1) originSlots.delete(origin); else originSlots.set(origin, n - 1);
      if (DEBUG) log('slot released', origin, Math.max(0, n - 1));
    }

    // ====== fLoader：命中优先/在途合并/stats 补齐（修复：交付时也给副本）======
    class CacheFirstFragLoader {
      constructor(cfg){
        const Hls = window.HlsOriginal || window.Hls || window.__HlsOriginal;
        const BaseLoader = Hls?.DefaultConfig?.loader;
        this.inner = BaseLoader ? new BaseLoader(cfg) : null;
        this._resetStats();
      }
      _resetStats(){
        const now = performance.now();
        this.stats = {
          aborted:false, loaded:0, total:0, retry:0, chunkCount:0, bwEstimate:0,
          loading:{ start: now, first:0, end:0 },
          parsing:{ start:0, end:0 },
          buffering:{ start:0, first:0, end:0 },
          trequest: now, tfirst:0, tload:0
        };
      }
      _markLoaded(byteLen){
        const now = performance.now();
        const s = this.stats;
        s.loaded = byteLen|0; s.total = byteLen|0;
        if (!s.loading.first) s.loading.first = now;
        s.loading.end = now;
        if (!s.tfirst) s.tfirst = now;
        s.tload = now;
      }
      load(context, config, callbacks){
        this.context = context; this.config = config; this.callbacks = callbacks;
        this._resetStats();
        try { context.loader = this; } catch {}

        const url = context?.url;
        const isFrag = (context?.type === 'fragment') || !!context?.frag;
        const self = this;

        function goInner(){
          if (self.inner?.load) {
            if (!self.inner.stats) self.inner.stats = self.stats;
            return self.inner.load(context, config, callbacks);
          }
          if (url) {
            const ctrl = Native.AC ? new Native.AC() : new AbortController();
            const timer = setTimeout(()=>ctrl.abort(), config?.timeout || 20000);
            (Native.Fetch || fetch)(url, { mode:'cors', credentials:'omit', signal: ctrl.signal })
              .then(r => r.ok ? r.arrayBuffer() : Promise.reject(new Error('HTTP ' + r.status)))
              .then(buf => {
                const out = cloneAB(buf); // 交付副本，避免后续复用同一引用
                if (!out || abSize(out) === 0) throw new Error('buffer-clone-empty');
                self.stats.chunkCount += 1;
                self._markLoaded(abSize(out));
                if (ENABLE_MEMCACHE && isFrag) lruSet(url, buf);
                callbacks.onSuccess({ url, data: out }, self.stats, context, null);
              })
              .catch(err => callbacks.onError?.({ code: 0, text: String(err) }, context, null))
              .finally(()=> clearTimeout(timer));
          }
        }

        // 1) LRU 命中（lruGet 已返回消费副本）
        if (isFrag && url) {
          const hit = lruGet(url);
          if (hit && abSize(hit) > 0) {
            this.stats.chunkCount += 1;
            this._markLoaded(abSize(hit));
            if (typeof callbacks.onProgress === 'function') callbacks.onProgress(this.stats, context, hit, null);
            callbacks.onSuccess({ url, data: hit }, this.stats, context, null);
            if (DEBUG) log('fLoader cache hit', url, abSize(hit), 'bytes');
            return;
          }
        }

        // 2) 在途合并（限时等待；交付副本，避免多个消费者共享同一引用）
        const p = (isFrag && url) ? inflightMap.get(url) : null;
        if (p) {
          let done = false;
          const timer = setTimeout(() => { if (!done) goInner(); }, WAIT_INFLIGHT_MS);
          p.then(buf => {
            if (done) return;
            clearTimeout(timer);
            if (buf) {
              const out = cloneAB(buf);
              if (!out || abSize(out) === 0) { goInner(); return; }
              this.stats.chunkCount += 1;
              this._markLoaded(abSize(out));
              if (ENABLE_MEMCACHE && isFrag) lruSet(url, buf);
              callbacks.onSuccess({ url, data: out }, this.stats, context, null);
              done = true;
              if (DEBUG) log('fLoader merged in-flight prefetch', url, abSize(out), 'bytes');
            } else {
              goInner();
            }
          }).catch(() => { if (!done) { clearTimeout(timer); goInner(); }});
          return;
        }

        // 3) 常规加载
        goInner();
      }
      abort(ctx){ if (this.stats) this.stats.aborted = true; try { this.inner?.abort?.(ctx); } catch {} }
      destroy(){ try { this.inner?.destroy?.(); } catch {} }
    }

    // ====== 工具：绝对 URL/淘汰在途 ======
    function absUrlForFrag(details, frag){
      let u = frag && (frag.url || frag.relurl);
      if (!u) return '';
      if (frag.url) return frag.url;
      const base = (details && (details.baseurl || details.baseURI || details.baseuri)) || '';
      try { return new URL(frag.relurl, base).href; } catch { return frag.relurl || ''; }
    }
    function abortStaleInflight(level, floor){
      let aborted = 0;
      inflightMeta.forEach((meta, url) => {
        if (meta.level === level && typeof meta.sn === 'number' && meta.sn < floor) {
          try { meta.controller && meta.controller.abort(); } catch {}
          inflightMeta.delete(url);
          inflightMap.delete(url);
          aborted++;
        }
      });
      if (aborted && DEBUG) log('abort stale inflight', 'level=', level, 'floor=', floor, 'aborted=', aborted);
    }

    // ====== 预取实现（优先原生 XHR → HlsLoader → fetch）======
    function prefetchWithXHR(hls, details, nf, url, origin){
      if (originBanUntil.get(origin) > performance.now()) { if (DEBUG) log('origin banned, skip XHR', origin); return null; }
      if (!takeOriginSlot(origin)) return null;

      const xhr = new Native.XHR();
      let cleaned = false;
      let timer = null;
      const timeoutMs = (hls?.config?.fragLoadTimeout) || PREFETCH_TIMEOUT_MS;

      const controller = { abort(){ try{ xhr.abort(); }catch{} } };
      inflightMeta.set(url, { controller, level: nf.level, sn: nf.sn, url, startedAt: performance.now(), origin });

      const p = new Promise((resolve) => {
        try {
          xhr.open('GET', url, true);
          xhr.responseType = 'arraybuffer';
          try { hls?.config?.xhrSetup && hls.config.xhrSetup(xhr, url); } catch {}
          xhr.timeout = timeoutMs;

          xhr.onload = function(){
            releaseOriginSlot(origin);
            cleanup();
            const ok = (xhr.status >= 200 && xhr.status < 300);
            if (!ok || !(xhr.response instanceof ArrayBuffer)) {
              bumpFail(origin);
              resolve(null);
              return;
            }
            originFailCount.set(origin, 0);
            const buf = xhr.response;
            if (ENABLE_MEMCACHE) lruSet(url, buf);
            if (DEBUG) log('prefetch XHR ok', url, abSize(buf), 'bytes');
            resolve(buf); // 注意：消费者侧会 clone
          };
          xhr.onerror = function(){
            releaseOriginSlot(origin);
            cleanup(); bumpFail(origin); resolve(null);
          };
          xhr.ontimeout = function(){
            releaseOriginSlot(origin);
            cleanup(); bumpFail(origin); resolve(null);
          };
          xhr.onabort = function(){
            releaseOriginSlot(origin);
            cleanup(); resolve(null);
          };

          xhr.send();
          timer = setTimeout(()=>{ try{ xhr.abort(); }catch{} }, timeoutMs + 500);
        } catch {
          releaseOriginSlot(origin);
          cleanup(); resolve(null);
        }

        function cleanup(){
          if (cleaned) return;
          cleaned = true;
          try{ xhr.onload = xhr.onerror = xhr.ontimeout = xhr.onabort = null; }catch{}
          if (timer) { clearTimeout(timer); timer = null; }
        }
        function bumpFail(origin){
          const fc = (originFailCount.get(origin) || 0) + 1;
          originFailCount.set(origin, fc);
          if (fc >= 2) originBanUntil.set(origin, performance.now() + ORIGIN_BAN_MS);
        }
      }).finally(()=>{ inflightMeta.delete(url); inflightMap.delete(url); });

      inflightMap.set(url, p);
      return p;
    }

    function prefetchWithHlsLoader(hls, details, nf, url, origin) {
      const Hls = window.HlsOriginal || window.Hls || window.__HlsOriginal;
      const BaseLoader = Hls?.DefaultConfig?.loader;
      if (!BaseLoader) return null;

      if (originBanUntil.get(origin) > performance.now()) { if (DEBUG) log('origin banned, skip HlsLoader', origin); return null; }
      if (!takeOriginSlot(origin)) return null;

      const loader = new BaseLoader(hls?.config || {});
      const controller = { abort(){ try { loader.abort?.(); } catch {} } };
      const ctx = { url, responseType:'arraybuffer', type:'fragment', frag:nf };
      const timeoutMs = hls?.config?.fragLoadTimeout || PREFETCH_TIMEOUT_MS;

      let timer = null;
      const p = new Promise((resolve) => {
        try {
          loader.load(ctx, hls?.config || {}, {
            onSuccess: (resp, stats, context) => {
              releaseOriginSlot(origin);
              clearTimeout(timer);
              originFailCount.set(origin, 0);
              const buf = resp && resp.data instanceof ArrayBuffer ? resp.data : null;
              if (buf && ENABLE_MEMCACHE) lruSet(url, buf);
              resolve(buf); // 消费侧 clone
            },
            onError: () => {
              releaseOriginSlot(origin);
              clearTimeout(timer);
              const fc = (originFailCount.get(origin) || 0) + 1;
              originFailCount.set(origin, fc);
              if (fc >= 2) originBanUntil.set(origin, performance.now() + ORIGIN_BAN_MS);
              resolve(null);
            },
            onTimeout: () => {
              releaseOriginSlot(origin);
              clearTimeout(timer);
              const fc = (originFailCount.get(origin) || 0) + 1;
              originFailCount.set(origin, fc);
              if (fc >= 2) originBanUntil.set(origin, performance.now() + ORIGIN_BAN_MS);
              resolve(null);
            },
            onProgress: ()=>{}
          });
          timer = setTimeout(()=>{ try{ loader.abort?.(); }catch{} }, timeoutMs);
        } catch {
          releaseOriginSlot(origin);
          clearTimeout(timer);
          resolve(null);
        }
      }).finally(()=>{ try{ loader.destroy?.(); }catch{}; inflightMeta.delete(url); inflightMap.delete(url); });

      inflightMeta.set(url, { controller, level: nf.level, sn: nf.sn, url, startedAt: performance.now(), origin });
      inflightMap.set(url, p);
      return p;
    }

    function prefetchWithFetch(details, nf, url, origin){
      if (originBanUntil.get(origin) > performance.now()) { if (DEBUG) log('origin banned, skip fetch', origin); return null; }
      if (!takeOriginSlot(origin)) return null;

      const controller = Native.AC ? new Native.AC() : new AbortController();
      const opts = { mode:'cors', credentials:'omit', signal: controller.signal };
      const timeout = setTimeout(()=> controller.abort(), PREFETCH_TIMEOUT_MS);

      const p = (Native.Fetch || fetch)(url, opts)
        .then(r => r.ok ? r.arrayBuffer() : null)
        .then(buf => {
          releaseOriginSlot(origin);
          if (buf) {
            originFailCount.set(origin, 0);
            if (ENABLE_MEMCACHE) lruSet(url, buf);
            if (DEBUG) log('prefetch fetch ok', url, abSize(buf), 'bytes');
          } else {
            const fc = (originFailCount.get(origin) || 0) + 1;
            originFailCount.set(origin, fc);
            if (fc >= 2) originBanUntil.set(origin, performance.now() + ORIGIN_BAN_MS);
          }
          return buf; // 消费侧 clone
        })
        .catch(() => {
          releaseOriginSlot(origin);
          const fc = (originFailCount.get(origin) || 0) + 1;
          originFailCount.set(origin, fc);
          if (fc >= 2) originBanUntil.set(origin, performance.now() + ORIGIN_BAN_MS);
          return null;
        })
        .finally(() => { clearTimeout(timeout); inflightMeta.delete(url); inflightMap.delete(url); });

      inflightMap.set(url, p);
      inflightMeta.set(url, { controller, level: nf.level, sn: nf.sn, url, startedAt: performance.now(), origin });
      return p;
    }

    // ====== 预取调度 ======
    (function setupPrefetcher(){
      if (!ENABLE_PREFETCH) return;

      function prefetchFrag(hls, details, nf){
        const url = absUrlForFrag(details, nf);
        if (!url) return null;
        const origin = (()=>{ try { return new URL(url).origin; } catch { return ''; } })();

        if (lruHas(url)) { if (DEBUG) log('prefetch skip: LRU has', url); return inflightMap.get(url) || null; }
        if (inflightMap.has(url)) return inflightMap.get(url);

        const lastFail = recentFailMap.get(url);
        if (lastFail && (performance.now() - lastFail < FAIL_TTL_MS)) {
          if (DEBUG) log('prefetch skip: recent fail', url);
          return null;
        }

        if (inflightMap.size >= PREFETCH_CONC_GLOBAL) return null;

        let p = prefetchWithXHR(hls, details, nf, url, origin);
        if (!p) p = prefetchWithHlsLoader(hls, details, nf, url, origin);
        if (!p) p = prefetchWithFetch(details, nf, url, origin);

        p?.then(buf => { if (!buf) recentFailMap.set(url, performance.now()); })
          .finally(()=>{ inflightMeta.delete(url); inflightMap.delete(url); });

        return p;
      }

      function attach(hls){
        const Ev = hls.constructor?.Events || {};

        function scheduleAheadFromFrag(frag){
          try {
            if (!frag) return;
            const t = frag.type || 'video';
            if (t !== 'main' && t !== 'video') return;

            const level = frag.level;
            const S = frag.sn;

            floorSN.set(level, S);
            abortStaleInflight(level, S);

            const details = hls.levels && hls.levels[level] && hls.levels[level].details;
            if (!details || !Array.isArray(details.fragments)) return;

            let idx = details.fragments.findIndex(f => f.sn === S);
            if (idx < 0) {
              idx = 0;
              for (let i = 0; i < details.fragments.length; i++) {
                if ((details.fragments[i].sn|0) >= (S|0)) { idx = i; break; }
              }
            }

            for (let k = 1; k <= PREFETCH_AHEAD; k++) {
              const nf = details.fragments[idx + k];
              if (!nf) break;
              const floor = floorSN.get(nf.level ?? level) ?? S;
              if (typeof nf.sn === 'number' && nf.sn < floor) continue;
              prefetchFrag(hls, details, nf);
            }
          } catch (e) { if (DEBUG) log('scheduleAheadFromFrag error', e); }
        }

        hls.on(Ev.FRAG_LOADING, (_evt, data) => { scheduleAheadFromFrag(data && data.frag); });
        hls.on(Ev.FRAG_LOADED,  (_evt, data) => { scheduleAheadFromFrag(data && data.frag); });

        log('prefetcher attached (XHR→HlsLoader→fetch; ahead=', PREFETCH_AHEAD, ', global=', PREFETCH_CONC_GLOBAL, ', perOrigin=', PREFETCH_CONC_PER_ORIGIN, ', wait=', WAIT_INFLIGHT_MS, 'ms)');
      }
      window.__HLS_BIGBUF_ATTACH_PREFETCH__ = attach;
    })();

    // ====== 修补 Hls 类 ======
    function isCtor(v){ return typeof v === 'function'; }
    function protectGlobal(name, value){
      try { delete window[name]; } catch {}
      Object.defineProperty(window, name, { value, writable:false, configurable:true, enumerable:false });
    }

    function patchHlsClass(OriginalHls){
      try{
        if(!OriginalHls || OriginalHls.__HLS_BIGBUF_PATCHED__ || !isCtor(OriginalHls)) return OriginalHls;
        window.HlsOriginal = window.__HlsOriginal = OriginalHls;

        const overrides = {
          maxBufferLength: VOD_BUFFER_SEC,
          maxMaxBufferLength: MAX_MAX_BUFFER_SEC,
          startFragPrefetch: true,
          backBufferLength: BACK_BUFFER_SEC
        };
        try {
          if (OriginalHls.DefaultConfig) Object.assign(OriginalHls.DefaultConfig, overrides);
          log('DefaultConfig applied', OriginalHls.DefaultConfig);
        } catch(e){ log('DefaultConfig assign failed (frozen?)', e); }

        class PatchedHls extends OriginalHls {
          constructor(userConfig = {}){
            const enforced = Object.assign({}, overrides, userConfig);
            if (ENABLE_MEMCACHE) enforced.fLoader = CacheFirstFragLoader;
            super(enforced);
            window.__HLS_BIGBUF_LAST__ = this;

            try {
              this.on(OriginalHls.Events.LEVEL_LOADED, (_evt, data) => {
                const isLive = !!data?.details?.live;
                if (!isLive) {
                  const c = this.config;
                  c.maxBufferLength    = Math.max(c.maxBufferLength ?? 0, VOD_BUFFER_SEC);
                  c.maxMaxBufferLength = Math.max(c.maxMaxBufferLength ?? 0, MAX_MAX_BUFFER_SEC);
                  c.backBufferLength   = Math.max(c.backBufferLength ?? 0, BACK_BUFFER_SEC);
                  c.startFragPrefetch  = true;
                  log('LEVEL_LOADED → ensured VOD config', {
                    maxBufferLength: c.maxBufferLength,
                    maxMaxBufferLength: c.maxMaxBufferLength,
                    backBufferLength: c.backBufferLength,
                    startFragPrefetch: c.startFragPrefetch
                  });
                } else {
                  log('LEVEL_LOADED (live) → keep default live sync');
                }
              });
            } catch {}

            try {
              if (ENABLE_PREFETCH && typeof window.__HLS_BIGBUF_ATTACH_PREFETCH__ === 'function') {
                window.__HLS_BIGBUF_ATTACH_PREFETCH__(this);
              }
            } catch {}

            log('Hls instance created with config', this.config, 'prefetch=', ENABLE_PREFETCH, 'memcache=', ENABLE_MEMCACHE);
          }
        }

        Object.getOwnPropertyNames(OriginalHls).forEach((name)=>{
          if (['length','prototype','name','DefaultConfig'].includes(name)) return;
          try { Object.defineProperty(PatchedHls, name, Object.getOwnPropertyDescriptor(OriginalHls, name)); } catch {}
        });
        Object.defineProperty(PatchedHls, 'DefaultConfig', {
          get(){ return OriginalHls.DefaultConfig; },
          set(v){ OriginalHls.DefaultConfig = v; }
        });
        Object.defineProperty(PatchedHls, '__HLS_BIGBUF_PATCHED__', { value: true });

        log('PatchedHls ready. version=', OriginalHls.version, 'events=', OriginalHls.Events);
        return PatchedHls;
      }catch(e){
        warn('patchHlsClass failed', e);
        return OriginalHls;
      }
    }

    function armSetterOnce(){
      if ('Hls' in window && isCtor(window.Hls)) {
        const Patched = patchHlsClass(window.Hls);
        protectGlobal('Hls', Patched);
        log('Patched existing window.Hls immediately');
        return;
      }
      let armed = true;
      Object.defineProperty(window, 'Hls', {
        configurable: true,
        enumerable: false,
        get(){ return undefined; },
        set(v){
          if(!armed) return;
          armed = false;
          if (!isCtor(v)) { log('window.Hls set but not a constructor, skip patch'); protectGlobal('Hls', v); return; }
          const Patched = patchHlsClass(v);
          protectGlobal('Hls', Patched);
          log('Intercepted and replaced window.Hls');
        }
      });
      if (window === window.top) log('Setter hook armed (page/iframe context, waiting for window.Hls)');

      if (window === window.top) setTimeout(()=>{
        if(!window.Hls || (window.Hls && !window.Hls.__HLS_BIGBUF_PATCHED__)){
          const hints = {
            hasVideoJS: !!window.videojs,
            hasDashJS: !!(window.dashjs || window.MediaPlayer),
            nativeHLS: (function(){
              try{
                const v=document.createElement('video');
                const t1=v.canPlayType('application/vnd.apple.mpegurl');
                const t2=v.canPlayType('application/x-mpegURL');
                return (t1==='probably'||t1==='maybe'||t2==='probably'||t2==='maybe');
              }catch{ return false; }
            })()
          };
          console.warn('[HLS BigBuffer] 顶层未检测到 Hls（播放器可能在 iframe / 或用 video.js / dash.js / 原生HLS）诊断：', hints);
        }
      }, 8000);
    }

    armSetterOnce();
  })();
  `;

  // ====== 仅在未禁用时注入 ======
  function injectInto(doc = document) {
    try {
      if (isBlockedForDoc(doc)) {
        if (window.top === window) {
          try { console.log('[HLS BigBuffer] 已在该站点禁用'); } catch {}
        }
        return;
      }
      if (typeof GM_addElement === 'function') {
        GM_addElement(doc.documentElement, 'script', { textContent: PAYLOAD });
        return;
      }
    } catch {}
    const s = doc.createElement('script');
    s.textContent = PAYLOAD;
    (doc.head || doc.documentElement).appendChild(s);
    s.remove();
  }

  injectInto(document);

  function tryInjectIframe(iframe) {
    try {
      const d = iframe.contentDocument;
      if (!d) return;
      if (isBlockedForDoc(d)) return;
      injectInto(d);
    } catch { /* 跨域: 该域会按 @match 自行注入 */ }
  }

  Array.from(document.getElementsByTagName('iframe')).forEach(tryInjectIframe);
  new MutationObserver(muts => {
    for (const m of muts) {
      for (const n of m.addedNodes) if (n.tagName === 'IFRAME') {
        n.addEventListener('load', () => tryInjectIframe(n));
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
