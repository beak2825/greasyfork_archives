// ==UserScript==
// @name         VGMdb Tracklist Copier
// @version      0.2
// @description  Copies tracklist information from a VGMdb album page.(Dont work tempermonkey)
// @author       LunaSama154
// @match        https://vgmdb.net/album/*
// @grant        LunaSama154
// @license      MIT
// @namespace LunaSama154
// @downloadURL https://update.greasyfork.org/scripts/501895/VGMdb%20Tracklist%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/501895/VGMdb%20Tracklist%20Copier.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function copyTracklistToClipboard() {
    // Find all active tracklist tables (multiple for multi-disc albums)
    const activeTracklistTables = document.querySelectorAll('span.tl:not([style*="display: none"]) table.role');

    if (activeTracklistTables.length === 0) {
      alert('Active tracklist table not found on this page.');
      return;
    }

    let tracklistText = '';

    activeTracklistTables.forEach((tracklistTable, index) => {
      // Add disc number header if there are multiple discs
      if (activeTracklistTables.length > 1) {
        tracklistText += `Disc ${index + 1}\n`;
      }

      const trackRows = tracklistTable.querySelectorAll('tr.rolebit');
      trackRows.forEach(row => {
        const columns = row.querySelectorAll('td');
        if (columns.length >= 3) {
          const trackNumber = columns[0].textContent.trim();
          const trackTitle = columns[1].textContent.trim();
          const trackDuration = columns[2].textContent.trim();
          tracklistText += `${trackNumber}. ${trackTitle} ${trackDuration}\n`;
        }
      });

      // Add a newline between discs
      if (index < activeTracklistTables.length - 1) {
        tracklistText += '\n';
      }
    });

    navigator.clipboard.writeText(tracklistText)
      .then(() => {
        alert('Tracklist copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy tracklist: ', err);
        alert('Failed to copy tracklist. See console for details.');
      });
  }

  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy Tracklist';
  copyButton.style.marginTop = '10px';
  copyButton.addEventListener('click', copyTracklistToClipboard);

  const tracklistContainer = document.querySelector('#tracklist');
  tracklistContainer.parentNode.insertBefore(copyButton, tracklistContainer.nextSibling);

})();