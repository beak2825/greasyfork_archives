// ==UserScript==
// @name		  WaniKani fast pacer
// @namespace	 https://www.wanikani.com
// @description   Prioritize review of level critical items first, then sort by overdue level. A tweaked version of "WaniKani Prioritize Overdue Reviews"
// @author		ccumvas
// @version	   1.3.0
// @include	   https://www.wanikani.com/review/session
// @grant		 none
// @downloadURL https://update.greasyfork.org/scripts/411603/WaniKani%20fast%20pacer.user.js
// @updateURL https://update.greasyfork.org/scripts/411603/WaniKani%20fast%20pacer.meta.js
// ==/UserScript==

(function($, wkof) {
	const settingsScriptId = 'ccumvasFastPacer';
	const settingsTitle = 'WK Fast Pacer';

	const shouldSortItems = 'shouldSortItems';
	const overdueThresholdPercentKey = 'overdueThresholdPercent';
	const percentRandomItemsToIncludeKey = 'percentRandomItemsToInclude';
	const singleModeKey = 'singleMode';
	const nonLinearEvaluationKey = 'nonLinearEvaluation';
	const evaluateByTimeKey = 'evaluateByTime';
	const evaluateApprPlus100Key = 'evaluateApprPlus100';
	const evaluateByLevelKey = 'evaluateByLevel';

	const nonLinearCoef = [1, 10, 7, 5, 2.5, 1.5, 1.2, 1, 1, 1]

	function promise(){var a,b,c=new Promise(function(d,e){a=d;b=e;});c.resolve=a;c.reject=b;return c;}
	let settingsLoadedPromise = promise();

	let originalOverdueReviewSet;
	let originalDataItems;
	let alreadySetUpOverdueItemCountRendering = false;

	// Prevent other scripts from hijacking Math.random by using a local version.
	let localRandom = window.Math.random;

	if (!wkof) {
		var response = confirm('WaniKani Fast Pacer script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

		if (response) {
			window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
		}

		return;
	}

	wkof.include('ItemData, Settings, Menu');
	wkof.ready('document, Settings, Menu').then(loadSettings);
	wkof.ready('document, ItemData').then(reorderReviews);
	wkof.ready('document').then(setupUI);

	function loadSettings() {
		wkof.Menu.insert_script_link({ name: settingsScriptId, submenu:'Settings', title: settingsTitle, on_click: openSettings });

		let defaultSettings = {};
		defaultSettings[overdueThresholdPercentKey] = 20;
		defaultSettings[percentRandomItemsToIncludeKey] = 25;
		defaultSettings[shouldSortItems] = false;
		defaultSettings[singleModeKey] = false;
		defaultSettings[evaluateByTimeKey] = false;
		defaultSettings[evaluateApprPlus100Key] = false;
		defaultSettings[evaluateByLevelKey] = false;
		defaultSettings[nonLinearEvaluationKey] = true;

		wkof.Settings.load(settingsScriptId, defaultSettings).then(function() {
			settingsLoadedPromise.resolve();
		});

		return settingsLoadedPromise;
	}

	function openSettings() {
		var settings = {};
		settings[overdueThresholdPercentKey] = { type: 'number', label: 'Overdue Threshold (%)', hover_tip: 'When should a review be considered overdue? This is based on the SRS level and time since the review became available.&#013;WARNING: Setting this too low could harm your long term retention!' };
		settings[percentRandomItemsToIncludeKey] = { type: 'number', label: 'Randomness Factor (%)', hover_tip: 'What percentage of the overdue queue should be filled with random items? Including random items helps prevent you from knowing too much about what reviews will show up.&#013;WARNING: Setting this too low could harm your long term retention!' };
		settings[singleModeKey] = { type: 'checkbox', label: 'Single mode', hover_tip: 'Set true to quickly handle critical reviews.&#013;WARNING: Checking this could harm your long term retention!' };

		settings[shouldSortItems] = { type: 'checkbox', label: 'Sort items', hover_tip: 'Should the overdue queue remain random or be sorted to prioritize the most overdue items?&#013;WARNING: Setting this to "Sorted" could harm your long term retention!' };
		settings[percentRandomItemsToIncludeKey] = { type: 'number', label: 'Randomness Factor (%)', hover_tip: 'What percentage of the overdue queue should be filled with random items? Including random items helps prevent you from knowing too much about what reviews will show up.&#013;WARNING: Setting this too low could harm your long term retention!' };
		settings[nonLinearEvaluationKey] = { type: 'checkbox', label: 'Non linear evaluation', hover_tip: 'Assignes even higher priority to Apprentice and Guru items' };
		settings[evaluateByTimeKey] = { type: 'checkbox', label: 'Evaluate by time due', hover_tip: '' };
		settings[evaluateApprPlus100Key] = { type: 'checkbox', label: '+100% for Apprentice evaluation', hover_tip: 'Adds 100% overdue to all Apprentice' };
		settings[evaluateByLevelKey] = { type: 'checkbox', label: 'Evaluation by level (Catastrophe mode)', hover_tip: 'Prioritizes lower level items allowing you to finish them without mixing with the rest. ENABLE WHEN you gathered a huge pile of overdue items (500+)' };

		let settingsDialog = new wkof.Settings({
			script_id: settingsScriptId,
			title: settingsTitle,
			on_save: onUpdateSettings,
			settings: settings
		});

		settingsDialog.open();
	}

	function onUpdateSettings() {
		setupUI();
		reorderReviews();
	}

	function reorderReviews() {
		let promises = [];

		promises.push(wkof.Apiv2.get_endpoint('spaced_repetition_systems'));
		promises.push(wkof.ItemData.get_items('assignments'));
		promises.push(settingsLoadedPromise); // This should go last to not interfere with the data actually returned from the other two promises.
		if (wkof.settings[settingsScriptId][singleModeKey]) {
			try{
				unsafeWindow.Math.random = function() { return 0; }
			} catch(e) {
				Math.random = function() { return 0; }
			}
		}
		return Promise.all(promises)
				.then(processData)
				.then(updateReviewQueue);
	}

	function processData(results) {
		let spacedRepetitionSystems = results[0];
		let items = results[1];
		originalDataItems = items;

		let now = new Date().getTime();
		let overduePercentList = items.filter(item => isReviewAvailable(item, now)).map(item => mapToOverduePercentData(item, now, spacedRepetitionSystems));

		return toOverduePercentDictionary(overduePercentList);
	}

	function isReviewAvailable(item, now) {
		return (item.assignments && (item.assignments.available_at != null) && (new Date(item.assignments.available_at).getTime() < now));
	}

	function mapToOverduePercentData(item, now, spacedRepetitionSystems) {
		let overduePercent = 0;
		
		if (wkof.settings[settingsScriptId][evaluateByTimeKey]) {
			let availableAtMs = new Date(item.assignments.available_at).getTime();
			let msSinceAvailable = now - availableAtMs;
			let msForSrsStage = getIntervalInMilliseconds(item, spacedRepetitionSystems);
			overduePercent = msSinceAvailable / msForSrsStage;
		}
		
		if (wkof.settings[settingsScriptId][evaluateApprPlus100Key] && isApprentice(item)) {
			overduePercent++; // [1-2]
		}
		if (wkof.settings[settingsScriptId][evaluateByLevelKey]) {
			let difference = wkof.user.level - item.data.level;
			overduePercent += difference / 30;
		}
		if (wkof.settings[settingsScriptId][nonLinearEvaluationKey]) {
			overduePercent = overduePercent * nonLinearCoef[item.assignments.srs_stage]; // [1-600]
		}
		if (isLevelCritical(item)) {
			overduePercent = Number.MAX_SAFE_INTEGER; // [1-MAX]
		}

		// console.log('itemEvaluated=' + item.data.slug + ', level=' + item.data.level + ', srsStage=' + item.assignments.srs_stage + ', overduePercent=' + overduePercent)

		return {
			id: item.id,
			item: item.data.slug,
			srs_stage: item.assignments.srs_stage,
			available_at_time: item.assignments.available_at,
			overdue_percent: overduePercent
		};
	}

	function isLevelCritical(item) {
		return isApprentice(item) && (item.object == "radical" || item.object == "kanji") && item.data.level == wkof.user.level;
	}

	function isApprentice(item) {
		return item.assignments.srs_stage < 5;
	}

	function getIntervalInMilliseconds(item, spacedRepetitionSystems) {
		let itemSpacedRepetitionSystemId = item.data.spaced_repetition_system_id;
		let itemSpacedRepetitionSystem = Object.values(spacedRepetitionSystems).find((system) => system.id === itemSpacedRepetitionSystemId);

		let intervalData = itemSpacedRepetitionSystem.data.stages[item.assignments.srs_stage];

		switch (intervalData.interval_unit) {
			case 'milliseconds':
				return intervalData.interval;
			case 'seconds':
				return intervalData.interval * 1000;
			default:
				throw Error('Unsupported interval unit');
		}
	}

	function toOverduePercentDictionary(items) {
		var dict = {};

		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			dict[item.id] = item.overdue_percent;
		}

		return dict;
	}

	function updateReviewQueue(overduePercentDictionary) {
		let settings = wkof.settings[settingsScriptId];
		let overdueThreshold = Math.max(0, settings[overdueThresholdPercentKey] / 100) || 0;
		let percentRandomItemsToInclude = Math.min(1, Math.max(0, settings[percentRandomItemsToIncludeKey] / 100)) || 0;

		let reviewQueue = getFullReviewQueue();
		shuffle(reviewQueue); // Need to reshuffle in case the queue has already been sorted.

		originalOverdueReviewSet = getoriginalOverdueReviewSet(overduePercentDictionary, overdueThreshold);
		let overdueQueue = reviewQueue.filter(item => originalOverdueReviewSet.has(item.id));
		let notOverdueQueue = reviewQueue.filter(item => !overdueQueue.includes(item));

		if (settings[shouldSortItems]) {
			overdueQueue = overdueQueue.sort((item1, item2) => sortQueueByOverduePercent(item1, item2, overduePercentDictionary));
		}

		randomlyAddNotOverdueItems(overdueQueue, notOverdueQueue, percentRandomItemsToInclude);

		let queue = overdueQueue.concat(notOverdueQueue);

		for (let i = 0; i < queue.length; i++) {
			let it = queue[i];
			if (overduePercentDictionary[it.id] === Number.MAX_SAFE_INTEGER) {
				queue.splice(i, 1);
				queue.splice(0, 0, it);
			}
		}

		updateQueueState(queue);
	}

	function getFullReviewQueue() {
		return $.jStorage.get('activeQueue').concat($.jStorage.get('reviewQueue'));
	}

	function getoriginalOverdueReviewSet(overduePercentDictionary, overdueThreshold) {
		let itemIds = Object.keys(overduePercentDictionary).map(key => parseInt(key));
		let overdueItems = itemIds.filter(key => overduePercentDictionary[key] >= overdueThreshold);

		return new Set(overdueItems);
	}

	// Fisher–Yates Shuffle
	function shuffle(array) {
		let m = array.length;

		while (m > 0) {
			let i = Math.floor(localRandom() * m);
			m--;

			let t = array[m];
			array[m] = array[i];
			array[i] = t;
		}

		return array;
	}

	function randomlyAddNotOverdueItems(overdueQueue, notOverdueQueue, percentRandomItemsToInclude) {
		let randomNumberOfNotOverdueItemsToInsert = Math.min(Math.ceil(percentRandomItemsToInclude * overdueQueue.length), notOverdueQueue.length);

		for (let i = 0; i < randomNumberOfNotOverdueItemsToInsert; i++) {
			// Allow equal chance between any existing array index and the end of the array to avoid bias.
			let randomIndex = getRandomArrayIndex(overdueQueue.length + 1);
			overdueQueue.splice(randomIndex, 0, notOverdueQueue[0]);
			notOverdueQueue.splice(0, 1);
		}
	}

	function getRandomArrayIndex(arraySize) {
		return Math.floor(localRandom() * arraySize);
	}

	function sortQueueByOverduePercent(item1, item2, overduePercentDictionary) {
		let overduePercentCompare = overduePercentDictionary[item1.id] - overduePercentDictionary[item2.id];
		if (overduePercentCompare > 0) {
			return -1;
		}

		if (overduePercentCompare < 0) {
			return 1;
		}

		return item1.id - item2.id;
	}

	function updateQueueState(queue) {
		let batchSize = 10;

		let activeQueue = queue.slice(0, batchSize);
		let inactiveQueue = queue.slice(batchSize).reverse(); // Reverse the queue since subsequent items are grabbed from the end of the queue.

		$.jStorage.set('activeQueue', activeQueue);
		$.jStorage.set('reviewQueue', inactiveQueue);

		let newCurrentItem = activeQueue[0];
		let newItemType = getItemType(newCurrentItem);

		$.jStorage.set('questionType', newItemType);
		$.jStorage.set('currentItem', newCurrentItem);
	}

	// Mostly copied from WaniKani source code.
	function getItemType(item) {
		if (item.rad) {
			return 'meaning';
		}

		let itemReviewData = item.kan ? $.jStorage.get('k' + item.id) : $.jStorage.get('v' + item.id);

		if (itemReviewData === null || (typeof itemReviewData.mc === 'undefined' && typeof itemReviewData.rc === 'undefined')) {
			return ['meaning', 'reading'][Math.floor(2 * Math.random())];
		}

		if (itemReviewData.mc >= 1) {
			return 'reading';
		}

		return 'meaning'
	}

	function setupUI() {
		settingsLoadedPromise.then(function() {

			if (!alreadySetUpOverdueItemCountRendering) {
				var stats = $("#stats")[0];
				var t = document.createElement('div');
				stats.appendChild(t);
				t.innerHTML = '<div id="wkfpStatus"><table align="right"><tbody>'+
						'<tr><td>Rad</td><td align="right"><span id="wkfpRadCount"></span></td></tr>'+
						'<tr><td>Kan</td><td align="right"><span id="wkfpKanCount"></span></td></tr>'+
						'<tr><td>Voc</td><td align="right"><span id="wkfpVocCount"></span></td></tr>'+
						'<tr><td>Overdue (critical)</td><td align="right"><span id="wkfpOverdueCount"></span></td></tr>'+
						'<tr><td>Overdue apprentice</td><td align="right"><span id="wkfpApprCount"></span></td></tr>'+
						'</tbody></table></div>';

				$.jStorage.listenKeyChange('currentItem', updateOverdueCountOnPage);

				alreadySetUpOverdueItemCountRendering = true;
			}
		});
	}

	function updateOverdueCountOnPage(key) {
		var radC = 0, kanC = 0, vocC = 0, ovdC = 0, critC = 0, apprC = 0, ovdApprC = 0;

		getFullReviewQueue().forEach(it => {
			if (it.srs < 5) {
				apprC++;
				if (originalOverdueReviewSet && originalOverdueReviewSet.has(it.id)) {
					ovdApprC++;
				}
			}

			if (it.rad) {
				radC++;
			} else if(it.kan) {
				kanC++;
			} else if(it.voc) {
				vocC++;
			}

			if (originalOverdueReviewSet && originalOverdueReviewSet.has(it.id)) {
				ovdC++;
			}

			if (originalDataItems && isLevelCritical(originalDataItems.find(dataItem => dataItem.id == it.id))) {
				critC++;
			}
		});

		$('#wkfpOverdueCount')[0].innerHTML = ovdC + "(" + critC + ")";
		$("#wkfpRadCount")[0].innerHTML = radC;
		$("#wkfpKanCount")[0].innerHTML = kanC;
		$("#wkfpVocCount")[0].innerHTML = vocC;
		$("#wkfpApprCount")[0].innerHTML = ovdApprC + "/" + apprC;
	}

})(window.jQuery, window.wkof);
