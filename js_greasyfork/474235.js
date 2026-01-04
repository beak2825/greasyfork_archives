// ==UserScript==
// @name        Papa's Save Manager
// @namespace   vaminta
// @match       https://www.coolmathgames.com/0-papas-bakeria
// @match       https://www.coolmathgames.com/0-papas-freezeria
// @match       https://www.coolmathgames.com/0-papas-burgeria
// @match       https://www.coolmathgames.com/0-papas-taco-mia
// @match       https://www.coolmathgames.com/0-papas-pancakeria
// @match       https://www.coolmathgames.com/0-papas-cupcakeria
// @match       https://www.coolmathgames.com/0-papas-cheeseria
// @match       https://www.coolmathgames.com/0-papas-wingeria
// @match       https://www.coolmathgames.com/0-papas-hot-doggeria
// @match       https://www.coolmathgames.com/0-papas-pastaria
// @match       https://www.coolmathgames.com/0-papas-sushiria
// @match       https://www.coolmathgames.com/0-papas-donuteria
// @match       https://www.coolmathgames.com/0-papas-scooperia
//
// @match       https://www.crazygames.com/game/papa-s-burgeria
// @match       https://www.crazygames.com/game/papas-bakeria
// @match       https://www.crazygames.com/game/papas-freezeria
// @match       https://www.crazygames.com/game/papas-taco-mia
// @match       https://www.crazygames.com/game/papas-pancakeria
// @match       https://www.crazygames.com/game/papas-cupcakeria
// @match       https://www.crazygames.com/game/papas-cheeseria
// @match       https://www.crazygames.com/game/papas-wingeria
// @match       https://www.crazygames.com/game/papas-hotdoggeria
// @match       https://www.crazygames.com/game/papas-pastaria
// @match       https://www.crazygames.com/game/papas-sushiria
// @match       https://www.crazygames.com/game/papas-donuteria
// @match       https://www.crazygames.com/game/papa-s-scooperia
//
// @match       https://papas-bakeria.game-files.crazygames.com/
// @match       https://papas-freezeria.game-files.crazygames.com/
// @match       https://papa-s-burgeria.game-files.crazygames.com/
// @match       https://papas-taco-mia.game-files.crazygames.com/
// @match       https://papas-pancakeria.game-files.crazygames.com/
// @match       https://papas-cupcakeria.game-files.crazygames.com/
// @match       https://papas-cheeseria.game-files.crazygames.com/
// @match       https://papas-wingeria.game-files.crazygames.com/
// @match       https://papas-pastaria.game-files.crazygames.com/
// @match       https://papas-sushiria.game-files.crazygames.com/
// @match       https://papas-donuteria.game-files.crazygames.com/
// @match       https://papa-s-scooperia.game-files.crazygames.com/
//
// @match       https://games.crazygames.com/en_US/papa-s-burgeria/index.html
// @match       https://games.crazygames.com/en_US/papas-freezeria/index.html
// @match       https://games.crazygames.com/en_US/papas-hotdoggeria/index.html
//
// @match       https://files.crazygames.com/*
// @grant       none
// @version     0.7.1
// @author      Vaminta
// @run-at      document-idle
// @description Allows you to backup your save data for the Papa's series of games online
// @homepageURL https://github.com/Vaminta/papas-save-manager
// @downloadURL https://update.greasyfork.org/scripts/474235/Papa%27s%20Save%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/474235/Papa%27s%20Save%20Manager.meta.js
// ==/UserScript==

//04/09/2023
//20/05/2024

psm = new Object();

/*
USER OPTIONS:

saveTxtExt: (bool) export outputs the file with .txt extension rather than .psm - same contents
forceImport: (bool) bypass validation checks (not recommended)
otherPageAdjustments: (bool) allows script to change other parts of webpage to fix potential problems
consoleOut: enables outputs to the console, useful for testing
preventGameLoad: (bool) attempts to prevent game loading, useful for internal testing

 */
psm.userOptions = {
    saveTxtExt: false,
    forceImport: false,
    otherPageAdjustments: false,
    consoleOut: false,
    preventGameLoad: false
}

// --------------

