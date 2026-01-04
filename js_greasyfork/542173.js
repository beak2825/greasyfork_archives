// ==UserScript==
// @name         Better Papers Cool
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Adds cross-links between arXiv.org and papers.cool for easier navigation with advanced date filtering.
// @author       SunnyYYLin
// @match        https://arxiv.org/abs/*
// @match        https://papers.cool/arxiv/*
// @grant        GM_xmlhttpRequest
// @connect      arxiv.org
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542173/Better%20Papers%20Cool.user.js
// @updateURL https://update.greasyfork.org/scripts/542173/Better%20Papers%20Cool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Configuration for auto-load behavior
     */
    const autoLoadConfig = {
        enabled: false,  // Will be set when filter is applied
        minPapersPerPage: 5,  // Minimum papers to show before auto-loading next page
        maxAutoLoadAttempts: 10,  // Maximum consecutive auto-loads to prevent infinite loops
        currentAttempts: 0
    };

    /**
     * Handles the click event on the [BibTex] button.
     * Fetches BibTeX data from arXiv, copies it to the clipboard, and provides user feedback.
     * @param {Event} event - The click event object.
     * @param {string} arxivId - The arXiv ID of the paper.
     */
    function handleBibtexCopyClick(event, arxivId) {
        event.preventDefault(); // 阻止链接默认跳转

        const bibtexButtonElement = event.currentTarget; // 获取被点击的按钮元素
        const originalText = bibtexButtonElement.textContent;
        const bibtexUrl = `https://arxiv.org/bibtex/${arxivId}`;

        // 改变按钮文字，提供即时反馈
        bibtexButtonElement.textContent = '[Fetching...]';

        // 使用 GM_xmlhttpRequest 执行跨域请求
        GM_xmlhttpRequest({
            method: 'GET',
            url: bibtexUrl,
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const bibtexText = response.responseText;
                    navigator.clipboard.writeText(bibtexText).then(() => {
                        bibtexButtonElement.textContent = '[Copied!]';
                        setTimeout(() => {
                            bibtexButtonElement.textContent = originalText;
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy BibTeX: ', err);
                        alert('复制失败，请检查浏览器权限。');
                        bibtexButtonElement.textContent = originalText; // 失败时恢复
                    });
                } else {
                    console.error('Error fetching BibTeX, status:', response.status);
                    alert('获取 BibTeX 数据失败 (服务器状态码: ' + response.status + ')。');
                    bibtexButtonElement.textContent = originalText; // 失败时恢复
                }
            },
            onerror: function(error) {
                console.error('Error fetching BibTeX:', error);
                alert('获取 BibTeX 数据失败 (网络错误)。');
                bibtexButtonElement.textContent = originalText; // 失败时恢复
            }
        });
    }

    /**
     * This function runs on arxiv.org pages.
     * It finds the ArXiv ID and adds a link to the corresponding papers.cool page.
     */
    function enhanceArxivPage() {
        const fullTextDiv = document.querySelector('div.full-text');
        if (!fullTextDiv) {
            console.log('Enhancer Script: Could not find full-text div on arXiv.');
            return;
        }

        let list = fullTextDiv.querySelector('ul');
        if (!list) {
            console.log('Enhancer Script: Could not find link list on arXiv.');
            return;
        }

        const match = window.location.pathname.match(/\/abs\/(.+)/);
        if (!match || !match[1]) {
            console.log('Enhancer Script: Could not parse arXiv ID from URL.');
            return;
        }
        const arxivId = match[1];

        const papersCoolLink = document.createElement('a');
        papersCoolLink.textContent = 'Papers Cool';
        papersCoolLink.href = `https://papers.cool/arxiv/${arxivId}`;
        papersCoolLink.target = '_blank';
        papersCoolLink.rel = 'noopener noreferrer';
        papersCoolLink.className = 'abs-button';
        papersCoolLink.title = 'View on papers.cool';

        const listItem = document.createElement('li');
        listItem.appendChild(papersCoolLink);
        list.appendChild(listItem);
    }

    /**
     * Extracts the publication date from a paper card element.
     * @param {HTMLElement} card - The paper card element.
     * @returns {Date|null} - The parsed date or null if not found.
     */
    function extractPublishDate(card) {
        const dateDataElement = card.querySelector('.date-data');
        if (!dateDataElement) {
            return null;
        }
        
        const dateText = dateDataElement.textContent.trim();
        const date = new Date(dateText);
        
        return isNaN(date.getTime()) ? null : date;
    }

    /**
     * Extracts publish date from HTML string (for pre-filtering)
     * @param {string} htmlString - HTML string containing paper card
     * @returns {Date|null} - The parsed date or null if not found
     */
    function extractPublishDateFromHTML(htmlString) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;
        const dateDataElement = tempDiv.querySelector('.date-data');
        
        if (!dateDataElement) {
            return null;
        }
        
        const dateText = dateDataElement.textContent.trim();
        const date = new Date(dateText);
        
        return isNaN(date.getTime()) ? null : date;
    }

    /**
     * Checks if HTML content of a paper matches the filter criteria
     * @param {string} paperHTML - HTML string of a paper card
     * @returns {boolean} - Whether the paper should be shown
     */
    function shouldShowPaperHTML(paperHTML) {
        if (!filterState.isActive) {
            return true;
        }

        const publishDate = extractPublishDateFromHTML(paperHTML);
        
        if (!publishDate) {
            return true; // Show papers without valid dates
        }

        if (filterState.fromDate && publishDate < filterState.fromDate) {
            return false;
        }
        if (filterState.toDate && publishDate > filterState.toDate) {
            return false;
        }

        return true;
    }

    /**
     * Creates and inserts a date filter UI component.
     */
    function createDateFilter() {
        // Check if filter already exists
        if (document.getElementById('date-filter-container')) {
            return;
        }

        // Create filter container
        const filterContainer = document.createElement('div');
        filterContainer.id = 'date-filter-container';
        filterContainer.style.cssText = `
            margin: 20px auto;
            padding: 15px;
            background-color: #f5f5f5;
            border-radius: 8px;
            max-width: 900px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        // Create filter title
        const filterTitle = document.createElement('h3');
        filterTitle.textContent = '📅 Date Filter';
        filterTitle.style.cssText = `
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #333;
        `;

        // Create date inputs container
        const inputsContainer = document.createElement('div');
        inputsContainer.style.cssText = `
            display: flex;
            gap: 15px;
            align-items: center;
            flex-wrap: wrap;
        `;

        // Create from date input
        const fromLabel = document.createElement('label');
        fromLabel.textContent = 'From: ';
        fromLabel.style.cssText = 'font-weight: bold;';
        
        const fromInput = document.createElement('input');
        fromInput.type = 'date';
        fromInput.id = 'date-filter-from';
        fromInput.style.cssText = `
            padding: 5px 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        `;

        // Create to date input
        const toLabel = document.createElement('label');
        toLabel.textContent = 'To: ';
        toLabel.style.cssText = 'font-weight: bold; margin-left: 10px;';
        
        const toInput = document.createElement('input');
        toInput.type = 'date';
        toInput.id = 'date-filter-to';
        toInput.style.cssText = `
            padding: 5px 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        `;

        // Create apply button
        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply Filter';
        applyButton.style.cssText = `
            padding: 6px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-left: 10px;
        `;
        applyButton.onmouseover = () => applyButton.style.backgroundColor = '#45a049';
        applyButton.onmouseout = () => applyButton.style.backgroundColor = '#4CAF50';

        // Create reset button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.style.cssText = `
            padding: 6px 15px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-left: 5px;
        `;
        resetButton.onmouseover = () => resetButton.style.backgroundColor = '#da190b';
        resetButton.onmouseout = () => resetButton.style.backgroundColor = '#f44336';

        // Create status text
        const statusText = document.createElement('span');
        statusText.id = 'date-filter-status';
        statusText.style.cssText = `
            margin-left: 15px;
            color: #666;
            font-size: 14px;
        `;

        // Create auto-load toggle section
        const autoLoadContainer = document.createElement('div');
        autoLoadContainer.style.cssText = `
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        const autoLoadCheckbox = document.createElement('input');
        autoLoadCheckbox.type = 'checkbox';
        autoLoadCheckbox.id = 'auto-load-toggle';
        autoLoadCheckbox.checked = true;
        autoLoadCheckbox.style.cssText = `
            cursor: pointer;
            width: 18px;
            height: 18px;
        `;

        const autoLoadLabel = document.createElement('label');
        autoLoadLabel.htmlFor = 'auto-load-toggle';
        autoLoadLabel.textContent = '🔄 Auto-load more pages when filtered results are too few';
        autoLoadLabel.style.cssText = `
            cursor: pointer;
            font-size: 13px;
            color: #555;
        `;

        const autoLoadInfo = document.createElement('span');
        autoLoadInfo.textContent = '(Min: 5 papers per page)';
        autoLoadInfo.style.cssText = `
            font-size: 12px;
            color: #999;
            margin-left: 5px;
        `;

        autoLoadContainer.appendChild(autoLoadCheckbox);
        autoLoadContainer.appendChild(autoLoadLabel);
        autoLoadContainer.appendChild(autoLoadInfo);

        // Assemble the filter UI
        inputsContainer.appendChild(fromLabel);
        inputsContainer.appendChild(fromInput);
        inputsContainer.appendChild(toLabel);
        inputsContainer.appendChild(toInput);
        inputsContainer.appendChild(applyButton);
        inputsContainer.appendChild(resetButton);
        inputsContainer.appendChild(statusText);

        filterContainer.appendChild(filterTitle);
        filterContainer.appendChild(inputsContainer);
        filterContainer.appendChild(autoLoadContainer);

        // Insert filter before papers container
        const papersContainer = document.querySelector('.papers');
        if (papersContainer) {
            papersContainer.parentNode.insertBefore(filterContainer, papersContainer);
        } else {
            const infoElement = document.querySelector('p.info');
            if (infoElement) {
                infoElement.parentNode.insertBefore(filterContainer, infoElement.nextSibling);
            }
        }

        // Add event listeners
        applyButton.addEventListener('click', applyDateFilter);
        resetButton.addEventListener('click', resetDateFilter);
        
        autoLoadCheckbox.addEventListener('change', (e) => {
            if (e.target.checked && filterState.isActive) {
                // Re-enable auto-load and check if we need more papers
                autoLoadConfig.enabled = true;
                autoLoadConfig.currentAttempts = 0;
                checkAndLoadMorePapers();
            } else {
                autoLoadConfig.enabled = false;
            }
        });
    }

    /**
     * Stores the current filter state for persistence across page updates
     */
    const filterState = {
        fromDate: null,
        toDate: null,
        isActive: false
    };

    /**
     * Checks if a paper should be shown based on current filter state.
     * @param {HTMLElement} card - The paper card element.
     * @returns {boolean} - Whether the paper should be shown.
     */
    function shouldShowPaper(card) {
        if (!filterState.isActive) {
            return true;
        }

        const publishDate = extractPublishDate(card);
        
        if (!publishDate) {
            return true; // Show papers without valid dates
        }

        if (filterState.fromDate && publishDate < filterState.fromDate) {
            return false;
        }
        if (filterState.toDate && publishDate > filterState.toDate) {
            return false;
        }

        return true;
    }

    /**
     * Applies the date filter to show/hide papers based on selected date range.
     * @param {boolean} updateStatus - Whether to update the status text (default: true)
     */
    function applyDateFilter(updateStatus = true) {
        const fromInput = document.getElementById('date-filter-from');
        const toInput = document.getElementById('date-filter-to');
        const statusText = document.getElementById('date-filter-status');

        const fromDate = fromInput.value ? new Date(fromInput.value) : null;
        const toDate = toInput.value ? new Date(toInput.value + 'T23:59:59') : null;

        if (fromDate && toDate && fromDate > toDate) {
            if (statusText) {
                statusText.textContent = '❌ Invalid date range!';
                statusText.style.color = '#f44336';
            }
            return;
        }

        // Update filter state
        filterState.fromDate = fromDate;
        filterState.toDate = toDate;
        filterState.isActive = !!(fromDate || toDate);

        // Enable auto-load when filter is active
        autoLoadConfig.enabled = filterState.isActive;
        autoLoadConfig.currentAttempts = 0;

        const paperCards = document.querySelectorAll('.panel.paper');
        let visibleCount = 0;
        let hiddenCount = 0;

        paperCards.forEach(card => {
            if (shouldShowPaper(card)) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
                hiddenCount++;
            }
        });

        // Update status text
        if (updateStatus && statusText) {
            if (!filterState.isActive) {
                statusText.textContent = '📊 Showing all papers';
                statusText.style.color = '#666';
            } else {
                statusText.textContent = `📊 Showing ${visibleCount} papers (${hiddenCount} filtered out)`;
                statusText.style.color = '#4CAF50';
            }
        }

        // Check if we need to auto-load more papers
        if (filterState.isActive && visibleCount < autoLoadConfig.minPapersPerPage) {
            checkAndLoadMorePapers();
        }
    }

    /**
     * Checks visible paper count and triggers loading more if needed
     */
    function checkAndLoadMorePapers() {
        // Check if auto-load is enabled by user
        const autoLoadCheckbox = document.getElementById('auto-load-toggle');
        const userEnabled = autoLoadCheckbox ? autoLoadCheckbox.checked : true;
        
        if (!userEnabled || !autoLoadConfig.enabled || autoLoadConfig.currentAttempts >= autoLoadConfig.maxAutoLoadAttempts) {
            if (autoLoadConfig.currentAttempts >= autoLoadConfig.maxAutoLoadAttempts) {
                console.log('Date Filter: Reached maximum auto-load attempts.');
                const statusText = document.getElementById('date-filter-status');
                if (statusText) {
                    const currentText = statusText.textContent.replace(' ⚠️ Max pages reached', '');
                    statusText.textContent = currentText + ' ⚠️ Max pages reached';
                }
            }
            return;
        }

        const visiblePapers = document.querySelectorAll('.panel.paper:not([style*="display: none"])');
        
        if (visiblePapers.length < autoLoadConfig.minPapersPerPage) {
            console.log(`Date Filter: Only ${visiblePapers.length} visible papers, attempting to load more...`);
            autoLoadConfig.currentAttempts++;
            
            // Update status to show loading
            const statusText = document.getElementById('date-filter-status');
            if (statusText) {
                statusText.textContent += ` 🔄 Loading page ${autoLoadConfig.currentAttempts}...`;
            }
            
            // Try to trigger the pagination plugin
            triggerNextPage();
        }
    }

    /**
     * Attempts to trigger the next page load by simulating scroll or clicking next button
     */
    function triggerNextPage() {
        // Method 1: Try to find and click the "next" button or pagination link
        const nextButton = document.querySelector('a[rel="next"], .pagination .next, button.load-more');
        if (nextButton && !nextButton.disabled) {
            console.log('Date Filter: Clicking next page button...');
            setTimeout(() => nextButton.click(), 500);
            return;
        }

        // Method 2: Trigger scroll event (for infinite scroll plugins)
        console.log('Date Filter: Triggering scroll to load more papers...');
        setTimeout(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
            
            // Also dispatch scroll event
            window.dispatchEvent(new Event('scroll'));
            
            // Check again after a delay
            setTimeout(() => {
                checkAndLoadMorePapers();
            }, 2000);
        }, 500);
    }

    /**
     * Resets the date filter and shows all papers.
     */
    function resetDateFilter() {
        const fromInput = document.getElementById('date-filter-from');
        const toInput = document.getElementById('date-filter-to');
        const statusText = document.getElementById('date-filter-status');

        fromInput.value = '';
        toInput.value = '';
        if (statusText) {
            statusText.textContent = '';
        }

        // Clear filter state
        filterState.fromDate = null;
        filterState.toDate = null;
        filterState.isActive = false;

        // Disable auto-load
        autoLoadConfig.enabled = false;
        autoLoadConfig.currentAttempts = 0;

        const paperCards = document.querySelectorAll('.panel.paper');
        paperCards.forEach(card => {
            card.style.display = '';
        });
    }

    /**
     * Sets up a MutationObserver to watch for new papers being added to the page.
     * This ensures that auto-pagination plugins work with the date filter.
     */
    function setupPaperObserver() {
        const papersContainer = document.querySelector('.papers');
        if (!papersContainer) {
            console.log('Date Filter: Could not find papers container for observation.');
            return;
        }

        const observer = new MutationObserver((mutations) => {
            let newPapersAdded = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        // Check if the added node is a paper card
                        if (node.nodeType === 1 && node.classList && node.classList.contains('paper')) {
                            newPapersAdded = true;
                            
                            // Apply filter to the new paper immediately
                            if (filterState.isActive) {
                                if (!shouldShowPaper(node)) {
                                    node.style.display = 'none';
                                }
                            }

                            // Also add arXiv and BibTeX links to new papers
                            const arxivId = node.id;
                            if (arxivId) {
                                addArxivAndBibtexLinks(node, arxivId);
                            }
                        }
                    });
                }
            });

            // Update status if new papers were added and filter is active
            if (newPapersAdded && filterState.isActive) {
                // Use a slight delay to ensure all papers are processed
                setTimeout(() => {
                    const allPapers = document.querySelectorAll('.panel.paper');
                    let visibleCount = 0;
                    let hiddenCount = 0;

                    allPapers.forEach(card => {
                        if (card.style.display === 'none') {
                            hiddenCount++;
                        } else {
                            visibleCount++;
                        }
                    });

                    const statusText = document.getElementById('date-filter-status');
                    if (statusText) {
                        statusText.textContent = `📊 Showing ${visibleCount} papers (${hiddenCount} filtered out)`;
                        statusText.style.color = '#4CAF50';
                    }

                    // Check if we need to load more papers
                    if (filterState.isActive && visibleCount < autoLoadConfig.minPapersPerPage) {
                        setTimeout(() => checkAndLoadMorePapers(), 1000);
                    } else {
                        // Reset attempt counter if we have enough papers
                        autoLoadConfig.currentAttempts = 0;
                    }
                }, 100);
            }
        });

        // Start observing the papers container for changes
        observer.observe(papersContainer, {
            childList: true,
            subtree: true
        });

        console.log('Date Filter: MutationObserver set up to watch for new papers.');
    }

    /**
     * Helper function to add arXiv and BibTeX links to a paper card.
     * Extracted to avoid code duplication for dynamically added papers.
     * @param {HTMLElement} card - The paper card element.
     * @param {string} arxivId - The arXiv ID of the paper.
     */
    function addArxivAndBibtexLinks(card, arxivId) {
        const titleHeader = card.querySelector('h2.title');
        if (!titleHeader) {
            return;
        }

        // Ensure [arXiv] button exists (don't confuse with other arXiv links like the index anchor)
        let hasArxivButton = false;
        titleHeader.querySelectorAll('a').forEach(a => {
            if (/\[arXiv\]/i.test((a.textContent || '').trim())) {
                hasArxivButton = true;
            }
        });
        if (!hasArxivButton && arxivId) {
            const arxivButton = document.createElement('a');
            arxivButton.textContent = '[arXiv]';
            arxivButton.href = `https://arxiv.org/abs/${arxivId}`;
            arxivButton.target = '_blank';
            arxivButton.title = 'View on arXiv';
            arxivButton.className = 'title-rel notranslate';
            arxivButton.style.marginLeft = '3px';
            titleHeader.append(' ', arxivButton);
        }

        // Ensure [BibTex] link exists
        let hasBibtex = false;
        titleHeader.querySelectorAll('a').forEach(a => {
            if (/bibtex/i.test(a.textContent || '')) {
                hasBibtex = true;
            }
        });
        if (!hasBibtex && arxivId) {
            const bibtexButton = document.createElement('a');
            bibtexButton.textContent = '[BibTex]';
            bibtexButton.href = '#';
            bibtexButton.title = 'Copy BibTeX citation';
            bibtexButton.className = 'title-rel notranslate';
            bibtexButton.style.marginLeft = '3px';
            bibtexButton.addEventListener('click', (event) => {
                handleBibtexCopyClick(event, arxivId);
            });
            titleHeader.append(' ', bibtexButton);
        }
    }

    /**
     * This function runs on papers.cool pages.
     * It finds the link back to ArXiv and adds new links for BibTeX and direct PDF access.
     */
    function enhancePapersCoolPage() {
        const paperCards = document.querySelectorAll('.panel.paper');

        paperCards.forEach(card => {
            const arxivId = card.id;
            if (!arxivId) {
                return;
            }

            addArxivAndBibtexLinks(card, arxivId);
        });

        // Create date filter UI
        createDateFilter();

        // Set up observer for dynamically added papers (auto-pagination compatibility)
        setupPaperObserver();
    }

    /**
     * Main execution block.
     */
    function run() {
        const hostname = window.location.hostname;

        if (hostname.includes('arxiv.org')) {
            enhanceArxivPage();
            console.log('Enhancer Script: Running on arXiv.org');
        } else if (hostname.includes('papers.cool')) {
            enhancePapersCoolPage();
            console.log('Enhancer Script: Running on papers.cool');
        } else {
            console.log('Enhancer Script: Not on arXiv.org or papers.cool, no action taken.');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
