// ==UserScript==
// @name        AM-Llenador de información vista de calendario AM
// @description Permite llenar la información en la vista de calendario de Appointment Manager
// @namespace   CBI_P44_Plugins
// @version     1.1
// @author      tomasmoralescbi
// @include     https://yardaptm-na12.voc.project44.com/schedule
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/545846/AM-Llenador%20de%20informaci%C3%B3n%20vista%20de%20calendario%20AM.user.js
// @updateURL https://update.greasyfork.org/scripts/545846/AM-Llenador%20de%20informaci%C3%B3n%20vista%20de%20calendario%20AM.meta.js
// ==/UserScript==

// Store the last response data
let lastResponseData = null;

// Store carrier list data (SCAC to name mapping)
let carrierMap = {};

// Store auth headers for API calls
let authHeaders = {};

// Track whether carrier list fetch is in progress
let carrierFetchInProgress = false;

// Track if we've already tried to fetch the carrier list
let carrierFetchAttempted = false;

// Function to extract info from additional_labels
function extractInfoFromLabels(additionalLabels, prefix) {
  if (!additionalLabels || !Array.isArray(additionalLabels)) return null;
  
  for (const label of additionalLabels) {
    if (typeof label === 'string' && label.toLowerCase().startsWith(prefix.toLowerCase() + '::')) {
      return label.split('::')[1].trim();
    }
  }
  return null;
}

// Function to fetch carrier list (with debouncing/throttling)
async function fetchCarrierList() {
  console.log("🚚 Attempting to fetch carrier list...");
  
  // Skip if already fetching or if we've already tried recently
  if (carrierFetchInProgress) {
    console.log("🚫 Carrier fetch already in progress, skipping");
    return;
  }
  
  // Only fetch if we have auth headers
  if (!authHeaders.Authorization) {
    console.log("🔑 Missing authentication headers for carrier list request");
    return;
  }
  
  try {
    carrierFetchInProgress = true;
    carrierFetchAttempted = true;
    
    console.log("⏳ Delaying carrier fetch to prioritize page load...");
    // Delay the fetch to not interfere with critical page loading
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    
    console.log("🔄 Now fetching carrier list with auth headers:", 
                { Auth: authHeaders.Authorization ? "Present" : "Missing", 
                  Cookie: authHeaders.Cookie ? "Present" : "Missing" });
    
    const response = await fetch('https://yardaptm-na12.api.project44.com/v1/carrier/list', {
      method: 'GET',
      headers: authHeaders
    });
    
    if (!response.ok) {
      console.error('❌ Failed to fetch carrier list:', response.status);
      return;
    }
    
    console.log("✅ Carrier list response received, parsing data...");
    const data = await response.json();
    console.log("📊 Carrier list data sample:", data.data ? data.data.slice(0, 3) : "No data");
    
    // Build a map of SCAC to name
    if (data && data.data && Array.isArray(data.data)) {
      // Clear existing map to ensure fresh data
      carrierMap = {};
      
      data.data.forEach(carrier => {
        if (carrier.scac && carrier.name) {
          carrierMap[carrier.scac.toLowerCase()] = carrier.name;
        }
      });
      
      console.log('🗺️ Carrier map loaded with', Object.keys(carrierMap).length, 'carriers');
      console.log('📝 Sample mappings:', 
                  Object.entries(carrierMap).slice(0, 5).map(([k, v]) => k +`->`+ v ).join(', '));
      
      // Store carrier map in session storage for future page loads
      try {
        sessionStorage.setItem('carrierMap', JSON.stringify(carrierMap));
        console.log('💾 Carrier map saved to session storage');
      } catch (e) {
        console.error('❌ Failed to store carrier map in session storage', e);
      }
      
      // Re-process elements now that we have the carrier data
      console.log('🔄 Re-processing elements with updated carrier names');
      processDockScheduleElements();
    } else {
      console.error('❌ Invalid carrier list data format:', data);
    }
  } catch (error) {
    console.error('❌ Error fetching carrier list:', error);
  } finally {
    carrierFetchInProgress = false;
  }
}

