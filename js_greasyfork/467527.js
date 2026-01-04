// ==UserScript==
// @name         Apple Music :: Copy Info / Search Elsewhere
// @namespace    https://greasyfork.org/en/scripts/467527-apple-music-copy-info-search-elsewhere
// @version      1.1
// @description  Copies the Apple Music release info to the clipboard, formatted by custom template, as well as search the artist elsewhere.
// @author       newstarshipsmell
// @include      /https?://music\.apple\.com/(\w{2}/)?album/(.+/)?\d+(\?.+)?/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=apple.com
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/467527/Apple%20Music%20%3A%3A%20Copy%20Info%20%20Search%20Elsewhere.user.js
// @updateURL https://update.greasyfork.org/scripts/467527/Apple%20Music%20%3A%3A%20Copy%20Info%20%20Search%20Elsewhere.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var logging = true;

    var scriptDelay = 3000;
    var btnSep = '\u00A0';
    var newTabBackground = true;
    var copyWithNewXs = false;
    var hookSelector = 'div.primary-actions';
    var hookSelectorIndex = 0;
    var coverSelector = 'div.artwork-component picture source[type="image/jpeg"]';
    var coverSelectorIndex = 0;
    var artistSelector = 'div.headings a';
    var albumSelector = 'h1.headings__title';
    var albumSelectorIndex = 0;
    var copyrightSelector = 'p.description';
    var copyrightSelectorIndex = 0;
    var selfReleasedPatt = /(\d+ Records DK2?|recordJet|author's edition|independent|not on label|unsigned|self.?released?)/i

    var trackNumbersSelector = 'div.songs-list-row__column-data';
    var trackTitlesSelector = 'div.songs-list-row__song-name';
    var trackLengthsSelector = 'time.songs-list-row__length';
    var urlPatt = /296x296bb-60\.jpg/;
    var urlRepA = '10000';
    var urlRepB = 'x0w.jpg';
    var coverMax, coverMaxUrl, openUrl;
    var hook, cover;

    setTimeout(function() {
        hook = document.querySelectorAll(hookSelector)[hookSelectorIndex];
        cover = document.querySelectorAll(coverSelector)[coverSelectorIndex].srcset.split(' ')[0];
        if (logging) console.log("cover: " + cover);
        getCoverMax(cover, addBtns);
    }, scriptDelay);

    function getCoverMax(url, callback) {
        coverMax = new Image();
        if (logging) console.log("url: " + url);
        coverMax.src = url.replace(urlPatt, urlRepA + urlRepB);
        if (logging) console.log("coverMax.src: " + coverMax.src);
        callback(url);
    }
    function addBtns(url) {
        var metaDate = document.querySelector('meta[property="music:release_date"]').content;
        var fullDate = new Date();
        fullDate.setTime(Date.parse(metaDate.replace(/T00:/, 'T24:')));
        var relDate = fullDate.toLocaleDateString();
        var relYear = fullDate.getFullYear();

        //var dispDate = document.querySelectorAll('p.song-released-container').length == 0 ? false : true;
        //if (!dispDate) document.querySelector('h3.product-meta').textContent += ': ' + relDate;

        //hook.parentNode.appendChild(document.createElement('br'));
        hook.appendChild(document.createElement('br'));
        hook.appendChild(document.createElement('br'));

        var copyBtn = document.createElement('input');
        copyBtn.type = 'button';
        copyBtn.id = 'copy_release_info';
        copyBtn.value = 'Copy Info';
        copyBtn.title = 'Copy release info to clipboard';
        hook.appendChild(copyBtn);
        copyBtn.onclick = function() {
            var coverMaxSize = coverMax.width;
            coverMaxUrl = url.replace(urlPatt, coverMaxSize + urlRepB);
            var artistName = document.querySelectorAll(artistSelector);
            var artistNames = '';
            for (var i = 0, len = artistName.length; i < len; i++) {
                artistNames += (i > 0 ? (i == len - 1 ? " & " : ", ") : "") + artistName[i].textContent.trim();
            }
            artistNames = artistName.length == 0 ? "Various Artists" : artistNames;
            if (logging) console.log("artistNames: " + artistNames);
            var albumTitle = document.querySelectorAll(albumSelector)[albumSelectorIndex].textContent.trim();
            if (logging) console.log("albumTitle: " + albumTitle);

            /*
			metaDate = document.querySelector('meta[property="music:release_date"]').content;

			fullDate = new Date();
			fullDate.setTime(Date.parse(metaDate.replace(/T00:/, 'T24:')));
			relDate = fullDate.toLocaleDateString();
			relYear = fullDate.getFullYear();
			*/

            relDate = document.querySelector('meta[property="music:release_date"]').content.split('T')[0];
            relYear = relDate.substr(0, 4);

            var relType = 'a';
            if (/.+ - EP/.test(albumTitle)) {
                albumTitle = albumTitle.replace(/ - EP$/, '');
                relType = 'e';
            }
            if (/.+ - Single/.test(albumTitle)) {
                albumTitle = albumTitle.replace(/ - Single$/, '');
                relType = 's';
            }
            if (artistNames == 'Various Artists') relType = 'c';
            if (logging) console.log("relType: " + relType);
            var copyright = document.querySelectorAll(copyrightSelector)[copyrightSelectorIndex].textContent.trim();
            copyright = copyright.split('\n');
            copyright = copyright[copyright.length - 1];
            copyright = copyright.replace(/^[\xA9\u2117] \d{4} /, '').replace(/under exclusive license to/, ' / ');
            if (selfReleasedPatt.test(copyright)) copyright = 'Self-Released';
            if (artistNames.toLowerCase() == copyright.toLowerCase()) copyright = 'Self-Released';
            artistName = artistNames.split(/(, | & )/);
            var artistNamePatt, copyrightPattB, copyrightPattA;
            for (i = 0, len = artistName.length; i < len; i++) {
                //if (copyright.toLowerCase().indexOf(artistName[i].toLowerCase()) > -1) copyright = 'Self-Released';
                artistNamePatt = artistName[i].toLowerCase().replace(/([\[\\\^\$\.\|\?\*\+\(\)])/g, '\\$1');
                if (logging) console.log("artistNamePatt: " + artistNamePatt);
                copyrightPattB = new RegExp("(.*)(, | / | \\ | & | - )" + artistNamePatt, "i");
                copyrightPattA = new RegExp(artistNamePatt + "(, | / | \\ | & | - )(.*)", "i");
                if (logging) console.log("copyrightPattB: " + copyrightPattB);
                if (logging) console.log("copyrightPattA: " + copyrightPattA);
                copyright = copyright.replace(copyrightPattB, "$1");
                copyright = copyright.replace(copyrightPattA, "$2");
                if (logging) console.log("copyright: " + copyright);
            }
            if (logging) console.log("copyright: " + copyright);
            var releaseUrl = document.querySelector('meta[property="og:url"]').getAttribute('content');
            if (logging) console.log("releaseUrl: " + releaseUrl);
            //var relUrl = location.href;

            var dToday = new Date();
            dToday.setHours(0);
            dToday.setMinutes(0);
            dToday.setSeconds(0);
            dToday = dToday.getTime();
            if (logging) console.log("dToday: " + dToday);

            var genre = '! AM: ' + document.querySelector('div.headings__metadata-bottom').textContent.split(' · ')[0].toLowerCase().replace(/ ?\/ ?/g, ', ');

            var infoStr;
            if (Date.parse(relDate) > dToday) {
                //infoStr = artistName + ' [' + relYear + '] ' + albumTitle + ' [' + copyright + ', WEB] [FLAC]\t\t\t\tnone\tnone\t' + relUrl + '\t' + relType + '\t' +
                //	(copyWithNewXs ? 'x\tx' : '\t') + '\t' + relDate;
                infoStr = '\t\t' + artistNames + '\t' + albumTitle + '\t' + relYear + '\t\t' + copyright + '\t\t\t' + relType + '\t\t' + coverMaxUrl + '\t\t' + releaseUrl + '\t\t\t\t\t\t\t' + relDate;
            } else {
                //infoStr = artistName + ' [' + relYear + '] ' + albumTitle + ' [' + copyright + ', WEB] [FLAC]\t\t\t\tnone\tnone\t' + relUrl +
                //	'\t' + relType + '\t' + coverMaxUrl;
                infoStr = '\t\t' + artistNames + '\t' + albumTitle + '\t' + relYear + '\t\t' + copyright + '\t\t\t' + relType + '\t' + genre + '\t' + coverMaxUrl + '\t\t' + releaseUrl;
            }
            if (logging) console.log("infoStr: " + infoStr);
            if (infoStr) {
                GM_setClipboard(infoStr);
                this.value = 'Copied info!';
            } else {
                this.value = 'Failure! :(';
            }
            setTimeout(function() {
                copyBtn.value = 'Copy Info';
            }, 1500);

        };

        var copyLinkBtn = document.createElement('input');
        copyLinkBtn.type = 'button';
        copyLinkBtn.id = 'copy_link';
        copyLinkBtn.value = 'Copy Link';
        copyLinkBtn.title = 'Copy Release URL to clipboard';
        hook.appendChild(document.createTextNode(btnSep));
        hook.appendChild(copyLinkBtn);
        copyLinkBtn.onclick = function() {
            var releaseUrl = document.querySelector('meta[property="og:url"]').getAttribute('content');
            if (releaseUrl) {
                GM_setClipboard(releaseUrl);
                this.value = 'Copied Link!';
            } else {
                this.value = 'Failure! :(';
            }
            setTimeout(function() {
                copyLinkBtn.value = 'Copy Link';
            }, 1500);
        };

        var copyCoverBtn = document.createElement('input');
        copyCoverBtn.type = 'button';
        copyCoverBtn.id = 'copy_max_cover';
        copyCoverBtn.value = 'Copy Max Cover';
        copyCoverBtn.title = 'Copy Max Cover URL to clipboard';
        hook.appendChild(document.createTextNode(btnSep));
        hook.appendChild(copyCoverBtn);
        copyCoverBtn.onclick = function() {
            var coverMaxSize = coverMax.width;
            if (logging) console.log("coverMaxSize: " + coverMaxSize);
            coverMaxUrl = url.replace(urlPatt, coverMaxSize + urlRepB);
            if (logging) console.log("coverMaxUrl: " + coverMaxUrl);

            if (coverMaxUrl) {
                GM_setClipboard(coverMaxUrl);
                this.value = 'Copied (' + coverMaxSize + 'x' + coverMaxSize + ')';
            } else {
                this.value = 'Failure! :(';
            }
            setTimeout(function() {
                copyCoverBtn.value = 'Copy Max Cover';
            }, 1500);
        };

        var openBtn = document.createElement('input');
        openBtn.type = 'button';
        openBtn.id = 'open_max_cover';
        openBtn.value = 'Open Max Cover';
        openBtn.title = 'Open Max Cover in new tab';
        hook.appendChild(document.createTextNode(btnSep));
        hook.appendChild(openBtn);
        openBtn.onclick = function() {
            openUrl = url.replace(urlPatt, urlRepA + urlRepB);
            GM_openInTab(openUrl, newTabBackground);
        };

        /*var copyUPCBtn = document.createElement('input');
        copyUPCBtn.type = 'button';
        copyUPCBtn.id = 'copy_upc';
        copyUPCBtn.value = 'Copy UPC';
        copyUPCBtn.title = 'Copy UPC';
        hook.appendChild(document.createTextNode('\u00A0'.repeat(2)));
        hook.appendChild(copyUPCBtn);
        copyUPCBtn.onclick = function() {
            var shoebox_media_api_cache_amp_music = document.getElementById('shoebox-media-api-cache-amp-music');
            var shoebox = shoebox_media_api_cache_amp_music.innerHTML;
            if (logging) console.log("shoebox:\n" + shoebox);
            var shoeboxUPCSplit = shoebox.split('\\"upc\\":\\"')[1];
            var UPC = shoeboxUPCSplit.split('\\",\\"')[0];
            if (logging) console.log("UPC: " + UPC);

            if (UPC) {
                GM_setClipboard(UPC);
                copyUPCBtn.value = 'Copied UPC! (' + UPC + ')';

            } else {
                copyUPCBtn.value = 'Failure! :(';
            }

            setTimeout(function() {
                copyUPCBtn.value = 'Copy UPC';
            }, 1500);
        };*/

        /*var copyISRCsBtn = document.createElement('input');
        copyISRCsBtn.type = 'button';
        copyISRCsBtn.id = 'copy_isrcs';
        copyISRCsBtn.value = 'Copy ISRCs';
        copyISRCsBtn.title = 'Copy ISRCs';
        hook.appendChild(document.createTextNode('\u00A0'.repeat(2)));
        hook.appendChild(copyISRCsBtn);
        copyISRCsBtn.onclick = function() {
            var shoebox_media_api_cache_amp_music = document.getElementById('shoebox-media-api-cache-amp-music');
            var shoebox = shoebox_media_api_cache_amp_music.innerHTML;
            if (logging) console.log("shoebox:\n" + shoebox);
            var shoeboxISRCSplit = shoebox.split('\\"isrc\\":\\"');
            var ISRCs = [], ISRC = '';
            for (var i = 1, len = shoeboxISRCSplit.length; i < len; i++) {
                ISRC = shoeboxISRCSplit[i].split('\\",\\"')[0];
                if (logging) console.log("ISRC: " + ISRC);
                ISRCs.push(ISRC);
            }
            if (logging) console.log("ISRCs: " + ISRCs);

            if (ISRCs.length > 0) {
                var isrcstr = 'PASTE-ISRC:[' + ISRCs.join('|') + ']';
                GM_setClipboard(isrcstr);
                copyISRCsBtn.value = 'Copied ISRCs!';

            } else {
                copyISRCsBtn.value = 'Failure! :(';
            }

            setTimeout(function() {
                copyISRCsBtn.value = 'Copy ISRCs';
            }, 1500);
        };*/

        var copyTracklist = document.createElement('input');
        copyTracklist.type = 'button';
        copyTracklist.id = 'copy_tracklist';
        copyTracklist.value = 'Copy Tracklist';
        copyTracklist.title = 'Copy Tracklist';
        hook.appendChild(document.createTextNode(btnSep));
        hook.appendChild(copyTracklist);
        copyTracklist.onclick = function(e) {
            var trackTitlesStr = e.shiftKey ? '[size=4][b]Tracklist[/b][/size]' : 'PASTE-TRACKLIST:';
            var trackNumbers = document.querySelectorAll(trackNumbersSelector);
            var trackTitles = document.querySelectorAll(trackTitlesSelector);
            var trackLengths = document.querySelectorAll(trackLengthsSelector);
            var trackSeconds = 0;
            var trackMinutes = 0;
            for (var i = 0, len = trackTitles.length; i < len; i++) {
                trackTitlesStr += e.shiftKey ?
                    ('\n[b]' + trackNumbers[i].textContent.trim() + '.[/b] ' + trackTitles[i].textContent.trim() + (trackLengths[i].textContent != '' ?
                                                                                                                    ' (' + trackLengths[i].textContent + ')': '')) : (i > 0 && i < len - 1 ?
                                                                                                                    '|' : '') + trackTitles[i].textContent.trim();
                trackSeconds += trackLengths[i].textContent != '' ? parseInt(trackLengths[i].textContent.split(/:/)[1]) : 0;
                trackMinutes += trackLengths[i].textContent != '' ? parseInt(trackLengths[i].textContent.split(/:/)[0]) : 0;
            }

            trackMinutes += Math.floor(trackSeconds / 60);
            trackSeconds = trackSeconds % 60;
            trackTitlesStr += e.shiftKey ? '\n\n[b]Total length:[/b] ' + trackMinutes + ':' + (trackSeconds < 10 ? '0' : '') + trackSeconds + '\n\nMore information: [url]' + location.href.split(/\?/)[0] +
                '[/url]' : '';
            if (logging) console.log("trackTitlesStr: " + trackTitlesStr);

            if (trackTitlesStr) {
                GM_setClipboard(trackTitlesStr);
                copyTracklist.value = 'Copied Tracklist!';
            } else {
                copyTracklist.value = 'Failure! :(';
            }

            setTimeout(function() {
                copyTracklist.value = 'Copy Tracklist';
            }, 1500);
        };

        var copyLabel = document.createElement('input');
        copyLabel.type = 'button';
        copyLabel.id = 'copy_label';
        copyLabel.value = 'Copy Label';
        copyLabel.title = 'Copy Label';
        hook.appendChild(document.createTextNode(btnSep));
        hook.appendChild(copyLabel);
        copyLabel.onclick = function() {
            var artistName = document.querySelectorAll(artistSelector);
            var artistNames = '';
            for (var i = 0, len = artistName.length; i < len; i++) {
                artistNames += (i > 0 ? (i == len - 1 ? " & " : ", ") : "") + artistName[i].textContent.trim();
            }
            artistNames = artistName.length == 0 ? "Various Artists" : artistNames;
            if (logging) console.log("artistNames: " + artistNames);

            var copyright = document.querySelectorAll(copyrightSelector)[copyrightSelectorIndex].textContent.trim();
            copyright = copyright.split('\n');
            copyright = copyright[copyright.length - 1];
            copyright = copyright.replace(/^[\xA9\u2117] \d{4} /, '').replace(/under exclusive license to/, ' / ');
            if (selfReleasedPatt.test(copyright)) copyright = 'Self-Released';
            if (artistNames.toLowerCase() == copyright.toLowerCase()) copyright = 'Self-Released';
            artistName = artistNames.split(/(, | & )/);
            var artistNamePatt, copyrightPattB, copyrightPattA;
            for (i = 0, len = artistName.length; i < len; i++) {
                //if (copyright.toLowerCase().indexOf(artistName[i].toLowerCase()) > -1) copyright = 'Self-Released';
                artistNamePatt = artistName[i].toLowerCase().replace(/([\[\\\^\$\.\|\?\*\+\(\)])/g, '\\$1');
                if (logging) console.log("artistNamePatt: " + artistNamePatt);
                copyrightPattB = new RegExp("(.*)(, | / | \\ | & | - )" + artistNamePatt, "i");
                copyrightPattA = new RegExp(artistNamePatt + "(, | / | \\ | & | - )(.*)", "i");
                if (logging) console.log("copyrightPattB: " + copyrightPattB);
                if (logging) console.log("copyrightPattA: " + copyrightPattA);
                copyright = copyright.replace(copyrightPattB, "$1");
                copyright = copyright.replace(copyrightPattA, "$2");
                if (logging) console.log("copyright: " + copyright);
            }
            if (logging) console.log("copyright: " + copyright);

            if (copyright) {
                GM_setClipboard(copyright);
                copyLabel.value = 'Copied Label! (' + copyright + ')';
            } else {
                copyLabel.value = 'Failure! :(';
            }

            setTimeout(function() {
                copyLabel.value = 'Copy Label';
            }, 1500);
        };

        var searchBtn = document.createElement('input');
        searchBtn.type = 'button';
        searchBtn.id = 'search_artist';
        searchBtn.value = 'Search artist';
        searchBtn.title = 'Search this artist on RED';
        hook.appendChild(document.createTextNode(btnSep));
        hook.appendChild(searchBtn);
        searchBtn.onclick = function() {
            var artistName = document.querySelectorAll(artistSelector);
            var artistNames = '';
            for (var i = 0, len = artistName.length; i < len; i++) {
                artistNames += (i > 0 ? (i == len - 1 ? " & " : ", ") : "") + artistName[i].textContent.trim();
            }
            artistNames = artistName.length == 0 ? "Various Artists" : artistNames;
            if (logging) console.log("artistNames: " + artistNames);
            GM_openInTab('https://redacted.ch/artist.php?artistname=' + encodeURIComponent(artistNames), false);
        };

        var searchAlbumBtn = document.createElement('input');
        searchAlbumBtn.type = 'button';
        searchAlbumBtn.id = 'search_album';
        searchAlbumBtn.value = 'Search Album';
        searchAlbumBtn.title = 'Search this artist+album on RED';
        hook.appendChild(document.createTextNode(btnSep));
        hook.appendChild(searchAlbumBtn);
        searchAlbumBtn.onclick = function() {
            var artistName = document.querySelectorAll(artistSelector);
            var artistNames = '';
            for (var i = 0, len = artistName.length; i < len; i++) {
                artistNames += (i > 0 ? (i == len - 1 ? " & " : ", ") : "") + artistName[i].textContent.trim();
            }
            artistNames = artistName.length == 0 ? "Various Artists" : artistNames;
            if (logging) console.log("artistNames: " + artistNames);
            var albumTitle = document.querySelectorAll(albumSelector)[albumSelectorIndex].textContent.trim();
            albumTitle = albumTitle.replace(/ - (EP|Single)$/, '');
            if (logging) console.log("albumTitle: " + albumTitle);
            if (artistName == 'Various Artists') {
                GM_openInTab('https://redacted.ch/torrents.php?groupname=' + encodeURIComponent(albumTitle), true);
            } else {
                GM_openInTab('https://redacted.ch/torrents.php?artistname=' + encodeURIComponent(artistNames) + '&groupname=' + encodeURIComponent(albumTitle), true);
            }
        };

    }
})();