psm.version = "0.7.1";
psm.saveVersion = "003";
psm.savePrefix = "PSMS"; //PSM save
psm.saveExt = "psm";
psm.hostList = [
    {
        name: "Cool Math Games",
        hostname: "www.coolmathgames.com",
        saveIdentifier: "08",
        saveNameSignature: "cmg"
    },
    {
        name: "Crazy Games",
        hostname: "www.crazygames.com",
        saveIdentifier: "09",
        saveNameSignature: "cg"
    }
];
psm.gameList = Object.freeze([
    {
        name:"Papa's Bakeria",
        pathname: "/0-papas-bakeria",
        saveName: "papasbakeria_save",
        saveIdentifier: "08",
        hosts:[
            {
                hostname: "www.coolmathgames.com",
                pathname: "/0-papas-bakeria",
                lsKeys: ["//papasbakeria1","//papasbakeria2","//papasbakeria3"]
            },
            {
                hostname: "www.crazygames.com",
                pathname: "/game/papas-bakeria",
                lsKeys: ["files.crazygames.com//papasbakeria1","files.crazygames.com//papasbakeria2","files.crazygames.com//papasbakeria3"],
                makeIframe: ["psm-domain-iframe","https://papas-bakeria.game-files.crazygames.com/"],
                iframe: ["#psm-domain-iframe"]
            }
        ]
    },
    {
        name:"Papa's Freezeria",
        pathname: "/0-papas-freezeria",
        saveName: "papasfreezeria_save",
        saveIdentifier: "09",
        hosts:[
            {
                hostname: "www.coolmathgames.com",
                pathname: "/0-papas-freezeria",
                lsKeys: ["//papasfreezeria_1","//papasfreezeria_2","//papasfreezeria_3"]
            },
            {
                hostname: "www.crazygames.com",
                pathname: "/game/papas-freezeria",
                lsKeys: ["files.crazygames.com//papasfreezeria_1","files.crazygames.com//papasfreezeria_2","files.crazygames.com//papasfreezeria_3"],
                makeIframe: ["psm-domain-iframe","https://papas-freezeria.game-files.crazygames.com/"],
                iframe: ["#psm-domain-iframe"]
            }
        ]
    },
    {
        name:"Papa's Burgeria",
        pathname: "/0-papas-burgeria",
        saveName: "papasburgeria_save",
        saveIdentifier: "10",
        hosts:[
            {
                hostname: "www.coolmathgames.com",
                pathname: "/0-papas-burgeria",
                lsKeys: ["//papasburgeria_1","//papasburgeria_2","//papasburgeria_3"]
            },
            {
                hostname: "www.crazygames.com",
                pathname: "/game/papa-s-burgeria",
                lsKeys: ["files.crazygames.com//papasburgeria_1","files.crazygames.com//papasburgeria_2","files.crazygames.com//papasburgeria_3"],
                makeIframe: ["psm-domain-iframe","https://papa-s-burgeria.game-files.crazygames.com/"],
                iframe: ["#psm-domain-iframe"]
            }
        ]
    },
    {
        name:"Papa's Taco Mia",
        pathname: "/0-papas-taco-mia",
        saveName: "papastacomia_save",
        saveIdentifier: "11",
        hosts:[
            {
                hostname: "www.coolmathgames.com",
                pathname: "/0-papas-taco-mia",
                lsKeys: ["//papastaqueria_1","//papastaqueria_2","//papastaqueria_3"]
            },
            {
                hostname: "www.crazygames.com",
                pathname: "/game/papas-taco-mia",
                lsKeys: ["files.crazygames.com//papastaqueria_1","files.crazygames.com//papastaqueria_2","files.crazygames.com//papastaqueria_3"],
                makeIframe: ["psm-domain-iframe","https://papas-taco-mia.game-files.crazygames.com/"],
                iframe: ["#psm-domain-iframe"]
            }
        ]
    },
    {
        name:"Papa's Pancakeria",
        pathname: "/0-papas-pancakeria",
        saveName: "papaspancakeria_save",
        saveIdentifier: "12",
        hosts:[
            {
                hostname: "www.coolmathgames.com",
                pathname: "/0-papas-pancakeria",
                lsKeys: ["//papaspancakeria_1","//papaspancakeria_2","//papaspancakeria_3"]
            },
            {
                hostname: "www.crazygames.com",
                pathname: "/game/papas-pancakeria",
                lsKeys: ["files.crazygames.com//papaspancakeria_1","files.crazygames.com//papaspancakeria_2","files.crazygames.com//papaspancakeria_3"],
                makeIframe: ["psm-domain-iframe","https://papas-pancakeria.game-files.crazygames.com/"],
                iframe: ["#psm-domain-iframe"]
            }
        ]
    },
    {
        name:"Papa's Cupcakeria",
        pathname: "/0-papas-cupcakeria",
        saveName: "papascupcakeria_save",
        saveIdentifier: "13",
        hosts:[
            {
                hostname: "www.coolmathgames.com",
                pathname: "/0-papas-cupcakeria",
                lsKeys: ["//papascupcakeria1","//papascupcakeria2","//papascupcakeria3"]
            },
            {
                hostname: "www.crazygames.com",
                pathname: "/game/papas-cupcakeria",
                lsKeys: ["files.crazygames.com//papascupcakeria1","files.crazygames.com//papascupcakeria2","files.crazygames.com//papascupcakeria3"],
                makeIframe: ["psm-domain-iframe","https://papas-cupcakeria.game-files.crazygames.com/"],
                iframe: ["#psm-domain-iframe"]
            }
        ]
    },
    {
        name:"Papa's Cheeseria",
        pathname: "/0-papas-cheeseria",
        saveName: "papascheeseria_save",
        saveIdentifier: "14",
        hosts:[
            {
                hostname: "www.coolmathgames.com",
                pathname: "/0-papas-cheeseria",
                lsKeys: ["//papascheeseria1","//papascheeseria2","//papascheeseria3"]
            },
            {
                hostname: "www.crazygames.com",
                pathname: "/game/papas-cheeseria",
                lsKeys: ["files.crazygames.com//papascheeseria1","files.crazygames.com//papascheeseria2","files.crazygames.com//papascheeseria3"],
                makeIframe: ["psm-domain-iframe","https://papas-cheeseria.game-files.crazygames.com/"],
                iframe: ["#psm-domain-iframe"]
            }
        ]
    },
    {
        name:"Papa's Wingeria",
        saveName: "papaswingeria_save",
        saveIdentifier: "15",
        hosts:[
            {
                hostname: "www.coolmathgames.com",
                pathname: "/0-papas-wingeria",
                lsKeys: ["//papaswingeria_1","//papaswingeria_2","//papaswingeria_3"]
            },
            {
                hostname: "www.crazygames.com",
                pathname: "/game/papas-wingeria",
                lsKeys: ["files.crazygames.com//papaswingeria_1","files.crazygames.com//papaswingeria_2","files.crazygames.com//papaswingeria_3"],
                makeIframe: ["psm-domain-iframe","https://papas-wingeria.game-files.crazygames.com/"],
                iframe: ["#psm-domain-iframe"]
            }
        ]
    },
    {
        name:"Papa's Hot Doggeria",
        saveName: "papashotdoggeria_save",
        saveIdentifier: "16",
        hosts:[
            {
                hostname: "www.coolmathgames.com",
                pathname: "/0-papas-hot-doggeria",
                lsKeys: ["//papashotdoggeria1","//papashotdoggeria2","//papashotdoggeria3"]
            },
            {
                hostname: "www.crazygames.com",
                pathname: "/game/papas-hotdoggeria",
                lsKeys: ["//papashotdoggeria1","//papashotdoggeria2","//papashotdoggeria3"],
                iframe: ["#game-iframe"]
            }
        ]
    },
    {
        name:"Papa's Pastaria",
        saveName: "papaspastaria_save",
        saveIdentifier: "17",
        hosts:[
            {
                hostname: "www.coolmathgames.com",
                pathname: "/0-papas-pastaria",
                lsKeys: ["//papaspastaria1","//papaspastaria2","//papaspastaria3"]
            },
            {
                hostname: "www.crazygames.com",
                pathname: "/game/papas-pastaria",
                lsKeys: ["files.crazygames.com//papaspastaria1","files.crazygames.com//papaspastaria2","files.crazygames.com//papaspastaria3"],
                makeIframe: ["psm-domain-iframe","https://papas-pastaria.game-files.crazygames.com/"],
                iframe: ["#psm-domain-iframe"]
            }
        ]
    },
    {
        name:"Papa's Sushiria",
        saveName: "papassushiria_save",
        saveIdentifier: "18",
        hosts:[
            {
                hostname: "www.coolmathgames.com",
                pathname: "/0-papas-sushiria",
                lsKeys: ["//papassushiria1","//papassushiria2","//papassushiria3"]
            },
            {
                hostname: "www.crazygames.com",
                pathname: "/game/papas-sushiria",
                lsKeys: ["files.crazygames.com//papassushiria1","files.crazygames.com//papassushiria2","files.crazygames.com//papassushiria3"],
                makeIframe: ["psm-domain-iframe","https://papas-sushiria.game-files.crazygames.com/"],
                iframe: ["#psm-domain-iframe"]
            }
        ]
    },
    {
        name:"Papa's Donuteria",
        saveName: "papasdonuteria_save",
        saveIdentifier: "19",
        hosts:[
            {
                hostname: "www.coolmathgames.com",
                pathname: "/0-papas-donuteria",
                lsKeys: ["//papasdonuteria1","//papasdonuteria2","//papasdonuteria3"]
            },
            {
                hostname: "www.crazygames.com",
                pathname: "/game/papas-donuteria",
                lsKeys: ["files.crazygames.com//papasdonuteria1","files.crazygames.com//papasdonuteria2","files.crazygames.com//papasdonuteria3"],
                makeIframe: ["psm-domain-iframe","https://papas-donuteria.game-files.crazygames.com/"],
                iframe: ["#psm-domain-iframe"]
            }
        ]
    },
    {
        name:"Papa's Scooperia",
        saveName: "papasscooperia_save",
        saveIdentifier: "20",
        hosts:[
            {
                hostname: "www.coolmathgames.com",
                pathname: "/0-papas-scooperia",
                lsKeys: ["//papasscooperiahd1","//papasscooperiahd2","//papasscooperiahd3"]
            },
            {
                hostname: "www.crazygames.com",
                pathname: "/game/papa-s-scooperia",
                lsKeys: ["files.crazygames.com//papasscooperiahd1","files.crazygames.com//papasscooperiahd2","files.crazygames.com//papasscooperiahd3"],
                makeIframe: ["psm-domain-iframe","https://papa-s-scooperia.game-files.crazygames.com/"],
                iframe: ["#psm-domain-iframe"]
            }
        ]
    }
]);

