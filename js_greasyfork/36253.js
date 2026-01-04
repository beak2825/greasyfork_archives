// ==UserScript==
// @name         ProEco-Storage
// @namespace    http://tampermonkey.net/
// @version      0.143
// @description  try to take over the world!
// @author       You
// @match        http://proeconomica.com/profile
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36253/ProEco-Storage.user.js
// @updateURL https://update.greasyfork.org/scripts/36253/ProEco-Storage.meta.js
// ==/UserScript==

window.document.body.onload = Main;

function Main(){

    //Storage Button link fix
    $('#aspectbarBtn')["0"].attributes[2].nodeValue=3;
    $('#personalHygieneBtn')["0"].attributes[2].nodeValue=3;
    $('#houseDesignBtn')["0"].attributes[2].nodeValue=4;
    $('#tehniqueBtn')["0"].attributes[2].nodeValue=4;
    $('#luxuryObjectsBtn')["0"].attributes[2].nodeValue=4;
    //company list expand
    $("#companieshomelist")["0"].style.height="290px";
    $("#contentBottom > div.user-companies.m-t-15")["0"].style.height="334px";

    CheckBonusGoldCards();
    //var Storage_Timer = setInterval(Storage_Upgrade,0.5*1000);//sec,milisec
    var Market_Timer = setInterval(Market_Upgrade,0.5*1000);//sec,milisec
    console.log("Main Loaded");


//not implemented - only for AgeofDragon :P
    //var LLC_Timers = setInterval(Timers,10*1000);//sec,milisec
    //var LLC_CompUpdate = setInterval(F_Company_LLC,10*60*1000);//min,sec,milisec
    
    //var Company_Timer = setInterval(Company_Upgrade,1*1000);//sec,milisec
    //var Spy_Timer = setInterval(CheckSpy,5*60*1000);//min,sec,milisec //4% per hour
    //F_Activity_Start(44);
    //CheckSpy();
}

var csrf_test_token =  $('input[name=csrf_test_token]').val();
//timer
var UpdateTimer = 1000;//in Miliseconds
var UpdateTimer_Fix = 10;
//random Number 1-10
function RandomNumber(){
    return Math.floor((Math.random() * 10) + 1);
}


