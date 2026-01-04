// ==UserScript==
// @name         Prime Video buying options remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove all "rent, buy, free trial" options from Amazon Prime Video
// @author       Yrtiop
// @match        https://primevideo.com/*
// @match        https://*.primevideo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=primevideo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465354/Prime%20Video%20buying%20options%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/465354/Prime%20Video%20buying%20options%20remover.meta.js
// ==/UserScript==

function primevideoRemoveBuyingOptions() {
  document.querySelectorAll('#main > div > div, #main > div > section').forEach(function(categ) {
    let mainCarousel = categ.querySelector('section[data-testid="standard-hero"]');
    if(mainCarousel && mainCarousel.querySelectorAll('span[data-testid="unentitled-icon"]').length) {
      let navigation = categ.querySelectorAll('section[data-testid="standard-hero"] > ul > li');
      mainCarousel.querySelectorAll('div > ul > li').forEach(function(film, i) {
        if(film.querySelectorAll('span[data-testid="unentitled-icon"]').length) {
          film.remove();
          if(navigation && navigation.length && i < navigation.length) {
            navigation[i].remove();
          }
        }
      });
    }
    else {
      if(categ.querySelectorAll('span[data-testid="unentitled-icon"]').length) {
        categ.remove();
      }
    }
  });
}

(function() {
  'use strict';
   primevideoRemoveBuyingOptions();
   setInterval(primevideoRemoveBuyingOptions, 100);
})();