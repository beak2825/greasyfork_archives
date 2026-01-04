// ==UserScript==
// @name         Ironwood RPG - Guild Members Overview
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Adds an button to the guild page that displays a quick overview of all members' stats. As of v1.4, can also save all stats to a CSV file with one click.
// @author       Cascade
// @match        https://ironwoodrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ironwoodrpg.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/503322/Ironwood%20RPG%20-%20Guild%20Members%20Overview.user.js
// @updateURL https://update.greasyfork.org/scripts/503322/Ironwood%20RPG%20-%20Guild%20Members%20Overview.meta.js
// ==/UserScript==

// social credit calculation
// should add up to 1 for social credits to add up to 100%
const social_credit_weight = {
    xp_weight: 0.92,
    gold_weight: 0.08,
}

// weighted coins calculation
const donation_weight = {
    building: 1.1,
    quest: 5,
    raw: 0.9,
}

//import
function C(t) { try { let e = parse(t), s = document.createElement(e.element); return e.parentSelector ? document.querySelectorAll(e.parentSelector)[0].appendChild(s) : document.body.appendChild(s), e.textContent && (s.textContent = e.textContent), e.id && (s.id = e.id), e.style && (s.style = e.style), e.classes && e.classes.split(" ").forEach(t => { s.classList.add(t) }), e.attributes && e.attributes.split(",").forEach(t => { let e = t.split(":"), r = e[0].trim(), l = e[1].trim(); s.setAttribute(r, l) }), s } catch (r) { console.error("Error creating element: " + r) } } const sub = (t, e) => t.split("").find(t => e.includes(t)) ? t.split("").slice(0, t.split("").findIndex(t => e.includes(t))).join("") : t; function parse(t) { let e = { "@": "parentSelector", "#": "id", ":": "textContent", "*": "style", "%": "classes", "&": "attributes" }, s = {}; return s.element = sub(t, Object.keys(e)).trim(), Object.entries(e).forEach(([e, r]) => { let l = RegExp(`\\${e}<([^>]*)>`), n = t.match(l); n && (s[r] = n[1]) }), s }
function handleNavigation() {
    if (window.location.href.indexOf("guild") != -1){
        if(!document.getElementById('GuildMembersOverview-Overview') && !document.getElementById('GuildMembersOverview-CSV'))
            create();
    } else {
        closeOverview();
    }
}
setInterval(handleNavigation,1000);

