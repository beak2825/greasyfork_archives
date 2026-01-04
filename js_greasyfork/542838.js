// ==UserScript==
// @name            Allegro – usuń „Sponsorowane”, podświetl „Promowane”
// @name:en         Allegro – remove “Sponsorowane”, highlight “Promowane”
// @namespace       user.allegro.cleanup
// @version         1.0.1
// @description     Usuwa wpisy „Sponsorowane” i podświetla „Promowane” w listingu Allegro.
// @description:en  Removes “Sponsorowane” entries and highlights “Promowane” ones in Allegro listings.
// @author          WM
// @license         MIT
// @match           https://allegro.pl/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=allegro.pl
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/542838/Allegro%20%E2%80%93%20usu%C5%84%20%E2%80%9ESponsorowane%E2%80%9D%2C%20pod%C5%9Bwietl%20%E2%80%9EPromowane%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/542838/Allegro%20%E2%80%93%20usu%C5%84%20%E2%80%9ESponsorowane%E2%80%9D%2C%20pod%C5%9Bwietl%20%E2%80%9EPromowane%E2%80%9D.meta.js
// ==/UserScript==

(function () {
  const run = () => {
    const t0 = performance.now();
    const ul = document.querySelector('[data-box-name*="product listing items"] ul');
    if (!ul) return;

    // give React a tick to finish rendering children
    requestAnimationFrame(() => {
      const lis = ul.querySelectorAll(':scope > li');
      let d = 0, b = 0;
      lis.forEach(li => {
        if (li.querySelector('[aria-label*="Sponsorowane"]')) { li.remove(); d++; }
        else if (li.querySelector('[aria-label*="Promowane"]')) {
          li.style.cssText =
            'background:rgba(255,215,150,.15) !important; background-color:rgba(255,215,150,.15) !important; border:1px dashed red !important;';
          b++;
        }
      });
      console.log('iter', lis.length, 'del', d, 'border', b, 'ms', performance.now() - t0);
    });
  };

  // initial call with a small delay
  setTimeout(run, 300);

  const ul = document.querySelector('[data-box-name*="product listing items"] ul');
  if (ul) new MutationObserver(run).observe(ul, {childList: true});

})();