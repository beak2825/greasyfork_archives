// ==UserScript==
// @name         Geocaching Trackable GPX Exporter
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Add a GPX export button to download your trackable locations as a GPX file for use in other mapping applications.
// @author       ViezeVingertjes
// @match        *://*.geocaching.com/track/search.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geocaching.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535475/Geocaching%20Trackable%20GPX%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/535475/Geocaching%20Trackable%20GPX%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log("Geocaching Trackable GPX Exporter loaded!");

    /**
     * Helper function to check if an element is visible
     * @param {Element} element - The DOM element to check
     * @returns {boolean} - Whether the element is visible
     */
    function isElementVisible(element) {
      if (!element) return false;
      
      const style = window.getComputedStyle(element);
      return style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             style.opacity !== '0' &&
             element.offsetWidth > 0 && 
             element.offsetHeight > 0;
    }

    /**
     * Extracts trackable information from anchor elements on the page
     * @returns {Map} Map of trackable objects with id as key
     */
    function extractTrackablesFromPage() {
      const anchorElements = document.querySelectorAll("a");
      const trackablesMap = new Map();
      const trackableUrlPrefix = "https://www.geocaching.com/track/details.aspx?id=";

      anchorElements.forEach(anchor => {
        const href = anchor.getAttribute("href");
        if (href && href.startsWith(trackableUrlPrefix)) {
          try {
            const url = new URL(href, document.baseURI);
            const id = url.searchParams.get("id");
            const name = anchor.innerText.trim();

            if (id && name && !trackablesMap.has(id)) {
              trackablesMap.set(id, { id, name });
            }
          } catch (e) {
            console.error("Error parsing URL or extracting trackable info:", e, href);
          }
        }
      });

      return trackablesMap;
    }

    /**
     * Extracts pagination information from the page
     * @returns {Object} Pagination info with currentPage, totalPages, and page link elements
     */
    function extractPaginationInfo() {
      const paginationInfo = {
        currentPage: 1,
        totalPages: 1,
        pageLinks: []
      };

      // Look for pagination text that shows "Page: X of Y"
      const paginationText = document.querySelector('.PageBuilderWidget b:nth-of-type(2)');
      const totalPagesText = document.querySelector('.PageBuilderWidget b:nth-of-type(3)');
      
      if (paginationText && totalPagesText) {
        try {
          paginationInfo.currentPage = parseInt(paginationText.textContent, 10);
          paginationInfo.totalPages = parseInt(totalPagesText.textContent, 10);
        } catch (e) {
          console.error("Error parsing pagination numbers:", e);
        }
      }
      
      // Find all page links
      const pageLinks = document.querySelectorAll('a[id^="ctl00_ContentBody_ResultsPager_lbGoToPage_"]');
      if (pageLinks.length > 0) {
        paginationInfo.pageLinks = Array.from(pageLinks);
      }
      
      // Find next page button
      const nextPageBtn = document.querySelector('a[href^="javascript:__doPostBack"][href*="Next"]');
      if (nextPageBtn) {
        paginationInfo.nextPageBtn = nextPageBtn;
      }
      
      return paginationInfo;
    }

    /**
     * Fetches trackables from a specific page using a hidden iframe approach
     * @param {number} pageNum - The page number to fetch
     * @returns {Promise<Map>} Promise that resolves with trackables from that page
     */
    async function fetchPageTrackablesViaIframe(pageNum) {
      try {
        console.log(`Attempting to fetch trackables from page ${pageNum}`);
        
        // Find the page link
        const pageLinks = document.querySelectorAll('a[id^="ctl00_ContentBody_ResultsPager_lbGoToPage_"]');
        const pageLink = Array.from(pageLinks).find(link => link.textContent.trim() === String(pageNum));
        
        if (!pageLink) {
          throw new Error(`Could not find link for page ${pageNum}`);
        }
        
        // Create a hidden iframe to load the page
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.style.border = 'none';
        // Add sandbox attribute to prevent script execution which causes the cookie errors
        iframe.setAttribute('sandbox', 'allow-forms allow-same-origin');
        iframe.name = `trackable-page-${pageNum}-frame`;
        document.body.appendChild(iframe);
        
        // Prepare URL for iframe
        const href = pageLink.getAttribute('href');
        const match = href.match(/__doPostBack\('([^']+)','([^']*)'\)/);
        
        if (!match) {
          throw new Error(`Could not parse postback parameters for page ${pageNum}`);
        }
        
        // Create a promise that resolves when the iframe loads
        const iframeLoadPromise = new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error(`Timeout fetching page ${pageNum}`));
          }, 15000); // 15 second timeout
          
          iframe.onload = () => {
            clearTimeout(timeoutId);
            resolve();
          };
          
          iframe.onerror = () => {
            clearTimeout(timeoutId);
            reject(new Error(`Error loading page ${pageNum}`));
          };
        });
        
        // Navigate the iframe to the page url by creating a navigation function
        const safeNavigate = () => {
          try {
            // Create a simple form to handle the postback
            const form = document.createElement('form');
            form.style.display = 'none';
            form.action = window.location.href;
            form.method = 'post';
            form.target = iframe.name;
            
            // Create and add the necessary postback fields
            const eventTarget = document.createElement('input');
            eventTarget.type = 'hidden';
            eventTarget.name = '__EVENTTARGET';
            eventTarget.value = match[1];
            form.appendChild(eventTarget);
            
            const eventArgument = document.createElement('input');
            eventArgument.type = 'hidden';
            eventArgument.name = '__EVENTARGUMENT';
            eventArgument.value = match[2];
            form.appendChild(eventArgument);
            
            // Copy all hidden inputs from the current page to our form
            document.querySelectorAll('input[type="hidden"]').forEach(hiddenInput => {
              if (hiddenInput.name !== '__EVENTTARGET' && hiddenInput.name !== '__EVENTARGUMENT') {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = hiddenInput.name;
                input.value = hiddenInput.value;
                form.appendChild(input);
              }
            });
            
            // Add form to document, submit it, then remove it
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } catch (e) {
            console.error(`Error navigating iframe to page ${pageNum}:`, e);
            // As a fallback, try to directly set the src
            const siteUrl = window.location.origin + window.location.pathname;
            iframe.src = `${siteUrl}?${new URLSearchParams({page: pageNum}).toString()}`;
          }
        };
        
        // Navigate the iframe
        safeNavigate();
        
        // Wait for the iframe to load
        await iframeLoadPromise;
        
        // Extract trackables from the iframe content
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const trackablesMap = new Map();
        
        // Find trackable links in the iframe
        const anchorElements = iframeDoc.querySelectorAll("a");
        const trackableUrlPrefix = "https://www.geocaching.com/track/details.aspx?id=";
        const relativeUrlPrefix = "/track/details.aspx?id=";
        
        anchorElements.forEach(anchor => {
          const href = anchor.getAttribute("href");
          if (href && (href.startsWith(trackableUrlPrefix) || href.startsWith(relativeUrlPrefix))) {
            try {
              // Extract the ID from the URL - handle both absolute and relative URLs
              let id;
              if (href.startsWith(trackableUrlPrefix)) {
                id = href.substring(trackableUrlPrefix.length);
              } else {
                id = href.substring(relativeUrlPrefix.length);
              }
              
              // Sometimes there are additional URL parameters
              if (id.includes('&')) {
                id = id.split('&')[0];
              }
              
              const name = anchor.innerText.trim();
              
              if (id && name && !trackablesMap.has(id)) {
                trackablesMap.set(id, { id, name });
              }
            } catch (e) {
              console.error(`Error parsing URL or extracting trackable info from page ${pageNum}:`, e, href);
            }
          }
        });
        
        // Clean up
        document.body.removeChild(iframe);
        
        console.log(`Found ${trackablesMap.size} trackables on page ${pageNum}`);
        return trackablesMap;
        
      } catch (error) {
        console.error(`Error fetching page ${pageNum}:`, error);
        return new Map(); // Return empty map on error
      }
    }

    /**
     * Processes trackables from all pages using an iframe approach
     * @returns {Promise<Map>} Promise that resolves with a map of all trackables
     */
    async function processAllPagesTrackables() {
      const allTrackables = new Map();
      const paginationInfo = extractPaginationInfo();
      
      // First, get trackables from the current page
      const currentPageTrackables = extractTrackablesFromPage();
      currentPageTrackables.forEach((trackable, id) => {
        allTrackables.set(id, trackable);
      });
      
      console.log(`Found ${currentPageTrackables.size} trackables on current page (page ${paginationInfo.currentPage})`);
      
      // If only one page, return immediately
      if (paginationInfo.totalPages <= 1) {
        console.log(`Only one page of trackables found, no need to fetch more pages`);
        return allTrackables;
      }
      
      // Find the status message element if it exists
      const statusElement = document.querySelector('#trackable-gpx-export div[style*="color: #666"]');
      if (statusElement) {
        statusElement.textContent = `Finding trackables across ${paginationInfo.totalPages} pages...`;
      }
      
      // Process each page sequentially - we need to do this because of the ASP.NET viewstate
      for (let page = 1; page <= paginationInfo.totalPages; page++) {
        // Skip the current page as we already processed it
        if (page === paginationInfo.currentPage) {
          console.log(`Skipping current page ${page} as we already processed it`);
          continue;
        }
        
        try {
          if (statusElement) {
            statusElement.textContent = `Fetching trackables from page ${page} of ${paginationInfo.totalPages}...`;
          }
          
          // Fetch trackables from this page
          const pageTrackables = await fetchPageTrackablesViaIframe(page);
          
          // Add these trackables to our collection
          pageTrackables.forEach((trackable, id) => {
            allTrackables.set(id, trackable);
          });
          
          if (statusElement) {
            statusElement.textContent = `Found ${allTrackables.size} trackables so far (processed ${page} of ${paginationInfo.totalPages} pages)`;
          }
          
        } catch (error) {
          console.error(`Error processing page ${page}:`, error);
          // Continue with next page despite error
        }
      }
      
      return allTrackables;
    }

    /**
     * Parse trackable stops from the map page HTML content
     * @param {string} htmlContent - HTML content from the trackable map page
     * @param {string} trackableId - ID of the trackable for error reporting
     * @returns {Array} Array of stop objects with coordinates and cache names
     */
    function parseTrackableStops(htmlContent, trackableId) {
      const stops = [];
      const tbStopsRegex = /var tbStops\s*=\s*(\[[\s\S]*?\])\s*;/;
      const match = htmlContent.match(tbStopsRegex);

      if (!match || !match[1]) {
        console.warn(`tbStops not found for trackable ${trackableId}`);
        return stops;
      }

      try {
        const arrayContentString = match[1];
        // Use a more robust regex that handles special characters in cache names
        // Pattern: { coordinates part, name part }
        const objectPattern = /\{\s*ll\s*:\s*\[\s*([\d\.-]+)\s*,\s*([\d\.-]+)\s*\]\s*,\s*n\s*:\s*"([^"]*)"\s*\}/g;
        let objectMatch;

        while ((objectMatch = objectPattern.exec(arrayContentString)) !== null) {
          if (objectMatch && objectMatch[1] && objectMatch[2] && objectMatch[3]) {
            try {
              const lat = parseFloat(objectMatch[1]);
              const lon = parseFloat(objectMatch[2]);
              const name = objectMatch[3];
              stops.push({
                coordinates: [lat, lon],
                cacheName: name
              });
            } catch (e) {
              console.error(`Error parsing coordinates for trackable ${trackableId}:`, e);
            }
          } else {
            console.error(`Failed to extract data from object string for trackable ${trackableId}`);
          }
        }
      } catch (e) {
        console.error(`Error processing tbStops for trackable ${trackableId}:`, e);
      }

      return stops;
    }

    /**
     * Fetches and processes trackable stops data
     * @param {Object} trackable - The trackable object to enrich with stops
     * @returns {Object} The enriched trackable object
     */
    async function fetchTrackableStops(trackable) {
      const mapUrl = `https://www.geocaching.com/track/map_gm.aspx?ID=${trackable.id}`;
      
      try {
        const response = await fetch(mapUrl);
        if (!response.ok) {
          console.error(`Failed to fetch ${mapUrl}: ${response.status} ${response.statusText}`);
          trackable.stops = [];
          return trackable;
        }
        
        const htmlContent = await response.text();
        trackable.stops = parseTrackableStops(htmlContent, trackable.id);
        
      } catch (error) {
        console.error(`Error fetching stops for trackable ${trackable.id}:`, error);
        trackable.stops = [];
      }
      
      return trackable;
    }

    /**
     * Enriches trackables with their stop information
     * @param {Array} trackables - Array of trackable objects
     * @returns {Array} Array of enriched trackable objects
     */
    async function enrichTrackablesWithStops(trackables) {
      if (trackables.length === 0) {
        console.log("No trackables found to enrich.");
        return [];
      }
      
      const enrichedTrackables = await Promise.all(
        trackables.map(trackable => fetchTrackableStops(trackable))
      );
      
      console.log("Enriched Trackables (with stops):", enrichedTrackables);
      return enrichedTrackables;
    }

    /**
     * Generate GPX file content from trackable data
     * @param {Array} trackables - Array of trackable objects with their stops
     * @returns {string} GPX file content
     */
    function generateGPX(trackables) {
      // Filter trackables with stops and extract the last stop (current location) of each trackable
      const trackablesWithStops = trackables.filter(t => t.stops && t.stops.length > 0);
      
      if (trackablesWithStops.length === 0) {
        return null;
      }
      
      // Start the GPX content with correct metadata tags
      let gpxContent = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" 
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"
     version="1.1" 
     creator="Geocaching Trackable GPX Exporter">
  <metadata>
    <name>Geocaching Trackables</name>
    <desc>Current locations of Geocaching trackables</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
`;
      
      // Add waypoints for each trackable's current location with correct GPX tags
      trackablesWithStops.forEach(trackable => {
        const lastStop = trackable.stops[trackable.stops.length - 1];
        const [lat, lon] = lastStop.coordinates;
        
        gpxContent += `  <wpt lat="${lat}" lon="${lon}">
    <name>${escapeXml(trackable.name)}</name>
    <desc>Trackable: ${escapeXml(trackable.name)} at ${escapeXml(lastStop.cacheName)}</desc>
    <sym>Geocache</sym>
    <extensions>
      <trackable id="${trackable.id}" name="${escapeXml(trackable.name)}" />
      <cache name="${escapeXml(lastStop.cacheName)}" />
    </extensions>
  </wpt>
`;
      });
      
      // Close the GPX content
      gpxContent += `</gpx>`;
      
      return gpxContent;
    }
    
    /**
     * Escape XML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    function escapeXml(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    }
    
    /**
     * Download content as a file
     * @param {string} content - File content
     * @param {string} fileName - Name of the file
     * @param {string} contentType - MIME type of the file
     */
    function downloadFile(content, fileName, contentType) {
      const blob = new Blob([content], { type: contentType });
      const url = URL.createObjectURL(blob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = fileName;
      
      // Simulate click to trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
      // Clean up
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    }
    
    // Add a global variable to track if processing is currently in progress
    let isProcessingTrackables = false;
    // Add a global variable to track if we're currently generating a GPX file
    let isLoadingGPX = false;
    
    /**
     * Exports trackables to a GPX file, including pagination handling
     */
    async function exportAllTrackablesToGPX() {
      // Create a status message container
      const statusContainer = document.createElement('div');
      statusContainer.style.marginTop = '10px';
      statusContainer.style.color = '#666';
      statusContainer.style.fontSize = '14px';
      statusContainer.textContent = 'Finding trackables across pages...';
      document.getElementById('trackable-gpx-export').appendChild(statusContainer);
      
      try {
        // First collect all trackables from all pages
        const allTrackables = await processAllPagesTrackables();
        
        // Update status message
        statusContainer.textContent = `Found ${allTrackables.size} trackables. Fetching location data...`;
        
        // Create a progress counter for enrichment
        let enrichedCount = 0;
        
        // Enrich trackables with stops data
        const enrichedTrackables = [];
        
        // Use Promise.all to process trackables in parallel
        const trackableArray = Array.from(allTrackables.values());
        const batchSize = 10; // Process in batches to avoid overwhelming the server
        
        for (let i = 0; i < trackableArray.length; i += batchSize) {
          const batch = trackableArray.slice(i, i + batchSize);
          
          // Process this batch
          const batchPromises = batch.map(trackable => 
            fetchTrackableStops(trackable)
              .then(enrichedTrackable => {
                enrichedCount++;
                // Update status every few trackables
                if (enrichedCount % 5 === 0 || enrichedCount === allTrackables.size) {
                  statusContainer.textContent = `Processing trackable locations (${enrichedCount}/${allTrackables.size})...`;
                }
                return enrichedTrackable;
              })
          );
          
          // Wait for this batch to complete before starting the next one
          const batchResults = await Promise.all(batchPromises);
          enrichedTrackables.push(...batchResults);
        }
        
        // Filter out trackables with no stops
        const trackablesWithLocations = enrichedTrackables.filter(tb => tb.stops && tb.stops.length > 0);
        
        // Update status message
        statusContainer.textContent = `Generating GPX file for ${trackablesWithLocations.length} trackables...`;
        
        // Export the GPX file using the correct function names
        const gpxContent = generateGPX(trackablesWithLocations);
        downloadFile(gpxContent, `geocaching-trackables-${new Date().toISOString().slice(0, 10)}.gpx`, 'application/gpx+xml');
        
        // Update final status message
        statusContainer.textContent = `GPX exported successfully with ${trackablesWithLocations.length} trackables.`;
        setTimeout(() => {
          // Fade out the status message after a few seconds
          statusContainer.style.transition = 'opacity 1s';
          statusContainer.style.opacity = '0';
          setTimeout(() => statusContainer.remove(), 1000);
        }, 5000);
        
      } catch (error) {
        console.error('Error exporting trackables to GPX:', error);
        statusContainer.textContent = `Error: ${error.message || 'Failed to export GPX file'}`;
        statusContainer.style.color = '#e74c3c';
      }
    }

    /**
     * Function to add the export button to the page
     */
    function addExportButton() {
      // First check if we have any trackables on the page
      const trackables = extractTrackablesFromPage();
      if (trackables.size === 0) {
        // No trackables found, don't add the button
        return;
      }
      
      // Check if button already exists
      if (document.getElementById('trackable-gpx-export')) {
        return;
      }
      
      const container = document.createElement('div');
      container.id = 'trackable-gpx-export';
      container.style.margin = '20px 0';
      container.style.padding = '0';
      
      const exportButton = document.createElement('div');
      exportButton.innerHTML = '<i class="fa fa-download" style="margin-right: 5px;"></i> Export Trackables as GPX';
      exportButton.style.display = 'inline-block';
      exportButton.style.padding = '8px 16px';
      exportButton.style.backgroundColor = '#4CAF50';
      exportButton.style.color = 'white';
      exportButton.style.borderRadius = '4px';
      exportButton.style.cursor = 'pointer';
      exportButton.style.fontWeight = 'bold';
      exportButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
      exportButton.style.userSelect = 'none';
      
      // Add hover effect
      exportButton.onmouseover = () => {
        exportButton.style.backgroundColor = '#45a049';
      };
      exportButton.onmouseout = () => {
        exportButton.style.backgroundColor = '#4CAF50';
      };
      
      // Add click handler
      exportButton.onclick = (e) => {
        e.preventDefault();
        
        // Check if the button is disabled
        if (exportButton.getAttribute('disabled') === 'true') {
          return;
        }
        
        // Disable the button during processing
        exportButton.setAttribute('disabled', 'true');
        exportButton.style.backgroundColor = '#cccccc';
        exportButton.style.cursor = 'not-allowed';
        
        // Start the export process
        exportAllTrackablesToGPX()
          .finally(() => {
            // Re-enable the button when done
            exportButton.removeAttribute('disabled');
            exportButton.style.backgroundColor = '#4CAF50';
            exportButton.style.cursor = 'pointer';
          });
      };
      
      container.appendChild(exportButton);
      
      // Find the best container to insert the button
      const tableContainer = document.querySelector('.Table, table, .table-container');
      if (tableContainer && tableContainer.parentNode) {
        tableContainer.parentNode.insertBefore(container, tableContainer);
      } else {
        // Fallback to main content area
        const contentArea = document.querySelector('#Content, #content, .Content');
        if (contentArea) {
          if (contentArea.firstChild) {
            contentArea.insertBefore(container, contentArea.firstChild);
          } else {
            contentArea.appendChild(container);
          }
        }
      }
    }
    
    // Run initialization when the script loads
    function initialize() {
      console.log("Initializing GPX exporter...");
      
      // Check if there are trackables on the page before proceeding
      const initialTrackables = extractTrackablesFromPage();
      if (initialTrackables.size === 0) {
        console.log("No trackables found on page. Setting up observer to watch for trackables to be loaded.");
        // Still set up the mutation observer to catch when trackables might be loaded via AJAX
        setupMutationObserver();
        return;
      }
      
      // Add button immediately
      addExportButton();
      
      // Set up retry mechanism in case the page structure isn't fully loaded
      let retryCount = 0;
      const maxRetries = 5;
      
      function retryAddButton() {
        if (document.getElementById('trackable-gpx-export')) {
          console.log("Export button already exists, no need to retry");
          return;
        }
        
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying to add export button (attempt ${retryCount}/${maxRetries})`);
          addExportButton();
          setTimeout(retryAddButton, 1000);
        }
      }
      
      // Start retry mechanism
      setTimeout(retryAddButton, 1000);
      
      // Also check for AJAX-loaded content
      setupMutationObserver();
    }
    
    // Set up mutation observer to watch for AJAX content changes
    function setupMutationObserver() {
      const observer = new MutationObserver((mutations) => {
        // Don't add the button if we already have it
        if (document.getElementById('trackable-gpx-export')) {
          return;
        }
        
        let shouldAddButton = false;
        
        // Check if any mutations affect our elements of interest (trackable links)
        for (const mutation of mutations) {
          // Skip mutations that don't add nodes
          if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) {
            continue;
          }
          
          // Look for relevant data tables or trackable links
          if (mutation.target.classList.contains('Table') || 
              mutation.target.querySelector('.Table') ||
              mutation.target.querySelector('a[href*="track/details.aspx"]')) {
            // Double-check that there are actually trackables on the page
            const trackablesMap = extractTrackablesFromPage();
            if (trackablesMap.size > 0) {
              shouldAddButton = true;
              break;
            }
          }
        }
        
        if (shouldAddButton) {
          console.log('Content changed, adding export button');
          addExportButton();
        }
      });
      
      // Start observing with configuration
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
    }
    
    // Start initialization
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialize);
    } else {
      // DOM already loaded, initialize now
      initialize();
    }
})(); 