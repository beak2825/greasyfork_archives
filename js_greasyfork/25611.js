// ==UserScript==
// @name        PTH: embed metadata into torrents
// @description Embeds Schema.org (MusicAlbum) metadata into torrents
// @namespace   BlackNullerNS
// @include     http*://passtheheadphones.me/torrents.php*
// @include     http*://passtheheadphones.me/artist.php?id=*
// @include     http*://passtheheadphones.me/top10.php*
// @version     0.1
// @grant       GM_xmlhttpRequest
// @require     https://greasyfork.org/scripts/13016-bencode-encoder-decoder/code/Bencode%20encoderdecoder.js?version=79776
// @downloadURL https://update.greasyfork.org/scripts/25611/PTH%3A%20embed%20metadata%20into%20torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/25611/PTH%3A%20embed%20metadata%20into%20torrents.meta.js
// ==/UserScript==

var trackerUrl = 'https://' + window.location.hostname + '/';

var downloadHandler = function (e) {
    e.preventDefault();

    var el = this,
        torrentId = el.getAttribute('href').split('action=download&id=')[1].split('&')[0],
        apiUrl = trackerUrl + 'ajax.php?action=torrent&id=' + torrentId,
        downloadUrl = trackerUrl + "torrents.php?action=download&id=" + torrentId,
        releaseData = null, torrentBinary = null;

    console.log(apiUrl);

	GM_xmlhttpRequest({
		url: apiUrl,
		method: 'GET',
        timeout: 10000,
    	ontimeout: function() {
    		alert('Unable to fetch torrent info!');
    	},
    	onerror: function() {
    		alert('Unable to fetch torrent info!');
    	},
		onload: function(response){
            releaseData = JSON.parse(response.responseText).response;
            if (torrentBinary) {
                downloadTorrent(el, torrentBinary, releaseData);
            }
        }
    });

    console.log(downloadUrl);

	GM_xmlhttpRequest({
		url: downloadUrl,
		method: 'GET',
        responseType: "arraybuffer",
        timeout: 10000,
    	ontimeout: function() {
    		alert('Unable to fetch the torrent!');
    	},
    	onerror: function() {
    		alert('Unable to fetch the torrent!');
    	},
		onload: function(response){
            torrentBinary = response.response;
            if (releaseData) {
                downloadTorrent(el, torrentBinary, releaseData);
            }
        }
    });
};

function downloadTorrent(el, binary, release)
{
    if (!binary || !release) return; // waiting for both values
    
    if (!release.group.musicInfo) {
        location.href = trackerUrl + el.getAttribute('href');
        return;
    }

    var str = '';
    var data_str = new Uint8Array(binary);
    for (var i = 0, l = data_str.length; i < l; ++i) {
        str += String.fromCharCode(data_str[i]);
    }

    var torrent = bencode.decode(str);

    torrent.metadata = [makeSchema(release)];

    var uri = "data:application/x-bittorrent;base64," + btoa(bencode.encode(torrent));

    var link = document.createElement("a");    
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = makeFilename(release);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function makeSchema(release)
{
    var schema = {
        '@context': 'http://schema.org',
        '@type': 'MusicAlbum',
        name: unescape(encodeURIComponent(decodeHTML(release.group.name))),
        datePublished: release.group.year
    };

    schema.encoding = {
        '@type': 'AudioObject',
        encodingFormat: release.torrent.format.toLowerCase(),
        bitrate: release.torrent.encoding,
        contentSize: release.torrent.size,
        uploadDate: release.torrent.time
    }

    // Image
    if (release.group.wikiImage) {
        schema.image = release.group.wikiImage;
    }

    // Artists
    if (release.group.musicInfo.artists.length === 1) {
        schema.byArtist = {
            '@type': 'MusicGroup',
            name: unescape(encodeURIComponent(release.group.musicInfo.artists[0].name))
        }
    } else {
        schema.byArtist = {
            '@type': 'ItemList',
            numberOfItems: release.group.musicInfo.artists.length,
            itemListElement: []
        }

        for (var i = 0, l = release.group.musicInfo.artists.length; i < l; i++) {
            schema.byArtist.itemListElement.push({
                '@type': 'MusicGroup',
                name: unescape(encodeURIComponent(release.group.musicInfo.artists[i].name))
            });
        }
    }

    // Release type
    switch (release.group.releaseType) {
        case 1:
        case 5:
        case 9:
            schema.albumProductionType = 'https://schema.org/StudioAlbum';
            break;
        case 3:
            schema.albumProductionType = 'https://schema.org/SoundtrackAlbum';
            break;
        case 6:
        case 7:
            schema.albumProductionType = 'https://schema.org/CompilationAlbum';
            break;
        case 16:
            schema.albumProductionType = 'https://schema.org/MixtapeAlbum';
            break;
        case 17:
            schema.albumProductionType = 'https://schema.org/DemoAlbum';
            break;
        case 19:
            schema.albumProductionType = 'https://schema.org/DJMixAlbum';
            break;
        case 11:
        case 18:
            schema.albumProductionType = 'https://schema.org/LiveAlbum';
            break;
        case 13:
            schema.albumProductionType = 'https://schema.org/RemixAlbum';
            break;
        case 15:
            schema.albumProductionType = 'https://schema.org/SpokenWordAlbum';
            break;
    }

    schema.albumRelease = {
        '@type': 'MusicRelease'
    };

    // Media
    switch (release.torrent.media) {
        case 'CD':
            schema.albumRelease.musicReleaseFormat = 'https://schema.org/CDFormat';
            break;
        case 'Vinyl':
            schema.albumRelease.musicReleaseFormat = 'https://schema.org/VinylFormat';
            break;
        case 'DVD':
            schema.albumRelease.musicReleaseFormat = 'https://schema.org/DVDFormat';
            break;
        case 'WEB':
            schema.albumRelease.musicReleaseFormat = 'https://schema.org/DigitalFormat';
            break;
        case 'Cassette':
            schema.albumRelease.musicReleaseFormat = 'https://schema.org/CassetteFormat';
            break;
    }

    var isReissue = release.torrent.remastered;

    // Reissue date
    if (isReissue && release.torrent.remasterYear) schema.albumRelease.datePublished = release.torrent.remasterYear;

    // Release title
    if (isReissue && release.torrent.remasterTitle) schema.albumRelease.headline = release.torrent.remasterTitle;

    // Label
    var label = isReissue ? release.torrent.remasterRecordLabel : release.group.recordLabel;
    if (label) schema.albumRelease.recordLabel = unescape(encodeURIComponent(decodeHTML(label)));

    // Catalog number
    var catalogNumber = isReissue ? release.torrent.remasterCatalogueNumber : release.group.catalogueNumber;
    if (catalogNumber) schema.albumRelease.catalogNumber = catalogNumber;

    return schema;
}

function makeFilename(release)
{
    return decodeHTML(release.group.musicInfo.artists[0].name + ' - ' + release.group.name + ' - ' + release.group.year + ' (' + release.torrent.media + ' - ' + release.torrent.format + ' - ' + release.torrent.encoding + ').torrent');
}

function decodeHTML(str)
{
    var d = document.createElement('div');
    d.innerHTML = str;
    return d.textContent;
}

var i, links = document.querySelectorAll('a[href*="action=download"]');

for (i = 0, l = links.length; i < l; i++) {
    links.item(i).addEventListener('click', downloadHandler);
}