psm._idCount = 0;
psm.newID = () => {psm._idCount++; return psm._idCount};

psm.cout = (message) => {if(psm.userOptions.consoleOut) console.log(message)};

psm.lsCallbacks = [];
// [id,callback,date]
psm.game = null;
psm.gameHost = null;
psm.hostDetails = null;

const pbsmCSS = `
.pbsm-imp-button, .pbsm-exp-button{
    background-color: #1d3752;
    color: #ffffff;
    border: 1px #06203b solid;
    border-radius: 5px;
    width: 70px;
    height: 30px;
}

.pbsm-imp-button:hover, .pbsm-exp-button:hover{
    background-color: #2d4762;
}

.crazygamesCont {
    border: 2px white solid;
    padding: 3%;
    border-radius: 10px;
    margin-top: 1%;
    position: relative;
}

.hidden {
    display:none;
}
`;

function injectCSS(css){
    let styleE = document.createElement("style");
    styleE.innerText = css;
    document.head.appendChild(styleE);
}

//not working as of 0.4.0 (not async compat)
function slotHasSave(slot){
    return false;
    let result = false;
    const data = localStorage.getItem(psm.game.lsKeys[slot]);
    if(data!=null&&data.length>20) result = true;
    return result;
}

//Generic download function
function download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function exportSave(slot){
    getSlot(slot,function(e){
        const data = psm.savePrefix + psm.saveVersion + psm.game.saveIdentifier + psm.hostDetails.saveIdentifier + e;
        if(!e){
            alert("No save in slot " + (slot+1) + " detected!");
            return;
        }
        const filename = psm.game.saveName + "_" + psm.hostDetails.saveNameSignature + "." + psm.saveExt;
        download(filename,data);
    });

}

