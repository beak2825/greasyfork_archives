// ==UserScript==
// @name         No Thumbnails
// @namespace    https://wilchan.org
// @version      1.1
// @description  Ładuje całe obrazki zamiast miniaturek.
// @author       Anonimas
// @match        https://wilchan.org/*
// @match        https://akanechan.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wilchan.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510250/No%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/510250/No%20Thumbnails.meta.js
// ==/UserScript==

podmiana = (e) => {
  let link = e.querySelector('.file > a');
  if (link) {
    let img = e.querySelector('.file > a > img');
    if (img) {
      let fileExtension = link.href.split('.').pop().toLowerCase();
      if (fileExtension !== 'webm') {
        img.src = link.href;
      }
    }
  }
}

window.addEventListener('after-create-thread-article-element-event', function(e) {
  podmiana(e.detail.element)
});

for(let element of document.querySelectorAll('section.thread, section.reply')) {
  podmiana(element)
}

window.addEventListener('after-create-post-section-element-event', function(e) {
  podmiana(e.detail.element)
});