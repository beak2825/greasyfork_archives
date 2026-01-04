// ==UserScript==
// @name            Endless Google Scholar
// @namespace       cv.g
// @description     Load more results automatically and endlessly.
// @author          Zz Guo
// @homepageURL     https://github.com/gzz2000/EndlessGoogleScholar
// @supportURL      https://github.com/gzz2000/EndlessGoogleScholar/issues
// @include         http://scholar.google.*
// @include         https://scholar.google.*
// @run-at          document-start
// @version         0.1.0
// @license         Apache
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/532680/Endless%20Google%20Scholar.user.js
// @updateURL https://update.greasyfork.org/scripts/532680/Endless%20Google%20Scholar.meta.js
// ==/UserScript==

if (window.top !== window.self) // NOTE: Do not run on iframes
    return;

const centerElement = "#gs_res_ccl_mid";
const outerElement = "#gs_res_ccl";
const loadWindowSize = 1.6;
const filtersAll = ["gs_n", "gs_nm"];
const filtersCol = filtersAll.concat([]);
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

document.querySelectorAll('h3.gs_rt > a').forEach(link => {
  link.setAttribute('target', '_blank');
});

let pageNumber = 1;
let prevScrollY = 0;
let nextPageLoading = false;

function requestNextPage() {
    nextPageLoading = true;
    let nextPage = new URL(location.href);
    if (!nextPage.searchParams.has("q") && !nextPage.searchParams.has("cites")) return;

    nextPage.searchParams.set("start", String(pageNumber * 10));
    !msg.classList.contains("shown") && msg.classList.add("shown");
    fetch(nextPage.href)
        .then(response => response.text())
        .then(text => {
            let parser = new DOMParser();
            let htmlDocument = parser.parseFromString(text, "text/html");
            let content = htmlDocument.documentElement.querySelector(centerElement);

            if(!content || !content.childNodes.length) {
                // end of results
                window.removeEventListener("scroll", onScrollDocumentEnd);
                nextPageLoading = false;
                msg.classList.contains("shown") && msg.classList.remove("shown");
                return;
            }

            htmlDocument.querySelectorAll('h3.gs_rt > a').forEach(link => {
                link.setAttribute('target', '_blank');
            });

            content.id = "col_" + pageNumber;
            filter(content, filtersCol);

            let pageMarker = document.createElement("div");
            pageMarker.textContent = String(pageNumber + 1);
            pageMarker.className = "page-number";

            let col = document.createElement("div");
            col.className = "next-col";
            col.appendChild(pageMarker);
            col.appendChild(content);
            document.querySelector(outerElement).appendChild(col);

            pageNumber++;
            nextPageLoading = false;
            msg.classList.contains("shown") && msg.classList.remove("shown");
        });
}

function onScrollDocumentEnd() {
    let y = window.scrollY;
    let delta = y - prevScrollY;
    if (!nextPageLoading && delta > 0 && isDocumentEnd(y)) {
        console.log('called requestNextPage');
        requestNextPage();
    }
    prevScrollY = y;
}

function isDocumentEnd(y) {
    return y + window.innerHeight * loadWindowSize >= document.body.scrollHeight;
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
    document.querySelectorAll('h3.gs_rt > a').forEach(link => {
        link.setAttribute('target', '_blank');
    });
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
    console.log('initialized scholar auto acroll');
}

document.addEventListener("DOMContentLoaded", init);