// ==UserScript==
// @name         TBD: Pagination Reborn for TorrentBD
// @namespace    https://naeembolchhi.github.io/
// @version      0.6
// @description  Lets you swiftly jump to any page you want without limitation.
// @author       NaeemBolchhi
// @license      GPL-3.0-or-later
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMC1jMDAwIDc5LjE3MWMyN2ZhYiwgMjAyMi8wOC8xNi0yMjozNTo0MSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhFNDkwRkQzRjcxNzExRUQ5NUQ1RjRBNTUzMTkwOTJBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhFNDkwRkQ0RjcxNzExRUQ5NUQ1RjRBNTUzMTkwOTJBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OEU0OTBGRDFGNzE3MTFFRDk1RDVGNEE1NTMxOTA5MkEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OEU0OTBGRDJGNzE3MTFFRDk1RDVGNEE1NTMxOTA5MkEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6HAYu3AAAvJklEQVR42uzd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
// @match        https://*.torrentbd.com/*
// @match        https://*.torrentbd.net/*
// @match        https://*.torrentbd.org/*
// @match        https://*.torrentbd.me/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466716/TBD%3A%20Pagination%20Reborn%20for%20TorrentBD.user.js
// @updateURL https://update.greasyfork.org/scripts/466716/TBD%3A%20Pagination%20Reborn%20for%20TorrentBD.meta.js
// ==/UserScript==

// Create a new element
function elemake(tag, innr, attr) {
    let element = document.createElement(tag);
    if (innr && innr !== "") {element.innerHTML = innr;}
    if (!attr) {return element;}

    for (let x = 0; x < attr.key.length; x++) {
        element.setAttribute(attr.key[x], attr.val[x]);
    }
    return element;
}

