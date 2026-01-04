// ==UserScript==
// @name         EE News Summary
// @namespace    EE News Summary
// @version      0.33
// @description  Provide a summary of news events in a popup
// @author       s
// @include	   	 http://*.earthempires.com/*
// @include	   	 https://*.earthempires.com/*
// @exclude		 http://*.earthempires.com/loggedin
// @exclude		 https://*.earthempires.com/loggedin
// @match        http://*.earthempires.com/*
// @match        https://*.earthempires.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/387650/EE%20News%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/387650/EE%20News%20Summary.meta.js
// ==/UserScript==

// Jabroni1134 EEE script used as a baseline (https://greasyfork.org/en/scripts/27274-earth-empires-editor)


/* TODO: optimize
 * clean cached data when moving from pages
 * modularize table creation
 * common function to parse data?
 */

//==========================================
//Constants
//==========================================
var dd = '::'; //data delimiter between data per news lines
var ld = '::::'; //line delimiter between news lines
var td = '----'; //type delimiter e.g tech_str :::::: purchase_str :::::: etc...

//tech
var tech_start = 'You have gained';
var tech_end = 'technology points from';

//sales
var sales = 'You sold';
var sales_so = 'to a standing order';
var sales_price = "for $";

//purchases
var purch = "You purchased";
var purch_so = "via standing order";
var buy_start = "at $";
var buy_end = " for ";

var off_start = 'Your forces were called to aid ';
var off_end = ' in attacking';

//ops
//op constants
var ops = { 'success' : 'Enemy operatives',
           'start'   : '! You killed',
           'end'     : 'enemy spies' };

var opType = { 'cd'          : 'Cause Dissension',
              'demo'         : 'Demoralize',
              'airbases'     : 'Bomb Airbases',
              'structures'   : 'Bomb Structures',
              'sr'           : 'Stir Rebellions',
              'espionage'    : 'Commit Espionage',
              'spy'          : 'Spy',
              'intelligence' : 'Attack Intelligence Centers',
              'banks'        : 'Bomb Banks',
              'food'         : 'Raid Food Stores',
              'oil'          : 'Raid Oil Reserves',
              'bio'          : 'BioTerrorism',
              'alliances'    : 'Spy on Allainces',
              'market'       : 'Market Spy',
              'military'     : 'Military Spy',
              'missiles'     : 'Sabotage Missiles',
             };

//json string to compare from recentnews
var opTypeNews = {'spyFail'       : 'attempted to spy on your country!',
                  'cd'            : 'troops to leave your army!',
                  'cdFail'        : 'attempted to cause dissension among your troops!',
                  'demo'          : 'a drop in your readiness!',
                  'demoFail'      : 'attempted to demoralize your forces!',
                  'struct'        : 'buildings!',
                  'structFail'    : 'attempted to bomb your structures!',
                  'airbaseOp'     : 'You lost ',
                  'airbase'       : 'jets when a local airbase blew up!',
                  'airbaseFail'   : 'attempted to bomb your airbases!',
                  'sr'            : 'civilians to flee our lands!',
                  'srFail'        : 'attempted to stir rebellions in your country!',
                  'espionage'     : 'Spies infiltrated your research labs and stole',
                  'espionageFail' : 'attempted to commit espionage in your laboratories!',
                  'intel'         : 'of your spies',
                  'intelFail'     : 'attempted to attack your intelligence centers!',
                  'banks'         : 'worth of cash!',
                  'banks2'        : 'blew up banks containing',
                  'banksFail'     : 'attempted to bomb your banks!',
                  'food'          : 'on fire as they fled!',
                  'foodFail'      : 'attempted to raid your food stores!',
                  'oil'           : 'barrels on fire!',
                  'oilFail'       : 'attempted to raid your oil reserves!',
                  'missiles'      : 'of our missiles!',
                  'missilesFail'  : 'attempted to sabotage missiles in your country!',
                  'bio'           : 'Only our scientists can save us now!',
                  'bioFail'       : 'attempted to perform bioterrorism on your country!',
                  'marketFail'    : 'attempted to attempted to spy on your goods and technology for sale!',
                  'militaryFail'  : 'attempted to spy on your military!',
                  'allianceFail'  : 'attempted to spy on your relations!',
                 };

//military
var defend_news = { 'ss' : 'A brigade',
                   'ps' : 'A brigade',
                   'gs' : 'Guerillas',
                   'br' : 'An air wing',
                   'ab' : 'An armoured division',
                  };

var defend_type = { 'ss' : 'LG',
                   'ps' : 'LG',
                   'gs' : 'GS',
                   'br' : 'BR',
                   'ab' : 'AB',
                  };

//==========================================
//Get/Set Functions
//Prefixes server name to settings
//==========================================
function getSetting(key,value){
    if (typeof value == "float") value+="";
    return GM_getValue(key,value);
}

function setSetting(key,value){
    if (typeof value == "float") value+="";
    return GM_setValue(key,value);
}

function delSetting(key){
    return GM_deleteValue(key);
}

// Simple replacement of getelementbyid with $ to save typing
function $(variable){
    if(!variable) return;
    if (document.getElementById(variable)) return document.getElementById(variable);
}

// Simple replacement of getelementbyclass with $ to save typing
function $c(variable){
    if(!variable) return;
    if (document.getElementsByClassName(variable)) return document.getElementsByClassName(variable);
}

// Simple replacement of getelementbyname with $ to save typing
function $n(variable){
    if(!variable) return;
    if (document.getElementsByName(variable)) return document.getElementsByName(variable);
}

function cleanCacheData(){
    delSetting('NewsData');
    delSetting('FailedData');
}

//==========================================
//Mil Functions
//==========================================

