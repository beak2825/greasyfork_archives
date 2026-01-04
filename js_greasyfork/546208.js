// ==UserScript==
// @name         PlatesMania Notifications Enhancer
// @namespace    pm-like-avatars
// @version      1.8.6
// @description  Avatars + relative timestamps on your own /userXXXX page. PM panel: swap flag → photo, add flag emoji, user avatar, relative time, proper hover previews, and show latest comments in comment notifications. Likes list: show plate PNG; tooltip preview gets car logo+model and live likes; comment count loads on 1s hover.
// @match        https://*.platesmania.com/user*
// @match        http://*.platesmania.com/user*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546208/PlatesMania%20Notifications%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/546208/PlatesMania%20Notifications%20Enhancer.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ---------- RATE LIMIT (edit me) ----------
    // Delay (in seconds) between background scrapes (only applies to rate-limited tasks; NOT used for live likes or hover comments)
    const SCRAPE_DELAY_SEC = 1;
    const SCRAPE_DELAY_MS  = SCRAPE_DELAY_SEC * 1000;

    // ---------- Only run on your own profile ----------
    function getOwnUserPath() {
        const loginBarUser = document.querySelector('.loginbar.pull-right > li > a[href^="/user"]');
        if (loginBarUser) return new URL(loginBarUser.getAttribute("href"), location.origin).pathname;
        const langLink = document.querySelector('.languages a[href*="/user"]');
        if (langLink) return new URL(langLink.getAttribute("href")).pathname;
        return null;
    }
    const ownPath = getOwnUserPath();
    const herePath = location.pathname.replace(/\/+$/, "");
    if (!ownPath || herePath !== ownPath.replace(/\/+$/, "")) return;

    // ---------- Config ----------
    const CACHE_KEY = "pm_profile_pic_cache_v1";
    const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

    const NOMER_CACHE_KEY = "pm_nomer_photo_cache_v1";
    const NOMER_MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000;

    const PLATE_CACHE_KEY = "pm_plate_png_cache_v1";
    const PLATE_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

    const PLATE_META_CACHE_KEY = "pm_plate_meta_cache_v1";

    const LIKE_ITEM_SELECTOR = ".col-xs-12.margin-bottom-5.bg-info";
    const CONTAINER_SELECTOR = "#mCSB_2_container, #content";
    const PROCESSED_FLAG = "pmAvatarAdded";

    // NEW COUNTER KEYS
    const PM_LAST_SEEN_KEY = "pm_notifications_last_seen_ts_v1";

    GM_addStyle(`
    .pm-like-avatar{width:20px!important;height:20px!important;border-radius:4px!important;object-fit:cover!important;vertical-align:text-bottom!important;margin-right:6px!important;overflow:hidden!important;display:inline-block!important}
    .pm-avatar-preview{position:fixed!important;width:200px!important;height:200px!important;max-width:200px!important;max-height:200px!important;border-radius:10px!important;box-shadow:0 8px 28px rgba(0,0,0,0.28)!important;background:#fff!important;z-index:2147483647!important;pointer-events:none!important;display:none;object-fit:cover}
    .pm-nomer-thumb{width:40px!important;height:40px!important;object-fit:cover!important;border-radius:6px!important}
    .pm-plate{height:18px!important;width:auto!important;vertical-align:text-bottom!important;display:inline-block!important}
    .pm-car-logo{height:18px!important;width:auto!important;vertical-align:text-bottom!important;margin-left:6px!important}
    .pm-car-model{margin-left:6px!important;vertical-align:text-bottom!important;display:inline-block!important}
    .pm-tt-meta{margin-top:6px!important;display:flex!important;align-items:center!important;gap:8px!important;justify-content:center!important}
    .pm-tt-logo{height:25px!important;width:auto!important;vertical-align:middle!important}
    .pm-tt-text{font-weight:600!important;white-space:nowrap!important}
    .pm-comment-preview{color:#333!important;display:flex;align-items:center;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3;gap:8px}
    .pm-comment-preview b{font-weight:700}
    .pm-comment-preview img{height:20px!important;width:auto!important;vertical-align:middle;display:inline-block!important;float:none!important;margin-left:4px;margin-right:4px}
    .pm-comment-preview br{display:none}
    .pm-vote{display:inline-flex;align-items:center;gap:4px;margin-left:auto;flex:0 0 auto}
    .pm-vote .pm-vote-btn{cursor:pointer;color:#9ACD32;line-height:1}
    .pm-vote .pm-vote-value{padding:0 3px;color:#CCC;font:bold 10pt Arial;line-height:1}
    .pm-vote .pm-vote-value.pm-positive{color:rgb(51,153,0)!important}
    .pm-vote .pm-vote-value.pm-negative{color:#CC0000!important}
    .pm-vote .pm-vote-btn.pm-busy{opacity:.6;pointer-events:none}
    .pm-logo-glow{
      filter:
        drop-shadow(0 0 1px #fff)
        drop-shadow(0 0 3px #fff)
        drop-shadow(0 0 6px #fff);
    }
    .pm-new-count{color:darkgreen!important;font-weight:600!important;margin-left:6px!important}
    .pm-tt-counts{display:flex!important;gap:14px!important;align-items:center!important;justify-content:center!important;margin-top:6px!important;color:#f0f0f0!important;font-weight:600!important}
    .pm-tt-counts .pm-tt-count{display:inline-flex!important;align-items:center!important;gap:6px!important}
  `);

    // ---------- Cache helpers ----------
    function readCache(key) {
        try {
            const raw = typeof GM_getValue === "function" ? GM_getValue(key, "{}") : localStorage.getItem(key) || "{}";
            return JSON.parse(raw);
        } catch { return {}; }
    }
    function writeCache(obj, key) {
        const raw = JSON.stringify(obj);
        if (typeof GM_setValue === "function") GM_setValue(key, raw);
        else localStorage.setItem(key, raw);
    }
    function getFromCache(id, key = CACHE_KEY, maxAge = MAX_AGE_MS) {
        const c = readCache(key);
        const e = c[id];
        if (!e) return null;
        if (!e.ts || (Date.now() - e.ts > maxAge)) { delete c[id]; writeCache(c, key); return null; }
        return e.url;
    }
    function putInCache(id, url, key = CACHE_KEY) {
        const c = readCache(key);
        c[id] = { url, ts: Date.now() };
        writeCache(c, key);
    }
    function getMetaFromCache(id, key = PLATE_META_CACHE_KEY, maxAge = PLATE_MAX_AGE_MS) {
        const c = readCache(key), e = c[id];
        if (!e) return null;
        if (!e.ts || (Date.now() - e.ts > maxAge)) { delete c[id]; writeCache(c, key); return null; }
        return e.data;
    }
    function putMetaInCache(id, data, key = PLATE_META_CACHE_KEY) {
        // never store likes/comments in meta cache (they change)
        const { likesCount, commentsCount, ...rest } = data || {};
        const c = readCache(key);
        c[id] = { data: rest, ts: Date.now() };
        writeCache(c, key);
    }
    (function prune() {
        const c1 = readCache(CACHE_KEY), c2 = readCache(NOMER_CACHE_KEY), c3 = readCache(PLATE_CACHE_KEY), c4 = readCache(PLATE_META_CACHE_KEY);
        let ch1=false,ch2=false,ch3=false,ch4=false, now=Date.now();
        for (const [k,v] of Object.entries(c1)) if (!v || !v.ts || (now - v.ts > MAX_AGE_MS)) { delete c1[k]; ch1=true; }
        for (const [k,v] of Object.entries(c2)) if (!v || !v.ts || (now - v.ts > NOMER_MAX_AGE_MS)) { delete c2[k]; ch2=true; }
        for (const [k,v] of Object.entries(c3)) if (!v || !v.ts || (now - v.ts > PLATE_MAX_AGE_MS)) { delete c3[k]; ch3=true; }
        for (const [k,v] of Object.entries(c4)) if (!v || !v.ts || (now - v.ts > PLATE_MAX_AGE_MS)) { delete c4[k]; ch4=true; }
        if (ch1) writeCache(c1, CACHE_KEY);
        if (ch2) writeCache(c2, NOMER_CACHE_KEY);
        if (ch3) writeCache(c3, PLATE_CACHE_KEY);
        if (ch4) writeCache(c4, PLATE_META_CACHE_KEY);
    })();

    // ---------- Shared hover preview for avatars only ----------
    const PM_PREVIEW_SIZE = 200, PM_PREVIEW_PAD = 12;
    const pmPreviewEl = document.createElement("img");
    pmPreviewEl.className = "pm-avatar-preview";
    document.addEventListener("DOMContentLoaded", () => { if (!pmPreviewEl.isConnected) document.body.appendChild(pmPreviewEl); });
    if (!pmPreviewEl.isConnected) document.body.appendChild(pmPreviewEl);
    function pmMovePreview(e){const vw=window.innerWidth;let x=e.clientX-PM_PREVIEW_SIZE/2;let y=e.clientY-PM_PREVIEW_SIZE-PM_PREVIEW_PAD;if(x<4)x=4;if(x+PM_PREVIEW_SIZE>vw-4)x=vw-PM_PREVIEW_SIZE-4;if(y<4)y=e.clientY+PM_PREVIEW_PAD;pmPreviewEl.style.left=`${x}px`;pmPreviewEl.style.top=`${y}px`;}
    function pmShowPreview(src,e,mode="cover"){pmPreviewEl.style.objectFit=(mode==="contain")?"contain":"cover";pmPreviewEl.src=src||"";pmPreviewEl.style.display="block";pmMovePreview(e);}
    function pmHidePreview(){pmPreviewEl.style.display="none";pmPreviewEl.removeAttribute("src");}
    function attachPreview(el,src,mode="cover"){el.addEventListener("mouseenter",(e)=>pmShowPreview(src,e,mode));el.addEventListener("mousemove",pmMovePreview);el.addEventListener("mouseleave",pmHidePreview);}
    function attachSelfPreview(el,mode="cover"){el.addEventListener("mouseenter",(e)=>pmShowPreview(el.src,e,mode));el.addEventListener("mousemove",pmMovePreview);el.addEventListener("mouseleave",pmHidePreview);}
    function attachPreviewLazy(el,getSrc,mode="cover"){el.addEventListener("mouseenter",(e)=>{const src=getSrc();if(src) pmShowPreview(src,e,mode);});el.addEventListener("mousemove",pmMovePreview);el.addEventListener("mouseleave",pmHidePreview);}

    // ---------- Utils ----------
    function absUrl(href){try{return new URL(href,location.origin).toString();}catch{return href;}}
    function escapeHtml(s=""){return s.replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));}
    const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
    const getNomerId = href => ((href||"").match(/nomer(\d+)/)||[])[1] || null;

    // ---------- Classify logos (conditional glow) ----------
    function classifyAndStyleLogo(img, opts = {}) {
        const { threshold = 0.40, sampleStep = 2 } = opts;

        if (!img.crossOrigin) {
            const src = img.currentSrc || img.src;
            img.crossOrigin = "anonymous";
            if (img.complete && src) {
                const tmp = new Image();
                tmp.crossOrigin = "anonymous";
                tmp.onload = () => { try { img.src = src; } catch {} };
                tmp.src = src;
            }
        }

        const run = () => {
            try {
                const w = Math.max(1, Math.min(64, img.naturalWidth || 64));
                const h = Math.max(1, Math.min(64, img.naturalHeight || 64));
                const canvas = document.createElement("canvas");
                canvas.width = w; canvas.height = h;
                const ctx = canvas.getContext("2d", { willReadFrequently: true });
                ctx.drawImage(img, 0, 0, w, h);
                const data = ctx.getImageData(0, 0, w, h).data;

                let sum = 0, count = 0;
                for (let y = 0; y < h; y += sampleStep) {
                    for (let x = 0; x < w; x += sampleStep) {
                        const i = (y * w + x) * 4;
                        const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
                        if (a < 10) continue;
                        const L = (0.2126*r + 0.7152*g + 0.0722*b) / 255;
                        sum += L; count++;
                    }
                }
                const avg = count ? (sum / count) : 1;
                if (avg < threshold) img.classList.add("pm-logo-glow");
                else img.classList.remove("pm-logo-glow");
                img.dataset.pmGlowChecked = "1";
            } catch {}
        };

        if (img.complete && (img.naturalWidth || 0) > 0) run();
        else img.addEventListener("load", run, { once: true });
    }

    function processAllLogos(root=document){
        root.querySelectorAll('img.pm-tt-logo:not([data-pm-glow-checked]), img.pm-car-logo:not([data-pm-glow-checked])')
            .forEach(img => classifyAndStyleLogo(img));
    }

    // ---------- Avatars ----------
    async function fetchProfileAvatar(userPath){
        const res=await fetch(absUrl(userPath),{credentials:"same-origin"}); if(!res.ok) throw new Error(`HTTP ${res.status}`);
        const html=await res.text(); const doc=new DOMParser().parseFromString(html,"text/html");
        const img=doc.querySelector(".profile-img[src]"); return img?absUrl(img.getAttribute("src")):null;
    }
    function addAvatarToRow(rowEl, avatarUrl){
        if(!rowEl || rowEl.dataset[PROCESSED_FLAG]==="1") return;
        const strong=rowEl.querySelector("strong"); const userLink=strong&&strong.querySelector('a[href^="/user"]'); if(!userLink) return;
        if (strong.querySelector("img.pm-like-avatar")) { rowEl.dataset[PROCESSED_FLAG]="1"; return; }
        const img=document.createElement("img"); img.className="pm-like-avatar"; img.width=20; img.height=20; img.alt=""; img.src=avatarUrl;
        attachPreview(img, avatarUrl, "cover"); strong.insertBefore(img, userLink); rowEl.dataset[PROCESSED_FLAG]="1";
    }

    // avatar cache validator + refetch (shared)
    function useCachedAvatarOrRefetch(userId, userHref, onValid){
        const cached = userId && getFromCache(userId);
        if (cached) {
            const testImg = new Image();
            testImg.onload = () => onValid(cached);
            testImg.onerror = () => {
                const c = readCache(CACHE_KEY);
                delete c[userId];
                writeCache(c, CACHE_KEY);
                enqueue(async () => {
                    try {
                        const url = await fetchProfileAvatar(userHref);
                        if (url) { putInCache(userId, url); onValid(url); }
                    } catch {}
                }, { rateLimited: true });
            };
            testImg.src = cached;
        } else if (userId) {
            enqueue(async () => {
                try {
                    const url = await fetchProfileAvatar(userHref);
                    if (url) { putInCache(userId, url); onValid(url); }
                } catch {}
            }, { rateLimited: true });
        }
    }

    // ---------- Small task queue (rate-limited tasks only) ----------
    const queue = [];
    let active = 0, CONCURRENCY = 3;
    let activeRL = 0;
    let lastRLFinishedAt = 0;

    function enqueue(task, opts = {}) {
        queue.push({ fn: task, rateLimited: !!opts.rateLimited });
        runQueue();
    }

    function runQueue() {
        while (active < CONCURRENCY && queue.length) {
            let idx = -1;
            for (let i = 0; i < queue.length; i++) {
                const it = queue[i];
                if (!it.rateLimited) { idx = i; break; }
                const now = Date.now();
                const waitLeft = Math.max(0, SCRAPE_DELAY_MS - (now - lastRLFinishedAt));
                if (activeRL === 0 && waitLeft === 0) { idx = i; break; }
            }
            if (idx === -1) {
                const waitLeft = Math.max(0, SCRAPE_DELAY_MS - (Date.now() - lastRLFinishedAt));
                if (activeRL === 0 && queue.some(t => t.rateLimited)) {
                    setTimeout(runQueue, waitLeft || 0);
                }
                break;
            }

            const { fn, rateLimited } = queue.splice(idx, 1)[0];
            active++;
            const start = () => {
                if (rateLimited) activeRL++;
                Promise.resolve().then(fn).finally(() => {
                    if (rateLimited) { activeRL--; lastRLFinishedAt = Date.now(); }
                    active--; runQueue();
                });
            };

            if (rateLimited) {
                const now = Date.now();
                const waitLeft = Math.max(0, SCRAPE_DELAY_MS - (now - lastRLFinishedAt));
                if (waitLeft > 0 || activeRL > 0) setTimeout(start, waitLeft);
                else start();
            } else {
                start();
            }
        }
    }

    function processRow(rowEl){
        if(!rowEl || rowEl.dataset[PROCESSED_FLAG]==="1" || rowEl.dataset.pmAvatarPending==="1") return;
        const userLink=rowEl.querySelector('strong > a[href^="/user"]'); if(!userLink) return;
        const userId=(userLink.getAttribute("href").match(/\/user(\d+)\b/)||[])[1]; if(!userId) return;
        const cached = getFromCache(userId);
        if (cached) {
            const testImg = new Image();
            testImg.onload = () => addAvatarToRow(rowEl, cached);
            testImg.onerror = () => {
                const c = readCache(CACHE_KEY);
                delete c[userId];
                writeCache(c, CACHE_KEY);
                rowEl.dataset.pmAvatarPending = "1";
                enqueue(async () => {
                    try {
                        const url = await fetchProfileAvatar(userLink.getAttribute("href"));
                        if (url) {
                            putInCache(userId, url);
                            addAvatarToRow(rowEl, url);
                        } else {
                            rowEl.dataset[PROCESSED_FLAG] = "1";
                        }
                    } catch {} finally {
                        delete rowEl.dataset.pmAvatarPending;
                    }
                }, { rateLimited: true });
            };
            testImg.src = cached;
            return;
        }

        rowEl.dataset.pmAvatarPending = "1";
        enqueue(async () => {
            try {
                const url = await fetchProfileAvatar(userLink.getAttribute("href"));
                if (url) {
                    putInCache(userId, url);
                    addAvatarToRow(rowEl, url);
                } else {
                    rowEl.dataset[PROCESSED_FLAG] = "1";
                }
            } catch {} finally {
                delete rowEl.dataset.pmAvatarPending;
            }
        }, { rateLimited: true });
    }
    function processAllAvatars(root=document){ root.querySelectorAll(LIKE_ITEM_SELECTOR).forEach(processRow); }

    // ---------- Relative "x ago" ----------
    function parseMoscowTime(str){const m=str.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/); if(!m) return null; const [,Y,Mo,D,H,Mi,S]=m.map(Number); const ms=Date.UTC(Y,Mo-1,D,H-3,Mi,S); return new Date(ms);}
    function rel(date){ if(!date) return ""; const s=Math.max(0,(Date.now()-date.getTime())/1000); if(s<60) return `${Math.floor(s)}s ago`; const m=s/60; if(m<60) return `${Math.floor(m)}m ago`; const h=m/60; if(h<24) return `${Math.floor(h)}h ago`; const d=h/24; if(d<30) return `${Math.floor(d)}d ago`; return date.toLocaleDateString(); }
    function processAllTimes(root=document){
        root.querySelectorAll(`${LIKE_ITEM_SELECTOR} small`).forEach(el=>{
            if(el.dataset.pmTimeDone==="1") return;
            const t=el.textContent.trim(); const dt=parseMoscowTime(t);
            if(dt){
                const row = el.closest(LIKE_ITEM_SELECTOR);
                if (row) row.dataset.pmTs = String(dt.getTime());
                el.textContent=rel(dt); el.dataset.pmTimeDone="1";
            }
        });
    }

    // ---------- PM panel helpers ----------
    function ccToFlag(cc){ if(!cc||cc.length!==2) return ""; const A=0x1F1E6,a=cc.toUpperCase(); return String.fromCodePoint(A+(a.charCodeAt(0)-65), A+(a.charCodeAt(1)-65)); }

    async function fetchNomerSmallPhoto(nomerHref){
        const res=await fetch(absUrl(nomerHref),{credentials:"same-origin"}); if(!res.ok) throw new Error(`HTTP ${res.status}`);
        const html=await res.text(); const m=html.match(/https?:\/\/img\d+\.platesmania\.com\/[^"'<>]+\/m\/\d+\.jpg/); if(!m) return null;
        return m[0].replace(/\/m\//,"/s/");
    }

    // NOTE: counts removed from meta fetch; they change and are handled separately (likes live, comments on-hover).
    async function fetchNomerMeta(nomerHref){
        const res = await fetch(absUrl(nomerHref), { credentials: "same-origin" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        const mPng = html.match(/https?:\/\/img\d+\.platesmania\.com\/\d{6}\/inf\/\d+[a-z0-9]*\.png/i);
        const pngUrl = mPng ? mPng[0] : null;

        let make = null, model = null, logoUrl = null;

        const col = doc.querySelector('.col-md-6.col-sm-7');
        const h3Candidates = col ? Array.from(col.querySelectorAll('h3')) : [];
        const mmH3 =
              h3Candidates.find(h => h.matches('.text-center.margin-bottom-10')) ||
              h3Candidates.find(h => h.querySelector('a[href*="/catalog"]')) ||
              null;

        if (mmH3) {
            const links = mmH3.querySelectorAll('a[href*="/catalog"]');
            if (links[0]) make = (links[0].textContent || "").trim();
            if (links[1]) model = (links[1].textContent || "").trim();

            if (make) {
                const s = slug(make).toLowerCase();
                const testUrl = `https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/refs/heads/master/logos/thumb/${s}.png`;
                try {
                    const r = await fetch(testUrl, { method: "GET", cache: "force-cache" });
                    if (r.ok) logoUrl = testUrl;
                } catch {}
            }
        }

        return { pngUrl, make, model, logoUrl };
    }

    // ---------- Helper: inject logo/model (counts handled elsewhere) ----------
    function ensureTooltipMeta(linkEl, meta){
        if (!linkEl || !meta) return;

        const safeMake = (meta.make || "").trim();
        const safeModel = (meta.model || "").trim();
        const textFallback = [safeMake, safeModel].filter(Boolean).join(" ");

        const metaFragment = meta.logoUrl
        ? `<div class="pm-tt-meta"><img class="pm-tt-logo" alt="" src="${meta.logoUrl}"><span class="pm-tt-text">${escapeHtml(safeModel || "")}</span></div>`
          : (textFallback ? `<div class="pm-tt-meta"><span class="pm-tt-text">${escapeHtml(textFallback)}</span></div>` : "");

        if (!metaFragment) return;

        const currentTitle = linkEl.getAttribute("data-original-title") || linkEl.getAttribute("title") || "";
        if (currentTitle && !/pm-tt-meta/.test(currentTitle)) {
            const newTitle = `${currentTitle}${metaFragment}`;
            linkEl.setAttribute("data-original-title", newTitle);
            if (linkEl.hasAttribute("title")) linkEl.setAttribute("title", newTitle);
        }

        const tipId = linkEl.getAttribute("aria-describedby");
        if (tipId) {
            const tip = document.getElementById(tipId);
            const inner = tip && tip.querySelector(".tooltip-inner");
            if (inner && !inner.querySelector(".pm-tt-meta")) {
                const wrapper = document.createElement("div");
                wrapper.className = "pm-tt-meta";
                if (meta.logoUrl) {
                    const img = document.createElement("img");
                    img.className = "pm-tt-logo";
                    img.alt = "";
                    img.src = meta.logoUrl;
                    classifyAndStyleLogo(img);
                    const span = document.createElement("span");
                    span.className = "pm-tt-text";
                    span.textContent = safeModel || "";
                    wrapper.appendChild(img);
                    wrapper.appendChild(span);
                } else {
                    const span = document.createElement("span");
                    span.className = "pm-tt-text";
                    span.textContent = textFallback;
                    wrapper.appendChild(span);
                }
                inner.appendChild(wrapper);
            }
        }
    }

    // ---------- NEW: Live likes (no cache) + comments on 1.5s hover ----------
    async function fetchLikesCountFast(nomerId){
        const url = absUrl(`/list_user_1db.php?id=${encodeURIComponent(nomerId)}`);
        const res = await fetch(url, { credentials: "same-origin" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        const m = html.match(/Total:\s*<b>(\d+)<\/b>/i);
        return m ? parseInt(m[1], 10) : null;
    }

    async function fetchCommentsCountOnly(nomerHref){
        const res = await fetch(absUrl(nomerHref), { credentials: "same-origin" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        try {
            const commentsH2 = Array.from(doc.querySelectorAll('h2.panel-title')).find(h => h.querySelector('.fa.fa-comments'));
            const commentsSpan = commentsH2 && commentsH2.querySelector('.color-grey');
            const m = commentsSpan && commentsSpan.textContent && commentsSpan.textContent.match(/\((\d+)\)/);
            return m ? parseInt(m[1], 10) : null;
        } catch { return null; }
    }

    function applyCountsToOpenTooltip(linkEl){
        const tipId = linkEl.getAttribute("aria-describedby");
        if (!tipId) return;
        const inner = document.getElementById(tipId)?.querySelector(".tooltip-inner");
        if (!inner) return;

        let wrap = inner.querySelector(".pm-tt-counts");
        if (!wrap) {
            wrap = document.createElement("div");
            wrap.className = "pm-tt-counts";
            inner.appendChild(wrap);
        }

        function up(type, val, icon, color){
            if (!Number.isFinite(val)) return;
            let span = wrap.querySelector(`.pm-tt-count[data-type="${type}"]`);
            if (!span) {
                span = document.createElement("span");
                span.className = "pm-tt-count";
                span.setAttribute("data-type", type);
                span.innerHTML = `<i class="fa ${icon}" style="color:${color};"></i><span class="pm-tt-num"></span>`;
                wrap.appendChild(span);
            }
            const num = span.querySelector(".pm-tt-num");
            if (num) num.textContent = String(val);
        }

        const likes = parseInt(linkEl.dataset.pmLikesCount || "", 10);
        if (Number.isFinite(likes)) up("likes", likes, "fa-heart", "red");

        const comments = parseInt(linkEl.dataset.pmCommentsCount || "", 10);
        if (Number.isFinite(comments)) up("comments", comments, "fa-comments", "green");
    }

    function maybeAppendCountsToTitle(linkEl){
        // Add counts HTML once if missing; later updates will be reflected in live tooltip only
        const cur = linkEl.getAttribute("data-original-title") || linkEl.getAttribute("title") || "";
        if (/pm-tt-counts/.test(cur)) return;

        const likes = linkEl.dataset.pmLikesCount;
        const comments = linkEl.dataset.pmCommentsCount;
        const parts = [];
        if (likes) parts.push(`<span class="pm-tt-count" data-type="likes"><i class="fa fa-heart" style="color:red;"></i><span class="pm-tt-num">${escapeHtml(likes)}</span></span>`);
        if (comments) parts.push(`<span class="pm-tt-count" data-type="comments"><i class="fa fa-comments" style="color:green;"></i><span class="pm-tt-num">${escapeHtml(comments)}</span></span>`);
        if (!parts.length) return;

        const frag = `<div class="pm-tt-counts">${parts.join("")}</div>`;
        const s = cur + frag;
        linkEl.setAttribute("data-original-title", s);
        if (linkEl.hasAttribute("title")) linkEl.setAttribute("title", s);
    }

    function attachCountsHooks(linkEl, nomerHref, nomerId){
        if (!linkEl || linkEl.dataset.pmCountsWired === "1") return;
        linkEl.dataset.pmCountsWired = "1";

        // Ensure live tooltip reflects counts whenever opened
        linkEl.addEventListener("mouseenter", () => {
            applyCountsToOpenTooltip(linkEl);
        }, { passive: true });

        // 1) LIKES: fetch immediately for every item on each reload (no cache, no delay)
        if (nomerId && !linkEl.dataset.pmLikesPending) {
            linkEl.dataset.pmLikesPending = "1";
            fetchLikesCountFast(nomerId).then(n=>{
                if (Number.isFinite(n)) {
                    linkEl.dataset.pmLikesCount = String(n);
                    maybeAppendCountsToTitle(linkEl);
                    applyCountsToOpenTooltip(linkEl);
                }
            }).catch(()=>{}).finally(()=>{ delete linkEl.dataset.pmLikesPending; });
        }

        // 2) COMMENTS: fetch only if hovered for 1.5s (no cache, no delay)
        let hoverTimer = null, inside = false;
        linkEl.addEventListener("mouseenter", () => {
            inside = true;
            if (linkEl.dataset.pmCommentsFetched === "1") return;
            hoverTimer = setTimeout(async ()=>{
                if (!inside || linkEl.dataset.pmCommentsFetched === "1") return;
                try{
                    const n = await fetchCommentsCountOnly(nomerHref);
                    if (Number.isFinite(n)) {
                        linkEl.dataset.pmCommentsCount = String(n);
                        linkEl.dataset.pmCommentsFetched = "1";
                        maybeAppendCountsToTitle(linkEl);
                        applyCountsToOpenTooltip(linkEl);
                    }
                }catch{}
            }, 1500);
        }, { passive: true });
        linkEl.addEventListener("mouseleave", () => {
            inside = false;
            if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
        }, { passive: true });
    }

    // ---------- Likes list: plate → image; logo/model into tooltip ----------
    function swapLinkTextWithPlateAndMeta(linkEl, meta){
        if(!linkEl || !meta || !meta.pngUrl) return;
        if (linkEl.querySelector("img.pm-plate")) return;

        linkEl.textContent = "";
        const plateImg=document.createElement("img");
        plateImg.className="pm-plate"; plateImg.alt=""; plateImg.src=meta.pngUrl;
        linkEl.appendChild(plateImg);

        ensureTooltipMeta(linkEl, meta);

        linkEl.dataset.pmPlateDone="1";
    }

    function processPlateInRow(rowEl){
        const link=rowEl.querySelector('a[href*="/nomer"]');
        if(!link || link.dataset.pmPlateDone==="1" || rowEl.dataset.pmPlatePending==="1") return;
        const href=link.getAttribute("href")||""; const id=getNomerId(href); if(!id) return;

        const cachedMetaRaw = getMetaFromCache(id);
        if (cachedMetaRaw){
            const meta = { ...cachedMetaRaw, likesCount:null, commentsCount:null };
            swapLinkTextWithPlateAndMeta(link, meta);
            // counts handled separately:
            attachCountsHooks(link, href, id);
            return;
        }

        const cachedPng = getFromCache(id, PLATE_CACHE_KEY, PLATE_MAX_AGE_MS);
        if (cachedPng){
            swapLinkTextWithPlateAndMeta(link, { pngUrl: cachedPng, make:null, model:null, logoUrl:null });
            attachCountsHooks(link, href, id);
            return;
        }

        rowEl.dataset.pmPlatePending="1";
        enqueue(async()=>{
            try{
                const meta=await fetchNomerMeta(href);
                if (meta.pngUrl){ putInCache(id, meta.pngUrl, PLATE_CACHE_KEY); }
                putMetaInCache(id, meta);
                swapLinkTextWithPlateAndMeta(link, meta);
            }catch{}finally{
                delete rowEl.dataset.pmPlatePending;
                // always wire counts even if meta failed — they work independently
                attachCountsHooks(link, href, id);
            }
        }, { rateLimited: true });
    }
    function processAllPlates(root=document){ root.querySelectorAll(LIKE_ITEM_SELECTOR).forEach(processPlateInRow); }

    // ---------- Comments preview + votes (PM notifications) ----------
    async function fetchNomerComments(nomerHref, count=1){
        const res=await fetch(absUrl(nomerHref),{credentials:"same-origin"}); if(!res.ok) throw new Error(`HTTP ${res.status}`);
        const html=await res.text(); const doc=new DOMParser().parseFromString(html,"text/html");
        const bodies=Array.from(doc.querySelectorAll('#ok .media.media-v2 .media-body'));
        const items=bodies.map(b=>{
            const userEl=b.querySelector('.media-heading strong a, .media-heading strong a span'); let user=""; if(userEl) user=(userEl.textContent||"").trim();
            const contentEl=b.querySelector('div[id^="z"]'); const html=contentEl?contentEl.innerHTML.trim():"";
            let cid=null; if(contentEl && contentEl.id && /^z\d+$/.test(contentEl.id)) cid=contentEl.id.slice(1);
            else{ const smallA=b.closest('.media')?.querySelector('h4 small a[href^="#"]'); if(smallA) cid=smallA.getAttribute('href').replace('#',''); }
            let votesText="0"; if(cid){ const valEl=b.querySelector(`#commentit-itogo-${cid}`); if(valEl) votesText=(valEl.textContent||"0").trim(); }
            return { user, html, cid, votesText };
        }).filter(x=>x.user && x.html && x.cid);
        return items.slice(-count);
    }

    function insertAvatarBy(img,iEl,userLink){
        const nodes=Array.from(iEl.childNodes); const byNode=nodes.find(n=>n.nodeType===3 && /\bby\s*$/i.test(n.textContent));
        if(byNode && byNode.nextSibling===userLink) iEl.insertBefore(img,userLink);
        else if(byNode){ if(byNode.nextSibling) iEl.insertBefore(img,byNode.nextSibling); else iEl.appendChild(img); }
        else iEl.insertBefore(img,userLink);
    }

    function styleVoteValue(el,text){ el.classList.remove('pm-positive','pm-negative'); const t=(text||"").trim(); if(/^\+/.test(t)) el.classList.add('pm-positive'); else if(/^-/.test(t)) el.classList.add('pm-negative'); }
    async function sendPreviewVote(commentId,valueEl,btnEl){
        if(!commentId) return; btnEl.classList.add('pm-busy');
        try{
            const url=absUrl(`/newcom_1_baseu/func.php?g=1&n=${encodeURIComponent(commentId)}`);
            const res=await fetch(url,{method:'GET',credentials:'same-origin',headers:{'X-Requested-With':'XMLHttpRequest'}});
            const text=(await res.text()).trim(); valueEl.textContent=text || valueEl.textContent || "0"; styleVoteValue(valueEl,valueEl.textContent);
        }catch{}finally{ setTimeout(()=>btnEl.classList.remove('pm-busy'),600); }
    }
    function wireUpPreviewVotes(root=document){
        root.querySelectorAll('.pm-vote .pm-vote-btn[data-comment-id]:not([data-pm-wired])').forEach(btn=>{
            btn.dataset.pmWired="1";
            btn.addEventListener('click',(e)=>{ e.preventDefault(); const cid=btn.getAttribute('data-comment-id'); const valueEl=btn.parentElement?.querySelector('.pm-vote-value'); if(!cid || !valueEl) return; sendPreviewVote(cid,valueEl,btn); });
        });
    }

    function processPmAlert(alertEl){
        if(!alertEl || alertEl.dataset.pmPanelDone==="1" || alertEl.dataset.pmPanelPending==="1") return;
        const strong=alertEl.querySelector(".overflow-h > strong"); const titleLink=strong && strong.querySelector('a[href*="/nomer"]');
        if(!strong || !titleLink){ alertEl.dataset.pmPanelDone="1"; return; }

        const path=new URL(titleLink.getAttribute("href"),location.origin).pathname;
        const pathParts=path.split("/").filter(Boolean); const cc=pathParts[0]||""; const nomerId=(path.match(/nomer(\d+)/)||[])[1];

        const flag=ccToFlag(cc);
        if(flag && titleLink && !titleLink.dataset.pmFlagged){ titleLink.textContent=`${flag} ${titleLink.textContent.trim()}`; titleLink.dataset.pmFlagged="1"; }

        const flagImg=alertEl.querySelector("img.rounded-x, .alert img");
        if(flagImg && nomerId){
            const cached=getFromCache(nomerId,NOMER_CACHE_KEY,NOMER_MAX_AGE_MS);
            if(cached){ flagImg.src=cached; flagImg.classList.add("pm-nomer-thumb"); attachPreviewLazy(flagImg,()=> (flagImg.src?flagImg.src.replace(/\/s\//,"/m/"):""),"contain"); }
            else{
                alertEl.dataset.pmPanelPending="1";
                enqueue(async()=>{try{const photoUrl=await fetchNomerSmallPhoto(titleLink.getAttribute("href")); if(photoUrl){putInCache(nomerId,photoUrl,NOMER_CACHE_KEY); flagImg.src=photoUrl; flagImg.classList.add("pm-nomer-thumb"); attachPreviewLazy(flagImg,()=>photoUrl.replace(/\/s\//,"/m/"),"contain"); }}catch{}finally{ delete alertEl.dataset.pmPanelPending; }});
            }
        }

        const iEl=alertEl.querySelector("i");
        if(iEl){
            const userLink=iEl.querySelector('a[href^="/user"]');
            if(userLink && !iEl.querySelector("img.pm-like-avatar")){
                const userHref=userLink.getAttribute("href"); const userId=(userHref.match(/\/user(\d+)\b/)||[])[1];
                const addAvatar=(url)=>{ const img=document.createElement("img"); img.className="pm-like-avatar"; img.width=20; img.height=20; img.alt=""; img.src=url; attachPreview(img,url,"cover"); insertAvatarBy(img,iEl,userLink); };
                useCachedAvatarOrRefetch(userId, userHref, addAvatar);
            }
            if(!iEl.dataset.pmRelTimeDone){
                const time=iEl.getAttribute("data-original-title")||""; const mDate=iEl.textContent && iEl.textContent.match(/\((\d{4}-\d{2}-\d{2})\)/);
                const dateStr=mDate?mDate[1]:""; const dt=(time && dateStr)?parseMoscowTime(`${dateStr} ${time}`):null;
                if(dt){ iEl.innerHTML=iEl.innerHTML.replace(/\(\d{4}-\d{2}-\d{2}\)/,(`(${rel(dt)})`)); iEl.dataset.pmRelTimeDone="1"; }
            }
        }

        const isGreenComment = alertEl.classList.contains("alert-blocks-success");
        const pDesc=alertEl.querySelector(".overflow-h > p");
        let count=1; const plusEm=strong && strong.querySelector("small.pull-right em");
        if(plusEm){ const m=plusEm.textContent && plusEm.textContent.match(/\+(\d+)/); if(m) count=Math.max(1,parseInt(m[1],10)); }

        if (isGreenComment && pDesc && titleLink && !pDesc.dataset.pmCommentsLoaded && !pDesc.dataset.pmCommentsPending){
            pDesc.dataset.pmCommentsPending="1";
            enqueue(async()=>{try{
                const comments=await fetchNomerComments(titleLink.getAttribute("href"),count);
                if(comments && comments.length){
                    const html=comments.map(c=>{
                        const safeUser=escapeHtml(c.user); const votes=(c.votesText||"0").trim();
                        const positiveClass=/^\+/.test(votes)?" pm-positive":(/^-/.test(votes)?" pm-negative":"");
                        return `<div class="pm-comment-preview"><span class="pm-comment-text"><b>${safeUser}:</b> ${c.html}</span><span class="pm-vote" data-pm-cid="${c.cid}"><i class="fa fa-plus-circle pm-vote-btn" title="Upvote" data-comment-id="${c.cid}"></i><span class="pm-vote-value${positiveClass}" id="pm-commentit-itogo-${c.cid}">${escapeHtml(votes)}</span></span></div>`;
                    }).join("");
                    pDesc.innerHTML=html; wireUpPreviewVotes(pDesc);
                }
            }catch{}finally{ delete pDesc.dataset.pmCommentsPending; pDesc.dataset.pmCommentsLoaded="1"; }});
        } else if (pDesc) {
            // mark as "handled" so non-green alerts won't keep trying
            pDesc.dataset.pmCommentsLoaded = "1";
        }


        alertEl.dataset.pmPanelDone="1";
    }
    function processPmPanel(root=document){ const alerts=root.querySelectorAll('.panel .alert.alert-blocks, #scrollbar3 .alert.alert-blocks'); alerts.forEach(processPmAlert); }

    // ---------- New notifications counter (heading) ----------
    let PM_SESSION_BASELINE_MS = Number((readCache(PM_LAST_SEEN_KEY) || {}).ts || 0);
    let PM_SESSION_MAX_MS = 0;

    function setLastSeenMs(ms){
        writeCache({ ts: ms }, PM_LAST_SEEN_KEY);
    }

    function getNotificationsHeading(){
        const list = document.querySelector('#mCSB_2, #content');
        const panel = list && list.closest('.panel');
        return panel ? panel.querySelector('.panel-heading .panel-title') : document.querySelector('.panel-heading .panel-title');
    }

    function updateNewBadge(count, plus){
        const h = getNotificationsHeading();
        if (!h) return;
        let badge = h.querySelector('.pm-new-count');
        if (!badge){
            badge = document.createElement('span');
            badge.className = 'pm-new-count';
            h.appendChild(badge);
        }
        badge.textContent = ` - ${count}${plus?'+':''} new`;
    }

    function recalcNewNotifications(){
        const rows = Array.from(document.querySelectorAll(LIKE_ITEM_SELECTOR));
        let minTs = Infinity;
        let maxTs = 0;
        let countNew = 0;
        let any = false;

        for (const r of rows){
            const ts = Number(r.dataset.pmTs || 0);
            if (!ts) continue;
            any = true;
            if (ts > PM_SESSION_BASELINE_MS) countNew++;
            if (ts < minTs) minTs = ts;
            if (ts > maxTs) maxTs = ts;
        }

        if (any && maxTs > PM_SESSION_MAX_MS) PM_SESSION_MAX_MS = maxTs;

        const showPlus = !!(PM_SESSION_BASELINE_MS && any && minTs > PM_SESSION_BASELINE_MS);
        updateNewBadge(PM_SESSION_BASELINE_MS ? countNew : 0, PM_SESSION_BASELINE_MS ? showPlus : false);
    }

    window.addEventListener('pagehide', ()=>{ if (PM_SESSION_MAX_MS) setLastSeenMs(PM_SESSION_MAX_MS); });
    window.addEventListener('beforeunload', ()=>{ if (PM_SESSION_MAX_MS) setLastSeenMs(PM_SESSION_MAX_MS); });

    // ---------- Observe ----------
    function observe(){
        const container=document.querySelector(CONTAINER_SELECTOR)||document.body;
        const mo=new MutationObserver(muts=>{
            muts.forEach(m=>m.addedNodes.forEach(n=>{
                if(!(n instanceof HTMLElement)) return;
                processAllAvatars(n);
                processAllTimes(n);
                processAllPlates(n);
                processPmPanel(n);
                wireUpPreviewVotes(n);
                processAllLogos(n);
                recalcNewNotifications();
            }));
        });
        mo.observe(container,{childList:true,subtree:true});

        const pmPanel=document.querySelector('#scrollbar3')||document.querySelector('.panel .panel-title i.fa-send')?.closest('.panel');
        if(pmPanel){
            const mo2=new MutationObserver(muts=>{
                muts.forEach(m=>m.addedNodes.forEach(n=>{
                    if(n instanceof HTMLElement){
                        processPmPanel(n);
                        wireUpPreviewVotes(n);
                        processAllLogos(n);
                    }
                }));
            });
            mo2.observe(pmPanel,{childList:true,subtree:true});
        }
    }

    // ---------- Infinite scroll for likes (mCustomScrollbar-aware, bottom 15%) ----------
    (function setupInfiniteScroll(){
        const VIEW_SEL      = '#mCSB_2';
        const CONTAINER_SEL = '#mCSB_2_container';
        const LIST_SEL      = '#content';
        const LOAD_BTN_SEL  = '#load button';
        const SPINNER_SEL   = '#imgLoad';

        let isLoading  = false;
        let endReached = false;
        let itemCount  = 0;

        const view      = document.querySelector(VIEW_SEL);
        const container = document.querySelector(CONTAINER_SEL);
        const list      = document.querySelector(LIST_SEL);
        const spinner   = document.querySelector(SPINNER_SEL);

        if (!view || !container || !list) return;

        function showSpinner(){ if (spinner) spinner.style.display = 'inline-block'; }
        function hideSpinner(){ if (spinner) spinner.style.display = 'none'; }

        function countItems(){ return list.querySelectorAll('li').length; }
        itemCount = countItems();

        const sentinel = document.createElement('div');
        sentinel.style.cssText = 'height:1px;';
        function placeSentinel(){ if (list.lastElementChild !== sentinel) list.appendChild(sentinel); }
        placeSentinel();

        const originalAlert = window.alert;
        window.alert = function(msg){
            try{
                if (typeof msg === 'string' && msg.toLowerCase().includes("that's all")) {
                    endReached = true; isLoading = false; hideSpinner();
                }
            }catch{}
            return originalAlert.apply(this, arguments);
        };

        function triggerLoadMore(){
            if (isLoading || endReached) return;
            const btn = document.querySelector(LOAD_BTN_SEL);
            if (!btn) return;
            isLoading = true; showSpinner();
            const before = countItems();
            btn.click();
            setTimeout(() => {
                if (countItems() <= before) { isLoading = false; hideSpinner(); }
            }, 5000);
        }

        function getProgress(){
            const cs = getComputedStyle(container);
            const topPx = parseFloat(cs.top) || 0;
            const scrolled = Math.max(0, -topPx);
            const visibleH = view.clientHeight || 1;
            const contentH = container.scrollHeight || container.getBoundingClientRect().height || 1;
            return (scrolled + visibleH) / contentH;
        }

        function maybeLoad(){
            if (getProgress() >= 0.85) triggerLoadMore();
        }

        const listMO = new MutationObserver(() => {
            placeSentinel();
            const now = countItems();
            if (isLoading && now > itemCount) { itemCount = now; isLoading = false; hideSpinner(); }
            recalcNewNotifications();
            maybeLoad();
        });
        listMO.observe(list, { childList: true });

        view.addEventListener('scroll', () => requestAnimationFrame(maybeLoad), { passive: true });
        view.addEventListener('wheel',  () => requestAnimationFrame(maybeLoad), { passive: true });
        window.addEventListener('resize', () => requestAnimationFrame(maybeLoad), { passive: true });

        setTimeout(maybeLoad, 0);
        setTimeout(maybeLoad, 400);
    })();

    // ---------- Kickoff ----------
    processAllAvatars(document);
    processAllTimes(document);
    processAllPlates(document);
    processPmPanel(document);
    wireUpPreviewVotes(document);
    processAllLogos(document);
    recalcNewNotifications();
    observe();

    setInterval(()=>{
        processAllAvatars(document);
        processAllTimes(document);
        processAllPlates(document);
        processPmPanel(document);
        wireUpPreviewVotes(document);
        processAllLogos(document);
        recalcNewNotifications();
    },1500);
})();
