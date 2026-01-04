// ==UserScript==
// @name        Wanikani Show Item Level
// @namespace   barbaruiva
// @author      barbaruiva
// @contributor mcheung0
// @description Shows the current item level during a review session - V2 replaces jStorage with event listener
// @version     2.0
// @match       https://www.wanikani.com/subjects/review
// @copyright   2019+
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/463280/Wanikani%20Show%20Item%20Level.user.js
// @updateURL https://update.greasyfork.org/scripts/463280/Wanikani%20Show%20Item%20Level.meta.js
// ==/UserScript==

window.timeline = {};

(function(gobj) {

    /* global $, wkof */

    //===================================================================
    // Initialization of the Wanikani Open Framework.
    //-------------------------------------------------------------------
    var script_name = 'Wanikani Show Item Level';
    var wkof_version_needed = '1.0.27';
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

    var currentItem = null;
    var allItems;

    var colors = {
        current: {
            dark: '#99001f',
            light: '#f03'
        },
        lower: {
            dark: '#7ab700',
            light: '#af0'
        }
    }

    wkof.include('ItemData');
    wkof.ready('ItemData').then(fetch_items);

    function fetch_items() {
        console.log("fetching items");
        var config = {
            wk_items: {
                options: {subjects: true},
                filters: {
                    level: '1..+0' // Everything up to current level
                }
            }
        };

        wkof.ItemData.get_items(config).then(process_items);
    }

    function process_items(data) {
        allItems = data;
        show_item_level();
    }

    function show_item_level() {
        if (!allItems || !currentItem) {
            return;
        }
        var type_index = wkof.ItemData.get_index(allItems, 'item_type');
        var a = wkof.ItemData.get_index(type_index[currentItem.subject.type.toLowerCase()], 'subject_id')[currentItem.subject.id];
        if(a){
            var item_data = a.data;
            changeItemLevel(item_data.level);
        }
    }

    window.addEventListener('willShowNextQuestion', e => {

        Promise.resolve().then(_ => {
            currentItem = e.detail;
            show_item_level();
        });

    });

    function changeItemLevel(newLevel) {
        var display_id = 'WSIL_LevelDisplay';
        var display_element = document.getElementById(display_id);
        if (!display_element) {
            console.log("display_element not found");
            var elQuestionType = document.getElementsByClassName('quiz-input__question-type')[0];
            if (!elQuestionType) {
                return;
            }

            elQuestionType.innerHTML = '<span id="' + display_id + '">Lv. ??</span> ' + elQuestionType.innerHTML;
            console.log("building element");
            display_element = document.getElementById(display_id);
        }

        display_element.innerHTML = "Lv. " + newLevel;
        var colorLevel = newLevel == wkof.user.level ? 'current' : 'lower';
        display_element.style = 'background-color: '+colors[colorLevel].dark+';border: 1px solid; text-shadow: none; padding: 4px;border-radius: 5px;border-color: '+colors[colorLevel].light+';color: white;font-weight: bold;';
    }

    console.log("WSIL v2.0 loaded");
})();