function upgradeSave(data){
    const saveVersion = data.slice(4,7);
    let upgradedSave = "";
    if(saveVersion == "001"){
        let header = data.slice(0,9);
        let body = data.slice(9);
        header += "08"; //version 1 only supported cmg; must be on cmg
        upgradedSave = header+body;
    }
    console.log("upgraded save");
    return upgradedSave;
}

//Checks content of PSM for validity and returning results as object containing breakdown, useful for providing user feedback
function isValidSave(data,expGameID){
    if(!data)data = "";
    if(!expGameID) expGameID = psm.game.saveIdentifier;
    let result = {
        isNotEmpty: data.length>0 ? true : false,
        isPSMS: data.slice(0,4)==psm.savePrefix ? true : false,
        isNotTimeTraveller: parseInt(data.slice(4,7)) <= parseInt(psm.saveVersion) ? true : false, //save isn't from future version of psm
        isCorrectGame: (expGameID=="*" || data.slice(7,9) == psm.game.saveIdentifier) ? true : false,
        isSupportedHost: (data.slice(9,11)==psm.hostDetails.saveIdentifier) ? true : false,
        isEncoded: true, //implement later
        conclusion: false
    };
    result.conclusion = (result.isNotEmpty && result.isPSMS && result.isNotTimeTraveller && result.isCorrectGame && result.isSupportedHost && result.isEncoded) ? true : false;
    return result;
}

