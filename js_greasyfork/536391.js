// ==UserScript==
// @name         小说朗读终极版（语速记忆 + 当前朗读内容显示）
// @namespace    http://tampermonkey.net/
// @version      6.2
// @description  小说朗读+高亮+自动翻页+语速音调记忆+暂停继续+顶部滚动+状态展示+可见段落启动
// @match        *://*/book/*/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536391/%E5%B0%8F%E8%AF%B4%E6%9C%97%E8%AF%BB%E7%BB%88%E6%9E%81%E7%89%88%EF%BC%88%E8%AF%AD%E9%80%9F%E8%AE%B0%E5%BF%86%20%2B%20%E5%BD%93%E5%89%8D%E6%9C%97%E8%AF%BB%E5%86%85%E5%AE%B9%E6%98%BE%E7%A4%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/536391/%E5%B0%8F%E8%AF%B4%E6%9C%97%E8%AF%BB%E7%BB%88%E6%9E%81%E7%89%88%EF%BC%88%E8%AF%AD%E9%80%9F%E8%AE%B0%E5%BF%86%20%2B%20%E5%BD%93%E5%89%8D%E6%9C%97%E8%AF%BB%E5%86%85%E5%AE%B9%E6%98%BE%E7%A4%BA%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let paragraphs = [];
    let currentIndex = 0;
    let isPaused = false;
    let isStopped = false;
    let paragraphElements = [];
    let autoStarted = false;

    const STORAGE_KEYS = {
        RATE: 'ttsRate',
        PITCH: 'ttsPitch',
        AUTO_NEXT_FLAG: 'autoNext'
    };

    // --------------------------- 新增：语音加载状态管理 ---------------------------
    let targetVoice = null; // 存储目标语音对象（Li-Mu）
    let isVoiceReady = false; // 语音准备状态

    // 监听语音列表加载完成事件
    speechSynthesis.onvoiceschanged = () => {
        targetVoice = speechSynthesis.getVoices().find(v =>
            v.name.toLowerCase().includes('li-mu') // 严格匹配Li-Mu（不区分大小写）
        );
        isVoiceReady = !!targetVoice; // 标记语音是否可用
        if (targetVoice) {
            console.log(`已加载目标语音：${targetVoice.name}`);
        } else {
            console.warn('未找到Li-Mu语音，将使用默认语音');
        }
    };

    // --------------------------- 其他代码保持不变 ---------------------------

    function getSavedRate() {
        return parseFloat(localStorage.getItem(STORAGE_KEYS.RATE)) || 1;
    }

    function getSavedPitch() {
        return parseFloat(localStorage.getItem(STORAGE_KEYS.PITCH)) || 1;
    }

    function saveRate(value) {
        localStorage.setItem(STORAGE_KEYS.RATE, value);
    }

    function savePitch(value) {
        localStorage.setItem(STORAGE_KEYS.PITCH, value);
    }

    function getChapterText() {
        const titleEl = document.querySelector('#mlfy_main_text h1');
        const contentEl = document.querySelector('#TextContent');
        if (!titleEl || !contentEl) return [];

        const title = titleEl.innerText.trim();
        paragraphElements = [...contentEl.querySelectorAll('p')].filter(p => p.innerText.trim());
        const ps = paragraphElements.map(p => p.innerText.trim());
        return [title, ...ps];
    }

    function findFirstVisibleParagraphIndex() {
        const viewportTop = window.scrollY;
        const viewportBottom = viewportTop + window.innerHeight;

        for (let i = 0; i < paragraphElements.length; i++) {
            const el = paragraphElements[i];
            const rect = el.getBoundingClientRect();
            const top = rect.top + window.scrollY;
            const bottom = rect.bottom + window.scrollY;

            if (bottom > viewportTop && top < viewportBottom) {
                return i + 1;
            }
        }
        return 0;
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'ttsControlPanel';
        panel.innerHTML = `
        <style>
            #ttsControlPanel {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: rgba(0,0,0,0.7);
                color: #fff;
                padding: 12px;
                border-radius: 8px;
                font-size: 14px;
                z-index: 9999;
                font-family: sans-serif;
                width: 320px;
            }
            #ttsControlPanel button {
                margin: 3px;
                padding: 5px 10px;
                border: none;
                border-radius: 5px;
                background: #4caf50;
                color: white;
                cursor: pointer;
                font-size: 13px;
            }
            #ttsControlPanel button:hover {
                background: #45a049;
            }
            #ttsControlPanel .slider {
                width: 100%;
            }
            #ttsStatus {
                margin-top: 6px;
                font-size: 13px;
                color: #ccc;
                max-height: 100px;
                overflow-y: auto;
                white-space: normal;
                line-height: 1.5;
            }
            #ttsSliders label {
                display: block;
                margin-top: 6px;
                font-size: 12px;
                color: #aaa;
            }
            .highlight-reading {
                background: #ffff99 !important;
                transition: background 0.3s;
            }
        </style>
        <div>
            <button id="ttsPlay">▶️播放</button>
            <button id="ttsPause">⏸️暂停</button>
            <button id="ttsResume">⏯️继续</button>
            <button id="ttsNext">➡️下一章</button>
            <button id="ttsStop">⏹️停止</button>
        </div>
        <div id="ttsSliders">
            <label>语速: <input type="range" id="rateSlider" class="slider" min="0.5" max="2" step="0.1"> <span id="rateValue"></span></label>
            <label>音调: <input type="range" id="pitchSlider" class="slider" min="0.5" max="2" step="0.1"> <span id="pitchValue"></span></label>
        </div>
        <div id="ttsStatus">状态：等待播放</div>
        `;
        document.body.appendChild(panel);

        const rateSlider = document.getElementById('rateSlider');
        const pitchSlider = document.getElementById('pitchSlider');
        rateSlider.value = getSavedRate();
        pitchSlider.value = getSavedPitch();
        document.getElementById('rateValue').innerText = rateSlider.value;
        document.getElementById('pitchValue').innerText = pitchSlider.value;

        document.getElementById('ttsPlay').onclick = () => {
            isPaused = false;
            isStopped = false;
            paragraphs = getChapterText();
            currentIndex = findFirstVisibleParagraphIndex();
            speakNext();
        };

        document.getElementById('ttsPause').onclick = () => {
            speechSynthesis.pause();
            isPaused = true;
            setStatus('已暂停');
        };

        document.getElementById('ttsResume').onclick = () => {
            speechSynthesis.resume();
            isPaused = false;
            isStopped = false;
            setStatus('继续朗读');
        };

        document.getElementById('ttsNext').onclick = () => {
            isStopped = true;
            stopReading();
            localStorage.removeItem(STORAGE_KEYS.AUTO_NEXT_FLAG);
            goToNextChapter();
        };

        document.getElementById('ttsStop').onclick = () => {
            isStopped = true;
            stopReading();
            setStatus('已停止');
        };

        rateSlider.oninput = e => {
            document.getElementById('rateValue').innerText = e.target.value;
            saveRate(e.target.value);
        };
        pitchSlider.oninput = e => {
            document.getElementById('pitchValue').innerText = e.target.value;
            savePitch(e.target.value);
        };
    }

    function getRate() {
        return parseFloat(document.getElementById('rateSlider').value);
    }

    function getPitch() {
        return parseFloat(document.getElementById('pitchSlider').value);
    }

    function setStatus(text) {
        const el = document.getElementById('ttsStatus');
        if (el) el.textContent = '状态：' + text;
    }

    function stopReading() {
        speechSynthesis.cancel();
        removeHighlight();
        currentIndex = 0;
        isPaused = false;
    }

    function removeHighlight() {
        document.querySelectorAll('.highlight-reading').forEach(el => {
            el.classList.remove('highlight-reading');
        });
    }

    function highlightParagraph(index) {
        removeHighlight();
        if (index === 0) return;
        const realIndex = index - 1;
        const p = paragraphElements[realIndex];
        if (p) {
            p.classList.add('highlight-reading');
            const top = p.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: top, behavior: 'smooth' });
        }
    }

   // --------------------------- 修正语音加载逻辑 ---------------------------
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
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = getRate();
    utterance.pitch = getPitch();
    // 如果找到了 Li-Mu，就用它；否则不设置 voice，浏览器会用默认语音
    if (targetVoice) {
        utterance.voice = targetVoice;
    }

    utterance.onstart = () => {
        setStatus(text);
        highlightParagraph(currentIndex);
    };

    utterance.onend = () => {
        currentIndex++;
        if (!isPaused && !isStopped) speakNext();
    };

    utterance.onerror = (e) => {
        console.error('TTS 播放错误:', e);
        currentIndex++;
        if (!isStopped) speakNext();
    };

    speechSynthesis.speak(utterance);
}


    function goToNextChapter() {
        const nextLink = document.querySelector('#nextChapterTop, #nextChapterBottom');
        if (nextLink && nextLink.href && !nextLink.href.includes('javascript')) {
            window.location.href = nextLink.href;
        } else {
            setStatus('未找到下一章链接，朗读结束');
        }
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            createControlPanel();
            paragraphs = getChapterText();
            if (localStorage.getItem(STORAGE_KEYS.AUTO_NEXT_FLAG)) {
                localStorage.removeItem(STORAGE_KEYS.AUTO_NEXT_FLAG);
                isPaused = false;
                isStopped = false;
                currentIndex = findFirstVisibleParagraphIndex();
                speakNext();
            }
        }, 800);
    });
})();