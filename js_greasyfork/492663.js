// ==UserScript==
// @name         SteamGifts: SteamDB and overprice report links on /game/ pages
// @namespace    http://tampermonkey.net/
// @version      2024-05-26
// @description  Extend the Sidebar on Steamgifts game pages to include links to SteamDB and the overpriced reporting topic, also placing report data on clipboard
// @author       tevemadar
// @license      MIT
// @match        https://www.steamgifts.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamgifts.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492663/SteamGifts%3A%20SteamDB%20and%20overprice%20report%20links%20on%20game%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/492663/SteamGifts%3A%20SteamDB%20and%20overprice%20report%20links%20on%20game%20pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const steamurl=document.querySelector("a[data-tooltip='Visit Steam Page']").href;
    const steamdburl=steamurl.replace("store.steampowered.com","steamdb.info")+"#pricehistory";
    const name=document.getElementsByClassName("featured__heading__medium")[0].innerText;
    const timestamp=new Date(parseInt(Array.from(document.querySelectorAll(".giveaway__columns>*>span")).pop().getAttribute("data-timestamp"))*1000).toDateString();

    const markdown = `[${name}](${location.href}) [Steam](${steamurl}) [$](${steamdburl}) `+
          `\`[${name}](${steamurl}) | <PUBLISHER_NAME> | [Link](${location.href}) | <CV_STATUS> | [<MAX_PRICE>](${steamdburl}) | <PRICE_INCREASE_DATE> | ${timestamp}\``;

    for(let item of document.getElementsByClassName("sidebar__heading")) {
        if(item.textContent==="Tools") {
            const ul=item.nextSibling;
            const steamdb=ul.getElementsByTagName("li")[0].cloneNode(true);
            const steamdblink=steamdb.getElementsByTagName("a")[0];
            steamdblink.href=steamdburl;
            steamdblink.target="_blank";
            steamdb.getElementsByTagName("div")[0].textContent="SteamDB";
            ul.appendChild(steamdb);

            const report=steamdb.cloneNode(true);
            const reportlink=report.getElementsByTagName("a")[0];

            /* Options:
             * - try the search (live)
             * - jump to last page (commented)
             */
            reportlink.href="/discussion/eIkkz/?q="+encodeURIComponent(location.href);
            //reportlink.href="/discussion/eIkkz/?page=last";

            /* Options:
             * - try putting markdown on clipboard (live)
             * - show markdown in a "prompt", for manual copy (commented), this one is a workaround and may be stopped by popup blockers on first click
             */
            reportlink.setAttribute("onclick",`navigator.clipboard.writeText("${markdown}")`);
            //reportlink.setAttribute("onclick",`prompt("Markdown","${markdown}")`);

            report.getElementsByTagName("div")[0].textContent="Report";
            ul.appendChild(report);
        }
    }
})();