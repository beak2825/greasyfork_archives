// ==UserScript==
// @name         [GMT] Flexible Search Links
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.62.0
// @description  Appends versatile search links bar to linkbar
// @author       Anakunda
// @copyright    © 2025 Anakunda (https://greasyfork.org/users/321857)
// @license      GPL-3.0-or-later
// @match        https://*/torrents.php?id=*
// @match        https://*/artist.php?id=*
// @match        https://*/requests.php?action=view&id=*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @require      https://openuserjs.org/src/libs/Anakunda/libCtxtMenu.min.js
// @downloadURL https://update.greasyfork.org/scripts/421505/%5BGMT%5D%20Flexible%20Search%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/421505/%5BGMT%5D%20Flexible%20Search%20Links.meta.js
// ==/UserScript==

'use strict';

if (document.querySelector('div.sidebar > div.box_artists') == null) return; // not a music category
const header = document.querySelector('div#content div.header');
if (header == null) throw 'Unexpected page structure';
for (let fn of ['GM_getValue', 'GM_setValue'/*, 'GM_listValues'*/])
    if (!(fn in window)) throw 'GM extensions not available';

if (typeof GM_deleteValue == 'function') {
    var menu = document.createElement('menu');
    menu.type = 'context';
    menu.id = 'context-1d19ca90-5242-418a-b6d3-d9a9fd5e5cfc';
    menu.innerHTML = '<menuitem label="Remove this link" icon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAADaElEQVQ4y0XTT0xcVRQG8O+ce+fNAOUN7QiFFoHSNq2SIDQ2QGfQ0hYtSatpuvFPjK0mxtDWRF24MG7UbVeasDGmiTrWgG2NjRlaUyAsirrQoCZVF5QZhsKUP/NmKMwM993jwlG/zfdtT3J+IGYCwPE3zye+f//d6UrmMAAwkUI5/+6qilD4q7Z90x9tjyQIYAIIAHjo1ZfjMn5dNm9+LdfeOjdZQeSCCEzETMQAUBl03C/6j0wmD0Vl7kCnfFgXiQNgFT/32ndnTp84lVnK+A+8rHTubW7piNT2Xfvp5xEDFABIheLwZ6dPjR4u+odWvKxvQ0Hpcd32RrFdvD1cXV9az8Ffz4sqFdT8fNr0P76/O372hYQDbHFEtnz+4vOJJ6C7M/fmTSjoKBYrOuAgEnDqqZI5HH/97LcDPe29CytLJmCtLpV8U1dVo6+M3R6DdnCirr4vOTFhKiortEBMrVJ6ODU3eSGVOkkAUKmU++WZ50aPdu7pvp/NmwAcbQzZ6mA12VUPmbFb4hAYzCbCrK+m01ODs8mni0BOMZEqiRS++eX3kQ5365PtO3c059dLVvuai+tFyf34A3SxwBxQ9iHF6mo6fXtwNjlQBHIMKCWAMBEbSOHqb3fie0NVsUdrd+za9MWaP+6wZBZJBQO2CsSXU+mJ88nUUwZYY4AtYDUAQAQgghWB2SiCfIGZT8OfS0E7DhiAIoEAsOXfkHIrJlIWZEMk4Uv9x248+9iBWHZ12dq//mSGWMUkmsDCsNFtNbsaoY6MetkRHyj8d0KI4H7S1zc68Ehbz8pazmBmRmFjw1bpAAUJJAxRAi5AzMEat7mBAodveN6wDxRUiBAeisWun9zfFl1ZXzOcWdT+6rKJBIPqcjI9/msufze6raa1ADEk0EWI6drqNkVEx2553hX9aTQ6fnTPvo7lnGf0xgNtlpZMJODo4dT81Nup5DMA4LC6+VJTQ3ceviGBzlnfvNJc3yuWxzmTzy+YnAdd3CB/6b4fUUoPp+9NXZi9e9yA1gyw9sbszPFLyYUpl5UWgh9gULZgsVjaXAAB/F7r7ngyGpPF7i75uKll0gFcACiLYwAIgNyLD7dOer09MnuwSwYjO+MAGGWS/EFdQ2KosWU6RPQPZ+B/zuUdJApfbNw9/U5dUwJlzn8DiOOFPhubkGUAAAAASUVORK5CYII=" /><menuitem label="-" />';
    menu.deleter = function(searchLinks, branch) {
        if (typeof searchLinks != 'object') throw 'Invalid argument (searchLinks)';
        if (!branch) throw 'Invalid argument (branch)';
        if (!(this.invoker instanceof HTMLAnchorElement)) throw 'Invoker not set';
        if (!(this.invoker.textContent in searchLinks)) {
            console.debug('searchLinks:', Object.keys(searchLinks), this.invoker.textContent);
            throw '"' + this.invoker.textContent + '" not a key of searchLinks';
        }
        if (!confirm('Are you sure to remove ' + this.invoker.textContent + ' from search bar?')) return false;
        delete searchLinks[this.invoker.textContent];
        if (this.invoker.nextSibling != null && this.invoker.nextSibling.nodeType == 3) this.invoker.nextSibling.remove();
            else if (this.invoker.previousSibling.textContent == divisor) this.invoker.previousSibling.remove();
        this.invoker.remove();
        GM_setValue(branch, searchLinks);
        alert('Site was removed. To restore it, use reset command from script\'s submenu');
    }.bind(menu);
    menu.callerSetter = function(evt) { this.invoker = evt.currentTarget }.bind(menu);
    document.body.append(menu);
}

