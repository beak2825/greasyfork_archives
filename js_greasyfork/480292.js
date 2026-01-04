// ==UserScript==
// @name         Scrape CosplayNS
// @namespace    http://yu.net/
// @version      1.3
// @description  Scrape Data Mitaku
// @author       You
// @match        https://cosplaynsfw.cam/cosplayer/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cosplaynsfw.cam
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @grant        GM_unregisterMenuCommand
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480292/Scrape%20CosplayNS.user.js
// @updateURL https://update.greasyfork.org/scripts/480292/Scrape%20CosplayNS.meta.js
// ==/UserScript==

const MODE_SCRAPING = "scraping";
const KEY_DATA_SCRAPE = "data-scrape";

let idStartScraping = null;
let idStopScraping = null;

async function scrapeCosplayer() {
    let newData = ""
    const articles = document.querySelectorAll(".content-wrapper article")
    for(const article of articles) {
        const title = article.querySelector("h2.title.main-title").innerText || ""
        const link = article.querySelector("h2.title.main-title a").getAttribute("href") || null

        newData += `${title},CosplayNS,${link}\n`
    }

    let scrapeData = await GM_getValue(KEY_DATA_SCRAPE, "")
    scrapeData += newData
    await GM_setValue(KEY_DATA_SCRAPE, scrapeData)

    const pagination = document.querySelector(".epcl-pagination .nav")
    if(pagination.lastElementChild.innerText == "Next") {
        await GM_setValue(MODE_SCRAPING, true)
        pagination.lastElementChild.click()
    } else {
        await GM_deleteValue(MODE_SCRAPING)
        GM_unregisterMenuCommand(idStopScraping)
        alert("Scraping Stop")
        idStartScraping = GM_registerMenuCommand("Scrape Cosplayer", () => {
            scrapeCosplayer()
            GM_unregisterMenuCommand(idStartScraping)
        })
    }
}

(async function() {
    'use strict';

    if(await GM_getValue(MODE_SCRAPING, null)) {
        idStopScraping = GM_registerMenuCommand("Stop Scraping", async () => {
            await GM_deleteValue(MODE_SCRAPING)
            GM_unregisterMenuCommand(idStopScraping)
            alert("Scraping Stop")
            idStartScraping = GM_registerMenuCommand("Scrape Cosplayer", () => {
                scrapeCosplayer()
                GM_unregisterMenuCommand(idStartScraping)
            })
        })

        scrapeCosplayer()
    } else {
        idStartScraping = GM_registerMenuCommand("Scrape Cosplayer", () => {
            scrapeCosplayer()
            GM_unregisterMenuCommand(idStartScraping)
        })
    }

    GM_registerMenuCommand("Copy Data Scrape", async () => {
        let data = await GM_getValue(KEY_DATA_SCRAPE, null)
        if( !data ) {
            alert("Tidak ada data")
            return
        }

        await GM_setClipboard(data, "text")

        alert("Data berhasil disalin")
    })

    GM_registerMenuCommand("Clear Data Scrape", async () => {
        await GM_deleteValue(KEY_DATA_SCRAPE)
        await GM_deleteValue(MODE_SCRAPING)
        idStartScraping = GM_registerMenuCommand("Scrape Cosplayer", () => {
            scrapeCosplayer()
            GM_unregisterMenuCommand(idStartScraping)
        })
        alert("All Clear")
    })
})();