// ==UserScript==
// @name         Amazon Kindle Deals Goodreads Ratings (Per Section)
// @license      MIT-0
// @namespace    http://tampermonkey.net/
// @version      2.5.2
// @description  Add Goodreads ratings to Amazon Kindle deals page for specific sections with highlighting
// @match        https://www.amazon.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/512996/Amazon%20Kindle%20Deals%20Goodreads%20Ratings%20%28Per%20Section%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512996/Amazon%20Kindle%20Deals%20Goodreads%20Ratings%20%28Per%20Section%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configurable variables
    let debugMode = true;

    // Rating thresholds and colors
    const highRatingThresholds = [4.00, 4.30, 4.50];
    const highRatingColors = ['#e6ffe6', '#ccffcc', '#99ff99']; // Light to dark green
    const lowRatingThresholds = [3.60, 3.30];
    const lowRatingColors = ['#ffe6e6', '#ffcccc']; // Light to medium red

    // Review count thresholds and colors
    const highRatingsCountThresholds = [1000, 5000, 10000];
    const highRatingsCountColors = ['#e6ffe6', '#ccffcc', '#99ff99']; // Light to dark green
    const lowRatingsCountThresholds = [100, 10];
    const lowRatingsCountColors = ['#ffe6e6', '#ffcccc']; // Light to medium red

    const longTitleLength = 42;

    let bookData = [];
    let processedASINs = new Set();
    let linksToProcess = [];
    let currentLinkIndex = 0;
    let isPaused = false;
    let isProcessing = false;

    function log(message) {
        if (debugMode) {
            console.log(`[Goodreads Ratings Debug]: ${message}`);
        }
    }

    function decodeHTMLEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    function getASIN(url) {
        const match = url.match(/\/([A-Z0-9]{10})(?:\/|\?|$)/);
        return match ? match[1] : null;
    }

    function extractYear(text) {
        const yearRegex = /\b\d{4}\b/; // Regular expression to match a four-digit year
        const match = text.match(yearRegex);
        return match ? parseInt(match[0]) : '-';
    }

    function extractNumberOfPages(text) {
        const pagesRegex = /(\d{1,3}(?:,\d{3})*)\s*(?:page|pages)/i; // This regex looks for one or more digits (with optional commas) followed by "page" or "pages"
        const match = text.match(pagesRegex);
        return match ? parseInt(match[1].replace(/,/g, ''), 10) : '-';
    }

    function extractLastNumber(str) {
        // First, try to find a number after '#'
        const hashMatch = str.match(/#\s*(\d+)\s*$/);
        if (hashMatch) {
          return parseInt(hashMatch[1]);
        }

        // If no '#' found, find the last number in the string
        const allNumbers = str.match(/\d+/g);
        if (allNumbers) {
          return parseInt(allNumbers[allNumbers.length - 1]);
        }

        // If no numbers found at all
        return null;
      }

    function isShelved(container) {
        const buttons = container.querySelectorAll('button');

        return Array.from(buttons).some(button => {
            const label = button.getAttribute('aria-label');
            return label && label.includes('Shelved');
        });
    }

    function getLiteraryAwards(doc) {
        if (doc) {
            const scripts = doc.getElementsByTagName('script');

            let awardsData = null;

            // Iterate through scripts to find the one containing awards data
            for (let script of scripts) {
                const content = script.textContent || script.innerText;
                if (content.includes('"awards":')) {
                    // This script likely contains our data
                    const match = content.match(/"awards":\s*"([^"]*)"/);
                    if (match) {
                        try {
                            awardsData = match[1];
                            break;
                        } catch (e) {
                            console.error("Error parsing awards data:", e);
                        }
                    }
                }
            }

            return awardsData;
        } else {
            return null;
        }
    }

    function getUniqueBookLinks(container) {
        const uniqueLinks = [];
        const seenHrefs = new Set();

        // Kindle Deals page
        const sections = container.querySelectorAll('div[data-testid="asin-face"], .ubf-book-info');

        sections.forEach(asinFace => {
            const link = asinFace.querySelector('a');
            if (link && !seenHrefs.has(link.href)) {
                seenHrefs.add(link.href);
                uniqueLinks.push(link);
            }
        });


        // Regular Kindle page
        const bookFaceouts = container.querySelectorAll('bds-unified-book-faceout');

        bookFaceouts.forEach(faceout => {
            const shadowRoot = faceout.shadowRoot;
            if (shadowRoot) {
                const link = shadowRoot.querySelector('a');
                if (link && !seenHrefs.has(link.href)) {
                    seenHrefs.add(link.href);
                    uniqueLinks.push(link);
                }
            }
        });

        log(`Unique link count: ${uniqueLinks.length}`);

        return uniqueLinks;
    }

    function fetchGoodreadsData(asin) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (isPaused) {
                    resolve(null);
                    return;
                }
                log(`Fetching data for ASIN: ${asin}`);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://www.goodreads.com/book/isbn/${asin}`,
                    onload: function(response) {
                        log(`Received response for ASIN: ${asin}`);
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        // log(doc.documentElement.outerHTML);

                        const h1Element = doc.querySelector('h1[data-testid="bookTitle"]');
                        const metadataElement = doc.querySelector('.RatingStatistics__rating');

                        if (!h1Element || !metadataElement) {
                            log(`No results found for ASIN: ${asin}`);
                            resolve(null);
                            return;
                        }

                        const fullTitle = h1Element.textContent.trim();
                        const title = fullTitle.length > longTitleLength ? fullTitle.slice(0, longTitleLength) + '...' : fullTitle;
                        const rating = metadataElement.textContent.trim().replace(/\s*stars/, '');
                        const ratingsCountElement = doc.querySelector('[data-testid="ratingsCount"]');
                        const ratingsCount = ratingsCountElement ? ratingsCountElement.textContent.trim().split(' ')[0] : '0';
                        const reviewsCountElement = doc.querySelector('[data-testid="reviewsCount"]');
                        const reviewsCount = reviewsCountElement ? reviewsCountElement.textContent.trim().split(' ')[0] : '0';

                        // Is this part of a series?
                        const seriesElement = doc.querySelector('.BookPageTitleSection h3 a');
                        const series = seriesElement ? seriesElement.textContent.trim() : null;
                        const seriesLink = seriesElement ? seriesElement.href : null;

                        // Show a small image of the cover
                        const coverImageElement = doc.querySelector('.BookCover__image img');
                        const coverImage = coverImageElement ? coverImageElement.src : 'https://dryofg8nmyqjw.cloudfront.net/images/no-cover.png';

                        // Extract the first author
                        const authorElement = doc.querySelector('span.ContributorLink__name');
                        const author = authorElement ? authorElement.textContent.trim() : '-';

                        // Extract the first genre
                        const genreElement = doc.querySelector('.BookPageMetadataSection__genreButton a');
                        const genre = genreElement ? genreElement.textContent.trim() : '-';

                        // Extract the publication year
                        const publicationElement = doc.querySelector('p[data-testid="publicationInfo"]');
                        const publicationYear = publicationElement ? extractYear(publicationElement.textContent.trim()) : '';

                        // Extract the number of pages
                        const pagesElement = doc.querySelector('p[data-testid="pagesFormat"]');
                        const numberOfPages = pagesElement ? extractNumberOfPages(pagesElement.textContent.trim()) : '';

                        // Is it on a shelf already?
                        const actionsElement = doc.querySelector('.BookPageMetadataSection__mobileBookActions');
                        const onShelf = isShelved(actionsElement);

                        const awards = getLiteraryAwards(doc);

                        const data = {
                            asin: asin,
                            coverImage: coverImage,
                            title: title || "Unknown Title",
                            fullTitle: fullTitle,
                            longTitle: fullTitle.length > longTitleLength,
                            author: author,
                            series: series,
                            seriesLink: seriesLink,
                            rating: rating,
                            ratingsCount: ratingsCount,
                            reviewsCount: reviewsCount,
                            genre: genre,
                            goodreadsUrl: `https://www.goodreads.com/book/isbn/${asin}`,
                            publicationYear: publicationYear,
                            numberOfPages: numberOfPages,
                            onShelf: onShelf,
                            awards: awards
                        };
                        log(`Parsed data for ${data.title}: ${JSON.stringify(data)}`);
                        resolve(data);
                    },
                    onerror: function(error) {
                        log(`Error fetching data for ASIN: ${asin}`);
                        reject(error);
                    }
                });
            }, 250);
        });
    }

    function getRatingColor(rating) {
        rating = parseFloat(rating);
        for (let i = highRatingThresholds.length - 1; i >= 0; i--) {
            if (rating >= highRatingThresholds[i]) {
                return highRatingColors[i];
            }
        }
        for (let i = lowRatingThresholds.length - 1; i >= 0; i--) {
            if (rating < lowRatingThresholds[i]) {
                return lowRatingColors[i];
            }
        }
        return '';
    }

    function getRatingsCountColor(count) {
        count = parseInt(count.replace(/,/g, ''));
        for (let i = highRatingsCountThresholds.length - 1; i >= 0; i--) {
            if (count >= highRatingsCountThresholds[i]) {
                return highRatingsCountColors[i];
            }
        }
        for (let i = lowRatingsCountThresholds.length - 1; i >= 0; i--) {
            if (count < lowRatingsCountThresholds[i]) {
                return lowRatingsCountColors[i];
            }
        }
        return '';
    }

    function addUIElement(books, isLoading = false) {
        let container = document.getElementById('goodreads-ratings');
        if (!container) {
            container = document.createElement('div');
            container.id = 'goodreads-ratings';
            container.style.position = 'fixed';
            container.style.top = '10px';
            container.style.right = '10px';
            container.style.backgroundColor = 'white';
            container.style.padding = '10px';
            container.style.border = '1px solid black';
            container.style.zIndex = '9999';
            container.style.maxHeight = '80vh';
            container.style.overflowY = 'auto';
            document.body.appendChild(container);
        }

        // Clear previous content
        container.innerHTML = '';

        const headerContainer = document.createElement('div');
        headerContainer.style.display = 'flex';
        headerContainer.style.justifyContent = 'space-between';
        headerContainer.style.alignItems = 'center';
        headerContainer.style.marginBottom = '10px';

        const title = document.createElement('h3');
        title.textContent = 'Goodreads Ratings';
        title.style.margin = '0';
        headerContainer.appendChild(title);

        // Add pause/resume button only if there are links to process
        if (linksToProcess.length > 0) {
            const pauseResumeButton = document.createElement('button');
            pauseResumeButton.textContent = isPaused ? 'Resume' : 'Pause';
            pauseResumeButton.addEventListener('click', togglePauseResume);
            headerContainer.appendChild(pauseResumeButton);
        }

        container.appendChild(headerContainer);

        const statusMessage = document.createElement('p');
        if (isPaused) {
            statusMessage.textContent = 'Processing paused';
        } else if (isLoading) {
            statusMessage.textContent = `Processing... (${currentLinkIndex} of ${linksToProcess.length} books processed)`;
        } else if (books.length === 0) {
            statusMessage.textContent = 'No books processed yet';
        } else {
            statusMessage.textContent = 'Processing finished!';
        }
        container.appendChild(statusMessage);

        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';
        //table.style.tableLayout = 'fixed'; // This helps maintain consistent column widths

        // Add a style for all cells
        const cellStyle = `
            border: 1px solid gray;
            padding: 5px;
            vertical-align: middle;
        `;

        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Cover', 'Title', 'Author', 'Price', 'Rating', 'Rating Count', 'Review Count', 'Genre', 'Year', 'Pages'].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.cssText = cellStyle + `
                font-weight: bold;
                background-color: #f2f2f2;
            `;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement('tbody');
        books.forEach(book => {
            if (book) {
                const row = document.createElement('tr');

                // Cover image cell
                const coverCell = document.createElement('td');
                coverCell.style.cssText = cellStyle + `
                    text-align: center;
                    width: 30px;
                `;
                const coverImg = document.createElement('img');
                coverImg.src = book.coverImage;
                coverImg.alt = `${book.title} cover`;
                coverImg.style.width = '28px';
                coverImg.style.height = 'auto';
                coverImg.style.display = 'block';
                coverImg.style.margin = '0 auto'; // Centers the image horizontally
                coverImg.onerror = function() {
                    this.onerror = null;
                    this.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
                    this.alt = 'Cover not available';
                };
                coverCell.appendChild(coverImg);
                row.appendChild(coverCell);

                // Title cell
                const titleCell = document.createElement('td');
                if (book.series) {
                    const seriesNumber = extractLastNumber(book.series);
                    const seriesLink = document.createElement('a');
                    seriesLink.href = book.seriesLink;
                    seriesLink.target = '_blank';
                    seriesLink.textContent = seriesNumber ? `📚${seriesNumber}` : '📚';
                    seriesLink.title = book.series;
                    titleCell.appendChild(seriesLink);
                    // Add small span separator
                    const span = document.createElement('span');
                    span.textContent = ' | ';
                    titleCell.appendChild(span);
                }
                const link = document.createElement('a');
                link.href = book.goodreadsUrl;
                link.target = '_blank';
                link.textContent = book.onShelf ? `⭐ ${book.title}` : book.title;
                if (book.longTitle) {
                    link.title = decodeHTMLEntities(book.fullTitle);
                }
                titleCell.appendChild(link);
                titleCell.style.cssText = cellStyle;
                row.appendChild(titleCell);

                // Author cell
                const authorCell = document.createElement('td');
                authorCell.textContent = book.author;
                authorCell.style.cssText = cellStyle;
                row.appendChild(authorCell);

                // Price cell
                const priceCell = document.createElement('td');
                const priceLink = document.createElement('a');
                priceLink.href = `https://www.amazon.com/dp/${book.asin}`;
                priceLink.target = '_blank';
                priceLink.textContent = book.price.replace(/^(?!\$)/, '$') || 'N/A'; // Add leading $ sign
                if (book.awards) {
                    priceLink.textContent = `🏅 ${priceLink.textContent}`;
                    priceLink.title = decodeHTMLEntities(book.awards);
                }
                priceCell.appendChild(priceLink);
                priceCell.style.cssText = cellStyle + 'text-align: right;';
                row.appendChild(priceCell);

                // Rating cell
                const ratingCell = document.createElement('td');
                ratingCell.textContent = book.rating;
                ratingCell.style.cssText = cellStyle + `
                    text-align: right;
                    background-color: ${getRatingColor(book.rating)};

                `;
                row.appendChild(ratingCell);

                // Ratings count cell
                const ratingsCountCell = document.createElement('td');
                ratingsCountCell.textContent = book.ratingsCount;
                ratingsCountCell.style.cssText = cellStyle + `
                    text-align: right;
                    background-color: ${getRatingsCountColor(book.ratingsCount)};

                `;
                row.appendChild(ratingsCountCell);

                // Reviews count cell
                const reviewsCountCell = document.createElement('td');
                reviewsCountCell.textContent = book.reviewsCount;
                reviewsCountCell.style.cssText = cellStyle + 'text-align: right;';
                row.appendChild(reviewsCountCell);

                // Genre cell
                const genreCell = document.createElement('td');
                genreCell.textContent = book.genre;
                genreCell.style.cssText = cellStyle;
                row.appendChild(genreCell);

                // Genre cell
                const publicationCell = document.createElement('td');
                publicationCell.textContent = book.publicationYear;
                publicationCell.style.cssText = cellStyle;
                row.appendChild(publicationCell);

                // Pages cell
                const pagesCell = document.createElement('td');
                pagesCell.textContent = book.numberOfPages.toLocaleString('en-US');
                pagesCell.style.cssText = cellStyle + 'text-align: right;';
                row.appendChild(pagesCell);

                tbody.appendChild(row);
            }
        });
        table.appendChild(tbody);

        container.appendChild(table);
    }

    function addBookAndSort(newBook) {
        if (newBook && !processedASINs.has(newBook.asin)) {
            bookData.push(newBook);
            processedASINs.add(newBook.asin);
            bookData.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
            addUIElement(bookData, linksToProcess.length > currentLinkIndex);
        }
    }

    async function processBooks() {
        while (currentLinkIndex < linksToProcess.length && !isPaused) {
            const link = linksToProcess[currentLinkIndex];
            const asin = getASIN(link.href);

            currentLinkIndex++;

            if (asin && !processedASINs.has(asin)) {
                try {
                    log(`---- Processing book ${currentLinkIndex} of ${linksToProcess.length} ----`);
                    const data = await fetchGoodreadsData(asin);
                    if (data) {
                        // Kindle Deals pages
                        const asinFace = link.closest('[data-testid="asin-face"]');
                        if (asinFace) {
                            const priceElement = asinFace && asinFace.querySelector('[data-testid="price"]');
                            if (priceElement) {
                                const priceTextContent = priceElement.textContent;
                                const priceMatch = priceTextContent.match(/Deal price: \$(\d+\.\d+)/);
                                data.price = priceMatch ? priceMatch[1] : 'N/A';
                            }
                        }
                        // Regular Kindle page
                        if (!data.price) {
                            const sibling = link.nextElementSibling;
                            if (sibling) {
                                const bookPrice = sibling.querySelector('bds-book-price');
                                if (bookPrice) {
                                    // data.price = bookPrice.getAttribute('unstylizedprice'); -- old way
                                    const shadowRoot = bookPrice.shadowRoot;
                                    if (shadowRoot) {
                                        const priceDiv = shadowRoot.querySelector('.offscreen'); // .price -> .offscreen
                                        if (priceDiv) {
                                            data.price = priceDiv.textContent.trim();
                                        }
                                    }
                                }
                            }
                        }
                        if (!data.price) {
                            data.price = 'N/A';
                        }
                        addBookAndSort(data);
                    }
                } catch (error) {
                    console.error('Error fetching Goodreads data:', error);
                }
            }
        }

        if (currentLinkIndex >= linksToProcess.length) {
            log('All books processed');
            addUIElement(bookData, false);
        }
    }

    function togglePauseResume() {
        isPaused = !isPaused;
        if (!isPaused) {
            processBooks();
        }
        addUIElement(bookData, !isPaused);
    }

    function addButtonToSection(section) {
        const button = document.createElement('button');
        button.textContent = 'Get Goodreads Ratings';
        button.style.margin = '10px';
        button.addEventListener('click', async function() {
            this.disabled = true;

            const newLinks = getUniqueBookLinks(section);
            linksToProcess.push(...newLinks.filter(link => !processedASINs.has(getASIN(link.href))));

            if (!isProcessing) {
                isProcessing = true;
                addUIElement(bookData, true);

                try {
                    await processBooks();
                } finally {
                    isProcessing = false;
                }
            }
        });
        section.insertBefore(button, section.firstChild);
    }

    function initializeScript() {
        const addButtonsToSections = () => {
            const sections = document.querySelectorAll('div[data-testid="asin-faceout-shoveler.card-cont"]:not([data-goodreads-processed]), div[data-testid="mfs-container.hor-scroll"]:not([data-goodreads-processed])');
            sections.forEach(section => {
                addButtonToSection(section);
                section.setAttribute('data-goodreads-processed', 'true');
            });
            if (sections.length > 0) {
                log(`Buttons added to ${sections.length} new sections`);
            }
        };

        // Initial run
        addButtonsToSections();

        // Set up a MutationObserver to watch for new sections
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    addButtonsToSections();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        log('Script initialized and watching for new sections');
    }

    // Run the script when the page is fully loaded
    if (document.readyState === 'complete') {
        initializeScript();
    } else {
        window.addEventListener('load', initializeScript);
    }

    log('Script setup complete');
})();
