// ==UserScript==
// @name         "Open All web+panda:// Links" button (with auto-start option)
// @namespace    yuvaraja
// @version      11.70
// @description  Like the title says. Latest version: Minor bugfix in deciding freshness.
// @author       yuvaraja
// @include      *
// @exclude      https://worker.mturk.com/requesters/handleWebPanda*
// @exclude      https://worker.mturk.com/requesters/pandaHamHandler*
// @exclude      *worker.mturk.com/handlePCHwebpanda*
// @exclude      *pandacrazy*
// @exclude      *hit_forker*
// @exclude      *mail.yahoo.com*
// @exclude      *mail.google.com*
// @exclude      *codepen.io*
// @exclude      https://worker.mturk.com/projects*
// @exclude      https://worker.mturk.com/?filters[search_term]=pandacrazy=on
// @exclude      https://worker.mturk.com/requesters/PandaCrazy/projects
// @grant        GM_openInTab
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/38149/%22Open%20All%20web%2Bpanda%3A%20Links%22%20button%20%28with%20auto-start%20option%29.user.js
// @updateURL https://update.greasyfork.org/scripts/38149/%22Open%20All%20web%2Bpanda%3A%20Links%22%20button%20%28with%20auto-start%20option%29.meta.js
// ==/UserScript==

const OPEN_TABS_IN_BACKGROUND = false;

const WEB_PANDA_WINDOW_WIDTH = 500;
const WEB_PANDA_WINDOW_HEIGHT = 350;

const NEW_PANDA_WINDOW_GAP_MS = 1000;
const NEW_PANDA_WINDOW_FIRST_OF_SET_EXTRA_GAP_MS = 2000;

var alreadyOpenedThisSession = {
};

var alreadySeenThisSession = {
};

var barHasBeenOpenedOnce = false;

unsafeWindow.alreadyOpenedThisSession = alreadyOpenedThisSession;

var openAllWebPandaLinksButton;
var autoStartCheckbox;

var atLeastOneWebPandaLinkFound;

var lastScrolledElement;

function removeScrolledIntoViewHighlightingFromAllElements() {
    document.querySelectorAll(".scrolled-into-view").forEach(highlightedElement => {
        highlightedElement.classList.remove("scrolled-into-view");
    });
}

function scrollAndHightlightFirstWebPandaElement(settings = {instant: false}) {
    let firstWebPandaElement = document.querySelector("a[href^='web+panda://']");
    firstWebPandaElement.scrollIntoView({behavior: (settings.instant === true ? "instant" : "smooth"), block: "center", inline: "center"});
    lastScrolledElement = firstWebPandaElement;
    removeScrolledIntoViewHighlightingFromAllElements();
    lastScrolledElement.classList.add("scrolled-into-view");
}

function scrollAndHightlightLastWebPandaElement(settings = {instant: false}) {
    let allWebPandaElements = document.querySelectorAll("a[href^='web+panda://']");
    let lastWebPandaElement = allWebPandaElements[allWebPandaElements.length-1];
    lastWebPandaElement.scrollIntoView({behavior: (settings.instant === true ? "instant" : "smooth"), block: "center", inline: "center"});
    lastScrolledElement = lastWebPandaElement;
    removeScrolledIntoViewHighlightingFromAllElements();
    lastScrolledElement.classList.add("scrolled-into-view");
}

