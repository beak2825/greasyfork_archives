// ==UserScript==
// @name         QuickBuy
// @namespace    Zega
// @version      1.50
// @description  QuickBuy panel with hide/show toggle, remembered collapse, full cross-page quick buy, supports multi-buys only when count >1 (ammo always 1)
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534179/QuickBuy.user.js
// @updateURL https://update.greasyfork.org/scripts/534179/QuickBuy.meta.js
// ==/UserScript==

(function(){
  'use strict';

  // mark implant
  window.BrowserImplant_QuickBuy = true;
  const highlightConfig = JSON.parse(localStorage.getItem('qb_highlightConfig')||'{}');

  // buttons: qty = stack-size for matching; count = how many times to click
  const foodMedItems = [
    { label:'Buy Whiskey',         search:'Whiskey',       qty:1,   count:1 },
    { label:'Buy Nerotonin 8B',    search:'Nerotonin 8B', qty:1,   count:1 },
    { label:'Buy Energy Bar',      search:'Energy Bar',    qty:1,   count:1 },
    { label:'Buy Repair Kit',      search:'Repair Kit',    qty:1,   count:1 }
  ];

  const ammoItems = [
    { label:'14mm Stack (1200)',    search:'14mm Rifle Bullets',   qty:1200, count:1 },
    { label:'12.7mm Stack (1200)',  search:'12.7mm Rifle Bullets', qty:1200, count:1 },
    { label:'9mm Stack (1200)',     search:'9mm Rifle Bullets',    qty:1200, count:1 },
    { label:'.55 Stack (1600)',     search:'.55 Handgun Bullets',  qty:1600, count:1 },
    { label:'Biomass Stack (1000)', search:'Biomass',             qty:1000, count:1 },
    { label:'Energy Cell (1600)',   search:'Energy Cell',         qty:1600, count:1 },
    { label:'Grenade Stack (400)',  search:'Grenades',            qty:400,  count:1 },
    { label:'Heavy Grenades (400)', search:'Heavy Grenades',      qty:400,  count:1 },
    { label:'Gasoline (4546)',      search:'Gasoline',            qty:4546, count:1 },
    { label:'10 Gauge (800)',       search:'10 Gauge Shells',     qty:800,  count:1 },
    { label:'12 Gauge (800)',       search:'12 Gauge Shells',     qty:800,  count:1 },
    { label:'16 Gauge (800)',       search:'16 Gauge Shells',     qty:800,  count:1 },
    { label:'20 Gauge (800)',       search:'20 Gauge Shells',     qty:800,  count:1 }
  ];

  // build UI
  function createToolbar(){
    const rightTd = document.querySelector("td.design2010[style*='right_margin.jpg']");
    if(!rightTd) return console.warn('QuickBuy: right cell not found');
    rightTd.style.position='relative';

    const fs = document.createElement('fieldset');
    fs.id = 'quickbuy-fieldset';
    Object.assign(fs.style,{
      position:'absolute', top:'120px', left:'10px',
      width:'420px', border:'1px solid #666',
      padding:'8px 12px', background:'rgba(0,0,0,0.35)',
      borderRadius:'8px', boxShadow:'0 4px 12px rgba(0,0,0,0.6)',
      zIndex:'10000'
    });

    const legend = document.createElement('legend');
    legend.innerHTML = `
      <span style="color:#ffd700;">QuickBuys</span>
      <button id="collapse-quickbuy"
              style="background:none;border:none;color:#ffd700;font-size:16px;cursor:pointer">
        [–]
      </button>`;
    legend.style.padding='0 6px';
    legend.style.fontSize='13px';
    fs.appendChild(legend);

    const container = document.createElement('div');
    container.id = 'quickbuy-container';
    fs.appendChild(container);
    rightTd.appendChild(fs);

    appendSection(container,'Food / Medical',foodMedItems);
    container.appendChild(Object.assign(document.createElement('hr'),{
      style:'border:0;border-top:1px solid #666;margin:8px 0;'
    }));
    appendSection(container,'Ammo',ammoItems);

    const btn = document.getElementById('collapse-quickbuy');
    if(localStorage.getItem('quickbuyCollapsed')==='true'){
      container.style.display='none';
      btn.textContent='[+]';
    }
    btn.addEventListener('click',()=>{
      const hidden = container.style.display==='none';
      container.style.display = hidden?'block':'none';
      btn.textContent = hidden?'[–]':'[+]';
      localStorage.setItem('quickbuyCollapsed',hidden?'false':'true');
    });
  }

  // helper to append grid
  function appendSection(parent,title,items){
    const hdr = document.createElement('div');
    hdr.textContent=title;
    hdr.style.color='gold';
    hdr.style.fontWeight='bold';
    hdr.style.margin = title==='Ammo'? '2px 0 4px':'4px 0 2px';
    parent.appendChild(hdr);

    const grid = document.createElement('div');
    grid.style.display='grid';
    grid.style.gridTemplateColumns='repeat(2,200px)';
    grid.style.gap='8px';
    items.forEach(i=>grid.appendChild(createButton(i)));
    parent.appendChild(grid);
  }

  // create each button
  function createButton(item){
    const btn = document.createElement('button');
    btn.textContent = item.label;
    Object.assign(btn.style,{
      width:'200px',height:'32px',
      backgroundColor: highlightConfig[item.search]?.backgroundColor||'#222',
      color: highlightConfig[item.search]?.color||'gold',
      border:'2px solid #555',
      borderRadius:'8px',
      cursor:'pointer',
      textAlign:'center'
    });

    btn.addEventListener('contextmenu',e=>{
      e.preventDefault();
      const k = item.search;
      if(highlightConfig[k]?.backgroundColor==='green'){
        delete highlightConfig[k];
        btn.style.backgroundColor='#222';
        btn.style.color='gold';
      } else {
        highlightConfig[k] = { backgroundColor:'green', color:'black' };
        btn.style.backgroundColor='green';
        btn.style.color='black';
      }
      localStorage.setItem('qb_highlightConfig',JSON.stringify(highlightConfig));
    });

    btn.addEventListener('click',()=> quickBuy(item.search,item.qty,item.count));
    return btn;
  }

  // save pending and go to marketplace
  function quickBuy(term,qty,count){
    sessionStorage.setItem('quickBuy_pending',
      JSON.stringify({ term, qty, count }));
    window.location.href = `${location.origin}${location.pathname}?page=35`;
  }

  function realClick(el){
    el.dispatchEvent(new MouseEvent('click',{ bubbles:true, cancelable:true }));
  }

  function waitForYesClick(cb){
    const start = Date.now();
    (function poll(){
      const yes = Array.from(document.querySelectorAll('button'))
        .find(b=>b.innerText.trim().toLowerCase()==='yes');
      if(yes){
        realClick(yes);
        cb && cb();
      } else if(Date.now() - start < 5000){
        setTimeout(poll,100);
      }
    })();
  }

  // find single matching listing and click it count times
  function purchaseMultiple(term,qty,count){
    const obs = new MutationObserver((_,o)=>{
      const items = Array.from(document.querySelectorAll('div.fakeItem'))
        .filter(d=>
          d.querySelector('.itemName')?.textContent.trim()===term &&
          Number(d.getAttribute('data-quantity'))===qty
        );
      if(items.length){
        o.disconnect();
        const buyBtn = items[0].querySelector('button[data-action="buyItem"]');
        let i=0;
        (function loop(){
          if(i>=count) return;
          realClick(buyBtn);
          waitForYesClick(()=>{
            i++;
            setTimeout(loop,300);
          });
        })();
      }
    });
    obs.observe(document.body,{ childList:true, subtree:true });
  }

  // on load: build UI & resume pending buy
  window.addEventListener('load',()=>{
    setTimeout(createToolbar,500);

    const p = sessionStorage.getItem('quickBuy_pending');
    if(p && window.location.search.includes('page=35')){
      const { term, qty, count } = JSON.parse(p);
      sessionStorage.removeItem('quickBuy_pending');
      const input = document.querySelector('#searchField');
      const mk    = document.querySelector('#makeSearch');
      if(input && mk){
        input.value = term;
        realClick(mk);
        setTimeout(()=> purchaseMultiple(term,qty,count),500);
      }
    }
  });

})();
