// ==UserScript==
// @name         Discogs :: Search Artist/Album on Redacted
// @namespace    https://greasyfork.org/en/scripts/431123-discogs-search-artist-album-on-redacted
// @version      1.2
// @description  Adds buttons to Discogs release pages to search Artist and Artist+Album on Redacted
// @author       newstarshipsmell
// @include      /https://www\.discogs\.com/(.+/)?release/\d+/
// @icon         https://www.google.com/s2/favicons?domain=discogs.com
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/431123/Discogs%20%3A%3A%20Search%20ArtistAlbum%20on%20Redacted.user.js
// @updateURL https://update.greasyfork.org/scripts/431123/Discogs%20%3A%3A%20Search%20ArtistAlbum%20on%20Redacted.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout (function() { addButtons(); }, 500);

    function addButtons() {
        var hook = document.querySelector('h1.title_1q3xW');
        hook.appendChild(document.createElement('br'));

        var Artist = document.querySelector('h1.title_1q3xW span a').textContent.trim();
        Artist = Artist == 'Various' ? 'Various Artists' : Artist;
        Artist = Artist.replace(/^(.+) \(\d+\)$/, '$1').replace(/^(.+), The$/, 'The $1').replace(/^(.+), A$/, 'A $1');
        var Album = document.querySelector('h1.title_1q3xW');
        Album = Album.lastChild.previousSibling.textContent.trim();

        var ArtBtn = document.createElement('input');
        ArtBtn.type = 'button';
        ArtBtn.id = 'search_artist_only';
        ArtBtn.value = 'Search Artist';
        ArtBtn.title = 'Search this Artist on Redacted';

        ArtBtn.onclick = function() {
            var urlToOpen = 'https://redacted.ch/artist.php?artistname=' + encodeURIComponent(Artist);
            GM_openInTab(urlToOpen, false);
        };

        var AlbBtn = document.createElement('input');
        AlbBtn.type = 'button';
        AlbBtn.id = 'search_artist_and_album';
        AlbBtn.value = 'Search Album';
        AlbBtn.title = 'Search this Artist and Album on Redacted';

        AlbBtn.onclick = function() {
            var urlToOpen = 'https://redacted.ch/torrents.php?' + (Artist == 'Various Artists' ? '' : 'artistname=' + encodeURIComponent(Artist) + '&') + 'groupname=' + encodeURIComponent(Album);
            GM_openInTab(urlToOpen, false);
        };

        hook.appendChild(ArtBtn);
        hook.appendChild(document.createTextNode('\t'));
        hook.appendChild(AlbBtn);
    };
})();