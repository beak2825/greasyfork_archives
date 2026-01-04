// ==UserScript==
// @name         Replace VideoPlayer Twitch, VK, Kick 1.2.23
// @namespace    http://tampermonkey.net/
// @version      1.2.23
// @description  Switch between Twitch, VK, and Kick video players via channel selection with dynamic resizing
// @author       Grok (via xAI)
// @license      MIT
// @match        https://kick.com/*
// @match        https://www.twitch.tv/*
// @icon         https://m.media-amazon.com/images/I/51oRRBGKTLL._AC_UL800_QL65_.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530883/Replace%20VideoPlayer%20Twitch%2C%20VK%2C%20Kick%201223.user.js
// @updateURL https://update.greasyfork.org/scripts/530883/Replace%20VideoPlayer%20Twitch%2C%20VK%2C%20Kick%201223.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Предустановленные каналы с указанием платформы
    let channelOptions = [
        { name: 'crystalskull111', platform: 'twitch', url: 'https://www.twitch.tv/crystalskull111' }
    ];

    // Функция ожидания загрузки элемента
    function waitForElement(selector, callback, maxAttempts = 20, interval = 500) {
        let attempts = 0;
        const checkElement = setInterval(() => {
            const element = document.querySelector(selector);
            attempts++;
            if (element) {
                clearInterval(checkElement);
                callback(element);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkElement);
                console.error(`Element "${selector}" not found after ${maxAttempts} attempts`);
            }
        }, interval);
    }

    // Функция загрузки Twitch Embed скрипта
    function loadTwitchEmbedScript(callback) {
        if (window.Twitch && window.Twitch.Player) {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://player.twitch.tv/js/embed/v1.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    // Функция получения имени канала из URL
    function getChannelName() {
        const path = window.location.pathname;
        const channelName = path.split('/')[1];
        return channelName ? channelName.toLowerCase() : null;
    }

    // Функция обновления размеров контейнера
    function updateContainerSize(container, parentContainer) {
        const parentStyles = window.getComputedStyle(parentContainer);
        const newWidth = parentContainer.offsetWidth;
        const newHeight = parentContainer.offsetHeight;
        container.style.width = `${newWidth}px`;
        container.style.height = `${newHeight}px`;
        container.style.maxHeight = parentStyles.maxHeight;

        const iframe = container.querySelector('iframe');
        if (iframe) {
            iframe.style.width = '100%';
            iframe.style.height = '100%';
        }
    }

    // Основная функция интерфейса
    function createToggleInterface() {
        const channelName = getChannelName();
        if (!channelName) {
            console.log('Not on a channel page, skipping creation');
            return;
        }

        // Добавляем текущий канал в список, если его там нет
        if (!channelOptions.some(opt => opt.name === channelName)) {
            channelOptions.push({ name: channelName, platform: 'twitch', url: `https://www.twitch.tv/${channelName}` });
        }

        waitForElement('.video-player__container', (originalContainer) => {
            let currentMode = 'twitch'; // Текущий режим: 'twitch', 'vk', 'kick'
            let twitchPlayer = null;
            let currentChannel = channelName;

            const parentContainer = originalContainer.parentNode;

            // Создаем обёртку для интерфейса
            const interfaceWrapper = document.createElement('div');
            interfaceWrapper.id = 'toggle-video-player-wrapper';
            interfaceWrapper.style.display = 'inline-flex';
            interfaceWrapper.style.alignItems = 'center';
            interfaceWrapper.style.marginLeft = '8px';
            interfaceWrapper.style.zIndex = '10000';
            interfaceWrapper.style.gap = '8px';

            // Выпадающий список каналов
            const channelSelect = document.createElement('select');
            channelSelect.style.padding = '4px';
            channelSelect.style.borderRadius = '4px';
            channelSelect.style.border = '1px solid #6441a5';
            channelSelect.style.cursor = 'pointer';
            channelSelect.style.color = '#ffffff';
            channelSelect.style.backgroundColor = '#171c1c';

            // Обновление списка каналов
            const updateChannelSelect = () => {
                channelSelect.innerHTML = '';
                channelOptions.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.name;
                    optionElement.textContent = `${option.name} (${option.platform})`;
                    if (option.name === currentChannel) {
                        optionElement.selected = true;
                    }
                    channelSelect.appendChild(optionElement);
                });
            };
            updateChannelSelect();

            // Поле ввода имени канала
            const channelNameInput = document.createElement('input');
            channelNameInput.type = 'text';
            channelNameInput.placeholder = 'Channel name';
            channelNameInput.style.padding = '4px';
            channelNameInput.style.borderRadius = '4px';
            channelNameInput.style.border = '1px solid #6441a5';
            channelNameInput.style.backgroundColor = '#171c1c';
            channelNameInput.style.color = '#ffffff';

            // Поле ввода URL
            const channelUrlInput = document.createElement('input');
            channelUrlInput.type = 'text';
            channelUrlInput.placeholder = 'Stream URL';
            channelUrlInput.style.padding = '4px';
            channelUrlInput.style.borderRadius = '4px';
            channelUrlInput.style.border = '1px solid #6441a5';
            channelUrlInput.style.backgroundColor = '#171c1c';
            channelUrlInput.style.color = '#ffffff';

            // Выбор платформы
            const platformSelect = document.createElement('select');
            platformSelect.style.padding = '4px';
            platformSelect.style.borderRadius = '4px';
            platformSelect.style.border = '1px solid #6441a5';
            platformSelect.style.cursor = 'pointer';
            platformSelect.style.color = '#ffffff';
            platformSelect.style.backgroundColor = '#171c1c';
            ['twitch', 'vk', 'kick'].forEach(platform => {
                const opt = document.createElement('option');
                opt.value = platform;
                opt.textContent = platform;
                platformSelect.appendChild(opt);
            });

            // Кнопка добавления канала
            const addChannelButton = document.createElement('button');
            addChannelButton.textContent = 'Add';
            addChannelButton.style.padding = '4px 8px';
            addChannelButton.style.backgroundColor = '#28a745';
            addChannelButton.style.color = 'white';
            addChannelButton.style.border = 'none';
            addChannelButton.style.borderRadius = '4px';
            addChannelButton.style.cursor = 'pointer';
            addChannelButton.style.fontSize = '14px';

            // Добавляем элементы в интерфейс (без кнопки Switch)
            interfaceWrapper.appendChild(channelSelect);
            interfaceWrapper.appendChild(channelNameInput);
            interfaceWrapper.appendChild(channelUrlInput);
            interfaceWrapper.appendChild(platformSelect);
            interfaceWrapper.appendChild(addChannelButton);

            // Создание iframe для VK/Kick
            const createIframeContainer = (platform, url) => {
                const iframeContainer = document.createElement('div');
                iframeContainer.className = 'video-player__container';
                iframeContainer.setAttribute('data-test-selector', 'video-player__video-container');
                iframeContainer.style.position = 'relative';
                iframeContainer.style.overflow = 'hidden';

                updateContainerSize(iframeContainer, parentContainer);

                const iframe = document.createElement('iframe');
                iframe.src = url;
                iframe.width = '100%';
                iframe.height = '100%';
                iframe.frameBorder = '0';
                iframe.allowFullscreen = true;
                iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
                iframe.style.position = 'absolute';
                iframe.style.top = '0';
                iframe.style.left = '0';

                iframeContainer.appendChild(iframe);
                return iframeContainer;
            };

            // Создание Twitch плеера
            const createTwitchPlayer = () => {
                const twitchContainer = document.createElement('div');
                twitchContainer.id = 'twitch-player-replacement';
                twitchContainer.className = 'video-player__container';
                twitchContainer.setAttribute('data-test-selector', 'video-player__video-container');
                twitchContainer.style.position = 'relative';
                twitchContainer.style.overflow = 'hidden';

                updateContainerSize(twitchContainer, parentContainer);

                replaceCurrentContainer(twitchContainer);

                loadTwitchEmbedScript(() => {
                    twitchPlayer = new Twitch.Player('twitch-player-replacement', {
                        channel: currentChannel,
                        width: '100%',
                        height: '100%',
                        muted: false,
                        autoplay: true
                    });

                    setTimeout(() => {
                        const playerIframe = twitchContainer.querySelector('iframe');
                        if (playerIframe) {
                            playerIframe.style.width = '100%';
                            playerIframe.style.height = '100%';
                        }
                    }, 500);
                });
            };

            // Замена текущего контейнера
            const replaceCurrentContainer = (newContainer) => {
                const currentContainer = parentContainer.querySelector('.video-player__container') ||
                                       parentContainer.querySelector('#twitch-player-replacement') ||
                                       parentContainer.querySelector('iframe')?.parentNode;
                if (currentContainer) {
                    parentContainer.replaceChild(newContainer, currentContainer);
                } else {
                    parentContainer.appendChild(newContainer);
                }
            };

            // Обновление плеера на основе текущего режима и канала
            const updatePlayer = () => {
                const selectedChannel = channelOptions.find(opt => opt.name === currentChannel);
                currentMode = selectedChannel.platform; // Устанавливаем режим на основе платформы канала

                if (currentMode === 'twitch') {
                    if (twitchPlayer) twitchPlayer.pause();
                    createTwitchPlayer();
                } else {
                    const url = selectedChannel.url;
                    const iframeContainer = createIframeContainer(currentMode, url);
                    replaceCurrentContainer(iframeContainer);
                    if (twitchPlayer) {
                        twitchPlayer.pause();
                        twitchPlayer = null;
                    }
                }
                console.log(`Updated to ${currentMode} for channel ${currentChannel}`);
            };

            // Обработчик выбора канала
            channelSelect.addEventListener('change', (event) => {
                currentChannel = event.target.value;
                updatePlayer(); // Обновляем плеер на основе выбранного канала
            });

            // Обработчик добавления канала
            addChannelButton.addEventListener('click', () => {
                const newChannelName = channelNameInput.value.trim();
                const newChannelUrl = channelUrlInput.value.trim();
                const newPlatform = platformSelect.value;

                if (newChannelName && newChannelUrl) {
                    channelOptions.push({ name: newChannelName, platform: newPlatform, url: newChannelUrl });
                    updateChannelSelect();
                    channelNameInput.value = '';
                    channelUrlInput.value = '';
                    console.log('Added new channel:', newChannelName, newPlatform, newChannelUrl);
                } else {
                    alert('Please enter both channel name and URL');
                }
            });

            // Наблюдатель за изменением размеров
            const resizeObserver = new ResizeObserver(() => {
                const currentContainer = parentContainer.querySelector('.video-player__container') ||
                                       parentContainer.querySelector('#twitch-player-replacement');
                if (currentContainer) {
                    updateContainerSize(currentContainer, parentContainer);
                }
            });
            resizeObserver.observe(parentContainer);

            // Добавление интерфейса
            const addInterface = () => {
                if (!document.querySelector('#toggle-video-player-wrapper')) {
                    waitForElement('[data-target="channel-header-right"]', (container) => {
    container.appendChild(interfaceWrapper);
    console.log('Interface added');
});
                }
            };

            window.addEventListener('load', addInterface);
            if (document.readyState === 'complete') {
                addInterface();
            }

            const observer = new MutationObserver(() => {
                if (!document.querySelector('#toggle-video-player-wrapper')) {
                    addInterface();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            // Инициализация плеера
            updatePlayer();
        });
    }

    window.addEventListener('load', createToggleInterface);
    if (document.readyState === 'complete') {
        createToggleInterface();
    }
})();

