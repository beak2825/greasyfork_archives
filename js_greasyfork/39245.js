// ==UserScript==
// @name          WaniKani Lesson Hover Details
// @namespace     https://www.wanikani.com
// @description   Show lesson breakdown by type on hover
// @author        seanblue
// @version       1.2.1
// @include       https://www.wanikani.com/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/39245/WaniKani%20Lesson%20Hover%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/39245/WaniKani%20Lesson%20Hover%20Details.meta.js
// ==/UserScript==

(function(wkof, $) {
	'use strict';

	if (!wkof) {
		var response = confirm('WaniKani Lesson Hover Details script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

		if (response) {
			window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
		}

		return;
	}

	const levelSettingOptions = {
		None: 0,
		CurrentLevel: 1,
		PriorLevels: 2
	};

	// USER SETTING: Change this to display current level data, prior level data, or no level data in parentheses. Use one of the options from "levelSettingOptions".
	const levelSetting = levelSettingOptions.CurrentLevel;

	const lessonMenuItemSelector = '.navigation .navigation-shortcut--lessons a';
	const lessonDashboardItemSelector = 'a.lessons-and-reviews__lessons-button';

    const popoverTemplate = '<div class="popover review-time"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>';

    const popoverConfig = {
        html: true,
        animation: false,
        placement: 'bottom',
        trigger: 'hover',
        template: popoverTemplate
    };

	const style = `<style>
	.popover { width: auto; }
	.lhd-table { display: table; margin: 0; padding: 0; }
	.lhd-row { display: table-row; margin: 0; padding: 0; }
	.lhd-cell { display: table-cell; margin: 0; font-size: 0.875rem; }
	.lhd-cell-title { font-weight: bold; padding: 0 5px 0 0; text-align: right; }
	.lhd-cell-value { padding: 0 0 0 5px; text-align: left; }
</style>`;

	$('head').append(style);

	wkof.include('Apiv2');
	wkof.ready('Apiv2').then(fetchData);

	function fetchData() {
		let promises = [];
		promises.push(wkof.Apiv2.get_endpoint('user'));
		promises.push(wkof.Apiv2.get_endpoint('summary'));
		promises.push(wkof.Apiv2.get_endpoint('subjects'));

		Promise.all(promises).then(processData);
	}

	function processData(results) {
		let lessonCounts = getLessonCount(results);
		setupMenuPopover(lessonCounts);
		setupDashboardPopover(lessonCounts);
	}

	function getLessonCount(results) {
		let currentLevel = results[0].level;
		let summary = results[1];
		let subjects = results[2];

		let lessonCounts = {
			radical: 0,
			kanji: 0,
			vocabulary: 0,
			kana_vocabulary: 0,
			currentLevel : {
				radical: 0,
				kanji: 0,
				vocabulary: 0,
				kana_vocabulary: 0
			}
		};

		// Pull the list of subject_ids from the lesson list in 'summary'.
		let lessonSubjectIds = summary.lessons[0].subject_ids;
		lessonSubjectIds.forEach(function(subjectId) {
			let item = subjects[subjectId];
			lessonCounts[item.object]++;

			if (item.data.level === currentLevel) {
				lessonCounts.currentLevel[item.object]++;
			}
		});

		return lessonCounts;
	}

	function setupMenuPopover(lessonCounts) {
		let lessonMenuItem = $(lessonMenuItemSelector);
		if (lessonMenuItem.length === 0) {
			return;
        }

		lessonMenuItem.attr('data-content', getPopoverHtml(lessonCounts)).popover(popoverConfig);
	}

	function setupDashboardPopover(lessonCounts) {
		let lessonDashboardItem = $(lessonDashboardItemSelector);
		if (lessonDashboardItem.length === 0) {
			return;
        }

		lessonDashboardItem.attr('data-content', getPopoverHtml(lessonCounts)).popover(popoverConfig);
	}

	function getPopoverHtml(lessonCounts) {
		return `<div class="lhd-table">
	${getPopoverSectionHtml(lessonCounts, 'Radicals', 'radical')}
	${getPopoverSectionHtml(lessonCounts, 'Kanji', 'kanji')}
	${getPopoverSectionHtml(lessonCounts, 'Vocab', 'vocabulary')}
	${getPopoverSectionHtml(lessonCounts, 'Kana Vocab', 'kana_vocabulary')}
</div>`;
	}

	function getPopoverSectionHtml(lessonCounts, sectionHeader, sectionKey) {
		let rowOpen = '<div class="lhd-row">';

		let headerCell = `<div class="lhd-cell lhd-cell-title">${sectionHeader}</div>`;
		let lessonCountCell = `<div class="lhd-cell lhd-cell-value">${lessonCounts[sectionKey]}</div>`;

		let lessonLevelCountCell = '';

		if (levelSetting === levelSettingOptions.CurrentLevel) {
			lessonLevelCountCell = `<div class="lhd-cell lhd-cell-value">(${lessonCounts.currentLevel[sectionKey]} current level)</div>`;
		}
		else if (levelSetting === levelSettingOptions.PriorLevels) {
			lessonLevelCountCell = `<div class="lhd-cell lhd-cell-value">(${lessonCounts[sectionKey] - lessonCounts.currentLevel[sectionKey]} prior levels)</div>`;
		}

		let rowClose = '</div>';

		return `${rowOpen}${headerCell}${lessonCountCell}${lessonLevelCountCell}${rowClose}`;
	}
})(window.wkof, window.jQuery);