// ==UserScript==
// @name        BA Planner Enhancer
// @author      Dia
// @description Add some desirable functionality to BA Resource Planner
// @version     0.2.1
// @icon        https://i.imgur.com/oA2E4CJ.png
// @grant       none
// @match       https://justin163.com/planner/
// @namespace   wxw.moe/@dia
// @run-at      document-idle
// @license     Unlicense
// @downloadURL https://update.greasyfork.org/scripts/470886/BA%20Planner%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/470886/BA%20Planner%20Enhancer.meta.js
// ==/UserScript==

const MINIMUM_AUTOSAVE = 130000; //minimum required delay for autosave, do not change this
const DEBUG_MODE_AUTOSAVE = 30000; //30 sec autosave in debug mode (for debug only; does not actually save anything to cloud)
const DEBUG_MODE = false; //set to true to debug
const AUTOSAVE_PERIOD_OFFSET = 170000; //millisec delay to autosave to cloud so we don't overwhelm the api- this is added to MINIMUM_AUTOSAVE
const INCLUDE_LAST_UPDATED_TIME = true; //include last updated time to the save data
const KEY_LAST_UPDATED_TIME = "bapelastsaved";
const ID_ELEMENT_LAST_UPDATED_TIME = "bapelastsaved";
const JSON_SEP = ",";
const LANG_MAP = JSON.parse(
    "{" +
    '"En":"en-US"' + JSON_SEP +
    '"Kr":"ko-KR"' + JSON_SEP +
    '"Jp":"ja-JP"' + JSON_SEP +
    '"Tw":"zh-TW"' + JSON_SEP +
    '"Th":"th-TH"' + JSON_SEP +
    '"Id":"id-ID"' +
    "}"
);
const CLOUD_SAVE_ICON = "💾";

let isFirstTime = true;
let lastSaveExport = localStorage.getItem('save-data');
let autosaveFreq = MINIMUM_AUTOSAVE + AUTOSAVE_PERIOD_OFFSET;
let cloudLastUpdate;

function exec(fn) {
    let script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script); // run the script
    document.body.removeChild(script); // clean up
}
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
function log(msg) {
    let currTimestamp = String(new Date());
    let currTime = currTimestamp.split(" ")[4];
    console.log("[BAPE-" + currTime + "] " + msg);
}
function getTimestampFromJSON(inText){
    if(JSONHasTimestamp(inText)){
        let data = JSON.parse(inText);
        return data[KEY_LAST_UPDATED_TIME];
    }
    return null;
}
function JSONHasTimestamp(inText){
    try{
        let data = JSON.parse(inText);
        return data.hasOwnProperty(KEY_LAST_UPDATED_TIME);
    }
    catch (e){
        log("Cannot check if JSON has timestamp: " + e);
        return null;
    }
}
function removeSpacesFromJson(inText){
    try{
        return JSON.stringify(JSON.parse(inText));
    }
    catch(e){
        log("Cannot remove spaces from JSON: " + e);
        return null;
    }
}
function compareSaveData(data1, data2){
    data1 = removeSpacesFromJson(data1);
    data2 = removeSpacesFromJson(data2);
    let data1HasTimestamp = JSONHasTimestamp(data1);
    let data2HasTimestamp = JSONHasTimestamp(data2);
    if(data1HasTimestamp == data2HasTimestamp){
        return data1 === data2;
    }
    else{
        let data3, data4;
        if(data1HasTimestamp){
            data3 = data1;
            data4 = data2;
        }
        else{
            data3 = data2;
            data4 = data1;
        }
        try{
            let JSON3 = JSON.parse(data3);
            delete JSON3[KEY_LAST_UPDATED_TIME];
            data3 = JSON.stringify(JSON3);
            return data3 === data4;
        }
        catch(e){
            log("Cannot parse json to compare save data " + e);
            return null
        }
    }
}
function addTimestampToJSON(inText){
    try{
        var data = JSON.parse(inText);
        data[KEY_LAST_UPDATED_TIME] = new Date().getTime();
        return JSON.stringify(data);
    }
    catch (e){
        log("Cannot add timestamp to JSON: " + e);
        return null;
    }
}
function autoSave(isFirstTime) {
    let xferUsername = document.getElementById("input-transfer-username").value;
    let xferAuthkey = document.getElementById("input-transfer-authkey").value;
    let currTime = new Date();
    let currSaveExport = localStorage.getItem('save-data');
    log("Autosave fired");
    if (xferUsername == "" || xferAuthkey == "") {
        log("Cannot autosave to cloud because there's no username and/or authkey found - please login first")
    } else {
        if (compareSaveData(lastSaveExport, currSaveExport)) { //compare save data, ignoring timestamp if exists
            log("There are no changes to save. Skipping this round of autosave...");
        } else {
            log("Changes detected. Saving changes...");
            currSaveExport = addTimestampToJSON(currSaveExport);
            localStorage['save-data'] = currSaveExport;
            lastSaveExport = currSaveExport;
            if (DEBUG_MODE) {
                console.log("Saved to cloud (fake)");
            } else {
                exec(function() {
                    saveRequest(false);
                });
            }
            updateTimestampNavbar();
        }
    }
}

