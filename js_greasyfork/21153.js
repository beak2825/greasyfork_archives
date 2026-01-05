// ==UserScript==
// @name            Stig's Last.fm Album Linkr
// @namespace       dk.rockland.userscript.lastfm.linkr
// @description     Adding album links and headers to tracks on Last.Fm's recent plays listings - plus linkifying About Me section on profiles
// @version         2024.12.02.0
// @author          Stig Nygaard, https://www.rockland.dk
// @homepageURL     https://www.rockland.dk/userscript/lastfm/linkr/
// @supportURL      https://www.rockland.dk/userscript/lastfm/linkr/
// @match           *://*.last.fm/*
// @match           *://*.lastfm.de/*
// @match           *://*.lastfm.es/*
// @match           *://*.lastfm.fr/*
// @match           *://*.lastfm.it/*
// @match           *://*.lastfm.ja/*
// @match           *://*.lastfm.pl/*
// @match           *://*.lastfm.pt/*
// @match           *://*.lastfm.ru/*
// @match           *://*.lastfm.sv/*
// @match           *://*.lastfm.tr/*
// @match           *://*.lastfm.zh/*
// @grant           GM.registerMenuCommand
// @grant           GM_registerMenuCommand
// @grant           GM_getValue
// @grant           GM_setValue
// @run-at          document-start
// @require         https://update.greasyfork.org/scripts/34527/751210/GMCommonAPIjs.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/21153/Stig%27s%20Lastfm%20Album%20Linkr.user.js
// @updateURL https://update.greasyfork.org/scripts/21153/Stig%27s%20Lastfm%20Album%20Linkr.meta.js
// ==/UserScript==

/*
 *      Stig's Last.fm Album Linkr is an userscript especially minded album-listeners on Last.Fm.
 *      It gives you better profile-pages with extra focus on albums in "recent tracks" lists.
 *
 *      https://greasyfork.org/scripts/21153-stig-s-last-fm-album-linkr
 *      https://github.com/StigNygaard/Stigs_Last.fm_Album_Linkr
 *      https://www.last.fm/user/rockland
 *
 *      PS. If you like having album-headers on your scrobbles, you might also like my website widget:
 *      https://lastfm-widgets.deno.dev/
 *      https://github.com/StigNygaard/lastfm-widgets
 */

