// ==UserScript==
// @name         XavierTTS - 字幕同声传译
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  通过上传SRT文件，使用Web Speech API为视频添加同声传译语音，并可选择音色。欢迎大家使用并提出宝贵意见。
// @author       Xavier
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      CC BY-NC-ND
// @downloadURL https://update.greasyfork.org/scripts/534609/XavierTTS%20-%20%E5%AD%97%E5%B9%95%E5%90%8C%E5%A3%B0%E4%BC%A0%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/534609/XavierTTS%20-%20%E5%AD%97%E5%B9%95%E5%90%8C%E5%A3%B0%E4%BC%A0%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const PRELOAD_COUNT = 10; // 预加载的字幕数量
    const PRELOAD_TRIGGER_INDEX = 5; // 触发下一次预加载的索引（相对于当前批次）
    const DEFAULT_VOICE_FILTER = name => name.startsWith('Microsoft'); // 默认音色过滤器

    // --- 全局变量 ---
    let subtitles = []; // 解析后的字幕数组 { id, startTime, endTime, text, playbackRate }
    let currentSubtitleIndex = -1;
    let voiceCache = {}; // 语音缓存 { subtitleId: SpeechSynthesisUtterance }
    let isShowingSubtitles = false;
    let selectedVoice = null;
    let availableVoices = [];
    let videoElement = null;
    let lastSpokenIndex = -1; // 上次播放语音的索引
    let isWaitingForAudio = false; // 是否因音频播放冲突而暂停视频等待
    let nextSubtitleIndexToPlay = -1; // 等待音频结束后需要播放的字幕索引
    let blockSeekedAutoPlay = false; // 临时阻止 seeked 事件自动播放视频
    let hasUserInteracted = false; // 用户是否已与页面交互
    let voicesInitialized = false; // 音色列表是否已初始化

    // --- DOM 元素 ---
    let container = null;
    let uploadButton = null;
    let showSubtitleCheckbox = null;
    let voiceSelect = null;
    let subtitleDisplay = null;

    // --- Web Speech API ---
    const synth = window.speechSynthesis;
    let voicesLoaded = false;
    let voiceLoadInterval = null;

    // --- 工具函数 ---
    /**
     * 解析SRT文件内容
     * @param {string} srtContent SRT文件文本内容
     * @returns {Array} 解析后的字幕对象数组
     */
    function parseSRT(srtContent) {
        const lines = srtContent.trim().replace(/\r/g, '').split('\n\n'); // 按空行分割字幕块
        const subtitles = [];
        let idCounter = 1;

        for (const block of lines) {
            const blockLines = block.trim().split('\n');
            if (blockLines.length < 2) continue; // 跳过无效块

            // 第一行通常是序号，我们忽略它，直接解析时间码
            let timeLineIndex = -1;
            for(let i = 0; i < blockLines.length; i++) {
                if (blockLines[i].includes('-->')) {
                    timeLineIndex = i;
                    break;
                }
            }

            if (timeLineIndex === -1) continue; // 块中未找到时间码行

            const timeMatch = blockLines[timeLineIndex].match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
            if (!timeMatch) continue; // 时间码格式不匹配

            try {
                const startTime = timeStringToMs(timeMatch[1]);
                const endTime = timeStringToMs(timeMatch[2]);

                // 时间码行之后的所有行都是文本
                const text = blockLines.slice(timeLineIndex + 1).join('\n').trim();

                if (text) { // 确保有文本内容
                    subtitles.push({
                        id: idCounter++,
                        startTime: startTime,
                        endTime: endTime,
                        text: text,
                        playbackRate: 1.0 // 初始化播放速率为 1.0
                    });
                }
            } catch (e) {
                console.error(`Error parsing SRT block: \n${block}\n`, e);
            }
        }

        return subtitles;
    }

    /**
     * 将时间字符串 HH:MM:SS,ms 转换为毫秒
     * @param {string} timeString 时间字符串
     * @returns {number} 毫秒数
     */
    function timeStringToMs(timeString) {
        const parts = timeString.split(/[:,]/);
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(parts[2], 10);
        const milliseconds = parseInt(parts[3], 10);
        return (hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;
    }

    /**
     * 查找当前时间对应的字幕索引
     * @param {number} currentTime 当前视频时间 (ms)
     * @returns {number} 字幕索引，未找到则返回 -1
     */
    function findSubtitleIndex(currentTime) {
        for (let i = 0; i < subtitles.length; i++) {
            if (currentTime >= subtitles[i].startTime && currentTime <= subtitles[i].endTime) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 重置状态
     */
    function resetState() {
        subtitles = [];
        currentSubtitleIndex = -1;
        voiceCache = {};
        isShowingSubtitles = showSubtitleCheckbox.checked;
        selectedVoice = availableVoices.find(v => v.name === voiceSelect.value) || null;
        lastSpokenIndex = -1;
        isWaitingForAudio = false; // 重置等待状态
        nextSubtitleIndexToPlay = -1; // 重置待播放索引
        blockSeekedAutoPlay = false; // 重置 seeked 阻止标志
        hasUserInteracted = false; // 重置用户交互标志
        synth.cancel(); // 取消所有待播放的语音
        // (移除字幕对象 playbackRate 的重置)
        // subtitles.forEach(sub => sub.playbackRate = 1.0); // 不再需要 playbackRate
        if (subtitleDisplay) {
            subtitleDisplay.textContent = '';
        }
        if (videoElement) {
            // 确保视频速率和音量恢复正常（如果之前被修改过）
            if (videoElement.playbackRate !== 1.0) {
                videoElement.playbackRate = 1.0;
            }
            if (videoElement.muted) {
                videoElement.muted = false;
            }
            // 不需要在这里暂停或重置进度，因为这是通用重置，不是文件上传触发的
        }
        console.log("状态已重置");
    }

    // --- 语音合成相关 ---

    /**
     * 获取并过滤可用音色
     */
    function loadVoices() {
        // 如果已初始化，则不再执行
        if (voicesInitialized) {
            console.log("音色已初始化，跳过加载。");
            return;
        }

        availableVoices = synth.getVoices().filter(voice => DEFAULT_VOICE_FILTER(voice.name));
        if (availableVoices.length > 0) {
            voicesLoaded = true; // 标记基础语音已加载
            populateVoiceSelect(); // 填充下拉列表

            let defaultVoiceSet = false;

            // 1. 尝试加载上次选择的音色
            const savedVoiceName = GM_getValue('selectedVoiceName');
            if (savedVoiceName) {
                const savedVoice = availableVoices.find(v => v.name === savedVoiceName);
                if (savedVoice) {
                    selectedVoice = savedVoice;
                    voiceSelect.value = savedVoiceName;
                    defaultVoiceSet = true;
                    console.log("加载已保存音色:", selectedVoice.name);
                }
            }

            // 2. 如果未设置默认音色，尝试查找第一个中文音色
            if (!defaultVoiceSet) {
                const chineseVoice = availableVoices.find(v => v.lang.toLowerCase().startsWith('zh'));
                if (chineseVoice) {
                    selectedVoice = chineseVoice;
                    voiceSelect.value = selectedVoice.name;
                    defaultVoiceSet = true;
                    console.log("默认选择中文音色:", selectedVoice.name);
                }
            }

            // 3. 如果仍未设置默认音色（无保存、无中文），选择列表第一个
            if (!defaultVoiceSet && availableVoices.length > 0) {
                selectedVoice = availableVoices[0];
                voiceSelect.value = selectedVoice.name;
                defaultVoiceSet = true;
                console.log("默认选择第一个可用音色:", selectedVoice.name);
            }

            console.log("音色列表处理完成:", availableVoices);
            voicesInitialized = true; // 标记为已初始化

            // (移除 voiceLoadInterval 相关逻辑)
            // if (voiceLoadInterval) {
            //     clearInterval(voiceLoadInterval);
            //     voiceLoadInterval = null;
            // }
        } else {
            // 初始加载时可能为空，需要等待 voiceschanged 事件
            console.log("首次尝试加载音色列表为空，等待 voiceschanged 事件...");
            // 添加一次性的 voiceschanged 监听器
            synth.addEventListener('voiceschanged', function handleVoicesChangedOnce() {
                 console.log("voiceschanged 事件触发，尝试重新加载音色...");
                 synth.removeEventListener('voiceschanged', handleVoicesChangedOnce); // 移除监听器
                 loadVoices(); // 再次调用 loadVoices
            }, { once: true }); // 使用 once 选项确保只触发一次
        }
    }

    /**
     * 填充音色选择下拉框
     */
    function populateVoiceSelect() {
        voiceSelect.innerHTML = ''; // 清空现有选项
        availableVoices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
        // 恢复选择
        if (selectedVoice) {
            voiceSelect.value = selectedVoice.name;
        }
    }

    /**
     * 预加载指定范围的字幕语音
     * @param {number} startIndex 开始索引
     * @param {number} count 加载数量
     */
    function preloadVoices(startIndex, count) {
        if (!selectedVoice) {
            console.warn("尚未选择音色，无法预加载语音");
            return;
        }
        const endIndex = Math.min(startIndex + count, subtitles.length);
        console.log(`开始预加载语音: 索引 ${startIndex} 到 ${endIndex - 1}`);
        for (let i = startIndex; i < endIndex; i++) {
            const sub = subtitles[i];
            if (!voiceCache[sub.id]) { // 仅当缓存中不存在时才创建
                const utterance = new SpeechSynthesisUtterance(sub.text);
                utterance.voice = selectedVoice;
                utterance.lang = selectedVoice.lang;
                // 注意：此时不调用 synth.speak()，只是创建对象
                voiceCache[sub.id] = utterance;
                // console.log(`已创建 Utterance 缓存: ${sub.id}`);
            }
        }
        console.log(`预加载完成: 索引 ${startIndex} 到 ${endIndex - 1}`);
    }

    /**
     * 播放指定字幕的语音
     * @param {number} index 字幕索引
     */
    function playVoice(index) {
        // 基本检查: 无视频、无效索引、已播放、正在播放其他语音、或视频已暂停
        if (!videoElement || index < 0 || index >= subtitles.length || index === lastSpokenIndex || synth.speaking || videoElement.paused) {
            // console.log(`跳过播放: index=${index}, lastSpoken=${lastSpokenIndex}, speaking=${synth.speaking}, paused=${videoElement?.paused}`);
            return;
        }

        const sub = subtitles[index];
        let utterance = voiceCache[sub.id];

        // 缓存未命中处理
        if (!utterance) {
            console.warn(`缓存未命中，尝试即时创建语音: ${sub.id}`);
            if (!selectedVoice) {
                 console.error("无选定音色，无法创建语音");
                 return;
            }
            utterance = new SpeechSynthesisUtterance(sub.text);
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
            voiceCache[sub.id] = utterance; // 加入缓存
        }

        // --- 播放前准备 ---
        const subtitleDuration = sub.endTime - sub.startTime;
        let estimatedVoiceDuration = utterance._actualDuration; // 优先使用缓存的实际时长

        // 如果没有实际时长，则估算
        if (!estimatedVoiceDuration) {
            estimatedVoiceDuration = estimateSpeechDuration(utterance);
            // console.log(`估算语音时长: ${sub.id} -> ${estimatedVoiceDuration}ms`);
        }

        console.log(`准备播放: ${sub.id} (${index}) - "${sub.text.substring(0, 20)}..."`);
        console.log(`字幕时长: ${subtitleDuration}ms, 语音时长: ${estimatedVoiceDuration}ms (${utterance._actualDuration ? '实际' : '估算'})`);

        // --- 事件处理 ---
        let voiceStartTime = 0; // 用于计算实际时长

        // 清理旧监听器（重要，防止重复添加）
        utterance.onstart = null;
        utterance.onend = null;
        utterance.onerror = null;

        utterance.onstart = () => {
            console.log(`语音开始播放: ${sub.id}`);
            voiceStartTime = performance.now();
            // (移除视频速率调整逻辑)
            // 确保视频音量未被静音 (如果之前被静音过)
            if (videoElement && videoElement.muted) {
                 console.log("确保视频未静音");
                 videoElement.muted = false;
            }
             // 确保视频播放速率为 1.0 (如果之前被修改过)
            if (videoElement && videoElement.playbackRate !== 1.0) {
                console.log("确保视频播放速率为 1.0");
                videoElement.playbackRate = 1.0;
            }
        };

        utterance.onend = () => {
            const voiceEndTime = performance.now();
            const actualVoiceDuration = voiceEndTime - voiceStartTime;

            if (voiceStartTime > 0) { // 确保 onstart 被触发过
                utterance._actualDuration = actualVoiceDuration; // 缓存实际时长
                console.log(`语音播放结束: ${sub.id}, 实际时长: ${actualVoiceDuration.toFixed(0)}ms`);

                // (移除 sub.playbackRate 计算和存储)
            } else {
                console.log(`语音播放结束 (onstart 未触发?): ${sub.id}`);
            }

            // (移除累积时间偏移更新逻辑)

            lastSpokenIndex = index; // 标记为已播放

            // --- 触发下一批预加载 ---
            // 当播放到当前批次的第 PRELOAD_TRIGGER_INDEX 条时 (索引从0开始)
            // 并且下一批的起始索引没有超出字幕总数
            const nextBatchStartIndex = Math.floor(index / PRELOAD_COUNT) * PRELOAD_COUNT + PRELOAD_COUNT;
            if (index % PRELOAD_COUNT === PRELOAD_TRIGGER_INDEX && nextBatchStartIndex < subtitles.length) {
                 console.log(`播放到索引 ${index}，触发预加载下一批: 从 ${nextBatchStartIndex} 开始`);
                 preloadVoices(nextBatchStartIndex, PRELOAD_COUNT);
            }

            // --- 处理等待状态 ---
            if (isWaitingForAudio) {
                console.log(`音频 ${index} 播放完毕，恢复视频并准备播放下一条 ${nextSubtitleIndexToPlay}`);
                isWaitingForAudio = false;
                const nextIndex = nextSubtitleIndexToPlay;
                nextSubtitleIndexToPlay = -1; // 重置

                // 确保视频存在且仍处于暂停状态（防止用户在等待时手动播放）
                if (videoElement && videoElement.paused) {
                    videoElement.play(); // 恢复视频播放
                }

                // 延迟一小段时间再播放下一条语音，给视频一点缓冲时间
                // 否则可能 video.play() 还没生效，就被 playVoice 里的 paused 检查挡住
                setTimeout(() => {
                    if (nextIndex !== -1) {
                         playVoice(nextIndex); // 播放之前被暂缓的字幕语音
                    }
                }, 50); // 50ms 延迟，可以根据需要调整

            }

            // (移除恢复播放状态逻辑)

            // --- 移除预加载逻辑 ---
            // 检查是否需要触发下一批预加载... (移除)
        };

        utterance.onerror = (event) => {
            console.error(`语音合成错误: ${sub.id}`, event.error);
            utterance._actualDuration = undefined; // 清除可能不准的缓存
            // --- 处理等待状态 (错误情况) ---
            if (isWaitingForAudio) {
                 console.warn(`语音 ${index} 播放出错，但仍在等待状态。尝试恢复视频...`);
                 isWaitingForAudio = false;
                 nextSubtitleIndexToPlay = -1; // 清除待播放索引
                 if (videoElement && videoElement.paused) {
                     videoElement.play();
                 }
            }
            lastSpokenIndex = index; // 即使错误也标记，防止卡住
        };

        // (移除音频播放速率设置逻辑)
        utterance.rate = 1.0; // 确保速率始终为 1.0


        // 播放语音
        try {
            synth.cancel(); // 在播放新语音前，取消任何正在播放或排队的语音
            synth.speak(utterance);
        } catch (error) {
            console.error(`synth.speak 错误: ${sub.id}`, error);
             // --- 处理等待状态 (catch 块) ---
            if (isWaitingForAudio) {
                 console.warn(`调用 speak 时出错，但仍在等待状态。尝试恢复视频...`);
                 isWaitingForAudio = false;
                 nextSubtitleIndexToPlay = -1; // 清除待播放索引
                 if (videoElement && videoElement.paused) {
                     videoElement.play();
                 }
            }
            lastSpokenIndex = index; // 即使错误也标记
        }
    }

    /**
     * 估算语音时长 (这是一个非常粗略的估算)
     * @param {SpeechSynthesisUtterance} utterance
     * @returns {number} 毫秒
     */
    function estimateSpeechDuration(utterance) {
        // 估算值，可以根据经验调整
        // 英文大约 15 chars/sec -> 67ms/char
        // 中文大约 4-5 chars/sec -> 200-250ms/char
        // 这里取一个折中偏快的值，避免不必要的减速
        const msPerChar = utterance.lang.startsWith('zh') ? 180 : 75;
        const minDuration = 500; // 至少给 500ms
        const estimated = Math.max(minDuration, utterance.text.length * msPerChar);
        // console.log(`估算时长 (${utterance.lang}): ${utterance.text.length} chars * ${msPerChar}ms/char -> ${estimated.toFixed(0)}ms`);
        return estimated;
    }

    // --- 事件处理 ---

    /**
     * 处理文件上传
     * @param {Event} event
     */
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        resetState(); // 重置状态

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                subtitles = parseSRT(e.target.result);
                console.log(`SRT 文件解析成功，共 ${subtitles.length} 条字幕`);
                if (subtitles.length > 0) {
                    console.log("字幕解析成功，开始查找视频元素并准备播放...");
                    findVideoElement(); // 查找视频元素

                    // 确保 videoElement 已找到后再操作
                    const checkVideoInterval = setInterval(() => {
                        if (videoElement) {
                            clearInterval(checkVideoInterval);
                            console.log("视频元素已找到，暂停并重置进度。视频将保持暂停，等待用户手动播放。");
                            // 标记用户已交互
                            hasUserInteracted = true;
                            videoElement.pause();
                            // 设置标志位，阻止 seeked 事件自动播放
                            blockSeekedAutoPlay = true;
                            videoElement.currentTime = 0;
                            // 稍后重置标志位
                            setTimeout(() => { blockSeekedAutoPlay = false; }, 100); // 延迟时间应足够 seeked 事件触发

                            // 初始预加载第一批语音
                            preloadVoices(0, PRELOAD_COUNT);
                        } else {
                            console.log("仍在等待视频元素...");
                            // 可以添加超时逻辑
                        }
                    }, 200); // 每 200ms 检查一次

                } else {
                    alert("解析成功，但未发现有效字幕条目。");
                }
            } catch (error) {
                console.error("解析 SRT 文件失败:", error);
                alert(`解析 SRT 文件失败: ${error.message}`);
                resetState();
            }
        };
        reader.onerror = (e) => {
            console.error("读取文件失败:", e);
            alert("读取文件失败");
            resetState();
        };
        reader.readAsText(file);

        // 清空文件选择，以便可以再次选择同一个文件
        event.target.value = null;
    }

    /**
     * 处理显示字幕复选框变化
     */
    function handleShowSubtitleChange() {
        isShowingSubtitles = showSubtitleCheckbox.checked;
        if (subtitleDisplay) {
            subtitleDisplay.style.display = isShowingSubtitles ? 'block' : 'none';
            if (!isShowingSubtitles) {
                subtitleDisplay.textContent = ''; // 清空内容
            }
        }
        console.log(`显示字幕: ${isShowingSubtitles}`);
    }

    /**
     * 处理音色选择变化
     */
    function handleVoiceChange() {
        const selectedName = voiceSelect.value;
        selectedVoice = availableVoices.find(v => v.name === selectedName) || null;
        if (selectedVoice) {
            GM_setValue('selectedVoiceName', selectedVoice.name); // 保存选择
            console.log(`音色已选择: ${selectedVoice.name}`);
            // 如果已有字幕，需要重新预加载语音
            if (subtitles.length > 0) {
                console.log("音色已更改，重新预加载语音...");
                voiceCache = {}; // 清空旧缓存
                lastSpokenIndex = -1; // 重置播放状态
                synth.cancel(); // 取消当前语音
                // 音色更改后，重新预加载第一批语音
                preloadVoices(0, PRELOAD_COUNT);
            }
        } else {
            console.warn("选择的音色无效");
        }
    }

    /**
     * 处理音色搜索框输入
     * @param {Event} event
     */
    function handleVoiceSearch(event) {
        const searchTerm = event.target.value.toLowerCase().trim();
        const options = voiceSelect.options;
        let firstVisibleOption = null;

        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const optionText = option.textContent.toLowerCase();
            const matches = optionText.includes(searchTerm);
            option.style.display = matches ? '' : 'none';
            if (matches && !firstVisibleOption) {
                firstVisibleOption = option;
            }
        }

        // 可选：如果当前选中的选项被隐藏了，自动选中第一个可见的选项
        // if (voiceSelect.selectedOptions.length > 0 && voiceSelect.selectedOptions[0].style.display === 'none' && firstVisibleOption) {
        //     voiceSelect.value = firstVisibleOption.value;
        //     // 注意：这里不应该触发 handleVoiceChange，只是更新显示
        // }
        // 简单起见，暂时不自动切换选中项
    }


    /**
     * 处理视频时间更新
     */
    function handleTimeUpdate() {
        // 基本检查: 无视频、无字幕、无音色
        // 注意：即使视频暂停，也可能需要处理音频结束后的逻辑，所以不在这里检查 videoElement.paused
        if (!videoElement || subtitles.length === 0 || !selectedVoice) {
            return;
        }

        // 如果正在等待音频结束，则不处理时间更新 (除非视频被外部暂停了)
        if (isWaitingForAudio && !videoElement.paused) {
            return;
        }
        // 如果是因为等待而暂停，但被外部播放了，取消等待状态
        if (isWaitingForAudio && videoElement.paused === false) {
             console.log("视频在等待期间被外部播放，取消等待状态");
             isWaitingForAudio = false;
             nextSubtitleIndexToPlay = -1;
        }

        const currentTimeMs = videoElement.currentTime * 1000;
        // (移除 adjustedSearchTime 计算)
        const newSubtitleIndex = findSubtitleIndex(currentTimeMs); // 使用原始时间
        // console.log(`TimeUpdate: Current=${currentTimeMs.toFixed(0)}, Index=${newSubtitleIndex}`);


        // 更新字幕显示 (仅在内容变化时更新 DOM)
        if (isShowingSubtitles && subtitleDisplay) {
            const currentText = newSubtitleIndex !== -1 ? subtitles[newSubtitleIndex].text : '';
            if (subtitleDisplay.textContent !== currentText) {
                 subtitleDisplay.textContent = currentText;
            }
        }

        // --- 语音播放逻辑 ---
        if (newSubtitleIndex !== -1) {
            // 找到了当前时间对应的字幕
            // 检查是否是新的、尚未播放过的字幕
            if (newSubtitleIndex > lastSpokenIndex) {
                // 检查是否有语音正在播放 (冲突检测)
                if (synth.speaking) {
                    // 如果正在播放语音，并且视频没有暂停，则暂停视频等待
                    if (!videoElement.paused) {
                        console.log(`语音播放冲突: 正在播放 ${lastSpokenIndex}, 需要播放 ${newSubtitleIndex}。暂停视频等待...`);
                        videoElement.pause();
                        isWaitingForAudio = true;
                        nextSubtitleIndexToPlay = newSubtitleIndex;
                    } else {
                         // 如果视频已经暂停了（可能是用户暂停的），则不强制播放，但记录下需要播放的索引
                         console.log(`语音播放冲突，但视频已暂停。记录待播放索引 ${newSubtitleIndex}`);
                         nextSubtitleIndexToPlay = newSubtitleIndex; // 记录，但不设置 isWaitingForAudio
                    }
                } else {
                    // 没有语音在播放，直接播放新的字幕语音
                    playVoice(newSubtitleIndex);
                }
            }
            // (移除旧注释)
        } else {
            // 当前时间没有对应字幕

            // 如果有正在播放的语音，且当前时间已经超出了该语音对应的字幕范围，则停止它
            // （适用于用户快进跳过字幕的情况）
            // 增加一个检查，确保 lastSpokenIndex 是有效的
            if (synth.speaking && lastSpokenIndex >= 0 && lastSpokenIndex < subtitles.length && currentTimeMs > subtitles[lastSpokenIndex].endTime + 200) { // 加一点缓冲时间
                console.log(`用户可能已跳过字幕 ${lastSpokenIndex}，停止当前语音`);
                synth.cancel();
                // lastSpokenIndex 保持不变或根据需要重置，这里保持不变可能更好
            }
        }

        // 更新当前字幕索引（无论是否播放语音）
        // 只有在索引实际改变时才更新，避免不必要的赋值
        if (currentSubtitleIndex !== newSubtitleIndex) {
             currentSubtitleIndex = newSubtitleIndex;
        }
    }

    /**
     * 处理视频跳转完成事件 (seeked)
     */
    function handleSeeked() {
        if (!videoElement) return;
        console.log(`视频跳转完成 (seeked) 到: ${videoElement.currentTime.toFixed(3)}s`);
        // (移除 accumulatedTimeOffset 重置)
        // 取消当前可能正在播放或排队的语音
        synth.cancel();
        // 重置上次播放索引，允许立即播放跳转后的字幕语音
        lastSpokenIndex = -1;
        // 重置等待状态
        isWaitingForAudio = false;
        nextSubtitleIndexToPlay = -1;
        // 确保视频是播放状态（如果跳转前是暂停的，跳转后应该恢复播放）
        // 增加检查，防止在文件上传重置时自动播放，并确保用户已交互
        if (videoElement && videoElement.paused && !blockSeekedAutoPlay && hasUserInteracted) {
             console.log("Seeked 事件：恢复播放 (用户已交互)");
             videoElement.play().catch(e => console.error("恢复播放失败:", e)); // 添加 catch 以防万一
        } else if (blockSeekedAutoPlay) {
             console.log("Seeked 事件：因 blockSeekedAutoPlay 标志阻止自动播放");
        } else if (!hasUserInteracted) {
             console.log("Seeked 事件：用户尚未交互，不自动播放");
        }
        // 立即触发一次时间更新处理，以显示正确的字幕并准备播放语音
        handleTimeUpdate();
    }

    /**
     * 查找页面上的视频元素
     */
    function findVideoElement() {
        // 尝试常见的 video 标签
        videoElement = document.querySelector('video');
        if (videoElement) {
            console.log("找到视频元素:", videoElement);
            // 移除旧监听器（如果存在）
            videoElement.removeEventListener('timeupdate', handleTimeUpdate);
            videoElement.removeEventListener('seeked', handleSeeked); // 移除旧的 seeked 监听器
            // 添加新监听器
            videoElement.addEventListener('timeupdate', handleTimeUpdate);
            videoElement.addEventListener('seeked', handleSeeked); // 添加 seeked 监听器

            // --- 初始化 UI 位置到视频底部居中 ---
            if (container) {
                try {
                    const videoRect = videoElement.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();
                    const marginBottom = 15; // 距离视频底部的边距 (px)

                    // 计算目标位置 (使用 fixed 定位，相对于视口)
                    let targetTop = videoRect.top + videoRect.height - containerRect.height - marginBottom;
                    let targetLeft = videoRect.left + (videoRect.width / 2) - (containerRect.width / 2);

                    // 简单的边界检查，防止 UI 完全移出屏幕可视区域
                    targetTop = Math.max(5, Math.min(targetTop, window.innerHeight - containerRect.height - 5));
                    targetLeft = Math.max(5, Math.min(targetLeft, window.innerWidth - containerRect.width - 5));

                    console.log(`初始化 UI 位置到视频底部居中: top=${targetTop.toFixed(0)}px, left=${targetLeft.toFixed(0)}px`);

                    // 应用样式
                    container.style.position = 'fixed'; // 确保是 fixed 定位
                    container.style.top = `${targetTop}px`;
                    container.style.left = `${targetLeft}px`;
                    container.style.bottom = 'auto'; // 清除 bottom
                    container.style.right = 'auto'; // 清除 right
                    container.style.transform = 'none'; // 清除 transform (之前用于居中)
                } catch (e) {
                    console.error("设置 UI 初始位置时出错:", e);
                    // 出错时回退到默认位置或不进行操作
                }
            }
            // --- UI 位置初始化结束 ---

        } else {
            console.warn("未找到 <video> 元素，播放同步功能将不可用。");
            // 可以添加更复杂的逻辑来查找特定网站的播放器
        }
    }

    // --- 初始化 ---

    /**
     * 创建并添加 UI 元素
     */
    function createUI() {
        container = document.createElement('div');
        container.id = 'substream-tts-controls';

        // --- 添加拖动功能 ---
        let isDragging = false;
        let offsetX, offsetY;

        container.style.cursor = 'move'; // 添加拖动光标

        container.addEventListener('mousedown', (e) => {
            // 确保只在容器本身上按下鼠标左键时触发拖动
            if (e.target === container && e.button === 0) {
                isDragging = true;
                const rect = container.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;

                // 确保使用 top/left 定位
                container.style.bottom = 'auto';
                container.style.top = `${rect.top}px`;
                container.style.left = `${rect.left}px`;

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
                e.preventDefault(); // 防止拖动时选中文本
            }
        });

        function handleMouseMove(e) {
            if (!isDragging) return;
            const newTop = e.clientY - offsetY;
            const newLeft = e.clientX - offsetX;
            container.style.top = `${newTop}px`;
            container.style.left = `${newLeft}px`;
        }

        function handleMouseUp() {
            if (isDragging) {
                isDragging = false;
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            }
        }
        // --- 拖动功能结束 ---


        // 文件上传按钮
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.srt';
        fileInput.style.display = 'none'; // 隐藏原生输入框
        fileInput.addEventListener('change', handleFileUpload);

        uploadButton = document.createElement('button');
        uploadButton.textContent = '上传 SRT';
        uploadButton.addEventListener('click', () => fileInput.click()); // 点击按钮触发文件选择

        // 显示字幕复选框
        const showSubtitleLabel = document.createElement('label');
        showSubtitleCheckbox = document.createElement('input');
        showSubtitleCheckbox.type = 'checkbox';
        showSubtitleCheckbox.checked = isShowingSubtitles;
        showSubtitleCheckbox.addEventListener('change', handleShowSubtitleChange);
        showSubtitleLabel.appendChild(showSubtitleCheckbox);
        showSubtitleLabel.appendChild(document.createTextNode(' 显示字幕'));

        // --- 音色选择（带搜索） ---
        const voiceSearchContainer = document.createElement('div');
        voiceSearchContainer.style.marginLeft = '15px'; // 与其他控件对齐
        voiceSearchContainer.style.display = 'inline-block'; // 使其水平排列

        const voiceSearchLabel = document.createElement('label');
        voiceSearchLabel.appendChild(document.createTextNode(' 音色: '));

        const voiceSearchInput = document.createElement('input');
        voiceSearchInput.type = 'text';
        voiceSearchInput.placeholder = '搜索音色...';
        voiceSearchInput.style.marginLeft = '5px';
        voiceSearchInput.style.padding = '4px'; // 调整内边距
        voiceSearchInput.style.border = '1px solid #ccc';
        voiceSearchInput.style.borderRadius = '3px';
        voiceSearchInput.addEventListener('input', handleVoiceSearch);

        voiceSelect = document.createElement('select');
        voiceSelect.style.marginLeft = '5px';
        voiceSelect.style.maxWidth = '200px'; // 限制最大宽度
        voiceSelect.addEventListener('change', handleVoiceChange);

        voiceSearchContainer.appendChild(voiceSearchLabel);
        voiceSearchContainer.appendChild(voiceSearchInput);
        voiceSearchContainer.appendChild(voiceSelect);
        // --- 音色选择结束 ---


        // 字幕显示区域
        subtitleDisplay = document.createElement('div');
        subtitleDisplay.id = 'substream-tts-display';
        subtitleDisplay.style.display = isShowingSubtitles ? 'block' : 'none';

        // 添加到容器
        container.appendChild(uploadButton);
        container.appendChild(showSubtitleLabel);
        // container.appendChild(voiceSelectLabel); // 改为添加搜索容器
        container.appendChild(voiceSearchContainer);
        container.appendChild(subtitleDisplay); // 将字幕显示区域添加到容器内部

        // 添加到页面
        document.body.appendChild(container);
        // document.body.appendChild(subtitleDisplay); // 不再单独添加

        // 添加样式
        GM_addStyle(`
            #substream-tts-controls {
                position: fixed;
                /* bottom: 10px; */ /* 改用 top/left 定位 */
                top: calc(100vh - 80px); /* 初始大致位置，拖动后会更新 */
                left: 10px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                cursor: move; /* 添加拖动光标 */
                padding: 10px;
                border-radius: 5px;
                z-index: 9999;
                font-family: sans-serif;
                font-size: 14px;
            }
            #substream-tts-controls label {
                margin-left: 15px;
                cursor: pointer;
            }
            #substream-tts-controls button, #substream-tts-controls select {
                margin-left: 5px;
                padding: 5px;
                border: 1px solid #ccc;
                border-radius: 3px;
            }
            #substream-tts-display {
                /* position: fixed; */ /* 不再需要 fixed 定位 */
                position: absolute; /* 相对于父容器 (controls) 定位 */
                bottom: 100%; /* 定位到父容器顶部 */
                left: 0; /* 与父容器左侧对齐 */
                width: 100%; /* 宽度与父容器一致 */
                /* max-width: 800px; */ /* 最大宽度可能需要调整或移除 */
                margin-bottom: 5px; /* 在字幕和控制面板之间添加一点间距 */
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px; /* 调整内边距 */
                border-radius: 5px;
                /* z-index: 9998; */ /* 不再需要 z-index */
                font-size: 16px; /* 调整字体大小 */
                text-align: center;
                pointer-events: none; /* 允许点击穿透 */
                box-sizing: border-box; /* 确保 padding 不会影响总宽度 */
            }
        `);
    }

    /**
     * 初始化脚本
     */
    function init() {
        console.log("SubStream TTS 初始化...");
        createUI();

        // --- 处理 Web Speech API 音色加载 ---
        // 尝试加载音色
        // loadVoices 函数内部会处理 voiceschanged 事件（如果需要）
        loadVoices();

        // (移除 onvoiceschanged 和 setInterval 逻辑)
        // if (synth.onvoiceschanged !== undefined) { ... }
        // if (!voicesLoaded) { ... }


        // 初始尝试查找视频元素
        findVideoElement();
        // 也可以设置一个延时或MutationObserver来更可靠地查找动态加载的视频
        setTimeout(findVideoElement, 3000); // 3秒后再次尝试

        console.log("SubStream TTS 初始化完成.");
    }

    // --- 脚本入口 ---
    // 延迟执行，等待页面加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
