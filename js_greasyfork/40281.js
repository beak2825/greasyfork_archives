// ==UserScript==
// @name        Wanikani All Vocab in lessons
// @namespace   necroNET
// @description Displays all vocab words in lessons
// @version     1.0.0
// @include     https://www.wanikani.com/lesson/session
// @copyright   2018+, Necroskillz
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40281/Wanikani%20All%20Vocab%20in%20lessons.user.js
// @updateURL https://update.greasyfork.org/scripts/40281/Wanikani%20All%20Vocab%20in%20lessons.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (!wkof) {
        alert('[Wanikani All Vocab in lessons] script requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
        window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }

    var loaded;

    wkof.include('ItemData');
    wkof.ready('ItemData').then(startup);

    function startup() {
        $.jStorage.listenKeyChange('l/currentLesson', load);
        load();
    }

    function getVocab() {
        return wkof.ItemData.get_items({
            wk_items: {
                filters: {
                    item_type: { value: ['voc'] }
                }
            }
        });
    }

    function load() {
        var current = $.jStorage.get('l/currentLesson');
        if (!current.kan) {
            return;
        }

        if (loaded && current.kan === loaded.kan) {
            return;
        }

        loaded = current;

        getVocab().then(function (data) {
            var relevantVocab = data.filter(function (v) { return v.data.characters.indexOf(current.kan) !== -1; });

            relevantVocab.forEach(function (vocab) {
                var data = vocab.data;
                if (!current.vocabulary.some(function (v) { return v.slug === data.slug; })) {
                    current.vocabulary.push({
                        en: data.meanings.find(function (m) { return m.primary; }).meaning,
                        ja: data.readings.find(function (m) { return m.primary; }).reading,
                        voc: data.characters,
                        slug: data.slug
                    });
                }
            });

            $.jStorage.set('l/currentLesson', current);
        });
    }

})();