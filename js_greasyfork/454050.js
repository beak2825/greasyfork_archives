// ==UserScript==
// @name         ARM DevSummit Watched Session Tracker
// @namespace    https://greasyfork.org/users/382804
// @version      0.5
// @description  Add "watched session" flag feature to ARM DevSummit site.
// @author       Artur.Klauser@computer.org
// @match        https://devsummit.arm.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arm.com
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454050/ARM%20DevSummit%20Watched%20Session%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/454050/ARM%20DevSummit%20Watched%20Session%20Tracker.meta.js
// ==/UserScript==
// date          2020-11-04
// log           Replaced checkbox with unicode symbols and added css styles.
//               Checkbox click behavior inside <a> is too inconsistent across browsers.
// date          2020-11-03
// log           Fix clicking on session number span contents.
// date          2022-11-02
// log           Fix MutationObserver usage.
//               No more need for context-menu trigger.
// date          2022-10-31
// log           Initial revision.

"use strict";

var use_local_storeage = false; // otherwise uses cookies
var watchedSessions = new Set();

// Set default cookie properties.
var cookiesApi = Cookies.withAttributes({
    expires: 1000, // days from creation
    domain: "devsummit.arm.com",
    path: "/",
    secure: true
});

// Load the watched sessions from browser-side storage.
function loadWatchedSessions() {
    var watched;
    if (use_local_storeage) {
        watched = window.localStorage.getItem("watchedSessions");
    } else { // cookies
        watched = cookiesApi.get("watchedSessions");
    }

    watchedSessions = new Set(JSON.parse(watched ? watched : "[]"));
}

// Save the watched sessions to browser-side storage.
function storeWatchedSessions() {
    var watchedSessions_json = JSON.stringify(Array.from(watchedSessions));
    if (use_local_storeage) {
        window.localStorage.setItem("watchedSessions", watchedSessions_json);
    } else { // cookies
        cookiesApi.set("watchedSessions", watchedSessions_json);
    }
}

// Returns all text nodes of the document.
function getTextNodes(rootNode) {
    if (rootNode.nodeType == 3) {
        // We're already at a text node - has no children, can't be tree-walked.
        return [rootNode];
    }

    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        { acceptNode(node) {
            var parentTag = node.parentNode.tagName;
            if (parentTag && parentTag.toUpperCase() == "SCRIPT") {
                return NodeFilter.FILTER_REJECT;
            } else {
                return NodeFilter.FILTER_ACCEPT;
            }
        } }
    );

    var node;
    var textNodes = [];
    while(node = walker.nextNode()) {
        textNodes.push(node);
    }

    return textNodes;
}

function handleSessionClick(event) {
    // Toggle "watched" state.
    var watched = ! (this.getAttribute("watched").toLowerCase() === 'true');
    this.setAttribute("watched", watched);
    // Prevent outer <a> element (if present) from firing.
    event.preventDefault();
    //event.stopPropagation();

    // Update saved state.
    var sessionNumber = this.getAttribute("session-number");
    if (watched) {
        watchedSessions.add(sessionNumber);
    } else {
        watchedSessions.delete(sessionNumber);
    }
    storeWatchedSessions();
}

// Add  styling of watched/unwatched sessions.
function installWatchedSessionStyle() {
    GM_addStyle("span.session-number { cursor: pointer !important; display: inline !important; }");
    GM_addStyle("span.session-number[watched=true] { color: green; }");
    GM_addStyle("span.session-number[watched=true]::after { content: '✅'; }");
    GM_addStyle("span.session-number[watched=false] { color: red; }");
    GM_addStyle("span.session-number[watched=false]::after { content: '🔲'; }");
}

function addWatchedSessionTracker(rootNode) {
    // console.log("running addWatchSessiontracker on ", rootNode.nodeName);
    // console.log(rootNode);

    // We want to handle session number patterns of the form "[123]".
    // Find all session number patterns in all text nodes and convert them
    // to separate spans that we can handle separately in the DOM.
    for (var node of getTextNodes(rootNode)) {
        // Each while iteration handles one occurrence of a session.
        // We need the while loop since there can be more than one session in a text node.
        while(node) {
            // If we've already handled this node in a previous call to addWatchedSessionTracker, skip it.
            if (node.parentNode.hasAttribute("session-number")) {
                break;
            }
            var start = node.nodeValue.search(/\[\d+\]/); // session number pattern
            if (start < 0) {
                // No session left in this node.
                break;
            }
            if (start > 0) {
                // There is text before the session number pattern.
                // Split it out into a separate text node that precedes the node
                // starting with the session number pattern.
                node = node.splitText(start);
            }
            // Invariant: node starts with session number pattern.
            // Find the end of the pattern.
            var end = node.nodeValue.search("]");
            if (end < 0) {
                console.log("Error: could not find session pattern end ] in '" + node.nodeValue + "'");
                break;
            }
            // Break out the session number and remove it from the text node.
            var sessionNumber = node.nodeValue.substring(1, end);
            // console.log("found session " + sessionNumber + " in: " + node.nodeValue.substr(0, 20));
            node.nodeValue = node.nodeValue.substring(end + 1);

            // Replace the session number in the text node with a new <span> containing
            // the session number and a checkbox.
            var sessionSpan = document.createElement("span");
            sessionSpan.setAttribute("class", "session-number");
            sessionSpan.setAttribute("session-number", sessionNumber);
            sessionSpan.setAttribute("watched", watchedSessions.has(sessionNumber));
            node.parentNode.insertBefore(sessionSpan, node);

            var sessionText = document.createTextNode("[" + sessionNumber + "] ");
            sessionSpan.appendChild(sessionText);

            // React to button clicks on the session number span.
            sessionSpan.addEventListener("click", handleSessionClick, false);
        }
    }
}

(function() {
    // Load watched sessions from browser-side storage.
    loadWatchedSessions();
    console.log("watched sessions:", watchedSessions);

    function handleMutations(mutations) {
        for (var mutation of mutations) {
            if (mutation.type == "childList") {
                for (var node of mutation.addedNodes) {
                    // console.log("running addWachedSessionTracker from mutation watcher");
                    addWatchedSessionTracker(node);
                }
            }
        }
    }

    var observer = new MutationObserver(handleMutations);

    // Run a pass over modified DOM sections.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Perform a first pass over the whole document body to catch everything
    // that happened before we started watching for mutations.
    addWatchedSessionTracker(document.body);

    installWatchedSessionStyle();

})();
