// ==UserScript==
// @name        (Show IP) - Show information tooltips on various sites (mutation observer)
// @namespace   Violentmonkey Scripts
// @match       https://portal.azure.com/*
// @grant       none
// @version     2.0
// @author      chaoscreater
// @description 1/16/2024, 8:12:42 PM
// @downloadURL https://update.greasyfork.org/scripts/490879/%28Show%20IP%29%20-%20Show%20information%20tooltips%20on%20various%20sites%20%28mutation%20observer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/490879/%28Show%20IP%29%20-%20Show%20information%20tooltips%20on%20various%20sites%20%28mutation%20observer%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var ipAddress = ""; // Global variable

  // Cache for DOM elements to avoid repeated lookups
  var cache = {
    popupElement: null,
    contentDiv: null
  };

  async function fetchIPAddress() {
    try {
      // Only fetch once per session - use sessionStorage
      const cachedIP = sessionStorage.getItem('userScriptIPAddress');
      if (cachedIP) {
        ipAddress = cachedIP;
        console.log("Using cached IP:", ipAddress);
        if (document.querySelector(".ipaddress")) {
          document.querySelector(".ipaddress").textContent = ipAddress;
        }
        return ipAddress;
      }

      let response = await fetch("https://api64.ipify.org?format=json");
      let data = await response.json();

      ipAddress = data.ip;
      sessionStorage.setItem('userScriptIPAddress', ipAddress);
      console.log("Fetched IP:", ipAddress);
      if (document.querySelector(".ipaddress")) {
        document.querySelector(".ipaddress").textContent = ipAddress;
      }
      return ipAddress;
    } catch (error) {
      console.error("Error fetching IP:", error);
      return "Unable to fetch IP";
    }
  }

  function transformAzureUrl(currentUrl) {
    const url = new URL(currentUrl);
    const hash = url.hash;

    const parts = hash.split('/');
    const providersIndex = parts.indexOf('providers');

    if (providersIndex !== -1 && providersIndex + 1 < parts.length) {
      const providerPath = parts.slice(providersIndex + 1, providersIndex + 3).join('/');
      const encodedPath = encodeURIComponent(providerPath);
      return `https://portal.azure.com/#browse/${encodedPath}`;
    }

    return null;
  }

  function extractResourceType(url) {
    const parts = url.split('/');
    const providersIndex = parts.indexOf('providers');

    if (providersIndex !== -1 && parts.length > providersIndex + 3) {
      return parts[providersIndex + 1] + '/' + parts[providersIndex + 2];
    }
    return 'Resource';
  }

  function getContentHTML(currentUrl) {
    let contentHTML = '<strong>Shift + F</strong> : Filter by keyword<br><br>' +
      '<strong>CTRL+Shift + F</strong> : Filter by keyword and click on Load More<br><br>' +
      '<strong>CTRL+SHIFT+ L</strong> (hold CTRL+SHIFT while releasing L) to click on Load More<br><br>' +
      '<strong>CTRL+Shift + Z</strong> (hold CTRL+SHIFT while releasing Z) : Reset filter<br><br>' +
      'Great for checking Activity Logs, Sign-in logs or blobs in a Storage account container etc...' +
      '<br><br><strong>Public IP Address:</strong> ' + ipAddress + '<br><br><br>';

    // Add specific content based on the URL
    if (currentUrl.includes('Microsoft.Compute/virtualMachines')) {
      contentHTML += '<strong>B4ms 4 cores, 16GB RAM - </strong>~$122<br><br>' +
        '<strong><a href="https://portal.azure.com/#view/Microsoft_Azure_WVD/WvdManagerMenuBlade/~/hostpools">AVD</a></strong><br><br>';
    } else if (currentUrl.includes('#view/Microsoft_Azure_WVD/WvdManagerMenuBlade/')) {
      contentHTML += '<strong><a href="https://portal.azure.com/#browse/Microsoft.Compute%2FVirtualMachines">Virtual Machines</a></strong><br><br>';
    } else if (currentUrl.includes('Microsoft_Azure_Security_Insights')) {
      contentHTML += '<strong>$2/GB</strong><br><br>';
    } else if (currentUrl.includes('Microsoft.OperationalInsights/workspaces')) {
      contentHTML += '<strong>First 5GB free, then $2.30/GB</strong><br>';
    } else if (currentUrl.includes('Microsoft_AAD_ConditionalAccess')) {
      contentHTML += '<strong>$9.072/user/month</strong><br>';
    } else if (currentUrl.includes('Microsoft_Azure_Security')) {
      contentHTML += '<strong>~$22/item/month for Servers/AppService/SQL</strong><br>';
    } else if (currentUrl.includes('Microsoft.Storage')) {
      contentHTML += '<strong>Block Blob Storage, General Purpose V2, LRS, Hot Access - </strong>$2.60/GB<br>';
    } else if (currentUrl.includes('Microsoft.Network/firewallPolicies')) {
      contentHTML += '<strong>$151.20/policy/region</strong><br>';
    } else if (currentUrl.includes('Microsoft.Web')) {
      contentHTML += '<strong>$0.02548 - $3.948 per hour per instance per month</strong><br>' +
        '<strong>Azure Functions</strong> : $0.392 - $0.784 per million executions per month<br><br>';
    }

    // Add resource type link if on a resource page
    if (currentUrl.includes('portal.azure.com') && currentUrl.includes('/providers/') && !currentUrl.includes('Microsoft.Sql/servers/')) {
      const resourceType = extractResourceType(currentUrl);
      const newUrl = transformAzureUrl(currentUrl);
      if (newUrl) {
        contentHTML += `<strong><a href="${newUrl}">${resourceType}</a></strong><br><br>`;
      }
    }

    return contentHTML;
  }

  function createPopup() {
    // If popup already exists, remove it to avoid duplicates
    if (cache.popupElement) {
      removePopup();
    }

    // Create new popup
    var reminderDiv = document.createElement('div');
    reminderDiv.id = 'yourPopupId';

    var dragHandle = document.createElement('div');
    dragHandle.style.height = '20px';
    dragHandle.style.backgroundColor = '#ccc';
    dragHandle.style.cursor = 'move';
    dragHandle.innerHTML = 'Drag here';
    dragHandle.style.textAlign = 'center';
    reminderDiv.appendChild(dragHandle);

    var toggleButton = document.createElement('button');
    toggleButton.innerHTML = 'Show / Hide';
    toggleButton.style.marginTop = '10px';
    toggleButton.style.marginBottom = '10px';
    reminderDiv.appendChild(toggleButton);

    var contentDiv = document.createElement('div');
    contentDiv.innerHTML = getContentHTML(window.location.href);
    reminderDiv.appendChild(contentDiv);

    // Style the popup
    reminderDiv.style.position = 'fixed';
    reminderDiv.style.padding = '10px 10px 0px 10px';
    reminderDiv.style.backgroundColor = 'cyan';
    reminderDiv.style.border = '2px solid black';
    reminderDiv.style.zIndex = '10000';
    reminderDiv.style.width = localStorage.getItem('popupWidth_' + window.location.origin) || '290px';
    reminderDiv.style.maxWidth = '500px';
    reminderDiv.style.maxHeight = '900px';
    reminderDiv.style.wordWrap = 'break-word';
    reminderDiv.style.resize = 'both';
    reminderDiv.style.overflow = 'auto';
    reminderDiv.style.top = localStorage.getItem('popupTop_' + window.location.origin) || '50%';
    reminderDiv.style.left = localStorage.getItem('popupLeft_' + window.location.origin) || '10px';

    // Check visibility state from storage
    var isContentVisible = localStorage.getItem('isContentVisible_' + window.location.origin);
    if (isContentVisible === null) {
      isContentVisible = true;
    } else {
      isContentVisible = isContentVisible === 'true';
    }

    if (!isContentVisible) {
      contentDiv.style.display = 'none';
      reminderDiv.style.height = 'auto';
      localStorage.setItem('popupOriginalWidth_' + window.location.origin, reminderDiv.style.width);
      dragHandle.style.width = toggleButton.offsetWidth + 'px';
      reminderDiv.style.width = 'auto';
      dragHandle.style.width = '';
    }

    // Toggle button functionality
    toggleButton.addEventListener('click', function() {
      isContentVisible = !isContentVisible;
      localStorage.setItem('isContentVisible_' + window.location.origin, isContentVisible);

      if (!isContentVisible) {
        contentDiv.style.display = 'none';
        reminderDiv.style.height = 'auto';
        localStorage.setItem('popupOriginalWidth_' + window.location.origin, reminderDiv.style.width);
        dragHandle.style.width = toggleButton.offsetWidth + 'px';
        reminderDiv.style.width = 'auto';
      } else {
        contentDiv.style.display = 'block';
        reminderDiv.style.height = 'auto';
        reminderDiv.style.width = localStorage.getItem('popupOriginalWidth_' + window.location.origin);
        dragHandle.style.width = '';
      }
    });

    // Drag functionality - only use one set of event handlers
    dragHandle.addEventListener('mousedown', function(e) {
      const currentUrl = window.location.href;
      const needsAltKey = currentUrl.includes('https://portal.azure.com/#view/Microsoft_Azure_PIMCommon/ActivationMenuBlade/~/aadmigratedroles') || 
                          currentUrl.includes('/providers/Microsoft.Sql/servers');
      
      if (needsAltKey && !e.altKey) return;

      var offsetX = e.clientX - parseInt(window.getComputedStyle(reminderDiv).left);
      var offsetY = e.clientY - parseInt(window.getComputedStyle(reminderDiv).top);

      function mouseMoveHandler(e) {
        if (needsAltKey && !e.altKey) {
          mouseUpHandler();
          return;
        }
        reminderDiv.style.top = (e.clientY - offsetY) + 'px';
        reminderDiv.style.left = (e.clientX - offsetX) + 'px';
      }

      function mouseUpHandler() {
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
        localStorage.setItem('popupTop_' + window.location.origin, reminderDiv.style.top);
        localStorage.setItem('popupLeft_' + window.location.origin, reminderDiv.style.left);
      }

      window.addEventListener('mousemove', mouseMoveHandler);
      window.addEventListener('mouseup', mouseUpHandler);
    });

    document.body.appendChild(reminderDiv);

    // Calculate maximum allowable top and left positions
    var maxTop = window.innerHeight - reminderDiv.offsetHeight;
    var maxLeft = window.innerWidth - reminderDiv.offsetWidth;

    var storedTop = parseInt(localStorage.getItem('popupTop_' + window.location.origin)) || 0;
    var storedLeft = parseInt(localStorage.getItem('popupLeft_' + window.location.origin)) || 0;

    reminderDiv.style.top = Math.min(Math.max(storedTop, 80), maxTop) + 'px';
    reminderDiv.style.left = Math.min(Math.max(storedLeft, 0), maxLeft) + 'px';

    // Store a reference to the popup for reuse
    cache.popupElement = reminderDiv;
    cache.contentDiv = contentDiv;

    // Single resize event listener
    reminderDiv.addEventListener('mouseup', function() {
      if (isContentVisible) {
        localStorage.setItem('popupWidth_' + window.location.origin, reminderDiv.style.width);
        localStorage.setItem('popupHeight_' + window.location.origin, reminderDiv.style.height);
      }
    });

    return reminderDiv;
  }

  function removePopup() {
    if (cache.popupElement && cache.popupElement.parentNode) {
      cache.popupElement.parentNode.removeChild(cache.popupElement);
    }
    cache.popupElement = null;
    cache.contentDiv = null;
  }

  function updatePopupContent(currentUrl) {
    if (cache.contentDiv) {
      cache.contentDiv.innerHTML = getContentHTML(currentUrl);
    }
  }

  function displayPopup() {
    if (document.getElementById('yourPopupId')) {
      // Update the content of the existing popup
      updatePopupContent(window.location.href);
    } else {
      // Create a new popup
      createPopup();
    }
  }

  // URL change detection with a debounce mechanism
  let debounceTimer;
  let lastUrl = window.location.href;

  function handleUrlChange(mutationsList, observer) {
    const currentUrl = window.location.href;
    
    // Only process if URL has changed
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      
      // Clear previous timer
      clearTimeout(debounceTimer);
      
      // Set new timer
      debounceTimer = setTimeout(() => {
        updatePopupContent(currentUrl);
      }, 300); // 300ms debounce
    }
  }

  // Initialize
  fetchIPAddress().then(() => {
    // Create the initial popup with a delay
    setTimeout(() => {
      if (!document.getElementById('yourPopupId')) {
        displayPopup();
      }
    }, 2000);

    // Create a single mutation observer
    const observer = new MutationObserver(handleUrlChange);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: false // Reduce unnecessary triggers
    });

    // Clean up on page unload
    window.addEventListener('beforeunload', function() {
      observer.disconnect();
      removePopup();
    });
  });
})();