function commas(num, roundWhole = false) {
    const roundedNum = roundWhole ? Math.round(num) : Math.round(num * 100) / 100;
    return roundedNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
var ATTRIBUTE = '';
function create() {
    let btn = document.createElement('button');
    let card = $('guild-component').find('div.card').find('div.header:contains("Menu")').closest('div.card');
    if(card.length > 0){ card = card[0]; }
    else { console.warn('[Guild Members Overview] Cant find card'); return; }

    ATTRIBUTE = yoinkGameAttributeName(card);

    btn.toggleAttribute(ATTRIBUTE);
    btn.id = "GuildMembersOverview-Overview";
    btn.textContent = "Overview";
    btn.classList.add('row');
    card.appendChild(btn);
    btn.addEventListener('click', () => {open(false)});


    let csvbtn = document.createElement('button');
    csvbtn.toggleAttribute(ATTRIBUTE);
    csvbtn.id = "GuildMembersOverview-CSV";
    csvbtn.textContent = "Download as CSV";
    csvbtn.classList.add('row');
    card.appendChild(csvbtn);
    csvbtn.addEventListener('click', () => {open(true)});

    let comparebtn = document.createElement('button');
    comparebtn.toggleAttribute(ATTRIBUTE);
    comparebtn.id = "GuildMembersOverview-Compare";
    comparebtn.textContent = "Compare";
    comparebtn.classList.add('row');
    card.appendChild(comparebtn);
    comparebtn.addEventListener('click', () => {compare()});


}

function relativeTime(timestamp) {
    const now = Date.now();
    const secondsDiff = Math.floor((now - timestamp) / 1000);
    const daysDiff = Math.floor(secondsDiff / 86400); // 86400 seconds in a day

    if (daysDiff === 0) {
        return 'Today';
    } else if (daysDiff === 1) {
        return '1 day ago';
    } else {
        return `${daysDiff} days ago`;
    }
}

async function compare(){
    let modalBg = document.createElement('div');
    modalBg.toggleAttribute(ATTRIBUTE);
    modalBg.id = 'guildComparisonModal';
    modalBg.style = '';
    $('body:first')[0].appendChild(modalBg);
    modalBg.addEventListener('click', closeCompare);

    let modalCont = document.createElement('div');
    modalCont.id = 'guildComparisonModalContainer';
    modalBg.appendChild(modalCont);

    let overviewText = document.createElement('div');
    modalCont.appendChild(overviewText);
    overviewText.toggleAttribute(ATTRIBUTE);
    overviewText.textContent = "Compare";
    overviewText.id = "guildComparisonTitle";
    overviewText.style = `
     font-weight: 700;
     font-size: 25px;
    `;

    modalBg.classList.add('guildModal')
    modalCont.classList.add('guildModalCont')

    $('#guildComparisonModalContainer').click(function(e) {
        e.stopPropagation();
        // do something
    });

    //? example: C('button @<div.container> #<submitButton> :<Submit> *<display: flex;> %<myButton myClass> &<name:Button,disabled:true>');
    let firstFileInput = C('input @<#guildComparisonModalContainer> #<fileInput1> &<type:File,accept:.csv>')
    let secondFileInput = C('input @<#guildComparisonModalContainer> #<fileInput2> &<type:File,accept:.csv>')
    let calcBtn = C('button @<#guildComparisonModalContainer> #<calcFromDataBtn> :<Calculate> %<guildCompareCalcBtn>')
    calcBtn.onclick = compareCalc;
    calcBtn.toggleAttribute(ATTRIBUTE);

    const checkFiles = () => {
      calcBtn.disabled = !(firstFileInput.files.length > 0 || secondFileInput.files.length > 0);
    };

    checkFiles()

    firstFileInput.addEventListener('change', checkFiles);
    secondFileInput.addEventListener('change', checkFiles);
}

function csvToMap(csv) {
  const [headers, ...rows] = csv.trim().split("\n").map(row => row.split(","));

  return new Map(
    rows.map(row => {
      const obj = headers.reduce((acc, header, index) => {
        acc[header] = isNaN(row[index]) ? row[index] : +row[index];
        return acc;
      }, {});

      return [obj.Name, obj];
    })
  );
}

async function readFile(fileInput) {
    const file = fileInput.files[0]
    if (file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                resolve(e.target.result);
            };
            reader.onerror = function (e) {
                reject(new Error("Error reading file"));
            };
            reader.readAsText(file);
        });
    } else {
        throw new Error("No file selected");
    }
}

//returns the difference from the stat in the entire guild from the 2 data points (secondnd - first)
function reduceGuildStats(dataIn, stat){
    const totalSum = dataIn.reduce((sum, entry) => sum + entry[1]['data'][stat], 0);
    return totalSum;
}

function weightCoinDonations(raw, quest, building){
    return (building * donation_weight.building + quest * donation_weight.quest + raw * donation_weight.raw);
}

