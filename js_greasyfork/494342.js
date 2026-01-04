// ==UserScript==
// @name        apikey-config
// @namespace   seintz.torn.apikey-config
// @version     1.93
// @description configure apiKey for all script
// @author      seintz [2460991]
// @license     GNU GPLv3
// @run-at      document-end
// @match       https://www.torn.com/*
// @grant       GM_xmlhttpRequest
// @connect     tornstats.com
// @downloadURL https://update.greasyfork.org/scripts/494342/apikey-config.user.js
// @updateURL https://update.greasyfork.org/scripts/494342/apikey-config.meta.js
// ==/UserScript==

myAddStyle(`
    .finally-api-config {
        position: absolute;
        background: var(--main-bg);
        text-align: center;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

    .finally-api-config > * {
        margin: 0 5px;
        padding: 5px;
    }
`);

let apiKeyLib = localStorage["finally.torn.api"] || null;
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
                localStorage["finally.torn.api"] = key;
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
    if (document.getElementsByClassName("finally-api-config")[0]) return;

    node.style.position = "relative";

    let apiKeyNode = document.createElement("div");
    apiKeyNode.className = "text faction-names finally-api-config";
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

/*
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 420
{
    "status":false,
    "message":"Something wrong with the API Call.
        Error code: Your key is currently timed out.
        Please wait a few minutes before trying again."
}
*/

const nodeLink = document.querySelector("div[class^='titleContainer']")
const nodeContent = document.querySelector(".content-title")

if (nodeLink) addAPIKeyInput(nodeLink);
else if (nodeContent) addAPIKeyInput(nodeContent);
