// ==UserScript==
// @name         JPDB Immersion Kit Examples
// @version      1.24
// @description  Embeds anime images & audio examples into JPDB review and vocabulary pages using Immersion Kit's API. 
// @author       awoo
// @namespace    jpdb-immersion-kit-examples
// @match        https://jpdb.io/review*
// @match        https://jpdb.io/vocabulary/*
// @match        https://jpdb.io/kanji/*
// @match        https://jpdb.io/search*
// @connect      immersionkit.com
// @connect      linodeobjects.com
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507408/JPDB%20Immersion%20Kit%20Examples.user.js
// @updateURL https://update.greasyfork.org/scripts/507408/JPDB%20Immersion%20Kit%20Examples.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // to use custom hotkeys just add them into this array following the same format. Any single keys except space
    // should work. If you want to use special keys, check the linked page for how to represent them in the array
    // (link leads to the arrow keys part so you can compare with the array and be sure which part to write):
    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#navigation_keys
    const hotkeyOptions = ['None', 'ArrowLeft ArrowRight', ', .', '[ ]', 'Q W'];

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
        HOTKEYS: ['None'],
        DEFAULT_TO_EXACT_SEARCH: true
        // On changing this config option, the icons change but the sentences don't, so you
        // have to click once to match up the icons and again to actually change the sentences
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
        sharedAudioContext:  new (window.AudioContext || window.webkitAudioContext)(),
        currentSource: null,
        lastPlayId: 0,
    };

    // Prefixing
    const scriptPrefix = 'JPDBImmersionKitExamples-';
    const configPrefix = 'CONFIG.'; // additional prefix for config variables to go after the scriptPrefix
    // do not change either of the above without adding code to handle the change

    const setItem = (key, value) => { localStorage.setItem(scriptPrefix + key, value) }
    const getItem = (key) => {
        const prefixedValue = localStorage.getItem(scriptPrefix + key);
        if (prefixedValue !== null) { return prefixedValue }
        const nonPrefixedValue = localStorage.getItem(key);
        // to move away from non-prefixed values as fast as possible
        if (nonPrefixedValue !== null) { setItem(key, nonPrefixedValue) }
        return nonPrefixedValue
    }
    const removeItem = (key) => {
        localStorage.removeItem(scriptPrefix + key);
        localStorage.removeItem(key)
    }

    // Helper for transitioning to fully script-prefixed config state
    // Deletes all localStorage variables starting with configPrefix and re-adds them with scriptPrefix and configPrefix
    // Danger of other scripts also having localStorage variables starting with configPrefix, so we add a flag showing that
    // we have run this function and make sure it is not set when running it

    // Check for Prefixed flag
    if (localStorage.getItem(`JPDBImmersionKit*Examples-CONFIG_VARIABLES_PREFIXED`) !== 'true') {
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
        localStorage.setItem(`JPDBImmersionKit*Examples-CONFIG_VARIABLES_PREFIXED`, 'true');
    }

    // IndexedDB Manager
    const IndexedDBManager = {
        DB_NAME: 'ImmersionKitDB',
        DB_VERSION: 2, // bump version to create metaStore
        DATA_STORE: 'dataStore',
        META_STORE: 'metaStore',
        META_KEY: 'index_meta',
        MAX_ENTRIES: 100000000,
        EXPIRATION_TIME: 30 * 24 * 60 * 60 * 1000 * 12 * 10000, // 10000 years

        open() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

                request.onupgradeneeded = event => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(this.DATA_STORE)) {
                        db.createObjectStore(this.DATA_STORE, { keyPath: 'keyword' });
                    }
                    if (!db.objectStoreNames.contains(this.META_STORE)) {
                        db.createObjectStore(this.META_STORE, { keyPath: 'key' });
                    }
                };

                request.onsuccess = event => resolve(event.target.result);
                request.onerror = event => reject('IndexedDB error: ' + event.target.errorCode);
            });
        },

        // ---------- META STORE ----------
        getMetadata(db) {
            return new Promise((resolve, reject) => {
                const tx = db.transaction([this.META_STORE], 'readonly');
                const store = tx.objectStore(this.META_STORE);
                const req = store.get(this.META_KEY);

                req.onsuccess = e => {
                    const rec = e.target.result;
                    resolve(rec ? rec.data : null);
                };
                req.onerror = e => reject('Failed to read metadata: ' + e.target.errorCode);
            });
        },

        saveMetadata(db, metadata) {
            return new Promise((resolve, reject) => {
                const tx = db.transaction([this.META_STORE], 'readwrite');
                const store = tx.objectStore(this.META_STORE);
                const rec = { key: this.META_KEY, data: metadata, timestamp: Date.now() };
                const req = store.put(rec);
                req.onsuccess = () => resolve();
                req.onerror = e => reject('Failed to save metadata: ' + e.target.errorCode);
            });
        },

        // ---------- DATA STORE ----------
        get(db, keyword) {
            return new Promise((resolve, reject) => {
                const tx = db.transaction([this.DATA_STORE], 'readonly');
                const store = tx.objectStore(this.DATA_STORE);
                const req = store.get(keyword);

                req.onsuccess = async e => {
                    const result = e.target.result;
                    if (!result) return resolve(null);

                    // Return the data field directly
                    resolve(result.data ? result.data : result);
                };

                req.onerror = e => reject('IndexedDB get error: ' + e.target.errorCode);
            });
        },

        deleteEntry(db, keyword) {
            return new Promise((resolve, reject) => {
                const tx = db.transaction([this.DATA_STORE], 'readwrite');
                const store = tx.objectStore(this.DATA_STORE);
                const req = store.delete(keyword);
                req.onsuccess = () => resolve();
                req.onerror = e => reject('IndexedDB delete error: ' + e.target.errorCode);
            });
        },

        getAll(db) {
            return new Promise((resolve, reject) => {
                const tx = db.transaction([this.DATA_STORE], 'readonly');
                const store = tx.objectStore(this.DATA_STORE);
                const entries = [];
                store.openCursor().onsuccess = e => {
                    const cursor = e.target.result;
                    if (cursor) {
                        entries.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(entries);
                    }
                };
                store.openCursor().onerror = e => reject('Cursor error: ' + e.target.errorCode);
            });
        },

        // Fallback network fetch
        fetchMetadata() {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://apiv2.immersionkit.com/index_meta",
                    onload: res => {
                        if (res.status === 200) {
                            try {
                                resolve(JSON.parse(res.responseText));
                            } catch (err) {
                                reject('Invalid JSON: ' + err);
                            }
                        } else {
                            reject('HTTP ' + res.status);
                        }
                    },
                    onerror: err => reject('Network error: ' + err)
                });
            });
        },

        save(db, keyword, data) {
            return new Promise(async (resolve, reject) => {
                try {
                    const validationError = validateApiResponse(data);
                    if (validationError) {
                        console.warn(`Invalid data: ${validationError}`);
                        return resolve();
                    }

                    // 1) load metadata from DB (or fetch & save if missing)
                    let metadata = await this.getMetadata(db);
                    if (!metadata) {
                        metadata = await this.fetchMetadata();
                        await this.saveMetadata(db, metadata);
                    }

                    // 2) slim down
                    const slimData = {};
                    if (data.category_count) slimData.category_count = data.category_count;
                    if (!Array.isArray(data.examples)) {
                        console.error('Unexpected examples format');
                        return resolve();
                    }

                    // 3) map & patch titles
                    const categoryOrder = ['anime', 'drama', 'games', 'literature', 'news'];
                    let slimExamples = await Promise.all(data.examples.map(async ex => {
                        const slim = {
                            image: ex.image,
                            sound: ex.sound,
                            sentence: ex.sentence,
                            translation: ex.translation,
                            title: ex.title,
                            media: ex.id ? ex.id.split('_')[0] : undefined
                        };

                        // if title not in our local metadata, re-fetch & update
                        if (!metadata.data[slim.title]) {
                            metadata = await this.fetchMetadata();
                            await this.saveMetadata(db, metadata);
                        }

                        const entry = metadata.data[slim.title];
                        if (entry) slim.title = entry.title;
                        return slim;
                    }));

                    // Check state.exactSearch and filter examples
                    console.log('State exactSearch:', state.exactSearch);
                    console.log('State vocab:', state.vocab);

                    const totalExamplesBefore = slimExamples.length;
                    console.log('Total examples before filtering:', totalExamplesBefore);

                    if (state.exactSearch) {
                        const initialCount = slimExamples.length;
                        slimExamples = slimExamples.filter(ex => ex.sentence.includes(state.vocab));
                        const removedCount = initialCount - slimExamples.length;
                        console.log('Number of examples removed:', removedCount);
                    }

                    const totalExamplesAfter = slimExamples.length;
                    console.log('Total examples after filtering:', totalExamplesAfter);

                    // 4) sort
                    slimExamples.sort((a, b) => {
                        const ca = categoryOrder.indexOf(a.media);
                        const cb = categoryOrder.indexOf(b.media);
                        if (ca !== cb) return ca - cb;
                        return a.sentence.length - b.sentence.length;
                    });
                    slimData.examples = slimExamples;

                    // 5) enforce MAX_ENTRIES
                    const all = await this.getAll(db);
                    const tx = db.transaction([this.DATA_STORE], 'readwrite');
                    const store = tx.objectStore(this.DATA_STORE);

                    if (all.length >= this.MAX_ENTRIES) {
                        all
                            .sort((a, b) => a.timestamp - b.timestamp)
                            .slice(0, all.length - this.MAX_ENTRIES + 1)
                            .forEach(old => store.delete(old.keyword));
                    }

                    // 6) put new record
                    store.put({ keyword, data: slimData, timestamp: Date.now() });

                    tx.oncomplete = () => {
                        console.log('Save complete');
                        resolve();
                    };
                    tx.onerror = e => reject('Save transaction failed: ' + e.target.errorCode);

                } catch (err) {
                    reject('Error in save(): ' + err);
                }
            });
        },

        async versionupdate(db, searchVocab) {
            return new Promise(async (resolve, reject) => {
                try {
                    // Fetch the existing data for the given searchVocab
                    let cachedData = await this.get(db, searchVocab);

                    if (!cachedData || !cachedData.data) {
                        return resolve(); // No data to update
                    }

                    // Check if cachedData.data is an array and extract the first element
                    const dataToTransform = Array.isArray(cachedData.data) ? cachedData.data[0] : cachedData.data;

                    // Transform the data
                    const updatedData = {
                        category_count: dataToTransform.category_count,
                        examples: dataToTransform.examples.map(example => {
                            const imageUrlParts = example.image_url.split('/');
                            const soundUrlParts = example.sound_url.split('/');

                            // Extract media from the URL
                            const mediaIndex = imageUrlParts.indexOf('media');
                            const media = mediaIndex !== -1 && mediaIndex + 1 < imageUrlParts.length ? imageUrlParts[mediaIndex + 1] : '';

                            return {
                                image: imageUrlParts[imageUrlParts.length - 1],
                                sound: soundUrlParts[soundUrlParts.length - 1],
                                sentence: example.sentence,
                                translation: example.translation,
                                title: example.deck_name,
                                media: media,
                            };
                        })
                    };

                    // Open a readwrite transaction on your data store
                    const tx = db.transaction([this.DATA_STORE], 'readwrite');
                    const store = tx.objectStore(this.DATA_STORE);

                    // Put the new record directly
                    store.put({
                        keyword: searchVocab,
                        data: updatedData,
                        timestamp: Date.now()
                    });

                    tx.oncomplete = () => {
                        console.log('Version update complete');
                        resolve();
                    };
                    tx.onerror = e => {
                        console.error('Version update transaction failed:', e.target.errorCode);
                        reject('Version update transaction failed: ' + e.target.errorCode);
                    };

                } catch (error) {
                    console.error('Error in versionupdate:', error);
                    reject('Error in versionupdate: ' + error);
                }
            });
        }
        ,


        delete() {
            return new Promise((resolve, reject) => {
                const req = indexedDB.deleteDatabase(this.DB_NAME);
                req.onsuccess = () => resolve();
                req.onerror = e => reject('Delete failed: ' + e.target.errorCode);
                req.onblocked = () => reject('Delete blocked; close all other tabs');
            });
        }
    };



    // API FUNCTIONS=====================================================================================================================
    function getImmersionKitData(vocab, exactSearch) {
        return new Promise(async (resolve, reject) => {
            const searchVocab = exactSearch ? `「${vocab}」` : vocab;
            const url = `https://apiv2.immersionkit.com/search?q=${encodeURIComponent(searchVocab)}`;
            const maxRetries = 5;
            let attempt = 0;

            const storedValue = getItem(state.vocab);
            const isBlacklisted = storedValue && storedValue.split(',').length > 1 && parseInt(storedValue.split(',')[1], 10) === 2;

            // Return early if not blacklisted
            if (isBlacklisted) {
                resolve();
                return;
            }

            async function fetchData() {
                try {
                    const db = await IndexedDBManager.open();
                    let cachedData = await IndexedDBManager.get(db, searchVocab);

                    // Check if the cached data is outdated (v1 API data with 'data' field as an array)
                    if (cachedData && Array.isArray(cachedData.data) && cachedData.data.length > 0) {
                        console.log('Outdated data detected, updating...');
                        await IndexedDBManager.versionupdate(db, searchVocab);
                        // Rerun fetchData after updating
                        return fetchData();
                    } else if (cachedData && cachedData.examples && Array.isArray(cachedData.examples) && cachedData.examples.length > 0) {
                        console.log('Data retrieved from IndexedDB');
                        state.examples = cachedData.examples;
                        state.apiDataFetched = true;
                        updateCurrentExampleIndex();
                        resolve();
                    } else {
                        console.log(`Calling API for: ${searchVocab}`);
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: url,
                            onload: async function(response) {
                                if (response.status === 200) {
                                    const jsonData = parseJSON(response.responseText);
                                    console.log("API JSON Received");
                                    console.log(url);
                                    const validationError = validateApiResponse(jsonData);
                                    if (!validationError) {
                                        await IndexedDBManager.save(db, searchVocab, jsonData);

                                        // Attempt to load the data from cache again after saving
                                        cachedData = await IndexedDBManager.get(db, searchVocab);
                                        if (cachedData && cachedData.examples && Array.isArray(cachedData.examples)) {
                                            console.log('Data retrieved from IndexedDB after saving');
                                            state.examples = cachedData.examples;
                                            state.apiDataFetched = true;
                                            updateCurrentExampleIndex();
                                            resolve();
                                        } else {
                                            reject('Failed to retrieve data from IndexedDB after saving');
                                        }
                                    } else {
                                        attempt++;
                                        if (attempt < maxRetries) {
                                            console.log(`Validation error: ${validationError}. Retrying... (${attempt}/${maxRetries})`);
                                            setTimeout(fetchData, 2000); // Add a 2-second delay before retrying
                                        } else {
                                            reject(`Invalid API response after ${maxRetries} attempts: ${validationError}`);
                                            state.error = true;
                                            embedImageAndPlayAudio(); // Update displayed text
                                        }
                                    }
                                } else {
                                    reject(`API call failed with status: ${response.status}`);
                                }
                            },
                            onerror: function(error) {
                                reject(`An error occurred: ${error}`);
                            }
                        });
                    }
                } catch (error) {
                    reject(`Error: ${error}`);
                }
            }

            function updateCurrentExampleIndex() {
                const storedValue = getItem(state.vocab);

                if (storedValue) {
                    // If stored data exists, use it to update the current example index
                    const storedIndex = parseInt(storedValue, 10);

                    // Update the current example index with the stored index
                    state.currentExampleIndex = storedIndex;
                    return;
                }

                // If no stored data exists, check sentence length
                for (let i = 0; i < state.examples.length; i++) {
                    if (state.examples[i].sentence.length >= CONFIG.MINIMUM_EXAMPLE_LENGTH) {
                        state.currentExampleIndex = i;
                        break;
                    }
                }
            }
            fetchData();
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
        if (!jsonData.category_count || !jsonData.examples) {
            return 'Missing required data fields';
        }

        const categoryCount = jsonData.category_count;
        if (!categoryCount || Object.keys(categoryCount).length === 0) {
            return 'Missing or empty category count';
        }

        // Check if all category counts are zero
        const allZero = Object.values(categoryCount).every(count => count === 0);
        if (allZero) {
            return 'Blank API';
        }

        const examples = jsonData.examples;
        if (!Array.isArray(examples) || examples.length === 0) {
            return 'Missing or empty examples array';
        }

        return null; // No error
    }

    //FAVORITE DATA FUNCTIONS=====================================================================================================================
    function getStoredData(key) {
        // Retrieve the stored value from localStorage using the provided key
        const storedValue = getItem(key);

        // If a stored value exists, split it into index and exactState
        if (storedValue) {
            const [index, exactState] = storedValue.split(',');
            return {
                index: parseInt(index, 10), // Convert index to an integer
                exactState: exactState === '1' // Convert exactState to a boolean
            };
        }

        // Return default values if no stored value exists
        return { index: 0, exactState: state.exactSearch };
    }

    function storeData(key, index, exactState) {
        // Create a string value from index and exactState to store in localStorage
        const value = `${index},${exactState ? 1 : 0}`;

        // Store the value in localStorage using the provided key
        setItem(key, value);
    }


    // PARSE VOCAB FUNCTIONS =====================================================================================================================
    function parseVocabFromAnswer() {
        // Select all links containing "/kanji/" or "/vocabulary/" in the href attribute
        const elements = document.querySelectorAll('a[href*="/kanji/"], a[href*="/vocabulary/"]');
        console.log("Parsing Answer Page");

        // Iterate through the matched elements
        for (const element of elements) {
            const href = element.getAttribute('href');
            const text = element.textContent.trim();

            // Match the href to extract kanji or vocabulary (ignoring ID if present)
            const match = href.match(/\/(kanji|vocabulary)\/(?:\d+\/)?([^\#]*)#/);
            if (match) return match[2].trim();
            if (text) return text.trim();
        }
        return '';
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

            let vocabulary = plainElement.textContent.trim();

            const nestedVocabularyElement = plainElement.querySelector('div:not([style])');

            if (nestedVocabularyElement) {
                vocabulary = nestedVocabularyElement.textContent.trim();
            }

            const specificVocabularyElement = plainElement.querySelector('div:nth-child(3)');

            if (specificVocabularyElement) {
                vocabulary = specificVocabularyElement.textContent.trim();
            }

            // Regular expression to check if the vocabulary contains kanji characters
            const kanjiRegex = /[\u4e00-\u9faf\u3400-\u4dbf]/;
            if (kanjiRegex.test(vocabulary) || vocabulary) {
                console.log("Found Vocabulary:", vocabulary);
                return vocabulary;
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
        const match = url.match(/https:\/\/jpdb\.io\/vocabulary\/(\d+)\/([^\#\/]*)/);
        console.log("Parsing Vocabulary Page");

        if (match) {
            // Extract and decode the vocabulary part from the URL
            let vocab = match[2];
            state.embedAboveSubsectionMeanings = true; // Set state flag
            return decodeURIComponent(vocab);
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

    function createStarButton() {
        // Create a star button with an icon and click event for toggling favorite state
        const anchor = createAnchor('0.5rem');
        const starIcon = document.createElement('span');
        const storedValue = getItem(state.vocab);
        // console.log(storedValue);

        // Determine the star icon (filled or empty) based on stored value
        if (storedValue) {
            const [storedIndex, storedExactState] = storedValue.split(',');
            const index = parseInt(storedIndex, 10);
            const exactState = Boolean(parseInt(storedExactState, 10));
            starIcon.textContent = (state.currentExampleIndex === index && state.exactSearch === exactState) ? '★' : '☆';
        } else {
            starIcon.textContent = '☆';
        }


        // Style the star icon
        starIcon.style.fontSize = '1.4rem';
        starIcon.style.color = '#3D8DFF';
        starIcon.style.verticalAlign = 'middle';
        starIcon.style.position = 'relative';
        starIcon.style.top = '-2px';

        // Append the star icon to the anchor and set up the click event to toggle star state
        anchor.appendChild(starIcon);
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            toggleStarState(starIcon);
        });

        return anchor;
    }

    function toggleStarState(starIcon) {
        const storedValue = getItem(state.vocab);
        const isBlacklisted = storedValue && storedValue.split(',').length > 1 && parseInt(storedValue.split(',')[1], 10) === 2;

        // Return early if blacklisted
        if (isBlacklisted) {
            starIcon.textContent = '☆';
            return;
        }

        // Toggle the star state between filled and empty
        if (storedValue) {
            const [storedIndex, storedExactState] = storedValue.split(',');
            const index = parseInt(storedIndex, 10);
            const exactState = storedExactState === '1';
            if (index === state.currentExampleIndex && exactState === state.exactSearch) {
                removeItem(state.vocab);
                starIcon.textContent = '☆';
            } else {
                setItem(state.vocab, `${state.currentExampleIndex},${state.exactSearch ? 1 : 0}`);
                starIcon.textContent = '★';
            }
        } else {
            setItem(state.vocab, `${state.currentExampleIndex},${state.exactSearch ? 1 : 0}`);
            starIcon.textContent = '★';
        }
    }

    function createQuoteButton() {
        // Create a quote button with an icon and click event for toggling quote style
        const anchor = createAnchor('0rem');
        const quoteIcon = document.createElement('span');

        // Set the icon based on exact search state
        quoteIcon.innerHTML = state.exactSearch ? '<b>「」</b>' : '『』';

        // Style the quote icon
        quoteIcon.style.fontSize = '1.1rem';
        quoteIcon.style.color = '#3D8DFF';
        quoteIcon.style.verticalAlign = 'middle';
        quoteIcon.style.position = 'relative';
        quoteIcon.style.top = '0px';

        // Append the quote icon to the anchor and set up the click event to toggle quote state
        anchor.appendChild(quoteIcon);
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            toggleQuoteState(quoteIcon);
        });

        return anchor;
    }

    function toggleQuoteState(quoteIcon) {
        const storedValue = getItem(state.vocab);
        const isBlacklisted = storedValue && storedValue.split(',').length > 1 && parseInt(storedValue.split(',')[1], 10) === 2;

        // Return early if blacklisted
        if (isBlacklisted) {
            return;
        }

        // Toggle between single and double quote styles
        state.exactSearch = !state.exactSearch;
        quoteIcon.innerHTML = state.exactSearch ? '<b>「」</b>' : '『』';

        // Update state based on stored data
        const storedData = getStoredData(state.vocab);
        if (storedData && storedData.exactState === state.exactSearch) {
            state.currentExampleIndex = storedData.index;
        } else {
            state.currentExampleIndex = 0;
        }

        state.apiDataFetched = false;
        embedImageAndPlayAudio();
        getImmersionKitData(state.vocab, state.exactSearch)
            .then(() => {
            embedImageAndPlayAudio();
        })
            .catch(error => {
            console.error(error);
        });
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

    function createTextButton(vocab, exact) {
        const textButton = document.createElement('a');
        textButton.textContent = 'Immersion Kit';
        textButton.style.color = 'var(--subsection-label-color)';
        textButton.style.fontSize = '85%';
        textButton.style.marginRight = '0.5rem';
        textButton.style.verticalAlign = 'middle';

        const url = new URL('https://www.immersionkit.com/dictionary');
        url.searchParams.set('keyword', vocab);
        url.searchParams.set('sort', 'sentence_length:asc');
        if (exact) url.searchParams.set('exact', 'true');

        textButton.href = url.toString();
        textButton.target = '_blank';
        return textButton;
    }

    function createButtonContainer(soundUrl, vocab, exact) {
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
        const textButton = createTextButton(vocab, exact);
        const speakerButton = createSpeakerButton(soundUrl);
        const starButton = createStarButton();
        const quoteButton = createQuoteButton();

        // Center the buttons within the container
        const centeredButtonsWrapper = document.createElement('div');
        centeredButtonsWrapper.style.display = 'flex';
        centeredButtonsWrapper.style.justifyContent = 'center';
        centeredButtonsWrapper.style.flex = '1';

        centeredButtonsWrapper.append(textButton, speakerButton, starButton, quoteButton);
        buttonContainer.append(centeredButtonsWrapper, menuButton);

        return buttonContainer;
    }

    // ——— Stop any playing audio ———
    function stopCurrentAudio() {
        if (state.currentSource) {
            try {
                state.currentSource.onended = null;
                state.currentSource.stop(0);
                state.currentSource.disconnect();
            } catch (e) { /* already stopped? ignore */ }
            state.currentSource = null;
        }
    }

    // ——— Play a new clip ———
    function playAudio(soundUrl) {
        if (!soundUrl) return;

        // 1) bump play ID to cancel any in-flight requests/decodes
        const playId = ++state.lastPlayId;

        // 2) tear down old source instantly
        stopCurrentAudio();

        // 3) ensure context is resumed (autoplay policy)
        if (state.sharedAudioContext.state === 'suspended') {
            state.sharedAudioContext.resume().catch(() => {});
        }

        // 4) fetch via GM_xmlhttpRequest
        GM_xmlhttpRequest({
            method: 'GET',
            url: soundUrl,
            responseType: 'arraybuffer',
            onload(response) {
                // if a newer playAudio() ran, abort
                if (playId !== state.lastPlayId) return;

                state.sharedAudioContext.decodeAudioData(
                    response.response,
                    buffer => {
                        if (playId !== state.lastPlayId) return;

                        // wire up new source + gain
                        const src = state.sharedAudioContext.createBufferSource();
                        src.buffer = buffer;
                        const gain = state.sharedAudioContext.createGain();
                        gain.gain.setValueAtTime(0, state.sharedAudioContext.currentTime);
                        gain.gain.linearRampToValueAtTime(
                            (CONFIG.SOUND_VOLUME || 100) / 100,
                            state.sharedAudioContext.currentTime + 0.05
                        );
                        src.connect(gain).connect(state.sharedAudioContext.destination);

                        // start (skip initial 50 ms to avoid pop)
                        src.start(0, 0.05);

                        // when it ends, clear the reference if still “ours”
                        src.onended = () => {
                            if (state.currentSource === src) {
                                state.currentSource = null;
                            }
                        };

                        // hold onto it so stopCurrentAudio() can find it
                        state.currentSource = src;
                    },
                    err => {
                        console.error('decodeAudioData failed:', err);
                    }
                );
            },
            onerror(err) {
                console.error('GM_xmlhttpRequest failed:', err);
            }
        });
    }



    // has to be declared (referenced in multiple functions but definition requires variables local to one function)
    let hotkeysListener;

    function renderImageAndPlayAudio(vocab, shouldAutoPlaySound) {
        const example = state.examples[state.currentExampleIndex] || {};
        const imageUrl = example.image ? `https://us-southeast-1.linodeobjects.com/immersionkit/media/${example.media}/${example.title}/media/${example.image}` : null;
        const soundUrl = example.sound ? `https://us-southeast-1.linodeobjects.com/immersionkit/media/${example.media}/${example.title}/media/${example.sound}` : null;
        const sentence = example.sentence || null;
        const translation = example.translation || null;
        const title = example.title || null;
        const storedValue = getItem(state.vocab);
        const isBlacklisted = storedValue && storedValue.split(',').length > 1 && parseInt(storedValue.split(',')[1], 10) === 2;


        // Remove any existing container
        removeExistingContainer();
        if (!shouldRenderContainer()) return;

        // Create and append the main wrapper and text button container
        const wrapperDiv = createWrapperDiv();
        const textDiv = createButtonContainer(soundUrl, vocab, state.exactSearch);
        wrapperDiv.appendChild(textDiv);


        const createTextElement = (text) => {
            const textElement = document.createElement('div');
            textElement.textContent = text;
            textElement.style.padding = '100px 0';
            textElement.style.whiteSpace = 'pre'; // Ensures newlines are respected
            return textElement;
        };

        if (isBlacklisted) {
            wrapperDiv.appendChild(createTextElement('BLACKLISTED'));
            shouldAutoPlaySound = false;
        } else if (state.apiDataFetched) {
            if (imageUrl) {
                const imageElement = createImageElement(wrapperDiv, imageUrl, vocab, state.exactSearch);
                if (imageElement) {
                    imageElement.addEventListener('click', () => playAudio(soundUrl));
                }
            } else {
                wrapperDiv.appendChild(createTextElement(`NO IMAGE\n(${title})`));
            }
            // Append sentence and translation or a placeholder text
            sentence ? appendSentenceAndTranslation(wrapperDiv, sentence, translation) : appendNoneText(wrapperDiv);
        } else if (state.error) {
            wrapperDiv.appendChild(createTextElement('ERROR\nNO EXAMPLES FOUND\n\nRARE WORD OR\nIMMERSIONKIT API IS TEMPORARILY DOWN'));
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
                if (event.repeat) return;
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
            }

            window.addEventListener('keydown', hotkeysListener, {once: true});
        }
    }

    function removeExistingContainer() {
        // Remove the existing container if it exists
        const existingContainer = document.getElementById('immersion-kit-container');
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

    // Detect iOS
    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    // Preload images
    function preloadImages() {
        // Preload images around the current example index
        const preloadDiv = GM_addElement(document.body, 'div', { style: 'display: none;' });
        const startIndex = Math.max(0, state.currentExampleIndex - CONFIG.NUMBER_OF_PRELOADS);
        const endIndex = Math.min(state.examples.length - 1, state.currentExampleIndex + CONFIG.NUMBER_OF_PRELOADS);

        for (let i = startIndex; i <= endIndex; i++) {
            if (!state.preloadedIndices.has(i) && state.examples[i].image) {
                const example = state.examples[i];
                const imageUrl = `https://us-southeast-1.linodeobjects.com/immersionkit/media/${example.media}/${example.title}/media/${example.image}`;
                if (isIOS()) {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: imageUrl,
                        responseType: 'blob',
                        onload: function(response) {
                            if (response.status === 200 && response.response) {
                                example.blob = response.response;
                                state.preloadedIndices.add(i);
                            }
                        }
                    });
                } else {
                    GM_addElement(preloadDiv, 'img', { src: imageUrl });
                    state.preloadedIndices.add(i);
                }
            }
        }
    }

    // Create image element
    function createImageElement(wrapperDiv, imageUrl, vocab, exactSearch) {
        const searchVocab = exactSearch ? `「${vocab}」` : vocab;
        const example = state.examples[state.currentExampleIndex] || {};
        const title = example.title || '';
        let file_name = imageUrl.substring(imageUrl.lastIndexOf('/') + 1).replace(/^(Anime_|A_|Z)/, '');
        const titleText = `${searchVocab} #${state.currentExampleIndex + 1}\n${title}\n${file_name}`;

        if (isIOS()) {
            // --- Calculate width and 16:9 height from config ---
            const width = parseInt(CONFIG.IMAGE_WIDTH, 10);
            const height = Math.round(width * 9 / 16);

            // --- Outer container ---
            const imgContainer = document.createElement('div');
            imgContainer.style = `width:${width}px;max-width:${width}px;margin:10px auto 0;position:relative;min-height:${height}px;`;

            // --- Hidden image until loaded ---
            const img = document.createElement('img');
            img.alt = 'Embedded Image';
            img.title = titleText;
            img.style = `width:100%;max-width:${width}px;margin-top:10px;cursor:pointer;display:none;border-radius:4px;height:auto;`;

            // --- Error fallback, also 16:9 ---
            const errorFallback = document.createElement('div');
            errorFallback.style = `display:none;width:100%;aspect-ratio:16/9;`;
            errorFallback.innerHTML =
                `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <rect width="${width}" height="${height}" fill="#f8d7da"/>
                <text x="50%" y="50%" text-anchor="middle" fill="#721c24" dy=".3em" font-size="18">Image failed to load</text>
            </svg>`;

            imgContainer.append(img, errorFallback);
            wrapperDiv.appendChild(imgContainer);

            // --- Use cached blob else load ---
            if (example.blob) {
                const objectURL = URL.createObjectURL(example.blob);
                img.src = objectURL;
                img.onload = () => {
                    errorFallback.style.display = 'none';
                    img.style.display = 'block';
                    URL.revokeObjectURL(objectURL);
                };
                img.onerror = () => {
                    img.style.display = 'none';
                    errorFallback.style.display = 'block';
                };
            } else {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: imageUrl,
                    responseType: 'blob',
                    onload: function(response) {
                        if (response.status === 200 && response.response) {
                            example.blob = response.response;
                            const objectURL = URL.createObjectURL(response.response);
                            img.src = objectURL;
                            img.onload = () => {
                                errorFallback.style.display = 'none';
                                img.style.display = 'block';
                                URL.revokeObjectURL(objectURL);
                            };
                            img.onerror = () => {
                                img.style.display = 'none';
                                errorFallback.style.display = 'block';
                            };
                        } else {
                            errorFallback.style.display = 'block';
                            console.error('Failed to load image:', imageUrl);
                        }
                    },
                    onerror: function() {
                        errorFallback.style.display = 'block';
                        console.error('GM_xmlhttpRequest error for', imageUrl);
                    }
                });
            }
            return img;
        } else {
            // Non-iOS: just add the image
            return GM_addElement(wrapperDiv, 'img', {
                src: imageUrl,
                alt: 'Embedded Image',
                title: titleText,
                style: `max-width: ${CONFIG.IMAGE_WIDTH}; margin-top: 10px; cursor: pointer;`
        });
        }
    }

    function highlightVocab(sentence, vocab) {
        // Highlight vocabulary in the sentence based on configuration
        if (!CONFIG.COLORED_SENTENCE_TEXT) return sentence;

        if (state.exactSearch) {
            const regex = new RegExp(`(${vocab})`, 'g');
            return sentence.replace(regex, '<span style="color: var(--outline-input-color);">$1</span>');
        } else {
            return vocab.split('').reduce((acc, char) => {
                const regex = new RegExp(char, 'g');
                return acc.replace(regex, `<span style="color: var(--outline-input-color);">${char}</span>`);
            }, sentence);
        }
    }

    function appendSentenceAndTranslation(wrapperDiv, sentence, translation) {
        // Append sentence and translation to the wrapper div
        const sentenceText = document.createElement('div');
        sentenceText.innerHTML = highlightVocab(sentence, state.vocab);
        sentenceText.style.marginTop = '10px';
        sentenceText.style.fontSize = CONFIG.SENTENCE_FONT_SIZE;
        sentenceText.style.color = 'lightgray';
        sentenceText.style.maxWidth = CONFIG.IMAGE_WIDTH;
        sentenceText.style.whiteSpace = 'pre-wrap';
        wrapperDiv.appendChild(sentenceText);

        if (CONFIG.ENABLE_EXAMPLE_TRANSLATION && translation) {
            const translationText = document.createElement('div');
            translationText.innerHTML = replaceSpecialCharacters(translation);
            translationText.style.marginTop = '5px';
            translationText.style.fontSize = CONFIG.TRANSLATION_FONT_SIZE;
            translationText.style.color = 'var(--subsection-label-color)';
            translationText.style.maxWidth = CONFIG.IMAGE_WIDTH;
            translationText.style.whiteSpace = 'pre-wrap';
            wrapperDiv.appendChild(translationText);
        }
    }

    function appendNoneText(wrapperDiv) {
        // Append a "None" text to the wrapper div
        const noneText = document.createElement('div');
        noneText.textContent = 'None';
        noneText.style.marginTop = '10px';
        noneText.style.fontSize = '85%';
        noneText.style.color = 'var(--subsection-label-color)';
        wrapperDiv.appendChild(noneText);
    }

    function createNavigationDiv() {
        // Create and style the navigation div
        const navigationDiv = document.createElement('div');
        navigationDiv.id = 'immersion-kit-embed';
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
                stopCurrentAudio();
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
                stopCurrentAudio();
                renderImageAndPlayAudio(vocab, shouldAutoPlaySound);
                preloadImages();
            }
        });
        return rightArrow;
    }

    function createContainerDiv(leftArrow, wrapperDiv, rightArrow, navigationDiv) {
        // Create and configure the main container div
        const containerDiv = document.createElement('div');
        containerDiv.id = 'immersion-kit-container';
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
        const existingNavigationDiv = document.getElementById('immersion-kit-embed');
        if (existingNavigationDiv) existingNavigationDiv.remove();

        renderImageAndPlayAudio(state.vocab, CONFIG.AUTO_PLAY_SOUND);
        preloadImages();
    }

    function replaceSpecialCharacters(text) {
        // Replace special characters in the text
        return text.replace(/<br>/g, '\n').replace(/&quot;/g, '"').replace(/\n/g, '<br>');
    }


    //MENU FUNCTIONS=====================================================================================================================
    ////FILE OPERATIONS=====================================================================================================================
    function handleImportButtonClick() {
        handleFileInput('application/json', importFavorites);
    }

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
        const blob = new Blob([data], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function addBlacklist() {
        setItem(state.vocab, `0,2`);
        location.reload();
    }

    function remBlacklist() {
        removeItem(state.vocab);
        location.reload();
    }

    function exportFavorites() {
        const favorites = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(scriptPrefix)) {
                const keyPrefixless = key.substring(scriptPrefix.length); // chop off the script prefix
                if (!keyPrefixless.startsWith(configPrefix)) {
                    favorites[keyPrefixless] = localStorage.getItem(key);
                    // For backwards compatibility keep the exported keys prefixless
                }
            }
        }
        const data = JSON.stringify(favorites, null, 2);
        createBlobAndDownload(data, 'favorites.json', 'application/json');
    }

    function importFavorites(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const favorites = JSON.parse(e.target.result);
                for (const key in favorites) {
                    setItem(key, favorites[key]);
                }
                alert('Favorites imported successfully!');
                location.reload();
            } catch (error) {
                alert('Error importing favorites:', error);
            }
        };
        reader.readAsText(file);
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
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async function(e) {
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
        const deleteCurrentVocabButton = createDeleteCurrentVocabButton('400px');

        const actionButtonsContainer = document.createElement('div');
        actionButtonsContainer.style.textAlign = 'center';
        actionButtonsContainer.style.marginTop = '10px';
        actionButtonsContainer.append(closeButton, saveButton, defaultButton, deleteButton, deleteCurrentVocabButton);

        return actionButtonsContainer;
    }

    function createMenuButtons() {
        const blacklistContainer = createBlacklistContainer();
        const favoritesContainer = createFavoritesContainer();
        const dataContainer = createDataContainer();
        const actionButtonsContainer = createActionButtonsContainer();

        const buttonContainer = document.createElement('div');
        buttonContainer.append(blacklistContainer,favoritesContainer,dataContainer,actionButtonsContainer);

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

    ////BLACKLIST BUTTONS
    function createBlacklistContainer() {
        const blacklistButtonWidth = '200px';

        const addBlacklistButton = createButton('Add to Blacklist', '10px', addBlacklist, blacklistButtonWidth);
        const remBlacklistButton = createButton('Remove from Blacklist', '10px', remBlacklist, blacklistButtonWidth);

        const blacklistContainer = document.createElement('div');
        blacklistContainer.style.textAlign = 'center';
        blacklistContainer.style.marginTop = '10px';
        blacklistContainer.append(addBlacklistButton, remBlacklistButton);

        return blacklistContainer;
    }
    ////FAVORITE BUTTONS
    function createFavoritesContainer() {
        const favoritesButtonWidth = '200px';

        const exportButton = createButton('Export Favorites', '10px', exportFavorites, favoritesButtonWidth);
        const importButton = createButton('Import Favorites', '10px', handleImportButtonClick, favoritesButtonWidth);

        const favoritesContainer = document.createElement('div');
        favoritesContainer.style.textAlign = 'center';
        favoritesContainer.style.marginTop = '10px';
        favoritesContainer.append(exportButton, importButton);

        return favoritesContainer;

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
        if (!overlay) return;

        const inputs = overlay.querySelectorAll('input, span');
        const changes = gatherChanges(inputs);

        applyChanges(changes);
        finalizeSaveConfig();
        setVocabSize();
        setPageWidth();
    }

    function gatherChanges(inputs) {
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

                changes[configPrefix + key] = value + originalFormattedType;
            }
        });

        return changes;
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
    async function deleteCurrentVocab() {
        try {
            const db = await IndexedDBManager.open();
            let currentVocab = state.vocab;

            // Wrap currentVocab with angle quotes if exactSearch is true
            if (state.exactSearch) {
                currentVocab = `「${currentVocab}」`;
            }

            // Delete from IndexedDB
            await IndexedDBManager.deleteEntry(db, currentVocab);
            console.log('Deleting from IndexedDB:', currentVocab);

            // Delete from local storage
            const localStorageKey = scriptPrefix + state.vocab;
            if (localStorage.getItem(localStorageKey)) {
                localStorage.removeItem(localStorageKey);
                console.log('Deleting from local storage:', localStorageKey);
            }

            alert('Current vocabulary deleted successfully!');
            location.reload();
        } catch (error) {
            console.error('Error deleting current vocabulary:', error);
            alert('Error deleting current vocabulary.');
        }
    }

    function createDeleteCurrentVocabButton(width) {
        const deleteCurrentVocabButton = createButton('Refresh Current Vocab from API', '10px', deleteCurrentVocab, width);
        deleteCurrentVocabButton.style.backgroundColor = '#C82800';
        deleteCurrentVocabButton.style.color = 'white';
        return deleteCurrentVocabButton;
    }

    function createDeleteButton(width) {
        const deleteButton = createButton('DELETE', '10px', () => {
            createConfirmationPopup(
                'This will delete all your favorites and cached data. Are you sure?',
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

            if (typeof value === 'boolean') {
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
                const maxAllowedIndex = hotkeyOptions.length - 1

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
            if (!key.startsWith(scriptPrefix + configPrefix) || !localStorage.hasOwnProperty(key)) {continue};

            const configKey = key.substring((scriptPrefix + configPrefix).length); // chop off script prefix and config prefix
            if (!CONFIG.hasOwnProperty(configKey)) {continue};

            const savedValue = localStorage.getItem(key);
            if (savedValue === null) {continue};

            const valueType = typeof CONFIG[configKey];
            if (configKey === 'HOTKEYS') {
                CONFIG[configKey] = savedValue.split(' ')
            } else if (valueType === 'boolean') {
                CONFIG[configKey] = savedValue === 'true';
                if (configKey === 'DEFAULT_TO_EXACT_SEARCH') { state.exactSearch = CONFIG.DEFAULT_TO_EXACT_SEARCH }
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


    //MAIN FUNCTIONS=====================================================================================================================
    function onPageLoad() {
        // Initialize state and determine vocabulary based on URL
        state.embedAboveSubsectionMeanings = false;

        const url = window.location.href;
        const machineTranslationFrame = document.getElementById('machine-translation-frame');

        // Proceed only if the machine translation frame is not present
        if (!machineTranslationFrame) {

            //display embed for first time with loading text
            embedImageAndPlayAudio();
            setPageWidth();

            if (url.includes('/vocabulary/')) {
                state.vocab = parseVocabFromVocabulary();
            } else if (url.includes('/search?q=')) {
                state.vocab = parseVocabFromSearch();
            } else if (url.includes('c=')) {
                state.vocab = parseVocabFromAnswer();
            } else if (url.includes('/kanji/')) {
                state.vocab = parseVocabFromKanji();
            } else {
                state.vocab = parseVocabFromReview();
            }
        } else {
            console.log('Machine translation frame detected, skipping vocabulary parsing.');
        }

        // Retrieve stored data for the current vocabulary
        const { index, exactState } = getStoredData(state.vocab);
        state.currentExampleIndex = index;
        state.exactSearch = exactState;

        // Fetch data and embed image/audio if necessary
        if (state.vocab && !state.apiDataFetched) {
            getImmersionKitData(state.vocab, state.exactSearch)
                .then(() => {
                preloadImages();
                embedImageAndPlayAudio();
            })
                .catch(console.error);
        } else if (state.apiDataFetched) {
            embedImageAndPlayAudio();
            //preloadImages();
            setVocabSize();
            setPageWidth();
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
    observer.observe(document, { subtree: true, childList: true });

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