function isAllyNewsItems(text){
    return ((text.indexOf('Your forces were called to defend') >= 0 ) || (text.indexOf('Your forces were called to aid') >= 0));
}

function isOffAllyNewsItems(text){
    return (text.indexOf('Your forces were called to aid') >= 0);
}

function isMissileItem (text) {
    return(text.indexOf('was launched at your lands') >= 0);
}

function getDefendsKey(text){
    var key = '';
    if (text.indexOf(defend_news.ss) >= 0) { key = defend_type.ss; }
    else if (text.indexOf(defend_news.ps) >= 0) { key = defend_type.ps; }
    else if (text.indexOf(defend_news.gs) >= 0) { key = defend_type.gs; }
    else if (text.indexOf(defend_news.br) >= 0) { key = defend_type.br; }
    else if (text.indexOf(defend_news.ab) >= 0) { key = defend_type.ab; }
    return key;
}

function populateDefendsString (hash){
    var str = '';
    for (var key in hash) {
        var data = hash[key];
        str += key + dd +
            data.total + dd +
            data.oil + dd +
            data.cash + dd +
            data.food + dd +
            data.tech + dd +
            data.acres + dd +
            data.civs + dd +
            data.buildings + dd +
            data.mTroops + dd +
            data.mTurrets + dd +
            data.mTanks + dd +
            data.tTroops + dd +
            data.tJets + dd +
            data.tTanks + dd +
            data.tOil + td;
    }
    setSetting("DefendData", str);
}

function populateOffAllyString (hash){
    var str = '';
    for (var key in hash) {
        var data = hash[key];
        str += key + dd +
			data.country + dd +
            data.total + dd +            
            data.mTroops + dd +
            data.mJets + dd +
            data.mTanks + td;
    }
    setSetting("OffAllyData", str);
}

//==========================================
//Ops Functions
//==========================================
function getFailedOpType(text){
    if (text.indexOf(opTypeNews.cdFail) >= 0) { return opType.cd; }
    else if (text.indexOf(opTypeNews.airbaseFail) >= 0) { return opType.airbases; }
    else if (text.indexOf(opTypeNews.structFail) >= 0) { return opType.structures; }
    else if (text.indexOf(opTypeNews.srFail) >= 0) { return opType.sr; }
    else if (text.indexOf(opTypeNews.espionageFail) >= 0) { return opType.espionage; }
    else if (text.indexOf(opTypeNews.spyFail) >= 0) { return opType.spy; }
    else if (text.indexOf(opTypeNews.demoFail) >= 0) { return opType.demo; }
    else if (text.indexOf(opTypeNews.intelFail) >= 0) { return opType.intelligence; }
    else if (text.indexOf(opTypeNews.banksFail) >= 0) { return opType.banks; }
    else if (text.indexOf(opTypeNews.foodFail) >= 0) { return opType.food; }
    else if (text.indexOf(opTypeNews.oilFail) >= 0) { return opType.oil; }
    else if (text.indexOf(opTypeNews.missilesFail) >= 0) { return opType.missiles; }
    else if (text.indexOf(opTypeNews.bioFail) >= 0) { return opType.bio; }
    else if (text.indexOf(opTypeNews.marketFail) >= 0) { return opType.market; }
    else if (text.indexOf(opTypeNews.militaryFail) >= 0) { return opType.military; }
    else if (text.indexOf(opTypeNews.allianceFail) >= 0) { return opType.alliances; }
    else { return 'default';}
}

function getSuccessfulOpType(text){
    if (text.indexOf(opTypeNews.cd) >= 0) { return opType.cd; }
    else if (text.indexOf(opTypeNews.airbase) >= 0) { return opType.airbases; }
    else if (text.indexOf(opTypeNews.struct) >= 0) { return opType.structures; }
    else if (text.indexOf(opTypeNews.sr) >= 0) { return opType.sr; }
    else if (text.indexOf(opTypeNews.espionage) >= 0) { return opType.espionage; }
    else if (text.indexOf(opTypeNews.intel) >= 0) { return opType.intelligence; }
    else if (text.indexOf(opTypeNews.banks) >= 0) { return opType.banks; }
    else if (text.indexOf(opTypeNews.banks2) >= 0) { return opType.banks; }
    else if (text.indexOf(opTypeNews.food) >= 0) { return opType.food; }
    else if (text.indexOf(opTypeNews.oil) >= 0) { return opType.oil; }
    else if (text.indexOf(opTypeNews.missiles) >= 0) { return opType.missiles; }
    else { return 'default';}
}

function isFailedOp(text) {
    return (text.indexOf(ops.end) >= 0);
}

function setSpyLossesByType(arr, type, losses) {
    if (arr[type]==null) {arr[type] = { 'losses' : losses, 'count' : 1};}
    else {
        arr[type].losses += losses;
        arr[type].count++;
    }
    return arr;
}

function populateNonLossOps(arr, str){
    if (arr[opType.spy] != null){ str += opType.spy + dd + '0' + ld; }
    if (arr[opType.demo] != null){ str += opType.demo + dd + '0' + ld; }
    if (arr[opType.bio] != null){ str += opType.bio + dd + '0' + ld; }
    if (arr[opType.market] != null){ str += opType.market + dd + '0' + ld; }
    if (arr[opType.military] != null){ str += opType.military + dd + '0' + ld; }
    if (arr[opType.alliances] != null){ str += opType.alliances + dd + '0' + ld; }

    return str;
}


