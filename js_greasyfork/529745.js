// ==UserScript==
// @name         JPDB Nadeshiko Examples
// @version      2025-12-18
// @description  Embeds anime images & audio examples into JPDB review and vocabulary pages using Nadeshiko's API. Compatible only with TamperMonkey.
// @author       awoo & Sacus
// @namespace    jpdb-nadeshiko-examples
// @match        https://jpdb.io/review*
// @match        https://jpdb.io/vocabulary/*
// @match        https://jpdb.io/kanji/*
// @match        https://jpdb.io/search*
// @match        https://jpdb.io/deck*
// @connect      api.brigadasos.xyz
// @connect 	sargus.fr
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529745/JPDB%20Nadeshiko%20Examples.user.js
// @updateURL https://update.greasyfork.org/scripts/529745/JPDB%20Nadeshiko%20Examples.meta.js
// ==/UserScript==
/*jshint esversion: 11 */
/* global GM_addElement, GM_xmlhttpRequest, GM_setValue, GM_getValue, GM_registerMenuCommand */
(function () {
    'use strict';
    let nadeshikoApiKey = GM_getValue("nadeshiko-api-key", "");
    const apiBaseUrl = "http://sargus.fr:8000/api";

    // Register menu commands
    GM_registerMenuCommand("Set Nadeshiko API Key", async () => {
        nadeshikoApiKey = fetchNadeshikoApiKey();
    });
    GM_registerMenuCommand("Open Configuration", () => {
        createOverlayMenu();
    });

    function fetchNadeshikoApiKey() {
        let apiKey = prompt("A Nadeshiko API key is required for this extension to work.\n\nYou can get one for free here after creating an account: https://nadeshiko.co/settings/developer");
        GM_setValue("nadeshiko-api-key", apiKey);

        if (apiKey) {
            alert("API Key saved successfully!");
        }

        return apiKey;
    }

    // to use custom hotkeys just add them into this array following the same format. Any single keys except space
    // should work. If you want to use special keys, check the linked page for how to represent them in the array
    // (link leads to the arrow keys part so you can compare with the array and be sure which part to write):
    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#navigation_keys
    const hotkeyOptions = ['None', 'ArrowLeft ArrowRight', ', .', '[ ]', 'Q W'];

    const RANDOM_SENTENCE_ENUM = {
        DISABLE: 0,
        ON_FIRST: 1,
        EVERY_TIME: 2
    };
    const CONFIG = {
        IMAGE_WIDTH: '400px',
        WIDE_MODE: true,
        DEFINITIONS_ON_RIGHT_IN_WIDE_MODE: false,
        ARROW_WIDTH: '75px',
        ARROW_HEIGHT: '45px',
        PAGE_WIDTH: '75rem',
        SOUND_VOLUME: 80,
        ENABLE_EXAMPLE_TRANSLATION: true,
        SENTENCE_FONT_SIZE: '120%',
        TRANSLATION_FONT_SIZE: '85%',
        COLORED_SENTENCE_TEXT: true,
        AUTO_PLAY_SOUND: true,
        NUMBER_OF_PRELOADS: 1,
        VOCAB_SIZE: '250%',
        MINIMUM_EXAMPLE_LENGTH: 0,
        MAXIMUM_EXAMPLE_LENGTH: 100,
        HOTKEYS: ['None'],
        DEFAULT_TO_EXACT_SEARCH: true,
        BLUR_EXAMPLE_SENTENCE: true,
        FURIGANA_ON_BACKSIDE: true,
        FURIGANA_ON_FRONT_SIDE: false,
        // On changing this config option, the icons change but the sentences don't, so you
        // have to click once to match up the icons and again to actually change the sentences
        RANDOM_SENTENCE: RANDOM_SENTENCE_ENUM,
        WEIGHTED_SENTENCES: false,
        DEBUG: false, // Set to true to not use IndexedDB and always fetch from API
    };

    const state = {
        currentExampleIndex: 0,
        examples: [],
        apiDataFetched: false,
        vocab: '',
        embedAboveSubsectionMeanings: false,
        preloadedIndices: new Set(),
        currentAudio: null,
        exactSearch: true,
        error: false,
        currentlyPlayingAudio: false,
        reading: '',
        isFront : false,
    };

    // Prefixing
    const scriptPrefix = 'JPDBNadeshikoExamples-';
    const configPrefix = 'CONFIG.'; // additional prefix for config variables to go after the scriptPrefix
    // do not change either of the above without adding code to handle the change

    const setItem = (key, value) => {
        localStorage.setItem(scriptPrefix + key, value);
    };
    const getItem = (key) => {
        const prefixedValue = localStorage.getItem(scriptPrefix + key);
        if (prefixedValue !== null) {
            return prefixedValue;
        }
        const nonPrefixedValue = localStorage.getItem(key);
        // to move away from non-prefixed values as fast as possible
        if (nonPrefixedValue !== null) {
            setItem(key, nonPrefixedValue);
        }
        return nonPrefixedValue;
    };

    // Helper for transitioning to fully script-prefixed config state
    // Deletes all localStorage variables starting with configPrefix and re-adds them with scriptPrefix and configPrefix
    // Danger of other scripts also having localStorage variables starting with configPrefix, so we add a flag showing that
    // we have run this function and make sure it is not set when running it

    // Check for Prefixed flag
    if (localStorage.getItem(`JPDBNadeshiko*Examples-CONFIG_VARIABLES_PREFIXED`) !== 'true') {
        const keysToModify = [];

        // Collect keys that need to be modified
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(configPrefix)) {
                keysToModify.push(key);
            }
        }

        // Modify the collected keys
        keysToModify.forEach((key) => {
            const value = localStorage.getItem(key);
            localStorage.removeItem(key);
            const newKey = scriptPrefix + key;
            localStorage.setItem(newKey, value);
        });
        // Set flag so this only runs once
        // Flag has * in name to place at top in alphabetical sorting,
        // and most importantly, to ensure the flag is never removed or modified
        // by the other script functions that check for the script prefix
        localStorage.setItem(`JPDBNadeshiko*Examples-CONFIG_VARIABLES_PREFIXED`, 'true');
    }

    // IndexedDB Manager
    const IndexedDBManager = {
        MAX_ENTRIES: 100000000,
        EXPIRATION_TIME: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds

        open() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('NadeshikoDB', 1);
                request.onupgradeneeded = function (event) {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('dataStore')) {
                        db.createObjectStore('dataStore', {keyPath: 'keyword'});
                    }
                };
                request.onsuccess = function (event) {
                    resolve(event.target.result);
                };
                request.onerror = function (event) {
                    reject('IndexedDB error: ' + event.target.errorCode);
                };
            });
        },

        get(db, keyword) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['dataStore'], 'readonly');
                const store = transaction.objectStore('dataStore');
                const request = store.get(keyword);
                request.onsuccess = async function (event) {
                    const result = event.target.result;
                    if (result) {
                        const isExpired = Date.now() - result.timestamp >= this.EXPIRATION_TIME;
                        const validationError = validateApiResponse(result.data);

                        if (isExpired) {
                            console.log(`Deleting entry for keyword "${keyword}" because it is expired.`);
                            await this.deleteEntry(db, keyword);
                            resolve(null);
                        } else if (validationError && !keyword === 'jpdb-imported-data') {
                            console.error(`Deleting entry for keyword "${keyword}" due to validation error: ${validationError}`);
                            await this.deleteEntry(db, keyword);
                            resolve(null);
                        } else {
                            resolve([result.data,result.timestamp]);
                        }
                    } else {
                        resolve(null);
                    }
                }.bind(this);
                request.onerror = function (event) {
                    reject('IndexedDB get error: ' + event.target.errorCode);
                };
            });
        },

        deleteEntry(db, keyword) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['dataStore'], 'readwrite');
                const store = transaction.objectStore('dataStore');
                const request = store.delete(keyword);
                request.onsuccess = () => resolve();
                request.onerror = (e) => reject('IndexedDB delete error: ' + e.target.errorCode);
            });
        },

        getAll(db) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['dataStore'], 'readonly');
                const store = transaction.objectStore('dataStore');
                const entries = [];
                store.openCursor().onsuccess = function (event) {
                    const cursor = event.target.result;
                    if (cursor) {
                        entries.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(entries);
                    }
                };
                store.openCursor().onerror = function (event) {
                    reject('Failed to retrieve entries via cursor: ' + event.target.errorCode);
                };
            });
        },

        save(db, keyword, data) {
            return new Promise(async (resolve, reject) => {
                try {
                    const validationError = validateApiResponse(data);
                    if (validationError) {
                        console.error(`Invalid data detected: ${validationError}. Not saving to IndexedDB.`);
                        resolve();
                        return;
                    }
                    // check for DEBUG mode
                    if (CONFIG.DEBUG) {
                        console.log('DEBUG mode is enabled. Not using IndexedDB, always fetching from API.');
                        resolve();
                        return;
                    }
                    // Transform the JSON object to slim it down
                    let slimData = {};
                    if (data) {
                        slimData = data;
                    } else {
                        console.error('Data does not contain expected structure. Cannot slim down.');
                        resolve();
                        return;
                    }

                    const entries = await this.getAll(db);
                    const transaction = db.transaction(['dataStore'], 'readwrite');
                    const store = transaction.objectStore('dataStore');

                    if (entries.length >= this.MAX_ENTRIES) {
                        // Sort entries by timestamp and delete oldest ones
                        entries.sort((a, b) => a.timestamp - b.timestamp);
                        const entriesToDelete = entries.slice(0, entries.length - this.MAX_ENTRIES + 1);

                        // Delete old entries
                        entriesToDelete.forEach(entry => {
                            store.delete(entry.keyword).onerror = function () {
                                console.error('Failed to delete entry:', entry.keyword);
                            };
                        });
                    }

                    // Add the new slimmed entry
                    const addRequest = store.put({keyword, data: slimData, timestamp: Date.now()});
                    addRequest.onsuccess = () => resolve();
                    addRequest.onerror = (e) => reject('IndexedDB save error: ' + e.target.errorCode);

                    transaction.oncomplete = function () {
                        console.log('IndexedDB updated successfully.');
                    };

                    transaction.onerror = function (event) {
                        reject('IndexedDB update failed: ' + event.target.errorCode);
                    };

                } catch (error) {
                    reject(`Error in saveToIndexedDB: ${error}`);
                }
            });
        },

        importJPDBData(db, data) {
            return new Promise(async (resolve, reject) => {
                try {
                    /* -------- 1. build slimData -------- */
                    const slimData = {};
                    if (data?.cards_vocabulary_jp_en) {
                        data.cards_vocabulary_jp_en.forEach(card => {
                            slimData[`${card.spelling}|${card.reading}`] = 1;
                        });
                    } else {
                        reject('Unexpected data format');
                        return;
                    }

                    if (CONFIG.DEBUG) {
                        resolve();
                        return;
                    }

                    /* -------- 2. read current amount first -------- */
                    const entries = await this.getAll(db);

                    /* -------- 3. open a fresh read-write tx -------- */
                    const tx = db.transaction(['dataStore'], 'readwrite');
                    const store = tx.objectStore('dataStore');

                    // delete oldest if over quota
                    if (entries.length >= this.MAX_ENTRIES) {
                        entries
                            .sort((a, b) => a.timestamp - b.timestamp)
                            .slice(0, entries.length - this.MAX_ENTRIES + 1)
                            .forEach(entry => store.delete(entry.keyword));
                    }

                    // add / replace the imported blob
                    store.put({
                        keyword: 'jpdb-imported-data',
                        data: slimData,
                        timestamp: Date.now()
                    });

                    tx.oncomplete = () => {
                        console.log('IndexedDB import OK');
                        resolve();
                    };
                    tx.onerror = e => {
                        reject('IndexedDB import failed: ' + e.target.error);
                    };

                } catch (err) {
                    reject(`Error in importJPDBData: ${err}`);
                }
            });
        },

        delete() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.deleteDatabase('NadeshikoDB');
                request.onsuccess = function () {
                    console.log('IndexedDB deleted successfully');
                    resolve();
                };
                request.onerror = function (event) {
                    console.error('Error deleting IndexedDB:', event.target.errorCode);
                    reject('Error deleting IndexedDB: ' + event.target.errorCode);
                };
                request.onblocked = function () {
                    console.warn('Delete operation blocked. Please close all other tabs with this site open and try again.');
                    reject('Delete operation blocked');
                };
            });
        }
    };


    // API FUNCTIONS=====================================================================================================================
    function getNadeshikoData(vocab, exactSearch, reading = state?.reading) {


        return new Promise(async (resolve, reject) => {
            const searchVocab = exactSearch ? `"${vocab}"` : vocab;
            const url = `https://api.brigadasos.xyz/api/v1/search/media/sentence`;
            const maxRetries = 2;
            let attempt = 0;

            async function fetchData() {
                try {
                    const db = await IndexedDBManager.open();
                    const cachedDatas = await IndexedDBManager.get(db, searchVocab);
                    if (cachedDatas && Array.isArray(cachedDatas)) {
                        const timestamp = cachedDatas[1]
                        const cachedData = cachedDatas[0]
                        cachedData.push(timestamp)
                        console.log('Data retrieved from IndexedDB');
                        state.examples = cachedData;
                        console.log("Last updated: " + new Date(cachedData[cachedData.length - 1]).toLocaleString());
                        state.apiDataFetched = true;
                        resolve();
                    } else {
                        const data = JSON.stringify({
                            query: searchVocab,
                            "limit": 50,
                            "min_length": CONFIG.MINIMUM_EXAMPLE_LENGTH,
                            "max_length": CONFIG.MAXIMUM_EXAMPLE_LENGTH
                        })
                        console.log(`Calling API for: ${searchVocab} with data ${data}`);
                        if (!nadeshikoApiKey) {
                            // Ask for API Key on search if not set to prevent 401 errors
                            nadeshikoApiKey = fetchNadeshikoApiKey();
                            if (!nadeshikoApiKey) {
                                return;
                            }
                        }

                        GM_xmlhttpRequest({
                            method: "POST",
                            url: url,
                            data: data,
                            headers:
                                {
                                    "X-API-Key": nadeshikoApiKey,
                                    "Content-Type": "application/json"
                                },
                            onload: async function (response) {
                                if (response.status === 200) {
                                    let jsonData = parseJSON(response.response).sentences;
                                    const validationError = validateApiResponse(jsonData);
                                    if (!validationError) {
                                        state.apiDataFetched = true;
                                        console.log(jsonData)
                                        // check if the sentence is in the vocab
                                        const sentenceResults = await Promise.all(
                                            jsonData.map(async sentence => {
                                                return await preprocessSentence(sentence, reading, vocab);
                                            }))
                                        jsonData = sentenceResults.filter(s => s);
                                        if (jsonData && jsonData.length > 0) {
                                            for (let i = 0; i < jsonData.length; i++) {
                                                state.examples.push(jsonData[i]);
                                            }
                                        }
                                        await IndexedDBManager.save(db, searchVocab, jsonData);
                                        resolve();
                                    } else {
                                        attempt++;
                                        if (attempt < maxRetries) {
                                            console.log(`Validation error: ${validationError}. Retrying... (${attempt}/${maxRetries})`);
                                            setTimeout(fetchData, 5000); // Add a 5-second delay before retrying
                                        } else {
                                            reject(`Invalid API response after ${maxRetries} attempts: ${validationError}`);
                                            state.error = true;
                                            embedImageAndPlayAudio(); //update displayed text
                                        }
                                    }
                                } else {
                                    console.error(`Failed to call api :`);
                                    console.error(response);
                                    reject(`API call failed with status: ${response.status}`);
                                }
                            },
                            onerror: function (error) {
                                reject(`An error occurred: ${error}`);
                            }
                        });
                    }
                } catch (error) {
                    reject(`Error: ${error}`);
                }
            }

            await fetchData();
        });
    }

    function parseJSON(responseText) {
        try {
            return JSON.parse(responseText);
        } catch (e) {
            console.error('Error parsing JSON:', e);
            return null;
        }
    }

    function validateApiResponse(jsonData) {
        state.error = false;
        if (!jsonData) {
            return 'Not a valid JSON';
        }
        const categoryCount = jsonData.length;
        if (!categoryCount) {
            return 'Missing category count';
        }

        // Check if all category counts are zero
        const allZero = categoryCount === 0;
        if (allZero) {
            return 'Blank API';
        }

        return null; // No error
    }

    async function checkIfNames(sargusData) {
        return await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: apiBaseUrl + "/check_names",
                data: JSON.stringify(sargusData),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    if (response.status === 200) {
                        try {
                            const names = JSON.parse(response.responseText);
                            if (Array.isArray(names)) {
                                resolve(names);
                            } else {
                                console.error("Invalid response format, expected an array:", names);
                                reject(null);
                            }
                        } catch (e) {
                            console.error("Error parsing response as JSON:", e);
                            reject(null);
                        }
                    } else {
                        console.error("Error checking if names :", response.responseText);
                        reject(null);
                    }
                }
            });
        });
    }

    function katakanaToHiragana(str) {
        const table = {'ア': 'あ', 'イ': 'い', 'ウ': 'う', 'エ': 'え', 'オ': 'お', 'カ': 'か', 'キ': 'き', 'ク': 'く', 'ケ': 'け', 'コ': 'こ', 'サ': 'さ', 'シ': 'し', 'ス': 'す', 'セ': 'せ', 'ソ': 'そ', 'タ': 'た', 'チ': 'ち', 'ツ': 'つ', 'テ': 'て', 'ト': 'と', 'ナ': 'な', 'ニ': 'に', 'ヌ': 'ぬ', 'ネ': 'ね', 'ノ': 'の', 'ハ': 'は', 'ヒ': 'ひ', 'フ': 'ふ', 'ヘ': 'へ', 'ホ': 'ほ', 'マ': 'ま', 'ミ': 'み', 'ム': 'む', 'メ': 'め', 'モ': 'も', 'ヤ': 'や', 'ユ': 'ゆ', 'ヨ': 'よ', 'ラ': 'ら', 'リ': 'り', 'ル': 'る', 'レ': 'れ', 'ロ': 'ろ', 'ワ': 'わ', 'ヲ': 'を', 'ン': 'ん', 'ァ': 'ぁ', 'ィ': 'ぃ', 'ゥ': 'ぅ', 'ェ': 'ぇ', 'ォ': 'ぉ', 'ャ': 'ゃ', 'ュ': 'ゅ', 'ョ': 'ょ', 'ヮ': 'ゎ', 'ッ': 'っ', 'ー': 'ー', 'ガ': 'が', 'ギ': 'ぎ', 'グ': 'ぐ', 'ゲ': 'げ', 'ゴ': 'ご', 'ザ': 'ざ', 'ジ': 'じ', 'ズ': 'ず', 'ゼ': 'ぜ', 'ゾ': 'ぞ', 'ダ': 'だ', 'ヂ': 'ぢ', 'ヅ': 'づ', 'デ': 'で', 'ド': 'ど', 'バ': 'ば', 'ビ': 'び', 'ブ': 'ぶ', 'ベ': 'べ', 'ボ': 'ぼ', 'パ': 'ぱ', 'ピ': 'ぴ', 'プ': 'ぷ', 'ペ': 'ぺ', 'ポ': 'ぽ', 'ヴ': 'ゔ'}
        return str.split('').map(char => table[char] || char).join('');
    }

    async function preprocessSentence(sentence, reading_ = state.reading, vocab_ = state.vocab) {
        const content = sentence.segment_info.content_jp;
        // Set weights for each sentence by calling checking jpdb history data
        const db = await IndexedDBManager.open();
        let datas = (await IndexedDBManager.get(db, "jpdb-imported-data"));
        if (CONFIG.WEIGHTED_SENTENCES && datas && datas[0]) {
            datas = datas[0];
            let vocabInSentence = false;
            await processJPDBData(sentence);

            async function processJPDBData(sentence) {
                return await new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: apiBaseUrl + "/parse",
                        data: JSON.stringify({
                            "sentence": content,
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        },
                        onload: function (response) {
                            let weight = 1;
                            if (response.status === 200) {
                                try {
                                    const vocab = JSON.parse(response.responseText);
                                    if (vocab.length > 0) {
                                        let matchCount = 0;
                                        let furi_sentence = ""
                                        const difficulty = vocab[0].split(' ')[2];
                                        for (const item of vocab) {
                                            const spelling = item.split(' ')[0];
                                            const reading = katakanaToHiragana(item.split(' ')[1]) || '';
											const specialChars = ['ー', '、', '。','─','》','《']; // extend as needed
											  if (specialChars.includes(spelling)) {
											    furi_sentence += `<ruby>${spelling}</ruby>`;
											  } else {
											    furi_sentence += `<ruby>${spelling}<rt>${reading}</rt></ruby>`;
											  }
                                            vocabInSentence = true;
                                            if (!reading_) {
                                                vocabInSentence = true;
                                            } else if (spelling && reading && (spelling.includes(vocab_) && reading.includes(reading_))) {
                                                vocabInSentence = true;
                                            }
                                            if (datas && datas[`${spelling}|${reading}`] !== undefined) {
                                                matchCount += datas[`${spelling}|${reading}`];
                                            }
                                        }
                                        sentence.furi_sentence = furi_sentence;
                                        // increase weight when ratio of matched vocab to total vocab is high and reduce when difficuly is high
                                        weight = Math.min(1, matchCount / vocab.length);
                                        weight = Math.min(1, weight * (1 - (parseInt(difficulty) / 10)));
                                        console.log(`Sentence "${content}" has weight: ${weight.toFixed(2)} based on ${matchCount} matches out of ${vocab.length} vocab items with difficulty ${difficulty}.`);
                                    }
                                    else {
                                        console.error("Error parsing parse response, got empty vocab array :", response.responseText);
                                        sentence.weight = -10
                                    }
                                } catch (e) {
                                    console.error("Error parsing parse response, got :",response.responseText, e);
                                }
                            }
                            else {
                                console.error("Error parsing parse response :", response.responseText);
                            }
                            sentence.weight = weight;
                            resolve();
                        },
                        onerror: function () {
                            sentence.weight = 1;
                            resolve();
                        }
                    });
                });
            }

            // if vocabInSentence is false, remove sentence from the examples
            if (!vocabInSentence) {
                console.log(`Skipping sentence "${content}" because it does not contain the vocab "${vocab_}" or reading "${reading_}".`);
                return null;
            }
        }
        else {
            sentence.weight = 1;
            console.log(`Skipping sentence "${content} because ${CONFIG.WEIGHTED_SENTENCES ? "no JPDB data found" : "weighting is disabled"}."`);
        }
        return sentence;
    }

    // PARSE VOCAB FUNCTIONS =====================================================================================================================
    function parseVocabFromAnswer() {
        // Select all links containing "/kanji/" or "/vocabulary/" in the href attribute
        const elements = document.querySelectorAll('a[href*="/kanji/"], a[href*="/vocabulary/"]');
        console.log("Parsing Answer Page");

        // Iterate through the matched elements
        for (const element of elements) {
            const href = element.getAttribute('href');
            const rubyElements = element.querySelectorAll('ruby');

            // Match the href to extract kanji or vocabulary (ignoring ID if present)
            const match = href.match(/\/(kanji|vocabulary)\/(?:\d+\/)?([^\#]*)#/);

            // If ruby elements exist, extract vocab and reading
            if (rubyElements.length > 0) {
                let vocabulary = "";
                const reading = Array.from(rubyElements)
                    .map(ruby => {
                        const rtElement = ruby.querySelector('rt');
                        vocabulary = vocabulary + (ruby.childNodes[0] ? ruby.childNodes[0].textContent.trim() : '');

                        if (rtElement) {
                            return rtElement.textContent.trim();
                        } else {
                            return ruby.textContent.trim();
                        }
                    })
                    .join('');

                return [vocabulary, reading];
            }

            // If match exists in href, return that as both vocab and reading
            if (match) {
                const vocab = match[2].trim();
                return [vocab, vocab];
            }

            // Return text content as both vocab and reading if nothing else found
            const text = element.textContent.trim();
            if (text) {
                return [text, text];
            }
        }
        return ['', ''];
    }

    function parseVocabFromReview() {
        console.log("Parsing Review Page");

        // Select the element with class 'kind' to determine the type of content
        const kindElement = document.querySelector('.kind');

        // If kindElement doesn't exist, set kindText to null
        const kindText = kindElement ? kindElement.textContent.trim() : null;

        // Accept 'Kanji' or 'Vocabulary' kindText
        if (kindText !== 'Kanji' && kindText !== 'Vocabulary') {
            console.log("Not Kanji or existing Vocabulary. Attempting to parse New Vocab.");

            // Attempt to parse from <a> tag with specific pattern
            const anchorElement = document.querySelector('a.plain[href*="/vocabulary/"]');

            if (anchorElement) {
                const href = anchorElement.getAttribute('href');

                const match = href.match(/\/vocabulary\/\d+\/([^#]+)#a/);

                if (match && match[1]) {
                    const new_vocab = match[1];
                    console.log("Found New Vocab:", new_vocab);
                    return new_vocab;
                }
            }

            console.log("No Vocabulary found.");
            return '';
        }

        if (kindText === 'Vocabulary') {
            // Select the element with class 'plain' to extract vocabulary
            const plainElement = document.querySelector('.plain');
            if (!plainElement) {
                return '';
            }
            const rubyElements = plainElement.querySelectorAll('ruby');
            // if not ruby elements, return the text content of the plain element twice (katakana word)
            if (rubyElements.length === 0) {
                const vocabText = plainElement.textContent.trim();
                console.log("Found Vocabulary:", vocabText);
                return [vocabText, vocabText];
            }
            // Extract the text from <rt> children and join them.
            let vocabulary = "";


            const reading = Array.from(rubyElements)
                .map(ruby => {
                    const rtElement = ruby.querySelector('rt');
                    // add the text not in the <rt> tag to the vocabulary
                    vocabulary = vocabulary + (ruby.childNodes[0] ? ruby.childNodes[0].textContent.trim() : '');

                    if (rtElement) {
                        rtElement.style.display = 'none';
                        return rtElement.textContent.trim();
                    } else {
                        return ruby.textContent.trim();
                    }
                })
                .join('');

            // Regular expression to check if the vocabulary contains kanji characters
            const kanjiRegex = /[\u4e00-\u9faf\u3400-\u4dbf]/;
            if (kanjiRegex.test(vocabulary) || vocabulary) {
                console.log("Found Vocabulary:", vocabulary);
                return [vocabulary, reading];
            }
        } else if (kindText === 'Kanji') {
            // Select the hidden input element to extract kanji
            const hiddenInput = document.querySelector('input[name="c"]');
            if (!hiddenInput) {
                return '';
            }

            const vocab = hiddenInput.value.split(',')[1];
            const kanjiRegex = /[\u4e00-\u9faf\u3400-\u4dbf]/;
            if (kanjiRegex.test(vocab)) {
                console.log("Found Kanji:", vocab);
                return vocab;
            }
        }

        console.log("No Vocabulary or Kanji found.");
        return '';
    }

    function parseVocabFromVocabulary() {
        // Get the current URL
        let url = window.location.href;

        // Remove query parameters (e.g., ?lang=english) and fragment identifiers (#)
        url = url.split('?')[0].split('#')[0];

        // Match the URL structure for a vocabulary page
        const match = url.match(/https:\/\/jpdb\.io\/vocabulary\/(\d+)\/([^\#\/]*)\/([^\#\/]*)/);
        console.log("Parsing Vocabulary Page");

        if (match) {
            // Extract and decode the vocabulary part from the URL
            let vocab = match[2];
            state.embedAboveSubsectionMeanings = true; // Set state flag
            let reading = match[3];
            return [decodeURIComponent(vocab), decodeURIComponent(reading)];
        }

        // Return empty string if no match
        return '';
    }

    function parseVocabFromKanji() {
        // Get the current URL
        const url = window.location.href;

        // Match the URL structure for a kanji page
        const match = url.match(/https:\/\/jpdb\.io\/kanji\/(\d+)\/([^\#]*)#a/);
        console.log("Parsing Kanji Page");

        if (match) {
            // Extract and decode the kanji part from the URL
            let kanji = match[2];
            state.embedAboveSubsectionMeanings = true; // Set state flag
            kanji = kanji.split('/')[0];
            return decodeURIComponent(kanji);
        }

        // Return empty string if no match
        return '';
    }

    function parseVocabFromSearch() {
        // Get the current URL
        let url = window.location.href;

        // Match the URL structure for a search query, capturing the vocab between `?q=` and either `&` or `+`
        const match = url.match(/https:\/\/jpdb\.io\/search\?q=([^&+]*)/);
        console.log("Parsing Search Page");

        if (match) {
            // Extract and decode the vocabulary part from the URL
            let vocab = match[1];
            return decodeURIComponent(vocab);
        }

        // Return empty string if no match
        return '';
    }


    //EMBED FUNCTIONS=====================================================================================================================
    function createAnchor(marginLeft) {
        // Create and style an anchor element
        const anchor = document.createElement('a');
        anchor.href = '#';
        anchor.style.border = '0';
        anchor.style.display = 'inline-flex';
        anchor.style.verticalAlign = 'middle';
        anchor.style.marginLeft = marginLeft;
        return anchor;
    }

    function createIcon(iconClass, fontSize = '1.4rem', color = '#3d81ff') {
        // Create and style an icon element
        const icon = document.createElement('i');
        icon.className = iconClass;
        icon.style.fontSize = fontSize;
        icon.style.opacity = '1.0';
        icon.style.verticalAlign = 'baseline';
        icon.style.color = color;
        return icon;
    }

    function createSpeakerButton(soundUrl) {
        // Create a speaker button with an icon and click event for audio playback
        const anchor = createAnchor('0.5rem');
        const icon = createIcon('ti ti-volume');
        anchor.appendChild(icon);
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            playAudio(soundUrl);
        });
        return anchor;
    }

    function createMenuButton() {
        // Create a menu button with a dropdown menu
        const anchor = createAnchor('0.5rem');
        const menuIcon = document.createElement('span');
        menuIcon.innerHTML = '☰';

        // Style the menu icon
        menuIcon.style.fontSize = '1.4rem';
        menuIcon.style.color = '#3D8DFF';
        menuIcon.style.verticalAlign = 'middle';
        menuIcon.style.position = 'relative';
        menuIcon.style.top = '-2px';

        // Append the menu icon to the anchor and set up the click event to show the overlay menu
        anchor.appendChild(menuIcon);
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            const overlay = createOverlayMenu();
            document.body.appendChild(overlay);
        });

        return anchor;
    }

    function createTextButton(vocab) {
        // Create a text button for Nadeshiko
        const textButton = document.createElement('a');
        textButton.textContent = 'Nadeshiko';
        textButton.style.color = 'var(--subsection-label-color)';
        textButton.style.fontSize = '85%';
        textButton.style.marginRight = '0.5rem';
        textButton.style.verticalAlign = 'middle';
        textButton.href = `https://nadeshiko.co/search/sentence?query=${encodeURIComponent(vocab)}`;
        textButton.target = '_blank';
        return textButton;
    }

    function createButtonContainer(soundUrl, vocab) {
        // Create a container for all buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.marginBottom = '5px';
        buttonContainer.style.lineHeight = '1.4rem';

        // Create individual buttons
        const menuButton = createMenuButton();
        const textButton = createTextButton(vocab);
        const speakerButton = createSpeakerButton(soundUrl);


        // Center the buttons within the container
        const centeredButtonsWrapper = document.createElement('div');
        centeredButtonsWrapper.style.display = 'flex';
        centeredButtonsWrapper.style.justifyContent = 'center';
        centeredButtonsWrapper.style.flex = '1';

        centeredButtonsWrapper.append(textButton, speakerButton);
        buttonContainer.append(centeredButtonsWrapper, menuButton);

        return buttonContainer;
    }

    function stopCurrentAudio() {
        // Stop any currently playing audio
        if (state.currentAudio) {
            state.currentAudio.source.stop();
            state.currentAudio.context.close();
            state.currentAudio = null;
        }
    }

    function playAudio(soundUrl) {
        // Skip playing audio if it is already playing
        if (state.currentlyPlayingAudio) {
            //console.log('Duplicate audio was skipped.');
            return;
        }

        if (soundUrl) {
            state.currentlyPlayingAudio = true;
            stopCurrentAudio();

            GM_xmlhttpRequest({
                method: 'GET',
                url: soundUrl,
                responseType: 'arraybuffer',
                onload: function (response) {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    const audioContext = new AudioContext();
                    audioContext.decodeAudioData(response.response, function (buffer) {
                        const source = audioContext.createBufferSource();
                        source.buffer = buffer;

                        const gainNode = audioContext.createGain();

                        // Connect the source to the gain node and the gain node to the destination
                        source.connect(gainNode);
                        gainNode.connect(audioContext.destination);

                        // Mute the first part and then ramp up the volume
                        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                        gainNode.gain.linearRampToValueAtTime(CONFIG.SOUND_VOLUME / 100, audioContext.currentTime + 0.1);

                        // Play the audio, skip the first part to avoid any "pop"
                        source.start(0, 0.05);

                        // Log when the audio starts playing
                        //console.log('Audio has started playing.');

                        // Save the current audio context and source for stopping later
                        state.currentAudio = {
                            context: audioContext,
                            source: source
                        };

                        // Set currentlyPlayingAudio to false when the audio ends
                        source.onended = function () {
                            state.currentlyPlayingAudio = false;
                        };
                    }, function (error) {
                        console.error('Error decoding audio:', error);
                        state.currentlyPlayingAudio = false;
                    });
                },
                onerror: function (error) {
                    console.error('Error fetching audio:', error);
                    state.currentlyPlayingAudio = false;
                }
            });
        }
    }

    // has to be declared (referenced in multiple functions but definition requires variables local to one function)
    let hotkeysListener;

    function renderImageAndPlayAudio(vocab, shouldAutoPlaySound) {
        if (state.examples.length === 0) {
            console.log("No data");
            // replace text by no data
            const sentenceElement = document.querySelector('.sentence');
            if (sentenceElement) {
                    sentenceElement.textContent = 'NO DATA';
                // Update translation class content with actual translation text
                const translationElement = document.querySelector('.sentence-translation');
                if (translationElement) {
                    translationElement.remove()
                }
            }
            return;
        }
        const example = state.examples[state.currentExampleIndex] || {};
        const imageUrl = example.media_info?.path_image || null;
        const soundUrl = example.media_info?.path_audio || null;
        const sentence = example.segment_info?.content_jp || null;
        const translation = example.segment_info?.content_en || "";
        const sentence_furi = example.furi_sentence || sentence;
        const deck_name = example.basic_info?.name_anime_romaji || "Unknown Anime";
        console.log(sentence,state.isFront)
        // Update sentence class content with actual sentence text
        const sentenceElement = document.querySelector('.sentence');
        if (sentenceElement) {
            if ((state.isFront && CONFIG.FURIGANA_ON_FRONT_SIDE) || (!state.isFront && CONFIG.FURIGANA_ON_BACKSIDE)) {
                sentenceElement.innerHTML = sentence_furi;
            } else {
                sentenceElement.textContent = sentence;
            }
            // Update translation class content with actual translation text
            const translationElement = document.querySelector('.sentence-translation');
            if (translationElement) {
                translationElement.textContent = translation;
            }
            else if (!state.isFront)
            {
                // get div above .card-sentence
                const divAbove = sentenceElement.parentElement.parentElement;
                if (divAbove) {
                    const translationDiv = document.createElement('div');
                    translationDiv.style.display = 'flex';
                    translationDiv.style.justifyContent = 'center';
                    if (CONFIG.BLUR_EXAMPLE_SENTENCE)
                        translationDiv.innerHTML = `<div class="sentence-translation blur" style="" onclick="this.classList.remove('blur');" onmouseover="this.classList.remove('blur');">${translation}</div>`;
                    else
                        translationDiv.innerHTML = `<div class="sentence-translation" style="">${translation}</div>`;
                    divAbove.appendChild(translationDiv);
                }
            }
        } else {
            const answerBox = document.querySelector('.answer-box');
            if (answerBox) {
                // create div style="display: flex; justify-content: center;"
                const sentenceDiv = document.createElement('div');
                sentenceDiv.style.display = 'flex';
                sentenceDiv.style.justifyContent = 'center';
                let content;
                 if ((state.isFront && CONFIG.FURIGANA_ON_FRONT_SIDE) || (!state.isFront && CONFIG.FURIGANA_ON_BACKSIDE)) {
                     content = sentence_furi;
                 } else {
                     content = sentence;
                 }
                sentenceDiv.innerHTML = `<div style="display: flex;"><div style="display: flex; flex-direction: column;"><div style="display: flex; align-items: baseline; column-gap: 0.25rem;" class="card-sentence"><div class="sentence" style="margin-left: 0.3rem;">${content}</div><a class="icon-link" href="/edit-shown-sentence?v=1168870&amp;s=3448502455&amp;r=1858493110&amp;origin=%2Freview%3Fc%3Dvf%2C1168870%2C3448502455%26r%3D2"><i class="ti ti-pencil"></i></a></div><div style="display: flex;justify-content: center;"><div class="sentence-translation blur" style="" onclick="this.classList.remove('blur');" onmouseover="this.classList.remove('blur');">${translation}</div></div></div></div>`;
                answerBox.appendChild(sentenceDiv);

            }
        }

        // Remove any existing container
        removeExistingContainer();
        if (!shouldRenderContainer()) {
            return;
        }

        // Create and append the main wrapper and text button container
        const wrapperDiv = createWrapperDiv();
        const textDiv = createButtonContainer(soundUrl, vocab);
        wrapperDiv.appendChild(textDiv);


        const createTextElement = (text) => {
            const textElement = document.createElement('div');
            textElement.textContent = text;
            textElement.style.padding = '100px 0';
            textElement.style.whiteSpace = 'pre'; // Ensures newlines are respected
            return textElement;
        };
        if (state.apiDataFetched) {
            if (imageUrl) {
                const imageElement = createImageElement(wrapperDiv, imageUrl, vocab, state.exactSearch);
                if (imageElement) {
                    imageElement.addEventListener('click', () => playAudio(soundUrl));
                }
            } else {
                wrapperDiv.appendChild(createTextElement(`NO IMAGE\n(${deck_name})`));
            }
            // Append sentence and translation or a placeholder text
            // sentence ? appendSentenceAndTranslation(wrapperDiv, sentence, translation) : appendNoneText(wrapperDiv);
        } else if (!sentence) {
            wrapperDiv.appendChild(createTextElement('ERROR\nNO EXAMPLES FOUND\n\nRARE WORD OR NADESHIKO API IS TEMPORARILY DOWN'));
        } else {
            wrapperDiv.appendChild(createTextElement('LOADING'));
        }


        // Create navigation elements
        const navigationDiv = createNavigationDiv();
        const leftArrow = createLeftArrow(vocab, shouldAutoPlaySound);
        const rightArrow = createRightArrow(vocab, shouldAutoPlaySound);

        // Create and append the main container
        const containerDiv = createContainerDiv(leftArrow, wrapperDiv, rightArrow, navigationDiv);
        appendContainer(containerDiv);

        // Auto-play sound if configured
        if (CONFIG.AUTO_PLAY_SOUND && shouldAutoPlaySound) {
            playAudio(soundUrl);
        }

        // Link hotkeys
        if (CONFIG.HOTKEYS.indexOf("None") === -1) {
            const leftHotkey = CONFIG.HOTKEYS[0];
            const rightHotkey = CONFIG.HOTKEYS[1];

            hotkeysListener = (event) => {
                if (event.repeat) {
                    return;
                }
                switch (event.key.toLowerCase()) {
                    case leftHotkey.toLowerCase():
                        if (leftArrow.disabled) {
                            // listener gets removed, so need to re-add
                            window.addEventListener('keydown', hotkeysListener, {once: true});
                        } else {
                            leftArrow.click(); // don't need to re-add listener because renderImageAndPlayAudio() will run again
                        }
                        break;
                    case rightHotkey.toLowerCase():
                        if (rightArrow.disabled) {
                            // listener gets removed, so need to re-add
                            window.addEventListener('keydown', hotkeysListener, {once: true});
                        } else {
                            rightArrow.click(); // don't need to re-add listener because renderImageAndPlayAudio() will run again
                        }
                        break;
                    default:
                        // listener gets removed, so need to re-add
                        window.addEventListener('keydown', hotkeysListener, {once: true});
                }
            };

            window.addEventListener('keydown', hotkeysListener, {once: true});
        }
    }

    function removeExistingContainer() {
        // Remove the existing container if it exists
        const existingContainer = document.getElementById('nadeshiko-container');
        if (existingContainer) {
            existingContainer.remove();
        }
        window.removeEventListener('keydown', hotkeysListener);
    }

    function shouldRenderContainer() {
        // Determine if the container should be rendered based on the presence of certain elements
        const resultVocabularySection = document.querySelector('.result.vocabulary');
        const hboxWrapSection = document.querySelector('.hbox.wrap');
        const subsectionMeanings = document.querySelector('.subsection-meanings');
        const subsectionLabels = document.querySelectorAll('h6.subsection-label');
        return resultVocabularySection || hboxWrapSection || subsectionMeanings || subsectionLabels.length >= 3;
    }

    function createWrapperDiv() {
        // Create and style the wrapper div
        const wrapperDiv = document.createElement('div');
        wrapperDiv.id = 'image-wrapper';
        wrapperDiv.style.textAlign = 'center';
        wrapperDiv.style.padding = '5px 0';
        return wrapperDiv;
    }

    function createImageElement(wrapperDiv, imageUrl, vocab, exactSearch) {
        // Create and return an image element with specified attributes
        const searchVocab = exactSearch ? `「${vocab}」` : vocab;
        const example = state.examples[state.currentExampleIndex] || {};
        const deck_name = example.basic_info.name_anime_romaji || null;

        // Extract the file name from the URL
        let file_name = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

        // Remove prefixes "Anime_", "A_", or "Z" from the file name
        file_name = file_name.replace(/^(Anime_|A_|Z)/, '');

        const titleText = `${searchVocab} #${state.currentExampleIndex + 1} \n${deck_name} \n${file_name}`;

        return GM_addElement(wrapperDiv, 'img', {
            src: imageUrl,
            alt: 'Embedded Image',
            title: titleText,
            style: `max-width: ${CONFIG.IMAGE_WIDTH}; margin-top: 10px; cursor: pointer;`
        });
    }

    function createNavigationDiv() {
        // Create and style the navigation div
        const navigationDiv = document.createElement('div');
        navigationDiv.id = 'nadeshiko-embed';
        navigationDiv.style.display = 'flex';
        navigationDiv.style.justifyContent = 'center';
        navigationDiv.style.alignItems = 'center';
        navigationDiv.style.maxWidth = CONFIG.IMAGE_WIDTH;
        navigationDiv.style.margin = '0 auto';
        return navigationDiv;
    }

    function createLeftArrow(vocab, shouldAutoPlaySound) {
        // Create and configure the left arrow button
        const leftArrow = document.createElement('button');
        leftArrow.textContent = '<';
        leftArrow.style.marginRight = '10px';
        leftArrow.style.width = CONFIG.ARROW_WIDTH;
        leftArrow.style.height = CONFIG.ARROW_HEIGHT;
        leftArrow.style.lineHeight = '25px';
        leftArrow.style.textAlign = 'center';
        leftArrow.style.display = 'flex';
        leftArrow.style.justifyContent = 'center';
        leftArrow.style.alignItems = 'center';
        leftArrow.style.padding = '0'; // Remove padding
        leftArrow.disabled = state.currentExampleIndex === 0;
        leftArrow.addEventListener('click', () => {
            if (state.currentExampleIndex > 0) {
                state.currentExampleIndex--;
                state.currentlyPlayingAudio = false;
                renderImageAndPlayAudio(vocab, shouldAutoPlaySound);
                preloadImages();
            }
        });
        return leftArrow;
    }

    function createRightArrow(vocab, shouldAutoPlaySound) {
        // Create and configure the right arrow button
        const rightArrow = document.createElement('button');
        rightArrow.textContent = '>';
        rightArrow.style.marginLeft = '10px';
        rightArrow.style.width = CONFIG.ARROW_WIDTH;
        rightArrow.style.height = CONFIG.ARROW_HEIGHT;
        rightArrow.style.lineHeight = '25px';
        rightArrow.style.textAlign = 'center';
        rightArrow.style.display = 'flex';
        rightArrow.style.justifyContent = 'center';
        rightArrow.style.alignItems = 'center';
        rightArrow.style.padding = '0'; // Remove padding
        rightArrow.disabled = state.currentExampleIndex >= state.examples.length - 1;
        rightArrow.addEventListener('click', () => {
            if (state.currentExampleIndex < state.examples.length - 1) {
                state.currentExampleIndex++;
                state.currentlyPlayingAudio = false;
                renderImageAndPlayAudio(vocab, shouldAutoPlaySound);
                preloadImages();
            }
        });
        return rightArrow;
    }

    function createContainerDiv(leftArrow, wrapperDiv, rightArrow, navigationDiv) {
        // Create and configure the main container div
        const containerDiv = document.createElement('div');
        containerDiv.id = 'nadeshiko-container';
        containerDiv.style.display = 'flex';
        containerDiv.style.alignItems = 'center';
        containerDiv.style.justifyContent = 'center';
        containerDiv.style.flexDirection = 'column';

        const arrowWrapperDiv = document.createElement('div');
        arrowWrapperDiv.style.display = 'flex';
        arrowWrapperDiv.style.alignItems = 'center';
        arrowWrapperDiv.style.justifyContent = 'center';

        arrowWrapperDiv.append(leftArrow, wrapperDiv, rightArrow);
        containerDiv.append(arrowWrapperDiv, navigationDiv);

        return containerDiv;
    }

    function appendContainer(containerDiv) {
        // Append the container div to the appropriate section based on configuration
        const resultVocabularySection = document.querySelector('.result.vocabulary');
        const hboxWrapSection = document.querySelector('.hbox.wrap');
        const subsectionMeanings = document.querySelector('.subsection-meanings');
        const subsectionComposedOfKanji = document.querySelector('.subsection-composed-of-kanji');
        const subsectionPitchAccent = document.querySelector('.subsection-pitch-accent');
        const subsectionLabels = document.querySelectorAll('h6.subsection-label');
        const vboxGap = document.querySelector('.vbox.gap');
        const styleSheet = document.querySelector('link[rel="stylesheet"]').sheet;

        if (CONFIG.WIDE_MODE && subsectionMeanings) {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'flex-start';
            styleSheet.insertRule('.subsection-meanings { max-width: none !important; }', styleSheet.cssRules.length);

            const originalContentWrapper = document.createElement('div');
            originalContentWrapper.style.flex = '1';
            originalContentWrapper.appendChild(subsectionMeanings);

            if (subsectionComposedOfKanji) {
                const newline1 = document.createElement('br');
                originalContentWrapper.appendChild(newline1);
                originalContentWrapper.appendChild(subsectionComposedOfKanji);
            }
            if (subsectionPitchAccent) {
                const newline2 = document.createElement('br');
                originalContentWrapper.appendChild(newline2);
                originalContentWrapper.appendChild(subsectionPitchAccent);
            }

            if (CONFIG.DEFINITIONS_ON_RIGHT_IN_WIDE_MODE) {
                wrapper.appendChild(containerDiv);
                wrapper.appendChild(originalContentWrapper);
            } else {
                wrapper.appendChild(originalContentWrapper);
                wrapper.appendChild(containerDiv);
            }

            if (vboxGap) {
                const existingDynamicDiv = vboxGap.querySelector('#dynamic-content');
                if (existingDynamicDiv) {
                    existingDynamicDiv.remove();
                }

                const dynamicDiv = document.createElement('div');
                dynamicDiv.id = 'dynamic-content';
                dynamicDiv.appendChild(wrapper);

                if (window.location.href.includes('vocabulary')) {
                    vboxGap.insertBefore(dynamicDiv, vboxGap.children[1]);
                } else {
                    vboxGap.insertBefore(dynamicDiv, vboxGap.firstChild);
                }
            }
        } else {
            if (state.embedAboveSubsectionMeanings && subsectionMeanings) {
                subsectionMeanings.parentNode.insertBefore(containerDiv, subsectionMeanings);
            } else if (resultVocabularySection) {
                resultVocabularySection.parentNode.insertBefore(containerDiv, resultVocabularySection);
            } else if (hboxWrapSection) {
                hboxWrapSection.parentNode.insertBefore(containerDiv, hboxWrapSection);
            } else if (subsectionLabels.length >= 4) {
                subsectionLabels[3].parentNode.insertBefore(containerDiv, subsectionLabels[3]);
            }
        }
    }

    function embedImageAndPlayAudio() {
        // Embed the image and play audio, removing existing navigation div if present
        console.log("Embedding image and playing audio");
        const existingNavigationDiv = document.getElementById('nadeshiko-embed');
        if (existingNavigationDiv) {
            existingNavigationDiv.remove();
        }

        const reviewUrlPattern = /https:\/\/jpdb\.io\/review(#a)?$/;

        renderImageAndPlayAudio(state.vocab, !reviewUrlPattern.test(window.location.href));
        preloadImages();
    }

    function preloadImages() {
        // Preload images around the current example index
        const preloadDiv = GM_addElement(document.body, 'div', {style: 'display: none;'});
        const startIndex = Math.max(0, state.currentExampleIndex - CONFIG.NUMBER_OF_PRELOADS);
        const endIndex = Math.min(state.examples.length - 1, state.currentExampleIndex + CONFIG.NUMBER_OF_PRELOADS);

        for (let i = startIndex; i <= endIndex; i++) {
            if (!state.preloadedIndices.has(i) && state.examples[i].image_url) {
                GM_addElement(preloadDiv, 'img', {src: state.examples[i].image_url});
                state.preloadedIndices.add(i);
            }
        }
    }


    //MENU FUNCTIONS=====================================================================================================================

    function handleImportDButtonClick() {
        handleFileInput('application/json', importData);
    }

    function handleFileInput(acceptType, callback) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = acceptType;
        fileInput.addEventListener('change', callback);
        fileInput.click();
    }

    function createBlobAndDownload(data, filename, type) {
        const blob = new Blob([data], {type});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async function exportData() {
        const dataEntries = {};

        try {
            const db = await IndexedDBManager.open();
            const indexedDBData = await IndexedDBManager.getAll(db);
            indexedDBData.forEach(item => {
                dataEntries[item.keyword] = item.data;
            });

            const data = JSON.stringify(dataEntries, null, 2);
            createBlobAndDownload(data, 'data.json', 'application/json');
        } catch (error) {
            console.error('Error exporting data from IndexedDB:', error);
        }
    }

    async function importData(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = async function (e) {
            try {
                const dataEntries = JSON.parse(e.target.result);

                const db = await IndexedDBManager.open();
                for (const key in dataEntries) {
                    await IndexedDBManager.save(db, key, dataEntries[key]);
                }

                alert('Data imported successfully!');
                location.reload();
            } catch (error) {
                alert('Error importing data:', error);
            }
        };
        reader.readAsText(file);
    }


    ////CONFIRMATION
    function createConfirmationPopup(messageText, onYes, onNo) {
        // Create a confirmation popup with Yes and No buttons
        const popupOverlay = document.createElement('div');
        popupOverlay.style.position = 'fixed';
        popupOverlay.style.top = '0';
        popupOverlay.style.left = '0';
        popupOverlay.style.width = '100%';
        popupOverlay.style.height = '100%';
        popupOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        popupOverlay.style.zIndex = '1001';
        popupOverlay.style.display = 'flex';
        popupOverlay.style.justifyContent = 'center';
        popupOverlay.style.alignItems = 'center';

        const popupContent = document.createElement('div');
        popupContent.style.backgroundColor = 'var(--background-color)';
        popupContent.style.padding = '20px';
        popupContent.style.borderRadius = '5px';
        popupContent.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        popupContent.style.textAlign = 'center';

        const message = document.createElement('p');
        message.textContent = messageText;

        const yesButton = document.createElement('button');
        yesButton.textContent = 'Yes';
        yesButton.style.backgroundColor = '#C82800';
        yesButton.style.marginRight = '10px';
        yesButton.addEventListener('click', () => {
            onYes();
            document.body.removeChild(popupOverlay);
        });

        const noButton = document.createElement('button');
        noButton.textContent = 'No';
        noButton.addEventListener('click', () => {
            onNo();
            document.body.removeChild(popupOverlay);
        });

        popupContent.appendChild(message);
        popupContent.appendChild(yesButton);
        popupContent.appendChild(noButton);
        popupOverlay.appendChild(popupContent);

        document.body.appendChild(popupOverlay);
    }

    ////BUTTONS
    function createActionButtonsContainer() {
        const actionButtonWidth = '100px';

        const closeButton = createButton('Close', '10px', closeOverlayMenu, actionButtonWidth);
        const saveButton = createButton('Save', '10px', saveConfig, actionButtonWidth);
        const defaultButton = createDefaultButton(actionButtonWidth);
        const deleteButton = createDeleteButton(actionButtonWidth);

        const actionButtonsContainer = document.createElement('div');
        actionButtonsContainer.style.textAlign = 'center';
        actionButtonsContainer.style.marginTop = '10px';
        actionButtonsContainer.append(closeButton, saveButton, defaultButton, deleteButton);

        return actionButtonsContainer;
    }

    function createMenuButtons() {
        const dataContainer = createDataContainer();
        const actionButtonsContainer = createActionButtonsContainer();

        const buttonContainer = document.createElement('div');
        buttonContainer.append(dataContainer, actionButtonsContainer);

        return buttonContainer;
    }

    function createButton(text, margin, onClick, width) {
        // Create a button element with specified properties
        const button = document.createElement('button');
        button.textContent = text;
        button.style.margin = margin;
        button.style.width = width;
        button.style.textAlign = 'center';
        button.style.display = 'inline-block';
        button.style.lineHeight = '30px';
        button.style.padding = '5px 0';
        button.addEventListener('click', onClick);
        return button;
    }

    ////DATA BUTTONS
    function createDataContainer() {
        const dataButtonWidth = '200px';

        const exportButton = createButton('Export Data', '10px', exportData, dataButtonWidth);
        const importButton = createButton('Import Data', '10px', handleImportDButtonClick, dataButtonWidth);

        const dataContainer = document.createElement('div');
        dataContainer.style.textAlign = 'center';
        dataContainer.style.marginTop = '10px';
        dataContainer.append(exportButton, importButton);

        return dataContainer;
    }

    ////CLOSE BUTTON
    function closeOverlayMenu() {
        loadConfig();
        document.body.removeChild(document.getElementById('overlayMenu'));
    }

    ////SAVE BUTTON
    function saveConfig() {
        const overlay = document.getElementById('overlayMenu');
        if (!overlay) {
            return;
        }

        const inputs = overlay.querySelectorAll('input, span');
        console.log(inputs);
        const {changes, minimumExampleLengthChanged, newMinimumExampleLength} = gatherChanges(inputs);
        if (minimumExampleLengthChanged) {
            handleMinimumExampleLengthChange(newMinimumExampleLength, changes);
        } else {
            applyChanges(changes);
            finalizeSaveConfig();
            setVocabSize();
            setPageWidth();
        }
    }

    function gatherChanges(inputs) {
        let minimumExampleLengthChanged = false;
        let newMinimumExampleLength;
        const changes = {};

        inputs.forEach(input => {
            const key = input.getAttribute('data-key');
            const type = input.getAttribute('data-type');
            let value;

            if (type === 'boolean') {
                value = input.checked;
            } else if (type === 'number') {
                value = parseFloat(input.textContent);
            } else if (type === 'string') {
                value = input.textContent;
            } else if (type === 'object' && key === 'HOTKEYS') {
                value = input.textContent.replace(' and ', ' ');
            }

            if (key && type) {
                const typePart = input.getAttribute('data-type-part');
                const originalFormattedType = typePart.slice(1, -1);

                if (key === 'MINIMUM_EXAMPLE_LENGTH' && CONFIG.MINIMUM_EXAMPLE_LENGTH !== value) {
                    minimumExampleLengthChanged = true;
                    newMinimumExampleLength = value;
                }
                if (key === 'MAXIMUM_EXAMPLE_LENGTH' && CONFIG.MAXIMUM_EXAMPLE_LENGTH !== value) {
                    value = Math.max(value, CONFIG.MINIMUM_EXAMPLE_LENGTH);
                }
                changes[configPrefix + key] = value + originalFormattedType;
            }
        });

        return {changes, minimumExampleLengthChanged, newMinimumExampleLength};
    }

    function handleMinimumExampleLengthChange(newMinimumExampleLength, changes) {
        createConfirmationPopup(
            'Changing Minimum Example Length will reset your cache and sentences will take longer to load at first Are you sure?',
            async () => {
                await IndexedDBManager.delete();
                CONFIG.MINIMUM_EXAMPLE_LENGTH = newMinimumExampleLength;
                setItem(`${configPrefix}MINIMUM_EXAMPLE_LENGTH`, newMinimumExampleLength);
                applyChanges(changes);
                clearNonConfigLocalStorage();
                finalizeSaveConfig();
                location.reload();
            },
            () => {
                const overlay = document.getElementById('overlayMenu');
                document.body.removeChild(overlay);
                document.body.appendChild(createOverlayMenu());
            }
        );
    }

    function clearNonConfigLocalStorage() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(scriptPrefix) && !key.startsWith(scriptPrefix + configPrefix)) {
                localStorage.removeItem(key);
                i--; // Adjust index after removal
            }
        }
    }

    function applyChanges(changes) {
        for (const key in changes) {
            setItem(key, changes[key]);
        }
    }

    function finalizeSaveConfig() {
        loadConfig();
        window.removeEventListener('keydown', hotkeysListener);
        renderImageAndPlayAudio(state.vocab, CONFIG.AUTO_PLAY_SOUND);
        const overlay = document.getElementById('overlayMenu');
        if (overlay) {
            document.body.removeChild(overlay);
        }
    }


    ////DEFAULT BUTTON
    function createDefaultButton(width) {
        const defaultButton = createButton('Default', '10px', () => {
            createConfirmationPopup(
                'This will reset all your settings to default. Are you sure?',
                () => {
                    Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(scriptPrefix + configPrefix)) {
                            localStorage.removeItem(key);
                        }
                    });
                    location.reload();
                },
                () => {
                    const overlay = document.getElementById('overlayMenu');
                    if (overlay) {
                        document.body.removeChild(overlay);
                    }
                    loadConfig();
                    document.body.appendChild(createOverlayMenu());
                }
            );
        }, width);
        defaultButton.style.backgroundColor = '#C82800';
        defaultButton.style.color = 'white';
        return defaultButton;
    }


    ////DELETE BUTTON
    function createDeleteButton(width) {
        const deleteButton = createButton('DELETE', '10px', () => {
            createConfirmationPopup(
                'This will delete all cached data. Are you sure?',
                async () => {
                    await IndexedDBManager.delete();
                    Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(scriptPrefix) && !key.startsWith(scriptPrefix + configPrefix)) {
                            localStorage.removeItem(key);
                        }
                    });
                    location.reload();
                },
                () => {
                    const overlay = document.getElementById('overlayMenu');
                    if (overlay) {
                        document.body.removeChild(overlay);
                    }
                    loadConfig();
                    document.body.appendChild(createOverlayMenu());
                }
            );
        }, width);
        deleteButton.style.backgroundColor = '#C82800';
        deleteButton.style.color = 'white';
        return deleteButton;
    }

    function createOverlayMenu() {
        // Create and return the overlay menu for configuration settings
        const overlay = document.createElement('div');
        overlay.id = 'overlayMenu';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        overlay.style.zIndex = '1000';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

        const menuContent = document.createElement('div');
        menuContent.style.backgroundColor = 'var(--background-color)';
        menuContent.style.color = 'var(--text-color)';
        menuContent.style.padding = '20px';
        menuContent.style.borderRadius = '5px';
        menuContent.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        menuContent.style.width = '80%';
        menuContent.style.maxWidth = '550px';
        menuContent.style.maxHeight = '80%';
        menuContent.style.overflowY = 'auto';
        // Make a button to upload the json history file
        const uploadButton = document.createElement('button');
        uploadButton.textContent = 'Upload History JSON';
        uploadButton.style.margin = '10px';
        uploadButton.addEventListener('click', async () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            fileInput.style.display = 'none';
            fileInput.addEventListener('change', async (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        try {
                            const data = JSON.parse(e.target.result);
                            console.log('Parsed data:', data);
                            const db = await IndexedDBManager.open();
                            await IndexedDBManager.importJPDBData(db, data).then(() => {
                                    alert('History imported successfully!');
                                    // Reload the page to reflect changes
                                    location.reload();
                                }
                            ).catch((error) => {
                                console.error('Error importing data:', error);
                                alert('Failed to import history. Please check the console for details.');
                                console.log(data);

                            });
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                            alert('Invalid JSON file. Please upload a valid JPDB history file.');
                            console.log(data);
                        }
                    };
                    reader.readAsText(file);
                }
            });
            document.body.appendChild(fileInput);
            fileInput.click();
        })
        menuContent.appendChild(uploadButton);
        for (const [key, value] of Object.entries(CONFIG)) {
            const optionContainer = document.createElement('div');
            optionContainer.style.marginBottom = '10px';
            optionContainer.style.display = 'flex';
            optionContainer.style.alignItems = 'center';

            const leftContainer = document.createElement('div');
            leftContainer.style.flex = '1';
            leftContainer.style.display = 'flex';
            leftContainer.style.alignItems = 'center';

            const rightContainer = document.createElement('div');
            rightContainer.style.flex = '1';
            rightContainer.style.display = 'flex';
            rightContainer.style.alignItems = 'center';
            rightContainer.style.justifyContent = 'center';

            const label = document.createElement('label');
            label.textContent = key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            label.style.marginRight = '10px';

            leftContainer.appendChild(label);

            if (key === 'RANDOM_SENTENCE') {
                const select = document.createElement('select');
                select.setAttribute('data-key', key);

                // Add options to the select dropdown for the enum values
                for (const [enumKey, enumValue] of Object.entries(RANDOM_SENTENCE_ENUM)) {
                    const option = document.createElement('option');
                    option.value = enumValue;
                    option.text = enumKey.replace(/_/g, ' ').toLowerCase();
                    option.selected = value === enumValue; // Set the current value as selected
                    select.appendChild(option);
                }

                select.addEventListener('change', (event) => {
                    CONFIG[key] = parseInt(event.target.value, 10); // Update the config with the selected value
                    localStorage.setItem(`${scriptPrefix + configPrefix}${key}`, event.target.value); // Save to localStorage
                });

                rightContainer.appendChild(select);
            } else if (typeof value === 'boolean') {
                const checkboxContainer = document.createElement('div');
                checkboxContainer.style.display = 'flex';
                checkboxContainer.style.alignItems = 'center';
                checkboxContainer.style.justifyContent = 'center';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = value;
                checkbox.setAttribute('data-key', key);
                checkbox.setAttribute('data-type', 'boolean');
                checkbox.setAttribute('data-type-part', '');
                checkboxContainer.appendChild(checkbox);

                rightContainer.appendChild(checkboxContainer);
            } else if (typeof value === 'number') {
                const numberContainer = document.createElement('div');
                numberContainer.style.display = 'flex';
                numberContainer.style.alignItems = 'center';
                numberContainer.style.justifyContent = 'center';

                const decrementButton = document.createElement('button');
                decrementButton.textContent = '-';
                decrementButton.style.marginRight = '5px';

                const input = document.createElement('span');
                input.textContent = value;
                input.style.margin = '0 10px';
                input.style.minWidth = '3ch';
                input.style.textAlign = 'center';
                input.setAttribute('data-key', key);
                input.setAttribute('data-type', 'number');
                input.setAttribute('data-type-part', '');

                const incrementButton = document.createElement('button');
                incrementButton.textContent = '+';
                incrementButton.style.marginLeft = '5px';

                const updateButtonStates = () => {
                    let currentValue = parseFloat(input.textContent);
                    if (currentValue <= 0) {
                        decrementButton.disabled = true;
                        decrementButton.style.color = 'grey';
                    } else {
                        decrementButton.disabled = false;
                        decrementButton.style.color = '';
                    }
                    if (key === 'SOUND_VOLUME' && currentValue >= 100) {
                        incrementButton.disabled = true;
                        incrementButton.style.color = 'grey';
                    } else {
                        incrementButton.disabled = false;
                        incrementButton.style.color = '';
                    }
                };

                decrementButton.addEventListener('click', () => {
                    let currentValue = parseFloat(input.textContent);
                    if (currentValue > 0) {
                        if (currentValue > 200) {
                            input.textContent = currentValue - 25;
                        } else if (currentValue > 20) {
                            input.textContent = currentValue - 5;
                        } else {
                            input.textContent = currentValue - 1;
                        }
                        updateButtonStates();
                    }
                });

                incrementButton.addEventListener('click', () => {
                    let currentValue = parseFloat(input.textContent);
                    if (key === 'SOUND_VOLUME' && currentValue >= 100) {
                        return;
                    }
                    if (currentValue >= 200) {
                        input.textContent = currentValue + 25;
                    } else if (currentValue >= 20) {
                        input.textContent = currentValue + 5;
                    } else {
                        input.textContent = currentValue + 1;
                    }
                    updateButtonStates();
                });

                numberContainer.appendChild(decrementButton);
                numberContainer.appendChild(input);
                numberContainer.appendChild(incrementButton);

                rightContainer.appendChild(numberContainer);

                // Initialize button states
                updateButtonStates();
            } else if (typeof value === 'string') {
                const typeParts = value.split(/(\d+)/).filter(Boolean);
                const numberParts = typeParts.filter(part => !isNaN(part)).map(Number);

                const numberContainer = document.createElement('div');
                numberContainer.style.display = 'flex';
                numberContainer.style.alignItems = 'center';
                numberContainer.style.justifyContent = 'center';

                const typeSpan = document.createElement('span');
                const formattedType = '(' + typeParts.filter(part => isNaN(part)).join('').replace(/_/g, ' ').toLowerCase() + ')';
                typeSpan.textContent = formattedType;
                typeSpan.style.marginRight = '10px';

                leftContainer.appendChild(typeSpan);

                typeParts.forEach(part => {
                    if (!isNaN(part)) {
                        const decrementButton = document.createElement('button');
                        decrementButton.textContent = '-';
                        decrementButton.style.marginRight = '5px';

                        const input = document.createElement('span');
                        input.textContent = part;
                        input.style.margin = '0 10px';
                        input.style.minWidth = '3ch';
                        input.style.textAlign = 'center';
                        input.setAttribute('data-key', key);
                        input.setAttribute('data-type', 'string');
                        input.setAttribute('data-type-part', formattedType);

                        const incrementButton = document.createElement('button');
                        incrementButton.textContent = '+';
                        incrementButton.style.marginLeft = '5px';

                        const updateButtonStates = () => {
                            let currentValue = parseFloat(input.textContent);
                            if (currentValue <= 0) {
                                decrementButton.disabled = true;
                                decrementButton.style.color = 'grey';
                            } else {
                                decrementButton.disabled = false;
                                decrementButton.style.color = '';
                            }
                            if (key === 'SOUND_VOLUME' && currentValue >= 100) {
                                incrementButton.disabled = true;
                                incrementButton.style.color = 'grey';
                            } else {
                                incrementButton.disabled = false;
                                incrementButton.style.color = '';
                            }
                        };

                        decrementButton.addEventListener('click', () => {
                            let currentValue = parseFloat(input.textContent);
                            if (currentValue > 0) {
                                if (currentValue > 200) {
                                    input.textContent = currentValue - 25;
                                } else if (currentValue > 20) {
                                    input.textContent = currentValue - 5;
                                } else {
                                    input.textContent = currentValue - 1;
                                }
                                updateButtonStates();
                            }
                        });

                        incrementButton.addEventListener('click', () => {
                            let currentValue = parseFloat(input.textContent);
                            if (key === 'SOUND_VOLUME' && currentValue >= 100) {
                                return;
                            }
                            if (currentValue >= 200) {
                                input.textContent = currentValue + 25;
                            } else if (currentValue >= 20) {
                                input.textContent = currentValue + 5;
                            } else {
                                input.textContent = currentValue + 1;
                            }
                            updateButtonStates();
                        });

                        numberContainer.appendChild(decrementButton);
                        numberContainer.appendChild(input);
                        numberContainer.appendChild(incrementButton);

                        // Initialize button states
                        updateButtonStates();
                    }
                });

                rightContainer.appendChild(numberContainer);
            } else if (typeof value === 'object') {
                const maxAllowedIndex = hotkeyOptions.length - 1;

                let currentValue = value;
                let choiceIndex = hotkeyOptions.indexOf(currentValue.join(' '));
                if (choiceIndex === -1) {
                    currentValue = hotkeyOptions[0].split(' ');
                    choiceIndex = 0;
                }
                const textContainer = document.createElement('div');
                textContainer.style.display = 'flex';
                textContainer.style.alignItems = 'center';
                textContainer.style.justifyContent = 'center';

                const decrementButton = document.createElement('button');
                decrementButton.textContent = '<';
                decrementButton.style.marginRight = '5px';

                const input = document.createElement('span');
                input.textContent = currentValue.join(' and ');
                input.style.margin = '0 10px';
                input.style.minWidth = '3ch';
                input.style.textAlign = 'center';
                input.setAttribute('data-key', key);
                input.setAttribute('data-type', 'object');
                input.setAttribute('data-type-part', '');

                const incrementButton = document.createElement('button');
                incrementButton.textContent = '>';
                incrementButton.style.marginLeft = '5px';

                const updateButtonStates = () => {
                    if (choiceIndex <= 0) {
                        decrementButton.disabled = true;
                        decrementButton.style.color = 'grey';
                    } else {
                        decrementButton.disabled = false;
                        decrementButton.style.color = '';
                    }
                    if (choiceIndex >= maxAllowedIndex) {
                        incrementButton.disabled = true;
                        incrementButton.style.color = 'grey';
                    } else {
                        incrementButton.disabled = false;
                        incrementButton.style.color = '';
                    }
                };

                decrementButton.addEventListener('click', () => {
                    if (choiceIndex > 0) {
                        choiceIndex -= 1;
                        currentValue = hotkeyOptions[choiceIndex].split(' ');
                        input.textContent = currentValue.join(' and ');
                        updateButtonStates();
                    }
                });

                incrementButton.addEventListener('click', () => {
                    if (choiceIndex < maxAllowedIndex) {
                        choiceIndex += 1;
                        currentValue = hotkeyOptions[choiceIndex].split(' ');
                        input.textContent = currentValue.join(' and ');
                        updateButtonStates();
                    }
                });

                textContainer.appendChild(decrementButton);
                textContainer.appendChild(input);
                textContainer.appendChild(incrementButton);

                // Initialize button states
                updateButtonStates();

                rightContainer.appendChild(textContainer);
            }

            optionContainer.appendChild(leftContainer);
            optionContainer.appendChild(rightContainer);
            menuContent.appendChild(optionContainer);
        }

        const menuButtons = createMenuButtons();
        menuContent.appendChild(menuButtons);

        overlay.appendChild(menuContent);

        return overlay;
    }

    function loadConfig() {
        for (const key in localStorage) {
            if (!key.startsWith(scriptPrefix + configPrefix) || !localStorage.hasOwnProperty(key)) {
                continue;
            }


            const configKey = key.substring((scriptPrefix + configPrefix).length); // chop off script prefix and config prefix
            if (!CONFIG.hasOwnProperty(configKey)) {
                continue;
            }


            const savedValue = localStorage.getItem(key);
            if (savedValue === null) {
                continue;
            }


            const valueType = typeof CONFIG[configKey];
            if (configKey === 'RANDOM_SENTENCE') {
                if (savedValue == 0) {
                    CONFIG[configKey] = RANDOM_SENTENCE_ENUM.DISABLE;
                }
                if (savedValue == 1) {
                    CONFIG[configKey] = RANDOM_SENTENCE_ENUM.ON_FIRST;
                }
                if (savedValue == 2) {
                    CONFIG[configKey] = RANDOM_SENTENCE_ENUM.EVERY_TIME;
                }
            } else if (configKey === 'HOTKEYS') {
                CONFIG[configKey] = savedValue.split(' ');
            } else if (valueType === 'boolean') {
                CONFIG[configKey] = savedValue === 'true';
                if (configKey === 'DEFAULT_TO_EXACT_SEARCH') {
                    state.exactSearch = CONFIG.DEFAULT_TO_EXACT_SEARCH;
                }
                // I wonder if this is the best way to do this...
                // Probably not because we could just have a single variable to store both, but it would have to be in config and
                // it would be a bit weird to have the program modifying config when the actual config settings aren't changing
            } else if (valueType === 'number') {
                CONFIG[configKey] = parseFloat(savedValue);
            } else if (valueType === 'string') {
                CONFIG[configKey] = savedValue;
            }
        }
    }


    async function process_sentences(state, sentences, first_call) {
        // Early return for empty array or single item (no processing needed)
        if (!sentences || !Array.isArray(sentences) || sentences.length <= 1) {
            return sentences;
        }
        // Only randomize if needed
        const shouldRandomize = CONFIG.RANDOM_SENTENCE >
            (first_call ? RANDOM_SENTENCE_ENUM.DISABLE : RANDOM_SENTENCE_ENUM.ON_FIRST);

        // Skip weight calculation if not needed
        if (!CONFIG.WEIGHTED_SENTENCES && !shouldRandomize) {
            return sentences;
        }

        // if timestamp is set and less than 30 seconds ago, skip
        const lastEntry = sentences[sentences.length -1 ];
        // log copy of sentences
        console.log(Array.from(sentences));
        console.log(lastEntry);
        if (typeof(lastEntry) === typeof(20) && (Date.now() - lastEntry < 30000)) {
            console.log("Don't change because time difference is ",Date.now() - lastEntry)
            return sentences;
        }
        while (typeof(sentences[sentences.length -1 ]) === typeof(20))
        {
            sentences.pop(); // remove timestamp entry for processing
        }
        // Randomize sentences if needed
        if (shouldRandomize) {
            for (let i = 0; i < sentences.length; i++) {
                if (!sentences[i] || !sentences[i].weight) {
                    sentences[i] = await preprocessSentence(sentences[i]);
                }
            }
            // TODO : Add a slider option for alpha value (lower is easier sentences, 0 is fully random, higher is harder sentences)
            function weightedShuffle(items, alpha) {
                console.log("alpha",alpha)
                return items
                    .map((item, i) => {
                        const g = Math.random()*100;
                        return { item, key: alpha * (item.weight || 0) + g };
                    })
                    .sort((a, b) => a.key - b.key)
                    .map(x => x.item);
            }

            sentences = weightedShuffle(sentences.map((s, i) => [s, i]),-10000).map(pair => pair[0]);
        }
        return sentences;
    }

    /**
 * Removes <rt> tags from a DOM element directly.
 * Warning: This modifies the actual DOM element passed in.
 * @param {HTMLElement} element - The DOM element to clean.
 */
    function removeRtFromDOM(element) {
        if (!element) return;

        // Find all <rt> tags within this element
        const rtTags = element.querySelectorAll('rt');

        // Loop through and remove them from the DOM
        rtTags.forEach(tag => tag.remove());
    }

    //MAIN FUNCTIONS=====================================================================================================================
    async function onPageLoad() {
        // Initialize state and determine vocabulary based on URL
        state.embedAboveSubsectionMeanings = false;
        state.isFront = !document.querySelector('.result');
        // Early layout adjustments without waiting
        setPageWidth();
        const sentenceElement = document.querySelector('.sentence');
        if (sentenceElement) {
            removeRtFromDOM(sentenceElement)
            const defaultSentence = sentenceElement.textContent.trim();
            if (defaultSentence) {
                state.examples = [{segment_info: {content_jp: defaultSentence}}];
            }
            sentenceElement.textContent = "Waiting for data...";
        }
        const machineTranslationFrame = document.getElementById('machine-translation-frame');
        // Skip if machine translation frame is present
        if (machineTranslationFrame) {
            return;
        }

        // Determine the vocabulary based on URL — done in parallel with setting page width
        const url = window.location.href;
        console.log(url)
        if (url.includes('/vocabulary/')) {
            [state.vocab, state.reading] = parseVocabFromVocabulary();
        } else if (url.includes('/search?q=')) { // TODO : get reading from search
            state.vocab = parseVocabFromSearch();
        } else if (url.includes('c=')) {
            [state.vocab, state.reading] = parseVocabFromAnswer();
        } else if (url.includes('/kanji/')) {
            state.vocab = parseVocabFromKanji();
        } else if (url.includes('/deck')) {
            const vocabElements = document.querySelectorAll('.vocabulary-spelling');
            if (vocabElements.length > 0) {
                const preprocessBtn = document.createElement('button');
                preprocessBtn.textContent = 'Preprocess All Words';
                preprocessBtn.style.margin = '10px';
                preprocessBtn.addEventListener('click', async () => {
                    preprocessBtn.disabled = true;
                    const tasks = Array.from(vocabElements).map(async (vocabElement) => {
                        const aTag = vocabElement.querySelector('a');
                        const href = aTag?.getAttribute('href') || '';

                        // Split the path into segments
                        const segments = href.split('/');

                        // The word is in the 4th segment (index 3)
                        const lastSegment = segments[3] || '';

                        // Remove the fragment part after # and get reading
                        const rubyElements = aTag.querySelectorAll('ruby');
                        let vocab = '';
                        let reading = '';

                        if (rubyElements.length > 0) {
                            // Build vocab and reading from ruby elements
                            rubyElements.forEach(ruby => {
                                const rt = ruby.querySelector('rt');
                                vocab += ruby.childNodes[0]?.textContent.trim() || '';
                                reading += rt?.textContent.trim() || ruby.textContent.trim();
                            });
                        } else {
                            // No ruby elements, just use the text content
                            vocab = decodeURIComponent(lastSegment.split('#')[0]);
                            reading = vocab;
                        }
                        if (vocab) {
                            try {
                                await getNadeshikoData(vocab, state.exactSearch, reading);
                            } catch (e) {
                                console.error('Error preprocessing vocab:', vocab, e);
                            }
                        }
                    });
                    await Promise.all(tasks);
                    alert('Preprocessing complete!');
                });
                const entriesAmountTextElem = [...document.querySelectorAll('p')].find(
                    (elem) => elem.innerText.startsWith('Showing') && elem.innerText.endsWith('entries')
                );
                entriesAmountTextElem.parentNode.insertBefore(preprocessBtn, entriesAmountTextElem);
            }
        } else {
            [state.vocab, state.reading] = parseVocabFromReview();
        }

        // Early return if no vocabulary is found
        if (!state.vocab) {
            return;
        }


        // Fetch data if needed, process in parallel threads where possible
        if (!state.apiDataFetched) {
            try {
                await getNadeshikoData(state.vocab, state.exactSearch);

                // Process sentences in parallel with preloading images
                const processingPromise = process_sentences(state, state.examples, true);
                const preloadPromise = Promise.resolve().then(() => preloadImages());

                state.examples = await processingPromise;
                // Wait for preloading to complete
                await preloadPromise;

                const db = await IndexedDBManager.open();
                await IndexedDBManager.save(db,state.exactSearch ? `"${state.vocab}"` : state.vocab, state.examples);
                // Finally, display the example
                embedImageAndPlayAudio();
            } catch (error) {
                // Handle errors silently for better performance
                state.error = true;
                embedImageAndPlayAudio(); // Still try to show what we can
            }
        } else if (state.apiDataFetched) {
            // Update display and settings
            await Promise.all([
                Promise.resolve().then(() => embedImageAndPlayAudio()),
                Promise.resolve().then(() => setVocabSize())
            ]);
        }
    }

    function setPageWidth() {
        // Set the maximum width of the page
        document.body.style.maxWidth = CONFIG.PAGE_WIDTH;
    }

    // Observe URL changes and reload the page content accordingly
    const observer = new MutationObserver(() => {
        if (window.location.href !== observer.lastUrl) {
            observer.lastUrl = window.location.href;
            onPageLoad();
        }
    });

    // Function to apply styles
    function setVocabSize() {
        // Create a new style element
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
	            .answer-box > .plain {
	                font-size: ${CONFIG.VOCAB_SIZE} !important; /* Use the configurable font size */
	                padding-bottom: 0.1rem !important; /* Retain padding */
	            }
	        `;

        // Append the new style to the document head
        document.head.appendChild(style);
    }

    observer.lastUrl = window.location.href;
    observer.observe(document, {subtree: true, childList: true});

    // Add event listeners for page load and URL changes
    window.addEventListener('load', onPageLoad);
    window.addEventListener('popstate', onPageLoad);
    window.addEventListener('hashchange', onPageLoad);

    // Initial configuration and preloading
    loadConfig();
    setPageWidth();
    setVocabSize();
    //preloadImages();

})();
