// ==UserScript==
// @name        AtoZ Utilities DEV
// @namespace   AtoZ
// @author      AlienZombie [2176352]
// @credit      Jox [1714547] {For using various concepts and pieces of code to achieve my objectives}
// @description Utilities that are frequently used in other scripts.
// @version     1.0.0.29
// @source      https://greasyfork.org/en/scripts/404603-atoz-utilities
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==


initialize();

function initialize() {
    Number.prototype.format = function(n, x) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
    };
}

const localStorageAPIKey = "AtoZ_apikey";
const localStorageDKKAPIKey = "dkkutils_apikey";
const tornPlayerIdCookieName = "uid";

var Logging = {
    Identifier: "*** AtoZ ***",
    Debugging: {
        Active: false,
        Identifier: "*** AtoZ DEBUG ***"
    }
}

var thisScriptName = "Utilities";
var tornAPIKey = null;
var tornPlayerId = getCookie(tornPlayerIdCookieName);

//#region General Purpose
var setCheckbox = function(origin) {
    createDebugLog(thisScriptName, "setCheckbox", " origin Id: " + origin.target.id + " value" + origin.target.checked ? "1" : "0")
    localStorage.setItem(origin.target.id, origin.target.checked ? "1" : "0");
    //GM_setValue(origin.target.id, origin.target.checked ? "1" : "0");
};

var setText = function(origin) {
    createDebugLog(thisScriptName, "setText", " origin Id: " + origin.target.id + " value" + origin.target.value)
    localStorage.setItem(origin.target.id, origin.target.value);
    //GM_setValue(origin.target.id, origin.target.value);
};

function Startup(needAPI, activateDebugging) {
    if (!validateEmpty(needAPI) && needAPI) {
        if (validateEmpty(tornAPIKey)) {
            requestAPIKey();
        }
    }

    if (!validateEmpty(activateDebugging) && activateDebugging) {
        Logging.Debugging.Active = activateDebugging;
    }
}

function validateEmpty(value) {
    if (!value || value === undefined || value == "undefined" || value === null || value == "null" || value === ""){
        return true;
    }
    else {
        return false;
    }
}

function verifyJSONString(JSONString) {
    let response = {
        isError: null,
        errorName: null,
        errorMessage: null,
        content: null
    };

    let json = null;

    if (validateEmpty(JSONString)) {
        response.isError = true;
        response.errorName = "EmptyString";
        response.errorMessage = "The JSON string is empty.";
        return response;
    }
    try {
        json = JSON.parse(JSONString);
    } catch (e) {
        response.isError = true;
        response.errorName = e.errorName;
        response.errorMessage = e.errorMessage;
        return response;
    }

    response.isError = false;
    response.content = json;
    return response;
}

function observeMutationsFull(root, callback, options) {
    if (!options) options = {
        childList: true
    };

    new MutationObserver(callback).observe(root, options);
}

function observeMutations(root, selector, runOnce, callback, options, callbackRemoval) {
    var ran = false;
    observeMutationsFull(root, function(mutations, me) {
        var check = $(selector);

        if (check.length) {
            if (runOnce) me.disconnect();

            ran = true;
            callback(mutations, me);
        } else if (ran) {
            ran = false;
            if (callbackRemoval) callbackRemoval(mutations, me);
        }
    }, options);
}

function ajax(pageFilter, callback) {
    let funcName = "ajax";

    $(document).ajaxComplete((event, xhr, settings) => {
        if (xhr.readyState > 3 && xhr.status == 200) {
            if (settings.url.indexOf("torn.com/") < 0)
            settings.url = "torn.com" + (settings.url.startsWith("/") ? "" : "/") + settings.url;
            var page = settings.url.substring(settings.url.indexOf("torn.com/") + "torn.com/".length, settings.url.indexOf(".php"));

            if (pageFilter && (page == pageFilter)) {
                var json, uri;

                let verifyJSON = verifyJSONString(xhr.responseText);
                createDebugLog(thisScriptName, funcName, "Ajax Json verify response:");
                logDebugObject(verifyJSON);
                if (verifyJSON.isError) {
                    createDebugLog(thisScriptName, funcName, "JSON Error: " + verifyJSON.errorName + " - " + verifyJSON.errorMessage + " ResponseText: " + xhr.responseText);
                    uri = getUrlParams(xhr.responseText);
                } else if (verifyJSON.content.error) {
                    createDebugLog(thisScriptName, funcName, "ajax Error: " + verifyJSON.content.error.code)
                    uri = getUrlParams(xhr.responseText);
                } else {
                    json = verifyJSON.content;
                }
    
                callback(page, json, uri, xhr, settings);
            }

            return null;
        }
    });
}

