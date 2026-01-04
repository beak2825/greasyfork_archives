// ==UserScript==
// @name         Quizlet MCQ Explanation Blur  (tap + “;”, “:”, or Alt +D toggle)
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Blurs everything after the first “(”. Tap/click toggles ONE span and swallows the event.  “;”, “:” or Alt +D toggles ALL in one keystroke; never selects an answer, never scrolls.
// @match        *://*.quizlet.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541570/Quizlet%20MCQ%20Explanation%20Blur%20%20%28tap%20%2B%20%E2%80%9C%3B%E2%80%9D%2C%20%E2%80%9C%3A%E2%80%9D%2C%20or%20Alt%20%2BD%20toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541570/Quizlet%20MCQ%20Explanation%20Blur%20%20%28tap%20%2B%20%E2%80%9C%3B%E2%80%9D%2C%20%E2%80%9C%3A%E2%80%9D%2C%20or%20Alt%20%2BD%20toggle%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /* ───── selectors & flags ───── */
    const OPTION_SEL = ['option-1','option-2','option-3','option-4']
        .map(id => `[data-testid="${id}"]`).join(',');
    const BLUR = 'qz-blur';
    const FLAG = 'data-qz-unblurred';

    /* ───── style ───── */
    document.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('qz-blur-style')) {
            const s = document.createElement('style');
            s.id = 'qz-blur-style';
            s.textContent = `
                .${BLUR}{
                    filter:blur(4px)!important;
                    user-select:none!important;
                    cursor:pointer;
                    transition:filter .12s;
                }`;
            document.head.appendChild(s);
        }
    }, { once:true });

    /* ───── blur insertion ───── */
    const blurAfterFirstParen = el => {
        if (el.dataset.processed) return;
        el.dataset.processed = '1';

        for (const n of Array.from(el.childNodes)) {
            if (n.nodeType === 3 && n.textContent.includes('(')) {
                const txt = n.textContent;
                const i   = txt.indexOf('(');
                const frag = document.createDocumentFragment();
                if (i) frag.appendChild(document.createTextNode(txt.slice(0, i)));

                const span = document.createElement('span');
                span.textContent = txt.slice(i);
                span.classList.add(BLUR);
                frag.appendChild(span);
                el.replaceChild(frag, n);
            } else if (n.nodeType === 1) {
                blurAfterFirstParen(n);
            }
        }
    };

    const addBlurs = () =>
        document.querySelectorAll(OPTION_SEL).forEach(blurAfterFirstParen);

    new MutationObserver(addBlurs)
        .observe(document, { childList:true, subtree:true });

    /* ───── helpers ───── */
    const isBlurSpan = el =>
        el && (el.classList?.contains(BLUR) || el.hasAttribute(FLAG));

    const toggleSpanState = span => {
        if (span.classList.contains(BLUR)) {
            span.classList.remove(BLUR);
            span.setAttribute(FLAG,'1');
        } else {
            span.classList.add(BLUR);
            span.removeAttribute(FLAG);
        }
    };

    /* ───── per-span toggle & full event-swallow ───── */
    const swallow = e => {
        if (!isBlurSpan(e.target)) return;
        e.preventDefault();
        e.stopImmediatePropagation();
    };

    // Capture early enough to pre-empt Quizlet’s own handlers.
    ['pointerdown','pointerup','click','touchstart','touchend','mousedown','mouseup'].forEach(evt =>
        document.addEventListener(evt, e => {
            if (!isBlurSpan(e.target)) return;
            swallow(e);
            if (evt === 'pointerup' || evt === 'touchend' || evt === 'mouseup') toggleSpanState(e.target);
        }, true)
    );

    /* ───── global toggle keys ───── */
    const isToggleKey = e => {
        const semicolon = (e.code === 'Semicolon') && !e.ctrlKey && !e.metaKey && !e.altKey;
        const altD      = (e.code === 'KeyD')      &&  e.altKey   && !e.ctrlKey && !e.metaKey;
        return semicolon || altD;
    };

    const cancel = e => {
        if (!isToggleKey(e)) return false;
        e.preventDefault();
        e.stopImmediatePropagation();
        return true;
    };

    const toggleAll = () => {
        const spans = Array.from(document.querySelectorAll(`.${BLUR}, [${FLAG}]`));
        const anyBlurred = spans.some(s => s.classList.contains(BLUR));
        const wantBlur   = !anyBlurred;

        spans.forEach(s => {
            if (wantBlur) { s.classList.add(BLUR);    s.removeAttribute(FLAG); }
            else          { s.classList.remove(BLUR); s.setAttribute(FLAG,'1'); }
        });
    };

    window.addEventListener('keydown', e => {
        if (cancel(e) && !e.repeat) toggleAll();
    }, true);

    window.addEventListener('keypress', cancel, true);
    window.addEventListener('keyup',    cancel, true);
})();


(() => {
    const id = 'a1bncmms-fix';
    if (!document.getElementById(id)) {
        const s = document.createElement('style');
        s.id = id;
        s.textContent = `.a1bncmms{margin-bottom:0!important;}`;
        document.head.appendChild(s);
    }
})();
