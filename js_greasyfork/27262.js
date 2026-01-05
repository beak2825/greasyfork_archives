// ==UserScript==
// @name         [WorldWideTorrents.eu] Stream (WebTorrent)
// @namespace    pxgamer
// @version      0.1.1
// @description  Allows the streaming of media on WorldWideTorrents
// @author       pxgamer
// @include      *worldwidetorrents.eu/torrents-details.php?id=*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require      https://cdn.jsdelivr.net/webtorrent/latest/webtorrent.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27262/%5BWorldWideTorrentseu%5D%20Stream%20%28WebTorrent%29.user.js
// @updateURL https://update.greasyfork.org/scripts/27262/%5BWorldWideTorrentseu%5D%20Stream%20%28WebTorrent%29.meta.js
// ==/UserScript==

window.torrentStreamer = {
	cat: null,
	hash: null,
	client: null,
	torr: null,
	init: function() {
		this.cat = $('.category_id_bar').text();
		this.hash = $('.torrent_hash_value').text();
		this.torr = 'https://worldwidetorrents.eu/streamer.php?info_hash=' + this.hash;
		this.client = new WebTorrent();
	},
	append: function() {
		$('#tabContainer div ul.tabs').append('<li><a href="#stream">Media Stream</a></li>');
		$('#tabContainer .tabscontent').append('<div class="tabpage" id="stream"><div id="torrent-stream-media-player"></div></div>');
	},
	setup: function() {
		this.client.add(this.torr, function (torrent) {
			torrent.files[0].appendTo('#torrent-stream-media-player', {'autoplay': false});
		});
	}
};

(function() {
	'use strict';

	window.torrentStreamer.init();
	window.torrentStreamer.append();
	window.torrentStreamer.setup();
})();