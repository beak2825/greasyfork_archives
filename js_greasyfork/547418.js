// ==UserScript==
// @name         RW MV calculator & buy/sell calculator (customizable)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  click green button, get read out. buttons nxt to left numbers put that number * 'buyperc', on right they copy the number they are on
// @author       Tuit
// @match        https://www.torn.com/war.php?step=rankreport&rankID*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547418/RW%20MV%20calculator%20%20buysell%20calculator%20%28customizable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547418/RW%20MV%20calculator%20%20buysell%20calculator%20%28customizable%29.meta.js
// ==/UserScript==
(function() {
  'use strict';
  const API_KEY = 'PUTYOURAPIHERE'; // put ur API in the ''
  const buyperc=.95 //prcentage of MV u wanna buy/sell at
  // item ids
  const cacheMap = {
    "Armor Cache": 1118,
    "Melee Cache": 1119,
    "Small Arms Cache": 1120,
    "Medium Arms Cache": 1121,
    "Heavy Arms Cache": 1122
  };
  // cache counter
  function extractCacheCounts(text) {
    const counts = {};
    Object.keys(cacheMap).forEach(cache => {
      const match = text.match(new RegExp(`(\\d+)x\\s+${cache}`));
      if (match) counts[cache] = parseInt(match[1], 10);
    });
    return counts;
  }
  // Fetch mvs
  async function fetchCacheMarketValues() {
    const resp = await fetch(`https://api.torn.com/torn/?selections=items&key=${API_KEY}`);
    if (!resp.ok) {
      alert(`API error: ${resp.status}`);
      return null;
    }
    const data = await resp.json();
    if (!data.items) {
      alert("API returned no items data.");
      return null;
    }
    // Extract cache mv
    const mvConstants = {};
    for (const cacheName in cacheMap) {
      const itemId = cacheMap[cacheName];
      mvConstants[itemId] = data.items[itemId]?.market_value || 0;
    }
    return mvConstants;
  }
  // calc tots
  function calculateTotals(counts, marketValues) {
    let total = 0;
    Object.entries(counts).forEach(([cache, count]) => {
      const mv = marketValues[cacheMap[cache]] || 0;
      total += mv * count;
    });
    return total;
  }
  // overlay and ui shit
  function createOverlay(id, label, value, topPos, rightPos) {//if you want to modify overlay stuff do it here, the `${}px` stuff has to be modified in the ovelay section
    const overlay = document.createElement('div');
    Object.assign(overlay, { id, className: 'cache-overlay' });
    Object.assign(overlay.style, {
      position: 'fixed',
      top: `${topPos}px`,
      right: `${rightPos}px`,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      zIndex: '9999',
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      pointerEvents: 'none'
    });
    overlay.textContent = `${label}: $${value.toLocaleString()}`;
    document.body.appendChild(overlay);
  }
  function removeExistingOverlays() {//this resets overlays, mostly helps for debugging in console, you can probably cut this if u want
    document.querySelectorAll('.cache-overlay').forEach(el => el.remove());
  }
  function addCopyButton(value, topPos, width,right) {//if you want to modify button stuff do it here, the `${}px` stuff has to be modified in the ovelay section
    const button = document.createElement('button');
    Object.assign(button.style, {
      position: 'fixed',
      top: `${topPos}px`,
      right: `${right}px`,
      width:`${width}px`,
      height: '30px',
      backgroundColor: '#4CAF50',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      zIndex: '10000'
    });
    button.addEventListener('click', () => {
      const buyVal = Math.round(value * buyperc);//keep in mind that this is not actually taking the value of the thing its next to but instead first variable * buyperc
      const formatted = `$${buyVal.toLocaleString()}`;
      navigator.clipboard.writeText(formatted)
        .catch(err => console.error('Copy failed:', err));//idk what this shit is
    });
    document.body.appendChild(button);
  }
  function addTriggerButton() {//this posittions the trigger button
    const button = document.createElement('button');
    button.id = 'cacheTotalButton';
    button.textContent = 'Calculate Cache Totals';
    Object.assign(button.style, {
      position: 'fixed',
      top: '5px',
      right: '10px',
      padding: '10px 15px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      zIndex: '10000'
    });
    button.addEventListener('click', async () => {
      removeExistingOverlays();
      //this is a bunch id variables needed for displays, some of these are customizable
      const mvConstants = await fetchCacheMarketValues();
      if (!mvConstants) return; // Stop if API fetch failed
      const topText = document.querySelectorAll('.memberBonusRow___XJqsX')[0]?.innerText || '';
      const bottomText = document.querySelectorAll('.memberBonusRow___XJqsX')[1]?.innerText || '';
      const topCounts = extractCacheCounts(topText);
      const bottomCounts = extractCacheCounts(bottomText);
      const topTotal = calculateTotals(topCounts, mvConstants);
      const bottomTotal = calculateTotals(bottomCounts, mvConstants);
      const mv1118 = mvConstants[1118] || 0;
      const mv1119 = mvConstants[1119] || 0;
      const mv1120 = mvConstants[1120] || 0;
      const mv1121 = mvConstants[1121] || 0;
      const mv1122 = mvConstants[1122] || 0;
      if (topTotal === null || bottomTotal === null) return;
      const topBuy = Math.round(topTotal * buyperc);
      const bottomBuy = Math.round(bottomTotal * buyperc);
      //constants for qol. u dont HAVE to use these
      const opftr=80//overlay, pixels from top, right (this pushes the whole stack down)
      const opftl=5//overlay, pixels from top, left (this pushes the whole stack down)
      const sep=31//seperation distance btw overlays & buttons (all) make ur own l/r o/b things if you are that pedantic (or pay me 5m in torn to do it for you kek)
      const pfrtots=0//pixel from right for total overlays
      const pfrbuys=23//pixel from right buy overlays
      //overlay creation createOverlay(first part doesnt matter, text b4 value, value printed, pixels from top, pixels from right [nothing puts it all the way to the left])
      createOverlay('top-cache-overlay', 'Top Total', topTotal, opftr,pfrtots);
      createOverlay('bottom-cache-overlay', 'Bottom Total', bottomTotal, opftr+(sep*1),pfrtots);
      createOverlay('topbuy', 'Top Buy', topBuy, opftr+(sep*2),pfrbuys);
      createOverlay('bottombuy', 'Bottom Buy', bottomBuy, opftr+(sep*3),pfrbuys);
      createOverlay('',"Armor",mv1118,opftl);
      createOverlay('',"Melee",mv1119,opftl+(sep*1));
      createOverlay('',"Small",mv1120,opftl+(sep*2));
      createOverlay('',"Medium",mv1121,opftl+(sep*3));
      createOverlay('',"Heavy",mv1122,opftl+(sep*4));
      //constants for qol. u dont HAVE to use these
      const bpftr=80 //button, pixels from top, right (this pushes the whole stack down)
      const bpftl=5 //button, pixels from top, left (this pushes the whole stack down)
      const bwr=30 //button, width, right
      const bwl=10 //button, width, left
      // (value to * by buyperc, pixels from top, width, pixels from right)
      addCopyButton(topTotal,bpftr+(sep*2),bwr,0);
      addCopyButton(bottomTotal,bpftr+(sep*3),bwr,0);
      addCopyButton(mv1118,bpftl+(sep*0),bwl);// *0 is not needed here but whatevs
      addCopyButton(mv1119,bpftl+(sep*1),bwl);
      addCopyButton(mv1120,bpftl+(sep*2),bwl);
      addCopyButton(mv1121,bpftl+(sep*3),bwl);
      addCopyButton(mv1122,bpftl+(sep*4),bwl);
    });
    document.body.appendChild(button);
  }
  addTriggerButton();
})();
