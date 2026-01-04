// ==UserScript==
// @name            YouTube Autoplay Buttons. Adding “Play all videos” buttons back
// @name:de         YouTube-Autoplay-Buttons. Bringt die „Alle Videos abspielen“-Buttons zurück
// @name:fr         Boutons de lecture automatique de YouTube. Retour des boutons « Lire toutes les vidéos
// @name:ru         Кнопки автовоспроизведения YouTube. Добавление кнопок «Воспроизвести все видео» назад
// @description     Adds 3 buttons on each YouTube profile under Videos (All videos + shorts, All videos, Shorts only)
// @description:de  Fügt 3 Schaltflächen auf jedem YouTube-Profil unter Videos hinzu (Alle Videos + Shorts , Alle Videos, Nur Shorts)
// @description:fr  Ajout de 3 boutons sur chaque profil YouTube sous Vidéos (Toutes les vidéos + Shorts », Toutes les vidéos, Shorts uniquement)
// @description:ru  Добавляет 3 кнопки на каждом профиле YouTube в разделе «Видео» («Все видео + Shorts», «Все видео», «Только Shorts»)
// @author          Nieme
// @version         0.7
// @namespace       https://greasyfork.org/users/1376771
// @homepageURL     https://greasyfork.org/scripts/511506
// @supportURL      https://greasyfork.org/scripts/511506/feedback
// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      safari
// @compatible      edge
// @match           https://www.youtube.com/*
// @grant           none
// @license         GPLv2
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/511506/YouTube%20Autoplay%20Buttons%20Adding%20%E2%80%9CPlay%20all%20videos%E2%80%9D%20buttons%20back.user.js
// @updateURL https://update.greasyfork.org/scripts/511506/YouTube%20Autoplay%20Buttons%20Adding%20%E2%80%9CPlay%20all%20videos%E2%80%9D%20buttons%20back.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const translations = {
        en: {
            settingsTitle: "YouTube Buttons Settings",
            playAllVideosShorts: "Play Standard and Shorts together",
            playStandardOnly: "Play Standard only",
            playShortsOnly: "Play Shorts only",
            playFirstVideo: "Play first video of playlist directly",
            close: "Close",
            save: "Save",
            playAll: "Play All",
            playAllStandard: "Play All Standard",
            playAllShorts: "Play All Shorts",
        },
        de: {
            settingsTitle: "YouTube Buttons Einstellungen",
            playAllVideosShorts: "Play Standard und Shorts zusammen",
            playStandardOnly: "Nur Standard abspielen",
            playShortsOnly: "Nur Shorts abspielen",
            playFirstVideo: "Direkt erstes Video der Playlist abspielen",
            close: "Schließen",
            save: "Speichern",
            playAll: "Alle abspielen",
            playAllStandard: "Alle Standard abspielen",
            playAllShorts: "Alle Shorts abspielen",
        },
        fr: {
            settingsTitle: "Paramètres des boutons YouTube",
            playAllVideosShorts: "Lire standard et shorts ensemble",
            playStandardOnly: "Lire uniquement standard",
            playShortsOnly: "Lire uniquement shorts",
            playFirstVideo: "Lire directement la première vidéo de la playlist",
            close: "Fermer",
            save: "Enregistrer",
            playAll: "Lire tout",
            playAllStandard: "Lire tout standard",
            playAllShorts: "Lire tout shorts",
        },
        ru: {
            settingsTitle: "Настройки кнопок YouTube",
            playAllVideosShorts: "Воспроизвести стандартное и короткие вместе",
            playStandardOnly: "Воспроизвести только стандартное",
            playShortsOnly: "Воспроизвести только короткие",
            playFirstVideo: "Воспроизвести первое видео в плейлисте сразу",
            close: "Закрыть",
            save: "Сохранить",
            playAll: "Воспроизвести все",
            playAllStandard: "Воспроизвести все стандартное",
            playAllShorts: "Воспроизвести все короткие",
        }
    };

    function getTranslation(key) {
        const language = localStorage.getItem('selectedLanguage') || 'en';
        return translations[language][key] || translations['en'][key];
    }

    function updateMenuText() {
        document.getElementById("settingsTitle").textContent = getTranslation('settingsTitle');
        document.getElementById("labelAllVideosShorts").textContent = getTranslation('playAllVideosShorts');
        document.getElementById("labelStandardOnly").textContent = getTranslation('playStandardOnly');
        document.getElementById("labelShortsOnly").textContent = getTranslation('playShortsOnly');
        document.getElementById("labelPlayFirstVideo").textContent = getTranslation('playFirstVideo');
        document.getElementById("closeSettings").textContent = getTranslation('close');
        document.getElementById("saveSettings").textContent = getTranslation('save');
    }

    function getChannelId() {
        let cId = null;
        if (typeof ytInitialData !== 'undefined') {
            cId = ytInitialData?.metadata?.channelMetadataRenderer?.externalId;
        }
        if (!cId) {
            cId = document.querySelector('.ytp-ce-link[href]')?.href?.split('/')?.pop() ||
                  document.querySelector('[itemprop="identifier"]')?.content;
        }
        return cId;
    }

    function createSettingsMenu() {
        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.top = '50%';
        menu.style.left = '50%';
        menu.style.transform = 'translate(-50%, -50%)';
        menu.style.padding = '20px';
        menu.style.zIndex = '10000';
        menu.style.display = 'none';      
        menu.style.maxWidth = '960px';
        menu.style.borderRadius = '24px';
        menu.style.boxShadow = '0px 0px 45px 30px rgb(0, 0, 0)';
        menu.style.color = 'var(--yt-spec-text-primary)';
        menu.style.fontFamily = '"Roboto", "Noto", sans-serif';
        menu.style.fontSize = 'var(--ytcp-font-subheading_-_font-size,15px)';
        menu.style.background = 'var(--paper-dialog-background-color, var(--primary-background-color))';

        const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';

        menu.innerHTML = `
            <h3 id="settingsTitle">${getTranslation('settingsTitle')}</h3>
            <label><input type="checkbox" id="toggleAllVideosShorts" ${localStorage.getItem('showAllVideosShorts') !== 'false' ? 'checked' : ''}><span id="labelAllVideosShorts"> ${getTranslation('playAllVideosShorts')}</span></label><br>
            <label><input type="checkbox" id="toggleStandardOnly" ${localStorage.getItem('showStandardOnly') !== 'false' ? 'checked' : ''}><span id="labelStandardOnly"> ${getTranslation('playStandardOnly')}</span></label><br>
            <label><input type="checkbox" id="toggleShortsOnly" ${localStorage.getItem('showShortsOnly') !== 'false' ? 'checked' : ''}><span id="labelShortsOnly"> ${getTranslation('playShortsOnly')}</span></label><br><br>
            <label><input type="checkbox" id="togglePlayFirstVideo" ${localStorage.getItem('playFirstVideo') === 'true' ? 'checked' : ''}><span id="labelPlayFirstVideo"> ${getTranslation('playFirstVideo')}</span></label><br><br>
            <label for="languageSelect">Language:</label>
            <select id="languageSelect">
                <option value="en" ${selectedLanguage === 'en' ? 'selected' : ''}>English</option>
                <option value="de" ${selectedLanguage === 'de' ? 'selected' : ''}>Deutsch</option>
                <option value="fr" ${selectedLanguage === 'fr' ? 'selected' : ''}>Français</option>
                <option value="ru" ${selectedLanguage === 'ru' ? 'selected' : ''}>Русский</option>
            </select><br><br>
            <button id="closeSettings" class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-s yt-spec-button-shape-next--enable-backdrop-filter-experiment" style="font-size:var(--ytcp-font-subheading_-_font-size,15px);float: left;background: rgba(255, 0, 0, 0.1);cursor: pointer;">${getTranslation('close')}</button>
            <button id="saveSettings" class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-s yt-spec-button-shape-next--enable-backdrop-filter-experiment" style="font-size:var(--ytcp-font-subheading_-_font-size,15px);float: right;background: rgba(0, 255, 0, 0.1);cursor: pointer;">${getTranslation('save')}</button>
        `;

        document.body.appendChild(menu);

        const closeButton = document.getElementById('closeSettings');
        const saveButton = document.getElementById('saveSettings');    
        const languageSelect = document.getElementById('languageSelect');

        languageSelect.addEventListener('change', () => {
            localStorage.setItem('selectedLanguage', languageSelect.value);
            updateMenuText();
        });

        closeButton.addEventListener('click', () => {
            menu.style.display = 'none';
        });

        saveButton.addEventListener('click', () => {
            localStorage.setItem('showAllVideosShorts', document.getElementById('toggleAllVideosShorts').checked);
            localStorage.setItem('showStandardOnly', document.getElementById('toggleStandardOnly').checked);
            localStorage.setItem('showShortsOnly', document.getElementById('toggleShortsOnly').checked);
            localStorage.setItem('playFirstVideo', document.getElementById('togglePlayFirstVideo').checked);
            menu.style.display = 'none';

            refreshCustomButtons();
        });

        return menu;
    }

    const settingsMenu = createSettingsMenu();

    function addSettingsButton() {
        const chipsContainer = document.querySelector('ytd-feed-filter-chip-bar-renderer #chips');
        if (!chipsContainer || document.getElementById('settingsButton')) return;

        const settingsButton = document.createElement('button');
        settingsButton.textContent = '⚙️';
        settingsButton.id = 'settingsButton';
        settingsButton.style.marginLeft = '10px';
        settingsButton.style.padding = '6px 12px';
        settingsButton.style.border = '0px';
        settingsButton.style.backgroundColor = 'var(--yt-spec-badge-chip-background)';
        settingsButton.style.color = 'var(--yt-spec-text-primary)';
        settingsButton.style.borderRadius = '7px';
        settingsButton.style.cursor = 'pointer';

        settingsButton.addEventListener('click', () => {
            settingsMenu.style.display = 'block';
        });

        chipsContainer.appendChild(settingsButton);
    }

    function refreshCustomButtons() {
        document.querySelectorAll('.custom-play-all-button').forEach(button => button.remove());
        addCustomButtons();
    }

    async function fetchFirstVideoId(playlistId) {
        try {
            const response = await fetch(`https://www.youtube.com/playlist?list=${playlistId}`);
            const text = await response.text();
            const videoIdMatch = text.match(/"videoId":"(.*?)"/);
            return videoIdMatch ? videoIdMatch[1] : null;
        } catch (error) {
            console.error("Error fetching first video ID:", error);
            return null;
        }
    }

    function addCustomButtons() {
        const chipsContainer = document.querySelector('ytd-feed-filter-chip-bar-renderer #chips');
        if (!chipsContainer) {
            console.error('Userscript YouTube Autoplay Error: Chips container not found.');
            return;
        }

        const showAllVideosShorts = localStorage.getItem('showAllVideosShorts') !== 'false';
        const showStandardOnly = localStorage.getItem('showStandardOnly') !== 'false';
        const showShortsOnly = localStorage.getItem('showShortsOnly') !== 'false';
        const playFirstVideo = localStorage.getItem('playFirstVideo') === 'true';

        let buttons = [];
        if (showAllVideosShorts && !showStandardOnly && !showShortsOnly) {
            buttons = [{ text: getTranslation('playAll'), generator: (cId) => `UU${cId.slice(2)}` }];
        } else if (!showAllVideosShorts && showStandardOnly && !showShortsOnly) {
            buttons = [{ text: getTranslation('playAll'), generator: (cId) => `UULF${cId.slice(2)}` }];
        } else if (!showAllVideosShorts && !showStandardOnly && showShortsOnly) {
            buttons = [{ text: getTranslation('playAll'), generator: (cId) => `UUSH${cId.slice(2)}` }];
        } else if (showAllVideosShorts && showStandardOnly && !showShortsOnly) {
            buttons = [
                { text: getTranslation('playAllVideosShorts'), generator: (cId) => `UU${cId.slice(2)}` },
                { text: getTranslation('playStandardOnly'), generator: (cId) => `UULF${cId.slice(2)}` }
            ];
        } else if (showAllVideosShorts && !showStandardOnly && showShortsOnly) {
            buttons = [
                { text: getTranslation('playAllVideosShorts'), generator: (cId) => `UU${cId.slice(2)}` },
                { text: getTranslation('playShortsOnly'), generator: (cId) => `UUSH${cId.slice(2)}` }
            ];
        } else if (!showAllVideosShorts && showStandardOnly && showShortsOnly) {
            buttons = [
                { text: getTranslation('playAllStandard'), generator: (cId) => `UULF${cId.slice(2)}` },
                { text: getTranslation('playAllShorts'), generator: (cId) => `UUSH${cId.slice(2)}` }
            ];
        } else if (showAllVideosShorts && showStandardOnly && showShortsOnly) {
            buttons = [
                { text: getTranslation('playAllVideosShorts'), generator: (cId) => `UU${cId.slice(2)}` },
                { text: getTranslation('playStandardOnly'), generator: (cId) => `UULF${cId.slice(2)}` },
                { text: getTranslation('playShortsOnly'), generator: (cId) => `UUSH${cId.slice(2)}` }
            ];
        }

        buttons.forEach(button => {
            const newButton = document.createElement('button');
            newButton.classList.add('custom-play-all-button');
            newButton.textContent = button.text;
            newButton.style.marginLeft = '10px';
            newButton.style.padding = '6px 12px';
            newButton.style.border = '0px';
            newButton.style.backgroundColor = 'var(--yt-spec-badge-chip-background)';
            newButton.style.color = 'var(--yt-spec-text-primary)';
            newButton.style.borderRadius = '7px';
            newButton.style.cursor = 'pointer';
            newButton.style.fontFamily = '"Roboto","Arial",sans-serif';
            newButton.style.fontSize = '1.4rem';
            newButton.style.lineHeight = '2rem';
            newButton.style.fontWeight = '500';

            newButton.addEventListener('mouseover', () => {
                newButton.style.backgroundColor = 'var(--yt-spec-button-chip-background-hover)';
            });

            newButton.addEventListener('mouseout', () => {
                newButton.style.backgroundColor = 'var(--yt-spec-badge-chip-background)';
            });

            newButton.addEventListener('click', async (e) => {
                e.preventDefault();
                const cId = getChannelId();
                if (!cId) {
                    console.error('Userscript YouTube Autoplay Error: Channel ID could not be retrieved.');
                    return;
                }
                
                const playlistId = button.generator(cId);
                let link = `https://www.youtube.com/playlist?list=${playlistId}`;
                
                if (playFirstVideo) {
                    const videoId = await fetchFirstVideoId(playlistId);
                    if (videoId) {
                        link = `https://www.youtube.com/watch?v=${videoId}&list=${playlistId}`;
                    }
                }
                
                console.log("Opening link:", link);
                window.location.href = link;
            });

            chipsContainer.appendChild(newButton);
        });
    }

    function checkAndAddButtons() {
        if (window.location.pathname.includes('/videos')) {
            addSettingsButton();
            addCustomButtons();
        }
    }

    const observer = new MutationObserver(() => {
        if (document.querySelector('ytd-feed-filter-chip-bar-renderer #chips')) {
            checkAndAddButtons();
            observer.disconnect();
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();
