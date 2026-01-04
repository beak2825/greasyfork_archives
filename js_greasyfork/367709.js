// ==UserScript==
// @name        Travian Report Archive
// @namespace   https://greasyfork.org/en/scripts/367709-travian-report-archive
// @version     1.0.2
// @description Automatically saves reports locally on browser when you open them and exports as CSV for analysis in excel etc. currently supports raids, and scouting(resources and troops)
// @author      Bruno Robert
// @liscence    GPL(v3)
// @include     *://*.travian.*
// @include     *://*/*.travian.*
// @exclude     *://*.travian*.*/hilfe.php*
// @exclude     *://*.travian*.*/log*.php*
// @exclude     *://*.travian*.*/index.php*
// @exclude     *://*.travian*.*/anleitung.php*
// @exclude     *://*.travian*.*/impressum.php*
// @exclude     *://*.travian*.*/anmelden.php*
// @exclude     *://*.travian*.*/gutscheine.php*
// @exclude     *://*.travian*.*/spielregeln.php*
// @exclude     *://*.travian*.*/links.php*
// @exclude     *://*.travian*.*/geschichte.php*
// @exclude     *://*.travian*.*/tutorial.php*
// @exclude     *://*.travian*.*/manual.php*
// @exclude     *://*.travian*.*/ajax.php*
// @exclude     *://*.travian*.*/ad/*
// @exclude     *://*.travian*.*/chat/*
// @exclude     *://forum.travian*.*
// @exclude     *://board.travian*.*
// @exclude     *://shop.travian*.*
// @exclude     *://*.travian*.*/activate.php*
// @exclude     *://*.travian*.*/support.php*
// @exclude     *://help.travian*.*
// @exclude     *://*.answers.travian*.*
// @exclude     *.css
// @exclude     *.js
// @downloadURL https://update.greasyfork.org/scripts/367709/Travian%20Report%20Archive.user.js
// @updateURL https://update.greasyfork.org/scripts/367709/Travian%20Report%20Archive.meta.js
// ==/UserScript==

// ----- Getters and Setters -----

/**
 *
 * get the parsed value of localStorage.reportList
 *
 * @returns {any} parsed value of localStorage.reportList
 */
function getReportList() {
    return JSON.parse(localStorage.reportList);
}

/**
 *
 * Stringify the input and store it in localStorage.reportList
 *
 * @param reportList value parse and set
 */
function setReportList(reportList) {
    localStorage.reportList = JSON.stringify(reportList);
}

/**
 *  returns true if localStorage.reportList exists
 * @returns {boolean} true if localStorage.reportList exists
 */
function doesReportListExist() {
    if(localStorage.reportList){
        return true;
    }
    return false;
}

// ----- Global variables -----
let lang = "fr";//current language used
const supportedLanguages = ["fr"];//list of languages that are configured
const reportSubjects = {//the strings to look for in report subjects to determine the type of report
    "fr": [" pille ", " espionne ", " espionne ", " attaque ", " defend ", " explore ", " livre ", " Oasis "]
};

// ----- Tools -----

/**
 *
 * Will add "element" to "list" if "element" isn't already present in "list"
 *
 * @param {[]}list the list to add to
 * @param element element to add to the list
 * @returns {[]}
 */
function addToListWithoutDup(list, element) {
    let inList = false;
    for(let i = 0; i < list.length; i++) {
        if(list[i] === element) {
            inList = true;
        }
    }
    if(!inList) {
        list = list.concat([element]);
    }
    return list;
}

// ----- Crawlers -----

/**
 *
 * Gathers the data from a report page through HTML. It returns this data in the form of an object (dict)
 *
 * @returns {{resourcesStolen: *[], resourcesInBase: *[], atk: number[], atk_loss: number[], def: number[], def_loss: number[], def_assist: *[], def_assist_loss: *[], reportType: number, atkClass: number, dateTime: number[], reportId: string | *, attacker: {name: string, profile_url: string, village_name: string, village_url: string}, defender: {name: string, profile_url: string, village_name: string, village_url: string}, defClass: number}}
 */
