// ==UserScript==
// @name          WaniKani Prioritize Overdue Reviews
// @namespace     https://www.wanikani.com
// @description   Prioritize review items that are more overdue based on their SRS level and when the review became available.
// @author        seanblue
// @version       1.0.1
// @include       https://www.wanikani.com/review/session
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/381208/WaniKani%20Prioritize%20Overdue%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/381208/WaniKani%20Prioritize%20Overdue%20Reviews.meta.js
// ==/UserScript==

(function($, wkof) {
	const settingsScriptId = 'prioritizeOverdueReviews';
	const settingsTitle = 'Prioritize Overdue Reviews';

	const shouldSortOverdueItemsKey = 'shouldSortOverdueItems';
	const overdueThresholdPercentKey = 'overdueThresholdPercent';
	const percentRandomItemsToIncludeKey = 'percentRandomItemsToInclude';
	const shouldDisplayOverdueItemCountKey = 'shouldDisplayOverdueItemCount';

	function promise(){var a,b,c=new Promise(function(d,e){a=d;b=e;});c.resolve=a;c.reject=b;return c;}
	let settingsLoadedPromise = promise();

	let overdueReviewCountSpan = $('<span />');
	let overdueReviewIcon = $('<i class="icon-medkit" />');
	let originalOverdueReviewSet;
	let alreadySetUpOverdueItemCountRendering = false;

	// Prevent other scripts from hijacking Math.random by using a local version.
	let localRandom = window.Math.random;

	if (!wkof) {
		var response = confirm('WaniKani Prioritize Overdue Reviews script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

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
		defaultSettings[shouldSortOverdueItemsKey] = 'random';
		defaultSettings[shouldDisplayOverdueItemCountKey] = false;

		wkof.Settings.load(settingsScriptId, defaultSettings).then(function() {
			settingsLoadedPromise.resolve();
		});

		return settingsLoadedPromise;
	}

	function openSettings() {
		var settings = {};
		settings[overdueThresholdPercentKey] = { type: 'number', label: 'Overdue Threshold (%)', hover_tip: 'When should a review be considered overdue? This is based on the SRS level and time since the review became available.&#013;WARNING: Setting this too low could harm your long term retention!' };
		settings[percentRandomItemsToIncludeKey] = { type: 'number', label: 'Randomness Factor (%)', hover_tip: 'What percentage of the overdue queue should be filled with random items? Including random items helps prevent you from knowing too much about what reviews will show up.&#013;WARNING: Setting this too low could harm your long term retention!' };
		settings[shouldSortOverdueItemsKey] = { type: 'dropdown', label: 'Overdue Item Sorting', content: {'random': 'Random','sorted':'Sorted'}, hover_tip: 'Should the overdue queue remain random or be sorted to prioritize the most overdue items?&#013;WARNING: Setting this to "Sorted" could harm your long term retention!' };
		settings[shouldDisplayOverdueItemCountKey] = { type: 'checkbox', label: 'Display Overdue Count', hover_tip: 'Should the number of overdue items be displayed?' };

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

		return Promise.all(promises).then(processData).then(updateReviewQueue);
	}

	function processData(results) {
		let spacedRepetitionSystems = results[0];
		let items = results[1];

		let now = new Date().getTime();
		let overduePercentList = items.filter(item => isReviewAvailable(item, now)).map(item => mapToOverduePercentData(item, now, spacedRepetitionSystems));

		return toOverduePercentDictionary(overduePercentList);
	}

	function isReviewAvailable(item, now) {
		return (item.assignments && (item.assignments.available_at != null) && (new Date(item.assignments.available_at).getTime() < now));
	}

	function mapToOverduePercentData(item, now, spacedRepetitionSystems) {
		let availableAtMs = new Date(item.assignments.available_at).getTime();
		let msSinceAvailable = now - availableAtMs;

		let msForSrsStage = getIntervalInMilliseconds(item, spacedRepetitionSystems);

		let overduePercent = msSinceAvailable / msForSrsStage;

		return {
			id: item.id,
			item: item.data.slug,
			srs_stage: item.assignments.srs_stage,
			available_at_time: item.assignments.available_at,
			overdue_percent: overduePercent
		};
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
		let shouldSortOverdueItems = settings[shouldSortOverdueItemsKey] === 'sorted';

		let reviewQueue = getFullReviewQueue();
		shuffle(reviewQueue); // Need to reshuffle in case the queue has already been sorted.

		originalOverdueReviewSet = getoriginalOverdueReviewSet(overduePercentDictionary, overdueThreshold);
		let overdueQueue = reviewQueue.filter(item => originalOverdueReviewSet.has(item.id));
		let notOverdueQueue = reviewQueue.filter(item => !overdueQueue.includes(item));

		if (shouldSortOverdueItems) {
			overdueQueue = overdueQueue.sort((item1, item2) => sortQueueByOverduePercent(item1, item2, overduePercentDictionary));
		}

		randomlyAddNotOverdueItems(overdueQueue, notOverdueQueue, percentRandomItemsToInclude);

		let queue = overdueQueue.concat(notOverdueQueue);

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
			let shouldSetUpOverdueItemCountRendering = wkof.settings[settingsScriptId][shouldDisplayOverdueItemCountKey];

			if (shouldSetUpOverdueItemCountRendering && !alreadySetUpOverdueItemCountRendering) {
				$('#stats').prepend(overdueReviewCountSpan).prepend(overdueReviewIcon);

				$.jStorage.listenKeyChange('currentItem', updateOverdueCountOnPage);

				alreadySetUpOverdueItemCountRendering = true;
			}
			else if (!shouldSetUpOverdueItemCountRendering && alreadySetUpOverdueItemCountRendering) {
				overdueReviewCountSpan.remove();
				overdueReviewIcon.remove();

				$.jStorage.stopListening('currentItem', updateOverdueCountOnPage);

				alreadySetUpOverdueItemCountRendering = false;
			}
		});
	}

	function updateOverdueCountOnPage(key) {
		let remainingReviewIds = getFullReviewQueue().map(item => item.id);
		let remainingOverdueReviewSet = new Set(remainingReviewIds.filter(id => originalOverdueReviewSet.has(id)));

		overdueReviewCountSpan.text(remainingOverdueReviewSet.size);
	}

})(window.jQuery, window.wkof);