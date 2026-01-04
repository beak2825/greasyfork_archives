// ==UserScript==
// @name         Spotify Download Button
// @namespace    http://tampermonkey.net/
// @version      2024-04-05
// @description  button to download from spotify
// @author       You
// @match        https://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/484645/Spotify%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/484645/Spotify%20Download%20Button.meta.js
// ==/UserScript==

/* globals $ */

(function() {
    'use strict';

    const style = document.createElement( 'style' );

style.innerText = `

[role='grid'] {
	margin-left: 50px;
}

[data-testid='tracklist-row'] {
	position: relative;
}

[role="presentation"] > * {
	contain: unset;
}

.btn {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	border: 0;
	background-color: #1fdf64;
	background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M17 12v5H3v-5H1v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z"/><path d="M10 15l5-6h-4V1H9v8H5l5 6z"/></svg>');
	background-position: center;
	background-repeat: no-repeat;
	cursor: pointer;
}
.btn:hover {
	transform: scale(1.1);
}
[data-testid='tracklist-row'] .btn {
	position: absolute;
	top: 50%;
	right: 100%;
	margin-top: -20px;
	margin-right: 10px;
}
`;
document.body.appendChild( style );

function sleep( ms ) {
	return new Promise( resolve => setTimeout( resolve, 0 ) );
}

function animate() {
	const tracks = document.querySelectorAll( '[data-testid="tracklist-row"]' );
	for ( let i = 0; i < tracks.length; i ++ ) {
		const track = tracks[ i ];
		if ( ! track.hasButton ) {
			addButton( track ).onclick = async function () {
				const btn = track.querySelector( '[data-testid="more-button"]' );
				btn.click();
				await sleep( 1 );
				const highlight = document.querySelector( '#context-menu a[href*="highlight"]' ).href.match( /highlight=(.+)/ )[ 1 ];
				document.dispatchEvent( new MouseEvent( 'mousedown' ) );
				const url = getSearchString(track);
				download( url );
			}
		}
	}
	const actionBarRow = document.querySelector( '[data-testid="action-bar-row"]:last-of-type' );
	if ( actionBarRow && ! actionBarRow.hasButton ) {
		addButton( actionBarRow ).onclick = function () {
			download( window.location.href );
		}
	}
}

function download( link ) {
    //	window.open( 'https://free-mp3-download.net/?q=' + window.btoa(link), '_blank' );
	window.open( 'https://hayqbhgr.slider.kz/#' + link.replace(' ','%20'), '_blank' );
}

function addButton( el ) {
	const button = document.createElement( 'button' );
	button.className = 'btn';
	el.appendChild( button );
	el.hasButton = true;
	return button;
}

const translations = {
    es: ['Copiar info de la canción', 'Copiado: %s'],
    pt: ['Copiar info da canción', 'Copiado: %s'],
    it: ['Copia l\'informazione', 'Copiato: %s'],
    fr: ['Copier les informations de titre', '%s copié'],
    'zh-HK': ['複製歌曲信息', '已復制: %s'],
    'zh-TW': ['複製歌曲信息', '已復制: %s'],
    zh: ['复制歌曲信息', '已複製: %s'],
    ar: ['انسخ معلومات الأغنية', '%s :تمّ نسخ'],
    iw: ['העתקת מידע השיר', '%s :הועתק'],
    ru: ['Копировать данные трека', 'Скопирована: %s'],
    id: ['Salin Informasi Lagu', 'Disalin: %s'],
    ms: ['Salin Maklumat Lagu', 'Disalin: %s'],
    de: ['Songinformation kopieren', '%s kopiert'],
    ja: ['曲情報をコピー', '%s をコピーしました'],
    pl: ['Skopiuj informacje o utworze', '%s skopiowano'],
    cs: ['Kopírovat informace o skladbě', '%s byl zkopírován'],
    el: ['Αντιγραφή πληροφοριών τραγουδιού', '%s αντιγράφηκε'],
    hu: ['Dal adat másolása', '%s másolva'],
    tr: ['Şarkı Bilgilerini Kopyala', '%s kopyalandı'],
    th: ['คัดลอกข้อมูลเพลง', '%s ไปที่คลิปบอร์ดแล้ว'],
    vi: ['Sao chép Thông tin Bài hát', '%s đã được sao chép'],
    sv: ['Kopiera sånginfoen', '%s kopierad'],
    nl: ['Info van nummer kopiëren', '%s gekopieerd'],
    en: ['Copy track info', 'Copied: %s']
}
let [menuString, copiedString] = translations.en

const htmlTag = document.querySelector('html[lang]')
if (htmlTag && htmlTag.lang !== 'en' && htmlTag.lang in translations) {
    [menuString, copiedString] = translations[htmlTag.lang]
} else {
    for (const lang in translations) {
    if (navigator.language.startsWith(lang)) {
        [menuString, copiedString] = translations[lang]
        break
    }
    }
}

let showInfoID
const showInfo = function (str) {
    window.clearTimeout(showInfoID)
    if (!document.getElementById('copied_song_info_outer')) {
    document.head.appendChild(document.createElement('style')).innerHTML = `

    #copied_song_info_outer {
        margin: -32px calc(var(--panel-gap)*-1) 0;
        display: grid;
        grid-area: 1/1/now-playing-bar-start/-1;
        pointer-events: none;
        position: relative;
        z-index: 5;
    }

    #copied_song_info_inner {
        margin-bottom: 16px;
        place-self: end center;
        pointer-events: none;
        z-index: 100;
    }

    #copied_song_info_text {
        background: #2e77d0;
        border-radius: 8px;
        -webkit-box-shadow: 0 4px 12px 4px rgba(0,0,0,.5);
        box-shadow: 0 4px 12px 4px rgba(0,0,0,.5);
        color: #fff;
        display: inline-block;
        font-size: 16px;
        line-height: 20px;
        max-width: 450px;
        padding: 12px 36px;
        text-align: center;
        -webkit-transition: none .5s cubic-bezier(.3,0,.4,1);
        transition: none .5s cubic-bezier(.3,0,.4,1);
        transition-property: none;
        -webkit-transition-property: opacity;
        transition-property: opacity;
    }
    `

    const node = $('<div id="copied_song_info_outer"><div id="copied_song_info_inner"><div id="copied_song_info_text"></div></div></div>')

    if (document.querySelector('.Root footer')) {
        $('.Root footer').parent().after(node)
    } else {
        node.appendTo('.Root')
    }
    }
    const copiedSongInfoOuter = $('#copied_song_info_outer')
    const copiedSongInfoText = $('#copied_song_info_text')

    copiedSongInfoOuter.css('display', 'grid')
    copiedSongInfoText.css('opacity', 1)
    copiedSongInfoText.html(str.replace('\n', '<br>\n'))

    showInfoID = window.setTimeout(function () {
    copiedSongInfoText.css('opacity', 0)
    showInfoID = window.setTimeout(function () {
        copiedSongInfoOuter.css('display', 'none')
    }, 700)
    }, 4000)
}

const getSongTitle = function ($titlenodes) {
    let titleText

    if ($titlenodes && $titlenodes.length > 0) {
    titleText = $titlenodes.text()
    if (titleText && titleText.trim()) {
        return titleText.trim()
    }
    }

    if ($('.track-info__name').length > 0) {
    titleText = $('.track-info__name')[0].innerText
    if (titleText && titleText.trim()) {
        return titleText.trim()
    }
    }

    return ''
}

const getArtistName = function ($artistnodes) {
    let artistText

    if (typeof $artistnodes === 'string') {
    return $artistnodes.trim()
    }

    if ($artistnodes) {
    const artistTextNodes = $artistnodes.not((i, e) => e.className)
    if (artistTextNodes.length === 1) {
        artistText = artistTextNodes.text()
        if (artistText && artistText.trim()) {
        return artistText.trim()
        }
    } else if (artistTextNodes.length > 1) {
        artistText = artistTextNodes.map((i, e) => e.textContent.trim()).get()
        artistText = artistText.join(', ')
        return artistText.trim()
    }

    // In playlist:
    if ($artistnodes.find('.ellipsis-one-line').length > 0) {
        artistText = $artistnodes.find('.ellipsis-one-line')[0].innerText
        if (artistText && artistText.trim()) {
        return artistText.trim()
        }
    }
    if ($artistnodes.find('.standalone-ellipsis-one-line').length > 0) {
        artistText = $artistnodes.find('.standalone-ellipsis-one-line')[0].innerText
        if (artistText && artistText.trim()) {
        return artistText.trim()
        }
    }

    // Something else, just accumulate all artist links: <a href="/artist/ARTISTID">Artistname</a>
    if ($artistnodes.find('a[href*="/artist/"]').length > 0) {
        return $.map($artistnodes.find('a[href*="/artist/"]'), (element) => $(element).text().trim()).join(', ')
    }
    }

    if (document.location.pathname.startsWith('/artist/')) {
    if ($('.content.artist>div h1').length > 0) {
        artistText = $('.content.artist>div h1')[0].textContent
        if (artistText && artistText.trim()) {
        return artistText.trim()
        }
    } else {
        if ($('.Root h1').length > 0) {
        artistText = $('.Root h1')[0].textContent
        if (artistText && artistText.trim()) {
            return artistText.trim()
        }
        }
    }
    }

    if (document.location.pathname.startsWith('/album/')) {
    artistText = document.querySelector('.os-content h1').textContent
    if (artistText && artistText.trim()) {
        return artistText.trim()
    }
    }

    if ($('.track-info__artists').length > 0) {
    artistText = $('.track-info__artists')[0].innerText
    if (artistText && artistText.trim()) {
        return artistText.trim()
    }
    }

    return ''
}

const getSearchString = function (trackNode) {
    console.debug('populateContextMenu')
    let $this = $(trackNode)

    let title = $this.find('.tracklist-name')
    if (title.length === 0) {
    title = $this.find('div[data-testid="tracklist-row"] .standalone-ellipsis-one-line')
    }
    if (title.length === 0) {
    title = $this.find('div[role="gridcell"] img').parent().find('.standalone-ellipsis-one-line')
    }
    if (title.length === 0 && $this.hasClass('now-playing')) {
    title = $this.find('.ellipsis-one-line>.ellipsis-one-line').eq(0)
    }
    let artist = $this.find('.artists-album span')
    if (artist.length === 0 && $this.hasClass('now-playing')) {
    artist = $this.find('.ellipsis-one-line>.ellipsis-one-line').eq(1)
    }
    if (artist.length === 0 && title.length === 0 && $this.find('[data-testid="nowplaying-track-link"]')) {
    title = $this.find('[data-testid="nowplaying-track-link"]')
    artist = $this.find('[data-testid="nowplaying-artist"]')
    }
    if (artist.length === 0) {
    if ($this.find('.second-line').length !== 0) {
        artist = $this.find('.second-line') // in playlist
    }
    if ($this.parents('.now-playing').length !== 0) {
        // Now playing bar
        $this = $($this.parents('.now-playing')[0])
        if ($this.find('.ellipsis-one-line a[href*="/artist/"]').length !== 0) {
        artist = $this.find('.ellipsis-one-line a[href*="/artist/"]')
        title = $this.find('a[data-testid="nowplaying-track-link"]')
        }
    }
    if ($this.parents('.Root footer').length !== 0) {
        // New: Now playing bar 2021-09
        $this = $($this.parents('.Root footer')[0])
        if ($this.find('.ellipsis-one-line a[href*="/artist/"],.standalone-ellipsis-one-line a[href*="/artist/"]').length !== 0) {
        artist = $this.find('.ellipsis-one-line a[href*="/artist/"],.standalone-ellipsis-one-line a[href*="/artist/"]')
        title = $this.find('.ellipsis-one-line a[href*="/album/"],.ellipsis-one-line a[href*="/track/"],.standalone-ellipsis-one-line a[href*="/album/"],.standalone-ellipsis-one-line a[href*="/track/"]')
        } else if ($this.find('[data-testid="context-item-info-artist"]').length !== 0) {
        artist = $this.find('a[data-testid="context-item-info-artist"][href*="/artist/"],[data-testid="context-item-info-artist"] a[href*="/artist/"]')
        title = $this.find('[data-testid="context-item-info-title"] a[href*="/album/"],[data-testid="context-item-info-title"] a[href*="/track/"]')
        } else if ($this.find('a[href*="/artist/"],a[href*="/album/"],a[href*="/track/"]').length > 1) {
        artist = $this.find('a[href*="/artist/"]')
        title = $this.find('a[href*="/album/"],a[href*="/track/"]')
        }
    }

    const artistGridCell = $this.find('*[role="gridcell"] a[href*="/artist/"]')
    if (artistGridCell.length > 0) {
        // New playlist design
        artist = artistGridCell.parent()
        title = $(artistGridCell.parent().parent().find('span')[0])
        if (artist.has(title)) {
        // title is child of artist, so it's the same node, the real title is somewhere else
        // This happens on album page
        if (artist.parent().parent().find('div.standalone-ellipsis-one-line').length) {
            title = $(artist.parent().parent().find('div.standalone-ellipsis-one-line')[0])
        }
        }
    }

    const artistContent = $('.content.artist>div h1')
    if (artistContent.length > 0) {
        // Artist page
        artist = artistContent[0].textContent
    }
    const artistPageH1 = $('main>section[data-testid="artist-page"] .contentSpacing h1')
    if (artistPageH1.length > 0) {
        // Artist page
        artist = artistPageH1[0].textContent
    }
    }

    if (artist.length === 0 && document.location.pathname.startsWith('/track/')) {
    // Single track page
    artist = $('section [data-testid="creator-link"][href*="/artist/"]')
    }

    if (title && artist) {
    const titleText = getSongTitle(title)
    const artistText = getArtistName(artist)
    if (!titleText || !artistText) {
        return 'nofound'
    }
    return (artistText + ' ' + titleText)
    }
    return 'not found'
}

setInterval( animate, 1000 );
})();