//CALCULATE AND ADD info like social credit to data, only use for displaying data
// this was originally intended for DELTA DATA. however, it COULD work for non delta data, it's recommended to say isDeltaData = false tho when putting in non delta data.
function addRatio(data, isDeltaData = true) {
    const entries = Object.entries(data);

    const questContributionDif = reduceGuildStats(entries, 'Quest Items');
    const buildContributionDif = reduceGuildStats(entries, 'Building Items');
    const goldContributionDif = reduceGuildStats(entries, 'Total Contribution') - questContributionDif - buildContributionDif;

    const XPContributionDif = reduceGuildStats(entries, 'XP Contribution');
    const weightContributionDif = weightCoinDonations(goldContributionDif, questContributionDif, buildContributionDif);

    entries.forEach(entry => {
        const userQuestContributionDif = entry[1]['data']['Quest Items'];
        const userBuildContributionDif = entry[1]['data']['Building Items'];
        const userGoldContributionDif = entry[1]['data']['Total Contribution'] - userQuestContributionDif - userBuildContributionDif;

        const userXPContributionDif = entry[1]['data']['XP Contribution'];
        const userWeightContributionDif = weightCoinDonations(userGoldContributionDif, userQuestContributionDif, userBuildContributionDif);

        const ratio = (userXPContributionDif / XPContributionDif * social_credit_weight.xp_weight + (userWeightContributionDif / weightContributionDif) * social_credit_weight.gold_weight) * 100;
        entry[1].data['Weighted Coins'] = userWeightContributionDif;
        if(isDeltaData)
            entry[1].data['Social Credit'] = ratio; // BECAUSE HAVING OVERALL SOCIAL CREDIT WOULD SCREW EVERYONE WHO STARTED IN THE GUILD EARLY. SO IT SHOULD BE ONLY DELTA FROM 2 POINTS
    });

    return Object.fromEntries(entries); // Return as an object
}

async function compareCalc(){
    function turnCombinedMapIntoData(sharedMap, number1, number2, onlyOneTimestamp = false){
        const resultArray = Array.from(sharedMap.entries()).map(([key, values]) => {
            if(!onlyOneTimestamp){
                const value1 = values[number1];
                const value2 = values[number2];

                // Calculate the differences for all properties
                const differences = {};
                for (const prop in value1) {
                    if (value1.hasOwnProperty(prop) && typeof value1[prop] === 'number') {
                        differences[prop] = -1 * (value1[prop] - value2[prop]);
                    }
                }
                return {
                    name: key,
                    data: differences
                };
            } else {
                delete values.Name
                return {
                    name: key,
                    data: values
                };
            }
        });

        return resultArray;
    }

    let fileIn1 = $('#fileInput1')[0];
    let fileIn2 = $('#fileInput2')[0];
    if(!fileIn1.files.length > 0 || !fileIn2.files.length > 0){

        if(!fileIn1.files.length > 0) //no file 1, must mean file 2 is in
            fileIn1 = fileIn2;

        let timestamp0 = num(fileIn1.files[0].name);
        $('#guildComparisonTitle')[0].textContent = word(fileIn1.files[0].name) + ", " + relativeTime(timestamp0)
        let data0 = csvToMap(await readFile(fileIn1))

        //clear old objects
        $('#fileInput1').remove()
        $('#fileInput2').remove()
        $('#calcFromDataBtn').remove()
        TABLE(addRatio(turnCombinedMapIntoData(data0,-1,-1,true), false), $('#guildComparisonModalContainer')[0], false);

        return;
    }
    let timestamp1 = num(fileIn1.files[0].name);
    let timestamp2 = num(fileIn2.files[0].name);
    if(timestamp1 === timestamp2){
        console.warn('you gotta pick 2 different time points idiot, ' + timestamp1 + " vs " + timestamp2)
        return;
    }
    let data1 = csvToMap(await readFile(fileIn1))
    let data2 = csvToMap(await readFile(fileIn2))
    let g1 = word(fileIn1.files[0].name);
    let g2 = word(fileIn2.files[0].name);
    $('#guildComparisonTitle')[0].textContent = g1 === g2 ? g1 + ", " + relativeTime(timestamp1) + " vs " + relativeTime(timestamp2) : g1 + ", " + relativeTime(timestamp1) + " vs " + g2 + ", " + relativeTime(timestamp2) + " (not intended)"


    function compareMaps(map1, map2, number1, number2) {
        const sharedMap = new Map();

        for (const [key, value1] of map1.entries()) {
            if (map2.has(key)) {
                const value2 = map2.get(key);
                sharedMap.set(key, {
                    [number1]: value1,
                    [number2]: value2
                });
            }
        }
        return sharedMap;
    }

    let combinedData;

    let formattedData;
    //make sure it's in order. i don't know why I just want it to be that way
    if(timestamp1 > timestamp2){
        combinedData = compareMaps(data2, data1, timestamp2, timestamp1);
        formattedData = turnCombinedMapIntoData(combinedData, timestamp2, timestamp1);
        let tempstamp = timestamp1;
        timestamp1 = timestamp2;
        timestamp2 = tempstamp;

    } else {
        combinedData = compareMaps(data1, data2, timestamp1, timestamp2);
        formattedData = turnCombinedMapIntoData(combinedData, timestamp1, timestamp2);
    }

    console.log(formattedData)
    formattedData = addRatio(formattedData);


    //clear old objects
    $('#fileInput1').remove()
    $('#fileInput2').remove()
    $('#calcFromDataBtn').remove()

    //create graph
    TABLE(formattedData, $('#guildComparisonModalContainer')[0], true);
}

