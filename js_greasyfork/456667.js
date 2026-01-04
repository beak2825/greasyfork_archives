// ==UserScript==
// @name        PC link - protondb.com
// @namespace   monnef.eu
// @match       https://www.protondb.com/app/*
// @grant       none
// @version     1.1
// @author      -
// @description 12/16/2022, 6:51:45 AM
// @require     https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/456667/PC%20link%20-%20protondbcom.user.js
// @updateURL https://update.greasyfork.org/scripts/456667/PC%20link%20-%20protondbcom.meta.js
// ==/UserScript==

const prefix = 'pcLink';
const linkId = prefix + '-link';

const work = () => {
  if ($('#' + linkId).length) return;
  const el = $('[data-testid=DesktopWindowsIcon]');
  if (!el.length) return;
  const pcLink = $('<a>')
    .text('▼ PC 🖥️')
    .click(() => el[0].scrollIntoView())
    .css({ marginRight: '10px', cursor: 'pointer', textDecoration: 'underline' })
    .attr('id', linkId)
  ;
  $('a:contains("Steam")[href*="store.steam"]').first().before(pcLink);
}

$(() => setInterval(work, 500));
