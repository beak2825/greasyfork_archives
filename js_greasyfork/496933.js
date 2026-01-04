// ==UserScript==
// @name        Blur Adult Website Images
// @namespace   Azazar's Scripts
// @match       *://*/*
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-start
// @license     MIT
// @version     0.4
// @description Automatically blurs images and videos on adult websites
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/496933/Blur%20Adult%20Website%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/496933/Blur%20Adult%20Website%20Images.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BLUR_STYLE = 'img,canvas,image,picture,video,iframe,.userjs-with-background-image {filter:blur(30px) !important}';
    const ADULT_KEYWORDS = [
        'fuck', 'milf', 'anal', 'xnxx', 'bbw', 'cum', 'pussy', 'cunt', 'xhamster', 'redtube',
        'xxx', 'porn', 'squirt', 'swinger', 'xvideos', 'tits', 'hardcore', 'masturbation', 'pornhub',
        'fucking', 'youporn', 'sexy', 'ass', 'gangbang', 'housewife', 'cock', 'orgasm', 'gay',
        'blowjob', 'bisexual', 'cumshot', 'nude', 'seduction', 'pornstar', 'busty', 'threesome',
        'handjob', 'panties', 'naked', 'adult', '2257', 'dmca', 'sexual', 'masturbating', 'hottie',
        'hentai', 'cumshow', 'lesbian', 'brazzers', 'pure18'
    ];
    const ADULT_AD_HOSTS = ['.exosrv.com', '.contentabc.com'];
    const MIN_ADULT_KEYWORDS = 2;

    let blurStyleElement;
    let adultKeywordsDetected = 0;
    let isAdultHost = false;

    function log(...args) {
        // console.log(...args); // Uncomment to enable logging
    }

    function createBlurStyleElement() {
        blurStyleElement = document.createElement('style');
        blurStyleElement.innerHTML = BLUR_STYLE;
    }

    function applyBlur(apply) {
        log('applyBlur', apply);
        if (apply === (blurStyleElement.parentElement !== null)) return;
        apply ? document.head.appendChild(blurStyleElement) : document.head.removeChild(blurStyleElement);
    }

    function initialize() {
        createBlurStyleElement();
        if (isAdultContentDetected()) {
            applyBlur(true);
        }
        registerMenuCommands();
        observeDOMChanges();
    }

    function isAdultContentDetected() {
        if (GM_getValue('noAdultKeywordsDetected') !== true) {
            return true;
        }

        const hostnameParts = location.host.toLowerCase().split(/[\._\-0-9]+/);
        isAdultHost = ADULT_AD_HOSTS.some(host => location.host.endsWith(host)) || 
                      ADULT_KEYWORDS.some(keyword => hostnameParts.some(part => part.includes(keyword)));
        
        if (isAdultHost) {
            log('Adult host detected.');
            return true;
        }

        return false;
    }

    function checkForAdultContent(mutations) {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        processElement(node);
                    }
                });
            } else if (mutation.type === 'attributes') {
                processElement(mutation.target);
            }
        });

        GM_setValue('noAdultKeywordsDetected', adultKeywordsDetected === 0);
        applyBlur(adultKeywordsDetected >= MIN_ADULT_KEYWORDS);
    }

    function processElement(element) {
        if (!element.__checkedForAdultContent) {
            element.__checkedForAdultContent = true;
            const textContent = element.textContent || '';

            if (checkTextForKeywords(textContent)) {
                return;
            }

            if (element.alt) {
                checkTextForKeywords(element.alt);
            }

            if (element.title) {
                checkTextForKeywords(element.title);
            }

            if (element.name === 'keywords' || element.name === 'description') {
                checkTextForKeywords(element.content);
            }
        }
    }

    function checkTextForKeywords(text) {
        const wordMatches = text.match(/\w+/g) || [];

        wordMatches.forEach(word => {
            if (ADULT_KEYWORDS.includes(word.toLowerCase())) {
                log('Adult keyword detected:', word.toLowerCase());
                adultKeywordsDetected++;
            }
        });

        return adultKeywordsDetected >= MIN_ADULT_KEYWORDS;
    }

    function registerMenuCommands() {
        GM_registerMenuCommand("Blur Images", () => {
            adultKeywordsDetected += MIN_ADULT_KEYWORDS;
            applyBlur(true);
        }, "b");

        GM_registerMenuCommand("Disable Blur", () => {
            adultKeywordsDetected = 0;
            applyBlur(false);
        }, "b");
    }

    function observeDOMChanges() {
        const observer = new MutationObserver(checkForAdultContent);
        observer.observe(document, { attributes: true, childList: true, subtree: true });

        document.addEventListener('load', () => checkForAdultContent([{ type: 'childList', addedNodes: [document.body] }]));
        window.addEventListener('load', () => checkForAdultContent([{ type: 'childList', addedNodes: [document.body] }]));
    }

    initialize();
})();
