// ==UserScript==
// @name         Startpage Domain Filter
// @namespace    https://news.ycombinator.com/
// @version      1.1
// @license      GPLv3
// @description  Filter Startpage search results on domain
// @author       xdpirate
// @match        https://www.startpage.com/sp/search*
// @match        https://www.startpage.com/do/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=startpage.com
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/471788/Startpage%20Domain%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/471788/Startpage%20Domain%20Filter.meta.js
// ==/UserScript==

window.setTimeout(function() {
    GM_addStyle(`
        #SPDFToggleButton {
            cursor: pointer;
        }

        #SPDFBlacklistArea {
            background-color: black;
            color: white;
            font-family: monospace;
        }

        #SPDFOuterDiv {
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

        #SPDFCloseButton {
            cursor: pointer;
        }

        .hidden {
            display: none;
        }
    `);

    let blacklist = GM_getValue("blacklist", ["quora.com"]);

    let empty = false;
    if(blacklist.length == 0 || (blacklist.length == 1 && blacklist[0] == "") || blacklist == undefined || blacklist == null) {
        empty = true;
    }

    let regexStr = "^https?:\\/\\/(.+\\.)?(";
    if(!empty) {
        for(let j = 0; j < blacklist.length; j++) {
            // Don't start with a pipe
            if(j > 0) {
                regexStr = regexStr + "|";
            }
            regexStr = regexStr + blacklist[j].replaceAll(".","\\.");
        }
    }
    regexStr = regexStr + ")\\/";

    let regex = new RegExp(regexStr, "i");

    let newBox = document.createElement("div");
    newBox.innerHTML = `
        <div id="SPDFOuterDiv" class="hidden">
            <div id="SPDFInnerDiv">
                <span id="SPDFCloseButton" title="Close">❌</span> <b>Startpage Domain Filter</b><br />
                Comma-separated list of blacklisted domains:<br />
                <textarea id="SPDFBlacklistArea" rows="10" cols="80";">${blacklist}</textarea><br />
                <input type="button" value="Save and reload" id="SPDFSaveButton"></input>
            <div>
        </div>
    `;

    document.body.append(newBox);

    document.getElementById("SPDFCloseButton").onclick = function() {
        document.getElementById("SPDFOuterDiv").classList.toggle("hidden");
    };

    document.getElementById("SPDFBlacklistArea").onkeydown = function(e) {
        if (e.key === "Escape") {
            document.getElementById("SPDFOuterDiv").classList.add("hidden");
        }
    };

    document.getElementById("SPDFSaveButton").onclick = function() {
        GM_setValue("blacklist", document.getElementById("SPDFBlacklistArea").value.split(","));
        location.reload();
    };

    let c = 0;
    if(!empty) {
        let results = document.querySelectorAll("div.result");
        if(results.length == 0) {
            results = document.querySelectorAll("div.w-gl__result");
        }

        for(let i = 0; i < results.length; i++) {
            let resultURL = results[i].querySelector("div.upper > a > span.link-text");
            if(!resultURL) {
                resultURL = results[i].querySelector("a.result-link").href;
            } else {
                resultURL = resultURL.innerText;
            }
            resultURL = resultURL.trim();

            if(regex.test(resultURL)) {
                results[i].style.display = "none";
                c++;
            }
        }
        console.log(`SPDF hid ${c} posts on this page (${Math.round((c / results.length) * 100)}%)`);
    }

    let pageTop = document.querySelector("div#filters-container > div.filters");
    if(!pageTop) {
        pageTop = document.querySelector("div.search-filters-toolbar__filters-container");
    }
    let filterLink = document.createElement("div");

    filterLink.innerHTML = `<div style="cursor: pointer; border-radius: 10px; vertical-align: center; padding: 10px; background: #000; color: #fff; border: 2px solid #fff;">Filter (${c})</div>`;
    filterLink.onclick = function() {
        document.getElementById("SPDFOuterDiv").classList.toggle("hidden");
    };
    pageTop.appendChild(filterLink);
}, 2000);