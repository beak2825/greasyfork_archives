// ==UserScript==
// @name     ProtonDB: link to PCGamingWiki
// @version  1
// @grant    none
// @require  https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @match    https://www.protondb.com/*
// @author   monnef
// @description Adds link to PCGW on game detail page.
// @namespace   monnef.eu
// @downloadURL https://update.greasyfork.org/scripts/388267/ProtonDB%3A%20link%20to%20PCGamingWiki.user.js
// @updateURL https://update.greasyfork.org/scripts/388267/ProtonDB%3A%20link%20to%20PCGamingWiki.meta.js
// ==/UserScript==

const cls = 'pcgw-link';

const work = () => {
  const ghEl = $('.content > div > div > a:contains(Github Issue Search)');
  if(!ghEl.length) { return; }
  if(ghEl.parent().find(`.${cls}`).length) { return; }
  const gameName = ghEl.parent().parent().children().first().text();
  const linkAddr = `https://pcgamingwiki.com/w/index.php?search=${gameName}`;
  ghEl.clone().attr('href', linkAddr).text('PCGamingWiki').addClass(cls).insertAfter(ghEl);
};

$(() => setInterval(work, 1000));
