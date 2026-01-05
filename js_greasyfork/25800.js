// ==UserScript==
// @name         PTH Fixed submit link
// @version      0.3
// @description  Add a link that can submit the upload form from anywhere on the page
// @author       Chameleon
// @include      http*://redacted.ch/upload.php*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25800/PTH%20Fixed%20submit%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/25800/PTH%20Fixed%20submit%20link.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var a=document.createElement('a');
  document.body.appendChild(a);
  a.href='javascript:void(0);';
  a.setAttribute('style', 'z-index: 1000; display: block; padding: 10px; border-radius: 10px; background: rgba(0,0,0,0.7); color: white; position: fixed; bottom: 10px; margin: auto; left: 0; right: 0; text-align: center; width: 100px; border: rgba(255,255,255,0.3) solid 2px;');
  a.innerHTML = 'Upload torrents';
  a.addEventListener('click', uploadTorrents, false);
})();

function uploadTorrents()
{
  document.getElementById('post').click();
}
