// ==UserScript==
// @name     GamingOnLinux: Hide support banner
// @version  2
// @grant    none
// @require  https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @match    https://www.gamingonlinux.com/*
// @author   monnef
// @description Hides support/donate banner on top and bellow comments.
// @namespace   monnef.eu
// @downloadURL https://update.greasyfork.org/scripts/389498/GamingOnLinux%3A%20Hide%20support%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/389498/GamingOnLinux%3A%20Hide%20support%20banner.meta.js
// ==/UserScript==

$(() => {
  $('.group.announce a[href="https://www.patreon.com/liamdawe"]').closest('.col-12').remove();
  $('.box.patreon_comments').remove();
});
