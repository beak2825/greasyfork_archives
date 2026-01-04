// ==UserScript==
// @name         Bunkrr video show thumbnail
// @namespace    Violentmonkey Scripts
// @version      0.3
// @description  Include thumbnail in bunkrr video view page
// @author       walmart22
// @match        https://*.bunkrr.su/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479873/Bunkrr%20video%20show%20thumbnail.user.js
// @updateURL https://update.greasyfork.org/scripts/479873/Bunkrr%20video%20show%20thumbnail.meta.js
// ==/UserScript==

// Run immediately if ready otherwise queue up
if (document.readyState !== 'loading') {
  insertThumbnail();
} else {
  document.addEventListener('DOMContentLoaded', insertThumbnail);
}

function insertThumbnail() {
  const videoExtension = ['mp4', 'm4v', 'mov', 'mkv'];
  const domain = 'bunkrr'
  const thumbDomain = 'bunkr'
  const url = window.location.href;

  let modifiedUrl = url;
  if (!videoExtension.some(ext => url.toLowerCase().includes(`.${ext}`))) {
    // If the url doesn't include the extension, build the url using the video src
    let video_url = document.querySelector('source').src.split('/').pop();
    modifiedUrl = url.split('/').slice(0, -1).join('/') + '/' + video_url;
  }

  let downloadLink = Array.from(document.querySelectorAll("a")).find(el => el.textContent.trim().startsWith('Download'));
  let prefix = new URL(downloadLink.href).host.split('.')[0];
  let thumbnailBase = modifiedUrl.replace(new RegExp(`\.(${videoExtension.join('|')})`, 'ig'), '.png')
  // Two options seen in the wild
  let thumbnail1 = thumbnailBase.replace(`//${domain}.su/v/`, `//i-${prefix}.${thumbDomain}.ru/thumbs/`);
  let thumbnail2 = thumbnailBase.replace(`//${domain}.su/v/`, `//${prefix}img.${thumbDomain}.ru/thumbs/`);

  if (thumbnail1.indexOf('i-media-files') !== -1) {
    thumbnail2 = thumbnail1.replace("i-media-files", "i");
  }
  // If the first thumbnail fails to load, try the second one
  let onError = `this.onerror=null;this.src='${thumbnail2}';src="${thumbnail2}"`
  let template = document.createElement('template');
  template.innerHTML = `<img src="${thumbnail1}" alt="img" loading="lazy" style="display: inline" onError="this.onerror=null;this.src='${thumbnail2}'">`

  let place = document.querySelector('#statsLink');
  if (!place) {
    place = document.querySelector('body > main > section:nth-child(2) > div > div > div > div:nth-child(2) > div > a');
  }
  place.parentElement.prepend(template.content);
}