// Process elements with the data we have
function processDockScheduleElements() {
  if (!lastResponseData) {
    console.log("⚠️ No timeline data available yet, skipping element processing");
    return;
  }
  
  console.log("🔍 Processing dock schedule elements...");
  
  // Target the calendar event elements
  const eventElements = document.querySelectorAll('.dhx_cal_event_line');
  console.log(`🔢 Found` +eventElements.length +`calendar event elements`);
  
  let processedCount = 0;
  
  eventElements.forEach(element => {
    // Extract the shipment ID to match with API data
    const shipmentIdElement = element.querySelector('.text-uppercase.font-weight-bold');
    if (!shipmentIdElement) return;
    
    const shipmentId = shipmentIdElement.textContent.replace('#', '').trim();
    
    // Look for matching shipment in the stored data
    let matchingShipment = null;
    
    for (const section of lastResponseData.data) {
      if (section.schedule_details && Array.isArray(section.schedule_details)) {
        matchingShipment = section.schedule_details.find(
          schedule => schedule.shipment_no === shipmentId || schedule.reference_1 === shipmentId
        );
        if (matchingShipment) break;
      }
    }
    
    // If found, extract info and insert it inline with the ID
    if (matchingShipment) {
      console.log(`📦 Found matching shipment for`+ shipmentId);
      
      // Check if we already added the info
      if (!shipmentIdElement.innerHTML.includes('tms-info-span')) {
        // Extract TMS commodity and TMS delivery
        let tmsCommodity = extractInfoFromLabels(matchingShipment.additional_labels, 'tms commodity');
        const tmsDelivery = extractInfoFromLabels(matchingShipment.additional_labels, 'tms delivery');
        const carrierCode = matchingShipment.carrier; // Get the carrier code
        
        console.log(`🔤 For shipment`+ shipmentId+`:`, 
                    { carrierCode, tmsCommodity, tmsDelivery });
        
        // Get carrier name from the map, or use the code if not found
        let carrierDisplay = carrierCode;
        if (carrierCode && carrierMap[carrierCode.toLowerCase()]) {
          carrierDisplay = carrierMap[carrierCode.toLowerCase()];
          console.log(`✅ Found carrier name for `+carrierCode+`: `+carrierDisplay);
        } else {
          console.log(`⚠️ No carrier name found for code: `+carrierCode);
          console.log(`🔍 Available carriers:`, Object.keys(carrierMap).slice(0, 10));
        }
        
        // Remove first 5 characters from commodity if available
        if (tmsCommodity && tmsCommodity.length > 5) {
          tmsCommodity = tmsCommodity.substring(5);
        }
        
        // Build the information string
        let infoText = '';
        
        if (carrierDisplay) {
          // Capitalize first letter of each word for better readability
          infoText += capitalizeWords(carrierDisplay);
        }
        
        if (tmsCommodity) {
          if (infoText) infoText += ' | ';
          infoText += tmsCommodity;
        }
        
        if (tmsDelivery) {
          if (infoText) infoText += ' | ';
          infoText += tmsDelivery;
        }
        
        // Only proceed if we have at least one piece of information
        if (infoText) {
          // Insert the info in a responsive container
          const originalText = shipmentIdElement.innerHTML;
          
          // Make sure the parent element can accommodate responsive content
          element.style.overflow = 'visible';
          element.style.whiteSpace = 'normal';
          
          // Add the span with word-wrap and overflow properties
          shipmentIdElement.innerHTML = originalText + 
            `<span class="tms-info-span" style="color:#666;font-size:12px;margin-left:5px;word-wrap:break-word;overflow-wrap:break-word;display:inline-block;">` + 
            infoText + 
            `</span>`;
            
          processedCount++;
          console.log(`✏️ Added info to element: `+infoText);
        }
      } else {
        console.log(`ℹ️ Element already has info span, skipping`);
      }
    } else {
      console.log(`❌ No matching shipment found for`+ shipmentId);
    }
  });
  
  console.log(`🏁 Finished processing elements. Updated `+processedCount +` elements.`);
}

