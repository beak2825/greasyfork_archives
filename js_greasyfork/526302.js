// ==UserScript==
// @name         [AO3] Kat's Tweaks: Read Time & Word Count
// @author       Katstrel
// @description  Adds chapter word count, chapter read time, and work read time to stats in the blurb.
// @version      1.1.1
// @history      1.1.1 - added fourth default level and fixed error with deleted bookmark blurbs
// @history      1.1 - added dynamic customization options
// @history      1.0.1 - fixed userscript header
// @namespace    https://github.com/Katstrel/Kats-Tweaks-and-Skins
// @include      https://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526302/%5BAO3%5D%20Kat%27s%20Tweaks%3A%20Read%20Time%20%20Word%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/526302/%5BAO3%5D%20Kat%27s%20Tweaks%3A%20Read%20Time%20%20Word%20Count.meta.js
// ==/UserScript==
"use strict";
let DEBUG = false;

// তততততততত SETTINGS তততততততত //

let SETTINGS = {
    readTime: {
        enabled: true,
        wordsPerMinute: 200,
        levels: [
            {
                id: "Level_0",
                name: "Level_0",
                mins: 0,
                color: '#80ff8080',
            },
            {
                id: "Level_1",
                name: "Level_1",
                mins: 60,
                color: '#ffff8080',
            },
            {
                id: "Level_2",
                name: "Level_2",
                mins: 180,
                color: '#ff808080',
            },
            {
                id: "Level_3",
                name: "24 Hours",
                mins: 1440,
                color: '#ff80ff80',
            },
        ],
    }
};

// তততততত STOP SETTINGS তততততত //

/* Parts of code used or based on:
AO3 Bookmarking Records by Bairdel
AO3: Estimated Reading Time v2 by lomky
AO3: Get Current Chapter Word Count by w4tchdoge
*/

class ReadTime {
    constructor(settings) {
        this.settings = settings.readTime;
        console.info(`[Kat's Tweaks] Read Time & Word Count | Initialized with:`, this.settings);

        // Performs the Read Time on all blurbs
        document.querySelectorAll('li.work.blurb, li.bookmark.blurb, dl.work.meta, dl.series.meta, li.series.blurb').forEach(blurb=> {
            if (blurb.querySelector('p.message')) {
                return;
            }
            let wordCount = this.getWordCount(blurb);
            this.calculateTime(blurb.querySelector('dd.words'), wordCount);
        });

        // Chapter Word Count and Read Time if more than one chapter exists
        if (document.querySelector(`dl.work.meta dl.stats dd.chapters`)) {
            let chapCount = parseInt(document.querySelector(`dd.stats dd.chapters`).textContent.split(`/`).at(0));
            if (window.location.pathname.toLowerCase().includes(`chapters`) && chapCount > 1) {
                const chapWord = this.chapWordCount();
                const formatCount = new Intl.NumberFormat({ style: `decimal` }).format(chapWord);
                this.addBlurbStat(document.querySelector('dl.stats dd.chapters'), 'Words in Chapter:', formatCount, 'chapterWords');
                this.calculateTime(document.querySelector('dd#katstweaks.chapterWords'), chapWord, 'Chapter');
            }
        }
    }

    getWordCount(blurb) {
        let words = blurb.querySelector('dd.words').innerText;
        if (words.includes(",")) {
            words = words.replaceAll(",", ""); 
        }
        if (words.includes(" ")) {
            words = words.replaceAll(" ", "");
        }
        if (words.includes(" ")) {
            words = words.replaceAll(/\s/g, ""); 
        }
    
        let wordsINT = parseInt(words);
        DEBUG && console.log(`[Kat's Tweaks] Work Word Count: ${wordsINT}`);
        return wordsINT;
    }

    calculateTime(querySelect, wordCount, type = '') {
        let minutes = wordCount/(this.settings.wordsPerMinute);
        let hrs = Math.floor(minutes/60);
        let mins = (minutes%60).toFixed(0);

        // Get minutes with zero decimal points
        let timePrint = hrs > 0 ? hrs + "h" + mins + "m" : mins + "m";
        console.info(`[Kat's Tweaks] Time calculated for ${wordCount} words: ${timePrint}`);

        // Add readtime stats
        let dlItem = this.addBlurbStat(querySelect, `${type} Readtime:`, timePrint, `${type}readtime`);

        // Finds the closest smaller value for read time
        let filteredLevels = this.settings.levels.filter((level) => {
            return level.mins <= minutes;
        });
        let sorted = filteredLevels.sort(function(a, b){return a.mins - b.mins});
        DEBUG && console.log(`[Kat's Tweaks] Sorted list`, sorted);

        dlItem[1].style.backgroundColor = sorted[sorted.length-1].color;
    }
    
