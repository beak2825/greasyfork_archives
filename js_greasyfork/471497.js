// ==UserScript==
// @name          tildes-keyboard-navigation
// @match         https://tildes.net/*
// @grant         none
// @version       0.1
// @author        aglidden
// @author        vmavromatis
// @author        InfinibyteF4
// @license       GPL3
// @homepageURL   https://github.com/aglidden/tildes-keyboard-navigation
// @namespace     https://github.com/aglidden/tildes-keyboard-navigation
// @description   Easily navigate Tildes with keyboard arrows
// @run-at        document-end

// @downloadURL https://update.greasyfork.org/scripts/471497/tildes-keyboard-navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/471497/tildes-keyboard-navigation.meta.js
// ==/UserScript==


// Vim key toggle
// Default: false
// Set to true for Vim navigation
const vimKeyNavigation = true;

// Set selected entry colors
const backgroundColor = '#004742';
const textColor = 'white';
// Set navigation keys with keycodes here: https://www.toptal.com/developers/keycode
let nextKey = 'ArrowDown';
let prevKey = 'ArrowUp';
let nextPageKey = 'ArrowRight';
let prevPageKey = 'ArrowLeft';

if (vimKeyNavigation) {
    nextKey = 'KeyJ';
    prevKey = 'KeyK';
    nextPageKey = 'KeyL';
    prevPageKey = 'KeyH';
}

const expandKey = 'KeyX';
const openCommentsKey = 'KeyC';
const openLinkandCollapseKey = 'Enter';
const parentCommentKey = 'KeyP';
const voteKey = 'KeyV';
const replycommKey = 'KeyR';
const bookmarkKey = 'KeyB';
const ignoreKey = 'KeyI';

// Stop arrows from moving the page if not using Vim navigation
window.addEventListener("keydown", function(e) {
    if (["ArrowUp", "ArrowDown"].indexOf(e.code) > -1 && !vimKeyNavigation) {
        e.preventDefault();
    }
}, false);

// Remove scroll animations
document.documentElement.style = "scroll-behavior: auto";

// Set CSS for selected entry
const css = [
    ".selected {",
    "  background-color: " + backgroundColor + " !important;",
    "  color: " + textColor + ";",
    "}",
    `#snackbar {
    visibility: hidden;
    min-width: 250px;
    margin-left: -125px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 2px;
    padding: 16px;
    position: fixed;
    z-index: 1;
    left: 50%;
    bottom: 30px;
    font-size: 17px;
}

#snackbar.show {
    visibility: visible;
    //-webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
    //animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}`
].join("\n");

// Global variables
let currentEntry;
let commentBlock;
let addStyle;
let PRO_addStyle;
let entries = [];
let previousUrl = "";
let expand = false;



if (typeof GM_addStyle !== "undefined") {
    console.log(GM_addStyle(css));
} else if (typeof PRO_addStyle !== "undefined") {
    PRO_addStyle(css);
} else if (typeof addStyle !== "undefined") {
    addStyle(css);
} else {
    let node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    let heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        // no head yet, stick it whereever
        document.documentElement.appendChild(node);
    }
}

//css fix, can't figure out why the above code isn't working
'use strict';
let head = document.getElementsByTagName('head')[0];
if (head) {
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = css;
    head.appendChild(style);
}
//end css fix

//insert snackbar
let elem = document.createElement("div");
elem.id = 'snackbar';
elem.innerHTML = "";
document.body.insertBefore(elem, document.body.childNodes[0]);
let timer;

const selectedClass = "selected";


const targetNode = document.documentElement;
const config = {
    childList: true,
    subtree: true
};

const observer = new MutationObserver(() => {
    entries = document.querySelectorAll(".topic, .comment-itself");
    if (entries.length > 0) {
        if (location.href !== previousUrl) {
            previousUrl = location.href;
            currentEntry = null;
        }
        init();
    }
});

observer.observe(targetNode, config);

function init() {
    // If jumping to comments
    if (window.location.search.includes("#comments") &&
        entries.length > 1 &&
        (!currentEntry || Array.from(entries).indexOf(currentEntry) < 0)
    ) {
        selectEntry(entries[1], true);
    }
    // If jumping to comment from anchor link
    else if (window.location.pathname.includes("#comment-") &&
        (!currentEntry || Array.from(entries).indexOf(currentEntry) < 0)
    ) {
        const commentId = window.location.pathname.replace("#comment-", "");
        const anchoredEntry = document.getElementById("comment-" + commentId);

        if (anchoredEntry) {
            selectEntry(anchoredEntry, true);
        }
    }
    // If no entries yet selected, default to first
    else if (!currentEntry || Array.from(entries).indexOf(currentEntry) < 0) {
        selectEntry(entries[0]);
    }

    Array.from(entries).forEach(entry => {
        entry.removeEventListener("click", clickEntry, true);
        entry.addEventListener('click', clickEntry, true);
    });

    document.removeEventListener("keydown", handleKeyPress, true);
    document.addEventListener("keydown", handleKeyPress, true);
}

