// ==UserScript==
// @name         WaniKani Quick Answers
// @namespace    quick-answers
// @version      1.4.2
// @description  Popup to display the answers and more
// @author       Mystery
// @match        https://www.wanikani.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510740/WaniKani%20Quick%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/510740/WaniKani%20Quick%20Answers.meta.js
// ==/UserScript==

(function() {
    /* global wkof */
    'use strict';

    if (!window.wkof) {
        if (confirm('Better Lesson Picker requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }

    const scriptId = 'quickAnswers';

    let settings, indexedItemData, answerContainer, breakdownContainer, partOfSpeechContainer, infoPopup;
    let infoSet = false;
    const hiraToKata = {"め": "メ", "む": "ム", "ゃ": "ャ", "も": "モ", "ゅ": "ュ", "や": "ヤ", "ょ": "ョ", "ゆ": "ユ", "ら": "ラ", "よ": "ヨ", "る": "ル", "り": "リ", "ろ": "ロ", "れ": "レ", "わ": "ワ", "ん": "ン", "を": "ヲ", "あ": "ア", "い": "イ", "う": "ウ", "え": "エ", "か": "カ", "お": "オ", "き": "キ", "が": "ガ", "く": "ク", "ぎ": "ギ", "け": "ケ", "ぐ": "グ", "こ": "コ", "げ": "ゲ", "さ": "サ", "ご": "ゴ", "し": "シ", "ざ": "ザ", "す": "ス", "じ": "ジ", "せ": "セ", "ず": "ズ", "そ": "ソ", "ぜ": "ゼ", "た": "タ", "ぞ": "ゾ", "ち": "チ", "だ": "ダ", "っ": "ッ", "ぢ": "ヂ", "づ": "ヅ", "つ": "ツ", "で": "デ", "て": "テ", "ど": "ド", "と": "ト", "に": "ニ", "な": "ナ", "ね": "ネ", "ぬ": "ヌ", "は": "ハ", "の": "ノ", "ぱ": "パ", "ば": "バ", "び": "ビ", "ひ": "ヒ", "ふ": "フ", "ぴ": "ピ", "ぷ": "プ", "ぶ": "ブ", "べ": "ベ", "へ": "ヘ", "ほ": "ホ", "ぺ": "ペ", "ぽ": "ポ", "ぼ": "ボ", "み": "ミ", "ま": "マ"};

    let mainLoaded = false;
    wkof.on_pageload(
        [
            /\/subjects\/review.*\/?$/,
            /\/subject-lessons\/[\d-]+\/quiz.*\/?$/,
            /\/recent-mistakes\/[\d-]+\/quiz.*\/?$/,
            /\/subjects\/extra_study.*$/,
        ],
        main,
        unloadMain,
    );

    wkof.on_pageload(
        [
            '/',
            '/dashboard'
        ],
        installSettingsMenu,
    );

    function unloadMain() {
        mainLoaded = false;
    }

    async function installSettingsMenu() {
        await loadSettings();
        wkof.include('Menu');
        await wkof.ready('Menu');
        wkof.Menu.insert_script_link({
            name:      'quick_answers',
            title:     'Quick Answers',
            submenu:   'Settings',
            on_click:  open_settings,
        });
    }

    function open_settings() {
        const config = {
            script_id: scriptId,
            title: 'Quick Answers',
            content: {
                displayGroup: {
                    type: 'group',
                    label: 'Display',
                    content: {
                        show_on_wrong: {
                            type: 'checkbox',
                            label: 'Show On Wrong Answer',
                        },
                        show_on_correct: {
                            type: 'checkbox',
                            label: 'Show On Correct Answer',
                        },
                        show_on_multiple: {
                            type: 'checkbox',
                            label: 'Show On Multiple Answers Available',
                        },
                        show_on_bit_off: {
                            type: 'checkbox',
                            label: 'Show On Your Answer was a bit off',
                        },
                        alt_kanji_readings: {
                            type: 'checkbox',
                            label: 'Also Show Alternative Kanji Readings',
                        },
                        toggle_key: {
                            type: 'input',
                            label: 'Toggle Quick Answer Key',
                        }
                    }
                },
                breakdownGroup: {
                    type: 'group',
                    label: 'Breakdown',
                    content: {
                        show_breakdown: {
                            type: 'checkbox',
                            label: 'Show Breakdown',
                        },
                        show_part_of_speech: {
                            type: 'checkbox',
                            label: 'Show Word type',
                        },
                        breakdown_all_meanings: {
                            type: 'checkbox',
                            label: 'Show All Meanings in Breakdown',
                        },
                    }
                },
                miscGroup: {
                    type: 'group',
                    label: 'Misc',
                    content: {
                        katakana_onyomi: {
                            type: 'checkbox',
                            label: 'Use Katakana for Onyomi',
                        },
                        hide_popup: {
                            type: 'checkbox',
                            label: 'Hide Info Popup',
                        },
                    }
                }
            }
        }

        const dialog = new wkof.Settings(config);
        dialog.open();
    }

    async function loadSettings() {
        const defaults = {
            show__on_wrong: false,
            show_on_correct: false,
            show_on_multiple: true,
            show_on_bit_off: false,
            alt_kanji_readings: false,
            show_breakdown: true,
            show_part_of_speech: true,
            breakdown_all_meanings: true,
            katakana_onyomi: true,
            hide_popup: false,
            toggle_key: 'a',
        };

        wkof.include('Settings');
        await wkof.ready('Settings')
        settings = await wkof.Settings.load(scriptId, defaults);
    }

    async function loadItemData() {
        wkof.include('ItemData');
        await wkof.ready('ItemData');
        await wkof.ItemData.get_items()
            .then((items) => {
            indexedItemData = wkof.ItemData.get_index(items, 'subject_id');
        });
    }

    async function main() {
        if (mainLoaded) {
            return;
        }
        mainLoaded = true;
        await loadSettings();
        if (settings.show_breakdown) {
            await loadItemData();
            insertCss();
            addBreakdownContainer();
        }
        addAnswerContainer();
        setInfoPopup();
        addEventListeners();
    }

    function insertCss() {
        document.head.insertAdjacentHTML('beforeend',`
        <style name="quick_answers" type="text/css">
            .character-header__characters {
                margin-left: 20px;
                margin-right: 20px;
            }
            .qa-character-wrapper {
                width: 100%;
                display: flex;
            }
            .qa-info-container {
                flex: 1;
                margin-bottom: 16px;
                display: flex;
                max-height: 120px;
            }
            .qa-part-of-speech-container {
                align-items: center;
                justify-content: right;
                line-height: 24px;
                font-size: 20px;
            }
            .qa-breakdown-container {
                flex-direction: column;
                justify-content: center;
                gap: 7px;
            }
            .qa-item-container {
                display: flex;
                cursor: pointer;
                width: fit-content;
                font-size: 22px;
            }
            .qa-item-container.qa-radical:hover {
                color: var(--color-radical);
            }
            .qa-item-container.qa-kanji:hover {
                color: var(--color-kanji);
            }
            .qa-radical-image-container {
                width: 22px;
                display: inline-flex;
            }
            .qa-item-container.radical:hover .qa-radical-image {
                --color-text: var(--color-radical);
            }
            .qa-radical-image {
                flex: 0 0 22px;
                --color-text: white;
            }
        </style>
        `);

    }

    function addAnswerContainer() {
        answerContainer = document.createElement('div');
        answerContainer.className = 'quiz-input__input';
        answerContainer.style.display = 'none';
        document.querySelector('#user-response').after(answerContainer);
    }

    function addBreakdownContainer() {
        const wrapper = document.createElement('div');
        wrapper.className = 'qa-character-wrapper';
        partOfSpeechContainer = document.createElement('div');
        partOfSpeechContainer.className = 'qa-part-of-speech-container qa-info-container';
        partOfSpeechContainer.style.visibility = 'hidden';
        const characters = document.querySelector('.character-header__characters');
        breakdownContainer = document.createElement('div');
        breakdownContainer.className = 'qa-breakdown-container qa-info-container';
        breakdownContainer.style.visibility = 'hidden';
        characters.before(wrapper);
        wrapper.append(partOfSpeechContainer, characters, breakdownContainer);
    }

    function setInfoPopup() {
        if (settings.hide_popup) {
            infoPopup = document.querySelector('.answer-exception');
        }
    }

    function addEventListeners() {
        window.addEventListener('didAnswerQuestion', handleDidAnswerQuestion);
        window.addEventListener('willShowNextQuestion', handleWillShowNextQuestion);
        window.addEventListener('didUnanswerQuestion', handleDidUnanswerQuestion);
    }

    function handleDidAnswerQuestion(event) {
        setInfo(event);

        if (shouldShow(event)) {
            toggleOn();
        } else {
            document.addEventListener('keydown', handleKeyDown);
        }
    }

    function setInfo(event) {
        if (!infoSet) {
            setAnswer(event);
            if (settings.show_breakdown) {
                setBreakdown(event);
                if (settings.show_part_of_speech) {
                    setPartOfSpeech(event);
                }
            }
            infoSet = true;
        }
    }

    function handleWillShowNextQuestion() {
        clearInfo();
        reset();
    }

    function handleDidUnanswerQuestion() {
        reset();
    }

    function clearInfo() {
        answerContainer.innerText = '';
        if (settings.show_breakdown) {
            breakdownContainer.innerHTML = '';
            if (settings.show_part_of_speech) {
                partOfSpeechContainer.innerText = '';
            }
        }
        infoSet = false;
    }

    function reset() {
        toggleOff();

        if (settings.hide_popup) {
            infoPopup.style.display = 'block';
        }
        document.removeEventListener('keydown', handleKeyDown);
    }

    function shouldShow(event) {
        const results = event.detail.results;

        if (results.action == 'fail') {
            if (settings.show_on_wrong) {
                hidePopup();
                return true;
            }
            return false;
        }

        const message = results.message;
        if (message) {
            if (message.text.startsWith('Did you know this item has multiple possible') && settings.show_on_multiple) {
                hidePopup();
                return true;
            }
            if (message.text.startsWith('Your answer was a bit off. Check the') && settings.show_on_bit_off) {
                hidePopup();
                return true;
            }
        } else if (settings.show_on_correct) {
            return true;
        }

        return false;
    }

    function hidePopup() {
        if (settings.hide_popup) {
            infoPopup.style.display = 'none';
        }
    }

    function setAnswer(event) {
        const questionType = event.detail.questionType;
        const subject = event.detail.subjectWithStats.subject;

        if (questionType == 'meaning') {
            answerContainer.innerText = subject.meanings.filter(m => m.kind == 'primary' || m.kind == 'alternative').map(m => m.text).join(', ');
        } else {
            const subjectType = subject.type;
            if (subjectType == 'Kanji') {
                const primaryReadingType = subject.readings[0].type;
                answerContainer.innerText = subject.readings.filter(r => settings.alt_kanji_readings || r.type == primaryReadingType).map(r => (r.type == 'onyomi' && settings.katakana_onyomi) ? hiraganaToKatakana(r.text) : r.text).join(', ');
            } else {
                answerContainer.innerText = subject.readings.filter(r => r.kind == 'primary' || r.kind == 'alternative').map(r => r.text).join(', ');
            }
        }

    }

    function setBreakdown(event) {
        const subject = event.detail.subjectWithStats.subject;
        const itemData = indexedItemData[subject.id].data;
        if (subject.type != 'Radical' && subject.type != 'KanaVocabulary') {
            const components = itemData.component_subject_ids.map(id => createItemBreakdown(id, subject.type));
            breakdownContainer.append(...components);
        }
    }


    function createItemBreakdown(itemId, subjectType) {
        const itemContainer = document.createElement('div');
        if (subjectType == 'Vocabulary') {
            itemContainer.className = 'qa-item-container qa-kanji'
        } else if (subjectType == 'Kanji') {
            itemContainer.className = 'qa-item-container qa-radical'
        }
        const data = indexedItemData[itemId].data;
        itemContainer.addEventListener('click', () => {
            window.open(data.document_url, '_blank');
        });
        if (data.characters == null) {
            const characterImgUrl = data.character_images[data.character_images.length - 1].url;
            itemContainer.innerHTML = `<span class="qa-radical-image-container">
                                           <wk-character-image src="${characterImgUrl}" class="qa-radical-image"></wk-character-image>
                                       </span>
                                       <span>: ${toTitleCase(data.slug)}</span>`;
        } else {
            let meanings;
            if (settings.breakdown_all_meanings) {
                meanings = data.meanings.map(m => m.meaning).join(', ');
            } else {
                meanings = data.meanings[0].meaning;
            }
            itemContainer.innerHTML = `<span>${data.characters}: ${meanings}</span>`;
        }
        return itemContainer;

    }

    function setPartOfSpeech(event) {
        const subject = event.detail.subjectWithStats.subject;
        const partOfSpeech = indexedItemData[subject.id].data.parts_of_speech;
        if (settings.show_part_of_speech && partOfSpeech) {
            partOfSpeechContainer.innerText = partOfSpeech.map(toTitleCase).join('\n');
        }
    }

    function hiraganaToKatakana(hiragana) {
        return [...hiragana].map(char => hiraToKata[char] || char).join('');
    }

    function toTitleCase(str) {
        return str
            .toLowerCase()
            .split(/\s+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }


    function handleKeyDown(event) {
        if (event.key == settings.toggle_key) {
            toggle();
        }
    }

    function toggleOn() {
        toggleAnswerOn();
        toggleBreakdownOn();
    }

    function toggleOff() {
        toggleAnswerOff();
        toggleBreakdownOff();
    }

    function toggle() {
        if (answerContainer.style.display == 'none') {
            toggleOn();
        } else {
            toggleOff();
        }
    }

    function toggleAnswerOn() {
        answerContainer.style.display = 'block';
    }

    function toggleAnswerOff() {
        answerContainer.style.display = 'none';
    }

    function toggleBreakdownOn() {
        if (settings.show_breakdown) {
            breakdownContainer.style.visibility = 'visible';
            if (settings.show_part_of_speech) {
                partOfSpeechContainer.style.visibility = 'visible';
            }
        }
    }

    function toggleBreakdownOff() {
        if (settings.show_breakdown) {
            breakdownContainer.style.visibility = 'hidden';
            if (settings.show_part_of_speech) {
                partOfSpeechContainer.style.visibility = 'hidden';
            }
        }
    }

})();