function getUrlParams(url, prop) {
    var params = {};
    var search = decodeURIComponent(((url) ? url : window.location.href).slice(window.location.href.indexOf('?') + 1));
    var definitions = search.split('&');

    definitions.forEach(function(val, key) {
        var parts = val.split('=', 2);
        params[parts[0]] = parts[1];
    });

    return (prop && prop in params) ? params[prop] : params;
}


//#endregion General Purpose

//#region API Key

function validateAPIKey(apiKey) {
    let funcName = "validateAPIKey";

    if (validateEmpty(apiKey)) {
        if (validateEmpty(tornAPIKey)) {
            createDebugLog(thisScriptName, funcName, "[failure]: " + apiKey);
            return null;
        }
        else {
            apiKey = tornAPIKey;
        }
    }

    if (apiKey.length != 16) {
        createDebugLog(thisScriptName, funcName, "[failure]: " + apiKey);
        return null;
    }

    createDebugLog(thisScriptName, funcName, "[success]: " + apiKey);
    return apiKey;
}

function storeAPIKey(apiKey) {
    let funcName = "storeAPIKey";

    createDebugLog(thisScriptName, funcName, "Checking key for storage")
    let apiVar = validateAPIKey(apiKey);

    if (validateEmpty(apiVar)) {
        createDebugLog(thisScriptName, funcName, "[failure]: " + apiVar);
        localStorage.removeItem(localStorageAPIKey);
    }
    else{
        localStorage.setItem(localStorageAPIKey, apiVar);
        createDebugLog(thisScriptName, funcName, "[success]: " + apiVar);
    }

    tornAPIKey = apiVar;
}

function clearAPIKey() {
    localStorage.removeItem(localStorageAPIKey);
    tornAPIKey = null;
    createDebugLog(thisScriptName, "clearAPIKey", "User API Key removed.")
}

function retrieveAPIKey() {
    let funcName = "retrieveAPIKey";

    createDebugLog(thisScriptName, funcName, "Check for local API Key")
    let apiVar = validateAPIKey(localStorage.getItem(localStorageAPIKey));
    if (!validateEmpty(apiVar)) {
        createDebugLog(thisScriptName, funcName, "[success]: " + apiVar);
        return apiVar;
    }
    
    //Maybe the user has DKK scripts, so use that key instead:
    createDebugLog(thisScriptName, funcName, "No local key, trying DKK key")
    apiVar = validateAPIKey(localStorage.getItem(localStorageDKKAPIKey));
    if (!validateEmpty(apiVar)) {
        storeAPIKey(apiVar);
        return apiVar;
    }

    createDebugLog(thisScriptName, funcName, "[failure]:" + apiVar);
    return null
}

function requestAPIKey() {
    let funcName = "requestAPIKey";

    tornAPIKey = retrieveAPIKey();
    if (validateEmpty(tornAPIKey)) {
        createDebugLog(thisScriptName, funcName, "No api key")
        let response = prompt("Enter your API key for the AtoZ script(s) to work: ");
        tornAPIKey = validateAPIKey(response);
        if (!validateEmpty(tornAPIKey)) {
            createDebugLog(thisScriptName, funcName, "[VALID] key obtained from user: " + tornAPIKey)
            storeAPIKey(tornAPIKey);
        } else {
            createDebugLog(thisScriptName, funcName, "[INVALID] key obtained from user: " + tornAPIKey)
            alert("The key you entered is invalid.\nWithout it, this script cannot work.\nRefresh to try again.")
        }
    }
}

//#endregion API Key

//#region Logging

function createFatalLog(scriptName, functionName, errorMessage) {
    console.log(Logging.Debugging.Identifier, "!!! FATAL ERROR !!! [", scriptName, "] - [", functionName, "] - ", errorMessage);
    throw new FatalError(errorMessage);
}

function createDebugLog(scriptName, functionName, debugMessage) {
    if (!Logging.Debugging.Active) {
        return;
    }

    console.log(Logging.Debugging.Identifier, " [", scriptName, "] - [", functionName, "] - ", debugMessage);
}

function logDebugObject(object) {
    if (!Logging.Debugging.Active) {
        return;
    }

    console.log(JSON.parse(JSON.stringify(object)));
}

