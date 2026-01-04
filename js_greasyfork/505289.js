// ==UserScript==
// @name        Rutracker full size images embed
// @namespace   Violentmonkey Scripts
// @match       https://rutracker.org/forum/viewtopic.php
// @grant       none
// @version     1.1
// @author      szq2
// @description Embeds full-size images instead of thumbnail from various image hosting sites. Also install https://github.com/Owyn/HandyImage
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/505289/Rutracker%20full%20size%20images%20embed.user.js
// @updateURL https://update.greasyfork.org/scripts/505289/Rutracker%20full%20size%20images%20embed.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const h = "700"; // embedded iframe height, in virtual pixels

  const delayTime = 500; // delay between embeddings

  const replace = (img, a) => {
    //if(img.src.indexOf("fastpic") != -1)

    // first 5 symbols of second level domain (if preview host and actual host don't match, like turbohost)
    let getHost = (url) => {
      return url.split('/')[2].split('.').reverse()[1].substr(0, 5);
    };
    let link = a.href.replace('http://', 'https://');
    if (!link.startsWith('https://'))
      return;
    // don't embed if img and link point to different hosts or to the same host as the document
    if (link.endsWith('/') || (getHost(img.src) !== getHost(link) && !img.src.endsWith('/broken_image_1.svg')) || getHost(link) === getHost(location.href)) {
      // rutracker: if image is broken try to embed regardless
      return;
    }
    // replace with an iframe
    a.innerHTML = `<iframe src="${link}" width="100%" height="${h}" loading="lazy" sandbox="allow-scripts allow-same-origin" referrerpolicy="no-referrer" credentialless />`;

  };

  const delay = (time) => {
    return new Promise(res => setTimeout(res, time));
  };

  while (true) {
    for (let img of document.querySelectorAll("img.postImg")) {
      // fix http pics
      if (img.src.startsWith('http:'))
        img.src = img.src.replace('http://', 'https://');
    }

    // rutracker
    for (let img of document.querySelectorAll("a.postLink > img.postImg")) {
      replace(img, img.parentNode);
      await delay(delayTime);
    }
    await delay(delayTime * 2);
  }

})();
