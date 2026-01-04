// ==UserScript==
// @name         Bandcamp :: Hide Releases
// @namespace    https://greasyfork.org/en/
// @version      1.0
// @description  Hold modifier key(s) while clicking on release album/artist text to permanently hide/remove those releases from the browse pages.
// @author       newstarshipsmell
// @include      /https://bandcamp\.com/tag/.+/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/381034/Bandcamp%20%3A%3A%20Hide%20Releases.user.js
// @updateURL https://update.greasyfork.org/scripts/381034/Bandcamp%20%3A%3A%20Hide%20Releases.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var scriptWait = 250;
	var dugDeeper = false;
	var showedNewArrivals = false;
	var viewingMore = false;
	var addedSettings = false;

	var hiddenReleaseURLs = GM_getValue('BandcampHiddenReleases');
	hiddenReleaseURLs = hiddenReleaseURLs === undefined ? [] : hiddenReleaseURLs;
	GM_setValue('BandcampHiddenReleases', hiddenReleaseURLs);

	var releases, albums, releaseURL, digDeeper, newArrivals, viewMore, toAppend, settingsLink, toggleLink, scriptSettingsDiv;

	var settings = GM_getValue('BandcampHideReleasesSettings');
	settings = settings === undefined ? {} : JSON.parse(settings);
	settings.hotkeySettings = settings.hotkeySettings === undefined ? {altKey: false, ctrlKey: true, shiftKey: false, metaKey: false} : settings.hotkeySettings;
	settings.digDeeper = settings.digDeeper === undefined ? false : settings.digDeeper;
	settings.newArrivals = settings.newArrivals === undefined ? false : settings.newArrivals;
	settings.viewMore = settings.viewMore === undefined ? false : settings.viewMore;
	settings.hideReleases = true;
	GM_setValue('BandcampHideReleasesSettings', JSON.stringify(settings));

	document.addEventListener('click', function(e) {
		if (e.ctrlKey &&
			((e.target.tagName == 'DIV' &&
			  ((e.target.classList.contains('info') &&
				e.target.parentNode.classList.contains('dig-deeper-item')) ||
			   ((e.target.classList.contains('title') ||
				 e.target.classList.contains('artist')) &&
				e.target.parentNode.parentNode.parentNode.classList.contains('dig-deeper-item')))) ||
			 (e.target.tagName == 'SPAN' &&
			  e.target.getAttribute('data-bind') == 'text: artist' &&
			  e.target.parentNode.parentNode.parentNode.parentNode.classList.contains('dig-deeper-item')))) {
			e.preventDefault();

			hiddenReleaseURLs = GM_getValue('BandcampHiddenReleases');

			var releaseNode, infoNode;
			switch (e.target.tagName == 'SPAN' ? 'artist' : (e.target.classList.contains('artist') ? 'by' : (e.target.classList.contains('title') ? 'album' : 'info'))) {
				case 'info':
					releaseNode = e.target.parentNode;
					infoNode = e.target;
					releaseURL = e.target.childNodes[1].href.split('?')[0]
					break;
				case 'album':
					releaseNode = e.target.parentNode.parentNode.parentNode;
					infoNode = e.target.parentNode.parentNode;
					releaseURL = e.target.parentNode.parentNode.childNodes[1].href.split('?')[0]
					break;
				case 'by':
					releaseNode = e.target.parentNode.parentNode.parentNode;
					infoNode = e.target.parentNode.parentNode;
					releaseURL = e.target.parentNode.parentNode.childNodes[1].href.split('?')[0]
					break;
				case 'artist':
					releaseNode = e.target.parentNode.parentNode.parentNode.parentNode;
					infoNode = e.target.parentNode.parentNode.parentNode;
					releaseURL = e.target.parentNode.parentNode.parentNode.childNodes[1].href.split('?')[0]
					break;
				default:
			}

			if (hiddenReleaseURLs.indexOf(releaseURL) > -1) {
				hiddenReleaseURLs.splice(hiddenReleaseURLs.indexOf(releaseURL), 1);

				infoNode.style['background-color'] = '';

			} else {
				hiddenReleaseURLs.push(releaseURL);

				if (settings.hideReleases) {
					releaseNode.style.display = 'none';

				} else {
					infoNode.style['background-color'] = '#ff0000';

				}
			}

			GM_setValue('BandcampHiddenReleases', hiddenReleaseURLs);
		}
	});

	function hideReleases() {
		hiddenReleaseURLs = GM_getValue('BandcampHiddenReleases');

		releases = document.querySelectorAll('div.dig-deeper-items div.dig-deeper-item');
		albums = document.querySelectorAll('div.dig-deeper-items div.dig-deeper-item div.info > a');

		for (var i = 0, len = releases.length; i < len; i++) {
			releaseURL = albums[i].href.split('?')[0];

			if (hiddenReleaseURLs.indexOf(releaseURL) > -1) {

				if (settings.hideReleases) {
					releases[i].style.display = 'none';

				} else {
					releases[i].style.display = '';
					albums[i].parentNode.style['background-color'] = '#ff0000';

				}
			}
		}
	}

	function runOnContentLoad() {
		if (!bGbl_ChangeEventListenerInstalled)
		{
			bGbl_ChangeEventListenerInstalled = true;
			document.addEventListener("DOMSubtreeModified", HandleDOM_ChangeWithDelay, false);
		}

		digDeeper = document.querySelector('div.dig-deeper-section');
		if (digDeeper === undefined) return;

		if (settings.digDeeper && !dugDeeper) {
			digDeeper.scrollIntoView();
			dugDeeper = true;
		}

		if (settings.newArrivals && !showedNewArrivals) {
			newArrivals = document.querySelector('ol.sorts li:nth-of-type(2)');
			newArrivals.click();
			showedNewArrivals = true;
		}

		viewMore = document.querySelector('button.view-more');

		if (settings.viewMore && !viewingMore) {
			if (viewMore !== undefined) {
				setTimeout(function() { viewMore.click(); viewingMore = true; }, 1000);
			} else {
				viewMore.click();
				viewingMore = true;
			}
		}

		hideReleases();

		if (!addedSettings) {
			toAppend = document.querySelector('#dig-deeper ol.sorts');

			settingsLink = document.createElement('li');
			settingsLink.appendChild(document.createTextNode('userscript settings'));
			settingsLink.title = 'Click to show/hide the settings for the Bandcamp :: Hide New Arrivals userscript';
			toAppend.appendChild(settingsLink);

			scriptSettingsDiv = document.createElement('div');
			scriptSettingsDiv.id = 'userscript_settings';
			toAppend.appendChild(scriptSettingsDiv);
			scriptSettingsDiv.innerHTML = '<h2><u>Hide Releases Userscript Settings</u></h2>Remove releases by clicking the titles (below the covers) while ' +
				'holding the following modifier keys:' +
				'<br><br>&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" id="modifiers_alt" name="ModifierAlt" value="Modifier Alt" title="Check ' +
				'this checkbox to require the Alt key be depressed when clicking a release to hide/remove that release"><label ' +
				'for="modifiers_alt" title="Check this checkbox to require the Alt key be depressed when clicking a release to ' +
				'hide/remove that release"> Alt</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" id="modifiers_ctrl" ' +
				'name="ModifierCtrl" value="Modifier Ctrl" title="Check this checkbox to require the Ctrl key be depressed when clicking an upcoming ' +
				'release cover to hide/remove that release"><label for="modifiers_ctrl" title="Check this checkbox to require the Ctrl key be depressed ' +
				'when clicking a release to hide/remove that release"> Ctrl</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input ' +
				'type="checkbox" id="modifiers_shift" name="ModifierShift" value="Modifier Shift" title="Check this checkbox to require the Shift key be ' +
				'depressed when clicking a release to hide/remove that release"><label for="modifiers_shift" title="Check this checkbox to ' +
				'require the Shift key be depressed when clicking an upcoming release cover to hide/remove that release"> Shift</label>' +
				'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" id="modifiers_win" name="ModifierWin" value="Modifier Win" ' +
				'title="Check this checkbox to require the Win key be depressed when clicking an upcoming release cover to hide/remove that release"><label ' +
				'for="modifiers_win" title="Check this checkbox to require the Win key be depressed when clicking a release to hide/remove ' +
				'that release"> Win</label><br><br>Hidden IDs: "artist - title (date)":<br><textarea id="hidden_ids_titles" name="HiddenIdsArtistsTitles" ' +
				'cols="64" rows="12" title="Remove any rows for entries you no longer wish to hide"></textarea><br><br><input type="button" name="Save" ' +
				'value="Save" title="Click to save the currently selected/specified userscript settings">';
			scriptSettingsDiv.style.display = 'none';

			settingsLink.addEventListener('click', function(e) {
				scriptSettingsDiv.style.display = scriptSettingsDiv.style.display == 'none' ? '' : 'none';
				this.innerHTML = scriptSettingsDiv.style.display == '' ? '<b>userscript settings</b>' : 'userscript settings';
			});

			toggleLink = document.createElement('a');
			toggleLink.href = 'javascript:void(0);';
			toggleLink.style.float = 'right';
			toggleLink.innerHTML = '[Show Hidden]';
			toggleLink.title = 'Click to show/unhide the hidden releases';
			toAppend.appendChild(toggleLink);

			toggleLink.addEventListener('click', function(e) {
				settings.hideReleases = settings.hideReleases === true ? false : true;
				GM_setValue('BandcampHideReleasesSettings', JSON.stringify(settings));
				this.textContent = '[' + (settings.hideReleases ? 'Show' : 'Rehide') + ' Hidden]';
				hideReleases();
			});

			addedSettings = true;
		}
	}

	function HandleDOM_ChangeWithDelay(zEvent) {
		if (typeof zGbl_DOM_ChangeTimer == "number")
		{
			clearTimeout (zGbl_DOM_ChangeTimer);
			zGbl_DOM_ChangeTimer = '';
		}
		zGbl_DOM_ChangeTimer = setTimeout (function() { runOnContentLoad(); }, scriptWait);
	}

	var zGbl_DOM_ChangeTimer = '';
	var bGbl_ChangeEventListenerInstalled = false;

	window.addEventListener ("load", runOnContentLoad, false);
})();