function createLog(scriptName, functionName, message) {
    console.log(Logging.Identifier, " [", scriptName, "] - [", functionName, "] - ", message);
}

function logObject(object) {
    console.log(JSON.parse(JSON.stringify(object)));
}

//#endregion Logging

//#region Torn API

var tornAPIParts = {
    User: {
        Key: "user",
        Selections: {
            Ammo: "ammo",
            Attacks: "attacks",
            AttacksFull: "attacksfull",
            Bars: "bars",
            Basic: "basic",
            BattleStats: "battlestats",
            Bazaar: "bazaar",
            Cooldowns: "cooldowns",
            Crimes: "crimes",
            Discord: "discord",
            Display: "display",
            Education: "education",
            Events: "events",
            Gym: "gym",
            Hof: "hof",
            Honors: "honors",
            Icons: "icons",
            Inventory: "inventory",
            JobPoints: "jobpoints",
            Medals: "medals",
            Merits: "merits",
            Messages: "messages", 
            Money: "money", 
            Networth: "networth",
            Notifications: "notifications",
            Perks: "perks",
            PersonalStats: "personalstats",
            Profile: "profile",
            Properties: "properties",
            ReceivedEvents: "receivedevents",
            Refills: "refills",
            Revives: "revives",
            RevivesFull: "revivesfull",
            Stocks: "stocks",
            Timestamp: "timestamp",
            Travel: "travel",
            WeaponExp: "weaponexp",
            WorkStats: "workstats"
        }
    },
    Properties: {
        Key: "property",
        Selections: null
    },
    Faction: {
        Key: "faction",
        Selections: null
    },
    Company: {
        Key: "company",
        Selections: null
    },
    ItemMarket: {
        Key: "market",
        Selections: null
    },
    Torn: {
        Key: "torn",
        Selections: null
    }
}

function tornAPIRequest(part, selections, key) {
    let funcName = "tornAPIRequest";

    createDebugLog(thisScriptName, funcName, `Torn API request for Part: ${part} Player Id: ${tornPlayerId} Selections: ${selections}`);
    if (validateEmpty(key)) {
         key = tornAPIKey;
    }

    return new Promise((resolve, reject) => {

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/${part}/${tornPlayerId}?selections=${selections}&key=${key}`,
            onreadystatechange: function(response) {
                if (response.readyState > 3 && response.status === 200) {
                    createDebugLog(thisScriptName, funcName, "Torn API response received: ")
                    logDebugObject(response);
                    let verifyJSON = verifyJSONString(response.responseText);
                    createDebugLog(thisScriptName, funcName, "Torn API Json verify response:");
                    logDebugObject(verifyJSON);
                    if (verifyJSON.isError) {
                        createDebugLog(thisScriptName, funcName, "JSON Error: " + verifyJSON.errorName + " - " + verifyJSON.errorMessage + " ResponseText: " + response.responseText);
                        reject("JSON Error", response.responseText);
                        return;
                    }

                    resolve(verifyJSON.content);

                    if (verifyJSON.content.error) {
                        createDebugLog(thisScriptName, funcName, "Torn API Error: " + verifyJSON.content.error.code)
                        if (verifyJSON.content.error.code == 2) {
                            clearAPIKey();
                        }
                    }
                }
            },
            onerror: function(errorResponse) {
                createDebugLog(thisScriptName, funcName, "httpRequest Error: " + errorResponse);
                reject('httpRequest error.');
            }
        })
    }).catch(err => {
        createDebugLog(thisScriptName, funcName, "Promise Error: " + err);
    });
}

//#endregion Torn API

//#region Generic API

function genericAPIRequest(destUrl, requestMethod) {
    let funcName = "genericAPIRequest";

    createDebugLog(thisScriptName, funcName, `API request to ${destUrl}`);

    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: requestMethod,
            url: destUrl,
            headers:    {'Cookie': document.cookie},
            onload:     function (respData) {
                console.log('*****GET Resp')
                logDebugObject(respData);

                //TODO: Parse response properly and send back at least the status code as well

                resolve(respData.responseText);
            },
            onerror: function(errorResponse) {
                console.log('*****GET Error', errorResponse);
                reject('httpRequest error.');
            }
        })
    }).catch(err => {
        createDebugLog(thisScriptName, funcName, "Promise Error: " + err);
    });
}

//#endregion Generic API


//#region Cookies

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//#endregion