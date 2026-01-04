// ==UserScript==
// @name         Fallen London - Display Storylet Prerequisites
// @namespace    http://curwencorey.cc/
// @author       Curwen Corey
// @description  Displays Fallen London storylet prerequisites as a plain text
// @supportURL   https://github.com/aclef/fallen-london-scripts/issues
// @version      4.0.0
// @match      https://*.fallenlondon.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438745/Fallen%20London%20-%20Display%20Storylet%20Prerequisites.user.js
// @updateURL https://update.greasyfork.org/scripts/438745/Fallen%20London%20-%20Display%20Storylet%20Prerequisites.meta.js
// ==/UserScript==

/*
Loosely based on logic from the original scripts by kaanyia and arundor (2016 version)
This version was written from scratch to work with the Fallen London redesigned page.
Also using parts of data interception logic from FL 1-Click Wiki extension by alanhuang122
*/


// Display style settings
const reqFontSize = '80%';
const reqVerticalPadding = '10px';
// color for locked branches
const reqLockedColor = '#6a5e5e';
// do not show already met requirements
const showOnlyLocked = false;
// remove formatting from the requirements text (may look tidier, but messes up lists)
const usePlainText = false;


const REQUEST_DONE = 4;

const tooltipToQuality = new Map();


// Set up a mutation observer to update pre-requisites on page content changes
let observer = new MutationObserver(function (mutations) {
    updateAll();
})

// also, re-render after changing active tab (required to support Plans rendering)
let navLinks = document.querySelectorAll('li.nav__item');
if (navLinks.length) {
    for (let t = 0; t < navLinks.length; t++) {
        navLinks[t].addEventListener("click", updateAll, false);
    }
}

function updateAll() {
    let storylets = document.evaluate(
        // search only for storylets having prerequisites
        "//div[contains(@class, 'quality-requirement')]//" +
        "ancestor::div[(contains(@class, 'storylet') and @data-branch-id) or contains(@class, 'media--branch')" +
        "or contains(@class, 'branch plans_separator')]",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE // to make sure we won't fail iteration while updating page DOM
    );
    for (let i = 0; i < storylets.snapshotLength; i++) {
        let storylet = storylets.snapshotItem(i);
        if (!storylet) continue;
        // do not re-add description if already present
        if (storylet.getElementsByClassName('plain_text_reqs').length) continue;
        const qualities = getStoryletQualities(storylet);
        renderTextRequirements(storylet, qualities);
    }
}


function getStoryletQualities(storylet) {
    let qualities = [];
    let qualityIcons = storylet.querySelectorAll("div[class*='quality-requirement'] div[role='button'] img");
    for (const qualityIcon of qualityIcons) {
        const associatedQuality = tooltipToQuality.get(qualityIcon.alt);
        if (associatedQuality != null) {
            qualities.push(associatedQuality);
        }
    }
    return qualities;
}


function renderTextRequirements(storylet, qualities) {
    let storyletBody = storylet.querySelector('div.storylet__body>div, div.branch__body>div, div.media__body>h4');
    // should not happen generally, but just in case...
    if (!storyletBody) return;


    let infoDiv = document.createElement('div');
    infoDiv.setAttribute('class', 'plain_text_reqs');

    let hasTooltips = false;
    if (qualities.length) {
        for (const quality of qualities) {
            let isLocked = quality.status !== "Unlocked";
            if (showOnlyLocked && !isLocked) continue;
            let preReqTextEl = document.createElement('p');
            let text;
            if (!usePlainText) {
                text = quality.tooltip;
            } else {
                text = quality.tooltip.replace(/(<([^>]+)>)/gi, "");
            }
            if (!text) continue;
            preReqTextEl.innerHTML = text;
            preReqTextEl.setAttribute('class', 'plain_text_requirement');
            if (isLocked) {
                preReqTextEl.style.cssText = `color: ${reqLockedColor};`;
            }
            infoDiv.appendChild(preReqTextEl);
            hasTooltips = true;
        }
        if (hasTooltips) infoDiv.style.cssText = `font-size: ${reqFontSize}; padding: ${reqVerticalPadding} 0;`;
    }

    // append info div even if there are no prerequisites to avoid re-running processing for this node
    if (storyletBody.tagName.toLowerCase() !== 'h4') {
        storyletBody.appendChild(infoDiv);
    } else {
        storyletBody.parentNode.insertBefore(infoDiv, storyletBody.nextSibling);
    }
}


function parseResponse(response) {
    if (this.readyState !== REQUEST_DONE) return
    if (response.currentTarget.responseURL.includes("/api/plan")) {
        let data = JSON.parse(response.target.responseText);

        if (!data.isSuccess) {
            return;
        }

        for (const plans of [data.active, data.complete]) {
            for (const plan of plans) {
                for (const qualityRequirement of plan.branch.qualityRequirements) {
                    const plainTextTooltip = qualityRequirement.tooltip.replace(/(<([^>]+)>)/gi, "");
                    tooltipToQuality.set(plainTextTooltip, qualityRequirement);
                }
            }
        }
    }

    if (response.currentTarget.responseURL.includes("/api/storylet")) {
        let data = JSON.parse(response.target.responseText);

        // No point in trying to get storylet ID from a failed request
        if (!data.isSuccess) {
            return;
        }

        //tooltipToQuality.clear();

        let branches;

        if (data.storylets) {
            branches = data.storylets
        } else if (data.storylet) {
            branches = data.storylet.childBranches;
        } else return;

        for (const branch of branches) {
            for (const qualityRequirement of branch.qualityRequirements) {
                const plainTextTooltip = qualityRequirement.tooltip.replace(/(<([^>]+)>)/gi, "");
                tooltipToQuality.set(plainTextTooltip, qualityRequirement);
            }
        }

    }
}

function openBypass(original_function) {
    return function (method, url, async) {
        this.addEventListener("readystatechange", parseResponse);
        return original_function.apply(this, arguments);
    };
}

XMLHttpRequest.prototype.open = openBypass(XMLHttpRequest.prototype.open);
observer.observe(document, {childList: true, subtree: true});
