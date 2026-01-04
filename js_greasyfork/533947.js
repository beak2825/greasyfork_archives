// ==UserScript==
// @name         RYM: All releases chart from album page
// @namespace    https://github.com/sercep/userscripts
// @version      1.0.0
// @description  Add links to all releases chart by featured and credited artists on album page
// @author       sercep
// @match        https://rateyourmusic.com/release/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533947/RYM%3A%20All%20releases%20chart%20from%20album%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/533947/RYM%3A%20All%20releases%20chart%20from%20album%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function collectArtistsFrom(selector) {
        const anchors = document.querySelectorAll(selector);
        const result = [];
        anchors.forEach(a => {
            const href = a.getAttribute('href');
            if (!href) return;
            const parts = href.split('/');
            if (parts.length >= 3 && parts[1] === 'artist') {
                const artistId = parts[2];
                if (!result.includes(artistId)) {
                    result.push(artistId);
                }
            }
        });
        return result;
    }

    function getArtistsFromUrl() {
        const artists = collectArtistsFrom('.tracklist_title .rendered_text a.artist');
        return artists;
    }

    function buildChartUrl(artistArray) {
        const artistParam = artistArray.join(',');
        const link = `https://rateyourmusic.com/charts/popular/album,ep,comp,single,video,unauth,mixtape,musicvideo,djmix,additional/all-time/a:${artistParam}/incl:live,archival,soundtrack/`;
        console.log(link);
        return link;
    }

    function createChartSection(artists) {
        if (artists.length === 0) return;

        const outerDiv = document.createElement('div');
        outerDiv.className = 'section_lists';

        const newSection = document.createElement('div');
        newSection.className = 'section_charts';

        const headerDiv1 = document.createElement('div');
        headerDiv1.className = 'release_page_header';
        const h2 = document.createElement('h2');
        h2.style.float = 'left';
        h2.textContent = 'Charts';
        headerDiv1.appendChild(h2);
        newSection.appendChild(headerDiv1);

        const chartUrl = buildChartUrl(artists);
        const headerDiv2 = document.createElement('div');
        headerDiv2.className = 'release_page_header';
        const ul = document.createElement('ul');
        ul.className = 'credits';
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = chartUrl;
        link.textContent = 'All releases by artists';
        li.appendChild(link);
        ul.appendChild(li);
        headerDiv2.appendChild(ul);
        newSection.appendChild(headerDiv2);

        const table = document.createElement('table');
        table.className = 'color_bar';
        table.style.cssText = 'width:100%;height:1px;font-size:1px;padding:0;';
        const tbody = document.createElement('tbody');
        const tr = document.createElement('tr');
        tr.style.cssText = 'height:1px;padding:0;';
        tbody.appendChild(tr);
        table.appendChild(tbody);
        newSection.appendChild(table);

        outerDiv.appendChild(newSection);

        const line = document.createElement('div');
        line.style.cssText = 'width:100%;height:1px;background-color:#ffffff;margin:10px 0;';
        outerDiv.appendChild(line);

        const listSection = document.querySelector('.section_lists');
        if (listSection && listSection.parentNode) {
            listSection.parentNode.insertBefore(outerDiv, listSection);
        } else {
            document.body.appendChild(outerDiv);
        }
    }

    const urlArtists = getArtistsFromUrl();
    const featuredArtists = collectArtistsFrom('ul.credits li.featured_credit a.artist');
    const mainCredits = collectArtistsFrom('ul.credits > li a.artist');
    const minorCredits = collectArtistsFrom('#minor_credits_ a.artist');
    const tracklistArtists = collectArtistsFrom('.tracklist_title .rendered_text a.artist');

    const allCreditedArtists = [...mainCredits];
    for (const a of minorCredits) {
        if (!allCreditedArtists.includes(a)) {
            allCreditedArtists.push(a);
        }
    }

    if (urlArtists.length === 0 && featuredArtists.length === 0 && allCreditedArtists.length === 0) return;

    const outerDiv = document.createElement('div');
    outerDiv.className = 'section_lists';

    const newSection = document.createElement('div');
    newSection.className = 'section_charts';

    const headerDiv1 = document.createElement('div');
    headerDiv1.className = 'release_page_header';
    const h2 = document.createElement('h2');
    h2.style.float = 'left';
    h2.textContent = 'Charts';
    headerDiv1.appendChild(h2);
    newSection.appendChild(headerDiv1);

    if (urlArtists.length > 0) {
        const urlChartUrl = buildChartUrl(urlArtists);
        const headerDiv2 = document.createElement('div');
        headerDiv2.className = 'release_page_header';
        const ul = document.createElement('ul');
        ul.className = 'credits';
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = urlChartUrl;
        link.textContent = 'All releases by artists of album';
        li.appendChild(link);
        ul.appendChild(li);
        headerDiv2.appendChild(ul);
        newSection.appendChild(headerDiv2);
    }

    if (featuredArtists.length > 0) {
        const featuredUrl = buildChartUrl(featuredArtists);
        const headerDiv2 = document.createElement('div');
        headerDiv2.className = 'release_page_header';
        const ul = document.createElement('ul');
        ul.className = 'credits';
        const li = document.createElement('li');
        const link1 = document.createElement('a');
        link1.href = featuredUrl;
        link1.textContent = 'All releases by featured artists';
        li.appendChild(link1);
        ul.appendChild(li);
        headerDiv2.appendChild(ul);
        newSection.appendChild(headerDiv2);
    }

    if (allCreditedArtists.length > 0) {
        const creditedUrl = buildChartUrl(allCreditedArtists);
        const headerDiv3 = document.createElement('div');
        headerDiv3.className = 'release_page_header';
        const ul = document.createElement('ul');
        ul.className = 'credits';
        const li = document.createElement('li');
        const link2 = document.createElement('a');
        link2.href = creditedUrl;
        link2.textContent = 'All releases by credited artists';
        li.appendChild(link2);
        ul.appendChild(li);
        headerDiv3.appendChild(ul);
        newSection.appendChild(headerDiv3);
    }

    const table = document.createElement('table');
    table.className = 'color_bar';
    table.style.cssText = 'width:100%;height:1px;font-size:1px;padding:0;';
    const tbody = document.createElement('tbody');
    const tr = document.createElement('tr');
    tr.style.cssText = 'height:1px;padding:0;';
    tbody.appendChild(tr);
    table.appendChild(tbody);
    newSection.appendChild(table);

    outerDiv.appendChild(newSection);

    const line = document.createElement('div');
    line.style.cssText = 'width:100%;height:1px;background-color:#ffffff;margin:10px 0;';
    outerDiv.appendChild(line);

    const listSection = document.querySelector('.section_lists');
    if (listSection && listSection.parentNode) {
        listSection.parentNode.insertBefore(outerDiv, listSection);
    } else {
        document.body.appendChild(outerDiv);
    }
})();