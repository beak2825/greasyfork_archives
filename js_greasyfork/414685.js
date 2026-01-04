// ==UserScript==
// @name         AtoZ Race Helper DEV
// @namespace    AtoZ
// @version      0.0.7
// @description  Numbers race tracks to assist in choosing car. (For now)
// @author       AlienZombie [2176352]
// @match        https://www.torn.com/loader.php?sid=racing*
// @require      https://greasyfork.org/scripts/404603-atoz-utilities-dev/code/AtoZ%20Utilities%20DEV.js?version=835155
// @source       https://greasyfork.org/en/scripts/404605-atoz-crime-blocker
// @downloadURL https://update.greasyfork.org/scripts/414685/AtoZ%20Race%20Helper%20DEV.user.js
// @updateURL https://update.greasyfork.org/scripts/414685/AtoZ%20Race%20Helper%20DEV.meta.js
// ==/UserScript==



Startup(false, true);

var thisScriptName = "Race Helper";

var raceTracks = [
{
    Id: 1,
    Name: "Uptown"
},
{
    Id: 2,
    Name: "Withdrawal"
},
{
    Id: 3,
    Name: "Underdog"
},
{
    Id: 4,
    Name: "Parkland"
},
{
    Id: 5,
    Name: "Docks"
},
{
    Id: 6,
    Name: "Commerce"
},
{
    Id: 7,
    Name: "Two Islands"
},
{
    Id: 8,
    Name: "Industrial"
},
{
    Id: 9,
    Name: "Vector"
},
{
    Id: 10,
    Name: "Mudpit"
},
{
    Id: 11,
    Name: "Hammerhead"
},
{
    Id: 12,
    Name: "Sewage"
},
{
    Id: 13,
    Name: "Meltdown"
},
{
    Id: 14,
    Name: "Speedway"
},
{
    Id: 15,
    Name: "Stone Park"
},
{
    Id: 16,
    Name: "Convict"
}];

var observer = new MutationObserver(observerCallback);
var raceContainerIdentifier = "div#racingAdditionalContainer";
var enlistedRaceIdentifier = "div.enlisted-btn-wrap";

startObserving();

function observerCallback(mutations, observer) {
    let funcName = "observerCallback"
    createDebugLog(thisScriptName, funcName, "Start");

    let enlistedRace = document.querySelector(enlistedRaceIdentifier);

    if (!validateEmpty(enlistedRace)) {
        createDebugLog(thisScriptName, funcName, "Car List Exists.")
        observer.disconnect();
        insertRaceId(enlistedRace);
    }
    createDebugLog(thisScriptName, funcName, "End");
}

function startObserving() {
    let funcName = "startObserving";
    createDebugLog(thisScriptName, funcName, "Start")

    let target = document.querySelector(raceContainerIdentifier);
    let config = { childList: true, subtree: true };

    observer.observe(target, config);

    createDebugLog(thisScriptName, funcName, "End")
}

function findRaceIndex(raceName) {
    let funcName = "findRaceIndex";
    createDebugLog(thisScriptName, funcName, "raceName: " + raceName);

    return raceTracks.find(r => (r.Name === raceName)).Id;
}

function insertRaceId(enlistedRace) {
    var enlistedText = enlistedRace.innerText;
    var raceName = enlistedText.replace(" - Official race", '');
    var raceIndex = findRaceIndex(raceName);
    enlistedRace.innerText = raceIndex + ' - ' + raceName;

    startObserving();
}