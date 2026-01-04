// ==UserScript==
// @name         Ao3 Only Show Primary Pairing (Auto)
// @namespace    tencurse
// @version      1.28
// @description  Hides works where specified pairing isn't the first listed
// @author       tencurse
// @match        *://archiveofourown.org/*
// @match        *://www.archiveofourown.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484106/Ao3%20Only%20Show%20Primary%20Pairing%20%28Auto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/484106/Ao3%20Only%20Show%20Primary%20Pairing%20%28Auto%29.meta.js
// ==/UserScript==

/* START CONFIG */
const detectPrimaryCharacter = true; // Enable auto-detection for primary characters
const relpad = 3; // At least one relationship within this many relationship tags
const charpad = 5; // At least one character within this many character tags

// MANUAL CONFIGURATION
const relationships = []; // Add relationship tags here
const characters = []; // Add character tags here
/* END CONFIG */

(async function () {
    // Add CSS styles for hidden work items
    const style = document.createElement("style");
    style.textContent = `
        .workhide {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8em;
            margin: 0.15em 0;
            width: 100%;
        }

        [data-ospp-visibility="false"] > :not(.header),
        [data-ospp-visibility="false"] > .header > :not(h4) { display: none!important; }

        [data-ospp-visibility="false"] > div.workhide { display: flex!important; }

        [data-ospp-visibility="false"] > .header,
        [data-ospp-visibility="false"] > .header > h4 {
            margin: 0!important; min-height: auto; font-size: .9em; font-style: italic; }

        [data-ospp-visibility="false"] { opacity: .6; }
    `;
    document.head.appendChild(style);

    // Identify tag type and add it to relevant arrays if needed
    const fandomLinkElement = document.querySelector("h2.heading a");
    const fandomLink = fandomLinkElement.href;
    const tagName = fandomLinkElement.innerText;
    const isCharacterTag = !(tagName.includes("/") || tagName.includes("&"));

    if (isCharacterTag && detectPrimaryCharacter) {
        characters.push(tagName);
    } else if (!isCharacterTag) {
        relationships.push(tagName);
    }

    // If no tags are configured and character detection is disabled, exit early
    if (!detectPrimaryCharacter && !characters.length && !relationships.length) {
        return;
    }

    // Processed link for fetching data
    const processedFandomLink = fandomLink.slice(fandomLink.indexOf("tags"));
    const fandomDataAvailable = await fetchFandomData(processedFandomLink, isCharacterTag);

    if (!fandomDataAvailable) return; // Exit if no fandom data is found

    // Filter and hide works based on configured tags
    document.querySelectorAll(".index .blurb").forEach((blurb) => {
        const tags = blurb.querySelector("ul.tags");
        const relTags = Array.from(tags.querySelectorAll(".relationships")).slice(0, relpad).map(el => el.innerText);
        const charTags = Array.from(tags.querySelectorAll(".characters")).slice(0, charpad).map(el => el.innerText);

        const relmatch = relTags.some(tag => relationships.includes(tag));
        const charmatch = detectPrimaryCharacter && charTags.some(tag => characters.includes(tag));

        if (!relmatch && !charmatch) {
            blurb.setAttribute("data-ospp-visibility", "false");
            const buttonDiv = document.createElement("div");
            buttonDiv.className = "workhide";
            buttonDiv.innerHTML = `
                <div class="left">Your preferred tag is not prioritised in this work.</div>
                <div class="right"><button type="button" class="showwork">Show Work</button></div>
            `;
            blurb.insertAdjacentElement("beforeend", buttonDiv);
        }
    });

    // Show work functionality: removes the button after showing the work
    document.addEventListener("click", (event) => {
        if (event.target.matches(".showwork")) {
            const blurb = event.target.closest(".blurb");
            const button = event.target;
            const isHidden = blurb.getAttribute("data-ospp-visibility") === "false";

            if (isHidden) {
                blurb.setAttribute("data-ospp-visibility", "true");
                button.textContent = "Hide Work";
            } else {
                blurb.setAttribute("data-ospp-visibility", "false");
                button.textContent = "Show Work";
            }
        }
    });

    // Function to fetch fandom data and add synonyms to tags
    async function fetchFandomData(link, isCharacterTag) {
        try {
            const response = await fetch("/" + link + " .parent");
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Check for the 3rd or 4th <p> element and exit if it contains "Additional Tags Category"
            const pElements = doc.querySelectorAll("p");
            if ((pElements[2] && pElements[2].textContent.includes("Additional Tags Category")) ||
                (pElements[3] && pElements[3].textContent.includes("Additional Tags Category"))) {
                return false;
            }

            // Get synonyms from <ul> elements with specified classes
            const synonymSources = doc.querySelectorAll("ul.tags.commas.index.group, ul.tags.tree.index");

            synonymSources.forEach((ul, index) => {
                if (index == 0) return; // Always skip the first <ul> since it contains parent tags
                ul.querySelectorAll(":scope > li").forEach(li => {
                    processListItem(li, isCharacterTag);
                })
            });

            return true;
        } catch (error) {
            console.error('Error fetching fandom data:', error);
            return false;
        }
    }

    function processListItem(li, isCharacterTag) {
        const synonym = li.querySelector('a').textContent.trim();
        const targetArray = isCharacterTag && detectPrimaryCharacter ? characters : relationships;
        if (!targetArray.includes(synonym)) targetArray.push(synonym);

        // Process any nested UL's list items
        const nestedUL = li.querySelector(':scope > ul');
        if (nestedUL) {
            for (const nested of nestedUL.children) {
                processListItem(nested, isCharacterTag);
            }
        }
    }

})();
