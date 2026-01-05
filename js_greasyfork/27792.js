// ==UserScript==
// @name            Offsite Link Fixer
// @description     Replaces offsite links redirect page with the actual page
// @version         1.26
// @grant           none
// @icon            data:image/png;base64,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
// @match           http://existenz.se/out.php*
// @match           http://*.existenz.se/out.php*
// @match           https://flashback.org/leave.php*
// @match           https://*.flashback.org/leave.php*
// @match           http://leenks.com/link*.html
// @match           http://*.leenks.com/link*.html
// @match           http://tunngle.net/redirect/redirect.php*
// @match           http://*.tunngle.net/redirect/redirect.php*
// @match           http://kat.cr/confirm*
// @match           https://kat.cr/confirm*
// @namespace https://greasyfork.org/users/13667
// @downloadURL https://update.greasyfork.org/scripts/27792/Offsite%20Link%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/27792/Offsite%20Link%20Fixer.meta.js
// ==/UserScript==

var domain = window.location.host.match(/(?:www\.)?(.*)/i);

if (domain) {
  switch (domain[1]) {
    case 'existenz.se':
      doIt(document.getElementsByTagName("iframe")[0].src);
      break;
    case 'flashback.org':
      doIt(document.querySelector("a.link").href);
      break;
    case 'leenks.com':
      doIt(document.getElementsByTagName("frame")[1].src);
      break;
    case 'tunngle.net':
      doIt(document.links[3].href);
      break;
    case 'kat.cr':
      doIt(document.querySelector("a[rel=nofollow]").href);
      break;
  }
}

function doIt(url) {
	var strLocation = window.top.location || window.location;
    strLocation.replace(url);
}