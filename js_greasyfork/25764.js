// ==UserScript==
// @name         PTH Upload page save textarea sizes
// @version      0.2
// @description  Save the sizes of the textareas when you change them, and then set them back on page load
// @author       Chameleon
// @include      http*://redacted.ch/upload.php*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25764/PTH%20Upload%20page%20save%20textarea%20sizes.user.js
// @updateURL https://update.greasyfork.org/scripts/25764/PTH%20Upload%20page%20save%20textarea%20sizes.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var sizes=window.localStorage.uploadPageTextareaSizes;
  if(!sizes)
  {
    sizes=[[503, 126], [503, 126]];
  }
  else
    sizes=JSON.parse(sizes);
  
  var album=document.getElementById('album_desc');
  album.setAttribute('style', 'width: '+sizes[0][0]+'px; height: '+sizes[0][1]+'px');
  var release=document.getElementById('release_desc');
  release.setAttribute('style', 'width: '+sizes[1][0]+'px; height: '+sizes[1][1]+'px');
  release.addEventListener('mouseup', resized.bind(undefined, album, release), false);
  album.addEventListener('mouseup', resized.bind(undefined, album, release), false);
})();

function resized(album, release)
{
  window.localStorage.uploadPageTextareaSizes = JSON.stringify([[album.clientWidth, album.clientHeight], [release.clientWidth, release.clientHeight]]);
}
