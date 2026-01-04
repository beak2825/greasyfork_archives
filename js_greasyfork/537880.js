// ==UserScript==
// @name         2137 Highlighter Sztos
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Neonowo podświetla każdy „2137”. Toast i konfetti odpala zbiorczo (maks. co 3 s), więc brak spamowego alertu przy dynamicznych stronach.
// @author       @TomaszFromasz
// @exclude      https://trans-logistics-eu.amazon.com/yms/*
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.1/dist/confetti.browser.min.js
// @downloadURL https://update.greasyfork.org/scripts/537880/2137%20Highlighter%20Sztos.user.js
// @updateURL https://update.greasyfork.org/scripts/537880/2137%20Highlighter%20Sztos.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =============== KONFIGURACJA/EFEKTY ================= */
    const TARGET        = '2137';
    const REGEX         = new RegExp(`\\b${TARGET}\\b`, 'g');
    const SOUND_SRC     = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
    const COOLDOWN_MS   = 3000;          // minimalny odstęp między konfetti/alertami

    let audio;
    let lastCelebration = 0;

    /* =============== STYLE =============================== */
    GM_addStyle(`
      .tm-2137-highlight{
        background:linear-gradient(90deg,#ff003c,#c648ff,#00cfff,#ffe219 80%);
        background-size:400% 100%;
        -webkit-background-clip:text;background-clip:text;
        color:transparent;font-weight:900;
        animation:tm-glow 1s infinite alternate,tm-hue 6s linear infinite;
        cursor:crosshair;
      }
      @keyframes tm-glow{from{ text-shadow:0 0 8px #fff,0 0 18px #ff003c;}to{ text-shadow:0 0 12px #fff,0 0 24px #00cfff;}}
      @keyframes tm-hue{to{ background-position:-400% 0;}}

      .tm-2137-toast{
        position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
        background:rgba(0,0,0,.85);color:#fff;padding:16px 34px;border-radius:14px;
        font-size:20px;box-shadow:0 0 18px rgba(255,0,0,.7);z-index:2147483647;
        animation:tm-bounce 1s infinite;
      }
      @keyframes tm-bounce{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,-12px)}}
    `);

    /* =============== FUNKCJE POMOCNICZE ================= */
    function fireConfetti(){
        if(typeof confetti!=='function') return;
        confetti({particleCount:160,spread:120,startVelocity:50,origin:{y:0.6}});
        confetti({particleCount:100,spread:100,startVelocity:40,origin:{x:0.15,y:0.3}});
        confetti({particleCount:100,spread:100,startVelocity:40,origin:{x:0.85,y:0.3}});
    }

    function loadSound(){return new Promise(r=>{if(audio) return r(audio);audio=new Audio(SOUND_SRC);audio.volume=0.8;audio.addEventListener('canplaythrough',()=>r(audio),{once:true});});}
    function playSound(){loadSound().then(a=>{try{a.currentTime=0;a.play();}catch{}});}

    function showToast(){const t=document.createElement('div');t.className='tm-2137-toast';t.textContent='🔥 2137 spotted!';document.body.appendChild(t);setTimeout(()=>t.remove(),6000);}

    function celebrate(){
        const now=Date.now();
        if(now - lastCelebration < COOLDOWN_MS) return; // anti‑spam
        lastCelebration = now;
        alert('Znaleziono legendarną 2137!');
        showToast();
        playSound();
        fireConfetti();
    }

    /* =============== PODŚWIETLANIE ======================= */
    function highlight(node){
        const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT,null);
        let hits=0;
        while(walker.nextNode()){
            const txt=walker.currentNode;
            if(!txt.parentNode||txt.parentNode.closest('.tm-2137-highlight')) continue;
            if(REGEX.test(txt.textContent)){
                const parts=txt.textContent.split(REGEX);
                const frag=document.createDocumentFragment();
                parts.forEach((p,i)=>{
                    if(i){const span=document.createElement('span');span.className='tm-2137-highlight';span.textContent=TARGET;frag.appendChild(span);hits=1;}
                    if(p) frag.appendChild(document.createTextNode(p));
                });
                txt.parentNode.replaceChild(frag,txt);
            }
        }
        return hits;
    }

    /* =============== START & OBSERWATOR ================== */
    if (highlight(document.body)) celebrate();

    const obs=new MutationObserver(muts=>{
        let anyHit=false;
        for(const m of muts){
            for(const n of m.addedNodes){
                if(n.nodeType===3) anyHit = highlight(n.parentNode) || anyHit;
                else if(n.nodeType===1) anyHit = highlight(n) || anyHit;
            }
        }
        if(anyHit) celebrate();
    });
    obs.observe(document.body,{childList:true,subtree:true,characterData:true});

})();
