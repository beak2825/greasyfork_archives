// ==UserScript==
// @name         NewsNow Filter
// @namespace    https://www.newsnow.co.uk/
// @version      2.2
// @license      GPLv3
// @description  Filter NewsNow articles by phrase/topic/publisher
// @author       xdpirate
// @match        https://*.newsnow.co.uk/h/*
// @match        https://*.newsnow.com/ro/*
// @match        https://*.newsnow.com/ng/*
// @match        https://*.newsnow.com/ca/*
// @match        https://*.newsnow.com/au/*
// @match        https://*.newsnow.com/us/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=newsnow.co.uk
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/471929/NewsNow%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/471929/NewsNow%20Filter.meta.js
// ==/UserScript==

// Exit if not running in topmost frame
if(window.self !== window.top) {
    throw "NNF: Not in topmost frame, bye";
}

// Make logging lines prettier (✿◠‿◠)
function filterLog(msg) {
    document.getElementById('NNFFilterLog').value += `${msg}\n`;    
}

// Add CSS
GM_addStyle(`
    #NNFToggleButton {
        cursor: pointer;
    }

    .NNFBlacklistArea {
        font-family: monospace;
    }

    #NNFOuterDiv, #NNFFilterLink {
        float: left;
        background-color: #555;
        color: white;
        padding: 5px;
        border: 1px solid white;
        border-radius: 10px;
        z-index: 2147483647;
        position: fixed;
        top: 10px;
        left: 10px;
    }

    #NNFLink {
        color: #fff;
        text-decoration: underline !important;
    }

    #NNFCloseButton {
        cursor: pointer;
    }

    .hidden {
        display: none;
    }

    #NNFFilterLog {
        width: 100%;
        height: 100px;
        font-size: 10px;
    }

    #NNFFilterLink {
        width: fit-content;
        cursor: pointer;
        user-select: none;
    }
`);

// Initialize/load blacklists
let phraseBlacklist = GM_getValue("phraseBlacklist", []);
let categoryBlacklist = GM_getValue("categoryBlacklist", []);
let publicationBlacklist = GM_getValue("publicationBlacklist", []);

if(phraseBlacklist.length == 0 || (phraseBlacklist.length == 1 && phraseBlacklist[0] == "") || phraseBlacklist == undefined || phraseBlacklist == null) {
    phraseBlacklist = [];
}

if(categoryBlacklist.length == 0 || (categoryBlacklist.length == 1 && categoryBlacklist[0] == "") || categoryBlacklist == undefined || categoryBlacklist == null) {
    categoryBlacklist = [];
}

if(publicationBlacklist.length == 0 || (publicationBlacklist.length == 1 && publicationBlacklist[0] == "") || publicationBlacklist == undefined || publicationBlacklist == null) {
    publicationBlacklist = [];
}

// Set up title-matching regex
let regexStr = "[.+]?(";
if(phraseBlacklist.length > 0) {
    for(let j = 0; j < phraseBlacklist.length; j++) {
        // Don't start with a pipe
        if(j > 0) {
            regexStr = regexStr + "|";
        }
        regexStr = regexStr + phraseBlacklist[j].replaceAll(".","\\.");
    }
}
regexStr = regexStr + ")[.+]?";

let titleRegex = new RegExp(regexStr, "i");

// Set up in-page UI
let newBox = document.createElement("div");
newBox.innerHTML = `
        <div id="NNFOuterDiv" class="hidden">
            <div id="NNFInnerDiv">
                <span id="NNFCloseButton" title="Close">❌</span> <b>NewsNow Filter</b><br />
                Blacklisted phrases (semicolon separated):<br />
                <textarea id="NNFBlacklistArea" class="NNFBlacklistArea" rows="3" cols="40" autocomplete="off" placeholder="donald trump;elon musk;influencer">${phraseBlacklist.join(";")}</textarea><br /><br />
                Blacklisted categories (semicolon separated):<br />
                <textarea id="NNFCategoryBlacklistArea" class="NNFBlacklistArea" rows="3" cols="40" autocomplete="off" placeholder="tesla, inc.;apple;ai">${categoryBlacklist.join(";")}</textarea><br /><br />
                Blacklisted publications (semicolon separated):<br />
                <textarea id="NNFPublicationBlacklistArea" class="NNFBlacklistArea" rows="3" cols="40" autocomplete="off" placeholder="kotaku;daily mirror">${publicationBlacklist.join(";")}</textarea><br />
                <small><a class="NNFLink" href="#" onclick="document.getElementById('NNFFilterLogDiv').classList.toggle('hidden');">Filter log</a></small><br />
                <div id="NNFFilterLogDiv" class="hidden">
                    <textarea id="NNFFilterLog" readonly></textarea>
                </div><br />
                <input type="button" value="Save and reload" id="NNFSaveButton"></input>
            <div>
        </div>
    `;

