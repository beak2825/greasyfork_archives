// ==UserScript==
// @name         SoundCloud :: Search Artists Elsewhere
// @namespace    https://greasyfork.org/en/scripts/379988-soundcloud-search-artists-elsewhere
// @version      1.2
// @description  Hold modifier key combos while clicking on Artist/Track/Playlist names/titles to search those artists on other sites.
// @author       newstarshipsmell
// @include      https://soundcloud.com/*
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/379988/SoundCloud%20%3A%3A%20Search%20Artists%20Elsewhere.user.js
// @updateURL https://update.greasyfork.org/scripts/379988/SoundCloud%20%3A%3A%20Search%20Artists%20Elsewhere.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var addedOptions = false;
	var firstRun = true;
	var currentPage = location.href;
	var lastPage = null;

	var scriptWait = 250;

	var settingsStr = GM_getValue('SoundCloudSearchArtistsElsewhereSettings');
	var settings = settingsStr === undefined ? {} : JSON.parse(settingsStr);

	settings.openSearchTabInBackground = settings.openSearchTabInBackground === undefined ? true : settings.openSearchTabInBackground;
	settings.searchCamelCasedArtistNamesSpacedOut = settings.searchCamelCasedArtistNamesSpacedOut === undefined ? true : settings.searchCamelCasedArtistNamesSpacedOut;
	settings.linkFacebookLinksToAboutPage = settings.linkFacebookLinksToAboutPage === undefined ? false : settings.linkFacebookLinksToAboutPage;
	settings.artistTitleSplitPatternText = settings.artistTitleSplitPatternText === undefined ? '( "| ?- | \/+ )' : settings.artistTitleSplitPatternText;
	var artistTitleSplitPattern = new RegExp(settings.artistTitleSplitPatternText);
	settings.searchUrlsString = settings.searchUrlsString !== undefined ? settings.searchUrlsString :
	'{"A":"https://listen.tidal.com/search/artists?q=%ARTISTNAME%", "C":"http://www.deezer.com/search/%ARTISTNAME%/artist", ' +
		'"S":"https://redacted.ch/artist.php?artistname=%ARTISTNAME%", "W":"", "AC":"https://fnd.io/#/nz/search?mediaType=artists&term=%ARTISTNAME%", ' +
		'"AS":"https://www.discogs.com/search/?q=%ARTISTNAME%&type=artist&strict=true", "AW":"stations/artist/%ARTISTPATH% || %TRACKPATH%/recommended", ' +
		'"CS":"http://bandcamp.com/search?q=%ARTISTNAME%", "CW":"https://notwhat.cd/artist.php?artistname=%ARTISTNAME%", ' +
		'"SW":"https://orpheus.network/artist.php?artistname=%ARTISTNAME%", "ACS":"https://waffles.ch/browse.php?artist=%ARTISTNAME%&s=year&d=desc", ' +
		'"ACW":"http://www.qobuz.com/fr-fr/search?q=%ARTISTNAME%&i=boutique", "ASW":"", "CSW":"%ARTISTPATH%/likes || %TRACKPATH%/sets", "ACSW":""}';
	var searchUrls = JSON.parse(settings.searchUrlsString);
	var headerSettingsDiv, mainContent;

	document.addEventListener('click', function(e) {
		if (settings.linkFacebookLinksToAboutPage && e.target.tagName == 'A') {
			if (e.target.href.indexOf('facebook.com') > -1) {
				e.preventDefault();
				GM_openInTab(decodeURIComponent(e.target.href) + (/%2F$/.test(e.target.href) ? 'about/' : '/about/'), false);
				return;
			}

		} else if ((!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) ||
				   (e.target.tagName != 'SPAN' && e.target.tagName != 'A') ||
				   (!e.target.classList.contains('soundTitle__username') &&
					!e.target.parentNode.classList.contains('soundTitle__username') &&
					!e.target.classList.contains('soundTitle__title') &&
					!e.target.parentNode.classList.contains('soundTitle__title'))) {
			return;
		}

		var searchUrlKey = (e.altKey ? 'A' : '') + (e.ctrlKey ? 'C' : '') + (e.shiftKey ? 'S' : '') + (e.metaKey ? 'W' : '');
		var urlToOpen = searchUrls[searchUrlKey];

		if (urlToOpen === undefined) return;

		if (urlToOpen.indexOf('%ARTISTNAME%') > -1) {
			if (urlToOpen.indexOf('%ARTISTPATH%') > -1 ||
				urlToOpen.indexOf('%TRACKPATH%') > -1) return;

			e.preventDefault();
			var artistName = e.target.textContent.trim();

			if (e.target.classList.contains('soundTitle__title') || e.target.parentNode.classList.contains('soundTitle__title')) {
				artistName = artistName.split(artistTitleSplitPattern)[0];
			}

			var encodedArtist = encodeURIComponent(artistName.replace(/&amp;/g, '&'));
			encodedArtist = encodedArtist.replace(/%20/g, '+').replace(/%2F/g, (urlToOpen.indexOf('deezer.com') > -1 ? '%20' : '%2F'));

			if (artistName.indexOf(' ') == -1 &&
				/[A-Z][a-z]+([A-Z][a-z]+)+/.test(artistName) &&
				settings.searchCamelCasedArtistNamesSpacedOut) {
				var encodedArtistSpaced = encodeURIComponent(artistName.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/&amp;/g, '&'));
				encodedArtistSpaced = encodedArtistSpaced.replace(/%20/g, '+').replace(/%2F/g, (urlToOpen.indexOf('deezer.com') > -1 ? '%20' : '%2F'));
				GM_openInTab(urlToOpen.replace('%ARTISTNAME%', encodedArtistSpaced), settings.openSearchTabInBackground);
			}

			urlToOpen = urlToOpen.replace('%ARTISTNAME%', encodedArtist);

		} else if (urlToOpen.indexOf('%ARTISTPATH%') > -1 ||
				   urlToOpen.indexOf('%TRACKPATH%') > -1) {

			//if (!/https:\/\/soundcloud\.com\/[^\/]+\/(?!tracks\/)(?!albums\/)(?!sets\/)(?!reposts\/)[^\/]+$/.test(e.target.parentNode.href)) return;

			if (urlToOpen.indexOf('%ARTISTPATH%') > -1 &&
				urlToOpen.indexOf('%TRACKPATH%') > -1) {

				if (!/(.+%ARTISTPATH%|%ARTISTPATH%.+) || %TRACKPATH%.+/.test(urlToOpen)) return;

				if (e.target.classList.contains('soundTitle__username') ||
					e.target.parentNode.classList.contains('soundTitle__username')) {

					e.preventDefault();
					urlToOpen = 'https://soundcloud.com/' +
						urlToOpen.split(' || ')[0].replace('%ARTISTPATH%', e.target.parentNode.href.replace('https://soundcloud.com/', ''));

				} else if (e.target.classList.contains('soundTitle__title') ||
						   e.target.parentNode.classList.contains('soundTitle__title')) {

					e.preventDefault();
					urlToOpen = urlToOpen.split(' || ')[1];
					urlToOpen = 'https://soundcloud.com/' +
						urlToOpen.replace('%TRACKPATH%', e.target.parentNode.href.replace('https://soundcloud.com/', ''));
				}

			} else {
				if (urlToOpen.indexOf('%ARTISTPATH%') > -1) {

					if (!e.target.classList.contains('soundTitle__username') &&
						!e.target.parentNode.classList.contains('soundTitle__username')) return;

					e.preventDefault();
					urlToOpen = 'https://soundcloud.com/' + urlToOpen.replace('%ARTISTPATH%', e.target.parentNode.href.replace('https://soundcloud.com/', ''));

				} else {

					if (!e.target.classList.contains('soundTitle__title') &&
						!e.target.parentNode.classList.contains('soundTitle__title')) return;

					e.preventDefault();
					urlToOpen = 'https://soundcloud.com/' + urlToOpen.replace('%TRACKPATH%', e.target.parentNode.href.replace('https://soundcloud.com/', ''));

				}
			}

		} else {
			return;
		}

		GM_openInTab(urlToOpen, settings.openSearchTabInBackground);
	});

	if (GM_addValueChangeListener) {
		GM_addValueChangeListener('SoundCloudSearchArtistsElsewhereSettings', function(SoundCloudSearchArtistsElsewhereSettings, oldSettings, newSettings, remote) {
			if (!remote) return;

			settings = newSettings === undefined ? {} : JSON.parse(newSettings);
			settings.openSearchTabInBackground = settings.openSearchTabInBackground === undefined ? true : settings.openSearchTabInBackground;
			settings.searchCamelCasedArtistNamesSpacedOut = settings.searchCamelCasedArtistNamesSpacedOut === undefined ? true : settings.searchCamelCasedArtistNamesSpacedOut;
			settings.linkFacebookLinksToAboutPage = settings.linkFacebookLinksToAboutPage === undefined ? false : settings.linkFacebookLinksToAboutPage;
			settings.artistTitleSplitPatternText = settings.artistTitleSplitPatternText === undefined ? '( "| ?- | \/+ )' : settings.artistTitleSplitPatternText;
			artistTitleSplitPattern = new RegExp(settings.artistTitleSplitPatternText);
			settings.searchUrlsString = settings.searchUrlsString !== undefined ? settings.searchUrlsString :
			'{"A":"https://listen.tidal.com/search/artists?q=%ARTISTNAME%", "C":"http://www.deezer.com/search/%ARTISTNAME%/artist", ' +
				'"S":"https://redacted.ch/artist.php?artistname=%ARTISTNAME%", "W":"", "AC":"https://fnd.io/#/nz/search?mediaType=artists&term=%ARTISTNAME%", ' +
				'"AS":"https://www.discogs.com/search/?q=%ARTISTNAME%&type=artist&strict=true", "AW":"stations/artist/%ARTISTPATH% || %TRACKPATH%/recommended", ' +
				'"CS":"http://bandcamp.com/search?q=%ARTISTNAME%", "CW":"https://notwhat.cd/artist.php?artistname=%ARTISTNAME%", ' +
				'"SW":"https://orpheus.network/artist.php?artistname=%ARTISTNAME%", "ACS":"https://waffles.ch/browse.php?artist=%ARTISTNAME%&s=year&d=desc", ' +
				'"ACW":"http://www.qobuz.com/fr-fr/search?q=%ARTISTNAME%&i=boutique", "ASW":"", "CSW":"%ARTISTPATH%/likes || %TRACKPATH%/sets", "ACSW":""}';
			searchUrls = JSON.parse(settings.searchUrlsString);
		});
	}

	function reAddSettings() {
		if (!bGbl_ChangeEventListenerInstalled)
		{
			bGbl_ChangeEventListenerInstalled = true;
			document.addEventListener("DOMSubtreeModified", HandleDOM_ChangeWithDelay, false);
		}

		currentPage = location.href;
		if (currentPage == lastPage) {
			lastPage = currentPage;
			addedOptions = true;
			firstRun = false;
			return;
		} else {
			addedOptions = false;
		}
		lastPage = currentPage;

		if (!addedOptions) {
			setTimeout(function() {
				headerSettingsDiv = document.createElement('div');
				headerSettingsDiv.id = 'script_settings';
				headerSettingsDiv.classList.add('sc-type-large');
				headerSettingsDiv.style.display = 'none';

				mainContent = document.getElementById('content');
				mainContent.insertBefore(headerSettingsDiv, mainContent.firstChild);

				headerSettingsDiv.appendChild(document.createElement('br'));

				var headerSettingsDivHeader = document.createElement('u');
				headerSettingsDivHeader.appendChild(document.createTextNode('Search Artists Elsewhere Userscript Settings:'));
				headerSettingsDiv.appendChild(headerSettingsDivHeader);
				headerSettingsDiv.appendChild(document.createElement('br'));
				headerSettingsDiv.appendChild(document.createElement('br'));

				headerSettingsDiv.appendChild(document.createTextNode('Open search tabs in '));

				var searchTabSettingForeRadio = document.createElement('input');
				searchTabSettingForeRadio.type = 'radio';
				searchTabSettingForeRadio.id = 'SearchTabSettingFore';
				searchTabSettingForeRadio.name = 'Search Tab Setting';
				searchTabSettingForeRadio.value = 'Search Tab Setting Fore';
				searchTabSettingForeRadio.title = 'Select this option to open search tabs in the foreground'
				searchTabSettingForeRadio.checked = settings.openSearchTabInBackground === false ? true : false;
				headerSettingsDiv.appendChild(document.createTextNode('\u00A0'.repeat(4)));
				headerSettingsDiv.appendChild(searchTabSettingForeRadio);
				var searchTabSettingForeRadioLabel = document.createElement('label');
				searchTabSettingForeRadioLabel.setAttribute('for', 'SearchTabSettingFore');
				searchTabSettingForeRadioLabel.title = 'Select this option to open search tabs in the foreground'
				searchTabSettingForeRadioLabel.appendChild(document.createTextNode(' Foreground'));
				headerSettingsDiv.appendChild(searchTabSettingForeRadioLabel);

				var searchTabSettingBackRadio = document.createElement('input');
				searchTabSettingBackRadio.type = 'radio';
				searchTabSettingBackRadio.id = 'SearchTabSettingBack';
				searchTabSettingBackRadio.name = 'Search Tab Setting';
				searchTabSettingBackRadio.value = 'Search Tab Setting Back';
				searchTabSettingBackRadio.title = 'Select this option to open search tabs in the background'
				searchTabSettingBackRadio.checked = settings.openSearchTabInBackground === true ? true : false;
				headerSettingsDiv.appendChild(document.createTextNode('\u00A0'.repeat(4)));
				headerSettingsDiv.appendChild(searchTabSettingBackRadio);
				var searchTabSettingBackRadioLabel = document.createElement('label');
				searchTabSettingBackRadioLabel.setAttribute('for', 'SearchTabSettingBack');
				searchTabSettingBackRadioLabel.title = 'Select this option to open search tabs in the background';
				searchTabSettingBackRadioLabel.appendChild(document.createTextNode(' Background'));
				headerSettingsDiv.appendChild(searchTabSettingBackRadioLabel);

				headerSettingsDiv.appendChild(document.createElement('br'));
				headerSettingsDiv.appendChild(document.createElement('br'));

				var searchCamelCasedArtistNamesSpacedOutCheckbox = document.createElement('input');
				searchCamelCasedArtistNamesSpacedOutCheckbox.type = 'checkbox';
				searchCamelCasedArtistNamesSpacedOutCheckbox.id = 'CamelCaseArtist';
				searchCamelCasedArtistNamesSpacedOutCheckbox.name = 'Camel Case Artist';
				searchCamelCasedArtistNamesSpacedOutCheckbox.value = 'Camel Case Artist';
				searchCamelCasedArtistNamesSpacedOutCheckbox.title =
					'Check this box to open an extra search tab for CamelCased artists with spaces inserted before the capital letters';
				searchCamelCasedArtistNamesSpacedOutCheckbox.checked = settings.searchCamelCasedArtistNamesSpacedOut ? true : false;
				headerSettingsDiv.appendChild(searchCamelCasedArtistNamesSpacedOutCheckbox);
				var searchCamelCasedArtistNamesSpacedOutLabel = document.createElement('label');
				searchCamelCasedArtistNamesSpacedOutLabel.setAttribute('for', 'CamelCaseArtist');
				searchCamelCasedArtistNamesSpacedOutLabel.title =
					'Check this box to open an extra search tab for CamelCased artists with spaces inserted before the capital letters';
				searchCamelCasedArtistNamesSpacedOutLabel.appendChild(document.createTextNode(' Search CamelCased Artists with spaces inserted'));
				headerSettingsDiv.appendChild(searchCamelCasedArtistNamesSpacedOutLabel);

				headerSettingsDiv.appendChild(document.createElement('br'));
				headerSettingsDiv.appendChild(document.createElement('br'));

				var linkFacebookLinksToAboutPageCheckbox = document.createElement('input');
				linkFacebookLinksToAboutPageCheckbox.type = 'checkbox';
				linkFacebookLinksToAboutPageCheckbox.id = 'FacebookAbout';
				linkFacebookLinksToAboutPageCheckbox.name = 'Facebook About';
				linkFacebookLinksToAboutPageCheckbox.value = 'Facebook About';
				linkFacebookLinksToAboutPageCheckbox.title =
					'Check this box to open Facebook links on their respective About tabs rather than default Home tabs';
				linkFacebookLinksToAboutPageCheckbox.checked = settings.linkFacebookLinksToAboutPage ? true : false;
				headerSettingsDiv.appendChild(linkFacebookLinksToAboutPageCheckbox);
				var linkFacebookLinksToAboutPageLabel = document.createElement('label');
				linkFacebookLinksToAboutPageLabel.setAttribute('for', 'FacebookAbout');
				linkFacebookLinksToAboutPageLabel.title =
					'Check this box to open Facebook links on their respective About tabs rather than default Home tabs';
				linkFacebookLinksToAboutPageLabel.appendChild(document.createTextNode(' Link Facebook links to About tabs'));
				headerSettingsDiv.appendChild(linkFacebookLinksToAboutPageLabel);

				headerSettingsDiv.appendChild(document.createElement('br'));
				headerSettingsDiv.appendChild(document.createElement('br'));

				headerSettingsDiv.appendChild(document.createTextNode('Artistname/Tracktitle splitting RegExp: /'));
				var artistTitleSplitPatternTextInput = document.createElement('input');
				artistTitleSplitPatternTextInput.type = 'text';
				artistTitleSplitPatternTextInput.id = 'RegExpText';
				artistTitleSplitPatternTextInput.name = 'Reg Exp Text';
				artistTitleSplitPatternTextInput.value = settings.artistTitleSplitPatternText;
				artistTitleSplitPatternTextInput.size = 32;
				artistTitleSplitPatternTextInput.title =
					'Enter a regular expression here (without the delimiting slashes) for parsing the break between artistname and track/playlist title in title';
				headerSettingsDiv.appendChild(artistTitleSplitPatternTextInput);
				headerSettingsDiv.appendChild(document.createTextNode('/'));

				headerSettingsDiv.appendChild(document.createElement('br'));
				headerSettingsDiv.appendChild(document.createElement('br'));

				headerSettingsDiv.appendChild(document.createTextNode('Modifier Combo + Click Search URLs:'));
				headerSettingsDiv.appendChild(document.createElement('br'));

				var urlTextFields = [
					{key: 'A', keyName: 'Alt', default: 'https://listen.tidal.com/search/artists?q=%ARTISTNAME%'},
					{key: 'C', keyName: 'Ctrl', default: 'http://www.deezer.com/search/%ARTISTNAME%/artist'},
					{key: 'S', keyName: 'Shift', default: 'https://redacted.ch/artist.php?artistname=%ARTISTNAME%'},
					{key: 'W', keyName: 'Windows', default: ''},
					{key: 'AC', keyName: 'Alt + Ctrl', default: 'https://fnd.io/#/nz/search?mediaType=artists&term=%ARTISTNAME%'},
					{key: 'AS', keyName: 'Alt + Shift', default: 'https://www.discogs.com/search/?q=%ARTISTNAME%&type=artist&strict=true'},
					{key: 'AW', keyName: 'Alt + Windows', default: 'stations/artist/%ARTISTPATH% || %TRACKPATH%/recommended'},
					{key: 'CS', keyName: 'Ctrl + Shift', default: 'http://bandcamp.com/search?q=%ARTISTNAME%'},
					{key: 'CW', keyName: 'Ctrl + Windows', default: 'https://notwhat.cd/artist.php?artistname=%ARTISTNAME%'},
					{key: 'SW', keyName: 'Shift + Windows', default: 'https://orpheus.network/artist.php?artistname=%ARTISTNAME%'},
					{key: 'ACS', keyName: 'Alt + Ctrl + Shift', default: 'https://waffles.ch/browse.php?artist=%ARTISTNAME%&s=year&d=desc'},
					{key: 'ACW', keyName: 'Alt + Ctrl + Windows', default: 'http://www.qobuz.com/fr-fr/search?q=%ARTISTNAME%&i=boutique'},
					{key: 'CSW', keyName: 'Ctrl + Shift + Windows', default: '%ARTISTPATH%/likes || %TRACKPATH%/sets'},
					{key: 'ACSW', keyName: 'Alt + Ctrl + Shift + Windows', default: ''}
				];

				var urlTextInputs = [];
				urlTextInputs.length = urlTextFields.length;

				for (var i = 0, len = urlTextInputs.length; i < len; i++) {
					urlTextInputs[i] = document.createElement('input');
					urlTextInputs[i].type = 'text';
					urlTextInputs[i].id = 'Click' + urlTextFields[i].key;
					urlTextInputs[i].name = 'Click ' + urlTextFields[i].key;
					urlTextInputs[i].value = searchUrls[urlTextFields[i].key];
					urlTextInputs[i].size = 64;
					urlTextInputs[i].title =
						'Enter the URL to be searched when ' + urlTextFields[i].keyName + ' + Clicking an artistname (substitute %ARTISTNAME% for the search terms)';
					headerSettingsDiv.appendChild(urlTextInputs[i]);
					headerSettingsDiv.appendChild(document.createTextNode(' ' + urlTextFields[i].keyName + ' + Click'));
					headerSettingsDiv.appendChild(document.createElement('br'));
					if (i == 3 || i == 9 || i > 11) headerSettingsDiv.appendChild(document.createElement('br'));
				}

				var resetSettingsBtn = document.createElement('input');
				resetSettingsBtn.type = 'button';
				resetSettingsBtn.name = 'Reset';
				resetSettingsBtn.value = 'Reset';
				resetSettingsBtn.title = 'Click to reset the userscript settings to their default selections/values';
				headerSettingsDiv.appendChild(resetSettingsBtn);
				headerSettingsDiv.appendChild(document.createTextNode('\u00A0'.repeat(4)));
				resetSettingsBtn.addEventListener('click', function(){
					if (confirm('Are you sure you want to reset the userscript settings to default values?')) {
						searchTabSettingForeRadio.checked = false;
						searchTabSettingBackRadio.checked = true;
						settings.openSearchTabInBackground = true;

						searchCamelCasedArtistNamesSpacedOutCheckbox.checked = true;
						settings.searchCamelCasedArtistNamesSpacedOut = true;

						linkFacebookLinksToAboutPageCheckbox.checked = false;
						settings.linkFacebookLinksToAboutPage = false;

						artistTitleSplitPatternTextInput.value = '( "| ?- | \/+ )';
						settings.artistTitleSplitPatternText = '( "| ?- | \/+ )';
						artistTitleSplitPattern = new RegExp(settings.artistTitleSplitPatternText);

						for (var i = 0, len = urlTextInputs.length; i < len; i++) urlTextInputs[i].value = urlTextFields[i].default;
						settings.searchUrlsString =
							'{"A":"https://listen.tidal.com/search/artists?q=%ARTISTNAME%", "C":"http://www.deezer.com/search/%ARTISTNAME%/artist", ' +
							'"S":"https://redacted.ch/artist.php?artistname=%ARTISTNAME%", "W":"", "AC":"https://fnd.io/#/nz/search?mediaType=artists&term=%ARTISTNAME%", ' +
							'"AS":"https://www.discogs.com/search/?q=%ARTISTNAME%&type=artist&strict=true", "AW":"stations/artist/%ARTISTPATH% || %TRACKPATH%/recommended", ' +
							'"CS":"http://bandcamp.com/search?q=%ARTISTNAME%", "CW":"https://notwhat.cd/artist.php?artistname=%ARTISTNAME%", ' +
							'"SW":"https://orpheus.network/artist.php?artistname=%ARTISTNAME%", "ACS":"https://waffles.ch/browse.php?artist=%ARTISTNAME%&s=year&d=desc", ' +
							'"ACW":"http://www.qobuz.com/fr-fr/search?q=%ARTISTNAME%&i=boutique", "ASW":"", "CSW":"%ARTISTPATH%/likes || %TRACKPATH%/sets", "ACSW":""}';
						searchUrls = JSON.parse(settings.searchUrlsString);
					}
				});

				var saveSettingsBtn = document.createElement('input');
				saveSettingsBtn.type = 'button';
				saveSettingsBtn.name = 'Save';
				saveSettingsBtn.value = 'Save';
				saveSettingsBtn.title = 'Click to save the currently selected/specified userscript settings';
				headerSettingsDiv.appendChild(saveSettingsBtn);
				saveSettingsBtn.addEventListener('click', function(){
					settings.openSearchTabInBackground = searchTabSettingBackRadio.checked;
					settings.searchCamelCasedArtistNamesSpacedOut = searchCamelCasedArtistNamesSpacedOutCheckbox.checked;
					settings.linkFacebookLinksToAboutPage = linkFacebookLinksToAboutPageCheckbox.checked;
					for (var i = 0, len = urlTextInputs.length; i < len; i++) searchUrls[urlTextFields[i].key] = urlTextInputs[i].value;
					settings.searchUrlsString = JSON.stringify(searchUrls);
					settings.artistTitleSplitPatternText = artistTitleSplitPatternTextInput.value;
					GM_setValue('SoundCloudSearchArtistsElsewhereSettings', JSON.stringify(settings));
					alert('Settings saved!');
				});

				headerSettingsDiv.appendChild(document.createElement('br'));
				headerSettingsDiv.appendChild(document.createElement('br'));

				if (firstRun) {
					var headerSettingsLi = document.createElement('li');
					document.querySelector('ul.header__navMenu.left.sc-list-nostyle').appendChild(headerSettingsLi);

					var headerSettingsLink = document.createElement('a');
					headerSettingsLink.href = 'javascript:void(0);';
					headerSettingsLink.title = 'Click to open/close the settings panel for the SoundCloud :: Search Artists Elsewhere userscript';
					headerSettingsLink.textContent = 'Search Script';
					headerSettingsLi.appendChild(headerSettingsLink);

					headerSettingsLink.addEventListener('click', function(e) {
						if (headerSettingsDiv.style.display == 'none') {
							headerSettingsDiv.style.display = 'initial';
							window.scrollTo(0, 0);
							if (/https:\/\/soundcloud\.com\/[^\/]+\/[^\/]+\/recommended/.test(location.href)) document.querySelector('div.l-top').style.display = 'none';
						} else {
							headerSettingsDiv.style.display = 'none';
							if (/https:\/\/soundcloud\.com\/[^\/]+\/[^\/]+\/recommended/.test(location.href)) document.querySelector('div.l-top').style.display = '';
						}
					});
				}
			}, 1000);
		}
	}

	function HandleDOM_ChangeWithDelay(zEvent) {
		if (typeof zGbl_DOM_ChangeTimer == "number")
		{
			clearTimeout (zGbl_DOM_ChangeTimer);
			zGbl_DOM_ChangeTimer = '';
		}
		zGbl_DOM_ChangeTimer = setTimeout (function() { reAddSettings(); }, scriptWait);
	}

	var zGbl_DOM_ChangeTimer = '';
	var bGbl_ChangeEventListenerInstalled = false;

	window.addEventListener ("load", reAddSettings, false);
})();