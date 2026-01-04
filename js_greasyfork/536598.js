// ==UserScript==
// @name            Instagram Video Controls
// @description     Adds native html controls to all videos (rewind, fullscreen, etc)
// @description:ru  Добавляет дефолтные кнопки управления видео (перемотка, "на весь экран" и тд)
// @namespace       http://tampermonkey.net/
// @version         0.0.5
// @author          undfndusr
// @match           *://*.instagram.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant           GM.addStyle
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM_addValueChangeListener
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/536598/Instagram%20Video%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/536598/Instagram%20Video%20Controls.meta.js
// ==/UserScript==

(function() {
    const OPTIONS = {
        REMEMBER_VIDEO_PLAYBACK_RATE: 1,
    };

    const debounce = (func, wait) => {
        let timeout;
        return function (...args) {
            return new Promise(resolve => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    timeout = null;
                    Promise.resolve(func.apply(this, [...args])).then(resolve);
                }, wait);
            });
        };
    };

    const injectStyles = () => {
        const styles = `
            /* кнопка вкл/выкл звука для всех видео, кроме страниц рилсов (*.com/reels/) */
            video + div[data-instancekey] > [data-visualcompletion="ignore"] > .html-div,

            /* кнопка вкл/выкл звука для видео на страницах рилсов */
            video + div[data-instancekey] > [data-visualcompletion="ignore"] > div > [role="presentation"] > [role="button"] > .html-div {
                position: absolute;
                top: 0;
                right: 0;
                z-index: 2;
            }

            /*
            video + div[data-instancekey] .html-div svg {
                position: relative;
                z-index: 3;
            }
            */

            video::-webkit-media-controls-volume-slider {
                display:none;
            }

            video::-webkit-media-controls-mute-button {
                display:none;
            }
        `;

        GM.addStyle(styles);
    };

    const setControls = async () => {
        document.querySelectorAll('video:not([controls])').forEach(video => {
            video.setAttribute('controls', 'true');
            video.style.position = 'relative';
            video.style.zIndex = '1';

            if (location.pathname.startsWith('/stories/')) {
                video.style.height = 'calc(100% - 62px)';
            }
        });
    };

    const savePlaybackRate = async (event) => {
        GM.setValue('commonPlaybackRate', event.target.playbackRate);
    };

    const setEventHandlers = () => {
        document.querySelectorAll('video:not([data-controllable])').forEach(video => {
            video.dataset.controllable = "true";
            video.addEventListener('ratechange', savePlaybackRate);
        });
    };

    const setVideosPlaybackRate = (playbackRate) => {
        document.querySelectorAll('video').forEach(video => {
            video.playbackRate = playbackRate || 1;
        });
    };

    const setInitialPlaybackRate = async () => {
        const playbackRate = await GM.getValue('commonPlaybackRate');

        setVideosPlaybackRate(playbackRate);
    };

    const listenPlaybackChanges = () => {
        GM_addValueChangeListener('commonPlaybackRate', (key, oldRate, newRate) => {
            if (oldRate !== newRate) {
                setVideosPlaybackRate(newRate);
            }
        });
    };

    const main = () => {
        if (OPTIONS.REMEMBER_VIDEO_PLAYBACK_RATE) {
            setEventHandlers();
            setInitialPlaybackRate();
            listenPlaybackChanges();
        }

        setControls();
    };

    const init = () => {
        main();
        injectStyles();

        const debouncedHandler = debounce(main, 1000);

        const observer = new MutationObserver(debouncedHandler);

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    init();
})();