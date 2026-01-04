// ==UserScript==
// @name         Album of the Year Last.fm integration
// @namespace    https://www.albumoftheyear.org/
// @version      0.3.2
// @description  Adds link to a user's scrobble pages for artist and album names
// @author       tomc.dev
// @match        https://www.albumoftheyear.org/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=albumoftheyear.org
// @supportURL   https://gist.github.com/chappy84/86eb4aeeca7fff5f5ae79ee451ecc4cd
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/526602/Album%20of%20the%20Year%20Lastfm%20integration.user.js
// @updateURL https://update.greasyfork.org/scripts/526602/Album%20of%20the%20Year%20Lastfm%20integration.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    String.prototype.ucFirst = function() {
        return this.charAt(0).toUpperCase() + this.substring(1);
    }

    function encodeForUrl(name) {
        return encodeURIComponent(name).replace(/(%20)+/g, '+').replace(/%26amp%3B/g, '&');
    }

    // GM_ functions aren't defined in Userscripts on iOS, so fall back to localStorage instead.
    if (typeof GM_getValue == 'undefined') {
        // defining by reference to localStorage.getItem breaks iOS, thus wrapper arrow function
        window.GM_getValue = (key) => {
            return localStorage.getItem(key);
        };
    }
    if (typeof GM_setValue == 'undefined') {
        window.GM_setValue = (key, val) => {
            localStorage.setItem(key, val);
        };
    }

    // Code Configuration
    class LastFmConfig {
        #storageKeyApiKey = 'lastFmApiKey';
        #storageKeyUsername = 'lastFmUsername';

        constructor(remoteChangeCallback) {
            // If the user changes the values in another tab, we want to ensure everything is ok in this tab too.
            if (remoteChangeCallback && typeof GM_addValueChangeListener != 'undefined') {
                GM_addValueChangeListener(this.#storageKeyUsername, (key, oldValue, newValue, remote) => {
                    if (remote) {
                        remoteChangeCallback();
                    }
                });
                GM_addValueChangeListener(this.#storageKeyApiKey, (key, oldValue, newValue, remote) => {
                    if (remote) {
                        remoteChangeCallback();
                    }
                });
            }
        }

        get username() {
            return GM_getValue(this.#storageKeyUsername);
        }

        set username(username) {
            GM_setValue(this.#storageKeyUsername, username);
        }

        /**
         * Last FM API Key.
         * Register for your own!! https://www.last.fm/api/account/create
         *
         * Definitely don't source one from, say, the code of the Chrome Web Scrobbler extension:
         * https://github.com/web-scrobbler/web-scrobbler/blob/master/src/core/scrobbler/lastfm/lastfm-scrobbler.ts#L21-L24
         */
        get apiKey() {
            return GM_getValue(this.#storageKeyApiKey);
        }

        set apiKey(apiKey) {
            GM_setValue(this.#storageKeyApiKey, apiKey);
        }

        get webBaseUrl() {
            return `https://www.last.fm/${this.username ? `user/${this.username}/library/` : ''}music/`;
        }

        getWebUrl(artist, album, track) {
            return `${this.webBaseUrl}${encodeForUrl(artist)}${album != undefined ? `/${encodeForUrl(album)}` : ''}`;
        }

        get apiBaseUrl() {
            return `https://ws.audioscrobbler.com/2.0/?username=${this.username}`;
        }

        getApiAlbumUrl(artist, album) {
            return this.getApiUrl('album.getinfo', {artist: artist, album: album});
        }

        getApiArtistUrl(artist) {
            return this.getApiUrl('artist.getinfo', {artist: artist});
        }

        // getApiTrackUrl(artist, track) {
        //     return this.getApiUrl('track.getinfo', {artist: artist, track: track});
        // }

        getApiUrl(method, params) {
            let baseUrl = `${this.apiBaseUrl}&method=${method}&api_key=${this.apiKey}&format=json`;
            if (params != undefined) {
                let paramArr = [];
                for (const [name, value] of Object.entries(params)) {
                    paramArr.push(`${encodeForUrl(name)}=${encodeForUrl(value)}`);
                }
                baseUrl += `&${paramArr.join('&')}`;
            }
            return baseUrl;
        }

        get showPlayCounts() {
            return this.username && this.apiKey;
        }
    }

    const cardinals = {
        'B': Math.pow(10, 9),
        'M': Math.pow(10, 6),
        'K': Math.pow(10, 3),
    };

    function formatPlayCount(playCount) {
        for (const [suffix, divisor] of Object.entries(cardinals)) {
            if (playCount >= divisor) {
                return (playCount / divisor).toFixed(1) + suffix;
            }
        }
        return playCount;
    }

    const linkTypeAlbum = 'album';
    const linkTypeArtist = 'artist';
    const iconClassesArtist = 'fa-regular fa-star';
    const iconClassesAlbum = 'fa-light fa-record-vinyl';

    const lastFmConfig = new LastFmConfig(refreshPageLinks);

    async function getJson(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error.message);
            return {};
        }
    }

    async function getArtistPlayCount(artistName) {
        if (!lastFmConfig.showPlayCounts) {
            return '';
        }
        const json = await getJson(lastFmConfig.getApiArtistUrl(artistName));
        return (json.artist && json.artist.stats && json.artist.stats.userplaycount
                ? formatPlayCount(json.artist.stats.userplaycount) : 0)
            + '';
    }

    async function getAlbumPlayCount(artistName, albumName) {
        if (!lastFmConfig.showPlayCounts) {
            return '';
        }
        const json = await getJson(
            lastFmConfig.getApiAlbumUrl(artistName, albumName)
        );
        let playCount = (json.album && json.album.userplaycount ? json.album.userplaycount : 0) + '';
        if (json.album && json.album.tracks && json.album.tracks.track && json.album.tracks.track.length) {
            playCount += ` / ${formatPlayCount(json.album.tracks.track.length || 0)}`;
        }
        return playCount;
    }

    function addItemPageLink(parentDiv, type, artistName, albumName) {
        const isAlbumLink = type == linkTypeAlbum;
        const linkTitle = `Last.fm${type ? ' ' + type.ucFirst() : ''}`;

        const link = document.createElement('div');
        link.dataset.lastFm = type;
        link.className = 'albumLinksFlex';
        link.innerHTML = `<a href="${lastFmConfig.getWebUrl(artistName, albumName)}" rel="nofollow" target="_blank" title="${linkTitle}"><div class="albumButton lastfm">
            <i class="fab fa-lastfm"></i>${type ? `<i class="${isAlbumLink ? iconClassesAlbum : iconClassesArtist}"></i>` : ''}
            <span>${linkTitle}</span>
        </div></a>`;
        parentDiv.appendChild(link);

        return link;
    }

    function addPlayCountToItemPageLink(link, playCount, isAlbumLink) {
        if (isAlbumLink && playCount.length && -1 == playCount.indexOf(' / ')) {
            const albumLengthSelectors = ['.trackListTable > tbody > tr', '.trackList > ol > li'];
            let albumLength = 0;
            for (let i = 0; i < albumLengthSelectors.length; i++) {
                albumLength = document.querySelectorAll(albumLengthSelectors[i]).length;
                if (albumLength) {
                    break;
                }
            }
            playCount += ` / ${albumLength}`;
        }
        const countSpan = document.createElement('span');
        countSpan.className = 'count';
        countSpan.innerHTML = playCount;
        const linkText = link.querySelector('.lastfm > span');
        // Colon needs to be in span, so it's hidden on smaller screens
        linkText.appendChild(document.createTextNode(': '));
        linkText.parentNode.appendChild(countSpan);
    }

    function addCommonStyle() {
        const pagesStyleId = 'lastFmCommonStyle';
        if (!document.getElementById(pagesStyleId)) {
            const style = document.createElement('style');
            style.id = pagesStyleId;
            style.textContent = `
                :root {
                    /* Colours sourced from last.fm website css
                       Default last.fm colour */
                    --color-last-fm-scarlet: #b90000;
                    /* lighter last.fm colour to make ratings page links easier on the eyes */
                    --color-last-fm-habanero: #f71414;
                }
            `;
            document.head.appendChild(style);
        }
    }

    function addPrefsDialogBox() {
        const dialogElementId = 'lastfmSaveDialog';
        if (!document.getElementById(dialogElementId)) {

            const style = document.createElement('style');
            style.id = 'lastFmDialogStyle';
            style.textContent = `
                /* Ensure the rest of the page can't be interacted with when the dialog is displayed */
                *:has(~ dialog#lastfmSaveDialog[open]):first-of-type::after {
                    content: "";
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    display: block;
                    background-color: rgba(50, 50, 50, 0.4);
                    backdrop-filter: blur(5px);
                    z-index: 2147483648;  /* 1 more than the page header (2^31) */
                }
                .dark *:has(~ dialog#lastfmSaveDialog[open]):first-of-type::after {
                    background-color: rgba(128, 128, 128, 0.4);
                }
                #lastfmSaveDialog {
                    min-width: 30%;
                    margin: auto;
                    padding: 20px;
                    z-index: 2147483649; /* 2 more than the page header (one over 2^31) */
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    border-color: #323232;
                    border-radius: 10px;
                }
                #lastfmSaveDialog #lastfmClose {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    border-radius: 50%;
                    width: 2em;
                    height: 2em;
                    /* Fixes poor positioning of x on iOS */
                    padding: 0;
                }
                #lastfmSaveDialog label,
                #lastfmSaveDialog input,
                #lastfmSaveDialog div {
                    display: block;
                    width: 100%;
                }
                #lastfmSaveDialog h4 {
                    font-size: 1.75em;
                    margin: 0 0 25px;
                }
                #lastfmSaveDialog label {
                    font-size: 1.25em;
                    margin: 15px 0 5px;
                }
                #lastfmSaveDialog input {
                    box-sizing: border-box;
                    padding: 5px;
                }
                #lastfmSaveDialog p {
                    text-align: right;
                    margin: 0.1ex;
                    font-size: 0.8em;
                }
                #lastfmSaveDialog a {
                    text-decoration: underline;
                }
                #lastfmSaveDialog #lastfmSave {
                    margin-left: auto;
                    margin-right: 0;
                    margin-top: 15px;
                    display: block;
                }
                .dark #lastfmSaveDialog {
                    background-color: #2F3136;
                    border-color: #202225;
                    color: #DCDDDE;
                }
                .mobileLastfm {
                    display: none;
                }
                @media screen and (min-width: 0) and (max-width: 480px) {
                    .mobileLastfm {
                        height: 40px;
                        width: 40px;
                        display: inline-block;
                        right: 140px;
                        top: 10px;
                        position: absolute;
                        font-size: 4ex;
                    }
                }
            `;
            document.head.appendChild(style);

            const navBar = document.querySelector('.nav #content');
            const lastFmPrefsNavBar = document.createElement('div');
            lastFmPrefsNavBar.className = 'navBlock lastfm';
            lastFmPrefsNavBar.innerHTML = '<a href="javascript:;">Last.fm Prefs</a>';
            navBar.insertBefore(lastFmPrefsNavBar, navBar.querySelector('.navBlock.signIn'));

            const header = document.querySelector('.header #content');
            const lastFmPrefsHeader = document.createElement('div');
            lastFmPrefsHeader.className = 'mobileLastfm';
            lastFmPrefsHeader.innerHTML = '<a href="javascript:;"><i class="fab fa-lastfm"></i></a>';
            header.insertBefore(lastFmPrefsHeader, header.querySelector('.mobileProfile'));

            const dialogBox = document.createElement('dialog');
            dialogBox.id = dialogElementId;

            dialogBox.innerHTML = `
                <button type="button" id="lastfmClose"><i class="fa fa-xmark"></i></button>
                <h4>Last.fm Preferences</h4>
                <div>
                    <label for="lastfmUsername">Username</label>
                    <input type="text" id="lastfmUsername" placeholder="Last.fm Username" value="${lastFmConfig.username}"/>
                    <p>Make Last.fm links point to your library, rather than the generic pages</p>
                </div>
                <div>
                    <label for="lastfmApiKey">API Key</label>
                    <input type="text" id="lastfmApiKey" placeholder="Last.fm API Key" value="${lastFmConfig.apiKey}"/>
                    <p>Required to show your scrobble counts. Register for your own <a target="_blank" href="https://www.last.fm/api/account/create">here</a></p>
                </div>
                <button type="button" id="lastfmSave">Save</button>
            `;
            document.body.appendChild(dialogBox);

            const showLastfmPrefs = () => {
                document.getElementById('lastfmUsername').value = lastFmConfig.username;
                document.getElementById('lastfmApiKey').value = lastFmConfig.apiKey;
                dialogBox.show();
            };
            lastFmPrefsNavBar.addEventListener('click', showLastfmPrefs);
            lastFmPrefsHeader.addEventListener('click', showLastfmPrefs);

            document.getElementById('lastfmClose').addEventListener('click', () => { dialogBox.close(); });
            document.getElementById('lastfmSave').addEventListener('click', () => {
                lastFmConfig.username = document.getElementById('lastfmUsername').value.trim();
                lastFmConfig.apiKey = document.getElementById('lastfmApiKey').value.trim();

                dialogBox.close();

                refreshPageLinks();
            });
        }
    }

    function addPagesStyle() {
        const pagesStyleId = 'lastFmLinkPageStyle';
        if (!document.getElementById(pagesStyleId)) {
            const style = document.createElement('style');
            style.id = pagesStyleId;
            style.textContent = `
                /* artist and album pages */
                .albumButton.lastfm:hover {
                    background-color: var(--color-last-fm-scarlet);
                    color: white;
                }
                .dark .albumButton.lastfm:hover {
                    color: #DCDDDE;
                }
                /* genre / ratings pages */
                .albumListLinks .lastfm:hover {
                    border-color: var(--color-last-fm-scarlet);
                    color: var(--color-last-fm-scarlet);
                }
                .dark .albumListLinks .lastfm:hover {
                    border-color: var(--color-last-fm-habanero);
                    color: var(--color-last-fm-habanero);
                }
                .albumListLinks .lastfm .fa-light {
                    font-weight: 300;
                }
                /* artist pages */
                .artistTopBox .socialRow .albumButton.lastfm {
                    padding: 0 10px;
                }
                /* Thinner displays */
                @media screen and (min-width: 0) and (max-width: 1023px) {
                    /* artist and album pages */
                    .albumButton.lastfm .count {
                        display: inline;
                        line-height: 32px;
                        font-size: 12px;
                    }
                    /* artist pages */
                    .artistTopBox .socialRow .albumButton.lastfm {
                        display: inline-block;
                        min-width: 100px;
                        margin: 0 1% 15px 0;
                    }
                    /* album pages */
                    .albumLinksFlex a:has(.albumButton.lastfm):hover,
                    .albumLinksFlex .albumButton.lastfm:hover {
                        text-decoration: none;
                    }
                    .albumLinksFlex .albumButton.lastfm {
                        margin: 10px 0 0;
                        padding: 0;
                        display: block;
                        width: auto;
                        line-height: 32px;
                        height: 34px;
                        font-size: 12px;
                    }
                    /* genre / ratings pages */
                    .albumListCover {
                        margin: 0 20px 15px 0;
                    }
                    .albumListLinks div {
                        margin-top: 5px;
                    }
                    /* resets touch scroll area on album list links
                       so we don't have to scroll to see last fm stats / links */
                    .albumListLinks {
                        white-space: normal;
                        width: auto;
                        overflow-x: visible;
                        overflow-y: visible;
                        -webkit-overflow-scrolling: auto;
                        -ms-overflow-style: auto;
                    }
                }
                /* end of year lists pages */
                @media screen and (min-width: 0) and (max-width: 480px) {
                    .pointsTable {
                        margin: 10px 0 15px;
                    }
                }
                @media screen and (min-width: 481px) {
                    .albumListLinks.listSummary {
                        margin-top: 5px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    function addAlbumPageLinks() {
        const buyButtons = document.querySelector('.thirdPartyLinks > .buyButtons');
        if (buyButtons) {
            // Deliberately don't go for the anchor tag, as there can be multiple when two artists have colaborated
            const artistEl = document.querySelector('.artist span[itemprop="name"]');
            const albumLinks = document.createElement('div');
            albumLinks.dataset.lastFm = 'links';
            albumLinks.className = 'albumLinks';
            buyButtons.appendChild(albumLinks);
            if (artistEl) {
                const artistName = artistEl.textContent.trim();
                const artistLink = addItemPageLink(albumLinks, linkTypeArtist, artistName);
                if (lastFmConfig.showPlayCounts) {
                    (async function() {
                        addPlayCountToItemPageLink(artistLink, await getArtistPlayCount(artistName));
                    })();
                }

                const albumEl = document.querySelector('.albumTitle > span[itemprop="name"]');
                if (albumEl) {
                    const albumName = albumEl.textContent.trim();
                    const albumLink = addItemPageLink(albumLinks, linkTypeAlbum, artistName, albumName);
                    if (lastFmConfig.showPlayCounts) {
                        (async function() {
                            addPlayCountToItemPageLink(
                                albumLink,
                                await getAlbumPlayCount(artistName, albumName),
                                true
                            );
                        })();
                    }
                }
            }
        }
    }

    function addArtistPageLink() {
        const artistHeadlineDiv = document.querySelector('.artistHeadline');
        const artistTopBoxDiv = document.querySelector('.artistTopBox');
        if (artistHeadlineDiv && artistTopBoxDiv) {
            const socialRow = document.createElement('div');
            socialRow.dataset.lastFm = 'social';
            socialRow.className = 'socialRow';
            artistTopBoxDiv.appendChild(socialRow);
            const artistName = artistHeadlineDiv.textContent.trim();
            const artistLink = addItemPageLink(socialRow, linkTypeArtist, artistName);
            if (lastFmConfig.showPlayCounts) {
                (async function() {
                    addPlayCountToItemPageLink(artistLink, await getArtistPlayCount(artistName));
                })();
            }
        }
    }

    function addListPageLinks() {
        // [id^="rank-"] doesn't work for selector on list pages that have no rank
        const albumRows = document.querySelectorAll('.albumListRow');
        if (albumRows) {
            for (let i = 0; i < albumRows.length; i++) {
                const albumRow = albumRows[i];
                const albumDetails = albumRow.querySelector('.albumListTitle meta[itemprop="name"]').content;
                const albumLinkCont = albumRow.querySelector('.albumListLinks');
                if (albumDetails && albumLinkCont) {
                    const albumDetailParts = albumDetails.match(/^(.+?) - (.+?)$/);
                    if (3 === albumDetailParts.length) {
                        const artistName = albumDetailParts[1];
                        const albumName = albumDetailParts[2];

                        function createAnchorLink(href, title, type) {
                            const iconClasses = type === linkTypeAlbum ? iconClassesAlbum : iconClassesArtist;
                            const lastFmLink = document.createElement('a');
                            lastFmLink.dataset.lastFm = type;
                            lastFmLink.href = href;
                            lastFmLink.rel = 'nofollow';
                            lastFmLink.target = '_blank';
                            lastFmLink.innerHTML =
                                `<div class="lastfm"><i class="fab fa-lastfm"></i><i class="${iconClasses}"></i>${title}</div>`;
                            return lastFmLink;
                        }

                        const titlePrefix = 'Last.fm';
                        const lastFmArtistLink = createAnchorLink(
                            lastFmConfig.getWebUrl(artistName),
                            `${titlePrefix} Artist`,
                            linkTypeArtist
                        );
                        albumLinkCont.appendChild(lastFmArtistLink);
                        const lastFmAlbumLink = createAnchorLink(
                            lastFmConfig.getWebUrl(artistName, albumName),
                            `${titlePrefix} Album`,
                            linkTypeAlbum
                        );
                        albumLinkCont.appendChild(lastFmAlbumLink);

                        if (lastFmConfig.showPlayCounts) {
                            (async function () {
                                lastFmArtistLink.querySelector('.lastfm').appendChild(
                                    document.createTextNode(`: ${await getArtistPlayCount(artistName)}`)
                                );
                            })();
                            (async function () {
                                lastFmAlbumLink.querySelector('.lastfm').appendChild(
                                    document.createTextNode(`: ${await getAlbumPlayCount(artistName, albumName)}`)
                                );
                            })();
                        }
                    }
                }
            }
        }
    }

    function addSummaryPageLinks() {
        const albumRows = document.querySelectorAll('.listSummaryRow');
        if (albumRows) {
            for (let i = 0; i < albumRows.length; i++) {
                const albumRow = albumRows[i];
                const artistCont = albumRow.querySelector('.artistTitle');
                const albumCont = albumRow.querySelector('.albumTitle');
                const albumLinkCont = albumRow.querySelector('.albumListLinks');
                if (artistCont && albumCont && albumLinkCont) {
                    const artistName = artistCont.textContent.trim();
                    const albumName = albumCont.textContent.trim();

                    function createAnchorLink(href, title, type) {
                        const lastFmLink = document.createElement('a');
                        lastFmLink.dataset.lastFm = type;
                        lastFmLink.href = href;
                        lastFmLink.rel = 'nofollow';
                        lastFmLink.target = '_blank';
                        lastFmLink.innerHTML = `<div>${title}</div>`;
                        return lastFmLink;
                    }

                    const titlePrefix = 'Last.fm';
                    const lastFmArtistLink = createAnchorLink(
                        lastFmConfig.getWebUrl(artistName),
                        `${titlePrefix} Artist`,
                        linkTypeArtist
                    );
                    albumLinkCont.appendChild(lastFmArtistLink);
                    const lastFmAlbumLink = createAnchorLink(
                        lastFmConfig.getWebUrl(artistName, albumName),
                        `${titlePrefix} Album`,
                        linkTypeAlbum
                    );
                    albumLinkCont.appendChild(lastFmAlbumLink);

                    if (lastFmConfig.showPlayCounts) {
                        (async function () {
                            lastFmArtistLink.querySelector('div').appendChild(
                                document.createTextNode(`: ${await getArtistPlayCount(artistName)}`)
                            );
                        })();
                        (async function () {
                            lastFmAlbumLink.querySelector('div').appendChild(
                                document.createTextNode(`: ${await getAlbumPlayCount(artistName, albumName)}`)
                            );
                        })();
                    }
                }
            }
        }
    }

    function addPageLinks() {
        let addLinksFunction;
        if (/\/album\//.test(document.location)) {
            // Album page
            addLinksFunction = addAlbumPageLinks;
        } else if (/\/artist\//.test(document.location)) {
            // Artist Page
            addLinksFunction = addArtistPageLink;
        } else if (/\/(genre|list|ratings)\/[0-9]/.test(document.location)) {
            // Ratings pages
            addLinksFunction = addListPageLinks;
        } else if (/\/list\/summary\//.test(document.location)) {
            addLinksFunction = addSummaryPageLinks;
        }
        if (addLinksFunction) {
            addPagesStyle();
            addLinksFunction();
        }
    }

    function refreshPageLinks() {
        const existingLastFmElements = document.querySelectorAll('*[data-last-fm]');
        existingLastFmElements.forEach((lastFmEl) => { lastFmEl.remove(); });
        addPageLinks();
    }

    // iOS Safari caches pages after these have been applied sometimes,
    // so check they don't already exist before starting our changes
    if (!document.querySelector('.lastfm')) {
        addCommonStyle();
        addPrefsDialogBox();
        addPageLinks();
    }
})();
