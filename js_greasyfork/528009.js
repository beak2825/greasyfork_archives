// ==UserScript==
// @name         npm-file-downloader
// @video        https://youtu.be/6BqphFJ69-g
// @namespace    http://tampermonkey.net/
// @version      2024-11-04
// @description  A Tampermonkey script that supports downloading single npm files
// @author       qer
// @match        https://www.npmjs.com/*
// @icon         https://github.com/user-attachments/assets/7ccadb13-ee47-4206-88bf-050a087988d8
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528009/npm-file-downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/528009/npm-file-downloader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const mainButtonCssText = `
    background-color: #0969da;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-left: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  `;

  const downloadButtonCssText = `
    color: #0969da;
    text-decoration: none;
    font-size: 14px;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  `;

  const showDownloadLinksButton = document.createElement('button');
  showDownloadLinksButton.innerHTML = 'Show Download Links';
  showDownloadLinksButton.style.cssText = mainButtonCssText;
  addButtonClickEffect(showDownloadLinksButton);

  showDownloadLinksButton.onclick = showDownloadLinks; // download function
  addShowDownloadLinksButton(); // add button to the page

  function addButtonClickEffect(button) {
    button.addEventListener('mouseover', function () {
      this.style.backgroundColor = '#0557c5';
    });
    button.addEventListener('mouseout', function () {
      this.style.backgroundColor = '#0969da';
    });
    button.addEventListener('mousedown', function () {
      this.style.transform = 'scale(0.98)';
    });
    button.addEventListener('mouseup', function () {
      this.style.transform = 'scale(1)';
    });
  }

  function addShowDownloadLinksButton() {
    const tabListA = document.querySelector('ul[role="tablist"]').querySelectorAll('a');
    if (!tabListA) return;
    for (const a of tabListA) {
      a.onclick = () => {
        if (a.getAttribute('href') === '?activeTab=code') {
          document.querySelector('#main div').childNodes[1].querySelectorAll('li')[1].appendChild(showDownloadLinksButton);
        } else showDownloadLinksButton.remove();
      };
    }

    const link = document.querySelector('a[href="?activeTab=code"]');
    if (!link) return;
    const ariaSelected = link.getAttribute('aria-selected');
    console.log('ariaSelected', ariaSelected);
    if (ariaSelected === 'true') {
      document.querySelector('#main div').childNodes[1].querySelectorAll('li')[1].appendChild(showDownloadLinksButton);
    }
  }

  function info() {
    const path = new URL(window.location.href).pathname.split('/');
    return { packageName: path[2], version: path[4]?.replace(/^v\//, '') || 'latest' };
  }

  function showDownloadLinks() {
    const { packageName, version } = info();
    console.log('Package Name:', packageName);
    console.log('Version:', version);
    const domain = 'https://nfd.qer.im';
    // const domain = 'http://localhost:8787';
    let path = ''; let liElements = [];
    try {
      const section = document.querySelector('#main div').childNodes[2].querySelector('section:not([data-attribute="hidden"])');
      console.log(section);
      path = section.querySelector('h2').innerText.split('/').slice(2)
        .join('/') || '';
      liElements = section.querySelectorAll('ul li');
      if (!liElements || liElements.length <= 0) {
        throw new Error(`Can't find elements: ${path}${liElements.length}`);
      }
    } catch (e) {
      alert(`Failed to add download links: ${e}`);
    }

    liElements.forEach((li, index) => {
      const buttonText = li.querySelector('button').textContent;
      const fileType = li.querySelectorAll('div')[2].textContent;
      // const fileSize = li.querySelectorAll('div')[3].textContent;
      const isFolder = !fileType || fileType.toLowerCase() === 'folder';

      if (buttonText === '../') return;

      const downloadButton = document.createElement('a');
      downloadButton.style.cssText = downloadButtonCssText;

      if (isFolder) {
        downloadButton.textContent = '(Folder)';
        downloadButton.style.cssText += `
          color: #666;
          cursor: not-allowed;
          opacity: 0.7;
        `;
      } else {
        downloadButton.textContent = 'Download';
        downloadButton.style.cursor = 'pointer';
        downloadButton.href = `${domain}/api/download?package=${packageName}&path=${path}&file=${encodeURIComponent(buttonText)}&version=${version}`;

        downloadButton.addEventListener('click', function (event) {
          event.preventDefault();

          const loadingIndicator = document.createElement('span');
          loadingIndicator.textContent = 'Downloading...';
          loadingIndicator.style.marginLeft = '5px';
          this.parentNode.insertBefore(loadingIndicator, this.nextSibling);

          this.style.pointerEvents = 'none';
          this.style.opacity = '0.5';

          setTimeout(() => {
            loadingIndicator.remove();
            this.style.pointerEvents = 'auto';
            this.style.opacity = '1';

            window.location.href = this.href;
          }, 2000);
        });
      }

      const fileNameButton = li.querySelector('button');
      fileNameButton.parentNode.insertBefore(downloadButton, fileNameButton.nextSibling);
      fileNameButton.parentNode.style.display = 'flex';
      fileNameButton.parentNode.style.alignItems = 'center';
    });
  }
}());