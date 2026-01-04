// ==UserScript==
// @name         Bandcamp :: Copy Artist List from Artist Pages
// @namespace    https://greasyfork.org/en/scripts/541440-bandcamp-copy-artist-list-from-artist-pages
// @version      1.1
// @description  Adds a button to Artist pages to copy a newline-separated list of Artists found in either the Artists section or Music section on the left side. Stores the list in localstorage and lets you know how many new artists have been added since you last copied it.
// @author       newstarshipsmell
// @match        https://*.bandcamp.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIbSURBVFhH7ZY7TsNAEIYTEqWgSQUNwSBxA65ASwsNBSCQ6OEQ9CmhSEJ6zoCASFBChTgAB6Djzf/ZM84aSCTw0mWkT5usPfPvrGcflYlNbJzNdy9CaqIemZpJfbekKF4Nftsb/2wulvQuaRntmtgVW2I7Ajtiw+SKlnQl2jlHmGmnXRUf4s3asnictkkWTQ9S5jSIhZMB039tDk/ipSTPglj3ommSQ1NnJekPwuw3BQ6v1pbF4+wJUw2MTlG1bz8t7gQOMabfY9wofmNBGgXTA4eioz0QODB1YaC/4tmvC+IPlyGjsU5fcrPiQeDwbm0ZXPysRYF3zlOd3PjT6qaV79kfChxiZe9JrAjipzWWWnKSZz9l7ZJ4FKFjGTz7UxHqZAPghxWdV/6xCB1jwEwui3wAaLpw3il4Kda0gydxJIhfc808+/leYQBMU+hYBv98fE4+a66T9AbBAIZTT4HgEGvL9ZmkoIlfb2VtJo7xR51Vtl39PhM4xMyepTwjiJ8uvfTbu6nDs2dzwCFW4Xn2+4L4vrxN2UyHDSNq6MGtwCHmlss2Pm1FV9x43OgUHAw4xMre43CQEb+22A8qPzR1NgVHIw4clUxdGTiyiXXFUZ5uu9kgTPGL6UHbHGJVvhcflxjie42Z4hfTgw3B9eina9Nv4brGtY3rWz1RfakdLR7bXMzwU1VFPmYAeoEpYonEJJ92mNjERlul8gnmuFSVmyqDsQAAAABJRU5ErkJggg==
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/541440/Bandcamp%20%3A%3A%20Copy%20Artist%20List%20from%20Artist%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/541440/Bandcamp%20%3A%3A%20Copy%20Artist%20List%20from%20Artist%20Pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Edit / save these settings in Tampermonkey's Storage tab for this userscript:

    //If set to true, when clicking the Copy Artists button, the script will open RED artist searches for each newly discovered artist in a background newtab
    var searchNewArtists = GM_getValue('searchNewArtists', false);
    GM_setValue('searchNewArtists', searchNewArtists);

    //If set to true, when clicking the Copy Artists button, the script will open your Redacted "Manage notifications" page in a background newtab, if any new artists are discovered, so you can edit/update the appropriate filters
    var openNotificationsFilter = GM_getValue('openNotificationsFilter', true);
    GM_setValue('openNotificationsFilter', openNotificationsFilter);

    var content;
    switch (location.href.split('.bandcamp.com/')[1]) {
        case '':
            var firstList = document.querySelector('div.leftMiddleColumns li');
            if (firstList === null) return;
            if (firstList.classList.contains('artists-grid-item')) content = 'artists';
            else if (firstList.classList.contains('music-grid-item')) content = 'music';
            else return;
            break;
        case 'artists':
        case 'music':
            content = location.href.split('.bandcamp.com/')[1];
            break;
        default:
            return;
    }

    document.querySelector('button#follow-unfollow').outerHTML += '<br><br><button id = "copy_artists" type="button" class="follow-unfollow compound-button" title="Copy a list of Artists from the list of Artists or Releases to the left."><div>Copy Artists</div></button>';
    var artistsBtn = document.getElementById('copy_artists');

    artistsBtn.onclick = function(e) {
        var valueName = 'ArtistList-' + location.href.split('//')[1].split('.')[0];
        var storedList = GM_getValue(valueName, []);
        var artists = document.querySelectorAll(content == 'artists' ? 'div.artists-grid-name' : 'span.artist-override');
        var artistList = [], count, newCount = 0, artist;

        for (var i = 0, l = artists.length; i < l; i++) {
            artist = artists[i].textContent.trim();
            if (artistList.indexOf(artist) < 0) {
                artistList.push(artist);
                if (storedList.indexOf(artist) < 0) {
                    newCount++;
                    if (searchNewArtists) GM_openInTab('https://redacted.sh/artist.php?artistname=' + encodeURIComponent(artist), true)
                }
            }
        }
        if (newCount && openNotificationsFilter) GM_openInTab('https://redacted.sh/user.php?action=notify', true);

        artistList.sort();
        GM_setValue(valueName, artistList)

        count = artistList.length;
        artistList = artistList.length > 0 ? artistList.join('\n') : null;
        if (artistList) {
            artistsBtn.innerHTML = '<div>Copied ' + count + ' (' + newCount + ' new)</div>';
            GM_setClipboard(artistList)
        } else {
            artistsBtn.innerHTML = '<div>Copy Failed!</div>';
        }
    };
})();