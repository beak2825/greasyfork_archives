// ==UserScript==
// @name         Gooboo宝藏预测器
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  为Gooboo游戏添加宝藏预测功能
// @author       Zding
// @match        *://gooboo.*/*
// @match        *://*/*gooboo*
// @exclude      https://gooboo.0nz.de/*
// @exclude      https://zdplay.github.io/gooboo/*
// @grant        none
// @license MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/seedrandom.min.js
// @downloadURL https://update.greasyfork.org/scripts/540930/Gooboo%E5%AE%9D%E8%97%8F%E9%A2%84%E6%B5%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/540930/Gooboo%E5%AE%9D%E8%97%8F%E9%A2%84%E6%B5%8B%E5%99%A8.meta.js
// ==/UserScript==

//说明：在宝藏【购买】按钮的鼠标提示里
(function() {
    'use strict';

    const waitGame = () => new Promise(r => {
        const c = () => {
            try {
                const s = document.getElementsByClassName("primary")[0]?.__vue__?.$store;
                s && s.state.system.playerId ? r(s) : setTimeout(c, 1000);
            } catch (e) { setTimeout(c, 1000); }
        };
        c();
    });

    const predict = (s, t, o = 0) => {
        try {
            const rT = s.getters['system/getRng']('treasureTier_' + t, o);
            const rG = s.getters['system/getRng']('treasure_' + t, o);
            const tC = s.getters['treasure/tierChancesRaw'];
            let tier = null, total = 0;
            const next = rT();
            tC.forEach(e => {
                total += e.chance;
                tier === null && next < total && (tier = e.tier);
            });

            if (!tier && tier !== 0) return null;

            let eL = {};
            const gE = s.state.treasure.effect, gU = s.state.unlock;

            for (const [k, e] of Object.entries(gE)) {
                if (k === 'mining' || gU[`${k}Feature`]?.see) {
                    for (const [sk, se] of Object.entries(e)) {
                        if (!se.unlock || gU[se.unlock]?.see) {
                            !eL[se.type] && (eL[se.type] = []);
                            eL[se.type].push(sk);
                        }
                    }
                }
            }
            let chosen = [];
            const cfg = s.state.treasure.type[t];

            cfg.slots.forEach(slot => {
                const arr = eL[slot.type];
                if (arr?.length) {
                    const idx = Math.floor(rG() * arr.length);
                    const elem = arr[idx];
                    eL[slot.type] = arr.filter(el => el !== elem);
                    chosen.push(elem);
                }
            });
            const vals = chosen.map((el, i) => {
                const feat = s.state.treasure.effectToFeature[el];
                const obj = s.state.treasure.effect[feat][el];
                return s.getters['treasure/effectValue'](obj.value * cfg.slots[i].power, tier, 0, t);
            });

            return { tier, type: t, effect: chosen, valueCache: vals };
        } catch (e) { return null; }
    };
    const decap = s => s.charAt(0).toLowerCase() + s.slice(1);
    const getName = (_, e) => {
        try {
            const v = document.getElementsByClassName("primary")[0]?.__vue__;
            if (!v?.$vuetify?.lang?.t) return e;
            const isGain = e.match(/currency(\w|-)+Gain/) && !e.match(/currency(\w|-)+CapGain/);
            const isCap = e.match(/currency(\w|-)+Cap/) && !e.match(/currency(\w|-)+Gain/);
            if (isGain) {
                let p = e.slice(8, -4).split(/(?=[A-Z])/);
                const f = decap(p[0]);
                p.splice(0, 1);
                const c = decap(p.join(''));
                const n = `${f}_${c}`;
                const t = v.$vuetify.lang.t(`$vuetify.currency.${n}.name`);
                if (t !== `$vuetify.currency.${n}.name`) return v.$vuetify.lang.t('$vuetify.gooboo.multGain', t);
            }
            if (isCap) {
                let p = e.slice(8, -3).split(/(?=[A-Z])/);
                const f = decap(p[0]);
                p.splice(0, 1);
                const c = decap(p.join(''));
                const n = `${f}_${c}`;
                const t = v.$vuetify.lang.t(`$vuetify.currency.${n}.name`);
                if (t !== `$vuetify.currency.${n}.name`) return v.$vuetify.lang.t('$vuetify.gooboo.multCapacity', t);
            }
            const k = `$vuetify.mult.${e}`;
            const t = v.$vuetify.lang.t(k);
            return t !== k ? t : e;
        } catch { return e; }
    };
    const format = (t, s) => {
        if (!t) return `<div style="color: #ff5252;">预测失败</div>`;
        const c = ['#ffffff', '#ffeb3b', '#ff9800', '#f44336', '#9c27b0'][t.tier] || '#ffffff';
        let txt = '';
        t.effect.forEach((e, i) => {
            const v = t.valueCache[i];
            const n = getName(s, e);
            if (i > 0) txt += ', ';
            txt += `${n} ×${(v + 1).toFixed(2)}`;
        });
        return `<div style="margin: 2px 0; font-size: 14px;"><span style="color: ${c};">${txt}</span></div>`;
    };
    const createTip = () => {
        const t = document.createElement('div');
        t.id = 'treasure-predictor-tooltip';
        t.style.cssText = `position:absolute;background:rgba(33,33,33,0.95);color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:4px;padding:8px 12px;font-family:Roboto,sans-serif;font-size:14px;line-height:1.4;z-index:10000;box-shadow:0 2px 8px rgba(0,0,0,0.3);max-width:400px;display:none;pointer-events:none`;
        t.innerHTML = `<div id="tooltip-prediction-results">加载中...</div>`;
        document.body.appendChild(t);
        return t;
    };
    const showTip = (e, c) => {
        const t = document.getElementById('treasure-predictor-tooltip');
        if (!t) return;
        t.querySelector('#tooltip-prediction-results').innerHTML = c;
        t.style.display = 'block';
        const r = e.target.getBoundingClientRect();
        const tr = t.getBoundingClientRect();
        let l = r.left + r.width + 10;
        let top = r.top;
        l + tr.width > window.innerWidth && (l = r.left - tr.width - 10);
        top + tr.height > window.innerHeight && (top = window.innerHeight - tr.height - 10);
        top < 0 && (top = 10);
        l < 0 && (l = 10);
        t.style.left = l + 'px';
        t.style.top = top + 'px';
    };
    const hideTip = () => {
        const t = document.getElementById('treasure-predictor-tooltip');
        t && (t.style.display = 'none');
    };
    const bind = s => {
        const btns = document.querySelectorAll('[data-cy="treasure-buy-regular"], [data-cy="treasure-buy-dual"], [data-cy="treasure-buy-empowered"], [data-cy="treasure-buy-ancient"]');
        btns.forEach(b => {
            const t = b.getAttribute('data-cy').replace('treasure-buy-', '');
            b.removeEventListener('mouseenter', b._tpEnter);
            b.removeEventListener('mouseleave', b._tpLeave);
            b._tpEnter = e => {
                if (!isTreasure(s)) return;
                let r = '';
                for (let i = 0; i < 10; i++) r += format(predict(s, t, i), s);
                showTip(e, r);
            };
            b._tpLeave = () => hideTip();
            b.addEventListener('mouseenter', b._tpEnter);
            b.addEventListener('mouseleave', b._tpLeave);
        });
    };
    const isTreasure = s => s.state.system.screen === 'treasure';
    (async () => {
        try {
            const s = await waitGame();
            createTip();
            const init = () => isTreasure(s) && setTimeout(() => bind(s), 500);
            init();
            let last = s.state.system.screen;
            setInterval(() => {
                const curr = s.state.system.screen;
                curr !== last && (last = curr, init());
            }, 500);
        } catch (e) { console.error('启动失败:', e); }
    })();

})();
