// ==UserScript==
// @name            [Torn] OC Flight Warning
// @namespace       azraelkun
// @version         1.1
// @description     Adds a warning panel when trying to fly when an OC will be due before return
// @icon            https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @author          azraelkun
// @match           https://www.torn.com/page.php?sid=travel*
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_registerMenuCommand
// @connect         api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/532868/%5BTorn%5D%20OC%20Flight%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/532868/%5BTorn%5D%20OC%20Flight%20Warning.meta.js
// ==/UserScript==

'use strict';

// NOTE:
// 1. Requires Minimal API Key on Desktop. TornPDA will use the TornPDA key. This is used to get your OC time.
// 2. The extra time setting is the hours to add to the flight warning time. This is usefull when you usually
//    stay overseas for a while. For example if you set this to 1 it will warning you about flying
//    if you couldnt get back with 1 hour to spare before your OC.
//    Some recommended values are:
//    - 0.8 -> This will add extra time to cover a 45 min stay in hospital overseas if you get mugged
//    - 6 or 8 -> If you tend to sit overseas because you fall asleep or have work/school a larger
//      gap could be useful

// DO NOT CHANGE THIS
// DO NOT CHANGE THIS
var pdakey = '###PDA-APIKEY###';
var isPDA = pdakey[0] != '#';
// DO NOT CHANGE THIS
// DO NOT CHANGE THIS

var az_xmlhttpRequest = null;
var az_setValue = null;
var az_getValue = null;
var az_deleteValue = null
var az_registerMenuCommand = null;

if (isPDA) {
    console.log("[OCFlightWarning] Adding modifications to support TornPDA");
    az_xmlhttpRequest = (details) => {
        console.log("[OCFlightWarning] Attempting to make http request");
        if (details.method.toLowerCase() == "get") {
            return PDA_httpGet(details.url, details.headers ?? {})
                .then(details.onload)
                .catch(details.onerror ?? ((e) => console.error(e)));
        }
        else if (details.method.toLowerCase() == "post") {
            return PDA_httpPost(details.url, details.headers ?? {}, details.body ?? details.data ?? "")
                .then(details.onload)
                .catch(details.onerror ?? ((e) => console.error(e)));
        }
        else {
            console.log("What is this? " + details.method);
        }
    }
    az_setValue = (name, value) => {
        console.log("[OCFlightWarning] Attempting to set " + name);
        return localStorage.setItem(name, value);
    }
    az_getValue = (name, defaultValue) => {
        var value = localStorage.getItem(name) ?? defaultValue;
        console.log("[OCFlightWarning] Attempted to get " + name + " -> " + value);
        return value;
    }
    az_deleteValue = (name) => {
        console.log("[OCFlightWarning] Attempting to delete " + name);
        return localStorage.removeItem(name);
    }
    az_registerMenuCommand = (a, b) => {
        console.log("[OCFlightWarning] Disabling GM_registerMenuCommand");
    }
} else {
    console.log("[OCFlightWarning] Not in PDA so using GM commands");
    az_xmlhttpRequest = GM_xmlhttpRequest;
    az_setValue = GM_setValue;
    az_getValue = GM_getValue;
    az_deleteValue = GM_deleteValue;
    az_registerMenuCommand = GM_registerMenuCommand;
}

