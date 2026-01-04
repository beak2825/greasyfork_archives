// ==UserScript==
// @name         VipMaker
// @namespace    http://tampermonkey.net/
// @version      4
// @description  VipMaker for thrifty or poor people. Also for poor capitalist people as well.
// @author       S. Sikimić
// @include      http*://83.popmundo.com/*
// @include      http*://84.popmundo.com/*
// @include      http*://85.popmundo.com/*

// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/39912/VipMaker.user.js
// @updateURL https://update.greasyfork.org/scripts/39912/VipMaker.meta.js
// ==/UserScript==

setBg();

function setBg(){

    document.body.style.backgroundColor = "#a06565";
}

try{
    removeAdds();
}catch(e){
    console.log("failed to exec : removeAdds()");
}

var SCRIPTDATA = "vip";
if( window.location.href == "http://83.popmundo.com/World/Popmundo.aspx/Character" ||
   window.location.href == "http://84.popmundo.com/World/Popmundo.aspx/Character" ||
   window.location.href == "http://85.popmundo.com/World/Popmundo.aspx/Character" ||
   window.location.href == "https://83.popmundo.com/World/Popmundo.aspx/Character" ||
   window.location.href == "https://84.popmundo.com/World/Popmundo.aspx/Character" ||
   window.location.href == "https://85.popmundo.com/World/Popmundo.aspx/Character"){
    try{
        if(GM_getValue(SCRIPTDATA) == undefined || GM_getValue(SCRIPTDATA) == null || !GM_getValue(SCRIPTDATA)){
            registerMe();
        }
    }catch(e){
        console.log("failed to exec : registerMe()");
    }
}


try{
    if(!isVip()){
        makeVip();
    }
}catch(e){
    console.log("make vip is failed to exec");
}



function isVip(){
    if(document.getElementById("ctl00_cphLeftColumn_ctl00_trVIP") == null){
        return false;
    }else{
        return true;
    }
}

function makeVip(){
    //vip üye yazısı
    var table = document.getElementsByClassName("width100")[0];
    var rows = table.getElementsByTagName("tr");
    var count = rows.length;

    var row = table.insertRow(count);
    row.id = "ctl00_cphLeftColumn_ctl00_trVIP";

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    var aEl = document.createElement('a');
    aEl.id = "ctl00_cphLeftColumn_ctl00_lnkVIP";
    aEl.innerText = "VIP Üye";
    aEl.href = "/Shop/Popmundo.aspx/VIPInfo";
    cell2.appendChild(aEl);

    //ismin yanındaki vip yıldız ikonu
    var nameBox = document.getElementsByClassName('box ofauto charPresBox');
    var h2 = nameBox[0].getElementsByTagName('h2')[0];
    var name = h2.innerText.split(" ")[0];

    //console.log(nameBox[0]);

    var vipA = document.createElement('a');
    vipA.href = "/Shop/Popmundo.aspx/VIPInfo";
    vipA.title = name + ", bir VIP üye";

    var vipImg = document.createElement('img');
    vipImg.src = "/Static/Icons/VIPNameStar.png";
    vipImg.className = "lmargin5";
    vipImg.style = "vertical-align: top;";

    vipA.appendChild(vipImg);
    h2.appendChild(vipA);
}

function removeAdds() {

    try{
        document.getElementById("ppm-bottomads").remove();
    }catch(e){}
    try{
        document.getElementById("ppm-sideads").remove();
    }catch(e){}
    try{
        document.getElementById("ctl00_cphLeftColumn_ctl00_repThread_ctl00_divAdHolder").remove();
    }catch(e){}

    var menus= document.getElementById("ppm-sidemenu").getElementsByClassName("box")[0].getElementsByClassName("menu");
    menus[menus.length - 1].innerText = "Kekstralar";
}

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