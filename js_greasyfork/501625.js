// ==UserScript==
// @name        Scroll to Top Button
// @namespace   sttb-ujs-dxrk1e
// @description Adds a customizable scroll-to-top button near the page bottom.
// @icon        https://i.imgur.com/FxF8TLS.png
// @match       *://*/*
// @grant       none
// @version     3.1.0
// @author      DXRK1E
// @license     MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/501625/Scroll%20to%20Top%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/501625/Scroll%20to%20Top%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const _cfg = {
        b: {
            sz: '45px', fs: '18px', bg: '#3a3a3a', hBg: '#555', clr: '#f5f5f5',
            br: '50%', pos: { b: '25px', r: '25px' }, sh: '0 4px 12px rgba(0,0,0,0.4)',
            trMs: 300, z: 2147483647,
            svg: { w: '20px', h: '20px', vb: '0 0 16 16', pd: 'M8 3L14 9L12.6 10.4L8 5.8L3.4 10.4L2 9L8 3Z' },
            lbl: 'Scroll to Top'
        },
        bh: { shThrPx: 300, dDelMs: 150, smScr: true, natSmScr: false },
        sc: { durMs: 800, eas: 'easeInOutCubic' }
    };

    const _eas = {
        linear: t => t, easeInQuad: t => t * t, easeOutQuad: t => t * (2 - t),
        easeInOutQuad: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: t => t * t * t, easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        easeInQuart: t => t * t * t * t, easeOutQuart: t => 1 - (--t) * t * t * t,
        easeInOutQuart: t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
        easeInQuint: t => t * t * t * t * t, easeOutQuint: t => 1 + (--t) * t * t * t * t,
        easeInOutQuint: t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
        easeInExpo: t => (t === 0) ? 0 : Math.pow(2, 10 * (t - 1)),
        easeOutExpo: t => (t === 1) ? 1 : 1 - Math.pow(2, -10 * t),
        easeInOutExpo: t => t === 0 ? 0 : t === 1 ? 1 : t < .5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2
    };

    const _bid = 'estb-dxrk1e-s';
    const _sid = 'estb-styles-dxrk1e-s';

    let _btn = null;
    let _sto = null;
    let _raf = null;

    function _gSP() { return window.scrollY || document.documentElement.scrollTop; }

    function _deb(fn, wt) {
        return function (...a) {
            clearTimeout(_sto);
            _sto = setTimeout(() => { fn.apply(this, a); }, wt);
        };
    }

    function _gEF() { return _eas[_cfg.sc.eas] || _eas.linear; }

    function _injS() {
        if (document.getElementById(_sid)) return;
        const css = `
            #${_bid}{position:fixed;bottom:${_cfg.b.pos.b};right:${_cfg.b.pos.r};width:${_cfg.b.sz};height:${_cfg.b.sz};background-color:${_cfg.b.bg};color:${_cfg.b.clr};border:none;border-radius:${_cfg.b.br};cursor:pointer;box-shadow:${_cfg.b.sh};opacity:0;visibility:hidden;z-index:${_cfg.b.z};transition:opacity ${_cfg.b.trMs}ms ease-in-out,visibility ${_cfg.b.trMs}ms ease-in-out,background-color ${_cfg.b.trMs}ms ease-in-out,transform ${_cfg.b.trMs}ms ease-in-out;display:flex;align-items:center;justify-content:center;padding:0;transform:scale(1);outline:none;will-change:opacity,transform;overflow:hidden;}
            #${_bid}:hover{background-color:${_cfg.b.hBg};transform:scale(1.1);}
            #${_bid}:active{transform:scale(0.95);}
            #${_bid}.visible{opacity:1;visibility:visible;}
            #${_bid} svg{display:block;width:${_cfg.b.svg.w};height:${_cfg.b.svg.h};fill:currentColor;}
        `;
        const se = document.createElement('style');
        se.id = _sid; se.textContent = css;
        (document.head || document.documentElement).appendChild(se);
    }

    function _crB() {
        const b = document.createElement('button');
        b.id = _bid; b.setAttribute('aria-label', _cfg.b.lbl); b.setAttribute('title', _cfg.b.lbl); b.type = 'button';
        b.innerHTML = `<svg width="${_cfg.b.svg.w}" height="${_cfg.b.svg.h}" viewBox="${_cfg.b.svg.vb}" xmlns="http://www.w3.org/2000/svg"><path d="${_cfg.b.svg.pd}" /></svg>`;
        b.addEventListener('click', (e) => { e.preventDefault(); _scT(); });
        return b;
    }

    function _smS() {
        const sPos = _gSP(); if (sPos <= 0) return;
        const sT = performance.now(); const dur = _cfg.sc.durMs; const easing = _gEF();
        if (_raf) { cancelAnimationFrame(_raf); }
        function step(cT) {
            const el = cT - sT; const prog = Math.min(el / dur, 1);
            const eP = easing(prog); const nPos = sPos * (1 - eP);
            window.scrollTo(0, nPos);
            if (prog < 1) { _raf = requestAnimationFrame(step); } else { _raf = null; }
        }
        _raf = requestAnimationFrame(step);
    }

    function _scT() {
        if (_cfg.bh.smScr) {
            if (_cfg.bh.natSmScr && 'scrollBehavior' in document.documentElement.style) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else { _smS(); }
        } else { window.scrollTo({ top: 0, behavior: 'auto' }); }
    }

    function _hSE() {
        if (!_btn) return;
        const sPos = _gSP();
        if (sPos > _cfg.bh.shThrPx) { _btn.classList.add('visible'); }
        else { _btn.classList.remove('visible'); }
    }

    function _init() {
        if (document.getElementById(_bid) || !document.body) return;
        try {
            _injS(); _btn = _crB(); document.body.appendChild(_btn);
            const dBounce = _deb(_hSE, _cfg.bh.dDelMs);
            window.addEventListener('scroll', dBounce, { passive: true });
            window.addEventListener('resize', dBounce, { passive: true });
            const mObs = new MutationObserver(dBounce);
            mObs.observe(document.body, { childList: true, subtree: true, attributes: false });
            _hSE();
        } catch (e) { console.error("STTB Error:", e); }
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', _init); }
    else { _init(); }

})();