// ==UserScript==
// @name           Youtube - Advertisement Hide
// @namespace      scriptomatika
// @author         mouse-karaganda
// @description    Выключает рекламу или звук в рекламе на ресурсе Youtube
// @license        MIT
// @include        https://*.youtube.com/*
// @require        https://greasyfork.org/scripts/379902-include-tools/code/Include%20Tools.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=www.youtube.com
// @version        1.5
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/425564/Youtube%20-%20Advertisement%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/425564/Youtube%20-%20Advertisement%20Hide.meta.js
// ==/UserScript==

(function() {
    let console = window.console;
    let $ = window.jQuery;
    let $$ = window.__krokodil;

    $$.renderStyle(
        '',
        ''
    );

    window.greasyMovieVolumeOn = false;

    /**
     * Выключает звук на внутренней рекламе
     */
    let muteInternalAdverts = function() {
        let button;

        if (button = $$.get(`.ytp-ad-overlay-slot .ytp-ad-overlay-close-button`)) {
            $$.fireEvent(button, 'click');
        }
        if (button = $$.get(`.video-ads .ytp-ad-skip-button-container`)) {
            $$.fireEvent(button, 'click');
        }
        // Сравнивать по строковому значению title - ужасно.
        // Но другого способа нет, потому что не меняются другие атрибуты
        if (button = $$.get(`.ytp-ad-preview-container`)) {
            if (button = $$.get(`#movie_player .ytp-mute-button[title^="Отключение звука"]`)) {
                $$.fireEvent(button, 'click');
            }
            window.greasyMovieVolumeOn = false;
        } else {
            if (!window.greasyMovieVolumeOn) {
                if (button = $$.get(`#movie_player .ytp-mute-button[title^="Включить звук"]`)) {
                    $$.fireEvent(button, 'click');
                }
                window.greasyMovieVolumeOn = true;
            }
        }
    };

    if (false) {
        let muteTimer = setInterval(muteInternalAdverts, 80);
    }

    (function() {
        let nowOpenedAdvert = false;

        let gete = (param) => document.querySelector(param);

        let skipper = () => {
            let vide = gete('#movie_player video');
            if (vide) {
                let info = {
                    duration: vide.duration,
                    buffered: vide.buffered
                };
                console.log('ytscript :: skipper movie_player = ', info);
                //vide.play();
                vide.currentTime += 3600;
            }
        };
        //skipper();

        let advertCatcher = () => {
            let advertTitle = gete('.ytp-ad-player-overlay-layout div[aria-label="Реклама"]');
            //nowOpenedAdvert = !!advertTitle;
            if (advertTitle) {
                 console.log('ytscript :: advertTitle = ', advertTitle);
                 skipper();
            }
        };

        setInterval(advertCatcher, 50);
        return;

        let holder = () => {
            let btnSkip = document.querySelector('.video-ads button[id^="skip-button"]');
            if (btnSkip) {
                btnSkip.click();
            }
        };
        setTimeout(holder, 100);
    })();

    console.log('Youtube - Advertisement Hide 💬 1.5');
})();