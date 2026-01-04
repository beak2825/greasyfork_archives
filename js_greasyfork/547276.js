// ==UserScript==
// @name         [LEGACY] Fancy Custom Cursor
// @namespace    https://guest4242.neocities.org/pre/
// @version      2025.11.21.1
// @description  cool, eh? NOTE: THIS IS A LEGACY VERSION. I KNOW I DIDNT MAKE A NEW VERSION BUT ILL DO IT SOON. FROM NOW ON, THIS LEGACY VERSION IS NO LONGER MAINTAINED.
// @author       Guest4242
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-end
// @connect      *
// @license      MIT
// @exclude     https://guest4242.neocities.org/pre/
// @downloadURL https://update.greasyfork.org/scripts/547276/%5BLEGACY%5D%20Fancy%20Custom%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/547276/%5BLEGACY%5D%20Fancy%20Custom%20Cursor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---- Config stuff...I guess? ----
    const FA_CSS = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css";
    const CLICK_DOWN_URL = "https://raw.githubusercontent.com/Guest4242s-Website-Stuff/sounds/main/ClickDown.ogg";
    const CLICK_UP_URL   = "https://raw.githubusercontent.com/Guest4242s-Website-Stuff/sounds/main/ClickUp.ogg";
    const ZINDEX = 999999;
    const lerp = (a, b, n) => (1 - n) * a + n * b;
    const isTextEditable = el => {
        if (!el) return false;
        const t = el.tagName;
        if (!t) return false;
        if (t === 'INPUT' || t === 'TEXTAREA' || el.isContentEditable) return true;
        const role = el.getAttribute && el.getAttribute('role');
        if (role === 'textbox') return true;
        return false;
    };
    const globalCSS = `
        /* global hide native cursor on all elements and pseudo-elements */
        * , *::before, *::after {
            cursor: none !important;
        }
        /* custom cursor element styling */
        .tm-fancy-cursor {
            position: fixed;
            left: 0;
            top: 0;
            pointer-events: none; /* so it never blocks interactions */
            user-select: none;
            font-size: 24px;
            line-height: 1;
            /* IMPORTANT: no transform transition, we animate per-frame */
            transition: color 0.12s ease, text-shadow 0.12s ease;
            will-change: transform;
            z-index: ${ZINDEX} !important;
            -webkit-text-stroke: 1px black;
            text-stroke: 1px black;
            text-shadow: 0 0 4px rgba(0,0,0,0.4);
            display: inline-block;
        }
        .tm-fallback-glyph {
            font-family: system-ui, "Segoe UI Symbol", "Noto Color Emoji", sans-serif;
        }
    `;

    try {
        GM_addStyle(globalCSS);
    } catch (e) {
        const s = document.createElement('style');
        s.textContent = globalCSS;
        document.head.appendChild(s);
    }
    const c = document.createElement('i');
    c.className = 'tm-fancy-cursor tm-fallback-glyph';
    c.textContent = '\u25B6'; // fallback glyph thingy just in case
    c.style.color = 'white';
    c.style.pointerEvents = 'none';
    document.body.appendChild(c);
    function tryLoadFontAwesome() {
        return new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = FA_CSS;
            link.crossOrigin = 'anonymous';
            link.onload = () => resolve(true);
            link.onerror = () => resolve(false);
            document.head.appendChild(link);
            setTimeout(() => resolve(false), 2500);
        });
    }

    function makeAudio(src) {
        try {
            const a = new Audio(src);
            a.preload = 'auto';
            a.crossOrigin = 'anonymous';
            return a;
        } catch (e) {
            return null;
        }
    }

    const clickDownSound = makeAudio(CLICK_DOWN_URL);
    const clickUpSound = makeAudio(CLICK_UP_URL);

    // ---- State ----
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let currentX = mouseX, currentY = mouseY;
    let scale = 1;
    let targetScale = 1;
    const SCALE_LERP = 0.22;
    let isDragging = false;
    let FA_AVAILABLE = false;
    function setFaIcon(iconShortName) {
        if (FA_AVAILABLE) {
            c.className = `fa-solid ${iconShortName} tm-fancy-cursor`;
            c.textContent = '';
        } else {
            c.className = 'tm-fancy-cursor tm-fallback-glyph';
            if (iconShortName === 'fa-i') c.textContent = '\u2014';
            else if (iconShortName === 'fa-hand-point-up') c.textContent = '\u261A';
            else if (iconShortName === 'fa-hand-back-fist') c.textContent = '\u270A';
            else c.textContent = '\u25B6';
        }
    }

    function setIconForElement(el) {
        if (!el) return;
        if (isDragging) {
            setFaIcon('fa-hand-back-fist');
            return;
        }
        if (isTextEditable(el) || el.tagName === "P" || el.tagName === "SPAN" || el.tagName === "H1" || el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "H2" || el.tagName === "H3" || el.tagName === "H4" || el.tagName === "H5" || el.tagName === "H6") {
            setFaIcon('fa-i');
            return;
        }
        let check = el;
        while (check) {
            const tag = check.tagName || '';
            if (tag === 'BUTTON' || tag === 'A' || (check.classList && check.classList.contains('btn'))) {
                setFaIcon('fa-hand-point-up');
                return;
            }
            check = check.parentElement;
        }
        setFaIcon('fa-arrow-pointer');
    }
    function animateCursor() {
        currentX = lerp(currentX, mouseX, 0.22);
        currentY = lerp(currentY, mouseY, 0.22);
        scale = lerp(scale, targetScale, SCALE_LERP);
        c.style.transform = `translate3d(${Math.round(currentX)}px, ${Math.round(currentY)}px, 0) translate(-50%, -50%) scale(${scale})`;
        requestAnimationFrame(animateCursor);
    }
    function onPointerMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        const el = document.elementFromPoint(mouseX, mouseY);
        setIconForElement(el);
    }

    function onPointerDown(e) {
        targetScale = 0.84;
        c.style.color = '#ddd';
        c.style.textShadow = '0 0 6px rgba(255,255,255,0.8)';
        if (clickDownSound) {
            try { clickDownSound.currentTime = 0; clickDownSound.play().catch(()=>{}); } catch(e) {}
        }
    }

    function onPointerUp(e) {
        targetScale = 1.25;
        c.style.color = 'white';
        c.style.textShadow = '0 0 4px rgba(0,0,0,0.4)';
        if (clickUpSound) {
            try { clickUpSound.currentTime = 0; clickUpSound.play().catch(()=>{}); } catch(e) {}
        }
        setTimeout(() => { targetScale = 1; }, 140);
    }

    function onDragStart() {
        isDragging = true;
        setFaIcon('fa-hand-back-fist');
    }
    function onDragEnd() {
        isDragging = false;
    }
    (async function init() {
        if (!document.body) return;

        // ensure that the native cursor hidden
        try { document.documentElement.style.cursor = 'none'; } catch (e) {}
        FA_AVAILABLE = await tryLoadFontAwesome();
        if (FA_AVAILABLE) setFaIcon('fa-arrow-pointer');
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerdown', onPointerDown, { passive: true });
        window.addEventListener('pointerup', onPointerUp, { passive: true });
        window.addEventListener('dragstart', onDragStart, { passive: true });
        window.addEventListener('dragend', onDragEnd, { passive: true });
        document.addEventListener('focusin', () => {});
        document.addEventListener('focusout', () => {});

        requestAnimationFrame(animateCursor);
    })();

})();