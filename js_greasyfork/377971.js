// ==UserScript==
// @name         Wanikani Open Framework: Visually similar kanji filter
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Adds a wkof filter for visually similar kanji
// @author       Kumirei
// @include      https://www.wanikani.com/*
// @include      *preview.wanikani.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377971/Wanikani%20Open%20Framework%3A%20Visually%20similar%20kanji%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/377971/Wanikani%20Open%20Framework%3A%20Visually%20similar%20kanji%20filter.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

(function(wkof) {
    let script_id = "VSKFilter";
    if (!wkof) return;

    var visuallySimilarFilename = 'https://raw.githubusercontent.com/mwil/wanikani-userscripts/master/wanikani-similar-kanji/db/stroke_edit_dist_esc.json';
    var visuallySimilarData;
    async function get_data() {
        let data = await wkof.load_file(visuallySimilarFilename, true);
        visuallySimilarData = JSON.parse(data);
    }

    function ageCache(){
        // periodically ages the cache
        let oneMonth = 1000*60*60*24*30;
        var now = Date.now();
        if (wkof.settings[script_id] === undefined) wkof.settings[script_id] = {};
        if (wkof.settings[script_id].lastTime === undefined){
            wkof.settings[script_id].lastTime = now;
            wkof.Settings.save(script_id);
        }
        let lastTime = wkof.settings[script_id].lastTime;
        if (now > lastTime + oneMonth){
            wkof.file_cache.delete(visuallySimilarFilename);
            wkof.settings[script_id].lastTime = now;
            wkof.Settings.save(script_id);
        }
    }

    // Turns comma separated lists into arrays. Supports latin and Japanese commas. Converts Japanese periods into latin decimal points
    // Adapted from a handy function of rfindley
    function split_list(str) {return str.replace(/．/g,'.').replace(/[、，]/g,',').replace(/[\s ]+/g,' ').trim().replace(/ *, */g, ',').toLowerCase().split(',').filter(function(name) {return (name.length > 0);});}

    // Translate Japanese numerals into latin so they can be parsed into numbers by Number()
    function tr(text) {
        return text.replace( /[０１２３４５６７８９]/g, (chr => '0123456789'.charAt('０１２３４５６７８９'.indexOf( chr ))));
    }

    // Create an array of visually similar kanji for all search terms
    function makeVisuallySimilarArrays(str){
        var arr = split_list(str);
        if (arr.length === 0) return [];
        // compute the similarity threshold if one is provided
        var threshold = 0.0; // default if threshold is absent
        var first = Number(tr(arr[0]));
        if (!isNaN(first)){
            // number is present - calculate threshold
            if (arr.length <= 1) return [];
            var second = Number(tr(arr[1]));
            if (isNaN(second)) {
                // decimal separator not a comma - first is threshold
                threshold = first;
                arr = arr.splice(1);
            } else {
                // decimal separator is a comma - calculate threshold
                threshold = first + second/10;
                arr = arr.splice(2);
            }
        }
        return arr.reduce(filterThreshold, []);

        function filterThreshold(running, kanji){
            if (visuallySimilarData[kanji] === undefined) return running; // ignore trash input
            for (var data of visuallySimilarData[kanji]){
                if (data.score >= threshold) running.push(data.kan);
            }
            return running;
        }
    }

    // Adds the filter to wkof
    function register_filter(data) {
        wkof.ready('ItemData.registry').then(()=>{
            wkof.ItemData.registry.sources.wk_items.filters.include_visually_similar_kanji = {
                filter_func: function(filter_value, item){if (item.object === "kanji") item.visually_similar_kanji = visuallySimilarData[item.data.characters]; return true;}
            };
            wkof.ItemData.registry.sources.wk_items.filters.visually_similar_kanji = {
                type: 'text',
                label: 'LY Visually Similar',
                placeholder: '0.5,人、能、力',
                hover_tip: 'Select the kanji whose similar kanji you want to study.\nMultiple search terms are separated by commas.\n\n'+
                           'You may specify a similarity threshold as as a real number\nbetween 0 and 1 at the beginning of the search terms.\n'+
                           '0 means all similar kanji. Higher numbers give fewer kanji.\n\nThis filter uses similarity data by Lars Yencken.',
         		default: '',
		     	filter_func: function (filterValue, item){return (item.object === 'kanji' && filterValue.indexOf(item.data.characters) >= 0);},
                filter_value_map: makeVisuallySimilarArrays,
            };
            wkof.set_state(script_id, 'ready');
        });
    }

    // startup
    get_data();
    register_filter();
    wkof.include('Settings');
    wkof.ready('Settings')
        .then(function(){return wkof.Settings.load(script_id);})
        .then(ageCache);

})(window.wkof);
