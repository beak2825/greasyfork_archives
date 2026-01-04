// ==UserScript==
// @name         Smooth Scroll
// @description  Configurable smooth scroll with optional motion blur. Uses requestAnimationFrame (like V-Sync).
// @author       DARK1E
// @icon         https://i.imgur.com/IAwk6NN.png
// @include      *
// @version      3.3
// @namespace    sttb-dxrk1e
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/501620/Smooth%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/501620/Smooth%20Scroll.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const cfg = {
        smth: 0.85,
        stpMult: 1,
        accDelFct: 0.2,
        accMaxMult: 3,
        thrsh: 1,
        lnHt: 20,
        mBlur: false,
        mBlurInt: 0.3,
        dbg: false,
    };

    const stMap = new WeakMap();
    const DAMP_FCT = 1 - cfg.smth;
    const ACC_TMO = 150;
    const MAX_BLUR = 5;
    const BLUR_THRESH = 0.2;

    function _animStep(el) {
        const st = stMap.get(el);
        if (!st) return;

        const curScrTop = _getScrTop(el);
        const delta = st.tgtY - st.curY;

        if (Math.abs(delta) < cfg.thrsh && Math.abs(curScrTop - st.tgtY) < cfg.thrsh) {
            if (cfg.dbg) console.log("SS: Anim end", el);
            if (Math.abs(curScrTop - st.tgtY) > 0.1) {
                 _setScrTop(el, Math.round(st.tgtY));
            }
            _cancelAnim(el);
            return;
        }

        const step = delta * DAMP_FCT;
        st.curY += step;

        const scrAmt = Math.round(st.curY) - curScrTop;

        if (scrAmt !== 0) {
            const origBehav = _setBehav(el, 'auto');
            _setScrTop(el, curScrTop + scrAmt);
        }

        if (cfg.mBlur) {
            const blurPx = Math.min(MAX_BLUR, Math.abs(step) * cfg.mBlurInt);
            if (blurPx > BLUR_THRESH) {
                _setFilter(el, `blur(${blurPx.toFixed(1)}px)`);
            } else {
                _setFilter(el, 'none');
            }
        }

        st.animId = requestAnimationFrame(() => _animStep(el));
    }

    function _startOrUpd(el, dY) {
        let st = stMap.get(el);
        const now = performance.now();

        if (!st) {
            st = {
                tgtY: _getScrTop(el),
                curY: _getScrTop(el),
                animId: null,
                ts: 0,
                mult: 1,
            };
            stMap.set(el, st);
        }

        const dt = now - st.ts;
        if (dt < ACC_TMO) {
            const accInc = Math.abs(dY) * cfg.accDelFct / cfg.lnHt;
            st.mult = Math.min(cfg.accMaxMult, st.mult + accInc);
        } else {
            st.mult = 1;
        }
        st.ts = now;

        const effDel = dY * st.mult * cfg.stpMult;
        st.tgtY += effDel;
        st.tgtY = _clampTgt(el, st.tgtY);

        if (cfg.dbg) {
            console.log(`SS: Upd Tgt`, el, `| dY: ${dY.toFixed(2)}`, `| mult: ${st.mult.toFixed(2)}`, `| effDel: ${effDel.toFixed(2)}`, `| tgtY: ${st.tgtY.toFixed(2)}`);
        }

        if (!st.animId) {
            st.curY = _getScrTop(el);
            if (cfg.dbg) console.log("SS: Start anim", el);
            st.animId = requestAnimationFrame(() => _animStep(el));
        }
    }

    function _cancelAnim(el) {
        const st = stMap.get(el);
        if (st?.animId) {
            cancelAnimationFrame(st.animId);
            stMap.delete(el);
             if (cfg.dbg) console.log("SS: Anim cancelled", el);
        }
        if (cfg.mBlur) {
             _setFilter(el, 'none');
        }
    }

    function _getScrTop(el) {
        return (el === window) ? (window.scrollY || document.documentElement.scrollTop) : /** @type {Element} */ (el).scrollTop;
    }

    function _setScrTop(el, val) {
        if (el === window) {
            document.documentElement.scrollTop = val;
        } else {
            /** @type {Element} */ (el).scrollTop = val;
        }
    }

    function _setBehav(el, behav) {
        const target = (el === window) ? document.documentElement : el;
        if (target instanceof Element) {
            const orig = target.style.scrollBehavior;
            target.style.scrollBehavior = behav;
            return orig;
        }
        return undefined;
    }

    function _setFilter(el, val) {
         const target = (el === window) ? document.documentElement : el;
         if (target instanceof HTMLElement) {
             try {
                target.style.filter = val;
             } catch (e) {
                 if (cfg.dbg) console.warn("SS: Failed to set filter on", target, e);
             }
         }
    }

    function _clampTgt(el, tgtY) {
        let maxScr;
        if (el === window) {
            maxScr = document.documentElement.scrollHeight - window.innerHeight;
        } else {
            const htmlEl = /** @type {Element} */ (el);
            maxScr = htmlEl.scrollHeight - htmlEl.clientHeight;
        }
        return Math.max(0, Math.min(tgtY, maxScr));
    }

    function _isScr(el) {
        if (!el || !(el instanceof Element) || el === document.documentElement || el === document.body) {
            return false;
        }
        try {
            const style = window.getComputedStyle(el);
            const ovf = style.overflowY;
            const isOvf = ovf === 'scroll' || ovf === 'auto';
            const canScr = el.scrollHeight > el.clientHeight + 1;
            return isOvf && canScr;
        } catch (e) {
            if (cfg.dbg) console.warn("SS: Err check scroll", el, e);
            return false;
        }
    }

    function _getTgt(e) {
        const path = e.composedPath ? e.composedPath() : [];

        for (const el of path) {
            if (!(el instanceof Element)) continue;

            if (_isScr(el)) {
                const curScr = _getScrTop(el);
                const maxScr = el.scrollHeight - el.clientHeight;
                if ((e.deltaY < 0 && curScr > 0.1) || (e.deltaY > 0 && curScr < maxScr - 0.1)) {
                     if (cfg.dbg) console.log("SS: Found el in path:", el);
                    return el;
                }
            }
             if (el === document.body || el === document.documentElement) {
                break;
            }
        }

        const docEl = document.documentElement;
        const maxPgScr = docEl.scrollHeight - window.innerHeight;
        const curPgScr = _getScrTop(window);

        if ((e.deltaY < 0 && curPgScr > 0.1) || (e.deltaY > 0 && curPgScr < maxPgScr - 0.1)) {
             if (cfg.dbg) console.log("SS: Using win scroll");
            return window;
        }

        if (cfg.dbg) console.log("SS: No scroll target found.");
        return null;
    }

    function _getPxDel(e, tgtEl) {
        let delta = e.deltaY;
        if (e.deltaMode === 1) {
            delta *= cfg.lnHt;
        } else if (e.deltaMode === 2) {
            const clHt = (tgtEl === window) ? window.innerHeight : /** @type {Element} */ (tgtEl).clientHeight;
            delta *= clHt * 0.9;
        }
        return delta;
    }

    function _hdlWheel(e) {
        if (e.deltaX !== 0 || e.ctrlKey || e.altKey ) {
             if (cfg.dbg) console.log("SS: Ignore event (X/mod)", e);
            return;
        }

        const tgtEl = _getTgt(e);

        if (!tgtEl) {
             if (cfg.dbg) console.log("SS: No target, native scroll");
            return;
        }

        e.preventDefault();

        const pxDel = _getPxDel(e, tgtEl);
        _startOrUpd(tgtEl, pxDel);
    }

    function _hdlClick(e) {
        const path = e.composedPath ? e.composedPath() : [];
        for (const el of path) {
            if (el instanceof Element || el === window) {
                _cancelAnim(el);
            }
             if (el === window) break;
        }
         _cancelAnim(window);
    }

    function _init() {
        if (window.top !== window.self && !window.location.href.match(/debug=true/)) {
            console.log("SS: Iframe detected, skip.");
            return;
        }
        if (window.SSEnhLoaded_NC) { // Changed flag slightly
             console.log("SS: Already loaded.");
            return;
        }

        document.documentElement.addEventListener('wheel', _hdlWheel, { passive: false, capture: true });
        document.documentElement.addEventListener('mousedown', _hdlClick, { passive: true, capture: true });
        document.documentElement.addEventListener('touchstart', _hdlClick, { passive: true, capture: true });

        window.SSEnhLoaded_NC = true;
        console.log(`Enhanced Smooth Scroll (Short+FX, No Comments): Initialized (v3.3) | Motion Blur: ${cfg.mBlur}`);
        if (cfg.dbg) console.log("SS: Debug mode enabled.");
    }

    _init();

})();