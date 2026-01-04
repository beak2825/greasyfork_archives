// ==UserScript==
// @name         OutcomeDB
// @namespace    de.sabbasofa.outcomedb
// @version      2.4.1
// @description  Captures crime outcome, skill gain and target data for analysis
// @author       Hemicopter [2780600], Lazerpent [2112641]
// @match        https://www.torn.com/loader.php?sid=crimes*
// @match        https://torn.com/loader.php?sid=crimes*
// @match        https://www.torn.com/page.php?sid=crimes*
// @match        https://torn.com/page.php?sid=crimes*
// @grant        GM_xmlhttpRequest
// @connect      api.lzpt.io

// @downloadURL https://update.greasyfork.org/scripts/489750/OutcomeDB.user.js
// @updateURL https://update.greasyfork.org/scripts/489750/OutcomeDB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';
    const win = isTampermonkeyEnabled ? unsafeWindow : window;
    const {fetch: originalFetch} = win;
    let currentCrimesByTypeData;
    let serverTime = Math.floor(Date.now() / 1000);

    win.fetch = async (...args) => {
        if(args.length == 1) {
            return originalFetch(args[0]).then(response => detectCrimeDataRequest(args[0], response));
        } else if(args.length == 2) {
            return originalFetch(args[0], args[1]).then(response => detectCrimeDataRequest(args[0], response));
        }
    };
    registerCopyError();
    console.log("[OutcomeDB] Watching for crime.");

    function detectCrimeDataRequest(resource, response) {
        let outDB_url = typeof resource === "string" ? resource : resource.url;
        if(!(outDB_url.includes("sid=crimesData"))) return response;
        if (outDB_url.includes("step=attempt")) response.clone().text().then(async body => await handleCrimeAttempt(body, outDB_url));
        if (outDB_url.includes("step=crimesList")) response.clone().text().then(body => handleCrimesList(body, outDB_url));
        return response;
    }

    async function handleCrimeAttempt(body, resource) {
        console.log("[OutcomeDB] Found crime attempt.");

        //Most likely cloudflare turnstile or server error
        if(containsHtml(body)) {
            console.error("[OutcomeDB] Unexpected HTML data, skipping...");
            return;
        }

        try {
            let data = JSON.parse(body);
            if (data.error) {
                console.log("[OutcomeDB] Failed crime attempt: " + data.error);
                console.log(JSON.stringify(data));
                return;
            }
            if (!(data.DB && data.DB.outcome)) return;
            if(data.DB.outcome.result === "error") {
                console.log("[OutcomeDB] Failed crime attempt.");
                console.log(JSON.stringify(data));
                return;
            }
            console.log("[OutcomeDB] Found outcome.");
            console.log("[OutcomeDB] Preparing bundle.");
            serverTime = data.DB.time;
            let bundle = {};
            bundle.outcome = data.DB.outcome;
            bundle.typeID = resource.split("typeID=")[1].split("&")[0];
            bundle.crimeID = resource.split("crimeID=")[1].split("&")[0];

            bundle.skillBefore = getStat("Skill");
            bundle.skillAfter = data.DB.currentUserStatistics[0].value;
            bundle.progressionBonus = getStat("Progression bonus");

            if(!bundle.skillBefore || !bundle.skillAfter || !bundle.progressionBonus) return;

            bundle.additionalData = await getAdditionalData(data.DB.crimesByType, bundle.typeID, resource);
            console.log("[OutcomeDB] Ready to send bundle.", JSON.stringify(bundle));
            sendBundleToAPI(bundle);
            currentCrimesByTypeData = data.DB.crimesByType;

        } catch (e) {
            if(e instanceof SyntaxError) return;
            handleError("crime_attempt_parse", JSON.stringify({error: {message: e.message, stack: e.stack}, body: body}));
        }
    }

    function handleCrimesList(body, resource) {
        console.log("[OutcomeDB] Updating crimes data.");

        //Most likely cloudflare turnstile or server error
        if(containsHtml(body)) {
            console.error("[OutcomeDB] Unexpected HTML data, skipping...");
            return;
        }

        try {
            let data = JSON.parse(body);
            if (data.error) {
                console.log("[OutcomeDB] Failed crimesList: " + data.error);
                console.log(JSON.stringify(data));
                return;
            }
            if (!(data.DB && data.DB.crimesByType)) return;
            currentCrimesByTypeData = data.DB.crimesByType;
            serverTime = data.DB.time;

        } catch (e) {
            if(e instanceof SyntaxError) return;
            handleError("crime_list_parse", JSON.stringify({error: {message: e.message, stack: e.stack}, body: body}));
        }
    }

    function sendBundleToAPI(bundle) {

        let url = "https://api.lzpt.io/outcomedb";
        let headers = {"Content-Type": "application/json"};
        let data = JSON.stringify(bundle);

        //Use internal methods if GM_xmlhttpRequest is not registered. Should only ever happen on PDA
        if(tornPdaDidNotAddTheMethod()) {
            window.flutter_inappwebview.callHandler("PDA_httpPost", url, headers, data)
                .then(response => {
                if(!response) return; // because pda doesn't know how to network i guess
                if(containsHtml(response.responseText)) {
                    console.error("[OutcomeDB] lzpt rate limit hit, skipping...");
                    return;
                }
                console.log("[OutcomeDB] Bundle successfully sent to API:", response.responseText);

                const json = JSON.parse(response.responseText);
                if (json.error) {
                    handleError("post_invalid", JSON.stringify({error: {responseText: response.responseText}}));
                }
            })
                .catch(e => {
                if(!e.status || e.status === 0 || e.status === 408) return;
                handleError("api_post_error", JSON.stringify({error: {message: e.statusText, status: e.status, full: e}}));
            });
            return;
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: headers,
            data: data,
            onload: function (response) {
                if(!response) return; // because pda doesn't know how to network i guess
                if(containsHtml(response.responseText)) {
                    console.error("[OutcomeDB] lzpt rate limit hit, skipping...");
                    return;
                }
                console.log("[OutcomeDB] Bundle successfully sent to API:", response.responseText);

                const json = JSON.parse(response.responseText);
                if (json.error) {
                    handleError("post_invalid", JSON.stringify({error: {responseText: response.responseText}}));
                }
            },
            onerror: function (e) {
                if(!e.status || e.status === 0 || e.status === 408) return;
                handleError("api_post_error", JSON.stringify({error: {message: e.statusText, status: e.status, full: e}}));
            }
        });
    }

    function getStat(name) {
        let allStatisticButtons = Array.from(win.document.querySelectorAll('li[class^="statistic___"]'));

        let statButton = allStatisticButtons.find(button => {
            return Array.from(button.querySelectorAll('span')).some(span => span.textContent.trim() === name);
        });

        if (statButton) {
            let valueSpan = statButton.querySelector('span[class^="value___"]');
            if (valueSpan) {
                console.log(`[OutcomeDB] Found stat (${name}): '${valueSpan.textContent}'`);
                return valueSpan.textContent;
            }
        }
        handleError("stat_missing", JSON.stringify({stat: name}));
    }

    async function getAdditionalData(attemptData, typeID, resource) {
        try {
            if(typeID === "12") return extractScammingData(attemptData, resource);
            if(typeID === "13") return await extractArsonData(attemptData, resource);
            return null;

        } catch(error) {
            console.error("[OutcomeDB] Additional data failed, skipping:", error);
            return null;
        }
    }

    function handleError(name, data) {
        localStorage.setItem("outcomedb_last_error", JSON.stringify({type: name, data: data, timestamp: (Math.floor(Date.now() / 1000))}));
        console.error("[OutcomeDB] " + name + ":", data);
        alert("OutcomeDB error " + name + ". Please check console and report this to Hemicopter [2780600]");
    }

    function copyLastError() {
        let heading = win.document.querySelectorAll('h4[class^="heading___"]')[0];
        let content = localStorage.getItem("outcomedb_last_error");
        if (!content) return;
        navigator.clipboard.writeText(content);
        setTimeout(resetHeading, 1000, heading, heading.innerHTML);
        heading.innerHTML = "Copied successfully.";
    }

    function resetHeading(heading, text) {
        heading.innerHTML = text;
    }

    function registerCopyError() {
        let heading = win.document.querySelectorAll('h4[class^="heading___"]')[0];
        heading.addEventListener("click", copyLastError);
    }

    function containsHtml(text) {
        return text.includes("!DOCTYPE") || text.includes("!doctype") || text.includes("<html") || text.includes("<head") || text.includes("<body");
    }

    function tornPdaDidNotAddTheMethod() {
        return typeof GM_xmlhttpRequest === "undefined";
    }

    async function toUnique(data) {
        let salt = localStorage.getItem("outcomedb_salt");
        if (!salt) {
            salt = crypto.randomUUID();
            localStorage.setItem("outcomedb_salt", salt);
        }

        const message = salt + String(data); // Ensure data is a string
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(message);
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", encodedData);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

        return hashHex;
    }

    function extractScammingData(attemptData, resource) {
        if(!currentCrimesByTypeData) return null;

        //Is it linked to a target?
        if(!(resource.includes("value1"))) return null;
        let subID = resource.split("value1=")[1].split("&")[0];

        console.log("[OutcomeDB] Extracting additional scamming data.");

        //Get target states
        let beforeTargetState = currentCrimesByTypeData.targets.find((target) => {return String(target.subID).includes(subID);});
        let afterTargetState = attemptData.targets.find((target) => {return String(target.subID).includes(subID);});

        let additionalData = {};

        //target information
        additionalData.gender = beforeTargetState.gender? beforeTargetState.gender : afterTargetState.gender;
        additionalData.target = beforeTargetState.target? beforeTargetState.target : afterTargetState.target;

        //action information
        if(!beforeTargetState.bar) additionalData.action = "read";
        else if(!afterTargetState) additionalData.action = "capitalize";
        else additionalData.action = afterTargetState.lastAction;

        const transformBar = (bar) => {
            if (!bar) return null;
            const stateMapping = {
                "neutral": "n",
                "fail": "f",
                "low": "l",
                "medium": "m",
                "high": "h",
                "sensitivity": "s",
                "temptation": "t",
                "hesitation": "w",
                "concern": "c"
            };
            return bar.map(state => stateMapping[state] || '?').join('');
        };

        if (beforeTargetState) {
            additionalData.targetBefore = {
                "multiplierUsed": beforeTargetState.multiplierUsed,
                "pip": beforeTargetState.pip,
                "turns": beforeTargetState.turns,
                "bar": transformBar(beforeTargetState.bar)
            };
        }

        if (afterTargetState) {
            additionalData.targetAfter = {
                "multiplierUsed": afterTargetState.multiplierUsed,
                "pip": afterTargetState.pip,
                "turns": afterTargetState.turns,
                "bar": transformBar(afterTargetState.bar)
            };
            additionalData.cooldown = afterTargetState.cooldown ? Math.floor(afterTargetState.cooldown - serverTime) : null;
        }

        //targetAfter is missing on capitalize
        if(!additionalData.targetAfter) additionalData.targetAfter = {};

        console.log("[OutcomeDB] Additional data gathered.");
        return additionalData;
    }

    async function extractArsonData(attemptData, resource) {
        if(!currentCrimesByTypeData) return null;

        //Is it linked to a target?
        if(!(resource.includes("value1"))) return null;
        let subID = resource.split("value1=")[1].split("&")[0];

        console.log("[OutcomeDB] Extracting additional arson data.");

        //Get target state
        let beforeTargetState = currentCrimesByTypeData.targets.find((target) => {return String(target.subID).includes(subID);});
        let afterTargetState = attemptData.targets.find((target) => {return String(target.subID).includes(subID);});

        let additionalData = {};

        //target still exists
        if(afterTargetState) {
            additionalData.areasAmount = afterTargetState.areasAmount;
            additionalData.flamesPrefetch = afterTargetState.flamesPrefetch;
            additionalData.icons = afterTargetState.icons;
            additionalData.story = afterTargetState.story;
            additionalData.title = afterTargetState.title;
            additionalData.type = afterTargetState.type;
            additionalData.targetID = afterTargetState.targetID;
            additionalData.subID = await toUnique(subID);

            beforeTargetState ? additionalData.currentFlamesPrefetch = beforeTargetState.flamesPrefetch : additionalData.currentFlamesPrefetch = null;


        }
        // target does not exist anymore
        else if(beforeTargetState) {
            additionalData.flamesPrefetch = beforeTargetState.flamesPrefetch;
            additionalData.investigation = beforeTargetState.investigation;
            additionalData.subID = await toUnique(subID);
        }
        else {
            additionalData.unexpectedState = "report to hemicopter";
            additionalData.subID = await toUnique(subID);
        }
        console.log("[OutcomeDB] Additional data gathered.");
        return additionalData;
    }

})();
