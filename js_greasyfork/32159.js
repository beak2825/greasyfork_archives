// ==UserScript==
// @name          Youtube: disable suggested autoplay
// @include       https://www.youtube.com/*
// @description   Disable and hide suggested video autoplay on YouTube
// @version       1.0
// @author        wOxxOm
// @namespace     wOxxOm.scripts
// @license       MIT License
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/32159/Youtube%3A%20disable%20suggested%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/32159/Youtube%3A%20disable%20suggested%20autoplay.meta.js
// ==/UserScript==

/* jshint lastsemic:true, multistr:true, laxbreak:true, -W030, -W041, -W084 */

let next, cancel;

document.addEventListener('DOMContentLoaded', processPage);
window.addEventListener('yt-navigate-finish', processPage);
window.addEventListener('spfdone', processPage);

function processPage(e) {
  next = document.querySelector('.ytp-upnext');
  cancel = document.querySelector('.ytp-upnext-cancel-button');
  if (!next)
    return;
  if (getComputedStyle(next).display != 'none')
    cancelNext();
  else
    new MutationObserver((_, ob) => { cancelNext(); ob.disconnect(); })
      .observe(next, {attributes: true, attributeFilter: ['style']});
}

function cancelNext() {
  cancel && cancel.click();
  next.remove();
  console.log('Canceled suggested video autoplay');
}