if (window.top === window.self) {
    var ocReadyAt = -1;
    var APIKEY = isPDA ? pdakey : az_getValue("ofw_public_key", null); // API Key
    var EXTRA_HOURS = az_getValue("ofw_extra_hours", "0.8"); // Extra time in hours

    az_registerMenuCommand('Enter Minimal API Key', () => {
        let userInput = prompt("Enter Minimal API Key", az_getValue('ofw_public_key', null));
        if (userInput !== null) {
            az_setValue('ofw_public_key', userInput);
            document.location.reload();
        }
    });
    az_registerMenuCommand('Enter Extra Hours', () => {
        let userInput = prompt("How many extra hours before OC to warn?\n(eg: 0.8 - mug protection | 6 or 8 - school/work)", az_getValue('ofw_extra_hours', "0.8"));
        if (userInput !== null) {
            az_setValue('ofw_extra_hours', userInput);
            EXTRA_HOURS = userInput;
        }
    });

    function buildWarningPanel() {
        // Construct the warning panel to be displayed
        var styleOptions = isPDA ? "line-height: 18px; padding: 27px 5px" : "line-height: 18px; padding: 14px 5px";
        var travelWarnDiv = Object.assign(document.createElement("div"), { className: "travel-warn", style: styleOptions });
        var textDiv = Object.assign(document.createElement("div"), { className: "text-center" });
        var textSpan = Object.assign(document.createElement("span"), { className: "bold t-orange" });

        textSpan.innerHTML = "!! WARNING OC WILL BE DUE BEFORE YOU RETURN !!<br/>Click to ignore";

        travelWarnDiv.append(textDiv);
        textDiv.append(textSpan);
        return travelWarnDiv
    }

    function parseFlightTime(nfoPanel) {
        // Extracts the flight time and converts it to seconds
        var a = nfoPanel.children[1].innerText.split("\n")[1].trim().split(":");
        var flightSecs = (+a[0]) * 60 * 60 + (+a[1]) * 60;
        flightSecs = (flightSecs * 2) * 1.03; // *2 for both directions, *1.03 for random 3% that can be added
        return flightSecs;
    }

    function getPanelsPDA(target) {
        // Get the correct panels and flight time on PDA
        var bg = target.querySelector("[class^=patternPanel]"); // Wrapper for background
        var confirm = target.querySelector("[class^=confirmPanel]"); // text and buttons

        var dest = target.parentNode.parentNode;
        var info = dest.querySelector("[class^=destinationDetails]"); // this is the info box with name, time, price

        return [bg, confirm, parseFlightTime(info)];
    }

    function getPanelsDesktop(target) {
        // Get the correct panels and flight time on Desktop
        return [
            target.parentNode, // Wrapper for background
            target, // This is the info box with name, time, price and button
            parseFlightTime(target),
        ];
    }

    function handleWarning(target) {
        // backgroundPanel - Background panel to insert warning panel on
        // confirmationPanel - Flight confirm panel to insert before and hide
        // flightSeconds - Flight time in seconds
        var [backgroundPanel, confirmationPanel, flightSeconds] = isPDA ? getPanelsPDA(target) : getPanelsDesktop(target);

        var warningPanel = buildWarningPanel();
        var currentTime = (getCurrentTimestamp() / 1000) | 0;
        console.log(`Flight time is: ${flightSeconds}s`);
        if ((currentTime + flightSeconds + (EXTRA_HOURS * 60 * 60)) >= ocReadyAt) {
            backgroundPanel.insertBefore(warningPanel, confirmationPanel);
            confirmationPanel.style.display = "none";
            $(warningPanel).on('click', () => {
                confirmationPanel.style.display = null;
                warningPanel.remove();
            })
        } else {
            warningPanel.remove();
        }

        return warningPanel;
    }

    function updateInfoBanner(error = null) {
        var banner = document.querySelector(".info-msg-cont");
        var msg = banner.querySelector(".msg");

        if (error === null) {
            if (APIKEY == null) {
                banner.classList.add("red");
                if (isPDA) {
                    msg.innerHTML = `<div>OC Flight Warning <span class="t-orange">[DISABLED]</span><br/>Minimal API Key required</div><span><strong>Settings:</strong></span>`;
                } else {
                    msg.innerHTML = `OC Flight Warning <span class="t-orange">[DISABLED]</span> Minimal API Key required &emsp; <strong>Settings:</strong>`;
                }
            } else {
                banner.classList.remove("red");
                if (isPDA) {
                    msg.innerHTML = `<div>OC Flight Warning <span class="t-green">[ENABLED]</span><br/>Warning with ${EXTRA_HOURS} extra hours</div><span><strong>Settings:</strong></span>`;
                } else {
                    msg.innerHTML = `OC Flight Warning <span class="t-green">[ENABLED]</span> Warning with ${EXTRA_HOURS} extra hours &emsp; <strong>Settings:</strong>`;
                }
            }
        } else {
            var errorStr = `Error: ${error.error}`;

            banner.classList.add("red");
            if (isPDA) {
                msg.innerHTML = `<div>OC Flight Warning <span class="t-orange">[DISABLED]</span><br/>${errorStr}</div><span><strong>Settings:</strong></span>`;
            } else {
                msg.innerHTML = `OC Flight Warning <span class="t-orange">[DISABLED]</span> ${errorStr} &emsp; <strong>Settings:</strong>`;
            }
        }

        function createButton(btn_id, btn_name) {
            return Object.assign(document.createElement("button"), {
                id: btn_id,
                textContent: btn_name,
                className: "torn-btn btn-small btn-transparent",
                style: "margin-right: 5px; vertical-align: initial",
            });
        }

        if (!isPDA) {
            var apiBtn = createButton("ofb-api-btn", "API Key");
            $(apiBtn).on('click', () => {
                const az_key = prompt("Enter Minimal API Key", az_getValue('ofw_public_key', ""));
                if (az_key) {
                    // Store the API key with az_setValue
                    az_setValue('ofw_public_key', az_key);
                    document.location.reload()
                }
            });
            msg.append(apiBtn);
        }

        var extrahrsBtn = createButton("ofb-extrahrs-btn", "Extra Hours");
        $(extrahrsBtn).on('click', () => {
            const az_hours = prompt("How many extra hours before OC to warn?\n(eg: 0.8 - mug protection | 6 or 8 - school/work)", az_getValue('ofw_extra_hours', "0.8"));
            if (az_hours) {
                // Store the API key with az_setValue
                az_setValue('ofw_extra_hours', az_hours);
                EXTRA_HOURS = az_hours;
                updateInfoBanner();
            }
        });
        msg.append(extrahrsBtn);

        banner.style.cursor = 'pointer'; // Change cursor to pointer
    }

    function waitForElem(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    console.log("[OCFlightWarning] Kicking off OCFlightWarning script");
    var banner = document.querySelector(".info-msg-cont");
    if (!banner.classList.contains("red")) {
        updateInfoBanner();
        if (APIKEY) {
            var oc_url = "https://api.torn.com/v2/user/organizedcrime?comment=OCFlightBlocker";

            az_xmlhttpRequest({
                method: "GET",
                url: oc_url,
                headers: {
                    "Authorization": `ApiKey ${APIKEY}`
                },
                onload: (r) => {
                    var resp = JSON.parse(r.responseText);

                    console.warn(resp);
                    if ('error' in resp) {
                        updateInfoBanner(resp.error);
                        return
                    }

                    var oc = resp.organizedCrime;
                    if (oc) {
                        if (oc.status == "Recruiting") {
                            var estimate = oc.slots.filter(x => x.user == null).length * 24*60*60;
                            var current = getCurrentTimestamp() / 1000 | 0;
                            ocReadyAt = Math.max(oc.ready_at, current) + estimate;
                        } else if (oc.status == "Planning") {
                            ocReadyAt = oc.ready_at;
                        }
                    }

                    if (ocReadyAt == -1) {
                        console.warn("[OCFlightWarning] Could not detect in progress OC - exiting.");
                        return
                    }
                    console.log(`[OCFlightWarning] OC ready at ${ocReadyAt} -> ${new Date(ocReadyAt * 1000).toLocaleString()}`);

                    var previousWarningPanel = null;
                    var observer = new MutationObserver((mutations) => {
                        //console.log(mutations);
                        for (const mutation of mutations) {
                            if (mutation.addedNodes.length == 0) {
                                continue;
                            }

                            if (isPDA && mutation.type === "childList" && mutation.addedNodes[0].id && mutation.addedNodes[0].id.startsWith("travel-country")) {
                                if (previousWarningPanel != null) { previousWarningPanel.click(); }
                                previousWarningPanel = handleWarning(mutation.addedNodes[0]);
                            } else if (!isPDA && mutation.type === "childList" && /^patternPanel|^segment/.test(mutation.target.className)) {
                                // Looking for the flightDetails wrapper to be added
                                if (mutation.target.className.startsWith("patternPanel")) {
                                    if (previousWarningPanel != null) { previousWarningPanel.click(); }
                                    previousWarningPanel = handleWarning(mutation.target.querySelector("[class^=flightDetailsGrid]"));
                                } else if (mutation.target.className.startsWith("segment")) {
                                    if (previousWarningPanel != null) { previousWarningPanel.click(); }
                                    previousWarningPanel = handleWarning(mutation.target.parentNode);
                                }
                            }
                        }
                    });

                    waitForElem("#travel-root").then((elem) => {
                        //console.log("travel-root loaded");
                        // Start observing
                        observer.observe(document.querySelector("#travel-root"), { //node target to observe
                            childList: true, //This is a must have for the observer with subtree
                            subtree: true, //Set to true if changes must also be observed in descendants.
                            //attributeFilter: ["aria-expanded"],
                        });
                    });
                },
                onerror: (e) => {
                    console.error('[OCFlightWarning] **** error ', e);
                },
            });
        }
    }
}
