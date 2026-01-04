// ==UserScript==
// @name         FA Blacklist
// @namespace    https://greasyfork.org/en/scripts/453103-fa-blacklist
// @version      1.2.2
// @description  Adds a blacklist to Fur Affinity. Also adds the ability to replace typed terms with other terms. If installed correctly you should see a link titled "Edit Blacklist" below the search box on FA's search page.
// @author       Nin
// @license      GNU GPLv3
// @match        https://www.furaffinity.net/*
// @icon         https://www.google.com/s2/favicons?domain=furaffinity.net
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/453103/FA%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/453103/FA%20Blacklist.meta.js
// ==/UserScript==

// How many tabs to add between the blacklist and search
var tabBuffer = "\t".repeat(30);

// Save a script setting
function saveUserData(key, value) {
    'use strict';
    GM_setValue(key, JSON.stringify(value));
}

// Load a script setting
async function loadUserData(key, defaultValue) {
    'use strict';
    let data = await GM_getValue(key);

    if (data === undefined) {
        return defaultValue;
    }

    return JSON.parse(data);
}

// Add extra search settings for using this script to FA's Search Settings section
function generateSearchSettings(blacklist, replace, block) {
    'use strict';
    if (!window.location.pathname.startsWith("/controls/site-settings/")){
        return;
    }

    let replaceList = [];
    for (const property in replace) {
        replaceList.push(property + "=" + replace[property]);
    }

    let blockList = [];
    for (const property in block) {
        if (block[property] === "") {
            blockList.push(property);
        } else {
            blockList.push(property + "=" + block[property]);
        }
    }

    const blockString = blockList.join(", ");
    prependSearchSetting(
        "Block Offensive Text",
        "A comma separated list of words you would like to automatically delete in all text that appears on FA. In the format:" +
        "<br><i><span style='color:darkgray'>these, words, are, offensive</span></i><br>" +
        "This is for words you might find offensive or dislike, but which you don't want to actually block as tags. <br/><br/>" +
        "Advanced usage:" +
        "<br><i><span style='color:darkgray'>delete, these, words, transexual=transgender, herm=dualsex</span></i><br>" +
        "You can provide a replacement word using an equals sign. This helps maintain the flow of text in stories.",
        blockString, "block", "Comma separated list...");

    const replaceString = replaceList.join(", ");
    prependSearchSetting(
        "Find and Replace",
        "A comma separated list of search terms to replace. In the format: <br><i><span style='color:darkgray'>term1=replacement1, term2=replacement2, tf=transformation</span></i><br> Replacements can contain advanced FA queries: <br><i><span style='color:darkgray'>noodles=(dragons|snakes), ramen=(snakes&soup)</span></i>",
        replaceString, "replace", "Comma separated list...");

    const blacklistString = blacklist.join(", ");
    prependSearchSetting(
        "Blacklist",
        "A comma separated list of words to blacklist. In the format: <br><i><span style='color:darkgray'>these, are, search, terms, I, dislike</span></i>",
        blacklistString, "blacklist", "Comma separated list...");

    const saveButton = document.getElementsByName("save_settings")[0];

    saveButton.addEventListener("click", function(){
        let blacklist = document.getElementById("blacklist").value.replaceAll(/\s/g, "").split(",");
        let replaceList = document.getElementById("replace").value.replaceAll(/\s/g, "").split(",");
        let blockList = document.getElementById("block").value.replaceAll(/\s/g, "").split(",");

        blacklist = blacklist.filter((word) => word.length > 0);

        let replace = {};
        for (const replaceText of replaceList) {
            const split = replaceText.split("=");
            if (split[0].length > 0) {
                replace[split[0]] = split[1];
            }
        }

        let block = {};
        for (const blockText of blockList) {
            const split = (blockText + "=").split("=");
            if (split[0].length > 0) {
                block[split[0]] = split[1];
            }
        }

        saveUserData("blacklist", blacklist);
        saveUserData("replace", replace);
        saveUserData("block", block);
    });
}

// Add a search setting option to the start of the list of search settings on the Global Site Settings page
function prependSearchSetting(title, description, data, id, placeholder) {
    'use strict';
    let html = `
    <div class="control-panel-item-container">
        <div class="control-panel-item-name">
            <h4>${title}</h4>
        </div>
        <div class="control-panel-item-description">${description}</div>
        <div class="control-panel-item-options">
            <div class="select-dropdown">
                <input type="text" id="${id}" value="${data}" placeholder="${placeholder}" class="textbox" autocomplete="off" style="width: 100%;">
            </div>
        </div>
    </div>`;
    const element = document.getElementsByClassName("section-body")[2];
    element.innerHTML = html + element.innerHTML;
}

// Add a link to edit the blacklist to search pages
function addSearchSettingsLink(){
    'use strict';
    if (!window.location.pathname.startsWith("/search/")){
        return;
    }

    const searchDiv = document.getElementsByClassName("c-searchQueryInput")[0];
    searchDiv.insertAdjacentHTML(
      "afterend",
      "<a href='https://www.furaffinity.net/controls/site-settings/#blacklist' style='color:darkgray;float:right'>Edit Blacklist</a>"
    );

    const ratingSection = document.getElementsByClassName("gridContainer")[2];
    ratingSection.insertAdjacentHTML(
      "beforeend",
      '<div class="gridContainer__item"><label><input type="checkbox" id="disable-blacklist"> Blacklisted </label><br></div>'
    );
}

