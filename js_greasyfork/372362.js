// ==UserScript==
// @name		WKOF Genki1 Filter
// @namespace   rfindley
// @description Filter Wanikani items by Genki chapter.
// @version 	1.0.0
// @include 	https://www.wanikani.com/*
// @copyright   2018+, Robin Findley
// @license 	MIT; http://opensource.org/licenses/MIT
// @run-at  	document-end
// @grant   	none
// @downloadURL https://update.greasyfork.org/scripts/372362/WKOF%20Genki1%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/372362/WKOF%20Genki1%20Filter.meta.js
// ==/UserScript==

(function() {

    wkof.ready('ItemData').then(install_filters);

    var kanji_by_genki1_chapter = {
        1: ['人', '山'],
        2: [],
        3: [],
    };
    var vocabulary_by_genki1_chapter = {
        1: ['学校', '先生'],
        2: [],
        3: ['行く','帰る','聞く','飲む','話す','読む','起きる','食べる','寝る','見る','来る','勉強する'],
        4: ['会う',''],
    };

	function split_list(str) {return str.replace(/^\s+|\s*(,)\s*|\s+$/g, '$1').split(',').filter(function(name) {return (name.length > 0);});}

    function install_filters() {
        wkof.ItemData.registry.sources.wk_items.filters.genki1_chapter = {
            type: 'text',
            label: 'Genki 1 Chapters',
            hover_tip: 'A comma-separated list of Genki Chapters to include.',
            default:'1',
            filter_value_map: split_list,
            filter_func: is_in_genki1_chapter
        };
    }

    function invert(items_by_chapter) {
        var items_list = [];
        var chapters = Object.keys(items_by_chapter);
        chapters.forEach(function(chapter) {
            chapter = Number(chapter);
            var items = items_by_chapter[chapter];
            items.forEach(function(item) {
                items_list[item] = chapter
            });
        });
        return items_list;
    }

    var genki1_lists = {
        kanji: invert(kanji_by_genki1_chapter),
        vocabulary: invert(vocabulary_by_genki1_chapter)
    };

    function is_in_genki1_chapter(chapter_list, item) {
        var list = genki1_lists[item.object];
        if (!list) return false;
        var chapter = list[item.data.slug];
        if (!chapter) return false;
        return true;
    }

})();