// ==UserScript==
// @name         TikTok autoscroller
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scrolls through tiktoks automagically
// @author       You
// @match        https://www.tiktok.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448192/TikTok%20autoscroller.user.js
// @updateURL https://update.greasyfork.org/scripts/448192/TikTok%20autoscroller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let playNextTikTok = () => document.getElementsByClassName('tiktok-2xqv0y-ButtonBasicButtonContainer-StyledVideoSwitchV2')[0].click()

    let timesUp = (start, end) => {
        let [minutes, seconds] = end.split(':')
        seconds = parseInt(seconds) - 1
        if (seconds < 10) {
          seconds = '0' + seconds
        }
        end = minutes + ":" + seconds
        return start == end
    }

    setInterval(() => {
        let timestamp = document.getElementsByClassName('tiktok-o2z5xv-DivSeekBarTimeContainer')[0].innerHTML
        let [progressTime, endTime] = timestamp.split('/')
        if (timesUp(progressTime, endTime)) playNextTikTok()
    }, 250)

})();