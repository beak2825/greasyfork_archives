// ==UserScript==
// @name         Hit Notifier
// @namespace    http://tampermonkey.net/
// @version      6.5
// @description  Hit Notifier filtered.
// @author       LLL
// @include      http*://hitnotifier.com*
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      mturk.com
// @connect      worker.mturk.com
// @connect      amazon.com
// @require      https://greasyfork.org/scripts/38404-mturkexportparser/code/MturkExportParser.js?version=250995
// @icon         https://turkerhub.com/data/avatars/m/1/1637.jpg?1513481491
// @downloadURL https://update.greasyfork.org/scripts/38405/Hit%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/38405/Hit%20Notifier.meta.js
// ==/UserScript==

const SCRIPT_GREASYFORK_URL = `https://greasyfork.org/en/scripts/38405-hit-notifier`; // TODO: Put actual URL here when the script is done.

const SALEM_BEATS_ICON_URL = "https://turkerhub.com/data/avatars/m/1/1637.jpg?1513481491";

const SHOULD_OPEN_NOTIFICATION_HITS_IN_BACKGROUND_TAB      = false; // Currently, it seems that this is the best default hard-coded setting for notifications.
const SHOULD_OPEN_CLICKED_WEBPANDA_LINKS_IN_BACKGROUND_TAB = true;

const WEB_PANDA_WINDOW_WIDTH = 500;
const WEB_PANDA_WINDOW_HEIGHT = 350;

const NEW_HEADER_HTML = `
<div class="hn2-title">Hits <a href="${SCRIPT_GREASYFORK_URL}" target="_blank"><span id="versionNumber" style="transition: 0.33s all linear;"></span></a></div>
<div class="hn2-subtitle"><a href="https://paypal.me/paytherobot" target="_blank" class="pay-me-link"></a> <a href="https://paypal.me/salembeats" target="_blank" class="pay-me-link"></a></div>
<div class="hn2-subtitle"></div>
<div class="hn2-subtitle-tip">(Open with <a href="https://greasyfork.org/en/scripts/36558-web-panda-default-handler" target="_blank">Default Handler</a>, <a href="https://greasyfork.org/en/scripts/37543-web-panda-ham" target="_blank">Web Panda Ham</a>, or <a href="https://greasyfork.org/en/scripts/37346-simple-panda-crazy-helper-web-panda-handler-unofficial-proof-of-concept" target="_blank">Panda Crazy</a>.)</div>
<style>
.hn2-title {
font-size: 2.0em;
font-weight: bold;
}
.hn2-subtitle {
font-size: 1.0em;
font-style: italic;
}
.hn2-subtitle-tip {
font-size: 0.8em;
font-style: italic;
margin-bottom: 15px;
}
.hn2-subtitle-tip a {
color: silver;
}
</style>
`;

const VERSION_NUMBER_COLOR_CHANGE_INTERVAL_MS = 0;

var readyForNotifications;

var processedGIDs = {};

const DELAY_BEFORE_FIRST_NOTIFICATION_MS = 1000;

