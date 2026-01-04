// ==UserScript==
// @name         Torn Auction House Quick Indicator
// @namespace    http://tampermonkey.net/
// @author       13lackfir3
// @version      1.5
// @description  Adds a color coded perk with is percentage placement within that per color range and adds a quick visual icon for 70% and 90%. added armor //               to the script. 
// @match        https://www.torn.com/amarket.php*
// @match        https://www.torn.com/items.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534137/Torn%20Auction%20House%20Quick%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/534137/Torn%20Auction%20House%20Quick%20Indicator.meta.js
// ==/UserScript==


(function(){
  'use strict';

  // ─── Table-sourced Yellow/Orange/Red bands per weapon perk & armor perk ──────
  const thresholdRanges = {
    // Weapon perks (unchanged from v1.4)…
    "Achilles":      {yellow:{min:50,max:73},  orange:{min:77,max:98},  red:{min:114,max:142}},
    "Assassinate":   {yellow:{min:50,max:69},  orange:{min:70,max:93},  red:{min:110,max:148}},
    "Backstab":      {yellow:{min:30,max:40},  orange:{min:45,max:52},  red:{min:79,max:96}},
    "Berserk":       {yellow:{min:20,max:34},  orange:{min:39,max:53},  red:{min:60,max:87}},
    "Bleed":         {yellow:{min:20,max:30},  orange:{min:31,max:44},  red:{min:53,max:67}},
    "Blindside":     {yellow:{min:25,max:37},  orange:{min:41,max:59},  red:{min:73,max:96}},
    "Bloodlust":     {yellow:{min:10,max:12},  orange:{min:12,max:14},  red:{min:17, max:17}},
    "Comeback":      {yellow:{min:50,max:66},  orange:{min:70,max:99},  red:{min:102,max:127}},
    "Conserve":      {yellow:{min:25,max:29},  orange:{min:30,max:36},  red:{min:43,max:49}},
    "Cripple":       {yellow:{min:20,max:28},  orange:{min:29,max:40},  red:{min:52,max:58}},
    "Crusher":       {yellow:{min:50,max:72},  orange:{min:76,max:102}, red:{min:133,max:133}},
    "Cupid":         {yellow:{min:50,max:74},  orange:{min:75,max:110}, red:{min:124,max:157}},
    "Deadeye":       {yellow:{min:25,max:45},  orange:{min:46,max:72},  red:{min:76,max:123}},
    "Deadly":        {yellow:{min:2, max:3},   orange:{min:4, max:6},   red:{min:9,  max:9}},
    "Disarm":        {yellow:{min:3, max:5},   orange:{min:0, max:0},   red:{min:9,  max:15}},  // no orange per table
    "Double-edged":  {yellow:{min:10,max:15},  orange:{min:16,max:24},  red:{min:32,max:32}},
    "Double Tap":    {yellow:{min:15,max:23},  orange:{min:25,max:35},  red:{min:40,max:54}},
    "Empower":       {yellow:{min:52,max:85},  orange:{min:90,max:140}, red:{min:180,max:206}},
    "Eviscerate":    {yellow:{min:15,max:18},  orange:{min:19,max:24},  red:{min:26,max:34}},
    "Execute":       {yellow:{min:15,max:18},  orange:{min:18,max:22},  red:{min:23,max:28}},
    "Expose":        {yellow:{min:7, max:9},   orange:{min:10,max:14},  red:{min:14,max:21}},
    "Finale":        {yellow:{min:10,max:11},  orange:{min:12,max:13},  red:{min:13,max:17}},
    "Focus":         {yellow:{min:15,max:19},  orange:{min:20,max:24},  red:{min:32,max:32}},
    "Frenzy":        {yellow:{min:5, max:7},   orange:{min:7, max:9},   red:{min:10,max:14}},
    "Fury":          {yellow:{min:10,max:15},  orange:{min:16,max:23},  red:{min:26,max:34}},
    "Grace":         {yellow:{min:20,max:31},  orange:{min:38,max:49},  red:{min:60,max:66}},
    "Home Run":      {yellow:{min:50,max:59},  orange:{min:62,max:71},  red:{min:71,max:87}},
    "Irradiate":     {yellow:{min:100,max:100},orange:{min:100,max:100},red:{min:100,max:100}},
    "Motivation":    {yellow:{min:15,max:19},  orange:{min:19,max:25},  red:{min:26,max:35}},
    "Paralyzed":     {yellow:{min:5, max:8},   orange:{min:0, max:0},   red:{min:17,max:18}},  // no orange per table
    "Parry":         {yellow:{min:50,max:59},  orange:{min:62,max:71},  red:{min:71,max:87}},
    "Penetrate":     {yellow:{min:25,max:28},  orange:{min:30,max:37},  red:{min:39,max:49}},
    "Plunder":       {yellow:{min:20,max:25},  orange:{min:26,max:33},  red:{min:36,max:49}},
    "Powerful":      {yellow:{min:15,max:21},  orange:{min:22,max:32},  red:{min:34,max:45}},
    "Proficience":   {yellow:{min:20,max:28},  orange:{min:29,max:38},  red:{min:44,max:59}},
    "Proficient":    {yellow:{min:20,max:28},  orange:{min:29,max:38},  red:{min:44,max:59}},  // alias
    "Puncture":      {yellow:{min:20,max:27},  orange:{min:29,max:39},  red:{min:46,max:57}},
    "Quicken":       {yellow:{min:50,max:88},  orange:{min:91,max:149}, red:{min:154,max:219}},
    "Rage":          {yellow:{min:4, max:6},   orange:{min:6, max:9},   red:{min:12,max:15}},
    "Revitalize":    {yellow:{min:10,max:13},  orange:{min:13,max:17},  red:{min:18,max:24}},
    "Roshambo":      {yellow:{min:50,max:69},  orange:{min:76,max:90},  red:{min:132,max:132}},
    "Slow":          {yellow:{min:20,max:28},  orange:{min:29,max:41},  red:{min:43,max:64}},
    "Smurf":         {yellow:{min:1, max:1},   orange:{min:2, max:2},   red:{min:4,  max:4}},
    "Specialist":    {yellow:{min:20,max:27},  orange:{min:28,max:37},  red:{min:40,max:52}},
    "Stricken":      {yellow:{min:30,max:43},  orange:{min:44,max:54},  red:{min:85,max:96}},
    "Stun":          {yellow:{min:10,max:15},  orange:{min:16,max:23},  red:{min:25,max:40}},
    "Suppress":      {yellow:{min:25,max:31},  orange:{min:33,max:40},  red:{min:25,max:49}},  // uses known max
    "Sure Shot":     {yellow:{min:3, max:4},   orange:{min:5, max:8},   red:{min:8,  max:11}},
    "Throttle":      {yellow:{min:50,max:71},  orange:{min:76,max:105}, red:{min:119,max:170}},
    "Warlord":       {yellow:{min:15,max:19},  orange:{min:20,max:27},  red:{min:28,max:45}},
    "Weaken":        {yellow:{min:20,max:28},  orange:{min:29,max:40},  red:{min:44,max:63}},
    "Wind-up":       {yellow:{min:125,max:145},orange:{min:145,max:167},red:{min:177,max:221}},
    "Wither":        {yellow:{min:20,max:28},  orange:{min:29,max:42},  red:{min:45,max:63}},

    // Armor perks (slot-specific):
    "Impregnable":    {yellow:{min:20,max:29}, orange:{min:20,max:29}, red:{min:20,max:29}},
    "Impenetrable":   {yellow:{min:20,max:29}, orange:{min:20,max:29}, red:{min:20,max:29}},
    "Insurmountable": {yellow:{min:30,max:39}, orange:{min:30,max:39}, red:{min:30,max:39}},
    "Impassable":     {yellow:{min:20,max:28}, orange:{min:20,max:28}, red:{min:20,max:28}},
    "Invulnerable": {
      slots: {
        gasmask:   {yellow:{min:12,max:14}, orange:{min:12,max:14}, red:{min:12,max:14}},
        body:      {yellow:{min:8, max:10}, orange:{min:8, max:10}, red:{min:8, max:10}},
        pants:     {yellow:{min:7, max:9 }, orange:{min:7, max:9 }, red:{min:7, max:9 }},
        gloves:    {yellow:{min:4, max:6 }, orange:{min:4, max:6 }, red:{min:4, max:6 }},
        boots:     {yellow:{min:4, max:7 }, orange:{min:4, max:7 }, red:{min:4, max:7 }}
      }
    },
    "Imperviable": {
      slots: {
        facemask:  {yellow:{min:5, max:7},  orange:{min:5, max:7},  red:{min:5, max:7}},
        body:      {yellow:{min:7, max:10}, orange:{min:7, max:10}, red:{min:7, max:10}},
        pants:     {yellow:{min:4, max:6},  orange:{min:4, max:6},  red:{min:4, max:6}},
        gloves:    {yellow:{min:2, max:3},  orange:{min:2, max:3},  red:{min:2, max:3}},
        boots:     {yellow:{min:2, max:3},  orange:{min:2, max:3},  red:{min:2, max:3}}
      }
    },
    "Immutable": {
      slots: {
        helmet:    {yellow:{min:30,max:40}, orange:{min:30,max:40}, red:{min:30,max:40}},
        body:      {yellow:{min:40,max:50}, orange:{min:40,max:50}, red:{min:40,max:50}},
        pants:     {yellow:{min:25,max:30}, orange:{min:25,max:30}, red:{min:25,max:30}},
        gloves:    {yellow:{min:15,max:18}, orange:{min:15,max:18}, red:{min:15,max:18}},
        boots:     {yellow:{min:15,max:19}, orange:{min:15,max:19}, red:{min:15,max:19}}
      }
    },
    "Irrepressible": {
      slots: {
        respirator:{yellow:{min:30,max:39}, orange:{min:30,max:39}, red:{min:30,max:39}},
        helmet:    {yellow:{min:30,max:39}, orange:{min:30,max:39}, red:{min:30,max:39}},
        body:      {yellow:{min:40,max:52}, orange:{min:40,max:52}, red:{min:40,max:52}},
        pants:     {yellow:{min:25,max:33}, orange:{min:25,max:33}, red:{min:25,max:33}},
        gloves:    {yellow:{min:15,max:18}, orange:{min:15,max:18}, red:{min:15,max:18}},
        boots:     {yellow:{min:15,max:19}, orange:{min:15,max:19}, red:{min:15,max:19}}
      }
    }
  };

  // ─── Normalize lookup keys ────────────────────────────────────────────────────
  const normalized = {};
  Object.entries(thresholdRanges).forEach(([k,v]) => {
    normalized[k.toLowerCase().replace(/[\s'-]/g,'')] = v;
  });

  // ─── Map item‐name suffix → slot‐key in `slots` ───────────────────────────────
  const slotMap = {
    respirator: 'respirator',
    'gas mask': 'gasmask',
    'face mask': 'facemask',
    helmet:     'helmet',
    body:       'body',
    pants:      'pants',
    gloves:     'gloves',
    boots:      'boots',
    apron:      'body'  // sentinel apron maps to body
  };

  // ─── Compute & clamp % through a band ────────────────────────────────────────
  function pct(raw, band) {
    const p = (raw - band.min) / (band.max - band.min) * 100;
    return Math.round(Math.max(0, Math.min(100, p)));
  }

  // ─── Process a single item once ──────────────────────────────────────────────
  function processItem(item) {
    if (item.dataset.scanned) return;
    item.dataset.scanned = '1';
    item.querySelectorAll('.bonus-quality').forEach(el => el.remove());

    const aria  = item.querySelector('.view-info')?.getAttribute('aria-label');
    const spot  = item.querySelector('.title p.t-gray-6');
    if (!aria || !spot) return;

    // detect slotKey from item name suffix
    const titleText = item.querySelector('.title .item-name')?.textContent.trim().toLowerCase() || '';
    let slotKey = null;
    for (const alias in slotMap) {
      if (titleText.endsWith(alias)) {
        slotKey = slotMap[alias];
        break;
      }
    }

    // match "Name: ...NN%..." or "...NN turns"
    const regex = /([A-Za-z\s'-]+):[^0-9]*(\d+(?:\.\d+)?)(?:%|\s*turns?)/g;
    for (const m of aria.matchAll(regex)) {
      const name    = m[1].trim();
      const raw     = parseFloat(m[2]);
      const key     = name.toLowerCase().replace(/[\s'-]/g,'');
      const entry   = normalized[key];
      if (!entry) continue;

      // choose bands based on slotKey if slot-specific
      let bands = entry;
      if (entry.slots) {
        if (!slotKey) continue;
        bands = entry.slots[slotKey];
        if (!bands) continue;
      }

      // pick the correct sub-band
      const band = (raw >= bands.red.min    && raw <= bands.red.max)    ? bands.red
                 : (raw >= bands.orange.min && raw <= bands.orange.max) ? bands.orange
                 :                                                        bands.yellow;
      const percent = pct(raw, band);
      const icon    = percent >= 90 ? '💎'
                    : percent >= 70 ? '🟡'
                    : percent >= 40 ? '🟢'
                    :                   '🔴';
      const color   = band === bands.red    ? 'red'
                    : band === bands.orange ? 'orange'
                    :                            'yellow';

      const span = document.createElement('span');
      Object.assign(span.style, {
        display:    'block',
        fontSize:   '11px',
        fontWeight: 'bold',
        marginTop:  '2px',
        color
      });
      span.className   = 'bonus-quality';
      span.textContent = `${name}: ${percent}% ${icon}`;
      spot.insertAdjacentElement('afterend', span);
    }
  }

  // ─── Scan loop: start on first item then every 3s ────────────────────────────
  function scanAll() {
    document.querySelectorAll('.item-cont-wrap:not([data-scanned])')
            .forEach(processItem);
  }
  new MutationObserver((_, obs) => {
    if (document.querySelector('.item-cont-wrap')) {
      obs.disconnect();
      scanAll();
      setInterval(scanAll, 3000);
    }
  }).observe(document.body, { childList:true, subtree:true });

})();