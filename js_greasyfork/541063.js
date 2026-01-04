// ==UserScript==
// @name         Techmeme Archive Link Replacer
// @namespace    https://github.com/denlekke
// @version      0.7
// @description  Replace Techmeme headlines with archive.ph snapshots, append 🔗 back to original, open all in new tabs, without heavy observers.
// @match        https://techmeme.com/*
// @match        https://www.techmeme.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541063/Techmeme%20Archive%20Link%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/541063/Techmeme%20Archive%20Link%20Replacer.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  const MAPPING_URL = 'https://raw.githubusercontent.com/denlekke/archive_links/main/archive_map.json';

  // Load mapping once
  let mapping = {};
  try {
    const resp = await fetch(MAPPING_URL);
    if (!resp.ok) throw new Error(resp.status);
    mapping = await resp.json();
  } catch (err) {
    console.error('Archive mapping load failed:', err);
    return;
  }

  // Normalize URLs: drop ? # trailing slash, force HTTPS
  function normalize(url) {
    try {
      const u = new URL(url, location.origin);
      u.search = '';
      u.hash   = '';
      let s = u.href.replace(/\/$/, '');
      if (s.startsWith('http://')) s = 'https://' + s.slice(7);
      return s;
    } catch {
      return url.split(/[?#]/)[0].replace(/\/$/, '');
    }
  }

  // Try both schemes when looking up
  function findArchive(orig) {
    if (mapping[orig]) return mapping[orig];
    if (orig.startsWith('https://')) {
      const alt = 'http://' + orig.slice(8);
      if (mapping[alt]) return mapping[alt];
    } else if (orig.startsWith('http://')) {
      const alt = 'https://' + orig.slice(7);
      if (mapping[alt]) return mapping[alt];
    }
    return null;
  }

  // Replace only the headline links (anchors with class "ourh")
  const anchors = document.querySelectorAll('a.ourh');
  for (const link of anchors) {
    const orig = normalize(link.href);
    const arch = findArchive(orig);
    if (!arch) continue;

    // swap to archive.ph snapshot
    link.href   = arch;
    link.target = '_blank';
    link.rel    = 'noopener noreferrer';

    // append 🔗 back to original
    const back = document.createElement('a');
    back.href        = orig;
    back.textContent = ' 🔗';
    back.title       = 'View original';
    back.target      = '_blank';
    back.rel         = 'noopener noreferrer';
    back.style.marginLeft = '4px';
    link.insertAdjacentElement('afterend', back);
  }
})();
