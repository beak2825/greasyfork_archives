// ==UserScript==
// @name             Aniworld.to & S.to Autoplay
// @name:de          Autoplay AniWorld & S.to
// @description      Autoplay for Aniworld.to and S.to with AniSkip API integration for automatic intro detection, plus lots of functions like manual skip fallback, persistent volume, language memory, and more
// @description:de   Autoplay für Aniworld.to und S.to mit vielen Funktionen wie Intro-Überspringen mit AniSkip API, Sprachspeicherung, Konstante Lautstärke zwischen providern, Wiedergabepositionsspeicher und mehr
// @version          4.12.3
// @match            https://aniworld.to/*
// @match            https://s.to/*
// @match            https://186.2.175.5/
// @match            *://*/*
// @author           AniPlayer
// @namespace        https://greasyfork.org/users/1400386
// @license          GPL-3.0-or-later; https://spdx.org/licenses/GPL-3.0-or-later.html
// @icon             https://i.imgur.com/CEZGcX6.png
// @require          https://cdnjs.cloudflare.com/ajax/libs/keyboardjs/2.7.0/keyboard.min.js#sha512-UrxaOZAJw5p38NProL/UrffryqdMdXFcEdyLt6eU89pH0N7KnmAe8G3ghNbH1qW5cDYdnaoEw1TcbHn8wuqAvw==
// @require          https://cdn.jsdelivr.net/npm/notiflix@3.2.8/dist/notiflix-aio-3.2.8.min.js#sha512-XsGxeeCSQNP2+WGCUScwIO6sznCBBee4we6n8n6yoFgB+shnCXJZCY2snFqu+fgIbPd79ldRR1/5zQFMUQVSpg==
// @require          https://cdn.jsdelivr.net/npm/tweakpane@3.1.10/dist/tweakpane.min.js#sha512-ugca4SpzfDh4VV8oj0yscIUlKxZhJd9LD5HOX4o7jOMlI/1iGYr7S4Q4Fnvx/GFXCwAivLrdHOo/7t4iYV4ehw==
// @grant            GM_addStyle
// @grant            GM_addValueChangeListener
// @grant            GM_deleteValue
// @grant            GM_getValue
// @grant            GM_listValues
// @grant            GM_removeValueChangeListener
// @grant            GM_setValue
// @grant            GM.getValue
// @grant            unsafeWindow
// @grant            GM_xmlhttpRequest
// @connect          api.jikan.moe
// @connect          api.aniskip.com
// @run-at           document-body
// @downloadURL https://update.greasyfork.org/scripts/518391/Aniworldto%20%20Sto%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/518391/Aniworldto%20%20Sto%20Autoplay.meta.js
// ==/UserScript==

/* jshint esversion: 11 */
/* global Notiflix, Tweakpane, keyboardJS */

