// ==UserScript==
// @name         AutoNektome
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Автоматический переход с настройками звука, голосовым управлением, улучшенной автогромкостью, изменением голоса и выбором тем для nekto.me audiochat
// @author       @paracosm17
// @match        https://nekto.me/audiochat
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498724/AutoNektome.user.js
// @updateURL https://update.greasyfork.org/scripts/498724/AutoNektome.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ### Настройка звуков уведомлений
    const START_CONVERSATION_SOUND_URL = 'https://zvukogram.com/mp3/22/skype-sound-message-received-message-received.mp3'; // Ссылка на звук начала разговора
    const END_CONVERSATION_SOUND_URL = 'https://www.myinstants.com/media/sounds/teleport1_Cw1ot9l.mp3'; // Ссылка на звук окончания разговора
    const START_SOUND_VOLUME = 0.4; // Громкость звука начала разговора (0.0 - 1.0)
    const END_SOUND_VOLUME = 0.3; // Громкость звука окончания разговора (0.0 - 1.0)

    // ### Настройка голосовых команд
    const VOICE_COMMANDS = {
        skip: ['скип', 'skip', 'скиф', 'скипнуть', 'кефир'],
        stop: ['завершить', 'остановить', 'закончить', 'кумыс'],
        start: ['чат']
    };

    // ### Настройки автогромкости собеседника
    const TARGET_VOLUME = 50; // Целевая громкость звука в процентах (0-100), к которой стремится автогромкость
    const MIN_VOLUME = 10; // Минимально допустимая громкость в процентах (0-100), ниже которой автогромкость не опустит звук
    const MAX_VOLUME = 90; // Максимально допустимая громкость в процентах (0-100), выше которой автогромкость не поднимет звук
    const TRANSITION_DURATION = 1000; // Длительность плавного перехода громкости в миллисекундах (1000 мс = 1 секунда)
    const VOLUME_CHECK_INTERVAL = 200; // Интервал проверки громкости в миллисекундах (как часто анализируется уровень звука)
    const HOLD_DURATION = 5000; // Время удержания текущей громкости в миллисекундах после громкого звука (5000 мс = 5 секунд)
    const SILENCE_THRESHOLD = 5; // Порог тишины в процентах (0-100), ниже которого звук считается слишком тихим
    const HISTORY_SIZE = 15; // Размер истории измерений громкости (количество последних значений для усреднения)

    // ### Темы
    const THEMES = {
        'Original': null,
        'Dracula': 'https://raw.githubusercontent.com/paracosm17/AutoNektome/refs/heads/main/dracula.css',
        'GitHub Dark': 'https://raw.githubusercontent.com/paracosm17/AutoNektome/refs/heads/main/githubdark.css',
        'One Dark': 'https://raw.githubusercontent.com/paracosm17/AutoNektome/refs/heads/main/onedark.css',
        'Monokai': 'https://raw.githubusercontent.com/paracosm17/AutoNektome/refs/heads/main/monokai.css',
        'Nord': 'https://raw.githubusercontent.com/paracosm17/AutoNektome/refs/heads/main/nord.css'
    };

    // ### Настройки из localStorage
    const settings = {
        enableLoopback: loadSetting('enableLoopback', false),
        autoGainControl: loadSetting('autoGainControl', false),
        noiseSuppression: loadSetting('noiseSuppression', true),
        echoCancellation: loadSetting('echoCancellation', false),
        gainValue: loadSetting('gainValue', 1.5, parseFloat),
        voiceControl: loadSetting('voiceControl', false),
        autoVolume: loadSetting('autoVolume', true),
        voicePitch: loadSetting('voicePitch', false),
        pitchLevel: loadSetting('pitchLevel', 0, parseFloat),
        conversationCount: loadSetting('conversationCount', 0, parseInt),
        conversationStats: loadSetting('conversationStats', {
            over5min: 0,
            over15min: 0,
            over30min: 0,
            over1hour: 0,
            over2hours: 0,
            over3hours: 0,
            over5hours: 0
        }),
        selectedTheme: loadSetting('selectedTheme', 'Original')
    };

    // ### Переменные состояния
    let isAutoModeEnabled = true;
    let isVoiceControlEnabled = settings.voiceControl;
    let observer = null;
    let globalStream = null;
    let audioContext = null;
    let gainNode = null;
    let micStream = null;
    let recognition = null;
    let voiceHintElement = null;
    let remoteAudioContext = null;
    let volumeAnalyser = null;
    let volumeCheckIntervalId = null;
    let lastLoudTime = 0;
    let volumeHistory = [];
    let lastAdjustedVolume = TARGET_VOLUME;
    let pitchNode = null;
    let pitchAudioContext = null;
    let pitchSource = null;
    let pitchWorkletNode = null;
    let conversationTimer = null;
    let currentConversationStart = null;
    let isConversationActive = false;
    let isMicMuted = false;
    let isHeadphonesMuted = false;
    let currentThemeLink = null;

    // ### Утилиты
    const endConversationAudio = new Audio(END_CONVERSATION_SOUND_URL);
    endConversationAudio.volume = END_SOUND_VOLUME;
    const startConversationAudio = new Audio(START_CONVERSATION_SOUND_URL);
    startConversationAudio.volume = START_SOUND_VOLUME;

    // Блокировка звука connect.mp3 через MutationObserver
    const blockConnectSound = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    const audioElements = document.querySelectorAll('audio');
                    audioElements.forEach(audio => {
                        if (audio.src.includes('connect.mp3') && !audio.dataset.custom) {
                            audio.src = '';
                            audio.muted = true;
                            audio.pause();
                            audio.removeAttribute('preload');
                            audio.setAttribute('data-blocked', 'true');
                            console.log('Звук connect.mp3 заблокирован');
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Запускаем блокировку сразу
    blockConnectSound();
    const originalPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function() {
        if (this.src.includes('connect.mp3') && !this.dataset.custom) {
            console.log('Попытка воспроизведения connect.mp3 заблокирована');
            return Promise.resolve();
        }
        return originalPlay.apply(this, arguments);
    };

    function loadSetting(key, defaultValue, transform = JSON.parse) {
        const value = localStorage.getItem(key);
        return value !== null ? transform(value) : defaultValue;
    }

    function saveSetting(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // ### Управление темами
    function applyTheme(themeName) {
        if (currentThemeLink) {
            currentThemeLink.remove();
            currentThemeLink = null;
        }

        const loadingIndicator = document.querySelector('#settings-container select + span + span');
        if (loadingIndicator) loadingIndicator.style.display = 'block';

        if (themeName !== 'Original' && THEMES[themeName]) {
            const styleElement = document.createElement('style');
            styleElement.id = 'custom-theme-style';

            fetch(THEMES[themeName])
                .then(response => {
                    if (!response.ok) throw new Error('Ошибка загрузки CSS');
                    return response.text();
                })
                .then(css => {
                    styleElement.textContent = css;
                    document.head.appendChild(styleElement);
                    currentThemeLink = styleElement;
                    if (loadingIndicator) loadingIndicator.style.display = 'none';
                })
                .catch(error => {
                    console.error('Ошибка при загрузке темы:', error);
                    if (loadingIndicator) loadingIndicator.style.display = 'none';
                });
        } else if (themeName === 'Original') {
            const existingStyles = document.querySelectorAll('style[id="custom-theme-style"]');
            existingStyles.forEach(style => style.remove());
            currentThemeLink = null;
            if (loadingIndicator) loadingIndicator.style.display = 'none';
        }

        settings.selectedTheme = themeName;
        saveSetting('selectedTheme', themeName);
    }

    function createThemeSelector() {
        const themeContainer = document.createElement('div');
        themeContainer.style.marginTop = '20px';

        const themeLabel = document.createElement('span');
        themeLabel.textContent = 'Тема оформления';
        themeLabel.style.fontSize = '14px';
        themeLabel.style.color = '#fff';
        themeLabel.style.fontWeight = 'bold';
        themeLabel.style.textShadow = '0 0 3px rgba(255,255,255,0.5)';
        themeLabel.style.display = 'block';
        themeLabel.style.marginBottom = '8px';

        const selectWrapper = document.createElement('div');
        selectWrapper.style.position = 'relative';
        selectWrapper.style.width = '100%';

        const select = document.createElement('select');
        select.style.width = '100%';
        select.style.padding = '8px 25px 8px 10px';
        select.style.background = '#2b2b2b';
        select.style.color = '#fff';
        select.style.border = '1px solid #ff007a';
        select.style.borderRadius = '8px';
        select.style.fontSize = '14px';
        select.style.cursor = 'pointer';
        select.style.appearance = 'none';
        select.style.outline = 'none';
        select.style.transition = 'border-color 0.3s ease';

        for (const themeName in THEMES) {
            const option = document.createElement('option');
            option.value = themeName;
            option.textContent = themeName;
            if (themeName === settings.selectedTheme) {
                option.selected = true;
            }
            select.appendChild(option);
        }

        const arrow = document.createElement('span');
        arrow.textContent = '▼';
        arrow.style.position = 'absolute';
        arrow.style.right = '10px';
        arrow.style.top = '50%';
        arrow.style.transform = 'translateY(-50%)';
        arrow.style.color = '#ff007a';
        arrow.style.pointerEvents = 'none';

        selectWrapper.appendChild(select);
        selectWrapper.appendChild(arrow);
        themeContainer.appendChild(themeLabel);
        themeContainer.appendChild(selectWrapper);

        select.addEventListener('change', (e) => {
            const selectedTheme = e.target.value;
            applyTheme(selectedTheme);
        });

        select.addEventListener('mouseover', () => {
            select.style.borderColor = '#00ff9d';
        });
        select.addEventListener('mouseout', () => {
            select.style.borderColor = '#ff007a';
        });

        return themeContainer;
    }

    // ### AudioWorklet процессор для pitch shifting
    const pitchShiftWorkletCode = `
        class PitchShiftProcessor extends AudioWorkletProcessor {
            constructor() {
                super();
                this.bufferSize = 4096;
                this.buffer = new Float32Array(this.bufferSize);
                this.writeIndex = 0;
                this.readIndex = 0;
                this.pitchFactor = 1.0;
                this.port.onmessage = (event) => {
                    this.pitchFactor = event.data;
                };
            }

            process(inputs, outputs, parameters) {
                const input = inputs[0][0];
                const output = outputs[0][0];

                if (!input || !output) return true;

                for (let i = 0; i < input.length; i++) {
                    this.buffer[this.writeIndex] = input[i];
                    this.writeIndex = (this.writeIndex + 1) % this.bufferSize;
                }

                for (let i = 0; i < output.length; i++) {
                    const intIndex = Math.floor(this.readIndex);
                    const frac = this.readIndex - intIndex;
                    const sample1 = this.buffer[intIndex % this.bufferSize];
                    const sample2 = this.buffer[(intIndex + 1) % this.bufferSize];
                    output[i] = sample1 + (sample2 - sample1) * frac;
                    this.readIndex = (this.readIndex + this.pitchFactor) % this.bufferSize;
                }

                return true;
            }
        }

        registerProcessor('pitch-shift-processor', PitchShiftProcessor);
    `;

    // ### Функции авторежима
    function checkAndClickButton() {
        if (!isAutoModeEnabled) return;

        // Новый интерфейс: экран после завершения разговора
        const finishedScreen = document.querySelector('.callScreen.callFinished');
        let button = null;
        if (finishedScreen) {
            button = finishedScreen.querySelector('button.callScreen__findBtn.btn.green.filled');
        }

        // Старый интерфейс — на всякий случай оставляем
        if (!button) {
            button = document.querySelector('button.btn.btn-lg.go-scan-button');
        }

        if (button) {
            button.click();
        }
    }

    function skipConversation() {
        // Новый интерфейс
        let stopButton = document.querySelector('button.callScreen__cancelCallBtn.btn.danger2.cancelCallBtnNoMess');

        // Старый интерфейс — fallback
        if (!stopButton) {
            stopButton = document.querySelector('button.btn.btn-lg.stop-talk-button');
        }

        if (stopButton) {
            stopButton.click();

            setTimeout(() => {
                const confirmButton = document.querySelector('button.swal2-confirm.swal2-styled');
                if (confirmButton) {
                    // Если по-прежнему есть подтверждение через SweetAlert
                    confirmButton.click();
                    playNotificationOnEnd();
                } else {
                    // Если подтверждения нет — просто считаем разговор завершённым
                    playNotificationOnEnd();
                }
            }, 500);
        }
    }

    function playNotificationOnEnd() {
        if (isConversationActive) {
            endConversationAudio.play();
            isConversationActive = false;
        }
    }

    function playNotificationOnStart() {
        if (!isConversationActive) {
            startConversationAudio.dataset.custom = 'true'; // Помечаем как кастомный звук
            startConversationAudio.play();
            isConversationActive = true;
        }
    }

    function updateSliderStyles(enable) {
        const slider = document.querySelector('.slider');
        const sliderCircle = document.querySelector('.slider-circle');
        if (slider) slider.style.background = enable ? '#00ff9d' : '#555';
        if (sliderCircle) sliderCircle.style.left = enable ? '40px' : '4px';
    }

    function applyCustomStyles(enable) {
        const styleId = 'custom-slider-styles';
        let styleElement = document.getElementById(styleId);
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = `
            .slider { background: ${enable ? '#00ff9d' : '#555'} !important; transition: background 0.4s !important; }
            .slider-circle { left: ${enable ? '40px' : '4px'} !important; }
        `;
    }

    function toggleAutoMode(enable) {
        isAutoModeEnabled = enable;
        const toggleInput = document.querySelector('input[type="checkbox"]');
        const toggleLabel = document.querySelector('span.toggle-label');
        if (toggleInput) toggleInput.checked = enable;
        if (toggleLabel) {
            toggleLabel.textContent = `Авторежим ${enable ? 'ВКЛ' : 'ВЫКЛ'}`;
            toggleLabel.style.color = enable ? '#00ff9d' : '#ff4d4d';
            toggleLabel.style.textShadow = `0 0 5px ${enable ? '#00ff9d' : '#ff4d4d'}`;
        }
        updateSliderStyles(enable);
        applyCustomStyles(enable);
    }

    // ### Аудио функции
    async function getMicStream() {
        try {
            micStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    autoGainControl: settings.autoGainControl,
                    noiseSuppression: settings.noiseSuppression,
                    echoCancellation: settings.echoCancellation
                }
            });
            return micStream;
        } catch (e) {
            console.error('Ошибка получения микрофона:', e);
            return null;
        }
    }

    function enableSelfListening(stream) {
        if (!stream || !stream.getAudioTracks().length) return;
        if (audioContext) audioContext.close();
        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        gainNode = audioContext.createGain();
        gainNode.gain.value = settings.gainValue;

        if (settings.voicePitch && settings.pitchLevel > 0) {
            pitchNode = audioContext.createBiquadFilter();
            pitchNode.type = 'lowshelf';
            pitchNode.frequency.value = 300;
            pitchNode.gain.value = 10;
            source.connect(pitchNode);
            pitchNode.connect(gainNode);
        } else {
            source.connect(gainNode);
        }

        gainNode.connect(audioContext.destination);
    }

    async function createPitchShiftedStream(stream) {
        if (pitchAudioContext) pitchAudioContext.close();
        pitchAudioContext = new AudioContext();
        pitchSource = pitchAudioContext.createMediaStreamSource(stream);
        const outputNode = pitchAudioContext.createGain();

        if (settings.voicePitch && settings.pitchLevel > 0) {
            const blob = new Blob([pitchShiftWorkletCode], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            await pitchAudioContext.audioWorklet.addModule(url);

            pitchWorkletNode = new AudioWorkletNode(pitchAudioContext, 'pitch-shift-processor');
            const pitchShiftFactor = 1.0 - settings.pitchLevel;
            pitchWorkletNode.port.postMessage(pitchShiftFactor);

            pitchNode = pitchAudioContext.createBiquadFilter();
            pitchNode.type = 'lowshelf';
            pitchNode.frequency.value = 300;
            pitchNode.gain.value = 10;

            pitchSource.connect(pitchWorkletNode);
            pitchWorkletNode.connect(pitchNode);
            pitchNode.connect(outputNode);
        } else {
            pitchSource.connect(outputNode);
        }

        const destination = pitchAudioContext.createMediaStreamDestination();
        outputNode.connect(destination);
        return destination.stream;
    }

    function updatePitchEffect(enable) {
        settings.voicePitch = enable;
        if (globalStream) {
            createPitchShiftedStream(micStream || globalStream).then(newStream => {
                globalStream.getAudioTracks().forEach(track => track.stop());
                globalStream = newStream;
                if (settings.enableLoopback) enableSelfListening(newStream);
            });
        }
    }

    function updatePitchLevel(value) {
        settings.pitchLevel = value;
        localStorage.setItem('pitchLevel', value);
        if (pitchWorkletNode) {
            const pitchShiftFactor = 1.0 - settings.pitchLevel;
            pitchWorkletNode.port.postMessage(pitchShiftFactor);
        } else if (globalStream) {
            createPitchShiftedStream(micStream || globalStream).then(newStream => {
                globalStream.getAudioTracks().forEach(track => track.stop());
                globalStream = newStream;
                if (settings.enableLoopback) enableSelfListening(newStream);
            });
        }
    }

    // ### Улучшенная автогромкость
    function setupAutoVolume(stream) {
        if (!settings.autoVolume || !stream) return;

        if (remoteAudioContext) remoteAudioContext.close();
        if (volumeCheckIntervalId) clearInterval(volumeCheckIntervalId);

        remoteAudioContext = new AudioContext();
        const source = remoteAudioContext.createMediaStreamSource(stream);
        volumeAnalyser = remoteAudioContext.createAnalyser();
        volumeAnalyser.fftSize = 256;
        source.connect(volumeAnalyser);

        const bufferLength = volumeAnalyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const audioElement = document.querySelector('audio#audioStream');
        volumeHistory = [];
        lastAdjustedVolume = TARGET_VOLUME;

        function adjustVolume() {
            if (!settings.autoVolume || !volumeAnalyser || !audioElement) return;

            volumeAnalyser.getByteTimeDomainData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                const value = (dataArray[i] - 128) / 128;
                sum += value * value;
            }
            const rms = Math.sqrt(sum / bufferLength);
            const volumeLevel = Math.min(1, rms * 10) * 100;

            volumeHistory.push(volumeLevel);
            if (volumeHistory.length > HISTORY_SIZE) volumeHistory.shift();

            const avgVolume = volumeHistory.reduce((a, b) => a + b, 0) / volumeHistory.length;

            const volumeSlider = document.querySelector('.volume_slider input.slider-input');
            if (!volumeSlider) return;

            let targetValue;
            const currentTime = Date.now();

            if (avgVolume > TARGET_VOLUME + 20) {
                targetValue = Math.max(MIN_VOLUME, TARGET_VOLUME - (avgVolume - TARGET_VOLUME));
                lastLoudTime = currentTime;
                lastAdjustedVolume = targetValue;
            } else if (currentTime - lastLoudTime < HOLD_DURATION || avgVolume < SILENCE_THRESHOLD) {
                targetValue = lastAdjustedVolume;
            } else if (avgVolume < TARGET_VOLUME - 20) {
                targetValue = Math.min(MAX_VOLUME, lastAdjustedVolume + (TARGET_VOLUME - avgVolume) / 2);
                lastAdjustedVolume = targetValue;
            } else {
                targetValue = lastAdjustedVolume;
            }

            const startValue = parseInt(volumeSlider.value) || TARGET_VOLUME;
            if (Math.abs(startValue - targetValue) > 5) {
                smoothTransition(volumeSlider, startValue, targetValue, audioElement);
            }
        }

        function smoothTransition(slider, startValue, targetValue, audio) {
            const startTime = performance.now();
            function step(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / TRANSITION_DURATION, 1);
                const newValue = startValue + (targetValue - startValue) * progress;

                slider.value = newValue;
                slider.dispatchEvent(new Event('input', { bubbles: true }));
                slider.dispatchEvent(new Event('change', { bubbles: true }));
                updateSliderVisuals(newValue);
                audio.volume = newValue / 100;

                if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }

        function updateSliderVisuals(value) {
            const sliderDot = document.querySelector('.slider-dot');
            const sliderProcess = document.querySelector('.slider-process');
            const tooltip = document.querySelector('.slider-tooltip');
            if (sliderDot && sliderProcess && tooltip) {
                const maxTranslate = 48;
                const translateX = (value / 100) * maxTranslate;
                sliderDot.style.transform = `translateX(${translateX}px)`;
                sliderProcess.style.width = `${translateX + 4}px`;
                tooltip.textContent = Math.round(value);
            }
        }

        volumeCheckIntervalId = setInterval(adjustVolume, VOLUME_CHECK_INTERVAL);
    }

    // ### Голосовое управление
    async function initSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window)) return;
        if (!micStream) await getMicStream();
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'ru-RU';

        recognition.onresult = (event) => {
            if (!isVoiceControlEnabled) return;
            const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
            if (VOICE_COMMANDS.skip.some(cmd => transcript.includes(cmd))) {
                skipConversation();
            } else if (VOICE_COMMANDS.stop.some(cmd => transcript.includes(cmd))) {
                toggleAutoMode(false);
                skipConversation();
            } else if (VOICE_COMMANDS.start.some(cmd => transcript.includes(cmd))) {
                toggleAutoMode(true);
                checkAndClickButton();
            }
        };

        recognition.onerror = (event) => {
            if (event.error !== 'aborted' && isVoiceControlEnabled) setTimeout(() => recognition.start(), 100);
        };

        recognition.onend = () => {
            if (isVoiceControlEnabled) setTimeout(() => recognition.start(), 100);
        };

        if (settings.voiceControl) {
            isVoiceControlEnabled = true;
            recognition.start();
            if (voiceHintElement) voiceHintElement.style.display = 'inline-block';
            setInterval(() => {
                if (isVoiceControlEnabled) {
                    recognition.stop();
                    setTimeout(() => recognition.start(), 200);
                }
            }, 10000);
        }
    }

    // ### Счетчик разговоров
    function updateConversationStats(duration) {
        settings.conversationCount++;
        if (duration >= 300) settings.conversationStats.over5min++;
        if (duration >= 900) settings.conversationStats.over15min++;
        if (duration >= 1800) settings.conversationStats.over30min++;
        if (duration >= 3600) settings.conversationStats.over1hour++;
        if (duration >= 7200) settings.conversationStats.over2hours++;
        if (duration >= 10800) settings.conversationStats.over3hours++;
        if (duration >= 18000) settings.conversationStats.over5hours++;

        saveSetting('conversationCount', settings.conversationCount);
        saveSetting('conversationStats', settings.conversationStats);

        const counter = document.querySelector('#conversation-counter span');
        if (counter) counter.textContent = `Разговоров: ${settings.conversationCount}`;
    }

    function startConversationTimer() {
        if (conversationTimer) clearInterval(conversationTimer);
        currentConversationStart = Date.now();
        playNotificationOnStart();

        conversationTimer = setInterval(() => {
            const timerElement = document.querySelector('.callScreen__time, .timer-label');
            // Если таймер исчез или вдруг сбросился в 00:00 — считаем, что разговор закончился/перезапустился
            if (!timerElement || timerElement.textContent === '00:00') {
                stopConversationTimer();
            }
        }, 1000);
    }

    function stopConversationTimer() {
        if (conversationTimer && currentConversationStart) {
            clearInterval(conversationTimer);
            const duration = Math.floor((Date.now() - currentConversationStart) / 1000);
            updateConversationStats(duration);
            playNotificationOnEnd();
            conversationTimer = null;
            currentConversationStart = null;
        }
    }

    // ### Новые функции для управления микрофоном и наушниками
    function toggleMic() {
        isMicMuted = !isMicMuted;
        if (globalStream) {
            globalStream.getAudioTracks().forEach(track => {
                track.enabled = !isMicMuted;
            });
        }
        updateButtonStyles();
    }

    function toggleHeadphones() {
        isHeadphonesMuted = !isHeadphonesMuted;
        const audio = document.querySelector('audio#audioStream');
        if (audio) {
            audio.muted = isHeadphonesMuted;
        }
        if (isHeadphonesMuted && !isMicMuted) {
            toggleMic(); // Выключение наушников мутит микрофон
        }
        updateButtonStyles();
    }

    function updateButtonStyles() {
        const micButton = document.querySelector('#mic-toggle');
        const headphoneButton = document.querySelector('#headphone-toggle');

        if (micButton) {
            const micState = globalStream && globalStream.getAudioTracks().length > 0 ? !globalStream.getAudioTracks()[0].enabled : isMicMuted;
            isMicMuted = micState;
            micButton.style.background = isMicMuted ? '#ff4d4d' : '#00ff9d';
            micButton.style.textDecoration = isMicMuted ? 'line-through' : 'none';
            micButton.style.boxShadow = `0 0 10px ${isMicMuted ? '#ff4d4d' : '#00ff9d'}`;
        }

        if (headphoneButton) {
            headphoneButton.style.background = isHeadphonesMuted ? '#ff4d4d' : '#00ff9d';
            headphoneButton.style.textDecoration = isHeadphonesMuted ? 'line-through' : 'none';
            headphoneButton.style.boxShadow = `0 0 10px ${isHeadphonesMuted ? '#ff4d4d' : '#00ff9d'}`;
        }
    }

    // ### UI элементы
    function createVoiceHints() {
        const wrapper = document.createElement('div');
        wrapper.className = 'voice-hint-wrapper';
        wrapper.style.cssText = `margin-left: 5px; display: ${isVoiceControlEnabled ? 'inline-block' : 'none'};`;
        const trigger = document.createElement('span');
        trigger.textContent = 'Подсказка';
        trigger.style.cssText = `font-size: 12px; color: #bbb; cursor: help; padding: 2px 5px; background: #444; border-radius: 5px; transition: color 0.2s ease;`;
        const content = document.createElement('div');
        content.style.cssText = `position: absolute; background: rgba(43, 43, 43, 0.95); color: #fff; padding: 8px; border-radius: 6px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4); font-size: 11px; display: none; transform: translateY(5px); opacity: 0; transition: all 0.3s ease; z-index: 1000;`;
        content.innerHTML = `<b>Голосовые команды:</b><br><b>пропустить: </b>${VOICE_COMMANDS.skip.join('/')}<br><b>начать: </b>${VOICE_COMMANDS.start.join('/')}<br><b>остановить: </b>${VOICE_COMMANDS.stop.join('/')}`;

        wrapper.appendChild(trigger);
        wrapper.appendChild(content);

        trigger.addEventListener('mouseenter', () => {
            trigger.style.color = '#fff';
            content.style.display = 'block';
            setTimeout(() => { content.style.opacity = '1'; content.style.transform = 'translateY(0)'; }, 10);
        });
        trigger.addEventListener('mouseleave', () => {
            trigger.style.color = '#bbb';
            content.style.opacity = '0';
            content.style.transform = 'translateY(5px)';
            setTimeout(() => content.style.display = 'none', 300);
        });

        voiceHintElement = wrapper;
        return wrapper;
    }

    function createConversationCounter() {
        const counterDiv = document.createElement('div');
        counterDiv.id = 'conversation-counter';
        counterDiv.style.cssText = `
            margin-bottom: 15px;
            text-align: center;
            position: relative;
        `;

        const counterSpan = document.createElement('span');
        counterSpan.textContent = `Разговоров: ${settings.conversationCount}`;
        counterSpan.style.cssText = `
            color: #00ff9d;
            font-size: 16px;
            font-weight: bold;
            text-shadow: 0 0 5px #00ff9d, 0 0 10px #00ff9d;
            padding: 5px 10px;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 8px;
            cursor: default;
            display: inline-block;
        `;

        const tooltip = document.createElement('div');
        tooltip.style.cssText = `
            position: absolute;
            top: calc(100% + 5px);
            left: 50%;
            transform: translateX(-50%);
            background: rgba(43, 43, 43, 0.95);
            color: #fff;
            padding: 10px;
            border-radius: 6px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
            font-size: 12px;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
            white-space: nowrap;
        `;
        tooltip.innerHTML = `
            Из них дольше:<br>
            5 минут: ${settings.conversationStats.over5min}<br>
            15 минут: ${settings.conversationStats.over15min}<br>
            30 минут: ${settings.conversationStats.over30min}<br>
            1 часа: ${settings.conversationStats.over1hour}<br>
            2 часов: ${settings.conversationStats.over2hours}<br>
            3 часов: ${settings.conversationStats.over3hours}<br>
            5 часов: ${settings.conversationStats.over5hours}
        `;

        counterDiv.appendChild(counterSpan);
        counterDiv.appendChild(tooltip);

        counterSpan.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 10);
        });

        counterSpan.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                tooltip.style.display = 'none';
            }, 300);
        });

        return counterDiv;
    }

    function createSettingsUI() {
        const container = document.createElement('div');
        container.id = 'settings-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.background = 'linear-gradient(135deg, #2b2b2b, #1f1f1f)';
        container.style.padding = '20px';
        container.style.borderRadius = '15px';
        container.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.7)';
        container.style.border = '2px solid #ff007a';
        container.style.width = '250px';
        container.style.color = '#fff';
        container.style.fontFamily = "'Segoe UI', Arial, sans-serif";
        container.style.transition = 'transform 0.3s ease';

        const header = document.createElement('h3');
        header.textContent = 'Настройки';
        header.style.margin = '0 0 15px';
        header.style.fontSize = '20px';
        header.style.color = '#ff007a';
        header.style.textAlign = 'center';
        header.style.textTransform = 'uppercase';
        header.style.letterSpacing = '2px';
        container.appendChild(header);

        container.appendChild(createConversationCounter());

        const audioControls = document.createElement('div');
        audioControls.style.display = 'flex';
        audioControls.style.gap = '10px';
        audioControls.style.marginBottom = '20px';
        audioControls.style.justifyContent = 'center';

        const micButton = document.createElement('button');
        micButton.id = 'mic-toggle';
        micButton.innerHTML = '🎤';
        micButton.style.width = '40px';
        micButton.style.height = '40px';
        micButton.style.borderRadius = '50%';
        micButton.style.background = '#00ff9d';
        micButton.style.border = 'none';
        micButton.style.cursor = 'pointer';
        micButton.style.fontSize = '20px';
        micButton.style.display = 'flex';
        micButton.style.alignItems = 'center';
        micButton.style.justifyContent = 'center';
        micButton.style.boxShadow = '0 0 10px #00ff9d';
        micButton.style.transition = 'all 0.3s ease';
        micButton.addEventListener('click', toggleMic);

        const headphoneButton = document.createElement('button');
        headphoneButton.id = 'headphone-toggle';
        headphoneButton.innerHTML = '🎧';
        headphoneButton.style.width = '40px';
        headphoneButton.style.height = '40px';
        headphoneButton.style.borderRadius = '50%';
        headphoneButton.style.background = '#00ff9d';
        headphoneButton.style.border = 'none';
        headphoneButton.style.cursor = 'pointer';
        headphoneButton.style.fontSize = '20px';
        headphoneButton.style.display = 'flex';
        headphoneButton.style.alignItems = 'center';
        headphoneButton.style.justifyContent = 'center';
        headphoneButton.style.boxShadow = '0 0 10px #00ff9d';
        headphoneButton.style.transition = 'all 0.3s ease';
        headphoneButton.addEventListener('click', toggleHeadphones);

        audioControls.appendChild(micButton);
        audioControls.appendChild(headphoneButton);
        container.appendChild(audioControls);

        const toggleWrapper = document.createElement('div');
        toggleWrapper.style.display = 'flex';
        toggleWrapper.style.alignItems = 'center';
        toggleWrapper.style.gap = '15px';
        toggleWrapper.style.marginBottom = '20px';

        const label = document.createElement('label');
        label.style.position = 'relative';
        label.style.display = 'inline-block';
        label.style.width = '70px';
        label.style.height = '34px';

        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.style.display = 'none';
        toggleInput.checked = isAutoModeEnabled;

        const slider = document.createElement('span');
        slider.className = 'slider';
        slider.style.position = 'absolute';
        slider.style.cursor = 'pointer';
        slider.style.top = '0';
        slider.style.left = '0';
        slider.style.right = '0';
        slider.style.bottom = '0';
        slider.style.background = isAutoModeEnabled ? '#00ff9d' : '#555';
        slider.style.transition = 'background 0.4s';
        slider.style.borderRadius = '34px';
        slider.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.5)';

        const sliderCircle = document.createElement('span');
        sliderCircle.className = 'slider-circle';
        sliderCircle.style.position = 'absolute';
        sliderCircle.style.height = '26px';
        sliderCircle.style.width = '26px';
        sliderCircle.style.left = isAutoModeEnabled ? '40px' : '4px';
        sliderCircle.style.bottom = '4px';
        sliderCircle.style.background = '#fff';
        sliderCircle.style.transition = 'left 0.4s';
        sliderCircle.style.borderRadius = '50%';
        sliderCircle.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';

        slider.appendChild(sliderCircle);
        label.appendChild(toggleInput);
        label.appendChild(slider);

        const toggleLabel = document.createElement('span');
        toggleLabel.className = 'toggle-label';
        toggleLabel.textContent = `Авторежим ${isAutoModeEnabled ? 'ВКЛ' : 'ВЫКЛ'}`;
        toggleLabel.style.color = isAutoModeEnabled ? '#00ff9d' : '#ff4d4d';
        toggleLabel.style.fontSize = '16px';
        toggleLabel.style.fontWeight = 'bold';
        toggleLabel.style.textShadow = `0 0 5px ${isAutoModeEnabled ? '#00ff9d' : '#ff4d4d'}`;

        toggleWrapper.appendChild(label);
        toggleWrapper.appendChild(toggleLabel);
        container.appendChild(toggleWrapper);

        const audioSettings = document.createElement('div');
        audioSettings.style.display = 'flex';
        audioSettings.style.flexDirection = 'column';
        audioSettings.style.gap = '15px';

        function createToggle(labelText, key) {
            const div = document.createElement('div');
            const toggleDiv = document.createElement('div');
            toggleDiv.style.display = 'flex';
            toggleDiv.style.alignItems = 'center';
            toggleDiv.style.gap = '10px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.appearance = 'none';
            checkbox.style.width = '20px';
            checkbox.style.height = '20px';
            checkbox.style.background = settings[key] ? '#00ff9d' : '#555';
            checkbox.style.borderRadius = '5px';
            checkbox.style.cursor = 'pointer';
            checkbox.style.transition = 'background 0.3s';
            checkbox.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.5)';
            checkbox.checked = settings[key];

            const labelSpan = document.createElement('span');
            labelSpan.textContent = labelText;
            labelSpan.style.fontSize = '14px';
            labelSpan.style.color = '#fff';
            labelSpan.style.fontWeight = 'bold';
            labelSpan.style.textShadow = '0 0 3px rgba(255,255,255,0.5)';

            toggleDiv.appendChild(checkbox);
            toggleDiv.appendChild(labelSpan);
            div.appendChild(toggleDiv);

            let volumeContainer = null;
            let pitchContainer = null;

            if (key === 'enableLoopback') {
                volumeContainer = document.createElement('div');
                volumeContainer.style.display = settings.enableLoopback ? 'block' : 'none';
                volumeContainer.style.marginTop = '10px';

                const volumeLabel = document.createElement('span');
                volumeLabel.textContent = `Громкость самопрослушивания: ${settings.gainValue.toFixed(1)}`;
                volumeLabel.style.fontSize = '14px';
                volumeLabel.style.color = '#fff';
                volumeLabel.style.fontWeight = 'bold';
                volumeLabel.style.textShadow = '0 0 3px rgba(255,255,255,0.5)';

                const volumeSlider = document.createElement('input');
                volumeSlider.type = 'range';
                volumeSlider.min = '0.1';
                volumeSlider.max = '3.0';
                volumeSlider.step = '0.1';
                volumeSlider.value = settings.gainValue;
                volumeSlider.style.width = '100%';
                volumeSlider.style.height = '8px';
                volumeSlider.style.background = `linear-gradient(to right, #ff007a ${((settings.gainValue - 0.1) / 2.9) * 100}%, #555 0%)`;
                volumeSlider.style.borderRadius = '5px';
                volumeSlider.style.outline = 'none';
                volumeSlider.style.cursor = 'pointer';
                volumeSlider.style.appearance = 'none';

                volumeContainer.appendChild(volumeLabel);
                volumeContainer.appendChild(volumeSlider);

                volumeSlider.addEventListener('input', () => {
                    settings.gainValue = parseFloat(volumeSlider.value);
                    volumeLabel.textContent = `Громкость самопрослушивания: ${settings.gainValue.toFixed(1)}`;
                    saveSetting('gainValue', settings.gainValue);
                    if (gainNode) gainNode.gain.value = settings.gainValue;
                    volumeSlider.style.background = `linear-gradient(to right, #ff007a ${((settings.gainValue - 0.1) / 2.9) * 100}%, #555 0%)`;
                });
            }

            if (key === 'voicePitch') {
                pitchContainer = document.createElement('div');
                pitchContainer.style.display = settings.voicePitch ? 'block' : 'none';
                pitchContainer.style.marginTop = '10px';

                const pitchLabel = document.createElement('span');
                pitchLabel.textContent = `0 - обычный голос, 0.40 - очень низкий: ${settings.pitchLevel.toFixed(2)}`;
                pitchLabel.style.fontSize = '14px';
                pitchLabel.style.color = '#fff';
                pitchLabel.style.fontWeight = 'bold';
                pitchLabel.style.textShadow = '0 0 3px rgba(255,255,255,0.5)';

                const pitchSlider = document.createElement('input');
                pitchSlider.type = 'range';
                pitchSlider.min = '0';
                pitchSlider.max = '0.4';
                pitchSlider.step = '0.01';
                pitchSlider.value = settings.pitchLevel;
                pitchSlider.style.width = '100%';
                pitchSlider.style.height = '8px';
                pitchSlider.style.background = `linear-gradient(to right, #ff007a ${(settings.pitchLevel / 0.4) * 100}%, #555 0%)`;
                pitchSlider.style.borderRadius = '5px';
                pitchSlider.style.outline = 'none';
                pitchSlider.style.cursor = 'pointer';
                pitchSlider.style.appearance = 'none';

                pitchContainer.appendChild(pitchLabel);
                pitchContainer.appendChild(pitchSlider);

                pitchSlider.addEventListener('input', () => {
                    settings.pitchLevel = parseFloat(pitchSlider.value);
                    pitchLabel.textContent = `0 - обычный голос, 0.40 - очень низкий: ${settings.pitchLevel.toFixed(2)}`;
                    saveSetting('pitchLevel', settings.pitchLevel);
                    updatePitchLevel(settings.pitchLevel);
                    pitchSlider.style.background = `linear-gradient(to right, #ff007a ${(settings.pitchLevel / 0.4) * 100}%, #555 0%)`;
                });
            }

            checkbox.addEventListener('change', () => {
                settings[key] = checkbox.checked;
                saveSetting(key, checkbox.checked);
                checkbox.style.background = checkbox.checked ? '#00ff9d' : '#555';
                if (key === 'enableLoopback') {
                    if (checkbox.checked && globalStream) enableSelfListening(globalStream);
                    else if (audioContext) audioContext.close();
                    if (volumeContainer) volumeContainer.style.display = checkbox.checked ? 'block' : 'none';
                } else if (key === 'voiceControl') {
                    isVoiceControlEnabled = checkbox.checked;
                    if (voiceHintElement) voiceHintElement.style.display = checkbox.checked ? 'inline-block' : 'none';
                    if (checkbox.checked) {
                        if (!recognition) initSpeechRecognition();
                        recognition.start();
                    } else if (recognition) recognition.stop();
                } else if (key === 'autoVolume') {
                    if (checkbox.checked) {
                        const audio = document.querySelector('audio#audioStream');
                        if (audio && audio.srcObject) setupAutoVolume(audio.srcObject);
                    } else {
                        if (remoteAudioContext) remoteAudioContext.close();
                        if (volumeCheckIntervalId) clearInterval(volumeCheckIntervalId);
                    }
                } else if (key === 'voicePitch') {
                    updatePitchEffect(checkbox.checked);
                    if (pitchContainer) pitchContainer.style.display = checkbox.checked ? 'block' : 'none';
                }
            });

            if (key === 'voiceControl') div.appendChild(createVoiceHints());
            if (key === 'enableLoopback' && volumeContainer) div.appendChild(volumeContainer);
            if (key === 'voicePitch' && pitchContainer) div.appendChild(pitchContainer);
            return div;
        }

        audioSettings.appendChild(createToggle('Самопрослушивание', 'enableLoopback'));
        audioSettings.appendChild(createToggle('Автогромкость микрофона', 'autoGainControl'));
        audioSettings.appendChild(createToggle('Автогромкость собеседника', 'autoVolume'));
        audioSettings.appendChild(createToggle('Шумоподавление', 'noiseSuppression'));
        audioSettings.appendChild(createToggle('Эхоподавление', 'echoCancellation'));
        audioSettings.appendChild(createToggle('Низкий голос', 'voicePitch'));
        audioSettings.appendChild(createToggle('Голосовое управление', 'voiceControl'));

        container.appendChild(audioSettings);
        container.appendChild(createThemeSelector());

        document.body.appendChild(container);

        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 16px;
                height: 16px;
                background: #ff007a;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 0 5px #ff007a;
            }
            select:hover {
                background: #333;
            }
            select:focus {
                border-color: #00ff9d;
            }
        `;
        document.head.appendChild(styleSheet);

        container.addEventListener('mouseover', () => container.style.transform = 'scale(1.02)');
        container.addEventListener('mouseout', () => container.style.transform = 'scale(1)');
        toggleInput.addEventListener('change', (e) => toggleAutoMode(e.target.checked));
    }

    // ### Инициализация
    function initObserver() {
        observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    checkAndClickButton();
                    const audio = document.querySelector('audio#audioStream');
                    if (audio && audio.srcObject && settings.autoVolume) setupAutoVolume(audio.srcObject);

                    // Новый + старый вариант селектора таймера
                    const timerElement = document.querySelector('.callScreen__time, .timer-label');

                    if (timerElement && timerElement.textContent === '00:00' && !conversationTimer) {
                        // Таймер появился и стоит на 00:00 — стартуем отсчёт разговора
                        startConversationTimer();
                    }

                    if (!timerElement && conversationTimer) {
                        // Таймер исчез (например, экран завершения разговора) — завершаем
                        stopConversationTimer();
                    }

                    // Новый селектор кнопки "Завершить"
                    let stopButton = document.querySelector('button.callScreen__cancelCallBtn.btn.danger2.cancelCallBtnNoMess');
                    // Старый вариант — на всякий случай
                    if (!stopButton) {
                        stopButton = document.querySelector('button.btn.btn-lg.stop-talk-button');
                    }

                    if (stopButton && !stopButton.dataset.listenerAdded) {
                        stopButton.addEventListener('click', () => {
                            setTimeout(() => {
                                const confirmButton = document.querySelector('button.swal2-confirm.swal2-styled');
                                if (confirmButton && !confirmButton.dataset.listenerAdded) {
                                    confirmButton.addEventListener('click', playNotificationOnEnd);
                                    confirmButton.dataset.listenerAdded = 'true';
                                }
                            }, 500);
                        });
                        stopButton.dataset.listenerAdded = 'true';
                    }
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    navigator.mediaDevices.getUserMedia = ((original) => {
        return async (constraints) => {
            if (constraints?.audio) {
                constraints.audio = {
                    ...constraints.audio,
                    autoGainControl: settings.autoGainControl,
                    noiseSuppression: settings.noiseSuppression,
                    echoCancellation: settings.echoCancellation
                };
            }
            const stream = await original.call(navigator.mediaDevices, constraints);
            micStream = stream;
            const processedStream = await createPitchShiftedStream(stream);
            globalStream = processedStream;

            if (globalStream && isMicMuted) {
                globalStream.getAudioTracks().forEach(track => {
                    track.enabled = false;
                });
            }

            if (settings.enableLoopback) enableSelfListening(processedStream);
            return processedStream;
        };
    })(navigator.mediaDevices.getUserMedia);

    const originalSet = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'srcObject').set;
    Object.defineProperty(HTMLMediaElement.prototype, 'srcObject', {
        set: function(stream) {
            originalSet.call(this, stream);
            if (this.id === 'audioStream' && stream && settings.autoVolume) setupAutoVolume(stream);
        }
    });

    async function init() {
        console.log('Инициализация скрипта...');
        createSettingsUI();
        applyTheme(settings.selectedTheme);
        checkAndClickButton();
        initObserver();
        await initSpeechRecognition();
        console.log('Инициализация завершена');
    }

    window.addEventListener('load', () => {
        console.log('Страница загружена, запускаем init');
        init();
    });
})();