function scrollAndHighlightWebPandaElement(isForwardSearchDirection, settings = {instant: false}) {

    if(!lastScrolledElement) {
        scrollAndHightlightFirstWebPandaElement();
    }
    else {
        let allWebPandaElements = document.querySelectorAll("a[href^='web+panda://']");
        for(let [index, webPandaElement] of allWebPandaElements.entries()) {
            if(lastScrolledElement === webPandaElement) {
                if((isForwardSearchDirection && index < allWebPandaElements.length - 1) ||
                   (!isForwardSearchDirection && index > 0)) {
                    lastScrolledElement.classList.remove("scrolled-into-view");
                    lastScrolledElement = allWebPandaElements[index + (isForwardSearchDirection ? 1 : -1)];
                    lastScrolledElement.scrollIntoView({behavior: (settings.instant === true ? "instant" : "smooth"), block: "center", inline: "center"});
                    lastScrolledElement.classList.add("scrolled-into-view");
                    break;
                }
                else { // We've found our element, but it's either the first or last in the group.
                    if(isForwardSearchDirection) {
                        scrollAndHightlightLastWebPandaElement();
                    }
                    else {
                        scrollAndHightlightFirstWebPandaElement();
                    }
                }
            }
            else {
                if(index === allWebPandaElements.length - 1) { // We've gone through all the elements and didn't find our last scrolled element.
                    // ... well then, we'll just scroll to the first one in our set.
                    scrollAndHightlightFirstWebPandaElement();
                }
            }
        }
    }
}

function handleHomeAndEventKeysIfWebPandaLinksFound(e) {

    if(e.key && e.shiftKey) {
        if(e.key === "Home") {
            scrollAndHightlightFirstWebPandaElement({instant: true});
            e.preventDefault();
        }
        else if(e.key === "End") {
            scrollAndHightlightLastWebPandaElement({instant: true});
            e.preventDefault();
        }
        else if(e.key === "PageUp") {
            scrollAndHighlightWebPandaElement(false);
            e.preventDefault();
        }
        else if(e.key === "PageDown") {
            scrollAndHighlightWebPandaElement(true);
            e.preventDefault();
        }
    }
}

