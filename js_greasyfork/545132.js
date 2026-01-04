// ==UserScript==
// @name         Enazo 送花彩纸特效
// @namespace    http://tampermonkey.net/
// @version      2025-08-11.4
// @description  add some kirakira when you are giving the flower
// @author       Noa
// @match        https://enazo.cn/r/*
// @icon         https://enazo.cn/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/545132/Enazo%20%E9%80%81%E8%8A%B1%E5%BD%A9%E7%BA%B8%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/545132/Enazo%20%E9%80%81%E8%8A%B1%E5%BD%A9%E7%BA%B8%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEF = {
        speed: 1500, height: 0.7, count: 150,
        batches: 2, delay: 300, angle: 90,
        perspective: 800, size: 1
    };

    let cfg = {};
    for (const k in DEF) cfg[k] = GM_getValue(k, DEF[k]);

    const R = (min, max) => Math.random() * (max - min) + min;
    const RC = () => '#' + Array.from({ length: 6 }, () => '0123456789ABCDEF'[~~R(0, 16)]).join('');

    const updatePerspective = () => {
        document.body.style.perspective = cfg.perspective + 'px';
        document.body.style.perspectiveOrigin = '50% 50%';
    };
    updatePerspective();

    const createPaper = (l, w, h) => {
        const p = document.createElement('div');
        const baseSize = R(5, 10) * cfg.size;
        p.style.cssText = `
            position:absolute;
            bottom:0;
            left:${l + R(0, w)}px;
            width:${baseSize}px;
            height:${baseSize}px;
            background:${RC()};
            pointer-events:none;
            z-index:9999;
            opacity:1;
            transform-style: preserve-3d;
        `;
        document.body.appendChild(p);

        const rad = (R(-cfg.angle / 2, cfg.angle / 2)) * Math.PI / 180;
        const distance = h * cfg.height + R(0, 200);
        const tx = Math.sin(rad) * distance;
        const ty = Math.cos(rad) * distance;

        p.animate(
            [
                { transform: 'translate(0,0) rotateX(0deg) rotateY(0deg) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, -${ty}px) rotateX(${R(360, 720)}deg) rotateY(${R(360, 720)}deg) scale(0.5)`, opacity: 0 }
            ],
            { duration: cfg.speed, easing: 'ease-out', fill: 'forwards' }
        ).onfinish = () => p.remove();
    };

    const launchFlower = () => {
        const box = document.querySelector('.draw-canvas-box');
        if (!box) return;
        const { left, width, height } = box.getBoundingClientRect();

        for (let b = 0; b < cfg.batches; b++) {
            setTimeout(() => {
                for (let i = 0; i < cfg.count; i++) createPaper(left, width, height);
            }, b * cfg.delay);
        }
    };

    new MutationObserver(m => m.forEach(v =>
        v.addedNodes.forEach(n =>
            n.nodeType === 1 && n.matches('.show-flower-box[data-value=flower]') && launchFlower()
        )
    )).observe(document.body, { childList: true, subtree: true });

    GM_registerMenuCommand('设置彩纸参数', () => {
        const panel = document.createElement('div');
        Object.assign(panel.style, {
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255,255,255,0.95)',
            padding: '15px', border: '1px solid #ccc',
            zIndex: '99999', borderRadius: '8px',
            width: '280px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        });

        panel.innerHTML = `
            <h3 style="margin-top:0;">彩纸设置</h3>

            <div style="margin-bottom:10px;">
                <label>速度: <span id="speed-val">${cfg.speed}</span> ms</label><br>
                <input type="range" id="speed" min="100" max="5000" step="100" value="${cfg.speed}" style="width:100%;">
            </div>

            <div style="margin-bottom:10px;">
                <label>高度: <span id="height-val">${cfg.height}</span></label><br>
                <input type="range" id="height" min="0.1" max="1" step="0.05" value="${cfg.height}" style="width:100%;">
            </div>

            <div style="margin-bottom:10px;">
                <label>数量: <span id="count-val">${cfg.count}</span></label><br>
                <input type="range" id="count" min="1" max="1500" step="1" value="${cfg.count}" style="width:100%;">
            </div>

            <div style="margin-bottom:10px;">
                <label>批次数: <span id="batches-val">${cfg.batches}</span></label><br>
                <input type="range" id="batches" min="1" max="10" step="1" value="${cfg.batches}" style="width:100%;">
            </div>

            <div style="margin-bottom:10px;">
                <label>每批延迟: <span id="delay-val">${cfg.delay}</span> ms</label><br>
                <input type="range" id="delay" min="0" max="3000" step="50" value="${cfg.delay}" style="width:100%;">
            </div>

            <div style="margin-bottom:10px;">
                <label>扇形最大角度: <span id="angle-val">${cfg.angle}</span>°</label><br>
                <input type="range" id="angle" min="0" max="180" step="5" value="${cfg.angle}" style="width:100%;">
            </div>

            <div style="margin-bottom:10px;">
                <label>透视深度: <span id="perspective-val">${cfg.perspective}</span> px</label><br>
                <input type="range" id="perspective" min="200" max="4000" step="50" value="${cfg.perspective}" style="width:100%;">
            </div>

            <div style="margin-bottom:15px;">
                <label>彩纸尺寸倍数: <span id="size-val">${cfg.size}</span></label><br>
                <input type="range" id="size" min="0.5" max="20" step="0.5" value="${cfg.size}" style="width:100%;">
            </div>

            <div style="text-align:right;">
                <button id="preview-btn">预览</button>
                <button id="save-btn">保存</button>
                <button id="close-btn">关闭</button>
            </div>
        `;

        const inputs = panel.querySelectorAll('input[type=range]');
        inputs.forEach(inp => {
            inp.addEventListener('input', e => {
                cfg[e.target.id] = parseFloat(e.target.value);
                panel.querySelector(`#${e.target.id}-val`).textContent = e.target.value;
                if (e.target.id === 'perspective') updatePerspective();
            });
        });

        panel.querySelector('#preview-btn').onclick = launchFlower;
        panel.querySelector('#save-btn').onclick = () => {
            for (const k in cfg) GM_setValue(k, cfg[k]);
            document.body.removeChild(panel);
        };
        panel.querySelector('#close-btn').onclick = () => document.body.removeChild(panel);

        document.body.appendChild(panel);
    });

})();