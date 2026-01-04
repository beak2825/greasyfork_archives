// ==UserScript==
// @name         Grundo's Cafe - The Battledome HST Takeover Highlighter
// @namespace    https://www.grundos.cafe/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @author       yon
// @version      1.1
// @description  Highlights The Battledome members in the BD HST
// @match        https://www.grundos.cafe/dome/1p/highscores/?id=*
// @downloadURL https://update.greasyfork.org/scripts/540744/Grundo%27s%20Cafe%20-%20The%20Battledome%20HST%20Takeover%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/540744/Grundo%27s%20Cafe%20-%20The%20Battledome%20HST%20Takeover%20Highlighter.meta.js
// ==/UserScript==

const highlightColourPlayer = '#C0FFFF';
const highlightColourMember = '#E0C0FF';

const members = ['wish', 'macosten', 'possum', 'cosmic', 'lia', 'rust', 'neggtime', 'laura', 'nat', 'omega', 'penguin', 'sushi', 'vader', 'loki', 'faust', 'shel', 'stef', 'lara', 'coffee',
                 'unstock', 'teslac0ils', 'infamous', 'ddr_revolution_2', 'nathan', 'detective', 'linda', 'sandy', 'hafu', 'birdy', 'kevin', 'melody', 'shenanagins', 'rickyjay', 'fayeli',
                 'karma', 'panacea', 'xenith', 'pixie', 'forte', 'zomutt', 'moff', 'xintar', 'decimalwall', 'sports', 'mal', 'redcom9', 'maple', 'shad', 'nova', 'legacy', 'altaria',
                 'sanctuarymoon', 'aplowd', 'leelee', 'gorp', 'freakazoid', 'zander', 'yon', 'chantel', 'ufo', 'ale', 'thesovereign', 'viral', 'click', 'syntax', 'laquia', 'grim', 'mature',
                 'blacksheeps', 'ducky', 'kiki', 'rasu', 'magpie'];

const player = $('div[id="userinfo"] a[href^="/userlookup/?user="]')[0].href.split('/?user=')[1].toLowerCase();

document.querySelectorAll('table td:nth-child(2) a').forEach(a => {
    const username = a.innerText.toLowerCase();
    if (username == player) {
        a.parentElement.style.background = highlightColourPlayer;
    }
    else if (members.includes(username)) {
        a.parentElement.style.background = highlightColourMember;
    }
});
