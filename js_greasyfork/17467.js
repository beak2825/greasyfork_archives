// ==UserScript==
// @name        KCRW Playlist
// @namespace   k
// @description Duck links on playlists
// @include     http*://www.kcrw.com/*playlists*
// @icon        https://i.imgur.com/2Y8MdLZ.png
// @version     3
// @grant       All
// @downloadURL https://update.greasyfork.org/scripts/17467/KCRW%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/17467/KCRW%20Playlist.meta.js
// ==/UserScript==

(() => {

    const loop = () => {
        Array.from(document.querySelectorAll('.track:not(.gm)')).forEach(track => {
            try {
                const artist = track.querySelector('.artist-name').textContent,
                    title = track.querySelector('.song-title').textContent,
                    enc = encodeURIComponent(`${artist} ${title}`),
                    link = `<br><a href="https://duckduckgo.com/?q=${enc}">Search</a>`

                //console.log(enc);
                track.classList.add('gm')

                track.querySelector('.artist-name').insertAdjacentHTML('afterend', link)
            // eslint-disable-next-line no-empty
            } catch (e) {
            }
        })
    }

    window.setInterval(loop, 2000)

})()