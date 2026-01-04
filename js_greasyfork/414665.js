// ==UserScript==
// @name          WaniKani Open Framework Search Filters
// @namespace     https://www.wanikani.com
// @description   Additional Search filters for the WaniKani Open Framework
// @author        prouleau
// @version       1.4.1
// @match         https://www.wanikani.com/*
// @license       MIT; http://opensource.org/licenses/MIT
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/414665/WaniKani%20Open%20Framework%20Search%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/414665/WaniKani%20Open%20Framework%20Search%20Filters.meta.js
// ==/UserScript==

(function(wkof) {
	'use strict';

	var wkofMinimumVersion = '1.0.52';

	if (!wkof) {
		var response = confirm('WaniKani Open Framework Date Filters requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

		if (response) {
			window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
		}

		return;
	}
	var settingsDialog;
	var settingsScriptId = 'searchFilters';
	var settingsTitle = 'Search Filters';

	var needToRegisterFilters = true;

	var filterNamePrefix = 'searchFilters_';
	var globalSearchFilterName = filterNamePrefix + 'globalSearch';
	var exactSearchFilterName = filterNamePrefix + 'exactSearch';
	var kunSearchFilterName = filterNamePrefix + 'kunSearch';
	var onSearchFilterName = filterNamePrefix + 'onSearch';
	var componentsSearchFilterName = filterNamePrefix + 'componentsSearch';
	var usedInSearchFilterName = filterNamePrefix + 'usedInSearch';
	var visSimSearchFilterName = filterNamePrefix + 'visSimSearch';
	var allowSearchFilterName = filterNamePrefix + 'allowSearch';
	var blockSearchFilterName = filterNamePrefix + 'blockSearch';
	var ctxSenSearchFilterName = filterNamePrefix + 'ctxSenkSearch';
	var mnemonicsSearchFilterName = filterNamePrefix + 'mnemonicsSearch';

	var supportedFilters = [globalSearchFilterName, exactSearchFilterName, kunSearchFilterName, onSearchFilterName, componentsSearchFilterName,
                            usedInSearchFilterName, visSimSearchFilterName, allowSearchFilterName, blockSearchFilterName, ctxSenSearchFilterName,
                            mnemonicsSearchFilterName, ];

    function prepareSubjectIndexThenRegisterFilters(){
        wkof.set_state(settingsScriptId, 'loading');
        var config = {wk_items: {filters:{}, options:{'subjects': true,}}};
        wkof.include('ItemData');
        wkof.ready('ItemData')
            .then(function(){return wkof.ItemData.get_items(config)})
            .then(prepareIndex)
            .then(updateFiltersWhenReady)
    }

    var componentIndex = {};
    var usedInIndex = {};
    var visuallySimilarIndex = {};
    function prepareIndex(items){
        for (var item of items){
            if (item.object !== 'radical'){
                componentIndex[item.data.slug] = componentIndex[item.data.slug] || [];
                componentIndex[item.data.slug] = componentIndex[item.data.slug].concat(item.data.component_subject_ids);
            }
            if (item.object !== 'vocabulary'){
                usedInIndex[item.data.slug] = usedInIndex[item.data.slug] || [];
                usedInIndex[item.data.slug] = usedInIndex[item.data.slug].concat(item.data.amalgamation_subject_ids);
                if (item.object === 'radical' && item.data.characters !== null){
                    usedInIndex[item.data.characters] = usedInIndex[item.data.characters] || [];
                    usedInIndex[item.data.characters] = usedInIndex[item.data.characters].concat(item.data.amalgamation_subject_ids);
                }
            }
             if (item.object === 'kanji'){
                visuallySimilarIndex[item.data.slug] = visuallySimilarIndex[item.data.slug] || [];
                visuallySimilarIndex[item.data.slug] = visuallySimilarIndex[item.data.slug].concat(item.data.visually_similar_subject_ids);
            }
        }
    }

	function updateFiltersWhenReady() {
		needToRegisterFilters = true;
		return waitForItemDataRegistry().then(registerFilters);
	}

	function waitForItemDataRegistry() {
		return wkof.wait_state('wkof.ItemData.registry', 'ready');
	}

	function registerFilters() {
		if (!needToRegisterFilters) {
			return;
		}

		supportedFilters.forEach(function(filterName) {
			delete wkof.ItemData.registry.sources.wk_items.filters[filterName];
		});

		registerSearchFilter();
        registerExactSearchFilter();
        registerKunSearchFilter();
        registerOnSearchFilter();
        registerComponentsSearchFilter();
        registerUsedInSearchFilter();
        registerVisSimSearchFilter();
        registerAllowSearchFilter();
        registerBlockSearchFilter();
        registerCtxSenSearchFilter();
        registerMnemonicsSearchFilter();

		needToRegisterFilters = false;
        wkof.set_state(settingsScriptId, 'ready');
	}

    function split_list(str) {return str.replace(/、/g,',').replace(/[\s ]+/g,' ').trim().replace(/ *, */g, ',').toLowerCase().split(',').filter(function(name) {return (name.length > 0);});}

    function makeComponentPairs(str){
        return split_list(str).reduce((acc, item) =>{return acc.concat(componentIndex[item] || [] )}, []);
    }

    function makeUsedInPairs(str){
        return split_list(str).reduce((acc, item) =>{return acc.concat(usedInIndex[item.replace(' ', '-')]) || [] }, []);
    }

    function makeVisuallySimilarPairs(str){
        return split_list(str).reduce((acc, item) =>{return acc.concat(visuallySimilarIndex[item] || [] )}, []);
    }

	// BEGIN Global Search
    let searchHover_tip = 'Enter a search term for meaning, reading or kanji.\nAll approximate matches will be found.\nYou may use latin, kana and kanji.\nMultiple terms separated by commas are allowed.';

	function registerSearchFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[globalSearchFilterName] = {
			type: 'text',
			label: 'Global Search',
            placeholder: 'gambler, 力士',
			default: '',
			filter_func: searchFilter,
            filter_value_map: split_list,
			set_options: function(options) { options.subjects = true; },
			hover_tip: searchHover_tip,
		};
	}

	function searchFilter(filterValue, item) {
		if (item.data === undefined) {
			return false;
		};
        for (var searchTerm of filterValue){
            if (item.data.characters !== null) if (item.data.characters.indexOf(searchTerm) >= 0){return true};
            if (item.data.slug.indexOf(searchTerm.replace(' ', '-')) >= 0){return true};
            for (var meaning of item.data.meanings){
                if (meaning.accepted_answer && meaning.meaning.toLowerCase().indexOf(searchTerm) >= 0){return true};
            };
            if (item.object !== 'radical' && item.object !== 'kana_vocabulary'){
                for (let reading of item.data.readings){
                    if (reading.reading.indexOf(searchTerm) >= 0) {return true;};
                };
            };
        };
		return false;
	}

	// END Global Search

	// BEGIN Exact Search
    let exactSearchHover_tip = 'Enter a search term for meaning, reading or kanji.\nReturns only exact matches.\nYou may use latin, kana and kanji.\nMultiple terms separated by commas are allowed.';

	function registerExactSearchFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[exactSearchFilterName] = {
			type: 'text',
			label: 'Exact Search',
			default: '',
            placeholder: 'gambler, 力士',
			filter_func: exactSearchFilter,
            filter_value_map: split_list,
			set_options: function(options) { options.subjects = true; },
			hover_tip: exactSearchHover_tip,
		};
	}

	function exactSearchFilter(filterValue, item) {
		if (item.data === undefined) {
			return false;
		};
        for (var searchTerm of filterValue){
            if (item.data.characters !== null) if (searchTerm === item.data.characters) {return true};
            if (searchTerm.replace(' ', '-') === item.data.slug){return true};
            for (var meaning of item.data.meanings){
                if (!meaning.accepted_answer) break;
                let term = meaning.meaning.trim().toLowerCase();
                if (searchTerm === term){return true};
                let words = term.split(' ').filter(function(name) {return (name.length > 0);})
                for (var word of words) {
                    if (searchTerm === word){return true};
                }
            };
            if (item.object !== 'radical' && item.object !== 'kana_vocabulary'){
                for (let reading of item.data.readings){
                    if (searchTerm === reading.reading) {return true;};
                };
            };
        };
		return false;
	}

	// END Exact Search

	// BEGIN Kunyomi Search
    let kunSearchHover_tip = 'Enter a search term for kunyomi reading.\nReturns only exact matches.\nMultiple terms separated by commas are allowed.';

	function registerKunSearchFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[kunSearchFilterName] = {
			type: 'text',
			label: 'Kunyomi Search',
			default: '',
            placeholder: 'し、のう',
			filter_func: kunSearchFilter,
            filter_value_map: split_list,
			set_options: function(options) { options.subjects = true; },
			hover_tip: kunSearchHover_tip,
		};
	}

	function kunSearchFilter(filterValue, item) {
		if (item.data === undefined) {
			return false;
		};
        for (var searchTerm of filterValue){
            if (item.object === 'kanji'){
                for (var reading of item.data.readings){
                    if (reading.accepted_answer && reading.type === 'kunyomi' && searchTerm === reading.reading){return true};
                };
            };
        };
		return false;
	}

    // END Kunyomi Search

	// BEGIN Onyomi Search
    let onSearchHover_tip = 'Enter a search term for onyomi reading.\nReturns only exact matches.\nMultiple terms separated by commas are allowed.';

	function registerOnSearchFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[onSearchFilterName] = {
			type: 'text',
			label: 'Onyomi Search',
			default: '',
            placeholder: 'し、のう',
			filter_func: onSearchFilter,
            filter_value_map: split_list,
			set_options: function(options) { options.subjects = true; },
			hover_tip: onSearchHover_tip,
		};
	}

	function onSearchFilter(filterValue, item) {
		if (item.data === undefined) {
			return false;
		};
        for (var searchTerm of filterValue){
            if (item.object === 'kanji'){
                for (var reading of item.data.readings){
                    if (reading.accepted_answer && reading.type === 'onyomi' && searchTerm === reading.reading){return true};
                };
            };
        };
		return false;
	}

    // END Onyomi Search

	// BEGIN Components Search
    let componentsSearchHover_tip = 'Looking for components on listed items.\nRadicals for kanji, Kanji for vocabulary.\nMultiple terms separated by commas are allowed.';

	function registerComponentsSearchFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[componentsSearchFilterName] = {
			type: 'text',
			label: 'Components Search',
			default: '',
            placeholder: '能、入り口',
			filter_func: componentsSearchFilter,
            filter_value_map: makeComponentPairs,
			set_options: function(options) { options.subjects = true; },
			hover_tip: componentsSearchHover_tip,
		};
	}

	function componentsSearchFilter(filterValue, item) {
		if (item.data === undefined) {
			return false;
		};
        return (item.object !== 'vocabulary' || item.object !== 'kana_vocabulary') && (filterValue.indexOf(item.id) >= 0);
	}

    // END Components Search

	// BEGIN Used In Search
    let usedInSearchHover_tip = 'Looking for where listed items are used.\nKanji for radicals, Vocabulary for kanji.\nMultiple terms separated by commas are allowed.';

	function registerUsedInSearchFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[usedInSearchFilterName] = {
			type: 'text',
			label: 'Where Used Search',
			default: '',
            placeholder: '能、ground',
			filter_func: usedInSearchFilter,
            filter_value_map: makeUsedInPairs,
			set_options: function(options) { options.subjects = true; },
			hover_tip: usedInSearchHover_tip,
		};
	}

	function usedInSearchFilter(filterValue, item) {
		if (item.data === undefined) {
			return false;
		};
        return (item.object !== 'radical' || item.object !== 'kana_vocabulary') && (filterValue.indexOf(item.id) >= 0)
	}

    // END Used In Search

	// BEGIN Visually Similar Search
    let visSimSearchHover_tip = 'Looking for kanji visually similar to listed kanji.\naccording to Wanikani.\nMultiple terms separated by commas are allowed.';

	function registerVisSimSearchFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[visSimSearchFilterName] = {
			type: 'text',
			label: 'WK Visually Similar',
			default: '',
            placeholder: '能、人',
			filter_func: visSimSearchFilter,
            filter_value_map: makeVisuallySimilarPairs,
			set_options: function(options) { options.subjects = true; },
			hover_tip: visSimSearchHover_tip,
		};
	}

	function visSimSearchFilter(filterValue, item) {
		if (item.data === undefined) {
			return false;
		};
        return (item.object === 'kanji') && (filterValue.indexOf(item.id) >= 0);
	}

    // END Visually Similar Search

    // BEGIN Allow List Search
    let allowSearchHover_tip = 'Enter a search term for the allow list.\nAll approximate matches will be found.\n# will match empty allow lists.\n* will match non empty allow lists.\nMultiple terms separated by commas are allowed.';

	function registerAllowSearchFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[allowSearchFilterName] = {
			type: 'text',
			label: 'Allow List Search',
			default: '',
            placeholder: 'pure, conflict',
			filter_func: allowSearchFilter,
            filter_value_map: split_list,
			set_options: function(options) { options.subjects = true; },
			hover_tip: allowSearchHover_tip,
		};
	}

	function allowSearchFilter(filterValue, item) {
		if (item.data === undefined) {
			return false;
		};
        var list = item.data.auxiliary_meanings.filter((entry)=> entry.type === 'whitelist');
        for (var searchTerm of filterValue){
            if (searchTerm === '#' && list.length === 0) return true;
            if (searchTerm === '*' && list.length !== 0) return true;
            for (var allowTerm of list){
                if (allowTerm.meaning.indexOf(searchTerm) >= 0) return true;
            };
        };
		return false;
	}

	// END Allow List Search

    // BEGIN Block List Search
    let blockSearchHover_tip = 'Enter a search term for the block list.\nAll approximate matches will be found.\n# will match empty block lists.\n* will match non empty block lists.\nMultiple terms separated by commas are allowed.';

	function registerBlockSearchFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[blockSearchFilterName] = {
			type: 'text',
			label: 'Block List Search',
			default: '',
            placeholder: 'pure, conflict',
			filter_func: blockSearchFilter,
            filter_value_map: split_list,
			set_options: function(options) { options.subjects = true; },
			hover_tip: blockSearchHover_tip,
		};
	}

	function blockSearchFilter(filterValue, item) {
		if (item.data === undefined) {
			return false;
		};
        var list = item.data.auxiliary_meanings.filter((entry)=> entry.type === 'blacklist');
        for (var searchTerm of filterValue){
            if (searchTerm === '#' && list.length === 0) return true;
            if (searchTerm === '*' && list.length !== 0) return true;
            for (var allowTerm of list){
                if (allowTerm.meaning.indexOf(searchTerm) >= 0) return true;
            };
        };
		return false;
	}

	// END Block List Search

    // BEGIN Context Sentences Search
    let ctxSenSearchHover_tip = 'Enter a search term for the context sentences.\nAll approximate matches will be found.\n# will match empty empty context sentences lists.\n* will match non empty empty context sentences lists.\nMultiple terms separated by commas are allowed.';

	function registerCtxSenSearchFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[ctxSenSearchFilterName] = {
			type: 'text',
			label: 'Context Sentences Search',
			default: '',
            placeholder: 'pure, conflict',
			filter_func: ctxSenSearchFilter,
            filter_value_map: split_list,
			set_options: function(options) { options.subjects = true; },
			hover_tip: ctxSenSearchHover_tip,
		};
	}

	function ctxSenSearchFilter(filterValue, item) {
		if (item.data === undefined) {
			return false;
		};
		if (item.object !== 'vocabulary' && item.object !== 'kana_vocabulary') {
			return false;
		};
        var list = item.data.context_sentences;
        for (var searchTerm of filterValue){
            if (searchTerm === '#' && list.length === 0) return true;
            if (searchTerm === '*' && list.length !== 0) return true;
            for (var sentences of list){
                if (sentences.ja.indexOf(searchTerm) >= 0) return true;
                if (sentences.en.indexOf(searchTerm) >= 0) return true;
            };
        };
		return false;
	}

	// END  Context Sentences Search

    // BEGIN Mnemonics and Notes Search
    let mnemonicsSearchHover_tip = 'Enter a search term for the mnemonics, hints or user notes.\nAll approximate matches will be found.\nMultiple terms separated by commas are allowed.';

	function registerMnemonicsSearchFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[mnemonicsSearchFilterName] = {
			type: 'text',
			label: 'Mnemonics/Notes Search',
			default: '',
            placeholder: 'pure, conflict',
			filter_func: mnemonicsSearchFilter,
            filter_value_map: split_list,
			set_options: function(options) { options.subjects = true; options.study_materials = true; },
			hover_tip: mnemonicsSearchHover_tip,
		};
	}

	function mnemonicsSearchFilter(filterValue, item) {
		if (item.data === undefined) {
			return false;
		};
        for (var searchTerm of filterValue){
            if (item.data.meaning_mnemonic.indexOf(searchTerm) >= 0) return true;
            if (item.data.reading_mnemonic && item.data.reading_mnemonic.indexOf(searchTerm) >= 0) return true;
            if (item.data.meaning_hint && item.data.meaning_hint.indexOf(searchTerm) >= 0) return true;
            if (item.data.reading_hint && item.data.reading_hint.indexOf(searchTerm) >= 0) return true;
            if (item.study_materials && item.study_materials.meaning_note && item.study_materials.meaning_note.indexOf(searchTerm) >= 0) return true;
            if (item.study_materials && item.study_materials.reading_note && item.study_materials.reading_note.indexOf(searchTerm) >= 0) return true;
        };
		return false;
	}

	// END  Mnemonics and Notes Search


    prepareSubjectIndexThenRegisterFilters();
})(window.wkof);