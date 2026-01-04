// ==UserScript==
// @name         Inoreader Feed Manager with Whitelist and Enhanced URL Filtering (Debug Version)
// @namespace    https://greasyfork.org/en/users/567951-stuart-saddler
// @author       Stuart Saddler
// @version      2.9
// @description  Automatically removes posts from your Inoreader feed containing blocked keywords, using whole-word matching for single terms and exact matching for phrases. Also filters duplicates. Articles are processed smoothly without flashing.
// @license      MIT
// @icon         https://i.ibb.co/s5Hc8Rj/iFM-Icon.jpg
// @match        https://*.inoreader.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/522378/Inoreader%20Feed%20Manager%20with%20Whitelist%20and%20Enhanced%20URL%20Filtering%20%28Debug%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522378/Inoreader%20Feed%20Manager%20with%20Whitelist%20and%20Enhanced%20URL%20Filtering%20%28Debug%20Version%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Popup modal styling for configuration interfaces
    GM_addStyle(`
        .inoreader-popup-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .inoreader-popup-dialog {
            background: white;
            color: #333;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-height: 80vh;
            overflow-y: auto;
            width: 80%;
            max-width: 600px;
            position: relative;
            font-family: Arial, sans-serif;
        }
        .inoreader-popup-dialog h3 {
            margin-top: 0;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            color: #0079d3;
            font-size: 1.5em;
            font-weight: bold;
        }
        .inoreader-popup-dialog h4.inoreader-subheading {
            color: #0079d3;
            font-size: 1.2em;
            margin-top: 1em;
            margin-bottom: 0.5em;
        }
        .inoreader-popup-content {
            margin-top: 20px;
            font-size: 1em;
            color: #555;
        }
        .inoreader-popup-buttons {
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        .inoreader-popup-buttons button {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1em;
            font-family: Arial, sans-serif;
            transition: opacity 0.2s ease-in-out;
        }
        .inoreader-popup-buttons .btn-cancel {
            background: #f2f2f2;
            color: #333;
        }
        .inoreader-popup-buttons .btn-save,
        .inoreader-popup-buttons .btn-ok {
            background: #0079d3;
            color: white;
        }
        .inoreader-popup-buttons button:hover {
            opacity: 0.9;
        }
        .inoreader-popup-dialog textarea {
            width: 100%;
            height: 150px;
            margin-top: 10px;
            padding: 8px;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-family: monospace;
            background: #f9f9f9;
            color: #000;
            margin-bottom: 1.5em;
        }
        .inoreader-popup-dialog p {
            font-size: 0.9em;
            margin-bottom: 10px;
            color: #000;
        }
        .inoreader-popup-dialog,
        .inoreader-popup-dialog a,
        .inoreader-popup-dialog li {
            color: #000 !important;
        }
        .filtered-article-link {
            color: #0079d3;
            text-decoration: none;
        }
        .filtered-article-link:hover {
            text-decoration: underline;
        }
        .url-keyword-hint {
            color: #d63384;
            font-size: 0.85em;
        }
    `);

    // Responsive column layout for magazine view articles
    GM_addStyle(`
        .view_style_4 .article-container,
        .view_style_4 #reader_pane:not(#reader_pane_articles_search_result) .ar.article_magazine {
            width: calc(25% - 20px) !important;
            max-width: none !important;
            margin: 10px;
            box-sizing: border-box;
        }

        @media only screen and (max-width: 1200px) {
            .view_style_4 .article-container,
            .view_style_4 #reader_pane:not(#reader_pane_articles_search_result) .ar.article_magazine {
                width: calc(33.33% - 20px) !important;
            }
        }

        @media only screen and (max-width: 900px) {
            .view_style_4 .article-container,
            .view_style_4 #reader_pane:not(#reader_pane_articles_search_result) .ar.article_magazine {
                width: calc(50% - 20px) !important;
            }
        }

        @media only screen and (max-width: 600px) {
            .view_style_4 .article-container,
            .view_style_4 #reader_pane:not(#reader_pane_articles_search_result) .ar.article_magazine {
                width: 100% !important;
                margin: 10px 0 !important;
            }
        }

        .view_style_4 #reader_pane:not(#reader_pane_articles_search_result) {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: space-between;
        }

        .view_style_4 #reader_pane:not(#reader_pane_articles_search_result) .ar.article_magazine img,
        .view_style_4 #reader_pane:not(#reader_pane_articles_search_result) .ar.article_magazine .article_magazine_title_link {
            max-width: 100% !important;
            height: auto !important;
        }

        h5.articles_group_feed.articles_group_date {
            width: 100%;
            display: flex;
            justify-content: center;
            margin: 1em 0;
        }

        h5.articles_group_feed.articles_group_date > span {
            text-align: center;
            display: inline-block;
        }
    `);

    // Configuration variables and state management
    const DEBUG = false; // Set to true to enable detailed debugging output

    let blocklist = GM_getValue('blocklist') ? JSON.parse(GM_getValue('blocklist')) : [];
    let whitelist = GM_getValue('whitelist') ? JSON.parse(GM_getValue('whitelist')) : [];
    let blockedArticles = GM_getValue('blockedArticles') ? JSON.parse(GM_getValue('blockedArticles')) : [];
    let sessionBlockedArticles = [];
    let blocklistCount = 0;

    let sensitivity = GM_getValue('sensitivity', 'Medium');
    let duplicateCount = 0;
    let seenArticles = GM_getValue('seenArticles') ? JSON.parse(GM_getValue('seenArticles')) : [];
    let filteredOutArticles = [];

    const menuCommandIds = {
        blocklistConfig: null,
        whitelistConfig: null,
        duplicates: null,
        sensitivityHigh: null,
        sensitivityMedium: null,
        sensitivityLow: null,
    };

    // Sensitivity levels control how duplicates are detected
    const sensitivityLevels = {
        Low:    { overlapThreshold: 0.80, minOverlapCount: 4 },
        Medium: { overlapThreshold: 0.60, minOverlapCount: 3 },
        High:   { overlapThreshold: 0.30, minOverlapCount: 2 },
    };

    // Common filler words to ignore when detecting duplicates
    const GENERIC_NOUNS = new Set([
        'report', 'story', 'investigation', 'evidence', 'review', 'update',
        'announcement', 'research', 'analysis', 'comments', 'authority',
        'information', 'details', 'charges', 'expert',
        'discover', 'release', 'findings',
        'coverage', 'remarks', 'significance', 'context',
        'issue', 'situation', 'matter', 'topic', 'concern',
        'consideration', 'aspect', 'focus', 'subject', 'theme',
        'incident', 'injuries', 'attack', 'scene', 'crash',
        'storm', 'parade', 'festival', 'event', 'flashback',
        'memories', 'history'
    ]);
    const GENERIC_VERBS = new Set([
        'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'has', 'have', 'had', 'do', 'does', 'did',
        'know', 'report', 'found', 'say', 'claims', 'investigate',
        'release', 'reveal', 'announce', 'confirm', 'cover',
        'discover', 'comment', 'dies', 'marks',
        'announces', 'reports', 'finds', 'explores', 'addresses',
        'examines', 'reviews', 'mentions', 'states', 'asserts',
        'declares', 'proclaims', 'emphasizes', 'underscores',
        'live', 'said', 'says', 'like', 'will', 'can', 'could', 'may', 'would',
        'kills', 'crashes', 'celebrates', 'warns', 'declares',
        'drives', 'found', 'announces', 'reports', 'expels',
        'escalates', 'pounds', 'resumes', 'welcomes', 'bans'
    ]);
    const GENERIC_ADJECTIVES = new Set([
        'new', 'latest', 'big', 'significant', 'historical', 'similar',
        'recent', 'major', 'other', 'exclusive', 'breaking',
        'important', 'notable', 'remarkable', 'influential',
        'pivotal', 'groundbreaking', 'prominent', 'critical',
        'key', 'essential', 'integral', 'fundamental',
        'deadly', 'chaotic', 'widespread', 'live', 'top',
        'three-day', 'stormy', 'underrated'
    ]);
    const GENERIC_ADVERBS = new Set([
        'quickly', 'slowly', 'recently', 'already', 'immediately',
        'suddenly', 'abruptly', 'eventually', 'ultimately',
        'finally', 'gradually', 'smoothly', 'carefully',
        'eagerly', 'readily', 'swiftly', 'promptly', 'thoroughly',
        'very', 'just', 'only', 'reportedly', 'live', 'currently', 'now', 'still',
        'officially'
    ]);
    const EXTRA_COMMON = new Set([
        'face', 'faces', 'about', 'after', 'all', 'also', 'and',
        'any', 'as', 'at', 'but', 'by', "don't", 'even', 'every',
        'for', 'from', 'he', 'her', 'him', 'his', 'how', 'if', 'in',
        'into', 'it', 'its', 'more', 'no', 'not', 'now', 'on', 'one',
        'or', 'our', 'out', 'over', 'she', 'so', 'some', 'than',
        'their', 'them', 'then', 'there', 'they', 'through', 'to',
        'under', 'up', 'us', 'was', 'we', 'what', 'when', 'where',
        'which', 'while', 'who', 'why', 'with', 'within', 'you', 'your',
        'at least', 'across', 'after', 'among', 'before', 'during',
        'every', 'less', 'most', 'per', 'several', 'until',
        'near', 'latest'
    ]);
    const FILLER_WORDS = new Set([
        ...GENERIC_NOUNS,
        ...GENERIC_VERBS,
        ...GENERIC_ADJECTIVES,
        ...GENERIC_ADVERBS,
        ...EXTRA_COMMON,
    ]);

    // Create and show popup modal for user interfaces
    function createPopup(title, content, buttons) {
        if (DEBUG) console.log(`[createPopup] Creating popup: ${title}`);
        const overlay = document.createElement('div');
        overlay.className = 'inoreader-popup-overlay';

        const popup = document.createElement('div');
        popup.className = 'inoreader-popup-dialog';

        const h3 = document.createElement('h3');
        h3.textContent = title;

        const contentEl = document.createElement('div');
        contentEl.className = 'inoreader-popup-content';
        contentEl.appendChild(content);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'inoreader-popup-buttons';

        buttons.forEach(btn => {
            const b = document.createElement('button');
            b.textContent = btn.text;
            if (btn.text.toLowerCase() === 'cancel') {
                b.classList.add('btn-cancel');
            } else if (btn.text.toLowerCase() === 'save' || btn.text.toLowerCase() === 'ok') {
                b.classList.add(btn.text.toLowerCase() === 'save' ? 'btn-save' : 'btn-ok');
            }
            b.addEventListener('click', () => btn.onClick(overlay));
            buttonContainer.appendChild(b);
        });

        popup.appendChild(h3);
        popup.appendChild(contentEl);
        popup.appendChild(buttonContainer);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        // Close if user clicks outside the popup dialog box
        overlay.addEventListener('click', (evt) => {
            if (evt.target === overlay) {
                overlay.remove();
            }
        });
    }

    // Show confirmation popup with OK/Cancel options that triggers page reload
    function showConfirmationPopup(message) {
        if (DEBUG) console.log(`[showConfirmationPopup] ${message}`);
        const msg = document.createElement('p');
        msg.textContent = message;
        const buttons = [
            {
                text: 'Cancel',
                onClick: (ov) => ov.remove()
            },
            {
                text: 'OK',
                onClick: (ov) => {
                    ov.remove();
                    window.location.reload();
                }
            }
        ];
        createPopup('Confirmation', msg, buttons);
    }

    // Escape string for safe use in RegExp construction
    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // [NEW] Creates a regex for a term, using word boundaries for single words
    // and exact matching for phrases.
    function termToRegex(term) {
        if (!term || typeof term !== 'string' || term.trim() === '') return null;
        try {
            const esc = escapeRegExp(term);
            const containsSpace = /\s/.test(term);

            if (containsSpace) {
                // For phrases, match the exact phrase
                return new RegExp(esc, 'i');
            } else {
                // For single words, enforce whole word matching
                return new RegExp(`\\b${esc}\\b`, 'i');
            }
        } catch (e) {
            if (DEBUG) console.error(`[Inoreader Feed Manager] Failed to create regex for term: "${term}"`, e);
            return null;
        }
    }


    // Highlight blocklist words in text string with yellow background for UI display
    function highlightWords(text, words) {
        if (!words || words.length === 0) return text;
        let safeText = text;
        words.forEach(word => {
            const regex = termToRegex(word); // Use the new robust regex for highlighting
            if(regex) {
                safeText = safeText.replace(regex, `<span style="background: yellow; font-weight: bold;">$&</span>`);
            }
        });
        return safeText;
    }

    // Extract article URL from article node using multiple possible selectors
    function getArticleUrl(articleNode) {
        const linkEl = articleNode.querySelector('a.article_title_link, a.article_magazine_title_link, a.article_title, h2.article_title a, h3.article_title a');
        return linkEl ? linkEl.href : '';
    }

    // [REVISED] Find blocklist keywords in text, respecting whitelist overrides.
    // Now uses the robust termToRegex function for both lists.
    function getMatchedBlocklistWords(text) {
        if (!text) return [];
        const lower = text.toLowerCase();

        // First, check if the entire text is whitelisted by any phrase.
        const isTextWhitelisted = whitelist.some(phrase => {
            const regex = termToRegex(phrase);
            const found = regex && regex.test(lower);
            if (DEBUG && found) {
                console.log(`[getMatchedBlocklistWords] Found whitelist override phrase "${phrase}" in text`);
            }
            return found;
        });

        if (isTextWhitelisted) {
            return []; // Whitelisted, so no blocklist words can match.
        }

        // If not whitelisted, find all matching blocklist terms.
        const matched = [];
        blocklist.forEach(term => {
            const regex = termToRegex(term);
            if (regex && regex.test(lower)) {
                if (DEBUG) {
                    console.log(`[getMatchedBlocklistWords] Term "${term}" matched, not overridden`);
                }
                matched.push(term);
            }
        });
        return matched;
    }

    // Show blocklist configuration interface with current session blocked articles
    function showBlocklistConfigUI() {
        if (DEBUG) console.log(`[showBlocklistConfigUI] invoked`);
        const titleText = `Configure Blocklist (Total filtered: ${blocklistCount})`;

        const blocklistInstructions = document.createElement('p');
        blocklistInstructions.textContent = 'Enter keywords or phrases to block, one per line (case-insensitive). Matches whole words or exact phrases in titles, descriptions, or URLs.';

        const blocklistTxt = document.createElement('textarea');
        blocklistTxt.value = blocklist.join('\n');

        const allowedInstructions = document.createElement('p');
        allowedInstructions.textContent = 'Enter phrases where blocklisted words are allowed (whitelist), one per line (case-insensitive).';

        const allowedTxt = document.createElement('textarea');
        allowedTxt.value = whitelist.join('\n');

        const middleButtonContainer = document.createElement('div');
        middleButtonContainer.className = 'inoreader-popup-buttons';

        const cancelMiddleBtn = document.createElement('button');
        cancelMiddleBtn.textContent = 'Cancel';
        cancelMiddleBtn.classList.add('btn-cancel');
        cancelMiddleBtn.onclick = () => document.querySelector('.inoreader-popup-overlay').remove();

        const saveMiddleBtn = document.createElement('button');
        saveMiddleBtn.textContent = 'Save';
        saveMiddleBtn.classList.add('btn-save');
        saveMiddleBtn.onclick = () => {
            const newBlocklist = blocklistTxt.value
                .split('\n')
                .map(t => t.trim())
                .filter(t => t.length > 0);

            const newWhitelist = allowedTxt.value
                .split('\n')
                .map(t => t.trim())
                .filter(t => t.length > 0);

            blocklist = newBlocklist;
            whitelist = newWhitelist;
            GM_setValue('blocklist', JSON.stringify(blocklist));
            GM_setValue('whitelist', JSON.stringify(whitelist));

            sessionBlockedArticles = [];
            blocklistCount = 0;
            updateMenuLabels();
            document.querySelector('.inoreader-popup-overlay').remove();
            showConfirmationPopup('Blocklist and Whitelist updated. Reload now?');
        };

        middleButtonContainer.appendChild(cancelMiddleBtn);
        middleButtonContainer.appendChild(saveMiddleBtn);

        const blockedArticlesTitle = document.createElement('h4');
        blockedArticlesTitle.className = 'inoreader-subheading';
        blockedArticlesTitle.textContent = 'Blocked Articles (Current Session):';

        const blockedArticlesDiv = document.createElement('div');
        if (sessionBlockedArticles.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'No articles have been blocked this session.';
            blockedArticlesDiv.appendChild(p);
        } else {
            const ul = document.createElement('ul');
            sessionBlockedArticles.forEach(art => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = art.url;
                link.target = '_blank';

                let titleHtml = highlightWords(art.title, art.matchedTitleKeywords);
                if (
                    art.matchedTitleKeywords.length === 0 &&
                    art.matchedDescriptionKeywords.length > 0
                ) {
                    titleHtml += ` <span style="background: yellow;">(Description)</span>`;
                }
                link.innerHTML = titleHtml;
                link.className = 'filtered-article-link';
                li.appendChild(link);

                if (art.matchedDescriptionKeywords && art.matchedDescriptionKeywords.length > 0) {
                    const descContainer = document.createElement('div');
                    descContainer.style.fontSize = '0.85em';
                    descContainer.style.marginTop = '5px';
                    descContainer.textContent = `*Desc Keywords: ${art.matchedDescriptionKeywords.join(', ')}`;
                    li.appendChild(descContainer);
                }
                if (art.matchedUrlKeywords && art.matchedUrlKeywords.length > 0) {
                    const urlContainer = document.createElement('div');
                    urlContainer.style.fontSize = '0.85em';
                    urlContainer.style.marginTop = '5px';
                    urlContainer.style.color = '#d63384';
                    urlContainer.textContent = `*URL Keywords: ${art.matchedUrlKeywords.join(', ')}`;
                    li.appendChild(urlContainer);
                }
                ul.appendChild(li);
            });
            blockedArticlesDiv.appendChild(ul);
        }

        const content = document.createElement('div');
        content.appendChild(blocklistInstructions);
        content.appendChild(blocklistTxt);
        content.appendChild(allowedInstructions);
        content.appendChild(allowedTxt);
        content.appendChild(middleButtonContainer);
        content.appendChild(blockedArticlesTitle);
        content.appendChild(blockedArticlesDiv);

        const buttons = [
            {
                text: 'Cancel',
                onClick: (ov) => ov.remove()
            },
            {
                text: 'Save',
                onClick: (ov) => {
                    const newBlocklist = blocklistTxt.value
                        .split('\n')
                        .map(t => t.trim())
                        .filter(t => t.length > 0);

                    const newWhitelist = allowedTxt.value
                        .split('\n')
                        .map(t => t.trim())
                        .filter(t => t.length > 0);

                    blocklist = newBlocklist;
                    whitelist = newWhitelist;
                    GM_setValue('blocklist', JSON.stringify(blocklist));
                    GM_setValue('whitelist', JSON.stringify(whitelist));
                    if (DEBUG) console.log('Blocklist updated:', blocklist);
                    if (DEBUG) console.log('Whitelist updated:', whitelist);

                    sessionBlockedArticles = [];
                    blocklistCount = 0;
                    updateMenuLabels();
                    ov.remove();
                    showConfirmationPopup('Blocklist and Whitelist updated. Reload now?');
                }
            }
        ];

        const finalContent = document.createElement('div');
        finalContent.appendChild(content);
        createPopup(titleText, finalContent, buttons);
    }

    // Show whitelist configuration interface
    function showWhitelistConfigUI() {
        if (DEBUG) console.log(`[showWhitelistConfigUI] invoked`);
        const titleText = `Configure Whitelist`;

        const instructions = document.createElement('p');
        instructions.textContent = 'Enter phrases where blocklisted words are allowed, one per line (case-insensitive).';

        const txt = document.createElement('textarea');
        txt.value = whitelist.join('\n');

        const content = document.createElement('div');
        content.appendChild(instructions);
        content.appendChild(txt);

        const buttons = [
            {
                text: 'Cancel',
                onClick: (ov) => ov.remove()
            },
            {
                text: 'Save',
                onClick: (ov) => {
                    const newList = txt.value
                        .split('\n')
                        .map(t => t.trim())
                        .filter(t => t.length > 0);

                    whitelist = newList;
                    GM_setValue('whitelist', JSON.stringify(whitelist));
                    if (DEBUG) console.log('Whitelist updated:', whitelist);

                    ov.remove();
                    showConfirmationPopup('Whitelist updated. Reload now?');
                }
            }
        ];

        const finalContent = document.createElement('div');
        finalContent.appendChild(content);
        createPopup(titleText, finalContent, buttons);
    }

    // Simple Porter stemmer algorithm to normalize words for duplicate detection
    function porterStemmer(word) {
        if (word.length < 3) return word;
        let w = word;

        if (w.endsWith('sses')) {
            w = w.slice(0, -2);
        } else if (w.endsWith('ies')) {
            w = w.slice(0, -2);
        } else if (w.endsWith('ss')) {
        } else if (w.endsWith('s')) {
            w = w.slice(0, -1);
        }

        if (w.endsWith('ed')) {
            const base = w.slice(0, -2);
            if (base.match(/[aeiouy]/)) {
                w = base;
            }
        } else if (w.endsWith('ing')) {
            const base = w.slice(0, -3);
            if (base.match(/[aeiouy]/)) {
                w = base;
            }
        }

        if (w.endsWith('ational')) {
            w = w.replace('ational', 'ate');
        } else if (w.endsWith('tional')) {
            w = w.replace('tional', 'tion');
        } else if (w.endsWith('enci')) {
            w = w.replace('enci', 'ence');
        } else if (w.endsWith('anci')) {
            w = w.replace('anci', 'ance');
        } else if (w.endsWith('izer')) {
            w = w.replace('izer', 'ize');
        }

        if (w.endsWith('ment')) {
            w = w.slice(0, -4);
        } else if (w.endsWith('ness')) {
            w = w.slice(0, -4);
        }
        if (w.endsWith('ous')) {
            w = w.slice(0, -3);
        }
        if (w.endsWith('ative')) w = w.replace('ative', '');
        if (w.endsWith('ful'))   w = w.replace('ful', '');

        return w;
    }

    // Extract keyword stems from titles for duplicate checking, ignoring filler words
    function extractKeyPhrasesForDuplicates(str) {
        let cleaned = str.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
        const words = cleaned.split(' ').filter(Boolean);

        const stems = new Set();
        for (let w of words) {
            if (/^\d+$/.test(w)) continue;
            if (FILLER_WORDS.has(w)) continue;

            const stem = porterStemmer(w);
            if (stem.length < 2) continue;
            stems.add(stem);
        }
        return stems;
    }

    // Check if the given stem set matches any previously seen article as a duplicate
    function isDuplicate(stemSet) {
        const { overlapThreshold, minOverlapCount } = sensitivityLevels[sensitivity];
        for (const item of seenArticles) {
            const intersection = new Set([...stemSet].filter(k => item.keywords.has(k)));
            const ratio = intersection.size / Math.min(stemSet.size, item.keywords.size);

            if (ratio >= overlapThreshold && intersection.size >= minOverlapCount) {
                return true;
            }
        }
        return false;
    }

    // [REVISED] Main article processing function: now uses unified filtering logic.
    function removeDuplicates() {
        if (DEBUG) console.log('removeDuplicates() called');

        const articleNodes = document.querySelectorAll('div.ar');
        let localRemoved = 0;

        for (const articleNode of articleNodes) {
            if (articleNode.dataset.processed === 'true') continue;

            // Immediately hide article while processing to prevent flashing
            if (!articleNode.dataset.hidden) {
                articleNode.style.visibility = 'hidden';
                articleNode.dataset.hidden = 'true';
            }

            articleNode.dataset.processed = 'true';

            const titleNode = articleNode.querySelector(
                'a.article_title_link, a.article_magazine_title_link, a.article_title, h2.article_title, h3.article_title, [class*="article_title"]'
            );

            if (!titleNode) {
                articleNode.style.visibility = 'visible'; // Show if no title found
                continue;
            }

            const title = titleNode.textContent.trim();
            const articleUrl = getArticleUrl(articleNode);
            const descNode = articleNode.querySelector(
                '.article_magazine_content, .article_tile_content, .article_content, .snippet, [class*="content"]'
            );
            const desc = descNode ? descNode.textContent : '';

            // Unified filtering for URL, Title, and Description
            const matchedUrlWords = getMatchedBlocklistWords(articleUrl);
            const matchedTitleWords = getMatchedBlocklistWords(title);
            const matchedDescWords = getMatchedBlocklistWords(desc);

            if (matchedUrlWords.length > 0 || matchedTitleWords.length > 0 || matchedDescWords.length > 0) {
                if (DEBUG) {
                    console.log(`[Blocklist] Removing article "${title}" due to keywords. URL: [${matchedUrlWords.join(', ')}], Title: [${matchedTitleWords.join(', ')}], Desc: [${matchedDescWords.join(', ')}]`);
                }
                const blockedArticleData = {
                    title: title,
                    url: articleUrl || titleNode.href,
                    matchedUrlKeywords: matchedUrlWords,
                    matchedTitleKeywords: matchedTitleWords,
                    matchedDescriptionKeywords: matchedDescWords,
                };
                blockedArticles.push(blockedArticleData);
                GM_setValue('blockedArticles', JSON.stringify(blockedArticles));
                sessionBlockedArticles.push(blockedArticleData);
                articleNode.remove();
                blocklistCount++;
                updateMenuLabels();
                continue;
            }


            // Duplicate detection: Remove articles considered duplicates based on stem matching
            const titleStems = extractKeyPhrasesForDuplicates(title);
            if (isDuplicate(titleStems)) {
                if (DEBUG) console.log(`Duplicate found and removed: "${title}"`);
                filteredOutArticles.push({ title: title, url: articleUrl || titleNode.href });
                articleNode.remove();
                localRemoved++;
            } else {
                // Article passed all filters - show it and record for future duplicate checking
                articleNode.style.visibility = 'visible';
                seenArticles.push({ keywords: titleStems });
                GM_setValue('seenArticles', JSON.stringify(seenArticles));
                if (seenArticles.length > 1000) {
                    seenArticles.shift();
                    GM_setValue('seenArticles', JSON.stringify(seenArticles));
                }
            }
        }

        if (localRemoved > 0) {
            duplicateCount += localRemoved;
            updateMenuLabels();
            if (DEBUG) console.log(`[removeDuplicates] Removed ${localRemoved} duplicates, total duplicate removals: ${duplicateCount}`);
        }
    }

    // Show list of duplicate articles removed in current session
    function showFilteredArticles() {
        const titleText = `Duplicates (Total removed: ${duplicateCount})`;
        if (filteredOutArticles.length === 0) {
            const msg = document.createElement('p');
            msg.textContent = 'No articles have been removed as duplicates this session.';
            const btns = [{ text: 'OK', onClick: ov => ov.remove() }];
            createPopup(titleText, msg, btns);
            return;
        }

        const cont = document.createElement('div');
        const ul = document.createElement('ul');

        filteredOutArticles.forEach(art => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = art.url;
            link.target = '_blank';
            link.textContent = art.title;
            link.className = 'filtered-article-link';
            li.appendChild(link);
            ul.appendChild(li);
        });
        cont.appendChild(ul);

        const btns = [{ text: 'OK', onClick: ov => ov.remove() }];
        createPopup(titleText, cont, btns);
    }

    // Show list of blocked articles in current session with matched keywords highlighted
    function showBlockedArticles() {
        const titleText = `Blocked Articles (Total filtered: ${blocklistCount})`;
        if (sessionBlockedArticles.length === 0) {
            const msg = document.createElement('p');
            msg.textContent = 'No articles have been blocked this session.';
            const btns = [{ text: 'OK', onClick: ov => ov.remove() }];
            createPopup(titleText, msg, btns);
            return;
        }

        const cont = document.createElement('div');
        const ul = document.createElement('ul');

        sessionBlockedArticles.forEach(art => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = art.url;
            link.target = '_blank';

            let titleHtml = highlightWords(art.title, art.matchedTitleKeywords);
            if (
                art.matchedTitleKeywords.length === 0 &&
                art.matchedDescriptionKeywords.length > 0
            ) {
                titleHtml += ` <span style="background: yellow;">(Description)</span>`;
            }
            link.innerHTML = titleHtml;
            link.className = 'filtered-article-link';
            li.appendChild(link);

            if (art.matchedDescriptionKeywords && art.matchedDescriptionKeywords.length > 0) {
                const descContainer = document.createElement('div');
                descContainer.style.fontSize = '0.85em';
                descContainer.style.marginTop = '5px';
                descContainer.textContent = `*Desc Keywords: ${art.matchedDescriptionKeywords.join(', ')}`;
                li.appendChild(descContainer);
            }
            if (art.matchedUrlKeywords && art.matchedUrlKeywords.length > 0) {
                const urlContainer = document.createElement('div');
                urlContainer.style.fontSize = '0.85em';
                urlContainer.style.marginTop = '5px';
                urlContainer.style.color = '#d63384';
                urlContainer.textContent = `*URL Keywords: ${art.matchedUrlKeywords.join(', ')}`;
                li.appendChild(urlContainer);
            }
            ul.appendChild(li);
        });
        cont.appendChild(ul);

        const btns = [{ text: 'OK', onClick: ov => ov.remove() }];
        createPopup(titleText, cont, btns);
    }

    // Update userscript menu commands with current filtering counts and sensitivity options
    function updateMenuLabels() {
        Object.values(menuCommandIds).forEach(cmdId => {
            if (cmdId !== null) {
                GM_unregisterMenuCommand(cmdId);
            }
        });

        menuCommandIds.whitelistConfig = GM_registerMenuCommand(
            `Whitelist`,
            showWhitelistConfigUI
        );
        menuCommandIds.blocklistConfig = GM_registerMenuCommand(
            `Blocklist (Total filtered: ${blocklistCount})`,
            showBlocklistConfigUI
        );
        menuCommandIds.duplicates = GM_registerMenuCommand(
            `Duplicates (Total removed: ${duplicateCount})`,
            showFilteredArticles
        );
        menuCommandIds.sensitivityHigh = GM_registerMenuCommand(
            `Duplicate Sensitivity: High${sensitivity === 'High' ? ' ✔️' : ''}`,
            () => setSensitivity('High')
        );
        menuCommandIds.sensitivityMedium = GM_registerMenuCommand(
            `Duplicate Sensitivity: Medium${sensitivity === 'Medium' ? ' ✔️' : ''}`,
            () => setSensitivity('Medium')
        );
        menuCommandIds.sensitivityLow = GM_registerMenuCommand(
            `Duplicate Sensitivity: Low${sensitivity === 'Low' ? ' ✔️' : ''}`,
            () => setSensitivity('Low')
        );
    }

    // Set duplicate detection sensitivity level and save to persistent storage
    function setSensitivity(level) {
        if (!sensitivityLevels[level]) return;
        sensitivity = level;
        GM_setValue('sensitivity', sensitivity);
        showConfirmationPopup(`Duplicate detection sensitivity set to ${level}. Reload now?`);
    }

    // Initialize persistent data from storage for runtime use
    function initData() {
        seenArticles = seenArticles.map(item => ({
            keywords: new Set(Array.isArray(item.keywords) ? item.keywords : [])
        }));
        GM_setValue('seenArticles', JSON.stringify(seenArticles));
    }

    // Initialize script: setup data, menus, observers, and start article filtering
    function init() {
        if (DEBUG) console.log('Initializing Inoreader Feed Manager...');
        initData();
        updateMenuLabels();

        // Ensure blocked articles have proper keyword fields for UI display
        blockedArticles.forEach(art => {
            if (!art.matchedTitleKeywords) art.matchedTitleKeywords = [];
            if (!art.matchedDescriptionKeywords) art.matchedDescriptionKeywords = [];
            if (!art.matchedUrlKeywords) art.matchedUrlKeywords = [];
        });
        GM_setValue('blockedArticles', JSON.stringify(blockedArticles));

        let debounceTimer = null;
        const DEBOUNCE_DELAY = 50; // Reduced delay for faster response and smoother experience

        // Observe DOM for feed changes and re-run filtering as needed
        const observer = new MutationObserver(() => {
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(removeDuplicates, DEBOUNCE_DELAY);
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Initial filtering pass on page load
        removeDuplicates();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
