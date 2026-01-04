// ==UserScript==
// @name        Wanikani Item List Filter (for Self-Study Quiz)
// @namespace   rfindley
// @description Select specific items (for Self-Study Quiz)
// @version     1.1.0
// @match       https://www.wanikani.com/*
// @match       https://preview.wanikani.com/*
// @copyright   2018+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/409955/Wanikani%20Item%20List%20Filter%20%28for%20Self-Study%20Quiz%29.user.js
// @updateURL https://update.greasyfork.org/scripts/409955/Wanikani%20Item%20List%20Filter%20%28for%20Self-Study%20Quiz%29.meta.js
// ==/UserScript==

window.item_list_filter = {};

(function(gobj) {

    /* global $, wkof */
    /* eslint no-multi-spaces: "off" */

    //===================================================================
    // Initialization of the Wanikani Open Framework.
    //-------------------------------------------------------------------
    var script_name = 'Items List Filter (for Self-Study Quiz)';
    var wkof_version_needed = '1.1.3';
    if (!window.wkof) {
        if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }
    if (wkof.version.compare_to(wkof_version_needed) === 'older') {
        if (confirm(script_name+' requires Wanikani Open Framework version '+wkof_version_needed+'.\nDo you want to be forwarded to the update page?')) {
            window.location.href = 'https://greasyfork.org/en/scripts/38582-wanikani-open-framework';
        }
        return;
    }

    wkof.include('ItemData');
    wkof.ready('ItemData').then(startup);

    //-------------------------------------------------------------------
    function split_list(str) {return str.replace(/、/g,',').replace(/[\s　]+/g,' ').trim().replace(/ *, */g, ',').split(',').filter(function(name) {return (name.length > 0);});}

    //--[ Radicals ]-----------------------------------------------------
    var radical_list = [];
    function radical_filter(filter_value, item) {return (item.object !== 'radical') || (radical_list.indexOf(item.data.slug) >= 0);};
    function radical_filter_map(filter_value) {radical_list = split_list(filter_value);};

    //--[ Kanji ]--------------------------------------------------------
    var kanji_list = [];
    function kanji_filter(filter_value, item) {return (item.object !== 'kanji') || (kanji_list.indexOf(item.data.slug) >= 0);};
    function kanji_filter_map(filter_value) {kanji_list = split_list(filter_value);};

    //--[ Vocabulary ]---------------------------------------------------
    var vocabulary_list = [];
    function vocabulary_filter(filter_value, item) {return (item.object !== 'vocabulary') || (vocabulary_list.indexOf(item.data.slug) >= 0);};
    function vocabulary_filter_map(filter_value) {vocabulary_list = split_list(filter_value);};

    //--[ Kana Vocabulary ]---------------------------------------------------
    var kana_vocabulary_list = [];
    function kana_vocabulary_filter(filter_value, item) {return (item.object !== 'kana_vocabulary') || (kana_vocabulary_list.indexOf(item.data.slug) >= 0);};
    function kana_vocabulary_filter_map(filter_value) {kana_vocabulary_list = split_list(filter_value);};

    //===================================================================
    function startup() {
        wkof.ItemData.registry.sources.wk_items.filters.radical_list = {
            label: 'Radical List',
            type: 'text',
            default:'',
            placeholder: 'big, small',
            filter_func: radical_filter,
            filter_value_map: radical_filter_map,
            hover_tip: 'Enter a list of comma-separated radicals (in English)'
        };
        wkof.ItemData.registry.sources.wk_items.filters.kanji_list = {
            label: 'Kanji List',
            type: 'text',
            default:'',
            placeholder: '大, 小',
            filter_func: kanji_filter,
            filter_value_map: kanji_filter_map,
            hover_tip: 'Enter a list of comma-separated kanji'
        };
        wkof.ItemData.registry.sources.wk_items.filters.vocabulary_list = {
            label: 'Vocabulary List',
            type: 'text',
            default:'',
            placeholder: '大きい, 小さい',
            filter_func: vocabulary_filter,
            filter_value_map: vocabulary_filter_map,
            hover_tip: 'Enter a list of comma-separated vocabulary'
        };
        wkof.ItemData.registry.sources.wk_items.filters.kana_vocabulary_list = {
            label: 'Kana Vocabulary List',
            type: 'text',
            default:'',
            placeholder: 'はい, いいえ',
            filter_func: kana_vocabulary_filter,
            filter_value_map: kana_vocabulary_filter_map,
            hover_tip: 'Enter a list of comma-separated kana vocabulary'
        };

        wkof.set_state('item_list_filter', 'ready');
    }

})(window.item_list_filter);