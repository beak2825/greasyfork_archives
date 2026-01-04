// ==UserScript==
// @name				KickAssAnime Arrow Nav
// @namespace		Angablade
// @description Allows arrow navigation and some basic features. 
// @version			2
// @include			http*://*.kickassanime.*/anime/*/episode-*
// @grant				none
// @downloadURL https://update.greasyfork.org/scripts/399195/KickAssAnime%20Arrow%20Nav.user.js
// @updateURL https://update.greasyfork.org/scripts/399195/KickAssAnime%20Arrow%20Nav.meta.js
// ==/UserScript==
function ready() {
  let key;
  const c = document.getElementById('user-control').childNodes;
  document.addEventListener('keydown', (event) => {
    key = event.key;
    if (key === 'ArrowRight') {
      c[8].click();
    }
    if (key === 'ArrowLeft') {
      c[0].click();
    }
    if (key === 'F4') { 
      c[4].click();
    }
    if (key === 'F2') { 
      c[7].click();
    }
  });
}

document.addEventListener("DOMContentLoaded", ready);
