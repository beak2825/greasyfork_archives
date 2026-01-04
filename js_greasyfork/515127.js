// ==UserScript==
// @name         Audible MAM Checker & Manager
// @namespace    https://greasyfork.org/en/scripts/515127
// @version      1.0.2
// @description  Check if Audible books are in the MAM database with match management and persistence
// @author       andromda
// @match        https://www.audible.com/pd/*
// @match        https://www.audible.*/pd/*
// @match        https://www.audible.com/library*
// @match        https://www.audible.*/library*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/515127/Audible%20MAM%20Checker%20%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/515127/Audible%20MAM%20Checker%20%20Manager.meta.js
// ==/UserScript==

(function(VM) {
    'use strict';

    // Storage configuration
    const STORAGE = {
        KEYS: {
            MATCHES: 'mam_matches',
            IGNORED: 'mam_ignored',
            SETTINGS: 'mam_settings'
        },
        STATUS: {
            CONFIRMED: 'confirmed',
            NOT_FOUND: 'not_found',
            IGNORED: 'ignored'
        }
    };

    // Utility class for managing stored matches
    class MatchStorage {
        static getMatches() {
            return GM_getValue(STORAGE.KEYS.MATCHES, {});
        }

        static getIgnored() {
            return GM_getValue(STORAGE.KEYS.IGNORED, {});
        }

        static saveMatch(asin, status, mamId = null) {
            const matches = this.getMatches();
            matches[asin] = {
                status,
                mamId,
                timestamp: Date.now()
            };
            GM_setValue(STORAGE.KEYS.MATCHES, matches);
        }

        static ignoreBook(asin) {
            const ignored = this.getIgnored();
            ignored[asin] = {
                timestamp: Date.now()
            };
            GM_setValue(STORAGE.KEYS.IGNORED, ignored);
        }

        static isIgnored(asin) {
            const ignored = this.getIgnored();
            return !!ignored[asin];
        }

        static getMatchStatus(asin) {
            const matches = this.getMatches();
            return matches[asin] || null;
        }

        static removeMatch(asin) {
            const matches = this.getMatches();
            delete matches[asin];
            GM_setValue(STORAGE.KEYS.MATCHES, matches);
        }

        static removeIgnored(asin) {
            const ignored = this.getIgnored();
            delete ignored[asin];
            GM_setValue(STORAGE.KEYS.IGNORED, ignored);
        }
    }

    // Utility function to wait for elements to load
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }

                if (Date.now() - startTime > timeout) {
                    reject(new Error(`Timeout waiting for ${selector}`));
                    return;
                }

                requestAnimationFrame(checkElement);
            };

            checkElement();
        });
    }

    class Book {
        constructor(parentElement) {
            this.parent = parentElement;
        }

        static getBooks(type) {
            const books = document.querySelectorAll(type.mainSelector);
            books.forEach(book => {
                Book.library.add(new type(book));
            });
            return Book.library;
        }

        search(count = 0) {
            // Check if book is ignored
            if (MatchStorage.isIgnored(this.asin)) {
                return this.insertIgnored();
            }

            // Check for saved match status
            const savedMatch = MatchStorage.getMatchStatus(this.asin);
            if (savedMatch) {
                switch (savedMatch.status) {
                    case STORAGE.STATUS.CONFIRMED:
                        return this.insertConfirmedMatch(savedMatch.mamId);
                    case STORAGE.STATUS.NOT_FOUND:
                        return this.insertConfirmedNotFound();
                }
            }

            // Perform MAM search
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://www.myanonamouse.net/tor/js/loadSearchJSONbasic.php',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: this.stringify(),
                onloadend: response => {
                    if (response.status != 200) return this.insertFailure();
                    response = JSON.parse(response.response);

                    if (response.error) return this.withoutSubtitle(count);
                    else if (response.data && count === 0) return this.insertFound(response.data[0].id);
                    else if (response.data) return this.insertPossibleFound(response.data);
                }
            });
        }

        matchPercentage(text1, text2) {
            const words1 = text1.split(/\s+/).sort();
            const words2 = text2.split(/\s+/).sort();
            let matchCount = 0;

            let i = 0, j = 0;
            while (i < words1.length && j < words2.length) {
                if (words1[i] === words2[j]) {
                    matchCount++;
                    i++;
                    j++;
                } else if (words1[i] < words2[j]) {
                    i++;
                } else {
                    j++;
                }
            }
            const longestLength = Math.max(words1.length, words2.length);
            const percentage = matchCount / longestLength * 100;
            return percentage.toFixed(2).toString() + '%';
        }

        createActionLink(text, onClick, color) {
            const link = document.createElement('a');
            link.href = '#';
            link.style.color = color;
            link.style.marginLeft = '10px';
            link.style.textDecoration = 'underline';
            link.textContent = text;
            link.onclick = (e) => {
                e.preventDefault();
                onClick();
            };
            return link;
        }

        createListElement(...styles) {
            const li = document.createElement('li');
            styles.forEach(style => {
                li.classList.add(style);
            });
            return li;
        }

        createSpanElement(text, color, ...styles) {
            const span = document.createElement('span');
            styles.forEach(style => {
                span.classList.add(style);
            });
            span.style.color = color;
            span.textContent = text;
            return span;
        }

        createAnchorElement(text, href, color, ...styles) {
            const anchor = document.createElement('a');
            styles.forEach(style => {
                anchor.classList.add(style);
            });
            anchor.style.color = color;
            anchor.href = href;
            anchor.textContent = text;
            anchor.target = '_blank';
            return anchor;
        }

        hasSubtitle(text) {
            const delimiters = [':', '-', '|'];
            for (const delimiter of delimiters) {
                if (text.includes(delimiter)) {
                    return delimiter;
                }
            }
            return false;
        }

        withoutSubtitle(count) {
            const delimiter = this.hasSubtitle(this.title);
            if (!delimiter) return this.insertNotFound();

            this.title = this.removeSubtitle(delimiter);
            this.searchLink = this.createSearchLink();
            this.search(++count);
        }

        removeSubtitle(delimiter) {
            this.origTitle = this.title;
            return this.title.split(delimiter)[0].trim();
        }

        createSearchLink() {
            const query = new URLSearchParams([
                ['tor[text]', this.toString()],
                ['tor[srchIn][author]', 'true'],
                ['tor[srchIn][description]', 'true'],
                ['tor[srchIn][filenames]', 'true'],
                ['tor[srchIn][narrator]', 'true'],
                ['tor[srchIn][series]', 'true'],
                ['tor[srchIn][tags]', 'true'],
                ['tor[srchIn][title]', 'true'],
                ['tor[searchIn]', 'torrents'],
                ['tor[searchType]', 'active'],
                ['tor[main_cat]', '13']
            ]);
            return new URL(`https://www.myanonamouse.net/tor/browse.php?${query}`).toString();
        }

        toString() {
            return `${this.getAuthorString()} ${this.getTitleString()}`;
        }

        stringify() {
            return JSON.stringify({
                tor: {
                    text: this.toString(),
                    srchIn: {
                        author: 'true',
                        description: 'true',
                        filenames: 'true',
                        narrator: 'true',
                        series: 'true',
                        tags: 'true',
                        title: 'true'
                    },
                    searchType: 'active',
                    searchIn: 'torrents',
                    main_cat: ['13'],
                    browseFlagsHideVsShow: '0',
                    startDate: '',
                    endDate: '',
                    hash: '',
                    sortType: 'default',
                    startNumber: '0'
                }
            });
        }

        getTitleString() {
            const withSpace = new RegExp('(?<=\\S)[;:,.\\-—](?=\\S)', 'g');
            const withoutSpace = new RegExp('[;:,.\\-—]', 'g');
            const specialCharacters = new RegExp('[^a-zA-Z0-9\\s]', 'g');
            return this.title.replace(withSpace, ' ').replace(withoutSpace, '').replace(specialCharacters, '');
        }

        getAuthorString() {
            return this.authors;
        }

        cleanName(name) {
            const titlesToRemove = [
                "PhD", "MD", "JD", "MBA", "MA", "MS", "MSc", "MFA", "MEd", "ScD", "DrPH", "MPH",
                "LLM", "DDS", "DVM", "EdD", "PsyD", "ThD", "DO", "PharmD", "DSc", "DBA", "RN",
                "CPA", "Esq.", "LCSW", "PE", "AIA", "FAIA", "CSP", "CFP", "Jr.", "Sr.", "I",
                "II", "III", "IV", "Dr.", "Mr.", "Mrs.", "Ms.", "Prof.", "Rev.", "Fr.", "Sr.",
                "Capt.", "Col.", "Gen.", "Lt.", "Cmdr.", "Adm.", "Sir", "Dame", "Hon.", "Amb.",
                "Gov.", "Sen.", "Rep.", "BSN", "MSN", "RN", "MS", "MN"
            ];

            let cleanedName = name.trim();

            titlesToRemove.forEach(title => {
                const regexBefore = new RegExp(`^${title}\\b`, 'i');
                const regexAfter = new RegExp(`\\b${title}$`, 'i');
                cleanedName = cleanedName.replace(regexBefore, '').replace(regexAfter, '');
            });

            titlesToRemove.forEach(title => {
                const regexMiddle = new RegExp(`\\s${title}\\s`, 'gi');
                cleanedName = cleanedName.replace(regexMiddle, ' ');
            });

            return cleanedName.replace(/\s+/g, ' ').trim();
        }
    }
    Book.loginURL = 'https://www.myanonamouse.net/login.php';
    Book.library = new Set();

      class AudibleProduct extends Book {
        constructor(bookElement) {
            super(bookElement);
            this.initialize();
        }

        async initialize() {
            try {
                await this.waitForPageContent();
                this.title = await this.getTitle();
                this.authors = await this.getAuthors();
                this.asin = this.getASIN();
                this.searchLink = this.createSearchLink();
                this.search();
            } catch (error) {
                console.error('Error initializing AudibleProduct:', error);
            }
        }

        async waitForPageContent() {
            await Promise.all([
                waitForElement('h1'),
                waitForElement('.author-link, a[data-automation-id="author-link"], .authorLabel a, .product-author-link')
            ]);
        }

        async getTitle() {
            const titleSelectors = [
                'h1[data-automation-id="title"]',
                'h1.bc-heading',
                'h1'
            ];

            for (const selector of titleSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    return element.textContent.trim();
                }
            }

            throw new Error('Could not find title element');
        }

        async getAuthors() {
            const authorSelectors = [
                'a[data-automation-id="author-link"]',
                '.author-link',
                '.authorLabel a',
                '.product-author-link'
            ];

            const authors = [];
            for (const selector of authorSelectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    elements.forEach(author => {
                        const authorName = this.cleanName(author.textContent.trim());
                        if (authorName && !authors.includes(authorName)) {
                            authors.push(authorName);
                        }
                    });
                    break;
                }
            }

            return authors.join(", ");
        }

        getASIN() {
            const urlMatch = window.location.pathname.match(/\/([A-Z0-9]{10})/);
            if (urlMatch && urlMatch[1]) {
                return urlMatch[1];
            }

            const productDetails = document.querySelector('[data-asin]');
            if (productDetails) {
                return productDetails.getAttribute('data-asin');
            }

            const urlParams = new URLSearchParams(window.location.search);
            const asin = urlParams.get('asin');
            if (asin) {
                return asin;
            }

            return null;
        }

        createStatusDiv() {
            const div = document.createElement('div');
            div.className = 'mam-status';
            div.style.cssText = `
                margin: 20px 0;
                padding: 10px;
                border-radius: 4px;
                font-size: 14px;
                font-weight: bold;
                background-color: #f8f8f8;
                border: 1px solid #e0e0e0;
            `;
            return div;
        }

        insertStatus(div, text, link, color, prefix = 'MAM Status: ') {
            div.innerHTML = `
                <span style="color: ${color}">
                    ${prefix}<a href="${link}" target="_blank" style="color: ${color}; text-decoration: underline;">${text}</a>
                </span>
            `;

            const insertionPoints = [
                '.buybox-regular-price',
                '.buybox-membership-price',
                '.merchandising-buybox',
                '#reviews-medley-header',
                '.about-this-audiobook'
            ];

            for (const selector of insertionPoints) {
                const target = document.querySelector(selector);
                if (target) {
                    target.parentNode.insertBefore(div, target);
                    break;
                }
            }
        }

        insertActionLinks(div, actions) {
            const actionsDiv = document.createElement('div');
            actionsDiv.style.marginTop = '5px';
            actionsDiv.style.fontSize = '12px';

            actions.forEach(action => {
                actionsDiv.appendChild(this.createActionLink(action.text, action.onClick, action.color));
            });

            div.appendChild(actionsDiv);
        }

        insertPossibleFound(data) {
            const statusDiv = this.createStatusDiv();
            const text = `Possible Match Found (${this.matchPercentage(this.origTitle, data[0].title)})`;
            this.insertStatus(statusDiv, text, this.searchLink, 'orange');

            this.insertActionLinks(statusDiv, [
                {
                    text: '✓ Confirm Match',
                    onClick: () => {
                        MatchStorage.saveMatch(this.asin, STORAGE.STATUS.CONFIRMED, data[0].id);
                        this.insertConfirmedMatch(data[0].id);
                    },
                    color: 'green'
                },
                {
                    text: '✗ Not Found',
                    onClick: () => {
                        MatchStorage.saveMatch(this.asin, STORAGE.STATUS.NOT_FOUND);
                        this.insertConfirmedNotFound();
                    },
                    color: 'red'
                },
                {
                    text: '⌀ Ignore',
                    onClick: () => {
                        MatchStorage.ignoreBook(this.asin);
                        this.insertIgnored();
                    },
                    color: 'gray'
                }
            ]);
        }

        insertIgnored() {
            const statusDiv = this.createStatusDiv();
            this.insertStatus(statusDiv, 'Ignored', '#', 'gray');

            this.insertActionLinks(statusDiv, [{
                text: 'Unignore',
                onClick: () => {
                    MatchStorage.removeIgnored(this.asin);
                    this.search();
                },
                color: 'blue'
            }]);
        }

        insertConfirmedMatch(mamId) {
            const statusDiv = this.createStatusDiv();
            const mamUrl = `https://www.myanonamouse.net/t/${mamId}`;
            this.insertStatus(statusDiv, 'Confirmed Match!', mamUrl, 'green');

            this.insertActionLinks(statusDiv, [{
                text: 'Remove Confirmation',
                onClick: () => {
                    MatchStorage.removeMatch(this.asin);
                    this.search();
                },
                color: 'orange'
            }]);
        }

        insertConfirmedNotFound() {
            const statusDiv = this.createStatusDiv();
            this.insertStatus(statusDiv, 'Confirmed Not Found', this.searchLink, 'red');

            this.insertActionLinks(statusDiv, [{
                text: 'Remove Confirmation',
                onClick: () => {
                    MatchStorage.removeMatch(this.asin);
                    this.search();
                },
                color: 'orange'
            }]);
        }

        insertNotFound() {
            const statusDiv = this.createStatusDiv();
            this.insertStatus(statusDiv, 'Not Found!', this.searchLink, 'red');

            this.insertActionLinks(statusDiv, [{
                text: '⌀ Ignore',
                onClick: () => {
                    MatchStorage.ignoreBook(this.asin);
                    this.insertIgnored();
                },
                color: 'gray'
            }]);
        }

        insertFound(mamId) {
            const statusDiv = this.createStatusDiv();
            const mamUrl = `https://www.myanonamouse.net/t/${mamId}`;
            this.insertStatus(statusDiv, 'Found!', mamUrl, 'green');

            this.insertActionLinks(statusDiv, [
                {
                    text: '✓ Confirm Match',
                    onClick: () => {
                        MatchStorage.saveMatch(this.asin, STORAGE.STATUS.CONFIRMED, mamId);
                        this.insertConfirmedMatch(mamId);
                    },
                    color: 'green'
                },
                {
                    text: '⌀ Ignore',
                    onClick: () => {
                        MatchStorage.ignoreBook(this.asin);
                        this.insertIgnored();
                    },
                    color: 'gray'
                }
            ]);
        }

        insertFailure() {
            const statusDiv = this.createStatusDiv();
            this.insertStatus(statusDiv, 'Are you logged in?', Book.loginURL, 'red', 'MAM ERROR: ');
        }
    }

    class AudibleLibrary extends Book {
        constructor(bookElement) {
            super(bookElement);
            this.isAudiobook = true;
            this.title = this.getTitle(AudibleLibrary);
            this.authors = this.getAuthors(AudibleLibrary);
            this.asin = this.getASIN();
            this.searchLink = this.createSearchLink();
            this.search();
        }

        getTitle() {
            return this.parent.querySelector('li a span.bc-text').textContent.trim();
        }

        getAuthors() {
            const authors = [];
            const authorElements = this.parent.querySelectorAll('li span.authorLabel a');
            for (let element of authorElements) {
                if (element) {
                    let authorName = this.cleanName(element.textContent.trim());
                    if (authorName && !authors.includes(authorName)) {
                        authors.push(authorName);
                    }
                }
            }
            return authors.join(", ");
        }

        getASIN() {
            const asinMatch = this.parent.querySelector('a[data-asin]');
            if (asinMatch) {
                return asinMatch.getAttribute('data-asin');
            }

            const linkElement = this.parent.querySelector('a[href*="/pd/"]');
            if (linkElement) {
                const urlMatch = linkElement.href.match(/\/([A-Z0-9]{10})/);
                if (urlMatch && urlMatch[1]) {
                    return urlMatch[1];
                }
            }

            return null;
        }

        insertPossibleFound(data) {
            const li = this.createListElement('bc-list-item', 'bc-list-item');
            const span = this.createSpanElement('MAM Status: ', 'orange', 'bc-text', 'authorLabel', 'bc-color-secondary');
            const text = `Possible Match Found (${this.matchPercentage(this.origTitle, data[0].title)})`;
            const anchor = this.createAnchorElement(text, this.searchLink, 'orange', 'bc-link', 'bc-color-base');

            li.appendChild(span.appendChild(anchor).parentElement);

            const actionsDiv = document.createElement('div');
            actionsDiv.style.marginTop = '5px';
            actionsDiv.style.fontSize = '12px';

            const actions = [
                {
                    text: '✓ Confirm Match',
                    onClick: () => {
                        MatchStorage.saveMatch(this.asin, STORAGE.STATUS.CONFIRMED, data[0].id);
                        this.insertConfirmedMatch(data[0].id);
                    },
                    color: 'green'
                },
                {
                    text: '✗ Not Found',
                    onClick: () => {
                        MatchStorage.saveMatch(this.asin, STORAGE.STATUS.NOT_FOUND);
                        this.insertConfirmedNotFound();
                    },
                    color: 'red'
                },
                {
                    text: '⌀ Ignore',
                    onClick: () => {
                        MatchStorage.ignoreBook(this.asin);
                        this.insertIgnored();
                    },
                    color: 'gray'
                }
            ];

            actions.forEach(action => {
                actionsDiv.appendChild(this.createActionLink(action.text, action.onClick, action.color));
            });

            li.appendChild(actionsDiv);

            return this.parent.children[2].insertAdjacentElement('afterend', li);
        }

        insertNotFound() {
            const li = this.createListElement();
            const span = this.createSpanElement('MAM Status: ', 'red');
            const anchor = this.createAnchorElement('Not Found!', this.searchLink, 'red');
            li.appendChild(span.appendChild(anchor).parentElement);

            const actionsDiv = document.createElement('div');
            actionsDiv.style.marginTop = '5px';
            actionsDiv.style.fontSize = '12px';
            actionsDiv.appendChild(this.createActionLink('⌀ Ignore', () => {
                MatchStorage.ignoreBook(this.asin);
                this.insertIgnored();
            }, 'gray'));

            li.appendChild(actionsDiv);

            return this.parent.children[2].insertAdjacentElement('afterend', li);
        }

        insertFound(mamId) {
            const li = this.createListElement();
            const span = this.createSpanElement('MAM Status: ', 'green');
            const mamUrl = `https://www.myanonamouse.net/t/${mamId}`;
            const anchor = this.createAnchorElement('Found!', mamUrl, 'green');
            li.appendChild(span.appendChild(anchor).parentElement);

            const actionsDiv = document.createElement('div');
            actionsDiv.style.marginTop = '5px';
            actionsDiv.style.fontSize = '12px';

            const actions = [
                {
                    text: '✓ Confirm Match',
                    onClick: () => {
                        MatchStorage.saveMatch(this.asin, STORAGE.STATUS.CONFIRMED, mamId);
                        this.insertConfirmedMatch(mamId);
                    },
                    color: 'green'
                },
                {
                    text: '⌀ Ignore',
                    onClick: () => {
                        MatchStorage.ignoreBook(this.asin);
                        this.insertIgnored();
                    },
                    color: 'gray'
                }
            ];

            actions.forEach(action => {
                actionsDiv.appendChild(this.createActionLink(action.text, action.onClick, action.color));
            });

            li.appendChild(actionsDiv);

            return this.parent.children[2].insertAdjacentElement('afterend', li);
        }

        insertFailure() {
            const li = this.createListElement();
            const span = this.createSpanElement('MAM ERROR: ', 'red');
            const anchor = this.createAnchorElement('Are you logged in?', Book.loginURL, 'red');
            li.appendChild(span.appendChild(anchor).parentElement);
            return this.parent.children[2].insertAdjacentElement('afterend', li);
        }


      insertIgnored() {
            const li = this.createListElement();
            const span = this.createSpanElement('MAM Status: ', 'gray');
            const anchor = this.createAnchorElement('Ignored', '#', 'gray');
            li.appendChild(span.appendChild(anchor).parentElement);

            const actionsDiv = document.createElement('div');
            actionsDiv.style.marginTop = '5px';
            actionsDiv.style.fontSize = '12px';
            actionsDiv.appendChild(this.createActionLink('Unignore', () => {
                MatchStorage.removeIgnored(this.asin);
                this.search();
            }, 'blue'));

            li.appendChild(actionsDiv);

            return this.parent.children[2].insertAdjacentElement('afterend', li);
        }

        insertConfirmedMatch(mamId) {
            const li = this.createListElement();
            const span = this.createSpanElement('MAM Status: ', 'green');
            const mamUrl = `https://www.myanonamouse.net/t/${mamId}`;
            const anchor = this.createAnchorElement('Confirmed Match!', mamUrl, 'green');
            li.appendChild(span.appendChild(anchor).parentElement);

            const actionsDiv = document.createElement('div');
            actionsDiv.style.marginTop = '5px';
            actionsDiv.style.fontSize = '12px';
            actionsDiv.appendChild(this.createActionLink('Remove Confirmation', () => {
                MatchStorage.removeMatch(this.asin);
                this.search();
            }, 'orange'));

            li.appendChild(actionsDiv);

            return this.parent.children[2].insertAdjacentElement('afterend', li);
        }

        insertConfirmedNotFound() {
            const li = this.createListElement();
            const span = this.createSpanElement('MAM Status: ', 'red');
            const anchor = this.createAnchorElement('Confirmed Not Found', this.searchLink, 'red');
            li.appendChild(span.appendChild(anchor).parentElement);

            const actionsDiv = document.createElement('div');
            actionsDiv.style.marginTop = '5px';
            actionsDiv.style.fontSize = '12px';
            actionsDiv.appendChild(this.createActionLink('Remove Confirmation', () => {
                MatchStorage.removeMatch(this.asin);
                this.search();
            }, 'orange'));

            li.appendChild(actionsDiv);

            return this.parent.children[2].insertAdjacentElement('afterend', li);
        }
    }

    AudibleLibrary.mainSelector = '.adbl-library-content-row ul.bc-list.bc-list-nostyle';

    // Initialize on page load and when content changes
    VM.observe(document.body, () => {
        const currentUrl = window.location.href.toLowerCase();

        // Handle different page types
        if (currentUrl.includes('/pd/')) {
            new AudibleProduct(document.body);
        } else if (currentUrl.includes('/library')) {
            Book.getBooks(AudibleLibrary);
        }

        return true;
    });

})(VM);