function processImport(slot,data){
    const saveVersion = data.slice(4,7);
    if(saveVersion=="001") data = upgradeSave(data);
    const fileValidity = isValidSave(data);
    const forceLoad = psm.userOptions.forceImport;
    if(fileValidity.conclusion || forceLoad){ //continue to load
        const importData = data.slice(11);
        setSlot(slot,importData);
    }
    else{ // do not load -> show error
        let errorMsg = "PSM Import Error: \n\n";
        if(!fileValidity.isNotEmpty) errorMsg += " - File is empty\n";
        else if(!fileValidity.isPSMS) errorMsg += " - File is unrecognised format\n";
        else{
            if(!fileValidity.isNotTimeTraveller) errorMsg += " - File was exported from a future version of PSM, please update\n";
            if(!fileValidity.isCorrectGame) errorMsg += " - File appears to be for a different Papa's series game\n";
            if(!fileValidity.isSupportedHost) errorMsg += " - Save data is for a different host\n"
        }
        errorMsg += "\nFurther information and help may be found on GitHub";
        alert(errorMsg);
    }
}

// Setup file reader then send output to processImport
function importSave(slot){
    if(slotHasSave(slot)){
        let overwrite = confirm("There is already data in slot " + (slot+1) + ". Are you sure you want to overwrite?");
        if(!overwrite) return;
    }
    const file = document.getElementById("file-picker").files[0];
    const reader = new FileReader();
    reader.addEventListener("load",function(){
        processImport(slot,reader.result);
    },false,);
    if(file) reader.readAsText(file);
}

/*
Handles button clicks from the import and export buttons
*/
function handleButtonClick(e,func){
    let targetSave = e.parentElement.getAttribute("data-ss")-1;
    if(func=="import"){
        document.getElementById("file-picker").onchange = function(){importSave(targetSave)};
        document.getElementById("file-picker").click();
    }
    else if(func=="export"){
        exportSave(targetSave);
    }
}

