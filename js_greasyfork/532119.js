// ==UserScript==
// @name         B站视频外挂字幕工具(自动版)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为B站视频添加外挂字幕功能，支持手动选择字幕和样式调整
// @author       wuwu
// @match        https://www.bilibili.com/video/*
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/532119/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%A4%96%E6%8C%82%E5%AD%97%E5%B9%95%E5%B7%A5%E5%85%B7%28%E8%87%AA%E5%8A%A8%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532119/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%A4%96%E6%8C%82%E5%AD%97%E5%B9%95%E5%B7%A5%E5%85%B7%28%E8%87%AA%E5%8A%A8%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentSubtitle = [];
    let subtitleIndex = 0;
    let subtitleContainer = null;
    let settingsPanel = null;
    let settingsVisible = false;
    let offsetTime = 0;
    let isManualSelection = false; // 添加这个缺失的变量
    let currentPart = null;
    let partObserver = null;
    let episodeTitles = [];
    function init() {
        GM_addStyle(`
            .custom-subtitle-container {
                position: absolute;
                bottom: 120px;
                left: 50%;
                transform: translateX(-50%);
                width: 80%;
                text-align: center;
                z-index: 9999;
                pointer-events: none;
                transition: all 0.3s;
            }
            .custom-subtitle {
                display: inline-block;
                max-width: 100%;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 24px;
                color: white;
                text-shadow: 1px 1px 2px black;
                background-color: rgba(0, 0, 0, 0.7);
                margin-bottom: 10px;
                line-height: 1.4;
                transition: all 0.3s;
            }
            .subtitle-settings-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                background-color: #fb7299;
                color: white;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            .subtitle-settings-panel {
                position: fixed;
                bottom: 80px;
                right: 20px;
                z-index: 10000;
                background-color: white;
                border-radius: 8px;
                padding: 15px;
                width: 300px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                display: none;
            }
            .subtitle-settings-panel.visible {
                display: block;
            }
            .subtitle-settings-panel h3 {
                margin-top: 0;
                color: #fb7299;
            }
            .subtitle-settings-panel label {
                display: block;
                margin: 10px 0 5px;
            }
            .subtitle-settings-panel input[type="range"] {
                width: 100%;
            }
            .subtitle-settings-panel button {
                background-color: #fb7299;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                margin-top: 10px;
                cursor: pointer;
            }
            .subtitle-file-input {
                display: none;
            }
            .subtitle-upload-btn {
                background-color: #23ade5;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                margin-top: 10px;
                cursor: pointer;
                width: 100%;
            }
            .subtitle-selector {
                width: 100%;
                padding: 8px;
                margin: 10px 0;
                border-radius: 4px;
                border: 1px solid #ddd;
            }
            .auto-match-info{font-size:12px;color:#666;margin-top:5px;}

        `);

        subtitleContainer = document.createElement('div');
        subtitleContainer.className = 'custom-subtitle-container';
        document.body.appendChild(subtitleContainer);

        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'subtitle-settings-btn';
        settingsBtn.innerHTML = '字';
        settingsBtn.title = '字幕设置';
        settingsBtn.addEventListener('click', toggleSettingsPanel);
        document.body.appendChild(settingsBtn);

        createSettingsPanel();
        setupVideoListener();
        loadSettings();
        updateSubtitleSelector();
        loadEpisodeTitles();
        setupPartSwitchListener();
        setTimeout(tryAutoMatchSubtitle, 2000);

    }
    // 新增分P标题加载函数
    function loadEpisodeTitles() {
        // 方法1：从页面预加载数据获取
        const scriptData = document.getElementById('__NEXT_DATA__');
        if (scriptData) {
            try {
                const jsonData = JSON.parse(scriptData.textContent);
                episodeTitles = jsonData?.props?.pageProps?.dehydratedState?.queries?.[0]?.state?.data?.pages?.map(p => p.part) || [];
                return;
            } catch (e) {}
        }

        // 方法2：从初始化状态获取
        if (typeof __INITIAL_STATE__ !== 'undefined') {
            episodeTitles = __INITIAL_STATE__?.videoData?.pages?.map(p => p.part) || [];
            return;
        }

        // 方法3：DOM解析（最终回退）
        episodeTitles = Array.from(document.querySelectorAll('.list-box [data-title]')).map(el => el.dataset.title);
    }


    function createSettingsPanel() {
        settingsPanel = document.createElement('div');
        settingsPanel.className = 'subtitle-settings-panel';
        settingsPanel.innerHTML = `
            <h3>字幕设置</h3>
            <label>选择字幕文件:</label>
            <select class="subtitle-selector" id="subtitle-selector">
                <option value="">-- 选择字幕 --</option>
            </select>
            <label>垂直位置: <span id="vertical-value">120</span>px</label>
            <input type="range" id="subtitle-vertical" min="20" max="300" value="120">
            <label>水平位置: <span id="horizontal-value">50</span>%</label>
            <input type="range" id="subtitle-horizontal" min="0" max="100" value="50">
            <label>字体大小: <span id="size-value">24</span>px</label>
            <input type="range" id="subtitle-size" min="12" max="48" value="24">
            <label>背景透明度: <span id="opacity-value">70</span>%</label>
            <input type="range" id="subtitle-opacity" min="0" max="100" value="70">
            <label>时间偏移: <span id="offset-value">0</span>秒</label>
            <input type="range" id="subtitle-offset" min="-5" max="5" step="0.1" value="0">
            <button id="reset-settings">重置设置</button>
            <input type="file" id="subtitle-file-input" class="subtitle-file-input" multiple accept=".srt">
            <button class="subtitle-upload-btn" id="upload-subtitles">批量上传字幕文件</button>
            <button class="subtitle-upload-btn" id="clear-subtitles">清除所有字幕</button>
        `;
        settingsPanel.innerHTML+=`<div id="auto-match-info" class="auto-match-info"></div>`;

        document.body.appendChild(settingsPanel);

        document.getElementById('subtitle-vertical').addEventListener('input', updateVerticalPosition);
        document.getElementById('subtitle-horizontal').addEventListener('input', updateHorizontalPosition);
        document.getElementById('subtitle-size').addEventListener('input', updateSize);
        document.getElementById('subtitle-opacity').addEventListener('input', updateOpacity);
        document.getElementById('subtitle-offset').addEventListener('input', updateOffset);
        document.getElementById('reset-settings').addEventListener('click', resetSettings);
        document.getElementById('upload-subtitles').addEventListener('click', () => {
            document.getElementById('subtitle-file-input').click();
        });
        document.getElementById('subtitle-file-input').addEventListener('change', handleSubtitleUpload);
        document.getElementById('clear-subtitles').addEventListener('click', clearSubtitles);
        document.getElementById('subtitle-selector').addEventListener('change', selectSubtitle);
    }

    function toggleSettingsPanel() {
        settingsVisible = !settingsVisible;
        settingsPanel.classList.toggle('visible', settingsVisible);
    }

    function updateVerticalPosition(e) {
        const value = e.target.value;
        document.getElementById('vertical-value').textContent = value;
        subtitleContainer.style.bottom = `${value}px`;
        GM_setValue('subtitleVertical', value);
    }
    // 修改后的setupPartSwitchListener
    function setupPartSwitchListener() {
        if (partObserver) {
            partObserver.disconnect();
        }

        // 扩展更多可能的分P容器选择器
        const containerSelectors = [
            '.list-box',
            '.section',
            '.video-section-list',
            '.part-list',
            '.video-tab-page',
            '.multi-page',
            '.episode-list'
        ];

        let container = null;
        for (const selector of containerSelectors) {
            container = document.querySelector(selector);
            if (container) {
                console.log(`找到分P容器: ${selector}`);
                break;
            }
        }

        if (!container) {
            console.log('未找到分P容器，将在1秒后重试...');
            setTimeout(setupPartSwitchListener, 1000);
            return;
        }

        partObserver = new MutationObserver(() => {
            const newPart = document.querySelector('.part.on,.cur-list.on,.episode-item.on,.episode-list__item.active');
            if (newPart && (!currentPart || newPart !== currentPart)) {
                console.log('检测到分P切换，新分P内容:', newPart.textContent.trim());
                currentPart = newPart;
                setTimeout(() => {
                    tryAutoMatchSubtitle();
                }, 500);
            }
        });

        partObserver.observe(container, {
            childList: true,
            subtree: true
        });
    }

    function updateHorizontalPosition(e) {
        const value = e.target.value;
        document.getElementById('horizontal-value').textContent = value;
        subtitleContainer.style.left = `${value}%`;
        subtitleContainer.style.transform = `translateX(-${value}%)`;
        GM_setValue('subtitleHorizontal', value);
    }

    function updateSize(e) {
        const value = e.target.value;
        document.getElementById('size-value').textContent = value;
        const subtitleElement = subtitleContainer.querySelector('.custom-subtitle');
        if (subtitleElement) {
            subtitleElement.style.fontSize = `${value}px`;
        }
        GM_setValue('subtitleSize', value);
    }

    function updateOpacity(e) {
        const value = e.target.value;
        document.getElementById('opacity-value').textContent = value;
        const opacity = value / 100;
        const subtitleElement = subtitleContainer.querySelector('.custom-subtitle');
        if (subtitleElement) {
            subtitleElement.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
        }
        GM_setValue('subtitleOpacity', value);
    }

    function updateOffset(e) {
        const value = parseFloat(e.target.value);
        document.getElementById('offset-value').textContent = value;
        offsetTime = value;
        GM_setValue('subtitleOffset', value);
    }

    function resetSettings() {
        GM_setValue('subtitleVertical', 120);
        GM_setValue('subtitleHorizontal', 50);
        GM_setValue('subtitleSize', 24);
        GM_setValue('subtitleOpacity', 70);
        GM_setValue('subtitleOffset', 0);

        document.getElementById('subtitle-vertical').value = 120;
        document.getElementById('subtitle-horizontal').value = 50;
        document.getElementById('subtitle-size').value = 24;
        document.getElementById('subtitle-opacity').value = 70;
        document.getElementById('subtitle-offset').value = 0;

        document.getElementById('vertical-value').textContent = '120';
        document.getElementById('horizontal-value').textContent = '50';
        document.getElementById('size-value').textContent = '24';
        document.getElementById('opacity-value').textContent = '70';
        document.getElementById('offset-value').textContent = '0';

        subtitleContainer.style.bottom = '120px';
        subtitleContainer.style.left = '50%';
        subtitleContainer.style.transform = 'translateX(-50%)';

        const subtitleElement = subtitleContainer.querySelector('.custom-subtitle');
        if (subtitleElement) {
            subtitleElement.style.fontSize = '24px';
            subtitleElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        }

        offsetTime = 0;
    }

    function loadSettings() {
        const vertical = GM_getValue('subtitleVertical', 120);
        const horizontal = GM_getValue('subtitleHorizontal', 50);
        const size = GM_getValue('subtitleSize', 24);
        const opacity = GM_getValue('subtitleOpacity', 70);
        const offset = GM_getValue('subtitleOffset', 0);

        document.getElementById('subtitle-vertical').value = vertical;
        document.getElementById('subtitle-horizontal').value = horizontal;
        document.getElementById('subtitle-size').value = size;
        document.getElementById('subtitle-opacity').value = opacity;
        document.getElementById('subtitle-offset').value = offset;

        document.getElementById('vertical-value').textContent = vertical;
        document.getElementById('horizontal-value').textContent = horizontal;
        document.getElementById('size-value').textContent = size;
        document.getElementById('opacity-value').textContent = opacity;
        document.getElementById('offset-value').textContent = offset;

        subtitleContainer.style.bottom = `${vertical}px`;
        subtitleContainer.style.left = `${horizontal}%`;
        subtitleContainer.style.transform = `translateX(-${horizontal}%)`;

        const subtitleElement = subtitleContainer.querySelector('.custom-subtitle');
        if (subtitleElement) {
            subtitleElement.style.fontSize = `${size}px`;
            subtitleElement.style.backgroundColor = `rgba(0, 0, 0, ${opacity / 100})`;
        }

        offsetTime = offset;
    }

    function handleSubtitleUpload(e) {
        const files = e.target.files;
        if (files.length === 0) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function(event) {
                const content = event.target.result;
                try {
                    const subtitles = parseSrt(content);
                    const fileName = file.name.replace('.srt', '');

                    GM_setValue(`subtitle_${fileName}`, JSON.stringify({
                        name: fileName,
                        data: subtitles
                    }));

                    console.log(`字幕上传成功: ${fileName}`);
                    updateSubtitleSelector();
                } catch (error) {
                    console.error('解析字幕文件出错:', file.name, error);
                }
            };

            reader.readAsText(file);
        }

        e.target.value = '';
    }

    function updateSubtitleSelector() {
        const selector = document.getElementById('subtitle-selector');
        if (!selector) return;

        const currentValue = selector.value;
        selector.innerHTML = '<option value="">-- 选择字幕 --</option>';

        const savedKeys = GM_listValues().filter(key => key.startsWith('subtitle_'));

        savedKeys.forEach(key => {
            try {
                const subtitleData = JSON.parse(GM_getValue(key));
                const option = document.createElement('option');
                option.value = subtitleData.name;
                option.textContent = subtitleData.name;
                selector.appendChild(option);
            } catch (error) {
                console.error('加载字幕出错:', key, error);
            }
        });

        if (currentValue && [...selector.options].some(opt => opt.value === currentValue)) {
            selector.value = currentValue;
        }
    }

    function selectSubtitle(e){
        const file=e.target.value;
        if(!file){currentSubtitle=[];isManualSelection=false;return;}
        const data=JSON.parse(GM_getValue(`subtitle_${file}`));
        currentSubtitle=data.data;
        isManualSelection=true;
        document.getElementById('auto-match-info').textContent=`手动选择:${file}`;
    }

    // 修改后的tryAutoMatchSubtitle函数
    function tryAutoMatchSubtitle() {
        if (isManualSelection) {
            console.log('当前为手动选择模式，跳过自动匹配');
            return;
        }

        const videoTitle = getCurrentPartTitle();
        console.log('当前获取的视频标题:', videoTitle); // 调试输出

        if (!videoTitle) {
            console.log('未能获取视频标题');
            return;
        }

        const savedKeys = GM_listValues().filter(k => k.startsWith('subtitle_'));
        console.log('现有字幕文件:', savedKeys.map(k => k.replace('subtitle_', ''))); // 调试输出

        let bestMatch = null, bestScore = 0;
        savedKeys.forEach(key => {
            const name = key.replace('subtitle_', '');
            const score = calculateMatchScore(videoTitle, name);
            console.log(`匹配测试: "${videoTitle}" vs "${name}" => ${score.toFixed(2)}`); // 调试输出

            if (score > bestScore) {
                bestScore = score;
                bestMatch = name;
            }
        });

        if (bestMatch && bestScore > 0.3) {
            console.log(`自动匹配成功: ${bestMatch} (匹配度: ${bestScore.toFixed(2)})`);
            loadSubtitle(bestMatch);
            document.getElementById('auto-match-info').textContent = `自动匹配: ${bestMatch}`;
        } else {
            console.log('没有找到合适的匹配字幕');
            document.getElementById('auto-match-info').textContent = '未找到匹配的字幕';
        }
    }

    // 修改获取当前分P标题函数
    function getCurrentPartTitle() {
        // 获取当前分P索引
        const currentIndex = getCurrentPartIndex();
        if (currentIndex >= 0 && episodeTitles[currentIndex]) {
            return episodeTitles[currentIndex];
        }

        // 回退方案
        return document.querySelector('.part.on a,.cur-list.on a')?.textContent.trim() || document.querySelector('.video-title')?.textContent.trim() || '';
    }


    // 新增加载字幕函数
    function loadSubtitle(name) {
        try {
            const data = JSON.parse(GM_getValue(`subtitle_${name}`));
            currentSubtitle = data.data;
            subtitleIndex = 0;
            const selector = document.getElementById('subtitle-selector');
            if (selector) selector.value = name;
        } catch (e) {
            console.error('加载字幕失败:', e);
        }
    }
    // 修改匹配度计算函数
    function calculateMatchScore(videoTitle, subtitleName) {
        // 提取分P序号 (如 "1.01.目标(P1)" -> "01")
        const partNumMatch = subtitleName.match(/(\d+)\./);
        const currentIndex = getCurrentPartIndex();

        // 如果序号匹配当前分P，直接高分
        if (partNumMatch && currentIndex >= 0) {
            const partNum = parseInt(partNumMatch[1]);
            if (partNum === currentIndex + 1) {
                return 0.8; // 序号匹配基础分
            }
        }

        // 常规关键词匹配
        const cleanVideoTitle = videoTitle.replace(/[^\w\u4e00-\u9fa5]+/g, ' ');
        const cleanSubtitle = subtitleName.replace(/[^\w\u4e00-\u9fa5]+/g, ' ');

        const videoWords = cleanVideoTitle.toLowerCase().split(/\s+/);
        const subWords = cleanSubtitle.toLowerCase().split(/\s+/);

        let matches = 0;
        videoWords.forEach(w => {
            if (subWords.includes(w)) matches++;
        });

        const wordScore = matches / Math.max(1, videoWords.length);
        const lengthScore = 1 - Math.abs(videoTitle.length - subtitleName.length) / Math.max(videoTitle.length, subtitleName.length, 1);

        return wordScore * 0.6 + lengthScore * 0.4;
    }
    // 新增获取当前分P索引函数
    function getCurrentPartIndex() {
        // 方法1：从URL获取
        const urlMatch = window.location.href.match(/[?&]p=(\d+)/);
        if (urlMatch) return parseInt(urlMatch[1]) - 1;

        // 方法2：从激活的分P元素获取
        const activeItem = document.querySelector('.part.on,.cur-list.on,.episode-item.on');
        if (activeItem) {
            const indexAttr = activeItem.getAttribute('data-index') || activeItem.getAttribute('data-episode');
            if (indexAttr) return parseInt(indexAttr);

            // 通过兄弟元素计算位置
            const parent = activeItem.parentElement;
            if (parent) {
                return Array.from(parent.children).indexOf(activeItem);
            }
        }

        return -1;
    }

    function parseSrt(srtText) {
        const lines = srtText.split(/\r?\n/);
        const subtitles = [];
        let currentSubtitle = null;

        for (const line of lines) {
            if (!line.trim()) {
                if (currentSubtitle) {
                    subtitles.push(currentSubtitle);
                    currentSubtitle = null;
                }
                continue;
            }

            if (!currentSubtitle) {
                currentSubtitle = { id: line.trim() };
            } else if (!currentSubtitle.startTime) {
                const timeMatch = line.match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
                if (timeMatch) {
                    currentSubtitle.startTime = timeMatch[1];
                    currentSubtitle.endTime = timeMatch[2];
                }
            } else {
                currentSubtitle.text = currentSubtitle.text ?
                    currentSubtitle.text + '\n' + line : line;
            }
        }

        if (currentSubtitle) {
            subtitles.push(currentSubtitle);
        }

        return subtitles;
    }

    function clearSubtitles() {
        const savedKeys = GM_listValues().filter(key => key.startsWith('subtitle_'));

        savedKeys.forEach(key => {
            GM_deleteValue(key);
        });

        currentSubtitle = [];
        subtitleIndex = 0;
        updateSubtitleDisplay('');
        updateSubtitleSelector();
        console.log('所有字幕已清除');
    }



    function updateSubtitle() {
        if (currentSubtitle.length === 0) {
            updateSubtitleDisplay('');
            return;
        }

        const video = document.querySelector('video');
        if (!video) return;

        const currentTime = video.currentTime + offsetTime;

        while (subtitleIndex > 0 && currentTime < parseTime(currentSubtitle[subtitleIndex].startTime)) {
            subtitleIndex--;
        }

        while (subtitleIndex < currentSubtitle.length - 1 && currentTime > parseTime(currentSubtitle[subtitleIndex + 1].startTime)) {
            subtitleIndex++;
        }

        if (subtitleIndex >= 0 && subtitleIndex < currentSubtitle.length) {
            const subtitle = currentSubtitle[subtitleIndex];
            const startTime = parseTime(subtitle.startTime);
            const endTime = parseTime(subtitle.endTime);

            if (currentTime >= startTime && currentTime <= endTime) {
                updateSubtitleDisplay(subtitle.text);
                return;
            }
        }

        updateSubtitleDisplay('');
    }

    function updateSubtitleDisplay(text) {
        if (!subtitleContainer) return;

        if (text) {
            subtitleContainer.innerHTML = `<div class="custom-subtitle">${text.replace(/\n/g, '<br>')}</div>`;
            const subtitleElement = subtitleContainer.querySelector('.custom-subtitle');
            if (subtitleElement) {
                const size = document.getElementById('subtitle-size').value;
                const opacity = document.getElementById('subtitle-opacity').value / 100;
                subtitleElement.style.fontSize = `${size}px`;
                subtitleElement.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
            }
        } else {
            subtitleContainer.innerHTML = '';
        }
    }
    // 修改视频监听函数
    function setupVideoListener() {
        const videoObserver = new MutationObserver((mutations, obs) => {
            const video = document.querySelector('video');
            if (video) {
                // 先移除旧监听器避免重复绑定
                video.removeEventListener('timeupdate', updateSubtitle);
                video.addEventListener('timeupdate', updateSubtitle);

                // 处理分P切换后的视频重载
                video.addEventListener('loadedmetadata', () => {
                    setTimeout(tryAutoMatchSubtitle, 300);
                });

                obs.disconnect();
            }
        });

        videoObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function parseTime(timeStr) {
        const parts = timeStr.split(/[:,]/);
        const hh = parseInt(parts[0]) || 0;
        const mm = parseInt(parts[1]) || 0;
        const ss = parseFloat(parts[2]) || 0;
        return hh * 3600 + mm * 60 + ss;
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
