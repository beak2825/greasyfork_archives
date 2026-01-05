// ==UserScript==
// @name         Complete 163 Music Dl Helper
// @namespace    org.xryl.music.163
// @version      1.3
// @description  Download music from music.163.com
///
//               火狐匹配地址
// @include      http://music.163.com/#*
///
//               TamperMonkey 匹配地址
// @include      http://music.163.com/
///
// @copyright    2014+, Jixun.Moe, 2015+, X-Ryl669
// @run-at       document-start
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/10456/Complete%20163%20Music%20Dl%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/10456/Complete%20163%20Music%20Dl%20Helper.meta.js
// ==/UserScript==


(function () {
	// I love prototype.
	String.prototype.format = function () {
		var $arg = arguments,
			$len = $arg.length;
		return this.replace (/\{(\d+)\}/g, function (z, num) {
			num = parseInt (num);
			if (num < $len) {
				return $arg[num];
			} else {
				return z;
			}
		});
	};

    var $format = '{0}.[{1}] {2} - {3}'; // 0 is song index, 1 is album name, 2 is artist, 3 is song title

	var $bank = {};
	var $dlBtn = document.createElement ('a');
	$dlBtn.setAttribute ('target', '_blank');
	$dlBtn.setAttribute ('style', 'font-size:small;width:3em;left:initial;right:40px');
	$dlBtn.className = 'lytit';
	$dlBtn.textContent = 'down';
	$dlBtn.addEventListener ('click', function (e) {
		var $addr = this.getAttribute ('href');
        GM_download($addr, this.getAttribute('download'));
        e.preventDefault();
		e.stopPropagation ();
	}, false);
	var $dlAllBtn = document.createElement ('a');
	$dlAllBtn.setAttribute ('target', '_blank');
	$dlAllBtn.setAttribute ('style', 'font-size:small;width:3em;left:initial;right:80px');
	$dlAllBtn.className = 'lytit';
	$dlAllBtn.textContent = 'all';
	$dlAllBtn.addEventListener ('click', function (e) {
        var downOne = function(i) {
            console.log("Downloading '"+$playlist[i].name+"' from : "+$playlist[i].url);
            var detail = { url: $playlist[i].url, 
                           name: $playlist[i].name.replace(/\?/g, '\uFE56') + '.mp3', 
                           onload: function() { if ($playlist.length > i+1) setTimeout(function(){downOne(i+1);}, Math.random()*3000 + 3000); } 
                         };
            GM_download(detail);
        };
        if ($playlist.length) downOne(0);
        e.preventDefault();
		e.stopPropagation ();
	}, false);
    
    var $lastAlbum = '';
    var $playlist = [];

	var _updDownloadUrl = function (songId) {
		var $song = $bank[songId.toString()];
        var $info = $format.format (("0" + $song.index).slice(-2), $song.album, $song.artist, $song.name);
		console.info ('%s\n%s', $info, $song.url);
        
		$dlBtn.setAttribute ('title', 'Song: ' + $info);
        $dlBtn.setAttribute ('download', $info+'.mp3');
		$dlBtn.setAttribute ('href', $song.url);
	};
    
    var _mergeArtists = function(artists) {
        return artists.map(function (artist) {
				return artist.name;
		}).join (' & ');
    };

	var _addBank = function (songObj) {
        // Empty upon new album detection
        if (songObj.album.name != $lastAlbum) $bank = {};
        $lastAlbum = songObj.album.name;
		$bank[songObj.id.toString()] = {
			name: songObj.name,
			album: songObj.album.name,
			artist: _mergeArtists(songObj.artists),
			
			url: songObj.mp3Url,
            index: (Object.keys($bank).indexOf(songObj.id) == -1 ? Object.keys($bank).length : Object.keys($bank).indexOf(songObj.id)) + 1
		};
	};

    var _processURL = function($id, url) {
        if ($id == null) return;
        if ($bank.hasOwnProperty($id)) {
            _updDownloadUrl ($id);
        } else {
            // First, search through local cache.
            var cacheSongObj;
            try {
                cacheSongObj = JSON.parse(localStorage['track-queue']).filter (function (s) {
                    _addBank (s);
                    return $id == s.id.toString();
                });
            } catch (err) { }

            if (cacheSongObj) {
                console.info ('Music found from cache.');
                _updDownloadUrl (cacheSongObj.id);
            } else {
                console.info ('Requesting song information...');
                var $http = new window.XMLHttpRequest ();
                $http.onreadystatechange = function() {};
                $http.open(method, '/api/song/detail/?id=' + $id + '&ids=%5B' + $id + '%5D&csrf_token=' + url.match(/csrf_token=([^&]*)/)[1]);
                $http.send ();
            }
        }
    };

	window.XMLHttpRequest.prototype.oldOpen = window.XMLHttpRequest.prototype.open;
	window.XMLHttpRequest.prototype.open = function (method, url) {
		console.info ('[REQ] %s: %s', method, url);
		
        if (url.indexOf('/weapi/album/') != -1) {
			try {
				var $this = this;
				var bkReadystatechange = this.onreadystatechange;
				this.onreadystatechange = function (e) {
					if ($this.readyState === 4) {
						var album = JSON.parse($this.responseText.trim());
                        $playlist = [];
                        for (var i = 0; i < album.album.songs.length; i++) {
                            $playlist.push({
                                             url: album.album.songs[i].mp3Url, 
                                             name: $format.format (("0" + (i+1)).slice(-2), album.album.name, _mergeArtists(album.album.songs[i].artists), album.album.songs[i].name),
                                           });
                        }
                        console.log("Captured complete playlist for '"+album.album.name+"' " + $playlist.length+" tracks");
					}
					
					return bkReadystatechange.apply (this, arguments);
				};
			} catch (err) {
				console.error (err);
			}
        } else if (!url.indexOf('/api/song/media') || !url.indexOf('/api/song/lyric') || !url.indexOf('/weapi/song/lyric')) {
			console.log ('Check $bank...');
			
            var $id = url.indexOf('/api/song/media') === 0 ? url.match (/\d+/)[0] : 
                      url.indexOf('/api/song/lyric') === 0 ? url.match(/id=(\d+)/)[1] : 0;
            if (!url.indexOf('/weapi/song/lyric')) { 
                // Due to new change in their API, the ID is for the song no more part of the URL
                // So, let's extract from the page itself, AFTER it's refreshed
                setTimeout(function() { $id = document.querySelector("a.f-thide.name").getAttribute("href").match(/id=(\d+)/)[1]; _processURL($id, url); }, 2000);
            } else {
                _processURL($id, url);
            }
		} else if (-1 != url.indexOf('/api/song/detail')) {
			try {
				var $this = this;
				var bkReadystatechange = this.onreadystatechange;
				this.onreadystatechange = function (e) {
					if ($this.readyState === 4) {
						JSON.parse($this.responseText.trim()).songs.forEach(function (e) {
							_addBank (e);
							_updDownloadUrl (e.id);
						});
					}
					
					return bkReadystatechange.apply (this, arguments);
				};
			} catch (err) {
				console.error (err);
			}
        }
		
		return this.oldOpen.apply(this, arguments);
	};

	(function () {
		var $t;
		var vv = setInterval (function () {
			if (!($t = document.querySelector ('.lytit')))
				return ;
			clearInterval (vv);
			
			$t.style.maxWidth = '302px';
			$t.parentNode.insertBefore ($dlBtn, $t.nextElementSibling);
			$t.parentNode.insertBefore ($dlAllBtn, $t.nextElementSibling);
		}, 200);
	})();

})();
