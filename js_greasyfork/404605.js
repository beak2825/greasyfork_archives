// ==UserScript==
// @name         AtoZ Crime Helper DEV
// @namespace    AtoZ
// @version      1.0.0.138
// @description  Blocks you from executing crimes. For example, only want to get to 5k drug crimes and not execute 5001 by mistake? This is for you.
// @author       AlienZombie [2176352]
// @match        https://www.torn.com/crimes.php*
// @require      https://greasyfork.org/scripts/404603-atoz-utilities-dev/code/AtoZ%20Utilities%20DEV.js?version=835155
// @connect      api.torn.com
// @connect      servicehub.online
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @source       https://greasyfork.org/en/scripts/404605-atoz-crime-blocker
// @downloadURL https://update.greasyfork.org/scripts/404605/AtoZ%20Crime%20Helper%20DEV.user.js
// @updateURL https://update.greasyfork.org/scripts/404605/AtoZ%20Crime%20Helper%20DEV.meta.js
// ==/UserScript==



//TODO: Handle API errors if too many requests causes API requests to be blocked.
//TODO: Implement caching and dirty checking to reduce API calls.



Startup(true, true);

var thisScriptName = "Crime Helper";

var crimeCounts = {
    auto_theft: null,
    computer_crimes: null,
    drug_deals: null,
    fraud_crimes: null,
    murder: null,
    other: null,
    selling_illegal_products: null,
    theft: null,
    total: null
}



// var crimeSettings = {
//     drugs: {
//         crimeType: "The title of the crime as it appears in the list of crimes on the crime page."
//         code: "Used as the ID for elements and localStorage"
//         enabled: Stores the value of the checkbox from the user settings
//         limit: Stores the value of the textbox from the user settings
//     }
// }

var crimeSettings = {
    drugs: {
        crimeType: "Transport drugs", 
        code: "drug_runs",
        enabled: false,
        limit: null
    }
}

var crimeTypes = [
    {
        crimeType: "Transport drugs", 
        tornCrimeCode: "docrime4",
    }
];

var disableListItem = { "pointer-events": "none", "opacity" : "0.6" };
var enableListItem = { "pointer-events": "", "opacity" : "" };
var crimesIdentifier = "ul.specials-cont";
var listIdentifier = "ul.item";
var listItemIdentifier = "li.bonus";
var buttonIdentifier = "div#try_again.btn button.torn-btn";
var tornToolIdentifier = "div.item[name ='cocaine'] div.text";
var intervalId;
var observer = new MutationObserver(observerCallback);

hitApi();

function hitApi() {
    let funcName = "hitAPI";
    createDebugLog(thisScriptName, funcName, "Start");

    genericAPIRequest("http://www.servicehub.online/AtoZBlacklist", "POST")
    .then(jsonResp => {
        createDebugLog(thisScriptName, funcName, " API Response: ");
        logDebugObject(jsonResp);
    }, reject => {
        createLog(thisScriptName, funcName, " Rejected API Response: " + reject);
        alert("There was a problem. Please refresh to try again.");
    })

    createDebugLog(thisScriptName, funcName, "End");
}

getCrimes();
startObserving();

function checkForUserCrimeSettings() {
    let funcName = "checkForUserCrimeSettings";
    createDebugLog(thisScriptName, funcName, "Start")

    let userCrimeSettings = $("#AtoZ_Crime_Helper");

    createDebugLog(thisScriptName, funcName, "User Crime Settings:");
    logDebugObject(userCrimeSettings);

    if (!userCrimeSettings.length) {
        createDebugLog(thisScriptName, funcName, "User Crime settings do not exist.")
        addUserCrimeSettings();
    }

    createDebugLog(thisScriptName, funcName, "End")
}

