// ==UserScript==
// @name         Torn Faction OC 2.0 Checker
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Check available members for OC 2.0 in a Torn faction
// @author       Lewri [1762864] & -beehoe- [2828587] & the DP Warriors
// @match        https://www.torn.com/factions.php?step=your*
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522402/Torn%20Faction%20OC%2020%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/522402/Torn%20Faction%20OC%2020%20Checker.meta.js
// ==/UserScript==
 
(async function () {
  'use strict';
 
  const key = 'ENTER_API_KEY_HERE';
  const base_url = 'https://api.torn.com/v2/faction';
  const params = `?key=${key}&selections=crimes,members&cat=available`;
 
  let collapsibleWrapper = null; // Global reference to track the panel
 
  const targetUl = document.querySelector('.faction-tabs.ui-tabs-nav.ui-helper-reset.ui-helper-clearfix.ui-widget-header.ui-corner-all');
 
  async function createCollapsiblePanel() {
    // Check if the panel already exists
    if (document.querySelector('#slackers-panel')) return;
 
    const panelContainer = document.createElement('div');
    panelContainer.style.border = '1px solid #ccc';
    panelContainer.style.borderRadius = '5px';
    panelContainer.style.marginTop = '10px';
    panelContainer.style.overflow = 'hidden';
    panelContainer.style.backgroundColor = '#333'; // Dark gray background for the panel
    panelContainer.style.color = 'white'; // White text for better visibility on dark gray
    panelContainer.style.padding = '10px';
    panelContainer.style.display = 'none'; // Start collapsed
 
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Show Slackers';
    toggleButton.style.display = 'block';
    toggleButton.style.width = '100%';
    toggleButton.style.padding = '10px';
    toggleButton.style.backgroundColor = '#4CAF50';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px 5px 0 0';
    toggleButton.style.cursor = 'pointer';
 
    toggleButton.addEventListener('click', async () => {
      if (panelContainer.style.display === 'none') {
        panelContainer.style.display = 'block';
        toggleButton.textContent = 'Hide Slackers';
 
        const slackers = await getSlackers();
        displaySlackers(panelContainer, slackers);
      } else {
        panelContainer.style.display = 'none';
        toggleButton.textContent = 'Show Slackers';
      }
    });
 
    collapsibleWrapper = document.createElement('div');
    collapsibleWrapper.setAttribute('id', 'slackers-panel');
    collapsibleWrapper.appendChild(toggleButton);
    collapsibleWrapper.appendChild(panelContainer);
 
    if (targetUl && targetUl.parentNode) {
      targetUl.parentNode.insertBefore(collapsibleWrapper, targetUl.nextSibling);
    }
  }
 
  async function getSlackers() {
    try {
      const response = await fetch(base_url + params);
      const r = await response.json();
 
      if (r.error) {
        alert('Error: Please check your API key and faction API permissions.');
        return [];
      }
 
      const crimes = r.crimes;
      const members = r.members;
 
      const our_criminals = new Set();
 
      for (const crime of crimes) {
        for (const role of crime.slots) {
          if (role.user_id) {
            our_criminals.add(role.user_id);
          }
        }
      }
 
      const slackers = {
        Time: Math.floor(Date.now() / 1000),
        Users: {},
      };
 
      for (const member of members) {
        if (!our_criminals.has(member.id) && member.position !== 'Recruit') {
          slackers.Users[member.id] = member.name;
        }
      }
 
      return slackers;
    } catch (error) {
      alert('Error fetching data.');
      return [];
    }
  }
 
  function displaySlackers(panelContainer, slackers) {
    panelContainer.innerHTML = '';
 
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download JSON';
    downloadButton.style.display = 'block';
    downloadButton.style.width = '100%';
    downloadButton.style.padding = '10px';
    downloadButton.style.border = 'none';
    downloadButton.style.backgroundColor = '#007BFF';
    downloadButton.style.color = 'white';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.textAlign = 'center';
    downloadButton.style.marginBottom = '10px';
 
    downloadButton.addEventListener('click', () => {
      const file = new Blob([JSON.stringify(slackers, null, 2)], {
        type: 'application/json',
      });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      a.download = 'slackers.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
 
    panelContainer.appendChild(downloadButton);
 
    if (Object.keys(slackers.Users).length === 0) {
      const noSlackersMsg = document.createElement('p');
      noSlackersMsg.textContent = 'No slackers found!';
      noSlackersMsg.style.padding = '10px';
      panelContainer.appendChild(noSlackersMsg);
      return;
    }
 
    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = 'repeat(2, 1fr)'; // Two columns
    gridContainer.style.gap = '10px';
 
    for (const [id, name] of Object.entries(slackers.Users)) {
      const slackerButton = document.createElement('button');
      slackerButton.textContent = `${name} [${id}]`;
      slackerButton.style.padding = '10px';
      slackerButton.style.border = 'none';
      slackerButton.style.backgroundColor = '#555'; // Mid gray for the buttons
      slackerButton.style.color = 'white';
      slackerButton.style.cursor = 'pointer';
      slackerButton.style.borderRadius = '5px';
 
      slackerButton.addEventListener('click', () => {
        window.open(`https://www.torn.com/profiles.php?XID=${id}`, '_blank');
      });
 
      gridContainer.appendChild(slackerButton);
    }
 
    panelContainer.appendChild(gridContainer);
 
    panelContainer.style.maxHeight = `${Math.ceil(Object.keys(slackers.Users).length / 2) * 50 + 60}px`; // Approximation for button heights
  }
 
  function handleFragmentChange() {
    const currentFragment = location.hash;
 
    if (!currentFragment.includes('tab=crimes')) {
      const existingPanel = document.querySelector('#slackers-panel');
      if (existingPanel) {
        existingPanel.remove();
        collapsibleWrapper = null; // Clear the global reference
      }
    }
 
    if (currentFragment.includes('tab=crimes')) {
      createCollapsiblePanel();
    }
  }
 
  window.addEventListener('hashchange', handleFragmentChange);
 
  if (location.hash.includes('tab=crimes')) {
    createCollapsiblePanel();
  }
})();
 
 