function gatherResourceData() {
    //gets all the info from a report page and returns a dict containing the data
    let resourcesStolen = [-1, -1, -1, -1, -1];//wood, clay, iron, wheat, maxCarry; This contains the amount of ressources stolen; Instanciazed because one of the two will not be used
    let resourcesInBase = [-1, -1, -1, -1, -1];//wood, clay, iron, wheat, hidout size; This contains the amout of ressources stashed in base and hidout size used in scout reports
    let atk = [11];//attackers troops
    let atk_loss = [11];//attacker losses
    let def = [11];//defending troops (also stationned troop if report is a spy)
    let def_loss = [11];//defenders losses
    let def_assist = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];//defending assistance; These gusy are instanciated because sometimes there is no assist
    let def_assist_loss = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];//assistences losses
    let reportType = 0;// 0 = not set; 1 = pillage; 2 = scout; 3 = other (hero quest);
    let atkClass = 0;//0 = not set; 1 = teutons; 2 = gaul; 3 = roman
    let defClass = 0;
    let dateTime;
    let dateTimeTemp = [];//d, m, y, h, m, s (array)
    let attacker = {
        name : "",
        profile_url: "",
        village_name: "",
        village_url: ""
    };
    let defender = {
        name : "",
        profile_url: "",
        village_name: "",
        village_url: ""
    };
    let reportId;

    //-----Determining what kind of report it is -----
    let subject = document.getElementById('subject');
    //let textHeader = subject.getElementsByClassName('header text');
    let subjectText = subject.innerHTML;//the text written in the subject container
    if(subjectText.includes(" espionne ")) {
        reportType = 2;//if the report type is spying
    } else if(subjectText.includes(" pille ")) {
        reportType = 1;//if the report type is pillage
    } else {
        reportType = 3;
    }

    //-----Getting the Date and Time -----
    let dateTimeBlock = document.getElementByClass('time');
    //textHeader = dateTimeBlock.getElementsByClassName('header text');
    let dateTimeText = dateTimeBlock.innerText;
    dateTimeTemp[0] = Number(dateTimeText.split('.')[0]);
    dateTimeTemp[1] = Number(dateTimeText.split('.')[1]);
    dateTimeTemp[2] = Number(dateTimeText.split('.')[2].split(',')[0]);
    dateTimeTemp[3] = Number(dateTimeText.split('.')[2].split(',')[1].split(':')[0].trim());
    dateTimeTemp[4] = Number(dateTimeText.split('.')[2].split(',')[1].split(':')[1]);
    dateTimeTemp[5] = Number(dateTimeText.split('.')[2].split(',')[1].split(':')[2]);

    dateTime = toDateObj(dateTimeTemp);

    //-----Getting the players and villages -----

    let headlines = document.getElementsByClassName('troopHeadline');//0 = Attacker; 1 = Defender
    attacker.name = headlines[0].getElementsByClassName('player')[0].innerText;
    attacker.profile_url = headlines[0].getElementsByClassName('player')[0].href;
    attacker.village_name = headlines[0].getElementsByClassName('village')[0].innerText;
    attacker.village_url = headlines[0].getElementsByClassName('village')[0].href;

    defender.name = headlines[1].getElementsByClassName('player')[0].innerText;
    defender.profile_url = headlines[1].getElementsByClassName('player')[0].href;
    defender.village_name = headlines[1].getElementsByClassName('village')[0].innerText;
    defender.village_url = headlines[1].getElementsByClassName('village')[0].href;

    //-----Getting the report id -----
    reportId = window.location.href.split('id=')[1].split('&')[0];

    //contains unit info
    let unitBlocks = document.getElementsByClassName('units');//0: head; 1 = atk troops; 2 = atk losses; 3 = head; 4 = def troops; 5 = def losses; 6 = head; 7 = def_assist; 8 = def_assist_loss;
    //contains resource info
    let goodsBlocks = document.getElementsByClassName('goods');//

    //attempting to detect your class
    if(unitBlocks[0].getElementsByTagName('td')[0].firstChild.className == "unit u11") {
        console.log("Teuton Detected");
        atkClass = 1;
    } else if(unitBlocks[0].getElementsByTagName('td')[0].firstChild.className == "unit u21") {
        console.log("Gauls Detected");
        atkClass = 2;
    } else {
        console.log("Romans Detected");
        atkClass = 3;
    }

    //attempting to detect defender class
    if(unitBlocks[3].getElementsByTagName('td')[0].firstChild.className == "unit u11") {
        console.log("Defender Teuton Detected");
        defClass = 1;
    } else if(unitBlocks[3].getElementsByTagName('td')[0].firstChild.className == "unit u21") {
        console.log("Defender Gauls Detected");
        defClass = 2;
    } else {
        console.log("Defender Romans Detected");
        defClass = 3;
    }

    console.log("gathering troop data");
    //getting the data on number of troops
    for(let i = 0; i < 11; i++) {

        atk[i] = unitBlocks[1].getElementsByTagName('td')[i].innerText;
        atk_loss[i] = unitBlocks[2].getElementsByTagName('td')[i].innerText;
        def[i] = unitBlocks[4].getElementsByTagName('td')[i].innerText;
        def_loss[i] = unitBlocks[5].getElementsByTagName('td')[i].innerText;

    }

    //Checking if there is an assistance
    if(unitBlocks[7] !== undefined && unitBlocks[8] !== undefined && unitBlocks[9] !== undefined) {
        for(let i = 0; i < 11; i++) {
            def_assist[i] = unitBlocks[7].getElementsByTagName('td')[i].innerText;
            def_assist_loss[i] = unitBlocks[8].getElementsByTagName('td')[i].innerText;
        }
    }

    if(reportType === 1) {//pillage
        console.log('getting data on ressources');
        //getting data on ressources
        for(let i = 0; i < 4; i++) {
            resourcesStolen[i] = goodsBlocks[0].getElementsByClassName('rArea')[i].innerText;
        }
        let maxCarry = goodsBlocks[0].getElementsByClassName('carry')[0].innerText;
        resourcesStolen[4] = maxCarry.split('/')[1];//maximum carry power

    } else if(reportType === 2){//scouting
        console.log('getting data on ressources');
        //getting data on ressources
        for(let i = 0; i < 4; i++) {
            resourcesInBase[i] = goodsBlocks[0].getElementsByClassName('rArea')[i].innerText;
        }
        resourcesInBase[4] = goodsBlocks[1].getElementsByClassName('rArea')[0].innerText;//maximum carry power
    } else { //hero quest or any other
        console.log('report type is invalid');
    }

    //----- Creating the data object -----
    let data = {
        "resourcesStolen": resourcesStolen,
        "resourcesInBase": resourcesInBase,
        "atk": atk,
        "atk_loss": atk_loss,
        "def": def,
        "def_loss": def_loss,
        "def_assist": def_assist,
        "def_assist_loss": def_assist_loss,
        "reportType": reportType,
        "atkClass": atkClass,
        "dateTime": dateTime,
        "reportId": reportId,
        "attacker": attacker,// name, profile_url, village_name, village_url
        "defender": defender,// name, profile_url, village_name, village_url
        "defClass": defClass
    };
    console.log('gatherResourceData() is complete');
    return data;
}