const searchBox = document.createElement('div'), divisor = ' | ';
searchBox.className = 'searchbox';
searchBox.style = 'text-align: center; padding-bottom: 5px; margin-top: -1px;';
const fileName = document.location.pathname.replace(/^.*\//, '').toLowerCase();
let searchLinks = GM_getValue(fileName);

String.prototype.toASCII = function() { return this.normalize('NFKD').replace(/[\x00-\x1F\u0300-\u036F]/gu, '') };

switch (fileName) {
    case 'torrents.php':
    case 'requests.php': {
        const defaultSearchLinks = fileName == 'torrents.php' ? {
            'Orpheus': 'https://orpheus.network/torrents.php?action=advanced&artistname=${real_artists}&groupname=${album}',
            'RuTracker': 'https://rutracker.org/forum/tracker.php?nm=${real_artists_quoted}+${album_quoted}',
            'Google': 'https://www.google.com/search?q=${artists_quoted}+${album_quoted}+${year}',
            'Google (Images)': 'https://www.google.com/search?q=${artists_quoted}+${album_quoted}+${year}&tbm=isch',
            'Wikipedia': 'https://www.wikipedia.org/w/index.php?search=${artists}+${album}',
            'Discogs': 'https://www.discogs.com/search/?title=${album}&artist=${real_artists}&type=all&layout=med',
            'Discogs (title/year)': 'https://www.discogs.com/search/?title=${album}&year=${year}&type=all&layout=med',
			'MusicBrainz': 'https://musicbrainz.org/search?query=artistname:${artist_quoted} AND release:${album_quoted}&type=release_group&method=advanced',
            'AllMusic': 'https://www.allmusic.com/search/all/${real_artists_quoted}%20${album_quoted}',
            'Rate Your Music': 'https://rateyourmusic.com/search?searchterm=${real_artists_quoted}+${album_quoted}&searchtype=l',
            'Album of the Year': 'https://www.albumoftheyear.org/search/?q=${real_artists}+${album}',
			'Apple Music': 'https://music.apple.com/search?term=${artists}+${album}',
            'Deezer': 'https://www.deezer.com/search/${artists_quoted}%20${album_quoted}/album',
            'Spotify': 'https://open.spotify.com/search/${artists_quoted}%20${album_quoted}',
            'Tidal': 'https://listen.tidal.com/search/albums?q=${real_artists_quoted}+${album_quoted}',
            'Qobuz': 'https://www.qobuz.com/search?q=${real_artist}+${album}&i=boutique',
            'HighResAudio': 'https://www.highresaudio.com/en/search/?artist=${real_artist_quoted}&album=${album_quoted}&sort=-releaseDate',
            'Bandcamp': 'https://bandcamp.com/search?q=${real_artist_quoted}+${album_quoted}&item_type=a',
            'Mora': 'https://mora.jp/search/top?keyWord=${real_artists_quoted}+${album_quoted}',
            'e-onkyo': 'https://www.e-onkyo.com/search/search.aspx?q=${real_artists_quoted}+${album_quoted}',
            '7digital': 'https://uk.7digital.com/search?q=${real_artists_quoted}+${album_quoted}',
            'Boomkat': 'https://boomkat.com/products?q[keywords]=${album_quoted}',
            'Bleep': 'https://bleep.com/search/query?q=${album}',
            'SoundCloud': 'https://soundcloud.com/search/albums?q=${real_artists_quoted}+${album_quoted}',
            'Amazon Music': 'https://music.amazon.com/search/${real_artists_quoted}%20${album_quoted}',
            'YouTube Music': 'https://music.youtube.com/search?q=${real_artists_quoted}%20${album_quoted}',
            'Presto Jazz': 'https://www.prestomusic.com/jazz/search?search_query=${real_artists_quoted}%20${album_quoted}',
            'Presto Classical': 'https://www.prestomusic.com/classical/search?search_query=${real_artists_quoted}%20${album_quoted}',
            'ProStudioMasters': 'https://www.prostudiomasters.com/search?cs=1&q=${real_artists_quoted}+${album_quoted}',
            'Acoustic Sounds': 'https://store.acousticsounds.com/index.cfm?get=results&Artist=${real_artists}&Album=${album}',
            'Beatport': 'https://www.beatport.com/search/releases?q=${real_artists_quoted}+${album_quoted}',
            'Beatsource': 'https://www.beatsource.com/search?q=${real_artists_quoted}+${album_quoted}',
            'Juno Download': 'https://www.junodownload.com/search/?solrorder=relevancy&q%5Ball%5D%5B%5D=${real_artists}%20${album}',
            'Traxsource': 'https://www.traxsource.com/search/titles?term=${real_artists_quoted}+${album_quoted}',
            'Last.fm': 'https://www.last.fm/search?q=${real_artists_quoted}+${album_quoted}',
            'OTOTOY': 'https://ototoy.jp/find/?q=${album_quoted}',
            'Recochoku (レコチョク)': 'https://recochoku.jp/search/all?q=${real_artist}+${album}',
            'NetEase': 'https://music.163.com/#/search/m/?s=${real_artists_quoted}%20${album_quoted}&type=10',
            'QQ音乐': 'https://y.qq.com/portal/search.html#t=album&w=${real_artists_quoted}%20${album_quoted}',
        } : {
            'Orpheus': 'https://orpheus.network/torrents.php?action=advanced&artistname=${real_artists}&groupname=${album}',
            'RuTracker': 'https://rutracker.org/forum/tracker.php?nm=${real_artists_quoted}+${album_quoted}',
            'Google': 'https://www.google.com/search?q=${artists_quoted}+${album_quoted}+${year}',
            'Google (Images)': 'https://www.google.com/search?q=${artists_quoted}+${album_quoted}+${year}&tbm=isch',
            'Wikipedia': 'https://www.wikipedia.org/w/index.php?search=${artists}+${album}',
            'Discogs': 'https://www.discogs.com/search/?title=${album}&artist=${real_artists}&type=all&layout=med',
            'Discogs (title/year)': 'https://www.discogs.com/search/?title=${album}&year=${year}&type=all&layout=med',
            'Discogs (label/cat№)': 'https://www.discogs.com/search/?label=${label}&catno=${cat_no}&type=all&layout=med',
			'MusicBrainz': 'https://musicbrainz.org/search?query=artistname:${artist_quoted} AND release:${album_quoted}&type=release_group&method=advanced',
            'AllMusic': 'https://www.allmusic.com/search/all/${real_artists_quoted}%20${album_quoted}',
            'Rate Your Music': 'https://rateyourmusic.com/search?searchterm=${real_artists_quoted}+${album_quoted}&searchtype=l',
            'Album of the Year': 'https://www.albumoftheyear.org/search/?q=${real_artists_quoted}+${album_quoted}',
			'Apple Music': 'https://music.apple.com/search?term=${artists}+${album}',
            'Deezer': 'https://www.deezer.com/search/${artists_quoted}%20${album_quoted}/album',
            'Spotify': 'https://open.spotify.com/search/${artists_quoted}%20${album_quoted}',
            'Tidal': 'https://listen.tidal.com/search/albums?q=${real_artists_quoted}+${album_quoted}',
            'Qobuz': 'https://www.qobuz.com/search?q=${real_artist}+${album}&i=boutique',
            'HighResAudio': 'https://www.highresaudio.com/en/search/?artist=${real_artist_quoted}&album=${album_quoted}&sort=-releaseDate',
            'Bandcamp': 'https://bandcamp.com/search?q=${real_artist_quoted}+${album_quoted}&item_type=a',
            'Mora': 'https://mora.jp/search/top?keyWord=${real_artists_quoted}+${album_quoted}',
            'e-onkyo': 'https://www.e-onkyo.com/search/search.aspx?q=${real_artists_quoted}+${album_quoted}',
            '7digital': 'https://uk.7digital.com/search?q=${real_artists_quoted}+${album_quoted}',
            'Boomkat': 'https://boomkat.com/products?q[keywords]=${album_quoted}',
            'Bleep': 'https://bleep.com/search/query?q=${album}',
            'SoundCloud': 'https://soundcloud.com/search/albums?q=${real_artists_quoted}+${album_quoted}',
            'Amazon Music': 'https://music.amazon.com/search/${real_artists_quoted}%20${album_quoted}',
            'YouTube Music': 'https://music.youtube.com/search?q=${real_artists_quoted}%20${album_quoted}',
            'Presto Jazz': 'https://www.prestomusic.com/jazz/search?search_query=${real_artists_quoted}%20${album_quoted}',
            'Presto Classical': 'https://www.prestomusic.com/classical/search?search_query=${real_artists_quoted}%20${album_quoted}',
            'ProStudioMasters': 'https://www.prostudiomasters.com/search?cs=1&q=${real_artists_quoted}+${album_quoted}',
            'Acoustic Sounds': 'https://store.acousticsounds.com/index.cfm?get=results&Artist=${real_artists}&Album=${album}',
            'Beatport': 'https://www.beatport.com/search/releases?q=${real_artists_quoted}+${album_quoted}',
            'Beatsource': 'https://www.beatsource.com/search?q=${real_artists_quoted}+${album_quoted}',
            'Juno Download': 'https://www.junodownload.com/search/?solrorder=relevancy&q%5Ball%5D%5B%5D=${real_artists}%20${album}',
            'Traxsource': 'https://www.traxsource.com/search/titles?term=${real_artists_quoted}+${album_quoted}',
            'Last.fm': 'https://www.last.fm/search?q=${real_artists_quoted}+${album_quoted}',
            'OTOTOY': 'https://ototoy.jp/find/?q=${album_quoted}',
            'Recochoku (レコチョク)': 'https://recochoku.jp/search/all?q=${real_artist}+${album}',
            'NetEase': 'https://music.163.com/#/search/m/?s=${real_artists_quoted}%20${album_quoted}&type=10',
            'QQ音乐': 'https://y.qq.com/portal/search.html#t=album&w=${real_artists_quoted}%20${album_quoted}',
        };
        if (typeof searchLinks != 'object') GM_setValue(fileName, searchLinks = defaultSearchLinks);
        //console.debug('searchLinks:', searchLinks);
        if (typeof GM_registerMenuCommand == 'function' && typeof GM_deleteValue == 'function')
            GM_registerMenuCommand('Reset links to default', function() {
                if (!confirm('Are you sure to discard current configuration?')) return;
                GM_setValue(fileName, searchLinks = defaultSearchLinks);
                if (header.querySelector('div.searchbox') == null) header.append(searchBox);
                searchBox.build();
            }, 'R');
        if (Object.keys(searchLinks) <= 0) return;
        menu.onclick = evt => menu.deleter(searchLinks, fileName);
        let full_title = header.querySelector('h2 > span:last-of-type');
        if (full_title != null) {full_title = full_title.textContent.trim()}else{
            const opsTitle = header.querySelector('h2 >a:last-of-type');
            if (opsTitle) {full_title = opsTitle.textContent.trim()} else throw 'Unexpected page structure';}
        const title = full_title.replace(/\s+(?:EP|E\.\s?P\.|\(EP\)|\(E\.\s?P\.\)|-\s*EP|-\s*E\.\s?P\.|\(Live\)|- Live)$/, '');
        let albumArtist = header.querySelector('div.header > h2 > a:first-of-type');
        if (albumArtist != null) albumArtist = albumArtist.textContent.trim();
        let releaseType, label, cat_no;
        switch (fileName) {
            case 'torrents.php':
                releaseType = header.querySelector('div.header > h2');
                if (releaseType != null) releaseType = /\[([^\[\]]*)\]$/.exec(releaseType.textContent.trim());
                releaseType = releaseType != null && releaseType[1] || undefined;
                if (/^\d{4}/.test(releaseType)) releaseType = releaseType.slice(5);
                label = cat_no = '';
                break;
            case 'requests.php': {
                function getValue(label) {
                    if (label) for (let tr of document.body.querySelectorAll('div.main_column > table > tbody > tr'))
                        if ([0, 1].every(ndx => tr.children[ndx] != null)
                                && tr.children[0].textContent.trim().toLowerCase() == label.toLowerCase())
                            return tr.children[1].textContent.trim();
                    return '';
                }
                releaseType = getValue('Release type');
                label = getValue('Record label');
                cat_no = getValue('Catalogue number');
                break;
            }
        }
        const isComp = releaseType == 'Compilation', VA = 'Various Artists';
        let year = header.querySelector('h2');
        if (year != null) year = /\[(\d{4})\]/.exec(year.lastChild.textContent);
        year = year != null ? parseInt(year[1]) : '????';
		console.assert(year >= 1900 && year < 1e4, 'year >= 1900 && year < 1e4');
        const mainArtists = Array.from(document.querySelectorAll((fileName == 'torrents.php' ?
			'ul#artist_list > li.artist_main' : 'ul > li.artists_main') + ' > a[href]')).map(a => a.textContent.trim());
		const metaNames = {
			artist: isComp ? VA : mainArtists.length > 0 ? mainArtists[0] : '',
			real_artist: isComp ? '' : mainArtists.length > 0 ? mainArtists[0] : '',
			artists: isComp ? VA : mainArtists.slice(0, 3).join(' '),
			real_artists: isComp ? '' : mainArtists.slice(0, 3).join(' '),
			all_artists: isComp ? VA : mainArtists.join(' '),
			album_artist: isComp ? VA : albumArtist ? albumArtist : '',
			real_album_artist: isComp ? '' : albumArtist ? albumArtist : '',
			album: title,
			release_type: releaseType ? releaseType : '',
		};
		for (let quoted of [false, true]) for (let asc of [false, true])
			for (let raw of [false, true]) for (let key in metaNames) {
				let value = metaNames[key];
				if (asc) { value = value.toASCII(); key += '_asc'; }
				if (quoted) { value = '"' + value + '"'; key += '_quoted'; }
				if (raw) key = 'raw_' + key; else value = encodeURIComponent(value);
				//console.debug('Metaname:', key, 'Value:', value);
				window.eval(`${key} = unescape('${escape(value)}')`);
			}
        (searchBox.build = function() {
            this.textContent = 'Lookup on: ';
            for (let key in searchLinks) {
                if (this.lastChild.nodeName == 'A') this.append(divisor);
                let a = document.createElement('A');
                a.textContent = key;
                try { a.href = eval('`' + searchLinks[key] + '`') } catch(e) {
                    console.error('Invalid URL format for', key, searchLinks[key], e);
                    continue;
                }
                a.target = '_blank';
                if (typeof GM_deleteValue == 'function' && menu instanceof HTMLElement) {
                    a.setAttribute('contextmenu', menu.id);
                    a.oncontextmenu = menu.callerSetter;
                }
				a.style = 'white-space: nowrap;';
                this.append(a);
            }
        }.bind(searchBox))();
        header.append(searchBox);
        break;
    }
    case 'artist.php': {
        const defaultSearchLinks = {
            'Orpheus': 'https://orpheus.network/artist.php?artistname=${artist}',
            'RuTracker': 'https://rutracker.org/forum/tracker.php?nm=${artist_quoted}',
            'Google': 'https://www.google.com/search?q=${artist_quoted}',
            'Google (Images)': 'https://www.google.com/search?q=${artist_quoted}&tbm=isch',
            'Wikipedia': 'https://www.wikipedia.org/w/index.php?search=${artist_quoted}',
            'Discogs': 'https://www.discogs.com/search/?q=${artist}&type=artist&layout=med',
            'MusicBrainz': 'https://musicbrainz.org/search?query=${artist_quoted}&type=artist',
            'AllMusic': 'https://www.allmusic.com/search/artists/${artist}',
            'Rate Your Music': 'https://rateyourmusic.com/search?searchterm=${artist_quoted}&searchtype=a',
            'Album of the Year': 'https://www.albumoftheyear.org/search/?q=${artist}',
            'Artist Info': 'https://music.metason.net/artistinfo?name=${artist}',
            'Apple Music': 'https://music.apple.com/search?term=${artist_quoted}',
            'Deezer': 'https://www.deezer.com/search/${artist}/artist',
            'Spotify': 'https://open.spotify.com/search/${artist_quoted}',
            'Tidal': 'https://listen.tidal.com/search/artists?q=${artist_quoted}',
            'Qobuz': 'https://www.qobuz.com/search?q=${artist}&i=boutique',
            'HighResAudio': 'https://www.highresaudio.com/en/search/?artist=${artist_quoted}',
            'Bandcamp': 'https://bandcamp.com/search?q=${artist_quoted}&item_type=b',
            'Mora': 'https://mora.jp/search/top?keyWord=${artist_quoted}',
            'e-onkyo': 'https://www.e-onkyo.com/search/search.aspx?q=${artist_quoted}',
            '7digital': 'https://uk.7digital.com/search?q=${artist_quoted}',
            'Boomkat': 'https://boomkat.com/products?q[keywords]=${artist_quoted}',
            'Bleep': 'https://bleep.com/search/query?q=${artist}',
            'SoundCloud': 'https://soundcloud.com/search/people?q=${artist_quoted}',
            'Amazon Music': 'https://music.amazon.com/search/${artist_quoted}',
            'YouTube Music': 'https://music.youtube.com/search?q=${artist_quoted}',
            'Presto Jazz': 'https://www.prestomusic.com/jazz/search?search_query=${artist_quoted}',
            'Presto Classical': 'https://www.prestomusic.com/classical/search?search_query=${artist_quoted}',
            'ProStudioMasters': 'https://www.prostudiomasters.com/search?cs=1&q=${artist_quoted}',
            'Acoustic Sounds': 'https://store.acousticsounds.com/index.cfm?get=results&Artist=${artist}',
            'Beatport': 'https://www.beatport.com/search/artists?q=${artist_quoted}',
            'Beatsource': 'https://www.beatsource.com/search?q=${artist_quoted}',
            'Juno Download': 'https://www.junodownload.com/search/?solrorder=relevancy&q%5Ball%5D%5B%5D=${artist}',
            'Traxsource': 'https://www.traxsource.com/search/artists?term=${artist_quoted}',
            'Last.fm': 'https://www.last.fm/search/artists?q=${artist_quoted}',
            'OTOTOY': 'https://ototoy.jp/find/?q=${artist_quoted}',
            'Recochoku (レコチョク)': 'https://recochoku.jp/search/artist?q=${artist}',
            'NetEase': 'https://music.163.com/#/search/m/?s=${artist_quoted}&type=100',
            'QQ音乐': 'https://y.qq.com/portal/search.html#t=artist&w=${artist_quoted}',
        };
        if (typeof searchLinks != 'object') GM_setValue(fileName, searchLinks = defaultSearchLinks);
        //console.debug('searchLinks:', searchLinks);
        if (typeof GM_registerMenuCommand == 'function' && typeof GM_deleteValue == 'function')
            GM_registerMenuCommand('Reset links to default', function() {
                if (!confirm('Are you sure to discard current configuration?')) return;
                GM_setValue(fileName, searchLinks = defaultSearchLinks);
                if (header.querySelector('div.searchbox') == null) header.append(searchBox);
                searchBox.build();
            }, 'R');
        if (Object.keys(searchLinks) <= 0) return;
        menu.onclick = evt => menu.deleter(searchLinks, fileName);
        let h2 = header.querySelector('h2');
        if (h2 == null) throw 'Unexpected page structure';
        const artist = encodeURIComponent(h2.textContent.trim()),
                    artist_asc = encodeURIComponent(h2.textContent.trim().toASCII()),
                    artist_quoted = encodeURIComponent('"' + h2.textContent.trim() + '"'),
                    artist_asc_quoted = encodeURIComponent('"' + h2.textContent.trim().toASCII() + '"');
        searchBox.style.marginBottom = '1em';
        (searchBox.build = function() {
            this.textContent = 'Lookup on: ';
            for (let key in searchLinks) {
                if (this.lastChild.nodeName == 'A') this.append(divisor);
                let a = document.createElement('A');
                a.textContent = key;
                try { a.href = eval('`' + searchLinks[key] + '`') } catch(e) {
                    console.error('Invalid URL format for', key, searchLinks[key], e);
                    continue;
                }
                a.target = '_blank';
                if (typeof GM_deleteValue == 'function' && menu) {
                    a.setAttribute('contextmenu', menu.id);
                    a.oncontextmenu = menu.callerSetter;
                }
				a.style = 'white-space: nowrap;';
                this.append(a);
            }
        }.bind(searchBox))();
        header.append(searchBox);
        break;
    }
}
