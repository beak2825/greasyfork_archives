// ==UserScript==
// @name         QQ Music MediaSession Helper
// @namespace    https://github.com/nondanee
// @version      0.2.4
// @description  Dock metadata to MediaSession API for y.qq.com (Chrome 73+)
// @author       nondanee
// @match        *://y.qq.com/*
// @grant        none
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/395889/QQ%20Music%20MediaSession%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/395889/QQ%20Music%20MediaSession%20Helper.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(() => {
    if (!('mediaSession' in navigator)) return

    const updateMetadata = () => {
        try {
            const { src } = document.querySelector('.song_info__pic')
            const { href } = document.querySelector('.player_music__info a:first-of-type')
            const mid = (/songDetail\/(\w+)/.exec(href) || [])[1]

            const tracks = JSON.parse(localStorage.getItem('playSongData')).value.songList
            const song = tracks.find(item => item.mid === mid)

            if (!song) return;

            const meta = {
                title: song.name,
                artist: song.singer.map(artist => artist.name).join(' / '),
                album: song.album.name,
                artwork: [{ src, sizes: '300x300', type: 'image/jpeg' }]
            }

            console.log('updateMetadata', meta)
            navigator.mediaSession.metadata = new MediaMetadata(meta)
        } catch (_) {}
    }

    if (!document.querySelector('.player__ft')) return

    navigator.mediaSession.setActionHandler('previoustrack', () => {
        const button = document.querySelector('.player__ft .btn_big_prev')
        if (button) button.click()
    })

    navigator.mediaSession.setActionHandler('nexttrack', () => {
        const button = document.querySelector('.player__ft .btn_big_next')
        if (button) button.click()
    })

    const bodyObserver = new MutationObserver(() => {
        if (bodyObserver.disconnected) return
        const info = document.querySelector('.player_music__info')
        if (!info) return
        bodyObserver.disconnect()
        bodyObserver.disconnected = true
        updateMetadata()
        new MutationObserver(updateMetadata).observe(info, { childList: true, attributes: true, subtree: true })
    })

    bodyObserver.observe(document.body, { childList: true, attributes: true, subtree: true })
})()