// ==UserScript==
// @name             Empornium cover image preload
// @version          1.1.0
// @description      Preloads the cover image on torrent pages.
// @namespace        https://greasyfork.org/users/241444
// @author           salad: https://greasyfork.org/en/users/241444-salad
// @license          GPL-3.0-only
// @match            https://www.empornium.is/torrents.php?id=*
// @match            https://www.empornium.sx/torrents.php?id=*
// @icon             https://www.google.com/s2/favicons?domain=empornium.is
// @downloadURL https://update.greasyfork.org/scripts/455176/Empornium%20cover%20image%20preload.user.js
// @updateURL https://update.greasyfork.org/scripts/455176/Empornium%20cover%20image%20preload.meta.js
// ==/UserScript==

(() => {

  const coverImage = document.querySelector('#coverimage img');
  if (!coverImage) {
    return;
  }

  coverImage.src = coverImage.src.replace('resize/250/', '');

  console.info('Upgraded cover image');

})();