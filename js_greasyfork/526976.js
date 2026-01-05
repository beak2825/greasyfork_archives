// ==UserScript==
// @name         Porn Pics Add title to the thumbnails v.3
// @description  Add title to thumbnails
// @icon         https://external-content.duckduckgo.com/ip3/www.pornpics.com.ico
// @namespace    https://greasyfork.org/fr/users/7434-janvier56
// @author       janvier57
// @version      3.0.0
// @include      https://www.pornpics.com/*
// @license      unlicense

// @downloadURL https://update.greasyfork.org/scripts/526976/Porn%20Pics%20Add%20title%20to%20the%20thumbnails%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/526976/Porn%20Pics%20Add%20title%20to%20the%20thumbnails%20v3.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var style = document.createElement('style');
  style.innerHTML = `
    .image-title {
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      padding: 2px;
      font-size: 12px;
      font-family: Tahoma, sans-serif !important;
    }
  `;
  document.head.appendChild(style);

  function addTitles() {
    var images = document.querySelectorAll('li.thumbwook a.rel-link img');
    images.forEach(function(image) {
      if (!image.parentNode.querySelector('.image-title')) {
        var title = image.alt;
        var span = document.createElement('span');
        span.textContent = title;
        span.className = 'image-title';
        image.parentNode.appendChild(span);
      }
    });
  }

  addTitles();

  var observer = new MutationObserver(function() {
    addTitles();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
