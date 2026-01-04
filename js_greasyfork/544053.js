// ==UserScript==
// @name         MAL日本語アニメタイトル翻訳
// @namespace    torokesou
// @version      1.0
// @description  My Anime Listサイト内にあるアニメのタイトルや漫画のタイトルやキャラクター名や声優名を日本語に翻訳します。
// @author       torokesou
// @icon         https://files.catbox.moe/dgwc5b.png
// @license      MIT
// @match        https://myanimelist.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/544053/MAL%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E7%BF%BB%E8%A8%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/544053/MAL%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E7%BF%BB%E8%A8%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        DELAY_MIN: 500,
        DELAY_MAX: 1500,
        SIMILARITY_THRESHOLD: 0.7,
        MIN_TEXT_LENGTH: 4,
        MAX_CACHE_SIZE: 5000,
        MAX_MEMORY_CACHE_SIZE: 1000,
        STORAGE_KEY: 'mal_japanese_titles',
        BATCH_SAVE_INTERVAL: 30000,
        REFRESH_INTERVAL: 24 * 60 * 60 * 1000,
    };

    const titleCache = new Map();
    let persistentTitles = new Map();
    let unsavedChanges = new Map();
    const processedElements = new WeakSet();
    const processingElements = new WeakSet();

    async function loadPersistentData() {
        try {
            const savedData = GM_getValue(CONFIG.STORAGE_KEY, '{}');
            const parsed = JSON.parse(savedData);
            persistentTitles = new Map(Object.entries(parsed));

            let count = 0;
            for (const [url, title] of persistentTitles) {
                if (count >= CONFIG.MAX_MEMORY_CACHE_SIZE) break;
                titleCache.set(url, title);
                count++;
            }
        } catch (error) {
            persistentTitles = new Map();
        }
    }

    function manageMemoryCache() {
        if (titleCache.size > CONFIG.MAX_MEMORY_CACHE_SIZE) {
            const excess = titleCache.size - CONFIG.MAX_MEMORY_CACHE_SIZE;
            const keysToDelete = Array.from(titleCache.keys()).slice(0, excess);
            keysToDelete.forEach(key => titleCache.delete(key));
        }
    }

    function savePersistentData() {
        if (unsavedChanges.size === 0) return;

        try {
            for (const [url, data] of unsavedChanges) {
                if (data === null) {
                    persistentTitles.delete(url);
                } else {
                    persistentTitles.set(url, data);
                }
            }

            if (persistentTitles.size > CONFIG.MAX_CACHE_SIZE) {
                const excess = persistentTitles.size - CONFIG.MAX_CACHE_SIZE;
                const keysToDelete = Array.from(persistentTitles.keys()).slice(0, excess);
                keysToDelete.forEach(key => persistentTitles.delete(key));
            }

            const dataToSave = Object.fromEntries(persistentTitles);
            GM_setValue(CONFIG.STORAGE_KEY, JSON.stringify(dataToSave));
            unsavedChanges.clear();
        } catch (error) {
            // Silent error handling
        }
    }

    setInterval(savePersistentData, CONFIG.BATCH_SAVE_INTERVAL);
    window.addEventListener('beforeunload', savePersistentData);

    function extractContentNameFromUrl(url) {
        const animeMatch = url.match(/\/anime\/\d+\/([^\/\?#]+)/);
        const mangaMatch = url.match(/\/manga\/\d+\/([^\/\?#]+)/);
        const peopleMatch = url.match(/\/people\/\d+\/([^\/\?#]+)/);
        const characterMatch = url.match(/\/character\/\d+\/([^\/\?#]+)/);
        return animeMatch ? animeMatch[1] : (mangaMatch ? mangaMatch[1] : (peopleMatch ? peopleMatch[1] : (characterMatch ? characterMatch[1] : null)));
    }

    function getContentType(url) {
        if (url.includes('/anime/')) return 'anime';
        if (url.includes('/manga/')) return 'manga';
        if (url.includes('/people/')) return 'people';
        if (url.includes('/character/')) return 'character';
        return null;
    }

    function normalizeText(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
    }

    function containsJapanese(text) {
        return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
    }

    function isPeopleName(text, url) {
        if (!url.includes('/people/')) return false;
        
        const trimmedText = text.trim();
        const westernNamePattern = /^[A-Za-z][A-Za-z\s\-'\.]*,\s*[A-Za-z][A-Za-z\s\-'\.]*$/;
        if (westernNamePattern.test(trimmedText)) {
            return true;
        }
        
        const singleNamePattern = /^[A-Za-z][A-Za-z\s\-'\.]*$/;
        if (singleNamePattern.test(trimmedText) && trimmedText.length > 2) {
            const peopleNameFromUrl = extractContentNameFromUrl(url);
            if (peopleNameFromUrl) {
                const normalizedText = normalizeText(trimmedText);
                const normalizedUrlName = normalizeText(peopleNameFromUrl.replace(/_/g, ' '));
                if (normalizedText === normalizedUrlName || normalizedUrlName.includes(normalizedText)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    function isCharacterName(text, url) {
        if (!url.includes('/character/')) return false;
        
        const trimmedText = text.trim();
        const characterNamePattern = /^[A-Za-z][A-Za-z\s\-'\.]*,\s*[A-Za-z][A-Za-z\s\-'\.]*$/;
        if (characterNamePattern.test(trimmedText)) {
            return true;
        }
        
        const singleNamePattern = /^[A-Za-z][A-Za-z\s\-'\.]*$/;
        if (singleNamePattern.test(trimmedText) && trimmedText.length > 2) {
            const characterNameFromUrl = extractContentNameFromUrl(url);
            if (characterNameFromUrl) {
                const normalizedText = normalizeText(trimmedText);
                const normalizedUrlName = normalizeText(characterNameFromUrl.replace(/_/g, ' '));
                if (normalizedText === normalizedUrlName || normalizedUrlName.includes(normalizedText)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    function isContentTitle(text, url) {
        const contentType = getContentType(url);
        
        if (contentType === 'people') {
            return isPeopleName(text, url);
        } else if (contentType === 'character') {
            return isCharacterName(text, url);
        }
        
        const contentNameFromUrl = extractContentNameFromUrl(url);
        
        if (!contentNameFromUrl || !contentType) {
            return false;
        }

        const normalizedText = normalizeText(text);
        const normalizedUrlName = normalizeText(contentNameFromUrl.replace(/_/g, ' '));

        const subPagePattern = contentType === 'anime' 
            ? /\/anime\/\d+\/[^\/]+\/(video|review|stats|characters|staff|news|forum|clubs|pics|episode|stacks|userrecs|featured)/
            : /\/manga\/\d+\/[^\/]+\/(review|stats|characters|staff|news|forum|clubs|pics|chapter|stacks|userrecs|featured)/;
        
        if (url.match(subPagePattern)) {
            return false;
        }

        if (normalizedText === normalizedUrlName) {
            return true;
        }

        const textIncludesUrl = normalizedText.length > 0 && normalizedUrlName.includes(normalizedText);
        const urlIncludesText = normalizedUrlName.length > 0 && normalizedText.includes(normalizedUrlName);

        if (textIncludesUrl || urlIncludesText) {
            if (normalizedText.length < CONFIG.MIN_TEXT_LENGTH) {
                return false;
            }
            return true;
        }

        const textWords = normalizedText.split('_').filter(w => w.length > 1);
        const urlWords = normalizedUrlName.split('_').filter(w => w.length > 1);

        if (textWords.length === 0 || urlWords.length === 0) {
            return false;
        }

        const commonWords = textWords.filter(word =>
            urlWords.some(urlWord => {
                return word === urlWord ||
                       (word.length >= 4 && urlWord.length >= 4 &&
                        (word.includes(urlWord) || urlWord.includes(word)));
            })
        );

        if (commonWords.length < 2 && textWords.length > 1) {
            return false;
        }

        const similarity_ratio = commonWords.length / Math.min(textWords.length, urlWords.length);
        return similarity_ratio >= CONFIG.SIMILARITY_THRESHOLD;
    }

    function isDataStale(data) {
        if (!data || typeof data !== 'object' || !data.timestamp) {
            return true;
        }
        return (Date.now() - data.timestamp) > CONFIG.REFRESH_INTERVAL;
    }

    async function getJapaneseTitle(contentUrl, retryCount = 0) {
        const maxRetries = 3;

        if (titleCache.has(contentUrl)) {
            const cached = titleCache.get(contentUrl);
            if (cached && !isDataStale(cached)) {
                return cached.title;
            }
        }

        try {
            const response = await fetch(contentUrl, {
                headers: {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "ja",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "same-origin",
                    "upgrade-insecure-requests": "1"
                },
                mode: "cors",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            let japaneseTitle = null;

            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                if (contentUrl.includes('/character/')) {
                    const h2Elements = doc.querySelectorAll('h2');
                    for (const h2 of h2Elements) {
                        const smallElement = h2.querySelector('small');
                        if (smallElement) {
                            const smallText = smallElement.textContent.trim();
                            const japaneseMatch = smallText.match(/^\(([^)]+)\)$/);
                            if (japaneseMatch && japaneseMatch[1]) {
                                const extractedName = japaneseMatch[1].trim();
                                if (extractedName && extractedName.length > 0) {
                                    japaneseTitle = extractedName;
                                    break;
                                }
                            }
                        }
                    }

                    if (!japaneseTitle) {
                        const characterPatterns = [
                            /<small>\(([^)]+)\)<\/small>/g,
                            /<small[^>]*>\(([^)]+)\)<\/small>/g,
                            /font-weight:\s*normal[^>]*>\s*<small>\(([^)]+)\)<\/small>/g
                        ];
                        
                        for (const pattern of characterPatterns) {
                            pattern.lastIndex = 0;
                            const match = pattern.exec(html);
                            if (match && match[1]) {
                                const extractedName = match[1].trim();
                                if (extractedName && extractedName.length > 0 && !extractedName.includes('<')) {
                                    japaneseTitle = extractedName;
                                    break;
                                }
                            }
                        }
                    }
                }
                else if (contentUrl.includes('/people/')) {
                    let givenName = '';
                    let familyName = '';

                    const darkTextSpans = doc.querySelectorAll('span.dark_text');
                    for (const span of darkTextSpans) {
                        const label = span.textContent.trim();
                        
                        if (label === 'Given name:') {
                            let nextNode = span.nextSibling;
                            while (nextNode && nextNode.nodeType !== Node.TEXT_NODE) {
                                nextNode = nextNode.nextSibling;
                            }
                            if (nextNode && nextNode.textContent) {
                                const text = nextNode.textContent.trim();
                                if (text && text.length > 0 && text.length < 50 && !text.includes('<')) {
                                    givenName = text;
                                }
                            }
                            
                            if (!givenName && span.parentElement) {
                                const parentText = span.parentElement.textContent;
                                const afterLabel = parentText.split('Given name:')[1];
                                if (afterLabel) {
                                    const cleanText = afterLabel.trim();
                                    if (cleanText && cleanText.length < 50 && !cleanText.includes('<')) {
                                        givenName = cleanText;
                                    }
                                }
                            }
                        } else if (label === 'Family name:') {
                            let nextNode = span.nextSibling;
                            while (nextNode && nextNode.nodeType !== Node.TEXT_NODE && nextNode.nodeType !== Node.ELEMENT_NODE) {
                                nextNode = nextNode.nextSibling;
                            }
                            
                            if (nextNode && nextNode.nodeType === Node.TEXT_NODE && nextNode.textContent) {
                                const text = nextNode.textContent.trim();
                                if (text && text.length > 0 && text.length < 30 && !text.includes('<') && !text.includes('div')) {
                                    familyName = text;
                                }
                            }
                            else if (nextNode && nextNode.nodeType === Node.ELEMENT_NODE && nextNode.tagName === 'DIV') {
                                familyName = '';
                            }
                        }
                    }

                    if (!givenName || (familyName === null)) {
                        const givenPatterns = [
                            /Given name:<\/span>\s*([^\n<>]{1,50}?)(?=\s*<\/div>)/g,
                            /Given name:<\/span>\s*([^\n<>]{1,50}?)\s*<\/div>/g,
                            /"dark_text">Given name:<\/span>\s*([^\n<>]{1,50}?)(?=\s*<)/g
                        ];
                        
                        const familyPatterns = [
                            /Family name:<\/span>\s*([^\n<>]{0,30}?)(?=\s*<div)/g,
                            /Family name:<\/span>\s*([^\n<>]{0,30}?)\s*<div/g,
                            /"dark_text">Family name:<\/span>\s*([^\n<>]{0,30}?)(?=\s*<)/g
                        ];
                        
                        if (!givenName) {
                            for (const pattern of givenPatterns) {
                                pattern.lastIndex = 0;
                                const match = pattern.exec(html);
                                if (match && match[1]) {
                                    const text = match[1].trim();
                                    if (text && !text.includes('Alternate') && !text.includes('Birthday')) {
                                        givenName = text;
                                        break;
                                    }
                                }
                            }
                        }
                        
                        if (familyName === null) {
                            for (const pattern of familyPatterns) {
                                pattern.lastIndex = 0;
                                const match = pattern.exec(html);
                                if (match) {
                                    const text = match[1] ? match[1].trim() : '';
                                    if (!text || (text.length > 0 && text.length < 30 && 
                                        !text.includes('Alternate') && !text.includes('Birthday') && 
                                        !text.includes('Website') && !text.includes('Member'))) {
                                        familyName = text;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    if (givenName && (givenName.includes('Given name:') || givenName.includes('Alternate') || givenName.includes('Birthday'))) {
                        givenName = givenName.replace('Given name:', '').trim();
                        if (givenName.includes('Alternate') || givenName.includes('Birthday') || givenName.length > 50) {
                            givenName = '';
                        }
                    }
                    
                    if (familyName && (familyName.includes('Family name:') || familyName.includes('Given name:') || 
                        familyName.includes('Alternate') || familyName.includes('Birthday'))) {
                        familyName = '';
                    }

                    if (familyName && givenName) {
                        japaneseTitle = `${familyName} ${givenName}`;
                    } else if (givenName) {
                        japaneseTitle = givenName;
                    }
                } else {
                    const japaneseElements = doc.querySelectorAll('span');
                    for (const element of japaneseElements) {
                        if (element.textContent.trim() === 'Japanese:') {
                            const parent = element.parentElement;
                            if (parent) {
                                const textContent = parent.textContent.replace('Japanese:', '').trim();
                                if (textContent && textContent !== '') {
                                    japaneseTitle = textContent;
                                    break;
                                }
                            }
                        }
                    }

                    if (!japaneseTitle) {
                        const japaneseMatch = html.match(/<span[^>]*>Japanese:<\/span>\s*([^<]+)/);
                        if (japaneseMatch && japaneseMatch[1] && japaneseMatch[1].trim()) {
                            japaneseTitle = japaneseMatch[1].trim();
                        }
                    }

                    if (!japaneseTitle) {
                        const flexibleMatch = html.match(/Japanese:<\/span>\s*([^\n<]+)/);
                        if (flexibleMatch && flexibleMatch[1] && flexibleMatch[1].trim()) {
                            japaneseTitle = flexibleMatch[1].trim();
                        }
                    }
                }
            } catch (parseError) {
                // Silent error handling
            }

            const dataToStore = {
                title: japaneseTitle,
                timestamp: Date.now()
            };

            titleCache.set(contentUrl, dataToStore);
            unsavedChanges.set(contentUrl, dataToStore);
            manageMemoryCache();

            return japaneseTitle;

        } catch (error) {
            if (retryCount < maxRetries) {
                const delay = 1000 * Math.pow(2, retryCount);
                await new Promise(resolve => setTimeout(resolve, delay));
                return getJapaneseTitle(contentUrl, retryCount + 1);
            }

            const failData = { title: null, timestamp: Date.now() };
            titleCache.set(contentUrl, failData);
            unsavedChanges.set(contentUrl, failData);
            return null;
        }
    }

    function isValidJapaneseTitle(text, originalText, contentType) {
        if (!text || text.trim() === '') return false;
        
        if (containsJapanese(text)) return true;
        
        if (contentType === 'people') {
            if (originalText && text !== originalText) {
                const isOriginalWesternFormat = /^[A-Za-z\s\-'\.]+,\s*[A-Za-z\s\-'\.]+$/.test(originalText.trim());
                const isNewJapaneseFormat = !/,/.test(text.trim()) && text.length > 2;
                
                if (isOriginalWesternFormat && isNewJapaneseFormat) {
                    return true;
                }
            }
        } else if (contentType === 'character') {
            if (originalText && text !== originalText) {
                const isOriginalWesternFormat = /^[A-Za-z\s\-'\.]+,\s*[A-Za-z\s\-'\.]+$/.test(originalText.trim());
                const isNewFormat = text.length > 2 && !/,/.test(text.trim());
                
                if (isOriginalWesternFormat && isNewFormat) {
                    return true;
                }
            }
        } else {
            if (originalText && text !== originalText) {
                const normalizedOriginal = normalizeText(originalText);
                const normalizedNew = normalizeText(text);
                
                if (normalizedNew !== normalizedOriginal && text.length > 2) {
                    return true;
                }
            }
        }
        
        return false;
    }

    function applyStoredTitle(linkElement, targetElement, contentUrl) {
        const storedData = persistentTitles.get(contentUrl);
        if (storedData) {
            const title = typeof storedData === 'string' ? storedData : storedData.title;
            const originalText = targetElement.textContent.trim();
            const contentType = getContentType(contentUrl);
            
            if (title && isValidJapaneseTitle(title, originalText, contentType)) {
                targetElement.textContent = title;
                linkElement.setAttribute('title', title);
                linkElement.setAttribute('data-stored-applied', 'true');
                return true;
            }
        }
        return false;
    }

    async function processContentLink(linkElement) {
        if (processedElements.has(linkElement) || processingElements.has(linkElement)) {
            return;
        }

        processingElements.add(linkElement);

        try {
            const href = linkElement.getAttribute('href');
            if (!href || (!href.includes('/anime/') && !href.includes('/manga/') && !href.includes('/people/') && !href.includes('/character/'))) {
                return;
            }

            let textContent = '';
            let targetElement = null;

            const strongElement = linkElement.querySelector('strong');
            if (strongElement && strongElement.children.length === 0) {
                textContent = strongElement.textContent.trim();
                targetElement = strongElement;
            }
            else {
                const titleSpan = linkElement.querySelector('span.title');
                if (titleSpan && titleSpan.children.length === 0) {
                    textContent = titleSpan.textContent.trim();
                    targetElement = titleSpan;
                }
                else if (linkElement.children.length === 0) {
                    textContent = linkElement.textContent.trim();
                    targetElement = linkElement;
                }
                else if (linkElement.children.length === 1 && linkElement.children[0].tagName === 'STRONG') {
                    textContent = linkElement.textContent.trim();
                    targetElement = linkElement.children[0];
                }
            }

            if (!textContent) {
                return;
            }

            if (!isContentTitle(textContent, href)) {
                return;
            }

            const fullUrl = href.startsWith('http') ? href : `https://myanimelist.net${href}`;
            const appliedStored = applyStoredTitle(linkElement, targetElement, fullUrl);
            const storedData = persistentTitles.get(fullUrl);
            const shouldRefetch = !appliedStored || isDataStale(storedData);

            if (shouldRefetch) {
                try {
                    await new Promise(resolve =>
                        setTimeout(resolve, Math.random() * (CONFIG.DELAY_MAX - CONFIG.DELAY_MIN) + CONFIG.DELAY_MIN)
                    );

                    const originalText = targetElement.textContent.trim();
                    const japaneseTitle = await getJapaneseTitle(fullUrl);
                    const contentType = getContentType(fullUrl);
                    
                    if (japaneseTitle && targetElement && isValidJapaneseTitle(japaneseTitle, originalText, contentType)) {
                        targetElement.textContent = japaneseTitle;
                        linkElement.setAttribute('title', japaneseTitle);
                    }
                } catch (error) {
                    // Silent error handling
                }
            }

            processedElements.add(linkElement);
        } finally {
            processingElements.delete(linkElement);
        }
    }

    function findAndProcessContentLinks() {
        const selectors = [
            'a.hoverinfo_trigger[href*="/anime/"]:not([data-processed])',
            'a[href*="/anime/"] strong:not([data-processed])',
            '.title a[href*="/anime/"]:not([data-processed])',
            '.picSurround + a[href*="/anime/"]:not([data-processed])',
            'a[href*="/anime/"] span.title:not([data-processed])',
            'a[href*="/anime/"]:not([data-processed]):not([href*="/anime.php"]):not([href*="/clubs"]):not([href*="/reviews"])',
            'a.hoverinfo_trigger[href*="/manga/"]:not([data-processed])',
            'a[href*="/manga/"] strong:not([data-processed])',
            '.title a[href*="/manga/"]:not([data-processed])',
            '.picSurround + a[href*="/manga/"]:not([data-processed])',
            'a[href*="/manga/"] span.title:not([data-processed])',
            'a[href*="/manga/"]:not([data-processed]):not([href*="/manga.php"]):not([href*="/clubs"]):not([href*="/reviews"])',
            'a[href*="/people/"]:not([data-processed])',
            'a[href*="/character/"]:not([data-processed])'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);

            elements.forEach(async (element) => {
                let linkElement = element;
                if (element.tagName === 'STRONG' || (element.tagName === 'SPAN' && element.classList.contains('title'))) {
                    linkElement = element.closest('a[href*="/anime/"], a[href*="/manga/"], a[href*="/people/"], a[href*="/character/"]');
                }

                if (!linkElement || linkElement.getAttribute('data-processed')) {
                    return;
                }

                linkElement.setAttribute('data-processed', 'true');
                await processContentLink(linkElement);
            });
        });
    }

    async function initialize() {
        await loadPersistentData();
        setTimeout(findAndProcessContentLinks, 100);
        setTimeout(findAndProcessContentLinks, 1000);
    }

    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;

        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const hasContentLinks = node.querySelectorAll && 
                            (node.querySelectorAll('a[href*="/anime/"]').length > 0 ||
                             node.querySelectorAll('a[href*="/manga/"]').length > 0 ||
                             node.querySelectorAll('a[href*="/people/"]').length > 0 ||
                             node.querySelectorAll('a[href*="/character/"]').length > 0);
                        if (hasContentLinks || 
                            (node.tagName === 'A' && node.href && 
                             (node.href.includes('/anime/') || node.href.includes('/manga/') || 
                              node.href.includes('/people/') || node.href.includes('/character/')))) {
                            shouldProcess = true;
                            break;
                        }
                    }
                }
            }
        });

        if (shouldProcess) {
            setTimeout(findAndProcessContentLinks, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    let currentUrl = window.location.href;
    
    window.addEventListener('popstate', () => {
        setTimeout(findAndProcessContentLinks, 1000);
    });

    setInterval(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            setTimeout(findAndProcessContentLinks, 1000);
        }
    }, 5000);

    initialize();

})();