document.body.append(newBox);

// Assign event handlers
document.getElementById("NNFCloseButton").onclick = function() {
    document.getElementById("NNFOuterDiv").classList.toggle("hidden");
};

let textareas = ["NNFBlacklistArea", "NNFCategoryBlacklistArea", "NNFPublicationBlacklistArea", "NNFFilterLog"];
textareas.forEach(textbox => {
    document.getElementById(textbox).onkeydown = function(e) {
        if (e.key === "Escape") {
            document.getElementById("NNFOuterDiv").classList.add("hidden");
        }
    };
});

document.getElementById("NNFSaveButton").onclick = function() {
    phraseBlacklist = document.getElementById("NNFBlacklistArea").value.trim().toLowerCase().split(";");
    categoryBlacklist = document.getElementById("NNFCategoryBlacklistArea").value.trim().toLowerCase().split(";");
    publicationBlacklist = document.getElementById("NNFPublicationBlacklistArea").value.trim().toLowerCase().split(";");

    phraseBlacklist = phraseBlacklist.filter(Boolean);
    categoryBlacklist = categoryBlacklist.filter(Boolean);
    publicationBlacklist = publicationBlacklist.filter(Boolean);

    GM_setValue("phraseBlacklist", phraseBlacklist);
    GM_setValue("categoryBlacklist", categoryBlacklist);
    GM_setValue("publicationBlacklist", publicationBlacklist);

    location.reload();
};

let filterLink = document.createElement("div");
filterLink.id = "NNFFilterLink"
filterLink.innerText = `📰`;
filterLink.onclick = function() {
    document.getElementById("NNFOuterDiv").classList.toggle("hidden");
};

document.body.insertAdjacentElement("afterbegin", filterLink);

// Actual filtering logic
function filterArticles() {
    let results = document.querySelectorAll("div.article");
    for(let i = 0; i < results.length; i++) {
        if(results[i].getAttribute("nnfparsed") === "true") {
            continue;
        } else {
            results[i].setAttribute("nnfparsed", "true");
        }

        let title = results[i].querySelector("span.article-title").innerText;
        let titleShort = title.length > 30 ? title.substring(0, 30) + "…" : title;
        let categories = results[i].querySelectorAll("a.tag");
        let publication = results[i].querySelector("span.article-publisher__name").innerText.toLowerCase().trim();
        let hidden = false;

        // Filter publication
        if(phraseBlacklist.length > 0) {
            if(publicationBlacklist.includes(publication)) {
                hidden = true;
                filterLog(`Publication "${publication}" found in "${titleShort}"`);
            }
        }

        // Filter categories
        if(!hidden && categories.length > 0 && categoryBlacklist.length > 0) {
            for(let j = 0; j < categories.length; j++) {
                let category = categories[j].innerText.toLowerCase().trim();
                if(categoryBlacklist.includes(category)) {
                    hidden = true;
                    filterLog(`Category "${category}" found in "${titleShort}"`);
                    break;
                }
            }
        }

        // Filter phrases
        if(!hidden && phraseBlacklist.length > 0) {
            if(titleRegex.test(title)) {
                hidden = true;
                filterLog(`Title "${title.match(titleRegex)[1].toLowerCase()}" found in "${titleShort}"`);
            }
        }

        if(hidden) {
            results[i].classList.add("hidden");
        }
    }
}

// Setup monitoring of lazy-loaded articles, and start filtering
window.onload = function() {
    new MutationObserver(function(event) { filterArticles(); }).observe(document, {subtree: true, childList: true});
    filterArticles();
}
