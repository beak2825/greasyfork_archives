// ==UserScript==
// @name         Displate Art Downloader
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Download highest-res Displate art with title and resolution filename.
// @match        https://displate.com/displate/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      cdn.displate.com
// @run-at       document-idle
// @license WTFPL
// @downloadURL https://update.greasyfork.org/scripts/540480/Displate%20Art%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/540480/Displate%20Art%20Downloader.meta.js
// ==/UserScript==

(function(){
  if (!/^\/displate\/[^\/]+$/.test(location.pathname)) return;
  const btnCSS = `#dlArtBtn{position:fixed;top:100px;right:20px;padding:8px 12px;background:#e82c4b;color:#fff;border:none;border-radius:4px;cursor:pointer;z-index:9999}#dlArtBtn:hover{background:#c11e3b}`;
  const s=document.createElement('style');s.textContent=btnCSS;document.head.appendChild(s);
  const btn=document.createElement('button');btn.id='dlArtBtn';btn.textContent='Download Art';btn.onclick=dl;document.body.appendChild(btn);
  new MutationObserver(()=>{ if(!document.getElementById('dlArtBtn')) document.body.appendChild(btn); })
    .observe(document.body,{childList:true,subtree:true});

  async function dl(){
    const slug=location.pathname.split('/').pop(), base=`/artwork/${slug}`;
    const cand=new Set();
    ['jpg','webp'].forEach(ext=>{
      cand.add(`https://cdn.displate.com${base}.${ext}`);
      [1200,2048,3840,5120].forEach(sz=>cand.add(`https://cdn.displate.com${base}.${ext}?size=${sz}`));
    });
    document.querySelectorAll('picture source[srcset],img[srcset],img[src]').forEach(el=>{
      (el.srcset||el.src||'').split(',').map(x=>x.trim().split(' ')[0]).forEach(u=>{
        try{const url=new URL(u,location);if(url.host==='cdn.displate.com'&&url.pathname.startsWith(base))cand.add(url.href)}catch{}
      });
    });
    document.querySelectorAll('script[type="application/ld+json"],script#__NEXT_DATA__').forEach(s=>{
      try{JSON.stringify(JSON.parse(s.textContent)).match(/https?:\/\/cdn\.displate\.com\/artwork\/[^"'} ]+/g)
        .forEach(u=>cand.add(u))}catch{}
    });
    Array.from(cand).forEach(u=>{const v=u.replace(/_w\d+/,'_w5000');if(v!==u)cand.add(v)});
    const arr=await Promise.all([...cand].map(u=>new Promise(r=>{
      GM_xmlhttpRequest({method:'HEAD',url:u,onload(resp){const m=resp.responseHeaders.match(/content-length:\s*(\d+)/i);r({u,size:+(m?m[1]:0)})},onerror:()=>r({u,size:0})});
    })));
    const best=arr.sort((a,b)=>b.size-a.size)[0];
    if(!best||!best.size) return alert('No art found');
    const img=new Image(); img.src=best.u; await new Promise(r=>img.onload=img.onerror=r);
    const res=img.naturalWidth&&img.naturalHeight?`${img.naturalWidth}x${img.naturalHeight}`:'';
    const titleEl=[...document.querySelectorAll('[class^="HeroTitle_heading__"]')]
      .find(e=>e.textContent.trim());
    const baseName=titleEl?titleEl.textContent.trim().replace(/\s+/g,'_').replace(/[\/\\:*?"<>|]+/g,'_'):slug;
    const ext=best.u.split('.').pop().split('?')[0];
    const name=res?`${baseName}_${res}.${ext}`:`${baseName}.${ext}`;
    GM_download({url:best.u,name,onerror:()=>alert('Error'),ontimeout:()=>alert('Timeout')});
  }
})();
