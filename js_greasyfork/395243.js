// ==UserScript==
// @name         Freebitco.in StatBot
// @namespace    https://greasyfork.org/en/users/435604-esinjay
// @version      1.0
// @description  This script shows the statistics of previous rolls for each given odd and automatically changes the Client Seed for each roll.
// @author       eSinJay
// @license      GPL v.3
// @match        https://freebitco.in/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395243/Freebitcoin%20StatBot.user.js
// @updateURL https://update.greasyfork.org/scripts/395243/Freebitcoin%20StatBot.meta.js
// ==/UserScript==

//------------------------------------------------------------------------ Сonfiguration Values ------------------------------------------------------------------------
const odds = [1.2, 1.5, 2, 4, 6, 8, 10, 12, 16, 24, 32, 48, 94, 452, 4750];
let oddVals = [];
let oddStat = [];
let isBetButtonClicked = false;
let rollsCount = 0;
let tableRowId = 0;
let starterBalance = 0;
let statTableExists = false;
//------------------------------------------------------------------------ Сonfiguration Values ------------------------------------------------------------------------


//------------------------------------------------------------------------ Additional Functions ------------------------------------------------------------------------

function id(id) {

    return document.getElementById(id);

}

function createVariableForOdd(odd) {

    let hiNum = parseInt(Math.round(10000 - (9500 / parseFloat(odd).toFixed(2))));
    let loNum = parseInt(Math.round((9500 / parseFloat(odd).toFixed(2))));

    oddVals[odd] = {
        hiNum: hiNum,
        loNum: loNum
    };

    oddStat[odd] = {
        hiLose: 0,
        hiMaxSeqLose: 0,
        hiWinCount: 0,
        loLose: 0,
        loMaxSeqLose: 0,
        loWinCount: 0
    };

}

function isBetButtonDisabled(mod) {

    return id('double_your_btc_bet_' + mod + '_button').getAttribute('disabled');

}

function generateRandomString(comb, minLength, maxLength) {

    let randomString = '';
    let characters = '';
    let numbers = '0123456789';
    let upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    let length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    if (comb == 'random') comb = Math.floor(Math.random() * 7);

    switch (comb) {

        case 1:
            characters = numbers;
            break;
        case 2:
            characters = upperCaseLetters;
            break;
        case 3:
            characters = lowerCaseLetters;
            break;
        case 4:
            characters = numbers + upperCaseLetters;
            break;
        case 5:
            characters = numbers + lowerCaseLetters;
            break;
        case 6:
            characters = upperCaseLetters + lowerCaseLetters;
            break;
        default:
            characters = numbers + upperCaseLetters + lowerCaseLetters;

    }

    for (let i = 0; i < length; i++) {

        randomString += characters.charAt(Math.floor(Math.random() * characters.length));

    }

    return randomString;

}

//------------------------------------------------------------------------ Additional Functions ------------------------------------------------------------------------


//------------------------------------------------------------------------------ Main Code -----------------------------------------------------------------------------