function genTableHTML(){
    const impButtHTML = '<button class="pbsm-imp-button">Import</button>';
    const expButtHTML = '<button class="pbsm-exp-button">Export</button>';
    let table = "<table>";
    table += "<tr><th>Slot 1</th><th>Slot 2</th><th>Slot 3</th></tr>";
    table += "<tr><td data-ss='1' >" + impButtHTML + "</td><td data-ss='2' >"+ impButtHTML + "</td><td data-ss='3' >"+impButtHTML+"</td></tr>"; //data-saveslot
    table += "<tr><td data-ss='1'>" + expButtHTML + "</td><td data-ss='2' >"+ expButtHTML + "</td><td data-ss='3' >"+expButtHTML+"</td></tr>";
    table += "</table>";
    return table;
}

function addOnclicks(){
    let importButtons = document.getElementsByClassName("pbsm-imp-button");
    let exportButtons = document.getElementsByClassName("pbsm-exp-button");
    for(let i=0;i<importButtons.length;i++){
        importButtons[i].onclick = function(){handleButtonClick(this,"import")};
    }
    for(let i=0;i<exportButtons.length;i++){
        exportButtons[i].onclick = function(){handleButtonClick(this,"export")};
    }
}

function generateHTML(){
    let div = document.createElement("div");
    div.id = "pbsm-cont"; //papas save manager container
    div.className = "game-meta-body";
    if(window.location.host=="www.crazygames.com") div.className += " crazygamesCont";
    div.style = "padding-bottom: 1%;";
    let genHTML = "<h2>Save Manager</h2><p>This save manager allows you to import and export saves to ensure they are never lost. Saves can also be moved between devices. The page may need to be refreshed before imported saves are visible.</p>";
    genHTML += genTableHTML();
    div.innerHTML = genHTML;

    let filePicker = document.createElement("input");
    filePicker.setAttribute("type","file");
    filePicker.id = "file-picker";
    filePicker.style.display = "none";
    div.appendChild(filePicker);

    let footerP = document.createElement("p");
    footerP.style = "font-size:10px; margin: 2% 0% 0% 0%;";
    footerP.innerHTML = "Version: " + psm.version + " ・ Running game: " + psm.game.name + " ・ Software provided without warranty ・ More info on <a href='https://github.com/Vaminta/papas-save-manager' target='_blank' >GitHub</a>"
    div.appendChild(footerP);

    const hostname = psm.gameHost.hostname;
    if(hostname=="www.coolmathgames.com"){
        let parentNode = document.getElementsByClassName("node__content clearfix field-item")[1];
        let childNode = document.getElementsByClassName("game-meta-body")[0];
        parentNode.insertBefore(div,childNode);
    }
    else if(hostname=="www.crazygames.com"){
        let beforeNode = document.getElementsByClassName("GamePageDesktop_leaderboardContainer__NClZo")[0];
        document.getElementById("gamePageMainContainer").insertBefore(div,beforeNode);
    }
    addOnclicks();
}

function getSlot(slot,callback){
    if(!callback) return;
    const lsKey = String(psm.gameHost.lsKeys[slot]);
    if(psm.gameHost.iframe && psm.gameHost.iframe.length>0){
        const entID = psm.newID();
        let callbackEntry = [];
        callbackEntry[0] = entID;
        callbackEntry[1] = callback;
        psm.lsCallbacks.push(callbackEntry);
        let newMessage = {
            id: entID,
            task: "getLS",
            params: [lsKey]
        };
        if(psm.gameHost.nest) newMessage.nest = psm.gameHost.nest;
        else newMessage.nest = 0;
        document.querySelector(psm.gameHost.iframe[0]).contentWindow.postMessage(newMessage,"*");
    }
    else{
        let data = localStorage.getItem(lsKey);
        callback(data);
    }
}

function setSlot(slot,value,callback){ //callback not supported yet
    if(!value)return;
    const lsKey = String(psm.gameHost.lsKeys[slot]);
    if(psm.gameHost.iframe && psm.gameHost.iframe.length>0){
        let newMessage = {
            id: 0,  //N/A
            task: "setLS",
            params: [lsKey,value]
        };
        document.querySelector(psm.gameHost.iframe[0]).contentWindow.postMessage(newMessage,"*");
    }
    else{
        localStorage.setItem(lsKey,value);
    }
}

