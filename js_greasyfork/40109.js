// ==UserScript==
// @name         Ad remover
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Reklam kaldırıcı.
// @author       S.Sikimić
// @include      http://83.popmundo.com/*
// @include      http://84.popmundo.com/*
// @include      http://85.popmundo.com/*
// @include      https://83.popmundo.com/*
// @include      https://84.popmundo.com/*
// @include      https://85.popmundo.com/*

// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/40109/Ad%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/40109/Ad%20remover.meta.js
// ==/UserScript==

var SCRIPTDATA = "ad_remover";
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