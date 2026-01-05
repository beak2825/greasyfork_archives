// ==UserScript==
// @name            GoodReads2BB-mod
// @namespace       varb
// @version         0.9.10
// @description     Creates requests for GoodReads titles (Dereferer Toggle)
// @match           *://www.goodreads.com/book/show/*
// @match           https://bibliotik.me/requests/create/ebooks*
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_openInTab
// @grant           GM_xmlhttpRequest
// @grant           unsafeWindow
// @run-at          document-end
// @license         WTFPL Version 2; http://www.wtfpl.net/txt/copying/
// @downloadURL https://update.greasyfork.org/scripts/11871/GoodReads2BB-mod.user.js
// @updateURL https://update.greasyfork.org/scripts/11871/GoodReads2BB-mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // IMMEDIATE DEBUG OUTPUT
    console.log('gr2bb: Script v0.9.10 starting...');

    // Configuration
    var use_imgur = true;
    var client_id = "0d64b2a5aae51e8"; // Replace with your Imgur client ID if needed
//var client_key="YOUR_IMGUR_CLIENT_KEY";  // Not necessary for end-users
    var debug = true; // Enable debug for initial testing
    var checkboxesEnabledByDefault = ["Amazon", "Barnes & Noble", "Google Play"];

    // Global flag to prevent duplicate initialization
    if (window.gr2bbInitialized) {
        console.log('gr2bb: Already initialized, skipping...');
        return;
    }
    window.gr2bbInitialized = true;

    // Load saved dereferer preference (default to enabled)
    var useDereferer = GM_getValue('useDereferer', true);

    // ISBN/ASIN Conversion Functions
    function isbn13to10(isbn13) {
        isbn13 = isbn13.replace(/[^0-9X]/gi, '');
        if (isbn13.length !== 13 || !isbn13.startsWith('978')) return null;

        const isbn9 = isbn13.substring(3, 12);
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(isbn9[i]) * (10 - i);
        }

        let checkDigit = (11 - (sum % 11)) % 11;
        if (checkDigit === 10) checkDigit = 'X';

        return isbn9 + checkDigit;
    }

    function isbn10to13(isbn10) {
        isbn10 = isbn10.replace(/[^0-9X]/gi, '');
        if (isbn10.length !== 10) return null;

        const isbn12 = '978' + isbn10.substring(0, 9);
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            const digit = parseInt(isbn12[i]);
            sum += (i % 2 === 0) ? digit : digit * 3;
        }

        const checkDigit = (10 - (sum % 10)) % 10;
        return isbn12 + checkDigit;
    }

    function getBookIdentifiers(allIds) {
        const result = {
            original: null,
            type: null,
            isbn10: null,
            isbn13: null,
            asin: null,
            displayText: null,
            displayLabel: null
        };

        // Handle legacy single identifier string
        if (typeof allIds === 'string') {
            const identifiers = {
                primary: allIds,
                isbn13: null,
                isbn10: null,
                asin: null
            };

            const cleaned = allIds.replace(/[^0-9A-Z]/gi, '');

            if (/^B[0-9A-Z]{9}$/.test(cleaned)) {
                identifiers.asin = cleaned;
            } else if (cleaned.length === 13 && /^\d{13}$/.test(cleaned)) {
                identifiers.isbn13 = cleaned;
                identifiers.isbn10 = isbn13to10(cleaned);
            } else if (cleaned.length === 10 && /^\d{9}[\dX]$/.test(cleaned)) {
                identifiers.isbn10 = cleaned;
                identifiers.isbn13 = isbn10to13(cleaned);
            }

            allIds = identifiers;
        }

        // Extract values from the identifiers object
        result.isbn13 = allIds.isbn13;
        result.isbn10 = allIds.isbn10;
        result.asin = allIds.asin;
        result.original = allIds.primary;

        // Handle N/A case
        if (!result.isbn13 && !result.isbn10 && !result.asin) {
            result.displayLabel = 'ISBN';
            result.displayText = 'N/A';
            return result;
        }

        // Build display text based on available identifiers
        let displayParts = [];
        let hasUniqueIsbn10 = false;

        // Check if ISBN-10 is unique (not just derived from ISBN-13)
        if (result.isbn13 && result.isbn10) {
            const derivedIsbn10 = isbn13to10(result.isbn13);
            hasUniqueIsbn10 = result.isbn10 !== derivedIsbn10;
        }

        // Format ISBN part
        if (result.isbn13 && result.isbn10 && hasUniqueIsbn10) {
            // Both ISBN-13 and unique ISBN-10 exist
            displayParts.push(`${result.isbn13} (${result.isbn10})`);
        } else if (result.isbn13) {
            // Only ISBN-13 (or ISBN-10 is derived)
            displayParts.push(result.isbn13);
        } else if (result.isbn10) {
            // Only ISBN-10
            displayParts.push(result.isbn10);
        }

        // Add ASIN if it exists and is different from ISBN-10
        if (result.asin && result.asin !== result.isbn10) {
            displayParts.push(result.asin);
        }

        // Set display label and text
        if (displayParts.length === 1) {
            // Only one identifier
            if (result.asin && !result.isbn13 && !result.isbn10) {
                result.displayLabel = 'ASIN';
            } else {
                result.displayLabel = 'ISBN';
            }
            result.displayText = displayParts[0];
        } else {
            // Multiple identifiers
            result.displayLabel = 'ISBN / ASIN';
            result.displayText = displayParts.join(' / ');
        }

        console.log('gr2bb: Book identifiers:', result);
        return result;
    }

    // Main initialization function
    function initGR2BB() {
        console.log('gr2bb: initGR2BB called');

        // Check if we already have a B button
        if (document.getElementById('bbreq')) {
            console.log('gr2bb: B button already exists, skipping initialization');
            return;
        }

        // Check for jQuery in different places
        if (typeof window.jQuery !== 'undefined') {
            console.log('gr2bb: jQuery already present (window.jQuery)');
            startScript(window.jQuery);
        } else if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.jQuery !== 'undefined') {
            console.log('gr2bb: jQuery found in unsafeWindow');
            window.jQuery = unsafeWindow.jQuery;
            window.$ = unsafeWindow.$;
            startScript(window.jQuery);
        } else {
            console.log('gr2bb: jQuery not found, loading it...');
            loadJQuery();
        }
    }

    // Load jQuery dynamically
    function loadJQuery() {
        const script = document.createElement('script');
        script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
        script.onload = function() {
            console.log('gr2bb: jQuery script tag loaded');
            // Wait a moment for jQuery to initialize
            setTimeout(function() {
                if (typeof window.jQuery !== 'undefined') {
                    console.log('gr2bb: jQuery is now available');
                    loadFancybox();
                } else {
                    console.error('gr2bb: jQuery still not available after loading!');
                    // Try one more time with unsafeWindow
                    if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.jQuery !== 'undefined') {
                        window.jQuery = unsafeWindow.jQuery;
                        window.$ = unsafeWindow.$;
                        console.log('gr2bb: Found jQuery in unsafeWindow after load');
                        loadFancybox();
                    }
                }
            }, 100);
        };
        script.onerror = function() {
            console.error('gr2bb: Failed to load jQuery!');
        };
        document.head.appendChild(script);
    }

    // Load Fancybox
    function loadFancybox() {
        // Load Fancybox CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.css';
        document.head.appendChild(link);

        // Load Fancybox JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.pack.js';
        script.onload = function() {
            console.log('gr2bb: Fancybox loaded');
            if (window.jQuery) {
                startScript(window.jQuery);
            } else {
                console.error('gr2bb: jQuery lost after Fancybox load!');
            }
        };
        script.onerror = function() {
            console.error('gr2bb: Failed to load Fancybox!');
            // Continue anyway with jQuery
            if (window.jQuery) {
                startScript(window.jQuery);
            }
        };
        document.head.appendChild(script);
    }

    // Main script logic
    function startScript($) {
        // Safety check
        if (!$ || typeof $ !== 'function') {
            console.error('gr2bb: Invalid jQuery object passed to startScript');
            return;
        }

        console.log('gr2bb: Starting main script');

        // Try to get jQuery version safely
        try {
            if ($.fn && $.fn.jquery) {
                console.log('gr2bb: jQuery version:', $.fn.jquery);
            }
        } catch (e) {
            console.log('gr2bb: Could not get jQuery version, but continuing...');
        }

        // Determine which site we're on
        if (location.hostname.indexOf('goodreads') !== -1) {
            console.log('gr2bb: On GoodReads, initializing...');
            // Wait a bit for React to settle
            setTimeout(function() {
                onGR($);
            }, 2000);
        } else if (location.hostname.indexOf('bibliotik') !== -1) {
            console.log('gr2bb: On Bibliotik, initializing...');
            onReq($);
        }
    }

    // GoodReads main function
    function onGR($) {
        console.log('gr2bb: onGR function called');

        // Check again for existing button
        if (document.getElementById('bbreq')) {
            console.log('gr2bb: B button already exists in onGR, skipping');
            return;
        }

        var reqid = Math.random().toString(16).substr(2);

        // Book metadata with modern extraction
        var book = scrapeBookData($);

        // No book metadata - abandon ship
        if (!book) {
            console.error('gr2bb: Failed to extract book data');
            return;
        }

        console.log('gr2bb: Book data extracted:', book);

        // Store reference for inner functions
        var stores = {};

        function generateImgurLink() {
            if (use_imgur) {
                // Get the image using modern selectors
                const imgSelectors = [
                    '.BookCover__image img',
                    '.BookPage__bookCover img',
                    '[data-testid="bookCover"] img',
                    '.ResponsiveImage',
                    'img[alt*="cover"]',
                    '.bookCoverPrimary img',
                    '#coverImage'
                ];

                for (let selector of imgSelectors) {
                    const img = $(selector).first();
                    if (img.length) {
                        anonymous_send_imgur(img[0]);
                        break;
                    }
                }
            }
        }

        // Request form HTML with improved styling - FIXED with placeholder for buttons
        var reqhtml = '<div id="bbreqwrap"><form>' +
                        '<div class="left-column">' +
                          '<textarea name="notes" id="ta_notes"></textarea>' +
                          'Tags:<br/>' +
                          '<textarea name="tags" id="ta_tags"></textarea>' +
                        '</div>' +
                        '<div class="right-column">' +
                          '<ul></ul>' +
                          '<div class="store-buttons"></div>' +
                          '<div class="dereferer-toggle"></div>' +
                          '<button id="request" type="submit" class="action-button">Request</button>' +
                          '<button type="button" id="genimgur" class="action-button secondary">Generate Imgur Cover</button>' +
                        '</div>' +
                      '</form></div>';

        // Event Handlers
        var $req = $(reqhtml).appendTo('body').on('submit', 'form', function() {
            book.notes = this.notes.value;
            book.tags = this.tags.value;
            book.finalized = true;
            GM_setValue('book' + reqid, JSON.stringify(book));
            GM_openInTab('https://bibliotik.me/requests/create/ebooks?reqid=' + reqid);
            if ($.fancybox) {
                $.fancybox.close();
            }
            return false;
        });

        // Generate Imgur Cover button
        $('#genimgur', $req).on('click', function() {
            if (debug) console.log('gr2bb: genimgur callback');
            generateImgurLink();
            if (debug) console.log('gr2bb: genimgur finished');
        });

        // Notes textarea with description - FIXED to include publisher
        var $notes = $('textarea#ta_notes', $req).on('refresh', function() {
            var finaltext;
            if (debug) console.log('gr2bb: textarea#ta_notes callback refresh');

            try {
                if (!book.finalized) {
                    finaltext = '[img]' + book.cover + '[/img]\n\n' +
                        (book.isbn && book.isbn !== 'NA' ? '[b]' + book.isbnstring + '[/b]: ' + book.isbnDisplay + '\n' : '') +
                        (book.expectedpubdate ? '[b]Expected Publication Date[/b]: ' + book.expectedpubdate + '\n' :
                            (book.pubyear && book.pubyear !== 'XXXX' ? '[b]Published[/b]: ' + book.pubyear + '\n' : '')) +
                        (book.pages ? '[b]Pages[/b]: ' + book.pages + '\n' : '') +
                        '\n[url=' + document.location.protocol + '//' + location.host + location.pathname + ']GoodReads[/url]\n' +
                        (stores.Libraries ? '[url=' + stores.Libraries.url + ']Libraries[/url]\n' : '') +
                        (stores.OverDrive && stores.OverDrive.chk ? (
                            stores.OverDrive.available === false ?
                                '[s][url=' + stores.OverDrive.url + ']OverDrive[/url] (eBook search)[/s]\n' :
                                '[url=' + stores.OverDrive.url + ']OverDrive[/url] (eBook search)\n'
                        ) : '') +
                        '\n[b]Online Stores[/b]\n' +
                        listStores(stores) + '\n' +
                        '[quote]' + book.about + '[/quote]';
                } else {
                    finaltext = book.notes;
                    book.finalized = false;
                }
            } catch (e) {
                console.log('gr2bb ERROR: ' + e);
            }
            $(this).val(finaltext);
        });

        // Tags textarea
        var $tags = $('textarea#ta_tags', $req).on('refresh', function() {
            var finaltags;
            if (debug) console.log('gr2bb: textarea#ta_tags event refresh');
            try {
                finaltags = book.tags;
            } catch (e) {
                console.log('gr2bb ERROR: ' + e);
            }
            $(this).val(finaltags);
        });

        // Store user edits to tags
        $('textarea#ta_tags', $req).on('focusout', function() {
            if (debug) console.log('gr2bb: textarea#ta_tags event focusout');
            try {
                book.tags = this.value;
            } catch (e) {
                console.log('gr2bb ERROR: ' + e);
            }
            $(this).val(book.tags);
        });

        // External resources - stores
        var $storelist = $('ul', $req);

        // Try to find store links with modern selectors
        extractStoreLinks($, stores, $storelist, book);

        // After stores are added, calculate and set dynamic width
        setTimeout(function() {
            calculateAndSetModalWidth($, stores);
            alignTagsTextarea($);
        }, 100);

        $storelist.on('change', '.store', function() {
            var $self = $(this);
            if (debug) console.log("storelist change");
            stores[$self.data('store')].chk = $self.is(':checked');
            $notes.trigger('refresh');
        });

        // Request link "B" button
        console.log('gr2bb: Adding B button to page');
        $('<a/>', { id: 'bbreq', href: '#bbreqwrap' }).text('B').appendTo('body');

        // Initialize Fancybox if available
        if ($.fancybox) {
            $('#bbreq').fancybox({
                afterLoad: function() {
                    if (debug) console.log('gr2bb trigger: notes');
                    $notes.trigger('refresh');
                    if (debug) console.log('gr2bb trigger: tags');
                    $tags.trigger('refresh');
                    // Recalculate width when opened
                    calculateAndSetModalWidth($, stores);
                    // Align tags textarea with button bottom
                    setTimeout(function() {
                        alignTagsTextarea($);
                    }, 50);
                }
            });
        } else {
            console.warn('gr2bb: Fancybox not available, using basic modal');
            $('#bbreq').on('click', function(e) {
                e.preventDefault();
                $('#bbreqwrap').show();
                $notes.trigger('refresh');
                $tags.trigger('refresh');
                // Recalculate width when opened
                calculateAndSetModalWidth($, stores);
                // Align tags textarea with button bottom
                setTimeout(function() {
                    alignTagsTextarea($);
                }, 50);
            });
        }

        // Function to calculate and set dynamic modal width
        function calculateAndSetModalWidth($, stores) {
            // Find the longest store name
            let maxLength = 0;
            for (let storeName in stores) {
                if (storeName !== 'Libraries' && storeName.length > maxLength) {
                    maxLength = storeName.length;
                }
            }

            // Calculate optimal width based on longest store name
            // Base width of 720px works well for short names
            // Add ~8px per character over 15 characters
            const baseWidth = 720;
            const extraChars = Math.max(0, maxLength - 15);
            const additionalWidth = extraChars * 8;
            const optimalWidth = Math.min(baseWidth + additionalWidth, 900); // Cap at 900px

            // Adjust the modal width
            $('#bbreqwrap').css('width', optimalWidth + 'px');

            // Adjust column proportions based on width
            // Wider modals need less right column percentage
            const rightColumnPercent = optimalWidth > 800 ? 30 : 34;
            const leftColumnPercent = 100 - rightColumnPercent - 2; // 2% for spacing

            $('#bbreqwrap .left-column').css('width', leftColumnPercent + '%');
            $('#bbreqwrap .right-column').css('width', rightColumnPercent + '%');

            console.log('gr2bb: Set modal width to', optimalWidth, 'px for max store name length of', maxLength);
        }

        // Function to align tags textarea bottom with Generate Imgur Cover button
        function alignTagsTextarea($) {
            // Get the right column elements
            const $rightColumn = $('#bbreqwrap .right-column');
            if (!$rightColumn.length) return;

            // Get positions and heights
            const $notesTextarea = $('#bbreqwrap textarea#ta_notes');
            const $tagsTextarea = $('#bbreqwrap textarea#ta_tags');
            const $genImgurBtn = $('#genimgur');
            const $requestBtn = $('#request');

            if (!$genImgurBtn.length || !$tagsTextarea.length) return;

            // Get the absolute position of the Generate Imgur button's bottom edge
            const modalTop = $('#bbreqwrap').offset().top;
            const genImgurOffset = $genImgurBtn.offset();
            const genImgurBottom = genImgurOffset.top + $genImgurBtn.outerHeight() - modalTop;

            // Get the position of the notes textarea
            const notesOffset = $notesTextarea.offset();
            const notesBottom = notesOffset.top + $notesTextarea.outerHeight() - modalTop;

            // Account for the "Tags:" label (approximately 25px with margins)
            const labelAndMargin = 25;

            // Calculate available height for tags textarea
            const availableHeight = genImgurBottom - notesBottom - labelAndMargin;

            // Set minimum height of 40px and maximum of 80px
            const newHeight = Math.max(40, Math.min(80, availableHeight));

            $tagsTextarea.css('height', newHeight + 'px');
            console.log('gr2bb: Set tags textarea height to', newHeight, 'px');
        }

        function listStores(s) {
            var list = '';
            for (var store in s) {
                if (store === 'Libraries' || store === 'OverDrive' || !s[store].chk) continue;

                list += '[url=' + s[store].url + ']' + store + '[/url]';
                if (store == "Google Play" && book.isbn && book.isbn !== 'NA') {
                    list += ' / [url=' + deref('https://books.google.com/books?isbn=' + book.isbn) + ']Google Books[/url]';
                }
                list += '\n';

                if (debug) console.log('gr2bb:' + store);
            }
            return list;
        }

        // Check OverDrive availability asynchronously
        function checkOverDriveAndUpdate(book, stores) {
            if (!book.title) return;

            let searchQuery = book.title;
            // Add author for better accuracy
            if (book.credits && book.credits.authors && book.credits.authors !== "AUTHOR MISSING") {
                const firstAuthor = book.credits.authors.split(',')[0].trim();
                searchQuery += ' ' + firstAuthor;
            }

            const searchUrl = 'https://www.overdrive.com/search?q=' + encodeURIComponent(searchQuery);

            console.log('gr2bb: Checking OverDrive for:', searchQuery);

            // Make async request to check if book exists on OverDrive
            GM_xmlhttpRequest({
                method: "GET",
                url: searchUrl,
                timeout: 5000, // 5 second timeout
                onload: function(response) {
                    if (response.status === 200) {
                        const html = response.responseText;

                        // Check various indicators of no results
                        const noResults = html.includes('No results were found') ||
                                        html.includes('0 results') ||
                                        html.includes('no-results') ||
                                        html.includes('No titles found');

                        // Look for positive indicators
                        const titleLower = book.title.toLowerCase();
                        const titleFound = html.toLowerCase().includes(titleLower);

                        // Check for ISBN/ASIN in results
                        const idFound = book.isbn && book.isbn !== 'NA' && html.includes(book.isbn);

                        // Look for result count
                        const resultMatch = html.match(/([1-9]\d*)\s+results?/i);
                        const hasResults = resultMatch && parseInt(resultMatch[1]) > 0;

                        // Decision logic
                        if (!noResults && (titleFound || idFound || hasResults)) {
                            console.log('gr2bb: OverDrive book found! Marking as available.');
                            // Update existing OverDrive entry
                            if (stores['OverDrive']) {
                                stores['OverDrive'].available = true;
                            }
                            // Trigger refresh to update the display
                            if (typeof $notes !== 'undefined') {
                                $notes.trigger('refresh');
                            }
                        } else {
                            console.log('gr2bb: Book not found on OverDrive, marking as unavailable.');
                            // Update existing OverDrive entry
                            if (stores['OverDrive']) {
                                stores['OverDrive'].available = false;
                            }
                            // Trigger refresh to update the display
                            if (typeof $notes !== 'undefined') {
                                $notes.trigger('refresh');
                            }
                        }
                    }
                },
                onerror: function(response) {
                    console.log('gr2bb: Could not validate OverDrive, marking as unavailable.');
                    // Update existing OverDrive entry
                    if (stores['OverDrive']) {
                        stores['OverDrive'].available = false;
                    }
                    if (window.$notes) {
                        window.$notes.trigger('refresh');
                    }
                }
            });
        }

        // Modern store link extraction - IMPROVED VERSION
        function extractStoreLinks($, stores, $storelist, book) {
            console.log('gr2bb: Extracting store links...');

            // First try to find the Libraries link
            // Look for WorldCat or library links
            const librarySelectors = [
                'a[href*="worldcat.org"]',
                'a[href*="/book_link/follow/8"]', // Old GoodReads library link
                'a:contains("Libraries")',
                'button:contains("Libraries")'
            ];

            let librariesUrl = null;
            for (let selector of librarySelectors) {
                const elem = $(selector).first();
                if (elem.length) {
                    librariesUrl = elem.attr('href') || elem.parent().attr('href');
                    if (librariesUrl) {
                        console.log('gr2bb: Found Libraries link:', librariesUrl);
                        break;
                    }
                }
            }

            // If we found a Libraries link, add it
            if (librariesUrl) {
                // Convert relative URLs to absolute
                if (librariesUrl.startsWith('/')) {
                    librariesUrl = 'https://www.goodreads.com' + librariesUrl;
                }
                stores['Libraries'] = {
                    originalUrl: librariesUrl,
                    url: deref(librariesUrl),
                    chk: false // Libraries is never checked by default
                };
            } else if (book.isbn && book.isbn !== 'NA') {
                // Fallback: Create WorldCat link from best identifier
                // WorldCat prefers ISBN-13
                const searchId = book.identifiers?.isbn13 || book.identifiers?.isbn10 || book.isbn;
                const worldCatUrl = 'https://www.worldcat.org/isbn/' + searchId;
                stores['Libraries'] = {
                    originalUrl: worldCatUrl,
                    url: deref(worldCatUrl),
                    chk: false
                };
            }

            // Add OverDrive with default state (will be updated async)
            if (book && book.title) {
                let searchQuery = book.title;
                if (book.credits && book.credits.authors && book.credits.authors !== "AUTHOR MISSING") {
                    const firstAuthor = book.credits.authors.split(',')[0].trim();
                    searchQuery += ' ' + firstAuthor;
                }
                const overdriveUrl = 'https://www.overdrive.com/search?q=' + encodeURIComponent(searchQuery);
                stores['OverDrive'] = {
                    originalUrl: overdriveUrl,
                    url: deref(overdriveUrl),
                    chk: true,  // Checked by default
                    available: null  // Will be determined by async check
                };
            }

            // Check OverDrive availability asynchronously
            // Updates the available status when check completes
            checkOverDriveAndUpdate(book, stores);

            // Phase 1: Try to find ALL store links from dropdowns and containers
            let foundActualLinks = false;

            // Look for dropdown menus with store links (most complete)
            const dropdownSelectors = [
                // Modern selectors
                '.Dropdown__menu a[href*="/book_link/follow"]',
                '.BookBuyButton__dropdown a[href*="follow"]',
                '[data-testid="buy-dropdown"] a',
                'div[class*="dropdown"] a[href*="/book_link/follow"]',
                // Legacy selectors
                '#buyDropdown a[href*="follow"]',
                '.buy-dropdown-menu a',
                // Generic but specific to stores
                'a[href*="/book_link/follow"]'
            ];

            console.log('gr2bb: Looking for store dropdown menus...');

            for (let selector of dropdownSelectors) {
                $(selector).each(function() {
                    const href = this.href;
                    const text = $(this).text().trim();

                    if (text && href && href.includes('follow')) {
                        foundActualLinks = true;
                        const storeName = text
                            .replace('Buy on ', '')
                            .replace('Buy at ', '')
                            .replace('Buy from ', '')
                            .trim();

                        // Skip if it's Libraries (handled separately)
                        if (storeName === 'Libraries' || storeName.includes('Library')) return;

                        stores[storeName] = {
                            originalUrl: href,
                            url: deref(href),
                            chk: (checkboxesEnabledByDefault.indexOf(storeName) !== -1)
                        };

                        console.log('gr2bb: Found store from dropdown:', storeName);
                    }
                });

                if (Object.keys(stores).length > 5) {
                    console.log('gr2bb: Found', Object.keys(stores).length, 'stores from dropdown');
                    break;
                }
            }

            // If dropdown didn't work, try buy button containers
            if (!foundActualLinks) {
                const buyContainerSelectors = [
                    '#buyButtonContainer',
                    '#asyncBuyButtonContainer',
                    '.BuyButtonBar',
                    '[data-testid="buyButton"]',
                    '.BookActions__button'
                ];

                for (let selector of buyContainerSelectors) {
                    const container = $(selector);
                    if (container.length) {
                        console.log('gr2bb: Found buy container:', selector);

                        // Look for links within the container
                        container.find('a[href*="follow"], a[href*="buy"]').each(function() {
                            const href = this.href;
                            const text = $(this).text().trim();

                            if (text && href && href.includes('http')) {
                                foundActualLinks = true;
                                const storeName = text
                                    .replace('Buy on ', '')
                                    .replace('Buy at ', '')
                                    .replace('Buy from ', '')
                                    .trim();

                                stores[storeName] = {
                                    originalUrl: href,
                                    url: deref(href),
                                    chk: (checkboxesEnabledByDefault.indexOf(storeName) !== -1)
                                };

                                console.log('gr2bb: Found store link:', storeName);
                            }
                        });
                    }

                    if (foundActualLinks) break;
                }
            }

            // Phase 2: Add common stores if we have less than 10 stores
            // This ensures comprehensive coverage even if dropdown is incomplete
            if (Object.keys(stores).length < 10 && book) {
                const searchId = book.identifiers?.isbn13 || book.identifiers?.isbn10 || book.isbn;
                const searchTitle = encodeURIComponent(book.title || '');
                const searchQuery = (searchId && searchId !== 'NA') ? searchId : searchTitle;

                if (searchQuery) {
                    console.log('gr2bb: Adding additional common stores using:', searchQuery);

                    // Define common bookstores with their search URLs
                    const commonStores = {
                        'Amazon': 'https://www.amazon.com/s?k=' + searchQuery,
                        'Barnes & Noble': 'https://www.barnesandnoble.com/s/' + searchQuery,
                        'Google Play': 'https://play.google.com/store/search?q=' + searchQuery + '&c=books',
                        'Audible': 'https://www.audible.com/search?keywords=' + searchQuery,
                        'Kobo': 'https://www.kobo.com/search?query=' + searchQuery,
                        'Apple Books': 'https://books.apple.com/search?term=' + searchQuery,
                        'Book Depository': 'https://www.bookdepository.com/search?searchTerm=' + searchQuery,
                        'Abebooks': 'https://www.abebooks.com/servlet/SearchResults?kn=' + searchQuery,
                        'Alibris': 'https://www.alibris.com/booksearch?keyword=' + searchQuery,
                        'Better World Books': 'https://www.betterworldbooks.com/search/results?q=' + searchQuery,
                        'IndieBound': 'https://www.indiebound.org/search/book?keys=' + searchQuery,
                        'Thriftbooks': 'https://www.thriftbooks.com/browse/?b.search=' + searchQuery,
                        'Wordery': 'https://wordery.com/search?term=' + searchQuery
                    };

                    // Add stores that aren't already present
                    for (let storeName in commonStores) {
                        if (!stores[storeName]) {
                            stores[storeName] = {
                                originalUrl: commonStores[storeName],
                                url: deref(commonStores[storeName]),
                                chk: (checkboxesEnabledByDefault.indexOf(storeName) !== -1)
                            };
                        }
                    }

                    console.log('gr2bb: Total stores after adding common ones:', Object.keys(stores).length);
                }
            }

            // If still no stores at all, add the three essentials
            if (Object.keys(stores).length === 0) {
                console.log('gr2bb: No stores found, adding essential defaults');
                const searchQuery = book?.title ? encodeURIComponent(book.title) : '';

                const amazonUrl = 'https://www.amazon.com/s?k=' + searchQuery;
                const bnUrl = 'https://www.barnesandnoble.com/s/' + searchQuery;
                const googleUrl = 'https://play.google.com/store/search?q=' + searchQuery + '&c=books';

                stores['Amazon'] = {
                    originalUrl: amazonUrl,
                    url: deref(amazonUrl),
                    chk: true
                };

                stores['Barnes & Noble'] = {
                    originalUrl: bnUrl,
                    url: deref(bnUrl),
                    chk: true
                };

                stores['Google Play'] = {
                    originalUrl: googleUrl,
                    url: deref(googleUrl),
                    chk: true
                };
            }

            // Add all stores to the UI (except Libraries)
            for (let storeName in stores) {
                if (storeName !== 'Libraries') {
                    $('<input>', {
                        'type': 'checkbox',
                        'class': 'store',
                        'data-store': storeName,
                        'data-href': stores[storeName].url,
                        'checked': stores[storeName].chk
                    }).appendTo($storelist).wrap('<li></li>').after($('<a/>', {
                        'href': stores[storeName].url,
                        'text': storeName,
                        'target': '_blank'
                    }));
                }
            }

            // Add select all/none buttons WITHIN the right column if we have many stores
            if (Object.keys(stores).length > 6) {
                $('.store-buttons', $req).html(
                    '<button type="button" class="select-all-stores" style="margin-right: 10px; padding: 2px 10px; font-size: 0.85em; cursor: pointer;">Select All</button>' +
                    '<button type="button" class="select-none-stores" style="padding: 2px 10px; font-size: 0.85em; cursor: pointer;">Select None</button>'
                ).css({
                    'margin': '8px 0',
                    'text-align': 'center'
                });

                // Add event handlers for the buttons
                $('.select-all-stores').on('click', function(e) {
                    e.preventDefault();
                    $storelist.find('.store').prop('checked', true).trigger('change');
                });
                $('.select-none-stores').on('click', function(e) {
                    e.preventDefault();
                    $storelist.find('.store').prop('checked', false).trigger('change');
                });
            }

            // Add dereferer toggle checkbox
            $('.dereferer-toggle', $req).html(
                '<label style="display: block; margin: 0; padding: 0; font-size: 0.85em; text-align: center; line-height: 1.2;">' +
                '<input type="checkbox" id="useDereferer" ' + (useDereferer ? 'checked' : '') + ' style="margin-right: 5px; vertical-align: middle;">' +
                'Use dereferer.me for links' +
                '</label>'
            );

            // Handle dereferer toggle change
            $('#useDereferer').on('change', function() {
                useDereferer = this.checked;
                GM_setValue('useDereferer', useDereferer);
                console.log('gr2bb: Dereferer', useDereferer ? 'enabled' : 'disabled');

                // Update all store URLs
                for (let storeName in stores) {
                    if (stores[storeName].originalUrl) {
                        stores[storeName].url = useDereferer ?
                            deref(stores[storeName].originalUrl) :
                            stores[storeName].originalUrl;
                    }
                }

                // Refresh the notes to update the URLs
                $notes.trigger('refresh');
            });

            console.log('gr2bb: Final stores object:', stores);
        }

        // Imgur upload function
        function anonymous_send_imgur(node) {
            if (client_id == "YOUR_IMGUR_CLIENT_ID") {
                alert("Please configure your Imgur client ID in the script");
                return;
            }

            if (node && node.hasAttribute("src")) {
                if (debug) console.log('gr2bb: anonymous_send_imgur: node valid');

                var fd = new FormData();
                fd.append("image", node.src);

                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://api.imgur.com/3/upload.json",
                    headers: {
                        "Authorization": "Client-ID " + client_id
                    },
                    data: fd,
                    onload: function(response) {
                        try {
                            var res = JSON.parse(response.responseText);
                            if (res.success) {
                                book.cover = res.data.link;
                                $notes.trigger('refresh');
                                console.log('gr2bb: Imgur upload successful:', res.data.link);
                            } else {
                                console.error('gr2bb: Imgur upload failed:', res);
                                alert('Imgur upload failed: ' + (res.data?.error || 'Unknown error'));
                            }
                        } catch (e) {
                            console.error('gr2bb: Failed to parse Imgur response:', e);
                        }
                    },
                    onerror: function(response) {
                        console.error('gr2bb: Imgur upload error:', response);
                    }
                });
            }
        }

        // Modified deref function to respect toggle
        function deref(uri) {
            // Return based on current preference
            if (useDereferer) {
                return 'https://dereferer.me/?' + encodeURIComponent(uri);
            } else {
                return uri;
            }
        }
    }

    // Modern book data scraping
    function scrapeBookData($) {
        console.log('gr2bb: scrapeBookData called');

        // Try JSON-LD first
        const jsonLd = extractJsonLd();

        // Title extraction
        var title = null;
        const titleSelectors = [
            'h1[data-testid="bookTitle"]',
            '.BookPageTitleSection__title h1',
            'h1.Text__title1',
            '#bookTitle',
            'h1'
        ];

        for (let selector of titleSelectors) {
            const elem = $(selector).first();
            if (elem.length && elem.text().trim()) {
                title = elem.text().trim().replace(/\s+/g, ' ');
                break;
            }
        }

        title = title || jsonLd?.name || null;

        if (!title) {
            console.error('gr2bb: Could not find book title');
            return null;
        }

        if (debug) console.log('gr2bb: title:', title);

        // Get all other data with safe extraction
        var credits = getAuthors($) || { authors: "AUTHOR MISSING", editors: "", contributors: "", translators: "" };

        // Get all identifiers from the page
        var allIdentifiers = getAllIdentifiers($);
        // If JSON-LD has ISBN, use it as primary
        if (jsonLd?.isbn) {
            allIdentifiers.primary = jsonLd.isbn;
        }

        var pubdetails = getPublisherAndYear($, jsonLd);
        var pubyear = pubdetails[1] || "XXXX";
        var expectedpubdate = (pubdetails[3] ? pubdetails[3] + pubyear : null);
        var publisher = pubdetails[2] || "PUBLISHER MISSING";  // Show explicitly when not found
        var tags = getGenres($, jsonLd) || "NOTAGS";
        var about = getDescription($, jsonLd) || "...";
        var cover = getCoverImage($, jsonLd) || "http://";
        var pages = getPages($, jsonLd) || "";

        // Process all identifiers for display
        var identifiers = getBookIdentifiers(allIdentifiers);
        // Keep backward compatibility
        var isbn = identifiers.original || "NA";

        var book = {
            credits: credits,
            title: title,
            pubyear: pubyear,
            expectedpubdate: expectedpubdate,
            publisher: publisher,
            tags: tags,
            about: about,
            cover: cover,
            isbn: isbn,  // Keep original for compatibility
            isbnstring: identifiers.displayLabel,
            isbnDisplay: identifiers.displayText,
            identifiers: identifiers,  // Full identifier info for advanced use
            pages: pages
        };

        if (debug) console.log('gr2bb: Final book object:', book);
        return book;
    }

    // Extract JSON-LD data
    function extractJsonLd() {
        // First try standard JSON-LD
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (let script of scripts) {
            try {
                const data = JSON.parse(script.textContent);
                if (data['@type'] === 'Book' || (Array.isArray(data['@type']) && data['@type'].includes('Book'))) {
                    console.log('gr2bb: Found JSON-LD book data');
                    return data;
                }
                if (Array.isArray(data)) {
                    for (let item of data) {
                        if (item['@type'] === 'Book') {
                            console.log('gr2bb: Found JSON-LD book data in array');
                            return item;
                        }
                    }
                }
            } catch (e) {
                console.log('gr2bb: Failed to parse JSON-LD:', e);
            }
        }

        // Also try to extract publisher from page's React/Next.js data
        const allScripts = document.querySelectorAll('script');
        for (let script of allScripts) {
            if (script.textContent && script.textContent.includes('"publisher"')) {
                // Try to extract publisher using a more specific pattern
                const pubMatch = script.textContent.match(/"publisher"\s*:\s*"([^"]+)"/);
                if (pubMatch && pubMatch[1] && pubMatch[1].length > 2 && pubMatch[1].length < 50) {
                    console.log('gr2bb: Found publisher in React data:', pubMatch[1]);
                    // Return minimal object with just publisher info
                    return { publisher: pubMatch[1] };
                }
            }
        }

        return null;
    }

    // Get authors
    function getAuthors($) {
        var authors = [];
        var authorSet = new Set(); // Use Set to prevent duplicates

        const authorSelectors = [
            '.ContributorLink__name',
            '[data-testid="authorName"]',
            '.BookPageMetadataSection__contributor',
            'a.authorName',
            '#bookAuthors a'
        ];

        for (let selector of authorSelectors) {
            $(selector).each(function() {
                var currentAuthor = $(this).text().trim();
                // Filter out common non-author text
                if (currentAuthor &&
                    !currentAuthor.includes('Goodreads Author') &&
                    !currentAuthor.includes('more…') &&
                    !currentAuthor.includes('less') &&
                    currentAuthor.length < 100) { // Avoid picking up bio text
                    authorSet.add(currentAuthor);
                }
            });
            if (authorSet.size > 0) {
                authors = Array.from(authorSet);
                break;
            }
        }

        return {
            authors: authors.join(", ") || "AUTHOR MISSING",
            editors: "",
            contributors: "",
            translators: ""
        };
    }

    // Get all book identifiers (ISBN-13, ISBN-10, ASIN)
    function getAllIdentifiers($) {
        const identifiers = {
            isbn13: null,
            isbn10: null,
            asin: null,
            primary: null  // The main one found on the page
        };

        // First check for ISBN in standard location
        var isbn = $('[itemprop=isbn]').text();
        if (isbn) {
            identifiers.primary = isbn;
        }

        // Search the page text for all identifiers
        const pageText = document.body.innerText || '';

        // Look for ISBN-13
        const isbn13Match = pageText.match(/ISBN-?13[:\s]+(\d{13})/i);
        if (isbn13Match) {
            identifiers.isbn13 = isbn13Match[1];
        }

        // Look for ISBN-10
        const isbn10Match = pageText.match(/ISBN-?10[:\s]+(\d{9}[\dX])/i);
        if (isbn10Match) {
            identifiers.isbn10 = isbn10Match[1];
        }

        // Look for generic ISBN (could be 10 or 13)
        if (!identifiers.isbn13 && !identifiers.isbn10) {
            const isbnMatch = pageText.match(/ISBN[:\s]+(\d{10,13}|\d{9}X)/i);
            if (isbnMatch) {
                const found = isbnMatch[1];
                if (found.length === 13) {
                    identifiers.isbn13 = found;
                } else if (found.length === 10) {
                    identifiers.isbn10 = found;
                }
                if (!identifiers.primary) {
                    identifiers.primary = found;
                }
            }
        }

        // Look for ASIN
        const asinMatch = pageText.match(/ASIN[:\s]+([B][0-9A-Z]{9})/);
        if (asinMatch) {
            identifiers.asin = asinMatch[1];
            if (!identifiers.primary) {
                identifiers.primary = asinMatch[1];
            }
        }

        // If we have ISBN-13 but no ISBN-10, try to convert
        if (identifiers.isbn13 && !identifiers.isbn10) {
            identifiers.isbn10 = isbn13to10(identifiers.isbn13);
        }

        // If we have ISBN-10 but no ISBN-13, try to convert
        if (identifiers.isbn10 && !identifiers.isbn13) {
            identifiers.isbn13 = isbn10to13(identifiers.isbn10);
        }

        // Set primary if not set
        if (!identifiers.primary) {
            identifiers.primary = identifiers.isbn13 || identifiers.isbn10 || identifiers.asin || "NA";
        }

        return identifiers;
    }

    // Get ISBN (legacy function wrapper)
    function getISBN($) {
        const identifiers = getAllIdentifiers($);
        return identifiers.primary;
    }

    // Get publisher and year - PROPER PATTERN MATCHING
    function getPublisherAndYear($, jsonLd) {
        // Try JSON-LD first
        if (jsonLd) {
            const year = jsonLd.datePublished ? new Date(jsonLd.datePublished).getFullYear().toString() : null;
            const publisher = jsonLd.publisher?.name || jsonLd.publisher;
            if (year && publisher) {
                console.log('gr2bb: Found publisher from JSON-LD:', publisher, year);
                return ["", year, publisher, null];
            }
        }

        // Look for the pattern in the page text
        const pageText = document.body.innerText || '';
        let publisher = "";
        let year = "";
        let expectedDate = null;

        // Method 1: Try to find publisher link in common locations
        const publisherSelectors = [
            '.FeaturedDetails a[href*="/publisher/"]',
            'a[href*="/publisher/"]',
            '[data-testid="publisher"]',
            '.BookDetails a[href*="publisher"]',
            '.EditionDetails a[href*="publisher"]'
        ];

        for (let selector of publisherSelectors) {
            const elem = $(selector).first();
            if (elem.length && elem.text().trim()) {
                publisher = elem.text().trim();
                console.log('gr2bb: Found publisher from selector:', selector, '->', publisher);
                break;
            }
        }

        // Method 2: Look for "Expected publication" pattern FIRST (most specific)
        let pubMatch = pageText.match(/Expected publication\s+([A-Za-z]+\s+\d{1,2},?\s+)?(\d{4})\s+by\s+([^\n]+)/i);
        if (pubMatch) {
            year = pubMatch[2];
            const foundPublisher = pubMatch[3].trim();
            // Clean up the publisher name - remove trailing punctuation
            if (foundPublisher) {
                publisher = foundPublisher.replace(/[,;.]$/, '').trim();
                expectedDate = pubMatch[1] ? pubMatch[1].trim() + ' ' : '';
                console.log('gr2bb: Found from Expected publication:', publisher, year);
            }
        }

        // Method 3: Look for "Published" or "First published" patterns
        if (!publisher && !pubMatch) {
            // Try "Published [date] by [publisher]"
            pubMatch = pageText.match(/(?:First )?Published\s+([A-Za-z]+\s+\d{1,2},?\s+)?(\d{4})\s+by\s+([^\n]+)/i);
            if (pubMatch) {
                year = year || pubMatch[2];
                const foundPublisher = pubMatch[3].trim();
                // Basic validation - reasonable length and format
                if (foundPublisher && foundPublisher.length < 50) {
                    publisher = foundPublisher.replace(/[,;.]$/, '').trim();
                    console.log('gr2bb: Found from Published pattern:', publisher, year);
                }
            }
        }

        // Method 4: Look for "Publisher:" label LAST (least reliable due to false positives)
        if (!publisher) {
            // Be more specific - look for "Publisher:" at start of line or after whitespace
            const pubLabelMatch = pageText.match(/(?:^|\n|\s{2,})Publisher[:\s]+([A-Z][^\n,]{2,40})(?:[,\n]|$)/im);
            if (pubLabelMatch) {
                const foundPublisher = pubLabelMatch[1].trim();
                // Basic validation - should start with capital and be reasonable length
                if (foundPublisher && /^[A-Z]/.test(foundPublisher)) {
                    publisher = foundPublisher;
                    console.log('gr2bb: Found publisher from label:', publisher);
                }
            }
        }

        // Method 5: Look for just the publication year if no publisher found yet
        if (!year) {
            const yearPatterns = [
                /(?:Published|First published|Expected publication)[:\s]+(?:[A-Za-z]+\s+\d{1,2},?\s+)?(\d{4})/i,
                /Publication date[:\s]+(?:[A-Za-z]+\s+\d{1,2},?\s+)?(\d{4})/i,
                /Release date[:\s]+(?:[A-Za-z]+\s+\d{1,2},?\s+)?(\d{4})/i
            ];

            for (let pattern of yearPatterns) {
                const match = pageText.match(pattern);
                if (match) {
                    year = match[1];
                    console.log('gr2bb: Found year from pattern:', year);
                    break;
                }
            }
        }

        // Method 6: If we have year but no publisher, try to find known publishers
        if (year && !publisher) {
            // Expanded list of common publishers
            const commonPublishers = [
                'Orbit', 'Tor Books', 'Tor', 'Ace Books', 'Ace', 'Del Rey', 'Bantam',
                'Penguin', 'Random House', 'HarperCollins', 'Simon & Schuster',
                'Macmillan', 'Hachette', 'Knopf', 'Doubleday', 'Viking', 'Scribner',
                'Little, Brown', 'Grand Central', 'Berkley', 'DAW Books', 'Baen',
                'Angry Robot', 'Saga Press', 'Tor.com', 'Subterranean Press'
            ];

            // Look for publisher names within reasonable distance of the year
            const yearIndex = pageText.indexOf(year);
            if (yearIndex > -1) {
                const contextStart = Math.max(0, yearIndex - 200);
                const contextEnd = Math.min(pageText.length, yearIndex + 200);
                const context = pageText.substring(contextStart, contextEnd);

                for (let pub of commonPublishers) {
                    const pubRegex = new RegExp('\\b' + pub.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
                    if (context.match(pubRegex)) {
                        publisher = pub;
                        console.log('gr2bb: Found known publisher near year:', publisher);
                        break;
                    }
                }
            }
        }

        // Method 7: Look in edition/format information
        if (!publisher) {
            const editionMatch = pageText.match(/(?:Hardcover|Paperback|Kindle|eBook|Mass Market)[^\n]*?(?:published|by)\s+([A-Z][^\n,;.]{2,40})(?:[,;.\n]|$)/i);
            if (editionMatch) {
                const foundPublisher = editionMatch[1].trim();
                // Basic validation - should start with capital letter and be reasonable length
                if (foundPublisher && /^[A-Z]/.test(foundPublisher)) {
                    publisher = foundPublisher;
                    console.log('gr2bb: Found publisher from edition info:', publisher);
                }
            }
        }

        console.log('gr2bb: Final publisher data - Publisher:', publisher || '(none)', 'Year:', year || '(none)');
        return ["", year || "", publisher || "PUBLISHER MISSING", null];
    }

    // Get genres from Apollo/React state or HTML
    function getGenres($, jsonLd) {
        var genres = [];

        // First try to get genres from Apollo/React state (most complete)
        // Look for __APOLLO_STATE__ or similar in page scripts
        const scripts = document.querySelectorAll('script');
        for (let script of scripts) {
            if (script.textContent && script.textContent.includes('bookGenres')) {
                // Try to extract bookGenres array
                const genreMatches = script.textContent.match(/"bookGenres"\s*:\s*\[([^\]]+)\]/g);
                if (genreMatches) {
                    for (let match of genreMatches) {
                        // Extract genre names from the match
                        const nameMatches = match.match(/"name"\s*:\s*"([^"]+)"/g);
                        if (nameMatches) {
                            for (let nameMatch of nameMatches) {
                                const genre = nameMatch.match(/"name"\s*:\s*"([^"]+)"/)[1]
                                    .toLowerCase()
                                    .replace('non fiction', 'nonfiction')
                                    .replace(/\s+/g, ' ').trim();
                                if (genre && genres.indexOf(genre) === -1) {
                                    genres.push(genre);
                                }
                            }
                        }
                    }
                }
            }
        }

        if (genres.length > 0) {
            console.log('gr2bb: Found', genres.length, 'genres from Apollo/React state:', genres);
            return genres.join(', ');
        }

        // Fall back to HTML extraction
        // First try to find the dedicated genres section
        const genreSectionSelectors = [
            '[data-testid="genresList"]',
            '.BookPageMetadataSection__genres',
            '.BookGenres',
            '.PageSection--genres',
            '.CollapsableList--genres',
            '[aria-label*="genre"]',
            '.BookPageSection:has(a[href*="/genres/"])'
        ];

        var genres = [];
        let genreSection = null;

        // Find the genre section container
        for (let selector of genreSectionSelectors) {
            genreSection = $(selector).first();
            if (genreSection.length > 0) {
                console.log('gr2bb: Found genre section with selector:', selector);
                break;
            }
        }

        // If we found a genre section, get ALL genre links from it
        if (genreSection && genreSection.length > 0) {
            genreSection.find('a[href*="/genres/"]').each(function() {
                const text = $(this).text().trim();
                // Skip generic navigation text
                if (text === 'Browse' || text === 'Genres' || text === 'More genres' || text.includes('...more')) return;

                const genre = text.toLowerCase()
                    .replace('non fiction', 'nonfiction')
                    .replace(/\s+/g, ' '); // normalize whitespace

                if (genre && genres.indexOf(genre) === -1 && genre.length < 50) {
                    genres.push(genre);
                }
            });
        }

        // If no genres found yet, try broader search with strict filtering
        if (genres.length === 0) {
            console.log('gr2bb: No genre section found, trying broader search');

            // Look for genre links that are clearly part of the book's metadata
            $('a[href*="/genres/"]').each(function() {
                // Must be in a book-related section
                const inBookSection = $(this).closest(
                    '.BookPage, .BookDetails, .BookMetadata, .BookInfo, ' +
                    '[data-testid*="book"], .BookPageSection, .MetadataSection'
                ).length > 0;

                if (!inBookSection) return;

                // Skip if in navigation
                const inNav = $(this).closest('nav, .Navigation, .Sidebar, .Menu, [role="navigation"]').length > 0;
                if (inNav) return;

                // Skip if part of a user shelf or list
                const inShelf = $(this).closest('.Shelf, .BookShelf, .UserShelf, .Lists').length > 0;
                if (inShelf) return;

                const text = $(this).text().trim();
                if (text === 'Browse' || text === 'Genres' || text === 'More genres') return;

                const genre = text.toLowerCase()
                    .replace('non fiction', 'nonfiction')
                    .replace(/\s+/g, ' ');

                if (genre && genres.indexOf(genre) === -1 && genre.length < 50) {
                    genres.push(genre);
                    // Stop after finding 20 genres to avoid catching too much
                    if (genres.length >= 20) return false;
                }
            });
        }

        console.log('gr2bb: Found genres from HTML:', genres);
        return genres.join(', ') || "NOTAGS";
    }

    // Get description - IMPROVED to handle formatting better
    function getDescription($, jsonLd) {
        if (jsonLd?.description) {
            return cleanDescription(jsonLd.description);
        }

        const descSelectors = [
            '[data-testid="description"]',
            '.BookPageMetadataSection__description',
            '.DetailsLayoutRightParagraph__widthConstained',
            '.Formatted',
            '#description'
        ];

        for (let selector of descSelectors) {
            const elem = $(selector).first();
            if (elem.length) {
                // Try to preserve some formatting
                let text = '';

                // Check if there are multiple paragraphs
                const paragraphs = elem.find('p');
                if (paragraphs.length > 0) {
                    paragraphs.each(function() {
                        const pText = $(this).text().trim();
                        if (pText) {
                            text += pText + '\n\n';
                        }
                    });
                } else {
                    // Fall back to getting all text
                    const spans = elem.find('span');
                    if (spans.length > 0) {
                        text = spans.last().text().trim();
                    } else {
                        text = elem.text().trim();
                    }
                }

                if (text) {
                    return cleanDescription(text);
                }
            }
        }
        return "...";
    }

    // Clean up description text
    function cleanDescription(text) {
        // Remove "Show more" and similar artifacts
        text = text.replace(/Show more$/i, '').trim();
        text = text.replace(/Show less$/i, '').trim();

        // Fix spacing issues
        text = text.replace(/\s+/g, ' ');

        // Preserve paragraph breaks
        text = text.replace(/\n\n+/g, '\n\n');

        return text;
    }

    // Get cover image
    function getCoverImage($, jsonLd) {
        if (jsonLd?.image) {
            return jsonLd.image;
        }

        const coverSelectors = [
            '.BookCover__image img',
            '.BookPage__bookCover img',
            '[data-testid="bookCover"] img',
            '.ResponsiveImage',
            '#coverImage',
            '.bookCoverPrimary img',
            'img[alt*="cover"]'
        ];

        for (let selector of coverSelectors) {
            const img = $(selector).first();
            if (img.length && img.attr('src')) {
                return img.attr('src');
            }
        }
        return "http://";
    }

    // Get pages
    function getPages($, jsonLd) {
        if (jsonLd?.numberOfPages) {
            return jsonLd.numberOfPages.toString();
        }

        const oldPages = $('[itemprop=numberOfPages]').text();
        if (oldPages) {
            const match = oldPages.match(/\d+/);
            if (match) return match[0];
        }

        const pageText = document.body.innerText || '';
        const pagesMatch = pageText.match(/(\d+)\s+pages/i);
        if (pagesMatch) {
            return pagesMatch[1];
        }
        return "";
    }

    // Bibliotik side
    function onReq($) {
        console.log('gr2bb: onReq function called');
        var reqid, _match;
        _match = location.search.match(/reqid=(\w+)/);
        if (_match)
            reqid = _match[1];
        else
            return;

        var book = JSON.parse(GM_getValue('book' + reqid));
        GM_deleteValue('book' + reqid);
        console.dir(book);

        $('#AuthorsField').val(book.credits.authors);
        $('#EditorsField').val(book.credits.editors);
        $('#ContributorsField').val(book.credits.contributors);
        $('#TranslatorsField').val(book.credits.translators);

        $('#TitleField').val(book.title);
        $('#PublishersField').val(book.publisher);
        $('#TagsField').val(book.tags);
        $('#NotesField').val(book.notes);

        if (unsafeWindow.$) {
            unsafeWindow.$('#NotesField').change(); // update editor, if needed
        }
    }

    // CSS styles - BASE styles only, width will be set dynamically
    GM_addStyle(`
        #bbreq {
            position: fixed;
            right: 10px;
            bottom: 10px;
            font: 4em "Georgia, serif";
            color: #000;
            z-index: 9999;
            background: white;
            width: 50px;
            height: 50px;
            text-align: center;
            line-height: 50px;
            border-radius: 50%;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            cursor: pointer;
        }
        #bbreq:hover {
            text-decoration: none;
            background: #f0f0f0;
        }
        #bbreqwrap {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 750px;
            max-width: 95%;
            height: auto;
            max-height: 90%;
            overflow: auto;
            background: white;
            border: 2px solid #333;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
        #bbreqwrap .left-column {
            width: 66%;
            float: left;
        }
        #bbreqwrap .right-column {
            width: 32%;
            float: right;
            text-align: left;
        }
        #bbreqwrap textarea#ta_notes {
            width: 100%;
            height: 330px;
            font-family: monospace;
            font-size: 11px;
            box-sizing: border-box;
        }
        #bbreqwrap textarea#ta_tags {
            width: 100%;
            height: 60px;
            box-sizing: border-box;
        }
        #bbreqwrap ul {
            list-style: none;
            text-align: left;
            padding: 5px;
            margin: 5px 0;
            max-height: 240px;
            overflow-y: auto;
            overflow-x: hidden;
            border: 1px solid #ddd;
            background: #fafafa;
        }
        #bbreqwrap ul li {
            padding: 3px 0;
            font-size: 0.9em;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        #bbreqwrap ul li input[type="checkbox"] {
            margin-right: 5px;
            vertical-align: middle;
        }
        #bbreqwrap ul li a {
            font-size: 0.9em;
        }
        #bbreqwrap .store-buttons {
            margin: 8px 0;
            text-align: center;
        }
        #bbreqwrap .dereferer-toggle {
            margin: 2px 0;
            padding: 1px 4px;
            background: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 3px;
            line-height: 1.2;
        }
        #bbreqwrap .dereferer-toggle label {
            margin: 0;
            padding: 0;
            line-height: 1.2;
        }
        /* Improved button styling */
        #bbreqwrap .action-button {
            font: 1.5em Georgia, Times, "Times New Roman", serif;
            padding: 10px 20px;
            margin: 10px 0;
            background: #2e7d32;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            display: block;
            width: 100%;
            transition: background 0.3s;
        }
        #bbreqwrap .action-button:hover {
            background: #1b5e20;
        }
        #bbreqwrap .action-button.secondary {
            background: #1976d2;
            font-size: 1.2em;
        }
        #bbreqwrap .action-button.secondary:hover {
            background: #0d47a1;
        }
    `);

    // Start the script
    console.log('gr2bb: Waiting for page to be ready...');

    // Multiple initialization strategies
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGR2BB);
    } else {
        // DOM already loaded, initialize immediately
        initGR2BB();
    }

    // Remove the backup initialization to prevent duplicates
    // The singleton pattern at the top should handle this now

})();