function insertOpenAllWebPandaLinksButtonIfNotInserted() {
    if(!openAllWebPandaLinksButton && !barHasBeenOpenedOnce) {

        barHasBeenOpenedOnce = true;

        document.body.insertAdjacentHTML("afterbegin", `
<div class="web-panda-links-found-on-page">
<button id="scrollToLastWebPandaLink" class="web-panda-nav-links" title="Shortcut: Shift+End">Z</button>
<button id="scrollToNextWebPandaLink" class="web-panda-nav-links" title="Shortcut: Shift+PageDown">▼</button>
<button id="scrollToPreviousWebPandaLink" class="web-panda-nav-links title="Shortcut: Shift+PageUp"">▲</button>
<button id="scrollToFirstWebPandaLink" class="web-panda-nav-links" title="Shortcut: Shift+Home">A</button>
<button id="closeWebPandaLinksFoundOnPageDialog" title="Don't check for any more links on this page." class="btn btn-xs btn-danger" style="background: #d9534f; color: white; float: left; margin-right: 5px;">X</button>
<button id="minimizeWebPandaLinksFoundOnPageDialog" title="Hide until new links are found on this page." class="btn btn-xs btn-warning" style="background: #f0ad4e; color: white; float: left; margin-right: 5px;">_</button>
<span class="web-panda-found-heads-up-message">New web+panda:// links have been found on this page!</span>
<span class="auto-start">Auto Start: <input id="autoStartAJAXWebPandaLinks" type="checkbox"></span> <span id="openedAndToOpenCount"></span><button id="openAllWebPandaLinks" class="btn btn-sm btn-default">Open All Fresh web+panda:// Links</button>
</div>
<style>
div.web-panda-links-found-on-page {
background: green;
color: white;
margin: 5px;
padding: 8px;
border-radius: 2em / 2em;
border: 1px dashed black;
position: fixed;
z-index: ${Number.MAX_SAFE_INTEGER} !important;
width: 90% !important;
left: 50% !important;
margin-left: -45% !important;
top: 0px;
transition: 0.33s all !important;
}
div.web-panda-links-found-on-page span {
pointer-events: none;
}
div.web-panda-links-found-on-page input {
cursor: pointer;
pointer-events: auto;
}
div.web-panda-links-found-on-page button {
cursor: pointer;
pointer-events: auto;
}
div.web-panda-links-found-on-page button {
color: black;
float: right;
line-height: 1.0em;
margin: auto;
}
span.auto-start {
float: right;
margin: 0px 5px 0px 5px;
}
#openedAndToOpenCount {
float: right;
margin: 0px 5px 0px 5px;
}
span.web-panda-found-heads-up-message {
font-weight: bold;
}
.web-panda-nav-links {
float: left;
}
.scrolled-into-view {
background: yellow !important;
}
</style>
`);
        document.getElementById("minimizeWebPandaLinksFoundOnPageDialog").addEventListener("click", e => {
            document.querySelector(".web-panda-links-found-on-page").style.top = `${screen.availHeight}px`;
        });

        document.addEventListener("keydown", handleHomeAndEventKeysIfWebPandaLinksFound);

        document.getElementById("scrollToNextWebPandaLink").addEventListener("click", scrollAndHighlightWebPandaElement.bind(window, true));
        document.getElementById("scrollToPreviousWebPandaLink").addEventListener("click", scrollAndHighlightWebPandaElement.bind(window, false));

        document.getElementById("scrollToFirstWebPandaLink").addEventListener("click", scrollAndHightlightFirstWebPandaElement.bind(window, {instant: true}));
        document.getElementById("scrollToLastWebPandaLink").addEventListener("click", scrollAndHightlightLastWebPandaElement.bind(window, {instant: true}));

        autoStartCheckbox = document.getElementById("autoStartAJAXWebPandaLinks");

        openAllWebPandaLinksButton = document.getElementById("openAllWebPandaLinks");

        let closeWebPandaLinksFoundOnPageDialog = document.getElementById("closeWebPandaLinksFoundOnPageDialog");
        closeWebPandaLinksFoundOnPageDialog.addEventListener("click", e => {
            document.removeEventListener("keydown", handleHomeAndEventKeysIfWebPandaLinksFound);
            document.querySelector(".web-panda-links-found-on-page").remove();
            openAllWebPandaLinksButton = null;
        });

        openAllWebPandaLinksButton.addEventListener("click", e=> {

            const FIRST_PARAM_EARLIER_SORT = -1;
            const FIRST_PARAM_LATER_SORT   =  1;
            const FIRST_PARAM_EQUAL_SORT   =  0;

            let allWebPandaLinks = Array.from(document.querySelectorAll("a[href^='web+panda://']")).sort( (linkA, linkB) => {
                let parsedLinkA = new URL(linkA);
                let parsedLinkB = new URL(linkB);

                if(parsedLinkA.search && !parsedLinkB.search) {
                    return FIRST_PARAM_EARLIER_SORT;
                }
                else if(!parsedLinkA.search && parsedLinkB.search) {
                    return FIRST_PARAM_LATER_SORT;
                }
                else {
                    return FIRST_PARAM_EQUAL_SORT;
                }
            });

            let allWebPandaHrefsToOpen = [];

            allWebPandaLinks.forEach(webPandaLink => {

                let parsedWebPandaURL = new URL(webPandaLink);
                let gid = parsedWebPandaURL.pathname.replace("//", "");

                if(!alreadyOpenedThisSession[gid]) {
                    allWebPandaHrefsToOpen.push(webPandaLink);
                    alreadyOpenedThisSession[gid] = true;
                }
            });

            let numberOfWebPandaHrefsToOpen = allWebPandaHrefsToOpen.length;
            if(numberOfWebPandaHrefsToOpen === 0) {return;}

            let numberOfWebPandaHrefsOpened = 0;

            let openedAndToOpenCountElement = document.querySelector("#openedAndToOpenCount");
            openedAndToOpenCountElement.innerText = `Opened: ${numberOfWebPandaHrefsOpened} / Total: ${numberOfWebPandaHrefsToOpen}`;

            let numberOfWindowsPerRow = Math.floor( screen.availWidth / WEB_PANDA_WINDOW_WIDTH );
            let numberOfRowsPerScreen = Math.floor( screen.availHeight / WEB_PANDA_WINDOW_HEIGHT );

            allWebPandaHrefsToOpen.forEach((webPandaHrefToOpen, index) => {
                let extraTimeGap = (index !== 0 ? NEW_PANDA_WINDOW_FIRST_OF_SET_EXTRA_GAP_MS : 0);
                if(OPEN_TABS_IN_BACKGROUND) {
                    GM_openInTab(webPandaHrefToOpen, OPEN_TABS_IN_BACKGROUND);
                }
                else {
                    let newWindowY = ( Math.floor(index / numberOfWindowsPerRow) * WEB_PANDA_WINDOW_HEIGHT ) % screen.availHeight;
                    let newWindowX = (index * WEB_PANDA_WINDOW_WIDTH) % screen.availWidth;

                    setTimeout(() => {
                        numberOfWebPandaHrefsOpened++;
                        if(numberOfWebPandaHrefsOpened < numberOfWebPandaHrefsToOpen) {
                            openedAndToOpenCountElement.innerText = `Opened: ${numberOfWebPandaHrefsOpened} / Total: ${numberOfWebPandaHrefsToOpen}`;
                        }
                        else {
                            openedAndToOpenCountElement.innerHTML = "";
                        }
                        window.open(webPandaHrefToOpen,
                                    undefined,
                                    `left=${newWindowX},top=${newWindowY},width=${WEB_PANDA_WINDOW_WIDTH},height=${WEB_PANDA_WINDOW_HEIGHT}`);
                    }, (index * NEW_PANDA_WINDOW_GAP_MS) + extraTimeGap);
                }
            });
        });
    }
}

