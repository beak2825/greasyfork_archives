// ==UserScript==
// @name         WaniKani Kanji Review Vocabulary List
// @namespace    http://kurifuri.com/
// @version      1.2.1
// @description  Displays vocabulary words when reviewing kanji on WaniKani.
// @author       Christopher Fritz
// @match        https://www.wanikani.com/subjects/review
// @match        https://www.wanikani.com/subjects/extra_study*
// @run-at       document-end
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/429677/WaniKani%20Kanji%20Review%20Vocabulary%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/429677/WaniKani%20Kanji%20Review%20Vocabulary%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* global wkof */

    wkof.include('ItemData, Menu, Settings');
	wkof.ready('document,ItemData,Menu,Settings').then(load_settings).then(startup);

    let settings;

    function load_settings() {
        let defaults = {
            show_for_meaning_review: true,
            show_for_reading_review: true,
            show_for_kunyomi: true,
            show_for_onyomi: true,
            show_for_nanori: true,
            match_vocab_reading_to_kanji_answer: true,
            match_geminated_readings: true,
            max_vocab_to_show: 10,
            show_locked_vocabulary: true,
            blur_vocab_list: false
        };

        return wkof.Settings.load('wkkrvl', defaults).then(function(data) {
            settings = wkof.settings.wkkrvl;

            // Migrate settings from localStorage if present
            const key = 'kf-wkkrvl-settings';

            let old_settings = {};

            if (localStorage.getItem(key) != null) {
                old_settings = JSON.parse(localStorage.getItem(key));

                localStorage.removeItem(key);

                settings.show_for_meaning_review = old_settings.show_for_meaning_review;
                settings.show_for_reading_review = old_settings.show_for_reading_review;
                settings.show_for_kunyomi = old_settings.show_for_kunyomi;
                settings.show_for_onyomi = old_settings.show_for_onyomi;
                settings.show_for_nanori = old_settings.show_for_nanori;
                settings.match_vocab_reading_to_kanji_answer = old_settings.match_vocabulary_reading_to_kanji_answer;
                settings.max_vocab_to_show = old_settings.max_vocabulary_to_show;
                settings.show_locked_vocabulary = old_settings.show_locked_vocabulary;
                settings.blur_vocab_list = old_settings.blur_vocabulary_list;

                wkof.Settings.save('wkkrvl');
            }
        });
    }

    function open_settings() {
        let dialog = new wkof.Settings({
            script_id: 'wkkrvl',
            title: 'WaniKani Kanji Review Vocabulary List',
            on_save: save_settings,
            content: {
                tabs: {type: 'tabset', content: {
                    pgMain: {type: 'page', label: 'Options', hover_tip: 'Settings for the script.', content: {
                        grpReviewTypes: {type: 'group', label: 'Show Vocabulary Words', content: {
                            show_for_meaning_review: {type: 'checkbox', label: 'For Meaning Questions', default: true, hover_tip: 'Show vocabulary list under review questions when asked to give the meaning.'},
                            show_for_reading_review: {type: 'checkbox', label: 'For Reading Questions', default: true, hover_tip: 'Show vocabulary list under review questions when asked to give the reading.'},
                            show_for_kunyomi: {type: 'checkbox', label: 'For Kunyomi', default: true, hover_tip: 'Show vocabulary using the kunyomi reading.'},
                            show_for_onyomi: {type: 'checkbox', label: 'For Onyomi', default: true, hover_tip: 'Show vocabulary using the onyomi reading.'},
                            show_for_nanori: {type: 'checkbox', label: 'For Nanori', default: true, hover_tip: 'Show vocabulary using the nanori reading.'}
                        }},
                        grpAdditional: {type: 'group', label: 'Additional Settings', content: {
                            match_vocab_reading_to_kanji_answer: {type: 'checkbox', label: 'Limit Vocabulary to Reading WaniKani Wants', default: true, hover_tip: 'Show only vocabulary that uses the reading WaniKani is asking for.'},
                            match_geminated_readings: {type: 'checkbox', label: 'Include Vocabulary Matching Geminated Variant', default: true, hover_tip: 'Include vocabulary matches for geminated readings, e.g. how 学（がく）changes to がっ in 学校.'},
                            max_vocab_to_show: {type: 'number', label: 'Max Number of Vocabulary Words', default: 10, min: 1, max: 100, hover_tip: 'The maximum number of vocabulary words to show when the list is displayed. Between 1 and 100.'},
                            show_locked_vocabulary: {type: 'checkbox', label: 'Show Locked Vocabulary', default: true, hover_tip: 'Shows vocabulary words that you have not unlocked yet.'},
                            blur_vocab_list: {type: 'checkbox', label: 'Blur Vocabulary List', default: false, hover_tip: 'Blurs vocabulary words until you hover over the list.'}
                        }}
                    }}
                }}
            }
        });

        dialog.open();
    }

    function save_settings() {
        clear_vocabulary();
        fetch_items();
    }

    function startup() {
        install_css();
        install_menu();
        fetch_items();

        // Set up an observer on the character div.  When observing the text changing, update the vocabulary list.
        var target = document.querySelector('div[data-quiz-header-target=characters]');
        var observer = new MutationObserver(function(mutations) {
            clear_vocabulary();
            fetch_items();
        });
        var observer_config = { attributes: true, childList: true, characterData: true };
        observer.observe(target, observer_config);
    }

    let list_css = `
        #kf-wkkrvl-vocabulary-list {padding: 0.5em; text-align: center; position: relative;}
        #kf-wkkrvl-vocabulary-list span {padding: 0.5em 0.75em; font-size: 3em; word-break: keep-all;}
        #kf-wkkrvl-vocabulary-list .blur {color: transparent; text-shadow: 0 0 32px rgba(0,0,0,0.5);}
        #kf-wkkrvl-vocabulary-list:hover .blur {color: inherit; text-shadow: none;}
    `

    function install_css() {
        document.head.insertAdjacentHTML('beforeend', '<style type="text/css">' + list_css + '</style>');
    }

    function install_menu() {
        wkof.Menu.insert_script_link({name:'wkkrvl',submenu:'Settings',title:'Kanji Review Vocabulary List',on_click:open_settings});
    }

    function fetch_items() {
        let srs_stages = [0,1,2,3,4,5,6,7,8,9];
        if (settings.show_locked_vocabulary) { srs_stages.push(-1); }
        var item_config = { wk_items: { options: {assignments: true}, filters: {srs: srs_stages} } };
        wkof.ItemData.get_items(item_config).then(process_items);
    }

    function load_subjects_from_queue() {
        const subjects_json = document.querySelector('script[data-quiz-queue-target=subjects]').innerHTML;
        const subjects = JSON.parse(subjects_json);
        return subjects;
    }

    function process_items(items) {
        // Index the 'items' array by item_type.
        var type_index = wkof.ItemData.get_index(items, 'item_type');
        var kan = type_index.kanji;
        var voc = type_index.vocabulary;

        var kanji_by_name = wkof.ItemData.get_index(kan, 'slug');
        var voc_by_sid = wkof.ItemData.get_index(voc, 'subject_id');

        const character_element = document.querySelector('div[data-quiz-header-target=characters]');
        // Leave if this isn't kanji.
        if (!character_element.parentNode.parentNode.classList.contains('character-header--kanji')) {
            return;
        }

        const character = character_element.textContent;

        // Get the element where vocabulary words are shown.
        let vocabulary_element = document.getElementById('kf-wkkrvl-vocabulary-list');
        if (vocabulary_element == null || vocabulary_element.value === '') {
            // If the element does not exist yet, create it.
            vocabulary_element = document.createElement('div');
            vocabulary_element.id = 'kf-wkkrvl-vocabulary-list';
            const quiz_element = document.querySelector('div[class=quiz-input]');
            quiz_element.parentNode.insertBefore(vocabulary_element, quiz_element);
        }

        const question_type = document.querySelector('span[data-quiz-input-target=questionType]').textContent;
        if (question_type === 'meaning' && !settings.show_for_meaning_review) {
            return;
        }

        const subjects = load_subjects_from_queue();
        const current_item = subjects.find(s => { return s.type === 'Kanji' && s.characters === character});
        if (current_item === undefined) {
            return;
        }

        let reading_type = current_item.primary_reading_type;
        let is_reading_review = (question_type === 'reading');
        if (is_reading_review) {
            if (!settings.show_for_reading_review) {
                return;
            }
            if (!settings.show_for_kunyomi && reading_type === 'kunyomi') {
                return;
            }
            if (!settings.show_for_onyomi && reading_type === 'onyomi') {
                return;
            }
            if (!settings.show_for_nanori && reading_type === 'nanori') {
                return;
            }
        }

        // Get the current review's kanji.
        let current_kanji = current_item.characters;
        // Get the subject ID's for this kanji's vocabulary.
        if (kanji_by_name[current_kanji] == null) { return; }
        let vocabulary_sids = kanji_by_name[current_kanji].data.amalgamation_subject_ids;
        // Get the vocabulary words for these subject ID's.
        let vocabulary_words = [];

        for (const sid of vocabulary_sids) {
            if (voc_by_sid[sid] == null) { continue; }

            // Hide vocabulary if the reading doesn't match the expected kanji reading.
            if (is_reading_review && settings.match_vocab_reading_to_kanji_answer && !readings_match(kanji_by_name[current_kanji], voc_by_sid[sid], reading_type)) {
                continue;
            }
            vocabulary_words.push(`<span lang="ja"${settings.blur_vocab_list ? ' class="blur"' : ''}>` + voc_by_sid[sid].data.slug + '</span>\n');
            if (vocabulary_words.length >= settings.max_vocab_to_show) { break; }
        }

        // Show the vocabulary words.
        vocabulary_element.innerHTML = vocabulary_words.join('');
    }

    function readings_match(kanji, vocabulary, reading_type) {
        for (const kanji_reading of kanji.data.readings) {
            // Only check kanji for the reading type being accepted as an answer.
            if (kanji_reading.type !== reading_type) {continue;}

            let no_dakuten_kanji_reading = remove_dakuten(kanji_reading.reading);
			let geminated_kanji_reading = apply_gemination(kanji_reading.reading);
            for (const vocabulary_reading of vocabulary.data.readings) {
                // check for rendaku (initial mora changes to voiced variation)
                // also checks for rare instance where a voiced mora devoices in the vocabulary (e.g. 自（じ）changes to し in 自然（しぜん）)
                // a downside to this is if the kanji reading is different but still included in the vocabulary reading it will match
                // e.g. 仮 has an on'yomi か but a kun'yomi of かり. These are not matches but the below will treat them as a match
                // or if the reading appears in the vocab due to the reading of another kanji being the same (or the same w/o dakuten)
                if (remove_dakuten(vocabulary_reading.reading).includes(no_dakuten_kanji_reading)) {
                    return true;
                }

                // check for gemination (final mora changes to っ or っ is added on)
                if (settings.match_geminated_readings && vocabulary_reading.reading.includes(geminated_kanji_reading)) {
                    return true;
                }
            }
        }
        return false;
    }

    // Removes dakuten and handakuten.  This is necessary when filtering to show only vocabulary words whose kanji
    // shares the reading WaniKani expects to be entered for the kanji reading, as some vocabulary words use a
    // dakuten version of the reading.
    function remove_dakuten(input) {
        return input.normalize('NFD').replaceAll('\u3099', '').replaceAll('\u309A', '');
    }

    // Function comes from WaniKani userscript, ConfusionGuesser, by Sinyaven and licensed under MIT-0
    function apply_gemination(reading) {
        let replacementGemination = "ちつくき".includes(reading.substr(-1));
		return replacementGemination ? reading.substr(0, reading.length - 1) + "っ" : reading + "っ";
    }

    function clear_vocabulary() {
        let vocabulary_element = document.getElementById('kf-wkkrvl-vocabulary-list');
        if (vocabulary_element != null) {
            // Clear out any old vocabulary words.
            vocabulary_element.innerHTML = "";
        }
    }
})();
