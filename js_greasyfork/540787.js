// ==UserScript==
// @name         WebsiteFucker (VISUAL)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Escalating glitch payloads, 2.5 s tween-chaos, vivid Matrix rain, and working Scanline text corruption. Use menu to start/stop.
// @author       Meoinc
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540787/WebsiteFucker%20%28VISUAL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540787/WebsiteFucker%20%28VISUAL%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ───────── CONSTANTS ───────── */
    const BASE_STEP = 50;              // ms between .step() ticks
    const STEPS_PER_PLD = 300;         // ~15 s per payload
    const TWEEN_PERIOD = 2500;         // 2.5 s tween chaos
    const TWEEN_DUR   = 2000;          // ms CSS transition
    const GLYPHS      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const ORIG_TITLE  = document.title || 'Glitchmageddon';

    /* ───────── STATE ───────── */
    let ticker   = null;               // payload step interval
    let tweener  = null;               // tween-chaos interval
    let idx      = 0;                  // current payload index
    let overlay  = null;               // “YOU’VE BEEN HACKED!!!”

    /* ───────── OVERLAY ───────── */
    function showOverlay() {
        overlay?.remove();
        overlay = document.createElement('div');
        overlay.textContent = "YOU'VE BEEN HACKED!!!";
        overlay.className   = 'glitch-exempt';
        Object.assign(overlay.style, {
            position: 'fixed', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '6vw', fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif', color: 'red',
            background: 'transparent', userSelect: 'none',
            pointerEvents: 'none', zIndex: 2147483647,
            opacity: 1, transition: 'opacity 1s ease'
        });
        document.body.appendChild(overlay);
        setTimeout(() => (overlay.style.opacity = 0), 5000);
        setTimeout(() => overlay?.remove(),        6000);
    }

    /* ───────── CHAOS BURST ───────── */
    function chaosBurst() {
        const live = [...document.body.querySelectorAll('*')]
            .filter(el => el.offsetParent && !el.classList.contains('glitch-exempt'));
        /* jitter a handful */
        for (let i = 0; i < 10; i++) {
            const el = live[Math.random() * live.length | 0];
            if (!el) continue;
            el.style.transition = 'transform 0.5s ease';
            el.style.transform  =
                `translate(${Math.random() * 40 - 20}px,${Math.random() * 40 - 20}px)
                 rotate(${Math.random() * 30 - 15}deg)`;
            setTimeout(() => (el.style.transform = ''), 2500);
        }
        /* spawn glyph sprites */
        for (let i = 0; i < 6; i++) {
            const d = document.createElement('div');
            d.textContent = Array.from({ length: 5 }, () => GLYPHS[Math.random() * GLYPHS.length | 0]).join('');
            Object.assign(d.style, {
                position: 'fixed',
                top:  `${Math.random() * 90 + 5}vh`,
                left: `${Math.random() * 90 + 5}vw`,
                color: ['#0F0', '#F0F', '#0FF', '#FF0'][Math.random() * 4 | 0],
                fontWeight: 'bold',
                fontSize: `${Math.random() * 24 + 14}px`,
                pointerEvents: 'none',
                zIndex: 2147483646,
                mixBlendMode: 'screen',
                filter: 'drop-shadow(0 0 4px currentColor)',
                opacity: 0.9,
                transform: `rotate(${Math.random() * 360}deg)`
            });
            document.body.appendChild(d);
            setTimeout(() => d.remove(), 4000 + Math.random() * 2000);
        }
        /* delete a few tiny elems */
        for (let i = 0; i < 3; i++) {
            const cand = live.filter(e => e.offsetWidth < 100 && e.offsetHeight < 50);
            cand[Math.random() * cand.length | 0]?.remove();
        }
    }

    /* ───────── TWEEN CHAOS (every 2.5 s) ───────── */
    function tweenChaos() {
        const els = [...document.body.querySelectorAll('*')]
            .filter(el => el.offsetParent && !el.classList.contains('glitch-exempt'));
        for (let i = 0; i < 8; i++) {
            const el = els[Math.random() * els.length | 0];
            if (!el) continue;
            el.style.transition = `transform ${TWEEN_DUR}ms ease`;
            el.style.transform  =
                `translate(${Math.random() * 60 - 30}px,${Math.random() * 60 - 30}px)
                 rotate(${Math.random() * 40 - 20}deg)
                 scale(${0.9 + Math.random() * 0.3})`;
            setTimeout(() => (el.style.transform = ''), TWEEN_DUR);
        }
    }

    /* ───────── PAYLOADS ───────── */
    const payloads = [
        /* 0 — ORIGINAL CHAOS + COUNTDOWN TIMER */
{
    name: 'Original', styleId: 'orig-style', bodyClass: 'scanlines',
    timerEl: null,
    start() {
        if (!document.getElementById(this.styleId)) {
            const css = `
              @keyframes hue{0%{filter:hue-rotate(0)}100%{filter:hue-rotate(360deg)}}
              @keyframes scan{0%{background-position:0 0}100%{background-position:0 4px}}
              .scanlines::after{
                  content:'';position:fixed;inset:0;pointer-events:none;
                  background:linear-gradient(rgba(0,0,0,.15)50%,transparent 0);
                  background-size:100% 4px;
                  mix-blend-mode:overlay;
                  animation:scan .3s steps(2) infinite;
              }
              #glitch-timer {
                  position: fixed;
                  top: 10px;
                  left: 50%;
                  transform: translateX(-50%);
                  color: #0f0;
                  font-size: 2.5em;
                  font-family: monospace;
                  font-weight: bold;
                  z-index: 2147483647;
                  pointer-events: none;
                  text-shadow: 0 0 10px #0f0, 0 0 20px #0f0;
                  mix-blend-mode: screen;
              }`;
            Object.assign(document.head.appendChild(document.createElement('style')),
                { id: this.styleId, textContent: css });
        }

        document.body.classList.add(this.bodyClass);

        // ⏱️ Add countdown timer
        this.timerEl = document.createElement('div');
        this.timerEl.id = 'glitch-timer';
        this.timerEl.textContent = '15.00';
        document.body.appendChild(this.timerEl);

        const startTime = performance.now();
        const duration = 15000; // 15 seconds
        const update = () => {
            const now = performance.now();
            const remaining = Math.max(0, duration - (now - startTime));
            const secs = (remaining / 1000).toFixed(2);
            if (this.timerEl) this.timerEl.textContent = secs;
            if (remaining > 0) this.timerRAF = requestAnimationFrame(update);
        };
        this.timerRAF = requestAnimationFrame(update);
    },

    step() {
        // random glyph replacements on all visible text
        (function walk(n) {
            if (n.classList?.contains('glitch-exempt')) return;
            n.childNodes.forEach(c => {
                if (c.nodeType === 3 && c.textContent.trim() &&
                    !c.parentNode.closest('.glitch-exempt')) {
                    c.textContent = c.textContent.replace(/./g,
                        () => GLYPHS[Math.random() * GLYPHS.length | 0]);
                } else if (c.nodeType === 1 &&
                           !/^(SCRIPT|STYLE)$/i.test(c.nodeName)) walk(c);
            });
        })(document.body);
        document.documentElement.style.animation = 'hue 5s linear infinite';
    },

    cleanup() {
        document.body.classList.remove(this.bodyClass);
        if (this.timerEl) this.timerEl.remove();
        cancelAnimationFrame(this.timerRAF);
    }
},

/* 1 — NEON FLICKER + BRIGHT MATRIX RAIN + GLOBAL MELT TEXT + IMAGE FALL */
{
    name: 'NeonMatrix', styleId: 'neon-style', bodyClass: 'neon',
    canvas: null, ctx: null, drops: [], anim: 0, font: 20,
    imgTimer: 0,                                         // ⬅ spawn loop handle
    start() {
        /* ───── CSS (added fallImg + tweaks) ───── */
        if (!document.getElementById(this.styleId)) {
            const css = `
              @keyframes flick {
                0%,19%,21%,23%,25%,54%,56%,100% { opacity: 1; }
                20%,22%,24%,55% { opacity: .4; }
              }
              @keyframes meltFall {
                0% { transform: translateY(0);   opacity: 1; }
                100%{ transform: translateY(120px) rotate(10deg); opacity: 0; }
              }
              @keyframes fallImg {
                0%   { transform: translateY(0)  rotate(0deg);  opacity: .9; }
                100% { transform: translateY(calc(100vh + 200px)) rotate(360deg); opacity: .3; }
              }
              body.neon .melt-char {
                display: inline-block;
                animation: meltFall 2s forwards;
              }
              body.neon .matrix-fall-img {
                position: fixed;
                top: -150px;
                pointer-events: none;
                z-index: 2147483644;
                mix-blend-mode: screen;
                filter: drop-shadow(0 0 6px #0f0) saturate(2);
                animation: fallImg 6s linear forwards;
              }
              body.neon *:not(script):not(style):not(canvas){
                animation: flick 3s infinite alternate;
                color:#0ff!important;
              }`;
            Object.assign(document.head.appendChild(document.createElement('style')),
                { id: this.styleId, textContent: css });
        }
        document.body.classList.add(this.bodyClass);

        /* ───── Melt ALL text ───── */
        const meltAllText = node => {
            if (!node || node.nodeType !== 1 || node.classList?.contains('glitch-exempt')) return;
            if (/^(SCRIPT|STYLE|CANVAS)$/i.test(node.nodeName)) return;
            const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
                acceptNode: t => t.textContent.trim() &&
                                 !t.parentNode.closest('.glitch-exempt')
                                 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
            });
            const texts = [];
            while (walker.nextNode()) texts.push(walker.currentNode);
            for (const t of texts) {
                const frag = document.createDocumentFragment();
                for (const ch of t.textContent) {
                    const span = document.createElement('span');
                    span.textContent = ch;
                    span.className   = 'melt-char';
                    span.style.animationDelay    = `${Math.random()*2}s`;
                    span.style.animationDuration = `${1.5 + Math.random()}s`;
                    frag.appendChild(span);
                }
                t.parentNode.replaceChild(frag, t);
            }
        };
        meltAllText(document.body);

        /* ───── Matrix rain canvas ───── */
        this.canvas = document.createElement('canvas');
        Object.assign(this.canvas.style,{
            position:'fixed',inset:0,zIndex:2147483645,
            pointerEvents:'none',mixBlendMode:'screen'
        });
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', this.resize.bind(this));
        this.loop();

        /* ─────  Hack-image drizzle  ───── */
        const IMG_URLS = [
          'https://elm.umaryland.edu/elm-stories/2023/Hacked.jpg',
          'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1097860/header.jpg?t=1666991890',
          'https://thumbs.dreamstime.com/b/abstract-background-glitch-vector-effect-distortion-glitched-colored-random-pixels-screen-television-distorted-video-no-215360804.jpg',
          'https://cbx-prod.b-cdn.net/COLOURBOX63752236.jpg?width=800&height=800&quality=70',
          'https://ucnv.github.io/pnglitch/files/png-glitch-paeth.png'
        ];
        const spawnImg = () => {
            const url = IMG_URLS[Math.random()*IMG_URLS.length|0];
            const img = document.createElement('img');
            img.src = url;
            img.className = 'matrix-fall-img';
            const size = 60 + Math.random()*120;
            Object.assign(img.style,{
                left: `${Math.random()*100}vw`,
                width:`${size}px`,
                animationDuration:`${4 + Math.random()*4}s`,
                animationDelay:`${Math.random()}s`,
                transform:`translateY(0) rotate(${Math.random()*30-15}deg)`
            });
            document.body.appendChild(img);
            img.addEventListener('animationend', () => img.remove());
        };
        this.imgTimer = setInterval(spawnImg, 450);  // one image ~ every 0.45 s
    },

    /* ───── Canvas helpers ───── */
    resize() {
        if (!this.canvas) return;
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        this.cols = Math.floor(this.canvas.width / this.font);
        this.drops = Array(this.cols).fill(1);
    },
    loop() {
        const { ctx, canvas, font, cols, drops } = this;
        ctx.fillStyle = 'rgba(0,0,0,0.08)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#0F0';
        ctx.font = font + 'px monospace';
        ctx.shadowColor = '#0F0';
        ctx.shadowBlur = 8;
        for (let i=0;i<cols;i++){
            const ch = GLYPHS[Math.random()*GLYPHS.length|0];
            ctx.fillText(ch, i*font, drops[i]*font);
            if (drops[i]*font>canvas.height && Math.random()>0.965) drops[i]=0;
            drops[i]++;
        }
        ctx.shadowBlur = 0;
        this.anim = requestAnimationFrame(this.loop.bind(this));
    },
    step() {
        document.body.style.transform =
            `translate(${Math.random()*6-3}px,${Math.random()*6-3}px)`;
    },
    cleanup() {
        cancelAnimationFrame(this.anim);
        clearInterval(this.imgTimer);
        document.querySelectorAll('.matrix-fall-img').forEach(el=>el.remove());
        this.canvas?.remove();
        window.removeEventListener('resize', this.resize);
        document.body.classList.remove(this.bodyClass);
    }
},



        /* 2 — SCANLINE INVERT  +  TEXT-CORRUPT  +  “MELT-STAY” TRANSITION */
{
    name: 'Scan', styleId: 'scan-style', bodyClass: 'scan',
    start() {
        /* ── inject CSS once ── */
        if (!document.getElementById(this.styleId)) {
            const css = `
              /* existing green scan-line + invert / flicker */
              body.scan{
                  filter:invert(1) grayscale(.7);
                  animation:f .5s infinite;
              }
              @keyframes f{
                  0%,100%{filter:invert(1) grayscale(.7)}
                  50%     {filter:invert(.8) grayscale(.9)}
              }
              body.scan::before{
                  content:'';
                  position:fixed;inset:0;pointer-events:none;
                  background:repeating-linear-gradient(
                        0deg,rgba(0,255,0,.05)0,
                              rgba(0,255,0,.1)1px,
                              rgba(0,255,0,.05)2px);
                  mix-blend-mode:overlay;
                  animation:s .3s linear infinite;
                  z-index:2147483646;
              }
              @keyframes s{0%{background-position:0 0}100%{background-position:0 4px}}

              /* NEW “melt-stay” keyframes */
              @keyframes meltStay{
                  0%   {transform:translateY(0)  rotate(0deg);}
                  70%  {transform:translateY(120px) rotate(8deg);}
                  100% {transform:translateY(120px) rotate(8deg);}
              }
              body.scan .melt2-char{
                  display:inline-block;
                  animation:meltStay 2.4s cubic-bezier(.25,.6,.4,1) forwards;
              }`;
            Object.assign(document.head.appendChild(document.createElement('style')),
               { id: this.styleId, textContent: css });
        }
        document.body.classList.add(this.bodyClass);

        /* ── one-time wrap of ALL visible text nodes ── */
        const wrapAllText = node => {
            if (!node || node.nodeType !== 1 || node.classList?.contains('glitch-exempt')) return;
            if (/^(SCRIPT|STYLE|CANVAS)$/i.test(node.nodeName)) return;

            const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
                acceptNode: t => t.textContent.trim() &&
                                 !t.parentNode.closest('.glitch-exempt')
                                 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
            });

            const texts = [];
            while (walker.nextNode()) texts.push(walker.currentNode);

            for (const t of texts) {
                const frag = document.createDocumentFragment();
                for (const ch of t.textContent) {
                    const span = document.createElement('span');
                    span.textContent = ch;
                    span.className   = 'melt2-char';
                    span.style.animationDelay = `${Math.random()*1.2}s`;
                    span.style.animationDuration = `${1.8 + Math.random()}s`;
                    frag.appendChild(span);
                }
                t.parentNode.replaceChild(frag, t);
            }
        };
        wrapAllText(document.body);
    },

    /* every tick: keep corrupting characters + slight jitter           */
    step() {
        const harsh = '█▓▒░<>/\\\\|@#$%&*' + GLYPHS;
        (function corrupt(n) {
            n.childNodes.forEach(c => {
                if (c.nodeType === 3 && c.textContent.trim() &&
                    !c.parentNode.closest('.glitch-exempt')){
                    c.textContent = c.textContent.replace(/./g,
                        () => harsh[Math.random()*harsh.length|0]);
                } else if (c.nodeType === 1 &&
                           !/^(SCRIPT|STYLE)$/i.test(c.nodeName)) corrupt(c);
            });
        })(document.body);

        document.body.style.transform =
            `translate(${Math.random()*10-5}px,${Math.random()*10-5}px)`;
    },

    cleanup() { document.body.classList.remove(this.bodyClass); }
},

