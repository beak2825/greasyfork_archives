// ==UserScript==
// @name        Secret Cinema TMDb Posters
// @version     1.0.0
// @author      magmaoperator
// @license     MIT
// @description Add a link of the TMDb posters page to the SC torrent page.
// @icon        https://secret-cinema.pw/favicon.ico
// @match       *://*.secret-cinema.pw/torrents.php?id=*
// @grant       GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1358201
// @downloadURL https://update.greasyfork.org/scripts/506289/Secret%20Cinema%20TMDb%20Posters.user.js
// @updateURL https://update.greasyfork.org/scripts/506289/Secret%20Cinema%20TMDb%20Posters.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function extractImdbCode() {
        const imdbLink = [...document.querySelectorAll('a')]
            .filter(i => i.href.includes('imdb.com'))[0].href.split('/')

        const ttCode = imdbLink[imdbLink.length - 1]
        if (ttCode.includes('tt')) {
            return ttCode
        }

        return undefined
    }

    function getTmdb(url) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    var doc = new DOMParser().parseFromString(response.responseText, "text/html");

                    const tmdbLink = [...doc.querySelectorAll('a')]
                        .filter(i => i.href.includes('themoviedb.org'))[0].href

                    resolve(tmdbLink + 'images/posters');
                },
                onerror: function(error) {
                    console.error('Error checking availability:', error);
                    resolve(false);
                }
            });
        });
    }

    const letterboxUrl = "https://letterboxd.com/imdb/" + extractImdbCode() + "#featured-film-header";
    const tmdbUrl = await getTmdb(letterboxUrl)

    const tmdbLink = document.createElement('a')
    tmdbLink.className = 'brackets'
    tmdbLink.href = tmdbUrl
    tmdbLink.target = '_blank'
    tmdbLink.innerText = 'TMDB'

    const linkbox = document.querySelector('.linkbox');
    linkbox.appendChild(tmdbLink)

})();
