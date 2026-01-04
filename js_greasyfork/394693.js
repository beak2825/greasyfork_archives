// ==UserScript==
// @name         Darkcamp
// @namespace    https://greasyfork.org/en/scripts/394693-darkcamp
// @version      0.8.1
// @description  Override text/background colors on Bandcamp; defaults to dark theme.
// @author       newstarshipsmell
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIfSURBVDhPpZJdSJNRAIaPc/1Y+VNOKyOyjOZFK/CrVEoxEgIvMiSkhMKriXWTmhIZuS5KMBJEnX1ihkLifsJIZ9OumosNtqiILoxmfySrCMYqtKk9feAHgu2i0QPPzQvPOXA4Avgvo46xGHWMxb8pMiYnFNaM5FTZRjNKHU6h63YK4XJoNA3DUv788OFaHI12Hjp8jD33U6BWS+gbG3s0F1pZ2+sl7vIkomiKtF0L5EjPKCoY4czRn9xqhlddyv1P6FezRSTZuC938Mac1n+flOAXNrsgswVKLsHx/K8Ysz2YMmcYL4HvdYSR2ammCkYRv9u8173SV0nafB+nmKLqE5gmwNyrWKm4I0LfqlkmV0dgG01qqVIszoqWFFIDOk5QrRzuxBue5uVEiHcd8LYCAokL2IUPqxia9At/vFoKob0tbUio3zqdfiWJ/U+zMHGaMboIhj2EXC+gPQAn3/A52YNtUz/1yfXH1HSR4sARefvoRvLKtVTfWcPAXB7vqYOPbWBRPNdGJNeMK6eD7oROiyzJaqkgIxuuUvvL9OMATfcSae3Jx/thPZGZPfC4EK4dgtIyAlvOc1NfEZIlY5aaLuLFY3fTiVt5NncwgyFZz6P2dYQHBa8bVjB7UMu31CTGtdlcF9Kyh1P4jb8AHtjhog3SLR6zGKgpFIPWcmEdkYS9WydszUJYugyGu7KQ4tRsieVfM1ajjrEYdfx3EX8A6rpPKLpiMFMAAAAASUVORK5CYII=
// @icon64       data:image/png;base64,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
// @include      /https?://[^/]+/([^/]+\/|)/
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/394693/Darkcamp.user.js
// @updateURL https://update.greasyfork.org/scripts/394693/Darkcamp.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var logging = false;

	var settingsTypes = [
		'mainText', 'backColor', 'primaryText', 'secondaryText', 'linkText',
		'buttonBack', 'buttonBorder', 'sliderButtonBack', 'sliderButtonBorder', 'menubarColor',
		'menubarBack', 'searchFieldColor', 'searchFieldBack', 'svgIconColor', 'recommendationsColor',
		'recommendationsBack', 'pageFooterColor', 'pageFooterBack', 'prevnextTrack'];
	var settingsNames = [
		'Main Text', 'Background Color', 'Primary Text', 'Secondary Text', 'Link Text',
		'Button Background', 'Button Border', 'Slider Button Background', 'Slider Button Border', 'Menu Bar Color',
		'Menu Bar Background', 'Search Field Color', 'Search Field Background', 'SVG Icon Color', 'Recommendations Color',
		'Recommendations Background', 'Page Footer Color', 'Page Footer Background', 'Previous Next Track'];
	var defaultSettingValues = [
		'#BFBFBF', '#0F0F0F', '#9F9F9F', '#7F7F7F', '#9F9F5F',
		'#3F3F3F', '#7F7F7F', '#3F3F3F', '#7F7F7F', '#7F7F7F',
		'#0F0F0F', '#BFBFBF', '#3F3F3F', '#7F7F7F', '#7F7F7F',
		'#0F0F0F', '#7F7F7F', '#0F0F0F', '#7F7F7F'];

	var defaultSettings = {};
	for (var i = 0, len = settingsTypes.length; i < len; i++) {
		defaultSettings[settingsTypes[i]] = defaultSettingValues[i];
	}
	var defaultSettingsStr = JSON.stringify(defaultSettings);

	var settings = GM_getValue('DarkcampSettings', defaultSettingsStr);
	try {
		settings = JSON.parse(settings);
	} catch(e) {
		settings = defaultSettings;
	}

	GM_setValue('DarkcampSettings', JSON.stringify(settings));

	var isBC;
	var maybeBC = document.querySelectorAll('meta[name="google-site-verification"]');
	if (maybeBC.length == 0 || maybeBC.length === undefined) {
		if (logging) console.log('[Darkcamp] maybeBC.length: ' + maybeBC.length);
		isBC = false;
	} else if (maybeBC[0].content == 'eBKSmW-xBn9p7kJisv_YWdQC5oZgXeXWsvaqXkrSrq4') {
		if (logging) console.log('[Darkcamp] maybeBC[0].content: ' + maybeBC[0].content);
		isBC = true;
	}
	if (logging) console.log('[Darkcamp] isBC: ' + isBC);
	if (!isBC) return;

	var menubar = GetColor('menubarColor');
	if (menubar) {
		SetColor('menubarColor', settings.menubarColor, [menubar]);
		SetColor('menubarBack', settings.menubarBack, [menubar]);
	}

	var searchField = GetColor('searchFieldColor');
	if (searchField) {
		SetColor('searchFieldColor', settings.searchFieldColor, [searchField]);
		SetColor('searchFieldBack', settings.searchFieldBack, [searchField]);
	}

	var svgs = GetColor('svgIconColor');
	if (svgs) SetColor('svgIconColor', settings.svgIconColor, svgs);

	var pgBd = GetColor('mainText');
	if (pgBd) {
		SetColor('mainText', settings.mainText, [pgBd]);
		SetColor('backColor', settings.backColor, [pgBd]);
	}

	var links = GetColor('linkText');
	if (links) SetColor('linkText', settings.linkText, links);

	var primTexts = GetColor('primaryText');
	if (primTexts) SetColor('primaryText', settings.primaryText, primTexts);

	var secTexts = GetColor('secondaryText');
	if (secTexts) SetColor('secondaryText', settings.secondaryText, secTexts);

	var buttons = GetColor('buttonBack');
	if (buttons) {
		SetColor('buttonBack', settings.buttonBack, buttons);
		SetColor('buttonBorder', settings.buttonBorder, buttons);
	}

	var sliderButton = GetColor('sliderButtonBack');
	if (sliderButton) {
		SetColor('sliderButtonBack', settings.sliderButtonBack, [sliderButton]);
		SetColor('sliderButtonBorder', settings.sliderButtonBorder, [sliderButton]);
	}

	var prevnextTrack = GetColor('prevnextTrack');
	if (prevnextTrack) SetColor('prevnextTrack', settings.prevnextTrack, prevnextTrack);

	var pageFooter = GetColor('pageFooterColor');
	if (pageFooter) {
		SetColor('pageFooterColor', settings.pageFooterColor, [pageFooter]);
		SetColor('pageFooterBack', settings.pageFooterBack, [pageFooter]);
	}

	var recommendations = GetColor('recommendationsColor');
	if (recommendations) {
		SetColor('recommendationsColor', settings.recommendationsColor, recommendations);
		SetColor('recommendationsBack', settings.recommendationsBack, recommendations);
	}

	var settingsBtn
	if (menubar) {
		try {
			settingsBtn = document.createElement('li');
			settingsBtn.id = '';
			settingsBtn.classList.add('menubar-item', 'hoverable');

			var settingsBtnA = document.createElement('a');
			settingsBtnA.href = 'javascript:void(0);';
			settingsBtnA.title = 'Darkcamp userscript settings';

			var settingsBtnImg = document.createElement('img');
			settingsBtnImg.src =
				'data:image/png;base64,' +
				'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';
			settingsBtnImg.width = '42';
			settingsBtnImg.height = '26';

			settingsBtnA.appendChild(settingsBtnImg);
			settingsBtn.appendChild(settingsBtnA);

			var feedBtn = document.getElementById('feed-main');
			feedBtn.parentNode.insertBefore(settingsBtn, feedBtn);

			var scriptSettingsDiv = document.createElement('div');
			scriptSettingsDiv.id = 'Darkcamp';
			scriptSettingsDiv.style.display = '';
			scriptSettingsDiv.style.color = settings.menubarColor;
			scriptSettingsDiv.style.background = settings.menubarBack;
			scriptSettingsDiv.style.display = 'none';

			var scriptSettingsSpan = document.createElement('span');
			scriptSettingsSpan.style.float = 'right';
			scriptSettingsSpan.style.color = settings.menubarColor;
			scriptSettingsSpan.style.background = settings.menubarBack;

			var settingsH2 = document.createElement('h2');
			settingsH2.align = 'center';

			var settingsHeaderTxt = document.createTextNode('\u00A0'.repeat(8) + 'Darkcamp settings' + '\u00A0'.repeat(12));
			settingsH2.appendChild(settingsHeaderTxt);
			scriptSettingsSpan.appendChild(settingsH2);

			var mainTextBtn = document.createElement('input');
			mainTextBtn.type = 'color';
			mainTextBtn.name = 'mainText';
			mainTextBtn.title = 'Main Text color picker';
			mainTextBtn.value = settings.mainText;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(mainTextBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Main Text'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var backColorBtn = document.createElement('input');
			backColorBtn.type = 'color';
			backColorBtn.name = 'backColor';
			backColorBtn.title = 'Background color picker';
			backColorBtn.value = settings.backColor;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(backColorBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Background'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var primaryTextBtn = document.createElement('input');
			primaryTextBtn.type = 'color';
			primaryTextBtn.name = 'primaryText';
			primaryTextBtn.title = 'Primary Text color picker';
			primaryTextBtn.value = settings.primaryText;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(primaryTextBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Primary Text'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var secondaryTextBtn = document.createElement('input');
			secondaryTextBtn.type = 'color';
			secondaryTextBtn.name = 'secondaryText';
			secondaryTextBtn.title = 'Secondary Text color picker';
			secondaryTextBtn.value = settings.secondaryText;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(secondaryTextBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Secondary Text'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var linkTextBtn = document.createElement('input');
			linkTextBtn.type = 'color';
			linkTextBtn.name = 'linkText';
			linkTextBtn.title = 'Link Text color picker';
			linkTextBtn.value = settings.linkText;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(linkTextBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Link Text'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var menubarColorBtn = document.createElement('input');
			menubarColorBtn.type = 'color';
			menubarColorBtn.name = 'menubarColor';
			menubarColorBtn.title = 'Menu Bar Text color picker';
			menubarColorBtn.value = settings.menubarColor;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(menubarColorBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Menu Bar Text'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var menubarBackBtn = document.createElement('input');
			menubarBackBtn.type = 'color';
			menubarBackBtn.name = 'menubarBack';
			menubarBackBtn.title = 'Menu Bar Background color picker';
			menubarBackBtn.value = settings.menubarBack;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(menubarBackBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Menu Bar Background'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var searchFieldColorBtn = document.createElement('input');
			searchFieldColorBtn.type = 'color';
			searchFieldColorBtn.name = 'searchFieldColor';
			searchFieldColorBtn.title = 'Search Field Text color picker';
			searchFieldColorBtn.value = settings.searchFieldColor;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(searchFieldColorBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Search Field Text'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var searchFieldBackBtn = document.createElement('input');
			searchFieldBackBtn.type = 'color';
			searchFieldBackBtn.name = 'searchFieldBack';
			searchFieldBackBtn.title = 'Search Field Background color picker';
			searchFieldBackBtn.value = settings.searchFieldBack;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(searchFieldBackBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Search Field Background'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var buttonBackBtn = document.createElement('input');
			buttonBackBtn.type = 'color';
			buttonBackBtn.name = 'buttonBack';
			buttonBackBtn.title = 'Button Background color picker';
			buttonBackBtn.value = settings.buttonBack;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(buttonBackBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Play Button'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var buttonBorderBtn = document.createElement('input');
			buttonBorderBtn.type = 'color';
			buttonBorderBtn.name = 'buttonBorder';
			buttonBorderBtn.title = 'Button Border color picker';
			buttonBorderBtn.value = settings.buttonBorder;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(buttonBorderBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Play Button Border'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var sliderButtonBackBtn = document.createElement('input');
			sliderButtonBackBtn.type = 'color';
			sliderButtonBackBtn.name = 'buttonBack';
			sliderButtonBackBtn.title = 'Slider Button color picker';
			sliderButtonBackBtn.value = settings.buttonBack;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(sliderButtonBackBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Slider Button'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var sliderButtonBorderBtn = document.createElement('input');
			sliderButtonBorderBtn.type = 'color';
			sliderButtonBorderBtn.name = 'sliderButtonBorder';
			sliderButtonBorderBtn.title = 'Slider Button Border color picker';
			sliderButtonBorderBtn.value = settings.sliderButtonBorder;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(sliderButtonBorderBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Slider Button Border'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var prevnextTrackBtn = document.createElement('input');
			prevnextTrackBtn.type = 'color';
			prevnextTrackBtn.name = 'prevnextTrack';
			prevnextTrackBtn.title = 'Prev/Next Track Button color picker';
			prevnextTrackBtn.value = settings.prevnextTrack;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(prevnextTrackBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Prev/Next Track Button'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var pageFooterColorBtn = document.createElement('input');
			pageFooterColorBtn.type = 'color';
			pageFooterColorBtn.name = 'pageFooterColor';
			pageFooterColorBtn.title = 'Page Footer Text color picker';
			pageFooterColorBtn.value = settings.pageFooterColor;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(pageFooterColorBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Page Footer Text'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var pageFooterBackBtn = document.createElement('input');
			pageFooterBackBtn.type = 'color';
			pageFooterBackBtn.name = 'pageFooterBack';
			pageFooterBackBtn.title = 'Page Footer Background color picker';
			pageFooterBackBtn.value = settings.pageFooterBack;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(pageFooterBackBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Page Footer Background'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var recommendationsColorBtn = document.createElement('input');
			recommendationsColorBtn.type = 'color';
			recommendationsColorBtn.name = 'recommendationsColor';
			recommendationsColorBtn.title = 'Recommendations Text color picker';
			recommendationsColorBtn.value = settings.recommendationsColor;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(recommendationsColorBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Recommendations Text'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var recommendationsBackBtn = document.createElement('input');
			recommendationsBackBtn.type = 'color';
			recommendationsBackBtn.name = 'recommendationsBack';
			recommendationsBackBtn.title = 'Recommendations Background color picker';
			recommendationsBackBtn.value = settings.recommendationsBack;
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(recommendationsBackBtn);
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4) + 'Recommendations Background'));
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			var resetSettingsLink = document.createElement('a');
			resetSettingsLink.href = 'javascript:void(0);';
			resetSettingsLink.title = 'Reset userscript settings to default values';
			resetSettingsLink.textContent = 'Reset';
			scriptSettingsSpan.appendChild(document.createTextNode('\u00A0'.repeat(4)));
			scriptSettingsSpan.appendChild(resetSettingsLink);
			scriptSettingsSpan.appendChild(document.createElement('br'));
			scriptSettingsSpan.appendChild(document.createElement('br'));

			mainTextBtn.addEventListener('change', function(e) {
				settings.mainText = e.target.value;
				pgBd = GetColor('mainText');
				SetColor('mainText', settings.mainText, [pgBd]);
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			primaryTextBtn.addEventListener('change', function(e) {
				settings.primaryText = e.target.value;
				primTexts = GetColor('primaryText');
				SetColor('primaryText', settings.primaryText, primTexts);
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			secondaryTextBtn.addEventListener('change', function(e) {
				settings.secondaryText = e.target.value;
				secTexts = GetColor('secondaryText');
				SetColor('secondaryText', settings.secondaryText, secTexts);
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			linkTextBtn.addEventListener('change', function(e) {
				settings.linkText = e.target.value;
				links = GetColor('linkText');
				SetColor('linkText', settings.linkText, links);
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			backColorBtn.addEventListener('change', function(e) {
				settings.backColor = e.target.value;
				pgBd = GetColor('backColor');
				SetColor('backColor', settings.backColor, [pgBd]);
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			menubarColorBtn.addEventListener('change', function(e) {
				settings.menubarColor = e.target.value;
				menubar = GetColor('menubarColor');
				SetColor('menubarColor', settings.menubarColor, [menubar]);
				scriptSettingsSpan.style.color = settings.menubarColor;
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			menubarBackBtn.addEventListener('change', function(e) {
				settings.menubarBack = e.target.value;
				menubar = GetColor('menubarColor');
				SetColor('menubarBack', settings.menubarBack, [menubar]);
				scriptSettingsSpan.style.background = settings.menubarBack;
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			searchFieldColorBtn.addEventListener('change', function(e) {
				settings.searchFieldColor = e.target.value;
				searchField = GetColor('searchFieldColor');
				SetColor('searchFieldColor', settings.searchFieldColor, [searchField]);
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			searchFieldBackBtn.addEventListener('change', function(e) {
				settings.searchFieldBack = e.target.value;
				searchField = GetColor('searchFieldColor');
				SetColor('searchFieldBack', settings.searchFieldBack, [searchField]);
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			buttonBackBtn.addEventListener('change', function(e) {
				settings.buttonBack = e.target.value;
				buttons = GetColor('buttonBack');
				SetColor('buttonBack', settings.buttonBack, buttons);
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			buttonBorderBtn.addEventListener('change', function(e) {
				settings.buttonBorder = e.target.value;
				buttons = GetColor('buttonBack');
				SetColor('buttonBorder', settings.buttonBorder, buttons);
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			sliderButtonBackBtn.addEventListener('change', function(e) {
				settings.sliderButtonBack = e.target.value;
				sliderButton = GetColor('sliderButtonBack');
				SetColor('sliderButtonBack', settings.sliderButtonBack, [sliderButton]);
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			sliderButtonBorderBtn.addEventListener('change', function(e) {
				settings.sliderButtonBorder = e.target.value;
				sliderButton = GetColor('sliderButtonBack');
				SetColor('sliderButtonBorder', settings.sliderButtonBorder, [sliderButton]);
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			prevnextTrackBtn.addEventListener('change', function(e) {
				settings.prevnextTrack = e.target.value;
				prevnextTrack = GetColor('prevnextTrack');
				SetColor('prevnextTrack', settings.prevnextTrack, prevnextTrack);
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			pageFooterColorBtn.addEventListener('change', function(e) {
				settings.pageFooterColor = e.target.value;
				pageFooter = GetColor('pageFooterColor');
				SetColor('pageFooterColor', settings.pageFooterColor, [pageFooter]);
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			pageFooterBackBtn.addEventListener('change', function(e) {
				settings.pageFooterBack = e.target.value;
				pageFooter = GetColor('pageFooterColor');
				SetColor('pageFooterBack', settings.pageFooterBack, [pageFooter]);
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			recommendationsColorBtn.addEventListener('change', function(e) {
				settings.recommendationsColor = e.target.value;
				recommendations = GetColor('recommendationsColor');
				SetColor('recommendationsColor', settings.recommendationsColor, recommendations);
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			recommendationsBackBtn.addEventListener('change', function(e) {
				settings.recommendationsBack = e.target.value;
				recommendations = GetColor('recommendationsColor');
				SetColor('recommendationsBack', settings.recommendationsBack, recommendations);
				GM_setValue('DarkcampSettings', JSON.stringify(settings));
			});

			resetSettingsLink.addEventListener('click', function(e) {
				if (confirm('Are you sure you want to reset the settings for Darkcamp?')) {
					for (i = 0, len = settingsTypes.length; i < len; i++) {
						settings[settingsTypes[i]] = defaultSettings[settingsTypes[i]];
					}
					GM_setValue('DarkcampSettings', JSON.stringify(settings));

					pgBd = GetColor('mainText');
					SetColor('mainText', settings.mainText, [pgBd]);
					mainTextBtn.value = settings.mainText;
					SetColor('backColor', settings.backColor, [pgBd]);
					backColorBtn.value = settings.backColor;

					primTexts = GetColor('primaryText');
					SetColor('primaryText', settings.primaryText, primTexts);
					primaryTextBtn.value = settings.primaryText;

					secTexts = GetColor('secondaryText');
					SetColor('secondaryText', settings.secondaryText, secTexts);
					secondaryTextBtn.value = settings.secondaryText;

					links = GetColor('linkText');
					SetColor('linkText', settings.linkText, links);
					linkTextBtn.value = settings.linkText;

					menubar = GetColor('menubarColor');
					SetColor('menubarColor', settings.menubarColor, [menubar]);
					menubarColorBtn.value = settings.menubarColor;
					SetColor('menubarBack', settings.menubarBack, [menubar]);
					menubarBackBtn.value = settings.menubarBack;
					scriptSettingsSpan.style.color = settings.menubarColor;
					scriptSettingsSpan.style.background = settings.menubarBack;

					searchField = GetColor('searchFieldColor');
					SetColor('searchFieldColor', settings.searchFieldColor, [searchField]);
					searchFieldColorBtn.value = settings.searchFieldColor;
					SetColor('searchFieldBack', settings.searchFieldBack, [searchField]);
					searchFieldBackBtn.value = settings.searchFieldBack;

					buttons = GetColor('buttonBack');
					SetColor('buttonBack', settings.buttonBack, buttons);
					buttonBackBtn.value = settings.buttonBack;
					SetColor('buttonBorder', settings.buttonBorder, buttons);
					buttonBorderBtn.value = settings.buttonBorder;

					sliderButton = GetColor('sliderButtonBack');
					SetColor('sliderButtonBack', settings.sliderButtonBack, [sliderButton]);
					sliderButtonBackBtn.value = settings.sliderButtonBack;
					SetColor('sliderButtonBorder', settings.sliderButtonBorder, [sliderButton]);
					sliderButtonBorderBtn.value = settings.sliderButtonBorder;

					prevnextTrack = GetColor('prevnextTrack');
					SetColor('prevnextTrack', settings.prevnextTrack, prevnextTrack);
					prevnextTrackBtn.value = settings.prevnextTrack;

					pageFooter = GetColor('pageFooterColor');
					SetColor('pageFooterColor', settings.pageFooterColor, [pageFooter]);
					pageFooterColorBtn.value = settings.pageFooterColor;
					SetColor('pageFooterBack', settings.pageFooterBack, [pageFooter]);
					pageFooterBackBtn.value = settings.pageFooterBack;

					recommendations = GetColor('recommendationsColor');
					SetColor('recommendationsColor', settings.recommendationsColor, recommendations);
					recommendationsColorBtn.value = settings.recommendationsColor;
					SetColor('recommendationsBack', settings.recommendationsBack, recommendations);
					recommendationsBackBtn.value = settings.recommendationsBack;

					if (logging) console.log('[Darkcamp] settings reset');
				}
			});

			scriptSettingsDiv.appendChild(scriptSettingsSpan);
			document.getElementById('menubar').parentNode.insertBefore(scriptSettingsDiv, document.getElementById('menubar').nextSibling);

			settingsBtn.addEventListener('click', function(e) {
				e.preventDefault();
				scriptSettingsDiv.style.display = (scriptSettingsDiv.style.display == 'none' ? '' : 'none');
			})

			if (logging) console.log('[Darkcamp] settingsBtn injected');
		} catch(e) {
			settingsBtn = false;
			if (logging) console.log('[Darkcamp] no settingsBtn:\nError.name: ' + e.name + '\nError.message: ' + e.message);
		}
	} else {
		settingsBtn = false;
		if (logging) console.log('[Darkcamp] no settingsBtn (no menubar)');
	}

	function GetColor(name) {
		var codeToEval = {
			'menubarColor': 'menubar = document.getElementById(\'menubar\');',
			'menubarBack': 'menubar = document.getElementById(\'menubar\');',
			'searchFieldColor': 'searchField = document.getElementById(\'search-field\');',
			'searchFieldBack': 'searchField = document.getElementById(\'search-field\');',
			'svgIconColor': 'svgs = document.querySelectorAll(\'.svg-icon\');',
			'mainText': 'pgBd = document.getElementById(\'pgBd\');',
			'backColor': 'pgBd = document.getElementById(\'pgBd\');',
			'linkText': 'links = document.querySelectorAll(\'a.custom-color, .custom-link-color, #trackInfo a:not(.notSkinnable), #trackInfo .buy-link, #tagArea a, #rightColumn a, #name-section a, #indexpage a, .editable-grid a, .featured-grid a, #band-navbar a, #merch-item p a, #merch-item .buy a, #merch-item .buy button, #merch-item .more-merch a, .share-collect-controls a, .share-collect-controls button, .follow-unfollow, .follow-unfollow div, .collected-by a, .subscribe a, .sub a, .video-list a, .sub .main a, .subwelcome a, .artists-grid-name a, .featured-grid-name, .label-welcome .buttons a.new, .themed .label-band-selector a.themeable, .tralbum-tags a\');',
			'primaryText': 'primTexts = document.querySelectorAll(\'.primaryText\');',
			'secondaryText': 'secTexts = document.querySelectorAll(\'.secondaryText\');',
			'buttonBack': 'buttons = document.querySelectorAll(\'.inline_player .playbutton, .play_status\');',
			'buttonBorder': 'buttons = document.querySelectorAll(\'.inline_player .playbutton, .play_status\');',
			'sliderButtonBack': 'sliderButton = document.querySelector(\'.inline_player .thumb\');',
			'sliderButtonBorder': 'sliderButton = document.querySelector(\'.inline_player .thumb\');',
			'prevnextTrack': 'prevnextTrack = document.querySelectorAll(\'td.prev_cell a, td.next_cell a\');',
			'pageFooterColor': 'pageFooter = document.getElementById(\'pgFt\');',
			'pageFooterBack': 'pageFooter = document.getElementById(\'pgFt\');',
			'recommendationsColor': 'recommendations = document.querySelectorAll(\'div.recommendations-container\');',
			'recommendationsBack': 'recommendations = document.querySelectorAll(\'div.recommendations-container\');',
		};

		var consoleLog = {
			'menubarColor': {'success': '\'menubar.style.color: \' + menubar.style.color', 'failure': '\'no menubar\''},
			'menubarBack': {'success': '\'menubar.style.background: \' + menubar.style.background', 'failure': '\'no menubar\''},
			'searchFieldColor': {'success': '\'searchField.style.color: \' + searchField.style.color', 'failure': '\'no searchField\''},
			'searchFieldBack': {'success': '\'searchField.style.background: \' + searchField.style.background', 'failure': '\'no searchField\''},
			'svgIconColor': {'success': '\'svgs[0].style.fill: \' + (svgs[0] === undefined ? \'undefined (svgs)\' : (svgs[0].style === undefined ? \'undefined (style)\' : (svgs[0].style.fill === undefined ? \'undefined (fill)\' : svgs[0].style.fill)))',
							 'failure': '\'no svgs\''},
			'mainText': {'success': '\'pgBd.style.color: \' + pgBd.style.color', 'failure': '\'no pgBd\''},
			'backColor': {'success': '\'pgBd.style.background: \' + pgBd.style.background', 'failure': '\'no pgBd\''},
			'linkText': {'success': '\'links[0].style.color: \' + (links[0] === undefined ? \'undefined (links)\' : (links[0].style === undefined ? \'undefined (style)\' : (links[0].style.color === undefined ? \'undefined (color)\' : links[0].style.color)))',
						 'failure': '\'no links\''},
			'primaryText': {'success': '\'primTexts[0].style.color: \' + (primTexts[0] === undefined ? \'undefined (primTexts)\' : (primTexts[0].style === undefined ? \'undefined (style)\' : (primTexts[0].style.color === undefined ? \'undefined (color)\' : primTexts[0].style.color)))',
							'failure': '\'no primTexts\''},
			'secondaryText': {'success': '\'secTexts[0].style.color: \' + (secTexts[0] === undefined ? \'undefined (primTexts)\' : (secTexts[0].style === undefined ? \'undefined (style)\' : (primTexts[0].style.color === undefined ? \'undefined (color)\' : secTexts[0].style.color)))',
							  'failure': '\'no secTexts\''},
			'buttonBack': {'success': '\'buttons[0].style.background: \' + (buttons[0] === undefined ? \'undefined (buttons)\' : (buttons[0].style === undefined ? \'undefined (style)\' : (buttons[0].style.background === undefined ? \'undefined (background)\' : buttons[0].style.background)))',
						   'failure': '\'no buttons\''},
			'buttonBorder': {'success': '\'buttons[0].style.border: 1px solid \' + (buttons[0] === undefined ? \'undefined (buttons)\' : (buttons[0].style === undefined ? \'undefined (style)\' : (buttons[0].style.border === undefined ? \'undefined (border)\' : buttons[0].style.border)))',
							 'failure': '\'no buttons\''},
			'sliderButtonBack': {'success': '\'sliderButton.style.background: \' + sliderButton.style.background', 'failure': '\'no sliderButton\''},
			'sliderButtonBorder': {'success': '\'sliderButton.style.border: 1px solid \' + sliderButton.style.border', 'failure': '\'no sliderButton\''},
			'prevnextTrack': {'success': '\'prevnextTrack[0].style.color: \' + prevnextTrack[0].style.color', 'failure': '\'no prevnextTrack\''},
			'pageFooterColor': {'success': '\'pageFooter.style.color: \' + pageFooter.style.color', 'failure': '\'no pageFooter\''},
			'pageFooterBack': {'success': '\'pageFooter.style.background: \' + pageFooter.style.background', 'failure': '\'no pageFooter\''},
			'recommendationsColor': {'success': '\'recommendations[0].style.color: \' + recommendations[0].style.color', 'failure': '\'no recommendations\''},
			'recommendationsBack': {'success': '\'recommendations[0].style.background: \' + recommendations[0].style.background', 'failure': '\'no recommendations\''},
		};

		var returnName = {
			'menubarColor': 'menubar',
			'menubarBack': 'menubar',
			'searchFieldColor': 'searchField',
			'searchFieldBack': 'searchField',
			'svgIconColor': 'svgs',
			'mainText': 'pgBd',
			'backColor': 'pgBd',
			'linkText': 'links',
			'primaryText': 'primTexts',
			'secondaryText': 'secTexts',
			'buttonBack': 'buttons',
			'buttonBorder': 'buttons',
			'sliderButtonBack': 'sliderButton',
			'sliderButtonBorder': 'sliderButton',
			'prevnextTrack': 'prevnextTrack',
			'pageFooterColor': 'pageFooter',
			'pageFooterBack': 'pageFooter',
			'recommendationsColor': 'recommendations',
			'recommendationsBack': 'recommendations',
		};

		try {
			eval(codeToEval[name]);
			if (logging) {
				console.log('[Darkcamp] ' + returnName[name] + '.length: ' + eval(returnName[name]).length);
				var clog = eval(consoleLog[name].success);
				console.log('[Darkcamp] GetColor(' + name + '):\n' + clog);
			}
			return eval(codeToEval[name]);

		} catch(e) {
			if (logging) {
				clog = eval(consoleLog[name].failure);
				console.log('[Darkcamp] GetColor(' + name + '):\nError.name: ' + e.name + '\nError.message: ' + e.message + '\n\n' + clog);
			}
			return false;
		}
	}

	function SetColor(name, color, array) {
		var codeToEval = {
			'menubarColor': 'array[0].style.color = settings.menubarColor;',
			'menubarBack': 'array[0].style.background = settings.menubarBack;',
			'searchFieldColor': 'array[0].style.color = settings.searchFieldColor;',
			'searchFieldBack': 'array[0].style.background = settings.searchFieldBack;',
			'svgIconColor': 'array[i].style.fill = settings.svgIconColor;',
			'mainText': 'array[0].style.color = settings.mainText;',
			'backColor': 'array[0].style.background = settings.backColor;',
			'linkText': 'array[i].style.color = settings.linkText;',
			'primaryText': 'array[i].style.color = settings.primaryText;',
			'secondaryText': 'array[i].style.color = settings.secondaryText;',
			'buttonBack': 'array[i].style.background = settings.buttonBack;',
			'buttonBorder': 'array[i].style.border = \'1px solid \' + settings.buttonBorder;',
			'sliderButtonBack': 'array[0].style.background = settings.sliderButtonBack;',
			'sliderButtonBorder': 'array[0].style.border = \'1px solid \' + settings.sliderButtonBorder;',
			'prevnextTrack': 'array[i].style.color = settings.prevnextTrack;',
			'pageFooterColor': 'pageFooter[i].style.color = settings.pageFooterColor;',
			'pageFooterBack': 'pageFooter[i].style.background = settings.pageFooterBack;',
			'recommendationsColor': 'array[i].style.color = settings.recommendationsColor;',
			'recommendationsBack': 'array[i].style.color = settings.recommendationsBack;',
		};

		var consoleLog = {
			'menubarColor': {'success': '\'menubar.style.color: \' + settings.menubarColor', 'failure': '\'no menubar\''},
			'menubarBack': {'success': '\'menubar.style.background: \' + settings.menubarBack', 'failure': '\'no menubar\''},
			'searchFieldColor': {'success': '\'searchField.style.color: \' + settings.searchFieldColor', 'failure': '\'no searchField\''},
			'searchFieldBack': {'success': '\'searchField.style.background: \' + settings.searchFieldBack', 'failure': '\'no searchField\''},
			'svgIconColor': {'success': '\'svgs[].style.fill: \' + settings.svgIconColor', 'failure': '\'no svgs\''},
			'mainText': {'success': '\'pgBd.style.color: \' + settings.mainText', 'failure': '\'no pgBd\''},
			'backColor': {'success': '\'pgBd.style.background: \' + settings.backColor', 'failure': '\'no pgBd\''},
			'linkText': {'success': '\'links[].style.color: \' + settings.linkText', 'failure': '\'no links\''},
			'primaryText': {'success': '\'primTexts[].style.color: \' + settings.primaryText', 'failure': '\'no primTexts\''},
			'secondaryText': {'success': '\'secTexts[].style.color: \' + settings.secondaryText', 'failure': '\'no secTexts\''},
			'buttonBack': {'success': '\'buttons[].style.background: \' + settings.buttonBack', 'failure': '\'no buttons\''},
			'buttonBorder': {'success': '\'buttons[].style.border: \' + settings.buttonBorder', 'failure': '\'no buttons\''},
			'sliderButtonBack': {'success': '\'sliderButton.style.background: \' + settings.sliderButtonBack', 'failure': '\'no sliderButton\''},
			'sliderButtonBorder': {'success': '\'sliderButton.style.border: 1px solid \' + settings.sliderButtonBorder', 'failure': '\'no sliderButton\''},
			'prevnextTrack': {'success': '\'prevnextTrack.style.color: \' + settings.prevnextTrack', 'failure': '\'no prevnextTrack\''},
			'pageFooterColor': {'success': '\'pageFooter.style.color: \' + settings.pageFooterColor', 'failure': '\'no pageFooter\''},
			'pageFooterBack': {'success': '\'pageFooter.style.background: \' + settings.pageFooterBack', 'failure': '\'no pageFooter\''},
			'recommendationsColor': {'success': '\'recommendations.style.color: \' + settings.recommendationsColor', 'failure': '\'no recommendations\''},
			'recommendationsBack': {'success': '\'recommendations.style.background: \' + settings.recommendationsBack', 'failure': '\'no recommendations\''},
		};

		var returnName = {
			'menubarColor': 'menubar',
			'menubarBack': 'menubar',
			'searchFieldColor': 'searchField',
			'searchFieldBack': 'searchField',
			'svgIconColor': 'svgs',
			'mainText': 'pgBd',
			'backColor': 'pgBd',
			'linkText': 'links',
			'primaryText': 'primTexts',
			'secondaryText': 'secTexts',
			'buttonBack': 'buttons',
			'buttonBorder': 'buttons',
			'sliderButtonBack': 'sliderButton',
			'sliderButtonBorder': 'sliderButton',
			'pageFooterColor': 'pageFooter',
			'pageFooterBack': 'pageFooter',
			'recommendationsColor': 'recommendations',
			'recommendationsBack': 'recommendations',
		};

		try {
			for (i = 0, len = array.length; i < len; i++) eval(codeToEval[name]);
			if (logging) {
				var clog = eval(consoleLog[name].success);
				console.log('[Darkcamp] SetColor(' + name + ', ' + color + '):\n' + clog);
			}
			return eval(codeToEval[name]);

		} catch(e) {
			if (logging) {
				clog = eval(consoleLog[name].failure);
				console.log('[Darkcamp] SetColor(' + name + ', ' + color + '):\nError.name: ' + e.name + '\nError.message: ' + e.message + '\n\n' + clog);
			}
			return false;
		}
	}
})();