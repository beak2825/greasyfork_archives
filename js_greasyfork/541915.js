// ==UserScript==
// @name         SillyTavern 多角色TTS播放器 (v17.5 · 移动端适配版)
// @namespace    http://tampermonkey.net/
// @version      17.5
// @description  [移动端适配] 1. 新增响应式UI，自动适配手机屏幕。 2. 新增触摸拖动支持。 3. 请在使用前，手动修改脚本顶部的IP地址为PC的局域网IP。
// @author       AI & You
// @match        http://127.0.0.1:8000/*
// @match        http://localhost:8000/*
// @exclude      http://127.0.0.1:9880/*
// @exclude      http://localhost:9880/*
// @exclude      http://127.0.0.1:7860/*
// @exclude      http://localhost:7860/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      127.0.0.1
// @connect      localhost
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/541915/SillyTavern%20%E5%A4%9A%E8%A7%92%E8%89%B2TTS%E6%92%AD%E6%94%BE%E5%99%A8%20%28v175%20%C2%B7%20%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%80%82%E9%85%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541915/SillyTavern%20%E5%A4%9A%E8%A7%92%E8%89%B2TTS%E6%92%AD%E6%94%BE%E5%99%A8%20%28v175%20%C2%B7%20%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%80%82%E9%85%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 用户配置区域 ---
    // 在手机上使用时，必须将下面的 "127.0.0.1" 修改为你电脑的局域网IP地址
    // 例如: const TTS_SERVER_IP = "192.168.1.100";
    const TTS_SERVER_IP = "127.0.0.1";
    const TTS_SERVER_PORT = "9880";
    // --- 配置区域结束 ---

    const TTS_API_ENDPOINT_INFER = `http://${TTS_SERVER_IP}:${TTS_SERVER_PORT}/infer_single`;
    const TTS_API_ENDPOINT_MODELS = `http://${TTS_SERVER_IP}:${TTS_SERVER_PORT}/models`;
    const DO_NOT_PLAY_VALUE = '_DO_NOT_PLAY_';
    const UNGROUPED_KEY = '__UNGROUPED__';
    const DEFAULT_DETECTION_MODE = 'character_and_dialogue';

    let ttsApiVersion = 'v4';
    let detectionMode = DEFAULT_DETECTION_MODE;
    let speedFacter = 1.0;
    let emotion = '默认';
    let narrationVoice = '';
    let dialogueVoice = '';
    let ttsModels = [], characterVoices = {}, defaultVoice = '', allDetectedCharacters = new Set(),
        characterGroups = {}, groupSettings = {}, controlsPosition = null,
        lastMessageParts = [],
        generationQueue = [],
        playbackQueue = [],
        lastPlayedQueue = [],
        isPlaying = false, isPaused = false, currentAudio = null;

    const Settings = {
        load: function() {
            ttsApiVersion = GM_getValue('ttsApiVersion_v16', 'v4');
            detectionMode = GM_getValue('detectionMode_v16_8', DEFAULT_DETECTION_MODE);
            speedFacter = GM_getValue('speedFacter_v16_6', 1.0);
            emotion = GM_getValue('emotion_v16_6', '默认');
            narrationVoice = GM_getValue('narrationVoice_v16_8', '');
            dialogueVoice = GM_getValue('dialogueVoice_v16_8', '');
            characterVoices = GM_getValue('characterVoices_v11', {});
            defaultVoice = GM_getValue('defaultVoice_v11', '');
            const savedChars = GM_getValue('allDetectedCharacters_v11', []);
            allDetectedCharacters = new Set(savedChars);
            characterGroups = GM_getValue('characterGroups_v15', {});
            groupSettings = GM_getValue('groupSettings_v15', { [UNGROUPED_KEY]: { isCollapsed: false } });
            controlsPosition = GM_getValue('controlsPosition_v15_3', null);
        },
        save: function() {
            GM_setValue('ttsApiVersion_v16', ttsApiVersion);
            GM_setValue('detectionMode_v16_8', detectionMode);
            GM_setValue('speedFacter_v16_6', speedFacter);
            GM_setValue('emotion_v16_6', emotion);
            GM_setValue('narrationVoice_v16_8', narrationVoice);
            GM_setValue('dialogueVoice_v16_8', dialogueVoice);
            GM_setValue('characterVoices_v11', characterVoices);
            GM_setValue('defaultVoice_v11', defaultVoice);
            GM_setValue('allDetectedCharacters_v11', Array.from(allDetectedCharacters));
            GM_setValue('characterGroups_v15', characterGroups);
            GM_setValue('groupSettings_v15', groupSettings);
        },
        savePosition: function(pos) {
            GM_setValue('controlsPosition_v15_3', pos);
        }
    };

    function createUI() {
        if (document.getElementById('local-tts-controls-container')) return;
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'local-tts-controls-container';
        if (controlsPosition) {
            controlsContainer.style.top = controlsPosition.top;
            controlsContainer.style.left = controlsPosition.left;
            controlsContainer.style.bottom = 'auto';
            controlsContainer.style.right = 'auto';
        }
        const playButton = document.createElement('button');
        playButton.id = 'tts-play-button'; playButton.textContent = '▶️ 播放';
        playButton.title = '播放/暂停/继续';
        playButton.addEventListener('click', handlePlayPauseResumeClick);
        const replayButton = document.createElement('button');
        replayButton.id = 'tts-replay-button'; replayButton.textContent = '🔄️';
        replayButton.title = '重播上一段'; replayButton.disabled = true;
        replayButton.addEventListener('click', handleReplayClick);
        const stopButton = document.createElement('button');
        stopButton.id = 'tts-stop-button'; stopButton.textContent = '⏹️';
        stopButton.title = '停止播放'; stopButton.style.display = 'none';
        stopButton.addEventListener('click', handleStopClick);
        const settingsButton = document.createElement('button');
        settingsButton.id = 'tts-settings-button'; settingsButton.textContent = '⚙️';
        settingsButton.title = '配置角色语音 (长按拖动)';
        settingsButton.addEventListener('click', toggleSettingsPanel);
        makeDraggable(controlsContainer, settingsButton);
        controlsContainer.appendChild(playButton);
        controlsContainer.appendChild(replayButton);
        controlsContainer.appendChild(stopButton);
        controlsContainer.appendChild(settingsButton);
        document.body.appendChild(controlsContainer);
    }

    function makeDraggable(container, trigger) {
        let isDragging = false;
        let wasDragged = false;
        let longPressTimer;
        let offsetX, offsetY;

        const getCoords = (e) => {
            if (e.touches) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            return { x: e.clientX, y: e.clientY };
        };

        const dragStart = (e) => {
            if (e.type === 'mousedown' && e.button !== 0) return;
            const coords = getCoords(e);
            longPressTimer = setTimeout(() => {
                isDragging = true;
                wasDragged = false;
                container.style.bottom = 'auto';
                container.style.right = 'auto';
                const rect = container.getBoundingClientRect();
                offsetX = coords.x - rect.left;
                offsetY = coords.y - rect.top;
                container.style.cursor = 'move';
                document.body.style.userSelect = 'none';
                document.body.style.webkitUserSelect = 'none';
            }, 500);
        };

        const dragMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            wasDragged = true;
            const coords = getCoords(e);
            let newTop = coords.y - offsetY;
            let newLeft = coords.x - offsetX;
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - containerWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - containerHeight));
            container.style.top = `${newTop}px`;
            container.style.left = `${newLeft}px`;
        };

        const dragEnd = (e) => {
            clearTimeout(longPressTimer);
            if (isDragging) {
                isDragging = false;
                container.style.cursor = 'default';
                document.body.style.userSelect = 'auto';
                document.body.style.webkitUserSelect = 'auto';
                Settings.savePosition({ top: container.style.top, left: container.style.left });
            }
        };

        trigger.addEventListener('mousedown', dragStart);
        trigger.addEventListener('touchstart', dragStart, { passive: true });
        window.addEventListener('mousemove', dragMove);
        window.addEventListener('touchmove', dragMove, { passive: false });
        window.addEventListener('mouseup', dragEnd);
        window.addEventListener('touchend', dragEnd);

        trigger.addEventListener('click', (e) => {
            if (wasDragged) {
                e.preventDefault();
                e.stopImmediatePropagation();
                wasDragged = false;
            }
        }, true);
    }

    function toggleSettingsPanel() {
        const panel = document.getElementById('tts-settings-panel');
        if (panel) { panel.remove(); } else { createSettingsPanel(); }
    }

    function createSettingsPanel() {
        if (document.getElementById('tts-settings-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'tts-settings-panel';
        panel.innerHTML = `<div class="tts-settings-header"><h2>角色语音配置</h2><button id="tts-settings-close" title="关闭">×</button></div>`;

        const apiVersionSection = document.createElement('div');
        apiVersionSection.className = 'tts-settings-section';
        const apiVersionLabel = document.createElement('label');
        apiVersionLabel.textContent = 'TTS API 版本:';
        const apiVersionInput = document.createElement('input');
        apiVersionInput.type = 'text';
        apiVersionInput.className = 'tts-settings-input';
        apiVersionInput.value = ttsApiVersion;
        apiVersionInput.onchange = async (e) => {
            ttsApiVersion = e.target.value.trim();
            Settings.save();
            e.target.disabled = true;
            e.target.value = '正在获取模型...';
            try {
                await fetchTTSModels();
                alert(`成功获取 ${ttsApiVersion} 版本模型列表！`);
            } catch (error) {
                alert(`获取 ${ttsApiVersion} 模型列表失败: ${error.message}`);
                ttsModels = [];
            } finally {
                toggleSettingsPanel();
                toggleSettingsPanel();
            }
        };
        apiVersionSection.appendChild(apiVersionLabel);
        apiVersionSection.appendChild(apiVersionInput);
        panel.appendChild(apiVersionSection);

        const detectionModeSection = document.createElement('div');
        detectionModeSection.className = 'tts-settings-section tts-radio-group';
        detectionModeSection.innerHTML = `
            <label class="tts-radio-group-title">识别模式:</label>
            <div class="tts-radio-options">
                <div class="tts-radio-option-item"><input type="radio" id="mode_char_dialogue" name="detection_mode" value="character_and_dialogue"><label for="mode_char_dialogue">【角色】「对话」</label></div>
                <div class="tts-radio-option-item"><input type="radio" id="mode_narration_dialogue" name="detection_mode" value="narration_and_dialogue"><label for="mode_narration_dialogue">旁白与对话</label></div>
                <div class="tts-radio-option-item"><input type="radio" id="mode_dialogue_only" name="detection_mode" value="dialogue_only"><label for="mode_dialogue_only">仅「对话」</label></div>
                <div class="tts-radio-option-item"><input type="radio" id="mode_entire_message" name="detection_mode" value="entire_message"><label for="mode_entire_message">朗读整段</label></div>
            </div>
        `;
        detectionModeSection.querySelector(`input[value="${detectionMode}"]`).checked = true;
        panel.appendChild(detectionModeSection);

        const narrationDialogueSection = document.createElement('div');
        narrationDialogueSection.id = 'narration-dialogue-settings';
        narrationDialogueSection.className = 'tts-settings-section tts-sub-section';
        const narrationLabel = document.createElement('label'); narrationLabel.textContent = '旁白音色:';
        const narrationSelect = createVoiceSelector('narration-voice-selector', narrationVoice);
        narrationSelect.onchange = (e) => { narrationVoice = e.target.value; Settings.save(); };
        const dialogueLabel = document.createElement('label'); dialogueLabel.textContent = '对话音色:';
        const dialogueSelect = createVoiceSelector('dialogue-voice-selector', dialogueVoice);
        dialogueSelect.onchange = (e) => { dialogueVoice = e.target.value; Settings.save(); };
        narrationDialogueSection.appendChild(narrationLabel);
        narrationDialogueSection.appendChild(narrationSelect);
        narrationDialogueSection.appendChild(dialogueLabel);
        narrationDialogueSection.appendChild(dialogueSelect);
        panel.appendChild(narrationDialogueSection);

        const advancedCollapsible = document.createElement('div');
        advancedCollapsible.className = 'tts-collapsible-wrapper';
        const advancedHeader = document.createElement('div');
        advancedHeader.className = 'tts-collapsible-header';
        advancedHeader.innerHTML = `<span>高级音频设置</span><span class="tts-group-collapse-btn">▼</span>`;
        const advancedContent = document.createElement('div');
        advancedContent.className = 'tts-collapsible-content';
        advancedCollapsible.appendChild(advancedHeader);
        advancedCollapsible.appendChild(advancedContent);
        panel.appendChild(advancedCollapsible);

        const speedSection = document.createElement('div');
        speedSection.className = 'tts-settings-section';
        speedSection.innerHTML = `<label for="tts-speed-slider">全局语速: <span id="tts-speed-value">${parseFloat(speedFacter).toFixed(1)}</span></label>`;
        const speedSlider = document.createElement('input');
        speedSlider.type = 'range'; speedSlider.id = 'tts-speed-slider'; speedSlider.min = '0.5'; speedSlider.max = '2.0'; speedSlider.step = '0.1'; speedSlider.value = speedFacter; speedSlider.style.flexGrow = '1';
        speedSlider.oninput = (e) => { document.getElementById('tts-speed-value').textContent = parseFloat(e.target.value).toFixed(1); };
        speedSlider.onchange = (e) => { speedFacter = parseFloat(e.target.value); Settings.save(); };
        speedSection.appendChild(speedSlider);
        advancedContent.appendChild(speedSection);

        const emotionSection = document.createElement('div');
        emotionSection.className = 'tts-settings-section';
        const emotionLabel = document.createElement('label'); emotionLabel.textContent = '全局情感:';
        const emotionSelect = document.createElement('select');
        ['默认', '开心', '悲伤', '愤怒', '惊讶'].forEach(emo => {
            const option = document.createElement('option'); option.value = emo; option.textContent = emo; emotionSelect.appendChild(option);
        });
        emotionSelect.value = emotion;
        emotionSelect.onchange = (e) => { emotion = e.target.value; Settings.save(); };
        emotionSection.appendChild(emotionLabel);
        emotionSection.appendChild(emotionSelect);
        advancedContent.appendChild(emotionSection);

        const defaultVoiceSection = document.createElement('div');
        defaultVoiceSection.className = 'tts-settings-section';
        const defaultLabel = document.createElement('label'); defaultLabel.textContent = '默认语音:';
        const defaultSelect = createVoiceSelector('default-voice-selector', defaultVoice);
        defaultSelect.onchange = (e) => { defaultVoice = e.target.value; Settings.save(); };
        defaultVoiceSection.appendChild(defaultLabel); defaultVoiceSection.appendChild(defaultSelect);
        panel.appendChild(defaultVoiceSection);

        const charactersContainer = document.createElement('div');
        charactersContainer.id = 'character-settings-container';
        charactersContainer.className = 'tts-characters-container';
        const groupedChars = { [UNGROUPED_KEY]: [] };
        Object.keys(groupSettings).filter(g => g !== UNGROUPED_KEY).forEach(g => groupedChars[g] = []);
        allDetectedCharacters.forEach(char => {
            const group = characterGroups[char] || UNGROUPED_KEY;
            if (!groupedChars[group]) groupedChars[group] = [];
            groupedChars[group].push(char);
        });
        const renderGroup = (groupName, isUngrouped = false) => {
            const charsInGroup = groupedChars[groupName];
            if (!isUngrouped && (!charsInGroup || charsInGroup.length === 0)) return;
            const groupWrapper = document.createElement('div');
            groupWrapper.className = 'tts-group-wrapper';
            const groupHeader = document.createElement('div');
            groupHeader.className = 'tts-group-header';
            const collapseBtn = document.createElement('span');
            collapseBtn.className = 'tts-group-collapse-btn';
            const groupNameSpan = document.createElement('span');
            groupNameSpan.className = 'tts-group-name';
            groupNameSpan.textContent = isUngrouped ? '未分组' : groupName;
            if (!isUngrouped) {
                groupNameSpan.contentEditable = true;
                groupNameSpan.title = '点击修改组名';
                groupNameSpan.onblur = (e) => handleGroupNameChange(groupName, e.currentTarget.textContent);
            }
            groupHeader.appendChild(collapseBtn);
            groupHeader.appendChild(groupNameSpan);
            groupHeader.onclick = (e) => { if(e.target === groupHeader || e.target === collapseBtn) handleToggleCollapse(groupName); };
            const groupContent = document.createElement('div');
            groupContent.className = 'tts-group-content';
            const isCollapsed = groupSettings[groupName]?.isCollapsed ?? (isUngrouped ? false : true);
            if (isCollapsed) groupWrapper.classList.add('collapsed');
            collapseBtn.textContent = isCollapsed ? '▶' : '▼';
            if (charsInGroup) charsInGroup.sort().forEach(char => groupContent.appendChild(createCharacterRow(char, Object.keys(groupedChars))));
            groupWrapper.appendChild(groupHeader);
            groupWrapper.appendChild(groupContent);
            charactersContainer.appendChild(groupWrapper);
        };
        Object.keys(groupedChars).filter(g => g !== UNGROUPED_KEY).sort().forEach(g => renderGroup(g));
        renderGroup(UNGROUPED_KEY, true);
        panel.appendChild(charactersContainer);

        document.body.appendChild(panel);
        document.getElementById('tts-settings-close').addEventListener('click', toggleSettingsPanel);

        const updatePanelVisibility = () => {
            const mode = document.querySelector('input[name="detection_mode"]:checked').value;
            document.getElementById('narration-dialogue-settings').style.display = mode === 'narration_and_dialogue' ? '' : 'none';
            document.getElementById('character-settings-container').style.display = mode === 'character_and_dialogue' ? '' : 'none';
            defaultVoiceSection.style.display = (mode === 'dialogue_only' || mode === 'entire_message') ? '' : 'none';
        };

        detectionModeSection.querySelectorAll('input[name="detection_mode"]').forEach(radio => {
            radio.onchange = (e) => {
                detectionMode = e.target.value;
                Settings.save();
                updatePanelVisibility();
                if(window.chatObserver) window.chatObserver.callback(null, window.chatObserver);
            };
        });

        advancedHeader.onclick = () => {
            advancedCollapsible.classList.toggle('collapsed');
            const btn = advancedHeader.querySelector('.tts-group-collapse-btn');
            btn.textContent = advancedCollapsible.classList.contains('collapsed') ? '▶' : '▼';
        };
        advancedCollapsible.classList.add('collapsed');
        advancedHeader.querySelector('.tts-group-collapse-btn').textContent = '▶';

        updatePanelVisibility();
    }

    function createCharacterRow(char, allGroups) {
        const charRow = document.createElement('div');
        charRow.className = 'tts-character-row';
        const charLabel = document.createElement('label');
        charLabel.textContent = `${char}:`; charLabel.title = char;
        const voiceSelect = createVoiceSelector(`char-voice-${char}`, characterVoices[char] || '');
        voiceSelect.onchange = (e) => {
            if (e.target.value) characterVoices[char] = e.target.value;
            else delete characterVoices[char];
            Settings.save();
        };
        const groupSelect = document.createElement('select');
        groupSelect.className = 'tts-group-select';
        groupSelect.title = '移动到分组';
        allGroups.forEach(gName => {
            const option = document.createElement('option');
            option.value = gName;
            option.textContent = gName === UNGROUPED_KEY ? '未分组' : gName;
            groupSelect.appendChild(option);
        });
        groupSelect.innerHTML += `<option disabled>──────────</option><option value="__NEW_GROUP__">+ 新建分组</option>`;
        groupSelect.value = characterGroups[char] || UNGROUPED_KEY;
        groupSelect.onchange = (e) => handleCharacterGroupChange(char, e.target.value);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'tts-delete-char-btn';
        deleteBtn.title = `删除角色 '${char}'`;
        deleteBtn.onclick = () => handleDeleteCharacter(char);
        charRow.appendChild(charLabel);
        charRow.appendChild(voiceSelect);
        charRow.appendChild(groupSelect);
        charRow.appendChild(deleteBtn);
        return charRow;
    }

    function createVoiceSelector(id, selectedValue) {
        const select = document.createElement('select');
        select.id = id;
        select.innerHTML = `
            <option value="">» 使用默认 «</option>
            <option value="${DO_NOT_PLAY_VALUE}" style="color: #ff9999;">🔇 不播放</option>
            <option disabled>──────────</option>
        `;
        if (ttsModels.length > 0) {
            ttsModels.forEach(modelName => {
                const option = document.createElement('option');
                option.value = modelName; option.textContent = modelName;
                select.appendChild(option);
            });
        }
        select.value = selectedValue;
        return select;
    }

    function handleDeleteCharacter(charToDelete) {
        allDetectedCharacters.delete(charToDelete);
        delete characterVoices[charToDelete];
        delete characterGroups[charToDelete];
        Settings.save();
        toggleSettingsPanel(); toggleSettingsPanel();
    }

    function handleToggleCollapse(groupName) {
        if (!groupSettings[groupName]) groupSettings[groupName] = { isCollapsed: false };
        groupSettings[groupName].isCollapsed = !groupSettings[groupName].isCollapsed;
        Settings.save();
        toggleSettingsPanel(); toggleSettingsPanel();
    }

    function handleGroupNameChange(oldName, newName) {
        newName = newName.trim();
        if (!newName || oldName === newName || groupSettings[newName]) {
            if (groupSettings[newName]) alert('组名已存在！');
            toggleSettingsPanel(); toggleSettingsPanel(); return;
        }
        groupSettings[newName] = { ...groupSettings[oldName] };
        delete groupSettings[oldName];
        Object.keys(characterGroups).forEach(char => {
            if (characterGroups[char] === oldName) characterGroups[char] = newName;
        });
        Settings.save();
        toggleSettingsPanel(); toggleSettingsPanel();
    }

    function handleCharacterGroupChange(char, newGroupValue) {
        if (newGroupValue === '__NEW_GROUP__') {
            const newGroupName = prompt('请输入新的组名:');
            if (newGroupName && newGroupName.trim()) {
                newGroupValue = newGroupName.trim();
                if(groupSettings[newGroupValue]) {
                    alert('组名已存在！');
                    toggleSettingsPanel(); toggleSettingsPanel(); return;
                }
                groupSettings[newGroupValue] = { isCollapsed: false };
            } else {
                toggleSettingsPanel(); toggleSettingsPanel(); return;
            }
        }
        characterGroups[char] = newGroupValue;
        Settings.save();
        toggleSettingsPanel(); toggleSettingsPanel();
    }

    function detectLanguage(text) {
        const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF]/;
        if (japaneseRegex.test(text)) { return "日语"; }
        return "中文";
    }

    async function fetchTTSModels() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST", url: TTS_API_ENDPOINT_MODELS, headers: { "Content-Type": "application/json" }, data: JSON.stringify({ version: ttsApiVersion }),
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        ttsModels = Object.keys(data.models || {});
                        if (ttsModels.length > 0 && !defaultVoice) { defaultVoice = ttsModels[0]; Settings.save(); }
                        resolve();
                    } else { reject(new Error("无法获取模型列表")); }
                },
                onerror: function(error) { reject(error); }
            });
        });
    }

    function observeChat() {
        const validDialogueRegex = /[a-zA-Z0-9\u4e00-\u9fa5\u3040-\u30ff]/;

        const observerCallback = (mutations, observer) => {
             clearTimeout(observer.debounceTimer);
             observer.debounceTimer = setTimeout(() => {
                const messages = document.querySelectorAll('div.mes[is_user="false"]');
                if (messages.length === 0) return;
                const lastMessageElement = messages[messages.length - 1];
                const messageTextElement = lastMessageElement.querySelector('.mes_text');
                if (!messageTextElement) return;

                const fullText = messageTextElement.innerText;
                const currentMessageParts = [];
                let hasNewCharacter = false;

                if (detectionMode === 'character_and_dialogue') {
                    const regex = /【([^】]+)】「([^」]+?)」/g;
                    let match;
                    while ((match = regex.exec(fullText)) !== null) {
                        const character = match[1].trim();
                        const dialogue = match[2].trim();
                        if (dialogue && validDialogueRegex.test(dialogue)) {
                            currentMessageParts.push({ type: 'character_dialogue', character, dialogue });
                            if (character && !allDetectedCharacters.has(character)) {
                                allDetectedCharacters.add(character);
                                characterVoices[character] = DO_NOT_PLAY_VALUE;
                                hasNewCharacter = true;
                            }
                        }
                    }
                } else if (detectionMode === 'narration_and_dialogue') {
                    const segments = fullText.split(/(「[^」]*」)/g);
                    for (const segment of segments) {
                        const trimmedSegment = segment.trim();
                        if (!trimmedSegment) continue;

                        if (trimmedSegment.startsWith('「') && trimmedSegment.endsWith('」')) {
                            const dialogue = trimmedSegment.slice(1, -1).trim();
                            if (dialogue && validDialogueRegex.test(dialogue)) {
                                currentMessageParts.push({ type: 'dialogue', dialogue });
                            }
                        } else {
                             if (validDialogueRegex.test(trimmedSegment)) {
                                currentMessageParts.push({ type: 'narration', dialogue: trimmedSegment });
                            }
                        }
                    }
                } else if (detectionMode === 'dialogue_only') {
                    const regex = /「([^」]+?)」/g;
                    let match;
                     while ((match = regex.exec(fullText)) !== null) {
                        const dialogue = match[1].trim();
                        if (dialogue && validDialogueRegex.test(dialogue)) {
                            currentMessageParts.push({ type: 'dialogue_only', dialogue });
                        }
                    }
                } else if (detectionMode === 'entire_message') {
                    const trimmedText = fullText.trim();
                    if (trimmedText) {
                        currentMessageParts.push({ type: 'entire_message', dialogue: trimmedText });
                    }
                }

                if (hasNewCharacter) {
                    Settings.save();
                    if (document.getElementById('tts-settings-panel')) {
                        toggleSettingsPanel(); toggleSettingsPanel();
                    }
                }

                const playButton = document.getElementById('tts-play-button');
                if (!isPlaying) {
                    lastMessageParts = currentMessageParts;
                    if(playButton) playButton.disabled = currentMessageParts.length === 0;
                }
            }, 300);
        };

        const observer = new MutationObserver(observerCallback);
        observer.callback = observerCallback;
        window.chatObserver = observer;

        const interval = setInterval(() => {
            const chatContainer = document.querySelector('#chat');
            if (chatContainer) {
                observer.observe(chatContainer, { childList: true, subtree: true });
                clearInterval(interval);
                observer.callback(null, observer);
            }
        }, 500);
    }

    function generateAudio(task) {
        return new Promise((resolve, reject) => {
            const lang = detectLanguage(task.dialogue);
            const params = { text: task.dialogue, model_name: task.voice, text_lang: lang, prompt_text_lang: lang, version: ttsApiVersion, dl_url: `http://${TTS_SERVER_IP}:${TTS_SERVER_PORT}`, batch_size: 10, batch_threshold: 0.75, emotion: emotion, fragment_interval: 0.3, if_sr: false, media_type: "wav", parallel_infer: true, repetition_penalty: 1.35, sample_steps: 16, seed: -1, speed_facter: speedFacter, split_bucket: true, temperature: 1, text_split_method: "按标点符号切", top_k: 10, top_p: 1 };
            GM_xmlhttpRequest({
                method: "POST", url: TTS_API_ENDPOINT_INFER, headers: { "Content-Type": "application/json" }, data: JSON.stringify(params),
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.audio_url) { resolve({ url: data.audio_url }); }
                            else { reject(new Error(data.reason || "API未返回audio_url")); }
                        } catch (e) { reject(new Error("无法解析服务器响应")); }
                    } else { reject(new Error(`TTS API 错误: ${response.status} ${response.statusText}`)); }
                },
                onerror: function(error) { reject(new Error("无法连接到TTS服务器")); }
            });
        });
    }

    function playAudio(blobUrl) {
        return new Promise((resolve, reject) => {
            let audioPlayer = document.getElementById('tts-audio-player');
            if (!audioPlayer) {
                audioPlayer = document.createElement('audio');
                audioPlayer.id = 'tts-audio-player'; audioPlayer.style.display = 'none';
                document.body.appendChild(audioPlayer);
            }
            currentAudio = audioPlayer;

            const onEnded = () => {
                cleanup();
                resolve();
            };
            const onError = (e) => {
                cleanup();
                if (isPlaying) {
                   reject(new Error("音频播放失败"));
                } else {
                   resolve();
                }
            };
            const cleanup = () => {
                URL.revokeObjectURL(blobUrl);
                if(currentAudio){
                    currentAudio.removeEventListener('ended', onEnded);
                    currentAudio.removeEventListener('error', onError);
                }
            };

            currentAudio.addEventListener('ended', onEnded);
            currentAudio.addEventListener('error', onError);

            currentAudio.src = blobUrl;
            currentAudio.play().catch(onError);
        });
    }

    function handleReplayClick() {
        if (lastPlayedQueue.length === 0 || isPlaying) return;
        handleStopClick();
        playbackQueue = [...lastPlayedQueue];
        isPlaying = true; isPaused = false;
        document.getElementById('tts-play-button').textContent = '⏸️ 暂停';
        document.getElementById('tts-stop-button').style.display = 'inline-block';
        document.getElementById('tts-replay-button').disabled = true;
        processPlaybackQueue();
    }

    function handlePlayPauseResumeClick() {
        const playButton = document.getElementById('tts-play-button');
        if (isPlaying && !isPaused) {
            isPaused = true; if (currentAudio) currentAudio.pause();
            playButton.textContent = '▶️ 继续'; return;
        }
        if (isPlaying && isPaused) {
            isPaused = false; playButton.textContent = '⏸️ 暂停';
            if (currentAudio) { currentAudio.play().catch(() => {}); } else { processPlaybackQueue(); }
            return;
        }

        if (ttsModels.length === 0) {
            alert("播放失败：无法连接到TTS服务或未找到任何语音模型。\n请确保TTS服务正在运行，然后刷新页面或在设置中重新获取模型。");
            return;
        }

        if (lastMessageParts.length === 0) { alert("未找到符合当前识别模式的文本。"); return; }

        const tasksToGenerate = lastMessageParts.map(part => {
            let voice = '';
            switch(part.type) {
                case 'character_dialogue': voice = characterVoices[part.character] || defaultVoice; break;
                case 'narration': voice = narrationVoice || defaultVoice; break;
                case 'dialogue': voice = dialogueVoice || defaultVoice; break;
                case 'dialogue_only': case 'entire_message': voice = defaultVoice; break;
            }
            if (voice && voice !== DO_NOT_PLAY_VALUE) {
                return { dialogue: part.dialogue, voice: voice };
            }
            return null;
        }).filter(Boolean);

        if (tasksToGenerate.length === 0) { alert("没有需要播放的对话内容（请检查语音配置）。"); return; }

        isPlaying = true; isPaused = false;
        generationQueue = [...tasksToGenerate];
        playbackQueue = [];
        document.getElementById('tts-stop-button').style.display = 'inline-block';
        document.getElementById('tts-replay-button').disabled = true;

        processGenerationQueue();
    }

    async function processGenerationQueue() {
        const playButton = document.getElementById('tts-play-button');
        const totalTasks = generationQueue.length + playbackQueue.length;
        const completedTasks = playbackQueue.length;

        if (!isPlaying) { return; }

        if (generationQueue.length > 0) {
            const task = generationQueue.shift();
            playButton.textContent = `⏳ 生成中 (${completedTasks + 1}/${totalTasks})...`;
            playButton.disabled = true;

            try {
                const result = await generateAudio(task);
                playbackQueue.push(result);
            } catch (error) {
                console.error(`生成失败: ${task.dialogue.substring(0, 20)}...`, error);
            }

            processGenerationQueue();
        } else {
            if (playbackQueue.length === 0) {
                alert('所有对话都生成失败，请检查TTS服务控制台以了解详情。');
                handleStopClick();
                return;
            }

            lastPlayedQueue = [...playbackQueue];
            playButton.disabled = false;
            document.getElementById('tts-replay-button').disabled = false;
            playButton.textContent = '⏸️ 暂停';

            processPlaybackQueue();
        }
    }

    function handleStopClick() {
        isPlaying = false; isPaused = false;
        generationQueue = [];
        playbackQueue = [];
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.src = '';
            currentAudio = null;
        }

        const playButton = document.getElementById('tts-play-button');
        playButton.textContent = '▶️ 播放';
        playButton.disabled = lastMessageParts.length === 0;
        document.getElementById('tts-stop-button').style.display = 'none';
        document.getElementById('tts-replay-button').disabled = lastPlayedQueue.length === 0;
    }

    async function processPlaybackQueue() {
        if (isPaused) return;
        if (playbackQueue.length === 0 || !isPlaying) {
            if (isPlaying) handleStopClick();
            return;
        }

        const task = playbackQueue.shift();

        try {
            const blobUrl = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: task.url,
                    responseType: 'blob',
                    onload: function(response) {
                        if (response.status === 200) {
                            const blob = response.response;
                            resolve(URL.createObjectURL(blob));
                        } else {
                            reject(new Error(`HTTP error! status: ${response.status}`));
                        }
                    },
                    onerror: function() {
                        reject(new Error('网络请求失败'));
                    }
                });
            });

            await playAudio(blobUrl);

            if(!isPaused) {
                processPlaybackQueue();
            }
        } catch (error) {
            if (isPlaying) {
                alert(`播放失败: ${error.message}`);
                handleStopClick();
            }
        }
    }

    GM_addStyle(`
        #local-tts-controls-container { position: fixed; bottom: 50px; right: 20px; z-index: 9999; display: flex; gap: 8px; align-items: center; }
        #local-tts-controls-container button { background-color: #2c2f33; color: white; border: 1px solid #4f545c; padding: 8px 12px; border-radius: 20px; cursor: pointer; font-size: 16px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); transition: all 0.2s ease; min-width: 40px; }
        #tts-play-button { padding: 8px 15px; min-width: 100px; text-align: center; }
        #local-tts-controls-container button:hover { background-color: #4f545c; }
        #local-tts-controls-container button:disabled { background-color: #72767d; cursor: not-allowed; opacity: 0.7; }

        #tts-settings-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 640px; background-color: #2c2f33; color: #f0f0f0; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.5); z-index: 10000; padding: 25px; border: 1px solid #4f545c; display: flex; flex-direction: column; max-height: 85vh; }
        .tts-settings-header { flex-shrink: 0; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #40444b; }
        .tts-settings-header h2 { margin: 0; font-size: 1.3em; }
        #tts-settings-close { background: none; border: none; color: #aaa; font-size: 28px; cursor: pointer; padding: 0 10px; transition: color 0.2s; }
        #tts-settings-close:hover { color: #fff; }

        .tts-settings-section { flex-shrink: 0; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #40444b; display: flex; align-items: center; gap: 15px; flex-wrap: wrap; }
        .tts-settings-section:last-of-type { border-bottom: none; margin-bottom: 10px; }
        .tts-settings-section label { white-space: nowrap; font-weight: 500; color: #ddd; }
        .tts-settings-section select, .tts-settings-input { flex-grow: 1; background-color: #202225; color: white; border: 1px solid #555; border-radius: 6px; padding: 10px; font-size: 14px; transition: all 0.2s ease; min-width: 150px; }
        .tts-settings-section select:focus, .tts-settings-input:focus { border-color: #7289da; box-shadow: 0 0 0 3px rgba(114, 137, 218, 0.25); outline: none; }

        .tts-radio-group-title { flex-basis: 100%; margin-bottom: 5px; }
        .tts-radio-options { display: flex; flex-wrap: wrap; gap: 10px 20px; width: 100%; }
        .tts-radio-option-item { display: flex; align-items: center; }
        .tts-radio-option-item label { font-weight: normal; cursor: pointer; }
        .tts-radio-option-item input[type="radio"] { cursor: pointer; margin-right: 8px; accent-color: #7289da; }

        .tts-sub-section { border-bottom: none; padding-bottom: 0; }
        #narration-dialogue-settings { gap: 10px 15px; }
        #narration-dialogue-settings label { flex-shrink: 0; }
        #narration-dialogue-settings select { flex: 1; }

        .tts-collapsible-wrapper { flex-shrink: 0; margin-bottom: 18px; border-bottom: 1px solid #40444b; }
        .tts-collapsible-wrapper.collapsed .tts-collapsible-content { display: none; }
        .tts-collapsible-header { cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding-bottom: 18px; }
        .tts-collapsible-header span { font-weight: 500; color: #ddd; }
        .tts-collapsible-header .tts-group-collapse-btn { transition: transform 0.2s; }
        .tts-collapsible-wrapper.collapsed .tts-collapsible-header .tts-group-collapse-btn { transform: rotate(-90deg); }
        .tts-collapsible-content .tts-settings-section { border-bottom: none; padding-bottom: 18px; margin-bottom: 0; }

        #tts-speed-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; background: #4f545c; border-radius: 4px; outline: none; transition: opacity .2s; }
        #tts-speed-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; background: #7289da; cursor: pointer; border-radius: 50%; border: 2px solid #fff; }
        #tts-speed-slider::-moz-range-thumb { width: 18px; height: 18px; background: #7289da; cursor: pointer; border-radius: 50%; border: 2px solid #fff; }

        .tts-characters-container { flex-grow: 1; overflow-y: auto; padding: 10px 10px 0 0; min-height: 200px; }
        .tts-group-wrapper { margin-bottom: 12px; border: 1px solid #40444b; border-radius: 8px; background-color: #36393f; }
        .tts-group-wrapper.collapsed .tts-group-content { display: none; }
        .tts-group-header { background-color: #3a3d42; padding: 10px 15px; cursor: pointer; display: flex; align-items: center; border-radius: 7px 7px 0 0; }
        .tts-group-collapse-btn { margin-right: 10px; font-family: monospace; user-select: none; font-size: 1.2em; transition: transform 0.2s; }
        .tts-group-wrapper.collapsed .tts-group-collapse-btn { transform: rotate(-90deg); }
        .tts-group-name { font-weight: bold; flex-grow: 1; color: #fff; }
        .tts-group-name[contenteditable="true"] { outline: none; border-bottom: 1px dashed #72767d; }
        .tts-group-name[contenteditable="true"]:focus { border-bottom: 1px solid #fff; }
        .tts-group-content { padding: 15px; }

        .tts-character-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
        .tts-character-row:last-child { margin-bottom: 0; }
        .tts-character-row label { flex: 1 1 30%; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #ccc; }
        .tts-character-row select { flex: 1 1 50%; }
        .tts-group-select { flex: 0 1 120px; }
        .tts-delete-char-btn { background: none; border: none; color: #ff8a8a; cursor: pointer; font-size: 20px; padding: 0 5px; flex-shrink: 0; transition: all 0.2s; }
        .tts-delete-char-btn:hover { color: #ff4d4d; transform: scale(1.1); }

        @media (max-width: 768px) {
            #local-tts-controls-container { bottom: 20px; right: 10px; }
            #tts-settings-panel { width: 95vw; max-height: 90vh; padding: 15px; }
            .tts-settings-header h2 { font-size: 1.1em; }
            .tts-settings-section { gap: 10px; }
            .tts-radio-options { gap: 8px 15px; }
            #narration-dialogue-settings { flex-direction: column; align-items: stretch; }
            #narration-dialogue-settings label { margin-bottom: -5px; }
            .tts-character-row { gap: 8px; }
            .tts-character-row label { flex-basis: 100%; text-align: left; margin-bottom: 5px; }
            .tts-character-row select:first-of-type { flex-basis: 100%; }
            .tts-group-select { flex-grow: 1; }
            .tts-delete-char-btn { flex-grow: 0; }
        }
    `);

    window.addEventListener('load', async () => {
        Settings.load();
        try {
            await fetchTTSModels();
        }
        catch (error) {
            console.error("初始化失败：无法从TTS服务器加载模型列表。该错误不会弹窗，将在您点击播放时提示。", error);
        }
        createUI();
        observeChat();
    });

})();