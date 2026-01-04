// ==UserScript==
// @name         YouTube playback progress memory
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  memory and resume the playback progress
// @author       hhst
// @match        https://www.youtube.com/watch?v=*
// @match        https://m.youtube.com/watch?v=*
// @match        https://www.youtube.com/
// @match        https://m.youtube.com/
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519845/YouTube%20playback%20progress%20memory.user.js
// @updateURL https://update.greasyfork.org/scripts/519845/YouTube%20playback%20progress%20memory.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const get_page_class = (url) => {
    url = url.toLowerCase()
    if (url.startsWith('https://m.youtube.com') || url.startsWith('https://www.youtube.com')) {
        if (url.includes('shorts')) {
            return 'shorts'
        }
        if (url.includes('watch')) {
            return 'watch'
        }
        if (url.includes('library')) {
            return 'library'
        }
        if (url.includes('subscriptions')) {
            return 'subscriptions'
        }
        if (url.includes('@')) {
            return '@'
        }
        return 'home'
    }
        return 'unknown'
    }

    // return the youtube video id like 'A9oByH9Ci24'
    const get_video_id = (url) => {
        try {
            const match = url.match(/watch\?v=([^&#]+)/)
            return match ? match[1] : null
        } catch (error) {
            console.error('Error getting video ID:', error)
            return null
        }
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList.contains('video-stream')){
                        console.log("ready to record...")
                        // memory progress
                        node.addEventListener('timeupdate', () => {
                            if (node.currentTime !== 0){
                                GM_setValue('progress-' + get_video_id(location.href), node.currentTime.toString())
                            }
                        })
                    }

                    if (node.id === 'movie_player') {
                        window.last_player_state = -1
                        node.addEventListener('onStateChange', (data) => {
                            /* refers to https://developers.google.com/youtube/iframe_api_reference:
                            onStateChange
                            This event fires whenever the player's state changes. The data property of the event object that the API passes to your event listener function will specify an integer that corresponds to the new player state. Possible values are:
                            -1 (unstarted)
                            0 (ended)
                            1 (playing)
                            2 (paused)
                            3 (buffering)
                            5 (video cued).
                            */
                            console.log(get_video_id(location.href), data, window.last_player_state)
                            if([1, 3].includes(data) && window.last_player_state === -1 && get_page_class(location.href) === 'watch'){
                                console.log("ready to resume...")
                                // resume progress
                                // get the last progress time, default 0
                                const saved_time = GM_getValue('progress-' + get_video_id(location.href)) || '0'
                                console.log("resume to", saved_time)
                                node.seekTo(parseInt(saved_time))
                            }
                            window.last_player_state = data
                        })
                    }
                })
            }
        }
    })

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    })

})();