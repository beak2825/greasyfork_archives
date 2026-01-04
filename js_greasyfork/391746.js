// ==UserScript==
// @name         Add album credits to artist page
// @version      0.1
// @namespace    https://greasyfork.org/en/users/113783-klattering
// @description  Displays album credits on artist page, based on release.
// @match        https://redacted.ch/artist.php*id=*
// @downloadURL https://update.greasyfork.org/scripts/391746/Add%20album%20credits%20to%20artist%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/391746/Add%20album%20credits%20to%20artist%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change false to true for releases you want to include.
    const includeThese = {
        albums: true,
        soundtracks: false,
        eps: false,
        anthologies: false,
        compilations: false,
        singles: false,
        liveAlbums: false,
        remixes: false,
        bootlegs: false,
        interviews: false,
        djMixes: false,
        producedBy: false,
        guestAppearances: false,
    };

    let releasesToInclude;

    if (includeThese.albums) {
        releasesToInclude = '.group.releases_1.discog';
    }

    if (includeThese.soundtracks) {
        releasesToInclude += ', .group.releases_3.discog';
    }

    if (includeThese.eps) {
        releasesToInclude += ', .group.releases_5.discog';
    }

    if (includeThese.anthologies) {
        releasesToInclude += ', .group.releases_6.discog';
    }

    if (includeThese.compilations) {
        releasesToInclude += ', .group.releases_7.discog';
    }

    if (includeThese.singles) {
        releasesToInclude += ', .group.releases_9.discog';
    }

    if (includeThese.liveAlbums) {
        releasesToInclude += ', .group.releases_11.discog';
    }

    if (includeThese.remixes) {
        releasesToInclude += ', .group.releases_13.discog';
    }

    if (includeThese.bootlegs) {
        releasesToInclude += ', .group.releases_14.discog';
    }

    if (includeThese.interviews) {
        releasesToInclude += ', .group.releases_15.discog';
    }

    if (includeThese.mixtapes) {
        releasesToInclude += ', .group.releases_16.discog';
    }

    if (includeThese.demos) {
        releasesToInclude += ', .group.releases_17.discog';
    }

    if (includeThese.djMixes) {
        releasesToInclude += ', .group.releases_19.discog';
    }

    if (includeThese.producedBy) {
        releasesToInclude += ', .group.releases_1021.discog';
    }

    if (includeThese.compositions) {
        releasesToInclude += ', .group.releases_1022.discog';
    }

    if (includeThese.guestAppearances) {
        releasesToInclude += ', .group.releases_1024.discog';
    }

    const albums = document.querySelectorAll(releasesToInclude);

    albums.forEach(album => {

        const groupInfo = album.querySelector('.group_info');
        const albumLink = album.querySelector('[title="View torrent group"]').getAttribute('href');

        var req = new XMLHttpRequest();

        req.open('GET', albumLink, false);
        req.send(null);

        if (req.status == 200) {
            const htmlContainer = document.createElement('html');
            const details = document.createElement('details');
            details.style.padding = '.65rem 0 .25rem';
            const summary = document.createElement('summary');
            summary.style.paddingBottom = '.25rem';
            summary.innerHTML = 'View release credits';
            htmlContainer.innerHTML = req.responseText;
            const artistList = htmlContainer.querySelector('#artist_list');
            groupInfo.after(details);
            details.appendChild(summary);
            details.appendChild(artistList);
        }


    });
})();