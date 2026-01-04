// ==UserScript==
// @name            Ended Google
// @description     Load fewer results non-automatically and finitely ;) Very rough hack of "Endless Google" by tumpio (https://openuserjs.org/scripts/tumpio/Endless_Google) to BREAK continuous scrolling
// @author          aHorseSplashes
// @include         http://www.google.*
// @include         https://www.google.*
// @include         https://encrypted.google.*
// @run-at          document-start
// @version         0.0.1
// @license         MIT
// @noframes
// @namespace https://greasyfork.org/users/1035525
// @downloadURL https://update.greasyfork.org/scripts/461068/Ended%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/461068/Ended%20Google.meta.js
// ==/UserScript==

/* Instructions/info:
     * The first "more results" page will automatically load as normal. This is so you can read search results near the bottom of the first page.
     * To escape continuous scrolling, QUICKLY scroll down to the bottom of the second page. It should reload to the paginated version.
     * I'm sure a lot of the original "Endless Google" script is no longer necessary, but eh, good enough.
     * Tested on Firefox and Chrome with a US IP address.
     * Probably not going to be maintained or updated. WYSIWYG
*/

if (location.href.indexOf("tbm=isch") !== -1) // NOTE: Don't run on image search
    return;
if (window.top !== window.self) // NOTE: Do not run on iframes
    return;

const centerElement = "#center_col";
const loadWindowSize = 1.6;
const filtersAll = ["#foot", "#bottomads"];
const filtersCol = filtersAll.concat(["#extrares", "#imagebox_bigimages"]);
let msg = "";

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
    if (!nextPage.searchParams.has("q") || (nextPage.searchParams.has("start") && !nextPage.searchParams.has("start=0"))) return;

    nextPage.searchParams.set("start", 10);
    if(pageNumber > 1) window.location.assign(nextPage);
    !msg.classList.contains("shown") && msg.classList.add("shown");
    fetch(nextPage.href)
        .then(response => response.text())
        .then(text => {
            let parser = new DOMParser();
            let htmlDocument = parser.parseFromString(text, "text/html");
            let docElement = htmlDocument.documentElement;
            let content = docElement.querySelector(centerElement);

            content.id = "col_" + 0;
            filter(content, filtersCol);

            content.style.marginLeft = '0';

            let pageMarker = document.createElement("div");
            pageMarker.textContent = String(pageNumber);
            pageMarker.className = "page-number";

            let col = document.createElement("div");
            col.className = "next-col";
            col.appendChild(pageMarker);

            // Set images source address
            try {
                let thumbnails = text.match(/google\.ldi=({.+?})/);
                let thumbnailsObj = JSON.parse(thumbnails && thumbnails[1]);
                for (let id in thumbnailsObj) {
                    docElement.querySelector("#"+id).src = unescapeHex(thumbnailsObj[id]);
                }
            } catch(e) {}

            function setImagesSrc({id}) {
                let pattern = new RegExp("var\\ss='(\\S+)';var\\sii=\\[[a-z0-9_',]*?'"+id+"'[a-z0-9_',]*?\\];");
                let imageSource = text.match(pattern);
                if (imageSource != null && imageSource[1]) {
                    docElement.querySelector("#"+id).src = unescapeHex(imageSource[1]);
                }
            }
            docElement.querySelectorAll('g-img > img[id]').forEach(setImagesSrc);
            docElement.querySelectorAll('div > img[id^=dimg_]').forEach(setImagesSrc);

            docElement.querySelectorAll('img[data-src]').forEach((img) => {
                img.src = img.dataset.src;
                img.style.visibility = 'visible';
            });

            col.appendChild(content);
            document.querySelector(centerElement).appendChild(col);

            if (!content.querySelector("#rso")) {
                // end of results
                window.removeEventListener("scroll", onScrollDocumentEnd);
                nextPageLoading = false;
                msg.classList.contains("shown") && msg.classList.remove("shown");
                return;
            }

            if (pageNumber = 1) pageNumber++;
            nextPageLoading = false;
            msg.classList.contains("shown") && msg.classList.remove("shown");
        });
}

function unescapeHex(hex) {
    if (typeof hex != "string") { return ""; }
    return hex.replace(/\\x([0-9a-f]{2})/ig, function(_, chunk) {
        return String.fromCharCode(parseInt(chunk, 16));
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