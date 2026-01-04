// ==UserScript==
// @name        OBG-Reporte de programa de citas de descarga
// @description Permite obtener un reporte del programa de citas, obtener información de las citas y obtener la información de los tiempos de arribo reales y tiempos de las tareas.
// @namespace   CBI_P44_Plugins
// @version     2.3.5
// @author      tomasmoralescbi
// @include     https://yard-visibility-na12.voc.project44.com/shipment/delivery
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/543651/OBG-Reporte%20de%20programa%20de%20citas%20de%20descarga.user.js
// @updateURL https://update.greasyfork.org/scripts/543651/OBG-Reporte%20de%20programa%20de%20citas%20de%20descarga.meta.js
// ==/UserScript==
 
 
(function() {
    let authorizationToken = null;
    let cookieValue = null;
    let debugMode = true;
    let carrierData = []; // Initialize as empty array
    
    // Debug logging function
    function debugLog() {
        if (debugMode) {
            var args = ['[Yard Report Tool]'].concat(Array.prototype.slice.call(arguments));
            console.log.apply(console, args);
        }
    }
    
    // Get all cookies as a single string
    function getAllCookies() {
        // Combine document.cookie with our intercepted cookieValue
        let allCookies = document.cookie || '';
        if (cookieValue && !allCookies.includes(cookieValue)) {
            allCookies = allCookies + '; ' + cookieValue;
        }
        return allCookies;
    }
    
    // Create the main button
    const createMainButton = () => {
        const button = document.createElement('button');
        button.textContent = 'Reporte de citas y movimientos';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '50%';
        button.style.transform = 'translateX(-50%)';
        button.style.zIndex = '9999';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', showModal);
        document.body.appendChild(button);
        
        debugLog("Main button created");
    };
 
    // Intercept XHR requests to capture authorization and cookies
    function interceptXHR() {
        debugLog("Setting up XHR interception");
        
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener('load', function() {
                if (this.responseURL && this.responseURL.includes('yard-visibility-na12.api.project44.com')) {
                    debugLog('XHR intercepted: ' + this.responseURL);
                    
                    // Get the request headers from the original request
                    try {
                        const authHeader = this._requestHeaders ? 
                            this._requestHeaders.find(h => h.name.toLowerCase() === 'authorization') : null;
                        const cookieHeader = this._requestHeaders ? 
                            this._requestHeaders.find(h => h.name.toLowerCase() === 'cookie') : null;
                        
                        if (authHeader && authHeader.value) {
                            authorizationToken = authHeader.value;
                            debugLog("Authorization captured from XHR");
                        }
                        
                        if (cookieHeader && cookieHeader.value) {
                            cookieValue = cookieHeader.value;
                            debugLog("Cookie captured from XHR");
                        }
                    } catch (e) {
                        debugLog("Error extracting headers:", e.message);
                    }
                }
            });
            origOpen.apply(this, arguments);
        };
        
        // Store original setRequestHeader
        const origSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            // Store headers for later use
            if (!this._requestHeaders) this._requestHeaders = [];
            this._requestHeaders.push({ name: header, value: value });
            
            if (header.toLowerCase() === 'authorization' && value) {
                authorizationToken = value;
                debugLog("Authorization captured from setRequestHeader");
            }
            
            if (header.toLowerCase() === 'cookie' && value) {
                cookieValue = value;
                debugLog("Cookie captured from setRequestHeader");
            }
            
            return origSetRequestHeader.apply(this, arguments);
        };
    }
 
    // Also intercept fetch requests
    function interceptFetch() {
        debugLog("Setting up fetch interception");
        
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            options = options || {};
            
            if (url && url.toString().includes('yard-visibility-na12.api.project44.com')) {
                debugLog('Fetch intercepted: ' + url.toString());
                
                if (options.headers) {
                    const headers = options.headers instanceof Headers ? 
                        Object.fromEntries([...options.headers.entries()]) : 
                        options.headers;
                        
                    if (headers.Authorization || headers.authorization) {
                        authorizationToken = headers.Authorization || headers.authorization;
                        debugLog("Authorization captured from fetch");
                    }
                    
                    if (headers.Cookie || headers.cookie) {
                        cookieValue = headers.Cookie || headers.cookie;
                        debugLog("Cookie captured from fetch");
                    }
                }
            }
            return originalFetch.apply(this, arguments);
        };
    }
 
    // Extract cookies from document
    function extractCookies() {
        debugLog("Attempting to extract cookies from document");
        if (document.cookie) {
            cookieValue = cookieValue || document.cookie;
            debugLog("Cookies extracted from document");
        } else {
            debugLog("No cookies found in document");
        }
    }
 
    // Get token from local storage
    function getTokenFromStorage() {
        debugLog("Attempting to get token from storage");
        try {
            // Check for common token storage patterns
            const storageKeys = ['token', 'accessToken', 'jwt', 'authToken', 'p44_token', 'yard_token'];
            
            for (let i = 0; i < storageKeys.length; i++) {
                const key = storageKeys[i];
                const token = localStorage.getItem(key) || sessionStorage.getItem(key);
                if (token) {
                    authorizationToken = 'Bearer ' + token;
                    debugLog('Token found in storage: ' + key);
                    return true;
                }
            }
            
            // Try to find token in any storage key
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                
                if (typeof value === 'string' && (
                    value.startsWith('eyJ') || 
                    value.includes('token') || 
                    key.includes('token') || 
                    key.includes('auth')
                )) {
                    debugLog('Potential token found in localStorage: ' + key);
                    if (value.startsWith('Bearer ')) {
                        authorizationToken = value;
                    } else if (value.startsWith('eyJ')) {
                        authorizationToken = 'Bearer ' + value;
                    }
                    return true;
                }
            }
            return false;
        } catch (e) {
            debugLog("Error accessing storage:", e.message);
            return false;
        }
    }
    
    // Initialize all interception methods
    function setupInterceptors() {
        interceptXHR();
        interceptFetch();
        extractCookies();
        getTokenFromStorage();
    }
 
    // Fetch carrier data
    async function fetchCarrierData() {
        debugLog("Fetching carrier data");
        
        const allCookies = getAllCookies();
        
        try {
            const response = await fetch("https://yard-visibility-na12.api.project44.com/v1/carrier/list?size=1000", {
                method: 'GET',
                headers: {
                    'Authorization': authorizationToken,
                    'Cookie': allCookies,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            
            if (!response.ok) {
                debugLog("Error fetching carrier data: " + response.status);
                return false;
            }
            
            const data = await response.json();
            console.log("Carrier data response:", data); // Log the full response
            
            if (Array.isArray(data)) {
                carrierData = data;
                debugLog("Carrier data fetched successfully, found " + carrierData.length + " carriers");
            } else {
                debugLog("Carrier data is not an array, structure:", data);
                // Try to extract carriers from a nested property if it exists
                if (data && typeof data === 'object') {
                    if (data.data && Array.isArray(data.data)) {
                        carrierData = data.data;
                        debugLog("Extracted carrier data from 'data' property, found " + carrierData.length + " carriers");
                    } else {
                        // Try to find any array in the response
                        for (const key in data) {
                            if (Array.isArray(data[key])) {
                                carrierData = data[key];
                                debugLog("Extracted carrier data from '" + key + "' property, found " + carrierData.length + " carriers");
                                break;
                            }
                        }
                    }
                }
                
                // If we still don't have an array, initialize empty
                if (!Array.isArray(carrierData)) {
                    carrierData = [];
                    debugLog("Could not extract carrier data, initializing empty array");
                }
            }
            
            // Log a few entries to verify structure
            if (carrierData.length > 0) {
                debugLog("Sample carrier entries:", 
                    carrierData.slice(0, 3).map(c => ({ scac: c.scac, name: c.name })));
            }
            
            return true;
        } catch (error) {
            debugLog("Error in fetchCarrierData: " + error);
            carrierData = []; // Reset to empty array on error
            return false;
        }
    }

    // Fetch shipment activity log
    async function fetchShipmentActivityLog(uuid) {
        const allCookies = getAllCookies();
        
        const url = "https://yard-visibility-na12.api.project44.com/v1/shipment/activity-log/search?start=1&end=10&shipment_id=" + 
            encodeURIComponent(uuid) + "&site=obregon&activity_type=arrival";
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': authorizationToken,
                'Cookie': allCookies,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error("Error fetching shipment activity log: " + response.status);
        }
        
        return await response.json();
    }

    // Fetch asset activity log
    async function fetchAssetActivityLog(trailerId) {
        const allCookies = getAllCookies();
        
        const url = "https://yard-visibility-na12.api.project44.com/v1/asset/activity-log/search?start=1&end=50&asset_class=trailer&asset_id=" + 
            encodeURIComponent(trailerId);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': authorizationToken,
                'Cookie': allCookies,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error("Error fetching asset activity log: " + response.status);
        }
        
        return await response.json();
    }

    // Fetch yard task details
    async function fetchYardTaskDetails(eventId) {
        const allCookies = getAllCookies();
        
        const url = "https://yard-visibility-na12.api.project44.com/v1/yard-task/" + encodeURIComponent(eventId);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': authorizationToken,
                'Cookie': allCookies,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error("Error fetching yard task: " + response.status);
        }
        
        return await response.json();
    }

    // Build URL for search API
    function buildSearchUrl(params) {
        let baseUrl = "https://yard-visibility-na12.api.project44.com/v1/shipment/delivery/search?module=listing&site=obregon&gateAppt=true";
        
        // Add status filter if specified
        if (params.status) {
            baseUrl += "&status=" + encodeURIComponent(params.status);
        }
        
        // Add pagination and sorting - default to descending order by gate_appointment_time
        baseUrl += "&page_no=" + encodeURIComponent(params.page || 1);
        baseUrl += "&size=" + encodeURIComponent(params.size || 100);
        baseUrl += "&sortOrder=" + encodeURIComponent(params.sortOrder || "desc");
        baseUrl += "&sortBy=" + encodeURIComponent(params.sortBy || "gate_appointment_time");
        
        // Add search term if present
        if (params.searchTerm) {
            baseUrl = "https://yard-visibility-na12.api.project44.com/v1/shipment/delivery/search?module=listing";
            baseUrl += "&size=" + encodeURIComponent(params.size || 100);
            baseUrl += "&page_no=" + encodeURIComponent(params.page || 1);
            baseUrl += "&search_term=" + encodeURIComponent(params.searchTerm);
        }
        
        return baseUrl;
    }

    // Fetch with timeout
    async function fetchWithTimeout(url, options, timeoutMs = 5000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }

    // Progressive retry mechanism for 524 errors and timeouts
    async function progressiveRetryFetch(originalPage, originalSize, status = '') {
        debugLog('[ProgressiveRetry] Starting progressive retry for page ' + originalPage + ' size ' + originalSize);
        
        // Calculate original range
        const startRecord = (originalPage - 1) * originalSize + 1;
        const endRecord = originalPage * originalSize;
        
        debugLog('[ProgressiveRetry] Original range: records ' + startRecord + ' to ' + endRecord);
        
        // Step 1: Try fetching 10 by 10
        const step1Size = 10;
        const step1Pages = Math.ceil(originalSize / step1Size);
        const step1StartPage = Math.ceil(startRecord / step1Size);
        
        let allData = [];
        let failedStep1Pages = [];
        
        debugLog('[ProgressiveRetry] Step 1: Fetching ' + step1Pages + ' pages of size ' + step1Size);
        
        for (let i = 0; i < step1Pages; i++) {
            const currentPage = step1StartPage + i;
            
            try {
                debugLog('[ProgressiveRetry] Step 1: Trying page ' + currentPage + ' of size ' + step1Size);
                const result = await fetchDataWithRetry(currentPage, step1Size, status);
                
                if (result && result.data) {
                    allData = allData.concat(result.data);
                    debugLog('[ProgressiveRetry] Step 1: Success for page ' + currentPage + ', got ' + result.data.length + ' records');
                }
            } catch (error) {
                debugLog('[ProgressiveRetry] Step 1: Failed for page ' + currentPage + ', error: ' + error.message);
                failedStep1Pages.push(currentPage);
            }
        }
        
        // Step 2: For failed pages from step 1, try 1 by 1
        if (failedStep1Pages.length > 0) {
            debugLog('[ProgressiveRetry] Step 2: Retrying ' + failedStep1Pages.length + ' failed pages with size 1');
            
            for (let i = 0; i < failedStep1Pages.length; i++) {
                const failedPage = failedStep1Pages[i];
                const step2StartPage = (failedPage - 1) * step1Size + 1;
                
                debugLog('[ProgressiveRetry] Step 2: Processing failed page ' + failedPage + ', fetching records ' + step2StartPage + ' to ' + (step2StartPage + step1Size - 1));
                
                for (let j = 0; j < step1Size; j++) {
                    const currentPage = step2StartPage + j;
                    
                    try {
                        debugLog('[ProgressiveRetry] Step 2: Trying page ' + currentPage + ' of size 1');
                        const result = await fetchDataWithRetry(currentPage, 1, status);
                        
                        if (result && result.data) {
                            allData = allData.concat(result.data);
                            debugLog('[ProgressiveRetry] Step 2: Success for page ' + currentPage + ', got ' + result.data.length + ' records');
                        }
                    } catch (error) {
                        debugLog('[ProgressiveRetry] Step 2: Failed for page ' + currentPage + ', skipping record. Error: ' + error.message);
                        // Continue with next record even if this one fails
                    }
                }
            }
        }
        
        debugLog('[ProgressiveRetry] Completed progressive retry, total records: ' + allData.length);
        
        return {
            data: allData,
            pagination: {
                total: allData.length,
                start: 1,
                end: allData.length
            }
        };
    }

    // Fetch data with retry mechanism (used internally by progressive retry)
    async function fetchDataWithRetry(page, size, status = '') {
        const allCookies = getAllCookies();
        
        if (!authorizationToken) {
            throw new Error("No se pudo obtener el token de autorización.");
        }
        
        const url = buildSearchUrl({
            page: page,
            size: size,
            status: status
        });
        
        debugLog('[RetryFetch] Fetching page ' + page + ' with size ' + size + (status ? ', status: ' + status : ''));
        
        const response = await fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Authorization': authorizationToken,
                'Cookie': allCookies,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }, 5000); // 5 second timeout
        
        if (!response.ok) {
            if (response.status === 524) {
                throw new Error('524 Gateway Timeout');
            }
            throw new Error("Error de API: " + response.status + " " + response.statusText);
        }
        
        const data = await response.json();
        debugLog('[RetryFetch] Received data with ' + (data.data ? data.data.length : 0) + ' records');
        
        return data;
    }

    // Fetch data by regular parameters with 524 error handling
    async function fetchData(page, size, status = '') {
        // Extract cookies before request
        extractCookies();
        
        try {
            return await fetchDataWithRetry(page, size, status);
        } catch (error) {
            if (error.message.includes('524') || error.message.includes('timeout')) {
                debugLog('[FetchData] Detected 524 error or timeout, starting progressive retry for page ' + page + ' size ' + size);
                
                // Update progress indicator if available
                const counter = document.getElementById('resultsCounter');
                if (counter) {
                    counter.textContent = 'Error 524 detectado, reintentando con páginas más pequeñas...';
                }
                
                return await progressiveRetryFetch(page, size, status);
            }
            throw error;
        }
    }

    // Fetch data by search term
    async function fetchDataByTerm(searchTerm, size = 100, page = 1, status = '') {
        // Extract cookies before request
        extractCookies();
        
        if (!authorizationToken) {
            throw new Error("No se pudo obtener el token de autorización.");
        }
        
        const allCookies = getAllCookies();
        
        const url = buildSearchUrl({
            searchTerm: searchTerm,
            size: size,
            page: page,
            status: status
        });
        
        debugLog("Fetching data for term: " + searchTerm + ", page " + page + " with " + size + " results" + (status ? ", status: " + status : ""));
            
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': authorizationToken,
                'Cookie': allCookies,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error("Error de API: " + response.status + " " + response.statusText);
        }
        
        const data = await response.json();
        debugLog("Received data for term '" + searchTerm + "' with " + (data.data ? data.data.length : 0) + " records");
        
        return data;
    }

    // Simple function to check if appointment date is within the specified range
    function isAppointmentInDateRange(appointmentTimestamp, startDateStr, endDateStr) {
        if (!appointmentTimestamp) {
            console.log('No appointment timestamp provided');
            return false;
        }
        
        // Convert appointment timestamp to date string YYYY-MM-DD
        const appointmentDate = new Date(appointmentTimestamp);
        const appointmentDateStr = appointmentDate.getFullYear() + '-' + 
            String(appointmentDate.getMonth() + 1).padStart(2, '0') + '-' + 
            String(appointmentDate.getDate()).padStart(2, '0');
        
        console.log('Checking appointment date: ' + appointmentDateStr + ' against range: ' + startDateStr + ' to ' + endDateStr);
        
        // Check start date
        if (startDateStr && appointmentDateStr < startDateStr) {
            console.log('Date ' + appointmentDateStr + ' is before start date ' + startDateStr);
            return false;
        }
        
        // Check end date
        if (endDateStr && appointmentDateStr > endDateStr) {
            console.log('Date ' + appointmentDateStr + ' is after end date ' + endDateStr);
            return false;
        }
        
        console.log('Date ' + appointmentDateStr + ' is within range');
        return true;
    }