function addUserCrimeSettings() {
    let funcName = "addUserCrimeSettings";
    createDebugLog(thisScriptName, funcName, "Start");

    let crimeContent = $("div.content-wrapper");
    createDebugLog(thisScriptName, funcName, "Crime Content:");
    logDebugObject(crimeContent);

    if (crimeContent) {
        crimeContent.append(
            `
            <article id="AtoZ_Crime_Helper" style="margin-top:20px;">
                <div class="title-black top-round">AtoZ Crime Helper Settings</div>
                <div class="cont-gray10 bottom-round">
                    <div class="info-msg border-round">
                        <i class="info-icon"></i>
                        <div class="delimiter">
                            <div class="msg right-round" role="alert">
                                <p>Based on the settings below, the associated crime will be disabled.</p>
                                <p>If you plan on doing only 5k drug crimes, tick the box next to <span style="font-style: italic;">Disable "${crimeSettings.drugs.crimeType}" when reaching: </span> and enter 5000 into the box.</p>
                                <p>You will see a countdown showing your progress towards your goal and it will be disabled once you reach it.</p>
                                <p><span>NOTE:</span> This script depends on the TORN API and if the API is not available, or if you exceed your allowed requests, the scipt will fail to work.</p>
                                <p>In those cases it is your responsibility to track your crime progress.</p>
                                <p>The script will let you know if the API is failing.</p>
                            </div>
                        </div>
                    </div>
                    <section>
                        <input type="checkbox" id="${crimeSettings.drugs.code + "_enabled"}">
                        <label for="${crimeSettings.drugs.code + "_enabled"}">Disable <span style="font-style: italic;">${crimeSettings.drugs.crimeType}</span> when reaching:</label>
                        <input type="input" id="${crimeSettings.drugs.code + "_limit"}" style="width: 60px;">
                    </section>
                    <p style='font-size: 11px;margin-top: 10px;'>Created by: <a href='https://www.torn.com/profiles.php?XID=2176352' class='menu-value___2xqSF' target='blank'>AlienZombie [2176352]</a></p>
                </div>
            </article>
            `
            );
    }

    $(`#${crimeSettings.drugs.code + "_enabled"}`).prop("checked", (crimeSettings.drugs.enabled == "1" ? true : false) ).click(function (origin) {
        createDebugLog(thisScriptName, "setCheckbox", "Start");
        setCheckbox(origin);
        getCrimes();
        createDebugLog(thisScriptName, "setCheckbox", "End");
    });

    $(`#${crimeSettings.drugs.code + "_limit"}`).attr("value", crimeSettings.drugs.limit).change(function (origin) {
        createDebugLog(thisScriptName, "saveText", "Start");
        setText(origin);
        getCrimes();
        createDebugLog(thisScriptName, "saveText", "End");
    });

    createDebugLog(thisScriptName, funcName, "End");
}

function getSettings() {
    let funcName = "getSettings";
    createDebugLog(thisScriptName, funcName, "Start")

    crimeSettings.drugs.enabled = localStorage.getItem(crimeSettings.drugs.code + "_enabled");
    //GM_getValue(crimeSettings.drugs.code + ".enabled", null);
    createDebugLog(thisScriptName, funcName, "Retrieved " + crimeSettings.drugs.code + "_enabled : " + crimeSettings.drugs.enabled);
    crimeSettings.drugs.limit = localStorage.getItem(crimeSettings.drugs.code + "_limit");
    //GM_getValue(crimeSettings.drugs.code + ".limit", null);
    createDebugLog(thisScriptName, funcName, "Retrieved " + crimeSettings.drugs.code + "_limit : " + crimeSettings.drugs.limit);

    createDebugLog(thisScriptName, funcName, "End")
}

function getCrimes() {
    let funcName = "getCrimes";
    createDebugLog(thisScriptName, funcName, "Start")
    getSettings();

    tornAPIRequest(tornAPIParts.User.Key, tornAPIParts.User.Selections.Crimes)
    .then(jsonResp => {
        createDebugLog(thisScriptName, funcName, "Torn API Response:");
        logDebugObject(jsonResp);

        crimeCounts = jsonResp.criminalrecord;

        fuse();
    }, reject => {
        createLog(thisScriptName, funcName, "Rejected API Response:");
        logObject(reject);
        alert("There was a problem. Please refresh to try again.");
    });

    createDebugLog(thisScriptName, funcName, "End")
}

function observerCallback(mutations, observer) {
    let funcName = "observerCallback"
    createDebugLog(thisScriptName, funcName, "Start");

    let crimeList = document.querySelector(crimesIdentifier);
    let buttonElement = document.querySelector(buttonIdentifier);

    if (!validateEmpty(crimeList) || !validateEmpty(buttonElement)) {
        createDebugLog(thisScriptName, funcName, "Crime List Exists.")
        observer.disconnect();
        getCrimes();
    }
    createDebugLog(thisScriptName, funcName, "End");
}

