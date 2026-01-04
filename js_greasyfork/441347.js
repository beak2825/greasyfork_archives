// ==UserScript==
// @name         eBay Seller Blacklist
// @namespace    https://www.ebay.co.uk/
// @version      0.5
// @description  Adds a blacklist for sellers on eBay that will emphasize or remove results from blacklisted sellers
// @author       xdpirate
// @license      GPLv3
// @include      /^https:\/\/www\.ebay\.(co\.uk|com|com\.au|de)\/(itm|sch|usr)\/.*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ebay.co.uk
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/441347/eBay%20Seller%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/441347/eBay%20Seller%20Blacklist.meta.js
// ==/UserScript==

GM_addStyle(`
    #eBSBToggleButton {
        cursor: pointer;
    }

    #eBSBBlacklistArea {
        background-color: black;
        color: white;
        font-family: monospace;
    }

    #eBSBOuterDiv {
        float: left;
        background-color: black;
        color: white;
        padding: 5px;
        border: 1px solid white;
        border-radius: 10px;
        z-index: 2147483647;
        display: block;
        position: fixed;
        top: 5px;
        left: 5px;
    }

    .hidden {
        display: none;
    }
`);

let blacklist = GM_getValue("blacklist", []);
let hideBlacklisted = GM_getValue("hideBlacklisted", false);

let newBox = document.createElement("div");
newBox.innerHTML = `
    <div id="eBSBOuterDiv">
        <span id="eBSBToggleButton" title="eBay Seller Blacklist">💀</span>
        <div id="eBSBInnerDiv" class="hidden">
            <b>eBay Seller Blacklist</b><br />
            Comma-separated list of blacklisted sellers:<br />
            <textarea id="eBSBBlacklistArea" rows="10" cols="80">${blacklist}</textarea><br />
            <input type="checkbox" id="eBSBHideBlacklistedCheckBox"${hideBlacklisted ? ' checked' : ''} />
            <label for="eBSBHideBlacklistedCheckBox">Hide listings from blacklisted sellers in search instead of emphasizing them?</label><br />
            <input type="button" value="Save and reload" id="eBSBSaveButton"></input>
        <div>
    </div>
`;

document.body.append(newBox);

document.getElementById("eBSBSaveButton").onclick = function() {
    GM_setValue("blacklist", document.getElementById("eBSBBlacklistArea").value.replace(/\s+/g, '').split(","));
    GM_setValue("hideBlacklisted", document.getElementById("eBSBHideBlacklistedCheckBox").checked);
    location.reload();
};

document.getElementById("eBSBToggleButton").onclick = function() {
    document.getElementById('eBSBInnerDiv').classList.toggle('hidden');
};

function highlightSeller(sellerElement) {
    sellerElement.style.color = "red";
    sellerElement.style.fontWeight = "bold";
    sellerElement.innerHTML = sellerElement.innerHTML + " (Blacklisted!)";
}

if(window.location.href.includes("/itm/")) {
    let sellerElement = document.querySelector("div.x-sellercard-atf__info span.ux-textspans.ux-textspans--BOLD");;

    if(sellerElement) {
        if(blacklist.includes(sellerElement.innerText.trim())) {
            highlightSeller(sellerElement);
        }
    }
} else if(window.location.href.includes("/sch/")) {
    let sellerElements, sellerParentElementName;

    if(window.location.href.includes(".co.uk/") || window.location.href.includes(".com.au/") || window.location.href.includes(".com/")) {
        sellerElements = document.querySelectorAll(".s-item__seller-info > .s-item__seller-info-text");
        sellerParentElementName = "li.s-item";
    } else {
        sellerElements = document.querySelectorAll(".su-card-container__attributes__secondary > .s-card__attribute-row > span.su-styled-text");
        sellerParentElementName = "li.su-card-container--horizontal";
    }

    if(sellerElements) {
        for(let i = 0; i < sellerElements.length; i++) {
            let seller = sellerElements[i].innerHTML.match(/^([^ ]+) .*/)[1];

            if(seller) {
                if(blacklist.includes(seller)) {
                    if(hideBlacklisted) {
                        sellerElements[i].closest(sellerParentElementName).classList.add("hidden");
                    } else {
                        highlightSeller(sellerElements[i]);
                        sellerElements[i].closest(sellerParentElementName).style.border = "2px solid red";
                    }
                }
            }
        }
    }
} else if(window.location.href.includes("/usr/")) {
    let sellerElement = document.querySelector("a.mbg-id");
    
    if(sellerElement) {
        let seller = sellerElement.href.match(/\/usr\/(.+)$/)[1];

        if(seller) {
            if(blacklist.includes(seller)) {
                    highlightSeller(sellerElement);
            }
        }
    }
}
