// ==UserScript==
// @name         LingQ Addon
// @description  Provides custom LingQ layouts
// @match        https://www.lingq.com/*
// @match        https://www.youtube-nocookie.com/*
// @match        https://www.youtube.com/embed/*
// @version      9.9.0
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @require https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js
// @namespace https://greasyfork.org/users/1458847
// @downloadURL https://update.greasyfork.org/scripts/533096/LingQ%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/533096/LingQ%20Addon.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const createClient = supabase.createClient;
    
    const storage = {
        get: (key, defaultValue) => {
            const value = GM_getValue(key);
            return value === undefined ? defaultValue : value;
        },
        set: (key, value) => GM_setValue(key, value)
    };
    
    const defaults = {
        styleType: "video",
        heightBig: 400,
        sentenceHeight: 400,
        sentenceAutoplay: false,
        widgetWidth: 400,
        fontSize: 1.1,
        lineHeight: 1.7,
        
        colorMode: "white",
        white_fontColor: "rgb(0, 0, 0)",
        white_translationFontColor: "rgb(0, 0, 0)",
        white_lingqBackground: "rgba(255, 232, 149, 1)",
        white_lingqBorder: "rgba(255, 200, 0, 0)",
        white_lingqBorderLearned: "rgba(255, 200, 0, 0)",
        white_unknownBackground: "rgba(198, 223, 255, 1)",
        white_unknownBorder: "rgba(0, 111, 255, 0)",
        white_playingUnderline: "rgb(0, 0, 0)",
        dark_fontColor: "rgb(255, 255, 255)",
        dark_translationFontColor: "rgb(255, 255, 255)",
        dark_lingqBackground: "rgba(108, 87, 43, 1)",
        dark_lingqBorder: "rgba(254, 203, 72, 0)",
        dark_lingqBorderLearned: "rgba(254, 203, 72, 0)",
        dark_unknownBackground: "rgba(37, 57, 82, 1)",
        dark_unknownBorder: "rgba(72, 154, 254, 0)",
        dark_playingUnderline: "rgb(255, 255, 255)",
        
        librarySortOption: 0,
        autoFinishing: false,
        focusPlayingSentence: false,
        showTranslation: false,
        usePageMode: false,
        
        keyboardShortcut: false,
        shortcutVideoFullscreen: 'p',
        shortcutBackward5s: 'a',
        shortcutForward5s: 's',
        shortcutTTSPlay: 'w',
        shortcutTranslator: 'e',
        shortcutMakeKnown: 'd',
        shortcutDictionary: 'f',
        shortcutCopySelected: 'c',
        shortcutMeaningInput: '`',
        shortcutChatInput: 'q',
        shortcutFlashcard: 'r',
        
        chatWidget: false,
        llmProviderModel: "openai gpt-4.1-nano",
        llmApiKey: "",
        askSelected: false,
        prependSummary: false,
        dbUrl: "",
        dbKey: "",
        
        tts: false,
        ttsAutoplay: false,
        ttsApiKey: "",
        ttsProvider: "openai",
        ttsVoice: {},
        ttsWord: false,
        ttsSentence: false,
    };
    
    const settings = new Proxy({}, {
        get: (target, key) => {
            if (key in target) return target[key];
            
            return storage.get(key, defaults[key]);
        },
        set: (target, key, value) => {
            storage.set(key, value);
            target[key] = value;
            return true;
        }
    });
    
    let supabaseClient;
    
    const openaiVoiceOptions = [
        {value: "random", text: "Random"},
        {value: "alloy", text: "Alloy"},
        {value: "ash", text: "Ash"},
        {value: "ballad", text: "Ballad"},
        {value: "coral", text: "Coral"},
        {value: "echo", text: "Echo"},
        {value: "fable", text: "Fable"},
        {value: "onyx", text: "Onyx"},
        {value: "nova", text: "Nova"},
        {value: "sage", text: "Sage"},
        {value: "shimmer", text: "Shimmer"},
        {value: "verse", text: "Verse"}];
    const googleGeminiVoiceOptions = [
        {value: "random", text: "Random"},
        {value: "Zephyr", text: "Zephyr (Bright)"},
        {value: "Puck", text: "Puck (Upbeat)"},
        {value: "Charon", text: "Charon (Informative)"},
        {value: "Kore", text: "Kore (Firm)"},
        {value: "Fenrir", text: "Fenrir (Excitable)"},
        {value: "Leda", text: "Leda (Youthful)"},
        {value: "Orus", text: "Orus (Firm)"},
        {value: "Aoede", text: "Aoede (Breezy)"},
        {value: "Callirrhoe", text: "Callirrhoe (Easy-going)"},
        {value: "Autonoe", text: "Autonoe (Bright)"},
        {value: "Enceladus", text: "Enceladus (Breathy)"},
        {value: "Iapetus", text: "Iapetus (Clear)"},
        {value: "Umbriel", text: "Umbriel (Easy-going)"},
        {value: "Algieba", text: "Algieba (Smooth)"},
        {value: "Despina", text: "Despina (Smooth)"},
        {value: "Erinome", text: "Erinome (Clear)"},
        {value: "Algenib", text: "Algenib (Gravelly)"},
        {value: "Rasalgethi", text: "Rasalgethi (Informative)"},
        {value: "Laomedeia", text: "Laomedeia (Upbeat)"},
        {value: "Achernar", text: "Achernar (Soft)"},
        {value: "Alnilam", text: "Alnilam (Firm)"},
        {value: "Schedar", text: "Schedar (Even)"},
        {value: "Gacrux", text: "Gacrux (Mature)"},
        {value: "Pulcherrima", text: "Pulcherrima (Forward)"},
        {value: "Achird", text: "Achird (Friendly)"},
        {value: "Zubenelgenubi", text: "Zubenelgenubi (Casual)"},
        {value: "Vindemiatrix", text: "Vindemiatrix (Gentle)"},
        {value: "Sadachbia", text: "Sadachbia (Lively)"},
        {value: "Sadaltager", text: "Sadaltager (Knowledgeable)"},
        {value: "Sulafat", text: "Sulafat (Warm)"}
    ];
    const googleCloudVoiceOptions = generateGoogleCloudVoiceOptions(getLessonLanguage());
    const voiceOptionsObject = {
        "openai": openaiVoiceOptions,
        "google gemini": googleGeminiVoiceOptions,
        "google cloud": googleCloudVoiceOptions
    };
    
    /* Get LingQ Data */
    
    function getLessonId(url) {
        const urlToGet = url ? url : document.URL
        const regex = /(http|https):\/\/www\.lingq\.com\/\w+\/learn\/\w+\/\w+\/\w+\/(\d+)/;
        const match = urlToGet.match(regex);
        
        return match[2];
    }
    
    function getCollectionId(url) {
        const urlToGet = url ? url : document.URL
        const regex = /(http|https):\/\/www\.lingq\.com\/\w+\/learn\/\w+\/web\/library\/course\/(\d+)/;
        const match = urlToGet.match(regex);
        
        return match[2];
    }
    
    function getLessonLanguage(url) {
        const urlToGet = url ? url : document.URL
        const regex = /(http|https)*:\/\/www\.lingq\.com\/\w+\/learn\/(\w+)\/\w+\/\w+\/\d+/;
        const match = urlToGet.match(regex);
        
        return match?.[2];
    }
    
    async function getUserProfile() {
        const url = `https://www.lingq.com/api/v3/profiles/`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        return data.results[0]
    }
    
    async function getLanguageCode() {
        const userProfile = await getUserProfile();
        return userProfile.active_language;
    }
    
    async function getDictionaryLanguage() {
        const userProfile = await getUserProfile();
        return await userProfile.dictionary_languages[0];
    }
    
    async function getDictionaryLocalePairs() {
        const url = `https://www.lingq.com/api/v2/dictionary-locales/`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        return Object.fromEntries(data.map(item => [item.code, item.title]));
    }
    
    async function getLessonInfo(lessonId) {
        const languageCode = await getLanguageCode();
        const url = `https://www.lingq.com/api/v3/${languageCode}/lessons/counters/?lesson=${lessonId}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        return data[lessonId];
    }
    
    async function getAllLessons(languageCode, collectionId) {
        let allLessons = [];
        let nextUrl = `https://www.lingq.com/api/v3/${languageCode}/search/?page=1&page_size=1000&collection=${collectionId}`;
        
        while (nextUrl) {
            try {
                const response = await fetch(nextUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                allLessons = allLessons.concat(data.results);
                nextUrl = data.next;
            } catch (error) {
                console.error('Error fetching lessons:', error);
                break;
            }
        }
        
        return allLessons;
    }
    
    async function setLessonProgress(lessonId, wordIndex) {
        const languageCode = await getLanguageCode();
        const url = `https://www.lingq.com/api/v3/${languageCode}/lessons/${lessonId}/bookmark/`;
        const payload = {wordIndex: wordIndex, completedWordIndex: wordIndex, client: 'web'};
        
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
    }
    
    async function getLessonSentences(lessonLanguage, lessonId) {
        const url = `https://www.lingq.com/api/v3/${lessonLanguage}/lessons/${lessonId}/sentences/`;
        
        const response = await fetch(url);
        return await response.json();
    }
    
    async function uploadAudioToLesson(lessonLanguage, lessonId, audioData, duration) {
        const url = `https://www.lingq.com/api/v3/${lessonLanguage}/lessons/${lessonId}/`;
        
        const formData = new FormData();
        formData.append('audio', new Blob([audioData], {type: 'audio/mpeg'}), 'output.mp3');
        formData.append('duration', duration);
        formData.append('external_audio', '');
        formData.append('language', lessonLanguage);
        
        const response = await fetch(url, {
            method: 'PATCH',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    async function updataTimestampToLesson(lessonLanguage, lessonId, timestamp) {
        const url = `https://www.lingq.com/api/v3/${lessonLanguage}/lessons/${lessonId}/timestamps/`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(timestamp)
        });
        
        if (!response.ok) {
            throw new Error(`Could not update timestamp. ${response.status} ${response.statusText}`);
        }
    }
    
    /* Utils */
    
    function createElement(tag, props = {}, ...children) {
        const element = document.createElement(tag);
        const { dataset, style, ...restProps } = props || {};
        
        Object.assign(element, restProps);
        
        if (typeof style === 'string') {
            element.style.cssText = style;
        } else if (typeof style === 'object' && style !== null) {
            Object.assign(element.style, style);
        }
        
        if (dataset && typeof dataset === 'object') {
            Object.entries(dataset).forEach(([key, value]) => {
                if (value != null) element.dataset[key] = String(value);
            });
        }
        
        children.forEach(child => child && element.append(child));
        return element;
    }
    
    function clickElement(selector) {
        const element = document.querySelector(selector);
        if (element) element.click();
    }
    
    function focusElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.focus();
            element.setSelectionRange(element.value.length, element.value.length);
        }
    }
    
    function waitForElement(selector, timeout = 1000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) return resolve(element);
            
            let timeoutId;
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;
                        
                        if (node.matches(selector)) {
                            clearTimeout(timeoutId);
                            resolve(node);
                            observer.disconnect();
                        } else {
                            const foundElement = node.querySelector(selector);
                            if (foundElement) {
                                clearTimeout(timeoutId);
                                resolve(foundElement);
                                observer.disconnect();
                            }
                        }
                    }
                });
            });
            
            observer.observe(document.documentElement, {childList: true, subtree: true});
            
            timeoutId = setTimeout(() => {
                resolve(null);
                observer.disconnect();
                console.log('Wait', `"${selector}" not found`);
            }, timeout);
        });
    }
    
    function copySelectedText() {
        const selected_text = document.querySelector(".reference-word");
        if (selected_text) {
            navigator.clipboard.writeText(selected_text.textContent);
        }
    }
    
    function extractTextFromDOM(domElement) {
        function getAllLeafNodes(root) {
            const leaves = [];
            
            function traverse(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    if (node.textContent.trim() !== "") leaves.push(node);
                    return;
                }
                if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                    if (node.childNodes.length === 0) {
                        leaves.push(node);
                        return;
                    }
                    for (const child of node.childNodes) {
                        traverse(child);
                    }
                }
            }
            
            traverse(root);
            return leaves;
        }
        
        const textParts = [];
        let sentenceElements = domElement.querySelectorAll('.sentence');
        sentenceElements = sentenceElements.length ? sentenceElements : [domElement];
        if (domElement.childNodes.length === 0) return null;
        
        sentenceElements.forEach(sentenceElement => {
            for (const childNode of getAllLeafNodes(sentenceElement)) {
                const text = childNode.textContent.trim();
                if (text) textParts.push(text);
                
                const parentNodeType = childNode.parentNode.nodeType;
                if (parentNodeType === Node.ELEMENT_NODE && childNode.parentNode.matches('.has-end-punctuation-question')) textParts.push('?');
                if (parentNodeType === Node.ELEMENT_NODE && childNode.parentNode.matches('.has-end-punctuation-period')) textParts.push('.');
            }
            textParts.push('\n');
        });
        
        return textParts.slice(0, -1).join(' ')
            .replace(/[^\S\n]?(\?|\.|\-|\n)[^\S\n]?/g, '$1')
            .replace(/[^\S\n]?(,)/g, '$1');
    }
    
    function showToast(inputMessage, success = true) {
        const toast = createElement("div", {
            className: 'userToast',
            textContent: inputMessage,
            style: `box-shadow: 0 0 10px 0 ${success ? 'rgb(76, 175, 80)' : 'rgb(175, 76, 80)'}`
        });
        document.querySelector('.reader-widget').appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1'
        }, 10);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 1000);
        }, 1500);
    }
    
    function finishLesson() {
        clickElement(".reader-component > .nav--right > a");
    }
    
    function preventPropagation(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    async function changeScrollAmount(selector, scrollAmount) {
        const readerContainer = await waitForElement(selector, 1000);
        
        if (readerContainer) {
            readerContainer.addEventListener("wheel", (event) => {
                event.preventDefault();
                const delta = event.deltaY;
                readerContainer.scrollTop += delta * scrollAmount;
            });
        }
    }
    
    function smoothScrollTo(element, to, duration) {
        const start = element.scrollTop;
        const change = to - start;
        const startTime = performance.now();
        
        function easeInOutCubic(t) {
            t *= 2;
            if (t < 1) return 0.5 * t * t * t;
            t -= 2;
            return 0.5 * (t * t * t + 2);
        }
        
        function animateScroll(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easedProgress = easeInOutCubic(progress);
            
            element.scrollTop = start + change * easedProgress;
            
            if (elapsedTime < duration) {
                requestAnimationFrame(animateScroll);
            } else {
                element.scrollTop = to;
            }
        }
        
        requestAnimationFrame(animateScroll);
    }
    
    function getRandomElement(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr?.[randomIndex];
    }
    
    function applyCSS(css) {
        const cssElement = createElement("style", {textContent: css});
        document.querySelector("head").appendChild(cssElement);
    }
    
    async function showTranslation() {
        const selector = "#lesson-menu  .dropdown-content";
        const dropdownList = await waitForElement(selector, 5000);
        const translationButton = Array.from(dropdownList.querySelectorAll('.dropdown-item > a')).find(link =>
            link.querySelector('.text-wrapper')?.textContent.trim() === "Show Translation"
        );
        if (translationButton) setTimeout(() => translationButton.click(), 1000);
    }
    
    function removeIndent(text) {
        const lines = text.split('\n');
        const processedLines = lines.map(line => line.trimStart());
        return processedLines.join('\n').trim();
    }
    
    async function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = createElement("script", {
                src: url,
                onload: () => resolve(script),
                onerror: reject
            });
            document.head.appendChild(script);
        });
    }
    
    async function decodeAudioData(audioContext, audioArrayBuffer) {
        return new Promise((resolve, reject) => {
            audioContext.decodeAudioData(audioArrayBuffer, resolve, reject);
        });
    }
    
    function encodeAudioBufferToMP3(audioBuffer, progressCallback) {
        return new Promise(resolve => {
            const sampleRate = audioBuffer.sampleRate;
            const mp3encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);
            const mp3Data = [];
            
            const monoLength = audioBuffer.length;
            const monoPcmData = audioBuffer.getChannelData(0);
            
            const samples = new Int16Array(monoLength);
            for (let i = 0; i < monoLength; i++) {
                samples[i] = monoPcmData[i] * 32767.5;
            }
            
            const sampleBlockSize = 1152;
            const totalSamples = samples.length;
            
            const targetUpdateCount = 100;
            const progressUpdateBlocksInterval = Math.max(1, Math.floor((totalSamples / sampleBlockSize) / targetUpdateCount));
            let nextUpdateBlockThreshold = progressUpdateBlocksInterval;
            
            let currentSampleIndex = 0;
            
            const processNextChunk = () => {
                const targetIndexForThisChunk = Math.min(totalSamples, (nextUpdateBlockThreshold * sampleBlockSize));
                
                while (currentSampleIndex < targetIndexForThisChunk) {
                    const currentBlockEnd = Math.min(currentSampleIndex + sampleBlockSize, totalSamples);
                    const currentSamples = samples.subarray(currentSampleIndex, currentBlockEnd);
                    
                    const mp3buf = mp3encoder.encodeBuffer(currentSamples);
                    if (mp3buf.length > 0) {
                        mp3Data.push(new Uint8Array(mp3buf));
                    }
                    
                    currentSampleIndex = currentBlockEnd;
                }
                
                if (currentSampleIndex >= nextUpdateBlockThreshold * sampleBlockSize) {
                    progressCallback(currentSampleIndex, totalSamples);
                    nextUpdateBlockThreshold += progressUpdateBlocksInterval;
                }
                
                if (currentSampleIndex < totalSamples) {
                    requestAnimationFrame(processNextChunk);
                } else {
                    const mp3buf = mp3encoder.flush();
                    if (mp3buf.length > 0) mp3Data.push(new Uint8Array(mp3buf));
                    
                    if (progressCallback) progressCallback(totalSamples, totalSamples);
                    
                    console.log(`Merging mp3 uint8array blocks into one.`);
                    let totalLength = 0;
                    for (let i = 0; i < mp3Data.length; i++) {
                        totalLength += mp3Data[i].length;
                    }
                    
                    const finalMp3Data = new Uint8Array(totalLength);
                    let offset = 0;
                    for (let i = 0; i < mp3Data.length; i++) {
                        finalMp3Data.set(mp3Data[i], offset);
                        offset += mp3Data[i].length;
                    }
                    resolve(finalMp3Data);
                }
            };
            
            requestAnimationFrame(processNextChunk);
        });
    }
    
    function generateGoogleCloudVoiceOptions(languageCode) {
        const voices = ["ar-XA-Chirp3-HD-Achernar", "ar-XA-Chirp3-HD-Achird", "ar-XA-Chirp3-HD-Algenib", "ar-XA-Chirp3-HD-Algieba", "ar-XA-Chirp3-HD-Alnilam", "ar-XA-Chirp3-HD-Aoede", "ar-XA-Chirp3-HD-Autonoe", "ar-XA-Chirp3-HD-Callirrhoe", "ar-XA-Chirp3-HD-Charon", "ar-XA-Chirp3-HD-Despina", "ar-XA-Chirp3-HD-Enceladus", "ar-XA-Chirp3-HD-Erinome", "ar-XA-Chirp3-HD-Fenrir", "ar-XA-Chirp3-HD-Gacrux", "ar-XA-Chirp3-HD-Iapetus", "ar-XA-Chirp3-HD-Kore", "ar-XA-Chirp3-HD-Laomedeia", "ar-XA-Chirp3-HD-Leda", "ar-XA-Chirp3-HD-Orus", "ar-XA-Chirp3-HD-Puck", "ar-XA-Chirp3-HD-Pulcherrima", "ar-XA-Chirp3-HD-Rasalgethi", "ar-XA-Chirp3-HD-Sadachbia", "ar-XA-Chirp3-HD-Sadaltager", "ar-XA-Chirp3-HD-Schedar", "ar-XA-Chirp3-HD-Sulafat", "ar-XA-Chirp3-HD-Umbriel", "ar-XA-Chirp3-HD-Vindemiatrix", "ar-XA-Chirp3-HD-Zephyr", "ar-XA-Chirp3-HD-Zubenelgenubi", "bn-IN-Chirp3-HD-Achernar", "bn-IN-Chirp3-HD-Achird", "bn-IN-Chirp3-HD-Algenib", "bn-IN-Chirp3-HD-Algieba", "bn-IN-Chirp3-HD-Alnilam", "bn-IN-Chirp3-HD-Aoede", "bn-IN-Chirp3-HD-Autonoe", "bn-IN-Chirp3-HD-Callirrhoe", "bn-IN-Chirp3-HD-Charon", "bn-IN-Chirp3-HD-Despina", "bn-IN-Chirp3-HD-Enceladus", "bn-IN-Chirp3-HD-Erinome", "bn-IN-Chirp3-HD-Fenrir", "bn-IN-Chirp3-HD-Gacrux", "bn-IN-Chirp3-HD-Iapetus", "bn-IN-Chirp3-HD-Kore", "bn-IN-Chirp3-HD-Laomedeia", "bn-IN-Chirp3-HD-Leda", "bn-IN-Chirp3-HD-Orus", "bn-IN-Chirp3-HD-Puck", "bn-IN-Chirp3-HD-Pulcherrima", "bn-IN-Chirp3-HD-Rasalgethi", "bn-IN-Chirp3-HD-Sadachbia", "bn-IN-Chirp3-HD-Sadaltager", "bn-IN-Chirp3-HD-Schedar", "bn-IN-Chirp3-HD-Sulafat", "bn-IN-Chirp3-HD-Umbriel", "bn-IN-Chirp3-HD-Vindemiatrix", "bn-IN-Chirp3-HD-Zephyr", "bn-IN-Chirp3-HD-Zubenelgenubi", "cmn-CN-Chirp3-HD-Achernar", "cmn-CN-Chirp3-HD-Achird", "cmn-CN-Chirp3-HD-Algenib", "cmn-CN-Chirp3-HD-Algieba", "cmn-CN-Chirp3-HD-Alnilam", "cmn-CN-Chirp3-HD-Aoede", "cmn-CN-Chirp3-HD-Autonoe", "cmn-CN-Chirp3-HD-Callirrhoe", "cmn-CN-Chirp3-HD-Charon", "cmn-CN-Chirp3-HD-Despina", "cmn-CN-Chirp3-HD-Enceladus", "cmn-CN-Chirp3-HD-Erinome", "cmn-CN-Chirp3-HD-Fenrir", "cmn-CN-Chirp3-HD-Gacrux", "cmn-CN-Chirp3-HD-Iapetus", "cmn-CN-Chirp3-HD-Kore", "cmn-CN-Chirp3-HD-Laomedeia", "cmn-CN-Chirp3-HD-Leda", "cmn-CN-Chirp3-HD-Orus", "cmn-CN-Chirp3-HD-Puck", "cmn-CN-Chirp3-HD-Pulcherrima", "cmn-CN-Chirp3-HD-Rasalgethi", "cmn-CN-Chirp3-HD-Sadachbia", "cmn-CN-Chirp3-HD-Sadaltager", "cmn-CN-Chirp3-HD-Schedar", "cmn-CN-Chirp3-HD-Sulafat", "cmn-CN-Chirp3-HD-Umbriel", "cmn-CN-Chirp3-HD-Vindemiatrix", "cmn-CN-Chirp3-HD-Zephyr", "cmn-CN-Chirp3-HD-Zubenelgenubi", "de-DE-Chirp3-HD-Achernar", "de-DE-Chirp3-HD-Achird", "de-DE-Chirp3-HD-Algenib", "de-DE-Chirp3-HD-Algieba", "de-DE-Chirp3-HD-Alnilam", "de-DE-Chirp3-HD-Aoede", "de-DE-Chirp3-HD-Autonoe", "de-DE-Chirp3-HD-Callirrhoe", "de-DE-Chirp3-HD-Charon", "de-DE-Chirp3-HD-Despina", "de-DE-Chirp3-HD-Enceladus", "de-DE-Chirp3-HD-Erinome", "de-DE-Chirp3-HD-Fenrir", "de-DE-Chirp3-HD-Gacrux", "de-DE-Chirp3-HD-Iapetus", "de-DE-Chirp3-HD-Kore", "de-DE-Chirp3-HD-Laomedeia", "de-DE-Chirp3-HD-Leda", "de-DE-Chirp3-HD-Orus", "de-DE-Chirp3-HD-Puck", "de-DE-Chirp3-HD-Pulcherrima", "de-DE-Chirp3-HD-Rasalgethi", "de-DE-Chirp3-HD-Sadachbia", "de-DE-Chirp3-HD-Sadaltager", "de-DE-Chirp3-HD-Schedar", "de-DE-Chirp3-HD-Sulafat", "de-DE-Chirp3-HD-Umbriel", "de-DE-Chirp3-HD-Vindemiatrix", "de-DE-Chirp3-HD-Zephyr", "de-DE-Chirp3-HD-Zubenelgenubi", "en-AU-Chirp3-HD-Achernar", "en-AU-Chirp3-HD-Achird", "en-AU-Chirp3-HD-Algenib", "en-AU-Chirp3-HD-Algieba", "en-AU-Chirp3-HD-Alnilam", "en-AU-Chirp3-HD-Aoede", "en-AU-Chirp3-HD-Autonoe", "en-AU-Chirp3-HD-Callirrhoe", "en-AU-Chirp3-HD-Charon", "en-AU-Chirp3-HD-Despina", "en-AU-Chirp3-HD-Enceladus", "en-AU-Chirp3-HD-Erinome", "en-AU-Chirp3-HD-Fenrir", "en-AU-Chirp3-HD-Gacrux", "en-AU-Chirp3-HD-Iapetus", "en-AU-Chirp3-HD-Kore", "en-AU-Chirp3-HD-Laomedeia", "en-AU-Chirp3-HD-Leda", "en-AU-Chirp3-HD-Orus", "en-AU-Chirp3-HD-Puck", "en-AU-Chirp3-HD-Pulcherrima", "en-AU-Chirp3-HD-Rasalgethi", "en-AU-Chirp3-HD-Sadachbia", "en-AU-Chirp3-HD-Sadaltager", "en-AU-Chirp3-HD-Schedar", "en-AU-Chirp3-HD-Sulafat", "en-AU-Chirp3-HD-Umbriel", "en-AU-Chirp3-HD-Vindemiatrix", "en-AU-Chirp3-HD-Zephyr", "en-AU-Chirp3-HD-Zubenelgenubi", "en-GB-Chirp3-HD-Achernar", "en-GB-Chirp3-HD-Achird", "en-GB-Chirp3-HD-Algenib", "en-GB-Chirp3-HD-Algieba", "en-GB-Chirp3-HD-Alnilam", "en-GB-Chirp3-HD-Aoede", "en-GB-Chirp3-HD-Autonoe", "en-GB-Chirp3-HD-Callirrhoe", "en-GB-Chirp3-HD-Charon", "en-GB-Chirp3-HD-Despina", "en-GB-Chirp3-HD-Enceladus", "en-GB-Chirp3-HD-Erinome", "en-GB-Chirp3-HD-Fenrir", "en-GB-Chirp3-HD-Gacrux", "en-GB-Chirp3-HD-Iapetus", "en-GB-Chirp3-HD-Kore", "en-GB-Chirp3-HD-Laomedeia", "en-GB-Chirp3-HD-Leda", "en-GB-Chirp3-HD-Orus", "en-GB-Chirp3-HD-Puck", "en-GB-Chirp3-HD-Pulcherrima", "en-GB-Chirp3-HD-Rasalgethi", "en-GB-Chirp3-HD-Sadachbia", "en-GB-Chirp3-HD-Sadaltager", "en-GB-Chirp3-HD-Schedar", "en-GB-Chirp3-HD-Sulafat", "en-GB-Chirp3-HD-Umbriel", "en-GB-Chirp3-HD-Vindemiatrix", "en-GB-Chirp3-HD-Zephyr", "en-GB-Chirp3-HD-Zubenelgenubi", "en-IN-Chirp3-HD-Achernar", "en-IN-Chirp3-HD-Achird", "en-IN-Chirp3-HD-Algenib", "en-IN-Chirp3-HD-Algieba", "en-IN-Chirp3-HD-Alnilam", "en-IN-Chirp3-HD-Aoede", "en-IN-Chirp3-HD-Autonoe", "en-IN-Chirp3-HD-Callirrhoe", "en-IN-Chirp3-HD-Charon", "en-IN-Chirp3-HD-Despina", "en-IN-Chirp3-HD-Enceladus", "en-IN-Chirp3-HD-Erinome", "en-IN-Chirp3-HD-Fenrir", "en-IN-Chirp3-HD-Gacrux", "en-IN-Chirp3-HD-Iapetus", "en-IN-Chirp3-HD-Kore", "en-IN-Chirp3-HD-Laomedeia", "en-IN-Chirp3-HD-Leda", "en-IN-Chirp3-HD-Orus", "en-IN-Chirp3-HD-Puck", "en-IN-Chirp3-HD-Pulcherrima", "en-IN-Chirp3-HD-Rasalgethi", "en-IN-Chirp3-HD-Sadachbia", "en-IN-Chirp3-HD-Sadaltager", "en-IN-Chirp3-HD-Schedar", "en-IN-Chirp3-HD-Sulafat", "en-IN-Chirp3-HD-Umbriel", "en-IN-Chirp3-HD-Vindemiatrix", "en-IN-Chirp3-HD-Zephyr", "en-IN-Chirp3-HD-Zubenelgenubi", "en-US-Chirp3-HD-Achernar", "en-US-Chirp3-HD-Achird", "en-US-Chirp3-HD-Algenib", "en-US-Chirp3-HD-Algieba", "en-US-Chirp3-HD-Alnilam", "en-US-Chirp3-HD-Aoede", "en-US-Chirp3-HD-Autonoe", "en-US-Chirp3-HD-Callirrhoe", "en-US-Chirp3-HD-Charon", "en-US-Chirp3-HD-Despina", "en-US-Chirp3-HD-Enceladus", "en-US-Chirp3-HD-Erinome", "en-US-Chirp3-HD-Fenrir", "en-US-Chirp3-HD-Gacrux", "en-US-Chirp3-HD-Iapetus", "en-US-Chirp3-HD-Kore", "en-US-Chirp3-HD-Laomedeia", "en-US-Chirp3-HD-Leda", "en-US-Chirp3-HD-Orus", "en-US-Chirp3-HD-Puck", "en-US-Chirp3-HD-Pulcherrima", "en-US-Chirp3-HD-Rasalgethi", "en-US-Chirp3-HD-Sadachbia", "en-US-Chirp3-HD-Sadaltager", "en-US-Chirp3-HD-Schedar", "en-US-Chirp3-HD-Sulafat", "en-US-Chirp3-HD-Umbriel", "en-US-Chirp3-HD-Vindemiatrix", "en-US-Chirp3-HD-Zephyr", "en-US-Chirp3-HD-Zubenelgenubi", "es-ES-Chirp3-HD-Achernar", "es-ES-Chirp3-HD-Achird", "es-ES-Chirp3-HD-Algenib", "es-ES-Chirp3-HD-Algieba", "es-ES-Chirp3-HD-Alnilam", "es-ES-Chirp3-HD-Aoede", "es-ES-Chirp3-HD-Autonoe", "es-ES-Chirp3-HD-Callirrhoe", "es-ES-Chirp3-HD-Charon", "es-ES-Chirp3-HD-Despina", "es-ES-Chirp3-HD-Enceladus", "es-ES-Chirp3-HD-Erinome", "es-ES-Chirp3-HD-Fenrir", "es-ES-Chirp3-HD-Gacrux", "es-ES-Chirp3-HD-Iapetus", "es-ES-Chirp3-HD-Kore", "es-ES-Chirp3-HD-Laomedeia", "es-ES-Chirp3-HD-Leda", "es-ES-Chirp3-HD-Orus", "es-ES-Chirp3-HD-Puck", "es-ES-Chirp3-HD-Pulcherrima", "es-ES-Chirp3-HD-Rasalgethi", "es-ES-Chirp3-HD-Sadachbia", "es-ES-Chirp3-HD-Sadaltager", "es-ES-Chirp3-HD-Schedar", "es-ES-Chirp3-HD-Sulafat", "es-ES-Chirp3-HD-Umbriel", "es-ES-Chirp3-HD-Vindemiatrix", "es-ES-Chirp3-HD-Zephyr", "es-ES-Chirp3-HD-Zubenelgenubi", "es-US-Chirp3-HD-Achernar", "es-US-Chirp3-HD-Achird", "es-US-Chirp3-HD-Algenib", "es-US-Chirp3-HD-Algieba", "es-US-Chirp3-HD-Alnilam", "es-US-Chirp3-HD-Aoede", "es-US-Chirp3-HD-Autonoe", "es-US-Chirp3-HD-Callirrhoe", "es-US-Chirp3-HD-Charon", "es-US-Chirp3-HD-Despina", "es-US-Chirp3-HD-Enceladus", "es-US-Chirp3-HD-Erinome", "es-US-Chirp3-HD-Fenrir", "es-US-Chirp3-HD-Gacrux", "es-US-Chirp3-HD-Iapetus", "es-US-Chirp3-HD-Kore", "es-US-Chirp3-HD-Laomedeia", "es-US-Chirp3-HD-Leda", "es-US-Chirp3-HD-Orus", "es-US-Chirp3-HD-Puck", "es-US-Chirp3-HD-Pulcherrima", "es-US-Chirp3-HD-Rasalgethi", "es-US-Chirp3-HD-Sadachbia", "es-US-Chirp3-HD-Sadaltager", "es-US-Chirp3-HD-Schedar", "es-US-Chirp3-HD-Sulafat", "es-US-Chirp3-HD-Umbriel", "es-US-Chirp3-HD-Vindemiatrix", "es-US-Chirp3-HD-Zephyr", "es-US-Chirp3-HD-Zubenelgenubi", "fr-CA-Chirp3-HD-Achernar", "fr-CA-Chirp3-HD-Achird", "fr-CA-Chirp3-HD-Algenib", "fr-CA-Chirp3-HD-Algieba", "fr-CA-Chirp3-HD-Alnilam", "fr-CA-Chirp3-HD-Aoede", "fr-CA-Chirp3-HD-Autonoe", "fr-CA-Chirp3-HD-Callirrhoe", "fr-CA-Chirp3-HD-Charon", "fr-CA-Chirp3-HD-Despina", "fr-CA-Chirp3-HD-Enceladus", "fr-CA-Chirp3-HD-Erinome", "fr-CA-Chirp3-HD-Fenrir", "fr-CA-Chirp3-HD-Gacrux", "fr-CA-Chirp3-HD-Iapetus", "fr-CA-Chirp3-HD-Kore", "fr-CA-Chirp3-HD-Laomedeia", "fr-CA-Chirp3-HD-Leda", "fr-CA-Chirp3-HD-Orus", "fr-CA-Chirp3-HD-Puck", "fr-CA-Chirp3-HD-Pulcherrima", "fr-CA-Chirp3-HD-Rasalgethi", "fr-CA-Chirp3-HD-Sadachbia", "fr-CA-Chirp3-HD-Sadaltager", "fr-CA-Chirp3-HD-Schedar", "fr-CA-Chirp3-HD-Sulafat", "fr-CA-Chirp3-HD-Umbriel", "fr-CA-Chirp3-HD-Vindemiatrix", "fr-CA-Chirp3-HD-Zephyr", "fr-CA-Chirp3-HD-Zubenelgenubi", "fr-FR-Chirp3-HD-Achernar", "fr-FR-Chirp3-HD-Achird", "fr-FR-Chirp3-HD-Algenib", "fr-FR-Chirp3-HD-Algieba", "fr-FR-Chirp3-HD-Alnilam", "fr-FR-Chirp3-HD-Aoede", "fr-FR-Chirp3-HD-Autonoe", "fr-FR-Chirp3-HD-Callirrhoe", "fr-FR-Chirp3-HD-Charon", "fr-FR-Chirp3-HD-Despina", "fr-FR-Chirp3-HD-Enceladus", "fr-FR-Chirp3-HD-Erinome", "fr-FR-Chirp3-HD-Fenrir", "fr-FR-Chirp3-HD-Gacrux", "fr-FR-Chirp3-HD-Iapetus", "fr-FR-Chirp3-HD-Kore", "fr-FR-Chirp3-HD-Laomedeia", "fr-FR-Chirp3-HD-Leda", "fr-FR-Chirp3-HD-Orus", "fr-FR-Chirp3-HD-Puck", "fr-FR-Chirp3-HD-Pulcherrima", "fr-FR-Chirp3-HD-Rasalgethi", "fr-FR-Chirp3-HD-Sadachbia", "fr-FR-Chirp3-HD-Sadaltager", "fr-FR-Chirp3-HD-Schedar", "fr-FR-Chirp3-HD-Sulafat", "fr-FR-Chirp3-HD-Umbriel", "fr-FR-Chirp3-HD-Vindemiatrix", "fr-FR-Chirp3-HD-Zephyr", "fr-FR-Chirp3-HD-Zubenelgenubi", "gu-IN-Chirp3-HD-Achernar", "gu-IN-Chirp3-HD-Achird", "gu-IN-Chirp3-HD-Algenib", "gu-IN-Chirp3-HD-Algieba", "gu-IN-Chirp3-HD-Alnilam", "gu-IN-Chirp3-HD-Aoede", "gu-IN-Chirp3-HD-Autonoe", "gu-IN-Chirp3-HD-Callirrhoe", "gu-IN-Chirp3-HD-Charon", "gu-IN-Chirp3-HD-Despina", "gu-IN-Chirp3-HD-Enceladus", "gu-IN-Chirp3-HD-Erinome", "gu-IN-Chirp3-HD-Fenrir", "gu-IN-Chirp3-HD-Gacrux", "gu-IN-Chirp3-HD-Iapetus", "gu-IN-Chirp3-HD-Kore", "gu-IN-Chirp3-HD-Laomedeia", "gu-IN-Chirp3-HD-Leda", "gu-IN-Chirp3-HD-Orus", "gu-IN-Chirp3-HD-Puck", "gu-IN-Chirp3-HD-Pulcherrima", "gu-IN-Chirp3-HD-Rasalgethi", "gu-IN-Chirp3-HD-Sadachbia", "gu-IN-Chirp3-HD-Sadaltager", "gu-IN-Chirp3-HD-Schedar", "gu-IN-Chirp3-HD-Sulafat", "gu-IN-Chirp3-HD-Umbriel", "gu-IN-Chirp3-HD-Vindemiatrix", "gu-IN-Chirp3-HD-Zephyr", "gu-IN-Chirp3-HD-Zubenelgenubi", "hi-IN-Chirp3-HD-Achernar", "hi-IN-Chirp3-HD-Achird", "hi-IN-Chirp3-HD-Algenib", "hi-IN-Chirp3-HD-Algieba", "hi-IN-Chirp3-HD-Alnilam", "hi-IN-Chirp3-HD-Aoede", "hi-IN-Chirp3-HD-Autonoe", "hi-IN-Chirp3-HD-Callirrhoe", "hi-IN-Chirp3-HD-Charon", "hi-IN-Chirp3-HD-Despina", "hi-IN-Chirp3-HD-Enceladus", "hi-IN-Chirp3-HD-Erinome", "hi-IN-Chirp3-HD-Fenrir", "hi-IN-Chirp3-HD-Gacrux", "hi-IN-Chirp3-HD-Iapetus", "hi-IN-Chirp3-HD-Kore", "hi-IN-Chirp3-HD-Laomedeia", "hi-IN-Chirp3-HD-Leda", "hi-IN-Chirp3-HD-Orus", "hi-IN-Chirp3-HD-Puck", "hi-IN-Chirp3-HD-Pulcherrima", "hi-IN-Chirp3-HD-Rasalgethi", "hi-IN-Chirp3-HD-Sadachbia", "hi-IN-Chirp3-HD-Sadaltager", "hi-IN-Chirp3-HD-Schedar", "hi-IN-Chirp3-HD-Sulafat", "hi-IN-Chirp3-HD-Umbriel", "hi-IN-Chirp3-HD-Vindemiatrix", "hi-IN-Chirp3-HD-Zephyr", "hi-IN-Chirp3-HD-Zubenelgenubi", "id-ID-Chirp3-HD-Achernar", "id-ID-Chirp3-HD-Achird", "id-ID-Chirp3-HD-Algenib", "id-ID-Chirp3-HD-Algieba", "id-ID-Chirp3-HD-Alnilam", "id-ID-Chirp3-HD-Aoede", "id-ID-Chirp3-HD-Autonoe", "id-ID-Chirp3-HD-Callirrhoe", "id-ID-Chirp3-HD-Charon", "id-ID-Chirp3-HD-Despina", "id-ID-Chirp3-HD-Enceladus", "id-ID-Chirp3-HD-Erinome", "id-ID-Chirp3-HD-Fenrir", "id-ID-Chirp3-HD-Gacrux", "id-ID-Chirp3-HD-Iapetus", "id-ID-Chirp3-HD-Kore", "id-ID-Chirp3-HD-Laomedeia", "id-ID-Chirp3-HD-Leda", "id-ID-Chirp3-HD-Orus", "id-ID-Chirp3-HD-Puck", "id-ID-Chirp3-HD-Pulcherrima", "id-ID-Chirp3-HD-Rasalgethi", "id-ID-Chirp3-HD-Sadachbia", "id-ID-Chirp3-HD-Sadaltager", "id-ID-Chirp3-HD-Schedar", "id-ID-Chirp3-HD-Sulafat", "id-ID-Chirp3-HD-Umbriel", "id-ID-Chirp3-HD-Vindemiatrix", "id-ID-Chirp3-HD-Zephyr", "id-ID-Chirp3-HD-Zubenelgenubi", "it-IT-Chirp3-HD-Achernar", "it-IT-Chirp3-HD-Achird", "it-IT-Chirp3-HD-Algenib", "it-IT-Chirp3-HD-Algieba", "it-IT-Chirp3-HD-Alnilam", "it-IT-Chirp3-HD-Aoede", "it-IT-Chirp3-HD-Autonoe", "it-IT-Chirp3-HD-Callirrhoe", "it-IT-Chirp3-HD-Charon", "it-IT-Chirp3-HD-Despina", "it-IT-Chirp3-HD-Enceladus", "it-IT-Chirp3-HD-Erinome", "it-IT-Chirp3-HD-Fenrir", "it-IT-Chirp3-HD-Gacrux", "it-IT-Chirp3-HD-Iapetus", "it-IT-Chirp3-HD-Kore", "it-IT-Chirp3-HD-Laomedeia", "it-IT-Chirp3-HD-Leda", "it-IT-Chirp3-HD-Orus", "it-IT-Chirp3-HD-Puck", "it-IT-Chirp3-HD-Pulcherrima", "it-IT-Chirp3-HD-Rasalgethi", "it-IT-Chirp3-HD-Sadachbia", "it-IT-Chirp3-HD-Sadaltager", "it-IT-Chirp3-HD-Schedar", "it-IT-Chirp3-HD-Sulafat", "it-IT-Chirp3-HD-Umbriel", "it-IT-Chirp3-HD-Vindemiatrix", "it-IT-Chirp3-HD-Zephyr", "it-IT-Chirp3-HD-Zubenelgenubi", "ja-JP-Chirp3-HD-Achernar", "ja-JP-Chirp3-HD-Achird", "ja-JP-Chirp3-HD-Algenib", "ja-JP-Chirp3-HD-Algieba", "ja-JP-Chirp3-HD-Alnilam", "ja-JP-Chirp3-HD-Aoede", "ja-JP-Chirp3-HD-Autonoe", "ja-JP-Chirp3-HD-Callirrhoe", "ja-JP-Chirp3-HD-Charon", "ja-JP-Chirp3-HD-Despina", "ja-JP-Chirp3-HD-Enceladus", "ja-JP-Chirp3-HD-Erinome", "ja-JP-Chirp3-HD-Fenrir", "ja-JP-Chirp3-HD-Gacrux", "ja-JP-Chirp3-HD-Iapetus", "ja-JP-Chirp3-HD-Kore", "ja-JP-Chirp3-HD-Laomedeia", "ja-JP-Chirp3-HD-Leda", "ja-JP-Chirp3-HD-Orus", "ja-JP-Chirp3-HD-Puck", "ja-JP-Chirp3-HD-Pulcherrima", "ja-JP-Chirp3-HD-Rasalgethi", "ja-JP-Chirp3-HD-Sadachbia", "ja-JP-Chirp3-HD-Sadaltager", "ja-JP-Chirp3-HD-Schedar", "ja-JP-Chirp3-HD-Sulafat", "ja-JP-Chirp3-HD-Umbriel", "ja-JP-Chirp3-HD-Vindemiatrix", "ja-JP-Chirp3-HD-Zephyr", "ja-JP-Chirp3-HD-Zubenelgenubi", "kn-IN-Chirp3-HD-Achernar", "kn-IN-Chirp3-HD-Achird", "kn-IN-Chirp3-HD-Algenib", "kn-IN-Chirp3-HD-Algieba", "kn-IN-Chirp3-HD-Alnilam", "kn-IN-Chirp3-HD-Aoede", "kn-IN-Chirp3-HD-Autonoe", "kn-IN-Chirp3-HD-Callirrhoe", "kn-IN-Chirp3-HD-Charon", "kn-IN-Chirp3-HD-Despina", "kn-IN-Chirp3-HD-Enceladus", "kn-IN-Chirp3-HD-Erinome", "kn-IN-Chirp3-HD-Fenrir", "kn-IN-Chirp3-HD-Gacrux", "kn-IN-Chirp3-HD-Iapetus", "kn-IN-Chirp3-HD-Kore", "kn-IN-Chirp3-HD-Laomedeia", "kn-IN-Chirp3-HD-Leda", "kn-IN-Chirp3-HD-Orus", "kn-IN-Chirp3-HD-Puck", "kn-IN-Chirp3-HD-Pulcherrima", "kn-IN-Chirp3-HD-Rasalgethi", "kn-IN-Chirp3-HD-Sadachbia", "kn-IN-Chirp3-HD-Sadaltager", "kn-IN-Chirp3-HD-Schedar", "kn-IN-Chirp3-HD-Sulafat", "kn-IN-Chirp3-HD-Umbriel", "kn-IN-Chirp3-HD-Vindemiatrix", "kn-IN-Chirp3-HD-Zephyr", "kn-IN-Chirp3-HD-Zubenelgenubi", "ko-KR-Chirp3-HD-Achernar", "ko-KR-Chirp3-HD-Achird", "ko-KR-Chirp3-HD-Algenib", "ko-KR-Chirp3-HD-Algieba", "ko-KR-Chirp3-HD-Alnilam", "ko-KR-Chirp3-HD-Aoede", "ko-KR-Chirp3-HD-Autonoe", "ko-KR-Chirp3-HD-Callirrhoe", "ko-KR-Chirp3-HD-Charon", "ko-KR-Chirp3-HD-Despina", "ko-KR-Chirp3-HD-Enceladus", "ko-KR-Chirp3-HD-Erinome", "ko-KR-Chirp3-HD-Fenrir", "ko-KR-Chirp3-HD-Gacrux", "ko-KR-Chirp3-HD-Iapetus", "ko-KR-Chirp3-HD-Kore", "ko-KR-Chirp3-HD-Laomedeia", "ko-KR-Chirp3-HD-Leda", "ko-KR-Chirp3-HD-Orus", "ko-KR-Chirp3-HD-Puck", "ko-KR-Chirp3-HD-Pulcherrima", "ko-KR-Chirp3-HD-Rasalgethi", "ko-KR-Chirp3-HD-Sadachbia", "ko-KR-Chirp3-HD-Sadaltager", "ko-KR-Chirp3-HD-Schedar", "ko-KR-Chirp3-HD-Sulafat", "ko-KR-Chirp3-HD-Umbriel", "ko-KR-Chirp3-HD-Vindemiatrix", "ko-KR-Chirp3-HD-Zephyr", "ko-KR-Chirp3-HD-Zubenelgenubi", "ml-IN-Chirp3-HD-Achernar", "ml-IN-Chirp3-HD-Achird", "ml-IN-Chirp3-HD-Algenib", "ml-IN-Chirp3-HD-Algieba", "ml-IN-Chirp3-HD-Alnilam", "ml-IN-Chirp3-HD-Aoede", "ml-IN-Chirp3-HD-Autonoe", "ml-IN-Chirp3-HD-Callirrhoe", "ml-IN-Chirp3-HD-Charon", "ml-IN-Chirp3-HD-Despina", "ml-IN-Chirp3-HD-Enceladus", "ml-IN-Chirp3-HD-Erinome", "ml-IN-Chirp3-HD-Fenrir", "ml-IN-Chirp3-HD-Gacrux", "ml-IN-Chirp3-HD-Iapetus", "ml-IN-Chirp3-HD-Kore", "ml-IN-Chirp3-HD-Laomedeia", "ml-IN-Chirp3-HD-Leda", "ml-IN-Chirp3-HD-Orus", "ml-IN-Chirp3-HD-Puck", "ml-IN-Chirp3-HD-Pulcherrima", "ml-IN-Chirp3-HD-Rasalgethi", "ml-IN-Chirp3-HD-Sadachbia", "ml-IN-Chirp3-HD-Sadaltager", "ml-IN-Chirp3-HD-Schedar", "ml-IN-Chirp3-HD-Sulafat", "ml-IN-Chirp3-HD-Umbriel", "ml-IN-Chirp3-HD-Vindemiatrix", "ml-IN-Chirp3-HD-Zephyr", "ml-IN-Chirp3-HD-Zubenelgenubi", "mr-IN-Chirp3-HD-Achernar", "mr-IN-Chirp3-HD-Achird", "mr-IN-Chirp3-HD-Algenib", "mr-IN-Chirp3-HD-Algieba", "mr-IN-Chirp3-HD-Alnilam", "mr-IN-Chirp3-HD-Aoede", "mr-IN-Chirp3-HD-Autonoe", "mr-IN-Chirp3-HD-Callirrhoe", "mr-IN-Chirp3-HD-Charon", "mr-IN-Chirp3-HD-Despina", "mr-IN-Chirp3-HD-Enceladus", "mr-IN-Chirp3-HD-Erinome", "mr-IN-Chirp3-HD-Fenrir", "mr-IN-Chirp3-HD-Gacrux", "mr-IN-Chirp3-HD-Iapetus", "mr-IN-Chirp3-HD-Kore", "mr-IN-Chirp3-HD-Laomedeia", "mr-IN-Chirp3-HD-Leda", "mr-IN-Chirp3-HD-Orus", "mr-IN-Chirp3-HD-Puck", "mr-IN-Chirp3-HD-Pulcherrima", "mr-IN-Chirp3-HD-Rasalgethi", "mr-IN-Chirp3-HD-Sadachbia", "mr-IN-Chirp3-HD-Sadaltager", "mr-IN-Chirp3-HD-Schedar", "mr-IN-Chirp3-HD-Sulafat", "mr-IN-Chirp3-HD-Umbriel", "mr-IN-Chirp3-HD-Vindemiatrix", "mr-IN-Chirp3-HD-Zephyr", "mr-IN-Chirp3-HD-Zubenelgenubi", "nl-BE-Chirp3-HD-Achernar", "nl-BE-Chirp3-HD-Achird", "nl-BE-Chirp3-HD-Algenib", "nl-BE-Chirp3-HD-Algieba", "nl-BE-Chirp3-HD-Alnilam", "nl-BE-Chirp3-HD-Autonoe", "nl-BE-Chirp3-HD-Callirrhoe", "nl-BE-Chirp3-HD-Despina", "nl-BE-Chirp3-HD-Enceladus", "nl-BE-Chirp3-HD-Erinome", "nl-BE-Chirp3-HD-Gacrux", "nl-BE-Chirp3-HD-Iapetus", "nl-BE-Chirp3-HD-Laomedeia", "nl-BE-Chirp3-HD-Pulcherrima", "nl-BE-Chirp3-HD-Rasalgethi", "nl-BE-Chirp3-HD-Sadachbia", "nl-BE-Chirp3-HD-Sadaltager", "nl-BE-Chirp3-HD-Schedar", "nl-BE-Chirp3-HD-Sulafat", "nl-BE-Chirp3-HD-Umbriel", "nl-BE-Chirp3-HD-Vindemiatrix", "nl-BE-Chirp3-HD-Zubenelgenubi", "nl-NL-Chirp3-HD-Achernar", "nl-NL-Chirp3-HD-Achird", "nl-NL-Chirp3-HD-Algenib", "nl-NL-Chirp3-HD-Algieba", "nl-NL-Chirp3-HD-Alnilam", "nl-NL-Chirp3-HD-Aoede", "nl-NL-Chirp3-HD-Autonoe", "nl-NL-Chirp3-HD-Callirrhoe", "nl-NL-Chirp3-HD-Charon", "nl-NL-Chirp3-HD-Despina", "nl-NL-Chirp3-HD-Enceladus", "nl-NL-Chirp3-HD-Erinome", "nl-NL-Chirp3-HD-Fenrir", "nl-NL-Chirp3-HD-Gacrux", "nl-NL-Chirp3-HD-Iapetus", "nl-NL-Chirp3-HD-Kore", "nl-NL-Chirp3-HD-Laomedeia", "nl-NL-Chirp3-HD-Leda", "nl-NL-Chirp3-HD-Orus", "nl-NL-Chirp3-HD-Puck", "nl-NL-Chirp3-HD-Pulcherrima", "nl-NL-Chirp3-HD-Rasalgethi", "nl-NL-Chirp3-HD-Sadachbia", "nl-NL-Chirp3-HD-Sadaltager", "nl-NL-Chirp3-HD-Schedar", "nl-NL-Chirp3-HD-Sulafat", "nl-NL-Chirp3-HD-Umbriel", "nl-NL-Chirp3-HD-Vindemiatrix", "nl-NL-Chirp3-HD-Zephyr", "nl-NL-Chirp3-HD-Zubenelgenubi", "pl-PL-Chirp3-HD-Achernar", "pl-PL-Chirp3-HD-Achird", "pl-PL-Chirp3-HD-Algenib", "pl-PL-Chirp3-HD-Algieba", "pl-PL-Chirp3-HD-Alnilam", "pl-PL-Chirp3-HD-Aoede", "pl-PL-Chirp3-HD-Autonoe", "pl-PL-Chirp3-HD-Callirrhoe", "pl-PL-Chirp3-HD-Charon", "pl-PL-Chirp3-HD-Despina", "pl-PL-Chirp3-HD-Enceladus", "pl-PL-Chirp3-HD-Erinome", "pl-PL-Chirp3-HD-Fenrir", "pl-PL-Chirp3-HD-Gacrux", "pl-PL-Chirp3-HD-Iapetus", "pl-PL-Chirp3-HD-Kore", "pl-PL-Chirp3-HD-Laomedeia", "pl-PL-Chirp3-HD-Leda", "pl-PL-Chirp3-HD-Orus", "pl-PL-Chirp3-HD-Puck", "pl-PL-Chirp3-HD-Pulcherrima", "pl-PL-Chirp3-HD-Rasalgethi", "pl-PL-Chirp3-HD-Sadachbia", "pl-PL-Chirp3-HD-Sadaltager", "pl-PL-Chirp3-HD-Schedar", "pl-PL-Chirp3-HD-Sulafat", "pl-PL-Chirp3-HD-Umbriel", "pl-PL-Chirp3-HD-Vindemiatrix", "pl-PL-Chirp3-HD-Zephyr", "pl-PL-Chirp3-HD-Zubenelgenubi", "pt-BR-Chirp3-HD-Achernar", "pt-BR-Chirp3-HD-Achird", "pt-BR-Chirp3-HD-Algenib", "pt-BR-Chirp3-HD-Algieba", "pt-BR-Chirp3-HD-Alnilam", "pt-BR-Chirp3-HD-Aoede", "pt-BR-Chirp3-HD-Autonoe", "pt-BR-Chirp3-HD-Callirrhoe", "pt-BR-Chirp3-HD-Charon", "pt-BR-Chirp3-HD-Despina", "pt-BR-Chirp3-HD-Enceladus", "pt-BR-Chirp3-HD-Erinome", "pt-BR-Chirp3-HD-Fenrir", "pt-BR-Chirp3-HD-Gacrux", "pt-BR-Chirp3-HD-Iapetus", "pt-BR-Chirp3-HD-Kore", "pt-BR-Chirp3-HD-Laomedeia", "pt-BR-Chirp3-HD-Leda", "pt-BR-Chirp3-HD-Orus", "pt-BR-Chirp3-HD-Puck", "pt-BR-Chirp3-HD-Pulcherrima", "pt-BR-Chirp3-HD-Rasalgethi", "pt-BR-Chirp3-HD-Sadachbia", "pt-BR-Chirp3-HD-Sadaltager", "pt-BR-Chirp3-HD-Schedar", "pt-BR-Chirp3-HD-Sulafat", "pt-BR-Chirp3-HD-Umbriel", "pt-BR-Chirp3-HD-Vindemiatrix", "pt-BR-Chirp3-HD-Zephyr", "pt-BR-Chirp3-HD-Zubenelgenubi", "ru-RU-Chirp3-HD-Aoede", "ru-RU-Chirp3-HD-Charon", "ru-RU-Chirp3-HD-Fenrir", "ru-RU-Chirp3-HD-Kore", "ru-RU-Chirp3-HD-Leda", "ru-RU-Chirp3-HD-Orus", "ru-RU-Chirp3-HD-Puck", "ru-RU-Chirp3-HD-Zephyr", "sw-KE-Chirp3-HD-Achernar", "sw-KE-Chirp3-HD-Achird", "sw-KE-Chirp3-HD-Algenib", "sw-KE-Chirp3-HD-Algieba", "sw-KE-Chirp3-HD-Alnilam", "sw-KE-Chirp3-HD-Aoede", "sw-KE-Chirp3-HD-Autonoe", "sw-KE-Chirp3-HD-Callirrhoe", "sw-KE-Chirp3-HD-Charon", "sw-KE-Chirp3-HD-Despina", "sw-KE-Chirp3-HD-Enceladus", "sw-KE-Chirp3-HD-Erinome", "sw-KE-Chirp3-HD-Fenrir", "sw-KE-Chirp3-HD-Gacrux", "sw-KE-Chirp3-HD-Iapetus", "sw-KE-Chirp3-HD-Kore", "sw-KE-Chirp3-HD-Laomedeia", "sw-KE-Chirp3-HD-Leda", "sw-KE-Chirp3-HD-Orus", "sw-KE-Chirp3-HD-Puck", "sw-KE-Chirp3-HD-Pulcherrima", "sw-KE-Chirp3-HD-Rasalgethi", "sw-KE-Chirp3-HD-Sadachbia", "sw-KE-Chirp3-HD-Sadaltager", "sw-KE-Chirp3-HD-Schedar", "sw-KE-Chirp3-HD-Sulafat", "sw-KE-Chirp3-HD-Umbriel", "sw-KE-Chirp3-HD-Vindemiatrix", "sw-KE-Chirp3-HD-Zephyr", "sw-KE-Chirp3-HD-Zubenelgenubi", "ta-IN-Chirp3-HD-Achernar", "ta-IN-Chirp3-HD-Achird", "ta-IN-Chirp3-HD-Algenib", "ta-IN-Chirp3-HD-Algieba", "ta-IN-Chirp3-HD-Alnilam", "ta-IN-Chirp3-HD-Aoede", "ta-IN-Chirp3-HD-Autonoe", "ta-IN-Chirp3-HD-Callirrhoe", "ta-IN-Chirp3-HD-Charon", "ta-IN-Chirp3-HD-Despina", "ta-IN-Chirp3-HD-Enceladus", "ta-IN-Chirp3-HD-Erinome", "ta-IN-Chirp3-HD-Fenrir", "ta-IN-Chirp3-HD-Gacrux", "ta-IN-Chirp3-HD-Iapetus", "ta-IN-Chirp3-HD-Kore", "ta-IN-Chirp3-HD-Laomedeia", "ta-IN-Chirp3-HD-Leda", "ta-IN-Chirp3-HD-Orus", "ta-IN-Chirp3-HD-Puck", "ta-IN-Chirp3-HD-Pulcherrima", "ta-IN-Chirp3-HD-Rasalgethi", "ta-IN-Chirp3-HD-Sadachbia", "ta-IN-Chirp3-HD-Sadaltager", "ta-IN-Chirp3-HD-Schedar", "ta-IN-Chirp3-HD-Sulafat", "ta-IN-Chirp3-HD-Umbriel", "ta-IN-Chirp3-HD-Vindemiatrix", "ta-IN-Chirp3-HD-Zephyr", "ta-IN-Chirp3-HD-Zubenelgenubi", "te-IN-Chirp3-HD-Achernar", "te-IN-Chirp3-HD-Achird", "te-IN-Chirp3-HD-Algenib", "te-IN-Chirp3-HD-Algieba", "te-IN-Chirp3-HD-Alnilam", "te-IN-Chirp3-HD-Aoede", "te-IN-Chirp3-HD-Autonoe", "te-IN-Chirp3-HD-Callirrhoe", "te-IN-Chirp3-HD-Charon", "te-IN-Chirp3-HD-Despina", "te-IN-Chirp3-HD-Enceladus", "te-IN-Chirp3-HD-Erinome", "te-IN-Chirp3-HD-Fenrir", "te-IN-Chirp3-HD-Gacrux", "te-IN-Chirp3-HD-Iapetus", "te-IN-Chirp3-HD-Kore", "te-IN-Chirp3-HD-Laomedeia", "te-IN-Chirp3-HD-Leda", "te-IN-Chirp3-HD-Orus", "te-IN-Chirp3-HD-Puck", "te-IN-Chirp3-HD-Pulcherrima", "te-IN-Chirp3-HD-Rasalgethi", "te-IN-Chirp3-HD-Sadachbia", "te-IN-Chirp3-HD-Sadaltager", "te-IN-Chirp3-HD-Schedar", "te-IN-Chirp3-HD-Sulafat", "te-IN-Chirp3-HD-Umbriel", "te-IN-Chirp3-HD-Vindemiatrix", "te-IN-Chirp3-HD-Zephyr", "te-IN-Chirp3-HD-Zubenelgenubi", "th-TH-Chirp3-HD-Achernar", "th-TH-Chirp3-HD-Achird", "th-TH-Chirp3-HD-Algenib", "th-TH-Chirp3-HD-Algieba", "th-TH-Chirp3-HD-Alnilam", "th-TH-Chirp3-HD-Aoede", "th-TH-Chirp3-HD-Autonoe", "th-TH-Chirp3-HD-Callirrhoe", "th-TH-Chirp3-HD-Charon", "th-TH-Chirp3-HD-Despina", "th-TH-Chirp3-HD-Enceladus", "th-TH-Chirp3-HD-Erinome", "th-TH-Chirp3-HD-Fenrir", "th-TH-Chirp3-HD-Gacrux", "th-TH-Chirp3-HD-Iapetus", "th-TH-Chirp3-HD-Kore", "th-TH-Chirp3-HD-Laomedeia", "th-TH-Chirp3-HD-Leda", "th-TH-Chirp3-HD-Orus", "th-TH-Chirp3-HD-Puck", "th-TH-Chirp3-HD-Pulcherrima", "th-TH-Chirp3-HD-Rasalgethi", "th-TH-Chirp3-HD-Sadachbia", "th-TH-Chirp3-HD-Sadaltager", "th-TH-Chirp3-HD-Schedar", "th-TH-Chirp3-HD-Sulafat", "th-TH-Chirp3-HD-Umbriel", "th-TH-Chirp3-HD-Vindemiatrix", "th-TH-Chirp3-HD-Zephyr", "th-TH-Chirp3-HD-Zubenelgenubi", "tr-TR-Chirp3-HD-Achernar", "tr-TR-Chirp3-HD-Achird", "tr-TR-Chirp3-HD-Algenib", "tr-TR-Chirp3-HD-Algieba", "tr-TR-Chirp3-HD-Alnilam", "tr-TR-Chirp3-HD-Aoede", "tr-TR-Chirp3-HD-Autonoe", "tr-TR-Chirp3-HD-Callirrhoe", "tr-TR-Chirp3-HD-Charon", "tr-TR-Chirp3-HD-Despina", "tr-TR-Chirp3-HD-Enceladus", "tr-TR-Chirp3-HD-Erinome", "tr-TR-Chirp3-HD-Fenrir", "tr-TR-Chirp3-HD-Gacrux", "tr-TR-Chirp3-HD-Iapetus", "tr-TR-Chirp3-HD-Kore", "tr-TR-Chirp3-HD-Laomedeia", "tr-TR-Chirp3-HD-Leda", "tr-TR-Chirp3-HD-Orus", "tr-TR-Chirp3-HD-Puck", "tr-TR-Chirp3-HD-Pulcherrima", "tr-TR-Chirp3-HD-Rasalgethi", "tr-TR-Chirp3-HD-Sadachbia", "tr-TR-Chirp3-HD-Sadaltager", "tr-TR-Chirp3-HD-Schedar", "tr-TR-Chirp3-HD-Sulafat", "tr-TR-Chirp3-HD-Umbriel", "tr-TR-Chirp3-HD-Vindemiatrix", "tr-TR-Chirp3-HD-Zephyr", "tr-TR-Chirp3-HD-Zubenelgenubi", "uk-UA-Chirp3-HD-Achernar", "uk-UA-Chirp3-HD-Achird", "uk-UA-Chirp3-HD-Algenib", "uk-UA-Chirp3-HD-Algieba", "uk-UA-Chirp3-HD-Alnilam", "uk-UA-Chirp3-HD-Autonoe", "uk-UA-Chirp3-HD-Callirrhoe", "uk-UA-Chirp3-HD-Despina", "uk-UA-Chirp3-HD-Enceladus", "uk-UA-Chirp3-HD-Erinome", "uk-UA-Chirp3-HD-Gacrux", "uk-UA-Chirp3-HD-Iapetus", "uk-UA-Chirp3-HD-Laomedeia", "uk-UA-Chirp3-HD-Pulcherrima", "uk-UA-Chirp3-HD-Rasalgethi", "uk-UA-Chirp3-HD-Sadachbia", "uk-UA-Chirp3-HD-Sadaltager", "uk-UA-Chirp3-HD-Schedar", "uk-UA-Chirp3-HD-Sulafat", "uk-UA-Chirp3-HD-Umbriel", "uk-UA-Chirp3-HD-Vindemiatrix", "uk-UA-Chirp3-HD-Zubenelgenubi", "ur-IN-Chirp3-HD-Achernar", "ur-IN-Chirp3-HD-Achird", "ur-IN-Chirp3-HD-Algenib", "ur-IN-Chirp3-HD-Algieba", "ur-IN-Chirp3-HD-Alnilam", "ur-IN-Chirp3-HD-Autonoe", "ur-IN-Chirp3-HD-Callirrhoe", "ur-IN-Chirp3-HD-Despina", "ur-IN-Chirp3-HD-Enceladus", "ur-IN-Chirp3-HD-Erinome", "ur-IN-Chirp3-HD-Gacrux", "ur-IN-Chirp3-HD-Iapetus", "ur-IN-Chirp3-HD-Laomedeia", "ur-IN-Chirp3-HD-Pulcherrima", "ur-IN-Chirp3-HD-Rasalgethi", "ur-IN-Chirp3-HD-Sadachbia", "ur-IN-Chirp3-HD-Sadaltager", "ur-IN-Chirp3-HD-Schedar", "ur-IN-Chirp3-HD-Sulafat", "ur-IN-Chirp3-HD-Umbriel", "ur-IN-Chirp3-HD-Vindemiatrix", "ur-IN-Chirp3-HD-Zubenelgenubi", "vi-VN-Chirp3-HD-Achernar", "vi-VN-Chirp3-HD-Achird", "vi-VN-Chirp3-HD-Algenib", "vi-VN-Chirp3-HD-Algieba", "vi-VN-Chirp3-HD-Alnilam", "vi-VN-Chirp3-HD-Aoede", "vi-VN-Chirp3-HD-Autonoe", "vi-VN-Chirp3-HD-Callirrhoe", "vi-VN-Chirp3-HD-Charon", "vi-VN-Chirp3-HD-Despina", "vi-VN-Chirp3-HD-Enceladus", "vi-VN-Chirp3-HD-Erinome", "vi-VN-Chirp3-HD-Fenrir", "vi-VN-Chirp3-HD-Gacrux", "vi-VN-Chirp3-HD-Iapetus", "vi-VN-Chirp3-HD-Kore", "vi-VN-Chirp3-HD-Laomedeia", "vi-VN-Chirp3-HD-Leda", "vi-VN-Chirp3-HD-Orus", "vi-VN-Chirp3-HD-Puck", "vi-VN-Chirp3-HD-Pulcherrima", "vi-VN-Chirp3-HD-Rasalgethi", "vi-VN-Chirp3-HD-Sadachbia", "vi-VN-Chirp3-HD-Sadaltager", "vi-VN-Chirp3-HD-Schedar", "vi-VN-Chirp3-HD-Sulafat", "vi-VN-Chirp3-HD-Umbriel", "vi-VN-Chirp3-HD-Vindemiatrix", "vi-VN-Chirp3-HD-Zephyr", "vi-VN-Chirp3-HD-Zubenelgenubi"];
        
        if (!languageCode) return [];
        
        const filteredLanguages = voices.filter(voice => {
            return voice.startsWith(languageCode + "-")
        });
        
        const options = [];
        let languages = new Set();
        
        filteredLanguages.forEach(voice => {
            const [language, name] = voice.split("-Chirp3-HD-");
            const value = voice;
            const text = `${name} (${language})`;
            options.push({value, text});
            languages.add(language);
        })
        languages = Array.from(languages).reverse();
        
        if (languages.length > 1) {
            languages.forEach(language => {
                options.unshift({value: `random-${language}`, text: `${language} Random`});
            })
        }
        options.unshift({value: 'random', text: 'Random'});
        
        return options;
    }
    
    function addElementToNavBar(element) {
        const anchorElement = document.querySelector('#app > .main-wrapper > [data-slot="sidebar-wrapper"] > header > div > a');
        if (!anchorElement) return;
        
        const headerDiv = anchorElement.parentElement;
        const existingButtons = headerDiv.querySelectorAll('.nav-button');
        
        if (existingButtons.length > 0) {
            existingButtons[existingButtons.length - 1].insertAdjacentElement('afterend', element);
        } else {
            anchorElement.insertAdjacentElement('afterend', element);
        }
    }
    
    function debounce(func, wait = 100) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    
    async function gmFetch(url, options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: url,
                headers: options.headers || {},
                data: options.body,
                onload: (res) => {
                    resolve({
                        ok: res.status >= 200 && res.status < 300,
                        status: res.status,
                        statusText: res.statusText,
                        json: () => Promise.resolve(JSON.parse(res.responseText)),
                        text: () => Promise.resolve(res.responseText)
                    });
                },
                onerror: (err) => {
                    reject(new Error(`GM_xmlhttpRequest failed: ${err.statusText || 'Unknown error'}`));
                }
            });
        });
    }
    
    function gmStream(url, options, onChunkReceived) {
        return new Promise((resolve, reject) => {
            let fullContent = '';
            let isResolved = false;
            
            const finish = () => {
                if (isResolved) return;
                isResolved = true;
                resolve(fullContent);
            };
            
            const req = GM_xmlhttpRequest({
                method: options.method || 'POST',
                url: url,
                headers: options.headers || {},
                data: options.body,
                responseType: 'stream',
                
                onloadstart: (res) => {
                    if (!res.response) {
                        return;
                    }
                    
                    const reader = res.response.getReader();
                    const decoder = new TextDecoder('utf-8');
                    let buffer = '';
                    
                    (async () => {
                        try {
                            while (true) {
                                const { done, value } = await reader.read();
                                
                                if (value) {
                                    const chunk = decoder.decode(value, { stream: true });
                                    buffer += chunk;
                                    
                                    const lines = buffer.split('\n');
                                    buffer = lines.pop();
                                    
                                    lines.forEach(line => {
                                        const trimmed = line.trim();
                                        if (!trimmed.startsWith('data: ')) return;
                                        
                                        const data = trimmed.slice(6).trim();
                                        if (data === '[DONE]') return;
                                        
                                        try {
                                            const json = JSON.parse(data);
                                            onChunkReceived(json);
                                            
                                            if (json.choices?.[0]?.delta?.content) {
                                                fullContent += json.choices[0].delta.content;
                                            }
                                        } catch (e) {
                                        }
                                    });
                                }
                                
                                if (done) {
                                    finish();
                                    break;
                                }
                            }
                        } catch (e) {
                            console.warn("Stream reading paused/error", e);
                        }
                    })();
                },
                
                onload: () => {
                    finish();
                },
                
                onerror: (err) => {
                    if (!isResolved) reject(new Error("Network Error"));
                },
                
                ontimeout: () => {
                    if (!isResolved) reject(new Error("Request Timed Out"));
                }
            });
        });
    }
    
    /* Modules */
    
    function stopPlayingAudio(autioContext) {
        if (!autioContext || audioContext.state !== 'running') return;
        
        try {
            autioContext.close();
            autioContext = null;
        } catch (error) {
            console.error("Stop Audio:", error);
            throw error;
        }
    }
    
    let audioContext = null;
    
    async function playAudio(audioData, volume = 0.5) {
        stopPlayingAudio(audioContext);
        
        return new Promise((resolve, reject) => {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const gainNode = audioContext.createGain();
            gainNode.gain.value = volume;
            gainNode.connect(audioContext.destination);
            
            const audioDataCopy = audioData.slice(0);
            audioContext.decodeAudioData(audioDataCopy)
                .then(buffer => {
                    const source = audioContext.createBufferSource();
                    source.buffer = buffer;
                    source.connect(gainNode);
                    source.start(0);
                    
                    source.onended = () => {
                        resolve();
                        audioContext.close();
                    };
                    source.onerror = (e) => {
                        reject("Audio play error : " + e);
                    }
                })
                .catch(e => {
                    reject("Decoding error : " + e)
                });
        });
    }
    
    async function openAITTS(text, API_KEY, voice = "nova", instructions) {
        const modelId = "gpt-4o-mini-tts";
        const apiUrl = "https://api.openai.com/v1/audio/speech";
        
        if (!API_KEY) throw new Error("Invalid or missing OpenAI API key. Please set the API_KEY");
        console.log('TTS', `${modelId}, ${voice}`);
        
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Accept": "audio/mpeg",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    input: text,
                    model: modelId,
                    voice: voice,
                    instructions: instructions,
                })
            });
            
            if (!response.ok) {
                let errorMessage = `HTTP error! Status: ${response.status}`;
                try {
                    const errorBody = await response.json();
                    errorMessage += ` - OpenAI Error: ${errorBody?.error?.message || JSON.stringify(errorBody)}`;
                } catch (parseError) {
                    errorMessage += ` - Failed to parse error response.`;
                }
                throw new Error(errorMessage);
            }
            
            return await response.arrayBuffer();
            
        } catch (error) {
            console.error("Error during OpenAI TTS request:", error);
            throw error;
        }
    }
    
    async function geminiTTS(text, API_KEY, voice = "Zephyr", ttsInstructions) {
        function createWavHeader(dataLength) {
            const sampleRate = 24000;
            const numChannels = 1;
            const bitsPerSample = 16;
            
            const headerLength = 44;
            const view = new DataView(new ArrayBuffer(headerLength));
            
            function writeString(view, offset, s) {
                for (let i = 0; i < s.length; i++) {
                    view.setUint8(offset + i, s.charCodeAt(i));
                }
            }
            
            // RIFF chunk
            writeString(view, 0, 'RIFF');
            view.setUint32(4, 36 + dataLength, true); // ChunkSize
            writeString(view, 8, 'WAVE');
            
            // fmt sub-chunk
            writeString(view, 12, 'fmt ');
            view.setUint32(16, 16, true);             // Subchunk1Size
            view.setUint16(20, 1, true);              // AudioFormat (1 = PCM)
            view.setUint16(22, numChannels, true);    // NumChannels
            view.setUint32(24, sampleRate, true);     // SampleRate
            view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); // ByteRate
            view.setUint16(32, numChannels * (bitsPerSample / 8), true); // BlockAlign
            view.setUint16(34, bitsPerSample, true); // BitsPerSample
            
            // data sub-chunk
            writeString(view, 36, 'data'); // Subchunk2ID
            view.setUint32(40, dataLength, true); // Subchunk2Size
            
            return view.buffer;
        }
        
        const modelId = "gemini-2.5-flash-preview-tts";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${API_KEY}`;
        
        if (!API_KEY) throw new Error("Invalid or missing Google API key. Please set the API_KEY");
        
        const maxRetries = 3;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{text: ttsInstructions + text}]
                        }],
                        generationConfig: {
                            speechConfig: {
                                voiceConfig: {
                                    prebuiltVoiceConfig: {voiceName: voice}
                                }
                            },
                            responseModalities: ["AUDIO"]
                        }
                    })
                });
                
                if (!response.ok) {
                    let errorMessage = `HTTP error! Status: ${response.status}`;
                    try {
                        const errorBody = await response.json();
                        errorMessage += ` - Google Error: ${errorBody?.error?.message || JSON.stringify(errorBody)}`;
                    } catch (parseError) {
                        errorMessage += ` - Failed to parse error response.`;
                    }
                    throw new Error(errorMessage);
                }
                
                const data = await response.json();
                const audioDataBase64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                
                if (audioDataBase64) {
                    const inputTokens = data.usageMetadata.promptTokenCount;
                    const outputTokens = data.usageMetadata.candidatesTokenCount;
                    const approxCost = inputTokens * 0.5 / 1000000 + outputTokens * 10 / 1000000;
                    console.log('TTS', `${modelId}, ${voice}, tokens: (${inputTokens}/${outputTokens}) cost: $${approxCost.toFixed(6)}`);
                    
                    const binaryString = atob(audioDataBase64);
                    const len = binaryString.length;
                    const bytes = new Uint8Array(len);
                    
                    for (let i = 0; i < len; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    
                    const wavHeader = createWavHeader(bytes.length);
                    
                    const completeBuffer = new Uint8Array(wavHeader.byteLength + bytes.byteLength);
                    completeBuffer.set(new Uint8Array(wavHeader), 0);
                    completeBuffer.set(bytes, wavHeader.byteLength);
                    
                    return completeBuffer.buffer;
                } else {
                    console.warn(`Google TTS Warning (Attempt ${attempt + 1}/${maxRetries})`, data.candidates?.[0]);
                }
            } catch (error) {
                console.error("Error during Google TTS request:", error);
                throw error;
            }
        }
    }
    
    async function googleCloudTTS(text, API_KEY, voice) {
        function base64ToArrayBuffer(base64String) {
            const binaryString = atob(base64String);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            return bytes.buffer;
        }
        
        const apiUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;
        
        if (!API_KEY) throw new Error("Invalid or missing Google API key. Please set the API_KEY");
        console.log('TTS', `${voice}`);
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    input: {text: text},
                    voice: {
                        languageCode: voice.split("-Chirp3-HD-")[0],
                        name: voice
                    },
                    audioConfig: {audioEncoding: "MP3"}
                })
            });
            
            if (!response.ok) {
                let errorMessage = `HTTP error! Status: ${response.status}`;
                
                const permissionErrorMessage = `
                    You need to enable the Text-to-Speech API in the Google Cloud Console.
                    1. Enable the Cloud Text-to-Speech API from the url: https://console.developers.google.com/apis/api/texttospeech.googleapis.com/overview
                    2. Visit https://console.cloud.google.com/apis/credentials Select an API key displayed > Select the Cloud Text-to-Speech API from the API restrictions section > ok > save.
                `;
                if (response.status === 403) console.error(removeIndent(permissionErrorMessage));
                
                try {
                    const errorBody = await response.json();
                    errorMessage += ` - Google Error: ${errorBody?.error?.message || JSON.stringify(errorBody)}`;
                } catch (parseError) {
                    errorMessage += ` - Failed to parse error response.`;
                }
                throw new Error(errorMessage);
            }
            const data = await response.json();
            const audioDataBase64 = data.audioContent;
            return base64ToArrayBuffer(audioDataBase64);
        } catch (error) {
            console.error("Error during Google Cloud TTS request:", error);
            throw error;
        }
    }
    
    async function getTTSResponse(provider, apiKey, voice, text, ttsInstructions = 'Read the text in a realistic, genuine, neutral, and clear manner. vary your rhythm and pace naturally, like a professional voice actor: ') {
        const voices = Array.from(document.querySelector("#ttsVoiceSelector").options)
            .map(option => option.value)
            .filter(option => {
                return !option.startsWith("random")
            });
        
        if (voice === "random") voice = getRandomElement(voices);
        
        switch (provider) {
            case "openai":
                return await openAITTS(text, apiKey, voice, ttsInstructions);
            case "google gemini":
                return await geminiTTS(text, apiKey, voice, ttsInstructions);
            case "google cloud":
                if (voice.startsWith("random-")) {
                    const randomLanguage = voice.replace("random-", "");
                    voice = getRandomElement(voices.filter(option => {
                        return option.startsWith(randomLanguage)
                    }));
                }
                
                return await googleCloudTTS(text, apiKey, voice);
        }
    }
    
    function getLLMPricing(llmProviderModel) {
        const llmInfo = document.querySelector(`#llmProviderModelSelector > option[value="${llmProviderModel}"]`).text;
        const [inputPrice, outputPrice] = llmInfo.match(/\$(\d+(?:\.\d+)?)\/\$(\d+(?:\.\d+)?)\)/).slice(1, 3).map(num => parseFloat(num) / 1000000);
        return [inputPrice, outputPrice];
    }
    
    async function getOpenAIResponse(provider, apiKey, model, history) {
        let api_url;
        switch (provider) {
            case "openai":
                api_url = `https://api.openai.com/v1/chat/completions`;
                break;
            case "google":
                api_url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
                break;
            case "deepseek":
                api_url = "https://api.deepseek.com/chat/completions";
                break;
        }
        
        const body = {
            model: model,
            temperature: 0.5,
            messages: history
        };
        if (provider === "google" && (model.includes("2.5") || model.includes("3"))) body.reasoning_effort = "none";
        if (provider === "openai" && model.includes("gpt-5")) {
            if (model.includes("gpt-5-mini") || model.includes("gpt-5-nano")) {
                body.reasoning_effort = "minimal";
                body.temperature = 1;
            }
        }
        
        try {
            const response = await gmFetch(api_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API error:', errorData);
                return errorData.error?.message || JSON.stringify(errorData);
            }
            
            const data = await response.json();
            const [inputPrice, outputPrice] = getLLMPricing(settings.llmProviderModel);
            
            const usage = data.usage || {};
            const cachedTokens = usage.prompt_tokens_details?.cached_tokens || usage.prompt_cache_hit_tokens || 0;
            const inputTokens = (usage.prompt_tokens || 0) - cachedTokens;
            const outputTokens = usage.completion_tokens || 0;
            const approxCost = (cachedTokens * (inputPrice / 4) + inputTokens * inputPrice + outputTokens * outputPrice);
            console.log('Chat', `${model}, tokens: (${cachedTokens}/${inputTokens}/${outputTokens}), cost: $${approxCost.toFixed(6)}`);
            
            return data.choices[0]?.message?.content || "Sorry, could not get a response.";
            
        } catch (error) {
            console.error('API call failed:', error);
            return `Sorry, something went wrong communicating with ${provider}.`;
        }
    }
    
    async function streamOpenAIResponse(provider, apiKey, model, history, onChunkReceived, onStreamEnd, onError) {
        let api_url;
        switch (provider) {
            case "openai": api_url = "https://api.openai.com/v1/chat/completions"; break;
            case "google": api_url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"; break;
            case "deepseek": api_url = "https://api.deepseek.com/chat/completions"; break;
        }
        
        const body = {
            model: model,
            temperature: 0.5,
            messages: history,
            stream: true
        };
        if (provider === "google" && (model.includes("2.5") || model.includes("3"))) body.reasoning_effort = "none";
        if (provider === "openai" && model.includes("gpt-5")) {
            if (model.includes("gpt-5-mini") || model.includes("gpt-5-nano")) {
                body.reasoning_effort = "minimal";
                body.temperature = 1;
            }
        }
        
        try {
            const finalContent = await gmStream(api_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(body)
            }, onChunkReceived);
            
            onStreamEnd(finalContent);
        } catch (error) {
            onError(error);
        }
    }
    
    async function getQuickSummary(provider, apikey, model, content) {
        const DictionaryLocalePairs = await getDictionaryLocalePairs()
        const lessonLanguage = DictionaryLocalePairs[getLessonLanguage()];
        const summaryPrompt = `
            # System Settings
            - Summarize the content in original content's language (${lessonLanguage}). The summary needs to be consist of two to three paragraphs.
            - This summary will be used as a quick summary presented before reading the full content.
            - Start with '<b>summary</b>'. Place each paragraph within '<p>' tag.
            - The result will be used as the innerHTML of a DOM element. So, Output raw HTML as plain text. This means your entire response should be a string of HTML. Do not use Markdown syntax, do not wrap your HTML in Markdown code blocks.
            - Be objective and factual. Write only based on the given data.
            - No preface and postface only include a summary.
            - Recommended length is at most 150 words.
            # Example Format
            <b>summary</b> <p>first paragraph</p> <p>second paragraph</p>`;
        
        const summary_history = [
            {role: "system", content: removeIndent(summaryPrompt)},
            {role: "user", content: content}
        ]
        const summary = await getOpenAIResponse(provider, apikey, model, summary_history);
        console.log(`Quick summary: \n${summary}`);
        
        return summary;
    }
    
    async function getLessonSummary(provider, apikey, model, content) {
        const summaryPrompt = `
            # System Settings
            - Summarize the content in ENGLISH even if the original content's language is non-English while retaining key information from the input.
            - This summary will be used for understanding the lesson's context without referring to the original content.
            - Do not omit key details from the original content.
            - Be objective and factual. Write only based on the given data.
            - No preface and postface only include a summary.
            - Recommended length is at most 1000 words.`;
        
        const summary_history = [
            {role: "system", content: removeIndent(summaryPrompt)},
            {role: "user", content: content}
        ]
        const summary = await getOpenAIResponse(provider, apikey, model, summary_history);
        console.log(`Lesson summary: \n${summary}`);
        
        return summary;
    }
    
    /* Features */
    
    function fixBugs() {
        function resizeToast() {
            const css = `
            .toasts {
                height: fit-content;
            }
            `;
            applyCSS(css);
        }
        
        resizeToast();
    }
    
    function setupPopups() {
        function getColorSettings(colorMode) {
            const prefix = colorMode === "dark" ? "dark_" : "white_";
            
            return {
                fontColor: settings[prefix + "fontColor"],
                translationFontColor: settings[prefix + "translationFontColor"],
                lingqBackground: settings[prefix + "lingqBackground"],
                lingqBorder: settings[prefix + "lingqBorder"],
                lingqBorderLearned: settings[prefix + "lingqBorderLearned"],
                unknownBackground: settings[prefix + "unknownBackground"],
                unknownBorder: settings[prefix + "unknownBorder"],
                playingUnderline: settings[prefix + "playingUnderline"],
            };
        }
        
        function createSettingsPopup() {
            const popup = createElement("div", {id: "lingqAddonSettingsPopup", className: "popup"});
            
            const dragHandle = createElement("div", {
                id: "lingqAddonSettingsDragHandle",
                className: "popup-drag-handle"
            });
            
            const dragHandleTitle = createElement("h3", {textContent: "LingQ Addon Settings"});
            dragHandle.appendChild(dragHandleTitle);
            
            const content = createElement("div", {style: `padding: 0 5px;`});
            const popupContentElement = generatePopupContent();
            content.appendChild(popupContentElement);
            
            popup.appendChild(dragHandle);
            popup.appendChild(content);
            
            return popup;
        }
        
        function generatePopupContent() {
            function addSelect(parent, id, labelText, options, selectedValue) {
                const container = createElement("div", {className: "popup-row"});
                container.appendChild(createElement("label", {htmlFor: id, textContent: labelText}));
                
                const select = createElement("select", {id});
                options.forEach(option => {
                    select.appendChild(createElement("option", {
                        value: option.value,
                        textContent: option.text,
                        selected: selectedValue === option.value
                    }));
                });
                
                container.appendChild(select);
                parent.appendChild(container);
                return container;
            }
            
            function addSlider(parent, id, labelText, valueId, value, unit, min, max, step) {
                const container = createElement("div", {className: "popup-row"});
                
                const label = createElement("label", {htmlFor: id});
                label.appendChild(document.createTextNode(labelText + " "));
                label.appendChild(createElement("span", {id: valueId, textContent: value}));
                if (unit) label.appendChild(document.createTextNode(unit));
                
                container.appendChild(label);
                container.appendChild(createElement("input", {
                    type: "range",
                    id,
                    min,
                    max,
                    step,
                    value,
                    style: "width: 100%;"
                }));
                
                parent.appendChild(container);
                return container;
            }
            
            function addColorPicker(parent, id, labelText, value) {
                const container = createElement("div", {className: "popup-row"});
                container.appendChild(createElement("label", {htmlFor: id + "Text", textContent: labelText}));
                
                const flexContainer = createElement("div", {style: "display: flex; align-items: center;"});
                flexContainer.appendChild(createElement("div", {id: id + "Picker", className: "color-picker"}));
                flexContainer.appendChild(createElement("input", {
                    type: "text",
                    id: id + "Text",
                    value,
                    style: "margin-left: 10px;",
                    className: "popup-input"
                }));
                
                container.appendChild(flexContainer);
                parent.appendChild(container);
                return container;
            }
            
            function addCheckbox(parent, id, labelText, checked) {
                const container = createElement("div", {className: "popup-row"});
                const label = createElement("label", {htmlFor: id, textContent: labelText});
                const checkbox = createElement("input", {type: "checkbox", id, checked, style: "margin-left: 10px;"});
                
                label.style.display = "flex";
                label.style.alignItems = "center";
                container.appendChild(label);
                label.appendChild(checkbox);
                parent.appendChild(container);
                
                return container;
            }
            
            function addShortcutInput(parent, id, labelText, value) {
                const container = createElement("div", {
                    className: "popup-row",
                    style: "display: flex; justify-content: space-between;"
                });
                
                container.appendChild(createElement("label", {htmlFor: id, textContent: labelText}));
                
                const input = createElement("input", {
                    type: "text",
                    id,
                    value,
                    maxLength: 1, // Restrict to single character
                    className: "popup-input",
                    style: "width: 30px; text-transform: lowercase; flex-grow: unset; text-align: center;"
                });
                container.appendChild(input);
                parent.appendChild(container);
                return container;
            }
            
            const popupLayout = createElement("div");
            const columns = createElement("div", {style: "display: flex; flex-direction: row;"});
            
            const container1 = createElement("div", {style: "padding: 5px; width: 350px;"});
            
            addSelect(container1, "styleTypeSelector", "Layout Style:", [
                {value: "video", text: "Video"},
                {value: "video2", text: "Video2"},
                {value: "audio", text: "Audio"},
                {value: "off", text: "Off"}
            ], settings.styleType);
            
            const videoSettings = createElement("div", {
                id: "videoSettings",
                style: `${settings.styleType === "video" ? "" : "display: none"}`
            });
            addSlider(videoSettings, "heightBigSlider", "Video Height:", "heightBigValue", settings.heightBig, "px", 300, 800, 10);
            container1.appendChild(videoSettings);
            
            const sentenceVideoSettings = createElement("div", {
                id: "sentenceVideoSettings",
                style: `${settings.styleType === "off" ? "" : "display: none"}`
            });
            addSlider(sentenceVideoSettings, "sentenceHeightSlider", "Sentence View Video Height:", "sentenceHeightValue", settings.sentenceHeight, "px", 300, 600, 10);
            addCheckbox(sentenceVideoSettings, "sentenceAutoplayCheckbox", "Autoplay in Sentence View", settings.sentenceAutoplay);
            container1.appendChild(sentenceVideoSettings);
            
            addSlider(container1, "widgetWidthSlider", "Widget Width:", "widgetWidthValue", settings.widgetWidth, "px", 330, 500, 10);
            
            addSlider(container1, "fontSizeSlider", "Font Size:", "fontSizeValue", settings.fontSize, "rem", 0.8, 1.8, 0.05);
            addSlider(container1, "lineHeightSlider", "Line Height:", "lineHeightValue", settings.lineHeight, "", 1.2, 3.0, 0.1);
            
            const colorSection = createElement("div", {className: "popup-section"});
            
            addSelect(colorSection, "colorModeSelector", "Color Mode:", [
                {value: "white", text: "White"},
                {value: "dark", text: "Dark"}
            ], settings.colorMode);
            
            [
                {id: "fontColor", label: "Font Color:", value: colorSettings.fontColor},
                {
                    id: "translationFontColor",
                    label: "Translation Font Color:",
                    value: colorSettings.translationFontColor
                },
                {id: "lingqBackground", label: "LingQ Background:", value: colorSettings.lingqBackground},
                {id: "lingqBorder", label: "LingQ Border:", value: colorSettings.lingqBorder},
                {id: "lingqBorderLearned", label: "LingQ Border Learned:", value: colorSettings.lingqBorderLearned},
                {id: "unknownBackground", label: "Unknown Background:", value: colorSettings.unknownBackground},
                {id: "unknownBorder", label: "Unknown Border:", value: colorSettings.unknownBorder},
                {id: "playingUnderline", label: "Playing Underline:", value: colorSettings.playingUnderline}
            ].forEach(config => addColorPicker(colorSection, config.id, config.label, config.value));
            
            container1.appendChild(colorSection);
            
            addCheckbox(container1, "autoFinishingCheckbox", "Finish Lesson Automatically", settings.autoFinishing);
            addCheckbox(container1, "focusPlayingSentenceCheckbox", "Focus on Playing Sentence", settings.focusPlayingSentence);
            addCheckbox(container1, "showTranslationCheckbox", "Show Translation Automatically", settings.showTranslation);
            addCheckbox(container1, "usePageModeCheckbox", "Use Paging Mode", settings.usePageMode);
            
            columns.appendChild(container1);
            
            const container2 = createElement("div", {style: "padding: 10px; width: 350px;"});
            
            addCheckbox(container2, "keyboardShortcutCheckbox", "Enable the Keyboard Shortcuts", settings.keyboardShortcut);
            
            const shortcutSection = createElement("div", {
                id: "keyboardShortcutSection",
                className: "popup-section",
                style: `${settings.keyboardShortcut ? "" : "display: none"}`
            });
            
            addShortcutInput(shortcutSection, "shortcutVideoFullscreenInput", "Video Fullscreen Toggle:", settings.shortcutVideoFullscreen);
            addShortcutInput(shortcutSection, "shortcutBackward5sInput", "5 Sec Backward:", settings.shortcutBackward5s);
            addShortcutInput(shortcutSection, "shortcutForward5sInput", "5 Sec Forward:", settings.shortcutForward5s);
            addShortcutInput(shortcutSection, "shortcutTTSPlayInput", "Play TTS Audio:", settings.shortcutTTSPlay);
            addShortcutInput(shortcutSection, "shortcutTranslatorOpenInput", "Open Translator:", settings.shortcutTranslator);
            addShortcutInput(shortcutSection, "shortcutMakeKnownInput", "Make Word Known:", settings.shortcutMakeKnown);
            addShortcutInput(shortcutSection, "shortcutDictionaryOpenInput", "Open Dictionary:", settings.shortcutDictionary);
            addShortcutInput(shortcutSection, "shortcutCopySelectedInput", "Copy Selected Text:", settings.shortcutCopySelected);
            addShortcutInput(shortcutSection, "shortcutMeaningInput", "Meaning Input Focus:", settings.shortcutMeaningInput);
            addShortcutInput(shortcutSection, "shortcutChatInput", "Chat Input Focus:", settings.shortcutChatInput);
            addShortcutInput(shortcutSection, "shortcutFlashcard", "Make a flashcard:", settings.shortcutFlashcard);
            
            container2.appendChild(shortcutSection);
            
            addCheckbox(container2, "chatWidgetCheckbox", "Enable the Chat Widget", settings.chatWidget);
            
            const chatWidgetSection = createElement("div", {
                id: "chatWidgetSection",
                className: "popup-section",
                style: `${settings.chatWidget ? "" : "display: none"}`
            });
            
            addSelect(chatWidgetSection, "llmProviderModelSelector", "Chat Provider: (Price per 1M tokens)", [
                {value: "openai gpt-5-chat-latest", text: "OpenAI GPT-5 Chat ($1.25/$10)"},
                {value: "openai gpt-5-mini", text: "OpenAI GPT-5 mini ($0.25/$2.0)"},
                {value: "openai gpt-5-nano", text: "OpenAI GPT-5 nano ($0.05/$0.4)"},
                {value: "openai gpt-4.1-mini", text: "OpenAI GPT-4.1 mini ($0.4/$1.6)"},
                {value: "openai gpt-4.1-nano", text: "OpenAI GPT-4.1 nano ($0.1/$0.4)"},
                {value: "google gemini-3-flash-preview", text: "Google Gemini 3.0 Flash ($0.5/$3.0)"},
                {value: "google gemini-2.5-flash", text: "Google Gemini 2.5 Flash ($0.3/$2.5)"},
                {value: "google gemini-2.5-flash-lite", text: "Google Gemini 2.5 Flash Light ($0.1/$0.4)"},
                {value: "google gemini-2.0-flash", text: "Google Gemini 2.0 Flash ($0.1/$0.4)"},
                {value: "deepseek deepseek-chat", text: "Deepseek ($0.28/$0.42)"}
            ], settings.llmProviderModel);
            
            const apiKeyContainer = createElement("div", {className: "popup-row"});
            apiKeyContainer.appendChild(createElement("label", {
                htmlFor: "llmApiKeyInput",
                textContent: "Chat API Key:"
            }));
            
            const apiKeyFlexContainer = createElement("div", {style: "display: flex; align-items: center;"});
            const apiKeyInput = createElement("input", {
                type: "password",
                id: "llmApiKeyInput",
                value: settings.llmApiKey,
                className: "popup-input"
            });
            apiKeyFlexContainer.appendChild(apiKeyInput)
            apiKeyContainer.appendChild(apiKeyFlexContainer);
            chatWidgetSection.appendChild(apiKeyContainer);
            
            addCheckbox(chatWidgetSection, "askSelectedCheckbox", "Enable asking with selected text", settings.askSelected);
            addCheckbox(chatWidgetSection, "prependSummaryCheckbox", "Prepend the Summary", settings.prependSummary);
            
            const dbUrlContainer = createElement("div", {
                className: "popup-row",
                style: "display: flex; justify-content: space-between; align-items: center;"
            });
            dbUrlContainer.appendChild(createElement("label", {
                htmlFor: "dbUrlInput",
                textContent: "DB URL: ",
                style: "width: 25%;"
            }));
            const dbUrlInputGroup = createElement("div", {
                style: "display: flex; align-items: center; gap: 5px; flex: 1;"
            });
            const dbUrlInput = createElement("input", {
                type: "text",
                id: "dbUrlInput",
                value: settings.dbUrl,
                className: "popup-input",
                style: "width: 70%; flex-grow: unset;"
            });
            const dbSetupGuide = createElement("a", {
                href: "https://github.com/2p990i9hpral/LingQ_Add-On?tab=readme-ov-file#supabase-db-optional",
                target: "_blank",
                textContent: "Setup",
                style: "font-size: 0.9em; color: var(--blue-500); margin: 0 auto;"
            });
            dbUrlInputGroup.appendChild(dbUrlInput);
            dbUrlInputGroup.appendChild(dbSetupGuide);
            dbUrlContainer.appendChild(dbUrlInputGroup);
            chatWidgetSection.appendChild(dbUrlContainer);
            
            const dbKeyContainer = createElement("div", {
                className: "popup-row",
                style: "display: flex; justify-content: space-between; align-items: center;"
            });
            dbKeyContainer.appendChild(createElement("label", {
                htmlFor: "dbKeyInput",
                textContent: "DB Key: ",
                style: "width: 25%;"
            }));
            const dbKeyInputGroup = createElement("div", {
                style: "display: flex; align-items: center; gap: 5px; flex: 1;"
            });
            const dbKeyInput = createElement("input", {
                type: "password",
                id: "dbKeyInput",
                value: settings.dbKey,
                className: "popup-input",
                style: "width: 70%; flex-grow: unset;"
            });
            const testDBConnectionButton = createElement("button", {
                id: "testDBConnectionButton",
                textContent: "Save",
                className: "popup-button",
                style: "margin: 0 auto;"
            })
            
            dbKeyInputGroup.appendChild(dbKeyInput);
            dbKeyInputGroup.appendChild(testDBConnectionButton);
            dbKeyContainer.appendChild(dbKeyInputGroup);
            chatWidgetSection.appendChild(dbKeyContainer);
            
            container2.appendChild(chatWidgetSection);
            
            addCheckbox(container2, "ttsCheckbox", "Enable AI-TTS", settings.tts);
            
            const ttsSection = createElement("div", {
                id: "ttsSection",
                className: "popup-section",
                style: `${settings.tts ? "" : "display: none"}`
            });
            
            addCheckbox(ttsSection, "ttsAutoplayCheckbox", "Autoplay TTS voice", settings.ttsAutoplay);
            
            const ttsApiKeyContainer = createElement("div", {className: "popup-row"});
            ttsApiKeyContainer.appendChild(createElement("label", {
                htmlFor: "ttsApiKeyInput",
                textContent: "TTS API Key:"
            }));
            
            const ttsApiKeyFlexContainer = createElement("div", {style: "display: flex; align-items: center;"});
            const ttsApiKeyInput = createElement("input", {
                type: "password",
                id: "ttsApiKeyInput",
                value: settings.ttsApiKey,
                className: "popup-input"
            });
            ttsApiKeyFlexContainer.appendChild(ttsApiKeyInput)
            ttsApiKeyContainer.appendChild(ttsApiKeyFlexContainer);
            ttsSection.appendChild(ttsApiKeyContainer);
            
            addSelect(ttsSection, "ttsProviderSelector", "TTS Provider:", [
                {value: "openai", text: "OpenAI"},
                {value: "google gemini", text: "Google Gemini"},
                {value: "google cloud", text: "Google Cloud"}
            ], settings.ttsProvider);
            
            addSelect(ttsSection, "ttsVoiceSelector", "TTS Voice:", voiceOptionsObject[settings.ttsProvider], settings.ttsVoice);
            
            addCheckbox(ttsSection, "ttsWordCheckbox", "Enable AI-TTS for words", settings.ttsWord);
            addCheckbox(ttsSection, "ttsSentenceCheckbox", "Enable AI-TTS for sentences", settings.ttsSentence);
            
            container2.appendChild(ttsSection);
            
            columns.appendChild(container2);
            
            const buttonContainer = createElement("div", {
                style: "display: flex; justify-content: space-between; align-items: center;",
                className: "popup-row"
            });
            
            buttonContainer.appendChild(createElement("button", {
                id: "resetSettingsBtn",
                textContent: "Reset",
                className: "popup-button"
            }));
            
            const donationButton = createElement("a", {href: "https://www.buymeacoffee.com/mutti", target: "_blank"})
            donationButton.appendChild(createElement("img", {
                src: "https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png",
                style: "width: 125px; height: 35px"
            }))
            buttonContainer.appendChild(donationButton);
            
            buttonContainer.appendChild(createElement("button", {
                id: "closeSettingsBtn",
                textContent: "Close",
                className: "popup-button"
            }));
            
            popupLayout.appendChild(columns)
            popupLayout.appendChild(buttonContainer);
            return popupLayout;
        }
        
        function createDownloadWordsPopup() {
            const popup = createElement("div", {id: "lingqDownloadWordsPopup", className: "popup"});
            
            const dragHandle = createElement("div", {
                id: "lingqDownloadWordsDragHandle",
                className: "popup-drag-handle"
            });
            
            const dragHandleTitle = createElement("h3", {textContent: "Download Words"});
            dragHandle.appendChild(dragHandleTitle);
            
            const content = createElement("div", {style: `padding: 0 10px;`});
            
            [
                {
                    id: "downloadUnknownLingqsBtn",
                    textContent: "Download Unknown LingQs (words + phrases)",
                    className: "popup-button"
                },
                {
                    id: "downloadUnknownLingqWordsBtn",
                    textContent: "Download Unknown LingQ Words (1, 2, 3, 4)",
                    className: "popup-button"
                },
                {
                    id: "downloadUnknownLingqPhrasesBtn",
                    textContent: "Download Unknown LingQ Phrases (1, 2, 3, 4)",
                    className: "popup-button"
                },
                {id: "downloadKnownLingqsBtn", textContent: "Download Known LingQs (✓)", className: "popup-button"},
                {id: "downloadKnownWordsBtn", textContent: "Download Known Words ", className: "popup-button"}
            ].forEach((prop) => {
                let rowContainer = createElement("div", {className: "popup-row"});
                rowContainer.appendChild(createElement("button", prop))
                content.appendChild(rowContainer);
            });
            
            const progressContainer = createElement("div", {id: "downloadProgressContainer", className: "popup-row"});
            const progressText = createElement("div", {id: "downloadProgressText"});
            const progressBar = createElement("progress", {id: "downloadProgressBar", value: "0", max: "100"});
            
            progressContainer.appendChild(progressText);
            progressContainer.appendChild(progressBar);
            content.appendChild(progressContainer);
            
            const buttonContainer = createElement("div", {
                style: "display: flex; justify-content: flex-end;",
                className: "popup-row"
            });
            const closeButton = createElement("button", {
                id: "closeDownloadWordsBtn",
                textContent: "Close",
                className: "popup-button"
            });
            buttonContainer.appendChild(closeButton);
            content.appendChild(buttonContainer);
            
            popup.appendChild(dragHandle);
            popup.appendChild(content);
            
            return popup;
        }
        
        function createTTSPlaygroundPopup() {
            const popup = createElement("div", {id: "ttsPlaygroundPopup", className: "popup"});
            
            const dragHandle = createElement("div", {id: "ttsPlaygroundDragHandle", className: "popup-drag-handle"});
            
            const dragHandleTitle = createElement("h3", {textContent: "TTS Playground"});
            dragHandle.appendChild(dragHandleTitle);
            
            const content = createElement("div", {style: `padding: 0 10px;`});
            
            const container = createElement("div", {style: "width: 550px;"});
            
            const instructionsContainer = createElement("div", {
                className: "popup-row",
                style: "display: flex; flex-direction: column;"
            });
            instructionsContainer.appendChild(createElement("label", {
                htmlFor: "ttsInstructionsInput",
                textContent: "Style Instructions"
            }));
            const ttsInstructions = createElement("input", {
                id: "ttsInstructionsInput",
                className: "popup-input",
                style: "padding: 3px 5px;",
                placeholder: `Describe the style of your dialog, e.g. "Read this in a dramatic whisper"`
            });
            instructionsContainer.appendChild(ttsInstructions);
            container.appendChild(instructionsContainer);
            
            const textContainer = createElement("div", {
                className: "popup-row",
                style: "display: flex; flex-direction: column;"
            });
            textContainer.appendChild(createElement("label", {htmlFor: "ttsTextarea", textContent: "Text"}));
            const ttsText = createElement("textarea", {
                id: "ttsTextarea",
                style: "width: 100%; height: 200px; border: 1px solid rgb(125 125 125 / 50%); border-radius: 5px; padding: 3px 5px;",
                placeholder: "Start writing or paste text here to generate speech."
            });
            textContainer.appendChild(ttsText);
            container.appendChild(textContainer);
            
            const ttsResultContainer = createElement("div", {
                style: "display: flex; justify-content: space-between; align-items: center;",
                className: "popup-row"
            });
            
            const ttsPlayer = createElement('audio', {
                id: "ttsPlayer",
                src: "",
                controls: true,
                style: "width: 400px; height: 40px; display: none;"
            });
            ttsResultContainer.appendChild(ttsPlayer);
            
            const ttsGenerateBtn = createElement("button", {
                id: "ttsGenerationButton",
                textContent: "Generate Audio",
                className: "popup-button",
                style: "margin-left: auto;"
            });
            ttsResultContainer.appendChild(ttsGenerateBtn);
            
            container.appendChild(ttsResultContainer);
            
            content.appendChild(container);
            
            const buttonContainer = createElement("div", {
                style: "display: flex; justify-content: flex-end;",
                className: "popup-row"
            });
            const closeButton = createElement("button", {
                id: "closeTTSPlaygroundBtn",
                textContent: "Close",
                className: "popup-button"
            });
            buttonContainer.appendChild(closeButton);
            content.appendChild(buttonContainer);
            
            popup.appendChild(dragHandle);
            popup.appendChild(content);
            
            return popup;
        }
        
        function createFlashcardPopup() {
            const paginationContainer = createElement("div", {id: "flashcardPagination", style: "display:flex; align-items:center; justify-content:flex-end;"},
                createElement("button", {id: "flashcardPaginationPrev", className: "popup-button", disabled: true}, "<"),
                createElement("span", {id: "flashcardPageInfo", style: "width: 50px; text-align: center;"}, "1/1",),
                createElement("button", {id: "flashcardPaginationNext", className: "popup-button", disabled: true}, ">")
            );
            
            const flashcardTableContainer =  createElement("div", {id: "flashcardTableContainer"},
                createElement("table", {id: "flashcardTable"},
                    createElement("thead", {},
                        createElement("tr", {},
                            ...["", "Word", "Meaning", "Explanation"]
                                .map(headerText => createElement("th", {}, headerText)
                                )
                        )
                    ),
                    createElement("tbody")
                )
            );
            
            const popup = createElement("div", {id: "flashcardPopup", className: "popup"},
                createElement("div", {id: "flashcardDragHandle", className: "popup-drag-handle"},
                    createElement("h3", {textContent: "Flashcard Manager"})
                ),
                createElement("div", {style: "padding: 0 15px; width: 800px;"},
                    createElement("div", {id: "flashcardPopupHeader"},
                        createElement("span", {id: "flashcardCount"}, "Flashcards:"),
                        createElement("input", {id: "flashcardSearchInput", type: "text", placeholder: "Search word or meaning..."}),
                        paginationContainer
                    ),
                    flashcardTableContainer,
                    createElement("div", {className: "popup-row", style: "display: flex; justify-content: flex-end; gap: 10px; margin: 10px 0;"},
                        createElement("button", {id: "flashcardCsvDownload", className: "popup-button"}, "Export as CSV"),
                        createElement("button", {id: "closeFlashcardPopupBtn", className: "popup-button"}, "Close")
                    )
                )
            );
            return popup;
        }
        
        function makeDraggable(element, handle) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            
            if (handle) {
                handle.onmousedown = dragMouseDown;
            } else {
                element.onmousedown = dragMouseDown;
            }
            
            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                
                if (element.style.transform && element.style.transform.includes('translate')) {
                    const rect = element.getBoundingClientRect();
                    
                    element.style.transform = 'none';
                    element.style.top = rect.top + 'px';
                    element.style.left = rect.left + 'px';
                }
                
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }
            
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
            }
            
            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
        
        function setupSettingEventListeners() {
            function initializePickrs() {
                function setupRGBAPickr(pickerId, textId, settingKey, cssVar) {
                    function saveColorSetting(key, value) {
                        const currentColorMode = document.getElementById("colorModeSelector").value;
                        const prefix = currentColorMode === "dark" ? "dark_" : "white_";
                        settings[prefix + key] = value;
                    }
                    
                    const pickerElement = document.getElementById(pickerId);
                    const textElement = document.getElementById(textId);
                    
                    if (!pickerElement || !textElement) return;
                    
                    pickerElement.style.backgroundColor = textElement.value;
                    
                    const pickr = Pickr.create({
                        el: pickerElement,
                        theme: 'nano',
                        useAsButton: true,
                        default: textElement.value,
                        components: {preview: true, opacity: true, hue: true}
                    });
                    
                    pickr.on('change', (color) => {
                        const rgbaColor = color.toRGBA();
                        
                        const r = Math.round(rgbaColor[0]);
                        const g = Math.round(rgbaColor[1]);
                        const b = Math.round(rgbaColor[2]);
                        const a = rgbaColor[3];
                        
                        const roundedRGBA = `rgba(${r}, ${g}, ${b}, ${a})`;
                        
                        textElement.value = roundedRGBA;
                        pickerElement.style.backgroundColor = roundedRGBA;
                        document.documentElement.style.setProperty(cssVar, roundedRGBA);
                        
                        saveColorSetting(settingKey, roundedRGBA);
                    });
                    
                    textElement.addEventListener('change', function () {
                        const rgbaColor = this.value;
                        
                        pickr.setColor(this.value);
                        saveColorSetting(settingKey, rgbaColor);
                        document.documentElement.style.setProperty(cssVar, rgbaColor);
                        pickerElement.style.backgroundColor = rgbaColor;
                    });
                    
                    pickr.on('hide', () => {
                        const rgbaColor = pickr.getColor().toRGBA().toString();
                        pickerElement.style.backgroundColor = rgbaColor;
                    });
                }
                
                return new Promise((resolve) => {
                    const pickrCss = createElement('link', {
                        rel: 'stylesheet',
                        href: 'https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/nano.min.css'
                    });
                    document.head.appendChild(pickrCss);
                    
                    const pickrScript = createElement('script', {
                        src: 'https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js',
                        onload: () => resolve() // Pass function reference directly
                    });
                    document.head.appendChild(pickrScript);
                }).then(() => {
                    setupRGBAPickr('lingqBackgroundPicker', 'lingqBackgroundText', 'lingqBackground', '--lingq-background');
                    setupRGBAPickr('lingqBorderPicker', 'lingqBorderText', 'lingqBorder', '--lingq-border');
                    setupRGBAPickr('lingqBorderLearnedPicker', 'lingqBorderLearnedText', 'lingqBorderLearned', '--lingq-border-learned');
                    setupRGBAPickr('unknownBackgroundPicker', 'unknownBackgroundText', 'unknownBackground', '--unknown-background');
                    setupRGBAPickr('unknownBorderPicker', 'unknownBorderText', 'unknownBorder', '--unknown-border');
                    setupRGBAPickr('fontColorPicker', 'fontColorText', 'fontColor', '--font-color');
                    setupRGBAPickr('translationFontColorPicker', 'translationFontColorText', 'translationFontColor', '--translation-font-color');
                    setupRGBAPickr('playingUnderlinePicker', 'playingUnderlineText', 'playingUnderline', '--is-playing-underline');
                });
            }
            
            function updateColorInputs(colorSettings) {
                document.getElementById("fontColorText").value = colorSettings.fontColor;
                document.getElementById("translationFontColorText").value = colorSettings.translationFontColor;
                document.getElementById("lingqBackgroundText").value = colorSettings.lingqBackground;
                document.getElementById("lingqBorderText").value = colorSettings.lingqBorder;
                document.getElementById("lingqBorderLearnedText").value = colorSettings.lingqBorderLearned;
                document.getElementById("unknownBackgroundText").value = colorSettings.unknownBackground;
                document.getElementById("unknownBorderText").value = colorSettings.unknownBorder;
                document.getElementById("playingUnderlineText").value = colorSettings.playingUnderline;
                
                const fontColorPicker = document.getElementById("fontColorPicker");
                if (fontColorPicker) fontColorPicker.style.backgroundColor = colorSettings.fontColor;
                
                const translationFontColorPicker = document.getElementById("translationFontColorPicker");
                if (translationFontColorPicker) translationFontColorPicker.style.backgroundColor = colorSettings.translationFontColor;
                
                const playingUnderlinePicker = document.getElementById("playingUnderlinePicker");
                if (playingUnderlinePicker) playingUnderlinePicker.style.backgroundColor = colorSettings.playingUnderline;
            }
            
            function updateColorPickerBackgrounds(colorSettings) {
                const pickerIds = [
                    {id: "lingqBackgroundPicker", color: colorSettings.lingqBackground},
                    {id: "lingqBorderPicker", color: colorSettings.lingqBorder},
                    {id: "lingqBorderLearnedPicker", color: colorSettings.lingqBorderLearned},
                    {id: "unknownBackgroundPicker", color: colorSettings.unknownBackground},
                    {id: "unknownBorderPicker", color: colorSettings.unknownBorder},
                    {id: "fontColorPicker", color: colorSettings.fontColor},
                    {id: "translationFontColorPicker", color: colorSettings.translationFontColor},
                    {id: "playingUnderlinePicker", color: colorSettings.playingUnderline}
                ];
                
                pickerIds.forEach(item => {
                    const picker = document.getElementById(item.id);
                    if (picker) {
                        picker.style.backgroundColor = item.color;
                    }
                });
            }
            
            function updateCssColorVariables(colorSettings) {
                document.documentElement.style.setProperty("--font-color", colorSettings.fontColor);
                document.documentElement.style.setProperty("--translation-font-color", colorSettings.translationFontColor);
                document.documentElement.style.setProperty("--lingq-background", colorSettings.lingqBackground);
                document.documentElement.style.setProperty("--lingq-border", colorSettings.lingqBorder);
                document.documentElement.style.setProperty("--lingq-border-learned", colorSettings.lingqBorderLearned);
                document.documentElement.style.setProperty("--unknown-background", colorSettings.unknownBackground);
                document.documentElement.style.setProperty("--unknown-border", colorSettings.unknownBorder);
                document.documentElement.style.setProperty("--is-playing-underline", colorSettings.playingUnderline);
            }
            
            function updateColorMode(event) {
                event.stopPropagation();
                
                const selectedColorMode = this.value;
                
                settings.colorMode = selectedColorMode;
                document.documentElement.style.setProperty("--background-color", selectedColorMode === "dark" ? "#2a2c2e" : "#ffffff");
                
                const colorSettings = getColorSettings(selectedColorMode);
                
                updateColorInputs(colorSettings);
                updateCssColorVariables(colorSettings);
                updateColorPickerBackgrounds(colorSettings);
            }
            
            function setupSlider(sliderId, valueId, settingKey, unit, cssVar, valueTransform) {
                const slider = document.getElementById(sliderId);
                const valueDisplay = document.getElementById(valueId);
                
                slider.addEventListener("input", function () {
                    const value = parseFloat(this.value);
                    const transformedValue = valueTransform(value);
                    
                    valueDisplay.textContent = transformedValue.toString().replace(unit, '');
                    settings[settingKey] = value;
                    document.documentElement.style.setProperty(cssVar, transformedValue);
                });
            }
            
            const settingsButton = document.getElementById('lingqAddonSettings');
            const settingsPopup = document.getElementById('lingqAddonSettingsPopup');
            settingsButton.addEventListener("click", () => {
                settingsPopup.style.display = "block";
                initializePickrs();
                
                const dragHandle = document.getElementById("lingqAddonSettingsDragHandle");
                makeDraggable(settingsPopup, dragHandle);
            });
            
            const styleTypeSelector = document.getElementById("styleTypeSelector");
            styleTypeSelector.addEventListener("change", (event) => {
                const selectedStyleType = event.target.value;
                settings.styleType = selectedStyleType;
                document.getElementById("videoSettings").style.display = selectedStyleType === "video" ? "block" : "none";
                document.getElementById("sentenceVideoSettings").style.display = selectedStyleType === "off" ? "block" : "none";
            });
            
            setupSlider("heightBigSlider", "heightBigValue", "heightBig", "px", "--height-big", (val) => `${val}px`);
            setupSlider("sentenceHeightSlider", "sentenceHeightValue", "sentenceHeight", "px", "--sentence-height", (val) => `${val}px`);
            const sentenceAutoplayCheckbox = document.getElementById("sentenceAutoplayCheckbox");
            sentenceAutoplayCheckbox.addEventListener('change', (event) => {
                settings.sentenceAutoplay = event.target.checked
            });
            setupSlider("widgetWidthSlider", "widgetWidthValue", "widgetWidth", "px", "--widget-width", (val) => `${val}px`);
            setupSlider("fontSizeSlider", "fontSizeValue", "fontSize", "rem", "--font-size", (val) => `${val}rem`);
            setupSlider("lineHeightSlider", "lineHeightValue", "lineHeight", "", "--line-height", (val) => val);
            
            document.getElementById("colorModeSelector").addEventListener("change", updateColorMode);
            
            const autoFinishingCheckbox = document.getElementById("autoFinishingCheckbox");
            autoFinishingCheckbox.addEventListener('change', (event) => {
                settings.autoFinishing = event.target.checked
            });
            
            const focusPlayingSentenceCheckbox = document.getElementById("focusPlayingSentenceCheckbox");
            focusPlayingSentenceCheckbox.addEventListener('change', (event) => {
                settings.focusPlayingSentence = event.target.checked
            });
            
            const showTranslationCheckbox = document.getElementById("showTranslationCheckbox");
            showTranslationCheckbox.addEventListener('change', (event) => {
                settings.showTranslation = event.target.checked
            });
            
            const usePageModeCheckbox = document.getElementById("usePageModeCheckbox");
            usePageModeCheckbox.addEventListener('change', (event) => {
                settings.usePageMode = event.target.checked;
            });
            
            function setupShortcutInput(inputId, settingKey) {
                const input = document.getElementById(inputId);
                if (!input) return;
                
                input.addEventListener("input", function () {
                    const allowedPattern = /^[a-z0-9`~!@#$%^&*()_+=-]*$/;
                    
                    let value = this.value.toLowerCase();
                    
                    if (!allowedPattern.test(value)) {
                        this.value = "";
                        return;
                    }
                    
                    if (value.length > 1) {
                        value = value.at(-1);
                        this.value = value;
                    }
                    
                    settings[settingKey] = value;
                });
            }
            
            const keyboardShortcutCheckbox = document.getElementById("keyboardShortcutCheckbox");
            keyboardShortcutCheckbox.addEventListener('change', (event) => {
                const checked = event.target.checked;
                document.getElementById("keyboardShortcutSection").style.display = checked ? "block" : "none";
                settings.keyboardShortcut = checked;
            });
            
            setupShortcutInput("shortcutVideoFullscreenInput", "shortcutVideoFullscreen");
            setupShortcutInput("shortcutBackward5sInput", "shortcutBackward5s");
            setupShortcutInput("shortcutForward5sInput", "shortcutForward5s");
            setupShortcutInput("shortcutTTSPlayInput", "shortcutTTSPlay");
            setupShortcutInput("shortcutTranslatorOpenInput", "shortcutTranslator");
            setupShortcutInput("shortcutMakeKnownInput", "shortcutMakeKnown");
            setupShortcutInput("shortcutDictionaryOpenInput", "shortcutDictionary");
            setupShortcutInput("shortcutCopySelectedInput", "shortcutCopySelected");
            setupShortcutInput("shortcutMeaningInput", "shortcutMeaningInput");
            setupShortcutInput("shortcutChatInput", "shortcutChatInput");
            setupShortcutInput("shortcutFlashcard", "shortcutFlashcard");
            
            const chatWidgetCheckbox = document.getElementById("chatWidgetCheckbox");
            chatWidgetCheckbox.addEventListener('change', (event) => {
                const checked = event.target.checked;
                document.getElementById("chatWidgetSection").style.display = checked ? "block" : "none";
                settings.chatWidget = checked;
            });
            
            const llmProviderModelSelector = document.getElementById("llmProviderModelSelector");
            llmProviderModelSelector.addEventListener("change", (event) => {
                settings.llmProviderModel = event.target.value
            });
            
            const llmApiKeyInput = document.getElementById("llmApiKeyInput");
            llmApiKeyInput.addEventListener("change", (event) => {
                settings.llmApiKey = event.target.value
            });
            
            const askSelectedCheckbox = document.getElementById("askSelectedCheckbox");
            askSelectedCheckbox.addEventListener('change', (event) => {
                settings.askSelected = event.target.checked
            });
            
            const prependSummaryCheckbox = document.getElementById("prependSummaryCheckbox");
            prependSummaryCheckbox.addEventListener('change', (event) => {
                settings.prependSummary = event.target.checked
            });
            
            const dbUrlInput = document.getElementById("dbUrlInput");
            dbUrlInput.addEventListener("change", (event) => {
                settings.dbUrl = event.target.value
            });
            
            const dbKeyInput = document.getElementById("dbKeyInput");
            dbKeyInput.addEventListener("change", (event) => {
                settings.dbKey = event.target.value
            });
            
            const testDBConnectionButton = document.getElementById("testDBConnectionButton");
            testDBConnectionButton.addEventListener("click", async (event) => {
                if (!settings.dbUrl || !settings.dbKey) {
                    alert("Please enter both Supabase URL and Key.");
                    return;
                }
                
                try {
                    const supabaseTest = createClient(settings.dbUrl, settings.dbKey);
                    const {data, error} = await supabaseTest.from("word_data").select("*").limit(1);
                    
                    if (error) {
                        console.error("Connection test error:", error);
                        alert("❌ Invalid Supabase credentials or unable to connect.");
                    } else {
                        supabaseClient = supabaseTest;
                        alert("✅ Supabase connection successful!");
                    }
                } catch (err) {
                    console.error("Unexpected connection test error:", err);
                    alert("❌ Connection failed. Please check URL and API key.");
                }
            })
            
            const ttsCheckbox = document.getElementById("ttsCheckbox");
            ttsCheckbox.addEventListener('change', (event) => {
                const checked = event.target.checked;
                document.getElementById("ttsSection").style.display = checked ? "block" : "none";
                settings.tts = checked;
            });
            
            const ttsAutoplayCheckbox = document.getElementById("ttsAutoplayCheckbox");
            ttsAutoplayCheckbox.addEventListener('change', (event) => {
                settings.ttsAutoplay = event.target.checked
            });
            
            const ttsApiKeyInput = document.getElementById("ttsApiKeyInput");
            ttsApiKeyInput.addEventListener("change", (event) => {
                settings.ttsApiKey = event.target.value
            });
            
            const ttsVoiceSelector = document.getElementById("ttsVoiceSelector");
            ttsVoiceSelector.addEventListener("change", (event) => {
                const voices = typeof settings.ttsVoice === "object" ? { ...settings.ttsVoice } : {};
                voices[getLessonLanguage()] = event.target.value;
                settings.ttsVoice = voices;
            });
            
            const ttsProviderSelector = document.getElementById("ttsProviderSelector");
            ttsProviderSelector.addEventListener("change", (event) => {
                settings.ttsProvider = event.target.value
                ttsVoiceSelector.innerHTML = "";
                voiceOptionsObject[settings.ttsProvider].forEach(option => {
                    ttsVoiceSelector.appendChild(createElement("option", {
                        value: option.value,
                        textContent: option.text
                    }));
                });
            });
            
            const ttsWordCheckbox = document.getElementById("ttsWordCheckbox");
            ttsWordCheckbox.addEventListener('change', (event) => {
                settings.ttsWord = event.target.checked
            });
            
            const ttsSentenceCheckbox = document.getElementById("ttsSentenceCheckbox");
            ttsSentenceCheckbox.addEventListener('change', (event) => {
                settings.ttsSentence = event.target.checked
            });
            
            function resetSettings() {
                if (!confirm("Reset all settings to default?")) return;
                
                const currentColorMode = document.getElementById("colorModeSelector").value;
                const defaultColorSettings = getColorSettings(currentColorMode);
                
                document.getElementById("styleTypeSelector").value = defaults.styleType;
                document.getElementById("heightBigSlider").value = defaults.heightBig;
                document.getElementById("heightBigValue").textContent = defaults.heightBig;
                document.getElementById("sentenceHeightSlider").value = defaults.sentenceHeight;
                document.getElementById("sentenceHeightValue").textContent = defaults.sentenceHeight;
                document.getElementById("widgetWidthSlider").value = defaults.widgetWidth;
                document.getElementById("widgetWidthValue").value = defaults.widgetWidth;
                document.getElementById("fontSizeSlider").value = defaults.fontSize;
                document.getElementById("fontSizeValue").textContent = defaults.fontSize;
                document.getElementById("lineHeightSlider").value = defaults.lineHeight;
                document.getElementById("lineHeightValue").textContent = defaults.lineHeight;
                
                updateColorInputs(defaultColorSettings);
                updateColorPickerBackgrounds(defaultColorSettings);
                
                document.getElementById("videoSettings").style.display = defaults.styleType === "video" ? "block" : "none";
                document.getElementById("sentenceVideoSettings").style.display = defaults.styleType === "off" ? "block" : "none";
                
                document.documentElement.style.setProperty("--font-size", `${defaults.fontSize}rem`);
                document.documentElement.style.setProperty("--line-height", defaults.lineHeight);
                document.documentElement.style.setProperty("--height-big", `${defaults.heightBig}px`);
                document.documentElement.style.setProperty("--sentence-height", `${defaults.sentenceHeight}px`);
                document.getElementById("sentenceAutoplayCheckbox").checked = defaults.sentenceAutoplay;
                document.documentElement.style.setProperty("--widget-width", `${defaults.widgetWidth}px`);
                updateCssColorVariables(defaultColorSettings);
                
                document.getElementById("autoFinishingCheckbox").checked = defaults.autoFinishing;
                document.getElementById("focusPlayingSentenceCheckbox").checked = defaults.focusPlayingSentence;
                document.getElementById("showTranslationCheckbox").checked = defaults.showTranslation;
                document.getElementById("usePageModeCheckbox").checked = defaults.usePageMode;
                
                document.getElementById("keyboardShortcutCheckbox").value = defaults.keyboardShortcut;
                document.getElementById("shortcutVideoFullscreenInput").value = defaults.shortcutVideoFullscreen;
                document.getElementById("shortcutBackward5sInput").value = defaults.shortcutBackward5s;
                document.getElementById("shortcutForward5sInput").value = defaults.shortcutForward5s;
                document.getElementById("shortcutTTSPlayInput").value = defaults.shortcutTTSPlay;
                document.getElementById("shortcutTranslatorOpenInput").value = defaults.shortcutTranslator;
                document.getElementById("shortcutMakeKnownInput").value = defaults.shortcutMakeKnown;
                document.getElementById("shortcutDictionaryOpenInput").value = defaults.shortcutDictionary;
                document.getElementById("shortcutCopySelectedInput").value = defaults.shortcutCopySelected;
                document.getElementById("shortcutMeaningInput").value = defaults.shortcutMeaningInput;
                document.getElementById("shortcutChatInput").value = defaults.shortcutChatInput;
                document.getElementById("shortcutFlashcard").value = defaults.shortcutFlashcard;
                
                document.getElementById("chatWidgetCheckbox").value = defaults.chatWidget;
                document.getElementById("llmProviderModelSelector").value = defaults.llmProviderModel;
                document.getElementById("llmApiKeyInput").value = defaults.llmApiKey;
                document.getElementById("askSelectedCheckbox").value = defaults.askSelected;
                document.getElementById("prependSummaryCheckbox").value = defaults.prependSummary;
                
                document.getElementById("ttsCheckbox").value = defaults.tts;
                document.getElementById("ttsAutoplayCheckbox").value = defaults.ttsAutoplay;
                document.getElementById("ttsApiKeyInput").value = defaults.ttsApiKey;
                document.getElementById("ttsProviderSelector").value = defaults.ttsProvider;
                document.getElementById("ttsVoiceSelector").value = defaults.ttsVoice;
                document.getElementById("ttsWordCheckbox").value = defaults.ttsWord;
                document.getElementById("ttsSentenceCheckbox").value = defaults.ttsSentence;
                
                for (const [key, value] of Object.entries(defaults)) {
                    settings[key] = value
                }
            }
            
            document.getElementById("resetSettingsBtn").addEventListener("click", resetSettings);
            
            document.getElementById("closeSettingsBtn").addEventListener("click", () => {
                settingsPopup.style.display = "none"
            });
        }
        
        async function setupDownloadWordsEventListeners() {
            async function getAllWords(baseUrl, pageSize, apiType, additionalParams = "", progressCallback = () => {
            }) {
                let allResults = [];
                let nextUrl = `${baseUrl}?page_size=${pageSize}&page=1${additionalParams}`;
                let currentPage = 0;
                let totalPages = 0;
                let isFirstCall = true;
                
                while (nextUrl) {
                    try {
                        const response = await fetch(nextUrl);
                        
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        
                        const data = await response.json();
                        currentPage++;
                        
                        if (isFirstCall) {
                            isFirstCall = false;
                            totalPages = Math.ceil(data.count / pageSize);
                            console.log(`total pages: ${totalPages}`);
                        }
                        
                        progressCallback(currentPage, totalPages, false, null, data.count);
                        
                        if (apiType === 'lingq') {
                            const filteredResults = data.results.map(item => ({
                                pk: item.pk,
                                term: item.term,
                                fragment: item.fragment,
                                status: item.status,
                                hint: item.hints && item.hints[0] ? item.hints[0].text : null
                            }));
                            allResults = allResults.concat(filteredResults);
                        } else if (apiType === 'known') {
                            allResults = allResults.concat(data.results);
                        }
                        
                        nextUrl = data.next;
                        
                        if (nextUrl) {
                            console.log("Fetched page. Next URL:", nextUrl);
                        } else {
                            console.log("Finished fetching all pages");
                            progressCallback(currentPage, totalPages, true, null, data.count);
                        }
                    } catch (error) {
                        console.error('Error fetching data:', error);
                        progressCallback(currentPage, totalPages, true, error, 0);
                        break;
                    }
                }
                
                return allResults;
            }
            
            async function downloadWords(baseUrl, pageSize, fileName, apiType, additionalParams = "") {
                const progressContainer = document.getElementById("downloadProgressContainer");
                const progressBar = document.getElementById("downloadProgressBar");
                const progressText = document.getElementById("downloadProgressText");
                
                if (progressContainer && progressBar && progressText) {
                    progressBar.value = 0;
                    progressBar.max = 100;
                    progressText.textContent = "Initializing download...";
                    progressContainer.style.display = "block";
                }
                
                const progressCallback = (currentPage, totalPages, _isDone, error_isErrorEncountered, totalCount) => {
                    if (progressBar && progressText) {
                        if (error_isErrorEncountered) {
                            progressText.textContent = `Error fetching page ${currentPage}: ${error_isErrorEncountered.message}`;
                            progressBar.style.backgroundColor = 'red';
                            return;
                        }
                        
                        progressBar.max = totalPages;
                        progressBar.value = currentPage;
                        progressText.textContent = `Fetching data... Page ${currentPage} of ${totalPages} (Total items: ${totalCount || 'N/A'})`;
                        
                        if (_isDone) {
                            progressText.textContent = error_isErrorEncountered ? `Export failed: ${error_isErrorEncountered.message}` : `${totalCount} items exported`;
                        }
                    }
                };
                
                try {
                    const allWords = await getAllWords(baseUrl, pageSize, apiType, additionalParams, progressCallback);
                    
                    if (!allWords || allWords.length === 0) {
                        console.warn("No words found or an error occurred.");
                        return;
                    }
                    
                    let blob;
                    const fileType = fileName.split(".")[1];
                    
                    if (fileType === 'json') {
                        const dataString = JSON.stringify(allWords, null, 2);
                        blob = new Blob([dataString], {type: 'application/json'});
                    } else if (fileType === 'csv') {
                        const headers = Object.keys(allWords[0]).join(',');
                        const rows = allWords.map(item => {
                            return Object.values(item).map(value => {
                                if (typeof value === 'string') {
                                    return `"${value.replace(/"/g, '""')}"`;
                                }
                                return value;
                            }).join(',');
                        }).join('\n');
                        
                        const dataString = headers + '\n' + rows;
                        blob = new Blob([dataString], {type: 'text/csv'});
                    }
                    
                    downloadBlob(blob, fileName);
                    console.log("Export completed.");
                } catch (error) {
                    console.error('Error:', error);
                }
            }
            
            function downloadBlob(blob, fileName) {
                const url = URL.createObjectURL(blob);
                const a = createElement("a", {href: url, download: fileName});
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
            
            const downloadWordsButton = document.getElementById('lingqDownloadWords');
            const downloadWordsPopup = document.getElementById('lingqDownloadWordsPopup');
            
            downloadWordsButton.addEventListener("click", () => {
                downloadWordsPopup.style.display = "block";
                
                const progressContainer = document.getElementById("downloadProgressContainer");
                if (progressContainer) progressContainer.style.display = "none";
                
                const dragHandle = document.getElementById("lingqDownloadWordsDragHandle");
                if (dragHandle) {
                    makeDraggable(downloadWordsPopup, dragHandle);
                }
            });
            
            const languageCode = await getLanguageCode();
            const pageSize = 1000;
            
            const setButtonsDisabled = (disabled) => {
                const buttons = downloadWordsPopup.querySelectorAll('.popup-button');
                buttons.forEach(button => {
                    button.disabled = disabled;
                });
            };
            
            const handleDownloadButtonClick = async (url, filename, type, params = '') => {
                setButtonsDisabled(true);
                try {
                    await downloadWords(url, pageSize, filename, type, params);
                } finally {
                    setButtonsDisabled(false);
                }
            };
            
            document.getElementById("downloadUnknownLingqsBtn").addEventListener("click", async () => {
                await handleDownloadButtonClick(`https://www.lingq.com/api/v3/${languageCode}/cards/`, "unknown_lingqs.csv", 'lingq', '&status=0&status=1&status=2&status=3');
            });
            
            document.getElementById("downloadUnknownLingqWordsBtn").addEventListener("click", async () => {
                await handleDownloadButtonClick(`https://www.lingq.com/api/v3/${languageCode}/cards/`, "unknown_lingq_words.csv", 'lingq', '&status=0&status=1&status=2&status=3&phrases=false');
            });
            
            document.getElementById("downloadUnknownLingqPhrasesBtn").addEventListener("click", async () => {
                await handleDownloadButtonClick(`https://www.lingq.com/api/v3/${languageCode}/cards/`, "unknown_lingq_phrases.csv", 'lingq', '&status=0&status=1&status=2&status=3&phrases=True');
            });
            
            document.getElementById("downloadKnownLingqsBtn").addEventListener("click", async () => {
                await handleDownloadButtonClick(`https://www.lingq.com/api/v3/${languageCode}/cards/`, "known_lingqs.csv", 'lingq', '&status=4');
            });
            
            document.getElementById("downloadKnownWordsBtn").addEventListener("click", async () => {
                await handleDownloadButtonClick(`https://www.lingq.com/api/v2/${languageCode}/known-words/`, "known_words.csv", "known");
            });
            
            document.getElementById("closeDownloadWordsBtn").addEventListener("click", () => {
                downloadWordsPopup.style.display = "none";
            });
        }
        
        function setupTTSPlaygroundEventListeners() {
            const ttsPlaygroundButton = document.getElementById('ttsPlayground');
            const ttsPlaygroundPopup = document.getElementById('ttsPlaygroundPopup');
            
            ttsPlaygroundButton.addEventListener("click", () => {
                ttsPlaygroundPopup.style.display = "block";
                
                const dragHandle = document.getElementById("ttsPlaygroundDragHandle");
                if (dragHandle) {
                    makeDraggable(ttsPlaygroundPopup, dragHandle);
                }
            });
            
            const ttsPlayer = document.getElementById('ttsPlayer');
            const ttsGenerationButton = document.getElementById('ttsGenerationButton');
            ttsGenerationButton.addEventListener("click", async () => {
                const ttsInstructionsText = document.getElementById("ttsInstructionsInput").value;
                const ttsTextareaText = document.getElementById("ttsTextarea").value.replaceAll('\n', ' ');
                
                ttsPlayer.style.display = "none";
                ttsGenerationButton.disabled = true;
                const audioData = await getTTSResponse(settings.ttsProvider, settings.ttsApiKey, (settings.ttsVoice[getLessonLanguage()] ?? "random"), ttsTextareaText, ttsInstructionsText);
                const audioURL = URL.createObjectURL(new Blob([audioData], {type: 'audio/mp3'}))
                ttsGenerationButton.disabled = false;
                
                ttsPlayer.src = audioURL;
                ttsPlayer.play();
                
                ttsPlayer.style.display = "block";
            });
            
            document.getElementById("closeTTSPlaygroundBtn").addEventListener("click", () => {
                ttsPlaygroundPopup.style.display = "none";
            });
        }
        
        function setupFlashcardPopupEventListeners() {
            function drawPagination(page, total) {
                const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1;
                
                const prevBtn = document.getElementById("flashcardPaginationPrev");
                const nextBtn = document.getElementById("flashcardPaginationNext");
                const pageInfo = document.getElementById("flashcardPageInfo");
                
                const noData = total === 0;
                prevBtn.disabled = noData || page <= 1;
                nextBtn.disabled = noData || page >= totalPages;
                
                if (noData) {
                    pageInfo.textContent = "0/0";
                } else {
                    pageInfo.textContent = `${Math.min(page, totalPages)}/${totalPages}`;
                }
                
                prevBtn.onclick = null;
                nextBtn.onclick = null;
                if (!noData && totalPages > 1) {
                    prevBtn.onclick = () => {
                        if (page > 1) {
                            currentPage--;
                            loadFlashcardPage(currentPage);
                        }
                    };
                    nextBtn.onclick = () => {
                        if (page < totalPages) {
                            currentPage++;
                            loadFlashcardPage(currentPage);
                        }
                    };
                }
            }
            
            async function loadFlashcardPage(page) {
                const from = (page - 1) * pageSize;
                const to = from + pageSize - 1;
                
                let queryBase = supabaseClient
                    .from("word_data")
                    .select("idx, word, meaning, explanation", { count: "exact" })
                    .eq("flashcard", true)
                    .eq("language", language);
                
                if (searchKeyword) queryBase = queryBase.or(`word.ilike.%${searchKeyword}%,meaning.ilike.%${searchKeyword}%`);
                
                const { data, error, count } = await queryBase
                    .order(currentSortField, { ascending: currentSortOrder === "asc" })
                    .range(from, to);
                
                if (error) {
                    console.error("Flashcard fetch error:", error);
                    return;
                }
                
                filteredCount = count || 0;
                flashcardTableBody.innerHTML = "";
                data.forEach(row => {
                    const deleteBtn = createElement("button", {
                        className: "delete-row-btn",
                        innerHTML: `<svg viewBox="6 6 12 12" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"><path d="M17 17L7 7.00002M17 7L7.00001 17" stroke-width="2" stroke-linecap="round"/></svg>`
                    });
                    const deleteTd = createElement("td", {}, deleteBtn);
                    
                    const meaningTd = createElement("td", { textContent: row.meaning || "", title: row.meaning || "", style: "cursor: pointer;" });
                    
                    const tableRow = createElement("tr", {},
                        deleteTd,
                        createElement("td", { textContent: row.word || "", title: row.word || "" }),
                        meaningTd,
                        createElement("td", { textContent: row.explanation || "", title: row.explanation || "" })
                    );
                    
                    deleteBtn.addEventListener("click", async (ev) => {
                        ev.stopPropagation();
                        
                        deleteBtn.disabled = true;
                        const { error: updateError } = await supabaseClient
                            .from("word_data")
                            .update({ flashcard: false })
                            .eq("idx", row.idx);
                        
                        if (updateError) {
                            console.error("Flashcard delete error:", updateError);
                            deleteBtn.disabled = false;
                        } else {
                            tableRow.remove();
                            totalCount--;
                            filteredCount--;
                            countLabel.textContent = `Flashcards: ${totalCount}`;
                            
                            if (flashcardTableBody.children.length === 0 && currentPage > 1) {
                                currentPage--;
                                loadFlashcardPage(currentPage);
                            } else {
                                drawPagination(currentPage, filteredCount);
                            }
                        }
                    });
                    
                    meaningTd.addEventListener("click", () => {
                        if (meaningTd.querySelector("input")) return;
                        
                        const currentText = meaningTd.textContent;
                        const input = createElement("input", {
                            type: "text",
                            value: currentText,
                            style: "width: 100%; border: none; outline: none;",
                        });
                        
                        const saveMeaning = async () => {
                            const newValue = input.value.trim();
                            
                            if (newValue === currentText) {
                                meaningTd.textContent = currentText;
                                return;
                            }
                            
                            const { error: updateError } = await supabaseClient
                                .from("word_data")
                                .update({ meaning: newValue })
                                .eq("idx", row.idx);
                            
                            if (updateError) {
                                console.error("Meaning update error:", updateError);
                                meaningTd.textContent = currentText;
                            } else {
                                meaningTd.textContent = newValue;
                                row.meaning = newValue;
                            }
                        };
                        
                        meaningTd.textContent = "";
                        meaningTd.appendChild(input);
                        input.focus();
                        
                        input.addEventListener("blur", () => saveMeaning());
                        
                        input.addEventListener("keydown", (e) => {
                            if (e.key === "Enter") {
                                input.blur();
                            }
                        });
                    });
                    
                    flashcardTableBody.appendChild(tableRow);
                });
                
                drawPagination(page, filteredCount);
                
                if (!totalCount) {
                    supabaseClient
                        .from("word_data")
                        .select("*", { count: "exact", head: true })
                        .eq("flashcard", true)
                        .eq("language", language)
                        .then(({ count }) => {
                            totalCount = count || 0;
                            countLabel.textContent = `Flashcards: ${totalCount}`;
                        });
                }
            }
            
            const flashcardButton = document.getElementById("flashcardManagerButton");
            const flashcardPopup = document.getElementById("flashcardPopup");
            const flashcardTableBody = flashcardPopup.querySelector("tbody");
            const countLabel = document.getElementById("flashcardCount");
            
            let currentPage = 1;
            const pageSize = 15;
            let totalCount = 0;
            let filteredCount = 0;
            const language = getLessonLanguage();
            
            flashcardButton.addEventListener("click", async () => {
                flashcardPopup.style.display = "block";
                makeDraggable(flashcardPopup, document.getElementById("flashcardDragHandle"));
                loadFlashcardPage(currentPage);
            });
            
            document.getElementById("closeFlashcardPopupBtn").addEventListener("click", () => {
                flashcardPopup.style.display = "none";
            });
            
            let currentSortField = "idx";
            let currentSortOrder = "desc";
            let searchKeyword = "";
            
            const searchInput = document.getElementById("flashcardSearchInput");
            const debouncedSearch = debounce(() => {
                currentPage = 1;
                searchKeyword = searchInput.value.trim();
                loadFlashcardPage(currentPage);
            }, 400);
            searchInput.addEventListener("input", debouncedSearch);
            
            const tableHeaders = document.querySelectorAll("#flashcardTable thead th");
            tableHeaders.forEach(th => {
                th.addEventListener("click", () => {
                    const fieldMap = { Word: "word", Meaning: "meaning", Explanation: "explanation" };
                    const field = fieldMap[th.textContent.replace(/[▲▼]/g, "").trim()];
                    if (!field) return;
                    
                    if (currentSortField !== field) {
                        currentSortField = field;
                        currentSortOrder = "asc";
                    } else if (currentSortOrder === "asc") {
                        currentSortOrder = "desc";
                    } else {
                        currentSortField = "idx";
                        currentSortOrder = "desc";
                    }
                    
                    tableHeaders.forEach(header => {
                        header.textContent = header.textContent.replace(/[▲▼]/g, "").trim();
                    });
                    
                    if (["word", "meaning", "explanation"].includes(currentSortField)) {
                        const arrow = currentSortOrder === "asc" ? " ▲" : " ▼";
                        th.textContent = th.textContent + arrow;
                    }
                    
                    loadFlashcardPage(1);
                });
            });
            
            document.getElementById("flashcardCsvDownload").addEventListener("click", async () => {
                function formatContext(context, originalWord, padding = 100) {
                    if (!context || !originalWord) return "";
                    
                    const escapedWord = originalWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const match = context.match(new RegExp(escapedWord, 'i'));
                    
                    if (!match) return context;
                    
                    const foundWord = match[0];
                    const wordStart = match.index;
                    const wordEnd = wordStart + foundWord.length;
                    const totalLen = context.length;
                    
                    let start = wordStart - padding;
                    let end = wordEnd + padding;
                    
                    if (start < 0) {
                        end += Math.abs(start);
                        start = 0;
                    }
                    
                    if (end > totalLen) {
                        start -= (end - totalLen);
                        if (start < 0) start = 0;
                        end = totalLen;
                    }
                    
                    const slicedText = context.substring(start, end);
                    
                    const relativeStart = wordStart - start;
                    const relativeEnd = relativeStart + foundWord.length;
                    
                    const before = slicedText.substring(0, relativeStart);
                    const target = slicedText.substring(relativeStart, relativeEnd);
                    const after = slicedText.substring(relativeEnd);
                    
                    const prefix = start > 0 ? "..." : "";
                    const suffix = end < totalLen ? "..." : "";
                    
                    return `${prefix}${before}<b>${target}</b>${after}${suffix}`;
                }
                
                const { data, error } = await supabaseClient
                    .from("word_data")
                    .select("*")
                    .eq("flashcard", true)
                    .eq("language", language)
                    .order("idx", { ascending: true });
                
                if (error) {
                    console.error("CSV export error:", error);
                    return;
                }
                
                const processedData = data.map(row => {
                    return {
                        ...row,
                        formatted_context: formatContext(row.context, row.original_word)
                    };
                });
                
                const headers = Object.keys(processedData[0] || {});
                const rows = processedData.map(row =>
                    Object.values(row).map(v =>
                        typeof v === "string" ? `"${v.replace(/"/g, '""')}"` : v
                    ).join(",")
                );
                
                const csv = [headers.join(","), ...rows].join("\n");
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const link = createElement("a", {
                    href: URL.createObjectURL(blob),
                    download: `flashcards_${language}.csv`
                });
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
        
        function generatePopupCSS() {
            return `
                :root {
                    --font-color: ${colorSettings.fontColor};
                    --background-color: ${settings.colorMode === "dark" ? "#2a2c2e" : "#ffffff"}
                }

                /*Color picker*/

                .color-picker {
                    width: 30px;
                    height: 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    border: 1px solid rgba(125, 125, 125, 30%);
                }

                .pcr-app {
                    z-index: 10001 !important;
                }

                .pcr-app .pcr-interaction .pcr-result {
                    color: var(--font-color) !important;
                }

                /*Popup settings*/

                #lingqAddonSettings {
                    color: var(--font-color);
                }

                .popup {
                    position: fixed;
                    top: 40%;
                    left: 40%;
                    transform: translate(-40%, -40%);
                    background-color: var(--background-color, #2a2c2e);
                    color: var(--font-color, #e0e0e0);
                    border: 1px solid rgb(125 125 125 / 30%);
                    border-radius: 8px;
                    box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.2);
                    z-index: 10000;
                    display: none;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .popup-drag-handle {
                    cursor: move;
                    background-color: rgba(128, 128, 128, 0.2);
                    padding: 8px;
                    border-radius: 8px 8px 0 0;
                    text-align: center;
                    user-select: none;
                }

                .popup-row {
                    margin: 5px 0;
                }

                .nav-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1.2rem;
                    padding: 5px;
                }

                .popup-button {
                    padding: 5px 10px;
                    border: 1px solid rgb(125, 125, 125, 50%);
                    border-radius: 5px;
                    margin: 5px 0;
                }

                .popup-button:disabled {
                    opacity: 0.5;
                    pointer-events: none;
                }

                .popup-section {
                    border: 1px solid rgb(125 125 125 / 50%);
                    padding: 5px 10px;
                    border-radius: 5px;
                    margin: 10px 0;
                }

                .popup-input {
                    flex-grow: 1;
                    border: 1px solid rgb(125 125 125 / 50%);
                    border-radius: 5px;
                }

                #downloadProgressContainer {
                    display: none;
                }

                #downloadProgressText {
                    text-align: center;
                    margin-bottom: 5px;
                    font-size: 0.9em;
                }

                #downloadProgressBar {
                    width: 100%;
                    height: 20px;
                }

                progress[value]::-webkit-progress-bar {
                    border-radius: 5px;
                }

                progress[value]::-webkit-progress-value {
                    border-radius: 5px;
                }

                select {
                    width: 100%;
                    margin-top: 5px;
                    padding: 5px;
                    background: rgb(125 125 125 / 10%) !important;
                }

                option {
                    background: var(--background-color) !important;
                }
                
                #flashcardPopupHeader {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 15px;
                    margin: 10px 0;
                    height: 45px;
                }
                
                #flashcardSearchInput {
                    width: 300px;
                    margin-left: auto;
                    border: 1px solid #444 !important;
                    padding: 3px 8px !important;
                    border-radius: 4px !important;
                }
                
                #flashcardPagination {
                    display: flex;
                    align-items: center;
                }
                
                #flashcardTableContainer {
                    height: 435px;
                    overflow-y: auto;
                }
                
                #flashcardTable {
                    table-layout: fixed;
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0 5px;
                    padding: 0 5px;
                }
                
                #flashcardTable thead {
                    position: sticky;
                    top: 0;
                    background: var(--background-color);
                }
                
                #flashcardTable thead th {
                    cursor: pointer;
                    user-select: none;
                }
                
                #flashcardTable td {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 0.9em;
                }
                
                #flashcardTable td + td {
                    padding-left: 10px;
                }
                
                #flashcardTable th:nth-child(1),
                #flashcardTable td:nth-child(1) {
                    width: 20px;
                }
                
                #flashcardTable th:nth-child(2),
                #flashcardTable td:nth-child(2) {
                    width: 20%;
                }
                
                #flashcardTable th:nth-child(3),
                #flashcardTable td:nth-child(3) {
                    width: 20%;
                }
                
                #flashcardTable th:nth-child(4),
                #flashcardTable td:nth-child(4) {
                    width: 60%;
                }
                
                #flashcardTable .delete-row-btn {
                    width: 10px;
                    height: 10px;
                }
                
                #flashcardPopupButtons {
                    display: flex; justify-content: flex-end; margin: 10px 0;
                }
            `;
        }
        
        const colorSettings = getColorSettings(settings.colorMode);
        
        const settingsButton = createElement("button", {
            id: "lingqAddonSettings",
            textContent: "⚙️",
            title: "LingQ Addon Settings",
            className: "nav-button"
        });
        
        const downloadWordsButton = createElement("button", {
            id: "lingqDownloadWords",
            textContent: "💾",
            title: "Download Words",
            className: "nav-button"
        });
        
        const ttsPlaygroundButton = createElement("button", {
            id: "ttsPlayground",
            textContent: "🗣️",
            title: "TTS Playground",
            className: "nav-button"
        });
        
        const flashcardManagerButton = createElement("button", {
            id: "flashcardManagerButton",
            textContent: "📝",
            title: "Flashcard Manager",
            className: "nav-button"
        });
        
        addElementToNavBar(settingsButton);
        addElementToNavBar(downloadWordsButton);
        addElementToNavBar(ttsPlaygroundButton);
        addElementToNavBar(flashcardManagerButton);
        
        const settingsPopup = createSettingsPopup();
        document.body.appendChild(settingsPopup);
        
        const downloadWordsPopup = createDownloadWordsPopup();
        document.body.appendChild(downloadWordsPopup);
        
        const ttsPopup = createTTSPlaygroundPopup();
        document.body.appendChild(ttsPopup);
        
        const flashcardPopup = createFlashcardPopup();
        document.body.appendChild(flashcardPopup);
        
        const popupCSS = generatePopupCSS();
        applyCSS(popupCSS);
        setupSettingEventListeners();
        setupDownloadWordsEventListeners();
        setupTTSPlaygroundEventListeners();
        setupFlashcardPopupEventListeners();
    }
    
    function setupReader() {
        function setupLessonCompletion() {
            document.getElementById("lingqLessonComplete").addEventListener("click", finishLesson);
        }
        
        function getColorSettings(colorMode) {
            const prefix = colorMode === "dark" ? "dark_" : "white_";
            
            return {
                fontColor: settings[prefix + "fontColor"],
                translationFontColor: settings[prefix + "translationFontColor"],
                lingqBackground: settings[prefix + "lingqBackground"],
                lingqBorder: settings[prefix + "lingqBorder"],
                lingqBorderLearned: settings[prefix + "lingqBorderLearned"],
                unknownBackground: settings[prefix + "unknownBackground"],
                unknownBorder: settings[prefix + "unknownBorder"],
                playingUnderline: settings[prefix + "playingUnderline"],
            };
        }
        
        function applyStyles() {
            const colorSettings = getColorSettings(settings.colorMode);
            
            let baseCSS = generateBaseCSS(colorSettings);
            let layoutCSS = generateLayoutCSS();
            let specificCSS = "";
            
            switch (settings.colorMode) {
                case "white":
                    clickElement(".reader-themes-component > button:nth-child(1)");
                    break;
                case "dark":
                    clickElement(".reader-themes-component > button:nth-child(5)");
                    break;
            }
            
            switch (settings.styleType) {
                case "video":
                    specificCSS = generateVideoCSS();
                    break;
                case "video2":
                    specificCSS = generateVideo2CSS();
                    break;
                case "audio":
                    specificCSS = generateAudioCSS();
                    break;
                case "off":
                    specificCSS = generateOffModeCSS();
                    layoutCSS = '';
                    break;
            }
            
            baseCSS += layoutCSS;
            baseCSS += specificCSS;
            
            if (styleElement) styleElement.remove();
            styleElement = createElement("style", {textContent: baseCSS});
            document.querySelector("head").appendChild(styleElement);
        }
        
        function setupStyleEventListeners() {
            const styleTypeSelector = document.getElementById("styleTypeSelector");
            styleTypeSelector.addEventListener("change", (event) => {
                const selectedStyleType = event.target.value;
                applyStyles(selectedStyleType, document.getElementById("colorModeSelector").value);
            });
            
            const usePageModeCheckbox = document.getElementById("usePageModeCheckbox");
            if (usePageModeCheckbox) {
                usePageModeCheckbox.addEventListener('change', () => {
                    applyStyles();
                });
            }
        }
        
        function createReaderUI() {
            const completeLessonButton = createElement("button", {
                id: "lingqLessonComplete",
                textContent: "✔",
                title: "Complete Lesson Button",
                className: "nav-button",
            });
            
            addElementToNavBar(completeLessonButton);
        }
        
        
        
        function generateBaseCSS(colorSettings) {
            return `
                :root {
                    --font-size: ${settings.fontSize}rem;
                    --line-height: ${settings.lineHeight};

                    --font-color: ${colorSettings.fontColor};
                    --lingq-background: ${colorSettings.lingqBackground};
                    --lingq-border: ${colorSettings.lingqBorder};
                    --lingq-border-learned: ${colorSettings.lingqBorderLearned};
                    --unknown-background: ${colorSettings.unknownBackground};
                    --unknown-border: ${colorSettings.unknownBorder};
                    --is-playing-underline: ${colorSettings.playingUnderline};

                    --background-color: ${settings.colorMode === "dark" ? "#2a2c2e" : "#ffffff"}
                }

                /*font settings*/

                .reader-container p span.sentence-item,
                .reader-container p .sentence {
                    color: var(--font-color) !important;
                }

                .sentence.is-playing,
                .sentence.is-playing span {
                    text-underline-offset: .2em !important;
                    text-decoration-color: var(--is-playing-underline) !important;
                }

                /*highlightings*/

                .phrase-item {
                    padding: 0 !important;
                }

                .phrase-item:not(.phrase-item-status--4, .phrase-item-status--4x2) {
                    background-color: var(--lingq-background) !important;
                }

                .phrase-item.phrase-item-status--4,
                .phrase-item.phrase-item-status--4x2 {
                    background-color: rgba(0, 0, 0, 0) !important;
                }

                .phrase-cluster:not(:has(.phrase-item-status--4, .phrase-item-status--4x2)) {
                    border-radius: .25rem;
                }

                .phrase-cluster:has(.phrase-item-status--4, .phrase-item-status--4x2) {
                    border-radius: .25rem;
                }

                .reader-container .sentence .lingq-word:not(.is-learned) {
                    background-color: var(--lingq-background) !important;
                }

                .reader-container .sentence .lingq-word.is-learned {
                }

                .reader-container .sentence .blue-word {
                    background-color: var(--unknown-background) !important;;
                }

                .phrase-cluster:hover,
                .phrase-created:hover {
                    padding: 0 !important;
                }

                .phrase-cluster:hover .phrase-item,
                .phrase-created .phrase-item {
                    padding: 0 !important;
                }

                .reader-container .sentence .selected-text {
                    padding: 0 !important;
                }

                /*Chat*/

                #chat-container {
                    margin-bottom:5px;
                    border: 1px solid rgb(125 125 125 / 35%);
                    border-radius: 5px;
                    min-height: 100px;
                    max-height: 300px;
                    overflow-y: auto;
                    resize: vertical;
                    padding: 5px !important;
                    scrollbar-width: none !important;
                }

                .input-container {
                    display: flex;
                    margin-bottom: 10px;
                    border: 1px solid rgb(125 125 125 / 35%);
                    border-radius: 5px;
                }

                #user-input {
                    flex-grow: 1;
                    padding: 5px 10px;
                    font-size: 0.9rem;
                    background: none !important;
                    outline: none;
                }

                #user-input::placeholder {
                    color: rgb(125 125 125) !important;
                }

                #send-button {
                    opacity: 0.5;
                    padding: 5px 10px;
                }

                #send-button:disabled {
                    opacity: 0.3;
                    pointer-events: none;
                }

                #send-button:hover {
                    background-color: rgba(125, 125, 125, 50%);
                }

                .chat-message {
                    padding: 5px;
                    margin-bottom: 5px;
                    border-radius: 8px;
                    color: var(--font-color);
                    font-size: 0.9rem;
                    line-height: 1.2;
                }

                .user-message {
                    background-color: rgb(125 125 125 / 5%);
                }

                .bot-message {
                    background-color: rgb(125 125 125 / 15%);
                }

                #chat-container .word-message b:nth-of-type(1) {
                    position: relative;
                    font-size: 1.05rem;
                    font-weight: 600;
                }
                
                #chat-container :is(.word-message, .sentence-message) b:nth-of-type(1):hover {
                    color: ${settings.colorMode === "dark" ? "white" : "black"};
                    cursor: pointer;
                }
                
                #chat-container .word-message p:nth-of-type(1):hover {
                    color: ${settings.colorMode === "dark" ? "white" : "black"};
                    cursor: pointer;
                }
                
                #chat-container .word-message ul:nth-last-of-type(1):hover {
                    color: ${settings.colorMode === "dark" ? "white" : "black"};
                    cursor: pointer;
                }
                
                #flashcard-popup {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    position: absolute;
                    padding: 4px 8px;
                    border-radius: 6px;
                    z-index: 20;
                    background-color: var(--background-color, #2a2c2e);
                    color: var(--font-color, #e0e0e0);
                    border: 1px solid rgb(125 125 125 / 50%);
                }
                
                .word-message b:has(.flashcard-count-badge) {
                    margin-right: 5px;
                }
                
                .flashcard-count-badge {
                    position: absolute;
                    top: 1px;
                    right: -5px;
                    color: var(--font-color, #e0e0e0);
                    font-size: 10px;
                    border-radius: 3px;
                    line-height: 1;
                }
                
                .flashcard-row {
                    display:flex;
                    align-items:center;
                    gap:5px;
                }
                
                .popup-delete-button {
                    width: 10px;
                    height: 10px;
                    margin-right: 5px;
                }
                
                .meaning-edit-input {
                    width: 100%;
                    border: none;
                    outline: none;
                    padding: 3px;
                }

                #chat-container li {
                    list-style: inside !important;
                }

                #chat-container ui {
                    margin-top: 0.5rem;
                }

                #chat-container hr {
                    margin: 0.3rem 0 0.4rem;
                    border: 0;
                    height: 1px;
                    background-color: rgb(125 125 125 / 50%);
                }

                .message-button-container {
                    display: flex;
                    gap: 5px;
                    margin-top: 5px;
                }

                .message-button {
                    padding: 3px;
                    border-radius: 3px;
                }

                .message-button:disabled {
                    opacity: 0.5;
                    pointer-events: none;
                }

                .message-button:hover {
                    background-color: rgba(125, 125, 125, 50%);
                }

                .quick-summary {
                    display: flex;
                    color: var(--font-color);
                    line-height: normal;
                    margin-bottom: 20px;
                    height: 200px;
                    overflow-y: scroll;
                    resize: vertical;
                    flex-direction: column;
                    gap: 15px;
                    padding: 10px 0;
                }
                
                .userToast {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background-color: var(--background-color);
                    color: ${settings.colorMode === "dark" ? "white" : "#ffffff"};
                    padding: 5px 10px;
                    border-radius: 10px;
                    z-index: 9999;
                    opacity: 0;
                    transition: opacity 0.5s ease-in-out;
                    font-size: 0.8rem;
                    font-weight: 200;
                    pointer-events: none;
                }
            `;
        }
        
        function generateLayoutCSS() {
            const isPageMode = settings.usePageMode;
            
            return `
            :root {
                --article-height: calc(var(--app-height) - var(--height-big));
                --header-height: 50px;
                --widget-width: ${settings.widgetWidth}px;
                --footer-height: 80px;
                --reader-layout-columns: 1fr var(--widget-width);
                --reader-layout-rows: var(--article-height) calc(var(--height-big) - var(--footer-height)) var(--footer-height);
            }
            
            /*font settings*/
    
            .reader-container {
                line-height: var(--line-height) !important;
                font-size: var(--font-size) !important;
            }
    
            .sentence-text-head {
                min-height: 4.5rem !important;
            }

            .reader-container p {
                margin-top: 0 !important;
            }
            
            /*highlightings*/
            
            .phrase-cluster:not(:has(.phrase-item-status--4, .phrase-item-status--4x2)) {
                border: 1px solid var(--lingq-border) !important;
            }
            
            .phrase-cluster:has(.phrase-item-status--4, .phrase-item-status--4x2) {
                border: 1px solid var(--lingq-border-learned) !important;
            }
            
            .reader-container .sentence .lingq-word:not(.is-learned) {
                border: 1px solid var(--lingq-border) !important;
            }
            
            .reader-container .sentence .lingq-word.is-learned {
                border: 1px solid var(--lingq-border-learned) !important;
            }
            
            .reader-container .sentence .blue-word {
                border: 1px solid var(--unknown-border) !important;
            }
            
            /*header settings*/
    
            .main-wrapper {
                padding: 0 !important;
            }
            
            #app > .main-wrapper > [data-slot="sidebar-wrapper"] > header {
                position: absolute;
                z-index: 10;
            }
    
            #main-nav {
                z-index: 1;
            }
    
            #main-nav > nav {
                height: var(--header-height);
            }
    
            #main-nav > nav > div:nth-child(1) {
                height: var(--header-height);
            }
    
            .main-header {
                z-index: 20;
                pointer-events: none;
            }
    
            .main-header > div {
                grid-template-columns: 1fr 150px !important;
                padding: 0 0 0 420px !important;
            }
    
            .main-header section:nth-child(1) {
                display: none;
            }
    
            .main-header section {
                pointer-events: auto;
                z-index: 1;
            }
    
            .main-header svg {
                width: 20px !important;
                height: 20px !important;
            }
    
            .main-header section .dropdown-content {
                position: fixed;
            }
    
            .lesson-progress-section {
                grid-template-rows: unset !important;
                grid-template-columns: unset !important;
                grid-column: 1 !important;
                pointer-events: auto;
            }
    
            .lesson-progress-section .rc-slider{
                grid-row: unset !important;
                grid-column: unset !important;
                width: 50% !important;
            }
    
            /*layout*/
    
            #lesson-reader {
                grid-template-columns: var(--reader-layout-columns);
                grid-template-rows: var(--reader-layout-rows);
                overflow: hidden;
                height: auto !important;
            }
    
            .sentence-text {
                height: calc(var(--article-height) - var(--header-height)) !important;
                padding: 0 0 20px !important;
            }
    
            .reader-container-wrapper {
                height: 100% !important;
                overflow-y: ${isPageMode ? "scroll" : "visible"} !important;
            }
    
            .widget-area {
                padding: var(--header-height) 0 10px !important;
                margin: 0 10px !important;
                height: 100% !important;
                justify-content: center;
                display: flex;
            }
    
            .reader-widget {
                position: relative;
                display: flow !important;
                overflow-y: auto;
                width: 100% !important;
                height: fit-content !important;
                max-width: none !important;
                scrollbar-width: none !important;
            }
    
            .reader-widget:not(.reader-widget--resources) {
                padding: 10px !important;
            }
    
            .reader-widget.reader-widget--resources {
                padding: 10px 15px !important;
            }
    
            .reference-main {
                margin-bottom: 5px;
            }
    
            .reference-word {
                white-space: pre-line !important;
            }
    
            .section-widget--main {
                margin: 0 !important;
                padding: 0 !important;
            }
    
            .appCue-poular-hints {
                max-height: 250px;
                overflow-y: auto;
                scrollbar-width: none !important;
            }
    
            .reference-input-text {
                font-size: 0.9rem !important;
                scrollbar-width: none !important;
            }
    
            .section-widget--foot {
                margin: 0 !important;
                padding: 10px 0 0 !important;
                display: block !important;
            }
    
            .dictionary-resources {
                width: 100% !important;
            }
    
            .word-status-bar {
                width: 100%;
                grid-template-columns: repeat(6, 1fr) !important;
                grid-gap: 10px !important;
            }
    
            .reference-helpers {
                display: none !important;
            }
    
            .main-footer {
                grid-area: 3 / 1 / 3 / 1 !important;
                align-self: end;
                padding: 5px 10px 10px;
                height: 100%;
            }
    
            .main-footer > div {
                height: 100%;
            }
    
            .lesson-bottom > div {
                position: unset !important;
            }
    
            .main-content {
                grid-template-rows: var(--header-height) 1fr !important;
                overflow: hidden;
                align-items: center;
            }
    
            /*make prev/next page buttons compact*/
    
            .reader-component {
                grid-template-columns: ${isPageMode ? "1.5rem" : "0"} 1fr ${isPageMode ? "1.5rem" : "0"} !important;
            }
    
            .reader-component > :is(.nav--left, .nav--right) {
                visibility: ${isPageMode ? "visible" : "hidden"} !important;
            }
    
            .reader-component > div > a.button > span {
                width: 0.5rem !important;
            }
    
            .reader-component > div > a.button > span > svg {
                width: 15px !important;
                height: 15px !important;
            }
    
            .loadedContent {
                padding: 0 0 0 10px !important;;
            }
    
            /*font settings*/
    
            .reader-container {
                padding: 0 !important;
                margin: 0 !important;
                float: left !important;
                max-width: unset !important;
                columns: ${isPageMode ? "100vw auto" : "unset"} !important;
                overflow-y: ${isPageMode ? "visible" : "scroll"} !important;
                height: ${isPageMode ? "100vh" : "100%"} !important;
            }
    
            /*video viewer*/
    
            .video-player:not(.is-minimized) {
                display: flex !important;
                justify-content: flex-end !important;
                pointer-events: none;
                z-index: 38 !important;
            }
    
            .video-player.is-minimized {
                bottom: 0 !important;
                right: 0 !important;
                align-items: end !important;
            }
    
            .video-player > .modal-background {
                background-color: rgb(26 28 30 / 0%) !important;
            }
    
            .video-player:not(.is-minimized) > .modal-content {
                max-width: var(--width-big) !important;
                margin: 0 0 10px 10px !important;
                border-radius: 0.75rem !important;
            }
    
            .video-player.is-minimized > .modal-content {
                width: calc(var(--widget-width) - 20px) !important;
                max-width: unset !important;
                margin: 0 10px var(--footer-height) 0 !important;
            }
    
            .video-player .modal-section {
                display: none !important;
            }
    
            .video-player:not(.is-minimized) .video-wrapper {
                height: var(--height-big) !important;
                overflow: hidden;
                pointer-events: auto;
            }
    
            .video-player.is-minimized .video-wrapper {
                height: 250px !important;
            }
    
            /*video controller*/
    
            .rc-slider-rail {
                background-color: dimgrey !important;
            }
    
            .rc-slider-step {
                margin-top: -8px !important;
                height: 1.2rem !important;
            }
    
            .lingq-audio-player {
                margin-left: 10px;
            }
    
            .section--player.is-expanded {
                width: 100% !important;
                height: 100%;
                padding: 0 !important;
            }
    
            .sentence-mode-button {
                margin: 0 0 10px 0;
            }
    
            .player-wrapper {
                grid-template-columns: 1fr 40px !important;
                padding: 0 !important;
            }
    
            .audio-player {
                padding: 0 0.5rem !important;
                grid-template-rows: 16px 16px auto !important;
            }
    
            .audio-player--controllers {
                grid-gap: unset !important;
            }
    
            .audio-player--controllers a {
                height: 25px !important;
                padding: 0 1em !important;
                margin: 5px 0;
            }
    
            .audio-player--controllers span {
                height: 25px !important;
            }
            `;
        }
        
        function generateVideoCSS() {
            return `
            :root {
                --width-big: calc(100vw - var(--widget-width) - 10px);
                --height-big: ${settings.heightBig}px;
            }
    
            .main-content {
                grid-area: 1 / 1 / 2 / 2 !important;
            }
    
            .widget-area {
                grid-area: 1 / 2 / 3 / 2 !important;
            }
    
            .main-footer {
                grid-area: 3 / 2 / 4 / 3 !important;
                align-self: end;
            }
    
            .video-player:not(.is-minimized) {
                align-items: flex-start !important;
            }
            `;
        }
        
        function generateVideo2CSS() {
            return `
            :root {
                --width-big: calc(50vw - calc(var(--widget-width) / 2) - 10px);
                --height-big: calc(100vh - 65px);
    
                --reader-layout-columns: 1fr var(--widget-width) 1fr;
                --reader-layout-rows: var(--article-height) var(--footer-height);
                --article-height: calc(var(--app-height) - var(--footer-height));
            }
    
            #lesson-reader {
                grid-template-columns: var(--reader-layout-columns);
            }
    
            .main-content {
                grid-area: 1 / 1 / 2 / 2 !important;
            }
    
            .widget-area {
                grid-area: 1 / 2 / 2 / 3 !important;
            }
    
            .main-footer {
                grid-area: 2 / 2 / 3 / 3 !important;
                align-self: end;
            }
    
            .video-player {
                align-items: end !important;
            }
            `;
        }
        
        function generateAudioCSS() {
            return `
        :root {
            --width-big: calc(var(--widget-width) - 20px);
            --height-big: cald(var(--footer-height) - 10px);

            --reader-layout-rows: var(--article-height) var(--footer-height);
            --article-height: calc(var(--app-height) - var(--footer-height));
        }

        .main-content {
            grid-area: 1 / 1 / 2 / 2 !important;
        }

        .widget-area {
            grid-area: 1 / 2 / 2 / 2 !important;
        }

        .main-footer {
            grid-area: 2 / 1 / 3 / 2 !important;
            align-self: end;
        }

        .video-player:not(.is-minimized) {
            align-items: end !important;
        }

        .video-player:not(.is-minimized) > .modal-content {
            margin: 0 10px 10px !important;
        }
        `;
        }
        
        function generateOffModeCSS() {
            return `
            :root {
                --width-small: 440px;
                --height-small: 260px;
                --sentence-height: ${settings.sentenceHeight}px;
                --right-pos: 0.5%;
                --bottom-pos: 5.5%;
            }
            
            .quick-summary {
                display: none !important;
            }
    
            /*video player*/
    
            .video-player.is-minimized .video-wrapper,
            .sent-video-player.is-minimized .video-wrapper {
                height: var(--height-small);
                width: var(--width-small);
                overflow: auto;
                resize: both;
            }
    
            .video-player.is-minimized .modal-content,
            .sent-video-player.is-minimized .modal-content {
                max-width: calc(var(--width-small)* 3);
                margin-bottom: 0;
            }
    
            .video-player.is-minimized,
            .sent-video-player.is-minimized {
                left: auto;
                top: auto;
                right: var(--right-pos);
                bottom: var(--bottom-pos);
                z-index: 99999999;
                overflow: visible
            }
    
            /*sentence mode video player*/
            .loadedContent:has(#sentence-video-player-portal) {
                grid-template-rows: var(--sentence-height) auto 1fr !important;
            }
    
            #sentence-video-player-portal .video-section {
                width: 100% !important;
                max-width: none !important;
            }
    
            #sentence-video-player-portal .video-wrapper {
                height: 100% !important;
                max-height: none !important;
            }
    
            #sentence-video-player-portal div:has(> iframe) {
                height: 100% !important;
            }
            `;
        }
        
        function setupKeyboardShortcuts() {
            document.addEventListener("keydown", function (event) {
                if (!settings.keyboardShortcut) return;
                
                const targetElement = event.target;
                const isTextInput = targetElement.localName === "text" || targetElement.localName === "textarea" || targetElement.localName === "input";
                const withoutModifierKeys = !event.ctrlKey && !event.shiftKey && !event.altKey;
                const eventKey = event.key.toLowerCase();
                if (isTextInput) {
                    if (targetElement.id === "user-input") return;
                    if ((eventKey === 'enter' || eventKey === 'escape') && withoutModifierKeys) {
                        preventPropagation(event);
                        event.target.blur()
                    } else {
                        event.stopPropagation();
                        return;
                    }
                }
                
                const shortcuts = {
                    [settings.shortcutVideoFullscreen]: () => clickElement(".modal-section > div > button:nth-child(2)"), // video full screen toggle
                    [settings.shortcutMeaningInput]: () => focusElement(".reference-input-text"), // Move cursor to meaning input
                    [settings.shortcutChatInput]: () => focusElement("#user-input"), // Move cursor to the chat widget input
                    [settings.shortcutFlashcard]: () => clickElement("#chat-container .word-message:last-child .save-flashcard-button"), // Make a flashcard
                    [settings.shortcutTTSPlay]: () => clickElement(".is-tts"), // Play tts audio
                    [settings.shortcutTranslator]: () => clickElement(".dictionary-resources > a:nth-last-child(1)"), // Open Translator
                    [settings.shortcutBackward5s]: () => clickElement(".audio-player--controllers > div:nth-child(1) > a"), // 5 sec Backward
                    [settings.shortcutForward5s]: () => clickElement(".audio-player--controllers > div:nth-child(2) > a"), // 5 sec Forward
                    [settings.shortcutMakeKnown]: () => document.dispatchEvent(new KeyboardEvent("keydown", {key: "k"})), // Simulate original 'k' for Make Word Known
                    [settings.shortcutDictionary]: () => clickElement(".dictionary-resources > a:nth-child(1)"), // Open Dictionary
                    [settings.shortcutCopySelected]: () => copySelectedText() // Copy selected text
                };
                
                if (shortcuts[eventKey] && withoutModifierKeys) {
                    preventPropagation(event);
                    shortcuts[eventKey]();
                }
            }, true);
        }
        
        function setupYoutubePlayerCustomization() {
            async function changeVideoPlayerSettings() {
                const iframe = await waitForElement('.modal-container iframe', 5000);
                let src = iframe.getAttribute("src");
                src = src.replace("disablekb=1", "disablekb=0");
                // src = src.replace("autoplay=0", "autoplay=1");
                src = src + "&cc_load_policy=1";
                src = src + "&controls=0";
                iframe.setAttribute("src", src);
                
                const modalRelative = iframe.closest('.modal-content > .relative');
                modalRelative?.classList.remove('relative');
                modalRelative?.style.setProperty('width', 'auto', 'important');
                modalRelative?.style.setProperty('height', 'auto', 'important');
                
                const wrapperRelative = iframe.closest('.video-wrapper > .relative');
                wrapperRelative?.classList.remove('relative');
            }
            
            async function setupSliderObserver() {
                function createSliderElements() {
                    const sliderContainer = createElement("div", {className: "rc-slider rc-slider-horizontal"});
                    const sliderRail = createElement("div", {className: "rc-slider-rail"});
                    const sliderTrack = createElement("div", {className: "rc-slider-track"});
                    sliderContainer.appendChild(sliderRail);
                    sliderContainer.appendChild(sliderTrack);
                    return sliderContainer;
                }
                
                function updateLessonProgress(lessonId, lessonInfo, progressPercentage, lastCompletedPercentage) {
                    const progressUpdatePeriod = 5;
                    const flooredProgressPercentage = Math.floor(progressPercentage / progressUpdatePeriod) * progressUpdatePeriod;
                    
                    if (flooredProgressPercentage > lastCompletedPercentage) {
                        console.log('Slider', `progress percentage: ${flooredProgressPercentage}`);
                        const wordIndex = Math.floor(lessonInfo["totalWordsCount"] * (flooredProgressPercentage / 100));
                        setLessonProgress(lessonId, wordIndex);
                        return flooredProgressPercentage;
                    }
                    return lastCompletedPercentage;
                }
                
                const lessonId = getLessonId();
                const lessonInfo = await getLessonInfo(lessonId);
                let lastCompletedPercentage = lessonInfo["progress"];
                console.log(`last progress: ${lastCompletedPercentage}`);
                
                const sliderTrack = document.querySelector('.audio-player--progress .rc-slider-track');
                
                const videoContainer = document.querySelector(".modal-content > div");
                const sliderContainer = createSliderElements();
                const videoSliderTrack = sliderContainer.querySelector(".rc-slider-track");
                videoContainer.appendChild(sliderContainer);
                
                const sliderObserver = new MutationObserver(function (mutations) {
                    for (const mutation of mutations) {
                        videoSliderTrack.style.cssText = sliderTrack.style.cssText;
                        
                        const progressPercentage = parseFloat(sliderTrack.style.width);
                        lastCompletedPercentage = updateLessonProgress(lessonId, lessonInfo, progressPercentage, lastCompletedPercentage);
                        console.debug('Observer:', `Slider Changed. Progress: ${progressPercentage}`);
                        
                        const isVideoStopped = document.querySelector(`.shared-player div[data-original-title="Play video"]`);
                        const isLessonFinished = ((progressPercentage >= 99) && isVideoStopped) || (progressPercentage >= 99.95);
                        if (isLessonFinished && settings.autoFinishing) {
                            console.log('Slider', 'lesson finished.')
                            setTimeout(finishLesson, 1000);
                            sliderObserver.disconnect();
                        }
                    }
                });
                
                sliderObserver.observe(sliderTrack, {attributes: true, attributeFilter: ['style']});
            }
            
            const observer = new MutationObserver(async function (mutations) {
                for (const mutation of mutations) {
                    console.debug('Observer:', `Modal container created. ${mutation.type}`, mutation.addedNodes);
                    
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;
                        if (!node.matches(".modal-container")) continue;
                        
                        changeVideoPlayerSettings();
                        
                        await waitForElement('.modal-container .modal-section', 5000);
                        clickElement('.modal-section button:nth-child(2)[title="Expand"]');
                        
                        const isPageMode = document.querySelector('#lesson-reader').matches('.is-page-mode');
                        if (isPageMode) setupSliderObserver();
                    }
                }
            });
            
            observer.observe(document.body, {childList: true});
        }
        
        async function setupReaderContainer() {
            let [llmProvider, llmModel] = settings.llmProviderModel.split(" ");
            let llmApiKey = settings.llmApiKey;
            
            function setupSentenceFocus(readerContainer) {
                function focusPlayingSentence(playingSentence) {
                    const scrolling_div = document.querySelector(".reader-container");
                    const offsetTop = playingSentence.parentElement.matches(".has-translation") ? playingSentence.parentElement.offsetTop : playingSentence.offsetTop;
                    const targetScrollTop = offsetTop + Math.floor(playingSentence.offsetHeight / 2) - Math.floor(scrolling_div.offsetHeight / 2);
                    smoothScrollTo(scrolling_div, targetScrollTop, 300);
                }
                
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        const target = mutation.target;
                        if (!(target.matches(".sentence.is-playing") && settings.focusPlayingSentence)) return;
                        focusPlayingSentence(target);
                    });
                });
                observer.observe(readerContainer, {attributes: true, subtree: true, attributeFilter: ['class']});
            }
            
            function changeTranslationColor(readerContainer) {
                const observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        for (const node of mutation.addedNodes) {
                            if (!(node.nodeType === Node.ELEMENT_NODE && node.matches('p:has(.sentence)'))) continue;
                            
                            for (const sentence of node.querySelectorAll('.sentence')) {
                                if (!(sentence.style.borderImageSource)) continue;
                                
                                const fontColor = settings[`${settings.colorMode}_translationFontColor`];
                                const colorRegex = /color:%23[0-9a-fA-F]{6}/g;
                                sentence.style.borderImageSource = sentence.style.borderImageSource.replace(colorRegex, `color:${fontColor}`);
                            }
                        }
                    }
                });
                observer.observe(readerContainer, {childList: true, subtree: true});
            }
            
            async function generateLessonSummary(readerContainer) {
                const observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        for (const node of mutation.addedNodes) {
                            if (!(node.nodeType === Node.ELEMENT_NODE && node.matches('section'))) continue;
                            
                            const summaryElement = createElement("div", {
                                className: "quick-summary",
                                style: "position: relative;",
                                innerHTML: quickSummary
                            });

                            changeScrollAmount(".quick-summary", 0.2);
                            summaryElement.addEventListener('wheel', (event) => event.stopPropagation());
                            node.parentNode.prepend(summaryElement);
                        }
                    }
                });
                observer.observe(readerContainer, {childList: true, subtree: true});
                
                const lessonContent = extractTextFromDOM(readerContainer).trim();
                
                [llmProvider, llmModel] = settings.llmProviderModel.split(" ");
                llmApiKey = settings.llmApiKey;
                
                if (settings.prependSummary) {
                    getQuickSummary(llmProvider, llmApiKey, llmModel, lessonContent)
                        .then(result => {
                            quickSummary = result;
                            
                            const summaryElement = document.querySelector(".quick-summary");
                            if (summaryElement) {
                                summaryElement.innerHTML = result;
                            }
                        }).catch(error => {
                        console.error("Failed to fetch summary:", error);
                    });
                }
                
                getLessonSummary(llmProvider, llmApiKey, llmModel, lessonContent).then(summary => {
                    lessonSummary = summary
                })
            }
            
            function setupNavigationScrollReset() {
                const navSelectors = [
                    ".reader-component .nav--left a",
                    ".reader-component .nav--right a"
                ];
                
                navSelectors.forEach((selector) => {
                    waitForElement(selector, 5000).then((button) => {
                        if (!button) return;
                        
                        button.addEventListener("click", () => {
                            setTimeout(() => {
                                const wrapper = document.querySelector(".reader-container-wrapper");
                                if (wrapper) {
                                    wrapper.scrollTop = 0;
                                }
                            }, 150);
                        });
                    });
                });
            }
            
            const observer = new MutationObserver(function (mutations) {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach(async (node) => {
                        if (node.nodeType !== Node.ELEMENT_NODE) return;
                        if (!node.matches(".loadedContent")) return;
                        
                        const isPageMode = settings.usePageMode;
                        if (isPageMode) {
                            const readerContainer = node.querySelector(".reader-container");
                            readerContainer?.addEventListener("wheel", (event) => {
                                const wrapper = readerContainer.closest(".reader-container-wrapper");
                                if (wrapper) {
                                    wrapper.scrollTop += event.deltaY;
                                    event.preventDefault();
                                }
                            }, { passive: false });
                        }
                        
                        const scrollTarget = isPageMode ? ".reader-container-wrapper" : ".reader-container";
                        changeScrollAmount(scrollTarget, 0.3);
                        
                        setupSentenceFocus(node);
                        
                        if (settings.showTranslation) showTranslation();
                        changeTranslationColor(node);
                        
                        await waitForElement('.sentence-text p', 10000);
                        generateLessonSummary(node);
                        
                        const summaryElement = node.querySelector(".quick-summary");
                        if (summaryElement) {
                            summaryElement.addEventListener('wheel', (event) => {
                                event.stopPropagation();
                            }, { passive: false });
                        }
                    });
                });
            });
            
            const sentenceText = await waitForElement('.sentence-text', 10000);
            observer.observe(sentenceText, { childList: true });
            
            setupNavigationScrollReset();
        }
        
        async function setupLLMs() {
            let [llmProvider, llmModel] = settings.llmProviderModel.split(" ");
            let llmApiKey = settings.llmApiKey;
            
            async function updateTTS(click = true) {
                async function replaceTTSButton() {
                    const selectedTextElement = document.querySelector(".reference-word");
                    const selectedText = selectedTextElement ? selectedTextElement.textContent.trim() : "";
                    if (!selectedText) return;
                    
                    if (selectedText.length > 1000) {
                        console.log("The length of the selected text exceeds 1,000.")
                        return;
                    }
                    
                    ttsButton.disabled = true;
                    let audioData = await getTTSResponse(settings.ttsProvider, settings.ttsApiKey, (settings.ttsVoice[getLessonLanguage()] ?? "random"), selectedText);
                    if (audioData == null) {
                        console.log("audioData can't be got.")
                        return;
                    }
                    ttsButton.disabled = false;
                    
                    const newTTSButton = ttsButton.cloneNode(true);
                    newTTSButton.id = "playAudio";
                    newTTSButton.addEventListener('click', async (event) => {
                        await playAudio(audioData, 1.0);
                    })
                    ttsButton.replaceWith(newTTSButton);
                    showToast("TTS Replaced", true);
                    
                    if (settings.ttsAutoplay) playAudio(audioData, 1.0);
                }
                
                if (!settings.tts) return;
                
                const ttsButton = document.querySelector('.is-tts');
                if (!ttsButton) return;
                
                const isWord = document.querySelector("span.selected-text, span.is-selected");
                
                const ttsWordOffCondition = !settings.ttsWord && isWord;
                const ttsSentenceOffCondition = !settings.ttsSentence && !isWord;
                
                if (ttsWordOffCondition || ttsSentenceOffCondition) {
                    if (click) ttsButton.click();
                    
                    ttsButton.addEventListener('click', (event) => {
                        event.stopImmediatePropagation();
                        replaceTTSButton();
                    }, true);
                } else {
                    replaceTTSButton();
                }
            }
            
            async function updateWidget() {
                function getSectionHead() {
                    let targetSectionHead = document.querySelector("#lesson-reader .widget-area > .reader-widget > .section-widget--head");
                    targetSectionHead = targetSectionHead ? targetSectionHead : document.querySelector("#lesson-reader .widget-area > .reader-widget");
                    return targetSectionHead;
                }
                
                function getSelectedWithContext() {
                    const selectedTextElement = document.querySelector(".reference-word");
                    const contextElement = document.querySelector("span.selected-text, span.is-selected")?.closest(".sentence");
                    
                    const selectedText = selectedTextElement ? extractTextFromDOM(selectedTextElement).trim() : "";
                    const contextText = contextElement ? extractTextFromDOM(contextElement).trim() : "";
                    
                    return {input: selectedText, context: contextText};
                }
                
                let isProgrammaticReferenceWordUpdate = false;
                
                function updateReferenceWord() {
                    isProgrammaticReferenceWordUpdate = true;
                    const selection = window.getSelection();
                    if (selection.rangeCount === 0) {
                        console.log('Selection rangeCount is zero.')
                        return;
                    }
                    
                    const referenceWord = document.querySelector(".reference-word");
                    const extractedText = extractTextFromDOM(selection.getRangeAt(0).cloneContents());
                    if (referenceWord && extractedText && isSentence) {
                        referenceWord.textContent = extractedText;
                    }
                    isProgrammaticReferenceWordUpdate = false;
                }
                
                function isWordMessageStructure(botMessageDiv) {
                    if (!botMessageDiv) return false;
                    
                    const wordElem = botMessageDiv.querySelector("b");
                    const pronunciationElem = botMessageDiv.querySelector("span");
                    const posElem = botMessageDiv.querySelector("i");
                    const paragraphs = botMessageDiv.querySelectorAll("p");
                    const hrs = botMessageDiv.querySelectorAll("hr");
                    const exampleListElem = botMessageDiv.querySelector("ul");
                    const exampleItems = exampleListElem ? exampleListElem.querySelectorAll("li") : [];
                    
                    if (!wordElem || !pronunciationElem || !posElem) return false;
                    if (paragraphs.length < 2 || hrs.length < 2) return false;
                    if (!exampleListElem || exampleItems.length < 2) return false;
                    
                    return true;
                }
                
                function enhanceWordMessage(botMessageDiv, selectedData) {
                    if (!isWordMessageStructure(botMessageDiv)) return;
                    
                    if (!botMessageDiv.classList.contains("word-message")) botMessageDiv.classList.add("word-message");
                    
                    const safeSelectedData = selectedData || {input: "", context: ""};
                    
                    const wordElem = botMessageDiv.querySelector("b");
                    const pronunciationElem = botMessageDiv.querySelector("span");
                    const meaningElem = botMessageDiv.querySelector("p");
                    const explanationElem = botMessageDiv.querySelectorAll("p")[1];
                    const exampleListElem = botMessageDiv.querySelector("ul");
                    const exampleSentenceElem = exampleListElem?.querySelector("li:nth-child(1)");
                    const exampleTranslationElem = exampleListElem?.querySelector("li:nth-child(2)");
                    
                    const word = (() => {
                        if (!wordElem) return "";
                        const clone = wordElem.cloneNode(true);
                        clone.querySelector(".flashcard-count-badge")?.remove();
                        return clone.textContent.trim();
                    })();
                    const pronunciation = pronunciationElem?.textContent?.trim() || "";
                    const meaning = meaningElem?.textContent?.trim() || "";
                    const explanation = explanationElem?.textContent?.trim() || "";
                    const exampleSentence = exampleSentenceElem?.textContent?.trim() || "";
                    const exampleTranslation = exampleTranslationElem?.textContent?.trim() || "";
                    
                    if (!word) return;
                    
                    /*
                    wordElem.addEventListener("click", async () => {
                        navigator.clipboard.writeText(word)
                            .then(() => showToast("Word Copied!", true))
                            .catch(() => showToast("Failed to copy word.", false));
                    });
                    */
                    
                    if (meaningElem) {
                        meaningElem.addEventListener("click", async (e) => {
                            if (e.ctrlKey || e.metaKey) {
                                if (meaningElem.querySelector("input")) return;
                                
                                const currentText = meaningElem.textContent.trim();
                                
                                const input = createElement("input", {type: "text", value: currentText, className: "meaning-edit-input",});
                                
                                meaningElem.textContent = "";
                                meaningElem.appendChild(input);
                                input.focus();
                                
                                const finishEdit = async (save) => {
                                    const newValue = input.value.trim();
                                    meaningElem.textContent = newValue;
                                    
                                    if (save && newValue !== currentText) {
                                        navigator.clipboard.writeText(newValue)
                                            .then(() => showToast("Meaning Copied!", true))
                                            .catch(() => showToast("Failed to copy meaning.", false));
                                        
                                        const storedIdx = botMessageDiv.dataset.wordIdx;
                                        if (storedIdx) {
                                            const { error: updateError } = await supabaseClient
                                                .from("word_data")
                                                .update({ meaning: newValue })
                                                .eq("idx", storedIdx);
                                            if (updateError) {
                                                console.error("Meaning update error:", updateError);
                                                showToast("Failed to update meaning.", false);
                                            } else {
                                                showToast("Meaning updated!", true);
                                            }
                                        } else {
                                            console.warn("No stored idx - cannot update meaning.");
                                        }
                                    }
                                };
                                
                                input.addEventListener("keydown", async (event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        input.blur();
                                    } else if (event.key === "Escape") {
                                        meaningElem.textContent = currentText;
                                    }
                                });
                                
                                input.addEventListener("blur", async () => {
                                    await finishEdit(true);
                                });
                                
                                return;
                            }
                            
                            navigator.clipboard.writeText(meaningElem?.textContent?.trim() || "")
                                .then(() => showToast("Meaning Copied!", true))
                                .catch(() => showToast("Failed to copy meaning.", false));
                            
                            
                        });
                    }
                    
                    if (exampleListElem) {
                        exampleListElem.addEventListener("click", async () => {
                            const textToCopy = Array
                                .from(exampleListElem.querySelectorAll("li"))
                                .map(li => li.textContent)
                                .join("\n");
                            navigator.clipboard.writeText(textToCopy)
                                .then(() => showToast("Example Copied!", true))
                                .catch(() => showToast("Failed to copy example.", false));
                        });
                    }
                    
                    const lingqMeaningElement = document.querySelector(".reference-input-text");
                    const hasMeaning = lingqMeaningElement ? lingqMeaningElement.value : false;
                    const textToCopyForLingq = (hasMeaning ? "\n" : "") + meaning;
                    if (textToCopyForLingq.trim() !== "") {
                        navigator.clipboard.writeText(textToCopyForLingq)
                            .then(() => showToast("Meaning Copied!", true))
                            .catch(() => showToast("Failed to copy meaning.", false));
                    }
                    
                    if (supabaseClient) {
                        wordElem.addEventListener("click", async (e) => {
                            const existingPopup = document.getElementById("flashcard-popup");
                            if (existingPopup) existingPopup.remove();
                            
                            const {data, error} = await supabaseClient
                                .from("word_data")
                                .select("*")
                                .eq("word", word)
                                .eq("flashcard", true);
                            
                            if (error) {
                                console.error("Flashcard fetch error:", error);
                                return;
                            }
                            
                            const rect = wordElem.getBoundingClientRect();
                            const popup = createElement("div", {
                                id: "flashcard-popup",
                                style: `top: ${rect.bottom + window.scrollY}px; left: ${rect.left + window.scrollX}px;`
                            });
                            
                            if (!data || data.length === 0) {
                                popup.appendChild(createElement("em", {innerHTML: "No flashcards found."}));
                            } else {
                                data.forEach(row => {
                                    const rowDiv = createElement("div", {className: "flashcard-row"});
                                    const deleteBtn = createElement("button", {
                                        className: "popup-delete-button",
                                        innerHTML: `<svg viewBox="6 6 12 12" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"><path d="M17 17L7 7.00002M17 7L7.00001 17" stroke-width="2" stroke-linecap="round"/></svg>`
                                    });
                                    
                                    deleteBtn.addEventListener("click", async (ev) => {
                                        ev.stopPropagation();
                                        deleteBtn.disabled = true;
                                        const {error: updateError} = await supabaseClient
                                            .from("word_data")
                                            .update({flashcard: false})
                                            .eq("idx", row.idx)
                                            .eq("word", row.word);
                                        if (updateError) {
                                            console.error("Flashcard delete error:", updateError);
                                            deleteBtn.disabled = false;
                                        } else {
                                            rowDiv.remove();
                                            if (!popup.querySelector("div")) {
                                                popup.appendChild(createElement("em", {innerHTML: "No flashcards found."}));
                                            }
                                            const badge = wordElem.querySelector(".flashcard-count-badge");
                                            if (badge) {
                                                if (+badge.textContent > 1) badge.textContent = +badge.textContent - 1;
                                                else badge.remove();
                                            }
                                            showToast("Flashcard removed.", true);
                                        }
                                    });
                                    
                                    rowDiv.appendChild(deleteBtn);
                                    rowDiv.appendChild(createElement("b", {innerHTML: `${row.word}`}));
                                    rowDiv.appendChild(createElement("span", {innerHTML: `${row.meaning}`}));
                                    popup.appendChild(rowDiv);
                                });
                            }
                            
                            document.body.appendChild(popup);
                            
                            const chatContainer = document.querySelector("#chat-container");
                            const closePopup = (ev) => {
                                if (!popup.contains(ev.target) && ev.target !== wordElem) {
                                    popup.remove();
                                    document.removeEventListener("click", closePopup);
                                    chatContainer.removeEventListener("scroll", closePopup);
                                }
                            };
                            document.addEventListener("click", closePopup);
                            chatContainer.addEventListener("scroll", closePopup);
                        });
                        
                        supabaseClient
                            .from("word_data")
                            .select("*", {count: "exact", head: true})
                            .eq("word", word)
                            .eq("flashcard", true)
                            .then(({count, error}) => {
                                if (error) {
                                    console.error("Flashcard count error:", error);
                                    return;
                                }
                                if (count > 0) {
                                    const existingBadge = wordElem.querySelector(".flashcard-count-badge");
                                    if (existingBadge) return;
                                    const badge = createElement("span", {
                                        className: "flashcard-count-badge",
                                        textContent: count > 9 ? "9+" : count
                                    });
                                    wordElem.appendChild(badge);
                                }
                            });
                        
                        const newItem = {
                            language: getLessonLanguage(),
                            original_word: safeSelectedData.input,
                            context: safeSelectedData.context,
                            word,
                            pronunciation,
                            meaning,
                            explanation,
                            example_sentence: exampleSentence,
                            example_translation: exampleTranslation,
                            flashcard: false
                        };
                        
                        const messageButtonContainer = botMessageDiv.querySelector(".message-button-container");
                        let saveFlashcardButton = messageButtonContainer.querySelector(".save-flashcard-button");
                        
                        if (!saveFlashcardButton) {
                            saveFlashcardButton = createElement("button", {
                                className: "message-button save-flashcard-button",
                                innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="transparent" stroke="currentColor"><g id="SVGRepo_iconCarrier"> <path d="M16 3.98999H8C6.93913 3.98999 5.92178 4.41135 5.17163 5.1615C4.42149 5.91164 4 6.92912 4 7.98999V17.99C4 19.0509 4.42149 20.0682 5.17163 20.8184C5.92178 21.5685 6.93913 21.99 8 21.99H16C17.0609 21.99 18.0783 21.5685 18.8284 20.8184C19.5786 20.0682 20 19.0509 20 17.99V7.98999C20 6.92912 19.5786 5.91164 18.8284 5.1615C18.0783 4.41135 17.0609 3.98999 16 3.98999Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 2V7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15 2V7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8 16H14" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8 12H16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`,
                                disabled: true
                            });
                            
                            saveFlashcardButton.addEventListener("click", async () => {
                                saveFlashcardButton.disabled = true;
                                try {
                                    const targetIdx = botMessageDiv.dataset.wordIdx;
                                    if (!targetIdx) {
                                        console.error("No stored idx for this message.");
                                        saveFlashcardButton.disabled = false;
                                        return;
                                    }
                                    
                                    const { error: updateError } = await supabaseClient
                                        .from("word_data")
                                        .update({ flashcard: true })
                                        .eq("idx", targetIdx);
                                    
                                    if (updateError) {
                                        console.error("Flashcard update error:", updateError);
                                        showToast("Failed to save flashcard.", false);
                                        saveFlashcardButton.disabled = false;
                                    } else {
                                        const badge = wordElem.querySelector(".flashcard-count-badge");
                                        if (badge) badge.textContent = +badge.textContent + 1;
                                        else wordElem.appendChild(createElement("span", {className: "flashcard-count-badge", textContent: "1"}));
                                        showToast("Saved to Flashcard!", true);
                                    }
                                } catch (err) {
                                    console.error("Unexpected error:", err);
                                    saveFlashcardButton.disabled = false;
                                }
                            });
                            
                            const regenerateButton = messageButtonContainer.querySelector(".regenerate-button");
                            if (regenerateButton) messageButtonContainer.insertBefore(saveFlashcardButton, regenerateButton);
                            else messageButtonContainer.appendChild(saveFlashcardButton);
                        }
                        
                        supabaseClient
                            .from("word_data")
                            .insert([newItem])
                            .select("idx")
                            .then(({data: inserted, error: insertError}) => {
                                if (insertError) {
                                    console.error("Insert error:", insertError);
                                    return;
                                }
                                
                                botMessageDiv.dataset.wordIdx = inserted[0].idx;
                                saveFlashcardButton.disabled = false;
                            });
                    }
                }
                
                function updateChatHistoryState(currentHistory, message, role) {
                    return [...currentHistory, {role: role, content: message}];
                }
                
                function addMessageToUI(message, messageClass, container, initial = false) {
                    const messageDiv = createElement("div", {className: `chat-message ${messageClass}`});
                    if (initial) messageDiv.innerHTML = message;
                    container.appendChild(messageDiv);
                    
                    if (container.childElementCount > 1) smoothScrollTo(container, container.scrollHeight, 300);
                    return messageDiv;
                }
                
                async function callStreamOpenAI(botMessageDiv, chatContainer, focus, onStreamCompleted = () => {}) {
                    const userInput = document.getElementById("user-input");
                    const sendButton = document.getElementById("send-button");
                    
                    userInput.disabled = true;
                    sendButton.disabled = true;
                    
                    let fullBotResponse = '';
                    
                    const existingRegenerateButton = botMessageDiv.querySelector('.regenerate-button');
                    if (existingRegenerateButton) {
                        existingRegenerateButton.remove();
                    }
                    
                    [llmProvider, llmModel] = settings.llmProviderModel.split(" ");
                    llmApiKey = settings.llmApiKey;
                    await streamOpenAIResponse(
                        llmProvider,
                        llmApiKey,
                        llmModel,
                        chatHistory.map(item => ({role: item.role.split("-")[0], content: item.content})),
                        (chunk) => {
                            if (chunk.choices && chunk.choices.length > 0) {
                                const delta = chunk.choices[0].delta;
                                if (delta.content) {
                                    fullBotResponse += delta.content;
                                    botMessageDiv.innerHTML = fullBotResponse;
                                    smoothScrollTo(chatContainer, chatContainer.scrollHeight, 100);
                                }
                            }
                        },
                        (finalContent) => {
                            const cleanedContent = finalContent.replace(/^```(?:\w+\n)?/, '').replace(/```\s*$/, '');
                            botMessageDiv.innerHTML = cleanedContent;
                            
                            chatHistory = updateChatHistoryState(chatHistory, cleanedContent, "assistant");
                            userInput.disabled = false;
                            sendButton.disabled = false;
                            if (focus) userInput.focus();
                            
                            const existingRegenerateButton = document.querySelector('.regenerate-button');
                            if (existingRegenerateButton) existingRegenerateButton.remove();
                            
                            const messageButtonContainer = createElement("div", {className: 'message-button-container'});
                            
                            const copyButton = createElement("button", {
                                className: "message-button copy-button",
                                innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="transparent" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>`,
                            });
                            copyButton.addEventListener('click', async () => {
                                const textToCopy = (() => {
                                    const clone = botMessageDiv.cloneNode(true);
                                    clone.querySelector(".flashcard-count-badge")?.remove();
                                    return clone.textContent;
                                })();
                                
                                navigator.clipboard.writeText(textToCopy)
                                    .then(() => {
                                        showToast("Message Copied!", true);
                                    })
                                    .catch(() => {
                                        showToast("Failed to copy message.", false);
                                    });
                            });
                            messageButtonContainer.appendChild(copyButton);
                            
                            const ttsButton = createElement("button", {
                                className: "message-button tts-button",
                                innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="transparent" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>`,
                            });
                            ttsButton.addEventListener('click', async function initialTTSHandler() {
                                let textToTTS = "";
                                
                                if (botMessageDiv.matches(".word-message")) {
                                    textToTTS = Array.from(botMessageDiv.querySelectorAll("b, ul > li:nth-child(1)")).map(node => node.textContent).join(". ");
                                } else {
                                    textToTTS = botMessageDiv.textContent.replaceAll("\n", " ");
                                }
                                
                                ttsButton.disabled = true;
                                const audioData = await getTTSResponse(settings.ttsProvider, settings.ttsApiKey, (settings.ttsVoice[getLessonLanguage()] ?? "random"), textToTTS);
                                if (audioData == null) {
                                    console.log("audioData can't be got.")
                                    return;
                                }
                                ttsButton.disabled = false;
                                playAudio(audioData, 1.0);
                                
                                ttsButton.removeEventListener('click', initialTTSHandler);
                                ttsButton.addEventListener('click', async () => {
                                    await playAudio(audioData, 1.0);
                                });
                            });
                            messageButtonContainer.appendChild(ttsButton);
                            
                            const regenerateButton = createElement("button", {
                                className: "message-button regenerate-button",
                                innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="transparent" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>`,
                            });
                            regenerateButton.addEventListener("click", async () => {
                                botMessageDiv.remove();
                                chatHistory = chatHistory.slice(0, chatHistory.findLastIndex((item) => item.role === "assistant"));
                                
                                const chatContainer = document.getElementById("chat-container");
                                const newBotMessageDiv = addMessageToUI("", botMessageDiv.classList, chatContainer, false);
                                
                                await callStreamOpenAI(newBotMessageDiv, chatContainer, true,
                                    (finalContent) => {
                                        const selectedData = getSelectedWithContext();
                                        enhanceWordMessage(newBotMessageDiv, selectedData);
                                    }
                                );
                            });
                            messageButtonContainer.appendChild(regenerateButton);
                            
                            botMessageDiv.appendChild(messageButtonContainer);
                            smoothScrollTo(chatContainer, chatContainer.scrollHeight, 100);
                            
                            onStreamCompleted(cleanedContent);
                        },
                        (error) => {
                            botMessageDiv.innerHTML = `⚠️ Error: ${error.message}`;
                        }
                    );
                }
                
                async function handleSendMessage() {
                    const userInput = document.getElementById("user-input");
                    const chatContainer = document.getElementById("chat-container");
                    
                    const userMessage = userInput.value.trim();
                    if (!userMessage) return;
                    userInput.value = '';
                    
                    if (chatHistory.findIndex(item => item.role === "system-plain") !== -1) chatHistory = chatHistory.filter(item => (item.role !== "system-word" && item.role !== "system-sentence"));
                    
                    addMessageToUI(userMessage, 'user-message', chatContainer, true);
                    chatHistory = updateChatHistoryState(chatHistory, userMessage, "user");
                    
                    const botMessageDiv = addMessageToUI("", "bot-message", chatContainer, false);
                    await callStreamOpenAI(botMessageDiv, chatContainer, true,
                        (finalContent) => {
                            const selectedData = getSelectedWithContext();
                            enhanceWordMessage(botMessageDiv, selectedData);
                        }
                    );
                }
                
                async function updateChatWidget() {
                    if (!settings.chatWidget) return;
                    
                    const chatWrapper = createElement("div", {id: "chat-widget", style: "margin-top: 5px 0 10px;"});
                    const chatContainer = createElement("div", {id: "chat-container"});
                    const inputContainer = createElement("div", {className: "input-container"});
                    const userInput = createElement("input", {
                        type: "text",
                        id: "user-input",
                        placeholder: "Ask anything"
                    });
                    const sendButton = createElement("button", {
                        id: "send-button",
                        innerHTML: `<svg width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlns:xlink="http://www.w3.org/1999/xlink"><path fill="currentColor" d="M481.508,210.336L68.414,38.926c-17.403-7.222-37.064-4.045-51.309,8.287C2.86,59.547-3.098,78.551,1.558,96.808 L38.327,241h180.026c8.284,0,15.001,6.716,15.001,15.001c0,8.284-6.716,15.001-15.001,15.001H38.327L1.558,415.193 c-4.656,18.258,1.301,37.262,15.547,49.595c14.274,12.357,33.937,15.495,51.31,8.287l413.094-171.409 C500.317,293.862,512,276.364,512,256.001C512,235.638,500.317,218.139,481.508,210.336z"></path></svg>`
                    });
                    
                    inputContainer.appendChild(userInput);
                    inputContainer.appendChild(sendButton);
                    chatWrapper.appendChild(chatContainer);
                    chatWrapper.appendChild(inputContainer);
                    
                    const sectionHead = getSectionHead();
                    const existingChatWidget = document.getElementById('chat-widget');
                    if (existingChatWidget) {
                        existingChatWidget.replaceWith(chatWrapper);
                    } else if (sectionHead.matches(".section-widget--head")) {
                        sectionHead.appendChild(chatWrapper);
                    } else {
                        sectionHead.prepend(chatWrapper);
                    }
                    
                    changeScrollAmount("#chat-container", 0.2)
                    userInput.addEventListener('keydown', (event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            handleSendMessage();
                        } else if (event.key === 'Escape') {
                            event.preventDefault();
                            event.target.blur();
                        }
                        event.stopPropagation();
                    }, true);
                    sendButton.addEventListener('click', handleSendMessage);
                    
                    chatHistory = updateChatHistoryState(chatHistory, `This is the summary of this lesson. You can refer to this when you response. \n[Lesson Summary] ${lessonSummary}`, "user");
                    chatHistory = updateChatHistoryState(chatHistory, removeIndent(systemPrompt), "system-main");
                    
                    if (settings.askSelected && sectionHead.matches(".section-widget--head")) {
                        const selectedData = getSelectedWithContext();
                        const initialUserMessage = `Input: "${selectedData.input}"` + (!isSentence ? `, Context: "${selectedData.context}"` : "");
                        
                        if (initialUserMessage.length > 1000) {
                            console.log("The length of the selected text exceeds 1,000.")
                            return;
                        }
                        
                        if (isSentence) chatHistory = updateChatHistoryState(chatHistory, removeIndent(sentencePrompt), "system-sentence");
                        else chatHistory = updateChatHistoryState(chatHistory, removeIndent(wordPhrasePrompt), "system-word");
                        
                        chatHistory = updateChatHistoryState(chatHistory, initialUserMessage, "user");
                        
                        const messageClass = isSentence ? "sentence-message" : "word-message";
                        const botMessageDiv = addMessageToUI("", `bot-message ${messageClass}`, chatContainer, false);
                        
                        await callStreamOpenAI(botMessageDiv, chatContainer, false,
                            async (finalContent) => {
                                enhanceWordMessage(botMessageDiv, selectedData);
                            }
                        );
                        
                        chatHistory = updateChatHistoryState(chatHistory, removeIndent(plainTextPrompt), "system-plain");
                    }
                }
                
                if (document.getElementById('chatWidget')) {
                    console.log('chatWidget already exists.');
                    return;
                }
                
                const isSentence = !document.querySelector(".section-widget--main");
                
                const systemPrompt = `
                # System Capabilities & Format Protocol
                
                ## Core Responsibility
                You are an advanced linguistic assistant. Your goal is to provide precise, dictionary-grade instructional content.
                - Tone: Objective, educational, and concise.
                - Latency Control: Skip prefaces (e.g., "Here is the answer"). Output the result immediately.
                
                ## STRICT Output Formatting (HTML Only)
                - Content Type: Raw HTML string.
                - Forbidden: Markdown syntax (No \`\`\`html blocks, no bold, no # headers), conversational filler.
                - Tag Usage:
                  - <b>Target Terms</b>: Use for the base word, phrase, or key translation elements.
                  - <i>Part of Speech</i>: Use for grammatical labels.
                  - <p>Paragraphs</p>: Use for definitions and explanations.
                  - <ul>/<li>Lists</li></ul>: Use for example sets.
                  - <hr>: Use to separate logical sections.
                - Spacing: Use <p> tags for structural spacing. Use <br> only for line breaks inside a specific block if absolutely necessary.
                
                ## Language Configuration
                - Presentation Language: '${userLanguage}' (Used for explanations, definitions, translations).
                - Target Language: '${lessonLanguage}' (Used for original examples, base forms).
                - Nuance: Explanations must bridge the cultural/linguistic gap between '${lessonLanguage}' and '${userLanguage}'.
                `;
                
                const wordPhrasePrompt = `
                # Single Word/Phrase Extraction
                
                ## Task: Linguistic Analysis
                Analyze the input: 'Input: "Term" Context: "Sentence"'.
                
                1. Lemma Extraction (Base Form)
                   - Nouns: Singular form.
                   - Verbs: Infinitive form.
                   - Adverbs: Maintain the adverbial form. DO NOT revert '-ly' adverbs to adjectives (e.g., Input: "perfectly" -> Base: "perfectly", NOT "perfect").
                   - Idioms: Standard dictionary form (e.g., "kicked the bucket" -> "kick the bucket").
                   - Inflections: If the input is conjugated (e.g., "書いていました"), output the dictionary form ("書く").
                
                2. IPA Pronunciation
                   - Provide IPA for the **Base Form** enclosed in brackets.
                   - Simplify Constraints: Eliminate narrow phonetic diacritics (e.g., lowering [̞], voiceless [̥], compressed [ᵝ], or dental [̪] marks).
                   - Ensure the output represents the standard, dictionary-style pronunciation, not a precise phonetic realization.
                
                3. Contextual Definition
                   - Identify the single standard dictionary definition of the Base Form in ${userLanguage} that corresponds to the sense used in the Context.
                   - Do not use parentheses for alternative meanings or additional explanation. Do not provide a comma-separated list of synonyms.
                   - Output must be a definitive, short phrase or single word perfectly substituting the term in the context.
                
                4. Contextual Explanation
                   - This is where you bridge the "Standard Definition" and the "Specific Context".
                   - Explain how the dictionary meaning applies here, explaining specific nuances, tense, or implications.
                
                5. Example Generation
                   - Create a new, high-quality penetrating example sentence in ${lessonLanguage} using the Base Form.
                   - And translate accurately into ${userLanguage}.
                   - Ensure the usage helps the user understand the general applicability of this specific sense.
                
                ## Output Structure (HTML)

                <b>[Base Form in ${lessonLanguage}]</b> <span>/[IPA]/</span> <i>([Part of Speech in ${userLanguage}])</i>
                <p>[Standard Dictionary Definition in ${userLanguage}]</p>
                <hr>
                <p>[Contextual Explanation in ${userLanguage}]</p>
                <hr>
                <ul>
                  <li>[New Example Sentence in ${lessonLanguage}]</li>
                  <li>[Translation in ${userLanguage}]</li>
                </ul>
                
                ## Examples
                
                ### Example 1: Noun (Original: English, User: Korean)
                User Input: 'Input: "translators", Context: "However, the ESV translators chose to translate that same word as 'servant'."'
                Assistant Output:
                <b>translator</b> <span>[trænsˈleɪtər]</span> <i>(명사)</i>
                <p>번역가</p>
                <hr>
                <p>한 언어로 된 텍스트나 말을 다른 언어로 바꾸는 사람을 뜻하는 일반적인 단어입니다. 문맥에서는 성경 번역을 담당한 특정 그룹을 지칭하고 있습니다.</p>
                <hr>
                <ul>
                  <li>Many translators work freely.</li>
                  <li>많은 번역가들이 자유롭게 일합니다.</li>
                </ul>
                
                ### Example 2: Verb (Original: Spanish, User: English)
                User Input: 'Input: "lograr", Context: "Debemos lograr nuestros objetivos."'
                Assistant Output:
                <b>lograr</b> <span>[loˈɣɾaɾ]</span> <i>(verb)</i>
                <p>To achieve</p>
                <hr>
                <p>Refers to the act of reaching a goal or result, typically through effort. The context highlights obtaining specific objectives.</p>
                <hr>
                <ul>
                  <li>Espero lograr todas mis metas.</li>
                  <li>I hope to achieve all my goals.</li>
                </ul>
                
                ### Example 3: Context-Specific Sense (Original: German, User: French)
                User Input: 'Input: "anstellen", Context: "Was hast du mit der Schere angestellt?"'
                Assistant Output:
                <b>anstellen</b> <span>[ˈanˌʃtɛlən]</span> <i>(verb)</i>
                <p>Faire (quelque chose de mal)</p>
                <hr>
                <p>Bien que "anstellen" puisse signifier "employer", dans ce contexte, il signifie "commettre" ou "faire" une bêtise. C'est le sens standard utilisé pour des actions négatives ou maladroites.</p>
                <hr>
                <ul>
                  <li>Er hat wieder etwas Dummes angestellt.</li>
                  <li>Il a encore fait quelque chose de stupide.</li>
                </ul>
                
                ### Example 4: Adverb Retention (Original: English, User: Japanese)
                User Input: 'Input: "recklessly", Context: "He drove recklessly through the rain."'
                Assistant Output:
                <b>recklessly</b> <span>[ˈrɛklɪsli]</span> <i>(副詞)</i>
                <p>無謀に</p>
                <hr>
                <p>危険や結果を十分に考えずに行動することを指す定義です。文脈では運転という行為が安全を無視して行われたことを説明しています。</p>
                <hr>
                <ul>
                  <li>She spent money recklessly.</li>
                  <li>彼女は無謀にお金を使った。</li>
                </ul>
                
                ### Example 5: Conjugated Verb (Original: Japanese, User: Korean)
                User Input: 'Input: "入っていました", Context: "箱の中に手紙が入っていました。"'
                Assistant Output:
                <b>入る</b> <span>[haiɾɯ]</span> <i>(동사)</i>
                <p>들어있다</p>
                <hr>
                <p>사전적으로는 '밖에서 안으로 이동하다' 또는 '안에 존재하다'를 의미합니다. 이 문맥에서는 '이동'보다는 편지가 상자 안에 이미 존재하는 '상태'를 나타내는 의미로 쓰였습니다.</p>
                <hr>
                <ul>
                  <li>カバンに本が入る。</li>
                  <li>가방에 책이 들어간다 (들어있다).</li>
                </ul>
                `;
                
                const sentencePrompt = `
                # Sentence Analysis
                
                ## Task: Full Text Parsing
                Input: 'Input: "Sentences"'.
                
                1. Translation Strategy
                   - Translate ALL input sentences into a single flowing block in ${userLanguage}.
                   - Wrap the entire translation in <p><b>...</b></p>.
                
                2. Holistic Explanation
                   - Analyze the "Big Picture": Meaning, tone, speaker intent, and nuance.
                   - Explain beyond the literal translation.
                
                3. Key Element Extraction
                   - Select 2-4 distinct elements (Difficult words, Collocations, Idioms).
                   - Criteria: Choose elements where the whole is greater than the sum of parts, or where detailed nuance is needed.
                   - Format: [Original Term]: [Concise Definition in ${userLanguage}].
                
                ## Output Structure (HTML)
                
                <p><b>[Full Translation in ${userLanguage}]</b></p>
                <hr>
                <p>[Holistic Explanation in ${userLanguage}]</p>
                <hr>
                <ul>
                  <li><b>[Element 1 in ${lessonLanguage}]:</b> [Definition in ${userLanguage}]</li>
                  <li><b>[Element 2 in ${lessonLanguage}]:</b> [Definition in ${userLanguage}]</li>
                </ul>
                
                ## Examples
                
                ### Example 1: Standard Sentence (Original: French, User: Japanese)
                User Input: 'Input: "Il a réussi à convaincre ses collègues malgré les difficultés."'
                Assistant Output:
                <p><b>彼は困難にもかかわらず同僚たちを説得することに成功した。</b></p>
                <hr>
                <p>この文は、彼が直面した障害や困難な状況があったにもかかわらず、最終的に同僚たちを自分の意見に同意させることに成功したという達成感を伝えています。</p>
                <hr>
                <ul>
                  <li><b>réussi à convaincre:</b> 説得に成功した、納得させた。</li>
                  <li><b>malgré:</b> ～にもかかわらず（対立や譲歩を表す前置詞）。</li>
                </ul>
                
                ### Example 2: Contrast/Nuance (Original: Italian, User: German)
                User Input: 'Input: "Nonostante la pioggia, siamo andati al concerto."'
                Assistant Output:
                <p><b>Trotz des Regens sind wir zum Konzert gegangen.</b></p>
                <hr>
                <p>Dieser Satz hebt die Entschlossenheit hervor. Das Wort "Nonostante" signalisiert ein Hindernis (den Regen), das jedoch die Hauptaktion (zum Konzert gehen) nicht verhindern konnte.</p>
                <hr>
                <ul>
                  <li><b>Nonostante:</b> Trotz; obwohl.</li>
                  <li><b>siamo andati:</b> wir sind gegangen (Vergangenheitsform von "andare").</li>
                </ul>
                
                ### Example 3: Idiomatic Expression (Original: English, User: Korean)
                User Input: 'Input: "Don't worry, it's not rocket science, you'll figure it out quickly."'
                Assistant Output:
                <p><b>걱정 마세요, 그렇게 복잡한 게 아니니까 금방 알게 될 거예요.</b></p>
                <hr>
                <p>상대방을 안심시키고 격려하는 문장입니다. "Rocket science"는 매우 어렵고 복잡한 학문을 상징하는데, 부정문으로 쓰여 해당 과제가 평이하다는 것을 강조합니다.</p>
                <hr>
                <ul>
                  <li><b>it's not rocket science:</b> (관용구) 몹시 어려운 일이 아니다, 아주 복잡하지 않다.</li>
                  <li><b>figure it out:</b> (문제 등을) 해결하다, 이해하다, 답을 알아내다.</li>
                </ul>
                
                ### Example 4: Multiple Sentences (Original: Spanish, User: French)
                User Input: 'Input: "El sol brillaba con fuerza. Los pájaros cantaban en los árboles." 'r
                Assistant Output:
                <p><b>Le soleil brillait fort. Les oiseaux chantaient dans les arbres.</b></p>
                <hr>
                <p>Ces deux phrases posent un décor paisible et vivant. L'utilisation de l'imparfait (brillaba, cantaban) suggère une action continue dans le passé, décrivant l'atmosphère d'un moment précis.</p>
                <hr>
                <ul>
                  <li><b>con fuerza:</b> avec force; intensément.</li>
                  <li><b>cantaban:</b> ils chantaient (verbe chanter à l'imparfait).</li>
                </ul>
                `;
                
                const plainTextPrompt = `
                # Conversational Mode & Correction Protocol
                
                ## Context Awareness
                You are in a follow-up state. The user has either:
                1. Asked a question about the previous analysis.
                2. Requested a correction/fix for the previous analysis.
                3. Asked a general question.
                
                ## Logic Branching via Intent Detection
                
                ### Condition A: Correction Request (Priority)
                Trigger: User phrases like "Wrong word," "Base form is incorrect," "Fix the meaning," "Use X instead of Y," or points out an error.
                Action:
                1. Identify the Error: Determine what part of the previous structured output (Base form, IPA, Definition, or Example) needs fixing based on user input.
                2. Re-generate Structure: You MUST output the correction using the exact HTML structure used for the previous original response (word or sentence mode).
                3. No Conversational Filler: DO NOT say "Sorry," "Here is the fixed version," or "I understood." Just output the corrected HTML code block.
                
                ### Condition B: Referential Query
                Trigger: User asks "What does that mean implied?" or "Can you explain specifically?"
                Action: Answer in HTML <p> text referencing the initial context.
                
                ### Condition C: General Query
                Action: Answer helpfuly in HTML <p> text.
                
                ## Examples
                
                ### Example 1: Strict Correction (User forces Adverb form)
                Scenario: Previous output for "happily" showed base form "happy". User complains.
                User Input: "The basae form should be the adverb, not adjective."
                Assistant Output:
                <b>happily</b> <span>[ˈhæpɪli]</span> <i>(adverb)</i>
                <p>In a happy way</p>
                <hr>
                <p>Used to describe an action performed with joy. The user context emphasizes the manner of action.</p>
                <hr>
                <ul>
                  <li>He played happily.</li>
                  <li>彼は楽しそうに遊んだ。</li>
                </ul>
                
                ### Example 2: General Conversation
                User Input: "Why is English so hard?"
                Assistant Output:
                <p>English can be difficult due to its inconsistent spelling rules and vast vocabulary borrowed from multiple languages.</p>
                `;
                
                let chatHistory = [];
                
                updateReferenceWord();
                updateChatWidget();
                stopPlayingAudio(audioContext);
                updateTTS(settings.ttsAutoplay);
                
                const selectedTextElement = document.querySelector(".reference-word");
                if (selectedTextElement) {
                    const observer = new MutationObserver((mutations) => {
                        if (isProgrammaticReferenceWordUpdate) return;
                        mutations.forEach(async (mutation) => {
                            if (mutation.type !== 'characterData') return;
                            console.debug('Observer:', `Widget changed from word/sentence. ${mutation.type}, ${mutation.attributeName}`);
                            updateReferenceWord();
                            updateChatWidget();
                            stopPlayingAudio(audioContext);
                            updateTTS(false);
                        });
                    });
                    observer.observe(selectedTextElement, {subtree: true, characterData: true});
                }
                
                const widgetArea = document.querySelector("#lesson-reader .widget-area");
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach(async (node) => {
                            if (node.nodeType !== Node.ELEMENT_NODE) return;
                            if (!node.matches(".reader-widget")) return;
                            console.debug('Observer:', `Widget changed from resource. ${mutation.type}, ${mutation.addedNodes}`);
                            updateReferenceWord();
                            updateChatWidget();
                            stopPlayingAudio(audioContext);
                            updateTTS(settings.ttsAutoplay);
                        });
                    });
                });
                observer.observe(widgetArea, {childList: true});
            }
            
            const userDictionaryLang = await getDictionaryLanguage();
            const DictionaryLocalePairs = await getDictionaryLocalePairs()
            const lessonLanguage = DictionaryLocalePairs[getLessonLanguage()];
            const userLanguage = DictionaryLocalePairs[userDictionaryLang];
            const lessonReader = document.getElementById('lesson-reader');
            
            updateWidget();
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType !== Node.ELEMENT_NODE) return;
                        if (!(node.matches(".widget-area") && node.parentNode)) return;
                        console.debug('Observer:', `Widget added. ${mutation.type}`, mutation.addedNodes);
                        updateWidget();
                    });
                });
            });
            observer.observe(lessonReader, {childList: true});
        }
        
        async function AutoplayInSentenceView() {
            const sentenceMode = await waitForElement("#lesson-reader.is-sentence-mode", 10000);
            if (!sentenceMode) return;
            
            for (const selector of ['.reader-component > .nav--right > a', '.reader-component > .nav--left > a']) {
                const button = await waitForElement(selector, 5000);
                
                button.addEventListener('click', function (event) {
                    if (!settings.sentenceAutoplay) return;
                    
                    setTimeout(() => {
                        document.dispatchEvent(new KeyboardEvent('keydown', {key: 'a'}));
                        document.dispatchEvent(new KeyboardEvent('keydown', {key: 'T', shiftKey: true}));
                    }, 1500);
                }, true);
            }
        }
        
        let styleElement = null;
        let lessonSummary = "";
        let quickSummary = "";
        
        createReaderUI();
        setupStyleEventListeners();
        setupLessonCompletion();
        applyStyles();
        setupKeyboardShortcuts();
        setupYoutubePlayerCustomization();
        setupReaderContainer();
        setupLLMs();
        AutoplayInSentenceView();
    }
    
    async function setupCourse() {
        function createCourseUI() {
            const resetButton = createElement("button", {
                id: "resetLessonPositions",
                textContent: "⏮️",
                title: "Reset all lessons to the first page",
                className: "nav-button"
            });
            
            let nav = document.querySelector(".library-section > .list-header > .list-header-index");
            nav.appendChild(resetButton);
        }
        
        function setupCourseStyles() {
            const css = `
            .nav-button {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 1.5rem;
            }

            .library-section > .list-header > .list-header-index {
                grid-template-columns: auto 1fr auto !important;
            }

            .dynamic--word-progress {
                grid-template-columns: repeat(3, auto) !important;
            }

            .word-indicator--box-white {
                background-color: rgb(255 255 255 / 85%);
                border-color: rgb(255 255 255);
            }
            `;
            applyCSS(css);
        }
        
        function enrichLessonDetails() {
            function addKnownWordsIndicator(lessonElement, lessonInfo) {
                const dynamicWordProgress = lessonElement.querySelector('.dynamic--word-progress');
                
                const knownWordPercentage = Math.round((lessonInfo.knownWordsCount / lessonInfo.uniqueWordsCount) * 100);
                
                const knownWordsItem = createElement('div', {
                    className: 'word-indicator--item grid-layout grid-align--center grid-item is-fluid--left',
                    title: 'Known Words'
                });
                
                const knownWordsBox = createElement('div', {className: 'word-indicator--box word-indicator--box-white'});
                knownWordsItem.appendChild(knownWordsBox);
                
                const textWrapper = createElement('span', {className: 'text-wrapper is-size-8'});
                textWrapper.appendChild(createElement('span', {textContent: `${lessonInfo.knownWordsCount} (${knownWordPercentage}%)`}));
                
                knownWordsItem.appendChild(textWrapper);
                dynamicWordProgress.appendChild(knownWordsItem);
            }
            
            async function updateWordIndicatorPercentages(lessonElement, lessonId) {
                const lessonInfo = await getLessonInfo(lessonId);
                
                const wordIndicatorItems = lessonElement.querySelector(".word-indicator--item");
                if (!wordIndicatorItems) return;
                
                const lingqsPercentage = Math.round((lessonInfo.cardsCount / lessonInfo.uniqueWordsCount) * 100);
                const lingqsElement = lessonElement.querySelector('.word-indicator--item[title="LingQs"] > span > span');
                lingqsElement.textContent = `${lessonInfo.cardsCount} (${lingqsPercentage}%)`;
                
                addKnownWordsIndicator(lessonElement, lessonInfo);
            }
            
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    console.debug('Observer:', `Library item added. ${mutation.type}`, mutation.addedNodes);
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType !== Node.ELEMENT_NODE) return;
                        if (!node.matches('.library-item-wrap')) return;
                        
                        const lessonId = /l-search--(\d*)-horizontal/.exec(node.id)[1];
                        updateWordIndicatorPercentages(node, lessonId);
                    });
                });
            });
            
            const targetNode = document.querySelector('.library-section .library-list > .grid-layout');
            observer.observe(targetNode, {childList: true});
        }
        
        function enableCourseSorting() {
            const dropdownItems = document.querySelectorAll('.library-section > .list-header .tw-dropdown--item');
            if (dropdownItems.length) {
                dropdownItems.forEach((item, index) => {
                    item.addEventListener('click', () => {
                        console.log(`Clicked sort option: ${index}`);
                        settings.librarySortOption = index;
                    });
                });
                
                dropdownItems[settings.librarySortOption].click();
                return true;
            } else {
                console.warn("Dropdown items not found for library sort.");
                return false;
            }
        }
        
        function setupLessonResetButton() {
            const resetButton = document.getElementById("resetLessonPositions");
            resetButton.addEventListener("click", async () => {
                const languageCode = await getLanguageCode();
                const collectionId = await getCollectionId();
                
                const allLessons = await getAllLessons(languageCode, collectionId);
                const confirmed = confirm(`Reset all ${allLessons.length} lessons to their starting positions?`);
                if (!confirmed) return;
                
                for (const lesson of allLessons) {
                    await setLessonProgress(lesson.id, 0);
                    console.log(`Reset lesson ID: ${lesson.id} to the first page`);
                }
                
                alert(`Successfully reset ${allLessons.length} lessons to their starting positions.`);
            });
        }
        
        const libraryHeader = await waitForElement('.library-section > .list-header', 5000);
        createCourseUI();
        setupCourseStyles();
        
        enrichLessonDetails();
        enableCourseSorting();
        setupLessonResetButton();
    }
    
    async function setupEditor() {
        function updateProgress(progressBar, progressText, message, value, total) {
            if (value !== undefined && total !== undefined) {
                progressBar.max = total;
                progressBar.value = value;
            }
            progressText.textContent = message;
            console.log(message);
        }
        
        async function concatenateAudioBuffers(audioContext, audioBuffers) {
            if (audioBuffers.length === 0) return {concatenatedBuffer: null, duration: 0, timestamps: []};
            
            const sampleRate = audioBuffers[0].sampleRate;
            const numberOfChannels = audioBuffers[0].numberOfChannels;
            
            let totalLength = 0;
            audioBuffers.forEach(buffer => {
                if (buffer.sampleRate !== sampleRate || buffer.numberOfChannels !== numberOfChannels) {
                    console.warn("Mismatched audio buffer properties. Concatenation might have issues.");
                }
                totalLength += buffer.length;
            });
            
            const concatenatedBuffer = audioContext.createBuffer(numberOfChannels, totalLength, sampleRate);
            
            let currentOffsetInSamples = 0;
            const timestamps = [];
            
            for (let i = 0; i < audioBuffers.length; i++) {
                const buffer = audioBuffers[i];
                for (let channel = 0; channel < numberOfChannels; channel++) {
                    concatenatedBuffer.getChannelData(channel).set(buffer.getChannelData(channel), currentOffsetInSamples);
                }
                
                timestamps.push({
                    start: currentOffsetInSamples / sampleRate,
                    end: (currentOffsetInSamples + buffer.length) / sampleRate,
                });
                
                currentOffsetInSamples += buffer.length;
            }
            
            return {
                concatenatedBuffer: concatenatedBuffer,
                duration: concatenatedBuffer.duration,
                timestamps: timestamps
            };
        }
        
        async function generateLessonAudio() {
            const ttsProvider = settings.ttsProvider;
            
            const lessonId = getLessonId();
            const lessonLanguage = getLessonLanguage();
            
            let data = await getLessonSentences(lessonLanguage, lessonId);
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const sentenceTexts = data.map(item => item["text"]);
            const totalSentences = sentenceTexts.length;
            let processedSentences = 0;
            
            const progressBar = document.getElementById("lessonAudioProgressBar");
            const progressText = document.getElementById("lessonAudioProgressText");
            
            progressBar.style.display = "block";
            progressBar.max = totalSentences * 2;
            
            let RPM_LIMIT = 1;
            switch (ttsProvider) {
                case "openai":
                    RPM_LIMIT = 500;
                    break;
                case "google gemini":
                    RPM_LIMIT = 10;
                    break;
                case "google cloud":
                    RPM_LIMIT = 200;
                    break;
            }
            RPM_LIMIT = RPM_LIMIT * 0.9;
            const DELAY_BETWEEN_CALLS = (60 * 1000) / RPM_LIMIT;
            
            const apiCallPromises = [];
            const audioDataBuffers = new Array(totalSentences);
            let nextAvailableCallTime = Date.now();
            
            for (let i = 0; i < totalSentences; i++) {
                const text = sentenceTexts[i];
                const actualCallTime = Math.max(Date.now(), nextAvailableCallTime);
                nextAvailableCallTime = actualCallTime + DELAY_BETWEEN_CALLS;
                
                const p = new Promise(resolve => {
                    const timeToWait = actualCallTime - Date.now();
                    
                    setTimeout(async () => {
                        updateProgress(progressBar, progressText, `Calling TTS for sentence ${i + 1}/${totalSentences}`, processedSentences, totalSentences * 2);
                        
                        const audioArrayBuffer = await getTTSResponse(ttsProvider, settings.ttsApiKey, (settings.ttsVoice[getLessonLanguage()] ?? "random"), text);
                        audioDataBuffers[i] = await decodeAudioData(audioContext, audioArrayBuffer);
                        resolve();
                        processedSentences += 1;
                    }, Math.max(0, timeToWait));
                });
                apiCallPromises.push(p);
            }
            updateProgress(progressBar, progressText, 'All TTS API calls scheduled.', processedSentences, totalSentences * 2);
            
            await Promise.all(apiCallPromises);
            updateProgress(progressBar, progressText, 'All TTS API calls completed.', processedSentences, totalSentences * 2);
            
            updateProgress(progressBar, progressText, 'Concatenating audio buffers.', processedSentences, totalSentences * 2);
            const {concatenatedBuffer, duration, timestamps} = await concatenateAudioBuffers(
                audioContext,
                audioDataBuffers
            );
            
            updateProgress(progressBar, progressText, 'Encoding audio.', processedSentences, totalSentences * 2);
            const encodingProgressCallback = (current, total) => {
                const encodingProgressValue = processedSentences + Math.floor((current / total) * totalSentences);
                updateProgress(progressBar, progressText, `Encoding audio: ${Math.floor((current / total) * 100)}%`, encodingProgressValue, totalSentences * 2);
            };
            const finalMP3AudioData = await encodeAudioBufferToMP3(concatenatedBuffer, encodingProgressCallback);
            updateProgress(progressBar, progressText, 'Audio encoding completed.', totalSentences * 2, totalSentences * 2);
            
            updateProgress(progressBar, progressText, 'Uploading audio to lesson.', totalSentences * 2, totalSentences * 2);
            await uploadAudioToLesson(lessonLanguage, lessonId, finalMP3AudioData, Math.ceil(duration));
            
            const jsonTimestamps = timestamps.map(({start, end}, index) => {
                return {index: index + 1, timestamp: [start, end]}
            });
            updateProgress(progressBar, progressText, 'Updating timestamps to lesson.', totalSentences * 2, totalSentences * 2);
            await updataTimestampToLesson(lessonLanguage, lessonId, jsonTimestamps);
            
            window.onbeforeunload = null;
            location.reload();
        }
        
        async function createEditorUI() {
            const genLessonAudioButton = createElement("button", {
                id: "genLessonAudio",
                className: "button",
                tableindex: "0"
            });
            genLessonAudioButton.addEventListener("click", () => {
                genLessonAudioButton.disabled = true;
                generateLessonAudio();
            });
            genLessonAudioButton.appendChild(createElement("span", {
                className: "text-wrapper has-text-overflow",
                textContent: "Generate Lesson Audio"
            }));
            
            const control = createElement("div", {
                className: "control",
                style: "display: flex; flex-direction: column; gap: 5px;"
            });
            const field = createElement("div", {className: "field is-grouped"});
            const navItem = createElement("div", {className: "nav-item"});
            
            const progressBar = createElement("progress", {
                id: "lessonAudioProgressBar",
                value: "0",
                max: "100",
                style: "width: 100%; display: none;"
            });
            
            const progressText = createElement("span", {
                id: "lessonAudioProgressText",
                style: "font-size: 0.8em;"
            });
            
            control.appendChild(genLessonAudioButton);
            control.appendChild(progressBar);
            control.appendChild(progressText);
            field.appendChild(control);
            navItem.appendChild(field);
            
            let mainNav = await waitForElement(".nav--left");
            mainNav.appendChild(createElement("hr", {className: "divider my-3"}));
            mainNav.appendChild(navItem);
        }
        
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js");
        await createEditorUI();
    }
    
    async function setupPrintPage() {
        function highlightWordsInNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.nodeValue;
                const parent = node.parentNode;
                
                if (parent && parent.classList && parent.classList.contains('lingQ')) return;
                
                const regex = new RegExp(`\\b(${cardsList.map(card => card.word).join('|')})\\b`, 'gi');
                
                const matches = [...text.matchAll(regex)];
                
                if (matches.length > 0) {
                    let lastIndex = 0;
                    const fragment = document.createDocumentFragment();
                    
                    matches.forEach(match => {
                        const word = match[0];
                        const index = match.index;
                        
                        if (index > lastIndex) fragment.appendChild(document.createTextNode(text.substring(lastIndex, index)));
                        
                        const span = createElement("span", {className: "lingQ", textContent: word});
                        fragment.appendChild(span);
                        
                        lastIndex = index + word.length;
                    });
                    
                    if (lastIndex < text.length) fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
                    
                    parent.replaceChild(fragment, node);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName.toLowerCase() === 'script' || node.tagName.toLowerCase() === 'style') return;
                
                for (let i = 0; i < node.childNodes.length; i++) {
                    highlightWordsInNode(node.childNodes[i]);
                }
            }
        }
        
        const lessonURL = document.referrer;
        const lessonId = getLessonId(lessonURL);
        const lessonLanguage = getLessonLanguage(lessonURL);
        const wordsURL = `https://www.lingq.com/api/v3/${lessonLanguage}/lessons/${lessonId}/words`;
        
        const response = await fetch(wordsURL);
        const data = await response.json();
        
        const cardsList = []
        const seenTerms = new Set();
        
        Object.values(data.cards)
            .forEach(card => {
                if (card.status < 3) {
                    const term = card.term;
                    
                    if (!seenTerms.has(term)) {
                        seenTerms.add(term);
                        cardsList.push({
                            word: term,
                            context: card.fragment.replaceAll(term, `<b>${term}</b>`),
                            notes: card.notes,
                            status: card.status,
                            meaning: card.hints?.[0]?.text ?? ""
                        });
                    }
                }
            });
        
        cardsList.sort((a, b) => {
            return (a.word).localeCompare(b.word);
        });
        
        const css = `
            #logo {
                max-width: 100px !important;
            }
            th {
                font-weight: bold;
                background: whitesmoke;
            }
            th, td {
                border: 1px solid #eee;
                padding: 1px 2px;
                white-space: pre-line;
            }
            td.word {
                font-weight: bold;
            }
            td:is(.word,.context) {
                text-align: center;
            }
            .lingQ {
                background: rgba(255, 232, 149, 1);
            }
            `;
        applyCSS(css);
        
        const printContent = document.querySelector("#print-content > .reading-block > article > div");
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(printContent.innerHTML, 'text/html');
        const bodyContent = doc.body;
        
        highlightWordsInNode(bodyContent);
        printContent.innerHTML = bodyContent.innerHTML;
        
        const vocaTable = createElement("table", {style: "page-break-before: always;"});
        const thead = createElement("thead");
        const tr = createElement("tr");
        tr.appendChild(createElement("th", {textContent: ""}));
        tr.appendChild(createElement("th", {textContent: "word"}));
        tr.appendChild(createElement("th", {textContent: "context"}));
        tr.appendChild(createElement("th", {textContent: "meaning"}));
        thead.appendChild(tr);
        vocaTable.appendChild(thead);
        
        const tbody = createElement("tbody");
        cardsList.forEach(card => {
            const tr = createElement("tr");
            tr.appendChild(createElement("td", {className: "status", textContent: card.status}));
            tr.appendChild(createElement("td", {className: "word", textContent: card.word}));
            tr.appendChild(createElement("td", {className: "context", innerHTML: card.context}));
            tr.appendChild(createElement("td", {className: "meaning", textContent: card.meaning}));
            tbody.appendChild(tr);
        })
        vocaTable.appendChild(tbody);
        
        let printPage = document.querySelector("#print-page");
        printPage.appendChild(vocaTable);
        
        console.log(cardsList);
    }
    
    function setupYoutubeEmbeddedPlayer() {
        function isTargetOrigin() {
            const urlParams = new URLSearchParams(window.location.search);
            const origin = urlParams.get('origin');
            
            return origin === 'https://www.lingq.com';
        }
        
        if (!isTargetOrigin()) return;
        
        const css = `
            #player-control-overlay > div > player-fullscreen-controls > player-fullscreen-action-menu > div > div {
                display: none !important;
            }
            #player-control-overlay > div > div.player-controls-background-container > div.player-controls-background {
                display: none !important;
            }
            #player-control-overlay > div > div:nth-child(5) > player-middle-controls {
                display: none !important;
            }
            .ytp-paid-content-overlay, .ytmPaidContentOverlayHost {
                display: none !important;
            }
            #player-controls {
                height: 60px;
            }
            .ytp-pause-overlay-container {
                display: none !important;
            }
            .ytp-watermark {
                display: none !important;
            }
            .caption-window {
                display: unset !important;
            }
        `;
        applyCSS(css);
    }
    
    async function init() {
        try {
            supabaseClient = createClient(settings.dbUrl, settings.dbKey);
            console.log('Supabase initialized.');
        } catch (err) {
            console.error('Supabase initialization failed:', err);
            supabaseClient = null;
        }
        
        const url = document.URL.split("?")[0];
        if (url.includes("lingq")) {
            fixBugs();
            if (url.includes("/reader")) {
                setupPopups();
                setupReader();
            } else if (url.includes("/editor")) {
                setupPopups();
                setupEditor();
            } else if (url.includes("/library/course")) {
                setupCourse();
            } else if (url.includes("/print")) {
                setupPrintPage();
            }
        } else if (url.includes("youtube")) {
            setupYoutubeEmbeddedPlayer();
        }
    }
    init();
})();
