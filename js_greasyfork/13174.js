// ==UserScript==
// @name        Replace old Flash Player-based YouTube embeds by their new HTML5 counterparts
// @description Ideal if you don't have Flash Player installed in your device. I know I don't.
// @namespace   greasyfork.org/users/4813-swyter
// @include     *
// @version     2016.01.03
// @noframes
// @grant       none
// @run-at      document-start
// @icon        https://i.imgur.com/L2y0zMj.png
// @downloadURL https://update.greasyfork.org/scripts/13174/Replace%20old%20Flash%20Player-based%20YouTube%20embeds%20by%20their%20new%20HTML5%20counterparts.user.js
// @updateURL https://update.greasyfork.org/scripts/13174/Replace%20old%20Flash%20Player-based%20YouTube%20embeds%20by%20their%20new%20HTML5%20counterparts.meta.js
// ==/UserScript==

/* wait until the page is ready for the code snipped to run */
document.addEventListener('DOMContentLoaded', function()
{
  /* iterate over all the existing SWF Youtube players in the page */
  for (var cur in (vids=document.querySelectorAll('object > embed[src*="youtube"]')))
  {
    console.log(vids[cur], typeof vids[cur]);

    /* create the HTML5 player element */
    iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/' + vids[cur].src.split('?')[0].split('/')[4];

    /* keep their same size */
    iframe.width = vids[cur].width;
    iframe.height = vids[cur].height;

    /* no borders plz, thanks! */
    iframe.setAttribute("frameborder", 0);

    /* replace the old SWF Flash object with it, voilà */
    vids[cur].parentNode.parentNode.replaceChild(iframe, vids[cur].parentNode);
  }
}, false);