function startObserving() {
    let funcName = "startObserving";
    createDebugLog(thisScriptName, funcName, "Start")

    let target = document.querySelector('div.content-wrapper');
    let config = { childList: true, subtree: true };

    observer.observe(target, config);

    createDebugLog(thisScriptName, funcName, "End")
}

function validateCrimeType(crimeType) {
    let funcName = "validateCrimeType";
    createDebugLog(thisScriptName, funcName, "Start")

    //This can probably be simplified by just checking if the text contains the actual crime type.
    let spanStartShortfallText = " : reached";
    let spanStartShortfall = crimeType.indexOf(spanStartShortfallText);
    createDebugLog(thisScriptName, funcName, "spanStartShortfall: " + spanStartShortfall);

    let spanStartExceededText = "left to reach";
    let spanStartExceeded = crimeType.indexOf(spanStartExceededText) - 5; //Take off an extra 5 characters to compensate for the first part of the text that's not in spanStartExceededText
    createDebugLog(thisScriptName, funcName, "spanStartExceeded: " + spanStartExceeded);

    let spanStart = Math.max(spanStartShortfall, spanStartExceeded);

    if (spanStart < 0) {
        return crimeType;
    }

    let retVal = crimeType.substring(0, spanStart).trim();

    createDebugLog(thisScriptName, funcName, "crimeType: " + retVal);

    createDebugLog(thisScriptName, funcName, "End")
    return retVal;
}

function applyFusion(crimeType, crimeElementParent, crimeElement) {
    let funcName = "applyFusion"
    createDebugLog(thisScriptName, funcName, "Start");

    if (validateEmpty(crimeType)) {
        createLog(thisScriptName, funcName, "crimeType is required!");
        return;
    }

    if (validateEmpty(crimeElementParent)) {
        createLog(thisScriptName, funcName, "crimeElementParent is required!");
        return;
    }

    if (validateEmpty(crimeElement)) {
        createLog(thisScriptName, funcName, "crimeElement is required!");
        return;
    }

    let thisCrimeIdentifier = null;
    let thisCrimeLimit = null;
    let thisCrimeCount = null;

    switch (crimeType) {
        case crimeSettings.drugs.crimeType:
            createDebugLog(thisScriptName, funcName, `Status: [${crimeSettings.drugs.enabled}]`)
            if (crimeSettings.drugs.enabled == "1") {
                createDebugLog(thisScriptName, funcName, `[${crimeType}] is enabled!`)
                thisCrimeIdentifier = crimeSettings.drugs.code;
                thisCrimeCount = crimeCounts.drug_deals;
                thisCrimeLimit = crimeSettings.drugs.limit;
            } else {
                createDebugLog(thisScriptName, funcName, `[${crimeType}] is disabled!`)
                $(`#AtoZ_${crimeSettings.drugs.code}`).remove();
                crimeElementParent.css(enableListItem);                            
            }
            break;
        // case "":
        //     break;
        default:
            createDebugLog(thisScriptName, funcName, `Unhandled Crime Type: [${crimeType}]`);
    }

    if (!validateEmpty(thisCrimeLimit) && !validateEmpty(thisCrimeCount)) {
        let thisDiff = thisCrimeLimit - thisCrimeCount
        let thisCrimeElement = $(`#AtoZ_${thisCrimeIdentifier}`);

        if (thisCrimeElement) {
            createDebugLog(thisScriptName, funcName, `removing crime helper element with text: ${$(thisCrimeElement).text().trim()}`)
            $(thisCrimeElement).remove();
        }

        if (thisDiff > 0) {
            crimeElement.html(`
            ${crimeType} <span id="AtoZ_${thisCrimeIdentifier}">: ${thisDiff} left to reach ${thisCrimeLimit}</span>
            `);
            crimeElementParent.css(enableListItem);
        } else {
            crimeElement.html(`
            ${crimeType} <span id="AtoZ_${thisCrimeIdentifier}">: reached ${thisCrimeCount}/${thisCrimeLimit}</span>
            `);
            crimeElementParent.css(disableListItem);
        }
    }

    createDebugLog(thisScriptName, funcName, "End");
}

