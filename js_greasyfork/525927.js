// ==UserScript==
// @name         Flight Simulator Chart Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a download button for flight simulator charts
// @author       jtpotato
// @match        https://planner.flightsimulator.com/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/525927/Flight%20Simulator%20Chart%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/525927/Flight%20Simulator%20Chart%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and style the download button
    const downloadBtn = document.createElement('button');
    downloadBtn.innerHTML = 'Download Chart';
    downloadBtn.style.position = 'fixed';
    downloadBtn.style.top = '80px';
    downloadBtn.style.right = '80px';
    downloadBtn.style.zIndex = '9999';
    downloadBtn.style.padding = '10px 20px';
    downloadBtn.style.backgroundColor = '#0078d4';
    downloadBtn.style.color = 'white';
    downloadBtn.style.border = 'none';
    downloadBtn.style.borderRadius = '5px';
    downloadBtn.style.cursor = 'pointer';
    downloadBtn.addEventListener('mouseover', () => downloadBtn.style.backgroundColor = '#006cbd');
    downloadBtn.addEventListener('mouseout', () => downloadBtn.style.backgroundColor = '#0078d4');

    // Add click handler
    downloadBtn.addEventListener('click', () => {
        const chartImage = document.getElementById('chart-preview-image');

        if (chartImage && chartImage.src) {
            // Create temporary link to trigger download
            const link = document.createElement('a');
            link.href = chartImage.src;
            link.download = `flight_chart_${Date.now()}.png`;  // Generates unique filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('Chart image not found!');
        }
    });

    // Add button to the page when DOM is loaded
    // window.addEventListener('DOMContentLoaded', () => {
      console.log("Inserted Button!")
        document.body.appendChild(downloadBtn);
    // });
})();