// ==UserScript==
// @name         YouTube同声传译：字幕文本转语音TTS（适用于沉浸式翻译）
// @namespace    http://tampermonkey.net/
// @version      1.12.2
// @description  将YouTube上的沉浸式翻译双语字幕转换为语音播放，支持更改音色和调整语音速度，支持多语言
// @author       Sean2333
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519266/YouTube%E5%90%8C%E5%A3%B0%E4%BC%A0%E8%AF%91%EF%BC%9A%E5%AD%97%E5%B9%95%E6%96%87%E6%9C%AC%E8%BD%AC%E8%AF%AD%E9%9F%B3TTS%EF%BC%88%E9%80%82%E7%94%A8%E4%BA%8E%E6%B2%89%E6%B5%B8%E5%BC%8F%E7%BF%BB%E8%AF%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/519266/YouTube%E5%90%8C%E5%A3%B0%E4%BC%A0%E8%AF%91%EF%BC%9A%E5%AD%97%E5%B9%95%E6%96%87%E6%9C%AC%E8%BD%AC%E8%AF%AD%E9%9F%B3TTS%EF%BC%88%E9%80%82%E7%94%A8%E4%BA%8E%E6%B2%89%E6%B5%B8%E5%BC%8F%E7%BF%BB%E8%AF%91%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastCaptionText = '';
    const synth = window.speechSynthesis;
    let selectedVoice = null;
    let pendingUtterance = null;
    let isWaitingToSpeak = false;
    let voiceSelectUI = null;
    let isDragging = false;
    let startX;
    let startY;
    let followVideoSpeed = GM_getValue('followVideoSpeed', true);
    let customSpeed = GM_getValue('customSpeed', 1.0);
    let isSpeechEnabled = GM_getValue('isSpeechEnabled', true);
    let speechVolume = GM_getValue('speechVolume', 1.0);
    let isCollapsed = GM_getValue('isCollapsed', false);
    let selectedVoiceName = GM_getValue('selectedVoiceName', null);
    let windowPosX = GM_getValue('windowPosX', null);
    let windowPosY = GM_getValue('windowPosY', null);
    let autoVideoPause = GM_getValue('autoVideoPause', true);
    let currentObserver = null;
    let currentVideoId = null;
    let videoObserver = null;
    let originalPushState = null;
    let originalReplaceState = null;
    let timeoutIds = [];
    let currentUtterance = null;

    function setupShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key.toLowerCase() === 't') {  // 添加 toLowerCase() 以兼容大小写
                const speechToggleCheckbox = document.querySelector('#speechToggleCheckbox');
                if (speechToggleCheckbox) {
                    speechToggleCheckbox.click();
                    console.log('触发TTS开关快捷键');
                } else {
                    console.log('未找到TTS开关元素');
                }
            }
        });
    }

    function loadVoices() {
        return new Promise(function (resolve) {
            let voices = synth.getVoices();
            if (voices.length !== 0) {
                console.log('成功加载语音列表，共', voices.length, '个语音');
                resolve(voices);
            } else {
                console.log('等待语音列表加载...');
                synth.onvoiceschanged = function () {
                    voices = synth.getVoices();
                    console.log('语音列表加载完成，共', voices.length, '个语音');
                    resolve(voices);
                };

                const timeoutId = setTimeout(() => {
                    voices = synth.getVoices();
                    if (voices.length > 0) {
                        console.log('通过重试加载到语音列表，共', voices.length, '个语音');
                        resolve(voices);
                    }
                }, 1000);
                timeoutIds.push(timeoutId);
            }
        });
    }

    function createVoiceSelectUI() {
        function updateDropdownState(isOpen) {
            select.style.display = isOpen ? 'block' : 'none';
            dropdownArrow.textContent = isOpen ? '▲' : '▼';
        }
        const container = document.createElement('div');
        container.className = 'voice-select-container';
        Object.assign(container.style, {
            position: 'fixed',
            top: windowPosY || '10px',
            right: windowPosX || '10px',
            width: '260px',
            background: 'rgba(255, 255, 255, 0.75)',
            padding: '10px',
            border: '1px solid rgba(221, 221, 221, 0.8)',
            borderRadius: '5px',
            zIndex: '9999',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
            userSelect: 'none',
            transition: 'all 0.2s'
        });

        container.addEventListener('mouseenter', () => {
            container.style.background = 'rgba(255, 255, 255, 0.95)';
            container.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        });

        container.addEventListener('mouseleave', () => {
            container.style.background = 'rgba(255, 255, 255, 0.75)';
            container.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.15)';
        });

        const titleBar = document.createElement('div');
        titleBar.className = 'title-bar';
        Object.assign(titleBar.style, {
            padding: '5px',
            marginBottom: '10px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'move'
        });

        const title = document.createElement('span');
        title.textContent = '字幕语音设置';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = isCollapsed ? '+' : '−';
        Object.assign(toggleButton.style, {
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '0 5px'
        });

        const content = document.createElement('div');
        if (isCollapsed) {
            content.style.display = 'none';
        }

        // 语音开关
        const speechToggleDiv = document.createElement('div');
        Object.assign(speechToggleDiv.style, {
            marginBottom: '10px',
            borderBottom: '1px solid #eee',
            paddingBottom: '10px'
        });

        const speechToggleCheckbox = document.createElement('input');
        speechToggleCheckbox.type = 'checkbox';
        speechToggleCheckbox.checked = isSpeechEnabled;
        speechToggleCheckbox.id = 'speechToggleCheckbox';

        const speechToggleLabel = document.createElement('label');
        speechToggleLabel.textContent = '启用语音播放（Alt+T）';
        speechToggleLabel.htmlFor = 'speechToggleCheckbox';
        Object.assign(speechToggleLabel.style, {
            marginLeft: '5px'
        });

        speechToggleCheckbox.onchange = function () {
            isSpeechEnabled = this.checked;
            select.disabled = !isSpeechEnabled;
            testButton.disabled = !isSpeechEnabled;
            followSpeedCheckbox.disabled = !isSpeechEnabled;
            customSpeedSelect.disabled = !isSpeechEnabled || followVideoSpeed;
            volumeSlider.disabled = !isSpeechEnabled;
            autoVideoPauseCheckbox.disabled = !isSpeechEnabled;
            searchInput.disabled = !isSpeechEnabled;

            GM_setValue('isSpeechEnabled', isSpeechEnabled);

            if (!isSpeechEnabled) {
                if (synth.speaking) {
                    synth.cancel();
                }
                if (isWaitingToSpeak) {
                    const video = document.querySelector('video');
                    if (video && video.paused) {
                        video.play();
                    }
                    isWaitingToSpeak = false;
                }
                pendingUtterance = null;

                disconnectObservers();
            } else {
                setupCaptionObserver();
                setupNavigationListeners();
            }

            console.log('语音播放已' + (isSpeechEnabled ? '启用' : '禁用'));
        };

        speechToggleDiv.appendChild(speechToggleCheckbox);
        speechToggleDiv.appendChild(speechToggleLabel);
        content.insertBefore(speechToggleDiv, content.firstChild);

        // 自动暂停视频开关
        const autoVideoPauseDiv = document.createElement('div');
        Object.assign(autoVideoPauseDiv.style, {
            marginBottom: '10px',
            borderBottom: '1px solid #eee',
            paddingBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
        });

        const autoVideoPauseCheckbox = document.createElement('input');
        autoVideoPauseCheckbox.type = 'checkbox';
        autoVideoPauseCheckbox.checked = autoVideoPause;
        autoVideoPauseCheckbox.id = 'autoVideoPauseCheckbox';

        const autoVideoPauseLabel = document.createElement('label');
        autoVideoPauseLabel.textContent = '自动暂停视频，以完整播放语音（推荐开启）';
        autoVideoPauseLabel.htmlFor = 'autoVideoPauseCheckbox';
        Object.assign(autoVideoPauseLabel.style, {
            flex: '1'
        });

        const helpIcon = document.createElement('span');
        helpIcon.textContent = '?';
        Object.assign(helpIcon.style, {
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: '#e0e0e0',
            color: '#666',
            fontSize: '10px',
            cursor: 'help',
            marginLeft: '2px'
        });

        const tooltip = document.createElement('div');
        tooltip.textContent = '开启后，当新字幕出现时，如果上一条语音还未播放完，会自动暂停视频等待语音播放完成。这样可以确保每条字幕都被完整朗读。由于文字转语音存在一定延迟，建议开启此选项以获得最佳体验。';
        Object.assign(tooltip.style, {
            position: 'fixed',
            display: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            width: '220px',
            zIndex: '10000',
            pointerEvents: 'none',
            lineHeight: '1.5',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        });
        helpIcon.appendChild(tooltip);

        helpIcon.addEventListener('mousemove', (e) => {
            tooltip.style.display = 'block';
            const gap = 10;
            let left = e.clientX + gap;
            let top = e.clientY + gap;

            if (left + tooltip.offsetWidth > window.innerWidth) {
                left = e.clientX - tooltip.offsetWidth - gap;
            }

            if (top + tooltip.offsetHeight > window.innerHeight) {
                top = e.clientY - tooltip.offsetHeight - gap;
            }

            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
        });

        helpIcon.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });

        const labelWrapper = document.createElement('div');
        Object.assign(labelWrapper.style, {
            display: 'flex',
            alignItems: 'center',
            flex: '1'
        });

        labelWrapper.appendChild(autoVideoPauseLabel);
        labelWrapper.appendChild(helpIcon);

        autoVideoPauseCheckbox.onchange = function () {
            autoVideoPause = this.checked;
            GM_setValue('autoVideoPause', autoVideoPause);
            console.log('自动暂停视频已' + (autoVideoPause ? '启用' : '禁用'));
        };

        autoVideoPauseDiv.appendChild(autoVideoPauseCheckbox);
        autoVideoPauseDiv.appendChild(labelWrapper);
        content.insertBefore(autoVideoPauseDiv, content.firstChild.nextSibling);

        // 音色选择
        const voiceDiv = document.createElement('div');
        Object.assign(voiceDiv.style, {
            marginBottom: '10px',
            position: 'relative'
        });

        const voiceLabel = document.createElement('div');
        voiceLabel.textContent = '切换音色（支持多语言，与字幕语言匹配即可）：';
        Object.assign(voiceLabel.style, {
            marginBottom: '5px'
        });

        const dropdownContainer = document.createElement('div');
        Object.assign(dropdownContainer.style, {
            position: 'relative',
            width: '100%'
        });

        const inputContainer = document.createElement('div');
        Object.assign(inputContainer.style, {
            position: 'relative',
            width: '100%'
        });

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '搜索或选择音色...';
        Object.assign(searchInput.style, {
            width: '100%',
            padding: '5px 25px 5px 8px',
            marginBottom: '5px',
            borderRadius: '3px',
            boxSizing: 'border-box'
        });

        const dropdownArrow = document.createElement('span');
        dropdownArrow.textContent = '▼';
        Object.assign(dropdownArrow.style, {
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#666',
            fontSize: '12px',
            cursor: 'pointer',
            padding: '5px'
        });

        dropdownArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isSpeechEnabled) {
                return;
            }
            const isOpen = select.style.display === 'none';
            updateDropdownState(isOpen);
        });

        const select = document.createElement('ul');
        Object.assign(select.style, {
            position: 'absolute',
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            borderRadius: '3px',
            backgroundColor: 'white',
            zIndex: '10000',
            listStyle: 'none',
            padding: '0',
            margin: '0',
            display: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        });

        searchInput.addEventListener('click', (e) => {
            e.stopPropagation();
            updateDropdownState(true);
        });

        document.addEventListener('click', () => {
            updateDropdownState(false);
        });

        select.addEventListener('click', (e) => {
            e.stopPropagation();
            const clickedOption = e.target;
            if (clickedOption.tagName === 'LI') {
                const voiceIndex = parseInt(clickedOption.dataset.value);
                if (!isNaN(voiceIndex)) {
                    // 获取当前可用的语音列表
                    const voices = window.speechSynthesis.getVoices();
                    selectedVoice = voices[voiceIndex];
                    selectedVoiceName = selectedVoice.name;
                    searchInput.value = clickedOption.textContent;
                    GM_setValue('selectedVoiceName', selectedVoiceName);
                    updateDropdownState(false);
                }
            }
        });

        searchInput.oninput = function () {
            const searchTerm = this.value.toLowerCase();
            Array.from(select.children).forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
            updateDropdownState(true);
        };

        // 测试音色按钮
        const testButton = document.createElement('button');
        testButton.textContent = '测试音色';
        Object.assign(testButton.style, {
            padding: '5px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
            width: '100%',
            marginTop: '5px'
        });

        // 音量控制
        const volumeControl = document.createElement('div');
        Object.assign(volumeControl.style, {
            marginTop: '10px',
            borderTop: '1px solid #eee',
            paddingTop: '10px'
        });

        const volumeLabel = document.createElement('div');
        volumeLabel.textContent = '音量控制：';
        Object.assign(volumeLabel.style, {
            marginBottom: '5px'
        });

        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.min = '0';
        volumeSlider.max = '1';
        volumeSlider.step = '0.1';
        volumeSlider.value = speechVolume;
        Object.assign(volumeSlider.style, {
            width: '100%',
            margin: '5px 0',
        });

        const volumeValue = document.createElement('span');
        volumeValue.textContent = `${Math.round(speechVolume * 100)}%`;
        Object.assign(volumeValue.style, {
            fontSize: '12px',
            color: '#666',
            marginLeft: '5px'
        });

        volumeSlider.onchange = function () {
            speechVolume = parseFloat(this.value);
            volumeValue.textContent = `${Math.round(speechVolume * 100)}%`;
            GM_setValue('speechVolume', speechVolume);
            console.log('音量已设置为：', speechVolume);
        };

        volumeSlider.oninput = function () {
            volumeValue.textContent = `${Math.round(this.value * 100)}%`;
        };

        volumeControl.appendChild(volumeLabel);
        volumeControl.appendChild(volumeSlider);
        volumeControl.appendChild(volumeValue);

        // 语音速度控制
        const speedControl = document.createElement('div');
        Object.assign(speedControl.style, {
            marginTop: '10px',
            borderTop: '1px solid #eee',
            paddingTop: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        });

        const followSpeedDiv = document.createElement('div');
        Object.assign(followSpeedDiv.style, {
            flex: '1'
        });

        const followSpeedCheckbox = document.createElement('input');
        followSpeedCheckbox.type = 'checkbox';
        followSpeedCheckbox.checked = followVideoSpeed;
        followSpeedCheckbox.id = 'followSpeedCheckbox';

        const followSpeedLabel = document.createElement('label');
        followSpeedLabel.textContent = '跟随视频倍速';
        followSpeedLabel.htmlFor = 'followSpeedCheckbox';
        Object.assign(followSpeedLabel.style, {
            marginLeft: '5px'
        });

        const customSpeedDiv = document.createElement('div');
        Object.assign(customSpeedDiv.style, {
            flex: '1'
        });

        const customSpeedLabel = document.createElement('div');
        customSpeedLabel.textContent = '自定义倍速：';
        Object.assign(customSpeedLabel.style, {
            marginBottom: '5px'
        });

        const customSpeedSelect = document.createElement('select');
        const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
        speedOptions.forEach(speed => {
            const option = document.createElement('option');
            option.value = speed;
            option.textContent = `${speed}x`;
            if (speed === customSpeed) option.selected = true;
            customSpeedSelect.appendChild(option);
        });

        Object.assign(customSpeedSelect.style, {
            width: '100%',
            padding: '5px',
            borderRadius: '3px'
        });

        followSpeedCheckbox.onchange = function () {
            followVideoSpeed = this.checked;
            customSpeedSelect.disabled = this.checked;
            GM_setValue('followVideoSpeed', followVideoSpeed);
            console.log('语音速度模式：', followVideoSpeed ? '跟随视频' : '自定义');
        };

        customSpeedSelect.onchange = function () {
            customSpeed = parseFloat(this.value);
            GM_setValue('customSpeed', customSpeed);
            console.log('自定义语音速度设置为：', customSpeed);
        };


        const testPhrases = {
            'zh': '这是一个中文测试语音',
            'zh-CN': '这是一个中文测试语音',
            'zh-TW': '這是一個中文測試語音',
            'zh-HK': '這是一個中文測試語音',
            'en': 'This is a test voice in English',
            'ja': 'これは日本語のテスト音声です',
            'ko': '이것은 한국어 테스트 음성입니다',
            'fr': 'Ceci est un test vocal en français',
            'de': 'Dies ist eine Testsprache auf Deutsch',
            'es': 'Esta es una voz de prueba en español',
            'it': 'Questa è una voce di prova in italiano',
            'ru': 'Это тестовый голос на русском языке',
            'pt': 'Esta é uma voz de teste em português',
            'default': 'This is a test voice' // 默认测试文本
        };

        testButton.onclick = (e) => {
            e.stopPropagation();
            if (selectedVoice) {
                // 获取语音的基础语言代码（例如 'zh-CN' 转为 'zh'）
                const baseLang = selectedVoice.lang.split('-')[0];
                const fullLang = selectedVoice.lang;

                // 按优先级选择测试文本：完整语言代码 > 基础语言代码 > 默认文本
                const testText = testPhrases[fullLang] || testPhrases[baseLang] || testPhrases['default'];

                console.log(`使用测试文本(${selectedVoice.lang}): ${testText}`);
                speakText(testText, false);
            }
        };

        customSpeedSelect.disabled = followVideoSpeed;

        titleBar.appendChild(title);
        titleBar.appendChild(toggleButton);

        inputContainer.appendChild(searchInput);
        inputContainer.appendChild(dropdownArrow);
        dropdownContainer.appendChild(inputContainer);
        dropdownContainer.appendChild(select);
        dropdownContainer.appendChild(testButton);
        voiceDiv.appendChild(voiceLabel);
        voiceDiv.appendChild(dropdownContainer);

        followSpeedDiv.appendChild(followSpeedCheckbox);
        followSpeedDiv.appendChild(followSpeedLabel);

        customSpeedDiv.appendChild(customSpeedLabel);
        customSpeedDiv.appendChild(customSpeedSelect);

        speedControl.appendChild(followSpeedDiv);
        speedControl.appendChild(customSpeedDiv);

        content.appendChild(voiceDiv);
        content.appendChild(volumeControl);
        content.appendChild(speedControl);

        container.appendChild(titleBar);
        container.appendChild(content);

        if (isCollapsed) {
            container.style.width = 'auto';
            container.style.minWidth = '100px';
        }

        document.body.appendChild(container);

        toggleButton.onclick = (e) => {
            e.stopPropagation();
            isCollapsed = !isCollapsed;

            const currentRight = container.style.right;

            if (isCollapsed) {
                container.dataset.expandedWidth = container.offsetWidth + 'px';
                content.style.display = 'none';
                container.style.width = 'auto';
                container.style.minWidth = '100px';
            } else {
                content.style.display = 'block';
                container.style.width = container.dataset.expandedWidth;
            }

            container.style.right = currentRight;
            toggleButton.textContent = isCollapsed ? '+' : '−';

            GM_setValue('isCollapsed', isCollapsed);
        };

        document.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('mouseleave', dragEnd);

        return { container, select, content };
    }

    function dragStart(e) {
        if (e.target.closest('.title-bar')) {
            isDragging = true;
            const container = e.target.closest('.voice-select-container');

            const rect = container.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;

            container.style.transition = 'none';
        }
    }

    function dragEnd(e) {
        if (isDragging) {
            isDragging = false;
            const container = document.querySelector('.voice-select-container');
            if (container) {
                container.style.transition = 'all 0.2s';

                const rect = container.getBoundingClientRect();
                windowPosX = `${window.innerWidth - rect.right}px`;
                windowPosY = `${rect.top}px`;
                GM_setValue('windowPosX', windowPosX);
                GM_setValue('windowPosY', windowPosY);
                console.log('保存浮窗位置：', windowPosX, windowPosY);
            }
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            const container = document.querySelector('.voice-select-container');
            if (container) {
                let newX = e.clientX - startX;
                let newY = e.clientY - startY;

                const maxX = window.innerWidth - container.offsetWidth;
                const maxY = window.innerHeight - container.offsetHeight;

                newX = Math.min(Math.max(0, newX), maxX);
                newY = Math.min(Math.max(0, newY), maxY);

                container.style.right = `${window.innerWidth - newX - container.offsetWidth}px`;
                container.style.top = `${newY}px`;
                container.style.left = '';
            }
        }
    }

    function selectVoice() {
        loadVoices().then(function (voices) {
            if (!voiceSelectUI) {
                voiceSelectUI = createVoiceSelectUI();
            }

            const select = voiceSelectUI.select;
            const searchInput = voiceSelectUI.container.querySelector('input[type="text"]');
            while (select.firstChild) {
                select.removeChild(select.firstChild);
            }

            voices.forEach((voice, index) => {
                const option = document.createElement('li');
                option.dataset.value = index;
                option.textContent = `${voice.name} (${voice.lang})`;
                Object.assign(option.style, {
                    padding: '8px 10px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee'
                });

                option.addEventListener('mouseover', () => {
                    option.style.backgroundColor = '#f0f0f0';
                });

                option.addEventListener('mouseout', () => {
                    option.style.backgroundColor = '';
                });

                option.addEventListener('click', () => {
                    selectedVoice = voices[index];
                    selectedVoiceName = selectedVoice.name;
                    searchInput.value = option.textContent;
                    GM_setValue('selectedVoiceName', selectedVoiceName);
                    select.style.display = 'none';
                    console.log('已切换语音到：', selectedVoice.name);
                });

                select.appendChild(option);
            });

            // 添加默认选中值设置:
            if (selectedVoice) {
                searchInput.value = `${selectedVoice.name} (${selectedVoice.lang})`;
            }

            if (!selectedVoice) {
                selectedVoice = voices.find(voice =>
                    voice.name === selectedVoiceName
                ) || voices.find(voice =>
                    voice.name === 'Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)'
                ) || voices.find(voice => voice.lang.includes('zh')) || voices[0];
            }

            const selectedIndex = voices.indexOf(selectedVoice);
            if (selectedIndex >= 0) {
                searchInput.value = `${selectedVoice.name} (${selectedVoice.lang})`;
            }
        });
    }

    function speakText(text, isNewCaption = false) {
        if (!isSpeechEnabled || !text) {
            return;
        }

        const video = document.querySelector('video');

        // 准备新的语音合成实例
        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
        }
        utterance.volume = speechVolume;
        if (followVideoSpeed && video) {
            utterance.rate = video.playbackRate;
        } else {
            utterance.rate = customSpeed;
        }

        // 设置语音事件处理
        utterance.onstart = () => {
            currentUtterance = utterance;
            console.log('开始播放语音:', text);
        };

        utterance.onend = () => {
            console.log('语音播放完成');

            // 只有当前播放的语音完成时才清除currentUtterance
            if (currentUtterance === utterance) {
                currentUtterance = null;
            }

            if (pendingUtterance) {
                console.log('播放准备好的语音');
                const nextUtterance = pendingUtterance;
                pendingUtterance = null;
                // 确保下一句话开始播放
                synth.speak(nextUtterance);
            } else if (autoVideoPause && isWaitingToSpeak && video && video.paused) {
                isWaitingToSpeak = false;
                video.play();
                console.log('所有语音播放完成，视频继续播放');
            }
        };

        utterance.onerror = (event) => {
            console.error('语音播放出错:', event);
            // 只有当前播放的语音出错时才清除currentUtterance
            if (currentUtterance === utterance) {
                currentUtterance = null;
            }
            if (autoVideoPause && isWaitingToSpeak && video && video.paused) {
                isWaitingToSpeak = false;
                video.play();
            }
            // 如果出错的是待播放的语音，也需要清除
            if (pendingUtterance === utterance) {
                pendingUtterance = null;
            }
        };

        if (synth.speaking) {
            // 当前有语音在播放，将新语音存为待播放
            console.log('当前正在播放语音，新语音准备完成:', text);

            // 如果已经有待播放的语音，先取消它
            if (pendingUtterance) {
                console.log('更新待播放语音');
                // 可以选择是否保留之前的待播放语音
                // synth.cancel(); // 取消之前的待播放语音
            }

            if (autoVideoPause && !isWaitingToSpeak) {
                // 只在这时暂停视频
                if (video && !video.paused) {
                    video.pause();
                    isWaitingToSpeak = true;
                    console.log('新语音准备完成，视频暂停等待当前语音完成');
                }
            }

            // 更新待播放的语音
            pendingUtterance = utterance;
        } else {
            // 没有语音在播放，直接开始播放
            console.log('直接播放语音');
            synth.speak(utterance);
        }
    }

    function getCaptionText() {
        const immersiveCaptionWindow = document.querySelector('#immersive-translate-caption-window');
        if (immersiveCaptionWindow && immersiveCaptionWindow.shadowRoot) {
            const targetCaptions = immersiveCaptionWindow.shadowRoot.querySelectorAll('.target-cue');
            let captionText = '';
            targetCaptions.forEach(span => {
                captionText += span.textContent + ' ';
            });
            captionText = captionText.trim();
            return captionText;
        }
        return '';
    }

    function setupCaptionObserver() {
        if (!isSpeechEnabled) {
            return;
        }

        let retryCount = 0;
        const maxRetries = 10;

        function waitForCaptionContainer() {
            if (!isSpeechEnabled) {
                return;
            }

            const immersiveCaptionWindow = document.querySelector('#immersive-translate-caption-window');
            if (immersiveCaptionWindow && immersiveCaptionWindow.shadowRoot) {
                const rootContainer = immersiveCaptionWindow.shadowRoot.querySelector('div');
                if (rootContainer) {
                    console.log('找到字幕根容器，开始监听变化');

                    if (currentObserver) {
                        currentObserver.disconnect();
                        console.log('断开旧的字幕观察者连接');
                    }

                    lastCaptionText = '';
                    pendingUtterance = null;
                    if (synth.speaking) {
                        synth.cancel();
                        console.log('取消当前正在播放的语音');
                    }
                    isWaitingToSpeak = false;

                    currentObserver = new MutationObserver(() => {
                        const currentText = getCaptionText();
                        if (currentText && currentText !== lastCaptionText) {
                            lastCaptionText = currentText;
                            speakText(currentText, true);
                        }
                    });

                    const config = {
                        childList: true,
                        subtree: true,
                        characterData: true
                    };

                    currentObserver.observe(rootContainer, config);
                    console.log('新的字幕观察者设置完成');

                    const initialText = getCaptionText();
                    if (initialText) {
                        lastCaptionText = initialText;
                        speakText(initialText, true);
                    }
                } else {
                    if (retryCount < maxRetries) {
                        console.log('未找到字幕容器，1秒后重试');
                        retryCount++;
                        const timeoutId = setTimeout(waitForCaptionContainer, 1000);
                        timeoutIds.push(timeoutId);
                    } else {
                        console.log('达到最大重试次数，放弃寻找字幕容器');
                    }
                }
            } else {
                if (retryCount < maxRetries) {
                    console.log('等待字幕窗口加载，1秒后重试');
                    retryCount++;
                    const timeoutId = setTimeout(waitForCaptionContainer, 1000);
                    timeoutIds.push(timeoutId);
                } else {
                    console.log('达到最大重试次数，放弃寻找字幕窗口');
                }
            }
        }

        waitForCaptionContainer();
    }

    function checkForVideoChange() {
        if (!isSpeechEnabled) {
            return;
        }

        const videoId = new URLSearchParams(window.location.search).get('v');

        if (videoId && videoId !== currentVideoId) {
            console.log('检测到视频切换，从', currentVideoId, '切换到', videoId);
            currentVideoId = videoId;

            if (currentObserver) {
                currentObserver.disconnect();
                console.log('断开旧的字幕观察者连接');
            }
            if (synth.speaking) {
                synth.cancel();
                console.log('取消当前正在播放的语音');
            }

            let retryCount = 0;
            const maxRetries = 10;

            function trySetupObserver() {
                if (!isSpeechEnabled) {
                    return;
                }

                if (retryCount >= maxRetries) {
                    console.log('达到最大重试次数，放弃设置字幕监听');
                    return;
                }

                const immersiveCaptionWindow = document.querySelector('#immersive-translate-caption-window');
                if (immersiveCaptionWindow && immersiveCaptionWindow.shadowRoot) {
                    console.log('找到字幕容器，开始设置监听');
                    setupCaptionObserver();
                } else {
                    console.log(`未找到字幕容器，1秒后重试`);
                    retryCount++;
                    const timeoutId = setTimeout(trySetupObserver, 1000);
                    timeoutIds.push(timeoutId);
                }
            }

            const timeoutId = setTimeout(trySetupObserver, 1500);
            timeoutIds.push(timeoutId);
        }
    }

    function setupNavigationListeners() {
        if (!isSpeechEnabled) {
            return;
        }

        videoObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    checkForVideoChange();
                }
            }
        });

        function observeVideoPlayer() {
            const playerContainer = document.querySelector('#player-container');
            if (playerContainer) {
                videoObserver.observe(playerContainer, {
                    childList: true,
                    subtree: true
                });
            }
        }

        observeVideoPlayer();

        originalPushState = history.pushState;
        history.pushState = function () {
            originalPushState.apply(history, arguments);
            checkForVideoChange();
        };

        originalReplaceState = history.replaceState;
        history.replaceState = function () {
            originalReplaceState.apply(history, arguments);
            checkForVideoChange();
        };

        window.addEventListener('hashchange', checkForVideoChange);
        window.addEventListener('popstate', checkForVideoChange);

        window.addEventListener('yt-navigate-start', onNavigateStart);
        window.addEventListener('yt-navigate-finish', onNavigateFinish);
    }

    function onNavigateStart() {
        if (isSpeechEnabled) {
            console.log('YouTube导航开始');
            checkForVideoChange();
        }
    }

    function onNavigateFinish() {
        if (isSpeechEnabled) {
            console.log('YouTube导航完成');
            checkForVideoChange();
        }
    }

    function disconnectObservers() {
        if (currentObserver) {
            currentObserver.disconnect();
            currentObserver = null;
            console.log('已断开字幕观察者');
        }

        if (videoObserver) {
            videoObserver.disconnect();
            videoObserver = null;
            console.log('已断开视频观察者');
        }

        window.removeEventListener('hashchange', checkForVideoChange);
        window.removeEventListener('popstate', checkForVideoChange);
        window.removeEventListener('yt-navigate-start', onNavigateStart);
        window.removeEventListener('yt-navigate-finish', onNavigateFinish);

        if (originalPushState) {
            history.pushState = originalPushState;
            originalPushState = null;
        }

        if (originalReplaceState) {
            history.replaceState = originalReplaceState;
            originalReplaceState = null;
        }

        timeoutIds.forEach(id => clearTimeout(id));
        timeoutIds = [];
    }

    function cleanup() {
        document.removeEventListener('mousedown', dragStart);
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('mouseleave', dragEnd);

        window.removeEventListener('resize', onWindowResize);

        disconnectObservers();

        if (synth.speaking) {
            synth.cancel();
        }
    }

    function onWindowResize() {
        const container = document.querySelector('.voice-select-container');
        if (container) {
            const rect = container.getBoundingClientRect();
            const maxY = window.innerHeight - container.offsetHeight;

            let newY = Math.min(Math.max(0, rect.top), maxY);
            container.style.top = `${newY}px`;
        }
    }

    window.addEventListener('load', function () {
        console.log('页面加载完成，开始初始化脚本');
        setTimeout(() => {
            selectVoice();
            setupShortcuts();

            if (isSpeechEnabled) {
                setupCaptionObserver();
                setupNavigationListeners();

                currentVideoId = new URLSearchParams(window.location.search).get('v');
                console.log('初始视频ID:', currentVideoId);
            }
        }, 1000);
    });

    window.addEventListener('unload', cleanup);

    window.addEventListener('resize', onWindowResize);

})();