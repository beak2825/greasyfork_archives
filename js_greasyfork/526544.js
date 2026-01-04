// ==UserScript==
// @name         Dead Frontier - Money Warning Banner
// @namespace    Dead Frontier - Money Warning Banner
// @version      1.2
// @description  Display a big banner on the Outpost showing how much money you are carrying!
// @author       ils94
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526544/Dead%20Frontier%20-%20Money%20Warning%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/526544/Dead%20Frontier%20-%20Money%20Warning%20Banner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getMiniOutpostName() {
        // Extracts minioutpostname from the script content
        const scripts = document.querySelectorAll("script[type='text/javascript']");
        for (const script of scripts) {
            if (script.textContent.includes("initData(")) {
                const match = script.textContent.match(/minioutpostname=([^&']+)/);
                return match ? decodeURIComponent(match[1]) : null;
            }
        }
        return null;
    }

    function getCash() {
        // Returns current cash-on-hand.
        const uservars = window.userVars;
        return parseInt(uservars["df_cash"]);
    }

    function warningBanner(outpostName) {
        // Creates warning banner element and adjusts position based on outpost.
        const banner = document.createElement("div");

        banner.style.position = "absolute";
        banner.style["text-align"] = "center";
        banner.style["font-size"] = "30px";
        banner.style["font-weight"] = "bold";
        banner.style.width = "700px";
        banner.style.color = "red";
        banner.setAttribute("mwic", "banner");

        // Default position
        banner.style.top = "450px";
        banner.style.left = "50%";
        banner.style.transform = "translateX(-50%)";

        // Adjust position based on outpost name
        if (outpostName === "Nastya`s Holdout") {
            banner.style.top = "350px";
        } else if (outpostName === "Secronom Bunker") {
            banner.style.top = "450px";
        } else if (outpostName === "Fort Pastor") {
            banner.style.top = "470px";
        } else if (outpostName === "Precinct 13") {
            banner.style.top = "480px";
        } else if (outpostName === "Dogg`s Stockade") {
            banner.style.top = "450px";
        }

        return banner;
    }

    function removeWarningBanner(outpost) {
        // Removes warning banner from outpost screen.
        const children = outpost.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].getAttribute("mwic") == "banner") {
                children[i].remove();
                break;
            }
        }
    }

    function refreshBanner(outpost, outpostName) {
        removeWarningBanner(outpost);
        const banner = warningBanner(outpostName);
        banner.innerHTML = `<span style="color: white;">Money Warning!</span>
                            <span style="background: #E6CC4D; background-image: -webkit-gradient( linear, left top, left bottom, color-stop(0, #E6CC4D), color-stop(0.5, #E6CC4D), color-stop(1, #000000) );
                            -webkit-background-clip: text; -webkit-text-fill-color: transparent;"><br><br>$${getCash().toLocaleString()}</span>`;
        outpost.append(banner);
    }

    function main() {
        let previous_cash = 0;
        if (getCash()) {
            const outpost = document.getElementById("outpost");
            const outpostName = getMiniOutpostName();
            refreshBanner(outpost, outpostName);
        }
    }

    main();
})();
