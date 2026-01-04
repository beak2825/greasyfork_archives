// ==UserScript==
// @name        xing.com Recruiter Info without Premium
// @match       https://www.xing.com/notifications*
// @match       https://xing.com/notifications*
// @grant       none
// @version     0.0.5
// @license     GPLv3
// @icon        https://icons.duckduckgo.com/ip2/xing.com.ico
// @description Show recruiter name and unblurred photo in notifications
// @namespace https://greasyfork.org/users/1257939
// @downloadURL https://update.greasyfork.org/scripts/524319/xingcom%20Recruiter%20Info%20without%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/524319/xingcom%20Recruiter%20Info%20without%20Premium.meta.js
// ==/UserScript==

/**
 * Zips any number of arrays. It will always zip() the largest array returning undefined for shorter arrays.
 * Source: https://stackoverflow.com/a/72221748
 * @param  {...Array<any>} arrays
 */
function* zip(...arrays) {
    const maxLength = arrays.reduce((max, curIterable) =>
        Math.max(max, curIterable.length), 0
    );

    for (let i = 0; i < maxLength; i++) {
        yield arrays.map(array => array[i]);
    }
}

// Helper function to capitalize each word in a string
function capitalizeWords(str) {
    return str.split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// Function to wait for the premium section to be ready
function waitForPremiumSection(callback) {
    const intervalId = setInterval(() => {
        if (document.querySelector("a[href='/upsell/premium_offers']")) {
            clearInterval(intervalId);
            callback(); // Call the callback function when ready
        } else {
            console.debug("Waiting for feed to be ready...")
        }
    }, 200);
}

// Function to get photo and text elements
function getElements() {
    const photos = document.querySelectorAll("li:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1) > div:nth-child(1) > div:nth-child(1)");
    const texts = document.querySelectorAll("li:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)");
    return { photos, texts };
}

// Function to process photos and texts
function processPhotosAndTexts(photos, texts) {
    for (const [photo, text] of zip(photos, texts)) {
        if (photo && text) {
            photo.style.filter = "none";

            const srcParts = photo.firstChild.src.split("/");
            let recruiter = srcParts[5].slice(0, -10).replace("-", " ");
            recruiter = capitalizeWords(recruiter);
            let profileLink = `https://www.xing.com/profile/${recruiter.replace(" ", "_")}`;
            photo.parentNode.parentNode.href = profileLink;

            // Ensure that the text contains text to replace
            if (text.innerHTML.includes("Recruiter")) {
                text.innerHTML = text.innerHTML.replace(/(\w+ )*Recruiter/, `<b>${recruiter}</b>`);
                text.querySelector("a").href = profileLink;
                text.nextSibling.querySelector("span").textContent = "Zum Profil";
                text.nextSibling.querySelector("a").href = profileLink;
            }
        }
    }
}

// Main function to execute the script
function main() {
    waitForPremiumSection(() => {
        const { photos, texts } = getElements();
        processPhotosAndTexts(photos, texts);
    });
}

main();
