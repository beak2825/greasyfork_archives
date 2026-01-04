// ==UserScript==
// @name        YoutubeDefaultSpeed2
// @namespace      https://greasyfork.org/ru/users/717310-alina-novikova
// @version     2.0
// @author      splttingatms, Alina
// @icon https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @homepage    https://github.com/splttingatms/YouTubeDefaultSpeed
// @description Set a default playback rate for YouTube videos.
// @description:ru Установите скорость воспроизведения по умолчанию для видео на YouTube.
// @match       http*://*.youtube.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-idle
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462527/YoutubeDefaultSpeed2.user.js
// @updateURL https://update.greasyfork.org/scripts/462527/YoutubeDefaultSpeed2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var RATE_OPTIONS = ["0.7", "1", "1.25", "1.5", "2", "2.2", "2.5", "3", "5",];
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

    function setPlaybackRate(rate) {
        // video element can force unofficial playback rates
        getElement("video", function (video) {
            video.playbackRate = rate;
        });

        // movie_player div controls the displayed "Speed" in player menu
        // note: does not show values beyond official list
        getElement("#movie_player", function (player) {
            player.setPlaybackRate(rate);
        });
    }

    function setPlaybackRateToPreference() {
        var preferredRate = GM_getValue("playbackRate", 1); // default to 1 if not set yet
        setPlaybackRate(preferredRate);
    }

    function onElementSourceUpdate(target, callback) {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                callback();
            });
        });
        observer.observe(target, {attributes: true, attributeFilter: ["src"]});
    }

    function handleRateButtonClick(rate) {
        GM_setValue("playbackRate", rate);
        setPlaybackRate(rate);
    }

    function injectButtons() {
        //var head = document.getElementById("masthead");
        var head = document.querySelector(".ytp-left-controls");

        var moreSpeedsDiv = document.createElement('div');
        moreSpeedsDiv.id = 'more-speeds';
        moreSpeedsDiv.style.display = 'flex';
        moreSpeedsDiv.style.marginLeft = '26px';

        var form = document.createElement("form");
        RATE_OPTIONS.forEach(function (rate) {
            var input = document.createElement("input");
            input.type = "radio";
            input.name = "playbackRate";
            input.id = "playbackRate" + rate;
            input.onclick = function () { handleRateButtonClick(rate); };
            input.checked = (rate === GM_getValue("playbackRate", 1));
            var label = document.createElement("label");
            label.htmlFor = "playbackRate" + rate;
            label.innerHTML = rate;
            label.style.marginRight = '4px';
            form.appendChild(input);
            form.appendChild(label);
        });

        moreSpeedsDiv.appendChild(form);
        head.appendChild(moreSpeedsDiv);
        //head.appendChild(form);
    }

    function main() {
        injectButtons();
        setPlaybackRateToPreference();

        // YouTube uses AJAX so monitor element for video changes
        getElement("video", function (video) {
            onElementSourceUpdate(video, function () {
                setPlaybackRateToPreference();
            });
        });
    }
    main();
})();