(async function() {
    'use strict';

    // ============================================================
    // AniSkip Integration Module
    // ============================================================
    const AniSkipModule = {
        gmFetchJson(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    headers: { "Accept": "application/json" },
                    timeout: 5000,
                    onload: (res) => {
                        try { resolve(JSON.parse(res.responseText)); }
                        catch (e) { reject(e); }
                    },
                    onerror: reject,
                    ontimeout: reject,
                });
            });
        },

        getTitleFromPage() {
            const h1 = document.querySelector("h1");
            return h1 ? h1.textContent.trim() : null;
        },

        getSlugFromUrl() {
            const m = location.pathname.match(/^\/anime\/stream\/([^/]+)/);
            return m ? m[1] : null;
        },

        getEpisodeFromUrl() {
            const m = location.pathname.match(/\/episode-(\d+)\b/i);
            return m ? parseInt(m[1], 10) : null;
        },

        getSeasonFromUrl() {
            const m = location.pathname.match(/\/staffel-(\d+)\b/i);
            return m ? parseInt(m[1], 10) : null;
        },

        normalizeTitle(s) {
            return (s || "")
                .toLowerCase()
                .replace(/&/g, " and ")
                .replace(/['".:!?()[\]{}]/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .replace(/\b(staffel|season|cour|part|folge|episode|ova|movie|film|specials?)\b/g, "")
                .replace(/\s+/g, " ")
                .trim();
        },

        tokenSet(s) {
            return new Set(this.normalizeTitle(s).split(" ").filter(Boolean));
        },

        overlapScore(a, b) {
            const A = this.tokenSet(a), B = this.tokenSet(b);
            if (!A.size || !B.size) return 0;
            let inter = 0;
            for (const t of A) if (B.has(t)) inter++;
            const union = A.size + B.size - inter;
            return (inter / union) * 100;
        },

        pickBestMatch(results, targetTitle) {
            let best = null, bestScore = -Infinity;
            for (const r of results) {
                const candTitles = [r.title, r.title_english, r.title_japanese].filter(Boolean);
                let score = 0;
                for (const t of candTitles) score = Math.max(score, this.overlapScore(targetTitle, t));
                if (score > bestScore) { bestScore = score; best = r; }
            }
            return { best, bestScore };
        },

        async getMalId(title, slug, season = null) {
            if (!title || !slug) return null;

            // Include season in cache key to avoid conflicts between seasons
            const malCacheKey = season && season > 1
                ? `aw_mal_id::${slug}::s${season}`
                : `aw_mal_id::${slug}`;
            let malId = localStorage.getItem(malCacheKey);
            if (malId) return malId;

            try {
                // Append season to search query if season > 1
                let searchTitle = title;
                if (season && season > 1) {
                    searchTitle = `${title} season ${season}`;
                }

                const q = encodeURIComponent(searchTitle);
                const url = `https://api.jikan.moe/v4/anime?q=${q}&limit=10`;
                const json = await this.gmFetchJson(url);
                const results = json?.data ?? [];
                const { best, bestScore } = this.pickBestMatch(results, searchTitle);

                if (best?.mal_id && bestScore >= 25) {
                    malId = String(best.mal_id);
                    localStorage.setItem(malCacheKey, malId);
                    return malId;
                }
            } catch (e) {
                console.error('[AniSkip] Failed to fetch MAL ID:', e);
            }
            return null;
        },

        async getSkipTimes(malId, episode) {
            if (!malId || !episode) return null;
            const skipCacheKey = `aw_aniskip::${malId}::${episode}`;
            const cached = localStorage.getItem(skipCacheKey);

            if (cached) {
                try { return JSON.parse(cached); }
                catch (e) { console.error('[AniSkip] Failed to parse cached skip times:', e); }
            }

            try {
                const url = `https://api.aniskip.com/v2/skip-times/${encodeURIComponent(malId)}/${encodeURIComponent(episode)}?types=op&types=ed&types=mixed-op&types=mixed-ed&types=recap&episodeLength=0`;
                console.log('[AniSkip] API URL:', url);
                const json = await this.gmFetchJson(url);
                console.log('[AniSkip] API Response:', json);

                if (json?.found && json.results && json.results.length > 0) {
                    const results = json.results;
                    localStorage.setItem(skipCacheKey, JSON.stringify(results));
                    return results;
                }

                // Log why we didn't get results
                if (json?.found === false) {
                    console.log('[AniSkip] API returned found: false');
                } else if (json?.results?.length === 0) {
                    console.log('[AniSkip] API returned empty results array');
                }
            } catch (e) {
                console.error('[AniSkip] Failed to fetch skip times:', e);
            }
            return null;
        },

        parseSkipTimes(results) {
            if (!results || !results.length) return null;

            const parsed = { intro: null, outro: null, recap: null };

            for (const r of results) {
                const typ = r.skip_type ?? r.skipType;
                const interval = r.interval ?? {};
                const startTime = interval.start_time ?? interval.startTime ?? r.start_time ?? r.startTime;
                const endTime = interval.end_time ?? interval.endTime ?? r.end_time ?? r.endTime;

                const start = Number.parseFloat(startTime);
                const end = Number.parseFloat(endTime);

                if (!Number.isFinite(start) || !Number.isFinite(end)) continue;

                if (typ === 'op' || typ === 'mixed-op') {
                    parsed.intro = { start, end, type: typ };
                } else if (typ === 'ed' || typ === 'mixed-ed') {
                    parsed.outro = { start, end, type: typ };
                } else if (typ === 'recap') {
                    parsed.recap = { start, end, type: typ };
                }
            }

            return parsed;
        },

        async submitSkipTimes(malId, episode, episodeLength, introStart, introEnd) {
            if (!malId || !episode) return { success: false, error: 'Missing MAL ID or episode' };

            if (!Number.isFinite(introStart) || !Number.isFinite(introEnd)) {
                return { success: false, error: 'Invalid times' };
            }

            if (introEnd <= introStart) {
                return { success: false, error: 'End must be greater than start' };
            }

            try {
                // AniSkip API requires POST to /v2/skip-times/{malId}/{episodeNumber}
                const url = `https://api.aniskip.com/v2/skip-times/${encodeURIComponent(malId)}/${encodeURIComponent(episode)}`;

                // Generate a UUID for submitterId (v4 UUID format)
                const generateUUID = () => {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        const r = Math.random() * 16 | 0;
                        const v = c === 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                };

                const payload = {
                    skipType: 'op',
                    startTime: introStart,
                    endTime: introEnd,
                    episodeLength: episodeLength,
                    providerName: 'Aniworld',
                    submitterId: generateUUID()
                };

                console.log('[AniSkip] Submitting:', payload, 'to URL:', url);

                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: url,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: JSON.stringify(payload),
                        onload: (response) => {
                            console.log('[AniSkip] Submit response:', response);
                            resolve(response);
                        },
                        onerror: (error) => {
                            console.error('[AniSkip] Submit error:', error);
                            reject(error);
                        }
                    });
                });

                if (response.status >= 200 && response.status < 300) {
                    return { success: true };
                } else {
                    const errorMsg = response.responseText || `Server returned ${response.status}`;
                    return { success: false, error: errorMsg };
                }
            } catch (e) {
                console.error('[AniSkip] Submit failed:', e);
                return { success: false, error: e.message };
            }
        }
    };

    // Localization setup
    const userLang = navigator.language.startsWith('de') ? 'de' : 'en';

    // Global storage for AniSkip data (accessible by all functions)
    let globalAniSkipData = null;

    const localizations = {
        en: {
            firstRunInfoTitle: `${GM_info.script.name} info`,
            firstRunInfoText: (isMobile, largeSkipKey) => `${isMobile ? 'Hold-release' : 'Right click'} the toggle button to open autoplay settings. ${isMobile ? '' : `Press "${largeSkipKey}" when an intro starts to skip it. `}Fullscreen is scrollable, allowing to switch providers on the go`,
            ok: 'Okay',
            loading: 'Loading',
            vidmolyNotReady: 'Vidmoly not ready yet.',
            couldNotLoad: 'Could not load',
            hotkeysGuide: 'Hotkeys Guide',
            close: 'Close',
            errorSaving: 'There was an error when trying to save the',
            reportBug: '. The value would reset upon player reload. Please, report the bug, with a mention of a URL of the page you\'re currently on',
            autoplayError: 'The script got an error trying autoplay. Try again, and if the problem persists, report the bug, or you can try switching video player providers if possible',
            lastAutoplayError: 'Last autoplay end up with an error, but you should be at the next episode page now. Try again, and if the problem persists, report the bug, or you can try switching video player providers if possible',
            preferences: 'Preferences',
            advanced: 'Advanced',
            apply: 'Apply',
            providersPriority: 'Providers priority',
            miscellaneous: 'Miscellaneous',
            persistentMutedAutoplay: 'Persistent muted autoplay',
            persistentMutedAutoplayTooltip: 'Seamless autoplay is not always available due to browser restrictions. This setting makes autoplay muted which in turn makes autoplay to be always available (autoplay should be enabled for this to work), but instead it requires user input (click or keypress) to unmute. Keypress works only if a video player is in focus',
            autoSkipAtStart: 'Auto-skip at start',
            autoSkipAtStartTooltip: 'Automatically skips the beginning of a video when it starts. Enable this to activate the skip feature.',
            playbackPositionMemory: 'Playback position memory',
            playbackPositionMemoryTooltip: 'Saves the last playback position and restores it whenever the video player is reloaded',
            skipSecondsOnStart: 'Skip seconds on start',
            skipSecondsOnStartTooltip: 'Number of seconds to skip from the beginning when auto-skip is enabled.',
            overrideDoubletapBehavior: 'Override double-tap behavior*',
            overrideDoubletapBehaviorTooltip: 'If enabled, default double-tap behavior (if any) is being overrided: double-tap right/left side of a video player to fast forward/rewind. Double-tap in a middle applies an intro skip. Page reload is required for this setting to take effect!',
            introSkipSize: 'Intro skip size, sec',
            introSkipSizeTooltip: 'Intro skip size. This is linked to the title and should stay the same across episodes',
            outroSkipThreshold: 'Outro skip threshold, sec',
            outroSkipThresholdTooltip: 'Autoplay triggers when the video player has fewer than THIS number of seconds left to play. It is linked to the title and should stay the same across episodes',
            resetToDefaults: 'Reset to defaults',
            hotkeys: 'Hotkeys',
            fastBackward: 'Fast backward*',
            fastBackwardTooltip: 'Hotkey for a fast backward. Page reload is required for this setting to take effect!',
            fastForward: 'Fast forward*',
            fastForwardTooltip: 'Hotkey for a fast forward. Page reload is required for this setting to take effect!',
            fullscreen: 'Fullscreen*',
            fullscreenTooltip: 'Hotkey for a fullscreen mode toggle. Page reload is required for this setting to take effect!',
            largeSkip: 'Intro skip*',
            largeSkipTooltip: 'Hotkey for an intro skip. Page reload is required for this setting to take effect!',
            defaultIntroSkipSize: 'Default intro skip size, sec',
            defaultIntroSkipSizeTooltip: 'Default intro skip size',
            defaultOutroSkipThreshold: 'Default outro skip threshold, sec',
            defaultOutroSkipThresholdTooltip: 'Default outro skip threshold',
            markWatchedAfter: 'Mark watched after, sec',
            markWatchedAfterTooltip: 'Number of seconds of approximate playback time after which a video is being marked as watched. Set to 0 to disable and mark only by a triggered autoplay',
            fastForwardSize: 'Fast forward size, sec',
            fastForwardSizeTooltip: 'Number of seconds to skip or rewind using double-taps or pressing a corresponding hotkeys',
            showSkipIntroButton: 'Show Skip Intro Button',
            showSkipIntroButtonTooltip: 'Toggle visibility of the Skip Intro button on supported players',
            showSkipIntroButtonSeconds: 'Show Skip Intro Button, sec',
            showSkipIntroButtonSecondsTooltip: 'How long (in seconds) the Skip Intro button stays visible after loading',
            preloadOtherProviders: 'Preload other providers*',
            preloadOtherProvidersTooltip: 'Whether the script should try and built in a providers that are not built in by a default. Might impact network usage. Page reload is required for this setting to take effect!',
            playOnIntroSkip: 'Play on intro skip',
            playOnIntroSkipTooltip: 'Intro skip also starts playback',
            showDeviceSpecificSettings: 'Show device specific settings*',
            showDeviceSpecificSettingsTooltip: 'Show settings that usually have no use on your device. For example, if you\'re on mobile, hotkeys settings are hidden by default because there is no PC keyboard on mobile. Page reload is required for this setting to take effect!',
            doubleTapTimingThreshold: 'Double-tap timing threshold, ms*',
            doubleTapTimingThresholdTooltip: 'Adjusts the maximum time (in milliseconds) allowed between two taps for them to be recognized as a double-tap. A lower value requires faster taps, while a higher value allows more delay. Page reload is required for this setting to take effect!',
            doubleTapDistanceThreshold: 'Double-tap distance threshold, px*',
            doubleTapDistanceThresholdTooltip: 'Defines the maximum distance (in pixels) between two taps for them to be considered a double-tap. A smaller value requires taps to be closer together, while a larger value allows more separation. Page reload is required for this setting to take effect!',
            introSkipCooldown: 'Intro skip cooldown, ms*',
            introSkipCooldownTooltip: 'Cooldown for an intro skip hotkey, to prevent an accidental double skip. Page reload is required for this setting to take effect!',
            useAniSkip: 'Use AniSkip API',
            useAniSkipTooltip: 'Automatically fetch intro times from AniSkip API for accurate intro skipping. Falls back to manual intro skip size if no data is found.',
            showAniSkipNotifications: 'Show AniSkip notifications',
            showAniSkipNotificationsTooltip: 'Show notifications when AniSkip data is found or when skipping intro/outro using AniSkip times.',
            autoSkipIntro: 'Auto-skip intro',
            autoSkipIntroTooltip: 'Automatically skip the intro when it starts (uses AniSkip timing when available, otherwise uses manual intro skip size).',
            aniSkipNoIntroFound: 'AniSkip: No intro timestamp found',
            submitToAniSkip: 'Submit to AniSkip',
            submitIntroTimes: 'Submit Intro Times',
            submitIntroTimesDesc: 'Help the community by submitting intro timestamps for this episode!',
            introStartTime: 'Intro start (seconds)',
            introEndTime: 'Intro end (seconds)',
            submitButton: 'Submit',
            cancelButton: 'Cancel',
            submittingToAniSkip: 'Submitting to AniSkip...',
            submitSuccess: 'Successfully submitted! Thank you for contributing!',
            submitError: 'Failed to submit. Please try again.',
            invalidTimes: 'Invalid times. End must be greater than start.',
            aniSkipFetchSuccess: 'AniSkip: Using detected times',
            aniSkipFetchFailed: 'AniSkip: No data found, using fallback',
            aniSkipIntroDetected: 'Intro detected via AniSkip',
            aniSkipOutroDetected: 'Outro detected via AniSkip',
            usingFallbackTimes: 'Using manual skip times',
            playbackPositionExpiration: 'Playback position expiration',
            playbackPositionExpirationTooltip: 'How many DAYS need to pass before a playback position is removed from the memory',
            corsProxy: 'CORS proxy',
            corsProxyTooltip: 'To keep possible VOE-to-VOE unmuted autoplay working, the script needs to route a very small number of web requests through its own proxy server. Leave the input empty to disable this or set your own proxy',
            commlinkPollingInterval: 'Commlink polling interval, ms*',
            commlinkPollingIntervalTooltip: 'Reflects messaging responsiveness between a player and a top scope. Might impact CPU usage if set too low. 40 should be enough. Page reload is required for this setting to take effect!',
            skipIntro: 'Skip Intro',
            autoplayEnabled: 'Autoplay is enabled',
            autoplayDisabled: 'Autoplay is disabled'
        },
        de: {
            firstRunInfoTitle: `${GM_info.script.name} Info`,
            firstRunInfoText: (isMobile, largeSkipKey) => `${isMobile ? 'Halten und loslassen' : 'Rechtsklick'} Sie auf die Umschalttaste, um die Autoplay-Einstellungen zu öffnen. ${isMobile ? '' : `Drücken Sie "${largeSkipKey}", wenn ein Intro beginnt, um es zu überspringen. `}Der Vollbildmodus ist scrollbar, sodass Sie die Anbieter unterwegs wechseln können`,
            ok: 'Okay',
            loading: 'Wird geladen',
            vidmolyNotReady: 'Vidmoly ist noch nicht bereit.',
            couldNotLoad: 'Konnte nicht geladen werden',
            hotkeysGuide: 'Hotkeys-Anleitung',
            close: 'Schließen',
            errorSaving: 'Beim Speichern von ist ein Fehler aufgetreten',
            reportBug: '. Der Wert wird beim Neuladen des Players zurückgesetzt. Bitte melden Sie den Fehler unter Angabe der URL der aktuellen Seite',
            autoplayError: 'Das Skript hat beim Versuch des Autoplays einen Fehler erhalten. Versuchen Sie es erneut. Wenn das Problem weiterhin besteht, melden Sie den Fehler oder versuchen Sie, den Video-Player-Anbieter zu wechseln, falls möglich',
            lastAutoplayError: 'Das letzte Autoplay ist mit einem Fehler beendet, aber Sie sollten jetzt auf der Seite der nächsten Episode sein. Versuchen Sie es erneut. Wenn das Problem weiterhin besteht, melden Sie den Fehler oder versuchen Sie, den Video-Player-Anbieter zu wechseln, falls möglich',
            preferences: 'Einstellungen',
            advanced: 'Erweitert',
            apply: 'Anwenden',
            providersPriority: 'Anbieterpriorität',
            miscellaneous: 'Sonstiges',
            persistentMutedAutoplay: 'Dauerhaft stummgeschaltetes Autoplay',
            persistentMutedAutoplayTooltip: 'Nahtloses Autoplay ist aufgrund von Browsereinschränkungen nicht immer verfügbar. Diese Einstellung schaltet das Autoplay stumm, wodurch das Autoplay immer verfügbar ist (Autoplay muss dafür aktiviert sein), erfordert jedoch eine Benutzereingabe (Klick oder Tastendruck) zum Aufheben der Stummschaltung. Ein Tastendruck funktioniert nur, wenn ein Videoplayer im Fokus ist',
            autoSkipAtStart: 'Automatisches Überspringen am Anfang',
            autoSkipAtStartTooltip: 'Überspringt automatisch den Anfang eines Videos, wenn es startet. Aktivieren Sie dies, um die Überspringfunktion zu aktivieren.',
            playbackPositionMemory: 'Wiedergabepositionsspeicher',
            playbackPositionMemoryTooltip: 'Speichert die letzte Wiedergabeposition und stellt sie wieder her, wenn der Videoplayer neu geladen wird',
            skipSecondsOnStart: 'Sekunden am Anfang überspringen',
            skipSecondsOnStartTooltip: 'Anzahl der Sekunden, die vom Anfang an übersprungen werden sollen, wenn das automatische Überspringen aktiviert ist.',
            overrideDoubletapBehavior: 'Doppeltipp-Verhalten überschreiben*',
            overrideDoubletapBehaviorTooltip: 'Wenn aktiviert, wird das standardmäßige Doppeltipp-Verhalten (falls vorhanden) überschrieben: Doppeltippen Sie auf die rechte/linke Seite eines Videoplayers, um schnell vor- oder zurückzuspulen. Ein Doppeltipp in der Mitte wendet einen Intro-Skip an. Ein Neuladen der Seite ist für diese Einstellung erforderlich!',
            introSkipSize: 'Intro-Skipgröße, Sek',
            introSkipSizeTooltip: 'Intro-Skipgröße. Dies ist mit dem Titel verknüpft und sollte über alle Episoden hinweg gleich bleiben',
            outroSkipThreshold: 'Outro-Skipschwelle, Sek',
            outroSkipThresholdTooltip: 'Autoplay wird ausgelöst, wenn der Videoplayer weniger als DIESE Anzahl von Sekunden zum Abspielen übrig hat. Es ist mit dem Titel verknüpft und sollte über alle Episoden hinweg gleich bleiben',
            resetToDefaults: 'Auf Standard zurücksetzen',
            hotkeys: 'Hotkeys',
            fastBackward: 'Schneller Rücklauf*',
            fastBackwardTooltip: 'Hotkey für einen schnellen Rücklauf. Ein Neuladen der Seite ist für diese Einstellung erforderlich!',
            fastForward: 'Schneller Vorlauf*',
            fastForwardTooltip: 'Hotkey für einen schnellen Vorlauf. Ein Neuladen der Seite ist für diese Einstellung erforderlich!',
            fullscreen: 'Vollbild*',
            fullscreenTooltip: 'Hotkey zum Umschalten des Vollbildmodus. Ein Neuladen der Seite ist für diese Einstellung erforderlich!',
            largeSkip: 'Intro überspringen*',
            largeSkipTooltip: 'Hotkey für einen Intro-Skip. Ein Neuladen der Seite ist für diese Einstellung erforderlich!',
            defaultIntroSkipSize: 'Standard-Intro-Skipgröße, Sek',
            defaultIntroSkipSizeTooltip: 'Standard-Intro-Skipgröße',
            defaultOutroSkipThreshold: 'Standard-Outro-Skipschwelle, Sek',
            defaultOutroSkipThresholdTooltip: 'Standard-Outro-Skipschwelle',
            markWatchedAfter: 'Als angesehen markieren nach, Sek',
            markWatchedAfterTooltip: 'Anzahl der Sekunden ungefährer Wiedergabezeit, nach der ein Video als angesehen markiert wird. Auf 0 setzen, um zu deaktivieren und nur durch ein ausgelöstes Autoplay zu markieren',
            fastForwardSize: 'Schnellvorlaufgröße, Sek',
            fastForwardSizeTooltip: 'Anzahl der Sekunden, die mit Doppeltipps oder durch Drücken einer entsprechenden Hotkey übersprungen oder zurückgespult werden sollen',
            showSkipIntroButton: 'Intro überspringen-Button anzeigen',
            showSkipIntroButtonTooltip: 'Sichtbarkeit des Intro überspringen-Buttons auf unterstützten Playern umschalten',
            showSkipIntroButtonSeconds: 'Intro überspringen-Button anzeigen, Sek',
            showSkipIntroButtonSecondsTooltip: 'Wie lange (in Sekunden) der Intro überspringen-Button nach dem Laden sichtbar bleibt',
            preloadOtherProviders: 'Andere Anbieter vorladen*',
            preloadOtherProvidersTooltip: 'Ob das Skript versuchen soll, Anbieter zu integrieren, die nicht standardmäßig integriert sind. Kann die Netzwerknutzung beeinträchtigen. Ein Neuladen der Seite ist für diese Einstellung erforderlich!',
            playOnIntroSkip: 'Bei Intro-Skip abspielen',
            playOnIntroSkipTooltip: 'Intro-Skip startet auch die Wiedergabe',
            showDeviceSpecificSettings: 'Gerätespezifische Einstellungen anzeigen*',
            showDeviceSpecificSettingsTooltip: 'Einstellungen anzeigen, die auf Ihrem Gerät normalerweise keine Verwendung haben. Wenn Sie beispielsweise auf einem Mobilgerät sind, sind die Hotkey-Einstellungen standardmäßig ausgeblendet, da auf Mobilgeräten keine PC-Tastatur vorhanden ist. Ein Neuladen der Seite ist für diese Einstellung erforderlich!',
            doubleTapTimingThreshold: 'Doppeltipp-Timing-Schwelle, ms*',
            doubleTapTimingThresholdTooltip: 'Passt die maximale Zeit (in Millisekunden) an, die zwischen zwei Tipps erlaubt ist, damit sie als Doppeltipp erkannt werden. Ein niedrigerer Wert erfordert schnellere Tipps, während ein höherer Wert mehr Verzögerung zulässt. Ein Neuladen der Seite ist für diese Einstellung erforderlich!',
            doubleTapDistanceThreshold: 'Doppeltipp-Distanzschwelle, px*',
            doubleTapDistanceThresholdTooltip: 'Definiert die maximale Entfernung (in Pixeln) zwischen zwei Tipps, damit sie als Doppeltipp betrachtet werden. Ein kleinerer Wert erfordert, dass die Tipps näher beieinander liegen, während ein größerer Wert mehr Abstand zulässt. Ein Neuladen der Seite ist für diese Einstellung erforderlich!',
            introSkipCooldown: 'Intro-Skip-Abklingzeit, ms*',
            introSkipCooldownTooltip: 'Abklingzeit für einen Intro-Skip-Hotkey, um einen versehentlichen Doppelskip zu verhindern. Ein Neuladen der Seite ist für diese Einstellung erforderlich!',
            useAniSkip: 'AniSkip-API verwenden',
            useAniSkipTooltip: 'Intro-Zeiten automatisch von der AniSkip-API abrufen für genaues Intro-Überspringen. Fällt auf manuelle Intro-Skip-Größe zurück, wenn keine Daten gefunden werden.',
            showAniSkipNotifications: 'AniSkip-Benachrichtigungen anzeigen',
            showAniSkipNotificationsTooltip: 'Benachrichtigungen anzeigen, wenn AniSkip-Daten gefunden werden oder beim Überspringen von Intro/Outro mit AniSkip-Zeiten.',
            autoSkipIntro: 'Intro automatisch überspringen',
            autoSkipIntroTooltip: 'Intro automatisch überspringen, wenn es startet (verwendet AniSkip-Timing wenn verfügbar, sonst manuelle Intro-Skip-Größe).',
            aniSkipNoIntroFound: 'AniSkip: Kein Intro-Zeitstempel gefunden',
            submitToAniSkip: 'An AniSkip senden',
            submitIntroTimes: 'Intro-Zeiten einreichen',
            submitIntroTimesDesc: 'Hilf der Community, indem du Intro-Zeitstempel für diese Episode einreichst!',
            introStartTime: 'Intro-Start (Sekunden)',
            introEndTime: 'Intro-Ende (Sekunden)',
            submitButton: 'Absenden',
            cancelButton: 'Abbrechen',
            submittingToAniSkip: 'Wird an AniSkip gesendet...',
            submitSuccess: 'Erfolgreich eingereicht! Danke für deinen Beitrag!',
            submitError: 'Fehler beim Senden. Bitte versuche es erneut.',
            invalidTimes: 'Ungültige Zeiten. Ende muss größer als Start sein.',
            aniSkipFetchSuccess: 'AniSkip: Erkannte Zeiten werden verwendet',
            aniSkipFetchFailed: 'AniSkip: Keine Daten gefunden, Fallback wird verwendet',
            aniSkipIntroDetected: 'Intro via AniSkip erkannt',
            aniSkipOutroDetected: 'Outro via AniSkip erkannt',
            usingFallbackTimes: 'Manuelle Skip-Zeiten werden verwendet',
            playbackPositionExpiration: 'Ablauf der Wiedergabeposition',
            playbackPositionExpirationTooltip: 'Wie viele TAGE müssen vergehen, bevor eine Wiedergabeposition aus dem Speicher entfernt wird',
            corsProxy: 'CORS-Proxy',
            corsProxyTooltip: 'Um ein mögliches VOE-zu-VOE ungestummtes Autoplay zu ermöglichen, muss das Skript eine sehr kleine Anzahl von Webanfragen über einen eigenen Proxyserver leiten. Lassen Sie das Eingabefeld leer, um dies zu deaktivieren oder Ihren eigenen Proxy festzulegen',
            commlinkPollingInterval: 'Commlink-Abfrageintervall, ms*',
            commlinkPollingIntervalTooltip: 'Spiegelt die Reaktionsfähigkeit der Nachrichtenübertragung zwischen einem Player und einem Top-Scope wider. Kann die CPU-Auslastung beeinträchtigen, wenn sie zu niedrig eingestellt ist. 40 sollten ausreichen. Ein Neuladen der Seite ist für diese Einstellung erforderlich!',
            skipIntro: 'Intro überspringen',
            autoplayEnabled: 'Autoplay ist aktiviert',
            autoplayDisabled: 'Autoplay ist deaktiviert'
        }
    };

    const i18n = localizations[userLang];

    // Domains list the script should work for
    const TOP_SCOPE_DOMAINS = [
        'aniworld.to',
        's.to',
        '186.2.175.5',
    ];

    // Needed for proper tracking of position memory
    const TOP_SCOPE_DOMAINS_IDS = {
        'aniworld.to': 'aniworld',
        's.to': 'sto',
        '186.2.175.5': 'sto',
    };

    // Names should be the exact same as in the providers list of the website
    const VIDEO_PROVIDERS_MAP = {
        Vidmoly: 'Vidmoly',
        Vidoza: 'Vidoza',
        VOE: 'VOE',
    };
    const VIDEO_PROVIDERS_IDS = {
        '1': VIDEO_PROVIDERS_MAP.VOE,
        '3': VIDEO_PROVIDERS_MAP.Vidoza,
        '5': VIDEO_PROVIDERS_MAP.Vidmoly,
    };
    // Providers supported by the script, ordered by a default priority
    const VIDEO_PROVIDERS_DEFAULT_ORDER = [
        VIDEO_PROVIDERS_MAP.VOE,
        VIDEO_PROVIDERS_MAP.Vidmoly,
        VIDEO_PROVIDERS_MAP.Vidoza,
    ];
    const CORE_SETTINGS_MAP = {
        currentLargeSkipSizeS: 'currentLargeSkipSizeS',
        currentOutroSkipThresholdS: 'currentOutroSkipThresholdS',
        isAutoplayEnabled: 'isAutoplayEnabled',
        isMuted: 'isMuted',
        shouldAutoSkipOnStart: 'shouldAutoSkipOnStart',
        autoSkipSecondsOnStart: 'autoSkipSecondsOnStart',
        persistentVolumeLvl: 'persistentVolumeLvl',
        providersPriority: 'providersPriority',
        videoLanguagePreferredID: 'videoLanguagePreferredID',
        autoSkipIntro: 'autoSkipIntro',
    };
    // Note that defaults are applied only on a very first run of the script
    const CORE_SETTINGS_DEFAULTS = {
        // Default value doesn't matter because it fallbacks to
        // ADVANCED_SETTINGS_DEFAULTS.defaultLargeSkipSizeS anyway
        [CORE_SETTINGS_MAP.currentLargeSkipSizeS]: 87,
        [CORE_SETTINGS_MAP.currentOutroSkipThresholdS]: 90, // same logic
        [CORE_SETTINGS_MAP.shouldAutoSkipOnStart]: true,
        [CORE_SETTINGS_MAP.autoSkipSecondsOnStart]: 0,
        [CORE_SETTINGS_MAP.isAutoplayEnabled]: false,
        [CORE_SETTINGS_MAP.isMuted]: false,
        [CORE_SETTINGS_MAP.persistentVolumeLvl]: 0.5,
        [CORE_SETTINGS_MAP.providersPriority]: (
            VIDEO_PROVIDERS_DEFAULT_ORDER.map(name => Object.keys(VIDEO_PROVIDERS_IDS).find(
                key => VIDEO_PROVIDERS_IDS[key] === name
            ))
        ),
        [CORE_SETTINGS_MAP.videoLanguagePreferredID]: '1',
        [CORE_SETTINGS_MAP.autoSkipIntro]: true,
    };
    const HOTKEYS_SETTINGS_MAP = {
        fastBackward: 'fastBackward',
        fastForward: 'fastForward',
        fullscreen: 'fullscreen',
        largeSkip: 'largeSkip',
    };
    // Note that defaults are applied only on a very first run of the script
    const HOTKEYS_SETTINGS_DEFAULTS = {
        [HOTKEYS_SETTINGS_MAP.fastBackward]: 'left',
        [HOTKEYS_SETTINGS_MAP.fastForward]: 'right',
        [HOTKEYS_SETTINGS_MAP.fullscreen]: 'f',
        [HOTKEYS_SETTINGS_MAP.largeSkip]: 'v',
    };
    const MAIN_SETTINGS_MAP = {
        overrideDoubletapBehavior: 'overrideDoubletapBehavior',
        playbackPositionMemory: 'playbackPositionMemory',
        shouldAutoplayMuted: 'shouldAutoplayMuted',
    };
    // Note that defaults are applied only on a very first run of the script
    const MAIN_SETTINGS_DEFAULTS = {
        [MAIN_SETTINGS_MAP.overrideDoubletapBehavior]: true,
        [MAIN_SETTINGS_MAP.playbackPositionMemory]: true,
        [MAIN_SETTINGS_MAP.shouldAutoplayMuted]: true,
    };
    const ADVANCED_SETTINGS_MAP = {
        commlinkPollingIntervalMs: 'commlinkPollingIntervalMs',
        corsProxy: 'corsProxy',
        defaultLargeSkipSizeS: 'defaultLargeSkipSizeS',
        defaultOutroSkipThresholdS: 'defaultOutroSkipThresholdS',
        doubletapDistanceThresholdPx: 'doubletapDistanceThresholdPx',
        doubletapTimingThresholdMs: 'doubletapTimingThresholdMs',
        fastForwardSizeS: 'fastForwardSizeS',
        largeSkipCooldownMs: 'largeSkipCooldownMs',
        markWatchedAfterS: 'markWatchedAfterS',
        playOnLargeSkip: 'playOnLargeSkip',
        playbackPositionExpirationDays: 'playbackPositionExpirationDays',
        preloadOtherProviders: 'preloadOtherProviders',
        showSkipIntroButton: 'showSkipIntroButton',
        showSkipIntroButtonSeconds: 'showSkipIntroButtonSeconds',
        showDeviceSpecificSettings: 'showDeviceSpecificSettings',
        useAniSkip: 'useAniSkip',
        showAniSkipNotifications: 'showAniSkipNotifications',
    };
    // Note that defaults are applied only on a very first run of the script
    const ADVANCED_SETTINGS_DEFAULTS = {
        [ADVANCED_SETTINGS_MAP.commlinkPollingIntervalMs]: 40,
        [ADVANCED_SETTINGS_MAP.corsProxy]: 'https://aniworld-to-cors-proxy.fly.dev/',
        [ADVANCED_SETTINGS_MAP.defaultLargeSkipSizeS]: 87,
        [ADVANCED_SETTINGS_MAP.defaultOutroSkipThresholdS]: 90,
        [ADVANCED_SETTINGS_MAP.doubletapDistanceThresholdPx]: 50,
        [ADVANCED_SETTINGS_MAP.doubletapTimingThresholdMs]: 300,
        [ADVANCED_SETTINGS_MAP.fastForwardSizeS]: 10,
        [ADVANCED_SETTINGS_MAP.largeSkipCooldownMs]: 300,
        [ADVANCED_SETTINGS_MAP.markWatchedAfterS]: 0,
        [ADVANCED_SETTINGS_MAP.playOnLargeSkip]: true,
        [ADVANCED_SETTINGS_MAP.playbackPositionExpirationDays]: 30,
        [ADVANCED_SETTINGS_MAP.preloadOtherProviders]: true,
        [ADVANCED_SETTINGS_MAP.showSkipIntroButton]: true,
        [ADVANCED_SETTINGS_MAP.showSkipIntroButtonSeconds]: 240,
        [ADVANCED_SETTINGS_MAP.showDeviceSpecificSettings]: false,
        [ADVANCED_SETTINGS_MAP.useAniSkip]: true,
        [ADVANCED_SETTINGS_MAP.showAniSkipNotifications]: true,
    };
    const IS_MOBILE = (
        /Mobi|Android|iP(hone|[oa]d)/i.test(navigator.userAgent)
    );
    const IS_SAFARI = (
        navigator.userAgent.indexOf('Safari') > -1 && !/Chrome|CriOS/.test(navigator.userAgent)
    );
    // Can not handle nested objects
    class DataStore {
        constructor(uuid, defaultStorage = {}) {
            if (typeof uuid !== 'string' && typeof uuid !== 'number') {
                throw new Error('Expected uuid when creating DataStore');
            }

            this.__uuid = uuid;
            this.__storage = defaultStorage;
            try {
                this.__storage = JSON.parse(GM_getValue(uuid));
            } catch {
                GM_setValue(uuid, JSON.stringify(defaultStorage));
            }

            return new Proxy(this, {
                get: (obj, prop) => {
                    if (prop === 'destroy') return () => obj.__destroy();
                    if (prop === 'update') return updates => obj.__update(updates);

                    return obj.__storage[prop];
                },

                set: (obj, prop, value) => {
                    obj.__storage[prop] = value;
                    GM_setValue(obj.__uuid, JSON.stringify(obj.__storage));

                    return true;
                }
            });
        }

        __update(updates) {
            if (updates) {
                Object.assign(this.__storage, updates);
                GM_setValue(this.__uuid, JSON.stringify(this.__storage));
            } else {
                try {
                    this.__storage = JSON.parse(GM_getValue(this.__uuid)) || {};
                } catch {
                    this.__storage = {};
                }
            }
        }

        __destroy() {
            GM_deleteValue(this.__uuid);
            this.__storage = {};
        }
    }

    const advancedSettings = new DataStore('advancedSettings', ADVANCED_SETTINGS_DEFAULTS);
    const coreSettings = new DataStore('coreSettings', CORE_SETTINGS_DEFAULTS);
    const hotkeysSettings = new DataStore('hotkeysSettings', HOTKEYS_SETTINGS_DEFAULTS);
    const mainSettings = new DataStore('mainSettings', MAIN_SETTINGS_DEFAULTS);
    [
        [advancedSettings, ADVANCED_SETTINGS_DEFAULTS],
        [coreSettings, CORE_SETTINGS_DEFAULTS],
        [hotkeysSettings, HOTKEYS_SETTINGS_DEFAULTS],
        [mainSettings, MAIN_SETTINGS_DEFAULTS]
    ].forEach(([settings, defaults]) => {
        Object.entries(defaults).forEach(([key, value]) => (settings[key] ??= value));
    });
    if (
        Object.keys(VIDEO_PROVIDERS_IDS).sort().toString() !== [...coreSettings[CORE_SETTINGS_MAP.providersPriority]].sort().toString()
    ) {
        coreSettings[CORE_SETTINGS_MAP.providersPriority] = [
            ...CORE_SETTINGS_DEFAULTS[CORE_SETTINGS_MAP.providersPriority]
        ];
    }

    // -------------------------------------- /utils ---------------------------------------------

    const Notiflixx = (() => {
        GM_addStyle(`
  [id^=NotiflixBlockWrap], [id^=NotiflixConfirmWrap],
  [id^=NotiflixLoadingWrap], [id^=NotiflixNotifyWrap],
  [id^=NotiflixReportWrap] {
    -webkit-tap-highlight-color: #24242412;
  }

  div.notiflix-report-icon {
    width: 60px !important;
    height: 60px !important;
  }

  div.notiflix-report-content {
    max-width: 1010px !important;
    width: unset !important;
  }


  .notiflix-hotkeys-guide-modal {
    max-height: 70vh;
    overflow-y: auto;
    padding: 0 15px;
  }

  .notiflix-hotkeys-guide-modal h5 {
    font-size: 19px;
    margin: 25px 0 10px 0;
  }

  .notiflix-hotkeys-guide-modal h5:first-child {
    margin: 0 0 10px 0;
  }

  .notiflix-hotkeys-guide-modal div {
    color: black;
    margin-bottom: 5px;
  }

  .notiflix-hotkeys-guide-modal pre {
    background: #243743;
    border: none;
    display: inline-block;
    margin: 1px 0 1px 0;
    padding: 4px 8px;
    vertical-align: middle;
  }
  `);
        const notifyDefaultOptions = {
            closeButton: true,
            messageMaxLength: 500,
            plainText: false,
            position: 'left-top',
            zindex: 3222222,
        };
        const reportDefaultOptions = {
            titleMaxLength: 100,
            zindex: 3222223,
        };
        const disableBodyScroll = () => {
            // Order is important here
            document.body.style.paddingRight = (
                `${window.innerWidth - document.documentElement.clientWidth}px`
            );
            document.body.style.overflow = 'hidden';
        };

        const restoreBodyScroll = () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };

        const createNotifyHandler = (notifyType) => {
            return (message, customOptions = {}) => {
                Notiflix.Notify[notifyType](message, {
                    ...notifyDefaultOptions,
                    ...customOptions,
                });
            };
        };

        const createReportHandler = (reportType) => {
            return (titleText, messageText, btnText, customOptions = {}) => {
                disableBodyScroll();
                Notiflix.Report[reportType](titleText, messageText, btnText, () => {
                    restoreBodyScroll();
                }, {
                    ...reportDefaultOptions,
                    ...customOptions,
                });
                if (customOptions.backOverlayClickToClose) {
                    const backOverlay = document.querySelector(
                        '[id^=NotiflixReportWrap] > div[class*="-overlay"]'
                    );
                    backOverlay?.addEventListener('click', () => restoreBodyScroll());
                }

                if (customOptions.delayedButton) {
                    const closeBtn = document.querySelector('a#NXReportButton');
                    closeBtn.style.background = '#b2b2b2';
                    closeBtn.style.pointerEvents = 'none';

                    setTimeout(() => {
                        closeBtn.style.background = '#26c0d3';
                        closeBtn.style.pointerEvents = '';
                    }, 2000);
                }
            };
        };
        return {
            notify: {
                failure: createNotifyHandler('failure'),
                warning: createNotifyHandler('warning'),
            },

            report: {
                info: createReportHandler('info'),
                warning: createReportHandler('warning'),
            },
        };
    })();

    waitForElement('.inSiteWebStream', {
        existing: true
    }, function(container) {
        (function() {
            'use strict';

            const heightMap = {
                Vidmoly: '600px',
                Luluvdo: '480px',
                Filemoon: '480px'
            };
            let vidmolyIframe = null;
            let vidmolyUrl = null;
            let vidmolyReady = false;

            function log(...args) {
                console.log('%c[🔥 SmartLoader]', 'color: lime;', ...args);
            }

            function spoofVidmolyEnv() {
                window.adsbygoogle = window.adsbygoogle || [];
                window.vsd1 = {
                    skip: true,
                    adblock: true
                };
                document.cookie = 'molyast21=1; path=/; domain=.vidmoly.to';

                const patch = document.createElement('script');
                patch.innerHTML = `
            (() => {
                const og = window.jwplayer;
                Object.defineProperty(window, 'jwplayer', {
                    configurable: true,
                    get: () => function(id) {
                        const p = og(id);
                        const s = p.setup;
                        p.setup = function(cfg) {
                            if (cfg.advertising) cfg.advertising = {};
                            return s.call(this, cfg);
                        };
                        return p;
                    }
                });
            })();
        `;
                document.body.appendChild(patch);
            }

            function showLoader(type) {
                const old = document.querySelector('#loadingMessage');
                if (old) old.remove();
                const msg = document.createElement('div');
                msg.id = 'loadingMessage';
                msg.innerText = `⏳ ${i18n.loading} ${type}...`;
                Object.assign(msg.style, {
                    background: '#111',
                    color: '#fff',
                    fontFamily: 'sans-serif',
                    padding: '20px',
                    textAlign: 'center'
                });
                container.innerHTML = '';
                container.appendChild(msg);
            }

            function clearLoader() {
                const l = document.querySelector('#loadingMessage');
                if (l) l.remove();
            }

            function buildIframe(src, type) {
                const iframe = document.createElement('iframe');
                iframe.src = src;
                iframe.allowFullscreen = true;
                iframe.frameBorder = '0';
                iframe.width = '100%';
                iframe.height = heightMap[type] || '500px';
                Object.assign(iframe.style, {
                    display: 'block',
                    border: 'none',
                    position: 'relative',
                    margin: '0 auto'
                });
                return iframe;
            }

            function injectJWplayer(iframe) {
                try {
                    const win = iframe.contentWindow;
                    const tryInject = setInterval(() => {
                        try {
                            const player = win?.jwplayer?.();
                            if (player && typeof player.play === 'function') {
                                player.play();
                                clearInterval(tryInject);
                                log('▶️ JWPlayer play() called inside iframe');
                            }
                        } catch {}
                    }, 500);
                } catch (err) {
                    log('❌ JW inject failed:', err);
                }
            }

            function embedVidmoly() {
                if (!vidmolyReady || !vidmolyIframe || !vidmolyUrl) {
                    alert(i18n.vidmolyNotReady);
                    return;
                }
                container.innerHTML = '';
                const realIframe = buildIframe(vidmolyUrl, 'Vidmoly');
                container.appendChild(realIframe);
                injectJWplayer(realIframe);
            }

            function embedGeneric(url, type, attempt = 1) {
                showLoader(type);
                const iframe = buildIframe(url, type);
                container.innerHTML = '';
                container.appendChild(iframe);

                const timeout = setTimeout(() => {
                    if (!iframe.dataset.loaded && attempt < 2) {
                        log(`🔁 Retrying ${type}...`);
                        return setTimeout(() => embedGeneric(url, type, attempt + 1), 1000);
                    } else if (!iframe.dataset.loaded) {
                        clearLoader();
                        window.open(url, '_blank');
                    }
                }, 8000);

                iframe.onload = () => {
                    clearTimeout(timeout);
                    iframe.dataset.loaded = 'true';
                    clearLoader();
                    log(`✅ ${type} loaded`);
                };
            }

            async function preloadVidmoly(url) {
                spoofVidmolyEnv();
                vidmolyIframe = document.createElement('iframe');
                vidmolyIframe.src = url;
                vidmolyIframe.allowFullscreen = true;
                vidmolyIframe.frameBorder = '0';
                vidmolyIframe.width = '100%';
                vidmolyIframe.height = heightMap.Vidmoly;
                vidmolyIframe.style.cssText = 'position:absolute;width:1px;height:1px;left:-9999px;top:-9999px;';
                vidmolyIframe.onload = () => {
                    vidmolyReady = true;
                    log('✅ Vidmoly iframe preloaded.');
                };
                document.body.appendChild(vidmolyIframe);
            }

            async function detectVidmoly() {
                spoofVidmolyEnv();
                const anchor = [...document.querySelectorAll('a.watchEpisode')].find(a => {
                    return a.querySelector('i.icon.Vidmoly');
                });
                const href = anchor?.getAttribute('href');
                if (!href) return;

                const url = new URL(href, location.origin);
                vidmolyUrl = url.href;
                await preloadVidmoly(vidmolyUrl);
            }

            advancedSettings[ADVANCED_SETTINGS_MAP.preloadOtherProviders] &&
                document.addEventListener('click', async function(e) {
                    const anchor = e.target.closest('a.watchEpisode');
                    if (!anchor) return;
                    const text =
                        anchor.innerText.toLowerCase();
                    const isVid = text.includes('vidmoly');
                    const isLulu = text.includes('luluvdo');
                    const isMoon = text.includes('filemoon');
                    if (!isVid && !isLulu && !isMoon) return;

                    e.preventDefault();
                    const href = anchor.getAttribute('href');
                    const type = isVid ? 'Vidmoly' : isLulu ? 'Luluvdo' : 'Filemoon';

                    const fullUrl = new URL(href, location.origin).href;
                    try {
                        if (type === 'Filemoon' && fullUrl.includes('/d/')) {
                            return embedGeneric(fullUrl.replace('/d/', '/e/'), type);
                        }
                        if (type === 'Vidmoly') {
                            vidmolyUrl = fullUrl;
                            return embedVidmoly();
                        }
                        return embedGeneric(fullUrl, type);
                    } catch (err) {
                        console.warn('❌ Failed to load:', err);
                        alert(`${i18n.couldNotLoad} ${type}`);
                    }
                });

            function waitForElement(selector, opts = {}, cb) {
                const {
                    interval = 50, timeout = 10000
                } = opts;
                const start = Date.now();
                const timer = setInterval(() => {
                    const el = document.querySelector(selector);
                    if (el) {
                        clearInterval(timer);
                        cb(el);
                    } else if (Date.now() - start > timeout) {
                        clearInterval(timer);
                        console.warn(`[SmartLoader] ❌ Timed out waiting for ${selector}`);
                    }
                }, interval);
            }

            // wait until .watchEpisode buttons are loaded
            advancedSettings[ADVANCED_SETTINGS_MAP.preloadOtherProviders] &&
                waitForElement('a.watchEpisode i.icon.Vidmoly', {
                    timeout: 10000
                }, () => {
                    log('🧠 Vidmoly <a> tag detected, calling detectVidmoly()');
                    detectVidmoly();
                });
            //  this will now run after .inSiteWebStream is ready!
            async function checkIframeForLoadXWarning() {
                const iframe = document.querySelector('.inSiteWebStream iframe');
                if (!iframe || !iframe.src) {
                    setTimeout(checkIframeForLoadXWarning, 1000);
                    return;
                }

                const proxyUrl = `https://aniworld-to-cors-proxy.fly.dev/${iframe.src.replace(/^\/+/, '')}`;
                try {
                    const response = await fetch(proxyUrl);
                    const html = await response.text();

                    const hasWarning = html.includes('<h1>Warning</h1>') && html.includes('The video is not ready yet.');
                    const has404 = html.includes('<h1>404</h1>') || html.toLowerCase().includes('no video found');

                    if (!(hasWarning || has404)) return;
                    let providerOrder = ['0', '1', '2', '3', '4'];
                    try {
                        const raw = await GM.getValue('coreSettings');
                        if (raw) {
                            const parsed = JSON.parse(raw);
                            const dynamicOrder = parsed?.providersPriority;
                            if (Array.isArray(dynamicOrder) && dynamicOrder.length > 0) {
                                providerOrder = dynamicOrder;
                            }
                        }
                    } catch {}

                    const loadXIndex = providerOrder.indexOf('0');
                    if (loadXIndex === -1) return;

                    for (let i = loadXIndex + 1; i < providerOrder.length; i++) {
                        const providerId = providerOrder[i];
                        const providerName = getHosterName(providerId);

                        const button = [...document.querySelectorAll('a.watchEpisode')]
                            .find(a => a.href.includes('/redirect/') && a.innerText.includes(providerName))
                            ?.querySelector('.hosterSiteVideoButton');
                        if (button) {
                            button.click();
                            await new Promise(resolve => setTimeout(resolve, 3000));

                            const iframe = document.querySelector('.inSiteWebStream iframe');
                            if (!iframe || !iframe.src) continue;
                            const proxyUrl = `https://aniworld-to-cors-proxy.fly.dev/${iframe.src.replace(/^\/+/, '')}`;
                            const response = await fetch(proxyUrl);
                            const html = await response.text();
                            const hasWarning = html.includes('<h1>Warning</h1>') && html.includes('The video is not ready yet.');
                            const has404 = html.includes('<h1>404</h1>') || html.toLowerCase().includes('no video found');
                            if (!hasWarning && !has404) {
                                return;
                            }
                        }
                    }

                } catch {}
            }

            function getHosterName(id) {
                const map = {
                    '0': 'LoadX',
                    '1': 'VOE',
                    '2': 'SpeedFiles',
                    '3': 'Vidoza',
                    '4': 'Doodstream'
                };
                return map[id] || 'Unknown';
            }

            setTimeout(checkIframeForLoadXWarning, 150);

        })();
    });
    // Prevent volume scroll on player, allow page scroll, but still allow volume control
    window.addEventListener('wheel', function(e) {
        const volumeBar = e.target.closest('.vjs-volume-bar');
        const volumeIcon = e.target.closest('.vjs-mute-control');
        const playerWrapper = e.target.closest('.video-js');


        if ((volumeBar || volumeIcon)) return;

        if (playerWrapper) {
            e.stopImmediatePropagation();
        }
    }, {
        passive: false,
        capture: true
    });

    function detectDoubletap(element, callback, {
        maxIntervalMs = 300,
        tapsDistanceThresholdPx = 50,
        validPointerTypes = ['pen', 'touch'],
    } = {
        maxIntervalMs: 300,
        tapsDistanceThresholdPx: 50,
        validPointerTypes: ['pen', 'touch'],
    }) {
        let lastTapTime = 0;
        let lastTapX = 0;
        let lastTapY = 0;
        let tapped = false;
        element.addEventListener('pointerdown', (ev) => {
            if (!validPointerTypes.includes(ev.pointerType)) return;

            const currentTime = Date.now();
            const tapInterval = currentTime - lastTapTime;

            const distance = Math.sqrt(
                Math.pow(ev.clientX - lastTapX, 2) +
                Math.pow(ev.clientY - lastTapY, 2)
            );

            if (
                tapped &&
                tapInterval < maxIntervalMs &&
                distance <= tapsDistanceThresholdPx
            ) {
                callback(ev);
                tapped = false;
                lastTapTime = 0;
                lastTapX = 0;
                lastTapY = 0;
            } else {
                tapped = true;
                lastTapTime = currentTime;
                lastTapX = ev.clientX;
                lastTapY = ev.clientY;
            }
        });
    }

    function detectHold(element, callback, {
        holdTimeMs = 700,
        validPointerTypes = ['mouse', 'pen', 'touch'],
    } = {
        holdTimeMs: 700,
        validPointerTypes: ['mouse', 'pen', 'touch'],
    }) {
        let timer;
        const clearHold = () => clearTimeout(timer);
        const startHold = (ev) => {
            if (validPointerTypes.includes(ev.pointerType)) {
                timer = setTimeout(() => callback(), holdTimeMs);
            }
        };

        element.addEventListener('pointerdown', startHold);
        element.addEventListener('pointerup', clearHold);
        element.addEventListener('pointercancel', clearHold);
        element.addEventListener('pointerout', clearHold);
        element.addEventListener('pointerleave', clearHold);
    }

    function isEmbedded() {
        try {
            return window.top !== window.self;
        } catch {
            return true;
        }
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function makeId(length = 16) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let text = '';

        for (let i = 0; i < length; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return text;
    }

    async function sleep(ms = 0) {
        return new Promise(r => setTimeout(r, ms));
    }

    // Create "Skip intro" button
    function setupSkipIntroButton(player) {
        const SKIP_BTN_STYLE = `
    .SkipIntroBtn {
      position: fixed;
      bottom: 75px;
      right: 5px;
      padding: 10px;
      font-size: 16px;
      font-weight: bold;
      font-family: sans-serif;
      color: white;
      background-color: rgba(0, 0, 0, 0.55);
      border: 2px solid gray;
      text-transform: uppercase;
      cursor: pointer;
      opacity: 1;
      transition: background-color 130ms, opacity 200ms;
      z-index: 9999;
    }
    .SkipIntroBtn:hover {
      background-color: rgba(0, 0, 0, 1);
    }
    .SkipIntroBtn.invisible {
      opacity: 0;
      pointer-events: none;
    }
    .SubmitToAniSkipBtn {
        position: absolute;
        bottom: 57px;
        right: 80px;
        padding: 8px 16px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        z-index: 9999;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    .SubmitToAniSkipBtn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    .SubmitToAniSkipBtn.invisible {
        opacity: 0;
        pointer-events: none;
    }
  `;
        const button = document.createElement('button');
        button.className = 'SkipIntroBtn';
        button.textContent = i18n.skipIntro;
        button.addEventListener('click', () => {
            console.log('[Skip Button] Clicked. globalAniSkipData:', globalAniSkipData);

            // Check if we have AniSkip data for intro
            if (globalAniSkipData && globalAniSkipData.intro) {
                // Use AniSkip intro end time
                console.log('[Skip Button] Using AniSkip time:', globalAniSkipData.intro.end);
                player.currentTime = globalAniSkipData.intro.end;
            } else {
                // Fallback to manual skip size
                console.log('[Skip Button] Using fallback skip size:', coreSettings[CORE_SETTINGS_MAP.currentLargeSkipSizeS]);
                player.currentTime += coreSettings[CORE_SETTINGS_MAP.currentLargeSkipSizeS];
            }

            if (advancedSettings[ADVANCED_SETTINGS_MAP.playOnLargeSkip]) {
                player.play();
            }
            button.remove();
        });
        GM_addStyle(SKIP_BTN_STYLE);

        const insertButton = () => {
            const loadX = document.querySelector('.jw-controlbar');
            const speedFiles = document.querySelector('#my-video');
            const voe = document.querySelector('.jw-controls');

            if (loadX) {
                loadX.appendChild(button);
            } else if (speedFiles || voe) {
                document.body.appendChild(button);
            }
        };

        const observeActivity = (container) => {
            new MutationObserver(() => {
                const isActive = (
                    container.classList.contains('jw-state-paused') ||
                    !container.classList.contains('jw-flag-user-inactive') ||
                    container.classList.contains('vjs-paused') ||
                    !container.classList.contains('vjs-user-inactive')
                );
                if (!buttonDisabled) {
                    button.classList.toggle('invisible', !isActive || !advancedSettings[ADVANCED_SETTINGS_MAP.showSkipIntroButton]);

                }
            }).observe(container, {
                attributes: true,
                attributeFilter: ['class'],
            });
        };

        waitForElement('.jw-controlbar, #my-video, .jw-controls', {
            existing: true,
            onceOnly: true
        }, insertButton);
        document.addEventListener('fullscreenchange', () => {
            const isFullscreen = !!document.fullscreenElement;
            if (isFullscreen) {
                button.style.bottom = '80px';
            } else {
                button.style.bottom = '57px';
            }
        });


        const activityContainer = (
            document.querySelector('#player') ||
            document.querySelector('#my-video') ||
            document.querySelector('#a')
        );
        if (activityContainer) observeActivity(activityContainer);

        const hideAt = advancedSettings[ADVANCED_SETTINGS_MAP.showSkipIntroButtonSeconds];

        const timeCheckInterval = () => {
            // If we have AniSkip data, show button from start until intro ends
            if (globalAniSkipData && globalAniSkipData.intro) {
                const currentTime = player.currentTime;
                const introEnd = globalAniSkipData.intro.end;

                // Hide button only after intro ends
                if (currentTime >= introEnd) {
                    button.remove();
                    player.removeEventListener('timeupdate', timeCheckInterval);
                }
            } else {
                // Fallback to original time-based logic
                if (player.currentTime >= hideAt) {
                    button.remove();
                    player.removeEventListener('timeupdate', timeCheckInterval);
                }
            }
        };

        player.addEventListener('timeupdate', timeCheckInterval);
    }


    // Add visual markers on timeline for intro/outro
    function createSubmitToAniSkipButton(player, iframeInterface) {
        console.log('[Submit Button] Creating submit button');
        const button = document.createElement('button');
        button.className = 'SubmitIntroBtn';
        button.textContent = i18n.submitToAniSkip;

        // Helper to convert MM:SS or SS to seconds
        function timeToSeconds(timeStr) {
            timeStr = String(timeStr).trim();

            // If it contains a colon, it's MM:SS format
            if (timeStr.includes(':')) {
                const parts = timeStr.split(':');
                if (parts.length === 2) {
                    const minutes = parseInt(parts[0]) || 0;
                    const seconds = parseInt(parts[1]) || 0;
                    return minutes * 60 + seconds;
                }
            }

            // Otherwise treat as seconds
            return parseFloat(timeStr) || 0;
        }

        // Helper to format seconds as MM:SS
        function secondsToTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        button.addEventListener('click', async () => {
            console.log('[Submit Button] Clicked');

            // Get current time as suggestion
            const currentTime = Math.floor(player.currentTime);
            const suggestedStart = secondsToTime(currentTime);
            const suggestedEnd = secondsToTime(currentTime + 90);

            // Step 1: Get intro start time
            const startInput = await new Promise((resolve) => {
                Notiflix.Report.prompt(
                    i18n.submitIntroTimes,
                    `${i18n.submitIntroTimesDesc}<br><br>${i18n.introStartTime} (MM:SS or seconds):`,
                    suggestedStart,
                    i18n.submitButton,
                    i18n.cancelButton,
                    (clientAnswer) => resolve(clientAnswer),
                    () => resolve(null)
                );
            });

            if (startInput === null) return;

            const introStart = timeToSeconds(startInput);
            console.log('[Submit Button] Intro start:', startInput, '→', introStart, 'seconds');

            // Step 2: Get intro end time
            const endInput = await new Promise((resolve) => {
                Notiflix.Report.prompt(
                    i18n.submitIntroTimes,
                    `${i18n.introEndTime} (MM:SS or seconds):`,
                    suggestedEnd,
                    i18n.submitButton,
                    i18n.cancelButton,
                    (clientAnswer) => resolve(clientAnswer),
                    () => resolve(null)
                );
            });

            if (endInput === null) return;

            const introEnd = timeToSeconds(endInput);
            console.log('[Submit Button] Intro end:', endInput, '→', introEnd, 'seconds');

            // Validate
            if (!Number.isFinite(introStart) || !Number.isFinite(introEnd) || introEnd <= introStart) {
                Notiflix.Notify.failure(i18n.invalidTimes, {
                    timeout: 3000,
                    position: 'right-bottom'
                });
                return;
            }

            // Get MAL ID
            const malId = await AniSkipModule.getMalId(iframeInterface.animeTitle, iframeInterface.animeSlug);
            if (!malId) {
                Notiflix.Notify.failure('Could not find MAL ID', {
                    timeout: 3000,
                    position: 'right-bottom'
                });
                return;
            }

            const episodeLength = player.duration ? Math.floor(player.duration) : 0;

            console.log('[Submit Button] Submitting:', {
                malId,
                episode: iframeInterface.episodeNumber,
                episodeLength,
                introStart,
                introEnd
            });

            // Submit
            Notiflix.Notify.info(i18n.submittingToAniSkip, {
                timeout: 3000,
                position: 'right-bottom'
            });

            const result = await AniSkipModule.submitSkipTimes(
                malId,
                iframeInterface.episodeNumber,
                episodeLength,
                introStart,
                introEnd
            );

            if (result.success) {
                Notiflix.Notify.success(i18n.submitSuccess, {
                    timeout: 5000,
                    position: 'right-bottom'
                });
                button.remove();
            } else {
                Notiflix.Notify.failure(i18n.submitError + (result.error ? `: ${result.error}` : ''), {
                    timeout: 5000,
                    position: 'right-bottom'
                });
            }
        });

        const insertButton = () => {
            const loadX = document.querySelector('.jw-controlbar');
            const speedFiles = document.querySelector('#my-video');
            const voe = document.querySelector('.jw-controls');

            if (loadX) {
                loadX.appendChild(button);
            } else if (speedFiles || voe) {
                document.body.appendChild(button);
            }
        };

        waitForElm({
            selector: '.jw-controlbar, #my-video, .jw-controls',
            existing: true,
            onceOnly: true
        }, insertButton);

        document.addEventListener('fullscreenchange', () => {
            const isFullscreen = !!document.fullscreenElement;
            if (isFullscreen) {
                button.style.bottom = '153px'; // 80px + 73px for skip button
            } else {
                button.style.bottom = '105px'; // 57px + 48px for skip button
            }
        });
    }

    // Add visual markers on timeline for intro/outro
    function addTimelineMarkers(player) {
        if (!globalAniSkipData) {
            return;
        }

        if (!player.duration || !isFinite(player.duration)) {
            player.addEventListener('durationchange', () => addTimelineMarkers(player), { once: true });
            return;
        }

        // Remove any existing markers
        document.querySelectorAll('.aniskip-marker').forEach(el => el.remove());

        // Find the slider
        const slider = document.querySelector('.jw-slider-time') ||
                       document.querySelector('.jw-slider-container');

        if (!slider) {
            setTimeout(() => addTimelineMarkers(player), 1000);
            return;
        }

        // Ensure relative positioning
        const computedStyle = window.getComputedStyle(slider);
        if (computedStyle.position === 'static') {
            slider.style.position = 'relative';
        }

        // Add intro marker
        if (globalAniSkipData.intro) {
            const startPct = (globalAniSkipData.intro.start / player.duration) * 100 + 0.5;
            const widthPct = ((globalAniSkipData.intro.end - globalAniSkipData.intro.start) / player.duration) * 100;

            const marker = document.createElement('div');
            marker.className = 'aniskip-marker';
            marker.style.cssText = `
                position: absolute;
                left: ${startPct}%;
                width: ${widthPct}%;
                top: 30%;
                height: 60%;
                background-color: rgba(255, 0, 251, 0.5);
                pointer-events: none;
                z-index: 100;
                border-radius: 2px;
            `;
            slider.appendChild(marker);
        }

        // Add outro marker
        if (globalAniSkipData.outro) {
            const startPct = (globalAniSkipData.outro.start / player.duration) * 100 + 0.5;
            const widthPct = ((globalAniSkipData.outro.end - globalAniSkipData.outro.start) / player.duration) * 100;

            const marker = document.createElement('div');
            marker.className = 'aniskip-marker';
            marker.style.cssText = `
                position: absolute;
                left: ${startPct}%;
                width: ${widthPct}%;
                top: 30%;
                height: 60%;
                background-color: rgba(255, 0, 251, 0.5);
                pointer-events: none;
                z-index: 100;
                border-radius: 2px;
            `;
            slider.appendChild(marker);
        }
    }


    function waitForElement(query, {
        callbackOnTimeout = false,
        existing = false,
        onceOnly = false,
        rootElement = document.documentElement,
        timeout,

        // "attributes" prop is not supported
        observerOptions = {
            childList: true,
            subtree: true,
        },
    }, callback) {
        if (!query) throw new Error('Query is needed');
        if (!callback) throw new Error('Callback is needed');

        const handledElements = new WeakSet();
        const existingElements = rootElement.querySelectorAll(query);
        let timeoutId = null;
        if (existingElements.length) {
            // Mark all as handled for a proper work when `existing` is false
            // to ignore them later on
            for (const node of existingElements) {
                handledElements.add(node);
            }

            if (existing) {
                if (onceOnly) {
                    try {
                        callback(existingElements[0]);
                    } catch (e) {
                        console.error(e);
                    }

                    return;
                } else {
                    for (const node of existingElements) {
                        try {
                            callback(node);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            }
        }

        const observer = new MutationObserver((mutations, observer) => {
            for (const node of rootElement.querySelectorAll(query)) {
                if (handledElements.has(node)) continue;

                handledElements.add(node);

                try {
                    callback(node);
                } catch (e) {
                    console.error(e);
                }

                if (onceOnly) {
                    observer.disconnect();

                    if (timeoutId) clearTimeout(timeoutId);

                    return;
                }
            }
        });
        observer.observe(rootElement, {
            attributes: false,
            childList: observerOptions.childList || false,
            subtree: observerOptions.subtree || false,
        });
        if (timeout !== undefined) {
            timeoutId = setTimeout(() => {
                observer.disconnect();

                if (callbackOnTimeout) {
                    try {
                        callback(null);
                    } catch (e) {
                        console.error(e);
                    }
                }
            }, timeout);
        }

        return observer;
    }

    async function waitForUserInteraction() {
        return new Promise((resolve) => {
            const handler = () => {
                document.removeEventListener('pointerup', handler);
                document.removeEventListener('keydown', handler);

                resolve();
            };

            document.addEventListener('pointerup', handler, {
                once: true
            });
            document.addEventListener('keydown', handler, {
                once: true
            });
        });
    }

    // -------------------------------------- utils\ ---------------------------------------------

    /* CommLink.js
    - Version: 1.0.1
    - Author: Haka
    - Description: A userscript library for cross-window communication via the userscript storage
    - GitHub: https://github.com/AugmentedWeb/CommLink
    */
    class CommLinkHandler {
        constructor(commlinkID, configObj) {
            this.commlinkID = commlinkID;
            this.singlePacketResponseWaitTime = configObj?.singlePacketResponseWaitTime || 1500;
            this.maxSendAttempts = configObj?.maxSendAttempts || 3;
            this.statusCheckInterval = configObj?.statusCheckInterval || 1;
            this.silentMode = configObj?.silentMode || false;
            this.commlinkValueIndicator = 'commlink-packet-';
            this.commands = {};
            this.listeners = [];

            const missingGrants = [
                'GM_getValue',
                'GM_setValue',
                'GM_deleteValue',
                'GM_listValues',
            ].filter(grant => !GM_info.script.grant.includes(grant));
            if (missingGrants.length > 0 && !this.silentMode) {
                alert(
                    `[CommLink] The following userscript grants are missing: ${missingGrants.join(', ')}. CommLink will not work.`
                );
            }

            this.getStoredPackets()
                .filter(packet => Date.now() - packet.date > 2e4)
                .forEach(packet => this.removePacketByID(packet.id));
        }

        setIntervalAsync(callback, interval = this.statusCheckInterval) {
            let running = true;
            async function loop() {
                while (running) {
                    try {
                        await callback();
                        await new Promise((resolve) => setTimeout(resolve, interval));
                    } catch {
                        continue;
                    }
                }
            };
            loop();

            return {
                stop: () => {
                    running = false;
                    return false;
                }
            };
        }

        getUniqueID() {
            return ([1e7] + -1e3 + 4e3 + -8e3 + -1e11)
                .replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
        }

        getCommKey(packetID) {
            return this.commlinkValueIndicator + packetID;
        }

        getStoredPackets() {
            return GM_listValues()
                .filter(key => key.includes(this.commlinkValueIndicator))
                .map(key => GM_getValue(key));
        }

        addPacket(packet) {
            GM_setValue(this.getCommKey(packet.id), packet);
        }

        removePacketByID(packetID) {
            GM_deleteValue(this.getCommKey(packetID));
        }

        findPacketByID(packetID) {
            return GM_getValue(this.getCommKey(packetID));
        }

        editPacket(newPacket) {
            GM_setValue(this.getCommKey(newPacket.id), newPacket);
        }

        send(platform, cmd, d) {
            return new Promise(async resolve => {
                const packetWaitTimeMs = this.singlePacketResponseWaitTime;
                const maxAttempts = this.maxSendAttempts;

                let attempts = 0;

                for (;;) {
                    attempts++;

                    const packetID = this.getUniqueID();
                    const attemptStartDate = Date.now();

                    const packet = {
                        command: cmd,
                        data: d,
                        date: attemptStartDate,
                        id: packetID,
                        sender: platform,
                    };

                    if (!this.silentMode) {
                        console.log(`[CommLink Sender] Sending packet! (#${attempts} attempt):`, packet);
                    }

                    this.addPacket(packet);

                    for (;;) {
                        const poolPacket = this.findPacketByID(packetID);
                        const packetResult = poolPacket?.result;

                        if (poolPacket && packetResult) {
                            if (!this.silentMode) {
                                console.log(`[CommLink Sender] Got result for a packet (${packetID}):`, packetResult);
                            }

                            resolve(poolPacket.result);
                            attempts = maxAttempts; // stop main loop

                            break;
                        }

                        if (!poolPacket || Date.now() - attemptStartDate > packetWaitTimeMs) {
                            break;
                        }

                        await new Promise(res => setTimeout(res, this.statusCheckInterval));
                    }

                    this.removePacketByID(packetID);
                    if (attempts === maxAttempts) break;
                }

                return resolve(null);
            });
        }

        registerSendCommand(name, obj) {
            this.commands[name] = async (data) => {
                return await this.send(obj?.commlinkID || this.commlinkID, name, obj?.data || data);
            };
        }

        registerListener(sender, commandHandler) {
            const listener = {
                sender,
                commandHandler,
                intervalObj: this.setIntervalAsync(this.receivePackets.bind(this), this.statusCheckInterval),
            };
            this.listeners.push(listener);
        }

        receivePackets() {
            this.getStoredPackets().forEach(packet => {
                this.listeners.forEach(listener => {
                    if (packet.sender === listener.sender && !packet.hasOwnProperty('result')) {
                        const result = listener.commandHandler(packet);

                        packet.result = result;

                        this.editPacket(packet);

                        if (!this.silentMode) {
                            if (packet.result === null) {
                                console.log('[CommLink Receiver] Possibly failed to handle packet:', packet);
                            } else {
                                console.log('[CommLink Receiver] Successfully handled a packet:', packet);
                            }
                        }
                    }
                });
            });
        }

        kill() {
            this.listeners.forEach(listener => listener.intervalObj.stop());
        }
    }


    class IframeMessenger {
        constructor() {
            this.commLink = null;
            this.topScopeId = null;
        }

        static get messages() {
            return {
                AUTOPLAY_NEXT: 'AUTOPLAY_NEXT',
                REQUEST_CURRENT_FRANCHISE_DATA: 'REQUEST_CURRENT_FRANCHISE_DATA',
                REQUEST_FULLSCREEN_STATE: 'REQUEST_FULLSCREEN_STATE',
                MARK_CURRENT_VIDEO_WATCHED: 'MARK_CURRENT_VIDEO_WATCHED',
                OPEN_HOTKEYS_GUIDE: 'OPEN_HOTKEYS_GUIDE',
                TOGGLE_FULLSCREEN: 'TOGGLE_FULLSCREEN',
                TOP_NOTIFLIX_REPORT_INFO: 'TOP_NOTIFLIX_REPORT_INFO',
                UPDATE_CORE_SETTINGS: 'UPDATE_CORE_SETTINGS',
            };
        }

        async initCrossFrameConnection() {
            const iframeId = makeId();
            const topScopeIdPromise = new Promise((resolve) => {
                // Top scope using GM_setValue will write its own id using iframeId as a key
                const valueChangeListenerId = GM_addValueChangeListener(iframeId, (
                    _key,
                    _oldValue,
                    newValue,
                ) => {
                    GM_removeValueChangeListener(valueChangeListenerId);
                    GM_deleteValue(iframeId);

                    resolve(newValue);
                });
            });
            // This should be almost immediately picked up by a top scope
            GM_setValue('unboundIframeId', iframeId);
            const topScopeId = await topScopeIdPromise;

            if (!iframeId || !topScopeId) throw new Error('Something went wrong');

            this.topScopeId = topScopeId;
            this.commLink = new CommLinkHandler(iframeId, {
                silentMode: true,
                statusCheckInterval: advancedSettings[ADVANCED_SETTINGS_MAP.commlinkPollingIntervalMs],
            });
            this.commLink.registerSendCommand(IframeMessenger.messages.AUTOPLAY_NEXT);
            this.commLink.registerSendCommand(IframeMessenger.messages.REQUEST_CURRENT_FRANCHISE_DATA);
            this.commLink.registerSendCommand(IframeMessenger.messages.REQUEST_FULLSCREEN_STATE);
            this.commLink.registerSendCommand(IframeMessenger.messages.MARK_CURRENT_VIDEO_WATCHED);
            this.commLink.registerSendCommand(IframeMessenger.messages.OPEN_HOTKEYS_GUIDE);
            this.commLink.registerSendCommand(IframeMessenger.messages.TOGGLE_FULLSCREEN);
            this.commLink.registerSendCommand(IframeMessenger.messages.TOP_NOTIFLIX_REPORT_INFO);
            this.commLink.registerSendCommand(IframeMessenger.messages.UPDATE_CORE_SETTINGS);
        }

        registerConnectionListener(callback) {
            return this.commLink.registerListener(this.topScopeId, callback);
        }

        sendMessage(message, msgData) {
            this.commLink.commands[message](msgData);
            return;
        }
    }

    class IframeInterface {
        constructor(messenger) {
            this.commLink = null;
            this.currentFranchiseId = null;
            this.currentVideoId = null;
            this.ignoreMissingFranchiseOnce = true;
            this.isInFullscreen = null;
            this.messenger = messenger;
            this.topScopeDomainId = '';
            this.aniSkipData = null; // Store fetched AniSkip times
            // Store anime info for AniSkip
            this.animeTitle = null;
            this.animeSlug = null;
            this.episodeNumber = null;
            this.seasonNumber = null;
            coreSettings[CORE_SETTINGS_MAP.currentLargeSkipSizeS] = (
                advancedSettings[ADVANCED_SETTINGS_MAP.defaultLargeSkipSizeS]
            );
            coreSettings[CORE_SETTINGS_MAP.currentOutroSkipThresholdS] = (
                advancedSettings[ADVANCED_SETTINGS_MAP.defaultOutroSkipThresholdS]
            );
        }

        static get franchiseSpecificDataGMPrefix() {
            return 'franchiseSpecificData_';
        }

        static makePlaybackPositionGMKey(topScopeDomainId, episodeId) {
            if (!topScopeDomainId || !episodeId) throw new Error('Something is missing');
            return `playbackTimestamp_${topScopeDomainId}_${episodeId}`;
        }

        // It is better not to be async
        handleTopScopeMessages(packet) {
            (async function() {
                try {
                    switch (packet.command) {
                        case TopScopeInterface.messages.CURRENT_FRANCHISE_DATA: {
                            // At least one value is going to be present
                            this.currentVideoId = packet.data.currentVideoId || null;
                            this.topScopeDomainId = packet.data.topScopeDomainId || '';

                            // Store anime info for AniSkip
                            this.animeTitle = packet.data.animeTitle || null;
                            this.animeSlug = packet.data.animeSlug || null;
                            this.episodeNumber = packet.data.episodeNumber || null;
                            this.seasonNumber = packet.data.seasonNumber || null;

                            // Fetch AniSkip data when we receive episode info
                            if (this.animeTitle && this.animeSlug && this.episodeNumber) {
                                this.fetchAniSkipData().then(data => {
                                    this.aniSkipData = data;
                                    globalAniSkipData = data;
                                    // Now that we have the data, add timeline markers
                                    const player = document.querySelector('video');
                                    if (player) {
                                        addTimelineMarkers(player);
                                    }
                                }).catch(err => {
                                    console.error('[AniSkip] Error during fetch:', err);
                                });
                            }

                            if (packet.data.currentFranchiseId) {
                                this.currentFranchiseId = packet.data.currentFranchiseId;

                                const {
                                    largeSkipSizeS,
                                    outroSkipThresholdS
                                } = GM_getValue(
                                    `${IframeInterface.franchiseSpecificDataGMPrefix}${this.currentFranchiseId}`
                                ) || {};

                                if (isNumeric(largeSkipSizeS)) {
                                    coreSettings[CORE_SETTINGS_MAP.currentLargeSkipSizeS] = largeSkipSizeS;
                                } else {
                                    coreSettings[CORE_SETTINGS_MAP.currentLargeSkipSizeS] = (
                                        advancedSettings[ADVANCED_SETTINGS_MAP.defaultLargeSkipSizeS]
                                    );
                                }

                                if (isNumeric(outroSkipThresholdS)) {
                                    coreSettings[CORE_SETTINGS_MAP.currentOutroSkipThresholdS] = outroSkipThresholdS;
                                } else {
                                    coreSettings[CORE_SETTINGS_MAP.currentOutroSkipThresholdS] = (
                                        advancedSettings[ADVANCED_SETTINGS_MAP.defaultOutroSkipThresholdS]
                                    );
                                }

                                this.settingsPane?.refresh();
                                this.ignoreMissingFranchiseOnce = false;
                            }

                            break;
                        }

                        case TopScopeInterface.messages.FULLSCREEN_STATE: {
                            if (IS_SAFARI) break;
                            this.isInFullscreen = packet.data.isInFullscreen;
                            this.updateFullscreenBtn({
                                isInFullscreen: this.isInFullscreen
                            });
                            break;
                        }

                        default:
                            break;
                    }
                } catch (e) {
                    console.error(e);
                }
            }.bind(this)());
            return {
                status: `${this.constructor.name} received a message`,
            };
        }

        async fetchAniSkipData() {
            // Check if AniSkip is enabled
            if (!advancedSettings[ADVANCED_SETTINGS_MAP.useAniSkip]) {
                globalAniSkipData = null;
                return null;
            }

            try {
                // Use instance variables instead of extracting from page
                const title = this.animeTitle;
                const slug = this.animeSlug;
                const episode = this.episodeNumber;
                const season = this.seasonNumber;

                if (!title || !slug || !episode) {
                    console.log('[AniSkip] Missing anime info:', { title, slug, episode, season });
                    globalAniSkipData = null;
                    return null;
                }

                console.log('[AniSkip] Fetching for:', { title, slug, episode, season });

                // Fetch MAL ID (include season for multi-season anime)
                const malId = await AniSkipModule.getMalId(title, slug, season);
                if (!malId) {
                    console.log('[AniSkip] Could not find MAL ID');
                    Notiflix.Notify.info(i18n.aniSkipFetchFailed, {
                        timeout: 2000,
                        position: 'right-bottom'
                    });
                    globalAniSkipData = null;
                    return null;
                }

                console.log('[AniSkip] Found MAL ID:', malId);

                // Fetch skip times
                const skipTimes = await AniSkipModule.getSkipTimes(malId, episode);
                if (!skipTimes || !skipTimes.length) {
                    console.log('[AniSkip] No skip times found');
                    globalAniSkipData = null;

                    // Show submit notification
                    if (advancedSettings[ADVANCED_SETTINGS_MAP.showAniSkipNotifications]) {
                        this.showSubmitNotification(malId, episode);
                    }

                    return null;
                }

                // Parse the times
                const parsed = AniSkipModule.parseSkipTimes(skipTimes);
                if (parsed && parsed.intro) {
                    console.log('[AniSkip] Successfully fetched skip times:', parsed);

                    // Don't show notification - removed as requested

                    globalAniSkipData = parsed;
                    return parsed;
                } else {
                    // Skip times found but no intro
                    console.log('[AniSkip] No intro timestamp in response');

                    // Show submit notification
                    if (advancedSettings[ADVANCED_SETTINGS_MAP.showAniSkipNotifications]) {
                        this.showSubmitNotification(malId, episode);
                    }
                }

                globalAniSkipData = null;
                return null;
            } catch (e) {
                console.error('[AniSkip] Error fetching skip times:', e);
                globalAniSkipData = null;
                return null;
            }
        }

        showSubmitNotification(malId, episode) {
            console.log('[AniSkip] Showing submit button');

            // Helper to convert MM:SS or SS to seconds
            const timeToSeconds = (timeStr) => {
                timeStr = String(timeStr).trim();
                if (timeStr.includes(':')) {
                    const parts = timeStr.split(':');
                    if (parts.length === 2) {
                        const minutes = parseInt(parts[0]) || 0;
                        const seconds = parseInt(parts[1]) || 0;
                        return minutes * 60 + seconds;
                    }
                }
                return parseFloat(timeStr) || 0;
            };

            // Helper to format seconds as MM:SS
            const secondsToTime = (seconds) => {
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins}:${secs.toString().padStart(2, '0')}`;
            };

            // Create button element
            const button = document.createElement('a');
            button.id = 'AniSkipSubmitButton';
            button.className = 'notiflix-report-button';
            button.style.cssText = `
                position: absolute;
                bottom: 65px;
                right: 15px;
                font-weight: 600;
                font-size: 14px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                z-index: 10000;
                text-decoration: none;
                display: inline-block;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                transition: all 0.3s ease, opacity 0.3s ease;
                border: 2px solid rgba(255,255,255,0.2);
                opacity: 1;
            `;
            button.textContent = 'Submit Intro';

            // Auto-hide functionality
            let hideTimeout;
            let isMouseOverButton = false;

            const showButton = () => {
                button.style.opacity = '1';
                button.style.pointerEvents = 'auto';
                clearTimeout(hideTimeout);
                hideTimeout = setTimeout(() => {
                    if (!isMouseOverButton) {
                        button.style.opacity = '0';
                        button.style.pointerEvents = 'none';
                    }
                }, 3000); // Hide after 3 seconds of no mouse movement
            };

            const hideButton = () => {
                if (!isMouseOverButton) {
                    button.style.opacity = '0';
                    button.style.pointerEvents = 'none';
                }
            };

            // Show button on mouse movement
            document.addEventListener('mousemove', showButton);

            // Keep button visible when hovering over it
            button.addEventListener('mouseenter', () => {
                isMouseOverButton = true;
                button.style.opacity = '1';
                button.style.pointerEvents = 'auto';
                clearTimeout(hideTimeout);
            });

            button.addEventListener('mouseleave', () => {
                isMouseOverButton = false;
                hideTimeout = setTimeout(hideButton, 2000);
            });

            // Initial hide after 3 seconds
            hideTimeout = setTimeout(hideButton, 3000);

            // Hide the Skip Intro button when Submit button is visible
            const hideSkipIntroButton = () => {
                const skipIntroBtn = document.querySelector('.SkipIntroBtn');
                if (skipIntroBtn) {
                    skipIntroBtn.style.display = 'none';
                    console.log('[AniSkip] Skip Intro button hidden');
                }
            };

            // Try to hide it immediately and keep checking
            hideSkipIntroButton();
            const checkInterval = setInterval(hideSkipIntroButton, 500);

            // Clean up when submit button is removed
            const originalRemove = button.remove.bind(button);
            button.remove = function() {
                clearInterval(checkInterval);
                const skipIntroBtn = document.querySelector('.SkipIntroBtn');
                if (skipIntroBtn) {
                    skipIntroBtn.style.display = '';
                }
                originalRemove();
            };

            button.onmouseenter = function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
                this.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
                this.style.background = 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)';
            };

            button.onmouseleave = function() {
                this.style.transform = '';
                this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
                this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            };

            button.onclick = async (e) => {
                e.preventDefault();
                console.log('[AniSkip] Submit button clicked');

                // Wait for player to be ready
                let player = this.player;
                if (!player) {
                    console.log('[AniSkip] Player not in this.player, searching for it...');
                    // Try to find player in DOM
                    const videoEl = document.querySelector('video');
                    if (videoEl) {
                        player = videoEl;
                        console.log('[AniSkip] Found video element');
                    }
                }

                if (!player) {
                    Notiflix.Notify.failure('Player not ready', {
                        timeout: 3000,
                        position: 'right-bottom'
                    });
                    return;
                }

                const currentTime = Math.floor(player.currentTime || 0);
                const suggestedStartSecs = currentTime;
                const suggestedEndSecs = currentTime + 90;

                // Helper to format seconds as MM:SS
                const formatTime = (seconds) => {
                    const mins = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    return `${mins}:${secs.toString().padStart(2, '0')}`;
                };

                console.log('[AniSkip] Creating Tweakpane UI...');

                // Create Tweakpane container
                const paneContainer = document.createElement('div');
                paneContainer.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 99999;
                    background: rgba(30, 30, 30, 0.98);
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                    min-width: 320px;
                    cursor: move;
                `;
                document.body.appendChild(paneContainer);

                // Make draggable
                let isDragging = false;
                let currentX;
                let currentY;
                let initialX;
                let initialY;

                paneContainer.addEventListener('mousedown', (e) => {
                    if (e.target === paneContainer || e.target.classList.contains('tp-rotv_t')) {
                        isDragging = true;
                        initialX = e.clientX - paneContainer.offsetLeft;
                        initialY = e.clientY - paneContainer.offsetTop;
                    }
                });

                document.addEventListener('mousemove', (e) => {
                    if (isDragging) {
                        e.preventDefault();
                        currentX = e.clientX - initialX;
                        currentY = e.clientY - initialY;
                        paneContainer.style.transform = 'none';
                        paneContainer.style.left = currentX + 'px';
                        paneContainer.style.top = currentY + 'px';
                    }
                });

                document.addEventListener('mouseup', () => {
                    isDragging = false;
                });

                // Create Tweakpane
                const pane = new Tweakpane.Pane({
                    container: paneContainer,
                    title: 'Submit Intro Times',
                });

                console.log('[AniSkip] Pane created:', pane);

                const params = {
                    introStart: formatTime(suggestedStartSecs),
                    introEnd: formatTime(suggestedEndSecs),
                };

                try {
                    const startInput = pane.addInput(params, 'introStart', {
                        label: 'Start (MM:SS)'
                    });
                    console.log('[AniSkip] Start input added:', startInput);
                } catch (e) {
                    console.error('[AniSkip] Error adding start input:', e);
                }

                try {
                    const endInput = pane.addInput(params, 'introEnd', {
                        label: 'End (MM:SS)'
                    });
                    console.log('[AniSkip] End input added:', endInput);
                } catch (e) {
                    console.error('[AniSkip] Error adding end input:', e);
                }

                pane.addSeparator();

                const submitBtn = pane.addButton({
                    title: 'Submit to AniSkip',
                });
                console.log('[AniSkip] Submit button added:', submitBtn);

                submitBtn.on('click', async () => {
                    console.log('[AniSkip] Submit button in pane clicked');

                    const introStart = timeToSeconds(params.introStart);
                    const introEnd = timeToSeconds(params.introEnd);

                    console.log('[AniSkip] Intro start:', params.introStart, '→', introStart, 'seconds');
                    console.log('[AniSkip] Intro end:', params.introEnd, '→', introEnd, 'seconds');

                    // Validate
                    if (!Number.isFinite(introStart) || !Number.isFinite(introEnd) || introEnd <= introStart) {
                        Notiflix.Notify.failure('Invalid times. End must be greater than start.', {
                            timeout: 3000,
                            position: 'right-bottom'
                        });
                        return;
                    }

                    const episodeLength = player.duration ? Math.floor(player.duration) : 0;

                    console.log('[AniSkip] Submitting:', {
                        malId,
                        episode,
                        episodeLength,
                        introStart,
                        introEnd
                    });

                    // Close pane
                    pane.dispose();
                    paneContainer.remove();

                    // Submit
                    Notiflix.Notify.info('Submitting to AniSkip...', {
                        timeout: 3000,
                        position: 'right-bottom'
                    });

                    const result = await AniSkipModule.submitSkipTimes(
                        malId,
                        episode,
                        episodeLength,
                        introStart,
                        introEnd
                    );

                    if (result.success) {
                        Notiflix.Notify.success('Successfully submitted! Thank you for contributing!', {
                            timeout: 5000,
                            position: 'right-bottom'
                        });
                        button.remove();
                    } else {
                        Notiflix.Notify.failure('Failed to submit. Please try again.' + (result.error ? `: ${result.error}` : ''), {
                            timeout: 5000,
                            position: 'right-bottom'
                        });
                    }
                });

                pane.addButton({
                    title: 'Cancel',
                }).on('click', () => {
                    pane.dispose();
                    paneContainer.remove();
                });

                // Force expand the pane
                setTimeout(() => {
                    const titleElement = paneContainer.querySelector('.tp-rotv_b');
                    if (titleElement) {
                        console.log('[AniSkip] Found title element, checking if collapsed');
                        const folder = paneContainer.querySelector('.tp-rotv');
                        if (folder && folder.classList.contains('tp-rotv-collapsed')) {
                            console.log('[AniSkip] Pane is collapsed, clicking to expand');
                            titleElement.click();
                        } else {
                            console.log('[AniSkip] Pane already expanded');
                        }
                    } else {
                        console.log('[AniSkip] Could not find title element');
                    }
                }, 100);
            };

            // Insert button into page
            const insertButton = () => {
                // Remove any existing button first
                const existing = document.getElementById('AniSkipSubmitButton');
                if (existing) existing.remove();

                document.body.appendChild(button);
                console.log('[AniSkip] Submit button inserted into DOM');
            };

            // Wait for page to be ready
            if (document.body) {
                insertButton();
            } else {
                document.addEventListener('DOMContentLoaded', insertButton);
            }

            // Adjust position on fullscreen
            document.addEventListener('fullscreenchange', () => {
                const isFullscreen = !!document.fullscreenElement;
                if (isFullscreen) {
                    button.style.bottom = '88px';
                } else {
                    button.style.bottom = '65px';
                }
            });
        }

        async init(player) {
            this.messenger.registerConnectionListener(this.handleTopScopeMessages.bind(this));
            this.messenger.sendMessage(IframeMessenger.messages.REQUEST_CURRENT_FRANCHISE_DATA);

            // AniSkip data will be fetched when CURRENT_FRANCHISE_DATA message arrives
            await this.preparePlayer(player);
        }


        createAutoplayButton() {
            const button = document.createElement('button');
            const toggleContainer = document.createElement('div');
            const toggleDot = document.createElement('div');
            const isAutoplayEnabled = coreSettings[CORE_SETTINGS_MAP.isAutoplayEnabled];
            let lastClickTime = 0;
            button.addEventListener('click', () => {
                const now = Date.now();

                // Prevent double-clicks unwanted behavior
                if (now - lastClickTime < 300) return;

                lastClickTime = now;

                if (!GM_getValue('firstRunTextWasShown')) {
                    GM_setValue('firstRunTextWasShown', true);

                    this.messenger.sendMessage(IframeMessenger.messages.TOP_NOTIFLIX_REPORT_INFO, {
                        args: [
                            i18n.firstRunInfoTitle,
                            i18n.firstRunInfoText(IS_MOBILE, hotkeysSettings[HOTKEYS_SETTINGS_MAP.largeSkip]),
                            i18n.ok, {
                                delayedButton: true,
                            },
                        ],
                    });
                }

                const wasEnabled = coreSettings[CORE_SETTINGS_MAP.isAutoplayEnabled];
                coreSettings[CORE_SETTINGS_MAP.isAutoplayEnabled] = !wasEnabled;

                button.setAttribute('aria-checked', (!wasEnabled).toString());
                button.title = (
                    !isAutoplayEnabled ? i18n.autoplayDisabled : i18n.autoplayEnabled
                );
                toggleDot.style.backgroundColor = wasEnabled ? '#e1e1e1' : '#fff';
                toggleDot.style.transform = wasEnabled ? 'translateX(0px)' : 'translateX(12px)';
            });

            button.type = 'button';
            button.title = (
                !isAutoplayEnabled ? i18n.autoplayDisabled : i18n.autoplayEnabled
            );
            button.appendChild(toggleContainer);
            button.setAttribute('aria-checked', (isAutoplayEnabled).toString());
            button.className = 'Autoplay-button';

            toggleContainer.className = 'Autoplay-button--toggle';
            toggleContainer.appendChild(toggleDot);

            toggleDot.className = 'Autoplay-button--toggle-dot';
            toggleDot.style.backgroundColor = !isAutoplayEnabled ? '#e1e1e1' : '#fff';
            toggleDot.style.transform = (
                !isAutoplayEnabled ? 'translateX(0px)' : 'translateX(12px)'
            );
            GM_addStyle([`
    .Autoplay-button {
      width: 36px;
      height: 36px;
      padding: 0;
      border-radius: 50%;
      border: none;
      background: none;
      cursor: pointer;
      top: 0;
      left: 0;
      transition: all 0.2s ease;
      user-select: none;
      -webkit-user-select: none;
    }

    .Autoplay-button[aria-checked="true"] .Autoplay-button--toggle-dot {
      transform: translateX(12px);
    }

    .Autoplay-button--toggle {
      width: 24px;
      height: 12px;
      margin-bottom: 3px;
      background-color: rgba(221, 221, 221, 0.5);
      border-radius: 6px;
      position: relative;
      display: inline-block;
    }

    .Autoplay-button--toggle-dot {
      width: 12px;
      height: 12px;
      background-color: #e1e1e1;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 0;
      transition: all 0.2s ease;
    }
  `][0]);
            return button;
        }

        createSettingsPane() {
            const pane = new Tweakpane.Pane();
            pane.hidden = true;

            pane.on('change', () => {
                this.messenger.sendMessage(IframeMessenger.messages.UPDATE_CORE_SETTINGS);
            });
            document.body.addEventListener('click', (ev) => {
                if (!ev.target.closest('div.tp-dfwv')) pane.hidden = true;
            });
            GM_addStyle([
                // Main container
                `
      .tp-dfwv {
        --tp-font-family: sans-serif;
        width: 400px;
        max-width: 100%;
        top: 0;
        right: 0;
        z-index: 99999;
      }
    `,

                // A container one level below the main one
                `
      .tp-rotv {
        max-height: 85vh;
        font-size: 12px;
        overflow-y: scroll;
        scrollbar-width: thin;
        scrollbar-color: #6b6c73 #37383d;
      }
    `,

                // Any text input
                `
      .tp-txtv_i, .tp-sglv_i {
        font-size: 14px !important;
        padding: 0 8px !important;
        color: var(--in-fg) !important;
        background-color: var(--in-bg) !important;
        opacity: 1 !important;
      }
    `,

                // Checkboxes
                `
      .tp-ckbv_w {
        width: 80%;
        margin: auto;
      }
    `,
            ].join(' '));
            // Stop leaking events to the player
            (['keydown', 'keyup', 'keypress'].forEach(event =>
                pane.element.addEventListener(event, (e) => e.stopPropagation())
            ));
            const assignTooltip = (text, object) => {
                object.element.title = text;
                if (
                    object.element.firstElementChild.matches &&
                    object.element.firstElementChild.matches('div.tp-lblv_l')
                ) {
                    object.element.firstElementChild.addEventListener('click', (ev) => {
                        if (!['pen', 'touch'].includes(ev.pointerType)) return;

                        this.messenger.sendMessage(IframeMessenger.messages.TOP_NOTIFLIX_REPORT_INFO, {
                            args: [object.element.firstElementChild.innerText, text, i18n.close, {
                                backOverlayClickToClose: true,
                            }],
                        });
                    });
                }
            };
            const tabs = pane.addTab({
                pages: [{
                        title: i18n.preferences
                    },
                    {
                        title: i18n.advanced
                    },
                ],
            });
            const mainTab = tabs.pages[0];
            const advancedTab = tabs.pages[1];

            const mainTabApplyBtn = mainTab.addButton({
                disabled: true,
                title: i18n.apply,
            });
            const advancedTabApplyBtn = advancedTab.addButton({
                disabled: true,
                title: i18n.apply,
            });
            for (const btn of [mainTabApplyBtn, advancedTabApplyBtn]) {
                btn.on('click', () => {
                    setTimeout(() => {
                        mainTabApplyBtn.disabled = true;
                        advancedTabApplyBtn.disabled = true;
                    });
                });
            }

            pane.element.addEventListener('click', () => {
                mainTabApplyBtn.disabled = false;
                advancedTabApplyBtn.disabled = false;
            });
            const priorityFolder = mainTab.addFolder({
                title: i18n.providersPriority
            });
            (() => {
                const ids = coreSettings[CORE_SETTINGS_MAP.providersPriority];
                // Filter to only show VOE (ID '1')
                const filteredIds = ids.filter(id => id === '1');
                const buttons = [];

                filteredIds.forEach((id, index) => {
                    const button = priorityFolder.addButton({
                        title: `⬆ ${index + 1}) ${VIDEO_PROVIDERS_IDS[id]}`,
                    });

                    button.on('click', () => {
                        // VOE is the only one, so no reordering needed
                        // But keep the handler for consistency
                    });

                    buttons.push(button);
                });
            })();

            const miscellaneousMainFolder = mainTab.addFolder({
                title: i18n.miscellaneous
            });
            miscellaneousMainFolder.on('change', (ev) => {
                if (!ev.last) return;

                if (
                    typeof ev.value === 'string' &&
                    MAIN_SETTINGS_MAP[ev.presetKey]
                ) {
                    mainSettings[ev.presetKey] = mainSettings[ev.presetKey].trim();
                    ev.target.refresh();
                }
            });
            assignTooltip(i18n.persistentMutedAutoplayTooltip, miscellaneousMainFolder.addInput(mainSettings,
                MAIN_SETTINGS_MAP.shouldAutoplayMuted, {
                    label: i18n.persistentMutedAutoplay,
                },
            ));
            assignTooltip(i18n.autoSkipAtStartTooltip, miscellaneousMainFolder.addInput(coreSettings,
                CORE_SETTINGS_MAP.shouldAutoSkipOnStart, {
                    label: i18n.autoSkipAtStart,
                },
            ));
            assignTooltip(i18n.playbackPositionMemoryTooltip, miscellaneousMainFolder.addInput(mainSettings,
                MAIN_SETTINGS_MAP.playbackPositionMemory, {
                    label: i18n.playbackPositionMemory,
                },
            ));
            assignTooltip(i18n.autoSkipIntroTooltip, miscellaneousMainFolder.addInput(coreSettings,
                CORE_SETTINGS_MAP.autoSkipIntro, {
                    label: i18n.autoSkipIntro,
                },
            ));
            assignTooltip(i18n.skipSecondsOnStartTooltip, miscellaneousMainFolder.addInput(coreSettings,
                CORE_SETTINGS_MAP.autoSkipSecondsOnStart, {
                    step: 1,
                    min: 0,
                    label: i18n.skipSecondsOnStart,
                },
            ));
            if (IS_MOBILE || advancedSettings[ADVANCED_SETTINGS_MAP.showDeviceSpecificSettings]) {
                assignTooltip(i18n.overrideDoubletapBehaviorTooltip, miscellaneousMainFolder.addInput(mainSettings,
                    MAIN_SETTINGS_MAP.overrideDoubletapBehavior, {
                        label: i18n.overrideDoubletapBehavior,
                    },
                ));
            }

            (() => {
                for (const {
                        settingKey,
                        errName,
                        inputOptions,
                        tooltip,
                    }
                    of [{
                            settingKey: CORE_SETTINGS_MAP.currentLargeSkipSizeS,
                            errName: 'Intro skip size',
                            inputOptions: {
                                step: 1,
                                min: 0,
                                label: i18n.introSkipSize,
                            },
                            tooltip: i18n.introSkipSizeTooltip,
                        },

                        {
                            settingKey: CORE_SETTINGS_MAP.currentOutroSkipThresholdS,
                            errName: 'Outro skip threshold',
                            inputOptions: {
                                step: 1,
                                min: 0.5,
                                label: i18n.outroSkipThreshold,
                            },
                            tooltip: i18n.outroSkipThresholdTooltip,
                        },
                    ]) {
                    const input = (
                        miscellaneousMainFolder.addInput(coreSettings, settingKey, inputOptions)
                    );
                    assignTooltip((tooltip), input);

                    input.on('change', (ev) => {
                        if (!ev.last) return;

                        if (!this.currentFranchiseId) {
                            // This is needed because 'change' event is being triggered by pane.refresh()
                            // that is called from CURRENT_FRANCHISE_DATA message handler
                            if (this.ignoreMissingFranchiseOnce) {
                                this.ignoreMissingFranchiseOnce = false;
                                return;
                            }

                            Notiflixx.notify.failure(
                                `${GM_info.script.name}: ${i18n.errorSaving} "${errName}"${i18n.reportBug}`
                            );

                            return;
                        }

                        GM_setValue((
                            `${IframeInterface.franchiseSpecificDataGMPrefix}${this.currentFranchiseId}`
                        ), {
                            largeSkipSizeS: coreSettings[CORE_SETTINGS_MAP.currentLargeSkipSizeS],
                            outroSkipThresholdS: coreSettings[CORE_SETTINGS_MAP.currentOutroSkipThresholdS],
                        });
                    });
                }
            })();
            miscellaneousMainFolder.addButton({
                title: i18n.resetToDefaults,
            }).on('click', () => {
                mainSettings.update(MAIN_SETTINGS_DEFAULTS);

                coreSettings[CORE_SETTINGS_MAP.currentLargeSkipSizeS] = (
                    advancedSettings[ADVANCED_SETTINGS_MAP.defaultLargeSkipSizeS]
                );

                coreSettings[CORE_SETTINGS_MAP.currentOutroSkipThresholdS] = (
                    advancedSettings[ADVANCED_SETTINGS_MAP.defaultOutroSkipThresholdS]
                );

                this.currentFranchiseId && GM_deleteValue(
                    `${IframeInterface.franchiseSpecificDataGMPrefix}${this.currentFranchiseId}`
                );

                pane.refresh();
            });
            if (!IS_MOBILE || advancedSettings[ADVANCED_SETTINGS_MAP.showDeviceSpecificSettings]) {
                const hotkeysFolder = advancedTab.addFolder({
                    title: i18n.hotkeys,
                    expanded: !IS_MOBILE
                });
                hotkeysFolder.on('change', (ev) => {
                    if (!ev.last) return;

                    if (
                        typeof ev.value === 'string' &&
                        HOTKEYS_SETTINGS_MAP[ev.presetKey]
                    ) {
                        hotkeysSettings[ev.presetKey] = hotkeysSettings[ev.presetKey].trim().toLowerCase();
                        ev.target.refresh();
                    }
                });

                assignTooltip(i18n.fastBackwardTooltip, hotkeysFolder.addInput(hotkeysSettings,
                    HOTKEYS_SETTINGS_MAP.fastBackward, {
                        label: i18n.fastBackward,
                    },
                ));
                assignTooltip(i18n.fastForwardTooltip, hotkeysFolder.addInput(hotkeysSettings,
                    HOTKEYS_SETTINGS_MAP.fastForward, {
                        label: i18n.fastForward,
                    },
                ));
                assignTooltip(i18n.fullscreenTooltip, hotkeysFolder.addInput(hotkeysSettings,
                    HOTKEYS_SETTINGS_MAP.fullscreen, {
                        label: i18n.fullscreen,
                    },
                ));
                assignTooltip(i18n.largeSkipTooltip, hotkeysFolder.addInput(hotkeysSettings,
                    HOTKEYS_SETTINGS_MAP.largeSkip, {
                        label: i18n.largeSkip,
                    },
                ));
                const hotkeysGuideBtn = hotkeysFolder.addButton({
                    title: i18n.hotkeysGuide
                });
                hotkeysGuideBtn.on('click', () => {
                    this.messenger.sendMessage(IframeMessenger.messages.OPEN_HOTKEYS_GUIDE);
                });
                hotkeysFolder.addButton({
                    title: i18n.resetToDefaults,
                }).on('click', () => {
                    hotkeysSettings.update(HOTKEYS_SETTINGS_DEFAULTS);
                    pane.refresh();
                });
            }

            const miscellaneousAdvancedFolder = advancedTab.addFolder({
                title: i18n.miscellaneous
            });
            miscellaneousAdvancedFolder.on('change', (ev) => {
                if (!ev.last) return;

                if (
                    typeof ev.value === 'string' &&
                    ADVANCED_SETTINGS_MAP[ev.presetKey]
                ) {
                    advancedSettings[ev.presetKey] = advancedSettings[ev.presetKey].trim();
                    ev.target.refresh();
                }
            });
            assignTooltip(i18n.defaultIntroSkipSizeTooltip, miscellaneousAdvancedFolder.addInput(advancedSettings,
                ADVANCED_SETTINGS_MAP.defaultLargeSkipSizeS, {
                    step: 1,
                    min: 0,
                    label: i18n.defaultIntroSkipSize,
                },
            ));
            assignTooltip(i18n.defaultOutroSkipThresholdTooltip, miscellaneousAdvancedFolder.addInput(advancedSettings,
                ADVANCED_SETTINGS_MAP.defaultOutroSkipThresholdS, {
                    step: 1,
                    min: 0.5,
                    label: i18n.defaultOutroSkipThreshold,
                },
            ));
            assignTooltip(i18n.markWatchedAfterTooltip, miscellaneousAdvancedFolder.addInput(advancedSettings,
                ADVANCED_SETTINGS_MAP.markWatchedAfterS, {
                    step: 1,
                    min: 0,
                    label: i18n.markWatchedAfter,
                },
            ));
            assignTooltip(i18n.fastForwardSizeTooltip, miscellaneousAdvancedFolder.addInput(advancedSettings,
                ADVANCED_SETTINGS_MAP.fastForwardSizeS, {
                    step: 1,
                    min: 0,
                    label: i18n.fastForwardSize,
                },
            ));
            assignTooltip(i18n.useAniSkipTooltip, miscellaneousAdvancedFolder.addInput(advancedSettings,
                ADVANCED_SETTINGS_MAP.useAniSkip, {
                    label: i18n.useAniSkip,
                },
            ));
            assignTooltip(i18n.showAniSkipNotificationsTooltip, miscellaneousAdvancedFolder.addInput(advancedSettings,
                ADVANCED_SETTINGS_MAP.showAniSkipNotifications, {
                    label: i18n.showAniSkipNotifications,
                },
            ));
            const skipIntroToggleInput = miscellaneousAdvancedFolder.addInput(
                advancedSettings,
                ADVANCED_SETTINGS_MAP.showSkipIntroButton, {
                    label: i18n.showSkipIntroButton
                }
            );
            assignTooltip(
                i18n.showSkipIntroButtonTooltip,
                skipIntroToggleInput
            );
            // 🔁 Realtime visibility update
            skipIntroToggleInput.on('change', ev => {
                const skipBtn = document.querySelector('.SkipIntroBtn');

                if (ev.value) {
                    if (!skipBtn) {
                        const player = document.querySelector('video');
                        if (player) {
                            setupSkipIntroButton(player);
                            addTimelineMarkers(player);
                        }
                    } else {
                        skipBtn.classList.remove('invisible');
                    }
                } else {
                    if (skipBtn) skipBtn.classList.add('invisible');
                }
            });
            assignTooltip(
                i18n.showSkipIntroButtonSecondsTooltip,
                miscellaneousAdvancedFolder.addInput(advancedSettings,
                    ADVANCED_SETTINGS_MAP.showSkipIntroButtonSeconds, {
                        label: i18n.showSkipIntroButtonSeconds,
                        step: 1,
                        min: 5,
                        max: 600,
                    }
                )
            );
            assignTooltip(i18n.preloadOtherProvidersTooltip, miscellaneousAdvancedFolder.addInput(advancedSettings,
                ADVANCED_SETTINGS_MAP.preloadOtherProviders, {
                    label: i18n.preloadOtherProviders,
                },
            ));
            assignTooltip(i18n.playOnIntroSkipTooltip, miscellaneousAdvancedFolder.addInput(advancedSettings,
                ADVANCED_SETTINGS_MAP.playOnLargeSkip, {
                    label: i18n.playOnIntroSkip,
                },
            ));

            assignTooltip(i18n.showDeviceSpecificSettingsTooltip, miscellaneousAdvancedFolder.addInput(advancedSettings,
                ADVANCED_SETTINGS_MAP.showDeviceSpecificSettings, {
                    label: i18n.showDeviceSpecificSettings,
                },
            ));
            if (IS_MOBILE || advancedSettings[ADVANCED_SETTINGS_MAP.showDeviceSpecificSettings]) {
                assignTooltip(i18n.doubleTapTimingThresholdTooltip, miscellaneousAdvancedFolder.addInput(advancedSettings,
                    ADVANCED_SETTINGS_MAP.doubletapTimingThresholdMs, {
                        step: 20,
                        min: 100,
                        max: 1000,
                        label: i18n.doubleTapTimingThreshold,
                    },
                ));
            }

            if (IS_MOBILE || advancedSettings[ADVANCED_SETTINGS_MAP.showDeviceSpecificSettings]) {
                assignTooltip(i18n.doubleTapDistanceThresholdTooltip, miscellaneousAdvancedFolder.addInput(advancedSettings,
                    ADVANCED_SETTINGS_MAP.doubletapDistanceThresholdPx, {
                        step: 10,
                        min: 10,
                        max: 5000,
                        label: i18n.doubleTapDistanceThreshold,
                    },
                ));
            }

            if (!IS_MOBILE || advancedSettings[ADVANCED_SETTINGS_MAP.showDeviceSpecificSettings]) {
                assignTooltip(i18n.introSkipCooldownTooltip, miscellaneousAdvancedFolder.addInput(advancedSettings,
                    ADVANCED_SETTINGS_MAP.largeSkipCooldownMs, {
                        step: 1,
                        min: 0,
                        label: i18n.introSkipCooldown,
                    },
                ));
            }

            assignTooltip(i18n.playbackPositionExpirationTooltip, miscellaneousAdvancedFolder.addInput(advancedSettings,
                ADVANCED_SETTINGS_MAP.playbackPositionExpirationDays, {
                    step: 1,
                    min: 1,
                    max: 365,
                    label: i18n.playbackPositionExpiration,
                },
            ));
            assignTooltip(i18n.corsProxyTooltip, miscellaneousAdvancedFolder.addInput(advancedSettings,
                ADVANCED_SETTINGS_MAP.corsProxy, {
                    label: i18n.corsProxy,
                },
            ));
            assignTooltip(i18n.commlinkPollingIntervalTooltip, miscellaneousAdvancedFolder.addInput(advancedSettings,
                ADVANCED_SETTINGS_MAP.commlinkPollingIntervalMs, {
                    step: 10,
                    min: 10,
                    max: 500,
                    label: i18n.commlinkPollingInterval,
                },
            ));
            miscellaneousAdvancedFolder.addButton({
                title: i18n.resetToDefaults,
            }).on('click', () => {
                advancedSettings.update(ADVANCED_SETTINGS_DEFAULTS);
                pane.refresh();
            });
            return pane;
        }

        async handleAutoplay(player) {
            if (!coreSettings[CORE_SETTINGS_MAP.isAutoplayEnabled]) return;
            const playTooSlowErr = 'play() was taking too long';
            let muteWasApplied = false;
            // If play fails it tries to fix it but throws the problem error anyway
            const playOrFix = async () => {
                try {
                    await Promise.race([
                        player.play(), // there is a chance this would hang forever
                        new Promise((_, reject) => {
                            setTimeout(() => reject(new Error(playTooSlowErr)), 50);
                        }),
                    ]);
                } catch (e) {
                    if (e.name === 'NotAllowedError') {
                        // Muted usually is allowed to play,
                        // and if it's not allowed, nothing could be done here
                        if (player.muted) {
                            console.error('Muted and not allowed');
                            throw e;
                        }

                        if (mainSettings[MAIN_SETTINGS_MAP.shouldAutoplayMuted] && !muteWasApplied) {
                            player.muted = true;
                            muteWasApplied = true;

                            // Restore setting altered by forced mute.
                            // See this.setupPersistentVolume()
                            setTimeout(() => (coreSettings[CORE_SETTINGS_MAP.isMuted] = false));
                            // Should not be awaited
                            (async () => {
                                await waitForUserInteraction();

                                // If interaction was unmute button, try to not overtake it
                                // because it might result in mute -> unmute -> mute again.
                                // Different players require a different delay
                                await sleep(100);

                                if (player.muted) player.muted = false;
                            })();
                        }
                    }

                    throw e;
                }
            };

            const startTime = Date.now();
            let lastError = null;

            while ((Date.now() - startTime) < (10 * 1000)) {
                try {
                    await sleep(200);
                    await playOrFix();

                    return;
                } catch (e) {
                    lastError = e;
                }
            }

            throw lastError;
        }

        setupDoubletapBehavior(player, doubletapTarget = player) {
            if (!mainSettings[MAIN_SETTINGS_MAP.overrideDoubletapBehavior]) return;
            detectDoubletap(doubletapTarget, (ev) => {
                const xViewport = ev.clientX;
                const rect = ev.target.getBoundingClientRect();

                // Get X relative to the target just in case.
                // It is not really needed since the player takes the whole size of an iframe
                const xTarget = xViewport - rect.left;

                if (xTarget < rect.width * 0.35) {
                    if (advancedSettings[ADVANCED_SETTINGS_MAP.fastForwardSizeS]) {
                        player.currentTime -= advancedSettings[ADVANCED_SETTINGS_MAP.fastForwardSizeS];
                    }
                } else if (xTarget > rect.width - (rect.width * 0.35)) {
                    if (advancedSettings[ADVANCED_SETTINGS_MAP.fastForwardSizeS]) {
                        player.currentTime += advancedSettings[ADVANCED_SETTINGS_MAP.fastForwardSizeS];
                    }
                } else {
                    if (coreSettings[CORE_SETTINGS_MAP.currentLargeSkipSizeS]) {
                        player.currentTime += coreSettings[CORE_SETTINGS_MAP.currentLargeSkipSizeS];
                        if (advancedSettings[ADVANCED_SETTINGS_MAP.playOnLargeSkip]) {
                            player.play();
                        }
                    }
                }
            }, {
                maxIntervalMs: advancedSettings[ADVANCED_SETTINGS_MAP.doubletapTimingThresholdMs],
                tapsDistanceThresholdPx: (
                    advancedSettings[ADVANCED_SETTINGS_MAP.doubletapDistanceThresholdPx]
                ),
            });
        }

        setupHotkeys(player) {
            keyboardJS.bind('space', () => player.paused ? player.play() : player.pause());
            if (hotkeysSettings[HOTKEYS_SETTINGS_MAP.fastForward]) {
                keyboardJS.bind(hotkeysSettings[HOTKEYS_SETTINGS_MAP.fastForward], () => {
                    if (advancedSettings[ADVANCED_SETTINGS_MAP.fastForwardSizeS]) {
                        player.currentTime += advancedSettings[ADVANCED_SETTINGS_MAP.fastForwardSizeS];
                    }
                });
            }

            if (hotkeysSettings[HOTKEYS_SETTINGS_MAP.fastBackward]) {
                keyboardJS.bind(hotkeysSettings[HOTKEYS_SETTINGS_MAP.fastBackward], () => {
                    if (advancedSettings[ADVANCED_SETTINGS_MAP.fastForwardSizeS]) {
                        player.currentTime -= advancedSettings[ADVANCED_SETTINGS_MAP.fastForwardSizeS];
                    }
                });
            }

            if (hotkeysSettings[HOTKEYS_SETTINGS_MAP.fullscreen]) {
                keyboardJS.bind(hotkeysSettings[HOTKEYS_SETTINGS_MAP.fullscreen], (ev) => {
                    ev.preventRepeat();
                    this.messenger.sendMessage(IframeMessenger.messages.TOGGLE_FULLSCREEN);
                });
            }

            if (hotkeysSettings[HOTKEYS_SETTINGS_MAP.largeSkip]) {
                const cooldownTime = advancedSettings[ADVANCED_SETTINGS_MAP.largeSkipCooldownMs];
                let lastSkipTime = 0;

                keyboardJS.bind(hotkeysSettings[HOTKEYS_SETTINGS_MAP.largeSkip], () => {
                    if (coreSettings[CORE_SETTINGS_MAP.currentLargeSkipSizeS]) {
                        const now = Date.now();

                        if (now - lastSkipTime < cooldownTime) return;

                        lastSkipTime = now;

                        console.log('[Keyboard Skip] Pressed. globalAniSkipData:', globalAniSkipData);

                        // Check if we have AniSkip data for intro
                        if (globalAniSkipData && globalAniSkipData.intro) {
                            // Use AniSkip intro end time
                            console.log('[Keyboard Skip] Using AniSkip time:', globalAniSkipData.intro.end);
                            player.currentTime = globalAniSkipData.intro.end;
                            if (advancedSettings[ADVANCED_SETTINGS_MAP.showAniSkipNotifications]) {
                                Notiflix.Notify.success(i18n.aniSkipIntroDetected, {
                                    timeout: 1500,
                                    position: 'right-bottom'
                                });
                            }
                        } else {
                            // Fallback to manual skip size
                            console.log('[Keyboard Skip] Using fallback skip size:', coreSettings[CORE_SETTINGS_MAP.currentLargeSkipSizeS]);
                            player.currentTime += coreSettings[CORE_SETTINGS_MAP.currentLargeSkipSizeS];
                            if (globalAniSkipData === null && advancedSettings[ADVANCED_SETTINGS_MAP.useAniSkip] && advancedSettings[ADVANCED_SETTINGS_MAP.showAniSkipNotifications]) {
                                Notiflix.Notify.info(i18n.usingFallbackTimes, {
                                    timeout: 1500,
                                    position: 'right-bottom'
                                });
                            }
                        }

                        const skipBtn = document.querySelector('.SkipIntroBtn');
                        if (skipBtn) {
                            skipBtn.classList.add('invisible');
                            window.__skipIntroButtonDisabled = true;
                        }

                        if (advancedSettings[ADVANCED_SETTINGS_MAP.playOnLargeSkip]) {
                            player.play();
                        }
                    }
                });
            }
        }

        setupOutroSkipHandling(player) {
            let outroHasBeenReached = false;
            setInterval(() => {
                if (outroHasBeenReached || !coreSettings[CORE_SETTINGS_MAP.isAutoplayEnabled]) return;

                const timeLeft = player.duration - player.currentTime;

                if (timeLeft <= coreSettings[CORE_SETTINGS_MAP.currentOutroSkipThresholdS]) {
                    outroHasBeenReached = true;
                    this.messenger.sendMessage(IframeMessenger.messages.AUTOPLAY_NEXT);
                }
            }, 250);
        }

        setupAutoIntroSkip(player) {
            if (!coreSettings[CORE_SETTINGS_MAP.autoSkipIntro]) return;

            let introHasBeenSkipped = false;
            let hasStartedPlaying = false;

            const checkInterval = setInterval(() => {
                if (introHasBeenSkipped || !coreSettings[CORE_SETTINGS_MAP.autoSkipIntro]) {
                    clearInterval(checkInterval);
                    return;
                }

                const currentTime = player.currentTime;

                // Mark as started playing once we get past 0.5 seconds
                if (!hasStartedPlaying && currentTime > 0.5) {
                    hasStartedPlaying = true;
                }

                // Don't skip until we've actually started playing
                if (!hasStartedPlaying) return;

                // Only auto-skip if we have AniSkip data
                if (globalAniSkipData && globalAniSkipData.intro) {
                    // Skip when we're within the intro timeframe
                    if (currentTime >= globalAniSkipData.intro.start && currentTime < globalAniSkipData.intro.end) {
                        introHasBeenSkipped = true;
                        player.currentTime = globalAniSkipData.intro.end;

                        if (advancedSettings[ADVANCED_SETTINGS_MAP.playOnLargeSkip]) {
                            player.play();
                        }
                        clearInterval(checkInterval);
                    }
                }
                // No fallback - auto-skip only works with AniSkip data
            }, 250);
        }

        setupPersistentVolume(player) {
            player.muted = coreSettings[CORE_SETTINGS_MAP.isMuted];
            player.volume = coreSettings[CORE_SETTINGS_MAP.persistentVolumeLvl];

            player.addEventListener('volumechange', () => {
                coreSettings[CORE_SETTINGS_MAP.isMuted] = player.muted;
                coreSettings[CORE_SETTINGS_MAP.persistentVolumeLvl] = player.volume;
            });
        }

        setupWatchedStateLabeling(player) {
            const intervalMs = 250;
            let approximatePlayTimeS = 0;
            let currentVideoWasWatched = false;
            let lastPlayerTime = player.currentTime;
            setInterval(() => {
                if (player.currentTime === lastPlayerTime) return;

                lastPlayerTime = player.currentTime;
                approximatePlayTimeS += intervalMs / 1000;

                if (
                    !currentVideoWasWatched &&
                    advancedSettings[ADVANCED_SETTINGS_MAP.markWatchedAfterS] &&
                    approximatePlayTimeS >= advancedSettings[ADVANCED_SETTINGS_MAP.markWatchedAfterS]
                ) {
                    currentVideoWasWatched = true;
                    this.messenger.sendMessage(IframeMessenger.messages.MARK_CURRENT_VIDEO_WATCHED);
                }
            }, intervalMs);
        }

        async setupVideoPlaybackPositionMemory(player) {
            const self = this;
            await (async function waitForVideoData(start = Date.now()) {
                if (!self.currentVideoId || !self.topScopeDomainId) {
                    if ((Date.now() - start) > (10 * 1000)) {
                        throw new Error('Video data didn\'t arrive in time');
                    }

                    await sleep();

                    return waitForVideoData(start);
                }
            }());
            // This has to wait indefinitely because players like VOE do not have the value
            // until the play button has been pressed or an autoplay has been triggered
            await (async function waitForVideoDuration() {
                if (!player.duration) {
                    await sleep();
                    return waitForVideoDuration();
                }
            }());
            const timestampDataGMKey = (
                IframeInterface.makePlaybackPositionGMKey(this.topScopeDomainId, this.currentVideoId)
            );
            const timestampData = GM_getValue(timestampDataGMKey, {});

            if (timestampData.value) {
                const elapsedTime = Date.now() - timestampData.updateDate;
                const expirationThreshold = advancedSettings[
                    ADVANCED_SETTINGS_MAP.playbackPositionExpirationDays
                ] * 24 * 60 * 60 * 1000;
                if (elapsedTime < expirationThreshold) {
                    const outroSkipThresholdS = coreSettings[CORE_SETTINGS_MAP.currentOutroSkipThresholdS];
                    const potentialTimeLeftToPlay = player.duration - timestampData.value;

                    // Skip saved playback position if it's in a range of (outroSkipThresholdS + 20)
                    if (potentialTimeLeftToPlay > (outroSkipThresholdS + 20)) {
                        player.currentTime = timestampData.value;
                    }
                }
            }

            let lastCheckedTime = player.currentTime;
            setInterval(() => {
                if (
                    !mainSettings[MAIN_SETTINGS_MAP.playbackPositionMemory] ||
                    (player.currentTime === lastCheckedTime)
                ) return;

                lastCheckedTime = player.currentTime;

                GM_setValue(timestampDataGMKey, {
                    value: lastCheckedTime,
                    updateDate: Date.now(),
                });
            }, 1000);
        }
    }


    class VidozaIframeInterface extends IframeInterface {
        constructor(messenger) {
            super(messenger);
            waitForElement([
                'div[id^=asg-]',
                'div.prevent-first-click',
                'div.vjs-adblock-overlay',
                'iframe[data-asg-handled^="asg-"]',
                'iframe[style*="z-index: 2147483647"]',
            ].join(', '), {
                existing: true,
            }, (ads) => ads.remove());
            (function() {
                const originalAddEventListener = EventTarget.prototype.addEventListener;

                EventTarget.prototype.addEventListener = function(type, listener, options) {
                    // Get rid of ads
                    if (type === 'mousedown' && (this === document || this === unsafeWindow)) {
                        return;
                    }

                    return originalAddEventListener.call(this, type, listener, options);
                };
            }());
        }

        static get queries() {
            return {
                fullscreenBtn: 'button.vjs-fullscreen-control',
                player: 'video#player_html5_api.vjs-tech',
            };
        }

        async preparePlayer(player) {
            this.setupDoubletapBehavior(player);
            this.setupHotkeys(player);
            if (advancedSettings[ADVANCED_SETTINGS_MAP.showSkipIntroButton]) {
                setupSkipIntroButton(player);
            }

            addTimelineMarkers(player);
            this.setupOutroSkipHandling(player);
            this.setupAutoIntroSkip(player);
            this.setupWatchedStateLabeling(player);
            this.setupVideoPlaybackPositionMemory(player);
            this.restylePlayer(player);

            let hasSkippedInitial = false;
            player.addEventListener('timeupdate', function autoStartSkip() {
                if (!hasSkippedInitial && coreSettings[CORE_SETTINGS_MAP.shouldAutoSkipOnStart]) {
                    const skipSeconds = Number(coreSettings[CORE_SETTINGS_MAP.autoSkipSecondsOnStart]) || 0;
                    if (player.currentTime < skipSeconds) {
                        player.currentTime = skipSeconds;
                    }
                    hasSkippedInitial = true;
                }
            });
            this.setupPersistentVolume(player);
            this.handleAutoplay(player); // should go after setupPersistentVolume

            // Attach autoplay button and change fullscreen button behavior...
            waitForElement(VidozaIframeInterface.queries.fullscreenBtn, {
                existing: true,
                onceOnly: true,
            }, (fsBtn) => {
                // Prevent focused buttons from being toggled by pressing space/enter
                fsBtn.parentElement.addEventListener('keydown', (ev) => ev.preventDefault());
                fsBtn.parentElement.addEventListener('keyup', (ev) => ev.preventDefault());

                const newFsBtn = fsBtn.cloneNode(true);
                const autoplayBtn = this.createAutoplayButton();
                const settingsPane = this.settingsPane = this.createSettingsPane();

                autoplayBtn.style.paddingBottom = '1px';

                fsBtn.before(autoplayBtn);

                IS_SAFARI ? fsBtn.remove() : fsBtn.replaceWith(newFsBtn);

                const toggleSettingsPane = (ev) => {
                    ev?.preventDefault();
                    ev?.stopImmediatePropagation();

                    settingsPane.hidden = !settingsPane.hidden;

                    return false;
                };
                if (IS_MOBILE) {
                    autoplayBtn.oncontextmenu = () => false;
                    detectHold(autoplayBtn, toggleSettingsPane);
                } else {
                    autoplayBtn.oncontextmenu = toggleSettingsPane;
                }

                if (IS_SAFARI === false) {
                    newFsBtn.addEventListener('click', () => {
                        this.messenger.sendMessage(IframeMessenger.messages.TOGGLE_FULLSCREEN);
                    });
                    this.messenger.sendMessage(IframeMessenger.messages.REQUEST_FULLSCREEN_STATE);
                }
            });
        }

        restylePlayer() {
            GM_addStyle([
                `
      div.vjs-resolution-button, button.vjs-disable-ads-button {
        display: none !important;
      }
    `,

                `
      div.video-js div.vjs-control-bar {
        background-color: unset !important;
      }
    `,

                `
      div.video-js .vjs-slider {
        background-color: rgb(112, 112, 112, 0.8) !important;
      }
    `,

                `
      div.video-js .vjs-play-progress {
        background-color: #2979ff !important;
        border-radius: 1em !important;
        height: 0.4em !important;
      }

      div.video-js .vjs-play-progress:before {
        font-size: 0.9em !important;
        top: -.25em !important;
      }
    `,

                `
      div.video-js .vjs-load-progress {
        background-color: #808080 !important;
        height: 0.4em !important;
      }
    `,

                `
      div.video-js .vjs-progress-control .vjs-progress-holder {
        height: 0.4em !important;
      }
    `,

                `
      div.video-js .vjs-time-control, div.vjs-playback-rate .vjs-playback-rate-value, div.vjs-resolution-button .vjs-resolution-button-label {
        line-height: 3em !important;
      }
    `,

                `
      div.video-js .vjs-big-play-button {
        background-color: rgb(0 132 255 / 75%) !important;
      }

      div.video-js .vjs-big-play-button:hover {
        background-color: rgb(40 160 255 / 95%) !important;
      }
    `,

                `
      div.video-js .vjs-progress-control:hover .vjs-mouse-display:after, div.video-js .vjs-progress-control:hover .vjs-play-progress:after, div.video-js .vjs-progress-control:hover .vjs-time-tooltip, div.video-js .vjs-volume-panel .vjs-volume-control.vjs-volume-vertical, div.vjs-menu-button-popup .vjs-menu .vjs-menu-content {
        background-color: rgb(0 132 255 / 75%) !important;
      }
    `,

                `
      #vplayer .video-js .vjs-time-control {
        padding-right: 3.5em !important;
      }
    `,

                `
      div.video-js .vjs-play-control {
        margin-left: 0.5em !important;
      }
    `,

                `
      div.video-js .vjs-progress-control {
        margin-left: 0.8em !important;
      }
    `,

                `
      div.video-js .vjs-fullscreen-control {
        margin-right: 0.5em !important;
      }
    `,
            ].join(' '));
            const currentTime = document.querySelector('div.vjs-current-time');
            const remainingTime = document.querySelector('div.vjs-remaining-time');

            remainingTime.replaceWith(currentTime);
        }

        updateFullscreenBtn({
            isInFullscreen
        }) {
            const player = document.querySelector(VidozaIframeInterface.queries.player);
            if (isInFullscreen) {
                player.parentElement.classList.add('vjs-fullscreen');
            } else {
                player.parentElement.classList.remove('vjs-fullscreen');
            }
        }
    }

    class VOEJWPIframeInterface extends IframeInterface {
        constructor(messenger) {
            super(messenger);
            const playbackPositionStorageKey = (
                `skip-forward-${location.pathname.split('/').pop()}`
            );
            try {
                this.builtinPlaybackPositionMemory = JSON.parse(localStorage.getItem(
                    playbackPositionStorageKey
                ));
            } catch {}

            localStorage.removeItem(playbackPositionStorageKey);
            waitForElement([
                'div.guestMode',
                'iframe[style*="z-index: 2147483647"]',
            ].join(', '), {
                existing: true,
            }, (ads) => ads.remove());
            (function() {
                const originalAddEventListener = EventTarget.prototype.addEventListener;

                EventTarget.prototype.addEventListener = function(type, listener, options) {
                    if (
                        // Get rid of ads
                        (['click', 'mousedown'].includes(type) && this === document) ||
                        // Intercept original hotkeys to avoid conflicts with the script hotkeys
                        (type === 'keydown' && this.matches && this.matches('div#vp'))
                    ) {
                        return;
                    }

                    // Intercept double-tap to fullscreen handler
                    if (
                        IS_MOBILE &&
                        mainSettings[MAIN_SETTINGS_MAP.overrideDoubletapBehavior] &&
                        (type === 'click' && this.matches && this.matches('div#vp > div > div.jw-media'))
                    ) {
                        let timerId = null;
                        return originalAddEventListener.call(this, type, () => {
                            clearTimeout(timerId);

                            const playerContainer = document.querySelector('div#vp');

                            if (playerContainer.classList.contains('jw-flag-user-inactive')) {
                                playerContainer.classList.remove('jw-flag-user-inactive');

                                timerId = setTimeout(() => {
                                    playerContainer.classList.add('jw-flag-user-inactive');
                                }, 2000);
                            } else {
                                playerContainer.classList.add('jw-flag-user-inactive');
                            }
                        }, options);
                    }

                    return originalAddEventListener.call(this, type, listener, options);
                };
            }());
        }

        static get queries() {
            return {
                fullscreenBtn: 'div.jw-tooltip-fullscreen',
                player: 'video.jw-video',
            };
        }

        async handleAutoplay(player) {
            if (!coreSettings[CORE_SETTINGS_MAP.isAutoplayEnabled]) return;
            const playTooSlowErr = 'play() was taking too long';
            let muteWasApplied = false;
            let playBtnWasClicked = false;
            // If play fails it tries to fix it but throws the problem error anyway
            const playOrFix = async () => {
                try {
                    // VOE play() either errors immediately
                    // or never resolves until a play button click
                    await Promise.race([
                        player.play(),
                        new Promise((_, reject) => {
                            setTimeout(() => reject(new Error(playTooSlowErr)), 150);
                        }),
                    ]);
                } catch (e) {
                    if (e.message === playTooSlowErr) {
                        if (playBtnWasClicked) throw e;
                        document.querySelector('div.jw-icon-display').click();
                        playBtnWasClicked = true;
                    } else if (e.name === 'NotAllowedError') {
                        // Muted usually is allowed to play,
                        // and if it's not allowed, nothing could be done here
                        if (player.muted) {
                            console.error('Muted and not allowed');
                            throw e;
                        }

                        if (mainSettings[MAIN_SETTINGS_MAP.shouldAutoplayMuted] && !muteWasApplied) {
                            player.muted = true;
                            muteWasApplied = true;

                            // Restore setting altered by forced mute.
                            // See this.setupPersistentVolume()
                            setTimeout(() => (coreSettings[CORE_SETTINGS_MAP.isMuted] = false));
                            // Should not be awaited
                            (async () => {
                                await waitForUserInteraction();

                                // If interaction was unmute button, try to not overtake it
                                // because it might result in mute -> unmute -> mute again.
                                // Different players require a different delay
                                await sleep(100);

                                if (player.muted) player.muted = false;
                            })();
                        }
                    }

                    throw e;
                }
            };

            const startTime = Date.now();
            let lastError = null;

            while ((Date.now() - startTime) < (10 * 1000)) {
                try {
                    await sleep(200);
                    await playOrFix();

                    return;
                } catch (e) {
                    lastError = e;
                }
            }

            throw lastError;
        }

        async preparePlayer(player) {
            this.setupDoubletapBehavior(player);
            this.setupHotkeys(player);
            if (advancedSettings[ADVANCED_SETTINGS_MAP.showSkipIntroButton]) {
                setupSkipIntroButton(player);
            }

            addTimelineMarkers(player);
            this.setupOutroSkipHandling(player);
            this.setupAutoIntroSkip(player);
            this.setupWatchedStateLabeling(player);
            this.setupVideoPlaybackPositionMemory(player);

            let hasSkippedInitial = false;
            player.addEventListener('timeupdate', function autoStartSkip() {
                if (!hasSkippedInitial && coreSettings[CORE_SETTINGS_MAP.shouldAutoSkipOnStart]) {
                    const skipSeconds = Number(coreSettings[CORE_SETTINGS_MAP.autoSkipSecondsOnStart]) || 0;
                    if (player.currentTime < skipSeconds) {
                        player.currentTime = skipSeconds;
                    }
                    hasSkippedInitial = true;
                }
            });
            this.setupPersistentVolume(player);
            this.handleAutoplay(player); // should go after setupPersistentVolume

            // Attach autoplay button and change fullscreen button behavior...
            waitForElement(VOEJWPIframeInterface.queries.fullscreenBtn, {
                existing: true,
                onceOnly: true,
            }, (fsBtn) => {
                fsBtn = fsBtn.parentElement;

                const newFsBtn = fsBtn.cloneNode(true);
                const autoplayBtn = this.createAutoplayButton();
                const settingsPane = this.settingsPane = this.createSettingsPane();

                autoplayBtn.style.width = '44px';
                autoplayBtn.style.height = '44px';
                autoplayBtn.style.paddingTop = '3px';
                autoplayBtn.style.flex = '0 0 auto';
                autoplayBtn.style.outline = 'none';

                fsBtn.before(autoplayBtn);

                IS_SAFARI ? fsBtn.remove() : fsBtn.replaceWith(newFsBtn);

                const toggleSettingsPane = (ev) => {
                    ev?.preventDefault();
                    ev?.stopImmediatePropagation();

                    settingsPane.hidden = !settingsPane.hidden;

                    return false;
                };

                if (IS_MOBILE) {
                    autoplayBtn.oncontextmenu = () => false;
                    detectHold(autoplayBtn, toggleSettingsPane);
                } else {
                    autoplayBtn.oncontextmenu = toggleSettingsPane;
                }

                if (IS_SAFARI === false) {
                    newFsBtn.addEventListener('click', () => {
                        this.messenger.sendMessage(IframeMessenger.messages.TOGGLE_FULLSCREEN);
                    });
                    this.messenger.sendMessage(IframeMessenger.messages.REQUEST_FULLSCREEN_STATE);
                }
            });
        }

        async setupVideoPlaybackPositionMemory(player) {
            const self = this;
            await (async function waitForVideoData(start = Date.now()) {
                if (!self.currentVideoId || !self.topScopeDomainId) {
                    if ((Date.now() - start) > (10 * 1000)) {
                        throw new Error('Video data didn\'t arrive in time');
                    }

                    await sleep();

                    return waitForVideoData(start);
                }
            }());
            const timestampDataGMKey = (
                IframeInterface.makePlaybackPositionGMKey(this.topScopeDomainId, this.currentVideoId)
            );
            if (
                this.builtinPlaybackPositionMemory &&
                this.builtinPlaybackPositionMemory.value
            ) {
                const {
                    expire,
                    value
                } = this.builtinPlaybackPositionMemory;
                let updateDate = Date.now();

                // 10 days is the built in position memory expiration time
                if (expire) {
                    updateDate = (
                        new Date((new Date(expire)).getTime() - 10 * 24 * 60 * 60 * 1000).getTime()
                    );
                }

                GM_setValue(timestampDataGMKey, {
                    value,
                    updateDate
                });
            }

            // This has to wait indefinitely because players like VOE do not have the value
            // until the play button has been pressed or an autoplay has been triggered
            await (async function waitForVideoDuration() {
                if (!player.duration) {
                    await sleep();
                    return waitForVideoDuration();
                }
            }());
            const timestampData = GM_getValue(timestampDataGMKey, {});

            if (timestampData.value) {
                const elapsedTime = Date.now() - timestampData.updateDate;
                const expirationThreshold = advancedSettings[
                    ADVANCED_SETTINGS_MAP.playbackPositionExpirationDays
                ] * 24 * 60 * 60 * 1000;
                if (elapsedTime < expirationThreshold) {
                    const outroSkipThresholdS = coreSettings[CORE_SETTINGS_MAP.currentOutroSkipThresholdS];
                    const potentialTimeLeftToPlay = player.duration - timestampData.value;

                    // Skip saved playback position if it's in a range of (outroSkipThresholdS + 20)
                    if (potentialTimeLeftToPlay > (outroSkipThresholdS + 20)) {
                        player.currentTime = timestampData.value;
                    }
                }
            }

            let lastCheckedTime = player.currentTime;
            setInterval(() => {
                if (
                    !mainSettings[MAIN_SETTINGS_MAP.playbackPositionMemory] ||
                    (player.currentTime === lastCheckedTime)
                ) return;

                lastCheckedTime = player.currentTime;

                GM_setValue(timestampDataGMKey, {
                    value: lastCheckedTime,
                    updateDate: Date.now(),
                });
            }, 1000);
        }

        updateFullscreenBtn({
            isInFullscreen
        }) {
            const fsBtn = document.querySelector(VOEJWPIframeInterface.queries.fullscreenBtn);
            if (isInFullscreen) {
                fsBtn.parentElement.classList.add('jw-off');
            } else {
                fsBtn.parentElement.classList.remove('jw-off');
            }
        }
    }

    class TopScopeInterface {
        constructor() {
            this.commLink = null;
            this.currentIframeId = null;
            this.domainId = TOP_SCOPE_DOMAINS_IDS[location.hostname] || '';
            this.iframeSrcChangesListener = null;
            this.id = makeId();
            this.ignoreIframeSrcChangeOnce = false;
            this.isPendingConnection = false;
            // Ugly shitcode fix for a playback positions. This assigns their value
            // to both the aniworld and s.to at the same time.
            // This is needed because these prefixes were missing before v4.8.3
            // causing saved positions being shared between different websites
            if (!GM_getValue('playbackPositionsMemory482wereFixed', false)) {
                this.applyPlaybackPositionsFix();
                GM_setValue('playbackPositionsMemory482wereFixed', true);
            }
        }

        static get messages() {
            return {
                CURRENT_FRANCHISE_DATA: 'CURRENT_FRANCHISE_DATA',
                FULLSCREEN_STATE: 'FULLSCREEN_STATE',
            };
        }

        static get queries() {
            return {
                animeTitle: 'div.hostSeriesTitle',
                episodeDedicatedLink: 'div.hosterSiteVideo a.watchEpisode',
                episodeTitle: 'div.hosterSiteTitle',
                hostersPlayerContainer: 'div.hosterSiteVideo',
                navLinksContainer: 'div#stream.hosterSiteDirectNav',
                playerIframe: 'div.inSiteWebStream iframe',
                providerChangeBtn: 'div.generateInlinePlayer',
                providerName: 'div.hosterSiteVideo > ul a > h4',
                providersList: 'div.hosterSiteVideo > ul',
                selectedLanguageBtn: 'img.selectedLanguage',
            };
        }

        applyPlaybackPositionsFix() {
            const oldPlaybackPositionsGMPrefix = 'playbackTimestamp_';
            const oldPlaybackPositionsKeys = (
                GM_listValues().filter(
                    v => v.startsWith(oldPlaybackPositionsGMPrefix) && v.split('_').length === 2
                )
            );
            const uniqueTopScopeDomainsIds = [...new Set(Object.values(TOP_SCOPE_DOMAINS_IDS))];

            for (const oldKey of oldPlaybackPositionsKeys) {
                const episodeId = oldKey.slice(oldPlaybackPositionsGMPrefix.length);
                const oldValue = GM_getValue(oldKey);

                for (const domainId of uniqueTopScopeDomainsIds) {
                    const newKey = IframeInterface.makePlaybackPositionGMKey(domainId, episodeId);
                    GM_setValue(newKey, oldValue);
                }

                GM_deleteValue(oldKey);
            }
        }

        // It is better not to be async
        handleIframeMessages(packet) {
            (async function() {
                try {
                    switch (packet.command) {
                        case IframeMessenger.messages.AUTOPLAY_NEXT: {
                            // This is here because it bugges out the episodes navigation panel
                            // if try and use MARK_CURRENT_VIDEO_WATCHED. Watched episode is being
                            // marked as non watched
                            try {
                                await this.markCurrentVideoWatched();
                            } catch (e) {
                                console.error(e);
                            }

                            try {
                                await this.goToNextVideo();
                            } catch (e) {
                                console.error(e);

                                Notiflixx.notify.warning(
                                    `${GM_info.script.name}: ${i18n.autoplayError}`
                                );
                            }

                            break;
                        }

                        case IframeMessenger.messages.REQUEST_CURRENT_FRANCHISE_DATA: {
                            const episodeId = document.querySelector(
                                TopScopeInterface.queries.episodeTitle
                            ).dataset.episodeId;
                            const releaseYear = document.querySelector(
                                'div.series-title span[itemprop="startDate"]'
                            ).innerText;
                            const title = document.querySelector('div.series-title > h1').innerText;
                            const currentFranchiseId = (
                                title ? `${title}${releaseYear ? `::${releaseYear}` : ''}` : null
                            );

                            // Extract slug, season, and episode number for AniSkip
                            const slug = location.pathname.match(/^\/anime\/stream\/([^/]+)/)?.[1] || null;
                            const episodeNumber = location.pathname.match(/\/episode-(\d+)\b/i)?.[1] || null;
                            const seasonNumber = location.pathname.match(/\/staffel-(\d+)\b/i)?.[1] || null;

                            if (currentFranchiseId || episodeId) {
                                this.commLink.commands[
                                    TopScopeInterface.messages.CURRENT_FRANCHISE_DATA
                                ]({
                                    currentFranchiseId,
                                    currentVideoId: episodeId || null,
                                    topScopeDomainId: this.domainId,
                                    // Add AniSkip-related data
                                    animeTitle: title || null,
                                    animeSlug: slug,
                                    episodeNumber: episodeNumber ? parseInt(episodeNumber, 10) : null,
                                    seasonNumber: seasonNumber ? parseInt(seasonNumber, 10) : null,
                                });
                            }

                            break;
                        }

                        // Would not work on Safari
                        // but this should not be called on Safari anyway
                        case IframeMessenger.messages.REQUEST_FULLSCREEN_STATE: {
                            if (IS_SAFARI) break;
                            this.commLink.commands[TopScopeInterface.messages.FULLSCREEN_STATE]({
                                isInFullscreen: !!document.fullscreenElement,
                            });
                            break;
                        }

                        case IframeMessenger.messages.MARK_CURRENT_VIDEO_WATCHED: {
                            await this.markCurrentVideoWatched();
                            break;
                        }

                        case IframeMessenger.messages.OPEN_HOTKEYS_GUIDE: {
                            let content = [
                                '<h5>🔹 Basic hotkeys</h5>',
                                '<div><b>Single key: </b><pre>a</pre> → Triggers when <pre>a</pre> is pressed</div>',
                                '<div><b>Combo keys: </b><pre>ctrl + shift + a</pre> → Triggers when all keys are held together</div>',
                                '<h5>🔹 Sequences (pressing keys in order)</h5>',
                                '<div><b>Sequence: </b><pre>a > b</pre> → Press <pre>a</pre>, then <pre>b</pre></div>',
                                '<div><b>Chained sequence: </b><pre>ctrl + a > b</pre> → Hold <pre>ctrl</pre>, press <pre>a</pre>, release, then press <pre>b</pre></div>',
                                '<h5>🔹 Multiple options</h5>',
                                '<div><pre>a + b > c, x + y > z</pre> → Either <pre>a</pre> & <pre>b</pre> then <pre>c</pre> OR <pre>x</pre> & <pre>y</pre> then <pre>z</pre></div>',
                                '<h5>🔹 Special keys (most of them)</h5>',
                            ].join('');
                            content += [
                                'cancel', 'backspace', 'tab', 'clear', 'enter', 'shift', 'ctrl',
                                'alt', 'menu', 'pause', 'break', 'capslock', 'pageup', 'pagedown',
                                'space', 'spacebar', 'escape', 'esc', 'end', 'home', 'left', 'up',
                                'right', 'down', 'select', 'printscreen', 'execute', 'snapshot',
                                'insert', 'ins', 'delete', 'del', 'help', 'scrolllock', 'scroll',
                                'comma', ',', 'period', '.', 'openbracket', '[', 'backslash', '\\',
                                'slash', 'forwardslash', '/', 'closebracket', ']', 'apostrophe',
                                '\'', 'zero', '0', 'one', '1', 'two', '2', 'three', '3', 'four',
                                '4', 'five', '5', 'six', '6', 'seven', '7', 'eight', '8', 'nine',
                                '9', 'numzero', 'num0', 'numone', 'num1', 'numtwo', 'num2',
                                'numthree', 'num3', 'numfour', 'num4', 'numfive', 'num5', 'numsix',
                                'num6', 'numseven', 'num7', 'numeight', 'num8', 'numnine', 'num9',
                                'nummultiply', 'num*', 'numadd', 'num+', 'numenter', 'numsubtract',
                                'num-', 'numdecimal', 'num.', 'numdivide', 'num/', 'numlock', 'num',
                                'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11',
                                'f12', 'f13', 'f14', 'f15', 'f16', 'f17', 'f18', 'f19', 'f20', 'f21',
                                'f22', 'f23', 'f24', 'tilde', '~', 'exclamation', 'exclamationpoint',
                                '!', 'at', '@', 'number', '#', 'dollar', 'dollars', 'dollarsign',
                                '$', 'percent', '%', 'caret', '^', 'ampersand', 'and', '&', 'asterisk',
                                '*', 'openparen', '(', 'closeparen', ')', 'underscore', '_', 'plus',
                                '+', 'opencurlybrace', 'opencurlybracket', '{', 'closecurlybrace',
                                'closecurlybracket', '}', 'verticalbar', '|', 'colon', ':',
                                'quotationmark', '\'', 'openanglebracket', '<', 'closeanglebracket',
                                '>', 'questionmark', '?', 'semicolon', ';', 'dash', '-', 'equal',
                                'equalsign', '=',
                            ].map(s => `<pre>${s}</pre>`).join(' ');
                            const modal = document.createElement('div');

                            modal.className = 'notiflix-hotkeys-guide-modal';
                            modal.innerHTML = content;
                            Notiflixx.report.info(i18n.hotkeysGuide, modal.outerHTML, i18n.close, {
                                backOverlayClickToClose: true,
                                messageMaxLength: Infinity,
                                plainText: false,
                            });
                            break;
                        }

                        // Would not work on Safari
                        // but this should not be called from Safari anyway
                        case IframeMessenger.messages.TOGGLE_FULLSCREEN: {
                            if (IS_SAFARI) break;
                            // Notice how this then triggers a listener from this.init()
                            if (document.fullscreenElement) {
                                await document.exitFullscreen();
                            } else {
                                await document.documentElement.requestFullscreen();
                            }

                            break;
                        }

                        case IframeMessenger.messages.TOP_NOTIFLIX_REPORT_INFO: {
                            Notiflixx.report.info(...packet.data.args);
                            break;
                        }

                        // Not sure if anything except providersPriority needs to be in sync witn an iframe
                        case IframeMessenger.messages.UPDATE_CORE_SETTINGS: {
                            coreSettings.update();
                            break;
                        }

                        default:
                            break;
                    }
                } catch (e) {
                    console.error(e);
                }
            }.bind(this)());
            return {
                status: `${this.constructor.name} received a message`,
            };
        }

        async init(iframe) {
            this.iframeSrcChangesListener = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.attributeName === 'src') {
                        if (this.ignoreIframeSrcChangeOnce) {
                            this.ignoreIframeSrcChangeOnce = false;

                            return;
                        }

                        this.unregisterCommlinkListener();
                        this.initCrossFrameConnection();
                    }
                }
            }).observe(iframe, {
                attributes: true
            });

            await this.initCrossFrameConnection();

            if (IS_SAFARI) {
                this.adaptFakeFullscreen();
                window.addEventListener('orientationchange', () => {
                    setTimeout(() => this.adaptFakeFullscreen(), 100);
                });
            } else {
                document.addEventListener('fullscreenchange', () => {
                    this.adaptFakeFullscreen();
                    this.commLink.commands[TopScopeInterface.messages.FULLSCREEN_STATE]({
                        isInFullscreen: !!document.fullscreenElement,
                    });
                });
            }
        }

        async initCrossFrameConnection() {
            if (this.isPendingConnection) throw new Error('Connecting already');
            this.isPendingConnection = true;

            let timeoutId;

            const iframeId = this.currentIframeId = await new Promise((resolve, reject) => {
                const valueChangeListenerId = GM_addValueChangeListener('unboundIframeId', (
                    _key,
                    _oldValue,
                    newValue,
                ) => {
                    const iframe = document.querySelector(TopScopeInterface.queries.playerIframe);

                    // Skip if top scope is a wrong one
                    if (!iframe) return;

                    GM_removeValueChangeListener(valueChangeListenerId);
                    clearTimeout(timeoutId);
                    resolve(newValue);
                });

                timeoutId = setTimeout(() => {
                    this.isPendingConnection = false;

                    GM_removeValueChangeListener(valueChangeListenerId);
                    reject(new Error('Iframe connection timeout'));
                }, 4 * 1000);
            });
            GM_setValue(iframeId, this.id);

            this.commLink = new CommLinkHandler(this.id, {
                silentMode: true,
                statusCheckInterval: advancedSettings[ADVANCED_SETTINGS_MAP.commlinkPollingIntervalMs],
            });
            this.commLink.registerSendCommand(TopScopeInterface.messages.CURRENT_FRANCHISE_DATA);
            this.commLink.registerSendCommand(TopScopeInterface.messages.FULLSCREEN_STATE);

            this.commLink.registerListener(iframeId, this.handleIframeMessages.bind(this));

            this.isPendingConnection = false;
        }


        adaptFakeFullscreen() {
            const Q = TopScopeInterface.queries;
            const hostersPlayerContainer = document.querySelector(Q.hostersPlayerContainer);
            const playerIframe = document.querySelector(Q.playerIframe);

            // Consider landscape mode as fullscreen on Safari
            const isInFullscreen = (
                IS_SAFARI ? window.innerWidth > window.innerHeight : !!document.fullscreenElement
            );
            if (isInFullscreen) {
                document.body.style.overflow = 'hidden';
                playerIframe.style.setProperty('height', '100vh', 'important');
                hostersPlayerContainer.firstElementChild.style.display = 'none';
                hostersPlayerContainer.style.cssText = (
                    'z-index: 100; position: fixed; top: 0; left: 0; padding: 0; height: 100vh; overflow-y: scroll; scrollbar-width: none;'
                );
            } else {
                document.body.style.overflow = '';
                playerIframe.style.height = '';

                // scrollTop reset must go before the cssText, it won't work otherwise
                hostersPlayerContainer.firstElementChild.style.display = '';
                hostersPlayerContainer.scrollTop = 0;
                hostersPlayerContainer.style.cssText = '';
            }
        }

        async announceEpisodeWatched(id) {
            if (!id) throw new Error('Episode ID is missing');
            await fetch(`${location.protocol}//${location.hostname}/ajax/lastseen`, {
                method: 'POST',
                body: `episode=${id}`,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
            });
        }

        async goToNextVideo() {
            const Q = TopScopeInterface.queries;
            const [seasonsNav, episodesNav] = document.querySelectorAll(`${Q.navLinksContainer} > ul`);
            const episodesNavLinks = [...episodesNav.querySelectorAll('a')];
            const seasonNavLinks = [...seasonsNav.querySelectorAll('a')];
            const currentEpisodeIndex = episodesNavLinks.findIndex(el => el.classList.contains('active'));
            const currentSeasonIndex = seasonNavLinks.findIndex(el => el.classList.contains('active'));
            let nextEpisodeHref = null;
            if (currentEpisodeIndex < episodesNavLinks.length - 1) {
                nextEpisodeHref = episodesNavLinks[currentEpisodeIndex + 1].href;
            } else if (currentSeasonIndex < seasonNavLinks.length - 1) {
                // Do not proceed if this is a last movie
                // so it wont hop in to a season from a movie
                if (seasonNavLinks[currentSeasonIndex].href.endsWith('/filme')) return;
                const nextSeasonHref = seasonNavLinks[currentSeasonIndex + 1].href;
                const nextSeasonHtml = await (await fetch(nextSeasonHref)).text();
                const nextSeasonDom = (new DOMParser()).parseFromString(nextSeasonHtml, 'text/html');
                const firstEpisodeLink = nextSeasonDom.querySelector(
                    `${Q.navLinksContainer} > ul a[data-episode-id]`
                );
                nextEpisodeHref = firstEpisodeLink.href;
            }

            // Seems like the last episode was reached
            if (!nextEpisodeHref) return;
            const nextEpisodeHtml = await (await fetch(nextEpisodeHref)).text();
            const nextEpisodeDom = (new DOMParser()).parseFromString(nextEpisodeHtml, 'text/html');
            // Update current DOM from a next episode DOM
            ([
                'div#wrapper > div.seriesContentBox > div.container.marginBottom > ul',
                'div#wrapper > div.seriesContentBox > div.container.marginBottom > div.cf',
                'div.changeLanguageBox',
                `${Q.episodeTitle} > ul`,
                Q.animeTitle,
                Q.episodeTitle,
                Q.navLinksContainer,
                Q.providersList,
            ]).forEach((query) => {
                const currentElement = document.querySelector(query);
                const newElement = nextEpisodeDom.querySelector(query);

                if (currentElement && newElement) {
                    currentElement.outerHTML = newElement.outerHTML;
                }
            });
            document.title = nextEpisodeDom.title;
            history.pushState({}, '', nextEpisodeHref);

            try {
                // The website code copypasta to try and restore various buttons functionality
                (function repairWebsiteFeatures() {
                    document.querySelectorAll(Q.providerChangeBtn).forEach((btn) => {
                        btn.addEventListener('click', (ev) => {
                            ev.preventDefault();

                            const parent = btn.parentElement;
                            const linkTarget = parent.getAttribute('data-link-target');
                            const hosterTarget = parent.getAttribute('data-external-embed') === 'true';
                            const fakePlayer = document.querySelector('.fakePlayer');
                            const inSiteWebStream = document.querySelector('.inSiteWebStream');
                            const iframe = inSiteWebStream.querySelector('iframe');

                            if (hosterTarget) {
                                fakePlayer.style.display = 'block';
                                inSiteWebStream.style.display = 'inline-block';
                                iframe.style.display = 'none';
                            } else {
                                fakePlayer.style.display = 'none';
                                inSiteWebStream.style.display = 'inline-block';
                                iframe.src = linkTarget;
                                iframe.style.display = 'inline-block';
                            }
                        });
                    });
                }());

                const {
                    selectedLanguage
                } = this.updateVideoLanguageProcessing();
                const preferredProvidersButtons = [
                    ...document.querySelectorAll(TopScopeInterface.queries.providerChangeBtn)
                ].filter(el => el.parentElement.dataset.langKey === selectedLanguage);
                let nextProviderName = null;
                let nextVideoLink = null;

                if (preferredProvidersButtons.length) {
                    outer: for (const id of coreSettings[CORE_SETTINGS_MAP.providersPriority]) {
                        const preferredProviderName = VIDEO_PROVIDERS_IDS[id];
                        for (const btn of preferredProvidersButtons) {
                            const link = btn.firstElementChild;
                            const providerName = link.querySelector(
                                TopScopeInterface.queries.providerName
                            ).innerText;
                            if (providerName === preferredProviderName) {
                                nextProviderName = providerName;
                                nextVideoLink = link;

                                break outer;
                            }
                        }
                    }
                }

                let nextVideoHref = nextVideoLink?.href;
                // VOE has an additional redirect page,
                // so need to extract the video href from there first
                // in order to keep VOE-to-VOE autoplay unmuted
                if (nextVideoHref && nextProviderName === VIDEO_PROVIDERS_MAP.VOE) {
                    const corsProxy =
                        advancedSettings[ADVANCED_SETTINGS_MAP.corsProxy];

                    if (corsProxy) {
                        nextVideoHref = /location\.href = '(https:\/\/.+)';/.exec(
                            await (await fetch(corsProxy + nextVideoLink.href)).text()
                        )[1];
                    }
                }

                if (!nextVideoHref) throw new Error('Embedded providers are missing or not supported');

                try {
                    document.querySelector(Q.playerIframe).src = nextVideoHref;
                    console.log('[Autoplay] Successfully changed iframe src to:', nextVideoHref);
                } catch (iframeError) {
                    console.error('[Autoplay] Error setting iframe src:', iframeError);
                    throw iframeError;
                }
            } catch (error) {
                console.error('[Autoplay] Autoplay failed:', error);
                GM_setValue('lastAutoplayError', {
                    date: Date.now(),
                    error: error.message
                });
                // At that point, refresh should load the next episode if the website even has it.
                // The problem is it is not seamless
                console.log('[Autoplay] Reloading page due to autoplay error');

                // Exit fullscreen before reload to prevent fullscreen errors
                if (document.fullscreenElement) {
                    document.exitFullscreen().then(() => {
                        location.href = location.href;
                    }).catch(() => {
                        // If exit fullscreen fails, reload anyway
                        location.href = location.href;
                    });
                } else {
                    location.href = location.href;
                }
            }
        }

        async markCurrentVideoWatched() {
            const episodeId = document.querySelector(
                TopScopeInterface.queries.episodeTitle
            ).dataset.episodeId;
            await this.announceEpisodeWatched(episodeId);
        }

        unregisterCommlinkListener() {
            if (!this.currentIframeId) return;
            this.commLink.listeners = this.commLink.listeners.filter((listener) => {
                if (listener.sender === this.currentIframeId) {
                    listener.intervalObj.stop();
                    return false;
                }

                return true;
            });

            this.currentIframeId = null;
        }

        // Partly consist of the website code
        updateVideoLanguageProcessing() {
            let changeLanguageButtons = [...document.querySelectorAll('.changeLanguageBox img')];
            let selectedLanguage = coreSettings[CORE_SETTINGS_MAP.videoLanguagePreferredID];
            const availableLangIDs = [...new Set(changeLanguageButtons.map(img => img.dataset.langKey))];
            // Checks preferred language and if it is missing, it takes first available.
            // Returns if found zero buttons with language IDs
            if (!selectedLanguage || !availableLangIDs.includes(selectedLanguage)) {
                if (availableLangIDs.length) {
                    selectedLanguage = availableLangIDs[0];
                } else {
                    return null;
                }
            }

            // Hides/unhides providers buttons based on language
            document.querySelectorAll('.hosterSiteVideo ul li[data-lang-key]').forEach((el) => {
                el.style.display = el.dataset.langKey === selectedLanguage ? 'block' : 'none';
            });
            // Highlights/unhighlights change language buttons
            changeLanguageButtons.forEach((btn) => {
                btn.classList.toggle('selectedLanguage', btn.dataset.langKey === selectedLanguage);
                btn.outerHTML = btn.outerHTML;
            });
            // HTML reset removes the nodes from the DOM so need to get them here once again
            changeLanguageButtons = [...document.querySelectorAll('.changeLanguageBox img')];
            changeLanguageButtons.forEach((btn) => {
                btn.addEventListener('click', function() {
                    const selectedLanguage = coreSettings[
                        CORE_SETTINGS_MAP.videoLanguagePreferredID
                    ] = this.getAttribute('data-lang-key');

                    // Highlights/unhighlights change language buttons
                    document.querySelectorAll('.changeLanguageBox img').forEach((btn) => {
                        btn.classList.toggle('selectedLanguage', btn.dataset.langKey === selectedLanguage);
                    });

                    // Hides/unhides providers buttons based on language
                    document.querySelectorAll('.hosterSiteVideo ul li[data-lang-key]').forEach((el) => {
                        el.style.display = el.dataset.langKey === selectedLanguage ? 'block' : 'none';
                    });

                    const preferredProvidersButtons = [
                        ...document.querySelectorAll(TopScopeInterface.queries.providerChangeBtn)
                    ].filter(el => el.parentElement.dataset.langKey === selectedLanguage);
                    if (preferredProvidersButtons.length) {
                        outer: for (const id of coreSettings[CORE_SETTINGS_MAP.providersPriority]) {
                            const preferredProviderName = VIDEO_PROVIDERS_IDS[id];
                            for (const btn of preferredProvidersButtons) {
                                const providerName = btn.firstElementChild.querySelector(
                                    TopScopeInterface.queries.providerName
                                ).innerText;

                                if (providerName === preferredProviderName) {
                                    btn.click();
                                    break outer;
                                }
                            }
                        }
                    } else {
                        document.querySelectorAll('.inSiteWebStream').forEach((el) => {
                            el.style.display = 'none';
                        });
                        this.unregisterCommlinkListener();

                        if (this.iframeSrcChangesListener) this.ignoreIframeSrcChangeOnce = true;

                        document.querySelector(TopScopeInterface.queries.playerIframe).src = 'about:blank';
                    }
                });
            });

            return {
                selectedLanguage
            };
        }
    }


    // If context is top scope
    if (!isEmbedded()) {
        if (!TOP_SCOPE_DOMAINS.includes(location.hostname)) return;
        // Recolor episodes links visited before, excluding the current or watched ones
        GM_addStyle(`
  div#stream.hosterSiteDirectNav a[data-episode-id]:visited:not([class]) {
    background: #ffdd00;
  }
  `);
        // Wait for DOM
        await new Promise((resolve) => {
            if (['complete'].includes(document.readyState)) {
                resolve();
            } else {
                document.addEventListener('DOMContentLoaded', resolve, {
                    once: true
                });
            }
        });
        try {
            const lastAutoplayError = GM_getValue('lastAutoplayError');
            if (lastAutoplayError && ((Date.now() - lastAutoplayError.date) <= (60 * 1000))) {
                GM_deleteValue('lastAutoplayError');
                Notiflixx.notify.warning(
                    `${GM_info.script.name}: ${i18n.lastAutoplayError}`
                );
            }
        } catch (e) {
            console.error(e);
        }

        const topScopeInterface = new TopScopeInterface();
        const iframe = document.querySelector(TopScopeInterface.queries.playerIframe);
        // Not a video page?
        if (!iframe) return;

        // Remove the website logic responsible for marking episodes as watched.
        // since the script would handle it instead. Awaiting is unnecessary
        (async function waitForWatchedFunction(start = Date.now()) {
            if (unsafeWindow.markAsWatched) {
                unsafeWindow.markAsWatched = () => {};
            } else {
                if ((Date.now() - start) > (10 * 1000)) {
                    throw new Error('Watched function didn\'t arrive in time');
                }

                await sleep();

                return waitForWatchedFunction(start);
            }
        }());
        iframe.addEventListener('load', async () => {
            await topScopeInterface.init(iframe);
        }, {
            once: true
        });
        // Wait for the website main code to finish
        await new Promise((resolve) => {
            waitForElement(TopScopeInterface.queries.selectedLanguageBtn, {
                existing: true,
                onceOnly: true,
                callbackOnTimeout: true,
                timeout: 10 * 1000,
            }, resolve);
        });
        await sleep();

        const {
            selectedLanguage
        } = topScopeInterface.updateVideoLanguageProcessing();
        const preferredProvidersButtons = [
            ...document.querySelectorAll(TopScopeInterface.queries.providerChangeBtn)
        ].filter(el => el.parentElement.dataset.langKey === selectedLanguage);
        if (preferredProvidersButtons.length) {
            for (const id of coreSettings[CORE_SETTINGS_MAP.providersPriority]) {
                const preferredProviderName = VIDEO_PROVIDERS_IDS[id];
                for (const btn of preferredProvidersButtons) {
                    const providerName = btn.firstElementChild.querySelector(
                        TopScopeInterface.queries.providerName
                    ).innerText;
                    if (providerName === preferredProviderName) {
                        btn.click();
                        return;
                    }
                }
            }
        }
    }

    // If context is iframe scope
    else {
        const isItVOEJWP = !!document.querySelector('meta[name="keywords"][content^="VOE"]');
        const isItVidoza = !!document.querySelector('meta[content*="Vidoza"]');
        if ([isItVidoza, isItVOEJWP].every(e => !e)) {
            return;
        }

        const iframeMessenger = new IframeMessenger();
        for (const {
                condition,
                interface: Interface
            }
            of [
                {
                    condition: isItVidoza,
                    interface: VidozaIframeInterface
                },
                {
                    condition: isItVOEJWP,
                    interface: VOEJWPIframeInterface
                },
            ]) {
            if (!condition) continue;
            // Call early to get rid of ads and intercept listeners
            const iframeInterface = new Interface(iframeMessenger);
            window.addEventListener('load', async () => {
                // Give a little bit of a time for the TopScopeInterface to prepare
                await sleep(4);
                await iframeMessenger.initCrossFrameConnection();

                waitForElement(Interface.queries.player, {
                    existing: true,
                    onceOnly: true,
                }, async (player) => {
                    // Prevent fullscreen triggering by a playback start, on Safari
                    player.setAttribute('playsinline', '');
                    player.setAttribute('webkit-playsinline', '');

                    // Attempt to fix a Safari bug when the video controls get duplicated
                    GM_addStyle(`
        video::-webkit-media-controls-panel, video::-webkit-media-controls-play-button, video::-webkit-media-controls-start-playback-button {
          display: none !important;
          -webkit-appearance: none;
          opacity: 0;
          visibility: hidden;
        }
      `);

                    await iframeInterface.init(player);
                });
            }, {
                once: true
            });
            break;
        }
    }
}());