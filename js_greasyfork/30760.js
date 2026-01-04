// ==UserScript==
// @name         GBF Raidfinder | Viramate Web API Integration
// @namespace    http://fabulous.cupcake.jp.net
// @version      0.6.0
// @description  Join raids faster by utilizing Viramate Web API
// @author       FabulousCupcake
// @include      /^https?:\/\/.+-raidfinder\.herokuapp\.com.*$/
// @include      /^https?:\/\/gbf-raidfinder\.aikats\.us.*$/
// @include      /^https?:\/\/gbf-raidfinder\.la-foret\.me.*$/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/30760/GBF%20Raidfinder%20%7C%20Viramate%20Web%20API%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/30760/GBF%20Raidfinder%20%7C%20Viramate%20Web%20API%20Integration.meta.js
// ==/UserScript==

const DEBUG = false;
const API_URL = "chrome-extension://fgpokpknehglcioijejfeebigdnbnokj/content/api.html";
let API_HOST;
let pendingRequests = {};
let messageId = 1;


// Utilities
function log(...args) {
    if (!DEBUG) return;
    console.debug("vm_webapi_integration »", ...args);
}

function showSnackbar(message, timeout=1000) {
    const snackbarEl = document.querySelector(".mdl-snackbar");
    const data = { message, timeout };

    snackbarEl.MaterialSnackbar.showSnackbar(data);
}

function waitForElementToExist(selector, action) {
    const elm = document.querySelector(selector);

    if (elm !== null) return action(elm);
    setTimeout(waitForElementToExist.bind(null, selector, action), 1000);
}

// API Stuff
function sendApiRequest(request, callback) {
    const message = {
        ...request,
        id: messageId,
    };

    log(`Sending request #${messageId}`);
    pendingRequests[messageId] = callback;
    API_HOST.contentWindow.postMessage(message, "*");
    messageId += 1
}

function tryJoinRaid(raidCode, cb) {
    const message = {
        type: "tryJoinRaid",
        raidCode
    };

    sendApiRequest(message, (result) => {
        if (result) showSnackbar(result.replace("popup: ", ""));
        if (typeof cb === "function") cb(result);
    });
}

function tryGetVersion() {
    const message = {
        type: "getVersion"
    };

    sendApiRequest(message, (result) => {
        if (result) {
            log("Viramate API loaded")
            hookExistingRaids();
            observeExistingColumns();
            observeNewColumns();
            showSnackbar(`Viramate ${result} API Loaded!`, 3000);
        } else {
            showSnackbar(`Viramate Web API is disabled. Please enable it in Viramate settings page!`, 5000);
        }
    });
}

function onApiLoaded() {
    log("Viramate iframe loaded");
    window.addEventListener("message", onApiMessage);
    tryGetVersion();
}

function onApiMessage(evt) {
    if (evt.data.type !== "result") return;

    if (evt.data.result && evt.data.result.error) {
        log("Request failed", evt.data.result.error);
    } else {
        log("Got request response", evt.data);
    }

    const callback = pendingRequests[evt.data.id];
    if (!callback) return;

    callback(evt.data.result);
    pendingRequests[evt.data.id] = null;
}

function insertIframe() {
    log("Loading Viramate API…");
    API_HOST = document.createElement("iframe");
    API_HOST.id    = "viramate_api_host";
    API_HOST.src   = API_URL;
    API_HOST.style = "display: none;";
    API_HOST.addEventListener("load", onApiLoaded);

    document.body.appendChild(API_HOST);
}


// DOM stuff
// Dim all raid entry with the same code
function dimRaids(raidCode) {
    const els = document.querySelectorAll(`li[data-raidid="${raidCode}"]`);
    els.forEach(el => {
        el.classList.add("gbfrf-tweet--copied");
    });
}

// Adds click event listener to `el`
function hookClickToJoin(el) {
    let raidCode = el.attributes["data-raidid"].value;
    el.addEventListener("click", (e) => {
        e.stopPropagation();
        tryJoinRaid(raidCode, (msg) => {
            switch(msg) {
            case "ok":
            case "popup: The number that you entered doesn't match any battle.":
            case "popup: This raid battle has already ended.":
            case "popup: This raid battle is full. You can't participate.":
            case "popup: This raid battle has already ended.":
            case "already in this raid":
                dimRaids(raidCode);
                break;
            default:
                return;
            }
        });
    });
}

// Adds click event listener to all existing raids in the page
function hookExistingRaids() {
    const raids = document.querySelectorAll(".gbfrf-tweet");

    raids.forEach(raid => hookClickToJoin(raid));
}

// Observes `el` for new raids and add click event listener to it
function observeNewRaids(raidColumnEl) {
    const tweets = raidColumnEl.querySelector(".gbfrf-tweets");
    const config = { childList: true };
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                hookClickToJoin(node);
            });
        });
    });

    log("Observing raids in column", raidColumnEl);
    observer.observe(tweets, config);
}

// Adds new raid observer to existing columns
function observeExistingColumns() {
    const columns = document.querySelectorAll(".gbfrf-column");

    columns.forEach(column => observeNewRaids(column));
}

// Adds new raid observer to new columns
function observeNewColumns() {
    const columns = document.querySelector('.gbfrf-columns');
    const config = { childList: true };
    const observer = new MutationObserver( mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                log("New column found");
                observeNewRaids(node);
            });
        });
    });

    log("Observing for new columns…");
    observer.observe(columns, config);
}


// Main
function init() {
    log("Initialized");
    waitForElementToExist(".mdl-list.gbfrf-tweets", insertIframe);
}

init();
