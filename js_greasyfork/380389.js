// ==UserScript==
// @name         AOTY :: Search Artists/Albums Elsewhere
// @namespace    https://greasyfork.org/en/scripts/380418-aoty-search-artists-albums-elsewhere
// @version      1.2
// @description  Hold modifier key(s) while clicking artists/albums on AOTY to open artist or artist+album searches on other sites.
// @author       newstarshipsmell
// @include      /https://www\.albumoftheyear\.org/
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/380418/AOTY%20%3A%3A%20Search%20ArtistsAlbums%20Elsewhere.user.js
// @updateURL https://update.greasyfork.org/scripts/380418/AOTY%20%3A%3A%20Search%20ArtistsAlbums%20Elsewhere.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var openSearchTabInBackground = GM_getValue('AOTYOpenSearchTabInBackground');
	openSearchTabInBackground = openSearchTabInBackground === undefined ? true : openSearchTabInBackground;

	var searchUrlsString = GM_getValue('AOTYSearchUrlsString');
	var searchUrlsStringDefault =
		'{"A":{"artist":"https://listen.tidal.com/search/artists?q=%ARTISTNAME%", "album":"https://listen.tidal.com/search/albums?q=%ARTISTNAME%%20%ALBUMTITLE%", "replacePattern":"", "replaceText":""}, "C":{"artist":"http://www.deezer.com/search/%ARTISTNAME%/artist", "album":"https://www.deezer.com/search/%ALBUMTITLE%%20%ARTISTNAME%/album", "replacePattern":"/%2F/g", "replaceText":"%20"}, "S":{"artist":"https://redacted.ch/artist.php?artistname=%ARTISTNAME%", "album":"https://redacted.ch/torrents.php?artistname=%ARTISTNAME%&groupname=%ALBUMTITLE%&tags_type=0&order_by=time&order_way=desc&group_results=1&filter_cat%5B1%5D=1&action=basic&searchsubmit=1", "replacePattern":"", "replaceText":""}, "W":{"artist":"https://www.qobuz.com/fr-fr/search?q=%ARTISTNAME%&i=boutique", "album":"https://www.qobuz.com/fr-fr/search?q=%ALBUMTITLE%%20%ARTISTNAME%&i=boutique", "replacePattern":"", "replaceText":""}, "AC":{"artist":"https://fnd.io/#/nz/search?mediaType=artists&term=%ARTISTNAME%", "album":"https://fnd.io/#/us/search?mediaType=albums&term=%ARTISTNAME%%20by%20%ALBUMTITLE%", "replacePattern":"", "replaceText":""}, "AS":{"artist":"https://www.discogs.com/search/?q=%ARTISTNAME%&type=artist&strict=true", "album":"https://www.discogs.com/search/?type=all&title=%ALBUMTITLE%&artist=%ARTISTNAME%&advanced=1", "replacePattern":"", "replaceText":""}, "AW":{"artist":"https://soundcloud.com/search/people?q=%ARTISTNAME%", "album":"https://soundcloud.com/search/albums?q=%ALBUMTITLE%%20by%20%ARTISTNAME%", "replacePattern":"", "replaceText":""}, "CS":{"artist":"http://bandcamp.com/search?q=%ARTISTNAME%", "album":"http://bandcamp.com/search?q=%ALBUMTITLE%", "replacePattern":"", "replaceText":""}, "CW":{"artist":"https://notwhat.cd/artist.php?artistname=%ARTISTNAME%", "album":"https://notwhat.cd/torrents.php?artistname=%ARTISTNAME%&groupname=%ALBUMTITLE%&tags_type=0&order_by=time&order_way=desc&group_results=1&filter_cat%5B1%5D=1&action=basic&searchsubmit=1", "replacePattern":"", "replaceText":""}, "SW":{"artist":"https://orpheus.network/artist.php?artistname=%ARTISTNAME%", "album":"https://orpheus.network/torrents.php?artistname=%ARTISTNAME%&groupname=%ALBUMTITLE%&tags_type=0&order_by=time&order_way=desc&group_results=1&filter_cat%5B1%5D=1&action=basic&searchsubmit=1", "replacePattern":"", "replaceText":""}, "ACS":{"artist":"https://waffles.ch/browse.php?artist=%ARTISTNAME%&s=year&d=desc", "album":"https://waffles.ch/browse.php?artist=%ARTISTNAME%&q=%ALBUMTITLE%&s=year&d=desc", "replacePattern":"", "replaceText":""}, "ACW":{"artist":"", "album":"", "replacePattern":"", "replaceText":""}, "ASW":{"artist":"", "album":"", "replacePattern":"", "replaceText":""}, "CSW":{"artist":"", "album":"", "replacePattern":"", "replaceText":""}, "ACSW":{"artist":"", "album":"", "replacePattern":"", "replaceText":""}}';
	searchUrlsString = searchUrlsString !== undefined ? searchUrlsString : searchUrlsStringDefault;
	var searchUrls = JSON.parse(searchUrlsString);

	var artistName, albumTitle, searchURL, searchUrlKey;

	document.addEventListener('click', function(e){
		artistName = '';
		albumTitle = '';

		if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) {
			if (e.target.tagName == 'DIV' &&
				(e.target.classList.contains('artistTitle') ||
				 e.target.classList.contains('albumTitle'))) {
				e.preventDefault();

				artistName = e.target.classList.contains('artistTitle') ? e.target.textContent : e.target.parentNode.previousSibling.firstChild.textContent;
				albumTitle = e.target.classList.contains('albumTitle') ? e.target.textContent : '';

			} else if (e.target.tagName == 'SPAN' &&
					   e.target.getAttribute('itemprop') == 'name' &&
					   (e.target.parentNode.parentNode.parentNode.classList.contains('artist') ||
						e.target.parentNode.classList.contains('albumTitle'))) {
				e.preventDefault();

				artistName = e.target.parentNode.tagName == 'A' ? e.target.textContent : e.target.parentNode.previousSibling.firstChild.firstChild.firstChild.textContent;
				albumTitle = e.target.parentNode.classList.contains('albumTitle') ? e.target.textContent : '';

			} else if ((e.target.tagName == 'SPAN' &&
						e.target.classList.contains('albumListRank')) ||
					   (e.target.tagName == 'A' &&
						/.+ - .+/.test(e.target.textContent))) {
				e.preventDefault();

				artistName = e.target.tagName == 'SPAN' ? e.target.nextSibling.textContent.split(' - ')[0] : e.target.textContent.split(' - ')[0];
				albumTitle = e.target.tagName == 'A' ? e.target.textContent.split(' - ')[1] : '';
			}
			artistName = (artistName == 'Various' || artistName == 'Various Artists') ? '' : artistName;

			searchUrlKey = (e.altKey ? 'A' : '') + (e.ctrlKey ? 'C' : '') + (e.shiftKey ? 'S' : '') + (e.metaKey ? 'W' : '');
			if (searchUrls[searchUrlKey][albumTitle ? 'album' : 'artist'] == '') return;

			if (albumTitle) {
				searchURL = searchUrls[searchUrlKey].album.replace('%ARTISTNAME%', encodeURIComponent(artistName)).replace('%ALBUMTITLE%', encodeURIComponent(albumTitle));
			} else {
				searchURL = searchUrls[searchUrlKey].artist.replace('%ARTISTNAME%', encodeURIComponent(artistName));
			}

			if (searchUrls[searchUrlKey].replacePattern != '') {
				var replacePattern = searchUrls[searchUrlKey].replacePattern.replace(/^\/(.+)\/[gim]*$/, '$1');
				var replacePatternModifiers = searchUrls[searchUrlKey].replacePattern.replace(/^\/.+\/([gim]*)$/, '$1');
				searchURL = searchURL.replace(new RegExp(replacePattern, replacePatternModifiers), searchUrls[searchUrlKey].replaceText);
			}

			if (artistName || albumTitle) GM_openInTab(searchURL, openSearchTabInBackground);
		}
	});

	if (location.href == 'https://www.albumoftheyear.org/account/edit.php') {
		var toInsert = document.querySelector('div.sectionHeading');

		var scriptSettingsHeaderDiv = document.createElement('div');
		scriptSettingsHeaderDiv.classList.add('sectionHeading');
		scriptSettingsHeaderDiv.appendChild(document.createTextNode('AOTY :: Search Artists/Albums Elsewhere (Userscript Settings)'));
		toInsert.parentNode.insertBefore(scriptSettingsHeaderDiv, toInsert);

		var scriptSettingsDiv = document.createElement('div');
		toInsert.parentNode.insertBefore(scriptSettingsDiv, toInsert);

		scriptSettingsDiv.appendChild(document.createTextNode('Open search tabs in '));
		var searchTabSettingForeRadio = document.createElement('input');
		searchTabSettingForeRadio.type = 'radio';
		searchTabSettingForeRadio.id = 'SearchTabSettingFore';
		searchTabSettingForeRadio.name = 'Search Tab Setting';
		searchTabSettingForeRadio.value = 'Search Tab Setting Fore';
		searchTabSettingForeRadio.title = 'Select this option to open search tabs in the foreground'
		searchTabSettingForeRadio.checked = openSearchTabInBackground === false ? true : false;
		scriptSettingsDiv.appendChild(document.createTextNode('\u00A0'.repeat(4)));
		scriptSettingsDiv.appendChild(searchTabSettingForeRadio);
		var searchTabSettingForeRadioLabel = document.createElement('label');
		searchTabSettingForeRadioLabel.setAttribute('for', 'SearchTabSettingFore');
		searchTabSettingForeRadioLabel.title = 'Select this option to open search tabs in the foreground'
		searchTabSettingForeRadioLabel.appendChild(document.createTextNode(' Foreground'));
		scriptSettingsDiv.appendChild(searchTabSettingForeRadioLabel);

		var searchTabSettingBackRadio = document.createElement('input');
		searchTabSettingBackRadio.type = 'radio';
		searchTabSettingBackRadio.id = 'SearchTabSettingBack';
		searchTabSettingBackRadio.name = 'Search Tab Setting';
		searchTabSettingBackRadio.value = 'Search Tab Setting Back';
		searchTabSettingBackRadio.title = 'Select this option to open search tabs in the background'
		searchTabSettingBackRadio.checked = openSearchTabInBackground === true ? true : false;
		scriptSettingsDiv.appendChild(document.createTextNode('\u00A0'.repeat(4)));
		scriptSettingsDiv.appendChild(searchTabSettingBackRadio);
		var searchTabSettingBackRadioLabel = document.createElement('label');
		searchTabSettingBackRadioLabel.setAttribute('for', 'SearchTabSettingBack');
		searchTabSettingBackRadioLabel.title = 'Select this option to open search tabs in the background';
		searchTabSettingBackRadioLabel.appendChild(document.createTextNode(' Background'));
		scriptSettingsDiv.appendChild(searchTabSettingBackRadioLabel);

		scriptSettingsDiv.appendChild(document.createElement('br'));
		scriptSettingsDiv.appendChild(document.createElement('br'));

		var urlTextFields = [
			{key: 'A', keyName: 'Alt', defaults: {
				artist: 'https://listen.tidal.com/search/artists?q=%ARTISTNAME%',
				album: 'https://listen.tidal.com/search/albums?q=%ARTISTNAME%%20%ALBUMTITLE%',
				replacePattern: '', replaceText: ''}},
			{key: 'C', keyName: 'Ctrl', defaults: {
				artist: 'http://www.deezer.com/search/%ARTISTNAME%/artist',
				album: 'https://www.deezer.com/search/%ALBUMTITLE%%20%ARTISTNAME%/album',
				replacePattern: '/%2F/g', replaceText: '%20'}},
			{key: 'S', keyName: 'Shift', defaults: {
				artist: 'https://redacted.ch/artist.php?artistname=%ARTISTNAME%',
				album: 'https://redacted.ch/torrents.php?artistname=%ARTISTNAME%&groupname=%ALBUMTITLE%&tags_type=0&order_by=time&order_way=desc&group_results=1&filter_cat%5B1%5D=1&action=basic&searchsubmit=1',
				replacePattern: '', replaceText: ''}},
			{key: 'W', keyName: 'Windows', defaults: {
				artist: 'https://www.qobuz.com/fr-fr/search?q=%ARTISTNAME%&i=boutique',
				album: 'https://www.qobuz.com/fr-fr/search?q=%ALBUMTITLE%%20%ARTISTNAME%&i=boutique',
				replacePattern: '', replaceText: ''}},
			{key: 'AC', keyName: 'Alt + Ctrl', defaults: {
				artist: 'https://fnd.io/#/nz/search?mediaType=artists&term=%ARTISTNAME%',
				album: 'https://fnd.io/#/us/search?mediaType=albums&term=%ARTISTNAME%%20by%20%ALBUMTITLE%',
				replacePattern: '', replaceText: ''}},
			{key: 'AS', keyName: 'Alt + Shift', defaults: {
				artist: 'https://www.discogs.com/search/?q=%ARTISTNAME%&type=artist&strict=true',
				album: 'https://www.discogs.com/search/?type=all&title=%ALBUMTITLE%&artist=%ARTISTNAME%&advanced=1',
				replacePattern: '', replaceText: ''}},
			{key: 'AW', keyName: 'Alt + Windows', defaults: {
				artist: 'https://soundcloud.com/search/people?q=%ARTISTNAME%',
				album: 'https://soundcloud.com/search/albums?q=%ALBUMTITLE%%20by%20%ARTISTNAME%',
				replacePattern: '', replaceText: ''}},
			{key: 'CS', keyName: 'Ctrl + Shift', defaults: {
				artist: 'http://bandcamp.com/search?q=%ARTISTNAME%',
				album: 'http://bandcamp.com/search?q=%ALBUMTITLE%',
				replacePattern: '', replaceText: ''}},
			{key: 'CW', keyName: 'Ctrl + Windows', defaults: {
				artist: 'https://notwhat.cd/artist.php?artistname=%ARTISTNAME%',
				album: 'https://notwhat.cd/torrents.php?artistname=%ARTISTNAME%&groupname=%ALBUMTITLE%&tags_type=0&order_by=time&order_way=desc&group_results=1&filter_cat%5B1%5D=1&action=basic&searchsubmit=1',
				replacePattern: '', replaceText: ''}},
			{key: 'SW', keyName: 'Shift + Windows', defaults: {
				artist: 'https://orpheus.network/artist.php?artistname=%ARTISTNAME%',
				album: 'https://orpheus.network/torrents.php?artistname=%ARTISTNAME%&groupname=%ALBUMTITLE%&tags_type=0&order_by=time&order_way=desc&group_results=1&filter_cat%5B1%5D=1&action=basic&searchsubmit=1',
				replacePattern: '', replaceText: ''}},
			{key: 'ACS', keyName: 'Alt + Ctrl + Shift', defaults: {
				artist: 'https://waffles.ch/browse.php?artist=%ARTISTNAME%&s=year&d=desc',
				album: 'https://waffles.ch/browse.php?artist=%ARTISTNAME%&q=%ALBUMTITLE%&s=year&d=desc',
				replacePattern: '', replaceText: ''}},
			{key: 'ACW', keyName: 'Alt + Ctrl + Windows', defaults: {
				artist: '',
				album: '',
				replacePattern: '', replaceText: ''}},
			{key: 'CSW', keyName: 'Ctrl + Shift + Windows', defaults: {
				artist: '',
				album: '',
				replacePattern: '', replaceText: ''}},
			{key: 'ACSW', keyName: 'Alt + Ctrl + Shift + Windows', defaults: {
				artist: '',
				album: '',
				replacePattern: '', replaceText: ''}}
		];

		var urlTextInputs = [[]];

		for (var i = 0, len = urlTextFields.length; i < len; i++) {
			scriptSettingsDiv.appendChild(document.createTextNode(urlTextFields[i].keyName + ' + Click:'));
			scriptSettingsDiv.appendChild(document.createElement('br'));
			urlTextInputs.push(['', '', '', '']);

			scriptSettingsDiv.appendChild(document.createTextNode('Artist URL: '));
			urlTextInputs[i][0] = document.createElement('input');
			urlTextInputs[i][0].type = 'text';
			urlTextInputs[i][0].id = 'Click' + urlTextFields[i].key + 'Artist';
			urlTextInputs[i][0].name = 'Click ' + urlTextFields[i].key + ' Artist';
			urlTextInputs[i][0].value = searchUrls[urlTextFields[i].key].artist;
			urlTextInputs[i][0].size = 96;
			urlTextInputs[i][0].title =
				'Enter the URL to be searched when ' + urlTextFields[i].keyName + ' + Clicking an artistname (substitute %ARTISTNAME% for the search terms)';
			scriptSettingsDiv.appendChild(urlTextInputs[i][0]);
			scriptSettingsDiv.appendChild(document.createElement('br'));

			scriptSettingsDiv.appendChild(document.createTextNode('Album URL: '));
			urlTextInputs[i][1] = document.createElement('input');
			urlTextInputs[i][1].type = 'text';
			urlTextInputs[i][1].id = 'Click' + urlTextFields[i].key + 'Album';
			urlTextInputs[i][1].name = 'Click ' + urlTextFields[i].key + ' Album';
			urlTextInputs[i][1].value = searchUrls[urlTextFields[i].key].album;
			urlTextInputs[i][1].size = 96;
			urlTextInputs[i][1].title =
				'Enter the URL to be searched when ' + urlTextFields[i].keyName +
				' + Clicking an albumtitle (substitute %ARTISTNAME% and %ALBUMTITLE% for the search terms)';
			scriptSettingsDiv.appendChild(urlTextInputs[i][1]);
			scriptSettingsDiv.appendChild(document.createElement('br'));

			scriptSettingsDiv.appendChild(document.createTextNode('RegEx Pattern / Replace: '));
			urlTextInputs[i][2] = document.createElement('input');
			urlTextInputs[i][2].type = 'text';
			urlTextInputs[i][2].id = 'Click' + urlTextFields[i].key + 'Pattern';
			urlTextInputs[i][2].name = 'Click ' + urlTextFields[i].key + ' Pattern';
			urlTextInputs[i][2].value = searchUrls[urlTextFields[i].key].replacePattern;
			urlTextInputs[i][2].size = 24;
			urlTextInputs[i][2].title =
				'Enter the RegEx pattern to be matched for text replacement when ' + urlTextFields[i].keyName + ' + Clicking an artistname or albumtitle';
			scriptSettingsDiv.appendChild(urlTextInputs[i][2]);
			scriptSettingsDiv.appendChild(document.createTextNode(' / '));

			urlTextInputs[i][3] = document.createElement('input');
			urlTextInputs[i][3].type = 'text';
			urlTextInputs[i][3].id = 'Click' + urlTextFields[i].key + 'Text';
			urlTextInputs[i][3].name = 'Click ' + urlTextFields[i].key + ' Text';
			urlTextInputs[i][3].value = searchUrls[urlTextFields[i].key].replaceText;
			urlTextInputs[i][3].size = 24;
			urlTextInputs[i][3].title =
				'Enter the text to replace the matched RegEx pattern when ' + urlTextFields[i].keyName + ' + Clicking an artistname or albumtitle';
			scriptSettingsDiv.appendChild(urlTextInputs[i][3]);

			scriptSettingsDiv.appendChild(document.createElement('br'));
			scriptSettingsDiv.appendChild(document.createElement('br'));
		}

		var resetSettingsBtn = document.createElement('input');
		resetSettingsBtn.type = 'button';
		resetSettingsBtn.name = 'Reset';
		resetSettingsBtn.value = 'Reset';
		resetSettingsBtn.title = 'Click to reset the userscript settings to their default selections/values';
		scriptSettingsDiv.appendChild(resetSettingsBtn);
		scriptSettingsDiv.appendChild(document.createTextNode('\u00A0'.repeat(4)));
		resetSettingsBtn.addEventListener('click', function(){
			if (confirm('Are you sure you want to reset the Search Artists/Albums Elsewhere userscript settings to their default values?')) {
				searchTabSettingForeRadio.checked = false;
				searchTabSettingBackRadio.checked = true;
				GM_setValue('AOTYOpenSearchTabInBackground', true);
				for (var i = 0, len = urlTextInputs.length - 1; i < len; i++) {
					urlTextInputs[i][0].value = urlTextFields[i].defaults.artist;
					urlTextInputs[i][1].value = urlTextFields[i].defaults.album;
					urlTextInputs[i][2].value = urlTextFields[i].defaults.replacePattern;
					urlTextInputs[i][3].value = urlTextFields[i].defaults.replaceText;
				}
				GM_setValue('AOTYSearchUrlsString', searchUrlsStringDefault);
			}
		});

		var saveSettingsBtn = document.createElement('input');
		saveSettingsBtn.type = 'button';
		saveSettingsBtn.name = 'Save';
		saveSettingsBtn.value = 'Save';
		saveSettingsBtn.title = 'Click to save the currently selected/specified userscript settings';
		scriptSettingsDiv.appendChild(saveSettingsBtn);
		saveSettingsBtn.addEventListener('click', function(){
			GM_setValue('AOTYOpenSearchTabInBackground', (searchTabSettingBackRadio.checked ? true : false));
			for (var i = 0, len = urlTextInputs.length - 1; i < len; i++) {
				searchUrls[urlTextFields[i].key].artist = urlTextInputs[i][0].value;
				searchUrls[urlTextFields[i].key].album = urlTextInputs[i][1].value;
				searchUrls[urlTextFields[i].key].replacePattern = urlTextInputs[i][2].value;
				searchUrls[urlTextFields[i].key].replaceText = urlTextInputs[i][3].value;
			}
			GM_setValue('AOTYSearchUrlsString', JSON.stringify(searchUrls));

			alert('Settings for Search Artists/Albums Elsewhere userscript have been saved!');
		});

		toInsert.parentNode.insertBefore(document.createElement('br'), toInsert);
	}
})();