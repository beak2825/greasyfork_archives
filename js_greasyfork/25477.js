// ==UserScript==
// @name        Gazelle Autofiller
// @description Automatically fills a Gazelle form
// @namespace   BlackNullerNS
// @include     http*://passtheheadphones.me/upload.php*
// @include     http*://www.passtheheadphones.me/upload.php*
// @include     http*://apollo.rip/upload.php*
// @include     http*://www.apollo.rip/upload.php*
// @include     http*://baconbits.org/upload.php*
// @include     http*://www.baconbits.org/upload.php*
// @version     0.2.10
// @require     https://greasyfork.org/scripts/13016-bencode-encoder-decoder/code/Bencode%20encoderdecoder.js?version=79776
// @require     https://greasyfork.org/scripts/13017-rusha/code/Rusha.js?version=79803
// @downloadURL https://update.greasyfork.org/scripts/25477/Gazelle%20Autofiller.user.js
// @updateURL https://update.greasyfork.org/scripts/25477/Gazelle%20Autofiller.meta.js
// ==/UserScript==

String.prototype.trimChar = function(chr) {
    var str = this;

    while(str.charAt(0) == chr) {
        str = str.substring(1);
    }

    while(str.charAt(str.length-1) == chr) {
        str = str.substring(0, str.length-1);
    }

    return str;
};

var Torrent = function(binaryString)
{
    var self = this,
        uniqueStringChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        mimeType = "application/x-bittorrent",
        data = bencode.decode(binaryString),
        originalAnnounceUrl = "announce" in data ? data.announce : "",

        calculateHash = function() {
            return new Rusha().digestFromBuffer(bencode.encode(data.info)).toUpperCase();
        },

        originalHash = calculateHash(),
        hash = originalHash;

    self.getBinary = function() {
        return bencode.encode(data);
    };

    self.getName = function() {
        return decodeURIComponent(escape(data.info.name));
    };

    self.setAnnounceUrl = function(value) {
        data.announce = value;
        return this;
    };

    self.getAnnounceUrl = function() {
        return data.announce;
    };

    self.getOriginalAnnounceUrl = function() {
        return originalAnnounceUrl;
    };

    self.getHash = function() {
        return hash;
    };

    self.getOriginalHash = function() {
        return originalHash;
    };

    var randomString = function (length) {
        var text = "";

        for (var i = 0; i < length; i++) {
            text += uniqueStringChars.charAt(Math.floor(Math.random() * uniqueStringChars.length));
        }

        return text;
    };

    self.changeHash = function() {
        data.info.private = 1;
        data.info.unique = randomString(30);
        hash = calculateHash();
        return hash;
    };

    self.getDownloadLink = function(text) {
        var a = document.createElement("a");
        a.setAttribute("href", "javascript:void(0);");
        a.textContent = text ? text : hash;
        a.style.cursor = "pointer";
        a.onclick = self.downloadTorrent;

        return a;
    };

    self.downloadTorrent = function(){
        var uri = "data:application/x-bittorrent;base64," + btoa(bencode.encode(data));

        var link = document.createElement("a");
        link.href = uri;
        link.style = "visibility:hidden";
        link.download = self.getName() + ".torrent";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return false;
    };

    self.countFiles = function(){
        return data.info.files ? data.info.files.length : 0;
    };

    self.getFiles = function() {
        return data.info.files ? data.info.files : [];
    };

    self.getTrackerId = function() {
        return originalAnnounceUrl.split('://')[1].split('/')[0].split(':')[0].replace(/^tracker\./, "").replace(/^please\./, "");
    };

    self.getTotalSize = function() {
        var files = data.info.files;
        var size = 0;

        if (files && files instanceof Array) {
            for (var i = 0, file; file = files[i]; i++) {
                if (file.length) {
                    size += file.length;
                }
            }
        }

        return size;
    };

    self.getBlob = function() {
        var i, l, array,
            binary = self.getBinary();

        l = binary.length;
        array = new Uint8Array(l);

        for (i = 0; i < l; i++){
            array[i] = binary.charCodeAt(i);
        }

        return new Blob([array], {type: mimeType});
    }
};