let rollStat = {


    update: function() {

        let currentBalance = (Number(parseFloat(id('balance').textContent)) + Number(parseFloat(id('bonus_account_balance').textContent))).toFixed(8);
        let profit = (currentBalance - starterBalance).toFixed(8);

        rollsCount += 1;

        odds.forEach(this.setVals);

        if (statTableExists === false) this.setTable(currentBalance);

        id('stat-rolls-count').innerHTML = '<span style="color:#039">Rolls played : </span>' + rollsCount;
        id('stat-starter-balance').innerHTML = '<span style="color:#039">Starter balance : </span>' + starterBalance;
        id('stat-current-balance').innerHTML = '<span style="color:#039">Current balance : </span>' + currentBalance;
        id('stat-profit1').innerHTML = '<span style="color:#039">Profit : </span>' + profit;

        odds.forEach(function(odd) {

            tableRowId += 1;

            id('stat-table-td-hilose' + tableRowId).textContent = oddStat[odd].hiLose;
            id('stat-table-td-himaxseqlose' + tableRowId).textContent = oddStat[odd].hiMaxSeqLose;
            id('stat-table-td-hiwincount' + tableRowId).textContent = oddStat[odd].hiWinCount;
            id('stat-table-td-lolose' + tableRowId).textContent = oddStat[odd].loLose;
            id('stat-table-td-lomaxseqlose' + tableRowId).textContent = oddStat[odd].loMaxSeqLose;
            id('stat-table-td-lowincount' + tableRowId).textContent = oddStat[odd].loWinCount;

        });

        tableRowId = 0;

    },

    setVals: function(odd) {

        let prevRollNum = parseInt(id('previous_roll').textContent);

        if (prevRollNum > oddVals[odd].hiNum) {

            oddStat[odd].hiWinCount += 1;
            oddStat[odd].hiLose = 0;

        } else {

            oddStat[odd].hiLose += 1;
            if (oddStat[odd].hiLose > oddStat[odd].hiMaxSeqLose) oddStat[odd].hiMaxSeqLose += 1;

        }

        if (prevRollNum < oddVals[odd].loNum) {

            oddStat[odd].loWinCount += 1;
            oddStat[odd].loLose = 0;

        } else {

            oddStat[odd].loLose += 1;
            if (oddStat[odd].loLose > oddStat[odd].loMaxSeqLose) oddStat[odd].loMaxSeqLose += 1;

        }

    },

    setTable: function(currentBalance) {

        let hStyle = [];
        hStyle = document.getElementsByTagName('head');

        hStyle[0].insertAdjacentHTML('beforeend',
            ' <style>#stat-table1{font-family:"Lucida Sans Unicode","Lucida Grande",Sans-Serif;font-size:16px;background:none;width:868px;margin-left:auto; margin-right:auto;margin-bottom:50px;border-collapse: collapse;border:none}#stat-table1 th{font-weight:400;color:#039;text-align:center;border-bottom:2px solid #6678b1;padding:6px 8px}#stat-table1 td{border-bottom:1px solid #8c98bf;color:#669;text-align:center;padding:7px 8px}#stat-table1 tr:hover td{background:#a8c7e0}.tborder-r{border-right:2px solid #6678b1}.tborder-r1{border-right:1px solid #8c98bf}#stat-table1 .tfont-c1{color:#09f}#stat-table1 .tfont-c2{color:#000}#stat-table1 .tfont-c3{color:#c00}#stat-table1 .tfont-c4{color:#37a661}.odd11{font-weight:bold}</style> ');


        id('double_your_btc_main_container_outer').insertAdjacentHTML('afterend', '<table style = "border:none;background:none; width:868px; text-align:center; font-weight:bold;margin-bottom:0px;font-size:14px;color:#333"><tr style="padding:0px;height:36px;line-height:36px"><td id="stat-rolls-count"><span style="color:#039">Rolls played : </span>' + rollsCount + '</td><td id="stat-starter-balance"><span style="color:#039">Starter balance : </span>' + starterBalance + '</td><td id="stat-current-balance"><span style="color:#039">Current balance : </span>' + currentBalance + '</td><td id="stat-profit1"><span style="color:#039">Profit : </span>' + (currentBalance - starterBalance).toFixed(8) + '</td></tr></table>      <table id = "stat-table1"><tr><th class="tborder-r">Odd</th><th>Target (HI)</th><th> Lose </th><th>Max Lose</th><th class="tborder-r1">Win Count</th><th>Target (LO)</th><th> Lose </th><th>Max Lose</th><th>Win Count</th></tr></table>');

        odds.forEach(function(odd) {

            tableRowId += 1;

            id('stat-table1').insertAdjacentHTML('beforeend', '<tr><td class="tborder-r odd11">' + odd + '</td><td class="tfont-c1">' + oddVals[odd].hiNum + '</td><td id="stat-table-td-hilose' + tableRowId + '" class="tfont-c2">0</td><td id="stat-table-td-himaxseqlose' + tableRowId + '" class="tfont-c3">0</td><td id="stat-table-td-hiwincount' + tableRowId + '" class="tborder-r1 tfont-c4">0</td><td class="tfont-c1">' + oddVals[odd].loNum + '</td><td id="stat-table-td-lolose' + tableRowId + '" class="tfont-c2">0</td><td id="stat-table-td-lomaxseqlose' + tableRowId + '" class="tfont-c3">0</td><td id="stat-table-td-lowincount' + tableRowId + '" class="tfont-c4">0</td></tr>');

        });

        tableRowId = 0;
        statTableExists = true;

    }



};

function init(mod) {

    if (isBetButtonDisabled(mod) == 'disabled') {

        isBetButtonClicked = true;

        return

    } else {

        if (isBetButtonClicked === true) {

            id('next_client_seed').value = generateRandomString('random', 3, 20);
            rollStat.update();
            isBetButtonClicked = false;

        } else {

            return

        }
    }

}

id('double_your_btc_bet_hi_button').addEventListener("DOMSubtreeModified", function() {

    init('hi');

});

id('double_your_btc_bet_lo_button').addEventListener("DOMSubtreeModified", function() {

    init('lo');

});

starterBalance = (Number(parseFloat(id('balance').textContent)) + Number(parseFloat(id('bonus_account_balance').textContent))).toFixed(8);

odds.forEach(createVariableForOdd);

rollStat.setTable(starterBalance);

//------------------------------------------------------------------------------ Main Code -----------------------------------------------------------------------------