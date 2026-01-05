// ==UserScript==
// @name        	Torrent URL to Google Search
// @namespace       https://greasyfork.org/en/scripts/10551-torrent-redirector
// @version     	1.1
// @description 	Redirect url to Google search.
// @author       	euverve/thatskie
// @include         http://*
// @include         https://*
// @exclude         https://greasyfork.org/*
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/10551/Torrent%20URL%20to%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/10551/Torrent%20URL%20to%20Google%20Search.meta.js
// ==/UserScript==

//Block torrent sites
var urls = ['(kickass|torrentz|extratorrent|yify-torrents|bitsnoop|sumotorrent|torrentdownloads|eztv|rarbg|1337x|torrenthound|fenopy|torrentreactor|thepiratebay|thepiratebay|yts|nyaa|isohunt|iptorrents|torrentleech|h33t|torrentproject|yourbittorrent|asiatorrents|what|broadcasthe|revolutiontt|mininova|bt-chat|sceneaccess|torrentus|myanonamouse|animesuki|popcorn|mamega|trancetraffic|bitmetv|blackcats-games|rarbg|torrentsmd|best-torrents|tfile|torrenty|coppersurfer|demonii|openbittorrent|tracker|free-torrents|novafilm|freeexchange|nnm-club|lostfilm|kinostar|friends-torrent|megashara|kinoarena|bit-torrent|rutracker|kinofans-club|kinozal|isohunt|btjunkie|thepiratebay|torrentz|demonoid|bittorrent|kickasstorrents|sumotorrent|extratorrent|torrentportal|torrentbox|torrentspy|bitenova|mybittorrent|alivetorrents|torrentdownloads|youtorrent|vertor|torrentroot|monova|torrent2crazy|torrentbit|torrentzap|h33t|fulldls|entertane|wwpy|seedpeer|torrentscan|torrentmatrix|scrapetorrent|torrents|gpirate|commonbits|flixflux|zoozle|gamestorrents|newtorrents|datorrents|cheggit|torrentfive|bitsoup|torrentbar|btmon|comparebtspot|torrentreactor|bitenova|torrentresource|torrentplaza|tfcomet|ilovetorrents|torrent|torrent-polska|zeropaid|bitlord|imtorrents|vuze|clearbits|tornado|kat|tnlplanet|freebiest|bittorrent|bundlesorrent|bte|bts|jamtothis|limetorrents|ourrelease|overget|panda|publicdomaintorrents|pulltorrent|psychocydd|seedpeer|thunderbytes|tntorrent|toorgle|torlock|torrentbox|torrentfunk|torentilo|truetorrent|vcdq|yts|veoble|torrentoff|torrentbd|thepirate|torcache|btcache)'];
for (var i = 0, len = urls.length; i < len; i++) {
    var regexp = new RegExp(urls[i] + '(\.[a-zA-Z0-1]{2,4})');
    var results = regexp.exec(window.location.href);
    if (document.URL.indexOf('com/search\?q=' + results[0]) != -1) {
        //alert(document.URL); 
				//Found in url 
    } else {
        if (results) {
            var newurl = 'https://www.google.com/search?q=' + results[0]
            window.location.replace(newurl);
        }
    }
}