//function to check if element exists, libary function - DO NOT TOUCH
var arrive=function(e,t,n){"use strict";function r(e,t,n){l.addMethod(t,n,e.unbindEvent),l.addMethod(t,n,e.unbindEventWithSelectorOrCallback),l.addMethod(t,n,e.unbindEventWithSelectorAndCallback)}function i(e){e.arrive=f.bindEvent,r(f,e,"unbindArrive"),e.leave=d.bindEvent,r(d,e,"unbindLeave")}if(e.MutationObserver&&"undefined"!=typeof HTMLElement){var o=0,l=function(){var t=HTMLElement.prototype.matches||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector;return{matchesSelector:function(e,n){return e instanceof HTMLElement&&t.call(e,n)},addMethod:function(e,t,r){var i=e[t];e[t]=function(){return r.length==arguments.length?r.apply(this,arguments):"function"==typeof i?i.apply(this,arguments):n}},callCallbacks:function(e,t){t&&t.options.onceOnly&&1==t.firedElems.length&&(e=[e[0]]);for(var n,r=0;n=e[r];r++)n&&n.callback&&n.callback.call(n.elem,n.elem);t&&t.options.onceOnly&&1==t.firedElems.length&&t.me.unbindEventWithSelectorAndCallback.call(t.target,t.selector,t.callback)},checkChildNodesRecursively:function(e,t,n,r){for(var i,o=0;i=e[o];o++)n(i,t,r)&&r.push({callback:t.callback,elem:i}),i.childNodes.length>0&&l.checkChildNodesRecursively(i.childNodes,t,n,r)},mergeArrays:function(e,t){var n,r={};for(n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);for(n in t)t.hasOwnProperty(n)&&(r[n]=t[n]);return r},toElementsArray:function(t){return n===t||"number"==typeof t.length&&t!==e||(t=[t]),t}}}(),c=function(){var e=function(){this._eventsBucket=[],this._beforeAdding=null,this._beforeRemoving=null};return e.prototype.addEvent=function(e,t,n,r){var i={target:e,selector:t,options:n,callback:r,firedElems:[]};return this._beforeAdding&&this._beforeAdding(i),this._eventsBucket.push(i),i},e.prototype.removeEvent=function(e){for(var t,n=this._eventsBucket.length-1;t=this._eventsBucket[n];n--)if(e(t)){this._beforeRemoving&&this._beforeRemoving(t);var r=this._eventsBucket.splice(n,1);r&&r.length&&(r[0].callback=null)}},e.prototype.beforeAdding=function(e){this._beforeAdding=e},e.prototype.beforeRemoving=function(e){this._beforeRemoving=e},e}(),a=function(t,r){var i=new c,o=this,a={fireOnAttributesModification:!1};return i.beforeAdding(function(n){var i,l=n.target;(l===e.document||l===e)&&(l=document.getElementsByTagName("html")[0]),i=new MutationObserver(function(e){r.call(this,e,n)});var c=t(n.options);i.observe(l,c),n.observer=i,n.me=o}),i.beforeRemoving(function(e){e.observer.disconnect()}),this.bindEvent=function(e,t,n){t=l.mergeArrays(a,t);for(var r=l.toElementsArray(this),o=0;o<r.length;o++)i.addEvent(r[o],e,t,n)},this.unbindEvent=function(){var e=l.toElementsArray(this);i.removeEvent(function(t){for(var r=0;r<e.length;r++)if(this===n||t.target===e[r])return!0;return!1})},this.unbindEventWithSelectorOrCallback=function(e){var t,r=l.toElementsArray(this),o=e;t="function"==typeof e?function(e){for(var t=0;t<r.length;t++)if((this===n||e.target===r[t])&&e.callback===o)return!0;return!1}:function(t){for(var i=0;i<r.length;i++)if((this===n||t.target===r[i])&&t.selector===e)return!0;return!1},i.removeEvent(t)},this.unbindEventWithSelectorAndCallback=function(e,t){var r=l.toElementsArray(this);i.removeEvent(function(i){for(var o=0;o<r.length;o++)if((this===n||i.target===r[o])&&i.selector===e&&i.callback===t)return!0;return!1})},this},s=function(){function e(e){var t={attributes:!1,childList:!0,subtree:!0};return e.fireOnAttributesModification&&(t.attributes=!0),t}function t(e,t){e.forEach(function(e){var n=e.addedNodes,i=e.target,o=[];null!==n&&n.length>0?l.checkChildNodesRecursively(n,t,r,o):"attributes"===e.type&&r(i,t,o)&&o.push({callback:t.callback,elem:i}),l.callCallbacks(o,t)})}function r(e,t){return l.matchesSelector(e,t.selector)&&(e._id===n&&(e._id=o++),-1==t.firedElems.indexOf(e._id))?(t.firedElems.push(e._id),!0):!1}var i={fireOnAttributesModification:!1,onceOnly:!1,existing:!1};f=new a(e,t);var c=f.bindEvent;return f.bindEvent=function(e,t,r){n===r?(r=t,t=i):t=l.mergeArrays(i,t);var o=l.toElementsArray(this);if(t.existing){for(var a=[],s=0;s<o.length;s++)for(var u=o[s].querySelectorAll(e),f=0;f<u.length;f++)a.push({callback:r,elem:u[f]});if(t.onceOnly&&a.length)return r.call(a[0].elem,a[0].elem);setTimeout(l.callCallbacks,1,a)}c.call(this,e,t,r)},f},u=function(){function e(){var e={childList:!0,subtree:!0};return e}function t(e,t){e.forEach(function(e){var n=e.removedNodes,i=[];null!==n&&n.length>0&&l.checkChildNodesRecursively(n,t,r,i),l.callCallbacks(i,t)})}function r(e,t){return l.matchesSelector(e,t.selector)}var i={};d=new a(e,t);var o=d.bindEvent;return d.bindEvent=function(e,t,r){n===r?(r=t,t=i):t=l.mergeArrays(i,t),o.call(this,e,t,r)},d},f=new s,d=new u;t&&i(t.fn),i(HTMLElement.prototype),i(NodeList.prototype),i(HTMLCollection.prototype),i(HTMLDocument.prototype),i(Window.prototype);var h={};return r(f,h,"unbindAllArrive"),r(d,h,"unbindAllLeave"),h}}(window,"undefined"==typeof jQuery?null:jQuery,void 0);