function startRandomVersionNumberColorChanges() {
    setInterval(() => {
        let versionNumberSpan = document.getElementById("versionNumber");
        versionNumberSpan.style.color = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`;
    }, VERSION_NUMBER_COLOR_CHANGE_INTERVAL_MS);
}

function modifyDonateButtons() {

    let oldDonateButton = document.querySelector("a[href^='https://www.paypal.com/cgi']");

    oldDonateButton.innerText = "Do Not Donate";
    oldDonateButton.classList.add("donate-button");

    let newDonateButton = oldDonateButton.cloneNode();

    newDonateButton.innerText = "Donate to LLL";
    newDonateButton.href = "https://www.paypal.me/LLLpay";
    newDonateButton.classList.add("donate-button");

    oldDonateButton.insertAdjacentElement("afterend", newDonateButton);
}

function updateHeaderAndTitle() {
    let headerHeading = document.querySelector("#header h3");
    headerHeading.outerHTML = NEW_HEADER_HTML;
    document.title = "Hit Notifier";
}

function changeSiteStyles() {
    document.body.style = "background: black !important;";

    let allBreakElements = document.querySelectorAll("br");
    allBreakElements[0].remove();
    allBreakElements[1].remove();

    let bottomBreakElements = document.querySelectorAll("div.container-fluid br");
    bottomBreakElements[bottomBreakElements.length-1].remove();

    document.querySelectorAll("div.col").forEach(columnDiv => {
        if(columnDiv.innerHTML === "") {columnDiv.remove();}
    });

    let mainContentDiv = document.querySelector("div.col-10");
    mainContentDiv.classList.replace("col-10", "col-12");

    let donationDiv = document.querySelector("div.col-10");
    donationDiv.classList.replace("col-10", "col-12");

    let headerColumn = document.querySelector("#header div.col.text-center");
    headerColumn.classList.replace("col", "col-12");

    document.body.insertAdjacentHTML("beforeend", `
<style>
a.pay-me-link {
color: gold;
}
span.badge.badge-default {
display: none;
}
span.post-title-bar {
font-size: 0.85em;
font-weight: bold;
color: white;
margin-bottom: 5px;
}
.col-12.card {
background: black !important;
padding: 0px !important;
}
#header {
margin-bottom: 0px !important;
}
.donate-button {
margin: 5px 10px 0px 10px;
}
.card-block {
padding: 3px;
}
a[href='#previous'] b::after {
content: " (All Found HITs)";
}
ul.nav.nav-tabs.nav-justified li:first-of-type {
display: none;
}
a.nav-link {
color: silver;
}
.col {
padding: 0px !important;
}
#users {
position: fixed;
padding: 5px;
right: 5px;
top: 5px;
font-size: 12px;
display: inline-block;
background: black;
z-index: ${Number.MAX_SAFE_INTEGER};
pointer-events: none;
opacity: 0.6;
}
div.collapse.accordion.bg-faded table {
margin: auto !important;
min-width: 50% !important;
max-width: 60% !important;
}
#previous div.card {
background: #565656 !important;
}
#options div.card {
background: rgb(247,247,247) !important;
}
div.enhanced-post-contents {
}
span.big-slash {
font-size: 1.5em;
font-weight: bold;
line-height: 0.9;
}
span.hit-reward {
color: green;
font-weight: bold;
font-size: 2.0em;
}
div.description-line {
font-size: 0.8em;
}
span.xhr-response {
font-size: 0.65em;
}
span.xhr-response-value {
font-weight: bold;
}
span.xhr-response-value.xhr-success {
color: green !important;
}
span.xhr-response-value.xhr-failure {
color: red !important;
}
span.gid-section {
}
span.gid-value {
color: gray;
}
span.rid-value {
color: gray;
}
span.title-line-contents {
font-size: 1.5em;
font-weight: bold;
}
span.requester-line-contents {
font-size: 1.2em;
}
span.description-line-contents {
font-size: 1.0em;
font-style: oblique;
}
span.batch-or-survey-section {
color: purple;
}
#accordion > .card {
cursor: auto !important;
}
button {
cursor: pointer !important;
}
.card {
pointer-events: none;
}
.card a {
pointer-events: auto !important;
}
.card button {
pointer-events: auto !important;
}
.card label {
pointer-events: auto !important;
}
.card input {
pointer-events: auto !important;
}
.card select {
pointer-events: auto !important;
}
</style>
`);
}

function gotoFullList() {
    document.querySelector("a.nav-link[href='#previous']").click();
}

function markAllAsViewed() {
    document.getElementById("all-viewed").click();
}

function modifyPostSurroundings( post ) {
    let oldPostTitleBar = post.parentElement.querySelector("[data-parent='#accordion']");
    if(!oldPostTitleBar) {return;}
    oldPostTitleBar.outerHTML = `<span class="post-title-bar">${oldPostTitleBar.innerHTML}</span>`;
    let postTitleBar = post.parentElement.querySelector("span.post-title-bar");
    postTitleBar.insertAdjacentHTML("beforeend", `