// Scrape variables from the URL
function urlVar(url) {
    let vars = {};
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

// Add global styles
const pagiCSS = `
/* Pagination Parent */
ul.pagination, ul.pagination-new {
  text-align: center;
}

/* Pagination Form */
.pagireborn-form {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px 0 0;
}

/* Pagination Input */
.pagireborn-form input {
  outline: 0;
  padding: 0 10px;
  height: 28px;
  border: 1px solid var(--border-color);
  margin: 3px 2px;
  text-align: center;
}
.pagireborn-form input.pagireborn-num {
  background: transparent;
  width: 80px;
  transition: border .3s;
}
.pagireborn-form input.pagireborn-num:focus {
  border-color: #1aa599;
}
.pagireborn-form input.pagireborn-btn {
  color: var(--body-color);
  background: var(--main-bg);
}

/* Pagination Span */
.pagireborn-span {
  margin: 0 10px 0 0;
  padding: 0 10px;
  line-height: 26px;
  height: 28px;
  border: 1px solid var(--border-color);
  list-style-type: none;
  display: inline-block;
}
.pagireborn-span > i {
  line-height: 26px;
}

/* Cosmetic Changes */
ul.pagination li {
  list-style-type: none;
  display: inline-block;
  margin: 3px 2px;
  font-family: inherit;
  font-size: 14px;
  height: 28px;
  border: 1px solid var(--border-color);
  border-radius: 0;
}
ul.pagination li.active {
  background: var(--nav-bg);
  color: whitesmoke;
  cursor: initial;
  border-radius: 0;
}
ul.pagination li a {
  color: var(--body-color);
  line-height: 26px;
  padding: 0 10px;
  border-radius: 0;
}
ul.pagination li a:hover {
  color: var(--body-color);
}
ul.pagination li.active a {
  color: whitesmoke;
  cursor: initial;
}

/* Reborn for Mobile */
@media screen and (min-width: 601px) {
  .pagireborn-span {
    display: none;
  }
  ul.pagination, ul.pagination-new {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
@media screen and (max-width: 600px) {
  ul.pagination-new i.pagireborn-code,
  ul.pagination-new form.pagireborn-form,
  ul.pagination i.pagireborn-code,
  ul.pagination form.pagireborn-form {
    display: none;
  }
  ul.pagination-new.pagireborn-on i.pagireborn-code-off,
  ul.pagination-new.pagireborn-on li,
  ul.pagination.pagireborn-on i.pagireborn-code-off,
  ul.pagination.pagireborn-on li {
    display: none;
  }
  ul.pagination-new.pagireborn-on i.pagireborn-code,
  ul.pagination-new.pagireborn-on form.pagireborn-form,
  ul.pagination.pagireborn-on i.pagireborn-code,
  ul.pagination.pagireborn-on form.pagireborn-form {
    display: inline-block;
  }
  ul.pagination.pagireborn-on, ul.pagination-new.pagireborn-on {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
`;

// Add styles to head
document.head.appendChild(elemake("style",pagiCSS,{"key":["id","type"],"val":["pagiRestyle","text/css"]}));

// Update material icons css
try {document.querySelector("link[href*='material-icons.css']").href = "https://fonts.googleapis.com/icon?family=Material+Icons";} catch(e) {}

// Add toggler for mobile version
function pagiCode(target) {
    let pagiSpan = elemake("span",'<i class="material-icons pagireborn-code-off">code</i><i class="material-icons pagireborn-code">code_off</i>',{"key":["class"],"val":["pagireborn-span waves-effect"]});
    target.insertBefore(pagiSpan, target.children[0]);
}

// Add form for page jumping
function pagiMake(target) {
    let pagiForm = elemake("form",'<input type="page" class="pagireborn-num" value="" placeholder="Jump to" autocomplete="off"><input type="button" class="pagireborn-btn" value="Go">',{"key":["class"],"val":["pagireborn-form"]});
    target.insertBefore(pagiForm, target.children[0]);
}

// Clear any existing forms
function pagiClear(parent) {
    let what = document.querySelectorAll(`${parent} .pagireborn-form`);

    for (let x = 0; x < what.length; x++) {
        what[x].remove();
    }
}

// When someone clicks go or presses enter on the input box
function pagiGo(go) {
    let where = go.parentNode.getElementsByClassName("pagireborn-num")[0],
        paginator;
    if (isNaN(parseInt(where.value))) {return;}

    try {
        paginator = go.parentNode.parentNode.querySelector("li[data-paginate-to]");
        paginator.setAttribute("data-paginate-to", where.value);
    } catch(e) {
        paginator = go.parentNode.parentNode.querySelector("li a[href]");
        paginator.href = paginator.href.replace(`page=${urlVar(paginator.href).page}`, `page=${where.value}`);
    }

    paginator.click();
}

// Toggle class on pagination parent
function pagiSwitch(parent) {
    if (parent.classList.contains("pagireborn-on")) {
        parent.classList.remove("pagireborn-on");
    } else {
        parent.classList.add("pagireborn-on");
    }
}

// Add the new form to all pagination instances
function pagiType(key) {
    let pagiParent = document.querySelectorAll(`${key} ul[class*='pagination']`);

    try {pagiClear(`${key} ul[class*='pagination']`);} catch(e) {}

    try {pagiMake(pagiParent[0]);} catch(e) {}
    try {pagiMake(pagiParent[1]);} catch(e) {}
    try {pagiCode(pagiParent[0]);} catch(e) {}
    try {pagiCode(pagiParent[1]);} catch(e) {}
}

// IF Ready State is Complete
function readyComplete() {
    if (document.readyState !== "complete") {return;}

    // Try if parent object is found
    if (document.querySelector("#torrents-main")) {
        try {pagiType("#torrents-main");} catch(e) {}
    }
    if (document.querySelector(".pagination-block")) {
        try {pagiType(".pagination-block");} catch(e) {}
    }
}
readyComplete();

// IF Ready State has changed
document.onreadystatechange = function () {
    readyComplete();
}

// Mutation Observers
function initObserver(key) {
    let pagiObserver = new MutationObserver(function() {
        if (document.querySelector(`${key} .pagireborn-form`)) {
            return;
        }
        try {pagiType(key);} catch(e) {}
    });
    pagiObserver.observe(document.querySelector(key), {childList: true});
}

// Start Observers if parent object is found
if (document.querySelector("#torrents-main")) {
    initObserver("#torrents-main");
}
if (document.querySelector("#kuddus-results-container")) {
    initObserver("#kuddus-results-container");
}
if (document.querySelector("#forums")) {
    initObserver("#forums");
}
if (document.querySelector("#torrents")) {
    initObserver("#torrents");
}

// Event Listeners
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("pagireborn-btn")) {
        pagiGo(event.target);
    }
    if (event.target.classList.contains("pagireborn-span")) {
        pagiSwitch(event.target.parentNode);
    }
    if (event.target.className.match(/pagireborn\-code/)) {
        pagiSwitch(event.target.parentNode.parentNode);
    }
});
document.addEventListener("submit", function(event) {
    if (!event.target.classList.contains("pagireborn-form")) {return;}
    event.preventDefault();
    pagiGo(event.target.getElementsByClassName("pagireborn-btn")[0]);
});