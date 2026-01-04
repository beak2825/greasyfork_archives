// ==UserScript==
// @name         Cigi Spotify Translator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract, translate, and display Spotify lyrics with a language selector and manual translation trigger
// @author       Raiwulf
// @match        *://*.spotify.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523415/Cigi%20Spotify%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/523415/Cigi%20Spotify%20Translator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_LANGUAGE = 'en';
    let isTranslating = false;

    const languages = {
        // Popular languages
        en: 'English',
        es: 'Spanish',
        fr: 'French',
        de: 'German',
        it: 'Italian',
        pt: 'Portuguese',
        ru: 'Russian',
        ja: 'Japanese',
        ko: 'Korean',
        zh: 'Chinese',
        ar: 'Arabic',
        hi: 'Hindi',
        tr: 'Turkish',
        
        // Rest in alphabetical order
        af: 'Afrikaans',
        sq: 'Albanian',
        am: 'Amharic',
        hy: 'Armenian',
        az: 'Azerbaijani',
        eu: 'Basque',
        be: 'Belarusian',
        bn: 'Bengali',
        bs: 'Bosnian',
        bg: 'Bulgarian',
        ca: 'Catalan',
        ceb: 'Cebuano',
        co: 'Corsican',
        hr: 'Croatian',
        cs: 'Czech',
        da: 'Danish',
        nl: 'Dutch',
        eo: 'Esperanto',
        et: 'Estonian',
        fi: 'Finnish',
        fy: 'Frisian',
        gl: 'Galician',
        ka: 'Georgian',
        el: 'Greek',
        gu: 'Gujarati',
        ht: 'Haitian Creole',
        ha: 'Hausa',
        haw: 'Hawaiian',
        he: 'Hebrew',
        hmn: 'Hmong',
        hu: 'Hungarian',
        is: 'Icelandic',
        ig: 'Igbo',
        id: 'Indonesian',
        ga: 'Irish',
        jv: 'Javanese',
        kn: 'Kannada',
        kk: 'Kazakh',
        km: 'Khmer',
        rw: 'Kinyarwanda',
        ku: 'Kurdish',
        ky: 'Kyrgyz',
        lo: 'Lao',
        la: 'Latin',
        lv: 'Latvian',
        lt: 'Lithuanian',
        lb: 'Luxembourgish',
        mk: 'Macedonian',
        mg: 'Malagasy',
        ms: 'Malay',
        ml: 'Malayalam',
        mt: 'Maltese',
        mi: 'Maori',
        mr: 'Marathi',
        mn: 'Mongolian',
        my: 'Myanmar (Burmese)',
        ne: 'Nepali',
        no: 'Norwegian',
        ny: 'Nyanja (Chichewa)',
        or: 'Odia (Oriya)',
        ps: 'Pashto',
        fa: 'Persian',
        pl: 'Polish',
        pa: 'Punjabi',
        ro: 'Romanian',
        sm: 'Samoan',
        gd: 'Scots Gaelic',
        sr: 'Serbian',
        st: 'Sesotho',
        sn: 'Shona',
        sd: 'Sindhi',
        si: 'Sinhala',
        sk: 'Slovak',
        sl: 'Slovenian',
        so: 'Somali',
        su: 'Sundanese',
        sw: 'Swahili',
        sv: 'Swedish',
        tl: 'Tagalog (Filipino)',
        tg: 'Tajik',
        ta: 'Tamil',
        tt: 'Tatar',
        te: 'Telugu',
        th: 'Thai',
        tk: 'Turkmen',
        uk: 'Ukrainian',
        ur: 'Urdu',
        ug: 'Uyghur',
        uz: 'Uzbek',
        vi: 'Vietnamese',
        cy: 'Welsh',
        xh: 'Xhosa',
        yi: 'Yiddish',
        yo: 'Yoruba',
        zu: 'Zulu'
    };

    function getSavedLanguage() {
        return localStorage.getItem('spotifyLyricsTranslationLang') || DEFAULT_LANGUAGE;
    }

    function saveLanguage(lang) {
        localStorage.setItem('spotifyLyricsTranslationLang', lang);
    }

    async function translateText(text, targetLang) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data[0][0][0];
        } catch (error) {
            console.error('Translation failed:', error);
            return '[Translation Error]';
        }
    }

    async function translateLyrics() {
        if (isTranslating) return;
        isTranslating = true;

        const targetLang = getSavedLanguage();
        const lyricsDivs = document.querySelectorAll('[data-testid="fullscreen-lyric"] div');

        document.querySelectorAll('[data-translated="true"]').forEach(el => el.remove());

        const originalLines = [];
        lyricsDivs.forEach((div, index) => {
            const originalText = div.textContent.trim();
            if (originalText && originalText !== "♪") {
                originalLines.push({ index, text: originalText });
            }
        });

        const translatedLines = await Promise.all(originalLines.map(async (line) => {
            const translatedText = await translateText(line.text, targetLang);
            return { index: line.index, translatedText };
        }));

        translatedLines.forEach(({ index, translatedText }) => {
            const targetDiv = lyricsDivs[index];
            const translationDiv = document.createElement('div');
            translationDiv.style.color = 'gray';
            translationDiv.style.fontStyle = 'italic';
            translationDiv.textContent = translatedText;
            translationDiv.setAttribute('data-translated', 'true');
            targetDiv.parentNode.insertBefore(translationDiv, targetDiv.nextSibling);
        });

        isTranslating = false;
    }

    function observeLyrics() {
        const targetNode = document.querySelector('[data-testid="lyrics-container"]') || document.querySelector('[data-testid="fullscreen-lyric"]');
        if (!targetNode) return;

        const observer = new MutationObserver(() => {
            translateLyrics();
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true,
        });
    }

    function createHeader() {
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 12px 0;
            background: rgba(40, 40, 40, 0.95);
            width: 100%;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            margin: 0;
        `;

        const controlsContainer = document.createElement('div');
        controlsContainer.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            max-width: 600px;
            width: 90%;
        `;

        const selectContainer = document.createElement('div');
        selectContainer.style.cssText = `
            position: relative;
            flex: 0 1 200px;
            min-width: 120px;
        `;

        const selectButton = document.createElement('button');
        selectButton.style.cssText = `
            width: 100%;
            padding: 8px;
            border: none;
            border-radius: 4px;
            background: rgba(80, 80, 80, 1);
            color: white;
            font-size: 14px;
            text-align: left;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        selectButton.textContent = languages[getSavedLanguage()];

        const dropdown = document.createElement('div');
        dropdown.style.cssText = `
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(40, 40, 40, 0.98);
            border-radius: 4px;
            margin-top: 4px;
            max-height: 300px;
            overflow-y: auto;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;

        const searchInput = document.createElement('input');
        searchInput.style.cssText = `
            width: calc(100% - 16px);
            margin: 8px;
            padding: 8px;
            border: none;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 14px;
        `;
        searchInput.placeholder = 'Search language...';

        const optionsContainer = document.createElement('div');
        optionsContainer.style.cssText = `
            padding: 8px 0;
        `;

        function createLanguageOptions(filter = '') {
            optionsContainer.innerHTML = '';
            
            // Separate popular and other languages
            const popularLanguages = [
                'en', 'tr', 'pl', 'es', 'fr', 'de', 'pt', 
                'ja', 'it', 'nl'
            ];
            
            const entries = Object.entries(languages);
            const filteredEntries = entries.filter(([_, name]) => 
                name.toLowerCase().includes(filter.toLowerCase())
            );

            // Separate and sort entries
            const popularEntries = filteredEntries.filter(([code]) => 
                popularLanguages.includes(code)
            ).sort((a, b) => 
                popularLanguages.indexOf(a[0]) - popularLanguages.indexOf(b[0])
            );
            
            const otherEntries = filteredEntries.filter(([code]) => 
                !popularLanguages.includes(code)
            );

            // Create divider if both sections have items
            if (popularEntries.length > 0 && otherEntries.length > 0) {
                const divider = document.createElement('div');
                divider.style.cssText = `
                    padding: 8px 16px;
                    color: #888;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                `;
                divider.textContent = 'Other Languages';
                
                // Create and append all options
                [...popularEntries, divider, ...otherEntries].forEach(entry => {
                    if (entry instanceof HTMLElement) {
                        optionsContainer.appendChild(entry);
                        return;
                    }

                    const [code, name] = entry;
                    const option = document.createElement('div');
                    option.style.cssText = `
                        padding: 8px 16px;
                        cursor: pointer;
                        color: white;
                        &:hover {
                            background: rgba(255, 255, 255, 0.1);
                        }
                    `;
                    option.textContent = name;
                    option.addEventListener('click', () => {
                        selectButton.textContent = name;
                        dropdown.style.display = 'none';
                        saveLanguage(code);
                        document.querySelectorAll('[data-translated="true"]').forEach(el => el.remove());
                        translateLyrics();
                    });
                    optionsContainer.appendChild(option);
                });
            }
        }

        selectButton.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            if (dropdown.style.display === 'block') {
                searchInput.focus();
            }
        });

        searchInput.addEventListener('input', (e) => {
            createLanguageOptions(e.target.value);
        });

        document.addEventListener('click', (e) => {
            if (!selectContainer.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        createLanguageOptions();
        dropdown.appendChild(searchInput);
        dropdown.appendChild(optionsContainer);
        selectContainer.appendChild(selectButton);
        selectContainer.appendChild(dropdown);

        const translateButton = document.createElement('button');
        translateButton.textContent = 'Translate';
        translateButton.style.cssText = `
            padding: 8px 16px;
            background-color: #1db954;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            min-width: 100px;
        `;

        translateButton.addEventListener('click', () => {
            document.querySelectorAll('[data-translated="true"]').forEach(el => el.remove());
            translateLyrics();
        });

        controlsContainer.appendChild(selectContainer);
        controlsContainer.appendChild(translateButton);
        header.appendChild(controlsContainer);

        const mainView = document.querySelector('.main-view-container__scroll-node-child');
        if (mainView) {
            mainView.insertBefore(header, mainView.firstChild);
        }
    }

    function waitForLyrics() {
        const lyricsContainer = document.querySelector('[data-testid="lyrics-container"]') || document.querySelector('[data-testid="fullscreen-lyric"]');
        if (lyricsContainer) {
            createHeader();
            observeLyrics();
            translateLyrics();
        } else {
            setTimeout(waitForLyrics, 1000);
        }
    }

    function checkForTranslation() {
        setInterval(() => {
            if (!document.querySelector('[data-translated="true"]') && !isTranslating) {
                translateLyrics();
            }
        }, 2000);
    }

    window.addEventListener('load', function () {
        waitForLyrics();
        checkForTranslation();
    });
})();
