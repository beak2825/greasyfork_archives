// ==UserScript==
// @name         VGMdb Tracklist copy
// @namespace    https://vgmdb.net/
// @version      1.5
// @description  Adds copy buttons to copy tracklists from VGMdb album pages.
// @author       kahpaibe
// @match        https://vgmdb.net/album/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532970/VGMdb%20Tracklist%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/532970/VGMdb%20Tracklist%20copy.meta.js
// ==/UserScript==

(function () {
    'use strict';
  
    const perDiscBtnTitleName = "⎘"; const perDiscBtnTitleName_pressed = "✔ COPIED"; const perDiscBtnTitleMO = "Copy titles for this disc";
    const perDiscBtnFullName = "⎘"; const perDiscBtnFullName_pressed = "✔ COPIED"; const perDiscBtnFullMO = "Copy tracklist for this disc";
    const perLangBtnTitleName = "⎘"; const perLangBtnTitleName_pressed = "✔ COPIED"; const perLangBtnTitleMO = "Copy titles of all discs";
    const perLangBtnFullName = "⎘"; const perLangBtnFullName_pressed = "✔ COPIED"; const perLangBtnFullMO = "Copy tracklists of all discs";
  
    const styleButton = (button) => {
      button.style.marginLeft = '8px';
      button.style.padding = '1px 6px';
      button.style.fontSize = '0.75em';
      button.style.color = '#CEFFFF';
      button.style.background = 'transparent';
      button.style.border = '1px solid #CEFFFF';
      button.style.cursor = 'pointer';
      button.style.transition = 'background 0.3s, color 0.3s, transform 0.2s ease-in-out';
      button.style.verticalAlign = 'middle';
  
      // Animation on hover and focus
      button.onmouseover = () => {
        button.style.background = '#CEFFFF';
        button.style.color = '#000000';
        button.style.transform = 'scale(1.05)';
      };
  
      button.onmouseout = () => {
        button.style.background = 'transparent';
        button.style.color = '#CEFFFF';
        button.style.transform = 'scale(1)';
      };
  
      // Animation when clicked
      button.onmousedown = () => {
        button.style.transform = 'scale(0.95)';
      };
  
      button.onmouseup = () => {
        button.style.transform = 'scale(1)';
      };
    };
  
  
    // === PER-DISC BUTTONS ===
    const addPerDiscButtons = () => {
      const tracklistContainer = document.querySelector('#tracklist');
      if (!tracklistContainer) return;
  
      const allSpans = tracklistContainer.querySelectorAll('span');
  
      allSpans.forEach(span => {
        if (!/Disc \d+/.test(span.textContent)) return;
  
        let sibling = span.nextElementSibling;
        while (sibling && sibling.tagName !== 'TABLE') {
          sibling = sibling.nextElementSibling;
        }
  
        if (!sibling) return;
        const trackTable = sibling;
  
        const btnPerDiscTitle = document.createElement('button');
        btnPerDiscTitle.innerText = perDiscBtnTitleName;
        btnPerDiscTitle.title = perDiscBtnTitleMO;
        styleButton(btnPerDiscTitle);
        btnPerDiscTitle.onclick = () => {
          const tracks = trackTable.querySelectorAll('tr'); // Corrected to target the right table rows
          const lines = [];
          for (const tr of tracks) {
            const tds = tr.querySelectorAll('td');
            if (tds.length >= 2) { // Ensure the row has at least two cells (name + optional duration)
              const title = tds[1].textContent.trim(); // Get the track name (second <td>)
              lines.push(title); // Add the name to the list
            }
          }
          if (lines.length > 0) {
            navigator.clipboard.writeText(lines.join('\n')).then(() => {
              btnPerDiscTitle.innerText = perDiscBtnTitleName_pressed;
              setTimeout(() => btnPerDiscTitle.innerText = perDiscBtnTitleName, 1500);
          });
          }
        };
  
        const btnPerDiscFull = document.createElement('button');
        btnPerDiscFull.innerText = perDiscBtnFullName;
        btnPerDiscFull.title = perDiscBtnFullMO;
        styleButton(btnPerDiscFull);
        btnPerDiscFull.onclick = () => {
          const tracks = trackTable.querySelectorAll('tr'); // Corrected to target the right table rows
          const lines = [];
          for (const tr of tracks) {
            const tds = tr.querySelectorAll('td');
            if (tds.length >= 3) { // Ensure the row has at least three cells (track number, name, duration)
              const number = tds[0].textContent.trim(); // Get the track number (first <td>)
              const title = tds[1].textContent.trim(); // Get the track name (second <td>)
              const duration = tds[2].textContent.trim(); // Get the track duration (third <td>)
              lines.push(`${number} ${title} ${duration}`); // Format and add to list
            }
          }
          if (lines.length > 0) {
            navigator.clipboard.writeText(lines.join('\n')).then(() => {
              btnPerDiscFull.innerText = perDiscBtnFullName_pressed;
              setTimeout(() => btnPerDiscFull.innerText = perDiscBtnFullName, 1500);
          });
          }
        };
  
        // Add buttons to the DOM next to the disc label
        span.appendChild(btnPerDiscTitle);
        span.appendChild(btnPerDiscFull);
      });
    };
  
    // === PER-LANGUAGE BUTTONS ===
    const addPerLanguageButtons = () => {
      const tabNav = document.querySelector('#tlnav');
      if (!tabNav) return;
  
      const tabLinks = tabNav.querySelectorAll('li');
  
      tabLinks.forEach(li => {
        const rel = li.querySelector('a')?.getAttribute('rel');
        if (!rel) return;
  
        const tlbox = document.getElementById(rel);
        if (!tlbox) return;
  
        // --- Names Only Button ---
        const btnPerLangTitle = document.createElement('button');
        btnPerLangTitle.innerText = perLangBtnTitleName;
        btnPerLangTitle.title = perLangBtnTitleMO;
        styleButton(btnPerLangTitle);
  
        btnPerLangTitle.addEventListener('click', () => {
          const spans = tlbox.querySelectorAll('span');
          let result = '';
  
          spans.forEach(span => {
            if (!/Disc \d+/.test(span.textContent)) return;
  
            let sibling = span.nextElementSibling;
            while (sibling && sibling.tagName !== 'TABLE') {
              sibling = sibling.nextElementSibling;
            }
            if (!sibling) return;
  
            const trackRows = sibling.querySelectorAll('tr.rolebit');
            if (trackRows.length === 0) return;
  
            const discTitle = span.childNodes[0]?.textContent.trim();  // Only the original text, not the button
            result += `${discTitle}:\n`;
            trackRows.forEach(row => {
              const titleCell = row.querySelectorAll('td')[1];
              const title = titleCell?.textContent.trim();
              result += `${title}\n`;
            });
            result += '\n';
          });
  
          navigator.clipboard.writeText(result.trim()).then(() => {
            btnPerLangTitle.innerText = perLangBtnTitleName_pressed;
            setTimeout(() => btnPerLangTitle.innerText = perLangBtnTitleName, 1500);
          });
        });
  
        // --- Full Info Button ---
        const btnPerLangFull = document.createElement('button');
        btnPerLangFull.innerText = perLangBtnFullName;
        btnPerLangFull.title = perLangBtnFullMO;
        styleButton(btnPerLangFull);
  
        btnPerLangFull.addEventListener('click', () => {
          const spans = tlbox.querySelectorAll('span');
          let result = '';
  
          spans.forEach(span => {
            if (!/Disc \d+/.test(span.textContent)) return;
  
            let sibling = span.nextElementSibling;
            while (sibling && sibling.tagName !== 'TABLE') {
              sibling = sibling.nextElementSibling;
            }
            if (!sibling) return;
  
            const trackRows = sibling.querySelectorAll('tr.rolebit');
            if (trackRows.length === 0) return;
  
            const discTitle = span.childNodes[0]?.textContent.trim();  // Only the original text, not the button
            result += `${discTitle}:\n`;
            trackRows.forEach(row => {
              const number = row.querySelector('td .label')?.textContent.trim();
              const title = row.querySelectorAll('td')[1]?.textContent.trim();
              const duration = row.querySelectorAll('td')[2]?.textContent.trim();
              result += `${number}. ${title} ${duration}\n`;
            });
            result += '\n';
          });
  
          navigator.clipboard.writeText(result.trim()).then(() => {
            btnPerLangFull.innerText = perLangBtnFullName_pressed;
            setTimeout(() => btnPerLangFull.innerText = perLangBtnFullName, 1500);
          });
        });
  
        li.appendChild(btnPerLangTitle);
        li.appendChild(btnPerLangFull);
      });
    };
  
    // Run after page loads
    addPerDiscButtons();
    addPerLanguageButtons();
  })();
  