/* 5 — RGB SLIT-SCAN & GLITCH SCANLINES + Grayscale Fade-in Transition */
{
    id: 3,
    name: 'RGBGlitchScan',
    styleId: 'rgb-glitch-style',
    bodyClass: 'rgb-glitch',
    interval: null,
    overlay: null,  // grayscale overlay div

    start() {
        if (!document.getElementById(this.styleId)) {
            const css = `
              body.rgb-glitch {
                position: relative;
                overflow: hidden;
              }
              body.rgb-glitch::before,
              body.rgb-glitch::after {
                content: '';
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                pointer-events: none;
                mix-blend-mode: screen;
                z-index: 2147483646;
                background: linear-gradient(90deg,
                  rgba(255,0,0,0.3) 0%, rgba(255,0,0,0) 33%,
                  rgba(0,255,0,0.3) 34%, rgba(0,255,0,0) 66%,
                  rgba(0,0,255,0.3) 67%, rgba(0,0,255,0) 100%);
                background-size: 300% 100%;
                animation: rgbSlide 4s linear infinite;
                clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
              }
              body.rgb-glitch::after {
                animation-delay: 2s;
                clip-path: polygon(0 66%, 100% 66%, 100% 100%, 0 100%);
              }
              @keyframes rgbSlide {
                0%   { background-position: 0 0; }
                100% { background-position: 100% 0; }
              }
              body.rgb-glitch .glitch-text {
                position: relative;
                color: white;
                font-weight: bold;
                text-shadow:
                  2px 0 red,
                  -2px 0 cyan,
                  0 2px lime;
                animation: glitchShift 0.3s infinite alternate;
              }
              @keyframes glitchShift {
                0% { text-shadow: 2px 0 red, -2px 0 cyan, 0 2px lime; }
                100% { text-shadow: -2px 0 red, 2px 0 cyan, 0 -2px lime; }
              }

              /* Grayscale overlay styles for fade-in */
              .rgb-glitch-grayscale-overlay {
                position: fixed;
                inset: 0;
                pointer-events: none;
                background: transparent;
                filter: grayscale(1);
                transition: filter 5s ease;
                z-index: 2147483647;
              }
            `;
            Object.assign(document.head.appendChild(document.createElement('style')), {
                id: this.styleId,
                textContent: css
            });
        }

        document.body.classList.add(this.bodyClass);

        // Wrap text nodes in glitch-text spans
        const wrapGlitchText = node => {
            if (!node || node.nodeType !== 1 || node.classList?.contains('glitch-exempt')) return;
            if (/^(SCRIPT|STYLE|CANVAS)$/i.test(node.nodeName)) return;

            const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
                acceptNode: t => t.textContent.trim() && !t.parentNode.closest('.glitch-exempt')
                    ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
            });
            const texts = [];
            while (walker.nextNode()) texts.push(walker.currentNode);
            for (const t of texts) {
                if (t.parentNode.classList?.contains('glitch-text')) continue;
                const span = document.createElement('span');
                span.className = 'glitch-text';
                span.textContent = t.textContent;
                t.parentNode.replaceChild(span, t);
            }
        };
        wrapGlitchText(document.body);

        // Add grayscale overlay div
        this.overlay = document.createElement('div');
        this.overlay.className = 'rgb-glitch-grayscale-overlay';
        document.body.appendChild(this.overlay);

        // Trigger fade-in transition: grayscale(1) -> grayscale(0)
        requestAnimationFrame(() => {
            if (this.overlay) this.overlay.style.filter = 'grayscale(0)';
        });

        // Jitter body transform every 200 ms for glitch effect
        this.interval = setInterval(() => {
            const x = (Math.random() - 0.5) * 4;
            const y = (Math.random() - 0.5) * 4;
            document.body.style.transform = `translate(${x}px,${y}px)`;
        }, 200);
    },

    step() {},

    cleanup() {
        clearInterval(this.interval);
        document.body.style.transform = '';
        document.body.classList.remove(this.bodyClass);

        // Remove grayscale overlay
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }

        // Unwrap glitch-text spans
        const spans = document.querySelectorAll('span.glitch-text');
        spans.forEach(span => {
            const parent = span.parentNode;
            parent.replaceChild(document.createTextNode(span.textContent), span);
            parent.normalize();
        });
    }
},


    ];

    /* ───────── ENGINE ───────── */
    function cleanCurrent() { payloads[idx].cleanup?.(); document.title = ORIG_TITLE; }

    function stop() {
        clearInterval(ticker);   ticker  = null;
        clearInterval(tweener);  tweener = null;
        cleanCurrent(); overlay?.remove(); overlay = null; idx = 0;
    }

    function start() {
        if (ticker) return alert('Glitch already running – stop first.');
        showOverlay(); chaosBurst(); payloads[0].start();
        tweener = setInterval(tweenChaos, TWEEN_PERIOD);

        let steps = 0;
        ticker = setInterval(() => {
            payloads[idx].step?.();
            if (++steps >= STEPS_PER_PLD) {
                cleanCurrent();
                idx = (idx + 1) % payloads.length;
                chaosBurst();
                payloads[idx].start();
                steps = 0;
            }
        }, BASE_STEP);
    }

    /* ───────── MENU & EXPORT ───────── */
    GM_registerMenuCommand('Start Glitchmageddon 9000', start);
    GM_registerMenuCommand('Stop  Glitchmageddon 9000', stop);
    window.stopGlitch = stop;

    console.log('%cGlitchmageddon 9000 loaded – use the menu to unleash chaos!',
        'background:#000;color:#0af;padding:3px;font-weight:bold');
})();
