// ==UserScript==
// @name         Overlay Gulf of Mexico label on Google Maps
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Restore the Gulf of Mexico to its original name in Google Maps.
// @author       You
// @match        https://www.google.com/maps/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542227/Overlay%20Gulf%20of%20Mexico%20label%20on%20Google%20Maps.user.js
// @updateURL https://update.greasyfork.org/scripts/542227/Overlay%20Gulf%20of%20Mexico%20label%20on%20Google%20Maps.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ——— UNIVERSAL REPLACER ———
  function replaceLabels(root) {
    // 1) ARIA labels
    root.querySelectorAll('[aria-label]').forEach(el => {
      const aria = el.getAttribute('aria-label');
      if (aria.includes('Gulf of America')) {
        el.setAttribute(
          'aria-label',
          aria.replace(/Gulf of America/g, 'Gulf of Mexico')
        );
      }
    });

    // 2) Text nodes everywhere
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node;
    while (node = walker.nextNode()) {
      if (node.nodeValue.includes('Gulf of America')) {
        node.nodeValue = node.nodeValue.replace(
          /Gulf of America/g,
          'Gulf of Mexico'
        );
      }
    }
  }

  // run once on page load (in case you already have a popup open)
  replaceLabels(document);

    // === catch both new nodes AND text-only updates ===
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      // newly injected nodes
      for (const node of m.addedNodes) {
        if (node.nodeType === 1) replaceLabels(node);
      }
      // in-place text changes
      if (m.type === 'characterData') {
        const txt = m.target.nodeValue;
        if (txt && txt.includes('Gulf of America')) {
          m.target.nodeValue = txt.replace(/Gulf of America/g, 'Gulf of Mexico');
        }
      }
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // === also re-run on marker hover ===
  document.body.addEventListener('mouseover', e => {
    if (e.target.classList.contains('ET197e')) {
      // slight delay to let Google finish drawing
      setTimeout(() => replaceLabels(document), 50);
    }
  });


  // watch for any new DOM nodes (when you click somewhere, Google injects the popup)
  new MutationObserver(mutations => {
    for (let m of mutations) {
      for (let node of m.addedNodes) {
        if (node.nodeType === 1) {
          replaceLabels(node);
        }
      }
    }
  }).observe(document.body, {
    childList: true,
    subtree: true
  });

  const DEFAULT = {
    lat:            24.745124,
    lng:           -91.737921,
    backgroundColor: 'rgb(114, 212, 232)',
    fontSize:       '12px'
  };

  const coordsMap = [
    { zoom: 2, lat: 24.941090, lng: -90.102396, backgroundColor: 'rgb(109, 212, 232)', fontSize: '12px' },
    { zoom: 3, lat: 24.941090, lng: -90.102396, backgroundColor: 'rgb(109, 212, 232)', fontSize: '12px' },
    { zoom: 4, lat: 24.501996, lng: -90.058450, backgroundColor: 'rgb(109, 212, 232)', fontSize: '12px' },
    { zoom: 5, lat: 24.786898, lng: -90.065263, backgroundColor: 'rgb(114, 212, 232)', fontSize: '12px' },
    { zoom: 6, lat: 25.100375, lng: -90.014505, backgroundColor: 'rgb(121, 212, 232)', fontSize: '12px' },
    { zoom: 7, lat: 25.189882, lng: -90.047464, backgroundColor: 'rgb(127, 215, 235)', fontSize: '12px' },
    { zoom: 8, lat: 25.239890, lng: -90.065263, backgroundColor: 'rgb(131, 214, 235)', fontSize: '12px' },
    { zoom: 9, lat: 25.272183, lng: -90.061959, backgroundColor: 'rgb(138, 217, 237)', fontSize: '12px' },
    { zoom: 10, lat: 25.290499, lng: -90.063943, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 11, lat: 25.296707, lng: -90.066003, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 12, lat: 25.300121, lng: -90.066003, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 13, lat: 25.301983, lng: -90.065832, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 14, lat: 25.303225, lng: -90.06583, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 15, lat: 25.303225, lng: -90.06583, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 16, lat: 25.303225, lng: -90.06583, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 17, lat: 25.303225, lng: -90.06583, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 18, lat: 25.303225, lng: -90.06583, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 19, lat: 25.303225, lng: -90.06583, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 20, lat: 25.303225, lng: -90.06583, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 21, lat: 25.303225, lng: -90.06583, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
  ];

  function getEntryForZoom(zoom) {
    const e = coordsMap.find(o => o.zoom === zoom);
    return e || DEFAULT;
  }

  function latLngToPoint(lat, lng, centerLat, centerLng, zoom, width, height) {
    const tileSize = 256;
    const scale = tileSize * Math.pow(2, zoom);

    const sinC = Math.min(Math.max(Math.sin(centerLat * Math.PI/180), -0.9999), 0.9999);
    const worldCX = (centerLng + 180)/360 * scale;
    const worldCY = (0.5 - Math.log((1 + sinC)/(1 - sinC))/(4*Math.PI)) * scale;

    const sinT = Math.min(Math.max(Math.sin(lat * Math.PI/180), -0.9999), 0.9999);
    const worldX = (lng + 180)/360 * scale;
    const worldY = (0.5 - Math.log((1 + sinT)/(1 - sinT))/(4*Math.PI)) * scale;

    return {
      x: worldX - worldCX + width/2,
      y: worldY - worldCY + height/2
    };
  }

  let overlay;
  function createOverlay() {
    overlay = document.createElement('div');
    overlay.innerHTML = 'Gulf<br>of Mexico';
    Object.assign(overlay.style, {
      position: 'fixed',
      pointerEvents: 'none',
      whiteSpace: 'pre-line',
      textAlign: 'center',
      borderRadius: '4px',
      padding: '2px',
      transform: 'translate(-50%, -100%)',
      zIndex: '9999',
      display: 'inline-block',
      color: 'rgb(12, 125, 148)'
    });
    document.body.appendChild(overlay);
  }

  function updateOverlay() {
    const container = document.querySelector('.widget-scene');
    if (!container) return;
    if (!overlay) createOverlay();

    const m = window.location.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+),([\d.]+)z/);
    if (!m) return;
    const centerLat = parseFloat(m[1]);
    const centerLng = parseFloat(m[2]);
    const zoom = Math.round(parseFloat(m[3]));

    const { lat, lng, backgroundColor, fontSize } = getEntryForZoom(zoom);

    const rect = container.getBoundingClientRect();
    const { x, y } = latLngToPoint(lat, lng, centerLat, centerLng, zoom, rect.width, rect.height);

    overlay.style.left = `${rect.left + x}px`;
    overlay.style.top = `${rect.top + y}px`;

    overlay.style.backgroundColor = backgroundColor;
    overlay.style.fontSize = fontSize;
  }

  setInterval(updateOverlay, 200);
})();
