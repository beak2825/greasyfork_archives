// ==UserScript==
// @name         YouTube Ad Skipper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Skip YouTube ads if they exist
// @author       You
// @match        https://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478695/YouTube%20Ad%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/478695/YouTube%20Ad%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkElement = () => {
        const adElement = document.querySelector("#movie_player > div.video-ads.ytp-ad-module");
        if (adElement?.hasChildNodes()) {
            document.querySelector("#movie_player > div.html5-video-container > video").currentTime = 60;
         [...document.querySelector("#movie_player > div.video-ads.ytp-ad-module").getElementsByClassName('ytp-ad-skip-button-slot')].forEach(e => e.querySelector('button')?.click());
        }
    };

    // 1秒ごとにcheckElement関数を実行
    setInterval(checkElement, 1000);
})();
