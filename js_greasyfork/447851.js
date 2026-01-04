// ==UserScript==
// @name         OSU Download Booster
// @namespace    Add me on discord @legend_recalls
// @version      1.3
// @description  Boost download speeds for osu beatmaps
// @author       Legend Recalls
// @homepage     https://github.com/Legend-Recalls/OsuDownloadBooster
// @supportURL   https://github.com/Legend-Recalls/OsuDownloadBooster
// @icon         https://osu.ppy.sh/favicon.ico
// @include      http*://osu.ppy.sh/*
// @grant        GM_xmlhttpRequest
// @connect      bm4.ppy.sh
// @connect      bm5.ppy.sh
// @connect      bm6.ppy.sh
// @connect      bm7.ppy.sh
// @connect      bm8.ppy.sh
// @license      MIT License
// @antifeature  tracking
// @downloadURL https://update.greasyfork.org/scripts/447851/OSU%20Download%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/447851/OSU%20Download%20Booster.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const CHIMU_URL = 'https://api.chimu.moe/v1/download/';
    const NEW_DIRECT_URL = 'https://api.osu.direct/d/';

    let lastId = -1;
    let latestDownloadUrl = '';
    let running = false;

    setBeatmapTimer();
    setButtonTimer();

    injectGoogleAnalytics();

    function injectGoogleAnalytics() {
        let script = document.createElement('script');
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-61W3GZ0ZNP';
        document.body.appendChild(script);

        script = document.createElement('script');
        script.innerHTML = "window.dataLayer = window.dataLayer || [];\n" +
            "function gtag(){dataLayer.push(arguments);}\n" +
            "gtag('js', new Date());\n" +
            "gtag('config', 'G-61W3GZ0ZNP');";
        document.body.appendChild(script);
    }

    function setBeatmapTimer() {
        setInterval(function () {
            checkBeatmapId();
        }, 500);
    }

    function setButtonTimer() {
        setInterval(function () {
            insertButton();
            updateButton();
        }, 100);
    }

    function checkBeatmapId() {
        let currentId = getBeatmapId();
        if (lastId !== currentId) {
            lastId = currentId;
            if (currentId > 0) {
                getDownloadUrl(currentId);
            }
        }
    }

    function insertButton() {
        let needInsert = $('.beatmapset-header__buttons').length == 1 && $('.beatmapset-header__buttons')[0].innerHTML.indexOf('/download"') && $('.btn-osu-mirror').length === 0;
        if (needInsert) {
            $('.beatmapset-header__buttons').append(
                '<a href="' + latestDownloadUrl + '" data-turbolinks="false"\n' +
                '   class="btn-osu-mirror btn-osu-big btn-osu-big--beatmapset-header js-beatmapset-download-link"><span\n' +
                '        class="btn-osu-big__content "><span class="btn-osu-big__left"><span class="btn-osu-big__text-top">Boost From</span><span\n' +
                '        class="btn-osu-hint btn-osu-big__text-bottom">getting address...</span></span><span class="btn-osu-big__icon"><span class="fa-fw"><i\n' +
                '        class="fas fa-download"></i></span></span></span></a>'
            );
            $('.beatmapset-header__buttons').append(
                '<a href="' + CHIMU_URL + getBeatmapId() + '" data-turbolinks="false"\n' +
                '   class="btn-osu-mirror-sayo btn-osu-big btn-osu-big--beatmapset-header js-beatmapset-download-link"><span\n' +
                '        class="btn-osu-big__content "><span class="btn-osu-big__left"><span class="btn-osu-big__text-top">Boost From</span><span\n' +
                '        class="btn-osu-hint btn-osu-big__text-bottom">Chimu</span></span><span class="btn-osu-big__icon"><span class="fa-fw"><i\n' +
                '        class="fas fa-download"></i></span></span></span></a>'
            );
            $('.beatmapset-header__buttons').append(
                '<a href="' + NEW_DIRECT_URL + getBeatmapId() + '" data-turbolinks="false"\n' +
                '   class="btn-osu-mirror-new-direct btn-osu-big btn-osu-big--beatmapset-header js-beatmapset-download-link"><span\n' +
                '        class="btn-osu-big__content "><span class="btn-osu-big__left"><span class="btn-osu-big__text-top">Boost From</span><span\n' +
                '        class="btn-osu-hint btn-osu-big__text-bottom">NEW DIRECT</span></span><span class="btn-osu-big__icon"><span class="fa-fw"><i\n' +
                '        class="fas fa-download"></i></span></span></span></a>'
            );
        }
    }

    function updateButton() {
        let btn = $('.btn-osu-mirror')[0];
        if (btn && btn.href !== latestDownloadUrl) {
            btn.href = latestDownloadUrl;
            if (btn.href.startsWith('https://bm')) {
                $('.btn-osu-hint')[0].innerText = 'Azure997';
            } else {
                $('.btn-osu-hint')[0].innerText = 'Getting Address...';
            }
        }
    }

    function getBeatmapId() {
        let url = window.location.pathname;
        if (url.startsWith('/beatmapsets/')) {
            let id = parseInt(url.substring(13, url.length));
            if (typeof (id) == 'number' && id > 0) {
                return id;
            }
        }
        return -1;
    }

    


    function getDownloadUrl(mapId) {
        if (running) {
            return;
        }
        running = true;
        latestDownloadUrl = '';
        let request = GM_xmlhttpRequest({
            method: 'GET',
            url: '/beatmapsets/' + mapId + '/download',
            headers: {
                'Referer': 'https://osu.ppy.sh/beatmapsets/' + mapId
            },
            onreadystatechange: function (status) {
                let url = status.finalUrl.toString();
                if (url.startsWith('https://bm') && status.readyState === 2) {
                    running = false;
                    request.abort();
                    latestDownloadUrl = url.replace('.ppy.sh/', '.osu.rainng.com/');
                }
            }
        });
    }
})();