/**
 * Determines the report type by reading the report
 * 0 = raid, 1 = scout resources + troops, 2 = scout troops + defenses, 3 = attack, 4 = defense, 5 = adventure, 6 = trade, 7 = unknown/error, -1 = default value (nothing)
 * @returns {number} the report type
 */
function getReportType() {
    //-----Determining what kind of report it is -----
    let reportType = -1;//0 = raid, 1 = scout resources + troops, 2 = scout troops + defenses, 3 = attack, 4 = defense, 5 = adventure, 6 = trade, 7 = unknown/error, -1 = default value (nothing)
    let subject = document.getElementsByClassName('subject');
    //let textHeader = subject.getElementsByClassName('header text');
    let subjectText = subject[0].innerHTML;//the text written in the subject container
    if(subjectText.includes(reportSubjects[lang][0])) {//raid
        reportType = 0;
    } else if(subjectText.includes(reportSubjects[lang][1])) {//scout ...
        let infos = document.getElementsByClassName('infos');
        if(!infos.length){
            reportType = 1;//scout resources + troops
        } else {
            reportType = 2;//scout troops + defenses

        }
    } else if(subjectText.includes(reportSubjects[lang][3])){ //attack
        reportType = 3;
    } else if(subjectText.includes(reportSubjects[lang][4])) {//defense
        reportType = 4;
    } else if(subjectText.includes(reportSubjects[lang][5])) {//adventure
        reportType = 5;
    } else if(subjectText.includes(reportSubjects[lang][6])) {//trade
        reportType = 6;
    } else {//unknown/error/trades
        reportType = 7;
    }

    return reportType;
}

/**
 * Gets the date of the report
 * @returns {Date} date of the report
 */
