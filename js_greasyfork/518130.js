// ==UserScript==
// @name         Switcher Stream Channel 1.27.10.2025
// @version      1.27.10.2025
// @license      MIT
// @description  Replace video feed with specified channel's video stream (Twitch, YouTube, or Kick) and provide draggable control panel functionality
// @author       Gullampis810
// @match        https://www.twitch.tv/*
// @icon         https://wwwcdn.cincopa.com/blogres/wp-content/uploads/2019/08/bigstock-247687237.jpg
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/hls.js@1.6.13/dist/hls.min.js 
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/518130/Switcher%20Stream%20Channel%20127102025.user.js
// @updateURL https://update.greasyfork.org/scripts/518130/Switcher%20Stream%20Channel%20127102025.meta.js
// ==/UserScript==
  
(function () {
    'use strict';

    const state = {
        channelName: 'tapa_tapa_mateo',
        favoriteChannels: JSON.parse(localStorage.getItem('favoriteChannels')) || [],
        channelHistory: JSON.parse(localStorage.getItem('channelHistory')) || [],
        panelColor: localStorage.getItem('panelColor') || 'rgba(255, 255, 255, 0.15)',
        buttonColor: localStorage.getItem('buttonColor') || 'rgba(255, 255, 255, 0.3)',
        panelPosition: JSON.parse(localStorage.getItem('panelPosition')) || { top: '20px', left: '20px' },
        isPanelHidden: false
    };
    let customPlayerControls = null;
    let currentVideo = null;  // Для ссылки на <video> или iframe
    state.favoriteChannels.sort((a, b) => a.localeCompare(b));
    state.channelHistory.sort((a, b) => a.localeCompare(b));

    const panel = createControlPanel();
    const toggleButton = createToggleButton();
    document.body.appendChild(panel);
    document.body.appendChild(toggleButton);

    setPanelPosition(panel, state.panelPosition);
    enableDrag(panel);
    window.addEventListener('load', loadStream);

    // Вспомогательная функция для извлечения YouTube ID из ссылки
    function getYouTubeVideoId(url) {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([\w-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    // Вспомогательная функция для извлечения имени канала Kick из ссылки
    function getKickChannelName(url) {
        const regex = /(?:https?:\/\/)?(?:www\.)?kick\.com\/([\w-]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    // Обновленная функция loadStream
  function loadStream() {
    setTimeout(() => {
        const player = document.querySelector('.video-player__container');
        if (player) {
            player.innerHTML = '';

            // Проверка на HLS (.m3u8) поток
            if (state.channelName.endsWith('.m3u8') || state.channelName.includes('.m3u8')) {
            // Принудительная замена http на https для обхода Mixed Content
                state.channelName = state.channelName.replace(/^http:/, 'https:');
                const video = document.createElement('video');
                video.style.cssText = 'width: 100%; height: 100%; border-radius: 0px;';
                video.controls = false;
                video.autoplay = true; // Добавляем автозапуск
                video.muted = false; // Не muted по умолчанию

                if (Hls.isSupported()) {
                    const hls = new Hls({
                        enableWorker: true,
                        debug: true, // Включаем отладку для логов в консоли (отключите позже, если не нужно)
                                                 lowLatencyMode: true, // Для live-стримов, как Twitch
                        backBufferLength: 90, // Увеличиваем back-buffer для обхода "дыр"
                        maxBufferHole: 0.5, // ТOLERANCE для дыр в буфере
                        manifestLoadPolicy: {
                            default: {
                                maxTimeToFirstByteMs: Infinity,
                                maxLoadTimeMs: 10000,
                                timeoutRetry: { maxNumRetry: 2, retryDelayMs: 0, maxRetryDelayMs: 0 },
                                errorRetry: { maxNumRetry: 1, retryDelayMs: 1000, maxRetryDelayMs: 8000 }
                            }
                        },
                        playlistLoadPolicy: {
                            default: {
                                maxTimeToFirstByteMs: Infinity,
                                maxLoadTimeMs: 10000,
                                timeoutRetry: { maxNumRetry: 2, retryDelayMs: 0, maxRetryDelayMs: 0 },
                                errorRetry: { maxNumRetry: 2, retryDelayMs: 1000, maxRetryDelayMs: 8000 }
                            }
                        },
                        fragLoadPolicy: {
                            default: {
                                maxTimeToFirstByteMs: Infinity,
                                maxLoadTimeMs: 20000,
                                timeoutRetry: { maxNumRetry: 4, retryDelayMs: 0, maxRetryDelayMs: 0 },
                                errorRetry: { maxNumRetry: 6, retryDelayMs: 1000, maxRetryDelayMs: 8000 }
                            }
                        },
                    });
                    hls.loadSource(state.channelName);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        video.play().catch(error => console.error('Play error:', error)); // Обработка ошибок автозапуска
                    });
                    hls.on(Hls.Events.ERROR, (event, data) => {
                        console.error('HLS error:', data.type, data.details, data.fatal); // Детальные логи ошибок
                        if (data.fatal) {
                            switch (data.type) {
                                case Hls.ErrorTypes.NETWORK_ERROR:
                                    console.error('Fatal network error - trying to recover');
                                    hls.startLoad();
                                    break;
                                case Hls.ErrorTypes.MEDIA_ERROR:
                                    console.error('Fatal media error - trying to recover');
                                    hls.recoverMediaError();
                                    break;
                                default:
                                    hls.destroy();
                                    break;
                            }
                        }
                    });
                    hls.on(Hls.Events.FRAG_LOADING, (event, data) => {
                        console.log('Loading fragment:', data.frag.url); // Лог для отслеживания циклов
                    });
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = state.channelName;
                    video.addEventListener('loadedmetadata', () => {
                        video.play().catch(error => console.error('Native play error:', error));
                    });
                } else {
                    console.error('HLS не поддерживается в этом браузере.');
                }

                player.appendChild(video);
                currentVideo = video;
               customPlayerControls = createCustomControls(video);
               player.style.position = 'relative';  // Для overlay
               player.appendChild(customPlayerControls);
            } else {
                // Оригинальная логика для Twitch, YouTube, Kick
                const iframe = document.createElement('iframe');
                iframe.style.cssText = 'width: 100%; height: 100%; border-radius: 12px;';
                iframe.allowFullscreen = true;

                const youtubeId = getYouTubeVideoId(state.channelName);
                const kickChannel = getKickChannelName(state.channelName);
                if (youtubeId) {
                    iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0`;
                } else if (kickChannel) {
                    iframe.src = `https://kick.com/${kickChannel}?autoplay=true&muted=false`;
                } else {
                    iframe.src = `https://player.twitch.tv/?channel=${state.channelName}&parent=twitch.tv&quality=1080p&muted=false`;
                }
                player.appendChild(iframe);

            }
        }
    }, 3000); // Увеличили задержку до 3 сек для стабильности
}

function createCustomControls(mediaElement) {
    const controls = document.createElement('div');
    controls.id = 'strmx87x78ht-controls-Panel-e67jmxhj'; // Задаём id для заголовка
    controls.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 30px;
        padding: 0 10px;
        box-sizing:
        border-box;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.3s ease;
        background: #3a1d44;
        border: 2px solid #bf94ff;
        color: rgb(176, 226, 196);
        cursor: pointer;
        margin-right: 8px;
        height: 55px;
        width: 95%;
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        border-radius: 18px;
        box-shadow: #b081ba 1px -2px 10px 2px;
    `;
    controls.addEventListener('mouseenter', () => controls.style.opacity = '1');
    controls.addEventListener('mouseleave', () => controls.style.opacity = '0');

    // Кнопка play/pause
    const playBtn = document.createElement('button');
    playBtn.id = 'playBattn-controls-panel-e67jmxhj'; // Задаём id для заголовка
    playBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="white" d="M8 5v14l11-7z"/></svg>';  // Иконка play
    playBtn.style.cssText = 'background: none; border: none; color: white; cursor: pointer; margin-right: 10px;';
    playBtn.addEventListener('click', () => {
        if (mediaElement.paused) {
            mediaElement.play();
            playBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';  // Pause
        } else {
            mediaElement.pause();
            playBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="white" d="M8 5v14l11-7z"/></svg>';
        }
    });

    // Полоса прогресса
    const progress = document.createElement('div');
    progress.id = 'progress-67hd5re-controls-panel-e67jmxhj'; // Задаём id для заголовка
    progress.style.cssText = 'flex: 1; height: 4px; background:  #bf94ff; margin: 0 10px; border-radius: 2px; position: relative;';
    const progressBar = document.createElement('div');
    progressBar.id = 'progressbar-67hd5re-controls-panel-e67jmxhj'; // Задаём id для заголовка
    progressBar.style.cssText = 'height: 100%; background: white; width: 0%; border-radius: 15px;';
    progress.appendChild(progressBar);
    // Элемент для текущего времени (слева от прогресса)
const currentTime = document.createElement('span');
currentTime.id = 'current-time-controls-panel-e67jmxhj';
currentTime.style.cssText = 'color: white; font-size: 12px; margin-right: 10px; min-width: 40px; text-align: right;';
currentTime.textContent = '0:00';

// Элемент для общей длительности (справа от прогресса)
const duration = document.createElement('span');
duration.id = 'duration-controls-panel-e67jmxhj';
duration.style.cssText = 'color: white; font-size: 12px; margin-left: 10px; min-width: 40px;';
duration.textContent = '0:00';

    //============== Слайдер громкости
    const volumeContainer = document.createElement('div');
    volumeContainer.id = 'volumeContainer-hexhg5-controls-e67jmxhj'; // Задаём id для заголовка
    volumeContainer.style.cssText = 'display: flex; align-items: center; margin-left: 10px; position: relative;';
    const volumeBtn = document.createElement('button');
    volumeBtn.id = 'volumeMuteBttn-mute-67hd5re-e67jmxhj'; // Задаём id для заголовка
    volumeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="white" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';  // Volume on
    volumeBtn.style.cssText = 'background: none; border: none; color: white; cursor: pointer; margin-right: 5px;';
    volumeBtn.addEventListener('click', () => {
        if (mediaElement.muted) {
            mediaElement.muted = false;
            volumeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="white" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
        } else {
            mediaElement.muted = true;
            volumeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="white" d="M12 4.59c.04-.01.08-.02.12-.02.03 0 .06.01.09.02 1.32.66 2.3 2.01 2.7 3.59H17c.55 0 1 .45 1 1v6c0 .55-.45 1-1 1h-1.91c-.4 1.58-1.38 2.93-2.7 3.59-.03.01-.06.02-.09.02-.04 0-.08-.01-.12-.02-.66-.33-1.18-.98-1.42-1.76H9c-.55 0-1-.45-1-1V9c0-.55.45-1 1-1h1.91c.24-.78.76-1.43 1.42-1.76zM19 12c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7 7-3.13 7-7z"/></svg>';  // Mute
        }
    });

    const volumeSlider = document.createElement('input');
    volumeSlider.id = 'volume-jeh5-Slider-hexhg5-e67jmxhj'; // Задаём id для заголовка
    volumeSlider.type = 'range';
    volumeSlider.min = 0; volumeSlider.max = 1; volumeSlider.step = 0.01; volumeSlider.value = mediaElement.volume || 1;
    volumeSlider.style.cssText = 'height: 4px; border-radius: 15px; cursor: pointer; width: 80px;';

    // Кастомные стили для ползунка (thumb)
const sliderStyle = document.createElement('style');
sliderStyle.textContent = `
    #volume-jeh5-Slider-hexhg5-e67jmxhj::-webkit-slider-thumb {
        appearance: none;
        width: 21px;
        height: 21px;
        background: #bf94ff;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    #volume-jeh5-Slider-hexhg5-e67jmxhj::-moz-range-thumb {
        width: 21px;
        height: 21px;
        background: #bf94ff;
        border-radius: 50%;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    #volume-jeh5-Slider-hexhg5-e67jmxhj::-ms-thumb {
        width: 21px;
        height: 21px;
        background: #bf94ff;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
`;
document.head.appendChild(sliderStyle);

    // тултип
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
      position: absolute;
      bottom: 100%;
      left: 0;
      transform: translateX(-50%);
      padding: 2px 6px;
      background: rgb(16, 68, 70);
      color: rgb(87, 235, 240) !important;
      font-size: 20px;
      border-radius: 12px;
      white-space: nowrap;
      display: none;
    `;

    // добавляем
    volumeContainer.append(volumeSlider, tooltip);

    // показываем тултип при наведении
    let tooltipTimeout;  // Для debounce скрытия

// Функция обновления тултипа
function updateTooltip(e) {
    const percent = Math.round(e.target.value * 100);
    tooltip.textContent = `${percent}%`;

    const sliderRect = e.target.getBoundingClientRect();
    const offsetX = ((e.target.value - e.target.min) / (e.target.max - e.target.min)) * sliderRect.width;
    tooltip.style.left = `${offsetX}px`;
}

// Показываем/обновляем тултип при наведении
volumeSlider.addEventListener('mouseenter', (e) => {
    updateTooltip(e);
    tooltip.style.display = 'block';
});

// Скрываем с debounce при уходе
volumeSlider.addEventListener('mouseleave', () => {
    clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(() => {
        tooltip.style.display = 'none';
    }, 500);  // 500 мс задержки
});

// Обновляем при перетаскивании (динамически)
volumeSlider.addEventListener('input', (e) => {
    mediaElement.volume = e.target.value;
    if (tooltip.style.display === 'block') {  // Только если видим
        updateTooltip(e);
    }
});

// Показываем сразу при клике/перетаскивании
volumeSlider.addEventListener('mousedown', (e) => {
    updateTooltip(e);
    tooltip.style.display = 'block';
    clearTimeout(tooltipTimeout);  // Отменяем скрытие
});

// Скрываем после отпускания мыши с debounce
volumeSlider.addEventListener('mouseup', () => {
    clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(() => {
        tooltip.style.display = 'none';
    }, 500);
});

    // Обновление прогресса
    // Обновление прогресса и времени
mediaElement.addEventListener('timeupdate', () => {
    const percent = (mediaElement.currentTime / mediaElement.duration) * 100 || 0;
    progressBar.style.width = percent + '%';

    // Форматирование времени (MM:SS)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    currentTime.textContent = formatTime(mediaElement.currentTime);
    if (mediaElement.duration && !isNaN(mediaElement.duration)) {
        duration.textContent = formatTime(mediaElement.duration);
    }
});

// Инициализация длительности при загрузке метаданных
mediaElement.addEventListener('loadedmetadata', () => {
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    duration.textContent = formatTime(mediaElement.duration);
});
    progress.addEventListener('click', (e) => {
        const rect = progress.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        mediaElement.currentTime = pos * mediaElement.duration;
    });

    controls.append(playBtn, currentTime, progress, duration, volumeContainer);
    volumeContainer.append(volumeBtn);
    return controls;
}
    // Обновление функции createChannelInput для поддержки YouTube и Kick ссылок
    function createChannelInput() {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter channel name, YouTube URL, or Kick URL';
        Object.assign(input.style, {
            width: '100%',
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(95, 255, 194, 0.9)',
            fontSize: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease'
        });
        input.addEventListener('input', (e) => state.channelName = e.target.value.trim());
        input.addEventListener('focus', () => input.style.borderColor = 'rgba(255, 255, 255, 0.4)');
        input.addEventListener('blur', () => input.style.borderColor = 'rgba(255, 255, 255, 0.2)');
        return input;
    }

    // Остальные функции остаются без изменений
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.className = 'switcher-panel';
        Object.assign(panel.style, {
            position: 'fixed',
            width: '340px',
            padding: '20px',
            background: 'linear-gradient(45deg, #235550, #211831)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            zIndex: '9999',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            cursor: 'move'
        });
        panel.style.setProperty('background', 'linear-gradient(45deg, #235550, #211831)', 'important');

        state.panelColor = 'linear-gradient(45deg, #235550, #211831)';
        localStorage.setItem('panelColor', state.panelColor);

        const content = document.createElement('div');

        const header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
        });

        const title = createTitle('Channel Switcher v1.27.10.2025');
        const hideBtn = document.createElement('button');
        hideBtn.textContent = '×';
        Object.assign(hideBtn.style, {
            width: '40px',
            height: '40px',
            border: 'none',
            borderRadius: '50%',
            fontSize: '24px',
            color: 'rgba(255, 255, 255, 0.8)',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease',
            display: 'flex',
            justifyContent: 'center'
        });
        hideBtn.addEventListener('click', togglePanel);
        hideBtn.addEventListener('mouseover', () => hideBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)');
        hideBtn.addEventListener('mouseout', () => hideBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)');

        header.append(title, hideBtn);

        content.append(
            createChannelInput(),
            createButton('Play Channel', loadInputChannel, 'play-btn'),
            createSelect(state.favoriteChannels, 'Favorites', 'favorites-select'),
            createSelect(state.channelHistory, 'History', 'history-select'),
            createButton('Play Selected', loadSelectedChannel, 'play-selected-btn'),
            createButton('Add to Favorites', addChannelToFavorites, 'add-fav-btn'),
            createButton('Remove Favorite', removeChannelFromFavorites, 'remove-fav-btn'),
            createButton('Clear History', clearHistory, 'clear-history-btn'),
            createColorPicker('Button Color', 'button-color-picker', updateButtonColor)
        );

        panel.append(header, content);
        return panel;
    }

    function updatePanelColor(e) {
        const hex = e.target.value;
        state.panelColor = hex;
        panel.style.setProperty('background', hex, 'important');
        localStorage.setItem('panelColor', state.panelColor);
    }

    function createToggleButton() {
        const button = document.createElement('button');
        button.className = 'toggle-visibility';
        Object.assign(button.style, {
            position: 'fixed',
            top: '16px',
            left: '490px',
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(27, 173, 117, 0.2)',
            borderRadius: '50%',
            border: '1px solid rgba(80, 245, 203, 0.66)',
            cursor: 'pointer',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(0, 255, 76, 0.1)',
            transition: 'all 0.2s ease'
        });
  const eyeShowSvg = `
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
           <title>Eye-outline SVG Icon</title>
           <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
           <path d="M8.25 12a3.75 3.75 0 1 1 7.5 0a3.75 3.75 0 0 1-7.5 0M12 9.75a2.25 2.25 0 1 0 0 4.5a2.25 2.25 0 0 0 0-4.5"/>
           <path d="M4.323 10.646c-.419.604-.573 1.077-.573 1.354c0 .277.154.75.573 1.354c.406.583 1.008 1.216 1.77 1.801C7.62 16.327 9.713 17.25 12 17.25s4.38-.923 5.907-2.095c.762-.585 1.364-1.218 1.77-1.801c.419-.604.573-1.077.573-1.354c0-.277-.154-.75-.573-1.354c-.406-.583-1.008-1.216-1.77-1.801C16.38 7.673 14.287 6.75 12 6.75s-4.38.923-5.907 2.095c-.762.585-1.364 1.218-1.77 1.801m.856-2.991C6.91 6.327 9.316 5.25 12 5.25s5.09 1.077 6.82 2.405c.867.665 1.583 1.407 2.089 2.136c.492.709.841 1.486.841 2.209c0 .723-.35 1.5-.841 2.209c-.506.729-1.222 1.47-2.088 2.136c-1.73 1.328-4.137 2.405-6.821 2.405s-5.09-1.077-6.82-2.405c-.867-.665-1.583-1.407-2.089-2.136C2.6 13.5 2.25 12.723 2.25 12c0-.723.35-1.5.841-2.209c.506-.729 1.222-1.47 2.088-2.136"/>
           </g>
           </svg>
        `;

        const eyeHideSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <title>Eye-closed-solid SVG Icon</title>
        <path fill="currentColor" fill-rule="evenodd" d="M20.53 4.53a.75.75 0 0 0-1.06-1.06l-16 16a.75.75 0 1 0 1.06 1.06l3.035-3.035C8.883 18.103 10.392 18.5 12 18.5c2.618 0 4.972-1.051 6.668-2.353c.85-.652 1.547-1.376 2.035-2.08c.48-.692.797-1.418.797-2.067c0-.649-.317-1.375-.797-2.066c-.488-.705-1.185-1.429-2.035-2.08c-.27-.208-.558-.41-.86-.601zm-5.4 5.402l-1.1 1.098a2.25 2.25 0 0 1-3 3l-1.1 1.1a3.75 3.75 0 0 0 5.197-5.197" clip-rule="evenodd"/>
<path fill="currentColor" d="M12.67 8.31a.26.26 0 0 0 .23-.07l1.95-1.95a.243.243 0 0 0-.104-.407A10.214 10.214 0 0 0 12 5.5c-2.618 0-4.972 1.051-6.668 2.353c-.85.652-1.547 1.376-2.036 2.08c-.48.692-.796 1.418-.796 2.067c0 .649.317 1.375.796 2.066a9.287 9.287 0 0 0 1.672 1.79a.246.246 0 0 0 .332-.017l2.94-2.94a.26.26 0 0 0 .07-.23a3.75 3.75 0 0 1 4.36-4.36"/>
        </svg>
        `;

        const svgContainer = document.createElement('div');
        svgContainer.innerHTML = state.isPanelHidden ? eyeHideSvg : eyeShowSvg;
        Object.assign(svgContainer.style, {
            width: '28px',
            height: '28px',
            filter: 'brightness(100)'
        });

        button.appendChild(svgContainer);

        button.addEventListener('click', () => {
            togglePanelVisibility();
            svgContainer.innerHTML = state.isPanelHidden ? eyeHideSvg : eyeShowSvg;
        });
        button.addEventListener('mouseover', () => button.style.backgroundColor = 'rgba(255, 255, 255, 0.3)');
        button.addEventListener('mouseout', () => button.style.backgroundColor = 'rgba(255, 255, 255, 0.2)');

        return button;
    }

    function createTitle(text) {
        const title = document.createElement('h3');
        title.textContent = text;
        Object.assign(title.style, {
            margin: '0',
            fontSize: '20px',
            fontWeight: '500',
            color: 'rgba(255, 255, 255, 0.9)'
        });
        return title;
    }

    function createSelect(options, labelText, className) {
        const container = document.createElement('div');
        container.className = className;
        container.style.marginBottom = '16px';
        container.style.position = 'relative';

        const label = document.createElement('label');
        label.textContent = labelText;
        Object.assign(label.style, {
            display: 'block',
            marginBottom: '4px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: '500'
        });

        const selectBox = document.createElement('div');
        Object.assign(selectBox.style, {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    fontSize: '16px',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',  // Новое: запрещает перенос
    overflow: 'hidden'   // Новое: скрывает переполнение
});

        const selectedText = document.createElement('span');
        selectedText.textContent = options.length ? options[0] : 'No items';
        Object.assign(selectedText.style, {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: 'calc(100% - 20px)',  // Учитываем ширину стрелки (около 20px) и отступы
            display: 'block'  // Чтобы ellipsis работал корректно
        });

        const arrow = document.createElement('span');
        arrow.innerHTML = '<svg width="12" height="12" viewBox="0 0 16 16" fill="rgba(255,255,255,0.7)"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>';

        const dropdown = document.createElement('div');
        Object.assign(dropdown.style, {
            position: 'absolute',
            top: '100%',
            left: '0',
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            display: 'none',
            zIndex: '10001'
        });

        options.forEach(option => {
            const item = document.createElement('div');
            Object.assign(item.style, {
                 padding: '10px 16px',
                 color: 'rgba(255, 255, 255, 0.9)',
                 cursor: 'pointer',
                 transition: 'background-color 0.2s ease',
                 overflow: 'hidden',
                 textOverflow: 'ellipsis',
                 whiteSpace: 'nowrap',
                 width: '100%',
                 display: 'flex',
                 justifyContent: 'space-between',
                 alignItems: 'center'
             });

             const textSpan = document.createElement('span');
Object.assign(textSpan.style, {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: '1'
});
textSpan.textContent = option;

const deleteBtn = document.createElement('button');
 deleteBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="16"
         height="16"
         shape-rendering="geometricPrecision"
         text-rendering="geometricPrecision"
         image-rendering="optimizeQuality"
         fill-rule="evenodd"
         clip-rule="evenodd"
         viewBox="0 0 456 511.82">
         <path fill="rgba(255, 117, 117, 0.83)"
               d="M48.42 140.13h361.99c17.36 0 29.82 9.78 28.08 28.17l-30.73 317.1c-1.23 13.36-8.99 26.42-25.3 26.42H76.34c-13.63-.73-23.74-9.75-25.09-24.14L20.79 168.99c-1.74-18.38 9.75-28.86 27.63-28.86zM24.49 38.15h136.47V28.1c0-15.94 10.2-28.1 27.02-28.1h81.28c17.3 0 27.65 11.77 27.65 28.01v10.14h138.66c.57 0 1.11.07 1.68.13 10.23.93 18.15 9.02 18.69 19.22.03.79.06 1.39.06 2.17v42.76c0 5.99-4.73 10.89-10.62 11.19-.54 0-1.09.03-1.63.03H11.22c-5.92 0-10.77-4.6-11.19-10.38 0-.72-.03-1.47-.03-2.23v-39.5c0-10.93 4.21-20.71 16.82-23.02 2.53-.45 5.09-.37 7.67-.37zm83.78 208.38c-.51-10.17 8.21-18.83 19.53-19.31 11.31-.49 20.94 7.4 21.45 17.57l8.7 160.62c.51 10.18-8.22 18.84-19.53 19.32-11.32.48-20.94-7.4-21.46-17.57l-8.69-160.63zm201.7-1.74c.51-10.17 10.14-18.06 21.45-17.57 11.32.48 20.04 9.14 19.53 19.31l-8.66 160.63c-.52 10.17-10.14 18.05-21.46 17.57-11.31-.48-20.04-9.14-19.53-19.32l8.67-160.62zm-102.94.87c0-10.23 9.23-18.53 20.58-18.53 11.34 0 20.58 8.3 20.58 18.53v160.63c0 10.23-9.24 18.53-20.58 18.53-11.35 0-20.58-8.3-20.58-18.53V245.66z"/>
    </svg>
`;
Object.assign(deleteBtn.style, {
    width: '20px',
    height: '20px',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
    cursor: 'pointer',
    marginLeft: '8px',
    transition: 'color 0.2s ease'
});
deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();  // Предотвращаем клик по item
    const container = item.closest('.favorites-select, .history-select');
    const listType = container.className.includes('favorites') ? 'favorites' : 'history';
    removeFromList(option, listType);
});
deleteBtn.addEventListener('mouseover', () => deleteBtn.style.color = 'rgba(255, 255, 255, 1)');
deleteBtn.addEventListener('mouseout', () => deleteBtn.style.color = 'rgba(255, 255, 255, 0.7)');

item.appendChild(textSpan);
item.appendChild(deleteBtn);
            item.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
        state.channelName = option;
        selectedText.textContent = option;
        dropdown.style.display = 'none';
            }
        });
            item.addEventListener('mouseover', () => item.style.backgroundColor = 'rgba(255, 255, 255, 0.2)');
            item.addEventListener('mouseout', () => item.style.backgroundColor = 'transparent');
            dropdown.appendChild(item);
        });

        selectBox.append(selectedText, arrow);
        container.append(label, selectBox, dropdown);

        selectBox.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        return container;
    }

    function createButton(text, onClick, className) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = className;
        Object.assign(button.style, {
            width: '100%',
            marginBottom: '12px',
            padding: '14px 16px',
            backgroundColor: state.buttonColor,
            color: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
        });
        button.addEventListener('click', onClick);
        button.addEventListener('mouseover', () => button.style.backgroundColor = 'rgba(255, 255, 255, 0.4)');
        button.addEventListener('mouseout', () => button.style.backgroundColor = state.buttonColor);
        button.addEventListener('mousedown', () => button.style.transform = 'scale(0.98)');
        button.addEventListener('mouseup', () => button.style.transform = 'scale(1)');
        return button;
    }

    function createColorPicker(labelText, className, onChange) {
        const container = document.createElement('div');
        container.style.marginBottom = '16px';

        const label = document.createElement('label');
        label.textContent = labelText;
        Object.assign(label.style, {
            display: 'block',
            marginBottom: '4px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: '500'
        });

        const picker = document.createElement('input');
        picker.type = 'color';
        picker.className = className;
        picker.value = labelText.includes('Panel') ? rgbaToHex(state.panelColor) : rgbaToHex(state.buttonColor);
        Object.assign(picker.style, {
            width: '100%',
            height: '48px',
            padding: '0',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
            background: '#8b008b00',
        });
        picker.addEventListener('input', onChange);

        container.append(label, picker);
        return container;
    }

    function rgbaToHex(rgba) {
        const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (!match) return rgba;
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }

    function updateButtonColor(e) {
        const hex = e.target.value;
        state.buttonColor = `${hex}4D`;
        localStorage.setItem('buttonColor', state.buttonColor);
        panel.querySelectorAll('button:not(.toggle-visibility)').forEach(button => {
            button.style.backgroundColor = state.buttonColor;
        });
    }

    function togglePanel() {
        state.isPanelHidden = !state.isPanelHidden;
        panel.style.transform = state.isPanelHidden ? 'scale(0.95)' : 'scale(1)';
        panel.style.opacity = state.isPanelHidden ? '0' : '1';
        panel.style.pointerEvents = state.isPanelHidden ? 'none' : 'auto';
    }

    function togglePanelVisibility() {
        const svgContainer = document.querySelector('.toggle-visibility div');
        const isHidden = panel.style.opacity === '0' || !panel.style.opacity;

        if (isHidden) {
            panel.style.transform = 'scale(1)';
            panel.style.opacity = '1';
            panel.style.pointerEvents = 'auto';
            state.isPanelHidden = false;
            svgContainer.innerHTML = `
                <svg width="28" height="28" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm0 1.5A2.5 2.5 0 0 0 5.5 8 2.5 2.5 0 0 0 8 10.5 2.5 2.5 0 0 0 10.5 8 2.5 2.5 0 0 0 8 5.5zM16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-1.5 0s-2.5-4-6.5-4S1.5 8 1.5 8s2.5 4 6.5 4 6.5-4 6.5-4z"/>
                </svg>
            `;
        } else {
            panel.style.transform = 'scale(0.95)';
            panel.style.opacity = '0';
            panel.style.pointerEvents = 'none';
            state.isPanelHidden = true;
            svgContainer.innerHTML = `
                <svg width="28" height="28" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708l10 10a.5.5 0 0 1-.708.708l-10-10zM8 4a4 4 0 0 1 4 4 4 4 0 0 1-.672 2.176l-.672-.672A2.5 2.5 0 0 0 10.5 8 2.5 2.5 0 0 0 8 5.5a2.5 2.5 0 0 0-1.672.672l-.672-.672A4 4 0 0 1 8 4zm6.5 4s-2.5-4-6.5-4c-.89 0-1.74.192-2.52.536l-.672-.672C5.74 3.298 6.81 3 8 3c5 0 8 5.5 8 5.5s-1.896 3.446-5 4.674l-.672-.672C12.604 11.274 14.5 8.828 14.5 8zM1.5 8s2.5-4 6.5-4c.89 0 1.74.192 2.52.536l.672.672C10.26 3.298 9.19 3 8 3 3 3 0 8.5 0 8.5s1.896 3.446 5 4.674l.672-.672C3.396 11.274 1.5 8.828 1.5 8z"/>
                </svg>
            `;
        }
    }

    function loadInputChannel() {
        if (state.channelName) {
            loadStream();
            addChannelToHistory(state.channelName);
        } else {
            alert('Пожалуйста, введите имя канала, YouTube-ссылку или Kick-ссылку.');
        }
    }

    function loadSelectedChannel() {
        if (state.channelName) {
            loadStream();
            addChannelToHistory(state.channelName);
        } else {
            alert('Пожалуйста, выберите канал, YouTube-ссылку или Kick-ссылку.');
        }
    }

    function addChannelToFavorites() {
        if (state.channelName && !state.favoriteChannels.includes(state.channelName)) {
            state.favoriteChannels.push(state.channelName);
            state.favoriteChannels.sort((a, b) => a.localeCompare(b));
            localStorage.setItem('favoriteChannels', JSON.stringify(state.favoriteChannels));
            alert(`Добавлено ${state.channelName} в избранное!`);
            updateOptions(document.querySelector('.favorites-select'), state.favoriteChannels);
        } else if (!state.channelName) {
            alert('Пожалуйста, введите имя канала, YouTube-ссылку или Kick-ссылку.');
        }
    }

    function removeChannelFromFavorites() {
        if (!state.channelName) {
            alert('Пожалуйста, выберите канал, YouTube-ссылку или Kick-ссылку для удаления.');
            return;
        }
        if (!state.favoriteChannels.includes(state.channelName)) {
            alert(`${state.channelName} отсутствует в избранном.`);
            return;
        }
        state.favoriteChannels = state.favoriteChannels.filter(ch => ch !== state.channelName);
        state.favoriteChannels.sort((a, b) => a.localeCompare(b));
        localStorage.setItem('favoriteChannels', JSON.stringify(state.favoriteChannels));
        updateOptions(document.querySelector('.favorites-select'), state.favoriteChannels);
    }

    function clearHistory() {
        state.channelHistory = [];
        localStorage.setItem('channelHistory', JSON.stringify(state.channelHistory));
        updateOptions(document.querySelector('.history-select'), state.channelHistory);
    }

    function addChannelToHistory(channel) {
        if (channel && !state.channelHistory.includes(channel)) {
            state.channelHistory.push(channel);
            state.channelHistory.sort((a, b) => a.localeCompare(b));
            localStorage.setItem('channelHistory', JSON.stringify(state.channelHistory));
            updateOptions(document.querySelector('.history-select'), state.channelHistory);
        }
    }

    function updateOptions(select, options) {
           const dropdown = select.querySelector('div[style*="position: absolute"]'); // Ищем dropdown по стилю (можно добавить class для точности)
    if (!dropdown) {
        console.error('Dropdown not found in select container');
        return;
    }
    dropdown.innerHTML = '';
    const selectedText = select.querySelector('span'); // Обновляем текст выбранного, если нужно
    if (options.length === 0) {
        if (selectedText) selectedText.textContent = 'No items';
        return;
    }
    if (selectedText) selectedText.textContent = options[0]; // Устанавливаем первый как выбранный по умолчанию
    options.forEach(option => {
        const item = document.createElement('div');
Object.assign(item.style, {
     padding: '10px 16px',
     color: 'rgba(255, 255, 255, 0.9)',
     cursor: 'pointer',
     transition: 'background-color 0.2s ease',
     overflow: 'hidden',
     textOverflow: 'ellipsis',
     whiteSpace: 'nowrap',
     width: '100%',
     display: 'flex',
     justifyContent: 'space-between',
     alignItems: 'center'
 });

 const textSpan = document.createElement('span');
 Object.assign(textSpan.style, {
     overflow: 'hidden',
     textOverflow: 'ellipsis',
     whiteSpace: 'nowrap',
     flex: '1'
 });
 textSpan.textContent = option;

 const deleteBtn = document.createElement('button');
 deleteBtn.innerHTML = `
     <svg xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          shape-rendering="geometricPrecision"
          text-rendering="geometricPrecision"
          image-rendering="optimizeQuality"
          fill-rule="evenodd"
          clip-rule="evenodd"
          viewBox="0 0 456 511.82">
          <path fill="rgba(255, 117, 117, 0.83)"
                d="M48.42 140.13h361.99c17.36 0 29.82 9.78 28.08 28.17l-30.73 317.1c-1.23 13.36-8.99 26.42-25.3 26.42H76.34c-13.63-.73-23.74-9.75-25.09-24.14L20.79 168.99c-1.74-18.38 9.75-28.86 27.63-28.86zM24.49 38.15h136.47V28.1c0-15.94 10.2-28.1 27.02-28.1h81.28c17.3 0 27.65 11.77 27.65 28.01v10.14h138.66c.57 0 1.11.07 1.68.13 10.23.93 18.15 9.02 18.69 19.22.03.79.06 1.39.06 2.17v42.76c0 5.99-4.73 10.89-10.62 11.19-.54 0-1.09.03-1.63.03H11.22c-5.92 0-10.77-4.6-11.19-10.38 0-.72-.03-1.47-.03-2.23v-39.5c0-10.93 4.21-20.71 16.82-23.02 2.53-.45 5.09-.37 7.67-.37zm83.78 208.38c-.51-10.17 8.21-18.83 19.53-19.31 11.31-.49 20.94 7.4 21.45 17.57l8.7 160.62c.51 10.18-8.22 18.84-19.53 19.32-11.32.48-20.94-7.4-21.46-17.57l-8.69-160.63zm201.7-1.74c.51-10.17 10.14-18.06 21.45-17.57 11.32.48 20.04 9.14 19.53 19.31l-8.66 160.63c-.52 10.17-10.14 18.05-21.46 17.57-11.31-.48-20.04-9.14-19.53-19.32l8.67-160.62zm-102.94.87c0-10.23 9.23-18.53 20.58-18.53 11.34 0 20.58 8.3 20.58 18.53v160.63c0 10.23-9.24 18.53-20.58 18.53-11.35 0-20.58-8.3-20.58-18.53V245.66z"/>
     </svg>
 `;
 Object.assign(deleteBtn.style, {
     width: '20px',
     height: '20px',
     border: 'none',
     borderRadius: '50%',
     backgroundColor: 'transparent',
     color: 'rgba(255, 255, 255, 0.7)',
     fontSize: '16px',
     cursor: 'pointer',
     marginLeft: '8px',
     transition: 'color 0.2s ease'
 });
 deleteBtn.addEventListener('click', (e) => {
     e.stopPropagation();
     const container = dropdown.closest('.favorites-select, .history-select');
     const listType = container.className.includes('favorites') ? 'favorites' : 'history';
     removeFromList(option, listType);
 });
 deleteBtn.addEventListener('mouseover', () => deleteBtn.style.color = 'rgba(255, 255, 255, 1)');
 deleteBtn.addEventListener('mouseout', () => deleteBtn.style.color = 'rgba(255, 255, 255, 0.7)');

 item.appendChild(textSpan);
 item.appendChild(deleteBtn);
 item.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') {
        state.channelName = option;
        selectedText.textContent = option;
        dropdown.style.display = 'none';
    }
});
item.addEventListener('mouseover', () => item.style.backgroundColor = 'rgba(255, 255, 255, 0.2)');
item.addEventListener('mouseout', () => item.style.backgroundColor = 'transparent');
dropdown.appendChild(item);
    });
    }

    function enableDrag(element) {
        let isDragging = false, offsetX, offsetY;
        element.addEventListener('mousedown', (e) => {
            if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
                isDragging = true;
                offsetX = e.clientX - element.getBoundingClientRect().left;
                offsetY = e.clientY - element.getBoundingClientRect().top;
                element.style.transition = 'none';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const newLeft = e.clientX - offsetX;
                const newTop = e.clientY - offsetY;
                element.style.left = `${newLeft}px`;
                element.style.top = `${newTop}px`;
                localStorage.setItem('panelPosition', JSON.stringify({ top: `${newTop}px`, left: `${newLeft}px` }));
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        });
    }

    function setPanelPosition(element, position) {
        element.style.top = position.top;
        element.style.left = position.left;
    }
    function removeFromList(channel, listType) {
    if (listType === 'favorites') {
        if (state.favoriteChannels.includes(channel)) {
            state.favoriteChannels = state.favoriteChannels.filter(ch => ch !== channel);
            state.favoriteChannels.sort((a, b) => a.localeCompare(b));
            localStorage.setItem('favoriteChannels', JSON.stringify(state.favoriteChannels));
            updateOptions(document.querySelector('.favorites-select'), state.favoriteChannels);
            alert(`Удалено из избранного: ${channel}`);
        }
    } else if (listType === 'history') {
        if (state.channelHistory.includes(channel)) {
            state.channelHistory = state.channelHistory.filter(ch => ch !== channel);
            state.channelHistory.sort((a, b) => a.localeCompare(b));
            localStorage.setItem('channelHistory', JSON.stringify(state.channelHistory));
            updateOptions(document.querySelector('.history-select'), state.channelHistory);
            alert(`Удалено из истории: ${channel}`);
        }
    }
}
const style = document.createElement('style');
style.textContent = `
  iframe::-webkit-media-controls {
     display: none !important;
 }
  iframe::cue {
     display: none !important;
 }
 #playBattn-controls-panel-e67jmxhj {
    box-shadow: #bf94ff 1px -3px 10px 2px  !important;
    border-radius: 18px  !important;
    padding: 5px  !important;
    background: #26163e !important;
}

#progress-67hd5re-controls-panel-e67jmxhj {
    height: 15px !important;
    background: #624888 !important;
    border-radius: 35px !important;
}

#progressbar-67hd5re-controls-panel-e67jmxhj {
    border-radius: 51px !important;
    background: #73a48a !important;
}
input#volume-jeh5-Slider-hexhg5-e67jmxhj {
    background: #836493 !important;
    appearance: none !important;
    height: 15px !important;
}


button#volumeMuteBttn-mute-67hd5re-e67jmxhj {
    box-shadow: #bf94ff 1px -3px 10px 2px  !important;
    border-radius: 18px  !important;
    padding: 5px  !important;
    background: #26163e !important;
}
 #current-time-controls-panel-e67jmxhj {
    color: rgb(125 229 247) !important;
    font-size: 18px !important;
    margin-right: 10px;
    min-width: 40px;
    text-align: right;
}

#duration-controls-panel-e67jmxhj {
    color: rgb(125 229 247) !important;
    font-size: 18px !important;
    margin-right: 10px;
    min-width: 40px;
    text-align: right;
}
`;
document.head.appendChild(style);
})();














