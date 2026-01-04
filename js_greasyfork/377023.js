// ==UserScript==
// @name         Improve Emp Mouseovers
// @namespace    https://greasyfork.org/users/241444
// @version      1.0.0
// @description  Preload images and expand tooltip mouseover area
// @author       salad: https://greasyfork.org/en/users/241444-salad
// @include      https://www.empornium.me/torrents.php*
// @grant        none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/377023/Improve%20Emp%20Mouseovers.user.js
// @updateURL https://update.greasyfork.org/scripts/377023/Improve%20Emp%20Mouseovers.meta.js
// ==/UserScript==

(function() {
const links = document.querySelectorAll('a[onmouseover][onmouseout]');
links.forEach(e => {
  // fire mouseovers to trigger loading the thumbnail
  e.onmouseover();
  // grab the thumbnail sand create an img tag with it
  const thumbnail = document.querySelector('#overDiv img');
  if(thumbnail && thumbnail.src) {
    const imgEl = new Image(); 
    imgEl.src = thumbnail.src
  }
  e.onmouseout();
  
  // bind mouseover events to the parent row instead of just the link
  const parentRow = e.closest('tr.torrent');
  parentRow.onmouseover = e.onmouseover;
  parentRow.onmouseout = e.onmouseout;
});

})();