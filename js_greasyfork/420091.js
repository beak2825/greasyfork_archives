// ==UserScript==
// @name          WaniKani Open Framework Kanjidic2 and Traditional Radicals Filters
// @namespace     https://www.wanikani.com
// @description   Kanjidic2 and traditional radicals filters for the WaniKani Open Framework
// @author        prouleau
// @version       1.4.2
// @match         https://www.wanikani.com/*
// @license       GPLV3; https://www.gnu.org/licenses/gpl-3.0.en.html and MIT; http://opensource.org/licenses/MIT --- with an exception described in comments
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/420091/WaniKani%20Open%20Framework%20Kanjidic2%20and%20Traditional%20Radicals%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/420091/WaniKani%20Open%20Framework%20Kanjidic2%20and%20Traditional%20Radicals%20Filters.meta.js
// ==/UserScript==


// ===============================================================
// Software Licence
//
// The license is GPLV3 or later because this script includes @acm2010 code and databases licenced under GPLV3 or later
// --- for Keisei Semantic-Phonetic Composition
// --- for Niai Visual Similarity Data
//
// Code borrowed from WKOF is licensed under MIT --- http://opensource.org/licenses/MIT
//
// You may use Item Inspector code under either the GPLV3 or MIT license with these restrictions.
// --- The GPLV3 or later code and database borrowed from @acm2010 must remain licensed under GPLV3 or later in all cases.
// --- If you use @acm2010 code and/or databases you work as a whole must be licensed under GPLV3 or later to comply with @acm2010 license.
// --- The MIT code borrowed from WKOF must remain licensed under MIT in all cases.
// These restrictions are required because we can't legally change the license for someone else's code and database without their permission.
// Not even if we modify their code.
//
// ===============================================================

/* globals $, _, LZMA  */
/* eslint-disable no-eval */
/* eslint-disable no-multi-spaces */
/* eslint-disable curly */
/* eslint-disable no-return-assign */

var advSearchFilters = {};