//set value of Food, Aspects, Personal Hygiene, House, Tehnique, Luxury
//auto consume if selected, comfirm PopUp auto press
$(document).arrive("#cart-items", function() { Storage_Upgrade();});
function Storage_Upgrade(){

    var RunCommand =0;
    //get data about button last settings
    if(localStorage.getItem("AutoStorageState") === null){var AutoStorageState =["Auto OFF","#ff0000","False"];localStorage.AutoStorageState = JSON.stringify(AutoStorageState);}
    else{var AutoStorageState = JSON.parse(localStorage.AutoStorageState);}
    //get data about button last settings
    if(localStorage.getItem("AutoStorageBuy") === null){var AutoStorageBuy =["Auto Buy OFF","#ff0000","False"];localStorage.AutoStorageBuy = JSON.stringify(AutoStorageBuy);}
    else{var AutoStorageBuy = JSON.parse(localStorage.AutoStorageBuy);}

    //storage element
    var element =  document.getElementById("cart-items");
    //Check if storage is loaded
    if (typeof(element) != 'undefined' && element !== null){

        //auto check and create button for auto consume
        if(typeof(document.getElementById("openModal")) != 'undefined' && document.getElementById("openModal") !== null){
            var Element;
            createElement("TABLE","","TableInputsStorage","","medium solid #0F00DD","","left","99%","30px","inline-flex","auto","openModal","False","");
            //crate auto consume button
            createElement("input","button","AutoConsume",AutoStorageState[0],"medium solid #000000",AutoStorageState[1],"","50%","100%","","","TableInputsStorage","True",AutoUse);
            createElement("input","button","AutoBuy",AutoStorageBuy[0],"medium solid #000000",AutoStorageBuy[1],"","50%","100%","","","TableInputsStorage","True",AutoBuy);
        }
        //toggle auto CONSUME state On/Off
        function AutoUse(){
            var Element = document.getElementById("AutoConsume");
            var State;
            if(Element.value == "Auto OFF"){Element.value = "Auto ON";Element.style.background="#00ff00"; State="True";}
            else if(Element.value == "Auto ON"){Element.value = "Auto OFF";Element.style.background="#ff0000";State="False";}
            AutoStorageState=[Element.value,Element.style.background, State];
            localStorage.AutoStorageState = JSON.stringify(AutoStorageState);
        }
        //toggle auto BUY state On/Off
        function AutoBuy(){
            var Element = document.getElementById("AutoBuy");
            var State;
            if(Element.value == "Auto Buy OFF"){Element.value = "Auto Buy ON";Element.style.background="#00ff00"; State="True";}
            else if(Element.value == "Auto Buy ON"){Element.value = "Auto Buy OFF";Element.style.background="#ff0000";State="False";}
            AutoStorageBuy=[Element.value,Element.style.background, State];
            localStorage.AutoStorageBuy = JSON.stringify(AutoStorageBuy);
        }

        var selected = $("#search_co_products > div.deposit_menu > div.center > ul")["0"].children;
        //Food Primary, Secondary
        if(selected[0].className=="selected"){
            //PrimFood
            var table = $("#cart-items > table:nth-child(1) > tbody")["0"].children;
            var [SetValue,MaxValue] = $('#primaryFoodHolder > div.ps-info.clear-fix > div')["0"].title.split("<br>")[1].replace(/%/g,'').split(" / ");
            for (i=0; i<table.length; i++){
                var step = [2,1,3,3];
                if(table[i].className=="active" && RunCommand==0){
                    RunCommand=1;
                    var Storage = parseInt(table[i].children[1].innerText); //amount in storage
                    var Mturn = parseInt(table[i].children[2].children[1].innerHTML);//max per turn
                    var value = Math.floor((MaxValue-SetValue)/step[i]);
                    if(value>Mturn){value=Mturn;}
                    if((value-Storage)>0 && AutoStorageBuy[2]=="True"){AutoBuyFunc("1");}
                    if(value>Storage){value=Storage;}
                    if(value===0){$("#"+table[i].id+" > td:nth-child(7) > button")["0"].disabled=true;}
                    table[i].children[3].children.dqty.value = value;
                    if(value!==0 && AutoStorageState[2]=="True"){$("#"+table[i].id+" > td:nth-child(7) > button").click();}
                    RunCommand=0;
                }
            }
            //SecFood
            table = $("#cart-items > table:nth-child(2) > tbody")["0"].children;
            [SetValue,MaxValue] = $('#secondaryFoodHolder > div.ps-info.clear-fix > div')["0"].title.split("<br>")[1].replace(/%/g,'').split(" / ");
            for (i=0; i<table.length; i++){
                var step = [5,5,5,2];
                if(table[i].className=="active" && RunCommand==0){
                    RunCommand=1;
                    var Storage = parseInt(table[i].children[1].innerText); //amount in storage
                    var Mturn = parseInt(table[i].children[2].children[1].innerHTML);//max per turn
                    var value = Math.floor((MaxValue-SetValue)/step[i]);
                    if(value>Mturn){value=Mturn;}
                    if((value-Storage)>0 && AutoStorageBuy[2]=="True"){AutoBuyFunc("2");}
                    if(value>Storage){value=Storage;}
                    if(value===0){$("#"+table[i].id+" > td:nth-child(7) > button")["0"].disabled=true;}
                    table[i].children[3].children.dqty.value = value;
                    if(value!==0 && AutoStorageState[2]=="True"){$("#"+table[i].id+" > td:nth-child(7) > button").click();}
                    RunCommand=0;
                }
            }
        }
        //Aspect,Personal Hygiene
        if(selected[2].className=="selected"){
            //Aspect
            var table = $("#cart-items > table:nth-child(1) > tbody")["0"].children;
            var [SetValue,MaxValue] = $('#aspectbarHolder > div.ps-info.clear-fix > div')["0"].title.split("<br>")[1].replace(/%/g,'').split(" / ");
            for (i=0; i<table.length; i++){
                var step = [15,10];
                if(table[i].className=="active" && RunCommand==0){
                    RunCommand=1;
                    var Storage = parseInt(table[i].children[1].innerText); //amount in storage
                    var Mturn = parseInt(table[i].children[2].children[1].innerHTML);//max per turn
                    var value = Math.floor((MaxValue-SetValue)/step[i]);
                    if(value>Mturn){value=Mturn;}
                    if((value-Storage)>0 && AutoStorageBuy[2]=="True"){AutoBuyFunc("3");}
                    if(value>Storage){value=Storage;}
                    if(value===0){$("#"+table[i].id+" > td:nth-child(7) > button")["0"].disabled=true;}
                    table[i].children[3].children.dqty.value = value;
                    if(value!==0 && AutoStorageState[2]=="True"){$("#"+table[i].id+" > td:nth-child(7) > button").click();}
                    RunCommand=0;
                }
            }
            //Personal Hygiene
            table = $("#cart-items > table:nth-child(2) > tbody")["0"].children;
            [SetValue,MaxValue] = $('#personalHygieneHolder > div.ps-info.clear-fix > div')["0"].title.split("<br>")[1].replace(/%/g,'').split(" / ");
            for (i=0; i<table.length; i++){
                var step = [3];
                if(table[i].className=="active" && RunCommand==0){
                    RunCommand=1;
                    var Storage = parseInt(table[i].children[1].innerText); //amount in storage
                    var Mturn = parseInt(table[i].children[2].children[1].innerHTML);//max per turn
                    var value = Math.floor((MaxValue-SetValue)/step[i]);
                    if(value>Mturn){value=Mturn;}
                    if((value-Storage)>0 && AutoStorageBuy[2]=="True"){AutoBuyFunc("4");}
                    if(value>Storage){value=Storage;}
                    if(value===0){$("#"+table[i].id+" > td:nth-child(7) > button")["0"].disabled=true;}
                    table[i].children[3].children.dqty.value = value;
                    if(value!==0 && AutoStorageState[2]=="True"){$("#"+table[i].id+" > td:nth-child(7) > button").click();}
                    RunCommand=0;
                }
            }
        }
        //House, Tehnique, Luxury
        if(selected[3].className=="selected"){
            //House
            var table = $("#cart-items > table:nth-child(1) > tbody")["0"].children;
            var [SetValue,MaxValue] = $('#houseDesignHolder > div.ps-info.clear-fix > div')["0"].title.split("<br>")[1].replace(/%/g,'').split(" / ");
            for (i=0; i<table.length; i++){
                var step = [25];
                if(table[i].className=="active" && RunCommand==0){
                    RunCommand=1;
                    var Storage = parseInt(table[i].children[1].innerText); //amount in storage
                    var Mturn = parseInt(table[i].children[2].children[1].innerHTML);//max per turn
                    var value = Math.floor((MaxValue-SetValue)/step[i]);
                    if(value>Mturn){value=Mturn;}
                    //if((value-Storage)>0 && AutoStorageBuy[2]=="True"){AutoBuyFunc("5");}
                    if(value>Storage){value=Storage;}
                    if(value===0){$("#"+table[i].id+" > td:nth-child(7) > button")["0"].disabled=true;}
                    table[i].children[3].children.dqty.value = value;
                    if(value!==0 && AutoStorageState[2]=="True"){$("#"+table[i].id+" > td:nth-child(7) > button").click();}
                    RunCommand=0;
                }
            }
            //Tehnique
            table = $("#cart-items > table:nth-child(2) > tbody")["0"].children;
            [SetValue,MaxValue] = $('#tehniqueHolder > div.ps-info.clear-fix > div')["0"].title.split("<br>")[1].replace(/%/g,'').split(" / ");
            for (i=0; i<table.length; i++){
                var step = [25];
                if(table[i].className=="active" && RunCommand==0){
                    RunCommand=1;
                    var Storage = parseInt(table[i].children[1].innerText); //amount in storage
                    var Mturn = parseInt(table[i].children[2].children[1].innerHTML);//max per turn
                    var value = Math.floor((MaxValue-SetValue)/step[i]);
                    if(value>Mturn){value=Mturn;}
                    if((value-Storage)>0 && AutoStorageBuy[2]=="True"){AutoBuyFunc("6");}
                    if(value>Storage){value=Storage;}
                    if(value===0){$("#"+table[i].id+" > td:nth-child(7) > button")["0"].disabled=true;}
                    table[i].children[3].children.dqty.value = value;
                    if(value!==0 && AutoStorageState[2]=="True"){$("#"+table[i].id+" > td:nth-child(7) > button").click();}
                    RunCommand=0;
                }
            }
            //Luxury
            table = $("#cart-items > table:nth-child(3) > tbody")["0"].children;
            [SetValue,MaxValue] = $('#luxuryObjectsHolder > div.ps-info.clear-fix > div')["0"].title.split("<br>")[1].replace(/%/g,'').split(" / ");
            for (i=0; i<table.length; i++){
                var step = [60];
                if(table[i].className=="active" && RunCommand==0){
                    RunCommand=1;
                    var Storage = parseInt(table[i].children[1].innerText); //amount in storage
                    var Mturn = parseInt(table[i].children[2].children[1].innerHTML);//max per turn
                    var value = Math.floor((MaxValue-SetValue)/step[i]);
                    if(value>Mturn){value=Mturn;}
                    //if((value-Storage)>0 && AutoStorageBuy[2]=="True"){AutoBuyFunc("7");}
                    if(value>Storage){value=Storage;}
                    if(value===0){$("#"+table[i].id+" > td:nth-child(7) > button")["0"].disabled=true;}
                    table[i].children[3].children.dqty.value = value;
                    if(value!==0 && AutoStorageState[2]=="True"){$("#"+table[i].id+" > td:nth-child(7) > button").click();}
                    RunCommand=0;
                }
            }
        }
    }
}

