// ==UserScript==
// @name         PTH Random album
// @version      0.2
// @description  Load a random album
// @author       Chameleon
// @include      http*://redacted.ch/torrents.php?id=*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25792/PTH%20Random%20album.user.js
// @updateURL https://update.greasyfork.org/scripts/25792/PTH%20Random%20album.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var linkbox=document.getElementsByClassName('linkbox')[0];
  var a=document.createElement('a');
  linkbox.appendChild(a);
  a.innerHTML = 'Random album';
  a.setAttribute('class', 'brackets');
  a.href='/torrents.php?id='+Math.round(Math.random()*265246);
})();
