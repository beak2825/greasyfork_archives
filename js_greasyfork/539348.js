// ==UserScript==
// @name         LinkedIn Sales Navigator Scraper
// @namespace    https://github.com/NoahTheGinger/LinkedIn-Sales-Navigator-Results-Scraper/
// @version      2.0
// @description  Scrape LinkedIn Sales Navigator search results with pagination and export to markdown
// @author       NoahTheGinger
// @match        https://www.linkedin.com/sales/search/people*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539348/LinkedIn%20Sales%20Navigator%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/539348/LinkedIn%20Sales%20Navigator%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        DELAY_BETWEEN_PAGES: 2500, // Slightly increased for stability between pages
        WAIT_FOR_RESULTS: 1500,    // Time to wait for initial results to appear
        MAX_RETRIES: 3,            // Maximum retries for failed operations
        BATCH_SIZE: 25,            // Expected results per page
        SCROLL_STEP_PX: 500,       // Distance to scroll in each step
        SCROLL_PAUSE_MS: 300,      // Pause between scroll steps
        LOAD_TIMEOUT_MS: 8000      // Max time to wait for profiles to load on a page
    };

    // Data storage
    let scrapedProfiles = [];
    let isScrapingInProgress = false;
    let currentPage = 1;
    let totalPages = 1;

    // UI Elements
    let statusUI = null;
    let progressUI = null;

    // Initialize the scraper
    function initializeScraper() {
        createUI();
        detectCurrentPage();
        updateUI();
    }

    // Create the scraper UI
    function createUI() {
        const container = document.createElement('div');
        container.id = 'sn-scraper-ui';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 2px solid #0073b1;
            border-radius: 8px;
            padding: 15px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            min-width: 300px;
        `;

        container.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0; color: #0073b1; font-size: 16px;">SN Scraper</h3>
                <button id="sn-scraper-close" style="margin-left: auto; background: none; border: none; font-size: 18px; cursor: pointer;">×</button>
            </div>
            <div id="sn-scraper-status" style="margin-bottom: 10px; font-size: 14px; color: #666;">
                Ready to scrape
            </div>
            <div id="sn-scraper-progress" style="margin-bottom: 15px;">
                <div style="background: #f3f3f3; border-radius: 4px; height: 8px; overflow: hidden;">
                    <div id="sn-scraper-progress-bar" style="height: 100%; background: #0073b1; width: 0%; transition: width 0.3s;"></div>
                </div>
                <div id="sn-scraper-progress-text" style="font-size: 12px; color: #666; margin-top: 5px;">
                    Page 0 of 0 | 0 profiles collected
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button id="sn-scraper-start" style="background: #0073b1; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                    Start Scraping
                </button>
                <button id="sn-scraper-export" style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;" disabled>
                    Export MD
                </button>
            </div>
        `;

        document.body.appendChild(container);

        // Event listeners
        document.getElementById('sn-scraper-close').addEventListener('click', () => {
            container.style.display = 'none';
        });

        document.getElementById('sn-scraper-start').addEventListener('click', startScraping);
        document.getElementById('sn-scraper-export').addEventListener('click', exportToMarkdown);

        statusUI = document.getElementById('sn-scraper-status');
        progressUI = document.getElementById('sn-scraper-progress-text');
    }

    // Detect current page and total pages
    function detectCurrentPage() {
        const paginationContainer = document.querySelector('[data-sn-view-name="search-pagination"]');
        if (paginationContainer) {
            // Get current page and total pages from "Page X of Y" text
            const pageStateText = paginationContainer.querySelector('.artdeco-pagination__page-state');
            if (pageStateText) {
                const match = pageStateText.textContent.match(/Page (\d+) of (\d+)/);
                if (match) {
                    currentPage = parseInt(match[1]) || 1;
                    totalPages = parseInt(match[2]) || 1;
                }
            }

            // Fallback: Get current page from active button
            if (!currentPage) {
                const currentPageBtn = paginationContainer.querySelector('.artdeco-pagination__indicator--number.active');
                if (currentPageBtn) {
                    currentPage = parseInt(currentPageBtn.textContent) || 1;
                }
            }

            // Fallback: Get total pages from highest page number button
            if (!totalPages) {
                const pageButtons = paginationContainer.querySelectorAll('[data-test-pagination-page-btn]');
                if (pageButtons.length > 0) {
                    const pageNumbers = Array.from(pageButtons).map(btn => parseInt(btn.getAttribute('data-test-pagination-page-btn')));
                    totalPages = Math.max(...pageNumbers);
                }
            }
        }
    }

    // Update UI with current status
    function updateUI() {
        if (progressUI) {
            progressUI.textContent = `Page ${currentPage} of ${totalPages} | ${scrapedProfiles.length} profiles collected`;
        }

        const progressBar = document.getElementById('sn-scraper-progress-bar');
        if (progressBar && totalPages > 0) {
            const progress = ((currentPage - 1) / totalPages) * 100;
            progressBar.style.width = `${progress}%`;
        }

        const exportBtn = document.getElementById('sn-scraper-export');
        if (exportBtn) {
            exportBtn.disabled = scrapedProfiles.length === 0;
        }
    }

    // Start the scraping process
    async function startScraping() {
        if (isScrapingInProgress) return;

        isScrapingInProgress = true;
        const startBtn = document.getElementById('sn-scraper-start');
        startBtn.disabled = true;
        startBtn.textContent = 'Scraping...';

        try {
            statusUI.textContent = 'Starting scrape...';

            // Scrape current page first
            await scrapeCurrentPage();

            // If there are more pages, continue
            if (currentPage < totalPages) {
                await scrapeRemainingPages();
            }

            statusUI.textContent = `Completed! ${scrapedProfiles.length} profiles scraped`;
            startBtn.textContent = 'Scrape Complete';

        } catch (error) {
            console.error('Scraping error:', error);
            statusUI.textContent = `Error: ${error.message}`;
            startBtn.textContent = 'Start Scraping';
            startBtn.disabled = false;
        } finally {
            isScrapingInProgress = false;
        }
    }

    // Scrape current page
    async function scrapeCurrentPage() {
        // Update page detection after navigation
        detectCurrentPage();

        statusUI.textContent = `Scraping page ${currentPage}...`;

        // Wait for initial results to load
        await waitForResults();

        // Scroll to load all profiles on the page
        statusUI.textContent = `Loading all profiles on page ${currentPage}...`;
        const profiles = await scrollToLoadAllProfiles();
        scrapedProfiles.push(...profiles);

        updateUI();

        console.log(`Scraped page ${currentPage}: ${profiles.length} profiles`);
    }

    // Scrape remaining pages
    async function scrapeRemainingPages() {
        console.log(`Starting pagination: Current page ${currentPage}, Total pages ${totalPages}`);

        for (let page = currentPage + 1; page <= totalPages; page++) {
            try {
                console.log(`Attempting to navigate to page ${page}`);
                statusUI.textContent = `Navigating to page ${page}...`;

                // Navigate to next page
                await navigateToNextPage(page);

                // Wait for page to load
                await new Promise(resolve => setTimeout(resolve, CONFIG.WAIT_FOR_RESULTS));

                // Scrape the page
                await scrapeCurrentPage();

                console.log(`Successfully scraped page ${page}. Total profiles: ${scrapedProfiles.length}`);

                // Delay between pages
                await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_BETWEEN_PAGES));

            } catch (error) {
                console.error(`Error on page ${page}:`, error);
                statusUI.textContent = `Error on page ${page}: ${error.message}. Stopping scrape.`;

                // If we have some results, don't throw - just stop
                if (scrapedProfiles.length > 0) {
                    console.log(`Stopping scrape with ${scrapedProfiles.length} profiles collected so far.`);
                    break;
                } else {
                    throw error;
                }
            }
        }
    }

    // Navigate to next page using the Next button
    async function navigateToNextPage(pageNumber) {
        // Update current page for tracking
        currentPage = pageNumber;

        // Find and click the Next button
        const nextButton = document.querySelector('.artdeco-pagination__button--next:not([disabled])');
        if (!nextButton) {
            throw new Error(`Next button not found or disabled on page ${pageNumber - 1}`);
        }

        // Click the Next button
        nextButton.click();

        // Wait for navigation to complete and page to update
        await waitForPageNavigation(pageNumber);
    }

    // Wait for page navigation to complete
    async function waitForPageNavigation(expectedPage) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 30; // 15 seconds max wait

            const checkNavigation = () => {
                attempts++;

                // Check if pagination shows the expected page
                const pageStateText = document.querySelector('[data-sn-view-name="search-pagination"] .artdeco-pagination__page-state');
                if (pageStateText) {
                    const match = pageStateText.textContent.match(/Page (\d+) of (\d+)/);
                    if (match) {
                        const currentDisplayedPage = parseInt(match[1]);
                        if (currentDisplayedPage === expectedPage) {
                            resolve();
                            return;
                        }
                    }
                }

                if (attempts >= maxAttempts) {
                    reject(new Error(`Navigation to page ${expectedPage} timed out`));
                    return;
                }

                setTimeout(checkNavigation, 500);
            };

            checkNavigation();
        });
    }

    // Wait for search results to load - optimized version
    async function waitForResults() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            // Use a longer initial wait time
            const maxAttempts = Math.ceil(3000 / 100);

            const checkResults = () => {
                const resultsContainer = document.querySelector('#search-results-container');
                const profileCards = document.querySelectorAll('[data-x-search-result="LEAD"]');

                if (resultsContainer && profileCards.length > 0) {
                    resolve();
                } else if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(checkResults, 100);
                } else {
                    reject(new Error('Initial results did not load in time.'));
                }
            };

            checkResults();
        });
    }

    // New iterative scrolling strategy to ensure all profiles are loaded
    async function scrollToLoadAllProfiles() {
        const resultsContainer = document.querySelector('#search-results-container');
        if (!resultsContainer) {
            console.warn('Search results container not found');
            return [];
        }

        console.log('Starting new iterative scroll to load all profiles...');

        let previousCount = -1;
        let stableCount = 0;
        const maxStableChecks = 4; // Require 4 stable checks (~1.2s) to be sure

        const startTime = Date.now();

        while (Date.now() - startTime < CONFIG.LOAD_TIMEOUT_MS) {
            // Get current profile count
            const currentCount = document.querySelectorAll('[data-x-search-result="LEAD"]').length;

            console.log(`Found ${currentCount} profiles. Scrolling...`);

            // If we have the full batch, we're done
            if (currentCount >= CONFIG.BATCH_SIZE) {
                console.log(`Found ${currentCount} (target: ${CONFIG.BATCH_SIZE}) profiles. Load complete.`);
                break;
            }

            // Check if the count has stabilized
            if (currentCount === previousCount) {
                stableCount++;
                if (stableCount >= maxStableChecks) {
                    console.log(`Profile count stabilized at ${currentCount}. Assuming page is fully loaded.`);
                    break;
                }
            } else {
                stableCount = 0; // Reset counter if new profiles were loaded
                previousCount = currentCount;
            }

            // Scroll down by one step
            resultsContainer.scrollTop += CONFIG.SCROLL_STEP_PX;

            // Wait for a moment to let content load
            await new Promise(resolve => setTimeout(resolve, CONFIG.SCROLL_PAUSE_MS));

            // Also check if we've hit the bottom of the scroll container
            if (resultsContainer.scrollTop + resultsContainer.clientHeight >= resultsContainer.scrollHeight - 10) {
                 console.log('Reached the bottom of the scroll container.');
                 // Wait a little longer at the bottom to catch any stragglers
                 await new Promise(resolve => setTimeout(resolve, 500));
                 const finalCount = document.querySelectorAll('[data-x-search-result="LEAD"]').length;
                 if (finalCount === currentCount) {
                     console.log('Count is stable at the bottom. Exiting scroll loop.');
                     break;
                 }
            }
        }

        if (Date.now() - startTime >= CONFIG.LOAD_TIMEOUT_MS) {
            console.warn(`Load timeout reached after ${CONFIG.LOAD_TIMEOUT_MS}ms. Proceeding with currently found profiles.`);
        }

        const allProfiles = extractAllLoadedProfiles();
        console.log(`Iterative scroll completed. Collected ${allProfiles.length} profiles total.`);

        // Scroll back to top to be safe for the next page load, just in case.
        resultsContainer.scrollTop = 0;

        return allProfiles;
    }

    // Extract ALL loaded profiles from the page (no viewport filtering)
    function extractAllLoadedProfiles() {
        const profiles = [];
        const profileCards = document.querySelectorAll('[data-x-search-result="LEAD"]');

        console.log(`Found ${profileCards.length} profile cards to extract`);

        profileCards.forEach((card, index) => {
            try {
                const profile = extractProfileData(card);
                if (profile && profile.name) { // Only include profiles with valid names
                    profiles.push(profile);
                    console.log(`Extracted profile ${index + 1}: ${profile.name}`);
                } else {
                    console.warn(`Profile ${index + 1} missing name, skipping`);
                }
            } catch (error) {
                console.error(`Error extracting profile ${index + 1}:`, error);
            }
        });

        return profiles;
    }

    // Extract individual profile data
    function extractProfileData(card) {
        const profile = {};

        // Name
        const nameLink = card.querySelector('[data-view-name="search-results-lead-name"]');
        if (nameLink) {
            profile.name = nameLink.querySelector('[data-anonymize="person-name"]')?.textContent?.trim() || '';
            profile.profileUrl = nameLink.href || '';
        }

        // Profile image
        const imageLink = card.querySelector('[data-lead-search-result*="profile-image-link"]');
        if (imageLink) {
            const img = imageLink.querySelector('img');
            profile.imageUrl = img?.src || '';
        }

        // Title
        const titleElement = card.querySelector('[data-anonymize="title"]');
        profile.title = titleElement?.textContent?.trim() || '';

        // Company
        const companyLink = card.querySelector('[data-view-name="search-results-lead-company-name"]');
        if (companyLink) {
            profile.company = companyLink.textContent?.trim() || '';
            profile.companyUrl = companyLink.href || '';
        }

        // Location
        const locationElement = card.querySelector('[data-anonymize="location"]');
        profile.location = locationElement?.textContent?.trim() || '';

        // Connection degree
        const degreeElement = card.querySelector('.artdeco-entity-lockup__degree');
        profile.connectionDegree = degreeElement?.textContent?.trim() || '';

        // Experience
        const experienceElement = card.querySelector('[data-anonymize="job-title"]');
        profile.experience = experienceElement?.textContent?.trim() || '';

        // Mutual connections
        const mutualConnectionsElement = card.querySelector('button[data-control-name="search_spotlight_second_degree_connection"]');
        if (mutualConnectionsElement) {
            profile.mutualConnections = mutualConnectionsElement.textContent?.trim() || '';
        }

        // Shared education
        const sharedEducationElement = card.querySelector('button[data-control-name="search_spotlight_shared_education"]');
        if (sharedEducationElement) {
            profile.sharedEducation = sharedEducationElement.textContent?.trim() || '';
        }

        // Previous experience
        const previousExperienceContainer = card.querySelector('dd.mb3');
        if (previousExperienceContainer) {
            const experienceText = previousExperienceContainer.textContent?.trim() || '';
            profile.previousExperience = experienceText;
        }

        return profile;
    }

    // Export to markdown
    function exportToMarkdown() {
        if (scrapedProfiles.length === 0) {
            alert('No profiles to export!');
            return;
        }

        const markdown = generateMarkdown();
        downloadMarkdown(markdown);
    }

    // Generate markdown content
    function generateMarkdown() {
        const timestamp = new Date().toISOString().split('T')[0];
        const searchUrl = window.location.href;

        let markdown = `# LinkedIn Sales Navigator Search Results\n\n`;
        markdown += `**Date**: ${timestamp}\n`;
        markdown += `**Search URL**: ${searchUrl}\n`;
        markdown += `**Total Profiles**: ${scrapedProfiles.length}\n\n`;
        markdown += `---\n\n`;

        scrapedProfiles.forEach((profile, index) => {
            markdown += `## ${index + 1}. ${profile.name || 'Unknown Name'}\n\n`;

            if (profile.imageUrl) {
                markdown += `![Profile Image](${profile.imageUrl})\n\n`;
            }

            markdown += `**Title**: ${profile.title || 'N/A'}\n`;
            markdown += `**Company**: ${profile.company || 'N/A'}\n`;
            markdown += `**Location**: ${profile.location || 'N/A'}\n`;
            markdown += `**Connection**: ${profile.connectionDegree || 'N/A'}\n`;

            if (profile.mutualConnections) {
                markdown += `**Mutual Connections**: ${profile.mutualConnections}\n`;
            }

            if (profile.sharedEducation) {
                markdown += `**Shared Education**: ${profile.sharedEducation}\n`;
            }

            if (profile.experience) {
                markdown += `**Experience**: ${profile.experience}\n`;
            }

            if (profile.previousExperience) {
                markdown += `**Previous Experience**: ${profile.previousExperience}\n`;
            }

            if (profile.profileUrl) {
                markdown += `**Profile URL**: [View Profile](${profile.profileUrl})\n`;
            }

            if (profile.companyUrl) {
                markdown += `**Company URL**: [View Company](${profile.companyUrl})\n`;
            }

            markdown += `\n---\n\n`;
        });

        return markdown;
    }

    // Download markdown file
    function downloadMarkdown(content) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const filename = `linkedin-sales-navigator-results-${timestamp}.md`;

        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        statusUI.textContent = `Exported ${scrapedProfiles.length} profiles to ${filename}`;
    }

    // Initialize when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScraper);
    } else {
        initializeScraper();
    }

})();