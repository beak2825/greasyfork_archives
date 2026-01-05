// ==UserScript==
// @name        IMDb+
// @namespace	https://greasyfork.org/ru/users/19952-xant1k-bt
// @description Add external search links most popular torrent sites to IMDb. Every feature can be enabled/disabled in settings.
// @include     http://www.imdb.com/title/tt*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @version     1.0
// @author      Sergiu Negara
// @license     The MIT License (MIT)
// @downloadURL https://update.greasyfork.org/scripts/13829/IMDb%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/13829/IMDb%2B.meta.js
// ==/UserScript==

jQuery(document).ready(function($) {
	var m = {};
	m.Id = getMovieId();
	m.Tt = getMovieTt();
	m.TtYr = getMovieTt() + "+" + getMovieYr();
	var l = {};
	// Info
	l.kp = ["Kinopoisk", "http://www.kinopoisk.ru/index.php?first=yes&kp_query=" + m.Tt, "http://www.kinopoisk.ru/favicon.ico"];
	// TV Series
	l.btn = ["Broadcast", "https://broadcasthe.net/torrents.php?imdb=tt" + m.Id, "https://broadcasthe.net/favicon.ico"];
	l.btv = ["BitmeTV", "http://www.bitmetv.org/browse.php?search=" + m.TtYr, "https://i.imgur.com/qCecxho.png"];
	// All
	l.rt = ["RuTracker", "http://rutracker.org/forum/tracker.php?nm=" + m.TtYr, "http://rutracker.org/favicon.ico"];
	l.kg = ["Karagarga", "https://karagarga.net/browse.php?search_type=imdb&search=" + m.TtYr, "https://karagarga.net/favicon.ico"];
	l.cg = ["Cinemageddon", "http://cinemageddon.net/browse.php?search=" + m.TtYr, "http://cinemageddon.net/favicon.ico"];
	l.ct = ["Cinematik", "http://cinematik.net/browse.php?search=" + m.TtYr, "http://cinematik.net/favicon.ico"];
	l.ptp = ["PassThePopcorn", "https://tls.passthepopcorn.me/torrents.php?searchstr=" + m.TtYr, "https://tls.passthepopcorn.me/favicon.ico"];
	l.kz = ["Kinozal", "http://kinozal.tv/browse.php?s=" + m.TtYr, "http://kinozal.tv/favicon.ico"];
	l.rr = ["Rutor", "http://ru-tor.net/search/" + m.TtYr, "http://ru-tor.net/favicon.ico"];
	l.nnm = ["NNMClub", "http://nnm-club.me/forum/tracker.php?nm=" + m.TtYr, "http://nnm-club.me/favicon.ico"];
	l.x264 = ["x264", "http://x264.me/browse.php?search=" + m.TtYr, "http://x264.me/favicon.ico"];
	l.adc = ["AsiaDVDClub", "http://asiandvdclub.org/browse.php?search=" + m.TtYr, "http://asiandvdclub.org/favicon.ico"];
	// HD
	l.hdb = ["HDBits", "https://hdbits.org/browse.php?search=" + m.TtYr, "https://hdbits.org/favicon.ico"];
	l.hdc = ["HDClub", "http://hdclub.org/browse.php?search=" + m.TtYr, "http://hdclub.org/favicon.ico"];
	l.hdt = ["HDTracker", "http://hdtracker.me/browse.php?search=" + m.TtYr, "http://hdtracker.me/favicon.ico"];
	l.chd = ["CHD", "https://chdbits.org/torrents.php?search=" + m.TtYr, "https://chdbits.org/favicon.ico"];
	l.hdw = ["HDWinG", "https://hdwing.com/browse.php?search=" + m.TtYr, "http://hdwing.com/favicon.ico"];
	l.hds = ["HDSpain", "https://www.hd-spain.com/browse.php?" + m.TtYr, "https://www.hd-spain.com/favicon.ico"];
	l.shd = ["SceneHD", "https://scenehd.org/browse.php?search=" + m.TtYr, "http://scenehd.org/favicon.ico"];
	l.bhd = ["BitHDTV", "https://www.bit-hdtv.com/torrents.php?search=" + m.TtYr, "https://www.bit-hdtv.com/favicon.ico"];
	l.ahd = ["AwesomeHD", "https://awesome-hd.net/torrents.php?searchstr=" + m.TtYr, "https://awesome-hd.net/favicon.ico"];
	// Functions
	function getMovieId() {
		var id = location.pathname.match(/title\/tt(.*?)\//i)[1];
		return id;
	}

	function getMovieTt() {
		var title = document.title.replace(/^(.+) \((.*)([0-9]{4})(.*)$/gi, '$1');
		return encodeURIComponent(title);
	}

	function getMovieYr() {
		var year = document.title.replace(/^(.+) \((.*)([0-9]{4})(.*)$/gi, '$3');
		return encodeURIComponent(year);
	}

	function IMDbPlusStyle() {
		var s = '#title-overview-widget #IMDbPlus { padding: 5px 0 0 230px; }' + '#title-overview-widget #IMDbPlus a { margin: 5px 1px; }' + '#title-overview-widget #IMDbPlus #IMDbPlus-Feature-Settings { margin-left: 1px; }' + '#action-box #IMDbPlus #IMDbPlus-Feature-Settings { margin-top: 10px; }' + '#IMDbPlus-SettingsBox { display: none; margin-left: -404px; padding: 20px; position: absolute; top: 10%; left: 50%; width: 768px; z-index: 999; }' + '#IMDbPlus-SettingsBox > h2 { font-size: 21px }' + '#IMDbPlus-SettingsBox #IMDbPlus-Options { margin: 20px 0;}' + '#IMDbPlus-SettingsBox #IMDbPlus-Options .IMDbPlus-OptionField label { display: inline-block; width: 150px; }' + '#IMDbPlus-SettingsBox button { margin: 8px 0 0; }' + '#IMDbPlus-SettingsBox #IMDbPlus-SettingsBox-Close { float: right; }';
		GM_addStyle(s);
	}

	function IMDbPlusInit() {
		var fh, oh;
		fh = '<div id="IMDbPlus"><hr>';
		oh = '<div id="IMDbPlus-SettingsBox" class="aux-content-widget-2"><h2>IMDb+ Options</h2><ul id="IMDbPlus-Options">';
		$.each(l, function(key, val) {
			if (GM_getValue("IMDbPlus-Option-" + val[0], 1)) {
				fh += '<a class="IMDbPlus-Button linkasbutton-secondary" id="IMDbPlus-Feature-' + val[0] + '" href="' + val[1] + '" target="_blank" title="' + val[0] + '"><img alt="' + val[0] + '" src="' + val[2] + '" width="16" height="16"></a>';
			}
			oh += '<li id="IMDbPlus-Option-' + val[0] + '-Field" class="IMDbPlus-OptionField"><label for="IMDbPlus-Option-' + val[0] + '">' + val[0] + '</label> <input id="IMDbPlus-Option-' + val[0] + '" type="checkbox"' + ((GM_getValue("IMDbPlus-Option-" + val[0], 1)) ? ' checked' : '') + '></li>';
		});
		fh += '<a class="IMDbPlus-Button linkasbutton-secondary" id="IMDbPlus-Feature-Settings" title="Open settings frame"><img alt="Settings" src="https://i.imgur.com/j9VseXa.png"></a></div>';
		oh += '</ul><hr>' + '<button id="IMDbPlus-SettingsBox-Save" class="primary">Save</button>' + '<button id="IMDbPlus-SettingsBox-Close" class="primary">Close</button>' + '</div>';
		IMDbPlusStyle();
		$((location.pathname.match(/combined/)) ? '#action-box' : '#title-overview-widget').append(fh);
		$('body').append(oh);
	}
	IMDbPlusInit();

	function showOpts() {
		$('#wrapper').css('visibility', 'hidden').animate({
			opacity: 0
		}, 500);
		$('#IMDbPlus-SettingsBox').show(500);
	}

	function hideOpts() {
		$('#IMDbPlus-SettingsBox').hide(500);
		$('#wrapper').css('visibility', 'visible').animate({
			opacity: 1
		}, 500);
	}

	function saveOpts() {
			$('.IMDbPlus-OptionField').each(function() {
				var inputElm = $('input', this),
					inputId = inputElm.attr('id');
				GM_setValue(inputId, (inputElm.is(":checked") ? 1 : 0));
			});
			hideOpts();
			window.location.reload();
		}
		// Interactions
	$('#IMDbPlus-Feature-Settings').click(showOpts);
	$('#IMDbPlus-SettingsBox-Close').click(hideOpts);
	$('#IMDbPlus-SettingsBox-Save').click(saveOpts);
	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			hideOpts();
		}
	});
});