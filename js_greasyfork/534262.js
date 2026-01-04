// ==UserScript==
// @name         Outpost with Mini Boss Map + Toggle + Implant v1.3
// @namespace    Zega
// @version      1.3
// @description  Embeds a mini boss map into the Outpost page’s left margin with a hide/show toggle and registers a Browser Implant.
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534262/Outpost%20with%20Mini%20Boss%20Map%20%2B%20Toggle%20%2B%20Implant%20v13.user.js
// @updateURL https://update.greasyfork.org/scripts/534262/Outpost%20with%20Mini%20Boss%20Map%20%2B%20Toggle%20%2B%20Implant%20v13.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Signal Mini Boss Map implant to Browser Implants panel
  window.BrowserImplant_MiniBossMap = true;

  // Immediately embed map and toggle (no load listener)
  const allTds = document.querySelectorAll('td.design2010');
  let mapTd = null;
  allTds.forEach(td => {
    const bg = window.getComputedStyle(td).backgroundImage;
    if (bg && bg.includes('left_margin.jpg')) {
      mapTd = td;
    }
  });

  if (!mapTd) {
    console.warn('Mini Boss Map: could not find left-margin <td>');
    return;
  }

  mapTd.style.position = 'relative';

  // Create toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'toggle-bossmap';
  toggleBtn.textContent = localStorage.getItem('bossMapHidden') === 'true' ? 'Show Map' : 'Hide Map';
  Object.assign(toggleBtn.style, {
    position: 'absolute', top: '10px', left: '10px',
    padding: '4px 8px', fontSize: '12px',
    backgroundColor: '#222', color: '#ffd700',
    border: '1px solid #666', borderRadius: '4px',
    cursor: 'pointer', zIndex: '1000'
  });
  mapTd.appendChild(toggleBtn);

  // Create and style iframe
  const iframe = document.createElement('iframe');
  iframe.src = 'https://www.dfprofiler.com/bossmap';
  Object.assign(iframe.style, {
    position: 'absolute', top: '40px', right: '10px',
    width: '750px', height: '1050px',
    border: '2px solid #444', borderRadius: '8px',
    boxShadow: '0 0 8px rgba(0,0,0,0.5)',
    backgroundColor: '#fff', zIndex: '999'
  });
  mapTd.appendChild(iframe);

  // Initialize visibility
  const hidden = localStorage.getItem('bossMapHidden') === 'true';
  iframe.style.display = hidden ? 'none' : 'block';
  toggleBtn.textContent = hidden ? 'Show Map' : 'Hide Map';

  // Toggle behavior
  toggleBtn.addEventListener('click', () => {
    const isHidden = iframe.style.display === 'none';
    iframe.style.display = isHidden ? 'block' : 'none';
    toggleBtn.textContent = isHidden ? 'Hide Map' : 'Show Map';
    localStorage.setItem('bossMapHidden', isHidden ? 'false' : 'true');
  });

  console.log('Mini Boss Map + Toggle + Implant: embedded');
})();
