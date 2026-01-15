// ==UserScript==
// @name         Zendesk Red Word and Tags Highlighter Fuse
// @namespace    http://tampermonkey.net/
// @version      10.2
// @description  Highlights predefined red words in Zendesk dynamically with specific scopes and provides a management menu.
// @author       Swiftlyx
// @match        https://*.zendesk.com/agent/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.min.js
// @downloadURL https://update.greasyfork.org/scripts/524217/Zendesk%20Red%20Word%20and%20Tags%20Highlighter%20Fuse.user.js
// @updateURL https://update.greasyfork.org/scripts/524217/Zendesk%20Red%20Word%20and%20Tags%20Highlighter%20Fuse.meta.js
// ==/UserScript==

/* global Fuse */

(function () {
    'use strict';

    /**
     * Utilities
     */
    const Utils = {
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        createGlobalTooltip() {
            const tooltip = document.createElement('div');
            tooltip.id = 'fuzzy-global-tooltip';
            tooltip.className = 'fuzzy-tooltip';
            document.body.appendChild(tooltip);
            return tooltip;
        }
    };

    /**
     * Configuration Management
     */
    class ConfigManager {
        constructor() {
            this.redWords = this.loadAndMergeRedWords();
            this.specialTags = this.loadAndMergeSpecialTags();
            this.fuzzyThreshold = GM_getValue('fuzzyThreshold', 0.3);
            this.maxTextLength = GM_getValue('maxTextLength', 100);
            this.checkOnlyCustomerMessages = GM_getValue('checkOnlyCustomerMessages', false);
            this.menuPosition = GM_getValue('menuPosition', { top: 10, left: 10 });
        }

        loadAndMergeRedWords() {
            const defaults = this.getDefaultRedWords();
            const stored = GM_getValue('redWords', null);

            if (!stored) return defaults;

            let modified = false;

            Object.keys(defaults).forEach(key => {
                if (!stored[key]) {
                    stored[key] = defaults[key];
                    modified = true;
                } else {
                    const existingWords = new Set(stored[key].words);
                    let wordsAdded = false;
                    defaults[key].words.forEach(defWord => {
                        if (!existingWords.has(defWord)) {
                            stored[key].words.push(defWord);
                            wordsAdded = true;
                        }
                    });

                    if (wordsAdded) modified = true;
                }
            });

            const ordered = {};
            Object.keys(defaults).forEach(key => {
                if (stored[key]) {
                    ordered[key] = stored[key];
                    delete stored[key];
                }
            });
            Object.keys(stored).forEach(key => {
                ordered[key] = stored[key];
            });

            if (modified) GM_setValue('redWords', ordered);
            return ordered;
        }

        loadAndMergeSpecialTags() {
            const defaults = this.getDefaultSpecialTags();
            const stored = GM_getValue('specialTags', null);

            if (!stored) return defaults;

            let modified = false;
            defaults.forEach(defaultTag => {
                const existingIndex = stored.findIndex(s => s.tag === defaultTag.tag);
                if (existingIndex === -1) {
                    stored.push(defaultTag);
                    modified = true;
                } else {
                }
            });

            if (modified) GM_setValue('specialTags', stored);
            return stored;
        }

        getDefaultRedWords() {
            return {
                Cancel: {
                    words: [
                        "cancel", "cancel the subscription", "cancel the membership", "cancel the account",
                        "unsubscribe", "deactivate", "stop", "do not charge my account", "unbill me",
                        "withdraw from my contract", "put a stop on future payments with PayPal",
                        "there better NOT be Any Charges to me at all under any circumstances",
                        "stop charging my card", "revert the month extension", "I have cancelled future payments",
                        "I don't want to pay for this service", "I don't want this charge on my account",
                        "I do not want this service", "I don't want to join anything", "I do not want to sign up",
                        "I'm not going to join", "delete my subscription", "freeze out", "suspend", "terminate the contact",
                        "cancel bill", "terminate service", "stop payment", "you are not entitled to deduct my money",
                        "I didn't authorize this payment", "I never agreed to pay", "you charged me without my permission",
                        "you tried to charge me", "no permission to withdraw money", "an undue amount was charged"
                    ],
                    active: true,
                },
                Refund: {
                    words: [
                        "refunded", "reversed", "returned", "reimbursed", "credited", "refund", "reimburse",
                        "reimbursement", "return my money", "cancel the charge", "cancel the transaction",
                        "cancel the payment", "cancel the fee", "cancel the order", "give my money back",
                        "want my money back", "want to receive my money back", "reverse the charge",
                        "remove the charge", "get rid of the charge", "redeem the charge", "send my money back",
                        "credit me", "credit the charge", "credit the card", "will I get a refund",
                        "I want my returns", "remit", "withdraw the charge", "I should be fully refunded",
                        "cancel debit", "adjust the payment", "adjust the charge", "adjust the transaction",
                        "adjust the fee", "adjust the order", "money back", "cancel purchase", "retract this charge",
                        "repay", "the charge termination", "you pretended to be", "disguising yourself",
                        "subscription is misleading", "I was conned", "you deceived me", "you have fooled me",
                        "I got tricked by you", "I was tricked into your sub", "led to believe you are",
                        "I've been duped", "I was misguided", "I was bamboozled", "I feel taken advantage of",
                        "the price was not disclosed truthfully", "you shafted me", "deceptive practice",
                        "this was hidden trap", "to deceive the consumer", "bait", "that is not fair", "deception",
                        "repay what you have cheated", "false advertising", "owe me", "hoax", "rip off",
                        "I was rooked", "robbers", "robbery", "rob", "cheat", "cheaters", "thieves", "charlatan",
                        "deceivers", "crooks", "impostor", "bogus", "rascals", "deceiver", "scam", "scammer",
                        "con", "con artists", "illegal", "stole my money", "crime", "abuse", "elder abuse",
                        "deceit", "swindled",
                    ],
                    active: true,
                },
                Chargeback: {
                    words: [
                        "a chargeback", "request a chargeback", "open a chargeback", "file a chargeback",
                        "raise a chargeback", "create a chargeback", "initiate a chargeback", "submit a chargeback",
                        "going to chargeback", "ask the bank to chargeback", "dispute", "want to dispute",
                        "file a dispute", "dispute a charge", "dispute a transaction", "dispute a payment",
                        "dispute a fee", "dispute an order", "intend to dispute", "submit a dispute",
                        "disputing", "disputed", "bank", "credit card company", "contact the bank",
                        "report to MasterCard", "report to American Express", "report to Discover", "report",
                        "report to PayPal", "report to ApplePay", "report to GooglePlay", "report to GooglePay",
                        "call the bank", "inform the bank", "set up withdrawal by the bank", "cancel through the bank",
                        "appeal to the bank", "my bank informed me", "blocked my card", "block these charges",
                        "reject these charges", "the charge is being challenged", "protest your charge", "chargeback",
                        "contest the charge", "file a complaint", "lodge a complaint", "make a complaint",
                        "legal action", "take legal action", "proceed with legal action", "bring legal action",
                        "I will take further action", "I will escalate this further", "exhaust all legal remedies",
                        "go to justice", "adjudicate this charge", "pursue this matter", "this was done unlawfully",
                        "lawyer", "advocate", "attorney", "attorney general", "barrister", "jurist", "counselor",
                        "contact my lawyer", "call my lawyer", "inform my lawyer", "ombudsman", "lawsuit", "sue you",
                        "file a lawsuit", "going to sue you", "subpoena", "filing suit", "litigation", "legal papers",
                        "legal notice", "motion", "indictment", "court", "go into court", "see you in court",
                        "prosecute you", "I'm prosecuting you", "damages", "restitution", "BBB", "Better Business Bureau",
                        "FTC", "Federal Trade Commission", "FBI", "Federal Bureau of Investigation", "Interpol",
                        "European Commission", "European Consumer Rights", "bar association", "file a claim",
                        "demand letter", "cease and desist", "police", "the authority", "authorities", "fraud department",
                        "going to report you", "escalate", "this infringes on consumer rights", "fraud", "fraudulent"
                    ],
                    active: true,
                },
                Account_Deletion: {
                    words: [
                        "cancel account", "remove account", "deactivate account", "erase account", "close account",
                        "take me off your system", "take me off your record", "terminate my account",
                        "revoke access to account", "disable account", "delete account",
                        "I need my data purged from your site", "delete my info", "delete my card details",
                        "get my information off of your site", "get my card info off your site", "destroy my information",
                        "revoke access to the card", "remove my card details", "erase the card details",
                        "delete bank details", "remove bank details", "delete the card", "remove the card",
                        "erase the card", "cut my card off", "delete my card", "delete my account", "delete my profile"
                    ],
                    active: true,
                    color: '#2196F3' // Blue
                },
                Tags: {
                    words: ["partial_refund", "full_refund", "refund_form_sent", "refund_form_filled", "s_form_sent", "s_form_filled"],
                    active: true,
                },
            };
        }

        getDefaultSpecialTags() {
            return [
                { tag: 'pdfaid_ticket', className: 'pdfaid_ticket', active: true, color: '#F44336' }, // Red
                { tag: 'manual_processing_is_required', className: 'manual_processing_is_required', active: true, color: '#9C27B0' }, // Purple
                { tag: 's_refund_rejected', className: 's_refund_rejected', active: true, color: '#F44336' }, // Red
                { tag: 'pdfhouse_ticket', className: 'pdfhouse_ticket', active: true, color: '#3F51B5' }, // Indigo
                { tag: 'chat_review', className: 'chat_review', active: true, color: '#4CAF50' }, // Green
                { tag: 'howlydocs_ticket', className: 'howlydocs_ticket', active: true, color: '#2196F3' }, // Blue
                { tag: 'retention_flow', className: 'retention_flow', active: true, color: '#FFC107' }, // Amber
                { tag: 'manual_retention_flow', className: 'manual_retention_flow', active: true, color: '#FFC107' }, // Amber
                { tag: 'refund_rejection', className: 'refund_rejection', active: true, color: '#F44336' } // Red
            ];
        }

        saveRedWords() {
            GM_setValue('redWords', this.redWords);
        }

        saveSpecialTags() {
            GM_setValue('specialTags', this.specialTags);
        }

        setFuzzyThreshold(value) {
            this.fuzzyThreshold = value;
            GM_setValue('fuzzyThreshold', value);
        }

        setMaxTextLength(value) {
            this.maxTextLength = value;
            GM_setValue('maxTextLength', value);
        }

        setCheckOnlyCustomerMessages(value) {
            this.checkOnlyCustomerMessages = value;
            GM_setValue('checkOnlyCustomerMessages', value);
        }

        setMenuPosition(pos) {
            this.menuPosition = pos;
            GM_setValue('menuPosition', pos);
        }
    }

    /**
     * Style Management
     */
    class StyleManager {
        constructor(config) {
            this.config = config;
            this.injectBaseStyles();
        }

        injectBaseStyles() {
            GM_addStyle(`
                .highlight { border-radius: 3px; padding: 0 3px; cursor: pointer; }
                .highlight.tags { background-color: #219ebc; }
                #red-word-menu {
                    position: fixed; z-index: 10000; background: white; border: 1px solid #ccc;
                    padding: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2); resize: both;
                    overflow: hidden; display: none; min-width: 300px; min-height: 200px;
                    max-height: 85vh; flex-direction: column;
                }
                #red-word-menu-content-wrapper { flex-grow: 1; overflow-y: auto; overflow-x: hidden; padding-right: 5px; }
                #red-word-menu-header {
                    font-size: 18px; font-weight: bold; margin-bottom: 10px; cursor: grab;
                    background: #f8f8f8; padding: 5px; border-bottom: 1px solid #ccc;
                }
                #red-word-menu button { margin: 2px 5px; padding: 3px 6px; font-size: 12px; cursor: pointer; }
                #red-word-menu .category {
                    margin-top: 10px; font-weight: bold; padding: 8px; border: 1px solid #ccc;
                    border-radius: 3px; cursor: pointer; opacity: 0.85 !important;
                    transition: opacity 0.5s ease; justify-content: space-between; align-items: center;
                }
                #red-word-menu .category .button-container { display: inline-flex; gap: 5px; align-items: center; }
                #red-word-menu .category button {
                    margin-left: 5px; background: white; opacity: 1 !important;
                    border: 1px solid #ccc; border-radius: 3px; padding: 3px 6px; font-size: 12px;
                }
                #red-word-menu .category button:hover { background: #f0f0f0; }
                #red-word-menu ul { list-style-type: none; padding-left: 0; display: none; }
                #red-word-menu ul.active { display: block; }
                .highlight.dragging { opacity: 0.5; }

                .add-word-btn, .category-toggle, #add-special-tag, #toggle-customer-filter,
                #red-word-menu button[data-action], #create-category {
                    background: #f8f8f8; border: 1px solid #ccc; border-radius: 3px; cursor: pointer; font-size: 12px;
                }
                #create-category { background: #4CAF50; color: white; border: none; padding: 8px; margin: 10px 0; }
                #create-category:hover { background: #45a049; }
                .highlight.fuzzy-match { cursor: help; }
                .fuzzy-tooltip {
                    position: fixed; background: white; border: 1px solid #ccc; padding: 5px 8px;
                    border-radius: 4px; font-size: 12px; z-index: 99999;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2); pointer-events: none; display: none; color: black;
                }
                .highlight.fuzzy-match:hover .fuzzy-tooltip { display: block; }
                .fuzzy-settings { padding: 10px; margin: 10px 0; background: #f8f8f8; border: 1px solid #ccc; border-radius: 4px; }
                .fuzzy-settings label { display: block; margin-bottom: 5px; font-weight: bold; }
                .fuzzy-settings .slider-container { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
                .fuzzy-settings input[type="range"], .fuzzy-settings input[type="number"] { flex-grow: 1; }
                .fuzzy-settings .value-display { min-width: 60px; text-align: right; }
                #red-word-menu .special-tag-item {
                    margin: 3px 0; padding: 3px; border: 1px solid #ccc; border-radius: 3px;
                    cursor: pointer; opacity: 0.85; transition: opacity 0.3s ease; display: flex; align-items: center;
                }
                #red-word-menu .special-tag-item:hover { opacity: 1; }
                #red-word-menu .special-tag-item .button-container { display: inline-flex; gap: 5px; align-items: center; }
                #red-word-menu .special-tag-item button { margin-left: 5px; background: white; }
                #red-word-menu ul li { padding: 3px 5px; font-size: 12px; cursor: pointer; transition: background 0.3s; }
                #red-word-menu ul li:hover { background-color: #f0f0f0; border-radius: 3px; }
            `);
        }

        applyCategoryStyles() {
            Object.keys(this.config.redWords).forEach(category => {
                const className = category.toLowerCase();
                const existingStyle = document.querySelector(`style[data-category="${className}"]`);
                if (existingStyle) existingStyle.remove();

                const style = document.createElement('style');
                style.setAttribute('data-category', className);
                const wordData = this.config.redWords[category];
                let color;

                if (wordData.active) {
                    if (wordData.color) {
                        color = wordData.color;
                    } else {
                        // Default colors if not set
                        switch (className) {
                            case 'cancel': color = '#ffea00'; break;
                            case 'refund': color = '#fb8500'; break;
                            case 'chargeback': color = '#dc2f02'; break;
                            case 'tags': color = '#219ebc'; break;
                            default: color = '#a8dadc';
                        }
                        wordData.color = color; // Save default back if needed
                    }
                } else {
                    color = 'transparent';
                }

                style.textContent = `
                    .highlight.${className} { background-color: ${color} !important; }
                    #red-word-menu .category[data-category="${category}"] {
                        background-color: ${wordData.active ? color : '#f0f0f0'};
                        opacity: 0.95 !important;
                    }
                    #red-word-menu .category[data-category="${category}"]:hover { opacity: 1 !important; }
                `;
                document.head.appendChild(style);
            });
            this.config.saveRedWords();
        }

        applySpecialTagStyles() {
            document.querySelectorAll('style[data-special-tag]').forEach(style => style.remove());
            this.config.specialTags.forEach(({ tag, className, active, color }) => {
                const style = document.createElement('style');
                style.setAttribute('data-special-tag', className);
                const tagColor = active ? (color || '#9ef01a') : 'transparent';
                style.textContent = `
                    .highlight.${className} { background-color: ${tagColor} !important; }
                    #specialTags-words .special-tag-item[data-tag="${tag}"] {
                        background-color: ${active ? tagColor : '#f0f0f0'} !important;
                    }
                `;
                document.head.appendChild(style);
            });
        }
    }

    /**
     * Search Engine
     */
    class SearchEngine {
        constructor(config) {
            this.config = config;
            this.fuseInstances = {};
            this.searchCache = new Map();
            this.CACHE_LIMIT = 1000;
            this.regexPatterns = {};
        }

        initialize() {
            this.updatePatterns();
            this.updateFuseInstances();
        }

        updatePatterns() {
            this.regexPatterns = Object.keys(this.config.redWords).reduce((patterns, category) => {
                const data = this.config.redWords[category];
                if (data.active && data.words.length > 0) {
                    patterns[category] = new RegExp(
                        `(${data.words.map(word => word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})`,
                        'gi'
                    );
                } else if (data.active) {
                    patterns[category] = new RegExp('(?!)', 'gi');
                }
                return patterns;
            }, {});
        }

        updateFuseInstances() {
            Object.keys(this.config.redWords).forEach(category => {
                if (category !== 'Tags') {
                    this.fuseInstances[category] = new Fuse(this.config.redWords[category].words, {
                        includeScore: true,
                        threshold: this.config.fuzzyThreshold,
                        minMatchCharLength: 3,
                        distance: 100,
                        ignoreLocation: true,
                        findAllMatches: true,
                        shouldSort: true,
                        location: 0
                    });
                }
            });
        }

        createCacheKey(text, category) {
            return `${text}|${category}|${this.config.fuzzyThreshold}`;
        }

        cleanCache() {
            if (this.searchCache.size > this.CACHE_LIMIT) {
                const keysToDelete = Array.from(this.searchCache.keys())
                    .slice(0, this.searchCache.size - this.CACHE_LIMIT);
                keysToDelete.forEach(key => this.searchCache.delete(key));
            }
        }

        getFuzzyMatches(text, category) {
            if (!this.fuseInstances[category]) return [];
            if (text.length > this.config.maxTextLength) return [];
            if (text.length < 3) return [];

            const cacheKey = this.createCacheKey(text, category);
            if (this.searchCache.has(cacheKey)) {
                return this.searchCache.get(cacheKey);
            }

            let results = [];

            // Logic for short vs long words matches
            if (text.length <= 5) {
                results = this.fuseInstances[category].search(text)
                    .filter(result => {
                        const shortWordThreshold = this.config.fuzzyThreshold * 1.5;

                        // Stricter length check for short words to prevent "use" -> "abuse" (3 vs 5)
                        // If text is 3 chars, max length diff should be 1 (matches 2, 3, 4 chars)
                        // If text is 4-5 chars, max length diff can be 2
                        const maxLenDiff = text.length <= 3 ? 1 : 2;

                        return result.score < shortWordThreshold &&
                            !this.isCommonWord(text) &&
                            Math.abs(result.item.length - text.length) <= maxLenDiff;
                    });
            } else {
                results = this.fuseInstances[category].search(text)
                    .filter(result => {
                        const lengthRatio = Math.min(text.length, result.item.length) /
                            Math.max(text.length, result.item.length);
                        return result.score < this.config.fuzzyThreshold &&
                            lengthRatio > 0.6 &&
                            !this.isPartialMatch(text, result.item);
                    });
            }

            const mappedResults = results.map(result => ({
                word: result.item,
                score: result.score,
                confidence: ((1 - result.score) * 100).toFixed(1)
            }));

            this.searchCache.set(cacheKey, mappedResults);
            this.cleanCache();
            return mappedResults;
        }

        findPhraseMatches(text, category) {
            const matches = [];
            const normalizedText = text.toLowerCase();
            this.config.redWords[category].words.forEach(word => {
                if (word.includes(' ')) {
                    const normalizedWord = word.toLowerCase();
                    let index = normalizedText.indexOf(normalizedWord);
                    while (index !== -1) {
                        matches.push({
                            text: text.substr(index, word.length),
                            index: index,
                            length: word.length,
                            category,
                            fuzzy: false,
                            matchedWord: word,
                            confidence: "100.0",
                            priority: 1
                        });
                        index = normalizedText.indexOf(normalizedWord, index + 1);
                    }
                }
            });
            return matches;
        }

        isCommonWord(word) {
            const commonWords = [
                'all', 'not', 'the', 'and', 'but', 'for', 'was', 'is', 'are', 'be',
                'use', 'can', 'will', 'has', 'had', 'have', 'that', 'this', 'from',
                'with', 'you', 'your', 'his', 'her', 'they', 'them', 'who', 'what'
            ];
            return commonWords.includes(word.toLowerCase());
        }

        isPartialMatch(text, word) {
            if (text.length < word.length && word.toLowerCase().includes(text.toLowerCase())) return true;
            if (text.length <= 4 && word.length > text.length * 1.5) return true;
            return false;
        }

        clearCache() {
            this.searchCache.clear();
        }
    }

    /**
     * Highlighter
     */
    class Highlighter {
        constructor(config, searchEngine) {
            this.config = config;
            this.searchEngine = searchEngine;
        }

        processDOM(node) {
            if (!node) return;
            const allowedCategories = Object.keys(this.config.redWords);
            if (node.nodeType === Node.TEXT_NODE) {
                this.highlightText(node, allowedCategories);
            } else if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('highlight')) {
                node.childNodes.forEach(child => this.processDOM(child));
            }
        }

        highlightText(node, allowedCategories) {
            if (!node || node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) return;

            const text = node.textContent;
            let parent = node.parentNode;
            if (parent && parent.classList && parent.classList.contains('highlight')) return;
            if (text.length > this.config.maxTextLength) return;

            let allPotentialMatches = [];
            let matchedRanges = [];
            let matches = [];

            allowedCategories.forEach(category => {
                if (category !== 'Tags' && this.config.redWords[category]?.active) {
                    const phraseMatches = this.searchEngine.findPhraseMatches(text, category);
                    allPotentialMatches.push(...phraseMatches);
                }
            });

            const words = text.split(/\s+/);
            words.forEach(word => {
                if (word.length >= 3) {
                    const wordIndex = text.indexOf(word);
                    allowedCategories.forEach(category => {
                        if (category !== 'Tags' && this.config.redWords[category]?.active) {
                            const fuzzyMatches = this.searchEngine.getFuzzyMatches(word, category);
                            if (fuzzyMatches.length > 0) {
                                allPotentialMatches.push({
                                    text: word, index: wordIndex, length: word.length,
                                    category, fuzzy: true, matchedWord: fuzzyMatches[0].word,
                                    confidence: fuzzyMatches[0].confidence, priority: 2
                                });
                            }
                        }
                    });
                }
            });

            allPotentialMatches.sort((a, b) => (a.index === b.index) ? (a.priority - b.priority) : (a.index - b.index));

            allPotentialMatches.forEach(match => {
                if (!this.isRangeOverlapping(matchedRanges, match.index, match.index + match.length)) {
                    matches.push(match);
                    matchedRanges.push([match.index, match.index + match.length]);
                }
            });

            if (matches.length > 0) {
                this.applyHighlights(node, text, matches);
            }
        }

        applyHighlights(node, text, matches) {
            let newHTML = '';
            let lastIndex = 0;
            matches.forEach(match => {
                if (match.index > lastIndex) newHTML += text.substring(lastIndex, match.index);
                const className = match.category.toLowerCase();
                const fuzzyClass = match.fuzzy ? ' fuzzy-match' : '';
                newHTML += `<span class="highlight ${className}${fuzzyClass}"
                                   data-category="${match.category}"
                                   ${match.fuzzy ? `data-matched-word="${match.matchedWord}"` : ''}
                                   ${match.fuzzy ? `data-confidence="${match.confidence}"` : ''}>${match.text}</span>`;
                lastIndex = match.index + match.length;
            });
            if (lastIndex < text.length) newHTML += text.substring(lastIndex);

            if (newHTML !== text) {
                const wrapper = document.createElement('span');
                wrapper.innerHTML = newHTML;
                node.parentNode.replaceChild(wrapper, node);
            }
        }

        isRangeOverlapping(ranges, start, end) {
            return ranges.some(([rangeStart, rangeEnd]) =>
                (start >= rangeStart && start < rangeEnd) ||
                (end > rangeStart && end <= rangeEnd) ||
                (start <= rangeStart && end >= rangeEnd)
            );
        }

        processTags() {
            const tagSections = document.querySelectorAll('[data-garden-id="tags.tag_view"]');
            tagSections.forEach(wrapper => {
                const spans = wrapper.querySelectorAll('span');
                const tagsPattern = this.searchEngine.regexPatterns.Tags;
                spans.forEach(span => {
                    if (tagsPattern && tagsPattern.test(span.textContent)) {
                        span.classList.add('highlight', 'tags');
                    }
                });
                const allText = Array.from(spans).map(span => span.textContent).join(' ');
                if (tagsPattern && tagsPattern.test(allText) && !wrapper.classList.contains('highlight')) {
                    wrapper.classList.add('highlight', 'tags');
                }
            });
        }

        processChatSections() {
            const chatSections = document.querySelectorAll('[data-test-id="omni-log-message-content"]');
            chatSections.forEach(section => {
                const messageContainer = section.closest('[data-test-id="omni-log-item-message"]');
                if (messageContainer) {
                    const isCustomerMessage = messageContainer.getAttribute('type') === 'end-user';
                    if (!this.config.checkOnlyCustomerMessages || (this.config.checkOnlyCustomerMessages && isCustomerMessage)) {
                        this.processDOM(section);
                    } else {
                        // Cleanup highlights if config changed
                        const highlights = section.querySelectorAll('.highlight');
                        highlights.forEach(highlight => {
                            const textNode = document.createTextNode(highlight.textContent);
                            highlight.parentNode.replaceChild(textNode, highlight);
                        });
                    }
                }
            });
        }

        highlightSpecialTags() {
            this.config.specialTags.forEach(({ tag, className, active }) => {
                if (active !== false) {
                    const elements = document.querySelectorAll('[data-test-id="ticket-system-field-tags-item-selected"], [data-garden-id="tags.tag_view"]');
                    elements.forEach(element => {
                        const allText = Array.from(element.querySelectorAll('span')).map(e => e.textContent.trim()).join(' ');
                        const tags = allText.split(/\s+/);
                        if (tags.includes(tag) && !element.classList.contains('highlight')) {
                            element.classList.add('highlight', className);
                        }
                    });
                }
            });
        }
    }

    /**
     * UI Manager
     */
    class UIManager {
        constructor(config, app) {
            this.config = config;
            this.app = app;
            this.tooltip = Utils.createGlobalTooltip();
            this.initTooltipHandlers();
            this.isDraggingMyItem = false;
            this.dragEventsInitialized = false; // Flag for global init
        }

        createMenu() {
            this.injectSidebarIcon();
            const menu = document.createElement('div');
            menu.id = 'red-word-menu';
            this.renderMenuContent(menu);
            document.body.appendChild(menu);
            this.attachMenuListeners(menu);
            this.loadMenuPosition(menu);
        }

        injectSidebarIcon() {
            const attemptInject = () => {
                const navLists = document.querySelectorAll('nav[data-test-id="support_nav"] > ul');
                if (navLists.length < 2) {
                    setTimeout(attemptInject, 500);
                    return;
                }

                const targetList = navLists[navLists.length - 1];
                if (document.getElementById('red-word-manager-sidebar-li')) return;

                const li = document.createElement('li');
                li.id = 'red-word-manager-sidebar-li';
                li.className = 'StyledNavListItem-sc-18cj2v7-0 bbgdDD'; // Default class fallback
                if (targetList.firstElementChild) {
                    li.className = targetList.firstElementChild.className;
                }

                li.setAttribute('data-garden-id', 'chrome.nav_list_item');
                li.setAttribute('data-garden-version', '9.12.1');
                li.draggable = true;

                const button = document.createElement('button');
                button.id = 'red-word-manager-sidebar-btn';
                const neighborBtn = targetList.querySelector('button');
                button.className = neighborBtn ? neighborBtn.className : 'StyledBaseNavItem-sc-zvo43f-0 StyledNavButton-sc-f5ux3-0 gvFgbC bkva-dj';

                button.setAttribute('title', 'Red Word Manager');
                button.setAttribute('aria-label', 'Red Word Manager');
                button.tabIndex = 0;

                // Bad Language Style Icon
                button.innerHTML = `
                   <span style="display: flex; align-items: center; justify-content: center; height: 100%;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 18" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M18 12C18 13.1 17.1 14 16 14H4L0 18V2C0 0.9 0.9 0 2 0H16C17.1 0 18 0.9 18 2V12ZM1.54 7.73L1.69 6.99H0.98V6.18H1.86L2.07 5.13H2.9L2.69 6.18H3.33L3.54 5.13H4.37L4.16 6.18H4.57V6.99H4L3.85 7.73H4.57V8.54H3.69L3.48 9.57H2.65L2.86 8.54H2.21L2 9.57H1.17L1.38 8.54H0.98V7.73H1.54ZM2.37 7.73H3.02L3.17 6.99H2.53L2.37 7.73ZM8.15 6.14L7.78 8.45C7.78 8.45 7.77 8.53 7.77 8.55C7.77 8.59 7.77 8.61 7.8 8.63C7.8 8.65 7.82 8.66 7.86 8.66C7.95 8.66 8.05 8.62 8.16 8.54C8.33 8.42 8.47 8.25 8.57 8.03C8.67 7.81 8.73 7.52 8.73 7.21C8.73 6.7 8.58 6.29 8.29 5.99C7.99 5.69 7.6 5.54 7.1 5.54C6.73 5.54 6.4 5.63 6.1 5.8C5.8 5.98 5.57 6.23 5.4 6.56C5.24 6.89 5.16 7.26 5.16 7.67C5.16 8.3 5.34 8.8 5.69 9.17C6.04 9.54 6.49 9.72 7.05 9.72C7.32 9.72 7.59 9.67 7.84 9.58C8.09 9.49 8.31 9.35 8.54 9.17H9.14C8.98 9.36 8.83 9.51 8.68 9.62C8.47 9.78 8.22 9.91 7.94 10.01C7.66 10.11 7.37 10.16 7.04 10.16C6.59 10.16 6.18 10.06 5.82 9.85C5.46 9.64 5.18 9.35 4.98 8.97C4.78 8.58 4.68 8.14 4.68 7.67C4.68 7.2 4.78 6.76 4.99 6.36C5.2 5.96 5.49 5.64 5.84 5.42C6.19 5.19 6.6 5.08 7.08 5.08C7.7 5.08 8.2 5.28 8.58 5.67C8.97 6.06 9.16 6.56 9.16 7.18C9.16 7.55 9.08 7.88 8.93 8.19C8.78 8.49 8.56 8.73 8.27 8.91C8.05 9.05 7.83 9.12 7.64 9.12C7.52 9.12 7.43 9.09 7.35 9.04C7.27 8.99 7.22 8.92 7.19 8.8C7.06 8.93 6.94 9.02 6.83 9.07C6.72 9.12 6.61 9.15 6.48 9.15C6.22 9.15 6 9.04 5.81 8.82C5.62 8.6 5.53 8.29 5.53 7.89C5.53 7.41 5.65 6.98 5.89 6.59C6.13 6.2 6.43 6.01 6.78 6.01C6.92 6.01 7.04 6.04 7.15 6.11C7.26 6.18 7.37 6.29 7.48 6.45L7.53 6.12H8.1ZM6.2 8.06C6.2 8.29 6.25 8.47 6.35 8.6C6.42 8.7 6.52 8.74 6.63 8.74C6.75 8.74 6.87 8.69 6.97 8.58C7.07 8.47 7.16 8.26 7.24 7.94C7.32 7.62 7.36 7.3 7.36 7.04C7.36 6.85 7.32 6.71 7.24 6.61C7.16 6.51 7.06 6.46 6.95 6.46C6.82 6.46 6.71 6.51 6.61 6.61C6.48 6.74 6.38 6.95 6.31 7.23C6.24 7.51 6.21 7.77 6.21 8.01L6.2 8.06ZM9.57 5.21H10.84V6.19L10.59 8.16H9.8L9.56 6.19V5.21ZM9.61 8.45H10.8V9.5H9.61V8.45ZM11.49 6.26C11.49 6.06 11.53 5.87 11.62 5.69C11.71 5.51 11.84 5.37 12.02 5.28C12.2 5.18 12.41 5.13 12.65 5.13C13.01 5.13 13.29 5.23 13.5 5.44C13.71 5.65 13.81 5.92 13.81 6.26C13.81 6.6 13.71 6.88 13.5 7.08C13.29 7.28 13.01 7.39 12.65 7.39C12.41 7.39 12.19 7.34 12.02 7.25C11.84 7.15 11.71 7.01 11.62 6.83C11.53 6.65 11.49 6.46 11.49 6.26ZM12.31 6.27C12.31 6.51 12.35 6.69 12.43 6.8C12.48 6.87 12.55 6.91 12.65 6.91C12.75 6.91 12.82 6.87 12.87 6.8C12.95 6.69 12.99 6.51 12.99 6.27C12.99 6.03 12.95 5.85 12.87 5.74C12.82 5.67 12.75 5.63 12.65 5.63C12.55 5.63 12.48 5.67 12.43 5.74C12.35 5.85 12.31 6.03 12.31 6.27ZM15.14 5.13H15.76L13.28 9.72H12.67L15.14 5.13ZM14.59 8.58C14.59 8.38 14.63 8.19 14.72 8.01C14.81 7.83 14.94 7.69 15.12 7.59C15.3 7.49 15.51 7.44 15.75 7.44C16.11 7.44 16.4 7.54 16.6 7.75C16.8 7.96 16.91 8.24 16.91 8.58C16.91 8.92 16.81 9.2 16.6 9.4C16.39 9.61 16.11 9.71 15.75 9.71C15.51 9.71 15.3 9.66 15.12 9.56C14.94 9.46 14.81 9.32 14.72 9.14C14.63 8.96 14.59 8.77 14.59 8.58ZM15.41 8.59C15.41 8.83 15.45 9.01 15.53 9.12C15.58 9.19 15.65 9.23 15.75 9.23C15.85 9.23 15.92 9.19 15.97 9.12C16.05 9.01 16.09 8.83 16.09 8.59C16.09 8.35 16.05 8.17 15.97 8.06C15.92 7.99 15.85 7.95 15.75 7.95C15.65 7.95 15.58 7.99 15.53 8.06C15.45 8.17 15.41 8.35 15.41 8.59Z" fill="currentColor"/>
                        </svg>
                    </span>
                    <span class="StyledNavItemText-sc-13m84xl-0 iOGbGR">Red Words</span>
                `;

                li.appendChild(button);

                // Persistence Logic
                const savedIndex = GM_getValue('sidebarIconIndex', -1);

                // Safe insertion
                if (savedIndex >= 0 && savedIndex < targetList.children.length) {
                    targetList.insertBefore(li, targetList.children[savedIndex]);
                } else {
                    targetList.appendChild(li);
                }

                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleMenu();
                });

                this.setupDragAndDrop(li);
            };
            attemptInject();
        }

        toggleMenu() {
            const menu = document.getElementById('red-word-menu');
            if (menu) {
                const isHidden = menu.style.display === 'none' || getComputedStyle(menu).display === 'none';
                menu.style.display = isHidden ? 'flex' : 'none';

                const btn = document.getElementById('red-word-manager-sidebar-btn');
                if (btn) btn.classList.toggle('active', !isHidden);
            }
        }

        setupDragAndDrop(li) {
            // Local listener for starting drag
            li.addEventListener('dragstart', (e) => {
                this.isDraggingMyItem = true;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', 'red-word-manager'); // specific ID
                li.style.opacity = '0.4';
                li.classList.add('dragging');
            });

            // Local listener for ending drag
            li.addEventListener('dragend', (e) => {
                this.isDraggingMyItem = false;
                li.style.opacity = '1';
                li.classList.remove('dragging');

                // Save New Index relative to parent
                if (li.parentNode) {
                    const newIndex = Array.from(li.parentNode.children).indexOf(li);
                    GM_setValue('sidebarIconIndex', newIndex);
                }
            });

            // Global Drag Listeners (Delegation) - One time init
            if (!this.dragEventsInitialized) {
                document.addEventListener('dragover', (e) => {
                    // Scope: Must be checking a sidebar list
                    const navList = e.target.closest('nav[data-test-id="support_nav"] > ul');
                    if (!navList) return;

                    if (!this.isDraggingMyItem) return;

                    e.preventDefault(); // Allow drop

                    const afterElement = this.getDragAfterElement(navList, e.clientY);
                    const draggable = document.getElementById('red-word-manager-sidebar-li');

                    if (!draggable) return;

                    if (afterElement == null) {
                        navList.appendChild(draggable);
                    } else {
                        navList.insertBefore(draggable, afterElement);
                    }
                });

                document.addEventListener('drop', (e) => {
                    if (this.isDraggingMyItem) {
                        e.preventDefault();
                    }
                });

                this.dragEventsInitialized = true;
            }
        }

        getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('li[data-garden-id="chrome.nav_list_item"]:not(#red-word-manager-sidebar-li)')];

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        rebuildMenu() {
            const menu = document.getElementById('red-word-menu');
            if (!menu) return;

            const wasVisible = getComputedStyle(menu).display !== 'none';
            const activeLists = [];
            menu.querySelectorAll('ul.active').forEach(ul => activeLists.push(ul.id));

            this.renderMenuContent(menu);

            if (wasVisible) menu.style.display = 'flex';
            activeLists.forEach(id => {
                const list = menu.querySelector(`#${id}`);
                if (list) list.classList.add('active');
            });
        }

        renderMenuContent(menu) {
            menu.innerHTML = `
                <div id="red-word-menu-header">Red Word Manager</div>
                <div id="red-word-menu-content-wrapper">
                    <div class="fuzzy-settings">
                        <label>Fuzzy Match Sensitivity:</label>
                        <div class="slider-container">
                            <input type="range" id="fuzzy-threshold" min="0" max="1" step="0.01" value="${this.config.fuzzyThreshold}">
                            <span class="threshold-value">${(this.config.fuzzyThreshold * 100).toFixed(0)}%</span>
                        </div>
                        <small>Higher value = more matches but less accurate</small>
                        <label style="margin-top: 15px;">Max Text Length for Check:</label>
                        <div class="slider-container">
                            <input type="number" id="max-text-length" min="10" max="1000" step="10" value="${this.config.maxTextLength}">
                            <span class="value-display">${this.config.maxTextLength} chars</span>
                        </div>
                        <small>Maximum length of text to check (longer texts will be skipped)</small>
                    </div>
                    <button id="create-category" class="add-word-btn">Create New Category</button>
                    <button id="toggle-customer-filter" style="float: left; background: ${this.config.checkOnlyCustomerMessages ? '#4CAF50' : '#f8f8f8'};">
                        ${this.config.checkOnlyCustomerMessages ? 'Check Customer Only' : 'Check All Messages'}
                    </button>
                    ${Object.keys(this.config.redWords).map(category => this.renderCategoryHTML(category)).join('')}
                    <div class="category" data-category="specialTags">Special Tags
                        <button id="add-special-tag">Add New Special Tag</button>
                    </div>
                    <ul id="specialTags-words">
                        ${this.config.specialTags.map(tag => this.renderSpecialTagHTML(tag)).join('')}
                    </ul>
                </div>
            `;
        }

        renderCategoryHTML(category) {
            const data = this.config.redWords[category];
            return `
                <div class="category" data-category="${category}">${category}
                    <button data-action="edit-category" data-category="${category}">Edit Color</button>
                    <button data-action="rename-category" data-category="${category}">Rename</button>
                    <button class="category-toggle" data-action="toggle-category" data-category="${category}">
                        ${data.active ? 'Disable' : 'Enable'}
                    </button>
                    <button class="add-word-btn" data-action="add-word" data-category="${category}">Add New Word</button>
                    <button data-action="delete-category" data-category="${category}">Delete</button>
                </div>
                <ul id="${category}-words">
                    ${data.words.map(word => `<li>${word}
                        <button data-action="edit-word" data-category="${category}" data-word="${word}">Edit</button>
                        <button data-action="delete-word" data-category="${category}" data-word="${word}">Delete</button>
                    </li>`).join('')}
                </ul>
            `;
        }

        renderSpecialTagHTML(tagData) {
            return `
                <div class="special-tag-item" data-tag="${tagData.tag}" style="background-color: ${tagData.color || '#9ef01a'}">
                    <span>${tagData.tag}</span>
                    <div class="button-container">
                        <button data-action="edit-tag" data-tag="${tagData.tag}">Edit</button>
                        <button data-action="edit-tag-color" data-tag="${tagData.tag}">Edit Color</button>
                        <button data-action="toggle-tag" data-tag="${tagData.tag}">
                             ${tagData.active !== false ? 'Disable' : 'Enable'}
                        </button>
                        <button data-action="delete-tag" data-tag="${tagData.tag}">Delete</button>
                    </div>
                </div>
            `;
        }

        attachMenuListeners(menu) {
            // Drag and Drop
            this.makeDraggable(menu);

            // Filter Button
            const filterButton = menu.querySelector('#toggle-customer-filter');
            filterButton.addEventListener('click', () => {
                const newState = !this.config.checkOnlyCustomerMessages;
                this.config.setCheckOnlyCustomerMessages(newState);
                filterButton.style.background = newState ? '#4CAF50' : '#f8f8f8';
                filterButton.textContent = newState ? 'Check Customer Only' : 'Check All Messages';
                this.app.refresh();
            });

            // Sliders
            menu.querySelector('#fuzzy-threshold').addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                menu.querySelector('.threshold-value').textContent = `${(val * 100).toFixed(0)}%`;
                this.config.setFuzzyThreshold(val);
                this.app.refresh(true);
            });

            menu.querySelector('#max-text-length').addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                menu.querySelector('.value-display').textContent = `${val} chars`;
                this.config.setMaxTextLength(val);
                this.app.refresh();
            });

            // Action Buttons
            menu.addEventListener('click', (e) => this.handleMenuClick(e));
        }

        handleMenuClick(e) {
            const action = e.target.dataset.action;
            const category = e.target.dataset.category;
            const word = e.target.dataset.word;
            const tag = e.target.dataset.tag;

            if (e.target.id === 'create-category') this.createCategory();
            else if (e.target.id === 'add-special-tag') this.createSpecialTag();
            else if (e.target.classList.contains('category')) {
                const list = document.getElementById(`${category}-words`);
                if (list) list.classList.toggle('active');
            }
            // Category Actions
            else if (action === 'delete-category') this.deleteCategory(category);
            else if (action === 'rename-category') this.renameCategory(category);
            else if (action === 'edit-category') this.editCategoryColor(category);
            else if (action === 'toggle-category') this.toggleCategory(category, e.target);
            else if (action === 'add-word') this.addWord(category);
            // Word Actions
            else if (action === 'delete-word') this.deleteWord(category, word);
            else if (action === 'edit-word') this.editWord(category, word);
            // Tag Actions
            else if (action === 'delete-tag') this.deleteTag(tag);
            else if (action === 'edit-tag') this.editTag(tag);
            else if (action === 'edit-tag-color') this.editTagColor(tag);
            else if (action === 'toggle-tag') this.toggleTag(tag, e.target);
        }

        // --- Actions Implementation ---
        createCategory() {
            const name = prompt('Enter the name for the new category:');
            if (!name) return;
            const color = prompt('Enter color (e.g. #ffea00):', '#ffea00');
            if (this.config.redWords[name]) return alert('Category exists!');
            this.config.redWords[name] = { words: [], active: true, color };
            this.config.saveRedWords();
            this.app.fullReload();
        }

        createSpecialTag() {
            const tag = prompt('Enter the new special tag:');
            if (!tag) return;
            const color = prompt('Enter color:', '#9ef01a');
            if (this.config.specialTags.some(t => t.tag === tag)) return alert('Tag exists!');
            this.config.specialTags.push({ tag, className: tag.replace(/\s+/g, '_').toLowerCase(), active: true, color });
            this.config.saveSpecialTags();
            this.app.fullReload();
        }

        deleteCategory(category) {
            if (confirm(`Delete category "${category}"?`)) {
                delete this.config.redWords[category];
                this.config.saveRedWords();
                this.app.fullReload();
            }
        }

        renameCategory(category) {
            const newName = prompt(`Rename "${category}":`, category);
            if (newName && newName !== category) {
                this.config.redWords[newName] = this.config.redWords[category];
                delete this.config.redWords[category];
                this.config.saveRedWords();
                this.app.fullReload();
            }
        }

        editCategoryColor(category) {
            const current = this.config.redWords[category].color || '#ffea00';
            const newColor = prompt(`New color for "${category}":`, current);
            if (newColor) {
                this.config.redWords[category].color = newColor;
                this.config.saveRedWords();
                this.app.updateStyles();
                this.app.refresh();
            }
        }

        toggleCategory(category, btn) {
            const active = !this.config.redWords[category].active;
            this.config.redWords[category].active = active;
            this.config.saveRedWords();
            btn.textContent = active ? 'Disable' : 'Enable';
            this.app.updateStyles();
            this.app.refresh();
        }

        addWord(category) {
            const word = prompt(`New word for "${category}":`);
            if (word) {
                this.config.redWords[category].words.push(word);
                this.config.saveRedWords();
                this.app.hardRefresh();
                this.rebuildMenu();
            }
        }

        deleteWord(category, word) {
            this.config.redWords[category].words = this.config.redWords[category].words.filter(w => w !== word);
            this.config.saveRedWords();
            this.app.hardRefresh();
            this.rebuildMenu();
        }

        editWord(category, word) {
            const newWord = prompt(`Edit "${word}":`, word);
            if (newWord && newWord !== word) {
                const idx = this.config.redWords[category].words.indexOf(word);
                if (idx > -1) {
                    this.config.redWords[category].words[idx] = newWord;
                    this.config.saveRedWords();
                    this.app.hardRefresh();
                    this.rebuildMenu();
                }
            }
        }

        // Tag methods similar to above...
        deleteTag(tag) {
            if (confirm(`Delete tag "${tag}"?`)) {
                const idx = this.config.specialTags.findIndex(t => t.tag === tag);
                if (idx >= 0) {
                    this.config.specialTags.splice(idx, 1);
                    this.config.saveSpecialTags();
                    this.app.fullReload();
                }
            }
        }

        editTag(tag) {
            const newTag = prompt(`Edit tag "${tag}":`, tag);
            if (newTag && newTag !== tag) {
                const t = this.config.specialTags.find(t => t.tag === tag);
                if (t) {
                    t.tag = newTag;
                    this.config.saveSpecialTags();
                    this.app.fullReload();
                }
            }
        }

        editTagColor(tag) {
            const t = this.config.specialTags.find(t => t.tag === tag);
            if (t) {
                const newColor = prompt(`New color for "${tag}":`, t.color || '#9ef01a');
                if (newColor) {
                    t.color = newColor;
                    this.config.saveSpecialTags();
                    this.app.updateStyles();
                    this.app.refresh();
                }
            }
        }

        toggleTag(tag, btn) {
            const t = this.config.specialTags.find(t => t.tag === tag);
            if (t) {
                t.active = !t.active;
                this.config.saveSpecialTags();
                btn.textContent = t.active ? 'Disable' : 'Enable';
                this.app.updateStyles();
                this.app.refresh();
            }
        }

        makeDraggable(menu) {
            let isDragging = false;
            const header = menu.querySelector('#red-word-menu-header');
            header.addEventListener('mousedown', (e) => {
                isDragging = true;
                let offsetX = e.clientX - menu.offsetLeft;
                let offsetY = e.clientY - menu.offsetTop;

                const onMouseMove = (event) => {
                    if (isDragging) {
                        let l = event.clientX - offsetX;
                        let t = event.clientY - offsetY;
                        // Boundaries
                        const w = menu.offsetWidth, h = menu.offsetHeight;
                        const ww = window.innerWidth, wh = window.innerHeight;
                        if (l < 0) l = 0; if (t < 0) t = 0;
                        if (l + w > ww) l = ww - w; if (t + h > wh) t = wh - h;

                        menu.style.left = `${l}px`;
                        menu.style.top = `${t}px`;
                    }
                };
                const onMouseUp = () => {
                    isDragging = false;
                    this.config.setMenuPosition({ top: menu.offsetTop, left: menu.offsetLeft });
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                };
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }

        loadMenuPosition(menu) {
            const pos = this.config.menuPosition;
            menu.style.top = `${pos.top}px`;
            menu.style.left = `${pos.left}px`;
        }

        initTooltipHandlers() {
            document.addEventListener('mouseover', (e) => {
                const el = e.target.closest('.highlight.fuzzy-match');
                if (el) {
                    const word = el.getAttribute('data-matched-word');
                    const conf = el.getAttribute('data-confidence');
                    if (word && conf) {
                        this.tooltip.textContent = `Matches "${word}" (${conf}% confidence)`;
                        this.tooltip.style.display = 'block';
                        const move = (ev) => {
                            this.tooltip.style.left = (ev.pageX + 15) + 'px';
                            this.tooltip.style.top = (ev.pageY + 15) + 'px';
                        };
                        move(e);
                        document.addEventListener('mousemove', move);
                        el._tooltipMove = move;
                    }
                }
            });
            document.addEventListener('mouseout', (e) => {
                const el = e.target.closest('.highlight.fuzzy-match');
                if (el) {
                    this.tooltip.style.display = 'none';
                    if (el._tooltipMove) {
                        document.removeEventListener('mousemove', el._tooltipMove);
                        delete el._tooltipMove;
                    }
                }
            });
        }
    }

    /**
     * Application Controller
     */
    class App {
        constructor() {
            this.config = new ConfigManager();
            this.styleManager = new StyleManager(this.config);
            this.searchEngine = new SearchEngine(this.config);
            this.highlighter = new Highlighter(this.config, this.searchEngine);
            this.uiManager = new UIManager(this.config, this);

            this.debouncedRefresh = Utils.debounce(() => this.process(), 300);
        }

        init() {
            this.searchEngine.initialize();
            this.styleManager.applyCategoryStyles();
            this.styleManager.applySpecialTagStyles();
            this.uiManager.createMenu();
            this.process();
            this.setupObserver();
        }

        process() {
            this.highlighter.processChatSections();
            this.highlighter.processTags();
            this.highlighter.highlightSpecialTags();
        }

        refresh(hard = false) {
            if (hard) this.searchEngine.initialize();
            this.searchEngine.clearCache();
            this.debouncedRefresh();
        }

        hardRefresh() {
            this.refresh(true);
        }

        fullReload() {
            this.styleManager.applyCategoryStyles();
            this.styleManager.applySpecialTagStyles();
            this.uiManager.rebuildMenu();
            this.hardRefresh();
        }

        updateStyles() {
            this.styleManager.applyCategoryStyles();
            this.styleManager.applySpecialTagStyles();
        }

        setupObserver() {
            const observer = new MutationObserver(Utils.debounce((mutations) => {
                let shouldProcess = false;
                for (const m of mutations) {
                    if (m.addedNodes.length) { shouldProcess = true; break; }
                }
                if (shouldProcess) this.process();
            }, 100));
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // Start App
    const app = new App();
    app.init();

})();
