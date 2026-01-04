// ==UserScript==
// @name         Duome Stories Audio Controller
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  预加载音频，用快捷键控制 Duome Stories 音频播放，支持配置与悬浮控制面板动画
// @icon         https://d35aaqx5ub95lt.cloudfront.net/images/splash/f92d5f2f7d56636846861c458c0d0b6c.svg
// @author       abining
// @match        https://duome.eu/stories/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543204/Duome%20Stories%20Audio%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/543204/Duome%20Stories%20Audio%20Controller.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === 脚本依赖 ===
    // GM_getValue / GM_setValue 是 Tampermonkey 提供的跨页面本地存储 API
    // 用于持久化设置数据，参考文档：https://www.tampermonkey.net/documentation.php#GM_getValue

    const defaultShortcuts = {
        next: 'Tab',
        previous: 'Shift+Tab',
        replay: 'r'
    };

    let audioElements = [];
    let currentIndex = -1;

    function getShortcuts() {
        try {
            // 优先尝试从 Tampermonkey 存储读取
            const tmValue = GM_getValue('shortcuts');
            if (tmValue) return tmValue;

            // 回退到 localStorage
            const lsValue = localStorage.getItem('duomeShortcuts');
            return lsValue ? JSON.parse(lsValue) : defaultShortcuts;
        } catch (e) {
            // 如果 GM API 不可用（如在普通浏览器中）
            const lsValue = localStorage.getItem('duomeShortcuts');
            return lsValue ? JSON.parse(lsValue) : defaultShortcuts;
        }
    }

    function saveShortcuts(shortcuts) {
        try {
            // 优先尝试保存到 Tampermonkey 存储
            GM_setValue('shortcuts', shortcuts);
        } catch (e) {
            // 回退到 localStorage
            localStorage.setItem('duomeShortcuts', JSON.stringify(shortcuts));
        }
    }


    function preloadAudios() {
        return Array.from(document.querySelectorAll('.playback.voice')).map(el => {
            const src = el.dataset.src;
            if (src) {
                const audio = new Audio(src);
                audio.load();
                el._audio = audio;
            }
            return el;
        });
    }

    function highlight(el) {
        audioElements.forEach(e => e.style.backgroundColor = '');
        el.style.backgroundColor = '#e6f7ff';
    }

    function playAudio(el) {
        if (!el || !el._audio) return;

        // 暂停其他音频并播放当前音频
        audioElements.forEach(e => {
            if (e !== el && e._audio) {
                e._audio.pause();
                e._audio.currentTime = 0;
            }
        });
        el._audio.currentTime = 0;
        el._audio.play();
        highlight(el);

        // === 新增：自动滚动到当前播放元素 ===
        el.scrollIntoView({
            behavior: 'smooth',
            block: 'center'  // 垂直居中
        });
    }

    function createControlPanel(shortcuts) {
        // 悬浮控制器按钮（小方块）
        const toggle = document.createElement('div');
        toggle.id = 'duome-toggle';
        toggle.textContent = '⚙️';
        toggle.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            text-align: center;
            line-height: 30px;
            cursor: pointer;
            z-index: 9998;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        // 控制面板主体
        const panel = document.createElement('div');
        panel.id = 'duome-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50px;
            right: 10px;
            width: 200px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            z-index: 9999;
            opacity: 0;
            transform: translateY(-10px);
            pointer-events: none;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        panel.innerHTML = `
            <h3 style="margin-top:0;font-size:16px;">快捷键设置</h3>
            <label>下一个: <input type="text" id="nextKey" value="${shortcuts.next}" readonly></label><br>
            <label>上一个: <input type="text" id="prevKey" value="${shortcuts.previous}" readonly></label><br>
            <label>重播: <input type="text" id="replayKey" value="${shortcuts.replay}" readonly></label><br>
            <button id="saveBtn" style="margin-top:8px;padding:4px 10px;">保存</button>
        `;

        document.body.appendChild(toggle);
        document.body.appendChild(panel);

        // 快捷键录入监听
        ['nextKey', 'prevKey', 'replayKey'].forEach(id => {
            const input = panel.querySelector(`#${id}`);
            input.addEventListener('focus', () => {
                input.value = '按下键...';
                const capture = (e) => {
                    e.preventDefault();
                    let key = e.key;
                    if (e.shiftKey && key !== 'Shift') key = 'Shift+' + key;
                    input.value = key;
                    window.removeEventListener('keydown', capture);
                };
                window.addEventListener('keydown', capture);
            });
        });

        // 保存按钮事件
        panel.querySelector('#saveBtn').onclick = () => {
            const newShortcuts = {
                next: panel.querySelector('#nextKey').value.trim(),
                previous: panel.querySelector('#prevKey').value.trim(),
                replay: panel.querySelector('#replayKey').value.trim()
            };
            saveShortcuts(newShortcuts);
            alert('快捷键设置已保存，刷新页面生效');
        };

        // 悬停显示动画
        toggle.addEventListener('mouseenter', () => {
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
            panel.style.pointerEvents = 'auto';
        });
        toggle.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!panel.matches(':hover')) {
                    panel.style.opacity = '0';
                    panel.style.transform = 'translateY(-10px)';
                    panel.style.pointerEvents = 'none';
                }
            }, 100);
        });
        panel.addEventListener('mouseleave', () => {
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(-10px)';
            panel.style.pointerEvents = 'none';
        });
    }

    function normalizeKey(e) {
        return e.shiftKey ? `Shift+${e.key}` : e.key;
    }

    function handleKeydown(e, shortcuts) {
        const key = normalizeKey(e);
        if (key === shortcuts.next) {
            e.preventDefault();
            if (currentIndex < audioElements.length - 1) {
                playAudio(audioElements[++currentIndex]);
            }
        } else if (key === shortcuts.previous) {
            e.preventDefault();
            if (currentIndex > 0) {
                playAudio(audioElements[--currentIndex]);
            }
        } else if (key === shortcuts.replay) {
            e.preventDefault();
            if (currentIndex >= 0) {
                playAudio(audioElements[currentIndex]);
            }
        }
    }

    function main() {
        audioElements = preloadAudios();
        const shortcuts = getShortcuts();
        createControlPanel(shortcuts);
        document.addEventListener('keydown', e => handleKeydown(e, shortcuts));
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(main, 500);
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(main, 500));
    }
})();
