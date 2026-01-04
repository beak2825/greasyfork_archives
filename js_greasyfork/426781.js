// ==UserScript==
// @name        Pricespy/Prisjakt Redirect Skiper
// @namespace   Pricespy/Prisjakt Redirect Skiper by C4illin
// @description Skips the "Click Here to Continue" buttons
// @match       *://*.prisjakt.nu/redirect.php?ftgid=*
// @match       *://*.prisjakt.no/redirect.php?ftgid=*
// @match       *://*.pricespy.co.uk/redirect.php?ftgid=*
// @match       *://*.pricespy.uk/redirect.php?ftgid=*
// @match       *://*.pricespy.co.nz/redirect.php?ftgid=*
// @match       *://*.pricespy.ie/redirect.php?ftgid=*
// @match       *://*.kompario.pl/redirect.php?ftgid=*
// @match       *://*.ledenicheur.fr/redirect.php?ftgid=*
// @match       *://*.pagomeno.it/redirect.php?ftgid=*
// @match       *://*.hintaopas.fi/redirect.php?ftgid=*
// @match       *://*.prisjagt.dk/redirect.php?ftgid=*
// @run-at      document-start
// @grant       none
// @author      C4illin <C@illin.cf>
// @oujs:author C4illin
// @version     1.2.2
// @license     MIT; https://opensource.org/licenses/MIT
// @copyright   2018, C4illin (https://github.com/C4illin)
// @downloadURL https://update.greasyfork.org/scripts/426781/PricespyPrisjakt%20Redirect%20Skiper.user.js
// @updateURL https://update.greasyfork.org/scripts/426781/PricespyPrisjakt%20Redirect%20Skiper.meta.js
// ==/UserScript==

if (window.location.search.endsWith("&go=1") == false) {
  var newlink = window.location.origin + window.location.pathname + window.location.search + "&go=1"
  window.location.replace(newlink)
}