function AutoBuyFunc(AutoBuy){
console.log(AutoBuy);
}

//auto click PopUp Window general
$(document).arrive("#press_cancel", function() { PopUp_Close();});
function PopUp_Close(){
    var PopUp_Temp= document.getElementById("press_cancel").className;
    if(PopUp_Temp=="active button_85" || PopUp_Temp=="inactive button_85"){
        document.querySelector("#press_cancel").click();
    }
}

//market upgrade
function Market_Upgrade(){
    //remove/hide special offer
    $(document).arrive(".custom_offers", function() {document.querySelector(".custom_offers").style.display="none";});

    //remove offers from state or players if 0
    var table = $("#search_results_block > table");

    //check if offer has quantity and price over 0
    if(table.length==2){
        for (i=1; i<table["1"].children[0].children.length;i++){
            var Offer = table["1"].children[0].children[i];
            if(Offer.children.length ==(table["1"].children[0].children[0].children.length+1)){
                var Quantity = parseInt(Offer.children[7].innerHTML);
                var Price = parseFloat(Offer.children[6].children[0].innerHTML);
                //remove offer if price or quantity equals 0
                if(Quantity===0 || Price ===0.0){Offer.parentNode.removeChild(Offer);}
            }
        }
        //remove state offer if more offers exists
        if(table["1"].childNodes[1].children.length>2){
            var StateOffer = document.querySelector(".myTableRow1.isStateColor");
            if (typeof(StateOffer) != 'undefined' && StateOffer !== null){StateOffer.parentNode.removeChild(StateOffer);}
        }
    }


    var element = document.getElementById("search_results_block");
    if (typeof(element) != 'undefined' && element !== null){

        var TypeProd=0;
        var pp_move = document.getElementById("pp_moveID");
        if (typeof(pp_move) == 'undefined' || pp_move == null){
            $("#popup_window > div > div.move_header > div > form > div.pp_move").attr('id', 'pp_moveID');
            createElement("input","button","Storage_Market_ID","Storage Food","","","","inherit","inherit","","","pp_moveID","True",callStorage);
        }
        if($('.market_menu')["0"].children["0"].children["0"].children["0"].className=="selected"){
            document.getElementById("Storage_Market_ID").value = "Food Storage";
            document.getElementById("Storage_Market_ID").style.display = "";
        }
        else if($('.market_menu')["0"].children["0"].children["0"].children["2"].className=="selected"){
            document.getElementById("Storage_Market_ID").value = "Aspect Storage";
            document.getElementById("Storage_Market_ID").style.display = "";
        }
        else if($('.market_menu')["0"].children["0"].children["0"].children["3"].className=="selected"){
            document.getElementById("Storage_Market_ID").value = "Household Storage";
            document.getElementById("Storage_Market_ID").style.display = "";
        }
        else{
            document.getElementById("Storage_Market_ID").style.display = "none";
        }
        function callStorage(){
            if($('.market_menu')["0"].children["0"].children["0"].children["0"].className=="selected"){$('#primaryFoodBtn').click();}
            if($('.market_menu')["0"].children["0"].children["0"].children["2"].className=="selected"){$('#aspectbarBtn').click();}
            if($('.market_menu')["0"].children["0"].children["0"].children["3"].className=="selected"){$('#houseDesignBtn').click();}
        }
    }
}


