// ==UserScript==
// @name         skip online class for 'gseek.kr'
// @namespace    http://tampermonkey.net/
// @version      2025-04-16
// @description  skip video
// @author       dh.jo
// @match        https://www.gseek.kr/user/course/online/player
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gseek.kr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532991/skip%20online%20class%20for%20%27gseekkr%27.user.js
// @updateURL https://update.greasyfork.org/scripts/532991/skip%20online%20class%20for%20%27gseekkr%27.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep(ms) {
        const wakeUpTime = Date.now() + ms;
        while (Date.now() < wakeUpTime) {}
    }

    const $video = document.querySelector('#player');
    const $nextBtn = document.querySelector('#nextLessonBtn');

    function skip() {
        if (!$video) return;
        if ($video.paused) {
            $video.play();
            sleep(200);
        }
        $video.currentTime = 99999;
        sleep(200);

        const nextId = $nextBtn.getAttribute("data-next_esson_sn");
        if (nextId == '0') {
            // 끝
            window.location.href = '/user/mypage/learning/online/list';
        } else {
            // 다음 go
            window.fnLessonPlay(nextId, true);
        }
    }

    function generateSkipButton() {
        const $closeBtn = document.querySelector('.course-close');
        const skipButtonHTML = `
    <button type="button" style="padding: 0 24px; background: #a80909;" class="skip-button">
      <span class="mob-hidden">스킵</span>
    </button>
  `;
        $closeBtn.insertAdjacentHTML('afterend', skipButtonHTML);

        const $skipBtn = document.querySelector('.skip-button');
        $skipBtn.onclick = function () {
            skip();
            return false;
        };
    }

    $video.addEventListener("loadeddata", () => {
        if ($video.readyState >= 2) {
            if ($video) {
                skip();
            }
        }
    });

    generateSkipButton();

})();