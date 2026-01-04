// ==UserScript==
// @name         Beatport Enhancer
// @namespace    huh
// @version      2024-08-20
// @description  Misc tweaks to enhance Beatport pages
// @author       bootie
// @match        https://www.beatport.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503902/Beatport%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/503902/Beatport%20Enhancer.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    var lastUrl = ""
    var fetchingRelease = false;

    if (!location.href.includes("/release/")) {
        return;
    }

    const waitForNextData = (callback) => {
        if (!window.__NEXT_DATA__) {
            console.log(window)
            console.log("waiting for next data...")
            setTimeout(waitForNextData, 1000)
        } else {
            callback()
        }
    }

    const getData = async () => {
        if (fetchingRelease) {
            return
        }

        fetchingRelease = true;
        const accessToken = window.__NEXT_DATA__.props.pageProps.anonSession.access_token
        console.log(accessToken)

        const urlSplit = location.href.split("/")
        const releaseId = urlSplit[urlSplit.length - 1]
        const response = await fetch(`https://api.beatport.com/v4/catalog/releases/${releaseId}/`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        const data = await response.json()
        setUPC(data.upc)
        fetchingRelease = false;
    }

    const callback = async (mutationList, observer) => {
        console.log({lastUrl, href: location.href})
        if (lastUrl == location.href) {
            return
        }
        console.log("observation callback executed")
        await getData()
    }

    const createUpcLabel = (infoSection, metaSection, upc) => {
        const label = document.createElement("p")
        label.innerText = "UPC"

        const upcField = document.createElement("span")
        upcField.innerText = upc

        const upcElement = document.createElement("div")
        upcElement.id = "boots-upc"
        upcElement.className = infoSection.className
        upcElement.appendChild(label)
        upcElement.appendChild(upcField)

        metaSection.insertBefore(upcElement, metaSection.childNodes[4])
    }

    const updateUpc = (upc) => {
        console.log("Updating UPC to:", upc)
        const existingLabel = document.getElementById("boots-upc")
        existingLabel.children[1].innerText = upc
    }


    const setUPC = (upc) => {
        lastUrl = location.href
        console.log(upc)

        const infoSection = document.querySelector("[class*=\"ReleaseDetailCard-style__Info\"]")
        const metaSection = document.querySelector("[class*=\"ReleaseDetailCard-style__Meta\"]")

        const existingLabel = document.getElementById("boots-upc")
        if (!existingLabel) {
            createUpcLabel(infoSection, metaSection, upc)
            return;
        }
        updateUpc(upc);
    }

    waitForNextData(async () => await getData());
    const observer = new MutationObserver(callback);
    observer.observe(document.body, {attributes: true, childList: true, subtree: true });
})();