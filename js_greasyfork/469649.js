// ==UserScript==
// @name         BTDigg Cached Torrent Links
// @namespace    virgilinojuca
// @version      1.0
// @description  Add torrent caching site links to BTDigg [v1.0: 2023-03-31]
// @author       virgilinojuca
// @license      MIT
// @match        https://btdig.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// 
// @downloadURL https://update.greasyfork.org/scripts/469649/BTDigg%20Cached%20Torrent%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/469649/BTDigg%20Cached%20Torrent%20Links.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Add CSS style
  let css = `
        .cache-button {
            display: inline-block;
            cursor: pointer;
            background-color: #4CAF50;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            margin-left: 10px;
        }

        .cache-dropdown {
            display: none;
            position: absolute;
            z-index: 1;
            margin-top: 5px;
            background-color: #f9f9f9;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            padding: 12px 16px;
            border-radius: 4px;
        }

        .cache-dropdown a {
            display: block;
            color: black;
            padding: 5px 0;
            text-decoration: none;
        }

        .cache-dropdown a:hover {
            background-color: #f1f1f1;
        }

        .cache-dropdown.show {
            display: block;
        }
    `;

  let style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  document.head.appendChild(style);

  // Add cache links
  let links = document.querySelectorAll('a[title="Download via magnet-link"], a[title="Download this torrent via magnet link"]');
  links.forEach(link => {
    let hash = link.href.match(/xt=urn:btih:([0-9A-F]+)&/i)[1];
    let hashUpper = hash.toUpperCase();
    let iTorrentsLink = `https://itorrents.org/torrent/${hashUpper}.torrent`;
    let btcacheLink = `https://btcache.me/torrent/${hashUpper}`;
    let torrageLink = `https://torrage.info/torrent.php?h=${hashUpper}`;
    let cacheButton = document.createElement('div');
    let cacheDropdown = document.createElement('div');
    cacheButton.innerText = 'Torrent files';
    cacheButton.classList.add('cache-button');
    cacheDropdown.classList.add('cache-dropdown');
    cacheDropdown.innerHTML = `
            <a href="${iTorrentsLink}" target="_blank">iTorrents</a>
            <a href="${btcacheLink}" target="_blank">BTCache</a>
            <a href="${torrageLink}" target="_blank">TorRage</a>
        `;
    cacheButton.appendChild(cacheDropdown);
    link.parentNode.insertBefore(cacheButton, link.nextSibling);
    cacheButton.addEventListener('mouseenter', () => {
      cacheDropdown.classList.add('show');
    });
    cacheButton.addEventListener('mouseleave', () => {
      setTimeout(() => {
        cacheDropdown.classList.remove('show');
      }, 200);
    });
  });
})();