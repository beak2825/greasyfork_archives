// ==UserScript==
// @name         GC - Giveaways Helper
// @namespace    https://greasyfork.org/en/users/1175371/
// @version      0.3
// @description  Add visual indicators to giveaways to make it easier to distinguish between special, normal, and entered giveaways. Sorts entered giveaways to the bottom of the page.
// @author       sanjix
// @match        https://www.grundos.cafe/giveaways*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503577/GC%20-%20Giveaways%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/503577/GC%20-%20Giveaways%20Helper.meta.js
// ==/UserScript==

var entered = document.evaluate(
        '//div[contains(@class,"giveaway-item")][p[contains(.,"Entered")]]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );

var special = document.evaluate(
        '//div[contains(@class,"giveaway-item")][p[contains(.,"Special")]]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );
for (let i = 0; i < special.snapshotLength; i++) {
    special.snapshotItem(i).style.backgroundImage = "linear-gradient(to bottom left, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%)";
    special.snapshotItem(i).classList.add('special');
}
for (let i = 0; i < entered.snapshotLength; i++) {
    let cur = entered.snapshotItem(i);
    cur.style.backgroundColor = "rgba(128,128,128,.1)";
    cur.style.order = 99999;
    if (cur.classList.contains('special')) {
        cur.style.backgroundImage = "linear-gradient(to left bottom, rgba(199, 0, 255, 0.2), rgba(0,0,255,.2), rgba(0,255,0,.2), rgba(247, 255, 0, 0.2), rgba(255, 131, 0, 0.2), rgba(255,0,0,.2))"
    }
}