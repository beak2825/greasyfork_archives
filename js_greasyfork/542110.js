// ==UserScript==
// @name         forum_blacklist_with_clan
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  Бан данжей
// @author       Kpgich
// @license      GNU GPLv3
// @match        https://www.heroeswm.ru/forum*
// @match        https://my.lordswm.com/forum*
// @match        https://www.lordswm.com/forum*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542110/forum_blacklist_with_clan.user.js
// @updateURL https://update.greasyfork.org/scripts/542110/forum_blacklist_with_clan.meta.js
// ==/UserScript==

(() => {
    const blacklistNicks = ["ex-or", "tentorium"];
    const blacklistClans = [4538];
    const msgTable = document.querySelector("body > center > table:nth-child(2) > tbody > tr > td > table > tbody");

    if (!msgTable) return console.warn("Forum message table not found.");

    const elementsToRemove = [];

    for (let i = 2; i <= msgTable.children.length; i += 2) {
        const msgRow = msgTable.querySelector(`tr:nth-child(${i}) > td:nth-child(1) > nobr > b`);
        const clanRow = msgTable.querySelector(`tr:nth-child(${i}) > td:nth-child(1) a[href*="clan_info.php?id="]`);

        let nickname = msgRow?.lastChild?.innerText.trim();
        let clanId = clanRow?.href.match(/id=(\d+)/)?.[1];

        if (blacklistNicks.includes(nickname) || (clanId && blacklistClans.includes(parseInt(clanId)))) {
            const msgFooter = msgTable.querySelector(`tr:nth-child(${i})`);
            const msgBody = msgTable.querySelector(`tr:nth-child(${i + 1})`);
            if (msgFooter && msgBody) {

                elementsToRemove.push(msgFooter, msgBody);
            }
        }
    }

    elementsToRemove.forEach(element => element.remove());
})();
