// ==UserScript==
// @name         Google Search Maps Fix
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Bring Google maps button back
// @author       Ovinomaster
// @include      https://www.google.tld/search*
// @icon         https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png
// @grant        none
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @homepageURL  https://greasyfork.org/it/users/1271103-ovinomaster
// @downloadURL https://update.greasyfork.org/scripts/489176/Google%20Search%20Maps%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/489176/Google%20Search%20Maps%20Fix.meta.js
// ==/UserScript==
(function() {
  'use strict';

  function addMapsTab() {
    // Target the new navigation container
    const navList = document.querySelector('div.beZ0tf.O1uzAe[role="list"]');
    if (!navList) return;

    // Skip if "Maps" already exists
    if (navList.querySelector('span.R1QWuf')?.textContent === 'Maps' ||
        navList.querySelector('a[data-added-by-userscript="maps"]')) return;

    // Clone an existing tab for structure consistency
    const refItem = navList.querySelector('div[role="listitem"]');
    if (!refItem) return;

    const newItem = refItem.cloneNode(true);
    const newLink = newItem.querySelector('a.C6AK7c');
    const q = new URLSearchParams(window.location.search).get('q') || '';

    if (!newLink) return;

    // Update link
    newLink.href = `https://www.google.com/maps?q=${encodeURIComponent(q)}`;
    // newLink.target = '_blank';
    newLink.setAttribute('data-added-by-userscript', 'maps');

    // Clean up styles & attributes
    newLink.removeAttribute('aria-disabled');
    newLink.removeAttribute('aria-current');
    newLink.removeAttribute('selected');
    newLink.style.color = '';
    newLink.style.textDecoration = '';

    // Replace text
    const label = newLink.querySelector('span.R1QWuf');
    if (label) label.textContent = 'Maps';

    // Insert the new tab after the first one (usually "All")
    navList.insertBefore(newItem, navList.children[1]);
  }

  // function makeMiniMapClickable() {
    // const q = new URLSearchParams(window.location.search).get('q') || '';
    // const mapsLink = `https://www.google.com/maps?q=${encodeURIComponent(q)}`;
    // const mini = document.querySelector('.pyitY, [data-attrid*="map"]');
    // if (mini && !mini.closest('a')) {
      // const a = document.createElement('a');
      // a.href = mapsLink;
      // a.target = '_blank';
      // a.style.display = 'block';
      // a.style.textDecoration = 'none';
      // while (mini.firstChild) a.appendChild(mini.firstChild);
      // mini.appendChild(a);
    // }
  // }

  // Keep trying since Google loads this asynchronously
  const observer = new MutationObserver(() => addMapsTab());
  observer.observe(document.body, { childList: true, subtree: true });

  // Run now and periodically
  addMapsTab();
  makeMiniMapClickable();
  setInterval(addMapsTab, 3000);
})();