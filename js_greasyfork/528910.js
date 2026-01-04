// ==UserScript==
// @name         Reorder Certificates
// @namespace    FarmRPGCertificates
// @version      1.1.1
// @description  Reorders certificates based on completion percentage and simplifies the interface
// @author       ClientCoin
// @match        http*://*farmrpg.com/index.php
// @match        http*://*farmrpg.com/
// @match        http*://*alpha.farmrpg.com/
// @match        http*://*alpha.farmrpg.com/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528910/Reorder%20Certificates.user.js
// @updateURL https://update.greasyfork.org/scripts/528910/Reorder%20Certificates.meta.js
// ==/UserScript==



function reorderCertificates() {

    const locName = location.hash.slice(location.hash.search(/[^#!\/]/), location.hash.search(/.php/))
    if (locName != "temple") {
        return;
    }

    //console.log("%c[Script] Reordering certificates...", "color: cyan; font-weight: bold;");

    let allContentBlocks = document.querySelectorAll(".content-block");
    let certificatesContainer = null;

    allContentBlocks.forEach(block => {
        let titleElement = block.querySelector(".content-block-title");
        if (titleElement && titleElement.textContent.trim() === "Secret Chains") {
            certificatesContainer = block.querySelector(".list-block ul");
        }
    });

    if (!certificatesContainer) {
        console.warn("%c[Script] Certificates container not found. Exiting.", "color: red;");
        return;
    }

    let certificateElements = Array.from(certificatesContainer.querySelectorAll("li"));
    if (certificateElements.length === 0) {
        console.warn("%c[Script] No certificate elements found. Exiting.", "color: red;");
        return;
    }

    //console.log("%c[Script] Found certificate elements:", "color: cyan;", certificateElements);

    let certificateBlocks = certificateElements.map(certificate => {
        let progress = extractProgress(certificate);
        //console.log(`%c[Script] Extracted progress: ${progress}%`, "color: lightgreen;");
        return { element: certificate, progress };
    });

    let completedCount = certificateBlocks.filter(c => c.progress === 100).length;
    let maxCount = certificateBlocks.length;

    // Sorting: Completed (100%) certificates at the bottom
    certificateBlocks.sort((a, b) => {
        // Move 100% completed items to the bottom
        if (a.progress === 100 && b.progress !== 100) return 1;
        if (b.progress === 100 && a.progress !== 100) return -1;

        // Sort by highest progress first
        let progressSort = b.progress - a.progress;
        if (progressSort !== 0) return progressSort;

        // If progress is the same, sort by itemsToGo (ascending)
        return a.itemsToGo - b.itemsToGo;
    });



    //console.log("%c[Script] Certificates sorted by progress.", "color: cyan;");

    certificatesContainer.innerHTML = ""; // Clear the list

    // Insert summary at the top
    let summaryElement = document.createElement("li");
    const certificateImages = [
        '7896-yellow.png', '7896-yellow.png', '7896-yellow.png',
        '7896-yellow.png', '7896-yellow.png', '7896-yellow.png',
        '7896-green.png', '7896-green.png', '7896-green.png',
        '7896-green.png', '7896-green.png', '7896-green.png',
        '7896.png', '7896.png', '7896.png', '7896.png',
        '7896-orange.png', '7896-orange.png',
        '7896-purple.png', '7896-purple.png',
        '7896-gray.png',
        '7896-blue.png'
    ];

    // Shuffle function
    function shuffleArray(arr) {
        return arr.map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    }

    const shuffledCertificates = shuffleArray(certificateImages);
    const beforeImages = shuffledCertificates.slice(0, 11);
    const afterImages = shuffledCertificates.slice(11);

    // Create HTML blocks
    const makeImageBlock = (images) =>
    images.map(src => `<img src="/img/items/${src}" style="height:1rem;width:1rem;margin:0 1px;">`).join('');

    summaryElement.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 4px; white-space: nowrap; overflow: hidden;">
        <div style="display: flex; gap: 2px; flex-shrink: 1; overflow: hidden;">
            ${makeImageBlock(beforeImages)}
        </div>
        <div style="font-weight: bold; color: gold; text-align: center; padding: 5px; flex-shrink: 0; min-width: 180px;">
            ${completedCount}/${maxCount} Certificates COMPLETE
        </div>
        <div style="display: flex; gap: 2px; flex-shrink: 1; overflow: hidden;">
            ${makeImageBlock(afterImages)}
        </div>
    </div>
`;

    certificatesContainer.appendChild(summaryElement);

// === Progress Summary (Total Crops Remaining) ===
// === Progress Summary (Total Crops Remaining) ===
let totalToGo = 0;
let cropCount = 0;

certificateBlocks.forEach(({ element }) => {
    const span = element.querySelector(".item-inner span");
    if (!span) return;

    const rawText = span.textContent.trim();
    //console.log("[DEBUG] Raw span content:", rawText);

    const match = rawText.match(/([\d,]+)\s*\/\s*([\d,]+)\s*Items Sacrificed/i);
    if (match) {
        const sacrificed = parseInt(match[1].replace(/,/g, ''));
        const required = parseInt(match[2].replace(/,/g, ''));
        const toGo = required - sacrificed;
        totalToGo += toGo;
        cropCount++;
        //console.log(`[DEBUG] Sacrificed=${sacrificed}, Required=${required}, To Go=${toGo}`);
    } else if (/COMPLETE/i.test(rawText)) {
        cropCount++;
        //console.log("[DEBUG] COMPLETE certificate detected");
    } else {
        console.warn("[DEBUG] No match for sacrificed/required in:", rawText);
    }
});

const totalRequired = cropCount * 100000;
const percentComplete = ((totalRequired - totalToGo) / totalRequired * 100).toFixed(2);

const cropSummary = document.createElement("li");
cropSummary.innerHTML = `
    <div style="font-weight: bold; color: lightgreen; text-align: center; padding: 5px;">
        ${totalToGo.toLocaleString()} to go out of ${totalRequired.toLocaleString()} crops (${percentComplete}%)
    </div>
`;
certificatesContainer.appendChild(cropSummary);





    // Append reordered certificates
    certificateBlocks.forEach(({ element }) => {
        simplifyText(element);
        certificatesContainer.appendChild(element);
    });
    console.log("Certificates reordered and updated.");
}

function extractProgress(element) {
    let titleElement = element.querySelector(".item-title");
    if (!titleElement) {
        console.warn("%c[Script] Title element not found in certificate block.", "color: orange;");
        return 0;
    }

    // Extract sacrificed and required item counts
    let progressMatch = titleElement.innerText.match(/(\d{1,3}(?:,\d{3})*) \/ (\d{1,3}(?:,\d{3})*) Items Sacrificed/);

    if (!progressMatch) {
        console.warn("%c[Script] No progress values found in:", "color: orange;", titleElement.innerText);
        return 0;
    }

    let sacrificed = parseInt(progressMatch[1].replace(/,/g, '')); // Remove commas
    let required = parseInt(progressMatch[2].replace(/,/g, ''));

    // Calculate precise percentage
    let progress = (sacrificed / required) * 100;

    //console.log(`%c[Script] Corrected progress: ${progress.toFixed(2)}% (${sacrificed}/${required})`, "color: lightgreen;");

    return progress;
}


function simplifyText(element) {
    let titleElement = element.querySelector(".item-title");
    let imgElement = element.querySelector(".item-media img");

    if (!titleElement) {
        console.warn("%c[Script] Title element not found in certificate block.", "color: orange;");
        return;
    }

    if (element.classList.contains("row")) {
        element.style.marginBottom = "0px";
    }

    let nameMatch = titleElement.innerText.match(/Certificate of (.+?) Giving/);
    let progressMatch = titleElement.innerText.match(/(\d+(?:,\d+)?) \/ (\d+(?:,\d+)?) Items Sacrificed/);
    let onHandMatch = titleElement.innerText.match(/Sacrifice: (.+?) \(You have (\d+(?:,\d+)?)\)/);

    if (nameMatch && progressMatch && onHandMatch) {
        let itemName = nameMatch[1];
        let totalRequired = parseInt(progressMatch[2].replace(/,/g, ''));
        let sacrificed = parseInt(progressMatch[1].replace(/,/g, ''));
        let onHand = parseInt(onHandMatch[2].replace(/,/g, ''));
        let itemsToGo = totalRequired - sacrificed;
        let progressPercent = (sacrificed / totalRequired) * 100;

        let color = "white";
        if (itemsToGo === 0) color = "gold";
        else if (progressPercent >= 75) color = "lightgreen";
        else if (sacrificed < 10000) color = "grey";

        let lower10kThreshold = Math.floor(itemsToGo / 10000) * 10000;
        let remainingToLower10k = itemsToGo - lower10kThreshold;
        if (remainingToLower10k === 0) remainingToLower10k = 10000;

        let nn = "COMPLETE".padStart(15, '\u00A0');
        let outputPad = itemsToGo === 0
        ? `${nn} [${onHand.toLocaleString().padStart(7, '\u00A0')} on hand]`
    : `${itemsToGo.toLocaleString().padStart(9, '\u00A0')} to go [${onHand.toLocaleString().padStart(7, '\u00A0')} on hand]`;


        // Build the left block (60%) — content inside <a>
        let container = document.createElement("div");
        container.style.display = "flex";
        container.style.flexFlow = "row nowrap";
        container.style.alignItems = "center";
        container.style.verticalAlign = "middle";
        container.style.marginTop = "auto";
        container.style.marginBottom = "auto";

        let left = document.createElement("div");
        left.style.width = "20%";
        left.style.textAlign = "left";
        left.textContent = `${itemName}: `;

        let right = document.createElement("div");
        right.style.width = "80%";
        right.style.textAlign = "left";
        right.style.whiteSpace = "nowrap";
        right.style.overflow = "hidden";
        right.style.textOverflow = "ellipsis"; // optional, if you want to clip long lines with …
        right.innerHTML = `${outputPad}`;


        container.appendChild(left);
        container.appendChild(right);

        let span = document.createElement("span");
        span.style.color = color;
        span.appendChild(container);

        let outer = document.createElement("span");
        outer.style.fontFamily = "monospace";
        outer.style.width = "100%";
        outer.style.fontSize = "0.833rem";
        outer.appendChild(span);

        titleElement.outerHTML = outer.outerHTML;

        if (imgElement) {
            imgElement.style.width = "1rem";
            imgElement.style.height = "1rem";
        }

        let smallImgElement = element.querySelector(".item-after img");
        if (smallImgElement) {
            smallImgElement.style.width = "1rem";
            smallImgElement.style.height = "1rem";
        }

        // === Restructure LI ===
        let liElement = element.closest("li");
        let aTag = liElement.querySelector("a");
        if (!liElement || !aTag) return;

        // Create flex container
        let wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.width = "100%";

        // Left side: wrap <a> in div
        let leftDiv = document.createElement("div");
        leftDiv.style.width = "60%";
        leftDiv.appendChild(aTag); // Moves <a> inside left div

        // Right side: build button panel
        let rightDiv = document.createElement("div");
        rightDiv.style.width = "40%";
        rightDiv.style.display = "flex";
        rightDiv.style.flexDirection = "row";
        rightDiv.style.alignItems = "center";
        rightDiv.style.justifyContent = "space-between";

        const wrap = (link) => {
            const wrapper = document.createElement("div");
            wrapper.style.width = "33.33%";
            wrapper.style.display = "flex";
            wrapper.style.justifyContent = "center";
            wrapper.appendChild(link);
            return wrapper;
        };

        const isComplete = itemsToGo === 0;
        const notEnoughForNext10k = onHand < remainingToLower10k;

        const link1 = createLink(`Give ${onHand}`, onHand, itemName, 'all', itemsToGo, remainingToLower10k, isComplete);
        const give1kDisabled = isComplete || onHand < 1000;
        const link2 = createLink(`Give 1k`, onHand, itemName, '1k', itemsToGo, remainingToLower10k, give1kDisabled);
        const link3 = createLink(`Give ${remainingToLower10k}`, onHand, itemName, 'tothenext10k', itemsToGo, remainingToLower10k, isComplete || notEnoughForNext10k);


        rightDiv.appendChild(wrap(link1));
        rightDiv.appendChild(wrap(link2));
        rightDiv.appendChild(wrap(link3));


        // Clear the original LI content and re-append
        liElement.innerHTML = "";
        wrapper.appendChild(leftDiv);
        wrapper.appendChild(rightDiv);
        liElement.appendChild(wrapper);
    } else {
        console.warn("%c[Script] Failed to extract data for certificate text update.", "color: orange;");
    }
}

function createLink(linkText, onHand, itemName, type, itemsToGo, remainingToLower10k, disabled = false) {
    let link = document.createElement("a");
    link.innerText = linkText;
    link.href = "#";

    link.style.textDecoration = "none";
    link.style.background = "transparent";
    link.style.border = "1px solid";
    link.style.borderRadius = "6px";
    link.style.fontSize = "0.7rem";
    link.style.cursor = disabled ? "not-allowed" : "pointer";
    link.style.padding = "0.1rem 0.6rem";
    link.style.margin = "0";
    link.style.display = "inline-block";
    link.style.width = "90px";               // fixed width
    link.style.textAlign = "center";
    link.style.zIndex = 2;
    link.style.whiteSpace = "nowrap";

    if (disabled) {
        link.style.color = "gray";
        link.style.borderColor = "gray";
        link.onclick = function (e) {
            e.preventDefault();
        };
    } else {
        link.style.color = "gold";
        link.style.borderColor = "gold";

        link.onclick = function (e) {
            e.preventDefault();
            const params = new URLSearchParams();
            params.append("go", "sacrificeitem");
            params.append("item", itemName);
            params.append("amt", getAmount(type, onHand, itemsToGo, remainingToLower10k));
            params.append("special", "1");

            const url = `worker.php?${params.toString()}`;
            fetch(url, { method: "GET" })
                .then((response) => response.text())
                .then((data) => {
                if (data === "success") {
                    window.location.reload();
                } else {
                    console.warn("%c[Error] Something went wrong: ", "color: red;", data);
                }
            })
                .catch((error) => {
                console.error("%c[Error] AJAX request failed: ", "color: red;", error);
            });
        };
    }

    return link;
}


function getAmount(type, onHand, itemsToGo, remainingToLower10k) {
    switch (type) {
        case "all":
            return onHand;
        case "1k":
            return 1000;
        case "tothenext10k":
            return remainingToLower10k;
        default:
            return 0;
    }
}








function init() {
    //console.log("%c[Script] Initializing...", "color: green;");
    reorderCertificates();
    injectCSS();
}

window.addEventListener("load", init); // Ensures the script runs only once


function injectCSS() {
    const style = document.createElement('style');
    style.innerHTML = `
.list-block .item-content {
    min-height: 0 !important;
}

.list-block .item-inner {
    min-height: 0 !important;
}



    `;
    document.head.appendChild(style);
}

$(document).ready( () => {
    const target = document.querySelector("#fireworks")
    const observer = new MutationObserver( mutation => {if (mutation[0]?.attributeName == "data-page") reorderCertificates()} )


    const config = {
        attributes: true,
        childlist: true,
        subtree: true
    }


    observer.observe(target, config);

    const observera = new MutationObserver(() => {
        reorderCertificates();
    });

})