function handleKeyPress(event) {
    if (["TEXTAREA", "INPUT"].indexOf(event.target.tagName) > -1) {
        return;
    }

    switch (event.code) {
        case nextKey:
        case prevKey:
            previousKey(event);
            break;
        case voteKey:
            vote();
            break;
        case expandKey:
            toggleExpand();
            expand = isExpanded() ? true : false;
            break;
        case bookmarkKey:
            bookmark();
            break;
        case ignoreKey:
            ignore();
            break;
        case openCommentsKey:
            comments(event);
            break;
        case replycommKey:
            if (window.location.pathname.match("~.*\/.*\/.*")) {
                // Allow Mac refresh with CMD+R
                if (event.key !== 'Meta') {
                    reply(event);
                }
            } else {
                group(event);
            }
            break;
        case openLinkandCollapseKey:
            if (window.location.pathname.match("~.*\/.*\/.*")) {
                toggleExpand();
            } else {
                const linkElement = currentEntry.querySelector(".topic-title>a");
                if (linkElement) {
                    if (event.shiftKey) {
                        window.open(linkElement.href);
                    } else {
                        linkElement.click();
                    }
                } else {
                    comments(event);
                }
            }
            break;
        case parentCommentKey:
            if (window.location.pathname.match("~.*\/.*\/.*")) {
                selectEntry(parentComment(), true);
            }
            break;
        case nextPageKey:
        case prevPageKey: {
            const pageButtons = Array.from(document.querySelectorAll(".pagination>a"));

            if (pageButtons && (document.getElementsByClassName('pagination').length > 0)) {
                const buttonText = event.code === nextPageKey ? "Next" : "Prev";
                pageButtons.find(btn => btn.innerHTML === buttonText).click();
            }
            // Jump next block of comments
            if (event.code === nextPageKey) {
                commentBlock = getNextEntrySameLevel(currentEntry);
            }
            // Jump previous block of comments
            if (event.code === prevPageKey) {
                commentBlock = getPrevEntrySameLevel(currentEntry);
            }

            if (commentBlock) {
                if (expand) {
                    collapseEntry();
                }
                selectEntry(commentBlock, true);
                if (expand) {
                    expandEntry();
                }
            }
        }
    }
}

function snackbar(message) {
    // Get the snackbar DIV
    let x = document.getElementById("snackbar");
    x.innerHTML = message;
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    clearTimeout(timer);
    timer = setTimeout(function() {
        x.className = x.className.replace("show", "");
    }, 3000);
}

function getNextEntry(e) {
    const currentEntryIndex = Array.from(entries).indexOf(e);

    if (currentEntryIndex + 1 >= entries.length) {
        return e;
    }

    return entries[currentEntryIndex + 1];
}

function getPrevEntry(e) {
    const currentEntryIndex = Array.from(entries).indexOf(e);

    if (currentEntryIndex - 1 < 0) {
        return e;
    }

    return entries[currentEntryIndex - 1];
}

function getNextEntrySameLevel(e) {

    const nextSibling = e.parentElement.parentElement.nextElementSibling;

    if (!nextSibling || !nextSibling.querySelector(".comment-itself")) {
        return getNextEntry(e);
    }

    return nextSibling.querySelector(".comment-itself");
}

function getPrevEntrySameLevel(e) {
    const prevSibling = e.parentElement.parentElement.previousElementSibling;

    if (!prevSibling || !prevSibling.querySelector(".comment-itself")) {
        return getPrevEntry(e);
    }

    return prevSibling.querySelector(".comment-itself");
}

function clickEntry(event) {
    const e = event.currentTarget;
    const target = event.target;

    // Deselect if already selected, also ignore if clicking on any link/button
    if (e === currentEntry && e.classList.contains(selectedClass) &&
        !(
            target.tagName.toLowerCase() === "button" || target.tagName.toLowerCase() === "a" ||
            target.parentElement.tagName.toLowerCase() === "button" ||
            target.parentElement.tagName.toLowerCase() === "a" ||
            target.parentElement.parentElement.tagName.toLowerCase() === "button" ||
            target.parentElement.parentElement.tagName.toLowerCase() === "a"
        )
    ) {
        e.classList.remove(selectedClass);
    } else {
        selectEntry(e);
    }
}

