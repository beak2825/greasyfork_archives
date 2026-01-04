// ==UserScript==
// @name        SolvedJigidi Links
// @namespace   owenvoke
// @match       https://www.geocaching.com/geocache/GC*
// @grant       none
// @version     1.0.0
// @author      Owen Voke
// @license     MIT
// @description Adds Solved Jigidi links to the cache page.
// @grant       GM.getValue
// @grant       GM.setValue
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/540945/SolvedJigidi%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/540945/SolvedJigidi%20Links.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const element = document.getElementById('uxLatLon');
  const showSolvedJigidiLink = GM.getValue('showSolvedJigidiLink', true);
  const showFacebookLink = GM.getValue('showFacebookLink', true);

  if (! showSolvedJigidiLink && ! showFacebookLink) {
    return;
  }

  // If coordinates have been changed, don't show the link.
  if (element.hasAttribute('class') && ! element.getAttribute('class').includes('myLatLon')) {
    return;
  }

  const gcCode = document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').innerText;
  const cacheTable = document.getElementById('ctl00_ContentBody_CacheInformationTable');

  const container = document.createElement('div');
  const mainLink = document.createElement('a');
  const facebookLink = document.createElement('a');
  const img = document.createElement('img');

  container.setAttribute('style', 'padding: 0 0.5em 1em 0.5em; display: flex;');

  mainLink.setAttribute('title', 'Search for solved coordinates on Solved Jigidi.');
  mainLink.setAttribute('target', '_blank');
  mainLink.setAttribute('href', `https://solvedjigidi.com/search.php?gc=${gcCode}`);
  mainLink.setAttribute('style', 'margin-left: 1em;');
  mainLink.innerText = 'SolvedJigidi';

  facebookLink.setAttribute('title', 'Search for solved coordinates on Geo-jigidi-solve n\' share Facebook group.');
  facebookLink.setAttribute('target', '_blank');
  facebookLink.setAttribute('href', `https://www.facebook.com/groups/solved/search?q=%22${gcCode}%22`);
  facebookLink.setAttribute('style', 'margin-left: 1em;');
  facebookLink.innerText = 'Geo-jigidi-solve n\' share';

  img.setAttribute('src', 'https://solvedjigidi.com/logo.jpg');
  img.setAttribute('style', 'width: 16px; height: 16px;');

  container.append(img);

  if (showSolvedJigidiLink) {
    container.append(mainLink);
  }

  if (showFacebookLink) {
    container.append(facebookLink);
  }

  cacheTable.after(container);
})();
