// ==UserScript==
// @name         AO3 Word Count Script
// @namespace    ao3chapterwordcounter
// @version      4.1
// @description  Adds word counts to chapter links on AO3 Chapter Index pages and in Stats on each chapter page.
// @author       Anton Dumov
// @license      MIT
// @match        https://archiveofourown.org/*/navigate
// @match        https://archiveofourown.org/*/chapters/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462103/AO3%20Word%20Count%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/462103/AO3%20Word%20Count%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const uri = location.protocol+'//'+
          location.hostname+
          (location.port?":"+location.port:"")+
          location.pathname+
          (location.search?location.search:"");
    const wordCountRegex = /\s+/g;
    const chapterUrlRegex = new RegExp("https://archiveofourown\\.org/works/\\d+/chapters/\\d+/?");
    const cacheKeyPrefix = "ao3-word-count-cache-";
    const cacheDurationMs = 30 * 24 * 60 * 60 * 1000;

    const getCachedWordCount = link => {
        const cacheKey = cacheKeyPrefix + link.href;
        const cachedValue = localStorage.getItem(cacheKey);
        if (cachedValue) {
            const { timestamp, wordCount } = JSON.parse(cachedValue);
            if (Date.now() - timestamp < cacheDurationMs && wordCount !== 0) {
                return wordCount;
            } else {
                localStorage.removeItem(cacheKey);
            }
        }
        return null;
    };

    const setCachedWordCount = (url, wordCount) => {
        const cacheKey = cacheKeyPrefix + url;
        const cacheValue = JSON.stringify({ timestamp: Date.now(), wordCount });
        localStorage.setItem(cacheKey, cacheValue);
    };

    let fetchInProgress = false;

    const countWords = (doc) => {
        const article = doc.querySelector("div[role=article]");
        return article ? article.textContent.trim().split(wordCountRegex).length : 0;
    };

    const fetchWordCount = async (url) => {
        try {
            if (fetchInProgress) {
                // Wait for the previous request to complete
                await new Promise(resolve => {
                    const interval = setInterval(() => {
                        if (!fetchInProgress) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 2000);
                });
            }
            fetchInProgress = true;

            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            const wordCount = countWords(doc);
            setCachedWordCount(url, wordCount);
            fetchInProgress = false;
            return wordCount;
        } catch (error) {
            console.log(error);
            fetchInProgress = false;
        }
    };

    const getWordCount = async (link, maxWidth, longTitles) => {
        const cachedWordCount = getCachedWordCount(link);
        let wordCount;
        if (cachedWordCount) {
            wordCount = cachedWordCount;
        } else {
            wordCount = await fetchWordCount(link.href);
        }
        const wordCountElement = document.createElement("span");
        wordCountElement.textContent = `(${wordCount} words)`;
        if (!longTitles){
            const spanElement = link.parentElement.querySelector('span.datetime');
            const margin = maxWidth - link.getBoundingClientRect().width + 7;
            wordCountElement.style.marginLeft = `${margin}px`;
            spanElement.parentNode.insertBefore(wordCountElement, spanElement.nextSibling);
        } else {
            link.parentNode.insertBefore(wordCountElement, link);
            link.parentElement.style.paddingLeft = `7.5em`;
            wordCountElement.style.position = 'absolute';
            wordCountElement.style.left = '0';
        }
    };

    if (uri.endsWith("navigate")){
        const chapterLinks = document.querySelectorAll("ol.chapter.index.group li a");

        const parentWidth = chapterLinks[0].parentElement.getBoundingClientRect().width;
        let maxWidth = 0;
        let longTitles = false;

        chapterLinks.forEach(link => {
            const width = link.getBoundingClientRect().width;
            if (width > maxWidth) {
                maxWidth = width;
            }
            if (width + 175 >= parentWidth) {
                longTitles = true;
            }
        });

        chapterLinks.forEach(link => {
            getWordCount(link, maxWidth, longTitles);
        });
    } else if (chapterUrlRegex.test(uri)) {
        const wordsCount = countWords(document);
        const statsElement = document.querySelector('dl.stats');
        const ddElement = document.createElement('dd');
        ddElement.classList.add('chapter-words');
        ddElement.textContent = wordsCount;
        const dtElement = document.createElement('dt');
        dtElement.classList.add('chapter-words');
        dtElement.textContent = 'Chapter Words:';
        statsElement.appendChild(dtElement);
        statsElement.appendChild(ddElement);
        setCachedWordCount(uri, wordsCount);
    }
})();
