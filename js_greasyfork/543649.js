// ==UserScript==
// @name        OBG-Formulario para arribo de unidades
// @description Permite realizar el ingreso de las unidades de transporte con cita con la información como se necesita para los requerimientos de CT-PAT y OEA.
// @namespace   CBI_P44_Plugins
// @version     1.2.3
// @author      tomasmoralescbi
// @include     https://yard-visibility-na12.voc.project44.com/gate/console
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/543649/OBG-Formulario%20para%20arribo%20de%20unidades.user.js
// @updateURL https://update.greasyfork.org/scripts/543649/OBG-Formulario%20para%20arribo%20de%20unidades.meta.js
// ==/UserScript==
 
 
// Creating the main button at the top of the screen
(function() {
  // Variables to store authorization headers
  let authToken = '';
  let cookieValue = '';
  
  // Debug logging function
  const debugLog = (message, data) => {
    if (data) {
      console.log('[YARD ARRIVAL]', message, data);
    } else {
      console.log('[YARD ARRIVAL]', message);
    }
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
            const authHeader = this._requestHeaders?.find(h => h.name === 'Authorization')?.value;
            const cookieHeader = this._requestHeaders?.find(h => h.name === 'Cookie')?.value;
            
            if (authHeader) {
              authToken = authHeader;
              debugLog("Authorization captured from XHR");
            }
            
            if (cookieHeader) {
              cookieValue = cookieHeader;
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
        authToken = value;
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
    window.fetch = function(url, options = {}) {
      if (url && url.toString().includes('yard-visibility-na12.api.project44.com')) {
        debugLog('Fetch intercepted: ' + url.toString());
        
        if (options.headers) {
          const headers = options.headers instanceof Headers ? 
            Object.fromEntries([...options.headers.entries()]) : 
            options.headers;
            
          if (headers.Authorization || headers.authorization) {
            authToken = headers.Authorization || headers.authorization;
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
      // Create a proper cookie string from document.cookie
      const cookies = document.cookie.split(';').map(cookie => cookie.trim());
      if (cookies.length > 0) {
        cookieValue = cookies.join('; ');
        debugLog("Cookies extracted from document: " + cookieValue);
      }
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
      
      for (let key of storageKeys) {
        const token = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (token) {
          authToken = 'Bearer ' + token;
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
            authToken = value;
          } else if (value.startsWith('eyJ')) {
            authToken = 'Bearer ' + value;
          }
          return true;
        }
      }
      
      debugLog("No token found in storage");
      return false;
    } catch (e) {
      debugLog("Error accessing storage:", e.message);
      return false;
    }
  }
  
  // Try to capture cookies from the Network tab programmatically
  function captureCookiesFromNetworkRequests() {
    debugLog("Setting up network request monitoring for cookies");
    
    // Use PerformanceObserver if available to monitor network requests
    if (window.PerformanceObserver) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach(entry => {
            if (entry.name && entry.name.includes('yard-visibility-na12.api.project44.com')) {
              debugLog("Network request observed: " + entry.name);
              
              // If we have the getEntriesByType method, we can try to get request/response headers
              if (performance.getEntriesByType && entry.name) {
                const resourceEntries = performance.getEntriesByType('resource');
                const matchingEntry = resourceEntries.find(e => e.name === entry.name);
                
                if (matchingEntry && matchingEntry.responseHeaders) {
                  const cookieHeader = matchingEntry.responseHeaders.match(/set-cookie: ([^\r\n]*)/i);
                  if (cookieHeader && cookieHeader[1]) {
                    cookieValue = cookieHeader[1];
                    debugLog("Cookie captured from response headers");
                  }
                }
              }
            }
          });
        });
        
        observer.observe({ entryTypes: ['resource'] });
        debugLog("PerformanceObserver set up for resource monitoring");
      } catch (e) {
        debugLog("Error setting up PerformanceObserver: " + e.message);
      }
    }
  }
  
  // Manually add cookie header to all yard-visibility requests
  function setupForcedCookieInjection() {
    // Override fetch method to always include cookies for yard-visibility requests
    const origFetch = window.fetch;
    window.fetch = function(resource, options = {}) {
      const url = resource instanceof Request ? resource.url : resource.toString();
      
      if (url.includes('yard-visibility-na12.api.project44.com')) {
        options = options || {};
        options.credentials = 'include';
        
        if (!options.headers) {
          options.headers = {};
        }
        
        // If headers is a Headers object, convert to plain object
        if (options.headers instanceof Headers) {
          const plainHeaders = {};
          for (let [key, value] of options.headers.entries()) {
            plainHeaders[key] = value;
          }
          options.headers = plainHeaders;
        }
        
        // Force include cookie header if we have it
        if (cookieValue && !options.headers.Cookie && !options.headers.cookie) {
          options.headers.Cookie = cookieValue;
        }
      }
      
      return origFetch.call(this, resource, options);
    };
  }
  
  // Function to make API requests with captured credentials
  const makeRequest = async (url, method = 'GET', data = null) => {
    // Try to get credentials if we don't have them yet
    if (!authToken || !cookieValue) {
      extractCookies();
      getTokenFromStorage();
    }
    
    if (!authToken) {
      console.warn('Authorization token not captured yet');
      return null;
    }
    
    try {
      debugLog("Making " + method + " request to: " + url);
      
      // Important: Create headers this way to ensure cookie is included
      const headers = new Headers();
      headers.append('Authorization', authToken);
      
      // Always include cookies in the request
      if (cookieValue) {
        headers.append('Cookie', cookieValue);
      }
      
      headers.append('Content-Type', 'application/json');
      
      const options = {
        method: method,
        headers: headers,
        credentials: 'include' // This is crucial to include cookies
      };
      
      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }
      
      debugLog("Request options:", options);
      const response = await fetch(url, options);
      
      // Also try to capture Set-Cookie from response
      const setCookie = response.headers.get('Set-Cookie');
      if (setCookie) {
        cookieValue = setCookie;
        debugLog("Updated cookie from response Set-Cookie");
      }
      
      const result = await response.json();
      debugLog("Response:", result);
      return result;
    } catch (error) {
      console.error('API Request Error:', error);
      return null;
    }
  };
  
  // Extract values from comment tags
  const extractFromComment = (comment, tag) => {
    if (!comment) return '';
    const regex = new RegExp('<' + tag + '>([^<]*)</' + tag + '>', 'i');
    const match = comment.match(regex);
    return match ? match[1].toUpperCase() : '';  // Convert to uppercase
  };
  
  // Format date from unix timestamp
  const formatDate = (unixTime) => {
    if (!unixTime) return '';
    const date = new Date(Number(unixTime));
    return date.getDate().toString().padStart(2, '0') + '/' + 
           (date.getMonth() + 1).toString().padStart(2, '0') + ' ' + 
           date.getHours().toString().padStart(2, '0') + ':' + 
           date.getMinutes().toString().padStart(2, '0');
  };
  
  // Clean text for inputs (remove special characters)
  const cleanText = (text) => {
    if (!text) return '';
    return text.replace(/ñ/gi, 'n').replace(/[^\w\s]/gi, '').toUpperCase();  // Convert to uppercase
  };
  
  // Main console state
  let consoleState = {
    loadData: null,
    shipmentResults: [],
    selectedShipment: null,
    carrierList: [],
    recommendedZone: null,
    formValues: {}
  };
  
  // Create the main button
  const createMainButton = () => {
    const existingButton = document.getElementById('yard-gate-arrival-button');
    if (existingButton) return;
    
    const button = document.createElement('button');
    button.id = 'yard-gate-arrival-button';
    button.innerText = 'ARRIBO DE UNIDAD';
    button.style = 
      'position: fixed;' +
      'top: 10px;' +
      'left: 50%;' +
      'transform: translateX(-50%);' +
      'z-index: 9999;' +
      'padding: 10px 20px;' +
      'background-color: #1976D2;' +
      'color: white;' +
      'border: none;' +
      'border-radius: 4px;' +
      'font-size: 16px;' +
      'font-weight: bold;' +
      'cursor: pointer;' +
      'box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
    
    button.addEventListener('click', openArrivalConsole);
    document.body.appendChild(button);
  };
  
  // Create and open the arrival console modal
  const openArrivalConsole = () => {
    const existingModal = document.getElementById('yard-arrival-console-modal');
    if (existingModal) existingModal.remove();
    
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'yard-arrival-console-modal';
    modal.style = 
      'position: fixed;' +
      'top: 0;' +
      'left: 0;' +
      'width: 100%;' +
      'height: 100%;' +
      'background-color: white;' +
      'z-index: 10000;' +
      'display: flex;' +
      'flex-direction: column;' +
      'overflow: hidden;';
    
    // Create header
    const header = document.createElement('div');
    header.style = 
      'display: flex;' +
      'justify-content: space-between;' +
      'align-items: center;' +
      'padding: 15px 20px;' +
      'background-color: #1976D2;' +
      'color: white;' +
      'box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
    
    const title = document.createElement('h2');
    title.innerText = 'CONSOLA DE ARRIBO DE UNIDADES';
    title.style.margin = '0';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style = 
      'background: none;' +
      'border: none;' +
      'font-size: 24px;' +
      'color: white;' +
      'cursor: pointer;';
    closeBtn.addEventListener('click', () => modal.remove());
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    // Create content area
    const content = document.createElement('div');
    content.style = 
      'flex: 1;' +
      'padding: 20px;' +
      'overflow-y: auto;';
    
    // Render search form
    renderSearchForm(content);
    
    modal.appendChild(header);
    modal.appendChild(content);
    document.body.appendChild(modal);
  };
  
  // Render the search form
  const renderSearchForm = (container) => {
    container.innerHTML = '';
    
    const searchBox = document.createElement('div');
    searchBox.style = 
      'display: flex;' +
      'flex-direction: column;' +
      'align-items: center;' +
      'max-width: 600px;' +
      'margin: 0 auto;';
    
    const label = document.createElement('label');
    label.innerText = 'INGRESE NÚMERO DE EMBARQUE:';
    label.style = 
      'font-size: 18px;' +
      'font-weight: bold;' +
      'margin-bottom: 10px;' +
      'align-self: flex-start;';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.style = 
      'width: 100%;' +
      'padding: 15px;' +
      'font-size: 24px;' +
      'border: 2px solid #ccc;' +
      'border-radius: 4px;' +
      'margin-bottom: 20px;' +
      'text-transform: uppercase;';  // Add text transform
    
    // Convert input to uppercase as the user types
    input.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
    });
    
    const statusMsg = document.createElement('div');
    statusMsg.id = 'search-status-message';
    statusMsg.style = 
      'width: 100%;' +
      'padding: 10px;' +
      'margin-bottom: 20px;' +
      'text-align: center;' +
      'display: none;';
    
    input.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter') {
        statusMsg.style.display = 'block';
        statusMsg.style.backgroundColor = '#f8f9fa';
        statusMsg.innerText = 'BUSCANDO...';
        
        const searchTerm = input.value.trim();
        if (!searchTerm) {
          statusMsg.style.backgroundColor = '#f8d7da';
          statusMsg.innerText = 'INGRESE UN NÚMERO DE EMBARQUE VÁLIDO';
          return;
        }
        
        try {
          const result = await makeRequest('https://yard-visibility-na12.api.project44.com/v1/gate/expected-deliveries/search?site=obregon&start=1&end=20&search_term=' + searchTerm + '&is_old_shipment=false');
          
          if (result && result.data && result.data.length > 0) {
            consoleState.shipmentResults = result.data;
            
            if (result.data.length === 1) {
              // Single result - fetch shipment directly
              await selectShipment(result.data[0].shipment_no, container);
            } else {
              // Multiple results - show dropdown
              renderShipmentSelection(container, result.data);
            }
          } else {
            statusMsg.style.backgroundColor = '#f8d7da';
            statusMsg.innerText = 'NO SE ENCONTRARON RESULTADOS';
          }
        } catch (error) {
          console.error('Error searching shipments:', error);
          statusMsg.style.backgroundColor = '#f8d7da';
          statusMsg.innerText = 'ERROR AL BUSCAR: ' + error.message;
        }
      }
    });
    
    searchBox.appendChild(label);
    searchBox.appendChild(input);
    searchBox.appendChild(statusMsg);
    
    container.appendChild(searchBox);
  };
  
  // Render shipment selection dropdown when multiple results found
  const renderShipmentSelection = (container, shipments) => {
    container.innerHTML = '';
    
    const selectionBox = document.createElement('div');
    selectionBox.style = 
      'max-width: 800px;' +
      'margin: 0 auto;' +
      'padding: 20px;' +
      'background-color: #f8f9fa;' +
      'border-radius: 8px;';
    
    const heading = document.createElement('h3');
    heading.innerText = 'MÚLTIPLES RESULTADOS ENCONTRADOS';
    heading.style = 
      'margin-top: 0;' +
      'margin-bottom: 20px;' +
      'text-align: center;';
    
    const label = document.createElement('label');
    label.innerText = 'SELECCIONE UN EMBARQUE:';
    label.style = 'display: block; margin-bottom: 10px; font-weight: bold;';
    
    const select = document.createElement('select');
    select.style = 
      'width: 100%;' +
      'padding: 10px;' +
      'font-size: 16px;' +
      'border: 1px solid #ccc;' +
      'border-radius: 4px;' +
      'margin-bottom: 20px;' +
      'text-transform: uppercase;';  // Add text transform
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.innerText = '-- SELECCIONE UN EMBARQUE --';
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);
    
    // Add shipment options
    shipments.forEach(shipment => {
      const option = document.createElement('option');
      option.value = shipment.shipment_no;
      option.innerText = (shipment.shipment_no + ' - ' + (shipment.reference_1 || '') + ' - ' + (shipment.reference_2 || '')).toUpperCase();
      select.appendChild(option);
    });
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style = 'text-align: center;';
    
    const confirmButton = document.createElement('button');
    confirmButton.innerText = 'SELECCIONAR';
    confirmButton.style = 
      'padding: 10px 20px;' +
      'background-color: #1976D2;' +
      'color: white;' +
      'border: none;' +
      'border-radius: 4px;' +
      'font-size: 16px;' +
      'cursor: pointer;';
    confirmButton.disabled = true;
    
    const backButton = document.createElement('button');
    backButton.innerText = 'VOLVER A BUSCAR';
    backButton.style = 
      'padding: 10px 20px;' +
      'background-color: #6c757d;' +
      'color: white;' +
      'border: none;' +
      'border-radius: 4px;' +
      'font-size: 16px;' +
      'cursor: pointer;' +
      'margin-right: 10px;';
    
    select.addEventListener('change', () => {
      confirmButton.disabled = !select.value;
    });
    
    confirmButton.addEventListener('click', async () => {
      if (!select.value) return;
      await selectShipment(select.value, container);
    });
    
    backButton.addEventListener('click', () => {
      renderSearchForm(container);
    });
    
    buttonContainer.appendChild(backButton);
    buttonContainer.appendChild(confirmButton);
    
    selectionBox.appendChild(heading);
    selectionBox.appendChild(label);
    selectionBox.appendChild(select);
    selectionBox.appendChild(buttonContainer);
    
    container.appendChild(selectionBox);
  };
  
  // Select a shipment and load its details
  const selectShipment = async (shipmentNo, container) => {
    // Show loading indicator
    container.innerHTML = 
      '<div style="display: flex; justify-content: center; align-items: center; height: 200px;">' +
        '<div style="text-align: center;">' +
          '<div style="border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite; margin: 0 auto;"></div>' +
          '<p>CARGANDO INFORMACIÓN DEL EMBARQUE...</p>' +
        '</div>' +
      '</div>' +
      '<style>' +
        '@keyframes spin {' +
          '0% { transform: rotate(0deg); }' +
          '100% { transform: rotate(360deg); }' +
        '}' +
      '</style>';
    
    try {
      // Load shipment details
      const loadData = await makeRequest('https://yard-visibility-na12.api.project44.com/v1/shipment/pickup/' + shipmentNo);
      if (!loadData) throw new Error('No se pudo cargar la información del embarque');
      
      consoleState.loadData = loadData;
      consoleState.selectedShipment = shipmentNo;
      
      // Fetch carrier list for the dropdown
      const carrierResponse = await makeRequest('https://yard-visibility-na12.api.project44.com/v1/carrier/list?size=1000');
      consoleState.carrierList = carrierResponse?.data || [];
      
      // Fetch recommended zone
      const assetStatus = loadData.service_type === "pickup" ? "empty" : "loaded";
      const zoneResponse = await makeRequest('https://yard-visibility-na12.api.project44.com/v1/get-recommended-parking-location?site=obregon&rule_type=gate&carrier=' + loadData.carrier + '&size=53&asset_status=' + assetStatus + '&product_type=' + (loadData.product_type || '') + '&is_dedicated=false&zone=acceso%204&load_type=' + (loadData.load_type || '') + '&priority=%27%27&location=llegada&asset_condition=%27%27&service_type=' + (loadData.service_type_name || ''));
      consoleState.recommendedZone = zoneResponse;
      
      // Render form
      renderArrivalForm(container);
    } catch (error) {
      console.error('Error loading shipment details:', error);
      container.innerHTML = 
        '<div style="text-align: center; padding: 20px; background-color: #f8d7da; color: #721c24; border-radius: 8px; margin: 20px auto; max-width: 600px;">' +
          '<h3>ERROR AL CARGAR INFORMACIÓN</h3>' +
          '<p>' + error.message + '</p>' +
          '<button onclick="location.reload()" style="padding: 10px 20px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">REINTENTAR</button>' +
        '</div>';
    }
  };
  
  // Render the main arrival form
  const renderArrivalForm = (container) => {
    const { loadData, carrierList, recommendedZone } = consoleState;
    if (!loadData) return;
    
    // Initialize form state
    consoleState.formValues = {};
    
    container.innerHTML = '';
    
    // Check if it's a critical shipment
    const comment = loadData.comment || '';
    const isCritical = comment.includes('<critico>');
    
    // Create form container
    const formContainer = document.createElement('div');
    formContainer.style = 
      'max-width: 1200px;' +
      'margin: 0 auto;' +
      'padding: 20px;' +
      'background-color: #f8f9fa;' +
      'border-radius: 8px;';
    
    if (isCritical) {
      const criticalWarning = document.createElement('div');
      criticalWarning.style = 
        'background-color: #f8d7da;' +
        'color: #721c24;' +
        'padding: 15px;' +
        'margin-bottom: 20px;' +
        'border-radius: 4px;' +
        'font-size: 18px;' +
        'font-weight: bold;' +
        'text-align: center;';
      criticalWarning.innerText = 'FOLIO CRÍTICO';
      formContainer.appendChild(criticalWarning);
    }
    
    // Section 1: Transporte
    const transportSection = createSection('TRANSPORTE');
    
    addFormField(transportSection, 'IDENTIFICADOR', (loadData.shipment_no || '').toUpperCase(), true);
    addFormField(transportSection, 'TIPO', (loadData.service_type_name || '').toUpperCase(), true);
    addFormField(transportSection, 'FOLIO', (loadData.reference_1 || '').toUpperCase(), true);
    addFormField(transportSection, 'ENTREGA', (loadData.reference_2 || '').toUpperCase(), true);
    addFormField(transportSection, 'FECHA DE CITA', formatDate(loadData.gate_appointment_time), true);
    addFormField(transportSection, 'ORIGEN', (loadData.vendor || '').toUpperCase(), true);
    addFormField(transportSection, 'DESTINO', (loadData.customer || '').toUpperCase(), true);
    addFormField(transportSection, 'SECCIÓN', (loadData.section || '').toUpperCase(), true);
    addFormField(transportSection, 'MATERIAL', (loadData.product_type || '').toUpperCase(), true);
    
    // SKU field with hover functionality
    if (loadData.load_information && loadData.load_information.length > 0) {
      const skuField = document.createElement('div');
      skuField.style = 'margin-bottom: 15px;';
      
      const skuLabel = document.createElement('label');
      skuLabel.innerText = 'SKU:';
      skuLabel.style = 'display: block; font-weight: bold; margin-bottom: 5px;';
      
      const skuValue = document.createElement('div');
      skuValue.style = 
        'padding: 8px;' +
        'background-color: #e9ecef;' +
        'border: 1px solid #ced4da;' +
        'border-radius: 4px;' +
        'position: relative;' +
        'text-transform: uppercase;';  // Add text transform
      skuValue.innerText = (loadData.load_information[0].sku || '').toUpperCase();
      
      if (loadData.load_information.length > 1) {
        skuValue.style.cursor = 'pointer';
        
        const skuTooltip = document.createElement('div');
        skuTooltip.style = 
          'position: absolute;' +
          'top: 100%;' +
          'left: 0;' +
          'width: 300px;' +
          'background-color: white;' +
          'border: 1px solid #ced4da;' +
          'border-radius: 4px;' +
          'padding: 10px;' +
          'z-index: 1000;' +
          'box-shadow: 0 2px 5px rgba(0,0,0,0.2);' +
          'display: none;' +
          'text-transform: uppercase;';  // Add text transform
        
        loadData.load_information.forEach((item, index) => {
          if (index === 0) return;
          const itemDiv = document.createElement('div');
          itemDiv.innerText = ((item.sku || '') + ' - QTY: ' + (item.qty || '')).toUpperCase();
          itemDiv.style = 'margin-bottom: 5px; padding-bottom: 5px; border-bottom: 1px solid #eee;';
          skuTooltip.appendChild(itemDiv);
        });
        
        skuValue.addEventListener('mouseenter', () => {
          skuTooltip.style.display = 'block';
        });
        
        skuValue.addEventListener('mouseleave', () => {
          skuTooltip.style.display = 'none';
        });
        
        skuValue.appendChild(skuTooltip);
      }
      
      skuField.appendChild(skuLabel);
      skuField.appendChild(skuValue);
      transportSection.appendChild(skuField);
    }
    
    addFormField(transportSection, 'CÓDIGO LÍNEA', (loadData.carrier || '').toUpperCase(), true);
    
    // Carrier name lookup
    const carrierName = carrierList.find(c => c.scac === loadData.carrier)?.name || '';
    addFormField(transportSection, 'NOMBRE LÍNEA', carrierName.toUpperCase(), true);
    
    // Real Carrier Code (Editable with Dropdown)
    const realCarrierCodeValue = extractFromComment(loadData.comment, 'u');
    const realCarrierCodeContainer = document.createElement('div');
    realCarrierCodeContainer.style = 'margin-bottom: 15px;';
 
    const realCarrierCodeLabel = document.createElement('label');
    realCarrierCodeLabel.innerText = 'CÓDIGO LÍNEA REAL';
    realCarrierCodeLabel.style = 'display: block; font-weight: bold; margin-bottom: 5px;';
 
    // Create input container with dropdown functionality
    const realCarrierInputContainer = document.createElement('div');
    realCarrierInputContainer.style = 'position: relative;';
 
    const realCarrierCodeInput = document.createElement('input');
    realCarrierCodeInput.id = 'codigo-linea-real';
    realCarrierCodeInput.type = 'text';
    realCarrierCodeInput.value = realCarrierCodeValue;
    realCarrierCodeInput.style = 
      'width: 100%;' +
      'padding: 8px;' +
      'border: 1px solid #ced4da;' +
      'border-radius: 4px;' +
      'background-color: white;' +
      'text-transform: uppercase;';
 
    // Create dropdown for carrier selection
    const carrierDropdown = document.createElement('div');
    carrierDropdown.style = 
      'position: absolute;' +
      'top: 100%;' +
      'left: 0;' +
      'right: 0;' +
      'max-height: 200px;' +
      'overflow-y: auto;' +
      'background-color: white;' +
      'border: 1px solid #ced4da;' +
      'border-top: none;' +
      'border-radius: 0 0 4px 4px;' +
      'z-index: 1000;' +
      'display: none;';
 
    // Populate dropdown with carrier options
    if (carrierList && carrierList.length) {
      carrierList.forEach(carrier => {
        const option = document.createElement('div');
        option.style = 
          'padding: 8px 12px;' +
          'cursor: pointer;' +
          'text-transform: uppercase;';
        option.innerText = carrier.scac.toUpperCase() + ' - ' + carrier.name.toUpperCase();
        
        option.addEventListener('mouseover', function() {
          this.style.backgroundColor = '#f8f9fa';
        });
        
        option.addEventListener('mouseout', function() {
          this.style.backgroundColor = 'white';
        });
        
        option.addEventListener('click', function() {
          realCarrierCodeInput.value = carrier.scac.toUpperCase();
          document.getElementById('nombre-linea-real').value = carrier.name.toUpperCase();
          consoleState.formValues['codigo-linea-real'] = carrier.scac.toUpperCase();
          consoleState.formValues['nombre-linea-real'] = carrier.name.toUpperCase();
          carrierDropdown.style.display = 'none';
        });
        
        carrierDropdown.appendChild(option);
      });
    }
 
    // Show dropdown on input focus
    realCarrierCodeInput.addEventListener('focus', function() {
      // Only show dropdown if empty or no match found
      const currentValue = this.value.trim().toUpperCase();
      if (!currentValue || !carrierList.some(c => c.scac.toUpperCase() === currentValue)) {
        carrierDropdown.style.display = 'block';
        
        // Filter options based on current input
        filterCarrierDropdown(currentValue);
      }
    });
 
    // Handle input changes
    realCarrierCodeInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      const currentValue = this.value.trim().toUpperCase();
      
      // Find matching carrier
      const matchingCarrier = carrierList.find(c => c.scac.toUpperCase() === currentValue);
      
      if (matchingCarrier) {
        document.getElementById('nombre-linea-real').value = matchingCarrier.name.toUpperCase();
        consoleState.formValues['nombre-linea-real'] = matchingCarrier.name.toUpperCase();
        carrierDropdown.style.display = 'none';
      } else {
        document.getElementById('nombre-linea-real').value = '';
        consoleState.formValues['nombre-linea-real'] = '';
        
        // Show and filter dropdown
        carrierDropdown.style.display = 'block';
        filterCarrierDropdown(currentValue);
      }
      
      consoleState.formValues['codigo-linea-real'] = this.value;
    });
 
    // Filter dropdown options based on input
    function filterCarrierDropdown(filterText) {
      if (!filterText) {
        // Show all options if no filter text
        Array.from(carrierDropdown.children).forEach(option => {
          option.style.display = 'block';
        });
        return;
      }
      
      // Filter by scac or name containing the filter text
      Array.from(carrierDropdown.children).forEach(option => {
        const optionText = option.innerText.toUpperCase();
        if (optionText.includes(filterText)) {
          option.style.display = 'block';
        } else {
          option.style.display = 'none';
        }
      });
    }
 
    // Hide dropdown when clicking outside
    document.addEventListener('click', function(event) {
      if (!realCarrierInputContainer.contains(event.target)) {
        carrierDropdown.style.display = 'none';
      }
    });
 
    realCarrierInputContainer.appendChild(realCarrierCodeInput);
    realCarrierInputContainer.appendChild(carrierDropdown);
    realCarrierCodeContainer.appendChild(realCarrierCodeLabel);
    realCarrierCodeContainer.appendChild(realCarrierInputContainer);
    transportSection.appendChild(realCarrierCodeContainer);
 
    // Real Carrier Name
    const realCarrierName = carrierList.find(c => c.scac.toUpperCase() === realCarrierCodeValue.toUpperCase())?.name || '';
    const realCarrierNameInput = addFormField(transportSection, 'NOMBRE LÍNEA REAL', realCarrierName.toUpperCase(), true);
    realCarrierNameInput.id = 'nombre-linea-real';
    
    // UUID Carta Porte (Editable)
    const uuidValue = extractFromComment(loadData.comment, 'v');
    const uuidInput = addFormField(transportSection, 'UUID CARTA PORTE', uuidValue, false);
    uuidInput.id = 'uuid-carta-porte';
    uuidInput.style.textTransform = 'uppercase';
    uuidInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['uuid-carta-porte'] = this.value;
    });
    consoleState.formValues['uuid-carta-porte'] = uuidValue;
    
    // Section 2: Operador
    const operadorSection = createSection('OPERADOR');
    
    // Sources for driver name
    const driverNameFromAppointment = loadData.driver_name || '';
    const driverNameFromComment = extractFromComment(loadData.comment, 'b') + ' ' + 
                                 extractFromComment(loadData.comment, 'c') + ' ' + 
                                 extractFromComment(loadData.comment, 'd') + ' ' + 
                                 extractFromComment(loadData.comment, 'e');
    
    const sourceContainer = document.createElement('div');
    sourceContainer.style = 'margin-bottom: 20px; padding: 10px; background-color: #e9ecef; border-radius: 4px;';
    
    const sourceLabel = document.createElement('label');
    sourceLabel.innerText = 'SELECCIONE FUENTE DE DATOS:';
    sourceLabel.style = 'display: block; font-weight: bold; margin-bottom: 10px;';
    
    const source1Container = document.createElement('div');
    source1Container.style = 'margin-bottom: 10px;';
    const source1Radio = document.createElement('input');
    source1Radio.type = 'radio';
    source1Radio.id = 'source1';
    source1Radio.name = 'driver-source';
    source1Radio.style = 'margin-right: 10px;';
    const source1Label = document.createElement('label');
    source1Label.htmlFor = 'source1';
    source1Label.innerText = 'NOMBRE EN CITA: ' + driverNameFromAppointment.toUpperCase();
    source1Container.appendChild(source1Radio);
    source1Container.appendChild(source1Label);
    
    const source2Container = document.createElement('div');
    source2Container.style = 'margin-bottom: 10px;';
    const source2Radio = document.createElement('input');
    source2Radio.type = 'radio';
    source2Radio.id = 'source2';
    source2Radio.name = 'driver-source';
    source2Radio.style = 'margin-right: 10px;';
    const source2Label = document.createElement('label');
    source2Label.htmlFor = 'source2';
    source2Label.innerText = 'NOMBRE EN COMENTARIO: ' + driverNameFromComment.trim().toUpperCase();
    source2Container.appendChild(source2Radio);
    source2Container.appendChild(source2Label);
    
    const source3Container = document.createElement('div');
    const source3Radio = document.createElement('input');
    source3Radio.type = 'radio';
    source3Radio.id = 'source3';
    source3Radio.name = 'driver-source';
    source3Radio.style = 'margin-right: 10px;';
    source3Radio.checked = true; // Default option
    const source3Label = document.createElement('label');
    source3Label.htmlFor = 'source3';
    source3Label.innerText = 'INGRESAR MANUALMENTE';
    source3Container.appendChild(source3Radio);
    source3Container.appendChild(source3Label);
    
    sourceContainer.appendChild(sourceLabel);
    sourceContainer.appendChild(source1Container);
    sourceContainer.appendChild(source2Container);
    sourceContainer.appendChild(source3Container);
    
    operadorSection.appendChild(sourceContainer);
    
    // Driver name fields
    const primerNombreInput = addFormField(operadorSection, 'PRIMER NOMBRE *', '', false);
    primerNombreInput.id = 'primer-nombre';
    primerNombreInput.required = true;
    primerNombreInput.style.textTransform = 'uppercase';
    
    const segundoNombreInput = addFormField(operadorSection, 'SEGUNDO NOMBRE', '', false);
    segundoNombreInput.id = 'segundo-nombre';
    segundoNombreInput.style.textTransform = 'uppercase';
    
    const primerApellidoInput = addFormField(operadorSection, 'PRIMER APELLIDO *', '', false);
    primerApellidoInput.id = 'primer-apellido';
    primerApellidoInput.required = true;
    primerApellidoInput.style.textTransform = 'uppercase';
    
    const segundoApellidoInput = addFormField(operadorSection, 'SEGUNDO APELLIDO', '', false);
    segundoApellidoInput.id = 'segundo-apellido';
    segundoApellidoInput.style.textTransform = 'uppercase';
    
    // Handle driver name source selection
    source1Radio.addEventListener('change', function() {
      if (this.checked) {
        const nameParts = driverNameFromAppointment.split(' ');
        primerNombreInput.value = cleanText(nameParts[0] || '');
        primerApellidoInput.value = cleanText(nameParts.slice(1).join(' ') || '');
        segundoNombreInput.value = '';
        segundoApellidoInput.value = '';
        
        consoleState.formValues['primer-nombre'] = primerNombreInput.value;
        consoleState.formValues['primer-apellido'] = primerApellidoInput.value;
        consoleState.formValues['segundo-nombre'] = '';
        consoleState.formValues['segundo-apellido'] = '';
      }
    });
    
    source2Radio.addEventListener('change', function() {
      if (this.checked) {
        primerNombreInput.value = cleanText(extractFromComment(loadData.comment, 'b'));
        segundoNombreInput.value = cleanText(extractFromComment(loadData.comment, 'c'));
        primerApellidoInput.value = cleanText(extractFromComment(loadData.comment, 'd'));
        segundoApellidoInput.value = cleanText(extractFromComment(loadData.comment, 'e'));
        
        consoleState.formValues['primer-nombre'] = primerNombreInput.value;
        consoleState.formValues['segundo-nombre'] = segundoNombreInput.value;
        consoleState.formValues['primer-apellido'] = primerApellidoInput.value;
        consoleState.formValues['segundo-apellido'] = segundoApellidoInput.value;
      }
    });
    
    source3Radio.addEventListener('change', function() {
      if (this.checked) {
        primerNombreInput.value = '';
        segundoNombreInput.value = '';
        primerApellidoInput.value = '';
        segundoApellidoInput.value = '';
        
        consoleState.formValues['primer-nombre'] = '';
        consoleState.formValues['segundo-nombre'] = '';
        consoleState.formValues['primer-apellido'] = '';
        consoleState.formValues['segundo-apellido'] = '';
      }
    });
    
    // Add event listeners for name fields
    primerNombreInput.addEventListener('input', function() {
      this.value = cleanText(this.value);
      consoleState.formValues['primer-nombre'] = this.value;
    });
    
    segundoNombreInput.addEventListener('input', function() {
      this.value = cleanText(this.value);
      consoleState.formValues['segundo-nombre'] = this.value;
    });
    
    primerApellidoInput.addEventListener('input', function() {
      this.value = cleanText(this.value);
      consoleState.formValues['primer-apellido'] = this.value;
    });
    
    segundoApellidoInput.addEventListener('input', function() {
      this.value = cleanText(this.value);
      consoleState.formValues['segundo-apellido'] = this.value;
    });
    
    // Driver phone number sources
    const phoneSourceContainer = document.createElement('div');
    phoneSourceContainer.style = 'margin-bottom: 20px; padding: 10px; background-color: #e9ecef; border-radius: 4px;';
    
    const phoneSourceLabel = document.createElement('label');
    phoneSourceLabel.innerText = 'SELECCIONE FUENTE DEL TELÉFONO:';
    phoneSourceLabel.style = 'display: block; font-weight: bold; margin-bottom: 10px;';
    
    const phoneSource1Container = document.createElement('div');
    phoneSource1Container.style = 'margin-bottom: 10px;';
    const phoneSource1Radio = document.createElement('input');
    phoneSource1Radio.type = 'radio';
    phoneSource1Radio.id = 'phone-source1';
    phoneSource1Radio.name = 'phone-source';
    phoneSource1Radio.style = 'margin-right: 10px;';
    const phoneSource1Label = document.createElement('label');
    phoneSource1Label.htmlFor = 'phone-source1';
    phoneSource1Label.innerText = 'TELÉFONO EN CITA: ' + (loadData.driver_cell_no || '').toUpperCase();
    phoneSource1Container.appendChild(phoneSource1Radio);
    phoneSource1Container.appendChild(phoneSource1Label);
    
    const phoneSource2Container = document.createElement('div');
    phoneSource2Container.style = 'margin-bottom: 10px;';
    const phoneSource2Radio = document.createElement('input');
    phoneSource2Radio.type = 'radio';
    phoneSource2Radio.id = 'phone-source2';
    phoneSource2Radio.name = 'phone-source';
    phoneSource2Radio.style = 'margin-right: 10px;';
    const commentPhone = extractFromComment(loadData.comment, 'f');
    const phoneSource2Label = document.createElement('label');
    phoneSource2Label.htmlFor = 'phone-source2';
    phoneSource2Label.innerText = 'TELÉFONO EN COMENTARIO: ' + commentPhone.toUpperCase();
    phoneSource2Container.appendChild(phoneSource2Radio);
    phoneSource2Container.appendChild(phoneSource2Label);
    
    const phoneSource3Container = document.createElement('div');
    const phoneSource3Radio = document.createElement('input');
    phoneSource3Radio.type = 'radio';
    phoneSource3Radio.id = 'phone-source3';
    phoneSource3Radio.name = 'phone-source';
    phoneSource3Radio.style = 'margin-right: 10px;';
    phoneSource3Radio.checked = true; // Default option
    const phoneSource3Label = document.createElement('label');
    phoneSource3Label.htmlFor = 'phone-source3';
    phoneSource3Label.innerText = 'INGRESAR MANUALMENTE';
    phoneSource3Container.appendChild(phoneSource3Radio);
    phoneSource3Container.appendChild(phoneSource3Label);
    
    phoneSourceContainer.appendChild(phoneSourceLabel);
    phoneSourceContainer.appendChild(phoneSource1Container);
    phoneSourceContainer.appendChild(phoneSource2Container);
    phoneSourceContainer.appendChild(phoneSource3Container);
    
    operadorSection.appendChild(phoneSourceContainer);
    
    // Phone number input
    const phoneInput = addFormField(operadorSection, 'TELÉFONO DEL OPERADOR *', '', false);
    phoneInput.id = 'telefono-operador';
    phoneInput.required = true;
    phoneInput.style.textTransform = 'uppercase';
    phoneInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
    });
    
    // Handle phone source selection
    phoneSource1Radio.addEventListener('change', function() {
      if (this.checked) {
        phoneInput.value = (loadData.driver_cell_no || '').toUpperCase();
        consoleState.formValues['telefono-operador'] = phoneInput.value;
      }
    });
    
    phoneSource2Radio.addEventListener('change', function() {
      if (this.checked) {
        phoneInput.value = commentPhone.toUpperCase();
        consoleState.formValues['telefono-operador'] = phoneInput.value;
      }
    });
    
    phoneSource3Radio.addEventListener('change', function() {
      if (this.checked) {
        phoneInput.value = '';
        consoleState.formValues['telefono-operador'] = '';
      }
    });
    
    phoneInput.addEventListener('input', function() {
      consoleState.formValues['telefono-operador'] = this.value;
    });
    
    // Additional driver fields
    const licenseInput = addFormField(operadorSection, 'NÚMERO DE LICENCIA', extractFromComment(loadData.comment, 'g'), false);
    licenseInput.id = 'numero-licencia';
    licenseInput.style.textTransform = 'uppercase';
    licenseInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['numero-licencia'] = this.value;
    });
    
    const ssnInput = addFormField(operadorSection, 'NÚMERO DE SEGURIDAD SOCIAL', extractFromComment(loadData.comment, 'h'), false);
    ssnInput.id = 'numero-seguridad-social';
    ssnInput.style.textTransform = 'uppercase';
    ssnInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['numero-seguridad-social'] = this.value;
    });
    
    const idInput = addFormField(operadorSection, 'NÚMERO DE INE O IDENTIFICACIÓN', extractFromComment(loadData.comment, 'id'), false);
    idInput.id = 'numero-ine';
    idInput.style.textTransform = 'uppercase';
    idInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['numero-ine'] = this.value;
    });
    
    const badgeInput = addFormField(operadorSection, 'NÚMERO DE GAFETE', extractFromComment(loadData.comment, 'ga'), false);
    badgeInput.id = 'numero-gafete';
    badgeInput.style.textTransform = 'uppercase';
    badgeInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['numero-gafete'] = this.value;
    });
    
    // NEW FIELD - NUMERO DE LOCALIZADOR
    const localizadorInput = addFormField(operadorSection, 'NÚMERO DE LOCALIZADOR', extractFromComment(loadData.comment, 'lo'), false);
    localizadorInput.id = 'numero-localizador';
    localizadorInput.style.textTransform = 'uppercase';
    localizadorInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['numero-localizador'] = this.value;
    });
    
    // Section 3: Tracto
    const tractoSection = createSection('TRACTO');
    
    const tractorNoInput = addFormField(tractoSection, 'NÚMERO ECONÓMICO DEL TRACTO *', extractFromComment(loadData.comment, 'i'), false);
    tractorNoInput.id = 'numero-economico-tracto';
    tractorNoInput.required = true;
    tractorNoInput.style.textTransform = 'uppercase';
    tractorNoInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['numero-economico-tracto'] = this.value;
    });
    
    const tractorPlateInput = addFormField(tractoSection, 'PLACA DEL TRACTO', extractFromComment(loadData.comment, 'j'), false);
    tractorPlateInput.id = 'placa-tracto';
    tractorPlateInput.style.textTransform = 'uppercase';
    tractorPlateInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['placa-tracto'] = this.value;
    });
    
    const tractorYearInput = addFormField(tractoSection, 'AÑO DEL TRACTO', extractFromComment(loadData.comment, 'k'), false);
    tractorYearInput.id = 'ano-tracto';
    tractorYearInput.style.textTransform = 'uppercase';
    tractorYearInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['ano-tracto'] = this.value;
    });
    
    const tractorModelInput = addFormField(tractoSection, 'MODELO DEL TRACTO', extractFromComment(loadData.comment, 'l'), false);
    tractorModelInput.id = 'modelo-tracto';
    tractorModelInput.style.textTransform = 'uppercase';
    tractorModelInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['modelo-tracto'] = this.value;
    });
    
    // Section 4: Remolque
    const remolqueSection = createSection('REMOLQUE');
    
    // Trailer type dropdown
    const trailerTypeLabel = document.createElement('label');
    trailerTypeLabel.innerText = 'TIPO REMOLQUE:';
    trailerTypeLabel.style = 'display: block; font-weight: bold; margin-bottom: 5px;';
    
    const trailerTypeSelect = document.createElement('select');
    trailerTypeSelect.id = 'tipo-remolque';
    trailerTypeSelect.style = 
      'width: 100%;' +
      'padding: 8px;' +
      'border: 1px solid #ced4da;' +
      'border-radius: 4px;' +
      'margin-bottom: 15px;' +
      'text-transform: uppercase;';  // Add text transform
    
    const trailerTypes = ['TRAILER', 'FRIGORIFICO', 'FULL', 'PIPAS', 'CONTENEDOR', 'OTRO'];
    trailerTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type.toLowerCase();
      option.innerText = type;
      trailerTypeSelect.appendChild(option);
    });
    
    trailerTypeSelect.addEventListener('change', function() {
      const showSecondTrailer = this.value === 'full';
      document.getElementById('second-trailer-section').style.display = showSecondTrailer ? 'block' : 'none';
      consoleState.formValues['tipo-remolque'] = this.value;
    });
    
    const trailerTypeContainer = document.createElement('div');
    trailerTypeContainer.appendChild(trailerTypeLabel);
    trailerTypeContainer.appendChild(trailerTypeSelect);
    remolqueSection.appendChild(trailerTypeContainer);
    
    // Trailer sources
    const trailerSourceContainer = document.createElement('div');
    trailerSourceContainer.style = 'margin-bottom: 20px; padding: 10px; background-color: #e9ecef; border-radius: 4px;';
    
    const trailerSourceLabel = document.createElement('label');
    trailerSourceLabel.innerText = 'SELECCIONE FUENTE DEL REMOLQUE:';
    trailerSourceLabel.style = 'display: block; font-weight: bold; margin-bottom: 10px;';
    
    const trailerSource1Container = document.createElement('div');
    trailerSource1Container.style = 'margin-bottom: 10px;';
    const trailerSource1Radio = document.createElement('input');
    trailerSource1Radio.type = 'radio';
    trailerSource1Radio.id = 'trailer-source1';
    trailerSource1Radio.name = 'trailer-source';
    trailerSource1Radio.style = 'margin-right: 10px;';
    const trailerSource1Label = document.createElement('label');
    trailerSource1Label.htmlFor = 'trailer-source1';
    trailerSource1Label.innerText = 'TRAILER EN CITA: ' + (loadData.trailer || '').toUpperCase();
    trailerSource1Container.appendChild(trailerSource1Radio);
    trailerSource1Container.appendChild(trailerSource1Label);
    
    const trailerSource2Container = document.createElement('div');
    trailerSource2Container.style = 'margin-bottom: 10px;';
    const trailerSource2Radio = document.createElement('input');
    trailerSource2Radio.type = 'radio';
    trailerSource2Radio.id = 'trailer-source2';
    trailerSource2Radio.name = 'trailer-source';
    trailerSource2Radio.style = 'margin-right: 10px;';
    const commentTrailer = extractFromComment(loadData.comment, 'm');
    const trailerSource2Label = document.createElement('label');
    trailerSource2Label.htmlFor = 'trailer-source2';
    trailerSource2Label.innerText = 'TRAILER EN COMENTARIO: ' + commentTrailer.toUpperCase();
    trailerSource2Container.appendChild(trailerSource2Radio);
    trailerSource2Container.appendChild(trailerSource2Label);
    
    const trailerSource3Container = document.createElement('div');
    const trailerSource3Radio = document.createElement('input');
    trailerSource3Radio.type = 'radio';
    trailerSource3Radio.id = 'trailer-source3';
    trailerSource3Radio.name = 'trailer-source';
    trailerSource3Radio.style = 'margin-right: 10px;';
    trailerSource3Radio.checked = true; // Default option
    const trailerSource3Label = document.createElement('label');
    trailerSource3Label.htmlFor = 'trailer-source3';
    trailerSource3Label.innerText = 'INGRESAR MANUALMENTE';
    trailerSource3Container.appendChild(trailerSource3Radio);
    trailerSource3Container.appendChild(trailerSource3Label);
    
    trailerSourceContainer.appendChild(trailerSourceLabel);
    trailerSourceContainer.appendChild(trailerSource1Container);
    trailerSourceContainer.appendChild(trailerSource2Container);
    trailerSourceContainer.appendChild(trailerSource3Container);
    
    remolqueSection.appendChild(trailerSourceContainer);
    
    // Trailer 1 fields
    const trailer1NoInput = addFormField(remolqueSection, 'NÚMERO ECONÓMICO DEL REMOLQUE 1 *', '', false);
    trailer1NoInput.id = 'numero-economico-remolque1';
    trailer1NoInput.required = true;
    trailer1NoInput.style.textTransform = 'uppercase';
    trailer1NoInput.addEventListener('input', function() {
      this.value = this.value.replace(/[^\w]/g, '').toUpperCase();
      consoleState.formValues['numero-economico-remolque1'] = this.value;
    });
    
    // Handle trailer source selection
    trailerSource1Radio.addEventListener('change', function() {
      if (this.checked) {
        trailer1NoInput.value = (loadData.trailer || '').replace(/[^\w]/g, '').toUpperCase();
        consoleState.formValues['numero-economico-remolque1'] = trailer1NoInput.value;
      }
    });
    
    trailerSource2Radio.addEventListener('change', function() {
      if (this.checked) {
        trailer1NoInput.value = commentTrailer.replace(/[^\w]/g, '').toUpperCase();
        consoleState.formValues['numero-economico-remolque1'] = trailer1NoInput.value;
      }
    });
    
    trailerSource3Radio.addEventListener('change', function() {
      if (this.checked) {
        trailer1NoInput.value = '';
        consoleState.formValues['numero-economico-remolque1'] = '';
      }
    });
    
    const trailer1PlateInput = addFormField(remolqueSection, 'PLACA DEL REMOLQUE 1', extractFromComment(loadData.comment, 'n'), false);
    trailer1PlateInput.id = 'placa-remolque1';
    trailer1PlateInput.style.textTransform = 'uppercase';
    trailer1PlateInput.addEventListener('input', function() {
      this.value = this.value.replace(/[^\w]/g, '').toUpperCase();
      consoleState.formValues['placa-remolque1'] = this.value;
    });
    
    const trailer1YearInput = addFormField(remolqueSection, 'AÑO DEL REMOLQUE 1', extractFromComment(loadData.comment, 'o'), false);
    trailer1YearInput.id = 'ano-remolque1';
    trailer1YearInput.style.textTransform = 'uppercase';
    trailer1YearInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['ano-remolque1'] = this.value;
    });
    
    const trailer1ModelInput = addFormField(remolqueSection, 'MODELO DEL REMOLQUE 1', extractFromComment(loadData.comment, 'p'), false);
    trailer1ModelInput.id = 'modelo-remolque1';
    trailer1ModelInput.style.textTransform = 'uppercase';
    trailer1ModelInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['modelo-remolque1'] = this.value;
    });
    
    // Trailer 2 section (for full type)
    const trailer2Section = document.createElement('div');
    trailer2Section.id = 'second-trailer-section';
    trailer2Section.style = 'border-top: 1px solid #ccc; padding-top: 15px; margin-top: 15px; display: none;';
    
    const trailer2Title = document.createElement('h4');
    trailer2Title.innerText = 'EN CASO DE FULL, REMOLQUE 2:';
    trailer2Title.style = 'margin-top: 0; margin-bottom: 15px;';
    
    trailer2Section.appendChild(trailer2Title);
    
    const trailer2NoInput = addFormField(trailer2Section, 'NÚMERO ECONÓMICO DEL REMOLQUE 2', extractFromComment(loadData.comment, 'q'), false);
    trailer2NoInput.id = 'numero-economico-remolque2';
    trailer2NoInput.style.textTransform = 'uppercase';
    trailer2NoInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['numero-economico-remolque2'] = this.value;
    });
    
    const trailer2PlateInput = addFormField(trailer2Section, 'PLACA DEL REMOLQUE 2', extractFromComment(loadData.comment, 'r'), false);
    trailer2PlateInput.id = 'placa-remolque2';
    trailer2PlateInput.style.textTransform = 'uppercase';
    trailer2PlateInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['placa-remolque2'] = this.value;
    });
    
    const trailer2YearInput = addFormField(trailer2Section, 'AÑO DEL REMOLQUE 2', extractFromComment(loadData.comment, 's'), false);
    trailer2YearInput.id = 'ano-remolque2';
    trailer2YearInput.style.textTransform = 'uppercase';
    trailer2YearInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['ano-remolque2'] = this.value;
    });
    
    const trailer2ModelInput = addFormField(trailer2Section, 'MODELO DEL REMOLQUE 2', extractFromComment(loadData.comment, 't'), false);
    trailer2ModelInput.id = 'modelo-remolque2';
    trailer2ModelInput.style.textTransform = 'uppercase';
    trailer2ModelInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['modelo-remolque2'] = this.value;
    });
    
    remolqueSection.appendChild(trailer2Section);
    
    // Section 5: Sellos
    const sellosSection = createSection('SELLOS');
    
    const seal1Input = addFormField(sellosSection, 'SELLO 1', extractFromComment(loadData.comment, 's1'), false);
    seal1Input.id = 'sello1';
    seal1Input.style.textTransform = 'uppercase';
    seal1Input.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['sello1'] = this.value;
    });
    
    const seal2Input = addFormField(sellosSection, 'SELLO 2', extractFromComment(loadData.comment, 's2'), false);
    seal2Input.id = 'sello2';
    seal2Input.style.textTransform = 'uppercase';
    seal2Input.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['sello2'] = this.value;
    });
    
    const seal3Input = addFormField(sellosSection, 'SELLO 3', extractFromComment(loadData.comment, 's3'), false);
    seal3Input.id = 'sello3';
    seal3Input.style.textTransform = 'uppercase';
    seal3Input.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['sello3'] = this.value;
    });
    
    const seal4Input = addFormField(sellosSection, 'SELLO 4', extractFromComment(loadData.comment, 's4'), false);
    seal4Input.id = 'sello4';
    seal4Input.style.textTransform = 'uppercase';
    seal4Input.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['sello4'] = this.value;
    });
    
    const seal5Input = addFormField(sellosSection, 'SELLO 5', extractFromComment(loadData.comment, 's5'), false);
    seal5Input.id = 'sello5';
    seal5Input.style.textTransform = 'uppercase';
    seal5Input.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['sello5'] = this.value;
    });
    
    const seal6Input = addFormField(sellosSection, 'SELLO 6', extractFromComment(loadData.comment, 's6'), false);
    seal6Input.id = 'sello6';
    seal6Input.style.textTransform = 'uppercase';
    seal6Input.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['sello6'] = this.value;
    });
    
    const seal7Input = addFormField(sellosSection, 'SELLO 7', extractFromComment(loadData.comment, 's7'), false);
    seal7Input.id = 'sello7';
    seal7Input.style.textTransform = 'uppercase';
    seal7Input.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['sello7'] = this.value;
    });
    
    const sharedInput = addFormField(sellosSection, 'FOLIO COMPARTIDO', extractFromComment(loadData.comment, 'z'), false);
    sharedInput.id = 'folio-compartido';
    sharedInput.style.textTransform = 'uppercase';
    sharedInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['folio-compartido'] = this.value;
    });
    
    const commentsInput = addFormField(sellosSection, 'COMENTARIOS DE SEGURIDAD', extractFromComment(loadData.comment, 'x'), false);
    commentsInput.id = 'comentarios-seguridad';
    commentsInput.style.textTransform = 'uppercase';
    commentsInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
      consoleState.formValues['comentarios-seguridad'] = this.value;
    });
    
    // Recommended Zone
    const recommendedZoneName = (recommendedZone?.name || '').toUpperCase();
    addFormField(sellosSection, 'ZONA RECOMENDADA', recommendedZoneName, true);
    
    // Submit button
    const submitContainer = document.createElement('div');
    submitContainer.style = 'text-align: center; margin-top: 30px;';
    
    const submitButton = document.createElement('button');
    submitButton.id = 'submit-arrival-button';
    submitButton.innerText = 'REPORTAR';
    submitButton.style = 
      'padding: 15px 40px;' +
      'background-color: #28a745;' +
      'color: white;' +
      'border: none;' +
      'border-radius: 4px;' +
      'font-size: 18px;' +
      'font-weight: bold;' +
      'cursor: pointer;';
    
    submitButton.addEventListener('click', submitArrival);
    
    submitContainer.appendChild(submitButton);
    
    // Add all sections to form container
    formContainer.appendChild(transportSection);
    formContainer.appendChild(operadorSection);
    formContainer.appendChild(tractoSection);
    formContainer.appendChild(remolqueSection);
    formContainer.appendChild(sellosSection);
    formContainer.appendChild(submitContainer);
    
    container.appendChild(formContainer);
    
    // Set default values for form
    consoleState.formValues = {
      'codigo-linea-real': realCarrierCodeValue,
      'nombre-linea-real': realCarrierName.toUpperCase(),
      'uuid-carta-porte': uuidValue,
      'tipo-remolque': 'trailer',
    };
  };
  
  // Helper function to create a form section
  const createSection = (title) => {
    const section = document.createElement('div');
    section.style = 'margin-bottom: 30px;';
    
    const sectionTitle = document.createElement('h3');
    sectionTitle.innerText = title;
    sectionTitle.style = 
      'padding-bottom: 8px;' +
      'border-bottom: 2px solid #1976D2;' +
      'margin-bottom: 20px;' +
      'color: #1976D2;';
    
    section.appendChild(sectionTitle);
    return section;
  };
  
  // Helper function to add form fields
  const addFormField = (container, label, value, readOnly) => {
    const fieldContainer = document.createElement('div');
    fieldContainer.style = 'margin-bottom: 15px;';
    
    const fieldLabel = document.createElement('label');
    fieldLabel.innerText = label;
    fieldLabel.style = 'display: block; font-weight: bold; margin-bottom: 5px;';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.readOnly = readOnly;
    input.style = 
      'width: 100%;' +
      'padding: 8px;' +
      'border: 1px solid #ced4da;' +
      'border-radius: 4px;' +
      'background-color: ' + (readOnly ? '#e9ecef' : 'white') + ';' +
      'text-transform: uppercase;';  // Add text transform for uppercase
    
    fieldContainer.appendChild(fieldLabel);
    fieldContainer.appendChild(input);
    container.appendChild(fieldContainer);
    
    return input;
  };
  
  // Function to submit the arrival data
  const submitArrival = async () => {
    const submitBtn = document.getElementById('submit-arrival-button');
    const originalBtnText = submitBtn.innerText;
    
    // Validate required fields
    const requiredFields = [
      { id: 'primer-nombre', label: 'Primer Nombre' },
      { id: 'primer-apellido', label: 'Primer Apellido' },
      { id: 'telefono-operador', label: 'Teléfono del Operador' },
      { id: 'numero-economico-tracto', label: 'Número Económico del Tracto' },
      { id: 'numero-economico-remolque1', label: 'Número Económico del Remolque 1' }
    ];
    
    let missingFields = [];
    requiredFields.forEach(field => {
      const input = document.getElementById(field.id);
      if (!input.value.trim()) {
        missingFields.push(field.label);
        input.style.borderColor = '#dc3545';
      } else {
        input.style.borderColor = '#ced4da';
      }
    });
    
    if (missingFields.length > 0) {
      alert('Por favor complete los campos obligatorios: ' + missingFields.join(', '));
      return;
    }
    
    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerText = 'PROCESANDO...';
    submitBtn.style.backgroundColor = '#6c757d';
    
    // Here we prepare the submission payload
    const { loadData, recommendedZone } = consoleState;
    
    // Construct the comment string with all the values from the form
    const comment = '<a>' +
      '<b>' + document.getElementById('primer-nombre').value.toUpperCase() + '</b>' +
      '<c>' + document.getElementById('segundo-nombre').value.toUpperCase() + '</c>' +
      '<d>' + document.getElementById('primer-apellido').value.toUpperCase() + '</d>' +
      '<e>' + document.getElementById('segundo-apellido').value.toUpperCase() + '</e>' +
      '<f>' + document.getElementById('telefono-operador').value.toUpperCase() + '</f>' +
      '<g>' + document.getElementById('numero-licencia').value.toUpperCase() + '</g>' +
      '<h>' + document.getElementById('numero-seguridad-social').value.toUpperCase() + '</h>' +
      '<i>' + document.getElementById('numero-economico-tracto').value.toUpperCase() + '</i>' +
      '<j>' + document.getElementById('placa-tracto').value.toUpperCase() + '</j>' +
      '<k>' + document.getElementById('ano-tracto').value.toUpperCase() + '</k>' +
      '<l>' + document.getElementById('modelo-tracto').value.toUpperCase() + '</l>' +
      '<m>' + document.getElementById('numero-economico-remolque1').value.toUpperCase() + '</m>' +
      '<n>' + document.getElementById('placa-remolque1').value.toUpperCase() + '</n>' +
      '<o>' + document.getElementById('ano-remolque1').value.toUpperCase() + '</o>' +
      '<p>' + document.getElementById('modelo-remolque1').value.toUpperCase() + '</p>' +
      '<q>' + (document.getElementById('numero-economico-remolque2')?.value.toUpperCase() || '') + '</q>' +
      '<r>' + (document.getElementById('placa-remolque2')?.value.toUpperCase() || '') + '</r>' +
      '<s>' + (document.getElementById('ano-remolque2')?.value.toUpperCase() || '') + '</s>' +
      '<t>' + (document.getElementById('modelo-remolque2')?.value.toUpperCase() || '') + '</t>' +
      '<u>' + document.getElementById('codigo-linea-real').value.toUpperCase() + '</u>' +
      '<v>' + document.getElementById('uuid-carta-porte').value.toUpperCase() + '</v>' +
      '<s1>' + document.getElementById('sello1').value.toUpperCase() + '</s1>' +
      '<s2>' + document.getElementById('sello2').value.toUpperCase() + '</s2>' +
      '<s3>' + document.getElementById('sello3').value.toUpperCase() + '</s3>' +
      '<s4>' + document.getElementById('sello4').value.toUpperCase() + '</s4>' +
      '<s5>' + document.getElementById('sello5').value.toUpperCase() + '</s5>' +
      '<s6>' + document.getElementById('sello6').value.toUpperCase() + '</s6>' +
      '<s7>' + document.getElementById('sello7').value.toUpperCase() + '</s7>' +
      '<z>' + document.getElementById('folio-compartido').value.toUpperCase() + '</z>' +
      '<x>' + document.getElementById('comentarios-seguridad').value.toUpperCase() + '</x>' +
      '<ga>' + document.getElementById('numero-gafete').value.toUpperCase() + '</ga>' +
      '<lo>' + document.getElementById('numero-localizador').value.toUpperCase() + '</lo>' +
      '<id>' + document.getElementById('numero-ine').value.toUpperCase() + '</id>' +
      '</a>';
    
    const assetStatus = loadData.service_type === "pickup" ? "empty" : "loaded";
    
    const payload = {
      "product_type": loadData.product_type || "-",
      "carrier": loadData.carrier,
      "expected_date": loadData.expected_date,
      "shipment_no": loadData.shipment_no,
      "comment": comment,
      "scheduled_time": loadData.scheduled_time,
      "uuid": loadData.uuid,
      "trailer": document.getElementById('numero-economico-remolque1').value.toUpperCase(),
      "appointment_time": loadData.scheduled_time,
      "load_type": loadData.load_type,
      "driver_cell_no": document.getElementById('telefono-operador').value.replace(/\s+/g, '').toUpperCase(),
      "section": loadData.section,
      "customer": loadData.customer,
      "reference_2": loadData.reference_2,
      "view_shipment_url": loadData.view_shipment_url,
      "license_plate_no": document.getElementById('placa-remolque1').value.toUpperCase(),
      "shipment_status": loadData.status,
      "section_name": loadData.section_name,
      "expected_shipment_date": loadData.expected_shipment_date,
      "reference_1": loadData.reference_1,
      "type": "arrival",
      "asset_type": document.getElementById('tipo-remolque').value,
      "site": "obregon",
      "site_name": "obregon",
      "gate_zone": "acceso 4",
      "to_site": "obregon",
      "name": document.getElementById('numero-economico-remolque1').value.toUpperCase(),
      "asset_status": assetStatus,
      "isExpectedArrival": true,
      "inspection_questions": [
        { "question": "defensa", "is_enabled": true },
        { "question": "motor", "is_enabled": true },
        { "question": "llantas", "is_enabled": true },
        { "question": "piso cabina", "is_enabled": true },
        { "question": "tanque combustible", "is_enabled": true },
        { "question": "cabina", "is_enabled": true },
        { "question": "suspension de aire", "is_enabled": true },
        { "question": "flecha embargue", "is_enabled": true },
        { "question": "quinta rueda", "is_enabled": true },
        { "question": "debajo de plataforma", "is_enabled": true },
        { "question": "puertas internas y externas", "is_enabled": true },
        { "question": "piso interior de la caja", "is_enabled": true },
        { "question": "paredes laterales interior y exterior", "is_enabled": true },
        { "question": "pared frontal", "is_enabled": true },
        { "question": "techo", "is_enabled": true },
        { "question": "escape", "is_enabled": true },
        { "question": "Agrícola: ausencia de plagas (vivas o muertas), de material orgánico (hongos, sangre, huesos, etc.) y de plantas o productos vegetales (frutas, semillas, etc.)", "is_enabled": true },
        { "question": "revision de sello", "is_enabled": true },
        { "question": "Cumple, NO es una unidad de refrigeración", "is_enabled": true },
        { "question": "Cumple, SI es una unidad de refrigeración", "is_enabled": false }
      ],
      "ble": [],
      "lora": [],
      "arrived_date": Date.now().toString(),
      "size": 53,
      "gate": "llegada",
      "first_name": document.getElementById('primer-nombre').value.toUpperCase(),
      "last_name": document.getElementById('primer-apellido').value.toUpperCase(),
      "assigned_location": recommendedZone?.name || "stg-03",
      "asset_class": "trailer",
      "cab_no": document.getElementById('numero-economico-tracto').value.toUpperCase(),
      "is_seal_updated": false,
      "is_reefer": false,
      "id": document.getElementById('numero-economico-remolque1').value.toUpperCase(),
      "assigned_location_name": recommendedZone?.name || "stg-03",
      "gate_name": "llegada4"
    };
    
    try {
      const response = await makeRequest('https://yard-visibility-na12.api.project44.com/v1/gate/console/trailer', 'POST', payload);
      
      if (response && response.status_code === 200) {
        // Success case
        const successMessage = document.createElement('div');
        successMessage.style = 
          'position: fixed;' +
          'top: 50%;' +
          'left: 50%;' +
          'transform: translate(-50%, -50%);' +
          'background-color: white;' +
          'padding: 30px;' +
          'border-radius: 8px;' +
          'box-shadow: 0 5px 15px rgba(0,0,0,0.3);' +
          'text-align: center;' +
          'z-index: 10001;';
        
        successMessage.innerHTML = 
          '<h2 style="color: #28a745; margin-top: 0;">¡ÉXITO!</h2>' +
          '<p style="font-size: 18px; margin: 10px 0 20px;">SE HA REGISTRADO CORRECTAMENTE EL ARRIBO DE LA UNIDAD.</p>' +
          '<div style="font-size: 60px; margin: 20px 0;">😊</div>' +
          '<button id="continue-btn" style="padding: 10px 20px; background-color: #1976D2; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;">CONTINUAR</button>';
        
        document.body.appendChild(successMessage);
        
        document.getElementById('continue-btn').addEventListener('click', () => {
          successMessage.remove();
          // Reset the form for a new search
          const modalContent = document.querySelector('#yard-arrival-console-modal > div:nth-child(2)');
          renderSearchForm(modalContent);
        });
      } else {
        throw new Error(response?.message || 'Error desconocido en la respuesta');
      }
    } catch (error) {
      console.error('Error submitting arrival:', error);
      alert('ERROR AL REPORTAR ARRIBO: ' + error.message.toUpperCase());
      
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.innerText = originalBtnText;
      submitBtn.style.backgroundColor = '#28a745';
    }
  };
  
  // Initialize the interceptors
  interceptXHR();
  interceptFetch();
  extractCookies();
  getTokenFromStorage();
  captureCookiesFromNetworkRequests();
  setupForcedCookieInjection();
  
  // Initialize the console
  createMainButton();
})();