// ==UserScript==
// @name         WaniKani Item Info Injector
// @namespace    waniKaniItemInfoInjector
// @version      3.13
// @description  Library script that other userscripts can use to inject additional item information into WaniKani.
// @author       Sinyaven
// @license      MIT-0
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @homepageURL  https://community.wanikani.com/t/53823
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430565/WaniKani%20Item%20Info%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/430565/WaniKani%20Item%20Info%20Injector.meta.js
// ==/UserScript==

// nomenclature:
// stateSelector: {on, type, under, spoiler}; all of them are arrays
// state        : {on, type, under, hiddenSpoiler, id, meaning, typeDependentItemInfo...}; only under, meaning, and hiddenSpoiler are arrays; hiddenSpoiler contains a list of "under" sections that are currently hidden but might be added to the UI later (currently only during review/lessonQuiz while the item info is not fully expanded)
// injectorState: {on, type, under, hiddenSpoiler, id, meaning, typeDependentItemInfo..., injector}; state + injector
// callback     : function getting as argument an injectorState
// callbackEntry: {stateSelector, callback, appendedElements, injectorDeactivators, alreadyHandled, entryId}
// typeDependentItemInfo [Text Radical]: {characters}; the property "characters" is only added if the radical is not an image
// typeDependentItemInfo [       Kanji]: {characters, reading, composition, emphasis, onyomi, kunyomi, nanori}; reading, composition, onyomi, kunyomi, and nanori are arrays; composition is an array of radicals {characters, meaning} where meaning is an array
// typeDependentItemInfo [  Vocabulary]: {characters, reading, composition, partOfSpeech}; reading, composition, and partOfSpeech are arrays; composition is an array of kanji {characters, meaning, reading} where meaning and reading are arrays
// typeDependentItemInfo [  Kana Vocab]: {characters, partOfSpeech}; partOfSpeech is an array

