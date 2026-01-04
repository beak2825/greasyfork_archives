// ==UserScript==
// @name            YouTube Playlist AutoPlay
// @namespace       https://github.com/crazyrabbit0
// @version         2.1.4
// @description     AutoPlay next Playlist item in YouTube
// @author          CrazyRabbit
// @match           http://*.youtube.com/*
// @match           https://*.youtube.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant           none
// @license         GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright       2023+, CrazyRabbit (https://github.com/crazyrabbit0)
// @homepageURL     https://github.com/crazyrabbit0/UserScripts
// @supportURL      https://github.com/crazyrabbit0/UserScripts/issues/new?assignees=crazyrabbit0&labels=help+wanted&template=&title=YouTube%20Playlist%20AutoPlay%20-%20Issue
// @run-at          document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/480708/YouTube%20Playlist%20AutoPlay.user.js
// @updateURL https://update.greasyfork.org/scripts/480708/YouTube%20Playlist%20AutoPlay.meta.js
// ==/UserScript==

(function() {
    'use strict'

    let elements = {
        player: null,
        next_video: null,
        progress: null,
        loop: null
    }

    let loaded = {
        player: false,
        progress: false
    }

    let loop = {
        code: null,
        value: null,
        map: {
            //'M21': '',
            'M20': 'playlist',
            'M13': 'video'
        }
    }

    function play_next_video(player = elements.player) {
        elements.next_video = document.querySelector('ytd-playlist-panel-video-renderer[selected] + ytd-playlist-panel-video-renderer > a')
        if(player.classList.contains('ended-mode')) {
            let has_video_loop = elements.loop.querySelector('path')?.getAttribute('d').substring(0, 3) === 'M13'
            //let ads = document.querySelector('.video-ads')
            if(!has_video_loop) {
                elements.next_video?.click()
            }
            //console.log('video-ended')
        }
        else if(player.querySelector('.html5-ypc-title')?.innerText) {
            elements.next_video?.click()
            //console.log('video-cannot-start')
        }
    }

    function reset_loop(progress = elements.progress) {
        if(!progress.hasAttribute('hidden')) {
            loop.code = elements.loop.querySelector('path')?.getAttribute('d').substring(0, 3)
            loop.value = loop.code.replace(/M\d+/, function(match) { return loop.map[match] || '' })
            //console.log('progress-started')
        }
        else {
            switch (loop.value) {
                case 'video':
                    elements.loop.click()
                    /* falls through */
                case 'playlist':
                    setTimeout(function() { elements.loop.click() }, 1)
            }
            //console.log('progress-finished')
        }
    }

    let loaded_check = setInterval(function() {
        if(!loaded.player && elements.player && elements.next_video) {
            loaded.player = true
            play_next_video()
            new MutationObserver(function(mutations) {
                for(const mutation of mutations) {
                    play_next_video(mutation.target)
                }
            }).observe(elements.player, {
                attributeFilter: [ "class" ]
            })
        }
        else {
            elements.player = document.querySelector('div#movie_player')
            elements.next_video = document.querySelector('ytd-playlist-panel-video-renderer[selected] + ytd-playlist-panel-video-renderer > a')
        }

        if(!loaded.progress && elements.progress && elements.loop) {
            loaded.progress = true
            reset_loop()
            new MutationObserver(function(mutations) {
                for(const mutation of mutations) {
                    reset_loop(mutation.target)
                }
            }).observe(elements.progress, {
                attributeFilter: [ "hidden" ]
            })
        }
        else {
            elements.progress = document.querySelector('yt-page-navigation-progress')
            elements.loop = document.querySelector('ytd-playlist-loop-button-renderer button')
        }

        if(Object.values(loaded).every(Boolean)) {
            clearInterval(loaded_check)
            //console.log('all-elements-loaded')
        }
    }, 500)
})()