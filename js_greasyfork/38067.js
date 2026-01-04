// ==UserScript==
// @name         Linkify plain-text GIDs, web+panda:// fallbacks everywhere.
// @namespace    salembeats
// @version      12.4
// @description  Latest update: No more middle-click listeners.
// @author       Cuyler Stuwe (salembeats)
// @include      *
// @exclude      *hitnotifier.com*
// @exclude      *pandacrazy*
// @exclude      *hit_forker*
// @exclude      *google.com*
// @exclude      *worker.mturk.com*handle*
// @exclude      *codepen.io*
// @exclude      https://worker.mturk.com/tasks
// @exclude      https://worker.mturk.com/projects/*/tasks*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38067/Linkify%20plain-text%20GIDs%2C%20web%2Bpanda%3A%20fallbacks%20everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/38067/Linkify%20plain-text%20GIDs%2C%20web%2Bpanda%3A%20fallbacks%20everywhere.meta.js
// ==/UserScript==

const blacklistedLandingURLPatternsForFallbacks = [
    "turkerhub.com",
    "mturkcrowd.com",
    "turkernation.com",
    "overwatch",
    "pandacrazy"
];

var landingPage;
var isBlacklistedForFallbacks;

const MIDDLE_BUTTON_CODE = 1;

const WINDOW_WIDTH = 520;
const WINDOW_HEIGHT = 350;

const SHOULD_LINKIFY_FOUND_GIDS = true;
const SHOULD_ADD_WP_GID_TO_ACCEPT_AND_PREVIEW_LINKS = true;

var mutationObserver = new MutationObserver(function(mutations) {
    for(let mutation of mutations) {

        if(mutation.addedNodes.length > 0) {
            let addedNode = mutation.addedNodes[0];

            if(!isBlacklistedForFallbacks &&
               addedNode.querySelector &&
               addedNode.querySelector("a[href*='worker.mturk.com/projects/']")) {

                if(SHOULD_ADD_WP_GID_TO_ACCEPT_AND_PREVIEW_LINKS) {
                    addWebPandaLinksNextToAllElementsUnder(addedNode);
                }
            }

            if(addedNode.className && addedNode.className.includes("original-plus-linkified-content")) {
            }
            else {
                if(SHOULD_LINKIFY_FOUND_GIDS) {
                    linkifyPlainTextGIDsUnder(addedNode);
                }
            }
        }
    }
});


function textNodesUnder(el) {
    var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()) a.push(n);
    return a;
}

function linkifyPlainTextGIDsUnder(el) {
    let allTextNodes = textNodesUnder(el);

    allTextNodes.forEach(textNode => {
        let trimmedText = textNode.data.trim();
        let regexMatch = trimmedText.match(/\b3(?:[A-Z0-9]){29}\b/);
        if(regexMatch) {
            let linkElement = document.createElement("template");
            linkElement.innerHTML = `<span class="original-plus-linkified-content">${trimmedText.replace(regexMatch[0], `<a href="web+panda://${regexMatch[0]}" class="linkified-plain-text-web-panda">${regexMatch[0]}</a> <span style="font-size: 0.7em; vertical-align: super;"><em>(Linkified GID)</em></span>`)}</span>`;
            if(!textNode.parentElement || textNode.parentElement.nodeName !== "A") {
                textNode.replaceWith(linkElement.content.firstChild);
            }
        }
    });
}

function addWebPandaLinkNextTo(anchorElement) {

    if(!anchorElement.href.includes("worker.mturk.com")) {
        return;
    }
    else if(anchorElement.href.includes("projects/") &&
            !anchorElement.href.endsWith("projects/")) {

        let gid = (anchorElement.href.match(/projects\/([^/?&]+)/) || ["", ""])[1];

        if(anchorElement.href.includes("accept_random")) {
        }
        else {
        }

        let webPandaLink = `web+panda://${gid}`;

        let newHTML = ` <span style="font-size: 0.7em; vertical-align: super;"><a href="${webPandaLink}" class="wp-gid-superscript" style="color: purple;">w+p://GID</a></span>`;

        anchorElement.insertAdjacentHTML("afterend", newHTML);
    }
}

function addWebPandaLinksNextToAllElementsUnder(element = document.body) {
    let mTurkWorkerHITLinks = element.querySelectorAll("a[href*='worker.mturk.com/projects/']");

    for(let hitLink of mTurkWorkerHITLinks) {
        addWebPandaLinkNextTo(hitLink);
    }
}

function processLinkClickEvent(event) {

    let pandaQuery;

    if(event.target.href.includes("hit_id=")) {
        pandaQuery = event.target.href.match(/hit_id=([^&/?]+)/)[1];
    }
    else if(event.target.href.includes("/accept_random") ||
            event.target.href.includes("worker.mturk.com/projects/")) {
        pandaQuery = event.target.href.match(/3[A-Za-z0-9]{29}/)[0].toUpperCase();
    }
    else if(event.target.href.startsWith("web+panda://") &&
            event.target.classList &&
            (event.target.classList.contains("linkified-plain-text-web-panda") || event.target.classList.contains("wp-gid-superscript"))) {
        pandaQuery = event.target.href;
    }

    if(pandaQuery) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        let toOpen = `${(pandaQuery.startsWith("web+panda") ? "" : "web+panda://")}${pandaQuery}?${event.shiftKey ? "once=true&" : ""}contextURL=${encodeURIComponent(window.location.href)}`;
        window.open(toOpen, undefined, (!event.shiftKey ? `width=${WINDOW_WIDTH},height=${WINDOW_HEIGHT},left=${screen.width/2 - WINDOW_WIDTH/2},top=${screen.height/2 - WINDOW_HEIGHT/2}` : ""));
    }

}

function main() {

    landingPage = window.location.href;

    for (let blacklistedURLPattern of blacklistedLandingURLPatternsForFallbacks) {
        if(landingPage.includes(blacklistedURLPattern)) {
            isBlacklistedForFallbacks = true;
            break;
        }
    }

    if(SHOULD_LINKIFY_FOUND_GIDS) {
        linkifyPlainTextGIDsUnder(document.body);
    }

    if(!isBlacklistedForFallbacks && SHOULD_ADD_WP_GID_TO_ACCEPT_AND_PREVIEW_LINKS) {
        addWebPandaLinksNextToAllElementsUnder(document.body);
    }

    document.body.addEventListener("click", function(event) {
        if(event.target.tagName === "A") {
            processLinkClickEvent(event);
        }
    });

    mutationObserver.observe(document.body, {childList: true, subtree: true});
}

main();