<span>
<span class="just-here-to-make-parent-element-chains-consistent"><button class="hit-interface-button hit-source btn btn-xs btn-sm btn-default">Site</button></span>
<span style="float: right;">
<button class="hit-interface-button hit-info btn btn-xs btn-sm btn-default">?</button>
<button class="hit-interface-button hit-minimize btn btn-xs btn-sm btn-default">_</button>
<button class="hit-interface-button hit-close btn btn-xs btn-sm btn-danger">X</button>
</span>
</span>
`);
}

function replacePostContents( post ) {
    let parser = new MturkExportParser(post);
    let results = parser.getAllResults();

    if(results.gid) {
        if(processedGIDs[results.gid]) {
        }
        else {
            notifyIfReady(post, parser);
            processedGIDs[results.gid] = true;
        }
    }

    let oldTable = post.querySelector("table");

    if(!oldTable) {return;}

    oldTable.outerHTML = `
<div class="enhanced-post-contents" data-old-html-contents="${encodeURIComponent(oldTable.innerHTML)}">
<div class="title-line"><strong>Title:</strong> <span class="title-line-contents">${results.hitTitle || "No Title Found"}</span> <span class="gid-section">[<span class="gid-value">${results.gid}</span>]</span></div>
<div class="requester-line"><strong>Requester:</strong> <span class="requester-line-contents">${results.requesterName || "No Requester Name Found"}</span>${(results.rid ? ` <span class="rid-section">[<span class="rid-value">${results.rid}<span>]<span>`: "")}</div>
<div class="value-line"><strong>Value:</strong> <span class="hit-reward">$${Number(results.hitValue).toLocaleString("US", {minimumFractionDigits: 2})}</span> <span class="batch-or-survey-section">${(results.batchOrSurvey ? results.batchOrSurvey : "")}</span></div>
<div class="description-line"><strong>Description:</strong> <span class="description-line-contents">${results.hitDescription || "No Description Found"}</span></div>
<div class="links-line"><strong>Links:</strong> <a href="${parser.webPandaURL()}" target="_blank" title="Shift+Click to force to run only once. Ctrl+Click to open in background tab.">web+panda://</a> <span class="big-slash">/</span> <a href="https://worker.mturk.com/projects/${results.gid}/tasks/accept_random" target="_blank">Accept</a> <span class="big-slash">/</span> <a class="xhr-accept" href="javascript:void(0)" data-gid="${results.gid}">XHR</a> <span class="big-slash">/</span> <a href="https://worker.mturk.com/projects/${results.gid}/tasks?ref=w_pl_prvw" target="_blank">Preview</a></div>
<div class="status-text-for-gid-${results.gid}"></div>
</div>
`;
}

function showPostIfHidden( post ) {
    post.style.display = "block";
}

function openWebPandaInNewWindow(webPandaURL) {
    const WINDOW_NAME_NOT_NEEDED = undefined;

    window.open( webPandaURL, WINDOW_NAME_NOT_NEEDED,
                        `left=0,top=0,width=${WEB_PANDA_WINDOW_WIDTH},height=${WEB_PANDA_WINDOW_HEIGHT}` );
}

function handleNotificationClicked(webPandaURL, e) {

    if(e === true) {
        if(SHOULD_OPEN_NOTIFICATION_HITS_IN_BACKGROUND_TAB) {
            GM_openInTab( webPandaURL , SHOULD_OPEN_NOTIFICATION_HITS_IN_BACKGROUND_TAB);
        }
        else {
            openWebPandaInNewWindow(webPandaURL);
        }
    }
}

function notifyIfReady( post, parser ) {

    var results = parser.getAllResults();

    var webPandaURL = parser.webPandaURL();

    var notificationClickHandler = handleNotificationClicked.bind(unsafeWindow, webPandaURL);

    if(readyForNotifications) {
        GM_notification({
            title: ``,
            text: `TITLE: ${results.hitTitle}\n` +
            `REQUESTER: ${results.requesterName} [${results.rid}]\n` +
            `DESCRIPTION: ${results.hitDescription}\n` +
            `VALUE: $${Number(results.hitValue).toLocaleString("US", {minimumFractionDigits: 2})}`,
            timeout: 0,
            ondone: notificationClickHandler
        });
    }
}

function processPost( post ) {

    showPostIfHidden(post);
    replacePostContents(post);
    modifyPostSurroundings(post);
}

function toggleMinimizePost( post ) {

    if(post.style.display.includes("none")) {
        post.style.display = "block";
        return false;
    }
    else {
        post.style.display = "none";
        return true;
    }

}

function removePost( post ) { // Returns whether or not action was taken to remove an existing post.
    if(post) {
        post
            .parentElement
            .remove();
        return true;
    }
    else {return false;}

}

function processAllPosts() {
    let allWorkElements = document.querySelectorAll("div.accordion.bg-faded");
    allWorkElements.forEach( post => {
        processPost(post);
    });
}

function isALink(element) {
    return element && element.tagName && element.tagName.toLowerCase() === "a";
}

function getLastPageURLOfTodaysTurkerHubDailyThread() {
    return "https://turkerhub.com/forums/daily-mturk-hits-threads.2/";
}

function getLastPageURLOfTodaysMTCDailyThread() {
    return "https://www.mturkcrowd.com/forums/daily-work-threads.4/";
}

function getLastPageURLOfTodaysMturkForumDailyThread() {
    return "https://mturkforum.com/index.php?forums/great-hits.43/";
}

var handlers = {
    handleNavLinkClick: function(e) {
        processAllPosts();
    },

    handleWorkCapsuleClick: function(e) {
    },

    handleXHRClick: function(e) {
        acceptHitByGID(e.target.dataset.gid);
    },

    handleWebPandaClick: function(e) {

        e.preventDefault();

        let openInBackgroundTab = Boolean(e.ctrlKey);
        let insertOnceMetadata  = Boolean(e.shiftKey);

        const parsedInitialURL = new URL(e.target.href);

        let finalWebPandaURL = e.target.href;

        finalWebPandaURL = finalWebPandaURL + ( !parsedInitialURL.searchParams.get("once") && insertOnceMetadata ? "&once=true" : "" );

        if(openInBackgroundTab) {
            GM_openInTab( finalWebPandaURL, openInBackgroundTab);
        }
        else {
            openWebPandaInNewWindow(finalWebPandaURL);
        }
    },

    handleHITInterfaceButtonClick: function(e) {

        let post =
            e.target
        .parentElement
        .parentElement
        .parentElement
        .parentElement
        .querySelector("div.accordion.bg-faded");

        let titleBar = post.parentElement.querySelector("span.post-title-bar");

        if(e.target.className.includes("hit-info")) {
        }
        else if(e.target.className.includes("hit-minimize")) {
            toggleMinimizePost(post);
        }
        else if(e.target.className.includes("hit-close")) {
            removePost(post);
        }
        else if(e.target.className.includes("hit-source")) {
            let now = new Date();
            let month = now.getMonth();
            let dayOfMonth = now.getDate();

            let titleBarTextLowercase = titleBar.innerText.toLowerCase();
            let siteName = titleBarTextLowercase.match(/on ([A-Za-z/]+)/)[1];
            let openList = {
                "turkerhub": getLastPageURLOfTodaysTurkerHubDailyThread(),
                "mturkcrowd": getLastPageURLOfTodaysMTCDailyThread(),
                "mturkforum": getLastPageURLOfTodaysMturkForumDailyThread(),
                "/r/hitsworthturkingfor/": "https://www.reddit.com/r/HITsWorthTurkingFor/"
            };
            window.open( openList[siteName] );
        }
    }
};

function addEventListeners() {

    document.addEventListener("click", e => {
        if(e.target.dataset && e.target.dataset.parent && e.target.dataset.parent === "#accordion") {
            handlers.handleWorkCapsuleClick(e);
        }
        else if(e.target.className && e.target.className.includes("nav-link")) {
            handlers.handleNavLinkClick(e);
        }
        else if(e.target.dataset && e.target.dataset.gid) {
            handlers.handleXHRClick(e);
        }
        else if(e.target.tagName && e.target.tagName.toLowerCase() === "a") {
            if(e.target.href.startsWith("web+panda://")) {
                handlers.handleWebPandaClick(e);
            }
        }
        else if(e.target.tagName && e.target.tagName.toLowerCase() === "button" && e.target.className.includes("hit-interface-button")) {
            handlers.handleHITInterfaceButtonClick(e);
        }
    });
}

var mutationObserver = new MutationObserver(mutations => {

    for(let mutation of mutations) {
        if(mutation.addedNodes.length > 0) {
            for(let addedNode of mutation.addedNodes) {

                if(addedNode.tagName &&
                   addedNode.tagName.toLowerCase() === "div" &&
                   addedNode.classList &&
                   addedNode.className.includes("card")) {

                    let addedPost = addedNode.querySelector("div.accordion.bg-faded");

                    processPost(addedPost);
                }
            }
        }

        if(mutation.type === "attributes") {
            // Not needed... yet.
        }
    }
});

function startMutationObserver() {
    mutationObserver.observe(document.body, {childList: true, subtree: true, attributes: true});
}

function displayXHRStatusHTMLByGID(statusHTML, gid) {
    document.querySelectorAll(`div[class*="status-text-for-gid-${gid}"]`).forEach(matchingStatusDiv => {
        matchingStatusDiv.innerHTML = statusHTML;
    });
}

function logXHRResponse(logMessage, gid, isSuccessful) {
    displayXHRStatusHTMLByGID(`<span class="xhr-response">Last XHR Attempt (${new Date().toLocaleString()}): <span class="xhr-response-value${(isSuccessful ? " xhr-success" : " xhr-failure")}">${logMessage}</span></span>`, gid);
}

function handleLoggedOutResponse(response, parsedResponse, gid) {
    logXHRResponse("You're logged out of mTurk!", gid, false);
}

function handleCaptchaResponse(response, parsedResponse, gid) {
    logXHRResponse("Encountered a CAPTCHA!", gid, false);
}

function handleQueueFull(response, parsedResponse, gid) {
    logXHRResponse("Your queue is already full!", gid, false);
}

function handlePRE(response, parsedResponse, gid) {
    logXHRResponse("Too fast! Encountered a Page Request Error (PRE)!", gid, false);
}

function handleNoHITsAvailable(response, parsedResponse, gid) {
    logXHRResponse("No HITs available. Try again or move on.", gid, false);
}

function handleXHRHitAccepted(response, parsedResponse, gid) {
    logXHRResponse("Caught one!", gid, true);
}

function handleNotQualified(response, parsedResponse, gid) {
    logXHRResponse("You don't have the right qualifications to accept this HIT!", gid, false);
}

function handleXHRHitNotAccepted(response, parsedResponse, gid) {
    if(response.statusText === "Too Many Requests") {
        handlePRE(response, parsedResponse, gid);
    }
    else if(parsedResponse) {
        if(parsedResponse.message.startsWith("You have accepted the maximum number of HITs allowed at one time.")) {
            handleQueueFull(response, responseText, gid);
        }

        if(parsedResponse.message === "There are no more of these HITs available.") {
            handleNoHITsAvailable(response, parsedResponse, gid);
        }

        if(parsedResponse.message.startsWith("This Requester has specified Qualifications for this HIT.")) {
            handleNotQualified(response, parsedResponse, gid);
        }
    }
}

function handleXHRResponse(gid, response) {

    let parsedResponse;

    try {
        parsedResponse = JSON.parse(response.responseText);
    } catch(err) {
        handleLoggedOutResponse(response, parsedResponse, gid);
    }

    if(!parsedResponse) {return;}

    if(response.status === 200) {
        if(Boolean(parsedResponse.task_id)) {
            handleXHRHitAccepted(response, parsedResponse, gid);
        }
        else {
            handleCaptchaResponse(response, parsedResponse, gid);
        }
    }
    else {
        handleXHRHitNotAccepted(response, parsedResponse, gid);
    }
}

function acceptHitByGID(gid) {
    GM_xmlhttpRequest({
        method: "GET",
        url: `https://worker.mturk.com/projects/${gid}/tasks/accept_random`,
        headers: {
            Accept: "application/json"
        },
        onload: handleXHRResponse.bind(window, gid)
    });
}

function changeFavicon(src) {
    var link = document.createElement('link'),
        oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = src;
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
}

function main() {

    changeFavicon(SALEM_BEATS_ICON_URL);

    updateHeaderAndTitle();

    startRandomVersionNumberColorChanges();

    changeSiteStyles();

    gotoFullList();

    startMutationObserver();

    addEventListeners();

    processAllPosts();

    markAllAsViewed();

    modifyDonateButtons();

    setTimeout(() => readyForNotifications = true, DELAY_BEFORE_FIRST_NOTIFICATION_MS);

}

main();