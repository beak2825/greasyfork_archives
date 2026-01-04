// ==UserScript==
// @name         Copy information of apps from F-Droid to post on Mobilism
// @namespace    https://github.com/AbdurazaaqMohammed/userscripts
// @version      1.0.3.1
// @description  Add a button to F-Droid app pages to copy information of apps from F-Droid and format it to post on Mobilism
// @author       Abdurazaaq Mohammed
// @match        https://f-droid.org/*/packages*
// @grant        GM_setClipboard
// @license      The Unlicense
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/490027/Copy%20information%20of%20apps%20from%20F-Droid%20to%20post%20on%20Mobilism.user.js
// @updateURL https://update.greasyfork.org/scripts/490027/Copy%20information%20of%20apps%20from%20F-Droid%20to%20post%20on%20Mobilism.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function addButton() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.left = '10px';

    const button = document.createElement('button');
    button.innerText = 'Format and Copy';
    button.addEventListener('click', getInfo);

    container.appendChild(button);
    document.body.appendChild(container);
  }

  function getInfo() {
    const title = document.querySelector('h3').textContent.trim();
    const overview = document.querySelector('body > div > div > div.article-area > article > header > div > div').textContent.trim();
    const requiredVersion = document.querySelector("#latest > p.package-version-requirement").textContent.trim().replace('This version requires ', '');
    const version = document.querySelector("#latest > div.package-version-header > b").textContent.trim().replace('Version ', 'v');
    const postDesc = document.querySelector("body > div > div > div.article-area > article > div.package-description").innerText.replace(/\p{Emoji}/gu, '').replace('\n\n', '\n');
    const changelog = document.querySelector("body > div > div > div.article-area > article > div.package-whats-new > div:nth-child(2)") ? document.querySelector("body > div > div > div.article-area > article > div.package-whats-new > div:nth-child(2)").textContent.trim().replace(/\p{Emoji}/gu, '') : 'No changelog';
    const postTitle = `[b]${title} ${version}[/b]`;
    const postRequirements = `[u]Requirements:[/u] ${requiredVersion}`;
    const postOverview = `[u]Overview:[/u] ${overview}`;
    const img = `YOU STILL HAVE TO PUT THE IMAGE\n[break]`;
    const modInfo = ''; //put mod info if you want
    const postChangelog = `[u]What's New:[/u]\n${changelog}`;
    const adsField = '[b]This app has no advertisements[/b]';
    const playstoreLink = `[u]More Info:[/u]\n[code]${window.location.href}[/code]`;
    const latestDL = document.querySelector("#latest > div.package-version-header > b").textContent.trim() == document.querySelector("body > div.site-wrapper > div > div.article-area > article > div.package-versions > ul > li:nth-child(2) > div.package-version-header > b").textContent.trim() ? document.querySelector('#latest > p.package-version-nativecode > code').textContent.trim() + '\n\nMirror:\n' + document.querySelector('#latest > p.package-version-download > b > a') + '\n\n' + document.querySelector("body > div.site-wrapper > div > div.article-area > article > div.package-versions > ul > li:nth-child(2) > p.package-version-nativecode > code").textContent.trim() +'\n\n' + 'Mirror:\n' + document.querySelector("body > div.site-wrapper > div > div.article-area > article > div.package-versions > ul > li:nth-child(2) > p.package-version-download > b > a") : '\nMirror:\n' + document.querySelector('#latest > p.package-version-download > b > a');
    const dlLinks = `[u]Download Instructions:[/u]\n${latestDL}\n`;
    const msg = 'Trouble downloading? Read [url=https://forum.mobilism.org/viewtopic.php?f=19&t=649944][b]This[/b][/url].';
    const fullInfo = `${postTitle}\n${postRequirements}\n${postOverview}\n\n${img}\n${postDesc}\n${modInfo}\n${postChangelog}\n\n${adsField}\n\n${playstoreLink}\n${dlLinks}\n${msg}`;

    if (fullInfo) {
      GM_setClipboard(fullInfo);
      alert('Copied info to clipboard.');
    } else {
      alert('Error');
    }
  }

  addButton();
})();
