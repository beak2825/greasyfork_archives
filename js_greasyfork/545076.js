// ==UserScript==
// @name        NAV-Reporte de inventario de RFID
// @description Permite obtener un listado de las últimas 1000 lecturas de RFID 
// @namespace   CBI_P44_Plugins
// @version     1.1
// @author      tomasmoralescbi
// @include     https://yard-visibility-na12.voc.project44.com/iot/drive_by_inventory
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/545076/NAV-Reporte%20de%20inventario%20de%20RFID.user.js
// @updateURL https://update.greasyfork.org/scripts/545076/NAV-Reporte%20de%20inventario%20de%20RFID.meta.js
// ==/UserScript==

/*
INSTRUCTIONS FOR VERSION CONTROL:
- This script listens for API requests to yard-visibility-na12.api.project44.com
- Captures Authorization and Cookie headers from intercepted requests
- Provides a button to export inventory data to Excel
- NOTE: For string concatenation in JavaScript, use + operator, not template literals \${} which may not work in all contexts
- The script uses XMLHttpRequest to make API calls and SheetJS library for Excel export
- Version 1.1: Fixed header capture by properly intercepting network requests and added fallback methods
*/

(function() {
    'use strict';
    
    // Variables to store captured headers
    let capturedAuth = '';
    let capturedCookie = '';
    
    // Inject SheetJS library for Excel export
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    document.head.appendChild(script);
    
    // Method 1: Intercept XMLHttpRequest
    (function() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
        
        XMLHttpRequest.prototype.open = function(method, url) {
            this._method = method;
            this._url = url;
            this._requestHeaders = {};
            return originalOpen.apply(this, arguments);
        };
        
        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            this._requestHeaders = this._requestHeaders || {};
            this._requestHeaders[header] = value;
            
            // Capture headers if this is a request to our target domain
            if (this._url && this._url.includes('yard-visibility-na12.api.project44.com')) {
                if (header.toLowerCase() === 'authorization') {
                    capturedAuth = value;
                    console.log('Captured Authorization header via XMLHttpRequest');
                }
                if (header.toLowerCase() === 'cookie') {
                    capturedCookie = value;
                    console.log('Captured Cookie header via XMLHttpRequest');
                }
            }
            
            return originalSetRequestHeader.apply(this, arguments);
        };
        
        XMLHttpRequest.prototype.send = function() {
            // Additional capture attempt during send
            if (this._url && this._url.includes('yard-visibility-na12.api.project44.com')) {
                // Try to get document cookies as fallback
                if (!capturedCookie && document.cookie) {
                    capturedCookie = document.cookie;
                    console.log('Captured Cookie from document.cookie as fallback');
                }
            }
            return originalSend.apply(this, arguments);
        };
    })();
    
    // Method 2: Intercept fetch
    (function() {
        const originalFetch = window.fetch;
        window.fetch = function(resource, options) {
            const url = typeof resource === 'string' ? resource : resource.url;
            
            if (url && url.includes('yard-visibility-na12.api.project44.com')) {
                console.log('Intercepting fetch request to yard-visibility API');
                
                if (options && options.headers) {
                    // Handle different header formats
                    const headers = options.headers;
                    
                    if (headers instanceof Headers) {
                        // Headers object
                        const auth = headers.get('Authorization') || headers.get('authorization');
                        const cookie = headers.get('Cookie') || headers.get('cookie');
                        if (auth) {
                            capturedAuth = auth;
                            console.log('Captured Authorization header via fetch (Headers object)');
                        }
                        if (cookie) {
                            capturedCookie = cookie;
                            console.log('Captured Cookie header via fetch (Headers object)');
                        }
                    } else {
                        // Plain object
                        Object.keys(headers).forEach(key => {
                            const lowerKey = key.toLowerCase();
                            if (lowerKey === 'authorization') {
                                capturedAuth = headers[key];
                                console.log('Captured Authorization header via fetch (object)');
                            }
                            if (lowerKey === 'cookie') {
                                capturedCookie = headers[key];
                                console.log('Captured Cookie header via fetch (object)');
                            }
                        });
                    }
                }
                
                // Fallback: try to get cookies from document
                if (!capturedCookie && document.cookie) {
                    capturedCookie = document.cookie;
                    console.log('Captured Cookie from document.cookie as fallback');
                }
            }
            
            return originalFetch.apply(this, arguments);
        };
    })();
    
    // Method 3: Try to extract from browser storage/cookies directly
    function tryExtractFromBrowser() {
        // Try to get cookies from document
        if (document.cookie && !capturedCookie) {
            capturedCookie = document.cookie;
            console.log('Extracted cookies from document.cookie');
        }
        
        // Try to get from localStorage (some apps store auth tokens there)
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                const value = localStorage.getItem(key);
                if (key.toLowerCase().includes('auth') || key.toLowerCase().includes('token')) {
                    if (value && (value.startsWith('Bearer ') || value.startsWith('bearer '))) {
                        capturedAuth = value;
                        console.log('Found potential auth token in localStorage: ' + key);
                    }
                }
            });
        } catch (e) {
            console.log('Could not access localStorage');
        }
        
        // Try to get from sessionStorage
        try {
            const keys = Object.keys(sessionStorage);
            keys.forEach(key => {
                const value = sessionStorage.getItem(key);
                if (key.toLowerCase().includes('auth') || key.toLowerCase().includes('token')) {
                    if (value && (value.startsWith('Bearer ') || value.startsWith('bearer '))) {
                        capturedAuth = value;
                        console.log('Found potential auth token in sessionStorage: ' + key);
                    }
                }
            });
        } catch (e) {
            console.log('Could not access sessionStorage');
        }
    }
    
    // Create export button
    const exportButton = document.createElement('button');
    exportButton.innerHTML = 'Export Inventory to Excel';
    exportButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 999999; padding: 10px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);';
    
    // Add button to page when DOM is ready
    function addButton() {
        if (document.body) {
            document.body.appendChild(exportButton);
            console.log('Export button added to page');
        } else {
            setTimeout(addButton, 100);
        }
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addButton);
    } else {
        addButton();
    }
    
    // Try to extract headers from browser periodically
    setInterval(tryExtractFromBrowser, 2000);
    
    // Function to make a test request to try to get headers
    async function testApiConnection() {
        console.log('Testing API connection...');
        
        // First try with document cookies
        const cookiesToTry = document.cookie;
        
        try {
            const response = await fetch('https://yard-visibility-na12.api.project44.com/v1/drive-by-inventory/log/search?size=1&page_no=1', {
                method: 'GET',
                headers: {
                    'Cookie': cookiesToTry,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            
            if (response.ok) {
                capturedCookie = cookiesToTry;
                console.log('Successfully connected to API with document cookies');
                return true;
            }
        } catch (error) {
            console.log('Test connection failed:', error.message);
        }
        
        return false;
    }
    
    // Function to fetch all pages of data
    async function fetchAllInventoryData() {
        const allData = [];
        let pageNo = 1;
        let hasMoreRecords = true;
        
        // Prepare headers
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (capturedAuth) {
            headers['Authorization'] = capturedAuth;
        }
        
        if (capturedCookie) {
            headers['Cookie'] = capturedCookie;
        }
        
        try {
            while (hasMoreRecords) {
                console.log('Fetching page ' + pageNo + '...');
                
                const url = 'https://yard-visibility-na12.api.project44.com/v1/drive-by-inventory/log/search?size=1000&page_no=' + pageNo;
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: headers,
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error('HTTP error! status: ' + response.status + ' - ' + response.statusText);
                }
                
                const data = await response.json();
                
                if (data.data && data.data.length > 0) {
                    allData.push(...data.data);
                    console.log('Fetched ' + data.data.length + ' records from page ' + pageNo);
                }
                
                hasMoreRecords = data.pagination && data.pagination.more_records;
                pageNo++;
                
                // Safety limit to prevent infinite loops
                if (pageNo > 100) {
                    console.log('Reached page limit of 100, stopping...');
                    break;
                }
            }
            
            return allData;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
    
    // Function to export data to Excel
    function exportToExcel(data) {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }
        
        // Wait for XLSX library to load
        if (typeof XLSX === 'undefined') {
            alert('Excel library still loading, please wait a moment and try again');
            return;
        }
        
        // Flatten the data structure for Excel export
        const flattenedData = data.map(item => ({
            'ID': item._id || '',
            'Is Deleted': item.is_deleted || false,
            'Status': item.status || '',
            'Status Name': item.status_name || '',
            'Reader Name': item.reader_name || '',
            'Reader MAC': item.reader_mac || '',
            'Antenna ID': item.antenna_id || '',
            'RFID': item.rfid || '',
            'Latitude': item.geo_location ? item.geo_location.lat : '',
            'Longitude': item.geo_location ? item.geo_location.lon : '',
            'RFID Tag': item.tag_info ? item.tag_info.rfid_tag : '',
            'RSSI': item.tag_info ? item.tag_info.rssi : '',
            'Captured Time': item.captured_time ? new Date(item.captured_time).toLocaleString() : '',
            'Site': item.site || '',
            'Spotter': item.spotter || '',
            'Speed': item.speed || '',
            'Heading': item.heading || '',
            'Tag Type': item.tag_type || '',
            'Asset Class': item.asset_class || '',
            'Asset ID': item.asset_id || '',
            'Asset Name': item.asset_name || '',
            'From Location': item.from_location || '',
            'From Site Name': item.from_site_name || '',
            'Organization': item.organization || '',
            'Reader Right Antenna': item.reader_right_antenna || '',
            'To Location': item.to_location || '',
            'To Site Name': item.to_site_name || '',
            'Site Offset': item.site_offset || '',
            'Captured Dwell Time': item.captured_dwell_time || '',
            'Carrier': item.carrier || ''
        }));
        
        try {
            // Create workbook and worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(flattenedData);
            
            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Inventory Data');
            
            // Generate filename with current date
            const now = new Date();
            const dateStr = now.getFullYear() + '-' + 
                          String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(now.getDate()).padStart(2, '0') + '_' +
                          String(now.getHours()).padStart(2, '0') + '-' +
                          String(now.getMinutes()).padStart(2, '0');
            const filename = 'inventory_export_' + dateStr + '.xlsx';
            
            // Write and download file
            XLSX.writeFile(wb, filename);
            
            alert('Excel file exported successfully! Total records: ' + data.length);
        } catch (error) {
            console.error('Error creating Excel file:', error);
            alert('Error creating Excel file: ' + error.message);
        }
    }
    
    // Button click handler
    exportButton.addEventListener('click', async function() {
        console.log('Export button clicked');
        console.log('Current auth:', capturedAuth ? 'Present' : 'Missing');
        console.log('Current cookie:', capturedCookie ? 'Present' : 'Missing');
        
        // Try to test connection first
        if (!capturedAuth && !capturedCookie) {
            console.log('No headers captured, trying to test API connection...');
            const connected = await testApiConnection();
            if (!connected) {
                alert('Could not connect to API. Please:\n\n1. Make sure you are logged into the yard-visibility system\n2. Navigate to the inventory page or refresh it\n3. Try the export again\n\nIf the problem persists, check the browser console for more details.');
                return;
            }
        }
        
        exportButton.innerHTML = 'Exporting...';
        exportButton.disabled = true;
        exportButton.style.backgroundColor = '#666';
        
        try {
            const inventoryData = await fetchAllInventoryData();
            if (inventoryData.length > 0) {
                exportToExcel(inventoryData);
            } else {
                alert('No data found to export. Please check if you have access to inventory data.');
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed: ' + error.message + '\n\nPlease check the browser console for more details.');
        } finally {
            exportButton.innerHTML = 'Export Inventory to Excel';
            exportButton.disabled = false;
            exportButton.style.backgroundColor = '#4CAF50';
        }
    });
    
    console.log('Inventory Export script loaded successfully');
    
    // Try initial extraction
    setTimeout(tryExtractFromBrowser, 1000);
    
})();