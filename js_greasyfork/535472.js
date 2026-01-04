// ==UserScript==
// @name         Geocaching Trackable Map Visualizer
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  View your trackables on an interactive map. See where all your Geocaching trackables have been at a glance!
// @author       ViezeVingertjes
// @match        *://*.geocaching.com/track/search.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geocaching.com
// @grant        none
// @require      https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
// @resource     LEAFLET_CSS https://unpkg.com/leaflet@1.9.4/dist/leaflet.css
// @downloadURL https://update.greasyfork.org/scripts/535472/Geocaching%20Trackable%20Map%20Visualizer.user.js
// @updateURL https://update.greasyfork.org/scripts/535472/Geocaching%20Trackable%20Map%20Visualizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject Leaflet CSS
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(linkElement);

    console.log("Geocaching Trackable Page Enhancer script loaded!");

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
        const arrayContentString = match[1].slice(1, -1); // Remove outer brackets
        const objectRegex = /{[\s\S]*?}/g;
        const coordRegex = /ll\s*:\s*\[\s*([\d\.-]+)\s*,\s*([\d\.-]+)\s*\]/;
        const nameRegex = /n\s*:\s*"([^"]*)"/;
        let objectMatch;

        while ((objectMatch = objectRegex.exec(arrayContentString)) !== null) {
          const objectString = objectMatch[0];
          const coordMatch = objectString.match(coordRegex);
          const nameMatch = objectString.match(nameRegex);

          if (coordMatch && coordMatch[1] && coordMatch[2] && nameMatch && nameMatch[1]) {
            try {
              const lat = parseFloat(coordMatch[1]);
              const lon = parseFloat(coordMatch[2]);
              const name = nameMatch[1];
              stops.push({
                coordinates: [lat, lon],
                cacheName: name
              });
            } catch (e) {
              console.error(`Error parsing coordinates for trackable ${trackableId}:`, e);
            }
          } else {
            console.error(`Failed to extract data from object string for trackable ${trackableId}:`, objectString);
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

    // Add a global variable to track if processing is currently in progress
    let isProcessingTrackables = false;
    // Add a global variable to store the map instance
    let trackableMap = null;

    /**
     * Displays the trackable data on a map
     * @param {Array} trackables - Array of trackable objects with stops
     * @param {HTMLElement} [existingContainer] - Optional existing map container
     */
    function displayTrackablesMap(trackables, existingContainer) {
      // Filter trackables with stops
      const trackablesWithStops = trackables.filter(t => t.stops && t.stops.length > 0);

      if (trackablesWithStops.length === 0) {
        console.log('No trackables with stops to display on map');
        return;
      }

      // Sort trackables by number of stops (descending)
      trackablesWithStops.sort((a, b) => b.stops.length - a.stops.length);

      // Extract the last stop from each trackable
      const mapPoints = trackablesWithStops.map(trackable => {
        const lastStop = trackable.stops[trackable.stops.length - 1];
        return {
          trackableId: trackable.id,
          trackableName: trackable.name,
          cacheName: lastStop.cacheName,
          coordinates: lastStop.coordinates,
          totalStops: trackable.stops.length
        };
      });

      console.log('Map points for display:', mapPoints);

      // Group points by coordinates to combine markers at the same location
      const groupedPoints = {};
      mapPoints.forEach(point => {
        const coordKey = point.coordinates.join(',');
        if (!groupedPoints[coordKey]) {
          groupedPoints[coordKey] = {
            coordinates: point.coordinates,
            cacheName: point.cacheName, // Use the cache name from the first trackable at this location
            trackables: []
          };
        }
        groupedPoints[coordKey].trackables.push(point);
      });

      console.log('Grouped map points:', groupedPoints);

      // Convert back to array for display and sort by total number of trackables (descending)
      const combinedMapPoints = Object.values(groupedPoints);
      combinedMapPoints.sort((a, b) => b.trackables.length - a.trackables.length);

      // If we don't have a map instance, we can't proceed
      if (!trackableMap) {
        console.error('No map instance available');
        return;
      }

      // Remove any loading message
      const loadingControl = document.querySelector('.loading-message');
      if (loadingControl && loadingControl.parentNode) {
        loadingControl.parentNode.removeChild(loadingControl);
      }

      // Clear any existing markers
      trackableMap.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.Tooltip) {
          trackableMap.removeLayer(layer);
        }
      });

      // Calculate bounding box for all points
      let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;

      combinedMapPoints.forEach(point => {
        const [lat, lon] = point.coordinates;
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
      });

      // Add padding
      const latPadding = Math.max(0.05, (maxLat - minLat) * 0.1);
      const lonPadding = Math.max(0.05, (maxLon - minLon) * 0.1);

      minLat = Math.max(-85, minLat - latPadding);
      maxLat = Math.min(85, maxLat + latPadding);
      minLon = Math.max(-180, minLon - lonPadding);
      maxLon = Math.min(180, maxLon + lonPadding);

      // Fit the map to the bounds of all markers
      try {
        trackableMap.fitBounds([
          [minLat, minLon],
          [maxLat, maxLon]
        ]);
      } catch (e) {
        console.error('Error fitting map bounds:', e);
      }

      // Store markers for reference
      const markers = [];

      // Define a good palette of distinct colors
      const colorPalette = [
        '#e6194B', // Red
        '#3cb44b', // Green
        '#ffe119', // Yellow
        '#4363d8', // Blue
        '#f58231', // Orange
        '#911eb4', // Purple
        '#42d4f4', // Cyan
        '#f032e6', // Magenta
        '#bfef45', // Lime
        '#fabed4', // Pink
        '#469990', // Teal
        '#dcbeff', // Lavender
        '#9A6324', // Brown
        '#fffac8', // Beige
        '#800000', // Maroon
        '#aaffc3', // Mint
        '#808000', // Olive
        '#ffd8b1', // Apricot
        '#000075', // Navy
        '#a9a9a9', // Grey
        '#ffffff', // White
        '#000000'  // Black
      ];

      // Create a map to track used colors for cache names
      const cacheColorMap = new Map();
      // Track last used color index for round-robin assignment
      let lastColorIndex = -1;

      // Get a color ensuring no consecutive identical colors
      function getColorForCache(cacheName) {
        // If we already assigned a color to this cache, use it
        if (cacheColorMap.has(cacheName)) {
          return cacheColorMap.get(cacheName);
        }

        // Get the next color in round-robin fashion
        lastColorIndex = (lastColorIndex + 1) % colorPalette.length;

        // Find a different color if this would create consecutive same colors
        if (markers.length > 0) {
          const prevMarker = markers[markers.length - 1];
          const prevColor = getColorForCache(prevMarker.point.cacheName);

          // If colors would match, skip to next color
          if (colorPalette[lastColorIndex] === prevColor) {
            lastColorIndex = (lastColorIndex + 1) % colorPalette.length;
          }
        }

        const color = colorPalette[lastColorIndex];
        cacheColorMap.set(cacheName, color);
        return color;
      }

      // Add markers for each point
      combinedMapPoints.forEach((point, index) => {
        const [lat, lon] = point.coordinates;
        const trackables = point.trackables;
        const trackableCount = trackables.length;

        // Sort trackables at this location by number of stops (descending)
        trackables.sort((a, b) => b.totalStops - a.totalStops);

        // Get a color based on cache name
        const markerColor = getColorForCache(point.cacheName);

        // Create popup content with basic information
        let popupContent = `
          <div>
            <div style="font-weight: bold; margin-bottom: 5px;">${point.cacheName}</div>
            <div style="font-size: 12px; color: #666; margin-bottom: 8px;">Coordinates: ${lat.toFixed(6)}, ${lon.toFixed(6)}</div>
        `;

        if (trackables.length > 1) {
          popupContent += `<div style="font-weight: bold; margin-bottom: 8px; color: ${markerColor};">${trackables.length} Trackables at this Location</div>`;
        }

        // Add each trackable with simple formatting
        trackables.forEach((tb, i) => {
          popupContent += `
            <div style="margin-top: 8px; ${i > 0 ? 'border-top: 1px solid #eee; padding-top: 8px;' : ''}">
              <div style="font-weight: bold;">${i+1}. ${tb.trackableName}</div>
              ${tb.totalStops ? `<div style="font-size: 12px; color: #666;">Total stops: ${tb.totalStops}</div>` : ''}
              <div><a href="https://www.geocaching.com/track/details.aspx?id=${tb.trackableId}" target="_blank" style="color: #007bff; text-decoration: none;">View trackable details</a></div>
            </div>
          `;
        });

        popupContent += '</div>';

        // Create a colored marker for this point
        const markerIcon = L.divIcon({
          className: '',
          html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 12px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.4);"></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        const marker = L.marker([lat, lon], { icon: markerIcon }).addTo(trackableMap);

        // Add a label for the marker
        const labelText = point.cacheName + (trackables.length > 1 ? ` (${trackables.length})` : '');

        const label = L.tooltip({
          permanent: true,
          direction: 'top',
          className: 'trackable-marker-label',
          offset: [0, -12]
        })
        .setContent(labelText)
        .setLatLng([lat, lon]);

        label.addTo(trackableMap);

        // Bind popup to marker
        marker.bindPopup(popupContent);

        // Hide label when popup is open
        marker.on('popupopen', function() {
          trackableMap.removeLayer(label);
        });

        // Show label when popup is closed
        marker.on('popupclose', function() {
          label.addTo(trackableMap);
        });

        markers.push({
          marker,
          label,
          point
        });
      });

      // Update the legend
      const mapSection = existingContainer.closest('#gc-trackables-map-section');
      const legendContainer = mapSection ? mapSection.querySelector('#trackables-map-legend') : null;

      if (legendContainer) {
        // Get the content container
        const legendContent = document.getElementById('trackables-map-legend-content');
        if (!legendContent) return;

        // Clear any existing content
        legendContent.innerHTML = '';

        // Add entries for each marker/location
        markers.forEach((markerData, index) => {
          const { marker, point, label } = markerData;
          const trackables = point.trackables;

          // For each location, create a section
          const sectionContainer = document.createElement('div');
          sectionContainer.style.marginBottom = index < markers.length - 1 ? '10px' : '0';
          sectionContainer.style.paddingBottom = index < markers.length - 1 ? '10px' : '0';
          sectionContainer.style.borderBottom = index < markers.length - 1 ? '1px solid #eee' : 'none';

          // Location header
          const locationHeader = document.createElement('div');
          locationHeader.style.display = 'flex';
          locationHeader.style.alignItems = 'center';
          locationHeader.style.marginBottom = '5px';
          locationHeader.style.cursor = 'pointer';

          // Create color dot to match marker color
          const colorDot = document.createElement('span');
          colorDot.style.width = '16px';
          colorDot.style.height = '16px';
          colorDot.style.borderRadius = '50%';
          colorDot.style.backgroundColor = getColorForCache(point.cacheName);
          colorDot.style.display = 'inline-block';
          colorDot.style.marginRight = '8px';
          colorDot.style.border = '1px solid rgba(0,0,0,0.2)';

          locationHeader.appendChild(colorDot);

          // Location text
          let locationText;
          locationText = document.createElement('div');

          if (trackables.length === 1) {
            locationText.textContent = trackables[0].cacheName;
          } else {
            locationText.textContent = `${point.cacheName} (${trackables.length} trackables)`;
          }

          locationText.style.fontWeight = 'bold';
          locationHeader.appendChild(locationText);

          // Add click event to zoom to marker
          locationHeader.addEventListener('click', () => {
            trackableMap.setView(marker.getLatLng(), 15);

            // Slight delay to ensure map has completed moving before opening popup
            setTimeout(() => {
              marker.openPopup();
            }, 300);
          });

          // Add hover effect
          locationHeader.addEventListener('mouseenter', () => {
            locationHeader.style.backgroundColor = '#f0f0f0';
          });

          locationHeader.addEventListener('mouseleave', () => {
            locationHeader.style.backgroundColor = '';
          });

          sectionContainer.appendChild(locationHeader);

          // Add individual trackable items if there are multiple at this location
          if (trackables.length > 1) {
            const trackablesList = document.createElement('div');
            trackablesList.style.marginLeft = '24px';

            trackables.forEach((tb, i) => {
              const trackableItem = document.createElement('div');
              trackableItem.style.padding = '3px 0';
              trackableItem.style.fontSize = '12px';
              trackableItem.style.display = 'flex';
              trackableItem.style.alignItems = 'center';
              trackableItem.style.cursor = 'pointer';

              const bulletPoint = document.createElement('span');
              bulletPoint.textContent = '•';
              bulletPoint.style.marginRight = '5px';
              trackableItem.appendChild(bulletPoint);

              const tbName = document.createElement('span');
              tbName.innerHTML = `<span style="font-weight: bold;">${tb.trackableName}</span>${tb.totalStops ? ` (${tb.totalStops} stops)` : ''}`;
              trackableItem.appendChild(tbName);

              // Add click handler to open trackable page
              trackableItem.addEventListener('click', () => {
                window.open(`https://www.geocaching.com/track/details.aspx?id=${tb.trackableId}`, '_blank');
              });

              // Add hover effect
              trackableItem.addEventListener('mouseenter', () => {
                trackableItem.style.backgroundColor = '#f0f0f0';
                trackableItem.style.color = '#0066cc';
              });

              trackableItem.addEventListener('mouseleave', () => {
                trackableItem.style.backgroundColor = '';
                trackableItem.style.color = '';
              });

              trackablesList.appendChild(trackableItem);
            });

            sectionContainer.appendChild(trackablesList);
          } else if (trackables.length === 1) {
            // Make single trackable clickable too
            const tb = trackables[0];
            const trackableItem = document.createElement('div');
            trackableItem.style.marginLeft = '28px';
            trackableItem.style.fontSize = '12px';
            trackableItem.style.cursor = 'pointer';
            trackableItem.style.display = 'flex';
            trackableItem.style.alignItems = 'center';

            const bulletPoint = document.createElement('span');
            bulletPoint.textContent = '•';
            bulletPoint.style.marginRight = '5px';
            trackableItem.appendChild(bulletPoint);

            const tbName = document.createElement('span');
            tbName.innerHTML = `<span style="font-weight: bold;">${tb.trackableName}</span>${tb.totalStops ? ` (${tb.totalStops} stops)` : ''}`;
            trackableItem.appendChild(tbName);

            // Add click handler to open trackable page
            trackableItem.addEventListener('click', () => {
              window.open(`https://www.geocaching.com/track/details.aspx?id=${tb.trackableId}`, '_blank');
            });

            // Add hover effect
            trackableItem.addEventListener('mouseenter', () => {
              trackableItem.style.backgroundColor = '#f0f0f0';
              trackableItem.style.color = '#0066cc';
            });

            trackableItem.addEventListener('mouseleave', () => {
              trackableItem.style.backgroundColor = '';
              trackableItem.style.color = '';
            });

            sectionContainer.appendChild(trackableItem);
          }

          legendContent.appendChild(sectionContainer);
        });
      }
    }

    /**
     * Creates a map using Leaflet
     * @param {HTMLElement} container - The container to add the map to
     * @param {Array} points - The points to display on the map
     */
    function createSimpleMapWithMarkers(container, points) {
      if (!container || !points || points.length === 0) return;

      // Calculate bounding box for all points
      let minLat = 90;
      let maxLat = -90;
      let minLon = 180;
      let maxLon = -180;

      points.forEach(point => {
        const [lat, lon] = point.coordinates;
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
      });

      // Add padding
      const latPadding = Math.max(0.05, (maxLat - minLat) * 0.1);
      const lonPadding = Math.max(0.05, (maxLon - minLon) * 0.1);

      minLat = Math.max(-85, minLat - latPadding);
      maxLat = Math.min(85, maxLat + latPadding);
      minLon = Math.max(-180, minLon - lonPadding);
      maxLon = Math.min(180, maxLon + lonPadding);

      // Clear the container
      container.innerHTML = '';

      // Create map container for Leaflet
      const mapViewContainer = document.createElement('div');
      mapViewContainer.id = 'leaflet-map';
      mapViewContainer.style.width = '100%';
      mapViewContainer.style.height = '500px';
      mapViewContainer.style.border = '1px solid #ddd';
      mapViewContainer.style.borderRadius = '4px';
      container.appendChild(mapViewContainer);

      // Initialize the map
      const map = L.map('leaflet-map').fitBounds([
        [minLat, minLon],
        [maxLat, maxLon]
      ]);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      // Add custom CSS for marker labels
      const style = document.createElement('style');
      style.textContent = `
        .trackable-marker-label {
          background: white;
          border: 1px solid #333;
          border-radius: 4px;
          padding: 2px 6px;
          font-weight: bold;
          white-space: nowrap;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);

      // Store markers for reference
      const markers = [];

      // Define a good palette of distinct colors
      const colorPalette = [
        '#e6194B', // Red
        '#3cb44b', // Green
        '#ffe119', // Yellow
        '#4363d8', // Blue
        '#f58231', // Orange
        '#911eb4', // Purple
        '#42d4f4', // Cyan
        '#f032e6', // Magenta
        '#bfef45', // Lime
        '#fabed4', // Pink
        '#469990', // Teal
        '#dcbeff', // Lavender
        '#9A6324', // Brown
        '#fffac8', // Beige
        '#800000', // Maroon
        '#aaffc3', // Mint
        '#808000', // Olive
        '#ffd8b1', // Apricot
        '#000075', // Navy
        '#a9a9a9', // Grey
        '#ffffff', // White
        '#000000'  // Black
      ];

      // Create a map to track used colors for cache names
      const cacheColorMap = new Map();
      // Track last used color index for round-robin assignment
      let lastColorIndex = -1;

      // Get a color ensuring no consecutive identical colors
      function getColorForCache(cacheName) {
        // If we already assigned a color to this cache, use it
        if (cacheColorMap.has(cacheName)) {
          return cacheColorMap.get(cacheName);
        }

        // Get the next color in round-robin fashion
        lastColorIndex = (lastColorIndex + 1) % colorPalette.length;

        // Find a different color if this would create consecutive same colors
        if (markers.length > 0) {
          const prevMarker = markers[markers.length - 1];
          const prevColor = getColorForCache(prevMarker.point.cacheName);

          // If colors would match, skip to next color
          if (colorPalette[lastColorIndex] === prevColor) {
            lastColorIndex = (lastColorIndex + 1) % colorPalette.length;
          }
        }

        const color = colorPalette[lastColorIndex];
        cacheColorMap.set(cacheName, color);
        return color;
      }

      // Add markers for each point
      points.forEach((point, index) => {
        const [lat, lon] = point.coordinates;
        const trackables = point.trackables;
        const trackableCount = trackables.length;

        // Sort trackables at this location by number of stops (descending)
        trackables.sort((a, b) => b.totalStops - a.totalStops);

        // Get a color based on cache name hash for better distribution
        const markerColor = getColorForCache(point.cacheName);

        // Create popup content with basic information
        let popupContent = `
          <div>
            <div style="font-weight: bold; margin-bottom: 5px;">${point.cacheName}</div>
            <div style="font-size: 12px; color: #666; margin-bottom: 8px;">Coordinates: ${lat.toFixed(6)}, ${lon.toFixed(6)}</div>
        `;

        if (trackables.length > 1) {
          popupContent += `<div style="font-weight: bold; margin-bottom: 8px; color: ${markerColor};">${trackables.length} Trackables at this Location</div>`;
        }

        // Add each trackable with simple formatting
        trackables.forEach((tb, i) => {
          popupContent += `
            <div style="margin-top: 8px; ${i > 0 ? 'border-top: 1px solid #eee; padding-top: 8px;' : ''}">
              <div style="font-weight: bold;">${i+1}. ${tb.trackableName}</div>
              ${tb.totalStops ? `<div style="font-size: 12px; color: #666;">Total stops: ${tb.totalStops}</div>` : ''}
              <div><a href="https://www.geocaching.com/track/details.aspx?id=${tb.trackableId}" target="_blank" style="color: #007bff; text-decoration: none;">View trackable details</a></div>
            </div>
          `;
        });

        popupContent += '</div>';

        // Create a colored marker for this point
        const markerIcon = L.divIcon({
          className: '',
          html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 12px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.4);"></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        const marker = L.marker([lat, lon], { icon: markerIcon }).addTo(map);

        // Add a label for the marker
        const labelText = trackables.length === 1 ?
          point.cacheName + (trackables.length > 1 ? ` (${trackables.length})` : '') :
          `${point.cacheName} (${trackables.length})`;

        const label = L.tooltip({
          permanent: true,
          direction: 'top',
          className: 'trackable-marker-label',
          offset: [0, -12]
        })
        .setContent(labelText)
        .setLatLng([lat, lon]);

        label.addTo(map);

        // Bind popup to marker
        marker.bindPopup(popupContent);

        // Hide label when popup is open
        marker.on('popupopen', function() {
          map.removeLayer(label);
        });

        // Show label when popup is closed
        marker.on('popupclose', function() {
          label.addTo(map);
        });

        markers.push({
          marker,
          label,
          point
        });
      });

      // Find the legend container - should be a sibling of our map container
      const mapSection = container.closest('#gc-trackables-map-section');
      const legendContainer = mapSection ? mapSection.querySelector('#trackables-map-legend') : null;

      if (legendContainer) {
        // Get the content container
        const legendContent = document.getElementById('trackables-map-legend-content');
        if (!legendContent) return;

        // Clear any existing content
        legendContent.innerHTML = '';

        // Add entries for each marker/location
        markers.forEach((markerData, index) => {
          const { marker, point, label } = markerData;
          const trackables = point.trackables;
          const trackableCount = trackables.length;

          // For each location, create a section
          const sectionContainer = document.createElement('div');
          sectionContainer.style.marginBottom = index < markers.length - 1 ? '10px' : '0';
          sectionContainer.style.paddingBottom = index < markers.length - 1 ? '10px' : '0';
          sectionContainer.style.borderBottom = index < markers.length - 1 ? '1px solid #eee' : 'none';

          // Location header
          const locationHeader = document.createElement('div');
          locationHeader.style.display = 'flex';
          locationHeader.style.alignItems = 'center';
          locationHeader.style.marginBottom = '5px';
          locationHeader.style.cursor = 'pointer';

          // Create color dot to match marker color
          const colorDot = document.createElement('span');
          colorDot.style.width = '16px';
          colorDot.style.height = '16px';
          colorDot.style.borderRadius = '50%';
          colorDot.style.backgroundColor = getColorForCache(point.cacheName);
          colorDot.style.display = 'inline-block';
          colorDot.style.marginRight = '8px';
          colorDot.style.border = '1px solid rgba(0,0,0,0.2)';

          locationHeader.appendChild(colorDot);

          // Location text
          let locationText;
          locationText = document.createElement('div');

          if (trackables.length === 1) {
            locationText.textContent = trackables[0].cacheName;
          } else {
            locationText.textContent = `${point.cacheName} (${trackables.length} trackables)`;
          }

          locationText.style.fontWeight = 'bold';
          locationHeader.appendChild(locationText);

          // Add click event to zoom to marker
          locationHeader.addEventListener('click', () => {
            map.setView(marker.getLatLng(), 15);

            // Slight delay to ensure map has completed moving before opening popup
            setTimeout(() => {
              marker.openPopup();
            }, 300);
          });

          // Add hover effect
          locationHeader.addEventListener('mouseenter', () => {
            locationHeader.style.backgroundColor = '#f0f0f0';
          });

          locationHeader.addEventListener('mouseleave', () => {
            locationHeader.style.backgroundColor = '';
          });

          sectionContainer.appendChild(locationHeader);

          // Add individual trackable items if there are multiple at this location
          if (trackables.length > 1) {
            const trackablesList = document.createElement('div');
            trackablesList.style.marginLeft = '24px';

            trackables.forEach((tb, i) => {
              const trackableItem = document.createElement('div');
              trackableItem.style.padding = '3px 0';
              trackableItem.style.fontSize = '12px';
              trackableItem.style.display = 'flex';
              trackableItem.style.alignItems = 'center';
              trackableItem.style.cursor = 'pointer';

              const bulletPoint = document.createElement('span');
              bulletPoint.textContent = '•';
              bulletPoint.style.marginRight = '5px';
              trackableItem.appendChild(bulletPoint);

              const tbName = document.createElement('span');
              tbName.innerHTML = `<span style="font-weight: bold;">${tb.trackableName}</span>${tb.totalStops ? ` (${tb.totalStops} stops)` : ''}`;
              trackableItem.appendChild(tbName);

              // Add click handler to open trackable page
              trackableItem.addEventListener('click', () => {
                window.open(`https://www.geocaching.com/track/details.aspx?id=${tb.trackableId}`, '_blank');
              });

              // Add hover effect
              trackableItem.addEventListener('mouseenter', () => {
                trackableItem.style.backgroundColor = '#f0f0f0';
                trackableItem.style.color = '#0066cc';
              });

              trackableItem.addEventListener('mouseleave', () => {
                trackableItem.style.backgroundColor = '';
                trackableItem.style.color = '';
              });

              trackablesList.appendChild(trackableItem);
            });

            sectionContainer.appendChild(trackablesList);
          } else if (trackables.length === 1) {
            // Make single trackable clickable too
            const tb = trackables[0];
            const trackableItem = document.createElement('div');
            trackableItem.style.marginLeft = '28px';
            trackableItem.style.fontSize = '12px';
            trackableItem.style.cursor = 'pointer';
            trackableItem.style.display = 'flex';
            trackableItem.style.alignItems = 'center';

            const bulletPoint = document.createElement('span');
            bulletPoint.textContent = '•';
            bulletPoint.style.marginRight = '5px';
            trackableItem.appendChild(bulletPoint);

            const tbName = document.createElement('span');
            tbName.innerHTML = `<span style="font-weight: bold;">${tb.trackableName}</span>${tb.totalStops ? ` (${tb.totalStops} stops)` : ''}`;
            trackableItem.appendChild(tbName);

            // Add click handler to open trackable page
            trackableItem.addEventListener('click', () => {
              window.open(`https://www.geocaching.com/track/details.aspx?id=${tb.trackableId}`, '_blank');
            });

            // Add hover effect
            trackableItem.addEventListener('mouseenter', () => {
              trackableItem.style.backgroundColor = '#f0f0f0';
              trackableItem.style.color = '#0066cc';
            });

            trackableItem.addEventListener('mouseleave', () => {
              trackableItem.style.backgroundColor = '';
              trackableItem.style.color = '';
            });

            sectionContainer.appendChild(trackableItem);
          }

          legendContent.appendChild(sectionContainer);
        });
      }
    }

    // Function to safely inject the map container into the page
    function safelyInjectMap() {
      // First, identify the main container and the search panel
      const pageWrapper = document.querySelector('#Content, #content, .Content');

      if (!pageWrapper) {
        console.error('Could not find main content wrapper');
        return null;
      }

      // Clear any existing map we might have added before
      const existingMap = document.getElementById('gc-trackables-map-section');
      if (existingMap) {
        existingMap.remove();
      }

      // Create our map container with a distinctive ID
      const mapSection = document.createElement('div');
      mapSection.id = 'gc-trackables-map-section';
      mapSection.style.width = '100%';
      mapSection.style.clear = 'both';
      mapSection.style.position = 'relative';
      mapSection.style.margin = '20px 0';
      mapSection.style.padding = '0';
      mapSection.style.backgroundColor = '#fff';
      mapSection.style.boxSizing = 'border-box';

      // Add title
      const mapTitle = document.createElement('h3');
      mapTitle.textContent = 'Trackable Locations Map';
      mapTitle.style.margin = '0 0 10px 0';
      mapTitle.style.padding = '0';
      mapTitle.style.fontSize = '16px';
      mapTitle.style.fontWeight = 'bold';
      mapSection.appendChild(mapTitle);

      // Create map container
      const mapContainer = document.createElement('div');
      mapContainer.id = 'trackables-map-container';
      mapContainer.style.width = '100%';
      mapContainer.style.height = '500px';
      mapContainer.style.border = '1px solid #ddd';
      mapContainer.style.borderRadius = '4px';
      mapContainer.style.marginBottom = '10px';
      mapContainer.style.boxSizing = 'border-box';
      mapSection.appendChild(mapContainer);

      // Create legend container that will be filled by the map creation function
      const legendContainer = document.createElement('div');
      legendContainer.id = 'trackables-map-legend';
      legendContainer.style.marginTop = '10px';
      legendContainer.style.width = '100%';
      legendContainer.style.boxSizing = 'border-box';
      legendContainer.style.border = '1px solid #eee';
      legendContainer.style.borderRadius = '4px';
      legendContainer.style.backgroundColor = '#fff';

      // Create collapsible header for legend
      const legendHeader = document.createElement('div');
      legendHeader.style.padding = '10px';
      legendHeader.style.borderBottom = '1px solid #eee';
      legendHeader.style.display = 'flex';
      legendHeader.style.alignItems = 'center';
      legendHeader.style.justifyContent = 'space-between';
      legendHeader.style.cursor = 'pointer';

      // Create title text
      const headerText = document.createElement('div');
      headerText.textContent = 'Trackables';
      headerText.style.fontWeight = 'bold';
      headerText.style.fontSize = '14px';

      // Create arrow indicator
      const arrowIndicator = document.createElement('div');
      arrowIndicator.innerHTML = '&#9650;'; // Up arrow (collapsed)
      arrowIndicator.style.transition = 'transform 0.3s';
      arrowIndicator.style.fontSize = '12px';

      // Append elements to header
      legendHeader.appendChild(headerText);
      legendHeader.appendChild(arrowIndicator);
      legendContainer.appendChild(legendHeader);

      // Create content container for the legend
      const legendContent = document.createElement('div');
      legendContent.id = 'trackables-map-legend-content';
      legendContent.style.padding = '10px';
      legendContent.style.display = 'none'; // Hidden by default
      legendContent.style.maxHeight = 'none';
      legendContent.style.overflowY = 'visible';
      legendContainer.appendChild(legendContent);

      // Add click event to toggle legend visibility
      legendHeader.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const isVisible = legendContent.style.display !== 'none';
        legendContent.style.display = isVisible ? 'none' : 'block';
        arrowIndicator.innerHTML = isVisible ? '&#9650;' : '&#9660;'; // Up arrow when closed, down arrow when open

        return false;
      });

      mapSection.appendChild(legendContainer);

      // Look for the best insertion point
      let inserted = false;

      // Method 1: Try to find common table containers
      const tableContainers = Array.from(document.querySelectorAll('.Table, table, .table-container'));
      for (const table of tableContainers) {
        // Only consider visible tables
        if (isElementVisible(table)) {
          const tableParent = table.parentNode;

          // Insert before the table
          tableParent.insertBefore(mapSection, table);
          inserted = true;
          break;
        }
      }

      // Method 2: If we couldn't find a table, try to find section headings
      if (!inserted) {
        const sectionHeadings = Array.from(document.querySelectorAll('h1, h2, h3'));
        for (const heading of sectionHeadings) {
          // Look for headings related to trackables or search
          const headingText = heading.textContent.toLowerCase();
          if ((headingText.includes('trackable') || headingText.includes('search')) && isElementVisible(heading)) {
            // Insert after the heading
            if (heading.nextSibling) {
              heading.parentNode.insertBefore(mapSection, heading.nextSibling);
            } else {
              heading.parentNode.appendChild(mapSection);
            }
            inserted = true;
            break;
          }
        }
      }

      // Method 3: Last resort - insert at top of content area
      if (!inserted) {
        // Insert at the beginning of the content area
        if (pageWrapper.firstChild) {
          pageWrapper.insertBefore(mapSection, pageWrapper.firstChild);
        } else {
          pageWrapper.appendChild(mapSection);
        }
      }

      // Initialize the empty map
      const mapViewContainer = document.createElement('div');
      mapViewContainer.id = 'leaflet-map';
      mapViewContainer.style.width = '100%';
      mapViewContainer.style.height = '500px';
      mapViewContainer.style.border = '1px solid #ddd';
      mapViewContainer.style.borderRadius = '4px';
      mapContainer.appendChild(mapViewContainer);

      // Initialize the map with a default view (world map)
      try {
        // Create a new map instance
        trackableMap = L.map('leaflet-map').setView([20, 0], 2);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18
        }).addTo(trackableMap);

        // Add "Loading trackables..." message
        const loadingMessage = L.control({position: 'bottomleft'});
        loadingMessage.onAdd = function(map) {
          const div = L.DomUtil.create('div', 'loading-message');
          div.innerHTML = '<div style="background-color: white; padding: 5px 10px; border-radius: 4px; border: 1px solid #ccc; font-weight: bold;">Loading trackable data...</div>';
          return div;
        };
        loadingMessage.addTo(trackableMap);
      } catch (e) {
        console.error('Error initializing map:', e);
      }

      // Add custom CSS for marker labels
      const style = document.createElement('style');
      style.textContent = `
        .trackable-marker-label {
          background: white;
          border: 1px solid #333;
          border-radius: 4px;
          padding: 2px 6px;
          font-weight: bold;
          white-space: nowrap;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);

      return mapContainer;
    }

    // Find trackables on the page and process them
    async function processTrackables() {
      // Prevent concurrent processing
      if (isProcessingTrackables) {
        console.log('Already processing trackables, skipping duplicate call');
        return;
      }

      isProcessingTrackables = true;

      try {
        // Create and inject map container first before processing data
        const mapContainer = safelyInjectMap();

        // Extract trackables
        const trackablesMap = extractTrackablesFromPage();
        console.log(`Found ${trackablesMap.size} trackables on page`);

        if (trackablesMap.size === 0) {
          console.log('No trackables found on page');
          // Update the map with a "No trackables" message
          if (trackableMap) {
            // Remove any loading message
            const loadingControl = document.querySelector('.loading-message');
            if (loadingControl && loadingControl.parentNode) {
              loadingControl.parentNode.removeChild(loadingControl);
            }

            const noDataMessage = L.control({position: 'bottomleft'});
            noDataMessage.onAdd = function(map) {
              const div = L.DomUtil.create('div', 'no-data-message');
              div.innerHTML = '<div style="background-color: white; padding: 5px 10px; border-radius: 4px; border: 1px solid #ccc;">No trackable location data available</div>';
              return div;
            };
            noDataMessage.addTo(trackableMap);
          }
          isProcessingTrackables = false;
          return;
        }

        const trackables = Array.from(trackablesMap.values());
        console.log('Trackables found:', trackables);

        // Enrich trackables with stop data
        const enrichedTrackables = await enrichTrackablesWithStops(trackables);

        // Display on map
        displayTrackablesMap(enrichedTrackables, mapContainer);
      } catch (error) {
        console.error('Error in processTrackables:', error);
      } finally {
        // Always reset the processing flag
        isProcessingTrackables = false;
      }
    }

    // Run on page load and after AJAX content updates
    setTimeout(processTrackables, 1000);

    // Track if the map has been added to the page
    let mapAdded = false;

    // Create a MutationObserver to watch for content changes
    const observer = new MutationObserver(function(mutations) {
      // Don't trigger if we're already processing or if we created the map element
      if (isProcessingTrackables || mapAdded) return;

      let shouldReprocess = false;

      // Check if any mutations affect our elements of interest (trackable links)
      for (const mutation of mutations) {
        // Skip mutations caused by our own map
        if (mutation.target.id === 'gc-trackables-map-section' ||
            mutation.target.closest('#gc-trackables-map-section')) {
          continue;
        }

        // Skip mutations that don't add nodes - we only care about content being added
        if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) {
          continue;
        }

        // Look for relevant data tables or trackable links
        if (mutation.target.classList.contains('Table') ||
            mutation.target.querySelector('.Table') ||
            mutation.target.querySelector('a[href*="track/details.aspx"]')) {
          shouldReprocess = true;
          break;
        }
      }

      if (shouldReprocess) {
        console.log('Content changed, reprocessing trackables');
        processTrackables().finally(() => {
          mapAdded = true;

          // Disconnect observer after first successful map creation to prevent further updates
          // This prevents repeated refreshing while still allowing the initial map to be created
          observer.disconnect();
        });
      }
    });

    // Start observing with configuration
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
})();