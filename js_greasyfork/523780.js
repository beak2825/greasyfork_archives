// ==UserScript==
// @name        AutoExit[3.0]
// @namespace   Violentmonkey Scripts
// @match       *://cavegame.io/*
// @grant       none
// @version     3.0
// @author      Drik
// @description This script will help you collect doors, save loot, and more (F4 KEY)
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/523780/AutoExit%5B30%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/523780/AutoExit%5B30%5D.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const exit = '.exit-button.exit-button-top.no-select';
    const play = 'button.play-btn#play-cavegame-io';
    const disconnect = '#menu-disconnect';
    const pTimeout = 0x1385;
    const dTimeout = 0x3e8;

    function isVis(el) {
        if (!el) return false;
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity || '1') <= 0.05) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
    }

    function inView(el) {
        if (!isVis(el)) return false;
        const r = el.getBoundingClientRect();
        const v = (r.bottom > 0 && r.top < (innerHeight || document.documentElement.clientHeight)) && (r.right > 0 && r.left < (innerWidth || document.documentElement.clientWidth));
        const o = parseFloat(getComputedStyle(el).opacity || '1');
        return v && o > 0.12;
    }

    function waitStable(el, frames = 0x2, maxMs = 0x1f3) {
        return new Promise(r => {
            let c = 0;
            const st = performance.now();

            function s() {
                if (!el || !document.contains(el)) return r(false);
                if (inView(el)) c++;
                else c = 0;
                if (c >= frames) return r(true);
                if (performance.now() - st > maxMs) return r(false);
                requestAnimationFrame(s);
            }
            requestAnimationFrame(s);
        });
    }

    function fExit() {
        const el = document.querySelector(exit);
        if (el) return el;
        return null;
    }

    function cExit(el, act) {
        if (!el) return false;
        try {
            try {
                el.dataset.ae = String(act);
            } catch (e) {}
            if (typeof el.click === 'function') {
                try {
                    el.click();
                } catch (e) {}
            }
            try {
                const o = {
                    bubbles: true,
                    cancelable: true,
                    composed: true
                };
                el.dispatchEvent(new MouseEvent('click', o));
            } catch (e) {}
            return true;
        } catch (err) {
            return false;
        }
    }

    let lastPlayAct = null;

    function cPlay(el, act) {
        if (!el) return false;
        if (lastPlayAct === act) return false;
        try {
            const o = {
                bubbles: true,
                cancelable: true,
                composed: true
            };
            el.dispatchEvent(new MouseEvent('click', o));
            lastPlayAct = act;
            return true;
        } catch (err) {
            return false;
        }
    }

    let lastDiscAct = null;

    function cDisc(el, act) {
        if (!el) return false;
        if (lastDiscAct === act) return false;
        try {
            const o = {
                bubbles: true,
                cancelable: true,
                composed: true
            };
            if (typeof el.click === 'function') {
                try {
                    el.click();
                } catch (e) {}
            }
            el.dispatchEvent(new MouseEvent('click', o));
            lastDiscAct = act;
            return true;
        } catch (err) {
            return false;
        }
    }

    function fPlay() {
        return document.querySelector(play) || null;
    }

    function fDisc() {
        return document.querySelector(disconnect) || null;
    }

    async function runAct(act) {
        const eEl = fExit();
        if (eEl) {
            cExit(eEl, act);
        }
        await new Promise(r => requestAnimationFrame(r));


        const dElNow = fDisc();
        if (dElNow && isVis(dElNow)) {
            cDisc(dElNow, act);
        } else {
            const root = document.documentElement || document.body;
            let dDone = false;
            const dMo = new MutationObserver(() => {
                if (dDone) return;
                const el = fDisc();
                if (!el || !isVis(el)) return;
                (async () => {
                    if (dDone) return;
                    const ok = await waitStable(el, 0x2, 0x190);
                    if (ok) {
                        if (dDone) return;
                        dDone = true;
                        try {
                            dMo.disconnect();
                        } catch (e) {}
                        cDisc(el, act);
                    }
                })().catch(() => {});
            });
            dMo.observe(root, {
                childList: true,
                subtree: true,
                attributes: true
            });
            setTimeout(() => {
                if (!dDone) {
                    try {
                        dMo.disconnect();
                    } catch (e) {}
                }
            }, dTimeout);
        }
        const pEl = fPlay();
        let handled = false;
        if (pEl && inView(pEl)) {
            const ok = await waitStable(pEl, 0x2, 0x18f);
            if (ok) {
                handled = true;
                cPlay(pEl, act);
            }
            return;
        }
        const root2 = document.documentElement || document.body;
        let done = false;
        const mo = new MutationObserver(m => {
            if (done || handled) return;
            const el = fPlay();
            if (!el || !isVis(el)) return;
            (async () => {
                if (done || handled) return;
                const ok = await waitStable(el, 0x2, 0x320);
                if (ok) {
                    if (done || handled) return;
                    handled = true;
                    done = true;
                    try {
                        mo.disconnect();
                    } catch (e) {}
                    cPlay(el, act);
                }
            })().catch(() => {});
        });
        mo.observe(root2, {
            childList: true,
            subtree: true,
            attributes: true
        });
        setTimeout(() => {
            if (!done && !handled) {
                try {
                    mo.disconnect();
                } catch (e) {}
            }
        }, pTimeout);
    }

    document.addEventListener('keydown', e => {
        if (e.code !== 'F4') return;
        if (e.repeat) return;
        try {
            e.preventDefault();
        } catch (err) {}
        const act = Date.now();
        runAct(act).catch(() => {});
    }, {
        capture: true
    });
})();