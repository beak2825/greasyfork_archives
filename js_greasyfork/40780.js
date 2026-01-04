// ==UserScript==
// @name         RED External Tracker Search
// @version      0.3
// @description  Adds External Tracker Search Links to Release and Request pages.
// @author       mrpoot
// @include      https://redacted.ch/requests.php?action=view&*
// @include      https://redacted.ch/torrents.php?id=*
// @grant        none
// @namespace https://greasyfork.org/users/148773
// @downloadURL https://update.greasyfork.org/scripts/40780/RED%20External%20Tracker%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/40780/RED%20External%20Tracker%20Search.meta.js
// ==/UserScript==

(() => {

  const GAZELLE = 'GAZELLE';
  const TBDEV = 'TVDEV';

  const paths = {
    [GAZELLE]: '/torrents.php?artistname={artist}&groupname={title}',
    [TBDEV]: '/browse.php?q={artist}+{title}',
  };

  // Edit these to add/remove external trackers to search
  const sites = [
    {
      name: 'Apollo',
      domain: 'apollo.rip',
      icon: 'https://i.imgur.com/75DnY5D.png',
      type: GAZELLE,
    },
    {
      name: 'NotWhat.CD',
      domain: 'notwhat.cd',
      icon: 'https://i.imgur.com/pDxcJi8.png',
      type: GAZELLE,
    },
    {
      name: 'DeepBass9',
      domain: 'www.deepbassnine.com',
      icon: 'https://i.imgur.com/o7WKGXK.png',
      type: GAZELLE,
    },
    {
      name: 'Waffles',
      domain: 'waffles.ch',
      icon: 'https://i.imgur.com/Y8iCS7T.png',
      type: TBDEV,
    },
  ];

  // Edit these to enable/disable linkbox links and sidebar icons
  const LINKBOX_ENABLED = true;
  const SIDEBAR_ENABLED = true;

  const headline = document.querySelector('.header h2');
  const grabAndEncode = (selector) => encodeURIComponent(
    (headline.querySelector(selector) || { innerText: '' }).innerText
  ).replace(/%20/g, '+');
  const map = {
    artist: grabAndEncode('a[href^="artist.php"]'),
    title: grabAndEncode('span')
  };
  const buildPath = (type) => paths[type].replace(/\{([^}]+)\}/g, (_, key) => map[key]);

  if (LINKBOX_ENABLED) {
    const textlinksHtml = sites.reduce((acc, { name, domain, icon, type }) => {
      return acc + `
        <a href="https://${domain}${buildPath(type)}" target="_blank" title="Search on ${name}">
          ${name}
        </a>
      `;
    }, '');
    const textlinksContainer = document.createElement('span');
    textlinksContainer.innerHTML = textlinksHtml;
    document.querySelector('.linkbox').appendChild(textlinksContainer);
  }

  if (SIDEBAR_ENABLED) {
    const iconsHtml = sites.reduce((acc, { name, domain, icon, type }, index) => {
      return acc + `
        <a href="https://${domain}${buildPath(type)}" target="_blank" title="Search ${name}" style="padding: 0 4px">
          <img src="${icon}" alt="Search ${name}" border="0" />
        </a>
      `;
    }, '');
    const iconsContainer = document.createElement('div');
    iconsContainer.classList.add('box');
    iconsContainer.style.display = 'flex';
    iconsContainer.style.justifyContent = 'space-around';
    iconsContainer.innerHTML = iconsHtml;
    const artistsBox = document.querySelector('.box_artists');
    artistsBox.parentNode.insertBefore(iconsContainer, artistsBox);
  }

})();