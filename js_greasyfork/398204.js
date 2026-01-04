// ==UserScript==
// @name         Bing Wallpaper for Google
// @namespace    https://github.com/Gowee
// @version      0.2.6
// @description  Apply the Today on Bing wallpapers to the homepage of Google.
// @author       Gowee <whygowe@gmail.com>
// @match        https://www.google.com/
// @include      /^https?:\/\/www\.google(\.com?)?(\.[a-z]{2})?(\/(webhp)?(\?.*)?)?$/
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_xmlhttpRequest
// @require      https://greasyfork.org/scripts/421384-gm-fetch/code/GM_fetch.js?version=898562
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/398204/Bing%20Wallpaper%20for%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/398204/Bing%20Wallpaper%20for%20Google.meta.js
// ==/UserScript==

// The script is now hosted on https://github.com/Gowee/bing-wallpaper-for-google/. Changes from git is synchronized to GreasyFork automatically.

{
    // TODO: better UI
    // TODO: next/previous wallpapers
    let copyright = null;
    let copyrightTip = null;

    document.addEventListener("DOMContentLoaded", () => {
        const fsr = document.getElementById("fsr") || document.querySelector('[href^="https://policies.google.com/terms"]').parentElement;
        const wrapper = document.createElement("span");
        copyrightTip = document.createElement("a");
        wrapper.classList.add("bing-wallpaper-copyright-wrapper");
        wrapper.appendChild(copyrightTip);
        fsr.prepend(wrapper);

        if (copyright) {
            applyCopyrightTip();
        }
    });

    launch();
    function launch(_e) {
        applyStyles();
        updateWallpaper();
    }

    function applyStyles() {
        const style = document.createElement("style");
        style.textContent = `
        body {
            background-color: #555;
            background-size: cover;
        }

        a, #SIvCob, .fbar span, [class$=middle-slot-promo], button,
        [href^="https://policies.google.com/terms"] ~ * /* footer button */,
        [href$="about/products"] svg /* top-right corner app button in alternative style set */,
        .uU7dJb /* region indicator */
        {
            color: #fff !important;
        }

        #fbar {
            background: none !important;
            border: none !important;
        }

        .bing-wallpaper-copyright-wrapper {
            display: inline-block;
            /*content: "Loading a wallpaper from Bing...";*/
            color: rgba(255, 255, 255, 0.618);
            background-color: rgba(0, 0, 0, 0.372);
            line-height: 32px;
            border-radius: 4px;
            margin: auto 0.5rem auto 0.5rem;
        }

        .bing-wallpaper-copyright-wrapper > a {
            max-width: 28rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: bottom;
            /* There two sets of styles for Google homepage. Horizontal margins are set only in the case where #fsr is present. */
            margin-left: 10px;
            margin-right: 10px;
            display: inline-block; /* necessary? */
        }

        .bing-wallpaper-copyright-wrapper + .pHiOh /* for the alternative style set */ {
            margin-left: 12px;
        }

        #gbwa > div > a {
            background-position: -1519px -35px;
            opacity: 0.87777;
        }

        .sfbg, .c93Gbe {
            background: unset !important;
        }

        /* https://stackoverflow.com/questions/12662759/make-white-background-of-image-transparent-in-css */
        #hplogo img[src$=".gif"], img#hplogo[src$=".gif"] {
            mix-blend-mode: multiply;
        }

        #hptl a {
            opacity: unset !important;
        }

        .uU7dJb {
            border-bottom: unset !important;
        }
        `;
        document.documentElement.appendChild(style);
        return style;
    }

    async function updateWallpaper() {
        const glang = window.hasOwnProperty("google") && google.kHL;
        const plang = navigator.language; // plang is more specific
        const market = plang.startsWith(glang || "") ? plang : glang;
        console.log(`Market: ${market}`);
        let cachedWallpaper = JSON.parse((await GM.getValue("bing_wallpaper_cache")) || "null");
        if (cachedWallpaper) {
            applyWallpaper(cachedWallpaper);
        }
        const newWallpaper = await getBingWallpaper(market);
        GM.setValue("bing_wallpaper_cache", JSON.stringify(newWallpaper));
        if (!cachedWallpaper || newWallpaper.url != cachedWallpaper.url) {
            console.log("Bing wallpaper updated.");
            applyWallpaper(newWallpaper);
        }
    }

    async function applyWallpaper(wallpaper) {
        let count = 0;
        while (!document.body) {
            if (count >= 30) {
                throw Error(`Failed to get document.body after ${count} times attempts.`);
            }
            await new Promise((resolve) => { setTimeout(resolve, 15) });
            count += 1;
        }
        document.body.style.backgroundImage = `url(${wallpaper.url})`;
        copyright = wallpaper.copyright;
        if (copyrightTip) {
            // If the element is fetched, then trigger applying.
            // O.W. applying will be triggered by the DOMContentLoaded listener.
            // TODO: better flow structure?
            applyCopyrightTip();
        }
        console.log(`Bing Wallpaper: \n\t${copyright.notice}\n\t${copyright.url}`);
    }

    function applyCopyrightTip() {
        copyrightTip.href = copyright.url;
        copyrightTip.textContent = copyright.title;
        copyrightTip.title = copyright.notice;
    }

    async function getBingWallpaper(market) {
        // TODO: Or just omit the market to let Bing determine that by itself?
        const response = await GM_fetch(`https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=${market}`);
        const payload = await response.json();
        let copyrightUrl = payload.images[0].copyrightlink;
        if ((new URL(copyrightUrl)).protocol === "javascript:") {
            console.log("No accessible copyright URL found.");
            copyrightUrl = "https://www.bing.com/";
        }
        const wallpaper = {
            url: (new URL(payload.images[0].url, "https://www.bing.com")).toString(),
            copyright: {
                title: payload.images[0].title || payload.images[0].copyright,
                notice: payload.images[0].copyright,
                url: copyrightUrl
            }
        };
        return wallpaper;
    }

}
