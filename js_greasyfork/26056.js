// ==UserScript==
// @name        Gazelle Autofiller
// @description Automatically fills a Gazelle form, to be used with torrent files that have a very specific filename structure
// @namespace   shurelia
// @include     http*://passtheheadphones.me/upload.php*
// @include     http*://apollo.rip/upload.php*
// @include     http*://notwhat.cd/upload.php*
// @include     http*://hydra.zone/upload.php*
// @version     0.2.3
// @require     https://greasyfork.org/scripts/13016-bencode-encoder-decoder/code/Bencode%20encoderdecoder.js?version=79776
// @require     https://greasyfork.org/scripts/13017-rusha/code/Rusha.js?version=79803
// @downloadURL https://update.greasyfork.org/scripts/26056/Gazelle%20Autofiller.user.js
// @updateURL https://update.greasyfork.org/scripts/26056/Gazelle%20Autofiller.meta.js
// ==/UserScript==

if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

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
    var fileInput = document.getElementById("file");

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

    fileInput.addEventListener("change", function(ev) {
        if (ev.target.files[0].name.toLowerCase().indexOf(".torrent") === -1) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            self.addTorrent(e.target.result, ev.target.files[0].name);
        };
        reader.readAsBinaryString(ev.target.files[0]);
    });

    self.addTorrent = function(binaryString, filename)
    {
        try {
            self.analyze(new Torrent(binaryString), filename);
        } catch (e) {
            console.log(e);
        }
    };

    self.analyze = function(torrent, filename) {
        console.log(filename)
        var i, l, ext, format, media, bitrate, year, artist, album,
            torrentName = torrent.getName(),
            files = torrent.getFiles();

        var seg = filename.replace(/\).*?\.torrent/gi, "");
        seg = filename.split(/\s\(|\s-\s/g);
        artist = seg[0];
        bitrate = "Lossless";
        format = seg[seg.length-2];
        media = seg[seg.length-3];
        year = seg[seg.length-4];
        console.log(year);
        album = ""
        for (var i = 1; i<seg.length-4; i++) {
            if (i > 1) { album += " - "; }
            album += seg[i];
        }
        
        if (format === 'FLAC') {
            document.getElementById('upload_logs').className = "";
        }
        
        self.generateReleaseDesc(torrent);
        
        if (artist) {
            self.setArtist(artist);
        }

        if (album) {
            self.setAlbum(album);
        }

        if (format) {
            self.setFormat(format);
        }

        if (media) {
            self.setMedia(media);
        }

        if (bitrate) {
            self.setBitrate(bitrate);
        }
        
        if (year) {
            self.setYear(year);
        }
    };

    self.setArtist = function (artist) {
        document.getElementById('artist').value = artist;
    };

    self.setAlbum = function (album) {
        document.getElementById('title').value = album;
    };

    self.setYear = function (year) {
        document.getElementById('year').value = year;
    };

    self.setFormat = function (format) {
        document.getElementById('format').value = format;
    };

    self.setMedia = function (media) {
        document.getElementById('media').value = media;
    };

    self.setBitrate = function (bitrate) {
        document.getElementById('bitrate').value = bitrate;
    };

    self.generateReleaseDesc = function (torrent) {
        var tracks = [], files = torrent.getFiles();

        for (var i = 0, l = files.length; i < l; i++) {
            ext = files[i].path[0].split('.').last().toLowerCase();
            if (!self.formats.hasOwnProperty(ext)) continue;
            tracks.push('[#]' + files[i].path[0].replace(/^[\d\(\)\[\]]+\.?\s*\-?/, '').replace(/\.([a-zA-Z0-9]+)$/, '').trim());
        }

        document.getElementById('album_desc').value = "[size=2][b]Tracklist:[/b][/size]\n" + tracks.join("\n");
    };
})();