function fuseList() {
    let funcName = "fuseList"
    createDebugLog(thisScriptName, funcName, "Start");

    let list = $(listIdentifier);

    list.each((index, crimeListElement) => {
        let crimeListRow = $(crimeListElement);

        crimeListRow.find(listItemIdentifier).each((index, rowListElement) => {
            let rowListItem = $(rowListElement);
            let crimeType = rowListItem.text().trim();

            if (!validateEmpty(crimeType)) {
                crimeType = validateCrimeType(crimeType);
                createDebugLog(thisScriptName, funcName, `Checking for crime type to append. [${crimeType}]`)
            }

            applyFusion(crimeType, crimeListRow.parent(), rowListItem);
        });
    });

    createDebugLog(thisScriptName, funcName, "End");
}

function tornCrimeCodeToCrimeType(tornCrimeCode) {
    let funcName = "tornCrimeCodeToCrimeType";
    createDebugLog(thisScriptName, funcName, "Start");

    for (let index = 0; index < crimeTypes.length; index++) {
        if (tornCrimeCode = crimeTypes[index].tornCrimeCode) {
            return crimeTypes[index].crimeType;
        }
    }

    createDebugLog(thisScriptName, funcName, `End - Couldn't find the crimeType for tornCrimeCode [${tornCrimeCode}]!`)
}

function retrieveCrimeTypeFromAction(tornAction) {
    let funcName = "retrieveAction";
    createDebugLog(thisScriptName, funcName, `Start - Finding the step for tornAction [${tornAction}]`);

    if (validateEmpty(tornAction)) {
        createLog(thisScriptName, funcName, "tornAction is required!");
        return;
    }

    let actionParam = "step=";
    let startIdx = tornAction.indexOf(actionParam);

    if (startIdx < 0) {
        createDebugLog(thisScriptName, funcName, `Couldn't find the step in the tornAction [${tornAction}] to determine the crimeType!`)
    }

    let tornCrimeCode = tornAction.substring(startIdx + actionParam.length);

    if (validateEmpty(tornCrimeCode)) {
        createDebugLog(thisScriptName, funcName, `Empty action in the step for the tornAction [${tornAction}] trying to determine the crimeType!`)
    }

    let crimeType = tornCrimeCodeToCrimeType(tornCrimeCode);
    createDebugLog(thisScriptName, funcName, `End - CrimeType found! [${crimeType}]`);
    return crimeType;
}

function fuseButton(buttonElement) {
    let funcName = "fuseButton";
    createDebugLog(thisScriptName, funcName, "Start");

    let buttonParent = buttonElement.parent().parent();

    if (!validateEmpty(buttonParent)) {
        let action = buttonParent.attr("action");
        let crimeType = retrieveCrimeTypeFromAction(action);

        applyFusion(crimeType, buttonParent, buttonElement)
    }

    createDebugLog(thisScriptName, funcName, "End");
}

function fuseTornTools(textElement) {
    let funcName = "fuseButton";
    createDebugLog(thisScriptName, funcName, "Start");

    let textParent = textElement.parent();

    if (!validateEmpty(textParent)) {
        let action = textParent.attr("action");
        let crimeType = retrieveCrimeTypeFromAction(action);

        applyFusion(crimeType, textParent, textElement)
    }

    createDebugLog(thisScriptName, funcName, "End");
}

function fuse() {
    let funcName = "fuse";
    createDebugLog(thisScriptName, funcName, "Start")

    checkForUserCrimeSettings();

    let listElement = document.querySelector(crimesIdentifier);
    let buttonElement = $(buttonIdentifier);

    //TornTools support
    let tornToolsElement = $(tornToolIdentifier);
    if (!validateEmpty(tornToolsElement)) {
        fuseTornTools(tornToolsElement);
    }


    if (!validateEmpty(listElement)) {
        fuseList();
    } else if (!validateEmpty(buttonElement)) {
        fuseButton(buttonElement);
    }

    startObserving();

    createDebugLog(thisScriptName, funcName, "End")
}
