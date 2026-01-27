// ==UserScript==
// @name           YouTube speed rememberer
// @version        0.4.0
// @description    Remembers playback speed.
// @description:ru Запоминает скорость воспроизведения.
// @author         gvvad
// @match          *.youtube.com/*
// @run-at         document-body
// @license        GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @namespace      https://greasyfork.org/users/100160
// @downloadURL https://update.greasyfork.org/scripts/27091/YouTube%20speed%20rememberer.user.js
// @updateURL https://update.greasyfork.org/scripts/27091/YouTube%20speed%20rememberer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PLAYER_ID = 'movie_player';
    const CUSTOM_BTN_ID = '_ytp-label';

    let store = {
        get rate() {
            const v = parseFloat(localStorage.getItem('pl-rate'));
            return Number.isFinite(v) ? v : 1.0;
        },
        set rate(v) {
            if (!Number.isFinite(v)) return;
            localStorage.setItem('pl-rate', String(v));
        }
    };

    function formatRate(r) {
        // show integer as "x2" or decimals "x1.25"
        return 'x' + (Math.round(r) === r ? String(r) : String(Number(r).toFixed(2)).replace(/\.00$/, ''));
    }

    function setLabel(msg, playerEl) {
        const existing = document.getElementById(CUSTOM_BTN_ID);
        if (msg === undefined) {
            if (existing && existing.parentElement) existing.parentElement.removeChild(existing);
            return;
        }
        if (existing) {
            existing.textContent = msg;
            return;
        }

        // .ytp-right-controls exists on modern YouTube
        const controls = playerEl?.querySelector('.ytp-right-controls') || playerEl?.querySelector('.ytp-chrome-controls');
        if (!controls) return;

        let insertBeforeTarget = controls.querySelector('.ytp-right-controls-left')?.firstChild || controls.firstChild || null;
        if (!insertBeforeTarget) return;

        const customElement = document.createElement('span');
        customElement.id = CUSTOM_BTN_ID;
        customElement.className = 'ytp-button';
        customElement.style.lineHeight = '3';
        customElement.style.textAlign = 'center';

        customElement.addEventListener('click', () => {
            try {
                if (playerEl && typeof playerEl.setPlaybackRate === 'function') {
                    playerEl.setPlaybackRate(1);
                }
            } catch (e) {
                console.warn('Failed to set playback rate:', e);
            }
        });

        customElement.textContent = msg;

        insertBeforeTarget.parentElement.insertBefore(customElement, insertBeforeTarget);
    }

    function setSpeedLabel(rate, playerEl) {
        if (!playerEl) {
            setLabel(undefined);
            return;
        }
        setLabel(rate === 1 ? undefined : formatRate(rate), playerEl);
    }

    // manage attachment + listener lifecycle
    let currentPlayer = null;

    function onRateChange() {
        try {
            const newRate = currentPlayer.getPlaybackRate();
            store.rate = newRate;
            setSpeedLabel(newRate, currentPlayer);
        } catch (e) {
            console.warn('Error handling rate change:', e);
        }
    };

    function detachPlayer() {
        if (currentPlayer) {
            try {
                currentPlayer.removeEventListener('onPlaybackRateChange', onRateChange);
            } catch (e) {
                // don't implement removeEventListener
            }
        }
        currentPlayer = null;
        setLabel(undefined);
    }

    function attachPlayer(player) {
        if (!player || player === currentPlayer) return;
        detachPlayer();
        currentPlayer = player;

        try {
            const progressState = typeof currentPlayer.getProgressState === 'function' ? currentPlayer.getProgressState() : null;
            const isLiveHead = progressState && progressState.isAtLiveHead;

            if (store.rate !== 1.0 && !isLiveHead) {
                currentPlayer.setPlaybackRate(store.rate);
            }

            let currentRate = currentPlayer.getPlaybackRate();
            setSpeedLabel(currentRate, currentPlayer);

            currentPlayer.addEventListener('onPlaybackRateChange', onRateChange);
        } catch (e) {
            console.warn('Failed to attach to player:', e);
            detachPlayer();
        }
    }

    // observe for player insertion / replacement
    const observer = new MutationObserver(function () {
        const playerElement = document.getElementById(PLAYER_ID);
        if (playerElement) {
            attachPlayer(playerElement);
        } else {
            // if player removed, detach listener
            detachPlayer();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // initial attempt
    const initial = document.getElementById(PLAYER_ID);
    if (initial) attachPlayer(initial);

})();