// Date range search function with enhanced 524 error handling and early termination
async function fetchDataByDateRange(dateFrom, dateTo, status = '') {
    console.log('[DateRange] Starting search from ' + dateFrom + ' to ' + dateTo + ' with status: ' + status);
    
    let allMatchingData = [];
    let currentPage = 1;
    const pageSize = 100;
    let totalProcessed = 0;
    let maxPages = 50; // Safety limit
    let stopSearch = false; // Flag to stop search when we've passed the date range
    
    // Convert date strings to Date objects for comparison
    let startDate = null;
    let endDate = null;
    
    if (dateFrom) {
        startDate = new Date(dateFrom + 'T00:00:00');
        console.log('[DateRange] Start date filter: ' + startDate.toISOString());
    }
    
    if (dateTo) {
        endDate = new Date(dateTo + 'T23:59:59'); // End of the day
        console.log('[DateRange] End date filter: ' + endDate.toISOString());
    }
    
    while (currentPage <= maxPages && !stopSearch) {
        console.log('[DateRange] Fetching page ' + currentPage);
        
        try {
            // Update the results counter during search
            const counter = document.getElementById('resultsCounter');
            if (counter) {
                counter.textContent = 'Buscando página ' + currentPage + '... (encontrados: ' + allMatchingData.length + ')';
            }
            
            const result = await fetchData(currentPage, pageSize, status);
            
            if (!result || !result.data || result.data.length === 0) {
                console.log('[DateRange] No more data found at page ' + currentPage);
                break;
            }
            
            console.log('[DateRange] Got ' + result.data.length + ' records from page ' + currentPage);
            totalProcessed += result.data.length;
            
            let foundMatchInPage = false;
            let allRecordsBelowRange = true; // Track if all records are below the start date
            
            // Check each record
            for (let j = 0; j < result.data.length; j++) {
                const item = result.data[j];
                
                if (item.gate_appointment_time) {
                    const appointmentDate = new Date(item.gate_appointment_time);
                    console.log('[DateRange] Checking record ' + (j+1) + ' with appointment: ' + appointmentDate.toISOString());
                    
                    // Since results are in descending order, check if we've gone past the start date
                    if (startDate && appointmentDate < startDate) {
                        console.log('[DateRange] Record appointment ' + appointmentDate.toDateString() + ' is before start date ' + startDate.toDateString() + '. Stopping search.');
                        stopSearch = true;
                        break;
                    } else {
                        allRecordsBelowRange = false;
                    }
                    
                    // Check if record is within our date range
                    let withinRange = true;
                    
                    // Check against end date (since results are descending, we check this first)
                    if (endDate && appointmentDate > endDate) {
                        console.log('[DateRange] ✗ Skipped record with appointment: ' + appointmentDate.toDateString() + ' (after end date)');
                        withinRange = false;
                    }
                    
                    // Check against start date
                    if (withinRange && startDate && appointmentDate < startDate) {
                        console.log('[DateRange] ✗ Skipped record with appointment: ' + appointmentDate.toDateString() + ' (before start date)');
                        withinRange = false;
                        // Since results are descending, if we hit a record before start date, stop searching
                        stopSearch = true;
                        break;
                    }
                    
                    if (withinRange) {
                        allMatchingData.push(item);
                        foundMatchInPage = true;
                        console.log('[DateRange] ✓ Added record with appointment: ' + appointmentDate.toDateString());
                    }
                } else {
                    console.log('[DateRange] ✗ Skipped record without appointment time');
                }
            }
            
            // If we have a start date and all records in this page are below the range, stop
            if (startDate && allRecordsBelowRange) {
                console.log('[DateRange] All records in page ' + currentPage + ' are before start date. Stopping search.');
                stopSearch = true;
                break;
            }
            
            // Log page results
            if (foundMatchInPage) {
                console.log('[DateRange] Page ' + currentPage + ' contained matching records');
            } else {
                console.log('[DateRange] Page ' + currentPage + ' contained no matching records');
            }
            
            currentPage++;
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 200));
            
        } catch (error) {
            console.error('[DateRange] Error fetching page ' + currentPage + ':', error);
            
            // If it's a 524 error or timeout, the fetchData function will handle it with progressive retry
            // If that also fails, we continue to the next page
            if (error.message.includes('524') || error.message.includes('timeout')) {
                console.log('[DateRange] Skipping page ' + currentPage + ' due to persistent 524/timeout errors');
                currentPage++;
                continue; // Try next page
            } else {
                // For other errors, stop the search
                break;
            }
        }
    }
    
    const searchEndReason = stopSearch ? 'reached date range limit' : 'no more pages or hit max pages';
    console.log('[DateRange] Search completed (' + searchEndReason + '). Found ' + allMatchingData.length + ' matching records out of ' + totalProcessed + ' total records processed from ' + (currentPage - 1) + ' pages');
    
    return {
        data: allMatchingData,
        pagination: {
            total: allMatchingData.length,
            start: 1,
            end: allMatchingData.length
        }
    };
}

    // Create and show modal
    const showModal = () => {
        debugLog("Opening modal");
        
        // Refresh cookies from document before showing modal
        extractCookies();
        
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'white';
        modal.style.zIndex = '10000';
        modal.style.padding = '20px';
        modal.style.boxSizing = 'border-box';
        modal.style.overflow = 'auto';
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'absolute';
        closeButton.style.right = '20px';
        closeButton.style.top = '20px';
        closeButton.style.fontSize = '24px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        modal.appendChild(closeButton);
        
        // Title
        const title = document.createElement('h2');
        title.textContent = 'Reporte de citas y movimientos';
        title.style.marginBottom = '20px';
        modal.appendChild(title);
        
        // Controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.style.marginBottom = '20px';
        controlsContainer.style.display = 'flex';
        controlsContainer.style.flexWrap = 'wrap';
        controlsContainer.style.gap = '10px';
        controlsContainer.style.alignItems = 'center';
        modal.appendChild(controlsContainer);
        
        // Search by term container
        const searchTermContainer = document.createElement('div');
        searchTermContainer.style.display = 'flex';
        searchTermContainer.style.alignItems = 'center';
        searchTermContainer.style.marginRight = '15px';
        searchTermContainer.style.flex = '1';
        
        const searchTermLabel = document.createElement('label');
        searchTermLabel.textContent = 'Buscar por término(s):';
        searchTermLabel.style.marginRight = '5px';
        searchTermContainer.appendChild(searchTermLabel);
        
        const searchTermInput = document.createElement('input');
        searchTermInput.type = 'text';
        searchTermInput.placeholder = 'Ingresar término o términos separados por comas';
        searchTermInput.style.padding = '5px';
        searchTermInput.style.flex = '1';
        searchTermContainer.appendChild(searchTermInput);
        
        controlsContainer.appendChild(searchTermContainer);
        
        // Date range container
        const dateRangeContainer = document.createElement('div');
        dateRangeContainer.style.display = 'flex';
        dateRangeContainer.style.alignItems = 'center';
        dateRangeContainer.style.marginRight = '15px';
        dateRangeContainer.style.gap = '5px';
        
        const dateFromLabel = document.createElement('label');
        dateFromLabel.textContent = 'Desde:';
        dateFromLabel.style.marginRight = '5px';
        dateRangeContainer.appendChild(dateFromLabel);
        
        const dateFromInput = document.createElement('input');
        dateFromInput.type = 'date';
        dateFromInput.style.padding = '5px';
        dateRangeContainer.appendChild(dateFromInput);
        
        const dateToLabel = document.createElement('label');
        dateToLabel.textContent = 'Hasta:';
        dateToLabel.style.marginLeft = '10px';
        dateToLabel.style.marginRight = '5px';
        dateRangeContainer.appendChild(dateToLabel);
        
        const dateToInput = document.createElement('input');
        dateToInput.type = 'date';
        dateToInput.style.padding = '5px';
        dateRangeContainer.appendChild(dateToInput);
        
        controlsContainer.appendChild(dateRangeContainer);
        
        // Status filter
        const statusFilterContainer = document.createElement('div');
        statusFilterContainer.style.display = 'flex';
        statusFilterContainer.style.alignItems = 'center';
        statusFilterContainer.style.marginRight = '15px';
        
        const statusLabel = document.createElement('label');
        statusLabel.textContent = 'Estado:';
        statusLabel.style.marginRight = '5px';
        statusFilterContainer.appendChild(statusLabel);
        
        const statusSelect = document.createElement('select');
        
        // Add options for status filter
        const statusOptions = [
            { value: '', text: 'Todos' },
            { value: 'open', text: 'Abierto' },
            { value: 'completed', text: 'Completado' },
            { value: 'unloading', text: 'Descargando' }
        ];
        
        statusOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            statusSelect.appendChild(optionElement);
        });
        
        statusFilterContainer.appendChild(statusSelect);
        controlsContainer.appendChild(statusFilterContainer);
        
        // Page input and size selector in one row (only for non-date range searches)
        const paginationContainer = document.createElement('div');
        paginationContainer.style.display = 'flex';
        paginationContainer.style.alignItems = 'center';
        paginationContainer.style.gap = '10px';
        paginationContainer.style.marginLeft = 'auto';
        
        // Page input
        const pageLabel = document.createElement('label');
        pageLabel.textContent = 'Página:';
        pageLabel.style.marginRight = '5px';
        paginationContainer.appendChild(pageLabel);
        
        const pageInput = document.createElement('input');
        pageInput.type = 'number';
        pageInput.min = '1';
        pageInput.value = '1';
        pageInput.style.width = '60px';
        paginationContainer.appendChild(pageInput);
        
        // Results per page selector
        const resultsLabel = document.createElement('label');
        resultsLabel.textContent = 'Resultados:';
        resultsLabel.style.marginRight = '5px';
        paginationContainer.appendChild(resultsLabel);
        
        const resultsSelect = document.createElement('select');
        [50, 100, 200, 500].forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            if (size === 100) option.selected = true;
            resultsSelect.appendChild(option);
        });
        paginationContainer.appendChild(resultsSelect);
        
        controlsContainer.appendChild(paginationContainer);
        
        // Search button
        const searchButtonContainer = document.createElement('div');
        
        const searchButton = document.createElement('button');
        searchButton.textContent = 'Buscar';
        searchButton.style.backgroundColor = '#4CAF50';
        searchButton.style.color = 'white';
        searchButton.style.border = 'none';
        searchButton.style.padding = '5px 15px';
        searchButton.style.borderRadius = '3px';
        searchButton.style.cursor = 'pointer';
        searchButtonContainer.appendChild(searchButton);
        
        controlsContainer.appendChild(searchButtonContainer);
        
        // Auth status indicator
        const authStatusContainer = document.createElement('div');
        authStatusContainer.style.marginLeft = '10px';
        authStatusContainer.style.padding = '5px 10px';
        authStatusContainer.style.borderRadius = '3px';
        authStatusContainer.style.backgroundColor = (authorizationToken && cookieValue) ? '#d4edda' : '#f8d7da';
        authStatusContainer.style.color = (authorizationToken && cookieValue) ? '#155724' : '#721c24';
        authStatusContainer.textContent = (authorizationToken && cookieValue) ? 'Autenticado ✓' : 'No autenticado ✗';
        controlsContainer.appendChild(authStatusContainer);
        
        // Global search and actions container
        const actionsContainer = document.createElement('div');
        actionsContainer.style.marginBottom = '20px';
        actionsContainer.style.display = 'flex';
        actionsContainer.style.flexWrap = 'wrap';
        actionsContainer.style.gap = '10px';
        actionsContainer.style.alignItems = 'center';
        modal.appendChild(actionsContainer);
        
        // Global filter
        const filterContainer = document.createElement('div');
        filterContainer.style.display = 'flex';
        filterContainer.style.alignItems = 'center';
        filterContainer.style.marginRight = '15px';
        filterContainer.style.flex = '1';
        
        const filterLabel = document.createElement('label');
        filterLabel.textContent = 'Filtro global:';
        filterLabel.style.marginRight = '5px';
        filterContainer.appendChild(filterLabel);
        
        const filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.placeholder = 'Buscar en todas las columnas...';
        filterInput.style.padding = '5px';
        filterInput.style.flex = '1';
        filterContainer.appendChild(filterInput);
        
        // Empty filter checkbox
        const emptyFilterContainer = document.createElement('div');
        emptyFilterContainer.style.display = 'flex';
        emptyFilterContainer.style.alignItems = 'center';
        emptyFilterContainer.style.marginLeft = '10px';
        
        const emptyFilterCheckbox = document.createElement('input');
        emptyFilterCheckbox.type = 'checkbox';
        emptyFilterCheckbox.id = 'emptyFilter';
        emptyFilterContainer.appendChild(emptyFilterCheckbox);
        
        const emptyFilterLabel = document.createElement('label');
        emptyFilterLabel.textContent = 'Mostrar solo campos vacíos';
        emptyFilterLabel.htmlFor = 'emptyFilter';
        emptyFilterLabel.style.marginLeft = '5px';
        emptyFilterContainer.appendChild(emptyFilterLabel);
        
        filterContainer.appendChild(emptyFilterContainer);
        actionsContainer.appendChild(filterContainer);
        
        // Column visibility dropdown
        const columnVisibilityContainer = document.createElement('div');
        columnVisibilityContainer.style.position = 'relative';
        columnVisibilityContainer.style.display = 'inline-block';
        
        const columnVisibilityButton = document.createElement('button');
        columnVisibilityButton.textContent = 'Columnas ▼';
        columnVisibilityButton.style.padding = '5px 10px';
        columnVisibilityButton.style.border = '1px solid #ccc';
        columnVisibilityButton.style.backgroundColor = '#f8f9fa';
        columnVisibilityButton.style.cursor = 'pointer';
        columnVisibilityButton.style.borderRadius = '3px';
        
        const columnVisibilityDropdown = document.createElement('div');
        columnVisibilityDropdown.style.display = 'none';
        columnVisibilityDropdown.style.position = 'absolute';
        columnVisibilityDropdown.style.backgroundColor = '#fff';
        columnVisibilityDropdown.style.border = '1px solid #ccc';
        columnVisibilityDropdown.style.borderRadius = '3px';
        columnVisibilityDropdown.style.padding = '10px';
        columnVisibilityDropdown.style.zIndex = '10001';
        columnVisibilityDropdown.style.maxHeight = '300px';
        columnVisibilityDropdown.style.overflowY = 'auto';
        columnVisibilityDropdown.style.minWidth = '200px';
        columnVisibilityDropdown.style.width = 'auto';
        columnVisibilityDropdown.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        
        columnVisibilityButton.addEventListener('click', () => {
            columnVisibilityDropdown.style.display = columnVisibilityDropdown.style.display === 'none' ? 'block' : 'none';
        });
        
        // Close the dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!columnVisibilityContainer.contains(e.target)) {
                columnVisibilityDropdown.style.display = 'none';
            }
        });
        
        columnVisibilityContainer.appendChild(columnVisibilityButton);
        columnVisibilityContainer.appendChild(columnVisibilityDropdown);
        actionsContainer.appendChild(columnVisibilityContainer);
        
        // Export button
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Exportar a Excel';
        exportButton.style.backgroundColor = '#007bff';
        exportButton.style.color = 'white';
        exportButton.style.border = 'none';
        exportButton.style.padding = '5px 15px';
        exportButton.style.borderRadius = '3px';
        exportButton.style.cursor = 'pointer';
        actionsContainer.appendChild(exportButton);
        
        // Clear filters button
        const clearFiltersButton = document.createElement('button');
        clearFiltersButton.textContent = 'Limpiar filtros';
        clearFiltersButton.style.backgroundColor = '#dc3545';
        clearFiltersButton.style.color = 'white';
        clearFiltersButton.style.border = 'none';
        clearFiltersButton.style.padding = '5px 15px';
        clearFiltersButton.style.borderRadius = '3px';
        clearFiltersButton.style.cursor = 'pointer';
        actionsContainer.appendChild(clearFiltersButton);
        
        // Get Details button
        const getDetailsButton = document.createElement('button');
        getDetailsButton.textContent = 'Obtener detalles';
        getDetailsButton.style.backgroundColor = '#17a2b8';
        getDetailsButton.style.color = 'white';
        getDetailsButton.style.border = 'none';
        getDetailsButton.style.padding = '5px 15px';
        getDetailsButton.style.borderRadius = '3px';
        getDetailsButton.style.cursor = 'pointer';
        actionsContainer.appendChild(getDetailsButton);
        
        // Loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.textContent = 'Cargando datos...';
        loadingIndicator.style.display = 'none';
        loadingIndicator.style.marginLeft = '10px';
        searchButtonContainer.appendChild(loadingIndicator);
        
        // Progress container
        const progressContainer = document.createElement('div');
        progressContainer.style.display = 'none';
        progressContainer.style.marginTop = '10px';
        progressContainer.style.width = '100%';
        
        const progressText = document.createElement('div');
        progressText.style.marginBottom = '5px';
        progressText.textContent = 'Obteniendo detalles...';
        progressContainer.appendChild(progressText);
        
        const progressBarContainer = document.createElement('div');
        progressBarContainer.style.width = '100%';
        progressBarContainer.style.backgroundColor = '#e0e0e0';
        progressBarContainer.style.borderRadius = '4px';
        progressBarContainer.style.overflow = 'hidden';
        
        const progressBar = document.createElement('div');
        progressBar.style.height = '20px';
        progressBar.style.width = '0%';
        progressBar.style.backgroundColor = '#17a2b8';
        progressBar.style.transition = 'width 0.3s';
        
        progressBarContainer.appendChild(progressBar);
        progressContainer.appendChild(progressBarContainer);
        modal.appendChild(progressContainer);
        
        // Results counter
        const resultsCounter = document.createElement('div');
        resultsCounter.id = 'resultsCounter';
        resultsCounter.style.margin = '10px 0';
        resultsCounter.style.fontWeight = 'bold';
        modal.appendChild(resultsCounter);
        
        // Container for the table
        const tableContainer = document.createElement('div');
        tableContainer.style.width = '100%';
        tableContainer.style.overflowX = 'auto';
        modal.appendChild(tableContainer);
        
        // Define column definitions with display names and data keys
        const columnDefs = [
            { name: 'FOLIO', key: 'reference_1', visible: true },
            { name: 'ENTREGA', key: 'reference_2', visible: true },
            { name: 'FECHA DE CITA', key: 'gate_appointment_time', visible: true },
            { name: 'CITA APROBADA', key: 'is_booking_approved', visible: true },
            { name: 'FECHA DE APROBACIÓN DE CITA', key: 'booking_approved_date', visible: true },
            { name: 'ÚLTIMA RAZÓN DE REAGENDA', key: 'reason_code_name', visible: true },
            { name: 'SKU', key: 'load_information', visible: true },
            { name: 'PLANTA', key: 'site_name', visible: true },
            { name: 'ESTADO', key: 'status', visible: true },
            { name: 'FECHA ORIGINAL DE DESCARGA', key: 'expected_date', visible: true },
            { name: 'HORA ESTIMADA DE LLEGADA', key: 'estimated_arrival_time', visible: true },
            { name: 'ORIGEN', key: 'vendor', visible: true },
            { name: 'PRODUCTO', key: 'product_type', visible: true },
            { name: 'TELÉFONO DEL OPERADOR', key: 'driver_cell_no', visible: true },
            { name: 'NÚMERO ECONÓMICO DEL CONTENEDOR 1', key: 'trailer', visible: true },
            { name: 'PLACA DEL CONTENEDOR 1', key: 'license_plate_no', visible: true },
            { name: 'LIGA DE RASTREO', key: 'view_shipment_url', visible: true },
            { name: 'NOMBRE DEL OPERADOR', key: 'driver_name', visible: true },
            { name: 'LÍNEA TRANSPORTISTA', key: 'carrier', visible: true },
            { name: 'NOMBRE LÍNEA', key: 'carrier_name', visible: true }, 
            { name: 'PRIMER NOMBRE', key: 'comment_b', visible: true },
            { name: 'SEGUNDO NOMBRE', key: 'comment_c', visible: true },
            { name: 'PRIMER APELLIDO', key: 'comment_d', visible: true },
            { name: 'SEGUNDO APELLIDO', key: 'comment_e', visible: true },
            { name: 'TELÉFONO DEL OPERADOR', key: 'comment_f', visible: true },
            { name: 'NÚMERO DE LICENCIA', key: 'comment_g', visible: true },
            { name: 'NÚMERO DE SEGURIDAD SOCIAL', key: 'comment_h', visible: true },
            { name: 'NÚMERO ECONÓMICO DEL TRACTO', key: 'comment_i', visible: true },
            { name: 'PLACA DEL TRACTO', key: 'comment_j', visible: true },
            { name: 'AÑO DEL TRACTO', key: 'comment_k', visible: true },
            { name: 'MODELO DEL TRACTO', key: 'comment_l', visible: true },
            { name: 'NÚMERO ECONÓMICO DEL REMOLQUE 1', key: 'comment_m', visible: true },
            { name: 'PLACA DEL REMOLQUE 1', key: 'comment_n', visible: true },
            { name: 'AÑO DEL REMOLQUE 1', key: 'comment_o', visible: true },
            { name: 'MODELO DEL REMOLQUE 1', key: 'comment_p', visible: true },
            { name: 'NÚMERO ECONÓMICO DEL REMOLQUE 2', key: 'comment_q', visible: true },
            { name: 'PLACA DEL REMOLQUE 2', key: 'comment_r', visible: true },
            { name: 'AÑO DEL REMOLQUE 2', key: 'comment_s', visible: true },
            { name: 'MODELO DEL REMOLQUE 2', key: 'comment_t', visible: true },
            { name: 'CÓDIGO LÍNEA REAL', key: 'comment_u', visible: true },
            { name: 'NOMBRE LÍNEA REAL', key: 'real_carrier_name', visible: true },
            { name: 'UUID CARTA PORTE', key: 'comment_v', visible: true },
            { name: 'SELLO 1', key: 'comment_s1', visible: true },
            { name: 'SELLO 2', key: 'comment_s2', visible: true },
            { name: 'SELLO 3', key: 'comment_s3', visible: true },
            { name: 'SELLO 4', key: 'comment_s4', visible: true },
            { name: 'SELLO 5', key: 'comment_s5', visible: true },
            { name: 'SELLO 6', key: 'comment_s6', visible: true },
            { name: 'SELLO 7', key: 'comment_s7', visible: true },
            { name: 'FOLIO COMPARTIDO', key: 'comment_z', visible: true },
            { name: 'COMENTARIOS DE SEGURIDAD', key: 'comment_x', visible: true },
            { name: 'COMENTARIOS DE LOGÍSTICA', key: 'comment_w', visible: true },
            { name: 'COMENTARIOS DE ALMACÉN', key: 'comment_y', visible: true },
            { name: 'NÚMERO DE GAFETE', key: 'comment_ga', visible: true },
            // Reordered last columns
            { name: 'NÚMERO DE INE O IDENTIFICACIÓN', key: 'comment_id', visible: true },
            { name: 'RAZÓN DE RECHAZO', key: 'comment_rr', visible: true },
            { name: 'CRÍTICO', key: 'comment_critico', visible: true },
            { name: 'HORA EN QUE SE REPORTÓ', key: 'actual_arrival_time', visible: true },
            { name: 'HORA EN QUE SE INDICÓ A PERFILARSE', key: 'comment_sc', visible: true },
            { name: 'HORA DE INGRESO A PLANTA', key: 'plant_entry_time', visible: true },
            { name: 'HORA DE LLEGADA A RAMPA', key: 'ramp_arrival_time', visible: true },
            { name: 'HORA DE INICIO DE DESCARGA', key: 'unload_start_time', visible: true },
            { name: 'HORA DE FIN DE DESCARGA', key: 'unload_end_time', visible: true },
            { name: 'HORA EN QUE SE SOLICITA SALIR DE RAMPA', key: 'ramp_exit_request_time', visible: true },
            { name: 'HORA DE SALIDA DE RAMPA', key: 'ramp_exit_time', visible: true },
            { name: 'HORA DE SALIDA CORRECTA', key: 'correct_departure_time', visible: true },
            { name: 'HORA EN QUE SALIÓ DE GEOCERCA', key: 'actual_departure_time', visible: true },
            // New column
            { name: 'ENTRADA VS CITA', key: 'entrada_vs_cita', visible: true },
            // Calculated columns
            { name: 'TIEMPO DE REGISTRO A SALIDA', key: 'calculated_registro_salida', visible: true },
            { name: 'TIEMPO DE ESPERA PARA INGRESO', key: 'calculated_espera_ingreso', visible: true },
            { name: 'TIEMPO DENTRO DE PLANTA', key: 'calculated_tiempo_planta', visible: true },
            { name: 'TIEMPO DE DESCARGA', key: 'calculated_tiempo_descarga', visible: true }
        ];
 
        // Track column filters
        const columnFilters = {};
        const columnEmptyFilters = {};
        
        // Populate column visibility dropdown
        const toggleAllContainer = document.createElement('div');
        toggleAllContainer.style.borderBottom = '1px solid #ddd';
        toggleAllContainer.style.marginBottom = '5px';
        toggleAllContainer.style.paddingBottom = '5px';
        
        const toggleAllCheckbox = document.createElement('input');
        toggleAllCheckbox.type = 'checkbox';
        toggleAllCheckbox.id = 'toggleAll';
        toggleAllCheckbox.checked = true;
        
        const toggleAllLabel = document.createElement('label');
        toggleAllLabel.htmlFor = 'toggleAll';
        toggleAllLabel.textContent = 'Seleccionar/Deseleccionar Todos';
        toggleAllLabel.style.fontWeight = 'bold';
        toggleAllLabel.style.marginLeft = '5px';
        
        toggleAllContainer.appendChild(toggleAllCheckbox);
        toggleAllContainer.appendChild(toggleAllLabel);
        columnVisibilityDropdown.appendChild(toggleAllContainer);
        
        // Add search input for column filter
        const columnSearchContainer = document.createElement('div');
        columnSearchContainer.style.marginBottom = '10px';
        columnSearchContainer.style.position = 'sticky';
        columnSearchContainer.style.top = '0';
        columnSearchContainer.style.backgroundColor = 'white';
        columnSearchContainer.style.padding = '5px 0';
        columnSearchContainer.style.borderBottom = '1px solid #ddd';
        
        const columnSearchInput = document.createElement('input');
        columnSearchInput.type = 'text';
        columnSearchInput.placeholder = 'Buscar columna...';
        columnSearchInput.style.width = '100%';
        columnSearchInput.style.padding = '5px';
        columnSearchInput.style.boxSizing = 'border-box';
        columnSearchContainer.appendChild(columnSearchInput);
        
        columnVisibilityDropdown.appendChild(columnSearchContainer);
        
        // Create checkboxes for each column with improved styling
        const columnCheckboxes = [];
        columnDefs.forEach((col, index) => {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.style.padding = '3px 0';
            checkboxContainer.dataset.columnName = col.name.toLowerCase();
            checkboxContainer.style.backgroundColor = col.visible ? '#e6f7ff' : 'transparent';
            checkboxContainer.style.borderRadius = '3px';
            checkboxContainer.style.padding = '5px';
            checkboxContainer.style.margin = '2px 0';
            checkboxContainer.style.transition = 'background-color 0.2s';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = col.visible;
            checkbox.id = 'col_' + index;
            
            const label = document.createElement('label');
            label.htmlFor = 'col_' + index;
            label.textContent = col.name;
            label.style.marginLeft = '5px';
            label.style.cursor = 'pointer';
            
            checkbox.addEventListener('change', (e) => {
                columnDefs[index].visible = e.target.checked;
                checkboxContainer.style.backgroundColor = e.target.checked ? '#e6f7ff' : 'transparent';
                renderTable();
            });
            
            columnCheckboxes.push({checkbox, container: checkboxContainer});
            
            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            columnVisibilityDropdown.appendChild(checkboxContainer);
        });
        
        // Toggle all columns
        toggleAllCheckbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            columnDefs.forEach((col, index) => {
                columnDefs[index].visible = isChecked;
                columnCheckboxes[index].checkbox.checked = isChecked;
                columnCheckboxes[index].container.style.backgroundColor = isChecked ? '#e6f7ff' : 'transparent';
            });
            renderTable();
        });
        
        // Filter columns by search
        columnSearchInput.addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase();
            columnCheckboxes.forEach(({container}) => {
                const columnName = container.dataset.columnName;
                if (!searchText || columnName.includes(searchText)) {
                    container.style.display = '';
                } else {
                    container.style.display = 'none';
                }
            });
        });
        
        // Current state
        let currentPage = 1;
        let resultsPerPage = 100;
        let allData = [];
        let sortColumn = '';
        let sortDirection = 'asc';
        let isProcessingDetails = false;
        
        // Global filter function
        filterInput.addEventListener('input', applyFilters);
        emptyFilterCheckbox.addEventListener('change', applyFilters);
        
        // Clear all filters
        clearFiltersButton.addEventListener('click', () => {
            // Clear global filter
            filterInput.value = '';
            emptyFilterCheckbox.checked = false;
            
            // Clear column filters
            document.querySelectorAll('.column-filter').forEach(input => {
                input.value = '';
            });
            
            document.querySelectorAll('.empty-filter-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.style.backgroundColor = '#f8f9fa';
                btn.style.color = '#212529';
            });
            
            // Clear status filter
            statusSelect.value = '';
            
            // Clear date filters
            dateFromInput.value = '';
            dateToInput.value = '';
            
            // Reset filter states
            Object.keys(columnFilters).forEach(key => {
                columnFilters[key] = '';
            });
            
            Object.keys(columnEmptyFilters).forEach(key => {
                columnEmptyFilters[key] = false;
            });
            
            // Reapply filters (will show all rows)
            applyFilters();
        });
        
        function applyFilters() {
            const filterValue = filterInput.value.toLowerCase();
            const showOnlyEmpty = emptyFilterCheckbox.checked;
            
            const rows = document.querySelectorAll('#dataTable tbody tr');
            let visibleCount = 0;
            
            rows.forEach(row => {
                const cells = Array.from(row.cells);
                
                let showRow = true;
                
                // Global search filter
                if (filterValue) {
                    const rowContainsFilter = cells.some(cell => 
                        cell.textContent.toLowerCase().includes(filterValue)
                    );
                    
                    if (!rowContainsFilter) {
                        showRow = false;
                    }
                }
                
                // Global empty fields filter
                if (showOnlyEmpty && showRow) {
                    const hasEmptyCell = cells.some(cell => 
                        cell.textContent.trim() === ''
                    );
                    
                    if (!hasEmptyCell) {
                        showRow = false;
                    }
                }
                
                // Apply column-specific filters
                if (showRow) {
                    // Get visible columns
                    const visibleColumns = columnDefs.filter(col => col.visible);
                    
                    for (let i = 0; i < cells.length; i++) {
                        const columnKey = visibleColumns[i].key;
                        const cellText = cells[i].textContent.toLowerCase();
                        
                        // Text filter for this column
                        if (columnFilters[columnKey] && columnFilters[columnKey].trim() !== '') {
                            if (!cellText.includes(columnFilters[columnKey].toLowerCase())) {
                                showRow = false;
                                break;
                            }
                        }
                        
                        // Empty filter for this column
                        if (columnEmptyFilters[columnKey] === true) {
                            if (cellText.trim() !== '') {
                                showRow = false;
                                break;
                            }
                        }
                    }
                }
                
                row.style.display = showRow ? '' : 'none';
                if (showRow) visibleCount++;
            });
            
            // Update visible count
            const totalRows = rows.length;
            resultsCounter.textContent = 'Mostrando ' + visibleCount + ' de ' + totalRows + ' registros';
        }
        
        // Export to Excel
        exportButton.addEventListener('click', () => {
            const visibleColumns = columnDefs.filter(col => col.visible);
            
            // Create workbook
            const XLSX = window.XLSX || {};
            if (!XLSX.utils) {
                // If XLSX is not available, load it dynamically
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
                script.onload = () => exportToExcel(visibleColumns, allData);
                document.head.appendChild(script);
            } else {
                exportToExcel(visibleColumns, allData);
            }
        });
        
        function exportToExcel(columns, data) {
            // Prepare headers
            const headers = columns.map(col => col.name);
            
            // Prepare rows
            const rows = data.map(item => {
                return columns.map(col => {
                    return getCellValue(item, col.key, true);
                });
            });
            
            // Create worksheet
            const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            
            // Create workbook
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de Citas");
            
            // Generate file and download
            XLSX.writeFile(workbook, "ReporteCitas.xlsx");
        }
        
        // Extract text content between tags
        function extractTagContent(html, tag) {
            if (!html) return '';
            
            const regex = new RegExp('<' + tag + '>([^<]*)</' + tag + '>', 'i');
            const match = html.match(regex);
            return match ? match[1].trim().toUpperCase() : '';
        }
        
        // Check if comment contains "critico" tag
        function hasCriticoTag(html) {
            if (!html) return false;
            return html.toLowerCase().includes('<critico>');
        }
        
        // Format unix timestamp to DD/MM/YYYY HH:MM
        function formatTimestamp(timestamp) {
            if (!timestamp) return '';
            
            const date = new Date(timestamp);
            
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
        }
        
        // Calculate time difference in minutes between two timestamps
        function calculateMinutesDifference(endTime, startTime) {
            if (!endTime || !startTime) return '';
            
            const end = new Date(endTime);
            const start = new Date(startTime);
            
            if (isNaN(end.getTime()) || isNaN(start.getTime())) return '';
            
            const diffMs = end.getTime() - start.getTime();
            const diffMinutes = Math.round(diffMs / (1000 * 60));
            
            return diffMinutes.toString();
        }
        
        // Format SKU information
        function formatSKU(loadInfo) {
            if (!loadInfo || !Array.isArray(loadInfo) || loadInfo.length === 0) return '';
            
            return loadInfo.map(item => {
                return (item.sku ? item.sku.toUpperCase() : '') + ' (' + (item.qty || 0) + ')';
            }).join(', ');
        }
 
        // Find carrier name from SCAC
        function getCarrierName(scac) {
            if (!scac) return '';
            
            try {
                if (!Array.isArray(carrierData)) {
                    console.warn("Carrier data is not an array:", carrierData);
                    return '';
                }
                
                if (carrierData.length === 0) {
                    console.warn("Carrier data array is empty");
                    return '';
                }
                
                // For 3-character SCAC, try to find it with a leading '0'
                let lookupScac = scac;
                if (scac.length === 3) {
                    lookupScac = '0' + scac;
                    console.log("SCAC is 3 characters, looking up with leading zero: " + lookupScac);
                }
                
                console.log("Looking for carrier with SCAC: " + lookupScac + " in " + carrierData.length + " carriers");
                
                // Find the carrier with matching SCAC (case-insensitive)
                const carrier = carrierData.find(c => 
                    c && c.scac && typeof c.scac === 'string' && 
                    c.scac.toLowerCase() === lookupScac.toLowerCase()
                );
                
                if (carrier) {
                    console.log("Found carrier for " + lookupScac + ":", carrier);
                    return carrier.name ? carrier.name.toUpperCase() : '';
                } else {
                    // If not found with leading zero for 3-char SCAC, try original SCAC
                    if (scac.length === 3) {
                        console.log("Trying original SCAC without leading zero: " + scac);
                        const originalCarrier = carrierData.find(c => 
                            c && c.scac && typeof c.scac === 'string' && 
                            c.scac.toLowerCase() === scac.toLowerCase()
                        );
                        
                        if (originalCarrier) {
                            console.log("Found carrier for original SCAC " + scac + ":", originalCarrier);
                            return originalCarrier.name ? originalCarrier.name.toUpperCase() : '';
                        }
                    }
                    
                    console.log("No carrier found for SCAC: " + lookupScac);
                    return '';
                }
            } catch (error) {
                console.error('Error in getCarrierName:', error);
                return '';
            }
        }
        
        // Get cell value based on key
        function getCellValue(item, key, forExport) {
            forExport = forExport || false;
            
            if (!item) return '';
            
            // Handle new calculated column
            if (key === 'entrada_vs_cita') {
                // ENTRADA VS CITA = FECHA DE CITA minus HORA EN QUE SE REPORTÓ (in minutes)
                return calculateMinutesDifference(item.gate_appointment_time, item.actual_arrival_time);
            }
            
            // Handle calculated columns
            if (key === 'calculated_registro_salida') {
                // TIEMPO DE REGISTRO A SALIDA = HORA DE SALIDA CORRECTA minus HORA EN QUE SE REPORTÓ
                return calculateMinutesDifference(item.correct_departure_time, item.actual_arrival_time);
            }
            
            if (key === 'calculated_espera_ingreso') {
                // TIEMPO DE ESPERA PARA INGRESO = HORA DE INGRESO A PLANTA minus HORA EN QUE SE REPORTÓ
                return calculateMinutesDifference(item.plant_entry_time, item.actual_arrival_time);
            }
            
            if (key === 'calculated_tiempo_planta') {
                // TIEMPO DENTRO DE PLANTA = HORA DE SALIDA CORRECTA minus HORA DE INGRESO A PLANTA
                return calculateMinutesDifference(item.correct_departure_time, item.plant_entry_time);
            }
            
            if (key === 'calculated_tiempo_descarga') {
                // TIEMPO DE DESCARGA = HORA DE FIN DE DESCARGA minus HORA DE INICIO DE DESCARGA
                return calculateMinutesDifference(item.unload_end_time, item.unload_start_time);
            }
            
            // Handle special comment fields
            if (key.startsWith('comment_')) {
                const tag = key.replace('comment_', '');
                if (tag === 'critico') {
                    return hasCriticoTag(item.comment) ? 'CRÍTICO' : '';
                }
                
                // Special case for "Hora que se indicó a perfilarse" which needs timestamp formatting
                if (tag === 'sc') {
                    const content = item.comment ? extractTagContent(item.comment, tag) : '';
                    if (content && !isNaN(parseInt(content))) {
                        // If the content is a number (unix timestamp), format it
                        return formatTimestamp(parseInt(content));
                    }
                    return content;
                }
                
                return item.comment ? extractTagContent(item.comment, tag) : '';
            }
            
            // Handle carrier name - match carrier SCAC with name from carrier list
            if (key === 'carrier_name') {
                return getCarrierName(item.carrier);
            }
            
            // Handle real carrier name - match real carrier SCAC with name from carrier list
            if (key === 'real_carrier_name') {
                const realCarrierScac = item.comment ? extractTagContent(item.comment, 'u') : '';
                return getCarrierName(realCarrierScac);
            }
            
            // Handle other fields
            switch (key) {
                case 'gate_appointment_time':
                case 'estimated_arrival_time':
                case 'actual_arrival_time':
                case 'actual_departure_time':
                case 'plant_entry_time':
                case 'unload_start_time':
                case 'unload_end_time':
                case 'ramp_arrival_time':
                case 'ramp_exit_time':
                case 'ramp_exit_request_time':
                case 'booking_approved_date':
                case 'correct_departure_time':
                    return formatTimestamp(item[key]);
                case 'load_information':
                    return formatSKU(item[key]);
                case 'view_shipment_url':
                    if (forExport) return item[key] || '';
                    return item[key] ? 
                        '<a href="' + item[key] + '" target="_blank">VER</a>' : '';
                case 'is_booking_approved':
                    return item[key] === true ? 'SI' : (item[key] === false ? 'NO' : '');
                default:
                    return item[key] ? item[key].toString().toUpperCase() : '';
            }
        }
        
        // Render the data table
        function renderTable() {
            tableContainer.innerHTML = '';
            
            const table = document.createElement('table');
            table.id = 'dataTable';
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.marginTop = '20px';
            
            // Create header row
            const thead = document.createElement('thead');
            
            // Only show visible columns
            const visibleColumns = columnDefs.filter(col => col.visible);
            
            // Header row with column names and sort functionality
            const headerRow = document.createElement('tr');
            headerRow.style.backgroundColor = '#f2f2f2';
            
            visibleColumns.forEach(column => {
                const th = document.createElement('th');
                th.textContent = column.name;
                th.style.padding = '10px';
                th.style.border = '1px solid #ddd';
                th.style.position = 'sticky';
                th.style.top = '0';
                th.style.backgroundColor = '#f2f2f2';
                th.style.cursor = 'pointer';
                
                // Add sorting functionality
                th.addEventListener('click', () => {
                    if (sortColumn === column.key) {
                        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
                    } else {
                        sortColumn = column.key;
                        sortDirection = 'asc';
                    }
                    
                    // Sort data
                    allData.sort((a, b) => {
                        const valueA = getCellValue(a, column.key);
                        const valueB = getCellValue(b, column.key);
                        
                        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
                        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
                        return 0;
                    });
                    
                    renderTable();
                });
                
                // Show sort indicator
                if (sortColumn === column.key) {
                    th.textContent = th.textContent + (sortDirection === 'asc' ? ' ▲' : ' ▼');
                }
                
                headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            
            // Filter row
            const filterRow = document.createElement('tr');
            filterRow.style.backgroundColor = '#e9e9e9';
            
            visibleColumns.forEach(column => {
                const td = document.createElement('td');
                td.style.padding = '5px';
                td.style.border = '1px solid #ddd';
                
                // Create filter container
                const filterContainer = document.createElement('div');
                filterContainer.style.display = 'flex';
                filterContainer.style.alignItems = 'center';
                
                // Text filter input
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'column-filter';
                input.dataset.column = column.key;
                input.style.width = '100%';
                input.style.padding = '5px';
                input.style.boxSizing = 'border-box';
                input.placeholder = 'Filtrar...';
                
                // Set value from saved filters
                if (columnFilters[column.key]) {
                    input.value = columnFilters[column.key];
                }
                
                input.addEventListener('input', (e) => {
                    columnFilters[column.key] = e.target.value;
                    applyFilters();
                });
                
                // Empty filter button
                const emptyFilterBtn = document.createElement('button');
                emptyFilterBtn.innerHTML = '∅'; // Empty set symbol
                emptyFilterBtn.title = 'Mostrar solo valores vacíos en esta columna';
                emptyFilterBtn.className = 'empty-filter-btn';
                emptyFilterBtn.style.marginLeft = '5px';
                emptyFilterBtn.style.padding = '2px 6px';
                emptyFilterBtn.style.backgroundColor = columnEmptyFilters[column.key] ? '#007bff' : '#f8f9fa';
                emptyFilterBtn.style.color = columnEmptyFilters[column.key] ? 'white' : '#212529';
                emptyFilterBtn.style.border = '1px solid #ced4da';
                emptyFilterBtn.style.borderRadius = '3px';
                emptyFilterBtn.style.cursor = 'pointer';
                
                emptyFilterBtn.addEventListener('click', () => {
                    // Toggle empty filter for this column
                    columnEmptyFilters[column.key] = !columnEmptyFilters[column.key];
                    
                    // Update button style
                    emptyFilterBtn.style.backgroundColor = columnEmptyFilters[column.key] ? '#007bff' : '#f8f9fa';
                    emptyFilterBtn.style.color = columnEmptyFilters[column.key] ? 'white' : '#212529';
                    
                    // Apply filters
                    applyFilters();
                });
                
                filterContainer.appendChild(input);
                filterContainer.appendChild(emptyFilterBtn);
                td.appendChild(filterContainer);
                filterRow.appendChild(td);
            });
            
            thead.appendChild(filterRow);
            table.appendChild(thead);
            
            // Create body
            const tbody = document.createElement('tbody');
            
            if (allData.length === 0) {
                const noDataRow = document.createElement('tr');
                const noDataCell = document.createElement('td');
                noDataCell.textContent = 'No hay datos disponibles';
                noDataCell.style.textAlign = 'center';
                noDataCell.style.padding = '20px';
                noDataCell.colSpan = visibleColumns.length;
                noDataRow.appendChild(noDataCell);
                tbody.appendChild(noDataRow);
            } else {
                allData.forEach((item, index) => {
                    const tr = document.createElement('tr');
                    tr.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
                    
                    // Check if this is a critical row
                    const isCritical = hasCriticoTag(item.comment);
                    if (isCritical) {
                        tr.style.backgroundColor = '#ff0000';
                        tr.style.color = '#ffff00';
                        tr.style.fontWeight = 'bold';
                    }
                    
                    visibleColumns.forEach(column => {
                        const td = document.createElement('td');
                        td.style.padding = '8px';
                        td.style.border = '1px solid #ddd';
                        
                        const value = getCellValue(item, column.key);
                        
                        if (column.key === 'view_shipment_url') {
                            td.innerHTML = value;
                        } else {
                            td.textContent = value;
                        }
                        
                        tr.appendChild(td);
                    });
                    
                    tbody.appendChild(tr);
                });
            }
            
            table.appendChild(tbody);
            tableContainer.appendChild(table);
            
            // Update result counter
            resultsCounter.textContent = 'Mostrando ' + allData.length + ' registros';
            
            // Apply any active filters after rendering
            applyFilters();
        }
        
        // Get details for all shipments - Updated version with comment extraction
        async function getDetailsForShipments() {
            if (isProcessingDetails) return;
            
            isProcessingDetails = true;
            getDetailsButton.disabled = true;
            progressContainer.style.display = 'block';
            progressBar.style.width = '0%';
            progressText.textContent = 'Preparando...';
            
            console.log('[DetailProcess] Starting detailed data retrieval for ' + allData.length + ' records');
            
            try {
                // First fetch carrier data if we don't have it yet
                if (!Array.isArray(carrierData) || carrierData.length === 0) {
                    progressText.textContent = 'Obteniendo datos de transportistas...';
                    await fetchCarrierData();
                }
                
                const totalRows = allData.length;
                let processedRows = 0;
                let successfulDetails = 0;
                let skippedRows = 0;
                let errorRows = 0;
                
                for (let i = 0; i < totalRows; i++) {
                    const item = allData[i];
                    const uuid = item.uuid; // Get UUID from search payload
                    
                    if (!uuid) {
                        console.log('[DetailProcess] Row ' + (i+1) + ': Skipped - No UUID');
                        skippedRows++;
                        processedRows++;
                        progressBar.style.width = Math.round((processedRows / totalRows) * 100) + '%';
                        progressText.textContent = 'Procesando ' + processedRows + ' de ' + totalRows + ' registros...';
                        continue;
                    }
                    
                    try {
                        console.log('[DetailProcess] Row ' + (i+1) + ': Processing UUID ' + uuid);
                        
                        // Step 1: Fetch shipment activity log for arrival
                        progressText.textContent = 'Obteniendo log de actividades para registro ' + (i+1) + ' de ' + totalRows;
                        console.log('[DetailProcess] Row ' + (i+1) + ': Getting shipment activity log');
                        
                        const activityLog = await fetchShipmentActivityLog(uuid);
                        let trailerId = null;
                        
                        if (activityLog && activityLog.data && activityLog.data.length > 0) {
                            // Get trailer_id from the response
                            trailerId = activityLog.data[0].trailer_id;
                            console.log('[DetailProcess] Row ' + (i+1) + ': Found trailer_id: ' + trailerId);
                        }
                        
                        if (!trailerId) {
                            console.log('[DetailProcess] Row ' + (i+1) + ': No trailer_id found');
                            processedRows++;
                            progressBar.style.width = Math.round((processedRows / totalRows) * 100) + '%';
                            continue;
                        }
                        
                        // Step 2: Fetch asset activity log
                        progressText.textContent = 'Obteniendo log de activos para registro ' + (i+1) + ' de ' + totalRows;
                        console.log('[DetailProcess] Row ' + (i+1) + ': Getting asset activity log for trailer_id: ' + trailerId);
                        
                        const assetLog = await fetchAssetActivityLog(trailerId);
                        
                        if (assetLog && assetLog.data && assetLog.data.length > 0) {
                            let spotEventId = null;
                            let pullEventId = null;
                            
                            // Find arrival and departure events, spot/pull events, and comment data
                            for (const logEntry of assetLog.data) {
                                // Get departure time (HORA DE SALIDA CORRECTA) - from departure event
                                if (logEntry.event_type === 'departure' && logEntry.timeline && logEntry.timeline.created_date) {
                                    allData[i].correct_departure_time = logEntry.timeline.created_date;
                                    console.log('[DetailProcess] Row ' + (i+1) + ': Set correct departure time from departure event');
                                }
                                
                                // Get comment data from snapshot_details.asset_details.comment when site is not "obregon"
                                if (logEntry.site !== 'obregon' && 
                                    logEntry.snapshot_details && 
                                    logEntry.snapshot_details.asset_details && 
                                    logEntry.snapshot_details.asset_details.comment) {
                                    
                                    allData[i].comment = logEntry.snapshot_details.asset_details.comment;
                                    console.log('[DetailProcess] Row ' + (i+1) + ': Set comment from asset log (offsite)');
                                }
                                
                                // Get spot and pull event IDs
                                if (logEntry.event_type === 'spot' && logEntry.event_id) {
                                    spotEventId = logEntry.event_id;
                                    console.log('[DetailProcess] Row ' + (i+1) + ': Found spot event: ' + spotEventId);
                                }
                                
                                if (logEntry.event_type === 'pull' && logEntry.event_id) {
                                    pullEventId = logEntry.event_id;
                                    console.log('[DetailProcess] Row ' + (i+1) + ': Found pull event: ' + pullEventId);
                                }
                            }
                            
                            // Step 3: Get SPOT task details
                            if (spotEventId) {
                                try {
                                    progressText.textContent = 'Obteniendo detalles de SPOT para registro ' + (i+1) + ' de ' + totalRows;
                                    console.log('[DetailProcess] Row ' + (i+1) + ': Getting SPOT task details for: ' + spotEventId);
                                    
                                    const spotTask = await fetchYardTaskDetails(spotEventId);
                                    
                                    if (spotTask) {
                                        // CORRECTED MAPPING FOR SPOT:
                                        // Created_time -> HORA DE INGRESO A PLANTA
                                        if (spotTask.created_time) {
                                            allData[i].plant_entry_time = spotTask.created_time;
                                            console.log('[DetailProcess] Row ' + (i+1) + ': Set plant entry time from SPOT created_time');
                                        }
                                        
                                        // Hooked_time -> HORA DE LLEGADA A RAMPA
                                        if (spotTask.hooked_time) {
                                            allData[i].ramp_arrival_time = spotTask.hooked_time;
                                            console.log('[DetailProcess] Row ' + (i+1) + ': Set ramp arrival time from SPOT hooked_time');
                                        }
                                        
                                        // Completed_time -> HORA DE INICIO DE DESCARGA
                                        if (spotTask.completed_time) {
                                            allData[i].unload_start_time = spotTask.completed_time;
                                            console.log('[DetailProcess] Row ' + (i+1) + ': Set unload start time from SPOT completed_time');
                                        }
                                    }
                                } catch (spotError) {
                                    console.error('[DetailProcess] Row ' + (i+1) + ': Error fetching SPOT task details:', spotError);
                                }
                            }
                            
                            // Step 4: Get PULL task details
                            if (pullEventId) {
                                try {
                                    progressText.textContent = 'Obteniendo detalles de PULL para registro ' + (i+1) + ' de ' + totalRows;
                                    console.log('[DetailProcess] Row ' + (i+1) + ': Getting PULL task details for: ' + pullEventId);
                                    
                                    const pullTask = await fetchYardTaskDetails(pullEventId);
                                    
                                    if (pullTask) {
                                        // CORRECTED MAPPING FOR PULL:
                                        // Created_time -> HORA DE FIN DE DESCARGA
                                        if (pullTask.created_time) {
                                            allData[i].unload_end_time = pullTask.created_time;
                                            console.log('[DetailProcess] Row ' + (i+1) + ': Set unload end time from PULL created_time');
                                        }
                                        
                                        // Hooked_time -> HORA EN QUE SE SOLICITA SALIR DE RAMPA
                                        if (pullTask.hooked_time) {
                                            allData[i].ramp_exit_request_time = pullTask.hooked_time;
                                            console.log('[DetailProcess] Row ' + (i+1) + ': Set ramp exit request time from PULL hooked_time');
                                        }
                                        
                                        // Completed_time -> HORA DE SALIDA DE RAMPA
                                        if (pullTask.completed_time) {
                                            allData[i].ramp_exit_time = pullTask.completed_time;
                                            console.log('[DetailProcess] Row ' + (i+1) + ': Set ramp exit time from PULL completed_time');
                                        }
                                    }
                                } catch (pullError) {
                                    console.error('[DetailProcess] Row ' + (i+1) + ': Error fetching PULL task details:', pullError);
                                }
                            }
                            
                            successfulDetails++;
                        } else {
                            console.log('[DetailProcess] Row ' + (i+1) + ': No asset activity log found');
                        }
                        
                    } catch (itemError) {
                        errorRows++;
                        console.error('[DetailProcess] Row ' + (i+1) + ': Error processing item:', itemError);
                    }
                    
                    processedRows++;
                    progressBar.style.width = Math.round((processedRows / totalRows) * 100) + '%';
                    progressText.textContent = 'Procesando ' + processedRows + ' de ' + totalRows + ' registros...';
                    
                    // Add a small delay to prevent overwhelming API
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
                
                // Update the table with new data
                renderTable();
                console.log('[DetailProcess] Completed with ' + successfulDetails + ' successful details, ' + skippedRows + ' skipped, ' + errorRows + ' errors');
                progressText.textContent = 'Completado: ' + successfulDetails + ' detalles obtenidos, ' + skippedRows + ' omitidos, ' + errorRows + ' errores';
                
                setTimeout(() => {
                    progressContainer.style.display = 'none';
                }, 3000);
                
            } catch (error) {
                console.error("[DetailProcess] Error in main process:", error);
                progressText.textContent = 'Error: ' + error.message;
            } finally {
                isProcessingDetails = false;
                getDetailsButton.disabled = false;
            }
        }
        
        // Add event listener to Get Details button
        getDetailsButton.addEventListener('click', getDetailsForShipments);
        
        // Search handler - updated with simplified date range filtering
        async function performSearch() {
            loadingIndicator.style.display = 'inline';
            searchButton.disabled = true;
            resultsCounter.textContent = 'Buscando...';
            allData = []; // Reset data
            
            // Clear all filters when performing a new search
            Object.keys(columnFilters).forEach(key => {
                columnFilters[key] = '';
            });
            
            Object.keys(columnEmptyFilters).forEach(key => {
                columnEmptyFilters[key] = false;
            });
            
            filterInput.value = '';
            emptyFilterCheckbox.checked = false;
            
            try {
                // First fetch carrier data if we don't have it yet
                if (!Array.isArray(carrierData) || carrierData.length === 0) {
                    resultsCounter.textContent = 'Obteniendo datos de transportistas...';
                    await fetchCarrierData();
                }
                
                const searchTerms = searchTermInput.value.trim();
                const page = parseInt(pageInput.value, 10) || 1;
                const size = parseInt(resultsSelect.value, 10) || 100;
                const status = statusSelect.value;
                const dateFrom = dateFromInput.value;
                const dateTo = dateToInput.value;
                
                // Check if we have a date range
                const hasDateRange = dateFrom || dateTo;
                
                console.log('[Search] Params - Terms: "' + searchTerms + '", DateFrom: ' + dateFrom + ', DateTo: ' + dateTo + ', Status: ' + status);
                
                if (hasDateRange) {
                    // Use date range search method
                    console.log('[Search] Using date range search method');
                    resultsCounter.textContent = 'Iniciando búsqueda por rango de fechas...';
                    
                    const result = await fetchDataByDateRange(dateFrom, dateTo, status);
                    
                    if (result && result.data) {
                        allData = result.data;
                        const rangeText = (dateFrom ? dateFrom : 'inicio') + ' a ' + (dateTo ? dateTo : 'fin');
                        resultsCounter.textContent = 'Encontrados ' + result.data.length + ' registros en el rango ' + rangeText;
                        console.log('[Search] Date range search completed with ' + result.data.length + ' results');
                    } else {
                        resultsCounter.textContent = 'No se encontraron registros en el rango especificado';
                        console.log('[Search] Date range search returned no results');
                    }
                } else if (searchTerms) {
                    // If search terms are provided, use search by term
                    console.log('[Search] Using search by terms method');
                    // Split by comma and trim each term
                    const terms = searchTerms.split(',').map(term => term.trim()).filter(term => term);
                    
                    // If multiple terms, search for each
                    if (terms.length > 0) {
                        let combinedData = [];
                        
                        // Show progress for multiple terms
                        if (terms.length > 1) {
                            resultsCounter.textContent = 'Buscando término 1 de ' + terms.length + '...';
                        }
                        
                        for (let i = 0; i < terms.length; i++) {
                            const term = terms[i];
                            if (terms.length > 1) {
                                resultsCounter.textContent = 'Buscando término ' + (i + 1) + ' de ' + terms.length + ': ' + term;
                            }
                            
                            try {
                                const result = await fetchDataByTerm(term, size, page, status);
                                if (result && result.data) {
                                    combinedData = combinedData.concat(result.data);
                                }
                            } catch (termError) {
                                console.error('Error searching for term: ' + term, termError);
                                // Continue with other terms even if one fails
                            }
                        }
                        
                        allData = combinedData;
                        resultsCounter.textContent = 'Mostrando ' + combinedData.length + ' registros para ' + terms.length + ' término(s)';
                    } else {
                        resultsCounter.textContent = 'No se especificaron términos de búsqueda válidos';
                    }
                } else {
                    // Use regular search with pagination
                    console.log('[Search] Using regular search method');
                    const result = await fetchData(page, size, status);
                    if (result && result.data) {
                        allData = result.data;
                        
                        // Update pagination info
                        const totalPages = Math.ceil(result.pagination.total / size);
                        const totalRecords = result.pagination.total;
                        resultsCounter.textContent = 'Mostrando ' + result.data.length + ' de ' + totalRecords + 
                                                 ' registros | Página ' + page + ' de ' + totalPages;
                    }
                }
                
                // Render the table with the results
                renderTable();
                
            } catch (error) {
                console.error('Error performing search:', error);
                resultsCounter.textContent = 'Error: ' + error.message;
                tableContainer.innerHTML = '<div style="color:red;padding:20px;text-align:center;">Error al realizar la búsqueda: ' + error.message + '</div>';
            } finally {
                loadingIndicator.style.display = 'none';
                searchButton.disabled = false;
            }
        }
        
        // Set up search button
        searchButton.addEventListener('click', performSearch);
        
        // Also allow pressing Enter in search input to search
        searchTermInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Check if we have auth data and prepare the interface
        if (authorizationToken && (cookieValue || document.cookie)) {
            // Ready to search, but don't auto-fetch
            resultsCounter.textContent = 'Listo para buscar';
        } else {
            tableContainer.innerHTML = '<div style="text-align:center;padding:20px;color:red;font-weight:bold;">Esperando obtener token de autenticación y cookies. Por favor navegue en la plataforma e intente nuevamente.</div>';
            
            // Setup a check interval to update status once we get auth
            const authCheckInterval = setInterval(() => {
                if (authorizationToken && (cookieValue || document.cookie)) {
                    clearInterval(authCheckInterval);
                    authStatusContainer.textContent = 'Autenticado ✓';
                    authStatusContainer.style.backgroundColor = '#d4edda';
                    authStatusContainer.style.color = '#155724';
                    resultsCounter.textContent = 'Listo para buscar';
                }
            }, 2000);
        }
        
        document.body.appendChild(modal);
    };
    
    // Initialize all authentication capture mechanisms
    setupInterceptors();
    
    // Initialize the app
    createMainButton();
})();