(function()
{
    var self = this;
    var fileInput = document.querySelector("input[type='file']");

    if (!fileInput) {
        console.log("File input not found.");
        return;
    }

    self.input = fileInput;
    self.form = self.input.closest("form");
    self.host = document.location.href.split('://')[1].split('/')[0].split(':')[0].replace(/^(www|tls|ssl)\./, "");
    self.formats = {
        flac: 'FLAC',
        mp3: 'MP3',
        ogg: 'Ogg Vorbis',
        m4a: 'AAC'
    };
    self.bitrates = ['192','256','320','V0','V1','V2'];

    fileInput.addEventListener("change", function(ev) {
        if (!ev.target.files || ev.target.files[0].name.toLowerCase().indexOf(".torrent") === -1) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            self.addTorrent(e.target.result);
        };
        reader.readAsBinaryString(ev.target.files[0]);
    });

    self.addTorrent = function(binaryString)
    {
        try {
            self.analyze(new Torrent(binaryString));
        } catch (e) {
            console.log(e);
        }
    };

    self.analyze = function(torrent) {

        var i, l, ext, format, media, bitrate, year, artist, album, releaseType,
            torrentName = torrent.getName(),
            torrentNameLc = torrentName.toLowerCase(),
            files = torrent.getFiles();

        for (i = 0, l = files.length; i < l; i++) {
            ext = self.getExtension(files[i].path[0]);

            if (self.formats.hasOwnProperty(ext)) {
                format = self.formats[ext];
            }

            if (ext === 'cue') {
                media = 'CD';
            }
        }

        var segments = torrentName.split(/(\s+(-|–)\s+|[\{\}\[\]]{1}|\(|\)|_)/g)
            .map(function (val) {
                if (typeof val !== "string") {
                    return '';
                }
                return val.trim()
                    .trimChar('(')
                    .trimChar(')')
                    .trimChar('[')
                    .trimChar(']')
                    .trimChar('{')
                    .trimChar('}')
                    .trimChar('-')
                    .trimChar('–')
                    .trim();
            })
            .filter(function (val) {
                return val && !self.isYear(val) && !self.isFormat(val) && !self.isBitrate(val);
            });

        var nonAlbumData = ' ' + segments.slice(2).join(' - ').toLowerCase() + ' ';

        album = segments[1] ? segments[1] : segments[0];
        artist = segments[1] ? segments[0] : null;

        var yearMatch = torrentName.match(/\D*([\d]{4})\D*/i);
        if (yearMatch) {
            self.setYear(yearMatch[1]);
        }

        if (!media) {
            if (torrentName.indexOf('WEB') > -1 || torrentNameLc.indexOf('bandcamp') > -1 || torrentNameLc.indexOf('qobuz') > -1 || torrentNameLc.indexOf('beatport') > -1) {
                media = 'WEB';
            } else if (nonAlbumData.indexOf('vinyl') > -1 || nonAlbumData.indexOf('180g') > -1 || nonAlbumData.indexOf('200g') > -1) {
                media = 'Vinyl';
            } else if (torrentName.indexOf('SACD') > -1) {
                media = 'SACD';
            }
        }

        if (format === 'FLAC') {
            bitrate = 'Lossless';
        } else {
            var bitrateMatch = torrentName.match(/\D*(192|256|320|V0|V1|V2)\D*/i);
            if (bitrateMatch) bitrate = bitrateMatch[1];
        }

        // Release type
        if (nonAlbumData.indexOf(' single ') > -1) {
            releaseType = 'Single';
        } else if (nonAlbumData.indexOf(' ep ') > -1) {
            releaseType = 'EP';
        } else if (artist && (artist === 'VA' || artist === 'Various Artists')) {
            releaseType = 'Compilation';
        } else if (torrentNameLc.indexOf(' ost ') > -1 || torrentNameLc.indexOf('soundtrack') > -1) {
            releaseType = 'Soundtrack';
        } else if (nonAlbumData.indexOf(' live ') > -1 || torrentNameLc.indexOf('live in ') > -1 || torrentNameLc.indexOf('live at ') > -1) {
            releaseType = 'Live album';
        } else {
            var trackCount = self.getMediaFiles(torrent).length;
            if (trackCount > 5) {
                releaseType = 'Album';
            } else if (trackCount === 4 || trackCount === 5) {
                releaseType = 'EP';
            } else {
                releaseType = 'Single';
            }
        }

        // Release description
        self.generateReleaseDesc(self.getTracks(torrent));
        
        if (artist) self.setArtist(artist);
        if (album) self.setAlbum(album);
        if (releaseType) self.setReleaseType(releaseType);
        if (format) self.setFormat(format);
        if (media) self.setMedia(media);
        if (bitrate) self.setBitrate(bitrate);
    };

    self.setArtist = function (artist) {
        document.getElementById('artist').value = artist;
    };

    self.setAlbum = function (album) {
        document.getElementById('title').value = album;
    };

    self.setYear = function (year) {
        if (self.isYear(year)) {
            document.getElementById('year').value = year;
        }
    };

    self.setFormat = function (format) {
        var el = document.getElementById('format');
        el.value = format;
        var event = document.createEvent("HTMLEvents");
        event.initEvent("change", true, true);
        event.eventName = "change";
        el.dispatchEvent(event);
    };

    self.setReleaseType = function (type) {
        document.getElementById('releasetype').value = document.evaluate("//select[@id='releasetype']/option[contains(., '" + type + "')]", document, null, XPathResult.ANY_TYPE, null).iterateNext().getAttribute('value');
    };

    self.setMedia = function (media) {
        document.getElementById('media').value = media;
    };

    self.setBitrate = function (bitrate) {
        if (bitrate[0].toUpperCase() === 'V') {
            bitrate = bitrate.toUpperCase() + ' (VBR)';
        }

        document.getElementById('bitrate').value = bitrate;
    };

    self.isYear = function (year) {
        try {
            year = parseInt(year);
            return (year > 1948 && year < new Date().getFullYear() + 1);
        } catch (e) {}
    };

    self.isFormat = function (format) {
        return self.formats.hasOwnProperty(format.toLowerCase());
    };

    self.isBitrate = function (bitrate) {
        return self.bitrates.indexOf(bitrate) > -1;
    };

    self.getMediaFiles = function (torrent) {
        return torrent.getFiles().filter(function (file) {
            return self.formats.hasOwnProperty(self.getExtension(file.path[file.path.length - 1]));
        });
    };

    self.getTracks = function (torrent) {
        var files = self.getMediaFiles(torrent);

        var medium, tracklist = {};
        for (var i = 0, l = files.length; i < l; i++) {
            medium = files[i].path.length - 2 < 0 ? '' : files[i].path[files[i].path.length - 2];
            if (!tracklist[medium]) tracklist[medium] = [];
            tracklist[medium].push(files[i].path[files[i].path.length - 1]);
        }

        var media = Object.keys(tracklist).sort();

        for (medium in tracklist) {
            tracklist[medium].sort(function (a, b) {
                return a < b ? -1 : 1;
            });
            tracklist[medium] = tracklist[medium].map(function (file) {
                return '[#]' + decodeURIComponent(escape(file)).replace(/^[\d\-\(\)\[\]]+\.?\s*\-?/, '').replace(/\.([a-zA-Z0-9]+)$/, '').trim();
            });
        }

        return tracklist;
    };

    self.generateReleaseDesc = function (tracklist) {
        var desc = "[size=3][b]Tracklist:[/b][/size]\n",
            media = Object.keys(tracklist);

        if (media.length === 1) {
            desc += tracklist[media[0]].join("\n");
        } else {
            media.sort();
            desc += "\n";
            for (i = 0, l = media.length; i < l; i++) {
                desc += "[b]" + (media[i] ? media[i] : 'CD1')  + "[/b]\n" + tracklist[media[i]].join("\n") + "\n\n";
            }
        }

        document.getElementById('album_desc').value = desc.trim();
    };

    self.getExtension = function (path) {
        var ext = path.split('.');
        return ext[ext.length - 1].toLowerCase();
    };
})();