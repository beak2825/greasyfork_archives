// ==UserScript==
// @name         9ox.ru
// @version      0.2
// @description  Бесконечная подгрузка страниц для сайта https://9ox.ru/
// @author       Maksimius
// @match        https://9ox.ru/
// @match        https://9ox.ru/page/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=9ox.ru
// @run-at       document-start
// @noframes
// @license MIT
// @namespace https://greasyfork.org/users/915737
// @downloadURL https://update.greasyfork.org/scripts/445963/9oxru.user.js
// @updateURL https://update.greasyfork.org/scripts/445963/9oxru.meta.js
// ==/UserScript==

const centerElement = "#main";
const loadWindowSize = 1.6;
const filtersCol = [".pagination",];
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

let prevScrollY = 0;
let nextPageLoading = false;

function requestNextPage() {
    nextPageLoading = true;
    let nextPage = document.querySelector("a.next")
    if (!nextPage) return;

    let pageNumber = nextPage.href.split('/page/')[1].replace('/', '')
    !msg.classList.contains("shown") && msg.classList.add("shown");
    fetch(nextPage.href)
        .then(response => response.text())
        .then(text => {
            let parser = new DOMParser();
            let htmlDocument = parser.parseFromString(text, "text/html");
            let content = htmlDocument.documentElement.querySelector(centerElement);

            content.id = "col_" + pageNumber;
            filter(document, filtersCol);

            let pageMarker = document.createElement("div");
            pageMarker.textContent = String(pageNumber)
            pageMarker.className = "page-number";

            let col = document.createElement("div");
            col.className = "next-col";
            col.appendChild(pageMarker);
            col.appendChild(content);
            document.querySelector(centerElement).appendChild(col);

            if (!content.querySelector(".intimate_front_loop_block")) {
                // end of results
                window.removeEventListener("scroll", onScrollDocumentEnd);
                nextPageLoading = false;
                msg.classList.contains("shown") && msg.classList.remove("shown");
                return;
            }

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
    let style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    msg = document.createElement("div");
    msg.setAttribute("class", "endless-msg");
    msg.innerText = "Загружаем следующую страницу...";
    document.body.appendChild(msg);
}

document.addEventListener("DOMContentLoaded", init);