// Remove the added query text from the query inputs on page load
function cleanInput() {
    'use strict';
    document.getElementsByName("q").forEach(function(input){
        if (input.value !== "") {
            console.log('Actual Search:\n' + input.value.replaceAll("\t", ""));
        }
        if (input.value.includes("\t")) {
            input.value = input.value.substring(0, input.value.indexOf("\t"));
        }
        // Remove any sent zero width spaces
        input.value = input.value.replaceAll("\u200B", "");
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
}

// Remove the blacklist text from FA's list of tags you searched
function cleanQueryStats(blacklist) {
    'use strict';
    if (document.getElementById("query-stats") !== null) {
        var queryStats = document.getElementById("query-stats").children;

        while (queryStats.length > 0 && blacklist.includes(queryStats[queryStats.length - 1].children[0].children[0].innerHTML)) {
            queryStats[queryStats.length - 1].remove();
        }
    }
}

// Replace keywords in the query string according to the specified replacements
function replaceKeywords(replace) {
    'use strict';
    document.getElementsByName("q").forEach(function(input){
        let append = "";

        for (const property in replace) {
            const pos_regex = new RegExp('(?<![-\u200B])\\b' + property + '\\b(?!\u200B)', "gi");
            const neg_regex = new RegExp('(?<!\u200B)-\\b' + property + '\\b(?!\u200B)', "gi");

            let pos_found = input.value.match(pos_regex);
            if (pos_found !== null) {
                for (const result of pos_found) {
                    append += " " + replace[property];
                }
            }

            let neg_found = input.value.match(neg_regex);
            if (neg_found !== null) {
                for (const result of neg_found) {
                    append += " -(" + replace[property] + ")";
                }
            }

            // Insert a zero width space between each replaced character so FA ignores it
            input.value = input.value.replaceAll(pos_regex, [...property].join("\u200B"));
            input.value = input.value.replaceAll(neg_regex, ["-", ...property].join("\u200B"));
        }

        input.value += append;
    });
}

// Adds the blacklist text to the end of all query forms
function addBlacklist(blacklist) {
    'use strict';
    if (document.getElementById("disable-blacklist") === null || !document.getElementById("disable-blacklist").checked) {
        document.getElementsByName("q").forEach(function(input){
            if (blacklist.length > 0 && input.value.match(/ -bl\b/) === null){
                input.value += " -" + blacklist.join(" -");
                if (input.value.endsWith("-")) {
                    input.value = input.value.substring(0, input.value.length - 1);
                }
            }
        });
    }
}

// Adds a buffer of tabs to hide the added query text
function addBuffer() {
    'use strict';
    document.getElementsByName("q").forEach(function(input){
        input.value += tabBuffer;
    });
}

// Adds an onsubmit trigger for the element with the given ID to add the blacklist
function attachHandlers(elementID, blacklist, replace) {
    'use strict';
    var element = document.getElementById(elementID);

    if (element !== null) {
        element.submit = element.requestSubmit;
        element.addEventListener("submit", function(){
            // alert("hi");
            addBuffer();
            replaceKeywords(replace);
            addBlacklist(blacklist);
        }, {'capture': true, 'passive': true});
    }
}

// Return some URI text that can be appended to a URI to add the blacklist
function blacklistURI(blacklist) {
    'use strict';
    let result = tabBuffer + "-" + blacklist.join(" -");
    if (result.endsWith("-")) {
        result = result.substring(0, result.length - 1);
    }
    return encodeURIComponent(result);
}

// If we somehow end up searching without the blacklist, redirect to add the blacklist
function redirect(blacklist) {
    'use strict';
    if ((!window.location.pathname.startsWith("/search/"))
       || (window.location.pathname === "/search/" && window.location.search === "")
       || window.location.pathname.includes("09%")
       || window.location.search.includes("09%")){
        return;
    }
    console.log("Redirecting to add blacklist...");
    window.location.href = window.location.href + blacklistURI(blacklist);
}

// Update the links on the tags of images to add the blacklist
function updateTags(blacklist) {
    'use strict';
    if (!window.location.pathname.startsWith("/view/")){
        return;
    }
    [...document.getElementsByClassName("tags")].forEach(function(tag){
        tag.firstChild.href += blacklistURI(blacklist);
    });
}

// Recursively replace text in the given element and all sub-elements
function replaceText(element, pattern, replacement) {
    'use strict';
    for (let node of element.childNodes) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
            case Node.DOCUMENT_NODE:
                replaceText(node, pattern, replacement);
            break;

            case Node.TEXT_NODE:
                node.textContent = node.textContent.replaceAll(pattern, replacement);
            break;
        }
    }
}

// Delete tags with the given name from the tags list
function deleteTag(tagName) {
    'use strict';
    document.querySelectorAll(".tags a").forEach((element) => {
        if (element.textContent.toLowerCase() === tagName.toLowerCase()) {
            element.parentNode.remove()
        }
    });
}

// Delete all tags with the given name and replace text with the given replacement
function blockText(replacements) {
    'use strict';
    if (window.location.pathname.startsWith("/controls/site-settings/")){
        return;
    }

    for (const text in replacements) {
        deleteTag(text);
        replaceText(document, new RegExp("\\b" + text.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&') + "\\b", "gi"), replacements[text]);
    }
}


async function main() {
    'use strict';
    const blacklist = loadUserData("blacklist", []);
    const replace = loadUserData("replace", {});
    const block = loadUserData("block", {});
    addSearchSettingsLink();
    cleanInput();
    cleanQueryStats(await blacklist);
    attachHandlers("search-form", await blacklist, await replace);
    attachHandlers("searchbox", await blacklist, await replace);
    generateSearchSettings(await blacklist, await replace, await block);
    redirect(await blacklist);
    updateTags(await blacklist);
    blockText(await block);
}


if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
} else {
    main();
}
