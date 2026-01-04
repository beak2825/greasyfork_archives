// ==UserScript==
// @name         Rave Web Easy 
// @namespace    https://rave.api-x.site
// @version      1.7
// @description  Mira Rave web de forma simple
// @match        *://*/*
// @grant        GM.xmlHttpRequest
// @grant        GM.setClipboard
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/511207/Rave%20Web%20Easy.user.js
// @updateURL https://update.greasyfork.org/scripts/511207/Rave%20Web%20Easy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const w='https://rave.api-x.site';
    function f(u){
        const e=['.js','.css','.json','.png','.jpg','.jpeg','.gif','.svg','.woff','.woff2','.ttf','.eot'];
        const k=['ads','analytics','tracker','pixel'];
        const l=u.toLowerCase();
        return!(e.some(x=>l.endsWith(x))||k.some(y=>l.includes(y)));
    }
    function s(u){
        if(!f(u))return;
        GM.xmlHttpRequest({
            method:'POST',url:w,
            data:JSON.stringify({url:u}),
            headers:{'Content-Type':'application/json','X-Source':'VioletMonkey'},
            onload:function(r){
                if(r.status===200){
                    try{
                        const d=JSON.parse(r.responseText);
                        if(d.isCompatible&&d.customUrl)n(d.customUrl);
                    }catch(e){}
                }
            }
        });
    }
    function n(u){
        const d=document.createElement('div');
        d.style.cssText=`position:fixed;bottom:10px;right:10px;background:#4a4a4a;color:white;border:2px solid #ffa500;border-radius:5px;padding:10px;z-index:9999;box-shadow:0 2px 10px rgba(0,0,0,0.2);font-family:Arial,sans-serif;max-width:300px;font-size:14px;`;
        d.innerHTML=`<h3 style="margin:0 0 10px;color:#ffa500;">Link Compatible Rave</h3><p style="margin:0 0 10px;word-break:break-all;">${u}</p><button id="cb" style="background:#4CAF50;border:none;color:white;padding:5px 10px;text-align:center;text-decoration:none;display:inline-block;font-size:14px;margin:4px 2px;cursor:pointer;border-radius:3px;">Copiar URL</button>`;
        document.body.appendChild(d);
        const b=d.querySelector('#cb');
        b.addEventListener('click',function(){
            GM.setClipboard(u);
            this.textContent='Copiado!';
            setTimeout(()=>this.textContent='Copiar URL',2000);
        });
        setTimeout(()=>document.body.removeChild(d),10000);
    }
    function p(i){
        GM.xmlHttpRequest({
            method:'GET',url:i.src,
            onload:function(r){
                if(r.status===200){
                    const d=new DOMParser().parseFromString(r.responseText,'text/html');
                    e(d).forEach(u=>s(u));
                }
            }
        });
    }
    function e(d){
        const u=new Set();
        const r=/(https?:\/\/[^\s"'<>]+)/g;
        const t=d.body.innerText;
        const m=t.match(r);
        if(m)m.forEach(x=>{if(f(x))u.add(x);});
        d.querySelectorAll('a[href],iframe[src],embed[src],source[src],video[src],audio[src]').forEach(l=>{
            const x=l.src||l.href;
            if(x&&f(x))u.add(x);
        });
        return Array.from(u);
    }
    function i(){
        const o=XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open=function(){
            this.addEventListener('loadend',()=>{
                if(f(this.responseURL))s(this.responseURL);
            });
            return o.apply(this,arguments);
        };
        const g=window.fetch;
        window.fetch=function(){
            return g.apply(this,arguments).then(r=>{
                if(f(r.url))s(r.url);
                return r;
            });
        };
    }
    function o(){
        new MutationObserver(m=>{
            m.forEach(t=>{
                t.addedNodes.forEach(n=>{
                    if(n.nodeName==='VIDEO'||n.nodeName==='AUDIO'){
                        const x=n.src||(n.dataset&&n.dataset.src);
                        if(x&&f(x))s(x);
                    }else if(n.nodeName==='IFRAME'){
                        const x=n.src||(n.dataset&&n.dataset.src);
                        if(x&&f(x))p(n);
                    }
                });
            });
        }).observe(document.documentElement,{childList:true,subtree:true});
    }
    i();
    o();
})();