//company upgrade
$(document).arrive("#produseMateriePrima", function() {
    var RawTable = $("#produseMateriePrima > div.lright > table");
    var prodPerDay = parseFloat(document.getElementById("left_per_day").innerHTML);
    var StorageDays = parseInt($(".company_warehouse_level")["0"].innerHTML)+15;
    var prodID = $("#produseMateriePrima > div.lleft")["0"].children["0"].children["0"].children[2].children[1].children["0"].id.split("_")[3];
    var ProdPerDay =parseInt($("#process_product_"+prodID)["0"].children[4].children["0"].value);
    var ProdToBuy=[];

    //calc of raw to buy
    for(i=0;i<5;i++){
        var temp_Raw =[];
        var raw_storage = RawTable["0"].children["0"].children[2+i].children[2].children["0"];
        var Element = document.createElement("output");
        Element.type = "text";
        Element.id = "max_"+raw_storage.id;
        var RawPerProd = parseFloat($("#rm_"+raw_storage.id.split("_")[2])["0"].children[1].value);
        if(ProdPerDay == 1){
            Element.value = Math.floor(RawPerProd*prodPerDay*StorageDays-parseFloat(RawTable["0"].children["0"].children[2+i].children[2].children["0"].innerHTML));
        }
        else{
            Element.value = Math.floor(RawPerProd*StorageDays-parseFloat(RawTable["0"].children["0"].children[2+i].children[2].children["0"].innerHTML));
        }
        temp_Raw.push(raw_storage.id.split("_")[2]);
        temp_Raw.push(Element.value);
        ProdToBuy.push(temp_Raw);
        raw_storage.parentNode.insertBefore(Element, raw_storage);
    }
    //console.log(ProdToBuy);
});

