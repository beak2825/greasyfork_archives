// ==UserScript==
// @name          Apple music - Copy playlist info
// @description   Copy playlist info for export
// @namespace     cobr123
// @version       1.0
// @license       MIT
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @grant         GM.setClipboard
// @grant         GM_setClipboard
// @include       https://music.apple.com/*
// @downloadURL https://update.greasyfork.org/scripts/392936/Apple%20music%20-%20Copy%20playlist%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/392936/Apple%20music%20-%20Copy%20playlist%20info.meta.js
// ==/UserScript==
 

"use strict";

(function () {
  
  function copyPL() {
    let svPlayList = '';
    $('div[class="tracklist-item__text we-selectable-item__link-text"]').each(function() {
      let row = $(this);
      let svTrackName = $('div:nth-child(1) > a > div > span', row).text().replace("\n","");
      let svArtistName = $('div:nth-child(2) > a', row).text().replace("\n","");
      let svTrackInfo = svTrackName + ' - ' + svArtistName;
      console.log(svTrackInfo);
      svPlayList += svTrackInfo + '\n';
    });
    GM_setClipboard(svPlayList);
    alert('Copied:\n' + svPlayList);
  }
  
  let bindEvents = function () {
    $("div.product-hero-desc--side-bar").after('<button id="copy_playlist_to_clipboard" class="product-controls__button link">Copy playlist to clipboard</button>');
    $('#copy_playlist_to_clipboard').click(function(){
      copyPL();
    });
  };
  
  window.setTimeout(bindEvents, 1000);

})();