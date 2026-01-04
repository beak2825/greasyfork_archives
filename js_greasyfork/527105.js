// ==UserScript==
// @name         Block sensitive words
// @namespace    http://tampermonkey.net/
// @version      2025-02-19-v5
// @description  Block sensitive words on a specific news website.
// @author       You
// @match        https://www.index.hr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=index.hr
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527105/Block%20sensitive%20words.user.js
// @updateURL https://update.greasyfork.org/scripts/527105/Block%20sensitive%20words.meta.js
// ==/UserScript==
    
(function() {
    'use strict';

    const sensitiveWords = [
        "magarc",
        "magarac",
        "magare",
        "konj",
        ">mačk",
        " mačk",
        "mačić",
        "mačak",
        "mačj",
        "tovar",
        "životinj",
        "ljubimac",
        "ljubimc",
        "pobio",
        "golub",
        "lutalic",
        "ukrajin",
        "vepar",
        "vepra",
        "veprov",
        "srne",
        "srna",
        "izumrl",
        "tuljan",
        "jež",
        "kornjač",
        "rastrgal",
        "mazga",
        "mazge",
    ];

    const sectionSelectors = [
        ".grid-item",
        ".first-news",
        ".home-related-holder li",
        ".news-item-container",
        ".timeline-content li",
        ".vijesti-text-hover",
        ".sport-text-hover",
        ".magazin-text-hover",
        ".article-holder",
        ".most-read li",
    ];

    const dynamicSections = [
        "body",
        "#personalized-vijesti",
        "#personalized-sport",
        "#personalized-magazin",
        ".left-part",
    ];

    const isSensitive = (text) => sensitiveWords.some(word => text.toLowerCase().includes(word));

    const removeTitle = () => {
        try {
            if (isSensitive(document.title)) {
                document.title = "";
                document.querySelector("#comments-container").innerHTML = "";
            }
        } catch {
            console.error("removeTitle failed");
        }
    };

    const removeUrl = () => {
        try {
            if (isSensitive(document.URL)) {
                window.history.pushState('/', 'Title', '/');
            }
        } catch {
            console.error("removeUrl failed");
        }
    };

    const removeSection = (element) => {
        try {
            if (isSensitive(element.innerHTML)) {
                element.remove();
            }
        } catch (e) {
            console.error("removeSection failed", e, element);
        }
    };
    
    const removeSections = () => {
        try {
            sectionSelectors.forEach(selector => document.querySelectorAll(selector).forEach(el => removeSection(el)));
        } catch {
            console.error("removeSections failed");
        }
    };

    const recalcOrderNumbers = () => {
        try {
            document.querySelectorAll('.most-read span.num').forEach((el, i) => el.innerHTML = (i+1).toString());
        } catch {
            console.error("recalcOrderNumbers failed");
        }
    };

    const setupHeightListeners = () => {
        const resizeObserver = new ResizeObserver(() => triggerCensoring());
        dynamicSections.forEach(dyn => {
            try {
                const elements = document.querySelectorAll(dyn);

                if (elements.length > 0){
                    resizeObserver.observe(elements[0]);
                }
            } catch (e) {
                console.error("setupHeightListeners failed", e, dyn);
            }
        });
    };
    
    const triggerCensoring = () => {
        removeTitle();
        removeUrl();
        removeSections();
        recalcOrderNumbers();
    };
    
    triggerCensoring();
    setupHeightListeners();
})();
