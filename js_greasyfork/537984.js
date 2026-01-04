// ==UserScript==
// @name         Torn OC Highlighter
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Highlights OCs on Factions → Crimes → Recruiting by join priority, adds labels, and uses color gradients for priority.
// @match        *://www.torn.com/factions.php?step=your&type=1*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537984/Torn%20OC%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/537984/Torn%20OC%20Highlighter.meta.js
// ==/UserScript==

    (function() {
      'use strict';

      // Interpolates between two hex colors
      function interpolateColor(color1, color2, factor) {
        if (color1[0] === '#') color1 = color1.slice(1);
        if (color2[0] === '#') color2 = color2.slice(1);
        const c1 = color1.match(/\w\w/g).map(x => parseInt(x, 16));
        const c2 = color2.match(/\w\w/g).map(x => parseInt(x, 16));
        const result = c1.map((v, i) => Math.round(v + (c2[i] - v) * factor));
        return `#${result.map(x => x.toString(16).padStart(2, '0')).join('')}`;
      }

      // Adds a label next to the link icon in the OC panel
      function addLabel(row, text, color) {
        const panelBody = row.querySelector('.panelBody___lWhwy');
        if (!panelBody) return;
        const oldLabel = panelBody.querySelector('.oc-label');
        if (oldLabel) oldLabel.remove();
        const linkIcon = panelBody.querySelector('.chainLink___pHkg9');
        const label = document.createElement('span');
        label.className = 'oc-label';
        label.textContent = text;
        label.style.marginLeft = '8px';
        label.style.fontWeight = 'bold';
        label.style.color = color;
        label.style.fontSize = '1em';
        label.style.background = '#222a';
        label.style.padding = '2px 8px';
        label.style.borderRadius = '6px';
        label.style.verticalAlign = 'middle';
        if (linkIcon && linkIcon.nextSibling) {
          panelBody.insertBefore(label, linkIcon.nextSibling);
        } else {
          panelBody.appendChild(label);
        }
      }

      function highlightOCs() {
        // Only run if the Recruiting tab is active
        const activeTab = document.querySelector('button.active___ImR61 .tabName___DdwH3');
        if (!activeTab || activeTab.textContent.trim() !== 'Recruiting') {
          // Reset all OCs if not on Recruiting tab
          const ocRows = document.querySelectorAll('div[class^="wrapper__"][data-oc-id]');
          ocRows.forEach(row => {
            row.style.display = '';
            row.style.border = '';
            const oldLabel = row.querySelector('.oc-label');
            if (oldLabel) oldLabel.remove();
          });
          return;
        }

        const ocList = document.querySelector('#faction-crimes-root .tt-oc2-list');
        if (!ocList || getComputedStyle(ocList).display === 'none') return;
        const ocRows = Array.from(ocList.querySelectorAll('div[class^="wrapper__"][data-oc-id]'));
        const stalledRows = [];
        const fillableRows = [];
        const soonRows = [];
        const emptyRows = [];

        ocRows.forEach(row => {
          row.style.display = '';
          row.style.border = '';
          // Remove any old label
          const oldLabel = row.querySelector('.oc-label');
          if (oldLabel) oldLabel.remove();

          // Stalled/Paused OC
          if (row.querySelector('[aria-label="paused"]') || row.querySelector('[aria-label="stalled"]')) {
            row.style.setProperty('border', '3px solid #00FF00', 'important');
            addLabel(row, 'Stalled/Paused', '#00FF00');
            stalledRows.push(row);
            return;
          }
          // Empty OC
          if (row.querySelector('[aria-label="recruiting"]')) {
            row.style.setProperty('border', '2px solid #FFA500', 'important');
            addLabel(row, 'Empty', '#FFA500');
            emptyRows.push(row);
            return;
          }
          // OC with planning clocks
          const planningClocks = row.querySelectorAll('div.planning___CjB09');
          if (planningClocks.length > 0) {
            const rightMostClock = planningClocks[planningClocks.length - 1];
            const bg = rightMostClock.style.background;
            const isZero = (
              bg === 'conic-gradient(var(--oc-clock-planning-bg) 0deg, var(--oc-clock-bg) 0deg)' ||
              bg.replace(/\s/g, '') === 'conic-gradient(var(--oc-clock-planning-bg)0deg,var(--oc-clock-bg)0deg)'
            );
            if (isZero) {
              row.style.display = 'none';
              return;
            } else {
              // Fillable OC (joining would fill it)
              if (planningClocks.length === 1) {
                row.style.setProperty('border', '3px solid #66FF66', 'important');
                addLabel(row, 'Start planning <24hr (fills OC)', '#66FF66');
                fillableRows.push(row);
                return;
              } else {
                // OC with <24h start, not full; color by fullness
                let maxMembers = 6;
                const playerSlots = row.querySelectorAll('.player___, .player__');
                if (playerSlots.length > planningClocks.length) {
                  maxMembers = playerSlots.length;
                }
                const fillRatio = planningClocks.length / maxMembers;
                const borderColor = interpolateColor('#66FF66', '#FFA500', 1 - fillRatio);
                row.style.setProperty('border', `2px solid ${borderColor}`, 'important');
                addLabel(row, 'Start planning <24hr', borderColor);
                soonRows.push(row);
                return;
              }
            }
          }
          // Hide all others
          row.style.display = 'none';
        });

        // Sort by priority: stalled > fillable > soon > empty
        const sortedRows = stalledRows.concat(fillableRows, soonRows, emptyRows);
        sortedRows.forEach(row => ocList.appendChild(row));

        // Find all OCs that will stall within 6 hours (rightmost planning clock degree >= 270, not full, next slot is empty)
        let importantRows = [];
        let fallbackRows = [];
        soonRows.forEach(row => {
          const planningClocks = row.querySelectorAll('div.planning___CjB09');
          if (planningClocks.length > 0) {
            const rightMostClock = planningClocks[planningClocks.length - 1];
            const bg = rightMostClock.style.background;
            // Extract degree value from background style
            const match = bg.match(/([0-9.]+)deg/);
            if (match) {
              const deg = parseFloat(match[1]);
              // Check if next slot is empty (has JOIN button)
              const slots = Array.from(row.querySelectorAll('button'));
              const hasJoin = slots.some(btn => btn.textContent.trim().toUpperCase() === 'JOIN');
              if (deg < 360 && hasJoin) {
                if (deg >= 270) { // within 6 hours
                  importantRows.push({row, deg});
                } else if (deg >= 240) { // within 12 hours
                  fallbackRows.push({row, deg});
                }
              }
            }
          }
        });
        // Sort importantRows and fallbackRows by degree descending (closest to stalling first)
        importantRows.sort((a, b) => b.deg - a.deg);
        fallbackRows.sort((a, b) => b.deg - a.deg);
        // Tag and move importantRows to top
        if (importantRows.length > 0) {
          importantRows.forEach(({row}) => {
            const topLabel = row.querySelector('.oc-label');
            if (topLabel) {
              topLabel.textContent = 'Most important';
              topLabel.style.color = '#FF00FF';
            }
            ocList.insertBefore(row, ocList.firstChild);
          });
        } else if (fallbackRows.length > 0) {
          // If none within 6h, tag and move those within 12h
          fallbackRows.forEach(({row}) => {
            const topLabel = row.querySelector('.oc-label');
            if (topLabel) {
              topLabel.textContent = 'Most important';
              topLabel.style.color = '#FF00FF';
            }
            ocList.insertBefore(row, ocList.firstChild);
          });
        }
      }

      setInterval(highlightOCs, 1500);
    })();

