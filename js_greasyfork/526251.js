// ==UserScript==
// @name        Save contents of unsubmitted Google Classroom question responses
// @namespace   Violentmonkey Scripts
// @match       *://classroom.google.com/*
// @grant GM_getValue
// @grant GM_setValue
// @version     1.3
// @author      CyrilSLi
// @description Prevents unsubmitted work in question assignments from being lost after closing the tab or browser
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/526251/Save%20contents%20of%20unsubmitted%20Google%20Classroom%20question%20responses.user.js
// @updateURL https://update.greasyfork.org/scripts/526251/Save%20contents%20of%20unsubmitted%20Google%20Classroom%20question%20responses.meta.js
// ==/UserScript==

const spanText = "Your answer";
var textarea, span;
const retries = 100;
var retry = 0, retryTimeout = 0;
function findEls() {
    textarea = [...document.getElementsByTagName("textarea")].filter(
        t => t.placeholder === "Type your answer" && window.getComputedStyle(t).visibility !== "hidden"
    )[0];
    span = [...document.getElementsByTagName("span")].filter(
        s => s.textContent.startsWith(spanText) && window.getComputedStyle(s).visibility !== "hidden"
    )[0];

    if (textarea == null || span == null) {
        retryTimeout = setTimeout(findEls, 200);
        retry++;
        if (retry === retries) {
            console.error("Question assignment not found on page.");
            clearTimeout(retryTimeout);
            throw new Error();
        }
    } else {
        console.log("Found question elements.");
        saveQuestion();
        clearTimeout(retryTimeout);
    }
}

var pageURL = "", pageID = "";
const pageRegEx = new RegExp("\/c\/[A-Z0-9a-z]+?\/sa\/[A-Z0-9a-z]+");
const observer = new MutationObserver((muts) => {
    if (document.location.pathname !== pageURL) {
        pageURL = document.location.pathname;
        if (pageRegEx.test(document.location)) {
            removeEventListener("input", areaInput);
            removeEventListener("keydown", typeTabs);
            clearTimeout(retryTimeout);
            console.log("Found question assignment.");
            retry = 0;
            pageID = document.location.pathname.match(pageRegEx)[0];
            setTimeout(findEls, 0);
        }
    }
});
observer.observe(document.body, {
    attributes: true
});

function setSpanTime() {
    span.textContent = `${spanText} (last updated ${new Date().toLocaleTimeString("en-US", { hour12: false })})`;
}
function areaInput(ev) {
    GM_setValue(pageID, textarea.value);
    setSpanTime();
}
function typeTabs(ev) {
    // https://stackoverflow.com/a/6637396
    if (ev.key == "Tab") {
        ev.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;
    }
}
function saveQuestion(ev) {
    textarea.addEventListener("input", areaInput);
    textarea.addEventListener("keydown", typeTabs);
    textarea.value = GM_getValue(pageID, "");
    refreshEls();
}
function refreshEls() {
    rows = 1;
    if (!(textarea.scrollHeight || textarea.clientHeight)) {
        setTimeout(refreshEls, 200);
        return;
    }
    while (textarea.scrollHeight > textarea.clientHeight) {
        textarea.setAttribute("rows", rows++);
    }
    setTimeout(setSpanTime, 1000);
}
window.addEventListener("beforeunload", () => {
    removeEventListener("input", areaInput);
    textarea.value = "";
});