function attemptToInsertOpenAllLinksButtonIfWebPandaFound(element) {

    if(!element) {element = document;}

    if(element.querySelector("a[href^='web+panda://']")) {
        insertOpenAllWebPandaLinksButtonIfNotInserted();
        atLeastOneWebPandaLinkFound = true;
    }
}

var mutationObserver = new MutationObserver(function(mutations) {

    // Dunno why this was here before. Not quite as good of a way as the new one.
    // Probably came from the feature creep / changing requirements.
    // attemptToInsertOpenAllLinksButtonIfWebPandaFound();

    for(let mutation of mutations) {
        if(mutation.addedNodes.length > 0) {

            for(let addedNode of mutation.addedNodes) {

                if(addedNode.querySelector && addedNode.querySelector("a[href^='web+panda://']")) {

                    let dynamicallyAddedWebPandas = addedNode.querySelectorAll("a[href^='web+panda://']");

                    for(let dynamicallyAddedWebPanda of dynamicallyAddedWebPandas) {

                        let parsedWebPandaURL = new URL(dynamicallyAddedWebPanda.href);
                        let gid = parsedWebPandaURL.pathname.replace("//", "");

                        if(!alreadySeenThisSession[gid]) {
                            alreadySeenThisSession[gid] = true;
                            let pandaLinksBar = document.querySelector(".web-panda-links-found-on-page");
                            if(pandaLinksBar) {pandaLinksBar.style.top = "0px";}
                            insertOpenAllWebPandaLinksButtonIfNotInserted();
                        }

                        if(!alreadyOpenedThisSession[gid]) {

                            if(autoStartCheckbox && autoStartCheckbox.checked) {
                                if(OPEN_TABS_IN_BACKGROUND) {
                                    GM_openInTab(dynamicallyAddedWebPanda.href, OPEN_TABS_IN_BACKGROUND);
                                }
                                else {
                                    window.open(dynamicallyAddedWebPanda.href,
                                                undefined,
                                                `left=0,top=0,width=${WEB_PANDA_WINDOW_WIDTH},height=${WEB_PANDA_WINDOW_HEIGHT}`);

                                }
                                alreadyOpenedThisSession[gid] = true;
                            }
                        }

                    }

                }
            }
        }
    }
});

function main() {
    atLeastOneWebPandaLinkFound = false;
    mutationObserver.observe(document.body, {childList: true, subtree: true, characterData: true});

    for(let webPandaPresentOnInitialPageLoad of document.querySelectorAll("a[href^='web+panda://']")) {
        let parsedWebPandaURL = new URL(webPandaPresentOnInitialPageLoad.href);
        let gid = parsedWebPandaURL.pathname.replace("//", "");
        alreadySeenThisSession[gid] = true;
    }

    attemptToInsertOpenAllLinksButtonIfWebPandaFound();
}

main();