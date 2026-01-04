// ==UserScript==
// @name        dont-touch-my-apikey-config
// @namespace   akm.torn.dtm-apikey-config
// @version     0.1
// @description configure apiKey for all script
// @author      Anonknee Moose
// @license     GNU GPLv3
// @run-at      document-end
// @match       https://www.torn.com/*
// @grant       GM_xmlhttpRequest
// @connect     tornstats.com
// License information: https://www.gnu.org/licenses/gpl-3.0.html
// License summary: You may copy, distribute and modify the software as long as you track changes/dates in source files. Any modifications to or software including (via compiler) GPL-licensed code must also be made available under the GPL along with build & install instructions.
// Usage request: Under this license you are not required to request access to use this software. You are free to use it as you see fit.
// Warranty: This software is provided as-is with no warranty or guarantee of support. Use at your own risk.
// The why: When this script was originally copied it was in the public domain under the same license
//          as the original author's other scripts. The original author has been actively trying to remove
//          this script from the internet. This script is being maintained to keep it available for users
//          who still find it useful. If the original author would like this script removed, please contact
//          Greasy Fork with a proper reason, and they will remove it if they see fit.
//          If you are the original author and would like to take over maintenance of this script, please
//          contact Greasy Fork, and they will transfer ownership to you with my prior consent.
//          If you are the original author and would like to discuss the license or any other matter, please
//          contact me through Greasy Fork and I will respond as soon as possible.
// Changes: The original script used the term "finally" which is a reserved word in JavaScript. This has been changed to "dtmb".
//
// ==/UserScript==

myAddStyle(`
    .dtmb-api-config {
        position: absolute;
        background: var(--main-bg);
        text-align: center;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

    .dtmb-api-config > * {
        margin: 0 5px;
        padding: 5px;
    }
`);

let apiKeyLib = localStorage["dtmb.torn.api"] || null;
let apiKeyCheck = false;

function JSONparse(str) {
    try { return JSON.parse(str); }
    catch (e) { console.log(e); }
    return null;
}

function checkApiKey(key, callb) {
    GM_xmlhttpRequest({
        method: "GET",
        url: `https://www.tornstats.com/api/v1/${key}`,
        onload: (resp) => {
            if (resp.status == 429) {
                callb("Couldn't check (rate limit)");
                return;
            }
            if (resp.status != 200) {
                callb(`Couldn't check (status code ${resp.status})`);
                return;
            }

            let j = JSONparse(resp.responseText);
            if (!j) {
                callb("Couldn't check (unexpected response)");
                return;
            }

            if (!j.status) {
                callb(j.message || "Wrong API key?");
            }
            else {
                apiKeyLib = key;
                localStorage["dtmb.torn.api"] = key;
                callb(true);
            }
        },
        onabort: () => callb("Couldn't check (aborted)"),
        onerror: () => callb("Couldn't check (error)"),
        ontimeout: () => callb("Couldn't check (timeout)")
    })
}

function addAPIKeyInput(node) {
    if (!node) return;
    if (document.getElementsByClassName("dtmb-api-config")[0]) return;

    node.style.position = "relative";

    let apiKeyNode = document.createElement("div");
    apiKeyNode.className = "text faction-names dtmb-api-config";
    apiKeyNode.style.display = (!apiKeyLib) ? "block" : "none";

    let apiKeyText = document.createElement("span");
    apiKeyText.innerHTML = ((!apiKeyLib) ? "Set" : "Update") + " your API key: ";

    let apiKeyInput = document.createElement("input");

    let apiKeySave = document.createElement("input");
    apiKeySave.type = "button";
    apiKeySave.value = "Save";

    let apiKeyClose = document.createElement("input");
    apiKeyClose.type = "button";
    apiKeyClose.value = "Close";
 
    apiKeyNode.appendChild(apiKeyText);
    apiKeyNode.appendChild(apiKeyInput);
    apiKeyNode.appendChild(apiKeySave);
    apiKeyNode.appendChild(apiKeyClose);

    function checkApiKeyCb(r) {
        if (r === true) {
            apiKeyNode.style.display = "none";
            apiKeyInput.value = "";
        } else {
            apiKeyNode.style.display = "block";
            apiKeyText.innerHTML = `${r}: `;
        }
    }

    apiKeySave.addEventListener("click", () => {
        apiKeyText.innerHTML = "Checking key";
        checkApiKey(apiKeyInput.value, checkApiKeyCb);
    });

    apiKeyClose.addEventListener("click", () => {
        apiKeyNode.style.display = "none";
    });

    let apiKeyButton = document.createElement("a");
    apiKeyButton.className = "t-clear h c-pointer  line-h24 right ";
    apiKeyButton.innerHTML = `
        <span>Update API Key</span>
    `;

    apiKeyButton.addEventListener("click", () => {
        apiKeyText.innerHTML = "Update your API key: ";
        apiKeyNode.style.display = "block";
    });

    if (node === nodeLink) node.appendChild(apiKeyButton);
    else if (node === nodeContent) node.querySelector("#top-page-links-list").appendChild(apiKeyButton);

    node.appendChild(apiKeyNode);

    if (apiKeyLib && !apiKeyCheck) {
        apiKeyCheck = true;
        checkApiKey(apiKeyLib, checkApiKeyCb);
    }
}

function myAddStyle(cssCode) {
    let style = document.createElement("style");
    style.innerHTML = cssCode;
    document.head.appendChild(style);
}

const nodeLink = document.querySelector("div[class^='titleContainer']")
const nodeContent = document.querySelector(".content-title")

if (nodeLink) addAPIKeyInput(nodeLink);
else if (nodeContent) addAPIKeyInput(nodeContent);