(function(wkof) {
    'use strict';

    //=================================================================
    // These filters are button type filters
    // They need a path to be defined in the config parameter of the on_click handler to locate where to store the filter parameters.
    // The exception is Self Study Quiz because the path is automatically figured out upon detection that the on_click function is called from Self Study Quiz
    //
    // They support the callable dialog protocol, meaning that the on_click handler is callable directly without having to click an actual button
    // The support of this protocol is indicated by the flag  callable_dialog: true  in the registry entry for the filter
    //
    // Callable on_click handlers support in their config parameter three callbacks and require one parameter
    //
    // on_save:   called when the settings are saved
    // on_cancel: called when the settings are cancelled
    // on_close:  called when the dialog is closed
    // script_id: (required when called without clicking a button) must be the script id used to store wkof settings. (wkof.settings[script_id])
    //
    //=================================================================

    var wkofMinimumVersion = '1.0.52';

    if (!wkof) {
        var response = confirm('WaniKani Open Framework Date Filters requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

        if (response) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }

        return;
    }

    // --------------------------------------
    // File names for resources to be loaded.

    // Prerequisite scripts
    const lodash_file = 'https://raw.githubusercontent.com/rouleaup88/item-inspector/main/lodash.min.js';
    const lzma_file = 'https://raw.githubusercontent.com/rouleaup88/item-inspector/main/lzma.js';
    const lzma_shim_file = 'https://raw.githubusercontent.com/rouleaup88/item-inspector/main/lzma.shim.js';

    // Stroke count for Wanikani radicals
    const Wkit_StrokeCountforRadicals = 'https://raw.githubusercontent.com/rouleaup88/item-inspector/main/WK_radicals.json.compressed';

    // Traditional radicals items
    const traditionaRadicalsFile = 'https://raw.githubusercontent.com/rouleaup88/item-inspector/main/trad_rad.json.compressed';

    // Kanjidic 2 data
    const kanjidic2File = 'https://raw.githubusercontent.com/rouleaup88/item-inspector/main/kanjidic2.json.compressed';

    // Keisei Semantic-Phonetic Composition databases
    const kanji_db = 'https://raw.githubusercontent.com/rouleaup88/item-inspector/main/kanji_esc.json.compressed';
    const phonetic_db = 'https://raw.githubusercontent.com/rouleaup88/item-inspector/main/phonetic_esc.json.compressed';
    const wk_kanji_db = 'https://raw.githubusercontent.com/rouleaup88/item-inspector/main/wk_kanji_esc.json.compressed';

    // Lars Yencken visually similar kanji database - also required for Niai visual similarity
    const visuallySimilarFilename = 'https://raw.githubusercontent.com/rouleaup88/item-inspector/main/stroke_edit_dist_esc.json.compressed';

    // Niai Visually similar databases
    const from_keisei_db_filename ='https://raw.githubusercontent.com/rouleaup88/item-inspector/main/from_keisei_esc.json.compressed';
    const old_script_db_filename ='https://raw.githubusercontent.com/rouleaup88/item-inspector/main/old_script_esc.json.compressed';
    const wk_niai_noto_db_filename ='https://raw.githubusercontent.com/rouleaup88/item-inspector/main/wk_niai_noto_esc.json.compressed';
    const yl_radical_db_filename ='https://raw.githubusercontent.com/rouleaup88/item-inspector/main/yl_radical_esc.json.compressed';

    // END of filenames
    //-------------------

    var settingsScriptId = 'advSearchFilters';
    var settingsTitle = 'Advanced Search Filters';

    var needToRegisterFilters = true;

    var filterNamePrefix = 'advSearchFilters_';
    var advancedSearchFilterName = filterNamePrefix + 'advancedSearch';
    var relatedSearchFilterName = filterNamePrefix + 'relatedSearch';
    var extensiveSearchFilterName = filterNamePrefix + 'extensiveSearch';
    var strokeCountGteqFilterName = filterNamePrefix + 'strokeCountGteq';
    var strokeCountLteqFilterName = filterNamePrefix + 'strokeCountLteq';
    var explicitListFilterName = filterNamePrefix + 'explicitList';
    var explicitBlockFilterName = filterNamePrefix + 'explicitBlock';

    var supportedFilters = [advancedSearchFilterName, relatedSearchFilterName, extensiveSearchFilterName, strokeCountGteqFilterName, strokeCountLteqFilterName,
                            explicitListFilterName, explicitBlockFilterName, ];

    function startupSequence(){
        wkof.set_state(settingsScriptId, 'loading');
        var config = {wk_items: {filters:{}, options:{'subjects': true,}}};

        wkof.include('ItemData, Settings');
        loadPrerequisiteScripts()
            .then(function(){return wkof.ready('ItemData, Settings')})
            .then(function(){return wkof.Settings.load(settingsScriptId)})
            .then(ageCache)
            .then(updateFiltersWhenReady)
    };

    var componentIndexKan = {};
    var componentIndexVoc = {};
    var usedInIndexRad = {};
    var usedInIndexKan = {};
    var WKvisuallySimilarIndex = {};
    function prepareIndex(items){
        for (var item of items){
            if (item.object === 'kanji'){
                componentIndexKan[item.data.slug] = item.data.component_subject_ids;
                usedInIndexKan[item.data.slug] = item.data.amalgamation_subject_ids;
                WKvisuallySimilarIndex[item.data.slug] = item.data.visually_similar_subject_ids;
            };
            if (item.object === 'radical'){
                usedInIndexRad[item.data.slug] = item.data.amalgamation_subject_ids;
                if (item.data.characters !== null) usedInIndexRad[item.data.characters] = item.data.amalgamation_subject_ids;
            };
            if (item.object !== 'vocabulary'){
                componentIndexVoc[item.data.slug] = item.data.amalgamation_subject_ids;
            };
        };
    };

    function ageCache(){
        // periodically ages the cache
        let ageingTime = 1000*60*60*24*30*2;  // two months
        var now = Date.now();
        if (wkof.settings[settingsScriptId] === undefined) wkof.settings[settingsScriptId] = {};
        if (wkof.settings[settingsScriptId].lastTime === undefined){
            wkof.settings[settingsScriptId].lastTime = now;
            wkof.Settings.save(settingsScriptId);
        }
        let lastTime = wkof.settings[settingsScriptId].lastTime;
        if (now > lastTime + ageingTime){
            deleteCache();
            wkof.settings[settingsScriptId].lastTime = now;
            wkof.Settings.save(settingsScriptId);
        };
    };

    function deleteCache(){
        deleteKeiseiCache();
        deleteVisuallySimilarCache();
        deleteNiaiCache();
        kanjidic2_cacheDelete();
        WkStrokeCount_cacheDelete()
        trad_rad_cacheDelete();
        wkof.file_cache.delete(lodash_file);
        wkof.file_cache.delete(lzma_file);
        wkof.file_cache.delete(lzma_shim_file);
    };

    function updateFiltersWhenReady() {
        // register the filters
        needToRegisterFilters = true;
        return waitForItemDataRegistry().then(registerFilters);
    };

    function waitForItemDataRegistry() {
        return wkof.wait_state('wkof.ItemData.registry', 'ready');
    };

    function registerFilters() {
        if (!needToRegisterFilters) {
            return;
        };

        supportedFilters.forEach(function(filterName) {
            delete wkof.ItemData.registry.sources.wk_items.filters[filterName];
        });

        registerTraditionalRadicals(); // must be first
        registerAdvancedSearchFilter();
        registerRelatedSearchFilter();
        registerExtensiveSearchFilter();
        registerStrokeCountGteqilter();
        registerStrokeCountLteqilter();
        registerExplicitListFilter();
        registerExplicitBlockFilter();

        needToRegisterFilters = false;
        wkof.set_state(settingsScriptId, 'ready');
    };

    // Unicode for Japanese characters
    // reference https://stackoverflow.com/questions/15033196/using-javascript-to-check-whether-a-string-contains-japanese-characters-includi
    //
    // regexes for splitting stings into words, one to get composed words that may have ' and - and one for subwords separated by ' or -
    const breakTheWords = /[^\-'a-zA-Z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf]/;
    const breakTheSubwords = /[\-']/;
    const noHtml = /<[^>]*>/g;

    // constants for searches

    const all = '*';
    const none = '!*'

    // ------------------
    // helping functions

    // split_list() is borrowed from @rfindley -- must be licensed under MIT
    function split_list(str) {return str.replace(/、/g,',')
        .replace(/[\s ]+/g,' ')
        .replace(/！/g, '!')
        .replace(/＊/g, '*')
        .trim()
        .replace(/ *, */g, ',')
        .replace(/ *， */g, ',')
        .toLowerCase()
        .split(',')
        .filter(function(name) {return (name.length > 0);});
     };

    // detailed path parsing to make sure it is a real path and not something else -- much needed to keep eval safe to use
    // there is no alternative to eval in this context
    // function set_value() and get_value is borrowed from wkof Settings module -- must be under MIT license
    function set_value(path, value) {
        var depth=0, new_path='', param, c;
        for (var idx = 0; idx < path.length; idx++) {
            c = path[idx];
            if (c === '[') {
                if (depth++ === 0) {
                    new_path += '[';
                    param = '';
                } else {
                    param += '[';
                }
            } else if (c === ']') {
                if (--depth === 0) {
                    new_path += JSON.stringify(eval(param)) + ']';
                } else {
                    param += ']';
                }
            } else {
                if (c === '@') c = 'base.';
                if (depth === 0)
                    new_path += c;
                else
                    param += c;
            };
        };
        eval(new_path + '=value');
    };

    function get_value(path) {
        var depth=0, new_path='', param, c;
        for (var idx = 0; idx < path.length; idx++) {
            c = path[idx];
            if (c === '[') {
                if (depth++ === 0) {
                    new_path += '[';
                    param = '';
                } else {
                    param += '[';
                };
            } else if (c === ']') {
                if (--depth === 0) {
                    new_path += JSON.stringify(eval(param)) + ']';
                } else {
                    param += ']';
                };
            } else {
                if (c === '@') c = 'base.';
                if (depth === 0)
                    new_path += c;
                else
                    param += c;
            };
        };
        return eval(new_path);
    };

    function katakana2hiragana(string){
        const baseHiragana = 12352 // start of unicode hiragana block
        const endHiragana = 12447 // end of unicode hiragana block
        const baseKatakana = 12448 // start of unicode katakana block
        const endKatakana = 12543 // end of unicode katakana block
        const delta = baseKatakana - baseHiragana;
        let result = []
        for (let idx in string){
            let x = string.charCodeAt(idx);
            if (x > baseKatakana && x <= endKatakana) x -= delta;
            x = String.fromCodePoint(x)
            result.push(x);
        };
        return result.join('');
    };

    function reportSearchResult(item, match, place){
        item.report = 'Search term '+match+' matches at '+place;
    };

    function prepareKanjidic2(filterValue){
        dataRequired.kanjidic2 = true;
        return loadMissingData();
    };

    function prepareKanjidic2AndWkRad(filterValue) {
        dataRequired.WkStrokeCountData = true;
        return prepareKanjidic2(filterValue);
    };

    // BEGIN Stroke Count GTEQ

    let strokeCountGteqHover_tip = 'Kanji and traditional radicals whose stroke count >= value';

    function registerStrokeCountGteqilter() {

        const registration = {
            type: 'number',
            label: 'Stroke Count &gt;=',
            default: 0,
            filter_func: strokeOrderGteqSearchFilter,
            filter_value_map: (x) => Number(x),
            prepare: prepareKanjidic2AndWkRad,
            set_options: function(options) { options.subjects = true;},
            hover_tip: strokeCountGteqHover_tip,
        };

        wkof.ItemData.registry.sources.wk_items.filters[strokeCountGteqFilterName] = $.extend({}, registration);
        wkof.ItemData.registry.sources.wk_items.filters[strokeCountGteqFilterName].alternate_sources = ['trad_rad'];
        wkof.ItemData.registry.sources.trad_rad.filters[strokeCountGteqFilterName] = $.extend({}, registration);
        wkof.ItemData.registry.sources.trad_rad.filters[strokeCountGteqFilterName].main_source = 'wk_items';

    };

    function strokeOrderGteqSearchFilter(filterValue, item){
        if (item.data === undefined) {
            return false;
        };
        let itemType = item.object;

        if (itemType === 'kanji' && (item.data.slug in kanjidic2Data)) {
            return Number(kanjidic2Data[item.data.slug].stroke_count) >= filterValue;
        } else if (itemType === 'radical') {
            return WkStrokeCountData[item.id].stroke_count >= filterValue;
        } else if (itemType === 'trad_rad') {
            if (typeof item.data.stroke_count === 'string'){
                return Number(item.data.stroke_count) >= filterValue;
            };
        };

        return false;
    };

    // END Stroke Count GTEQ

    // BEGIN Stroke Count LTEQ

    let strokeCountLteqHover_tip = 'Kanji and traditional radicals whose stroke count <= value';

    function registerStrokeCountLteqilter() {

        const registration = {
            type: 'number',
            label: 'Stroke Count &lt;=',
            default: 100,
            filter_func: strokeOrderLteqSearchFilter,
            filter_value_map: (x) => Number(x),
            prepare: prepareKanjidic2AndWkRad,
            set_options: function(options) { options.subjects = true;},
            hover_tip: strokeCountLteqHover_tip,
        };

        wkof.ItemData.registry.sources.wk_items.filters[strokeCountLteqFilterName] = $.extend({}, registration);
        wkof.ItemData.registry.sources.wk_items.filters[strokeCountLteqFilterName].alternate_sources = ['trad_rad'];
        wkof.ItemData.registry.sources.trad_rad.filters[strokeCountLteqFilterName] = $.extend({}, registration);
        wkof.ItemData.registry.sources.trad_rad.filters[strokeCountLteqFilterName].main_source = 'wk_items';

    };

    function strokeOrderLteqSearchFilter(filterValue, item){
        if (item.data === undefined) {
            return false;
        };
        let itemType = item.object;

        if (itemType === 'kanji' && item.data.characters in kanjidic2Data) {
            return Number(kanjidic2Data[item.data.characters].stroke_count) <= filterValue;
        } else if (itemType === 'radical') {
            return WkStrokeCountData[item.id].stroke_count <= filterValue;
        } else if (itemType === 'trad_rad') {
            if (typeof item.data.stroke_count === 'string'){
                return Number(item.data.stroke_count) <= filterValue;
            };
        };

        return false;
    };

    // END Stroke Count LTEQ

    // BEGIN Extensive Search

    let extensiveSearchHover_tip = 'Search for terms in meanings, readings and kanji.\nKanjidic2 meaning and readings are searched.\nYou may use latin, kana and kanji.';

    function registerExtensiveSearchFilter() {

        const registration = {
            type: 'text',
            label: 'Extensive Search',
            default: '',
            filter_func: extensiveSearchFilter,
            filter_value_map: prepareExtensiveFilterValue,
            prepare: prepareKanjidic2,
            set_options: function(options) { options.subjects = true;},
            hover_tip: extensiveSearchHover_tip,
        };

        wkof.ItemData.registry.sources.wk_items.filters[extensiveSearchFilterName] = $.extend({}, registration);
        wkof.ItemData.registry.sources.wk_items.filters[extensiveSearchFilterName].alternate_sources = ['trad_rad'];
        wkof.ItemData.registry.sources.trad_rad.filters[extensiveSearchFilterName] = $.extend({}, registration);
        wkof.ItemData.registry.sources.trad_rad.filters[extensiveSearchFilterName].main_source = 'wk_items';

    };

    function prepareExtensiveFilterValue(filterValue){
        return split_list(filterValue);
    };

    function extensiveSearchFilter(filterValue, item){
        if (item.data === undefined) {
            return false;
        };
        let itemType = item.object;

        for (var searchTerm of filterValue){
            if (item.data.characters !== null && item.data.characters.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'characters'); return true;};
            if (itemType === 'radical' && item.data.slug.indexOf(searchTerm.replace(' ', '-')) >= 0){reportSearchResult(item, searchTerm, 'characters'); return true;};

            for (var meaning of item.data.meanings){
                let term = meaning.meaning.toLowerCase();
                if (term.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'meanings'); return true;};
            };

            if (itemType !== 'radical' && itemType !== 'kana_vocabulary'){
                for (let reading of item.data.readings){
                    if (reading.reading.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'readings'); return true;};
                };
            };

            if (itemType === 'kanji' && item.data.characters in kanjidic2Data){
                for (let meaning of kanjidic2Data[item.data.characters].meanings){
                    let term = meaning.toLowerCase();
                    if (term.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'kanjidic2 meaning'); return true;};
                };

                for (let onyomi of kanjidic2Data[item.data.characters].onyomi){
                    let term = katakana2hiragana(onyomi);
                    if (term.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'kanjidic2 onyomi'); return true;};
                };

                for (let kunyomi of kanjidic2Data[item.data.characters].kunyomi){
                    let term = kunyomi
                    if (term.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'kanjidic2 kunyomi'); return true;};
                };

                for (let nanori of kanjidic2Data[item.data.characters].nanori){
                    let term = nanori
                    if (term.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'kanjidic2 nanori'); return true;};
                };
            };
        };
        return false;
    };

    // END Extensive Search

    // BEGIN Advanced Search

    let advancedSearchHover_tip = 'Search for terms in multiple locations of your choice.\nYou may use latin, kana and kanji.\nMultiple search options permit to tailor your search.';

    function registerAdvancedSearchFilter() {

        const registration = {
            type: 'button',
            label: 'Advanced Search',
            default: advancedSearchDefaults,
            callable_dialog: true,
            on_click: advancedSearchDialog,
            filter_func: advancedSearchFilter,
            filter_value_map: prepareFilterValue,
            prepare: prepareAdvancedSearch,
            set_options: function(options) { options.subjects = true; options.study_materials = true; },
            hover_tip: advancedSearchHover_tip,
        };

        wkof.ItemData.registry.sources.wk_items.filters[advancedSearchFilterName] = $.extend({}, registration);
        wkof.ItemData.registry.sources.wk_items.filters[advancedSearchFilterName].alternate_sources = ['trad_rad'];
        wkof.ItemData.registry.sources.trad_rad.filters[advancedSearchFilterName] = $.extend({}, registration);
        wkof.ItemData.registry.sources.trad_rad.filters[advancedSearchFilterName].main_source = 'wk_items';

    };


    let advancedSearchDefaults = {itemType: {radical: true, kanji: true, vocabulary: true, kana_vocabulary: true, trad_rad: true,},
                                  exactMatch: {characters: true, meanings: false, readings: true,
                                               allow: false, block: false,
                                               mMnemonics: false, mHints: false, rMnemonics: false, rHints: false, contextSentences: false,
                                               mNotes: false, rNotes: false, synonyms: false,
                                               Kanjidic2_Meaning: false, Kanjidic2_Onyomi: false,
                                               Kanjidic2_Kunyomi: false, Kanjidic2_Nanori: false},
                                  acceptedAnswer: true,
                                  searchIn: {characters: true, meanings: true, readings: true, onyomi: true, kunyomi: true, nanori: true,
                                             pos: false, allow: false, block: false,
                                             mMnemonics: false, mHints: false, rMnemonics: false, rHints: false, contextSentences: false,
                                             mNotes: false, rNotes: false, synonyms: false,
                                             Kanjidic2_Meaning: false, Kanjidic2_Onyomi: false,
                                             Kanjidic2_Kunyomi: false, Kanjidic2_Nanori: false},
                                  keisei: {phonetic: false, nonPhonetic: false, compound: false,
                                           notCompound: false, obscure: false, notInDB: false},
                                  searchTerms: ''};


    function advancedSearchDialog(name, config, on_change){
        let $originalDialog = $('#wkof_ds').find('[role="dialog"]');
        let areaId = settingsScriptId+'_advSearch';
        let scriptId = config.script_id || $originalDialog.attr("aria-describedby").slice(6);
        let path;
        if (config.path){
            path = config.path.replaceAll('@', 'wkof.settings["'+scriptId+'"].');
        } else if (scriptId === 'ss_quiz') {

            // Self Study Quiz doesn't define the path but we know what it is provided we find the source
            let row = $(this.delegateTarget);
            let panel = row.closest('[role="tabpanel"]');
            let source = panel.attr('id').match(/^ss_quiz_pg_(.*)$/)[1];
            path = 'wkof.settings.ss_quiz.ipresets[wkof.settings.ss_quiz.active_ipreset].content.'+source+'.filters.advSearchFilters_advancedSearch.value'

            // initialize in case it is not already initialized
            let v = $.extend(true, {}, get_value(path));
            set_value(path, v)
        } else {
            throw 'config.path is not defined';
        };

        let value = $.extend(true, {}, advancedSearchDefaults, get_value(path));
        set_value(path, value)
        wkof.settings[settingsScriptId] = wkof.settings[settingsScriptId] || {};
        wkof.settings[settingsScriptId].advSearch = $.extend(true, {}, advancedSearchDefaults, get_value(path));

        let html = '<textarea id="'+areaId+'" rows="2"></textarea>';
        let searchTermHovertip = ''+
            'List your search terms separated by commas. Latin, hiragana and kanji accepted\n\n'+
            '*  selects items where "Search In" information is PRESENT *and* NON EMPTY.\n'+
            '!* selects items where "Search In" information is ABSENT *or* EMPTY.\n\n'+
            'Valid parts of speech are:\n'+
            'adjective adverb conjunction counter expression godan verb  ichican verb\n'+
            'interjection intransitive verb noun numeral prefix pronoun proper noun suffix\n'+
            'transitive verb い adjective な adjective の adjective する verb';

        let dialogConfig = {
            script_id: settingsScriptId,
            title: 'Advanced Search',
            on_save: on_save,
            on_cancel: on_cancel,
            on_close: on_close,
            no_bkgd: true,
            settings: {itemType: {type: 'list', multi: true, label: 'Item Type', path: '@advSearch.itemType',
                                  hover_tip: 'The type of items that must match the search terms.',
                                  default: {radical: true, kanji: true, vocabulary: true, kana_vocabulary: true, trad_rad: true},
                                  content: {radical: 'Radical', kanji: 'Kanji', vocabulary: 'Vocabulary', kana_vocabulary: 'Kana Vocabulary',
                                            trad_rad:'Traditional Radical'},},
                       exactMatch: {type: 'list', multi: true, label: 'Searches With Exact Match', size: 5, path: '@advSearch.exactMatch',
                                    hover_tip: 'Selected searches requires the whole word matches.\nSubstring match is the default\nPart of Speech always use exact match.\n\nYou must select the search in Search In\nfor this parameter to take effect.',
                                    default: {characters: true, meanings: false, readings: true,
                                              allow: false, block: false,
                                              mMnemonics: false, mHints: false, rMnemonics: false, rHints: false, contextSentences: false,
                                              mNotes: false, rNotes: false, synonyms: false,
                                              Kanjidic2_Meaning: false, Kanjidic2_Onyomi: false,
                                              Kanjidic2_Kunyomi: false, Kanjidic2_Nanori: false},
                                    content: {characters: 'Characters', meanings: 'Meanings', readings: 'Readings',
                                              allow: 'Allow List', block: 'Block list',
                                              mMnemonics: 'Meaning mnemonics', mHints: 'Meaning hints',
                                              rMnemonics: 'Reading mnemonics', rHints: 'Reading hints',
                                              contextSentences: 'Context Sentences',
                                              mNotes: 'Meaning notes', rNotes: 'Reading notes', synonyms: 'User synonyms',
                                              Kanjidic2_Meaning: 'Kanjidict2 Meaning', Kanjidic2_Onyomi: 'Kanjidict2 Onyomi',
                                              Kanjidic2_Kunyomi: 'Kanjidict2 Kunyomi', Kanjidic2_Nanori: 'Kanjidict2 Nanori'},},
                       acceptedAnswer: {type: 'checkbox', label: 'Only Accepted Answers', default: true, path: '@advSearch.acceptedAnswer',
                                        hover_tip: 'Match only meanings and readings marked\nas accepted answers by Wanikani.\nUnchecked, matches both accepted\nand unaccepted answers.',},
                       searchIn: {type: 'list', multi: true, label: 'Search In', size: 6, path: '@advSearch.searchIn',
                                  hover_tip: 'Where to search to find a search term match.\nAny reading applies to both kanji and vocabulary.\nOther readings apply only to kanji.',
                                  default: {characters: true, meanings: true, readings: true,
                                            onyomi: true, kunyomi: true, nanori: true,
                                            pos: false, allow: false, block: false,
                                            mMnemonics: false, mHints: false, rMnemonics: false, rHints: false, contextSentences: false,
                                            mNotes: false, rNotes: false, synonyms: false,
                                            Kanjidic2_Meaning: false, Kanjidic2_Onyomi: false,
                                            Kanjidic2_Kunyomi: false, Kanjidic2_Nanori: false},
                                  content: {characters: 'Characters', meanings: 'Meanings', readings: 'Any Reading',
                                            onyomi: 'Readings Onyomi', kunyomi: 'Readings Kunyomi', nanori: 'Readings Nanori',
                                            pos: 'Part of Speech', allow: 'Allow List', block: 'Block List',
                                            mMnemonics: 'Meaning Mnemonics', mHints: 'Meaning Hints',
                                            rMnemonics: 'Reading Mnemonics', rHints: 'Reading Hints',
                                            contextSentences: 'Context Sentences',
                                            mNotes: 'Meaning Notes', rNotes: 'Reading Notes', synonyms: 'User Synonyms',
                                            Kanjidic2_Meaning: 'Kanjidict2 Meaning', Kanjidic2_Onyomi: 'Kanjidict2 Onyomi',
                                            Kanjidic2_Kunyomi: 'Kanjidict2 Kunyomi', Kanjidic2_Nanori: 'Kanjidict2 Nanori',},},
                       keisei: {type: 'list', multi: true, label: 'Search Keisei Database', size: 4, path: '@advSearch.keisei',
                                hover_tip: 'Selected items must have one of the selected Keisei Semantic-Phonetic properties.\n\nThis search criterion is not used if no property is selected.',
                                default: {phonetic: false, nonPhonetic: false, compound: false,
                                          notCompound: false, obscure: false, notInDB: false},
                                content: {phonetic: 'Is a Phonetic Mark', nonPhonetic: 'Is Not a Phonetic Mark',
                                          compound: 'Is a Phonetic Compound',
                                          notCompound: 'Not a Phonetic Compound', obscure: 'Obscure or Contested Origin',
                                          notInDB: 'Not in Keisei Database'},},
                       divider: {type: 'divider'},
                       searchTerms: {type: 'html', label: 'Search Terms',
                                     html: html,},
                      },
        };

        let dialog = new wkof.Settings(dialogConfig);
        dialog.open();

        // ui issue: do not let the calling dialog be visible
        let originalDisplay = $originalDialog.css('display');
        $originalDialog.css('display', 'none');

        // work around some framework limitations regarding html types
        let $searchTerms = $('#'+areaId);
        $searchTerms.val(wkof.settings[settingsScriptId].advSearch.searchTerms);
        $searchTerms.change(textareaChanged);
        let $label = $searchTerms.closest('form').children('.left');
        $label.css('width', 'calc(100% - 5px)');
        $label.children('label').css('text-align', 'left');
        $label.attr('title', searchTermHovertip);

        function on_close(){
            $originalDialog.css('display', originalDisplay);
            if (typeof config.on_close === 'function') config.on_close();
        };

        function on_save(){
            set_value(path, get_value('wkof.settings.'+settingsScriptId+'.advSearch'))
            if (typeof config.on_save === 'function') config.on_save();
        };

        function on_cancel(){
            if (typeof config.on_cancel === 'function') config.on_cancel();
        };

        function textareaChanged(e){
            wkof.settings[settingsScriptId].advSearch.searchTerms = $searchTerms.val();
        };

    };

    function prepareAdvancedSearch(filterValueOriginal){
        let searchIn = filterValueOriginal.searchIn;
        dataRequired.kanjidic2 = (searchIn.Kanjidic2_Meaning || searchIn.Kanjidic2_Onyomi || searchIn.Kanjidic2_Kunyomi || searchIn.Kanjidic2_Nanori);
        let keisei = filterValueOriginal.keisei;
        dataRequired.keisei = (keisei.phonetic || keisei.nonPhonetic || keisei.compound || keisei.notCompound || keisei.obscure || keisei.notInDB);
        return loadMissingData();
    };

    function prepareFilterValue(filterValueOriginal){
        // Don't modify the original because it is a pointer to the filter settings - modifying it will accumulate trash in the settings
        var filterValue = $.extend({}, filterValueOriginal);
        filterValue.hasSearchIn = Object.values(filterValue.searchIn).reduce(((acc,cur) => acc || cur), false);
        filterValue.searchIn.keisei = Object.values(filterValue.keisei).reduce(((acc, cur) => acc || cur), false);
        filterValue.searchTermsArray = split_list(filterValue.searchTerms);
        return filterValue;
    };

    function advancedSearchFilter(filterValue, item) {
        if (item.data === undefined) {
            return false;
        };
        if (!filterValue.itemType[item.object]) return false;

        let searchIn = filterValue.searchIn;
        let exactMatch = filterValue.exactMatch;
        let keisei = filterValue.keisei;
        let hasSearchIn = filterValue.hasSearchIn;
        let acceptedAnswer = filterValue.acceptedAnswer;
        let itemType = item.object;

        for (var searchTerm of filterValue.searchTermsArray){

            // must match keisei if searched in AND match ANY ONE of the other searched in locations
            if (searchIn.keisei){
                let result = false;
                if (itemType === 'radical'){
                    if (searchTerm !== none) {
                        if (keiseiDB.checkPhonetic(keiseiDB.mapWKRadicalToPhon(item.data.slug))) {
                            if (keisei.phonetic) result = true;
                        } else {
                            if (keisei.nonPhonetic) result = true;
                        };
                    };
                } else if (itemType === 'kanji'){
                    if (searchTerm !== none) {
                        let kan = item.data.slug;
                        if (!keiseiDB.checkKanji(kan)){
                            if (keisei.notInDB) result = true;
                        } else if (!keiseiDB.checkPhonetic(kan) && (keiseiDB.getKType(kan) !== keiseiDB.KTypeEnum.comp_phonetic)){
                            let typeKan = keiseiDB.getKType(kan);
                            if (keisei.nonPhonetic || keisei.notCompound) {
                                result = true;
                            } if (!(typeKan in Object.values(keiseiDB.KTypeEnum))) {
                                if (keisei.notInDB) result = true;
                            } else if (typeKan === keiseiDB.KTypeEnum.unknown) {
                                if (keisei.obscure) result = true;
                            };
                        } else {
                            if (keiseiDB.checkPhonetic(kan)) {
                                if (keisei.phonetic || keisei.notCompound) result = true;
                            } else if ((keisei.compound || (keisei.nonPhonetic))){
                                result = true;
                            };
                        };
                    };
                };
                if (!result) return false;
                if (!hasSearchIn) return result; // if no other location is searched in we are done with the result
            };

            if (searchIn.characters){
                if (searchTerm === all) {reportSearchResult(item, searchTerm, 'characters'); return true;};
                if (searchTerm !== none) {
                    if (exactMatch.characters){
                        if (item.data.characters !== null && item.data.characters === searchTerm) {reportSearchResult(item, searchTerm, 'characters'); return true;};
                        if (itemType === 'radical' && item.data.slug === searchTerm.replace(' ', '-')) {reportSearchResult(item, searchTerm, 'characters'); return true;};
                    } else {
                        if (item.data.characters !== null && item.data.characters.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'characters'); return true;};
                        if (itemType === 'radical' && item.data.slug.indexOf(searchTerm.replace(' ', '-')) >= 0){reportSearchResult(item, searchTerm, 'characters'); return true;};
                    };
                };
            };

            if (searchIn.meanings) {
                if (searchTerm === all)  {reportSearchResult(item, searchTerm, 'meanings'); return true;};
                if (searchTerm !== none) {
                    for (var meaning of item.data.meanings){
                        if (acceptedAnswer && !meaning.accepted_answer) continue;
                        let term = meaning.meaning.toLowerCase();
                        if (exactMatch.meanings){
                            if (searchTerm === term) {reportSearchResult(item, searchTerm, 'meanings'); return true;};
                            let words = term.split(' ').filter(function(name) {return (name.length > 0);});
                            for (let word of words) {
                                if (searchTerm === word) {reportSearchResult(item, searchTerm, 'meanings'); return true;};
                            };
                        } else {
                            if (term.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'meanings'); return true;};
                        };
                    };
                };
            };

            if (searchIn.readings){
                if (itemType !== 'radical' && itemType !== 'kana_vocabulary'){
                    if (searchTerm === all) {reportSearchResult(item, searchTerm, 'readings'); return true;};
                    if (exactMatch.readings){
                        for (let reading of item.data.readings){
                            if (acceptedAnswer && !reading.accepted_answer) continue;
                            if (reading.reading === searchTerm && reading.accepted_answer) {reportSearchResult(item, searchTerm, 'readings'); return true;};
                        };
                    } else {
                        for (let reading of item.data.readings){
                            if (acceptedAnswer && !reading.accepted_answer) continue;
                            if (reading.reading.indexOf(searchTerm) >= 0 && reading.accepted_answer) {reportSearchResult(item, searchTerm, 'readings'); return true;};
                        };
                    };
                } else {
                    if (searchTerm === none) {reportSearchResult(item, searchTerm, 'readings');}
                };
            };

            if (searchIn.onyomi || searchIn.kunyomi || searchIn.nanori){
                if (itemType === 'kanji') {
                    let notSeen = {onyomi: true, kunyomi: true, nanori: true};
                    let seen = {onyomi: false, kunyomi: false, nanori: false};
                    if (exactMatch.readings){
                        for (let reading of item.data.readings){
                            if (acceptedAnswer && !reading.accepted_answer) continue;
                            notSeen[reading.type] = false;
                            seen[reading.type] = true;
                            if (reading.reading === searchTerm && searchIn[reading.type]) {reportSearchResult(item, searchTerm, reading.type); return true;};
                        };
                    } else {
                        for (let reading of item.data.readings){
                            if (acceptedAnswer && !reading.accepted_answer) continue;
                            notSeen[reading.type] = false;
                            seen[reading.type] = true;
                            if (reading.reading.indexOf(searchTerm) >= 0 && searchIn[reading.type]) {reportSearchResult(item, searchTerm, reading.type); return true;};
                        };
                    };
                    if (searchTerm === none){
                        if (searchIn.onyomi && notSeen.onyomi) {reportSearchResult(item, searchTerm, 'onyomi'); return true;};
                        if (searchIn.kunyomi && notSeen.kunyomi) {reportSearchResult(item, searchTerm, 'kunyomi'); return true;};
                        if (searchIn.nanori && notSeen.nanori) {reportSearchResult(item, searchTerm, 'nanori'); return true;};
                    };
                    if (searchTerm === all){
                        if (searchIn.onyomi && seen.onyomi) {reportSearchResult(item, searchTerm, 'onyomi'); return true;};
                        if (searchIn.kunyomi && seen.kunyomi) {reportSearchResult(item, searchTerm, 'kunyomi'); return true;};
                        if (searchIn.nanori && seen.nanori) {reportSearchResult(item, searchTerm, 'nanori'); return true;};
                    };
                } else {
                    let reading;
                    if (searchIn.nanori) reading = 'nanori';
                    if (searchIn.kunyomi) reading = 'kunyomi';
                    if (searchIn.onyomi) reading = 'onyomi';
                    if (searchTerm === none)  {reportSearchResult(item, searchTerm, reading); return true;};
                };
            };

            if (searchIn.pos){
                if (itemType === 'vocabulary' || itemType === 'kana_vocabulary'){
                    if (searchTerm === all) {reportSearchResult(item, searchTerm, 'part of speech'); return true;};
                    for (let pos of item.data.parts_of_speech){
                        if (searchTerm === pos) {reportSearchResult(item, searchTerm, 'part of speech'); return true;};
                        let words = pos.split(' ').filter(function(name) {return (name.length > 0);});
                        for (let word of words) {
                            if (searchTerm === word) {reportSearchResult(item, searchTerm, 'part of speech'); return true;};
                        };
                    };
                } else {
                    if (searchTerm === none) {reportSearchResult(item, searchTerm, 'part of speech'); return true;};
                };
            };

            if (searchIn.allow || searchIn.block) {
                if (itemType !== 'trad_rad'){
                    let seenAllow = false;
                    let seenBlock = false;
                    for (let list of item.data.auxiliary_meanings){
                        if (searchIn.allow && list.type === 'whitelist'){
                            if (searchTerm === all) {reportSearchResult(item, searchTerm, 'allow list'); return true;};
                            seenAllow = true;
                            if (exactMatch.allow){
                                if (searchTerm === list.meaning.toLowerCase()) {reportSearchResult(item, searchTerm, 'allow list'); return true;};
                                let words = list.meaning.toLowerCase().split(' ').filter(function(name) {return (name.length > 0);});
                                for (let word of words) {
                                    if (searchTerm === word) {reportSearchResult(item, searchTerm, 'allow list'); return true;};
                                };
                            } else {
                                if (list.meaning.toLowerCase().indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'allow list'); return true;};
                            };
                        } else if(searchIn.block && list.type === 'blacklist') {
                            if (searchTerm === all) {reportSearchResult(item, searchTerm, 'block list'); return true;};
                            seenBlock = true;
                            if (exactMatch.block){
                                if (searchTerm === list.meaning.toLowerCase()) {reportSearchResult(item, searchTerm, 'block list'); return true;};
                                let words = list.meaning.toLowerCase().split(' ').filter(function(name) {return (name.length > 0);});
                                for (let word of words) {
                                    if (searchTerm === word) {reportSearchResult(item, searchTerm, 'block list'); return true;};
                                };
                            } else {
                                if (list.meaning.toLowerCase().indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'block list'); return true;};
                            };
                        };
                    };
                    if (searchTerm === none){
                        if (searchIn.allow && !seenAllow) {reportSearchResult(item, searchTerm, 'allow list'); return true;};
                        if (searchIn.block && !seenBlock) {reportSearchResult(item, searchTerm, 'block list'); return true;};
                    };
                } else {
                    if (searchTerm === none){
                        if (searchIn.allow) {reportSearchResult(item, searchTerm, 'allow list'); return true;};
                        if (searchIn.block) {reportSearchResult(item, searchTerm, 'block list'); return true;};
                    };
                };
            };

            if (searchIn.mMnemonics) {
                if (item.data.meaning_mnemonic){
                    if (searchTerm === all) {reportSearchResult(item, searchTerm, 'meaning mnemonic'); return true;};
                    let mnemonic = item.data.meaning_mnemonic.toLowerCase().replace(noHtml, ' ');
                    if (searchTerm === "onyomi" && mnemonic.indexOf("on'yomi") >= 0) {reportSearchResult(item, searchTerm, 'meaning mnemonic'); return true;};
                    if (searchTerm === "kunyomi" && mnemonic.indexOf("kun'yomi") >= 0) {reportSearchResult(item, searchTerm, 'meaning mnemonic'); return true;};
                    if (exactMatch.mMnemonics){
                        let words = mnemonic.toLowerCase().split(breakTheWords).filter(function(name) {return (name.length > 0);});
                        for (let word of words) {
                            if (searchTerm === word) {reportSearchResult(item, searchTerm, 'meaning mnemonic'); return true;};
                            let subwords = word.split(breakTheSubwords);
                            if (subwords.length !== 1){
                                for (let subword of subwords) if (searchTerm === subword) {reportSearchResult(item, searchTerm, 'meaning mnemonic'); return true;};
                            };
                        };
                    } else {
                        if (mnemonic.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'meaning mnemonic'); return true;};
                    };
                } else {
                    if (searchTerm === none) {reportSearchResult(item, searchTerm, 'meaning mnemonic'); return true;};
                };
            };

            if (searchIn.mHints){
                if (item.data.meaning_hint){
                    if (searchTerm === all) {reportSearchResult(item, searchTerm, 'meaning hint'); return true;};
                    let hint = item.data.meaning_hint.toLowerCase().replace(noHtml, ' ');
                    if (searchTerm === "onyomi" && hint.indexOf("on'yomi") >= 0) {reportSearchResult(item, searchTerm, 'meaning hint'); return true;};
                    if (searchTerm === "kunyomi" && hint.indexOf("kun'yomi") >= 0) {reportSearchResult(item, searchTerm, 'meaning hint'); return true;};
                    if (exactMatch.mHints){
                        let words = hint.split(breakTheWords).filter(function(name) {return (name.length > 0);});
                        for (let word of words) {
                            if (searchTerm === word) {reportSearchResult(item, searchTerm, 'meaning hint'); return true;};
                            let subwords = word.split(breakTheSubwords);
                            if (subwords.length !== 1){
                                for (let subword of subwords) if (searchTerm === subwords) {reportSearchResult(item, searchTerm, 'meaning hint'); return true;};
                            }
                        };
                    } else {
                        if (hint.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'meaning hint'); return true;};
                    };
                } else {
                    if (searchTerm === none) {reportSearchResult(item, searchTerm, 'meaning hint'); return true;};
                };
            };

            if (searchIn.rMnemonics) {
                if (item.data.reading_mnemonic){
                    if (searchTerm === all) {reportSearchResult(item, searchTerm, 'reading mnemonic'); return true;};
                    let mnemonic = item.data.reading_mnemonic.toLowerCase().replace(noHtml, ' ');
                    if (searchTerm === "onyomi" && mnemonic.indexOf("on'yomi") >= 0) {reportSearchResult(item, searchTerm, 'reading mnemonic'); return true;};
                    if (searchTerm === "kunyomi" && mnemonic.indexOf("kun'yomi") >= 0) {reportSearchResult(item, searchTerm, 'reading mnemonic'); return true;};
                    if (exactMatch.rMnemonics){
                        let words = mnemonic.split(breakTheWords).filter(function(name) {return (name.length > 0);});
                        for (let word of words) {
                            if (searchTerm === word) {reportSearchResult(item, searchTerm, 'reading mnemonic'); return true;};
                            let subwords = word.split(breakTheSubwords);
                            if (subwords.length !== 1){
                                for (let subword of subwords) if (searchTerm === subword) {reportSearchResult(item, searchTerm, 'reading mnemonic'); return true;};
                            }
                        };
                    } else {
                        if (mnemonic.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'reading mnemonic'); return true;};
                    };
                } else {
                    if (searchTerm === none) {reportSearchResult(item, searchTerm, 'reading mnemonic'); return true;};
                };
            };

            if (searchIn.rHints) {
                if (item.data.reading_hint){
                    if (searchTerm === all) {reportSearchResult(item, searchTerm, 'reading hint'); return true;};
                    let hint = item.data.reading_hint.toLowerCase().replace(noHtml, ' ');
                    if (searchTerm === "onyomi" && hint.indexOf("on'yomi") >= 0) {reportSearchResult(item, searchTerm, 'reading hint'); return true;};
                    if (searchTerm === "kunyomi" && hint.indexOf("kun'yomi") >= 0) {reportSearchResult(item, searchTerm, 'reading hint'); return true;};
                    if (exactMatch.rHints){
                        let words = hint.split(breakTheWords).filter(function(name) {return (name.length > 0);});
                        for (let word of words) {
                            if (searchTerm === word) {reportSearchResult(item, searchTerm, 'reading hint'); return true;};
                            let subwords = word.split(breakTheSubwords);
                            if (subwords.length !== 1){
                                for (let subword of subwords) if (searchTerm === subword) {reportSearchResult(item, searchTerm, 'reading hint'); return true;};
                            }
                        };
                    } else {
                        if (hint.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'reading hint'); return true;};
                    };
                } else {
                    if (searchTerm === none) {reportSearchResult(item, searchTerm, 'reading hint'); return true;};
                };
            };

            if (searchIn.contextSentences){
                if (item.object === 'vocabulary'){
                    if (item.data.context_sentences.length !== 0){
                        if (searchTerm === all) {reportSearchResult(item, searchTerm, 'context sentences'); return true;};
                        for (let sentences of item.data.context_sentences){
                            let ja = sentences.ja;
                            let en = sentences.en;
                            if (exactMatch.contextSentences){
                                let words = ja.toLowerCase().split(breakTheWords).filter(function(name) {return (name.length > 0);});
                                for (let word of words) {
                                    if (searchTerm === word) {reportSearchResult(item, searchTerm, 'context sentences'); return true;};
                                };
                                words = en.toLowerCase().split(breakTheWords).filter(function(name) {return (name.length > 0);});
                                for (let word of words) {
                                    if (searchTerm === word) {reportSearchResult(item, searchTerm, 'context sentences'); return true;};
                                    let subwords = word.split(breakTheSubwords);
                                    if (subwords.length !== 1){
                                        for (let subword of subwords) if (searchTerm === subword) {reportSearchResult(item, searchTerm, 'context sentences'); return true;};
                                    };
                                };
                            } else {
                                if (ja.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'context sentences'); return true;};
                                if (en.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'context sentences'); return true;};
                            };
                        };
                    } else {
                        if (searchTerm === none) {reportSearchResult(item, searchTerm, 'context sentences'); return true;};
                    };
                } else {
                    if (searchTerm === none) {reportSearchResult(item, searchTerm, 'context sentences'); return true;};
                };
            };

            if (searchIn.mNotes){
                if (item.study_materials){
                    if (item.study_materials.meaning_note){
                        if (searchTerm === all) {reportSearchResult(item, searchTerm, 'meaning note'); return true;};
                        let note = item.study_materials.meaning_note.toLowerCase().replace(noHtml, ' ');
                        if (searchTerm === "onyomi" && note.indexOf("on'yomi") >= 0) {reportSearchResult(item, searchTerm, 'meaning note'); return true;};
                        if (searchTerm === "kunyomi" && note.indexOf("kun'yomi") >= 0) {reportSearchResult(item, searchTerm, 'meaning note'); return true;};
                        if (exactMatch.mNotes){
                            let words = note.split(breakTheWords).filter(function(name) {return (name.length > 0);});
                            for (let word of words) {
                                if (searchTerm === word) {reportSearchResult(item, searchTerm, 'meaning note'); return true;};
                                let subwords = word.split(breakTheSubwords);
                                if (subwords.length !== 1){
                                    for (let subword of subwords) if (searchTerm === subword) {reportSearchResult(item, searchTerm, 'meaning note'); return true;};
                                };
                            };
                        } else {
                            if (note.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'meaning note'); return true;};
                        };
                    } else {
                        if (searchTerm === none) {reportSearchResult(item, searchTerm, 'meaning note'); return true;};
                    };
                } else {
                    if (searchTerm === none) {reportSearchResult(item, searchTerm, 'meaning note'); return true;};
                };
            };

            if (searchIn.rNotes){
                if (item.study_materials){
                    if (item.study_materials.reading_note){
                        if (searchTerm === all) {reportSearchResult(item, searchTerm, 'reading note'); return true;};
                        let note = item.study_materials.reading_note.toLowerCase().replace(noHtml, ' ');
                        if (searchTerm === "onyomi" && note.indexOf("on'yomi") >= 0) {reportSearchResult(item, searchTerm, 'reading note'); return true;};
                        if (searchTerm === "kunyomi" && note.indexOf("kun'yomi") >= 0) {reportSearchResult(item, searchTerm, 'reading note'); return true;};
                        if (exactMatch.rNotes){
                            let words = note.split(breakTheWords).filter(function(name) {return (name.length > 0);});
                            for (let word of words) {
                                if (searchTerm === word) {reportSearchResult(item, searchTerm, 'reading note'); return true;};
                                let subwords = word.split(breakTheSubwords);
                                if (subwords.length !== 1){
                                    for (let subword of subwords) if (searchTerm === subword) {reportSearchResult(item, searchTerm, 'reading note'); return true;};
                                }
                            };
                        } else {
                            if (note.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'reading note'); return true;};
                        };
                    } else {
                        if (searchTerm === none) {reportSearchResult(item, searchTerm, 'reading note'); return true;};
                    };
                } else {
                    if (searchTerm === none) {reportSearchResult(item, searchTerm, 'reading note'); return true;};
                };
            };

            if (searchIn.synonyms){
                if (item.study_materials){
                    let synonyms = item.study_materials.meaning_synonyms;
                    if (synonyms.length === 0){
                        if (searchTerm === none) {reportSearchResult(item, searchTerm, 'user synonyms'); return true;};
                    } else {
                        if (searchTerm === all) {reportSearchResult(item, searchTerm, 'user synonyms'); return true;};
                        for (let synonym of synonyms){
                            synonym = synonym.toLowerCase();
                            if (searchTerm === synonym) {reportSearchResult(item, searchTerm, 'user synonyms'); return true;};
                            if (exactMatch.synonyms){
                                let words = synonym.split(breakTheWords).filter(function(name) {return (name.length > 0);});
                                for (var word of words) {
                                    if (searchTerm === word) {reportSearchResult(item, searchTerm, 'user synonyms'); return true;};
                                };
                                let subwords = word.split(breakTheSubwords);
                                if (subwords.length !== 1){
                                    for (let subword of subwords) if (searchTerm === subword) {reportSearchResult(item, searchTerm, 'user synonyms'); return true;};
                                }
                            } else {
                                if (synonym.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'user synonyms'); return true;};
                            };
                        };
                    };
                } else {
                    if (searchTerm === none) {reportSearchResult(item, searchTerm, 'user synonyms'); return true;};
                };
            };

            if (searchIn.Kanjidic2_Meaning) {
                if (item.object !== 'kanji'){
                    if (searchTerm === none) {reportSearchResult(item, searchTerm, 'kanjidic2 meaning'); return true;};
                } else {
                    if (searchTerm === all) {
                        if (item.data.characters in kanjidic2Data && kanjidic2Data[item.data.characters].meanings.length !== 0){
                            reportSearchResult(item, searchTerm, 'kanjidic2 meaning');
                            return true;
                        };
                    } else if (searchTerm === none) {
                        if (!(item.data.characters in kanjidic2Data) || kanjidic2Data[item.data.characters].meanings.length === 0){
                            reportSearchResult(item, searchTerm, 'kanjidic2 meaning');
                            return true;
                        };
                    } else if (item.data.characters in kanjidic2Data){
                        for (let meaning of kanjidic2Data[item.data.characters].meanings){
                            let term = meaning.toLowerCase();
                            if (exactMatch.Kanjidic2_Meaning){
                                if (searchTerm === term) {reportSearchResult(item, searchTerm, 'kanjidic2 meaning'); return true;};
                                let words = term.split(' ').filter(function(name) {return (name.length > 0);});
                                for (let word of words) {
                                    if (searchTerm === word) {reportSearchResult(item, searchTerm, 'kanjidic2 meaning'); return true;};
                                };
                            } else {
                                if (term.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'kanjidic2 meaning'); return true;};
                            };
                        };
                    };
                };
            };

            if (searchIn.Kanjidic2_Onyomi) {
                if (item.object !== 'kanji'){
                    if (searchTerm === none) {reportSearchResult(item, searchTerm, 'kanjidic2 onyomi'); return true;};
                } else {
                    if (searchTerm === all) {
                        if (item.data.characters in kanjidic2Data && kanjidic2Data[item.data.characters].onyomi.length !== 0){
                            reportSearchResult(item, searchTerm, 'kanjidic2 onyomi');
                            return true;
                        };
                    } else if (searchTerm === none) {
                        if (!(item.data.characters in kanjidic2Data) || kanjidic2Data[item.data.characters].onyomi.length === 0){
                            reportSearchResult(item, searchTerm, 'kanjidic2 onyomi');
                            return true;
                        };
                    } else if (item.data.characters in kanjidic2Data){
                        for (let onyomi of kanjidic2Data[item.data.characters].onyomi){
                            let term = katakana2hiragana(onyomi);
                            if (exactMatch.Kanjidic2_Onyomi){
                                if (searchTerm === term) {reportSearchResult(item, searchTerm, 'kanjidic2 onyomi'); return true;};
                                let words = term.split(' ').filter(function(name) {return (name.length > 0);});
                                for (let word of words) {
                                    if (searchTerm === word) {reportSearchResult(item, searchTerm, 'kanjidic2 onyomi'); return true;};
                                    if (word.endsWith('-') || word.endsWith('ー') || word.endsWith('ー') || word.endsWith('－') || word.endsWith('‐')){
                                        term = word.slice(0, -1)
                                    };
                                    if (word.startsWith('-') || word.startsWith('ー') || word.startsWith('ー') || word.startsWith('－') || word.startsWith('‐')){
                                        term = word.slice(1)
                                    };
                                    if (searchTerm === term) {reportSearchResult(item, searchTerm, 'kanjidic2 onyomi'); return true;};
                                };
                            } else {
                                if (term.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'kanjidic2 onyomi'); return true;};
                            };
                        };
                    };
                };
            };

            if (searchIn.Kanjidic2_Kunyomi) {
                if (item.object !== 'kanji'){
                    if (searchTerm === none) {reportSearchResult(item, searchTerm, 'kanjidic2 kunyomi'); return true;};
                } else {
                    if (searchTerm === all) {
                        if (item.data.characters in kanjidic2Data && kanjidic2Data[item.data.characters].kunyomi.length !== 0){
                            reportSearchResult(item, searchTerm, 'kanjidic2 kunyomi');
                            return true;
                        };
                    } else if (searchTerm === none) {
                        if (!(item.data.characters in kanjidic2Data) || kanjidic2Data[item.data.characters].kunyomi.length === 0){
                            reportSearchResult(item, searchTerm, 'kanjidic2 kunyomi');
                            return true;
                        };
                    } else if (item.data.characters in kanjidic2Data){
                        for (let kunyomi of kanjidic2Data[item.data.characters].kunyomi){
                            let term = kunyomi
                            if (exactMatch.Kanjidic2_Kunyomi){
                                if (searchTerm === term) {reportSearchResult(item, searchTerm, 'kanjidic2 kunyomi'); return true;};
                                let words = term.split(' ').filter(function(name) {return (name.length > 0);});
                                for (let word of words) {
                                    if (searchTerm === word) {reportSearchResult(item, searchTerm, 'kanjidic2 kunyomi'); return true;};
                                    if (word.endsWith('-') || word.endsWith('ー') || word.endsWith('ー') || word.endsWith('－') || word.endsWith('‐')){
                                        term = word.slice(0, -1)
                                    };
                                    if (word.startsWith('-') || word.startsWith('ー') || word.startsWith('ー') || word.startsWith('－') || word.startsWith('‐')){
                                        term = word.slice(1)
                                    };
                                    if (searchTerm === term) {reportSearchResult(item, searchTerm, 'kanjidic2 kunyomi'); return true;};
                                };
                            } else {
                                if (term.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'kanjidic2 kunyomi'); return true;};
                            };
                        };
                    };
                };
            };

            if (searchIn.Kanjidic2_Nanori) {
                if (item.object !== 'kanji'){
                    if (searchTerm === none) {reportSearchResult(item, searchTerm, 'kanjidic2 nanori'); return true;};
                } else {
                    if (searchTerm === all) {
                        if (item.data.characters in kanjidic2Data && kanjidic2Data[item.data.characters].nanori.length !== 0){
                            reportSearchResult(item, searchTerm, 'kanjidic2 nanori');
                            return true;
                        };
                    } else if (searchTerm === none) {
                        if (!(item.data.characters in kanjidic2Data) || kanjidic2Data[item.data.characters].nanori.length === 0){
                            reportSearchResult(item, searchTerm, 'kanjidic2 nanori');
                            return true;
                        };
                    } else if (item.data.characters in kanjidic2Data){
                        for (let nanori of kanjidic2Data[item.data.characters].nanori){
                            let term = nanori
                            if (exactMatch.Kanjidic2_Nanori){
                                if (searchTerm === term) {reportSearchResult(item, searchTerm, 'kanjidic2 nanori'); return true;};
                                let words = term.split(' ').filter(function(name) {return (name.length > 0);});
                                for (let word of words) {
                                    if (searchTerm === word) {reportSearchResult(item, searchTerm, 'kanjidic2 nanori'); return true;};
                                    if (word.endsWith('-') || word.endsWith('ー') || word.endsWith('ー') || word.endsWith('－') || word.endsWith('‐')){
                                        term = word.slice(0, -1)
                                    };
                                    if (word.startsWith('-') || word.startsWith('ー') || word.startsWith('ー') || word.startsWith('－') || word.startsWith('‐')){
                                        term = word.slice(1)
                                    };
                                    if (searchTerm === term) {reportSearchResult(item, searchTerm, 'kanjidic2 nanori'); return true;};
                                };
                            } else {
                                if (term.indexOf(searchTerm) >= 0) {reportSearchResult(item, searchTerm, 'kanjidic2 nanori'); return true;};
                            };
                        };
                    };
                };
            };


        };

        return false;
    };

    // END Advanced Search

    // BEGIN Related Search
    let relatedSearchHover_tip = 'Find items related to search terms.\n\nRelationships include:\n* Components of items\n* Items where components are used\n* Visually similar kanjis\n* Semantic-phonetic composition relationships';

    function registerRelatedSearchFilter() {
        const registration = {
            type: 'button',
            label: 'Related Search',
            default: relatedSearch_defaults,
            callable_dialog: true,
            on_click: relatedSearchDialog,
            prepare: prepareRelatedSearch,
            filter_value_map: prepareRelatedFilterValue,
            filter_func: relatedSearchFilter,
            set_options: function(options) { options.subjects = true; },
            hover_tip: relatedSearchHover_tip,
        };

        wkof.ItemData.registry.sources.wk_items.filters[relatedSearchFilterName] = $.extend(true, {}, registration);
        wkof.ItemData.registry.sources.wk_items.filters[relatedSearchFilterName].alternate_sources = ['trad_rad'];
        wkof.ItemData.registry.sources.trad_rad.filters[relatedSearchFilterName] = $.extend(true, {}, registration);
        wkof.ItemData.registry.sources.trad_rad.filters[relatedSearchFilterName].main_source = 'wk_items';

    };

    let relatedSearch_defaults = {returns: {matchedItem: true, components: false, usedIn: true,
                                            WKvisuallySimilar: false, LYvisuallySimilar: false, NiaiVisuallySimilar: false, NiaiAlternate: 0.3,
                                            phonetic: false, nonPhonetic: false, keiseiRelated: false,
                                            tradRadInKanji: false, kanjiwithTradRad: false},
                                  similarityTreshold: 0,
                                  searchTerms: '',
                                  itemType: {radical: true, kanji: true, vocabulary: true, trad_rad: true,},
                                 };

    function relatedSearchDialog(name, config, on_change){
        let $originalDialog = $('#wkof_ds').find('[role="dialog"]');
        let areaId = settingsScriptId+'_relSearch';
        let scriptId = config.script_id || $originalDialog.attr("aria-describedby").slice(6);
        let path;
        if (config.path){
            path = config.path.replaceAll('@', 'wkof.settings["'+scriptId+'"].');
        } else if (scriptId === 'ss_quiz') {

            // Self Study Quiz doesn't define the path but we know what it is provided we find the source
            let row = $(this.delegateTarget);
            let panel = row.closest('[role="tabpanel"]');
            let source = panel.attr('id').match(/^ss_quiz_pg_(.*)$/)[1];
            path = 'wkof.settings.ss_quiz.ipresets[wkof.settings.ss_quiz.active_ipreset].content.'+source+'.filters.advSearchFilters_relatedSearch.value'

            // initialize in case it is not already initialized
            let v = $.extend(true, {}, get_value(path));
            set_value(path, v)
        } else {
            throw 'config.path is not defined';
        };

        let value = $.extend(true, {}, relatedSearch_defaults, get_value(path));
        set_value(path, value);
        wkof.settings[settingsScriptId] = wkof.settings[settingsScriptId] || {};
        wkof.settings[settingsScriptId].relSearch = $.extend(true, {}, relatedSearch_defaults, get_value(path));

        let html = '<textarea id="'+areaId+'" rows="3"></textarea>';
        let searchTermHovertip = ''+
            'List your search terms separated by commas. Latin, kana and kanji accepted.\n'+
            'Your search terms must match the characters for the item exactly.\n'+
            'English name of radicals and traditional radicals are accepted.';

        let dialogConfig = {
            script_id: settingsScriptId,
            title: 'Related Search',
            on_save: on_save,
            on_cancel: on_cancel,
            on_close: on_close,
            no_bkgd: true,
            settings: {returns: {type: 'list', multi: true, label: 'Items Returned By The Search', size: 4, path: '@relSearch.returns',
                                 hover_tip: 'Choose which items are being searched.\nWK Visially similar means according to Wanikani data.\nLY Visually similar means according to Lars Yencken data.',
                                 default: {matchedItem: true, components: false, usedIn: true,
                                           WKvisuallySimilar: false, LYvisuallySimilar: false, NiaiVisuallySimilar: false, NiaiAlternate: 0.3,
                                           phonetic: false, nonPhonetic: false, keiseiRelated: false,
                                           tradRadInKanji: false, kanjiwithTradRad: false},
                                 content: {matchedItem: 'Matched Items', components: 'Components of Matched Items', usedIn: 'Items Where Matches Are Used',
                                           WKvisuallySimilar: 'WK Visually Similar To Matches', LYvisuallySimilar: 'LY Visually Similar To Matches',
                                           NiaiVisuallySimilar: 'Niai Visually Similar To Matches',
                                           phonetic: 'Keisei Phonetic Compounds', nonPhonetic: 'Non Phonetic Compounds',
                                           keiseiRelated: 'Related Phonetic Marks',
                                           tradRadInKanji: 'Traditional Radicals in Kanji', kanjiwithTradRad: 'Kanji Using Traditional Radicals'},},
                       LYsimilarityTreshold: {type: 'number', label: 'LY Similarity Threshold', min: 0.0, max: 1.0, default: 0, path: '@relSearch.LYsimilarityTreshold',
                                              hover_tip: 'A number between 0 and 1 for the degree\nof similaity of LY Visually Similar Kanjis.',},
                       NiaiSimilarityTreshold: {type: 'number', label: 'Niai Similarity Threshold', min: 0.0, max: 1.0, default: 0, path: '@relSearch.NiaiSimilarityTreshold',
                                                hover_tip: 'A number between 0 and 1 for the degree\nof similaity of LY Visually Similar Kanjis.',},
                       NiaiAlternate: {type:'checkbox',label:'Use Niai Alternate Sources',hover_tip:'Add alternate sources to Niai visually similar\ndata to the main sources.\nThis will return more similar kanji.',
                                       path: '@relSearch.NiaiAlternate', default:0.3, min: 0.0, max: 1.0,
                                      },
                       divider: {type: 'divider'},
                       searchTerms: {type: 'html', label: 'Search terms', hover_tip: searchTermHovertip, path: '@relSearch.searchTerms',
                                     html: html,},
                       itemType: {type: 'list', multi: true, label: 'Item Type of Search Terms', path: '@relSearch.itemType',
                                  hover_tip: 'Further specify the search terms to be of the given types.',
                                  default: {radical: true, kanji: true, vocabulary: true, trad_rad: true},
                                  content: {radical: 'Radical', kanji: 'Kanji', vocabulary: 'Vocabulary', trad_rad: 'Traditional Radical'},},
                      },
        };

        let dialog = new wkof.Settings(dialogConfig);
        dialog.open();

        // ui issue: do not let the calling dialog be visible
        let originalDisplay = $originalDialog.css('display');
        $originalDialog.css('display', 'none');

        // work around some framework limitations regarding html types
        let $searchTerms = $('#'+areaId);
        $searchTerms.val(wkof.settings[settingsScriptId].relSearch.searchTerms);
        $searchTerms.change(textareaChanged);
        let $label = $searchTerms.closest('form').children('.left');
        $label.css('width', 'calc(100% - 5px)');
        $label.children('label').css('text-align', 'left');
        $label.attr('title', searchTermHovertip);

        function on_close(){
            $originalDialog.css('display', originalDisplay);
            if (typeof config.on_close === 'function') config.on_close();
        };

        function on_save(){
            set_value(path, get_value('wkof.settings.'+settingsScriptId+'.relSearch'));
            if (typeof config.on_save === 'function') config.on_save();
        };

        function on_cancel(){
            if (typeof config.on_cancel === 'function') config.on_cancel();
        };

        function textareaChanged(e){
            wkof.settings[settingsScriptId].relSearch.searchTerms = $searchTerms.val();
        };
    };

    function prepareRelatedSearch(filterValue){
        let returns = filterValue.returns;
        dataRequired.items = returns.components || returns.usedIn || returns.WKvisuallySimilar || returns.NiaiVisuallySimilar;
        dataRequired.larsYencken = returns.LYvisuallySimilar || (returns.NiaiVisuallySimilar && filterValue.NiaiAlternate);
        dataRequired.niai = returns.NiaiVisuallySimilar;
        dataRequired.keisei = (returns.phonetic || returns.nonPhonetic || returns.keiseiRelated);
        return loadMissingData().then(function(){prepareRelatedFilterValueMap(filterValue)});

        function prepareRelatedFilterValueMap(filterValue){
            let validItemTypes = filterValue.itemType;
            for (let searchTerm of filterValue.searchTermsArray){
                let idx = filterValue.searchData[searchTerm];
                idx.components = {};
                if (searchTerm in componentIndexKan && validItemTypes.kanji) idx.components.radical = componentIndexKan[searchTerm];
                if (searchTerm in componentIndexVoc && validItemTypes.vocabulary) idx.components.kanji = componentIndexVoc[searchTerm];
                idx.usedIn = {};
                if (searchTerm in usedInIndexRad && validItemTypes.radical) idx.usedIn.kanji = usedInIndexRad[searchTerm];
                if (searchTerm in usedInIndexKan && validItemTypes.kanji) idx.usedIn.vocabulary = usedInIndexKan[searchTerm];
                idx.WKvisuallySimilar = {};
                if (searchTerm in WKvisuallySimilarIndex && validItemTypes.kanji) idx.WKvisuallySimilar.kanji = WKvisuallySimilarIndex[searchTerm];
                idx.keiseiCompounds = {};
                if (returns.phonetic && searchTerm in keiseiCompoundIndex && (validItemTypes.kanji || validItemTypes.radical)){
                    idx.keiseiCompounds.radical = keiseiCompoundIndex[searchTerm];
                    idx.keiseiCompounds.kanji = keiseiCompoundIndex[searchTerm];
                };
                idx.keiseiNonCompounds = {};
                if (returns.nonPhonetic && searchTerm in keiseiNonCompoundIndex && (validItemTypes.kanji || validItemTypes.radical)){
                    idx.keiseiNonCompounds.radical = keiseiNonCompoundIndex[searchTerm];
                    idx.keiseiNonCompounds.kanji = keiseiNonCompoundIndex[searchTerm];
                };
                idx.keiseiRelated = {};
                if (returns.keiseiRelated && searchTerm in keiseiRelatedMarksIndex && (validItemTypes.kanji || validItemTypes.radical)){
                    idx.keiseiRelated.radical = keiseiRelatedMarksIndex[searchTerm];
                    idx.keiseiRelated.kanji = keiseiRelatedMarksIndex[searchTerm];
                };
                idx.LYvisuallySimilar = {};
                if (returns.LYvisuallySimilar && searchTerm in visuallySimilarData && validItemTypes.kanji){
                    idx.LYvisuallySimilar.kanji = [];
                    let threshold = filterValue.LYsimilarityTreshold;
                    for (let value of visuallySimilarData[searchTerm]){
                        if (value.score >= threshold && (value.kan in componentIndexKan)) idx.LYvisuallySimilar.kanji.push(value.kan);
                    };
                };
                idx.NiaiVisuallySimilar = {};
                if (returns.NiaiVisuallySimilar && validItemTypes.kanji){
                    idx.NiaiVisuallySimilar.kanji = makeKanjiListNiai(searchTerm);
                };
                idx = filterValue.searchData[searchTerm];
                idx.tradRadInKanji = {};
                if (searchTerm in tradRadInKanji && validItemTypes.kanji){
                    idx.tradRadInKanji.trad_rad = tradRadInKanji[searchTerm];
                };
                idx.kanjiwithTradRad = {};
                if (searchTerm in traditionalRadicals && validItemTypes.trad_rad){
                    idx.kanjiwithTradRad.kanji = traditionalRadicals[searchTerm].data.kanji;
                };
                if (searchTerm in kanjiwithTradRadbyName && validItemTypes.trad_rad){
                    idx.kanjiwithTradRad.kanji = kanjiwithTradRadbyName[searchTerm];
                };
            };
        };

        function makeKanjiListNiai(kanji){
            const sources = [
                {"id": "noto_db",        "base_score": 0.1},
                {"id": "keisei_db",      "base_score": 0.65},
            ];
            const alt_sources = [
                {"id": "old_script_db",  "base_score": 0.4},
                {"id": "yl_radical_db",  "base_score": -0.2},
                {"id": "stroke_dist_db", "base_score": -0.2},
            ];
            let selectedSources, score, old_score, similarData;
            let alternate = filterValue.NiaiAlternate;
            if (alternate){
                selectedSources = [...alt_sources, ...sources];
            } else {
                selectedSources = sources;
            };
            let similar_kanji = {};
            for (let source of selectedSources ){
                let threshold = filterValue.NiaiSimilarityTreshold;

                switch (source.id){
                    case 'noto_db': // has scores
                        if (!(kanji in wk_niai_noto_db)) continue;
                        similarData = wk_niai_noto_db[kanji];
                        break;
                    case 'keisei_db': // no scores
                        if (!(kanji in from_keisei_db)) continue;
                        similarData = from_keisei_db[kanji];
                        break;
                    case 'old_script_db': // no scores
                        if (!(kanji in old_script_db)) continue;
                        similarData = old_script_db[kanji];
                        break;
                    case 'yl_radical_db':; // has scores
                        if (!(kanji in yl_radical_db)) continue;
                        similarData = yl_radical_db[kanji];
                        break;
                    case 'stroke_dist_db': // has scrores
                        if (!(kanji in visuallySimilarData)) continue;
                        similarData = visuallySimilarData[kanji];
                        break;
                };

                switch (source.id){
                    case 'noto_db': // has scores
                    case 'yl_radical_db': // has scores
                    case 'stroke_dist_db': // has scrores
                        for (let similar of similarData){
                            score = similar.score + source.base_score;
                            old_score = (similar.kan in similar_kanji ? similar_kanji[similar.kan].score :  0.0);
                            if ((score > threshold || (score > 0.0 && old_score > 0.0)) && (typeof componentIndexKan[similar.kan]) === 'object'){
                                similar_kanji[similar.kan] = {kan: similar.kan, score: score};
                            } else if (score < 0) {
                                delete similar_kanji[similar.kan];
                            };
                        };
                        break;
                    case 'keisei_db': // no scores
                    case 'old_script_db': // no scores
                        score = source.base_score;
                        for (let similar of similarData){
                            //old_score = (similar in similar_kanji ? similar_kanji[similar].score :  0.0);
                            if ((typeof componentIndexKan[similar]) === 'object'){
                                similar_kanji[similar] = {kan: similar, score: score};
                            } else if (score < 0) {
                                delete similar_kanji[similar];
                            };
                        };
                        break;
                };
            };
            let acc = Object.values(similar_kanji);
            acc = acc.map((a) => a.kan)
            return acc;
        };

    };

    function prepareRelatedFilterValue(filterValueOriginal){
        // Don't modify the original because it is a pointer to the filter settings - modifying it will accumulate trash in the settings
        var filterValue = $.extend({}, filterValueOriginal);
        filterValue.searchTermsArray = split_list(filterValue.searchTerms);
        filterValue.searchData = {};
        for (let searchTerm of filterValue.searchTermsArray) filterValue.searchData[searchTerm] = {};
        return filterValue;
    };

    function reportRelatedResult(item, itemType, match, place){
        item.report = 'Relates to '+itemType+' '+match+' as '+place;
    };

    function relatedSearchFilter(filterValue, item) {
        if (item.data === undefined) {
            return false;
        };

        let compMapType = {radical: 'kanji', kanji: 'vocabulary'};
        let usedMapType = {vocabulary: 'kanji', kanji: 'radical'};
        let itemType = item.object;
        let returns = filterValue.returns;
        let charKey = (item.data.characters !== null ? item.data.characters : item.data.slug);

        for (var searchTerm of filterValue.searchTermsArray) {
            let result = false;
            let searchData = filterValue.searchData[searchTerm];

            if (returns.matchedItem){
                if (filterValue.itemType[itemType]) {
                    if (item.data.characters !== null && item.data.characters === searchTerm) {
                        reportRelatedResult(item, itemType, searchTerm, 'being the item.');
                        return true;
                    };
                    if (itemType === 'radical' && item.data.slug === searchTerm.replace(/ /g, '-')) {
                        reportRelatedResult(item, itemType, searchTerm, 'being the item.');
                        return true;
                    };
                    if (itemType === 'trad_rad') {
                        for (let meaningData of item.data.meanings){
                            if (meaningData.meaning === searchTerm){
                                reportRelatedResult(item, itemType, searchTerm, 'being the item.');
                                return true;
                            };
                        };
                    };
                };
            };

            if (returns.components) {
                if (itemType in searchData.components && searchData.components[itemType].indexOf(item.id) >= 0) {
                    reportRelatedResult(item, compMapType[itemType], searchTerm, 'a component.');
                    return true;
                };
            };

            if (returns.WKvisuallySimilar) {
                if (itemType in searchData.WKvisuallySimilar && searchData.WKvisuallySimilar[itemType].indexOf(item.id) >= 0) {
                    reportRelatedResult(item, itemType, searchTerm, 'WK visually similar.');
                    return true;
                };
            };

            if (returns.usedIn) {
                if (itemType in searchData.usedIn && searchData.usedIn[itemType].indexOf(item.id) >= 0) {
                    reportRelatedResult(item, usedMapType[itemType], searchTerm, 'an item where it is used.');
                    return true;
                };
            };

            if (returns.phonetic) {
                if (itemType in searchData.keiseiCompounds && searchData.keiseiCompounds[itemType].indexOf(charKey) >= 0) {
                    reportRelatedResult(item,　itemType, searchTerm, 'a keisei phonetic compound.');
                    return true;
                };
            };

            if (returns.nonPhonetic) {
                if (itemType in searchData.keiseiNonCompounds && searchData.keiseiNonCompounds[itemType].indexOf(charKey) >= 0) {
                    reportRelatedResult(item, itemType, searchTerm, 'a non phonetic compound.');
                    return true;
                };
            };

            if (returns.keiseiRelated) {
                if (itemType in searchData.keiseiRelated && searchData.keiseiRelated[itemType].indexOf(charKey) >= 0) {
                    reportRelatedResult(item, itemType, searchTerm, 'a related phonetic mark.');
                    return true;
                };
            };

            if (returns.LYvisuallySimilar) {
                if (itemType in searchData.LYvisuallySimilar && searchData.LYvisuallySimilar[itemType].indexOf(charKey) >= 0) {
                    reportRelatedResult(item, itemType, searchTerm, 'a visually similar kanji according to Lars Yencken.');
                    return true;
                };
            };

            if (returns.NiaiVisuallySimilar) {
                if (itemType in searchData.NiaiVisuallySimilar && searchData.NiaiVisuallySimilar[itemType].indexOf(charKey) >= 0) {
                    reportRelatedResult(item, itemType, searchTerm, 'a visually similar kanji according to Niai.');
                    return true;
                };
            };

            if (returns.tradRadInKanji) {
                if (itemType in searchData.tradRadInKanji && searchData.tradRadInKanji[itemType].indexOf(charKey) >= 0) {
                    reportRelatedResult(item, 'kanji', searchTerm, 'a component of the kanji.');
                    return true;
                };
            };

            if (returns.kanjiwithTradRad) {
                if (itemType in searchData.kanjiwithTradRad && searchData.kanjiwithTradRad[itemType].indexOf(charKey) >= 0) {
                    reportRelatedResult(item, 'traditional radical', searchTerm, 'a kanji where it is used.'); return true;
                };
            };

        };

        return false;
    };

    // END Related Search

    // BEGIN Explicit List
    let explicitListHover_tip = 'Enter explicit list of items.';

    function registerExplicitListFilter() {
        const registration = {
            type: 'button',
            label: 'Explicit List',
            default: explicitList_defaults,
            callable_dialog: true,
            on_click: explicitListDialog,
            filter_value_map: prepareValueExplicitList,
            filter_func: explicitListFilter,
            set_options: function(options) { options.subjects = true; },
            hover_tip: explicitListHover_tip,
        };

        wkof.ItemData.registry.sources.wk_items.filters[explicitListFilterName] = $.extend(true, {}, registration);
        wkof.ItemData.registry.sources.wk_items.filters[explicitListFilterName].alternate_sources = ['trad_rad'];
        wkof.ItemData.registry.sources.trad_rad.filters[explicitListFilterName] = $.extend(true, {}, registration);
        wkof.ItemData.registry.sources.trad_rad.filters[explicitListFilterName].main_source = 'wk_items';

    };

    let explicitList_defaults = {explicitList_radical: '',
                                 explicitList_kanji: '',
                                 explicitList_vocabulary: '',
                                 explicitList_kana_vocabulary: '',
                                 explicitList_trad_rad: '',
                      };

    function explicitListDialog(name, config, on_change){
        let $originalDialog = $('#wkof_ds').find('[role="dialog"]');
        let scriptId = config.script_id || $originalDialog.attr("aria-describedby").slice(6);
        let path;
        if (config.path){
            path = config.path.replaceAll('@', 'wkof.settings["'+scriptId+'"].');
        } else if (scriptId === 'ss_quiz') {

            // Self Study Quiz doesn't define the path but we know what it is provided we find the source
            let row = $(this.delegateTarget);
            let panel = row.closest('[role="tabpanel"]');
            let source = panel.attr('id').match(/^ss_quiz_pg_(.*)$/)[1];
            path = 'wkof.settings.ss_quiz.ipresets[wkof.settings.ss_quiz.active_ipreset].content.'+source+'.filters.advSearchFilters_explicitList.value'

            // initialize in case it is not already initialized
            let v = $.extend(true, {}, get_value(path));
            set_value(path, v)
        } else {
            throw 'config.path is not defined';
        };

        let value = $.extend(true, {}, explicitList_defaults, get_value(path));
        set_value(path, value);
        wkof.settings[settingsScriptId] = wkof.settings[settingsScriptId] || {};
        wkof.settings[settingsScriptId].explicitList = $.extend(true, {}, explicitList_defaults, get_value(path));

        let areaIdRadical = settingsScriptId+'_radical';
        let html_radical = '<textarea id="'+areaIdRadical+'" rows="2" style="width: calc(100% - 5px)"></textarea>';
        let areaIdKanji = settingsScriptId+'_kanji';
        let html_kanji = '<textarea id="'+areaIdKanji+'" rows="2" style="width: calc(100% - 5px)"></textarea>';
        let areaIdVocabulary = settingsScriptId+'_vocabulary';
        let html_vocabulary = '<textarea id="'+areaIdVocabulary+'" rows="2" style="width: calc(100% - 5px)"></textarea>';
        let areaIdKana_Vocabulary = settingsScriptId+'_kana_vocabulary';
        let html_kana_vocabulary = '<textarea id="'+areaIdKana_Vocabulary+'" rows="2" style="width: calc(100% - 5px)"></textarea>';
        let areaIdTrad_rad = settingsScriptId+'_trad_rad';
        let html_trad_rad = '<textarea id="'+areaIdTrad_rad+'" rows="2" style="width: calc(100% - 5px)"></textarea>';
        let downloadText = '<button><a download="Filter Item List.txt" id="'+settingsScriptId+'_itemList_link" style="text-decoration:none;color:#000000;">Download Configured Items</a></button>';
        let inputFile = '<input id="'+settingsScriptId+'_inputFile" type="file" title="Select a file for uploading items with the button above.">';

        let dialogConfig = {
            script_id: settingsScriptId,
            title: 'Explicit List',
            on_save: on_save,
            on_cancel: on_cancel,
            on_close: on_close,
            no_bkgd: true,
            settings: {explicitList_radical:{type: "html", html: html_radical, label: 'Radicals',},
                       explicitList_kanji:{type: "html", html: html_kanji, label: 'Kanji',},
                       explicitList_vocabulary:{type: "html", html: html_vocabulary, label: 'Kanji Vocabulary',},
                       explicitList_kana_vocabulary:{type: "html", html: html_kana_vocabulary, label: 'Kana Only Vocabulary',},
                       explicitList_trad_rad:{type: "html", html: html_trad_rad, label: 'Traditional Radicals',},
                       explicitList_divider:{type: 'divider'},
                       explicitList_download:{type: "html", label: ' ', html: downloadText,},
                       explicitList_divider2:{type: 'divider'},
                       explicitList_upload:{type: "button", label: 'Set Items From Selected File', on_click: uploadFile,
                                            hover_tip: 'Upload your items from a previously downloaded file.',},
                       explicitList_input:{type: 'html', html: inputFile,},
                      },
        };

        let dialog = new wkof.Settings(dialogConfig);
        dialog.open();

        // ui issue: do not let the calling dialog be visible
        let originalDisplay = $originalDialog.css('display');
        $originalDialog.css('display', 'none');

        // work around some framework limitations regarding html types
        let $explicitList_radical = $('#'+areaIdRadical);
        $explicitList_radical.val(wkof.settings[settingsScriptId].explicitList.explicitList_radical);
        $explicitList_radical.change(radicalChanged);
        let $label = $explicitList_radical.prev();
        $label.css('width', 'calc(100% - 5px)');
        $label.children('label').css('text-align', 'left');
        let radicalHovertip = 'List your items separated by commas\nYour search terms must match the characters for the item exactly.\nEnglish name of radicals are accepted.';
        $label.attr('title', radicalHovertip);

        let $explicitList_kanji = $('#'+areaIdKanji);
        $explicitList_kanji.val(wkof.settings[settingsScriptId].explicitList.explicitList_kanji);
        $explicitList_kanji.change(kanjiChanged);
        $label = $explicitList_kanji.prev();
        $label.css('width', 'calc(100% - 5px)');
        $label.children('label').css('text-align', 'left');
        let itemlHovertip = 'List your items separated by commas.\nYour search terms must match the characters for the item exactly.';
        $label.attr('title', itemlHovertip);

        let $explicitList_vocabulary = $('#'+areaIdVocabulary);
        $explicitList_vocabulary.val(wkof.settings[settingsScriptId].explicitList.explicitList_vocabulary);
        $explicitList_vocabulary.change(vocabularyChanged);
        $label = $explicitList_vocabulary.prev();
        $label.css('width', 'calc(100% - 5px)');
        $label.children('label').css('text-align', 'left');
        $label.attr('title', itemlHovertip);

        let $explicitList_kana_vocabulary = $('#'+areaIdKana_Vocabulary);
        $explicitList_kana_vocabulary.val(wkof.settings[settingsScriptId].explicitList.explicitList_kana_vocabulary);
        $explicitList_kana_vocabulary.change(kana_vocabularyChanged);
        $label = $explicitList_kana_vocabulary.prev();
        $label.css('width', 'calc(100% - 5px)');
        $label.children('label').css('text-align', 'left');
        $label.attr('title', itemlHovertip);

        let $explicitList_trad_rad = $('#'+areaIdTrad_rad);
        $explicitList_trad_rad.val(wkof.settings[settingsScriptId].explicitList.explicitList_trad_rad);
        $explicitList_trad_rad.change(trad_radChanged);
        $label = $explicitList_trad_rad.prev();
        $label.css('width', 'calc(100% - 5px)');
        $label.children('label').css('text-align', 'left');
        $label.attr('title', radicalHovertip);

        let $download = $('#advSearchFilters_itemList_link');
        $download.attr('title', 'Download Your Configured Items In a File');
        setDownloadLink();

        function on_close(){
            $originalDialog.css('display', originalDisplay);
            if (typeof config.on_close === 'function') config.on_close();
        };

        function on_save(){
            set_value(path, get_value('wkof.settings.'+settingsScriptId+'.explicitList'));
            if (typeof config.on_save === 'function') config.on_save();
        };

        function on_cancel(){
            if (typeof config.on_cancel === 'function') config.on_cancel();
        };

        function radicalChanged(e){
            wkof.settings[settingsScriptId].explicitList.explicitList_radical = $explicitList_radical.val();
            setDownloadLink()
        };

        function kanjiChanged(e){
            wkof.settings[settingsScriptId].explicitList.explicitList_kanji = $explicitList_kanji.val();
            setDownloadLink()
        };

        function vocabularyChanged(e){
            wkof.settings[settingsScriptId].explicitList.explicitList_vocabulary = $explicitList_vocabulary.val();
            setDownloadLink()
        };

        function kana_vocabularyChanged(e){
            wkof.settings[settingsScriptId].explicitList.explicitList_kana_vocabulary = $explicitList_kana_vocabulary.val();
            setDownloadLink()
        };

        function trad_radChanged(e){
            wkof.settings[settingsScriptId].explicitList.explicitList_trad_rad = $explicitList_trad_rad.val();
            setDownloadLink()
        };
    };

    //function setDownloadLink(name, value, config){
    function setDownloadLink(){
        let radicalElem = $('#'+settingsScriptId+'_radical');
        let kanjiElem = $('#'+settingsScriptId+'_kanji');
        let vocabularyElem = $('#'+settingsScriptId+'_vocabulary');
        let kana_vocabularyElem = $('#'+settingsScriptId+'_kana_vocabulary');
        let trad_radElem = $('#'+settingsScriptId+'_trad_rad');
        let radicals = radicalElem.val();
        let kanji = kanjiElem.val();
        let vocabulary = vocabularyElem.val();
        let kana_vocabulary = kana_vocabularyElem.val();
        let trad_rad = trad_radElem.val();
        let encoded = makeEncode(radicals, kanji, vocabulary, kana_vocabulary, trad_rad);
        let downloadElem = $('#'+settingsScriptId+'_itemList_link');
        downloadElem.attr("href", "data:text/plain; charset=utf-8,"+encoded);
    };

    function makeEncode(radicals, kanji, vocabulary, kana_vocabulary, trad_rad){
        let list = [];
        list.push('radicals');
        list.push(radicals);
        list.push('kanji');
        list.push(kanji);
        list.push('vocabulary');
        list.push(vocabulary);
        list.push('kana_vocabulary');
        list.push(kana_vocabulary);
        list.push('traditional radicals');
        list.push(trad_rad);
        let text = list.join('\n');
        return encodeURI("\uFEFF"+text);
    };

    function uploadFile(name, config, on_change){
        let buttons = $(this.target).closest('.right');
        buttons.find('.note').remove();
        let fileElem = $("#advSearchFilters_inputFile");
        let filenames = fileElem.prop('files');
        if (filenames.length === 0){
            buttons.append('<div class="note error">Plese select a file</div>');
            return;
        };
        let filename = filenames[0];
        let reader = new FileReader();
        reader.onload = validateReception;
        reader.readAsText(filename);

        function validateReception(event){
            let result = receiveText(event);
            if (typeof result === 'string'){
                buttons.find('.note').remove();
                buttons.append('<div class="note error">'+result+'</div>');
            };
        };

        function receiveText(event){
            let text = event.target.result;
            let radicals, kanji, vocabulary, kana_vocabulary, trad_rad;
            let errorMsg = 'Invalid file content';
            text = text.replaceAll('\n','');

            let start = text.indexOf('radicals');
            if (start !== 0) return errorMsg;
            start = start + 'radicals'.length;
            let end = text.indexOf('kanji');
            if (end < start) return errorMsg+' radicals';
            radicals = text.slice(start, end);

            start = end + 'kanji'.length;
            end = text.indexOf('vocabulary');
            if (end < start) return errorMsg+' kanji';
            kanji = text.slice(start, end);

            start = end + 'vocabulary'.length;
            // to support old versions from befroe the introduction of the kana_vocabulary object type
            end =  text.indexOf('kana_vocabulary') === -1 ? text.indexOf('traditional radicals') : text.indexOf('kana_vocabulary');
            if (end < start) return errorMsg+' vocabulary';
            vocabulary = text.slice(start, end);

            start = end + 'kana_vocabulary'.length;
            end = text.indexOf('traditional radicals');
            // to support old versions from befroe the introduction of the kana_vocabulary object type
            if (start < end) {kana_vocabulary = text.slice(start, end)} else {kana_vocabulary = ''};

            start = end + 'traditional radicals'.length;
            trad_rad = text.slice(start);

            let elem = $('#'+settingsScriptId+'_radical');
            elem.val(radicals);
            elem.change();
            elem = $('#'+settingsScriptId+'_kanji');
            elem.val(kanji);
            elem.change();
            elem = $('#'+settingsScriptId+'_vocabulary');
            elem.val(vocabulary);
            elem.change();
            elem = $('#'+settingsScriptId+'_kana_vocabulary');
            elem.val(kana_vocabulary);
            elem.change();
            elem = $('#'+settingsScriptId+'_trad_rad');
            elem.val(trad_rad);
            elem.change();
            return true;
        };
    };

    function prepareValueExplicitList(filterValue){
        let renamed = {};
        renamed.radical = split_list(filterValue.explicitList_radical).map((str) => str.replace(/ /g, '-'));
        renamed.kanji = split_list(filterValue.explicitList_kanji);
        renamed.vocabulary = split_list(filterValue.explicitList_vocabulary);
        renamed.kana_vocabulary = split_list(filterValue.explicitList_kana_vocabulary);
        renamed.trad_rad = split_list(filterValue.explicitList_trad_rad);
        return renamed;
    };

    function explicitListFilter(filterValue, item) {
        let type = item.object;
        if (type === 'radical') if (filterValue.radical.indexOf(item.data.slug.toLowerCase()) >= 0) return true;
        if (type === 'radical') if (item.data.characters === null) return false;
        if (type === 'trad_rad'){
            for (let mm of item.data.meanings){
                if (filterValue.trad_rad.indexOf(mm.meaning.toLowerCase()) >= 0) return true;
            };
        };
        return filterValue[type].indexOf(item.data.characters) >= 0;
    };

    // END Explicit List

    // BEGIN Explicit Block
    let explicitBlockHover_tip = 'Enter explicit list of items to be barred from displaying.';

    function registerExplicitBlockFilter() {
        const registration = {
            type: 'button',
            label: 'Explicit Block',
            default: explicitBlock_defaults,
            callable_dialog: true,
            on_click: explicitBlockDialog,
            filter_value_map: prepareValueExplicitBlock,
            filter_func: explicitBlockFilter,
            set_options: function(options) { options.subjects = true; },
            hover_tip: explicitBlockHover_tip,
        };

        wkof.ItemData.registry.sources.wk_items.filters[explicitBlockFilterName] = $.extend(true, {}, registration);
        wkof.ItemData.registry.sources.wk_items.filters[explicitBlockFilterName].alternate_sources = ['trad_rad'];
        wkof.ItemData.registry.sources.trad_rad.filters[explicitBlockFilterName] = $.extend(true, {}, registration);
        wkof.ItemData.registry.sources.trad_rad.filters[explicitBlockFilterName].main_source = 'wk_items';

    };

    let explicitBlock_defaults = {explicitBlock_radical: '',
                                  explicitBlock_kanji: '',
                                  explicitBlock_vocabulary: '',
                                  explicitBlock_kana_vocabulary: '',
                                  explicitBlock_trad_rad: '',
                                 };

    function explicitBlockDialog(name, config, on_change){
        let $originalDialog = $('#wkof_ds').find('[role="dialog"]');
        let scriptId = config.script_id || $originalDialog.attr("aria-describedby").slice(6);
        let path;
        if (config.path){
            path = config.path.replaceAll('@', 'wkof.settings["'+scriptId+'"].');
        } else if (scriptId === 'ss_quiz') {

            // Self Study Quiz doesn't define the path but we know what it is provided we find the source
            let row = $(this.delegateTarget);
            let panel = row.closest('[role="tabpanel"]');
            let source = panel.attr('id').match(/^ss_quiz_pg_(.*)$/)[1];
            path = 'wkof.settings.ss_quiz.ipresets[wkof.settings.ss_quiz.active_ipreset].content.'+source+'.filters.advSearchFilters_explicitBlock.value'

            // initialize in case it is not already initialized
            let v = $.extend(true, {}, get_value(path));
            set_value(path, v)
        } else {
            throw 'config.path is not defined';
        };

        let value = $.extend(true, {}, explicitBlock_defaults, get_value(path));
        set_value(path, value);
        wkof.settings[settingsScriptId] = wkof.settings[settingsScriptId] || {};
        wkof.settings[settingsScriptId].explicitBlock = $.extend(true, {}, explicitBlock_defaults, get_value(path));

        // The width styling attribute must be in-line in textareas otherwise the dialog box won't be positionned properly
        // at the center of the screen. In that case the save button will be outsie the visible area forcing the user to
        // manually replace the dialog to access this button.
        let areaIdRadical = settingsScriptId+'_radical';
        let html_radical = '<textarea id="'+areaIdRadical+'" rows="2" style="width: calc(100% - 5px)"></textarea>';
        let areaIdKanji = settingsScriptId+'_kanji';
        let html_kanji = '<textarea id="'+areaIdKanji+'" rows="2" style="width: calc(100% - 5px)"></textarea>';
        let areaIdVocabulary = settingsScriptId+'_vocabulary';
        let html_vocabulary = '<textarea id="'+areaIdVocabulary+'" rows="2" style="width: calc(100% - 5px)"></textarea>';
        let areaIdKana_Vocabulary = settingsScriptId+'_kana_vocabulary';
        let html_kana_vocabulary = '<textarea id="'+areaIdKana_Vocabulary+'" rows="2" style="width: calc(100% - 5px)"></textarea>';
        let areaIdTrad_rad = settingsScriptId+'_trad_rad';
        let html_trad_rad = '<textarea id="'+areaIdTrad_rad+'" rows="2" style="width: calc(100% - 5px)"></textarea>';
        let downloadText = '<button><a download="Filter Item List.txt" id="'+settingsScriptId+'_itemList_link" style="text-decoration:none;color:#000000;">Download Configured Items</a></button>';
        let inputFile = '<input id="'+settingsScriptId+'_inputFile" type="file" title="Select a file for uploading items with the button above.">';

        let dialogConfig = {
            script_id: settingsScriptId,
            title: 'Explicit List',
            on_save: on_save,
            on_cancel: on_cancel,
            on_close: on_close,
            no_bkgd: true,
            settings: {explicitBlock_radical:{type: "html", html: html_radical, label: 'Radicals',},
                       explicitBlock_kanji:{type: "html", html: html_kanji, label: 'Kanji',},
                       explicitBlock_vocabulary:{type: "html", html: html_vocabulary, label: 'Vocabulary',},
                       explicitBlock_kana_vocabulary:{type: "html", html: html_kana_vocabulary, label: 'Kana Vocabulary',},
                       explicitBlock_trad_rad:{type: "html", html: html_trad_rad, label: 'Traditional Radicals',},
                       explicitBlock_divider:{type: 'divider'},
                       explicitBlock_download:{type: "html", label: ' ', html: downloadText,},
                       explicitBlock_divider2:{type: 'divider'},
                       explicitBlock_upload:{type: "button", label: 'Set Items From Selected File', on_click: uploadFileBlock,
                                                 hover_tip: 'Upload your items from a previously downloaded file.',},
                       explicitBlock_input:{type: 'html', html: inputFile,},
                      },
        };

        let dialog = new wkof.Settings(dialogConfig);
        dialog.open();

        // ui issue: do not let the calling dialog be visible
        let originalDisplay = $originalDialog.css('display');
        $originalDialog.css('display', 'none');

        // work around some framework limitations regarding html types
        let $explicitBlock_radical = $('#'+areaIdRadical);
        $explicitBlock_radical.val(wkof.settings[settingsScriptId].explicitBlock.explicitBlock_radical);
        $explicitBlock_radical.change(radicalChanged);
        let $label = $explicitBlock_radical.prev();
        $label.css('width', 'calc(100% - 5px)');
        $label.children('label').css('text-align', 'left');
        let radicalHovertip = 'List your items separated by commas\nYour search terms must match the characters for the item exactly.\nEnglish name of radicals are accepted.';
        $label.attr('title', radicalHovertip);

        let $explicitBlock_kanji = $('#'+areaIdKanji);
        $explicitBlock_kanji.val(wkof.settings[settingsScriptId].explicitBlock.explicitBlock_kanji);
        $explicitBlock_kanji.change(kanjiChanged);
        $label = $explicitBlock_kanji.prev();
        $label.css('width', 'calc(100% - 5px)');
        $label.children('label').css('text-align', 'left');
        let itemlHovertip = 'List your items separated by commas.\nYour search terms must match the characters for the item exactly.';
        $label.attr('title', itemlHovertip);

        let $explicitBlock_vocabulary = $('#'+areaIdVocabulary);
        $explicitBlock_vocabulary.val(wkof.settings[settingsScriptId].explicitBlock.explicitBlock_vocabulary);
        $explicitBlock_vocabulary.change(vocabularyChanged);
        $label = $explicitBlock_vocabulary.prev();
        $label.css('width', 'calc(100% - 5px)');
        $label.children('label').css('text-align', 'left');
        $label.attr('title', itemlHovertip);

        let $explicitBlock_kana_vocabulary = $('#'+areaIdKana_Vocabulary);
        $explicitBlock_kana_vocabulary.val(wkof.settings[settingsScriptId].explicitBlock.explicitBlock_kana_vocabulary);
        $explicitBlock_kana_vocabulary.change(kana_vocabularyChanged);
        $label = $explicitBlock_kana_vocabulary.prev();
        $label.css('width', 'calc(100% - 5px)');
        $label.children('label').css('text-align', 'left');
        $label.attr('title', itemlHovertip);

        let $explicitBlock_trad_rad = $('#'+areaIdTrad_rad);
        $explicitBlock_trad_rad.val(wkof.settings[settingsScriptId].explicitBlock.explicitBlock_trad_rad);
        $explicitBlock_trad_rad.change(trad_radChanged);
        $label = $explicitBlock_trad_rad.prev();
        $label.css('width', 'calc(100% - 5px)');
        $label.children('label').css('text-align', 'left');
        $label.attr('title', radicalHovertip);

        let $download = $('#advSearchFilters_itemList_linkBlock');
        $download.attr('title', 'Download Your Configured Items In a File');
        setDownloadLinkBlock();

        function on_close(){
            $originalDialog.css('display', originalDisplay);
            if (typeof config.on_close === 'function') config.on_close();
        };

        function on_save(){
            set_value(path, get_value('wkof.settings.'+settingsScriptId+'.explicitBlock'));
            if (typeof config.on_save === 'function') config.on_save();
        };

        function on_cancel(){
            if (typeof config.on_cancel === 'function') config.on_cancel();
        };

        function radicalChanged(e){
            wkof.settings[settingsScriptId].explicitBlock.explicitBlock_radical = $explicitBlock_radical.val();
            setDownloadLinkBlock()
        };

        function kanjiChanged(e){
            wkof.settings[settingsScriptId].explicitBlock.explicitBlock_kanji = $explicitBlock_kanji.val();
            setDownloadLinkBlock()
        };

        function vocabularyChanged(e){
            wkof.settings[settingsScriptId].explicitBlock.explicitBlock_vocabulary = $explicitBlock_vocabulary.val();
            setDownloadLinkBlock()
        };

        function kana_vocabularyChanged(e){
            wkof.settings[settingsScriptId].explicitBlock.explicitBlock_kana_vocabulary = $explicitBlock_kana_vocabulary.val();
            setDownloadLinkBlock()
        };

        function trad_radChanged(e){
            wkof.settings[settingsScriptId].explicitBlock.explicitBlock_trad_rad = $explicitBlock_trad_rad.val();
            setDownloadLinkBlock()
        };
    };

    function setDownloadLinkBlock(){
        let radicalElem = $('#'+settingsScriptId+'_radicalBlock');
        let kanjiElem = $('#'+settingsScriptId+'_kanjiBlock');
        let vocabularyElem = $('#'+settingsScriptId+'_vocabularyBlock');
        let kana_vocabularyElem = $('#'+settingsScriptId+'_kana_vocabularyBlock');
        let trad_radElem = $('#'+settingsScriptId+'_trad_radBlock');
        let radicals = radicalElem.val();
        let kanji = kanjiElem.val();
        let vocabulary = vocabularyElem.val();
        let kana_vocabulary = kana_vocabularyElem.val();
        let trad_rad = trad_radElem.val();
        let encoded = makeEncode(radicals, kanji, vocabulary, kana_vocabulary, trad_rad);
        let downloadElem = $('#'+settingsScriptId+'_itemList_linkBlock');
        downloadElem.attr("href", "data:text/plain; charset=utf-8,"+encoded);
    };

    function uploadFileBlock(name, config, on_change){
        let buttons = $(this.target).closest('.right');
        buttons.find('.note').remove();
        let fileElem = $("#advSearchFilters_inputFileBlock");
        let filenames = fileElem.prop('files');
        if (filenames.length === 0){
            buttons.append('<div class="note error">Plese select a file</div>');
            return;
        };
        let filename = filenames[0];
        let reader = new FileReader();
        reader.onload = validateReception;
        reader.readAsText(filename);

        function validateReception(event){
            let result = receiveText(event);
            if (typeof result === 'string'){
                buttons.find('.note').remove();
                buttons.append('<div class="note error">'+result+'</div>');
            };
        };

        function receiveText(event){
            let text = event.target.result;
            let radicals, kanji, vocabulary, kana_vocabulary, trad_rad;
            let errorMsg = 'Invalid file content';
            text = text.replaceAll('\n','');

            let start = text.indexOf('radicals');
            if (start !== 0) return errorMsg;
            start = start + 'radicals'.length;
            let end = text.indexOf('kanji');
            if (end < start) return errorMsg+' radicals';
            radicals = text.slice(start, end);

            start = end + 'kanji'.length;
            end = text.indexOf('vocabulary');
            if (end < start) return errorMsg+' kanji';
            kanji = text.slice(start, end);

            start = end + 'vocabulary'.length;
            // to support old versions from befroe the introduction of the kana_vocabulary object type
            end = (text.indexOf('kana_vocabulary') === -1) ? (text.indexOf('traditional radicals')) : (text.indexOf('kana_vocabulary'));
            if (end < start) return errorMsg+' vocabulary';
            vocabulary = text.slice(start, end);

            start = end + 'kana_vocabulary'.length;
            end = text.indexOf('traditional radicals');
            // to support old versions from befroe the introduction of the kana_vocabulary object type
            if (start < end) kana_vocabulary = text.slice(start, end);

            start = end + 'traditional radicals'.length;
            trad_rad = text.slice(start);

            let elem = $('#'+settingsScriptId+'_radicalBlock');
            elem.val(radicals);
            elem.change();
            elem = $('#'+settingsScriptId+'_kanjiBlock');
            elem.val(kanji);
            elem.change();
            elem = $('#'+settingsScriptId+'_vocabularyBlock');
            elem.val(vocabulary);
            elem.change();
            elem = $('#'+settingsScriptId+'_kana_vocabularyBlock');
            elem.val(kana_vocabulary);
            elem.change();
            elem = $('#'+settingsScriptId+'_trad_radBlock');
            elem.val(trad_rad);
            elem.change();
            return true;
        };
    };

    function prepareValueExplicitBlock(filterValue){
        let renamed = {};
        renamed.radical = split_list(filterValue.explicitBlock_radical).map((str) => str.replace(/ /g, '-'));
        renamed.kanji = split_list(filterValue.explicitBlock_kanji);
        renamed.vocabulary = split_list(filterValue.explicitBlock_vocabulary);
        renamed.kana_vocabulary = split_list(filterValue.explicitBlock_kana_vocabulary);
        renamed.trad_rad = split_list(filterValue.explicitBlock_trad_rad);
        return renamed;
    };

    function explicitBlockFilter(filterValue, item) {
        let type = item.object;
        if (type === 'radical') if (filterValue.radical.indexOf(item.data.slug.toLowerCase()) >= 0) return false;
        if (type === 'radical') if (item.data.characters === null) return true;
        if (type === 'trad_rad'){
            for (let mm of item.data.meanings){
                if (filterValue.trad_rad.indexOf(mm.meaning.toLowerCase()) >= 0) return false;
            };
        };
        return filterValue[type].indexOf(item.data.characters) < 0;
    };

    // END Explicit Block

    // BEGIN Keisei Semantic-Phonetic Composition

    // Source @acm2010 at the Keisei Semantic Phonetic composition script
    // https://community.wanikani.com/t/userscript-keisei-%E5%BD%A2%E5%A3%B0-semantic-phonetic-composition/21479

    //================================================
    // BEGIN code by @acm2010 released under GPL V3 or later license
    //================================================

    // Wrapper object for Keisei database interactions
    // #############################################################################
    function KeiseiDB()
    {
        this.KTypeEnum = Object.freeze({
            unknown:         0,
            hieroglyph:      1, // 象形: type of character representing pictures
            indicative:      2, // 指事: indicative (kanji whose shape is based on logical representation of an abstract idea)
            comp_indicative: 3, // 会意: kanji made up of meaningful parts (e.g. "mountain pass" is up + down + mountain)
            comp_phonetic:   4, // 形声: kanji in which one element suggests the meaning, the other the pronunciation
            derivative:      5, // 転注: applying an extended meaning to a kanji
            rebus:           6, // 仮借: borrowing a kanji with the same pronunciation to convey an unrelated term
            kokuji:          7, // kanji originating from Japan
            shinjitai:       8, // Character was simplified from a different form (seiji)
            unprocessed:     9  // not yet visited
        }
                                      );

        this.wkradical_to_phon = {};
    }
    // #############################################################################

    // #############################################################################
    (function() {
        "use strict";

        KeiseiDB.prototype = {
            constructor: KeiseiDB,

            // #####################################################################
            init: function()
            {
                this.genWKRadicalToPhon();
                this.mapPhoneticsToKan(); // added by prouleau for Item Inspector
                this.findSemanticForKan(); // added by prouleau for Item Inspector
            },
            // #####################################################################

            // #####################################################################
            kdata: function(kanji)
            {
                return this.kanji_db[kanji];
            },
            // #####################################################################

            // #####################################################################
            checkKanji: function(kanji)
            {
                return Boolean(this.kanji_db && (kanji in this.kanji_db));
            },
            // #####################################################################
            // #####################################################################
            checkPhonetic: function(phon)
            {
                return Boolean(this.phonetic_db && (phon in this.phonetic_db));
            },
            // #####################################################################
            // #####################################################################
            checkRadical: function(phon)
            {
                return Boolean(this.phonetic_db && this.phonetic_db[phon] && this.phonetic_db[phon][`wk-radical`]);
            },
            // #####################################################################
            // #####################################################################
            getKType: function(kanji)
            {
                return this.KTypeEnum[this.kanji_db[kanji].type];
            },
            // #####################################################################

            // #####################################################################
            getKItem: function(kanji)
            {
                if (kanji in this.kanji_db)
                    return this.kanji_db[kanji];
                else
                    return {};
            },
            // #####################################################################

            // #####################################################################
            getWKItem: function(kanji)
            {
                if (kanji in this.wk_kanji_db)
                    return this.wk_kanji_db[kanji];
                else
                    return {"level": "N/A"};
            },
            // #####################################################################

            // #####################################################################
            getKReadings: function(kanji)
            {
                let result = [];

                if (!(kanji in this.kanji_db))
                    result = this.phonetic_db[kanji].readings;
                else
                    result = this.kanji_db[kanji].readings;

                if (!result.length)
                    return this.getWKOnyomi(kanji);
                else
                    return result;
            },
            // #####################################################################
            // #####################################################################
            getKPhonetic: function(kanji)
            {
                if (kanji in this.kanji_db)
                    return this.kanji_db[kanji].phonetic;
                else
                    return null;
            },
            // #####################################################################

            // Phonetic DB functions

            // #####################################################################
            getPCompounds: function(phon)
            {
                if (phon in this.phonetic_db)
                    return this.phonetic_db[phon].compounds;
                else
                {
                    console.log(`The following phonetic is not in the DB!`, phon);
                    return [];
                }
            },
            // #####################################################################
            // added by prouleau for Item Inspector
            // The phonetic field is used by @acm2010 code but it seems is not initialized
            // anywhere in the code. I had to reverse engineer the initialization
            // #####################################################################
            mapPhoneticsToKan: function()
            {
                Object.keys(this.kanji_db).forEach(
                    (kan) => {
                        this.kanji_db[kan].phonetic = [];
                    });
                Object.keys(this.phonetic_db).forEach(
                    (phon) => {
                        this.phonetic_db[phon].compounds.forEach(
                            (kan) => {
                                if (this.kanji_db[kan].phonetic.indexOf(phon) === -1 && this.checkPhonetic(phon)) this.kanji_db[kan].phonetic.push(phon);
                            })
                    })
            },
            // #####################################################################
            // added by prouleau for Item Inspector
            // The semantic field is used by @acm2010 code but it seems is not initialized
            // anywhere in the code. I had to reverse engineer the initialization
            // #####################################################################
            findSemanticForKan: function()
            {
                /* Object.keys(this.kanji_db).forEach(
                    (kan) => {
                        if (!(kan in kanjiIndex)) return;
                        kanjiIndex[kan].data.component_subject_ids.forEach((id) => {
                                                                  let rad = subjectIndexRad[id].data.characters;
                                                                  if (rad === null) return;
                                                                  if (this.kanji_db[kan].phonetic.indexOf(rad) === -1) this.kanji_db[kan].semantic = rad;
                                                                  return})
                    })*/
                Object.keys(this.phonetic_db).forEach(
                    (phon) => {
                        Object.keys(this.getPNonCompounds(phon)).forEach(
                            (kan) => {
                                if (this.kanji_db[kan] && this.kanji_db[kan].phonetic && this.kanji_db[kan].phonetic.indexOf(phon) === -1) this.kanji_db[kan].semantic = phon;
                            })
                    })
            },
            // #####################################################################
            // #####################################################################
            getPReadings: function(phon)
            {
                if (phon in this.phonetic_db)
                    return this.phonetic_db[phon].readings;
                else
                    return [];
            },
            // #####################################################################

            // Sort the readings by their importance (main readings first, then the
            // readings that are at least possible, and finally readings unused in
            // jouyou. Also add styles that reflect their importance.
            // #####################################################################
            getPReadings_style: function(phon)
            {
                let result = [];
                const rnd_length = this.phonetic_db[phon].readings.length;

                if (phon in this.phonetic_db)
                {
                    this.phonetic_db[phon].readings.forEach(
                        function(reading, i)
                        {
                            let rnd_count = 0;

                            [phon, ...this.phonetic_db[phon].compounds].forEach(
                                function(compound, j)
                                {
                                    if (!(compound in this.kanji_db))
                                        return;

                                    // Give a bonus to earlier readings in the phonetic's list
                                    if (this.kanji_db[compound].readings[0] === reading)
                                        rnd_count += 10 + (rnd_length-i);
                                    else if (this.kanji_db[compound].readings.includes(reading))
                                        rnd_count += 2 + (rnd_length-i);
                                },
                                this
                            );

                            if (!rnd_count)
                                result.push([rnd_count, `<span class="keisei_obscure_reading">${reading}</span>`]);
                            else if (rnd_count < 10)
                                result.push([rnd_count, `<span class="keisei_alternative_reading">${reading}</span>`]);
                            else
                                result.push([rnd_count, `<span class="keisei_main_reading">${reading}</span>`]);
                        },
                        this
                    );
                }

                return result.sort((a,b)=>b[0]-a[0]).map((d)=>d[1]);
            },
            // #####################################################################
            // #####################################################################
            getPXRefs: function(phon)
            {
                if (phon in this.phonetic_db)
                    return this.phonetic_db[phon].xrefs;
                else
                    return [];
            },
            // #####################################################################
            // #####################################################################
            getPNonCompounds: function(phon)
            {
                if (phon in this.phonetic_db)
                    return this.phonetic_db[phon].non_compounds;
                else
                    return [];
            },
            // #####################################################################

            genWKRadicalToPhon: function()
            {
                Object.keys(this.phonetic_db).forEach(
                    function(phon) {
                        const data = this.phonetic_db[phon];

                        this.wkradical_to_phon[data[`wk-radical`]] = phon;
                        this.wkradical_to_phon[phon] = phon;
                    },
                    this
                );
            },
            // #####################################################################
            mapWKRadicalToPhon: function(radical)
            {
                if (this.wkradical_to_phon && radical in this.wkradical_to_phon)
                    return this.wkradical_to_phon[radical];
                else
                    return null;
            },
            // #####################################################################
            getWKRadical: function(phon)
            {
                return this.phonetic_db[phon][`wk-radical`];
            },
            // #####################################################################
            getWKRadicalPP: function(phon)
            {
                if (this.phonetic_db && this.phonetic_db[phon][`wk-radical`])
                    return _.startCase(this.phonetic_db[phon][`wk-radical`]);
                else
                    return `Not in WK`;
            },
            // #####################################################################

            // #####################################################################
            isKanjiInWK: function(kanji)
            {
                return Boolean(this.wk_kanji_db && (kanji in this.wk_kanji_db));
            },
            // #####################################################################

            // #####################################################################
            isFirstReadingInWK: function(kanji)
            {
                if (this.isKanjiInWK(kanji))
                {
                    const onyomi = this.getWKOnyomi(kanji);

                    return (onyomi.includes(this.getKReadings(kanji)[0]));
                }
                else
                    return true;
            },
            // #####################################################################

            // Check if a kanji is considered obscure in regard to its phonetic,
            // ie, the kanji doesn't look like it has the phonetic at all.
            // #####################################################################
            isPObscure: function(kanji)
            {
                return Boolean(this.kanji_db && (`obscure` in this.kanji_db[kanji]));
            },
            // #####################################################################

            getWKOnyomi: function(kanji)
            {
                if (this.isKanjiInWK(kanji))
                {
                    if (this.wk_kanji_db[kanji].onyomi !== null)
                        return _.map(this.wk_kanji_db[kanji].onyomi.split(`,`), _.trim);
                    else
                        return [];
                }
                else
                    return [`*DB Error*`];
            },
            // #####################################################################
            getWKKMeanings: function(kanji)
            {
                let result = [];

                if (this.isKanjiInWK(kanji))
                    result = _.map(this.wk_kanji_db[kanji].meaning.split(`,`), _.trim);
                else
                {
                    if (this.kanji_db[kanji] === undefined)
                    {
                        console.log(`The kanji ${kanji} is not found in the DB!`);
                        result = [];
                    }
                    else
                        result = this.kanji_db[kanji].meanings;
                }

                return result.map(_.startCase);
            },
            // #####################################################################

            // #####################################################################
            deRendaku: function(reading)
            {
                let result = reading;

                const rendaku = `がぎぐげござじずぜぞだぢちづでどばびぶべぼぱぴぷぺぽ`;
                const vanilla = `かきくけこさしすせそたちしつてとはひふへほはひふへほ`;

                const pattern = _.zip(_.split(rendaku, ``), _.split(vanilla, ``));
                pattern.push([`じょ`, `よ`]);
                pattern.push([`じゃ`, `や`]);
                pattern.push([`じゅ`, `ゆ`]);

                _.forEach(pattern,
                          ([from_kana, to_kana]) =>
                          result = result.replace(from_kana, to_kana)
                         );

                return result;
            },
            // #####################################################################

            // #####################################################################
            // Support for additional pages listing all tone mark
            // #####################################################################

            // #####################################################################
            getPhoneticsByCompCount: function()
            {
                let result = new Map();

                _.forEach(this.phonetic_db,
                          (p_item, phon) => {
                    const comp_len = p_item.compounds.length;

                    if (result.has(comp_len))
                        result.get(comp_len).push(phon);
                    else
                        result.set(comp_len, [phon]);
                }
                         );

                result.forEach(
                    (phons, count) => {
                        result.set(count, phons.sort(
                            (a,b)=>a.localeCompare(b, "ja-u-co-unihan")));
                    }
                );

                return new Map([...result.entries()].sort((a,b)=>b[0]-a[0]));
            },
            // #####################################################################

            // #####################################################################
            getPhoneticsByHeader: function()
            {
                const initials_d = new Map([
                    [`あ`, `あいうえお`],
                    [`か`, `かきくけこがぎぐげご`],
                    [`さ`, `さしすせそざじずぜぞ`],
                    [`た`, `たちつてとだぢづでど`],
                    [`な`, `なにぬねの`],
                    [`は`, `はひふへほばびぶべぼ`],
                    [`ま`, `まみむめも`],
                    [`ら`, `らりるれろ`],
                    [`や`, `やゆよ`],
                    [`わ`, `わを`]
                ]);

                let result = new Map();

                initials_d.forEach(
                    (subheaders, header) => {
                        result.set(header, new Map());

                        _.forEach(subheaders,
                                  (subheader) => {
                            const sub_result = [];

                            _.forEach(this.phonetic_db,
                                      (p_item, phon) => {
                                if (!p_item.readings.length)
                                    return;

                                if (subheader.match(p_item.readings[0][0]))
                                    sub_result.push([2*p_item.compounds.length +
                                                     (p_item["wk-radical"]?1:0),
                                                     phon]);
                            }
                                     );

                            result.get(header).set(subheader,
                                                   sub_result
                                                   .sort((a,b)=>b[0]-a[0])
                                                   .map((d)=>d[1]));
                        }
                                 );
                    },
                    this
                );

                return result;
            }
        };
        // #########################################################################
    }
     ());
    // #############################################################################

    //================================================
    // END code by @acm2010 released under GPL V3 or later license
    //================================================
    let nonPhoneticTypes = {};
    function initNonPhoneticTypes() {
        nonPhoneticTypes[keiseiDB.KTypeEnum.hieroglyph] = true;
        nonPhoneticTypes[keiseiDB.KTypeEnum.indicative] = true;
        nonPhoneticTypes[keiseiDB.KTypeEnum.comp_indicative] = true;
        nonPhoneticTypes[keiseiDB.KTypeEnum.rebus] = true;
        nonPhoneticTypes[keiseiDB.KTypeEnum.kokuji] = true;
        nonPhoneticTypes[keiseiDB.KTypeEnum.shinjitai] = true;
    };

    let keiseiDB;
    // function to be invoked in the startup sequence
    function loadKeiseiDatabase(){
        if (typeof advSearchFilters.kanji_db === 'object'){
            KeiseiDB.prototype.kanji_db = advSearchFilters.kanji_db;
            KeiseiDB.prototype.phonetic_db = advSearchFilters.phonetic_db;
            KeiseiDB.prototype.wk_kanji_db = advSearchFilters.wk_kanji_db;
            keiseiDB = new KeiseiDB();
            keiseiDB.init();
            prepareKeiseiIndexes();
            return Promise.resolve();
        } else {
        let promiseList = [];
            promiseList.push(load_file(kanji_db, true, {responseType: "arraybuffer"}).then(data => {lzmaDecompressAndProcessKanjiDB(data);}));
            promiseList.push(load_file(phonetic_db, true, {responseType: "arraybuffer"}).then(data => {lzmaDecompressAndProcessPhoneticDB(data);}));
            promiseList.push(load_file(wk_kanji_db, true, {responseType: "arraybuffer"}).then(data => {lzmaDecompressAndProcessWkKanjiDB(data);}));
            return Promise.all(promiseList).then(x => {keiseiDB = new KeiseiDB(); keiseiDB.init(); prepareKeiseiIndexes()});
        };
    };

    function lzmaDecompressAndProcessKanjiDB(data){
        let inStream = new LZMA.iStream(data);
        let outStream = LZMA.decompressFile(inStream);
        let string = streamToString(outStream);
        KeiseiDB.prototype.kanji_db = JSON.parse(string);
        advSearchFilters.kanji_db = KeiseiDB.prototype.kanji_db;
    };

    function lzmaDecompressAndProcessPhoneticDB(data){
        let inStream = new LZMA.iStream(data);
        let outStream = LZMA.decompressFile(inStream);
        let string = streamToString(outStream);
        KeiseiDB.prototype.phonetic_db = JSON.parse(string);
        advSearchFilters.phonetic_db = KeiseiDB.prototype.phonetic_db;
    };

    function lzmaDecompressAndProcessWkKanjiDB(data){
        let inStream = new LZMA.iStream(data);
        let outStream = LZMA.decompressFile(inStream);
        let string = streamToString(outStream);
        KeiseiDB.prototype.wk_kanji_db = JSON.parse(string);
        advSearchFilters.wk_kanji_db = KeiseiDB.prototype.wk_kanji_db;
    };

    function deleteKeiseiCache(){
        wkof.file_cache.delete(kanji_db);
        wkof.file_cache.delete(phonetic_db);
        wkof.file_cache.delete(wk_kanji_db);
    };

    var keiseiCompoundIndex = {}
    var keiseiNonCompoundIndex = {}
    var keiseiRelatedMarksIndex = {}

    function prepareKeiseiIndexes(){
        let phonetic = KeiseiDB.prototype.phonetic_db;
        for (let kanji in componentIndexKan){
            if ((typeof KeiseiDB.prototype.phonetic_db[kanji]) === 'object'){
                keiseiCompoundIndex[kanji] = phonetic[kanji].compounds;
                keiseiNonCompoundIndex[kanji] = phonetic[kanji].non_compounds;
                keiseiRelatedMarksIndex[kanji] = phonetic[kanji].xrefs;
            };
        };
        for (let radical in usedInIndexRad){
            if ((typeof KeiseiDB.prototype.phonetic_db[radical]) === 'object'){
                keiseiCompoundIndex[radical] = phonetic[radical].compounds;
                keiseiNonCompoundIndex[radical] = phonetic[radical].non_compounds;
                keiseiRelatedMarksIndex[radical] = phonetic[radical].xrefs;
            };
        };
    };

    // END Keisei Semantic-Phonetic Composition

    // BEGIN Lars Yencken Visually Similar Kanji

    var visuallySimilarData;
    function get_visually_similar_data(){
        if (typeof advSearchFilters.visuallySimilarData === 'object'){
            visuallySimilarData = advSearchFilters.visuallySimilarData;
            return Promise.resolve();
        } else {
            return load_file(visuallySimilarFilename, true, {responseType: "arraybuffer"})
                .then(function(data){lzmaDecompressAndProcessVisuallySimilar(data)});
        };
    };

    function lzmaDecompressAndProcessVisuallySimilar(data){
        let inStream = new LZMA.iStream(data);
        let outStream = LZMA.decompressFile(inStream);
        let string = streamToString(outStream);
        visuallySimilarData = JSON.parse(string);
        advSearchFilters.visuallySimilarData = visuallySimilarData;
    };


    function deleteVisuallySimilarCache(){
        wkof.file_cache.delete(visuallySimilarFilename);
    };

    // END Lars Yencken Visually Similar Kanji

    // BEGIN Niai Visually Similar Kanji
    // Source @acm2010 at the Niai Visually Similar script
    // https://community.wanikani.com/t/userscript-niai-%E4%BC%BC%E5%90%88%E3%81%84-visually-similar-kanji/23325
    // https://github.com/mwil/wanikani-userscripts/tree/master/wanikani-similar-kanji

    // Niai also uses Lars Yencken visually similar data

    var from_keisei_db;
    var old_script_db;
    var wk_niai_noto_db;
    var yl_radical_db;

    function loadNiaiDatabase(){
        if (typeof advSearchFilters.from_keisei_db === 'object'){
            from_keisei_db = advSearchFilters.from_keisei_db;
            old_script_db = advSearchFilters.old_script_db;
            wk_niai_noto_db = advSearchFilters.wk_niai_noto_db;
            yl_radical_db = advSearchFilters.yl_radical_db;
            return Promise.resolve();
        } else {
            let promiseList = [];
            promiseList.push(load_file(from_keisei_db_filename, true, {responseType: "arraybuffer"}).then(data => {lzmaDecompressAndProcessNiai_from_keisei_db(data);}));
            promiseList.push(load_file(old_script_db_filename, true, {responseType: "arraybuffer"}).then(data => {lzmaDecompressAndProcessNiai_old_script_db(data);}));
            promiseList.push(load_file(wk_niai_noto_db_filename, true, {responseType: "arraybuffer"}).then(data => {lzmaDecompressAndProcessNiai_wk_niai_noto_db(data);}));
            promiseList.push(load_file(yl_radical_db_filename, true, {responseType: "arraybuffer"}).then(data => {lzmaDecompressAndProcessNiai_yl_radical_db(data);}));
            return Promise.all(promiseList);
        };
    };

    function lzmaDecompressAndProcessNiai_from_keisei_db(data){
        let inStream = new LZMA.iStream(data);
        let outStream = LZMA.decompressFile(inStream);
        let string = streamToString(outStream);
        from_keisei_db = JSON.parse(string);
        advSearchFilters.from_keisei_db = from_keisei_db;
    };

    function lzmaDecompressAndProcessNiai_old_script_db(data){
        let inStream = new LZMA.iStream(data);
        let outStream = LZMA.decompressFile(inStream);
        let string = streamToString(outStream);
        old_script_db = JSON.parse(string);
        advSearchFilters.old_script_db = old_script_db;
    };

    function lzmaDecompressAndProcessNiai_wk_niai_noto_db(data){
        let inStream = new LZMA.iStream(data);
        let outStream = LZMA.decompressFile(inStream);
        let string = streamToString(outStream);
        wk_niai_noto_db = JSON.parse(string);
        advSearchFilters.wk_niai_noto_db = wk_niai_noto_db;
    };

    function lzmaDecompressAndProcessNiai_yl_radical_db(data){
        let inStream = new LZMA.iStream(data);
        let outStream = LZMA.decompressFile(inStream);
        let string = streamToString(outStream);
        yl_radical_db = JSON.parse(string);
        advSearchFilters.yl_radical_db = yl_radical_db;
    };

    function deleteNiaiCache(){
        wkof.file_cache.delete(from_keisei_db_filename);
        wkof.file_cache.delete(old_script_db_filename);
        wkof.file_cache.delete(wk_niai_noto_db_filename);
        wkof.file_cache.delete(yl_radical_db_filename);
    };

    // END Niai Visually Similar Kanji


    //=============================================================================
    // Begin code lifted from wkof core module and adapted to transfer binary data
    // Must be licensed under MIT license
    //=============================================================================

    //------------------------------
    // Load a file asynchronously, and pass the file as resolved Promise data.
    //------------------------------
    function promise(){var a,b,c=new Promise(function(d,e){a=d;b=e;});c.resolve=a;c.reject=b;return c;};

    function load_file(url, use_cache, options) {
        var fetch_promise = promise();
        var no_cache = split_list(localStorage.getItem('wkof.load_file.nocache') || '');
        if (no_cache.indexOf(url) >= 0 || no_cache.indexOf('*') >= 0) use_cache = false;
        if (use_cache === true) {
            return wkof.file_cache.load(url, use_cache).catch(fetch_url);
        } else {
            return fetch_url();
        };

        // Retrieve file from server
        function fetch_url(){
            var request = new XMLHttpRequest();
            request.onreadystatechange = process_result;
            request.open('GET', url, true);
            if (options.responseType) request.responseType = options.responseType;
            request.send();
            return fetch_promise;
        };

        function process_result(event){
            if (event.target.readyState !== 4) return;
            if (event.target.status >= 400 || event.target.status === 0) return fetch_promise.reject(event.target.status);
            if (use_cache) {
                wkof.file_cache.save(url, event.target.response)
                    .then(fetch_promise.resolve.bind(null,event.target.response));
            } else {
                fetch_promise.resolve(event.target.response);
            };
        };
    };

    //===========================================================================
    // End code lifted from wkof core module and adapted to transfer binary data
    //===========================================================================

    // ----------------------------------------------------------------------
    // Kanjidic2 data
    // ----------------------------------------------------------------------

    var kanjidic2Data;
    function loadKanjidic2(){
        if (typeof advSearchFilters.kanjidic2Data === 'object'){
            kanjidic2Data = advSearchFilters.kanjidic2Data;
            return Promise.resolve();
        } else {
            return load_file(kanjidic2File, true, {responseType: "arraybuffer"})
                .then(function(data){lzmaDecompressAndProcessKanjidic2(data)})
        }
    };

    function lzmaDecompressAndProcessKanjidic2(data){
        let inStream = new LZMA.iStream(data);
        let outStream = LZMA.decompressFile(inStream);
        let string = streamToString(outStream);
        kanjidic2Data = JSON.parse(string);
        advSearchFilters.kanjidic2Data = kanjidic2Data;
    };

    function kanjidic2_cacheDelete(){
        return wkof.file_cache.delete(kanjidic2File);
    };

    // converts the stream to a javascript string
    // the native stream.toString() methof of the LZMA
    // script is abysmally slow and a major source of latency
    function streamToString(outStream){
        var buffers = outStream.buffers, charList = [];
        if (window.TextDecoder){
            // TextDecoder supported - do it the fast way
            var decoder = new TextDecoder();
            for (let n = 0, nL = buffers.length; n < nL; n++) {
                charList.push(decoder.decode(buffers[n]));
            }
        } else {
            // TextDecoder unsupported - do it but a bit slower
            var conv = String.fromCharCode;
            for (let n = 0, nL = buffers.length; n < nL; n++) {
                var buf = buffers[n];
                for (var i = 0, iL = buf.length; i < iL; i++) {
                    charList.push(conv(buf[i]));
                };
            };
        };
        return charList.join('');
    };

    // ----------------------------------------------------------------------
    // Stroke Count for Wanikani radicals
    // ----------------------------------------------------------------------

    var WkStrokeCountData;
    function loadStrokeCount(){
        // check if Item Inspector has already loaded the data
        if (typeof (advSearchFilters) === 'object' && (WkStrokeCountData in advSearchFilters)){
            WkStrokeCountData = advSearchFilters.WkStrokeCountData;
            return Promise.resolve();
        };
        return load_file(Wkit_StrokeCountforRadicals, true, {responseType: "arraybuffer"})
             .then(function(data){lzmaDecompressAndProcessWkStrokeCount(data)})
    };

    function lzmaDecompressAndProcessWkStrokeCount(data){
        let inStream = new LZMA.iStream(data);
        let outStream = LZMA.decompressFile(inStream);
        let string = streamToString(outStream);
        WkStrokeCountData = JSON.parse(string);
        // publish data to Item Inspectort
        if (typeof advSearchFilters === 'object'){
            advSearchFilters.WkStrokeCountData =  WkStrokeCountData;
        };
    };

    function WkStrokeCount_cacheDelete(){
        return wkof.file_cache.delete(Wkit_StrokeCountforRadicals);
    };

    // ----------------------------------------------------------------------
    // A series of functions to add traditional radicals as a source of items
    // ----------------------------------------------------------------------

    var traditionalRadicals;
    var traditionalRadicalsItems;

    function loadTraditionalRadicals(){
        if (typeof advSearchFilters.traditionalRadicalsItems === 'object'){
            traditionalRadicals = advSearchFilters.traditionalRadicals;
            trad_rad_postLoadProcess();
            return Promise.resolve();
        } else {
            return load_file(traditionaRadicalsFile, true, {responseType: "arraybuffer"})
                .then(function(data){lzmaDecompressAndProcessTradRad(data);
                                     advSearchFilters.traditionalRadicals = traditionalRadicals;
                                     trad_rad_postLoadProcess();})
        };
    };

    function lzmaDecompressAndProcessTradRad(data){
        let inStream = new LZMA.iStream(data);
        let outStream = LZMA.decompressFile(inStream);
        let string = streamToString(outStream);
        traditionalRadicals = JSON.parse(string);
    };

    function trad_rad_postLoadProcess(){
        traditionalRadicalsItems = Object.values(traditionalRadicals);
        prepareTradRadIndex();
    };

    function trad_rad_cacheDelete(){
        return wkof.file_cache.delete(traditionaRadicalsFile);
    };

    function tradRadFetcher(){
        return Promise.resolve(traditionalRadicalsItems);
    };

    function registerTraditionalRadicals(){
        if (typeof wkof.ItemData.registry.sources.trad_rad === 'undefined'){
            wkof.ItemData.registry.sources.trad_rad = {
                description: 'Traditional Radicals',
                fetcher: tradRadFetcher,
                options: {},
                filters: {},
            };
        };
        return Promise.resolve();
    };

    var kanjiwithTradRadbyName = {};
    var tradRadInKanji = {};
    function prepareTradRadIndex(){
        for (let item of traditionalRadicalsItems){
            for (let mm of item.data.meanings){
                let meaning = mm.meaning;
                if (typeof kanjiwithTradRadbyName[meaning] !== 'object') kanjiwithTradRadbyName[meaning] = [];
                kanjiwithTradRadbyName[meaning] = kanjiwithTradRadbyName[meaning].concat(item.data.kanji);
            };
            for (let kanji of item.data.kanji){
                if (typeof tradRadInKanji[kanji] !== 'object') tradRadInKanji[kanji] = [];
                tradRadInKanji[kanji].push(item.data.characters);
            };
        };
    };
    //-------------------------------------------
    // Load prerequisite scripts

    function loadPrerequisiteScripts(){
        let promiseList = [];
        promiseList.push(wkof.load_script(lodash_file, true).then(function(){return wkof.wait_state('Wkit_lodash','Ready')}));
        promiseList.push(wkof.load_script(lzma_file, true).then(function(){return wkof.wait_state('Wkit_lzma','Ready')}));
        promiseList.push(wkof.load_script(lzma_shim_file, true).then(function(){return wkof.wait_state('Wkit_lzma_shim','Ready')}));
        return Promise.all(promiseList);
    };

    //------------------------------------------------------------------------------
    // To reduce latency non Wanikani data is loaded on demand.
    // Variables dataRequired and dataLoaded track which data is required and loaded

    var dataRequired = {larsYencken: false, niai: false, keisei: false, kanjidic2: false, items: false, WkStrokeCountData: false,};
    var dataLoaded = {larsYencken: false, niai: false, keisei: false, kanjidic2: false, items: false, WkStrokeCountData: false,};

    function loadMissingData(){
        let promiseList = [];

        if (dataRequired.larsYencken && !dataLoaded.larsYencken) {
            promiseList.push(get_visually_similar_data().then(function(){dataLoaded.larsYencken = true;}));
        };
        if (dataRequired.niai && !dataLoaded.niai) {
            promiseList.push(loadNiaiDatabase().then(function(){dataLoaded.niai = true;}));
        };
        if (dataRequired.keisei && !dataLoaded.keisei) {
            promiseList.push(loadKeiseiDatabase().then(function(){prepareKeiseiIndexes(); dataLoaded.keisei = true;}));
        };
        if (dataRequired.kanjidic2 && !dataLoaded.kanjidic2) {
            promiseList.push(loadKanjidic2().then(function(){dataLoaded.kanjidic2 = true;}));
        };
        if (dataRequired.WkStrokeCountData && !dataLoaded.WkStrokeCountData) {
            promiseList.push(loadStrokeCount().then(function(){dataLoaded.WkStrokeCountData = true;}));
        };
        // Items must always be loaded first because they are prerequisites to indexes
        if (!dataLoaded.items) {
            dataLoaded.items = true; // must be called first, otherwise the data will be loaded twice - once for each data source
            let config = {wk_items: {filters:{}, options:{'subjects': true,}}};
            return wkof.ItemData.get_items(config)
                    .then(prepareIndex)
                    .then(loadTraditionalRadicals)
                    .then(function(){return Promise.all(promiseList)})
                    .then(function(){wkof.set_state('advSearchFilters_items', 'ready')})
        } else {
            return wkof.wait_state('advSearchFilters_items', 'ready')
                    .then(function(){return Promise.all(promiseList)})
        };
    };

    startupSequence();
})(window.wkof);