// ==UserScript==
// @name           Spotify Links On iTunes
// @description    Add a Spotify link and embedded player on iTunes album/artist pages
// @author         mirka
// @include        https://itunes.apple.com/*/artist/*
// @include        https://itunes.apple.com/artist/*
// @include        https://itunes.apple.com/*/album/*
// @include        https://itunes.apple.com/album/*
// @namespace      http://jaguchi.com
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @connect        jaguchi.com
// @connect        spotify.com
// @version        4.0.3
// @downloadURL https://update.greasyfork.org/scripts/19252/Spotify%20Links%20On%20iTunes.user.js
// @updateURL https://update.greasyfork.org/scripts/19252/Spotify%20Links%20On%20iTunes.meta.js
// ==/UserScript==

(function () {

	/*=========================================
		 User preferences
	===========================================*/

	// Set this to false if you want the Spotify link to open in the Web Player
	var open_in_app = true;

	/*=========================================
		 User preferences (Advanced)
	===========================================*/

	// To use your own credentials, change `use_own_credentials` to true
	// and set your Client ID and Secret below.
	// (Register an application at https://developer.spotify.com/my-applications
	// to get your own credentials to authenticate directly with the Spotify API)
	var use_own_credentials = false;
	var client_id = "";
	var client_secret = "";


	/*=========================================
		 Shared variables
	===========================================*/

	var spotify_btn_id = "spotify-btn";
	var access_token;

	/*=========================================
		 Link insertion handlers
	===========================================*/

	function insertSpotifyBtn(options) {
		var $target = $(".we-button__app-text").closest("button");
		var $btn = $("<a />", {
			href: options.uri,
			id: spotify_btn_id,
			class: "we-button we-button--outlined we-button--external",
			html: "<span class='we-button__app-text'>Spotify </span>",
			css: {
				marginLeft: "6px",
				textDecoration: "none",
			},
		});

		$btn.attr("aria-label", $target.text().replace("Apple Music", "Spotify"));

		if (options.search) {
			$btn.text("Search on Spotify ");
			$btn.attr("title", "Search on Spotify");
			$btn.attr("aria-label", "Search on Spotify");
		}

		GM_addStyle("#" + spotify_btn_id +
			" { color: #29d264; border-color: #29d264; }");

		$target.wrap("<div />"); // Work around for flexbox on Artist page
		$btn.insertAfter($target);
	}

	/*=========================================
		 Spotify search handlers
	===========================================*/

	function getAlbumData() {
		var data = $('script[name="schema:music-album"]').text();
		var parsed_data = $.parseJSON(data);
		return {
			title: parsed_data.name,
			artist: parsed_data.byArtist.name,
		};
	}

	function getArtist() {
		var data = $('script[name="schema:music-group"]').text();
		return $.parseJSON(data).name;
	}

	function searchAlbum(is_alt_query) {
		var album_data = getAlbumData();
		var album = album_data.title;
		var artist = album_data.artist;

		var album_excludes = ["live", "remastered", "compilation", "original (motion picture )?soundtrack", "bonus track version", "(deluxe|exclusive|expanded|revised) (version|edition)", "(music|soundtrack) from the (motion picture|film score)", "feat\. .+"];
		var character_regex = /[:&,/()]/g;
		var album_regex;
		var query;

		if (is_alt_query) {
			album_regex = new RegExp("\\((" + album_excludes.join("|") + ")\\)", "ig");
			album = album.replace(album_regex, "");
			album = album.replace(/\[.+\]/, ""); // remove bracketed fragment
			album = album.replace(/(- (single|ep))$/i, "");
			album = album.replace(/(version|edition)\)/i, "");
			album = album.replace(character_regex, " ");

			if (/,|&/.test(artist)) {
				artist = artist.match(/^(.+?)(,|&)/)[1]; // extract first fragment
			}
			artist = artist.replace(character_regex, "");
			query = album + " " + artist;
		} else {
			query = "album:\"" + album + "\"" + " artist:\"" + artist + "\"";
		}

		searchSpotify(query, "album", is_alt_query);
	}

	function searchArtist() {
		var artist = getArtist();
		var query = "artist:\"" + artist + "\"";
		searchSpotify(query, "artist");
	}

	function searchSpotify(query, type, is_alt_query) { // type = "album" or "artist"
		var params = {
			q: query,
			type: type,
			limit: 1,
		};
		var apiUrl = "https://jaguchi.com/spotify-links-on-itunes/search";
		var headers = {};

		if (use_own_credentials) {
			headers = { "Authorization": "Bearer " + access_token };
			apiUrl = "https://api.spotify.com/v1/search";
		}

		GM_xmlhttpRequest({
			method: "GET",
			url: apiUrl + "?" + $.param(params),
			headers: headers,
			onload: function (result) {
				var obj = JSON.parse(result.responseText);
				var match_count = obj[type + "s"].total;
				var app_uri, external_uri;
				var btn_options;

				if (match_count == 0) {
					if (type == "album" && !is_alt_query) {
						searchAlbum(true); // try an alternative query
						return;
					}
				} else { // at least one match
					app_uri = obj[type + "s"].items[0].uri;
					external_uri = obj[type + "s"].items[0].external_urls.spotify;
				}

				btn_options = prepareBtnOptions(app_uri, external_uri);
				insertSpotifyBtn(btn_options);
			}
		});

		// Choose appropriate uri, or build search uri if no matches found
		function prepareBtnOptions(app_uri, external_uri) {
			var uri = open_in_app ? app_uri : external_uri;
			var query_str = encodeURIComponent(query);
			var is_search = false;

			if (!uri) {
				// Build search uri
				is_search = true;
				if (open_in_app) {
					uri = "spotify:search:" + query_str;
				} else {
					uri = "https://open.spotify.com/search/results/" + query_str;
				}
			}

			return {
				uri: uri,
				search: is_search,
			};
		}
	}

	/*=========================================
		 Page type (album/artist) detection
	===========================================*/

	if (use_own_credentials) {
		getAccessToken();
	} else {
		main();
	}

	function main() {
		detectPageAndRun();
		setMutationObserver(detectPageAndRun);
	}

	function detectPageAndRun() {
		if ( /\/album\//.test(window.location.pathname) ) {
			searchAlbum();
		} else {
			searchArtist();
		}
	}

	function setMutationObserver(callback) {
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				var el = mutation.target;
				if (mutation.oldValue && el.tagName == "LINK" && el.rel == "canonical") {
					$("#" + spotify_btn_id).remove();
					callback();
				}
			});
		});
		var options = {
			attributes: true,
			attributeOldValue: true,
			subtree: true,
		};
		observer.observe(document.querySelector("head"), options);
	}

	function getAccessToken() {
		GM_xmlhttpRequest({
			method: "POST",
			url: "https://accounts.spotify.com/api/token",
			data: "grant_type=client_credentials",
			headers: {
				"Authorization": "Basic " + btoa(client_id + ":" + client_secret),
				"Content-Type": "application/x-www-form-urlencoded",
			},
			onload: function (result) {
				access_token = JSON.parse(result.responseText).access_token;
				if (access_token) {
					main();
				} else {
					console.log("Spotify API Authentication error: " + result.responseText);
				}
			}
		});
	}

})();
