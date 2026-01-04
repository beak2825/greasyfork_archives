// ==UserScript==
// @name         Steam Badge Cards Highlighter
// @namespace    https://greasyfork.org/users/738914
// @version      1.1
// @license      GNU GPLv3
// @description  Highlights card quantities
// @author       iBreakEverything
// @match        https://steamcommunity.com/id/*/gamecards/*
// @match        https://steamcommunity.com/profiles/*/gamecards/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528642/Steam%20Badge%20Cards%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/528642/Steam%20Badge%20Cards%20Highlighter.meta.js
// ==/UserScript==

(function() {
    const cardQuantities = document.querySelectorAll('.badge_card_set_text_qty');
    const badgeCards = document.querySelectorAll('.gamecard').length;
    let totalCards = 0;
    cardQuantities.forEach(x => {
        totalCards += x.innerText.slice(1, x.innerText.length - 1) * 1
    });
    const averageCards = Math.floor(totalCards / badgeCards);
    cardQuantities.forEach(x => {
        let qty = x.innerText.slice(1, x.innerText.length - 1) * 1;
        // 2 or more bellow
        if (qty < averageCards - 1) {
            x.style.color = '#df1a1a';
        }
        // 1 below
        else if (qty == averageCards - 1) {
            x.style.color = '#ef9b00';
        }
        // correct ammount
        else if (qty == averageCards) {
            x.style.color = '#05c905';
        }
        // 1 above
        if (qty == averageCards + 1) {
            x.style.color = '#46bab1';
        }
        // 2 or more above
        else if (qty > averageCards) {
            x.style.color = '#4c69ff';
        }
    });
    document.querySelector('.badge_title').innerText += ` → ${averageCards} (${totalCards})`;
})();