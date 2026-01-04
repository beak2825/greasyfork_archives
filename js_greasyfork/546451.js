// ==UserScript==
// @name         IG Reels – 音量控制+自動下一則
// @namespace    jerry.tools
// @version      2025.8.20.2121
// @description  Floating volume slider for Instagram (incl. Reels), remembers last value, early-applies to avoid 100%; adds auto-next on reel end with low overhead.
// @match        https://www.instagram.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/546451/IG%20Reels%20%E2%80%93%20%E9%9F%B3%E9%87%8F%E6%8E%A7%E5%88%B6%2B%E8%87%AA%E5%8B%95%E4%B8%8B%E4%B8%80%E5%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/546451/IG%20Reels%20%E2%80%93%20%E9%9F%B3%E9%87%8F%E6%8E%A7%E5%88%B6%2B%E8%87%AA%E5%8B%95%E4%B8%8B%E4%B8%80%E5%89%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== Config =====
    const KEY_VOL  = 'ig_last_volume';
    const KEY_AUTO = 'ig_auto_next';
    const DEFAULT_VOL = 0.02;     // 初次 2%
    const STEP = 0.05;            // Alt+↑/↓ 每次 5%
    const SAVE_DEBOUNCE_MS = 200; // 節流存檔

    // ===== Utils =====
    const clamp = v => Math.max(0, Math.min(1, Number.isFinite(v) ? v : DEFAULT_VOL));
    const load  = (k, d) => { try { return GM_getValue(k, d); } catch { return d; } };
    const save  = (k, v) => { try { GM_SetValue(k, v); } catch { try { GM_setValue(k, v); } catch {} } }; // 兼容多腳本管理器

    let lastVol  = clamp(parseFloat(load(KEY_VOL, DEFAULT_VOL)));
    let autoNext = !!load(KEY_AUTO, true);

    // 節流存音量
    let _saveTimer = null, _pendingSave = null;
    function debouncedSaveVol(v) {
        _pendingSave = clamp(v);
        if (_saveTimer) return;
        _saveTimer = setTimeout(() => {
            const val = _pendingSave;
            _saveTimer = null; _pendingSave = null;
            try { GM_setValue(KEY_VOL, val); } catch {}
        }, SAVE_DEBOUNCE_MS);
    }

    // ===== 攔截 volume setter（擋 IG 設為 1）=====
    const volDesc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume');
    if (volDesc && volDesc.set && volDesc.get) {
        Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
            configurable: true,
            enumerable: volDesc.enumerable,
            get: volDesc.get,
            set: function (v) {
                const want = clamp(v);
                if (Math.abs(want - 1) < 0.001 && lastVol !== 1) {
                    return volDesc.set.call(this, lastVol);
                }
                lastVol = want;
                debouncedSaveVol(lastVol);
                return volDesc.set.call(this, lastVol);
            }
        });
    }

    // ===== 攔截 play()（首播前套用）=====
    const origPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
        try {
            if (lastVol > 0) this.muted = false;
            if (Math.abs((this.volume ?? 0) - lastVol) > 0.003) this.volume = lastVol;
        } catch {}
        return origPlay.apply(this, args);
    };

    // ===== 初始化 <video> =====
    function applyOnce(vd) {
        try {
            if (lastVol > 0) vd.muted = false;
            if (Math.abs((vd.volume ?? 0) - lastVol) > 0.003) vd.volume = lastVol;
        } catch {}
    }

    function initVideo(vd) {
        if (!vd || vd.__igPrimed) return;
        vd.__igPrimed = true;

        applyOnce(vd);
        const reapply = () => applyOnce(vd);
        vd.addEventListener('loadedmetadata', reapply, { passive: true });
        vd.addEventListener('play',            reapply, { passive: true });

        // 使用者/外部調整 → 記住
        vd.addEventListener('volumechange', () => {
            const cur = clamp(vd.volume);
            if (Math.abs(cur - lastVol) > 0.01) {
                lastVol = cur;
                debouncedSaveVol(lastVol);
                updateUI.volume(lastVol);
            }
        }, { passive: true });

        // 進度更新（僅在事件觸發時，無輪詢）
        const updateFrom = () => {
            if (!isPrimaryVideo(vd)) return;
            updateUI.progress(vd);
        };
        vd.addEventListener('timeupdate',      updateFrom, { passive: true });
        vd.addEventListener('loadedmetadata',  updateFrom, { passive: true });
        vd.addEventListener('play',            updateFrom, { passive: true });
        vd.addEventListener('seeking',         updateFrom, { passive: true });

        // Auto-Next
        if (!vd.__igAutoNextBound) {
            vd.__igAutoNextBound = true;

            vd.addEventListener('ended', () => {
                if (!autoNext || vd.__igAutoNextDone) return;
                vd.__igAutoNextDone = true;
                goNextFrom(vd);
            }, { passive: true });

            vd.addEventListener('timeupdate', () => {
                if (!autoNext || vd.__igAutoNextDone) return;
                const d = vd.duration || 0;
                if (d > 2 && vd.currentTime / d >= 0.985) {
                    vd.__igAutoNextDone = true;
                    goNextFrom(vd);
                }
            }, { passive: true });

            // 輕量三段式回拉（確保初期不被設回 1）
            setTimeout(() => applyOnce(vd), 0);
            setTimeout(() => applyOnce(vd), 250);
            setTimeout(() => applyOnce(vd), 1000);
        }
    }

    // ===== Primary video 判定（播放中優先，否則視窗內面積最大）=====
    function isPrimaryVideo(v) {
        if (!v) return false;
        const vids = Array.from(document.querySelectorAll('video'));
        const playing = vids.filter(x => !x.paused && !x.ended && x.readyState >= 2);
        if (playing.length) return playing[0] === v;
        // 否則比可視面積
        const best = pickLargestVisible();
        return best === v;
    }

    function pickLargestVisible(except = null) {
        let best = null, bestArea = 0;
        const vids = document.querySelectorAll('video');
        vids.forEach(v => {
            if (v === except) return;
            const r = v.getBoundingClientRect();
            const w = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0));
            const h = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
            const area = w * h;
            if (area > bestArea) { bestArea = area; best = v; }
        });
        return best;
    }

    // ===== Auto Next 實作 =====
    function sendArrowDown() {
        const opts = { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, which: 40, bubbles: true, cancelable: true };
        document.dispatchEvent(new KeyboardEvent('keydown', opts));
        document.dispatchEvent(new KeyboardEvent('keyup',   opts));
    }

    function goNextFrom(cur) {
        // 1) 先嘗試鍵盤
        sendArrowDown();
        // 2) Fallback：找下一支或可視最大
        setTimeout(() => {
            const all = Array.from(document.querySelectorAll('video'));
            const idx = all.indexOf(cur);
            const next = (idx >= 0 && all[idx + 1]) || pickLargestVisible(cur);
            if (next) {
                try { next.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch {}
                setTimeout(() => { try { if (next.paused) next.play(); } catch {} }, 250);
            } else {
                try { window.scrollBy({ top: innerHeight * 0.9, behavior: 'smooth' }); } catch {}
            }
        }, 120);
    }

    // ===== MutationObserver（批次）=====
    let pendingNodes = [];
    let scheduled = false;
    const scheduleFlush = () => {
        if (scheduled) return;
        scheduled = true;
        Promise.resolve().then(() => {
            scheduled = false;
            if (!pendingNodes.length) return;
            const batch = pendingNodes; pendingNodes = [];
            for (const n of batch) {
                if (n.nodeType !== 1) continue;
                if (n.tagName === 'VIDEO') initVideo(n);
                else n.querySelectorAll?.('video').forEach(initVideo);
            }
            // 批次後，用主影片更新一次圓環
            const pv = pickLargestVisible();
            if (pv) updateUI.progress(pv);
        });
    };

    const mo = new MutationObserver(muts => {
        for (const m of muts) {
            for (const n of m.addedNodes) pendingNodes.push(n);
        }
        if (pendingNodes.length) scheduleFlush();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    // 初次掃描 + 掛 UI
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('video').forEach(initVideo);
        mountUI();
        const pv = pickLargestVisible();
        if (pv) updateUI.progress(pv);
    });

    // ===== 浮動 UI（新增：圓環進度）=====
    let ui = null;
    function mountUI() {
        if (ui) return;
        const root = document.createElement('div');
        const shadow = root.attachShadow({ mode: 'open' });

        const wrap = document.createElement('div');
        wrap.style.position = 'fixed';
        wrap.style.top = '50%';
        wrap.style.right = '12px';
        wrap.style.transform = 'translateY(-50%)';
        wrap.style.zIndex = '2147483647';
        wrap.style.display = 'flex';
        wrap.style.flexDirection = 'column';
        wrap.style.alignItems = 'center';
        wrap.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Arial';
        wrap.style.userSelect = 'none';

        const panel = document.createElement('div');
        panel.style.background = 'rgba(0,0,0,0.5)';
        panel.style.backdropFilter = 'blur(3px)';
        panel.style.borderRadius = '12px';
        panel.style.padding = '8px';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.style.alignItems = 'center';

        // 音量百分比
        const valueText = document.createElement('div');
        valueText.style.color = '#fff';
        valueText.style.fontSize = '12px';
        valueText.style.marginBottom = '6px';
        valueText.textContent = Math.round(lastVol * 100) + '%';

        // 滑桿
        const sliderWrap = document.createElement('div');
        sliderWrap.style.width = '28px';
        sliderWrap.style.height = '140px';
        sliderWrap.style.display = 'flex';
        sliderWrap.style.alignItems = 'center';
        sliderWrap.style.justifyContent = 'center';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '1';
        slider.step = '0.01';
        slider.value = String(lastVol);
        slider.style.transform = 'rotate(-90deg)';
        slider.style.width = '140px';
        slider.style.height = '28px';

        // —— 新增：圓環進度（SVG）——
        const ringBox = document.createElement('div');
        ringBox.style.width = '36px';
        ringBox.style.height = '36px';
        ringBox.style.marginTop = '8px';
        ringBox.style.position = 'relative';

        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', '36');
        svg.setAttribute('height', '36');
        svg.setAttribute('viewBox', '0 0 36 36');

        // 軌道
        const track = document.createElementNS(svgNS, 'circle');
        track.setAttribute('cx', '18'); track.setAttribute('cy', '18'); track.setAttribute('r', '16');
        track.setAttribute('fill', 'none');
        track.setAttribute('stroke', 'rgba(255,255,255,0.25)');
        track.setAttribute('stroke-width', '4');

        // 進度弧
        const prog = document.createElementNS(svgNS, 'circle');
        prog.setAttribute('cx', '18'); prog.setAttribute('cy', '18'); prog.setAttribute('r', '16');
        prog.setAttribute('fill', 'none');
        prog.setAttribute('stroke', '#4ade80'); // 進度色（接近尾端會變色）
        prog.setAttribute('stroke-width', '4');
        prog.setAttribute('stroke-linecap', 'round');
        prog.style.transform = 'rotate(-90deg)';
        prog.style.transformOrigin = '50% 50%';

        const R = 16;
        const C = 2 * Math.PI * R; // 圓周
        prog.setAttribute('stroke-dasharray', String(C));
        prog.setAttribute('stroke-dashoffset', String(C)); // 0%

        // 中心文字
        const pctText = document.createElement('div');
        pctText.style.position = 'absolute';
        pctText.style.left = '0';
        pctText.style.top = '0';
        pctText.style.width = '36px';
        pctText.style.height = '36px';
        pctText.style.display = 'flex';
        pctText.style.alignItems = 'center';
        pctText.style.justifyContent = 'center';
        pctText.style.fontSize = '11px';
        pctText.style.color = '#fff';
        pctText.style.opacity = '0.95';
        pctText.textContent = '--%';

        svg.appendChild(track);
        svg.appendChild(prog);
        ringBox.appendChild(svg);
        ringBox.appendChild(pctText);

        // 滑桿事件
        let lastUIValue = lastVol;
        slider.addEventListener('input', () => {
            const v = clamp(parseFloat(slider.value));
            if (Math.abs(v - lastUIValue) < 0.001) return;
            lastUIValue = v;
            lastVol = v;
            debouncedSaveVol(v);
            valueText.textContent = Math.round(v * 100) + '%';
            document.querySelectorAll('video').forEach(vd => {
                try { if (v > 0) vd.muted = false; vd.volume = v; } catch {}
            });
        });

        sliderWrap.appendChild(slider);
        panel.appendChild(valueText);
        panel.appendChild(sliderWrap);
        panel.appendChild(ringBox); // ⬅ 放在滑桿下方
        wrap.appendChild(panel);
        shadow.appendChild(wrap);

        const mount = () => (document.body ? document.body.appendChild(root) : setTimeout(mount, 50));
        mount();

        ui = {
            root, shadow, slider, valueText,
            ring: { prog, track, pctText, C }
        };
    }

    const updateUI = {
        volume(v) {
            if (!ui) return;
            const nv = String(clamp(v));
            if (ui.slider.value !== nv) ui.slider.value = nv;
            const pct = Math.round(clamp(v) * 100) + '%';
            if (ui.valueText.textContent !== pct) ui.valueText.textContent = pct;
        },
        progress(vd) {
            if (!ui || !vd) return;
            const d = vd.duration || 0;
            if (!isFinite(d) || d <= 0) {
                ui.ring.pctText.textContent = '--%';
                ui.ring.prog.setAttribute('stroke-dashoffset', String(ui.ring.C));
                ui.ring.prog.setAttribute('stroke', '#4ade80');
                return;
            }
            const ratio = Math.max(0, Math.min(1, vd.currentTime / d));
            const pctNum = Math.round(ratio * 100);
            ui.ring.pctText.textContent = pctNum + '%';
            const offset = ui.ring.C * (1 - ratio);
            ui.ring.prog.setAttribute('stroke-dashoffset', String(offset));
            // 接近尾端變色（> 98%）
            ui.ring.prog.setAttribute('stroke', ratio >= 0.98 ? '#f59e0b' : '#4ade80');
        }
    };

    // ===== 熱鍵：Alt+↑/↓（全頁所有 video）=====
    window.addEventListener('keydown', (e) => {
        if (!e.altKey) return;
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
        e.preventDefault();
        const v = clamp(lastVol + (e.key === 'ArrowUp' ? STEP : -STEP));
        if (Math.abs(v - lastVol) < 0.001) return;
        lastVol = v;
        debouncedSaveVol(v);
        updateUI.volume(v);
        document.querySelectorAll('video').forEach(vd => {
            try { if (v > 0) vd.muted = false; vd.volume = v; } catch {}
        });
    }, { capture: true, passive: false });

    // ===== TM 選單：顯示/設定音量、切換自動下一則 =====
    try {
        /*
    GM_registerMenuCommand('Show current volume', () => {
      alert('Saved volume: ' + Math.round(lastVol * 100) + '%');
    });
    */
        /*
    GM_registerMenuCommand('Set volume…', () => {
      const input = prompt('Enter default volume (0.0 ~ 1.0):', String(lastVol));
      if (input == null) return;
      const v = clamp(parseFloat(input));
      lastVol = v;
      debouncedSaveVol(v);
      updateUI(v);
      document.querySelectorAll('video').forEach(vd => { try { if (v > 0) vd.muted = false; vd.volume = v; } catch {} });
    });
    */
        GM_registerMenuCommand(`自動下一則: ${autoNext ? '啟動' : '關閉'} (toggle)`, () => {
            autoNext = !autoNext;
            save(KEY_AUTO, autoNext);
            alert('自動下一則' + (autoNext ? '啟動' : '關閉'));
        });
        GM_registerMenuCommand('重設音量至 2%', () => {
            lastVol = DEFAULT_VOL;
            debouncedSaveVol(lastVol);
            updateUI(lastVol);
            document.querySelectorAll('video').forEach(vd => { try { if (lastVol > 0) vd.muted = false; vd.volume = lastVol; } catch {} });
        });
    } catch {}

})();