function getReportDateTime() {
    //-----Getting the Date and Time -----
    let dateTimeTemp = [];
    let dateTimeBlock = document.getElementsByClassName('time')[0];
    //let textHeader = dateTimeBlock.getElementsByClassName('header text');
    let dateTimeText = dateTimeBlock.innerText;
    dateTimeTemp[0] = Number(dateTimeText.split('.')[0]);
    dateTimeTemp[1] = Number(dateTimeText.split('.')[1]);
    dateTimeTemp[2] = Number(dateTimeText.split('.')[2].split(',')[0]);
    dateTimeTemp[3] = Number(dateTimeText.split('.')[2].split(',')[1].split(':')[0].trim());
    dateTimeTemp[4] = Number(dateTimeText.split('.')[2].split(',')[1].split(':')[1]);
    dateTimeTemp[5] = Number(dateTimeText.split('.')[2].split(',')[1].split(':')[2]);

    let dateTime = new Date((2000 + dateTimeTemp[2]), dateTimeTemp[1], dateTimeTemp[0], dateTimeTemp[3], dateTimeTemp[4], dateTimeTemp[5], 0);
    return dateTime;
}

/**
 * Gets info on attacker:
 * Name, profile URL, villageName, village URL
 * @returns {{}}
 */
function getAttackerInfo() {
    let attacker = {};
    let headlines = document.getElementsByClassName('troopHeadline');//0 = Attacker; 1 = Defender
    attacker.name = headlines[0].getElementsByClassName('player')[0].innerText;
    attacker.profile_url = headlines[0].getElementsByClassName('player')[0].href;
    attacker.village_name = headlines[0].getElementsByClassName('village')[0].innerText;
    attacker.village_url = headlines[0].getElementsByClassName('village')[0].href;

    return attacker;
}

/**
 * Gets info on the defender
 * Name, profile URL, villageName, village URL
 * @returns {{}}
 */
function getDefenderInfo() {
    let defender = {};
    let headlines = document.getElementsByClassName('troopHeadline');//0 = Attacker; 1 = Defender
    defender.name = headlines[1].getElementsByClassName('player')[0].innerText;
    defender.profile_url = headlines[1].getElementsByClassName('player')[0].href;
    defender.village_name = headlines[1].getElementsByClassName('village')[0].innerText;
    defender.village_url = headlines[1].getElementsByClassName('village')[0].href;

    return defender;
}

/**
 * Generates and returns the reportID
 * @returns {string} reportId
 */
function getReportId() {
    return window.location.href.split('id=')[1].split('&')[0];
}

/**
 * Gets and returns the class of the attacker
 * @returns {number} class of the attacker
 */
function getAttackerClass(verbose = false) {
    //contains unit info
    let unitBlocks = document.getElementsByClassName('units');//0: head; 1 = atk troops; 2 = atk losses; 3 = head; 4 = def troops; 5 = def losses; 6 = head; 7 = def_assist; 8 = def_assist_loss;
    let atkClass;
    //attempting to detect class
    if(unitBlocks[0].getElementsByTagName('td')[0].firstChild.className === "unit u11") {
        if (verbose) {
            console.log("Teuton Detected");
        }
        atkClass = 1;
    } else if(unitBlocks[0].getElementsByTagName('td')[0].firstChild.className === "unit u21") {
        if (verbose) {
            console.log("Gauls Detected");
        }
        atkClass = 2;
    } else {
        if (verbose) {
            console.log("Romans Detected");
        }
        atkClass = 3;
    }

    return atkClass;
}

/**
 * Gets and returns the class of the defender
 * @returns {number} class of the defender
 */
function getDefenderClass(verbose = false) {
    //TODO: add nature
    //contains unit info
    let unitBlocks = document.getElementsByClassName('units');//0: head; 1 = atk troops; 2 = atk losses; 3 = head; 4 = def troops; 5 = def losses; 6 = head; 7 = def_assist; 8 = def_assist_loss;
    let defClass;
    //attempting to detect defender class
    if(unitBlocks[3].getElementsByTagName('td')[0].firstChild.className === "unit u11") {
        if (verbose) {
            console.log("Defender Teuton Detected");
        }
        defClass = 1;
    } else if(unitBlocks[3].getElementsByTagName('td')[0].firstChild.className === "unit u21") {
        if (verbose) {
            console.log("Defender Gauls Detected");
        }
        defClass = 2;
    } else {
        if (verbose) {
            console.log("Defender Romans Detected");
        }
        defClass = 3;
    }

    return defClass;
}