//Receive message from game iframe - handle returned localstorage data
function receiveMessage(event){
    const data = event.data;
    if(data.type=="lsReply"){
        for(let i=0;i<psm.lsCallbacks.length;i++){
            let entry = psm.lsCallbacks[i];
            if(entry[0]==data.id) entry[1](data.content); //callback()
        }
    }
}

//Function for when this is injected into iframe
function iframeReceiveMessage(event){
    /*
    data.id
    data.task
    data.params
    */
    let data = event.data;
    psm.cout(window.location.host+" received "+data);
    if(!data) return;

    //Nest experimentation
    if(data.nest>0){
        data.nest--;
        document.getElementsByTagName("iframe")[0].contentWindow.postMessage(data,"*");
        return;
    }
    if(data.type=="lsReply"){
        window.parent.postMessage(data,"*");
        return;
    }
    //-------
    let response = {
        id: data.id,
        type: "lsReply",
        content: null
    };
    if(data.task=="getLS"){
        let result = localStorage.getItem(data.params[0]);
        response.content = result;
        window.parent.postMessage(response,"*");
    }
    else if(data.task=="setLS"){
        localStorage.setItem(data.params[0],data.params[1]);
    }
}


//get host by key value pair. Checks all games
function getHost(key,value){
    let host = null;
    for(let i=0;i<psm.gameList.length;i++){
        let hosts = psm.gameList[i]["hosts"];
        for(let n=0;n<hosts.length;n++){
            if(hosts[n][key]==value){
                host = hosts[n];
                break;
            }
        }
        if(host!=null){
            break;
        }
    }
    return host;
}

// returns singular game object by given key + matching value. Checks host params too
function getGame(key,value){
    let game = null;
    for(let i=0;i<psm.gameList.length;i++){
        if(psm.gameList[i][key]==value){
            game = psm.gameList[i];
            break;
        }
        else{
            for(let n=0;n<psm.gameList[i]["hosts"].length;n++){
                if(psm.gameList[i]["hosts"][n][key]==value){
                    game = psm.gameList[i];
                    break;
                }
            }
            if(game!=null)break; //break nest
        }
    }
    return game;
}

function getHostDetails(key,value){
    let hostDetails = null;
    for(let i=0;i<psm.hostList.length;i++){
        if(psm.hostList[i][key]==value){
            hostDetails = psm.hostList[i];
            break;
        }
    }
    return hostDetails;
}

function detectGame(){
    psm.game = getGame("pathname", window.location.pathname);
    psm.gameHost = getHost("pathname", window.location.pathname);
    if(psm.gameHost) psm.hostDetails = getHostDetails("hostname",psm.gameHost.hostname);
}

//attempt to prevent the game from loading
function blockGame(){
    if(window.location.hostname=="www.coolmathgames.com"){
        let wrapper = document.getElementById("swfgamewrapper");
        wrapper.innerHTML = "";
    }
}

function pageAdjustments(){
    if(window.location.hostname=="www.coolmathgames.com"){
        document.getElementById("game-fullscreen").onclick = () => cmg_start_game_full_screen();
    }
}

function initialise(){
    psm.cout("PSM Initialise");
    detectGame();
    if(!psm.game){ // if iframe script
        window.addEventListener("message", iframeReceiveMessage, false);
        psm.cout("PSM iframe script loaded at: "+window.location.href);
        return;
    }
    window.addEventListener("message", receiveMessage, false);

    if(psm.gameHost.makeIframe){
        let newIframe = document.createElement("iframe");
        newIframe.id = psm.gameHost.makeIframe[0];
        newIframe.src = psm.gameHost.makeIframe[1];
        newIframe.className = "hidden";
        document.body.appendChild(newIframe);
    }

    if(psm.userOptions.otherPageAdjustments) pageAdjustments();
    if(psm.userOptions.saveTxtExt) psm.saveExt = "txt";
    if(psm.userOptions.preventGameLoad) blockGame();
    injectCSS(pbsmCSS);
    if(window.location.host=="www.crazygames.com"){
        var interval = setInterval(function(){ //for crazygames doesn't like adding html too early!
	        if(document.readyState=="complete"){
		        clearInterval(interval);
		        generateHTML();
	        }
        },250);
    }
    else generateHTML();
}

initialise();