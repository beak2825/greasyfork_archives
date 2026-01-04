// ==UserScript==
// @name         Search unlinked listen in MusicBrainz
// @namespace    http://rokoucha.net/
// @version      1.0.3
// @description  ListenBrainz で MusicBrainz とリンクしていない視聴履歴にタイトルとアーティストの検索ページへのリンクを追加します
// @author       rokoucha
// @license      MIT
// @match        https://listenbrainz.org/user/*
// @exclude      /^https://listenbrainz\.org/user/[^/]+/[^?].*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=musicbrainz.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456947/Search%20unlinked%20listen%20in%20MusicBrainz.user.js
// @updateURL https://update.greasyfork.org/scripts/456947/Search%20unlinked%20listen%20in%20MusicBrainz.meta.js
// ==/UserScript==

(async() => {
    'use strict'

    const addSearchLinks = () => {
        const listens = [...document.querySelectorAll('#listens > .card > .main-content')]

        for (const listen of listens) {
            if(listen.querySelector('.search-track') !== null) continue

            const track = listen.querySelector('.listen-details > .title-duration > div')
            if(!track) continue

            if(track.querySelector('a') !== null) continue

            const trackSearchLink = document.createElement('a')
            trackSearchLink.classList.add('search-track')
            trackSearchLink.textContent = '[?]'
            trackSearchLink.href = `https://musicbrainz.org/search?query=${encodeURIComponent(track.getAttribute('title'))}&type=recording&method=indexed`
            trackSearchLink.target = '_blank'
            trackSearchLink.style.fontSize = 'smaller'

            track.after(trackSearchLink)

            console.debug('added search links', trackSearchLink)
        }

        for (const listen of listens) {
            if(listen.querySelector('.search-artist') !== null) continue

            const artist = listen.querySelector('.listen-details > div:nth-child(2)')
            if(!artist) continue

            if(artist.querySelector('a') !== null) continue

            const artistSearchLink = document.createElement('a')
            artistSearchLink.classList.add('search-artist')
            artistSearchLink.textContent = '[?]'
            artistSearchLink.href = `https://musicbrainz.org/search?query=${encodeURIComponent(artist.getAttribute('title'))}&type=artist&method=indexed`
            artistSearchLink.target = '_blank'
            artistSearchLink.style.fontSize = 'smaller'
            artistSearchLink.style.marginLeft = '0.2rem'

            artist.appendChild(artistSearchLink)
        }
    }

    const observer = new MutationObserver(addSearchLinks)

    let targetNode = null
    while (targetNode === null) {
        targetNode = document.getElementById('listens')

        await new Promise((resolve) => setTimeout(() => resolve()))
    }

    addSearchLinks()
    observer.observe(targetNode, { childList: true, subtree: true })
})()