//==========================================
//Helper functions to parse data
//==========================================
function getNthOccurance(nthOccurrence, text) {
    var tempStr = text;
    var tempIndex = -1;
    var finalIndex = 0;
    for (var occurrence = 0; occurrence < nthOccurrence; ++occurrence) {
        tempIndex = tempStr.indexOf(" ");
        if (tempIndex == -1) {
            // indexOf(string) returns -1 if it cannot find the substring in the string
            break;
        }
        tempStr = tempStr.substring(++tempIndex);
        finalIndex += tempIndex;
    }
    return finalIndex--;
}
//==========================================
//END: Helper functions to parse data
//==========================================

//==========================================
//NEWS SUMMARY POPUP
//==========================================
function newsPage() {
    myRef = window.open('about:blank','News Summary','left=20,top=20,width=1100,height=700,scrollbars=1');
    myRef.document.body.innerHTML = ''; //FIREFOX OLD
    myRef.document.write('<meta content="Earth" name="keywords"><html><head><meta content="en-us" http-equiv="Content-Language"></head><body background="" bgcolor="black" link="#00C0FF" text="#DDDDDD" vlink="#d3d3d3">');
    myRef.document.write('<h1 style="text-align: center;"><strong>News Summary</strong></h1>');
    var newsData = getSetting( 'NewsData', '' );
    if(newsData === ''){ return; }
    else {
        var hash = [];
        var news_array = newsData.split(td);
        if(news_array.length != 0){
            for (var i=0; i<news_array.length; i++){
                var sub_array = news_array[i].split(ld);
                if(sub_array.length != 0){
                    prepareData(sub_array);
                }
            }
        }
        loadDefends();
		loadOffAlly();
    }
}

function prepareData(sub_array){
    for(var j=0; j<sub_array.length; j++){
        var data = sub_array[j].split('::');
        if (data.length >=3) {
            switch (data[0]) {
                case "TECH_DATA":
                    loadTechTables(sub_array);
                    break;
                case "SALES_DATA":
                    loadSalesTables(sub_array);
                    break;
                case "PURCHASE_DATA":
                    loadPurchaseTables(sub_array);
                    break;
                case "OPS_DATA":
                    loadOpsTables(sub_array);
                    break;
                default:
                    break;
            }
        } else { continue; }
    }
}

