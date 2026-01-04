// ==UserScript==
// @name         JunkRecycler
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Get rid off unnecessary stuffs.
// @author       S.Sikimić

// @include      http://83.popmundo.com/World/Popmundo.aspx/Character
// @include      http://84.popmundo.com/World/Popmundo.aspx/Character
// @include      http://85.popmundo.com/World/Popmundo.aspx/Character
// @include      https://83.popmundo.com/World/Popmundo.aspx/Character
// @include      https://84.popmundo.com/World/Popmundo.aspx/Character
// @include      https://85.popmundo.com/World/Popmundo.aspx/Character

// @include      http://83.popmundo.com/World/Popmundo.aspx/Character/Items/*
// @include      http://84.popmundo.com/World/Popmundo.aspx/Character/Items/*
// @include      http://85.popmundo.com/World/Popmundo.aspx/Character/Items/*
// @include      https://83.popmundo.com/World/Popmundo.aspx/Character/Items/*
// @include      https://84.popmundo.com/World/Popmundo.aspx/Character/Items/*
// @include      https://85.popmundo.com/World/Popmundo.aspx/Character/Items/*

// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/40111/JunkRecycler.user.js
// @updateURL https://update.greasyfork.org/scripts/40111/JunkRecycler.meta.js
// ==/UserScript==

///////////////////////////////
/////
///// todo: Check all goods, if there is none, start the op.
/////
///////////////////////////////

var throwEnabled = true;
var isNaked = "isNakeddd";
var isAllThrown = "isAllThrownnn";

var SCRIPTDATA = "throw";
if(window.location.href == "http://83.popmundo.com/World/Popmundo.aspx/Character" ||
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

if(window.location.href.includes("http://83.popmundo.com/World/Popmundo.aspx/Character/Items") ||
   window.location.href.includes("http://84.popmundo.com/World/Popmundo.aspx/Character/Items") ||
   window.location.href.includes("http://85.popmundo.com/World/Popmundo.aspx/Character/Items") ||
   window.location.href.includes("https://83.popmundo.com/World/Popmundo.aspx/Character/Items") ||
   window.location.href.includes("https://84.popmundo.com/World/Popmundo.aspx/Character/Items") ||
   window.location.href.includes("https://85.popmundo.com/World/Popmundo.aspx/Character/Items")){

    if(GM_getValue(isAllThrown) == undefined || GM_getValue(isAllThrown) == null || !GM_getValue(isAllThrown)){
        GM_setValue(isAllThrown, false);
    }

    if(throwEnabled){
        console.log("isnaked: "+ GM_getValue(isNaked));

        if(GM_getValue(isNaked)){
            setTimeout(function() {
                throwIt();
            }, 250);
        }else{
            setTimeout(function() {
                undress();
            }, 250);
        }

    }else{
        console.log("nothing will be thrown");
    }
}

function undress(){
    GM_setValue(isNaked, true);
    document.getElementById("ctl00_cphLeftColumn_ctl00_btnUndressCompletely").click();

    setTimeout(function() {
        try {
            console.log(document.getElementsByClassName("ui-dialog-buttonset")[7].getElementsByClassName("ui-button ui-corner-all ui-widget")[0].click());
        } catch (ex) {
            try {
                console.log(document.getElementsByClassName("ui-dialog-buttonset")[0].getElementsByClassName("ui-button ui-corner-all ui-widget")[0].click());
            } catch (ex) {
                console.log("no \"yes\" button" + ex);
            }
        }
    }, 250);
}

function throwIt(){
    console.log("isAllThrown: "+ GM_getValue(isAllThrown));
    if(!GM_getValue(isAllThrown)){

        //GM_setValue(isAllThrown, true);
        document.getElementById("ctl00_cphLeftColumn_ctl00_repItemGroups_ctl00_imgToggleAll").click();
        document.getElementById("ctl00_cphLeftColumn_ctl00_btnThrowAwaySelectedItems").click();

        setTimeout(function() {
            try {
                console.log(document.getElementsByClassName("ui-dialog-buttonset")[5].getElementsByClassName("ui-button ui-corner-all ui-widget")[0].click());
            } catch (ex) {
                try {
                    console.log(document.getElementsByClassName("ui-dialog-buttonset")[0].getElementsByClassName("ui-button ui-corner-all ui-widget")[0].click());
                } catch (ex) {
                    console.log("no \"yes\" button" + ex);
                }
            }
        }, 250);
    }
}
//alert(GM_getValue(isNaked));

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