var linkr = linkr || {
    // CHANGELOG - The most important updates/versions:
    changelog: [
        {version: '2024.12.02.0', description: "Improve splitting album titles (detect title-extensions like 'Special Edition' etc)"},
        {version: '2021.03.24.0', description: "Certificate error embedding from www.tapmusic.net (album collage), but changing to tapmusic.net seems to fix it."},
        {version: '2021.01.29.0', description: "Support the native GM.registerMenuCommand command introduced in GM4.11."},
        {version: '2020.12.05.0', description: "Stop using Google Image cache/proxy/resizer. It should not be necessary anymore."},
        {version: '2019.10.19.0', description: "Fix for an error happening when live scrobbling a track without cover art."},
        {version: '2019.07.08.0', description: "Adapting to last.fm's new scrobble list design and implementation."},
        {version: '2019.04.26.0', description: "Probably/hopefully fixing that tapmusic collage could delay loading of some other pageelements?"},
        {version: '2019.03.01.1', description: "Remove extra (mobile ad?) line bubbling up in scrobbles list."},
        {version: '2018.01.06.0', description: "Making the Linkify-feature optional."},
        {version: '2017.10.26.1', description: "Now fully compatible with the upcoming Greasemonkey 4 WebExtension (Use webpage context-menu for options in GM4/Firefox)."},
        {version: '2017.08.07.0', description: "Separate links for short and long album titles ('Special Edition', 'Remastered' etc.)"},
        {version: '2017.08.01.1', description: "Moving development source to a GitHub repository: https://github.com/StigNygaard/Stigs_Last.fm_Album_Linkr"},
        {version: '2017.03.01.0', description: "Found a work-around to keep tapmusic collages working on secure https last.fm pages (https://carlo.zottmann.org/posts/2013/04/14/google-image-resizer.html)."},
        {version: '2016.11.05.3', description: "Another bonus-feature added: Optionally embed album collage from http://www.tapmusic.net/lastfm on user's profiles (Enable it via menu in the userscript browser extension)."},
        {version: '2016.10.26.0', description: 'More intelligent creation of links in album-headers when there are featured artists on some albumtracks.'},
        {version: '2016.10.19.0', description: 'Bonus-feature added: Linkifying URLs written in About Me section in Profiles.'},
        {version: '2016.07.04.0', description: '1st release.'}
    ],
    INFO: true,
    DEBUG: false,
    observed: null,
    linking_running: false,
    collagetype: '',
    collapseTop: false,
    linkifyEnabled: true,
    log: function(s, info) {
        if ((info && window.console) || (linkr.DEBUG && window.console)) {
            window.console.log('*Linkr* '+s);
        }
    },
    albumIcon64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHt2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDIgNzkuYTZhNjM5NiwgMjAyNC8wMy8xMi0wNzo0ODoyMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTYtMDctMDdUMTQ6MzQ6MTgrMDI6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTEwLTA1VDA5OjIyOjU0KzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTEwLTA1VDA5OjIyOjU0KzAyOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpkZGZjMWJlMi00NWMwLTkyNDktODhjNC03MmY0MWViNDg4OTIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphOWEwN2UwMy1iOTAyLTg5NGEtOWE4Yi0wOTFmMDBhYmMyNjQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4ZDZlYmEyZS03MDU5LWVjNGQtYTIzYi0xZTViZGViNDYwY2MiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjY1NTM1IiBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjQ0IiBleGlmOlBpeGVsWURpbWVuc2lvbj0iMjQ0Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4ZDZlYmEyZS03MDU5LWVjNGQtYTIzYi0xZTViZGViNDYwY2MiIHN0RXZ0OndoZW49IjIwMTYtMDctMDdUMTQ6MzQ6MTgrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkNjQ4MWJjZS0zZDgxLTk0NDQtODNiOC1mNDUwNTJlZGVmMzMiIHN0RXZ0OndoZW49IjIwMTYtMDctMDdUMTY6NTE6MTYrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkZGZj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',
    insertStyle: function() {
        if (!document.getElementById('linkrStyle')) {
            let style = document.createElement('style');
            style.id = 'linkrStyle';
            style.innerHTML =
                `
                    #tapmusic { font-style:italic; font-size:12px; color:rgb(153,153,153) }
                    .tapcollage { line-height:1.5; animation:fadein 15s; animation-timing-function:ease-in; }
                    .tapcredit { line-height:1.3 }
                    @keyframes fadein { from{color:rgba(153,153,153,0);} to{color:rgba(153,153,153,1);} }
                    tr.albumlink-row, tr.albumlink-row > td { background-color:#fbe9e9 !important }
                    tr.albumlink-row > td.chartlist-name { font-style:italic }
                    tr.albumlink-row > td.chartlist-name > span > span { font-style:normal }
                    tr.albumlink-row:hover, tr.albumlink-row:hover > td { background-color:#fadcdc !important; }
                    .albumicon { width:32px; height:32px; margin:0; padding:0; display: block; background-image: url(${linkr.albumIcon64}); background-repeat: no-repeat; background-position: center; background-size: 24px 24px }
                    .albumextension, .albumextension .link-block-target { font-style:italic; color:#707070 !important }
                    tr.chartlist-row--interlist-ad.open-ad-container-mobile { display:none !important }
                    ${ linkr.collapseTop ? 'div[id^="gpt-slot-"], #leader_top { display:none }' : '' }
                `;
            document.getElementsByTagName('head')[0].appendChild(style);
            linkr.log('linkrStyle has been ADDED');
        } else {
            // linkr.log('linkrStyle was already present');
        }
    },
    loadSettings: function() {
        linkr.collagetype = (String(GMC.getValue('collagetype', ''))); // tapmusic collage
        linkr.collapseTop = (String(GMC.getValue('collapseTop', 'false'))==='true');
        linkr.linkifyEnabled = (String(GMC.getValue('linkifyEnabled', 'true'))==='true');
    },
    saveSettings: function() {
        GMC.setValue('collagetype', String(linkr.collagetype));
        GMC.setValue('collapseTop', String(linkr.collapseTop));
        GMC.setValue('linkifyEnabled', String(linkr.linkifyEnabled));
        location.reload(true);
    },
    collageOff: function() {
        linkr.collagetype = '';
        linkr.saveSettings();
    },
    collage7day: function() {
        linkr.collagetype = '7day';
        linkr.saveSettings();
    },
    collage1month: function() {
        linkr.collagetype = '1month';
        linkr.saveSettings();
    },
    collage3month: function() {
        linkr.collagetype = '3month';
        linkr.saveSettings();
    },
    collage6month: function() {
        linkr.collagetype = '6month';
        linkr.saveSettings();
    },
    collage12month: function() {
        linkr.collagetype = '12month';
        linkr.saveSettings();
    },
    collageOverall: function() {
        linkr.collagetype = 'overall';
        linkr.saveSettings();
    },
    toggleCollapseTop: function() {
        linkr.collapseTop = !linkr.collapseTop;
        linkr.saveSettings();
    },
    toggleLinkifyEnabled: function() {
        linkr.linkifyEnabled = !linkr.linkifyEnabled;
        linkr.saveSettings();
    },
    linking: function (mutations) {
        linkr.log('Entering linking function...', linkr.INFO);
        if(linkr.linking_running) {
            linkr.log('EXIT linking function, because already running!...', linkr.INFO);
            return;
        }
        linkr.linking_running = true;
        function altvalue(elem) {
            if (elem?.firstElementChild) {
                let albumImg = elem.querySelector('td.chartlist-image > a.cover-art > img');
                if (elem.classList.contains('albumlink-row') || elem.firstElementChild.classList.contains('albumlink-row')) {
                    return null;
                } else if (albumImg?.alt) {
                    return albumImg.alt;
                }
            }
            return null;
        }
        function containing(s, sub) {
            s = s.trim().replace(/^the\s/gi, "").replace(/,\sthe$/gi,"").replace(" & ", " and ").trim();
            sub = sub.trim().replace(/^the\s/gi, "").replace(/,\sthe$/gi,"").replace(" & ", " and ").trim();
            return (s.toLocaleUpperCase().includes(sub.toLocaleUpperCase()));
        }
        function splitAlbumTitle(title) {
            title = title.trim();
            let rtval = {full:title, basic:title};
            let regs =  [
                /^(.+[^-\s])(\s+-\s+)(\w[\w\s]+\sEdition[\w\s]*)$/i,
                /^(.+[^-\s])(\s+-\s+)(\w[\w\s]+\sVersion[\w\s]*)$/i,
                /^(.+[^-\s])(\s+-\s+)(\w[\w\s]+\sDeluxe[\w\s]*)$/i,
                /^(.+[^-\s])(\s+-\s+)(\w[\w\s]+\sRemaster[\w\s]*)$/i,
                /^(.+[^-\s])(\s+-\s+)(\w[\w\s]+\sDisc[\w\s]*)$/i,
                /^(.+[^-\s])(\s+-\s+)(\w[\w\s]+\sCD[\w\s]*)$/i,
                /^(.+[^-\s])(\s+-\s+)(Deluxe[\w\s]*)$/i,
                /^(.+[^-\s])(\s+-\s+)(Super[\w\s]*)$/i,
                /^(.+[^-\s])(\s+-\s+)(Remaster[\w\s]*)$/i,
                /^(.+[^-\s])(\s+-\s+)(Music from[\w\s]*)$/i,
                /^(.+[^-\s])(\s+-\s+)(EP[\w\s]*)$/i,
                /^(.+[^-\s])(\s+-\s+)(Live[\w\s]*)$/i,
                /^(.+[^-\s])(\s+-\s+)(single[\w\s]*)$/i,
                /^(.+[^-\s])(\s+-\s+)(Explicit[\w\s]*)$/i,
                /^(.+[^-\s])(\s+-\s+)(Disc\s[\w\s]+)$/i,
                /^(.+[^-\s])(\s+-\s+)(CD\s[\w\s]+)$/i,
                /^(.+[^-\s])(\s+)([([][\w\s]+\sEdition[\w\s]*[)\]])$/i,
                /^(.+[^-\s])(\s+)([([][\w\s]+\sVersion[\w\s]*[)\]])$/i,
                /^(.+[^-\s])(\s+)([([][\w\s]+\sDeluxe[\w\s]*[)\]])$/i,
                /^(.+[^-\s])(\s+)([([][\w\s]+\sSuper[\w\s]*[)\]])$/i,
                /^(.+[^-\s])(\s+)([([][\w\s]+\sRemaster[\w\s]*[)\]])$/i,
                /^(.+[^-\s])(\s+)([([][\w\s]+\sDisc[\w\s]*[)\]])$/i,
                /^(.+[^-\s])(\s+)([([][\w\s]+\sCD[\w\s]*[)\]])$/i,
                /^(.+[^-\s])(\s+)([([]Deluxe[\w\s]*[)\]])$/i,
                /^(.+[^-\s])(\s+)([([]Super[\w\s]*[)\]])$/i,
                /^(.+[^-\s])(\s+)([([]Remaster[\w\s]*[)\]])$/i,
                /^(.+[^-\s])(\s+)([([]Music from[\w\s]*[)\]])$/i,
                /^(.+[^-\s])(\s+)([([]EP[)\]])$/i,
                /^(.+[^-\s])(\s+)([([]Live[)\]])$/i,
                /^(.+[^-\s])(\s+)([([]single[)\]])$/i,
                /^(.+[^-\s])(\s+)([([]Explicit[)\]])$/i,
                /^(.+[^-\s])(\s+)([([]Disc\s[\w\s]+[)\]])$/i,
                /^(.+[^-\s])(\s+)([([]CD\s[\w\s]+[)\]])$/i,
                /^(.+[^-\s])(\s+)(EP[\d\s]*)$/i
            ];  // ( ... bonus CD), (single),... ?
            for (let element of regs) {
                let m = title.match(element);
                // 0: full (= basic+spacer+extension)
                // 1: basic
                // 2: spacer
                // 3: extension
                if (m!==null && m.length===4) {
                    rtval.basic = m[1];
                    rtval.spacer = m[2];
                    rtval.extension = m[3];
                    break; // return rtval;
                }
            }
            return rtval;
        }
        function albumCompoundLinkTag(artistname, artistlink, title, albumlink) {
            title = splitAlbumTitle(title);
            if (title.extension) {
                let shortAlbumlink = artistlink + '/' + encodeURIComponent(title.basic).replace(/%20/g, '+') + '/';
                return '<a href="' + shortAlbumlink + '" class="link-block-target" title="' + artistname + ' — ' + title.basic + '">' + title.basic + '</a><span class="albumextension">' + title.spacer + '<a href="' + albumlink + '" class="link-block-target" title="' + artistname + ' — ' + title.full + '">' + title.extension + '</a></span>';
            } else {
                return '<a href="' + albumlink + '" class="link-block-target" title="' + artistname + ' — ' + title.full + '">' + title.full + '</a>';
            }
        }

        let tlists = document.querySelectorAll('section#recent-tracks-section table.chartlist tbody, section.tracklist-section tbody');
        linkr.log('tlists.length='+tlists.length);
        for (let j=0; j<tlists.length; j++) {
            linkr.log('Loop with tlists['+j+'].');
            let rows = tlists[j].querySelectorAll('tr.js-focus-controls-container');
            if (rows && rows.length > 2) {
                linkr.log('tlists['+j+'] has ' + rows.length + ' rows');
                let loopstart=1;
                if (j===0 && rows[0].classList.contains('now-scrobbling')) {
                    // loopstart=2; // Uncomment this to prevent album-header at very top of Recent Tracks if the 1st row is a currently a scrobbling (yellow) track
                }
                for (let i = loopstart; i < rows.length; i++) {
                    linkr.log('for-loop. i=' + i);
                    if (i===1 || !rows[i - 2].classList.contains('albumlink-row')) {
                        linkr.log('for-loop. i=' + i + ' og i-2 er IKKE allerede albumlink-row');
                        if (i===2) { // for i=2, extra logging...
                            linkr.log('for-loop. altvalue(rows[i])=' + altvalue(rows[i]));
                            linkr.log('for-loop. altvalue(rows[i-1])=' + altvalue(rows[i-1]));
                            linkr.log('for-loop. altvalue(rows[i-2])=' + altvalue(rows[i-2]));
                        }
                        if (    altvalue(rows[i]) &&
                                altvalue(rows[i - 1]) &&
                                altvalue(rows[i]).toLowerCase() === altvalue(rows[i - 1]).toLowerCase() &&
                                (i===1 || altvalue(rows[i - 2]) === null || altvalue(rows[i]).toLowerCase() !== altvalue(rows[i - 2]).toLowerCase()) ) {
                            linkr.log('for-loop. i=' + i + ' og vi har fundet en album-gruppes start');
                            // TRY to get albumartist right even when misc. featured artists on album tracks:
                            let bestindex = i-1;
                            let artistlinkelem = rows[bestindex].querySelector('td.chartlist-artist > a');
                            let albumcoverelem = rows[bestindex].querySelector('td.chartlist-image > a > img');
                            let artistname = artistlinkelem.innerText;
                            let tracks = [{absindex: bestindex, artistname: artistname, coverurl: (albumcoverelem ? albumcoverelem.src : null)}];
                            for (let k=i; k < rows.length; k++) {
                                if (altvalue(rows[i-1]).toLowerCase() !== altvalue(rows[k]).toLowerCase()) break; // new album
                                artistlinkelem = rows[k].querySelector('td.chartlist-artist > a');
                                albumcoverelem = rows[k].querySelector('td.chartlist-image > a > img');
                                tracks.push({absindex: k, artistname: artistlinkelem.innerText, coverurl: (albumcoverelem ? albumcoverelem.src : null)});
                                if (rows[k].querySelector('td.chartlist-artist > a').innerText.length < artistname.length) {
                                    bestindex = k;
                                    artistname = artistlinkelem.innerText;
                                }
                                // linkr.log('*** k='+k+': altvalue='+altvalue(rows[k])+', artist='+ rows[k].querySelector('td.chartlist-name span.chartlist-artists > a').textContent, true)
                            }
                            let artistlink = rows[bestindex].querySelector('td.chartlist-artist > a');
                            let albumtitle = altvalue(rows[bestindex]);
                            let albumcover = rows[bestindex].querySelector('td.chartlist-image > a > img');
                            if (albumcover) albumcover=albumcover.src;
                            if (artistlink) {
                                if (tracks.reduce(function (x, y) {
                                        return x && containing(y.artistname, artistname);
                                    }, true)) { //y.artistname.includes(artistname)
                                    artistlink = artistlink.href;
                                    linkr.log('*** [before split()]: All albumtracks on "' + albumtitle + '" has "' + artistname + '" contained in trackartists');
                                } else {
                                    artistname = artistname.split(',')[0];
                                    artistlink = artistlink.href.split(',')[0];
                                    if (tracks.reduce(function (x, y) {
                                            return x && containing(y.artistname, artistname);
                                        }, true)) {
                                        linkr.log('*** [after split()]: All albumtracks on "' + albumtitle + '" has "' + artistname + '" contained in trackartists');
                                    } else {
                                        // Looks like we have a "Various Artists"...
                                        artistname = 'Various Artists';
                                        artistlink = '/music/Various+Artists';
                                        linkr.log('*** [far after split()]: Seems "' + albumtitle + '" is a "Various Artists" album...');
                                    }
                                }
                                let albumlink = artistlink + '/' + encodeURIComponent(albumtitle).replace(/%20/g, '+') + '/';
                                let tr = document.createElement('tr');
                                tr.classList.add('albumlink-row', 'js-focus-controls-container', 'chartlist-row');                   // https://c1.staticflickr.com/3/2821/32308516104_dc32a69ba0_o.png // or http://www.rockland.dk/img/album244c.png // or https://images1-fcus-opensocial.googleusercontent.com/gadgets/proxy?url=http%3A%2F%2Fwww.rockland.dk%2Fimg%2Falbum244c.png&container=focus&resize_w=244&refresh=3600
                                tr.setAttribute('data-ajax-form-state','');
                                tr.setAttribute('data-recenttrack-id','');
                                tr.setAttribute('data-timestamp','');
                                tr.innerHTML = '<td class="chartlist-play"></td><td class="chartlist-image"><a class="cover-art" href="' + albumlink + '"><img alt="" title="' + albumtitle + '" src="' + albumcover + '" class="cover-art"></a></td><td class="chartlist-loved"><a class="albumicon" href="' + albumlink.replace(/\/user\/[^/]+\/library\//, '/') + '"></a></td><td class="chartlist-name" colspan="2"><span class="chartlist-ellipsis-wrap"><span class="chartlist-artists"><a href="' + artistlink + '" title="' + artistname + '">' + artistname + '</a></span><span class="artist-name-spacer"> — </span>' + albumCompoundLinkTag(artistname, artistlink, albumtitle, albumlink) + '</span></td><td class="chartlist-buylinks focus-control"><div class="lazy-buylinks"><button class="disclose-trigger lazy-buylinks-toggle" aria-expanded="false" aria-controls="buylinks-linkr-' + i + '" data-lazy-buylink="" data-disclose-lazy-buylinks="" data-lazy-buylink-url="' + albumlink.replace(/\/user\/[^/]+\/library\//, '/') + '/+partial/buylinks" data-dropdown-layout-at="center bottom+3">Buy</button><ul id="buylinks-linkr-' + i + '" class="disclose-hide dropdown-menu-clickable buylinks-dropdown-menu"><li class="menu-loading" data-lazy-buylinks-loading="" aria-live="polite">Loading</li></ul></div></td><td class="chartlist-more">&nbsp;</td><td class="chartlist-timestamp">&nbsp;</td>';
                                linkr.log('Now trying to add tr...');
                                tlists[j].insertBefore(tr, rows[i - 1]);
                                linkr.log('and should be added now!?');
                                i += 1; // or http://stackoverflow.com/questions/8766910/is-there-a-loop-start-over ?
                            }
                        }
                    }
                }
            } else {
                linkr.log('but not enough children found...');
            }
        }
        linkr.log('linking function about to run linkify and sidebar...');
        // extras here...
        linkr.linkifySidebar();
        setTimeout(linkr.tapmusicSidebar, 100);
        linkr.log('Natural exit from linking function...', linkr.INFO);
        linkr.linking_running = false;
    },
    setupObserver: function () {
        // linkr.log('Running setupObserver()');
        linkr.insertStyle();
        linkr.observed = document.querySelector('table.chartlist > tbody');
        if (!linkr.observed?.classList) {
            linkr.log('Object to observe NOT found - re-trying later...');
        } else if (linkr.observed.classList.contains('hasObserver')) {
            // linkr.log('Everything is okay! - But checking again later...');
        } else {
            linkr.linking();
            linkr.log('Now creating Observer...', linkr.INFO);
            let observer = new MutationObserver(linkr.linking);
            let config = {attributes: false, childList: true, subtree: false, characterData: false};
            linkr.log('Now starting Observer...', linkr.INFO);
            observer.observe(linkr.observed, config);
            linkr.log('Observer added and running...');
            linkr.observed.classList.add('hasObserver');
            linkr.log('hasObserver class added...', linkr.INFO);
        }
    },
    linkifyStr: function (str, attributes) {
        let a1 = '<a ' + (attributes ? attributes+' ' : '') + 'href="';
        let a2 = '">';
        let a3 = '</a>';
        let url = /(^|\s|\(|>)([fhtpsr]+:\/\/[^\s]+?)([.,;\]"]?(\s|$|\))|<)/igm;
        // var url2 = /(^|\s|\()([fhtpsr]+:\/\/[^\s]+?)([\.,;\]"]?(\s|$|\)))/igm;
        // This looks a bit weird, but we have to do a replace twice to catch URLs
        // which immediately follow each other. This is because leading and trailing
        // whitespaces are part of the expressions, and if a trailing whitespace of
        // a match needs to be a leading whitespace of the next URL to match, it
        // won't be caught.
        let s = str.replace(url, '$1' + a1 + '$2' + a2 + '$2' + a3 + '$3$4');
        return(s.replace(url, '$1' + a1 + '$2' + a2 + '$2' + a3 + '$3$4'));
    },
    linkifySidebar: function() {
        if (linkr.linkifyEnabled) {
            let a = document.querySelectorAll('.about-me-sidebar p');
            for (const element of a) {
                element.innerHTML = linkr.linkifyStr(element.innerHTML);
            }
        }
    },
    tapmusicSidebar: function() {
        if (linkr.collagetype) {
            //  /user/userid
            let pattern = /^\/user\/([^/]+)/i;
            let result = RegExp(pattern).exec(window.location.pathname);
            if (result) {
                linkr.log('tapmusicSidebar(): url match med userid=' + result[1]);
                let b = document.querySelector('.stationlinks');
                if (b && !document.getElementById('tapmusic')) {
                    // Via google cache:
                    // b.insertAdjacentHTML('beforeend', '<div style="margin:1em 0;width:300px" id="tapmusic"><div class="tapcollage"><img src="https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url=https%3A%2F%2Fwww.tapmusic.net%2Fcollage.php%3Fuser%3D' + result[1] + '%26type%3D'+linkr.collagetype+'%26size%3D2x6&container=focus&resize_w=300&refresh=3600" alt="If this text is visible, tapmusic.net might be slow or not responding - or the profile you are looking at does not have recent scrobbles to generate a collage from... But sometimes a simple re-load of page also helps." style="display:block;margin:0;padding:0;width:300px;height:900px" decoding="async" /></div><div class="tapcredit"><em title="Album collage by www.tapmusic.net/lastfm - Embedded by Stig\'s Last.fm Album Linkr">Album collage by <a href="http://www.tapmusic.net/lastfm/">www.tapmusic.net/lastfm/</a></em></div></div>');
                    // Directly from tapmusic:
                    b.insertAdjacentHTML('beforeend', '<div style="margin:1em 0;width:300px" id="tapmusic"><div class="tapcollage"><img src="https://tapmusic.net/collage.php?user=' + result[1] + '&type='+linkr.collagetype+'&size=2x6" alt="If this text is visible, tapmusic.net might be slow or not responding - or the profile you are looking at does not have recent scrobbles to generate a collage from... But sometimes a simple re-load of page also helps." style="display:block;margin:0;padding:0;width:300px;height:900px" decoding="async" /></div><div class="tapcredit"><em title="Album collage by tapmusic.net/lastfm - Embedded by Stig\'s Last.fm Album Linkr">Album collage by <a href="https://tapmusic.net/lastfm/?utm_source=https%3A%2F%2Fgreasyfork.org%2Fscripts%2F21153">tapmusic.net/lastfm/</a></em></div></div>');
                }
            } else {
                linkr.log('tapmusicSidebar(): returnerer false! reg-pattern fandt ikke match i pathname=' + window.location.pathname);
            }
        }
    },
    boarding: function() {
        if (GMC.info?.script?.version) {
            const box = document.createElement('dialog');
            if (box?.showModal && GMC.info.script.version !== GMC.getValue('boardingversion')) {
                box.innerHTML =
                    `
                <style>dialog {background-color: #fff9e5; max-width: 60dvw; font-family: sans-serif} dialog button {background-color: #fff9e5; padding: 2px 4px; margin-top: .7em; border: 2px solid #000}</style>
                <p>You are now using userscript (GMScript)
                <strong><em><a href="https://greasyfork.org/scripts/21153-stig-s-last-fm-album-linkr" target="_blank">Stig's Last.fm Album Linkr</a></em>
                version <em>${GMC.info.script.version}</em></strong>. It is the first update of this script in
                nearly 4 years! This version primarily improves detection and handling of "extended" album-titles.</p>
                <p>Do you like the red album-headers that <em>Album Linkr</em> adds to playlists on the Last.fm site?
                If you have a homepage/blog in need of a "scrobbles widget", you might want to take a look at
                <strong><em><a href="https://lastfm-widgets.deno.dev/" target="_blank">Tracks</a></em></strong>
                 - a new web-widget I have created that should work on most websites. And it also (optionally)
                 features red album-headers🙂</p>
                <p>This message should normally only be shown once.</p>
                <button autofocus>Close</button>
                `;
                document.body.appendChild(box);
                GMC.setValue('boardingversion', GMC.info.script.version);
                box.showModal();
                box.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    ev.preventDefault();
                    box.close();
                });
            }
        }
    },
    init: function () {
        linkr.log('Running init() on last.fm with readyState = ' + document.readyState, linkr.INFO);
        if (!(linkr.observed?.classList?.contains('hasObserver'))) {
            linkr.loadSettings();
            linkr.setupObserver();
            setInterval(linkr.setupObserver, 2000);
            GMC.registerMenuCommand("Album Collages - Disabled", linkr.collageOff, {
                accessKey: "D",
                type: "radio",
                name: 'collage',
                checked: (linkr.collagetype === '')
            });
            GMC.registerMenuCommand("Album Collages - 7 Days", linkr.collage7day, {
                accessKey: "7",
                type: "radio",
                name: 'collage',
                checked: (linkr.collagetype === '7day')
            });
            GMC.registerMenuCommand("Album Collages - 1 Month", linkr.collage1month, {
                accessKey: "1",
                type: "radio",
                name: 'collage',
                checked: (linkr.collagetype === '1month')
            });
            GMC.registerMenuCommand("Album Collages - 3 Months", linkr.collage3month, {
                accessKey: "3",
                type: "radio",
                name: 'collage',
                checked: (linkr.collagetype === '3month')
            });
            GMC.registerMenuCommand("Album Collages - 6 Months", linkr.collage6month, {
                accessKey: "6",
                type: "radio",
                name: 'collage',
                checked: (linkr.collagetype === '6month')
            });
            GMC.registerMenuCommand("Album Collages - 1 Year", linkr.collage12month, {
                accessKey: "Y",
                type: "radio",
                name: 'collage',
                checked: (linkr.collagetype === '12month')
            });
            GMC.registerMenuCommand("Album Collages - Overall", linkr.collageOverall, {
                accessKey: "O",
                type: "radio",
                name: 'collage',
                checked: (linkr.collagetype === 'overall')
            });
            GMC.registerMenuCommand("Linkify About Me section", linkr.toggleLinkifyEnabled, {
                accessKey: "L",
                type: "checkbox",
                checked: (linkr.linkifyEnabled)
            });
            GMC.registerMenuCommand("Collapse the top", linkr.toggleCollapseTop, {
                accessKey: "C",
                type: "checkbox",
                checked: (linkr.collapseTop)
            });

            linkr.boarding();
        }
    }
};

linkr.log('Userscript running at readyState: ' + document.readyState, linkr.INFO);
window.addEventListener('DOMContentLoaded', linkr.init, false);
// window.addEventListener('load', linkr.init, false);
window.addEventListener('pageshow', linkr.init, false);
