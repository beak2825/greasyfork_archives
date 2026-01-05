// ==UserScript==
// @name           Partis forum skripta
// @version        1.5
// @namespace      partis
// @description    Provides various fixes and enhancement to Partis.
// @include        https://*partis.si/*
// @downloadURL https://update.greasyfork.org/scripts/2445/Partis%20forum%20skripta.user.js
// @updateURL https://update.greasyfork.org/scripts/2445/Partis%20forum%20skripta.meta.js
// ==/UserScript==

$(document).ready(function(){
	
	// FUNCTIONS
	
	var currentURL = parseURL(window.top.location).path;
	
	function setCookie(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}

	function getCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}
	
	function parseURL(url) {
		var a =  document.createElement('a');
		a.href = url;
		return {
			source: url,
			protocol: a.protocol.replace(':',''),
			host: a.hostname,
			port: a.port,
			query: a.search,
			params: (function(){
				var ret = {},
					seg = a.search.replace(/^\?/,'').split('&'),
					len = seg.length, i = 0, s;
				for (;i<len;i++) {
					if (!seg[i]) { continue; }
					s = seg[i].split('=');
					ret[s[0]] = s[1];
				}
				return ret;
			})(),
			file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
			hash: a.hash.replace('#',''),
			path: a.pathname.replace(/^([^\/])/,'/$1'),
			relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
			segments: a.pathname.replace(/^\//,'').split('/')
		};
	}
	

	// FEATURE: DOCUMENT TITLE FIXED
	
	setNewPartisTitle = function(text) {
		document.title = text + ' :: Partis';
	}
	
	setTitleFromContent = function() {
		newTitle = document.getElementsByClassName('h11')[0].innerHTML.replace(/(<([^>]+)>)/ig, '');
		if (newTitle != '' || newTitle != null) {
			setNewPartisTitle(newTitle.replace(/\./gi, ' '));
		}
	}
	
	if (currentURL.indexOf('/prva') != -1) setNewPartisTitle('Naslovnica');


	if (currentURL.indexOf('categories') != -1) setNewPartisTitle('Forum');
	if (currentURL.indexOf('edit') != -1) setNewPartisTitle('Urejanje teme');
	if (currentURL.indexOf('edit_user') != -1) setNewPartisTitle('Urejanje profila');
	if (currentURL.indexOf('skupnost/klepet') != -1) setNewPartisTitle('Klepet');
	if (currentURL.indexOf('skupnost/uporabniki') != -1) setNewPartisTitle('Seznam uporabnikov');
	if (currentURL.indexOf('skupnost/lestvice') != -1) setNewPartisTitle('Top lestvice');
	if (currentURL.indexOf('skupnost/sale') != -1) setNewPartisTitle('Šale');
	if (currentURL.indexOf('profil/posta') != -1) setNewPartisTitle('Moja pošta');
	if (currentURL.indexOf('/sporocilo') != -1) setNewPartisTitle('Novo sporočilo');
	if (currentURL.indexOf('torrent/xxxbrskaj') != -1) setNewPartisTitle('XXX');
    if (currentURL.indexOf('torrent/uredi/') != -1) setNewPartisTitle('Urejanje torrenta');
	if (currentURL.indexOf('/brskaj') != -1) setNewPartisTitle('Seznam torrentov');
	if (currentURL.indexOf('/nalozi') != -1) setNewPartisTitle('Naloži');
	if (currentURL.indexOf('/latest') != -1) setNewPartisTitle('Novi uporabniki');
	if (currentURL.indexOf('/announce') != -1) setNewPartisTitle('Cheaters');
	if (currentURL.indexOf('/zaznamki') != -1) setNewPartisTitle('Moji zaznamki');
	if (currentURL.indexOf('/postal-bi') != -1) setNewPartisTitle('Postal bi');
	if (currentURL.indexOf('/kupon') != -1) setNewPartisTitle('Vnovči kupon');
	if (currentURL.indexOf('/podpora') != -1) setNewPartisTitle('Podpora');
	if (currentURL.indexOf('/pogoji-uporabe') != -1) setNewPartisTitle('Pogoji uporabe');
	if (currentURL.indexOf('/pravni-pouk') != -1) setNewPartisTitle('Pravni pouk');
	if (currentURL.indexOf('/vpisnovice') != -1) setNewPartisTitle('Vpis novic');
	if (currentURL.indexOf('/donacije') != -1) setNewPartisTitle('Donacije');	
	if (currentURL.indexOf('/shop') != -1) setNewPartisTitle('Partis shop');
	if (currentURL.indexOf('/oglasevanje') != -1) setNewPartisTitle('Oglaševanje');
	if (currentURL.indexOf('/osebje') != -1) setNewPartisTitle('Osebje');
	if (currentURL.indexOf('/radio') != -1) setNewPartisTitle('Partis radio');
	if (currentURL.indexOf('/press') != -1) setNewPartisTitle('Press');
	if (currentURL.indexOf('/ip') != -1) setNewPartisTitle('IP');
	if (currentURL.indexOf('/last50') != -1) setNewPartisTitle('Last50');
	if (currentURL.indexOf('/actions') != -1) setNewPartisTitle('Pregled akcij');
	if (currentURL.indexOf('/seznami2') != -1) setNewPartisTitle('Seznami 2');
	if (currentURL.indexOf('/seznami3') != -1) setNewPartisTitle('Seznami 3');
	if (currentURL.indexOf('/seznami3a') != -1) setNewPartisTitle('Seznami 3a');
	if (currentURL.indexOf('/accounts') != -1) setNewPartisTitle('Seznam računov');
	if (currentURL.indexOf('/cheaters') != -1) setNewPartisTitle('Goljufanje uporabnika');

	if (currentURL.indexOf('skupnost/forum') != -1) setNewPartisTitle('Forum');
	
	if (currentURL.indexOf('topics') != -1) setNewPartisTitle('Tema');
	if (currentURL.indexOf('topics/80656') != -1) setNewPartisTitle('MuSi - Prošnje za glasbene torrente - (Edina tema)');	
	
	if (currentURL.indexOf('forums/1') != -1) setNewPartisTitle('O spletišču');
	if (currentURL.indexOf('forums/2') != -1) setNewPartisTitle('Pohvale, graje');	
	if (currentURL.indexOf('forums/3') != -1) setNewPartisTitle('Nasveti in pomoč');
	if (currentURL.indexOf('forums/4') != -1) setNewPartisTitle('Strojna oprema');
	if (currentURL.indexOf('forums/6') != -1) setNewPartisTitle('Programska oprema');
	if (currentURL.indexOf('forums/7') != -1) setNewPartisTitle('Igričarstvo');	
	if (currentURL.indexOf('forums/8') != -1) setNewPartisTitle('Internetna spletišča');
	if (currentURL.indexOf('forums/9') != -1) setNewPartisTitle('Znanost, tehnologija');
	if (currentURL.indexOf('forums/10') != -1) setNewPartisTitle('Šola');
	if (currentURL.indexOf('forums/11') != -1) setNewPartisTitle('Spletno nakupovanje');
	if (currentURL.indexOf('forums/12') != -1) setNewPartisTitle('Seks');
	if (currentURL.indexOf('forums/13') != -1) setNewPartisTitle('Prodam, menjam, oddam');
	if (currentURL.indexOf('forums/15') != -1) setNewPartisTitle('Osebje');	
	if (currentURL.indexOf('forums/16') != -1) setNewPartisTitle('Šport');	
	if (currentURL.indexOf('forums/17') != -1) setNewPartisTitle('Glasba in radio');
	if (currentURL.indexOf('forums/18') != -1) setNewPartisTitle('Filmi, serije, dokumentarci');
	if (currentURL.indexOf('forums/23') != -1) setNewPartisTitle('Življenje');	
	if (currentURL.indexOf('forums/24') != -1) setNewPartisTitle('Nasveti in pomoč / Debata');	
	if (currentURL.indexOf('forums/25') != -1) setNewPartisTitle('Kupim');
	if (currentURL.indexOf('forums/26') != -1) setNewPartisTitle('Nudim, iščem, podarim');		
	if (currentURL.indexOf('forums/27') != -1) setNewPartisTitle('Nasveti in pomoč / Konzole');		
	if (currentURL.indexOf('forums/28') != -1) setNewPartisTitle('Igričarstvo / Konzole');
	
	if (currentURL.indexOf('/categories/1') != -1) setNewPartisTitle('partis.si / kategorija');	
	if (currentURL.indexOf('/categories/2') != -1) setNewPartisTitle('Računalništvo / kategorija');
	if (currentURL.indexOf('/categories/3') != -1) setNewPartisTitle('Internet / kategorija');
	if (currentURL.indexOf('/categories/4') != -1) setNewPartisTitle('Debate / kategorija');
	if (currentURL.indexOf('/categories/5') != -1) setNewPartisTitle('Mali oglasi / kategorija');
	if (currentURL.indexOf('/categories/6') != -1) setNewPartisTitle('Mobilna tehnologija / kategorija');
	if (currentURL.indexOf('/categories/7') != -1) setNewPartisTitle('Konzole / kategorija');
	
	if (currentURL.indexOf('/search') != -1) setNewPartisTitle('Iskanje tem');
	if (currentURL.indexOf('/torrent/announce') != -1) setNewPartisTitle('Cheaters');
	if (currentURL.indexOf('/errors') != -1) setNewPartisTitle('Prijavljene napake');
	if (currentURL.indexOf('/prijava') != -1) setNewPartisTitle('Prijava napak');
	
	if (currentURL.indexOf('/errors?status=fixed') != -1) setNewPartisTitle('Odpravljene napake');
	if (currentURL.indexOf('/torrent/oficir7') != -1) setNewPartisTitle('ID uporabnika');	
	if (currentURL.indexOf('/ip?ip=') != -1) setNewPartisTitle('IP uporabnika');
	if (currentURL.indexOf('/torrent/oficir5/') != -1) setNewPartisTitle('Povrnjeni torrent');
	if (currentURL.indexOf('/torrent/oficir1/') != -1) setNewPartisTitle('Kdo briše torrent');
	
	if (
		currentURL.indexOf('torrent/podrobno') != -1 ||
		currentURL.indexOf('profil/prikazi') != -1
	) {
		setTitleFromContent();
	}

});