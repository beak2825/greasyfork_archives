// ==UserScript==
// @name                NetTruyen Tools (Remake)
// @namespace           https://greasyfork.org/users/1300060
// @description         Remove ads and add zoom-out options for NetTruyen
// @version             1.3
// @author              AstralRift
// @match               *://*nettruyen*.com/*
// @grant               GM_addStyle
// @grant               GM_registerMenuCommand
// @grant               GM_setValue
// @grant               GM_getValue
// @license             MIT
// @run-at              document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/494801/NetTruyen%20Tools%20%28Remake%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494801/NetTruyen%20Tools%20%28Remake%29.meta.js
// ==/UserScript==

const defaultSettings = { zoomFactor: 1 };
let settings = GM_getValue('settings', defaultSettings);

const zoomLevels = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2];

function removeAds() {
  GM_addStyle(`
    .reading-control > .mrb5,
    .mrb10,
    .alert-info.alert,
    .top > i,
    .notify_block,
    .page-chapter,
    #nt_comments > div,
    .facebook-like,
    .container > .mrb5,
    .footer,
    div[class*="ads"], // Target ads by class attribute broadly
    div[id*="ad-"] { // Target ads by id attribute broadly
      display: none !important;
    }
    .chapter-nav {
      position: static !important;
      z-index: auto !important;
      box-shadow: none !important;
    }
  `);
}

function zoomOutImages() {
  document.querySelectorAll('.box_doc img[src]').forEach(img => {
    img.style.transform = `scale(${settings.zoomFactor})`;
    img.style.transformOrigin = 'top left';
    img.style.transition = 'transform 0.3s ease';
  });
}

function setZoomFactor(factor) {
  if (zoomLevels.includes(factor)) {
    settings.zoomFactor = factor;
    GM_setValue('settings', settings);
    location.reload();
  } else {
    console.error('Invalid zoom factor set:', factor);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const zoomNames = ['100%', '90%', '80%', '70%', '60%', '50%', '40%', '30%', '20%'];
  zoomLevels.forEach((level, index) => {
    let name = (settings.zoomFactor === level ? '[x]' : '[ ]') + ' Zoom Out ' + zoomNames[index];
    GM_registerMenuCommand(name, () => setZoomFactor(level));
  });

  removeAds();
  zoomOutImages();
});

function lazyloadComment() {
  document.querySelectorAll('.tab-content').forEach(tab => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadTabContent(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px', threshold: 0.1 });
    observer.observe(tab);
  });

  function loadTabContent(tab) {
    console.log('Loading content for', tab);
  }
}