var membersBtn;
async function open(isCsv = false) {
    membersBtn = $('div.name:contains("Menu")').closest('div.card').find('div.name:contains("Members")').closest('button')[0];
    membersBtn.addEventListener('click', isCsv ? membersClickedCsv : membersClicked);
    membersBtn.click();

}

async function membersClicked(){
    membersBtn.removeEventListener('click', membersClicked);
    generateTable(await grab());
}
async function membersClickedCsv(){
    membersBtn.removeEventListener('click', membersClickedCsv);
    csv(await grab(true));
}


async function csv(data){
    const titleKeys = Object.keys(data[0])
    const refinedData = []
    refinedData.push(titleKeys)
    data.forEach(item => {
        refinedData.push(Object.values(item))
    })
    let csvContent = '';
    refinedData.forEach(row => {
        csvContent += row.join(',') + '\n'
    })
    csvContent = csvContent.slice(0, -1);
    download(csvContent);
}

async function download(csv){
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8,' })
    const objUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', objUrl)
    link.setAttribute('download', guildName() + '-' + Date.now() + '.csv')
    link.click()
}

async function grab(csvFormat = false){
    let membersBtns = $('guild-page').find('div.name:contains("Members")').first().closest('div.card').find('button.row').toArray();
    let obj = {};
    if(csvFormat) {obj = [];}
    let i = 0;
    for(let btn of membersBtns){
        btn.click();
        let res = await each(csvFormat);
        if(csvFormat) {
            let newObj = {};
            newObj.Name = res.name;
            obj[i] = Object.assign(newObj, res.data);
        } else {
            obj[i] = {name: res.name, data: res.data};
        }
        i++;
    }
    return obj;
}

async function each(csvFormat = false){
    let Q = $('div.modal').find('div.preview').find('div.name:contains("Member")').closest('div.preview').find('div.row');
    if(Q.length < 0) {
        console.warn('[Guild Members Overview] Cannot find member info, trying again in 10ms');
        console.log(Q);
        await sleep(10);
        return each();
    } else {
        let name_ = 'Unknown';
        let data_ = {};
        for(let row of Q.toArray()){
            let stat = row.children[0].textContent.trim();
            let val = row.children[1].textContent.trim();
            if(stat === 'Name'){
                name_ = val;
                continue;
            }
            if(stat === 'Name'){} else {
                //if(csvFormat)
                    val = num(val);
            }
            data_[stat] = val;
        }

        await closeModal();

        return {name: name_, data: data_};
    }
}

async function closeModal(){
    let Q = $('div.modal').find('div.preview').find('div.name:contains("Member")').closest('div.preview').find('button.close');
    if(Q.length > 0) {
        Q[0].click();
        return;
    } else {
        if($('div.modal').find('div.preview').find('div.name:contains("Member")').closest('div.preview').length > 0){
            console.warn('[Guild Members Overview] Cannot find modal close button, trying again in 10ms');
            await sleep(10);
            return closeModal();
        } else {
            //there is no modal, so no need to close
            return;
        }
    }
}
function guildName(){
    return $('div.tracker.ng-star-inserted').find('div.name')[0].textContent.trim();
}

let lastSelectedCellColumn;
function closeOverview() {
    let e = document.getElementById('guildOverviewModal');
    if(e) e.remove();
}
function closeCompare() {
    let e = document.getElementById('guildComparisonModal');
    if(e) e.remove();
}