// Helper function to capitalize first letter of each word
function capitalizeWords(str) {
  return str.replace(/\b\w+/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Check for cached carrier map in session storage
function loadCachedCarrierMap() {
  console.log("🔍 Checking for cached carrier map...");
  try {
    const cached = sessionStorage.getItem('carrierMap');
    if (cached) {
      carrierMap = JSON.parse(cached);
      console.log('✅ Loaded carrier map from cache with', Object.keys(carrierMap).length, 'carriers');
      console.log('📝 Sample cached mappings:', 
                  Object.entries(carrierMap).slice(0, 5).map(([k, v]) => `\${k} -> \${v}`).join(', '));
      return true;
    } else {
      console.log("⚠️ No cached carrier map found");
    }
  } catch (e) {
    console.error('❌ Failed to load carrier map from cache', e);
  }
  return false;
}

// Intercept fetch and XMLHttpRequest to capture API responses and auth headers
function interceptNetworkRequests() {
  console.log("🕸️ Setting up network request interception");
  
  // Intercept fetch
  const originalFetch = window.fetch;
  window.fetch = async function(input, init) {
    // Capture auth headers from any API call to the base URL
    if (typeof input === 'string' && input.includes('https://yardaptm-na12.api.project44.com/v1')) {
      console.log(`🔍 Intercepted fetch to: \${input}`);
      
      if (init && init.headers) {
        // Extract authorization and cookie headers
        const hasAuth = !!(init.headers.Authorization || init.headers.authorization);
        const hasCookie = !!(init.headers.Cookie || init.headers.cookie);
        
        console.log(`🔑 Found headers: Auth=`+hasAuth+`, Cookie=`+hasCookie);
        
        if (hasAuth) {
          authHeaders.Authorization = init.headers.Authorization || init.headers.authorization;
        }
        if (hasCookie) {
          authHeaders.Cookie = init.headers.Cookie || init.headers.cookie;
        }
        
        // Schedule carrier list fetch after page load if we haven't already loaded from cache
        if (authHeaders.Authorization && Object.keys(carrierMap).length === 0 && !carrierFetchAttempted) {
          console.log("🚚 Planning to fetch carrier list once page is loaded");
          // Only schedule carrier fetch once we have auth headers and page has loaded
          if (document.readyState === 'complete') {
            setTimeout(fetchCarrierList, 2000); // Delay fetch by 2 seconds
          } else {
            window.addEventListener('load', () => setTimeout(fetchCarrierList, 2000));
          }
        }
      }
    }
    
    const response = await originalFetch.apply(this, arguments);
    
    // Check if this is our target API endpoint
    if (typeof input === 'string' && input.includes('/v1/dock-schedule/timeline')) {
      console.log("📅 Intercepted timeline data response");
      
      // Clone the response so we can read it and still return the original
      const responseClone = response.clone();
      
      responseClone.json().then(data => {
        console.log("📊 Received timeline data with", 
                   data.data ? data.data.length : 0, "sections");
        lastResponseData = data;
        processDockScheduleElements();
      }).catch(err => console.error('❌ Error processing intercepted timeline response:', err));
    }
    
    // Check if this is the carrier list response
    if (typeof input === 'string' && input.includes('/v1/carrier/list')) {
      console.log("🚚 Intercepted carrier list response");
      
      // Clone the response to process carrier data
      const responseClone = response.clone();
      
      responseClone.json().then(data => {
        console.log("📋 Received carrier list with", 
                   data.data ? data.data.length : 0, "carriers");
                   
        // Build a map of SCAC to name
        if (data && data.data && Array.isArray(data.data)) {
          // Clear existing map to ensure fresh data
          carrierMap = {};
          
          data.data.forEach(carrier => {
            if (carrier.scac && carrier.name) {
              carrierMap[carrier.scac.toLowerCase()] = carrier.name;
            }
          });
          
          console.log('🗺️ Carrier map loaded with', Object.keys(carrierMap).length, 'carriers');
          console.log('📝 Sample mappings:', 
                      Object.entries(carrierMap).slice(0, 5).map(([k, v]) => `\${k} -> \${v}`).join(', '));
          
          // Store carrier map in session storage for future page loads
          try {
            sessionStorage.setItem('carrierMap', JSON.stringify(carrierMap));
            console.log('💾 Carrier map saved to session storage');
          } catch (e) {
            console.error('❌ Failed to store carrier map in session storage', e);
          }
          
          // Re-process elements now that we have the carrier data
          console.log('🔄 Re-processing elements with updated carrier names');
          processDockScheduleElements();
        } else {
          console.error('❌ Invalid carrier list data format:', data);
        }
      }).catch(err => console.error('❌ Error processing carrier list response:', err));
    }
    
    return response;
  };
  
  // Intercept XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  
  XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
    // Capture authentication headers
    if ((header.toLowerCase() === 'authorization' || header.toLowerCase() === 'cookie') && 
        this._url && this._url.includes('https://yardaptm-na12.api.project44.com/v1')) {
      console.log(`🔑 XHR: Found `+header+` header in request to `+this._url);
      
      if (header.toLowerCase() === 'authorization') {
        authHeaders.Authorization = value;
      } else if (header.toLowerCase() === 'cookie') {
        authHeaders.Cookie = value;
      }
      
      // Schedule carrier list fetch with newly captured headers
      if (authHeaders.Authorization && Object.keys(carrierMap).length === 0 && !carrierFetchAttempted) {
        console.log("🚚 XHR: Planning to fetch carrier list after headers captured");
        setTimeout(fetchCarrierList, 2000); // Delay fetch by 2 seconds
      }
    }
    
    return originalXHRSetRequestHeader.apply(this, arguments);
  };
  
  XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    
    if (url.includes('/v1/dock-schedule/timeline')) {
      console.log(`🔍 XHR: Intercepted request to timeline API:`+method +url);
      
      const originalOnReadyStateChange = this.onreadystatechange;
      this.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          console.log("📅 XHR: Timeline data response received");
          try {
            const data = JSON.parse(this.responseText);
            console.log("📊 XHR: Received timeline data with", 
                       data.data ? data.data.length : 0, "sections");
            lastResponseData = data;
            processDockScheduleElements();
          } catch (e) {
            console.error('❌ XHR: Error processing timeline response:', e);
          }
        }
        
        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.apply(this, arguments);
        }
      };
    }
    
    if (url.includes('/v1/carrier/list')) {
      console.log(`🚚 XHR: Intercepted request to carrier list API: `+method+url);
      
      const originalOnReadyStateChange = this.onreadystatechange;
      this.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          console.log("📋 XHR: Carrier list response received");
          try {
            const data = JSON.parse(this.responseText);
            console.log("📋 XHR: Received carrier list with", 
                       data.data ? data.data.length : 0, "carriers");
                       
            // Build a map of SCAC to name
            if (data && data.data && Array.isArray(data.data)) {
              // Clear existing map to ensure fresh data
              carrierMap = {};
              
              data.data.forEach(carrier => {
                if (carrier.scac && carrier.name) {
                  carrierMap[carrier.scac.toLowerCase()] = carrier.name;
                }
              });
              
              console.log('🗺️ XHR: Carrier map loaded with', Object.keys(carrierMap).length, 'carriers');
              
              // Store carrier map in session storage for future page loads
              try {
                sessionStorage.setItem('carrierMap', JSON.stringify(carrierMap));
                console.log('💾 XHR: Carrier map saved to session storage');
              } catch (e) {
                console.error('❌ XHR: Failed to store carrier map in session storage', e);
              }
              
              // Re-process elements now that we have the carrier data
              console.log('🔄 XHR: Re-processing elements with updated carrier names');
              processDockScheduleElements();
            }
          } catch (e) {
            console.error('❌ XHR: Error processing carrier list response:', e);
          }
        }
        
        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.apply(this, arguments);
        }
      };
    }
    
    return originalXHROpen.apply(this, arguments);
  };
}

