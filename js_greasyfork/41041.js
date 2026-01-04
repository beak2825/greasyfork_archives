// ==UserScript==
// @name            Endless Google [fork]
// @description     Load more results automatically and endlessly.
// @author          tumpio
// @namespace       tumpio@sci.fi
// @homepageURL     https://openuserjs.org/scripts/tumpio/Endless_Google
// @supportURL      https://github.com/tumpio/gmscripts/issues
// @icon            https://github.com/tumpio/gmscripts/raw/master/Endless_Google/large.png
// @include         http://www.google.*
// @include         https://www.google.*
// @include         https://encrypted.google.*
// @run-at          document-start
// @version         0.0.6-joey9
// @license         MIT
// @grant           GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/41041/Endless%20Google%20%5Bfork%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/41041/Endless%20Google%20%5Bfork%5D.meta.js
// ==/UserScript==

// This is joeytwiddle's tiny fork of tumpio's original which:
// 1. Adds a bit of extra CSS, which used to help me focus
// 2. Is available on greasyfork website

if (location.href.indexOf("tbm=isch") !== -1) // NOTE: Don't run on image search
    return;
if (window.top !== window.self) // NOTE: Do not run on iframes
    return;

const centerElement = "#center_col";
const loadWindowSize = 1.6;
const filtersAll = ["#foot", "#bottomads"];
const filtersCol = filtersAll.concat(["#extrares", "#imagebox_bigimages"]);
let   msg = "";

const css = `
.page-number {
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
	margin-bottom: 2em;
	color: #808080;
}
.page-number::before {
  content: "";
  background-color: #ededed;
  height: 1px;
  width: 100%;
  margin: 1em 3em;
}
.endless-msg {
  position:fixed;
  bottom:0;
  left:0;
  padding:5px 10px;
  background: darkred;
  color: white;
  font-size: 11px;
  display: none;
}
.endless-msg.shown {
  display:block;
}
`;

let pageNumber = 1;
let prevScrollY = 0;
let nextPageLoading = false;

function requestNextPage() {
    nextPageLoading = true;
    let nextPage = new URL(location.href);
    if (!nextPage.searchParams.has("q")) return;

    nextPage.searchParams.set("start", String(pageNumber * 10));
    !msg.classList.contains("shown") && msg.classList.add("shown");
    fetch(nextPage.href)
        .then(response => response.text())
        .then(text => {
            let parser = new DOMParser();
            let htmlDocument = parser.parseFromString(text, "text/html");
            let content = htmlDocument.documentElement.querySelector(centerElement);

            content.id = "col_" + pageNumber;
            filter(content, filtersCol);

            content.style.marginLeft = '0';

            let pageMarker = document.createElement("div");
            pageMarker.textContent = String(pageNumber + 1);
            pageMarker.className = "page-number";

            let col = document.createElement("div");
            col.className = "next-col";
            col.appendChild(pageMarker);
            col.appendChild(content);
            document.querySelector(centerElement).appendChild(col);

            if (!content.querySelector("#rso")) {
                // end of results
                window.removeEventListener("scroll", onScrollDocumentEnd);
                nextPageLoading = false;
                msg.classList.contains("shown") && msg.classList.remove("shown");
                return;
            }

            pageNumber++;
            nextPageLoading = false;
            msg.classList.contains("shown") && msg.classList.remove("shown");
        });
}

function onScrollDocumentEnd() {
    let y = window.scrollY;
    let delta = y - prevScrollY;
    if (!nextPageLoading && delta > 0 && isDocumentEnd(y)) {
        requestNextPage();
    }
    prevScrollY = y;
}

function isDocumentEnd(y) {
    return y + window.innerHeight * loadWindowSize >= document.body.clientHeight;
}

function filter(node, filters) {
    for (let filter of filters) {
        let child = node.querySelector(filter);
        if (child) {
            child.parentNode.removeChild(child);
        }
    }
}

function init() {
    prevScrollY = window.scrollY;
    window.addEventListener("scroll", onScrollDocumentEnd);
    filter(document, filtersAll);
    let style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    msg = document.createElement("div");
    msg.setAttribute("class", "endless-msg");
    msg.innerText = "Loading next page...";
    document.body.appendChild(msg);
}

document.addEventListener("DOMContentLoaded", init);

// The related searches are a bit distracting because they mix in with the search results.
// So we give them a light grey background, so they are visually distinguishable.
// Trying to produce something similar to the exp-outline class.
GM_addStyle("#extrares { border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 0px; background: rgba(0, 0, 0, 0.02); margin-bottom: 24px; padding-left: 26px; padding-right: 26px; }");
// Lets also reduce the rather large top and bottom padding on this box
GM_addStyle("#brs { margin-bottom: 20px !important; }");
GM_addStyle("#brs > * { margin-top: 20px !important; }");
