// ==UserScript==
// @name         RED Collage Subscription Counter
// @version      0.5
// @description  Counts torrents in collage subscriptions.
// @author       mrpoot
// @match        https://redacted.sh/userhistory.php?action=subscribed_collages
// @grant        none
// @run-at       document-end
// @namespace    https://greasyfork.org/users/148773
// @downloadURL https://update.greasyfork.org/scripts/369646/RED%20Collage%20Subscription%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/369646/RED%20Collage%20Subscription%20Counter.meta.js
// ==/UserScript==
  
(() => {
  const torrentIds = [...document.querySelectorAll('.group_info a[href^="torrents.php?id="]')].map(({ href }) => +href.replace(/\D+/g, ''));
  const collageCount = document.querySelectorAll('.subscribed_collages_table').length;
  const torrentCount = torrentIds.length;
  const uniqueCount = new Set(torrentIds).size;
  
  document.querySelector('.header h2').innerText = `${collageCount} collages with ${torrentCount} new torrents (${uniqueCount} unique)`;
})();