((global, unsafeGlobal) => {
	"use strict";
	/* eslint no-multi-spaces: off */

	// private variables and functions
	let _currentState              = {};
	let _injectAt                  = {};
	let _callbacks                 = [];
	let _appendedElements          = [];
	let _scheduledCallbackElements = [];
	let _maxEntryId                = 0;
	let _itemChanged               = true;
	let _newRootElement            = document.body;
	let _newUrl                    = document.URL;

	const _VERSION       = `3.13`;
	const _SCRIPT_NAME   = `WaniKani Item Info Injector`;
	const _CSS_NAMESPACE = `item-info-injector`;

	const _TAB_NAME_MAPPING = {};
	_TAB_NAME_MAPPING.radical = {
		[`name`             ]: `meaning`,
		[`examples`         ]: `examples`
	};
	_TAB_NAME_MAPPING.kanji = {
		[`radicals`         ]: `composition`,
		[`meaning`          ]: `meaning`,
		[`readings`         ]: `reading`,
		[`examples`         ]: `examples`
	};
	_TAB_NAME_MAPPING.vocabulary = {
		[`kanji composition`]: `composition`,
		[`meaning`          ]: `meaning`,
		[`reading`          ]: `reading`,
		[`context`          ]: `examples`
	};
	_TAB_NAME_MAPPING.kanaVocabulary = {
		[`meaning`          ]: `meaning`,
		[`context`          ]: `examples`
	};

	const _URL_HASH_MAPPING = {};
	_URL_HASH_MAPPING.radical = {
		[``              ]: `meaning`,
		[`#meaning`      ]: `meaning`,
		[`#amalgamations`]: `examples`,
	};
	_URL_HASH_MAPPING.kanji = {
		[``              ]: `composition`,
		[`#composition`  ]: `composition`,
		[`#meaning`      ]: `meaning`,
		[`#reading`      ]: `reading`,
		[`#amalgamations`]: `examples`,
	};
	_URL_HASH_MAPPING.vocabulary = {
		[``              ]: `composition`,
		[`#composition`  ]: `composition`,
		[`#meaning`      ]: `meaning`,
		[`#reading`      ]: `reading`,
		[`#context`      ]: `examples`,
	};
	_URL_HASH_MAPPING.kanaVocabulary = {
		[``              ]: `meaning`,
		[`#meaning`      ]: `meaning`,
		[`#context`      ]: `examples`,
	};

	const _ACCORDION_NAME_MAPPING = {};
	_ACCORDION_NAME_MAPPING.radical = {
		[`Name`               ]: `meaning`,
		[`Found In Kanji`     ]: `examples`
	};
	_ACCORDION_NAME_MAPPING.kanji = {
		[`Radical Combination`]: `composition`,
		[`Meaning`            ]: `meaning`,
		[`Reading`            ]: `reading`
	};
	_ACCORDION_NAME_MAPPING.vocabulary = {
		[`Related Kanji`      ]: `composition`,
		[`Kanji Composition`  ]: `composition`,
		[`Meaning`            ]: `meaning`,
		[`Reading`            ]: `reading`,
		[`Context`            ]: `examples`
	};
	_ACCORDION_NAME_MAPPING.kanaVocabulary = {
		[`Meaning`            ]: `meaning`,
		[`Context`            ]: `examples`
	};

	const _PROPERTIES_TO_REMOVE_FROM_CURRENT_STATE = {};
	_PROPERTIES_TO_REMOVE_FROM_CURRENT_STATE.radical = [`reading`, `composition`, `partOfSpeech`, `onyomi`, `kunyomi`, `nanori`, `emphasis`];
	_PROPERTIES_TO_REMOVE_FROM_CURRENT_STATE.kanji = [`partOfSpeech`];
	_PROPERTIES_TO_REMOVE_FROM_CURRENT_STATE.vocabulary = [`onyomi`, `kunyomi`, `nanori`, `emphasis`];
	_PROPERTIES_TO_REMOVE_FROM_CURRENT_STATE.kanaVocabulary = [`reading`, `composition`, `onyomi`, `kunyomi`, `nanori`, `emphasis`];

	// REGION 0: helper functions for interacting with page and other utils

	// get the root element that should contain all item info elements; can be the document body, but also the item info Turbo frame
	function _getRootElement() {
		if (!_relevantRootElementChildren(_newRootElement).length) _newRootElement = document.body;
		return _newRootElement;
	}

	// it seems like Turbo does not move the SVG and the .wk-modal element into document.body, so let's ignore it
	function _relevantRootElementChildren(rootElement) {
		return [...rootElement?.children ?? []].filter(c => c.tagName !== `svg` && !c.classList.contains(`wk-modal`));
	}

	// from @rfindley
	function getController(name) {
		return unsafeGlobal.Stimulus.getControllerForElementAndIdentifier(document.querySelector(`[data-controller~="${name}"]`), name);
	}

	function _isFullLessonQuizUrl(url) {
		return /wanikani.com\/subject-lessons\/[\d-]+\/quiz/.test(url);
	}

	function _isFullLessonUrl(url) {
		return /wanikani.com\/subject-lessons\/[\d-]+\/\d+/.test(url) || /wanikani.com\/recent-mistakes\/[\d-]+\/subjects\/\d+\/lesson/.test(url);
	}

	function _currentIdFromLessonUrl(url) {
		let id = url.match(/wanikani.com\/subject-lessons\/[\d-]+\/(\d+)/)?.[1] ?? url.match(/wanikani.com\/recent-mistakes\/[\d-]+\/subjects\/(\d+)\/lesson/)?.[1];
		return id == null ? null : parseInt(id);
	}

	function _rootElementContentInMainPage() {
		if (document.body.contains(_relevantRootElementChildren(_getRootElement())[0] ?? document.body)) return true;
		return new Promise(resolve => {
			let observer = new MutationObserver(m => {
				if (_relevantRootElementChildren(m[0].target).length > 0) return;
				observer.disconnect();
				observer = null;
				resolve(true);
			});
			observer.observe(_newRootElement, {childList: true});
		});
	}

	function _firstCharToLower(s) {
		return (s[0]?.toLowerCase() ?? ``) + s.substring(1);
	}

	// REGION 1: detect current state and set up listeners for keeping track of state changes

	let debug = true;
	function _init() {
		document.addEventListener(`turbo:before-render`      , handleTurboBeforeRender);
		document.addEventListener(`turbo:before-frame-render`, handleTurboBeforeFrameRender);
		document.addEventListener(`turbo:click`              , handleTurboClick);
		document.addEventListener(`turbo:load`               , handleTurboLoad);
		window  .addEventListener(`hashchange`               , handleHashChange); // none of the Turbo events seem to fire when navigating the history during lessons
		document.addEventListener(`keydown`                  , handleKeyDown);
		_initOnNewPage();
	}

	function handleTurboBeforeRender(e) {
		if (e.detail.newBody.lastElementChild?.tagName === `IFRAME`) return; // sometimes in lessons, turbo:before-render gets called twice -- ignore the first time
		_newUrl = document.URL;
		if (_init.ignoreNextLessonBeforeRender && _isFullLessonUrl(document.URL)) { _init.ignoreNextLessonBeforeRender = false; return; } // when loading wanikani/subjects/lesson, turbo:before-render is fired twice, but the second time seems to be rejected => ignore the second time
		if (document.location.pathname === `/subject-lessons/start`) _init.ignoreNextLessonBeforeRender = true;
		_newRootElement = e.detail.newBody;
		_initOnNewPage();
	}

	function handleTurboBeforeFrameRender(e) {
		if (e.detail.newFrame.id !== `subject-info`) return; // only listen to changes to the subject info frame
		_newRootElement = e.detail.newFrame;
		_newUrl = document.URL;
		_initOnNewPage();
	}

	function handleTurboClick(e) {
		let newId = _currentIdFromLessonUrl(e.detail.url);
		if (newId === null || newId !== _currentIdFromLessonUrl(document.URL)) return; // only listen to tab changes which stay on the same subject
		_newRootElement = document.body;
		_newUrl = e.detail.url;
		_initOnNewLessonTab();
	}

	function handleTurboLoad() {
		// handle history navigation not caught by other listeners
		if (_newUrl === document.URL) return;
		_newUrl = document.URL;
		setTimeout(() => {
			_newRootElement = document.body;
			_initOnNewPage();
		});
	}

	function handleHashChange(e) {
		if (!e.isTrusted) return;
		handleTurboLoad();
	}

	function handleKeyDown(e) {
		if (e.key !== `e`) return;
		let collapsedNative = document.querySelectorAll(`.subject-section__toggle[aria-expanded=false]`);
		let collapsed = [...document.querySelectorAll(`.subject-info section.${_CSS_NAMESPACE}-accordion-closed > button`)];
		let expanded  = [...document.querySelectorAll(`.subject-info section.${_CSS_NAMESPACE}:not(.${_CSS_NAMESPACE}-accordion-closed) > button`)];
		(collapsedNative.length ? collapsed : expanded).forEach(e => e.click());
	}

	function removeAllInjectedElements() {
		_getRootElement().querySelectorAll(`.${_CSS_NAMESPACE}, .${_CSS_NAMESPACE}-empty`).forEach(e => e.remove());
	}

	function _initOnNewPage() {
		removeAllInjectedElements();
		_currentState = {};
		if      (document.URL.includes(`wanikani.com/radicals/`  )) { _currentState = {on: `itemPage`, type: `radical`}; _initItemPage(); }
		else if (document.URL.includes(`wanikani.com/kanji/`     )) { _currentState = {on: `itemPage`, type: `kanji`  }; _initItemPage(); }
		else if (document.URL.includes(`wanikani.com/vocabulary/`)) { _currentState = {on: `itemPage`, type: _getRootElement().querySelector(`#components`) === null ? `kanaVocabulary` : `vocabulary`}; _initItemPage(); }
		else if (document.URL.includes(`wanikani.com/subjects/review`        )) { _currentState.on =     `review`; _initReviewPage(); }
		else if (document.URL.includes(`wanikani.com/subjects/extra_study`   )) { _currentState.on = `extraStudy`; _initReviewPage(); }
		else if (/wanikani.com\/recent-mistakes\/.*quiz/   .test(document.URL)) { _currentState.on = `extraStudy`; _initReviewPage(); }
		else if (                           _isFullLessonQuizUrl(document.URL)) { _currentState.on = `lessonQuiz`; _initReviewPage(); }
		else if (document.location.pathname === `/subject-lessons/start` || _isFullLessonUrl(document.URL)) { _currentState.on = `lesson`; _initLessonPage(); }
	}

	function _initOnNewLessonTab() {
		_updateCurrentStateUnder();
		_initInjectorFunctions();
		_handleStateChange();
	}

	function _initItemPage() {
		_updateCurrentStateItemPage();
		_initInjectorFunctions();
		_handleStateChange();
	}

	function _initReviewPage() {
		if (_getRootElement().id !== `subject-info`) return;

		_updateCurrentStateReview();
		_initInjectorFunctions();
		_handleStateChange();
	}

	function _initLessonPage() {
		_updateCurrentStateLesson();
		_initInjectorFunctions();
		_handleStateChange();
	}

	function _updateCurrentState() {
		if (_currentState.on === `itemPage`) return; // no need to update after the initial call of _updateCurrentStateItemPage() on page load since there cannot be any changes

		_isFullLessonUrl(document.URL) ? _updateCurrentStateLesson() : _updateCurrentStateReview();
	}

	function _updateCurrentStateItemPage() {
		_currentState.id           = parseInt(document.head.querySelector(`meta[name=subject_id]`).content);
		_currentState.characters   = _getRootElement().querySelector(`span.subject-character__characters-text`).textContent.trim();
		_currentState.emphasis     = _getRootElement().querySelector(`.subject-readings__reading--primary h3`)?.textContent.replace(`’`, ``).toLowerCase();
		_currentState.partOfSpeech = [..._getRootElement().querySelectorAll(`.subject-section__meanings h2`)].find(h => h.textContent === `Word Type`)?.nextElementSibling.textContent.split(`,`).map(p => p.trim().replace(/\b\w/g, c => c.toUpperCase()));
		_currentState.meaning      = [..._getRootElement().querySelectorAll(`.subject-section__meanings h2`)].filter(h => [`Primary`, `Alternative`, `Alternatives`].includes(h.textContent)).flatMap(h => h.nextElementSibling.textContent.split(`,`)).map(m => m.trim());
		_currentState.onyomi       = [..._getRootElement().querySelectorAll(`.subject-readings__reading-title`)].find(s => s.textContent ===  `On’yomi`)?.nextElementSibling.textContent.split(`,`).map(r => r.trim()).filter(r => r !== `None`);
		_currentState.kunyomi      = [..._getRootElement().querySelectorAll(`.subject-readings__reading-title`)].find(s => s.textContent === `Kun’yomi`)?.nextElementSibling.textContent.split(`,`).map(r => r.trim()).filter(r => r !== `None`);
		_currentState.nanori       = [..._getRootElement().querySelectorAll(`.subject-readings__reading-title`)].find(s => s.textContent ===   `Nanori`)?.nextElementSibling.textContent.split(`,`).map(r => r.trim()).filter(r => r !== `None`);
		_currentState.composition  = [..._getRootElement().querySelectorAll(`.subject-section--components .subject-character__characters`)].map(s => { let result = {meaning: [...s.nextElementSibling.querySelectorAll(`.subject-character__meaning`)].map(m => m.textContent.trim()), reading: [...s.nextElementSibling.querySelectorAll(`.subject-character__reading`)].map(r => r.textContent.trim()), characters: s.textContent.trim()}; if (result.reading.length === 0) delete result.reading; if (result.characters === ``) delete result.characters; return result; });
		_currentState.reading      = [..._getRootElement().querySelectorAll(`.reading-with-audio__reading`)].map(p => p.textContent).concat(_currentState[_currentState.emphasis] || []);
		_PROPERTIES_TO_REMOVE_FROM_CURRENT_STATE[_currentState.type].forEach(prop => delete _currentState[prop]);

		_updateCurrentStateUnder();
	}

	function _updateCurrentStateReview() {
		let subjects               = JSON.parse((_getRootElement().querySelector(`[data-quiz-queue-target="subjects"]`) ?? document.querySelector(`[data-quiz-queue-target="subjects"]`)).textContent);
		let currentId              = parseInt(document.querySelector(`[data-subject-id]`)?.dataset.subjectId ?? subjects[0]?.id);
		let currentItem            = subjects.find(s => s.id === currentId) ?? getController(`quiz-queue`).quizQueue.activeQueue.find(b => b.id == currentId);

		_currentState.id           = currentItem.id;
		_currentState.type         = _firstCharToLower(currentItem.type);
		_currentState.characters   = currentItem.characters;
		_currentState.emphasis     = currentItem.readings?.find(r => r.kind === `primary`)?.type;
		_currentState.partOfSpeech = [..._getRootElement().querySelectorAll(`.subject-section__meanings h2`)].find(h => h.textContent === `Word Type`)?.nextElementSibling.textContent.split(`,`).map(p => p.trim().replace(/\b\w/g, c => c.toUpperCase()));
		_currentState.meaning      = currentItem.meanings?.filter(r => [`primary`, `alternative`].includes(r.kind)).map(m => m.text);
		_currentState.onyomi       = currentItem.readings?.filter(r => r.type === `onyomi`).map(r => r.text);
		_currentState.kunyomi      = currentItem.readings?.filter(r => r.type === `kunyomi`).map(r => r.text);
		_currentState.nanori       = currentItem.readings?.filter(r => r.type === `nanori`).map(r => r.text);
		_currentState.composition  = [..._getRootElement().querySelectorAll(`.subject-section--components .subject-character__characters`)].map(s => { let result = {meaning: [...s.nextElementSibling.querySelectorAll(`.subject-character__meaning`)].map(m => m.textContent.trim()), reading: [...s.nextElementSibling.querySelectorAll(`.subject-character__reading`)].map(r => r.textContent.trim()), characters: s.textContent.trim()}; if (result.reading.length === 0) delete result.reading; if (result.characters === ``) delete result.characters; return result; });
		_currentState.reading      = _currentState.type === `kanji` ? _currentState[_currentState.emphasis] : currentItem.readings?.filter(r => [`primary`, `alternative`].includes(r.kind)).map(r => r.text);
		Object.entries(_currentState).filter(e => !e[1]).forEach(e => delete _currentState[e[0]]);
		_PROPERTIES_TO_REMOVE_FROM_CURRENT_STATE[_currentState.type].forEach(prop => delete _currentState[prop]);

		_updateCurrentStateUnder();
	}

	function _updateCurrentStateLesson() {
		_currentState.id           = _currentIdFromLessonUrl(document.URL) ?? parseInt(_getRootElement().querySelector(`[id=user_synonyms]`).getAttribute(`src`).match(/subject_id=(\d+)/)?.[1]);
		_currentState.type         = [`radical`, `kanji`, `vocabulary`].find(t => _getRootElement().querySelector(`.character-header--${t}`) !== null);
		_currentState.type         = _currentState.type === `vocabulary` && _getRootElement().querySelector(`#composition`) === null ? `kanaVocabulary` : _currentState.type;
		_currentState.characters   = _getRootElement().querySelector(`.character-header__characters`).textContent;
		_currentState.partOfSpeech = [`vocabulary`, `kanaVocabulary`].includes(_currentState.type) ? [..._querySelector(`.subject-section__title-text {Word Type} ^+`)?.children ?? []].flatMap(c => c.textContent.split(`, `)) : null;
		_currentState.meaning      = [_getRootElement().querySelector(`.character-header__meaning`).textContent, ...[..._querySelector(`.subject-section__title-text {Other Meanings} ^+`)?.children ?? []].flatMap(c => c.textContent.split(`, `))];
		_currentState.onyomi       = _currentState.type === `kanji`      ? [..._querySelector(`.subject-section__title-text {Readings (on’yomi) } ^+`)?.children ?? []].map(c => c.textContent) : null;
		_currentState.kunyomi      = _currentState.type === `kanji`      ? [..._querySelector(`.subject-section__title-text {Readings (kun’yomi)} ^+`)?.children ?? []].map(c => c.textContent) : null;
		_currentState.nanori       = _currentState.type === `kanji`      ? [..._querySelector(`.subject-section__title-text {Readings (nanori)  } ^+`)?.children ?? []].map(c => c.textContent) : null;
		_currentState.emphasis     = _currentState.type === `kanji`      ? [`onyomi`, `kunyomi`, `nanori`].find(r => _currentState[r].length) : null;
		_currentState.composition  = _currentState.type === `kanji`      ? [..._querySelector(`.subject-section__title-text {Radical Composition} ^+`)?.querySelectorAll(`.subject-character__characters`) ?? []].map(s => { let result = {meaning: [...s.nextElementSibling.querySelectorAll(`.subject-character__meaning`)].map(m => m.textContent.trim()), reading: [...s.nextElementSibling.querySelectorAll(`.subject-character__reading`)].map(r => r.textContent.trim()), characters: s.textContent.trim()}; if (result.reading.length === 0) delete result.reading; if (result.characters === ``) delete result.characters; return result; }) :
		                             _currentState.type === `vocabulary` ? [..._querySelector(`.subject-section__title-text {  Kanji Composition} ^+`)?.querySelectorAll(`.subject-character__characters`) ?? []].map(s => { let result = {meaning: [...s.nextElementSibling.querySelectorAll(`.subject-character__meaning`)].map(m => m.textContent.trim()), reading: [...s.nextElementSibling.querySelectorAll(`.subject-character__reading`)].map(r => r.textContent.trim()), characters: s.textContent.trim()}; if (result.reading.length === 0) delete result.reading; if (result.characters === ``) delete result.characters; return result; }) : null;
		_currentState.reading      = _currentState.type === `radical` ? null : [..._getRootElement().querySelectorAll(`.reading-with-audio__reading`)].map(r => r.textContent).concat(_currentState[_currentState.emphasis] ?? []);
		_PROPERTIES_TO_REMOVE_FROM_CURRENT_STATE[_currentState.type].forEach(prop => delete _currentState[prop]);

		_updateCurrentStateUnder();
	}

	function _updateCurrentStateUnder() {
		// update _currentState.under and _currentState.hiddenSpoiler
		_currentState.hiddenSpoiler = [];
		if (_currentState.on === `lesson`) {
			_currentState.under = [_URL_HASH_MAPPING[_currentState.type][new URL(_newUrl).hash]];
		} else {
			switch (_currentState.type) {
				case `kanaVocabulary`:
				case `radical`       : _currentState.under = [               `meaning`,            `examples`]; break;
				case `kanji`         :
				case `vocabulary`    : _currentState.under = [`composition`, `meaning`, `reading`, `examples`]; break;
			}
			if ([`review`, `lessonQuiz`, `extraStudy`].includes(_currentState.on)) {
				let spoiler = [];
				switch (document.querySelector(`[for=user-response]`).dataset.questionType) {
					case `meaning`: spoiler = [`reading`, `composition`]; break;
					case `reading`: spoiler = [`meaning`, `composition`, `examples`]; break;
				}
				_currentState.hiddenSpoiler = _currentState.under.filter(u =>  spoiler.includes(u));
				_currentState.under         = _currentState.under.filter(u => !spoiler.includes(u));
			}
		}
	}

	// REGION 2: code that provides the item info injection functionality

	function _skipInjectedSections(location) {
		while (location?.nextElementSibling?.classList.contains(_CSS_NAMESPACE)) location = location.nextElementSibling;
		return location;
	}

	function _querySelector(selector) {
		selector = selector.replace(`%current-tab`, () => Object.entries(_URL_HASH_MAPPING[_currentState.type]).reverse().find(e => e[1] === _currentState.under[0])[0]);
		selector = selector.replace(/%(\w+)/, (_, under) => { _injectAt[under](); return `#${_CSS_NAMESPACE}-loc-${under}`; });
		let [, sel, contentFilter, indexSelector, customSuffix] = selector.match(/^(.+?)(?:{(.+)})?(\$?)([\+\-\^\~\s]*)$/);
		let result = (contentFilter || indexSelector) ? [..._getRootElement().querySelectorAll(sel)] : _getRootElement().querySelector(sel);
		if (contentFilter) {
			contentFilter = contentFilter.split(`,`).map(c => c.trim());
			result = contentFilter.reduce((element, filter) => element || result.find(r => r.textContent === filter && !r.classList.contains(_CSS_NAMESPACE)), null);
		} else if (indexSelector) {
			result = result.pop(); // for now, the only available indexSelector is "$" with the meaning "last match"
		}
		[...customSuffix].forEach(c => {
			if (c === `-`) result = result?.previousElementSibling;
			if (c === `+`) result = result?.nextElementSibling;
			if (c === `^`) result = result?.parentElement;
			if (c === `~`) result = _skipInjectedSections(result);
		});
		return result;
	}

	function _xPathSelector(selector) {
//		selector = selector.replace(/%(\w+)/, (_, under) => { _injectAt[under](); return `*[@id="${_CSS_NAMESPACE}-loc-${under}"]`; });
		return document.evaluate(selector, _getRootElement(), null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	}

	function _injectLocatorAt(id, ...selector) {
		let locator = document.createElement(`div`);
		locator.classList.add(`${_CSS_NAMESPACE}-empty`);
		locator.id = id;
		let inject = selector.reduce((injectFunc, sel) => {
			if (injectFunc) return injectFunc;
			let [, xpath, s, customSuffix] = sel.match(/^(XPATH |)(.+?)([<>\-])?\s*$/);
			let location = xpath ? _xPathSelector(s) : _querySelector(s);
			if (!location) return null;
			if (customSuffix === `<`) return location.prepend.bind(location);
			if (customSuffix === `>`) return location.append .bind(location);
			if (customSuffix === `-`) return location.previousElementSibling?.after.bind(location.previousElementSibling) || location.before.bind(location); // workaround for inserting before space in pageList
			else                      return location.after  .bind(location);
		}, null);
		if (!inject) return null;
		inject(locator);
		_appendedElements.push(locator);
		return locator;
	}

	function _setInjectorFunc(under, ...selector) {
		let id = `${_CSS_NAMESPACE}-loc-${under}`;
		_injectAt[under] = (...elements) => {
			let locator = _getRootElement().ownerDocument?.getElementById(id) ?? _getRootElement().querySelector(`[id="${id}"]`) ?? _injectLocatorAt(id, ...selector);
			if (!locator) { console.warn(`${_SCRIPT_NAME}: Could not find location under ${under}`); return; }
			locator = _skipInjectedSections(locator);
			locator.after(...elements);
		};
	}

	// custom CSS:
	// XPATH (at start): main part is xpath selector, not css selector
	// current-tab: the currently open lesson tab
	// %top etc.: the specified anchor
	// {text content} (at end): element with given textContent
	// $ (at end): last match
	// - (at end): previousElementSibling |
	// + (at end): nextElementSibling     | any order
	// ^ (at end): parentElement          |
	// ~ (at end): skip injected sections |
	// < (at end): prepend (first child)
	// > (at end): append (last child)
	// - (at end): before

	function _initInjectorFunctions() {
		switch(_currentState.on) {
			case `itemPage`:
				_setInjectorFunc(`top`                  , `.page-nav`                                                   );
				_setInjectorFunc(`topSide`              , `%top ~`                                                      );
				_setInjectorFunc(`bottom`               , `.subject-section--progress -`, `.page-nav ^>`                );
				_setInjectorFunc(`bottomSide`           , `%bottom ~`                                                   );
				_setInjectorFunc(`composition`          , `.subject-section--components`                                );
				_setInjectorFunc(`meaning`              , `.subject-section--meaning`                                   );
				_setInjectorFunc(`reading`              , `.subject-section--reading`                                   );
				_setInjectorFunc(`examples`             , `.subject-section--amalgamations, .subject-section--context`  );
				_setInjectorFunc(`meaningSide`          , `.subject-section__meanings $`                                );
				_setInjectorFunc(`readingSide`          , `.subject-readings, .subject-readings-with-audio`             );
				_setInjectorFunc(`compositionSubsection`, `.subject-section--components >`                              );
				_setInjectorFunc(`meaningSubsection`    , `#user_meaning_note ^-`, `.subject-section--meaning >`        );
				_setInjectorFunc(`readingSubsection`    , `#user_reading_note ^-`, `.subject-section--reading >`        );
				_setInjectorFunc(`examplesSubsection`   , `.subject-section--amalgamations, .subject-section--context >`);
				_setInjectorFunc(`compositionPageList`  , `.wk-nav__item-link[href='#components'] ^`, `%topSidePageList ~`);
				_setInjectorFunc(`meaningPageList`      , `.wk-nav__item-link[href='#meaning'], .wk-nav__item-link[href='#information'] ^`);
				_setInjectorFunc(`readingPageList`      , `.wk-nav__item-link[href='#reading'] ^`                     );
				_setInjectorFunc(`examplesPageList`     , `.wk-nav__item-link[href='#amalgamations'], .wk-nav__item-link[href='#context'] ^`);
				_setInjectorFunc(`topPageList`          , `.wk-nav__items <`                                          );
				_setInjectorFunc(`topSidePageList`      , `%topPageList ~`                                              );
				_setInjectorFunc(`bottomPageList`       , `.wk-nav__item-link[href='#progress'] ^-`, `.wk-nav__items >`);
				_setInjectorFunc(`bottomSidePageList`   , `%bottomPageList ~`                                           );
				break;
			case `lesson`:
				_setInjectorFunc(`customSideInfo`       , `%current-tab .subject-slide__sections -`);
				_setInjectorFunc(`top`                  , `%current-tab .subject-slide__sections <`);
				_setInjectorFunc(`bottom`               , `%current-tab .subject-slide__sections >`);
				_setInjectorFunc(`topSide`              , `%current-tab .subject-slide__aside <`, `%customSideInfo <`);
				_setInjectorFunc(`bottomSide`           , `%current-tab .subject-slide__aside >`, `%customSideInfo >`);
				_setInjectorFunc(`composition`          , `%bottom -`);
				_setInjectorFunc(`meaning`              , `%bottom -`);
				_setInjectorFunc(`reading`              , `%bottom -`);
				_setInjectorFunc(`examples`             , `%bottom -`);
				_setInjectorFunc(`meaningSide`          , `%bottomSide -`);
				_setInjectorFunc(`readingSide`          , `%bottomSide -`);
				_setInjectorFunc(`compositionSubsection`, `%composition -`);
				_setInjectorFunc(`meaningSubsection`    , `#meaning .subject-section__title-text {Meaning Notes, Name Notes} ^^-`);
				_setInjectorFunc(`readingSubsection`    , `#reading .subject-section__title-text {Reading Notes} ^^-`);
				_setInjectorFunc(`examplesSubsection`   , `%examples -`);
				break;
			case `lessonQuiz`:
			case `review`:
			case `extraStudy`:
				_setInjectorFunc(`top`                  , `.container <`);
				_setInjectorFunc(`bottom`               , `.container >`);
				_setInjectorFunc(`topSide`              , `%top ~`      );
				_setInjectorFunc(`bottomSide`           , `%bottom ~`   );
				_setInjectorFunc(`composition`          , `.subject-section--components` );
				_setInjectorFunc(`meaning`              , `.subject-section--meaning`    );
				_setInjectorFunc(`reading`              , `.subject-section--reading`    );
				_setInjectorFunc(`examples`             , `.subject-section--context, .subject-section--amalgamations`);
				_setInjectorFunc(`meaningSide`          , `.subject-section__meanings $` );
				_setInjectorFunc(`readingSide`          , `.subject-readings-with-audio, .subject-readings`);
				_setInjectorFunc(`compositionSubsection`, `.subject-section--components .subject-section__content >`);
				_setInjectorFunc(`meaningSubsection`    , `#user_meaning_note ^-`        );
				_setInjectorFunc(`readingSubsection`    , `#user_reading_note ^-`        );
				_setInjectorFunc(`examplesSubsection`   , `.subject-section--context .subject-section__content >`, `.subject-section--amalgamations .subject-section__content >`);
				break;
			default: break;
		}
	}

	function _handleStateChange() {
		_handleCallbacks(_callbacks);
	}

	function _handleCallbacks(callbacks) {
		callbacks.forEach(c => { c.injectorDeactivators.forEach(d => d()); c.injectorDeactivators = []; });
		_appendedElements.push(...callbacks.map(c => Object.values(c.appendedElements)).flat(2));
		_appendedElements.forEach(e => e.remove());
		_appendedElements = [];

		callbacks.forEach(c => { c.appendedElements = {}; c.alreadyHandled = false; _handleCallbackEntry(c); });

		_appendElementsGeneratedByCallbacks(_callbacks); // reappend ALL callbacks to guarantee consistent order
	}

	function _appendElementsGeneratedByCallbacks(callbacks) {
		let locations = [...new Set(callbacks.flatMap(c => Object.keys(c.appendedElements)))].filter(l => l !== `others`);
		let entries = locations.map(l => [l, callbacks.flatMap(c => c.appendedElements[l] || [])]);
		entries.forEach(([location, elements]) => _injectAt[location](...elements));
		_updateCustomSideInfoVisibility();
	}

	function _scheduleAppendElementsGeneratedByCallbacks(callbacks) {
		if (_scheduledCallbackElements.length === 0) {
			global.requestAnimationFrame(() => {
				_appendElementsGeneratedByCallbacks(_scheduledCallbackElements);
				_scheduledCallbackElements = [];
			});
		}
		_scheduledCallbackElements.push(...callbacks);
	}

	function _addCallbackEntry(stateSelector, callback) {
		let entryId = ++_maxEntryId;
		let callbackEntry = {stateSelector, callback, appendedElements: {}, injectorDeactivators: [], alreadyHandled: false, entryId};
		_callbacks.push(callbackEntry);
		if (_currentState.under) {  // only handle if current state is already known
			_handleCallbackEntry(callbackEntry);
			_scheduleAppendElementsGeneratedByCallbacks([callbackEntry]);
		}
		return entryId;
	}

	async function _handleCallbackEntry(callbackEntry) {
		if (callbackEntry.alreadyHandled) return;
		let injectUnder = _matchesCurrentStateUnder(callbackEntry.stateSelector);
		if (!injectUnder) return;

		let injectorState      = _currentStateDeepCopy();
		injectorState.injector = _createInjector(injectUnder, callbackEntry.stateSelector.spoiler, callbackEntry.appendedElements, callbackEntry.injectorDeactivators);
		//try { callbackEntry.callback.call(null, injectorState); } catch(e) { console.error(e); } // error in console pointed to this line as error source => workaround: use async so that caller of _handleCallbackEntry() continues to run even after error
		callbackEntry.callback.call(null, injectorState);
		callbackEntry.alreadyHandled = true;
	}

	function _matchesCurrentStateUnder(stateSelector) {
		if (!stateSelector.on  .includes(_currentState.on  )) return null;
		if (!stateSelector.type.includes(_currentState.type)) return null;
		let allUnder = [..._currentState.under, ..._currentState.hiddenSpoiler];
		let result   = [...stateSelector.under].reverse().find(s => allUnder.includes(s));
		return result;
	}

	function _createInjector(injectUnder, spoiler, appendedElements, injectorDeactivators) {
		let sideInfo = true;
		let injActive = true;
		let injector = {get active() { return injActive; }};
		injector.registerAppendedElement              = (element                          ) => _injectorRegisterAppendedElement(element, injActive, appendedElements);
		injector.append                               = (heading, body, additionalSettings) => _injectorAppend(heading, body, additionalSettings, injectUnder, injActive, ``          , spoiler, appendedElements);
		injector.appendSubsection                     = (heading, body, additionalSettings) => _injectorAppend(heading, body, additionalSettings, injectUnder, injActive, `Subsection`, spoiler, appendedElements);
		if (sideInfo) injector.appendSideInfo         = (heading, body, additionalSettings) => _injectorAppend(heading, body, additionalSettings, injectUnder, injActive, `Side`      , spoiler, appendedElements);
		injector.appendAtTop                          = (heading, body, additionalSettings) => _injectorAppend(heading, body, additionalSettings, injectUnder, injActive, `Top`       , spoiler, appendedElements);
		injector.appendAtBottom                       = (heading, body, additionalSettings) => _injectorAppend(heading, body, additionalSettings, injectUnder, injActive, `Bottom`    , spoiler, appendedElements);
		if (sideInfo) injector.appendSideInfoAtTop    = (heading, body, additionalSettings) => _injectorAppend(heading, body, additionalSettings, injectUnder, injActive, `TopSide`   , spoiler, appendedElements);
		if (sideInfo) injector.appendSideInfoAtBottom = (heading, body, additionalSettings) => _injectorAppend(heading, body, additionalSettings, injectUnder, injActive, `BottomSide`, spoiler, appendedElements);
		injectorDeactivators.push(() => { injActive = false; });
		return injector;
	}

	function _injectorRegisterAppendedElement(element, injActive, appendedElements) {
		if (!injActive                        ) throw `${_SCRIPT_NAME}: Injector is inactive`;
		if (![1, 3].includes(element.nodeType)) throw `${_SCRIPT_NAME}: Can only register elements or text nodes`;
		if (appendedElements.others) appendedElements.others.push(element); else appendedElements.others = [element];
	}

	function _injectorAppend(heading, body, additionalSettings, injectUnder, injActive, special, spoiler, appendedElements) {
		if (!body) return null;
		let under = additionalSettings?.under || injectUnder;
		if (!injActive                                                              ) throw `${_SCRIPT_NAME}: Injector is inactive`;
		if (!_currentState.under.concat(_currentState.hiddenSpoiler).includes(under)) throw `${_SCRIPT_NAME}: Under ${under} not available`;
		if (![`meaning`, `reading`].includes(under) && special === `Side`           ) throw `${_SCRIPT_NAME}: Cannot append side info under ${under}`;

		if ([`Top`, `TopSide`, `Bottom`, `BottomSide`].includes(special)) {
			under = _firstCharToLower(special);
			special = ``;
		}
		let pageListEntry = null;
		if (_currentState.on === `itemPage` && !special) {
			let u = `${under}PageList`;
			let space = document.createTextNode(` `);
			if (appendedElements[u]) appendedElements[u].push(space); else appendedElements[u] = [space];
			pageListEntry = _createSection(under, `PageList`, appendedElements);
		}

		let section = _createSection(under, special, appendedElements);
		_insertContent(heading, body, special, spoiler, section, pageListEntry, additionalSettings?.sectionName);

		if (additionalSettings?.injectImmediately && section) _injectAt[under + special](section);
		return section;
	}

	function _createSection(under, special, appendedElements) {
		under += special;
		let itemPageSideInfo = _currentState.on !== `lesson` && special === `Side`;
		let itemPagePageList = special === `PageList`;

		let section = document.createElement(itemPageSideInfo ? `div` : itemPagePageList ? `li` : `section`);
		section.classList.add(_CSS_NAMESPACE);
		section.classList.add(`${_CSS_NAMESPACE}-empty`);
		if (itemPagePageList) section.classList.add(`wk-nav__item`);
		if (itemPageSideInfo) section.classList.add(`subject-section__meanings`);
		if (appendedElements[under]) appendedElements[under].push(section); else appendedElements[under] = [section];
		return section;
	}

	async function _insertContent(heading, body, special, spoiler, section, pageListEntry, sectionName) {
		if (!section) return;
		let onItemPageOrReview = _currentState.on !== `lesson`;
		let isSideInfo         = special === `Side`;
		let collapsibleSection = ![`itemPage`, `lesson`].includes(_currentState.on) && special !== `Subsection` && special !== `Side`;

		if ([heading, body].some(p => p && typeof p === `object` && typeof p.then === `function`)) {
			heading = await heading;
			body    = await body;
		}

		if (!body) return;
		let elements = _toElements(body, false);
		if (elements.length === 0) return;
		let hHeading = collapsibleSection ? _toAccordionHeadingElement(heading) : _toHeadingElement(heading, onItemPageOrReview, special);
		if (hHeading) {
			if (pageListEntry && sectionName !== ``) {
				let link = document.createElement(`a`);
				link.href = `#`;
				link.textContent = sectionName || hHeading.textContent;
				link.classList.add(`wk-nav__item-link`);
				link.addEventListener(`click`, e => { section.scrollIntoView({behavior: `smooth`}); e.preventDefault(); });
				pageListEntry.append(link);
				pageListEntry.classList.remove(`${_CSS_NAMESPACE}-empty`);
			}
			section.appendChild(hHeading);
		}
		if (collapsibleSection) {
			section.classList.toggle(`${_CSS_NAMESPACE}-accordion-closed`, spoiler.some(s => _currentState.hiddenSpoiler.includes(s)));
			section.classList.add(`${_CSS_NAMESPACE}-accordion`);
			let div = document.createElement(`div`);
			div.append(...elements);
			elements = [div];
		}
		if (onItemPageOrReview && isSideInfo) elements.forEach(e => e.classList.add(`text-gray-700`, `subject-section__meanings-items`));
		section.append(...elements);
		section.classList.remove(`${_CSS_NAMESPACE}-empty`);
		_updateCustomSideInfoVisibility(section.ownerDocument);
	}

	function _toElements(strOrElements, justArray) {
		if (!strOrElements) return [];
		if (!Array.isArray(strOrElements)) strOrElements = [strOrElements];
		if (justArray || strOrElements.every(e => e.nodeType === 1)) return strOrElements;
		let p = document.createElement(`p`);
		p.append(...strOrElements);
		return [p];
	}

	function _toHeadingElement(heading, onItemPageOrReview, special) {
		let isSubsection = special === `Subsection`;
		let elements = _toElements(heading, true);
		if (elements.length === 0) return null;
		let result = document.createElement((onItemPageOrReview && isSubsection) ? `H3` : `H2`);
		result.append(...elements);
		if (onItemPageOrReview) result.classList.add(isSubsection ? `subject-section__subtitle` : special === `Side` ? `subject-section__meanings-title` : `subject-section__title`);
		return result;
	}

	function _toAccordionHeadingElement(heading) {
		let  svgns = `http://www.w3.org/2000/svg`;
		let result = document.createElement(`BUTTON`);
		let arrow = document.createElement(`span`);
		let svg = document.createElementNS(svgns, `svg`);
		let use = document.createElementNS(svgns, `use`);
		arrow.classList.add(`subject-section__toggle-icon`);
		svg.classList.add(`wk-icon`, `wk-icon--chevron_right`);
		svg.setAttributeNS(svgns, `viewBox`, `0 0 320 512`);
		svg.setAttribute(`aria-hidden`, `true`);
		use.setAttribute(`href`, `#wk-icon__chevron-right`);
		result.addEventListener(`click`, _handleAccordionHeadingClick);
		svg.append(use);
		arrow.append(svg);
		result.append(arrow, ..._toElements(heading, true));
		return result;
	}

	function _handleAccordionHeadingClick(e) {
		e.currentTarget.parentElement.classList.toggle(`${_CSS_NAMESPACE}-accordion-closed`);
	}

	function _updateCustomSideInfoVisibility() {
		if (_currentState.on !== `lesson` || !_currentState.under.includes(`meaning`)) return;
		let side = _getRootElement().querySelector(`#${_CSS_NAMESPACE}-loc-customSideInfo`);
		side?.classList.add(`pure-u-1-4`, `col1`, `subject-slide__aside`);
		side?.classList.toggle(`${_CSS_NAMESPACE}-empty`, !side.querySelector(`.${_CSS_NAMESPACE}:not(.${_CSS_NAMESPACE}-empty)`));
	}

	// REGION 3: CSS injection

	function _addCss() {
		let style = document.createElement(`style`);
		style.textContent = `
			.${_CSS_NAMESPACE}-empty                                                { display: none;                           }
			.${_CSS_NAMESPACE}:not(.wk-nav__item):not(.subject-section__meanings)   { scroll-margin: 80px; margin: 0 0 30px; line-height: 1.6; font-size: 16px; text-shadow: 0 1px 0 #fff; }
			.${_CSS_NAMESPACE} > h2:not(.subject-section__meanings-title)           { line-height: 1.6; font-family: var(--font-family-title); line-height: 1.4; font-size: 28px; text-shadow: 0 1px 0 #fff; border-bottom: 1px solid #d5d5d5; margin-bottom: 10px; }
			.${_CSS_NAMESPACE} > h3                                                 { margin-top: 30px; }
			.${_CSS_NAMESPACE}.${_CSS_NAMESPACE}-accordion                          { margin: 0;                               }
			.${_CSS_NAMESPACE}-accordion-closed > div                               { display: none;                           }
			.${_CSS_NAMESPACE}-accordion > button                                   { align-items: center; display: flex; width: 100%; padding: 0 0 7px; background: none; text-align: left; cursor: pointer; font-family: var(--font-family-title); line-height: 1.4; font-size: 28px; text-shadow: 0 1px 0 #fff; border: none; border-bottom: 1px solid #d5d5d5; margin-bottom: 10px; color: inherit; }
			.${_CSS_NAMESPACE}-accordion .subject-section__toggle-icon              { display: block; transform: rotate(90deg); margin-right: var(--spacing-tight); }
			.${_CSS_NAMESPACE}-accordion-closed .subject-section__toggle-icon       { transform: rotate(0);                    }
			.${_CSS_NAMESPACE}-accordion > button > span > svg                      { width: 11.25px                           }
			.subject-readings                                                       { margin-bottom: var(--spacing-normal);    }`;
		document.head.appendChild(style);
	}

	// REGION 4: Helper functions for providing the interface that allows to register callbacks

	function _currentStateDeepCopy() {
		let copy = {..._currentState};
		let arrayProperties = [`under`, `hiddenSpoiler`, `partOfSpeech`, `meaning`, `onyomi`, `kunyomi`, `nanori`, `reading`];
		arrayProperties.forEach(prop => { if (_currentState[prop]) copy[prop] = [..._currentState[prop]]; });
		let composition = _currentState.composition?.map(c => {
			let result = {characters: c.characters, meaning: [...c.meaning]};
			if (c.reading) result.reading = [...c.reading];
			return result;
		});
		if (composition) copy.composition = composition;
		return copy;
	}

	function _argumentsToArray(args) {
		return args?.flatMap(a => a.split(`,`)).map(a => a.trim()) || [];
	}

	function _removeDuplicates(array) {
		return array.filter((a, i) => array.indexOf(a) === i);
	}

	function _checkAgainst(array, keywords) {
		let duplicateKeywords = array.filter((a, i) => array.includes(a, i + 1) && array.indexOf(a) === i);
		let unknownKeywords = _removeDuplicates(array.filter(a => !keywords.includes(a)));
		if (unknownKeywords  .length > 0) throw `${_SCRIPT_NAME}: Unknown keywords [${unknownKeywords.join(`, `)}]`;
		if (duplicateKeywords.length > 0) throw `${_SCRIPT_NAME}: Duplicate keywords [${duplicateKeywords.join(`, `)}]`;
		return array;
	}

	function _fillStateSelector(stateSelector) {
		if (!stateSelector.on   ?.length) stateSelector.on    = [`itemPage`, `lesson`, `lessonQuiz`, `review`, `extraStudy`];
		if (!stateSelector.type ?.length) stateSelector.type  = [`radical`, `kanji`, `vocabulary`, `kanaVocabulary`];
		if (!stateSelector.under?.length) stateSelector.under = [`composition`, `meaning`, `reading`, `examples`];
		stateSelector.spoiler = stateSelector.spoiler || stateSelector.under;
		return stateSelector;
	}

	function _executeCallback(strOrCallback) {
		if (typeof strOrCallback !== `function`) return strOrCallback;
		return strOrCallback(_currentStateDeepCopy());
	}

	function _removeElementsOfEntry(callbackEntry) {
		callbackEntry.injectorDeactivators.forEach(d => d());
		callbackEntry.injectorDeactivators = [];
		Object.values(callbackEntry.appendedElements).flat().forEach(e => e.remove());
		callbackEntry.appendedElements = {};
	}

	function _remove(entryId) {
		let callbackEntry = _callbacks.find(c => c.entryId === entryId);
		_removeElementsOfEntry(callbackEntry);
		_callbacks = _callbacks.filter(c => c.entryId !== entryId);
		_updateCustomSideInfoVisibility();
	}

	function _renew(entryId) {
		let callbackEntry = _callbacks.find(c => c.entryId === entryId);
		callbackEntry.alreadyHandled = false;
		_removeElementsOfEntry(callbackEntry);
		_handleCallbackEntry(callbackEntry);
		_appendElementsGeneratedByCallbacks(_callbacks);
		_updateCustomSideInfoVisibility();
	}

	function _isNewerThan(otherVersion) {
		let v1 = _VERSION.split(`.`).map(v => parseInt(v));
		let v2 = otherVersion.split(`.`).map(v => parseInt(v));
		return v1.reduce((r, v, i) => r ?? (v === v2[i] ? null : (v > (v2[i] || 0))), null) || false;
	}

	function _selectorChain(currentChainLink, stateSelector) {
		let result = {};
		switch(currentChainLink) {
			case `on`      : result.forType                = (...types     ) => _forType               (stateSelector, types   ); // fall through
			case `forType` : result.under                  = (...tabs      ) => _under                 (stateSelector, tabs    ); // fall through
			case `under`   : result.spoiling               = (...spoilers  ) => _spoiling              (stateSelector, spoilers); // fall through
			case `spoiling`: result.notify                 = (callback     ) => _notify                (stateSelector, callback);
			                 result.notifyWhenVisible      = (callback     ) => _notifyWhenVisible     (stateSelector, callback);
			                 result.append                 = (heading, body) => _append                (stateSelector, heading, body);
			                 result.appendSideInfo         = (heading, body) => _appendSideInfo        (stateSelector, heading, body);
			                 result.appendSubsection       = (heading, body) => _appendSubsection      (stateSelector, heading, body);
			                 result.appendAtTop            = (heading, body) => _appendAtTop           (stateSelector, heading, body);
			                 result.appendAtBottom         = (heading, body) => _appendAtBottom        (stateSelector, heading, body);
			                 result.appendSideInfoAtTop    = (heading, body) => _appendSideInfoAtTop   (stateSelector, heading, body);
			                 result.appendSideInfoAtBottom = (heading, body) => _appendSideInfoAtBottom(stateSelector, heading, body);
		}
		if (stateSelector.on?.length && stateSelector.on    .every(o => ![`review`, `lessonQuiz`, `extraStudy`].includes(o)))   delete result.spoiling;
		if (                            stateSelector.under?.some (u => ![`meaning`, `reading`                ].includes(u))) { delete result.appendSideInfo; delete result.appendSideInfoAtTop; delete result.appendSideInfoAtBottom; }
		return result;
	}

	function _actionHandle(entryId) {
		return entryId ? {
			remove: () => _remove(entryId),
			renew : () => _renew (entryId)
		} : null;
	}

	function _on(stateSelector, pages) {
		stateSelector.on = _checkAgainst(_argumentsToArray(pages), [`itemPage`, `lesson`, `lessonQuiz`, `review`, `extraStudy`]);
		return _selectorChain(`on`, stateSelector);
	}

	function _forType(stateSelector, types) {
		stateSelector.type = _checkAgainst(_argumentsToArray(types), [`radical`, `kanji`, `vocabulary`, `kanaVocabulary`]);
		return _selectorChain(`forType`, stateSelector);
	}

	function _under(stateSelector, tabs) {
		stateSelector.under = _checkAgainst(_argumentsToArray(tabs), [`composition`, `meaning`, `reading`, `examples`]);
		return _selectorChain(`under`, stateSelector);
	}

	function _spoiling(stateSelector, spoilers) {
		stateSelector.spoiler = (spoilers.length === 1 && spoilers[0].trim() === `nothing`) ? [] : _checkAgainst(_argumentsToArray(spoilers), [`composition`, `meaning`, `reading`, `examples`]);
		return _selectorChain(`spoiling`, stateSelector);
	}

	function _notifyWhenVisible(stateSelector, callback) {
		stateSelector.content = true;
		return _notify(stateSelector, async (...args) => { await _rootElementContentInMainPage(); callback(...args); });
	}

	function _notify(stateSelector, callback) {
		let entryId = null;
		if (callback) entryId = _addCallbackEntry(_fillStateSelector(stateSelector), callback);
		return _actionHandle(entryId);
	}

	function _append(stateSelector, heading, body) {
		let entryId = null;
		if (body) entryId = _addCallbackEntry(_fillStateSelector(stateSelector), injectorState => injectorState.injector.append(_executeCallback(heading), _executeCallback(body)));
		return _actionHandle(entryId);
	}

	function _appendSideInfo(stateSelector, heading, body) {
		stateSelector.content = true;
		if (!stateSelector.under?.length) stateSelector.under = [`meaning`, `reading`];
		let entryId = null;
		if (body) entryId = _addCallbackEntry(_fillStateSelector(stateSelector), injectorState => injectorState.injector.appendSideInfo(_executeCallback(heading), _executeCallback(body)));
		return _actionHandle(entryId);
	}

	function _appendSubsection(stateSelector, heading, body) {
		stateSelector.content = true;
		let entryId = null;
		if (body) entryId = _addCallbackEntry(_fillStateSelector(stateSelector), injectorState => injectorState.injector.appendSubsection(_executeCallback(heading), _executeCallback(body)));
		return _actionHandle(entryId);
	}

	function _appendAtTop(stateSelector, heading, body) {
		let entryId = null;
		if (body) entryId = _addCallbackEntry(_fillStateSelector(stateSelector), injectorState => injectorState.injector.appendAtTop(_executeCallback(heading), _executeCallback(body)));
		return _actionHandle(entryId);
	}

	function _appendAtBottom(stateSelector, heading, body) {
		let entryId = null;
		if (body) entryId = _addCallbackEntry(_fillStateSelector(stateSelector), injectorState => injectorState.injector.appendAtBottom(_executeCallback(heading), _executeCallback(body)));
		return _actionHandle(entryId);
	}

	function _appendSideInfoAtTop(stateSelector, heading, body) {
		if (!stateSelector.under?.length) stateSelector.under = [`meaning`, `reading`];
		let entryId = null;
		if (body) entryId = _addCallbackEntry(_fillStateSelector(stateSelector), injectorState => injectorState.injector.appendSideInfoAtTop(_executeCallback(heading), _executeCallback(body)));
		return _actionHandle(entryId);
	}

	function _appendSideInfoAtBottom(stateSelector, heading, body) {
		if (!stateSelector.under?.length) stateSelector.under = [`meaning`, `reading`];
		let entryId = null;
		if (body) entryId = _addCallbackEntry(_fillStateSelector(stateSelector), injectorState => injectorState.injector.appendSideInfoAtBottom(_executeCallback(heading), _executeCallback(body)));
		return _actionHandle(entryId);
	}

	function _domReady() {
		return document.readyState === `interactive` || document.readyState === `complete`;
	}

	async function _publishInterface() {
		if (unsafeGlobal.wkItemInfo && !_isNewerThan(unsafeGlobal.wkItemInfo.version)) return;
		// if newer, register this version instead
		// the older version will also continue to run, creating a bit of an overhead
		// but this should be negligible; there probably won't be that many versions
		// of WaniKani Item Info Injector anyway, and ideally, all scripts @require
		// the newest version; as a last resort, users can also install the newest
		// version of this script manually and set it as the first executed script
		// in their script manager

		unsafeGlobal.wkItemInfo = Object.freeze({
			// public functions
			on                    : (...pages     ) => _on                    ({}, pages),
			forType               : (...types     ) => _forType               ({}, types),
			under                 : (...tabs      ) => _under                 ({}, tabs),
			spoiling              : (...spoilers  ) => _spoiling              ({}, spoilers),
			notify                : (callback     ) => _notify                ({}, callback),
			notifyWhenVisible     : (callback     ) => _notifyWhenVisible     ({}, callback),
			append                : (heading, body) => _append                ({}, heading, body),
			appendSideInfo        : (heading, body) => _appendSideInfo        ({}, heading, body),
			appendSubsection      : (heading, body) => _appendSubsection      ({}, heading, body),
			appendAtTop           : (heading, body) => _appendAtTop           ({}, heading, body),
			appendAtBottom        : (heading, body) => _appendAtBottom        ({}, heading, body),
			appendSideInfoAtTop   : (heading, body) => _appendSideInfoAtTop   ({}, heading, body),
			appendSideInfoAtBottom: (heading, body) => _appendSideInfoAtBottom({}, heading, body),
			version               : _VERSION,
			get currentState() { _updateCurrentState(); return _currentStateDeepCopy(); }
		});

		if (!_domReady()) {
			await new Promise(resolve => document.addEventListener(`readystatechange`, resolve, {once: true}));
		}

		_init();
		_addCss();
	}

	_publishInterface();
})(window, window.unsafeWindow || window);
