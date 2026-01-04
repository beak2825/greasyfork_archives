// ==UserScript==
// @name         Font Replacer
// @version      0.4
// @description  Replaces specified fonts with alternatives across all page elements
// @author       pfzim
// @copyright    2025, pfzim (https://github.com/pfzim/font-replacer)
// @license      GPL-3.0-or-later
// @match        *://*/*
// @grant        none
// @namespace https://openuserjs.org/users/pfzim
// @downloadURL https://update.greasyfork.org/scripts/531118/Font%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/531118/Font%20Replacer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Font replacement settings (format: { "target font": "replacement", ... })

    let fontConfig = [
        {
            "pattern_url": "^http[s]?://[^/]*gitlab\\.com/",
            "replacements": {
                "GitLab": "Verdana",
                "GitLab Sans": "Verdana",
                "GitLab Mono": "Courier New"
            }
        },
        {
            "pattern_url": "^http[s]?://[^/]*market\\.yandex\\.ru/",
            "replacements": {
                "YS Text": "Arial"
            },
            "skip_body": true,
            "skip_observer": true,
            "skip_observer_css": false,
            "skip_styles": false,
            "delay_ms": 0,
            "debug": false
        },
        {
            "pattern_url": ".*",
            "replacements": {
                "Barlow": "Verdana",
                "Geist": "Verdana",
                "Geist Mono": "Courier New",
                "Georgia": "Times New Roman",
                "GitLab Mono": "Courier New",
                "GitLab Sans": "Verdana",
                "Golos Text": "Arial",
                "Golos": "Arial",
                "Google Sans": "Verdana",
                "GothamProRegular": "Verdana",
                "Helvetica": "Verdana",
                "Inter": "Arial",
                "Kaspersky Sans": "Verdana",
                "Lato": "Arial",
                "Lato": "Verdana",
                "Manrope": "Verdana",
                "Metropolis": "Verdana",
                "Museo Sans": "Verdana",
                "Open Sans": "Verdana",
                "Optimistic Display": "Verdana",
                "Optimistic Text": "Verdana",
                "Roboto Mono": "Courier New",
                "Roboto": "Verdana",
                "Segoe UI": "Arial",
                "Source Code Pro": "Courier New",
                "Stolzl": "Verdana",
                "Verdana Neue": "Verdana",
                "ui-sans-serif": "Arial"
            },
            "skip_body": false,
            "skip_observer": false,
            "skip_styles": false,
            "skip_observer_css": false,
            "delay_ms": 0,
            "debug": false
        }
        // Add your custom replacements here
    ];

    let replacement_rule = null;
    let sheet_count = 0;
    let debug = false;

    replacement_rule = getReplacementsForCurrentSite();
    if (replacement_rule && Object.keys(replacement_rule.replacements).length > 0) {
        if (replacement_rule.debug) {
            debug = true;
            console.log('Font Replacer rules:', replacement_rule);
        }
        // Process the entire page
        setTimeout(() => {
            if (!replacement_rule.skip_styles) processAllStyles(document.styleSheets);
            if (!replacement_rule.skip_observer_css) startObserverCSS();
            if (!replacement_rule.skip_body) processAllElements(document.body);
            if (!replacement_rule.skip_observer) startObserver();
        }, replacement_rule.delay_ms || 0);
    }
    else {
        console.log('Font Replacer: disabled for this url or globally!');
    }

    function startObserver() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // Node.ELEMENT_NODE
                        processAllElements(node);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function startObserverCSS() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'STYLE') {
                        if (debug) console.log('Added node <style>:', node);
                        // setTimeout(() => {
                        processSheetStyles(node.sheet);
                        // }, 1000);
                    } else if (node.nodeName === 'LINK' && node.rel === 'stylesheet') {
                        if (debug) console.log('Added CSS file:', node);
                        node.addEventListener('load', () => {
                            try {
                                if (debug) console.log('CSS file loaded');
                                processSheetStyles(node.sheet);

                            } catch (e) {
                                console.warn('Failed access to CSS rules (CORS):', e);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.head, {
            childList: true,
            subtree: true
        });
    }


    function getReplacementsForCurrentSite() {
        const url = window.location.href;
        for (const rule of fontConfig) {
            try {
                const regex = new RegExp(rule.pattern_url);
                if (regex.test(url)) {
                    console.log('Font Replacer: matched pattern: ' + rule.pattern_url);
                    return rule || {};
                }
            } catch (e) {
                console.warn(`Invalid regex pattern: ${rule.pattern_url}`, e);
            }
        }
        return null;
    }

    function parseAndReplaceFonts(fontFamilyString, replacements) {
        const regex = new RegExp(/^(\s*var\s*\()(.*)(\)\s*)$/i);

        const replaceFont = (fontStr) => {
            // console.log('replaceFont: ' + fontStr);

            const matches = fontStr.match(regex)
            if (matches) {
                return matches[1] + parse(matches[2]) + matches[3];
            }
            else {
                let unquotedFont = fontStr;

                unquotedFont = unquotedFont.trim();
                if (unquotedFont.startsWith('"') && unquotedFont.endsWith('"')) {
                    unquotedFont = unquotedFont.slice(1, -1).replace(/\\"/g, '"');
                }
                else if (unquotedFont.startsWith("'") && unquotedFont.endsWith("'")) {
                    unquotedFont = unquotedFont.slice(1, -1).replace(/\\'/g, "'");
                }

                const lowerFont = unquotedFont.toLowerCase();

                for (const [original, replacement] of Object.entries(replacements)) {
                    if (lowerFont === original.toLowerCase()) {
                        return replacement;
                    }
                }
            }
            return fontStr;
        };

        const parse = (str) => {
            // console.log('parse: ' + str);
            let result = '';
            let current = '';
            let inQuotes = false;
            let inFunction = 0;
            let quoteChar = null;

            for (let i = 0; i < str.length; i++) {
                let ch = str[i];

                if (!inQuotes) {
                    if ((ch === '"' || ch === "'")) {
                        inQuotes = true;
                        quoteChar = ch;
                    }
                    else if (ch === '(') {
                        inFunction++;
                    }
                    else if (ch === ')' && inFunction > 0) {
                        inFunction--;
                    }
                    else if (ch === ',' && inFunction === 0) {
                        const processed = replaceFont(current);
                        result += processed + ch;
                        current = '';
                        continue;
                    }
                }
                else {
                    if (ch === quoteChar) {
                        inQuotes = false;
                        quoteChar = null;
                    }
                    else if (ch === '\\') {
                        current += ch;
                        i++;
                        ch = str[i];
                    }
                }

                current += ch;
            }

            if (current) {
                result += replaceFont(current);
            }

            return result;
        };

        return parse(fontFamilyString);
    }

    // Main element processing function
    function processElement(element) {
        const computedStyle = window.getComputedStyle(element);
        const originalFont = computedStyle.fontFamily;

        if (!originalFont) return;

        //const newFont = replaceFonts(originalFont);
        const newFont = parseAndReplaceFonts(originalFont, replacement_rule.replacements)

        if (newFont.toLowerCase() !== originalFont.toLowerCase()) {
            element.style.fontFamily = newFont;
            // Debug logging (commented out):
            if (debug) console.log('Old font: ' + originalFont + '\nNew font: ' + newFont);
        }
    }

    // Recursive function to check all elements
    function processAllElements(node) {
        processElement(node);

        for (let i = 0; i < node.children.length; i++) {
            processAllElements(node.children[i]);
        }
    }

    function processSheetStyles(sheet) {
        try {
            if (debug) {
                console.log('Processing CSS node:', sheet.ownerNode);
                if (!sheet.cssRules) {
                    console.log('CSS rules not accessible - possible CORS issue');
                }
                if (sheet.disabled) {
                    console.log('Stylesheet is currently disabled');
                }
            }
            Array.from(sheet.cssRules || []).forEach(rule => {
                if ((rule instanceof CSSStyleRule) && rule.style) { // not rule instanceof CSSFontFaceRule
                    //console.log('Rule:');
                    // Доступ к свойствам:
                    //console.log('Selector:', rule.selectorText);
                    for (let k = rule.style.length; k--;) {
                        const var_name = rule.style[k];
                        if (var_name.startsWith('--')) {
                            const originalFont = rule.style.getPropertyValue(var_name).trim();
                            const newFont = parseAndReplaceFonts(originalFont, replacement_rule.replacements)

                            if (newFont.toLowerCase() !== originalFont.toLowerCase()) {
                                rule.style.setProperty(var_name, newFont, rule.style.getPropertyPriority(var_name));
                                // Debug logging (commented out):
                                if (debug) console.log('Var: ' + var_name + '\nOld font: ' + originalFont + '\nNew font: ' + newFont);
                            }
                        }
                    }
                    if (rule.style.fontFamily) { // not rule instanceof CSSFontFaceRule
                        // Removes the !important
                        //rule.style.fontFamily = rule.style.fontFamily;
                        // if(rule.style.getPropertyPriority('font-family') === 'important')
                        // rule.style.setProperty('font-family', rule.style.getPropertyValue('font-family'), null);

                        // Replace fonts

                        const originalFont = rule.style.getPropertyValue('font-family').trim();
                        const newFont = parseAndReplaceFonts(originalFont, replacement_rule.replacements)

                        if (newFont.toLowerCase() !== originalFont.toLowerCase()) {
                            rule.style.setProperty('font-family', newFont, rule.style.getPropertyPriority('font-family'));
                            // Debug logging (commented out):
                            if (debug) console.log('Old font: ' + originalFont + '\nNew font: ' + newFont);
                        }
                    }
                }
            });
            sheet_count++;
            if (debug) console.log('Font Replacer: CSS sheets processed: ' + sheet_count + ' (+1)');
        }
        catch (e) {
            console.warn('Font Replacer: Failed access to CSS rules (CORS)', e);
            //console.log('sheet.ownerNode.textContent:', sheet.ownerNode);
        }
    }

    // Recursive function to check all styles
    function processAllStyles(node) {
        if (debug) console.log('Font Replacer: Process all styles...');
        Array.from(node).forEach(sheet => {
            processSheetStyles(sheet);
        });
    }

    // Optional: Add @font-face style to force font replacement (commented out)
    // const style = document.createElement('style');
    // style.textContent = `
    //     * {
    //         font-family: ${Object.values(fontReplacements).join(', ')} !important;
    //     }
    // `;
    // document.head.appendChild(style);

})();
