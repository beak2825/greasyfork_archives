// ==UserScript==
// @name          Wanikani DotDotDot Expander
// @namespace     https://www.wanikani.com
// @description   Expand Wanikani "..." in English translations
// @version       3.0.2
// @include       https://www.wanikani.com/*
// @exclude       https://www.wanikani.com/lesson*
// @exclude       https://www.wanikani.com/review*
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/36925/Wanikani%20DotDotDot%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/36925/Wanikani%20DotDotDot%20Expander.meta.js
// ==/UserScript==

// Original by Takuya Kobayashi
// Original location: https://greasyfork.org/en/scripts/5584-wanikani-dotdotdot-expander

// Repaired by Robin Findley

window.dot_expander = {};

(function (gobj) {

    /* global $, wkof, Search */
    /* eslint no-multi-spaces: "off" */

    //===================================================================
    // Initialization of the Wanikani Open Framework.
    //-------------------------------------------------------------------
    var script_name = 'DotDotDot Expander';
    if (!window.wkof) {
        if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }

    wkof.include('ItemData');
    wkof.ready('document,ItemData').then(load_data).then(dotExpand);

    var by_slug = {rad:{}, kan:{}, voc:{}};
    gobj.by_slug = by_slug;

    // Load Wanikani items and index by type and slug.
    function load_data() {
        var original_max_level = wkof.user.subscription.max_level_granted;
        wkof.user.override_max_level = 999;
        return wkof.ItemData.get_items().then(function(items){
            by_slug.rad = wkof.ItemData.get_index(items.filter(item => item.object === 'radical'), 'slug');
            by_slug.kan = wkof.ItemData.get_index(items.filter(item => item.object === 'kanji'), 'slug');
            by_slug.voc = wkof.ItemData.get_index(items.filter(item => item.object === 'vocabulary'), 'slug');
            wkof.user.subscription.max_level_granted = original_max_level;
        });
    }

    // Hook into the search results.
    (function () {
        var removeResults;
        if (typeof Search === 'object' && typeof Search.removeResults === 'function') {
            removeResults = Search.removeResults;
            Search.removeResults = function () {
                dotExpand();
                removeResults();
            };
        }
    }());

    function dotExpand() {
        ['.single-character-grid','.multi-character-grid'].forEach(function(sel,grid_type){
            $(sel+' .character-item li:contains("...")').each(function(idx,elem){
                var enLi = $(elem);
                var a = enLi.closest('a');
                var itype = a.attr('href').split('/')[1].slice(0,3);
                var slug = (itype === 'rad' ? a.attr('href').split('/')[2] : a.find('.character').text().replace(/[\n ]+/g,''));
                var item = by_slug[itype][slug];
                if (item === undefined) {
                    console.log('[DotDotDot Expander] Item not found:  type="'+itype+'", slug="'+slug+'"');
                    return;
                }
                var enFull = item.data.meanings.filter(m => m.primary)[0].meaning;
                if (enFull) {
                    if (grid_type === 0) {
                        enLi.attr('title',enFull);
                    } else {
                        enLi.text(enFull);
                    }
                } else {
                    console.log('[DotDotDot Expander]: No expansion found for '+itype+'+ "'+slug+'"');
                }
            });
        });
    }

    gobj.expand = dotExpand;

})(window.dot_expander);
