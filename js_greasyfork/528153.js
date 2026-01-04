// ==UserScript==
// @name         Crime2Types
// @description  See crime types next to the names in Crimes 2.0 overview
// @version      1.1
// @namespace    kvassh.crime2types
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @homepage     https://greasyfork.org/en/scripts/528153-crime2types
// @author       Kvassh
// @match        https://www.torn.com/loader.php?sid=crimes*
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/528153/Crime2Types.user.js
// @updateURL https://update.greasyfork.org/scripts/528153/Crime2Types.meta.js
// ==/UserScript==

GM_addStyle(`
.c2t { 
    font-size:0.8rem; text-transform:none; 
}
.c2tTheft               { color:#333; border-left: 2px solid #f1948a; padding:5px; } 
.c2tCounterfeiting      { color:#333; border-left: 2px solid #fff59d; padding:5px; } 
.c2tVandalism           { color:#333; border-left: 2px solid #81d4fa; padding:5px; } 
.c2tFraud               { color:#333; border-left: 2px solid #ce93d8; padding:5px; } 
.c2tIllicitServices     { color:#333; border-left: 2px solid #a5d6a7; padding:5px; }
.c2tCybercrime          { color:#333; border-left: 2px solid #ffcc80; padding:5px; }
`);

(function() {
    'use strict';

    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    const crimeMappings = {
        "Search for cash":  "Theft",
        "Bootlegging":      "Counterfeiting",
        "Graffiti":         "Vandalism",
        "Shoplifting":      "Theft",
        "Pickpocketing":    "Theft",
        "Card Skimming":    "Fraud",
        "Burglary":         "Theft",
        "Hustling":         "Fraud",
        "Disposal":         "Illicit Services",
        "Cracking":         "Cybercrime",
        "Forgery":          "Counterfeiting",
        "Scamming":         "Fraud",
    };

    const selector = (id) => {
        if (window.innerWidth <= 765) {
            console.log("Using selector for mobile view");
            return `#react-root > div > div.crimes-hub-root > div > a:nth-child(${id}) > [class^='crimeDetails'] > div > span`;
        } else {
            console.log("Using selector for desktop view");
            return `#react-root > div > div.crimes-hub-root > div > a:nth-child(${id}) > [class^='titleBar'] > div > span`;
        }
    }

    function showCrimeTypes() {
        for (let i=0; i <= Object.keys(crimeMappings).length; i++) {
            waitForElement(selector(i)).then(el => {
                const crimeName = el.innerText.toLowerCase().split('(')[0].trim();
                console.log(crimeName);
                for (const [name, type] of Object.entries(crimeMappings)) {
                    if (crimeName.includes(name.toLowerCase())) {
                        el.innerHTML = `${crimeName} <span class="c2t c2t${type.replace(' ', '')}">(${type})</span>`;
                        break;
                    }
                }
            });
        }
    }

    /** Setup event listener for navigation so we can re-add the html after navigating back from subcrime */
    try {
        navigation.addEventListener('navigate', () => {
            setTimeout(() => {
                showCrimeTypes();
            },100);
        });
    } catch (error) {
        log("FATAL ERROR: Could not add EventListener for navigation navigate: " + JSON.stringify(error));
    }

    /** Init the main job */
    showCrimeTypes();

})();