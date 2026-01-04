// ==UserScript==
// @name         Wanikani Part-of-Speech Filter
// @namespace    rfindley
// @description  Part-of-Speech filter for Wanikani Open Framework
// @version      1.0.1
// @include      https://www.wanikani.com/*
// @copyright    2018+, Robin Findley
// @license      MIT; http://opensource.org/licenses/MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376095/Wanikani%20Part-of-Speech%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/376095/Wanikani%20Part-of-Speech%20Filter.meta.js
// ==/UserScript==

window.pos_filter = {};

(function(gobj) {

    /* global $, wkof */

    // Only load if Open Framework is installed.
    if (!window.wkof) return

    wkof.ready('ItemData')
        .then(GetPartsOfSpeech)
        .then(AddFilter);

    var parts_of_speech = {};

    // Extract the list of parts of speech from all vocabulary.
    function GetPartsOfSpeech()
    {
        return wkof.ItemData.get_items().then(function(items) {
            var pos_list = {};
            for (var item_idx in items) {
                var item = items[item_idx];
                if (item.object !== 'vocabulary') continue;
                var item_pos = item.data.parts_of_speech;
                for (var pos_idx in item_pos) {
                    pos_list[item_pos[pos_idx]] = 1;
                }
            }
            pos_list = Object.keys(pos_list).sort();
            for (pos_idx in pos_list) {
                var pos = pos_list[pos_idx];
                parts_of_speech[pos] = pos;
            }
            return parts_of_speech;
        });
    }

    // Add the filter to the Open Framework registry.
    function AddFilter() {
        wkof.ItemData.registry.sources.wk_items.filters.part_of_speech = {
            type: 'multi',
            label: 'Part of speech',
            content: parts_of_speech,
            default: [],
            filter_func: function(filter_value, item){
                window.filter_value = filter_value;
                if (item.object !== 'vocabulary') return false;
                var item_pos = item.data.parts_of_speech;
                for (var pos_idx in item_pos) {
                    var pos = item_pos[pos_idx];
                    if (filter_value[pos]) return true;
                }
                return false;
            },
            hover_tip: 'Filter by part of speech (noun, i-adjective, ...)',
        };

        wkof.set_state('pos_filter', 'ready');
    }

})(window.pos_filter);
