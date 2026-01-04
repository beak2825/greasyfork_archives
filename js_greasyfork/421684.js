// ==UserScript==
// @name         Youtube Playlist Search
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://youtube.com/watch?v=*
// @match        https://*.youtube.com/watch?v=*
// @match        https://youtube.com/playlist?*
// @match        https://*.youtube.com/playlist?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421684/Youtube%20Playlist%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/421684/Youtube%20Playlist%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const glogo = "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
    function googleURL(title, author) {
        const qstring = `"${title}" "${author}" site:youtube.com inurl:playlist`
        return `https://google.com/search?q=${encodeURIComponent(qstring)}`
    }

    onkeydown = function(e){
        if(e.ctrlKey && e.keyCode == 'E'.charCodeAt(0)) {
            e.preventDefault();

            const thisURL = new URL(document.URL);
            const path = thisURL.pathname;

            if (path == "/watch") {
                const title = document.querySelector(".title yt-formatted-string").innerText;
                console.log(`title: "${title}"`);

                const author = document.querySelector("#channel-name a.yt-formatted-string").innerText;
                console.log(`author: "${author}"`);

                window.open(googleURL(title, author))
            } else if (path == "/playlist") {
                const vids = document.querySelectorAll("#contents > ytd-playlist-video-renderer");
                for (const v of vids) {
                    try {
                        const title = v.querySelector("#video-title").innerText;
                        const author = v.querySelector("#text > a").innerText;
                        const searchlink = `<a href="${googleURL(title, author)}"><img src="${glogo}" width=30></a>`
                        v.insertAdjacentHTML('beforeend', searchlink);
                    } catch (e) {
                    }
                }
            }
        }
    }
})();