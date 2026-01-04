// ==UserScript==
// @name         Torn: Inverted Vertical Bar + Stacked Raw-Value Labels (Full Perk List, Reactive)
// @namespace    http://tampermonkey.net/
// @version      Beta 1.3
// @description  beta testing for new script 
// @match        https://www.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540374/Torn%3A%20Inverted%20Vertical%20Bar%20%2B%20Stacked%20Raw-Value%20Labels%20%28Full%20Perk%20List%2C%20Reactive%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540374/Torn%3A%20Inverted%20Vertical%20Bar%20%2B%20Stacked%20Raw-Value%20Labels%20%28Full%20Perk%20List%2C%20Reactive%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ────────────────────────────────────────────────────────────────────────────────
  // 1) THRESHOLD TABLE (ALL PERKS) – maps perk name → { yellow:{min,max}, orange:{…}, red:{…} }
  //    Armor perks with slot-specific sub-objects.
  // ────────────────────────────────────────────────────────────────────────────────
  const thresholdRanges = {
    // Weapon perks
    "Achilles":      { yellow:{min:50,max:73},  orange:{min:77,max:98},  red:{min:114,max:142} },
    "Assassinate":   { yellow:{min:50,max:69},  orange:{min:70,max:93},  red:{min:110,max:148} },
    "Backstab":      { yellow:{min:30,max:40},  orange:{min:45,max:52},  red:{min:79,max:96} },
    "Berserk":       { yellow:{min:20,max:34},  orange:{min:39,max:53},  red:{min:60,max:87} },
    "Bleed":         { yellow:{min:20,max:30},  orange:{min:31,max:44},  red:{min:53,max:67} },
    "Blindside":     { yellow:{min:25,max:37},  orange:{min:41,max:59},  red:{min:73,max:96} },
    "Bloodlust":     { yellow:{min:10,max:12},  orange:{min:12,max:14},  red:{min:17, max:17} },
    "Comeback":      { yellow:{min:50,max:66},  orange:{min:70,max:99},  red:{min:102,max:127} },
    "Conserve":      { yellow:{min:25,max:29},  orange:{min:30,max:36},  red:{min:43,max:49} },
    "Cripple":       { yellow:{min:20,max:28},  orange:{min:29,max:40},  red:{min:52,max:58} },
    "Crusher":       { yellow:{min:50,max:72},  orange:{min:76,max:102}, red:{min:133,max:133} },
    "Cupid":         { yellow:{min:50,max:74},  orange:{min:75,max:110}, red:{min:124,max:157} },
    "Deadeye":       { yellow:{min:25,max:45},  orange:{min:46,max:72},  red:{min:76,max:123} },
    "Deadly":        { yellow:{min:2, max:3},   orange:{min:4, max:6},   red:{min:9,  max:9} },
    "Disarm":        { yellow:{min:3, max:5},   orange:{min:0, max:0},   red:{min:9,  max:15} },  // no orange
    "Double-edged":  { yellow:{min:10,max:15},  orange:{min:16,max:24},  red:{min:32,max:32} },
    "Double Tap":    { yellow:{min:15,max:23},  orange:{min:25,max:35},  red:{min:40,max:54} },
    "Empower":       { yellow:{min:52,max:85},  orange:{min:90,max:140}, red:{min:180,max:206} },
    "Eviscerate":    { yellow:{min:15,max:18},  orange:{min:19,max:24},  red:{min:26,max:34} },
    "Execute":       { yellow:{min:15,max:18},  orange:{min:18,max:22},  red:{min:23,max:28} },
    "Expose":        { yellow:{min:7, max:9},   orange:{min:10,max:14},  red:{min:14,max:21} },
    "Finale":        { yellow:{min:10,max:11},  orange:{min:12,max:13},  red:{min:13,max:17} },
    "Focus":         { yellow:{min:15,max:19},  orange:{min:20,max:24},  red:{min:32,max:32} },
    "Frenzy":        { yellow:{min:5, max:7},   orange:{min:7, max:9},   red:{min:10,max:14} },
    "Fury":          { yellow:{min:10,max:15},  orange:{min:16,max:23},  red:{min:26,max:34} },
    "Grace":         { yellow:{min:20,max:31},  orange:{min:38,max:49},  red:{min:60,max:66} },
    "Home Run":      { yellow:{min:50,max:59},  orange:{min:62,max:71},  red:{min:71,max:87} },
    "Irradiate":     { yellow:{min:100,max:100},orange:{min:100,max:100},red:{min:100,max:100} },
    "Motivation":    { yellow:{min:15,max:19},  orange:{min:19,max:25},  red:{min:26,max:35} },
    "Paralyzed":     { yellow:{min:5, max:8},   orange:{min:0, max:0},   red:{min:17,max:18} },  // no orange
    "Parry":         { yellow:{min:50,max:59},  orange:{min:62,max:71},  red:{min:71,max:87} },
    "Penetrate":     { yellow:{min:25,max:28},  orange:{min:30,max:37},  red:{min:39,max:49} },
    "Plunder":       { yellow:{min:20,max:25},  orange:{min:26,max:33},  red:{min:36,max:49} },
    "Powerful":      { yellow:{min:15,max:21},  orange:{min:22,max:32},  red:{min:34,max:45} },
    "Proficience":   { yellow:{min:20,max:28},  orange:{min:29,max:38},  red:{min:44,max:59} },
    "Proficient":    { yellow:{min:20,max:28},  orange:{min:29,max:38},  red:{min:44,max:59} },  // alias
    "Puncture":      { yellow:{min:20,max:27},  orange:{min:29,max:39},  red:{min:46,max:57} },
    "Quicken":       { yellow:{min:50,max:88},  orange:{min:91,max:149}, red:{min:154,max:219} },
    "Rage":          { yellow:{min:4, max:6},   orange:{min:6, max:9},   red:{min:12,max:15} },
    "Revitalize":    { yellow:{min:10,max:13},  orange:{min:13,max:17},  red:{min:18,max:24} },
    "Roshambo":      { yellow:{min:50,max:69},  orange:{min:76,max:90},  red:{min:132,max:132} },
    "Slow":          { yellow:{min:20,max:28},  orange:{min:29,max:41},  red:{min:43,max:64} },
    "Smurf":         { yellow:{min:1, max:1},   orange:{min:2, max:2},   red:{min:4,  max:4} },
    "Specialist":    { yellow:{min:20,max:27},  orange:{min:28,max:37},  red:{min:40,max:52} },
    "Stricken":      { yellow:{min:30,max:43},  orange:{min:44,max:54},  red:{min:85,max:96} },
    "Stun":          { yellow:{min:10,max:15},  orange:{min:16,max:23},  red:{min:25,max:40} },
    "Suppress":      { yellow:{min:25,max:31},  orange:{min:33,max:40},  red:{min:25,max:49} },  // uses known max
    "Sure Shot":     { yellow:{min:3, max:4},   orange:{min:5, max:8},   red:{min:8,  max:11} },
    "Throttle":      { yellow:{min:50,max:71},  orange:{min:76,max:105}, red:{min:119,max:170} },
    "Warlord":       { yellow:{min:15,max:19},  orange:{min:20,max:27},  red:{min:28,max:45} },
    "Weaken":        { yellow:{min:20,max:28},  orange:{min:29,max:40},  red:{min:44,max:63} },
    "Wind-up":       { yellow:{min:125,max:145},orange:{min:145,max:167},red:{min:177,max:221} },
    "Wither":        { yellow:{min:20,max:28},  orange:{min:29,max:42},  red:{min:45,max:63} },

    // Armor perks (slot-specific)
    "Impregnable":    { yellow:{min:20,max:29}, orange:{min:20,max:29}, red:{min:20,max:29} },
    "Impenetrable":   { yellow:{min:20,max:29}, orange:{min:20,max:29}, red:{min:20,max:29} },
    "Insurmountable": { yellow:{min:30,max:39}, orange:{min:30,max:39}, red:{min:30,max:39} },
    "Impassable":     { yellow:{min:20,max:28}, orange:{min:20,max:28}, red:{min:20,max:28} },
    "Invulnerable": {
      slots: {
        gasmask:   { yellow:{min:12,max:14}, orange:{min:12,max:14}, red:{min:12,max:14} },
        body:      { yellow:{min:8, max:10}, orange:{min:8, max:10}, red:{min:8, max:10} },
        pants:     { yellow:{min:7, max:9 }, orange:{min:7, max:9 }, red:{min:7, max:9 } },
        gloves:    { yellow:{min:4, max:6 }, orange:{min:4, max:6 }, red:{min:4, max:6 } },
        boots:     { yellow:{min:4, max:7 }, orange:{min:4, max:7 }, red:{min:4, max:7 } }
      }
    },
    "Imperviable": {
      slots: {
        facemask:  { yellow:{min:5, max:7},  orange:{min:5, max:7},  red:{min:5, max:7} },
        body:      { yellow:{min:7, max:10}, orange:{min:7, max:10}, red:{min:7, max:10} },
        pants:     { yellow:{min:4, max:6},  orange:{min:4, max:6},  red:{min:4, max:6} },
        gloves:    { yellow:{min:2, max:3},  orange:{min:2, max:3},  red:{min:2, max:3} },
        boots:     { yellow:{min:2, max:3},  orange:{min:2, max:3},  red:{min:2, max:3} }
      }
    },
    "Immutable": {
      slots: {
        helmet:    { yellow:{min:30,max:40}, orange:{min:30,max:40}, red:{min:30,max:40} },
        body:      { yellow:{min:40,max:50}, orange:{min:40,max:50}, red:{min:40,max:50} },
        pants:     { yellow:{min:25,max:30}, orange:{min:25,max:30}, red:{min:25,max:30} },
        gloves:    { yellow:{min:15,max:18}, orange:{min:15,max:18}, red:{min:15,max:18} },
        boots:     { yellow:{min:15,max:19}, orange:{min:15,max:19}, red:{min:15,max:19} }
      }
    },
    "Irrepressible": {
      slots: {
        respirator:{ yellow:{min:30,max:39}, orange:{min:30,max:39}, red:{min:30,max:39} },
        helmet:    { yellow:{min:30,max:39}, orange:{min:30,max:39}, red:{min:30,max:39} },
        body:      { yellow:{min:40,max:52}, orange:{min:40,max:52}, red:{min:40,max:52} },
        pants:     { yellow:{min:25,max:33}, orange:{min:25,max:33}, red:{min:25,max:33} },
        gloves:    { yellow:{min:15,max:18}, orange:{min:15,max:18}, red:{min:15,max:18} },
        boots:     { yellow:{min:15,max:19}, orange:{min:15,max:19}, red:{min:15,max:19} }
      }
    }
  };

    // 2) NORMALIZE KEYS
  const normalized = {};
  Object.entries(thresholdRanges).forEach(([perk, bands]) => {
    normalized[perk.toLowerCase().replace(/[^a-z0-9]/g, '')] = bands;
  });

  // 3) TIER COLOR
  function tierColor(raw) {
    for (const bands of Object.values(normalized)) {
      if (bands.red && raw >= bands.red.min && raw <= bands.red.max) return 'red';
      if (bands.orange && raw >= bands.orange.min && raw <= bands.orange.max) return 'orange';
      if (bands.yellow && raw >= bands.yellow.min && raw <= bands.yellow.max) return 'yellow';
    }
    return 'yellow';
  }

  // 4) AUCTION HOUSE ITEMS
  function processAuctionItem(item) {
    if (item.dataset.scanned) return;
    item.dataset.scanned = '1';

    // get correct thumbnail wrapper
    const imgWrap = item.querySelector('.img-wrap');
    if (!imgWrap) return;
    if (getComputedStyle(imgWrap).position === 'static') imgWrap.style.position = 'relative';
    imgWrap.querySelectorAll('.perk-bar-container, .perk-label').forEach(el => el.remove());

    // get aria-label from view-info button
    const aria = item.querySelector('button.view-info[aria-label]')?.getAttribute('aria-label');
    if (!aria) return;

    // detect slotKey
    const titleText = item.querySelector('.title .item-name')?.textContent.trim().toLowerCase() || '';
    const slotMap = { respirator:'respirator','gas mask':'gasmask','face mask':'facemask',helmet:'helmet',body:'body',pants:'pants',gloves:'gloves',boots:'boots',apron:'body' };
    let slotKey = null;
    Object.keys(slotMap).forEach(alias => { if (titleText.endsWith(alias)) slotKey = slotMap[alias]; });

    // parse perks
    const regex = /([A-Za-z\s'-]+):[^0-9]*(\d+(?:\.\d+)?)(?:%|\s*turns?)/g;
    let barContainer=null,labelOffset=2;
    for (const m of aria.matchAll(regex)) {
      const perkName=m[1].trim(), raw=parseFloat(m[2]);
      const key=perkName.toLowerCase().replace(/[^a-z0-9]/g,'');
      const entry=normalized[key];
      if (!entry) continue;
      let bands=entry;
      if (entry.slots) { if (!slotKey) continue; bands=entry.slots[slotKey]; if(!bands)continue; }
      const color=tierColor(raw);

      if (!barContainer) {
        barContainer=document.createElement('div');
        barContainer.className='perk-bar-container';
        Object.assign(barContainer.style,{position:'absolute',top:0,right:0,width:'4px',height:'100%',background:'#222',borderRadius:'0 2px 2px 0',overflow:'hidden',zIndex:999});
        const fill=document.createElement('div');
        Object.assign(fill.style,{width:'100%',height:'100%',background:'linear-gradient(to top, red 0%, green 50%, gold 100%)'});
        barContainer.appendChild(fill);
        imgWrap.appendChild(barContainer);
      }
      const marker=document.createElement('div');
      Object.assign(marker.style,{position:'absolute',left:0,bottom:`calc(${raw}% - 1px)`,width:'100%',height:'2px',backgroundColor:'#fff',zIndex:1000});
      barContainer.appendChild(marker);

      const label=document.createElement('div');
      label.className='perk-label'; label.textContent=`${perkName}: ${raw}%`;
      Object.assign(label.style,{position:'absolute',top:`${labelOffset}px`,left:'2px',right:'6px',fontSize:'12px',fontWeight:'bold',color, textShadow:'0 0 1px #000',zIndex:999,pointerEvents:'none',textAlign:'left'});
      imgWrap.appendChild(label);

      labelOffset+=7;
    }
  }

  // 5) ITEM MARKET
  function processMarketItem(tile) {
    if (tile.dataset.scanned) return;
    tile.dataset.scanned='1';

    const imgWrap=tile.querySelector('.imageWrapper___RqvUg');
    if(!imgWrap) return;
    if(getComputedStyle(imgWrap).position==='static')imgWrap.style.position='relative';
    imgWrap.querySelectorAll('.perk-bar-container,.perk-label').forEach(el=>el.remove());

    const icons=tile.querySelectorAll('.bonuses___a8gmz i[aria-label][data-bonus-attachment-description]');
    if(!icons.length) return;
    let barContainer=imgWrap.querySelector('.perk-bar-container');
    if(!barContainer){
      barContainer=document.createElement('div');barContainer.className='perk-bar-container';
      Object.assign(barContainer.style,{position:'absolute',top:0,right:0,width:'4px',height:'100%',background:'#222',borderRadius:'0 2px 2px 0',overflow:'hidden',zIndex:999});
      const fill=document.createElement('div');Object.assign(fill.style,{width:'100%',height:'100%',background:'linear-gradient(to top, red 0%, green 50%, gold 100%)'});
      barContainer.appendChild(fill);imgWrap.appendChild(barContainer);
    }
    let offset=2;
    icons.forEach(icon=>{
      const name=icon.dataset.bonusAttachmentTitle||icon.getAttribute('aria-label')||'';
      const m=icon.dataset.bonusAttachmentDescription.match(/(\d+(?:\.\d+)?)%/);
      if(!m) return;
      const raw=parseFloat(m[1]), color=tierColor(raw);
      const marker=document.createElement('div');Object.assign(marker.style,{position:'absolute',left:0,bottom:`calc(${raw}% - 1px)`,width:'100%',height:'2px',backgroundColor:'#fff',zIndex:1000});barContainer.appendChild(marker);
      const label=document.createElement('div');label.className='perk-label';label.textContent=`${name}: ${raw}%`;
      Object.assign(label.style,{position:'absolute',top:`${offset}px`,left:'2px',right:'6px',fontSize:'12px',fontWeight:'bold',color,textShadow:'0 0 1px #000',zIndex:999,pointerEvents:'none',textAlign:'left'});
      imgWrap.appendChild(label);offset+=7;
    });
  }

  // 6) PROCESS ALL
  function processAll(){
    document.querySelectorAll('.item-cont-wrap:not([data-scanned])').forEach(processAuctionItem);
    document.querySelectorAll('.itemTile___cbw7w:not([data-scanned])').forEach(processMarketItem);
  }

  // 7) OBSERVER
  const obs=new MutationObserver(processAll);
  obs.observe(document.body,{childList:true,subtree:true});
  processAll();
})();