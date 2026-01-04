// ==UserScript==
// @name         GBF Raidfinder | Viramate Web API Integration
// @namespace    http://fabulous.cupcake.jp.net
// @version      0.4.1
// @description  Join raids faster by utilizing Viramate Web API
// @author       FabulousCupcake
// @match        http://asuki.win
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/368504/GBF%20Raidfinder%20%7C%20Viramate%20Web%20API%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/368504/GBF%20Raidfinder%20%7C%20Viramate%20Web%20API%20Integration.meta.js
// ==/UserScript==

const DEBUG   = false;
const API_URL = "chrome-extension://fgpokpknehglcioijejfeebigdnbnokj/content/api.html";
let API_HOST;
let pendingRequests = {};
let nextRequestId = 1;


// Utilities
function log() {
    if (!DEBUG) return;
    var args = Array.prototype.slice.call(arguments);
    args.unshift("vm_webapi_integration>");
    console.log.apply(console, args);
}

function showSnackbar(message, timeout=1000) {
    const snackbarEl = document.querySelector(".mdl-snackbar");
    const data = { message, timeout };
    snackbarEl.MaterialSnackbar.showSnackbar(data);
}

function waitForElementToExist(selector, action) {
    var elm = document.querySelector(selector);
    if(elm !== null)
        action(elm);
    else
        setTimeout(waitForElementToExist.bind(null, selector, action), 1000);
}


// API Stuff
function sendApiRequest(request, callback) {
    let id = nextRequestId++;
    log(`Sending request #${id}`);
    request.id = id;
    pendingRequests[id] = callback;

    API_HOST.contentWindow.postMessage(
        request, "*"
    );
}

function tryJoinRaid(raidCode, cb) {
    const message = {
        type: "tryJoinRaid",
        raidCode
    };
    sendApiRequest(message, (result)=> {
        if(result) showSnackbar(result.replace("popup: ", ""));
        if (typeof cb === "function") cb(result);
    });
}

function tryGetVersion() {
    const message = {
        type: "getVersion"
    };
    sendApiRequest(message, (result) => {
        if (result) {
            showSnackbar(`Viramate ${result} API Loaded!`, 3000);
            findAndProcessRaidTweets();
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
    if (evt.data.type !== "result")
        return;

    if (evt.data.result && evt.data.result.error) {
        log("Request failed", evt.data.result.error);
    } else {
        log("Got request response", evt.data);
    }

    var callback = pendingRequests[evt.data.id];
    if (!callback)
        return;

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


// Raidfinder stuff
function findAndProcessRaidTweets() {
    // Add click event to all existing raid entries in the page
    const raids = document.querySelectorAll(".gbfrf-tweet");
    for (const raid of raids) {
        hookClickToJoin(raid);
    }

    // Add click event to all new raid entries
    const columns = document.querySelectorAll(".gbfrf-tweets");
    const config = { childList: true };
    const observer = new MutationObserver( mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                hookClickToJoin(node);
            }
        }
    });
    for (let column of columns) {
        observer.observe(column, config);
    }
}

function hookClickToJoin(el) {
    let raidCode = el.attributes["data-raidid"].value;
    el.addEventListener("click", (e) => {
        e.stopPropagation();
        tryJoinRaid(raidCode, (msg) => {
            switch(msg) {
                case "ok":
                    el.classList.add("gbfrf-tweet--copied");
                    break;
                case "popup: This raid battle is full. You can't participate.":
                    el.classList.add("gbfrf-tweet--copied");
                    break;
                case "popup: This raid battle has already ended.":
                    el.classList.add("gbfrf-tweet--copied");
                    break;
                case "already in this raid":
                    el.classList.add("gbfrf-tweet--copied");
                    break;
                default:
                    return;
            }
        });
    });
}


// Main
function init() {
    log("Initialized");
    waitForElementToExist(".mdl-list.gbfrf-tweets", main);
}

function main() {
    log("Executing main script");

    // Load Viramate Web API
    insertIframe();

    log("Main script finished executing");
}

init();