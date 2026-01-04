// ==UserScript==
// @name         Upload image to Mobilism Images
// @namespace    https://github.com/AbdurazaaqMohammed
// @version      1.2
// @description  Add button to direct image pages to upload Mobilism, resizing if the image is too large.
// @author       Abdurazaaq Mohammed
// @match        https://images.mobilism.org/
// @match        https://images.mobilism.org/thumbnail.php
// @match        https://*/*.png
// @match        https://*/*.jpg
// @match        https://*/*.jpeg
// @match        https://*/*.gif
// @match        https://*/*.bmp
// @match        https://*/*.psd
// @match        http://*/*.png
// @match        http://*/*.jpg
// @match        http://*/*.jpeg
// @match        http://*/*.gif
// @match        http://*/*.bmp
// @match        http://*/*.psd
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/490034/Upload%20image%20to%20Mobilism%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/490034/Upload%20image%20to%20Mobilism%20Images.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const url = window.location.href;
  const mobilism = 'https://images.mobilism.org/';

  function addButton() {
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.left = '10px';

    var button = document.createElement('button');
    button.innerText = 'Upload Image to Mobilism';
    button.addEventListener('click', goToMobilism);

    container.appendChild(button);
    document.body.appendChild(container);
  }

  function goToMobilism() {
    const image = document.querySelector('img');
    const h = image.naturalHeight;
    const w = image.naturalWidth;
    checkImageSize();
    if (needsResize(h, w)) {
      setNewRes(h, w, h/w)
      window.location.href = 'https://ezgif.com/resize?url=' + url;
    }
    else if (GM_getValue('needsCompress')) {
      window.location.href = 'https://ezgif.com/optimize?url=' + url;
     }
    else {
      GM_setValue('u', url);
      window.location.href = mobilism;
    }
  }

  function uploadImg() {
    document.getElementById('imgUrl').value = GM_getValue('u');
    document.querySelector('#uploadbutton').click();
  }

  function copyImageLink() {
    const link = document.querySelector('#codelbb')
    GM_setClipboard(link.value);
    link.click();
    link.click();
  }

  function checkImageSize() {
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw new Error('Network response was not ok.');
      })
      .then(response => {
        // Access the Content-Length header to get the file size
        const contentLength = response.headers.get('Content-Length');
        if (contentLength > 4000000) GM_setValue('needsCompress', true);
      })
      .catch(error => console.error('Error fetching image:', error));
}

  function needsResize(h, w) {
    return h>2499 || w>2499;
  }

  function setNewRes(height, width, aspectRatio) {
    if (height > width) {
      height = 2499;
      width = Math.round(height / aspectRatio);
    } else {
      width = 2499;
      height = Math.round(width * aspectRatio);
    }
    GM_setValue('newHeight', height);
    GM_setValue('newWidth', width);
  }

  if (url.endsWith(mobilism)) window.addEventListener('load', uploadImg);
  else if (url.endsWith('.php')) window.addEventListener('load', copyImageLink);
  else if (url.startsWith('https://ezgif.com/resize')) {
    document.querySelector(".new-height.number.text").value = GM_getValue('newHeight');
    document.querySelector(".new-width.number.text").value = GM_getValue('newWidth');
    document.getElementById('ar').selectedIndex = 2;
  }
  else if (url.includes('ezgif.com/tmp/') || url.startsWith('https://f-droid.org/')) goToMobilism();
  else addButton();
})();
