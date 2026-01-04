// ==UserScript==
// @name         Autocorrect for MDN search
// @namespace    https://shrk.dev/
// @license      MIT; https://opensource.org/license/mit/
// @version      0.1
// @description  Auto-redirects to first suggested result when search result is empty. Define search engine in your browser: https://developer.mozilla.org/en-US/search?q=%s&autocorrect
// @author       qb20nh
// @copyright    2023, qb20nh
// @match        https://developer.mozilla.org/*-*/search?*
// @icon         https://developer.mozilla.org/favicon-48x48.cbbd161b.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478352/Autocorrect%20for%20MDN%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/478352/Autocorrect%20for%20MDN%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const logger = (tag) => (...msg) => console.log(tag, ...msg);

    const log = logger('MDNAC');

    log('loaded');

    if (typeof new URLSearchParams(location.search).get('autocorrect') !== 'string') {
        log('disabled');
    }

    /**
    * Parse the formatted string back to original number using Intl.NumberFormat in a clever way.
    * @author Mike Bostock
    * @see {@link https://observablehq.com/@mbostock/localized-number-parsing|Localized Number Parsing / Mike Bostock | Observable}
    */
    class NumberParser {
        constructor(locale) {
            const format = new Intl.NumberFormat(locale);
            const parts = format.formatToParts(12345.6);
            const numerals = Array.from({ length: 10 }).map((_, i) => format.format(i));
            const index = new Map(numerals.map((d, i) => [d, i]));
            this._group = new RegExp(`[${parts.find(d => d.type === "group").value}]`, "g");
            this._decimal = new RegExp(`[${parts.find(d => d.type === "decimal").value}]`);
            this._numeral = new RegExp(`[${numerals.join("")}]`, "g");
            this._index = d => index.get(d);
        }
        parse(string) {
            return (string = string.trim()
                    .replace(this._group, "")
                    .replace(this._decimal, ".")
                    .replace(this._numeral, this._index)) ? +string : NaN;
        }
    }

    const getCurrentLocale = () => document.documentElement.getAttribute('lang') ?? navigator.language;

    const parser = new NumberParser(getCurrentLocale());

    function forElement(selector, rootNode = document) {
        log('will wait for element', selector, rootNode);
        return new Promise((resolve, reject) => {
            const element = rootNode.querySelector(selector);

            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(mutations => {
                const element = rootNode.querySelector(selector);
                if (element) {
                    log('found');
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(rootNode, {
                childList: true,
                subtree: true
            });
        });
    }


    const runAfterLoad = (fn) => {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('readystatechange', fn, {once: true});
        }
    }

    runAfterLoad(async () => {
        log('DOM loaded');

        const searchResults = await forElement('.search-results');

        const numMatches = [...searchResults.querySelector('p').childNodes].map(node=>node.textContent).filter(s=>/\d+/.test(s)).map(s=>parser.parse(s))[0];

        if (numMatches === 0) {
            log('empty result');
            const suggestion = (await forElement('.search-suggestion-list>li>a', searchResults))?.href;

            if (suggestion) {
                log('redirecting...');
                location.href = suggestion;
            }
        } else {
            log('results are there');
        }
    });

})();