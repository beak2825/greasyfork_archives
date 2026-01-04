// ==UserScript==
// @name         ios小说朗读终极版（样式与自动播放优化版+可折叠控制面板）
// @namespace    http://tampermonkey.net/
// @version      6.5
// @description  优化面板按钮样式，修复自动播放问题，并支持面板折叠/展开
// @match        *://*/book/*/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536392/ios%E5%B0%8F%E8%AF%B4%E6%9C%97%E8%AF%BB%E7%BB%88%E6%9E%81%E7%89%88%EF%BC%88%E6%A0%B7%E5%BC%8F%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%BC%98%E5%8C%96%E7%89%88%2B%E5%8F%AF%E6%8A%98%E5%8F%A0%E6%8E%A7%E5%88%B6%E9%9D%A2%E6%9D%BF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/536392/ios%E5%B0%8F%E8%AF%B4%E6%9C%97%E8%AF%BB%E7%BB%88%E6%9E%81%E7%89%88%EF%BC%88%E6%A0%B7%E5%BC%8F%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%BC%98%E5%8C%96%E7%89%88%2B%E5%8F%AF%E6%8A%98%E5%8F%A0%E6%8E%A7%E5%88%B6%E9%9D%A2%E6%9D%BF%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ----- 全局状态 -----
    let paragraphs = [];
    let currentIndex = 0;
    let isPaused = false;
    let isStopped = false;
    let paragraphElements = [];
    let isPanelCreated = false;
    let isToggleCreated = false; // 折叠状态按钮标志

    const STORAGE_KEYS = {
        RATE: 'ttsRate',
        PITCH: 'ttsPitch',
        AUTO_NEXT_FLAG: 'autoNext'
    };

    // --------------------------- 创建控制面板 ---------------------------
    function createControlPanel() {
        if (isPanelCreated) return;

        const panel = document.createElement('div');
        panel.id = 'ttsControlPanel';
        panel.innerHTML = `
        <style>
            /* 原有面板样式保持不变 */
            #ttsControlPanel { position: fixed; bottom: 30px; right: 30px; background: rgba(0,0,0,0.8); color: #fff; padding: 12px; border-radius: 8px; font-size: 14px; z-index: 99999; font-family: 'Segoe UI', sans-serif; width: 320px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
            #ttsControlPanel button { margin: 3px; padding: 6px 9px; border: none; border-radius: 4px; background: #2196F3; color: white; cursor: pointer; font-size: 13px; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }
            #ttsControlPanel button:hover { background: #1976D2; transform: scale(1.03); }
            #ttsControlPanel .slider { width: 100%; margin: 8px 0; }
            #ttsStatus { margin-top: 8px; font-size: 13px; color: #eee; max-height: 120px; overflow-y: auto; white-space: normal; line-height: 1.5; padding: 4px; background: rgba(255,255,255,0.1); border-radius: 4px; }
            #ttsSliders label { display: block; margin-top: 8px; font-size: 12px; color: #ddd; }
            .highlight-reading { background: #FFEB3B !important; box-shadow: 0 2px 8px rgba(255,235,59,0.3); transition: all 0.3s; }
            /* 新增：折叠按钮样式 */
            /*#ttsCloseBtn { position: absolute; top: 6px; right: 6px; width: 24px; height: 24px; border: none; background: transparent; color: #fff; font-size: 18px; cursor: pointer; }*/
        </style>
        <div>
            <button id="ttsPlay">播放</button>
            <button id="ttsPause">暂停</button>
            <button id="ttsResume">继续</button>
            <button id="ttsNext">下一章</button>
            <button id="ttsStop">停止</button>
        <button id="ttsCloseBtn" title="折叠面板">×</button>
            
        </div>
        <div id="ttsSliders">
            <label>语速: <input type="range" id="rateSlider" class="slider" min="0.5" max="2" step="0.1"> <span id="rateValue"></span></label>
            <label>音调: <input type="range" id="pitchSlider" class="slider" min="0.5" max="2" step="0.1"> <span id="pitchValue"></span></label>
        </div>
        <div id="ttsStatus">状态：等待播放</div>
        `;
        document.body.appendChild(panel);
        isPanelCreated = true;

        // 初始化滑块值
        const rateSlider = document.getElementById('rateSlider');
        const pitchSlider = document.getElementById('pitchSlider');
        rateSlider.value = getSavedRate();
        pitchSlider.value = getSavedPitch();
        document.getElementById('rateValue').innerText = rateSlider.value;
        document.getElementById('pitchValue').innerText = pitchSlider.value;

        // 绑定原有按钮事件
        document.getElementById('ttsPlay').onclick = startReading;
        document.getElementById('ttsPause').onclick = pauseReading;
        document.getElementById('ttsResume').onclick = resumeReading;
        document.getElementById('ttsNext').onclick = goToNextChapter;
        document.getElementById('ttsStop').onclick = stopReading;
        // 绑定折叠按钮事件
        document.getElementById('ttsCloseBtn').onclick = collapsePanel;

        rateSlider.oninput = e => updateRate(e.target.value);
        pitchSlider.oninput = e => updatePitch(e.target.value);
    }

    // --------------------------- 折叠/展开逻辑 ---------------------------
    function createToggleButton() {
        if (isToggleCreated) return;
        const btn = document.createElement('button');
        btn.id = 'ttsToggleBtn';
        btn.title = '展开面板';
        btn.innerText = '▶';
        Object.assign(btn.style, {
            position: 'fixed', bottom: '30px', right: '0px', width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(0,0,0,0.8)', color: '#fff', border: 'none', cursor: 'pointer', zIndex: '99999'
        });
        btn.onclick = restorePanel;
        document.body.appendChild(btn);
        isToggleCreated = true;
    }

    function collapsePanel() {
        const panel = document.getElementById('ttsControlPanel');
        if (panel) panel.style.display = 'none';
        createToggleButton();
    }

    function restorePanel() {
        const panel = document.getElementById('ttsControlPanel');
        if (panel) panel.style.display = 'block';
        const btn = document.getElementById('ttsToggleBtn');
        if (btn) btn.remove();
        isToggleCreated = false;
    }

    // --------------------------- 以下代码保持原样，未做修改 ---------------------------
    function getSavedRate() {
        return parseFloat(localStorage.getItem(STORAGE_KEYS.RATE)) || 1;
    }

    function getSavedPitch() {
        return parseFloat(localStorage.getItem(STORAGE_KEYS.PITCH)) || 1;
    }

    function saveRate(v) {
        localStorage.setItem(STORAGE_KEYS.RATE, v);
    }

    function savePitch(v) {
        localStorage.setItem(STORAGE_KEYS.PITCH, v);
    }

    function setStatus(text) {
        const el = document.getElementById('ttsStatus');
        if (el) el.textContent = `状态：${text}`;
    }

    function updateRate(value) {
        const f = parseFloat(value).toFixed(1);
        document.getElementById('rateValue').innerText = f;
        saveRate(f);
    }

    function updatePitch(value) {
        const f = parseFloat(value).toFixed(1);
        document.getElementById('pitchValue').innerText = f;
        savePitch(f);
    }

    function getChapterText() {
        try {
            const titleEl = document.querySelector('#mlfy_main_text h1');
            const contentEl = document.querySelector('#TextContent');
            if (!titleEl || !contentEl) {
                setStatus('错误：未找到章节内容容器');
                return [];
            }
            paragraphElements = [...contentEl.querySelectorAll('p')].filter(p => p.innerText.trim());
            return [titleEl.innerText.trim(), ...paragraphElements.map(p => p.innerText.trim())];
        } catch (e) {
            console.error(e);
            setStatus('错误：解析章节失败');
            return [];
        }
    }

    function findFirstVisibleParagraphIndex() {
        const top = window.scrollY, bottom = top + window.innerHeight;
        for (let i = 0; i < paragraphElements.length; i++) {
            const r = paragraphElements[i].getBoundingClientRect();
            const t = r.top + window.scrollY, b = r.bottom + window.scrollY;
            if (b > top && t < bottom) return i + 1;
        }
        return 0;
    }

    function highlightParagraph(idx) {
        document.querySelectorAll('.highlight-reading').forEach(el => el.classList.remove('highlight-reading'));
        if (idx === 0) return;
        const p = paragraphElements[idx - 1];
        if (p) {
            p.classList.add('highlight-reading');
            const top = p.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({top: Math.max(top, 0), behavior: 'smooth'});
        }
    }

    function startReading() {
        isPaused = false;
        isStopped = false;
        paragraphs = getChapterText();
        if (!paragraphs.length) {
            setStatus('错误：无朗读内容');
            return;
        }
        currentIndex = findFirstVisibleParagraphIndex();
        speakNext();
    }

    function pauseReading() {
        if (isPaused || !speechSynthesis.speaking) return;
        speechSynthesis.pause();
        isPaused = true;
        setStatus('已暂停');
    }

    function resumeReading() {
        if (!isPaused || !speechSynthesis.paused) return;
        speechSynthesis.resume();
        isPaused = false;
        setStatus('继续朗读');
    }

    function stopReading() {
        isStopped = true;
        speechSynthesis.cancel();
        highlightParagraph(0);
        setStatus('已停止');
    }

    function speakNext() {
        if (isPaused || isStopped || currentIndex >= paragraphs.length) {
            if (!isPaused && !isStopped && currentIndex >= paragraphs.length) {
                setStatus('朗读结束，跳转下一章...');
                localStorage.setItem(STORAGE_KEYS.AUTO_NEXT_FLAG, '1');
                setTimeout(goToNextChapter, 1000);
            }
            return;
        }
        
        const text = paragraphs[currentIndex];
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'zh-CN';
        u.rate = getSavedRate();
        u.pitch = getSavedPitch();
        u.onstart = () => {
            setStatus(text);
            highlightParagraph(currentIndex);
        };
        u.onend = () => {
            currentIndex++;
            setStatus('即将开始播放');
            if (!isPaused && !isStopped) speakNext();
        };
        u.onerror = (e) => {
            console.error('TTS错误', e);
            setStatus(`播放错误：${e.error || '未知'}`);
            if (!isStopped && e.error !== 'interrupted') {
                currentIndex++;
                speakNext();
            }
        };
        speechSynthesis.speak(u);
    }

    function goToNextChapter() {
        stopReading();
        try {
            const next = document.querySelector('#nextChapterTop,#nextChapterBottom');
            if (next && next.href && !next.href.includes('javascript')) window.location.href = next.href; else setStatus('未找到下一章链接');
        } catch (e) {
            console.error(e);
            setStatus('跳转失败');
        }
    }

    function initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                createControlPanel();
                paragraphs = getChapterText();
            });
        } else {
            createControlPanel();
            paragraphs = getChapterText();
        }
        setTimeout(() => {
            setStatus('初始化完成，点击播放');
            if (localStorage.getItem(STORAGE_KEYS.AUTO_NEXT_FLAG)) {
                localStorage.removeItem(STORAGE_KEYS.AUTO_NEXT_FLAG);
                startReading();
            }
        }, 500);
    }

    initialize();
})();
