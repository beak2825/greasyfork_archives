// ==UserScript==
// @id          Lichess_Compact_Lobby@https://github.com/ddugovic/UserScripts
// @name        Lichess Compact Lobby
// @namespace   https://github.com/ddugovic/UserScripts
// @description Condense lobby page for 720p display
// @author      ddugovic
// @copyright   2024+, ddugovic
// @license     AGPL-3.0-or-later
// @supportURL  https://github.com/ddugovic/UserScripts/issues
// @version     0.8
// @match       https://lichess.org/
// @grant       none
// @icon        https://raw.githubusercontent.com/ornicar/lila/master/public/images/favicon-32-white.png
// @downloadURL https://update.greasyfork.org/scripts/13286/Lichess%20Compact%20Lobby.user.js
// @updateURL https://update.greasyfork.org/scripts/13286/Lichess%20Compact%20Lobby.meta.js
// ==/UserScript==

document.getElementsByClassName('lobby__tv')[0].style.display = 'none';
document.getElementsByClassName('lobby__puzzle')[0].style.display = 'none';

var table = document.getElementsByClassName('lobby__table')[0];
while (table.firstChild) {
    table.firstChild.remove();
}
var cards = document.getElementsByClassName('ublog-post-card');
for (const card of cards) {
    table.appendChild(card.cloneNode(true));
    card.parentNode.removeChild(card);
}

var events = document.getElementsByClassName('lobby__tournaments-simuls')[0];
events.parentNode.removeChild(events);

var winners = document.getElementsByClassName('lobby__wide-winners')[0];
winners.parentNode.removeChild(winners);

var app = document.getElementsByClassName('lobby__app')[0];
var feed = document.getElementsByClassName('lobby__feed')[0];

var feedClone = feed.cloneNode(true);
app.insertBefore(feedClone, app.firstChild)
feed.parentNode.removeChild(feed);
app.style.height = 'inherit';
