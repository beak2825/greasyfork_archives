// ==UserScript==
// @name         geoguessr.com
// @namespace    gg
// @version      0.001
// @description  geoguessr
// @author
// @match        https://www.geoguessr.com/*
// @icon         https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.geoguessr.com/&size=128
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528733/geoguessrcom.user.js
// @updateURL https://update.greasyfork.org/scripts/528733/geoguessrcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let w, geocoder, curround, maxrounds, rounds, apiloaded = false;

    if (window.unsafeWindow !== undefined) { w = window.unsafeWindow } else { w = window }
    time_log('geoguessr.com script started');

    let timerId = setInterval(checkapi, 100);
    function checkapi() {
        if (w.google != undefined) {
            time_log('checkapi():APIs loaded:', true);
            clearInterval(timerId);
            geocoder = new w.google.maps.Geocoder();
            apiloaded = true;
        }
    }

    function assemble_answer() {
        let text = '';
        for (const element of rounds) {
            let panorama = element.question.panoramaQuestionPayload.panorama;
            text += element.roundNumber + ' ';
            text += panorama.countryCode + ' ';
            if (panorama.stateCode != null) {
                text += panorama.stateCode + ' ';
            }
            text += ('  ' + panorama.lat.toFixed(6)).slice(-9) + ' ';
            text += ('  ' + panorama.lng.toFixed(6)).slice(-9);
            if (panorama.addr != null) {
                text += ' ' + panorama.addr;
            }
            text += '\n';
        }
        copytoclipboard(text);
        time_log('\n' + '='.repeat(50) + '\n' + text + '='.repeat(50));
    }

    function getaddr(j) {
        const latlng = {
            lat: j.lat,
            lng: j.lng,
        };
        if (!apiloaded) {
            console.log('getaddr(): error: API not loaded', curround);
            curround++;
            if (curround == maxrounds) {
                assemble_answer();
            }
            return
        }
        geocoder
            .geocode({ location: latlng })
            .then((response) => {
            if (response.results[0]) {
                curround++;
                j.addr = response.results[0].formatted_address;
//                time_log('getaddr():roundnum: ' + curround + ', addr:', response.results[0].formatted_address);
                if (curround == maxrounds) {
                    assemble_answer();
                }
            }
        })
            .catch((e) => time_log('getaddr():geocoder failed due to: ' + e));
    }

    const {fetch: origFetch} = w;
    w.fetch = async (...args) => {
        const response = await origFetch(...args);
        if (response.url.indexOf("/start.json") > -1 ||
            response.url.indexOf("/advance-round") > -1 ||
            response.url.indexOf("/end-current-round") > -1) {
            time_log('fetch():intercepted file:', response.url);
            response
                .clone()
                .json()
                .then(function(data) {
                rounds = [];
                if (response.url.indexOf("/start.json") > -1) {
                    rounds = data.pageProps.quizGame.rounds;
                } else {
                    rounds = data.snapshot.rounds;
                }
                time_log('fetch():rounds.length:', rounds.length);
                curround = 0;
                maxrounds = rounds.length;
                time_log('fetch():API loaded:', apiloaded);
                for (const element of rounds) {
                    let panorama = element.question.panoramaQuestionPayload.panorama;
                    setTimeout(getaddr, 2000, panorama);
                }
            })
                .catch(err => console.error(err));
        }
        return response;
    };

    function time_log(msg, v=' ') {
        var dtime = new Date();
        var stime = (dtime.toLocaleTimeString('ru-RU') + '.' + dtime.getMilliseconds() + '000').substring(0, 12);
//        console.log('\x1B[92m' + stime + ' ' + msg, v); chrome only
        console.log('%c' + stime + ' gg ' + msg, 'color: #00ff00', v);
    }

    function copytoclipboard(text) {
        var input = document.createElement('textarea');
        input.innerHTML = text;
        document.body.appendChild(input);
        input.select();
        var result = document.execCommand('copy');
        document.body.removeChild(input);
        return result;
    }

})();