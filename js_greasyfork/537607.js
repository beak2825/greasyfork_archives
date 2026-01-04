// ==UserScript==
// @name         Florr.io Map Overlay (beta)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Overlay a zone-specific map image on Florr.io with auto-switching, toggleable menu, and opacity control buttons
// @match        *://florr.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537607/Florrio%20Map%20Overlay%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537607/Florrio%20Map%20Overlay%20%28beta%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const mapImages = {
        "Garden": "https://i.imgur.com/npdT7J9.png",
        "Desert": "https://i.imgur.com/CITUZbR.png",
        "Ocean": "https://i.imgur.com/RTnQrfi.png",
        "Jungle": "https://i.imgur.com/RQf5ncs.png",
        "Sewer": "https://i.imgur.com/2Uj6qjr.png",
        "Factory": "https://i.imgur.com/QYtXKdU.png",
        "Ant Hell": "https://i.imgur.com/0ql2xHV.png"
    };

    // Use stored settings or default settings
    const saved = JSON.parse(localStorage.getItem('mapOverlaySettings') || '{"opacity": 1.0}');

    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'florr-map-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = saved.top || '12px';
    overlay.style.left = saved.left || '1100px';
    overlay.style.width = '210px';
    overlay.style.height = '210px';
    overlay.style.backgroundImage = `url(${mapImages["Garden"]})`;
    overlay.style.backgroundSize = 'contain';
    overlay.style.backgroundRepeat = 'no-repeat';
    overlay.style.zIndex = '9999';
    overlay.style.opacity = saved.opacity || 1.0;
    overlay.style.resize = 'none';
    overlay.style.cursor = 'default';
    overlay.style.pointerEvents = 'none';
    document.body.appendChild(overlay);

    // Toggle menu button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '🗺️';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.top = '10px';
    toggleBtn.style.left = '300px';
    toggleBtn.style.zIndex = '10000';
    toggleBtn.style.padding = '8px 12px';
    toggleBtn.style.borderRadius = '8px';
    toggleBtn.style.backgroundColor = '#3498db';
    toggleBtn.style.color = 'white';
    toggleBtn.style.fontSize = '14px';
    toggleBtn.style.fontWeight = 'bold';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.border = 'none';
    document.body.appendChild(toggleBtn);

    // Menu container
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '45px';
    menu.style.left = '300px';
    menu.style.padding = '10px';
    menu.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    menu.style.borderRadius = '8px';
    menu.style.border = '1px solid #fff';
    menu.style.zIndex = '10000';
    menu.style.display = 'none';
    menu.style.maxHeight = '250px';
    menu.style.overflowY = 'auto';
    document.body.appendChild(menu);

    // Define zone buttons (with color and image)
    const zones = {
        "Garden": { color: "#2ecc71", img: mapImages["Garden"] },
        "Desert": { color: "#f39c12", img: mapImages["Desert"] },
        "Ocean": { color: "#3498db", img: mapImages["Ocean"] },
        "Jungle": { color: "#27ae60", img: mapImages["Jungle"] },
        "Sewer": { color: "#7f8c8d", img: mapImages["Sewer"] },
        "Factory": { color: "#95a5a6", img: mapImages["Factory"] },
        "Ant Hell": { color: "#e74c3c", img: mapImages["Ant Hell"] }
    };

    // Create zone buttons
    Object.keys(zones).forEach(zone => {
        const btn = document.createElement('button');
        btn.textContent = zone;
        btn.style.margin = '5px 0';
        btn.style.padding = '8px 12px';
        btn.style.backgroundColor = zones[zone].color;
        btn.style.color = 'white';
        btn.style.fontSize = '14px';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.onclick = () => {
            overlay.style.backgroundImage = `url(${zones[zone].img})`;
        };
        menu.appendChild(btn);
    });

    // Opacity control buttons
    const opacityButtons = [
        { label: 'Transparent (0.25)', opacity: 0.25, color: '#f39c12' },
        { label: 'Full (1)', opacity: 1.0, color: '#27ae60' },
        { label: 'OFF (0)', opacity: 0, color: '#e74c3c' }
    ];

    opacityButtons.forEach(btnData => {
        const btn = document.createElement('button');
        btn.textContent = btnData.label;
        btn.style.marginTop = '5px';
        btn.style.padding = '8px 12px';
        btn.style.backgroundColor = btnData.color;
        btn.style.color = 'white';
        btn.style.fontSize = '14px';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.onclick = () => {
            overlay.style.opacity = btnData.opacity;
            saved.opacity = btnData.opacity;
            localStorage.setItem('mapOverlaySettings', JSON.stringify(saved));
        };
        menu.appendChild(btn);
    });

    // Toggle menu visibility
    toggleBtn.onclick = () => {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    };

})();
