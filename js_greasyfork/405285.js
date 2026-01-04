// ==UserScript==
// @name         Arrow Keys: Frameless Comic-Rocket
// @namespace    https://greasyfork.org/users/45933
// @version      0.1.3
// @author       Fizzfaldt
// @description  Arrow Key Keyboard shortcuts for (Frameless) Comic Rocket comics.
// @run-at       document-start
// @grant        none
// @noframes
// @note         Requires turning off frames at https://www.comic-rocket.com/settings/ui/

// @match        *://*.dumbingofage.com/*
// @match        *://*.egscomics.com/*
// @match        *://*.giantitp.com/*
// @match        *://*.goblinscomic.com/*
// @match        *://*.leasticoulddo.com/*
// @match        *://*.vgcats.com/*
// @match        *://*.xkcd.com/*
// @downloadURL https://update.greasyfork.org/scripts/405285/Arrow%20Keys%3A%20Frameless%20Comic-Rocket.user.js
// @updateURL https://update.greasyfork.org/scripts/405285/Arrow%20Keys%3A%20Frameless%20Comic-Rocket.meta.js
// ==/UserScript==

/*
 * Some sites have built-in Left=>Prev, Right=>Next functionality.
 * Built-in functionality is almost always faster due to skipping comic-rocket.
 * In theory there could be value in overriding it so that comic-rocket can track where you are
 * via marks but that may require debugging to make sure it overrides correctly.
 *
 * Has built-in arrow-key functionality (have not tried to override)
 *    // @match *://*.lfg.co/*
 *    // @match *://*.questionablecontent.net/*
 *    // @match *://*.schlockmercenary.com/*
 *    // @match *://*.smbc-comics.com/*
 */

function comic_rocket_arrows(e) {
   switch (e.keyCode) {
      case 37: // Left
         location.href='https://www.comic-rocket.com/go?mark&nav=prev&uri='+encodeURIComponent(location.href);
         break;
      case 39: // Right
         location.href='https://www.comic-rocket.com/go?mark&nav=next&uri='+encodeURIComponent(location.href);
         break;
      // case 38: // Up
      // case 40: // Down
      default:
         break;
   }
}
document.addEventListener('keyup', comic_rocket_arrows, false);