function autoSaveToCloud(autosaveFreq) {
    setInterval(function() {
        autoSave(isFirstTime); //currently isFirstTime does not affect anything - left for future use
        isFirstTime = false;
    }, autosaveFreq);
}

function loadImprovement() {
    let loadBtn = document.getElementById("transfer-load-button");
    loadBtn.onclick = ";";
    loadBtn.addEventListener("click", confirmLoad);
}

function confirmLoad() {
    if (confirm("Do you really want to load? This will overwrite any unsaved data!")) {
        exec(function() {
            return loadClick();
        });
    }
}
function reorderMats(){
    const dummyIdStr = "mat-zzz-";
    const dummyIdEnd = "-dummyid-";
    let resourceBox = document.getElementById('table-parent-1').parentNode;
    let table1 = document.getElementById('table-parent-1');
    let table2 = document.getElementById('table-parent-2');
    let table3 = document.getElementById('table-parent-3');
    let table4 = document.getElementById('table-parent-4');
    let table5 = document.getElementById('table-parent-5');
    resourceBox.insertBefore(table1, null); //put school resources after the artifacts
    let schoolResourceRows = table1.getElementsByTagName("tr");
    let artifactLeftRows = table2.getElementsByTagName("tr");
    let artifactRightRows = table3.getElementsByTagName("tr");
    let gearRows = table4.getElementsByTagName("tr");
    let ueRows = table5.getElementsByTagName("tr");
    if(schoolResourceRows.length > 0 && artifactLeftRows.length > 0 && artifactRightRows.length > 0 && gearRows.length > 0){
        clearInterval(reorderInterval);
        //blurays & notes
        for(let i=0;i<schoolResourceRows.length; i++){
            let colIds = [];
            let cols = schoolResourceRows[i].getElementsByTagName("td");
            for(let j=1; j<cols.length; j++){ //skip the first column because that's the "name" column
                if(!cols[j].id.startsWith("mat")){ //additional check to make sure that the column ids begin with 'mat' (the site broke it before)
                    cols[j].id = dummyIdStr + "sr-"+ i + "-" + j + dummyIdEnd + cols[j].id; //dummy id for sorting
                }
                colIds.push(cols[j].id);
            }
            colIds.sort();
            for(let j=0; j<colIds.length; j++){
                let sortingResource = document.getElementById(colIds[j]);
                schoolResourceRows[i].insertBefore(sortingResource, null);
                let dummyIdCheck = colIds[j].indexOf(dummyIdEnd);
                if(dummyIdCheck > 0){
                    sortingResource.id = sortingResource.id.substr(dummyIdCheck + dummyIdEnd.length, sortingResource.id.length - 1);
                }
            }
        }
        //do the same for artifact (left)
        for(let i=0; i<artifactLeftRows.length; i++){
            let colIds = [];
            let cols = artifactLeftRows[i].getElementsByTagName("td");
            for(let j=1; j<cols.length; j++){
                if(!cols[j].id.startsWith("mat")){
                    cols[j].id = dummyIdStr + "al-"+ i + "-" + j + dummyIdEnd + cols[j].id;
                }
                colIds.push(cols[j].id);
            }
            colIds.sort();
            for(let j=0; j<colIds.length; j++){
                let sortingResource = document.getElementById(colIds[j]);
                artifactLeftRows[i].insertBefore(sortingResource, null);
                let dummyIdCheck = colIds[j].indexOf(dummyIdEnd);
                if(dummyIdCheck > 0){
                    sortingResource.id = sortingResource.id.substr(dummyIdCheck + dummyIdEnd.length, sortingResource.id.length - 1);
                }
            }
        }
        //do the same for artifact (right)
        for(let i=0; i<artifactRightRows.length; i++){
            let colIds = [];
            let cols = artifactRightRows[i].getElementsByTagName("td");
            for(let j=1; j<cols.length; j++){
                if(!cols[j].id.startsWith("mat")){
                    cols[j].id = dummyIdStr + "ar-"+ i + "-" + j + dummyIdEnd + cols[j].id;
                }
                colIds.push(cols[j].id);
            }
            colIds.sort();
            for(let j=0; j<colIds.length; j++){
                let sortingResource = document.getElementById(colIds[j]);
                artifactRightRows[i].insertBefore(sortingResource, null);
                let dummyIdCheck = colIds[j].indexOf(dummyIdEnd);
                if(dummyIdCheck > 0){
                    sortingResource.id = sortingResource.id.substr(dummyIdCheck + dummyIdEnd.length, sortingResource.id.length - 1);
                }
            }
        }
        //do the same for gears
        for(let i=0; i<gearRows.length; i++){
            let colIds = [];
            let cols = gearRows[i].getElementsByTagName("td");
            for(let j=1; j<cols.length; j++){
                if(!cols[j].id.startsWith("mat")){
                    cols[j].id = dummyIdStr + "gr-"+ i + "-" + j + dummyIdEnd + cols[j].id;
                }
                colIds.push(cols[j].id);
            }
            colIds.sort();
            for(let j=0; j<colIds.length; j++){
                let sortingResource = document.getElementById(colIds[j]);
                gearRows[i].insertBefore(sortingResource, null);
                let dummyIdCheck = colIds[j].indexOf(dummyIdEnd);
                if(dummyIdCheck > 0){
                    sortingResource.id = sortingResource.id.substr(dummyIdCheck + dummyIdEnd.length, sortingResource.id.length - 1);
                }
            }
        }
        //do the same for ues
        //except we need to also exclude the last 2 columns, and they don't have id in <td>, only in the <p> inside them
        for(let i=0; i<ueRows.length; i++){
            let colIds = [];
            let cols = ueRows[i].getElementsByTagName("p");
            let anchors = [];
            for(let j=0; j<cols.length - 2; j++){
                if(!cols[j].id.startsWith("T")){
                    cols[j].id = dummyIdStr + "ue-"+ i + "-" + j + dummyIdEnd + cols[j].id;
                }
                colIds.push(cols[j].id);
                anchors[i] = cols[j].parentNode.nextElementSibling;
            }
            colIds.sort();
            for(let j=0; j<colIds.length; j++){
                let idResource = document.getElementById(colIds[j]);
                let sortingResource = idResource.parentNode;
                ueRows[i].insertBefore(sortingResource, anchors[i]);
                let dummyIdCheck = colIds[j].indexOf(dummyIdEnd);
                if(dummyIdCheck > 0){
                    idResource.id = idResource.id.substr(dummyIdCheck + dummyIdEnd.length, idResource.id.length - 1);
                }
            }
        }
    }
}
function init(){
    log("Document has finished loading. Starting the userscript...");
    if (DEBUG_MODE) {
        autosaveFreq = DEBUG_MODE_AUTOSAVE;
        log("Warning! This script is currently run with debug mode on. The autosave functionality does not actually save anything to cloud in this mode.")
        log("You can turn off the debug mode by setting DEBUG_MODE to false in the script and refresh the page!")
    }
    log("Autosave duration is currently every " + (autosaveFreq / 1000) + " seconds.")
    let navList = document.getElementsByClassName("nav-list")[0];
    let mobileList = document.getElementsByClassName("mobile-links")[0];
    let newLi = document.createElement("li");
    let newA = document.createElement("a");
    newA.className = "display-string " + ID_ELEMENT_LAST_UPDATED_TIME;
    newLi.appendChild(newA);
    navList.appendChild(newLi);
    mobileList.appendChild(newLi.cloneNode(true));
    let lastSaveTimestamp = getTimestampFromJSON(lastSaveExport);

    //wait for language options to be populated first
    waitForElm('#languages > option:nth-child('+languages.length+')').then((elm) => {
         updateTimestampNavbar();
    });
}
function updateTimestampNavbar(){
    let targetElements = document.getElementsByClassName(ID_ELEMENT_LAST_UPDATED_TIME);
    let lastSaveTimestamp = Number(getTimestampFromJSON(lastSaveExport));
    if (lastSaveTimestamp !== null){
        let dateFormat = new Date(lastSaveTimestamp);
        let localeFormat = "en-US"; //default
        if(LANG_MAP.hasOwnProperty(language)){ //language is global variable in common.js
            localeFormat = LANG_MAP[language];
        }
        for(let i=0; i<targetElements.length; i++){
            targetElements[i].innerHTML = CLOUD_SAVE_ICON + " " + dateFormat.toLocaleString(localeFormat);
        }
    }
    else{
        for(let i=0; i<targetElements.length; i++){
            targetElements[i].innerHTML = CLOUD_SAVE_ICON + " N/A";
        }
    }
}
init();

//feature #1: ask first if you really want to load from cloud, preventing accidental click that wipes local data
loadImprovement();
//feature #2: autosave every 5 minute (will not save if there are no changes)
autoSaveToCloud(autosaveFreq);
//feature #3: reorder resources to match how the game sorts them for convenience
let reorderInterval = setInterval(reorderMats, 1000);
//feature #4: updateTimestampNavbar(): add last-save timestamp to the nav bar - this is called in init() and autoSave()