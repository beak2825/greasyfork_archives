// ==UserScript==
// @name        Download nieuwsbrief gereformeerd venster
// @description 27-9-2024, 16:35:02
// @namespace   Violentmonkey Scripts
// @match       https://mailchi.mp/*/nieuwsbrief-gereformeerd-venster-nr*
// @match       https://us2.campaign-archive.com/?u=1553bbe0a2b452b50b0a2bd75*
// @grant       none
// @version     1.1
// @license     MIT
// @author      Arjan Lankhaar
// @downloadURL https://update.greasyfork.org/scripts/510470/Download%20nieuwsbrief%20gereformeerd%20venster.user.js
// @updateURL https://update.greasyfork.org/scripts/510470/Download%20nieuwsbrief%20gereformeerd%20venster.meta.js
// ==/UserScript==

(function(window) {
  'use strict';

  window.addEventListener('load', () => {
    document.body.insertAdjacentHTML( 'beforeend', styles );
  })

})(window)

const styles = `
<style>
#awesomewrap {
    display: none;
}

tr:has(>td#templatePreheader) {
  display: none;
}
</style>
`