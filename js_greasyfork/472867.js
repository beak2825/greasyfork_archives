
// ==UserScript==
// @name         YouTube Downloader
// @version      1.3
// @match        https://www.youtube.com/*
// @match      https://www.wheelofnames.fun/*
// @grant        GM_setClipboard
// @description  Author: Maker - MH
// @namespace https://greasyfork.org/users/1115232
// @downloadURL https://update.greasyfork.org/scripts/472867/YouTube%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/472867/YouTube%20Downloader.meta.js
// ==/UserScript==
 
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.shiftKey && event.key === 'Y') {
    event.preventDefault();
    GM_setClipboard(window.location.href);
    window.open('https://x2download.app/' + window.location.pathname);
  }
});
 
(function() {
  'use strict';
 
  function pasteTextAndClickButton() {
    var searchBox = document.getElementById('s_input');
    var button = document.querySelector('#search-form button');
 
    setTimeout(function() {
      navigator.clipboard.readText().then(function(pastedText) {
        searchBox.value = pastedText;
        button.click();
 
        setTimeout(function() {
          var downloadLink = document.getElementById('asuccess');
          if (downloadLink) {
            downloadLink.addEventListener('click', function() {
              setTimeout(function() {
                window.close();
              }, 8000);
            });
          }
        }, 2000);
      }).catch(function(error) {
        console.error('Error reading text from clipboard:', error);
      });
    }, 1000);
  }
 
  window.addEventListener('load', function() {
    pasteTextAndClickButton();
  });
})();