function TABLE(data, where, useRelative = false, columnsToStraightUpIgnore = ['joined', 'last contribution'], columnsToAddPercent = ['social credit'], columnsToNotUseRelativeEver = ['social credit']){
    // creates a <table> element and a <tbody> element
    const tbl = document.createElement("table");
    tbl.id = 'memberOverviewTable';

    const tblBody = document.createElement("tbody");
    tblBody.id = 'memberOverviewTableBody';

    Object.keys(data).forEach(key => {
        const userData = data[key];
        if (userData && userData.data && typeof userData.data === 'object') {
            Object.keys(userData.data).forEach(innerKey => {
                if (columnsToStraightUpIgnore.includes(innerKey.toLowerCase())) {
                    delete userData.data[innerKey];
                }
            });
        } else {
            console.error("User data is not an object:", userData);
        }
    });


    // creating all cells
    //if (!columnsToStraightUpIgnore.includes(Object.keys(data[0].data)[column - 1].toLowerCase()))

    let rows = Object.keys(data).length + 1;
    let columns = Object.keys(data[0].data).length + 1;
    for (let i = 0; i < rows; i++) {
        // creates a table row
        const rowElem = document.createElement("tr");

        for (let j = 0; j < columns; j++) {
            let row = i; let column = j;
            let text = 'Name';
            let weight = 0;
            if(column === 0 && row > 0){
                text = data[row - 1].name;
            }else
            if(row === 0 && column > 0){
                text = Object.keys(data[0].data)[column - 1];
                weight = 700;
            } else if (row !== 0 && column !== 0) {
                let numData = data[row - 1].data[Object.keys(data[0].data)[column - 1]];
                let addPercent = columnsToAddPercent.some(term => Object.keys(data[0].data)[column - 1].toLowerCase().includes(term));
                if(numData > 0 && useRelative && !columnsToNotUseRelativeEver.some(term => Object.keys(data[0].data)[column - 1].toLowerCase().includes(term)))
                    text = '+' + commas(numData) + (addPercent ? '%' : '');
                else {
                    text = commas(numData) + (addPercent ? '%' : '');
                }
            } else weight = 700;

            const cell = document.createElement("td");
            const cellText = document.createTextNode(text);
            cell.appendChild(cellText);
            rowElem.appendChild(cell);
            if(weight > 0){
                cell.style = 'font-weight: ' + weight + ' !important;'
            }

            if(row === 0 && column > 0){
                cell.addEventListener('click', () => {
                    sortBy(column);
                    cell.classList.add('selectedSort');
                    if(lastSelectedCellColumn)
                    {
                        document.getElementById('memberOverviewTableBody').children[0].children[lastSelectedCellColumn].classList.remove('selectedSort');
                    }
                    lastSelectedCellColumn = column;
                })
            }
        }

        // add the row to the end of the table body
        tblBody.appendChild(rowElem);
    }

    tbl.appendChild(tblBody);
    where.appendChild(tbl);
    // sets the border attribute of tbl to '2'
    tbl.setAttribute("border", "2");
}

function generateTable(data) {
    let modalBg = document.createElement('div');
    modalBg.toggleAttribute(ATTRIBUTE);
    modalBg.id = 'guildOverviewModal';
    modalBg.style = '';
    $('body:first')[0].appendChild(modalBg);
    modalBg.addEventListener('click', closeOverview);
    modalBg.classList.add('guildModal');

    let modalCont = document.createElement('div');
    modalCont.id = 'guildOverviewModalContainer';
    modalBg.appendChild(modalCont);
    modalCont.classList.add('guildModalCont');

    let overviewText = document.createElement('div');
    modalCont.appendChild(overviewText);
    overviewText.toggleAttribute(ATTRIBUTE);
    overviewText.textContent = guildName();
    overviewText.style = `
     font-weight: 700;
     font-size: 25px;
    `;

    $('#guildOverviewModalContainer').click(function(e) {
        e.stopPropagation();
        // do something
    });

    data = addRatio(data, false);

    TABLE(data, modalCont);
}

