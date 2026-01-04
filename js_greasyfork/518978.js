// ==UserScript==
// @name         TVDB Episode Input Automation
// @match        https://thetvdb.com/series/*/seasons/*/bulkadd
// @description Automate entering episode data into a TVDB season
// @license AGPL
// @version 0.0.1.20241126225939
// @namespace https://greasyfork.org/users/937339
// @downloadURL https://update.greasyfork.org/scripts/518978/TVDB%20Episode%20Input%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/518978/TVDB%20Episode%20Input%20Automation.meta.js
// ==/UserScript==

const episodeData = [
  {
    number: '4',
    name: 'American Stepdad',
    overview: 'When Stan invites his recently widowed mother to move in, she and Roger fall in love and wed; Steve and his friends find a lost movie script.',
    date: '2012-11-18',
    runtime: 25
  },
  {
    number: '5',
    name: "Why Can't We Be Friends?",
    overview: "When Stan decides that Snot isn't cool enough to be Steve's best friend, he tries to separate them by staging a shooting at an ice cream parlor.",
    date: '2012-12-5',
    runtime: 25
  }
];

function fillEpisodeData(episodes) {
    // Get all episode rows
    const rows = document.querySelectorAll('.multirow-item');

    episodes.forEach((episode, index) => {
        if (index >= rows.length - 1) {
            // Click "Add Another" button if we need more rows
            document.querySelector('.multirow-add').click();
        }

        const row = document.querySelectorAll('.multirow-item')[index];

        // Fill episode number
        row.querySelector('input[name="number[]"]').value = episode.number;

        // Fill episode name
        row.querySelector('input[name="name[]"]').value = episode.name;

        // Fill overview
        row.querySelector('textarea[name="overview[]"]').value = episode.overview;

        // Fill date
        if (episode.date) {
            row.querySelector('input[name="date[]"]').value = episode.date;
        }

        // Fill runtime
        if (episode.runtime) {
            row.querySelector('input[name="runtime[]"]').value = episode.runtime;
        }
    });
}

// Add button to trigger the fill
const btn = document.createElement('button');
btn.innerText = 'Auto-fill Episodes';
btn.style.position = 'fixed';
btn.style.top = '10px';
btn.style.right = '10px';
btn.style.zIndex = '9999';
btn.onclick = () => fillEpisodeData(episodeData);
document.body.appendChild(btn);