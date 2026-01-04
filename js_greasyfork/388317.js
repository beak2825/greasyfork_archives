// ==UserScript==
// @name         Imgur - Page redirector
// @description  Redirects Imgur pages to images, videos or album download.
// @namespace    var512
// @author       var512
// @version      0.0.4
// @supportURL   https://gitlab.com/var512
// @supportURL   https://github.com/var512
// @include      /^https?:\/\/(i\.|www\.)?imgur\.com\/(.+)/
// @exclude      /^https?:\/\/(www\.)?imgur\.com\/(about|privacy|search|upload|t\/)(.*)/
// @icon         https://imgur.com/favicon.ico
// @license      MIT
// @noframes
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/388317/Imgur%20-%20Page%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/388317/Imgur%20-%20Page%20redirector.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const isDebugEnabled = false;
  const imgurUrl = new URL(document.URL);
  isDebugEnabled && console.log(`imgurUrl: ${imgurUrl}`);

  if (typeof imgurUrl !== 'object') {
    return;
  }

  const splitPath = imgurUrl.pathname.split('/');
  isDebugEnabled && console.log(`splitPath: ${splitPath} | length: ${splitPath.length}`);

  if (splitPath.length < 2) {
    return;
  }

  // response.status workaround
  const pageTitle = document.querySelector('title');
  const isResponseNotFound = pageTitle && pageTitle.innerText.includes('404 page');
  isDebugEnabled && console.log(`isResponseNotFound: ${isResponseNotFound}`);

  if (isResponseNotFound) {
    return;
  }

  const isDirectLink = imgurUrl.host.includes('i.imgur.com');
  isDebugEnabled && console.log(`isDirectLink: ${isDirectLink}`);

  if (isDirectLink === true) {
    // .gifv URLs are redirects (not a video content-type)
    if (imgurUrl.href.endsWith('.gifv')) {
      isDebugEnabled && console.log('redirecting gifv to mp4...');
      window.location.replace(imgurUrl.href.replace(/.gifv$/i, '.mp4'));
    }
    return;
  }

  window.stop();

  const isGallery = ['a', 'gallery'].indexOf(splitPath[1]) >= 0 && ['zip'].indexOf(splitPath[2]) === -1;
  const isSingleImageGallery = document.querySelectorAll('.post-image-container').length === 1;
  isDebugEnabled && console.log(`isGallery: ${isGallery} | isSingleImageGallery: ${isSingleImageGallery}`);

  if (isGallery && isSingleImageGallery === false) {
    isDebugEnabled && console.log('redirecting gallery to zip download...');
    window.location.replace(`https://imgur.com/a/${splitPath[2]}/zip`);
    return;
  }

  const contentType = document.querySelectorAll('meta[property="og:video"]').length > 0 ? 'video' : 'image';
  const ogUrl = document.querySelector(`meta[property="og:${contentType}"]`).attributes.getNamedItem('content').value;
  const newUrl = ogUrl.split('?').shift();
  isDebugEnabled && console.log(`contentType: ${contentType}`);
  isDebugEnabled && console.log(`ogUrl: ${ogUrl}`);
  isDebugEnabled && console.log(`newUrl: ${newUrl}`);
  isDebugEnabled && console.log('redirecting...');

  window.location.replace(newUrl);
})();
