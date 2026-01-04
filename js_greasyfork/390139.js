// ==UserScript==
// @name          Panda Infinite Scroll
// @description	  Infinite scrolling for galleries in e-hentai and exhentai
// @icon          https://e-hentai.org/favicon.ico
// @namespace     https://gist.github.com/ytjchan
// @author        ytjchan
// @version       1.1.1
// @include       *://e-hentai.org/*
// @include       *://exhentai.org/*
// @exclude       *://e-hentai.org/g/*
// @exclude       *://e-hentai.org/s/*
// @exclude       *://exhentai.org/g/*
// @exclude       *://exhentai.org/s/*
// @downloadURL https://update.greasyfork.org/scripts/390139/Panda%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/390139/Panda%20Infinite%20Scroll.meta.js
// ==/UserScript==

// Current page (0-indexed)
let url = new URL(window.location);
if (url.pathname.includes("tag") && isNaN(url.pathname.split("/").slice(-1)[0]))
    url.href += "/0";
url.setPage = (url.pathname.includes("tag"))? 
    page => url.href = url.href.replace(/\/[^\/]*$/, "/"+page) :
    page => url.searchParams.set("page", page);
let currentPage = (url.pathname.includes("tag"))? 
    (parseInt(url.pathname.split("/").slice(-1)[0]) || 0) :
    (parseInt(url.searchParams.get("page")) || 0);
// Restore current page in case of page back
if (document.getElementsByClassName("page-anchor").length !== 0)
    currentPage = Math.max(...Array.from(document.getElementsByClassName("page-anchor")).map(el => parseInt(el.getAttribute("data-page"))));

// Max, min page
let pageBtns = document.querySelectorAll(".ptt td");
let maxPage = parseInt(pageBtns[pageBtns.length-2].textContent) - 1;
let minPage = parseInt(pageBtns[1].textContent) - 1;

// Detect if bottom of page reached
let observer = new IntersectionObserver(fetchNextPage, { threshold: 1.0 });
observer.observe(document.querySelector(".ptb"));

// Alert area
let flex = document.createElement("div");
flex.classList.add("scroll-alert-area");
document.getElementsByTagName("body")[0].appendChild(flex);
createScrollAlert(currentPage);

// Detect gallery mode
let expected = ["m", "p", "l", "e", "t"];
let mode = document.querySelectorAll("select")[0].value;
mode = expected.includes(mode)? mode: "?";

let inProcess = false;
function fetchNextPage() {
    if (currentPage >= maxPage) {
        observer.disconnect();
        createAlert("Last page reached", 5000, "#0FF");
        return;
    }
    
    if (inProcess) return;
    inProcess = true;

    url.setPage(++currentPage);
    fetch(url.href)
    .then(res => res.text())
    .then(html => {
        let parent = document.querySelector(".gl1t, .itg tr").parentNode;
        let dummy = document.createElement("html");
        dummy.innerHTML = html;
        parent.innerHTML += Array.from(dummy.querySelectorAll(".gl1t, .itg tr")).reduce((prev, el, i) => {
            if (mode == "e" && el.firstChild.classList.contains("tc")) {
                return prev; // skip Extended mode's tags
            }
            if (i === 0) {
                el.classList.add("page-anchor");
                el.setAttribute("data-page", currentPage);
                let span = document.createElement("span");
                span.classList.add("page-anchor-display");
                span.innerHTML = `p. ${currentPage+1}`
                el.appendChild(span);
            }
            return prev += el.outerHTML;
        }, "");
        createScrollAlert(currentPage);
        inProcess = false;
    })
    .catch(e => createAlert(e, 5000, "#F00"));
}

function createAlert(msg, timeout, bgColor = "#EEE") {
    let div = document.createElement("div");
    div.textContent = msg;
    div.setAttribute("data-bg", bgColor);
    div.classList.add("scroll-alert")
    div.style = `background-color: ${bgColor}`;
    flex.appendChild(div);
    setTimeout(()=>div.remove(), timeout);
    return div;
}

function scrollToPage(page) {
    if (page > currentPage) {
        alert("Page not loaded yet");
        return;
    }
    try {
        document.querySelector(".page-anchor[data-page='"+page+"']").scrollIntoView(); 
    } catch (e) { // page anchor does not exist
        document.documentElement.scrollTop = 0;
    }
}

 // display clickable page alert as 1-indexed
function createScrollAlert(page) {
    createAlert((page+1)+" / "+(maxPage+1), 5000, "#0F0")
        .addEventListener("click", scrollToPage.bind(null, page)); // display as 1-indexed
}

// Custom CSS for page anchors
let style = document.createElement('style');
style.innerHTML = `
.scroll-alert-area {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 10;
}

.scroll-alert {
    padding: 0.5em;
    margin-bottom: 0.1em;
    font-size: 1.25em;
    color: #000;
    cursor: pointer;
}

.page-anchor-display {
    position: absolute;
    background-color: #0FF;
    z-index: 10;
    padding: 0.25em;
    color: #000;
    opacity: 0.75;
    transition: 0.2s;
    pointer-events: none;
}

.page-anchor:hover .page-anchor-display {
    opacity: 0;
}
`;
document.getElementsByTagName('head')[0].appendChild(style);