// ==UserScript==
// @name         SoundCloud :: Filter Stream / Hide Releases
// @namespace    https://greasyfork.org/en/scripts/380892-soundcloud-filter-stream-hide-releases
// @version      1.4
// @description  Filter/hide Promoted, Reposted, and Track/Playlist content from your Stream page, as well as hide individual releases/groups.
// @author       newstarshipsmell
// @include      https://soundcloud.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/380892/SoundCloud%20%3A%3A%20Filter%20Stream%20%20Hide%20Releases.user.js
// @updateURL https://update.greasyfork.org/scripts/380892/SoundCloud%20%3A%3A%20Filter%20Stream%20%20Hide%20Releases.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var filterGroupStr, filterGroups, groups, groupURLs, groupCovers, hotkeySettings, hotkeySettingsStr, toAppend, h1, promotedCheckbox,
		promotedLabel, repostsCheckbox, repostsLabel, tracksCheckbox, tracksLabel, playlistsCheckbox, playlistsLabel, hiddenCheckbox, hiddenLabel, showHideHidden,
		hiddenURLs, optionsLink, optionsLinkLi, optionsDiv, hotkeySettingsAltCheckbox, hotkeySettingsAltLabel, hotkeySettingsCtrlCheckbox, hotkeySettingsCtrlLabel,
		hotkeySettingsShiftCheckbox, hotkeySettingsShiftLabel, hotkeySettingsWinCheckbox, hotkeySettingsWinLabel, borderSettingsStr, borderSettings,
		borderCoverRadio, borderCoverLabel, borderReleaseRadio, borderReleaseLabel, borderWidth, borderColor, hiddenURLsText, sortURLsBtn, saveSettingsBtn,
		settings, settingsStr, artistTitleSplitPattern, searchUrls;

	var addedOptions = false;
	var currentPage = location.href;
	var lastPage = null;

	var scriptWait = 250;

	function hideSomeContent() {
		if (!bGbl_ChangeEventListenerInstalled)
		{
			bGbl_ChangeEventListenerInstalled = true;
			document.addEventListener("DOMSubtreeModified", HandleDOM_ChangeWithDelay, false);
		}

		currentPage = location.href;
		if (currentPage !== 'https://soundcloud.com/stream' &&
			!/https:\/\/soundcloud\.com\/[^\/]+\/[^\/]+\/recommended/.test(currentPage)) {
			addedOptions = false;
			lastPage = currentPage;
			return;
		} else if (currentPage != lastPage) {
			addedOptions = false;
			lastPage = currentPage;
		}

		settingsStr = GM_getValue('SoundCloudFilterStreamHideReleasesSettings');
		settings = settingsStr === undefined ? {} : JSON.parse(settingsStr);
		settings.filterGroups = settings.filterGroups === undefined ? {} : settings.filterGroups;
		settings.filterGroups.Promoted = settings.filterGroups.Promoted === undefined ? false : settings.filterGroups.Promoted;
		settings.filterGroups.Reposts = settings.filterGroups.Reposts === undefined ? false : settings.filterGroups.Reposts;
		settings.filterGroups.Tracks = settings.filterGroups.Tracks === undefined ? false : settings.filterGroups.Tracks;
		settings.filterGroups.Playlists = settings.filterGroups.Playlists === undefined ? false : settings.filterGroups.Playlists;
		settings.filterGroups.Hidden = settings.filterGroups.Hidden === undefined ? true : settings.filterGroups.Hidden;
		settings.filterGroups.Hidden = !addedOptions ? true : settings.filterGroups.Hidden;
		settings.hotkeySettings = settings.hotkeySettings === undefined ? {} : settings.hotkeySettings;
		settings.hotkeySettings.altKey = settings.hotkeySettings.altKey === undefined ? false : settings.hotkeySettings.altKey;
		settings.hotkeySettings.ctrlKey = settings.hotkeySettings.ctrlKey === undefined ? true : settings.hotkeySettings.ctrlKey;
		settings.hotkeySettings.shiftKey = settings.hotkeySettings.shiftKey === undefined ? false : settings.hotkeySettings.shiftKey;
		settings.hotkeySettings.metaKey = settings.hotkeySettings.metaKey === undefined ? false : settings.hotkeySettings.metaKey;
		settings.borderSettings = settings.borderSettings === undefined ? {} : settings.borderSettings;
		settings.borderSettings.cover = settings.borderSettings.cover === undefined ? false : settings.borderSettings.cover;
		settings.borderSettings.width = settings.borderSettings.width === undefined ? '5' : settings.borderSettings.width;
		settings.borderSettings.color = settings.borderSettings.color === undefined ? '#ff0000' : settings.borderSettings.color;
		GM_setValue('SoundCloudFilterStreamHideReleasesSettings', JSON.stringify(settings));

		hiddenURLs = GM_getValue('SoundCloudFilterStreamHideReleasesHiddenURLs');
		hiddenURLs = hiddenURLs === undefined ? [] : hiddenURLs;
		GM_setValue('SoundCloudFilterStreamHideReleasesHiddenURLs', hiddenURLs);

		if (!addedOptions) {
			toAppend = document.querySelector(
				currentPage == 'https://soundcloud.com/stream' ? 'h1.stream__title' : 'div.relatedList__explanation');

			if (currentPage == 'https://soundcloud.com/stream') {
				toAppend.appendChild(document.createElement('br'));
				toAppend.appendChild(document.createElement('br'));
				toAppend.appendChild(document.createTextNode('Hide:' + '\u00A0'.repeat(8)));

				promotedCheckbox = document.createElement('input');
				promotedCheckbox.type = 'checkbox';
				promotedCheckbox.id = 'Promoted';
				promotedCheckbox.name = 'Promoted';
				//promotedCheckbox.checked = settings.filterGroups.Promoted;

				promotedCheckbox.checked = false;//quick fix until i see more promoted to play with
				promotedCheckbox.disabled = true;

				promotedLabel = document.createElement('label');
				promotedLabel.setAttribute('for', 'Promoted');
				promotedLabel.title = 'Check to hide any Promoted content\nUncheck to reshow it';
				promotedLabel.appendChild(document.createTextNode(' Promoted'));
				toAppend.appendChild(promotedCheckbox);
				toAppend.appendChild(promotedLabel);
				toAppend.appendChild(document.createTextNode('\u00A0'.repeat(8)));
				promotedCheckbox.addEventListener('click', function(e) {
					settings.filterGroups.Promoted = promotedCheckbox.checked;
					GM_setValue('SoundCloudFilterStreamHideReleasesSettings', JSON.stringify(settings));
					hideGroupsNow();
				});

				repostsCheckbox = document.createElement('input');
				repostsCheckbox.type = 'checkbox';
				repostsCheckbox.id = 'Reposts';
				repostsCheckbox.name = 'Reposts';
				repostsCheckbox.checked = settings.filterGroups.Reposts;
				toAppend.appendChild(repostsCheckbox);
				repostsLabel = document.createElement('label');
				repostsLabel.setAttribute('for', 'Reposts');
				repostsLabel.title = 'Check to hide any Reposted content\nUncheck to reshow it';
				repostsLabel.appendChild(document.createTextNode(' Reposts'));
				toAppend.appendChild(repostsLabel);
				toAppend.appendChild(document.createTextNode('\u00A0'.repeat(8)));
				repostsCheckbox.addEventListener('click', function(e) {
					settings.filterGroups.Reposts = repostsCheckbox.checked;
					GM_setValue('SoundCloudFilterStreamHideReleasesSettings', JSON.stringify(settings));
					hideGroupsNow();
				});

				tracksCheckbox = document.createElement('input');
				tracksCheckbox.type = 'checkbox';
				tracksCheckbox.id = 'Tracks';
				tracksCheckbox.name = 'Tracks';
				tracksCheckbox.checked = settings.filterGroups.Tracks;
				tracksLabel = document.createElement('label');
				tracksLabel.setAttribute('for', 'Tracks');
				tracksLabel.title = 'Check to hide any Track content (only Playlists will be displayed)\nUncheck to reshow it';
				tracksLabel.appendChild(document.createTextNode(' Tracks'));
				toAppend.appendChild(tracksCheckbox);
				toAppend.appendChild(tracksLabel);
				toAppend.appendChild(document.createTextNode('\u00A0'.repeat(8)));

				playlistsCheckbox = document.createElement('input');
				playlistsCheckbox.type = 'checkbox';
				playlistsCheckbox.id = 'Playlists';
				playlistsCheckbox.name = 'Playlists';
				playlistsCheckbox.checked = settings.filterGroups.Playlists && !tracksCheckbox.checked ? true : false;
				playlistsLabel = document.createElement('label');
				playlistsLabel.setAttribute('for', 'Playlists');
				playlistsLabel.title = 'Check to hide any Playlist content (only Tracks will be displayed)\nUncheck to reshow it';
				playlistsLabel.appendChild(document.createTextNode(' Playlists'));
				toAppend.appendChild(playlistsCheckbox);
				toAppend.appendChild(playlistsLabel);
				toAppend.appendChild(document.createTextNode('\u00A0'.repeat(8)));

				tracksCheckbox.addEventListener('click', function(){
					if (tracksCheckbox.checked) playlistsCheckbox.checked = false;
					settings.filterGroups.Tracks = tracksCheckbox.checked;
					settings.filterGroups.Playlists = playlistsCheckbox.checked;
					GM_setValue('SoundCloudFilterStreamHideReleasesSettings', JSON.stringify(settings));
					hideGroupsNow();
				});

				playlistsCheckbox.addEventListener('click', function(){
					if (playlistsCheckbox.checked) tracksCheckbox.checked = false;
					settings.filterGroups.Tracks = tracksCheckbox.checked;
					settings.filterGroups.Playlists = playlistsCheckbox.checked;
					GM_setValue('SoundCloudFilterStreamHideReleasesSettings', JSON.stringify(settings));
					hideGroupsNow();
				});

				hiddenCheckbox = document.createElement('input');
				hiddenCheckbox.type = 'checkbox';
				hiddenCheckbox.id = 'Hidden';
				hiddenCheckbox.name = 'Hidden';
				hiddenCheckbox.checked = settings.filterGroups.Hidden ? true : false;
				hiddenLabel = document.createElement('label');
				hiddenLabel.setAttribute('for', 'Hidden');
				hiddenLabel.title = 'Uncheck to reshow any individually Hidden content\nRecheck to rehide it';
				hiddenLabel.appendChild(document.createTextNode(' Hidden'));
				toAppend.appendChild(hiddenCheckbox);
				toAppend.appendChild(hiddenLabel);
				toAppend.appendChild(document.createTextNode('\u00A0'.repeat(16)));
				hiddenCheckbox.addEventListener('click', function(e) {
					settings.filterGroups.Hidden = hiddenCheckbox.checked;
					GM_setValue('SoundCloudFilterStreamHideReleasesSettings', JSON.stringify(settings));
					hideGroupsNow();
				});

				optionsLink = document.createElement('a');
				optionsLink.href = 'javascript:void(0);';
				optionsLink.title = 'Click to open/close the settings panel for the SoundCloud :: Filter Stream / Hide Releases userscript';
				optionsLink.textContent = '[Filter Script]';
				toAppend.appendChild(optionsLink);

			} else {
				optionsLinkLi = document.createElement('li');
				optionsLinkLi.classList.add('g-tabs-item');
				document.querySelector('ul.listenNetworkTabs').appendChild(optionsLinkLi);
				optionsLink = document.createElement('a');
				optionsLink.href = 'javascript:void(0);';
				optionsLink.title = 'Click to open/close the settings panel for the SoundCloud :: Filter Stream / Hide Releases userscript';
				optionsLink.textContent = 'Filter Script';
				optionsLinkLi.appendChild(optionsLink);

				showHideHidden = document.createElement('a');
				showHideHidden.href = 'javascript:void(0);';
				showHideHidden.style.float = 'right';
				showHideHidden.title = 'Click to show/rehide the hidden releases';
				showHideHidden.textContent = '[Show Hidden]';
				toAppend.appendChild(showHideHidden);

				showHideHidden.addEventListener('click', function(e) {
					settings.filterGroups.Hidden = settings.filterGroups.Hidden === true ? false : true;
					this.textContent = settings.filterGroups.Hidden ? '[Show Hidden]' : '[Rehide Hidden]';
					GM_setValue('SoundCloudFilterStreamHideReleasesSettings', JSON.stringify(settings));
					hideGroupsNow();
				});
			}

			optionsDiv = document.createElement('div');
			optionsDiv.style.display = 'none';
			optionsDiv.innerHTML += '<br><br><u>Filter Stream / Hide Releases Userscript Settings:</u><br><br>';
			toAppend.appendChild(optionsDiv);

			optionsDiv.appendChild(document.createTextNode('Hide individual posts by clicking the covers while holding the following modifier keys:'));
			optionsDiv.appendChild(document.createElement('br'));
			optionsDiv.appendChild(document.createElement('br'));

			hotkeySettingsAltCheckbox = document.createElement('input');
			hotkeySettingsAltCheckbox.type = 'checkbox';
			hotkeySettingsAltCheckbox.id = 'modifiers_alt';
			hotkeySettingsAltCheckbox.name = 'ModifierAlt';
			hotkeySettingsAltCheckbox.value = 'Modifier Alt';
			hotkeySettingsAltCheckbox.title = 'Check this checkbox to require the Alt key be depressed when clicking a post cover to hide that release';
			hotkeySettingsAltCheckbox.checked = settings.hotkeySettings.altKey;
			optionsDiv.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			optionsDiv.appendChild(hotkeySettingsAltCheckbox);
			hotkeySettingsAltLabel = document.createElement('label');
			hotkeySettingsAltLabel.setAttribute('for', 'modifiers_alt');
			hotkeySettingsAltLabel.title = hotkeySettingsAltCheckbox.title;
			hotkeySettingsAltLabel.appendChild(document.createTextNode(' Alt'));
			optionsDiv.appendChild(hotkeySettingsAltLabel);
			optionsDiv.appendChild(document.createTextNode('\u00A0'.repeat(4)));

			hotkeySettingsCtrlCheckbox = document.createElement('input');
			hotkeySettingsCtrlCheckbox.type = 'checkbox';
			hotkeySettingsCtrlCheckbox.id = 'modifiers_ctrl';
			hotkeySettingsCtrlCheckbox.name = 'ModifierCtrl';
			hotkeySettingsCtrlCheckbox.value = 'Modifier Ctrl';
			hotkeySettingsCtrlCheckbox.title = 'Check this checkbox to require the Ctrl key be depressed when clicking a post cover to hide that release';
			hotkeySettingsCtrlCheckbox.checked = settings.hotkeySettings.ctrlKey;
			optionsDiv.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			optionsDiv.appendChild(hotkeySettingsCtrlCheckbox);
			hotkeySettingsCtrlLabel = document.createElement('label');
			hotkeySettingsCtrlLabel.setAttribute('for', 'modifiers_ctrl');
			hotkeySettingsCtrlLabel.title = hotkeySettingsCtrlCheckbox.title;
			hotkeySettingsCtrlLabel.appendChild(document.createTextNode(' Ctrl'));
			optionsDiv.appendChild(hotkeySettingsCtrlLabel);
			optionsDiv.appendChild(document.createTextNode('\u00A0'.repeat(4)));

			hotkeySettingsShiftCheckbox = document.createElement('input');
			hotkeySettingsShiftCheckbox.type = 'checkbox';
			hotkeySettingsShiftCheckbox.id = 'modifiers_shift';
			hotkeySettingsShiftCheckbox.name = 'ModifierShift';
			hotkeySettingsShiftCheckbox.value = 'Modifier Shift';
			hotkeySettingsShiftCheckbox.title = 'Check this checkbox to require the Shift key be depressed when clicking a post cover to hide that release';
			hotkeySettingsShiftCheckbox.checked = settings.hotkeySettings.shiftKey;
			optionsDiv.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			optionsDiv.appendChild(hotkeySettingsShiftCheckbox);
			hotkeySettingsShiftLabel = document.createElement('label');
			hotkeySettingsShiftLabel.setAttribute('for', 'modifiers_shift');
			hotkeySettingsShiftLabel.title = hotkeySettingsShiftCheckbox.title;
			hotkeySettingsShiftLabel.appendChild(document.createTextNode(' Shift'));
			optionsDiv.appendChild(hotkeySettingsShiftLabel);
			optionsDiv.appendChild(document.createTextNode('\u00A0'.repeat(4)));

			hotkeySettingsWinCheckbox = document.createElement('input');
			hotkeySettingsWinCheckbox.type = 'checkbox';
			hotkeySettingsWinCheckbox.id = 'modifiers_win';
			hotkeySettingsWinCheckbox.name = 'ModifierWin';
			hotkeySettingsWinCheckbox.value = 'Modifier Win';
			hotkeySettingsWinCheckbox.title = 'Check this checkbox to require the Win key be depressed when clicking a post cover to hide that release';
			hotkeySettingsWinCheckbox.checked = settings.hotkeySettings.metaKey;
			optionsDiv.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			optionsDiv.appendChild(hotkeySettingsWinCheckbox);
			hotkeySettingsWinLabel = document.createElement('label');
			hotkeySettingsWinLabel.setAttribute('for', 'modifiers_win');
			hotkeySettingsWinLabel.title = hotkeySettingsWinCheckbox.title;
			hotkeySettingsWinLabel.appendChild(document.createTextNode(' Win'));
			optionsDiv.appendChild(hotkeySettingsWinLabel);

			optionsDiv.appendChild(document.createElement('br'));
			optionsDiv.appendChild(document.createElement('br'));
			optionsDiv.appendChild(document.createTextNode('Add a border around "hidden" releases while unhidden to their:'));
			optionsDiv.appendChild(document.createElement('br'));
			optionsDiv.appendChild(document.createElement('br'));

			//borderWidth, borderColor
			borderCoverRadio = document.createElement('input');
			borderCoverRadio.type = 'radio';
			borderCoverRadio.id = 'border_cover';
			borderCoverRadio.name = 'BorderCover';
			borderCoverRadio.value = 'Border Cover';
			borderCoverRadio.title = 'Select this radio to add a border around releases\' cover artwork when hidden and hidden are shown';
			borderCoverRadio.checked = settings.borderSettings.cover;
			optionsDiv.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			optionsDiv.appendChild(borderCoverRadio);
			borderCoverLabel = document.createElement('label');
			borderCoverLabel.setAttribute('for', 'border_cover');
			borderCoverLabel.title = borderCoverRadio.title;
			borderCoverLabel.appendChild(document.createTextNode(' Cover'));
			optionsDiv.appendChild(borderCoverLabel);
			optionsDiv.appendChild(document.createTextNode('\u00A0'.repeat(4)));

			borderReleaseRadio = document.createElement('input');
			borderReleaseRadio.type = 'radio';
			borderReleaseRadio.id = 'border_release';
			borderReleaseRadio.name = 'BorderRelease';
			borderReleaseRadio.value = 'Border Release';
			borderReleaseRadio.title = 'Select this radio to add a border around the entire release when hidden and hidden are shown';
			borderReleaseRadio.checked = settings.borderSettings.cover ? false : true;
			optionsDiv.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			optionsDiv.appendChild(borderReleaseRadio);
			borderReleaseLabel = document.createElement('label');
			borderReleaseLabel.setAttribute('for', 'border_release');
			borderReleaseLabel.title = borderReleaseRadio.title;
			borderReleaseLabel.appendChild(document.createTextNode(' Release'));
			optionsDiv.appendChild(borderReleaseLabel);
			optionsDiv.appendChild(document.createElement('br'));
			optionsDiv.appendChild(document.createElement('br'));

			borderCoverRadio.addEventListener('click', function(e) {
				borderCoverRadio.checked = true;
				borderReleaseRadio.checked = false;
				settings.borderSettings.cover = true;
			});

			borderReleaseRadio.addEventListener('click', function(e) {
				borderCoverRadio.checked = false;
				borderReleaseRadio.checked = true;
				settings.borderSettings.cover = false;
			});

			optionsDiv.appendChild(document.createTextNode('Border width:' + '\u00A0'.repeat(4)));

			borderWidth = document.createElement('input');
			borderWidth.type = 'number';
			borderWidth.id = 'border_width';
			borderWidth.name = 'BorderWidth';
			borderWidth.min = '1';
			borderWidth.max = '8';
			borderWidth.value = settings.borderSettings.width;
			borderWidth.title = 'Select a number of pixels between 1 and 8 for the border width in pixels';
			optionsDiv.appendChild(borderWidth);
			optionsDiv.appendChild(document.createTextNode('\u00A0'.repeat(4)));

			optionsDiv.appendChild(document.createTextNode('Border color:' + '\u00A0'.repeat(4)));

			borderColor = document.createElement('input');
			borderColor.type = 'color';
			borderColor.id = 'border_color';
			borderColor.name = 'BorderColor';
			borderColor.value = settings.borderSettings.color;
			borderColor.title = 'Select a color for the border';
			optionsDiv.appendChild(borderColor);

			optionsDiv.appendChild(document.createElement('br'));
			optionsDiv.appendChild(document.createElement('br'));
			optionsDiv.appendChild(document.createTextNode('Hidden URLs:'));
			optionsDiv.appendChild(document.createElement('br'));

			hiddenURLsText = document.createElement('textarea');
			hiddenURLsText.id = 'hidden_urls';
			hiddenURLsText.name = 'HiddenURLs';
			hiddenURLsText.value = hiddenURLs.join('\n');
			hiddenURLsText.cols = '64';
			hiddenURLsText.rows = '12';
			hiddenURLsText.title = 'Remove any rows for entries you no longer wish to hide';
			optionsDiv.appendChild(hiddenURLsText);
			optionsDiv.appendChild(document.createElement('br'));
			optionsDiv.appendChild(document.createElement('br'));

			saveSettingsBtn = document.createElement('input');
			saveSettingsBtn.type = 'button';
			saveSettingsBtn.name = 'Save';
			saveSettingsBtn.value = 'Save';
			saveSettingsBtn.title = 'Click to save the currently selected/specified userscript settings';
			optionsDiv.appendChild(saveSettingsBtn);
			saveSettingsBtn.addEventListener('click', function(){
				settings.hotkeySettings.altKey = hotkeySettingsAltCheckbox.checked;
				settings.hotkeySettings.ctrlKey = hotkeySettingsCtrlCheckbox.checked;
				settings.hotkeySettings.shiftKey = hotkeySettingsShiftCheckbox.checked;
				settings.hotkeySettings.metaKey = hotkeySettingsWinCheckbox.checked;
				settings.borderSettings.cover = borderCoverRadio.checked;
				settings.borderSettings.width = borderWidth.value;
				settings.borderSettings.color = borderColor.value;
				hiddenCheckbox.checked = true;
				settings.filterGroups.Hidden = true;
				GM_setValue('SoundCloudFilterStreamHideReleasesSettings', JSON.stringify(settings));
				GM_setValue('SoundCloudFilterStreamHideReleasesHiddenURLs', hiddenURLsText.value == '' ? [] : hiddenURLsText.value.split('\n'));

				optionsDiv.style.display = 'none';
				hideGroupsNow();
				alert('Settings for Filter Stream userscript have been saved!');
			});

			addedOptions = true;

			optionsLink.addEventListener('click', function(e) {
				optionsDiv.style.display = optionsDiv.style.display == 'none' ? '' : 'none';
				if (optionsDiv.style.display == 'none') return;
				settings = JSON.parse(GM_getValue('SoundCloudFilterStreamHideReleasesSettings'));
				hotkeySettingsAltCheckbox.checked = hotkeySettings.altKey;
				hotkeySettingsCtrlCheckbox.checked = hotkeySettings.ctrlKey;
				hotkeySettingsShiftCheckbox.checked = hotkeySettings.shiftKey;
				hotkeySettingsWinCheckbox.checked = hotkeySettings.metaKey;

				hiddenURLs = GM_getValue('SoundCloudFilterStreamHideReleasesHiddenURLs');
				hiddenURLs = hiddenURLs === undefined ? [] : hiddenURLs;
				hiddenURLsText.value = hiddenURLs.join('\n');
			});
		}

		hideGroupsNow();
	}

	function hideGroupsNow() {
		groups = document.querySelectorAll('div[role="group"]');
		groupURLs = document.querySelectorAll('div[role="group"] a.soundTitle__title.sc-link-dark');
		groupCovers = document.querySelectorAll('div[role="group"] div.sound__artwork span.sc-artwork');

		settings = JSON.parse(GM_getValue('SoundCloudFilterStreamHideReleasesSettings'));
		hiddenURLs = GM_getValue('SoundCloudFilterStreamHideReleasesHiddenURLs');
		hiddenURLs = hiddenURLs === undefined ? [] : hiddenURLs;

		for (var i = 0, len = groups.length; i < len; i++) {
			var hideThisGroup = false;

			if (location.href == 'https://soundcloud.com/stream') {
				//if (groups[i].childNodes[1].childNodes[1].classList.contains('sc-promoted-icon')) hideThisGroup = true;

				if (settings.filterGroups.Reposts && /reposted by/.test(groups[i].getAttribute('aria-label'))) hideThisGroup = true;

				if (settings.filterGroups.Tracks && /^Track:/.test(groups[i].getAttribute('aria-label'))) hideThisGroup = true;

				if (settings.filterGroups.Playlists && /^Playlist:/.test(groups[i].getAttribute('aria-label'))) hideThisGroup = true;
			}

			if (hiddenURLs.indexOf(groupURLs[i].href.replace(/https:\/\/soundcloud\.com\//, '')) > -1) {
				if (settings.filterGroups.Hidden) hideThisGroup = true;

				if (settings.borderSettings.cover) {
					groupCovers[i].style.border = settings.borderSettings.width + 'px solid ' + settings.borderSettings.color;
				} else {
					groupCovers[i].parentNode.parentNode.parentNode.parentNode.style.border =
						settings.borderSettings.width + 'px solid ' + settings.borderSettings.color;
				}

			} else {
				groupCovers[i].style.border = '';
				groupCovers[i].parentNode.parentNode.parentNode.parentNode.style.border = '';
			}

			var newDisplay;
			if (hideThisGroup) {
				newDisplay = 'none';
			} else {
				newDisplay = '';
			}

			if (location.href == 'https://soundcloud.com/stream') {
				groups[i].parentNode.parentNode.style.display = newDisplay;
			} else {
				groups[i].parentNode.style.display = newDisplay;
			}
		}
	}

	document.addEventListener('click', function(e) {
		settings = JSON.parse(GM_getValue('SoundCloudFilterStreamHideReleasesSettings'));

		hiddenURLs = GM_getValue('SoundCloudFilterStreamHideReleasesHiddenURLs');
		hiddenURLs = hiddenURLs === undefined ? [] : hiddenURLs;

		if ((e.altKey == settings.hotkeySettings.altKey &&
			 e.ctrlKey == settings.hotkeySettings.ctrlKey &&
			 e.shiftKey == settings.hotkeySettings.shiftKey &&
			 e.metaKey == settings.hotkeySettings.metaKey) &&
			(e.target.tagName == 'SPAN' &&
			 e.target.classList.contains('sc-artwork') &&
			 e.target.parentNode.parentNode.parentNode.classList.contains('sound__artwork') &&
			 (e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains('soundList__item') &&
			  location.href != 'https://soundcloud.com/stream') ||
			 (e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains('soundList__item') &&
			  location.href == 'https://soundcloud.com/stream'))) {
			e.preventDefault();

			if (settings.filterGroups.Hidden) {
				hiddenURLs.push(e.target.parentNode.parentNode.href.replace(/https:\/\/soundcloud\.com\//, ''));
				if (location.href == 'https://soundcloud.com/stream') {
					e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
				} else {
					e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
				}

				if (settings.borderSettings.cover) {
					e.target.style.border = settings.borderSettings.width + 'px solid ' + settings.borderSettings.color;
				} else {
					e.target.parentNode.parentNode.parentNode.parentNode.style.border = settings.borderSettings.width + 'px solid ' + settings.borderSettings.color;
				}

			} else if (hiddenURLs.indexOf(e.target.parentNode.parentNode.href.replace(/https:\/\/soundcloud\.com\//, '')) < 0) {
				hiddenURLs.push(e.target.parentNode.parentNode.href.replace(/https:\/\/soundcloud\.com\//, ''));

				if (settings.borderSettings.cover) {
					e.target.style.border = settings.borderSettings.width + 'px solid ' + settings.borderSettings.color;
				} else {
					e.target.parentNode.parentNode.parentNode.parentNode.style.border = settings.borderSettings.width + 'px solid ' + settings.borderSettings.color;
				}

			} else {
				hiddenURLs.splice(hiddenURLs.indexOf(e.target.parentNode.parentNode.href.replace(/https:\/\/soundcloud\.com\//, '')), 1);
				e.target.style.border = '';
				e.target.parentNode.parentNode.parentNode.parentNode.style.border = '';
			}

			GM_setValue('SoundCloudFilterStreamHideReleasesHiddenURLs', hiddenURLs);
		}
	});

	if (GM_addValueChangeListener) {
		GM_addValueChangeListener('SoundCloudFilterStreamHideReleasesSettings', function(SoundCloudFilterStreamHideReleasesSettings, oldSettings, newSettings, remote) {
			if (!remote) return;

			settings = newSettings === undefined ? {} : JSON.parse(newSettings);
			settings.filterGroups = settings.filterGroups === undefined ? {} : settings.filterGroups;
			settings.filterGroups.Promoted = settings.filterGroups.Promoted === undefined ? false : settings.filterGroups.Promoted;
			settings.filterGroups.Reposts = settings.filterGroups.Reposts === undefined ? false : settings.filterGroups.Reposts;
			settings.filterGroups.Tracks = settings.filterGroups.Tracks === undefined ? false : settings.filterGroups.Tracks;
			settings.filterGroups.Playlists = settings.filterGroups.Playlists === undefined ? false : settings.filterGroups.Playlists;
			settings.filterGroups.Hidden = settings.filterGroups.Hidden === undefined ? true : settings.filterGroups.Hidden;
			settings.filterGroups.Hidden = !addedOptions ? true : settings.filterGroups.Hidden;
			settings.hotkeySettings = settings.hotkeySettings === undefined ? {} : settings.hotkeySettings;
			settings.hotkeySettings.altKey = settings.hotkeySettings.altKey === undefined ? false : settings.hotkeySettings.altKey;
			settings.hotkeySettings.ctrlKey = settings.hotkeySettings.ctrlKey === undefined ? true : settings.hotkeySettings.ctrlKey;
			settings.hotkeySettings.shiftKey = settings.hotkeySettings.shiftKey === undefined ? false : settings.hotkeySettings.shiftKey;
			settings.hotkeySettings.metaKey = settings.hotkeySettings.metaKey === undefined ? false : settings.hotkeySettings.metaKey;
			settings.borderSettings = settings.borderSettings === undefined ? {} : settings.borderSettings;
			settings.borderSettings.cover = settings.borderSettings.cover === undefined ? false : settings.borderSettings.cover;
			settings.borderSettings.width = settings.borderSettings.width === undefined ? '5' : settings.borderSettings.width;
			settings.borderSettings.color = settings.borderSettings.color === undefined ? '#ff0000' : settings.borderSettings.color;
		});
	}

	if (GM_addValueChangeListener) {
		GM_addValueChangeListener('SoundCloudFilterStreamHideReleasesHiddenURLs', function(SoundCloudFilterStreamHideReleasesHiddenURLs, oldSettings, newSettings, remote) {
			if (!remote) return;

			hiddenURLs = newSettings;
			hiddenURLs = hiddenURLs === undefined ? [] : hiddenURLs;
			hideGroupsNow();
		});
	}


	function HandleDOM_ChangeWithDelay(zEvent) {
		if (typeof zGbl_DOM_ChangeTimer == "number")
		{
			clearTimeout (zGbl_DOM_ChangeTimer);
			zGbl_DOM_ChangeTimer = '';
		}
		zGbl_DOM_ChangeTimer = setTimeout (function() { hideSomeContent(); }, scriptWait);
	}

	var zGbl_DOM_ChangeTimer = '';
	var bGbl_ChangeEventListenerInstalled = false;

	window.addEventListener ("load", hideSomeContent, false);
})();