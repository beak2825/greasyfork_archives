// ==UserScript==
// @name         YouTube TV Remember Volume
// @namespace    https://www.github.com/hymccord
// @version      1.4
// @description  Remember YouTube TV volume between visits/refreshes
// @author       hymccord
// @match        https://tv.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/450771/YouTube%20TV%20Remember%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/450771/YouTube%20TV%20Remember%20Volume.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var RETRY_DELAY_IN_MS = 100;

    function getElement(query, callback) {
        var element = document.querySelector(query);
        if (element === null) {
            // null possible if element not loaded yet, retry with delay
            window.setTimeout(function () {
                getElement(query, callback);
            }, RETRY_DELAY_IN_MS);
        } else {
            callback(element);
        }
    }

    function addListenerMulti(el, s, fn) {
        s.split(' ').forEach(e => el.addEventListener(e, fn, false));
    }

    function onElementSourceUpdate(target, callback) {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                callback();
            });
        });
        observer.observe(target, {attributes: true, attributeFilter: ['src']});
    }

    function setVolume(volume) {
        getElement('tp-yt-paper-slider', function (slider) {
            // console.log('setting slider value: ', volume);
            slider.value = volume;
        });
    }

    function setPreferredVolume() {
        const preferredVolume = GM_getValue('volume', 50);
        setVolume(preferredVolume);
    }

    // Listen to volume changed events on the video player
    // and store the slider value to local storage
    function addEventListenerToStoreVolume() {
        getElement('.html5-main-video', function (video) {
            video.addEventListener('volumechange', function(e) {
                // console.log('volume changed');
                getElement('#sliderBar', function (slider) {
                    GM_setValue('volume', slider.value);
                    // console.log('storing volume: ', slider.value);
                });
            }, false);
        });
    }

    function addEventListenerToSetVolume() {
        getElement('.html5-main-video', function (video) {
            addListenerMulti(video, 'loadeddata play', function (e) {
                // console.log(e.type, '. setting volume');
                setPreferredVolume();
            }, false);
        });
    }

    function main(){
        addEventListenerToStoreVolume();
        addEventListenerToSetVolume();
    };

    main();
})();
