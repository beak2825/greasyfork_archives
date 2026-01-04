// ==UserScript==
// @name         Hacker News Filter
// @namespace    https://news.ycombinator.com/
// @version      1.0
// @license      GPLv3
// @description  Filter HN posts based on words in the title
// @author       xdpirate
// @match        https://news.ycombinator.com/
// @match        https://news.ycombinator.com/?p*
// @include      /^https:\/\/news\.ycombinator\.com\/(news|newest|front|best|ask|show).*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/462650/Hacker%20News%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/462650/Hacker%20News%20Filter.meta.js
// ==/UserScript==

GM_addStyle(`
    #HNFToggleButton {
        cursor: pointer;
    }

    #HNFBlacklistArea {
        background-color: black;
        color: white;
        font-family: monospace;
    }

    #HNFOuterDiv {
        float: left;
        background-color: black;
        color: white;
        padding: 5px;
        border: 1px solid white;
        border-radius: 10px;
        z-index: 2147483647;
        position: absolute;
        top: 50px;
        left: 100px;
    }

    #HNFCloseButton {
        cursor: pointer;
    }

    .hidden {
        display: none;
    }
`);

let blacklist = GM_getValue("blacklist", []);

let empty = false;
if(blacklist.length == 0 || (blacklist.length == 1 && blacklist[0] == "") || blacklist == undefined || blacklist == null) {
    empty = true;
}

let regexStr = "\\b(";
if(!empty) {
    for(let j = 0; j < blacklist.length; j++) {
        // Don't start with a pipe
        if(j > 0) {
            regexStr = regexStr + "|";
        }
        regexStr = regexStr + blacklist[j];
    }
}
regexStr = regexStr + ")\\b";

let regex = new RegExp(regexStr, "i");

let newBox = document.createElement("div");
newBox.innerHTML = `
    <div id="HNFOuterDiv" class="hidden">
        <div id="HNFInnerDiv">
            <span id="HNFCloseButton" title="Close">❌</span> <b>Hacker News Filter</b><br />
            Comma-separated list of blacklisted phrases:<br />
            <textarea id="HNFBlacklistArea" rows="10" cols="80">${blacklist}</textarea><br />
            <input type="button" value="Save and reload" id="HNFSaveButton"></input>
        <div>
    </div>
`;

document.body.append(newBox);

document.getElementById("HNFCloseButton").onclick = function() {
    document.getElementById("HNFOuterDiv").classList.toggle("hidden");
};

document.getElementById("HNFSaveButton").onclick = function() {
    GM_setValue("blacklist", document.getElementById("HNFBlacklistArea").value.split(","));
    location.reload();
};

let c = 0;
if(!empty) {
    let things = document.querySelectorAll("tr.athing");
    for(let i = 0; i < things.length; i++) {
        if(regex.test(things[i].querySelector("span.titleline > a").innerHTML)) {
            things[i].nextElementSibling.remove(); // Remove comments line
            things[i].nextElementSibling.remove(); // Remove spacer
            things[i].remove();                    // Remove the thing itself
            c++;
        }
    }
    console.log(`HNF hid ${c} posts on this page (${Math.round((c / things.length) * 100)}%)`);
}

let pageTop = document.querySelector("span.pagetop");
let filterLink = document.createElement("a");
filterLink.innerHTML = `filter (${c})`;
filterLink.href = "#";
filterLink.onclick = function() {
    document.getElementById("HNFOuterDiv").classList.toggle("hidden");
};
pageTop.appendChild(document.createTextNode(" | "));
pageTop.appendChild(filterLink);