function loadTechTables(tech_array){
    var hash = [];
    //set header
    myRef.document.write('<table width="100%" border="1"><tbody><tr bgcolor="#400000"><td style="text-align: center;" colspan="5"><h4>TECH TOTALS</h4></td></tr><tr bgcolor="#400000"><td id="Header_Ally" style="text-align: center;" colspan="2">&nbsp;Tech Ally</td><td id="Header_TechAmount" style="text-align: center;" colspan="3">&nbsp;Tech Amount</td></tr>');
    for(var k=0; k<tech_array.length; k++){
        var data = tech_array[k].split('::');
        if (!data[0]) { continue;}
        if (data.length >= 3) {
            if (hash[data[1]] == null){ hash[data[1]] = (data[2] != null) ? parseInt(data[2]) : 0;}
            else { hash[data[1]] = hash[data[1]] + parseInt(data[2]); }
        } else {
            if (hash[data[0]] == null){ hash[data[0]] = (data[1] != null) ? parseInt(data[1]) : 0;}
            else { hash[data[0]] = hash[data[0]] + parseInt(data[1]); }
        }
    }
    var tech_totals = 0;
    for (var key in hash){
        myRef.document.write('<tr bgcolor="#262626">');
        myRef.document.write('<td style="text-align: center;" colspan="2">'+key.toLocaleString()+'</td>');
        myRef.document.write('<td style="text-align: center;" colspan="3">'+hash[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('</tr>');
        tech_totals = tech_totals+hash[key];
    }
    myRef.document.write('<td style="color: Red; text-align: center;" colspan="2">Total Tech: </td>');
    myRef.document.write('<td style="color: Red; text-align: center;" colspan="3" id="Header_Total">'+tech_totals.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
    myRef.document.write('</tr>');
    myRef.document.write('</table><br><br>');
}

function loadSalesTables(sales_array){
    var hash = [];
    //set header
    myRef.document.write('<table width="100%" border="1"><tbody><tr bgcolor="#400000"><td style="text-align: center;" colspan="12"><h4>SALES TOTALS</h4></td></tr><tr bgcolor="#400000"><td id="Header_Goods" style="text-align: center;" colspan="2">&nbsp;GOODS</td><td id="Header_Volume" style="text-align: center;" colspan="3">&nbsp;VOLUME</td><td id="Header_SalesAmount" style="text-align: center;" colspan="3">&nbsp;TOTAL$</td><td id="Header_SalesCount" style="text-align: center;" colspan="2">&nbsp;NUM SALES</td><td id="Header_AvgCost" style="text-align: center;" colspan="2">&nbsp;AVG COST</td></tr>');
    for(var k=0; k<sales_array.length; k++){
        var data = sales_array[k].split('::');
        if (!data[0]) { continue;}
        if (data.length >= 4) {
            if (hash[data[1]] == null){ hash[data[1]] = (data[2] != null) ? {'sales': parseInt(data[2]), 'count' : 1, 'volume': parseInt(data[3])} : {'sales': 0, 'count' : 1, 'volume': 0};}
        } else {
            if (hash[data[0]] == null){ hash[data[0]] = (data[1] != null) ? {'sales': parseInt(data[1]), 'count' : 1, 'volume': parseInt(data[2])} : {'sales': 0, 'count' : 1, 'volume': 0};}
            else {
                hash[data[0]].sales += parseInt(data[1]);
				hash[data[0]].volume += parseInt(data[2]);
                hash[data[0]].count++;
            }
        }
    }
    var total = 0;
    var total_count = 0;
	var total_volume = 0;
    for (var key in hash){
        myRef.document.write('<tr bgcolor="#262626">');
        myRef.document.write('<td style="text-align: center;" colspan="2">'+key.toLocaleString()+'</td>');
        myRef.document.write('<td style="text-align: center;" colspan="3">'+hash[key].volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
		myRef.document.write('<td style="text-align: center;" colspan="3">'+hash[key].sales.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="text-align: center;" colspan="2">'+hash[key].count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
		myRef.document.write('<td style="text-align: center;" colspan="2">'+(hash[key].sales/hash[key].volume).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('</tr>');
        total += hash[key].sales;
        total_count += hash[key].count;
		total_volume += hash[key].volume;
    }
    myRef.document.write('<td style="color: Red; text-align: center;" colspan="2">Total Sales: </td>');
    myRef.document.write('<td style="color: Red; text-align: center;" colspan="3" id="Header_Volume">'+total_volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
	myRef.document.write('<td style="color: Red; text-align: center;" colspan="3" id="Header_Total">'+total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
    myRef.document.write('<td style="color: Red; text-align: center;" colspan="2" id="Header_Count">'+total_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');	
    myRef.document.write('<td style="color: Red; text-align: center;" colspan="2" id="Header_Empty">&nbsp;</td>');
	myRef.document.write('</tr>');
    myRef.document.write('</table><br><br>');
}

function loadPurchaseTables(array){
    var hash = [];
    //set header
    myRef.document.write('<table width="100%" border="1"><tbody><tr bgcolor="#400000"><td style="text-align: center;" colspan="12"><h4>PURCHASE TOTALS</h4></td></tr><tr bgcolor="#400000"><td id="Header_Goods" style="text-align: center;" colspan="2">&nbsp;GOODS</td><td id="Header_Volume" style="text-align: center;" colspan="3">&nbsp;VOLUME</td><td id="Header_PurchAmount" style="text-align: center;" colspan="3">&nbsp;TOTAL$</td><td id="Header_PurchaseCount" style="text-align: center;" colspan="2">&nbsp;NUM PURCHASES</td><td id="Header_AvgCost" style="text-align: center;" colspan="2">&nbsp;AVG COST</td></tr>');
    for(var k=0; k<array.length; k++){
        var data = array[k].split('::');
        if (!data[0]) { continue;}
        if (data.length >= 5) {
            if (hash[data[1]] == null){ hash[data[1]] = (data[2] != null) ? {'cost': parseInt(data[2]), 'count' : 1, 'avg' : parseInt(data[3]), 'volume' : parseInt(data[4])} : {'cost': 0, 'count' : 1, 'avg' : 0, 'volume': 0};}
        } else {
            if (hash[data[0]] == null){ hash[data[0]] = (data[1] != null) ? {'cost': parseInt(data[1]), 'count' : 1, 'avg' : parseInt(data[2]), 'volume' : parseInt(data[3])} : {'cost': 0, 'count' : 1, 'avg' : 0, 'volume': 0};}
            else {
                hash[data[0]].cost += parseInt(data[1]);
                hash[data[0]].avg += parseInt(data[2]);
				hash[data[0]].volume += parseInt(data[3]);
                hash[data[0]].count++;
            }
        }
    }
    var total = 0;
    var total_count = 0;
	var total_volume = 0;
    for (var key in hash){
        myRef.document.write('<tr bgcolor="#262626">');
        myRef.document.write('<td style="text-align: center;" colspan="2">'+key.toLocaleString()+'</td>');
		myRef.document.write('<td style="text-align: center;" colspan="3">'+hash[key].volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="text-align: center;" colspan="3">'+hash[key].cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="text-align: center;" colspan="2">'+hash[key].count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="text-align: center;" colspan="2">'+(hash[key].avg/hash[key].count).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('</tr>');
        total += hash[key].cost;
        total_count += hash[key].count;
		total_volume += hash[key].volume;
    }
    myRef.document.write('<td style="color: Red; text-align: center;" colspan="2">Total Sales: </td>');
	myRef.document.write('<td style="color: Red; text-align: center;" colspan="3" id="Header_Volume">'+total_volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
    myRef.document.write('<td style="color: Red; text-align: center;" colspan="3" id="Header_Total">'+total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
    myRef.document.write('<td style="color: Red; text-align: center;" colspan="2" id="Header_Count">'+total_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
    myRef.document.write('<td style="color: Red; text-align: center;" colspan="2" id="Header_Empty">&nbsp;</td>');
    myRef.document.write('</tr>');
    myRef.document.write('</table><br><br>');
}

function loadOpsTables(array){
    var failHash = getFailHash();
    var hash = [];
    //set header
    myRef.document.write('<table width="100%" border="1"><tbody><tr bgcolor="#400000"><td style="text-align: center;" colspan="11"><h4>OPS TOTALS</h4></td></tr><tr bgcolor="#400000"><td id="Header_OpType" style="text-align: center;" colspan="2">&nbsp;OP TYPE</td><td id="Header_OpLosses" style="text-align: center;" colspan="3">&nbsp;LOSSES</td><td id="Header_OpTotals" style="text-align: center;" colspan="2">&nbsp;NUM OPS</td><td id="Header_OpFailed" style="text-align: center;" colspan="2">&nbsp;FAILED OPS</td><td id="Header_SpiesKilled" style="text-align: center;" colspan="2">&nbsp;SPIES KILLED</td></tr>');
    for(var k=0; k<array.length; k++){
        var data = array[k].split('::');
        if (!data[0]) { continue;}
        if (data.length >= 3) {
            if (hash[data[1]] == null){ hash[data[1]] = (data[2] != null) ? {'losses': parseInt(data[2]), 'count' : 1} : {'losses': 0, 'count' : 1};}
        } else {
            if (hash[data[0]] == null){ hash[data[0]] = (data[1] != null) ? {'losses': parseInt(data[1]), 'count' : 1} : {'losses': 0, 'count' : 1};}
            else {
                hash[data[0]].losses += parseInt(data[1]);
                hash[data[0]].count++;
            }
        }
    }
    var total = 0;
    var total_count = 0;
    var total_failed_count = 0;
    var total_spies_lost = 0;
    var space = 'N/A';
    for (var key in hash){
        var count = (failHash[key] != null) ? failHash[key].count : 0;
        var spyLosses = (failHash[key] != null) ? failHash[key].losses : 0;
        myRef.document.write('<tr bgcolor="#262626">');
        myRef.document.write('<td style="text-align: center;" colspan="2">'+key.toLocaleString()+'</td>');
        if (key == opType.spy || key == opType.demo || key == opType.bio || key == opType.alliances || key == opType.market || key == opType.military){
            myRef.document.write('<td style="text-align: center;" colspan="3"> N/A </td>');
            myRef.document.write('<td style="text-align: center;" colspan="2"> N/A </td>');
        } else {
            myRef.document.write('<td style="text-align: center;" colspan="3">'+hash[key].losses.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" colspan="2">'+hash[key].count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        }

        myRef.document.write('<td style="text-align: center;" colspan="2">'+count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="text-align: center;" colspan="2">'+spyLosses.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('</tr>');
        total += hash[key].losses;
        total_count += hash[key].count;
        total_failed_count += parseInt(count);
        total_spies_lost += parseInt(spyLosses);
    }
    myRef.document.write('<td style="color: Red; text-align: center;" colspan="2">Totals: </td>');
    myRef.document.write('<td style="color: Red; text-align: center;" colspan="3" id="Header_Total">'+total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
    myRef.document.write('<td style="color: Red; text-align: center;" colspan="2" id="Header_Count">'+total_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
    myRef.document.write('<td style="color: Red; text-align: center;" colspan="2" id="Header_Failed">'+total_failed_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
    myRef.document.write('<td style="color: Red; text-align: center;" colspan="2" id="Header_LostSpies">'+total_spies_lost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
    myRef.document.write('</tr>');
    myRef.document.write('</table><br><br>');
}

function loadDefends() {
    var defendData = getSetting('DefendData', '' );
    if(defendData === ''){ return; }
    myRef.document.write('<table width="100%" border="1"><tbody><tr bgcolor="#400000"><td style="text-align: center;" colspan="16"><h4>Defends</h4></td></tr><tr bgcolor="#400000"><td>&nbsp;</td><td>&nbsp;</td><td id="Header_Stolen" style="text-align: center;" colspan="4">&nbsp;Stolen</td><td>&nbsp;</td><td id="Header_MilLost" style="text-align: center;" colspan="5">&nbsp;My Losses</td><td id="Header_MilKilled" style="text-align: center;" colspan="4">&nbsp;Enemy Losses</td></tr><tr bgcolor="#400000"><td style="text-align: center;">Type</td><td style="text-align: center;">Total</td><td style="text-align: center;">Food</td><td id="Header_Oil" style="text-align: center;">Oil</td><td id="Header_Cash" style="text-align: center;">Cash</td><td id="Header_Tech" style="text-align: center;">Tech</td> 			<td id="Header_Land" style="text-align: center;">Land</td><td id="Header_LostTroops" style="text-align: center;">Troops</td><td id="Header_LostTurrets" style="text-align: center;">Turrets</td><td id="Header_LostTanks" style="text-align: center;">Tanks</td><td id="Header_KilledCivs" style="text-align: center;">Civs</td><td id="Header_KilledBuildings" style="text-align: center;">Buildings</td><td id="Header_KilledTroops" style="text-align: center;">Troops</td><td id="Header_KilledJets" style="text-align: center;">Jets</td><td id="Header_KilledTanks" style="text-align: center;">Tanks</td><td id="Header_ConsumedOil" style="text-align: center;">Oil Consumed</td></tr>');
    var defArray = defendData.split(td);
    if(defArray.length != 0){
        var totoil = 0;
        var totcash = 0;
        var tottech = 0;
        var totfood = 0;
        var totland = 0;
        var totmytroops = 0;
        var totmyturrets = 0;
        var totmytanks = 0;
        var totcivs = 0;
        var totbuildings = 0;
        var tottheirtroops = 0;
        var tottheirjets = 0;
        var tottheirtanks = 0;
        var tottheiroil = 0;
        var totattacks = 0;
        for(var i=0; i<defArray.length; ++i){
            var item = defArray[i].split(dd);
            if (item[0] == '') continue;
            totoil = Number(totoil) + Number(item[2]);
            totcash = Number(totcash) + Number(item[3]);
            totfood = Number(totfood) + Number(item[4]);
            tottech = Number(tottech) + Number(item[5]);
            totland = Number(totland) + Number(item[6]);
            totmytroops = Number(totmytroops) + Number(item[9]);
            totmyturrets = Number(totmyturrets) + Number(item[10]);
            totmytanks = Number(totmytanks) + Number(item[11]);
            totcivs = Number(totcivs) + Number(item[7]);
            totbuildings = Number(totbuildings) + Number(item[8]);
            tottheirtroops = Number(tottheirtroops) + Number(item[12]);
            tottheirjets = Number(tottheirjets) + Number(item[13]);
            tottheirtanks = Number(tottheirtanks) + Number(item[14]);
            tottheiroil = Number(tottheiroil) + Number(item[15]);
            totattacks = Number(totattacks) + Number(item[1]);
            myRef.document.write('<tr bgcolor="#262626">');
            myRef.document.write('<td style="text-align: center;">'+item[0].toLocaleString()+'</td>');
            myRef.document.write('<td style="text-align: center;">'+item[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" id="Header_Food">'+Number(item[4]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" id="Header_Oil">'+Number(item[2]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" id="Header_Cash">$'+Number(item[3]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" id="Header_Tech">'+Number(item[5]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" id="Header_Land">'+Number(item[6]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" id="Header_WeLostTroops">'+Number(item[9]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" id="Header_WeLostTurrets">'+Number(item[10]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" id="Header_WeLostTanks">'+Number(item[11]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" id="Header_WeLostCivs">'+Number(item[7]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" id="Header_WeLostBuild">'+Number(item[8]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" id="Header_TheyLostTroops">'+Number(item[12]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" id="Header_TheyLostJets">'+Number(item[13]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" id="Header_TheyLostTanks">'+Number(item[14]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" id="Header_ConsumedOil">'+Number(item[15]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('</tr>');
        }

        myRef.document.write('<td style="color: Red; text-align: center;" colspan="2">Total Defends: '+totattacks+'</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_Food">'+totfood.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_Oil">'+totoil.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_Cash">$'+totcash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_Tech">'+tottech.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_Land">'+totland.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_WeLostTroops">'+totmytroops.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_WeLostTurrets">'+totmyturrets.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_WeLostTanks">'+totmytanks.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_WeLostCivs">'+totcivs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_WeLostBuild">'+totbuildings.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_TheyLostTroops">'+tottheirtroops.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_TheyLostJets">'+tottheirjets.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_TheyLostTanks">'+tottheirtanks.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_ConsumedOil">'+tottheiroil.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('</tr>');
        myRef.document.write('</table><br><br>');
    }
}

function loadOffAlly() {
    var offAllyData = getSetting('OffAllyData', '' );
    if(offAllyData === ''){ return; }
    myRef.document.write('<table width="100%" border="1"><tbody><tr bgcolor="#400000"><td style="text-align:center" colspan="5"><h4>Off Ally</h4></td></tr><tr bgcolor="#400000"><td>&nbsp;</td><td>&nbsp;</td><td id="Header_Losses" style="text-align:center" colspan="3">&nbsp;Losses</td></tr><tr bgcolor="#400000"><td style="text-align:center">Country</td><td style="text-align:center">Total</td><td style="text-align:center">Troops</td><td id="Header_Oil" style="text-align:center">Jets</td><td id="Header_Cash" style="text-align:center">Tanks</td></tr>');
    var offArray = offAllyData.split(td);
    if(offArray.length != 0){    
        var totmytroops = 0;
        var totmyjets = 0;
        var totmytanks = 0;
        var totattacks = 0;		
        for(var i=0; i<offArray.length; ++i){
            var item = offArray[i].split(dd);
            if (item[0] == '') continue;			
            totmytroops = Number(totmytroops) + Number(item[3]);
            totmyjets = Number(totmyjets) + Number(item[4]);
            totmytanks = Number(totmytanks) + Number(item[5]);
            totattacks = Number(totattacks) + Number(item[2]);
            myRef.document.write('<tr bgcolor="#262626">');
            myRef.document.write('<td style="text-align: center;">'+item[1].toLocaleString()+'</td>');
            myRef.document.write('<td style="text-align: center;">'+item[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" id="Header_WeLostTroops">'+Number(item[3]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" id="Header_WeLostJetss">'+Number(item[4]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('<td style="text-align: center;" id="Header_WeLostTanks">'+Number(item[5]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
            myRef.document.write('</tr>');
        }

        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_Totals">Totals:</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_TotalAttacks">'+totattacks.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_WeLostTroops">'+totmytroops.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_WeLostJetss">'+totmyjets.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_WeLostTanks">'+totmytanks.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
        myRef.document.write('</tr>');
        myRef.document.write('</table><br><br>');
    }
}


function getFailHash(){
    var hash = [];
    var failData = getSetting('FailedData', '' );
    if (failData === ''){ return []; }
    var fail_array = failData.split(ld);
    for(var k=0; k<fail_array.length; k++){
        var data = fail_array[k].split(dd);
        if (data[0] === '') continue;
        hash[data[0]] = { 'losses' : data[1], 'count' : data[2] };
    }
    return hash;
}
//==========================================
// END: NEW SUMMARY POPUP
//==========================================

//==========================================
// MAIN PAGE // SEE ALL NEWS
//==========================================
function compileNewsData() {
    var h = $c("recentnewsitem")[0].innerHTML;
    var x = $c("recentnewsitem")[0].innerHTML = '<span style="text-align: center;" onmouseover="this.style.cursor=\'pointer\';" id="CompileData"><font style="color: Orange; font-size: 12px;">Show News Summary</font></span>'+h;
    $('CompileData').addEventListener("click", function(){newsPage();}, false);

    //load news tsring with data (currently a single string is populated, cannot pass complex obejcts to popup)
    var newsData = document.getElementsByClassName("recentnewscontent");
    if (newsData == null) { return; }
    var tech_string = 'TECH_DATA' + dd;
    var purchase_string = 'PURCHASE_DATA' + dd;
    var sales_string = 'SALES_DATA' + dd;
    var ops_string = 'OPS_DATA' + dd;
    var ops_failed = [];
    var def_hash = [];
	var off_hash = [];
    var def_string = '';
	var off_string = '';
    for (var i=0; i<newsData.length; i++){
        var data = newsData[i].innerHTML;
        if(newsData[i].getElementsByClassName('news').length !== 0 && !isAllyNewsItems(data) && !isMissileItem(data)){
            var def_key = getDefendsKey(data);
            //populate baseline numbers
            if (def_hash[def_key] == null) {
                    def_hash[def_key] = { 'civs'     : 0,
                                         'food'      : 0,
                                         'oil'       : 0,
                                         'cash'      : 0,
                                         'tech'      : 0,
                                         'acres'     : 0,
                                         'buildings' : 0,
                                         'mTroops'   : 0,
                                         'mTanks'    : 0,
                                         'mTurrets'  : 0,
                                         'tTroops'   : 0,
                                         'tJets'     : 0,
                                         'tTanks'    : 0,
                                         'tOil'      : 0,
                                         'total'     : 0,
                                        };
                };
            var nonMilLosses = newsData[i].getElementsByClassName('w40').item(0); //always 1x
            var milLosses = newsData[i].getElementsByClassName('w30'); //always 2x
            var children = nonMilLosses.children;
            for (var n = 0; n < children.length; n++) {
                var tc = children[n];
                if(tc.innerHTML.includes("Civilians")){
                    def_hash[def_key].civs += parseInt(tc.innerHTML.replace(/\D/g,''));
                    continue;
                } else if(tc.innerHTML.includes("Oil Barrels")){
                    def_hash[def_key].oil += parseInt(tc.innerHTML.replace(/\D/g,''));
                    continue;
                } else if(tc.innerHTML.includes("$")){
                    def_hash[def_key].cash += parseInt(tc.innerHTML.replace(/\D/g,''));
                    continue;
                } else if(tc.innerHTML.includes("Technology Points")){
                    def_hash[def_key].tech += parseInt(tc.innerHTML.replace(/\D/g,''));
                    continue;
                } else if(tc.innerHTML.includes("Bushels")){
                    def_hash[def_key].food += parseInt(tc.innerHTML.replace(/\D/g,''));
                    continue;
                } else if(tc.innerHTML.includes("Buildings")){
                    def_hash[def_key].buildings += parseInt(tc.innerHTML.replace(/\D/g,''));
                    continue;
                } else if(tc.innerHTML.includes("Gained")){
                    var start_pos = tc.innerHTML.indexOf('Acres') + 1;
                    var acres = tc.innerHTML.substring(start_pos);
                    def_hash[def_key].acres += parseInt(acres.replace(/\D/g,''));
                    continue;
                }
            }
            for (var n = 0; n < milLosses.length; n++) {
                var item = milLosses.item(n);
                var children = item.children;
                for (var m = 0; m < children.length; m++) {
                    var tc = children[m];
                    var units_sent = 0;
                    if (item.innerText.indexOf('Your military lost') >= 0){
                        if(tc.innerHTML.includes("Troops")){
                            def_hash[def_key].mTroops += parseInt(tc.innerHTML.replace(/\D/g,''));
                            continue;
                        } else if(tc.innerHTML.includes("Turrets")){
                            def_hash[def_key].mTurrets += parseInt(tc.innerHTML.replace(/\D/g,''));
                            continue;
                        } else if(tc.innerHTML.includes("Tanks")){
                            def_hash[def_key].mTanks += parseInt(tc.innerHTML.replace(/\D/g,''));
                            continue;
                        }
                    } else {
                        if(tc.innerHTML.includes("Troops")){
                            def_hash[def_key].tTroops += parseInt(tc.innerHTML.replace(/\D/g,''));
                            units_sent = parseInt(tc.innerHTML.replace(/\D/g,'')) / 0.08;
                            def_hash[def_key].tOil += units_sent / 25;
                            continue;
                        } else if(tc.innerHTML.includes("Jets")){
                            def_hash[def_key].tJets += parseInt(tc.innerHTML.replace(/\D/g,''));
                            units_sent = parseInt(tc.innerHTML.replace(/\D/g,'')) / 0.08;
                            def_hash[def_key].tOil += units_sent / 25;
                            continue;
                        } else if(tc.innerHTML.includes("Tanks")){
                            def_hash[def_key].tTanks += parseInt(tc.innerHTML.replace(/\D/g,''));
                            units_sent = parseInt(tc.innerHTML.replace(/\D/g,'')) / 0.08;
                            def_hash[def_key].tOil += units_sent / 25;
                            continue;
                        }

                    }
                }
            }
            //increment totals
            def_hash[def_key].total++;
        } else if (isOffAllyNewsItems(data)){
			var off_key;
			var country = data.substring(off_start.length, data.indexOf(")")+1).trim();
			off_key = data.substring(data.indexOf("("), data.indexOf(")")+1).trim().replace(/\D/g, "");
			if (off_hash[off_key] == null) {
                    off_hash[off_key] = {'country'	 : country,
										 'mTroops'   : 0,
                                         'mTanks'    : 0,
                                         'mJets'     : 0,
                                         'total'     : 0,
                                        };
                };
			var milLosses = newsData[i].getElementsByClassName('w33'); //always 3x, [0] your losses, [2] ally losses, [2] target losses
			for (var n = 0; n < milLosses.length; n++) {
                var item = milLosses.item(n);
                var children = item.children;
                for (var m = 0; m < children.length; m++) {
                    var tc = children[m];
                    if (item.innerText.indexOf('Your military lost') >= 0){
                        if(tc.innerHTML.includes("Troops")){
                            off_hash[off_key].mTroops += parseInt(tc.innerHTML.replace(/\D/g,''));
                            continue;
                        } else if(tc.innerHTML.includes("Jets")){
                            off_hash[off_key].mJets += parseInt(tc.innerHTML.replace(/\D/g,''));
                            continue;
                        } else if(tc.innerHTML.includes("Tanks")){
                            off_hash[off_key].mTanks += parseInt(tc.innerHTML.replace(/\D/g,''));
                            continue;
                        }
                    }
                }
            }
			//increment totals
            off_hash[off_key].total++;
		}
        //TODO: create sub functions
        if (data.indexOf(tech_start) >= 0 && data.indexOf(tech_end) >= 0){
            var tech_ally = data.substring(data.indexOf(tech_end) + tech_end.length, data.indexOf(")")+1).trim();
            var tech_amount = parseInt(data.substring(data.indexOf(tech_start) + tech_start.length, data.indexOf(tech_end)).replace(/\D/g, ""));

            if (tech_ally !== null && tech_amount !== null){
                tech_string += tech_ally + dd + tech_amount + ld;
            }
        } else if (data.indexOf(sales) >= 0){
            var sales_good = data.substring(getNthOccurance(3, data), data.indexOf(sales_price)).trim();
			var volume = parseFloat(data.substring(getNthOccurance(2, data), getNthOccurance(3, data)).replace(/\D/g, "").trim());
            var income = 0;
            if (data.indexOf(sales_so) >= 0) {
                income = parseFloat(data.substring(data.indexOf(sales_price) + sales_price.length, data.indexOf(sales_so)).replace(/\D/g, ""));
            } else {
                income = parseFloat(data.substring(data.indexOf(sales_price) + sales_price.length, data.indexOf(".")).replace(/\D/g, ""));
            }

            if (sales_good !== null && income !== null && volume !== null){
                sales_string += sales_good + dd + income + dd + volume + ld;
            }
        } else if (data.indexOf(purch) >= 0) {
            var purch_good = data.substring(getNthOccurance(3, data), data.indexOf('at ')).trim();
            var cost = parseFloat(data.substring(data.indexOf(sales_price) + sales_price.length, data.indexOf(purch_so)).replace(/\D/g, ""));
            var buy_price = parseFloat(data.substring(data.indexOf(buy_start) + buy_start.length, data.indexOf(buy_end)).replace(/\D/g, ""));
			var volume = parseFloat(data.substring(getNthOccurance(2, data), getNthOccurance(3, data)).replace(/\D/g, "").trim());

            if (purch_good !== null && cost !== null){
                purchase_string += purch_good + dd + cost + dd + buy_price + dd + volume + ld;
            }
        } else if (data.indexOf(ops.success) >= 0 || data.indexOf(ops.end) >= 0 || data.indexOf('You lost ') >= 0 || data.indexOf(opTypeNews.espionage) >= 0) {
            if (isFailedOp(data)) {
                var fType = getFailedOpType(data);
                if (!(fType=='default')) {
                    ops_failed = setSpyLossesByType(ops_failed, fType, parseInt(data.substring(data.indexOf(ops.start) + ops.start.length,data.indexOf(ops.end)).replace(/\D/g, "").trim()));
                }
            }

            var sType = getSuccessfulOpType(data);;
            var losses = 0;
            if (sType == opType.banks){
                if (server == 'alliance') {
                    losses = parseInt(data.substring(getNthOccurance(6, data), getNthOccurance(7, data)).trim().replace(/\D/g, ""));
                } else {
                    losses = parseInt(data.substring(getNthOccurance(3, data), getNthOccurance(4, data)).trim().replace(/\D/g, "")) + parseInt(data.substring(getNthOccurance(6, data), getNthOccurance(7, data)).trim().replace(/\D/g, ""));
                }
            } else if (sType == opType.food) {
                losses = parseInt(data.substring(getNthOccurance(3, data), getNthOccurance(4, data)).trim().replace(/\D/g, "")) + parseInt(data.substring(getNthOccurance(9, data), getNthOccurance(10, data)).trim().replace(/\D/g, ""));
            } else if (sType == opType.oil){
                losses = parseInt(data.substring(getNthOccurance(3, data), getNthOccurance(4, data)).trim().replace(/\D/g, "")) + parseInt(data.substring(getNthOccurance(9, data), getNthOccurance(10, data)).trim().replace(/\D/g, ""));
            } else {
                losses = parseInt(data.replace(/\D/g, ""));
            }

            if (sType !== 'default' && losses !== null){
                ops_string += sType + dd + losses + ld;
            }
        }
    }

    def_string = populateDefendsString(def_hash);
	off_string = populateOffAllyString(off_hash);

    //successes cannot be tracked for these ops, need to an empty value for tracking
    ops_string = populateNonLossOps(ops_failed ,ops_string);

    var failed_string = '';
    for (var key in ops_failed){
        failed_string += key + dd + ops_failed[key].losses + dd + ops_failed[key].count + ld;
    }
    setSetting("FailedData", failed_string);
    setSetting("NewsData", tech_string+td+sales_string+td+purchase_string+td+ops_string);
}
//==========================================
// END: MAIN PAGE // SEE ALL NEWS
//==========================================

//==========================================
//MAIN
//==========================================

var path = window.location.toString();					// get the URL of the current page
var page = path.substring(path.lastIndexOf('/'));		// extract page name from URL
var server = path.substring(path.indexOf('.com/')+5,path.lastIndexOf('/')); //extract game type
var myRef = false;

switch (page){
    case "/main?allnews=1&":
        compileNewsData();
        break;
    case "/news?allnews=1&":
        compileNewsData();
        break;
    case "/build":
    case "/research":
    case "/market":
    case "/tech": //Market buy Tech
    case "/sell":
    case "/private": //Private Market
    case "/explore": //Explore Page
    case "/war": //War
    case "/main": //mainpage
    case "/spy": //SpyPage
    case "/advisor": //advisor
        cleanCacheData();
        break;
    default:
        break;
}