    // Credit: w4tchdoge's AO3: Get Current Chapter Word Count
    chapWordCount() {
        // Get the Chapter Text 
        const chapter_text = (function () {
            let elm_parent = document.querySelector(`[role="article"]:has(> #work)`).cloneNode(true);
            elm_parent.removeChild(elm_parent.querySelector(`#work`));
            return elm_parent.textContent.trim();
        })();

        const script_list = [`Arabic`, `Armenian`, `Balinese`, `Bengali`, `Bopomofo`, `Braille`, `Buginese`, `Buhid`, `Canadian_Aboriginal`, `Carian`, `Cham`, `Cherokee`, `Common`, `Coptic`, `Cuneiform`, `Cypriot`, `Cyrillic`, `Deseret`, `Devanagari`, `Ethiopic`, `Georgian`, `Glagolitic`, `Gothic`, `Greek`, `Gujarati`, `Gurmukhi`, `Han`, `Hangul`, `Hanunoo`, `Hebrew`, `Hiragana`, `Inherited`, `Kannada`, `Katakana`, `Kayah_Li`, `Kharoshthi`, `Khmer`, `Lao`, `Latin`, `Lepcha`, `Limbu`, `Linear_B`, `Lycian`, `Lydian`, `Malayalam`, `Mongolian`, `Myanmar`, `New_Tai_Lue`, `Nko`, `Ogham`, `Ol_Chiki`, `Old_Italic`, `Old_Persian`, `Oriya`, `Osmanya`, `Phags_Pa`, `Phoenician`, `Rejang`, `Runic`, `Saurashtra`, `Shavian`, `Sinhala`, `Sundanese`, `Syloti_Nagri`, `Syriac`, `Tagalog`, `Tagbanwa`, `Tai_Le`, `Tamil`, `Telugu`, `Thaana`, `Thai`, `Tibetan`, `Tifinagh`, `Ugaritic`, `Vai`, `Yi`];
        const script_exclude_list = [`Common`, `Latin`, `Inherited`];

        // Counting the number of words
        const word_count_regex = new RegExp((function () {
            const regex_scripts = script_list.filter((elm) => !script_exclude_list.includes(elm)).map((elm) => `\\p{Script=${elm}}`).join(``);
            const full_regex_str = `[${regex_scripts}]|((?![${regex_scripts}])[\\p{Letter}\\p{Mark}\\p{Number}\\p{Connector_Punctuation}])+`;
            return full_regex_str;
        })(), `gv`);
        const word_count_arr = Array.from(chapter_text.replaceAll(/--/g, `—`).replaceAll(/['’‘-]/g, ``).matchAll(word_count_regex), (m) => m[0]);
        const word_count_int = word_count_arr.length;
        DEBUG && console.log(`[Kat's Tweaks] Chapter Word Count: ${word_count_int}`);
        return word_count_int;
    }

    addBlurbStat(querySelectDL, term, definiton, styleClass) {
        const descListTerm = Object.assign(document.createElement(`dt`), {
            id: `katstweaks`,
            className: styleClass || "",
            textContent: term || "",
        });
        const descListDefine = Object.assign(document.createElement(`dd`), {
            id: `katstweaks`,
            className: styleClass || "",
            textContent: definiton || ""
        });

        querySelectDL.after(descListTerm, descListDefine);
        DEBUG && console.info(`[Kat's Tweaks] Custom DLItem '${term}' added successfully`);
        return [descListTerm, descListDefine];
    }

}

class Main {
    constructor() {
        this.settings = this.loadSettings();
        if (this.settings.readTime.enabled) {
            new ReadTime(this.settings);
        }
    }

    // Load settings from the storage or fallback to default ones
    loadSettings() {
        const startTime = performance.now();
        let savedSettings = localStorage.getItem('KT-SavedSettings');
        let settings = SETTINGS;

        if (savedSettings) {
            try {
                let parse = JSON.parse(savedSettings);
                DEBUG && console.log(`[Kat's Tweaks] Settings loaded successfully:`, savedSettings);

                settings = parse;

            } catch (error) {
                DEBUG && console.error(`[Kat's Tweaks] Error parsing settings: ${error}`);
            }
        } else {
            DEBUG && console.warn(`[Kat's Tweaks] No saved settings found for Read Time & Word Count, using default settings.`);
        }

        const endTime = performance.now();
        DEBUG && console.log(`[Kat's Tweaks] Settings loaded in ${endTime - startTime} ms`);
        return settings;
    }
}

new Main();