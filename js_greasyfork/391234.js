// ==UserScript==
// @name VK Audio Integration
// @name:ru Аудио интеграция VK
// @description Integrates VK.com audio player with MediaSession API
// @description:ru Интегрирует аудиоплеер ВКонтакте с API MediaSession
// @author Sasha Sorokin
// @version 1.7.0
// @license MIT https://raw.githubusercontent.com/Sasha-Sorokin/vkaintegra/master/LICENSE
// @namespace https://github.com/Sasha-Sorokin/vkaintegra
// @homepage https://github.com/Sasha-Sorokin/vkaintegra
// @supportURL https://github.com/Sasha-Sorokin/vkaintegra/issues
// @grant GM.notification
// @grant GM_notification
// @grant GM.setValue
// @grant GM_setValue
// @grant GM.getValue
// @grant GM_getValue
// @include https://vk.com/*
// @run-at document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/391234/VK%20Audio%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/391234/VK%20Audio%20Integration.meta.js
// ==/UserScript==

(async () => {
    "use strict";

    console.log("[VKAINTEGRA] Initializing...");

    const GENERAL_HANDLERS = ["play", "pause", "previoustrack", "nexttrack", "seek"];

    // =========================
    // === HELPFUL FUNCTIONS ===
    // =========================

    function onPlayerEvent(eventName, callback) {
        const callbackName = callback.name || "<anonymous>";

        const subscriber = {
            et: eventName,
            cb: function safeCallback(...args) {
                try {
                    callback(...args);
                } catch (err) {
                    console.error(`[VKAINTEGRA] (!) Player callback ${callbackName} for event ${eventName} has failed:`, err);
                }
            }
        };

        const subscriberId = getAudioPlayer().subscribers.push(subscriber);

        console.log(`[VKAINTEGRA] Bound callback ${callbackName} for "${eventName}", subscriber ID #${subscriberId}`);
    }

    function htmlDecode(input) {
        const doc = new DOMParser().parseFromString(input, "text/html");

        return doc.documentElement.textContent;
    }

    // 14 artworks
    function extractArtworks(audio) {
        const artworks = [...new Set(audio[14].split(","))];

        for (let i = 0, l = artworks.length; i < l; i++) {
            artworks[i] = { src: artworks[i], sizes: "80x80" };
        }

        return artworks;
    }

    // 3 title
    // 4 artist
    // 16 remix
    function extractVKMetadata(audio) {
        let title = htmlDecode(audio[3]);

        const remixType = audio[16];
        if (remixType !== "") title += ` (${htmlDecode(remixType)})`;

        return {
            artist: htmlDecode(audio[4]),
            title,
            artwork: extractArtworks(audio)
        };
    }

    function extractTimes(audio) {
        // 15 durations

        return audio[15];
    }

    const USING_RU_LOCALE = (function isUsingRuLocale() {
        return [0, 1, 100, 114, 777].includes(langConfig.id);
    })();

    function insertBefore(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode);
    }

    // from underscore.js
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    // ====================
    // ===   SETTINGS   ===
    // ====================

    // BUG-5: GM can be different and we must be catchy
    const settings = {
        setValue: (() => {
            try {
                return GM && GM.setValue;
            } catch {
                return GM_setValue;
            }
        })(),
        getValue: (() => {
            try {
                return GM && GM.getValue;
            } catch {
                return GM_getValue;
            }
        })()
    };

    /**
     * Are notifications enabled
     */
    let notificationsEnabled;

    /**
     * Are notifications disposed by script
     * @default null Notifications are not disposed
     */
    let notificationsDispose;

    /**
     * Does single press on Previous key seeks to beginning?
     */
    let previousSeeking;

    /**
     * Should be "next track" button be actived on latest track in playlist?
     */
    let lastNext;

    // Load all the settings
    await (async () => {
        notificationsEnabled = await settings.getValue("notificationsEnabled", false);
        notificationsDispose = await settings.getValue("notificationsDispose", "3s");
        previousSeeking = await settings.getValue("previousSeeking", false);
        lastNext = await settings.getValue("lastNext", true);
    })();

    function saveSettings() {
        settings.setValue("notificationsEnabled", notificationsEnabled);
        settings.setValue("notificationsDispose", notificationsDispose);
        settings.setValue("previousSeeking", previousSeeking);
        settings.setValue("lastNext", lastNext);
    }

    // =========================
    // === SETTINGS CONTROLS ===
    // =========================

    {
        // #region Elements functions

        function appendTo(elem, children) {
            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i];

                if (typeof child === "function") child(elem);
                else elem.appendChild(child);
            }
        }

        function inlineMenuValueText(values, value) {
            for (let i = 0, l = values.length; i < l; i++) {
                const item = values[i];
                if (item[0] === value) return item[1];
            }
        }

        function createInlineMenu(id, currentValue, values, onSelect) {
            const div = document.createElement("div");

            div.id = id;
            div.classList.add(id);

            const selectedValue = document.createElement("div");

            selectedValue.classList.add("idd_selected_value");
            selectedValue.setAttribute("tabIndex", 0);
            selectedValue.setAttribute("role", "link");
            selectedValue.innerText = inlineMenuValueText(values, currentValue);

            div.appendChild(selectedValue);

            const input = document.createElement("input");

            input.id = `${id}_input`;
            input.setAttribute("type", "hidden");
            input.setAttribute("name", id);
            input.value = currentValue;

            div.appendChild(input);

            return function mount(parent) {
                parent.appendChild(div);

                const dropdown = new InlineDropdown(div, {
                    items: values,
                    selected: currentValue,
                    onSelect
                });

                mount.component = dropdown;
            }
        }

        function createCheckbox(id, text, isChecked, onChange) {
            const checkbox = document.createElement("input");

            checkbox.classList.add("blind_label");
            checkbox.setAttribute("type", "checkbox");
            checkbox.checked = isChecked;
            checkbox.id = id;
            checkbox.addEventListener("change", onChange);

            const label = document.createElement("label");

            label.setAttribute("for", id);
            label.innerText = text;

            return [checkbox, label];
        }

        function createSettingsNarrowRow(children) {
            const div = document.createElement("div");

            div.classList.add("settings_narrow_row");

            appendTo(div, children);

            return div;
        }

        function createSettingsLine(labelText, id, children) {
            const div = document.createElement("div");

            div.id = id;
            div.classList.add("settings_line");

            const label = document.createElement("div");

            label.classList.add("settings_label");
            label.innerText = labelText;

            div.appendChild(label);

            const inner = document.createElement("div");

            inner.classList.add("settings_labeled_text");

            appendTo(inner, children);

            div.appendChild(inner);

            return div;
        }

        function createHint(text) {
            const hint = document.createElement("span");

            hint.classList.add("hint_icon");

            hint.addEventListener("mouseover", function showHint() {
                showTooltip(this, {
                    text,
                    dir: "auto",
                    shift: [22, 10],
                    slide: 15,
                    className: "settings_tt"
                })
            });

            return hint;
        }

        function cid(id) {
            return `vkaintegra_${id}`;
        }

        const initNotifyValues = [
            // [value, [russian, english]]
            ["auto", ["автоматически", "automatically"]],
            ["3s", ["спустя 3 секунды", "3 seconds after"]],
            ["5s", ["спустя 5 секунд", "5 seconds after"]],
        ];

        function getNotifyDisposeValues() {
            const values = [];

            for (let i = 0, l = initNotifyValues.length; i < l; i++) {
                const item = initNotifyValues[i];

                values.push([item[0], item[1][USING_RU_LOCALE ? 0 : 1]]);
            }

            return values;
        }

        function disableElement(element) {
            element.style.opacity = "0.5";
            element.style["pointer-events"] = "none";
        }

        function enableElement(element) {
            element.style.opacity = "";
            element.style["pointer-events"] = "";
        }

        function bindTooltip(elem, text) {
            elem.addEventListener("mouseover", function showLabelTooltip() {
                showTooltip(this, {
                    shift: [-20, 8, 8],
                    dir: "auto",
                    text: text,
                    slide: 15,
                    className: 'settings_tt',
                    hasover: 1
                });
            });
        }

        // #endregion

        // ================
        // ===  EVENTS  ===
        // ================

        async function saveSettingsInteractive() {
            saveSettings();

            unsafeWindow.uiPageBlock && uiPageBlock.showSaved("vkaintegra");
        }

        function previousSeekingChanged(e) {
            previousSeeking = e.target.checked;

            saveSettingsInteractive();
        }

        function lastNextChanged(e) {
            lastNext = e.target.value;

            try {
                // We may need to refresh the controls to apply changes
                const player = getAudioPlayer();

                const { _currentAudio: audio } = player;

                if (audio != null) {
                    console.log("[VKAINTEGRA] Refreshing controls due to lastNext change");

                    onStop();
                    onStart();
                    onTrackChange(player._currentAudio, false);
                    if (!player._isPlaying) onPause();
                }
            } catch (err) {
                console.error("[VKAINTEGRA] Failed to refresh controls", err);
            }

            saveSettingsInteractive();
        }

        let notificationsChangeLock = false;

        async function notificationsChanged(e) {
            if (notificationsChangeLock) return true;

            let shouldSave = true;

            if (e.target.checked) {
                if (Notification.permission !== "granted") {
                    // locking element
                    e.target.disabled = true;
                    disableElement(e.target.parentElement);
                    notificationsChangeLock = true;

                    const status = await Notification.requestPermission();

                    if (status !== "granted") {
                        showDoneBox(
                            USING_RU_LOCALE
                                ? "Кажется вы отклонили запрос, либо они блокируются браузером."
                                : "It seems you have denied request, or they're disabled in the browser."
                        );

                        e.target.checked = false;

                        shouldSave = false;
                    }

                    e.target.disabled = false;
                    enableElement(e.target.parentElement);
                    notificationsChangeLock = false;
                }

                notificationsEnabled = Notification.permission === "granted";
            } else {
                notificationsEnabled = false;
            }

            if (notificationsEnabled) {
                enableElement(settingsPanel.notifyDisposeSelect.component.getElement().parentNode);
            } else {
                disableElement(settingsPanel.notifyDisposeSelect.component.getElement().parentNode);
            }

            if (shouldSave) saveSettingsInteractive();
        }

        function notifyDisposeSelected(val) {
            notificationsDispose = val;

            saveSettingsInteractive();
        }

        // =============================
        // === SETTINGS PANEL ITSELF ===
        // =============================

        let settingsPanel = Object.create(null);

        async function getSettingsLine() {
            // #region Panel initialization

            if (!settingsPanel.previousSeekingCheckbox) {
                const [,label] = settingsPanel.previousSeekingCheckbox = createCheckbox(
                    cid("previous_seeking"),
                    USING_RU_LOCALE
                        ? "«Прошлый трек» перематывает в начало"
                        : "“Previous track” seeking to beginning",
                    previousSeeking,
                    previousSeekingChanged
                );

                const tooltipText = USING_RU_LOCALE
                    ? "Если настройка включена, то, при нажатии кнопки или клавиши «Прошлый трек», вместо перехода будет осуществляться перемотка к началу трека.<br><br>Переход всегда будет осуществляться, если трек играет менее 2 секунд."
                    : "With this setting on, clicking button or pressing “Previous track” will seek to beginning of the current track instead of switching.<br><br>Switching will always happen if track is playing for less than 2 seconds.";

                bindTooltip(label, tooltipText);
            }

            if (!settingsPanel.lastNextCheckbox) {
                const [,label] = settingsPanel.lastNextCheckbox = createCheckbox(
                    cid("last_next"),
                    USING_RU_LOCALE
                        ? "Не отключать «Следующий трек» в конце плейлиста"
                        : "Do not disable “Next track” at last song in playlist",
                    lastNext,
                    lastNextChanged
                );

                const tooltipText = USING_RU_LOCALE
                    ? "Включение этой настройки убирает отключение кнопки «Следующий трек» при проигрывании последнего трека в плейлисте. Нажатие этой кнопки остановит воспроизведение и переключится на первый трек в плейлисте."
                    : "Enabling this option avoids disabling of “Next track” button when playing last track in playlist. Pressing this button stops playing and switches to first track in playlist."

                bindTooltip(label, tooltipText);
            }

            if (!settingsPanel.notificationsCheckbox) {
                settingsPanel.notificationsCheckbox = createCheckbox(
                    cid("notifications"),
                    USING_RU_LOCALE ? "Включить уведомления" : "Enable notifications",
                    notificationsEnabled,
                    notificationsChanged
                );
            }

            if (!settingsPanel.notifyDisposeSelect) {
                settingsPanel.notifyDisposeSelect = createInlineMenu(
                    cid("notifications_dispose"),
                    notificationsDispose,
                    getNotifyDisposeValues(),
                    notifyDisposeSelected
                );
            }

            if (!settingsPanel.panel) {
                const CLOSE_NOTIFS_TEXT = document.createTextNode(
                    USING_RU_LOCALE
                        ? "Убирать уведомления "
                        : "Close notifications "
                );

                const DISPOSE_HINT = createHint(
                    USING_RU_LOCALE
                        ? "Эта настройка позволяет установить, как быстро скрипт должен убирать уведомления.<br><br>В <b>автоматическом</b> режиме уведомления убираются браузером или системой.<br><br>В <b>других</b> режимах уведомления будут убраны спустя выбранный интервал времени."
                        : "This setting allows to set how fast script must close notifications.<br><br>In <b>automatic</b> mode notifications will be closed by browser or system.<br><br>In <b>other</b> modes notifications will be closed after selected interval."
                );

                settingsPanel.panel = createSettingsLine("VK Audio Integration", "vkaintegra", [
                    createSettingsNarrowRow(settingsPanel.previousSeekingCheckbox),
                    createSettingsNarrowRow(settingsPanel.lastNextCheckbox),
                    createSettingsNarrowRow(settingsPanel.notificationsCheckbox),
                    createSettingsNarrowRow([CLOSE_NOTIFS_TEXT, settingsPanel.notifyDisposeSelect, DISPOSE_HINT])
                ]);

                if (!notificationsEnabled) {
                    disableElement(settingsPanel.notifyDisposeSelect.component.getElement().parentNode);
                }
            }

            // #endregion

            settingsPanel.previousSeekingCheckbox[0].toggled = previousSeeking;
            settingsPanel.notificationsCheckbox[0].toggled = notificationsEnabled;
            settingsPanel.notifyDisposeSelect.component.select(notificationsDispose, true);

            return settingsPanel.panel;
        }

        async function initSettings() {
            const pwdChange = document.querySelector("div.settings_line#chgpass");

            insertBefore(pwdChange, await getSettingsLine());
        }

        // =========================
        // === SETTINGS WRAPPING ===
        // =========================

        // #region Settings Wrapping

        function wrapSettings(settings) {
            const origSettingsInit = settings.init.bind(Settings);

            settings.init = function wrappedInitSettings() {
                origSettingsInit();

                initSettings();
            };
        }

        if (cur.module === "settings") {
            wrapSettings(Settings);

            initSettings();
        } else {
            let origSettings;

            Object.defineProperty(unsafeWindow, "Settings", {
                get() {
                    return origSettings;
                },
                set(value) {
                    origSettings = value;

                    wrapSettings(value);
                },
            });
        }

        // #endregion
    }

    // =====================
    // === NOTIFICATIONS ===
    // =====================

    if (notificationsEnabled && Notification.permission !== "granted") {
        const SETTINGS_LINK = `<a href=\"/settings\" onclick=\"nav.go(this, event, {noback: !0}))\">${USING_RU_LOCALE ? "на странице настроек" : "on settings page"}</a>`

        showDoneBox(
            USING_RU_LOCALE
                ? `С момента прошлой активации уведомлений от VK Audio Integration разрешения на отправку этих самых уведомлений больше нет. Включить их обратно можно ${SETTINGS_LINK}.`
                : `Since last activation of notifications from VK Audio Integration, there is no more permission to send those notifications. You can re-enable them ${SETTINGS_LINK}.`
        );

        notificationsEnabled = false;

        saveSettings();
    }

    const UNKNOWN_AUDIO_ICON = {
        SMALL: "https://i.imgur.com/tTGovqM.png",
        LARGE: "https://i.imgur.com/EbP2xGC.png"
    };

    let currentNotificationTimer = undefined;

    const DISPOSE_OPTIONS = {
        "3s": 3000,
        "5s": 5000
    };

    function showNotification(trackMetadata, actualityCallback, unknownAlbum) {
        if (!notificationsEnabled) return;

        let icon = trackMetadata.artwork[0].src;

        if (icon === UNKNOWN_AUDIO_ICON.LARGE) {
            icon = UNKNOWN_AUDIO_ICON.SMALL;
        }

        const albumLine = unknownAlbum
            ? "VK"
            : `${trackMetadata.album} · VK`;

        const notification = new Notification(trackMetadata.title, {
            body: `${trackMetadata.artist}\n${albumLine}`,
            silent: true,
            icon,
            tag: "vk-nowplaying"
        });

        if (!actualityCallback()) {
            notification.close();
        } else if (notificationsDispose !== "auto") {
            if (currentNotificationTimer) clearTimeout(currentNotificationTimer);

            setTimeout(() => {
                notification.close();
                currentNotificationTimer = null;
            }, DISPOSE_OPTIONS[notificationsDispose]);
        }
    }

    const notificationDebounce = debounce(showNotification, 500);

    // =====================
    // === PLAYER EVENTS ===
    // =====================

    const setPositionState = navigator.mediaSession.setPositionState
        ? navigator.mediaSession.setPositionState
        : (() => {
            console.log("[VKAINTEGRA] Browser support: setPositionState is not implemeted.");

            return undefined;
        })();

    let isStarted = false;

    function onStart() {
        isStarted = true;

        bindGeneralHandlers();

        navigator.mediaSession.playbackState = "playing";
    }

    onPlayerEvent("start", onStart);

    function previousTrack(player) {
        // FEAT-1: Rewind to start instead of playing previous
        if (previousSeeking && player.stats.currentPosition > 2) {
            player.seekToTime(0);
        } else {
            player.playPrev();
        }
    }

    let isLatestTrack = false;

    function updateControls(player, playlist, track) {
        let noPrevious;

        if (playlist) {
            const audioPosition = playlist.indexOfAudio(track);

            const playlistLength = playlist.getAudiosCount() - 1;
    
            noPrevious = audioPosition === 0;
    
            isLatestTrack = audioPosition === playlistLength;
        } else {
            noPrevious = true;

            isLatestTrack = true;
        }

        if (!lastNext) {
            if (isLatestTrack) resetHandlers("nexttrack");
            else bindHandler("nexttrack", () => player.playNext());
        }

        if (noPrevious) resetHandlers("previoustrack");
        else bindHandler("previoustrack", () => previousTrack(player));
    }

    function onPlaylistChange() {
        // BUG-2: Shuffle does not fire any events

        const playlist = getAudioPlayer()._currentPlaylist;

        if (playlist == null) return;

        const originalShuffle = playlist.shuffle.bind(playlist);

        playlist.shuffle = (...args) => {
            console.log("[VKAINTEGRA] Caught a shuffle attempt!");

            const player = getAudioPlayer();

            originalShuffle(...args);

            updateControls(player, player._currentPlaylist, player._currentAudio);
        };
    }

    onPlayerEvent("plchange", onPlaylistChange);

    function onTrackChange(track, notification = true) {
        // BUG-7: Sometimes VK tells us it has no current track
        if (!track) return onStop();

        const trackMetadata = extractVKMetadata(track);

        const player = getAudioPlayer();

        // Use current playlist name as the album title

        let playlist = player._currentPlaylist;

        // BUG-1: Sometimes we going to deal with referenced playlists
        if (playlist._ref) {
            playlist = playlist._ref;

            // But it's good to us to take a bigger cover image
            // BUG-3: If that's an official album, of course
            if (playlist._isOfficial && playlist._coverUrl !== "") {
                trackMetadata.artwork = [{ src: playlist._coverUrl, sizes: "300x300" }];
            }
        }

        // BUG-9: playlist titles can be empty for some reason
        const playlistTitle = htmlDecode(playlist._title);

        let unknownPlaylist = false;

        if (playlistTitle === "") {
            playlistTitle = USING_RU_LOCALE
                ? "(неизвестно)"
                : "(unknown)";

            unknownPlaylist = true;
        }

        trackMetadata.album = playlistTitle;

        // BUG-10: chrome sets url of the current page if artwork == "",
        // so let's use unknown icon as we did with notifications for
        // every empty artwork in the array
        {
            const artworks = trackMetadata.artwork;

            for (let i = 0, l = artworks.length; i < l; i++) {
                const artwork = artworks[i];

                if (artwork.src === "") {
                    artwork.src = UNKNOWN_AUDIO_ICON.LARGE;
                    artwork.sizes = "450x450";
                };
            }
        }

        // Prepare the media session

        navigator.mediaSession.metadata = new MediaMetadata(trackMetadata);

        if (setPositionState != null) {
            setPositionState({
                duration: extractTimes(track).duration
            });
        }

        navigator.mediaSession.playbackState = "playing";

        updateControls(player, playlist, track);

        if (isStarted && notification) {
            notificationDebounce(
                trackMetadata,
                () => player._currentAudio[0] === track[0],
                unknownPlaylist
            );
        }
    }

    onPlayerEvent("curr", onTrackChange);

    if (setPositionState != null) {
        onPlayerEvent("progress", function onProgress(_progress, duration, position) {
            setPositionState({ duration, playbackRate: 1, position });
        });

        onPlayerEvent("seek", function onSeek(track) {
            setPositionState({
                duration: extractTimes(track).duration,
                playbackRate: 1,
                position: getAudioPlayer()._listenedTime
            });
        });
    }

    function onPause() {
        navigator.mediaSession.playbackState = "paused";
    }

    onPlayerEvent("pause", onPause);

    function onStop() {
        console.log("[VKAINTEGRA] Player stopped. Reset state and unbind handlers");

        navigator.mediaSession.playbackState = "none";

        navigator.mediaSession.metadata = undefined;

        resetHandlers(GENERAL_HANDLERS);

        isStarted = false;
    }

    onPlayerEvent("stop", onStop);

    // ===================
    // === POST EVENTS ===
    // ===================

    onPlaylistChange();

    // ==========================
    // === ALL ABOUT HANDLERS ===
    // ==========================

    let generalHandlersBound = false;

    const handlerStates = Object.create(null);

    // BUG-4: Chrome does not suppert "seek" and throws error
    function setActionHandlerSafe(name, handler) {
        try {
            navigator.mediaSession.setActionHandler(name, handler);
        } catch {
            console.warn(`[VKAINTEGRA] Failed to setActionHandler "${name}", it may not supported in this browser`);
        }
    }

    function bindHandler(name, handler) {
        if (handlerStates[name]) return;

        setActionHandlerSafe(name, handler);

        handlerStates[name] = true;
    }

    function resetHandlers(names) {
        if (names == null) throw new Error("Cannot reset no handlers");

        if (!Array.isArray(names)) names = [names];

        for (let i = 0, l = names.length; i < l; i++) {
            const name = names[i];

            if (!handlerStates[name]) continue;

            setActionHandlerSafe(name, null);

            handlerStates[name] = undefined;
        }

        if (names === GENERAL_HANDLERS) generalHandlersBound = false;
    }

    function bindGeneralHandlers() {
        if (generalHandlersBound) return;

        const player = getAudioPlayer();

        bindHandler("play", () => player.play());

        bindHandler("pause", () => player.pause());

        bindHandler("seek", ({ seekTime }) => player.seekToTime(seekTime));

        if (lastNext) {
            bindHandler("nexttrack", () => {
                // BUG-8: playNext() after latest track not firing stop or pause
                let stopAfter = false;
                if (isLatestTrack && !ap.isRepeatAll()) stopAfter = true;

                player.playNext();

                if (stopAfter) player.stop();
            });
        }

        generalHandlersBound = true;
    }
})();