// ==UserScript==
// @name        Make YouTube arrow up/dn set volume in 1% incrementals
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.1
// @author      LuK1337
// @description Does what @name says
// @license     GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/495359/Make%20YouTube%20arrow%20updn%20set%20volume%20in%201%25%20incrementals.user.js
// @updateURL https://update.greasyfork.org/scripts/495359/Make%20YouTube%20arrow%20updn%20set%20volume%20in%201%25%20incrementals.meta.js
// ==/UserScript==

window.addEventListener('keydown', function(e) {
    if (e.target.id === 'movie_player') {
        // Set player volume
        const player = document.getElementById('movie_player')
        let player_volume = player.getVolume()

        if (e.keyCode === 38) {
            player_volume += 1
            e.preventDefault()
            e.stopPropagation()
        } else if (e.keyCode === 40) {
            player_volume -= 1
            e.preventDefault()
            e.stopPropagation()
        } else {
            return
        }

        player_volume = Math.min(Math.max(player_volume, 0), 100)
        player.setVolume(player_volume)

        // Save player volume
        let storedVolume = JSON.parse(localStorage['yt-player-volume'])
        let storedVolumeData = JSON.parse(storedVolume['data'])

        storedVolumeData.volume = player_volume
        storedVolume['data'] = JSON.stringify(storedVolumeData)
        localStorage['yt-player-volume'] = JSON.stringify(storedVolume)
        sessionStorage['yt-player-volume'] = JSON.stringify(storedVolume)

        // Display volume change on screen
        // Stolen from: https://greasyfork.org/en/scripts/479475-youtube-display-current-volume
        let volumeDisplay = document.querySelector('#ytp-video-volume')

        if (!volumeDisplay) {
            volumeDisplay = document.createElement('div')
            volumeDisplay.id = 'ytp-video-volume'
            volumeDisplay.style.position = 'absolute'
            volumeDisplay.style.top = '10%'
            volumeDisplay.style.left = '50%'
            volumeDisplay.style.translate = '-50%'
            volumeDisplay.style.textAlign = 'center'
            volumeDisplay.style.background = 'rgba(0,0,0,.5)'
            volumeDisplay.style.color = '#eee'
            volumeDisplay.style.fontSize = '175%'
            volumeDisplay.style.zIndex = '19'
            volumeDisplay.style.padding = '10px 20px'
            volumeDisplay.style.borderRadius = '3%'

            const playerContainer = document.querySelector('.html5-video-player')
            playerContainer.appendChild(volumeDisplay)
        }

        volumeDisplay.textContent = `${player_volume}%`
        volumeDisplay.style.display = 'block'

        clearTimeout(volumeDisplay.timeout)
        volumeDisplay.timeout = setTimeout(() => {
            volumeDisplay.style.display = 'none'
        }, 1000)
    }
}, true)