function selectEntry(e, scrollIntoView = false) {
    if (currentEntry) {
        currentEntry.classList.remove(selectedClass);
    }
    currentEntry = e;
    currentEntry.classList.add(selectedClass);

    if (scrollIntoView) {
        scrollIntoViewWithOffset(e, 15);
    }
}

function isExpanded() {
    if (
        //probable bug
        currentEntry.details.open
    ) {
        return true;
    }

    return false;
}

function parentComment() {
    let targetBlock;
    if (currentEntry.parentElement.getAttribute("data-comment-depth") !== "0") {
        targetBlock = currentEntry.parentElement.parentElement.parentElement.parentElement.querySelector(".comment-itself");
        console.log(targetBlock);
    } else {
        targetBlock = currentEntry;
    }
    return targetBlock;
}

function previousKey(event) {
    let selectedEntry;
    // Next button
    if (event.code === nextKey) {
        if (event.shiftKey && vimKeyNavigation) {
            selectedEntry = getNextEntrySameLevel(currentEntry);

        } else {
            selectedEntry = getNextEntry(currentEntry);
        }
    }
    // Previous button
    if (event.code === prevKey) {
        if (event.shiftKey && vimKeyNavigation) {
            selectedEntry = getPrevEntrySameLevel(currentEntry);

        } else {
            selectedEntry = getPrevEntry(currentEntry);
        }
    }
    if (selectedEntry) {
        if (expand) {
            collapseEntry();
        }
        selectEntry(selectedEntry, true);
        if (expand) {
            expandEntry();
        }
    }
}

function vote() {
    let voteButton;
    if (window.location.pathname.match("~.*\/.*\/.*")) {
        voteButton = currentEntry.querySelector("menu.btn-post>li>button[data-ic-src*='vote']");
        console.log(voteButton);
    } else {
        voteButton = currentEntry.querySelector("button.topic-voting");
    }
    if (voteButton) {
        voteButton.click();
    }
}


function reply(event) {
    const replyButton = currentEntry.querySelector("button[name='reply']");

    if (replyButton) {
        event.preventDefault();
        replyButton.click();
    }
}

function group(event) {
    if (event.shiftKey) {
        window.open(
            currentEntry.querySelector("a.link-group").href,
        );
    } else {
        currentEntry.querySelector("a.link-group").click();
    }
}

function comments(event) {
    if (event.shiftKey) {
        window.open(
            currentEntry.querySelector("div.topic-info-comments>a").href,
        );
    } else {
        currentEntry.querySelector("div.topic-info-comments>a").click();
    }
}

function bookmark() {
    let bookmarkButton = currentEntry.querySelector("menu>li>button.btn-post-action[data-ic-src*='bookmark']");
    let buttonContent = currentEntry.querySelector("menu>li>button.btn-post-action[data-ic-src*='bookmark']").innerHTML;
    if (bookmarkButton) {
        bookmarkButton.click();
        snackbar(buttonContent + 'ed');
    }
}

function ignore() {
    let ignoreButton = currentEntry.querySelector("menu>li>button.btn-post-action[name='topic-actions-ignore']");
    let buttonContent = currentEntry.querySelector("menu>li>button.btn-post-action[name='topic-actions-ignore']").innerHTML;
    if (ignoreButton) {
        ignoreButton.click();
        console.log(buttonContent);
        if (buttonContent.includes("Unignore")) {
            snackbar("Unignored");
        } else {
            snackbar("Ignored");
        }
    }
}

function toggleExpand() {
    const textExpandButton = currentEntry.querySelector(".topic-text-excerpt>summary");
    const commentExpandButton = currentEntry.querySelector(".btn-comment-collapse");

    if (textExpandButton) {
        textExpandButton.click();

        const container = currentEntry.querySelector(".topic-text-excerpt");

        if (container) {
            scrollIntoViewWithOffset(
                container,
                currentEntry.offsetHeight - container.offsetHeight + 10
            );
        }
    }

    if (commentExpandButton) {
        commentExpandButton.click();
    }
}

function expandEntry() {
    if (!isExpanded()) {
        toggleExpand();
    }
}

function collapseEntry() {
    if (isExpanded()) {
        toggleExpand();
    }
}

function scrollIntoViewWithOffset(e, offset) {
    if (e.getBoundingClientRect().top < 0 ||
        e.getBoundingClientRect().bottom > window.innerHeight
    ) {
        const y = e.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
            top: y
        });
    }
}