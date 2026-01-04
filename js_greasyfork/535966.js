// ==UserScript==
// @name         Numbeo City CSV Exporter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a button to export city data to CSV from Numbeo maps
// @match        https://www.numbeo.com/*/gmaps.jsp*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535966/Numbeo%20City%20CSV%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/535966/Numbeo%20City%20CSV%20Exporter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Create and style the button
  const button = document.createElement('button');
  button.textContent = 'Download CSV';
  Object.assign(button.style, {
    position: 'fixed',
    top: '10px',
    right: '10px',
    zIndex: 9999,
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  });
  document.body.appendChild(button);

  // Button click handler
  button.addEventListener('click', async () => {
    const waitForSelector = (selector, timeout = 5000) => {
      return new Promise((resolve, reject) => {
        const start = Date.now();
        const check = () => {
          const el = document.querySelector(selector);
          if (el) return resolve(el);
          if (Date.now() - start > timeout) return reject(new Error("Timeout waiting for selector: " + selector));
          requestAnimationFrame(check);
        };
        check();
      });
    };

    const markers = document.querySelectorAll('.leaflet-marker-icon.svg-icon.leaflet-zoom-animated.leaflet-interactive');
    const data = [];

    for (const marker of markers) {
      marker.click();
      try {
        const wrapper = await waitForSelector('.leaflet-popup-content-wrapper');
        const link = wrapper.querySelector('a');
        if (!link) continue;

        const text = link.textContent.trim();
        const parts = text.split(/\s{2,}/);
        if (parts.length !== 2) continue;

        const [location, valueStr] = parts;
        const [city, country] = location.split(',').map(s => s.trim());
        const value = parseFloat(valueStr);

        data.push({ city, country, value });
      } catch (e) {
        console.warn("Error processing marker:", e);
      }

      await new Promise(res => setTimeout(res, 300));
    }

    // Convert to CSV
    const csvContent = 'City,Country,Value\n' +
      data.map(d => `"${d.city}","${d.country}",${d.value}`).join('\n');

    // Correct section name from URL
    const section = window.location.pathname.split('/')[1] || 'data';
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const filename = `${section}-${today}.csv`;

    // Download the CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
})();