// Set up a mutation observer to handle dynamically added elements
function observeDOMChanges() {
  console.log("👀 Setting up mutation observer for DOM changes");
  
  const observer = new MutationObserver((mutations) => {
    let shouldProcess = false;
    
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE && 
              (node.classList.contains('dhx_cal_event_line') || 
               node.querySelector('.dhx_cal_event_line'))) {
            shouldProcess = true;
            break;
          }
        }
      }
      if (shouldProcess) break;
    }
    
    if (shouldProcess && lastResponseData) {
      console.log("🔄 Detected new calendar elements, processing...");
      processDockScheduleElements();
    }
  });
  
  // Target the container that holds the calendar events
  const container = document.querySelector('.dhx_cal_data') || document.body;
  observer.observe(container, { childList: true, subtree: true });
  console.log("✅ Mutation observer setup complete");
}

// Initialize everything
function initialize() {
  console.log("🚀 Initializing script...");
  
  // Try to load carrier map from session storage first
  const hasCachedCarrierMap = loadCachedCarrierMap();
  
  // Add global CSS to make calendar events more responsive
  const style = document.createElement('style');
  style.textContent = `
    .dhx_cal_event_line {
      overflow: visible !important;
      white-space: normal !important;
      z-index: 1;
    }
    .text-uppercase.font-weight-bold {
      display: flex !important;
      flex-wrap: wrap !important;
      align-items: center !important;
    }
  `;
  document.head.appendChild(style);
  console.log("✅ Added responsive styling");
  
  interceptNetworkRequests();
  observeDOMChanges();
  
  // Check periodically for existing elements that need processing
  console.log("⏱️ Setting up periodic check for elements");
  const checkInterval = setInterval(() => {
    if (lastResponseData && document.querySelectorAll('.dhx_cal_event_line').length > 0) {
      console.log("🔍 Found elements and data, processing...");
      processDockScheduleElements();
      clearInterval(checkInterval);
      console.log("⏱️ Cleared periodic check interval");
    }
  }, 500);
  
  console.log("✅ Initialization complete");
}

// Start the script when the DOM is fully loaded
if (document.readyState === 'loading') {
  console.log("⏳ Document still loading, waiting for DOMContentLoaded");
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  console.log("📄 Document already loaded, initializing immediately");
  initialize();
}