/**
 * Gets all the troops involved in the report (atk, def and assist)
 * @returns {{atk: Array, atk_loss: Array, def: Array, def_loss: Array, assist: Array, assist_loss: Array}}
 */
function getTroops() {
    //TODO: check weather or not this works with multiple assists
    //contains unit info
    let unitBlocks = document.getElementsByClassName('units');//0: head; 1 = atk troops; 2 = atk losses; 3 = head; 4 = def troops; 5 = def losses; 6 = head; 7 = def_assist; 8 = def_assist_loss;
    let maxTroopClasses = 11;

    //oasis only have 10 types of animals so we check if this is an oasis
    let subject = document.getElementsByClassName('subject');
    //let textHeader = subject.getElementsByClassName('header text');
    let subjectText = subject[0].innerHTML;//the text written in the subject container
    if(subjectText.includes(reportSubjects[lang][7])){
        maxTroopClasses = 10;
    }
    let troops = {
        atk: [],
        atk_loss: [],
        def: [],
        def_loss: [],
        assist: [],
        assist_loss: []
    };
    //getting the data on number of troops
    for(let i = 0; i < maxTroopClasses; i++) {

        troops.atk[i] = unitBlocks[1].getElementsByTagName('td')[i].innerText;
        troops.atk_loss[i] = unitBlocks[2].getElementsByTagName('td')[i].innerText;
        troops.def[i] = unitBlocks[4].getElementsByTagName('td')[i].innerText;
        troops.def_loss[i] = unitBlocks[5].getElementsByTagName('td')[i].innerText;

    }
    //Checking if there is an assistance
    if(unitBlocks[7] !== undefined && unitBlocks[8] !== undefined && unitBlocks[9] !== undefined) {
        for(let i = 0; i < 11; i++) {
            troops.assist[i] = unitBlocks[7].getElementsByTagName('td')[i].innerText;
            troops.assist_loss[i] = unitBlocks[8].getElementsByTagName('td')[i].innerText;
        }
    }
    return troops
}

/**
 * Gets the quantity of raided resources
 * @returns {number[]} raided resources
 */
function getRaidedResources() {
    //contains resource info
    let goodsBlocks = document.getElementsByClassName('goods');//
    let resourcesStolen = [0, 0, 0, 0, 0];//W, C, I, Crop, maxCarry
    //getting data on resources
    for(let i = 0; i < 4; i++) {
        resourcesStolen[i] = Number(goodsBlocks[0].getElementsByClassName('value')[i].innerText);
    }
    let maxCarry = goodsBlocks[0].getElementsByClassName('carry')[0].innerText;
    resourcesStolen[4] = Number(maxCarry.split('/')[1]);//maximum carry power
    return resourcesStolen;
}

/**
 * Gets and returns the quantity of resources in scouted village
 * @returns {number[]}
 */
function getScoutedResources() {
    //contains resource info
    let goodsBlocks = document.getElementsByClassName('goods');//
    let resourcesInBase = [0, 0, 0, 0, 0];
    //getting data on resources
    for(let i = 0; i < 4; i++) {
        resourcesInBase[i] = Number(goodsBlocks[0].getElementsByClassName('rArea')[i].innerText);
    }
    resourcesInBase[4] = Number(goodsBlocks[1].getElementsByClassName('rArea')[0].innerText);//cranny
    return resourcesInBase;
}

/**
 * Analyses the report and returns the data from the report page ("*berichte.php*")
 * @returns {{reportId: string, reportType: number, reportDate: Date, attackerClass: number, defenderClass: number, attackerInfo: {}, defenderInfo: {}, troops: {atk: Array, atk_loss: Array, def: Array, def_loss: Array, assist: Array, assist_loss: Array}, raidedResources: *, scoutedResources: *}}
 */
function readReport() {
    //TODO: check if these work for scout troop + defense, attack, defense, adventure and trade
    let reportType = getReportType();
    let reportDate = getReportDateTime();
    let attackerInfo = getAttackerInfo();
    let defenderInfo = getDefenderInfo();
    let reportId = getReportId();
    let attackerClass = getAttackerClass();
    let defenderClass = getDefenderClass();
    let troops = getTroops();
    let raidedResources = [0, 0, 0, 0, 0];
    let scoutedResources = [0, 0, 0, 0, 0];
    if(reportType === 0) {
        raidedResources = getRaidedResources();
    } else if(reportType === 1){
        scoutedResources = getScoutedResources();
    }

    let data = {
        reportId: reportId,//
        reportType: reportType,//
        reportDate: reportDate,//
        attackerClass: attackerClass,//
        defenderClass: defenderClass,//
        attackerInfo: attackerInfo,//
        defenderInfo: defenderInfo,//
        troops: troops,
        raidedResources: raidedResources,
        scoutedResources: scoutedResources
    };
    return data;
}