function sortBy(columnNum){
    var table = document.getElementById("memberOverviewTable");
    var rows = Array.from(table.rows).slice(1); // Exclude the header row

    rows.sort(function(rowA, rowB) {
        var cellA = rowA.cells[columnNum].innerText;
        var cellB = rowB.cells[columnNum].innerText;

        return num(cellB) - num(cellA); // Sort in descending order
    });

    // Re-attach sorted rows to the table body
    rows.forEach(function(row) {
        table.appendChild(row);
    });
}
function num(str) {
    let last = str.length > 0 ? str.slice(-1) : '';
    let secondlast = str.length > 1 ? str[str.length - 2] : '';
    let modified = str.replace(/[^0-9.]/g, ' ');

    // Remove the dot if it is surrounded by two blank spaces
    modified = modified.replace(/ {2}\.\s+/g, ' ');

    // Remove all blank spaces
    modified = modified.replace(/\s+/g, '');

    // Convert stripped value to a number
    let numberValue = Number(modified);
    if(str.length > 0 && str[0] == '-') numberValue = -numberValue;

    if (isNaN(numberValue)) return NaN; // Handle invalid numbers

    if (!isNaN(secondlast)) {
        if (last === 's') return numberValue; // seconds
        if (last === 'm') return numberValue * 60; // minutes
        if (last === 'h') return numberValue * 3600; // hours
        if (last === 'd') return numberValue * 3600 * 24; // days
        return numberValue; // return as is if no suffix
    } else {
        return numberValue; // return as is if no suffix
    }
}
function word(str) {
    const beforeDot = str.split('.')[0];
    const letters = beforeDot.match(/[a-zA-Z]/g);
    return letters ? letters.join('') : '';
}
function strip(str){return str.replace(/[^0-9.]/g, '');}

setTimeout(function() {
  //super dark #061a2e
  //dark #0d2234
  //regular #162b3c
  //light #1c2f40
    var css = `
        .guildModal {
           z-index:99999;
           position: fixed !important;
           background-color: rgba(0, 0, 0, 0.5);
           top:0;
           bottom: -1500px;
           overflow:scroll;
           width: 100%;
           height:100%;
           margin: 0;
           text-align:center;
           display:flex;
           flex-direction: column;
           align-items:center;
           padding-top: 100px;
           padding-bottom: 100px;
           justify-content:start;
        }
        .guildModalCont {
           padding: 10px;
           border: 10px solid rgb(13, 34, 52);
           border-radius: 10px;
           background-color: rgb(13, 34, 52);
           gap: 10px;
           overflow:auto;
           display:flex;
           flex-direction: column;
           position: relative;
           max-width:100%;
           max-height:100%;
        }
        td.selectedSort {
            background-color: rgb(35, 70, 90);
        }
        table {
           border:1px solid #263849;
           border-spacing: 0px;
           max-width:100%;
           max-height:100%;
        }
        th, td {
          padding:2px !important;
          border: 1px solid #263849;
          opacity: 1;
          transition: 0.1s ease;
          font-size:16px;
        }
        td:hover {
            background-color: rgb(24, 55, 77);
        }
        tr:hover {
            background-color: rgb(16, 42, 64);
        }
        .guildCompareCalcBtn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            height: 40px;
            font-weight: 600;
            letter-spacing: .25px;

          background-color: #1c2f40 !important;
          padding-left:30px !important;
          padding-right:30px !important;
          margin-right: 12px !important;
          margin-left: 0px !important;
          transition: 0.2s ease;
        }
        .guildCompareCalcBtn:hover:not(:disabled) {
          background-color: #65aadb !important;
        }
    `;

    var style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    document.head.appendChild(style);
}, 500);

function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms))}
function wait(delay) {  return new Promise((resolve, reject) => {    setTimeout(() => {      resolve();    }, delay);  });}
function yoinkGameAttributeName(elem){for (let i = 0; i < elem.attributes.length; i++){if(elem.attributes[i].nodeName.includes('_ngcontent-')){return elem.attributes[i].nodeName;}}}