//Check if you can convert Curency to Gold with Cards
function CheckBonusGoldCards(){
    $.ajax ( {
        type: "post",
        url:            base_link+"/bonuscards/confirmation",//"/bonuscards/buy",
        data: {"csrf_test_token":csrf_test_token,"id":9},
        //context:        {arryIdx: K},  //  Object Helps handle K==0, and other things
        success:        processPage,
        complete:       finishUpRequest,
        error:          logError
    } );
    var BonusGoldSteps;
    function processPage (sData, sStatus, jqXHR) {
        //-- Use DOMParser so that images and scripts don't get loaded (like jQuery methods would).
        var BonusGold = sData.split(">")[1].split(" GOLD")[0];
        BonusGoldSteps=BonusGold/5;
    }

    function finishUpRequest (jqXHR, txtStatus) {
        if(BonusGoldSteps>0){
            console.log(BonusGoldSteps);
            CollectBonusGoldCards(BonusGoldSteps);
        }else{console.log(`No Gold Left to Convert with Cards`);}
    }

    function logError (jqXHR, txtStatus, txtError) {
        console.error (`Oopsie at Bonus Gold from Cards!`, txtStatus, txtError, jqXHR);
    }
}
//Convert Curency to Gold with Cards
function CollectBonusGoldCards(K){
    $.ajax ( {
        type: "post",
        url:            base_link+"/bonuscards/buy",
        data: {"csrf_test_token":csrf_test_token,"id":8},
        context:        {arryIdx: K},  //  Object Helps handle K==0, and other things
        success:        processPage,
        complete:       finishUpRequest,
        error:          logError
    } );

    function processPage (sData, sStatus, jqXHR) {
        //-- Use DOMParser so that images and scripts don't get loaded (like jQuery methods would).
        console.log(JSON.parse(sData).message+` for step ${this.arryIdx}...`);
    }
    function finishUpRequest (jqXHR, txtStatus) {
        var nextIdx     = this.arryIdx - 1;
        if(nextIdx>0){
            //-- The setTimeout is seldom needed, but added here per OP's request.
            setTimeout ( function () {
                console.log (`Fetching Gold for step ${nextIdx}...`);
                CollectBonusGoldCards(nextIdx);
            }, UpdateTimer*(RandomNumber(10)));
        }
    }
    function logError (jqXHR, txtStatus, txtError) {
        console.error (`Oopsie at Step ${this.arryIdx} for Gold from Cards!`, txtStatus, txtError, jqXHR);
    }
}

//create Element
function createElement(ElementT,ElementType,ID,Name,border,HexRGB,float,width,hight,display,overflow,ParentID,Insert_Replace,func){
    var Element = document.createElement(ElementT);
    Element.type = ElementType;
    Element.id = ID;
    Element.value = Name;
    Element.style.border=border;
    Element.style.background=HexRGB;
    Element.style.float=float;
    Element.style.width= width;
    Element.style.height=hight;
    Element.style.display = display;
    Element.style.overflow= overflow;
    Element.onclick = func;
    if(Insert_Replace=="True"){document.getElementById(ParentID).appendChild(Element);}
    else{document.getElementById(ParentID).replaceWith(Element);}
    //document.getElementById(ParentID).appendChild(Element);
}