// ----- General functions -----
/**
 * When given a report will check if it exists in db, if not it will add it.
 * @param report
 */
function saveReport(report) {
    let localReportList;

    //initialise the local copy of localStorage.ReportList
    if(doesReportListExist()){
        localReportList = getReportList();
    } else {
        localReportList = {};
    }

    //check if the report id already exists
    if(localReportList[report.reportId]){
        console.log('report is already saved');
        //TODO: Write this on the report
    } else {
        localReportList[report.reportId] = report;
        console.log('report is now saved');
        //TODO: Write this on the report
    }


    setReportList(localReportList);
}

/**
 * takes a array and returns is as a csv row (no newline)
 * @param arary
 * @param culumnDelimiter
 * @returns {*}
 */
function arrayToCSV({array = null, columnDelimiter = ','} = {}) {
    if(array === null || !array.length){
        return null;
    }
    let out = "";
    out += array[0];
    for(let x = 1; x < array.length; x++){
        out += columnDelimiter + array[x];
    }
    return out;
}

/**
 * Gets all the reports and turns them into a csv (string)
 * @returns {string} reports in CSV form
 */
function toCSV() {
    let output = "";
    let rowDelimiter = '\n';
    const head = [
        "Report ID","Report Type","Date",
        "Raided Wood","Raided Clay","Raided Iron","Raided Cereal","Cary Capacity",
        "Scouted Wood","Scouted Clay","Scouted Iron","Scouted Cereal","Scouted Cranny",

        "Attacker Name","Attacker Village Name","Attacker Class","Attacker Profile URL","Attacker Village URL",
        "Attacker troop 1","Attacker troop 2","Attacker troop 3","Attacker troop 4","Attacker troop 5","Attacker troop 6",
        "Attacker troop 7","Attacker troop 8","Attacker troop 9","Attacker troop 10","Attacker troop 11",
        "Attacker troop 1 Loss","Attacker troop 2 Loss","Attacker troop 3 Loss","Attacker troop 4 Loss",
        "Attacker troop 5 Loss","Attacker troop 6 Loss","Attacker troop 7 Loss","Attacker troop 8 Loss",
        "Attacker troop 9 Loss","Attacker troop 10 Loss","Attacker troop 11 Loss",

        "Defender Name","Defender Village Name","Defender Class","Defender Profile URL","Defender Village URL",
        "Defender troop 1","Defender troop 2","Defender troop 3","Defender troop 4","Defender troop 5","Defender troop 6",
        "Defender troop 7","Defender troop 8","Defender troop 9","Defender troop 10","Defender troop 11",
        "Defender troop 1 Loss","Defender troop 2 Loss","Defender troop 3 Loss","Defender troop 4 Loss",
        "Defender troop 5 Loss","Defender troop 6 Loss","Defender troop 7 Loss","Defender troop 8 Loss",
        "Defender troop 9 Loss","Defender troop 10 Loss","Defender troop 11 Loss",

        "Assistance Class",
        "Assistance troop 1","Assistance troop 2","Assistance troop 3","Assistance troop 4","Assistance troop 5",
        "Assistance troop 6","Assistance troop 7","Assistance troop 8","Assistance troop 9","Assistance troop 10",
        "Assistance troop 11",
        "Assistance troop 1 Loss","Assistance troop 2 Loss","Assistance troop 3 Loss","Assistance troop 4 Loss",
        "Assistance troop 5 Loss","Assistance troop 6 Loss","Assistance troop 7 Loss","Assistance troop 8 Loss",
        "Assistance troop 9 Loss","Assistance troop 10 Loss","Assistance troop 11 Loss"
    ];

    output = arrayToCSV({array: head}) + rowDelimiter;

    if(doesReportListExist()){
        let reportList = getReportList();
        for(report in reportList){
            let cr = reportList[report];//current report
            let row = [
                cr.reportId, cr.reportType, cr.reportDate,
                cr.raidedResources[0],cr.raidedResources[1],cr.raidedResources[2],cr.raidedResources[3], cr.raidedResources[4],
                cr.scoutedResources[0],cr.scoutedResources[1],cr.scoutedResources[2],cr.scoutedResources[3], cr.scoutedResources[4],

                cr.attackerInfo.name,cr.attackerInfo.village_name,cr.attackerClass,cr.attackerInfo.profile_url,cr.attackerInfo.village_url,
                cr.troops.atk[0],cr.troops.atk[1],cr.troops.atk[2],cr.troops.atk[3],cr.troops.atk[4],cr.troops.atk[5],
                cr.troops.atk[6],cr.troops.atk[7],cr.troops.atk[8],cr.troops.atk[9],cr.troops.atk[10],
                cr.troops.atk_loss[0],cr.troops.atk_loss[1],cr.troops.atk_loss[2],cr.troops.atk_loss[3],cr.troops.atk_loss[4],cr.troops.atk_loss[5],
                cr.troops.atk_loss[6],cr.troops.atk_loss[7],cr.troops.atk_loss[8],cr.troops.atk_loss[9],cr.troops.atk_loss[10],

                cr.defenderInfo.name,cr.defenderInfo.village_name,cr.defenderClass,cr.defenderInfo.profile_url,cr.defenderInfo.village_url,
                cr.troops.def[0],cr.troops.def[1],cr.troops.def[2],cr.troops.def[3],cr.troops.def[4],cr.troops.def[5],
                cr.troops.def[6],cr.troops.def[7],cr.troops.def[8],cr.troops.def[9],cr.troops.def[10],
                cr.troops.def_loss[0],cr.troops.def_loss[1],cr.troops.def_loss[2],cr.troops.def_loss[3],cr.troops.def_loss[4],cr.troops.def_loss[5],
                cr.troops.def_loss[6],cr.troops.def_loss[7],cr.troops.def_loss[8],cr.troops.def_loss[9],cr.troops.def_loss[10],

                "Assistance Class",//TODO: fix this

                cr.troops.assist[0],cr.troops.assist[1],cr.troops.assist[2],cr.troops.assist[3],cr.troops.assist[4],cr.troops.assist[5],
                cr.troops.assist[6],cr.troops.assist[7],cr.troops.assist[8],cr.troops.assist[9],cr.troops.assist[10],
                cr.troops.assist_loss[0],cr.troops.assist_loss[1],cr.troops.assist_loss[2],cr.troops.assist_loss[3],cr.troops.assist_loss[4],cr.troops.assist_loss[5],
                cr.troops.assist_loss[6],cr.troops.assist_loss[7],cr.troops.assist_loss[8],cr.troops.assist_loss[9],cr.troops.assist_loss[10]
            ];
            output += arrayToCSV({array: row}) + rowDelimiter;
        }
    } else {
        alert('There is nothing to export!');
    }
    return output;
}

