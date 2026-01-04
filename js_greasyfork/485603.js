// ==UserScript==
// @name         Nettruyen Tools
// @namespace    nettruyen
// @description  Remove ads and added zoom out options
// @version      1.1
// @include      https://*nettruyen*
// @author       kylyte
// @license      MIT
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nettruyenus.com
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/485603/Nettruyen%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/485603/Nettruyen%20Tools.meta.js
// ==/UserScript==
function removeAds() {
  GM_addStyle(`
    .reading-control > .mrb5,
    div.mrb10:nth-of-type(2),
    .hidden-sm.hidden-xs.mrb10.alert-info.alert,
    .top > i,
    .notify_block,
    .text-center.page-chapter,
    #nt_comments > div.mrt5,
    .facebook-like,
    .mrb5.text-center.container,
    .container div:not(.top)>div.mrb5.mrt5.text-center>a,
    .footer {
      display: none !important;
    }
    .scroll-to-fixed-fixed.chapter-nav {
      position: unset !important;
      z-index: 100 !important;
      box-shadow: unset !important;
    }
  `);
}

const defaultSettings = {
  zoomFactor: 1 
};
let settings = GM_getValue('settings', defaultSettings);
function zoomOutImages() {
  var images = document.querySelectorAll('.box_doc img[src]');
  var factor = settings.zoomFactor;
  for (var i = 0; i < images.length; i++) {
      var image = images[i];
      image.style.width = image.naturalWidth * factor + 'px';
      image.style.height = image.naturalHeight * factor + 'px';
  }
}
function setZoomFactor(factor) {
  settings.zoomFactor = factor;
  GM_setValue('settings', settings);
  location.reload();
}
const zoomLevels = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2];
const zoomNames = ['100%', '90%', '80%', '70%', '60%', '50%', '40%', '30%', '20%'];
for (var i = 0; i < zoomLevels.length; i++) {
  let name = (settings.zoomFactor === zoomLevels[i] ? '[x]' : '[ ]') + ' Zoom Out ' + zoomNames[i];
  GM_registerMenuCommand(name, setZoomFactor.bind(null, zoomLevels[i]));
}

function lazyloadComment() {
    var tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(function(tab) {
        if (tab.getBoundingClientRect().top < window.innerHeight) {
            loadTabContent(tab);
        } else {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        loadTabContent(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '0px',
                threshold: 0.1
            });
            observer.observe(tab);
        }
    });

    function loadTabContent(tab) {
        console.log('Loading content for', tab);
    }
}

removeAds();
document.addEventListener('DOMContentLoaded', lazyloadComment);
window.addEventListener('load', zoomOutImages);