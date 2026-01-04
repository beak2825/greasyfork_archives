// ==UserScript==
// @name         Browser Implants + True CSS Hover v5.39 (With Inventory Implant)
// @namespace    Zega
// @version      5.39
// @description  Browser Implants panel injected below AutoBank; includes Inventory Implant, Boss Map Implant, and others.
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534181/Browser%20Implants%20%2B%20True%20CSS%20Hover%20v539%20%28With%20Inventory%20Implant%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534181/Browser%20Implants%20%2B%20True%20CSS%20Hover%20v539%20%28With%20Inventory%20Implant%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let _autoBankQueued = false, _autoBankDone = false;
  let _qbQueued = false, _qbDone = false;
  let _miniMapQueued = false, _miniMapDone = false;

  function _onAutoBank() {
    if (_autoBankDone) return;
    _autoBankQueued = true;
    if (typeof fillAutoBankSlot === 'function') fillAutoBankSlot();
  }
  function _onQuickBuy() {
    if (_qbDone) return;
    _qbQueued = true;
    if (typeof fillQuickBuySlot === 'function') fillQuickBuySlot();
  }
  function _onMiniBossMap() {
    if (_miniMapDone) return;
    _miniMapQueued = true;
    if (typeof fillMiniBossMapSlot === 'function') fillMiniBossMapSlot();
  }

  Object.defineProperty(window, 'BrowserImplant_AutoBank', {
    configurable:true, enumerable:true,
    set(v) { if(v) _onAutoBank(); Object.defineProperty(window,'BrowserImplant_AutoBank',{value:v,writable:true,configurable:true,enumerable:true}); },
    get(){ return false; }
  });
  Object.defineProperty(window, 'BrowserImplant_QuickBuy', {
    configurable:true, enumerable:true,
    set(v) { if(v) _onQuickBuy(); Object.defineProperty(window,'BrowserImplant_QuickBuy',{value:v,writable:true,configurable:true,enumerable:true}); },
    get(){ return false; }
  });
  Object.defineProperty(window, 'BrowserImplant_MiniBossMap', {
    configurable:true, enumerable:true,
    set(v) { if(v) _onMiniBossMap(); Object.defineProperty(window,'BrowserImplant_MiniBossMap',{value:v,writable:true,configurable:true,enumerable:true}); },
    get(){ return false; }
  });

  window.addEventListener('load', initWhenReady);

  function initWhenReady() {
    const interval = setInterval(() => {
      const rightTd = document.querySelector('td.design2010[style*="right_margin.jpg"]');
      const quickBuy = rightTd?.querySelector('#quickbuy-fieldset');
      const autoBank = rightTd?.querySelector('#auto-bank-panel');
      if (rightTd && quickBuy && autoBank) {
        clearInterval(interval);
        attachImplants(rightTd, autoBank);
      }
    }, 100);
  }

  function attachImplants(rightTd, autoBank) {
    rightTd.style.position = 'relative';
    const panel = document.createElement('div');
    panel.id = 'browser-implant-panel';
    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <strong style="color:#ffd700;">Browser Implants</strong>
        <button id="collapse-browser-implant" style="background:none;border:none;color:#ffd700;font-size:16px;cursor:pointer">[–]</button>
      </div>
      <div class="implant-grid" id="implant-grid-container"></div>
    `;
    Object.assign(panel.style, {
      position: 'absolute',
      top: `${autoBank.offsetTop + autoBank.offsetHeight + 8}px`,
      left: autoBank.style.left || '10px',
      width: '420px',
      background: 'rgba(0,0,0,0.35)',
      padding: '8px 12px',
      border: '1px solid #666',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
      zIndex: '10000'
    });
    autoBank.parentNode.insertBefore(panel, autoBank.nextSibling);

    const gridEl = panel.querySelector('#implant-grid-container');
    Object.assign(gridEl.style, {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,36px)',
      gridTemplateRows: 'repeat(2,36px)',
      gap: '4px',
      justifyContent: 'center'
    });

    const collapseBtn = panel.querySelector('#collapse-browser-implant');
    if (localStorage.getItem('browserImplantCollapsed') === 'true') {
      gridEl.style.display = 'none';
      collapseBtn.textContent = '[+]';
    }
    collapseBtn.addEventListener('click', () => {
      const hidden = gridEl.style.display === 'none';
      gridEl.style.display = hidden ? 'grid' : 'none';
      collapseBtn.textContent = hidden ? '[–]' : '[+]';
      localStorage.setItem('browserImplantCollapsed', hidden ? 'false' : 'true');
    });

    const slots = [];
    for (let i = 0; i < 8; i++) {
      const slot = document.createElement('div');
      slot.className = 'slot';
      Object.assign(slot.style, {
        width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)', border: '1px solid #888', borderRadius: '4px', position: 'relative'
      });
      const img = document.createElement('img');
      img.className = 'implant-icon';
      Object.assign(img.style, { position: 'absolute', top: '0', left: '0', objectFit: 'contain', cursor: 'default', display: 'none', width: '100%', height: '100%' });
      const popup = document.createElement('div');
      popup.className = 'hover-popup';
      Object.assign(popup.style, {
        display: 'none', position: 'absolute', bottom: '-58px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.85)', padding: '6px', border: '1px solid #555', borderRadius: '6px', flexDirection: 'column', alignItems: 'center', zIndex: '1000', opacity: '0', transition: 'opacity .2s', width: '130px'
      });
      const hoverImg = document.createElement('img');
      hoverImg.className = 'hover-img'; hoverImg.style.width = '50px'; hoverImg.style.height = '50px'; hoverImg.style.marginBottom = '4px'; hoverImg.style.objectFit = 'contain';
      const hoverName = document.createElement('div'); hoverName.className = 'hover-name'; hoverName.style.cssText = 'color:gold;font-size:12px;margin:1px 0;line-height:1.1;text-align:center;';
      const hoverStat = document.createElement('div'); hoverStat.className = 'hover-stat'; hoverStat.style.cssText = hoverName.style.cssText;
      popup.appendChild(hoverImg); popup.appendChild(hoverName); popup.appendChild(hoverStat);
      slot.appendChild(img); slot.appendChild(popup);
      slot.addEventListener('mouseenter', () => { popup.style.display = 'flex'; popup.style.opacity = '1'; });
      slot.addEventListener('mouseleave', () => { popup.style.display = 'none'; popup.style.opacity = '0'; });
      gridEl.appendChild(slot);
      slots.push({ slot, img, hoverImg, hoverName, hoverStat });
    }

    let next = 0;
    function fillSlot(data) {
      if (next >= slots.length) return;
      const { img, hoverImg, hoverName, hoverStat } = slots[next++];
      img.src = data.url; img.style.display = 'block';
      hoverImg.src = data.url;
      hoverName.textContent = data.name;
      hoverStat.textContent = data.stat;
    }

    window.fillAutoBankSlot = () => { _autoBankDone || fillSlot({ url: 'https://files.catbox.moe/ry7yd2.png', name: 'Auto Bank Implant', stat: 'Bank Speed +60%' }); _autoBankDone = true; };
    window.fillQuickBuySlot = () => { _qbDone || fillSlot({ url: 'https://files.catbox.moe/urko7b.png', name: 'QuickBuy Implant', stat: 'Barter Speed +70%' }); _qbDone = true; };
    window.fillMiniBossMapSlot = () => { _miniMapDone || fillSlot({ url: 'https://files.catbox.moe/nvuk60.webp', name: 'Boss Map Implant', stat: 'They cant hide from us. Time to go hunting!' }); _miniMapDone = true; };

    // Always fill core implants
    fillSlot({ url: 'https://files.catbox.moe/y2n5ij.png', name: 'Browser Implant', stat: 'Gain Efficiency +20%' });
    fillSlot({ url: 'https://files.catbox.moe/ry7yd2.png', name: 'Auto Bank Implant', stat: 'Bank Speed +60%' });
    if (window.BrowserImplant_MarketHover) fillSlot({ url: 'https://files.catbox.moe/kqee23.png', name: 'Market Hover Implant', stat: 'Trade Values +15%' });

    // ✅ NEW: Inventory Implant
    if (window.BrowserImplant_InventoryCounter) {
      fillSlot({
        url: 'https://files.catbox.moe/axazel.png',
        name: 'Inventory Implant',
        stat: 'Capacity Awareness +100%'
      });
    }

    if (_qbQueued) window.fillQuickBuySlot();
    if (_miniMapQueued) window.fillMiniBossMapSlot();
  }
})();
