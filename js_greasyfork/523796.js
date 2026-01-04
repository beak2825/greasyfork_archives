// ==UserScript==
// @name        Enhanced Translation
// @namespace   your-namespace
// @description Translate a webpage Translation with built-in AI into your preferred language, making browsing easier and faster.
// @version     1.5
// @author      UniverseDev
// @license     GPL-3.0-or-later
// @match       *://*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/523796/Enhanced%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/523796/Enhanced%20Translation.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const CONFIG = {
        targetLanguage: 'en',
        debugMode: true,
        translationAttribute: 'data-gm-translated',
        excludedElementsSelector: 'code, pre, .notranslate, img, svg, video, audio, kbd, samp, var, math, noscript, script, style',
        translationBatchSize: 250, // Reduced batch size for smoother updates
        dynamicContentDebounceDelay: 300,
        translationQueueDebounceDelay: 100, // Debounce for the translation queue processing
        textContainingElementsSelector: 'p, h1, h2, h3, h4, h5, h6, span, a, div, li, dt, dd, blockquote, th, td, summary, figcaption, label, button, textarea, select, option, sr-only',
        translatableAttributes: ['title', 'placeholder', 'alt', 'aria-label'],
        loadingIndicatorStyle: `
            position: fixed;
            top: 10px;
            left: 10px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 15px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
        `,
        loadingIndicatorText: 'Translating Initial Visible Content...', // Updated initial text
        loadingIndicatorUpdatingText: (translatedCount, queueSize) => `Translating... (${translatedCount} translated, ${queueSize} in queue)`, // More informative
        useIntersectionObserver: true,
        intersectionObserverOptions: {
            rootMargin: '0px',
            threshold: 0.1
        },
        showErrorBanners: false, // Option to disable error banners
        useTurboMode: true, // NEW: Turbo mode for faster translation
    };

    let dynamicContentTimer;
    let translationQueueTimer;
    let pageLanguage;
    let loadingIndicator;
    let translatedElementCount = 0;
    const translationQueue = new Set();
    let isIdleCallbackRunning = false;
    let intersectionObserver;
    let langAttributeObserver;
    const targetLanguageCode = CONFIG.targetLanguage.toLowerCase(); // More descriptive variable name
    const isTrulyVisibleCache = new WeakMap();
    const domManipulationQueue = [];

    // Track active translators and detectors to allow for destruction
    const activeTranslators = new Map();
    const activeDetectors = new Map();

    function logDebug(message, ...args) {
        if (CONFIG.debugMode) {
            console.log(`${new Date().toLocaleTimeString()} - DEBUG: ${message}`, ...args);
        }
    }

    function normalizeLang(lang) {
        return lang ? lang.toLowerCase().split('-')[0] : '';
    }

    function showTranslationError(message) {
        if (CONFIG.showErrorBanners) {
            const errorBanner = document.createElement('div');
            errorBanner.style.cssText = `position: fixed; bottom: 0; width: 100%; background-color: #f44336; color: #fff; text-align: center; padding: 10px; z-index: 9999;`;
            errorBanner.textContent = `Translation Error: ${message}`;
            document.body.appendChild(errorBanner);
            setTimeout(() => errorBanner.remove(), 5000);
        }
        console.error(`Translation Error: ${message}`);
    }

    const isTranslationSupported = (() => {
        try {
            return 'translation' in self && typeof self.translation.createTranslator === 'function';
        } catch (error) {
            console.error("Error checking translation API:", error);
            return false;
        }
    })();

    if (!isTranslationSupported) {
        logDebug("Translation features are unavailable.");
        return;
    }

    let globalLanguageDetector = null;

    async function getLanguageDetector(options = {}) {
        if (globalLanguageDetector) {
            return globalLanguageDetector;
        }
        try {
            const controller = new AbortController();
            const detector = await self.translation.createDetector({ signal: options.signal });
            activeDetectors.set(detector, controller);
            globalLanguageDetector = detector;
            return detector;
        } catch (error) {
            logDebug(`Error creating language detector: ${error.message}`);
            if (error.name !== 'AbortError') {
                showTranslationError(error.message);
            }
            return null;
        }
    }

    async function destroyLanguageDetector() {
        if (globalLanguageDetector) {
            const controller = activeDetectors.get(globalLanguageDetector);
            if (controller) {
                controller.abort();
                activeDetectors.delete(globalLanguageDetector);
            }
            globalLanguageDetector.destroy();
            globalLanguageDetector = null;
            logDebug('Language detector destroyed and resources released.');
        }
    }

    async function detectLanguage(text) { // Centralized language detection
        const detector = await getLanguageDetector();
        if (!detector) return 'unknown';
        try {
            const detectionResult = (await detector.detect(text))[0];
            if (!detectionResult || detectionResult.confidence < 0.5) {
                logDebug(`Detected language uncertain: ${detectionResult?.detectedLanguage}, confidence: ${detectionResult?.confidence}`);
                return 'unknown';
            }
            logDebug(`Detected source language: ${detectionResult.detectedLanguage}, confidence: ${(detectionResult.confidence * 100).toFixed(1)}%`);
            return normalizeLang(detectionResult.detectedLanguage) || 'unknown';
        } catch (error) {
            logDebug(`Language detection error: ${error}`);
            return 'unknown';
        }
    }

    const translatorCache = new Map();

    async function getTranslator(sourceLang, options = {}) {
        const key = `${sourceLang}-${targetLanguageCode}`;
        if (translatorCache.has(key)) {
            return translatorCache.get(key);
        }
        try {
            const controller = new AbortController();
            const translator = await self.translation.createTranslator({
                sourceLanguage: sourceLang,
                targetLanguage: targetLanguageCode,
                signal: options.signal
            });
            activeTranslators.set(translator, controller);
            translatorCache.set(key, translator);
            return translator;
        } catch (error) {
            logDebug(`Error creating translator for ${key}: ${error.message}`);
            if (error.name !== 'AbortError') {
                showTranslationError(error.message);
            }
            return null;
        }
    }

    async function destroyTranslator(translator) {
        if (activeTranslators.has(translator)) {
            const controller = activeTranslators.get(translator);
            controller.abort(); // Abort any ongoing operations
            activeTranslators.delete(translator);
            for (const [key, cachedTranslator] of translatorCache.entries()) {
                if (cachedTranslator === translator) {
                    translatorCache.delete(key);
                    break;
                }
            }
            translator.destroy();
            logDebug('Translator destroyed and resources released.');
        }
    }

    async function destroyAllTranslators() {
        for (const translator of activeTranslators.keys()) {
            await destroyTranslator(translator);
        }
    }

    async function translateContent(text, sourceLang, options = {}) {
        if (!text || text.trim() === '') {
            return text;
        }
        const translator = await getTranslator(sourceLang, { signal: options.signal });
        if (!translator || typeof translator.translate !== 'function') {
            logDebug("Translation API's `translate` method not found or invalid.");
            return text;
        }
        try {
            return await translator.translate(text, { signal: options.signal });
        } catch (error) {
            logDebug(`Error during translation: ${error.message}`);
            if (error.name !== 'AbortError') {
                showTranslationError(error.message);
            }
            return text;
        }
    }

    function isTrulyVisible(element) {
        if (!element) return false;
        if (isTrulyVisibleCache.has(element)) {
            return isTrulyVisibleCache.get(element);
        }
        const style = window.getComputedStyle(element);
        const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0 && element.offsetParent !== null;
        isTrulyVisibleCache.set(element, isVisible);
        return isVisible;
    }

    function queueDOMManipulation(callback) {
        domManipulationQueue.push(callback);
        if (domManipulationQueue.length === 1) {
            requestAnimationFrame(processDOMManipulationQueue);
        }
    }

    function processDOMManipulationQueue() {
        while (domManipulationQueue.length > 0) {
            const callback = domManipulationQueue.shift();
            callback();
        }
    }

    async function translateTextNode(node, sourceLang, options = {}) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            const originalText = node.textContent;
            const translatedText = await translateContent(originalText, sourceLang, options);
            if (translatedText && translatedText !== originalText) {
                queueDOMManipulation(() => {
                    node.textContent = translatedText;
                    logDebug(`Translated text node: "${originalText}" to "${translatedText}"`);
                });
            }
        }
    }

    async function translateAttributes(element, sourceLang, options = {}) {
        let didTranslate = false;
        const translations = {};
        for (const attribute of CONFIG.translatableAttributes) {
            if (element.hasAttribute(attribute)) {
                const originalValue = element.getAttribute(attribute);
                const translatedValue = await translateContent(originalValue, sourceLang, options);
                if (translatedValue && translatedValue !== originalValue) {
                    translations[attribute] = translatedValue;
                    didTranslate = true;
                }
            }
        }
        if (Object.keys(translations).length > 0) {
            queueDOMManipulation(() => {
                for (const attribute in translations) {
                    element.setAttribute(attribute, translations[attribute]);
                    logDebug(`Translated ${attribute}: "${element.getAttribute(attribute)}" to "${translations[attribute]}"`);
                }
            });
        }
        return didTranslate;
    }

    async function translateElementContent(element, sourceLang, options = {}) {
        const textNodePromises = [];
        for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                const originalText = node.textContent;
                const translatedTextPromise = translateContent(originalText, sourceLang, options);
                textNodePromises.push(translatedTextPromise);
                translatedTextPromise.then(translatedText => {
                    if (translatedText && translatedText !== originalText) {
                        queueDOMManipulation(() => {
                            node.textContent = translatedText;
                            logDebug(`Translated text node: "${originalText}" to "${translatedText}"`);
                        });
                    }
                });
            }
        }
        const results = await Promise.all(textNodePromises);
        return results.some(translatedText => translatedText !== undefined);
    }

    function shouldTranslateElement(element) {
        return isTrulyVisible(element) && !element.hasAttribute(CONFIG.translationAttribute);
    }

    async function translateElement(element) {
        if (!shouldTranslateElement(element)) {
            return;
        }

        let needsTranslation = false;
        let sourceLang = pageLanguage;
        const elementLang = normalizeLang(element.closest('[lang]')?.lang);

        if (elementLang && elementLang !== targetLanguageCode) {
            sourceLang = elementLang;
            needsTranslation = true;
            logDebug(`Using element-level language: ${sourceLang} for`, element);
        } else if (!sourceLang) {
            const textToDetect = element.textContent.substring(0, 200);
            if (/\w+/.test(textToDetect)) {
                const detectedLang = await detectLanguage(textToDetect);
                if (detectedLang !== 'unknown' && normalizeLang(detectedLang) !== targetLanguageCode) {
                    sourceLang = detectedLang;
                    needsTranslation = true;
                    logDebug(`Detected element language: ${sourceLang} for`, element);
                } else if (detectedLang === targetLanguageCode) {
                    queueDOMManipulation(() => element.setAttribute(CONFIG.translationAttribute, 'true'));
                    return;
                }
            } else {
                queueDOMManipulation(() => element.setAttribute(CONFIG.translationAttribute, 'true'));
                return;
            }
        } else if (normalizeLang(sourceLang) === targetLanguageCode) {
            queueDOMManipulation(() => element.setAttribute(CONFIG.translationAttribute, 'true'));
            return;
        } else {
            needsTranslation = true;
        }

        let contentTranslated = false;
        let attributesTranslated = false;

        if (needsTranslation) {
            attributesTranslated = await translateAttributes(element, sourceLang);
            contentTranslated = await translateElementContent(element, sourceLang);
        }

        if (needsTranslation && (contentTranslated || attributesTranslated)) {
            queueDOMManipulation(() => {
                element.setAttribute(CONFIG.translationAttribute, 'true');
            });
        }

        translatedElementCount++;
        requestAnimationFrame(() => {
            if (loadingIndicator && typeof CONFIG.loadingIndicatorUpdatingText === 'function') {
                loadingIndicator.textContent = CONFIG.loadingIndicatorUpdatingText(translatedElementCount, translationQueue.size);
            }
        });
    }

    async function processBatch(elements) {
        if (CONFIG.useTurboMode) {
            const translationPromises = elements.map(async (element) => {
                if (isTrulyVisible(element)) {
                    await translateElement(element);
                }
            });
            await Promise.all(translationPromises);
        } else {
            for (const element of elements) {
                if (isTrulyVisible(element)) {
                    await translateElement(element);
                }
            }
        }
    }

    function showLoadingIndicator() {
        loadingIndicator = document.createElement('div');
        loadingIndicator.style.cssText = CONFIG.loadingIndicatorStyle;
        loadingIndicator.textContent = CONFIG.loadingIndicatorText;
        document.body.appendChild(loadingIndicator);
    }

    function hideLoadingIndicator() {
        if (loadingIndicator) {
            loadingIndicator.remove();
            loadingIndicator = null;
            translatedElementCount = 0;
        }
    }

    function queryShadowDOM(root, selector) {
        let elements = Array.from(root.querySelectorAll(selector));
        const shadowHosts = root.querySelectorAll('*');
        shadowHosts.forEach(host => {
            if (host.shadowRoot) {
                elements = elements.concat(Array.from(queryShadowDOM(host.shadowRoot, selector))); // Convert NodeList to Array
            }
        });
        return elements;
    }

    async function translateVisibleContent(elements) {
        const visibleElementsToTranslate = elements.filter(el => isTrulyVisible(el));
        logDebug(`Found ${visibleElementsToTranslate.length} initially visible elements to translate.`);
        for (let i = 0; i < visibleElementsToTranslate.length; i += CONFIG.translationBatchSize) {
            const batch = visibleElementsToTranslate.slice(i, i + CONFIG.translationBatchSize);
            await processBatch(batch);
            await new Promise(resolve => setTimeout(resolve, 0));
        }
        logDebug('Initial visible page content translation completed.');
        hideLoadingIndicator();
    }

    async function translatePageContent() {
        showLoadingIndicator();
        pageLanguage = normalizeLang(document.documentElement.lang) || (await detectLanguage(document.body.innerText.substring(0, 500)));
        logDebug(`Page language: ${pageLanguage}`);
        logDebug(`Preferred language: ${targetLanguageCode}`);
        if (pageLanguage === targetLanguageCode) {
            logDebug('Page is already in the preferred language.');
            hideLoadingIndicator();
            return;
        }

        const elementsToTranslate = queryShadowDOM(document.body, `${CONFIG.textContainingElementsSelector}:not(${CONFIG.excludedElementsSelector}):not([${CONFIG.translationAttribute}])`);
        logDebug(`Found ${elementsToTranslate.length} elements to potentially translate (initial).`);

        if (CONFIG.useIntersectionObserver) {
            initIntersectionObserver();
            elementsToTranslate.forEach(element => {
                if (isTrulyVisible(element)) {
                    intersectionObserver.observe(element);
                }
            });
            logDebug('Observing initially visible elements with IntersectionObserver.');
        } else {
            await translateVisibleContent(elementsToTranslate);
        }
    }

    function enqueueTranslatableElement(element) {
        if (element && !element.matches(CONFIG.excludedElementsSelector) && !element.hasAttribute(CONFIG.translationAttribute) && isTrulyVisible(element)) {
            translationQueue.add(element);
            if (!isIdleCallbackRunning) {
                isIdleCallbackRunning = true;
                translationQueueTimer = setTimeout(processTranslationQueue, CONFIG.translationQueueDebounceDelay);
            }
        }
    }

    async function processTranslationQueue() {
        isIdleCallbackRunning = false;
        const elementsToProcess = Array.from(translationQueue);
        translationQueue.clear();
        if (CONFIG.useTurboMode) {
            await Promise.all(elementsToProcess.map(translateElement));
        } else {
            for (const element of elementsToProcess) {
                await translateElement(element);
            }
        }
    }

    function initIntersectionObserver() {
        intersectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (!element.hasAttribute(CONFIG.translationAttribute)) { // Ensure it hasn't been translated while waiting
                        enqueueTranslatableElement(element);
                    }
                    observer.unobserve(element); // Disconnect after enqueuing for translation
                }
            });
        }, CONFIG.intersectionObserverOptions);
        logDebug('IntersectionObserver initialized.');
    }

    async function translateAddedNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (CONFIG.useIntersectionObserver) {
                if (shouldTranslateElement(node)) {
                    intersectionObserver.observe(node);
                }
            } else if (isTrulyVisible(node)) {
                enqueueTranslatableElement(node);
            }

            if (node.shadowRoot) {
                const shadowElements = queryShadowDOM(node.shadowRoot, `*:not(${CONFIG.excludedElementsSelector}):not([${CONFIG.translationAttribute}])`);
                shadowElements.forEach(el => {
                    if (CONFIG.useIntersectionObserver && isTrulyVisible(el)) {
                        intersectionObserver.observe(el);
                    } else if (!CONFIG.useIntersectionObserver && isTrulyVisible(el)) {
                        enqueueTranslatableElement(el);
                    }
                });
            }

            node.querySelectorAll(`*:not(${CONFIG.excludedElementsSelector}):not([${CONFIG.translationAttribute}])`).forEach(child => {
                if (CONFIG.useIntersectionObserver && isTrulyVisible(child)) {
                    intersectionObserver.observe(child);
                } else if (!CONFIG.useIntersectionObserver && isTrulyVisible(child)) {
                    enqueueTranslatableElement(child);
                }
            });
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() && node.parentElement) {
            if (CONFIG.useIntersectionObserver && isTrulyVisible(node.parentElement)) {
                intersectionObserver.observe(node.parentElement);
            } else if (!CONFIG.useIntersectionObserver && isTrulyVisible(node.parentElement)) {
                enqueueTranslatableElement(node.parentElement);
            }
        }
    }

    async function handleChildListMutation(mutation) {
        for (const addedNode of mutation.addedNodes) {
            await translateAddedNode(addedNode);
        }
    }

    async function handleCharacterDataMutation(mutation) {
        if (mutation.target.parentNode && isTrulyVisible(mutation.target.parentNode)) {
            enqueueTranslatableElement(mutation.target.parentNode);
        }
    }

    async function handleAttributeMutation(mutation) {
        if (mutation.target instanceof Element && CONFIG.translatableAttributes.includes(mutation.attributeName)) {
            if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
                isTrulyVisibleCache.delete(mutation.target);
            }
            if (isTrulyVisible(mutation.target)) {
                enqueueTranslatableElement(mutation.target);
            }
        }
    }

    async function translateDynamicContent(mutationsList) {
        for (const mutation of mutationsList) {
            switch (mutation.type) {
                case 'childList':
                    await handleChildListMutation(mutation);
                    break;
                case 'characterData':
                    await handleCharacterDataMutation(mutation);
                    break;
                case 'attributes':
                    await handleAttributeMutation(mutation);
                    break;
            }
        }
    }

    function observeDynamicContent() {
        const observer = new MutationObserver(async (mutationsList) => {
            if (mutationsList.length > 0) {
                clearTimeout(dynamicContentTimer);
                dynamicContentTimer = setTimeout(() => {
                    translateDynamicContent(mutationsList);
                }, CONFIG.dynamicContentDebounceDelay);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributeFilter: CONFIG.translatableAttributes.concat(['style', 'class']),
            attributes: true,
        });
        logDebug('MutationObserver initialized for dynamic content.');
    }

    function initLangAttributeObserver() {
        langAttributeObserver = new MutationObserver(mutationsList => {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
                    const element = mutation.target;
                    logDebug(`'lang' attribute changed on:`, element);
                    element.removeAttribute(CONFIG.translationAttribute);
                    if (isTrulyVisible(element)) {
                        enqueueTranslatableElement(element);
                    }
                }
            });
        });
        langAttributeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['lang'],
            subtree: true
        });
        logDebug('Lang attribute observer initialized.');
    }

    // Global cleanup function to destroy resources
    async function cleanup() {
        logDebug('Cleaning up translation resources...');
        await destroyAllTranslators();
        await destroyLanguageDetector();
        if (intersectionObserver) {
            intersectionObserver.disconnect();
        }
        if (langAttributeObserver) {
            langAttributeObserver.disconnect();
        }
        // Optionally disconnect the dynamic content observer if you keep a reference to it.
        logDebug('Translation resources cleaned up.');
    }

    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('unload', cleanup);

    window.addEventListener('load', async () => {
        if (isTranslationSupported) {
            await translatePageContent();
            observeDynamicContent();
            initLangAttributeObserver();
        }
    });
})();