// ==UserScript==
// @name             Empornium show hidden thumbnail blocks
// @version          1.1.0
// @description      Automatically expands all "Show" blocks with images.
// @namespace        https://greasyfork.org/users/241444
// @author           salad: https://greasyfork.org/en/users/241444-salad
// @license          GPL-3.0-only
// @match            https://www.empornium.is/torrents.php?id=*
// @match            https://www.empornium.sx/torrents.php?id=*
// @icon             https://www.google.com/s2/favicons?domain=empornium.is
// @downloadURL https://update.greasyfork.org/scripts/455166/Empornium%20show%20hidden%20thumbnail%20blocks.user.js
// @updateURL https://update.greasyfork.org/scripts/455166/Empornium%20show%20hidden%20thumbnail%20blocks.meta.js
// ==/UserScript==

(() => {

  const hiddenBlocks = document.querySelectorAll('.spoiler.hidden');
  let revealedImages = 0;

  hiddenBlocks.forEach(block => {
    const images = block.querySelectorAll('img');
    if (images.length) {
      images.forEach(img => {
        img.src = img.dataset.src;
        revealedImages++;
      });

      block.classList.remove('hidden');
    }
  });

  console.info('Revealed %d hidden blocks with %d images.', hiddenBlocks.length, revealedImages);

})();