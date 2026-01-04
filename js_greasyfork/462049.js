// ==UserScript==
// @name         WaniKani Queue Manipulator
// @namespace    waniKaniQueueManipulator
// @version      1.19
// @description  Library script that other userscripts can use to manipulate the review queue.
// @author       Sinyaven
// @license      MIT-0
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462049/WaniKani%20Queue%20Manipulator.user.js
// @updateURL https://update.greasyfork.org/scripts/462049/WaniKani%20Queue%20Manipulator.meta.js
// ==/UserScript==

((global, unsafeGlobal) => {
	"use strict";
	/* eslint no-multi-spaces: off */

	const VERSION               = `1.19`;
	const SCRIPT_NAME           = `WaniKani Queue Manipulator`;
	const PRELOAD_MAX_LENGTH    = 100;
	const MANIPULATION_KEYWORDS = [`totalChange`, `filter`, `reorder`, `postprocessing`];

	let manipulations           = {totalChange: [], filter: [], reorder: [], postprocessing: []};
	let completeSubjectsInOrder = null;
	let questionOrder           = null;
	let lessonBatchSize         = null;
	let fetchedLessonBatchSize  = null;
	let originalQueue           = null;
	let originalLessonQueue     = null;
	let currentLessonQueue      = null;
	let subjectById             = new Map();
	let srsById                 = new Map();
	let wkofById                = new Map();
	let finishedIds             = new Set();
	let wkofPreparedEndpoints   = new Set();
	let maxEntryId              = 0;
	let allIncludedLessonUrl    = null;
	let modifiedLessonStart     = false; // flag to notify that lessonQuiz => next lesson batch visit was already modified and should not be modified again (and again, and again, ...)
	let lessonPickerLesson      = false; // Even if the script is loaded while on a lesson page, I think there is no way of knowing if the lesson was started from the lesson picker?
	let rootElement             = document.body;
	let pendingPromise          = null;
	let replacedByNewerVersion  = false;

	// root element can be the Turbo newBody that is going to be rendered, or the current document.body
	function getRootElement() {
		if (!relevantRootElementChildren(rootElement).length) rootElement = document.body;
		return rootElement;
	}

	// it seems like Turbo does not move the SVG and the .wk-modal element into document.body, so let's ignore it
	function relevantRootElementChildren(rootElement) {
		return [...rootElement?.children ?? []].filter(c => c.tagName !== `svg` && !c.classList.contains(`wk-modal`));
	}

	function getCurrentState(url = document.URL) {
		if      (                          isFullLessonQuizUrl(url)) return `lessonQuiz`;
		else if (url.includes(`wanikani.com/subjects/review`      )) return `review`;
		else if (url.includes(`wanikani.com/subjects/extra_study` )) return `extraStudy`;
		else if (/wanikani.com\/recent-mistakes\/.*quiz/ .test(url)) return `extraStudy`;
		else if (     isBasicLessonUrl(url) || isFullLessonUrl(url)) return `lesson`;
		else                                                         return `other`;
	}

	async function init() {
		if (currentlyLearning() && currentLessonQueue) {
			modifyLessonPageBatch(currentIdFromLessonUrl(document.URL), currentLessonQueue.slice(0, lessonBatchSize ?? fetchedLessonBatchSize), getRootElement(), document.URL);
			return;
		}

		originalQueue = null;
		srsById       = new Map();
		finishedIds   = new Set();
		await applyManipulations();
	}

	function registerListeners() {
		document.addEventListener(`turbo:before-render`, handleTurboBeforeRender);
		document.addEventListener(`turbo:before-visit` , handleTurboBeforeVisit);
		document.addEventListener(`turbo:visit`        , handleTurboVisit);
		window  .addEventListener(`didCompleteSubject` , handleDidCompleteSubject);
	}

	function unregisterListeners() {
		document.removeEventListener(`turbo:before-render`, handleTurboBeforeRender);
		document.removeEventListener(`turbo:before-visit` , handleTurboBeforeVisit);
		document.removeEventListener(`turbo:visit`        , handleTurboVisit);
		window  .removeEventListener(`didCompleteSubject` , handleDidCompleteSubject);
	}

	async function handleTurboBeforeRender(e) {
		if (lessonPickerLesson) return;
		e.preventDefault();
		rootElement = e.detail.newBody;
		try {
			await (pendingPromise = pendingPromise.then(init));
		} catch {
			pendingPromise = Promise.resolve();
		} finally {
			e.detail.resume();
		}
	}

	function handleTurboBeforeVisit(e) {
		if (lessonPickerLesson) return;
		let nextLessonBatch = getCurrentState() === `lessonQuiz` && getCurrentState(e.detail.url) === `lesson` && !modifiedLessonStart;
		let lessonPickerInitiated = document.URL == `https://www.wanikani.com/subject-lessons/picker` && getCurrentState(e.detail.url) === `lesson` && !modifiedLessonStart;
		modifiedLessonStart = false;
		if (!isBasicLessonUrl(e.detail.url) && !nextLessonBatch && !lessonPickerInitiated) return;

		if (lessonPickerInitiated) {
			lessonPickerLesson = true;
			return;
		}

		let currentState = `lesson`;
		let manipulationsToApply = activeManipulations(currentState);
		if (manipulationsToApply.length === 0 && lessonBatchSize === null && currentLessonQueue === null) return;
		e.preventDefault();
		if (currentLessonQueue === null) {
			applyManipulationsToLessonQueue(e.detail.url, manipulationsToApply, true, {on: currentState});
		} else {
			applyManipulationsToLessonQueue(e.detail.url, [], false, {on: currentState});
		}
	}

	function handleTurboVisit(e) {
		let currentState = getCurrentState(e.detail.url);
		if (![`lesson`, `lessonQuiz`].includes(currentState)) { currentLessonQueue = null; originalLessonQueue = null; lessonPickerLesson = false; }
	}

	function handleDidCompleteSubject(e) {
		finishedIds.add(e.detail.subjectWithStats.subject.id);
	}

	function currentlyReviewing() {
		return ![`other`, `lesson`].includes(getCurrentState());
	}

	function currentlyLearning(url) {
		return getCurrentState(url) === `lesson`;
	}

	function renewTurboController(element) {
		let newElement = element.cloneNode(true);
		element.replaceWith(newElement);
		newElement.dispatchEvent(new CustomEvent(`replacedNode`, { detail: { oldNode: element, newNode: newElement }, bubbles: true, cancelable: false, composed: false }));
	}

	function activeManipulations(currentState) {
		currentState ??= getCurrentState();
		let allManipulations = [...manipulations.totalChange, ...manipulations.filter, ...manipulations.reorder];
		return allManipulations.filter(m => m.stateSelector.on.includes(currentState));
	}

	function activePostprocessing(currentState) {
		currentState ??= getCurrentState();
		return manipulations.postprocessing.filter(m => m.stateSelector.on.includes(currentState));
	}

	async function applyManipulation(callback, options) {
		await (pendingPromise = pendingPromise.then(() => Promise.all([
			applyManipulations([{callback, options}], activePostprocessing(), false),
			applyManipulationsToLessonQueue(document.URL, [{callback, options}], false),
		])));
	}

	async function applyManipulations(manipulationsToApply = activeManipulations(), postprocessingToApply = activePostprocessing(), baseOnOriginalQueue = true, currentState = {on: getCurrentState()}) {
		if (!currentlyReviewing() || !_domReady()) return;

		currentState = Object.freeze(currentState);
		let queueElementsRoot = getRootElement();

		let {queueElement, subjectsElement, subjectIdsElement, subjectIdsWithSrsElement} = getQueueElements();
		saveOriginalQueue(subjectsElement, subjectIdsElement, subjectIdsWithSrsElement);
		// update queue
		let baseQueue = baseOnOriginalQueue ? originalQueue.filter(q => !finishedIds.has(q.id)) : getCurrentReviewQueue(subjectIdsElement, subjectIdsWithSrsElement);
		let newQueue = await manipulationsToApply.reduce(tryExecutingManipulatorCallback.bind(null, currentState), baseQueue);
		let newSubjects = (await prepareQueue(postprocessingToApply.length ? newQueue : cutOffQueue(newQueue, PRELOAD_MAX_LENGTH), {subject: true})).map(q => toPostprocessingWrapper(q));
		newSubjects = await postprocessingToApply.reduce(tryExecutingPostprocessingCallback.bind(null, currentState), newSubjects);
		newSubjects = newSubjects.map(s => s.subject);

		if (queueElementsRoot !== getRootElement()) {
			console.warn(`${SCRIPT_NAME}: Turbo rendering continued before manipulation was finished`);
			({queueElement, subjectsElement, subjectIdsElement, subjectIdsWithSrsElement} = getQueueElements());
		}

		modifyQueue(newQueue, newSubjects, queueElement, subjectsElement, subjectIdsElement, subjectIdsWithSrsElement);
	}

	function modifyQueue(newQueue, newSubjects, queueElement, subjectsElement, subjectIdsElement, subjectIdsWithSrsElement) {
		backupNewQueueInDom(newQueue, newSubjects, queueElement, subjectsElement, subjectIdsElement, subjectIdsWithSrsElement);
		try {
			let quizQueue = getController(`quiz-queue`).quizQueue;
			modifyQueueBySettingStimulusControllerVariables(newQueue, newSubjects, quizQueue);
		} catch {
			console.info(`${SCRIPT_NAME}: Fallback to modifying the queue by renewing the quiz-queue Stimulus controller`);
			modifyQueueByRenewingStimulusController(newSubjects, queueElement);
		}
		updateRemainingElementsDisplay(newQueue);
	}

	function modifyQueueBySettingStimulusControllerVariables(newQueue, newSubjects, quizQueue) {
		quizQueue.totalItems = newQueue.length;
		quizQueue.remainingIds = newQueue.slice(newSubjects.length).map(q => q.id);
		quizQueue.activeQueue = newSubjects.splice(0, quizQueue.maxActiveQueueSize);
		quizQueue.backlogQueue = newSubjects;
		quizQueue.completeSubjectsInOrder = completeSubjectsInOrder;
		quizQueue.questionOrder = questionOrder;
		quizQueue.updateQuizProgress();
		quizQueue.nextItem();
	}

	async function modifyQueueByRenewingStimulusController(newSubjects, queueElement) {
		renewTurboController(queueElement);
		// update character header type
		await new Promise(resolve => setTimeout(resolve, 50));
		let characterHeader = getRootElement().querySelector(`.character-header`);
		characterHeader.classList.remove(`character-header--radical`, `character-header--kanji`, `character-header--vocabulary`);
		characterHeader.classList.add(`character-header--${newSubjects[0]?.subject_category.toLowerCase()}`);
		// do it again a bit later, because WK sometimes continues changing the class list for a while
		await new Promise(resolve => setTimeout(resolve, 1000));
		characterHeader.classList.remove(`character-header--radical`, `character-header--kanji`, `character-header--vocabulary`);
		characterHeader.classList.add(`character-header--${newSubjects[0]?.subject_category.toLowerCase()}`);
	}

	function updateRemainingElementsDisplay(newQueue) {
		let quizStatistics = getRootElement().querySelector(`.quiz-statistics`);
		if (quizStatistics !== null) {
			quizStatistics.querySelector(`[data-quiz-statistics-target="remainingCount"]`).textContent = newQueue.length;

			try {
				let quizStatController = getController(`quiz-statistics`);
				quizStatController.remainingCount = newQueue.length;
			} catch {
				console.info(`${SCRIPT_NAME}: Fallback to modifying the quiz-statistics by renewing the quiz-statistics Stimulus controller`);
				renewTurboController(quizStatistics);
			}
		}
	}

	function backupNewQueueInDom(newQueue, newSubjects, queueElement, subjectsElement, subjectIdsElement, subjectIdsWithSrsElement) {
		subjectsElement.textContent = JSON.stringify(newSubjects);
		if (subjectIdsElement        !== null)        subjectIdsElement.textContent = JSON.stringify(newQueue.map(q => q.id));
		if (subjectIdsWithSrsElement !== null) subjectIdsWithSrsElement.textContent = JSON.stringify(Object.assign(JSON.parse(subjectIdsWithSrsElement.textContent), {subject_ids_with_srs_info: newQueue.map(q => [q.id, q.srs ?? 1, q.item?.data.spaced_repetition_system_id ?? 1])}));
		applyQuizSettings(queueElement);
	}

	// from @rfindley
	function getController(name, rootElement = getRootElement()) {
		return unsafeGlobal.Stimulus.getControllerForElementAndIdentifier(rootElement.querySelector(`[data-controller~="${name}"]`), name);
	}

	function isBasicLessonUrl(url) {
		return new URL(url).pathname === `/subject-lessons/start`;
	}

	function isFullLessonQuizUrl(url) {
		return /wanikani.com\/subject-lessons\/[\d-]+\/quiz/.test(url);
	}

	function isFullLessonUrl(url) {
		return /wanikani.com\/subject-lessons\/[\d-]+\/\d+/.test(url);
	}

	function currentIdFromLessonUrl(url) {
		let id = url.match(/wanikani.com\/subject-lessons\/[\d-]+\/(\d+)/)?.[1];
		return id == null ? null : parseInt(id);
	}

	async function fetchNewLessonUrl() {
		let unlearnedIds = fetchUnlearnedIds();
		let pickerUrl = `https://www.wanikani.com/subject-lessons/picker`;
		let pickerPage = await (await fetch(pickerUrl)).text();
		let token = pickerPage.match(/name="authenticity_token" value="([^"]*)"/)[1];
		let formData = new FormData();
		formData.append(`authenticity_token`, token);
		formData.append(`subject_ids`, (await unlearnedIds).join());
		return (await fetch(pickerUrl, {
			method: `POST`,
			body: formData,
		})).url;
	}

	function cutOffQueue(queue, minLength) {
		let cutoff = queue.findIndex((q, i) => i >= minLength && !i.subject);
		return cutoff === -1 ? queue : queue.slice(0, cutoff);
	}

	function getCurrentReviewQueue(subjectIdsElement = null, subjectIdsWithSrsElement = null) {
		try {
			let quizQueue = getController(`quiz-queue`).quizQueue;
			return [...quizQueue.activeQueue.map(q => q.id), ...quizQueue.backlogQueue.map(q => q.id), ...quizQueue.remainingIds].map(i => toWrapper(i));
		} catch {
			console.info(`${SCRIPT_NAME}: Fallback to obtaining the queue by reading the DOM element`);
			if (subjectIdsElement === null || subjectIdsWithSrsElement === null) {
				({subjectIdsElement, subjectIdsWithSrsElement} = getQueueElements());
			}
			return parseSubjectIds(subjectIdsElement, subjectIdsWithSrsElement).filter(s => !finishedIds.has(s[0] ?? s)).map(s => toWrapper(s[0] ?? s));
		}
	}

	async function getCurrentLessonQueue(baseOnOriginalQueue = false, lessonSettingPromise = null) {
		baseOnOriginalQueue ||= currentLessonQueue === null;
		if (baseOnOriginalQueue) lessonSettingPromise ??= fetchLessonSettings();

		let unlearnedIds = await fetchUnlearnedIds();
		let unlearnedIdsSet = new Set(unlearnedIds);
		if (!baseOnOriginalQueue) return currentLessonQueue.filter(q => unlearnedIdsSet.has(q.id));

		let {fetchedLessonPresentationOrder} = await lessonSettingPromise;
		let needOpenFramework = !originalLessonQueue;// && fetchedLessonPresentationOrder !== `shuffled`; // we need Open Framework for modifyLessonPageBatch()
		if (!originalLessonQueue) unlearnedIds = unlearnedIds.map(q => toWrapper(q));
		if (needOpenFramework) unlearnedIds = await prepareQueue(unlearnedIds, {openFramework: true});
		originalLessonQueue ??= applyNativeLessonOrder(unlearnedIds, fetchedLessonPresentationOrder);
		return (await originalLessonQueue).filter(q => unlearnedIdsSet.has(q.id));
	}

	function applyNativeLessonOrder(queue, orderSetting) {
		let typeOrder = [`radical`, `kanji`, `vocabulary`];
		switch (orderSetting) {
			case `ascending_level_then_subject` : return queue.sort((a, b) => a.item.data.level - b.item.data.level || typeOrder.indexOf(a.item.object) - typeOrder.indexOf(b.item.object) || a.item.data.lesson_position - b.item.data.lesson_position);
			case `shuffled`                     : return shuffle(queue);
			case `ascending_level_then_shuffled`: return shuffle(queue).sort((a, b) => a.item.data.level - b.item.data.level);
			default                             : return queue;
		}
	}

	// Fisher-Yates Shuffle, copied from https://javascript.info/task/shuffle
	function shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	function applyQuizSettings(queueElement) {
		if (completeSubjectsInOrder !== null) queueElement.dataset.quizQueueCompleteSubjectsInOrderValue = completeSubjectsInOrder;
		if (questionOrder           !== null) queueElement.dataset.quizQueueQuestionOrderValue           = questionOrder;
	}

	function getQueueElements() {
		let queueElement             = getRootElement().querySelector(`[id="quiz-queue"]`);
		let subjectsElement          = queueElement.querySelector(`[data-quiz-queue-target="subjects"]`);
		let subjectIdsElement        = queueElement.querySelector(`[data-quiz-queue-target="subjectIds"]`);
		let subjectIdsWithSrsElement = queueElement.querySelector(`[data-quiz-queue-target="subjectIdsWithSRS"]`);
		return {queueElement, subjectsElement, subjectIdsElement, subjectIdsWithSrsElement};
	}

	async function tryExecutingCallback(currentState, queue, manipulator, wrap) {
		try {
			let callbackResult = await manipulator.callback.call(null, [...await prepareQueue(queue, manipulator.options)], currentState);
			return (callbackResult ?? await queue).map(q => wrap ? toWrapper(q) : q);
		} catch (e) {
			console.error(e);
			return queue;
		}
	}

	function tryExecutingManipulatorCallback(currentState, queue, manipulator) {
		return tryExecutingCallback(currentState, queue, manipulator, true);
	}

	function tryExecutingPostprocessingCallback(currentState, queue, manipulator) {
		return tryExecutingCallback(currentState, queue, manipulator, false);
	}

	async function prepareQueue(queue, options) {
		await Promise.all([prepareOpenFramework(options), prepareSubject(queue, options)]);
		return queue;
	}

	async function prepareOpenFramework(options) {
		let neededEndpoints = options?.openFrameworkGetItemsConfig?.split(`,`).map(e => e.trim()) ?? [];
		if (!options?.openFramework || (wkofById.size > 0 && neededEndpoints.every(e => wkofPreparedEndpoints.has(e)))) return;

		unsafeGlobal.wkof.include(`ItemData`);
		await unsafeGlobal.wkof.ready(`ItemData`);
		let items = await unsafeGlobal.wkof.ItemData.get_items(options.openFrameworkGetItemsConfig);
		items.forEach(i => wkofById.set(i.id, i));
		neededEndpoints.forEach(e => wkofPreparedEndpoints.add(e));
	}

	async function prepareSubject(queue, options) {
		if (!options?.subject) return;

		let missingIds = (await queue).map(q => q.id).filter(i => !subjectById.has(i));
		if (missingIds.length > 0) {
			let chunkSize = 1000;
			let chunks = Array(Math.ceil(missingIds.length / chunkSize)).fill().map(() => missingIds.splice(0, chunkSize));
			let responses = await Promise.all(chunks.map(chunk => fetch(`${location.origin}/subjects/review/items?ids=${chunk.join(`-`)}`).then(r => r.json())));
			responses.forEach(response => subjectsToLookup(response));
		}
	}

	function saveOriginalQueue(subjectsElement, subjectIdsElement, subjectIdsWithSrsElement) {
		if (originalQueue !== null) return;

		let originalSubjects   = JSON.parse(subjectsElement.textContent);
		let originalSubjectIds = parseSubjectIds(subjectIdsElement, subjectIdsWithSrsElement);
		originalQueue          = originalSubjectIds.map(s => toWrapper(s[0] ?? s));
		subjectsToLookup(originalSubjects);
		if (subjectIdsWithSrsElement !== null) originalSubjectIds.forEach(s => srsById.set(s[0], s[1]));
	}

	function parseSubjectIds(subjectIdsElement, subjectIdsWithSrsElement) {
		if (subjectIdsElement !== null) {
			return JSON.parse(subjectIdsElement.textContent);
		} else return JSON.parse(subjectIdsWithSrsElement.textContent).subject_ids_with_srs_info;
	}

	async function applyManipulationsToLessonQueue(url = document.URL, manipulationsToApply = activeManipulations(), baseOnOriginalQueue = true, currentState = {on: getCurrentState()}) {
		if (!currentlyLearning(url) || lessonPickerLesson) return;
		if (manipulationsToApply.length === 0 && baseOnOriginalQueue && lessonBatchSize === null) {
			currentLessonQueue = null;
			unsafeGlobal.Turbo?.visit(`/subject-lessons/start`);
			return;
		}

		allIncludedLessonUrl ??= fetchNewLessonUrl();

		currentState = Object.freeze(currentState);
		let fetchedSettings = lessonBatchSize === null ? fetchLessonSettings() : null;

		// update queue
		let baseQueue = await getCurrentLessonQueue(baseOnOriginalQueue, fetchedSettings);
		currentLessonQueue = (await manipulationsToApply.reduce(tryExecutingManipulatorCallback.bind(null, currentState), baseQueue));

		if (currentLessonQueue.length === 0) {
			unsafeGlobal.Turbo.visit(`/dashboard`);
		} else {
			fetchedLessonBatchSize = (await fetchedSettings)?.fetchedLessonBatchSize;
			allIncludedLessonUrl = (await allIncludedLessonUrl).replace(/\/[^\/]+$/, `/${currentLessonQueue[0].id}`);
			modifiedLessonStart = true;
			unsafeGlobal.Turbo.visit(allIncludedLessonUrl);
		}
	}

	function modifyLessonPageBatch(currentId, batch, body, url) {
		let currentIdIndex = batch.findIndex(b => b.id === currentId);
		let quizLink = `quiz?queue=${batch.map(q => q.id).join(`-`)}`;
		body.querySelector(`.subject-slide__navigation[data-subject-slides-target="prevButton"]`).href = `${batch[Math.max(0, currentIdIndex - 1)].id}`;
		[...body.querySelectorAll(`.subject-slide__navigation[data-subject-slides-target="nextButton"]`)].pop().href = `${batch[currentIdIndex + 1]?.id ?? quizLink}`;
		body.querySelectorAll(`.subject-queue__item:not(:last-child)`).forEach(q => q.remove());
		body.querySelector(`.subject-queue__item a`).href = quizLink;
		body.querySelector(`.subject-queue__item`).before(...batch.map(b => {
			let li = document.createElement(`li`);
			li.classList.add(`subject-queue__item`);
			li.dataset.subjectQueueTarget = `item`;
			li.innerHTML = `<a class="subject-character subject-character--${b.item.object.replace(`kana_vocabulary`, `vocabulary`)} subject-character--tiny subject-character--recent" title="${b.item.data.readings?.find(r => r.primary).reading ?? b.item.data.slug}" href="${b.id}"><div class="subject-character__content"><span class="subject-character__characters"><span class="subject-character__characters-text" lang="ja">${b.item.data.characters ?? `<wk-character-image class="subject-character__character-image" src="${b.item.data.character_images.filter(img => img.content_type === `image/svg+xml` && img.metadata.inline_styles)[0]?.url ?? ``}" aria-label="${b.item.data.slug}"></wk-character-image>`}</span></span></div></a>`;
			return li;
		}));
	}

	async function fetchLessonSettings() {
		unsafeGlobal.wkof.include(`Apiv2`);
		await unsafeGlobal.wkof.ready(`Apiv2`);
		return unsafeGlobal.wkof.Apiv2.fetch_endpoint(`user`).then(response => ({fetchedLessonBatchSize: response.data.preferences.lessons_batch_size, fetchedLessonPresentationOrder: /*response.data.preferences.lessons_presentation_order ??*/ `ascending_level_then_subject`}));
	}

	async function fetchUnlearnedIds() {
		unsafeGlobal.wkof.include(`Apiv2`);
		await unsafeGlobal.wkof.ready(`Apiv2`);
		let response = await unsafeGlobal.wkof.Apiv2.fetch_endpoint(`summary`);
		return response.data.lessons.flatMap(l => l.subject_ids);
	}

	function subjectsToLookup(subjects) {
		subjects.forEach(s => subjectById.set(s.id, s));
	}

	function subjectFromId(id) {
		let result = subjectById.get(id);
		return structuredClone(result);
	}

	function itemFromId(id) {
		let result = wkofById.get(id);
		return structuredClone(result);
	}

	function srsFromId(id) {
		return srsById.get(id) ?? wkofById.get(id)?.assignments?.srs_stage;
	}

	function toWrapper(idOrWrapper) {
		return typeof(idOrWrapper) === `number` ? Object.freeze({id: idOrWrapper, get srs() { return srsFromId(idOrWrapper); }, get subject() { return subjectFromId(idOrWrapper); }, get item() { return itemFromId(idOrWrapper); }}) : idOrWrapper;
	}

	function toPostprocessingWrapper(idOrWrapper) {
		let id = idOrWrapper.id ?? idOrWrapper;
		return Object.freeze({id, get srs() { return srsFromId(id); }, subject: subjectFromId(id), get item() { return itemFromId(id); }});
	}

	function requestApplyManipulations(recomputeQueue) {
		requestApplyManipulations.pending ??= {ref: null};
		return requestApplyManipulationsGeneric(recomputeQueue, requestApplyManipulations.pending, () => applyManipulations([], activePostprocessing(), false), () => applyManipulations());
	}

	function requestApplyManipulationsToLessonQueue(recomputeQueue) {
		requestApplyManipulationsToLessonQueue.pending ??= {ref: null};
		return requestApplyManipulationsGeneric(recomputeQueue, requestApplyManipulationsToLessonQueue.pending, () => applyManipulationsToLessonQueue(document.URL, [], false), () => applyManipulationsToLessonQueue());
	}

	function requestApplyManipulationsGeneric(needAlternativeCallback, pending, callback, alternativeCallback) {
		pending.ref ??= pendingPromise = pendingPromise.then(async () => {
			await true;
			let needAlternativeCallback = pending.ref.needAlternativeCallback;
			pending.ref = null;
			return needAlternativeCallback ? alternativeCallback() : callback();
		});
		pending.ref.needAlternativeCallback ||= needAlternativeCallback;
		return pending.ref;
	}

	function addManipulation(stateSelector, callback, options, array) {
		let entryId = ++maxEntryId;
		stateSelector = _fillStateSelector(stateSelector);
		array.push({stateSelector, callback, options, entryId});
		requestApplyManipulations(true);
		requestApplyManipulationsToLessonQueue(true);
		return {
			remove: () => removeManipulation(entryId)
		};
	}

	async function removeManipulation(entryId) {
		await pendingPromise;
		let oldManipulationsCount = MANIPULATION_KEYWORDS.reduce((total, k) => total + manipulations[k].length, 0);
		MANIPULATION_KEYWORDS.forEach(k => { manipulations[k] = manipulations[k].filter(m => m.entryId === entryId ? (m.remove?.(), false) : true); });
		let newManipulationsCount = MANIPULATION_KEYWORDS.reduce((total, k) => total + manipulations[k].length, 0);

		if (oldManipulationsCount !== newManipulationsCount && !replacedByNewerVersion) {
			requestApplyManipulations(true);
			requestApplyManipulationsToLessonQueue(true);
		}
	}

	function addTotalChange(stateSelector, callback, options) {
		return addManipulation(stateSelector, callback, options, manipulations.totalChange);
	}

	function addFilter(stateSelector, callback, options) {
		return addManipulation(stateSelector, callback, options, manipulations.filter);
	}

	function addReorder(stateSelector, callback, options) {
		return addManipulation(stateSelector, callback, options, manipulations.reorder);
	}

	function addPostprocessing(stateSelector, callback, options) {
		return addManipulation(stateSelector, callback, options, manipulations.postprocessing);
	}

	async function replaceWithNewerVersion(newWkQueue, newImportVariablesFunction) {
		replacedByNewerVersion = true;
		unregisterListeners();
		await pendingPromise;
		newImportVariablesFunction({originalQueue, currentLessonQueue, srsById, finishedIds});
		manipulations.totalChange   .forEach(m => { m.remove = newWkQueue.on(...m.stateSelector.on).addTotalChange   (m.callback, m.options).remove; });
		manipulations.filter        .forEach(m => { m.remove = newWkQueue.on(...m.stateSelector.on).addFilter        (m.callback, m.options).remove; });
		manipulations.reorder       .forEach(m => { m.remove = newWkQueue.on(...m.stateSelector.on).addReorder       (m.callback, m.options).remove; });
		manipulations.postprocessing.forEach(m => { m.remove = newWkQueue.on(...m.stateSelector.on).addPostprocessing(m.callback, m.options).remove; });
		newWkQueue.completeSubjectsInOrder = completeSubjectsInOrder;
		newWkQueue.questionOrder           = questionOrder;
		newWkQueue.lessonBatchSize         = lessonBatchSize;
	}

	function importVariables(variables) {
		originalQueue      = variables.originalQueue     ?.map(q => toWrapper(q.id)) ?? originalQueue;
		currentLessonQueue = variables.currentLessonQueue?.map(q => toWrapper(q.id)) ?? currentLessonQueue;
		srsById            = variables.srsById     ?? srsById;
		finishedIds        = variables.finishedIds ?? finishedIds;
	}

	// Selector chain stuff, mostly copied from Item Info Injector

	function _argumentsToArray(args) {
		return args?.flatMap(a => a.split(`,`)).map(a => a.trim()) || [];
	}

	function _removeDuplicates(array) {
		return array.filter((a, i) => array.indexOf(a) === i);
	}

	function _checkAgainst(array, keywords) {
		let duplicateKeywords = array.filter((a, i) => array.includes(a, i + 1) && array.indexOf(a) === i);
		let unknownKeywords = _removeDuplicates(array.filter(a => !keywords.includes(a)));
		if (unknownKeywords  .length > 0) throw `${SCRIPT_NAME}: Unknown keywords [${unknownKeywords.join(`, `)}]`;
		if (duplicateKeywords.length > 0) throw `${SCRIPT_NAME}: Duplicate keywords [${duplicateKeywords.join(`, `)}]`;
		return array;
	}

	function _fillStateSelector(stateSelector) {
		if (!stateSelector.on?.length) stateSelector.on = [`lesson`, `lessonQuiz`, `review`, `extraStudy`];
		return stateSelector;
	}

	function _isNewerThan(otherVersion) {
		let v1 = VERSION.split(`.`).map(v => parseInt(v));
		let v2 = otherVersion.split(`.`).map(v => parseInt(v));
		return v1.reduce((r, v, i) => r ?? (v === v2[i] ? null : (v > (v2[i] || 0))), null) || false;
	}

	function _selectorChain(currentChainLink, stateSelector) {
		let result = {};
		switch(currentChainLink) {
			case `on`: result.addTotalChange    = (callback, options) =>    addTotalChange(stateSelector, callback, options);
			           result.addFilter         = (callback, options) =>         addFilter(stateSelector, callback, options);
			           result.addReorder        = (callback, options) =>        addReorder(stateSelector, callback, options);
			           result.addPostprocessing = (callback, options) => addPostprocessing(stateSelector, callback, options);
		}
		return result;
	}

	function _on(stateSelector, pages) {
		stateSelector.on = _checkAgainst(_argumentsToArray(pages), [`lesson`, `lessonQuiz`, `review`, `extraStudy`]);
		return _selectorChain(`on`, stateSelector);
	}

	function _domReady() {
		return document.readyState === `interactive` || document.readyState === `complete`;
	}

	async function _publishInterface() {
		let oldWkQueue = unsafeGlobal.wkQueue;
		if (oldWkQueue && !_isNewerThan(oldWkQueue.version)) return;
		// if newer, register this version instead

		unsafeGlobal.wkQueue = Object.freeze({
			// public functions
			on                : (         ...pages) => replacedByNewerVersion ? unsafeGlobal.wkQueue.on                (         ...pages) :               _on({}, pages),
			addTotalChange    : (callback, options) => replacedByNewerVersion ? unsafeGlobal.wkQueue.addTotalChange    (callback, options) :    addTotalChange({}, callback, options),
			addFilter         : (callback, options) => replacedByNewerVersion ? unsafeGlobal.wkQueue.addFilter         (callback, options) :         addFilter({}, callback, options),
			addReorder        : (callback, options) => replacedByNewerVersion ? unsafeGlobal.wkQueue.addReorder        (callback, options) :        addReorder({}, callback, options),
			addPostprocessing : (callback, options) => replacedByNewerVersion ? unsafeGlobal.wkQueue.addPostprocessing (callback, options) : addPostprocessing({}, callback, options),
			applyManipulation : (callback, options) => replacedByNewerVersion ? unsafeGlobal.wkQueue.applyManipulation (callback, options) : applyManipulation(    callback, options),
			refresh           : (                 ) => replacedByNewerVersion ? unsafeGlobal.wkQueue.refresh           (                 ) : Promise.all([requestApplyManipulations(true), requestApplyManipulationsToLessonQueue(true)]),
			currentLessonQueue: (          options) => replacedByNewerVersion ? unsafeGlobal.wkQueue.currentLessonQueue(          options) : (pendingPromise = pendingPromise.then(() => prepareQueue(getCurrentLessonQueue(), options))),
			currentReviewQueue: (          options) => replacedByNewerVersion ? unsafeGlobal.wkQueue.currentReviewQueue(          options) : (pendingPromise = pendingPromise.then(() => prepareQueue(getCurrentReviewQueue(), options))),
			get completeSubjectsInOrder() { return replacedByNewerVersion ? unsafeGlobal.wkQueue.completeSubjectsInOrder : completeSubjectsInOrder; },
			get           questionOrder() { return replacedByNewerVersion ? unsafeGlobal.wkQueue.          questionOrder :           questionOrder; },
			get         lessonBatchSize() { return replacedByNewerVersion ? unsafeGlobal.wkQueue.        lessonBatchSize :         lessonBatchSize; },
			set completeSubjectsInOrder(value) { if (replacedByNewerVersion) unsafeGlobal.wkQueue.completeSubjectsInOrder = value; else { completeSubjectsInOrder = value; requestApplyManipulations(false);              } },
			set           questionOrder(value) { if (replacedByNewerVersion) unsafeGlobal.wkQueue.          questionOrder = value; else {           questionOrder = value; requestApplyManipulations(false);              } },
			set         lessonBatchSize(value) { if (replacedByNewerVersion) unsafeGlobal.wkQueue.        lessonBatchSize = value; else {         lessonBatchSize = value; requestApplyManipulationsToLessonQueue(false); } },
			version: VERSION,
			_internal: {replaceWithNewerVersion},
		});

		let promises = [];
		if (oldWkQueue) promises.push(oldWkQueue._internal?.replaceWithNewerVersion?.(unsafeGlobal.wkQueue, importVariables));
		if (!_domReady()) promises.push(new Promise(resolve => document.addEventListener(`readystatechange`, resolve, {once: true})));

		if (promises.length) {
			await Promise.all(promises);
			rootElement = document.body;
			// maybe some manipulations were registered while awaiting the DOM or the transfer -- do a refresh
			//unsafeGlobal.wkQueue.refresh();
		}

		if (!replacedByNewerVersion) registerListeners();
	}

	pendingPromise = _publishInterface();
})(window, window.unsafeWindow || window);
