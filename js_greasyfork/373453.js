// ==UserScript==
// @name         Better Reddit Awards
// @version      0.3
// @description  Tries to condense the three new awards into a single award
// @author       HenryB96
// @match        http*://*.reddit.com/*
// @namespace    https://greasyfork.org/users/220501
// @downloadURL https://update.greasyfork.org/scripts/373453/Better%20Reddit%20Awards.user.js
// @updateURL https://update.greasyfork.org/scripts/373453/Better%20Reddit%20Awards.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

// Settings
const SILVER_VALUE = 100; // Number of coins to buy silver award
const GOLD_VALUE = 500; // Number of coins to buy gold award
const PLATINUM_VALUE = 1800; // Number of coins to buy platinum award

const TOTAL_VALUE_BASELINE = PLATINUM_VALUE; // What the award's value is based off
const DECIMAL_PLACES = 1; // Number of decimal places to display for the new award value

const GOLD_ICON = "https://i.imgur.com/eJQtyhY.png"; // Icon to use for the new award

window.addEventListener('neverEndingLoad', function(e)
{
    condense();
});

window.onload = function(e)
{
    condense();
};

function condense()
{
    let gildingBars = document.getElementsByClassName("gilding-bar");

    for(let index in gildingBars)
    {
        var gildingBar = gildingBars[index];

        if (gildingBar.modifiedAward !== undefined)
        {
            continue;
        }

        let childNodes = gildingBar.childNodes;

        if (childNodes === undefined)
        {
            continue;
        }
    
        let numSilver = 0;
        let numGold = 0;
        let numPlatinum = 0;
    
        for (let i = 0; i < childNodes.length; i++)
        {
            let gild = childNodes[i].childNodes[0];
    
            if (gild.className === "gilded-gid1-icon")
            {
                numSilver = parseInt(gild.dataset.count);
            }
            else if (gild.className === "gilded-gid2-icon")
            {
                numGold = parseInt(gild.dataset.count);
            }
            else if (gild.className === "gilded-gid3-icon")
            {
                numPlatinum = parseInt(gild.dataset.count);
            }
        }
    
        let totalValue = (numSilver * SILVER_VALUE) + (numGold * GOLD_VALUE) + (numPlatinum * PLATINUM_VALUE);
    
        removeChildNodes(gildingBar);
    
        insertNewGild(gildingBar, totalValue);

        gildingBar.modifiedAward = true;
    }
}

function removeChildNodes(node)
{
    while (node.firstChild)
    {
        node.removeChild(node.firstChild);
    }
}

function insertNewGild(node, totalValue)
{
    let newGoldValue = (totalValue / TOTAL_VALUE_BASELINE).toFixed(DECIMAL_PLACES);

    if (newGoldValue < SILVER_VALUE / TOTAL_VALUE_BASELINE)
    {
        return;
    }

    let spanElement = getSpanElement(newGoldValue);

    let linkElement = getLinkElement(node, spanElement);

    node.insertBefore(linkElement, node.childNodes[0]);
}

function getLinkElement(gildNode, spanElement)
{
    let linkElement = document.createElement("a");

    linkElement.href = gildNode.dataset.subredditpath + "gilded";

    linkElement.style.marginLeft = "0.5em";

    linkElement.appendChild(spanElement);

    return linkElement;
}

function getSpanElement(newGoldValue)
{
    let spanElement = document.createElement("span");

    spanElement.style.position = "relative";
    spanElement.style.display = "inline-block";
    spanElement.style.color = "#99895F";
    spanElement.style.verticalAlign = "middle";
    spanElement.style.fontSize = "0.9em";

    spanElement.appendChild(getGildImage());

    let valueElement = document.createElement("span");

    valueElement.style.position = "relative";
    valueElement.style.top = "-0.2em";

    valueElement.appendChild(document.createTextNode("x" + newGoldValue));

    spanElement.appendChild(valueElement);

    return spanElement;
}

function getGildImage()
{
    let imageElement = document.createElement("img");

    imageElement.src = GOLD_ICON;

    imageElement.style.maxHeight = "1.1em";
    imageElement.style.marginRight = "0.1em";

    return imageElement;
}