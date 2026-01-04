// ==UserScript==
// @name         Twitter Search Filter
// @namespace    https://x.com/pollowinworld
// @version      1.4
// @description  Filter tweets in Twitter search. Support hide auto-post bot tweets, visual management panel, mask hint, full hide, dark mode, draggable, collapsible, fully dynamic page adaptation! 🚀
// @author       pollowinworld
// @match        https://x.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534094/Twitter%20Search%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/534094/Twitter%20Search%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let blockedWords = JSON.parse(localStorage.getItem('blockedWords') || '["AI Alert &"]');
    let filterEnabled = JSON.parse(localStorage.getItem('filterEnabled') || 'true');
    let fullHideEnabled = JSON.parse(localStorage.getItem('fullHideEnabled') || 'true');
    let darkModeEnabled = JSON.parse(localStorage.getItem('darkModeEnabled') || 'false');
    let hideAutoPostEnabled = JSON.parse(localStorage.getItem('hideAutoPostEnabled') || 'false');

    const autoPostKeywords = ["自动发推", "Automated"];

    let panelCreated = false;
    let tweetObserver = null;

    function saveBlockedWords() { localStorage.setItem('blockedWords', JSON.stringify(blockedWords)); }
    function saveFilterStatus() { localStorage.setItem('filterEnabled', JSON.stringify(filterEnabled)); }
    function saveFullHideStatus() { localStorage.setItem('fullHideEnabled', JSON.stringify(fullHideEnabled)); }
    function saveDarkModeStatus() { localStorage.setItem('darkModeEnabled', JSON.stringify(darkModeEnabled)); }
    function saveHideAutoPostStatus() { localStorage.setItem('hideAutoPostEnabled', JSON.stringify(hideAutoPostEnabled)); }

    function shouldBlock(tweetText) {
        return blockedWords.find(word => tweetText.toLowerCase().includes(word.toLowerCase()));
    }

    function isAutoPost(tweetText) {
        return autoPostKeywords.find(word => tweetText.toLowerCase().includes(word.toLowerCase()));
    }

    function createMask(article, matchedWord) {
        const mask = document.createElement('div');
        mask.style.position = 'absolute';
        mask.style.top = '0';
        mask.style.left = '0';
        mask.style.width = '100%';
        mask.style.height = '100%';
        mask.style.background = 'rgba(255, 255, 255, 0.9)';
        mask.style.display = 'flex';
        mask.style.flexDirection = 'column';
        mask.style.justifyContent = 'center';
        mask.style.alignItems = 'center';
        mask.style.zIndex = '100';
        mask.innerHTML = `
            <div style="font-weight:bold;margin-bottom:5px;">已屏蔽推文</div>
            <div style="font-size:12px;margin-bottom:10px;">匹配关键词：<b>${matchedWord}</b></div>
            <button style="padding:5px 10px;">显示此推文</button>
        `;
        const button = mask.querySelector('button');
        button.addEventListener('click', () => {
            mask.remove();
        });
        article.style.position = 'relative';
        article.appendChild(mask);
    }

    function filterTweets() {
        if (!filterEnabled) return;
        const articles = document.querySelectorAll('article[data-testid="tweet"]');
        articles.forEach(article => {
            const textContent = article.innerText;
            const matchedWord = shouldBlock(textContent);
            const autoPostMatch = hideAutoPostEnabled ? autoPostKeywords.find(word => textContent.includes(word)) : null;
            if (matchedWord || autoPostMatch) {
                if (!article.dataset.filtered) {
                    article.dataset.filtered = 'true';
                    if (fullHideEnabled) {
                        article.style.display = 'none';
                    } else {
                        createMask(article, matchedWord || (autoPostMatch + '（自动发推）'));
                    }
                }
            }
        });
    }
    function createControlPanel() {
        if (panelCreated) return;
        panelCreated = true;

        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '100px';
        panel.style.right = '20px';
        panel.style.width = '280px';
        panel.style.background = 'white';
        panel.style.border = '1px solid #ccc';
        panel.style.borderRadius = '8px';
        panel.style.padding = '10px';
        panel.style.zIndex = '9999';
        panel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        panel.style.fontSize = '14px';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.cursor = 'move';
        panel.id = 'filter-panel';

        panel.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                <h3 style="margin:0; font-size:16px;">🛡️ 屏蔽词管理</h3>
                <button id="collapse-btn" style="background:none; border:none; font-size:18px; cursor:pointer;">➖</button>
            </div>
            <div id="panel-body">
                <div id="word-list" style="max-height:120px; overflow:auto; margin-bottom:10px;"></div>
                <input id="new-word" type="text" placeholder="添加屏蔽词" style="width: 100%; box-sizing: border-box; padding:5px; margin-bottom:5px;">
                <button id="add-word" style="width: 100%; padding:5px;">添加屏蔽词</button>
                <button id="toggle-filter" style="width: 100%; padding:5px; margin-top:5px;">${filterEnabled ? '✅ 过滤开启' : '❌ 过滤关闭'}</button>
                <button id="toggle-fullhide" style="width: 100%; padding:5px; margin-top:5px;">${fullHideEnabled ? '✅ 完全隐藏开启' : '❌ 完全隐藏关闭'}</button>
                <button id="toggle-autopost" style="width: 100%; padding:5px; margin-top:5px;">${hideAutoPostEnabled ? '🚀 隐藏自动发推 ✅' : '🚀 隐藏自动发推 ❌'}</button>
                <button id="toggle-darkmode" style="width: 100%; padding:5px; margin-top:5px;">🌙 切换夜间模式</button>
                <button id="export-words" style="width: 100%; padding:5px; margin-top:5px;">📤 导出屏蔽词</button>
                <button id="import-words" style="width: 100%; padding:5px; margin-top:5px;">📥 导入屏蔽词</button>
                <button id="clear-words" style="width: 100%; padding:5px; margin-top:5px; background-color:#f88;">清空所有屏蔽词</button>
            </div>
        `;
        document.body.appendChild(panel);

        const collapseBtn = panel.querySelector('#collapse-btn');
        const panelBody = panel.querySelector('#panel-body');
        let collapsed = true;
        panelBody.style.display = 'none';
        collapseBtn.textContent = '➕';
        panel.style.width = '60px';
        collapseBtn.addEventListener('click', () => {
            collapsed = !collapsed;
            if (collapsed) {
                panelBody.style.display = 'none';
                collapseBtn.textContent = '➕';
                panel.style.width = '60px';
            } else {
                panelBody.style.display = '';
                collapseBtn.textContent = '➖';
                panel.style.width = '280px';
            }
        });

        const wordListDiv = panel.querySelector('#word-list');
        const input = panel.querySelector('#new-word');
        const addButton = panel.querySelector('#add-word');
        const toggleButton = panel.querySelector('#toggle-filter');
        const toggleFullHideButton = panel.querySelector('#toggle-fullhide');
        const toggleAutoPostButton = panel.querySelector('#toggle-autopost');
        const toggleDarkModeButton = panel.querySelector('#toggle-darkmode');
        const exportButton = panel.querySelector('#export-words');
        const importButton = panel.querySelector('#import-words');
        const clearButton = panel.querySelector('#clear-words');

        function refreshWordList() {
            wordListDiv.innerHTML = '';
            blockedWords.forEach((word, index) => {
                const wordItem = document.createElement('div');
                wordItem.style.display = 'flex';
                wordItem.style.justifyContent = 'space-between';
                wordItem.style.marginBottom = '5px';
                wordItem.innerHTML = `<span>${word}</span><button data-index="${index}" style="background:none; border:none; color:red; cursor:pointer;">✖️</button>`;
                wordListDiv.appendChild(wordItem);
            });
            wordListDiv.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.target.getAttribute('data-index'));
                    blockedWords.splice(idx, 1);
                    saveBlockedWords();
                    refreshWordList();
                });
            });
        }

        function applyTheme() {
            if (darkModeEnabled) {
                panel.style.background = '#1e1e1e';
                panel.style.color = '#eee';
                panel.querySelectorAll('button').forEach(btn => {
                    btn.style.backgroundColor = '#333';
                    btn.style.color = '#eee';
                });
            } else {
                panel.style.background = 'white';
                panel.style.color = 'black';
                panel.querySelectorAll('button').forEach(btn => {
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                });
            }
        }

        addButton.addEventListener('click', () => {
            const word = input.value.trim();
            if (word && !blockedWords.includes(word)) {
                blockedWords.push(word);
                saveBlockedWords();
                refreshWordList();
            }
            input.value = '';
        });

        toggleButton.addEventListener('click', () => {
            filterEnabled = !filterEnabled;
            saveFilterStatus();
            toggleButton.innerText = filterEnabled ? '✅ 过滤开启' : '❌ 过滤关闭';
        });

        toggleFullHideButton.addEventListener('click', () => {
            fullHideEnabled = !fullHideEnabled;
            saveFullHideStatus();
            toggleFullHideButton.innerText = fullHideEnabled ? '✅ 完全隐藏开启' : '❌ 完全隐藏关闭';
        });

        toggleAutoPostButton.addEventListener('click', () => {
            hideAutoPostEnabled = !hideAutoPostEnabled;
            saveHideAutoPostStatus();
            toggleAutoPostButton.innerText = hideAutoPostEnabled ? '🚀 隐藏自动发推 ✅' : '🚀 隐藏自动发推 ❌';
        });

        toggleDarkModeButton.addEventListener('click', () => {
            darkModeEnabled = !darkModeEnabled;
            saveDarkModeStatus();
            applyTheme();
        });

        exportButton.addEventListener('click', () => {
            const blob = new Blob([JSON.stringify(blockedWords, null, 2)], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'blocked_words.json';
            a.click();
            URL.revokeObjectURL(url);
        });

        importButton.addEventListener('click', () => {
            const inputFile = document.createElement('input');
            inputFile.type = 'file';
            inputFile.accept = 'application/json';
            inputFile.onchange = e => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = event => {
                    try {
                        const imported = JSON.parse(event.target.result);
                        if (Array.isArray(imported)) {
                            blockedWords = imported;
                            saveBlockedWords();
                            refreshWordList();
                            alert('✅ 成功导入屏蔽词');
                        } else {
                            alert('❌ 文件格式错误');
                        }
                    } catch (err) {
                        alert('❌ 解析失败');
                    }
                };
                reader.readAsText(file);
            };
            inputFile.click();
        });

        clearButton.addEventListener('click', () => {
            if (confirm('确定要清空所有屏蔽词吗？')) {
                blockedWords = [];
                saveBlockedWords();
                refreshWordList();
            }
        });

        refreshWordList();
        applyTheme();

        // 拖拽+吸附
        let isDragging = false, offsetX, offsetY;
        panel.addEventListener('mousedown', e => {
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            panel.style.transition = 'none';
        });
        document.addEventListener('mousemove', e => {
            if (isDragging) {
                panel.style.left = (e.clientX - offsetX) + 'px';
                panel.style.top = (e.clientY - offsetY) + 'px';
                panel.style.right = 'auto';
            }
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                const windowWidth = window.innerWidth;
                const panelRect = panel.getBoundingClientRect();
                const middle = windowWidth / 2;
                if (panelRect.left + panelRect.width / 2 < middle) {
                    panel.style.left = '10px';
                    panel.style.right = 'auto';
                } else {
                    panel.style.right = '10px';
                    panel.style.left = 'auto';
                }
                panel.style.transition = 'left 0.2s, right 0.2s, top 0.2s';
            }
        });
    }

    function observeTweets() {
        if (tweetObserver) tweetObserver.disconnect();
        tweetObserver = new MutationObserver(() => {
            if (location.pathname.startsWith('/search')) {
                createControlPanel();
                filterTweets();
            }
        });
        tweetObserver.observe(document.body, { childList: true, subtree: true });
    }

    observeTweets();
})();