/**
 * Instantly starts the download of the csv
 * @param filename (optionnal)
 */
function startDownload({filename = 'export.csv'} = {}) {
    let data, link;
    let csv = toCSV();
    if(csv === null) return;
    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}

/**
 * Creates a menu item in the top right menu of travian
 * @param name name of the button (becomes the button class if you want to use CSS)
 * @param imageSRC image link to be displayed on the button
 * @param onClickFunction function that will execute onclick
 */
function createMenuItem({name = "link name", imageSRC = "", onClickFunction = function() {} } = {}) {
    let newMenuItem = document.createElement('li');
    let itemLink = document.createElement('a');
    let itemImg = document.createElement('img');
    newMenuItem.className = name;
    itemLink.onclick = onClickFunction;
    itemImg.alt = name;
    itemImg.src = imageSRC;
    itemImg.backgroundImage = "none";

    itemLink.appendChild(itemImg);
    newMenuItem.appendChild(itemLink);
    let menuHook = document.getElementById('outOfGame');
    menuHook.insertBefore(newMenuItem, menuHook.lastChild);
}

// ----- Main ------

if(window.location.href.includes('berichte.php?id=')) {
    if(getReportType() === 0 || getReportType() === 1){
        let data = readReport();
        saveReport(data);
    } else {
        console.log('report type not supported yet: ' + getReportType());
    }
}

createMenuItem({name:"export", imageSRC:"https://image.flaticon.com/icons/svg/214/214289.svg", onClickFunction: function() {startDownload();}});
