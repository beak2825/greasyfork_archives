// ==UserScript==
// @name         YT-FIXED
// @namespace    https://www.youtube.com/Zimekk
// @version      2.0
// @icon         https://www.youtube.com/s/desktop/80e4974c/img/favicon_144.png
// @description  Fixes media skip keys and adds volume control hotkeys (ALT+1|2|3|4|)
// @author       Zimeh
// @match        *://*.youtube.com/*
// @run-at       document-end
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/418121/YT-FIXED.user.js
// @updateURL https://update.greasyfork.org/scripts/418121/YT-FIXED.meta.js
// ==/UserScript==

setInterval(function() {
    const volumes = ['0.01', '0.1', '0.5', '1']

    function setVol(vol) {
        var data = sessionStorage['yt-player-volume'] ? JSON.parse(sessionStorage['yt-player-volume']) : JSON.parse(localStorage['yt-player-volume'])
        var subData = JSON.parse(data.data)
        if (!vol) vol = subData.volume / 100
        document.getElementsByTagName('video')[0].volume = vol
        subData.volume = vol * 100
        data.data = JSON.stringify(subData)
        localStorage['yt-player-volume'] = sessionStorage['yt-player-volume'] = JSON.stringify(data)
    }

    if (!window.navigator.mediaSession.metadata.canSkip) {

        window.navigator.mediaSession.metadata.canSkip = true

        window.navigator.mediaSession.setActionHandler('previoustrack', function() {
            if (document.getElementsByClassName('ytp-prev-button')[0] && document.getElementsByClassName('ytp-prev-button')[0].style.display !== 'none') document.getElementsByClassName('ytp-prev-button')[0].click();
            else history.back()
        });

        window.navigator.mediaSession.setActionHandler('nexttrack', function() {
            document.getElementsByClassName('ytp-next-button')[0].click()
        });

        document.addEventListener('keydown', (event) => {
            const code = parseInt(event.key) - 1
            if (!isNaN(code) && volumes[code] && event.altKey) setVol(volumes[code])
        })
    }

    if (document.getElementsByTagName('video')[0]) setVol()
}, 1000)