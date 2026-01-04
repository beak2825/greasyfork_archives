// ==UserScript==
// @name         Wikipedia Old Design
// @namespace    https://ksir.pw
// @version      1.0.1
// @description  Forces the old design on Wikipedia, because the new design is awful
// @author       Kain (ksir.pw)
// @match        *://*.wikipedia.org/*
// @exclude      *://*.wikipedia.org/
// @homepage     https://greasyfork.org/en/scripts/459165-wikipedia-old-design
// @supportURL   https://greasyfork.org/en/scripts/459165-wikipedia-old-design/feedback
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhEAAQAMIDAAAAAIAAAP8AAP///////////////////yH5BAEKAAQALAAAAAAQABAAAAMuSLrc/jA+QBUFM2iqA2ZAMAiCNpafFZAs64Fr66aqjGbtC4WkHoU+SUVCLBohCQA7
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/459165/Wikipedia%20Old%20Design.user.js
// @updateURL https://update.greasyfork.org/scripts/459165/Wikipedia%20Old%20Design.meta.js
// ==/UserScript==

const url = new URL(window.location.href);

// Update current page
if(url.toString().indexOf('useskin') === -1){
  url.searchParams.set('useskin', 'vector');
  location.replace(url);
}

window.onload = () => {
  // Add param to links on the page
  for(const a of document.getElementsByTagName('a')) {
    // Ignore external links
    if(a.href.indexOf('wikipedia.org') === -1) continue;
    let href = new URL(a.href);
    href.searchParams.set('useskin', 'vector');
    a.href = href;
  }
}