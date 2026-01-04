// ==UserScript==
// @name         Base64 Link Preview++
// @description  Base64 URL Decode & Link Preview
// @namespace    https://arca.live/
// @author       undefined feat cloud67p
// @version      2.8.3
// @match        *://arca.live/*
// @match        *://kone.gg/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537004/Base64%20Link%20Preview%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/537004/Base64%20Link%20Preview%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 글 작성/수정 페이지 제외
    if (/\/edit|\/write/.test(location.pathname)) return;

    /* ---------------- style ---------------- */
    const style = document.createElement('style');
    style.textContent = `
    /* Skeleton */
    .skeleton { background: linear-gradient(90deg,#eee 25%,#ddd 37%,#eee 63%); background-size:400% 100%; animation:skeleton-loading 1.4s ease infinite;border-radius:4px; }
    .skeleton-dark { background: linear-gradient(90deg,#444 25%,#555 37%,#444 63%); background-size:400% 100%; animation:skeleton-loading 1.4s ease infinite;border-radius:4px; }
    @keyframes skeleton-loading {0%{background-position:100% 0;}100%{background-position:-100% 0;}}

    /* Toast */
    .b64-toast { position:fixed; bottom:20px; left:50%; transform:translateX(-50%); padding:14px 16px; background:rgba(0,0,0,0.8); color:#fff; font-size:12px; border-radius:6px; z-index:100000; display:flex; align-items:center; box-shadow:0 2px 4px rgba(0,0,0,0.5); }
    .b64-toast .close-btn { margin-left:10px; cursor:pointer; font-weight:bold; user-select:none; }
    `;
    document.head.appendChild(style);

    /* ---------------- utilities ---------------- */
    function applyStyles(el, styles) { Object.assign(el.style, styles); }
    function isBase64(str) { return /^[A-Za-z0-9+\/=]+$/.test(str) && (()=>{ try{atob(str);return true;}catch{return false;} })(); }
    function isValidURL(url) { try{ new URL(url); return true;}catch{return false;} }
    function decodeOnce(s) { try { const bytes = Uint8Array.from(atob(s), c=>c.charCodeAt(0)); return new TextDecoder().decode(bytes); } catch { return null; } }
    function decodeUntilHttp(s, depth=4) { let cur=s.trim(); for(let i=0;i<depth;i++){ const d=decodeOnce(cur); if(!d) break; cur=d.trim(); if(/^https?:\/\//i.test(cur)) return cur;} return null; }

    // KIOSK Favicon
    const KIOSK_FAVICON = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTM1IiBoZWlnaHQ9IjEzNSIgdmlld0JveD0iMCAwIDEzNSAxMzUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xNy41IDY3LjVDMTcuNSAzOS44ODU4IDM5Ljg4NTggMTcuNSA2Ny41IDE3LjVWMTcuNVY2Ny41QzY3LjUgOTUuMTE0MiA0NS4xMTQyIDExNy41IDE3LjUgMTE3LjVWMTE3LjVWNjcuNVoiIGZpbGw9IiNFM0U0RTgiLz4KPHBhdGggZD0iTTY3LjUgNjcuNUM2Ny41IDM5Ljg4NTggODkuODg1OCAxNy41IDExNy41IDE3LjVWMTcuNVgxMTcuNVY2Ny41VjY3LjVaIiBmaWxsPSIjMDA0MEZGIi8+CjxwYXRoIGQ9Ik02Ny41IDY3LjVWNjcuNUM5NS4xMTQyIDY3LjUgMTE3LjUgODkuODg1OCAxMTcuNSAxMTcuNVgxMTcuNUg2Ny41VjY3LjVaIiBmaWxsPSIjOTlCMkZGIi8+Cjwvc3ZnPgo=";

    function getFavicon(url) {
        const hostname = new URL(url).hostname;
        if (hostname.includes('kiosk')) return Promise.resolve(KIOSK_FAVICON);
        const ico = `https://${hostname}/favicon.ico`;
        return new Promise(resolve => {
            const img = new Image(); img.onload = () => resolve(ico); img.onerror = () => resolve(`https://www.google.com/s2/favicons?domain=${hostname}`); img.src = ico;
        });
    }

    function getSiteTitle(url) {
        const host = new URL(url).hostname;
        if (host.includes('arca.live')) return fetchTitleDirect(url).catch(()=>host);
        return fetchTitleCORS(url).catch(()=>host);
    }
    function fetchTitleCORS(url) {
        const api=`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        return fetch(api).then(r=>r.json()).then(d=> new DOMParser().parseFromString(d.contents,'text/html').querySelector('title').textContent);
    }
    function fetchTitleDirect(url) {
        return fetch(url).then(r=>r.text()).then(html=> new DOMParser().parseFromString(html,'text/html').querySelector('title').textContent);
    }

    function detectTheme() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const [r,g,b] = bg.match(/\d+/g).map(Number); return (r*299+g*587+b*114)/1000<128?'dark':'light';
    }

    function createOGCard({url}) {
        const dark = detectTheme()==='dark';
        const c=document.createElement('div'); c.setAttribute('data-lp-card','true');
        applyStyles(c, { display:'flex', alignItems:'center', padding:'10px', margin:'6px 0', border:`1px solid ${dark?'#444':'#e0e0e0'}`, borderRadius:'8px', background:dark?'#333':'#fff', color:dark?'#eee':'#000', fontSize:'14px', cursor:'pointer', gap:'10px' });
        c.onclick=() => window.open(url,'_blank');
        const iconWrap=document.createElement('div'); applyStyles(iconWrap,{width:'32px',height:'32px',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'4px',background:dark?'#555':'#eee'});
        const img=document.createElement('img'); applyStyles(img,{width:'16px',height:'16px',display:'block'});
        getFavicon(url).then(src=>img.src=src);
        iconWrap.appendChild(img);
        const textWrap=document.createElement('div'); applyStyles(textWrap,{display:'flex',flexDirection:'column',justifyContent:'center',flex:1,minWidth:0});
        const titleEl=document.createElement('div'); applyStyles(titleEl,{fontWeight:600,fontSize:'15px',lineHeight:1.4,marginBottom:'4px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'});
        titleEl.classList.add('skeleton'); if(dark) titleEl.classList.add('skeleton-dark');
        const urlWrap=document.createElement('div'); applyStyles(urlWrap,{position:'relative',overflow:'hidden'});
        const urlEl=document.createElement('div'); urlEl.textContent=url; applyStyles(urlEl,{fontSize:'12px',lineHeight:1.2,color:dark?'#aaa':'#777',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'});
        const fade=document.createElement('div'); applyStyles(fade,{position:'absolute',top:0,right:0,width:'30px',height:'100%',pointerEvents:'none',background:dark?'linear-gradient(to right, transparent, #333)':'linear-gradient(to right, transparent, #fff)'});
        urlWrap.append(urlEl,fade);
        getSiteTitle(url).then(t=>{ titleEl.textContent=t; titleEl.classList.remove('skeleton','skeleton-dark'); });
        textWrap.append(titleEl,urlWrap);
        c.append(iconWrap,textWrap);
        return c;
    }

    function createTextContainer(txt) {
        const dark=detectTheme()==='dark';
        const d=document.createElement('div'); applyStyles(d,{display:'flex',alignItems:'center',margin:'6px 0',padding:'6px 10px',borderRadius:'6px',background:dark?'#444':'#f5f5f5',color:dark?'#ddd':'#444',fontSize:'14px',border:`1px solid ${dark?'#666':'#ddd'}`});
        const span=document.createElement('span'); span.textContent=txt; d.appendChild(span);
        return d;
    }

    function processTextNodes(root=document.body) {
        if(root.nodeType===1 && root.closest('[data-lp-card]')) return;
        const walker=document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
        const curUrl=location.href.split(/[?#]/)[0];
        nodes.forEach(node=>{
            if(node.parentNode.closest('[data-lp-card]')) return;
            let used=false;
            const text=node.nodeValue;
            /* 자동으로 base64찾기 -> 닉네임도 바꾸길래 비활성화
            const b64s=text.match(/\b[A-Za-z0-9+\/=]{16,}\b/g)||[];
            b64s.forEach(enc=>{
                if(isBase64(enc)){
                    const dec=atob(enc).trim();
                    if(isValidURL(dec) && dec.split(/[?#]/)[0]!==curUrl){ node.parentNode.append(createOGCard({url:dec})); used=true; }
                    else if(!isValidURL(dec)){ node.parentNode.append(createTextContainer(dec)); used=true; }
                }
            });
            */
            (text.match(/https?:\/\/\S+/g)||[]).forEach(u=>{
                if(isValidURL(u) && u.split(/[?#]/)[0]!==curUrl){ node.parentNode.append(createOGCard({url:u})); used=true; }
            });
            if(used) node.parentNode.removeChild(node);
        });
    }

    /* ------------- Selection handler ------------- */
    class B64Handler {
        constructor() { this.toast=null; this.last=''; this.outsideClickCount = 0;}
        showToast(url) {
            this.removeToast();
            this.outsideClickCount = 0;
            const el = document.createElement('div');
            el.className = 'b64-toast';
            const a = document.createElement('a');
            a.href = url;
            a.textContent = url;
            el.appendChild(a);
            const btn = document.createElement('span');
            btn.className = 'close-btn';
            btn.textContent = '×';
            btn.onclick = () => this.removeToast();
            el.appendChild(btn);
            document.body.appendChild(el);
            this.toast = el;
        }
        removeToast() {
            if (this.toast) {
                clearTimeout(this.tmr);
                this.toast.remove();
                this.toast = null;
                this.last = '';
                this.outsideClickCount = 0;
            }
        }
        onSelect() {
            const sel=window.getSelection().toString().trim();
            if(!sel||sel===this.last) return; this.last=sel;
            const url=decodeUntilHttp(sel);
            if(url) {
                this.showToast(`🔗 ${url}`);
                const anchor=window.getSelection().anchorNode;
                const parent=anchor&&anchor.nodeType===3?anchor.parentElement:null;
                if(parent) parent.insertAdjacentElement('afterend', createOGCard({url}));
            }
        }
        init() {
            document.addEventListener('selectionchange', ()=>this.onSelect());
                document.addEventListener('click', e => {
        if (!this.toast) return;               // 토스트 없으면 무시
        if (this.toast.contains(e.target)) return; // 토스트 내부 클릭도 무시

        this.outsideClickCount++;
        // 두 번째 바깥 클릭에서 닫기
        if (this.outsideClickCount >= 2) {
            this.removeToast();
        }
    });
        }
    }

    // init
    const handler=new B64Handler(); handler.init();
    processTextNodes();
    new MutationObserver(m=>m.forEach(r=>r.addedNodes.forEach(n=>{ if(n.nodeType===1&&!n.closest('[data-lp-card]')) processTextNodes(n); })))
        .observe(document.body,{ childList:true, subtree:true });
})();