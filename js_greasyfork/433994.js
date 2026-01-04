// ==UserScript==
// @name         Wanikani Anime Sentences
// @description  Adds example sentences from anime movies and shows for vocabulary from immersionkit.com
// @version      1.1.3
// @author       psdcon
// @namespace    wkanimesentences

// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*

// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1166918
// @copyright    2021+, Paul Connolly
// @license      MIT; http://opensource.org/licenses/MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433994/Wanikani%20Anime%20Sentences.user.js
// @updateURL https://update.greasyfork.org/scripts/433994/Wanikani%20Anime%20Sentences.meta.js
// ==/UserScript==


(() => {

    //--------------------------------------------------------------------------------------------------------------//
    //-----------------------------------------------INITIALIZATION-------------------------------------------------//
    //--------------------------------------------------------------------------------------------------------------//
    const wkof = window.wkof;

    const scriptId = "anime-sentences";
    const scriptName = "Anime Sentences";

    let state = {
        settings: {
            playbackRate: 0.75,
            showEnglish: 'onhover',
            showJapanese: 'always',
            showFurigana: 'onhover',
            sentenceLengthSort: 'asc',
            filterWaniKaniLevel: true,
            filterAnimeShows: {},
            filterAnimeMovies: {},
            // Some Ghibli films are enabled by default
            filterGhibli: {4: true, 5: true, 6: true, 7: true, 8: true},
        },
        item: null, // current vocab from wkinfo
        userLevel: '', // most recent level progression
        immersionKitData: null, // cached so sentences can be re-rendered after settings change
        sentencesEl: null, // referenced so sentences can be re-rendered after settings change
    };

    // Titles taken from https://www.immersionkit.com/information
    const animeShows = {
        0: "Angel Beats!",
        1: "Anohana: The Flower We Saw That Day",
        2: "Assassination Classroom Season 1",
        3: "Bakemonogatari",
        4: "Boku no Hero Academia Season 1",
        5: "Cardcaptor Sakura",
        6: "Chobits",
        7: "Clannad",
        8: "Clannad After Story",
        9: "Code Geass Season 1",
        10: "Daily Lives of High School Boys",
        11: "Death Note",
        12: "Durarara!!",
        13: "Erased",
        14: "Fairy Tail",
        15: "Fate Stay Night UBW Season 1",
        16: "Fate Stay Night UBW Season 2",
        17: "Fate Zero",
        18: "From the New World",
        19: "Fruits Basket Season 1",
        20: "Fullmetal Alchemist Brotherhood",
        21: "God's Blessing on this Wonderful World!",
        22: "Haruhi Suzumiya",
        23: "Hunter × Hunter",
        24: "Is The Order a Rabbit",
        25: "K-On!",
        26: "Kanon (2006)",
        27: "Kill la Kill",
        28: "Kino's Journey",
        29: "Kokoro Connect",
        30: "Little Witch Academia",
        31: "Mahou Shoujo Madoka Magica",
        32: "My Little Sister Can't Be This Cute",
        33: "New Game!",
        34: "No Game No Life",
        35: "Noragami",
        36: "One Week Friends",
        37: "Psycho Pass",
        38: "Re:Zero − Starting Life in Another World",
        39: "Shirokuma Cafe",
        40: "Steins Gate",
        41: "Sword Art Online",
        42: "Toradora!",
        43: "Wandering Witch The Journey of Elaina",
        44: "Your Lie in April",
    }

    const animeMovies = {
        0: "Only Yesterday",
        1: "The Garden of Words",
        2: "The Girl Who Leapt Through Time",
        3: "The World God Only Knows",
        4: "Weathering with You",
        5: "Wolf Children",
        6: "Your Name",
    }

    const ghibliTitles = {
        0: "Castle in the sky",
        1: "From Up on Poppy Hill",
        2: "Grave of the Fireflies",
        3: "Howl's Moving Castle",
        4: "Kiki's Delivery Service",
        5: "My Neighbor Totoro",
        6: "Princess Mononoke",
        7: "Spirited Away",
        8: "The Cat Returns",
        9: "The Secret World of Arrietty",
        10: "The Wind Rises",
        11: "When Marnie Was There",
        12: "Whisper of the Heart",
    }

    main();

    function main() {
        init(() => wkItemInfo.forType(`vocabulary`).under(`examples`).notify(
            (item) => onExamplesVisible(item))
        );
    }

    function init(callback) {
        createStyle();

        if (wkof) {
            wkof.include("ItemData,Settings");
            wkof
                .ready("Apiv2,Settings")
                .then(loadSettings)
                .then(processLoadedSettings)
                .then(getLevel)
                .then(callback);
        } else {
            console.warn(
                `${scriptName}: You are not using Wanikani Open Framework which this script utilizes to provide the settings dialog for the script. You can still use ${scriptName} normally though`
            );
            callback();
        }
    }

    function getLevel() {
        wkof.Apiv2.fetch_endpoint('level_progressions', (window.unsafeWindow ?? window).options ?? analyticsOptions).then((response) => {
            state.userLevel = response.data[response.data.length - 1].data.level
        });
    }

    function onExamplesVisible(item) {
        state.item = item // current vocab item
        addAnimeSentences()
    }

    function addAnimeSentences() {
        let parentEl = document.createElement("div");
        parentEl.setAttribute("id", 'anime-sentences-parent')

        let header = ['Anime Sentences']

        const settingsBtn = document.createElement("i");
        settingsBtn.setAttribute("class", "fa fa-gear");
        settingsBtn.setAttribute("style", "font-size: 14px; cursor: pointer; vertical-align: middle; margin-left: 10px;");
        settingsBtn.onclick = openSettings
        let sentencesEl = document.createElement("div");
        sentencesEl.innerText = 'Loading...'

        header.push(settingsBtn)
        parentEl.append(sentencesEl)
        state.sentencesEl = sentencesEl

        if (state.item.injector) {
            if (state.item.on === 'lesson') {
                state.item.injector.appendAtTop(header, parentEl)
            } else { // itemPage, review
                state.item.injector.append(header, parentEl)
            }
        }

        const queryString = state.item.characters.replace('〜', '');  // for "counter" kanji
        const wkLevelFilter = state.settings.filterWaniKaniLevel ? state.userLevel : '';
        let url = `https://api.immersionkit.com/look_up_dictionary?keyword=${queryString}&tags=&jlpt=&wk=${wkLevelFilter}&sort=shortness&category=anime`
        fetch(url)
            .then(response => response.json())
            .then(data => {
                state.immersionKitData = data.data[0].examples
                renderSentences()
            })
    }

    function getDesiredShows() {
        // Convert settings dictionaries to array of titles
        let titles = []
        for (const [key, value] of Object.entries(state.settings.filterAnimeShows)) {
            if (value === true) {
                titles.push(animeShows[key])
            }
        }
        for (const [key, value] of Object.entries(state.settings.filterAnimeMovies)) {
            if (value === true) {
                titles.push(animeMovies[key])
            }
        }
        for (const [key, value] of Object.entries(state.settings.filterGhibli)) {
            if (value === true) {
                titles.push(ghibliTitles[key])
            }
        }
        return titles
    }

    function renderSentences() {
        // Called from immersionkit response, and on settings save
        let examples = state.immersionKitData;
        const exampleLenBeforeFilter = examples.length

        // Exclude non-selected titles
        let desiredTitles = getDesiredShows()
        examples = examples.filter(ex => desiredTitles.includes(ex.deck_name))
        if (state.settings.sentenceLengthSort === 'asc') {
            examples.sort((a, b) => a.sentence.length - b.sentence.length)
        } else {
            examples.sort((a, b) => b.sentence.length - a.sentence.length)
        }

        let showJapanese = state.settings.showJapanese;
        let showEnglish = state.settings.showEnglish;
        let showFurigana = state.settings.showFurigana;
        let playbackRate = state.settings.playbackRate

        let html = '';
        if (exampleLenBeforeFilter === 0) {
            html = 'No sentences found.'
        } else if (examples.length === 0 && exampleLenBeforeFilter > 0) {
            // TODO show which titles have how many examples
            html = 'No sentences found for your selected movies & shows.'
        } else {
            let lim = Math.min(examples.length, 50)

            for (var i = 0; i < lim; i++) {
                const example = examples[i]

                let japaneseText = state.settings.showFurigana === 'never' ?
                    example.sentence :
                    new Furigana(example.sentence_with_furigana).ReadingHtml

                html += `
    <div class="anime-example">
        <img src="${example.image_url}" alt="">
        <div class="anime-example-text">
            <div class="title" title="${example.id}">${example.deck_name}</div>
            <div class="ja">
                <span class="${showJapanese === 'onhover' ? 'show-on-hover' : ''} ${showFurigana === 'onhover' ? 'show-ruby-on-hover' : ''}  ${showJapanese === 'onclick' ? 'show-on-click' : ''}">${japaneseText}</span>
                <span><button class="audio-btn audio-idle fa-solid fa-volume-off"></button></span>
                <audio src="${example.sound_url}"></audio>
            </div>
            <div class="en">
                <span class="${showEnglish === 'onhover' ? 'show-on-hover' : ''} ${showEnglish === 'onclick' ? 'show-on-click' : ''}">${example.translation}</span>
            </div>
        </div>
    </div>`
            }
        }

        let sentencesEl = state.sentencesEl
        sentencesEl.innerHTML = html

        let audios = document.querySelectorAll(".anime-example audio")
        audios.forEach((a) => {
            a.playbackRate = playbackRate
            let button = a.parentNode.querySelector('button')
            a.onplay = () => {
                button.setAttribute("class", "audio-btn audio-play fa-solid fa-volume-high")
            };
            a.onended = () => {
                button.setAttribute('class', "audio-btn audio-idle fa-solid fa-volume-off")
            };
        })

        // Click anywhere plays the audio
        let exampleEls = document.querySelectorAll(".anime-example")
        exampleEls.forEach((a) => {
            a.onclick = function () {
                let audio = this.querySelector('audio')
                audio.play()
            }
        });

        // Assigning onclick function to .show-on-click elements
        document.querySelectorAll(".show-on-click").forEach((a) => {
            a.onclick = function () {
                this.classList.toggle('show-on-click');
            }
        });
    }

    //--------------------------------------------------------------------------------------------------------------//
    //----------------------------------------------SETTINGS--------------------------------------------------------//
    //--------------------------------------------------------------------------------------------------------------//

    function loadSettings() {
        return wkof.Settings.load(scriptId, state.settings);
    }

    function processLoadedSettings() {
        state.settings = wkof.settings[scriptId];
    }

    function openSettings(e) {
		e.stopPropagation();
        let config = {
            script_id: scriptId,
            title: scriptName,
            on_save: updateSettings,
            content: {
                general: {
                    type: "section",
                    label: "General"
                },
                sentenceLengthSort: {
                    type: "dropdown",
                    label: "Sentence Order",
                    hover_tip: "",
                    content: {
                        asc: "Shortest first",
                        desc: "Longest first"
                    },
                    default: state.settings.sentenceLengthSort
                },
                playbackRate: {
                    type: "number",
                    label: "Playback Speed",
                    step: 0.1,
                    min: 0.5,
                    max: 2,
                    hover_tip: "Speed to play back audio.",
                    default: state.settings.playbackRate
                },
                showJapanese: {
                    type: "dropdown",
                    label: "Show Japanese",
                    hover_tip: "When to show Japanese text. Hover enables transcribing a sentences first (play audio by clicking the image to avoid seeing the answer).",
                    content: {
                        always: "Always",
                        onhover: "On Hover",
                        onclick: "On Click",
                    },
                    default: state.settings.showJapanese
                },
                showFurigana: {
                    type: "dropdown",
                    label: "Show Furigana",
                    hover_tip: "These have been autogenerated so there may be mistakes.",
                    content: {
                        always: "Always",
                        onhover: "On Hover",
                        never: "Never",
                    },
                    default: state.settings.showFurigana
                },
                showEnglish: {
                    type: "dropdown",
                    label: "Show English",
                    hover_tip: "Hover or click allows testing your understanding before seeing the answer.",
                    content: {
                        always: "Always",
                        onhover: "On Hover",
                        onclick: "On Click",
                    },
                    default: state.settings.showEnglish
                },
                tooltip: {
                    type: "section",
                    label: "Filters"
                },
                filterGhibli: {
                    type: "list",
                    label: "Ghibli Movies",
                    multi: true,
                    size: 6,
                    hover_tip: "Select which Studio Ghibli movies you'd like to see examples from.",
                    default: state.settings.filterGhibli,
                    content: ghibliTitles
                },
                filterAnimeMovies: {
                    type: "list",
                    label: "Anime Movies",
                    multi: true,
                    size: 6,
                    hover_tip: "Select which anime movies you'd like to see examples from.",
                    default: state.settings.filterAnimeMovies,
                    content: animeMovies
                },
                filterAnimeShows: {
                    type: "list",
                    label: "Anime Shows",
                    multi: true,
                    size: 6,
                    hover_tip: "Select which anime shows you'd like to see examples from.",
                    default: state.settings.filterAnimeShows,
                    content: animeShows
                },
                filterWaniKaniLevel: {
                    type: "checkbox",
                    label: "WaniKani Level",
                    hover_tip: "Only show sentences with maximum 1 word outside of your current WaniKani level.",
                    default: state.settings.filterWaniKaniLevel,
                },
                credits: {
                    type: "section",
                    label: "Powered by immersionkit.com"
                },
            }
        };
        let dialog = new wkof.Settings(config);
        dialog.open();
    }

    // Called when the user clicks the Save button on the Settings dialog.
    function updateSettings() {
        state.settings = wkof.settings[scriptId];
        renderSentences();
    }

    //--------------------------------------------------------------------------------------------------------------//
    //-----------------------------------------------STYLES---------------------------------------------------------//
    //--------------------------------------------------------------------------------------------------------------//

    function createStyle() {
        const style = document.createElement("style");
        style.setAttribute("id", "anime-sentences-style");
        // language=CSS
        style.innerHTML = `
            #anime-sentences-parent > div {
                overflow-y: auto;
                max-height: 280px;
            }

            #anime-sentences-parent .fa-solid {
                border: none;
                font-size: 100%;
            }

            .anime-example {
                display: flex;
                align-items: center;
                margin-bottom: 1em;
                cursor: pointer;
            }
            
            .audio-btn {
                background-color: transparent;
            }

            /* Make text and background color the same to hide text */
            .anime-example-text .show-on-hover, .anime-example-text .show-on-click {
                background: #ccc;
                color: #ccc;
                text-shadow: none;
            }

            .anime-example-text .show-on-hover:hover {
                background: inherit;
                color: inherit
            }

            /* Furigana hover*/
            .anime-example-text .show-ruby-on-hover ruby rt {
                visibility: hidden;
            }

            .anime-example-text:hover .show-ruby-on-hover ruby rt {
                visibility: visible;
            }

            .anime-example .title {
                font-weight: 700;
            }

            .anime-example .ja {
                font-size: 2em;
            }

            .anime-example img {
                margin-right: 1em;
                max-width: 200px;
            }
        `;

        document.querySelector("head").append(style);
    }


    //--------------------------------------------------------------------------------------------------------------//
    //----------------------------------------------FURIGANA--------------------------------------------------------//
    //--------------------------------------------------------------------------------------------------------------//
    // https://raw.githubusercontent.com/helephant/Gem/master/src/Gem.Javascript/gem.furigana.js
    function Furigana(reading) {
        var segments = ParseFurigana(reading || "");

        this.Reading = getReading();
        this.Expression = getExpression();
        this.Hiragana = getHiragana();
        this.ReadingHtml = getReadingHtml();

        function getReading() {
            var reading = "";
            for (var x = 0; x < segments.length; x++) {
                reading += segments[x].Reading;
            }
            return reading.trim();
        }

        function getExpression() {
            var expression = "";
            for (var x = 0; x < segments.length; x++)
                expression += segments[x].Expression;
            return expression;
        }

        function getHiragana() {
            var hiragana = "";
            for (var x = 0; x < segments.length; x++) {
                hiragana += segments[x].Hiragana;
            }
            return hiragana;
        }

        function getReadingHtml() {
            var html = "";
            for (var x = 0; x < segments.length; x++) {
                html += segments[x].ReadingHtml;
            }
            return html;
        }
    }

    function FuriganaSegment(baseText, furigana) {
        this.Expression = baseText;
        this.Hiragana = furigana.trim();
        this.Reading = baseText + "[" + furigana + "]";
        this.ReadingHtml = "<ruby><rb>" + baseText + "</rb><rt>" + furigana + "</rt></ruby>";
    }

    function UndecoratedSegment(baseText) {
        this.Expression = baseText;
        this.Hiragana = baseText;
        this.Reading = baseText;
        this.ReadingHtml = baseText;
    }

    function ParseFurigana(reading) {
        var segments = [];

        var currentBase = "";
        var currentFurigana = "";
        var parsingBaseSection = true;
        var parsingHtml = false;

        var characters = reading.split('');

        while (characters.length > 0) {
            var current = characters.shift();

            if (current === '[') {
                parsingBaseSection = false;
            } else if (current === ']') {
                nextSegment();
            } else if (isLastCharacterInBlock(current, characters) && parsingBaseSection) {
                currentBase += current;
                nextSegment();
            } else if (!parsingBaseSection)
                currentFurigana += current;
            else
                currentBase += current;
        }

        nextSegment();

        function nextSegment() {
            if (currentBase)
                segments.push(getSegment(currentBase, currentFurigana));
            currentBase = "";
            currentFurigana = "";
            parsingBaseSection = true;
            parsingHtml = false;
        }

        function getSegment(baseText, furigana) {
            if (!furigana || furigana.trim().length === 0)
                return new UndecoratedSegment(baseText);
            return new FuriganaSegment(baseText, furigana);
        }

        function isLastCharacterInBlock(current, characters) {
            return !characters.length ||
                (isKanji(current) !== isKanji(characters[0]) && characters[0] !== '[');
        }

        function isKanji(character) {
            return character && character.charCodeAt(0) >= 0x4e00 && character.charCodeAt(0) <= 0x9faf;
        }

        return segments;
    }

})();